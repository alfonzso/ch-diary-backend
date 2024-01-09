function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const tzDate = () => {
  return new Date().toLocaleString("en-US", { timeZone: "Europe/Budapest" })
}

const YYYYMMDD = () => {
  return new Date(tzDate()).toISOString().split('T')[0]
}

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