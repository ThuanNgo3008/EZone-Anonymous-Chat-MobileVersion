using Xunit;
using WebChatEIU.Services;

namespace WebChatEIU.Tests.Services
{
    public class ModerationServiceTests
    {
        [Theory]
        [InlineData("0901234567")]
        [InlineData("test@gmail.com")]
        [InlineData("https://facebook.com/abc")]
        [InlineData("facebook")]
        public void IsSensitive_Should_Return_True_For_Private_Info(string message)
        {
            var service = new ModerationService();

            var result = service.IsSensitive(message);

            Assert.True(result);
        }

        [Theory]
        [InlineData("hello bạn")]
        [InlineData("hôm nay học gì")]
        [InlineData("mình thích nghe nhạc")]
        public void IsSensitive_Should_Return_False_For_Normal_Message(string message)
        {
            var service = new ModerationService();

            var result = service.IsSensitive(message);

            Assert.False(result);
        }

        [Theory]
        [InlineData("0901234567")]
        [InlineData("test@gmail.com")]
        [InlineData("https://facebook.com/test")]
        [InlineData("facebook")]
        [InlineData("zalo")]
        [InlineData("sex")]
        public void IsSensitive_Should_Return_True_When_Message_Contains_Private_Or_Banned_Content(string message)
        {
            var service = new ModerationService();

            var result = service.IsSensitive(message);

            Assert.True(result);
        }

        [Theory]
        [InlineData("hello bạn")]
        [InlineData("hôm nay học gì")]
        [InlineData("mình thích nghe nhạc")]
        public void IsSensitive_Should_Return_False_When_Message_Is_Normal(string message)
        {
            var service = new ModerationService();

            var result = service.IsSensitive(message);

            Assert.False(result);
        }
    }
}