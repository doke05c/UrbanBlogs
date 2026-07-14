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


//GET MONTHLY WEEKDAY SUBWAY OTP RATES SINCE JAN 2015

//list of subway lines:
let subway_line_list =
[
  "1", "2", "3", "4", "5", "6", "7",
  "S 42nd", "GS", "A", "B", "C", "D", "E", "F", "G", "J",
  "JZ", "L", "M", "N", "Q", "R", "S Fkln", "FS", "S Rock", "H"
]

const monthly_weekday_subway_otp_rate_from_jan_2015_rows = {};

for (const subway_line of subway_line_list) {
monthly_weekday_subway_otp_rate_from_jan_2015_rows[subway_line] =
  (await fetch(`/src/json/monthly_weekday_subway_otp_rate_from_jan_2015_${subway_line}.json`)
    .then(res => res.json()))
      .map(entry => ({
        month: entry.month,
        on_time_trips: entry.num_on_time_trips,
        sched_trips: entry.num_sched_trips,
        count: entry.otp_rate * 100
      })
      );
}

//GET MONTHLY WEEKEND SUBWAY OTP RATES SINCE JAN 2015

const monthly_weekend_subway_otp_rate_from_jan_2015_rows = {};

for (const subway_line of subway_line_list) {
monthly_weekend_subway_otp_rate_from_jan_2015_rows[subway_line] =
  (await fetch(`/src/json/monthly_weekend_subway_otp_rate_from_jan_2015_${subway_line}.json`)
    .then(res => res.json()))
      .map(entry => ({
        month: entry.month,
        on_time_trips: entry.num_on_time_trips,
        sched_trips: entry.num_sched_trips,
        count: entry.otp_rate * 100
      })
      );
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


//SCORE: 
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
  
  //what time period are we using to evaluate?
  importedDateRange
}) {

  if (mode == "OTP") {
  //GRADE SCALE:
  //SCORE = (CURRENT OTP^2) / (2019 OTP)
  let result_statement = "";

    //create "empty" ver of datasetlist comprising of just name. (ie: F: [])
    const datasetOTPScoreList = Object.fromEntries(
        Object.keys(datasetList).map(name => [name, [[], [], []]])
    );

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
      
      let average2019; //to be 2019 average OTP per line

      if (importedDateRange[1] >= oneYearLater) { //if the date range is a year or longer... compare to 2019 in full
        
        //do the same for the line in 2019
        average2019 =
            monthly_overall_subway_otp_rate_from_jan_2015_rows[name] //<<<<=== TO BE CHANGED TO ADAPT TO DAY-OF-WEEK CHOICE
                .filter(entry =>
                    entry.count !== 0 &&
                    entry.month.startsWith("2019-")
                )
                .reduce((sum, entry) => sum + entry.count, 0) //take the sum of all valid values in 2019 (non-zero)
            /
            monthly_overall_subway_otp_rate_from_jan_2015_rows[name] //<<<<== TO BE CHANGED TO ADAPT TO DAY-OF-WEEK CHOICE
                .filter(entry =>
                    entry.count !== 0 &&
                    entry.month.startsWith("2019-")
                ).length;                                   //divide by the count of all valid values in 2019 (non-zero)

      } else if (importedDateRange[1] < oneYearLater) {
        //compare partial year, to be calculated
        //method: 
          // [jan 2020 - may 2020 to jan 2019 - may 2019]
          // [nov 2020 - feb 2021 to nov 2018 - feb 2019]

        const comparisonEnd = new Date(importedDateRange[1]);
        comparisonEnd.setFullYear(2019);

        const comparisonStart = new Date(importedDateRange[0]);

        //preserve the same duration backwards from comparisonEnd
        comparisonStart.setFullYear(
            comparisonEnd.getFullYear() - 
            (importedDateRange[1].getFullYear() - importedDateRange[0].getFullYear())
        );

        //do the same for the line in 2019
        average2019 =
          monthly_overall_subway_otp_rate_from_jan_2015_rows[name] //<<<<----- TO BE CHANGED TO ADAPT TO DAY-OF-WEEK CHOICE
            .filter(entry => {
                const month = new Date(entry.month);
                return (
                    entry.count !== 0 &&
                    month >= (comparisonStart - 18000001) &&
                    month <= comparisonEnd
                );
            })
            .reduce((sum, entry) => sum + entry.count, 0)  //take the sum of all valid values in 2019 (non-zero)
        /
          monthly_overall_subway_otp_rate_from_jan_2015_rows[name] //<<<<----- TO BE CHANGED TO ADAPT TO DAY-OF-WEEK CHOICE
            .filter(entry => {
                const month = new Date(entry.month);
                return (
                    entry.count !== 0 &&
                    month >= (comparisonStart - 18000001) &&
                    month <= comparisonEnd
                );
            })
            .length;                                     //divide by the count of all valid values in 2019 (non-zero)
      }

      //ratio of average OTP during the selected date range to average OTP in 2019
      const OTPGrade = averageCurrent * averageCurrent / average2019;
      
      //update the dataset's OTP score with the OTP, calculated rel over 2019, and final grade
      datasetOTPScoreList[name] = [averageCurrent, ((averageCurrent-average2019)/averageCurrent*100), OTPGrade];
      
    }

    for (const [name, scores] of Object.entries(datasetOTPScoreList)) {

      //keyword for changes
      const changeWord =
      scores[1] >= 0.05 ? "a relative improvement" :
      scores[1] <= -0.05 ? "a relative decline" :
      "an unchanged difference";

      //number to letter grade conversion
      function getReferenceLetter(score) {
        if (score >= 97) return "A+";
        if (score >= 93) return "A";
        if (score >= 90) return "A-";
        if (score >= 87) return "B+";
        if (score >= 83) return "B";
        if (score >= 80) return "B-";
        if (score >= 77) return "C+";
        if (score >= 73) return "C";
        if (score >= 70) return "C-";
        if (score >= 67) return "D+";
        if (score >= 63) return "D";
        if (score >= 60) return "D-";
        return "F";
      }

      //display name beautifier for weird lines
      const displayName =
        name === "S Rock" ? "Rockaway Park Shuttle" :
        name === "S 42nd" ? "42nd St. Shuttle" :
        name === "S Fkln" ? "Franklin Ave. Shuttle" :
        name === "JZ" ? "J/Z" :
        name;

      
      result_statement += 
        `Between ${importedDateRange[0].toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
        })} and ${importedDateRange[1].toLocaleDateString("en-US", {
            month: "short",
            year: "numeric"
        })}, the ${displayName} train had an OTP of ${
            Math.round(scores[0] * 10) / 10
        }%, ${changeWord} of ${
            Math.round(Math.abs(scores[1]) * 10) / 10
        }% over 2019, giving it an ultimate score of ${
            Math.round(scores[2] * 10) / 10
        }%, or a ${getReferenceLetter(scores[2])}.
`
      ; 

    }
    return result_statement;

  }



}

