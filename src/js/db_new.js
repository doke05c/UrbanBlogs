// LOADER COMES FIRST: LET USER WAIT

const chart = document.createElement('chart'); //<- Chart for past entries to CBD

const loader = document.createElement("div");
loader.textContent = "Loading chart...";
loader.style.display = "flex";
loader.style.alignItems = "center";
loader.style.justifyContent = "center";
loader.style.height = "200px";
loader.style.fontSize = "14px";
loader.style.color = "#666";
chart.appendChild(loader); //<- Make the "chart" the loader for now

document.getElementById('chart').appendChild(chart) //<- Display


//number of most recent days in the chart
const date_count = 7;

//GET LAST 7 DAYS OF CRZ ENTRIES
const rows = await fetch("/src/json/last_7_days_cbd.json")
    .then(res => res.json());

//SET CONTAINER GEOMETRY
const max = Math.max(...rows.map(r => Number(r.count))); //<- set highest value in chart
const wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.alignItems = "flex-end";
wrapper.style.gap = "8px";
wrapper.style.height = "200px";
wrapper.style.width = "100%";

//FOR EACH DAY...
rows.forEach(r => {
  const d = new Date(r.date); //<- create "Date" object for the day of week

  const bar = document.createElement("div");//<- make bar

  const height = (Number(r.count) / max) * 100;//<- set bar height ratio to max

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
  wrapper.appendChild(bar);
});

//GRAPH IS READY! kill loader
loader.remove();

//add container to chart item, ship it off to main blog file
chart.appendChild(wrapper);

document.getElementById('chart').appendChild(chart) //<- Display
