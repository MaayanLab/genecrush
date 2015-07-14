
// CONSTANTS.
var margin = { top: 20, right: 0, bottom: 10, left: 250 },
    width = 750,
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




d3.json("json/Phosphatase_Substrates_SAMPLE.json", function(sample) {

  // Processes the visualizing of the "sample"
  make_viz(sample);
});
