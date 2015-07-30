// google login
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  g_logged_in_status = false;
  d3.select('.g-signout2').text(null)
}