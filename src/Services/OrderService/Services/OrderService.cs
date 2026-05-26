using Microsoft.EntityFrameworkCore;
using OrderService.Clients;
using OrderService.Data;
using OrderService.DTOs;
using OrderService.Entities;

namespace OrderService.Services;

public sealed class OrderService : IOrderService
{
    private readonly OrderDbContext _dbContext;

    private readonly ICatalogApiClient _catalogApiClient;

    private readonly ILogger<OrderService> _logger;

    public OrderService( OrderDbContext dbContext, ICatalogApiClient catalogApiClient, ILogger<OrderService> logger)
    {
        _dbContext = dbContext;
        _catalogApiClient = catalogApiClient;
        _logger = logger;
    }

    public async Task<OrderDto?> CreateAsync( CreateOrderRequest request)
    {
        _logger.LogInformation( "Creating order for product id {ProductId}", request.ProductId);

        ProductResponse? product = await _catalogApiClient.GetProductByIdAsync( request.ProductId);

        if (product == null)
        {
            _logger.LogWarning( "Product not found for id {ProductId}", request.ProductId);

            return null;
        }

        if (product.StockQuantity < request.Quantity)
        {
            _logger.LogWarning("Insufficient stock for product id {ProductId}", request.ProductId);

            return null;
        }

        Order order = new()
        {
            ProductId = product.Id,
            Quantity = request.Quantity,
            UnitPrice = product.Price,
            TotalPrice = product.Price * request.Quantity,
            CreatedOnUtc = DateTime.UtcNow
        };

        _dbContext.Orders.Add(order);

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Order created successfully with id {OrderId}", order.Id);

        return new OrderDto
        {
            Id = order.Id,
            ProductId = order.ProductId,
            Quantity = order.Quantity,
            UnitPrice = order.UnitPrice,
            TotalPrice = order.TotalPrice
        };
    }
}