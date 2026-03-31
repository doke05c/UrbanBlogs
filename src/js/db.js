import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm";

const bundle = {
  mainModule: "/duckdb/duckdb-mvp.wasm",
  mainWorker: "/duckdb/duckdb-browser-mvp.worker.js",
  pthreadWorker: "/duckdb/duckdb-browser-coi.pthread.worker.js"
};

console.log(bundle);

const worker = new Worker(bundle.mainWorker, {
  type: "module"
});

const db = new duckdb.AsyncDuckDB(
  new duckdb.ConsoleLogger(),
  worker
);

await db.instantiate(bundle.mainModule, bundle.pthreadWorker);


const IS_DEV = window.NODE_ENV === "dev";


const BASE_DATA_URL = IS_DEV
  ? "http://192.168.137.199:8080/src"
  : "https://urbanblogs.netlify.app/src";

//don't open full duckdb unless absolutely necessary

//get all datasets' names
const DATASETS = {
  report_all: `${BASE_DATA_URL}/report_card.duckdb`,
  cbd_entries: `${BASE_DATA_URL}/cbd_entries.parquet`,
  mta_bridge_traffic: `${BASE_DATA_URL}/mta_bridge_traffic.parquet`,
  mta_overall_ridership_traffic: `${BASE_DATA_URL}/mta_overall_ridership_traffic.parquet`
};
  
// console.log("hi :) time to test?")

//client connection
const conn = await db.connect();



//get first 10 rows from cbd_entries
const result = await conn.query(`
  SELECT * 
  FROM read_parquet('${DATASETS.cbd_entries}') 
  LIMIT 10
`);

//print result as array
console.log(result.toArray());

const data = result.toArray();

const table = document.createElement('table');

// console.log("hi :) it worked?")

// headers
const headerRow = document.createElement('tr');
Object.keys(data[0]).forEach(col => {
  const th = document.createElement('th');
  th.textContent = col;
  headerRow.appendChild(th);
});
table.appendChild(headerRow);

// rows
data.forEach(row => {
  const tr = document.createElement('tr');
  Object.values(row).forEach(val => {
    const td = document.createElement('td');
    td.textContent = val;
    tr.appendChild(td);
  });
  table.appendChild(tr);
});

document.getElementById('output').appendChild(table);