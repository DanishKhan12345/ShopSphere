using CatalogService.DTOs;

namespace CatalogService.Clients;

public sealed class OrderApiClient : IOrderApiClient
{
    private readonly HttpClient _httpClient;

    public OrderApiClient( HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ProductOrderExistsResponse?>  ProductHasOrdersAsync( int productId)
    {
        return await _httpClient.GetFromJsonAsync<ProductOrderExistsResponse>($"api/orders/product/{productId}/exists");
    }
}