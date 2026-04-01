//node.js file to run scripts, 
//we want to create simple data pulls from database to make graphics quickly inbrowser
//api pulls -> py script -> duckdb -> build_views node.js -> json data pieces -> | browser to make graph
//GOAL: EVERYTHING AS BACKEND AS POSSIBLE! 

import duckdb from "duckdb"; // <- use duckdb sql
import fs from "fs"; // <- read file


const db = new duckdb.Database("src/report_card.duckdb"); //<- load duckdb file
const conn = db.connect();


// helper to asynchronously (put on queue) run sql query
function query(sql) {
  return new Promise((resolve, reject) => {
    conn.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

//build() creates all the json items of the stuff we actually wanna graph/display
async function build() {
  //past 7 days of cbd entries
    const last7d_entries = await query(`
        SELECT
            strftime(toll_date, '%Y-%m-%d') AS date,
            SUM(crz_entries) AS count

        FROM cbd_entries

        WHERE DATE(toll_date) >= (
            SELECT MAX(DATE(toll_date)) FROM cbd_entries
            ) - INTERVAL 6 DAY

        GROUP BY date
        ORDER BY date;
    `);
    
    fs.writeFileSync(
        "src/json/last_7_days_cbd.json",
        JSON.stringify(last7d_entries)
    );

    const last_7d_overall = await query(`
    
        SELECT 
            strftime(DATE(date), '%Y-%m-%d') AS date,
            mode,
            SUM(count) as count
        
        FROM mta_overall_ridership_traffic

        WHERE DATE(date) >= (
            SELECT MAX(DATE(date)) FROM mta_overall_ridership_traffic    
            ) - INTERVAL 6 DAY
        
        GROUP BY DATE(date), mode
        ORDER BY DATE(date), mode
    `);

    fs.writeFileSync(
        "src/json/last_7_days_overall.json",
        JSON.stringify(last_7d_overall)
    );

}

build();
