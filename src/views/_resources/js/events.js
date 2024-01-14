document.body.addEventListener('htmx:afterOnLoad', function (e) {
  if (window.runClockId === undefined) {
    window.runClockId = runClock(getCookie("refTokenExp"))
  }
});

document.body.addEventListener('loginSuccess', function (e) {
  accessToken = e.detail.accesToken;
});

document.body.addEventListener('logoutSuccess', function (e) {
  window.clearInterval(window.runClockId)
  htmx.find("#untilTokenExpired").innerHTML = ""
});

window.onload = function () {
  window.runClockId = runClock(getCookie("refTokenExp"))

  setupToast("showErrorMessage", "alert-danger")
  setupToast("showSuccessMessage", "alert-success")
  setupToast("showWarnMessage", "alert-warning")

  document.addEventListener("visibilitychange", () => {
    windowsIsActive = !document.hidden
  });

}