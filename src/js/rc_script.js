//PAGE LOADER
let loading = document.getElementById("loading-page");
if (getComputedStyle(document.getElementById("report-card-content")).visibility === "hidden") {
    loading.textContent = "Loading page... please be patient...";
    loading.style.display = "flex";
    loading.style.alignItems = "center";
    loading.style.justifyContent = "center";
    loading.style.height = "100px";
    loading.style.fontSize = "18px";
    loading.style.color = "#888";
}

//GET MONTHLY SUBWAY ENTRIES SINCE MAR 2020
const monthly_entries_subway_from_mar_2020_rows = await fetch("/src/json/monthly_subway_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY LIRR ENTRIES SINCE MAR 2020
const monthly_lirr_entries_from_mar_2020_rows = await fetch("/src/json/monthly_lirr_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY MNR ENTRIES SINCE MAR 2020
const monthly_mnr_entries_from_mar_2020_rows = await fetch("/src/json/monthly_mnr_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY AAR ENTRIES SINCE MAR 2020
const monthly_aar_entries_from_mar_2020_rows = await fetch("/src/json/monthly_aar_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY BUS ENTRIES SINCE MAR 2020
const monthly_bus_entries_from_mar_2020_rows = await fetch("/src/json/monthly_bus_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY SIR ENTRIES SINCE MAR 2020
const monthly_sir_entries_from_mar_2020_rows = await fetch("/src/json/monthly_sir_entries_from_mar_2020.json")
    .then(res => res.json());

//////////////////////////////////////////////// NEW ^^ OLD VV

//GET MONTHLY SUBWAY ENTRIES SINCE MAR 2020
const monthly_entries_subway_to_mar_2020_rows = await fetch("/src/json/monthly_subway_entries_to_mar_2020_old.json")
    .then(res => res.json());

//GET MONTHLY LIRR ENTRIES SINCE MAR 2020
const monthly_lirr_entries_to_mar_2020_rows = await fetch("/src/json/monthly_lirr_entries_to_mar_2020_old.json")
    .then(res => res.json());

//GET MONTHLY MNR ENTRIES SINCE MAR 2020
const monthly_mnr_entries_to_mar_2020_rows = await fetch("/src/json/monthly_mnr_entries_to_mar_2020_old.json")
    .then(res => res.json());

//GET MONTHLY AAR ENTRIES SINCE MAR 2020
const monthly_aar_entries_to_mar_2020_rows = await fetch("/src/json/monthly_aar_entries_to_mar_2020_old.json")
    .then(res => res.json());

//GET MONTHLY BUS ENTRIES SINCE MAR 2020
const monthly_bus_entries_to_mar_2020_rows = await fetch("/src/json/monthly_bus_entries_to_mar_2020_old.json")
    .then(res => res.json());

//GET MONTHLY SIR ENTRIES SINCE MAR 2020
const monthly_sir_entries_to_mar_2020_rows = await fetch("/src/json/monthly_sir_entries_to_mar_2020_old.json")
    .then(res => res.json());

//COMBINED MONTHLY MTA ENTRIES (OLD + NEW)

//SUBWAY
const monthly_entries_subway_total_rows = [
    ...monthly_entries_subway_to_mar_2020_rows,
    ...monthly_entries_subway_from_mar_2020_rows
];

//LIRR
const monthly_lirr_entries_total_rows = [
    ...monthly_lirr_entries_to_mar_2020_rows,
    ...monthly_lirr_entries_from_mar_2020_rows
];

//MNR
const monthly_mnr_entries_total_rows = [
    ...monthly_mnr_entries_to_mar_2020_rows,
    ...monthly_mnr_entries_from_mar_2020_rows
];

//AAR
const monthly_aar_entries_total_rows = [
    ...monthly_aar_entries_to_mar_2020_rows,
    ...monthly_aar_entries_from_mar_2020_rows
];

//BUS
const monthly_bus_entries_total_rows = [
    ...monthly_bus_entries_to_mar_2020_rows,
    ...monthly_bus_entries_from_mar_2020_rows
];

//SIR
const monthly_sir_entries_total_rows = [
    ...monthly_sir_entries_to_mar_2020_rows,
    ...monthly_sir_entries_from_mar_2020_rows
];

//CREATE LIST OF MTA 6-MODE PUBLIC TRANSIT ENTRIES SINCE MAR 2020
const monthly_multimodal_total_rows = {
  "MNR Ridership": monthly_mnr_entries_total_rows,
  "LIRR Ridership": monthly_lirr_entries_total_rows,
  "Subway Ridership": monthly_entries_subway_total_rows,
  "SIR Ridership": monthly_sir_entries_total_rows,
  "Bus Ridership": monthly_bus_entries_total_rows,
  "Access-a-Ride Ridership": monthly_aar_entries_total_rows,
};

const monthly_multimodal_step_size_reference = {
  "MNR Ridership": 1_000_000,
  "LIRR Ridership": 1_000_000,
  "Subway Ridership": 20_000_000,
  "SIR Ridership": 50_000,
  "Bus Ridership": 5_000_000,
  "Access-a-Ride Ridership": 200_000,
};


//GET MONTHLY WEEKDAY SUBWAY OTP RATES SINCE JAN 2015

//list of subway lines:
let subway_line_list =
[
  "1", "2", "3", "4", "5", "6", "7",
  "S 42nd", "GS", "A", "B", "C", "D", "E", "F", "G", "J",
  "JZ", "L", "M", "N", "Q", "R", "S Fkln", "FS", "S Rock", "H"
]

const monthly_weekday_subway_otp_rate_from_jan_2015_rows =
    await fetch("/src/json/monthly_weekday_subway_otp_rate_from_jan_2015.json")
        .then(res => res.json());

for (const subway_line of subway_line_list) {
    monthly_weekday_subway_otp_rate_from_jan_2015_rows[subway_line] =
        monthly_weekday_subway_otp_rate_from_jan_2015_rows[subway_line].map(entry => ({
            month: entry.month,
            on_time_trips: entry.num_on_time_trips,
            sched_trips: entry.num_sched_trips,
            count: entry.otp_rate * 100
        }));
}

//GET MONTHLY WEEKEND SUBWAY OTP RATES SINCE JAN 2015

const monthly_weekend_subway_otp_rate_from_jan_2015_rows =
    await fetch("/src/json/monthly_weekend_subway_otp_rate_from_jan_2015.json")
        .then(res => res.json());

for (const subway_line of subway_line_list) {
    monthly_weekend_subway_otp_rate_from_jan_2015_rows[subway_line] =
        monthly_weekend_subway_otp_rate_from_jan_2015_rows[subway_line].map(entry => ({
            month: entry.month,
            on_time_trips: entry.num_on_time_trips,
            sched_trips: entry.num_sched_trips,
            count: entry.otp_rate * 100
        }));
}

//function to combine lines together. keeps the keepline, removes removeline
function combineLines(dataset, keepLine, removeLine) {

    const combined = {};

    for (const entry of dataset[keepLine]) {
        combined[entry.month] = {
            on_time_trips: entry.on_time_trips,
            sched_trips: entry.sched_trips
        };
    }

    for (const entry of dataset[removeLine]) {

        if (!combined[entry.month]) {
            combined[entry.month] = {
                on_time_trips: 0,
                sched_trips: 0
            };
        }

        combined[entry.month].on_time_trips += entry.on_time_trips;
        combined[entry.month].sched_trips += entry.sched_trips;
    }

  dataset[keepLine] = Object.entries(combined)
    .map(([month, totals]) => ({
        month,
        on_time_trips: totals.on_time_trips,
        sched_trips: totals.sched_trips,
        count: totals.on_time_trips / totals.sched_trips * 100
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  delete dataset[removeLine];
}

for (const dataset of [
    monthly_weekday_subway_otp_rate_from_jan_2015_rows,
    monthly_weekend_subway_otp_rate_from_jan_2015_rows
]) {
    combineLines(dataset, "S 42nd", "GS");
    combineLines(dataset, "S Fkln", "FS");
    combineLines(dataset, "S Rock", "H");
    combineLines(dataset, "JZ", "J");
}

//update subway_line_list:
subway_line_list =
[
  "1", "2", "3", "4", "5", "6", "7",
  "S 42nd", "A", "B", "C", "D", "E", "F", "G",
  "JZ", "L", "M", "N", "Q", "R", "S Fkln", "S Rock",
]

//GET MONTHLY OVERALL SUBWAY OTP RATES SINCE JAN 2015

const monthly_overall_subway_otp_rate_from_jan_2015_rows = {};

//for each subway line...
for (const subway_line of subway_line_list) {

  //create a weekday and weekend series for each subway line
  const weekday = monthly_weekday_subway_otp_rate_from_jan_2015_rows[subway_line];
  const weekend = monthly_weekend_subway_otp_rate_from_jan_2015_rows[subway_line];

  //build a lookup: month -> weekend entry for each series
  const weekendByMonth = Object.fromEntries(
    (weekend ?? []).map(entry => [entry.month, entry])
  );

  //now create combined on_time_trips and sched_trips from sum of weekend and weekday trips by subway line.
  monthly_overall_subway_otp_rate_from_jan_2015_rows[subway_line] =
    weekday
      .map(weekdayEntry => {

        const weekendEntry = weekendByMonth[weekdayEntry.month];

        const on_time_trips =
          weekdayEntry.on_time_trips + (weekendEntry?.on_time_trips ?? 0);

        const sched_trips =
          weekdayEntry.sched_trips + (weekendEntry?.sched_trips ?? 0);

        //combine into overall database
        return {
          month: weekdayEntry.month,
          on_time_trips,
          sched_trips,
          count: on_time_trips / sched_trips * 100
        };
      });
}

//function to create systemwide otp entry "line" (for each weekday, weekend, overall)
function createSystemwideOTP(dataset) {

    const monthlyTotals = {};

    //for each subway line...
    for (const subway_line of Object.keys(dataset)) {
        
        //for each month in each subway line
        for (const entry of dataset[subway_line]) {

            //if there is yet to be a monthly value for the number of scheduled and on time trips, create a month element and fill it with 0 for now. 
            if (!monthlyTotals[entry.month]) {
                monthlyTotals[entry.month] = {
                    on_time_trips: 0,
                    sched_trips: 0
                };
            }

            //add values to total
            monthlyTotals[entry.month].on_time_trips += entry.on_time_trips;
            monthlyTotals[entry.month].sched_trips += entry.sched_trips;
        }
    }

    //create a new entry "line" for systemwide, add our values to it
    return Object.entries(monthlyTotals).map(([month, totals]) => ({
        month,
        on_time_trips: totals.on_time_trips,
        sched_trips: totals.sched_trips,
        count: totals.on_time_trips / totals.sched_trips * 100
    }));
}

//add systemwide to dataset for each of weekday, weekend, overall
monthly_weekday_subway_otp_rate_from_jan_2015_rows["Systemwide"] =
    createSystemwideOTP(monthly_weekday_subway_otp_rate_from_jan_2015_rows);
  
monthly_weekend_subway_otp_rate_from_jan_2015_rows["Systemwide"] =
    createSystemwideOTP(monthly_weekend_subway_otp_rate_from_jan_2015_rows);

monthly_overall_subway_otp_rate_from_jan_2015_rows["Systemwide"] =
    createSystemwideOTP(monthly_overall_subway_otp_rate_from_jan_2015_rows);

const monthly_subway_otp_rate_step_size_reference = Object.fromEntries(
  [
    "1", "2", "3", "4", "5", "6", "7",
    "S 42nd", "A", "B", "C", "D", "E", "F", "G",
    "JZ", "L", "M", "N", "Q", "R", "S Fkln", "S Rock", "Systemwide"
  ].map(line => [line, 20])
);

//go through the selected choices btwn weekday, weekend, and overall
//depending on which one is chosen, change out the dataset list in the clickselectmultiplelinechart
const subwayOTPDatasets = {
    "Overall": monthly_overall_subway_otp_rate_from_jan_2015_rows,
    "Weekday": monthly_weekday_subway_otp_rate_from_jan_2015_rows,
    "Weekend": monthly_weekend_subway_otp_rate_from_jan_2015_rows
};

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

//GET MONTHLY WEEKDAY BUS SPEEDS SINCE JAN 2015

const monthly_weekday_bus_speeds_from_jan_2015_rows =
    await fetch("/src/json/monthly_weekday_bus_speeds_from_jan_2015.json")
        .then(res => res.json());

for (const bus_line of bus_lines) {
    monthly_weekday_bus_speeds_from_jan_2015_rows[bus_line] =
        monthly_weekday_bus_speeds_from_jan_2015_rows[bus_line].map(entry => ({
            month: entry.month,
            total_operating_time: entry.total_operating_time,
            total_mileage: entry.total_mileage,
            count: entry.average_speed
        }));
}

//GET MONTHLY WEEKEND BUS SPEEDS SINCE JAN 2015

const monthly_weekend_bus_speeds_from_jan_2015_rows =
    await fetch("/src/json/monthly_weekend_bus_speeds_from_jan_2015.json")
        .then(res => res.json());

for (const bus_line of bus_lines) {
    monthly_weekend_bus_speeds_from_jan_2015_rows[bus_line] =
        monthly_weekend_bus_speeds_from_jan_2015_rows[bus_line].map(entry => ({
            month: entry.month,
            total_operating_time: entry.total_operating_time,
            total_mileage: entry.total_mileage,
            count: entry.average_speed
        }));
}

//GET MONTHLY OVERALL BUS SPEEDS SINCE JAN 2015

const monthly_overall_bus_speeds_from_jan_2015_rows = {};

//for each bus line...
for (const bus_line of bus_lines) {

  //create a weekday and weekend series for each subway line
  const weekday = monthly_weekday_bus_speeds_from_jan_2015_rows[bus_line];
  const weekend = monthly_weekend_bus_speeds_from_jan_2015_rows[bus_line];

  //build a lookup: month -> weekend entry for each series
  const weekendByMonth = Object.fromEntries(
    (weekend ?? []).map(entry => [entry.month, entry])
  );

  //now create combined on_time_trips and sched_trips from sum of weekend and weekday trips by subway line.
  monthly_overall_bus_speeds_from_jan_2015_rows[bus_line] =
    weekday
      .map(weekdayEntry => {

        const weekendEntry = weekendByMonth[weekdayEntry.month];

        const total_mileage =
          weekdayEntry.total_mileage + (weekendEntry?.total_mileage ?? 0);

        const total_operating_time =
          weekdayEntry.total_operating_time + (weekendEntry?.total_operating_time ?? 0);

        //combine into overall database
        return {
          month: weekdayEntry.month,
          total_mileage,
          total_operating_time,
          count: total_mileage / total_operating_time
        };
      });
}

//function to create systemwide otp entry "line" (for each weekday, weekend, overall)
function createSystemwideBusSpeeds(dataset) {

    const monthlyTotals = {};

    //for each bus line...
    for (const bus_line of Object.keys(dataset)) {
        
        //for each month in each subway line
        for (const entry of dataset[bus_line]) {

            //if there is yet to be a monthly value for the number of scheduled and on time trips, create a month element and fill it with 0 for now. 
            if (!monthlyTotals[entry.month]) {
                monthlyTotals[entry.month] = {
                    total_mileage: 0,
                    total_operating_time: 0
                };
            }

            //add values to total
            monthlyTotals[entry.month].total_mileage += entry.total_mileage;
            monthlyTotals[entry.month].total_operating_time += entry.total_operating_time;
        }
    }

    //create a new entry "line" for systemwide, add our values to it
    return Object.entries(monthlyTotals).map(([month, totals]) => ({
        month,
        total_mileage: totals.total_mileage,
        total_operating_time: totals.total_operating_time,
        count: totals.total_mileage / totals.total_operating_time
    }));
}

//add systemwide to dataset for each of weekday, weekend, overall
monthly_weekday_bus_speeds_from_jan_2015_rows["Systemwide"] =
    createSystemwideBusSpeeds(monthly_weekday_bus_speeds_from_jan_2015_rows);
  
monthly_weekend_bus_speeds_from_jan_2015_rows["Systemwide"] =
    createSystemwideBusSpeeds(monthly_weekend_bus_speeds_from_jan_2015_rows);

monthly_overall_bus_speeds_from_jan_2015_rows["Systemwide"] =
    createSystemwideBusSpeeds(monthly_overall_bus_speeds_from_jan_2015_rows);

const monthly_bus_speeds_step_size_reference = Object.fromEntries(
    Object.keys(monthly_overall_bus_speeds_from_jan_2015_rows)
          .map(line => [line, 2])
);

//go through the selected choices btwn weekday, weekend, and overall
//depending on which one is chosen, change out the dataset list in the clickselectmultiplelinechart
const busSpeedsDatasets = {
    "Overall": monthly_overall_bus_speeds_from_jan_2015_rows,
    "Weekday": monthly_weekday_bus_speeds_from_jan_2015_rows,
    "Weekend": monthly_weekend_bus_speeds_from_jan_2015_rows
};


//number to letter grade conversion
function getReferenceLetter(score) {
  if (score >= 97.45) return "A+";
  if (score >= 92.45) return "A";
  if (score >= 89.95) return "A-";
  if (score >= 87.45) return "B+";
  if (score >= 82.45) return "B";
  if (score >= 79.95) return "B-";
  if (score >= 77.45) return "C+";
  if (score >= 72.45) return "C";
  if (score >= 69.95) return "C-";
  if (score >= 67.45) return "D+";
  if (score >= 62.45) return "D";
  if (score >= 59.95) return "D-";
  return "F";
}


//SCORE: 

//RIDERSHIP COMPARISON (CURRENT MECHANISM, <<====>> REPLACE W/ SMTH BETTER LATER)
//compare: (examples)
// [jan 2020 - may 2020 to jan 2019 - may 2019]
// [nov 2020 - feb 2021 to nov 2018 - feb 2019]

// [jan 2019 - jan 2020 to 2019 ovr]
// [jan 2022 - may 2023 to 2019 ovr]
// [nov 2021 - nov 2022 to 2019 ovr]
// [nov 2021 - feb 2024 to 2019 ovr] 

function createScoreForMultipleLineChart ({
  //what kind of data are we making the score for? otp will differ from ridership, etc
  mode,

  //data we want to plot, list of datasets, to be unpacked in the function (comparison occurs within datasetList)
  datasetList,

  //original dataset 
  //(originated from earliest possible origin point of call stack (ie: nested -> click select -> multi -> here))
  originalDatasetList,
  
  //what time period are we using to evaluate?
  importedDateRange
}) {

  //create "empty" ver of datasetlist comprising of just name. (ie: F: [])
  const datasetOTPScoreList = Object.fromEntries(
      Object.keys(datasetList).map(name => [name, [[], [], //metric latest month, metric of period
                                                    [], [], //grade latest month, grade period
                                                    [], //line display name
                                                    [], //line technical name
                                                    [], //latest month
                                                  ]])
  );

  if (mode == "OTP") {
  //GRADE SCALE:
  //SCORE = OTP 

    for (const [name, dataset] of Object.entries(datasetList)) {  

      const oneYearLater = new Date(importedDateRange[0]);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);                                         

      //get the average OTP of the line for the time period
      const averageCurrent =
          dataset
              .filter(entry =>
                  entry.count !== 0 &&
                  new Date(entry.month) >= (importedDateRange[0] - 18000001) &&
                  new Date(entry.month) <= importedDateRange[1]
              )
              .reduce((sum, entry) => sum + entry.count, 0) //take the sum of all valid values in the range (non-zero)
          /
          dataset
              .filter(entry =>
                  entry.count !== 0 &&
                  new Date(entry.month) >= (importedDateRange[0] - 18000001) &&
                  new Date(entry.month) <= importedDateRange[1]
              ).length;                                   //divide by the number of valid values in the range (non-zero)
      
      //display name beautifier for weird lines
      const displayName =
        name === "S Rock" ? "Rockaway Park Shuttle" :
        name === "S 42nd" ? "42nd St. Shuttle" :
        name === "S Fkln" ? "Franklin Ave. Shuttle" :
        name === "JZ" ? "J/Z Trains" :
        name === "Systemwide" ? "Systemwide" :
        name + " Train";

      //NEW: update the dataset's OTP score with the OTP of latest month, OTP of time period, grade of latest month, grade of time period
      datasetOTPScoreList[name] = [
        Math.round(originalDatasetList[name][originalDatasetList[name].length-1].count * 10) / 10 + "%",
        Math.round(averageCurrent * 10) / 10 + "%",

        getReferenceLetter(originalDatasetList[name][originalDatasetList[name].length-1].count),
        getReferenceLetter(averageCurrent),

        displayName,
        name,

        new Date(
          new Date(
            originalDatasetList[name].at(-1).month + "-01"
          ).setMonth(
            new Date(
              originalDatasetList[name].at(-1).month + "-01"
            ).getMonth() + 1
          )
        ).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        }),

      ];

    }

  } else if (mode == "Ridership") {

    for (const [name, dataset] of Object.entries(datasetList)) {  

      const oneYearLater = new Date(importedDateRange[0]);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);                                         

      //get the average metric of the line for the time period
      const averageCurrent =
          dataset
              .filter(entry =>
                  entry.count !== 0 &&
                  new Date(entry.month) >= (importedDateRange[0] - 18000001) &&
                  new Date(entry.month) <= importedDateRange[1]
              )
              .reduce((sum, entry) => sum + entry.count, 0) //take the sum of all valid values in the range (non-zero)
          /
          dataset
              .filter(entry =>
                  entry.count !== 0 &&
                  new Date(entry.month) >= (importedDateRange[0] - 18000001) &&
                  new Date(entry.month) <= importedDateRange[1]
              ).length;                                   //divide by the number of valid values in the range (non-zero)
      
      const monthcount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //dict that contains month counts for each month of the year
                        //J, F, M, A, M, J, J, A, S, O, N ,D
      
      for (let i = 0; i < monthcount.length; i++) {
        monthcount[i] = dataset
                          .filter(entry => {
                            return (
                              entry.count !== 0 &&
                              new Date(entry.month).getTime() + 18000001 >= new Date(importedDateRange[0].getTime()) &&
                              new Date(entry.month).getTime() <= importedDateRange[1] &&
                              new Date(new Date(entry.month).getTime() + 18000001).getMonth() === i
                            );

                          }).length;
      }
      
      let average2019; //to be 2019 average metric per line

      // if (importedDateRange[1] >= oneYearLater) { //if the date range is a year or longer... compare to 2019 in full
      
      const to_divide_2019_count = originalDatasetList[name]
        .filter(entry =>
            entry.count !== 0 &&
            entry.month.startsWith("2019-")
        )
        .reduce((sum, entry) => {
            const monthIndex = new Date(
                new Date(entry.month).getTime() + 18000001
            ).getMonth();

            return sum + monthcount[monthIndex];
        }, 0
      ); //get count of valid months to divide in 2019 relevant to the monthcount found in date range

        //do the sum for the line in 2019
        average2019 =
            originalDatasetList[name]
              .filter(entry =>
                  entry.count !== 0 &&
                  entry.month.startsWith("2019-")
              )
              .reduce((sum, entry) => {
                  const monthIndex = new Date(
                      new Date(entry.month).getTime() + 18000001
                  ).getMonth();

                  return sum + (entry.count * monthcount[monthIndex]);
              }, 0) //take the sum of all valid values in 2019 (non-zero)

            /
            
          to_divide_2019_count; //divide by the count of all valid values in 2019 (non-zero)

      //ratio of average metric during the selected date range to average metric in 2019

      const latestEntry = originalDatasetList[name].at(-1);

      const latestDate = new Date(latestEntry.month);
      const latestMonth = latestDate.getMonth();

      const sameMonth2019 = originalDatasetList[name].find(entry => { //get entry of 2019 corresponding to latest month of dataset
          const date = new Date(entry.month);

          return (
              entry.count !== 0 &&
              date.getFullYear() === 2019 &&
              date.getMonth() === latestMonth
          );
      });

      const latest_comp_2019_pct = Math.round((latestEntry.count - sameMonth2019.count)
                              / sameMonth2019.count * 100 * 10) / 10; //rounded to 0.X
      
      const average_current_comp_2019_pct = Math.round((averageCurrent - average2019)
                              / average2019 * 100 * 10) / 10; //rounded to 0.X
      
      //update the dataset's metric score with the metric, calculated rel over 2019, and final grade
      // datasetOTPScoreList[name] = [averageCurrent, ((averageCurrent-average2019)/averageCurrent*100), OTPGrade];

      //display name beautifier for weird lines
      const displayName =
        name === "S Rock" ? "Rockaway Park Shuttle" :
        name === "S 42nd" ? "42nd St. Shuttle" :
        name === "S Fkln" ? "Franklin Ave. Shuttle" :
        name === "JZ" ? "J/Z" :
        name;

      //NEW: update the dataset's metric score with the metric of latest month, metric of time period, grade of latest month, grade of time period
      
      //ridership: "grade" is comparison over 2019

      const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'long',
        maximumFractionDigits: 2 //controls decimal places
      });

      datasetOTPScoreList[name] = [
        `since the same month of 2019, ${formatter.format(originalDatasetList[name][originalDatasetList[name].length - 1].count)} rides this month`,
        `since 2019 average, ${formatter.format(averageCurrent)} average monthly`,        
        
        (latest_comp_2019_pct >= 0 ? "+" : "") + latest_comp_2019_pct + "%",
        (average_current_comp_2019_pct >= 0 ? "+" : "") + average_current_comp_2019_pct + "%",
        
        displayName,
        name,
        new Date(
          ...((([y, m]) => [y, m - 1])(originalDatasetList[name].at(-1).month.split("-").map(Number))),
          1
        ).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        }),
      ];

    }

  } else if (mode == "Speed") {

    for (const [name, dataset] of Object.entries(datasetList)) {  

      const oneYearLater = new Date(importedDateRange[0]);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);                                         

      //get the average metric of the line for the time period
      const averageCurrent =
          dataset
              .filter(entry =>
                  entry.count !== 0 &&
                  new Date(entry.month) >= (importedDateRange[0] - 18000001) &&
                  new Date(entry.month) <= importedDateRange[1]
              )
              .reduce((sum, entry) => sum + entry.count, 0) //take the sum of all valid values in the range (non-zero)
          /
          dataset
              .filter(entry =>
                  entry.count !== 0 &&
                  new Date(entry.month) >= (importedDateRange[0] - 18000001) &&
                  new Date(entry.month) <= importedDateRange[1]
              ).length;                                   //divide by the number of valid values in the range (non-zero)
      
      const monthcount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //dict that contains month counts for each month of the year
                        //J, F, M, A, M, J, J, A, S, O, N ,D
      
      for (let i = 0; i < monthcount.length; i++) {
        monthcount[i] = dataset
                          .filter(entry => {
                            return (
                              entry.count !== 0 &&
                              new Date(entry.month).getTime() + 18000001 >= new Date(importedDateRange[0].getTime()) &&
                              new Date(entry.month).getTime() <= importedDateRange[1] &&
                              new Date(new Date(entry.month).getTime() + 18000001).getMonth() === i
                            );

                          }).length;
      }
      
      let average2019; //to be 2019 average metric per line

      // if (importedDateRange[1] >= oneYearLater) { //if the date range is a year or longer... compare to 2019 in full
      
      const to_divide_2019_count = originalDatasetList[name]
        .filter(entry =>
            entry.count !== 0 &&
            entry.month.startsWith("2019-")
        )
        .reduce((sum, entry) => {
            const monthIndex = new Date(
                new Date(entry.month).getTime() + 18000001
            ).getMonth();

            return sum + monthcount[monthIndex];
        }, 0
      ); //get count of valid months to divide in 2019 relevant to the monthcount found in date range

        //do the sum for the line in 2019
        average2019 =
            originalDatasetList[name]
              .filter(entry =>
                  entry.count !== 0 &&
                  entry.month.startsWith("2019-")
              )
              .reduce((sum, entry) => {
                  const monthIndex = new Date(
                      new Date(entry.month).getTime() + 18000001
                  ).getMonth();

                  return sum + (entry.count * monthcount[monthIndex]);
              }, 0) //take the sum of all valid values in 2019 (non-zero)

            /
            
          to_divide_2019_count; //divide by the count of all valid values in 2019 (non-zero)

      //ratio of average metric during the selected date range to average metric in 2019

      const latestEntry = originalDatasetList[name].reduce((latest, entry) => {
          if (!entry.month) return latest;

          if (!latest) return entry;

          return new Date(entry.month) > new Date(latest.month)
              ? entry
              : latest;
      }, null);

      if (!latestEntry) {
        delete datasetOTPScoreList[name];
        continue;      
      }

      const latestDate = new Date(latestEntry.month);
      const latestMonth = latestDate.getMonth();

      console.log(latestDate);

      //get latest entry and corresponding time ^^

      const sameMonth2019 = originalDatasetList[name].find(entry => { //get entry of 2019 corresponding to latest month of dataset
          const date = new Date(entry.month);

          return (
              entry.count !== 0 &&
              date.getFullYear() === 2019 &&
              date.getMonth() === latestMonth
          );
      });

      let latest_comp_2019_pct;
      let countSameMonth2019;

      if (sameMonth2019) {
        countSameMonth2019 = sameMonth2019.count;

        latest_comp_2019_pct = Math.round((latestEntry.count - sameMonth2019.count)
          / sameMonth2019.count * 100 * 10) / 10; //rounded to 0.X
        
      } else {
        latest_comp_2019_pct = "N/A";
      } 


      
      const average_current_comp_2019_pct = Math.round((averageCurrent - average2019)
                              / average2019 * 100 * 10) / 10; //rounded to 0.X
      
      //update the dataset's metric score with the metric, calculated rel over 2019, and final grade
      // datasetOTPScoreList[name] = [averageCurrent, ((averageCurrent-average2019)/averageCurrent*100), OTPGrade];

      //display name beautifier for weird lines
      const displayName =
        name === "S Rock" ? "Rockaway Park Shuttle" :
        name === "S 42nd" ? "42nd St. Shuttle" :
        name === "S Fkln" ? "Franklin Ave. Shuttle" :
        name === "JZ" ? "J/Z" :
        name;

      //NEW: update the dataset's metric score with the metric of latest month, metric of time period, grade of latest month, grade of time period
      
      //ridership: "grade" is comparison over 2019

      const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'long',
        maximumFractionDigits: 2 //controls decimal places
      });
      
      datasetOTPScoreList[name] = [

        (latest_comp_2019_pct >= 0 ? "+" : "") + latest_comp_2019_pct + "% since the same month of 2019",
        (average_current_comp_2019_pct >= 0 ? "+" : "") + average_current_comp_2019_pct + "% since 2019 average,",

        `${formatter.format(latestEntry.count)} mph this month`,
        `${formatter.format(averageCurrent)} mph`,
        
        displayName,
        name,
        new Date(latestDate.getTime() + 18000001).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
        }),
      ];

    }

  }

  return datasetOTPScoreList;

}

