using System;
using System.Threading.Tasks;

namespace LearnTeach.Application.IServices
{
    public interface IZoomService
    {
        Task<(string meetingId, string joinUrl)> CreateMeetingAsync(string topic, DateTime startTime, int durationMinutes);
    }
}
