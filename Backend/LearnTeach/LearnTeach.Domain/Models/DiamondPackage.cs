using System.ComponentModel.DataAnnotations.Schema;

namespace LearnTeach.Domain.Models
{
    public class DiamondPackage
    {
        public int DiamondPackageId { get; set; }
        public string Title { get; set; }

        public int DiamondAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public string Currency { get; set; } = "EGP";

        // Navigation:
        public virtual ICollection<UserDiamondPackage> UserDiamondPackages { get; set; } = new List<UserDiamondPackage>();

        public virtual ICollection<DiamondTransaction> DiamondTransactions { get; set; } = new List<DiamondTransaction>();

    }

}

