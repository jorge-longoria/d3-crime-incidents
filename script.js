let source = "https://data.austintexas.gov/resource/rkrg-9tez.json";

d3.json(source, function(data) {
  tree = d3.nest()
    .key( d => d['crime_type'] )
    .rollup( leaves => leaves.length )
    .entries(data)
    .sort( (a,b) => d3.descending(a.value, b.value) );

  console.log(tree[0]);

  let margin = {
    top:    20,
    right:  20,
    bottom: 60,
    left:   40
  };

  let exteriorWidth  = 550,
      exteriorHeight = 250;

  let interiorWidth  = exteriorWidth - margin.left - margin.right,
      interiorHeight = exteriorHeight - margin.top - margin.bottom;

  let colorPalette = [
    "#98abc5", "#8a89a6",
    "#7b6888", "#6b486b",
    "#a05d56", "#d0743c",
    "#ff8c00",
  ];

  let svg =
    d3.select("#bar")
      .append("svg")
        .attr("width", exteriorWidth)
        .attr("height", exteriorHeight)
      .append("g")
  .attr("transform", translate(margin.left, margin.top));

  //tilde is a dummy character.
  let x_values = tree.map(d => d.key.replace("/", "/~") )
    .filter( (d,i) => i < 5 );

  let y_values = tree.map( d => d.value )
    .filter( (d,i) => i < 5 );

  let x =
    d3.scaleBand()
      .domain( x_values )
      .rangeRound( [0, interiorWidth] )
  .paddingInner(0.1);

  let y =
  d3.scaleLinear()
    .domain( [0, d3.max(y_values)] ).nice()
    .rangeRound( [interiorHeight, 0] );

  svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", translate(0, interiorHeight))
  .call(d3.axisBottom(x))
    .selectAll("text")
  .call(wrap, x.bandwidth());

  svg.append("g")
     .attr("class", "axis axis--y")
   .call(d3.axisLeft(y).ticks( x_values.length ))
   .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("text-anchor", "end")
   .text("Axis Title")
     .style("fill", "black")
     .style("font-size", 10)
  .style("font-family", "sans-serif");


  svg.selectAll(".bar")
      .data( y_values )
   .enter().append("rect")
     .attr("class", "bar")
     .attr("x", (d,i) => x( x_values[i] ))
     .attr("y", (d) => y(d))
     .attr("width", x.bandwidth())
     .attr("height", (d) => interiorHeight - y(d))
     .attr("fill", "#05A")
   .append("title")
  .text((d) => d);

  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+|\~/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", dy + "em");

      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
        }
      }
    });
  }

  function translate(x, y=0) {
    return "translate({x}, {y})"
            .replace("{x}", x)
            .replace("{y}", y);
  }
});
/*
  address: "7500 BLOCK DELAFIELD LN"
  crime_type: "DIRECTED PATROL"
  date: "2016-02-04T02:00:00.000"
  incident_report_number: "20165005110"
  time: "1432"
*/
