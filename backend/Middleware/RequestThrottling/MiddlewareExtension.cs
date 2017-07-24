using Microsoft.AspNetCore.Builder;

namespace backend.Middleware.RequestThrottling
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UseRequestThrottling(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestThrottlingMiddleware>();
        }
    }
}