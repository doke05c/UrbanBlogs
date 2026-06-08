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

//*START MONTHLY_CBD_FROM_2025 CHART (LINE AND GRAPH)

//prelim info on how many months to get, and the dataset fetch itself before either graph or line chart is made

//number of months in the chart

//get the date as of 2w ago, the endpoint of the dataset on most days
const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

//get start date to calculate number of months in time period since jan '25
const start = new Date(2025, 0, 1); // Jan = 0

const full_month_count =
    (twoWeeksAgo.getFullYear() - start.getFullYear()) * 12 +
    (twoWeeksAgo.getMonth() - start.getMonth());

//GET MONTHLY CRZ ENTRIES SINCE 2025
const monthly_entries_chart_from_2025_rows = await fetch("/src/json/monthly_cbd.json")
    .then(res => res.json());

const monthly_entries_chart_from_2025_max = Math.max(...monthly_entries_chart_from_2025_rows.map(r => Number(r.count))); //<- set highest value in chart
  
// console.log(monthly_entries_chart_from_2025_rows)

//START BAR CHART

// LOADER COMES FIRST: LET USER WAIT

const monthly_entries_chart_from_2025 = document.createElement('monthly_entries_chart_from_2025'); //<- Chart for monthly entries to CBD

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


//SET CONTAINER GEOMETRY
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
  bar.style.fontSize = `${126 / full_month_count}px`;
  bar.style.minWidth = "0";

  bar.title = `${d.toLocaleDateString('en-US', { month: 'long' })+ " " + r.month.slice(0,4)}: ${r.count}`; //<- "Title" will appear on hover:
                                                                            // month, year: count

  const count_label = document.createElement("div"); //<- make count label, top of bar
  count_label.textContent = r.count;

  const date_label = document.createElement("div"); //<- make date label, bottom of bar

  date_label.textContent =   
    d.toLocaleDateString('en-US', { month: 'short' }) + " " + r.month.slice(0,4); //<- set date label, just mo year 

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

//END BAR CHART

//START LINE CHART

const monthly_entries_chart_from_2025_line = document.createElement('monthly_entries_chart_from_2025_line'); //<- Chart for monthly entries to CBD

const monthly_entries_chart_from_2025_line_loader = document.createElement("div");
monthly_entries_chart_from_2025_line_loader.textContent = "Loading chart...";
monthly_entries_chart_from_2025_line_loader.style.display = "flex";
monthly_entries_chart_from_2025_line_loader.style.alignItems = "center";
monthly_entries_chart_from_2025_line_loader.style.justifyContent = "center";
monthly_entries_chart_from_2025_line_loader.style.height = "200px";
monthly_entries_chart_from_2025_line_loader.style.fontSize = "14px";
monthly_entries_chart_from_2025_line_loader.style.color = "#666";
monthly_entries_chart_from_2025_line.appendChild(monthly_entries_chart_from_2025_line_loader); //<- Make the "chart" the loader for now

document.getElementById('monthly_entries_chart_from_2025_line').appendChild(monthly_entries_chart_from_2025_line) //<- Display

//use svg to set line chart size attributes
const monthly_entries_chart_from_2025_line_svg = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "svg"
);

//allow overflow
monthly_entries_chart_from_2025_line_svg.style.overflow = "visible";

//set width and height via a viewbox (sets maximums, the rest is scaled according to platform size)
const monthly_entries_chart_from_2025_line_viewBoxWidth = 1000;
const monthly_entries_chart_from_2025_line_viewBoxHeight = 250;

monthly_entries_chart_from_2025_line_svg.setAttribute(
  "viewBox",
  `0 0 ${monthly_entries_chart_from_2025_line_viewBoxWidth} ${monthly_entries_chart_from_2025_line_viewBoxHeight}`
);

//make aspect ratio to ensure device scalability
monthly_entries_chart_from_2025_line_svg.style.width = "100%";
monthly_entries_chart_from_2025_line_svg.style.height = "auto";
monthly_entries_chart_from_2025_line_svg.style.aspectRatio = "4 / 1";


//set points on line chart (time, value : x, y)
const monthly_entries_chart_from_2025_line_coords = monthly_entries_chart_from_2025_rows.map((r, i) => ({
  x: i * (monthly_entries_chart_from_2025_line_viewBoxWidth / (monthly_entries_chart_from_2025_rows.length - 1)),
  y: monthly_entries_chart_from_2025_line_viewBoxHeight - (Number(r.count) / monthly_entries_chart_from_2025_max) * monthly_entries_chart_from_2025_line_viewBoxHeight,
  value: r.count
}));

const monthly_entries_chart_from_2025_line_polyline = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "polyline"
);

//set lines connecting points
monthly_entries_chart_from_2025_line_polyline.setAttribute(
  "points",
  monthly_entries_chart_from_2025_line_coords.map(p => `${p.x},${p.y}`).join(" ")
);

