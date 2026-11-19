/* grow.sttar.com — shared helpers.
   API is the Apps Script web app URL (ends in /exec). It is the only setting on the site. */
window.GROW = (function () {
  var API = "PASTE_WEB_APP_URL_HERE";

  function get(params) {
    var qs = Object.keys(params).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); }).join("&");
    return fetch(API + "?" + qs).then(function (r) { return r.json(); });
  }
  // text/plain keeps the browser from sending a preflight request, which Apps Script can't answer
  function post(body) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); });
  }
  // browser storage can be blocked (private mode); it's only a convenience here
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function forget(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function money(n) { n = Number(n) || 0; return "$" + (n % 1 ? n.toFixed(2) : String(n)); }
  function ago(ms) {
    if (!ms) return "not yet";
    var m = Math.round((Date.now() - ms) / 60000);
    if (m < 2) return "just now";
    if (m < 60) return m + " min ago";
    var h = Math.round(m / 60);
    return h < 24 ? h + (h === 1 ? " hour ago" : " hours ago") : Math.round(h / 24) + " days ago";
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }
  function copy(text, btn, label) {
    var done = function () { btn.textContent = "copied"; setTimeout(function () { btn.textContent = label; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    else { var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} t.remove(); }
  }
  // fills [data-rate] [data-cap] [data-grate] [data-gcap] [data-shots] [data-days] from the program settings
  function fill(p) {
    var set = function (sel, v) { document.querySelectorAll(sel).forEach(function (e) { e.textContent = v; }); };
    set("[data-rate]", money(p.rate)); set("[data-cap]", money(p.cap));
    set("[data-grate]", money(p.groupRate || p.rate)); set("[data-gcap]", money(p.groupCap));
    set("[data-shots]", p.shots); set("[data-days]", p.days === 7 ? "week" : p.days + " days");
    document.querySelectorAll("[data-if-cap]").forEach(function (e) { e.hidden = !(p.cap > 0); });
    document.querySelectorAll("[data-if-gcap]").forEach(function (e) { e.hidden = !(p.groupCap > 0); });
    document.querySelectorAll("[data-if-pay]").forEach(function (e) { e.hidden = !(p.showEarnings && p.rate > 0); });
  }
  function lbRow(rank, name, qualified, joined, you) {
    var row = el("div", "lb-row" + (you ? " you" : ""));
    row.appendChild(el("span", "lb-rank", rank));
    row.appendChild(el("span", "lb-name", name + (you ? " (you)" : "")));
    var num = el("span", "lb-num");
    num.appendChild(el("b", "", qualified)); num.appendChild(document.createTextNode(" qualified · " + joined + " joined"));
    row.appendChild(num);
    return row;
  }
  return { get: get, post: post, save: save, load: load, forget: forget, money: money, ago: ago, el: el, copy: copy, fill: fill, lbRow: lbRow };
})();
