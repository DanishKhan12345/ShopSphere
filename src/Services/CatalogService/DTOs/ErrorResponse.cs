namespace CatalogService.DTOs;

public sealed class ErrorResponse
{
    public string Message { get; set; } = string.Empty;

    public string? Details { get; set; }
}