////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Make visualization within reading in json file
function make_viz(sample) {
  // declare and initialize variables.
  var terms = Object.keys(sample),
      genes_unq_count = {},
      color_unq = [],
      genes = [],
      hover_label,
      hover_cell,
      hover_cell_name,
      clicked_cell_1,
      clicked_cell_2;

  // initialize the global variables
  genes_unq = [],
  orders = {};
  nrow = terms.length;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Preprocesses the information about the json

  // "ncol" - max genes in a given set(max col number).
  for (var i = 0; i < nrow; i++) if (sample[terms[i]].length > ncol) ncol = sample[terms[i]].length;

  orig_nav_data.push(0);
  for (var i = 0; i < nrow; i++) { curr_row = sample[terms[i]];
    for (var j = 0; j < ncol; j++) { genes.push(curr_row[j]);                   // all genes pushed to the "genes"
      if (genes_unq.indexOf(curr_row[j]) < 0) genes_unq.push(curr_row[j]);  // unique gene pushed to "genes_unq"
    }
    orig_nav_data.push(curr_row.length);
  } orig_nav_data.push(0);                                                  // orig_nav_data set.
  curr_nav_data = orig_nav_data.slice();                                    // curr_nav_data updated

  // "genes_unq_count" has frequency of all the genes count.
  for (var i = 0; i < genes_unq.length; i++) genes_unq_count[genes_unq[i]] = 0;
  for (var i = 0; i < genes.length; i++) genes_unq_count[genes[i]]++;
  for (var unq_genes in genes_unq_count) if (genes_unq_count[unq_genes] == 1) unq_gene_names.push(unq_genes);

  // Find index of undefined
  for (var i = 0; i < genes_unq.length; i++) if (genes_unq[i] == undefined) undefined_ind = i;

  // Creates matrix with each cell z with index of array in "genes_unq"
  var undefined_count = 0;
  for (var i = 0; i < nrow; i++) { matrix[i] = d3.range(ncol).map(function(j) {
    if (genes_unq.indexOf(sample[terms[i]][j]) == undefined_ind) undefined_count++;
    return { x: j, y: i, z: genes_unq.indexOf(sample[terms[i]][j]) } });
  } 

  // Assign range of random colors, setting undefined to blue.
  var rand_color = randomColor({count: nrow * ncol - undefined_count, format: 'rgb'})
  for (var i = 0; i < genes_unq.length; i++) {
    if (i == undefined_ind) color_unq.push("rgb(65,105,225)");    // undefined color
    else color_unq.push(rand_color.pop());                        // each unq gene gets unq color
  }

  // Scale color
  scale_color = d3.scale.ordinal().domain(genes_unq).range(color_unq);

  // Adds 5 orders: "initial", "sorted_ds", "sorted_as", "freq", "alphabet"
  add_to_orders();

  // Scales the x domain of the current order.
  scale_Y.domain(current_index_order.x);
  nav_scale_Y.domain([0,nrow + 1]);
  nav_scale_X.domain([0,ncol]);

  // append grey rectangle background to SVG.
  svg.append("rect").attr("class", "background").attr("width", width).attr("height", height).attr('fill-opacity',0.5);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// makes the elements in the main svg

  // Group row made first
  var row = svg.selectAll(".row").data(matrix).enter().append("g")
      .attr("class", function(d, i) { return "row row_" + i; })
      .attr("id", function(d, i) { return i; })
      .attr("transform", function(d, i) { return "translate(0," + scale_Y(i) + ")"; })
      .each(row_function);

  // Creates things within each row.
  function row_function(value) {

    // Scales the y domain of the current row.
    scale_X.domain(current_index_order.y[this.id]);

    // creates group "cell" and appends to the row.
    var cell = d3.select(this).selectAll(".cell").data(value).enter().append("g")
        .attr("class", function(d, i) { 
          return "cell_x" + d.y + " cell_y" + d.x + " noselect " + "cell_n_" + genes_unq[d.z]; })
        .attr("transform", function(d, i) { 
          return "translate(" + scale_X(i) + ",0)"; })
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
        .attr("width", scale_X.rangeBand())
        .attr("height", scale_Y.rangeBand() - 4)
        .attr("fill-opacity", function(d) { 
          if (d.z == undefined_ind) return 0.5
            else return 0.9})
        .style('stroke', "blue").style('stroke-width', 1)
        .style("fill", function(d) { return scale_color(d.z); });

    // Text attached to "cell"
    cell.append("text")
        .attr("class", "cell_text")
        .text(function(d) { return genes_unq[d.z]; })
        .attr("x", scale_X.rangeBand() / 2)
        .attr("y", scale_Y.rangeBand() / 2)
        .attr("dy", ".32em").attr("text-anchor", "middle")
        .attr("font-size", scale_Y.rangeBand() / 4)
        .attr("fill", function(d) {
          var text = scale_color(d.z);
          var rgb = text.substring(text.indexOf('(') + 1, text.lastIndexOf(')')).split(/,\s*/);
          var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) /1000);
          if (o > 125) {
            return "black"; 
          } else  {
            return "white"; }});
  }

  // creates group "row_label" and appends to the row.
  var row_label = row.append("g")
      .attr("class", function(d, i) { return "row_label noselect row_label_" + i })
      .style("cursor", "pointer")
      .on("mouseover", mouseover_label)
      .on("mouseout", mouseout_label)
      .on("mousedown", mouseDown_label)
      .on("mouseup", mouseUp_label);

  // Rectangle attached to "row_label"
  row_label.append("rect")
      .attr("class", "rect")
      .attr("x", -scale_X.rangeBand())
      .attr("y", 2)
      .attr("rx", width / ncol / 8)
      .attr("ry", height / nrow / 8)
      .attr("width", scale_X.rangeBand())
      .attr("height", scale_Y.rangeBand() -4)
      .style("fill", "white")
      .style("fill-opacity", 0.2);

  // Text attached to "row_label".
  row_label.append("text")
      .attr("class", "row_label_text")
      .attr("x", -5)
      .attr("y", scale_Y.rangeBand() / 2)
      .attr("dy", ".32em").attr("text-anchor", "end")
      .attr("font-size", scale_Y.rangeBand() / 4)
      .attr("fill", "white")
      .text(function(d, i) { return terms[i]; });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// makes the elements in the nav svg && axis

  x_axis = d3.svg.axis()                                          // creates x_axis on main svg
      .scale(scale_X)
      .orient('bottom')
      .ticks(5);
  // y_axis = d3.svg.axis()                                          // creates y_axis on main svg
  //     .scale(scale_Y)
  //     .orient('left');

  svg.append('g')                                                  // appends x_axis on main svg
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(x_axis);

  // svg.append('g')                                                  // appends x_axis on main svg
  //     .attr('class', 'y axis')
  //     .call(y_axis);

  var nav_x_axis = d3.svg.axis()                                     // appends x_axis on nav_svg
    .scale(nav_scale_X)
    .orient('bottom')
    .ticks(15);

  nav_svg.append('g')                                                // appends x_axis on nav_svg
    .attr('class', 'x axis')  
    .attr('transform', 'translate(0,' + nav_height + ')')
    .call(nav_x_axis);