//plot multiple lines in one chart. helper for makeLineChart (input single dataset as parameter)
function makeMultipleLineChart ({

  //data we want to plot, list of datasets, to be unpacked in the function
  datasetList,

  //container name we want to use to put actual chart into (TAKEN FROM BLOG PAGE)
  containerId,

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
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

  text.setAttribute("x", viewBoxWidth / 2);
  text.setAttribute("y", currentLegendY + 30);
  text.setAttribute("font-size", 18);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", pointColor);
  

  //CALL FUNCTION TO GET OTP RESULT TEXT !!!!! <====> [CHANGE IN FUNCTION PARAM LATER]
  const result = createScoreForMultipleLineChart({
    mode: "OTP",
    datasetList: datasetList,
    importedDateRange: importedDateRange
  });

  //split lines apart for SVG compatibility (use tspan)
  const lines = result.split("\n");

  lines.forEach((line, i) => {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

    tspan.setAttribute("x", viewBoxWidth / 2);
    tspan.setAttribute("dy", i === 0 ? 0 : 20);
    tspan.textContent = line;

    text.appendChild(tspan);
  });

  svg.appendChild(text);

  //add OTP scores to svg
  svg.appendChild(text);


  //add svg elements to chart
  multi_line.appendChild(svg);

  //GRAPH IS READY! kill loader
  multi_line_loader.remove();

  document.getElementById(containerId).appendChild(multi_line) //<- Display

  //END MULTI LINE CHART
}

//wrapper for makeMultipleLineChart
function makeLineChart({
  //data we want to plot
  rows,

  //name of dataset
  name,

  //container name we want to use to put actual chart into (TAKEN FROM BLOG PAGE)
  containerId,

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

    containerId,
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

  //name of chart container we want to use to put actual chart into (TAKEN FROM BLOG PAGE) 
  containerId, 

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

  containerId, //chart container id
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
      containerId: containerId,
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
          containerId: containerId,
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
const checkboxCallbacks = {};

//select datasets out of a list to graph on a line chart, user selects as checked boxes
function clickSelectMultipleLineChart({
  datasetList, //list of actual datasets
  datasetListStepSizeReference, //reference containing dataset names and advised yAxisStep size

  containerId, //chart container id
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
        containerId: containerId,
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

      container.textContent = "Select a dataset to start the chart.";
    }
  }

  //get checkbox container from html side
  const checkboxContainer = document.getElementById(checkBoxGroupId);

  //set grid style for checkboxes, with set spacing
  checkboxContainer.style.display = "grid";
  checkboxContainer.style.gridTemplateColumns = "repeat(8, auto)";
  checkboxContainer.style.columnGap = "5px";

  //for each item in the stepsize reference... (datasetlist is advisable as well, both are fine, just as long as indexing is consistent on both)
  
  //ONLY DO IF THE LIST OF CHECKED ITEMS IS EMPTY:
  if (checkboxContainer.children.length === 0) {
    Object.keys(datasetListStepSizeReference).forEach((name, index) => {

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
  }

  //create list of checked datasets to keep track of with each click
  // let checkedDatasets = {}; //<- REMOVED TO PUT AT START OF FUNCTION

  //stepsize calculated before render, updated with each click
  let stepSize;

  //create chart container, set it to clicking prompt for now
  const container = document.getElementById(containerId);
  container.textContent = "Select a dataset to start the chart.";

  refreshRender();

  document
    //give each checkbox in the checkbox set a listener for clicks
    .querySelectorAll(`#${checkBoxGroupId} input[type='checkbox']`)
    .forEach(checkbox => {

      //remove old listener if it exists
      if (checkboxCallbacks[checkbox.name]) {
        checkbox.removeEventListener(
          "change",
          checkboxCallbacks[checkbox.name]
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

      //save reference
      checkboxCallbacks[checkbox.name] = checkboxCallback;

      //add new listener
      checkbox.addEventListener("change", checkboxCallback);

    });
}

//NESTED SELECT
function nestedTwoCategorySelectLineChart({
  datasetSuperList, //superlist is a list of lists (ie: superlist[value] = a list)

  datasetListStepSizeReference,

  containerId,

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
    datasetListStepSizeReference: datasetListStepSizeReference,
    containerId: containerId,
    checkBoxGroupId: checkBoxSubGroupId, //subgroup of checkboxes is taken from reference as well
    timeOfInterest: timeOfInterest,
    aspectRatio: aspectRatio,
    lineColors: lineColors,
    importedDateRange: [importedDateRange[0], importedDateRange[1]],

    ...(persistenceOfCheckedDatasets && {
      checkedDatasets: listCheckedDatasets
    }) //if checkeddatasets is persisent, apply what we have to said parameter in clickselectmultiplelinechart
  });

  select.addEventListener("change", function () {

      Object.keys(listCheckedDatasets).forEach(key => delete listCheckedDatasets[key]);
      //forget previous checkbox state when switching day type

      const container = document.getElementById(containerId);
      container.innerHTML = ""; //remove old chart

      const checkboxset = document.getElementById(checkBoxSubGroupId);
      checkboxset.innerHTML = ""; //remove old checkbox set

    clickSelectMultipleLineChart({
      datasetList: datasetSuperList[select.value], //now the list is being taken from the superlist to plot
      datasetListStepSizeReference: datasetListStepSizeReference,
      containerId: containerId,
      checkBoxGroupId: checkBoxSubGroupId, //subgroup of checkboxes is taken from reference as well
      timeOfInterest: timeOfInterest,
      aspectRatio: aspectRatio,
      lineColors: lineColors,
      importedDateRange: [importedDateRange[0], importedDateRange[1]],

      ...(persistenceOfCheckedDatasets && {
        checkedDatasets: listCheckedDatasets
      }) //if checkeddatasets is persisent, apply what we have to said parameter in clickselectmultiplelinechart
    });
  });
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

function whichChartsToUpdate(startDate, endDate) {

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

    containerId: "monthly_subway_otp_from_jan_2015_select_box_line_date_range",
    checkboxSuperGroupId: "subwayOTPDaySelect_date_range", //upper level, selector
    checkBoxSubGroupId: "subway-otp-checkboxes_date_range", //lower level, checkboxes

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
  
  //DEBUG FOR MEMORY MANAGEMENT
  // console.count("clickSelectMultipleLineChart");
}

sliderMakerMultipleChart({
  fromSliderId: '#fromSlider',
  toSliderId: '#toSlider',
  fromLabelId: '#fromLabel',
  toLabelId: '#toLabel',
  startDate: new Date(2015, 0, 1), //Jan 2015
  endDate: new Date(2026, 4, 1), //May 2026
  updateChartsFunction: (startDate, endDate) => {
    whichChartsToUpdate(startDate, endDate);
  }
})



//RE-ENABLE SITE VISIBILITY
document.getElementById("report-card-content").style.visibility = "visible";
loading.remove();