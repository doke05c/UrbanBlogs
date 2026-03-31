//load JS bindings for duckdb web assembly (essentially loads duckdb package)
import { duckdb } from '@duckdb/duckdb-wasm';


// Pseudo-code: in practice you choose the right bundle/worker

//get the right binary + worker config for the browser
const bundle = await duckdb.selectBundle();

//spawn web worker
const worker = new Worker(bundle.mainWorker);

//put duckdb logs into web console log
const logger = new duckdb.ConsoleLogger();

//instantiate new duckdb instance controller, named "db"
const db = new duckdb.AsyncDuckDB(logger, worker);

//start virtual filesystem/memory heap
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

//get database
const response = await fetch('/report_card.duckdb');

//puts file into memory, MAY BE MEMORY INTENSIVE
const buffer = await response.arrayBuffer();

//put file in virtual filesystem
await db.registerFileBuffer(
  'report_card.duckdb',
  new Uint8Array(buffer)
);

//open database read-only
await db.open({
  path: 'report_card.duckdb',
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