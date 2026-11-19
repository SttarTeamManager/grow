/* grow.sttar.com — shared nav, footer and scroll reveals. Each page sets <body data-page="..."> and optional data-footer="mini". */
(function () {
  var MARK = '<svg viewBox="0 0 36 36" aria-hidden="true"><path fill="currentColor" d="M18 0s.24 6.8 2.56 11.27C23.9 7.27 27 2.45 27 2.45s-3.05 5.91-4.84 11.1c3.83 3.85 13.84 4.45 13.84 4.45s-9.88.46-13.71 4.29C18.46 26.12 18 36 18 36s-.33-6.77-2.62-11.27C12.07 28.77 9 33.54 9 33.54s3.03-5.85 4.87-11.05C9.86 18.47 0 18 0 18s9.88-.46 13.71-4.29C17.54 9.88 18 0 18 0Z"/></svg>';
  var LINKS = [["home", "/", "Ambassadors"], ["groups", "/groups/", "Groups"], ["leaderboard", "/leaderboard/", "Leaderboard"], ["faq", "/faq/", "FAQ"]];
  var page = document.body.getAttribute("data-page") || "";
  var hasKey = false;
  try { hasKey = !!localStorage.getItem("grow_k"); } catch (e) {}

  var links = LINKS.map(function (l) {
    return '<a href="' + l[1] + '"' + (l[0] === page ? ' aria-current="page"' : "") + ">" + l[2] + "</a>";
  }).join("");
  var nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML =
    '<div class="container nav-in">' +
      '<a class="brand" href="/" aria-label="Sttar Ambassadors home">' + MARK + "<b>Sttar</b><i>ambassadors</i></a>" +
      '<nav class="nav-links" aria-label="Main">' + links + "</nav>" +
      '<div class="nav-right">' +
        '<a class="link" href="/me/">My stats</a>' +
        (hasKey ? '<a class="btn sm" href="/me/">My stats</a>' : '<a class="btn sm" href="/signup/">Join</a>') +
        '<button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><span></span></button>' +
      "</div>" +
    "</div>";
  var sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.innerHTML = links + '<a href="/me/">My stats</a><a href="/rules/">Rules</a>' +
    '<a class="btn block" href="/signup/">Become an ambassador</a>';
  document.body.insertBefore(sheet, document.body.firstChild);
  document.body.insertBefore(nav, document.body.firstChild);

  var btn = nav.querySelector(".menu-btn");
  btn.addEventListener("click", function () {
    var open = document.documentElement.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  sheet.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { document.documentElement.classList.remove("menu-open"); document.body.style.overflow = ""; }
  });
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // footer
  var foot = document.createElement("footer");
  var footLinks = '<nav><a href="/">Ambassadors</a><a href="/groups/">Groups</a><a href="/leaderboard/">Leaderboard</a><a href="/faq/">FAQ</a>' +
    '<a href="/rules/">Rules</a><a href="https://sttar.com">sttar.com</a><a href="mailto:hello@sttar.com">hello@sttar.com</a></nav>';
  if (document.body.getAttribute("data-footer") === "mini") {
    foot.className = "foot-mini";
    foot.innerHTML = '<div class="container">' + footLinks + "</div>";
  } else {
    foot.className = "footer";
    foot.innerHTML =
      '<div class="container">' +
        '<div class="footer-cta"><h2>your friends are already<br>taking the photos.</h2>' +
        '<div class="btn-row"><a class="btn light" href="/signup/">Become an ambassador</a><a class="btn ghost-light" href="/groups/">Sign up a group</a></div></div>' +
        '<div class="footer-row"><span>© Sttar Inc.</span>' + footLinks + "</div>" +
      "</div>" +
      '<div class="wordmark" aria-hidden="true">' + MARK.replace('fill="currentColor"', 'fill="#fff"') + "<span>Sttar</span></div>";
  }
  document.body.appendChild(foot);

  // reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("on"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px" });
  els.forEach(function (e) { io.observe(e); });
})();
