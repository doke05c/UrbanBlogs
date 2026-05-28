//*START LAST7D_CBD CHART

// LOADER COMES FIRST: LET USER WAIT

const past_week_entries_chart = document.createElement('past_week_entries_chart'); //<- Chart for past entries to CBD

const past_week_entries_loader = document.createElement("div");
past_week_entries_loader.textContent = "Loading chart...";
past_week_entries_loader.style.display = "flex";
past_week_entries_loader.style.alignItems = "center";
past_week_entries_loader.style.justifyContent = "center";
past_week_entries_loader.style.height = "200px";
past_week_entries_loader.style.fontSize = "14px";
past_week_entries_loader.style.color = "#666";
past_week_entries_chart.appendChild(past_week_entries_loader); //<- Make the "chart" the loader for now

document.getElementById('past_week_entries_chart').appendChild(past_week_entries_chart) //<- Display


//number of most recent days in the chart
const date_count = 7;

//GET LAST 7 DAYS OF CRZ ENTRIES
const past_week_entries_rows = await fetch("/src/json/last_7_days_cbd.json")
    .then(res => res.json());

//SET CONTAINER GEOMETRY
const past_week_entries_max = Math.max(...past_week_entries_rows.map(r => Number(r.count))); //<- set highest value in chart
const past_week_entries_wrapper = document.createElement("div");
past_week_entries_wrapper.style.display = "flex";
past_week_entries_wrapper.style.alignItems = "flex-end";
past_week_entries_wrapper.style.gap = "8px";
past_week_entries_wrapper.style.height = "200px";
past_week_entries_wrapper.style.width = "100%";

//FOR EACH DAY...
past_week_entries_rows.forEach(r => {
  const d = new Date(r.date); //<- create "Date" object for the day of week

  const bar = document.createElement("div");//<- make bar

  const height = (Number(r.count) / past_week_entries_max) * 100;//<- set bar height ratio to max

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
  past_week_entries_wrapper.appendChild(bar);
});

//GRAPH IS READY! kill loader
past_week_entries_loader.remove();

//add container to chart item, ship it off to main blog file
past_week_entries_chart.appendChild(past_week_entries_wrapper);

document.getElementById('past_week_entries_chart').appendChild(past_week_entries_chart) //<- Display

//*END LAST7D_CBD CHART

//*START MONTHLY_CBD_FROM_2025 CHART

// LOADER COMES FIRST: LET USER WAIT

const monthly_entries_chart_from_2025 = document.createElement('monthly_entries_chart_from_2025'); //<- Chart for past entries to CBD

const monthly_entries_chart_from_2025_loader = document.createElement("div");
monthly_entries_chart_from_2025_loader.textContent = "Loading chart...";
monthly_entries_chart_from_2025_loader.style.display = "flex";
monthly_entries_chart_from_2025_loader.style.alignItems = "center";
monthly_entries_chart_from_2025_loader.style.justifyContent = "center";
monthly_entries_chart_from_2025_loader.style.height = "200px";
monthly_entries_chart_from_2025_loader.style.fontSize = "14px";
monthly_entries_chart_from_2025_loader.style.color = "#666";
monthly_entries_chart_from_2025.appendChild(monthly_entries_chart_from_2025_loader); //<- Make the "chart" the loader for now

document.getElementById('monthly_entries_chart_from_2025').appendChild(monthly_entries_chart_from_2025) //<- Display


//number of months in the chart

//get the date as of 2w ago, the endpoint of the dataset on most days
const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

//get start date to calculate number of months in time period since jan '24
const start = new Date(2025, 0, 1); // Jan = 0

const full_month_count =
    (twoWeeksAgo.getFullYear() - start.getFullYear()) * 12 +
    (twoWeeksAgo.getMonth() - start.getMonth());

// console.log(full_month_count);

//GET MONTHLY CRZ ENTRIES SINCE 2025
const monthly_entries_chart_from_2025_rows = await fetch("/src/json/monthly_cbd.json")
    .then(res => res.json());
  
console.log(monthly_entries_chart_from_2025_rows)

//SET CONTAINER GEOMETRY
const monthly_entries_chart_from_2025_max = Math.max(...monthly_entries_chart_from_2025_rows.map(r => Number(r.count))); //<- set highest value in chart
const monthly_entries_chart_from_2025_wrapper = document.createElement("div");
monthly_entries_chart_from_2025_wrapper.style.display = "flex";
monthly_entries_chart_from_2025_wrapper.style.alignItems = "flex-end";
monthly_entries_chart_from_2025_wrapper.style.gap = "8px";
monthly_entries_chart_from_2025_wrapper.style.height = "200px";
monthly_entries_chart_from_2025_wrapper.style.width = "100%";

//FOR EACH DAY...
monthly_entries_chart_from_2025_rows.forEach(r => {

  const [year, month] = r.month.split('-').map(Number);
  const d = new Date(year, month - 1, 1); //<- create "Date" object for the month

  const bar = document.createElement("div");//<- make bar

  const height = (Number(r.count) / monthly_entries_chart_from_2025_max) * 100;//<- set bar height ratio to max

  //SET BAR GEOMETRY
  bar.style.height = `${height}%`;
  bar.style.flex = "1 1 0";
  bar.style.background = "#4a90e2";
  bar.style.display = "flex";
  bar.style.flexDirection = "column";       
  bar.style.justifyContent = "space-between";
  bar.style.alignItems = "center";        
  bar.style.color = "white";
  bar.style.fontSize = `${168 / full_month_count}px`;
  bar.style.minWidth = "0";

  bar.title = `${d.toLocaleDateString('en-US', { month: 'long' })+ " " + r.month.slice(0,4)}: ${r.count}`; //<- "Title" will appear on hover:
                                                                            // mm-dd-yyyy: count

  const count_label = document.createElement("div"); //<- make count label, top of bar
  count_label.textContent = r.count;

  const date_label = document.createElement("div"); //<0 make date label, bottom of bar

  date_label.textContent =   
    d.toLocaleDateString('en-US', { month: 'short' }) + " " + r.month.slice(0,4); //<- set date label, just mm-dd and DOW

  //SET LABEL STYLE
  date_label.style.fontSize = `${140 / full_month_count}px`;
  date_label.style.marginBottom = `${-280 / full_month_count}px`;
  date_label.style.whiteSpace = "nowrap";

  //add labels to bar
  bar.appendChild(count_label);
  bar.appendChild(date_label);

  //add bar to container
  monthly_entries_chart_from_2025_wrapper.appendChild(bar);
});

//GRAPH IS READY! kill loader
monthly_entries_chart_from_2025_loader.remove();

//add container to chart item, ship it off to main blog file
monthly_entries_chart_from_2025.appendChild(monthly_entries_chart_from_2025_wrapper);

document.getElementById('monthly_entries_chart_from_2025').appendChild(monthly_entries_chart_from_2025) //<- Display

//*END MONTHLY_CBD_FROM_2025 CHART
