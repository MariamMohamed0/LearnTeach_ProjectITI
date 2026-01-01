
using System;
using System.Collections.Generic;

namespace LearnTeach.Domain.Models;

public partial class Session
{
    public int Sessionid { get; set; }

    public string SessionTitle { get; set; } = null!;

    public DateTime ScheduleStart { get; set; }

    public DateTime ScheduleEnd { get; set; }

    public string Status { get; set; } = "Scheduled";

    public DateTime? CreatedAt { get; set; }

    public int TeacherId { get; set; }

    public int LearnerId { get; set; }

    public int SkillId { get; set; }

    //Zoom SDK
    public string? ZoomMeetingId { get; set; }
    public string? ZoomJoinUrl { get; set; }




    //Notify SessionFeedback
    public bool TeacherReminderSent { get; set; } = false;
    public bool LearnerReminderSent { get; set; } = false;
    public bool UpcomingNotificationSent { get; set; } = false;
    public bool StartedNotificationSent { get; set; } = false;
    public bool EndedNotificationSent { get; set; } = false;


    //Points(when both join Session)
    public bool TeacherJoined { get; set; }
    public bool StudentJoined { get; set; }
    public bool PointsApplied { get; set; }




    public virtual Usersprofile Learner { get; set; }

    public virtual Skill Skill { get; set; }

    public virtual Usersprofile Teacher { get; set; }

    public virtual ICollection<Usersessionfeedback> Usersessionfeedbacks { get; set; } = new List<Usersessionfeedback>();
}