//plot multiple lines in one chart. helper for makeLineChart (input single dataset as parameter)
function makeMultipleLineChart ({

  //data we want to plot, list of datasets, to be unpacked in the function
  datasetList,

  //original dataset 
  //(originated from earliest possible origin point of call stack (ie: nested -> click select -> multi -> here))
  originalDatasetList,

  //container name we want to use to put actual chart into (TAKEN FROM BLOG PAGE)
  containerId,

  //container name we want to use to put interpretive score into (TAKEN FROM BLOG PAGE) 
  //UNDEFINED UNLESS SPECIFIED
  interpretationBoxId = undefined,

  //type of metric scorecard being made, undefined unless specified in call stack
  scorecardMode = undefined,

  //what time scale are we graphing over? days, months?
  timeOfInterest,

  //padding constant from left/right sides
  paddingLeft = 60,
  paddingRight = 60,

  //set step for chart according to scale of data
  yAxisStep,

  //set cutoff for truncated label counts on points
  pointLabelCutoffCount = 40,

  //enable minor X-axis gridlines
  enableMinorXGridlines,

  //set colors for elements
  gridLabelColor = "#e8e9de",

  lineColors = [
    "#FF595E",
    "#8AC926",
    "#FFCA3A",
    "#6A4C93",
    "#FF924C",
    "#00C2A8",
    "#F72585",
  ],
  passLineColorsAsStatic = false, //if set to true, the line colors will be index-paired with the datasetListStepSizeReference 
  //(if datasetListStepSizeReference is longer than lineColors list, lineColors will loop over)

  datasetListStepSizeReference = undefined, //not needed unless passLineColorsAsStatic is true

  importedDateRange = [
    new Date(1900, 0, 1),
    new Date(2099, 11, 31)
  ],

  pointColor = "#eafafa",
  gridColor = "#555",
  thick_gridColor = "#888",

  //set aspect ratio
  aspectRatio = 4,

  //set width and height via a viewbox (sets maximums, the rest is scaled according to platform size)
  viewBoxWidth = 1000,
  viewBoxHeight = (viewBoxWidth / aspectRatio),
}) {
  

  //unpack datasetList:

  //filter out rows that are not in given date range (date range is set to 1900-2099 by default)  
  const filteredDatasetList = {};

  for (const [name, dataset] of Object.entries(datasetList)) {      

    filteredDatasetList[name] = dataset.filter(r => {
      let d;

      //for month
      if (timeOfInterest === "month") {
        const [year, month] = r.month.split("-").map(Number);
        d = new Date(year, month - 1, 1);

      //for date
      } else if (timeOfInterest === "date") {
        const [year, month, day] = r.date.split("-").map(Number);
        d = new Date(year, month - 1, day);
      }

      //if row date is within range, return the row as having passed filter

      return d >= importedDateRange[0] && d <= importedDateRange[1];
    });
  }

  datasetList = filteredDatasetList;

  //get highest date of all elements
  //get lowest date of all elements
  //get highest y-value of all datasets

  let max_date = new Date("1900-01-01"); //make a date that is almost guaranteed to be surpassed
  let min_date = new Date("3000-01-01"); //make a date that is almost guaranteed to be preceeded (unless you're phillip fry :p)
  let rows_max_val = 0; //set max value as 0 for now
  let rows_min_val = 999999; //set min value as very high for now

  //loop through every dataset we have
  for (const [name, dataset] of Object.entries(datasetList)) {

    //update max value through each dataset
    let local_max = Math.max(...dataset.map(r => Number(r.count)));
    let local_min = Math.min(...dataset.map(r => Number(r.count)));
    if (local_max > rows_max_val) {
      rows_max_val = local_max;
    }
    if (local_min < rows_min_val) {
      rows_min_val = local_min;
    }

    //update max date and min date value through each dataset
    //repeat min/maxes for checks within each datset
    let local_date_max = new Date("1900-01-01"); //make a date that is almost guaranteed to be surpassed
    let local_date_min = new Date("3000-01-01"); //make a date that is almost guaranteed to be preceeded (unless you're phillip fry :p)


    for (const r of dataset) {

      //if the date is a month, it must be converted to a date with a day
      let d;
      if (timeOfInterest == "month") {
        d = new Date(r.month + "-01");
      } else if (timeOfInterest == "date") {
        d = new Date(r.date);
      }

      //WITHIN EACH DATASET, FIND THE MIN/MAX DATES
      if (d > local_date_max) {
        local_date_max = d;
      }

      if (d < local_date_min) {
        local_date_min = d;
      }
    }

    //ACROSS DATASETS, FIND THE MIN/MAX DATES
    if (local_date_max > max_date) {
      max_date = local_date_max;
    }

    if (local_date_min < min_date) {
      min_date = local_date_min;
    }
  }

  //throw error if no counts for a dataset
  if (rows_max_val === undefined || rows_max_val === 0 || Number.isNaN(rows_max_val)) {

      const container = document.getElementById(containerId);

      container.innerHTML = "";
      container.textContent = "Dataset contains undefined or missing values, try something else";

      // console.error("Invalid count:", rows_max_val);
      // throw new Error("Dataset contains undefined or missing values, try something else");
      //error throwing was too extreme of a response.. commented out
  }

  //point count is determined separately by timeofinterest, taken as difference of max date and min date
  let pointCount;

  if (timeOfInterest == "month") {
    const month_diff =
      (max_date.getFullYear() - min_date.getFullYear()) * 12 +
      (max_date.getMonth() - min_date.getMonth());
    pointCount = month_diff + 1; //inclusive range
  
  } else if (timeOfInterest == "date") {
    const date_diff = Math.round(
      (max_date - min_date) /
      (1000 * 60 * 60 * 24) //divide epoch time by ms, sec, min, hour in a day
    ); 
    pointCount = date_diff + 1; //inclusive range
  }

  //set MinorXGridlines to be off when the pointLabelCutoffCount is reached
  if (enableMinorXGridlines == undefined) {
    enableMinorXGridlines = pointCount >= pointLabelCutoffCount ? 0 : 1;
  }

  //throw an error asking for datasetListStepSizeReference when passLineColorsAsStatic is true
  if (passLineColorsAsStatic && datasetListStepSizeReference === undefined) {
    throw new Error(
      "datasetListStepSizeReference is required when passLineColorsAsStatic is true"
    );
  }

  //make chart loader
  const multi_line = document.createElement(containerId); //<- Chart element

  const multi_line_loader = document.createElement("div");
  multi_line_loader.textContent = "Loading chart...";
  multi_line_loader.style.display = "flex";
  multi_line_loader.style.alignItems = "center";
  multi_line_loader.style.justifyContent = "center";
  multi_line_loader.style.height = "200px";
  multi_line_loader.style.fontSize = "14px";
  multi_line_loader.style.color = "#666";
  multi_line.appendChild(multi_line_loader); //<- Make the "chart" the loader for now

  document.getElementById(containerId).appendChild(multi_line) //<- Display

  //use svg to set line chart size attributes
  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  //allow overflow
  svg.style.overflow = "visible";

  //set max gridline for line chart based on step size and max value
  const yAxisMax =
    Math.ceil(rows_max_val / yAxisStep) *
    yAxisStep;

  svg.setAttribute(
    "viewBox",
    `0 0 ${viewBoxWidth} ${viewBoxHeight}`
  );

  //make aspect ratio to ensure device scalability
  svg.style.width = "100%";
  svg.style.height = "auto";
  svg.style.aspectRatio = `${aspectRatio} / 1`;

  //create list of coordinate paths for each dataset, will be filled out iteratively below:
  let coordsList = {};

  //for each dataset,
  for (const [i, [name, dataset]] of Object.entries(datasetList).entries()) {

    //set points on line chart (time, value : x, y), get value and date as well
    coordsList[name] = dataset.map(r => {
      let d, x; 

      //if month, make a system for x using month offset
      if (timeOfInterest == "month") {
        //create new date objects
        
        const [year, month] = r.month.split("-").map(Number);
        d = new Date(year, month - 1, 1);

        const monthOffset =
          (d.getUTCFullYear() - min_date.getUTCFullYear()) * 12 +
          (d.getUTCMonth() - min_date.getUTCMonth());

        if (pointCount === 1) {
          x = viewBoxWidth / 2;
        } else {
          x =
            paddingLeft + 
            (monthOffset / (pointCount - 1)) *
            (viewBoxWidth - paddingLeft - paddingRight);
        }
      
      //if day, make a system for x using day offset
      } else if (timeOfInterest == "date") {
        //create new date objects

        const [year, month, day] = r.date.split("-").map(Number);
        d = new Date(year, month - 1, day);

        const dayOffset =
          Math.round((d - min_date) / (1000 * 60 * 60 * 24));

        if (pointCount === 1) {
          x = viewBoxWidth / 2;
        } else {
          x =
            paddingLeft +
            (dayOffset / (pointCount - 1)) *
            (viewBoxWidth - paddingLeft - paddingRight);
        }
      }      
      return {
      x: x,

      //set y using value relative to max in viewbox
      y: viewBoxHeight - 
        (Number(r.count) / yAxisMax) * 
        viewBoxHeight,
      
      value: r.count,

      date: d
      };

    });
  }

  //SET AXES

  //Y AXIS TICK MARKS

  //tickCount = max value / step size
  const tickCount = yAxisMax / yAxisStep;

  //for all the ticks we want... (max value / step size)
  for (let i = 0; i <= tickCount; i++) {

    //set value for each tick mark
    const value = yAxisMax - (i * yAxisStep);

    //set position for each tick mark
    const y =
      (i / tickCount) *
      (viewBoxHeight);

    //tick mark element creation
    const tick = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    //set location of positions of ends of tick marks
    tick.setAttribute("x1", paddingLeft-10);
    tick.setAttribute("x2", paddingLeft);
    tick.setAttribute("y1", y);
    tick.setAttribute("y2", y);

    //color tick marks
    tick.setAttribute("stroke", gridColor);

    //put down ticks
    svg.appendChild(tick);

    //Y AXIS LABELS

    const y_axis_label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    //set location of labels
    y_axis_label.setAttribute("x", paddingLeft-20);
    y_axis_label.setAttribute("y", y + 4);

    //set color/style of labels
    y_axis_label.setAttribute("text-anchor", "end");
    y_axis_label.setAttribute("fill", gridLabelColor);

    y_axis_label.setAttribute("font-size", `${90 / tickCount}`);    

    //set value as text
    y_axis_label.textContent =
      Math.round(value).toLocaleString();

    //put down labels
    svg.appendChild(y_axis_label);

  }

  //X AXIS LABEL
  
  //start by making standardized X axis points for the entire range from min_date to max_date (instead of deriving it from the points)
  let xAxisPoints = [];

  //for all points...
  for (let i = 0; i < pointCount; i++) {
    
    //create a sample day d
    let d;

    //if the points are to be monthly, set them using min_date's month
    if (timeOfInterest == "month") {
      d = new Date(
        min_date.getUTCFullYear(),
        min_date.getUTCMonth() + i,
        1
      );
    
    //if the points are to be daily, set them using min_date's day
    } else if (timeOfInterest == "date") {
      d = new Date(min_date);
      d.setDate(min_date.getUTCDate() + i);
    }

    //set points and corresponding dates
    const x = pointCount === 1 ? viewBoxWidth / 2 :
      paddingLeft +
      (i / (pointCount - 1)) *
      (viewBoxWidth - paddingLeft - paddingRight);


    xAxisPoints.push({
      x,
      date: d
    });
  }

  let skip_amount;

  //for each point on x-axis...
  xAxisPoints.forEach((p, i) => {

    const x_axis_label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    //set x value of x label to be where point was
    x_axis_label.setAttribute("x", p.x);

    //set y value of y label to be at the bottom-ish of the chart 
    x_axis_label.setAttribute(
      "y",
      viewBoxHeight + 40
    );

    //anchor text to middle of position
    x_axis_label.setAttribute(
      "text-anchor",
      "middle"
    );

    x_axis_label.setAttribute("font-size", `${100 / tickCount}`);
    
    //set label fill color
    x_axis_label.setAttribute("fill", gridLabelColor);

    //place different axis labels based on time of interest, use the xAxisPoints' date values as references instead of those of the dataset
    if (timeOfInterest == "month") {
      //get year and month from each month value to put down as labels cleanly
      x_axis_label.textContent =
        `${p.date.toLocaleDateString('en-US', { month: 'short' })} '${String(p.date.getFullYear()).slice(-2)}`;
    }

    if (timeOfInterest == "date") {
      
      //get year, month, date from each date to put down as labels cleanly
      x_axis_label.textContent =
        `${p.date.toLocaleDateString("en-US", {weekday:"short"})}, ${p.date.toLocaleDateString("en-US", {month:"2-digit", day:"2-digit"})}`;
    }

    //how many x-axis labels should we skip to make it look less cramped?
    skip_amount = Math.max(
      1,
      Math.round(pointCount / ( viewBoxWidth / (100 / tickCount) / x_axis_label.textContent.length))
    );  //result cannot be less than 1

    //put down x-label, skipping the amount of labels we calculated earlier
    if (i % skip_amount == 0) {
      svg.appendChild(x_axis_label);
    }

  });

  //GRID

  //Y-GRIDLINES

  //for all the ticks we have...
  for (let i = 0; i <= tickCount; i++) {
    
    //set y value for gridline
    const y =
      (i / tickCount) *
      (viewBoxHeight);
    
    //make svg gridline
    const y_grid = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    //set y-gridlines
    y_grid.setAttribute("x1", paddingLeft);
    y_grid.setAttribute("x2", viewBoxWidth - paddingRight);
    y_grid.setAttribute("y1", y);
    y_grid.setAttribute("y2", y);

    y_grid.setAttribute("stroke", gridColor);
    y_grid.setAttribute("stroke-width", "1");

    svg.appendChild(y_grid);
  }

  //X-GRIDLINES

  xAxisPoints.forEach((p, i) => {

    const x_grid = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    x_grid.setAttribute("x1", p.x);
    x_grid.setAttribute("x2", p.x);

    x_grid.setAttribute("y1", 0);
    x_grid.setAttribute("y2", viewBoxHeight);

    //use the skip_amount to put thicker/more contrasted grid-lines on the labeled axis points
    if (i % skip_amount == 0) {
      x_grid.setAttribute("stroke-width", "1.25");
      x_grid.setAttribute("stroke", thick_gridColor);
    } else {
      x_grid.setAttribute("stroke-width", `${enableMinorXGridlines}`);
      x_grid.setAttribute("stroke", gridColor);
    }

    svg.appendChild(x_grid);

  });

  //create polylines for each dataset, MOVED TO END TO GO OVER GRID

    for (const [i, [name, dataset]] of Object.entries(datasetList).entries()) {
    //new version of for loop with datasetListStepSizeReference instead if passLineColorsAsStatic is true, 

      const line_polyline = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

      //set lines connecting points if they are consecutive

      //checker process for if we skipped any points. any non-consecutive points must NOT be coonected
      let currentPoints = [];

      for (let j = 0; j < coordsList[name].length; j++) {

        const p = coordsList[name][j];

        if (j > 0) {

          const prevDate = coordsList[name][j - 1].date;
          const currDate = p.date;

          let expectedNext;

          if (timeOfInterest == "month") {
            expectedNext = new Date(
              prevDate.getFullYear(),
              prevDate.getMonth() + 1,
              1
            );
          }

          if (timeOfInterest == "date") {
            expectedNext = new Date(prevDate);
            expectedNext.setDate(prevDate.getDate() + 1);
          }

          //gap found -> draw previous segment, then restart
          if (currDate.getTime() !== expectedNext.getTime()) {

            const gap_polyline = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "polyline"
            );

            gap_polyline.setAttribute(
              "points",
              currentPoints.map(p => `${p.x},${p.y}`).join(" ")
            );

            gap_polyline.setAttribute("fill", "none");

            if (passLineColorsAsStatic) {
              //find index of name ^ in datasetListStepSizeReference, and then set index lineColors[index] of this found index
              const index = Object.keys(datasetListStepSizeReference).indexOf(name);
              gap_polyline.setAttribute("stroke", lineColors[index % lineColors.length]); //<- do the remainder to ensure loopability when needed
            } else {
              gap_polyline.setAttribute("stroke", lineColors[i]);
            }

            gap_polyline.setAttribute("stroke-width", "2.5");

            svg.appendChild(gap_polyline);

            currentPoints = [];
          }
        }

        currentPoints.push(p);
      }


      //draw final segment
      if (currentPoints.length > 1) {

        const gap_polyline = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polyline"
        );

        gap_polyline.setAttribute(
          "points",
          currentPoints.map(p => `${p.x},${p.y}`).join(" ")
        );

        gap_polyline.setAttribute("fill", "none");

        if (passLineColorsAsStatic) {
          //find index of name ^ in datasetListStepSizeReference, and then set index lineColors[index] of this found index
          const index = Object.keys(datasetListStepSizeReference).indexOf(name);
          gap_polyline.setAttribute("stroke", lineColors[index % lineColors.length]); //<- do the remainder to ensure loopability when needed
        } else {
          gap_polyline.setAttribute("stroke", lineColors[i]);
        }

        gap_polyline.setAttribute("stroke-width", "2.5");

        svg.appendChild(gap_polyline);
      }
    }

  //POINTS
  for (const [i, [name, dataset]] of Object.entries(datasetList).entries()) {
    coordsList[name].forEach((p,j) => {

      //get circle info from web standard
      const line_circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

      //establish point size relative to number of points
      const circle_radius = Math.max((5.5 - ((pointCount/20) * Object.entries(datasetList).length/3)), 3);

      line_circle.setAttribute("cx", p.x); //set x position of circle to our x
      line_circle.setAttribute("cy", p.y); //set y position of circle to our y
      line_circle.setAttribute("r", circle_radius); //set radius
      line_circle.setAttribute("fill", pointColor); //set color

      //create text necessary for hover, one for month case, one for date case
      let tooltip_text = "";

      if (timeOfInterest == "month") {
        //get year and month from each month value to put down as labels cleanly
        const [year, month] =
          dataset[j].month.split('-').map(Number);
        
        //get date attribute for each month to turn into datestring
        const d = new Date(year, month - 1, 1);

        //create tooltip
        tooltip_text = `${name} \n${d.toLocaleDateString('en-US', { month: 'long' })+ " " + dataset[j].month.slice(0,4)}: ${coordsList[name][j].value.toLocaleString()}`; //<- "Title" will appear on hover:
                                                                                  // month, year: count
      }

      if (timeOfInterest == "date") {
        //get year and month from each month value to put down as labels cleanly
        const [year, month, date] =
          dataset[j].date.split('-').map(Number);

        //get date attribute for each month to turn into datestring
        const d = new Date(year, month - 1, date);

        //create tooltip
        tooltip_text = `${name} \n${d.toLocaleDateString('en-US',{ date: 'long' })}: ${coordsList[name][j].value.toLocaleString()}`; //<- "Title" will appear on hover:
                                                                                  // date: count
      }

      //create title element which we will add the tooltip text to
      const title = document.createElementNS(
        "http://www.w3.org/2000/svg", 
        "title"
      );

      //add tooltip text to title
      title.textContent = tooltip_text;

      //add title to circle
      line_circle.appendChild(title);

      //add circle
      svg.appendChild(line_circle); //MOVED TO END TO GO OVER GRID

    });
  }

  //POINT LABELS

  //for every dataset...
  for (const [i, [name, dataset]] of Object.entries(datasetList).entries()) {

    //for every point...
    coordsList[name].forEach((p,j) => {

      //make a text label with web standard
      const line_text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

      //set x,y positions of text

      //x is on the point
      line_text.setAttribute("x", p.x);

      //y is just below point, unless line is decreasing by following logic:

      let opposite_height_mult = 1; //default label will be lower on first item

      if ((j+1 <= coordsList[name].length-1) && (coordsList[name][j+1].value < coordsList[name][j].value)) { //if non-first item is less than previous item,
        opposite_height_mult = -1;                             //put label above line
      }

      if (j+1 <= dataset.length-1) { //if non-last item, see the slope of the line ahead 
                                    //to get label out of the way with a multiplier

      }
      line_text.setAttribute("y", p.y + ((dataset.length / 1000 + 16) * (opposite_height_mult)));

      //text starts just after point
      line_text.setAttribute("text-anchor", "start");
      line_text.setAttribute("dominant-baseline", "middle");

      //font size and color
      line_text.setAttribute("font-size", `${85 / tickCount}`);

      line_text.setAttribute("fill", gridLabelColor);

      //set value of point, in comma form for readability
      line_text.textContent = p.value.toLocaleString();

      //inner function to add point label lines. only needed when points have a possibility to become ambiguous, like when:
      //1. points skip labels
      //2. points are only labeled by min/max/start/end
      const addPointLabelLine = () => {
        if (pointCount >= pointLabelCutoffCount || skip_amount > 1) {
          //make point label line
          const point_label_line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );

          //set line boundaries
          point_label_line.setAttribute("x1", p.x-1);
          point_label_line.setAttribute("x2", p.x-1);
          point_label_line.setAttribute("y1", p.y);
          point_label_line.setAttribute("y2", p.y + ((dataset.length / 1000 + 18) * (opposite_height_mult)));

          point_label_line.setAttribute("stroke", gridLabelColor);
          point_label_line.setAttribute("stroke-width", "1");

          svg.appendChild(point_label_line);
        }
      };

      //if there are enough points, but only one dataset, put down only the first, last, min, and max labels
      if ((dataset.length >= pointLabelCutoffCount) && (Object.entries(datasetList).length == 1)) {
        // min/max needs to be checked locally, NOT against global rows_max_val
        if (j == 0 || j == dataset.length-1 || p.value == Math.max(...dataset.map(r => Number(r.count))) || p.value == Math.min(...dataset.map(r => Number(r.count)))) {
          svg.appendChild(line_text);
          addPointLabelLine();
        }
      }
      //if there are enough points, and many datasets, put down only the global min and global max labels
      else if ((dataset.length >= pointLabelCutoffCount) && (Object.entries(datasetList).length > 1)) {
        if (p.value == rows_max_val || p.value == rows_min_val) {
          svg.appendChild(line_text);
          addPointLabelLine();  
        }
      } else {
      //if there are not enough points, just put down the skip_amount interval point labels
        if (j % skip_amount == 0) {
          svg.appendChild(line_text);
          addPointLabelLine();
        }
      }
    });
  }

  // LEGEND

  let currentLegendY; //save legend position for when we are putting down OTP result text

  //set height of the legend to be below the bottom of graph, past the x-axis labels
  const legendY = viewBoxHeight + 70;

  //set spacing apart between legend labels
  const legendLineLength = 25;
  let legendSpacing;

  //total width of legend block is defined by start and max
  const legendStartX = 60;
  const legendMaxX = viewBoxWidth - 60;

  let legendX = legendStartX;

  //start at first row
  let legendRow = 0;

  const legendRowHeight = 25;

  //for all datasets...
  for (const [i, [name, dataset]] of Object.entries(datasetList).entries()) {

    //if next item would overflow, move to next row
    legendSpacing = Math.max((name.length * 15), (7 * 15)); //minimum "name.length" should be 6 in case name is shorter than 6 char
    if (legendX + legendSpacing > legendMaxX) {
      legendX = legendStartX;
      legendRow++;
    }

    currentLegendY = legendY + (legendRow * legendRowHeight);

    //get line svg for legend sample line
    const legendLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    //set coordinates for sample line
    legendLine.setAttribute("x1", legendX);
    legendLine.setAttribute("x2", legendX + legendLineLength);
    legendLine.setAttribute("y1", currentLegendY);
    legendLine.setAttribute("y2", currentLegendY);

    if (passLineColorsAsStatic) {
      //find index of name ^ in datasetListStepSizeReference, and then set index lineColors[index] of this found index
      const index = Object.keys(datasetListStepSizeReference).indexOf(name);
      legendLine.setAttribute("stroke", lineColors[index % lineColors.length]); //<- do the remainder to ensure loopability when needed
    } else {
      legendLine.setAttribute("stroke", lineColors[i]);
    }

    legendLine.setAttribute("stroke-width", "3");

    //add legend line to svg
    svg.appendChild(legendLine);

    //now time to add dataset name
    const legendText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    //set x position of dataset name label
    legendText.setAttribute(
      "x",
      legendX + legendLineLength + 8
    );

    //set y-position of dataset name label
    legendText.setAttribute(
      "y",
      currentLegendY + 4
    );

    //set color, font, text position

    legendText.setAttribute(
      "fill",
      gridLabelColor
    );

    legendText.setAttribute(
      "font-size",
      `${100 / tickCount}`
    );

    legendText.setAttribute(
      "text-anchor",
      "start"
    );

    legendText.textContent = name;

    //add text to svg
    svg.appendChild(legendText);

    //move right for next item
    legendX += legendSpacing;

  }


  //SCORES

  const score_box = document.getElementById(interpretationBoxId);

  //wipe previous score
  score_box.innerHTML = "";

  //create SVG container
  const svg_score = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  //allow overflow
  svg_score.style.overflow = "visible";

  //get score box width
  const scoreViewBoxWidth = score_box.clientWidth;

  //temporary height (will update itself later)
  let scoreViewBoxHeight = 200;

  //set SVG viewbox
  svg_score.setAttribute(
    "viewBox",
    `0 0 ${scoreViewBoxWidth} ${scoreViewBoxHeight}`
  );

  svg_score.style.width = "100%";
  svg_score.style.height = "auto";

  //CALL FUNCTION TO GET SCORE TEXT <<===>> UPDATE LATER TO CLEAR HARDCODING OF OTP
  const result = createScoreForMultipleLineChart({
    mode: scorecardMode,
    datasetList: datasetList,
    originalDatasetList: originalDatasetList,
    importedDateRange: importedDateRange
  });


  //HTML TEXT INSIDE SVG

  const foreignObject = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );


  foreignObject.setAttribute("x", 0);
  foreignObject.setAttribute("y", 0);

  foreignObject.setAttribute(
    "width",
    scoreViewBoxWidth
  );

  foreignObject.setAttribute(
    "height",
    scoreViewBoxHeight
  );

  //HTML div for wrapping
  const div = document.createElement("div");

  div.style.width = "100%";
  div.style.fontSize = "17px";
  div.style.lineHeight = "1.4";
  div.style.color = pointColor;
  div.style.textAlign = "left";

  div.style.display = "flex";
  div.style.flexWrap = "wrap";
  div.style.gap = "10px";
  div.style.justifyContent = "center";
  div.style.width = "auto";

  div.style.margin = "0";
  div.style.padding = "0";

  div.style.overflow = "visible";

  //wrap long strings
  div.style.overflowWrap = "break-word";
  div.style.wordBreak = "break-word";


  //put text in <<=====>> REPLACE WITH OTHER THINGS WHEN NOT OTP

  for (const [line, values] of Object.entries(result)) {
    const [
      latestOTP,
      rangeOTP,
      latestGrade,
      rangeGrade,
      subwayLine,
      name,
      latestMonth
    ] = values;

    let box_color; //what to color the box of the report card scorecard

    if (passLineColorsAsStatic) {
      //find index of name ^ in datasetListStepSizeReference, and then set index lineColors[index] of this found index
      const index = Object.keys(datasetListStepSizeReference).indexOf(name);

      box_color = lineColors[index % lineColors.length]; //<- do the remainder to ensure loopability when needed

    } else {
      box_color = lineColors[i];
    }
    
    const lines_count = Object.keys(result).length;
    const scale = 2 / Math.pow(lines_count, .333);

    const line_height = Math.max(1, 1.3/lines_count);

    div.innerHTML += `
      <div style="
        display: inline-block;
        width: fit-content;
        border: 2px solid ${pointColor};
        border-radius: 10px;
        padding: ${Math.max(2, 5/lines_count)}px;
        text-align: center;
        background-color: ${box_color};
      ">
      
        <div style="
          font-size:${Math.max(14, 30 * scale)}px;
          font-weight:bold;
          line-height:${line_height};
          text-align:center;
        ">
        ${subwayLine}
        </div>


        <div style="
          font-size:${Math.max(9, 19 * scale)}px;
          font-weight:bold;
          line-height:${line_height};
          text-align:center;
        ">
        ${importedDateRange[0].toLocaleDateString("en-US", {
              month: "short",
              year: "numeric"
          })} to ${importedDateRange[1].toLocaleDateString("en-US", {
              month: "short",
              year: "numeric"
        })}
        </div> 

        <div style="
          font-size:${Math.max(16, 33 * scale)}px;
          font-weight:bold;
          line-height:${line_height};
          text-align:center;
        ">
          ${rangeGrade}
        </div>

        <div style="
          font-size:${Math.max(8, 16.66 * scale)}px;
          font-weight:bold;
          line-height:${line_height};
          text-align:center;
        ">
        ${rangeOTP}
        </div>

        <div style="
          font-size:${Math.max(9, 19 * scale)}px;
          font-weight:bold;
          line-height:${line_height};
          text-align:center;
        ">
        Latest Month (${latestMonth}):
        </div>

        <div style="
          font-size:${Math.max(16, 33 * scale)}px;
          font-weight:bold;
          line-height:${line_height};
          text-align:center;
        ">
          ${latestGrade}
        </div>

        <div style="
          font-size:${Math.max(8, 16.66 * scale)}px;
          font-weight:bold;
          line-height:${line_height};
          text-align:center;
        ">
        ${latestOTP}
        </div>
      </div>
    `;

  }
  foreignObject.appendChild(div);
  svg_score.appendChild(foreignObject);

  //DYNAMIC HEIGHT

  //wait for browser to calculate text height
  requestAnimationFrame(() => {
    const height = div.getBoundingClientRect().height + 50;

    svg_score.setAttribute(
      "viewBox",
      `0 0 ${scoreViewBoxWidth} ${height}`
    );

    foreignObject.setAttribute(
      "height",
      height
    );

    svg_score.style.height = `${height}px`;
  });

  //add score SVG to score box, display score box
  score_box.appendChild(svg_score);

  //add chart SVG elements
  multi_line.appendChild(svg);

  //remove loader
  multi_line_loader.remove();

  //display chart
  document
    .getElementById(containerId)
    .appendChild(multi_line);

  //END MULTI LINE CHART
}

