using LearnTeach.Application.Dtos;


namespace LearnTeach.Application.IServices
{
    public interface IReportService
    {
        Task<ReportDto> CreateReportAsync(CreateReportDto dto);

        Task<IEnumerable<ReportDto>> GetUserReportsAsync();
    }
}
