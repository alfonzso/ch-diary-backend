document.body.addEventListener('htmx:afterOnLoad', function (e) {
  if (window.runClockId === undefined) {
    window.runClockId = common.runClock(common.getCookie("refTokenExp"))
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
  window.runClockId = common.runClock(common.getCookie("refTokenExp"))

  common.setupToast("showErrorMessage", "alert-danger")
  common.setupToast("showSuccessMessage", "alert-success")
  common.setupToast("showWarnMessage", "alert-warning")

  document.addEventListener("visibilitychange", () => {
    windowsIsActive = !document.hidden
  });

}