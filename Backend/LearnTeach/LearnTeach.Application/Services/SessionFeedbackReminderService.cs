using LearnTeach.Application.IServices;
using LearnTeach.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class SessionFeedbackReminderService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1);
        private readonly TimeSpan _reminderDelay = TimeSpan.FromMinutes(10);

        public SessionFeedbackReminderService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();

                    var sessionRepo = scope.ServiceProvider.GetRequiredService<IRepository<Session>>();
                    var feedbackRepo = scope.ServiceProvider.GetRequiredService<IRepository<Usersessionfeedback>>();
                    var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                    var userRepo = scope.ServiceProvider.GetRequiredService<IRepository<Usersprofile>>();

                    var now = DateTime.UtcNow;

                    var sessions = await sessionRepo.Query()
                        .Include(s => s.Teacher)
                        .Include(s => s.Learner)
                        .Where(s => s.ScheduleEnd <= now - _reminderDelay)
                        .ToListAsync(stoppingToken);

                    foreach (var session in sessions)
                    {

                        bool teacherRated = await feedbackRepo.Query()
                            .AnyAsync(f => f.SessionId == session.Sessionid && f.RatedByUserId == session.TeacherId, stoppingToken);


                        bool learnerRated = await feedbackRepo.Query()
                            .AnyAsync(f => f.SessionId == session.Sessionid && f.RatedByUserId == session.LearnerId, stoppingToken);


                        if (!teacherRated && !session.TeacherReminderSent)
                        {
                            var title = "Reminder: Please rate the session";
                            var details = $"The session '{session.SessionTitle}' It ended more than 10 minutes ago. Please evaluate the student.";

                            await notificationService.NotifyAsync(
                                session.TeacherId,
                                title,
                                details,
                                "Feedback",
                                session.Sessionid,
                                "",
                                null
                            );

                            session.TeacherReminderSent = true;
                            sessionRepo.Update(session);
                        }

                        if (!learnerRated && !session.LearnerReminderSent)
                        {
                            var title = "Reminder: Please rate the session";
                            var details = $"The session '{session.SessionTitle}'It ended more than 10 minutes ago. Please rate the teacher.";

                            await notificationService.NotifyAsync(
                                session.LearnerId,
                                title,
                                details,
                                "Feedback",
                                session.Sessionid,
                                "",
                                null
                            );

                            session.LearnerReminderSent = true;
                            sessionRepo.Update(session);
                        }


                    }

                    await sessionRepo.SaveChangesAsync();
                }
                catch (OperationCanceledException) { }
                catch (Exception ex)
                {

                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }
    }
}