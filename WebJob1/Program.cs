using Database.Code;
using System.Collections.Generic;
namespace NewDay
{
    // To learn more about Microsoft Azure WebJobs, please see http://go.microsoft.com/fwlink/?LinkID=401557
    class Program
    {
        static ConnectionMSSQL conn = new ConnectionMSSQL(Target.ENVIRONMENT);

        static void Main()
        {
            conn.NQ("TRUNCATE TABLE  eventstoday;");
            conn.LogEvents(SystemTime.TodayReal());
            conn.NQ("TRUNCATE TABLE  played;");
            conn.NQ("INSERT INTO  daysbegun (day) VALUES ('" + SystemTime.TodayReal() + "');");
        }
    }
}
