using OrderService.DTOs;

namespace OrderService.Clients;

public interface ICatalogApiClient
{
    Task<ProductResponse?> GetProductByIdAsync(int productId);

    Task<bool> DecrementStockAsync(int productId, int quantity);
}