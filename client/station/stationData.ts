import { action, makeObservable, observable } from "mobx";
import { IStationData, IStationTrendData } from "../../common/stationModel";

class StationData {
  data: IStationData = {
    timestamp: "",
  } as IStationData;

  trendData: IStationTrendData = {
    timestamp: [],
    tempin: [],
    humidityin: [],
    temp: [],
    humidity: [],
    pressurerel: [],
    windgust: [],
    windspeed: [],
    winddir: [],
    solarradiation: [],
    uv: [],
    rainrate: [],
  } as IStationTrendData;

  ctime: Date = new Date();

  oldData: boolean = true;

  floatingRainData: boolean = false;

  raindata: any = null;

  try: number = 0;

  constructor() {
    makeObservable(this, {
      data: observable,
      trendData: observable,
      oldData: observable,
      floatingRainData: observable,
      raindata: observable,
      processData: action,
      processTrendData: action,
      setOldData: action,
      setFloatingRainData: action,
      setRaindata: action,
    });
  }

  setRaindata(raindata: any) {
    this.raindata = raindata;
  }

  setOldData(time: Date) {
    if (this.data.timestamp) {
      const timestamp = new Date(this.data.timestamp);
      const diff = time.getTime() - timestamp.getTime();
      if (diff > 300000) {
        // console.info('oldData = true');
        this.oldData = true;
      } else {
        // console.info('oldData = false');
        this.oldData = false;
        this.try = 0;
      }
    } else {
      // console.info('oldData = true');
      this.oldData = true;
    }
  }

  setTime(newTime: Date) {
    this.ctime = newTime;
    this.setOldData(newTime);
  }

  setFloatingRainData(newFloatingRainData: boolean) {
    this.floatingRainData = newFloatingRainData;
  }

  processData(newData: IStationData) {
    // console.info("process station data", newData, this);
    if (newData != null) {
      this.data = newData;
      this.setOldData(new Date());
    }
  }

  processTrendData(newTrendData: IStationTrendData) {
    // console.info("process station trend data", newTrendData, this);
    if (newTrendData != null) {
      this.trendData = newTrendData;
    }
  }
}

export default StationData;
