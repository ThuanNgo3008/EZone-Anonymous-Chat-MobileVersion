using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebChatEIU.Data;
using WebChatEIU.Models;

namespace WebChatEIU.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatRoomsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChatRoomsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("active/{userId}")]
        public async Task<IActionResult> GetActiveRoom(int userId)
        {
            var room = await _context.ChatRooms
                .FirstOrDefaultAsync(r =>
                    (r.User1Id == userId || r.User2Id == userId)
                    && r.Status == ChatRooms.RoomStatus.Active);

            if (room == null)
            {
                return NotFound();
            }

            return Ok(room);
        }

        [HttpPost("{roomId}/leave/{userId}")]
        public async Task<IActionResult> LeaveChat(int roomId, int userId)
        {
            var room = await _context.ChatRooms.FindAsync(roomId);

            if (room == null)
            {
                return NotFound("Room not found");
            }

            if (room.User1Id != userId && room.User2Id != userId)
            {
                return BadRequest("User is not in this room");
            }

            var messages = _context.Messages.Where(m => m.RoomId == roomId);

            _context.Messages.RemoveRange(messages);

            room.Status = ChatRooms.RoomStatus.Closed;
            room.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Conversation ended and messages deleted."
            });
        }
    }
}