using FluentValidation;
using OrderService.DTOs;

namespace OrderService.Validators;

public sealed class CreateOrderRequestValidator
    : AbstractValidator<CreateOrderRequest>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(request => request.ProductId)
            .GreaterThan(0);

        RuleFor(request => request.Quantity)
            .GreaterThan(0);
    }
}