//wrapper for makeMultipleLineChart
function makeLineChart({
  //data we want to plot
  rows,

  //name of dataset
  name,

  //original dataset 
  //(originated from earliest possible origin point of call stack (ie: nested -> click select -> multi -> here))
  originalDatasetList,

  //container name we want to use to put actual chart into (TAKEN FROM BLOG PAGE)
  containerId,

  //container name we want to use to put interpretive score into (TAKEN FROM BLOG PAGE) 
  //UNDEFINED UNLESS SPECIFIED
  interpretationBoxId = undefined,

  //type of metric scorecard being made, undefined unless specified in call stack
  scorecardMode = undefined,

  //what time scale are we graphing over? days, months?
  timeOfInterest,

  //padding constant from left/right sides
  paddingLeft = 60,
  paddingRight = 60,

  //set step for chart according to scale of data
  yAxisStep,

  //set cutoff for truncated label counts on points
  pointLabelCutoffCount = 40,

  //enable minor X-axis gridlines
  enableMinorXGridlines,

  //set colors for elements
  gridLabelColor = "#e8e9de",

  lineColors = [
    "#FF595E",
    "#8AC926",
    "#FFCA3A",
    "#6A4C93",
    "#FF924C",
    "#00C2A8",
    "#F72585",
  ],
  passLineColorsAsStatic = false, //if set to true, the line colors will be index-paired with the datasetList 
  //(if datasetList is longer than lineColors list, lineColors will loop over)

  datasetListStepSizeReference = undefined, //not needed unless passLineColorsAsStatic is true

  importedDateRange = [
    new Date(1900, 0, 1),
    new Date(2099, 11, 31)
  ],

  pointColor = "#eafafa",
  gridColor = "#555",
  thick_gridColor = "#888",

  //set aspect ratio
  aspectRatio = 4,

  //set width and height via a viewbox (sets maximums, the rest is scaled according to platform size)
  viewBoxWidth = 1000,
  viewBoxHeight = viewBoxWidth / aspectRatio 
}) {

  return makeMultipleLineChart({

    datasetList: {
      [name]: rows
    },

    originalDatasetList,

    containerId,
    interpretationBoxId,
    scorecardMode,

    timeOfInterest,

    paddingLeft,
    paddingRight,

    yAxisStep,
    pointLabelCutoffCount,

    enableMinorXGridlines,

    gridLabelColor,

    lineColors,
    passLineColorsAsStatic,

    importedDateRange,

    pointColor,
    gridColor,
    thick_gridColor,

    aspectRatio,
    viewBoxWidth,
    viewBoxHeight
  });

}

