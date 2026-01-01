namespace LearnTeach.Domain.Models
{
    public class UserDiamondPackage
    {
        public int UserId { get; set; }
        public int DiamondPackageId { get; set; }
        public DateTime PurchasedAt { get; set; } = DateTime.Now;

        // Navigation
        public virtual Usersprofile User { get; set; }
        public virtual DiamondPackage DiamondPackage { get; set; }
    }

}
