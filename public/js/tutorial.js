function tutorial(step) {
	if (step == 'end') {															// ends the tuotorial
		d3.select('#tutorial9').classed('hidden', true);
		d3.selectAll('.tutorial').classed('hidden', true);
		submit_this();
	} else if (step == 1) {														// Welcome message
		location.href = "#";
		d3.select('#tutorial0').classed('hidden', true);
		d3.select('#tutorial1').classed('hidden', false);
		start_game_sound.playclip();
	} else if (step == 2) { 													// sign in
		d3.select('#tutorial1').classed('hidden', true);
		d3.select('#tutorial2').classed('hidden', false);
		start_game_sound.playclip();
	} else if (step == 3) { 													// play game 
		d3.select('#start_game').classed('disabled', true)
		d3.select('#tutorial2').classed('hidden', true);
		d3.select('#tutorial3').classed('hidden', false);
		start_game_sound.playclip();
	} else if (step == 4) {														// Row Label
		start_viz('test_data');
		d3.select('#start_game').classed('disabled', false)
		d3.select('#tutorial3').classed('hidden', true);
		d3.select('#tutorial4').classed('hidden', false);
		d3.select('#start_game').classed('disabled', false);
		start_game_sound.playclip();
	} else if (step == 5) {														// Cell
		d3.select('#tutorial4').classed('hidden', true);
		d3.select('#tutorial5').classed('hidden', false);
		start_game_sound.playclip();
	}	else if (step == 6) {														// modules
		d3.select('#tutorial5').classed('hidden', true);
		d3.select('#tutorial6').classed('hidden', false);
		start_game_sound.playclip();

		location.href = "#";
		location.href = "#tutorial6";
		var line_data = [{x:60,y:440}, {x:178,y:440}, {x:178,y:520}, {x:60,y:520}, {x:60,y:440}]
		var lineFunction = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.interpolate("linear-closed");
			
	// Draws the line
		var lineGraph = svg.append("path").attr("stroke", "white").transition().duration(1500)
			.attr('class', 'tutorial_path')
			.attr("d", lineFunction(line_data))
			.attr("stroke", "red")
			.attr("stroke-width", 2)
			.attr("fill", "none")
			.transition().duration(1500)
			.attr("d", lineFunction(line_data))
			.attr("stroke", "white")
			.attr("stroke-width", 2)
			.attr("fill", "none");
	}	else if (step == 7) {														// Navigation Panel
		d3.select('#tutorial6').classed('hidden', true);
		d3.select('#tutorial7').classed('hidden', false);
		location.href = "#";
		location.href = "#tutorial7";
		start_game_sound.playclip();
	} else if (step == 8) {														// Sound Toggle
		d3.select('#tutorial7').classed('hidden', true);
		d3.select('#tutorial8').classed('hidden', false);
		location.href = "#";
		start_game_sound.playclip();
	} else if (step == 9) {														// Sound Toggle
		d3.select('#tutorial8').classed('hidden', true);
		d3.select('#tutorial9').classed('hidden', false);
		location.href = "#";
		start_game_sound.playclip();
	} 


}