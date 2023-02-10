import { StationCfg } from "../common/stationCfg";
import {
  IStationData,
  IStationGarni1025ArcusDataRaw,
  IStationTrendData,
} from "../common/stationModel";
import { IMeasurement } from "./measurement";

class StationGarni1025Arcus implements IMeasurement {
  cfg: StationCfg = null;

  constructor(stationID: string) {
    this.cfg = new StationCfg(stationID);
  }

  getTables() {
    return [this.cfg.TABLE];
  }

  getColumns() {
    return this.cfg.COLUMNS;
  }

  getSocketChannel() {
    return this.cfg.SOCKET_CHANNEL;
  }

  getSocketTrendChannel() {
    return this.cfg.SOCKET_TREND_CHANNEL;
  }

  getRedisLastDataKey() {
    return this.cfg.REDIS_LAST_DATA_KEY;
  }

  getRedisMinuteDataKey() {
    return this.cfg.REDIS_MINUTE_DATA_KEY;
  }

  getRedisStoreChannel() {
    return this.cfg.REDIS_STORE_CHANNEL;
  }

  getRedisTrendKey() {
    return this.cfg.REDIS_TREND_KEY;
  }

  getKafkaKey(): string {
    return this.cfg.KAFKA_KEY;
  }

  getQueryArray(table: string, data: IStationData) {
    return [
      data.timestamp,
      data.tempin,
      data.humidityin,
      data.pressurerel,
      data.pressureabs,
      data.temp,
      data.humidity,
      data.winddir,
      data.windspeed,
      data.windgust,
      data.rainrate,
      data.solarradiation,
      data.uv,
      data.eventrain,
      data.hourlyrain,
      data.dailyrain,
      data.weeklyrain,
      data.monthlyrain,
    ];
  }

  getQueryText() {
    return `insert into ${this.cfg.TABLE}(timestamp, tempin, humidityin, pressurerel, pressureabs, temp, humidity, winddir, windspeed, windgust, rainrate, solarradiation, uv, eventrain, hourlyrain, dailyrain, weeklyrain, monthlyrain) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`;
  }

  /*
     {
   ID: '',
   PASSWORD: '',
   action: 'updateraww',
   realtime: '1',
   rtfreq: '5',
   dateutc: 'now',
   baromin: '29.94',
   tempf: '73.5',
   dewptf: '63.5',
   humidity: '71',
   windspeedmph: '0.0',
   windgustmph: '0.0',
   winddir: '6',
   rainin: '0.0',
   dailyrainin: '0.0',
   solarradiation: '0.39',
   UV: '0.0',
   indoortempf: '72.8',
   indoorhumidity: '69'
 }
*/

