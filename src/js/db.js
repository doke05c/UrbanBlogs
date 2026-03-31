import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm";

// const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
const bundle = {
  mainModule: "/duckdb/duckdb-mvp.wasm",
  mainWorker: "/duckdb/duckdb-browser-mvp.worker.js",
  pthreadWorker: "/duckdb/duckdb-browser-coi.pthread.worker.js"
};


const worker = new Worker(bundle.mainWorker);

const db = new duckdb.AsyncDuckDB(
  new duckdb.ConsoleLogger(),
  worker
);

await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

//get database
const response = await fetch('/src/report_card.duckdb');

//puts file into memory, MAY BE MEMORY INTENSIVE
const buffer = await response.arrayBuffer();

//put file in virtual filesystem
await db.registerFileBuffer(
  '/src/report_card.duckdb',
  new Uint8Array(buffer)
);

//open database read-only
await db.open({
  path: '/src/report_card.duckdb',
  accessMode: duckdb.DuckDBAccessMode.READ_ONLY
});

//client connection
const conn = await db.connect();

//get first 10 rows from mta_bridge_traffic
const result = await conn.query(`
  SELECT * FROM mta_bridge_traffic LIMIT 10
`);

//print result as array
console.log(result.toArray());

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