$(function () {

  'use strict';

  // -----------------------
  // - MONTHLY SALES CHART -
  // -----------------------

  // Get context with jQuery - using jQuery's .get() method.
  var salesChartCanvas = $('#monthlyPlayedGameChart').get(0).getContext('2d');
  // This will get the first returned node in the jQuery collection.
  var salesChart       = new Chart(salesChartCanvas);

  var theMonths = ["January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October", "November", "December"];
  var labels =[];
  for (var i = 0; i <= new Date().getMonth(); i++) {
    labels.push(theMonths[i]);
  }

  var host = window.location.origin;
  $.ajax({
    type: 'GET',
    url :host + "/dashboard/getMonthlyPlayedGameChart",
    success:function(res){

    },
    complete: function(data){
      var salesChartData = {

        labels  : labels,
        datasets: [
          {
            label               : 'Game Played By Player',
            fillColor           : 'rgba(60,141,188,0.9)',
            strokeColor         : 'rgba(60,141,188,0.8)',
            pointColor          : '#3b8bba',
            pointStrokeColor    : 'rgba(60,141,188,1)',
            pointHighlightFill  : '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data                : data.responseJSON
          }
        ]
      };

      var salesChartOptions = {
        // Boolean - If we should show the scale at all
        showScale               : true,
        // Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines      : false,
        // String - Colour of the grid lines
        scaleGridLineColor      : 'rgba(0,0,0,.05)',
        // Number - Width of the grid lines
        scaleGridLineWidth      : 1,
        // Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        // Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines  : true,
        // Boolean - Whether the line is curved between points
        bezierCurve             : true,
        // Number - Tension of the bezier curve between points
        bezierCurveTension      : 0.3,
        // Boolean - Whether to show a dot for each point
        pointDot                : false,
        // Number - Radius of each point dot in pixels
        pointDotRadius          : 4,
        // Number - Pixel width of point dot stroke
        pointDotStrokeWidth     : 1,
        // Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,
        // Boolean - Whether to show a stroke for datasets
        datasetStroke           : true,
        // Number - Pixel width of dataset stroke
        datasetStrokeWidth      : 2,
        // Boolean - Whether to fill the dataset with a color
        datasetFill             : true,
        // String - A legend template
        legendTemplate          : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<datasets.length; i++){%><li><span style=\'background-color:<%=datasets[i].lineColor%>\'></span><%=datasets[i].label%></li><%}%></ul>',
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio     : true,
        // Boolean - whether to make the chart responsive to window resizing
        responsive              : true
      };

      // Create the line chart
      salesChart.Line(salesChartData, salesChartOptions);
      
    }
  })

  // -------------
  // - PIE CHART -
  // -------------
  // Get context with jQuery - using jQuery's .get() method.
  $.ajax({
    type: 'GET',
    url :host + "/dashboard/getGameUsageChart",
    success:function(res){
      //console.log(res);
    },
    complete: function(data){
      
      var pieChartCanvas = $('#gameUsages').get(0).getContext('2d');
      var pieChart       = new Chart(pieChartCanvas);
      let webCount=0;
      let androidCount=0;
      let iosCount=0;
      if(data.responseJSON.web.length > 0){ webCount=data.responseJSON.web[0].count };
      if(data.responseJSON.android.length > 0){ androidCount=data.responseJSON.android[0].count };
      if(data.responseJSON.ios.length > 0){iosCount=data.responseJSON.ios[0].count };
      
      var PieData        = [
        {
          value    : webCount,
          color    : '#f56954',
          highlight: '#f56954',
          label    : 'Web'
        },
        {
          value    : androidCount,
          color    : '#00a65a',
          highlight: '#00a65a',
          label    : 'Android'
        },
        {
          value    : iosCount,
          color    : '#f39c12',
          highlight: '#f39c12',
          label    : 'IOS'
        },
        
      ];
      var pieOptions     = {
        // Boolean - Whether we should show a stroke on each segment
        segmentShowStroke    : true,
        // String - The colour of each segment stroke
        segmentStrokeColor   : '#fff',
        // Number - The width of each segment stroke
        segmentStrokeWidth   : 1,
        // Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        // Number - Amount of animation steps
        animationSteps       : 100,
        // String - Animation easing effect
        animationEasing      : 'easeOutBounce',
        // Boolean - Whether we animate the rotation of the Doughnut
        animateRotate        : true,
        // Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale         : false,
        // Boolean - whether to make the chart responsive to window resizing
        responsive           : true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio  : false,
        // String - A legend template
        legendTemplate       : '<ul class=\'<%=name.toLowerCase()%>-legend\'><% for (var i=0; i<segments.length; i++){%><li><span style=\'background-color:<%=segments[i].fillColor%>\'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
        // String - A tooltip template
        tooltipTemplate      : '<%=value %> <%=label%> users'
      };
      // Create pie or douhnut chart
      // You can switch between pie and douhnut using the method below.
      pieChart.Doughnut(PieData, pieOptions);

    }
  })
 
  // -----------------
  // - END PIE CHART -
  // -----------------

  
});
