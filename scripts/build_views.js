//node.js file to run scripts, 
//we want to create simple data pulls from database to make graphics quickly inbrowser
//api pulls -> py script -> duckdb -> build_views node.js -> json data pieces -> | browser to make graph
//GOAL: EVERYTHING AS BACKEND AS POSSIBLE! 

import duckdb from "duckdb"; // <- use duckdb sql
import fs from "fs"; // <- read file


const db = new duckdb.Database("/src/report_card.duckdb"); //<- load duckdb file
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