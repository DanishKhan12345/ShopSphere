namespace CatalogService.DTOs;

public sealed class ProductDeleteResult
{
    public bool Success { get; set; }

    public string? ErrorMessage { get; set; }
}