
// CONSTANTS.
var margin = { top: 50, right: 10, bottom: 10, left: 250 },
    width = 700,
    height = 800,
    trans_duration = 2000,    // ms
    default_duration = 300,   // ms
    scale_xy = {
      "x": d3.scale.ordinal().rangeBands([0, height]),
      "y": d3.scale.ordinal().rangeBands([0, width])
    },
    matrix = [],
    curr_mat = [],
    curr_score = 0,
    prev_score = 0;

// Main SVG.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px").append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// global variables declared.
var orders,
    selected_index_1,
    selected_index_2,
    current_index_order,
    scale_color,
    genes_unq,
    undefined_ind,
    duplicate_xy_list,
    dup_temp;

// global variable declared and initialized.
var curr_duration = default_duration,
    nrow = 0,
    ncol = 0,
    counter = 0,
    toggle_hl = 0,
    click_state = 0;


// Get random sample from json folder.
random = Math.floor(Math.random() * 59);
var path = "json/from_enrichr/";
path += file_list[random];
path += '.json'

svg.append("text")
  .attr("class", "library")
  .attr("x", 0)
  .attr("y", -20)
  .attr("dy", ".32em").attr("text-anchor", "end")
  .attr("font-size", 15)
  .attr("fill", "white")
  .text('LIBRARY:  ');

svg.append("text")
  .attr("class", "library")
  .attr("x", 0)
  .attr("y", -20)
  .attr("dy", ".32em").attr("text-anchor", "front")
  .attr("font-size", 25)
  .attr("fill", "skyblue")
  .text(file_list[random]);
  // .attr("xlink:href", "http://en.wikipedia.org/wiki/");

// d3.json("json/perfect_example.json", function(sample) {
d3.json("json/Phosphatase_Substrates_SAMPLE.json", function(sample) {
// d3.json(path, function(sample) {

  // Processes the visualizing of the "sample"
  make_viz(sample);
});
