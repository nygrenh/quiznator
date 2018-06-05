function median(arr) {
  arr = arr.slice(0); // create copy
  var middle = (arr.length + 1) / 2,
    sorted = _.sortBy(arr);
  return (sorted.length % 2) ? sorted[middle - 1] : (sorted[middle - 1.5] + sorted[middle - 0.5]) / 2;
}

function calculatePercentage(a, b) {
  if (b === 0) {
    return 0
  }
  return precise_round(a / b * 100, 2)
}

function printProgress(progress){
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(progress + '%');
}

function precise_round(num,decimals) {
  var sign = num >= 0 ? 1 : -1;
  return parseFloat((Math.round((num*Math.pow(10,decimals)) + (sign*0.001)) / Math.pow(10,decimals)).toFixed(decimals));
}

module.exports = {
  median, calculatePercentage, printProgress, precise_round
}