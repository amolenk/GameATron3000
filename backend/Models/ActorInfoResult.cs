using System;

namespace backend.Models
{
    public class ActorInfoResult
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public dynamic FaceInfo { get; set; }
    }
}