// for testing only.
// var nav_y_axis = d3.svg.axis()
//     .scale(nav_scale_Y)
//     .orient('left');
// nav_svg.append('g')
//     .attr('class', 'y axis')
//     .attr('transform', 'translate(0,' + nav_width + ')')
//     .call(nav_y_axis);

  // d3.select('.navigator').append('rect')
  //   .attr("x",0)
  //   .attr('y',2)
  //   .attr('width',nav_width)
  //   .attr('height',nav_height -2)
  //   .attr('fill','white')
  //   .attr('fill-opacity',0.5)
  //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  nav_line = d3.svg.line()                                            // gets the coordinates of path
    .x(function (d, i) { return nav_scale_X(d); })
    .y(function (d, i) { return nav_scale_Y(i); })
    .interpolate("step-before");

  nav_svg.append('path')                                              // append path to nav_svg
    .attr('class', 'nav_line').attr('fill','grey')
    .attr('d', nav_line(curr_nav_data));

  var viewport = d3.svg.brush()                                       // creates viewport
    .x(nav_scale_X)
    .on("brush", function () {
        scale_X.domain(viewport.empty() ? nav_scale_X.domain() : viewport.extent());
        redraw_svg();
    });

  nav_svg.append("g")                                                 // appends viewport on nav_svg
    .attr("class", "viewport")
    .call(viewport)
    .selectAll("rect")
    .attr("height", nav_height);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mouse events function on labels

  function mouseover_label(p) {
    var xPosition = margin['left'];
    var yPosition = current_index_order.x.indexOf(p[0].y) * (height / nrow) + margin['top'] + 80;

    //Update the tooltip position and value
    d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px");
    d3.select('#tooltip').select('#tt_term').text("\"" + terms[p[0].y] + "\"");
    d3.select('#tooltip').select("#tt_genes").text('(' + sample[terms[p[0].y]].join(', ') + ')');
    d3.select("#tooltip").classed("hidden", false);
  }

  function mouseout_label(p) {
    d3.select("#tooltip").classed("hidden", true);
  }

  function mouseDown_label(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p[0].y; });
    selected_index_1 = { 'x': p[0].y };
  }

  function mouseUp_label(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p[0].y; });
    selected_index_2 = { 'x': p[0].y };
    
    if (selected_index_1.x != selected_index_2.x)
      swap_rows();
  }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mouse events function on cells

  function mouseover(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    d3.selectAll(".row_label_text").classed("active", function(d, i) { return i == p.y; });
    if (genes_unq[p.z] != undefined && toggle_hl == 1) {
       hover_cell_name = d3.selectAll('.cell_n_' + genes_unq[p.z]).selectAll(".rect");
       hover_cell_name.style('stroke', 'red').style('stroke-width', 5);
    }
  }

  function mouseout() {
    if (hover_cell_name != undefined && toggle_hl == 1) hover_cell_name.style('stroke', "blue").style('stroke-width', 1);
    d3.selectAll("text").classed("active", false);
  }

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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions

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
    for (var i = 0; i < nrow; i++) {                      // y copied over
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

  // Adds 5 orders: "initial", "sorted_ds", "sorted_as", "freq", "alphabet"
  function add_to_orders() {

    /////////////////////////////////////////////////////////////////////
    // "initial"
    var temp_x = [],
        temp_y_row = [],
        temp_y = [];
    
    for (var i = 0; i < nrow; i++) { temp_x.push(i); };
    for (var i = 0; i < ncol; i++) { temp_y_row.push(i); };
    for (var i = 0; i < nrow; i++) { temp_y.push(temp_y_row); };
    orders["initial"] = {"x": temp_x, "y": temp_y};

    // set "current_index_order" to "initial".
    current_index_order = { x: temp_x.slice(), y: temp_y.slice() };

    /////////////////////////////////////////////////////////////////////
    // "sorted_ds"
    var temp_xx = [], 
        temp_x = [],
        temp_y_row = [],
        temp_y = [];
    
    for (var i = 0; i < nrow; i++) { temp_xx.push([i, sample[terms[i]].length]); };
    temp_xx = temp_xx.sort(function(a, b) { return b[1] - a[1] });
    for (var i = 0; i < nrow; i++) { temp_x.push(temp_xx[i][0]); }
    for (var i = 0; i < ncol; i++) { temp_y_row.push(i); };
    for (var i = 0; i < nrow; i++) { temp_y.push(temp_y_row); };
    orders["sorted_ds"] = {"x": temp_x, "y":temp_y};


    /////////////////////////////////////////////////////////////////////
    // "sorted_as"
    temp_xx = [];
    for (var i = nrow - 1; i >= 0; i--) { temp_xx.push(temp_x[i])};
    orders["sorted_as"] = {"x": temp_xx, "y":temp_y};

    /////////////////////////////////////////////////////////////////////
    // "freq"
    var temp1 = [],
        temp2 = [],
        temp3 = [];
    for (var genes in genes_unq_count) if (genes != 'undefined') temp1.push([genes, genes_unq_count[genes]])
    temp1.sort(function(a,b){return b[1] - a[1]})
    for (var i = 0; i < temp1.length; i++) temp2.push(temp1[i][0])
    for (var i = 0; i < nrow; i++) {  // for each row
      var temp_row = []; 
      for (var j = 0; j < temp2.length; j++) {
        for (var k = 0; k < sample[terms[i]].length; k++) if (temp2[j] == sample[terms[i]][k]) temp_row.push(k);
      }
      if (temp_row.length < ncol) for (var l = temp_row.length; l < ncol; l++) temp_row.push(l)
      temp3.push(temp_row);
    }
    orders["freq"] = {x:current_index_order.x.slice(), y:temp3}

    /////////////////////////////////////////////////////////////////////
    // "alphabet"
    var term = Object.keys(sample),
        sample2 = $.extend(true, {}, sample),
        temp_alph =[];
    for (var i = 0; i < nrow; i++) sample2[term[i]].sort();
    for (var i = 0; i < nrow; i++) {
      var temp_row = [];
      for (var j = 0; j < ncol; j++) {
        var temp = sample[terms[i]].indexOf(sample2[terms[i]][j]);
        if (temp != -1) temp_row.push(temp)
        else temp_row.push(j);
      }
      temp_alph.push(temp_row);
    }
    orders["alphabet"] = {x:current_index_order.x.slice(), y:temp_alph}

  }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // calculate score and order in initial state
  reset_curr_mat(current_index_order);
  calc_score(current_index_order);
  // tutorial();
  // d3.select('.svg').attr('width', rect_size*ncol+300);
} 