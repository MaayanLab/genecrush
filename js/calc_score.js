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

	// delete all enclosed cell so that you only have outer surrounding cell
	delete_enclosed_cell();

	// draw_path_around(dup_temp);

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

	// get the correct object cell
	// for (i = 0; i < dup_temp.length; i++) {
	// 	var temp_x = value.x[dup_temp[i].x];
	// 	var temp_y = value.y[temp_x][dup_temp[i].y];
	// 	duplicate_xy_list.push({ x:temp_x, y:temp_y });
	// }

	// erase, then highlights the connected cells
	// d3.selectAll('.cell').selectAll(".rect").style('stroke', null);
	// for(i = 0; i < duplicate_xy_list.length; i++) {
	// 	d3.selectAll(".cell_x" + duplicate_xy_list[i].x 
	// 		+ ".cell_y" + duplicate_xy_list[i].y).selectAll(".rect")
	// 		.style("stroke", "red").style("stroke-width", 5);
	// };
}


var line_data;
// gets list of cell coordinates, find out outer boarder, draws lines around it.
function draw_path_around(value) {

	for(i=0; i < 6; i++) {
		dup_temp.shift();
	}

	// while(dup_temp.length > 0) {
		line_data = []
		var first = dup_temp.shift();

		line_data = [{ "x": scale_xy.y(first.x), "y": scale_xy.x(first.y)},
					{ "x": scale_xy.y(first.x), "y": scale_xy.x(first.y + 1)},
					{ "x": scale_xy.y(first.x + 1), "y": scale_xy.x(first.y + 1)},
					{ "x": scale_xy.y(first.x + 1), "y": scale_xy.x(first.y)}];
		draw_around_one(first);

		var lineFunction = d3.svg.line()
				.x(function(d) { return d.x; })
				.y(function(d) { return d.y; })
				.interpolate("basis-closed");

		//The SVG Container
		var svgContainer = d3.select("body")
				.append("svg")
		        .attr("width", width)
		        .attr("height", height);

		var lineGraph = svg.append("path").transition().duration(1000)
				.attr("d", lineFunction(line_data))
				.attr("stroke", "white")
				.attr("stroke-width", 2)
				.attr("fill", "none");
	// }
}



// recursive funtion to add all 
function draw_around_one(value) {
	console.log(value);
	var ind_s = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x && obj.y == value.y + 1) { return index; }})
	var ind_e = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x + 1 && obj.y == value.y) { return index; }})
	var ind_n = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x && obj.y == value.y - 1) { return index; }})
	var ind_w = $.map(dup_temp, function(obj, index) {
	if(obj.x  == value.x - 1 && obj.y == value.y) { return index; }})


	if (ind_s[0] != undefined) {						// go down
		var temp  = dup_temp[ind_s[0]];
		var one   = { "x": scale_xy.y(temp.x), "y": scale_xy.x(temp.y)};
		var two   = { "x": scale_xy.y(temp.x), "y": scale_xy.x(temp.y + 1)};
		var three = { "x": scale_xy.y(temp.x + 1), "y": scale_xy.x(temp.y + 1)};
		var four  = { "x": scale_xy.y(temp.x + 1), "y": scale_xy.x(temp.y)};
		
		for (i = 0; i < line_data.length; i++) {
			if (line_data[i].x == one.x && line_data[i].y == one.y)
				 div_index = i;
		}
		var first_half = line_data.slice(0,div_index);
		var second_half = line_data.slice(div_index + 2, line_data.length);
		var new_line_data = first_half.slice();
		new_line_data.push(one, two, three, four);
		for (var i = 0; i < second_half.length; i++) {
			new_line_data.push(second_half[i]);
		}
		line_data = new_line_data.slice();
		dup_temp.splice(ind_s[0], 1);
		draw_around_one(temp);
	} else if (ind_e[0] != undefined) {					// go right
		var temp  = dup_temp[ind_e[0]];
		var one   = { "x": scale_xy.y(temp.x), 		"y": scale_xy.x(temp.y)};        
		var two   = { "x": scale_xy.y(temp.x), 		"y": scale_xy.x(temp.y + 1)};    
		var three = { "x": scale_xy.y(temp.x + 1), 	"y": scale_xy.x(temp.y + 1)};
		var four  = { "x": scale_xy.y(temp.x + 1), 	"y": scale_xy.x(temp.y)};    
		
		for (i = 0; i < line_data.length; i++) {
			if (line_data[i].x == two.x && line_data[i].y == two.y)
				 div_index = i;
		}
		var first_half = line_data.slice(0,div_index);
		var second_half = line_data.slice(div_index + 2, line_data.length);
		var new_line_data = first_half.slice();
		new_line_data.push(two, three, four, one);
		for (var i = 0; i < second_half.length; i++) {
			new_line_data.push(second_half[i]);
		}
		line_data = new_line_data.slice();
		dup_temp.splice(ind_e[0], 1);
		draw_around_one(temp);
	} else if (ind_n[0] != undefined) {					// go up 
		var temp  = dup_temp[ind_n[0]];
		var one   = { "x": scale_xy.y(temp.x), "y": scale_xy.x(temp.y)};
		var two   = { "x": scale_xy.y(temp.x), "y": scale_xy.x(temp.y + 1)};
		var three = { "x": scale_xy.y(temp.x + 1), "y": scale_xy.x(temp.y + 1)};
		var four  = { "x": scale_xy.y(temp.x + 1), "y": scale_xy.x(temp.y)};
		
		for (i = 0; i < line_data.length; i++) {
			if (line_data[i].x == three.x && line_data[i].y == three.y)
				 div_index = i;
		}
		var first_half = line_data.slice(0,div_index);
		var second_half = line_data.slice(div_index + 1, line_data.length);
		var new_line_data = first_half.slice();
		new_line_data.push(three, four, one);
		for (var i = 0; i < second_half.length; i++) {
			new_line_data.push(second_half[i]);
		}
		line_data = new_line_data.slice();
		dup_temp.splice(ind_n[0], 1);
		draw_around_one(temp);	
	} else if (ind_w[0] != undefined) {					// go left
		var temp  = dup_temp[ind_w[0]];
		var one   = { "x": scale_xy.y(temp.x), "y": scale_xy.x(temp.y)};
		var two   = { "x": scale_xy.y(temp.x), "y": scale_xy.x(temp.y + 1)};
		var three = { "x": scale_xy.y(temp.x + 1), "y": scale_xy.x(temp.y + 1)};
		var four  = { "x": scale_xy.y(temp.x + 1), "y": scale_xy.x(temp.y)};
		
		for (i = 0; i < line_data.length; i++) {
			if (line_data[i].x == four.x && line_data[i].y == four.y)
				 div_index = i;
		}
		console.log(line_data);
		console.log(div_index);
		var first_half = line_data.slice(0,div_index);
		var second_half = line_data.slice(div_index + 2, line_data.length);
		var new_line_data = first_half.slice();
		new_line_data.push(four, one, two);
		for (var i = 0; i < second_half.length; i++) {
			new_line_data.push(second_half[i]);
		}
		line_data = new_line_data.slice();
		dup_temp.splice(ind_w[0], 1);
		draw_around_one(temp);	
	} else {
		console.log('you got no place to go');
	}

	/// just add on everything, and at each round, when you see a duplicate coordinates, just slice them off
	

}



function delete_enclosed_cell() {
	length = dup_temp.length;
	for (i = 0; i < length; i++) {
		
	}
	console.log(dup_temp.length);

}




















