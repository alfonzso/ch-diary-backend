
function padTime (time ) {
  return time.toString().padStart(2, '0')
}

function prettyDate (seconds ) {
  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${days}d - ${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`
}

function runClock(exp){

  if ( Number.isNaN( parseInt(exp, 10) ) ){
    return
  }

  return setInterval(() => {
    let startDate = new Date(new Date().toLocaleString('en', {timeZone:'Europe/Budapest'}))
    let endDate = new Date(new Date(exp* 1000).toLocaleString('en', {timeZone:'Europe/Budapest'}));
    let seconds = ( endDate.getTime() - startDate.getTime() ) / 1000;

    if (seconds <= 0){
      location.reload();
    } else {
      htmx.find("#untilTokenExpired").innerHTML = prettyDate(seconds)
    }
  }, 1000);
  // }, 5000);
}