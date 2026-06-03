using OrderService.DTOs;

namespace CatalogService.Clients;

public interface IOrderApiClient
{
    Task<ProductOrderExistsResponse?> ProductHasOrdersAsync(int productId);
}