function makeLineChart({
  //data we want to plot
  rows,

  //name of chart container we want to use to put actual chart into (TAKEN FROM BLOG PAGE)
  containerId,

  //what time scale are we graphing over? days, months?
  timeOfInterest,

  //set width and height via a viewbox (sets maximums, the rest is scaled according to platform size)
  viewBoxWidth = 1000,
  viewBoxHeight = 250,

  //padding constant from left/right sides
  paddingLeft = 60,
  paddingRight = 60,

  //set step for chart according to scale of data
  yAxisStep,

  //set colors for elements
  lineColor = "#e8e9de",
  pointColor = "#4a90e2",
  gridColor = "#555",

  //set aspect ratio
  aspectRatio = "4 / 1"
}) {

  const rows_max_val = Math.max(...rows.map(r => Number(r.count))); //<- set highest value in chart

  const line_chart = document.createElement(containerId); //<- Chart element

  const line_chart_loader = document.createElement("div");
  line_chart_loader.textContent = "Loading chart...";
  line_chart_loader.style.display = "flex";
  line_chart_loader.style.alignItems = "center";
  line_chart_loader.style.justifyContent = "center";
  line_chart_loader.style.height = "200px";
  line_chart_loader.style.fontSize = "14px";
  line_chart_loader.style.color = "#666";
  line_chart.appendChild(line_chart_loader); //<- Make the "chart" the loader for now

  document.getElementById(containerId).appendChild(line_chart) //<- Display

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
  svg.style.aspectRatio = aspectRatio;


  //set points on line chart (time, value : x, y)
  const coords = rows.map((r, i) => ({
    x:
      paddingLeft +
      i * (
        (viewBoxWidth -
        paddingLeft -
        paddingRight) /
        (rows.length - 1)
      ),  

    y: viewBoxHeight - 
      (Number(r.count) / yAxisMax) * 
      viewBoxHeight,

    value: r.count
  }));

  const line_polyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );

  //set lines connecting points
  line_polyline.setAttribute(
    "points",
    coords.map(p => `${p.x},${p.y}`).join(" ")
  );

  line_polyline.setAttribute("fill", "none");
  line_polyline.setAttribute("stroke", lineColor);
  line_polyline.setAttribute("stroke-width", "2.5");

  // svg.appendChild(line_polyline); //MOVED TO END TO GO OVER GRID

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
    y_axis_label.setAttribute("fill", lineColor);

    y_axis_label.setAttribute("font-size", `${90 / tickCount}`);    

    //set value as text
    y_axis_label.textContent =
      Math.round(value).toLocaleString();

    //put down labels
    svg.appendChild(y_axis_label);

  }

  //X AXIS LABEL

  //for each point on x-axis...
  coords.forEach((p, i) => {

    const x_axis_label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    //set x value of x label to be where point was
    x_axis_label.setAttribute("x", p.x);

    //set y value of y label to be at the bottom-ish of the chart 
    x_axis_label.setAttribute(
      "y",
      viewBoxHeight + 18
    );

    //anchor text to middle of position
    x_axis_label.setAttribute(
      "text-anchor",
      "middle"
    );

    x_axis_label.setAttribute("font-size", `${100 / tickCount}`);    

    //set label fill color
    x_axis_label.setAttribute("fill", lineColor);

    if (timeOfInterest == "month") {
      //get year and month from each month value to put down as labels cleanly
      const [year, month] =
        rows[i].month.split('-').map(Number);
      
      //make shortened year ('YY)
      const shortYear = `'${String(year).slice(-2)}`;

      //get date attribute for each month to turn into datestring
      const d = new Date(year, month - 1, 1);

      //put datestring and shortyear together for full label
      x_axis_label.textContent =
        `${d.toLocaleDateString('en-US', { month: 'short' })} ${shortYear}`;
    }

    if (timeOfInterest == "date") {
      //get year and month from each month value to put down as labels cleanly
      const [year, month, date] =
        rows[i].date.split('-').map(Number);

      //get date attribute for each month to turn into datestring
      const d = new Date(year, month - 1, date);

      //put month and date together for full label
      x_axis_label.textContent =
        `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${d.toLocaleDateString('en-US', { month: '2-digit' })}-${d.toLocaleDateString('en-US', {day: "2-digit"})}`;
    }



    //put down x-label
    svg.appendChild(x_axis_label);

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

  coords.forEach((p) => {

    const x_grid = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    x_grid.setAttribute("x1", p.x);
    x_grid.setAttribute("x2", p.x);

    x_grid.setAttribute("y1", 0);
    x_grid.setAttribute("y2", viewBoxHeight);

    x_grid.setAttribute("stroke", gridColor);
    x_grid.setAttribute("stroke-width", "1");

    svg.appendChild(x_grid);

  });

  //POLYLINES GO OVER GRID
  svg.appendChild(line_polyline);

  //CIRCLES GO OVER LINES, GOES OVER GRID
  //making points (circles)

  coords.forEach(p => {

    //get circle info from web standard
    const line_circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    line_circle.setAttribute("cx", p.x); //set x position of circle to our x
    line_circle.setAttribute("cy", p.y); //set y position of circle to our y
    line_circle.setAttribute("r", 5); //set radius
    line_circle.setAttribute("fill", pointColor); //set color

    svg.appendChild(line_circle); //MOVED TO END TO GO OVER GRID

  });

  //PUT POINT LABELS OVER GRID

  //for every point...
  coords.forEach(p => {

    //make a text label with web standard
    const line_text = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    //set x,y positions of text

    //x is on the point
    line_text.setAttribute("x", p.x);

    //y is just below point
    line_text.setAttribute("y", p.y + 20);

    //text starts just after point
    line_text.setAttribute("text-anchor", "start");
    line_text.setAttribute("dominant-baseline", "middle");

    //font size and color
    line_text.setAttribute("font-size", `${150 / rows.length}`);    
    line_text.setAttribute("fill", lineColor);

    //set value of point, in comma form for readability
    line_text.textContent = p.value.toLocaleString();

    //put down point labels
    svg.appendChild(line_text);
  });


  //add svg elements to chart
  line_chart.appendChild(svg);

  //GRAPH IS READY! kill loader
  line_chart_loader.remove();

  document.getElementById(containerId).appendChild(line_chart) //<- Display


  //END LINE CHART
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

}) {

  //number of items in the chart
  const full_item_count = rows.length;

  const rows_max_val = Math.max(...rows.map(r => Number(r.count))); //<- set highest value in chart
    
  //START BAR CHART

  // LOADER COMES FIRST: LET USER WAIT

  const bar_chart = document.createElement(containerId); //<- bar chart element creation

  const bar_chart_loader = document.createElement("div");
  bar_chart_loader.textContent = "Loading chart...";
  bar_chart_loader.style.display = "flex";
  bar_chart_loader.style.alignItems = "center";
  bar_chart_loader.style.justifyContent = "center";
  bar_chart_loader.style.height = "200px";
  bar_chart_loader.style.fontSize = "14px";
  bar_chart_loader.style.color = "#666";
  bar_chart.appendChild(bar_chart_loader); //<- Make the "chart" the loader for now

  document.getElementById(containerId).appendChild(bar_chart) //<- Display


  //SET CONTAINER GEOMETRY
  const bar_chart_wrapper = document.createElement("div");
  bar_chart_wrapper.style.display = "flex";
  bar_chart_wrapper.style.alignItems = "flex-end";
  bar_chart_wrapper.style.gap = "8px";
  bar_chart_wrapper.style.height = "200px";
  bar_chart_wrapper.style.width = "100%";

  //FOR EACH TIME ITEM...
  rows.forEach(r => {

    let d;

    if (timeOfInterest == "month") {
      const [year, month] = r.month.split('-').map(Number);
      d = new Date(year, month - 1, 1); //<- create "Date" object for the month
    }

    if (timeOfInterest == "date") {
      const [year, month, day] = r.date.split('-').map(Number);
      d = new Date(year, month - 1, day); //<- create "Date" object for the date
    }

    const bar = document.createElement("div");//<- make bar

    const bar_height = (Number(r.count) / rows_max_val) * 100;//<- set bar height ratio to max

    //SET BAR GEOMETRY
    bar.style.height = `${bar_height}%`;
    bar.style.flex = "1 1 0";
    bar.style.background = barColor;
    bar.style.display = "flex";
    bar.style.flexDirection = "column";       
    bar.style.justifyContent = "space-between";
    bar.style.alignItems = "center";        
    bar.style.color = textColor;
    bar.style.fontSize = `${11.8 / full_item_count}vw`;
    bar.style.minWidth = "0";

    if (timeOfInterest == "month") {
      bar.title = `${d.toLocaleDateString('en-US', { month: 'long' })+ " " + r.month.slice(0,4)}: ${r.count.toLocaleString()}`; //<- "Title" will appear on hover:
                                                                                // month, year: count
    }

    if (timeOfInterest == "date") {
      bar.title = `${d.toLocaleDateString('en-US',{ date: 'long' })}: ${r.count.toLocaleString()}`; //<- "Title" will appear on hover:
                                                                                // month, year: count
    }

    const count_label = document.createElement("div"); //<- make count label, top of bar
    count_label.textContent = r.count.toLocaleString();

    const date_label = document.createElement("div"); //<- make date label, bottom of bar

    if (timeOfInterest == "month") {
      date_label.textContent =   
        d.toLocaleDateString('en-US', { month: 'short' }) + " " + r.month.slice(0,4); //<- set date label, just mo year 
    }

    if (timeOfInterest == "date") {
      date_label.textContent =   
        d.toLocaleDateString('en-US', { weekday: 'short' }) + ", " + r.date.slice(5,10); //<- set date label, just mm-dd and DOW
    }

    //SET LABEL STYLE
    date_label.style.fontSize = `${13.5 / full_item_count}vw`;
    date_label.style.marginBottom = `${-28 / full_item_count}vw`;
    date_label.style.whiteSpace = "nowrap";

    //add labels to bar
    bar.appendChild(count_label);
    bar.appendChild(date_label);

    //add bar to container
    bar_chart_wrapper.appendChild(bar);
  });

  //GRAPH IS READY! kill loader
  bar_chart_loader.remove();

  //add container to chart item, ship it off to main blog file
  bar_chart.appendChild(bar_chart_wrapper);

  document.getElementById(containerId).appendChild(bar_chart) //<- Display


}

