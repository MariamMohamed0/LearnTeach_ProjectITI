namespace LearnTeach.Application.Dtos.Rcords
{
    public record LoginRuselt(bool Success = false, string? message = null,string Token=null!,string RefreshToken=null!);

}
