using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;
using server.Services;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HRInterviewController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IConfiguration cfg;
        private readonly IHttpClientFactory http;
        private readonly EmailService emailService;
        private readonly EmailTemplateService templateService;

        public HRInterviewController(AppDbContext dbContext, IConfiguration cfg, IHttpClientFactory http, EmailService emailService, EmailTemplateService templateService)
        {
            this.dbContext = dbContext;
            this.cfg = cfg;
            this.http = http;
            this.emailService = emailService;
            this.templateService = templateService;
        }

        // Get access token to generate meeting
        private async Task<string> GetAccessToken(string refreshToken)
        {
            var form = new Dictionary<string, string>
            {
                ["client_id"] = cfg["GoogleOAuth:ClientId"]!,
                ["client_secret"] = cfg["GoogleOAuth:ClientSecret"]!,
                ["refresh_token"] = refreshToken,
                ["grant_type"] = "refresh_token"
            };

            var client = http.CreateClient();
            var res = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(form));
            res.EnsureSuccessStatusCode();

            var json = await res.Content.ReadAsStringAsync();
            var token = JsonSerializer.Deserialize<GoogleTokenResponse>(json);
            return token!.access_token;
        }

        // Schedule meeting endpoint
        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleMeeting(ScheduleHRInterviewDto dto)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ensure Google is connected
            var setting = await dbContext.GoogleIntegrationSettings.FirstOrDefaultAsync();
            if (setting == null || string.IsNullOrWhiteSpace(setting.RefreshToken))
            {
                return BadRequest("Google is not connected. Click on Meet Setting and connect Google first.");
            }

            // Get last HR round 
            var lastRound = await dbContext.HRInterviews
                .Where(h => h.JAId == dto.JAId)
                .OrderByDescending(h => h.NoOfRound)
                .FirstOrDefaultAsync();

            var nextRound = (lastRound?.NoOfRound ?? 0) + 1;

            // If last round is not cleared then do not create a meeting
            if (lastRound != null && lastRound.HRIsClear != "Clear")
            {
                return BadRequest("Previous HR round is not marked as Clear. You cannot schedule the next round.");
            }

            // Candidate details
            var candidate = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == dto.UserId);
            if (candidate == null)
                return NotFound("Candidate not found.");

            // Access token
            var accessToken = await GetAccessToken(setting.RefreshToken);

            // Time conversion
            var istZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");
            var startLocal = new DateTime(
                dto.HRDate.Year, dto.HRDate.Month, dto.HRDate.Day,
                dto.HRTime.Hour, dto.HRTime.Minute, 0, DateTimeKind.Unspecified);

            var startUtc = TimeZoneInfo.ConvertTimeToUtc(startLocal, istZone);
            var endUtc = startUtc.AddMinutes(dto.DurationMinutes);

            // Event body
            var eventBody = new
            {
                summary = dto.MeetingSubject,
                description = $"HR Interview Round {nextRound}",
                start = new { dateTime = startUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                end = new { dateTime = endUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                attendees = new[]
                {
                    new { email = candidate.Email, displayName = candidate.FullName },
                    new { email = dto.InterviewerEmail, displayName = dto.InterviewerName }
                },
                conferenceData = new
                {
                    createRequest = new
                    {
                        requestId = Guid.NewGuid().ToString("N"),
                        conferenceSolutionKey = new { type = "hangoutsMeet" }
                    }
                }
            };

            // Create calendar event with meeting
            var createReq = new HttpRequestMessage(
                HttpMethod.Post,
                "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1");

            createReq.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            createReq.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            createReq.Content = new StringContent(JsonSerializer.Serialize(eventBody), Encoding.UTF8, "application/json");

            var client = http.CreateClient();
            var createRes = await client.SendAsync(createReq);

            // If calander is not set show error
            if (!createRes.IsSuccessStatusCode)
            {
                var err = await createRes.Content.ReadAsStringAsync();
                return BadRequest($"Google Calendar error: {err}");
            }

            // Convert google event into JSON
            var resJson = await createRes.Content.ReadAsStringAsync();
            var created = JsonSerializer.Deserialize<GoogleEventCreateResponse>(resJson);

            var meetingLink = created?.conferenceData?.entryPoints?.FirstOrDefault()?.uri;
            var googleEventId = created?.id;

            if (string.IsNullOrWhiteSpace(meetingLink) || string.IsNullOrWhiteSpace(googleEventId))
            {
                return BadRequest("Meeting created but response missing link or event id.");
            }

            var entity = new HRInterview
            {
                JOId = dto.JOId,
                JAId = dto.JAId,
                UserId = dto.UserId,
                MeetingSubject = dto.MeetingSubject,
                HRDate = dto.HRDate,
                HRTime = dto.HRTime,
                MeetingLink = meetingLink,
                InterviewerName = dto.InterviewerName,
                InterviewerEmail = dto.InterviewerEmail,
                NoOfRound = nextRound,
                GoogleEventId = googleEventId,
                CreatedAt = DateTime.UtcNow
            };

            await dbContext.HRInterviews.AddAsync(entity);
            await dbContext.SaveChangesAsync();

            // Candidate Email
            var candidateEmailBody = templateService.HRInterviewCandidateTemplate(
                candidate.FullName,
                nextRound,
                dto.HRDate.ToDateTime(dto.HRTime),
                dto.HRTime.ToString(@"hh\:mm"),
                dto.InterviewerName,
                meetingLink!);

            await emailService.SendEmail(
                candidate.Email,
                $"HR Interview Scheduled - Round {nextRound}",
                candidateEmailBody);

            // Interviewer Email
            var interviewerEmailBody = templateService.HRInterviewInterviewerTemplate(
                dto.InterviewerName,
                candidate.FullName,
                nextRound,
                dto.HRDate.ToDateTime(dto.HRTime),
                dto.HRTime.ToString(@"hh\:mm"),
                meetingLink!);

            await emailService.SendEmail(
                dto.InterviewerEmail,
                $"Interview Assigned - {candidate.FullName} (HR Round {nextRound})",
                interviewerEmailBody);

            return Ok(new
            {
                message = "HR interview scheduled successfully",
                round = nextRound,
                meetingLink,
                googleEventId
            });
        }

        // Fetch candidates who are waiting for HR interview scheduling
        [HttpGet("waitinterview")]
        public async Task<IActionResult> GetAllCandidatesWaitingForHRInterview()
        {
            // Only those still in HR stage
            var jobApps = await dbContext.JobApplications
                .Where(j => j.OverallStatus == "HR Interview")
                .ToListAsync();

            if (!jobApps.Any())
            {
                return NotFound("No candidates pending for HR interview scheduling.");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";
            var result = new List<object>();

            foreach (var app in jobApps)
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == app.UserId);
                var job = await dbContext.JobOpenings.FirstOrDefaultAsync(o => o.JOId == app.JOId);

                // Find last HR round for this JobApplication
                var lastRound = await dbContext.HRInterviews
                    .Where(h => h.JAId == app.JAId)
                    .OrderByDescending(h => h.NoOfRound)
                    .FirstOrDefaultAsync();

                bool include = false;

                if (lastRound == null)
                {
                    include = true;
                }
                else
                {
                    if (lastRound.HRIsClear == "Clear" && lastRound.HRStatus == "In Progress")
                    {
                        include = true;
                    }
                }

                if (!include) continue;

                result.Add(new
                {
                    app.JAId,
                    app.UserId,
                    app.JOId,
                    FullName = user?.FullName,
                    Email = user?.Email,
                    Title = job?.Title,
                    Photo = !string.IsNullOrEmpty(user?.Photo) ? baseUrl + user!.Photo : null,
                    lastRound,
                    Feedback = lastRound?.HRFeedback
                });
            }

            if (!result.Any())
            {
                return NotFound("No candidates waiting for HR interview scheduling.");
            }

            return Ok(result);
        }

        // Get candidates details from hr interview table
        [HttpGet]
        public async Task<IActionResult> GetAllCandidatesfromHRInterview()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var candidates = await dbContext.HRInterviews
                .Select(h => new
                {
                    h.HIId,
                    h.JAId,
                    h.HRDate,
                    h.HRRating,
                    h.NoOfRound,
                    h.HRIsClear,
                    h.HRStatus,
                    Photo = !string.IsNullOrEmpty(h.User.Photo) ? baseUrl + h.User.Photo : null,
                    h.User.FullName,
                    h.User.Email,
                    h.JobOpening.Title,
                    h.JobApplication.OverallStatus
                })
                .ToListAsync();

            return Ok(candidates);
        }

        // Get hr interview by Id
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetHRInterviewById(Guid id)
        {
            var hrin = await dbContext.HRInterviews.FindAsync(id);
            if (hrin == null)
            {
                return BadRequest("HR Interview candidate not found");
            }

            return Ok(hrin);
        }


        private static readonly TimeZoneInfo IstTz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");

        private static DateTime ToUtc(DateOnly d, TimeOnly t)
        {
            var local = new DateTime(d.Year, d.Month, d.Day, t.Hour, t.Minute, 0, DateTimeKind.Unspecified);
            return TimeZoneInfo.ConvertTimeToUtc(local, IstTz);
        }

        private static bool IsMeetingCompleted(DateOnly date, TimeOnly time)
        {
            var nowIst = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, IstTz);
            var meetingDateTime = date.ToDateTime(time);
            return nowIst > meetingDateTime;
        }

        // UpdateGoogleEvent
        private async Task<bool> UpdateGoogleEvent(string accessToken, string eventId, DateOnly d, TimeOnly t, int durationMinutes, string interviewerName, string interviewerEmail, string candidateName, string candidateEmail)
        {
            var startUtc = ToUtc(d, t);
            var endUtc = startUtc.AddMinutes(durationMinutes);

            var body = new
            {
                start = new { dateTime = startUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                end = new { dateTime = endUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                attendees = new[]
                {
                    new { email = candidateEmail, displayName = candidateName },
                    new { email = interviewerEmail, displayName = interviewerName }
                }
            };

            var req = new HttpRequestMessage(new HttpMethod("PATCH"),
                $"https://www.googleapis.com/calendar/v3/calendars/primary/events/{eventId}?conferenceDataVersion=1&sendUpdates=all");

            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            req.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            req.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var client = http.CreateClient();
            var res = await client.SendAsync(req);
            return res.IsSuccessStatusCode;
        }

        // Update HR interview
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateHRInterview(UpdateHRInterviewDto dto, Guid id)
        {
            // Model Validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var entity = await dbContext.HRInterviews
                .Include(h => h.JobApplication)
                .FirstOrDefaultAsync(h => h.HIId == id);

            if (entity == null)
            {
                return NotFound("HRInterview round not found.");
            }

            bool dateGone = IsMeetingCompleted(entity.HRDate, entity.HRTime);

            // Target job application
            var ja = await dbContext.JobApplications.FirstOrDefaultAsync(j => j.JAId == entity.JAId);
            if (ja == null)
            {
                return NotFound("JobApplication not found.");
            }

            switch (dto.HRIsClear)
            {
                case "Pending":

                    // if exam date is not gone the allow to change the meeting details
                    if (!dateGone)
                    {
                        entity.HRDate = dto.HRDate;
                        entity.HRTime = dto.HRTime;
                        entity.MeetingSubject = dto.MeetingSubject;
                        entity.HRFeedback = dto.HRFeedback;
                        entity.InterviewerName = dto.InterviewerName;
                        entity.InterviewerEmail = dto.InterviewerEmail;

                        if (ja.OverallStatus == "Hold")
                        {
                            ja.OverallStatus = ja.HoldOverallStatus ?? "HR Interview";
                            ja.HoldOverallStatus = null;
                        }

                        // Also update Google Calendar via EventId
                        if (!string.IsNullOrWhiteSpace(entity.GoogleEventId))
                        {
                            var setting = await dbContext.GoogleIntegrationSettings.FirstOrDefaultAsync();
                            if (setting == null)
                            {
                                return BadRequest("Google not connected.");
                            }

                            var token = await GetAccessToken(setting.RefreshToken);
                            var cand = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == entity.UserId);

                            // UpdateGoogleEvent and set new event in Calander
                            var ok = await UpdateGoogleEvent(
                                token, entity.GoogleEventId, dto.HRDate, dto.HRTime,
                                60, dto.InterviewerName, dto.InterviewerEmail, cand!.FullName, cand.Email);
                            if (!ok)
                            {
                                return BadRequest("Google event update failed.");
                            }
                        }
                    }
                    else
                    {
                        return BadRequest("Meeting is already completed.");
                    }
                    break;

                case "In Progress":

                    // If exam date is gone
                    if (dateGone)
                    {
                        // Check rating must be null so that we get idea that result is distributed or not
                        if (entity.HRRating == null)
                        {
                            entity.HRIsClear = "In Progress";
                            entity.HRStatus = "In Progress";
                            ja.HoldOverallStatus = null;
                        }
                        else return BadRequest("Result already distributed.");
                    }
                    else return BadRequest("Meeting is not completed yet.");
                    break;

                case "Clear":

                    // Exam date gone
                    if (dateGone)
                    {
                        // HRRating and HRFeedback are required to submit clear
                        if (dto.HRRating == null || string.IsNullOrWhiteSpace(dto.HRFeedback))
                        {
                            return BadRequest("HRRating and HRFeedback are required when marking Clear.");
                        }

                        entity.HRIsClear = "Clear";
                        entity.HRRating = dto.HRRating;
                        entity.HRFeedback = dto.HRFeedback;

                        // Change HRStatus and OverallStatus
                        entity.HRStatus = "In Progress";
                        ja.OverallStatus = "HR Interview";
                        ja.RejectionStage = null;
                    }
                    else return BadRequest("Meeting is not completed yet.");
                    break;

                case "Not Clear":

                    // Exam date must gone
                    if (dateGone)
                    {
                        // HRRating and HRFeedback are required to submit Not Clear
                        if (dto.HRRating == null || string.IsNullOrWhiteSpace(dto.HRFeedback))
                        {
                            return BadRequest("HRRating and HRFeedback are required when marking Not Clear.");
                        }

                        entity.HRIsClear = "Not Clear";
                        entity.HRRating = dto.HRRating;
                        entity.HRFeedback = dto.HRFeedback;

                        // Change HRStatus and OverallStatus
                        entity.HRStatus = "Not Clear";
                        ja.OverallStatus = "Rejected";
                        ja.RejectionStage = "HR";
                        ja.HoldOverallStatus = null;
                    }
                    else return BadRequest("Meeting is not completed yet.");
                    break;
            }

            // Update based on HRStatus
            switch (dto.HRStatus)
            {
                case "Clear":

                    // Exam must gone
                    if (dateGone)
                    {
                        // Check all previous round status is Clear and there is no null values in HRRating and HRFeedback
                        var rounds = await dbContext.HRInterviews
                            .Where(h => h.JAId == entity.JAId)
                            .Select(h => new { h.HRIsClear, h.HRFeedback, h.HRRating })
                            .ToListAsync();

                        var allClear = rounds.Count > 0 &&
                                       rounds.All(r => r.HRIsClear == "Clear" && r.HRRating != null && !string.IsNullOrWhiteSpace(r.HRFeedback));

                        if (!allClear)
                        {
                            return BadRequest("All rounds must be Clear with rating and feedback before final Clear.");
                        }

                        entity.HRStatus = "Clear";
                        ja.OverallStatus = "Document Pending";
                        ja.RejectionStage = null;
                        ja.HoldOverallStatus = null;
                    }
                    else return BadRequest("Meeting is not completed yet.");
                    break;

                case "Hold":

                    if (ja.OverallStatus != "Hold")
                    {
                        ja.HoldOverallStatus = ja.OverallStatus;
                    }
                    entity.HRStatus = "Hold";
                    ja.OverallStatus = "Hold";
                    break;
            }

            entity.UpdatedAt = DateTime.UtcNow;
            ja.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();
            return Ok("HR interview updated.");
        }

        // Fetch candidates form assingned HR
        [Authorize(Roles = "HR")]
        [HttpGet("hr")]
        public async Task<IActionResult> GetInterviewsForHR()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);

            var hrUser = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (hrUser == null)
            {
                return Unauthorized("HR user record not found.");
            }

            var hrEmail = hrUser.Email;
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            // Fetch all HR interviews assigned to this HR user
            var interviews = await dbContext.HRInterviews
                .Include(h => h.User)
                .Include(h => h.JobOpening)
                .Include(h => h.JobApplication)
                .Where(h => h.InterviewerEmail == hrEmail)
                .OrderBy(h => h.HRDate)
                .ThenBy(h => h.HRTime)
                .Select(h => new
                {
                    h.HIId,
                    h.NoOfRound,
                    h.HRDate,
                    h.HRTime,
                    h.MeetingLink,
                    h.HRIsClear,
                    h.HRStatus,
                    h.HRRating,
                    h.HRFeedback,
                    Photo = !string.IsNullOrWhiteSpace(h.User.Photo) ? baseUrl + h.User.Photo : null,
                    UserId = h.User.UserId,
                    JAId = h.JobApplication.JAId,
                    FullName = h.User.FullName,
                    Email = h.User.Email,
                    Title = h.JobOpening.Title,
                    OverallStatus = h.JobApplication.OverallStatus
                })
                .ToListAsync();

            return Ok(interviews);
        }

        // Get token response
        public class GoogleTokenResponse
        {
            public string access_token { get; set; } = default!;
            public int expires_in { get; set; }
            public string scope { get; set; } = default!;
            public string token_type { get; set; } = default!;
        }

        // Get event create response
        public class GoogleEventCreateResponse
        {
            public string id { get; set; } = default!;
            public ConferenceData? conferenceData { get; set; }
        }

        // Get conference Data
        public class ConferenceData
        {
            public List<EntryPoint>? entryPoints { get; set; }
        }

        // Get meeting ID
        public class EntryPoint            
        {
            public string? uri { get; set; }
        }
    }
}
