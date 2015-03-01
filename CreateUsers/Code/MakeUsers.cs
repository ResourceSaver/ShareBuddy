using Database.Code;
using Live;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CreateUsers.Code
{
    class MakeUsers
    {
        static ConnectionMSSQL conn;

        public static void CreateUsers(Target target)
        {
            conn = new ConnectionMSSQL(target);

            conn.NQ("DELETE FROM  users");

            string[] lines = System.IO.File.ReadAllLines(@"useraccounts.csv");
            List<string> users = new List<string>();

            foreach (string line in lines)
            {
                List<string> user = new List<string>(line.Split(',').Select(x => Convert.ToString(x)));

                string username = user[1];
                string appartmentId = user[1];
                string aftagerNummer = user[2];
                string macAddress = user[3];

                //if (!reporting || String.IsNullOrEmpty(appartmentId)) continue;

                string password = PasswordGenerator.GetPassword();

                if (password.Contains(" ")) { password = password.Replace(" ", ""); }
                if (users.Contains(username)) { username = username + "B"; }
                users.Add(username);

                conn.NQ("INSERT INTO  users(username, password, pet, score, water, electricity, male, number, appartmentId, shifting, mac) VALUES ('" + username + "', '" + password + "','', 0, 1, 3,0,'" + aftagerNummer + "' ," + appartmentId + ",'" + 0.0 + "'" + ",'" + macAddress + "');");
            }            
        }
    }
}
