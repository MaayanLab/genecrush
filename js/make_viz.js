// Make visualization within reading in json file

function make_viz(sample) {

  // initialize variables.
  var terms = Object.keys(sample),
      genes_unq = [],
      genes_unq_count = {},
      color_unq = [],
      genes = [],
      hover_label,
      hover_cell,
      hover_cell_name,
      clicked_cell_1,
      clicked_cell_2;

  orders = {};

  // "nrow" - number of terms given.
  nrow = terms.length;

  // "ncol" - max genes in a given set(max col number).
  for (i = 0; i < nrow; i++) {
    curr_nrow = sample[terms[i]].length;
    if (curr_nrow > ncol) ncol = curr_nrow;
  }
  
  if (ncol < 10) ncol = 10;
  // else ncol = 13
  // if (nrow > 20) nrow = 20;

  // "genes_unq" - array of unique genes, "genes" - array of all genes
  for (i = 0; i < nrow; i++) {
    curr_row = sample[terms[i]];
    for (j = 0; j < ncol; j++) {
      genes.push(curr_row[j]);                                             // all genes pushed to the "genes"
      if (genes_unq.indexOf(curr_row[j]) < 0) genes_unq.push(curr_row[j]); // unique gene pushed to "genes_unq"
    }
  }

  // "genes_unq_count" has frequency of all the genes count.
  for (i = 0; i < genes_unq.length; i++) genes_unq_count[genes_unq[i]] = 0;
  for (i = 0; i < genes.length; i++) genes_unq_count[genes[i]]++;

  // Find index of undefined
  undefined_ind = 0;
  for (i = 0; i < genes_unq.length; i++) {
    if (genes_unq[i] == undefined) {
      undefined_ind = i;

    }
  }

  // Creates matrix with each cell z with index of array "genes_unq"
  var undefined_count = 0;
  for (i = 0; i < nrow; i++) {
    matrix[i] = d3.range(ncol).map(function(j) {
      if (genes_unq.indexOf(sample[terms[i]][j]) == undefined_ind) undefined_count++;
      return { x: j, y: i, z: genes_unq.indexOf(sample[terms[i]][j]) }
    });
  } 

  // Assign range of random colors, setting undefined to white.
  var rand_color = randomColor({count: nrow * ncol - undefined_count, format: 'rgb'})
  for (i = 0; i < genes_unq.length; i++) {
      if (i == undefined_ind) {                                      // Sets undefined cells to blue.
        color_unq.push("rgb(65,105,225)");
      } else {                                                  // if not in the mapping, randomly assigns color.
        color_unq.push(rand_color.pop());
      }
  }

  scale_color = d3.scale.ordinal().domain(genes_unq).range(color_unq);
  // set unique colors to each unique genes.
  // scale_color = d3.scale.category20().domain(d3.range(genes_unq.length));

  // Function to add to "orders" the following : "initial", "sorted_ds"
  add_to_orders();

  // Scales the x domain of the current order.
  scale_xy.x.domain(current_index_order.x);

  // append grey rectangle background to SVG.
  // svg.append("rect").attr("class", "background").attr("width", width).attr("height", height);

  // Creates group "row".
  var row = svg.selectAll(".row").data(matrix).enter().append("g")
      .attr("class", function(d, i) { return "row row_" + i; })
      .attr("id", function(d, i) { return i; })
      .attr("transform", function(d, i) { return "translate(0," + scale_xy.x(i) + ")"; })
      .each(row_function);


  // creates group "row_label" and appends to the row.
  var row_label = label_svg.selectAll(".row_label").data(matrix).enter().append("g")
      .attr("class", function(d, i) { return "row_label noselect row_label_" + i })
      .style("cursor", "pointer")
      .on("mouseover", mouseover_label)
      .on("mouseout", mouseout_label)
      .on("mousedown", mouseDown_label)
      .on("mouseup", mouseUp_label);

  // Rectangle attached to "row_label"
  row_label.append("rect")
      .attr("class", "rect")
      .attr("x", 0)
      .attr("y", function(d, i) { return scale_xy.x(d[0].y) + 52 })
      .attr("rx", width / ncol / 8)
      .attr("ry", height / nrow / 8)
      .attr("width", 100)
      .attr("height", scale_xy.x.rangeBand() -4)
      .style("fill", "white")
      .style("fill-opacity", 0.2);

  // Text attached to "row_label".
  row_label.append("text")
      .attr("class", "row_label_text")
      .attr("x", 95)
      .attr("y", function(d, i) { return scale_xy.x(d[0].y) + 70 })
      .attr("dy", ".32em").attr("text-anchor", "end")
      .attr("font-size", 20)
      .attr("fill", "white")
      .text(function(d, i) { return terms[i]; });

  // Within each row.
  function row_function(tmp) {

    // Scales the y domain of the current row.
    scale_xy.y.domain(current_index_order.y[this.id]);

    // creates group "cell" and appends to the row.
    var cell = d3.select(this).selectAll(".cell").data(tmp).enter().append("g")
        .attr("class", function(d, i) { 
          return "cell_x" + d.y + " cell_y" + d.x + " noselect " + "cell_n_" + genes_unq[d.z]; })
        .attr("transform", function(d, i) { 
          return "translate(" + rect_size*i + ",0)"; })
        .style("cursor", "pointer")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousedown", mouseDown)
        .on("mouseup", mouseUp);

    // Rectangle attached to "cell"
    cell.append("rect")
        .attr("class", "rect")
        .attr("x", 0)
        .attr("y", 2)
        .attr("rx", width / ncol / 8)
        .attr("ry", height / nrow / 8)
        .attr("width", rect_size)//scale_xy.y.rangeBand())
        .attr("height", scale_xy.x.rangeBand() - 4)
        .attr("fill-opacity", function(d) { 
          if (d.z == undefined_ind) return 0.5
            else return 0.9})
        .style('stroke', "blue").style('stroke-width', 1)
        .style("fill", function(d) { return scale_color(d.z); });

    // Text attached to "cell"
    cell.append("text")
        .attr("class", "cell_text")
        .text(function(d) { return genes_unq[d.z]; })
        .attr("x", rect_size / 2)
        .attr("y", scale_xy.x.rangeBand() / 2)
        .attr("dy", ".32em").attr("text-anchor", "middle")
        .attr("font-size", scale_xy.x.rangeBand() / 4)
        .attr("fill", function(d) {
          var text = scale_color(d.z);
          var rgb = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')).split(/,\s*/);
          var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
          if (o > 125) {
            return "black"; 
          } else  {
            return "white"; }});

    // separator for each cells.
    // cell.append("line").attr("y2", scale_xy.x.rangeBand()).attr("stroke-width", 1);
  }

  //// LABEL functions ////
  // selects a row when mouse hovers over the label.
  function mouseover_label(p) {
    var xPosition = 120;
    var yPosition = current_index_order.x.indexOf(p[0].y) * (height / nrow) + margin['top'] + 80;

    //Update the tooltip position and value
    d3.select("#tooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px");

    d3.select('#tooltip').select('#tt_term').text("\"" + terms[p[0].y] + "\"");
    d3.select('#tooltip').select("#tt_genes").text('(' + sample[terms[p[0].y]].join(', ') + ')');
    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);


    // d3.selectAll(".row_label text").classed("active", function(d, i) { return i == p[0].y; });
    hover_label = d3.selectAll('.row_' + p[0].y);
    // hover_label.selectAll('.row_label_text').attr("font-size", scale_xy.x.rangeBand() / 3)
    //     .attr("font-weight", "bold")
    //     .attr("fill", "red");
    // hover_label.selectAll(".cell_x" + p[0].y).selectAll(".rect").style("stroke", "red");
  }

  // // deselects all the rows when mouse hovers out of the label.
  function mouseout_label(p) {
    d3.select("#tooltip").classed("hidden", true);
    // hover_label.selectAll('.row_label_text').attr("font-size", scale_xy.x.rangeBand() / 4)
    //     .attr("font-weight", null)
    //     .attr("fill", null);
    // hover_label.selectAll(".cell_x" + p[0].y).selectAll(".rect").style('stroke', null);
    // d3.selectAll("row_label_text").classed("active", false);
  }

  // when mouse clicks down
  function mouseDown_label(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p[0].y; });
    selected_index_1 = { 'x': p[0].y };
  }

  // when mouse released
  function mouseUp_label(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p[0].y; });
    selected_index_2 = { 'x': p[0].y };
    // Swaps the rows.
    if (selected_index_1.x != selected_index_2.x)
      swap_rows();
  }

  //// CELL functions ////
  // selects a cell when mouse hovers over.
  function mouseover(p) {
            // HIGHLIGHTS THE HOVERING CELLS
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    d3.selectAll(".row_label_text").classed("active", function(d, i) { return i == p.y; });
    hover_cell = d3.selectAll('.cell_x' + p.y + ".cell_y" + p.x).selectAll(".rect");
    hover_cell.style('fill', theme_color).style('stroke', 'red').style('stroke-width', 2);
    if (genes_unq[p.z] != undefined && toggle_hl == 1) {
       hover_cell_name = d3.selectAll('.cell_n_' + genes_unq[p.z]).selectAll(".rect");
       hover_cell_name.style('stroke', 'red').style('stroke-width', 5);
    }
    console.log(width);
  }

  // deselects all the cell when mouse hovers out.
  function mouseout() {
    hover_cell.attr("fill-opacity", function(d) { 
      if (d.z == undefined_ind) return 0.5
      else return 0.9})
      .style('stroke', "blue").style('stroke-width', 1).transition().duration(350)
      .style("fill", function(d) { return scale_color(d.z); }); 
    if (hover_cell_name != undefined && toggle_hl == 1) hover_cell_name.style('stroke', "blue").style('stroke-width', 1);
    d3.selectAll("text").classed("active", false);
  }

  // when mouse clicks down
  function mouseDown(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    selected_index_1 = { 'x': p.y, 'y': p.x };

    
    if (click_state == 0) {
      clicked_cell_1 = d3.selectAll(".cell_x" + selected_index_1.x + ".cell_y" + selected_index_1.y).selectAll(".rect");
      clicked_cell_1.style('stroke', 'red').style('stroke-width', 5);
    }
    if (click_state == 1) {
      clicked_cell_2 = d3.selectAll(".cell_x" + selected_index_1.x + ".cell_y" + selected_index_1.y).selectAll(".rect");
      if (selected_index_1.x != selected_index_2.x) swap_rows();
      if (selected_index_1.x == selected_index_2.x && selected_index_1.y != selected_index_2.y) swap_cols();
      clicked_cell_1.style('stroke', "blue").style('stroke-width', 1)
      clicked_cell_2.style('stroke', "blue").style('stroke-width', 1)
      click_state = 2;
    }
  }

  // when mouse released
  function mouseUp(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    selected_index_2 = { 'x': p.y, 'y': p.x };


    if (click_state == 0) {
      if (selected_index_1.x == selected_index_2.x 
        && selected_index_1.y == selected_index_2.y) {
        click_state = 1;
      } else {
        if (selected_index_1.x != selected_index_2.x) swap_rows();
        if (selected_index_1.x == selected_index_2.x && selected_index_1.y != selected_index_2.y) swap_cols();
        clicked_cell_1.style('stroke', null);
        clicked_cell_1.style('stroke', "blue").style('stroke-width', 1)
        click_state = 0;
      }
    }
    if (click_state == 2) {
      click_state = 0;
    }
  }

  // Swaps the two selected rows.
  function swap_rows() {
    row_swap_sound.playclip();
    var temp_1_index = current_index_order.x.indexOf(selected_index_1.x),
        temp_1_value = current_index_order.x[temp_1_index],
        temp_2_index = current_index_order.x.indexOf(selected_index_2.x),
        temp_2_value = current_index_order.x[temp_2_index];
    current_index_order.x[temp_1_index] = temp_2_value;
    current_index_order.x[temp_2_index] = temp_1_value;

    // Hard copies current order
    orders[counter] = {};
    for (var i in current_index_order) { orders[counter][i] = current_index_order[i].slice(); };

    // Orders to new swapped state, increment counter.
    order(orders[counter]);
    counter++;
  }

  // Swaps the two selected cols.
  function swap_cols() {
    col_swap_sound.playclip();
    var temp_1_index = current_index_order.y[selected_index_1.x].indexOf(selected_index_1.y),
        temp_1_value = current_index_order.y[selected_index_1.x][temp_1_index],
        temp_2_index = current_index_order.y[selected_index_1.x].indexOf(selected_index_2.y),
        temp_2_value = current_index_order.y[selected_index_1.x][temp_2_index];
    var this_row_order = current_index_order.y[selected_index_1.x].slice();
    this_row_order[temp_1_index] = temp_2_value;
    this_row_order[temp_2_index] = temp_1_value;

    // Creates a new order.
    new_order = { x: current_index_order.x.slice() }; // x stays the same
    var temp_y = [];
    for (i = 0; i < nrow; i++) {                      // y copied over
      var temp_x = [];
      if (selected_index_1.x != i) temp_x = current_index_order.y[i].slice();
      else temp_x = this_row_order.slice();
      temp_y.push(temp_x);
    }
    new_order["y"] = temp_y;
    current_index_order = new_order;                  // new order is now current order

    // Hard copies current order
    orders[counter] = {};
    for (var i in current_index_order) { orders[counter][i] = current_index_order[i].slice(); };

    // Orders to new swapped state, increment counter.
    order(orders[counter]);
    counter++;
  }

  // Adds "initial", "sorted_ds", "sorted_as" to the "orders".
  function add_to_orders() {
    // Process order for "initial"
    var temp_x = [];
    for (i = 0; i < nrow; i++) { temp_x.push(i); };
    var temp_y_row = [];
    for (i = 0; i < ncol; i++) { temp_y_row.push(i); };
    var temp_y = [];
    for (i = 0; i < nrow; i++) { temp_y.push(temp_y_row); };
    orders["initial"] = {"x": temp_x, "y": temp_y};

    // set "current_index_order" to "initial".
    current_index_order = { x: temp_x.slice(), y: temp_y.slice() };

    // Process order for "sorted_ds"
    var temp_xx = [];
    var temp_x = [];
    for (i = 0; i < nrow; i++) { temp_xx.push([i, sample[terms[i]].length]); };
    temp_xx = temp_xx.sort(function(a, b) { return b[1] - a[1] });
    for (i = 0; i < nrow; i++) { temp_x.push(temp_xx[i][0]); }
    var temp_y_row = [];
    for (i = 0; i < ncol; i++) { temp_y_row.push(i); };
    var temp_y = [];
    for (i = 0; i < nrow; i++) { temp_y.push(temp_y_row); };
    orders["sorted_ds"] = {"x": temp_x, "y":temp_y};

    // Process order for "sorted_as"
    temp_xx = [];
    for (i = nrow - 1; i >= 0; i--) { temp_xx.push(temp_x[i])};
    orders["sorted_as"] = {"x": temp_xx, "y":temp_y};
  }

  // calculate score and order in initial state
  reset_curr_mat(current_index_order);
  calc_score(current_index_order);
  // tutorial();
}