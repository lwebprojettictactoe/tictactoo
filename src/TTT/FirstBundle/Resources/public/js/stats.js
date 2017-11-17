 google.charts.load("current", {packages:["corechart"]});
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Stats', 'Parties'],
          ['Victoires', stats.victoires],
          ['Défaites', stats.defaites],
          ['Egalités',stats.egalites],
        ]);

        var options = {
          titleTextStyle:{ fontSize: 35 } ,
          pieHole: 0.4,
          pieSliceText: 'value',       
        };
       
        var chart = new google.visualization.PieChart(document.getElementById('donutchart')); 
        chart.draw(data, options);
    }
  
