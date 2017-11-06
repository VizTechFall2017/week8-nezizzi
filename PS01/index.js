var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


//set up the projection for the map
var albersProjection = d3.geoAlbersUsa()  //tell it which projection to use
    .scale(700)                           //tell it how big the map should be
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels

var stateLookup = d3.map();

var colorScale = d3.scaleLinear().range(['white','blue']);


svg.append('text')
    .text('Places I have Lived')
    .attr('transform','translate(20, 0)');

queue()
    .defer(d3.json, "./cb_2016_us_state_20m.json")
    .defer(d3.csv, "./statePop.csv")
    .await(function(err, mapData, populationData){


    populationData.forEach(function(d){
        stateLookup.set(d.name, d.population);
    });


    colorScale.domain([0, d3.max(populationData.map(function(d){return +d.population}))]);

    svg.selectAll("path")               //make empty selection
        .data(mapData.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "feature")
        .attr('fill',function(d){
            return colorScale(stateLookup.get(d.properties.NAME));
        })
        .attr('stroke','white')
        .attr('stroke-width',.2);

        svg.selectAll('circle')
            .data([{lat:42.3601, long:-71.0589}])
            .enter()
            .append('circle')
            .attr('cx', function(d){return albersProjection([d.long, d.lat])[0]})
            .attr('cy', function(d){return albersProjection([d.long, d.lat])[1]})
            .attr('r', 10)
            .attr('fill', 'purple')
            .on("mouseover", function(d) {
                div.transition()
                    .duration(10)
                    .style("opacity", .9);
                div.html('Boston, MA')
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(1000)
                    .style("opacity", 0);
            });

        svg.selectAll('circle2')
            .data([{lat:42.8864, long:-78.8784}])
            .enter()
            .append('circle')
            .attr('cx', function(d){return albersProjection([d.long, d.lat])[0]})
            .attr('cy', function(d){return albersProjection([d.long, d.lat])[1]})
            .attr('r', 5)
            .attr('fill', 'grey');

        svg.selectAll('circle3')
            .data([{lat:43.1610, long:-77.6109}])
            .enter()
            .append('circle')
            .attr('cx', function(d){return albersProjection([d.long, d.lat])[0]})
            .attr('cy', function(d){return albersProjection([d.long, d.lat])[1]})
            .attr('r', 5)
            .attr('fill', 'blue');



    });



