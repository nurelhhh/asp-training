using IdentityModel.Client;
using System;
using System.Net.Http;

namespace MachineApp
{
    class Program
    {
        static async System.Threading.Tasks.Task Main(string[] args)
        {
            // Client ID dan Client Secret seperti username dan password si app non-human ini
            var clientID = "machine-app";
            var clientSecret = "d46b5ede-595f-443b-a537-560f56998400";

            // Pertama2 kita request informasi tentang Authentication Servernya (via Discovery URL)
            var client = new HttpClient();
            var disco = await client.GetDiscoveryDocumentAsync("https://sso.accelist.com/auth/realms/Dev");


            // Kedua, kita request token, minta access ke customer-api
            var response = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = disco.TokenEndpoint,
                ClientId = clientID,
                ClientSecret = clientSecret,
                Scope = "customer-api",             // anggep aja scope = API yang mau diakses
            });

            // Kalau berhasil, dapet access token, bisa dicek di https://jwt.io/
            // Please jangan ngepaste token ke sembarang tempat...
            Console.WriteLine(response.AccessToken);

            // Kita mau pake tokennya untuk access customer API
            var request = new HttpRequestMessage(HttpMethod.Get, "https://localhost:44324/api/customer");
            request.SetBearerToken(response.AccessToken);

            // Fire!
            var customer = await client.SendAsync(request);

            // dapet string dalam bentuk Json
            var content = await customer.Content.ReadAsStringAsync();
            Console.WriteLine("\n\n");
            Console.WriteLine(content);
        }
    }
}
