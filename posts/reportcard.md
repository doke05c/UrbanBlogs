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

