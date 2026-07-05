!(function () {
  if (window.initOsmDiscountMap) return;
  function t(t) {
    return String(t ?? "").replace(
      /[&<>"']/g,
      (t) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[t],
    );
  }
  function e(t) {
    return /<\s*a\b|<\s*br\s*\/?\?>|<\s*div\b|<\s*span\b/i.test(
      String(t || ""),
    );
  }
  function o(t) {
    const e = String(t || "");
    if (!e) return "";
    if (
      !/<\s*a\b/i.test(e) &&
      !/detail\.aspx\?/i.test(e) &&
      !/https?:\/\//i.test(e)
    )
      return e;
    let o;
    try {
      o = document.createElement("div");
    } catch (t) {
      return e;
    }
    o.innerHTML = e;
    const n = new Set(),
      r = [];
    try {
      const t = o.querySelectorAll("a[href]");
      for (const e of t) {
        const o = (e.getAttribute("href") || "")
          .trim()
          .replace(/&amp;/g, "&")
          .trim();
        o ? (n.has(o) ? e.remove() : (n.add(o), r.push(o))) : e.remove();
      }
    } catch (t) {}
    const i = [];
    for (const t of r) {
      const e = t.match(/detail\.aspx\?(.+)$/i);
      e && i.push(e[1]);
    }
    try {
      const t = document.createTreeWalker(o, NodeFilter.SHOW_TEXT, null, !1),
        e = [];
      for (; t.nextNode();) e.push(t.currentNode);
      for (const t of e) {
        let e = t.nodeValue || "";
        if (e) {
          for (const t of i) {
            const o = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            ((e = e.replace(new RegExp("_?detail\\.aspx\\?" + o, "g"), "")),
              (e = e.replace(
                new RegExp("item_?detail\\.aspx\\?" + o, "g"),
                "",
              )));
          }
          ((e = e.replace(/\s{2,}/g, " ")), (t.nodeValue = e));
        }
      }
    } catch (t) {}
    let a = o.innerHTML;
    return ((a = a.replace(/\s{2,}/g, " ").trim()), a);
  }
  function n(n) {
    const r = (t) => {
      const e = String(t || "").match(/https?:\/\/[^\s<>"']+/i);
      if (!e) return "";
      let o = e[0].trim();
      for (; o && /[),.;，；。\]\)】」』’”]$/.test(o);) o = o.slice(0, -1);
      return o;
    };
    let a = ((t) => {
      let e = String(t || "");
      return (
        (e = e.replace(
          /(\d+\.\s*)?(?:檔案下載|型錄下載)\s*[:：]?\s*([^\n\r]*)/g,
          (t, e, o) => {
            const n = String(o || "");
            let r = "";
            const i = n.match(
              /https?:\/\/[\s\S]+?\.(?:pdf|docx?|xlsx?|pptx?|zip|rar|7z)(?:\?[^\s<>"']*)?(?:#[^\s<>"']*)?/i,
            );
            if (i) r = i[0];
            else {
              const t = n.match(/https?:\/\/[\s\S]+/i);
              t && (r = t[0]);
            }
            if (!r) {
              const e = String(t).match(/https?:\/\/[\s\S]+/i);
              e && (r = e[0]);
            }
            return r
              ? ((r = r.trim().replace(/\s+/g, "%20")),
                `${e || ""}<a href="${r}" target="_blank" rel="noopener">參考資料</a>`)
              : t;
          },
        )),
        e
      );
    })(String(n || ""));
    if (!a) return "";
    const s = (e, o) => {
      let n = String(e || "");
      return (
        (n = n.replace(
          /(\d+\.\s*)?(?:檔案下載|型錄下載)\s*<a\s+href="([^"]+)"[^>]*>[^<]*<\/a>/g,
          (t, e, o) =>
            `${e || ""}<a href="${o}" target="_blank" rel="noopener">參考資料</a>`,
        )),
        (n = n.replace(
          /(\d+\.\s*)?(?:檔案下載|型錄下載)\s*(https?:\/\/[^\s<>"']+)/g,
          (e, n, r) =>
            `${n || ""}<a href="${o ? t(r) : r}" target="_blank" rel="noopener">參考資料</a>`,
        )),
        (n = n.replace(
          /<a\b[^>]*href\s*=\s*"(?:\s*(?:&lt;|<)\s*a\b[^>]*href\s*=\s*")([^"]+)"[\s\S]*?<\/a>\s*"[\s\S]*?>[\s\S]*?<\/a>/gi,
          (e, o) =>
            `<a href="${t(String(o || "").trim())}" target="_blank" rel="noopener">參考資料</a>`,
        )),
        (n = n.replace(
          /<a\b[^>]*href\s*=\s*'(?:\s*(?:&lt;|<)\s*a\b[^>]*href\s*=\s*')([^']+)'[\s\S]*?<\/a>\s*'[\s\S]*?>[\s\S]*?<\/a>/gi,
          (e, o) =>
            `<a href="${t(String(o || "").trim())}" target="_blank" rel="noopener">參考資料</a>`,
        )),
        n
      );
    };
    if (e(a)) {
      let e = s(a, !0);
      if (/href\s*=\s*["'][^"']*(?:&lt;|<)\s*a\b/i.test(e)) {
        const o = r(e);
        o &&
          (e = `<a href="${t(o)}" target="_blank" rel="noopener">參考資料</a>`);
      }
      return normalizePopupOfferLinks(o((e = e.replace(/\r?\n/g, "<br>"))));
    }
    let d = t(a).replace(
      /(https?:\/\/[^\s<>"']+)/g,
      (t) => `<a href="${t}" target="_blank" rel="noopener">${t}</a>`,
    );
    return normalizePopupOfferLinks(
      o((d = s(d, !1).replace(/\r?\n/g, "<br>"))),
    );
  }

  function normalizePopupOfferLinks(html) {
    const source = String(html || "");
    if (!source || !/<\s*a\b/i.test(source)) return source;

    try {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = source;

      wrapper.querySelectorAll("a[href]").forEach((link) => {
        const label =
          String(link.getAttribute("aria-label") || link.textContent || "")
            .replace(/\s+/g, " ")
            .trim() || "開啟優惠連結";

        link.classList.add(
          "icon-btn",
          "osm-popup-icon-btn",
          "osm-popup-offer-link",
        );
        link.setAttribute("aria-label", label);
        link.setAttribute("title", label);
        if (link.getAttribute("target") === "_blank") {
          link.setAttribute("rel", "noopener");
        }
        link.innerHTML =
          '<i class="uil uil-external-link-alt" aria-hidden="true"></i>';
      });

      return wrapper.innerHTML;
    } catch (error) {
      return source;
    }
  }

  const r = {
    美食: "#e74c3c",
    美食餐廳: "#e74c3c",
    服飾: "#9b59b6",
    住宿: "#3498db",
    旅遊住宿: "#3498db",
    旅遊: "#2ecc71",
    旅游: "#2ecc71",
    休閒娛樂: "#1abc9c",
    美容舒壓: "#9b59b6",
    按摩: "#f39c12",
    泡湯休息: "#16a085",
    健康商城: "#7f8c8d",
    通勤: "#f39c12",
    其他: "#7f8c8d",
    貼文: "#2563eb",
  };
  function i(t) {
    return r[t] || "#1abc9c";
  }
  function a(t, e, o) {
    const n = i(e),
      r = Math.max(0, Number(o || 0));
    if (r <= 1)
      return t.divIcon({
        className: "dot-icon",
        html: `<div style="width:14px;height:14px;background:${n};border:2px solid rgba(0,0,0,.95);border-radius:50%;box-shadow:0 0 2px rgba(0,0,0,.35)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -8],
      });
    const a = r > 99 ? "99+" : String(r);
    return t.divIcon({
      className: "dot-icon",
      html: `<div style="position:relative;width:18px;height:18px"><div style="position:absolute;left:2px;top:2px;width:14px;height:14px;background:${n};border:2px solid rgba(0,0,0,.95);border-radius:50%;box-shadow:0 0 2px rgba(0,0,0,.35)"></div><div style="position:absolute;right:-6px;top:-6px;min-width:14px;height:14px;padding:0 2px;display:flex;align-items:center;justify-content:center;font-size:10px;line-height:1;font-weight:900;border-radius:999px;background:rgba(0,0,0,.92);color:#fff;border:1px solid rgba(255,255,255,.7);box-shadow:0 2px 8px -4px rgba(0,0,0,.4)">${a}</div></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10],
    });
  }
  const s = "下載Gomaji app，輸入推薦碼6DA78可獲得$120優惠";
  function c(t) {
    let e = (t = String(t || "").trim()).match(/(?:store\/)?(\d+\/pid\/\d+)/i);
    return e
      ? "https://www.gomaji.com/store/" + e[1].replace(/^store\//i, "")
      : "";
  }
  function d(t, e) {
    const o = [];
    return (
      qt(t)
        .concat(qt(e))
        .forEach((t) => {
          (t = String(t || "").trim()) && !o.includes(t) && o.push(t);
        }),
      o.join("\n")
    );
  }
  function l(t) {
    const e = [];
    for (const o of t || []) {
      if (!o || "object" != typeof o) continue;
      const t = String(o.name || "").trim(),
        n = o.cat || "",
        r = o.offer || "",
        i = o.offer_price || o.offerPrice || o.offer_price_text || "",
        a = o.offer_adv || o.offerAdv || o.offerADV || "",
        s =
          o.offer_advpicURL ||
          o.offer_adv_pic_url ||
          o.offerAdvPicURL ||
          o.offerADVPicURL ||
          "",
        l = o.phone || "";
      let p = Array.isArray(o.branches) ? o.branches : [];
      if (!p.length) {
        const t = String(o.address || "").trim(),
          e = "lat" in o ? o.lat : "latitude" in o ? o.latitude : void 0;
        let n =
          "lon" in o
            ? o.lon
            : "lng" in o
              ? o.lng
              : "longitude" in o
                ? o.longitude
                : "long" in o
                  ? o.long
                  : void 0;
        const r = isFinite(Number(e)) && isFinite(Number(n));
        (t || r) && (p = [{ address: t, lat: e, lon: n }]);
      }
      p.length || (p = [{ address: "", lat: void 0, lon: void 0 }]);
      for (const m of p || []) {
        if (!m || "object" != typeof m) continue;
        const p = String(m.address || "").trim(),
          u = "lat" in m ? m.lat : "latitude" in m ? m.latitude : void 0;
        let f =
          "lon" in m
            ? m.lon
            : "lng" in m
              ? m.lng
              : "longitude" in m
                ? m.longitude
                : "long" in m
                  ? m.long
                  : void 0;
        const g =
            "expire" in m
              ? m.expire
              : "expiry" in m
                ? m.expiry
                : "exp" in m
                  ? m.exp
                  : "end" in m
                    ? m.end
                    : "until" in m
                      ? m.until
                      : o.expire || o.expiry || o.exp || o.end || o.until || "",
          h = "cat" in m ? m.cat : n,
          b = "offer" in m ? m.offer : r,
          _ =
            "offer_price" in m
              ? m.offer_price
              : "offerPrice" in m
                ? m.offerPrice
                : i,
          w = "offer_adv" in m ? m.offer_adv : "offerAdv" in m ? m.offerAdv : a,
          v =
            "offer_advpicURL" in m
              ? m.offer_advpicURL
              : "offer_adv_pic_url" in m
                ? m.offer_adv_pic_url
                : "offerAdvPicURL" in m
                  ? m.offerAdvPicURL
                  : s,
          y = "phone" in m ? m.phone : l,
          x = "urls" in m ? m.urls : o.urls || "",
          S =
            "GomajiIDURL" in m
              ? m.GomajiIDURL
              : "GomajiIDURL" in o
                ? o.GomajiIDURL
                : "",
          L =
            "isGomaji" in m
              ? m.isGomaji
              : "isgomaji" in m
                ? m.isgomaji
                : o.isGomaji || o.isgomaji || S || 0;
        e.push({
          __src: o.__src || "",
          name: t,
          cat: h || "",
          offer: b || "",
          offer_price: _ || "",
          offer_adv: w || "",
          offer_advpicURL: v || "",
          phone: y || "",
          urls: d(x, c(S)),
          GomajiIDURL: String(S || ""),
          isGomaji: L ? 1 : 0,
          address: p,
          lat: u,
          lon: f,
          expire: g,
        });
      }
    }
    return e;
  }
  function p(t, e) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent([t, e].filter(Boolean).join(" "))
    );
  }
  function m() {
    return document.body && "dark" === document.body.getAttribute("data-theme");
  }
  function u(t) {
    try {
      if ("function" == typeof window.flashMsg) return window.flashMsg(t);
    } catch (t) {}
    try {
      alert(t);
    } catch (t) {}
  }
  function f() {
    if (!document.getElementById("leaflet-css")) {
      const t = document.createElement("link");
      ((t.id = "leaflet-css"),
        (t.rel = "stylesheet"),
        (t.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"),
        document.head.appendChild(t));
    }
    if (document.getElementById("osm-map-style")) return;
    const t = document.createElement("style");
    ((t.id = "osm-map-style"),
      (t.textContent =
        "#app_map{position:relative;height:200px;min-height:200px;max-height:200px;isolation:isolate;overflow:hidden}\n#app_map>.panel-header{position:relative;z-index:10;flex:0 0 auto;gap:.75rem;padding:.5rem .65rem;margin:0 0 .7rem;border:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-radius:var(--r-md);background:var(--glass);backdrop-filter:saturate(180%) blur(16px);box-shadow:var(--shadow-xs)}\n#app_map>.panel-header h4{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n#app_map .osm-map-actions{position:relative;z-index:11;flex:0 0 auto}\n#osmMap{position:absolute;inset:0;width:100%;height:100%;min-height:100%;aspect-ratio:auto;border-radius:inherit;overflow:hidden;border:0;background:var(--c-bg-soft);z-index:0}\n#app_map .leaflet-top{top:calc(56px + .9rem)}\n.osm-lazy-placeholder{width:100%;height:100%;min-height:120px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.6rem;color:var(--c-text-soft);font-weight:800;letter-spacing:.4px}\n.osm-lazy-spinner{width:22px;height:22px;border:2px solid rgba(0,0,0,.16);border-top-color:var(--c-primary);border-radius:50%;animation:osmSpin 1s linear infinite}\n@keyframes osmSpin{to{transform:rotate(360deg)}}\n.osm-map-actions{display:flex;align-items:center;gap:.45rem}\n#app_map.osm-fullscreen{z-index:25000;max-width:none;max-height:none;width:100%;height:100%;min-height:100%;border-radius:0;box-shadow:var(--shadow-lg);overflow:hidden;display:block;padding:calc(1rem + env(safe-area-inset-top)) 1rem calc(1rem + env(safe-area-inset-bottom));background:var(--c-bg-alt);isolation:isolate}\n#app_map.osm-css-fullscreen{position:fixed;inset:0;width:100vw;height:100vh}\n#app_map.osm-fullscreen:after{display:none}\n#app_map.osm-fullscreen .panel-header{position:relative;top:auto;z-index:10020;background:var(--glass);backdrop-filter:saturate(180%) blur(18px);padding:.5rem .65rem;margin:0 0 .7rem;border-radius:var(--r-md)}\n#app_map.osm-fullscreen .osm-map-actions{position:relative;z-index:10021}\n#app_map.osm-fullscreen #osmMap{inset:0;width:100%;height:100%;min-height:100%;aspect-ratio:auto;border-radius:0;position:absolute;z-index:0}\nbody.osm-no-scroll{overflow:hidden;transform:none!important}\nbody#ScrollToyBody.osm-no-scroll{transform:none!important}\nbody.osm-no-scroll #ScrollToy{display:none!important}\n.dot-icon{background:transparent;border:none}\n.leaflet-container{font:inherit}\n#app_map.osm-theme-dark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.88) contrast(.92)}\n.leaflet-popup-content-wrapper{background:var(--c-bg-alt);color:var(--c-text);border:1px solid var(--c-border);border-radius:14px}\n.leaflet-popup-tip{background:var(--c-bg-alt)}\n.leaflet-popup-content{margin:10px 12px}\n.leaflet-control-attribution{font-size:.62rem;line-height:1.1;padding:2px 8px;margin:0 8px 8px 0;background:var(--glass);border:1px solid var(--c-border);border-radius:999px;backdrop-filter:saturate(180%) blur(10px);color:var(--c-text-soft)}\n.leaflet-control-attribution a{color:inherit}\n.leaflet-bar a{background:var(--glass);border:1px solid var(--c-border);color:var(--c-text);border-radius:10px}\n.leaflet-bar a:hover{background:var(--c-bg-soft)}\n.leaflet-bar{border:none;box-shadow:none}\n.osm-legend{position:relative;padding:8px 10px;border-radius:12px;border:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(10px);font-size:.72rem;line-height:1.2;color:var(--c-text);display:none}\n.osm-legend.is-visible{display:block}\n.osm-legend-row{display:flex;align-items:center;gap:6px;margin:3px 0}\n.osm-legend-dot{width:10px;height:10px;border-radius:50%;border:1px solid rgba(255,255,255,.9);box-shadow:0 0 0 1px rgba(0,0,0,.12) inset}\n.osm-popup-stack{display:flex;flex-direction:column;gap:10px;max-height:min(60vh,520px);overflow:auto;padding-right:2px}\n.osm-popup-stack::-webkit-scrollbar{width:8px}\n.osm-popup-stack::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--c-border),transparent 35%);border-radius:999px}\n.osm-popup{background:color-mix(in oklab,var(--c-bg-soft),transparent 25%);border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);border-radius:12px;padding:10px 10px}\n.osm-popup-title{font-size:.96rem;font-weight:800;letter-spacing:.3px;line-height:1.15;margin:0 0 .25rem;color:var(--c-text)}\n.osm-popup-meta{font-size:.76rem;font-weight:700;letter-spacing:.2px;line-height:1.25;color:var(--c-text-soft);margin:.1rem 0}\n.osm-popup-meta b{color:var(--c-text);font-weight:900}\n.osm-popup-offer{margin:.45rem 0 0}\n.osm-popup-offer .caption{display:flex;align-items:center;flex-wrap:wrap;gap:.45rem;font-size:.85rem}\n.osm-popup-actions{margin:.55rem 0 0;display:flex;align-items:center;justify-content:space-between;gap:.45rem}\n.osm-popup-actions .caption{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem;min-width:0}\n.osm-popup-actions .caption a{white-space:nowrap}\n.osm-popup-feeds{display:flex;align-items:center;gap:.35rem;flex:0 0 auto}\n.osm-popup-avatar{width:30px;height:30px;border-radius:50%;overflow:hidden;border:2px solid var(--c-bg-alt);background:var(--c-bg-alt);box-shadow:0 4px 12px -6px rgba(0,0,0,.35);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;position:relative}\n.osm-popup-avatar img{width:100%;height:100%;object-fit:cover}\n.osm-popup-avatar:hover{transform:translateY(-1px)}\n.osm-popup-feedcount{height:28px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;border-radius:999px;border:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(10px);font-weight:950;font-size:.72rem;letter-spacing:.3px;line-height:1;color:var(--c-text)}\n.osm-popup-feedcount b{font-weight:950}\n.osm-popup a{display:inline-flex;align-items:center;gap:.35rem;padding:.33rem .6rem;border:1px solid var(--c-border);border-radius:999px;background:var(--glass);backdrop-filter:saturate(180%) blur(10px);color:var(--c-text);text-decoration:none;font-weight:800;font-size:.78rem;line-height:1}\n.osm-popup a:hover{background:var(--c-bg-soft)}\n.osm-popup a.osm-popup-icon-btn{width:42px;min-width:42px;height:42px;padding:0;justify-content:center;border-radius:50%;font-size:1.3rem;flex:0 0 42px}\n.osm-popup a.osm-popup-icon-btn:hover{background:var(--c-primary);border-color:var(--c-primary);color:#fff;box-shadow:0 8px 20px -8px rgba(0,0,0,.7)}\n.osm-popup a.osm-popup-icon-btn:focus-visible{outline:3px solid color-mix(in oklab,var(--c-primary),transparent 55%);outline-offset:2px}\n.osm-feed-block{background:color-mix(in oklab,var(--c-bg-soft),transparent 12%);border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);border-radius:12px;padding:10px 10px}\n.osm-feed-list{display:flex;flex-direction:column;gap:8px;margin-top:6px}\n.osm-feed-row{display:flex;gap:10px;align-items:flex-start;padding:6px;border-radius:12px;cursor:pointer}\n.osm-feed-row:hover{background:color-mix(in oklab,var(--c-bg),transparent 78%)}\n#app_map.osm-theme-dark .osm-feed-row:hover{background:rgba(255,255,255,.08)}\n.osm-feed-text{flex:1;min-width:0}\n.osm-feed-title{font-size:.86rem;font-weight:900;letter-spacing:.2px;line-height:1.2}\n.osm-feed-sub{font-size:.72rem;font-weight:800;opacity:.72;margin-top:2px}\n.osm-feed-sn{font-size:.78rem;opacity:.85;margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.osm-feed-modal{position:fixed;inset:0;z-index:31000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.38);backdrop-filter:saturate(120%) blur(10px)}\n.osm-feed-modal.open{display:flex}\nbody.osm-feed-modal-open{overflow:hidden}\n.osm-feed-modal-card{position:relative;width:min(780px,94vw);max-height:min(88vh,980px);overflow:hidden;border-radius:20px;background:var(--c-bg-alt);border:1px solid var(--c-border);box-shadow:var(--shadow-lg);display:flex;flex-direction:column}\n.osm-feed-modal-top{position:sticky;top:0;z-index:2;background:var(--glass);backdrop-filter:saturate(180%) blur(18px);border-bottom:1px solid var(--c-border)}\n.osm-feed-modal-topbar{display:flex;align-items:center;gap:12px;padding:12px 12px}\n.osm-feed-modal-brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1}\n.osm-feed-modal-brand i{font-size:1.3rem;color:var(--c-primary);flex:0 0 auto}\n.osm-feed-modal-brandtext{min-width:0;display:flex;flex-direction:column}\n.osm-feed-modal-brand .osm-popup-title{margin:0;font-size:.92rem;line-height:1.15}\n.osm-feed-modal-brand .osm-popup-meta{margin:0;margin-top:2px;font-size:.7rem;opacity:.82;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:min(62vw,520px)}\n.osm-feed-modal-close{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:14px;border:1px solid var(--c-border);background:transparent;color:var(--c-text);font-size:22px;font-weight:900;cursor:pointer;flex:0 0 auto}\n.osm-feed-modal-close:hover{background:var(--c-bg-soft)}\n.osm-feed-modal-bodywrap{padding:12px 14px 16px;overflow:auto}\n.osm-feed-modal-bodywrap .osm-popup-stack{max-height:none;overflow:visible;padding-right:0}\n.osm-feed-modal-head{display:flex;align-items:center;gap:10px;margin:2px 0 10px}\n.osm-feed-modal-user{display:flex;align-items:center;gap:10px;min-width:0;flex:1}\n.osm-feed-modal-user img{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid var(--c-bg-alt);box-shadow:0 4px 12px -6px rgba(0,0,0,.35)}\n.osm-feed-modal-user-name{font-weight:900;letter-spacing:.2px;line-height:1.1}\n.osm-feed-modal-user-sub{font-size:.76rem;font-weight:800;opacity:.72;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.osm-feed-modal-title{font-size:1.06rem;font-weight:950;letter-spacing:.2px;line-height:1.25;margin:8px 0 8px}\n.osm-feed-modal-caption .caption{font-size:.92rem}\n.osm-feed-modal-imgs{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}\n@media(min-width:520px){.osm-feed-modal-imgs{grid-template-columns:repeat(3,1fr)}}\n.osm-feed-modal-imgbtn{border:0;padding:0;background:transparent;border-radius:14px;overflow:hidden;cursor:pointer}\n.osm-feed-modal-imgbtn img{width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:1/1}\n.osm-feed-modal-actions{display:flex;align-items:center;gap:8px;margin:4px 0 10px}\n.osm-feed-modal-actions button{display:inline-flex;align-items:center;gap:6px;padding:.36rem .68rem;border-radius:999px;border:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(10px);color:var(--c-text);font-weight:900;font-size:.78rem;line-height:1;cursor:pointer}\n.osm-feed-modal-actions button:hover{background:var(--c-bg-soft)}\n.osm-list-modal{position:fixed;inset:0;z-index:31500;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.38);backdrop-filter:saturate(120%) blur(10px)}\n.osm-list-modal.open{display:flex}\nbody.osm-list-modal-open{overflow:hidden}\n.osm-list-card{width:min(980px,96vw);max-height:min(88vh,980px);overflow:hidden;border-radius:20px;background:var(--c-bg-alt);border:1px solid var(--c-border);box-shadow:var(--shadow-lg);display:flex;flex-direction:column}\n.osm-list-top{display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(18px)}\n.osm-list-title{display:flex;align-items:center;gap:9px;min-width:0;flex:1;font-weight:950;letter-spacing:.25px}\n.osm-list-title i{font-size:1.25rem;color:var(--c-primary)}\n.osm-list-close{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:14px;border:1px solid var(--c-border);background:transparent;color:var(--c-text);font-size:22px;font-weight:900;cursor:pointer;flex:0 0 auto}\n.osm-list-close:hover{background:var(--c-bg-soft)}\n.osm-list-body{padding:10px 12px 14px;overflow:auto}\n.osm-list-table{width:100%;border-collapse:separate;border-spacing:0 7px;font-size:.82rem}\n.osm-list-table th{text-align:left;white-space:nowrap;color:var(--c-text-soft);font-size:.72rem;padding:0 8px;font-weight:950}\n.osm-list-table td{vertical-align:top;background:color-mix(in oklab,var(--c-bg-soft),transparent 25%);border-top:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-bottom:1px solid color-mix(in oklab,var(--c-border),transparent 12%);padding:9px 8px;line-height:1.35}\n.osm-list-table td:first-child{border-left:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-radius:12px 0 0 12px;font-weight:900;white-space:nowrap}\n.osm-list-table td:last-child{border-right:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-radius:0 12px 12px 0;white-space:nowrap}\n.osm-list-table .osm-list-name{font-weight:950;color:var(--c-text)}\n.osm-list-table .osm-list-offer{max-width:360px}\n.osm-list-table a,.osm-list-table button,.osm-ad-actions button,.osm-ad-actions a{display:inline-flex;align-items:center;justify-content:center;gap:.3rem;border:1px solid var(--c-border);border-radius:999px;background:var(--glass);color:var(--c-text);text-decoration:none;font-weight:900;font-size:.76rem;line-height:1;padding:.34rem .62rem;cursor:pointer}\n.osm-list-table .osm-list-icon-btn{width:30px;height:30px;padding:0;gap:0}.osm-list-table .osm-list-icon-btn i{font-size:1.02rem;line-height:1;margin:0}\n.osm-list-table a:hover,.osm-list-table button:hover,.osm-ad-actions button:hover,.osm-ad-actions a:hover{background:var(--c-bg-soft)}\n.map-ad-feed{border:1px solid color-mix(in oklab,var(--c-primary),transparent 72%);background:#fff!important;overflow:hidden}\n.map-ad-feed .map-ad-head{align-items:flex-start;gap:.65rem;padding-bottom:.15rem}\n.map-ad-feed .map-ad-head .info{min-width:0;flex:1}\n.map-ad-feed .map-ad-head h3{font-size:1rem;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0}\n.map-ad-feed .map-ad-head small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.map-ad-sponsored{display:inline-flex;align-items:center;gap:.25rem;margin-bottom:.2rem;padding:.16rem .48rem;border-radius:999px;background:color-mix(in oklab,var(--c-primary),transparent 84%);color:var(--c-primary);font-size:.68rem;font-weight:950;letter-spacing:.04em}\n.map-ad-feed .feed-header .actions{display:flex;gap:.4rem;align-items:center;flex:0 0 auto}\n.map-ad-card{display:grid;grid-template-columns:minmax(220px,46%) minmax(240px,1fr);gap:.78rem;margin:.5rem 0 .1rem;align-items:start}\n.map-ad-thumb{border-radius:18px;overflow:hidden;background:color-mix(in oklab,var(--c-bg-soft),transparent 10%);border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);min-height:96px;box-shadow:0 12px 26px -20px rgba(0,0,0,.45)}\n.map-ad-thumb img{width:100%;height:100%;min-height:96px;object-fit:cover;display:block}\n.map-ad-noimg{height:100%;min-height:96px;display:flex;align-items:center;justify-content:center;color:var(--c-primary);font-size:2rem}\n.map-ad-copy{min-width:0;display:flex;flex-direction:column;gap:.35rem}\n.map-ad-meta{color:var(--c-text-soft);font-weight:850;font-size:.76rem;line-height:1.35;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}\n.map-ad-offer{align-self:flex-start;display:inline-flex;align-items:center;gap:.28rem;padding:.22rem .55rem;border-radius:999px;background:color-mix(in oklab,var(--c-primary),transparent 87%);color:var(--c-primary);font-weight:950;font-size:.76rem;line-height:1.25}\n.map-ad-summary{color:var(--c-text-soft);font-size:.72rem;line-height:1.42;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}\n.map-ad-actions{display:flex;flex-wrap:wrap;gap:.42rem;margin-top:.2rem;align-items:center;justify-content:flex-end}\n.map-ad-actions button,.map-ad-actions a,.osm-list-table a,.osm-list-table button,.osm-ad-actions button,.osm-ad-actions a{display:inline-flex;align-items:center;justify-content:center;gap:.3rem;border:1px solid var(--c-border);border-radius:999px;background:var(--glass);color:var(--c-text);text-decoration:none;font-weight:900;font-size:.76rem;line-height:1;padding:.34rem .62rem;cursor:pointer}\n.map-ad-actions button:hover,.map-ad-actions a:hover,.osm-list-table a:hover,.osm-list-table button:hover,.osm-ad-actions button:hover,.osm-ad-actions a:hover{background:var(--c-bg-soft)}\n.map-ad-actions .more-btn{margin-right:auto!important;border-color:color-mix(in oklab,var(--c-primary),transparent 45%)!important;color:var(--c-primary)!important;background:color-mix(in oklab,var(--c-primary),transparent 90%)!important}\n.feed-actions.map-ad-actions>.right{display:flex;gap:.75rem;align-items:center;margin-left:0}.feed-actions.map-ad-actions>.right>a,.feed-actions.map-ad-actions>.right>button{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;padding:0;border-radius:50%;border:1px solid var(--c-border)!important;background:var(--c-bg-soft)!important;color:var(--c-text-soft)!important;font-size:1.25rem;line-height:1;text-decoration:none;cursor:pointer;transition:var(--trans);box-shadow:none;flex:0 0 auto}.feed-actions.map-ad-actions>.right>a:hover,.feed-actions.map-ad-actions>.right>button:hover{background:var(--c-primary)!important;color:#fff!important;border-color:var(--c-primary)!important;box-shadow:0 10px 24px -10px rgba(0,137,39,.6)}.feed-actions.map-ad-actions>.right>a i,.feed-actions.map-ad-actions>.right>button i{margin:0;font-size:1.25rem;line-height:1}.map-ad-feed:not(.map-ad-expanded) .map-ad-body{overflow:hidden}.map-ad-feed.map-ad-expanded .map-ad-body{max-height:none!important;overflow:visible!important}\n.map-ad-details{display:none;margin-top:.65rem;padding-top:.65rem;border-top:1px dashed color-mix(in oklab,var(--c-border),transparent 10%)}\n.map-ad-feed.map-ad-expanded .map-ad-details{display:block}\n.map-ad-detail-text{white-space:pre-line;color:var(--c-text-soft);font-size:.72rem;line-height:1.46}.map-ad-detail-text .map-ad-bullet::before{display:none}.map-ad-detail-text .map-ad-bullet{gap:0}.map-ad-detail-text .map-ad-bullets{list-style:none;padding:0}\n.map-ad-gallery{min-width:0;display:grid;grid-template-columns:1fr;gap:.4rem;margin-top:0;align-content:start}\n.map-ad-gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px;border:1px solid color-mix(in oklab,var(--c-border),transparent 20%);cursor:zoom-in}.map-ad-body{justify-self:end;width:min(100%,390px)}.map-ad-hero{min-height:190px}.map-ad-gallery-count{position:absolute;right:.45rem;bottom:.45rem;padding:.18rem .45rem;border-radius:999px;background:rgba(0,0,0,.62);color:#fff;font-size:.68rem;font-weight:900;line-height:1}\n@media(max-width:860px){.map-ad-card{grid-template-columns:minmax(170px,42%) minmax(220px,1fr)}.map-ad-body{width:min(100%,360px)}.map-ad-hero{min-height:160px}}@media(max-width:560px){.map-ad-card{grid-template-columns:128px minmax(0,1fr);gap:.58rem}.map-ad-thumb,.map-ad-thumb img,.map-ad-noimg{min-height:128px}.map-ad-hero{min-height:128px}.map-ad-body{justify-self:stretch;width:100%}.map-ad-gallery{grid-template-columns:1fr}}"),
      document.head.appendChild(t));
  }
  function g() {
    return new Promise((t, e) => {
      if (window.L && "function" == typeof window.L.map) return t(window.L);
      const o = document.getElementById("leaflet-js");
      if (o)
        return (
          o.addEventListener("load", () => t(window.L)),
          void o.addEventListener("error", () =>
            e(new Error("leaflet load error")),
          )
        );
      const n = document.createElement("script");
      ((n.id = "leaflet-js"),
        (n.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"),
        (n.onload = () => t(window.L)),
        (n.onerror = () => e(new Error("leaflet load error"))),
        document.head.appendChild(n));
    });
  }
  const h = {};
  function b(t) {
    try {
      return "function" == typeof window.versionedUrl
        ? window.versionedUrl(t)
        : "function" == typeof versionedUrl
          ? versionedUrl(t)
          : t;
    } catch (e) {
      return t;
    }
  }
  function _(t) {
    return (t = String(t || "").trim())
      ? ((t = b(t)),
        h[t] ||
          (h[t] = new Promise((e, o) => {
            const n = document.createElement("script");
            ((n.src = t),
              (n.async = !0),
              (n.onload = () => e()),
              (n.onerror = () => o(new Error("load error"))),
              document.head.appendChild(n));
          })),
        h[t])
      : Promise.reject(new Error("empty src"));
  }
  const w = "0.8.12",
    v = [
      "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/+esm",
      "https://esm.sh/sql.js-httpvfs@0.8.12?bundle",
    ],
    y =
      "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sqlite.worker.js",
    x = "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sql-wasm.wasm",
    S = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js",
    L = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/";
  function A() {
    return (
      window.__OSM_LOAD_STATS__ ||
      (window.__OSM_LOAD_STATS__ = { sqliteFiles: {}, errors: [] })
    );
  }
  function E(t, e) {
    try {
      const o = A();
      (o.errors || (o.errors = [])).push({
        label: String(t || ""),
        message: String((e && e.message) || e || ""),
        time: new Date().toISOString(),
      });
    } catch (t) {}
  }
  function M(t) {
    return String(t || "")
      .split("/")
      .pop()
      .split("?")[0]
      .split("#")[0];
  }
  function O(t) {
    const e = M(t).trim();
    return e ? e.replace(/\.(js|json)$/i, ".sqlite") : "";
  }
  function k(t) {
    return /\.(sqlite|db|sqlite3)(\?|#|$)/i.test(String(t || ""));
  }
  function R(t) {
    return (
      /^(https?:)?\/\//i.test(String(t || "")) ||
      /^(data:|blob:)/i.test(String(t || ""))
    );
  }
  function T(t) {
    try {
      const e = new URL(String(t || ""), location.href),
        o = String(e.hostname || "").toLowerCase();
      return (
        o === String(location.hostname || "").toLowerCase() &&
        (-1 !== o.indexOf("googleusercontent.com") ||
          -1 !== String(e.pathname || "").indexOf("/embeds/"))
      );
    } catch (t) {
      return !1;
    }
  }
  function j(t) {
    t = String(t || "")
      .trim()
      .replace(/^\/+/, "");
    const e =
        "undefined" != typeof window && window
          ? window
          : "undefined" != typeof globalThis && globalThis
            ? globalThis
            : {},
      o = String(e.CDNurl || e.CDNURL || "")
        .trim()
        .replace(/\/+$/, "");
    return o ? o + "/" + t : t;
  }
  function C(t) {
    return (t = String(t || "").trim()) ? (R(t) ? [b(t)] : [j(t)]) : [];
  }
  function P(t) {
    let e = String(t || "").trim();
    if (!e) return "";
    try {
      return new URL(b(e), location.href).href;
    } catch (t) {
      return b(e);
    }
  }
  function D(t, e) {
    const o = P(e);
    o && t.indexOf(o) < 0 && t.push(o);
  }
  function I(t, e) {
    try {
      const o = new URL(String(t || ""), location.href);
      return (
        (o.pathname = o.pathname.replace(
          /[^/]*$/,
          String(e || "").replace(/^\//, ""),
        )),
        (o.search = ""),
        (o.hash = ""),
        o.href
      );
    } catch (t) {
      return "";
    }
  }
  function F() {
    try {
      return (
        ("function" == typeof cchPreferCdnAssets && cchPreferCdnAssets()) ||
        !!window.__CCH_CDN_FIRST__
      );
    } catch (t) {
      return !1;
    }
  }
  function $(t) {
    return "geocode.sqlite" === M(t).toLowerCase();
  }
  function N(t) {
    const e = M(t).toLowerCase();
    return (
      !!e &&
      "map.js" !== e &&
      "geocode.sqlite" !== e &&
      /\.(sqlite|db|sqlite3|js|json)$/i.test(e)
    );
  }
  function U() {
    const t = [];
    try {
      const e =
        "undefined" != typeof settings && settings && settings[0]
          ? settings[0]
          : null;
      if (!e) return t;
      ["map", "mapdata"].forEach((o) => {
        Array.isArray(e[o]) && t.push.apply(t, e[o]);
      });
    } catch (t) {}
    return t;
  }
  function q() {
    return String(window.OSM_MAP_DATA_FILE || "").trim() || "";
  }
  function B() {
    const t = [];
    try {
      const e = U();
      for (const o of e) {
        const e = o && o.script;
        if (Array.isArray(e))
          for (const o of e)
            if (o)
              for (const e in o)
                Object.prototype.hasOwnProperty.call(o, e) &&
                  N(e) &&
                  t.push(O(e));
      }
    } catch (t) {}
    return [...new Set(t.map((t) => String(t).trim()).filter(Boolean))];
  }
  function z(t) {
    const e = O(t);
    let o = "";
    try {
      const t = U();
      for (const n of t) {
        const t = n && n.script;
        if (Array.isArray(t)) {
          for (const n of t)
            if (n && "object" == typeof n) {
              for (const t of Object.keys(n))
                if (O(t).toLowerCase() === e.toLowerCase()) {
                  o = String(n[t] || "")
                    .trim()
                    .replace(/\.(js|json)(\?|#|$)/i, ".sqlite$2");
                  break;
                }
              if (o) break;
            }
          if (o) break;
        }
      }
    } catch (t) {}
    const n = [],
      r = (t) => D(n, t),
      i = F(),
      a = !1 !== window.__OSM_SQLITE_LOCAL_FIRST__ && !i,
      s =
        window.__OSM_SQLITE_MAP_WORKER_URLS__ &&
        window.__OSM_SQLITE_MAP_WORKER_URLS__["map.sqlite"];
    $(e) && s && r(I(s, e));
    const c = [e],
      d = [];
    try {
      if ("function" == typeof window.cchAssetCandidates) {
        const t = window.cchAssetCandidates(o || e) || [];
        for (const e of t) e && d.indexOf(e) < 0 && d.push(e);
      }
    } catch (t) {}
    const l = [];
    o && o !== e && l.push(o);
    for (const t of C(o || e)) t && l.indexOf(t) < 0 && l.push(t);
    (a ? c.concat(l, d) : l.concat(d, c)).forEach(r);
    let m = n;
    (i &&
      !window.__CCH_ALLOW_LOCAL_EMBED_FALLBACK__ &&
      (m = n.filter((t) => !T(t))),
      m.length || (m = n.length ? n : [new URL(e, location.href).href]));
    try {
      const t = A();
      ((t.sqliteCandidates = t.sqliteCandidates || {}),
        (t.sqliteCandidates[e] = m.slice()));
    } catch (t) {}
    return m;
  }
  function G(t) {
    return z(t)[0];
  }
  function Q(t) {
    if (!Array.isArray(t)) return [];
    if (
      t.length &&
      t[0] &&
      Array.isArray(t[0].values) &&
      Array.isArray(t[0].columns)
    ) {
      const e = t[0].columns;
      return t[0].values.map((t) => {
        const o = {};
        return (e.forEach((e, n) => (o[e] = t[n])), o);
      });
    }
    return t;
  }
  async function H() {
    if (window.__SQLITE_HTTPVFS_MODULE__)
      return window.__SQLITE_HTTPVFS_MODULE__;
    let t = null;
    for (const e of v)
      try {
        const t = await import(b(e)),
          o = t.createDbWorker || (t.default && t.default.createDbWorker);
        if (o)
          return (
            (window.__SQLITE_HTTPVFS_MODULE__ = { createDbWorker: o }),
            window.__SQLITE_HTTPVFS_MODULE__
          );
      } catch (e) {
        t = e;
      }
    throw t || new Error("sql.js-httpvfs import failed");
  }
  function K() {
    if (window.__OSM_SQLITE_MAP_WORKER_URL__)
      return window.__OSM_SQLITE_MAP_WORKER_URL__;
    const t = "importScripts(" + JSON.stringify(b(y)) + ");";
    return (
      (window.__OSM_SQLITE_MAP_WORKER_URL__ = URL.createObjectURL(
        new Blob([t], { type: "text/javascript" }),
      )),
      window.__OSM_SQLITE_MAP_WORKER_URL__
    );
  }
  function W(t, e) {
    const o = t.prepare(e),
      n = [];
    try {
      for (; o.step();) n.push(o.getAsObject());
    } finally {
      try {
        o.free();
      } catch (t) {}
    }
    return n;
  }
  async function V(t, e) {
    if (t && t.__fullSqliteDb) return W(t.__fullSqliteDb, e);
    if (t && t.db && "function" == typeof t.db.query)
      try {
        return Q(await t.db.query(e));
      } catch (t) {}
    return t && t.db && "function" == typeof t.db.exec
      ? Q(await t.db.exec(e))
      : [];
  }
  function J(t) {
    const e = String(t || "").trim();
    if (!e) return [];
    const o = [];
    function n(t) {
      (t = String(t || "").trim()) && o.indexOf(t) < 0 && o.push(t);
    }
    return (
      n(e),
      n(e.replace(/[\u3000\s]+/g, "")),
      n(e.replace(/臺/g, "台")),
      n(e.replace(/台/g, "臺")),
      n(e.replace(/臺/g, "台").replace(/[\u3000\s]+/g, "")),
      n(e.replace(/台/g, "臺").replace(/[\u3000\s]+/g, "")),
      o
    );
  }
  function Y(t, e) {
    return ((t = Number(t)), (e = Number(e)), isFinite(t) && isFinite(e));
  }
  function Z() {
    return { byAddress: {}, byId: {} };
  }
  function X(t, e, o, n, r) {
    (t.byAddress || (t.byAddress = {}), t.byId || (t.byId = {}));
    const i = String(null == e ? "" : e).trim(),
      a = String(o || "").trim(),
      s = Y(n, r);
    if (
      (i && !t.byId[i] && (t.byId[i] = { address: a, lat: null, lon: null }),
      !s)
    )
      return;
    const c = [Number(n), Number(r)];
    if ("OSM_MAP_DEFAULT_CENTER" === a)
      try {
        window.OSM_MAP_DEFAULT_CENTER = c;
      } catch (t) {}
    (i && (t.byId[i] = { address: a, lat: c[0], lon: c[1] }),
      J(a).forEach((e) => {
        t.byAddress[e] = c;
      }));
  }
  function tt(t, e) {
    const o = (t && t.byAddress) || t || {};
    for (const t of J(e)) {
      const e = o && o[t];
      if (Array.isArray(e) && Y(e[0], e[1]))
        return [Number(e[0]), Number(e[1])];
    }
    return null;
  }
  function et(t, e) {
    const o = String(null == e ? "" : e).trim();
    if (!o) return null;
    const n = t && t.byId && t.byId[o];
    return n
      ? Y(n.lat, n.lon)
        ? {
            address: String(n.address || ""),
            lat: Number(n.lat),
            lon: Number(n.lon),
          }
        : { address: String(n.address || ""), lat: null, lon: null }
      : null;
  }
  async function ot() {
    if (window.__OSM_GEOCODE_CACHE__) return window.__OSM_GEOCODE_CACHE__;
    const t = { byAddress: {}, byId: {} };
    let e = null;
    try {
      e = await at("GeoCode.sqlite");
    } catch (e) {
      E("GeoCode.sqlite load failed", e);
      try {
        const t = A();
        t.geocode = Object.assign(t.geocode || {}, {
          ok: !1,
          error: String((e && e.message) || e),
        });
      } catch (t) {}
      return ((window.__OSM_GEOCODE_CACHE__ = t), t);
    }
    let o = 0;
    async function n(n) {
      let r = [];
      try {
        r = await V(e, "SELECT GeoCodeID,address,lat,lon FROM " + dt(n));
      } catch (t) {
        try {
          r = await V(
            e,
            "SELECT id AS GeoCodeID,address,lat,lon FROM " + dt(n),
          );
        } catch (t) {
          r = [];
        }
      }
      o += (r && r.length) || 0;
      for (const e of r || [])
        X(t, e && e.GeoCodeID, e && e.address, e && e.lat, e && e.lon);
    }
    await n("QuickGeo");
    await n("GoogleGeo");
    window.__OSM_GEOCODE_CACHE__ = t;
    try {
      A().geocode = {
        ok: !0,
        url:
          (window.__OSM_SQLITE_MAP_WORKER_URLS__ &&
            window.__OSM_SQLITE_MAP_WORKER_URLS__["GeoCode.sqlite"]) ||
          "",
        rows: o,
        byId: Object.keys(t.byId || {}).length,
        byAddress: Object.keys(t.byAddress || {}).length,
        center: window.OSM_MAP_DEFAULT_CENTER || null,
      };
    } catch (t) {}
    return t;
  }
  async function nt() {
    return window.SQL && window.SQL.Database
      ? window.SQL
      : (window.__OSM_SQLJS_PROMISE__ ||
          (window.__OSM_SQLJS_PROMISE__ = _(S)
            .then(() => {
              if (
                "function" != typeof window.initSqlJs &&
                "function" != typeof initSqlJs
              )
                throw new Error("initSqlJs missing");
              return (
                "function" == typeof window.initSqlJs
                  ? window.initSqlJs
                  : initSqlJs
              )({ locateFile: (t) => L + t });
            })
            .then((t) => ((window.SQL = t), t))),
        window.__OSM_SQLJS_PROMISE__);
  }
  async function rt(t) {
    const e = b(t),
      o = await fetch(e, { cache: "no-store" });
    if (!o.ok) throw new Error("fetch " + e + " status " + o.status);
    return new Uint8Array(await o.arrayBuffer());
  }
  async function it(t) {
    const e = O(t);
    if (window.__OSM_SQLITE_MAP_WORKERS__[e])
      return window.__OSM_SQLITE_MAP_WORKERS__[e];
    if (window.__OSM_SQLITE_FULL_DBS__[e])
      return window.__OSM_SQLITE_FULL_DBS__[e];
    const o = await nt(),
      n = z(e);
    let r = null;
    for (const t of n)
      try {
        const n = await rt(t),
          r = new o.Database(n),
          i = { __fullSqliteDb: r, __fullSqliteUrl: t };
        try {
          W(r, "SELECT name FROM sqlite_master LIMIT 1");
        } catch (t) {
          try {
            r.close();
          } catch (t) {}
          throw t;
        }
        ((window.__OSM_SQLITE_FULL_DBS__[e] = i),
          (window.__OSM_SQLITE_MAP_WORKERS__[e] = i),
          (window.__OSM_SQLITE_MAP_WORKER_URLS__[e] = t));
        try {
          const o = A();
          o.sqliteFiles[e] = Object.assign(o.sqliteFiles[e] || {}, {
            url: t,
            mode: "full-fetch",
            bytes: (n && n.byteLength) || 0,
            ok: !0,
          });
        } catch (t) {}
        return i;
      } catch (o) {
        r = o;
        try {
          const n = A(),
            r = n.sqliteFiles[e] || (n.sqliteFiles[e] = {});
          (r.failures || (r.failures = [])).push({
            url: t,
            message: String((o && o.message) || o),
          });
        } catch (t) {}
      }
    throw (
      E("sqlite full fetch " + e, r),
      r || new Error("full sqlite load failed: " + e)
    );
  }
  async function at(t) {
    const e = O(t);
    if (window.__OSM_SQLITE_MAP_WORKERS__[e])
      return window.__OSM_SQLITE_MAP_WORKERS__[e];
    let o = null,
      n = null;
    if (!window.__OSM_USE_HTTPVFS_SQLITE__)
      try {
        return await it(e);
      } catch (t) {
        o = t;
      }
    if (!window.__OSM_FORCE_FULLFETCH_SQLITE__)
      try {
        const t = await H(),
          o = z(e);
        for (const r of o)
          try {
            const o = await t.createDbWorker(
              [
                {
                  from: "inline",
                  config: {
                    serverMode: "full",
                    requestChunkSize: 4096,
                    url: r,
                  },
                },
              ],
              K(),
              b(x),
              1 / 0,
            );
            try {
              await V(o, "SELECT name FROM sqlite_master LIMIT 1");
            } catch (t) {
              throw t;
            }
            ((window.__OSM_SQLITE_MAP_WORKERS__[e] = o),
              (window.__OSM_SQLITE_MAP_WORKER_URLS__[e] = r));
            try {
              const t = A();
              t.sqliteFiles[e] = Object.assign(t.sqliteFiles[e] || {}, {
                url: r,
                mode: "httpvfs",
                ok: !0,
              });
            } catch (t) {}
            return o;
          } catch (t) {
            n = t;
            try {
              const o = A(),
                n = o.sqliteFiles[e] || (o.sqliteFiles[e] = {});
              (n.httpvfsFailures || (n.httpvfsFailures = [])).push({
                url: r,
                message: String((t && t.message) || t),
              });
            } catch (t) {}
          }
      } catch (t) {
        n = t;
      }
    if (window.__OSM_USE_HTTPVFS_SQLITE__)
      try {
        return await it(e);
      } catch (t) {
        o = o || t;
      }
    throw o || n || new Error("map sqlite load failed: " + e);
  }
  function st(t, e) {
    try {
      if (null == t || "" === t) return e;
      const o = JSON.parse(String(t));
      return null == o ? e : o;
    } catch (t) {
      return e;
    }
  }
  function ct(t) {
    if (!t || "object" != typeof t) return null;
    const o = st(
      t.raw_json || t.place_json || t.data_json || t.value_json || t.json || "",
      null,
    );
    if (o && "object" == typeof o) {
      const e = Object.assign({}, o),
        n = String(
          t.source_sqlite || t.source_file || t.__source_table || "",
        ).trim();
      return (n && !e.__src && (e.__src = n), e);
    }
    const n = {},
      r = st(t.branches_data || t.branches || "", null);
    for (const e in t) {
      if (!Object.prototype.hasOwnProperty.call(t, e)) continue;
      if (
        /^(rowid|id|item_index|source_sqlite|place_uid|raw_json|place_json|data_json|value_json|json|branches_data|branches)$/i.test(
          e,
        )
      )
        continue;
      const o = t[e];
      null != o && "" !== o && (n[e] = o);
    }
    return (
      Array.isArray(r) && (n.branches = r),
      t.__source_table && !n.__src && (n.__src = t.__source_table),
      Object.keys(n).length ? n : null
    );
  }
  function dt(t) {
    return '"' + String(t || "").replace(/"/g, '""') + '"';
  }
  function lt(t) {
    return String(t || "")
      .split(/[,|\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  async function pt(t, e) {
    const o = new Set((e || []).map((t) => String(t || "").toLowerCase())),
      n = [],
      r = await ot().catch(() => ({ byAddress: {}, byId: {} }));
    async function i(e) {
      try {
        return (await V(t, "PRAGMA table_info(" + dt(e) + ")")).map((t) =>
          String((t && t.name) || ""),
        );
      } catch (t) {
        return [];
      }
    }
    async function a(e) {
      let o = [];
      try {
        o = await V(t, "SELECT id,address,lat,lon FROM " + dt(e));
      } catch (t) {
        o = [];
      }
      const n = {};
      for (const t of o || []) {
        const e = String(t && null != t.id ? t.id : "").trim(),
          o = String((t && t.address) || "").trim();
        "OSM_MAP_DEFAULT_CENTER" !== o
          ? e && (n[e] = { address: o, lat: t && t.lat, lon: t && t.lon })
          : Y(t && t.lat, t && t.lon) &&
            !tt(r, "OSM_MAP_DEFAULT_CENTER") &&
            (window.OSM_MAP_DEFAULT_CENTER = [Number(t.lat), Number(t.lon)]);
      }
      return n;
    }
    function l(t) {
      if (null == t || "" === t) return [];
      const e = String(t).trim();
      if (!e) return [];
      if ("[" === e[0] || "{" === e[0])
        try {
          const t = JSON.parse(e);
          return (Array.isArray(t) ? t : [t])
            .map((t) =>
              "object" == typeof t && t
                ? String(t.address || t.addr || t.location || "").trim()
                : String(t || "").trim(),
            )
            .filter(Boolean);
        } catch (t) {}
      return e
        .split(/\r?\n|\|/)
        .map((t) => t.trim())
        .filter(Boolean);
    }
    function p(t, e) {
      const o = String(e || "").toLowerCase();
      for (const e of t) if (String(e || "").toLowerCase() === o) return e;
      return "";
    }
    async function m(e) {
      const o = await i(e),
        n = o.map((t) => t.toLowerCase()),
        r = (t) => {
          for (const e of t) {
            const t = String(e || "").toLowerCase();
            for (const e of o)
              if (String(e || "").toLowerCase() === t) return e;
          }
          return "";
        },
        a = (t, e) => {
          const o = r(t);
          return o ? dt(o) + " AS " + e : "'' AS " + e;
        };
      if (
        !n.includes("name") &&
        !n.includes("offer") &&
        !n.includes("offer_adv")
      )
        return [];
      const s = [
          a(["name", "title", "store", "store_name"], "name"),
          a(["cat", "category", "type"], "cat"),
          a(["offer", "description", "desc", "summary"], "offer"),
          a(
            ["offer_price", "offerPrice", "offer_price_text", "price"],
            "offer_price",
          ),
          a(["offer_adv", "offerAdv", "offerADV", "adv"], "offer_adv"),
          a(
            [
              "offer_advpicURL",
              "offer_adv_pic_url",
              "offerAdvPicURL",
              "offerADVPicURL",
              "pic",
              "image",
              "img",
            ],
            "offer_advpicURL",
          ),
          a(["phone", "tel", "telephone"], "phone"),
          a(["urls", "url", "link", "links"], "urls"),
        ],
        c = r(["GomajiIDURL", "gomajiidurl", "gomaji_url"]);
      c
        ? s.push(dt(c) + " AS GomajiIDURL")
        : r(["isGomaji", "isgomaji"]) &&
          s.push(dt(r(["isGomaji", "isgomaji"])) + " AS isGomaji");
      const d = r(["GeoCodeID", "geocodeid"]),
        l = r(["addressID", "addressId", "addr_id"]);
      r(["addresses"])
        ? s.push(dt(r(["addresses"])) + " AS addresses")
        : r(["address", "addr", "location"])
          ? s.push(dt(r(["address", "addr", "location"])) + " AS addresses")
          : d
            ? s.push(dt(d) + " AS GeoCodeID")
            : l && s.push(dt(l) + " AS addressID");
      try {
        return await V(t, "SELECT " + s.join(",") + " FROM " + dt(e));
      } catch (t) {
        return [];
      }
    }
    function u(t, e, o) {
      if (!(t = String(t || "").trim())) return null;
      const n = tt(r, t);
      return n
        ? { address: t, lat: n[0], lon: n[1] }
        : Y(e, o)
          ? { address: t, lat: Number(e), lon: Number(o) }
          : { address: t, lat: null, lon: null };
    }
    function f(t, e) {
      const o = et(r, t);
      if (o && o.address) return { address: o.address, lat: o.lat, lon: o.lon };
      const n = e && e[String(t || "").trim()];
      return n ? u(n.address, n.lat, n.lon) : null;
    }
    function g(t, e) {
      const o = [],
        n = {};
      function r(t) {
        if (!t || !t.address) return;
        const e = String(t.address);
        n[e] || ((n[e] = 1), o.push(t));
      }
      if (t && null != t.addresses) l(t.addresses).forEach((t) => r(u(t)));
      else if (t && null != t.address) l(t.address).forEach((t) => r(u(t)));
      else if (t && null != t.GeoCodeID)
        for (const o of lt(t.GeoCodeID)) r(f(o, e));
      else for (const o of lt(t && t.addressID)) r(f(o, e));
      return o;
    }
    function h(t, e, o) {
      for (const r of e || []) {
        const e = g(r, o),
          i = String(r.GomajiIDURL || "").trim(),
          a = c(i),
          l = i || Number(r.isGomaji || r.isgomaji || 0) ? 1 : 0,
          p = String(r.offer || "").trim(),
          m = String(r.offer_price || r.offerPrice || "").trim(),
          u = String(r.offer_adv || r.offerAdv || "").trim(),
          f = String(
            r.offer_advpicURL || r.offer_adv_pic_url || r.offerAdvPicURL || "",
          ).trim();
        n.push({
          __src: t + ".sqlite",
          name: String(r.name || ""),
          cat: String(r.cat || ""),
          offer: l ? s + (p ? "\n" + p : "") : p,
          offer_price: m,
          offer_adv: u,
          offer_advpicURL: f,
          phone: String(r.phone || ""),
          urls: d(String(r.urls || ""), a),
          GomajiIDURL: i,
          isGomaji: l,
          branches: e,
        });
      }
    }
    const b = (t) => {
        const e = String(t || "").match(/map(\d+)/i);
        return e ? Number(e[1]) : Number.MAX_SAFE_INTEGER;
      },
      _ = (t) => (
        (t = String(t || "").toLowerCase()),
        (e || []).find((e) => String(e || "").toLowerCase() === t) || ""
      ),
      w = (e || [])
        .filter((t) => /^map\d+$/i.test(String(t || "")))
        .sort((t, e) => b(t) - b(e) || String(t).localeCompare(String(e)));
    if (w.length) {
      const t = _("address"),
        e = t ? await a(t) : {};
      for (const t of w) h(t, await m(t), e);
    }
    const v = (e || [])
      .filter((t) => /^map\d+_places$/i.test(String(t || "")))
      .sort((t, e) => b(t) - b(e) || String(t).localeCompare(String(e)));
    for (const t of v) {
      const e = String(t).replace(/_places$/i, ""),
        o = _(e + "_address"),
        n = o ? await a(o) : {};
      h(e, await m(t), n);
    }
    return n;
  }
  async function mt(t) {
    const e = O(t),
      o = await at(e);
    let n = [];
    const i = (
        (await V(
          o,
          "SELECT name,type FROM sqlite_master WHERE type IN ('table','view')",
        ).catch(() => [])) || []
      )
        .map((t) => String((t && t.name) || ""))
        .filter(Boolean),
      a = await pt(o, i).catch((t) => (E("compact map tables " + e, t), []));
    try {
      const t = A();
      t.sqliteFiles[e] = Object.assign(t.sqliteFiles[e] || {}, {
        tables: i.slice(),
        compactRows: (a && a.length) || 0,
      });
    } catch (t) {}
    if (a && a.length) return ((window.PLACES = a), !0);
    let s = i.filter((t) =>
      /^(map\d+_places|places|places_all|map_places|place_index|data)$/i.test(
        t,
      ),
    );
    s.length || (s = ["places", "map_places", "place_index", "data"]);
    const c = {};
    s = s.filter((t) => {
      const e = String(t).toLowerCase();
      return !c[e] && ((c[e] = 1), !0);
    });
    for (const t of s)
      try {
        let e = [];
        const r = await V(o, "PRAGMA table_info(" + dt(t) + ")").catch(
            () => [],
          ),
          a = (r || [])
            .map((t) => String((t && t.name) || ""))
            .map((t) => t.toLowerCase()),
          s = a.includes("item_index") ? " ORDER BY item_index" : "",
          c = "'" + String(t).replace(/'/g, "''") + "'";
        ((e =
          (a.includes("raw_json") ||
            a.includes("place_json") ||
            a.includes("data_json") ||
            a.includes("json"),
          await V(
            o,
            "SELECT *, " + c + " AS __source_table FROM " + dt(t) + s,
          ))),
          Array.isArray(e) && e.length && (n = n.concat(e)));
      } catch (t) {}
    const d = [];
    for (const t of n || []) {
      const e = ct(t);
      e && "object" == typeof e && d.push(e);
    }
    try {
      const t = A();
      t.sqliteFiles[e] = Object.assign(t.sqliteFiles[e] || {}, {
        fallbackRows: d.length,
      });
    } catch (t) {}
    return ((window.PLACES = d), !0);
  }
  async function ft(t) {
    if (!(t = String(t || "").trim())) return !1;
    if (k(t))
      try {
        return await mt(t);
      } catch (e) {
        try {
          console.warn("[osm] sqlite map load failed", t, e);
        } catch (t) {}
        return !1;
      }
    if (!(/^(https?:)?\/\//i.test(t) || /^data:/i.test(t))) {
      try {
        return (await _(t), !0);
      } catch (t) {}
      try {
        if ("function" == typeof window.getSettingScriptUrl) {
          const e = window.getSettingScriptUrl(t);
          if (e) return (await _(e), !0);
        }
      } catch (t) {}
      return !1;
    }
    try {
      return (await _(t), !0);
    } catch (t) {}
    return !1;
  }
  async function gt() {
    try {
      window.__CCH_SETTINGS_READY__ &&
        (await Promise.resolve(window.__CCH_SETTINGS_READY__).catch(() => {}));
    } catch (t) {}
  }
  async function ht() {
    if (window.__OSM_PLACES_READY) return;
    await gt();
    const t = B(),
      e = q();
    if (
      (!t.length && e && t.push(k(e) ? O(e) : e),
      t.length || t.push("map.sqlite"),
      !t.length)
    )
      return void (
        Array.isArray(window.PLACES) &&
        window.PLACES.length &&
        ((window.OSM_MAP_DATASETS = window.OSM_MAP_DATASETS || {
          inline: window.PLACES.slice(),
        }),
        (window.OSM_MAP_DATASET_ORDER = window.OSM_MAP_DATASET_ORDER || [
          "inline",
        ]),
        (window.__OSM_PLACES_READY = !0))
      );
    const o = {},
      n = A();
    n.placeFiles = t.slice();
    for (const e of t) {
      try {
        window.PLACES = null;
      } catch (t) {}
      (await ft(e)) && Array.isArray(window.PLACES)
        ? (o[e] = window.PLACES.slice())
        : (o[e] = []);
      try {
        (n.datasets || (n.datasets = {}))[e] = o[e].length;
      } catch (t) {}
    }
    const r = [];
    for (const e of t) {
      const t = o[e] || [];
      for (const o of t) {
        if (!o || "object" != typeof o) continue;
        const t = Object.assign({}, o);
        (t.__src || (t.__src = e), r.push(t));
      }
    }
    ((window.OSM_MAP_DATASETS = o),
      (window.OSM_MAP_DATASET_ORDER = t.slice()),
      (window.PLACES = r));
    try {
      A().placesMerged = r.length;
    } catch (t) {}
    r.length
      ? (window.__OSM_PLACES_READY = !0)
      : ((window.__OSM_PLACES_READY = !1),
        E(
          "places empty",
          new Error("no OSM places loaded from " + t.join(",")),
        ));
  }
  function bt() {
    const t = window.OSM_MAP_DEFAULT_CENTER;
    return Array.isArray(t) &&
      2 === t.length &&
      isFinite(t[0]) &&
      isFinite(t[1])
      ? [Number(t[0]), Number(t[1])]
      : [24.071252388959756, 120.5445053776353];
  }
  function _t() {
    const t = Number(window.OSM_MAP_DEFAULT_ZOOM);
    return isFinite(t) && t > 0 ? t : 16;
  }
  function wt() {
    const t = new Date();
    return 1e4 * t.getFullYear() + 100 * (t.getMonth() + 1) + t.getDate();
  }
  function vt(t) {
    const e = String(t ?? "").replace(/[^\d]/g, "");
    if (8 !== e.length) return 0;
    const o = Number(e);
    return isFinite(o) ? o : 0;
  }
  function yt(t) {
    const e = String(t || "").match(
      /(?:到期|有效(?:期限)?|截止)\s*[:：]?\s*(\d{8})/,
    );
    return e ? vt(e[1]) : 0;
  }
  function xt(t) {
    return (
      vt((t && (t.expire ?? t.expiry ?? t.exp ?? t.end ?? t.until)) || "") ||
      yt((t && t.offer) || "")
    );
  }
  function St(t, e) {
    const o = xt(t);
    return !!(o && e > o);
  }
  function Lt(t) {
    return String(t || "").replace(/<[^>]*>/g, "");
  }
  function At(t, e) {
    let o = Lt(t).replace(/\s+/g, " ").trim();
    return (
      (e = Math.max(8, Number(e || 0) || 0)),
      o ? (o.length > e ? o.slice(0, e - 1) + "…" : o) : ""
    );
  }
  function Et(t) {
    if (!(t = String(t || "").trim())) return null;
    try {
      const e = Array.isArray(window.feedArray) ? window.feedArray : [];
      for (const o of e) if (String((o && o.ts) || "").trim() === t) return o;
    } catch (t) {}
    return null;
  }
  function Mt(t, e) {
    const o = String((e && e.title) || "").trim();
    if (o) return o;
    return String((e && e.user) || (t && t.user) || "").trim() || "貼文";
  }
  function Ot(t) {
    return At(String((t && t.caption) || (t && t.text) || "").trim(), 90);
  }
  function Rt(t) {
    return (t = String(t ?? "")
      .trim()
      .toLowerCase())
      ? (t = (t = t.replace(/[\u3000\s]+/g, "")).replace(
          /[()（）\[\]【】{}「」『』"'“”‘’，、;；:：.。!?！？\-—_]+/g,
          "",
        ))
      : "";
  }
  function Tt(t, e, o, n) {
    n = !1 !== n;
    const r = Array.isArray(t) ? t : [],
      i = Rt(e),
      a = Rt(o);
    if (!r.length) return [];
    const s = [],
      c = [];
    for (const t of r) {
      if (!t) continue;
      const e = Rt(t.gName || t.name || ""),
        o = Rt(t.gAddr || t.address || "");
      if (!e && !o) {
        s.push(t);
        continue;
      }
      let n = !1;
      (i && e
        ? i === e && (n = !a || !o || a === o)
        : (n = !(!a || !o || a !== o)),
        n && c.push(t));
    }
    return c.length ? c : n && s.length ? s.slice() : [];
  }
  function jt(e) {
    let o;
    try {
      o = document.createElement("div");
    } catch (o) {
      return { body: t(String(e || "")), imgs: [] };
    }
    o.innerHTML = String(e || "");
    const n = Array.from(o.querySelectorAll("img"))
      .map((t) => (t.getAttribute("src") || "").trim())
      .filter(Boolean);
    try {
      o.querySelectorAll("img").forEach((t) => t.remove());
    } catch (t) {}
    return { body: o.innerHTML || "", imgs: n };
  }
  function Ct() {
    let t = document.getElementById("osmFeedModal");
    if (t) return t;
    ((t = document.createElement("div")),
      (t.id = "osmFeedModal"),
      (t.className = "osm-feed-modal"),
      (t.innerHTML =
        '<div class="osm-feed-modal-card" role="dialog" aria-modal="true"><div class="osm-feed-modal-top"><div class="osm-feed-modal-topbar"><div class="osm-feed-modal-brand"><i class="uil uil-location-point"></i><span>貼文</span></div><button type="button" class="osm-feed-modal-close" aria-label="Close">×</button></div></div><div class="osm-feed-modal-bodywrap"></div></div>'));
    const e = () => {
      try {
        t.classList.remove("open");
      } catch (t) {}
      try {
        document.body.classList.remove("osm-feed-modal-open");
      } catch (t) {}
      try {
        t._groupCtx = null;
      } catch (t) {}
    };
    t.addEventListener("click", (o) => {
      o.target === t && e();
    });
    const o = t.querySelector(".osm-feed-modal-close");
    return (
      o && o.addEventListener("click", e),
      document.addEventListener("keydown", (o) => {
        "Escape" === o.key && t.classList.contains("open") && e();
      }),
      (t.__close = e),
      document.body.appendChild(t),
      t
    );
  }
  function Pt(t) {
    return (
      ((t = String(t || "").trim()) &&
        (t = t
          .replace(/^uil\s+/, "")
          .replace(/[\s]+/g, "-")
          .replace(/[^a-z0-9\-]/gi, ""))) ||
      "uil-location-point"
    );
  }
  function Dt(e, o) {
    if (!e) return;
    const n = e.querySelector(".osm-feed-modal-brand");
    if (!n) return;
    const r = Pt((o = o || {}).icon || "uil-location-point"),
      i = String(o.name || "").trim(),
      a = String(o.address || "").trim(),
      s = String(o.label || "貼文").trim() || "貼文";
    n.innerHTML =
      i || a
        ? `<i class="uil ${r}"></i><div class="osm-feed-modal-brandtext"><div class="osm-popup-title">${t(i || s)}</div>${a ? `<div class="osm-popup-meta"><b>地址</b> ${t(a)}</div>` : ""}</div>`
        : `<i class="uil ${r}"></i><span>${t(s)}</span>`;
  }
  function It(t) {
    const e = String((t && t.ts) || "").trim(),
      o = Number(e);
    if (isFinite(o)) return o;
    const n = e.match(/\d{8,}/);
    return n ? Number(n[0]) : 0;
  }
  function Ft(t) {
    const e = Array.isArray(t) ? t.slice() : [];
    return (
      e.sort((t, e) => {
        const o = It(t),
          n = It(e);
        if (o && n && o !== n) return n - o;
        const r = String((t && t.ts) || "");
        return String((e && e.ts) || "").localeCompare(r);
      }),
      e
    );
  }
  function $t(e) {
    const o = e && e._groupCtx;
    if (!o) return;
    const n = e.querySelector(".osm-feed-modal-bodywrap");
    if (!n) return;
    const r = Ft(o.metas || []);
    Dt(e, {
      icon: "uil-location-point",
      name: String((o.place && o.place.name) || "").trim(),
      address: String((o.place && o.place.address) || "").trim(),
      label: "貼文",
    });
    const s = r
        .slice(0, 80)
        .map((e) => {
          const o = String((e && e.ts) || "").trim();
          if (!o) return "";
          const n = Et(o),
            r = Mt(e, n),
            i = n ? Ot(n) : "",
            c = [
              String((n && n.user) || (e && e.user) || "").trim(),
              String((n && n.datetime) || "").trim(),
            ]
              .filter(Boolean)
              .join(" • "),
            d = String((n && n.avatar) || (e && e.avatar) || "").trim(),
            l = d
              ? `<button type="button" class="osm-popup-avatar" data-ts="${t(o)}"><img src="${t(d)}" alt=""></button>`
              : `<button type="button" class="osm-popup-avatar" data-ts="${t(o)}"></button>`;
          return `<div class="osm-feed-row" data-ts="${t(o)}">${l}<div class="osm-feed-text"><div class="osm-feed-title">${t(r)}</div>${c ? `<div class="osm-feed-sub">${t(c)}</div>` : ""}${i ? `<div class="osm-feed-sn">${t(i)}</div>` : ""}</div></div>`;
        })
        .filter(Boolean)
        .join(""),
      c = s
        ? `<div class="osm-popup osm-feed-block"><div class="osm-feed-list">${s}</div></div>`
        : "";
    ((n.innerHTML = `<div class="osm-popup-stack">${c || '<div class="osm-popup"><div class="osm-popup-meta">沒有貼文</div></div>'}</div>`),
      (n.onclick = (t) => {
        const e = t.target.closest(".osm-feed-row");
        if (e && e.dataset.ts)
          return (
            t.preventDefault(),
            t.stopPropagation(),
            void Ut(e.dataset.ts || "")
          );
        const o = t.target.closest(".osm-popup-avatar");
        return o && o.dataset.ts
          ? (t.preventDefault(),
            t.stopPropagation(),
            void Ut(o.dataset.ts || ""))
          : void 0;
      }));
  }
  function Nt(t, e, o) {
    const n = Ft(t || []);
    if (!n.length) return void u("沒有貼文");
    const r = Ct();
    ((r._groupCtx = {
      metas: n,
      place: { name: String(e || "").trim(), address: String(o || "").trim() },
    }),
      $t(r));
    try {
      r.classList.add("open");
    } catch (t) {}
    try {
      document.body.classList.add("osm-feed-modal-open");
    } catch (t) {}
  }
  function Ut(o) {
    if (!(o = String(o || "").trim())) return;
    const n = Et(o);
    if (!n) return void u("找不到貼文");
    const r = Ct(),
      i = r.querySelector(".osm-feed-modal-bodywrap");
    if (!i) return;
    const a = t(String(n.user || "")),
      s = t(String(n.avatar || "")),
      c = t(String(n.datetime || n.date || "")),
      d = t(
        String(n.title || "")
          .replace(/\s*•\s*$/, "")
          .trim(),
      ),
      l = t(String((n.geo && n.geo.name) || "")),
      p = t(String((n.geo && n.geo.address) || "")),
      m = r && r._groupCtx,
      f = m && m.place ? String(m.place.name || "").trim() : "",
      g = m && m.place ? String(m.place.address || "").trim() : "",
      h = String((n.geo && n.geo.name) || "").trim() || f,
      b = String((n.geo && n.geo.address) || "").trim() || g;
    Dt(
      r,
      h || b
        ? { icon: "uil-location-point", name: h, address: b, label: "貼文" }
        : {
            icon: "uil-file-alt",
            label: String(n.user || "").trim() || "貼文",
          },
    );
    const _ = [c, [l, p].filter(Boolean).join(" ")].filter(Boolean).join(" • "),
      v = jt(String(n.caption || n.text || "")),
      y = v.body
        ? e(v.body)
          ? v.body
          : t(v.body).replace(/\r?\n/g, "<br>")
        : "";
    let x = Array.isArray(v.imgs) ? v.imgs.slice() : [];
    if (!x.length) {
      let t = [];
      (Array.isArray(n.imgs)
        ? (t = n.imgs)
        : Array.isArray(n.images)
          ? (t = n.images)
          : Array.isArray(n.img)
            ? (t = n.img)
            : "string" == typeof n.img && (t = [n.img]),
        (x = t.map((t) => String(t || "").trim()).filter(Boolean)));
    }
    const S = x
        .slice(0, 9)
        .map(
          (e) =>
            `<button type="button" class="osm-feed-modal-imgbtn" data-src="${t(e)}"><img src="${t(e)}" alt=""></button>`,
        )
        .join(""),
      L = S ? `<div class="osm-feed-modal-imgs">${S}</div>` : "",
      A = `<div class="osm-feed-modal-head"><div class="osm-feed-modal-user">${s ? `<img src="${s}" alt="">` : '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">'}<div style="min-width:0"><div class="osm-feed-modal-user-name">${a || "貼文"}</div>${_ ? `<div class="osm-feed-modal-user-sub">${_}</div>` : ""}</div></div></div>`,
      E = d ? `<div class="osm-feed-modal-title">${d}</div>` : "",
      M = y
        ? `<div class="osm-feed-modal-caption"><div class="caption">${y}</div></div>`
        : "",
      k = !!(
        r &&
        r._groupCtx &&
        Array.isArray(r._groupCtx.metas) &&
        r._groupCtx.metas.length
      )
        ? '<div class="osm-feed-modal-actions"><button type="button" class="osm-feed-back">← 返回列表</button></div>'
        : "";
    ((i.innerHTML = k + A + E + M + L),
      (i.onclick = (t) => {
        if (t.target.closest(".osm-feed-back") && r && r._groupCtx)
          return (t.preventDefault(), t.stopPropagation(), void $t(r));
        const o = t.target.closest(".osm-feed-modal-imgbtn");
        if (o) {
          (t.preventDefault(), t.stopPropagation());
          const e = String(o.dataset.src || "").trim();
          return void (
            e &&
            ("function" == typeof window.openImageLightbox
              ? window.openImageLightbox(e, "")
              : window.open(e, "_blank", "noopener"))
          );
        }
      }));
    try {
      r.classList.add("open");
    } catch (t) {}
    try {
      document.body.classList.add("osm-feed-modal-open");
    } catch (t) {}
  }
  function createPopupIconLink(href, iconClass, label, openInNewTab = true) {
    const safeHref = String(href || "").trim();
    if (!safeHref) return "";

    const safeLabel = String(label || "開啟連結").trim() || "開啟連結";
    const targetAttributes = openInNewTab
      ? ' target="_blank" rel="noopener"'
      : "";

    return `<a class="icon-btn osm-popup-icon-btn" href="${t(safeHref)}"${targetAttributes} title="${t(safeLabel)}" aria-label="${t(safeLabel)}"><i class="uil ${t(iconClass || "uil-external-link-alt")}" aria-hidden="true"></i></a>`;
  }

  function qt(t) {
    if (Array.isArray(t))
      return t.map((t) => String(t || "").trim()).filter(Boolean);
    const e = String(t || "").trim();
    return e
      ? e
          .split(/[\n|]+/)
          .map((t) => String(t || "").trim())
          .filter(Boolean)
          .filter((t, e, o) => o.indexOf(t) === e)
      : [];
  }
  function Bt(e) {
    const o = qt(e && e.urls);
    return o.length
      ? o
          .map((e, n) => {
            const r = o.length > 1 ? `開啟參考資料 ${n + 1}` : "開啟參考資料";
            return createPopupIconLink(e, "uil-link", r);
          })
          .join("")
      : "";
  }
  function osmListRefLinksHtml(e) {
    const o = qt(e && e.urls);
    return o.length
      ? o
          .map((e, n) => {
            const r = o.length > 1 ? "參考資料" + (n + 1) : "參考資料";
            return `<a class="osm-list-icon-btn" href="${t(e)}" target="_blank" rel="noopener" title="${t(r)}" aria-label="${t(r)}"><i class="uil uil-link"></i></a>`;
          })
          .join("")
      : "";
  }
  function zt(e, o) {
    const i = t(e.name || ""),
      a = t(e.cat || ""),
      s0 = String(e.address || "").trim(),
      x = "OSM_MAP_DEFAULT_CENTER" === s0,
      s = t(x ? "線上優惠／未提供實體地址" : s0),
      c = String(e.phone || "").trim(),
      d = n(e.offer || ""),
      l = Bt(e),
      m = x ? "" : p(e.name || "", s0),
      u = c
        ? createPopupIconLink(`tel:${c}`, "uil-phone", `撥打 ${c}`, false)
        : "",
      f = m ? createPopupIconLink(m, "uil-location-arrow", "開啟導航") : "",
      h = [
        a ? `<div class="osm-popup-meta"><b>分類</b> ${a}</div>` : "",
        s ? `<div class="osm-popup-meta"><b>地址</b> ${s}</div>` : "",
        c ? `<div class="osm-popup-meta"><b>電話</b> ${t(c)}</div>` : "",
      ]
        .filter(Boolean)
        .join(""),
      b =
        d || l
          ? `<div class="osm-popup-offer"><div class="caption">${[d, l].filter(Boolean).join(" ")}</div></div>`
          : "",
      _ = `<div class="osm-popup-actions"><div class="caption">${[f, u].filter(Boolean).join("")}</div><div class="osm-popup-feeds"></div></div>`,
      w = ["osm-popup"],
      v = Math.max(0, Number(o || 0));
    v && w.push("osm-popup" + v);
    const y = String(e.__src || "")
      .trim()
      .toLowerCase()
      .replace(/\.(js|json|sqlite|db|sqlite3)$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return (
      y && w.push("osm-src-" + y),
      `<div class="${w.join(" ")}" data-name="${i}" data-address="${x ? "" : s}"><div class="osm-popup-title">${i}</div>${h}${b}${_}</div>`
    );
  }
  function Gt(t) {
    const e = Array.isArray(t) ? t.filter(Boolean) : [];
    if (!e.length) return "";
    const r = e.map((t, e) => zt(t, e + 1)).filter(Boolean);
    return r.length <= 1
      ? r[0] || ""
      : `<div class="osm-popup-stack">${r.join("")}</div>`;
  }
  function Qt() {
    const t = wt();
    return l(Array.isArray(window.PLACES) ? window.PLACES : []).filter(
      (e) => !St(e, t),
    );
  }
  function Ht(t) {
    if (!t) return "";
    const e = [],
      o = String(t.offer_adv || t.offerAdv || "").trim(),
      n = String(t.offer || "").trim(),
      r = String(
        t.offer_price || t.offerPrice || t.offer_price_text || "",
      ).trim();
    if (
      (o && e.push(o),
      n && n !== o && e.push(n),
      r && r !== o && r !== n && e.push(r),
      (!t.isGomaji && !String(t.GomajiIDURL || "").trim()) ||
        /Gomaji|6DA78|\$120/.test(e.join("\n")) ||
        e.push(s),
      !e.length)
    ) {
      const o = [t.name, t.cat, t.address]
        .map((t) => String(t || "").trim())
        .filter(Boolean)
        .join(" · ");
      o && e.push(o);
    }
    return e.join("\n").trim();
  }
  function Kt() {
    return Qt().filter((t) => Ht(t));
  }
  function Wt(t, e, o, n) {
    if (
      ((t = Number(t)),
      (e = Number(e)),
      (o = Number(o)),
      (n = Number(n)),
      !(isFinite(t) && isFinite(e) && isFinite(o) && isFinite(n)))
    )
      return 1 / 0;
    const r = 6371,
      i = (t) => (t * Math.PI) / 180,
      a = i(o - t),
      s = i(n - e),
      c =
        Math.sin(a / 2) * Math.sin(a / 2) +
        Math.cos(i(t)) * Math.cos(i(o)) * Math.sin(s / 2) * Math.sin(s / 2);
    return 2 * r * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  }
  function osmRememberCurrentCoords(t, e, o) {
    ((t = Number(t)), (e = Number(e)), (o = Number(o)));
    if (isFinite(t) && isFinite(e)) {
      try {
        window.__OSM_CURRENT_COORDS__ = {
          lat: t,
          lon: e,
          accuracy: isFinite(o) ? o : null,
          ts: Date.now(),
        };
      } catch (t) {}
    }
  }
  function osmCurrentCoords() {
    try {
      const t = window.__OSM_CURRENT_COORDS__ || {},
        e = Number(t.lat),
        o = Number(t.lon);
      return isFinite(e) && isFinite(o) ? [e, o] : null;
    } catch (t) {
      return null;
    }
  }
  function osmListOrigin(t) {
    if (
      Array.isArray(t) &&
      t.length >= 2 &&
      isFinite(Number(t[0])) &&
      isFinite(Number(t[1]))
    )
      return [Number(t[0]), Number(t[1])];
    const e = osmCurrentCoords();
    return e || bt();
  }
  function osmLocateForList() {
    return new Promise((t) => {
      try {
        if (!navigator.geolocation) return t(null);
        navigator.geolocation.getCurrentPosition(
          (e) => {
            const o = Number(e && e.coords && e.coords.latitude),
              n = Number(e && e.coords && e.coords.longitude),
              r = Number(e && e.coords && e.coords.accuracy);
            return isFinite(o) && isFinite(n)
              ? (osmRememberCurrentCoords(o, n, r), t([o, n]))
              : t(null);
          },
          () => t(null),
          { enableHighAccuracy: !0, timeout: 3500, maximumAge: 6e4 },
        );
      } catch (e) {
        t(null);
      }
    });
  }
  function Vt(t) {
    return t && (t.isGomaji || String(t.GomajiIDURL || "").trim())
      ? s
      : At(
          String((t && t.offer) || "").trim() ||
            String((t && t.offer_adv) || "").trim(),
          160,
        );
  }
  function Jt(origin) {
    const t = osmListOrigin(origin),
      e = Qt()
        .filter(
          (t) =>
            String(t.offer || "").trim() ||
            String(t.offer_adv || "").trim() ||
            t.isGomaji ||
            String(t.GomajiIDURL || "").trim(),
        )
        .map((e) => {
          const o = Wt(t[0], t[1], e.lat, e.lon);
          return Object.assign({}, e, { __distKm: o });
        });
    return (
      e.sort((t, e) => {
        const o = isFinite(t.__distKm) ? t.__distKm : 1e12,
          n = isFinite(e.__distKm) ? e.__distKm : 1e12;
        return o !== n
          ? o - n
          : String(t.name || "").localeCompare(String(e.name || ""), "zh-Hant");
      }),
      e
    );
  }
  function Yt() {
    let t = document.getElementById("osmListModal");
    if (t) return t;
    ((t = document.createElement("div")),
      (t.id = "osmListModal"),
      (t.className = "osm-list-modal"),
      (t.innerHTML =
        '<div class="osm-list-card" role="dialog" aria-modal="true"><div class="osm-list-top"><div class="osm-list-title"><i class="uil uil-list-ul"></i><span>優惠清單</span></div><button type="button" class="osm-list-close" aria-label="Close">×</button></div><div class="osm-list-body"></div></div>'));
    const e = () => {
      try {
        (t.classList.remove("open"),
          document.body.classList.remove("osm-list-modal-open"));
      } catch (t) {}
    };
    t.addEventListener("click", (o) => {
      o.target === t && e();
    });
    const o = t.querySelector(".osm-list-close");
    return (
      o && o.addEventListener("click", e),
      document.addEventListener("keydown", (o) => {
        "Escape" === o.key && t.classList.contains("open") && e();
      }),
      (t.__close = e),
      document.body.appendChild(t),
      t
    );
  }
  function Zt(origin) {
    const e = Yt(),
      o = e.querySelector(".osm-list-body"),
      n = Jt(origin),
      r0 = Array.isArray(origin) && origin.length >= 2;
    if (((e._osmRows = n), !o)) return;
    const r = n
      .map((e, o) => {
        const n = isFinite(e.__distKm)
            ? (e.__distKm < 10
                ? e.__distKm.toFixed(1)
                : Math.round(e.__distKm).toString()) + " km"
            : "",
          r = osmListRefLinksHtml(e) || "",
          i = Y(e.lat, e.lon)
            ? `<button class="osm-list-icon-btn" type="button" data-osm-list-map="${o}" title="地圖" aria-label="地圖"><i class="uil uil-location-point"></i></button>`
            : "";
        return `<tr><td>${t(n)}</td><td><div class="osm-list-name">${t(e.name || "")}</div></td><td>${t(e.cat || "")}</td><td class="osm-list-offer">${t(Vt(e))}</td><td>${r}</td><td>${i}</td></tr>`;
      })
      .join("");
    ((o.innerHTML = r
      ? `<table class="osm-list-table"><thead><tr><th>距離</th><th>名稱</th><th>類別</th><th>優惠</th><th>參考</th><th>地圖</th></tr></thead><tbody>${r}</tbody></table>`
      : '<div class="osm-popup"><div class="osm-popup-meta">沒有優惠資料</div></div>'),
      (o.onclick = (t) => {
        const o = t.target.closest("[data-osm-list-map]");
        if (!o) return;
        (t.preventDefault(), t.stopPropagation());
        const n = e._osmRows && e._osmRows[Number(o.dataset.osmListMap)];
        if (n) {
          try {
            e.__close && e.__close();
          } catch (t) {}
          Xt(n, { fullscreen: !0, openPopup: !0 });
        }
      }));
    try {
      (e.classList.add("open"),
        document.body.classList.add("osm-list-modal-open"));
    } catch (t) {}
    if (!r0 && !osmCurrentCoords())
      osmLocateForList().then((t) => {
        t && Zt(t);
      });
  }
  function Xt(t, e) {
    e = e || {};
    const o = {
      lat: Number(t && t.lat),
      lon: Number(t && t.lon),
      name: String((t && t.name) || ""),
      address: String((t && t.address) || ""),
    };
    if (!isFinite(o.lat) || !isFinite(o.lon)) return void u("沒有座標");
    const n = document.getElementById("app_map");
    if (n && n._osmMap)
      try {
        window.osmFocusPlace && window.osmFocusPlace(o, e);
      } catch (t) {}
    else
      Promise.resolve(
        window.initOsmDiscountMap && window.initOsmDiscountMap(),
      ).then(() =>
        setTimeout(() => {
          try {
            window.osmFocusPlace && window.osmFocusPlace(o, e);
          } catch (t) {}
        }, 80),
      );
  }
  async function te(e, o) {
    const n = document.getElementById("app_map"),
      r = document.getElementById("osmMap");
    if (!n || !r) return;
    if (n._osmMap) return;
    try {
      r.innerHTML = "";
    } catch (t) {}
    const i = e.map(r, { zoomControl: !0, attributionControl: !0 });
    n._osmMap = i;
    const s = (function () {
      const t = [];
      try {
        const e = String(
            window.OSM_TILE_URL_TEMPLATE || window.OSM_TILE_URL || "",
          ).trim(),
          o = String(window.OSM_TILE_ATTRIBUTION || "").trim();
        e && t.push({ url: e, attr: o || "" });
      } catch (t) {}
      return (
        t.push(
          {
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            subdomains: "abc",
            attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
          {
            url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
            subdomains: "abc",
            attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
          {
            url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
            subdomains: "abc",
            attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
          {
            url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            subdomains: "abcd",
            opts: { detectRetina: !0 },
            attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
          {
            url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            subdomains: "abcd",
            opts: { detectRetina: !0 },
            attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        ),
        t
      );
    })();
    function c(t) {
      const o = s[t] || s[0],
        n = Object.assign(
          { maxZoom: 19, attribution: o.attr || "" },
          o.opts || {},
        );
      return (
        o.subdomains && (n.subdomains = o.subdomains),
        e.tileLayer(o.url, n)
      );
    }
    function d(t) {
      const e = t && t.subdomains ? String(t.subdomains) : "a",
        o = e ? e[0] : "a";
      let n = String((t && t.url) || "");
      return (
        (n = n
          .replace("{s}", o)
          .replace("{z}", "0")
          .replace("{x}", "0")
          .replace("{y}", "0")
          .replace("{r}", "")),
        n ? n + (n.includes("?") ? "&" : "?") + "osm_probe=" + Date.now() : ""
      );
    }
    function p(t, e) {
      return (
        (e = Number(e) || 2200),
        new Promise((o) => {
          let n = !1;
          const r = new Image(),
            i = (t) => {
              if (!n) {
                n = !0;
                try {
                  clearTimeout(a);
                } catch (t) {}
                ((r.onload = r.onerror = null), o(!!t));
              }
            },
            a = setTimeout(() => i(!1), e);
          ((r.onload = () => i(!0)), (r.onerror = () => i(!1)));
          try {
            r.decoding = "async";
          } catch (t) {}
          const s = d(t);
          s ? (r.src = s) : i(!1);
        })
      );
    }
    async function m() {
      try {
        const t = await Promise.all(s.map((t) => p(t, 2200).catch(() => !1)));
        for (let e = 0; e < t.length; e++) if (t[e]) return e;
      } catch (t) {}
      return 0;
    }
    let f = await m(),
      g = !1;
    const h = () => {
      g = !0;
    };
    function b() {
      setTimeout(() => {
        g || f >= s.length - 1 || x();
      }, 3e3);
    }
    let _ = c(f);
    (_.addTo(i), _.on("tileload", h), b());
    try {
      r.getBoundingClientRect &&
        r.getBoundingClientRect().height < 140 &&
        (r.style.height = "60vh");
    } catch (t) {}
    try {
      i.setView(bt(), _t(), { animate: !1 });
    } catch (t) {}
    let w = 0,
      v = 0;
    const y = () => {
      const t = Date.now();
      ((!v || t - v > 8e3) && ((v = t), (w = 0)), w++, w >= 8 && x());
    };
    function x() {
      if (!(f >= s.length - 1)) {
        f++;
        try {
          i.removeLayer(_);
        } catch (t) {}
        ((_ = c(f)), _.addTo(i), (g = !1), _.on("tileload", h), b());
        try {
          r.getBoundingClientRect &&
            r.getBoundingClientRect().height < 140 &&
            (r.style.height = "60vh");
        } catch (t) {}
        try {
          i.setView(bt(), _t(), { animate: !1 });
        } catch (t) {}
        ((w = 0), (v = 0), _.on("tileerror", y));
      }
    }
    _.on("tileerror", y);
    const S = e.featureGroup().addTo(i),
      L = e.featureGroup().addTo(i);
    let M = null,
      O = null;
    function k() {
      const t = document.getElementById("osmMapLocateBtn");
      if (navigator.geolocation) {
        try {
          t && ((t.disabled = !0), t.classList.add("is-loading"));
        } catch (t) {}
        navigator.geolocation.getCurrentPosition(
          (o) => {
            try {
              t && ((t.disabled = !1), t.classList.remove("is-loading"));
            } catch (t) {}
            const n = Number(o && o.coords && o.coords.latitude),
              r = Number(o && o.coords && o.coords.longitude),
              a = Number(o && o.coords && o.coords.accuracy);
            if (!isFinite(n) || !isFinite(r)) return void u("定位失敗");
            osmRememberCurrentCoords(n, r, a);
            try {
              M
                ? M.setLatLng([n, r])
                : (M = e
                    .circleMarker([n, r], {
                      radius: 8,
                      weight: 2,
                      fillOpacity: 0.25,
                    })
                    .addTo(L));
            } catch (t) {}
            if (isFinite(a) && a > 0)
              try {
                O
                  ? O.setLatLng([n, r]).setRadius(a)
                  : (O = e
                      .circle([n, r], {
                        radius: a,
                        weight: 1,
                        fillOpacity: 0.05,
                      })
                      .addTo(L));
              } catch (t) {}
            const s = Math.min(19, Math.max(17, i.getZoom() || 17));
            try {
              i.setView([n, r], s, { animate: !0 });
            } catch (t) {}
          },
          (e) => {
            try {
              t && ((t.disabled = !1), t.classList.remove("is-loading"));
            } catch (t) {}
            u("定位失敗");
          },
          { enableHighAccuracy: !0, timeout: 8e3, maximumAge: 3e4 },
        );
      } else {
        u("瀏覽器不支援定位");
        try {
          i.setView(bt(), _t(), { animate: !1 });
        } catch (t) {}
      }
    }
    const R = document.getElementById("osmMapLocateBtn");
    R &&
      "1" !== R.dataset.osmBound &&
      ((R.dataset.osmBound = "1"),
      R.addEventListener("click", (t) => {
        (t.preventDefault(), t.stopPropagation(), k());
      }));
    let T = null;
    function j() {
      (T && clearTimeout(T),
        (T = setTimeout(() => {
          try {
            i.invalidateSize();
          } catch (t) {}
          try {
            _.redraw();
          } catch (t) {}
        }, 90)));
    }
    j();
    try {
      window.addEventListener("resize", j);
    } catch (t) {}
    try {
      new ResizeObserver(j).observe(r);
    } catch (t) {}
    try {
      new IntersectionObserver((t) => {
        t.some((t) => t.isIntersecting) && j();
      }).observe(r);
    } catch (t) {}
    let C = !1;
    (i.on("movestart", () => {
      C || ((C = !0), j());
    }),
      i.on("zoomstart", () => {
        C || ((C = !0), j());
      }));
    const P = wt(),
      D = l(o || []).filter((t) => !St(t, P));
    try {
      A().flatPlaces = D.length;
    } catch (t) {}
    const I =
        Array.isArray(window.OSM_MAP_DATASET_ORDER) &&
        window.OSM_MAP_DATASET_ORDER.length
          ? window.OSM_MAP_DATASET_ORDER.slice()
          : B(),
      F = new Map();
    for (let t = 0; t < I.length; t++) F.set(String(I[t] || ""), t);
    const $ = new Map(),
      N = new Map();
    for (const t of D) {
      const e = Number(t.lat),
        o = Number(t.lon);
      if (!isFinite(e) || !isFinite(o)) continue;
      const n = e.toFixed(6) + "," + o.toFixed(6);
      let r = $.get(n);
      (r || ((r = []), $.set(n, r)), r.push(t));
    }
    const U = new Set($.keys());
    try {
      const t = A();
      ((t.coordPlaces = $.size),
        (t.noCoordPlaces = Math.max(0, D.length - $.size)));
    } catch (t) {}
    const q = () =>
        window.__OSM_FEED_INDEX__ || window.__OSM_FEED_BY_LL__ || {},
      z = (e, o) => {
        const n = String((e && e.ts) || "").trim();
        if (!n) return "";
        const r = String((e && e.avatar) || "").trim(),
          i = String((e && e.user) || "").trim(),
          a = r ? `<img src="${t(r)}" alt="">` : "",
          s = i ? ` title="${t(i)}"` : "",
          c = Math.max(0, Number(o || 0) || 0),
          d = c > 99 ? "99+" : String(c || ""),
          l =
            c > 1
              ? `<span class="osm-popup-feedcount"><b>${t(d)}</b></span>`
              : "";
        return `<button type="button" class="osm-popup-avatar" data-ts="${t(n)}"${s}>${a}</button>${l}`;
      };
    let G = 0;
    const Q = [];
    for (const [o, n] of $) {
      const r = o.split(","),
        i = Number(r[0]),
        s = Number(r[1]);
      if (!isFinite(i) || !isFinite(s)) continue;
      const c = n.slice();
      c.sort((t, e) => {
        const o = F.has(t.__src) ? F.get(t.__src) : 1e9,
          n = F.has(e.__src) ? F.get(e.__src) : 1e9;
        return o !== n
          ? o - n
          : String(t.name || "").localeCompare(String(e.name || ""), "zh-Hant");
      });
      const d = String((c[0] && c[0].cat) || "");
      let l = null;
      try {
        const n =
          Gt(c) ||
          `<div class="osm-popup"><div class="osm-popup-title">${t((c[0] && c[0].name) || "優惠")}</div></div>`;
        ((l = e.marker([i, s], { icon: a(e, d, c.length) })),
          l.addTo(S),
          N.set(o, l),
          l.bindPopup(n, {
            maxWidth: 360,
            closeButton: !0,
            autoPanPadding: [24, 24],
          }),
          G++);
      } catch (t) {
        (Q.push({
          coord: o,
          message: String((t && t.message) || t),
          name: String((c[0] && c[0].name) || ""),
        }),
          E("marker " + o, t));
        continue;
      }
      l.on("popupopen", () => {
        try {
          const t = l.getPopup(),
            e = t && "function" == typeof t.getElement ? t.getElement() : null;
          if (!e) return;
          const o = l.getLatLng(),
            n =
              isFinite(o.lat) && isFinite(o.lng)
                ? o.lat.toFixed(6) + "," + o.lng.toFixed(6)
                : "",
            r = q(),
            i = n && r[n] ? r[n] : [],
            a = e.querySelector(".leaflet-popup-content") || e;
          try {
            a.querySelectorAll(".osm-feed-block").forEach((t) => t.remove());
          } catch (t) {}
          const s = a.querySelectorAll(".osm-popup");
          if (!s || !s.length) return;
          s.forEach((t, e) => {
            const o = t.querySelector(".osm-popup-feeds");
            if (!o) return;
            const n = String(t.dataset.name || "").trim(),
              r = String(t.dataset.address || "").trim(),
              s = Ft(Tt(i, n, r, !1)),
              c = s[0],
              d = c ? z(c, s.length) : "";
            ((o.innerHTML = d),
              (o.onclick = (t) => {
                (t.target.closest(".osm-popup-avatar") ||
                  t.target.closest(".osm-popup-feedcount")) &&
                  (t.preventDefault(), t.stopPropagation(), Nt(s, n, r));
              }));
          });
        } catch (t) {}
      });
    }
    try {
      const t = A();
      ((t.markers = G), (t.markerErrors = Q.slice(0, 20)));
    } catch (t) {}
    if (!G)
      try {
        console.warn("[osm] no markers rendered", A());
      } catch (t) {}
    const H = document.getElementById("osmMapFullscreenBtn"),
      K = () => {
        try {
          return document.getElementById("osmMapLegend") || null;
        } catch (t) {
          return null;
        }
      };
    let V = !1,
      J = n.parentNode,
      Y = n.nextSibling,
      Z = !1;
    function X() {
      if (!Z) {
        try {
          ((J = J || n.parentNode), (Y = Y || n.nextSibling));
        } catch (t) {}
        try {
          document.body.appendChild(n);
        } catch (t) {}
        Z = !0;
      }
    }
    function tt() {
      if (Z) {
        try {
          J &&
            (Y && Y.parentNode === J ? J.insertBefore(n, Y) : J.appendChild(n));
        } catch (t) {}
        Z = !1;
      }
    }
    function et(t) {
      H &&
        (H.innerHTML = t
          ? '<i class="uil uil-compress-arrows"></i>'
          : '<i class="uil uil-expand-arrows-alt"></i>');
    }
    function ot() {
      if (V) return;
      V = !0;
      (X(),
        n.classList.add("osm-fullscreen"),
        n.classList.add("osm-css-fullscreen"),
        document.body.classList.add("osm-no-scroll"),
        et(!0));
      try {
        const t = K();
        t && t.classList.add("is-visible");
      } catch (t) {}
      const t = Math.min(19, _t() + 2),
        e = bt();
      (setTimeout(() => {
        try {
          i.invalidateSize();
        } catch (t) {}
        try {
          i.setView(e, t, { animate: !1 });
        } catch (t) {}
      }, 80),
        (V = !1));
    }
    function nt() {
      if (V) return;
      ((V = !0),
        n.classList.remove("osm-fullscreen"),
        n.classList.remove("osm-css-fullscreen"),
        document.body.classList.remove("osm-no-scroll"),
        et(!1));
      try {
        const t = K();
        t && t.classList.remove("is-visible");
      } catch (t) {}
      tt();
      const t = bt(),
        e = _t();
      try {
        i.setView(t, e, { animate: !1 });
      } catch (t) {}
      (setTimeout(() => {
        try {
          i.invalidateSize();
        } catch (t) {}
      }, 80),
        (V = !1));
    }
    function rt(t) {
      const e = Number(t && t.lat),
        o = Number(t && t.lon);
      return isFinite(e) && isFinite(o)
        ? e.toFixed(6) + "," + o.toFixed(6)
        : "";
    }
    ((window.osmFocusPlace = function (t, e) {
      e = e || {};
      const o = Number(t && t.lat),
        r = Number(t && t.lon);
      if (!isFinite(o) || !isFinite(r)) return void u("沒有座標");
      const a = !1 !== e.fullscreen;
      a && !n.classList.contains("osm-fullscreen") && ot();
      const s = Math.min(19, Math.max(_t() + 2, 17));
      setTimeout(
        () => {
          try {
            i.invalidateSize();
          } catch (t) {}
          try {
            i.setView([o, r], s, { animate: !0 });
          } catch (t) {}
          if (!1 !== e.openPopup) {
            const t = N.get(rt({ lat: o, lon: r }));
            try {
              t && t.openPopup();
            } catch (t) {}
          }
        },
        a ? 150 : 40,
      );
    }),
      H &&
        H.addEventListener("click", () => {
          n.classList.contains("osm-fullscreen") ? nt() : ot();
        }));
    const it = document.getElementById("osmListBtn");
    (it &&
      "1" !== it.dataset.osmBound &&
      ((it.dataset.osmBound = "1"),
      it.addEventListener("click", (t) => {
        (t.preventDefault(), t.stopPropagation(), Zt());
      })),
      document.addEventListener("keydown", (t) => {
        "Escape" === t.key && n.classList.contains("osm-fullscreen") && nt();
      }),
      (window.osmResetViewToDefault = function () {
        try {
          i.setView(bt(), _t(), { animate: !1 });
        } catch (t) {}
      }),
      (window.osmExitFullscreenAndReset = function () {
        try {
          n.classList.contains("osm-fullscreen")
            ? nt()
            : window.osmResetViewToDefault();
        } catch (t) {}
      }),
      setTimeout(() => {
        try {
          i.invalidateSize();
        } catch (t) {}
      }, 60));
  }
  function ee() {
    try {
      f();
    } catch (t) {}
    const t = document.getElementById("app_map"),
      e = document.getElementById("osmMap");
    if (!t || !e) return;
    if ("1" === e.dataset.osmLazy) return;
    ((e.dataset.osmLazy = "1"),
      (e.innerHTML && String(e.innerHTML).trim()) ||
        (e.innerHTML =
          '<div class="osm-lazy-placeholder"><div class="osm-lazy-spinner"></div><div>地圖載入中…</div></div>'));
    const o = () => {
        try {
          window.initOsmDiscountMap();
        } catch (t) {}
      },
      n = (e) => {
        e &&
          (e.addEventListener(
            "click",
            (o) => {
              t._osmMap ||
                (o.preventDefault(),
                o.stopPropagation(),
                Promise.resolve()
                  .then(() => window.initOsmDiscountMap())
                  .then(() =>
                    setTimeout(() => {
                      try {
                        e.click();
                      } catch (t) {}
                    }, 0),
                  ));
            },
            !0,
          ),
          e.addEventListener(
            "pointerdown",
            () => {
              t._osmMap || o();
            },
            { once: !0, passive: !0 },
          ),
          e.addEventListener(
            "touchstart",
            () => {
              t._osmMap || o();
            },
            { once: !0, passive: !0 },
          ));
      };
    if (
      (n(document.getElementById("osmMapLocateBtn")),
      n(document.getElementById("osmMapFullscreenBtn")),
      n(document.getElementById("osmListBtn")),
      e.addEventListener(
        "pointerdown",
        () => {
          t._osmMap || o();
        },
        { once: !0, passive: !0 },
      ),
      e.addEventListener(
        "touchstart",
        () => {
          t._osmMap || o();
        },
        { once: !0, passive: !0 },
      ),
      "IntersectionObserver" in window)
    ) {
      const t = new IntersectionObserver(
        (e) => {
          for (const n of e)
            if (n.isIntersecting && n.intersectionRatio > 0) {
              (t.disconnect(), o());
              break;
            }
        },
        { root: null, threshold: [0, 0.05, 0.1] },
      );
      try {
        t.observe(e);
      } catch (t) {
        o();
      }
    } else {
      let t = !1;
      const e = () => {
        if (!t) {
          t = !0;
          try {
            window.removeEventListener("scroll", e);
          } catch (t) {}
          o();
        }
      };
      (window.addEventListener("scroll", e, { passive: !0 }),
        setTimeout(e, 1e3));
    }
  }
  function oe() {
    window.__OSM_GLOBAL_BUTTONS_BOUND__ ||
      ((window.__OSM_GLOBAL_BUTTONS_BOUND__ = 1),
      document.addEventListener(
        "click",
        (t) => {
          const e = t.target.closest(
            '[data-action="osm-focus"],.osm-map-focus-btn',
          );
          if (e) {
            (t.preventDefault(), t.stopPropagation());
            const o = {
              lat: Number(e.dataset.lat),
              lon: Number(e.dataset.lon),
              name: String(e.dataset.name || ""),
              address: String(e.dataset.address || ""),
            };
            return void Promise.resolve(
              window.initOsmDiscountMap && window.initOsmDiscountMap(),
            ).then(() =>
              setTimeout(() => {
                try {
                  window.osmFocusPlace &&
                    window.osmFocusPlace(o, { fullscreen: !0, openPopup: !0 });
                } catch (t) {}
              }, 80),
            );
          }
          t.target.closest(
            '#osmListBtn,.osmListBtn,[data-action="osm-list"]',
          ) &&
            (t.preventDefault(),
            t.stopPropagation(),
            Promise.resolve(
              window.ensureOsmPlaces && window.ensureOsmPlaces(),
            ).then(() => {
              try {
                Zt();
              } catch (t) {}
            }));
        },
        !0,
      ));
  }
  ((window.__OSM_SQLITE_MAP_WORKERS__ =
    window.__OSM_SQLITE_MAP_WORKERS__ || {}),
    (window.__OSM_SQLITE_MAP_WORKER_URLS__ =
      window.__OSM_SQLITE_MAP_WORKER_URLS__ || {}),
    (window.__OSM_SQLITE_MAP_WORKER_URL__ =
      window.__OSM_SQLITE_MAP_WORKER_URL__ || ""),
    (window.__OSM_SQLITE_FULL_DBS__ = window.__OSM_SQLITE_FULL_DBS__ || {}),
    (window.__OSM_LOAD_STATS__ = window.__OSM_LOAD_STATS__ || {
      sqliteFiles: {},
      errors: [],
    }),
    (window.getOsmAdvertPlaces = function () {
      try {
        return Kt();
      } catch (t) {
        return [];
      }
    }),
    (window.getOsmOfferRows = function () {
      try {
        return Jt();
      } catch (t) {
        return [];
      }
    }),
    (window.openOsmOfferList = function () {
      try {
        Zt();
      } catch (t) {}
    }),
    (window.initOsmDiscountMap = async function () {
      try {
        (f(), await g(), await ht());
        const t = Array.isArray(window.PLACES) ? window.PLACES : [];
        await te(window.L, t);
      } catch (t) {
        E("initOsmDiscountMap", t);
        try {
          console.error("[osm] init failed", t, A());
        } catch (t) {}
      }
    }),
    (window.ensureOsmPlaces = function () {
      try {
        return ht();
      } catch (t) {
        return (E("ensureOsmPlaces", t), Promise.resolve([]));
      }
    }),
    (window.osmDebugStats = function () {
      try {
        return JSON.parse(JSON.stringify(A()));
      } catch (t) {
        return A();
      }
    }),
    (window.osmForceReloadPlaces = function () {
      try {
        return (
          (window.__OSM_PLACES_READY = !1),
          (window.__OSM_GEOCODE_CACHE__ = null),
          (window.PLACES = null),
          ht()
        );
      } catch (t) {
        return (E("osmForceReloadPlaces", t), Promise.reject(t));
      }
    }),
    oe(),
    "loading" === document.readyState
      ? document.addEventListener("DOMContentLoaded", ee)
      : ee());
})();
