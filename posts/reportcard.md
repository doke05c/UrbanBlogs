---
title: 'SSTRP Transportation Report Card'
description: "The New York City region has been missing a centralized location where all regional transit can be evaluated. Finally, a solution is here."
---

# SSTRP Transportation Report Card

## The New York City region has been missing a centralized location where all regional transit can be evaluated. Finally, a solution is here.

<div id ="loading-page">
</div>

<div id ="report-card-content">

  <!-- grab dev state from package.json npm loader -->
  <script>
    window.NODE_ENV = "{{ env }}";
  </script>

  <!-- run database json -->
  <script type="module" src="/src/js/rc_script.js"></script>

  <!-- OTP CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start OTP chart -->
    <div class="chart">
      <h3> MTA Monthly Subway On-Time Performance Rate (%) </h3> <!-- #### -->
      <br>
      <!-- slider -->
      <div class="range_container">
          <div class="sliders_control">
              <input id="fromSlider" class="from_slider" type="range" min="0"/>
              <input id="toSlider" class="to_slider" type="range" min="0"/>
              <span id="fromLabel" class="slider_label"></span> 
              <span id="toLabel" class="slider_label"></span>
          </div>
      </div>
      <!-- -->
      <!-- date type select for otp -->
      <!--  -->
      <label for="subwayOTPDaySelect_date_range">Day Type:</label><br>
      <select id="subwayOTPDaySelect_date_range">
          <option value="Overall">Overall</option>
          <option value="Weekday">Weekday</option>
          <option value="Weekend">Weekend</option>
      </select>
      <!-- -->
      <!-- otp subway lines checkboxes -->
      <!--  -->
      <div class="checkbox-row">
        <div id="subway-otp-checkboxes_date_range" class="checkbox-grid"></div>
        <div class="side-controls">
          <div id="subway-otp-systemwide_date_range" class="systemwide-box"></div>
          <button type="button" id="subway-otp-clear-all_date_range" class="clear-all-btn">Clear All</button>
        </div>
      </div>
      <br>      
      <!--  -->
      <!-- otp chart visual -->
      <!--  -->
      <div id="monthly_subway_otp_from_jan_2015_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h5> Source: MTA Subway Terminal On-Time Performance: Beginning 2015 </h5> <!-- ##### -->
    <!-- end OTP chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start OTP interpretation -->
    <aside class="interpretation">
      <h2> Subway On-Time Performance Score </h2> <!-- ## -->
      <br>
      <div id="monthly_subway_otp_from_jan_2015_select_box_line_date_range_interpretation"></div>
      <h4> On-Time Performance is the percentage of scheduled train trips arriving at their terminals within 5 minutes of scheduled arrival time over a 24-hour period. <br> <br>
      Our on-time performance score is calculated as the average percentage on-time performance over the selected date range. We also show the on-time score for the latest month. <br> <br>
      Our grading rubric is the following: <br> <br>
      <style>
        table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }
        th, td {
          text-align: center;
          padding: 6px 8px;
          border: 1px solid #ddd;
        }
        tr {
          text-align: center;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>Grade</th>
            <th>Range</th>
            <th>Grade</th>
            <th>Range</th>
            <th>Grade</th>
            <th>Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A+</td>
            <td>97.5% and above</td>
            <td>A</td>
            <td>92.5% – 97.5%</td>
            <td>A-</td>
            <td>90% – 92.5%</td>
          </tr>
          <tr>
            <td>B+</td>
            <td>87.5% – 90%</td>
            <td>B</td>
            <td>82.5% – 87.5%</td>
            <td>B-</td>
            <td>80% – 82.5%</td>
          </tr>
          <tr>
            <td>C+</td>
            <td>77.5% – 80%</td>
            <td>C</td>
            <td>72.5% – 77.5%</td>
            <td>C-</td>
            <td>70% – 72.5%</td>
          </tr>
          <tr>
            <td>D+</td>
            <td>67.5% – 70%</td>
            <td>D</td>
            <td>62.5% – 67.5%</td>
            <td>D-</td>
            <td>60% – 62.5%</td>
          </tr>
          <tr>
            <td>F</td>
            <td colspan="5">below 60%</td>
          </tr>
        </tbody>
      </table>
      </h4> <!-- #### explains the methods of the scorecard -->
    <!-- end OTP interpretation -->
    </aside>
  </section>
  <!-- -->
  <!-- -->
  <br>
  <!-- RIDERSHIP CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start Ridership chart -->
    <div class="chart">
      <h3> MTA Monthly Ridership, Various Divisions </h3> <!-- #### -->
      <br>
      <!-- slider -->
      <div class="range_container">
          <div class="sliders_control">
              <input id="fromSlider_ridership" class="from_slider" type="range" min="0"/>
              <input id="toSlider_ridership" class="to_slider" type="range" min="0"/>
              <span id="fromLabel_ridership" class="slider_label"></span> 
              <span id="toLabel_ridership" class="slider_label"></span>
          </div>
      </div>
      <!-- -->
      <!-- -->
      <!-- ridership checkboxes -->
      <!--  -->
      <div class="checkbox-row">
        <div id="subway-ridership-checkboxes_date_range" class="checkbox-grid"></div>
        <div class="side-controls">
          <button type="button" id="ridership-clear-all_date_range" class="clear-all-btn">Clear All</button>
        </div>
      </div>
      <br>      
      <!--  -->
      <!-- ridership chart visual -->
      <!--  -->
      <div id="monthly_ridership_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h5> Source: MTA Daily Ridership and Traffic: Beginning 2020 </h5> <!-- ##### -->
    <!-- end ridership chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start ridership interpretation -->
    <aside class="interpretation">
      <h2> Ridership </h2> <!-- #### -->
      <br>
      <div id="monthly_ridership_select_box_line_date_range_interpretation"></div>
      <h4> Ridership is the total monthly ridership, based on self-reported data by agencies. <br> <br>
      Our ridership score is calculated by comparing ridership of the selected date range to the ridership of the agency over the same period in 2019. Likewise, the ridership score of the latest month is compared to the same month in 2019 for that agency. <br> <br>
      </h4> <!-- #### explains the methods of the scorecard -->
    <!-- end ridership interpretation -->
    </aside>
  </section>
  <!--  -->
  <!--  -->
  <br>
  <!-- BUS SPEED CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start OTP chart -->
    <div class="chart">
      <h3> MTA Monthly Bus Speeds (MPH) </h3> <!-- #### -->
      <br>
      <!-- slider -->
      <div class="range_container">
          <div class="sliders_control">
              <input id="fromSlider_bus_speed" class="from_slider" type="range" min="0"/>
              <input id="toSlider_bus_speed" class="to_slider" type="range" min="0"/>
              <span id="fromLabel_bus_speed" class="slider_label"></span> 
              <span id="toLabel_bus_speed" class="slider_label"></span>
          </div>
      </div>
      <!-- -->
      <!-- date type select for otp -->
      <!--  -->
      <label for="busSpeedDaySelect_date_range">Day Type:</label><br>
      <select id="busSpeedDaySelect_date_range">
          <option value="Overall">Overall</option>
          <option value="Weekday">Weekday</option>
          <option value="Weekend">Weekend</option>
      </select>
      <!-- -->
      <!-- otp subway lines checkboxes -->
      <!--  -->
      <div class="checkbox-row">
        <div class="dropdown-select">
          <button type="button" id="bus_speed_dropdown_toggle_date_range">Select routes ▾</button>
          <input type="text" id="bus_speed_route_filter_date_range" placeholder="Filter routes…" />
          <div id="bus_speed_checkboxes_date_range"></div>
        </div>
        <div class="side-controls">
          <div id="bus-speed-systemwide_date_range" class="systemwide-box"></div>
          <button type="button" id="bus-speed-clear-all_date_range" class="clear-all-btn">Clear All</button>
        </div>
      </div>
      <br>
      <!--  -->
      <!-- otp chart visual -->
      <!--  -->
      <div id="monthly_bus_speeds_from_jan_2015_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h5> Source: MTA Bus Speeds: Beginning 2015 </h5> <!-- ##### -->
    <!-- end OTP chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start OTP interpretation -->
    <aside class="interpretation">
      <h2> Bus Speeds </h2> <!-- #### -->
      <br>
      <div id="monthly_bus_speeds_from_jan_2015_select_box_line_date_range_interpretation"></div>
      <h4> Bus Speeds are calculated from distance traveled by a bus over its duration of time spent in service, based on self-reported bus data. <br> <br>
      Bus speeds are shown in MPH, and are also compared by the selected date range to the ridership of the agency over the same period in 2019. Likewise, the bus speeds of the latest month are compared to the same month in 2019. <br> <br>
      </h4>
    <!-- end OTP interpretation -->
    </aside>
  </section>
  <!-- -->
  <!-- -->
  <br>
  <!-- BUS SPEED CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start OTP chart -->
    <div class="chart">
      <h3> MTA Monthly Bus On-Time Performance Rate (%) </h3> <!-- #### -->
      <br>
      <!-- slider -->
      <div class="range_container">
          <div class="sliders_control">
              <input id="fromSlider_bus_otp" class="from_slider" type="range" min="0"/>
              <input id="toSlider_bus_otp" class="to_slider" type="range" min="0"/>
              <span id="fromLabel_bus_otp" class="slider_label"></span> 
              <span id="toLabel_bus_otp" class="slider_label"></span>
          </div>
      </div>
      <!-- -->
      <!-- date type select for otp -->
      <!--  -->
      <label for="busOTPTimeSelect_date_range">Day Type:</label><br>
      <select id="busOTPTimeSelect_date_range">
          <option value="All-Day">All-Day</option>
          <option value="Peak">Peak</option>
          <option value="Off-Peak">Off-Peak</option>
      </select>
      <!-- -->
      <!-- otp bus lines checkboxes -->
      <!--  -->
      <div class="checkbox-row">
        <div class="dropdown-select">
          <button type="button" id="bus_otp_dropdown_toggle_date_range">Select routes ▾</button>
          <input type="text" id="bus_otp_route_filter_date_range" placeholder="Filter routes…" />
          <div id="bus_otp_checkboxes_date_range"></div>
        </div>
        <div class="side-controls">
          <div id="bus-otp-systemwide_date_range" class="systemwide-box"></div>
          <button type="button" id="bus-otp-clear-all_date_range" class="clear-all-btn">Clear All</button>
        </div>
      </div>
      <br>
      <!--  -->
      <!-- otp chart visual -->
      <!--  -->
      <div id="monthly_bus_otp_from_aug_2017_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h5> Source: MTA Bus Customer Journey Time Performance: Beginning 2017 </h5> <!-- ##### -->
    <!-- end OTP chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start OTP interpretation -->
    <aside class="interpretation">
      <h2> Bus On-Time Performance Score </h2> <!-- #### -->
      <br>
      <div id="monthly_bus_otp_from_aug_2017_select_box_line_date_range_interpretation"></div>
      <h4> On-Time Performance is the percentage of scheduled bus trips arriving at their terminals within 5 minutes of scheduled arrival time over a 24-hour period. It is equivalent to the percentage of customer trips with Additional Bus Stop Time (ABST) + Additional Travel Time (ATT) less than 5 minutes. <br> <br>
      Our on-time performance score is calculated as the average percentage on-time performance over the selected date range. We also show the on-time score for the latest month. <br> <br>
      Our grading rubric is the following: <br> <br>
      <style>
        table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }
        th, td {
          text-align: center;
          padding: 6px 8px;
          border: 1px solid #ddd;
        }
        tr {
          text-align: center;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>Grade</th>
            <th>Range</th>
            <th>Grade</th>
            <th>Range</th>
            <th>Grade</th>
            <th>Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A+</td>
            <td>97.5% and above</td>
            <td>A</td>
            <td>92.5% – 97.5%</td>
            <td>A-</td>
            <td>90% – 92.5%</td>
          </tr>
          <tr>
            <td>B+</td>
            <td>87.5% – 90%</td>
            <td>B</td>
            <td>82.5% – 87.5%</td>
            <td>B-</td>
            <td>80% – 82.5%</td>
          </tr>
          <tr>
            <td>C+</td>
            <td>77.5% – 80%</td>
            <td>C</td>
            <td>72.5% – 77.5%</td>
            <td>C-</td>
            <td>70% – 72.5%</td>
          </tr>
          <tr>
            <td>D+</td>
            <td>67.5% – 70%</td>
            <td>D</td>
            <td>62.5% – 67.5%</td>
            <td>D-</td>
            <td>60% – 62.5%</td>
          </tr>
          <tr>
            <td>F</td>
            <td colspan="5">below 60%</td>
          </tr>
        </tbody>
      </table>
      </h4> <!-- #### explains the methods of the scorecard -->
    <!-- end OTP interpretation -->
    </aside>
  </section>
  <!-- -->
  <!-- -->
  <br>




<!-- end report card content -->
</div>