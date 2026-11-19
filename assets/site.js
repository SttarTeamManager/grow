/* grow.sttar.com: shared nav and footer. Each page sets <body data-page="..."> and data-footer="mini" on working pages. */
(function () {
  var MARK = '<svg viewBox="0 0 36 36" aria-hidden="true" focusable="false"><path fill="currentColor" d="M18 0s.24 6.8 2.56 11.27C23.9 7.27 27 2.45 27 2.45s-3.05 5.91-4.84 11.1c3.83 3.85 13.84 4.45 13.84 4.45s-9.88.46-13.71 4.29C18.46 26.12 18 36 18 36s-.33-6.77-2.62-11.27C12.07 28.77 9 33.54 9 33.54s3.03-5.85 4.87-11.05C9.86 18.47 0 18 0 18s9.88-.46 13.71-4.29C17.54 9.88 18 0 18 0Z"/></svg>';
  var LINKS = [["groups", "/groups/", "Groups"], ["leaderboard", "/leaderboard/", "Leaderboard"], ["faq", "/faq/", "FAQ"]];
  var page = document.body.getAttribute("data-page") || "";
  var signedIn = false;
  try { signedIn = !!localStorage.getItem("grow_k"); } catch (e) {}

  var links = LINKS.map(function (l) {
    return '<a href="' + l[1] + '"' + (l[0] === page ? ' aria-current="page"' : "") + ">" + l[2] + "</a>";
  }).join("");
  var nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML =
    '<div class="container">' +
      '<a class="wordmark" href="/" aria-label="Sttar ambassadors home">' + MARK + "<span>Sttar</span></a>" +
      '<nav class="nav-links" aria-label="Main">' + links + "</nav>" +
      '<div class="nav-right">' +
        '<a class="link" href="/me/">My stats</a>' +
        (signedIn ? '<a class="btn" href="/me/">Open my stats</a>' : '<a class="btn" href="/signup/">Join</a>') +
        '<button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 7h18M3 17h18" stroke="currentColor" stroke-width="2" fill="none"/></svg></button>' +
      "</div>" +
    "</div>";
  var sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.innerHTML = '<a href="/">Ambassadors</a>' + links + '<a href="/me/">My stats</a><a href="/rules/">Rules</a><a class="btn" href="/signup/">Become an ambassador</a>';
  document.body.insertBefore(sheet, document.body.firstChild);
  document.body.insertBefore(nav, document.body.firstChild);

  var btn = nav.querySelector(".menu-btn");
  var close = function () { document.documentElement.classList.remove("menu-open"); btn.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
  btn.addEventListener("click", function () {
    var open = document.documentElement.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  sheet.addEventListener("click", function (e) { if (e.target.tagName === "A") close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var footLinks = '<div class="footer-links"><span>Sttar Inc.</span><a href="/">Ambassadors</a><a href="/groups/">Groups</a><a href="/leaderboard/">Leaderboard</a><a href="/faq/">FAQ</a><a href="/rules/">Rules</a><a href="https://sttar.com">sttar.com</a><a href="mailto:hello@sttar.com">hello@sttar.com</a></div>';
  var foot = document.createElement("footer");
  if (document.body.getAttribute("data-footer") === "mini") {
    foot.className = "foot-mini";
    foot.innerHTML = '<div class="container">' + footLinks + "</div>";
  } else {
    foot.className = "footer on-ink";
    foot.innerHTML =
      '<div class="container">' +
        '<p class="statement">your friends are already taking the photos.</p>' +
        '<div class="actions"><a class="btn" href="/signup/">Become an ambassador</a><a class="btn-quiet" href="/signup/?group">Sign up a group</a></div>' +
        footLinks +
      "</div>" +
      '<div class="mast" aria-hidden="true">' + MARK + "<span>Sttar</span></div>";
  }
  document.body.appendChild(foot);

  // ---------- motion: decks of polaroids, the drifting strip, one reveal ----------
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-deck]").forEach(function (deck) {
    var cards = [].slice.call(deck.querySelectorAll(".card"));
    var order = cards.slice(), timer = null, paused = false, hover = false, seen = true, flip = false;
    var btn = document.querySelector('[data-pause="' + deck.id + '"]');
    function layout() {
      order.forEach(function (c, i) { c.style.setProperty("--i", i); c.style.zIndex = String(order.length - i); c.setAttribute("aria-hidden", i === 0 ? "false" : "true"); });
    }
    function deal() {
      var top = order[0]; flip = !flip;
      top.classList.add(flip ? "out" : "out-left");
      setTimeout(function () {
        top.classList.remove("out", "out-left");
        order.push(order.shift()); layout();
        order[0].classList.remove("dev"); void order[0].offsetWidth; order[0].classList.add("dev");
      }, 520);
    }
    function tick() { clearInterval(timer); timer = null; if (!still && !paused && !hover && seen) timer = setInterval(deal, 3400); }
    layout(); order[0].classList.add("dev");
    deck.addEventListener("click", function () { deal(); tick(); });
    deck.addEventListener("mouseenter", function () { hover = true; tick(); });
    deck.addEventListener("mouseleave", function () { hover = false; tick(); });
    if (btn) {
      if (still) btn.hidden = true;
      btn.addEventListener("click", function () { paused = !paused; btn.textContent = paused ? "Play photos" : "Pause photos"; btn.setAttribute("aria-pressed", String(paused)); tick(); });
    }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { seen = e[0].isIntersecting; tick(); }).observe(deck);
    tick();
  });

  var wall = document.getElementById("wall"), wb = document.querySelector('[data-pause="wall"]');
  if (wall && wb) {
    wb.addEventListener("click", function () {
      var p = wall.classList.toggle("paused");
      wb.textContent = p ? "Play photos" : "Pause photos"; wb.setAttribute("aria-pressed", String(p));
    });
    wall.addEventListener("mouseenter", function () { wall.classList.add("hovering"); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { wall.classList.toggle("offscreen", !e[0].isIntersecting); }).observe(wall);
  }

  document.querySelectorAll("[data-rail]").forEach(function (rail) {
    var btn = document.querySelector('[data-pause="' + rail.id + '"]');
    if (!btn) return;
    if (still) { btn.hidden = true; return; }
    btn.addEventListener("click", function () {
      var p = rail.classList.toggle("paused");
      btn.textContent = p ? "Play photos" : "Pause photos"; btn.setAttribute("aria-pressed", String(p));
    });
  });

  var rev = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    rev.forEach(function (e) { io.observe(e); });
  } else rev.forEach(function (e) { e.classList.add("on"); });
})();
