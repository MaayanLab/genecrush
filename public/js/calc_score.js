// Calc Score

// var line_data;
// var unq_line_data;
// var dup_real;

// Calculates the score, updates it.
function calc_score(value) {

	calc_vertical();

	// // temporary red mark for common genes
	// for (var i = 0; i < dup_temp.length; i++) {
	// 	d3.selectAll(".cell_x" + dup_temp[i].y + ".cell_y" + dup_temp[i].x).selectAll(".rect").style('stroke', 'red').style('stroke-width', 5);
	// 	// console.log(dup_temp[i].z)
	// }
	// ////////////////////////////////////

	// reset each round
	d3.selectAll('.common_path').remove();

	// d3.selectAll('.common_path').attr('stroke', null)
	var rectangles = get_rect();
	find_modules(rectangles);
	// for (var i = 0; i < rectangles.length; i++) {
	// 	draw_rect(rectangles[i]);
	// }
	update_score_bd();
}

//TODO cleanup the code here points
// Calculates repeated occurrences and calcs score for just that.
function calc_vertical() {
	dup_temp = [];
	var score_count = 0;
	for (var i = 0; i < ncol; i++) {															// for each column
		var previous = curr_mat[0][i];
		var skip = false;
		var temp_score = 0;
		for (var j = 1; j < nrow; j++) {														// goes thorugh vertically to find vertical match
			var current = curr_mat[j][i];
			if (current != undefined_ind) {												// first, check it's not undefined cell
				if (previous == current && !skip) {									// first duplicate located
					dup_temp.push({ x:i, y:j-1, z:1})
					dup_temp.push({ x:i, y:j, z:2});
					skip = true;
					temp_score = 2;
					if (j == nrow-1) score_count += 4;
				} else if (previous == current && skip) {						// continuing down
					dup_temp.push({ x:i, y:j, z:2});
					temp_score++;
					if (j == nrow-1) score_count += Math.pow(temp_score, 2);
				} else if (skip && previous != current) {						// end of continuation.
					skip = false;
					score_count += Math.pow(temp_score,2);
					temp_score = 0;
				}
			}
			previous = current;
		}
	}
	prev_score = curr_score;
	curr_score = 0;
	// curr_score = score_count;
}

// Calculates anything that makes rectangle with 4 or more,
// returns array of array of coordinates of rectangle
function get_rect() {
	var two_by_two_head = [];
	var two_by_two = [];
	var returner = [];
	var set = [];
	var counter =0;
	for (var i = 0; i < dup_temp.length; i++) {
		var curr = dup_temp[i];
		if (has_right(curr, dup_temp) != -1 && has_bot(curr, dup_temp) != -1 && has_right_bot(curr, dup_temp) != -1) {
			if (dup_temp[has_bot(curr, dup_temp)].z != 1 && dup_temp[has_right_bot(curr, dup_temp)].z != 1) {
				counter++;
				two_by_two_head.push(curr);		// curr cell
			}
		}
	}

	// two by two gets all the cell coordinates
	for (var i = 0; i < two_by_two_head.length; i++) {
		var temp = [];
		temp.push(two_by_two_head[i]);
		temp.push(dup_temp[has_right(two_by_two_head[i], dup_temp)]);
		temp.push(dup_temp[has_bot(two_by_two_head[i], dup_temp)]);
		temp.push(dup_temp[has_right_bot(two_by_two_head[i], dup_temp)]);
		two_by_two.push(temp);
	}

	// // temporary red mark for common genes
	// for (var i = 0; i < two_by_two.length; i++) {
	// 	for (var j = 0; j < 4; j++) {
	// 	d3.selectAll(".cell_x" + two_by_two[i][j].y + ".cell_y" + two_by_two[i][j].x).selectAll(".rect").style('stroke', 'red').style('stroke-width', 5);
	// 	// console.log(dup_temp[i].z)
	// 	}
	// }
	// ////////////////////////////////////
	// for (var i = 0; i < 5; i++) { //two_by_two_head.length


	// var safety = 20;
	// var exit = false;
	// while (two_by_two_head.length > 0 && !exit)	{
	// 	safety--;
	// 	console.log('safety: ' + safety);
	// 	// console.log('two_by_two_head below: ' + two_by_two_head.length);
	// 	// for (var i = 0; i < two_by_two_head.length; i++) {
	// 	// 	console.log(two_by_two_head[i]);
	// 	// }
	// 	if (has_right(two_by_two_head[0], two_by_two_head) != -1) {						// has right
	// 		if (has_bot(two_by_two_head[0], two_by_two_head) != -1
	// 			&& has_right_bot(two_by_two_head[0], two_by_two_head) != -1) {		// also has bot and bot-right
	// 			returner.push(look_bot_right(two_by_two_head[0], two_by_two, two_by_two_head));
	// 		} else {																														// only has right
	// 			returner.push(look_right(two_by_two_head[0], two_by_two, two_by_two_head));
	// 		}
	// 	} else {																															// doesn't have right
	// 		if (has_bot(two_by_two_head[0], two_by_two_head) != -1) {						// but has bot
	// 			returner.push(look_bot(two_by_two_head[0], two_by_two, two_by_two_head));
	// 		} else {																														// don't have right nor bot
	// 			two_by_two_head.splice(0, 1);
	// 			returner.push(two_by_two.splice(0, 1)[0]);
	// 		}
	// 	}
	// 	// console.log(returner);
	// 	if (safety == 0) exit = true;
	// }

	// console.log('========dup_temp==========' + dup_temp.length);
	// console.log(dup_temp);
	// console.log('');
	// console.log('========two_by_two========' + two_by_two.length);
	// console.log(two_by_two);
	// console.log('');
	// console.log('========two_by_two_head========' + two_by_two_head.length);
	// console.log(two_by_two_head);
	// console.log('');
	// console.log('========returner========' + returner.length);
	// console.log(returner);
	// console.log('');
	return two_by_two_head;
}

