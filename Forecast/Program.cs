using Database.Code;
using Live;
using Live.Code;
using System.Collections.Generic;
using System.Threading;

namespace Forecast
{
    // To learn more about Microsoft Azure WebJobs, please see http://go.microsoft.com/fwlink/?LinkID=401557
    class Program
    {
        static ConnectionMSSQL conn = new ConnectionMSSQL(Target.ENVIRONMENT);
        
        static void Main()
        {
            string tomorrow = SystemTime.TomorrowReal();
            List<int> forecast = GetForecast(tomorrow);
            int numberOfAttempts = 0;

            while (forecast == null && numberOfAttempts < 3)
            {
                Thread.Sleep(60000);
                forecast = GetForecast(tomorrow);
                numberOfAttempts++;
            }
            
            conn.LogForecast(forecast, tomorrow);
        }


        static List<int> GetForecast(string date){ return Ecosense.GetForecast(date); }
    }
}
