using Database.Code;
using System.Collections.Generic;

namespace New.WebService
{
    public class Controller
    {
        ConnectionMSSQL conn = new ConnectionMSSQL(Target.ENVIRONMENT);

        public Data Login(string username, string password)
        {
            Data data = new Data();
            string date = SystemTime.TodayGame();

            data.login = conn.ValidateUser(username, password);
            data.serviceTime = SystemTime.GetServiceTime();
            data.dayReady = conn.IsDayReady();

            if (data.login && data.dayReady)
            {
                data.reward = conn.GetRewarding(username, date);
                data.todaysEvent = GetEvent(username, date);
                data.activities = conn.GetActivities(username, data.todaysEvent);
                data.playerdata = conn.GetPlayerData(username);
                data.usage = GetUsage(username, date);
                data.updateHour = SystemTime.GetUpdateHour();
            }

            return data;
        }

        private Event GetEvent(string username, string date)
        {
            Event ev = conn.GetEvent(username, date);
            if (ev == null || ev.released) return null;
            else if (ev.type == "value" && !ev.released) { conn.TriggerEvent(username, date, ev.id); }
            else { }  // release event to prevent them from showing e.g. blocking, boosting and messages
            return ev;
        }

        private Usage GetUsage(string username, string date)
        {
            Usage usage = conn.GetUsage(username, date);
            int dayofweekYesterday = SystemTime.GetDayOfWeekYesterday();
            usage.electricityBaselineArray = conn.GetBaselineElectricity(dayofweekYesterday, username);
            return usage;
        }
    }

    public class Data
    {
        public bool login { get; set; }
        public List<Activity> activities { get; set; }
        public PlayerData playerdata { get; set; }
        public Usage usage { get; set; }
        public Rewards reward { get; set; }
        public Event todaysEvent { get; set; }
        public int updateHour { get; set; }
        public string serviceTime { get; set; }
        public bool dayReady { get; set; }
    }

}