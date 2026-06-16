//to plot multiple lines in one chart. to be used as helper for makeLineChart (input single dataset as parameter)
function makeMultipleLineChart ({
//TO-CHANGE NOTES:

//DETERMINE enableMinorXGridlines WHEN IT IS BETTER UNDERSTOOD HOW MANY ELEMENTS THERE WILL BE TO GRAPH
  //IDEA: FOR MONTHS AND FOR DAYS SEPARATELY: TAKE LARGEST DATE VALUE - SMALLEST DATE VALUE AND DIVIDE BY timeOfInterest


  //data we want to plot, list of datasets, to be unpacked in the function
  datasetList,

  //container name we want to use to put actual chart into (TAKEN FROM BLOG PAGE)
  containerId = "test", //<== REMOVE LATER

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
  lineColor = "#e8e9de",
  pointColor = "#4a90e2",
  gridColor = "#555",
  thick_gridColor = "#888",

  //set aspect ratio
  aspectRatio = 4,

  //set width and height via a viewbox (sets maximums, the rest is scaled according to platform size)
  viewBoxWidth = 1000,
  viewBoxHeight = viewBoxWidth / aspectRatio 
}) {

  //unpack containerList:

  //get highest date of all elements
  //get lowest date of all elements
  //get highest y-value of all datasets

  let max_date = new Date("1900-01-01"); //make a date that is almost guaranteed to be surpassed
  let min_date = new Date("3000-01-01"); //make a date that is almost guaranteed to be preceeded (unless you're phillip fry :p)
  let rows_max_val = 0; //set max value as 0 for now

  //loop through every dataset we have
  for (const [name, dataset] of Object.entries(datasetList)) {

    console.log(dataset);

    //update max value through each dataset
    let local_max = Math.max(...dataset.map(r => Number(r.count)))
    if (local_max > rows_max_val) {
      rows_max_val = local_max;
    }

    //update max date and min date value through each dataset
    let local_date_max = new Date("1900-01-01"); //make a date that is almost guaranteed to be surpassed
    let local_date_min = new Date("3000-01-01"); //make a date that is almost guaranteed to be preceeded (unless you're phillip fry :p)

    //WITHIN EACH DATASET, FIND THE MIN/MAX DATES
    for (const r of dataset) {
      const d = new Date(r.Date);

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

  console.log(rows_max_val);

  //make chart loader


  //point count is determined separately by timeofinterest, taken as difference of max date and min date
  const pointCount = 0; //<== CALCULATE REAL VALUE LATER

  //set MinorXGridlines to be off when the pointLabelCutoffCount is reached
  if (enableMinorXGridlines == undefined) {
    enableMinorXGridlines = pointCount >= pointLabelCutoffCount ? 0 : 1;
  }

  //create SVG

}

//to be converted to a single-line driver function for makeMultipleLineChart
function makeLineChart({
  //data we want to plot
  rows,

  //name of chart container we want to use to put actual chart into (TAKEN FROM BLOG PAGE)
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
  lineColor = "#e8e9de",
  pointColor = "#4a90e2",
  gridColor = "#555",
  thick_gridColor = "#888",

  //set aspect ratio
  aspectRatio = 4,

  //set width and height via a viewbox (sets maximums, the rest is scaled according to platform size)
  viewBoxWidth = 1000,
  viewBoxHeight = viewBoxWidth / aspectRatio 
}) {

  //set MinorXGridlines to be off when the pointLabelCutoffCount is reached
  if (enableMinorXGridlines == undefined) {
    enableMinorXGridlines = rows.length >= pointLabelCutoffCount ? 0 : 1;
  }

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
  svg.style.aspectRatio = `${aspectRatio} / 1`;


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

  let skip_amount;

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

    //how many x-axis labels should we skip to make it look less cramped?
    skip_amount = Math.round(coords.length / ( viewBoxWidth / (100 / tickCount) / x_axis_label.textContent.length));

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

  coords.forEach((p, i) => {

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

  //POLYLINES GO OVER GRID
  svg.appendChild(line_polyline);

  //CIRCLES GO OVER LINES, GOES OVER GRID
  //making points (circles)

  coords.forEach((p,i) => {

    //get circle info from web standard
    const line_circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    line_circle.setAttribute("cx", p.x); //set x position of circle to our x
    line_circle.setAttribute("cy", p.y); //set y position of circle to our y
    line_circle.setAttribute("r", 5); //set radius
    line_circle.setAttribute("fill", pointColor); //set color

    //create text necessary for hover, one for month case, one for date case
    let tooltip_text = "";

    if (timeOfInterest == "month") {
      //get year and month from each month value to put down as labels cleanly
      const [year, month] =
        rows[i].month.split('-').map(Number);
      
      //get date attribute for each month to turn into datestring
      const d = new Date(year, month - 1, 1);

      //create tooltip
      tooltip_text = `${d.toLocaleDateString('en-US', { month: 'long' })+ " " + rows[i].month.slice(0,4)}: ${p.value.toLocaleString()}`; //<- "Title" will appear on hover:
                                                                                // month, year: count
    }

    if (timeOfInterest == "date") {
      //get year and month from each month value to put down as labels cleanly
      const [year, month, date] =
        rows[i].date.split('-').map(Number);

      //get date attribute for each month to turn into datestring
      const d = new Date(year, month - 1, date);

      //create tooltip
      tooltip_text = `${d.toLocaleDateString('en-US',{ date: 'long' })}: ${p.value.toLocaleString()}`; //<- "Title" will appear on hover:
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

  //PUT POINT LABELS OVER GRID

  //for every point...
  coords.forEach((p, i)=> {

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

    if ((i+1 <= coords.length-1) && (coords[i+1].value < coords[i].value)) { //if non-first item is less than previous item,
      opposite_height_mult = -1;                             //put label above line
    }

    if (i+1 <= coords.length-1) { //if non-last item, see the slope of the line ahead 
                                  //to get label out of the way with a multiplier

    }
    line_text.setAttribute("y", p.y + ((coords.length / 1000 + 16) * (opposite_height_mult)));

    //text starts just after point
    line_text.setAttribute("text-anchor", "start");
    line_text.setAttribute("dominant-baseline", "middle");

    //font size and color
    line_text.setAttribute("font-size", `${85 / tickCount}`);

    line_text.setAttribute("fill", lineColor);

    //set value of point, in comma form for readability
    line_text.textContent = p.value.toLocaleString();

    //inner function to add point label lines. only needed when points have a possibility to become ambiguous, like when:
    //1. points skip labels
    //2. points are only labeled by min/max/start/end
    const addPointLabelLine = () => {
    if (coords.length >= pointLabelCutoffCount || skip_amount > 1) {
      //make point label line
      const point_label_line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      //set line boundaries
      point_label_line.setAttribute("x1", p.x-1);
      point_label_line.setAttribute("x2", p.x-1);
      point_label_line.setAttribute("y1", p.y);
      point_label_line.setAttribute("y2", p.y + ((coords.length / 1000 + 18) * (opposite_height_mult)));

      point_label_line.setAttribute("stroke", lineColor);
      point_label_line.setAttribute("stroke-width", "1");

      svg.appendChild(point_label_line);
    }
  };

    //if there are enough points, put down only the first, last, min, and max labels
    if (coords.length >= pointLabelCutoffCount) {
      if (i == 0 || i == coords.length-1 || coords[i].value == rows_max_val || coords[i].value == Math.min(...rows.map(r => Number(r.count)))) {
        svg.appendChild(line_text);
        addPointLabelLine();
      }
    }
    else {
    //if there are not enough points, just put down the skip_amount interval point labels
      if (i % skip_amount == 0) {
        svg.appendChild(line_text);
        addPointLabelLine();
      }
    }

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

  width = 1000,
  height = 300,

  paddingTop = 25,
  paddingBottom = 45,
  paddingLeft = 5,
  paddingRight = 5
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
    valueText.setAttribute("font-size", `${1.4 * barWidth / valueText.textContent.length}`);

    //added top of bar label to svg
    svg.appendChild(valueText);

    //X-LABEL

    //create svg element to x-label
    const labelText = document.createElementNS(
      "http://www.w3.org/2000/svg", 
      "text"
    );

    labelText.setAttribute("x", x + barWidth * 0.4);
    labelText.setAttribute("y", height - paddingBottom + (barWidth * 0.25));
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("fill", textColor);
    labelText.setAttribute("font-size", `${barWidth * 0.18}`);

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

//GET LAST 7 DAYS OF CRZ ENTRIES
const past_week_entries_rows = await fetch("/src/json/last_7_days_cbd.json")
    .then(res => res.json());

//GET MONTHLY CRZ ENTRIES SINCE 2025
const monthly_entries_chart_from_2025_rows = await fetch("/src/json/monthly_cbd.json")
    .then(res => res.json());

//GET MONTHLY SUBWAY ENTRIES SINCE MAR 2020
const monthly_entries_subway_from_mar_2020_rows = await fetch("/src/json/monthly_subway_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY LIRR ENTRIES SINCE MAR 2020
const monthly_lirr_entries_from_mar_2020_rows = await fetch("/src/json/monthly_lirr_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY MNR ENTRIES SINCE MAR 2020
const monthly_mnr_entries_from_mar_2020_rows = await fetch("/src/json/monthly_mnr_entries_from_mar_2020.json")
    .then(res => res.json());

//CREATE LIST OF MNR AND LIRR ENTRIES SINCE MAR 2020
const monthly_multimodal_from_mar_2020_rows = {
  lirr: monthly_lirr_entries_from_mar_2020_rows,
  mnr: monthly_mnr_entries_from_mar_2020_rows
};

//CALL MULTI LINE CHART FUNCTION TEST
makeMultipleLineChart({
  datasetList: monthly_multimodal_from_mar_2020_rows,
  yAxisStep: 1_000_000,
  timeOfInterest: "month"
});

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
  yAxisStep: 20_000_000,
  timeOfInterest: "month",
  aspectRatio: 2
});

makeLineChart({
  rows: monthly_lirr_entries_from_mar_2020_rows,
  containerId: "monthly_entries_lirr_from_mar_2020_line",
  yAxisStep: 1_000_000,
  timeOfInterest: "month",
  aspectRatio: 2
});

makeLineChart({
  rows: monthly_mnr_entries_from_mar_2020_rows,
  containerId: "monthly_entries_mnr_from_mar_2020_line",
  yAxisStep: 900_000,
  timeOfInterest: "month",
  aspectRatio: 2
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

makeBarChart({
  rows: monthly_entries_subway_from_mar_2020_rows,
  containerId: "monthly_entries_subway_from_mar_2020_bar",
  timeOfInterest: "month"
});
