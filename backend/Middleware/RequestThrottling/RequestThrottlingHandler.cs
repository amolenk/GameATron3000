using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace backend.Middleware.RequestThrottling
{
    public class RequestThrottlingHandler : IRequestThrottlingHandler
    {
        private readonly RequestThrottlingOptions _options;
        private readonly object _lockHandle = new object();
        private int _per5SecondsrequestCount = 0;
        private int _perMinuterequestCount = 0;
        private DateTime? _lastRequest = null;

        public RequestThrottlingHandler(IOptions<RequestThrottlingOptions> options)
        {
            _options = options.Value;
        }

        public Task<bool> HandleRequestAsync(DateTime requestTimestamp)
        {
            lock (_lockHandle)
            {
                bool allowRequest = true;
                if (_lastRequest.HasValue)
                {
                    TimeSpan elapsedSinceLastRequest = requestTimestamp.Subtract(_lastRequest.Value);
                    if (elapsedSinceLastRequest.Seconds < 5)
                    {
                        if (_per5SecondsrequestCount < _options.MaxRequestsPer5Seconds)
                        {
                            // allowed, increase requestcount
                            _per5SecondsrequestCount += 1;
                        }
                        else
                        {
                            // not allowed
                            allowRequest = false;
                        }
                    }
                    else
                    {
                        // reset requestcount when allowed
                        _per5SecondsrequestCount = 1;
                    }
                    
                    if (elapsedSinceLastRequest.Minutes < 1)
                    {
                        if (_perMinuterequestCount < _options.MaxRequestsPerMinute)
                        {
                            // allowed, increase requestcount
                            _perMinuterequestCount += 1;
                        }
                        else
                        {
                            // not allowed
                            allowRequest = false;
                        }
                    }
                    else
                    {
                        // reset requestcount when allowed
                        _perMinuterequestCount = 1;
                    }
                }

                // update last request timestamp
                if (allowRequest)
                {
                    _lastRequest = requestTimestamp;
                }
                
                return Task.FromResult(allowRequest);
            }
        }
    }
}