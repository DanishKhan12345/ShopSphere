using Microsoft.AspNetCore.Mvc;
using OrderService.DTOs;
using OrderService.Services;

namespace OrderService.Controllers;

[ApiController]
[Route("api/orders")]
public sealed class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateAsync(
        CreateOrderRequest request)
    {
        OrderDto? createdOrder =  await _orderService.CreateAsync(request);

        if (createdOrder == null)
        {
            return BadRequest(
                new ErrorResponse
                {
                    Message = "Unable to create order. Product may not exist or stock is insufficient."
                });
        }

        return Ok(createdOrder);
    }
}