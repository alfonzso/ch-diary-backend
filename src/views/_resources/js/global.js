function fromHTML(html, trim = true) {
  // Process the HTML string.
  html = trim ? html : html.trim();
  if (!html) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = html;
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}

// const div = fromHTML('<div><span>nested</span> <span>stuff</span></div>');
const toastTemplate = fromHTML(`
  <div id="tst" class="alert " role="alert" aria-live="assertive" aria-atomic="true">
    <div id="tst-bdy" class="toast-body"></div>
  </div>
`);

window.onload = function(){

  // document.body.append(div);
  // document.body.append(toast);
  // const toastElement = document.getElementById("toast")
  // const toastBody = document.getElementById("toast-body")
  // const toastBody2 = document.getElementById("toast-body-2")
  // const toast = new bootstrap.Toast(toastElement, { delay: 1000 })
  // let windowsIsActive = null

  window.runClockId = runClock(getCookie("refTokenExp"))

  htmx.on("showErrorMessage", (e) => {
    // toastBody.innerText = e.detail.value
    // toastBody2.innerText = e.detail.value
    // toast.show()
    // document.createElement()
    // document.getElementsByClassName('toast-container').createElement('div');
    // let newToast = document.createElement("div")
    // newToast.setAttribute("id", "newToast");
    // newToast.setAttribute("class", "toast align-items-center text-white bg-success border-0 w-auto");
    // newToast.setAttribute("role", "alert");
    // newToast.setAttribute("aria-live", "assertive");
    // newToast.setAttribute("aria-atomic", "true");
    // role="alert"
    // aria-live="assertive"
    // aria-atomic="true"
    // document.getElementById("tst-bdy").innerText = e.detail.value
    let newToast = toastTemplate.cloneNode(true)
    newToast.setAttribute("class", "alert alert-danger")
    htmx.find(newToast, "#tst-bdy").innerText = e.detail.value
    // toastTemplate.innerText = e.detail.value
    // document.getElementsByClassName('toast-container')[0].appendChild(newToast)
    // document.getElementsByClassName('toast-container')[0].prepend(newToast)
    htmx.find('#toast-container').prepend(newToast)

    // let newToast = document.getElementsByClassName('toast-container').getElementById('newToast')
    let myToast = bootstrap.Toast.getOrCreateInstance(newToast, { delay: 10000 })
    myToast.show()
  })

  // toastElement.addEventListener('hidden.bs.toast', function (e) {
  //   console.log("-----------> ", e)
  //   console.log("-----------> ", e.target)
  //   console.log("-----------> ", e.currentTarget)
  //   // e.remove()
  // })

  // htmx.on("visibilitychange", () => {
  document.addEventListener("visibilitychange", () => {
    windowsIsActive = !document.hidden
  });
}

// document.addEventListener("visibilitychange", () => {
//   if (document.hidden) {
//     audio.pause();
//   } else {
//     audio.play();
//   }
// });



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