function makeBarChart({
  //data we want to plot 
  rows, 

  //original dataset (no functionality yet, make multi-bar chart later or smth)
  //(originated from earliest possible origin point of call stack (ie: nested -> click select -> multi -> here))
  originalDatasetList,

  //name of chart container we want to use to put actual chart into (TAKEN FROM BLOG PAGE) 
  containerId, 

  //container name we want to use to put interpretive score into (TAKEN FROM BLOG PAGE) 
  //UNDEFINED UNLESS SPECIFIED
  interpretationBoxId = undefined,

  //type of metric scorecard being made, undefined unless specified in call stack 
  //(no functionality yet, incorporate scorecard in bar chart)
  scorecardMode = undefined,

  //what time scale are we graphing over? days, months? 
  timeOfInterest, 

  //set colors for elements 
  textColor = "#e8e9de", 
  barColor = "#4a90e2",

  width = 1000,
  height = 400,

  paddingTop = 25,
  paddingBottom = 150,
  paddingLeft = 5,
  paddingRight = 5,

  importedDateRange = [
    new Date(1900, 0, 1),
    new Date(2099, 11, 31)
  ]
}) {

  //create container for bar chart
  const container = document.createElement(containerId);

  const bar_chart_loader = document.createElement("div");
  bar_chart_loader.textContent = "Loading chart...";
  bar_chart_loader.style.display = "flex";
  bar_chart_loader.style.alignItems = "center";
  bar_chart_loader.style.justifyContent = "center";
  bar_chart_loader.style.height = "200px";
  bar_chart_loader.style.fontSize = "14px";
  bar_chart_loader.style.color = "#666";
  container.appendChild(bar_chart_loader); //<- Make the "chart" the loader for now

  document.getElementById(containerId).appendChild(container) //<- Display

  //filter out rows that are not in given date range (date range is set to 1900-2099 by default)
  rows = rows.filter(r => {
    let d;

    //for month
    if (timeOfInterest === "month") {
      const [year, month] = r.month.split("-").map(Number);
      d = new Date(year, month - 1, 1);

    //for date
    } else if (timeOfInterest === "date") {
      const [year, month, day] = r.date.split("-").map(Number);
      d = new Date(year, month - 1, day);
    }

    //if row date is within range, return the row as having passed filter

    return d >= importedDateRange[0] && d <= importedDateRange[1];
  });

  //get highest value of the dataset, made to scale bar chart
  const maxVal = Math.max(...rows.map(r => Number(r.count)));

  //set bar width relative to the number of bars
  const barWidth = (width - paddingLeft - paddingRight) / rows.length;

  //SVG creation

  //create svg element to which all items will be added
  const svg = document.createElementNS(
    "http://www.w3.org/2000/svg", 
    "svg"
  );

  //set svg scaling system according to function parameters
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.style.width = "100%";
  svg.style.height = "auto";

  //BARS

  //for each item in the dataset...
  rows.forEach((r, i) => {

    const value = Number(r.count);
    
    //set bar height relative to maximum
    const barHeight =
      ((value / maxVal) * (height - paddingTop - paddingBottom));

    //set length (x) and width (y) of each bar 
    const x = paddingLeft + i * barWidth;
    const y = height - paddingBottom - barHeight;

    //make rectangle svg element with bar attributes
    const rect = document.createElementNS(
      "http://www.w3.org/2000/svg", 
      "rect"
    );

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barWidth * 0.8);
    rect.setAttribute("height", barHeight);
    rect.setAttribute("fill", barColor);

    //TOOLTIPS

    const title = document.createElementNS(
      "http://www.w3.org/2000/svg", 
      "title"
    );

    //monthly date tooltips
    if (timeOfInterest === "month") {
      const [year, month] = r.month.split("-").map(Number);
      const d = new Date(year, month - 1, 1);
      title.textContent = `${d.toLocaleDateString("en-US", { month: "short" })} ${year}: ${value.toLocaleString()}`;
    }

    //daily date tooltips
    if (timeOfInterest === "date") {
      const [year, month, day] = r.date.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      title.textContent = `${d.toDateString()}: ${value.toLocaleString()}`;
    }

    //add hover tooltips to bars
    rect.appendChild(title);

    //add bar to svg
    svg.appendChild(rect);

    //TOP OF BAR LABELS

    //create svg element for top of bar labels
    const valueText = document.createElementNS(
      "http://www.w3.org/2000/svg", 
      "text"
    );

    //get string of count value
    valueText.textContent = value.toLocaleString();

    valueText.setAttribute("x", x + barWidth * 0.4);
    valueText.setAttribute("y", y + (barWidth * 0.19));
    valueText.setAttribute("text-anchor", "middle");
    valueText.setAttribute("fill", textColor);

    //set font size relative to font width and text length
    valueText.setAttribute("font-size", `${Math.min(70, 1.4 * barWidth / valueText.textContent.length)}`);
    //max size 70

    //added top of bar label to svg
    svg.appendChild(valueText);

    //X-LABEL

    //create svg element to x-label
    const labelText = document.createElementNS(
      "http://www.w3.org/2000/svg", 
      "text"
    );

    labelText.setAttribute("x", x + barWidth * 0.4);
    labelText.setAttribute("y", height - paddingBottom + Math.min((barWidth * 0.25), 56));
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("fill", textColor);
    labelText.setAttribute("font-size", `${Math.min(barWidth * 0.18, 40)}`);

    //monthly x-labels
    if (timeOfInterest === "month") {
      const [year, month] = r.month.split("-").map(Number);
      const d = new Date(year, month - 1, 1);
      labelText.textContent =
        d.toLocaleDateString("en-US", { month: "short" }) + " " + year;
    }

    //daily x-labels
    if (timeOfInterest === "date") {
      const [year, month, day] = r.date.split("-").map(Number);
      const d = new Date(year, month - 1, day);
      labelText.textContent =
        d.toLocaleDateString("en-US", { weekday: "short" }) +
        " " +
        r.date.slice(5, 10);
    }

    //add x-label to svg
    svg.appendChild(labelText);
  });

  //add svg elements to chart
  container.appendChild(svg);

  //GRAPH IS READY! kill loader
  bar_chart_loader.remove();

  document.getElementById(containerId).appendChild(container) //<- Display
}

