// Calc Score

// var line_data;
// var unq_line_data;
// var dup_real;

// Calculates the score, updates it.
function calc_score(value) {

	calc_vertical();
	get_rect();
	update_score_bd();

}

// Calculates repeated occurrences and calcs score for just that.
function calc_vertical() {
	dup_temp = [];
	var score_count = 0;
	for (i = 0; i < ncol; i++) {															// for each column
		var previous = curr_mat[0][i];
		var skip = false;
		var temp_score = 0;
		for (j = 1; j < nrow; j++) {														// goes thorugh vertically to find vertical match
			var current = curr_mat[j][i];
			if (current != undefined_ind) {												// first, check it's not undefined cell
				if (previous == current && !skip) {									// first duplicate located
					dup_temp.push({ x:i, y:j-1 })
					dup_temp.push({ x:i, y:j });
					skip = true;
					temp_score = 2;
					if (j == nrow-1) score_count += 4;
				} else if (previous == current && skip) {						// continuing down
					dup_temp.push({ x:i, y:j });
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
	curr_score = score_count;
}

// Calculates anything that makes rectangle with 4 or more, 
// returns array of array of coordinates of rectangle
function get_rect() {
	var temp = dup_temp.slice();
	for (var i = 0; i < temp.length; i++) {
		console.log(temp[i]);
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

// Functions to help other functions.
function has_right() {
	
}





// commented out all the recursive outer edge lines
{
	///////// this was in the calc_score function//////////////
	// // reset
	// d3.selectAll(".common_path").attr('stroke', null);

	// // draw edges around
	// while (dup_temp.length > 0) {
	// 	dup_real = [];
	// 	dup_real = get_a_set(dup_temp.shift()).slice();
	// 	dup_real = get_unq(dup_real);

	// 	remove_inner_cell();
	// 	draw_path_around();
	///////////////////////////////////////////////////////////




	// // gets list of cell coordinates, find out outer boarder, draws lines around it.
	// function draw_path_around() {

	// 	line_data = [];

	// 	get_edges_of_all();
	// 	// console.log(line_data);
	// 	order_edges();

	// 	var lineFunction = d3.svg.line()
	// 			.x(function(d) { return d.x; })
	// 			.y(function(d) { return d.y; })
	// 			.interpolate("basis-closed");

	// 	//The SVG Container


	// 	// Draws the line
	// 	var lineGraph = svg.append("path").transition().duration(1000)
	// 			.attr('class', 'common_path')
	// 			.attr("d", lineFunction(line_data))
	// 			.attr("stroke", "white")
	// 			.attr("stroke-width", 2)
	// 			.attr("fill", "none");
	// }

	// function unq_line_data_contains(value) {
	// 	if (unq_line_data.length == 0) return -1;
	// 	for (var i = 0; i < unq_line_data.length; i++) {
	// 		if (unq_line_data[i].x == value.x && unq_line_data[i].y == value.y) {
	// 			return i;
	// 		}
	// 	}
	// 	return -1;
	// }

	// // recursive funtion to add all 
	// function get_edges_of_all() {
	// 	for(var i = 0; i < dup_real.length; i++) {
	// 		var temp = get_four_corners(dup_real[i]).slice();
	// 		for (j = 0; j < 4; j++)
	// 			line_data.push(temp[j]);
	// 	}
		
	// 	// get unique ones in "unq_line_data"
	// 	unq_line_data = [];
	// 	for (var i = 0; i < line_data.length; i++) {
	// 		if (unq_line_data_contains(line_data[i]) == -1) {
	// 			unq_line_data.push(line_data[i]);
	// 		}
	// 	}

	// 	// get unique point counts
	// 	var count_unq_line_data = Array.apply(null, Array(unq_line_data.length))
	// 		.map(Number.prototype.valueOf,0);
	// 	for (var i = 0; i < line_data.length; i++) {
	// 		for (var j = 0; j < unq_line_data.length; j++) {
	// 			if (is_point_equal(line_data[i], unq_line_data[j])) {
	// 				count_unq_line_data[j]++;
	// 			}
	// 		}
	// 	}


	// 	var remove2 = [];
	// 	var remove3 = [];
	// 	var remove4 = [];
	// 	for (var i = 0; i < count_unq_line_data.length; i++) {
	// 		if (count_unq_line_data[i] == 2) {
	// 			remove2.push(unq_line_data[i]);
	// 		} else if (count_unq_line_data[i] == 3) {
	// 			remove3.push(unq_line_data[i]);
	// 		} else if (count_unq_line_data[i] == 4) {
	// 			remove4.push(unq_line_data[i]);
	// 		}
	// 	}


	// 	// removes duplicates
	// 	for (var i = 0; i < remove2.length; i++) {
	// 		var once = 0;
	// 		for (var j = line_data.length - 1; j >= 0; j--) {
	// 			if (is_point_equal(remove2[i], line_data[j]) && once < 1 ) {
	// 				line_data.splice(j, 1);
	// 				once++;
	// 			}
	// 		}
	// 	}

	// 	// removes 3 !!!!
	// 	for (var i = 0; i < remove3.length; i++) {
	// 		var twice = 0;
	// 		for (var j = line_data.length - 1; j >= 0; j--) {
	// 			if (is_point_equal(remove3[i], line_data[j]) && twice < 2 ) {
	// 				line_data.splice(j, 1);
	// 				twice++;
	// 			}
	// 		}
	// 	}

	// 	// removes 4
	// 	for (var i = 0; i < remove4.length; i++) {
	// 		for (var j = line_data.length - 1; j >= 0; j--) {
	// 			if (is_point_equal(remove4[i], line_data[j])) {
	// 				line_data.splice(j, 1);
	// 			}
	// 		}
	// 	}
	// }

	// function order_edges() {
	// 	var new_line_data = [];

	// 	for (var i = 0; i < line_data.length; i++) {
	// 	}

	// 	var next = line_data.shift();
	// 	new_line_data.push(next);

	// 	while (line_data.length > 0) {
	// 		var temp_ind = whats_next(next);
	// 		next = line_data[temp_ind];
	// 		new_line_data.push(next);
	// 		line_data.splice(temp_ind,1);
	// 	}
	// 	line_data = new_line_data.slice();
	// }

	// function remove_inner_cell() {
	// 	var delete_index = [];
	// 	for (var i = 0; i < dup_real.length; i++) {
	// 		var curr = dup_real[i];
	// 		if (has_up(curr) != undefined && has_down(curr) != undefined
	// 			&& has_left(curr) != undefined && has_right(curr) != undefined)
	// 			delete_index.push(i);
	// 	}
	// 	var temp = delete_index.length
	// 	for(var i = 0; i < temp; i++) {
	// 		dup_real.splice(delete_index[i], 1);
	// 	}
	// }

	// function whats_next(value) {
	// 	var north = { "x": value.x, "y": value.y - scale_xy.x(1)};
	// 	var south = { "x": value.x, "y": value.y + scale_xy.x(1)};
	// 	var east  = { "x": value.x + scale_xy.y(1), "y": value.y};
	// 	var west  = { "x": value.x - scale_xy.y(1), "y": value.y};
		
	// 	var index = -1;

	// 	for (var i = 0; i < line_data.length; i++) {
	// 		if (is_point_equal(line_data[i], east) ) {
	// 				index = i;
	// 			}
	// 	}
	// 	for (var i = 0; i < line_data.length; i++) {
	// 		if (is_point_equal(line_data[i], west) ) {
	// 				index = i;
	// 			}
	// 	}
	// 	for (var i = 0; i < line_data.length; i++) {
	// 		if (is_point_equal(line_data[i], south) ) {
	// 				index = i;
	// 			}
	// 	}
	// 	for (var i = 0; i < line_data.length; i++) {
	// 		if (is_point_equal(line_data[i], north) ) {
	// 				index = i;
	// 			}
	// 	}
	// 	return index;
	// }

	// function is_point_equal(value1, value2) {
	// 	if (value1.x == undefined || value1.y == undefined 
	// 		|| value2.x == undefined || value2.y == undefined) {
	// 		return false;
	// 	} else if (value1.x.toFixed(2) == value2.x.toFixed(2) && value1.y.toFixed(2) == value2.y.toFixed(2)) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	// function get_four_corners(value) {
	// 	var one   = { "x": scale_xy.y(value.x), "y": scale_xy.x(value.y)};
	// 	var two   = { "x": scale_xy.y(value.x), "y": scale_xy.x(value.y + 1)};
	// 	var three = { "x": scale_xy.y(value.x + 1), "y": scale_xy.x(value.y + 1)};
	// 	var four  = { "x": scale_xy.y(value.x + 1), "y": scale_xy.x(value.y)};
	// 	var returner = [one, two, three, four];
	// 	return returner;
	// }

	// function has_down(value) {
	// 	var ind = $.map(dup_temp, function(obj, index) {
	// 	if(obj.x  == value.x && obj.y == value.y + 1) { return index; }})
	// 	return ind[0];
	// }

	// function has_up(value) {
	// 	var ind = $.map(dup_temp, function(obj, index) {
	// 	if(obj.x  == value.x && obj.y == value.y - 1) { return index; }})
	// 	return ind[0];
	// }

	// function has_right(value) {
	// 	var ind = $.map(dup_temp, function(obj, index) {
	// 	if(obj.x  == value.x + 1 && obj.y == value.y) { return index; }})
	// 	return ind[0];
	// }

	// function has_left(value) {
	// 	var ind = $.map(dup_temp, function(obj, index) {
	// 	if(obj.x  == value.x - 1 && obj.y == value.y) { return index; }})
	// 	return ind[0];
	// }

	// function has_neighbor(value) {
	// 	if (has_left(value) != undefined) return has_left(value);
	// 	else if (has_right(value) != undefined) return has_right(value);
	// 	else if (has_up(value) != undefined) return has_up(value);
	// 	else if (has_down(value) != undefined) return has_down(value);
	// 	else return -1;
	// }


	// function get_a_set(value) {
	// 	var returner = [];
	// 	returner.push(value);

	// 	if (has_up(value) != undefined) {
	// 		returner.push(dup_temp[has_up(value)]);
	// 		dup_temp.splice(has_up(value), 1);
	// 		var temp = get_a_set({x:value.x, y:value.y - 1});
	// 		for (var i = 0; i < temp.length; i++) {
	// 			returner.push(temp[i]);
	// 		}
	// 	}
	// 	if (has_left(value) != undefined) {
	// 		returner.push(dup_temp[has_left(value)]);
	// 		dup_temp.splice(has_left(value), 1);
	// 		var temp = get_a_set({x:value.x - 1, y:value.y});
	// 		for (var i = 0; i < temp.length; i++) {
	// 			returner.push(temp[i]);
	// 		}
	// 	}
	// 	if (has_down(value) != undefined) {
	// 		returner.push(dup_temp[has_down(value)]);
	// 		dup_temp.splice(has_down(value), 1);
	// 		var temp = get_a_set({x:value.x, y:value.y + 1});
	// 		for (var i = 0; i < temp.length; i++) {
	// 			returner.push(temp[i]);
	// 		}
	// 	} 
	// 	if (has_right(value) != undefined) {
	// 		returner.push(dup_temp[has_right(value)]);
	// 		dup_temp.splice(has_right(value), 1);
	// 		var temp = get_a_set({x:value.x + 1, y:value.y});	
	// 		for (var i = 0; i < temp.length; i++) {
	// 			returner.push(temp[i]);
	// 		}
	// 	}

	// 	return returner;
	// }

	// function get_unq(value) {
	// 	var temp = value.slice();
	// 	var returner =[];
	// 	for (var i = 0; i < temp.length; i++) {
	// 		var found = false;
	// 		for (var j = 0; j < returner.length; j++) {
	// 			if (temp[i].x == returner[j].x && temp[i].y == returner[j].y) {

	// 				found = true;
	// 			}
	// 		}
	// 		if (!found) {
	// 			returner.push(temp[i]);			
	// 		}
	// 	}
	// 	return returner.slice();
	// }
}
