
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Entities;

namespace server.Services
{
    public class EmployeeJoiningScheduler : BackgroundService
    {
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<EmployeeJoiningScheduler> logger;

        public EmployeeJoiningScheduler(IServiceProvider serviceProvider, ILogger<EmployeeJoiningScheduler> logger)
        {
            this.serviceProvider = serviceProvider;
            this.logger = logger;
        }

        // Use BackGround Service abstract class
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Employee Joining Scheduler started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessJoinings(stoppingToken);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error in ProcessJoiningsAsync.");
                }

                // Schedule for tomorrow 00:01 AM every day
                var nextRun = DateTime.Today.AddDays(1).AddHours(0).AddMinutes(1);
                var delay = nextRun - DateTime.Now;

                if (delay < TimeSpan.Zero)
                    delay = TimeSpan.FromHours(24);

                logger.LogInformation($"Next run at: {nextRun}");

                try
                {
                    await Task.Delay(delay, stoppingToken);
                }
                catch
                {
                    break;
                }
            }
        }

        // Process candidates whose joining date arrive
        private async Task ProcessJoinings(CancellationToken token)
        {
            // Add scoped directly
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var today = DateTime.Today;

            logger.LogInformation($"Checking joinings for {today:dd-MMM-yyyy}");

            // Check Offer Letter data for verification
            var offers = await dbContext.OfferLetters
                .Where(o =>
                    o.OfferLetterStatus == "Accepted" &&
                    o.TemplateType == "Job" &&
                    o.JoiningDate.Date == today
                )
                .ToListAsync(token);

            if (!offers.Any())
            {
                logger.LogInformation("No employees joining today.");
                return;
            }

            logger.LogInformation($"Found {offers.Count} offers to process.");

            foreach (var offer in offers)
            {
                if (token.IsCancellationRequested) break;

                try
                {
                    // Check if candidate already not exist
                    if (await dbContext.Employees.AnyAsync(e => e.UserId == offer.UserId, token))
                    {
                        logger.LogInformation($"Employee already exists for user {offer.UserId} Skip");
                        continue;
                    }

                    var user = await dbContext.Users
                        .FirstOrDefaultAsync(u => u.UserId == offer.UserId, token);

                    // Offer Letter check
                    if (user == null)
                    {
                        logger.LogWarning($"User not found for OfferLetter {offer.OLId}");
                        continue;
                    }

                    var job = await dbContext.JobOpenings
                        .FirstOrDefaultAsync(j => j.JOId == offer.JOId, token);

                    var docs = await dbContext.DocumentLists
                        .FirstOrDefaultAsync(d => d.UserId == offer.UserId && d.JAId == offer.JAId, token);

                    if (docs == null)
                    {
                        logger.LogWarning($"Missing DocumentList for User {offer.UserId} Skip");
                        continue;
                    }

                    // All fine then add all data into Emlpoyee Table
                    var employee = new Employee
                    {
                        EmployeeId = Guid.NewGuid(),
                        UserId = user.UserId,

                        FullName = user.FullName,
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        City = user.City,

                        JobTitle = job?.Title ?? "Unknown",

                        EmployeeType = "Job",
                        JoiningDate = offer.JoiningDate,
                        Salary = offer.Salary,

                        BankName = docs.BankName,
                        BankAccNo = docs.BankAccNo,
                        BankIFSC = docs.BankIFSC,

                        EmploymentStatus = "Active",
                        CreatedAt = DateTime.UtcNow
                    };

                    await dbContext.Employees.AddAsync(employee, token);
                    await dbContext.SaveChangesAsync(token);

                    logger.LogInformation($"Employee created: {employee.EmployeeId} for user {user.UserId}");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, $"Failed to process OfferLetter {offer.OLId}");
                }
            }
        }
    }
}
