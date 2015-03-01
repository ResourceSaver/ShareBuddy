using Database.Code;
using Live;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace CreateUsers.Code
{
    class Baselines
    {
        static ConnectionMSSQL conn;
        static int numberOfWeeks = 6;
        static DateTime endDate = DateTime.UtcNow.AddDays(-1);

        public static void SetBaselines(Target target){
            conn = new ConnectionMSSQL(target);
            
            DateTime startDate = endDate.AddDays(-(7 * Baselines.numberOfWeeks));

            foreach (User user in conn.GetUsers())
            {
                if (user.username == "117B") Baselines.Create(user, startDate);
            }

            Console.ReadLine();



            //conn.NQ("DELETE FROM baseline");
            //conn.NQ("DELETE FROM baselinewater");




            //DateTime startDate = endDate.AddDays(-(7 * Baselines.numberOfWeeks));
            
            //foreach (User user in conn.GetUsers())
            //{
            //    Baselines.Create(user, startDate);
            //}

            //Console.ReadLine();
        }

        private static void Create(User user, DateTime startDate)
        {
            DateTime currentDate = startDate;

            double[] weekwater = new double[7];
            int[] nrOfSamplesWater = new int[7];
            double[][] weekelectricity = new double[7][];
            int[] nrOfSamplesElectricity = new int[7];

            for (int i = 0; i < weekelectricity.Length; i++) { weekelectricity[i] = new double[24]; }

            while (currentDate.Date != endDate.Date)
            {
                int weekday = (int)currentDate.DayOfWeek;

                List<double> electricity = Ecosense.GetElectricityNRGi(user.username, user.aftagenummer, currentDate.ToString("yyyy-MM-dd"));

                if (electricity != null)
                {
                    weekelectricity[weekday] = weekelectricity[weekday].Zip(electricity, (x, y) => x + y).ToArray();
                    nrOfSamplesElectricity[weekday]++;
                }
                else
                {
                    Console.WriteLine("No electricity for user " + user.username + " " + currentDate);
                }

                WaterData water = Ecosense.GetWater(user.appartmentId, currentDate.ToString("yyyy-MM-dd"));

                if (water != null)
                {
                    weekwater[weekday] += water.deltaValue;
                    nrOfSamplesWater[weekday]++;
                }
                else
                {
                    Console.WriteLine("No water for user " + user.username + " " + currentDate);
                }

                currentDate = currentDate.AddDays(1);
            }

            SaveWaterBaseline(weekwater, user.username, nrOfSamplesWater);
            SaveElectricityBaseline(weekelectricity, user.username, nrOfSamplesElectricity);

            Console.WriteLine("");
        }

        private static void SaveWaterBaseline(double[] baseline, string username, int[] nrOfSamples){

            for (int i = 0; i < baseline.Length; i++)
            {
                if (nrOfSamples[i] == 0)
                {
                    Console.WriteLine("No water samples for user " + username + " for day: " + i);
                    return;
                }

                int rounded = Convert.ToInt32(baseline[i] / nrOfSamples[i]);

                conn.NQ("INSERT INTO baselinewater(username, value, dayofweek) VALUES('" + username + "'," + rounded + "," + i + ")");
            }
        }

        private static void SaveElectricityBaseline(double[][] week, string username, int[] nrOfSamples)
        {
            for (int i = 0; i < week.Count(); i++)
            {
                double[] day = week[i];

                if (nrOfSamples[i] == 0)
                {
                    Console.WriteLine("No electricity samples for user " + username + " for day " + i);
                    return;
                }

                day = day.Select(x => x =  Math.Round(x / nrOfSamples[i], 3)).ToArray();

                string baselineString = String.Join(";", day.Select(x => Convert.ToDouble(x, CultureInfo.InvariantCulture)));
                baselineString = baselineString.Replace(',', '.');

                conn.NQ("INSERT INTO  baseline ([user], [dayofweek], [data]) VALUES ('" + username + "'," + i + ",'" + baselineString + "');");
            }
        }
    }
}
