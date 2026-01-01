using LearnTeach.Application.IServices;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace LearnTeach.Application.Services
{
    public class ZoomService : IZoomService
    {
        private readonly HttpClient _httpClient;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _accountId;
        private DateTime _tokenExpiry;
        private string _accessToken;

        public ZoomService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _clientId = configuration["Zoom:ClientId"];
            _clientSecret = configuration["Zoom:ClientSecret"];
            _accountId = configuration["Zoom:AccountId"];
            _tokenExpiry = DateTime.MinValue;
        }


        private async Task<string> GetAccessTokenAsync()
        {

            if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiry)
            {
                return _accessToken;
            }

            var authHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://zoom.us/oauth/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "account_credentials"),
                new KeyValuePair<string, string>("account_id", _accountId)
            });

            request.Content = content;

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Failed to get access token: {response.StatusCode} - {errorContent}");
            }

            var json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<JsonElement>(json);

            _accessToken = data.GetProperty("access_token").GetString()!;
            var expiresIn = data.GetProperty("expires_in").GetInt32();
            _tokenExpiry = DateTime.UtcNow.AddSeconds(expiresIn - 300);

            return _accessToken;
        }

        public async Task<(string meetingId, string joinUrl)> CreateMeetingAsync(string topic, DateTime startTime, int durationMinutes)
        {
            try
            {
                string token = await GetAccessTokenAsync();

                using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.zoom.us/v2/users/me/meetings");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var meetingData = new
                {
                    topic = topic,
                    type = 2, 
                    start_time = startTime.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                    duration = durationMinutes,
                    timezone = "UTC",
                    settings = new
                    {
                        host_video = true,
                        participant_video = true,
                        join_before_host = false,
                        mute_upon_entry = false,
                        watermark = false,
                        approval_type = 0, 
                        registration_type = 1,
                        audio = "both", 
                        auto_recording = "none"
                    }
                };

                var jsonContent = JsonSerializer.Serialize(meetingData, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                request.Content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Zoom API error: {response.StatusCode} - {errorContent}");
                }

                var resultJson = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(resultJson);

                string meetingId = result.GetProperty("id").ToString();
                string joinUrl = result.GetProperty("join_url").GetString() ?? string.Empty;

                return (meetingId, joinUrl);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to create Zoom meeting: {ex.Message}", ex);
            }
        }
    }
}