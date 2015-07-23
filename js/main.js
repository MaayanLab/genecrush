////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global CONSTANTS.
var margin = { top: 50, right: 50, bottom: 50, left: 80 },
    width = 600,
    height = 800,
    trans_duration = 2000,    // ms
    default_duration = 300,   // ms
    scale_X = d3.scale.ordinal().rangeBands([0, width]),
    scale_Y = d3.scale.ordinal().rangeBands([0, height]),
    matrix = [],
    curr_mat = [],
    unq_gene_names = [],
    orig_nav_data = [],
    curr_nav_data = [],
    nrow = 0,
    ncol = 0,
    curr_score = 0,
    prev_score = 0,
    ncol_shown = 10,
    nav_width = width,
    nav_height = 150 - margin.top - margin.bottom,
    nav_scale_X = d3.scale.linear().range([0, nav_width]),
    nav_scale_Y = d3.scale.linear().range([0, nav_height]),
    curr_duration = default_duration,
    counter = 0,
    toggle_hl = 0,
    toggle_unq = 0,
    click_state = 0;

// Global vairables.
var orders,
    selected_index_1,
    selected_index_2,
    current_index_order,
    scale_color,
    genes_unq,
    undefined_ind,
    duplicate_xy_list,
    dup_temp,
    nav_line,
    x_axis,
    y_axis;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SVG's
var svg = d3.select("#main_game").append("svg").attr('class', 'svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .style("margin-left", +margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // .call(zoom);

var nav_svg = d3.select('#main_game').append('svg').attr('class', 'navigator')
    .attr('width', nav_width + margin.left + margin.right)
    .attr('height', nav_height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Select Random json file.
random = Math.floor(Math.random() * 71);
var path = "json/from_random_crowd_sourcing/";
path += random;
path += '.json'

// Reference them to enrichr library
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
  .text(random)
  .style("cursor", "pointer")
  .on('mouseover', function () { d3.select('.library2').style('fill', 'blue'); })
  .on('mouseout', function() { d3.select('.library2').style('fill', 'skyblue'); })
  .on("click", function() { window.open("http://amp.pharm.mssm.edu/Enrichr/#stats"); });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Read in the proper json file.

// d3.json("json/perfect_example.json", function(sample) {
// d3.json("json/Phosphatase_Substrates_SAMPLE.json", function(sample) {
// d3.json("json/from_enrichr/ENCODE_Histone_Modifications_2015.json", function(sample) {
d3.json(path, function(sample) {

  // Processes the visualizing of the "json"
  make_viz(sample);
});
