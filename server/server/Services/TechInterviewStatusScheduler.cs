using Microsoft.EntityFrameworkCore;
using server.Data;

namespace server.Services
{
    public class TechInterviewStatusScheduler : BackgroundService
    {
        private readonly IServiceProvider provider;
        private readonly ILogger<TechInterviewStatusScheduler> logger;

        public TechInterviewStatusScheduler(IServiceProvider provider, ILogger<TechInterviewStatusScheduler> logger)
        {
            this.provider = provider;
            this.logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("TechInterviewStatusScheduler started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await UpdateInterviewStatuses(stoppingToken);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error while updating technical interview statuses.");
                }

                // Check every 1 minute
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        // Update InterviewStatus
        private async Task UpdateInterviewStatuses(CancellationToken token)
        {
            using var scope = provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var now = DateTime.Now;

            var interviews = await db.TechnicalInterviews
                .Where(t => t.TechIsClear == "Pending")
                .ToListAsync(token);

            foreach (var i in interviews)
            {
                // Start time
                var start = i.TechDate.ToDateTime(i.TechTime);

                // Start time + 2 hour
                var end = start.AddHours(2);

                if (now >= end)
                {
                    i.TechIsClear = "In Progress";
                    i.TechStatus = "In Progress";
                    i.UpdatedAt = DateTime.Now;

                    logger.LogInformation($"Interview {i.TIId} auto-updated to 'In Progress'.");
                }
            }
            await db.SaveChangesAsync(token);
        }
    }
}