  decodeData(data: IStationGarni1025ArcusDataRaw) {
    const TO_MM = 25.4;
    const TO_KM = 1.6;
    const TO_HPA = 33.8639;

    function round(value: number, precision: number) {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    //    console.log(data)
    const decoded: IStationData = {
      timestamp: new Date().toISOString(),
      tempin: round((5 / 9) * (data.indoortempf - 32), 1),
      pressurerel: round(data.baromin * TO_HPA, 1),
      pressureabs: null,
      temp: round((5 / 9) * (data.tempf - 32), 1),
      windspeed: round(data.windspeedmph * TO_KM, 1),
      windgust: round(data.windgustmph * TO_KM, 1),
      maxdailygust: null,
      rainrate: round(data.rainin * TO_MM, 1),
      eventrain: null,
      hourlyrain: null,
      dailyrain: round(data.dailyrainin * TO_MM, 1),
      weeklyrain: null,
      monthlyrain: null,
      totalrain: null,
      solarradiation: round(data.solarradiation * 1.0, 0),
      uv: round(data.UV * 1.0, 0),
      humidity: round(data.humidity * 1.0, 0),
      humidityin: round(data.indoorhumidity * 1.0, 0),
      winddir: round(data.winddir * 1.0, 0),
      place: "Demanovska Dolina",
      minuterain: null,
    };
    const date = new Date(decoded.timestamp);
    const toStore = decoded;
    // console.info(data, date, decoded);
    return { date, decoded, toStore };
  }

  transformTrendData(data: any) {
    const tmp = {} as IStationTrendData;
    tmp.timestamp = [];
    tmp.tempin = [];
    tmp.humidityin = [];
    tmp.temp = [];
    tmp.humidity = [];
    tmp.pressurerel = [];
    tmp.windgust = [];
    tmp.windspeed = [];
    tmp.winddir = [];
    tmp.solarradiation = [];
    tmp.uv = [];
    tmp.rainrate = [];
    let prev = 0;
    data.forEach((item: any) => {
      const value: IStationData = JSON.parse(item);
      const date = new Date(value.timestamp);
      const time = date.getTime();
      if (time - prev >= 60000) {
        tmp.timestamp.push(value.timestamp);
        tmp.tempin.push(value.tempin);
        tmp.humidityin.push(value.humidityin);
        tmp.temp.push(value.temp);
        tmp.humidity.push(value.humidity);
        tmp.pressurerel.push(value.pressurerel);
        tmp.windgust.push(value.windgust);
        tmp.windspeed.push(value.windspeed);
        tmp.winddir.push(value.winddir);
        tmp.solarradiation.push(value.solarradiation);
        tmp.uv.push(value.uv);
        tmp.rainrate.push(value.rainrate);
        prev = time;
      }
    });
    return tmp;
  }

  agregateMinuteData(data: any) {
    const deg2rad = (degrees: number) => degrees * (Math.PI / 180);

    const rad2deg = (radians: number) => radians * (180 / Math.PI);

    const round = (value: number, precision: number) => {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    };

    const avgWind = (directions: number[]) => {
      let sinSum = 0;
      let cosSum = 0;
      directions.forEach((value) => {
        sinSum += Math.sin(deg2rad(value));
        cosSum += Math.cos(deg2rad(value));
      });
      return round((rad2deg(Math.atan2(sinSum, cosSum)) + 360) % 360, 0);
    };

    const initWithZeros = () => {
      const init: IStationData = {
        tempin: 0,
        temp: 0,
        pressurerel: 0,
        pressureabs: null,
        windgust: 0,
        windspeed: 0,
        rainrate: 0,
        solarradiation: 0,
        uv: 0,
        humidityin: 0,
        humidity: 0,
        winddir: 0,
        timestamp: null,
        place: null,
        maxdailygust: null,
        eventrain: null,
        hourlyrain: null,
        dailyrain: null,
        weeklyrain: null,
        monthlyrain: null,
        totalrain: null,
        minuterain: null,
      };
      return init;
    };

    const sum = (value: IStationData[]) => {
      const total: IStationData = initWithZeros();

      for (const item of value) {
        total.timestamp = item.timestamp;
        total.tempin += item.tempin;
        total.humidityin += item.humidityin;
        total.temp += item.temp;
        total.humidity += item.humidity;
        total.pressurerel += item.pressurerel;
        // total.pressureabs += item.pressureabs;
        total.windgust += item.windgust;
        total.windspeed += item.windspeed;
        //        init.winddir += item.winddir;
        total.solarradiation += item.solarradiation;
        total.uv += item.uv;
        total.rainrate += item.rainrate;
        total.maxdailygust = item.maxdailygust;
        total.eventrain = item.eventrain;
        total.hourlyrain = item.hourlyrain;
        total.dailyrain = item.dailyrain;
        total.weeklyrain = item.weeklyrain;
        total.monthlyrain = item.monthlyrain;
        total.totalrain = item.totalrain;
        total.place = item.place;
      }
      return total;
    };

    const average = (total: IStationData, count: number) => {
      const avg = total;
      avg.tempin = round(total.tempin / count, 1);
      avg.temp = round(total.temp / count, 1);
      avg.pressurerel = round(total.pressurerel / count, 1);
      // avg.pressureabs = round(total.pressureabs / count, 1);
      avg.windgust = round(total.windgust / count, 1);
      avg.windspeed = round(total.windspeed / count, 1);
      avg.rainrate = round(total.rainrate / count, 1);
      avg.solarradiation = round(total.solarradiation / count, 0);
      avg.uv = round(total.uv / count, 0);
      avg.humidityin = round(total.humidityin / count, 0);
      avg.humidity = round(total.humidity / count, 0);
      avg.winddir = round(total.winddir / count, 0);
      return avg;
    };

    const map = new Map();

    data.forEach((item: any) => {
      const sdata: IStationData = JSON.parse(item);
      const sdate = new Date(sdata.timestamp);
      const minute = sdate.getTime() - (sdate.getTime() % 60000);
      if (map.has(minute)) {
        const mdata = map.get(minute);
        mdata.push(sdata);
      } else {
        const mdata = [sdata];
        map.set(minute, mdata);
      }
    });

    const result = new Map();

    map.forEach((value, key) => {
      const minute = new Date(key);
      const date = minute.toISOString();
      // console.log(key, date, value);
      const s = sum(value);
      const avg = average(s, value.length);
      avg.timestamp = date;
      const windDir: number[] = [];
      value.forEach((element: IStationData) => {
        windDir.push(element.winddir);
      });
      avg.winddir = avgWind(windDir);
      // console.info(avg);
      result.set(minute.getTime(), avg);
      console.info("Agregated station minute", minute);
    });
    return result;
  }
}

export default StationGarni1025Arcus;
