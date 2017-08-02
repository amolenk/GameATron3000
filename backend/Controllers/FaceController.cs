using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Newtonsoft.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    public class FaceController : Controller
    {
        const string uriBase = "https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect";
        
        /// <summary>
        /// Get face information from face API.
        /// </summary>
        /// <param name="id">Id of the image to use.</param>
        /// <returns>Face info returned by cognitive service.</returns>
        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetFaceInfo(string id)
        {
            Actor actor = await GetActorInfoFromBlobStorageAsync(id);
            byte[] imageData = await GetImageFromBlobStorageAsync(id);

            HttpClient client = new HttpClient();

            // Request headers.
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", Secrets.FaceApiSubscriptionKey);

            // Request parameters. A third optional parameter is "details".
            string requestParameters = "returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=age,gender,smile,facialHair,glasses,emotion,hair,makeup,accessories";

            // Assemble the URI for the REST API Call.
            string uri = uriBase + "?" + requestParameters;

            HttpResponseMessage response;

            using (ByteArrayContent content = new ByteArrayContent(imageData))
            {
                // This example uses content type "application/octet-stream".
                // The other content types you can use are "application/json" and "multipart/form-data".
                content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                // Execute the REST API call.
                response = await client.PostAsync(uri, content);

                // Get the JSON response.
                string faceInfo = await response.Content.ReadAsStringAsync();

                // build result
                ActorInfoResult result = new ActorInfoResult
                {
                    Id = id,
                    Name = actor.Name,
                    FaceInfo = JsonConvert.DeserializeObject<dynamic>(faceInfo)
                };

                return new ObjectResult(result);
            }
        }

        /// <summary>
        /// Gets an actorinfo file from blob storage by id.
        /// </summary>
        /// <param name="id">The id of the actor to get the info for.</param>
        /// <returns>The string containing the image data.</returns>
        private async Task<Actor> GetActorInfoFromBlobStorageAsync(string id)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(Secrets.PictureStorageConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference("pictures");
            CloudBlockBlob blob = container.GetBlockBlobReference($"{id}.json");
            byte[] data;
            using (var memoryStream = new MemoryStream())
            {
                await blob.DownloadToStreamAsync(memoryStream);
                data = memoryStream.GetBuffer();
            }

            string json = Encoding.UTF8.GetString(data);

            return JsonConvert.DeserializeObject<Actor>(json);
        }

        /// <summary>
        /// Gets an image from blob storage by actor id.
        /// </summary>
        /// <param name="id">The id of the actor to get the image for.</param>
        /// <returns>The byte[] containing the image data.</returns>
        private async Task<byte[]> GetImageFromBlobStorageAsync(string id)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(Secrets.PictureStorageConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference("pictures");
            CloudBlockBlob blob = container.GetBlockBlobReference($"{id}-front.png");
            byte[] imageData;
            using (var memoryStream = new MemoryStream())
            {
                await blob.DownloadToStreamAsync(memoryStream);
                imageData = memoryStream.GetBuffer();
            }

            return imageData;
        }
    }
}
