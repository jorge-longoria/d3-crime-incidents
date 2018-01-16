let source = "https://data.austintexas.gov/resource/rkrg-9tez.json";

d3.json(source, function(data) {
  console.log(data[0]);
});

/*
  address: "7500 BLOCK DELAFIELD LN"
  crime_type: "DIRECTED PATROL"
  date: "2016-02-04T02:00:00.000"
  incident_report_number: "20165005110"
  time: "1432"
*/
