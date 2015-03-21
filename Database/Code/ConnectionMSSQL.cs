using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Globalization;
using System.Linq;

namespace Database.Code
{
    public enum Target
    {
        ONLINE,
        OFFLINE,
        ENVIRONMENT
    }

    public class ConnectionMSSQL
    {
        public ConnectionMSSQL(Target target) {
            if (target == Target.ENVIRONMENT)
            {
                var connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connstring"];
                connection = new SqlConnection(connectionString.ConnectionString);
            }
            else if (target == Target.OFFLINE) { connection = new SqlConnection(Codes.OFFLINE); }
            else connection = new SqlConnection(Codes.ONLINE);
        }

        public bool ValidateUser(string username, string password)
        {
            bool res = false;

            if (Q("(SELECT * FROM users WHERE username = '" + username + "'AND password = '" + password + " ')"))
            {
                res = reader.HasRows;
            }

            Close();
            return res;
        }

        public bool IsDayReady()
        {
            bool dayReady = false;

            if (Q("SELECT * FROM  daysbegun WHERE day = '" + SystemTime.TodayGame() + "';"))
            {
                dayReady = reader.HasRows;
            }

            Close();

            return dayReady;
        }

        public void TriggerEvent(string username, string date, int eventid)
        {
            string query = "TriggerEvent";

            if (this.OpenConnection())
            {
                SqlCommand cmd = new SqlCommand(query, connection);
                cmd.Parameters.Add(new SqlParameter("player", username));
                cmd.Parameters.Add(new SqlParameter("datein", date));
                cmd.Parameters.Add(new SqlParameter("idin", eventid));

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                this.CloseConnection();
            }
        }

        public void PerformActivity(string username, int actionId, int minigamescore, int boost)
        {
            string query = "PerformAction";

            if (this.OpenConnection())
            {
                SqlCommand cmd = new SqlCommand(query, connection);
                cmd.Parameters.Add(new SqlParameter("actionid", actionId));
                cmd.Parameters.Add(new SqlParameter("name", username));
                cmd.Parameters.Add(new SqlParameter("minigamescore", minigamescore));
                cmd.Parameters.Add(new SqlParameter("boost", boost));

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                this.CloseConnection();
            }
        }

        public void AdjustShifting(string username, ElectricityData ed)
        {
            string valStr = "0.0";

            if (ed != null && !double.IsNaN(ed.shifting))
                valStr = Convert.ToString(Math.Round(ed.shifting, 3), CultureInfo.InvariantCulture);

            NQ("UPDATE  users SET shifting = shifting + '" + valStr + "' WHERE username = '" + username + "'");
        }

        // LOG VALUES
        
        public void LogUsage(string username, string date, double water, double waterbaseline, ElectricityData ed)
        {
            string usage24str = "";
            double co2 = -1;
            double co2baseline = 0;

            string shiftingstr = "0.0";
            string electricitystr = "-1.0";
            string electricitybaselinestr = "0.0";

            if (ed != null)
            {
                co2 = Math.Round(ed.co2UsageSum, 0);
                co2baseline = Math.Round(ed.co2BaselineSum, 0);
                usage24str = string.Join(";", ed.usage24hour.Select(x => Convert.ToString(x, CultureInfo.InvariantCulture)));
                shiftingstr = Convert.ToString(Math.Round(ed.shifting, 2), CultureInfo.InvariantCulture);
                electricitystr = Convert.ToString(Math.Round(ed.usageSum, 3), CultureInfo.InvariantCulture);
                electricitybaselinestr = Convert.ToString(Math.Round(ed.baselineSum, 3), CultureInfo.InvariantCulture);
            }

            NQ("INSERT INTO usagehistory (username, date, released, co2, co2baseline, water, waterbaseline, electricity, electricitybaseline, eusage, shifting) VALUES ('" + username + "','" + date + "'," + 0 + "," + co2 + "," + co2baseline + "," + water + "," + waterbaseline + ",'" + electricitystr + "','" + electricitybaselinestr + "','" + usage24str + "'," + shiftingstr + ");");
        }