//select datasets out of a list to graph on a line chart, user selects as text in a box
function typeSelectMultipleLineChart({
  datasetList, //list of actual datasets
  datasetListStepSizeReference, //reference containing dataset names and advised yAxisStep size

  //original dataset 
  //(originated from earliest possible origin point of call stack (ie: nested -> click select -> multi -> here))
  originalDatasetList,

  containerId, //chart container id

  //container name we want to use to put interpretive score into (TAKEN FROM BLOG PAGE) 
  //UNDEFINED UNLESS SPECIFIED
  interpretationBoxId = undefined,

  //type of metric scorecard being made, undefined unless specified in call stack
  scorecardMode = undefined,

  buttonId, //button id
  inputTextId, //input text id
  // ^^ taken from html-side of blogpost

  yAxisStepDefault = Math.max(
      ...Object.keys(datasetList)
        .map(name => datasetListStepSizeReference[name])
        .filter(Boolean)
  ),
  //default yAxisStep is the yAxisStep were all datasets present (max of the stepsizereferences)

  timeOfInterest = "month",
  aspectRatio = 1.5,

  lineColors = [
    "#FF595E",
    "#8AC926",
    "#FFCA3A",
    "#6A4C93",
    "#FF924C",
    "#00C2A8",
    "#F72585",
  ],
  passLineColorsAsStatic = true,

  importedDateRange = [
    new Date(1900, 0, 1),
    new Date(2099, 11, 31)
  ],

}) 

