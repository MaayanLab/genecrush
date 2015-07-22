// DEBUG

// prints the order of the given value.
function print_order(value) {
  console.log(counter);
  for (var i = 0; i < value.x.length; i++) {
    var temp = "";
    for (var j = 0; j < value.y[i].length; j++) {
      temp += value.y[value.x[i]][j] + " ";
    }
    console.log("row_"+value.x[i]+": "+temp);
  }
}