monthly_entries_chart_from_2025_line_polyline.setAttribute("fill", "none");
monthly_entries_chart_from_2025_line_polyline.setAttribute("stroke", "#e8e9de");
monthly_entries_chart_from_2025_line_polyline.setAttribute("stroke-width", "2.5");

// monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_polyline); //MOVED TO END TO GO OVER GRID

//SET AXES

//Y AXIS
const monthly_entries_chart_from_2025_line_yAxis = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "line"
);

monthly_entries_chart_from_2025_line_yAxis.setAttribute("x1", 0);
monthly_entries_chart_from_2025_line_yAxis.setAttribute("y1", 0);

monthly_entries_chart_from_2025_line_yAxis.setAttribute("x2", 0);
monthly_entries_chart_from_2025_line_yAxis.setAttribute("y2", monthly_entries_chart_from_2025_line_viewBoxHeight);

monthly_entries_chart_from_2025_line_yAxis.setAttribute("stroke", "#  ");

monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_yAxis);

//X AXIS
const monthly_entries_chart_from_2025_line_xAxis = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "line"
);

monthly_entries_chart_from_2025_line_xAxis.setAttribute("x1", 0);
monthly_entries_chart_from_2025_line_xAxis.setAttribute("y1", monthly_entries_chart_from_2025_line_viewBoxHeight);

monthly_entries_chart_from_2025_line_xAxis.setAttribute("x2", monthly_entries_chart_from_2025_line_viewBoxWidth);
monthly_entries_chart_from_2025_line_xAxis.setAttribute("y2", monthly_entries_chart_from_2025_line_viewBoxHeight);

monthly_entries_chart_from_2025_line_xAxis.setAttribute("stroke", "#555");

monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_xAxis);

//Y AXIS TICK MARKS

//set number of ticks
const monthly_entries_chart_from_2025_line_tickCount = 7;

//for all the ticks we want...
for (let i = 0; i <= monthly_entries_chart_from_2025_line_tickCount; i++) {

  //set value for each tick mark (ROUNDED, KEEP NOTE OF SCALE OF DATA)
  const value =
    Math.round((monthly_entries_chart_from_2025_max *
    (1 - i / monthly_entries_chart_from_2025_line_tickCount)) / 10000) * 10000;

  //set position for each tick mark
  const y =
    (i / monthly_entries_chart_from_2025_line_tickCount) *
    (monthly_entries_chart_from_2025_line_viewBoxHeight);

  //tick mark element creation
  const monthly_entries_chart_from_2025_line_tick = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  //set location of positions of ends of tick marks
  monthly_entries_chart_from_2025_line_tick.setAttribute("x1", -10);
  monthly_entries_chart_from_2025_line_tick.setAttribute("x2", 0);
  monthly_entries_chart_from_2025_line_tick.setAttribute("y1", y);
  monthly_entries_chart_from_2025_line_tick.setAttribute("y2", y);

  //color tick marks
  monthly_entries_chart_from_2025_line_tick.setAttribute("stroke", "#555");

  //put down ticks
  monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_tick);

  //Y AXIS LABELS

  const monthly_entries_chart_from_2025_line_y_axis_label = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );

  //set location of labels
  monthly_entries_chart_from_2025_line_y_axis_label.setAttribute("x", -20);
  monthly_entries_chart_from_2025_line_y_axis_label.setAttribute("y", y + 4);

  //set color/style of labels
  monthly_entries_chart_from_2025_line_y_axis_label.setAttribute("text-anchor", "end");
  monthly_entries_chart_from_2025_line_y_axis_label.setAttribute("fill", "#e8e9de");

  //set value as text
  monthly_entries_chart_from_2025_line_y_axis_label.textContent =
    Math.round(value).toLocaleString();

  //put down labels
  monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_y_axis_label);

}

//X AXIS LABEL
monthly_entries_chart_from_2025_line_coords.forEach((p, i) => {

  const monthly_entries_chart_from_2025_line_x_axis_label = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );

  //set x value of x label to be where point was
  monthly_entries_chart_from_2025_line_x_axis_label.setAttribute("x", p.x);

  //set y value of y label to be at the bottom-ish of the chart 
  monthly_entries_chart_from_2025_line_x_axis_label.setAttribute(
    "y",
    monthly_entries_chart_from_2025_line_viewBoxHeight + 18
  );

  //anchor text to middle of position
  monthly_entries_chart_from_2025_line_x_axis_label.setAttribute(
    "text-anchor",
    "middle"
  );

  //set label fill color
  monthly_entries_chart_from_2025_line_x_axis_label.setAttribute("fill", "#e8e9de");

  //get year and month from each month value to put down as labels cleanly
  const [year, month] =
    monthly_entries_chart_from_2025_rows[i].month.split('-').map(Number);
  
  //make shortened year ('YY)
  const shortYear = `'${String(year).slice(-2)}`;

  //get date attribute for each month to turn into datestring
  const d = new Date(year, month - 1, 1);

  //put datestring and shortyear together for full label
  monthly_entries_chart_from_2025_line_x_axis_label.textContent =
    `${d.toLocaleDateString('en-US', { month: 'short' })} ${shortYear}`;

  //put down x-label
  monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_x_axis_label);

});