{
  let datasetText;

  //if input text is empty, revert to default (all modes)
  if (datasetText == undefined) {
    makeMultipleLineChart({
      datasetList: datasetList,
      originalDatasetList: originalDatasetList,
      containerId: containerId,
      interpretationBoxId: interpretationBoxId,
      scorecardMode: scorecardMode,
      yAxisStep: yAxisStepDefault,
      timeOfInterest: timeOfInterest,
      aspectRatio: aspectRatio
    });
  }

  //upon receiving a click of input function...
  document.getElementById(buttonId).onclick = function(){
    datasetText = document.getElementById(inputTextId).value;

    //if not empty text,
    if (datasetText != undefined) {

      //start new dataset list
      let inputNewDatasetList = {};

      //split input into multiple entries by spaces
      const inputs = datasetText
        .toLowerCase()
        .split(/\s+/);  // splits on spaces

      //check lowercase-ized versions of each entry and see if theyre in any of the datasets we have
      for (const [name, dataset] of Object.entries(datasetList)) {
        const cleanName = name.replace(" Ridership", "").toLowerCase();

        //if any are present, add to new dataset list
        if (
          inputs.some(word => cleanName.includes(word))
        ) {
          inputNewDatasetList[name] = dataset;
        }

        //remove old chart, prep for replacement with new one
        const container = document.getElementById(containerId);
        container.innerHTML = "";  // remove old chart

        //step size is determined by the maximum step size of the datasets we have present, 
        //checked with step_size_reference list
        const stepSize = Math.max(
        ...Object.keys(inputNewDatasetList)
          .map(name => datasetListStepSizeReference[name])
          .filter(Boolean)
        );

        //make chart with new dataset list and new stepsize, put back into the containerid we used
        makeMultipleLineChart({
          datasetList: inputNewDatasetList,
          originalDatasetList: originalDatasetList,
          containerId: containerId,
          interpretationBoxId: interpretationBoxId,
          scorecardMode: scorecardMode,
          yAxisStep: stepSize,
          timeOfInterest: timeOfInterest,
          aspectRatio: aspectRatio,
          lineColors: lineColors,
          passLineColorsAsStatic: passLineColorsAsStatic,
          datasetListStepSizeReference: datasetListStepSizeReference,
          importedDateRange: importedDateRange
        });
      }

    }
  } 

}

//establish listener callback operation set
//WeakMap keyed by the checkbox element itself (not its name) -- a plain object keyed by
//name breaks down once two different checkbox groups share a name, eg. "Systemwide" now
//exists in both the subway OTP grid and the bus speed grid. Keying by element sidesteps
//that collision entirely, and lets entries for removed checkboxes get garbage collected
//automatically instead of sitting around in a growing plain object forever.
const checkboxCallbacks = new WeakMap();

//select datasets out of a list to graph on a line chart, user selects as checked boxes
function clickSelectMultipleLineChart({
  datasetList, //list of actual datasets
  datasetListStepSizeReference, //reference containing dataset names and advised yAxisStep size

  //original dataset 
  //(originated from earliest possible origin point of call stack (ie: nested -> click select -> multi -> here))
  originalDatasetList,

  containerId, //chart container id
  //container name we want to use to put interpretive score into (TAKEN FROM BLOG PAGE) 
  //UNDEFINED UNLESS SPECIFIED
  interpretationBoxId = undefined,

  //type of metric scorecard being made, undefined unless specified in call stack
  scorecardMode = undefined,

  //render as searchable dropdown instead of flat grid, false unless specified otherwise
  useDropdown = false,    

  //button (HTML-side id) showing "N selected", opens/closes the panel, undefined unless specified otherwise
  dropdownToggleId = undefined, 

  //text input (HTML-side id) that filters rows by name, unded, undefined unless specified otherwise
  dropdownFilterId = undefined, 

  //container (HTML-side id) for the systemwide checkbox, rendered separately/to the side from the
  //per-line grid. undefined unless specified.
  //if undefined, or if this dataset has no "Systemwide" entry, nothing happens (systemwide button only appears IF EXISTS)
  systemwideContainerId = undefined,

  //button (HTML-side id) that clears every current checkbox selection for this chart.
  //undefined unless specified otherwise
  clearAllButtonId = undefined,

  checkBoxGroupId, //checkbox group id
  // ^^ taken from html-side of blogpost

  timeOfInterest = "month",
  aspectRatio = 1.5,

    lineColors = [
    "#FF595E",
    "#8AC926",
    "#FFCA3A",
    "#6A4C93",
    "#FF924C",
    "#00C2A8",
    "#F72585",
  ],
  passLineColorsAsStatic = true,
  
  importedDateRange = [
    new Date(1900, 0, 1),
    new Date(2099, 11, 31)
  ],

  //need to initialize before function begins to avoid wiping checked dataset selection on each date slider change
  checkedDatasets = {}, 

}) 

