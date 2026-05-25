using CatalogService.Data;
using CatalogService.DTOs;
using CatalogService.Entities;
using Microsoft.EntityFrameworkCore;

namespace CatalogService.Services;

public sealed class ProductService : IProductService
{
    private readonly CatalogDbContext _dbContext;
    private readonly ILogger<ProductService> _logger;

    public ProductService(CatalogDbContext dbContext, ILogger<ProductService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all products");

        List<Product> products = await _dbContext.Products.AsNoTracking()
            .OrderBy(product => product.Name)
            .ToListAsync();

        return products.Select(product => new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity
        });
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation( "Fetching product with id {ProductId}", id);

        Product? product = await _dbContext.Products.AsNoTracking()
            .FirstOrDefaultAsync(product => product.Id == id);

        if (product == null)
        {
            return null;
        }

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity
        };
    }

    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        _logger.LogInformation( "Creating product with name {ProductName}", request.Name);

        Product product = new()
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            CreatedOnUtc = DateTime.UtcNow
        };

        product.CreatedOnUtc = DateTime.UtcNow;

        _dbContext.Products.Add(product);

        await _dbContext.SaveChangesAsync();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateProductRequest request)
    {
        _logger.LogInformation( "Updating product with id {ProductId}", id);

        Product? existingProduct = await _dbContext.Products.FirstOrDefaultAsync(product => product.Id == id);

        if (existingProduct == null)
        {
            return false;
        }

        existingProduct.Name = request.Name;
        existingProduct.Description = request.Description;
        existingProduct.Price = request.Price;
        existingProduct.StockQuantity = request.StockQuantity;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        _logger.LogInformation("Deleting product with id {ProductId}", id);

        Product? product = await _dbContext.Products.FirstOrDefaultAsync(product => product.Id == id);

        if (product == null)
        {
            return false;
        }

        _dbContext.Products.Remove(product);

        await _dbContext.SaveChangesAsync();

        return true;
    }
}