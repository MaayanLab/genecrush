////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global CONSTANTS.
var margin = { top: 50, right: 10, bottom: 5, left: 7 },
    width = 650,
    height = 800,
    trans_duration = 2000,    // ms
    default_duration = 300,   // ms
    scale_X = d3.scale.ordinal().rangeBands([0, width]),
    scale_Y = d3.scale.ordinal().rangeBands([0, height]),
    matrix = [],
    terms = [],
    curr_mat = [],
    unq_gene_names = [],
    orig_nav_data = [],
    orig_nav_data_rep = [],
    curr_nav_data = [],
    nrow = 0,
    ncol = 0,
    curr_score = 0,
    prev_score = 0,
    ncol_shown = 10,
    curr_cell_width = 0,
    nav_width = width,
    nav_height = 40,
    nav_scale_X = d3.scale.linear().range([0, nav_width]),
    svg_scale_X = d3.scale.linear().range([0, width]),
    nav_scale_Y = d3.scale.linear().range([0, nav_height]),
    nav_min = 0,
    nav_max = 0,
    curr_duration = default_duration,
    counter = 0,
    toggle_hl = 1,
    toggle_unq = 0,
    click_state = 0,
    played_whole_game = false,
    g_logged_in_status = false,
    user = {},
    g_id = {},
    toggle_sound = true,
    toggle_music = false,
    found_modules= {};


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
    y_axis,
    fix_bug_status;


///////////////////////////////////////////// svgs  ////////////////////////////////////////////////////////////////////
// main svg
var svg = d3.select("#main_game").append("svg").attr('class', 'svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .style("margin-left", +margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// svg for labels
var label_svg = d3.select('.left').append('svg').attr('class', 'label_svg')
    .attr("width", 100)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(0,' + margin.top + ")")

// svg for navigator
var nav_svg = d3.select('#main_game').append('svg').attr('class', 'navigator')
    .attr('width', nav_width + margin.left + margin.right)
    .attr('height', nav_height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',0 )');

// Reference them to enrichr library
label_svg.append("text")
  .attr("class", "library1")
  .attr("x", 100)
  .attr("y", -20)
  .attr("dy", ".32em").attr("text-anchor", "end")
  .attr("font-size", 15)
  .attr("fill", "white")
  .style("text-decoration", "underline")  
  .text('library :');

// puts how many games you have played on top right
get_user_gp(g_id);
