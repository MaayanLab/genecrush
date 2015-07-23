////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ordering && changes

// Transition to new order.
function order(value) {
  reset_curr_mat(value);
  scale_Y.domain(value.x);
  var t = svg.transition().duration(curr_duration);

  t.selectAll(".row").attr("transform", function(d, i) {    // Orders the rows.
      return "translate(0," + scale_Y(i) + ")"; });

  for (var row in value.y) {                                // Orders each columns.
    curr_row_order = value.y[row];
    t.selectAll(".cell_x" + row).attr("transform", function(d, i) {
      return "translate(" + scale_X(i) + ",0)"; })
  }

  reset_nav_data(value);
  calc_score(value);
}


// Undo's last move.
function undo() {
  if (counter > 1) {                          // orders to last position, delete current
    counter--;
    order(orders[counter - 1]);
    delete orders[counter];
    current_index_order = orders[counter - 1];
  } else if (counter == 1) {                  // last one, reverts to initial setting.
    order(orders.initial);
    delete orders[0];
    counter = 0;
    current_index_order = orders.initial;
  } else {                                    // Nothing to Undo
    console.log("there is nothing to undo");
  }
  undo_sound.playclip();
  curr_duration = default_duration;
}


function sort_descending(value) {
  curr_duration = trans_duration;

  // Creates a "new_order".
  var temp_y = [],
      temp_x = [];
  for (var i = 0; i < current_index_order.x.length; i++) temp_y.push(current_index_order.y[i].slice());
  for (var i = 0; i < nrow; i++) temp_x.push(orders.sorted_ds.x[i]);
  var new_order = { "x": temp_x.slice(), "y": temp_y.slice() };

  current_index_order = new_order;    // new order is now current order, adds to "orders"
  orders[counter] = new_order;
  order(orders[counter]);
  counter++;
  curr_duration = default_duration;
  descending_sound.playclip();
}


function sort_ascending(value) {
  curr_duration = trans_duration;

  // Creates a "new_order".
  var temp_y = [],
      temp_x = [];
  for (var i = 0; i < current_index_order.x.length; i++) temp_y.push(current_index_order.y[i].slice());
  for (var i = 0; i < nrow; i++) temp_x.push(orders.sorted_as.x[i]);
  var new_order = { "x": temp_x.slice(), "y": temp_y.slice() };

  current_index_order = new_order;    // new order is now current order, adds to "orders"
  orders[counter] = new_order;
  order(orders[counter]);
  console.log(orders[counter]);
  counter++;
  curr_duration = default_duration;
  ascending_sound.playclip();
}


function sort_freq(value) {
  curr_duration = trans_duration;

  // Creates a "new_order".
  var temp_y = [],
      temp_x = [];
  temp_y = orders.freq.y;
  for (var i = 0; i < nrow; i++) temp_x = current_index_order.x.slice();
  var new_order = { "x": temp_x.slice(), "y": temp_y };

  current_index_order = new_order;    // new order is now current order, adds to "orders"
  orders[counter] = new_order;
  console.log(orders[counter]);
  order(orders[counter]);
  counter++;
  curr_duration = default_duration;
}


function sort_alphabet(value) {
  curr_duration = trans_duration;

  // Creates a "new_order".
  var temp_y = [],
      temp_x = [];
  temp_y = orders.alphabet.y;
  for (var i = 0; i < nrow; i++) temp_x = current_index_order.x.slice();
  var new_order = { "x": temp_x.slice(), "y": temp_y };

  current_index_order = new_order;    // new order is now current order, adds to "orders"
  orders[counter] = new_order;
  console.log(orders[counter]);
  order(orders[counter]);
  counter++;
  curr_duration = default_duration;
}


function reset() {
  curr_duration = trans_duration;
  for (var order in orders) {
    if (order == "initial" || order == "sorted_as" || order == "sorted_ds") {}  // do nothing with initial orders
    else {delete orders[order];}
  }
  this.order(orders["initial"]);
  current_index_order = { x: orders["initial"].x.slice(), y: orders["initial"].y.slice() };
  counter = 0;
  curr_duration = default_duration;
  d3.selectAll(svg).selectAll('.rect').style('stroke', "blue").style('stroke-width', 1);
  d3.selectAll('.score_board_text').text(0);      // reset score to 0
  reset_sound.playclip();
}


