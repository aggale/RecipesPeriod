function halfs(num) {
  //alert("'" + num + "'");
  // Break the number down into a whole number and/or a fraction (ie 1 1/4)
  var m = num.match(/(([0-9]+) )?([0-9]+\/[0-9]+)?/i);
  if (m === null) return num;

  // Break down into numerators and denominators to do math on them
  var whole_numer = 0;
  var whole_denom = 2; // B/c divide by 2
  if (m[2] !== undefined)
    whole_numer = parseInt(m[2].trim());

  var f_numer = 0;
  var f_denom = 1;
  if (m[3] !== undefined) {
    var fraction = m[3].split('/');
    f_numer = parseInt(fraction[0]);
    f_denom = parseInt(fraction[1]);
  }
  f_denom *= 2; // B/c divide by 2

  // Add the two parts together
  if (whole_numer === 0)
    return simplifyFraction(f_numer, f_denom);
  else if (f_numer === 0)
    return simplifyFraction(whole_numer, whole_denom);
  else {
    // console.log("wholen: " + whole_numer);
    // console.log("f_numer: " + f_numer);
    // console.log("f_denom: " + f_denom);
    // console.log("wholed: " + whole_denom);
    whole_numer *= f_denom;
    f_numer *= whole_denom;
    whole_denom *= f_denom;
    return simplifyFraction(whole_numer + f_numer, whole_denom);
  }
}

function parseNum(num, adjustment) {
  // Break the number down into a whole number and/or a fraction (ie 1 1/4)
  var m = num.match(/(([0-9]+) )?([0-9]+\/[0-9]+)?/i);
  if (m === null) return num;

  // Break down into numerators and denominators to do math on them
  var whole_numer = 0;
  var whole_denom = 1; // B/c divide by 2
  if (m[2] !== undefined)
    whole_numer = parseInt(m[2].trim());

  var f_numer = 0;
  var f_denom = 1;
  if (m[3] !== undefined) {
    var fraction = m[3].split('/');
    f_numer = parseInt(fraction[0]);
    f_denom = parseInt(fraction[1]);
  }

  // Add the two parts together
  if (whole_numer === 0)
    return simplifyFraction(adjustment([f_numer, f_denom]));
  else if (f_numer === 0)
    return simplifyFraction(adjustment([whole_numer, whole_denom]));
  else {
    // console.log("wholen: " + whole_numer);
    // console.log("f_numer: " + f_numer);
    // console.log("f_denom: " + f_denom);
    // console.log("wholed: " + whole_denom);
    whole_numer *= f_denom;
    f_numer *= whole_denom;
    whole_denom *= f_denom;
    return simplifyFraction(adjustment([whole_numer + f_numer, whole_denom]));
  }
}

function half(nd) {
  nd[1] *= 2;
  return nd;
}

function quarter(nd) {
  nd[1] *= 4;
  return nd;
}

function double(nd) {
  nd[0] *= 2;
  return nd;
}

function quadruple(nd) {
  nd[0] *= 4;
  return nd;
}

// Takes numerator and denominator and simplifies fraction
function simplifyFraction(nd) {
  var n = nd[0];
  var d = nd[1];
  if (n === d)
    return 1;
  else if (n === 1)
    return n + "/" + d;

  for (var i = n; n > 1 && i >= 2; i--) {
    if (n % i === 0 && d % i === 0) {
      n /= i;
      d /= i;
    }
  }

  if (d === 1)
    return n;

  if (n > d) {
    var whole = Math.floor(n / d);
    return whole + " " + (n - whole * d) + "/" + d;
  }

  return n + "/" + d;
}

function changeBatch(lastBatchSizeSelected, batchSize) {
  if (lastBatchSizeSelected === batchSize) return;  // Already selected

  var adjFunc;
  switch(batchSize) {
    case 0:
      if (lastBatchSizeSelected === 1)
        adjFunc = double;
      else
        adjFunc = half;
      break;
    case 1:
      if (lastBatchSizeSelected === 0)
        adjFunc = half;
      else
        adjFunc = quarter;
      break;
    case 2:
      if (lastBatchSizeSelected === 0)
        adjFunc = double;
      else
        adjFunc = quadruple;
      break;
  }

  $("#ingredients").children().each(function() {

      var num = $(this).text().match(numPattern);
      if (num != null) {
        var newVal = parseNum(num[1], adjFunc);
        $(this).text($(this).text().replace(num[1], newVal + " "));
        if ($(this).text().includes("1/2 egg"))
          $("#eggAlert").show();
      }
   });

}

var numPattern = /^([0-9\/ ]+ )\w/i
$(document).ready(function(){

  $("#eggAlert").hide();

  var lastBatchSizeSelected = 0; // 0: single, 1: half, 2: double
  $("#singleBatch").click(function() {
    $("#eggAlert").hide();
    changeBatch(lastBatchSizeSelected, 0);
    lastBatchSizeSelected = 0;
   });
  $("#halfBatch").click(function() {
    $("#eggAlert").hide();
    changeBatch(lastBatchSizeSelected, 1);
    lastBatchSizeSelected = 1;
   });
   $("#doubleBatch").click(function() {
     $("#eggAlert").hide();
     changeBatch(lastBatchSizeSelected, 2);
     lastBatchSizeSelected = 2;
    });
});
