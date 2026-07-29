---
title: 'SSTRP Transportation Report Card'
description: "The New York City region has been missing a centralized location where all regional transit can be evaluated. Finally, a solution is here."
---

## SSTRP Transportation Report Card

### The New York City region has been missing a centralized location where all regional transit can be evaluated. Finally, a solution is here.

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
      <div id="subway-otp-checkboxes_date_range"></div>
      <br>
      <!--  -->
      <!-- otp chart visual -->
      <!--  -->
      <h4> MTA Monthly Subway On-Time Performance Rate (%), Custom Date Range, Line: </h4> <!-- #### -->
      <br>
      <div id="monthly_subway_otp_from_jan_2015_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    <!-- end OTP chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start OTP interpretation -->
    <aside class="interpretation">
      <div id="monthly_subway_otp_from_jan_2015_select_box_line_date_range_interpretation"></div>
    <!-- end OTP interpretation -->
    </aside>
  </section>
  <!-- -->
  <!-- -->
    <!-- RIDERSHIP CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start Ridership chart -->
    <div class="chart">
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
      <div id="subway-ridership-checkboxes_date_range"></div>
      <br>
      <!--  -->
      <!-- ridership chart visual -->
      <!--  -->
      <h4> MTA Monthly Ridership, Custom Divisions, Custom Date Range, Line: </h4> <!-- #### -->
      <br>
      <div id="monthly_ridership_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    <!-- end ridership chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start ridership interpretation -->
    <aside class="interpretation">
      <div id="monthly_ridership_select_box_line_date_range_interpretation"></div>
    <!-- end ridership interpretation -->
    </aside>
  </section>
  <!--  -->
  <!--  -->
  <!-- BUS SPEED CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start OTP chart -->
    <div class="chart">
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
      <div class="dropdown-select">
        <button type="button" id="bus_speed_dropdown_toggle_date_range">Select routes ▾</button>
        <input type="text" id="bus_speed_route_filter_date_range" placeholder="Filter routes…" />
        <div id="bus_speed_checkboxes_date_range"></div>
      </div>
      <br>
      <!--  -->
      <!-- otp chart visual -->
      <!--  -->
      <h4> MTA Monthly Bus Speeds (MPH), Selected Routes, Custom Date Range, Line: </h4> <!-- #### -->
      <br>
      <div id="monthly_bus_speeds_from_jan_2015_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
    <!-- end OTP chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start OTP interpretation -->
    <aside class="interpretation">
      <div id="monthly_bus_speeds_from_jan_2015_select_box_line_date_range_interpretation"></div>
    <!-- end OTP interpretation -->
    </aside>
  </section>
  <!-- -->
  <!-- -->




<!-- end report card content -->
</div>