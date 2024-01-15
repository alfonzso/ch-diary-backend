fromHTML = (html, trim = true) => {
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

toastTemplate = fromHTML(`
    <div id="tst" class="alert chd-button-toast-shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div id="tst-bdy" class="toast-body"></div>
    </div>
`);

setupToast = (event, type) => {
  htmx.on(event, (e) => {
    let newToast = toastTemplate.cloneNode(true)
    appendAttribute(newToast, "class", type)
    htmx.find(newToast, "#tst-bdy").innerText = e.detail.value
    htmx.find('#toast-container').prepend(newToast)

    let myToast = bootstrap.Toast.getOrCreateInstance(newToast, { delay: 4000 })
    myToast.show()
    setTimeout(() => {
      myToast._element.remove()
    }, 6000);
  })
}

appendAttribute = (elem, attr, srcAttr) => {
  _elem = elem.getAttribute(attr) + " " + srcAttr
  elem.setAttribute(attr, _elem)
}

removeAttribute = (elem, attr, srcAttr) => {
  _elem = elem.getAttribute(attr).replace(srcAttr, "")
  elem.setAttribute(attr, _elem)
}

getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

tzDate = () => {
  return new Date().toLocaleString("en-US", { timeZone: "Europe/Budapest" })
}

YYYYMMDD = () => {
  return new Date(tzDate()).toISOString().split('T')[0]
}

padTime = (time) => {
  return time.toString().padStart(2, '0')
}

prettyDate = (seconds) => {
  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${days}d - ${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`
}

runClock = (exp) => {
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