function find_modules(value) {

	// get first this module.
	var indexes = value.slice();

	while (indexes.length > 0) {
		var this_module = [];
		var this_row_module = [];
		var this_module_height = 1;
		var temp = indexes.shift();
		this_row_module.push(temp);
		while (has_bot(temp, indexes) != -1) {
			temp = get_bot(temp, indexes);
			this_row_module.push(temp);
			this_module_height++;
		}

		// find maximum length of genes
		var this_module_max_length = 0;
		for (var i = 0; i < this_module_height; i++) {
			temp = this_row_module[i];
			var row_length = 1;
			while (has_right(temp, indexes) != -1) {
				temp = indexes[has_right(temp, indexes)];
				row_length++;
			}
			if (this_module_max_length < row_length) this_module_max_length = row_length;
		}

		// get the longest row #s
		var max_row_nums = [];
		var not_max_row_nums = [];
		for (var i = 0; i < this_module_height; i++) {
			temp = this_row_module[i];
			var row_length = 1;
			while (has_right(temp, indexes) != -1) {
				temp = indexes[has_right(temp, indexes)];
				row_length++;
			}
			if (this_module_max_length == row_length) max_row_nums.push(i);
			else not_max_row_nums.push(i);
		}

		// add longest rows into this_module
		for (var i = 0; i < max_row_nums.length; i++) {
			var temp = this_row_module[max_row_nums[i]];
			this_module.push(temp);
			for (var j = 0; j < this_module_max_length - 1; j++) {
				temp = get_right(temp, indexes);
				this_module.push(temp);
			}
		}

		// remove everything else that went thorugh this module.
		for (var i = 0; i < not_max_row_nums.length; i++) {
			var temp = this_row_module[not_max_row_nums[i]];
			while (has_right(temp, indexes) != -1) {
				temp = get_right(temp, indexes);
			}
		}


		//  calculate score
		curr_score += (((2 * (this_module_max_length + 1)) -1) * Math.pow(max_row_nums.length + 1,2));

		//  draw around this_module
		draw_rect(this_module);
	}
}


