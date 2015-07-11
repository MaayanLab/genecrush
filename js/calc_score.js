// Calc Score


function calc_score(value) {
	// duplicate_xy_list = [];
	dup_temp = [];
	// Goes through vertically.
	var score_count = 0;
	for (i = 0; i < ncol; i++) {
		var previous = curr_mat[0][i];
		var skip = false;
		var temp_score = 0;
		for (j = 1; j < nrow; j++) {
			var current = curr_mat[j][i];
			if (current != undefined_ind) {				// check it's not undefined cell
				if (previous == current && !skip) {			// first duplicate located
					dup_temp.push({ x:i, y:j-1 })
					dup_temp.push({ x:i, y:j });
					skip = true;
					temp_score = 2;
					if (j == nrow-1) score_count += 4;
				} else if (previous == current && skip) {	// continuing down
					dup_temp.push({ x:i, y:j });
					temp_score++;
					if (j == nrow-1) score_count += Math.pow(temp_score, 2);
				} else if (skip && previous != current) {	// end of continuation.
					skip = false;
					score_count += Math.pow(temp_score,2);
					temp_score = 0;
				}
			}
			previous = current;
		}
	}

	// remove inner surrounded cells.
	remove_inner_cell();

	draw_path_around();

	prev_score = curr_score;
	curr_score = score_count;

	// Changes the score on the scoreboard.
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


var line_data;
// gets list of cell coordinates, find out outer boarder, draws lines around it.
function draw_path_around() {
	line_data = [];

	for(var i = 0; i < 2; i++) {
		var temp = get_four_corners(dup_temp[i]).slice();
		for (j = 0; j < 4; j++)
			line_data.push(temp[j]);
	}
	console.log(line_data);
	
	var temp = line_data.length; 
	// for (var i = 0; i < temp; i++) {
		// for (var j = i + 1; j < temp; j++) 
	// }

		
		// draw_around_one(first);

		var lineFunction = d3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("basis-closed");

		//The SVG Container
		var svgContainer = d3.select("body")
				.append("svg")
		        .attr("width", width)
		        .attr("height", height);

		// Draws the line
		var lineGraph = svg.append("path").transition().duration(1000)
				.attr("d", lineFunction(line_data))
				.attr("stroke", "white")
				.attr("stroke-width", 2)
				.attr("fill", "none");
}



// recursive funtion to add all 
function draw_around_one(value) {
	if (is_point_equal(first, value)) {
		console.log(value);
	} else if (has_down(value) != undefined) {
		// delete down cell from the list
		// merge with the bottom.
	} else if (has_right(value) != undefined) {

	} else if (has_up(value) != undefined) {

	} else if (has_left(value) != undefined) {

	}

}

function remove_inner_cell() {
	var delete_index = [];
	for (var i = 0; i < dup_temp.length; i++) {
		var curr = dup_temp[i];
		if (has_up(curr) != undefined && has_down(curr) != undefined
			&& has_left(curr) != undefined && has_right(curr) != undefined)
			delete_index.push(i);
	}
	var temp = delete_index.length
	for(var i = 0; i < temp; i++) {
		dup_temp.splice(delete_index[i], 1);
	}
}

function is_point_equal(value1, value2) {
	if (value1.x == value2.x && value1.y == value2.y) {
		return true;
	} else {
		return false;
	}
}

function get_four_corners(value) {
	var one   = { "x": scale_xy.y(value.x), "y": scale_xy.x(value.y)};
	var two   = { "x": scale_xy.y(value.x), "y": scale_xy.x(value.y + 1)};
	var three = { "x": scale_xy.y(value.x + 1), "y": scale_xy.x(value.y + 1)};
	var four  = { "x": scale_xy.y(value.x + 1), "y": scale_xy.x(value.y)};
	var returner = [one, two, three, four];
	return returner;
}

function has_down(value) {
	var ind = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x && obj.y == value.y + 1) { return index; }})
	return ind[0];
}

function has_up(value) {
	var ind = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x && obj.y == value.y - 1) { return index; }})
	return ind[0];
}

function has_right(value) {
	var ind = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x + 1 && obj.y == value.y) { return index; }})
	return ind[0];
}

function has_left(value) {
	var ind = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x - 1 && obj.y == value.y) { return index; }})
	return ind[0];
}

function merge(value) {
	get_four_corners(value);
	for (i = 0; i < line_data.length; i++) {
		if (line_data[i].x == one.x && line_data[i].y == one.y)
		div_index = i;
	}
	var first_half = line_data.slice(0,div_index);
	var second_half = line_data.slice(div_index + 2, line_data.length);
	var new_line_data = first_half.slice();
}







