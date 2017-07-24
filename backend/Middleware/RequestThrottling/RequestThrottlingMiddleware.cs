using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Net;

namespace backend.Middleware.RequestThrottling
{
    public class RequestThrottlingMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly ILogger<RequestThrottlingMiddleware> _logger;

        private readonly IRequestThrottlingHandler _handler;

        public RequestThrottlingMiddleware(RequestDelegate next, ILogger<RequestThrottlingMiddleware> logger, IRequestThrottlingHandler handler)
        {
            _next = next;
            _logger = logger;
            _handler = handler;
        }

        public async Task Invoke(HttpContext httpContext)
        {
            if (httpContext.Request.Path.StartsWithSegments("/api"))
            {
                if (!await _handler.HandleRequestAsync(DateTime.Now))
                {
                    LogBlockedRequest(httpContext);
                    await ReturnQuotaExceededResponse(httpContext);
                    return;
                }
            }
            await _next.Invoke(httpContext);
        }

        public virtual Task ReturnQuotaExceededResponse(HttpContext httpContext)
        {
            var message = "API calls quota exceeded!";
            httpContext.Response.StatusCode = 503; // Service Unavailable
            return httpContext.Response.WriteAsync(message);
        }

        public virtual void LogBlockedRequest(HttpContext httpContext)
        {
            _logger.LogInformation($"Request {httpContext.Request.Method}:{httpContext.Request.Path} has been blocked by RequestThrottling.");
        }
    }
}