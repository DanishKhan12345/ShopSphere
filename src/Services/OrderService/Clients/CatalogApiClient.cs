using System.Text.Json;
using OrderService.DTOs;

namespace OrderService.Clients;

public sealed class CatalogApiClient : ICatalogApiClient
{
    private readonly HttpClient _httpClient;

    private readonly IConfiguration _configuration;

    private readonly ILogger<CatalogApiClient> _logger;

    public CatalogApiClient( HttpClient httpClient, IConfiguration configuration, ILogger<CatalogApiClient> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        string? baseUrl = _configuration["CatalogService:BaseUrl"];

        _httpClient.BaseAddress = new Uri(baseUrl!);
    }

    public async Task<ProductResponse?> GetProductByIdAsync( int productId)
    {
        _logger.LogInformation( "Calling CatalogService for product id {ProductId}",productId);

        HttpResponseMessage response = await _httpClient.GetAsync( $"api/products/{productId}");

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("CatalogService returned status code {StatusCode}", response.StatusCode);

            return null;
        }

        string json = await response.Content.ReadAsStringAsync();

        ProductResponse? product =  JsonSerializer.Deserialize<ProductResponse>(json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

        return product;
    }
}