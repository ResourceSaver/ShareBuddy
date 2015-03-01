using Database.Code;
using Live;
using Live.Code;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreateUsers.Code
{
    class SetupDB
    {
        static ConnectionMSSQL conn;

        public static void Setup(Target target)
        {
            conn = new ConnectionMSSQL(target);

            //ClearDB();
            //Forecasts();
            //Actions();
            //Events();
            //Schedule();
        }

        public static void ClearDB()
        {
            conn.NQ("DELETE FROM  actions");
            conn.NQ("DELETE FROM  daysbegun");
            conn.NQ("DELETE FROM  eventschedule");
            conn.NQ("DELETE FROM  eventstoday");
            conn.NQ("DELETE FROM  forecast");
            conn.NQ("DELETE FROM  played");
            conn.NQ("DELETE FROM  usagehistory");
        }

        private static void Actions(){

            string query = "INSERT INTO  actions (type, description, value, electricity, water, id) VALUES (";

            int elCost1 = 1;
            int elCost2 = 10;
            int elCost3 = 60;

            int elScore1 = 25;
            int elScore2 = 200;
            int elScore3 = 700;

            int waterCost1 = 1;
            int waterCost2 = 15;
            int waterCost3 = 60;

            int waterScore1 = 25;
            int waterScore2 = 600;
            int waterScore3 = 1500;


            conn.NQ(query + "'Cooking', 'Cook popcorn', " + elScore1 + ", " + elCost1 + ", 0, 1);");
            conn.NQ(query + "'Cooking', 'Cook pasta'," + elScore2 + ", " + elCost2 + ", 0, 2);");
            conn.NQ(query + "'Cooking', 'Cook pizza'," + elScore3 + ", " + elCost3 + ", 0, 3);");

            conn.NQ(query + "'Leisure', 'Use e-reader', " + elScore1 + ", " + elCost1 + ", 0, 4);");
            conn.NQ(query + "'Leisure', 'Use laptop', " + elScore2 + ", " + elCost2 + ", 0, 5);");
            conn.NQ(query + "'Leisure', 'Watch TV', " + elScore3 + ", " + elCost3 + ", 0, 6);");

            conn.NQ(query + "'Fitness', 'Work out to music', " + elScore1 + ", " + elCost1 + ", 0, 7);");
            conn.NQ(query + "'Fitness', 'Use solarium', " + elScore2 + ", " + elCost2 + ", 0, 8);");
            conn.NQ(query + "'Fitness', 'Use treadmill', " + elScore3 + ", " + elCost3 + ", 0, 9);");

            conn.NQ(query + "'Hygiene', 'Brush teeth', " + waterScore1 + ", 0, " + waterCost1 + ", 10);");
            conn.NQ(query + "'Hygiene', 'Shave', " + waterScore2 + ", 0, " + waterCost2 + ", 11);");
            conn.NQ(query + "'Hygiene', 'Shower', " + waterScore3 + ", 0," + waterCost3 + ", 12);");
        }

        private static void Forecasts()
        {
            string tomorrow = SystemTime.TomorrowReal();
            string today = SystemTime.TodayReal();
            string yesterday = SystemTime.YesterdayReal();

            List<int> forecasttomorrow = Ecosense.GetForecast(tomorrow);
            conn.LogForecast(forecasttomorrow, tomorrow);

            List<int> forecasttoday = Ecosense.GetForecast(today);
            conn.LogForecast(forecasttoday, today);

            List<int> forecastyesterday = Ecosense.GetForecast(yesterday);
            conn.LogForecast(forecastyesterday, yesterday);
        }

        private static void Events()
        {
            conn.NQ("DELETE FROM  EventTypes");

            string query = "INSERT INTO  EventTypes (id, type, target, value, text) VALUES (";

            conn.NQ(query + "0, 'block', 'Cooking', 0, '[p] is feeling sick and lost [g] appetite, so no cooking activities today.')");
            conn.NQ(query + "1, 'block', 'Cooking', 0, 'The oven broke, so there are no cooking activities today.')");
            conn.NQ(query + "2, 'block', 'Cooking', 0, '[p] forgot to shop for groceries, so no cooking today.')");

            conn.NQ(query + "3, 'block', 'Hygiene', 0, '[p] is feeling lazy. There are no hygiene activities today.')");
            conn.NQ(query + "4, 'block', 'Hygiene', 0, '[p] is feeling clean, so hygiene activities aren’t available today.')");
            conn.NQ(query + "5, 'block', 'Hygiene', 0, '[p] found a dead pigeon in the water tank this morning. There are no hygiene activities today.')");

            conn.NQ(query + "6, 'block', 'Fitness', 0, '[p] was out late partying last night and doesn’t feel like doing any fitness today.')");
            conn.NQ(query + "7, 'block', 'Fitness', 0, '[p] hurt [g] back last night, so there are no fitness activities today.')");
            conn.NQ(query + "8, 'block', 'Fitness', 0, '[p] read in the morning paper that the local gym is closed down for cleaning. There are no fitness activities today.')");

            conn.NQ(query + "9, 'block', 'Leisure', 0, '[p] is feeling active so there is no time for leisure activities today.')");
            conn.NQ(query + "10, 'block', 'Leisure', 0, '[p] was relaxing last night so there is no time for leisure activities today.')");
            conn.NQ(query + "11, 'block', 'Leisure', 0, '[p] needs to get [g] re-hand-in ready on time. There is no time for leisure activities today.')");

            conn.NQ(query + "12, 'value', 'mood', 50, '[p] had a great nights sleep so [g] mood went up by [v] points.')");
            conn.NQ(query + "13, 'value', 'mood', 50, '[p] just finished cleaning the house so [g] mood went up by [v] points.')");
            conn.NQ(query + "14, 'value', 'mood', -50, '[p] had a nightmare about the boogeyman so [g] mood went down by [v] points.')");
            conn.NQ(query + "15, 'value', 'mood', -50, '[p]’s favourite rock musician died from food poisoning yesterday, so [g] mood went down by [v] points.')");

            conn.NQ(query + "16, 'value', 'water', 5, '[p] took a shorter shower this morning and saved [v] water points.')");
            conn.NQ(query + "17, 'value', 'water', -5, '[p] forgot to turn the water off last night and lost [v] water points.')");
            conn.NQ(query + "18, 'value', 'water', -10, '[p] accidentally set [g] house on fire and had to spend [v] water points putting it out.')");
            conn.NQ(query + "19, 'value', 'water', -10, '[p] went crazy with [g] Super Soaker 6000 last night so [g] water went down by [v].')");

            conn.NQ(query + "20, 'value', 'electricity', 10, '[p] finally remembered to boil water for coffee in the kettle instead of in the pot. [p] earned [v] electricity points.')");
            conn.NQ(query + "21, 'value', 'electricity', 10, '[p] cooked lunch in the best hour of the forecast and saved [v] electricity points.')");
            conn.NQ(query + "22, 'value', 'electricity', -10, '[p] forgot to turn off [g] computer yesterday and lost [v] electricity points.')");
            conn.NQ(query + "23, 'value', 'electricity', -10, '[p]’s stereo has been playing [g] favourite Justin Bieber album non-stop for 2 days now so [g] electricity went down by [v].')");

            conn.NQ(query + "24, 'boost', '1', 100, '[p] feels like a snack. There is a [v] mood point bonus for selecting the <strong>cook popcorn</strong> activity today.')");
            conn.NQ(query + "25, 'boost', '2', 200, '[p] watched Lady and the Tramp last night and is in the mood for pasta. There is a [v] mood point bonus for selecting the <strong>cook pasta</strong> activity today.')");
            conn.NQ(query + "26, 'boost', '3', 300, '[p] watched The Godfather last night and is in the mood for Italian. There is a [v] mood point bonus for selecting the <strong>cooking pizza</strong> activity today.')");
            conn.NQ(query + "27, 'boost', '10', 100, '[p] read in the newspaper that today is the official ‘brush-your-teeth’ day. There is a [v] mood point bonus for selecting the <strong>brush teeth</strong> activity.')");
            conn.NQ(query + "28, 'boost', '11', 200, 'The 60’s are over. It is time for a shave. There is a [v] mood point bonus for selecting the <strong>shave</strong> activity today.')");
            conn.NQ(query + "29, 'boost', '12', 300, '[p] just came back from a long run. There is a [v] mood point bonus for selecting the <strong>shower</strong> activity today.')");
            conn.NQ(query + "30, 'boost', '4', 100, '“To be or not to be... “ [p] feels like reading today. There is a [v] mood point bonus for selecting the <strong>e-reader</strong> activity today.')");
            conn.NQ(query + "31, 'boost', '5', 200, '[p] feels like playing [g] favourite computer game. There is a [v] mood point bonus for selecting the <strong>laptop</strong> activity today.')");
            conn.NQ(query + "32, 'boost', '6', 300, '[p] is in the mood for relaxing. There is a [v] mood point bonus for selecting the <strong>watch tv</strong> activity today.')");
            conn.NQ(query + "33, 'boost', '7', 100, '[p] doesn’t feel like going all the way to the gym. There is a [v] mood point bonus for selecting the <strong>workout to music</strong> activity today.')");
            conn.NQ(query + "34, 'boost', '8', 200, '[p] wants to get ready for summer so there is a [v] mood point bonus for selecting the <strong>solarium</strong> activity today.')");
            conn.NQ(query + "35, 'boost', '9', 300, 'Christmas is long gone so it is time to get in shape. There is a [v] mood point bonus for selecting the <strong>treadmill</strong> activity today.')");
        }

        private static void Schedule()
        {
        }

        private static void AddEventToSchedule(string dt, int eventId){
            conn.NQ("INSERT INTO  eventschedule(date, event) VALUES ('" + dt + "'," + eventId + ");");
        }
    }
}
