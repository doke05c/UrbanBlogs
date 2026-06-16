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

    //entire history of monthly subway entries since 03/2020
    const monthly_subway_entries_from_mar_2020 = await query(`
        WITH max_date AS (
            SELECT MAX(CAST(date AS DATE)) AS max_d
            FROM mta_overall_ridership_traffic
        ),

        cutoff AS (
            SELECT date_trunc('month', max_d) AS cutoff_date
            FROM max_date
        )

        SELECT
            strftime(date, '%Y-%m') AS month,
            SUM(count) AS count,
        
        FROM mta_overall_ridership_traffic

        WHERE mode = 'Subway'
            AND CAST(date AS DATE) >= DATE '2020-03-01'
            AND CAST(date AS DATE) < (SELECT cutoff_date FROM cutoff)
        
        GROUP BY month
        ORDER BY month;
    `);

    fs.writeFileSync(
        "src/json/monthly_subway_entries_from_mar_2020.json",
        JSON.stringify(monthly_subway_entries_from_mar_2020)
    );

    //entire history of monthly lirr entries since 03/2020
    const monthly_lirr_entries_from_mar_2020 = await query(`
        WITH max_date AS (
            SELECT MAX(CAST(date AS DATE)) AS max_d
            FROM mta_overall_ridership_traffic
        ),

        cutoff AS (
            SELECT date_trunc('month', max_d) AS cutoff_date
            FROM max_date
        )

        SELECT
            strftime(date, '%Y-%m') AS month,
            SUM(count) AS count,
        
        FROM mta_overall_ridership_traffic

        WHERE mode = 'LIRR'
            AND CAST(date AS DATE) >= DATE '2020-03-01'
            AND CAST(date AS DATE) < (SELECT cutoff_date FROM cutoff)
        
        GROUP BY month
        ORDER BY month;
    `);

    fs.writeFileSync(
        "src/json/monthly_lirr_entries_from_mar_2020.json",
        JSON.stringify(monthly_lirr_entries_from_mar_2020)
    );

    //entire history of monthly mnr entries since 03/2020
    const monthly_mnr_entries_from_mar_2020 = await query(`
        WITH max_date AS (
            SELECT MAX(CAST(date AS DATE)) AS max_d
            FROM mta_overall_ridership_traffic
        ),

        cutoff AS (
            SELECT date_trunc('month', max_d) AS cutoff_date
            FROM max_date
        )

        SELECT
            strftime(date, '%Y-%m') AS month,
            SUM(count) AS count,
        
        FROM mta_overall_ridership_traffic

        WHERE mode = 'MNR'
            AND CAST(date AS DATE) >= DATE '2020-03-01'
            AND CAST(date AS DATE) < (SELECT cutoff_date FROM cutoff)
        
        GROUP BY month
        ORDER BY month;
    `);

    fs.writeFileSync(
        "src/json/monthly_mnr_entries_from_mar_2020.json",
        JSON.stringify(monthly_mnr_entries_from_mar_2020)
    );

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

    //past 7 days of bridge & tunnel crossings
    const last_7d_bridge_tunnel = await query(`
        
        SELECT 
            strftime(DATE(date), '%Y-%m-%d') AS date,
            SUM(count) AS count
            
        FROM mta_overall_ridership_traffic

        WHERE mode = 'BT'
        AND DATE(date) >= (
            SELECT MAX(DATE(date)) 
            FROM mta_overall_ridership_traffic    
        ) - INTERVAL 6 DAY
            
        GROUP BY DATE(date)
        ORDER BY DATE(date)

    `);

    fs.writeFileSync(
        "src/json/last_7_days_bridge_tunnel.json",
        JSON.stringify(last_7d_bridge_tunnel)
    );

    //monthly record of cbd entries
    const monthly_entries = await query(`
        WITH max_date AS (
            SELECT MAX(CAST(toll_date AS DATE)) AS max_d
            FROM cbd_entries
        ),

        cutoff AS (
            SELECT date_trunc('month', max_d) AS cutoff_date
            FROM max_date
        )

        SELECT
            strftime(toll_date, '%Y-%m') AS month,
            SUM(crz_entries) AS count

        FROM cbd_entries
        WHERE CAST(toll_date AS DATE) >= DATE '2025-01-01'
        AND CAST(toll_date AS DATE) < (SELECT cutoff_date FROM cutoff)
        
        GROUP BY month
        ORDER BY month;
    `);
    
    fs.writeFileSync(
        "src/json/monthly_cbd.json",
        JSON.stringify(monthly_entries)
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


//NEXT STEPS, HAVE WEB FRONT END WORK OUT THE JSON FILES TO MAKE GRAPHS IN BROWSER :)