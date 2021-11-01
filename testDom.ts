import assert from 'assert';
import axios from 'axios';
import fetch from 'node-fetch';
import { Pool } from 'pg';
import { Dom, TABLES } from './server/dom';
import { IDomDataRaw, IDomExternalData, IDomRoomData, IDomTarifData } from './common/models/domModel';

const PG_PORT = parseInt(process.env.PG_PORT) || 15432;
const PG_PASSWORD = process.env.PG_PASSWORD || 'postgres';
const PG_DB = process.env.PG_DB || 'postgres';
const PG_HOST = process.env.PG_HOST || '192.168.1.199';
const PG_USER = process.env.PG_USER || 'postgres';
const dom = new Dom();

console.info('PG: ' + PG_HOST);

process.env.DOM_PASSKEY = '7d060d4d-c95f-4774-a0ec-a85c8952b9d9';

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function round(value: number, precision: number) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function generateRoomData() {
    const data = {} as IDomRoomData;

    data.kuri = 0;
    data.leto = 0;
    data.low = 0;
    data.maxoffset = 5;
    data.req = 0;
    data.reqall = 0;
    data.temp = round(random(15, 30), 1);
    data.text = '';
    data.useroffset = 0;
    return data;
}

function generateExternalData() {
    const data = {} as IDomExternalData;

    data.temp = round(random(15, 30), 1);
    data.humidity = round(random(40, 60), 0);
    data.rain = round(random(0, 1), 0);
    data.text = '';
    return data;
}

function generateTarifData() {
    const data = {} as IDomTarifData;

    data.text = '';
    data.tarif = 0;
    return data;
}

function generateData(d: Date) {
    d.setUTCMilliseconds(0);
    const data = {} as IDomDataRaw;
    data.PASSKEY = '7d060d4d-c95f-4774-a0ec-a85c8952b9d9';
    data.dateutc = d.toISOString().replace('T', ' ').replace('.000Z', '');
    data.timestamp = d.toISOString();
    data.tarif = generateTarifData();
    data.vonku = generateExternalData();
    data.obyvacka_vzduch = generateRoomData();
    data.obyvacka_podlaha = generateRoomData();
    data.pracovna_vzduch = generateRoomData();
    data.pracovna_podlaha = generateRoomData();
    data.spalna_vzduch = generateRoomData();
    data.spalna_podlaha = generateRoomData();
    data.chalani_vzduch = generateRoomData();
    data.chalani_podlaha = generateRoomData();
    data.petra_vzduch = generateRoomData();
    data.petra_podlaha = generateRoomData();
    data.zadverie_vzduch = generateRoomData();
    data.zadverie_podlaha = generateRoomData();
    data.chodba_vzduch = generateRoomData();
    data.chodba_podlaha = generateRoomData();
    data.satna_vzduch = generateRoomData();
    data.satna_podlaha = generateRoomData();
    data.kupelna_hore = generateRoomData();
    data.kupelna_dole = generateRoomData();

    return data;
}

/*
Sep 07 10:50:42 zaloha node[926]: { obyvacka_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 22.9,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   zadverie_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   pracovna_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 22.3,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chodba_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.3,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   satna_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   petra_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.4,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chalani_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 24,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   spalna_podlaha:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   kupelna_dole:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 22.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   kupelna_hore:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 5,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   obyvacka_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 24.8,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   zadverie_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   pracovna_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.9,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chodba_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.4,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   satna_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   petra_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.5,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   chalani_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 24.2,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   spalna_vzduch:
Sep 07 10:50:42 zaloha node[926]:    DomRoomData {
Sep 07 10:50:42 zaloha node[926]:      temp: 23.7,
Sep 07 10:50:42 zaloha node[926]:      req: 0,
Sep 07 10:50:42 zaloha node[926]:      reqall: 0,
Sep 07 10:50:42 zaloha node[926]:      useroffset: 0,
Sep 07 10:50:42 zaloha node[926]:      maxoffset: 12,
Sep 07 10:50:42 zaloha node[926]:      kuri: 0,
Sep 07 10:50:42 zaloha node[926]:      low: 0,
Sep 07 10:50:42 zaloha node[926]:      leto: 1 },
Sep 07 10:50:42 zaloha node[926]:   vonku: DomExternalData { temp: 20.2, humidity: 25, rain: 0 },
Sep 07 10:50:42 zaloha node[926]:   tarif: DomTarifData { tarif: 1 },
Sep 07 10:50:42 zaloha node[926]:   timestamp: 2021-09-07T08:50:42.780Z,
Sep 07 10:50:42 zaloha node[926]:   dateutc: '2021-9-7 8:50:42',
Sep 07 10:50:42 zaloha node[926]:   PASSKEY: '7d060d4d-c95f-4774-a0ec-a85c8952b9d9' }
*/

