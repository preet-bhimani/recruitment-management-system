using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Dto;
using server.Models.Entities;
using server.Services;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicalInterviewController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly IHttpClientFactory http;
        private readonly IConfiguration cfg;
        private readonly EmailService emailService;
        private readonly EmailTemplateService templateService;

        public TechnicalInterviewController(AppDbContext dbContext, IHttpClientFactory http, IConfiguration cfg, EmailService emailService, EmailTemplateService templateService)
        {
            this.dbContext = dbContext;
            this.http = http;
            this.cfg = cfg;
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
        [Authorize(Roles = "Admin,Recruiter")]
        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleMeeting(ScheduleTechnicalInterviewDto stiDto)
        {
            // Model validation
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            // Ensure Google is connected
            var setting = await dbContext.GoogleIntegrationSettings.FirstOrDefaultAsync();
            if (setting == null || string.IsNullOrWhiteSpace(setting.RefreshToken))
            {
                return BadRequest("Google is not connected. Click on Meet Setting and connect Google first.");
            }

            // Get last round if there
            var lastRoundCheck = await dbContext.TechnicalInterviews
                .Where(t => t.JAId == stiDto.JAId)
                .OrderByDescending(t => t.NoOfRound)
                .FirstOrDefaultAsync();

            // If last round is not cleared then do not create a meeting
            var nextRound = (lastRoundCheck?.NoOfRound ?? 0) + 1;
            if (lastRoundCheck != null && lastRoundCheck.TechIsClear != "Clear")
            {
                return BadRequest("Previous round is not marked as Clear. You cannot schedule the next round.");
            }

            // Get candidate details
            var candidate = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == stiDto.UserId);
            if (candidate == null)
            {
                return NotFound("Candidate not found.");
            }

            // Get access token from abive GetAccessToken method
            var accessToken = await GetAccessToken(setting.RefreshToken);

            // Basic info for meeting schedule
            var istZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");

            var startLocal = new DateTime(
                stiDto.TechDate.Year, stiDto.TechDate.Month, stiDto.TechDate.Day,
                stiDto.TechTime.Hour, stiDto.TechTime.Minute, 0, DateTimeKind.Unspecified
            );

            var startUtc = TimeZoneInfo.ConvertTimeToUtc(startLocal, istZone);
            var endUtc = startUtc.AddMinutes(stiDto.DurationMinutes);

            // Create event body for meeting
            var eventBody = new
            {
                summary = stiDto.MeetingSubject,
                description = $"Technical Interview Round {nextRound}",
                start = new { dateTime = startUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                end = new { dateTime = endUtc.ToString("yyyy-MM-ddTHH:mm:ssZ"), timeZone = "Asia/Kolkata" },
                attendees = new[]
                    {
                        new { email = candidate.Email, displayName = candidate.FullName },
                        new { email = stiDto.InterviewerEmail, displayName = stiDto.InterviewerName }
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

            // Create request for event in calander
            var createReq = new HttpRequestMessage(
                    HttpMethod.Post,
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1");

            createReq.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            createReq.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
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

            var entity = new TechnicalInterview
            {
                JOId = stiDto.JOId,
                JAId = stiDto.JAId,
                UserId = stiDto.UserId,
                MeetingSubject = stiDto.MeetingSubject,
                TechDate = stiDto.TechDate,
                TechTime = stiDto.TechTime,
                MeetingLink = meetingLink,
                InterviewerName = stiDto.InterviewerName,
                InterviewerEmail = stiDto.InterviewerEmail,
                NoOfRound = nextRound,
                GoogleEventId = googleEventId,
                CreatedAt = DateTime.UtcNow
            };

            await dbContext.TechnicalInterviews.AddAsync(entity);
            await dbContext.SaveChangesAsync();


            // Candidate Email
            var candidateEmailBody = templateService.TechnicalInterviewCandidateTemplate(
                candidate.FullName,
                nextRound,
                stiDto.TechDate.ToDateTime(stiDto.TechTime),
                stiDto.TechTime.ToString(@"hh\:mm"),
                stiDto.InterviewerName,
                meetingLink);

            await emailService.SendEmail(candidate.Email,
                $"Technical Interview Scheduled - Round {nextRound}",
                candidateEmailBody);

            // Interviewer Email
            var interviewerEmailBody = templateService.TechnicalInterviewInterviewerTemplate(
                stiDto.InterviewerName,
                candidate.FullName,
                nextRound,
                stiDto.TechDate.ToDateTime(stiDto.TechTime),
                stiDto.TechTime.ToString(@"hh\:mm"),
                meetingLink);

            await emailService.SendEmail(stiDto.InterviewerEmail,
                $"Interview Assigned - {candidate.FullName} (Round {nextRound})",
                interviewerEmailBody);

            return Ok(new
            {
                message = "Technical interview scheduled successfully",
                round = nextRound,
                meetingLink,
                googleEventId
            });
        }

        // Fetch candidate whose overallstatus is Technical Interview
        [Authorize(Roles = "Admin")]
        [HttpGet("waitinterview")]
        public async Task<IActionResult> GetAllCandidatesIsTechnicalInterview()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            // Fetch candidates whoes OverallStatus is Technical Interview
            var candidates = await dbContext.JobApplications
                .Where(j => j.OverallStatus == "Technical Interview")
                .Select(j => new
                {
                    j.JAId,
                    j.UserId,
                    j.JOId,
                    j.OverallStatus,
                })
                .ToListAsync();

            if (!candidates.Any())
            {
                return NotFound("No candidates pending for technical interview scheduling.");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var result = new List<object>();

            foreach (var item in candidates)
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == item.UserId);
                var job = await dbContext.JobOpenings.FirstOrDefaultAsync(o => o.JOId == item.JOId);

                // Find last round
                var lastRound = await dbContext.TechnicalInterviews
                    .Where(t => t.JAId == item.JAId)
                    .OrderByDescending(t => t.NoOfRound)
                    .FirstOrDefaultAsync();

                bool include = false;

                if (lastRound == null)
                {
                    include = true;
                }
                else
                {
                    if (lastRound.TechIsClear == "Clear" && lastRound.TechStatus == "In Progress")
                    {
                        include = true;
                    }
                }

                if (!include) continue;

                // Add data into result list
                result.Add(new
                {
                    item.JAId,
                    item.UserId,
                    item.JOId,
                    FullName = user?.FullName,
                    Email = user?.Email,
                    Title = job?.Title,
                    Photo = !string.IsNullOrEmpty(user.Photo) ? baseUrl + user.Photo : null,
                   LastRound = lastRound?.NoOfRound,
                });
            }

            return Ok(result);
        }

        // Get candidates details from technical interview table
        [Authorize(Roles = "Admin,Recruiter,Viewer,Interviewer")]
        [HttpGet]
        public async Task<IActionResult> GetAllCandidatesfromTechnicalInterview()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var candidates = await dbContext.TechnicalInterviews
                .Select(c => new
                {
                    c.TIId,
                    c.TechDate,
                    c.TechRating,
                    c.NoOfRound,
                    c.TechIsClear,
                    c.TechStatus,
                    Photo = !string.IsNullOrEmpty(c.User.Photo) ? baseUrl + c.User.Photo : null,
                    c.User.FullName,
                    c.User.Email,
                    c.JobApplication.JAId,
                    c.JobOpening.Title,
                    c.JobApplication.OverallStatus,
                    c.JobApplication.RejectionStage,
                    c.JobApplication.HoldOverallStatus,
                })
                .ToListAsync();

            return Ok(candidates);
        }

        // Get technical interview by Id
        [Authorize(Roles = "Admin,Recruiter,Viewer,Interviewer")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetTechnicalInterviewById(Guid id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            var techin = await dbContext.TechnicalInterviews
                .Where(t => t.TIId == id)
                .Include(t => t.User)
                .Include(t => t.JobOpening)
                .Select(t => new
                {
                    t.TIId,
                    t.UserId,
                    t.JOId,
                    t.JAId,
                    t.InterviewerName,
                    t.InterviewerEmail,
                    t.TechDate,
                    t.TechTime,
                    t.TechFeedback,
                    t.MeetingSubject,
                    t.MeetingLink,
                    t.NoOfRound,
                    t.TechRating,
                    t.TechIsClear,
                    t.TechStatus,
                    Photo = !string.IsNullOrEmpty(t.User.Photo) ? baseUrl + t.User.Photo : null,
                    t.User.FullName,
                    t.User.Email,
                    t.JobOpening.Title
                })
                .FirstOrDefaultAsync();

            if ( techin == null)
            {
                return BadRequest("Technical Interview candidate not found");
            }

            return Ok(techin);
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

        // Change Google event as per update meeting
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

        // Update technical interview
        [Authorize(Roles = "Admin,Recruiter,Interviewer")]
        [HttpPut("update/{id:guid}")]
        public async Task<IActionResult> UpdateTechnicalInterview(UpdateTechnicalInterviewDto utDto, Guid id)
        {
            // Model validation
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found");
            }

            var entity = await dbContext.TechnicalInterviews
                .Include(t => t.JobApplication)
                .FirstOrDefaultAsync(t => t.TIId == id);

            if (entity == null)
            {
                return NotFound("TechnicalInterview round not found.");
            }

            // Check exam date is gone or not?
            bool dateGone = IsMeetingCompleted(entity.TechDate, entity.TechTime); 

            // Find job application
            var ja = await dbContext.JobApplications.FirstOrDefaultAsync(j => j.JAId == entity.JAId);
            if (ja == null) return NotFound("JobApplication not found.");

            // Update based on TechIsClear
            switch (utDto.TechIsClear)
            {
                case "Pending":

                    // if exam date is not gone the allow to change the meeting details
                    if (!dateGone)
                    {
                        // Update DB fields
                        entity.TechDate = utDto.TechDate;
                        entity.TechTime = utDto.TechTime;
                        entity.MeetingSubject = utDto.MeetingSubject;
                        entity.TechFeedback = utDto.TechFeedback;
                        entity.InterviewerName = utDto.InterviewerName;
                        entity.InterviewerEmail = utDto.InterviewerEmail;

                        if (ja.OverallStatus == "Hold")
                        {
                            ja.OverallStatus = ja.HoldOverallStatus ?? "Technical Interview";
                            ja.HoldOverallStatus = null;
                        }

                        // Also update Google Calendar via EventId
                        if (!string.IsNullOrWhiteSpace(entity.GoogleEventId))
                        {
                            // Find token in DB
                            var setting = await dbContext.GoogleIntegrationSettings.FirstOrDefaultAsync();
                            if (setting == null)
                            { 
                                return BadRequest("Google not connected.");
                            }
                            var token = await GetAccessToken(setting.RefreshToken);
                            var cand = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == entity.UserId);

                            // UpdateGoogleEvent and set new event in Calander
                            var ok = await UpdateGoogleEvent(token, entity.GoogleEventId, utDto.TechDate, utDto.TechTime, 120, utDto.InterviewerName, utDto.InterviewerEmail, cand.FullName, cand.Email);
                            if (!ok)
                            {
                                return BadRequest("Google event update failed.");
                            }
                        }
                    }
                    else
                    {
                        return BadRequest("Meeting is already completed. Cannot change date/time or interviewer.");
                    }
                    break;

                case "In Progress":

                    // If exam date is gone
                    if (dateGone)
                    {
                        // Check rating must be null so that we get idea that result is distributed or not
                        if (entity.TechRating == null)
                        {
                            entity.TechIsClear = "In Progress";
                            entity.TechStatus = "In Progress";
                            ja.HoldOverallStatus = null;
                            ja.OverallStatus = "Technical Interview";
                        }
                        else
                        {
                            return BadRequest("Result already distributed.");
                        }
                    }
                    else
                    {
                        return BadRequest("Meeting is not completed yet.");
                    }
                    break;

                case "Clear":

                    // Exam date gone
                    if (dateGone)
                    {
                        // TechRating and TechFeedback are required to submit clear
                        if (utDto.TechRating == null || string.IsNullOrWhiteSpace(utDto.TechFeedback))
                        {
                            return BadRequest("TechRating and TechFeedback are required when marking Clear.");
                        }

                        entity.TechIsClear = "Clear";
                        entity.TechRating = utDto.TechRating;
                        entity.TechFeedback = utDto.TechFeedback;

                        // Change TechStatus and OverallStatus
                        entity.TechStatus = "In Progress";
                        ja.RejectionStage = null;
                        ja.OverallStatus = "Technical Interview";
                    }
                    else
                    {
                        return BadRequest("Meeting is not completed yet.");
                    }
                    break;

                case "Not Clear":

                    // Exam date must gone
                    if (dateGone)
                    {
                        // TechRating and TechFeedback are required to submit Not Clear
                        if (utDto.TechRating == null || string.IsNullOrWhiteSpace(utDto.TechFeedback))
                        {
                            return BadRequest("TechRating and TechFeedback are required when marking Not Clear.");
                        }

                        entity.TechIsClear = "Not Clear";
                        entity.TechRating = utDto.TechRating;
                        entity.TechFeedback = utDto.TechFeedback;

                        // Change TechStatus and OverallStatus
                        entity.TechStatus = "Not Clear";
                        ja.RejectionStage = "Technical Interview";
                        ja.OverallStatus = "Rejected";
                        ja.HoldOverallStatus = null;
                    }
                    else
                    {
                        return BadRequest("Meeting is not completed yet.");
                    }
                    break;

                case "Hold":

                    if (ja.OverallStatus != "Hold")
                    {
                        ja.HoldOverallStatus = ja.OverallStatus;
                    }
                    entity.TechIsClear = "Hold";
                    ja.OverallStatus = "Hold";
                    break;

                default:
                    break;
            }

            // Update based on TechStatus
            switch (utDto.TechStatus)
            {
                case "Clear":

                    // Exam must gone
                    if (dateGone)
                    {
                        // Check all previous round status is Clear and there is no null values in TechRating and TechFeedback
                        var rounds = await dbContext.TechnicalInterviews
                            .Where(t => t.JAId == entity.JAId)
                            .Select(t => new { t.TechIsClear, t.TechFeedback, t.TechRating })
                            .ToListAsync();

                        var allClear = rounds.Count > 0 && rounds.All(r => r.TechIsClear == "Clear" && r.TechRating != null && !string.IsNullOrWhiteSpace(r.TechFeedback));
                        if (!allClear) return BadRequest("All rounds must be Clear with rating and feedback before final Clear.");

                        entity.TechStatus = "Clear";
                        ja.RejectionStage = null;
                        ja.OverallStatus = "HR Interview";
                        ja.HoldOverallStatus = null;
                    }
                    else
                    {
                        return BadRequest("Meeting is not completed yet.");
                    }
                    break;

                default:
                    break;
            }

            entity.UpdatedAt = DateTime.UtcNow;
            ja.UpdatedAt = DateTime.UtcNow;

            await dbContext.SaveChangesAsync();
            return Ok("Technical interview updated.");
        }

        // Get all technical interviews assigned to the logged-in interviewer
        [Authorize(Roles = "Interviewer")]
        [HttpGet("interviewer")]
        public async Task<IActionResult> GetInterviewsForInterviewer()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("Invalid token. User ID not found.");
            }

            var userId = Guid.Parse(userIdClaim);

            // Find the interviewer in User table
            var interviewer = await dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (interviewer == null)
            {
                return Unauthorized("Interviewer record not found.");
            }

            var interviewerEmail = interviewer.Email;
            var baseUrl = $"{Request.Scheme}://{Request.Host}/User_Upload_Photos/";

            // Fetch all interviews assigned to this interviewer
            var interviews = await dbContext.TechnicalInterviews
                .Include(t => t.User)
                .Include(t => t.JobOpening)
                .Where(t => t.InterviewerEmail == interviewerEmail)
                .OrderBy(t => t.TechDate)
                .ThenBy(t => t.TechTime)
                .Select(t => new
                {
                    t.TIId,
                    t.UserId,
                    t.JAId,
                    t.NoOfRound,
                    t.TechDate,
                    t.TechTime,
                    t.MeetingLink,
                    t.TechIsClear,
                    t.TechStatus,
                    t.TechRating,
                    t.TechFeedback,
                    t.InterviewerEmail,
                    FullName = t.User.FullName,
                    Email = t.User.Email,
                    Photo = !string.IsNullOrWhiteSpace(t.User.Photo) ? baseUrl + t.User.Photo : null,
                    Title = t.JobOpening.Title
                })
                .ToListAsync();

            return Ok(interviews);
        }

        // Get token response
        public class GoogleTokenResponse
        {
            public string access_token { get; set; }
            public int expires_in { get; set; }
            public string token_type { get; set; }
        }

        // Get event create response
        public class GoogleEventCreateResponse
        {
            public string id { get; set; }
            public ConferenceData conferenceData { get; set; }
        }

        // Get conference Data
        public class ConferenceData
        {
            public EntryPoint[] entryPoints { get; set; }
        }

        // Get meeting ID
        public class EntryPoint
        {
            public string uri { get; set; }
        }
    }
}