        public void LogForecast(List<int> forecast, string date)
        {
            if (forecast == null) return;
            string forecastStr = string.Join(";", forecast);
            NQ("INSERT INTO  forecast(date, data) VALUES ('" + date + "','" + forecastStr + "');");
        }

        public int LogBuddyName(string username, string petname, bool male)
        {
            // 0 = error, 1 = name taken 2 = OK

            int retVal = 0;
            string query = "SetPetName";

            if (this.OpenConnection())
            {
                SqlCommand cmd = new SqlCommand(query, connection);
                cmd.Parameters.Add(new SqlParameter("player", username));
                cmd.Parameters.Add(new SqlParameter("petname", petname));
                cmd.Parameters.Add(new SqlParameter("male", male));

                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    retVal = (int)reader["result"];
                }
                this.CloseConnection();
            }

            return retVal;
        }

        public void UpdateHighScore(string username, int activityid, int score)
        {
            int minigameid = -1;

            if (activityid < 4)
            {
                minigameid = 1;
            }
            else if (activityid < 7)
            {
                minigameid = 3;
            }
            else if (activityid < 10)
            {
                minigameid = 4;
            }
            else if (activityid < 13)
            {
                minigameid = 2;
            }
                        
            if (this.OpenConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("UpdateHighscore", connection);
                    cmd.Parameters.Add(new SqlParameter("username", username));
                    cmd.Parameters.Add(new SqlParameter("minigameid", minigameid));
                    cmd.Parameters.Add(new SqlParameter("score", score));
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.ExecuteNonQuery();
                }
                catch (Exception e)
                {
                }
                this.CloseConnection();
            }
        }

        public void LogEvents(string date)
        {
            if (this.OpenConnection())
            {
                SqlCommand cmd = new SqlCommand("SetEvent", connection);
                cmd.Parameters.Add(new SqlParameter("datein", date));
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.ExecuteNonQuery();
                this.CloseConnection();
            }
        }

        public void RewardReferral(string referrer, string referree)
        {
            NQ("UPDATE users SET score = score + 300 WHERE username = '" + referrer + "';");
            NQ("UPDATE users SET score = score + 450 WHERE username = '" + referree + "';");
        }

        // GET VALUES

        public List<Highscore> GetMiniGameHighscore(int minigameid)
        {
            List<Highscore> highscorelist = new List<Highscore>();

            if (Q("SELECT TOP(5) * FROM dbo.highscores WHERE minigameid = " + minigameid + " ORDER BY highscore desc "))
            {
                while (reader.Read())
                {
                    Highscore highscore = new Highscore();
                    highscore.score = (int) reader["highscore"];
                    highscore.buddyname = reader["username"].ToString();
                    highscorelist.Add(highscore);
                }
            }

            Close();

            return highscorelist;
        }

        public Usage GetUsage(string username, string date)
        {
            string query = "GetUsage";
            Usage u = null;

            if (OpenConnection())
            {
                SqlCommand cmd = new SqlCommand(query, connection);
                cmd.Parameters.Add(new SqlParameter("player", username));
                cmd.Parameters.Add(new SqlParameter("datein", date));
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    u = new Usage();
                    u.UsageExists = false;

                    string today = reader["today"].ToString();
                    string yesterday = reader["yesterday"].ToString();
                    string eu = reader["eu"].ToString();

                    if (!DBNull.Value.Equals(reader["water"]))
                        u.waterUsage = (double)reader["water"];

                    if (!DBNull.Value.Equals((reader["waterbaseline"])))
                        u.waterbaseline = Convert.ToDouble(reader["waterbaseline"]);

                    if (!DBNull.Value.Equals(reader["co2"]))
                        u.co2 = (double)reader["co2"];

                    if (!DBNull.Value.Equals((reader["co2baseline"])))
                        u.co2baseline = Convert.ToDouble(reader["co2baseline"]);

                    if (!DBNull.Value.Equals(reader["electricity"]))
                        u.electricity = (double)reader["electricity"];

                    if (!DBNull.Value.Equals(reader["electricitybaseline"]))
                        u.electricitybaseline = (double)reader["electricitybaseline"];

                    if (!DBNull.Value.Equals((reader["shifting"])))
                        u.shifting = Convert.ToDouble(reader["shifting"]);

                    if (!String.IsNullOrEmpty(today))
                        u.forecastToday = today.Split(';').Select(int.Parse).ToList();

                    if (!String.IsNullOrEmpty(yesterday))
                    { u.forecastYesterday = yesterday.Split(';').Select(int.Parse).ToList(); }

                    if (!String.IsNullOrEmpty(eu))
                    {
                        u.eusage = eu.Split(';').Select(s => double.Parse(s, CultureInfo.InvariantCulture)).ToList();
                        u.UsageExists = true;
                    }
                }

                reader.Close();
                this.CloseConnection();
            }

            return u;
        }

        public List<int> GetForecast(string date)
        {
            string res = "";
            List<int> forecast = new List<int>();

            if (Q("SELECT data FROM  forecast WHERE date = '" + date + "';"))
            {
                while (reader.Read())
                {
                    res = reader["data"].ToString();
                }
            }

            Close();

            if (!String.IsNullOrEmpty(res))
            {
                forecast = res.Split(';').Select(int.Parse).ToList();
            }

            return forecast;
        }

        public List<double> GetBaselineElectricity(int dayofweek, string username)
        {
            string res = "";
            List<double> baseline = new List<double>();
            
            if (Q("SELECT data FROM  baseline WHERE dayofweek = " + dayofweek + " AND [user] = '" + username + "';"))
            {
                while (reader.Read())
                {
                    res = reader["data"].ToString();
                }
            }

            Close();

            if (!String.IsNullOrEmpty(res))
            {
                baseline = res.Split(';').Select(x => Convert.ToDouble(x, CultureInfo.InvariantCulture)).ToList();
            }

            return baseline;
        }

        public double GetBaselineWater(string username, int dayofweek)
        {
            double res = 0.0;

            if (Q("SELECT value FROM  baselinewater WHERE dayofweek = " + dayofweek + " AND username = '" + username + "';"))
            {
                while (reader.Read())
                {
                    res = Convert.ToDouble(reader["value"]);
                }
            }
            Close();
            return res;
        }

        public List<User> GetUsers()
        {
            List<User> res = new List<User>();

            if (Q("SELECT username, number, appartmentId, mac FROM  users;"))
            {
                while (reader.Read())
                {
                    User user = new User();

                    user.username = reader["username"].ToString();
                    user.aftagenummer = reader["number"].ToString();
                    user.appartmentId = reader["appartmentId"].ToString();
                    user.macAddress = reader["mac"].ToString();
                    res.Add(user);
                }
            }

            Close();

            return res;
        }

        public Event GetEvent(string username, string date)
        {
            string query = "SELECT EventTypes.*,released FROM   eventstoday  LEFT JOIN   EventTypes on eventstoday.eventid = EventTypes.id WHERE username = '" + username + "' AND date = '" + date + "';";
            Event ev = null;

            if (Q(query))
            {
                while (reader.Read())
                {
                    ev = new Event();
                    ev.id = (int)reader["id"];
                    ev.target = reader["target"].ToString();
                    ev.type = reader["type"].ToString();
                    ev.value = (int)reader["value"];
                    ev.text = reader["text"].ToString();

                    bool rel = Convert.ToBoolean(reader["released"]);
                    ev.released = rel;
                }
            }

            Close();
            return ev;
        }

        public List<Ranking> GetRanking()
        {
            List<Ranking> ranking = new List<Ranking>();

            if (Q("SELECT username,pet,score,shifting FROM  users WHERE pet != '' ORDER BY score DESC"))
            {
                int count = 0;
                int king = -1;
                double maxShifting = double.MinValue;

                while (reader.Read())
                {
                    Ranking userdata = new Ranking();
                    userdata.score = (int)reader["score"];
                    userdata.name = reader["pet"].ToString();
                    userdata.username = reader["username"].ToString();

                    double shifting = Convert.ToDouble(reader["shifting"]);
                    if (shifting > maxShifting)
                    {
                        maxShifting = shifting;
                        king = count;
                    }

                    count++;

                    if (String.IsNullOrEmpty(userdata.name)) continue;
                    ranking.Add(userdata);
                }

                if (king != -1)
                    ranking[king].king = true;
            }

            Close();

            return ranking;
        }

        public PlayerData GetPlayerData(string username)
        {
            PlayerData data = new PlayerData();

            if (Q("SELECT * FROM  users WHERE username = '" + username + "'"))
            {
                while (reader.Read())
                {
                    data.electricity = (int)reader["electricity"];
                    data.pet = reader["pet"].ToString();
                    data.score = (int)reader["score"];
                    data.water = (int)reader["water"];
                    data.male = Convert.ToBoolean(reader["male"]);
                }
            }

            Close();
            return data;
        }

        public List<Activity> GetActivities(string username, Event ev)
        {
            List<Code.Activity> actions = new List<Code.Activity>();

            if (Q("SELECT actions.*, played.type as played FROM   actions LEFT JOIN  played ON actions.type = played.type AND username = '" + username + "'"))
            {
                while (reader.Read())
                {
                    Code.Activity action = new Code.Activity();
                    action.electricity = (int)reader["electricity"];
                    action.water = (int)reader["water"];
                    action.description = reader["description"].ToString();
                    action.type = reader["type"].ToString();
                    action.id = (int)reader["id"];
                    action.played = !String.IsNullOrEmpty(reader["played"].ToString());
                    action.value = (int)reader["value"];

                    if (ev != null && ev.type == "block" && action.type == ev.target)
                    {
                        action.blocked = true;
                    }
                    if (ev != null && ev.type == "boost" && Convert.ToInt16(ev.target) == action.id)
                    {
                        action.boost = ev.value;
                    }

                    actions.Add(action);
                }
            }

            Close();

            return actions;
        }

        public Rewards GetRewarding(string username, string date)
        {
            string query =  "GetRewarding";
            Rewards r = null;

            if (this.OpenConnection())
            {
                try
                {
                    SqlCommand cmd = new SqlCommand(query, connection);
                    cmd.Parameters.Add(new SqlParameter("player", username));
                    cmd.Parameters.Add(new SqlParameter("datein", date));
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        r = new Rewards();
                        r.electricityReduction = Convert.ToDouble(reader["percE"]);
                        r.electricityScore = Convert.ToDouble(reader["scoreE"]);
                        r.waterReduction = Convert.ToDouble(reader["percW"]);
                        r.waterScore = Convert.ToDouble(reader["scoreW"]);
                    }

                    reader.Close();
                }
                catch (Exception e)
                { }

                this.CloseConnection();
            }

            return r;
        }
        
        // Internal

        SqlConnection connection;
        SqlDataReader reader;

        private bool OpenConnection()
        {
            try
            {
                connection.Open();
                return true;
            }
            catch (Exception ex)
            {
                Trace.TraceInformation("Error: Open db failed: " + ex + " " + ex.Message);
                return false;
            }
        }

        private bool CloseConnection()
        {
            try
            {
                connection.Close();
                //connection.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                Trace.TraceInformation("Error: Close db failed: " + ex + " " + ex.Message);
                return false;
            }
        }

        private bool Q(string s)
        {
            if (this.OpenConnection())
            {
                try { 
                    SqlCommand myCommand = new SqlCommand(s, connection);
                    reader = myCommand.ExecuteReader();}
                catch(Exception e){
                    Trace.TraceInformation("Error: Query failed " + s);
                }
        }

            return (reader != null);
        }

        public bool NQ(string s)
        {
            bool result = false;

            if (this.OpenConnection())
            {
                try
                {
                    SqlCommand myCommand = new SqlCommand(s, connection);
                    myCommand.ExecuteNonQuery();
                    Close();
                    result = true;
                }
                catch (Exception e)
                {
                    Trace.TraceInformation("Error: NQ failed " + s);
                    result = false;
                }
            }

            Close();
            return result;
        }

        private void Close()
        {
            if (reader != null)
                reader.Close();
            reader = null;
            connection.Close();
        }
        
        public void WriteToFile()
        {
            if (Q("SELECT * FROM baselinewater"))
            {
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(@"C:\hej\test.txt"))
                {
                    while (reader.Read())
                    {
                        string s = "";
                        s += reader["username"] + "," + reader["value"] + "," + reader["dayofweek"];


                        file.WriteLine(s);
                    }
                }
            }
        }
    }
}