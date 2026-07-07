using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Xunit;
using WebChatEIU.Models;

namespace WebChatEIU.Tests.Models
{
    public class UsersValidationTests
    {
        private bool ValidateModel(Users user)
        {
            var context = new ValidationContext(user);
            var results = new List<ValidationResult>();

            return Validator.TryValidateObject(
                user,
                context,
                results,
                true
            );
        }

        [Fact]
        public void User_Should_Be_Invalid_When_Email_Is_Not_EIU()
        {
            var user = new Users
            {
                Email = "test@gmail.com",
                Fullname = "Test User",
                Password = "123456",
                MajorCode = "SE"
            };

            var result = ValidateModel(user);

            Assert.False(result);
        }

        [Fact]
        public void User_Should_Be_Valid_When_Email_Is_EIU()
        {
            var user = new Users
            {
                Email = "test@eiu.edu.vn",
                Fullname = "Test User",
                Password = "123456",
                MajorCode = "SE"
            };

            var result = ValidateModel(user);

            Assert.True(result);
        }

        [Fact]
        public void User_Should_Be_Invalid_When_Email_Is_Empty()
        {
            var user = new Users
            {
                Email = "",
                Fullname = "Test User",
                Password = "123456",
                MajorCode = "SE"
            };

            var result = ValidateModel(user);

            Assert.False(result);
        }

        [Fact]
        public void User_Should_Be_Invalid_When_Password_Is_Empty()
        {
            var user = new Users
            {
                Email = "test@eiu.edu.vn",
                Fullname = "Test User",
                Password = "",
                MajorCode = "SE"
            };

            var result = ValidateModel(user);

            Assert.False(result);
        }

        [Fact]
        public void User_Should_Be_Invalid_When_Fullname_Is_Empty()
        {
            var user = new Users
            {
                Email = "test@eiu.edu.vn",
                Fullname = "",
                Password = "123456",
                MajorCode = "SE"
            };

            var result = ValidateModel(user);

            Assert.False(result);
        }

    }
}