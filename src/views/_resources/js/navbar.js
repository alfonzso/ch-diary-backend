

function runClock(exp) {

  if (Number.isNaN(parseInt(exp, 10))) {
    return
  }

  return setInterval(() => {
    if (!windowsIsActive) return
    let startDate = new Date(new Date().toLocaleString('en', { timeZone: 'Europe/Budapest' }))
    let endDate = new Date(new Date(exp * 1000).toLocaleString('en', { timeZone: 'Europe/Budapest' }));
    let seconds = (endDate.getTime() - startDate.getTime()) / 1000;

    if (seconds <= 0) {
      location.reload();
    } else {
      htmx.find("#untilTokenExpired").innerHTML = prettyDate(seconds)
    }
  }, 1000);
  // }, 5000);
}
