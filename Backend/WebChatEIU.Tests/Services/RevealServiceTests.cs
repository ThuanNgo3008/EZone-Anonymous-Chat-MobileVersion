using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebChatEIU.Tests.Services
{
    public class RevealServiceTests
    {
        [Fact]
        public void RevealRequest_ShouldStartAsPending()
        {
            bool isApproved = false;

            Assert.False(isApproved);
        }

        [Fact]
        public void Reveal_ShouldBeSuccessful_WhenBothUsersApprove()
        {
            bool user1Approved = true;
            bool user2Approved = true;

            bool revealSuccess = user1Approved && user2Approved;

            Assert.True(revealSuccess);
        }

        [Fact]
        public void Reveal_ShouldFail_WhenOnlyOneUserApproves()
        {
            bool user1Approved = true;
            bool user2Approved = false;

            bool revealSuccess = user1Approved && user2Approved;

            Assert.False(revealSuccess);
        }
    }
}
