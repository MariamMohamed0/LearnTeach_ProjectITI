using LearnTeach.Application.Dtos.NotificationDtos;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
namespace LearnTeach.Application.Hubs
{
    public class NotificationHub : Hub
    {
        private static readonly ConcurrentDictionary<int, HashSet<string>> _connections = new();

        public override Task OnConnectedAsync()
        {
            if (Context.UserIdentifier != null && int.TryParse(Context.UserIdentifier, out int userId))
            {
                _connections.AddOrUpdate(userId,
                    new HashSet<string> { Context.ConnectionId },
                    (key, oldSet) => { oldSet.Add(Context.ConnectionId); return oldSet; });
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            if (Context.UserIdentifier != null && int.TryParse(Context.UserIdentifier, out int userId))
            {
                if (_connections.TryGetValue(userId, out var set))
                {
                    set.Remove(Context.ConnectionId);
                    if (set.Count == 0)
                        _connections.TryRemove(userId, out _);
                }
            }
            return base.OnDisconnectedAsync(exception);
        }
    }
}