{
  //refresh render to run the graphing process again in the function as needed, either after date range or checkbox change
  function refreshRender() {

    if (useDropdown) {
      const toggleButton = document.getElementById(dropdownToggleId);
      const count = Object.keys(checkedDatasets).length;
      toggleButton.textContent = count > 0 ? `${count} selected ▾` : `Select routes ▾`;
    }

    if (Object.entries(checkedDatasets).length > 0) { //if we have received anything to plot, then remove the old plot and put in the new one

      //remove old chart, prep for replacement with new one
      const container = document.getElementById(containerId);
      container.innerHTML = "";  // remove old chart

      for (const [name, dataset] of Object.entries(datasetList)) {

        //step size is determined by the maximum step size of the datasets we have present, 
        //checked with step_size_reference list
        stepSize = Math.max(
        ...Object.keys(checkedDatasets)
          .map(name => datasetListStepSizeReference[name])
          .filter(Boolean)
        );
      }


      //make chart with new dataset list and new stepsize, put back into the containerid we used
      makeMultipleLineChart({
        datasetList: checkedDatasets,
        originalDatasetList: originalDatasetList,
        containerId: containerId,
        interpretationBoxId: interpretationBoxId,
        scorecardMode: scorecardMode,
        yAxisStep: stepSize,
        timeOfInterest: timeOfInterest,
        aspectRatio: aspectRatio,
        lineColors: lineColors,
        passLineColorsAsStatic: passLineColorsAsStatic,
        datasetListStepSizeReference: datasetListStepSizeReference,
        importedDateRange: importedDateRange
      });

    } else {
      //remove chart, no data
      const container = document.getElementById(containerId);
      container.innerHTML = ""; //remove old chart

      const interpretationbox = document.getElementById(interpretationBoxId);
      interpretationbox.innerHTML = ""; //remove old scorebox


      container.textContent = "Select a dataset to start the chart.";
    }
  }

  //get checkbox container from html side
  const checkboxContainer = document.getElementById(checkBoxGroupId);

  //set grid style for checkboxes, with set spacing, unless dropdown is used
  checkboxContainer.classList.remove("dropdown-panel", "open");
  checkboxContainer.removeAttribute("style"); // clear any leftover inline grid styling

  if (useDropdown) {
    checkboxContainer.classList.add("dropdown-panel"); //styling/collapse is in styles.css
  } else {
    checkboxContainer.style.display = "grid";
    checkboxContainer.style.gridTemplateColumns = "repeat(8, auto)";
    checkboxContainer.style.columnGap = "5px";
  }

  //get the systemwide container from html side, if one was supplied for this chart
  const systemwideContainer = systemwideContainerId
    ? document.getElementById(systemwideContainerId)
    : null;

  //for each item in the stepsize reference... (datasetlist is advisable as well, both are fine, just as long as indexing is consistent on both)
  
  //ONLY DO IF THE LIST OF CHECKED ITEMS IS EMPTY:
  if (checkboxContainer.children.length === 0) {

    //clear out any leftover systemwide checkbox from a previous build (eg. day-type switch)
    if (systemwideContainer) {
      systemwideContainer.innerHTML = "";
    }

    Object.keys(datasetListStepSizeReference).forEach((name, index) => {

      //Systemwide gets its own dedicated checkbox in the side container (built below)
      //skip it here so it doesn't also show up as a second, duplicate checkbox in the
      //main per-line grid.
      if (name === "Systemwide") return;

      //clear out any leftover systemwide checkbox from a previous build (eg. day-type switch)
      if (systemwideContainer) {
        systemwideContainer.innerHTML = "";
      }

      //create a checkbox, name is the same as that of element from datasetlist
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `dataset-${index}`;
      checkbox.name = name;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = " " + name;

      //add checkbox and label and linebreak to the checkbox container
      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);

    //   //line break every 7 items
    //   if ((index + 1) % 7 === 0) {
    //     checkboxContainer.appendChild(document.createElement("br"));
    //   } else {
    //     checkboxContainer.appendChild(document.createTextNode("\u00A0".repeat(10))); //u00A0 is space. repeat space char.
    //   }
    });

    //SYSTEMWIDE BUTTON (IF EXISTS): only built when both a container was supplied
    //AND this dataset actually has a "Systemwide" entry, ridership has neither, so it's skipped entirely
    if (systemwideContainer && originalDatasetList["Systemwide"] !== undefined) {
      const systemwideCheckbox = document.createElement("input");
      systemwideCheckbox.type = "checkbox";
      systemwideCheckbox.id = `${systemwideContainerId}-dataset`;
      systemwideCheckbox.name = "Systemwide";

      //default systemwide to ON for any fresh build of this chart (first load, or after
      //a day-type switch, which already wipes and rebuilds every checkbox from scratch) --
      //check the box AND seed it into checkedDatasets directly so refreshRender() (called
      //right after this block) picks it up on the very first render, no click required.
      systemwideCheckbox.checked = true;
      checkedDatasets["Systemwide"] = datasetList["Systemwide"];

      const systemwideLabel = document.createElement("label");
      systemwideLabel.htmlFor = systemwideCheckbox.id;
      systemwideLabel.textContent = " Systemwide";

      systemwideContainer.appendChild(systemwideCheckbox);
      systemwideContainer.appendChild(systemwideLabel);
      
    } else {

      //for datasets with no "Systemwide" entry (eg. ridership), default to checking
      //the first checkbox in the grid instead, so something renders without requiring
      //a click -- same idea as the systemwide default above, just falling back to
      //whichever dataset happens to be first.
      const firstCheckbox = checkboxContainer.querySelector("input[type='checkbox']");

      if (firstCheckbox) {
        firstCheckbox.checked = true;
        checkedDatasets[firstCheckbox.name] = datasetList[firstCheckbox.name];
      }    
    }

    if (useDropdown) {
      const toggleButton = document.getElementById(dropdownToggleId);
      const filterInput = document.getElementById(dropdownFilterId);

      //property-assignment, not addEventListener, reassigning just overwrites
      //the previous handler instead of stacking a new one on every rebuild
      toggleButton.onclick = () => checkboxContainer.classList.toggle("open");

      filterInput.oninput = () => {
        const query = filterInput.value.toLowerCase();
        checkboxContainer.querySelectorAll("label").forEach(label => {
          const match = label.textContent.toLowerCase().includes(query);
          label.style.display = match ? "" : "none";

          //not document.getElementById(label.htmlFor): ids collide across
          //checkbox groups (OTP/ridership/bus speeds all restart at "dataset-0"),
          //so a global lookup can hide the wrong chart's checkbox entirely.
          const checkbox = label.previousElementSibling;
          checkbox.style.display = match ? "" : "none";
        });
      };

      //guard this one specifically: it's a document-level listener, and this whole
      //block re-runs every time the day-type <select> wipes and rebuilds the panel
      //(see nestedTwoCategorySelectLineChart below), without the flag a new click listener is stacked
      //on document every single day-type switch.

      //checkboxContainer itself survives that wipe (only its children get cleared),
      //so a flag on the container persists across rebuilds correctly.
      if (!checkboxContainer.dataset.dropdownWired) {
        checkboxContainer.dataset.dropdownWired = "true";
        document.addEventListener("click", (event) => {
          if (!checkboxContainer.contains(event.target) && event.target !== toggleButton) {
            checkboxContainer.classList.remove("open");
          }
        });
      }
    }
  }

  //create list of checked datasets to keep track of with each click
  // let checkedDatasets = {}; //<- REMOVED TO PUT AT START OF FUNCTION

  //stepsize calculated before render, updated with each click
  let stepSize;

  //create chart container, set it to clicking prompt for now
  const container = document.getElementById(containerId);
  container.textContent = "Select a dataset to start the chart.";

  refreshRender();

  //selector covers the main grid, plus the separate systemwide container when one exists,
  //so the same checked/unchecked handling below applies to the systemwide box too
  const checkboxSelector = systemwideContainerId
    ? `#${checkBoxGroupId} input[type='checkbox'], #${systemwideContainerId} input[type='checkbox']`
    : `#${checkBoxGroupId} input[type='checkbox']`;

  document
  
    //give each checkbox in the checkbox set a listener for clicks
    //(checkboxSelector, not a hardcoded `#${checkBoxGroupId} ...`, so this also picks up
    //the systemwide checkbox sitting in its own side container, that's why it visually
    //toggled but never actually added/removed itself from the chart before.)

    .querySelectorAll(checkboxSelector)
     .forEach(checkbox => {

      //remove old listener if it exists -- keyed by the checkbox ELEMENT itself (real
      //WeakMap usage), not by checkbox.name. Bracket notation (checkboxCallbacks[name])
      //doesn't call the WeakMap's own get/set/has at all, it just sets a plain
      //string-keyed property directly on the WeakMap object, which silently defeats the
      //whole point: it can't tell the OTP grid's "Systemwide" checkbox apart from the bus
      //speed grid's "Systemwide" checkbox (same name, different elements), and it keeps
      //every past render's closures reachable forever since that object never gets cleared.
      if (checkboxCallbacks.has(checkbox)) {
        checkbox.removeEventListener(
          "change",
          checkboxCallbacks.get(checkbox)
        );
      }

      //set operations for listeners
      const checkboxCallback = () => {

        //DEBUG FOR MEMORY MANAGEMENT
        // console.count("checkbox change");

        //if a checkbox was clicked (in either direction)
        if (checkbox.checked) {

          //go to each name of the datasetlist to see which one has been clicked, 
          for (const [name, dataset] of Object.entries(datasetList)) {
            if (name == checkbox.name) {
              //add to checked datasets if it was added
              checkedDatasets[name] = dataset;
            }
          }
        }

        if (!(checkbox.checked)) {
          //remove if it was removed
          delete checkedDatasets[checkbox.name];
        }

        refreshRender();

      };

      //save reference, keyed by the element, once this checkbox is removed from the
      //DOM (eg. a day-type switch wipes and rebuilds the grid) and nothing else points to
      //it, this entry is eligible for garbage collection automatically. No name collisions,
      //no manual cleanup needed.
      checkboxCallbacks.set(checkbox, checkboxCallback);

      //add new listener
      checkbox.addEventListener("change", checkboxCallback);

    });

  //CLEAR ALL BUTTON (IF EXISTS): unchecks every box in this chart's checkboxes
  //(main grid + systemwide, if present) and empties the tracked selection
  if (clearAllButtonId) {
    const clearAllButton = document.getElementById(clearAllButtonId);

    //property assignment, not addEventListener, same reasoning as toggleButton.onclick
    //above: this whole function re-runs on every slider tick, so reassigning here just
    //overwrites the previous handler instead of stacking a new one each time
    clearAllButton.onclick = () => {

      document.querySelectorAll(checkboxSelector).forEach(checkbox => {
        checkbox.checked = false;
      });

      //empty out the tracked selection in place (keeps the same object reference,
      //which matters for persistence across slider moves, see checkedDatasets param)
      Object.keys(checkedDatasets).forEach(name => delete checkedDatasets[name]);

      refreshRender();
    };
  }
}

//NESTED SELECT

//tracks the currently-attached "change" listener for each day-type <select>, keyed by
//the element itself. nestedTwoCategorySelectLineChart runs again on every slider tick
//(whichChartsToUpdateOTP/BusSpeeds call it unconditionally), so without this guard a
//fresh "change" listener would stack on top of the last one every single tick:
//dragging the slider for a few seconds could leave dozens of duplicate listeners on
//the select, each one rebuilding the chart and rebinding every checkbox again the next
//time the day type is switched.
const daySelectCallbacks = new WeakMap();


function nestedTwoCategorySelectLineChart({
  datasetSuperList, //superlist is a list of lists (ie: superlist[value] = a list)

  datasetListStepSizeReference,

  //original super dataset list
  //(originated from earliest possible origin point of call stack (ie: nested -> click select -> multi -> here))
  originalSuperList,

  containerId,

  //container name we want to use to put interpretive score into (TAKEN FROM BLOG PAGE) 
  //UNDEFINED UNLESS SPECIFIED
  interpretationBoxId = undefined,

  //type of metric scorecard being made, undefined unless specified in call stack
  scorecardMode = undefined,

  //render as searchable dropdown instead of flat grid, false unless specified otherwise
  useDropdown = false,    

  //button showing "N selected", opens/closes the panel, undefined unless specified otherwise
  dropdownToggleId = undefined, 

  //text input that filters rows by name, unded, undefined unless specified otherwise
  dropdownFilterId = undefined, 

  //passed straight through to clickSelectMultipleLineChart
  systemwideContainerId = undefined,
  
  clearAllButtonId = undefined,

  checkboxSuperGroupId, //upper level, selector

  checkBoxSubGroupId, //lower level, checkboxes

  timeOfInterest,

  aspectRatio,

  lineColors,

  importedDateRange = [
    new Date(1900, 0, 1),
    new Date(2099, 11, 31)
  ],
  
  listCheckedDatasets = {}, 
  //set empty by default, will be passed through in the event of persistence of checked datasets

  persistenceOfCheckedDatasets = false 
  //set to false by default, true enables passthrough of checked datasets for slider purposes
}) {

  const select = document.getElementById(checkboxSuperGroupId); //get supergroup selector

  clickSelectMultipleLineChart({
    //initial display of checkbox options before user does anything 

    datasetList: datasetSuperList[select.value], //now the list is being taken from the superlist to plot
    originalDatasetList: originalSuperList[select.value], //same goes for original dataset, taken from originalsuperlist
    datasetListStepSizeReference: datasetListStepSizeReference,
    containerId: containerId,
    interpretationBoxId: interpretationBoxId,
    scorecardMode: scorecardMode,
    checkBoxGroupId: checkBoxSubGroupId, //subgroup of checkboxes is taken from reference as well
    timeOfInterest: timeOfInterest,
    aspectRatio: aspectRatio,
    lineColors: lineColors,
    importedDateRange: [importedDateRange[0], importedDateRange[1]],

    ...(persistenceOfCheckedDatasets && {
      checkedDatasets: listCheckedDatasets
    }), //if checkeddatasets is persisent, apply what we have to said parameter in clickselectmultiplelinechart

    useDropdown: useDropdown,
    dropdownToggleId: dropdownToggleId,
    dropdownFilterId: dropdownFilterId,

    systemwideContainerId: systemwideContainerId,
    clearAllButtonId: clearAllButtonId,

  });

  //remove this select's previous "change" listener (if any) before attaching a new one.
  //see the daySelectCallbacks comment above for why this guard is needed
  if (daySelectCallbacks.has(select)) {
    select.removeEventListener("change", daySelectCallbacks.get(select));
  }

  const handleDayTypeChange = function () {

      Object.keys(listCheckedDatasets).forEach(key => delete listCheckedDatasets[key]);
      //forget previous checkbox state when switching day type

      const container = document.getElementById(containerId);
      container.innerHTML = ""; //remove old chart

      const checkboxset = document.getElementById(checkBoxSubGroupId);
      checkboxset.innerHTML = ""; //remove old checkbox set

      //also clear the systemwide container, if this chart has one, so it gets rebuilt
      //fresh instead of leaving the previous day-type's systemwide checkbox in place
      if (systemwideContainerId) {
        const systemwideContainer = document.getElementById(systemwideContainerId);
        systemwideContainer.innerHTML = "";
      }

    clickSelectMultipleLineChart({
      datasetList: datasetSuperList[select.value], //now the list is being taken from the superlist to plot
      originalDatasetList: originalSuperList[select.value], //same goes for original dataset, taken from originalsuperlist
      datasetListStepSizeReference: datasetListStepSizeReference,
      containerId: containerId,
      interpretationBoxId: interpretationBoxId,
      scorecardMode: scorecardMode,
      checkBoxGroupId: checkBoxSubGroupId, //subgroup of checkboxes is taken from reference as well
      timeOfInterest: timeOfInterest,
      aspectRatio: aspectRatio,
      lineColors: lineColors,
      importedDateRange: [importedDateRange[0], importedDateRange[1]],

      ...(persistenceOfCheckedDatasets && {
        checkedDatasets: listCheckedDatasets
      }), //if checkeddatasets is persisent, apply what we have to said parameter in clickselectmultiplelinechart

      useDropdown: useDropdown,
      dropdownToggleId: dropdownToggleId,
      dropdownFilterId: dropdownFilterId,

      systemwideContainerId: systemwideContainerId,
      clearAllButtonId: clearAllButtonId,
    });
  };

    daySelectCallbacks.set(select, handleDayTypeChange);
    select.addEventListener("change", handleDayTypeChange);
}



//DATE SLIDERS

