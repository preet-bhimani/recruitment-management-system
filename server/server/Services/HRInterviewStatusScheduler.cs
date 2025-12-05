using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Services
{
    public class HRInterviewStatusScheduler : BackgroundService
    {
        private readonly IServiceProvider provider;
        private readonly ILogger<HRInterviewStatusScheduler> logger;

        public HRInterviewStatusScheduler(IServiceProvider provider, ILogger<HRInterviewStatusScheduler> logger)
        {
            this.provider = provider;
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("HRInterviewStatusScheduler started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await UpdateHRInterviewStatuses(stoppingToken);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error while updating HR interview statuses.");
                }

                // Check every 1 minute
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        // Update HR Interview Status
        private async Task UpdateHRInterviewStatuses(CancellationToken token)
        {
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var now = DateTime.Now;

            // Get all HR interviews where HRIsClear is Pending
            var interviews = await db.HRInterviews
                .Where(h => h.HRIsClear == "Pending")
                .ToListAsync(token);

            foreach (var i in interviews)
            {
                // Start time
                var start = i.HRDate.ToDateTime(i.HRTime);

                // End time
                var end = start.AddHours(2);

                if (now >= end)
                {
                    i.HRIsClear = "In Progress";
                    i.HRStatus = "In Progress";
                    i.UpdatedAt = DateTime.Now;

                    logger.LogInformation($"HR Interview {i.HIId} auto-updated to 'In Progress'.");
                }
            }

            await db.SaveChangesAsync(token);
        }
    }
}
