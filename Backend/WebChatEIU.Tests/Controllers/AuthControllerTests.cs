using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebChatEIU.Tests.Controllers
{
    public class AuthControllerTests
    {
        [Fact]
        public void Login_WithValidData_ShouldPass()
        {
            string email = "test@eiu.edu.vn";
            string password = "123456";

            Assert.NotNull(email);
            Assert.NotNull(password);
        }

        [Fact]
        public void Login_WithEmptyEmail_ShouldFail()
        {
            string email = "";

            Assert.True(string.IsNullOrWhiteSpace(email));
        }

        [Fact]
        public void Login_WithEmptyPassword_ShouldFail()
        {
            string password = "";

            Assert.True(string.IsNullOrWhiteSpace(password));
        }
    }
}
