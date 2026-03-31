// import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm";
import * as duckdb from "@duckdb/duckdb-wasm";

// const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
const bundle = {
  mainModule: "/duckdb/duckdb-mvp.wasm",
  mainWorker: "/duckdb/duckdb-browser-mvp.worker.js",
  pthreadWorker: "/duckdb/duckdb-browser-coi.pthread.worker.js"
};

// const bundles = duckdb.getJsDelivrBundles();
// const bundle = await duckdb.selectBundle(bundles);

console.log(bundle);

const worker = new Worker(bundle.mainWorker, {
  type: "module"
});

const db = new duckdb.AsyncDuckDB(
  new duckdb.ConsoleLogger(),
  worker
);

await db.instantiate(bundle.mainModule, bundle.pthreadWorker);


console.log("hi :) time to test?")


//get database
const response = await fetch('/src/report_card.duckdb');

//puts file into memory, MAY BE MEMORY INTENSIVE
const buffer = await response.arrayBuffer();

//put file in virtual filesystem

const FILE_NAME = "/src/report_card.duckdb";

await db.registerFileBuffer(
  FILE_NAME,
  new Uint8Array(buffer)
);

//open database read-only
await db.open({
  path: FILE_NAME,
  accessMode: duckdb.DuckDBAccessMode.READ_ONLY
});

//client connection
const conn = await db.connect();

//get first 10 rows from mta_bridge_traffic
const result = await conn.query(`
  SELECT * FROM cbd_entries LIMIT 10
`);

//print result as array
console.log(result.toArray());

const data = result.toArray();

const table = document.createElement('table');

console.log("hi :) it worked?")

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