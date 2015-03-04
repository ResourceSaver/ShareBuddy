using Database.Code;
using Live.Code;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Text;

namespace Live
{
    public class Ecosense
    {
        static string urlMaster = "http://gdl-data.ecosense.cs.au.dk";
        static int timeout = 10000;

        public static WaterData GetWaterYesterday(string appartmentId)
        {
            return Ecosense.GetWater(appartmentId, SystemTime.YesterdayReal());
        }

        public static WaterData GetWater(string appartmentId, string date)
        {
            WaterData cold = Ecosense.GetWater(date, appartmentId, "cold");
            WaterData warm = Ecosense.GetWater(date, appartmentId, "hot");
            WaterData combined = null;

            if (cold != null && warm != null)
            {
                combined = new WaterData();
                combined.deltaValue = (cold.deltaValue * 1000) + (warm.deltaValue * 1000);
            }

            return combined;
        }

        private static WaterData GetWater(string dt, string appartmentId, string type)
        {
            string specs = type + "/" + appartmentId + "/" + dt.Replace('-', '/');
            string url = urlMaster + ":3903/water/" + specs;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Timeout = timeout;
            request.Credentials = new NetworkCredential(Codes.ECOCSENSEWATERUSER, Codes.ECOSENSEWATERPASSWORD);
            try
            {
                WebResponse response = request.GetResponse();

                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(WaterData));

                    try
                    {
                        WaterData wd = (WaterData)ser.ReadObject(responseStream);

                        if (wd == null)
                        {
                            Trace.TraceInformation("ERROR: No " + type + " water for appartment " + appartmentId);
                            return null;
                        }

                        return wd;
                    }
                    catch (Exception e)
                    {
                        Trace.TraceInformation("ERROR: No " + type + " water for appartment " + appartmentId + " " + dt);
                        return null;
                    }
                }
            }
            catch (WebException ex)
            {
                Trace.TraceInformation("ERROR: No " + type + " water for appartment " + appartmentId);
                return null;
            }
        }
        
        public static List<double> GetElectricityYesterdayWattDepot(string mac)
        {
            string yesterday = SystemTime.YesterdayReal();
            string today = SystemTime.TodayReal();
            string url = @"http://gdl-data.ecosense.cs.au.dk:3904/wattdepot/ecosense/depository/22/values/?sensor=" + mac.ToLower() + @"&start=" + yesterday + @"T00:00:00.000%2B0100&end=" + today + @"T00:00:00.000%2B0100&interval=60&value-type=difference";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Timeout = timeout;
            request.Credentials = new NetworkCredential(Codes.WATTDEPOTUSER, Codes.WATTDEPOTPASSWORD);
            try
            {
                WebResponse response = request.GetResponse();

                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(interpolatedValues));
                    interpolatedValues lu = null;

                    try
                    {
                        lu = (interpolatedValues)ser.ReadObject(responseStream);
                    }
                    catch (Exception e)
                    {
                        Trace.TraceInformation("ERROR Live electricity could not be retrieved for mac " + mac);
                        return null;
                    }

                    if (lu == null || lu.elements.Count != 24)
                    {
                        Trace.TraceInformation("ERROR Live electricity could not be retrieved or did not have 96 elements for mac " + mac);
                        return null;
                    }

                    List<double> retVal = new List<double>();

                    foreach (dataVal v in lu.elements)
                    {
                        retVal.Add(Math.Round((v.value / 1000), 3));
                    }

                    return retVal;
                }
            }
            catch (WebException ex)
            {
                Trace.TraceInformation("ERROR Live electricity could not be retrieved for mac " + mac);
                return null;
            }
        }
        
        public static List<double> GetElectricityNRGi(string username, string aftagernummer, string dt)
        {
            string date = dt.Replace('-', '/');
            string specs = aftagernummer + "/" + date;
            string url = urlMaster + ":3902/nrgielectricity/delta/" + specs;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Timeout = timeout;
            request.Credentials = new NetworkCredential(Codes.NRGIUSER, Codes.NRGIPASSWORD);

            try
            {
                WebResponse response = request.GetResponse();

                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(NRGiData));
                    NRGiData lu = null;

                    try { lu = (NRGiData)ser.ReadObject(responseStream); }
                    catch (Exception e)
                    {
                        Trace.TraceInformation("ERROR Live electricity could not be retrieved for user " + username);
                        return null;
                    }

                    if (lu == null || lu.meterreadings.Count != 96)
                    {
                        Trace.TraceInformation("ERROR Live electricity could not be retrieved or did not have 96 elements for user " + username);
                        return null;
                    }

                    List<double> collapsed = Helper.CollapseUsage(lu);
                    return collapsed;
                }
            }
            catch (WebException ex)
            {
                Trace.TraceInformation("ERROR Live electricity could not be retrieved for user " + username);
                return null;
            }
        }

        public static List<int> GetForecast(string date)
        {
            string url = urlMaster + ":3901/co2forecast/" + date.Replace('-', '/');

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Timeout = timeout;
            try
            {
                WebResponse response = request.GetResponse();
                using (Stream responseStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(responseStream, Encoding.UTF8);
                    MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(reader.ReadToEnd()));

                    DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(forecasts[]));
                    forecasts[] fc = (forecasts[])ser.ReadObject(stream);

                    if (fc == null) {
                        Trace.TraceInformation("Forecast received was null");
                    }

                    List<int> forecastsInt = new List<int>();

                    foreach (forecasts f in fc)
                    {
                        forecastsInt.Add(f.co2value);
                    }

                    if (forecastsInt.Count != 24)
                        Trace.TraceInformation("ERROR Forecast did not have 24 hours.");

                    return forecastsInt;
                }
            }
            catch (WebException ex)
            {
                Trace.TraceInformation("ERROR Forecast could not be retrieved.");

                return null;
            }
        }
    }
}
