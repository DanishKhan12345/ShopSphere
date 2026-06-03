using OrderService.DTOs;

namespace OrderService.Services;

public interface IOrderService
{
    Task<OrderDto?> CreateAsync(CreateOrderRequest request);

    Task<bool> ProductHasOrdersAsync(int productId);

    Task<IEnumerable<OrderDto>> GetAllAsync();
}