namespace LearnTeach.Application.Dtos.PackageDtos
{
    public class CreatePackageDto
    {
        public string PackageName { get; set; }
        public string PackageDetails { get; set; }
        public string PackageDuration { get; set; }
        public int DiamondPoints { get; set; }
        public decimal PackagePrice { get; set; }
    }
}

