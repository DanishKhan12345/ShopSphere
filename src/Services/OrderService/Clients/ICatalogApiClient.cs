using OrderService.DTOs;

namespace OrderService.Clients;

public interface ICatalogApiClient
{
    Task<ProductResponse?> GetProductByIdAsync(int productId);
}