function look_bot_right(value, two_by_two, two_by_two_head) {
	var sq_size = 1;
	var exit = false;
	var returner = [];
	var area_of_sq = 1;

	while (!exit) {						// looks for the combination that makes the max square
		sq_size++;
		for (var x = 0; x < sq_size; x++) {
			for (var y = 0; y < sq_size; y++) {
				temp = {x:value.x+x, y:value.y+y};
				if (indexOf(temp, two_by_two_head) == -1) exit = true;
			}
		}
	}
	area_of_sq = sq_size * sq_size;
	sq_size--;





	exit = false;							// checks if area of horizontally longer rect is greater than the sq.
	var max_col_length = 0;;
	var that_row = 0;
	var that_row_length = 0;
	for (var row = 0; row < sq_size; row++) {
		temp = {x:value.x, y:value.y+row}
		var col_length = 1;
		while (has_right(temp, two_by_two_head) != -1) {
			temp = {x:temp.x + 1, y:temp.y}
			col_length++;
		}
		if (max_col_length < col_length) {
			max_col_length = col_length;
			that_row = row;
			that_row_length++;
		}
	}
	// console.log(max_col_length);
	// console.log(that_row);
	// console.log(that_row_length);
	// console.log(value);
	// if ((max_col_length+1) * (that_row_length+1) > area_of_sq) {
	// 	for (var x = 0; x < max_col_length + 1; x++) {				// get that horiz rect out.
	// 		for (var y = that_row; y < that_row_length + 1; y++) {
	// 			temp = {x:value.x+x, y:value.y+y};
	// 			var ind = indexOf(temp, two_by_two_head);
	// 			if (x >= 0 && y >= that_row && x < max_col_length && y < that_row_length ) {
	// 				returner.push.apply(returner, two_by_two[ind]);
	// 			}
	// 			if (ind != -1) {
	// 				two_by_two_head.splice(ind, 1);
	// 				two_by_two.splice(ind, 1);
	// 			}
	// 		}
	// 	}
	// } else {
		for (var x = 0; x < sq_size + 1; x++) {				// get that square out.
			for (var y = 0; y < sq_size + 1; y++) {
				temp = {x:value.x+x, y:value.y+y};
				var ind = indexOf(temp, two_by_two_head);
				if (x < sq_size && y < sq_size ) {
					returner.push.apply(returner, two_by_two[ind]);
				}
				if (ind != -1) {
					two_by_two_head.splice(ind, 1);
					two_by_two.splice(ind, 1);
				}
			}
		}
	// }






	// console.log(sq_size);
	// console.log(area_of_sq);
	return returner;
}

function look_right(value, two_by_two, two_by_two_head) {
	var returner = [];
	var temp = value;
	var ind = indexOf(temp, two_by_two_head);
	returner.push.apply(returner, two_by_two[ind]);
	two_by_two_head.splice(ind, 1);
	two_by_two.splice(ind, 1);

	while (has_right(temp, two_by_two_head) != -1) {
		ind = has_right(temp, two_by_two_head);
		temp = two_by_two_head[ind];
		returner.push(two_by_two[ind][1]);
		returner.push(two_by_two[ind][3]);
		two_by_two_head.splice(ind, 1);
		two_by_two.splice(ind, 1);
	}
	return returner;
}

function look_bot(value, two_by_two, two_by_two_head) {
	var returner = [];
	var temp = value;
	var ind = indexOf(temp, two_by_two_head);
	returner.push.apply(returner, two_by_two[ind]);
	two_by_two_head.splice(ind, 1);
	two_by_two.splice(ind, 1);

	while (has_bot(temp, two_by_two_head) != -1) {
		ind = has_bot(temp, two_by_two_head);
		temp = two_by_two_head[ind];
		returner.push(two_by_two[ind][2]);
		returner.push(two_by_two[ind][3]);
		two_by_two_head.splice(ind, 1);
		two_by_two.splice(ind, 1);
	}
	return returner;
}

function indexOf(value, array) {
	returner = -1;
	for (var i = array.length - 1; i >= 0; i--) {
		if (array[i].x == value.x && array[i].y == value.y) returner = i;
	}
	return returner;
}

//TODO repaint is off drawing rect
// TODO wrong rectangle highlights due to index issues
// Draws path of outer set of rectangles.
function draw_rect(value) {
	line_data = add_corners(value).slice();
	// order_edges();
	// console.log(line_data);

	// console.log('========line_data========' + line_data.length);
	// console.log(line_data);
	// console.log('');

	var lineFunction = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.interpolate("linear-closed");

	// Draws the line
	var lineGraph = svg.append("path").attr("stroke", "red").transition().duration(1000)
			.attr('class', 'common_path')
			.attr("d", lineFunction(line_data))
			.attr("stroke", "white")
			.attr("stroke-width", 2)
			.attr("fill", "none");
}

