// Ordering && changes

// Transition to new order.
function order(value) {
  reset_curr_mat(value);
  scale_xy.x.domain(value.x);                               // Scales x to the width
  var t = svg.transition().duration(curr_duration);         // Transition variable

  t.selectAll(".row")
    .attr("transform", function(d, i) {    // Orders the rows.
      return "translate(0," + scale_xy.x(i) + ")"; });

  for (var row in value.y) {                                // Orders each columns.
    curr_row_order = value.y[row];
    t.selectAll(".cell_x" + row).attr("transform", function(d, i) {
      scale_xy.y.domain(curr_row_order);
      return "translate(" + scale_xy.y(i) + ",0)"; })
  }
  calc_score(value);
}

// Undo's last move.
function undo() {
  if (counter > 1) {                          // orders to last position, delete current
    counter--;
    order(orders[counter - 1]);
    delete orders[counter];
    current_index_order = orders[counter - 1];
  } else if (counter == 1) {                  // last one, reverts to original manual setting.
    order(orders.initial);
    delete orders[0];
    counter = 0;
    current_index_order = orders.initial;
  } else {                                    // Nothing to Undo
    console.log("there is nothing to undo");
  }
  undo_sound.playclip();
}

// Orders the rows in descending manner.
function sort_descending(value) {
  curr_duration = trans_duration;

  // Creates a "new_order".
  var temp_y = [];
  for (i = 0; i < current_index_order.x.length; i++) {
    temp_y.push(current_index_order.y[i].slice());
  }
  var temp_x = [];
  for (i = 0; i < nrow; i++) {
    temp_x.push(orders.sorted_ds.x[i]);
  }
  var new_order = {
    "x": temp_x.slice(),
    "y": temp_y.slice()
  };

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
  var temp_y = [];
  for (i = 0; i < current_index_order.x.length; i++) {
    temp_y.push(current_index_order.y[i].slice());
  }
  var temp_x = [];
  for (i = 0; i < nrow; i++) {
    temp_x.push(orders.sorted_as.x[i]);
  }
  var new_order = {
    "x": temp_x.slice(),
    "y": temp_y.slice()
  };

  current_index_order = new_order;    // new order is now current order, adds to "orders"
  orders[counter] = new_order;
  order(orders[counter]);
  counter++;
  curr_duration = default_duration;
  ascending_sound.playclip();
}

// Resets everything to original
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
  d3.selectAll('.rect').style('stroke', "blue").style('stroke-width', 1);
  d3.selectAll('.score_board_text').text(0);      // reset score to 0
  reset_sound.playclip();
}

d3.select("#same_gene").on("change", function() { 
  toggle_hl ^= true;
});

function reset_curr_mat(value) {
  curr_mat = [];
  for (i = 0; i < value.x.length; i++) {
  // var temp = "";
  var temp_vec = [];
    for (j = 0; j < value.y[i].length; j++) {
      temp_vec.push(matrix[value.x[i]][value.y[value.x[i]][j]].z);
      // if (matrix[value.x[i]][value.y[value.x[i]][j]].z != 19)
        // temp += matrix[value.x[i]][value.y[value.x[i]][j]].z + " ";
    }
  // console.log("row_"+value.x[i]+": "+temp);
  curr_mat.push(temp_vec);
  }

  // console.log(curr_mat);
}