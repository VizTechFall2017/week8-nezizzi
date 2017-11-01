var width = document.getElementById('svg').clientWidth;
var height =  document.getElementById('svg').clientHeight;

//console.log(width, height);

var marginLeft = 100;
var marginTop = 100;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');


var albersProjection = d3.geoAlbersUsa()
    .scale(900)
    .translate([(width/2), (height/2)]);

var path = d3.geoPath()
    .projection(albersProjection);

//import the data from the .csv file
d3.json('./cb_2016_us_state_20m.json', function(dataIn){
    //console.log(dataIn)

    svg.selectAll('path')
        .data(dataIn.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', 'gainsboro')
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
        //.attr('mouseover', function(d){console.log(d.properties.NAME)});

svg.selectAll('circle')
    .data([{lat:42.3601, long:-71.0589}])
    .enter()
    .append('circle')
    .attr('cx', function(d){return albersProjection([d.long, d.lat])[0]})
    .attr('cy', function(d){return albersProjection([d.long, d.lat])[1]})
    .attr('r', 10)
    .attr('fill', 'purple');


});