// Updates the score board with animation.
function update_score_bd() {
	if (curr_score > prev_score) {
		d3.select('.score_board_text').text(curr_score)
			.attr("font-size", 100).attr("y", (height_sc - 20) / 2)
			.attr("fill", "green").attr("y", height_sc / 2 + 13);
		d3.select('.score_board_text').transition().duration(800)
			.attr("font-size", 50).attr("fill","black").attr("y", height_sc / 2 + 8);
	} else if (curr_score < prev_score) {
		d3.select('.score_board_text').text(curr_score)
			.attr("font-size", 120).attr("y", (height_sc - 20) / 2)
			.attr("fill", "red").attr("y", height_sc / 2 + 13);
		d3.select('.score_board_text').transition().duration(800)
			.attr("font-size", 50).attr("fill","black").attr("y", height_sc / 2 + 8);
	}
}



// Functions to help other functions.

// returns the index of the value if it has it right of the value.
function has_right(value, array) {
	if (array.length == 0) return -1;
	var returner = -1;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x + 1 && array[i].y == value.y) returner = i;
	}
	return returner;
}

// TODO fix everywhere when you call has_ function, return true or false instead of the index.
// returns the index of the value if it has it right of the value.
function has_bot(value, array) {
	if (array.length == 0) return -1;
	var returner = -1;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x && array[i].y == value.y + 1) returner = i;
	}
	return returner;
}

// returns the index of the value if it has it right of the value.
function has_right_bot(value, array) {
	if (array.length == 0) return -1;
	var returner = -1;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x + 1 && array[i].y == value.y + 1) returner = i;
	}
	return returner;
}

// returns the index of the value if it has it right of the value.
function get_right(value, array) {
	if (array.length == 0) return -1;
	var ind;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x + 1 && array[i].y == value.y) ind = i;
	}
	var returner = array[ind];
	array.splice(ind, 1);
	return returner;
}

// returns the index of the value if it has it right of the value.
function get_bot(value, array) {
	if (array.length == 0) return -1;
	var ind;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x && array[i].y == value.y + 1) ind = i;
	}
	var returner = array[ind];
	array.splice(ind, 1);
	return returner;
}

// returns the index of the value if it has it right of the value.
function get_right_bot(value, array) {
	if (array.length == 0) return -1;
	var ind;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x + 1 && array[i].y == value.y + 1) ind = i;
	}
	var returner = array[ind];
	array.splice(ind, 1);
	return returner;
}

function get_its_own(value, array) {
	if (array.length == 0) return -1;
	var ind;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x && array[i].y == value.y) ind = i;
	}
	var returner = array[ind];
	array.splice(ind, 1);
	return returner;
}


// gets array of coordinates as parameter, sets boundary as rectangle.
function add_corners(value) {
	// curr_cell_width = svg_scale_X(2) - svg_scale_X(1);
 //  svg.select('.x.axis').call(x_axis);
 //  d3.selectAll('.rect').attr('width',curr_cell_width)
 //  for (var i = 0; i < nrow; i++) {
 //    var curr_row_order = current_index_order.y[i].slice();
 //    for (var j = 0; j < ncol; j++) {
 //      var x_corrdinates = (curr_cell_width*(curr_row_order.indexOf(j)-nav_min));
 //      d3.selectAll('.row_'+i).selectAll('.cell_y'+j).attr('transform','translate('+x_corrdinates+',0)');
 //      d3.selectAll('.cell_y'+j).select('.cell_text').attr("x", curr_cell_width / 2)
 //    }
 //  }
	var top = nrow;
	var left = ncol;
	var bottom = 0;
	var right = 0;
	for (var i = 0; i < value.length; i++) {
		if (value[i].y < top) top = value[i].y;
		if (value[i].y > bottom) bottom = value[i].y;
		if (value[i].x < left) left = value[i].x;
		if (value[i].x > right) right = value[i].x;
	}
	bottom++;
	bottom++;
	right++;
	right++;
	var returner = [];
	top = scale_Y(top);
	left = svg_scale_X(left);
	bottom = scale_Y(bottom);
	right = svg_scale_X(right);
	if (bottom == undefined) bottom = height;
	if (right == undefined) right = width;
	returner.push({x:left, y:top});
	returner.push({x:left, y:bottom});
	returner.push({x:right, y:bottom});
	returner.push({x:right, y:top});
	return returner;
}