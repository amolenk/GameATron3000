namespace backend.Middleware.RequestThrottling
{
    public class RequestThrottlingOptions
    {
        public int MaxRequestsPer5Seconds { get; set; }
        public int MaxRequestsPerMinute { get; set; }
    }
}