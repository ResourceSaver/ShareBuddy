using System;
using System.Collections.Generic;
using System.Linq;
using Database.Code;

namespace UsageHistory
{
    class ElectricityCalculator
    {
        ElectricityData electricityData = new ElectricityData();
        Shifting shifting = new Shifting();
        List<int> forecast;

        public void SetForecast(List<int> forecast) {
            this.forecast = forecast;
        }

        public ElectricityData GetElectricityInfo(List<double> usage, List<double> baseline)
        {
            electricityData = new ElectricityData();
           
            if (usage == null || usage.Count == 0 || baseline == null || baseline.Count == 0 || forecast == null || forecast.Count == 0 || usage.Sum() == 0.0)
                return null;

            this.electricityData.usage24hour = usage;
            this.electricityData.usageSum = usage.Sum();
            this.electricityData.baselineSum = baseline.Sum();
            this.electricityData.shifting = Math.Round(shifting.Calculate(usage, baseline, forecast), 2);

            CO2Reduction(forecast, usage, baseline);
            return electricityData;
        }

        private void CO2Reduction(List<int> forecast, List<double> usage, List<double> baseline)
        {
            for (int i = 0; i < forecast.Count; i++)
            {
                this.electricityData.co2UsageSum += (usage[i] * forecast[i]);
                this.electricityData.co2BaselineSum += (baseline[i] * forecast[i]);
            }
        }
    }

    public class Shifting{

        private List<double> usageNorm;
        private List<double> baselineNorm;
        private List<double> forecastNorm;

        public double Calculate(List<double> usage, List<double> baseline, List<int> forecast)
        {
            usageNorm = this.Normalize(usage);
            baselineNorm = this.Normalize(baseline);
            forecastNorm = this.Normalize(forecast);

            List<double> usageXforecast = this.Multiply(usageNorm, forecastNorm);
            List<double> baselineXforecast = this.Multiply(baselineNorm, forecastNorm);

            double shifting = baselineXforecast.Sum() - usageXforecast.Sum();

            return shifting;
        }

        private List<double> Normalize(List<double> list)
        {
            double sum = list.Sum();

            if (sum == 0.0) return list;

            List<double> retVal = new List<double>();

            for (int i = 0; i < list.Count; i++)
            {
                double percentage = (list[i] / sum) * 100;
                retVal.Add(percentage);
            }

            return retVal;
        }

        private List<double> Normalize(List<int> list)
        {
            int sum = list.Sum();

            if (sum == 0) return new List<double>() { 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, };

            List<double> retVal = new List<double>();

            for (int i = 0; i < list.Count; i++)
            {
                double percentage = (Convert.ToDouble(list[i]) / sum) * 100;
                retVal.Add(percentage);
            }

            return retVal;
        }

        private List<double> Multiply(List<double> list, List<double> forecast)
        {
            List<double> retVal = new List<double>();

            for (int i = 0; i < list.Count; i++)
            {
                double val = list[i] * forecast[i];
                retVal.Add(val);
            }

            return retVal;
        }
    }
}
