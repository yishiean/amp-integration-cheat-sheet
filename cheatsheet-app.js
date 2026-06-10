/* ============================================================
   Amplitude API & Integration Ecosystem — render + interactivity
   ============================================================ */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // strip tags for building the searchable text blob
  function plain(s) { return String(s).replace(/<[^>]*>/g, " "); }

  var DIR_META = {
    in:   { glyph: "\u2193", label: "In" },
    out:  { glyph: "\u2191", label: "Out" },
    both: { glyph: "\u21C4", label: "Both" }
  };

  function dirBadge(dir) {
    var m = DIR_META[dir];
    if (!m) return "";
    return '<span class="dir dir-' + dir + '" title="' + m.label +
      (dir === "in" ? " — data flows into Amplitude" : dir === "out" ? " — data flows out of Amplitude" : " — flows both ways") +
      '"><span class="dir-g">' + m.glyph + '</span>' + m.label + '</span>';
  }

  function rankBadge(n) {
    var top = n <= 3 ? " rk-top rk-" + n : "";
    return '<span class="rk' + top + '">' + n + '</span>';
  }

  function methodPills(arr) {
    return '<span class="methods">' + arr.map(function (m) {
      return '<span class="mth mth-' + m.toLowerCase() + '">' + m + '</span>';
    }).join("") + "</span>";
  }

  function docsLinks(arr) {
    if (!arr || !arr.length) return "";
    return '<span class="docs">' + arr.map(function (d) {
      if (d.url.charAt(0) === "#") {
        return '<a class="doclink doclink-int" href="' + d.url + '">' + esc(d.label) +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
      }
      return '<a class="doclink" href="' + d.url + '" target="_blank" rel="noopener">' + esc(d.label) +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>';
    }).join("") + "</span>";
  }

  /* ---------- search blob for a row ---------- */
  function rowSearchBlob(row) {
    var parts = [];
    Object.keys(row).forEach(function (k) {
      if (k === "docs") { (row.docs || []).forEach(function (d) { parts.push(d.label); }); return; }
      if (k === "methods") { parts.push((row.methods || []).join(" ")); return; }
      if (k === "dir") { parts.push(DIR_META[row.dir] ? DIR_META[row.dir].label : ""); return; }
      parts.push(plain(row[k]));
    });
    return parts.join(" ").toLowerCase();
  }

  /* ---------- cell rendering ---------- */
  function renderCell(col, row) {
    var v = row[col.key];
    if (col.key === "dir") return dirBadge(row.dir);
    if (col.key === "docs") return docsLinks(row.docs);
    if (col.key === "methods") return methodPills(row.methods || []);
    if (col.key === "rank") return rankBadge(row.rank);
    if (col.key === "api" || col.key === "partner" || col.key === "connector")
      return '<span class="primary-cell">' + v + "</span>";
    if (col.key === "cat") return '<span class="cat">' + v + "</span>";
    return v == null ? "" : v;
  }

  /* ---------- table block ---------- */
  function renderTable(block) {
    var cls = "tbl" + (block.variant ? " tbl-" + block.variant : "");
    var html = '<div class="tbl-wrap" data-block="table"><table class="' + cls + '"><thead><tr>';
    block.columns.forEach(function (c) {
      html += '<th class="col-' + (c.w || "") + '">' + esc(c.label) + "</th>";
    });
    html += "</tr></thead><tbody>";
    block.rows.forEach(function (row) {
      var blob = rowSearchBlob(row);
      html += '<tr class="frow" data-search="' + esc(blob) + '" data-dir="' + (row.dir || "") + '">';
      block.columns.forEach(function (c) {
        html += '<td class="col-' + (c.w || "") + '" data-label="' + esc(c.label) + '">' + renderCell(c, row) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  }

  /* ---------- drilldowns ---------- */
  function renderDrilldowns(block) {
    var html = '<div class="dd-list">';
    block.items.forEach(function (it) {
      var blob = (it.title + " " + it.endpoint + " " + it.auth + " " + it.useCase + " " +
        it.parts.map(function (p) { return plain(p.code || p.text || p.title || ""); }).join(" ")).toLowerCase();
      html += '<div class="dd frow" data-search="' + esc(blob) + '" data-dir="' + (it.dir || "") + '">';
      html += '<button class="dd-head" aria-expanded="false">' +
        '<span class="dd-n">' + esc(it.n) + "</span>" +
        '<span class="dd-title">' + esc(it.title) + "</span>" +
        dirBadge(it.dir) +
        '<span class="dd-ep"><code>' + esc(it.endpoint) + "</code></span>" +
        '<span class="dd-chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>' +
        "</button>";
      html += '<div class="dd-body"><div class="dd-inner">';
      html += '<div class="dd-meta"><span><b>Auth</b> ' + esc(it.auth) + "</span><span><b>Use case</b> " + esc(it.useCase) + "</span></div>";
      it.parts.forEach(function (p) {
        if (p.type === "code") {
          if (p.label) html += '<div class="code-label">' + esc(p.label) + "</div>";
          html += '<div class="codeblock"><span class="lang">' + (p.lang || "") + '</span>' +
            '<button class="copy" title="Copy">Copy</button>' +
            '<pre><code>' + esc(p.code) + "</code></pre></div>";
        } else if (p.type === "paramTable") {
          if (p.title) html += '<div class="code-label">' + esc(p.title) + "</div>";
          html += '<div class="tbl-wrap"><table class="tbl tbl-param"><thead><tr>';
          p.headers.forEach(function (h) { html += "<th>" + esc(h) + "</th>"; });
          html += "</tr></thead><tbody>";
          p.rows.forEach(function (r) {
            html += "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
          });
          html += "</tbody></table></div>";
        } else if (p.type === "subhead") {
          html += '<div class="dd-subhead">' + p.text + "</div>";
        } else if (p.type === "warn") {
          html += '<div class="callout warn">' + p.text + "</div>";
        } else if (p.type === "note") {
          html += '<div class="callout note">' + p.text + "</div>";
        } else if (p.type === "plain") {
          html += '<p class="dd-p">' + p.text + "</p>";
        }
      });
      html += "</div></div></div>";
    });
    html += "</div>";
    return html;
  }

  /* ---------- section ---------- */
  function renderSection(sec) {
    var html = '<section class="sec" id="' + sec.id + '" data-lane="' + sec.lane + '">';
    html += '<div class="sec-head">' +
      '<span class="sec-num">' + esc(sec.num) + "</span>" +
      '<div class="sec-heading"><h2>' + esc(sec.title) + "</h2>" +
      '<p class="sec-intro">' + esc(sec.intro) + "</p></div></div>";
    html += '<div class="sec-blocks">';
    sec.blocks.forEach(function (b) {
      if (b.type === "table") html += renderTable(b);
      else if (b.type === "drilldowns") html += renderDrilldowns(b);
      else if (b.type === "subsection")
        html += '<div class="subsection" data-block="subsection"' + (b.id ? ' id="' + b.id + '"' : "") + '><h3>' + esc(b.label) + "</h3>" +
          (b.note ? '<p class="subnote">' + esc(b.note) + "</p>" : "") + "</div>";
      else if (b.type === "keyrule")
        html += '<div class="callout keyrule" data-block="loose" data-search="' + esc(plain(b.text).toLowerCase()) + '">' + b.text + "</div>";
      else if (b.type === "note")
        html += '<div class="callout note" data-block="loose" data-search="' + esc(plain(b.text).toLowerCase()) + '">' + b.text + "</div>";
    });
    html += "</div></section>";
    return html;
  }

  /* ---------- quick reference ---------- */
  function renderQuickRef() {
    var html = '<section class="sec" id="quickref">';
    html += '<div class="sec-head"><span class="sec-num">QR</span>' +
      '<div class="sec-heading"><h2>Quick Reference</h2>' +
      '<p class="sec-intro">Start here. Find your method, then jump to the full section. Filter by direction or search any partner, API, or use case above.</p></div></div>';
    html += '<div class="tbl-wrap"><table class="tbl tbl-quick"><thead><tr>' +
      '<th class="col-qmethod">Method</th><th class="col-dir">Dir</th>' +
      '<th class="col-qbest">Best for</th><th class="col-qgo">Section</th><th class="col-docs">Docs</th></tr></thead><tbody>';
    var secName = { "sec-1": "01", "sec-2": "02", "sec-3": "03", "sec-3b": "03\u00b7B", "sec-4": "04", "sec-5": "05", "sec-6": "06" };
    window.QUICK_REF.forEach(function (r) {
      var blob = (plain(r.method) + " " + r.bestFor + " " + (DIR_META[r.dir] ? DIR_META[r.dir].label : "")).toLowerCase();
      html += '<tr class="frow" data-search="' + esc(blob) + '" data-dir="' + r.dir + '">' +
        '<td class="col-qmethod" data-label="Method"><span class="primary-cell">' + r.method + "</span></td>" +
        '<td class="col-dir" data-label="Dir">' + dirBadge(r.dir) + "</td>" +
        '<td class="col-qbest" data-label="Best for">' + esc(r.bestFor) + "</td>" +
        '<td class="col-qgo" data-label="Section"><a class="goto" href="#' + r.goto + '">' + secName[r.goto] + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></td>' +
        '<td class="col-docs" data-label="Docs">' + docsLinks([{ label: "Docs", url: r.url }]) + "</td>" +
        "</tr>";
    });
    html += "</tbody></table></div></section>";
    return html;
  }

  /* ---------- nav ---------- */
  function renderNav() {
    var items = [{ id: "overview", label: "Overview", num: "" }, { id: "quickref", label: "Quick Reference", num: "QR" }];
    window.SECTIONS.forEach(function (s) { items.push({ id: s.id, label: s.nav, num: s.num, lane: s.lane }); });
    var html = "";
    items.forEach(function (it) {
      html += '<a class="navlink" href="#' + it.id + '" data-target="' + it.id + '">' +
        (it.num ? '<span class="nav-num">' + esc(it.num) + "</span>" : '<span class="nav-num nav-dot">\u2022</span>') +
        '<span class="nav-label">' + esc(it.label) + "</span>" +
        (it.lane ? '<span class="nav-lane lane-' + it.lane + '"></span>' : "") +
        "</a>";
    });
    return html;
  }

  /* ====================================================== */
  /* BUILD                                                  */
  /* ====================================================== */
  document.getElementById("nav").innerHTML = renderNav();

  var content = document.getElementById("content");
  var built = renderQuickRef();
  window.SECTIONS.forEach(function (s) { built += renderSection(s); });
  content.insertAdjacentHTML("beforeend", built);

  /* ---------- syntax highlighting ---------- */
  function escTok(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function highlight(code, lang) {
    var re = lang === "bash"
      ? /(#[^\n]*)|("(?:[^"\\]|\\.)*")(\s*:)?|(\s-{1,2}[a-zA-Z][\w-]*)|(\b\d+\.?\d*\b)/g
      : /("(?:[^"\\]|\\.)*")(\s*:)?|(\b-?\d+\.?\d*\b)|(\b(?:true|false|null)\b)/g;
    var out = "", last = 0, m;
    while ((m = re.exec(code))) {
      out += escTok(code.slice(last, m.index));
      if (lang === "bash") {
        if (m[1] !== undefined) out += '<span class="t-comment">' + escTok(m[1]) + "</span>";
        else if (m[2] !== undefined) {
          if (m[3]) out += '<span class="t-key">' + escTok(m[2]) + "</span>" + escTok(m[3]);
          else out += '<span class="t-str">' + escTok(m[2]) + "</span>";
        } else if (m[4] !== undefined) out += '<span class="t-flag">' + escTok(m[4]) + "</span>";
        else if (m[5] !== undefined) out += '<span class="t-num">' + escTok(m[5]) + "</span>";
      } else {
        if (m[1] !== undefined) {
          if (m[2]) out += '<span class="t-key">' + escTok(m[1]) + "</span>" + escTok(m[2]);
          else out += '<span class="t-str">' + escTok(m[1]) + "</span>";
        } else if (m[3] !== undefined) out += '<span class="t-num">' + escTok(m[3]) + "</span>";
        else if (m[4] !== undefined) out += '<span class="t-bool">' + escTok(m[4]) + "</span>";
      }
      last = re.lastIndex;
    }
    out += escTok(code.slice(last));
    return out;
  }
  Array.prototype.forEach.call(document.querySelectorAll(".codeblock"), function (cb) {
    var langEl = cb.querySelector(".lang");
    var lang = langEl ? langEl.textContent.trim().toLowerCase() : "";
    var codeEl = cb.querySelector("code");
    if (codeEl) codeEl.innerHTML = highlight(codeEl.textContent, lang);
  });

  /* ---------- drilldown expand / collapse ---------- */
  content.addEventListener("click", function (e) {
    var head = e.target.closest(".dd-head");
    if (head) {
      var dd = head.closest(".dd");
      var open = dd.classList.toggle("open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    var copy = e.target.closest(".copy");
    if (copy) {
      var code = copy.parentElement.querySelector("code").innerText;
      navigator.clipboard && navigator.clipboard.writeText(code);
      copy.textContent = "Copied";
      copy.classList.add("done");
      setTimeout(function () { copy.textContent = "Copy"; copy.classList.remove("done"); }, 1400);
    }
  });

  /* ---------- filtering ---------- */
  var searchInput = document.getElementById("search");
  var clearBtn = document.getElementById("clearSearch");
  var searchWrap = document.getElementById("searchWrap");
  var pills = Array.prototype.slice.call(document.querySelectorAll(".pill"));
  var countEl = document.getElementById("resultcount");
  var state = { q: "", dir: "all" };

  function applyFilter() {
    var q = state.q.trim().toLowerCase();
    var dir = state.dir;
    var visible = 0;

    // rows + drilldown cards
    Array.prototype.forEach.call(document.querySelectorAll(".frow"), function (el) {
      var matchQ = !q || (el.getAttribute("data-search") || "").indexOf(q) !== -1;
      var matchD = dir === "all" || el.getAttribute("data-dir") === dir;
      var show = matchQ && matchD;
      el.style.display = show ? "" : "none";
      if (show) visible++;
    });

    // loose blocks (keyrule/note): hide only on text mismatch
    Array.prototype.forEach.call(document.querySelectorAll('[data-block="loose"]'), function (el) {
      var matchQ = !q || (el.getAttribute("data-search") || "").indexOf(q) !== -1;
      el.style.display = matchQ ? "" : "none";
    });

    // tables: hide if no visible rows
    Array.prototype.forEach.call(document.querySelectorAll(".tbl-wrap[data-block='table']"), function (w) {
      var any = w.querySelector("tbody .frow:not([style*='display: none'])");
      w.style.display = any ? "" : "none";
    });

    // subsection labels: hide if no visible content follows until next subsection
    Array.prototype.forEach.call(document.querySelectorAll(".sec-blocks"), function (sb) {
      var kids = Array.prototype.slice.call(sb.children);
      var curLabel = null, curHas = false;
      function finalize() { if (curLabel) curLabel.style.display = curHas ? "" : "none"; }
      kids.forEach(function (k) {
        if (k.getAttribute("data-block") === "subsection") { finalize(); curLabel = k; curHas = false; }
        else { if (k.style.display !== "none") curHas = true; }
      });
      finalize();
    });

    // sections: hide if no visible table rows or drilldown cards
    Array.prototype.forEach.call(document.querySelectorAll(".sec"), function (sec) {
      if (sec.id === "overview") return;
      var hasRow = sec.querySelector(".frow:not([style*='display: none'])");
      sec.style.display = hasRow ? "" : "none";
      var nav = document.querySelector('.navlink[data-target="' + sec.id + '"]');
      if (nav) nav.classList.toggle("nav-empty", !hasRow);
    });

    var active = q || dir !== "all";
    countEl.textContent = active ? visible + (visible === 1 ? " result" : " results") : "";
    countEl.style.display = active ? "" : "none";
    searchWrap.classList.toggle("has-text", !!q);
    document.body.classList.toggle("filtering", !!active);
  }

  searchInput.addEventListener("input", function () { state.q = searchInput.value; applyFilter(); });
  clearBtn.addEventListener("click", function () { searchInput.value = ""; state.q = ""; applyFilter(); searchInput.focus(); });
  pills.forEach(function (p) {
    p.addEventListener("click", function () {
      pills.forEach(function (x) { x.classList.remove("active"); });
      p.classList.add("active");
      state.dir = p.getAttribute("data-dir");
      applyFilter();
    });
  });

  // keyboard: "/" focuses search
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== searchInput) { e.preventDefault(); searchInput.focus(); }
    if (e.key === "Escape" && document.activeElement === searchInput) { searchInput.value = ""; state.q = ""; applyFilter(); }
  });

  /* ---------- scrollspy ---------- */
  var navlinks = Array.prototype.slice.call(document.querySelectorAll(".navlink"));
  var sections = navlinks.map(function (l) { return document.getElementById(l.getAttribute("data-target")); });
  function spy() {
    var y = window.scrollY + 140;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i] && sections[i].offsetTop <= y) idx = i;
    }
    navlinks.forEach(function (l, i) { l.classList.toggle("active", i === idx); });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // smooth scroll with offset for sticky toolbar
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    var el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    var top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: top, behavior: "smooth" });
  });

  /* ---------- scroll to top ---------- */
  var scrollTopBtn = document.getElementById("scrollTop");
  window.addEventListener("scroll", function () {
    scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
