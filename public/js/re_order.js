////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ordering && changes

// Transition to new order.
function order(value) {
  reset_curr_mat(value);
  scale_Y.domain(value.x);
  var t = svg.transition().duration(curr_duration);

  t.selectAll(".row").attr("transform", function(d, i) {    // Orders the rows.
      return "translate(0," + scale_Y(i) + ")"; });
  label_svg.transition().duration(curr_duration)
    .selectAll(".row").attr("transform", function(d, i) {    // Orders the rows.
      return "translate(0," + scale_Y(i) + ")"; });

  for (var row in value.y) {                                // Orders each columns.
    curr_row_order = value.y[row];
    t.selectAll(".cell_x" + row).attr("transform", function(d, i) {
      var returner = (curr_cell_width*(curr_row_order.indexOf(i)-nav_min));
      // console.log(returner);
      if (returner == undefined) returner = 1000;
      return "translate(" + returner + ",0)"; })
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
  if (toggle_sound) undo_sound.playclip();
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
  if (toggle_sound) descending_sound.playclip();
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
  // console.log(orders[counter]);
  counter++;
  curr_duration = default_duration;
  if (toggle_sound) ascending_sound.playclip();
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
  // console.log(orders);
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
  // console.log(orders[counter]);
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
  if (toggle_sound) reset_sound.playclip();
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
  var temp_x = current_index_order.x.slice();
  var temp_y = orders['freq'].y.slice();
  var new_order = { "x": temp_x.slice(), "y": temp_y.slice() };
  current_index_order = new_order;    // new order is now current order, adds to "orders"
  orders[counter] = new_order;
  order(orders[counter]);
  counter++;
  curr_duration = default_duration;
});

// Creates new Game.
function new_data() {
  random = Math.floor(Math.random() * 71);
  var path = "json/from_random_crowd_sourcing/6478_1_936_6/";
  path += names_of_the_files[random];
  path += '_.json'
  d3.select('.svg').remove();
  orig_nav_data = [];
  orig_nav_data_rep = [];
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
  if (toggle_sound) start_game_sound.playclip();
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


function submit_this() {
  //   var returning_json = [];
  //   for (var i = 0; i < current_index_order.x.length; i++) { //
  //     var x = current_index_order.x[i]
  //     var row = [];
  //     for (var j = 0; j < ncol; j++) {
  //       var y = matrix[x][current_index_order.y[x][j]].z;
  //       if (y != undefined_ind) row.push(genes_unq[y]);
  //     }
  //     returning_json[terms[x]] = row.slice();
  //   }
  //   console.log(returning_json);
  // var returner = {id:'runner', score:4}
  var temp = 0;
  if (played_whole_game) temp = 60;

  var this_data = {
    username:g_id, 
    total_score:curr_score, 
    total_time:temp, 
    num_games_played:1, 
    highest_score:curr_score
  }

  // var this_data = {
  //   username:'testuser', 
  //   total_score:50, 
  //   total_time:60, 
  //   num_games_played:1, 
  //   highest_score:50
  // }

  // console.log(this_data);
   $.ajax({
      type: "GET",
      url: '/user/getTopTen',
      dataType: 'text', 
      success: function(userData) {
        console.log('got top ten from db');
        d3.select('.bd_hs_legend').text('Highest Score').style('font-size', '20px')
        var topTen = JSON.parse(userData);
        for (var i = 0; i < 10; i++) {
          var curr = topTen[i];
          if (curr != undefined && curr.username != undefined) {
            var n = curr.username.indexOf('@');
            var text = curr.username;
            text = text.replaceBetween(2,n-2,'****');
            text += ' --------->  ';
            text += curr.highest_score;
            text += ' pts'
            d3.select('.bd_hs_' + (i + 1)).text(text);
          }
        }
      },
      error: function(userData) {
        console.log('please_sign_in_using_ur_google_account');
      }
    });


  $.ajax({
      type: "POST",
      data: this_data,
      url: '/user/pushInfo',
      dataType: 'text', 
      success: function(userData) {
        console.log('submitted');
        user = JSON.parse(userData);
        // console.log('success');
        // console.log(user);
        if (user.username != undefined && g_logged_in_status) {
          d3.select(".bd_message").text("Thank you for submitting your score!").style('font-size','20px')
          d3.select(".bd_username").text("Username : " + user.username)
          d3.select(".bd_highest_score").text("Highest Score : " + user.highest_score + " points")
          d3.select(".bd_average_score").text("Average Score : " + parseFloat(user.total_score / user.num_games_played).toFixed(2) + " points")
          d3.select(".bd_average_time").text("Average time per game : " + parseFloat(user.total_time / user.num_games_played).toFixed(2) + " seconds")
        }
        else {
          d3.select(".bd_message").text("Please sign in to keep track of your scores!").style('font-size', '20px')
          d3.select(".bd_username").text(null)
          d3.select(".bd_highest_score").text(null)
          d3.select(".bd_average_score").text(null)
          d3.select(".bd_average_time").text(null)
        }
      },
      error: function(userData) {
        console.log('please_sign_in_using_ur_google_account');
        console.log(userData);
      }
    });
  d3.select('#start_viz').classed('hidden',false)
  d3.select('#start_game').classed('hidden',false)
  d3.select('#startpage').classed('hidden',false)
  d3.select('#topbar').classed('blocked',true)

}

    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Extra Stuff

function redraw_svg() {
  d3.selectAll(".edge_line").remove()
  if(nav_min != 0) {
    for (var i = 0; i < 10; i++) {
      svg.append('line').attr('class','edge_line')
        .attr('x1',-margin['left']).attr('y1',2)
        .attr('x2',-margin['left']).attr('y2',height-4)
        .style('stroke','white').style('stroke-width',i*5) 
        .style('stroke-opacity',0.1)
    }
  }
  if(nav_max != ncol) {
    for (var i = 0; i < 10; i++) {
      svg.append('line').attr('class','edge_line')
        .attr('x1',width + i).attr('y1',2)
        .attr('x2',width + i).attr('y2',height-4)
        .style('stroke','white').style('stroke-width',20 - (i*2)) 
        .style('stroke-opacity',0.1)
    }
  }
  curr_cell_width = svg_scale_X(2) - svg_scale_X(1);
  svg.select('.x.axis').call(x_axis);
  d3.selectAll('.rect').attr('width',curr_cell_width)
  for (var i = 0; i < nrow; i++) {
    var curr_row_order = current_index_order.y[i].slice();
    for (var j = 0; j < ncol; j++) {
      var x_corrdinates = (curr_cell_width*(curr_row_order.indexOf(j)-nav_min));
      d3.selectAll('.row_'+i).selectAll('.cell_y'+j).attr('transform','translate('+x_corrdinates+',0)');
      d3.selectAll('.cell_y'+j).select('.cell_text').attr("x", curr_cell_width / 2)
    }
  }
}


  // for (var row in value.y) {                                // Orders each columns.
  //   curr_row_order = value.y[row];
  //   t.selectAll(".cell_x" + row).attr("transform", function(d, i) {
  //     var returner = scale_X(curr_row_order.indexOf(i));
  //     if (returner == undefined) returner = 1000;
  //     return "translate(" + returner + ",0)"; })
  // }


/////////

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
    if (toggle_unq) {
      temp_nav_data.push(orig_nav_data_rep[value.x[i] + 1])
    } else {
      temp_nav_data.push(orig_nav_data[value.x[i] + 1])
    }
  }
  temp_nav_data.push(0)
  curr_nav_data = temp_nav_data;
  // console.log(curr_nav_data);
  d3.select('.nav_line').attr('d', nav_line(curr_nav_data));
}


