using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebChatEIU.Data;

namespace WebChatEIU.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("{roomId}")]
        public async Task<IActionResult> GetMessages(int roomId)
        {
            var messages = await _context.Messages
                .Where(x => x.RoomId == roomId)
                .OrderBy(x => x.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }
    }
}