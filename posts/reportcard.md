---
title: 'SSTRP Transportation Report Card'
description: "The New York City region has been missing a centralized location where all regional transit agency data can be accessed. Finally, a solution is here."
---

## SSTRP Transportation Report Card

### The New York City region has been missing a centralized location where all regional transit agency data can be accessed. Finally, a solution is here.

##### March 30, 2026: 12:00 PM, Roosevelt House Public Policy Institute:

I'm trying to test out how I can bring in tables from my DuckDB database to my website, specifically this page.

##### April 27, 2026: 3:00 PM, Roosevelt House Public Policy Institute:

I created a version that should load nearly instantly. Here goes nothing!

<!-- grab dev state from package.json npm loader -->
<script>
  window.NODE_ENV = "{{ env }}";
</script>

<!-- run database json -->
<!-- <script type="module" src="/src/js/db.js"></script> -->
<script type="module" src="/src/js/db_new.js"></script>


#### Number of CBD Entries in the Most Recently Available Week, Bar:
<div id="past_week_entries_chart"></div>

<br>

##### May 28, 2026: 4:30 PM, Roosevelt House Public Policy Institute:

Another chart! After about a month to work on a different project, I'm back with more data on CRZ entries! Thinking of taking the monthlies since 2025 to the next level by bringing in the earlier versions (2024 and before) and making this a line chart instead. Here is another bar for now:

#### Number of CBD Entries Monthly Since Jan 2025, up to Latest Full Month, Bar:
<div id="monthly_entries_chart_from_2025_bar"></div>
<br>

##### June 8, 2026: 1:00 PM, City College Cohen Library:

Experimenting with line chart formatting, this will be a more scalable and readable way to observe longitudinal transit trends.
#### Number of CBD Entries Monthly Since Jan 2025, up to Latest Full Month, Line:
<div id="monthly_entries_chart_from_2025_line"></div>
<br>

##### June 9, 2026: 1:00 PM, Roosevelt House Public Policy Institute:

I restructured the process for making charts, everything is now as automated as possible! This means that I can remake the 7-Day entries history as a line chart in nearly no time at all!
#### Number of CBD Entries in the Most Recently Available Week, Line:
<div id="past_week_entries_chart_line"></div>
<br>

Oh, also, Subway ridership!
#### MTA Subway Monthly Ridership Since Mar 2020, Line:
<div id="monthly_entries_subway_from_mar_2020_line"></div>
<br>

#### MTA Subway Monthly Ridership Since Mar 2020, Bar:
<div id="monthly_entries_subway_from_mar_2020_bar"></div>
<br>

##### June 10, 2026: 1:00 PM, Hunter College Cooperman Library:

I added a lot of readability and visibility changes to the line charts, which scale dynamically with the size of the dataset that needs to be graphed. The Subway ridership line chart looks in much better shape now, so check out LIRR ridership!

#### MTA LIRR Monthly Ridership Since Mar 2020, Line:
<div id="monthly_entries_lirr_from_mar_2020_line"></div>
<br>

##### June 15, 2026: 3:30 PM, Roosevelt House Public Policy Institute:

I reworked bar charts to work at all scales with all devices, though bar charts probably aren't best for large longitudinal observations. So.. here's the Metro-North as a line chart:

#### MTA MNRR Monthly Ridership Since Mar 2020, Line:
<div id="monthly_entries_mnr_from_mar_2020_line"></div>
<br>

##### June 16, 2026: 1:00 PM, Jefferson Market Library:

I'm starting to work on a multi-line chart that automatically sets boundaries and scales based on the combined data from all datasets to be plotted on the one chart. Starting with combined LIRR/MNRR monthly ridership and combined CRZ entries / Bridge&Tunnel entries over the most recent 7 days. (these are offset in the MTA database, which will be used as an intentional offset test)

#### MTA LIRR/MNRR Monthly Ridership Since Mar 2020, Line:
<div id="monthly_lirr_mnr_from_mar_2020_line"></div>
<br>

#### Most Recently Available Week CRZ Entries and Bridge/Tunnel Crossings, Line:
<div id="past_week_crossing_crz_bt_line"></div>
<br>

##### June 16, 2026: 6:30PM, Jefferson Market Library:

Here's a multimodal monthly chart for all the public transit modes in the MTA Traffic & Ridership since Mar 2020 dataset!

#### MTA Multimodal Ridership Since Mar 2020, Line:
<div id="monthly_multimodal_from_mar_2020_line"></div>
<br>

##### June 18, 2026: 2:30PM, City College Cohen Library:

It might be a little crowded in here... how about we just select only the datasets we want?
Just text for now, please input mode names. (<b>separated by spaces if multiple modes</b>)
Enter empty list to return to all modes.

<input id="inputDatasetText">
<button id="confirmDatasetInputButton">Submit</button>

#### MTA Ridership Since Mar 2020, Selected Modes, Line:
<div id="monthly_selectmodal_from_mar_2020_line"></div>
<br>

##### June 23, 2026: 3:00PM, Roosevelt House Public Policy Insitute:

Introducing a new, checkbox-based system to select datasets. No more confusion on what we can select!

<div id="ridership-checkboxes"></div>

#### MTA Ridership Since Mar 2020, Selected Modes, Line:
<div id="monthly_selectmodal_box_from_mar_2020_line"></div>
<br>

##### June 24, 2026: 4:00PM, Roosevelt House Public Policy Institute:

I stabilized the colors, meaning we can now do breakdowns of Subway data by line! Here's weekday on-time performance for each subway line by month:


##### June 29, 2026: 1:30PM, City College Cohen Library:

What if we wanted to look at more than just weekday data? Not a problem! Check off which days of Subway on-time performance to graph:

<label for="subwayOTPDaySelect">Day Type:</label><br>
<select id="subwayOTPDaySelect">
    <option value="Overall">Overall</option>
    <option value="Weekday">Weekday</option>
    <option value="Weekend">Weekend</option>
</select>

<div id="subway-otp-checkboxes"></div>

#### MTA Monthly Subway On-Time Performance Rate (%), Since Jan 2015, Line:
<div id="monthly_subway_otp_from_jan_2015_select_box_line"></div>
<br>