//GET LAST 7 DAYS OF CRZ ENTRIES
const past_week_entries_rows = await fetch("/src/json/last_7_days_cbd.json")
    .then(res => res.json());

//GET MONTHLY CRZ ENTRIES SINCE 2025
const monthly_entries_chart_from_2025_rows = await fetch("/src/json/monthly_cbd.json")
    .then(res => res.json());

//GET MONTHLY SUBWAY ENTRIES SINCE MAR 2020
const monthly_entries_subway_from_mar_2020_rows = await fetch("/src/json/monthly_subway_entries_from_mar_2020.json")
    .then(res => res.json());

//CALL LINE CHART FUNCTION
makeLineChart({
  rows: monthly_entries_chart_from_2025_rows,
  containerId: "monthly_entries_chart_from_2025_line",
  yAxisStep: 3_000_000,
  timeOfInterest: "month"
});

makeLineChart({
  rows: past_week_entries_rows,
  containerId: "past_week_entries_chart_line",
  yAxisStep: 100_000,
  timeOfInterest: "date"
});

makeLineChart({
  rows: monthly_entries_subway_from_mar_2020_rows,
  containerId: "monthly_entries_subway_from_mar_2020_line",
  yAxisStep: 5_000_000,
  timeOfInterest: "month"
});

//CALL BAR CHART FUNCTION

makeBarChart({
  rows: monthly_entries_chart_from_2025_rows,
  containerId: "monthly_entries_chart_from_2025_bar",
  timeOfInterest: "month"
});

makeBarChart({
  rows: past_week_entries_rows,
  containerId: "past_week_entries_chart",
  timeOfInterest: "date"
});
