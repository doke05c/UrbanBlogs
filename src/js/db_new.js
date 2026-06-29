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

  pointColor = "#eafafa",
  gridColor = "#555",
  thick_gridColor = "#888",

  //set aspect ratio
  aspectRatio = 4,

  //set width and height via a viewbox (sets maximums, the rest is scaled according to platform size)
  viewBoxWidth = 1000,
  viewBoxHeight = viewBoxWidth / aspectRatio 
}) {

  //unpack datasetList:

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

        x =
          paddingLeft + 
          (monthOffset / (pointCount - 1)) *
          (viewBoxWidth - paddingLeft - paddingRight);
      
      //if day, make a system for x using day offset
      } else if (timeOfInterest == "date") {
        //create new date objects

        const [year, month, day] = r.date.split("-").map(Number);
        d = new Date(year, month - 1, day);

        const dayOffset =
          Math.round((d - min_date) / (1000 * 60 * 60 * 24));

        x =
          paddingLeft +
          (dayOffset / (pointCount - 1)) *
          (viewBoxWidth - paddingLeft - paddingRight);
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
    const x =
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
    skip_amount = Math.round(pointCount / ( viewBoxWidth / (100 / tickCount) / x_axis_label.textContent.length));

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

      //set lines connecting points
      line_polyline.setAttribute(
        "points",
        coordsList[name].map(p => `${p.x},${p.y}`).join(" ")
      );

      line_polyline.setAttribute("fill", "none");

      if (passLineColorsAsStatic) {
        //find index of name ^ in datasetListStepSizeReference, and then set index lineColors[index] of this found index
        const index = Object.keys(datasetListStepSizeReference).indexOf(name);
        line_polyline.setAttribute("stroke", lineColors[index % lineColors.length]); //<- do the remainder to ensure loopability when needed
      } else {
        line_polyline.setAttribute("stroke", lineColors[i]);
      }

      line_polyline.setAttribute("stroke-width", "2.5");

      svg.appendChild(line_polyline);
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
    legendSpacing = Math.max((name.length * 15), (6 * 15)); //minimum "name.length" should be 6 in case name is shorter than 6 char
    if (legendX + legendSpacing > legendMaxX) {
      legendX = legendStartX;
      legendRow++;
    }

    const currentLegendY = legendY + (legendRow * legendRowHeight);

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
  passLineColorsAsStatic = true

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
          datasetListStepSizeReference: datasetListStepSizeReference
        });
      }

    }
  } 

}

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
  passLineColorsAsStatic = true

}) 

{
  //get checkbox container from html side
  const checkboxContainer = document.getElementById(checkBoxGroupId);

  //set grid style for checkboxes, with set spacing
  checkboxContainer.style.display = "grid";
  checkboxContainer.style.gridTemplateColumns = "repeat(8, auto)";
  checkboxContainer.style.columnGap = "5px";

  //for each item in the stepsize reference... (datasetlist is advisable as well, both are fine, just as long as indexing is consistent on both)
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

  //create list of checked datasets to keep track of with each click
  let checkedDatasets = {};

  //stepsize calculated before render, updated with each click
  let stepSize;

  //create chart container, set it to clicking prompt for now
  const container = document.getElementById(containerId);
  container.textContent = "Select a dataset to start the chart.";

  document
    //give each checkbox in the checkbox set a listener for clicks
    .querySelectorAll(`#${checkBoxGroupId} input[type='checkbox']`)
    .forEach(checkbox => {

      checkbox.addEventListener("change", () => {
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
            datasetListStepSizeReference: datasetListStepSizeReference
          });

        } else {
          //remove chart, no data
          const container = document.getElementById(containerId);
          container.innerHTML = ""; //remove old chart

          container.textContent = "Select a dataset to start the chart.";
        }

      });
    });
}


//GET LAST 7 DAYS OF CRZ ENTRIES
const past_week_entries_rows = await fetch("/src/json/last_7_days_cbd.json")
    .then(res => res.json());

//GET LAST 7 DAYS OF BRIDGE_TUNNEL ENTRIES (intentionally offset from cbd)
const past_week_bridge_tunnel_rows = await fetch("/src/json/last_7_days_bridge_tunnel.json")
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

