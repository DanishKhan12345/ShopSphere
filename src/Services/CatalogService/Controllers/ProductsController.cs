using CatalogService.DTOs;
using CatalogService.Services;
using Microsoft.AspNetCore.Mvc;

namespace CatalogService.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllAsync()
    {
        IEnumerable<ProductDto> products = await _productService.GetAllAsync();

        return Ok(products);
    }

    [HttpGet("{id:int}", Name = "GetProductById")]
    public async Task<ActionResult<ProductDto>> GetByIdAsync(int id)
    {
        ProductDto? product = await _productService.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateAsync(CreateProductRequest request)
    {
        ProductDto createdProduct = await _productService.CreateAsync(request);

        return CreatedAtRoute("GetProductById", new { id = createdProduct.Id }, createdProduct);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, UpdateProductRequest request)
    {
        bool updated = await _productService.UpdateAsync(id, request);

        if (!updated)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        bool deleted = await _productService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}