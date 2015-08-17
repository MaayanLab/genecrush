// google login


// Sign In 
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  g_id = profile.getEmail();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail());
  d3.select('.g-signout2').text('Sign Out')
  if (!g_logged_in_status) $('.g-signout2_pic').prepend('<img id="theImg" src="' + profile.getImageUrl() + '" / width="35px"height="35px">')
  g_logged_in_status = true;
}


// Sign Out
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  g_logged_in_status = false;
  d3.select('.g-signout2').text(null)
  $(".g-signout2_pic img:last-child").remove()
  submit_this();
}