//MAKE MULTIPLE CHARTS UNDER A SLIDER. 
// WARNING: SLIDER DOES NOT MAKE CHARTS, CHART FUNCTION CALLS MUST BE PASSED VIA 
//          whichChartsToUpdate
function sliderMakerMultipleChart({

  //get id for fromSlider from input
  fromSliderId,

  //get id for toSlider from input
  toSliderId,

  //get id for from slider label from input
  fromLabelId,

  //get id for to slider label from input
  toLabelId,

  //get starting date of slider from input
  startDate,

  //get ending date of slider from input
  endDate,

  //get charts to track with this slider from input
  updateChartsFunction,
}) {

  //prelim functions
  function controlFromSlider(fromSlider, toSlider) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);

    if (from > to) {
      fromSlider.value = to;
    }
  }

  function controlToSlider(fromSlider, toSlider) {
    const [from, to] = getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
    setToggleAccessible(toSlider);

    if (from > to) {
      toSlider.value = from;
    }
  }

  function getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }

  function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
      const rangeDistance = to.max-to.min;
      const fromPosition = from.value - to.min;
      const toPosition = to.value - to.min;
      controlSlider.style.background = `linear-gradient(
        to right,
        ${sliderColor} 0%,
        ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
        ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
        ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
        ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
        ${sliderColor} 100%)`;
  }

  function setToggleAccessible(currentTarget) {
    const toSlider = document.querySelector(toSliderId);
    if (Number(currentTarget.value) <= 0 ) {
      toSlider.style.zIndex = 2;
    } else {
      toSlider.style.zIndex = 0;
    }
  }

  //get sliders and labels
  const fromSlider = document.querySelector(fromSliderId);
  const toSlider = document.querySelector(toSliderId);

  const fromLabel = document.querySelector(fromLabelId);
  const toLabel = document.querySelector(toLabelId);

  //set start month and end month to make labels list
  const start = startDate;
  const end = endDate;

  //calculate num of months
  const numOfMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

  //month labels list
  let monthLabels = [];


  //iterator
  const current = new Date(start);

  //loop
  for (let i = 0; i < numOfMonths + 1; i++) {
    monthLabels.push(`${current.getMonth() + 1}/1/${current.getFullYear()}`);
    current.setMonth(current.getMonth()+1);
  }

  //set max values to the amount of "ticks" (months) available
  fromSlider.max = numOfMonths;
  toSlider.max = numOfMonths;

  //default slider positions
  fromSlider.value = toSlider.max - 12;   // 1 year before last month
  toSlider.value = toSlider.max;          // last month

  //fill slider with content
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);

  //set initials: percentages and label positions, and chart
  let left_percent = fromSlider.value / fromSlider.max * 100;
  let right_percent = toSlider.value / toSlider.max * 100;


  fromLabel.textContent = monthLabels[fromSlider.value];
  let left_draw_pos = left_percent;
  fromLabel.style.left = `calc(${Math.min(left_draw_pos)}%)`;


  toLabel.textContent = monthLabels[toSlider.value];
  let right_draw_pos = right_percent;
  toLabel.style.left = `calc(${Math.max(right_draw_pos)}%)`;

  //UPDATE CHART(S)
  let newStartDate = new Date(monthLabels[fromSlider.value]);
  let newEndDate = new Date(monthLabels[toSlider.value]);

  // //send off event to let other functions know dates changed
  // document.dispatchEvent(new CustomEvent("dateRangeChanged", {
  //     detail: {
  //         newStartDate,
  //         newEndDate
  //     }
  // }));

  updateChartsFunction(newStartDate, newEndDate);

  //on click of left slider, update labels and position of slider button as needed. [TO-DO: CHART]
  fromSlider.oninput = function() { 

    //update button
    controlFromSlider(fromSlider, toSlider); 
    
    //update text with month of slider value
    fromLabel.textContent = monthLabels[fromSlider.value];
    
    //update percent value along slider
    left_percent = fromSlider.value / fromSlider.max * 100;

    //collision control to put text down
    if (left_percent > 80) {
      left_draw_pos = Math.min(left_draw_pos, 80);
    } else if ((Math.abs(right_percent - left_percent) <= 20) || (right_draw_pos <= 20)) {
      left_draw_pos = Math.min(left_percent, right_draw_pos - 20);
    } else {
      left_draw_pos = left_percent;
    }
    fromLabel.style.left = `calc(${left_draw_pos}%)`;

    //UPDATE CHART(S)
    newStartDate = new Date(monthLabels[fromSlider.value]);
    newEndDate = new Date(monthLabels[toSlider.value]);

    // //send off event to let other functions know dates changed
    // document.dispatchEvent(new CustomEvent("dateRangeChanged", {
    //     detail: {
    //         newStartDate,
    //         newEndDate
    //     }
    // }));

    updateChartsFunction(newStartDate, newEndDate);
  }

  //on click of right slider, update labels and position of slider button as needed. [TO-DO: CHART]
  toSlider.oninput = function() { 

    //update button
    controlToSlider(fromSlider, toSlider); 

    //update text with month of slider value
    toLabel.textContent = monthLabels[toSlider.value];

    //update percent value along slider
    right_percent = toSlider.value / toSlider.max * 100;

    //collision control to put text down
    if (right_percent < 20) {
      right_draw_pos = Math.max(right_draw_pos, 20);
    } else if ((Math.abs(right_percent - left_percent) <= 20) || (left_draw_pos >= 80)) {
      right_draw_pos = Math.max(left_draw_pos + 20, right_percent);
    } else {
      right_draw_pos = right_percent;
    }
    toLabel.style.left = `calc(${Math.max(right_draw_pos)}%)`;
    
    //UPDATE CHART(S)
    newStartDate = new Date(monthLabels[fromSlider.value]);
    newEndDate = new Date(monthLabels[toSlider.value]);

    // //send off event to let other functions know dates changed
    // document.dispatchEvent(new CustomEvent("dateRangeChanged", {
    //     detail: {
    //         newStartDate,
    //         newEndDate
    //     }
    // }));

    updateChartsFunction(newStartDate, newEndDate);

  }
}

//KEEP CHECKBOXES PERSISTENT THROUGH DATE SLIDING
const ridershipCheckedDatasets = {}; 
const OTPCheckedDatasets = {};
const busSpeedsCheckedDatasets = {};

function whichChartsToUpdateOTP(startDate, endDate) {

  //go through all charts which are to be updated, clear them before making new ones
  for (const oldContainerId of [
    "monthly_subway_otp_from_jan_2015_select_box_line_date_range",
  ]) {

    const container = document.getElementById(oldContainerId);
    container.innerHTML = "";  // remove old chart

  }

  //make new charts.
  nestedTwoCategorySelectLineChart({
    datasetSuperList: subwayOTPDatasets, //superlist is a list of lists (ie: superlist[value] = a list)
    datasetListStepSizeReference: monthly_subway_otp_rate_step_size_reference,

    originalSuperList: subwayOTPDatasets, //originalsuperlist keeps full unfiltered dataset handy down all levels
                                          //will be needed for scorecard making

    containerId: "monthly_subway_otp_from_jan_2015_select_box_line_date_range",
    
    interpretationBoxId: "monthly_subway_otp_from_jan_2015_select_box_line_date_range_interpretation",
    scorecardMode: "OTP",

    checkboxSuperGroupId: "subwayOTPDaySelect_date_range", //upper level, selector
    checkBoxSubGroupId: "subway-otp-checkboxes_date_range", //lower level, checkboxes

    //systemwide entry exists for OTP -- gets its own container to the side of the grid
    systemwideContainerId: "subway-otp-systemwide_date_range",
    clearAllButtonId: "subway-otp-clear-all_date_range",

    persistenceOfCheckedDatasets: true,
    listCheckedDatasets: OTPCheckedDatasets,

    timeOfInterest: "month",
    aspectRatio: 2,
    lineColors: [
      //1, 2, 3
      "#EE352E",
      "#EE352E",
      "#EE352E",

      //4, 5, 6
      "#00933C",
      "#00933C",
      "#00933C",

      //7
      "#B933AD",

      //S 42nd
      "#808183",

      //A, B, C, D, E, F
      "#0039A6",
      "#FF6319",
      "#0039A6",
      "#FF6319",
      "#0039A6",
      "#FF6319",

      //G
      "#75c84e",

      //J, Z
      "#996633",

      //L
      "#A7A9AC",

      //M
      "#FF6319",

      //N, Q, R
      "#FCCC0A",
      "#FCCC0A",
      "#FCCC0A",

      //S Franklin, S Rockaway,
      "#808183",
      "#808183",

      //systemwide
      "#00aaff"
    ],

    importedDateRange: [new Date(startDate),
                        new Date(endDate)]
  });
  
}

sliderMakerMultipleChart({
  fromSliderId: '#fromSlider',
  toSliderId: '#toSlider',
  fromLabelId: '#fromLabel',
  toLabelId: '#toLabel',
  startDate: new Date(2015, 0, 1), //Jan 2015
  endDate: new Date(2026, 4, 1), //May 2026 <<===>> REPLACE LATER WITH SOMETHING TO GET LATEST MONTH IN DATASET
  updateChartsFunction: (startDate, endDate) => {
    whichChartsToUpdateOTP(startDate, endDate);
  }
})


//////////////////////

function whichChartsToUpdateRidership(startDate, endDate) {

  //go through all charts which are to be updated, clear them before making new ones
  for (const oldContainerId of [
    "monthly_ridership_select_box_line_date_range",
  ]) {

    const container = document.getElementById(oldContainerId);
    container.innerHTML = "";  // remove old chart

  }

  //make new charts.
  clickSelectMultipleLineChart({
    datasetList: monthly_multimodal_total_rows,
    datasetListStepSizeReference: monthly_multimodal_step_size_reference,

    originalDatasetList: monthly_multimodal_total_rows, //originalsuperlist keeps full unfiltered dataset handy down all levels
                                          //will be needed for scorecard making

    containerId: "monthly_ridership_select_box_line_date_range",
    
    interpretationBoxId: "monthly_ridership_select_box_line_date_range_interpretation",
    scorecardMode: "Ridership",

    checkBoxGroupId: "subway-ridership-checkboxes_date_range", //lower level, checkboxes

    //no systemwideContainerId here ridership's dataset has no "Systemwide" entry,
    clearAllButtonId: "ridership-clear-all_date_range",

    persistenceOfCheckedDatasets: true,

    checkedDatasets: ridershipCheckedDatasets,

    timeOfInterest: "month",
    aspectRatio: 2,

    importedDateRange: [new Date(startDate),
                        new Date(endDate)]
  });
  
}

sliderMakerMultipleChart({
  fromSliderId: '#fromSlider_ridership',
  toSliderId: '#toSlider_ridership',
  fromLabelId: '#fromLabel_ridership',
  toLabelId: '#toLabel_ridership',
  startDate: new Date(2019, 0, 1), //Jan 2019
  endDate: new Date(2026, 5, 1), //May 2026 <<===>> REPLACE LATER WITH SOMETHING TO GET LATEST MONTH IN DATASET
  updateChartsFunction: (startDate, endDate) => {
    whichChartsToUpdateRidership(startDate, endDate);
  }
})

function whichChartsToUpdateBusSpeeds(startDate, endDate) {

  //go through all charts which are to be updated, clear them before making new ones
  for (const oldContainerId of [
    "monthly_bus_speeds_from_jan_2015_select_box_line_date_range",
  ]) {

    const container = document.getElementById(oldContainerId);
    container.innerHTML = "";  // remove old chart

  }

  //make new charts.
  nestedTwoCategorySelectLineChart({
    datasetSuperList: busSpeedsDatasets, //superlist is a list of lists (ie: superlist[value] = a list)
    datasetListStepSizeReference: monthly_bus_speeds_step_size_reference,

    originalSuperList: busSpeedsDatasets, //originalsuperlist keeps full unfiltered dataset handy down all levels
                                          //will be needed for scorecard making

    containerId: "monthly_bus_speeds_from_jan_2015_select_box_line_date_range",
    
    interpretationBoxId: "monthly_bus_speeds_from_jan_2015_select_box_line_date_range_interpretation",
    scorecardMode: "Speed",

    checkboxSuperGroupId: "busSpeedDaySelect_date_range", //upper level, selector
    checkBoxSubGroupId: "bus_speed_checkboxes_date_range", //lower level, checkboxes

    persistenceOfCheckedDatasets: true,
    listCheckedDatasets: busSpeedsCheckedDatasets,

    useDropdown: true,
    dropdownToggleId: "bus_speed_dropdown_toggle_date_range",
    dropdownFilterId: "bus_speed_route_filter_date_range",

    //systemwide entry exists for bus speeds -- gets its own container to the side of the grid
    systemwideContainerId: "bus-speed-systemwide_date_range",
    clearAllButtonId: "bus-speed-clear-all_date_range",


    timeOfInterest: "month",
    aspectRatio: 2,

    lineColors: [
      "#990000",
      "#E81416",
      "#FF2D00",
      "#FF4500",
      "#FF6600",
      "#FF7F00",
      "#FFA500",
      "#FFC000",
      "#79C314",
      "#008000",
      "#00A86B",
      "#008080",
      "#487DE7",
      "#0000FF",
      "#002FA7",
      "#000080",
      "#4B369D",
      "#70369D",
      "#8B00FF",
      "#BA55D3",
      "#DA70D6",
    ],

    importedDateRange: [new Date(startDate),
                        new Date(endDate)]
  });
  
}

sliderMakerMultipleChart({
  fromSliderId: '#fromSlider_bus_speed',
  toSliderId: '#toSlider_bus_speed',
  fromLabelId: '#fromLabel_bus_speed',
  toLabelId: '#toLabel_bus_speed',
  startDate: new Date(2015, 0, 1), //Jan 2015
  endDate: new Date(2026, 5, 1), //Jun 2026 <<===>> REPLACE LATER WITH SOMETHING TO GET LATEST MONTH IN DATASET
  updateChartsFunction: (startDate, endDate) => {
    whichChartsToUpdateBusSpeeds(startDate, endDate);
  }
})

//RE-ENABLE SITE VISIBILITY
document.getElementById("report-card-content").style.visibility = "visible";
loading.remove();