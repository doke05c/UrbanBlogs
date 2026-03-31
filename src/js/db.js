// LOADER COMES FIRST: LET USER WAIT

const chart = document.createElement('chart'); //<- Chart for past entries to CBD

const loader = document.createElement("div");
loader.textContent = "Loading chart...";
loader.style.display = "flex";
loader.style.alignItems = "center";
loader.style.justifyContent = "center";
loader.style.height = "200px";
loader.style.fontSize = "14px";
loader.style.color = "#666";
chart.appendChild(loader); //<- Make the "chart" the loader for now

document.getElementById('chart').appendChild(chart) //<- Display

//import duckdb library
import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@latest/+esm";

//put together the references for the database loader processes
const bundle = {
  mainModule: "/duckdb/duckdb-mvp.wasm",
  mainWorker: "/duckdb/duckdb-browser-mvp.worker.js",
  pthreadWorker: "/duckdb/duckdb-browser-coi.pthread.worker.js"
};

// console.log(bundle);

//instantiate workers
const worker = new Worker(bundle.mainWorker, {
  type: "module"
});

const db = new duckdb.AsyncDuckDB(
  new duckdb.ConsoleLogger(),
  worker
);

//begin processes
await db.instantiate(bundle.mainModule, bundle.pthreadWorker);


//if in dev mode, set to true. this will determine data source.
const IS_DEV = window.NODE_ENV === "dev";


//if not in dev, use the website's database reference
const BASE_DATA_URL = IS_DEV
  ? "http://localhost:8080/src"
  : "https://urbanblogs.netlify.app/src";

//don't open full duckdb unless absolutely necessary

//get all datasets' names
const DATASETS = {
  report_all: `${BASE_DATA_URL}/report_card.duckdb`,
  cbd_entries: `${BASE_DATA_URL}/cbd_entries.parquet`,
  mta_bridge_traffic: `${BASE_DATA_URL}/mta_bridge_traffic.parquet`,
  mta_overall_ridership_traffic: `${BASE_DATA_URL}/mta_overall_ridership_traffic.parquet`
};
  

//client connection
const conn = await db.connect();


// console.log("hi :) time to test?")

//number of most recent days in the chart
const date_count = 14;

//get past days of total entry counts from cbd_entries
  const week_data = await conn.query(`
    WITH entries_db AS (
      SELECT *
      FROM read_parquet('${DATASETS.cbd_entries}')
    ),
    filtered AS (
      SELECT *
      FROM entries_db
      WHERE DATE(toll_date) >= 
      (SELECT max(DATE(toll_date)) FROM entries_db) - INTERVAL '${date_count-1}' DAY
    )
    SELECT
      strftime(toll_date, '%Y-%m-%d') AS date,
      SUM(crz_entries) AS count
    FROM filtered
    GROUP BY 1
    ORDER BY 1
  `);

//debug: show the contents of the day/count of a given day
  // const week_data_unit = week_data.toArray();
  // const date = week_data_unit[13][Object.keys(week_data_unit[0])[0]];
  // const count = week_data_unit[13][Object.keys(week_data_unit[0])[1]];

  // console.log(date)
  // console.log(count)
  // console.log(week_data.toArray());

const rows = week_data.toArray(); //<- convert data to array for representation as a bar chart


//SET CONTAINER GEOMETRY
const max = Math.max(...rows.map(r => Number(r.count))); //<- set highest value in chart
const wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.alignItems = "flex-end";
wrapper.style.gap = "8px";
wrapper.style.height = "200px";
wrapper.style.width = "100%";

//FOR EACH DAY...
rows.forEach(r => {
  const d = new Date(r.date); //<- create "Date" object for the day of week

  const bar = document.createElement("div");//<- make bar

  const height = (Number(r.count) / max) * 100;//<- set bar height ratio to max

  //SET BAR GEOMETRY
  bar.style.height = `${height}%`;
  bar.style.flex = "1 1 0";
  bar.style.background = "#4a90e2";
  bar.style.display = "flex";
  bar.style.flexDirection = "column";       
  bar.style.justifyContent = "space-between";
  bar.style.alignItems = "center";        
  bar.style.color = "white";
  bar.style.fontSize = `${168 / date_count}px`;
  bar.style.minWidth = "0";

  bar.title = `${r.date.slice(5,10) + "-"+ r.date.slice(0,4)}: ${r.count}`; //<- "Title" will appear on hover:
                                                                            // mm-dd-yyyy: count

  const count_label = document.createElement("div"); //<- make count label, top of bar
  count_label.textContent = r.count;

  const date_label = document.createElement("div"); //<0 make date label, bottom of bar

  date_label.textContent =   
    d.toLocaleDateString('en-US', { weekday: 'short' }) + ", " + r.date.slice(5,10); //<- set date label, just mm-dd and DOW

  //SET LABEL STYLE
  date_label.style.fontSize = `${140 / date_count}px`;
  date_label.style.marginBottom = `${-280 / date_count}px`;
  date_label.style.whiteSpace = "nowrap";

  //add labels to bar
  bar.appendChild(count_label);
  bar.appendChild(date_label);

  //add bar to container
  wrapper.appendChild(bar);
});

//GRAPH IS READY! kill loader
loader.remove();

//add container to chart item, ship it off to main blog file
chart.appendChild(wrapper);
document.getElementById('chart').appendChild(chart)