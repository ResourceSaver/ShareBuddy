using System;
using System.IO;
using System.Net;
using System.Text;

namespace CreateUsers.Code
{
    public class PasswordGenerator
    {
        public static string GetPassword()
        {
            string url = "http://makeagoodpassword.com/password/simple/";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            try
            {
                WebResponse response = request.GetResponse();

                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    //DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(Data));

                    try
                    {
                        string password = reader.ReadLine();
                        return password;
                    }
                    catch (Exception e)
                    {
                        return null;
                    }
                }
            }
            catch (WebException ex)
            {
                WebResponse errorResponse = ex.Response;
                using (Stream responseStream = errorResponse.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.GetEncoding("utf-8"));
                    String errorText = reader.ReadToEnd();
                }
                return null;
            }
        }
    }
}
