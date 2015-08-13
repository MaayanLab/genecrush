function show_leaderboard() {
	// hide everything else
	d3.select('#summary_page').classed('hidden', true)
	d3.select('#topbar').classed('blocked', true)
	d3.select('#start_viz').classed('hidden', true)
	d3.select('#start_game').classed('hidden', true)
	
	// show 
  d3.select('#leaderboard').classed('hidden', false)
  d3.select('#lb_buttons').classed('hidden', false)
  d3.select('#lb_return').classed('hidden', false)
  get_10hs();

	d3.select('#twitter_follow').classed('hidden', false)
}


function show_summary_page() {
	// hide everything else
	d3.select('#leaderboard').classed('hidden',true)
  d3.select('#lb_buttons').classed('hidden',true)
  d3.select('#lb_return').classed('hidden', true)
  // show 
  d3.select('#summary_page').classed('hidden', false)
	d3.select('#topbar').classed('blocked',true)
	d3.select('#start_viz').classed('hidden',false)
	d3.select('#start_game').classed('hidden',false)
	d3.select('#toggle_leaderboard').classed('disabled', false)
	d3.select('#toggle_tutorial').classed('disabled', false)

	d3.select('#twitter_follow').classed('hidden', false)
}


function hide_everything() { 
	d3.select('#summary_page').classed('hidden', true)
	d3.select('#topbar').classed('blocked', false)
	d3.select('#start_viz').classed('hidden', true)
	d3.select('#start_game').classed('hidden', true)
	d3.select('#leaderboard').classed('hidden', true)
  d3.select('#lb_buttons').classed('hidden', true)
  d3.select('#lb_return').classed('hidden', true)
  d3.select('#twitter_follow').classed('hidden', true)
  d3.select('#twitter_follow').classed('hidden', true)
}

function start_game(test_data) {
  d3.select('#start_viz').classed('hidden',true)
  d3.select('#start_game').classed('hidden',true)
  d3.select('#twitter_follow').classed('hidden', true)
  d3.select('#summary_page').classed('hidden',true)
  d3.select('#topbar').classed('blocked',false)
  d3.select('#tutorial0').classed('hidden',true)
  d3.select('#toggle_leaderboard').classed('disabled', true)
	d3.select('#toggle_tutorial').classed('disabled', true)
  myTimer.start(60*5);
  // myTimer.start(15);
  myNewTimer.start(60*30);
  played_whole_game = false;
  new_data(test_data);
}

function start_viz(test_data) {
  d3.select('#start_viz').classed('hidden',true)
  d3.select('#start_game').classed('hidden',true)
  d3.select('#twitter_follow').classed('hidden', true)
  d3.select('#summary_page').classed('hidden',true)
  d3.select('#topbar').classed('blocked',false)
  d3.select('#tutorial0').classed('hidden',true)
  d3.select('.timer_board_text').text('N/A')
  d3.select('#toggle_leaderboard').classed('disabled', true)
  d3.select('#toggle_tutorial').classed('disabled', true)
  myNewTimer.start(60*30);
  played_whole_game = false;
  new_data(test_data);
  if (toggle_sound) start_game_sound.playclip();
}

function toggle_sound_fx() {
  if (toggle_sound) {
    toggle_sound = false;
    d3.select('#toggle_sound').attr('class', 'btn btn-danger')
  } else {
    toggle_sound = true;
    d3.select('#toggle_sound').attr('class', 'btn btn-success')
  }
}


function toggle_music_fx() {
  if (toggle_music) {
    toggle_music = false;
    music.pause();
    d3.select('#toggle_music').attr('class', 'btn btn-danger')
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
    d3.select('#toggle_music').attr('class', 'btn btn-success ')
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