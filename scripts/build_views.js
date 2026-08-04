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

    //entire history of monthly sir entries since 03/2020
    const monthly_sir_entries_from_mar_2020 = await query(`
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

        WHERE mode = 'SIR'
            AND CAST(date AS DATE) >= DATE '2020-03-01'
            AND CAST(date AS DATE) < (SELECT cutoff_date FROM cutoff)
        
        GROUP BY month
        ORDER BY month;
    `);

    fs.writeFileSync(
        "src/json/monthly_sir_entries_from_mar_2020.json",
        JSON.stringify(monthly_sir_entries_from_mar_2020)
    );

    //entire history of monthly bus entries since 03/2020
    const monthly_bus_entries_from_mar_2020 = await query(`
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

        WHERE mode = 'Bus'
            AND CAST(date AS DATE) >= DATE '2020-03-01'
            AND CAST(date AS DATE) < (SELECT cutoff_date FROM cutoff)
        
        GROUP BY month
        ORDER BY month;
    `);

    fs.writeFileSync(
        "src/json/monthly_bus_entries_from_mar_2020.json",
        JSON.stringify(monthly_bus_entries_from_mar_2020)
    );

    //entire history of monthly aar entries since 03/2020
    const monthly_aar_entries_from_mar_2020 = await query(`
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

        WHERE mode = 'AAR'
            AND CAST(date AS DATE) >= DATE '2020-03-01'
            AND CAST(date AS DATE) < (SELECT cutoff_date FROM cutoff)
        
        GROUP BY month
        ORDER BY month;
    `);

    fs.writeFileSync(
        "src/json/monthly_aar_entries_from_mar_2020.json",
        JSON.stringify(monthly_aar_entries_from_mar_2020)
    );

    //entire history of weekday monthly otp subway since 01/2015

    const monthly_weekday_subway_otp_rate_from_jan_2015 = {};

    for (const subway_line of ["1", "2", "3", "4", "5", "6", "7", "S 42nd", "GS", "A", "B", "C", "D", "E", "F", "G", "J", "JZ", "L", "M", "N", "Q", "R", "S Fkln", "FS", "S Rock", "H"]) {
        monthly_weekday_subway_otp_rate_from_jan_2015[subway_line] = await query (`
            SELECT
                strftime(month, '%Y-%m') AS month,
                num_on_time_trips AS num_on_time_trips,
                num_sched_trips AS num_sched_trips,
                terminal_on_time_performance AS otp_rate
            FROM mta_subway_otp

            WHERE line = '${subway_line}'
                AND day_type = 1
                AND month >= DATE '2015-01-01'

            ORDER BY month;
        `);

        fs.writeFileSync(
            `src/json/monthly_weekday_subway_otp_rate_from_jan_2015.json`,
            JSON.stringify(monthly_weekday_subway_otp_rate_from_jan_2015)
        )
    }

    //entire history of weekend monthly otp subway since 01/2015

    const monthly_weekend_subway_otp_rate_from_jan_2015 = {};

    for (const subway_line of ["1", "2", "3", "4", "5", "6", "7", "S 42nd", "GS", "A", "B", "C", "D", "E", "F", "G", "J", "JZ", "L", "M", "N", "Q", "R", "S Fkln", "FS", "S Rock", "H"]) {
        monthly_weekend_subway_otp_rate_from_jan_2015[subway_line] = await query (`
            SELECT
                strftime(month, '%Y-%m') AS month,
                num_on_time_trips AS num_on_time_trips,
                num_sched_trips AS num_sched_trips,
                terminal_on_time_performance AS otp_rate
            FROM mta_subway_otp

            WHERE line = '${subway_line}'
                AND day_type = 2
                AND month >= DATE '2015-01-01'

            ORDER BY month;
        `);

        fs.writeFileSync(
            `src/json/monthly_weekend_subway_otp_rate_from_jan_2015.json`,
            JSON.stringify(monthly_weekend_subway_otp_rate_from_jan_2015)
        )
    }

    //BUS DATA, LIST OF LINES BELOW
    const bus_lines = [
        "B1",
        "B100",
        "B102",
        "B103",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
        "B16",
        "B17",
        "B2",
        "B20",
        "B24",
        "B25",
        "B26",
        "B3",
        "B31",
        "B32",
        "B35",
        "B36",
        "B37",
        "B38",
        "B39",
        "B4",
        "B41",
        "B42",
        "B43",
        "B44",
        "B44+",
        "B45",
        "B46",
        "B46+",
        "B47",
        "B48",
        "B49",
        "B52",
        "B54",
        "B57",
        "B6",
        "B60",
        "B61",
        "B62",
        "B63",
        "B64",
        "B65",
        "B67",
        "B68",
        "B69",
        "B7",
        "B70",
        "B74",
        "B8",
        "B82",
        "B82+",
        "B83",
        "B84",
        "B9",
        "BM1",
        "BM2",
        "BM3",
        "BM4",
        "BM5",
        "BX1",
        "BX10",
        "BX11",
        "BX12",
        "BX12+",
        "BX13",
        "BX15",
        "BX16",
        "BX17",
        "BX18",
        "BX18A",
        "BX18B",
        "BX19",
        "BX2",
        "BX20",
        "BX21",
        "BX22",
        "BX23",
        "BX24",
        "BX25",
        "BX26",
        "BX27",
        "BX28",
        "BX29",
        "BX3",
        "BX30",
        "BX31",
        "BX32",
        "BX33",
        "BX34",
        "BX35",
        "BX36",
        "BX38",
        "BX39",
        "BX4",
        "BX40",
        "BX41",
        "BX41+",
        "BX42",
        "BX46",
        "BX4A",
        "BX5",
        "BX6",
        "BX6+",
        "BX7",
        "BX8",
        "BX9",
        "BXM1",
        "BXM10",
        "BXM11",
        "BXM18",
        "BXM2",
        "BXM3",
        "BXM4",
        "BXM6",
        "BXM7",
        "BXM8",
        "BXM9",
        "M1",
        "M10",
        "M100",
        "M101",
        "M102",
        "M103",
        "M104",
        "M106",
        "M11",
        "M116",
        "M12",
        "M125",
        "M14A",
        "M14A+",
        "M14D",
        "M14D+",
        "M15",
        "M15+",
        "M2",
        "M20",
        "M21",
        "M22",
        "M23",
        "M23+",
        "M3",
        "M31",
        "M34+",
        "M34A+",
        "M35",
        "M4",
        "M42",
        "M5",
        "M50",
        "M55",
        "M57",
        "M60+",
        "M66",
        "M7",
        "M72",
        "M79",
        "M79+",
        "M8",
        "M86",
        "M86+",
        "M9",
        "M96",
        "M98",
        "Q1",
        "Q10",
        "Q100",
        "Q101",
        "Q102",
        "Q103",
        "Q104",
        "Q11",
        "Q110",
        "Q111",
        "Q112",
        "Q113",
        "Q114",
        "Q115",
        "Q12",
        "Q13",
        "Q14",
        "Q15",
        "Q15A",
        "Q16",
        "Q17",
        "Q18",
        "Q19",
        "Q2",
        "Q20",
        "Q20A",
        "Q20B",
        "Q21",
        "Q22",
        "Q23",
        "Q24",
        "Q25",
        "Q26",
        "Q27",
        "Q28",
        "Q29",
        "Q3",
        "Q30",
        "Q31",
        "Q32",
        "Q33",
        "Q34",
        "Q35",
        "Q36",
        "Q37",
        "Q38",
        "Q39",
        "Q4",
        "Q40",
        "Q41",
        "Q42",
        "Q43",
        "Q44",
        "Q44+",
        "Q45",
        "Q46",
        "Q47",
        "Q48",
        "Q49",
        "Q5",
        "Q50",
        "Q51",
        "Q52",
        "Q52+",
        "Q53",
        "Q53+",
        "Q54",
        "Q55",
        "Q56",
        "Q58",
        "Q59",
        "Q6",
        "Q60",
        "Q61",
        "Q63",
        "Q64",
        "Q65",
        "Q66",
        "Q67",
        "Q69",
        "Q7",
        "Q70",
        "Q70+",
        "Q72",
        "Q74",
        "Q75",
        "Q76",
        "Q77",
        "Q8",
        "Q80",
        "Q82",
        "Q83",
        "Q84",
        "Q85",
        "Q86",
        "Q87",
        "Q88",
        "Q89",
        "Q9",
        "Q90",
        "Q98",
        "QM1",
        "QM10",
        "QM11",
        "QM12",
        "QM15",
        "QM16",
        "QM17",
        "QM18",
        "QM2",
        "QM20",
        "QM21",
        "QM24",
        "QM25",
        "QM3",
        "QM31",
        "QM32",
        "QM34",
        "QM35",
        "QM36",
        "QM4",
        "QM40",
        "QM42",
        "QM44",
        "QM5",
        "QM6",
        "QM63",
        "QM64",
        "QM65",
        "QM68",
        "QM7",
        "QM8",
        "S40",
        "S42",
        "S44",
        "S46",
        "S48",
        "S51",
        "S52",
        "S53",
        "S54",
        "S55",
        "S56",
        "S57",
        "S59",
        "S61",
        "S62",
        "S66",
        "S74",
        "S76",
        "S78",
        "S79+",
        "S81",
        "S84",
        "S86",
        "S89",
        "S90",
        "S91",
        "S92",
        "S93",
        "S94",
        "S96",
        "S98",
        "SIM1",
        "SIM10",
        "SIM11",
        "SIM15",
        "SIM1C",
        "SIM2",
        "SIM22",
        "SIM23",
        "SIM24",
        "SIM25",
        "SIM26",
        "SIM3",
        "SIM30",
        "SIM31",
        "SIM32",
        "SIM33",
        "SIM33C",
        "SIM34",
        "SIM35",
        "SIM3C",
        "SIM4",
        "SIM4C",
        "SIM4X",
        "SIM5",
        "SIM5X",
        "SIM6",
        "SIM6X",
        "SIM7",
        "SIM8",
        "SIM8X",
        "SIM9",
        "X1",
        "X10",
        "X10B",
        "X11",
        "X12",
        "X14",
        "X15",
        "X17",
        "X17A",
        "X17J",
        "X19",
        "X2",
        "X21",
        "X22",
        "X22A",
        "X27",
        "X28",
        "X3",
        "X30",
        "X31",
        "X37",
        "X38",
        "X4",
        "X42",
        "X5",
        "X63",
        "X64",
        "X68",
        "X7",
        "X8",
        "X9"
    ]

    //entire history of weekend monthly bus speeds since 01/2015

    const monthly_weekday_bus_speeds_from_jan_2015 = {};

    for (const bus_line of bus_lines) {
        monthly_weekday_bus_speeds_from_jan_2015[bus_line] = await query (`
            SELECT
                strftime(month, '%Y-%m') AS month,
                SUM(total_operating_time) AS total_operating_time,
                SUM(total_mileage) AS total_mileage,
                (SUM(total_mileage) / SUM(total_operating_time)) AS average_speed,
            FROM mta_bus_speeds

            WHERE route_id = '${bus_line}'
                AND day_type = 1
                AND month >= DATE '2015-01-01'

            GROUP BY month,
            ORDER BY month;
        `);

        fs.writeFileSync(
            `src/json/monthly_weekday_bus_speeds_from_jan_2015.json`,
            JSON.stringify(monthly_weekday_bus_speeds_from_jan_2015)
        )
    }

    //entire history of weekend monthly bus speeds since 01/2015
    const monthly_weekend_bus_speeds_from_jan_2015 = {};

    for (const bus_line of bus_lines) {
        monthly_weekend_bus_speeds_from_jan_2015[bus_line] = await query (`
            SELECT
                strftime(month, '%Y-%m') AS month,
                SUM(total_operating_time) AS total_operating_time,
                SUM(total_mileage) AS total_mileage,
                (SUM(total_mileage) / SUM(total_operating_time)) AS average_speed,
            FROM mta_bus_speeds

            WHERE route_id = '${bus_line}'
                AND day_type = 2
                AND month >= DATE '2015-01-01'

            GROUP BY month,
            ORDER BY month;
        `);

        fs.writeFileSync(
            `src/json/monthly_weekend_bus_speeds_from_jan_2015.json`,
            JSON.stringify(monthly_weekend_bus_speeds_from_jan_2015)
        )
    }

    //LIST OF BUS LINES FOR OTP
    const bus_lines_otp = [
        "B1",
        "B100",
        "B103",
        "B11",
        "B12",
        "B13",
        "B14",
        "B15",
        "B16",
        "B17",
        "B2",
        "B20",
        "B24",
        "B25",
        "B26",
        "B3",
        "B31",
        "B32",
        "B35",
        "B36",
        "B37",
        "B38",
        "B39",
        "B4",
        "B41",
        "B42",
        "B43",
        "B44",
        "B44+",
        "B45",
        "B46",
        "B46+",
        "B47",
        "B48",
        "B49",
        "B52",
        "B54",
        "B57",
        "B6",
        "B60",
        "B61",
        "B62",
        "B63",
        "B64",
        "B65",
        "B67",
        "B68",
        "B69",
        "B7",
        "B70",
        "B74",
        "B8",
        "B82",
        "B82+",
        "B83",
        "B84",
        "B9",
        "BM1",
        "BM2",
        "BM3",
        "BM4",
        "BM5",
        "BX1",
        "BX10",
        "BX11",
        "BX12",
        "BX12+",
        "BX13",
        "BX15",
        "BX16",
        "BX17",
        "BX18",
        "BX18A",
        "BX18B",
        "BX19",
        "BX2",
        "BX20",
        "BX21",
        "BX22",
        "BX23",
        "BX24",
        "BX25",
        "BX26",
        "BX27",
        "BX28",
        "BX29",
        "BX3",
        "BX30",
        "BX31",
        "BX32",
        "BX33",
        "BX34",
        "BX35",
        "BX36",
        "BX38",
        "BX39",
        "BX4",
        "BX40",
        "BX41",
        "BX41+",
        "BX42",
        "BX46",
        "BX4A",
        "BX5",
        "BX6",
        "BX6+",
        "BX7",
        "BX8",
        "BX9",
        "BXM1",
        "BXM10",
        "BXM11",
        "BXM18",
        "BXM2",
        "BXM3",
        "BXM4",
        "BXM6",
        "BXM7",
        "BXM8",
        "BXM9",
        "M1",
        "M10",
        "M100",
        "M101",
        "M102",
        "M103",
        "M104",
        "M106",
        "M11",
        "M116",
        "M12",
        "M125",
        "M14A",
        "M14A+",
        "M14D",
        "M14D+",
        "M15",
        "M15+",
        "M2",
        "M20",
        "M21",
        "M22",
        "M23+",
        "M3",
        "M31",
        "M34+",
        "M34A+",
        "M35",
        "M4",
        "M42",
        "M5",
        "M50",
        "M55",
        "M57",
        "M60+",
        "M66",
        "M7",
        "M72",
        "M79+",
        "M8",
        "M86+",
        "M9",
        "M96",
        "M98",
        "Q1",
        "Q10",
        "Q100",
        "Q101",
        "Q102",
        "Q103",
        "Q104",
        "Q11",
        "Q110",
        "Q111",
        "Q112",
        "Q113",
        "Q114",
        "Q115",
        "Q12",
        "Q13",
        "Q14",
        "Q15",
        "Q15A",
        "Q16",
        "Q17",
        "Q18",
        "Q19",
        "Q2",
        "Q20",
        "Q20A",
        "Q20B",
        "Q21",
        "Q22",
        "Q23",
        "Q24",
        "Q25",
        "Q26",
        "Q27",
        "Q28",
        "Q29",
        "Q3",
        "Q30",
        "Q31",
        "Q32",
        "Q33",
        "Q34",
        "Q35",
        "Q36",
        "Q37",
        "Q38",
        "Q39",
        "Q4",
        "Q40",
        "Q41",
        "Q42",
        "Q43",
        "Q44+",
        "Q45",
        "Q46",
        "Q47",
        "Q48",
        "Q49",
        "Q5",
        "Q50",
        "Q51",
        "Q52",
        "Q52+",
        "Q53",
        "Q53+",
        "Q54",
        "Q55",
        "Q56",
        "Q58",
        "Q59",
        "Q6",
        "Q60",
        "Q61",
        "Q63",
        "Q64",
        "Q65",
        "Q66",
        "Q67",
        "Q69",
        "Q7",
        "Q70+",
        "Q72",
        "Q74",
        "Q75",
        "Q76",
        "Q77",
        "Q8",
        "Q80",
        "Q82",
        "Q83",
        "Q84",
        "Q85",
        "Q86",
        "Q87",
        "Q88",
        "Q89",
        "Q9",
        "Q90",
        "Q98",
        "QM1",
        "QM10",
        "QM11",
        "QM12",
        "QM15",
        "QM16",
        "QM17",
        "QM18",
        "QM2",
        "QM20",
        "QM21",
        "QM24",
        "QM25",
        "QM3",
        "QM31",
        "QM32",
        "QM34",
        "QM35",
        "QM36",
        "QM4",
        "QM40",
        "QM42",
        "QM44",
        "QM5",
        "QM6",
        "QM63",
        "QM64",
        "QM65",
        "QM68",
        "QM7",
        "QM8",
        "S40",
        "S42",
        "S44",
        "S46",
        "S48",
        "S51",
        "S52",
        "S53",
        "S54",
        "S55",
        "S56",
        "S57",
        "S59",
        "S61",
        "S62",
        "S66",
        "S74",
        "S76",
        "S78",
        "S79+",
        "S81",
        "S84",
        "S86",
        "S89",
        "S90",
        "S91",
        "S92",
        "S93",
        "S94",
        "S96",
        "S98",
        "SBS12",
        "SIM1",
        "SIM10",
        "SIM11",
        "SIM15",
        "SIM1C",
        "SIM2",
        "SIM22",
        "SIM23",
        "SIM24",
        "SIM25",
        "SIM26",
        "SIM3",
        "SIM30",
        "SIM31",
        "SIM32",
        "SIM33",
        "SIM33C",
        "SIM34",
        "SIM35",
        "SIM3C",
        "SIM4",
        "SIM4C",
        "SIM4X",
        "SIM5",
        "SIM5X",
        "SIM6",
        "SIM6X",
        "SIM7",
        "SIM8",
        "SIM8X",
        "SIM9",
        "T117",
        "T323",
        "T403",
        "T430",
        "T464",
        "X1",
        "X10",
        "X10B",
        "X11",
        "X12",
        "X14",
        "X15",
        "X17",
        "X17A",
        "X17J",
        "X19",
        "X2",
        "X21",
        "X22",
        "X22A",
        "X27",
        "X28",
        "X3",
        "X30",
        "X31",
        "X37",
        "X38",
        "X4",
        "X42",
        "X5",
        "X63",
        "X64",
        "X68",
        "X7",
        "X8",
        "X9",
    ]

    //entire history of peak monthly bus otp since 08/2017

    const monthly_peak_bus_otp_from_aug_2017 = {};

        for (const bus_line of bus_lines_otp) {
        monthly_peak_bus_otp_from_aug_2017[bus_line] = await query (`
            SELECT
                strftime(month, '%Y-%m') AS month,
                additional_bus_stop_time AS additional_bus_stop_time,
                additional_travel_time AS additional_travel_time,
                customer_journey_time AS customer_journey_time,
            FROM mta_bus_otp

            WHERE route_id = '${bus_line}'
                AND period = 'Peak'
                AND month >= DATE '2017-07-01'

            ORDER BY month;
        `);

        fs.writeFileSync(
            `src/json/monthly_peak_bus_otp_from_aug_2017.json`,
            JSON.stringify(monthly_peak_bus_otp_from_aug_2017)
        )
    }

    //entire history of peak monthly bus otp since 08/2017

    const monthly_offpeak_bus_otp_from_aug_2017 = {};

        for (const bus_line of bus_lines_otp) {
        monthly_offpeak_bus_otp_from_aug_2017[bus_line] = await query (`
            SELECT
                strftime(month, '%Y-%m') AS month,
                additional_bus_stop_time AS additional_bus_stop_time,
                additional_travel_time AS additional_travel_time,
                customer_journey_time AS customer_journey_time,
            FROM mta_bus_otp

            WHERE route_id = '${bus_line}'
                AND period = 'Off-Peak'
                AND month >= DATE '2017-07-01'

            ORDER BY month;
        `);

        fs.writeFileSync(
            `src/json/monthly_offpeak_bus_otp_from_aug_2017.json`,
            JSON.stringify(monthly_offpeak_bus_otp_from_aug_2017)
        )
    }
    

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

