// GET requests

// Get top ten high score
function get_10hs() {
	d3.select('#lb_highest_score').classed('active', true);
	d3.select('#lb_average_score').classed('active', false);
	d3.select('#lb_games_played').classed('active', false);
  $.ajax({
      type: "GET",
      url: 'global/highest_score',
      dataType: 'text',
      success: function(userData) {
        d3.select('.bd_hs_legend').text('Highest Score').style('font-size', '20px')
        var topTen = JSON.parse(userData);
        for (var i = 0; i < 10; i++) {
          var curr = topTen[i];
          if (curr != undefined && curr.username != undefined) {
            var n = curr.username.indexOf('@');
            var text = curr.username;
            text = text.replaceBetween(2,n-2,'****');
            text += ' --------->  ';
            text += Math.floor(curr.highest_score);
            text += ' pts'
            d3.select('.bd_hs_' + (i + 1)).text(text);
          } else {
            d3.select('.bd_hs_' + (i + 1)).text('N/A')
          }
        }
      },
      error: function(userData) {
        console.log('please_sign_in_using_ur_google_account');
      }
  });
}

// Get top ten average score
function get_10as() {
	d3.select('#lb_highest_score').classed('active', false);
	d3.select('#lb_average_score').classed('active', true);
	d3.select('#lb_games_played').classed('active', false);
  $.ajax({
      type: "GET",
      url: 'global/average_score',
      dataType: 'text',
      success: function(userData) {
        d3.select('.bd_hs_legend').text('Average Score').style('font-size', '20px')
        var topTen = JSON.parse(userData);
        for (var i = 0; i < 10; i++) {
          var curr = topTen[i];
          if (curr != undefined && curr.username != undefined) {
            var n = curr.username.indexOf('@');
            var text = curr.username;
            text = text.replaceBetween(2,n-2,'****');
            text += ' --------->  ';
            text += Math.floor(curr.average_score);
            text += '  pts / game'
            d3.select('.bd_hs_' + (i + 1)).text(text);
          } else {
            d3.select('.bd_hs_' + (i + 1)).text('N/A')
          }
        }
      },
      error: function(userData) {
      	console.log(userData);
        console.log('please_sign_in_using_ur_google_account');
      }
  });
}

// Get top ten number of games played
function get_10gp() {
	d3.select('#lb_highest_score').classed('active', false);
	d3.select('#lb_average_score').classed('active', false);
	d3.select('#lb_games_played').classed('active', true);
  $.ajax({
      type: "GET",
      url: 'global/games_played',
      dataType: 'text',
      success: function(userData) {
        d3.select('.bd_hs_legend').text('Games Played').style('font-size', '20px')
        var topTen = JSON.parse(userData);
        for (var i = 0; i < 10; i++) {
          var curr = topTen[i];
          if (curr != undefined && curr.username != undefined) {
            var n = curr.username.indexOf('@');
            var text = curr.username;
            text = text.replaceBetween(2,n-2,'****');
            text += ' --------->  ';
            text += curr.num_games_played;
            if (curr.num_games_played < 2) {
            	text += ' game'
            } else {
            	text += ' games'
            }
            d3.select('.bd_hs_' + (i + 1)).text(text);
          } else {
            d3.select('.bd_hs_' + (i + 1)).text('N/A')
          }
        }
      },
      error: function(userData) {
        console.log('please_sign_in_using_ur_google_account');
      }
  });
}



// POST requests

// Post (push) data into database
function push_info(value) {

  $.ajax({
      type: "POST",
      data: value,
      url: 'user/pushInfo',
      dataType: 'text', 
      success: function(userData) {
        user = JSON.parse(userData);
        if (user.username != undefined && g_logged_in_status) {
          d3.select(".bd_message").text("Thank you for submitting your score!").style('font-size','20px')
          d3.select(".bd_username").text("Username : " + user.username)
          d3.select(".bd_highest_score").text("Highest Score : " + user.highest_score + " points")
          d3.select(".bd_average_score").text("Average Score : " + parseFloat(user.total_score / user.num_games_played).toFixed(2) + " points")
          var seconds = parseFloat(user.total_time / user.num_games_played).toFixed(2);
          if (seconds < 60) seconds = seconds + " seconds";
          else seconds = Math.floor(seconds/60) + ' minutes';
          d3.select(".bd_average_time").text("Average time per game : " + seconds);
        }
        else {
          d3.select(".bd_message").text("Please sign in to keep track of your scores!").style('font-size', '20px')
          d3.select(".bd_username").text(null)
          d3.select(".bd_highest_score").text(null)
          d3.select(".bd_average_score").text(null)
          d3.select(".bd_average_time").text(null)
        }
      },
      error: function(userData) {
        console.log('please_sign_in_using_ur_google_account');
        console.log(userData);
      }
    });
}

function get_user_gp(username) {
  if (typeof(username) == 'object') {
    d3.select('#games_played').text('0 games played!').style('font-size', '15px')
  } else {
    $.ajax({
        type: "POST",
        data: username,
        url: 'user/getInfo',
        dataType: 'text',
        success: function(userData) {
          var num_played = JSON.parse(userData);
          var temp = num_played.num_games_played + " games played!"
          d3.select('#games_played').text(temp).style('font-size', '15px')
        },
        error: function(userData) {
          console.log('something wrong with get');
        }
      });    
  }
}

function get_user_hs(username) {
  $.ajax({
      type: "POST",
      data: username,
      url: 'user/getInfo',
      dataType: 'text',
      success: function(userData) {
        var hs = JSON.parse(userData);
        var temp = hs.highest_score + " points"
        d3.select('.bd_2').text('highest score : ' + temp);
      },
      error: function(userData) {
        console.log('something wrong with get');
      }
    });
}