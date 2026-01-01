namespace LearnTeach.Api.Client
{
    public class ChatClient
    {
        private readonly HttpClient _http;

        public ChatClient(HttpClient http)
        {
            _http = http;
        }

        public async Task<string?> CreateChatAsync(string user1, string user2)
        {
            var chat = new
            {
                user1,
                user2,
                createdAt = DateTime.UtcNow
            };

            // Firebase requires .json
            var response = await _http.PostAsJsonAsync("chats.json", chat);

            if (!response.IsSuccessStatusCode)
                return null;

            var data = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();

            // Firebase generates key called "name"
            return data != null && data.ContainsKey("name")
                ? data["name"]
                : null;
        }
    }
}
