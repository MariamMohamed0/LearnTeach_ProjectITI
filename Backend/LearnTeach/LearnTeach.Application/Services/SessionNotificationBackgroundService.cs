using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class SessionNotificationBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SessionNotificationBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        Console.WriteLine("SessionNotificationBackgroundService started...");

        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var sessionRepo = scope.ServiceProvider.GetRequiredService<IRepository<Session>>();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                var now = DateTime.UtcNow; 

                var sessions = sessionRepo.Query().ToList();

                foreach (var session in sessions)
                {
                    if (session.Status == "Completed") continue;

                    var sessionStart = session.ScheduleStart; 
                    var sessionEnd = session.ScheduleEnd;     

                    // تحديث الحالة
                    if (now < sessionStart) session.Status = "Scheduled";
                    else if (now >= sessionStart && now <= sessionEnd) session.Status = "Ongoing";
                    else session.Status = "Completed";

                    Console.WriteLine($"Session {session.Sessionid}: Now={now}, Start={sessionStart}, End={sessionEnd}, Status={session.Status}");

                
                    var minutesToStart = (sessionStart - now).TotalMinutes;
                    var minutesSinceStart = (now - sessionStart).TotalMinutes;
                    var minutesSinceEnd = (now - sessionEnd).TotalMinutes;

            
                    if (minutesToStart <= 15 && minutesToStart > 0 && !session.UpcomingNotificationSent)
                    {
                        await SendNotification(session, notificationService, "upcoming 🚩", $"Your {session.SessionTitle} session will begin in less than 15 minutes.!");
                        session.UpcomingNotificationSent = true;
                    }

             
                    if (minutesSinceStart >= 0 && minutesSinceStart < 5 && !session.StartedNotificationSent)
                    {
                        await SendNotification(session, notificationService, "started ⏰ ", $"Your {session.SessionTitle} session has started!");
                        session.StartedNotificationSent = true;
                    }

      
                    if (minutesSinceEnd >= 0 && minutesSinceEnd < 5 && !session.EndedNotificationSent)
                    {
                        await SendNotification(session, notificationService, "ended 🏁", $"Your {session.SessionTitle} session has ended!");
                        session.EndedNotificationSent = true;
                    }
                }

                await sessionRepo.SaveChangesAsync();
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }
    }

    private static async Task SendNotification(Session session, INotificationService notificationService, string type, string message)
    {
        await notificationService.NotifyAsync(
            session.TeacherId,
            $"Session {type}",
            message,
            "Session",
            session.Sessionid,
            session.ZoomJoinUrl,
            session.TeacherId
        );

        await notificationService.NotifyAsync(
            session.LearnerId,
            $"Session {type}",
            message,
            "Session",
            session.Sessionid,
            session.ZoomJoinUrl,
            session.TeacherId
        );
    }
}