
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

transc_names = ['ChEA', 'TRANSFAC_and_JASPAR_PWMs', 'Epigenomics_Roadmap_HM_ChIP-seq', 'ENCODE_TF_ChIP-seq_2015']
// Get random sample from json folder.
random = Math.floor(Math.random() * transc_names.length);
var path = "json/from_enrichr_transcription/";
path += transc_names[random];
path += '.json'

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
  // .attr("xlink:href", "http://en.wikipedia.org/wiki/");

// d3.json("json/perfect_example.json", function(sample) {
d3.json("json/Phosphatase_Substrates_SAMPLE.json", function(sample) {
// d3.json(path, function(sample) {

  // Alphabetically order the genes.
  var term = Object.keys(sample);
  for (var i = 0; i < term.length; i++) {
    sample[term[i]].sort();
  }

  // Processes the visualizing of the "sample"
  make_viz(sample);
});
