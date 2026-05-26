using System.Text.Json;
using OrderService.DTOs;

namespace OrderService.Middleware;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware( RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            _logger.LogError( exception, "Unhandled exception occurred");

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            context.Response.ContentType = "application/json";

            ErrorResponse response = new()
            {
                Message = "An unexpected error occurred.",
                Details = exception.Message
            };

            string jsonResponse = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync( jsonResponse);
        }
    }
}