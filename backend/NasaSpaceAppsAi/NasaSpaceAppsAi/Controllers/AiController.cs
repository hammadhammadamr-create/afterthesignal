using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace RoboMindAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IWebHostEnvironment _env;
        private static List<JsonNode>? _objectsList;

        private const string ApiUrl = "https://collabs.corexai.online/apis/cosmo/v1/chat/completions";
        private readonly string _apiKey;

        public AiController(IHttpClientFactory httpClientFactory, IWebHostEnvironment env, IConfiguration config)
        {
            _apiKey = config["Cosmo:ApiKey"] ?? string.Empty;
            _httpClientFactory = httpClientFactory;
            _env = env;
            LoadDatasetIfNeeded();
        }

        private void LoadDatasetIfNeeded()
        {
            if (_objectsList != null && _objectsList.Count > 0) return;

            _objectsList = new List<JsonNode>();
            var filePath = Path.Combine(_env.ContentRootPath, "nasa_missions_data.json");

            if (System.IO.File.Exists(filePath))
            {
                var rawJson = System.IO.File.ReadAllText(filePath, Encoding.UTF8);
                var root = JsonNode.Parse(rawJson);
                var objectsArray = root?["objects"]?.AsArray();
                if (objectsArray != null)
                {
                    foreach (var item in objectsArray)
                    {
                        if (item != null) _objectsList.Add(item);
                    }
                }
            }
        }

        private string GetRelevantContext(string question, int maxItems = 3)
        {
            if (_objectsList == null || _objectsList.Count == 0)
                return "No data provided.";

            var qLower = question.ToLowerInvariant();
            var words = Regex.Matches(qLower, @"\w+")
                             .Select(m => m.Value)
                             .Where(w => w.Length > 2)
                             .ToList();

            List<JsonNode> selected;

            if (qLower.Contains("random") || words.Count == 0)
            {
                var rng = new Random();
                selected = _objectsList.OrderBy(_ => rng.Next()).Take(maxItems).ToList();
            }
            else
            {
                var scored = _objectsList
                    .Select(obj =>
                    {
                        var objText = obj.ToJsonString().ToLowerInvariant();
                        int score = words.Count(w => objText.Contains(w));
                        return (score, obj);
                    })
                    .Where(x => x.score > 0)
                    .OrderByDescending(x => x.score)
                    .Take(maxItems)
                    .Select(x => x.obj)
                    .ToList();

                if (scored.Count > 0)
                {
                    selected = scored;
                }
                else
                {
                    var compactSummary = _objectsList.Select(o => new
                    {
                        name = o["name"]?.ToString(),
                        type = o["type"]?.ToString(),
                        destination = (o["destination"] ?? o["targets"] ?? o["target"])?.ToString(),
                        year = (o["launch_year"] ?? o["first_use_year"] ?? o["years"])?.ToString(),
                        description = o["description"]?.ToString()
                    });
                    return JsonSerializer.Serialize(compactSummary);
                }
            }

            return JsonSerializer.Serialize(selected);
        }

        public class AskRequest
        {
            public string question { get; set; } = string.Empty;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] AskRequest req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.question))
                return BadRequest(new { message = "Question cannot be empty." });

            if (string.IsNullOrEmpty(_apiKey))
                return StatusCode(500, new { message = "Cosmo:ApiKey is not configured." });

            var compactContext = GetRelevantContext(req.question);
            var fullPrompt = $"Answer the user question strictly using only this NASA JSON data:\n{compactContext}\n\nQuestion: {req.question}";

            var payload = new
            {
                model = "cosmo",
                message = fullPrompt
            };

            try
            {
                var client = _httpClientFactory.CreateClient();
                client.Timeout = TimeSpan.FromSeconds(50);

                using var httpRequest = new HttpRequestMessage(HttpMethod.Post, ApiUrl);
                httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
                httpRequest.Content = new StringContent(
                    JsonSerializer.Serialize(payload),
                    Encoding.UTF8,
                    "application/json"
                );

                using var response = await client.SendAsync(httpRequest);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                var doc = JsonNode.Parse(responseJson);

                var answer = doc?["answer"]?.ToString()
                             ?? doc?["choices"]?[0]?["message"]?["content"]?.ToString()
                             ?? "No answer returned.";

                return Ok(new { question = req.question, answer });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to get answer from AI.", error = ex.Message });
            }
        }
    }
}