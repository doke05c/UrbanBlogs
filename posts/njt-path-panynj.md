---
title: 'SSTRP Transportation Report Card: NJT, PATH & PANYNJ'
description: "Ridership and crossing statistics for NJ TRANSIT, PATH, and Port Authority bridges and tunnels."
---

# NJT, PATH & PANYNJ

[← Back to Transportation Report Card](/posts/reportcard/)

<div id ="loading-page">
</div>

<div id ="report-card-content">

  <!-- grab dev state from package.json npm loader -->
  <script>
    window.NODE_ENV = "{{ env }}";
    window.REPORT_CARD_PAGE = "njt-path-panynj";
  </script>

  <!-- run database json -->
  <script type="module" src="/src/js/rc_script.js"></script>

  <!-- NJT RIDERSHIP CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start NJT Ridership chart -->
    <div class="chart">
      <h3> NJT Monthly Ridership, Various Divisions </h3> <!-- #### -->
      <br>
      <!-- slider -->
      <div class="range_container">
          <div class="sliders_control">
              <input id="fromSlider_NJT_ridership" class="from_slider" type="range" min="0"/>
              <input id="toSlider_NJT_ridership" class="to_slider" type="range" min="0"/>
              <span id="fromLabel_NJT_ridership" class="slider_label"></span> 
              <span id="toLabel_NJT_ridership" class="slider_label"></span>
          </div>
      </div>
      <!-- -->
      <!-- -->
      <!-- ridership checkboxes -->
      <!--  -->
      <div class="checkbox-row">
        <div id="njt-ridership-checkboxes_date_range" class="checkbox-grid"></div>
        <div class="side-controls">
          <button type="button" id="njt-ridership-clear-all_date_range" class="clear-all-btn">Clear All</button>
        </div>
      </div>
      <br>      
      <!--  -->
      <!-- ridership chart visual -->
      <!--  -->
      <div id="monthly_njt_ridership_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h5> Source: Federal Transit Administration: National Transit Database - Complete Monthly Ridership </h5> <!-- ##### -->
    <!-- end ridership chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start ridership interpretation -->
    <aside class="interpretation">
      <h2> NJT Ridership </h2> <!-- #### -->
      <br>
      <div id="monthly_njt_ridership_select_box_line_date_range_interpretation"></div>
      <h4> Ridership is the total monthly ridership, based on self-reported data by agencies. <br> <br>
      Our ridership score is calculated by comparing ridership of the selected date range to the ridership of the agency over the same period in 2019. Likewise, the ridership score of the latest month is compared to the same month in 2019 for that agency. <br> <br>
      </h4> <!-- #### explains the methods of the scorecard -->
    <!-- end ridership interpretation -->
    </aside>
  </section>
  <!--  -->
  <!--  -->
  <br>
  <!-- PATH MONTHLY RIDERSHIP CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start PATH MONTHLY RIDERSHIP chart -->
    <div class="chart">
      <h3> PATH Monthly Ridership</h3> <!-- #### -->
      <br>
      <!-- slider -->
      <div class="range_container">
          <div class="sliders_control">
              <input id="fromSlider_path_monthly_ridership" class="from_slider" type="range" min="0"/>
              <input id="toSlider_path_monthly_ridership" class="to_slider" type="range" min="0"/>
              <span id="fromLabel_path_monthly_ridership" class="slider_label"></span> 
              <span id="toLabel_path_monthly_ridership" class="slider_label"></span>
          </div>
      </div>
      <!-- -->
      <!-- date type select for path ridership -->
      <!--  -->
      <label for="pathMonthlyRidershipDaySelect_date_range">Day Type:</label><br>
      <select id="pathMonthlyRidershipDaySelect_date_range">
          <option value="Overall">Month Total</option>
          <option value="Weekday">Weekday Average</option>
          <option value="Saturday">Saturday Average</option>
          <option value="Sunday">Sunday Average</option>
          <option value="Holiday">Holiday Average</option>
      </select>
      <!-- -->
      <!-- path-monthly-ridership lines checkboxes -->
      <!--  -->
      <div class="checkbox-row">
        <div id="path-monthly-ridership-checkboxes_date_range" class="checkbox-grid"></div>
        <div class="side-controls">
          <div id="path-monthly-ridership-systemwide_date_range" class="systemwide-box"></div>
          <button type="button" id="path-monthly-ridership-clear-all_date_range" class="clear-all-btn">Clear All</button>
        </div>
      </div>
      <br>      
      <!--  -->
      <!-- path monthly ridership chart visual -->
      <!--  -->
      <div id="monthly_path_ridership_from_jan_2013_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h5> Source: Port Authority, PATH Monthly Ridership Stats; 
      <br> PDF Parser Algorithm by Ryan Williams, Hudson County Complete Streets </h5> <!-- ##### -->
    <!-- path monthly ridership chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start path monthly ridership interpretation -->
    <aside class="interpretation">
      <h2> PATH Ridership </h2> <!-- ## -->
      <br>
      <div id="monthly_path_ridership_from_jan_2013_select_box_line_date_range_interpretation"></div>
     <h4> Ridership is the total monthly ridership, based on self-reported data by agencies. <br> <br>
      Our ridership score is calculated by comparing ridership of the selected date range to the ridership of the agency over the same period in 2019. Likewise, the ridership score of the latest month is compared to the same month in 2019 for that agency. <br> <br>
      </h4> <!-- #### explains the methods of the scorecard -->
    <!-- end path monthly ridership interpretation -->
    </aside>
  </section>
  <!-- -->
  <!-- -->
  <br>
  <!-- PANYNJ MONTHLY CROSSING CHART + INTERPRETATION -->
  <section class="analysis">
    <!-- start PANYNJ MONTHLY CROSSING chart -->
    <div class="chart">
      <h3> PANYNJ Bridge & Tunnel Crossings</h3> <!-- #### -->
      <br>
      <!-- slider -->
      <div class="range_container">
          <div class="sliders_control">
              <input id="fromSlider_panynj_monthly_crossings" class="from_slider" type="range" min="0"/>
              <input id="toSlider_panynj_monthly_crossings" class="to_slider" type="range" min="0"/>
              <span id="fromLabel_panynj_monthly_crossings" class="slider_label"></span> 
              <span id="toLabel_panynj_monthly_crossings" class="slider_label"></span>
          </div>
      </div>
      <!-- -->
      <!-- vehicle type select for path ridership -->
      <!--  -->
      <label for="panynjMonthlyCrossingsVehicleSelect_date_range">Vehicle Type:</label><br>
      <select id="panynjMonthlyCrossingsVehicleSelect_date_range">
          <option value="Total Vehicles">All Vehicle Total</option>
          <option value="Automobiles">Automobiles</option>
          <option value="Buses">Buses</option>
          <option value="Trucks">Trucks</option>
      </select>
      <!-- -->
      <!-- panynj-monthly-crossing lines checkboxes -->
      <!--  -->
      <div class="checkbox-row">
        <div id="panynj-monthly-crossings-checkboxes_date_range" class="checkbox-grid"></div>
        <div class="side-controls">
          <div id="panynj-monthly-crossings-systemwide_date_range" class="systemwide-box"></div>
          <button type="button" id="panynj-monthly-crossings-clear-all_date_range" class="clear-all-btn">Clear All</button>
        </div>
      </div>
      <br>      
      <!--  -->
      <!-- panynj monthly crossings chart visual -->
      <!--  -->
      <div id="monthly_panynj_crossings_from_jan_2011_select_box_line_date_range"></div>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <br>
      <h5> Source: Port Authority, Monthly Traffic & Volume Stats; 
      <br> PDF Parser Algorithm by Ryan Williams, Hudson County Complete Streets </h5> <!-- ##### -->
    <!-- panynj monthly crossings chart -->
    <!--  -->
    </div>
    <!--  -->
    <!-- start panynj monthly crossings interpretation -->
    <aside class="interpretation">
      <h2> PANYNJ Traffic Crossing Counts </h2> <!-- ## -->
      <br>
      <div id="monthly_panynj_monthly_crossings_from_jan_2011_select_box_line_date_range_interpretation"></div>
     <h4> Traffic crossings counts are the total number of crossings, based on self-reported data by agencies. <br> <br>
      Our crossings score is calculated by comparing crossing counts of the selected date range to the crossing counts of the facility over the same period in 2019. Likewise, the crossing count score of the latest month is compared to the same month in 2019 for that agency. <br> <br>
      </h4> <!-- #### explains the methods of the scorecard -->
    <!-- end panynj monthly crossings interpretation -->
    </aside>
  </section>
  <!-- -->
  <!-- -->
  <br>

<!-- end report card content -->
</div>

[← Back to Transportation Report Card](/posts/reportcard/)
