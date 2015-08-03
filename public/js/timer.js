var myTimer = new Timer({
    tick    : 1,
    ontick  : function(sec) { 
    	if (sec > 5) {
    		if (sec == 10 && toggle_sound) countdown_sound.playclip();
    		d3.select('.timer_board_text').text(sec)
				.attr("font-size", 70).attr("y", height_sc / 2 + 13);
			d3.select('.timer_board_text').transition().duration(500)
				.attr("font-size", 50).attr("y", height_sc / 2 + 8); 
		} else {
			d3.select('.timer_board_text').text(sec).attr("fill","red")
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
// myTimer.start(15);
//TODO AZU fix when not playing mode, still keep time. Look up if you can find if it submits upon quitting.
