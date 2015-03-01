using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Database.Code
{
    public class Activity
    {
        public string type { get; set; }
        public string description { get; set; }
        public int value { get; set; }
        public int electricity { get; set; }
        public int water { get; set; }
        public int id { get; set; }
        public bool played { get; set; }
        public bool blocked { get; set; }
        public int boost { get; set; }
    }

    public class Event
    {
        public int id { get; set; }
        public string type { get; set; }
        public string target { get; set; }
        public int value { get; set; }
        public bool released { get; set; }
        public string text { get; set; }
    }

    public class PlayerData
    {
        public int score { get; set; }
        public string username { get; set; }
        public string pet { get; set; }
        public int water { get; set; }
        public int electricity { get; set; }
        public bool male { get; set; }
    }

    public class Ranking
    {
        public string name { get; set; }
        public int score { get; set; }
        public bool king { get; set; }
    }

    public class Rewards
    {
        public double electricityScore { get; set; }
        public double electricityReduction { get; set; }
        public double waterScore { get; set; }
        public double waterReduction { get; set; }
    }

    public class Usage
    {
        public double waterUsage { get; set; }
        public double waterbaseline { get; set; }
        public double co2 { get; set; }
        public double co2baseline { get; set; }
        public double electricity { get; set; }
        public double electricitybaseline { get; set; }
        public List<double> eusage { get; set; }
        public List<double> electricityBaselineArray { get; set; }
        public double shifting { get; set; }
        public List<int> forecastToday { get; set; }
        public List<int> forecastYesterday { get; set; }
        public Boolean UsageExists { get; set; }
    }

    public class User
    {
        public string username { get; set; }
        public string aftagenummer { get; set; }
        public string appartmentId { get; set; }
        public string macAddress { get; set; }
        public override string ToString() { return username; }
    }

    public class ElectricityData
    {
        public double usageSum { get; set; }
        public double baselineSum { get; set; }
        public double co2UsageSum { get; set; }
        public double co2BaselineSum { get; set; }
        public double shifting { get; set; }
        public List<double> usage24hour { get; set; }
    }

    [DataContract]
    public class interpolatedValues
    {
        [DataMember(Name = "interpolatedValues", IsRequired = true)]
        public List<dataVal> elements { get; set; }

    }

    [DataContract]
    public class dataVal
    {
        [DataMember(Name = "end", IsRequired = true)]
        internal string end { get; set; }

        [DataMember(Name = "measurementType", IsRequired = true)]
        internal measurementType measurementType { get; set; }

        [DataMember(Name = "sensorId", IsRequired = true)]
        internal string sensorId { get; set; }

        [DataMember(Name = "start", IsRequired = true)]
        internal string start { get; set; }

        [DataMember(Name = "value", IsRequired = true)]
        public Double value { get; set; }
    }

    [DataContract]
    public class measurementType
    {
        [DataMember(Name = "id", IsRequired = true)]
        internal string id { get; set; }

        [DataMember(Name = "name", IsRequired = true)]
        internal string name { get; set; }

        [DataMember(Name = "units", IsRequired = true)]
        internal string units { get; set; }
    }

    [DataContract]
    public class WaterData
    {
        [DataMember(Name = "deltaValue", IsRequired = true)]
        public double deltaValue { get; set; }

        [DataMember(Name = "apartmentId", IsRequired = true)]
        public int apartmentId { get; set; }

        [DataMember(Name = "sensorId", IsRequired = true)]
        public int sensorId { get; set; }
    }

    [DataContract]
    public class forecasts
    {
        [DataMember(Name = "date", IsRequired = true)]
        internal string date { get; set; }
        [DataMember(Name = "hour", IsRequired = true)]
        internal int hour { get; set; }
        [DataMember(Name = "co2value", IsRequired = true)]
        public int co2value { get; set; }
    }

    // NRGi

    [DataContract]
    public class NRGiData
    {
        [DataMember(Name = "installationNumber", IsRequired = true)]
        internal string installationNumber { get; set; }

        [DataMember(Name = "meter-readings", IsRequired = true)]
        public List<Reading> meterreadings { get; set; }
    }

    [DataContract]
    public class Reading
    {
        [DataMember(Name = "date", IsRequired = true)]
        internal string date { get; set; }

        [DataMember(Name = "value", IsRequired = true)]
        public double value { get; set; }
    }

}