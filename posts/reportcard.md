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
              <input id="fromSlider" type="range" min="0"/>
              <input id="toSlider" type="range" min="0"/> 
              <span id="fromLabel"></span> <span id="toLabel"></span>
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




<!-- end report card content -->
</div>