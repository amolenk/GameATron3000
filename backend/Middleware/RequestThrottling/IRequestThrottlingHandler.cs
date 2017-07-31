using System;
using System.Threading.Tasks;

namespace backend.Middleware.RequestThrottling
{
    public interface IRequestThrottlingHandler
    {
        Task<bool> HandleRequestAsync(DateTime requestTimestamp);
    }
}