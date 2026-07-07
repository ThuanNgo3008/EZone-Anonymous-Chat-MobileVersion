using System.Text.RegularExpressions;

namespace WebChatEIU.Services
{
    public class ModerationService
    {
        private readonly List<string> _bannedWords = new()
        {
            "dm",
            "cc",
            "sex",
            "xxx",
            "nude",
            "sgdd",
            "sgbb",
            "fwb",
            "name",
            "tên"
        };

        private readonly List<Regex> _sensitivePatterns = new()
        {
            new Regex(@"\b\d{10,11}\b"), // phone
            new Regex(@"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"), // email
            new Regex(@"(https?:\/\/|www\.)\S+"), // link
            new Regex(@"\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b"), // date
            new Regex(@"\b(facebook|fb|instagram|insta|zalo|tiktok|telegram)\b", RegexOptions.IgnoreCase)
        };

        public bool IsSensitive(string message)
        {

            if (string.IsNullOrWhiteSpace(message))
            {
                return false;
            }

            if (_sensitivePatterns.Any(pattern => pattern.IsMatch(message)))
            {
                return true;
            }
            string normalized = message.ToLower();

            return _bannedWords.Any(word => normalized.Contains(word));
        }
    }
}