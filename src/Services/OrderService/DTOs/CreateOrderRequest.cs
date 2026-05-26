namespace OrderService.DTOs;

public sealed class CreateOrderRequest
{
    public int ProductId { get; set; }

    public int Quantity { get; set; }
}