d3.select("#same_gene").on("change", function() { 
  toggle_hl ^= true;
});


d3.select("#unq_gene").on("change", function() { 
  toggle_unq ^= true;
  if (toggle_unq) {
    for (var names in unq_gene_names) {
      d3.select('.cell_n_'+unq_gene_names[names]).select('.rect')
        .attr('fill-opacity',0.5)
        .style('stroke', "blue").style('stroke-width', 1)
        .style("fill", "rgb(65,105,225)");
      d3.select('.cell_n_'+unq_gene_names[names]).select('.cell_text')
        .text(null)
    }
    var temp_x = current_index_order.x.slice();
    var temp_y = orders['freq'].y.slice();
    order({x:temp_x, y:temp_y})
  } else {
    for (var names in unq_gene_names) {
      d3.select('.cell_n_'+unq_gene_names[names]).select('.rect')
        .attr("fill-opacity", 0.9)
        .style('stroke', "blue").style('stroke-width', 1)
        .style("fill", function(d) { return scale_color(d.z); });
      d3.select('.cell_n_'+unq_gene_names[names]).select('.cell_text')
        .text(function(d) { return genes_unq[d.z]; })
    }
  }
});

// TODO needs to fine detail revise it to make it bug-free
function new_data() {
  random = Math.floor(Math.random() * 71);
  var path = "json/from_random_crowd_sourcing/";
  path += random;
  path += '.json'
  console.log(path);
  d3.select('.svg').remove();
  d3.selectAll('.navigator').remove();
  svg = d3.select("#main_game").append("svg").attr('class', 'svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // .style("margin-left", +margin.left + "px")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      // .call(zoom);

  nav_svg = d3.select('#main_game').append('svg').attr('class', 'navigator')
    .attr('width', nav_width + margin.left + margin.right)
    .attr('height', nav_height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // d3.json("json/Phosphatase_Substrates_SAMPLE.json", function(sample) {
// d3.json("json/from_enrichr/ENCODE_Histone_Modifications_2015.json", function(sample) {
d3.json(path, function(sample) {
//   // Processes the visualizing of the "json"
  make_viz(sample);
});
}


function reset_curr_mat(value) {
  curr_mat = [];
  for (var i = 0; i < value.x.length; i++) {
  var temp_vec = [];
    for (var j = 0; j < value.y[i].length; j++) {
      temp_vec.push(matrix[value.x[i]][value.y[value.x[i]][j]].z);
    }
  curr_mat.push(temp_vec);
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Extra Stuff

function redraw_svg() {
  var curr_width = svg_scale_X(2) - svg_scale_X(1);
  svg.select('.x.axis').call(x_axis);
  d3.selectAll('.rect').attr('width',curr_width)
  for (var i = 0; i < ncol; i++) {
    var x_corrdinates = (curr_width*i)-(nav_min*curr_width); //
    d3.selectAll('.cell_y'+i).attr('transform','translate('+x_corrdinates+',0)');
    d3.selectAll('.cell_y'+i).select('.cell_text').attr("x", curr_width / 2)
  }
}


function updateViewportFromChart() {
    if ((scale_X.domain()[0] <= minDate) && (scale_X.domain()[1] >= maxDate)) {
        viewport.clear();
    } else {
        viewport.extent(scale_X.domain());
    }
    nav_svg.select('.viewport').call(viewport);
}


function reset_nav_data(value) {
  var temp_nav_data = []
  temp_nav_data.push(0)
  for (var i = 0; i < value.x.length; i++) {
    // console.log(value.x[i])
    temp_nav_data.push(orig_nav_data[value.x[i] + 1])
  }
  temp_nav_data.push(0)
  curr_nav_data = temp_nav_data;
  // console.log(curr_nav_data);
  d3.select('.nav_line').attr('d', nav_line(curr_nav_data));

}