async function postData(data: any) {
    try {
        await axios.post('http://localhost:8082/setDomData', data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function fetchDomData() {
    const url = 'http://localhost:8082/api/getLastData/dom';
    console.info(url);

    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer 1`,
            },
        });
        if (res.status === 401) {
            console.error('auth 401');
        }
        else {
            const json = await res.json();
            return json;
        }
    }
    catch (error) {
        console.error(error);
    }
}

async function loadDomData() {
    const pool = new Pool({
        user: PG_USER,
        host: PG_HOST,
        database: PG_DB,
        password: PG_PASSWORD,
        port: PG_PORT,
    });

    const client = await pool.connect();
    try {
        console.info('connected', new Date());

        const data = {} as IDomDataRaw;

        async function loadRoomData(table: string) {
            let queryText = 'select * from ' + table + ' where timestamp=\'' + pgtime + ':00+00\'';
            let res = await client.query(queryText);
            //console.log('rows', queryText, res.rows);
            const room = {
                kuri: res.rows[0].kuri ? 1 : 0,
                leto: res.rows[0].leto ? 1 : 0,
                low: res.rows[0].low ? 1 : 0,
                maxoffset: parseInt(res.rows[0].maxoffset),
                req: parseInt(res.rows[0].req),
                reqall: parseInt(res.rows[0].reqall),
                temp: parseFloat(res.rows[0].temp),
                text: '',
                useroffset: parseInt(res.rows[0].useroffset),
            } as IDomRoomData;
            return room;
        }

        async function loadExternalData(table: string) {
            let queryText = 'select * from ' + table + ' where timestamp=\'' + pgtime + ':00+00\'';
            let res = await client.query(queryText);
            //console.log('rows', queryText, res.rows);
            const room = {
                temp: parseFloat(res.rows[0].temp),
                humidity: parseFloat(res.rows[0].humidity),
                rain: res.rows[0].rain ? 1 : 0,
                text: '',
            } as IDomExternalData;
            return room;
        }

        async function loadTarifData(table: string) {
            let queryText = 'select * from ' + table + ' where timestamp=\'' + pgtime + ':00+00\'';
            let res = await client.query(queryText);
            //console.log('rows', queryText, res.rows);
            const room = {
                tarif: parseInt(res.rows[0].tarif),
                text: '',
            } as IDomTarifData;
            return room;
        }

        data[TABLES.OBYVACKA_VZDUCH] = await loadRoomData(TABLES.OBYVACKA_VZDUCH);
        data[TABLES.OBYVACKA_PODLAHA] = await loadRoomData(TABLES.OBYVACKA_PODLAHA);
        data[TABLES.PRACOVNA_VZDUCH] = await loadRoomData(TABLES.PRACOVNA_VZDUCH);
        data[TABLES.PRACOVNA_PODLAHA] = await loadRoomData(TABLES.PRACOVNA_PODLAHA);
        data[TABLES.SPALNA_VZDUCH] = await loadRoomData(TABLES.SPALNA_VZDUCH);
        data[TABLES.SPALNA_PODLAHA] = await loadRoomData(TABLES.SPALNA_PODLAHA);
        data[TABLES.CHALANI_VZDUCH] = await loadRoomData(TABLES.CHALANI_VZDUCH);
        data[TABLES.CHALANI_PODLAHA] = await loadRoomData(TABLES.CHALANI_PODLAHA);
        data[TABLES.PETRA_VZDUCH] = await loadRoomData(TABLES.PETRA_VZDUCH);
        data[TABLES.PETRA_PODLAHA] = await loadRoomData(TABLES.PETRA_PODLAHA);
        data[TABLES.ZADVERIE_VZDUCH] = await loadRoomData(TABLES.ZADVERIE_VZDUCH);
        data[TABLES.ZADVERIE_PODLAHA] = await loadRoomData(TABLES.ZADVERIE_PODLAHA);
        data[TABLES.CHODBA_VZDUCH] = await loadRoomData(TABLES.CHODBA_VZDUCH);
        data[TABLES.CHODBA_PODLAHA] = await loadRoomData(TABLES.CHODBA_PODLAHA);
        data[TABLES.SATNA_VZDUCH] = await loadRoomData(TABLES.SATNA_VZDUCH);
        data[TABLES.SATNA_PODLAHA] = await loadRoomData(TABLES.SATNA_PODLAHA);
        data[TABLES.KUPELNA_HORE] = await loadRoomData(TABLES.KUPELNA_HORE);
        data[TABLES.KUPELNA_DOLE] = await loadRoomData(TABLES.KUPELNA_DOLE);
        data[TABLES.VONKU] = await loadExternalData(TABLES.VONKU);
        data[TABLES.TARIF] = await loadTarifData(TABLES.TARIF);
        data.dateutc = pgtime + ':00';
        //console.info(data);
        return data;
    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        console.info('released');
    }
}

const data1 = generateData(new Date());

const d = new Date();
d.setUTCMilliseconds(0);

function addZero(val: number) {
    if (val > 9) {
        return val; 
    }
    return '0' + val;
}
const pgtime = d.getUTCFullYear() + '-' + addZero(d.getUTCMonth() + 1) + '-' + addZero(d.getUTCDate()) + ' ' + addZero(d.getUTCHours()) + ':' + addZero((d.getUTCMinutes()));

data1.dateutc = pgtime + ':' + d.getUTCSeconds();
const toMinute = Date.now() % 60000;

console.info('Now, Timestamp, Redis, pgtime, Pg', d, data1.dateutc, pgtime);

postData(data1);

setTimeout(async () => {
    const sd = await fetchDomData();
    assert.deepStrictEqual(sd, dom.decodeData(data1).decoded);
    console.info('Redis1 OK');
}, 1000);

setTimeout(async () => {
    const rows = await loadDomData();
    rows.PASSKEY = '7d060d4d-c95f-4774-a0ec-a85c8952b9d9';
    data1.dateutc = pgtime + ':00';
    rows.timestamp = d.toISOString();
    assert.deepStrictEqual(rows, data1);
    console.info('PG OK');
}, 61000 - toMinute);