//GET MONTHLY AAR ENTRIES SINCE MAR 2020
const monthly_aar_entries_from_mar_2020_rows = await fetch("/src/json/monthly_aar_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY BUS ENTRIES SINCE MAR 2020
const monthly_bus_entries_from_mar_2020_rows = await fetch("/src/json/monthly_bus_entries_from_mar_2020.json")
    .then(res => res.json());

//GET MONTHLY SIR ENTRIES SINCE MAR 2020
const monthly_sir_entries_from_mar_2020_rows = await fetch("/src/json/monthly_sir_entries_from_mar_2020.json")
    .then(res => res.json());

//CREATE LIST OF MTA 6-MODE PUBLIC TRANSIT ENTRIES SINCE MAR 2020
const monthly_multimodal_from_mar_2020_rows = {
  "MNR Ridership": monthly_mnr_entries_from_mar_2020_rows,
  "LIRR Ridership": monthly_lirr_entries_from_mar_2020_rows,
  "Subway Ridership": monthly_entries_subway_from_mar_2020_rows,
  "SIR Ridership": monthly_sir_entries_from_mar_2020_rows,
  "Bus Ridership": monthly_bus_entries_from_mar_2020_rows,
  "Access-a-Ride Ridership": monthly_aar_entries_from_mar_2020_rows,
};

const monthly_multimodal_from_mar_2020_step_size_reference = {
  "MNR Ridership": 1_000_000,
  "LIRR Ridership": 1_000_000,
  "Subway Ridership": 20_000_000,
  "SIR Ridership": 50_000,
  "Bus Ridership": 5_000_000,
  "Access-a-Ride Ridership": 200_000,
};

//GET MONTHLY WEEKDAY SUBWAY OTP RATES SINCE JAN 2015

const monthly_weekday_subway_otp_rate_from_jan_2015_rows = {};

for (const subway_line of ["1", "2", "3", "4", "5", "6", "7", "S 42nd", "A", "B", "C", "D", "E", "F", "G", "JZ", "L", "M", "N", "Q", "R", "S Fkln", "S Rock"]) {
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

for (const subway_line of ["1", "2", "3", "4", "5", "6", "7", "S 42nd", "A", "B", "C", "D", "E", "F", "G", "JZ", "L", "M", "N", "Q", "R", "S Fkln", "S Rock"]) {
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

//GET MONTHLY OVERALL SUBWAY OTP RATES SINCE JAN 2015

const monthly_overall_subway_otp_rate_from_jan_2015_rows = {};

//for each subway line...
for (const subway_line of [
  "1", "2", "3", "4", "5", "6", "7",
  "S 42nd", "A", "B", "C", "D", "E", "F", "G",
  "JZ", "L", "M", "N", "Q", "R", "S Fkln", "S Rock"
]) {

  //create a weekday and weekend series for each subway line
  const weekday = monthly_weekday_subway_otp_rate_from_jan_2015_rows[subway_line];
  const weekend = monthly_weekend_subway_otp_rate_from_jan_2015_rows[subway_line];

  //build a lookup: month -> weekend entry for each series
  const weekendByMonth = Object.fromEntries(
    weekend.map(entry => [entry.month, entry])
  );

  //now create combined on_time_trips and sched_trips from sum of weekend and weekday trips by subway line.
  monthly_overall_subway_otp_rate_from_jan_2015_rows[subway_line] =
    weekday
      .filter(weekdayEntry => weekendByMonth[weekdayEntry.month])
      .map(weekdayEntry => {

        const weekendEntry = weekendByMonth[weekdayEntry.month];

        const on_time_trips =
          weekdayEntry.on_time_trips + weekendEntry.on_time_trips;

        const sched_trips =
          weekdayEntry.sched_trips + weekendEntry.sched_trips;

        //combine into overall database
        return {
          month: weekdayEntry.month,
          on_time_trips,
          sched_trips,
          count: on_time_trips / sched_trips * 100
        };
      });
}

const monthly_subway_otp_rate_step_size_reference = Object.fromEntries(
  [
    "1", "2", "3", "4", "5", "6", "7",
    "S 42nd", "A", "B", "C", "D", "E", "F", "G",
    "JZ", "L", "M", "N", "Q", "R", "S Fkln", "S Rock"
  ].map(line => [line, 20])
);


console.log(monthly_weekday_subway_otp_rate_from_jan_2015_rows);
console.log(monthly_weekend_subway_otp_rate_from_jan_2015_rows);
console.log(monthly_overall_subway_otp_rate_from_jan_2015_rows);

//CREATE LIST OF MNR AND LIRR ENTRIES SINCE MAR 2020
const monthly_lirr_mnr_from_mar_2020_rows = {
  "MNR Ridership": monthly_mnr_entries_from_mar_2020_rows,
  "LIRR Ridership": monthly_lirr_entries_from_mar_2020_rows,
};

//CREATE LIST OF PAST WEEK ENTRIES (DATE TEST)
const entries_list_past_week = {
  "CRZ Entries": past_week_entries_rows,
  "Bridge & Tunnel Entries": past_week_bridge_tunnel_rows
};

//CALL MULTI LINE CHART FUNCTION
makeMultipleLineChart({
  datasetList: monthly_lirr_mnr_from_mar_2020_rows,
  containerId: "monthly_lirr_mnr_from_mar_2020_line",
  yAxisStep: 1_000_000,
  timeOfInterest: "month",
  aspectRatio: 3
});

makeMultipleLineChart({
  datasetList: monthly_multimodal_from_mar_2020_rows,
  containerId: "monthly_multimodal_from_mar_2020_line",
  yAxisStep: 20_000_000,
  timeOfInterest: "month",
  aspectRatio: 1.5
});

makeMultipleLineChart({
  datasetList: entries_list_past_week,
  containerId: "past_week_crossing_crz_bt_line",
  yAxisStep: 125_000,
  timeOfInterest: "date"
});

//CALL SINGLE LINE CHART FUNCTION
makeLineChart({
  rows: monthly_entries_chart_from_2025_rows,
  name: "CRZ Entries",
  containerId: "monthly_entries_chart_from_2025_line",
  yAxisStep: 3_000_000,
  timeOfInterest: "month"
});

makeLineChart({
  rows: past_week_entries_rows,
  name: "CRZ Entries",
  containerId: "past_week_entries_chart_line",
  yAxisStep: 100_000,
  timeOfInterest: "date"
});

makeLineChart({
  rows: monthly_entries_subway_from_mar_2020_rows,
  name: "Subway Ridership",
  containerId: "monthly_entries_subway_from_mar_2020_line",
  yAxisStep: 20_000_000,
  timeOfInterest: "month",
  aspectRatio: 2
});

makeLineChart({
  rows: monthly_lirr_entries_from_mar_2020_rows,
  name: "LIRR Ridership",
  containerId: "monthly_entries_lirr_from_mar_2020_line",
  yAxisStep: 1_000_000,
  timeOfInterest: "month",
  aspectRatio: 2
});

makeLineChart({
  rows: monthly_mnr_entries_from_mar_2020_rows,
  name: "MNR Ridership",
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

//USER SELECTION SECTION

typeSelectMultipleLineChart({
  datasetList: monthly_multimodal_from_mar_2020_rows,
  datasetListStepSizeReference: monthly_multimodal_from_mar_2020_step_size_reference,

  containerId: "monthly_selectmodal_from_mar_2020_line",
  buttonId: "confirmDatasetInputButton",
  inputTextId: "inputDatasetText",

  timeOfInterest: "month",
  aspectRatio: 1.5,
});


clickSelectMultipleLineChart({
  datasetList: monthly_multimodal_from_mar_2020_rows,
  datasetListStepSizeReference: monthly_multimodal_from_mar_2020_step_size_reference,

  containerId: "monthly_selectmodal_box_from_mar_2020_line",
  checkBoxGroupId: "ridership-checkboxes",

  timeOfInterest: "month",
  aspectRatio: 1.5,
});

//go through the selected choices btwn weekday, weekend, and overall
//depending on which one is chosen, change out the dataset list in the clickselectmultiplelinechart
const subwayOTPDatasets = {
    "Overall": monthly_overall_subway_otp_rate_from_jan_2015_rows,
    "Weekday": monthly_weekday_subway_otp_rate_from_jan_2015_rows,
    "Weekend": monthly_weekend_subway_otp_rate_from_jan_2015_rows
};

console.log(subwayOTPDatasets["Overall"]);

const select = document.getElementById("subwayOTPDaySelect");

clickSelectMultipleLineChart({
    datasetList: subwayOTPDatasets[select.value],
    datasetListStepSizeReference: monthly_subway_otp_rate_step_size_reference,
    containerId: "monthly_subway_otp_from_jan_2015_select_box_line",
    checkBoxGroupId: "subway-otp-checkboxes",
    timeOfInterest: "month",
    aspectRatio: 1.5,
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

      //S Franklin, S Rockaway
      "#808183",
      "#808183",
    ]
});

select.addEventListener("change", function () {
    const container = document.getElementById("monthly_subway_otp_from_jan_2015_select_box_line");
    container.innerHTML = ""; //remove old chart

    const checkboxset = document.getElementById("subway-otp-checkboxes");
    checkboxset.innerHTML = ""; //remove old checkbox set

  clickSelectMultipleLineChart({
      datasetList: subwayOTPDatasets[select.value],
      datasetListStepSizeReference: monthly_subway_otp_rate_step_size_reference,
      containerId: "monthly_subway_otp_from_jan_2015_select_box_line",
      checkBoxGroupId: "subway-otp-checkboxes",
      timeOfInterest: "month",
      aspectRatio: 1.5,
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

        //S Franklin, S Rockaway
        "#808183",
        "#808183",
      ]
  });
});