//old MTA entries
async function export_mta_old_ridership(mode, filename) {
    const monthly_entries = await query(`
        SELECT
            strftime(month, '%Y-%m') AS month,
            SUM(ridership) AS count

        FROM mta_overall_ridership_traffic_old

        WHERE agency LIKE '%${mode}%'
            AND CAST(month AS DATE) < DATE '2020-03-01'

        GROUP BY month
        ORDER BY month;
        `);

    fs.writeFileSync(
        `src/json/${filename}.json`,
        JSON.stringify(monthly_entries)
    );

}


await export_mta_old_ridership(
    "Subway",
    "monthly_subway_entries_to_mar_2020_old"
);

await export_mta_old_ridership(
    "LIRR",
    "monthly_lirr_entries_to_mar_2020_old"
);

await export_mta_old_ridership(
    "MNR",
    "monthly_mnr_entries_to_mar_2020_old"
);

await export_mta_old_ridership(
    "SIR",
    "monthly_sir_entries_to_mar_2020_old"
);

await export_mta_old_ridership(
    "Bus",
    "monthly_bus_entries_to_mar_2020_old"
);

await export_mta_old_ridership(
    "AAR",
    "monthly_aar_entries_to_mar_2020_old"
);


//NEXT STEPS, HAVE WEB FRONT END WORK OUT THE JSON FILES TO MAKE GRAPHS IN BROWSER :)