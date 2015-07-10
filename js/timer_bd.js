// timer_board

// Constants
var margin_sc = { top: 0, right: 0, bottom: 0, left: 0 },
    width_sc = 200,
    height_sc = 100;

// timer SVG.
var timer_board = d3.select("#timer").append("svg")
    .attr("width", width_sc + margin_sc.left + margin_sc.right)
    .attr("height", height_sc + margin_sc.top + margin_sc.bottom)
    .style("margin-left", -margin_sc.left + "px").append("g")
    .attr("transform", "translate(" + margin_sc.left + "," + margin_sc.top + ")")

timer_board.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", width_sc)
	.attr("height", height_sc)
	.attr("rx", 20)
    .attr("ry", 20)
	.style("fill", "orange")
	.style("fill-opacity", 1);

timer_board.append("rect")
	.attr("x", 5)
	.attr("y", 26)
	.attr("rx", 15)
    .attr("ry", 15)
	.attr("width", width_sc - 10)
	.attr("height", height_sc - 32)
	.style("fill", "white")
	.style("fill-opacity", 1);

timer_board.append("text")
    .text("TIMER")
    .attr("x", width_sc / 2)
    .attr("y", 13)
    .attr("dy", ".32em").attr("text-anchor", "middle")
    .attr("font-size", 20);  

timer_board.append("text")
	.attr("class", "timer_board_text")
    .text(myTimer.getDuration())
    .attr("x", width_sc / 2)
    .attr("y", (height_sc + 25)/ 2)
    .attr("dy", ".32em").attr("text-anchor", "middle")
    .attr("font-size", 50);   

