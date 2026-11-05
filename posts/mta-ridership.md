---
title: 'SSTRP Transportation Report Card: MTA Overall Ridership'
description: "Monthly ridership statistics across MTA divisions."
hideBackLink: true
---

# MTA Overall Ridership

[← Back to Transportation Report Card](/posts/reportcard/)

<div id ="loading-page">
</div>

<div id ="report-card-content">

  <!-- grab dev state from package.json npm loader -->
  <script>
    window.NODE_ENV = "{{ env }}";
    window.REPORT_CARD_PAGE = "mta-ridership";
  </script>

  <!-- run database json -->
  <script type="module" src="/src/js/rc_script.js"></script>

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
      <h2> MTA Ridership </h2> <!-- #### -->
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

<!-- end report card content -->
</div>

[← Back to Transportation Report Card](/posts/reportcard/)
