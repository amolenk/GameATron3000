using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

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
                string contentString = await response.Content.ReadAsStringAsync();

                return new ObjectResult(contentString);
            }
        }

        /// <summary>
        /// Gets an image from blob storage by id.
        /// </summary>
        /// <param name="id">The id of the image.</param>
        /// <returns>The byte[] containing the image data.</returns>
        private async Task<byte[]> GetImageFromBlobStorageAsync(string id)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(Secrets.PictureStorageConnectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference("pictures");
            CloudBlockBlob blob = container.GetBlockBlobReference($"{id}-front.png");
            // byte[] imageData = new byte[blob.Properties.Length];
            // await blob.DownloadToByteArrayAsync(imageData, 0);
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
