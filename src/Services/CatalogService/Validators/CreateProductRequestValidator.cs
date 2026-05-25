using CatalogService.DTOs;
using FluentValidation;

namespace CatalogService.Validators;

public sealed class CreateProductRequestValidator
    : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(request => request.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(request => request.Description)
            .MaximumLength(1000);

        RuleFor(request => request.Price)
            .GreaterThan(0);

        RuleFor(request => request.StockQuantity)
            .GreaterThanOrEqualTo(0);
    }
}