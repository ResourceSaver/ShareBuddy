using Database.Code;
using System;
using System.Diagnostics;

namespace New.WebService
{
    public class Logger
    {
        public void Ranking(string user)
        {
            Write("Ranking:{user:" + user + ";}");
        }

        public void CompleteAction(string user, int action, int minigamescore, bool cancelled, bool moreOptions)
        {
            string log = "ActionComplete:{user:" + user + ";action:" + action + ";minigamescore:" + minigamescore + ";cancelled:" + cancelled + ";moreoptions:" + moreOptions + ";}";
            Write(log);
        }

        public void GetUsageHistory(Usage usage, string user)
        {
            string log = "GetUSageHistory:{user:" + user + ";";

            if (usage != null && usage.eusage != null && usage.UsageExists)
            {
                string hours24 = String.Join(";", usage.eusage);
                log += "co2:" + usage.co2 + ";co2b:" + usage.co2baseline + ";electricity:" + usage.electricity + ";baselineE:" + usage.electricitybaseline + ";waterusage:" + usage.waterUsage + "baselineW:" + usage.waterbaseline + ";shifting:" + usage.shifting + ";";
            }

            log += "}";

            Write(log);
        }

        public void SetPetName(string user, string avatarname)
        {
            Write("SetPetName:{user:" + user + ";avatar:" + avatarname + ";");
        }

        public void Login(Data data, string username)
        {

            if (!data.login) return;

            PlayerData pld = data.playerdata;
            Usage usage = data.usage;
            Rewards reward = data.reward;
            Event ev = data.todaysEvent;

            Write("Login:{user:" + username + ";}");
            this.PlayerData(pld, username);
            this.GetUsageHistory(usage, username);
            this.GetRewarding(reward, username);
            this.GetDailyEvent(ev, username);
        }

        public void PlayerData(PlayerData pl, string username)
        {
            if (pl == null) return;

            string log = "Playerdata:{user:" + username + ";score:" + pl.score + ";electricity:" + pl.electricity + ";water:" + pl.water + ";}";
            Write(log);
        }

        public void GetRewarding(Rewards usage, string user)
        {
            if (usage == null) return;

            string log = "GetRewarding:{user:" + user + ";electricitypoints:" + usage.electricityScore + ";electricityRed:" + usage.electricityReduction + ";waterpoints:" + usage.waterScore + ";waterRed: " + usage.waterReduction + ";}";
            Write(log);
        }

        public void GetDailyEvent(Event ev, string user)
        {

            if (ev == null) return;
            string log = "DailyEvent:{user:" + user + ";id:" + ev.id + ";type:" + ev.type + ";value:" + ev.value + ";}";
            Write(log);
        }

        private void Write(string text)
        {
            Trace.TraceInformation(text);
        }
    }
}