// d3.select('#topbar').attr('height',35px)

function start_viz() {
  d3.select('#start_viz').classed('hidden',true)
  d3.select('#start_game').classed('hidden',true)
  d3.select('#startpage').classed('hidden',true)
  d3.select('#topbar').classed('blocked',false)
  d3.select('.timer_board_text').text('N/A')
  played_whole_game = false;
  new_data();
  if (toggle_sound) start_game_sound.playclip();
}

function start_game() {
  d3.select('#start_viz').classed('hidden',true)
  d3.select('#start_game').classed('hidden',true)
  d3.select('#startpage').classed('hidden',true)
  d3.select('#topbar').classed('blocked',false)
  myTimer.start(61);
  played_whole_game = false;
  new_data();
}

function toggle_sound_fx() {
  if (toggle_sound) {
    toggle_sound = false;
    d3.select('#toggle_sound').attr('class', 'btn-danger')
  } else {
    toggle_sound = true;
    d3.select('#toggle_sound').attr('class', 'btn-success')
  }
}

function toggle_music_fx() {
  if (toggle_music) {
    toggle_music = false;
    music.pause();
    d3.select('#toggle_music').attr('class', 'btn-danger')
    row_swap_sound   = createsoundbite("sounds/tiny_button_push.mp3")
    col_swap_sound   = createsoundbite("sounds/click.mp3")
    undo_sound       = createsoundbite("sounds/pop_cork.mp3")
    ascending_sound  = createsoundbite("sounds/ascending.mp3")
    descending_sound = createsoundbite("sounds/descending.mp3")
    reset_sound      = createsoundbite("sounds/explosion.mp3")
    countdown_sound  = createsoundbite("sounds/countdown(10-0).mp3")
    start_game_sound = createsoundbite("sounds/hole_punch.mp3")
    d3.select('#body').attr('class','normal')
  } else {
    toggle_music = true;
    music.playclip();
    d3.select('#toggle_music').attr('class', 'btn-success')
    row_swap_sound   = createsoundbite("sounds/bcfire02.mp3") // change
    col_swap_sound   = createsoundbite("sounds/ltsaberhit01.mp3")
    undo_sound       = createsoundbite("sounds/forcesee01.mp3")
    ascending_sound  = createsoundbite("sounds/ESGend0.mp3")
    descending_sound = createsoundbite("sounds/EMGstop.mp3")
    reset_sound      = createsoundbite("sounds/explosion.mp3")
    countdown_sound  = createsoundbite("sounds/countdown(10-0).mp3")
    start_game_sound = createsoundbite("sounds/father.mp3")
    d3.select('#body').attr('class','game')
  }
}