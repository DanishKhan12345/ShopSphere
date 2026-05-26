using OrderService.DTOs;

namespace OrderService.Services;

public interface IOrderService
{
    Task<OrderDto?> CreateAsync(CreateOrderRequest request);
}