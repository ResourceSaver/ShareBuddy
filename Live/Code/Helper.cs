using Database.Code;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;

namespace Live.Code
{
    class Helper
    {
        public static List<double> CollapseUsage(NRGiData lu)
        {
            if (lu == null) return null;

            List<double> collapsed = new List<double>();
            int count = 1;
            double quarterSum = 0;

            foreach (Reading r in lu.meterreadings)
            {
                quarterSum += r.value;

                if (count % 4 == 0)
                {
                    collapsed.Add(Math.Round(quarterSum, 4));
                    quarterSum = 0;
                }

                count++;
            }

            return collapsed;
        }
    }
}
