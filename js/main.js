
// CONSTANTS.
var margin = { top: 50, right: 10, bottom: 10, left: 250 },
    width = 50*rect_size,
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
var svg = d3.select("#GAME").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px").append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// Main SVG.
var label_svg = d3.select("#left_panel").append("svg")
    .attr('y',100)
    .attr("width", 100)
    .attr("height", 900)
    // .call(d3.behavior.zoom().scaleExtent([1, 2]).on("zoom", zoom));

// function zoom() {
//   console.log(d3.event.translate);
//   svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
// }

var temp_path = {}

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

transc_names = ['Disease_Signatures_from_GEO_down', 'ENCODE_Histone_Modifications_2015', 'ESCAPE', 'Mouse_Gene_Atlas', 'Virus_Perturbations_from_GEO_down']
// Get random sample from json folder.
random = Math.floor(Math.random() * transc_names.length);
var path = "json/from_enrichr/";
path += transc_names[random];
path += '.json'
var width = 0;

svg.append("text")
  .attr("class", "library1")
  .attr("x", 0)
  .attr("y", -20)
  .attr("dy", ".32em").attr("text-anchor", "end")
  .attr("font-size", 15)
  .attr("fill", "white")
  .text('LIBRARY:  ');

svg.append("text")
  .attr("class", "library2")
  .attr("x", 0)
  .attr("y", -20)
  .attr("dy", ".32em").attr("text-anchor", "front")
  .attr("font-size", 25)
  .attr("fill", "skyblue")
  .text(transc_names[random])
  .style("cursor", "pointer")
  .on('mouseover', function () { d3.select('.library2').style('fill', 'blue'); })
  .on('mouseout', function() { d3.select('.library2').style('fill', 'skyblue'); })
  .on("click", function() { window.open("http://amp.pharm.mssm.edu/Enrichr/#stats"); });




// d3.json("json/perfect_example.json", function(sample) {
// d3.json("json/Phosphatase_Substrates_SAMPLE.json", function(sample) {
d3.json(path, function(sample) {

  // Alphabetically order the genes.
  var term = Object.keys(sample);
  for (var i = 0; i < term.length; i++) {
    sample[term[i]].sort();
  }

  // Processes the visualizing of the "sample"
  make_viz(sample);
});
