## GameATron3000 Backend API
This is an ASP.NET Core Web API that acts as the backend of the game. It abstracts the Cognitive Services used in the game.

### Documentation
The API is documented using Swagger. If you go the URL _https://[host]/swagger_, you will be presented with a generated SwaggerUI you can use to test the API. 

### Throtling
The API is throttled. It allows a maximum number of API calls per minute and per 5 seconds. This is done to protect the API from being flooded with request (every call to Cognitive Services incurs costs). How many request can be made before throttling kicks in can be configured in the appsettings.

### Secrets
The secrets used to access the Cognitive Services (account names and keys) are read from static constants defined in a static class called _Secrets_. To protect these secrets, the file in which this class is defined is not included in the repo. In order to build and use the backend project, add a class to the project with the following structure:

```
public static class Secrets
{
    public static string FaceApiSubscriptionKey = "[key]";
    public static string PictureStorageConnectionString = 
        "DefaultEndpointsProtocol=https"
        + ";AccountName=[account name]"
        + ";AccountKey=[account key]"
        + ";EndpointSuffix=core.windows.net";
}
```