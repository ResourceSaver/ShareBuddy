using Database.Code;
using Live;
using System;
using System.Collections.Generic;

namespace UsageHistory
{
    // To learn more about Microsoft Azure WebJobs, please see http://go.microsoft.com/fwlink/?LinkID=401557
    
    class Program
    {
        static ConnectionMSSQL conn = new ConnectionMSSQL(Target.ENVIRONMENT);
        static ElectricityCalculator ecc = new ElectricityCalculator();

        static void Main()
        {
            string yesterday = SystemTime.YesterdayReal();
            int dayofweekYesterday = SystemTime.GetDayOfWeekYesterday();
            ecc.SetForecast(conn.GetForecast(yesterday));

            List<User> users = conn.GetUsers();

            foreach (User user in users)
            {
                WaterData waterObj = Ecosense.GetWaterYesterday(user.appartmentId);
                double waterBaseline = conn.GetBaselineWater(user.username, dayofweekYesterday);

                List<double> electricity = Ecosense.GetElectricityYesterdayWattDepot(user.macAddress);
                List<double> electricityBaseline = conn.GetBaselineElectricity(dayofweekYesterday, user.username);
                ElectricityData ed = ecc.GetElectricityInfo(electricity, electricityBaseline);

                double water = -1;

                if (waterObj != null)
                {
                    waterBaseline = Math.Round(waterBaseline, 0);
                    water = Math.Round(waterObj.deltaValue, 0);
                }
                else
                {
                    waterBaseline = 0;
                }

                conn.AdjustShifting(user.username, ed);
                conn.LogUsage(user.username, SystemTime.TodayReal(), water, waterBaseline, ed);
            }
        }
    }
}
