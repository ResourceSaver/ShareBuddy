using Database.Code;
using New.WebService;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web.Script.Serialization;
using System.Web.Services;

namespace New
{
    [WebService(Namespace = "http://sharebuddydk.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    
    public class WebService2 : System.Web.Services.WebService
    {
        Logger logger = new Logger();
        ConnectionMSSQL conn = new ConnectionMSSQL(Target.ENVIRONMENT);
        JavaScriptSerializer jsonSerialiser = new JavaScriptSerializer();

        [WebMethod]
        public string GetRanking(string username)
        {
            logger.Ranking(username);
            List<Ranking> ranking = conn.GetRanking();
            string retVal = jsonSerialiser.Serialize(ranking);
            return retVal;
        }

        [WebMethod]
        public string GetMiniGameHighScore(int minigameid)
        {
            List<Highscore> highscores = conn.GetMiniGameHighscore(minigameid);
            string retVal = jsonSerialiser.Serialize(highscores);
            return retVal;
        }

        [WebMethod]
        public int SetPetName(string username, string password, bool male, string petname, string referral)
        {
            logger.SetPetName(username, petname, referral);

            int returnCode = conn.LogBuddyName(username, petname, male);

            if (returnCode == 2 && referral != "No one")
            {
                conn.RewardReferral(referral, username);
            }

            return returnCode;
        }

        [WebMethod]
        public void CompleteAction(string username, string password, int actionid, int minigamescore, string type, bool cancelled, bool exhausted)
        {
            if (!conn.ValidateUser(username, password)) return;

            conn.UpdateHighScore(username, actionid, minigamescore);

            string date = SystemTime.TodayGame();
            Event ev = conn.GetEvent(username, date);

            int boost = 0;

            if (ev != null && ev.type == "block" && ev.target == type)
            {
                return; // blocked
            }
            else if (ev != null && ev.type == "boost" && Convert.ToInt16(ev.target) == actionid)
            {
                boost = ev.value; // boost
            }

            logger.CompleteAction(username, actionid, minigamescore, cancelled, exhausted);
            conn.PerformActivity(username, actionid, minigamescore, boost);
        }

        [WebMethod]
        public string GetTomorrowsForecast()
        {
            string tomorrow = SystemTime.TomorrowReal();
            List<int> forecast = conn.GetForecast(tomorrow);
            string retval = jsonSerialiser.Serialize(forecast);
            return retval;
        }

        [WebMethod]
        public string GetUsageHistory(string username, string password, string date)
        {
            if (!conn.ValidateUser(username, password)) return null;

            date = SystemTime.TodayGame();

            Usage usage = conn.GetUsage(username, date);
            int dayofweekYesterday = SystemTime.GetDayOfWeekYesterday();
            usage.electricityBaselineArray = conn.GetBaselineElectricity(dayofweekYesterday, username);
            logger.GetUsageHistory(usage, username);

            string retVal = jsonSerialiser.Serialize(usage);
            return retVal;
        }
        
        [WebMethod]
        public string IsDayReady()
        {
            bool res = conn.IsDayReady();
            string retVal = jsonSerialiser.Serialize(res);
            return retVal;
        }

        [WebMethod]
        public string Login(string username, string password)
        {
            Controller controller = new Controller();
            Data data = controller.Login(username, password);
            logger.Login(data, username);
            string retVal = jsonSerialiser.Serialize(data);
            return retVal;
        }
    }
}
