using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebChatEIU.Models
{
    [Table("ChatRooms")]
    public class ChatRooms
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoomId { get; set; }

        [Required]
        public int User1Id { get; set; }
        [ForeignKey("User1Id")]
        public virtual Users User1 { get; set; }
        public string User1Nickname { get; set; }

        [Required]
        public int User2Id { get; set; }
        [ForeignKey("User2Id")]
        public virtual Users User2 { get; set; }
        public string User2Nickname { get; set; }

        public int AffinityScore { get; set; } = 0;

        public bool IsRevealed { get; set; } = false;

        public bool User1Revealed { get; set; } = false;

        public bool User2Revealed { get; set; } = false;

        public enum RoomStatus
        {
            Waiting,
            Active,
            Disconnected,
            Closed,
            Expired
        }
        public RoomStatus Status { get; set; } = RoomStatus.Waiting;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Messages> Messages { get; set; } 
    }
}