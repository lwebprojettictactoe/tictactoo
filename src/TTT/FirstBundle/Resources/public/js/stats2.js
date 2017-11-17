         google.charts.load('current', {'packages':['bar']});
         google.charts.setOnLoadCallback(drawChart2);
         
             
      function drawChart2() {
        var data2 = google.visualization.arrayToDataTable([
          ['','Parties Jouées','Points Maximum', 'Points gagnés'],
          ['Points',nbParties, nbParties*3, points],
        ]);

        var options2 = {
          chart: {
            width: 150,
          },
        };
    
         
         var chart2 = new google.charts.Bar(document.getElementById('PointsTotalChart'));
         chart2.draw(data2, google.charts.Bar.convertOptions(options2));
     }

