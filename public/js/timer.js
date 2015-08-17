
// Timer that counts down for the game play.
var myTimer = new Timer({
    tick    : 1,
    ontick  : function(sec) { 
    	if (toggle_sound) clock_ticks.playclip();
    var seconds = sec % 60
    if (seconds < 10) seconds = '0' + seconds
	    if (sec > 5) {
	    	if (sec == 10 && toggle_sound) countdown_sound.playclip();
	    	d3.select('.timer_board_text').text(Math.floor(sec/60)+ ':' + seconds)
					.attr("font-size", 70).attr("y", height_sc / 2 + 13);
				d3.select('.timer_board_text').transition().duration(500)
					.attr("font-size", 50).attr("y", height_sc / 2 + 8); 
			} else {
				d3.select('.timer_board_text').text(Math.floor(sec/60)+ ':' + seconds).attr("fill","red")
					.attr("font-size", 100).attr("y", height_sc / 2 + 13);
				d3.select('.timer_board_text').transition().duration(500)
					.attr("font-size", 50).attr("fill","black").attr("y", height_sc / 2 + 8);
			}
	},

    onstart : function() { console.log('timer started') },
    onstop  : function() { console.log('timer stop') },
    onpause : function() { console.log('timer set on pause') },
    onend   : function() { 
    d3.select('.timer_board_text').text("OVER").attr("fill","red")
			.attr("font-size", 100).attr("y", height_sc / 2 + 13);
		d3.select('.timer_board_text').transition().duration(500)
			.attr("font-size", 50).attr("fill","black").attr("y", height_sc / 2 + 8); 
		if (toggle_sound) reset_sound.playclip();
		played_whole_game = true;
		submit_this();
    }
});


// Counts time played
var myNewTimer = new Timer({
    onstart : function() { console.log('new timer started') },
    onstop  : function() { console.log('new timer stop') },
    onpause : function() { console.log('new timer set on pause') },
    onend   : function() { }
});