using CatalogService.DTOs;

namespace CatalogService.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync();

    Task<ProductDto?> GetByIdAsync(int id);

    Task<ProductDto> CreateAsync(CreateProductRequest request);

    Task<bool> UpdateAsync(int id, UpdateProductRequest request);

    Task<ProductDeleteResult> DeleteAsync(int id);
}