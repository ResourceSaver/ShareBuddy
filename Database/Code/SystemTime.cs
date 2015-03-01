using System;

namespace Database.Code
{
    public class SystemTime
    {
        private static int updateHour = 1;

        private static DateTime Today()
        {
            DateTime now = DateTime.UtcNow;
            return now.AddHours(1);
        }

        private static DateTime Tomorrow()
        {
            DateTime today = SystemTime.Today();
            return today.AddDays(1);
        }

        private static DateTime Yesterday()
        {
            DateTime today = SystemTime.Today();
            return today.AddDays(-1);
        }

        // Real

        public static string TodayReal()
        {
            DateTime now = SystemTime.Today();
            return now.ToString("yyyy-MM-dd");
        }
       
        public static string TomorrowReal()
        {
            DateTime tomorrow = SystemTime.Tomorrow();
            return tomorrow.ToString("yyyy-MM-dd");
        }
                
        public static string YesterdayReal()
        {
            DateTime yesterday = SystemTime.Yesterday();
            return yesterday.ToString("yyyy-MM-dd");
        }
    
        // Game

        public static string TodayGame()
        {
            DateTime now = SystemTime.Today();

            if (now.Hour < SystemTime.updateHour)
            {
                now = now.AddDays(-1);
            }

            return now.ToString("yyyy-MM-dd");
        }

        // Other

        public static int GetUpdateHour()
        {
            return SystemTime.updateHour;
        }

        public static string GetServiceTime()
        {
            DateTime now = SystemTime.Today();
            return now.ToString("MM/dd/yyyy HH:mm:ss");
        }

        public static int GetDayOfWeekYesterday()
        {
            return (int)SystemTime.Yesterday().DayOfWeek;
        }
    }
}
