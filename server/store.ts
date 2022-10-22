import { Pool } from "pg";
import { createClient } from "redis";
import { IStationData } from "../common/stationModel";
import { IDomDataRaw } from "../common/domModel";
import { IMeasurement } from "./measurement";
import { AllStationsCfg, IStation } from "../common/allStationsCfg";

const PG_PORT = parseInt(process.env.PG_PORT, 10) || 5432;
const PG_PASSWORD = process.env.PG_PASSWORD || "postgres";
const PG_DB = process.env.PG_DB || "postgres";
const PG_HOST = process.env.PG_HOST || "localhost";
const PG_USER = process.env.PG_USER || "postgres";

const redisClientSub = createClient();
redisClientSub.connect();

const pool = new Pool({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB,
  password: PG_PASSWORD,
  port: PG_PORT,
});

async function store(
  measurement: IMeasurement,
  data: IDomDataRaw | IStationData
) {
  const client = await pool.connect();
  try {
    console.info(`connected ${data.timestamp}`);
    await client.query("BEGIN");

    const tables = measurement.getTables();
    for (const table of tables) {
      // console.info(table);
      const queryText = measurement.getQueryText(table);
      // console.info(queryText);
      const queryArray = measurement.getQueryArray(table, data);
      // console.info(queryArray);
      client.query(queryText, queryArray);
      console.info(data.timestamp, queryText);
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    console.info("released");
  }
}

function main(stations: Map<string, IStation>) {
  console.info(`PG: ${PG_HOST}`);

  for (const station of stations.values()) {
    redisClientSub.subscribe(
      station.measurement.getRedisStoreChannel(),
      (msg: string) => {
        const data = JSON.parse(msg);
        data.forEach((element: IDomDataRaw | IStationData) => {
          store(station.measurement, element);
        });
      }
    );
  }
}

const allStationsCfg = new AllStationsCfg();
allStationsCfg.readCfg().then(() => main(allStationsCfg.getStations()));
