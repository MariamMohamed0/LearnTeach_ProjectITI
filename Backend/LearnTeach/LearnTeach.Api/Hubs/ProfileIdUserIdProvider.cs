using Microsoft.AspNetCore.SignalR;

namespace LearnTeach.Api.Hubs
{
    public class ProfileIdUserIdProvider : IUserIdProvider
    {
        public string? GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst("ProfileId")?.Value;
        }
    }
}
   