namespace LearnTeach.Application.Dtos.PackageDtos
{
    public class PackageDto
    {
        public int PackageId { get; set; }
        public string PackageName { get; set; }
        public string PackageDetails { get; set; }
        public string PackageDuration { get; set; }
        public int DiamondPoints { get; set; }
        public decimal PackagePrice { get; set; }

        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public DateOnly? SubscribedAt { get; set; }
    }
}