//GRID

//Y-GRIDLINES

//for all the ticks we have...
for (let i = 0; i <= monthly_entries_chart_from_2025_line_tickCount; i++) {
  
  //set y value for gridline
  const y =
    (i / monthly_entries_chart_from_2025_line_tickCount) *
    (monthly_entries_chart_from_2025_line_viewBoxHeight);
  
  //make svg gridline
  const monthly_entries_chart_from_2025_line_grid = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  //set y-gridlines
  monthly_entries_chart_from_2025_line_grid.setAttribute("x1", 0);
  monthly_entries_chart_from_2025_line_grid.setAttribute("x2", monthly_entries_chart_from_2025_line_viewBoxWidth);
  monthly_entries_chart_from_2025_line_grid.setAttribute("y1", y);
  monthly_entries_chart_from_2025_line_grid.setAttribute("y2", y);

  monthly_entries_chart_from_2025_line_grid.setAttribute("stroke", "#555");
  monthly_entries_chart_from_2025_line_grid.setAttribute("stroke-width", "1");

  monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_grid);
}

//X-GRIDLINES

monthly_entries_chart_from_2025_line_coords.forEach((p) => {

  const monthly_entries_chart_from_2025_line_grid = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );

  monthly_entries_chart_from_2025_line_grid.setAttribute("x1", p.x);
  monthly_entries_chart_from_2025_line_grid.setAttribute("x2", p.x);

  monthly_entries_chart_from_2025_line_grid.setAttribute("y1", 0);
  monthly_entries_chart_from_2025_line_grid.setAttribute("y2", monthly_entries_chart_from_2025_line_viewBoxHeight);

  monthly_entries_chart_from_2025_line_grid.setAttribute("stroke", "#555");
  monthly_entries_chart_from_2025_line_grid.setAttribute("stroke-width", "1");

  monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_grid);

});

//POLYLINES GO OVER GRID
monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_polyline);

//CIRCLES GO OVER LINES, GOES OVER GRID
//making points (circles)

monthly_entries_chart_from_2025_line_coords.forEach(p => {

  //get circle info from web standard
  const monthly_entries_chart_from_2025_line_circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );

  monthly_entries_chart_from_2025_line_circle.setAttribute("cx", p.x); //set x position of circle to our x
  monthly_entries_chart_from_2025_line_circle.setAttribute("cy", p.y); //set y position of circle to our y
  monthly_entries_chart_from_2025_line_circle.setAttribute("r", 5); //set radius
  monthly_entries_chart_from_2025_line_circle.setAttribute("fill", "#4a90e2"); //set color

  monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_circle); //MOVED TO END TO GO OVER GRID

});

//PUT POINT LABELS OVER GRID

//for every point...
monthly_entries_chart_from_2025_line_coords.forEach(p => {

  //make a text label with web standard
  const monthly_entries_chart_from_2025_line_text = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );

  //set x,y positions of text

  //x is on the point
  monthly_entries_chart_from_2025_line_text.setAttribute("x", p.x);

  //y is just below point
  monthly_entries_chart_from_2025_line_text.setAttribute("y", p.y + 20);

  //text starts just after point
  monthly_entries_chart_from_2025_line_text.setAttribute("text-anchor", "start");
  monthly_entries_chart_from_2025_line_text.setAttribute("dominant-baseline", "middle");

  //font size and color
  monthly_entries_chart_from_2025_line_text.setAttribute("font-size", "10");
  monthly_entries_chart_from_2025_line_text.setAttribute("fill", "#e8e9de");

  //set value of point, in comma form for readability
  monthly_entries_chart_from_2025_line_text.textContent = p.value.toLocaleString();

  //put down point labels
  monthly_entries_chart_from_2025_line_svg.appendChild(monthly_entries_chart_from_2025_line_text);
});


//add svg elements to chart
monthly_entries_chart_from_2025_line.appendChild(monthly_entries_chart_from_2025_line_svg);

//GRAPH IS READY! kill loader
monthly_entries_chart_from_2025_line_loader.remove();

document.getElementById('monthly_entries_chart_from_2025_line').appendChild(monthly_entries_chart_from_2025_line) //<- Display


//END LINE CHART

//*END MONTHLY_CBD_FROM_2025 CHART

