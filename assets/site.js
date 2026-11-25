/* grow.sttar.com: shared side nav and footer. Each page sets <body data-page="..."> and data-footer="mini" on working pages. */
(function () {
  var MARK = '<svg viewBox="0 0 36 36" aria-hidden="true" focusable="false"><path fill="currentColor" d="M18 0s.24 6.8 2.56 11.27C23.9 7.27 27 2.45 27 2.45s-3.05 5.91-4.84 11.1c3.83 3.85 13.84 4.45 13.84 4.45s-9.88.46-13.71 4.29C18.46 26.12 18 36 18 36s-.33-6.77-2.62-11.27C12.07 28.77 9 33.54 9 33.54s3.03-5.85 4.87-11.05C9.86 18.47 0 18 0 18s9.88-.46 13.71-4.29C17.54 9.88 18 0 18 0Z"/></svg>';
  // line icons for the side nav (24px grid, drawn in currentColor)
  var I = {
    home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    groups: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M15.5 4.8a3.2 3.2 0 0 1 0 6.4M21 20c0-2.9-1.9-5.3-4.5-5.9"/>',
    podium: '<path d="M3 20h18M4.5 20v-6h5v6M9.5 20V8h5v12M14.5 20v-9h5v9"/><path d="m12 3 .6 1.3 1.4.2-1 1 .2 1.4-1.2-.7-1.2.7.2-1.4-1-1 1.4-.2z"/>',
    faq: '<path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3.5 21l1.4-4.6A8.5 8.5 0 1 1 21 12z"/><path d="M9.8 9.6a2.3 2.3 0 0 1 4.4.9c0 1.6-2.2 2-2.2 3.3M12 16.8v.1"/>',
    rules: '<path d="M6 3h9l4 4v14H6z"/><path d="M14.5 3v4.5H19M9 12h7M9 16h5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    stats: '<path d="M4 4v16h16"/><path d="m8 15 4-4 3 3 5-6"/>',
    send: '<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>',
    wallet: '<path d="M19 9V5H5.5A2.5 2.5 0 0 0 3 7.5"/><path d="M3 7.5V18a2 2 0 0 0 2 2h15V9H5.5A2.5 2.5 0 0 1 3 7.5z"/><path d="M16 14.5h.01"/>',
    login: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l4-4-4-4M14 12H3"/>',
    logout: '<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 16l4-4-4-4M20 12H9"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + I[n] + "</svg>"; }
  var page = document.body.getAttribute("data-page") || "";
  var G = window.GROW, who = G && G.me();
  var root = document.documentElement;

  // one tab: key matches <body data-page>, so the open page gets aria-current
  function tab(key, href, label, ic, ext) {
    return '<a class="tab" href="' + href + '" data-tip="' + label + '"' + (key && key === page ? ' aria-current="page"' : "") + (ext ? ' target="_blank" rel="noopener"' : "") + ">" +
      icon(ic) + '<span class="tab-l">' + label + (ext ? '<span class="visually-hidden"> (opens in a new tab)</span>' : "") + "</span>" +
      (ext ? '<span class="tab-ext" aria-hidden="true">&#8599;</span>' : "") + "</a>";
  }
  function group(label, tabs) { return '<div class="side-group"><p class="side-label">' + label + "</p>" + tabs.join("") + "</div>"; }

  var side = document.createElement("aside"), bar = document.createElement("header"), scrim = document.createElement("div");
  side.className = "side"; side.id = "side"; side.setAttribute("aria-label", "Site menu");
  bar.className = "topbar"; scrim.className = "scrim";
  document.body.insertBefore(scrim, document.body.firstChild);
  document.body.insertBefore(bar, document.body.firstChild);
  document.body.insertBefore(side, document.body.firstChild);

  // logged out: the program, log in, help, and a join card. logged in: their stuff first, and their link pinned at the bottom
  function render() {
    who = G && G.me();
    var program = group("the program", [tab("home", "/", "Home", "home"), tab("groups", "/groups/", "Groups", "groups"), tab("leaderboard", "/leaderboard/", "Leaderboard", "podium")]);
    var help = group("help", [tab("faq", "/faq/", "FAQ", "faq"), tab("rules", "/rules/", "Rules", "rules"), tab("", "mailto:hello@sttar.com", "Contact us", "mail"), tab("", "https://sttar.com/download", "Get the app", "phone", true)]);
    var you, card = "";
    if (who) {
      you = group("you", [tab("me", "/me/", "My stats", "stats"), tab("", "/me/#share-kit", "Share kit", "send"), tab("", "/me/#moneycard", "Payout", "wallet")]);
      var link = who.link ? who.link.replace(/^https?:\/\//, "") : "";
      card = '<div class="side-card mine"><div class="side-cap"><span>' + (who.user ? "@" + esc(who.user) + "'s link" : "your link") + "</span>" +
          '<button class="side-out" type="button" data-logout data-tip="Log out">' + icon("logout") + "<span>Log out</span></button></div>" +
        (link ? '<span class="side-link">' + esc(link) + '</span><div class="side-row"><button class="btn" type="button" data-copy data-tip="Copy my link">' + icon("copy") + '<span>Copy</span></button><button class="btn-quiet" type="button" data-share>Share</button></div>'
              : '<a class="btn side-cta" href="/me/" data-tip="Get my link">' + icon("stats") + "<span>Get my link</span></a>") + "</div>";
    } else {
      you = group("you", [tab("me", "/me/", "Log in", "login")]);
      if (page !== "signup") card = '<div class="side-card"><div class="side-fan" aria-hidden="true">' +
        '<figure style="--k:0;--r:-9deg"><img src="/assets/img/s4.jpg" alt=""></figure><figure style="--k:1;--r:4deg"><img src="/assets/img/s7.jpg" alt=""></figure><figure style="--k:2;--r:-3deg"><img src="/assets/img/s25.jpg" alt=""></figure>' +
        '<span class="side-pill">+<span data-rate>$2</span></span></div>' +
        '<p class="side-pitch"><b><span data-rate>$2</span> for every friend</b> who joins and posts. No cap.</p>' +
        '<a class="btn side-cta" href="/signup/" data-tip="Become an ambassador">' + icon("plus") + "<span>Become an ambassador</span></a></div>";
    }
    side.innerHTML =
      '<div class="side-top"><a class="side-brand" href="/" aria-label="Sttar ambassadors home">' + MARK + '<span class="side-word">Sttar</span><span class="side-tag">ambassadors</span></a>' +
        '<button class="side-close" type="button" aria-label="Close menu">' + icon("x") + "</button></div>" +
      '<nav class="side-nav" aria-label="Main">' + (who ? you + program + help : program + you + help) + "</nav>" + card;

    var act = "";
    if (!who && page !== "signup") act = '<a class="btn btn-s" href="/signup/">Join</a>';
    else if (who && page !== "me") act = '<a class="btn btn-s" href="/me/">My stats</a>';
    bar.innerHTML = '<a class="wordmark" href="/" aria-label="Sttar ambassadors home">' + MARK + "<span>Sttar</span></a>" +
      '<div class="topbar-r">' + act + '<button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="side">' + icon("menu") + "</button></div>";
  }
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  render();
  window.growNav = render;

  // phones: the same side nav slides in from the left over a scrim
  var small = window.matchMedia("(max-width: 60rem)");
  function setOpen(open) {
    root.classList.toggle("menu-open", open);
    var b = bar.querySelector(".menu-btn"); b.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) { var t = side.querySelector('.tab[aria-current="page"]') || side.querySelector(".tab"); if (t) t.focus({ preventScroll: true }); }
  }
  bar.addEventListener("click", function (e) { if (e.target.closest(".menu-btn")) setOpen(!root.classList.contains("menu-open")); });
  scrim.addEventListener("click", function () { setOpen(false); });
  side.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest(".side-close")) { setOpen(false); bar.querySelector(".menu-btn").focus(); return; }
    if (t.closest("[data-logout]")) { G.logout(); return; }
    var c = t.closest("[data-copy]");
    if (c && who && who.link) { G.copy(who.link, c.querySelector("span"), "Copy"); return; }
    var s = t.closest("[data-share]");
    if (s && who && who.link) { if (navigator.share) navigator.share({ title: "Join me on Sttar", url: who.link }).catch(function () {}); else G.copy(who.link, s, "Share"); return; }
    if (t.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("menu-open")) { setOpen(false); bar.querySelector(".menu-btn").focus(); }
  });
  var onChange = function () { if (!small.matches) setOpen(false); };
  if (small.addEventListener) small.addEventListener("change", onChange); else small.addListener(onChange);
  var onScroll = function () { bar.classList.toggle("scrolled", window.scrollY > 8); };
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
        (who ? '<div class="actions"><a class="btn" href="/me/">Open my stats</a></div>'
             : '<div class="actions"><a class="btn" href="/signup/">Become an ambassador</a><a class="btn-quiet" href="/signup/?group">Sign up a group</a></div>') +
        footLinks +
      "</div>" +
      '<div class="mast" aria-hidden="true">' + MARK + "<span>Sttar</span></div>";
  }
  document.body.appendChild(foot);

  // logged in: swap sign-up buttons on the page for one "Open my stats" (they already have a link)
  if (who) {
    document.querySelectorAll(".actions, [data-cta]").forEach(function (box) {
      var ups = box.querySelectorAll('a[href^="/signup/"]');
      if (box.matches('a[href^="/signup/"]')) ups = [box];
      if (!ups.length) return;
      var mine = document.createElement("a"); mine.className = "btn"; mine.href = "/me/"; mine.textContent = "Open my stats";
      if (box.matches("a")) { box.replaceWith(mine); return; }
      ups[0].parentNode.insertBefore(mine, ups[0]);
      [].forEach.call(ups, function (a) { a.remove(); });
    });
  }

  // ---------- motion: decks of polaroids, the drifting strip, one reveal ----------
  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-deck]").forEach(function (deck) {
    var cards = [].slice.call(deck.querySelectorAll(".card"));
    var order = cards.slice(), timer = null, hover = false, seen = true, flip = false;
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
    function tick() { clearInterval(timer); timer = null; if (!still && !hover && seen) timer = setInterval(deal, 3400); }
    layout(); order[0].classList.add("dev");
    deck.addEventListener("click", function () { deal(); tick(); });
    deck.addEventListener("mouseenter", function () { hover = true; tick(); });
    deck.addEventListener("mouseleave", function () { hover = false; tick(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { seen = e[0].isIntersecting; tick(); }).observe(deck);
    tick();
  });

  var wall = document.getElementById("wall");
  if (wall) {
    wall.addEventListener("mouseenter", function () { wall.classList.add("hovering"); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { wall.classList.toggle("offscreen", !e[0].isIntersecting); }).observe(wall);
  }

  var rev = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("on"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    rev.forEach(function (e) { io.observe(e); });
  } else rev.forEach(function (e) { e.classList.add("on"); });
})();
