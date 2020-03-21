var trace1 = {
    x: [2, 2, 5, 7, 8, 9, 10, 12, 13],
    type: 'box',
    name: 'Ranny'
  };
  
  var trace2 = {
    x: [2, 2, 5, 7, 8, 9, 10, 12, 13],
    type: 'box',
    name: 'Sunny'
  };

  var trace3 = {
    x: [2, 2, 5, 7, 8, 9, 10, 12, 13],
    type: 'box',
    name: 'Overwatch'
  };
  
  var data = [trace1, trace2, trace3];
  
  var layout = {
    title: 'Box Plot'
  };
  
  Plotly.newPlot('boxplot', data, layout);
  