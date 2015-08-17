// Calc Score

// Calculates the score, updates it.
function calc_score(value) {

	// Calculates the scores for the vertical connected ones.
	calc_vertical();

	// resets the path drawn each round
	d3.selectAll('.common_path').remove();

	// gets the 2x2 rectangle indexes. (top left of the four rect is the index.)
	var rectangles = get_rect();

	// Finds modules for the rectangles (optional: true = draws rectangle around it, false = don't draw)
	find_modules(rectangles, false);

	// Updates the scoreboard
	update_score_bd();
}




/////////////////////////////////////////// Helper methods ///////////////////////////////////////////////////


// Calculates repeated occurrences and calcs score for just that.
function calc_vertical() {
	dup_temp = [];
	var score_count = 0;
	for (var i = 0; i < ncol; i++) { // for each column
		var previous = curr_mat[0][i];
		var skip = false;
		var temp_score = 0;
		for (var j = 1; j < nrow; j++) {	// goes thorugh vertically to find vertical match
			var current = curr_mat[j][i];
			if (current != undefined_ind) {	 // first, check it's not undefined cell
				if (previous == current && !skip) {	 // first duplicate located
					dup_temp.push({ x:i, y:j-1, z:1})
					dup_temp.push({ x:i, y:j, z:2});
					skip = true;
					temp_score = 2;
					if (j == nrow-1) score_count += 4;
				} else if (previous == current && skip) {  // continuing down
					dup_temp.push({ x:i, y:j, z:2});
					temp_score++;
					if (j == nrow-1) score_count += Math.pow(temp_score, 2);
				} else if (skip && previous != current) {  // end of continuation.
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
}


// Calculates anything that makes rectangle with 4 or more, returns array of array of coordinates of rectangle
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

	// Returns 2x2 head indexes.
	return two_by_two_head;
}


function find_modules(value, drawit) {
	// get first this module.
	var indexes = value.slice();

	// Get the height of the gene module.
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

		for (var i = 0; i < this_module.length; i++) {
			console.log(current_index_order.x[this_module[i].x]);
			console.log(current_index_order.y[current_index_order.x[this_module[i].x]][this_module.y]);

		}

		console.log(this_module);

		//  calculate score
		curr_score += (((2 * (this_module_max_length + 1)) -1) * Math.pow(max_row_nums.length + 1,2));

		//  draw around this_module
		if (drawit) draw_rect(this_module);
	}
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

////////////////////////////////// helper of helper methods ////////////////////////////////

function draw_rect(value) {
	// line coordinates
	line_data = add_corners(value).slice();

	// creates line fx
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

// gets array of coordinates as parameter, sets boundary as rectangle.
function add_corners(value) {
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

 
// returns the index of the value if it has it right of the value.
function has_right(value, array) {
	if (array.length == 0) return -1;
	var returner = -1;
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == value.x + 1 && array[i].y == value.y) returner = i;
	}
	return returner;
}


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
