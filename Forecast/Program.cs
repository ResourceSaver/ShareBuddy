using Database.Code;
using Live;
using Live.Code;
using System.Collections.Generic;

namespace Forecast
{
    // To learn more about Microsoft Azure WebJobs, please see http://go.microsoft.com/fwlink/?LinkID=401557
    class Program
    {
        static ConnectionMSSQL conn = new ConnectionMSSQL(Target.ENVIRONMENT);
        
        static void Main()
        {
            string tomorrow = SystemTime.TomorrowReal();
            List<int> forecast = Ecosense.GetForecast(tomorrow);
            conn.LogForecast(forecast, tomorrow);
        }
    }
}
