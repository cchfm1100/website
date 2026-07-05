var versionedUrl =
    window.versionedUrl ||
    function (e) {
      return e;
    },
  cchCdnUrl =
    window.cchCdnUrl ||
    function (e) {
      return e;
    },
  cchPreferCdnAssets =
    window.cchPreferCdnAssets ||
    function () {
      return !1;
    };
("undefined" == typeof USER_AVATARS && (window.USER_AVATARS = {}),
  "undefined" == typeof ADV_USERS && (window.ADV_USERS = []),
  "undefined" == typeof STORIES && (window.STORIES = []));
const U = {
    ELEARNING: "http://elearning.xms.cch.org.tw",
    ICON: (e) => U.ICON_URL(e),
    ICON_URL: (e) =>
      e
        ? ((e = String(e).trim()),
          /^(https?:)?\/\//i.test(e) ||
          /^data:/i.test(e) ||
          /^\.\//.test(e) ||
          e.startsWith("/")
            ? versionedUrl(e)
            : versionedUrl(`https://cdn-icons-png.flaticon.com/128/${e}.png`))
        : versionedUrl(
            "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
          ),
    YT_EMBED: (e) =>
      `https://www.youtube-nocookie.com/embed/${e}?rel=0&modestbranding=1&playsinline=1`,
    DOC: (e) =>
      `https://dpt.cch.org.tw/upload/doctor/${e}?width=170&height=170`,
  },
  CAT_PRIORITY = ["R/VS", "PGY/UGY", "上傳KM會議記錄"];
!(function () {
  const e = "0.8.12",
    t = [
      "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/+esm",
      "https://esm.sh/sql.js-httpvfs@0.8.12?bundle",
    ],
    n =
      "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sqlite.worker.js",
    i = "https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sql-wasm.wasm",
    r = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js",
    a = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/";
  function s(e) {
    return String(e || "")
      .split("/")
      .pop()
      .split("?")[0]
      .split("#")[0];
  }
  function o(e) {
    return s(e).replace(/\.js$/i, ".sqlite");
  }
  function __isExcludedSqliteFeedFile(e) {
    return /^(?:stories|settings|map|geocode)\.(?:sqlite|db|sqlite3)$/i.test(
      o(e || ""),
    );
  }
  function l(e) {
    const t = [];
    return (
      (e || []).forEach((e) => {
        (e = o(e)) &&
          !__isExcludedSqliteFeedFile(e) &&
          !t.includes(e) &&
          t.push(e);
      }),
      t
    );
  }
  function c() {
    try {
      const e =
        "undefined" != typeof settings && settings && settings[0]
          ? settings[0]
          : null;
      if (!e || !Array.isArray(e.feeds)) return [];
      const t = [];
      return (
        e.feeds.forEach((e) => {
          const n = e && e.script;
          Array.isArray(n) &&
            n.forEach((e) => {
              e &&
                "object" == typeof e &&
                Object.keys(e).forEach((e) => {
                  /\.(sqlite|db|sqlite3|js)$/i.test(e) && t.push(o(e));
                });
            });
        }),
        l(t)
      );
    } catch (e) {
      return [];
    }
  }
  function d() {
    try {
      const e = [];
      Array.isArray(window.LOCAL_CDN) &&
        window.LOCAL_CDN.forEach((t) => {
          t &&
            "object" == typeof t &&
            [t.local, t.CDN].forEach((t) => {
              /\.(sqlite|db|sqlite3)(?:[?#]|$)/i.test(String(t || "")) &&
                e.push(o(t));
            });
        });
      const t =
        "undefined" != typeof settings && settings && settings[0]
          ? settings[0]
          : null;
      return (
        t &&
          Object.keys(t).forEach((n) => {
            (t[n] || []).forEach((t) => {
              const n = t && t.script;
              Array.isArray(n) &&
                n.forEach((t) => {
                  t &&
                    "object" == typeof t &&
                    Object.keys(t).forEach((n) => {
                      const i = t[n];
                      (/\.(sqlite|db|sqlite3)(?:[?#]|$)/i.test(n) ||
                        /\.(sqlite|db|sqlite3)(?:[?#]|$)/i.test(
                          String(i || ""),
                        )) &&
                        e.push(o(n));
                    });
                });
            });
          }),
        l(e.length ? e : c())
      );
    } catch (e) {
      return c();
    }
  }
  ((window.feedArray = []),
    (window.__FEED_SOURCE_MAP__ = {}),
    (window.__FEED_SOURCE_META__ = {}),
    (window.__SQLITE_FEED_WORKERS__ = {}),
    (window.__SQLITE_FEED_WORKER_URLS__ = {}),
    (window.__SQLITE_FEED_WORKER_URL__ = ""),
    (window.__SQLITE_FEED_FULL_DBS__ = window.__SQLITE_FEED_FULL_DBS__ || {}),
    (window.__SQLITE_FEED_INDEX_READY__ = !1),
    (window.__SQLITE_FEED_LOADING__ = null),
    (window.getFeedFilesFromSettings = c),
    (window.getSqliteFilesFromSettings = d));
  try {
    const e = c();
    e.length &&
      ((window.__FEED_FILES__ = e.slice()),
      (window.__DEFAULT_FEED_FILE__ = e[0] || ""));
  } catch (e) {}
  function u() {
    try {
      return (
        ("function" == typeof cchPreferCdnAssets && cchPreferCdnAssets()) ||
        !!window.__CCH_CDN_FIRST__
      );
    } catch (e) {
      return !1;
    }
  }
  function p(e) {
    return (
      /^(https?:)?\/\//i.test(String(e || "")) ||
      /^(data:|blob:)/i.test(String(e || ""))
    );
  }
  function m() {
    const e = [];
    return (
      ((t) => {
        (t = String(t || "")
          .trim()
          .replace(/\/+$/, "")) &&
          !e.includes(t) &&
          e.push(t);
      })(
        window.CDNurl ||
          window.CDNURL ||
          window.CCH_CDN_PREFIX ||
          window.SQL_CDN_PREFIX ||
          "",
      ),
      e
    );
  }
  function f(e) {
    const t = m()[0] || "";
    return (
      String(t || "").replace(/\/?$/, "/") + String(e || "").replace(/^\/+/, "")
    );
  }
  function g(e) {
    return (e = String(e || "").trim())
      ? p(e)
        ? [versionedUrl(e)]
        : m().map((t) =>
            versionedUrl(
              String(t).replace(/\/+$/, "") +
                "/" +
                e.replace(/^\.+\//, "").replace(/^\/+/, ""),
            ),
          )
      : [];
  }
  function h(e) {
    try {
      const t = new URL(String(e || ""), location.href),
        n = String(t.hostname || "").toLowerCase();
      return (
        n === String(location.hostname || "").toLowerCase() &&
        (n.includes("googleusercontent.com") ||
          String(t.pathname || "").includes("/embeds/"))
      );
    } catch (e) {
      return !1;
    }
  }
  function y(e) {
    const t = o(e);
    let n = "";
    try {
      const e =
        "undefined" != typeof settings && settings && settings[0]
          ? settings[0]
          : null;
      if (e && Array.isArray(e.feeds))
        for (const i of e.feeds) {
          const e = i && i.script;
          if (Array.isArray(e)) {
            for (const i of e)
              if (i && "object" == typeof i) {
                for (const e of Object.keys(i))
                  if (o(e) === t) {
                    n = String(i[e] || "")
                      .trim()
                      .replace(/\.js(\?|#|$)/i, ".sqlite$1");
                    break;
                  }
                if (n) break;
              }
            if (n) break;
          }
        }
    } catch (e) {}
    const i = g(n || t),
      r = [t],
      a = u() ? i.concat(r) : r.concat(i),
      s = [];
    for (const e of a) {
      if (!e) continue;
      let t = String(e).trim();
      try {
        t = new URL(versionedUrl(t), location.href).href;
      } catch (e) {
        try {
          t = versionedUrl(t);
        } catch (e) {}
      }
      t && !s.includes(t) && s.push(t);
    }
    return (u() && !window.__CCH_ALLOW_LOCAL_EMBED_FALLBACK__
      ? s.filter((e) => !h(e))
      : s
    ).length
      ? u() && !window.__CCH_ALLOW_LOCAL_EMBED_FALLBACK__
        ? s.filter((e) => !h(e))
        : s
      : [new URL(t, location.href).href];
  }
  function v(e) {
    return y(e)[0];
  }
  function S(e, t) {
    try {
      if (null == e || "" === e) return t;
      const n = JSON.parse(String(e));
      return null == n ? t : n;
    } catch (e) {
      return t;
    }
  }
  function A(e) {
    if (null == e || "" === e) return [];
    const t = String(e),
      n = S(t, null);
    return Array.isArray(n)
      ? n.map((e) => String(e || "").trim()).filter(Boolean)
      : t
          .split(/\r?\n|\|/)
          .map((e) => e.trim())
          .filter(Boolean);
  }
  function _(e, t) {
    if (!(t = String(t || "").trim())) return !0;
    const n = (Array.isArray(e) ? e : [])
      .map((e) => String(e || "").trim())
      .filter(Boolean);
    if (!n.length) return !1;
    const i = t.endsWith("::"),
      r = i ? t.slice(0, -2) : "",
      a = t.includes("::") ? t.split("::").slice(1).join("::") : t;
    return n.some((e) =>
      i ? e.startsWith(r + "::") : e === t || (a && e.endsWith("::" + a)),
    );
  }
  function w(e, t) {
    return _(A(e && null != e.topic ? e.topic : e && e.topics), t);
  }
  function E(e, t) {
    return _(e && Array.isArray(e.topics) ? e.topics : [], t);
  }
  function b(e) {
    return String(e || "").replace(/'/g, "''");
  }
  function T(e) {
    return (e = String(e || "").trim()) || "";
  }
  function L(e) {
    if (null == e) return "";
    if ("object" == typeof e)
      return String(
        e.userId || e.publisherID || e.publisherId || e.uid || e.id || "",
      ).trim();
    const t = String(e || "").trim();
    if (!t) return "";
    let n = t.match(
      /['"]?(?:userId|publisherID|publisherId|uid|id)['"]?\s*:\s*['"]([^'"]+)['"]/i,
    );
    return n ? n[1].trim() : ((n = t.match(/User\d{7}/i)), n ? n[0] : t);
  }
  function I(e) {
    return (e = String(e || "").trim())
      ? /^(https?:)?\/\//i.test(e) || /^(data|blob):/i.test(e)
        ? versionedUrl(e)
        : versionedUrl(f(e))
      : "";
  }
  function k(e) {
    return (e = String(e || "").trim())
      ? /^(https?:)?\/\//i.test(e) ||
        /^(data|blob):/i.test(e) ||
        /^(mailto|tel):/i.test(e)
        ? versionedUrl(e)
        : I(e)
      : "";
  }
  function F(e) {
    return (
      /\.(?:png|jpe?g|gif|webp|bmp|svg)(?:[?#]|$)/i.test(
        String(e || "").split("?")[0],
      ) || /images\.pexels\.com|sysdata\/course\//i.test(String(e || ""))
    );
  }
  function C(e) {
    const t = A(e.photosURL).map(k),
      n = A(e.photosCDNURL).map(I),
      i = A(e.linksURL).map(k).filter(F);
    return (n.length ? t.concat(n) : t.concat(i)).filter(Boolean);
  }
  function x(e) {
    const t = C(e);
    return A(e.linksURL)
      .map(k)
      .filter(Boolean)
      .filter((e) => !(F(e) && t.includes(e)));
  }
  function M(e) {
    return C(e)
      .map(
        (e) =>
          '<img src="' +
          String(e).replace(/"/g, "&quot;") +
          '" loading="lazy" decoding="async">',
      )
      .join("");
  }
  function D(e) {
    return String(null == e ? "" : e).replace(
      /[&<>'"]/g,
      (e) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[e],
    );
  }
  function q(e, t) {
    return (
      (e = String(e || "").trim()),
      (t = String(t || "").trim()),
      e
        ? t && "00:00" !== t && "00:00:00" !== t
          ? e + " " + (5 === t.length ? t + ":00" : t)
          : e + " 00:00:00"
        : ""
    );
  }
  function R(e) {
    return (e = String(e || "").trim())
      ? "高清圖片請參考：<a href='" + D(e) + "'>" + D(e) + "</a>"
      : "";
  }
  function P(e) {
    return (e || []).map((e) => '<img src="' + D(e) + '">').join("");
  }
  function U(e) {
    try {
      return "function" == typeof getTimestamp
        ? getTimestamp(e)
        : Date.parse(String(e || "").replace(" ", "T")) || Date.now();
    } catch (e) {
      return Date.now();
    }
  }
  async function $() {
    if (window.__SQLITE_HTTPVFS_MODULE__)
      return window.__SQLITE_HTTPVFS_MODULE__;
    let e = null;
    for (const n of t)
      try {
        const e = await import(versionedUrl(n)),
          t = e.createDbWorker || (e.default && e.default.createDbWorker);
        if (t)
          return (
            (window.__SQLITE_HTTPVFS_MODULE__ = { createDbWorker: t }),
            window.__SQLITE_HTTPVFS_MODULE__
          );
      } catch (t) {
        e = t;
      }
    throw e || new Error("sql.js-httpvfs import failed");
  }
  function N() {
    if (window.__SQLITE_FEED_WORKER_URL__)
      return window.__SQLITE_FEED_WORKER_URL__;
    const e = "importScripts(" + JSON.stringify(versionedUrl(n)) + ");";
    return (
      (window.__SQLITE_FEED_WORKER_URL__ = URL.createObjectURL(
        new Blob([e], { type: "text/javascript" }),
      )),
      window.__SQLITE_FEED_WORKER_URL__
    );
  }
  function O(e) {
    return (
      (e = versionedUrl(e)),
      (window.__CCH_SCRIPT_PROMISES__ = window.__CCH_SCRIPT_PROMISES__ || {}),
      window.__CCH_SCRIPT_PROMISES__[e] ||
        (window.__CCH_SCRIPT_PROMISES__[e] = new Promise((t, n) => {
          try {
            const i = document.createElement("script");
            ((i.src = e),
              (i.async = !0),
              (i.onload = () => t()),
              (i.onerror = () => n(new Error("load error " + e))),
              document.head.appendChild(i));
          } catch (e) {
            n(e);
          }
        })),
      window.__CCH_SCRIPT_PROMISES__[e]
    );
  }
  async function B() {
    return window.SQL && window.SQL.Database
      ? window.SQL
      : (window.__SQLITE_FEED_SQLJS_PROMISE__ ||
          (window.__SQLITE_FEED_SQLJS_PROMISE__ = O(r)
            .then(() => {
              const e =
                "function" == typeof window.initSqlJs
                  ? window.initSqlJs
                  : "function" == typeof initSqlJs
                    ? initSqlJs
                    : null;
              if (!e) throw new Error("initSqlJs missing");
              return e({ locateFile: (e) => a + e });
            })
            .then((e) => ((window.SQL = e), e))),
        window.__SQLITE_FEED_SQLJS_PROMISE__);
  }
  function H(e, t) {
    const n = e.prepare(t),
      i = [];
    try {
      for (; n.step();) i.push(n.getAsObject());
    } finally {
      try {
        n.free();
      } catch (e) {}
    }
    return i;
  }
  async function W(e) {
    const t = versionedUrl(e),
      n = await fetch(t, { cache: "no-store" });
    if (!n.ok) throw new Error("fetch " + t + " status " + n.status);
    return new Uint8Array(await n.arrayBuffer());
  }
  async function j(e) {
    const t = o(e);
    if (window.__SQLITE_FEED_WORKERS__[t])
      return window.__SQLITE_FEED_WORKERS__[t];
    if (window.__SQLITE_FEED_FULL_DBS__[t])
      return window.__SQLITE_FEED_FULL_DBS__[t];
    const n = await B(),
      i = y(t);
    let r = null;
    for (const e of i)
      try {
        const i = await W(e),
          r = new n.Database(i),
          a = { __fullSqliteDb: r, __fullSqliteUrl: e };
        try {
          H(r, "SELECT name FROM sqlite_master LIMIT 1");
        } catch (e) {
          try {
            r.close();
          } catch (e) {}
          throw e;
        }
        return (
          (window.__SQLITE_FEED_FULL_DBS__[t] = a),
          (window.__SQLITE_FEED_WORKERS__[t] = a),
          (window.__SQLITE_FEED_WORKER_URLS__[t] = e),
          a
        );
      } catch (e) {
        r = e;
      }
    throw r || new Error("SQLite full fetch failed: " + t);
  }
  async function z(e) {
    const t = o(e),
      n = await $(),
      r = y(t);
    let a = null;
    for (const e of r)
      try {
        const r = await n.createDbWorker(
          [
            {
              from: "inline",
              config: { serverMode: "full", requestChunkSize: 4096, url: e },
            },
          ],
          N(),
          versionedUrl(i),
          1 / 0,
        );
        try {
          await K(r, "SELECT name FROM sqlite_master LIMIT 1");
        } catch (e) {
          throw e;
        }
        return (
          (window.__SQLITE_FEED_WORKERS__[t] = r),
          (window.__SQLITE_FEED_WORKER_URLS__[t] = e),
          r
        );
      } catch (e) {
        a = e;
      }
    throw a || new Error("SQLite database load failed: " + t);
  }
  async function G(e) {
    const t = o(e);
    if (window.__SQLITE_FEED_WORKERS__[t])
      return window.__SQLITE_FEED_WORKERS__[t];
    let n = null;
    if (!window.__FEED_USE_HTTPVFS_SQLITE__)
      try {
        return await j(t);
      } catch (e) {
        n = e;
      }
    try {
      return await z(t);
    } catch (e) {
      if (window.__FEED_USE_HTTPVFS_SQLITE__)
        try {
          return await j(t);
        } catch (e) {
          n = n || e;
        }
      throw n || e;
    }
  }
  async function K(e, t) {
    if (e && e.__fullSqliteDb) return H(e.__fullSqliteDb, t);
    if (e && e.db && "function" == typeof e.db.query)
      try {
        return V(await e.db.query(t));
      } catch (e) {}
    return e && e.db && "function" == typeof e.db.exec
      ? V(await e.db.exec(t))
      : [];
  }
  function V(e) {
    if (!Array.isArray(e)) return [];
    if (
      e.length &&
      e[0] &&
      Array.isArray(e[0].values) &&
      Array.isArray(e[0].columns)
    ) {
      const t = e[0].columns;
      return e[0].values.map((e) => {
        const n = {};
        return (t.forEach((t, i) => (n[t] = e[i])), n);
      });
    }
    return e;
  }
  function Y(e, t) {
    const n = String(e.FID || e.id || e.__rowid__ || ""),
      i = C(e),
      r = i
        .map(
          (e) =>
            '<img src="' +
            String(e).replace(/"/g, "&quot;") +
            '" loading="lazy" decoding="async">',
        )
        .join(""),
      a = String(
        e.SlideShowURL || e.slideShowURL || e.slideshowURL || "",
      ).trim(),
      s = String(e.srt || e.SRT || "").trim();
    let l = s ? "" : String(e.caption || "");
    (!s && a && (l += (l ? "<br>" : "") + R(a)), !s && r && (l += r));
    const c = x(e),
      d = String(e.xmsIDURL || "").trim(),
      u = String(e.youtubeIDURL || "").trim(),
      p = A(e.topic || e.topics).length ? A(e.topic || e.topics) : [];
    return {
      __fid: n,
      __srcFile: o(t),
      __file: o(t),
      __bodyLoaded: !1,
      publisherId: String(e.publisherID || e.publisherId || ""),
      lecturersID: String(e.lecturersID || ""),
      tagID: String(e.tagID || ""),
      title: String(e.title || ""),
      datetime: q(String(e.date || ""), String(e.time || "")),
      caption: l,
      srt: s,
      SlideShowURL: a,
      yt: u,
      courseLink: d ? "https://elearning.xms.cch.org.tw/course/" + d : "",
      courseImage: i[0] || "",
      slides: i,
      linksURL: c,
      topics: p,
      likeList: [],
      commentList: [],
      shares: 0,
      isSlideShow: !!(a || i.length > 1 || Number(e.isSlideShow || 0)),
    };
  }
  function Q(e, t) {
    const n = o(e.source_sqlite || t),
      i = S(e.topics_json, []);
    return {
      publisherId: String(e.publisherId || ""),
      title: String(e.title || ""),
      datetime: String(e.datetime || ""),
      date: String(e.date || ""),
      caption: "",
      yt: String(e.yt || ""),
      courseLink: String(e.courseLink || ""),
      courseImage: String(e.courseImage || ""),
      slides: [],
      likeList: [],
      commentList: [],
      shares: Number(e.shares || 0) || 0,
      topics: Array.isArray(i) ? i : [],
      ts: Number(e.ts || 0) || 0,
      __rowUid: String(e.row_uid || ""),
      __srcFile: n,
      __sourceFile: String(e.source_file || ""),
      __itemIndex: Number(e.item_index || 0) || 0,
      __bodyLoaded: !1,
      __oldSchema: !0,
    };
  }
  function X(e, t) {
    for (const n of t || []) {
      const t = L(n.publisherID || n.publisherId || "");
      if (Number(n.isShare || 0)) {
        e.shares = (e.shares || 0) + 1;
        continue;
      }
      if (Number(n.isLike || 0)) {
        t && e.likeList.push({ userId: t });
        continue;
      }
      const i = C(n);
      (String(n.comments || "").trim() || i.length) &&
        e.commentList.push({
          userId: t,
          publisherId: t,
          datetime: q(String(n.date || ""), String(n.time || "")),
          text: String(n.comments || ""),
          comments: String(n.comments || ""),
          photosURL: i,
        });
    }
  }
  function Z(e, t) {
    if (!e || !t) return;
    e.caption = String(t.caption || "");
    const n = S(t.geo_json, null);
    if (
      n &&
      "object" == typeof n &&
      isFinite(Number(n.lat)) &&
      isFinite(Number(n.lon))
    )
      e.geo = {
        name: String(n.name || ""),
        address: String(n.address || ""),
        lat: Number(n.lat),
        lon: Number(n.lon),
      };
    else
      try {
        delete e.geo;
      } catch (t) {
        e.geo = null;
      }
    const i = S(t.slides_json, []),
      r = S(t.likeList_json, []),
      a = S(t.commentList_json, []);
    ((e.slides = Array.isArray(i) ? i : []),
      (e.likeList = Array.isArray(r) ? r : []),
      (e.commentList = Array.isArray(a) ? a : []),
      (e.__bodyLoaded = !0));
  }
  async function J(e) {
    if (
      !(e = (Array.isArray(e) ? e : [e]).filter((e) => e && !e.__bodyLoaded))
        .length
    )
      return;
    const t = {};
    e.forEach((e) => {
      const n = o(e.__srcFile);
      n && (t[n] || (t[n] = [])).push(e);
    });
    for (const e of Object.keys(t)) {
      const n = t[e];
      try {
        const t = await G(e),
          r = (
            await K(t, "SELECT name FROM sqlite_master WHERE type='table'")
          ).map((e) => String(e.name || "")),
          a = n.filter((e) => e.__oldSchema && e.__rowUid),
          s = n.filter((e) => !e.__oldSchema && e.__fid);
        if (s.length && r.includes("comments")) {
          const e = s.map((e) => String(e.__fid).replace(/'/g, "''")),
            n = await K(
              t,
              "SELECT * FROM comments WHERE FID IN ('" +
                e.join("','") +
                "') ORDER BY rowid",
            ),
            i = {};
          (n.forEach((e) => {
            const t = String(e.FID || "");
            (i[t] || (i[t] = [])).push(e);
          }),
            s.forEach((e) => {
              (X(e, i[String(e.__fid || "")] || []), (e.__bodyLoaded = !0));
            }));
        }
        if (a.length && r.includes("feed_body")) {
          const e = a.map((e) => String(e.__rowUid).replace(/'/g, "''")),
            n = await K(
              t,
              "SELECT row_uid,caption,geo_json,slides_json,likeList_json,commentList_json FROM feed_body WHERE row_uid IN ('" +
                e.join("','") +
                "')",
            ),
            i = {};
          (n.forEach((e) => (i[String(e.row_uid || "")] = e)),
            a.forEach((e) => Z(e, i[String(e.__rowUid || "")])));
        }
      } catch (e) {
        n.forEach((e) => (e.__bodyLoaded = !0));
      }
    }
    try {
      "function" == typeof normalizeFeedArray && normalizeFeedArray(e);
    } catch (e) {}
  }
  function ee(e) {
    ((window.feedArray.length = 0),
      (Array.isArray(e) ? e : []).forEach((e) => window.feedArray.push(e)));
    try {
      "function" == typeof normalizeFeedArray &&
        normalizeFeedArray(window.feedArray);
    } catch (e) {}
  }
  function te(e) {
    return (
      (e || []).sort(
        (e, t) =>
          (Number(t.ts) || 0) - (Number(e.ts) || 0) ||
          String(e.__srcFile).localeCompare(String(t.__srcFile)) ||
          (e.__itemIndex || 0) - (t.__itemIndex || 0),
      ),
      e
    );
  }
  async function __discoverLocalSqliteFeedFiles() {
    if (window.__LOCAL_SQLITE_FEED_FILES_READY__)
      return Array.isArray(window.__LOCAL_SQLITE_FEED_FILES__)
        ? window.__LOCAL_SQLITE_FEED_FILES__
        : [];
    const e = [];
    try {
      const t = await fetch("/api/sqlite-feed/files?ts=" + Date.now(), {
        cache: "no-store",
      });
      if (t.ok) {
        const n = await t.json().catch(() => null),
          i = Array.isArray(n && n.files) ? n.files : [];
        i.forEach((t) => {
          const n = o((t && (t.name || t.url || t.file || t.path)) || t);
          n &&
            /\.(sqlite|db|sqlite3)$/i.test(n) &&
            !__isExcludedSqliteFeedFile(n) &&
            !e.includes(n) &&
            e.push(n);
        });
      }
    } catch (e) {}
    ((window.__LOCAL_SQLITE_FEED_FILES__ = e.slice()),
      (window.__LOCAL_SQLITE_FEED_FILES_READY__ = !0));
    try {
      if (e.length) {
        window.__FEED_FILES__ = l(
          [].concat(
            e,
            Array.isArray(window.__FEED_FILES__) ? window.__FEED_FILES__ : [],
          ),
        );
        window.__DEFAULT_FEED_FILE__ =
          window.__DEFAULT_FEED_FILE__ || e[0] || "";
        const t = document.getElementById("feedSourceDatalist");
        t &&
          e.forEach((e) => {
            try {
              if (!Array.from(t.options || []).some((t) => t.value === e)) {
                const n = document.createElement("option");
                ((n.value = e), t.appendChild(n));
              }
            } catch (e) {}
          });
      }
    } catch (e) {}
    return e;
  }
  function __sqliteFeedOrderClause(e, t) {
    const n = (Array.isArray(t) ? t : []).map((e) =>
        String(e || "").toLowerCase(),
      ),
      i = (e) => n.includes(String(e || "").toLowerCase()),
      r = [];
    return (
      "feeds" === e
        ? (i("date") && r.push("date DESC"),
          i("time") && r.push("time DESC"),
          i("fid") && r.push("FID DESC"))
        : "main" === e
          ? (i("date") && r.push("date DESC"),
            i("time") && r.push("time DESC"),
            r.push("rowid DESC"))
          : "feed_index" === e &&
            (i("ts") && r.push("ts DESC"),
            i("datetime") && r.push("datetime DESC"),
            i("rowid") && r.push("rowid DESC")),
      r.length ? " ORDER BY " + r.join(",") : " ORDER BY rowid DESC"
    );
  }
  async function __sqliteFeedRowsFromDb(e, t) {
    const n = (
      await K(e, "SELECT name FROM sqlite_master WHERE type='table'")
    ).map((e) => String(e.name || ""));
    let i = [];
    if (n.includes("feeds")) {
      const n = (await K(e, "PRAGMA table_info(feeds)")).map((e) =>
        String(e.name || ""),
      );
      i = (
        await K(
          e,
          "SELECT rowid AS __rowid__,* FROM feeds" +
            __sqliteFeedOrderClause("feeds", n) +
            " LIMIT 500",
        )
      ).map((e) => Y(e, t));
    } else if (n.includes("main")) {
      const n = (await K(e, "PRAGMA table_info(main)")).map((e) =>
        String(e.name || ""),
      );
      i = (
        await K(
          e,
          "SELECT rowid AS __rowid__,* FROM main" +
            __sqliteFeedOrderClause("main", n) +
            " LIMIT 500",
        )
      ).map((e) => Y(e, t));
    } else if (n.includes("feed_index"))
      i = (
        await K(
          e,
          "SELECT row_uid,source_file,source_sqlite,item_index,publisherId,title,datetime,ts,date,yt,courseLink,courseImage,shares,topics_json,has_caption,has_geo FROM feed_index" +
            __sqliteFeedOrderClause("feed_index", ["ts", "datetime"]),
        )
      ).map((e) => Q(e, t));
    return i;
  }
  async function ne() {
    if (window.__SQLITE_FEED_INDEX_READY__) return;
    const e = await __discoverLocalSqliteFeedFiles(),
      t = l(
        [].concat(
          e,
          c().length
            ? c()
            : [
                "1100.sqlite",
                "909090.sqlite",
                "909091.sqlite",
                "909092.sqlite",
              ],
          Array.isArray(window.__FEED_FILES__) ? window.__FEED_FILES__ : [],
        ),
      );
    ((window.__FEED_FILES__ = t.slice()),
      (window.__DEFAULT_FEED_FILE__ =
        window.__DEFAULT_FEED_FILE__ || t[0] || ""));
    const n = [];
    (await Promise.all(
      t.map(async (t) => {
        try {
          const i = await G(t),
            r = await __sqliteFeedRowsFromDb(i, t);
          ((window.__FEED_SOURCE_MAP__[t] = r),
            (window.__FEED_SOURCE_META__[t] = {
              sqlite: !0,
              url:
                (window.__SQLITE_FEED_WORKER_URLS__ &&
                  window.__SQLITE_FEED_WORKER_URLS__[t]) ||
                v(t),
              at: Date.now(),
              version:
                window.__SQLITE_FEED_WORKERS__[t] &&
                window.__SQLITE_FEED_WORKERS__[t].__fullSqliteDb
                  ? "sqljs-full-fetch"
                  : "local-scan",
            }),
            n.push.apply(n, r));
        } catch (e) {
          ((window.__FEED_SOURCE_MAP__[t] = []),
            (window.__FEED_SOURCE_META__[t] = {
              sqlite: !0,
              error: String(e),
              at: Date.now(),
            }));
        }
      }),
    ),
      te(n),
      (window.__FULL_FEED_ARRAY__ = n.slice()));
    const i = String(window.__CURRENT_TOPIC_FILTER_KEY__ || "").trim();
    (ee(i ? n.filter((e) => E(e, i)) : n),
      (window.__SQLITE_FEED_INDEX_READY__ = !0));
  }
  async function ie(e) {
    if (!(e = String(e || "").trim())) return !1;
    window.__CURRENT_TOPIC_FILTER_KEY__ = e;
    const t = l(
        [].concat(
          Array.isArray(window.__LOCAL_SQLITE_FEED_FILES__)
            ? window.__LOCAL_SQLITE_FEED_FILES__
            : [],
          d().length ? d() : c(),
          Array.isArray(window.__FEED_FILES__) ? window.__FEED_FILES__ : [],
        ),
      ),
      n = [],
      i = T(e);
    return (
      await Promise.all(
        t.map(async (t) => {
          try {
            const r = await G(t);
            if (
              !(
                await K(
                  r,
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='feeds'",
                )
              ).length
            )
              return;
            const o = (await K(r, "PRAGMA table_info(feeds)")).map((e) =>
                String(e.name || ""),
              ),
              l = o.includes("topic")
                ? "topic"
                : o.includes("topics")
                  ? "topics"
                  : "";
            if (!l) return;
            let c = "SELECT rowid AS __rowid__,* FROM feeds";
            (i &&
              (c +=
                ' WHERE "' +
                l.replace(/"/g, '""') +
                "\" LIKE '%" +
                b(i) +
                "%'"),
              (c += __sqliteFeedOrderClause("feeds", o) + " LIMIT 500"));
            const u = (await K(r, c))
              .filter((t) => w(t, e))
              .map((e) => Y(e, t));
            n.push.apply(n, u);
          } catch (e) {}
        }),
      ),
      te(n),
      ee(n),
      (window.__TOPIC_FILTER_FEEDS__ = n.slice()),
      (window.__TOPIC_FILTER_KEY__ = e),
      !0
    );
  }
  async function re() {
    ((window.__CURRENT_TOPIC_FILTER_KEY__ = ""),
      window.__SQLITE_FEED_INDEX_READY__ || (await ne()));
    return (
      ee(
        Array.isArray(window.__FULL_FEED_ARRAY__)
          ? window.__FULL_FEED_ARRAY__.slice()
          : [],
      ),
      !0
    );
  }
  ((window.cchCdnUrl = window.cchCdnUrl || f),
    (window.__isExcludedSqliteFeedFile = __isExcludedSqliteFeedFile),
    (window.__feedItemMatchesTopicKey = E),
    (window.__loadSqliteFeedBodies = J),
    (window.__loadSqliteFeedsForTopic = ie),
    (window.__restoreSqliteFullFeedIndex = re),
    (window.__loadSqliteAllBodiesForSource = async function (e) {
      const t = o(e),
        n =
          window.__FEED_SOURCE_MAP__ &&
          Array.isArray(window.__FEED_SOURCE_MAP__[t])
            ? window.__FEED_SOURCE_MAP__[t]
            : [];
      await J(n);
    }),
    (window.__refreshLocalSqliteFeedFiles = __discoverLocalSqliteFeedFiles),
    (window.__reloadSqliteFeedFile = async function (e) {
      let t = o(
        e ||
          window.__DEFAULT_FEED_FILE__ ||
          (Array.isArray(window.__LOCAL_SQLITE_FEED_FILES__)
            ? window.__LOCAL_SQLITE_FEED_FILES__[0]
            : "") ||
          "",
      );
      if (!t) {
        const e = await __discoverLocalSqliteFeedFiles();
        t = o(e[0] || "");
      }
      if (!t) return 0;
      try {
        [
          "__SQLITE_FEED_WORKERS__",
          "__SQLITE_FEED_WORKER_URLS__",
          "__SQLITE_FEED_FULL_DBS__",
          "__FEED_SOURCE_MAP__",
          "__FEED_SOURCE_META__",
        ].forEach((e) => {
          const n = window[e];
          n && "object" == typeof n && delete n[t];
        });
        const n = await G(t),
          i = await __sqliteFeedRowsFromDb(n, t);
        ((window.__FEED_SOURCE_MAP__[t] = i),
          (window.__FEED_SOURCE_META__[t] = {
            sqlite: !0,
            url:
              (window.__SQLITE_FEED_WORKER_URLS__ &&
                window.__SQLITE_FEED_WORKER_URLS__[t]) ||
              v(t),
            at: Date.now(),
            version:
              window.__SQLITE_FEED_WORKERS__[t] &&
              window.__SQLITE_FEED_WORKERS__[t].__fullSqliteDb
                ? "sqljs-full-fetch"
                : "reload",
          }));
        let r = (
          Array.isArray(window.__FULL_FEED_ARRAY__)
            ? window.__FULL_FEED_ARRAY__
            : Array.isArray(window.feedArray)
              ? window.feedArray
              : []
        ).filter((e) => o(e && e.__srcFile) !== t);
        (r.push.apply(r, i), te(r), (window.__FULL_FEED_ARRAY__ = r.slice()));
        const a = String(window.__CURRENT_TOPIC_FILTER_KEY__ || "").trim();
        (ee(a ? r.filter((e) => E(e, a)) : r),
          (window.__SQLITE_FEED_INDEX_READY__ = !0));
        try {
          window.__FEED_FILES__ = l(
            [].concat(
              [t],
              Array.isArray(window.__FEED_FILES__) ? window.__FEED_FILES__ : [],
            ),
          );
        } catch (e) {}
        return i.length;
      } catch (e) {
        ((window.__FEED_SOURCE_MAP__[t] = []),
          (window.__FEED_SOURCE_META__[t] = {
            sqlite: !0,
            error: String(e),
            at: Date.now(),
            reload: !0,
          }));
        throw e;
      }
    }),
    (window.__sqliteFeedStart = function () {
      return (
        window.__SQLITE_FEED_LOADING__ ||
          (window.__SQLITE_FEED_LOADING__ = (async () => {
            try {
              (await ne(),
                "function" == typeof renderAllFeeds &&
                  (await renderAllFeeds()));
            } catch (e) {
              try {
                "function" == typeof flashMsg && flashMsg("SQLite 載入失敗");
              } catch (e) {}
            }
          })()),
        window.__SQLITE_FEED_LOADING__
      );
    }),
    (window.__renderAllFeedsIfReady = function () {
      return window.__sqliteFeedStart();
    }));
})();
const __FALLBACK_AVATAR =
  _defaultAvatar() || "https://cdn-icons-png.flaticon.com/128/1828/1828843.png";
function _systemUser(e) {
  return _advUserById(e) || { id: e, name: e, avatar: __FALLBACK_AVATAR };
}
function getSystemNotifs() {
  const e = _systemUser("User0144084"),
    t = _systemUser("User0176454");
  return [
    {
      img: e.avatar || __FALLBACK_AVATAR,
      html: `<b>系統</b> 恭賀 <b>${e.name}</b> 晉升教授 <small>2025年8月1日</small>`,
    },
    {
      img: t.avatar || __FALLBACK_AVATAR,
      html: `<b>系統</b> 恭賀 <b>${t.name}</b> 指導 <b>周鈺斌醫師</b> 榮獲學術佳作 <small>2025年8月1日</small>`,
    },
  ];
}
const SYSTEM_NOTIFS = getSystemNotifs();
let tsCounter = 0,
  selectionMode = "user",
  likeAvatarsSelected = [],
  selectedTopics = [],
  advCurrentUserId = "User0000002",
  advCurrentUserName = "您",
  advCurrentUserAvatar =
    ADV_USERS.User0000002 && ADV_USERS.User0000002.avatar
      ? ADV_USERS.User0000002.avatar
      : "";
const d = document,
  qs = (e, t = d) => t.querySelector(e),
  qsa = (e, t = d) => [...t.querySelectorAll(e)],
  TTS_SUPPORTED =
    "undefined" != typeof window &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;
let expanded = !1,
  mainActionDefaultText = "",
  feedEditState = { active: !1, item: null, srcFile: "", prevTargetFile: "" },
  advSelectedGeo = null;
function getTimestamp(e) {
  const t = null != e ? String(e).trim() : "";
  if (!t) return Date.now() + tsCounter++;
  const n = Date.parse(t.replace(" ", "T"));
  return isNaN(n) ? Date.now() + tsCounter++ : n + tsCounter++;
}
function initStaticImages() {
  var e = _advUserById("User0000002") || {},
    t = _advUserById("User0000003") || {},
    n =
      e.avatar ||
      _defaultAvatar() ||
      "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
    i =
      t.avatar ||
      _defaultAvatar() ||
      "https://cdn-icons-png.flaticon.com/128/1828/1828843.png";
  ((qs("#avatarGuest").src = n),
    (qs("#profileLogo").src = n),
    (qs("#postAvatar").src = i));
}
function esc(e) {
  return String(e).replace(
    /[&<>"']/g,
    (e) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        e
      ],
  );
}
function _advUserById(e) {
  try {
    if ("undefined" == typeof ADV_USERS || !ADV_USERS) return null;
    const t = String(e || "");
    if (!t) return null;
    if (
      "object" == typeof ADV_USERS &&
      ADV_USERS[t] &&
      "object" == typeof ADV_USERS[t]
    )
      return ADV_USERS[t];
    if (Array.isArray(ADV_USERS)) {
      const e = ADV_USERS.find((e) => e && String(e.id || "") === t);
      if (e) return e;
      if (
        Object.prototype.hasOwnProperty.call(ADV_USERS, t) &&
        "object" == typeof ADV_USERS[t]
      )
        return ADV_USERS[t];
    }
  } catch (e) {}
  return null;
}
function _defaultAvatar() {
  try {
    if ("undefined" != typeof ADV_USERS && ADV_USERS) {
      if (ADV_USERS.User0000002 && ADV_USERS.User0000002.avatar)
        return String(ADV_USERS.User0000002.avatar);
      if (
        Array.isArray(ADV_USERS) &&
        ADV_USERS.length &&
        ADV_USERS[0] &&
        ADV_USERS[0].avatar
      )
        return String(ADV_USERS[0].avatar);
    }
  } catch (e) {}
  return "";
}
function _dateFromDatetime(e) {
  return (e = String(e || "").trim()) ? e.split(" ")[0] || e : "";
}
function normalizeFeedArray(e) {
  if (!Array.isArray(e)) return;
  const t = _defaultAvatar();
  e.forEach((e) => {
    if (!e || "object" != typeof e) return;
    const n = null != e.publisherId ? String(e.publisherId) : "";
    if (!e.user || "string" != typeof e.user || !e.user.trim()) {
      const t = _advUserById(n);
      e.user = t && t.name ? String(t.name) : n || "您";
    }
    if (!e.avatar || "string" != typeof e.avatar || !e.avatar.trim()) {
      const i = _advUserById(n);
      e.avatar = i && i.avatar ? String(i.avatar) : t || "";
    }
    if ("number" != typeof e.ts || !isFinite(e.ts)) {
      const t = null != e.datetime ? String(e.datetime) : "";
      e.ts = getTimestamp(t || null);
    }
    if (!e.date || "string" != typeof e.date || !e.date.trim()) {
      const t = null != e.datetime ? String(e.datetime) : "";
      e.date = t
        ? _dateFromDatetime(t)
        : isFinite(e.ts)
          ? new Date(e.ts).toISOString().slice(0, 10)
          : "剛剛";
    }
    if (
      (Array.isArray(e.likeName) || (e.likeName = []),
      Array.isArray(e.likeAvatars) || (e.likeAvatars = []),
      (!Array.isArray(e.likeList) || !e.likeList.length) &&
        String(e.lecturersID || "").trim())
    ) {
      const n = String(e.lecturersID || "")
        .split(/[\s,，、|;；]+/)
        .map((e) => e.trim())
        .filter(Boolean);
      if (n.length) {
        const i = [],
          r = [];
        (n.forEach((e) => {
          const n = _advUserById(e);
          (i.push(n && n.name ? String(n.name) : e),
            r.push(n && n.avatar ? String(n.avatar) : t || ""));
        }),
          e.likeName.length || (e.likeName = i),
          e.likeAvatars.length || (e.likeAvatars = r),
          (e.likeList = n.map((e) => ({ userId: e }))));
      }
    }
    if (
      Array.isArray(e.likeList) &&
      e.likeList.length &&
      (0 === e.likeName.length || 0 === e.likeAvatars.length)
    ) {
      const n = [],
        i = [];
      (e.likeList.forEach((e) => {
        if (!e) return;
        const r = null != e.userId ? String(e.userId) : "";
        if (!r) return;
        const a = _advUserById(r);
        (n.push(a && a.name ? String(a.name) : r),
          i.push(a && a.avatar ? String(a.avatar) : t || ""));
      }),
        e.likeName.length || (e.likeName = n),
        e.likeAvatars.length || (e.likeAvatars = i));
    }
    if (
      (("number" == typeof e.likes && isFinite(e.likes)) ||
        (e.likes = Array.isArray(e.likeName) ? e.likeName.length : 0),
      Array.isArray(e.commentList)
        ? (e.commentList = e.commentList
            .map((t) => {
              if (null == t) return null;
              if ("string" == typeof t)
                return {
                  userId: n,
                  datetime: String(e.datetime || ""),
                  text: t,
                };
              if ("object" != typeof t) return null;
              const i =
                  null != t.userId
                    ? String(t.userId)
                    : null != t.publisherId
                      ? String(t.publisherId)
                      : null != t.publisherID
                        ? String(t.publisherID)
                        : "",
                r = null != t.datetime ? String(t.datetime) : "",
                a =
                  null != t.text
                    ? String(t.text)
                    : null != t.comments
                      ? String(t.comments)
                      : null != t.comment
                        ? String(t.comment)
                        : "";
              return {
                userId: i || n,
                datetime: r || String(e.datetime || ""),
                text: a,
              };
            })
            .filter(Boolean))
        : (e.commentList = []),
      ("number" == typeof e.shares && isFinite(e.shares)) || (e.shares = 0),
      Array.isArray(e.topics) || (e.topics = []),
      e.geo && "object" == typeof e.geo)
    ) {
      const t = Number(e.geo.lat),
        n = Number(e.geo.lon);
      isFinite(t) && isFinite(n)
        ? (e.geo = {
            name: String(e.geo.name || ""),
            address: String(e.geo.address || ""),
            lat: t,
            lon: n,
          })
        : delete e.geo;
    }
  });
  const n = new Map();
  e.forEach((e) => {
    if (!e || "object" != typeof e) return;
    const t = Number(e.ts);
    if (!isFinite(t)) return;
    const i = n.get(t) || 0;
    (i > 0 && (e.ts = t + i), n.set(t, i + 1));
  });
  try {
    (window && window.__OSM_FEED_INDEX__, updateOsmFeedIndexFromFeedArray());
  } catch (e) {}
}
function osmLlKey(e, t) {
  const n = Number(e),
    i = Number(t);
  return isFinite(n) && isFinite(i) ? n.toFixed(6) + "," + i.toFixed(6) : "";
}
function updateOsmFeedIndexFromFeedArray() {
  const e = {},
    t = Array.isArray(feedArray) ? feedArray : [];
  for (const n of t) {
    const t = n && n.geo,
      i = osmLlKey(t && t.lat, t && t.lon);
    i &&
      (e[i] || (e[i] = []),
      e[i].push({
        ts: String(n.ts || ""),
        avatar: String(n.avatar || ""),
        user: String(n.user || ""),
        gName: String((n.geo && n.geo.name) || ""),
        gAddr: String((n.geo && n.geo.address) || ""),
      }));
  }
  (Object.keys(e).forEach((t) =>
    e[t].sort((e, t) => Number(t.ts) - Number(e.ts)),
  ),
    (window.__OSM_FEED_INDEX__ = e));
  try {
    window.dispatchEvent(new CustomEvent("osmFeedIndexUpdated"));
  } catch (e) {
    try {
      var n = document.createEvent("Event");
      (n.initEvent("osmFeedIndexUpdated", !0, !0), window.dispatchEvent(n));
    } catch (e) {}
  }
}
const IMG_PLACEHOLDER =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
  CAPTION_IMG_PRELOAD_LIMIT = 3,
  RAW_GH_BASE = "https://raw.githubusercontent.com/cchfm/website/";
function _toRepoPathFromUrl(e) {
  try {
    const t = new URL(e, location.href);
    if ("data:" === t.protocol || "blob:" === t.protocol) return null;
    if (String(t.href).startsWith(RAW_GH_BASE)) return null;
    if (/^https?:$/.test(t.protocol) && t.origin !== location.origin)
      return null;
    let n = t.pathname.replace(/^\/+/, "");
    return (n.startsWith("website/") && (n = n.slice(8)), n || null);
  } catch (t) {
    if (!e) return null;
    let n = String(e).replace(/^\/+/, "");
    return (n.startsWith("website/") && (n = n.slice(8)), n || null);
  }
}
function _trySetRawFallbackForImg(e) {
  if (!(e instanceof HTMLImageElement)) return;
  const t = e.getAttribute("src") || "";
  if (!t) return;
  if ("done" === e.dataset.__rawFallback) return;
  const n = _toRepoPathFromUrl(t);
  n &&
    ((e.dataset.__rawFallback = "done"),
    (e.src = versionedUrl(RAW_GH_BASE + encodeURI(n))));
}
function _ensureLightbox() {
  let e = document.getElementById("imgLightbox");
  if (e) return e;
  ((e = document.createElement("div")),
    (e.id = "imgLightbox"),
    (e.className = "img-lightbox"),
    (e.innerHTML =
      '<button type="button" aria-label="Close">×</button><img alt="">'));
  const t = () => {
    (e.classList.remove("open"), (document.body.style.overflow = ""));
  };
  return (
    e.addEventListener("click", (n) => {
      (n.target !== e && "BUTTON" !== n.target.tagName) || t();
    }),
    document.addEventListener("keydown", (e) => {
      "Escape" === e.key && t();
    }),
    document.body.appendChild(e),
    (e.__close = t),
    e
  );
}
function openImageLightbox(e, t) {
  if (!e) return;
  const n = _ensureLightbox(),
    i = n.querySelector("img");
  ((i.alt = t || ""),
    (i.src = e),
    n.classList.add("open"),
    (document.body.style.overflow = "hidden"));
}
function initImageLightboxClicks() {
  window.__imageLightboxClicksBound ||
    ((window.__imageLightboxClicksBound = !0),
    document.addEventListener(
      "click",
      (e) => {
        const t =
          e.target && e.target.closest
            ? e.target.closest(
                ".map-ad-gallery img,.post-images img,.caption-gallery img,.caption-slideshow img",
              )
            : null;
        if (!t) return;
        t.dataset &&
          t.dataset.src &&
          t.src === IMG_PLACEHOLDER &&
          loadLazyImage(t);
        const n =
          (t.dataset && (t.dataset.fullSrc || t.dataset.src)) ||
          t.currentSrc ||
          t.src;
        n &&
          (e.preventDefault(),
          e.stopPropagation(),
          openImageLightbox(n, t.getAttribute("alt") || ""));
      },
      !0,
    ));
}
(document.addEventListener(
  "error",
  (e) => {
    const t = e.target;
    t && "IMG" === t.tagName && _trySetRawFallbackForImg(t);
  },
  !0,
),
  initImageLightboxClicks());
const FEED_BATCH_SIZE = 12;
let feedRenderIndex = 0,
  feedInfiniteObserver = null,
  lazyImgObserver = null;
function loadLazyImage(e) {
  if (!e) return;
  const t = e.getAttribute("data-src");
  t && ((e.src = t), e.removeAttribute("data-src"), (e.dataset.loaded = "1"));
}
function initLazyImages(e) {
  const n = (e && e.querySelectorAll ? e : document).querySelectorAll(
    'img[data-src]:not([data-defer="1"])',
  );
  n.length &&
    ("IntersectionObserver" in window
      ? (lazyImgObserver ||
          (lazyImgObserver = new IntersectionObserver(
            (e) => {
              e.forEach((e) => {
                e.isIntersecting &&
                  (loadLazyImage(e.target),
                  lazyImgObserver.unobserve(e.target));
              });
            },
            { root: null, rootMargin: "300px 0px", threshold: 0.01 },
          )),
        n.forEach((e) => {
          "1" !== e.dataset.lazyBound &&
            ((e.dataset.lazyBound = "1"), lazyImgObserver.observe(e));
        }))
      : n.forEach(loadLazyImage));
}
let feedGeoMapRetry = 0,
  feedGeoMapObserver = null,
  feedGeoTileIndex = null,
  feedGeoTilePickPromise = null;
function feedGeoTileSources() {
  const e = [];
  try {
    const t = String(
        window.OSM_TILE_URL_TEMPLATE || window.OSM_TILE_URL || "",
      ).trim(),
      n = String(window.OSM_TILE_ATTRIBUTION || "").trim();
    t && e.push({ url: t, attr: n || "" });
  } catch (e) {}
  return (
    e.push(
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
    e
  );
}
function feedGeoProbeUrl(e) {
  const t = e && e.subdomains ? String(e.subdomains) : "a",
    n = t ? t[0] : "a";
  let i = String((e && e.url) || "");
  return (
    (i = i
      .replace("{s}", n)
      .replace("{z}", "0")
      .replace("{x}", "0")
      .replace("{y}", "0")
      .replace("{r}", "")),
    i ? i + (i.includes("?") ? "&" : "?") + "fg_probe=" + Date.now() : ""
  );
}
function probeFeedGeoSource(e, t) {
  return (
    (t = Number(t) || 1800),
    new Promise((n) => {
      let i = !1;
      const r = new Image(),
        a = (e) => {
          if (!i) {
            i = !0;
            try {
              clearTimeout(s);
            } catch (e) {}
            ((r.onload = r.onerror = null), n(!!e));
          }
        },
        s = setTimeout(() => a(!1), t);
      ((r.onload = () => a(!0)), (r.onerror = () => a(!1)));
      try {
        r.decoding = "async";
      } catch (e) {}
      const o = feedGeoProbeUrl(e);
      o ? (r.src = o) : a(!1);
    })
  );
}
async function pickFeedGeoTileIndex() {
  return null != feedGeoTileIndex
    ? feedGeoTileIndex
    : feedGeoTilePickPromise ||
        ((feedGeoTilePickPromise = (async () => {
          const e = feedGeoTileSources();
          try {
            const t = await Promise.all(
              e.map((e) => probeFeedGeoSource(e, 1800).catch(() => !1)),
            );
            for (let e = 0; e < t.length; e++)
              if (t[e]) return ((feedGeoTileIndex = e), e);
          } catch (e) {}
          return ((feedGeoTileIndex = 0), 0);
        })()),
        feedGeoTilePickPromise);
}
function makeFeedGeoTiles(e, t) {
  const n = feedGeoTileSources(),
    i = n[t] || n[0],
    r = Object.assign(
      {
        maxZoom: 19,
        attribution: i.attr || "",
        updateWhenIdle: !0,
        keepBuffer: 1,
      },
      i.opts || {},
    );
  return (i.subdomains && (r.subdomains = i.subdomains), e.tileLayer(i.url, r));
}
function initFeedGeoMapOne(e) {
  if (e && e._feedGeoMap) {
    try {
      e._feedGeoMap.invalidateSize();
    } catch (e) {}
    return;
  }
  const t = window.L,
    n = Number(e.dataset.lat),
    i = Number(e.dataset.lon);
  if (!isFinite(n) || !isFinite(i)) return;
  let r = null;
  try {
    r = t.map(e, {
      zoomControl: !1,
      attributionControl: !1,
      scrollWheelZoom: !1,
      touchZoom: !1,
      doubleClickZoom: !1,
      boxZoom: !1,
      keyboard: !1,
      dragging: !1,
      fadeAnimation: !1,
      zoomAnimation: !1,
      markerZoomAnimation: !1,
      inertia: !1,
    });
  } catch (e) {
    return;
  }
  e._feedGeoMap = r;
  let a = null != feedGeoTileIndex ? feedGeoTileIndex : 0,
    s = makeFeedGeoTiles(t, a).addTo(r),
    o = !1;
  const l = () => {
    o = !0;
  };
  s.on("tileload", l);
  let c = 0,
    d = 0;
  const u = () => {
    const e = Date.now();
    ((!d || e - d > 7e3) && ((d = e), (c = 0)), c++, c >= 6 && p());
  };
  function p() {
    const e = feedGeoTileSources();
    if (!(a >= e.length - 1)) {
      (a++, (feedGeoTileIndex = a));
      try {
        r.removeLayer(s);
      } catch (e) {}
      ((s = makeFeedGeoTiles(t, a).addTo(r)),
        (o = !1),
        s.on("tileload", l),
        s.on("tileerror", u),
        (c = 0),
        (d = 0),
        setTimeout(() => {
          try {
            r.invalidateSize();
          } catch (e) {}
        }, 60));
    }
  }
  (s.on("tileerror", u),
    setTimeout(() => {
      o || p();
    }, 2600));
  try {
    t.marker([n, i]).addTo(r);
  } catch (e) {}
  try {
    r.setView([n, i], 16, { animate: !1 });
  } catch (e) {}
  setTimeout(() => {
    try {
      r.invalidateSize();
    } catch (e) {}
  }, 60);
}
function ensureFeedGeoMapObserver() {
  !feedGeoMapObserver &&
    "IntersectionObserver" in window &&
    (feedGeoMapObserver = new IntersectionObserver(
      (e) => {
        e.forEach((e) => {
          e.isIntersecting &&
            (feedGeoMapObserver.unobserve(e.target),
            initFeedGeoMapOne(e.target));
        });
      },
      { root: null, rootMargin: "400px 0px", threshold: 0.01 },
    ));
}
function initFeedGeoMaps(e) {
  const t = e && e.querySelectorAll ? e : document,
    n = t.querySelectorAll(
      '.feed-geo.is-open .feed-geo-map[data-lat][data-lon]:not([data-geo-init="1"])',
    );
  if (n.length)
    if (window.L && "function" == typeof window.L.map)
      (ensureFeedGeoMapObserver(),
        pickFeedGeoTileIndex().catch(() => {}),
        n.forEach((e) => {
          ((e.dataset.geoInit = "1"),
            feedGeoMapObserver
              ? feedGeoMapObserver.observe(e)
              : initFeedGeoMapOne(e));
        }));
    else {
      try {
        "function" == typeof window.initOsmDiscountMap &&
          window.initOsmDiscountMap();
      } catch (e) {}
      feedGeoMapRetry < 8 &&
        (feedGeoMapRetry++, setTimeout(() => initFeedGeoMaps(t), 260));
    }
}
function initFeedGeoToggle() {
  (document.addEventListener("click", (e) => {
    const t =
      e.target && e.target.closest ? e.target.closest(".feed-geo-head") : null;
    if (!t) return;
    const n = t.closest(".feed-geo");
    if (!n) return;
    const i = !n.classList.contains("is-open");
    (i
      ? (n.classList.add("is-open"), t.setAttribute("aria-expanded", "true"))
      : (n.classList.remove("is-open"),
        t.setAttribute("aria-expanded", "false")),
      i && initFeedGeoMaps(n));
    const r = n.querySelector(".feed-geo-map");
    i &&
      r &&
      r._feedGeoMap &&
      setTimeout(() => {
        try {
          r._feedGeoMap.invalidateSize();
        } catch (e) {}
      }, 60);
  }),
    document.addEventListener("keydown", (e) => {
      if ("Enter" !== e.key && " " !== e.key) return;
      const t =
        e.target && e.target.closest
          ? e.target.closest(".feed-geo-head")
          : null;
      t && (e.preventDefault(), t.click());
    }));
}
function eagerLoadDeferredCaptionImages(e) {
  if (!e || !e.querySelectorAll) return;
  const t = [...e.querySelectorAll('img[data-src][data-defer="1"]')];
  if (!t.length) return;
  t.forEach((e) => e.removeAttribute("data-defer"));
  let n = 0;
  const i = () => {
    n >= t.length || (loadLazyImage(t[n++]), setTimeout(i, 60));
  };
  i();
}
function ensureFeedSentinel() {
  let e = qs("#feedSentinel");
  if (!e) {
    ((e = document.createElement("div")),
      (e.id = "feedSentinel"),
      (e.className = "feed-sentinel"),
      (e.style.display = "none"),
      (e.innerHTML =
        '<span class="spinner" aria-hidden="true"></span><span class="text">載入更多…</span>'));
    const t = qs("#newPosts");
    t ? t.insertAdjacentElement("afterend", e) : document.body.appendChild(e);
  }
  return e;
}
function setSentinelVisible(e) {
  ensureFeedSentinel().style.display = e ? "flex" : "none";
}
function advUserById(e) {
  if (!e) return null;
  try {
    if ("undefined" != typeof ADV_USERS && ADV_USERS && ADV_USERS[e])
      return ADV_USERS[e];
    if ("undefined" != typeof ADV_USERS && Array.isArray(ADV_USERS))
      return ADV_USERS.find((t) => t.id === e) || null;
  } catch (e) {}
  return null;
}
function renderCommentItem(e) {
  if ("string" == typeof e)
    return `<div class="comment-item"><div class="comment-body"><div class="comment-text">${esc(e)}</div></div></div>`;
  if (!e || "object" != typeof e) return "";
  const n = advUserById(
      e.userId || e.publisherId || e.publisherID || e.uid || e.id || "",
    ) || {
      name: "匿名者",
      avatar:
        _defaultAvatar() ||
        "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
    },
    i = e.text || e.comments || e.comment || e.content || e.msg || "";
  return `<div class="comment-item"><img src="${esc(n.avatar)}" alt=""><div class="comment-body"><div class="comment-name">${esc(n.name)}</div><div class="comment-text">${esc(i)}</div></div></div>`;
}
const TOPIC_META = {};
function refreshTopicMeta() {
  return (
    Object.keys(TOPIC_META).forEach((e) => delete TOPIC_META[e]),
    (Array.isArray(TOPIC_GROUPS) ? TOPIC_GROUPS : []).forEach((e) => {
      e &&
        e.id &&
        (TOPIC_META[e.id] = {
          id: e.id,
          name: e.name || e.id,
          color: e.color || "#0ea5e9",
        });
    }),
    TOPIC_META
  );
}
function parseTopicKey(e) {
  const t = String(e || ""),
    n = t.split("::");
  return n.length < 2
    ? { gid: "", topic: t }
    : { gid: n[0], topic: n.slice(1).join("::") };
}
function topicMeta(e) {
  return (
    !TOPIC_META[e] &&
      Array.isArray(TOPIC_GROUPS) &&
      TOPIC_GROUPS.length &&
      refreshTopicMeta(),
    TOPIC_META[e] || null
  );
}
function topicLabel(e) {
  const t = parseTopicKey(e),
    n = topicMeta(t.gid);
  return (n ? n.name : t.gid || "分類") + " · " + (t.topic || "全部");
}
function topicColor(e) {
  const n = topicMeta(parseTopicKey(e).gid);
  return n ? n.color : "";
}
refreshTopicMeta();
let activeTopicKey = "",
  activeSearchQuery = "",
  activeBookmarkOnly = !1;
function buildExpandableCaption(e, t = 160) {
  const n = document.createElement("div");
  n.innerHTML = e || "";
  const i = captionHtmlToText
    ? captionHtmlToText(e)
    : (n.textContent || "").trim();
  if (i.length <= t) return { html: e, truncated: !1, fullText: i };
  const r = void 0,
    a = void 0,
    s = void 0;
  return {
    html:
      `<span class="caption-preview">${esc(i.slice(0, t) + "…").replace(/\n/g, "<br>")}</span>` +
      '<div class="more-btn-row">' +
      '<button type="button" class="more-btn" data-action="expand-caption">顯示更多</button>' +
      "</div>",
    truncated: !0,
    fullText: i,
  };
}
const buildStory = (e) => {
  if (e && "video" === e.type) {
    const t = ytIdFromAny(e.yt) || String(e.yt || "").trim(),
      n = U.YT_EMBED(t || e.yt),
      r =
        (t ? "https://i.ytimg.com/vi/" + t + "/hqdefault.jpg" : "") ||
        e.img ||
        "";
    return (
      `<div class="story story-video" data-link="${esc(n)}">` +
      (r ? `<img class="bg" loading="lazy" src="${esc(r)}" alt="">` : "") +
      `<div class="story-play"><i class="uil uil-play"></i></div><div class="avatar-mini"><img loading="lazy" src="${e.avatar || (_advUserById("User0000002") || {}).avatar || _defaultAvatar() || "https://cdn-icons-png.flaticon.com/128/1828/1828843.png"}" alt=""></div><p>${esc(e.title)}</p></div>`
    );
  }
  return `<div class="story" data-link="${esc(e.link)}"><img class="bg" loading="lazy" src="${esc(e.img)}" alt=""><div class="avatar-mini"><img loading="lazy" src="${e.avatar || (_advUserById("User0000002") || {}).avatar || _defaultAvatar() || "https://cdn-icons-png.flaticon.com/128/1828/1828843.png"}" alt=""></div><p>${esc(e.title)}</p></div>`;
};
function renderStories() {
  qs("#stories").innerHTML = STORIES.map(buildStory).join("");
}
function buildLink(e) {
  const t = /未完成/.test(e.desc),
    n = U.ICON_URL(e.icon),
    i = e.url ? `onclick="window.open('${esc(e.url)}','_blank')"` : "";
  return `<div class="link-item" data-title="${esc(e.title)}" data-desc="${esc(e.desc)}" ${i}><div class="link-icon"><img src="${n}" alt=""></div><div class="link-body"><h5>${esc(e.title)}</h5><p class="${t ? "pending" : ""}">${esc(e.desc)}</p></div></div>`;
}
function renderCategories() {
  qs("#quick-categories").innerHTML = Object.keys(QUICK_LINKS)
    .map(
      (e, t) =>
        `<button data-cat="${esc(e)}" class="${0 === t ? "active" : ""}">${esc(e)}</button>`,
    )
    .join("");
}
function renderLinks(e) {
  qs("#links-container").innerHTML =
    (QUICK_LINKS[e] || []).map(buildLink).join("") ||
    '<p style="font-size:.75rem;color:var(--c-text-soft);padding:.5rem;">無資料</p>';
}
function normalizeYtConstants() {
  feedArray.forEach((e) => {
    if ("string" == typeof e.yt) {
      const t = e.yt.trim();
      (/^yt:\s*U\.ELEARNING$/i.test(t) ||
        "U.ELEARNING" === t ||
        t === U.ELEARNING ||
        t.startsWith(U.ELEARNING) ||
        t.includes(U.ELEARNING)) &&
        (e.yt = "U.ELEARNING");
    }
    ("number" != typeof e.shares && (e.shares = 0),
      Array.isArray(e.commentList) || (e.commentList = []),
      Array.isArray(e.likeAvatars) || (e.likeAvatars = []),
      Array.isArray(e.likeName) || (e.likeName = []),
      "number" != typeof e.likes && (e.likes = e.likeName.length));
  });
}
function captionHtmlToText(e) {
  const t = document.createElement("div");
  return (
    (t.innerHTML = e || ""),
    t.querySelectorAll("br").forEach((e) => {
      e.replaceWith(document.createTextNode("\n"));
    }),
    t
      .querySelectorAll(
        "p,div,li,section,article,blockquote,h1,h2,h3,h4,h5,h6,tr",
      )
      .forEach((e) => {
        e && e.appendChild && e.appendChild(document.createTextNode("\n"));
      }),
    (t.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}
function captionCleanLine(e) {
  return String(e || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}
function captionLinesFromHtml(e) {
  return captionHtmlToText(e)
    .split(/\n+/)
    .map(captionCleanLine)
    .filter(Boolean);
}
function captionLooksLikeBulletLine(e) {
  return /^\s*(?:[█•●○◆◇■□▪▫▶▷▸▹✓✔★☆＋+]|[-–—]|(?:\d{1,3}|[A-Za-z])(?:[\.、\)）]))\s*/.test(
    String(e || ""),
  );
}
function captionStripBulletMarker(e) {
  return captionCleanLine(
    String(e || "").replace(
      /^\s*(?:[█•●○◆◇■□▪▫▶▷▸▹✓✔★☆＋+]|[-–—]|(?:\d{1,3}|[A-Za-z])(?:[\.、\)）]))\s*/,
      "",
    ),
  ).trim();
}
function captionParagraphsHtml(e) {
  return (e || [])
    .map((e) => captionCleanLine(e))
    .filter(Boolean)
    .map((e) => `<p>${esc(e)}</p>`)
    .join("");
}
function beautifyBlockCaptionHtml(e) {
  const t = captionHtmlToText(e);
  if ((t.match(/█/g) || []).length < 2) return "";
  const n = t
    .split(/█+/)
    .map((e) => e.trim())
    .filter(Boolean);
  if (n.length < 2) return "";
  let i = "";
  const r = n.slice();
  r.length &&
    !/^(?:主題|講師|摘要|重點|項目|附件|說明|內容)(?:\s|[:：/／]|$)/.test(
      r[0].split(/\n+/)[0] || "",
    ) &&
    (i = r.shift());
  const a = i
      ? `<div class="caption-intro">${esc(i).replace(/\n/g, "<br>")}</div>`
      : "",
    s = r
      .map((e) => {
        const t = e.split(/\n+/).map(captionCleanLine).filter(Boolean);
        if (!t.length) return "";
        let n = captionStripBulletMarker(t.shift()),
          i = t;
        (!i.length && n.length > 42 && ((i = [n]), (n = "重點")),
          n || (n = "重點"));
        const r = captionParagraphsHtml(i);
        return `<div class="caption-section-card"><div class="caption-section-title">${esc(n)}</div>${r ? `<div class="caption-section-body">${r}</div>` : ""}</div>`;
      })
      .filter(Boolean)
      .join("");
  return s ? `<div class="caption-beautified">${a}${s}</div>` : "";
}
function beautifyBulletCaptionHtml(e) {
  const t = captionLinesFromHtml(e);
  if (t.length < 2) return "";
  if (t.filter(captionLooksLikeBulletLine).length < 2) return "";
  const i = [],
    r = [];
  if (
    (t.forEach((e) => {
      if (captionLooksLikeBulletLine(e)) {
        const t = captionStripBulletMarker(e);
        t && r.push(t);
      } else
        r.length
          ? (r[r.length - 1] = (r[r.length - 1] + " " + e).trim())
          : i.push(e);
    }),
    r.length < 2)
  )
    return "";
  const a = void 0,
    s = void 0;
  return `<div class="caption-beautified">${i.length ? `<div class="caption-intro">${esc(i.join("\n")).replace(/\n/g, "<br>")}</div>` : ""}<div class="caption-bullet-list">${r.map((e) => `<div class="caption-bullet-item"><span class="caption-bullet-dot"></span><div class="caption-bullet-text">${esc(e)}</div></div>`).join("")}</div></div>`;
}
function beautifyCaptionHtml(e) {
  const t = String(e || "").trim();
  return t
    ? /<table\b|<iframe\b|<video\b|<audio\b/i.test(t)
      ? ""
      : beautifyBlockCaptionHtml(t) || beautifyBulletCaptionHtml(t) || ""
    : "";
}
function normalizeCaptionMedia(e) {
  const t = document.createElement("div");
  t.innerHTML = e || "";
  const n = t.querySelectorAll("img"),
    i = [];
  n.forEach((e) => {
    if (e.closest(".post-images, .caption-slideshow")) return;
    const t = e.getAttribute("src"),
      n = e.getAttribute("alt") || "";
    (t && i.push({ src: t, alt: n }), e.remove());
  });
  const r = t.innerHTML.trim(),
    a = beautifyCaptionHtml(r) || r,
    s = (e, t, n) => {
      const i = "number" == typeof n && n >= 3 ? ' data-defer="1"' : "";
      return `<img class="lazy-img" loading="lazy" src="${IMG_PLACEHOLDER}" data-src="${esc(e)}"${i} alt="${esc(t)}">`;
    };
  let o = "";
  if (1 === i.length) {
    const e = i[0];
    o = '<div class="post-images">' + s(e.src, e.alt, 0) + "</div>";
  } else if (i.length > 1) {
    const e = [
      "effect-soft-zoom",
      "effect-tilt-glow",
      "effect-film",
      "effect-glass",
      "effect-fade-fog",
      "effect-slide-x",
      "effect-slide-y",
    ];
    o = `<div class="caption-slideshow">${i
      .map((t, n) => {
        return (
          `<div class="slide ${e[n % e.length]}">` +
          s(t.src, t.alt, n) +
          "</div>"
        );
      })
      .join("")}</div>`;
  }
  return { captionHtml: a, imagesHtml: o };
}
function updateCaptionSlideshowHeight(e) {
  if (window.matchMedia("(min-width: 600px)").matches)
    return void (e.style.height = "");
  const t = [...e.querySelectorAll(".slide")];
  if (!t.length) return;
  const n = t.find((e) => e.classList.contains("active")) || t[0];
  let i = 0;
  (t.forEach((e) => {
    const t = e.classList.contains("active");
    t || e.classList.add("active");
    const n = e.offsetHeight;
    (n > i && (i = n), t || e.classList.remove("active"));
  }),
    i > 0 && (e.style.height = i + "px"),
    t.forEach((e) => {
      e.classList.toggle("active", e === n);
    }));
}
function initCaptionSlideshows(e) {
  const t = e && e.querySelectorAll ? e : document,
    n = () => window.matchMedia("(min-width: 600px)").matches;
  (t.querySelectorAll(".caption-slideshow").forEach((e) => {
    if ("1" === e.dataset.slideshowInit) return;
    e.dataset.slideshowInit = "1";
    const t = [...e.querySelectorAll(".slide")];
    if (!t.length) return;
    let i = 0,
      r = n();
    const a = (n) => {
        t.forEach((e, t) => {
          e.classList.toggle("active", t === n);
        });
        const i = t[n]?.querySelector("img[data-src]");
        (i && loadLazyImage(i), updateCaptionSlideshowHeight(e));
      },
      s = () => {
        ((i = (i + 1) % t.length), a(i));
      },
      o = () => {
        (e._captionTimer && clearInterval(e._captionTimer),
          (e._captionTimer = setInterval(s, 4e3)));
      },
      l = () => {
        (e._captionTimer && clearInterval(e._captionTimer),
          (e._captionTimer = null));
      },
      c = () => {
        const t = e.closest && e.closest(".feed");
        return t
          ? [...t.children].find(
              (e) => e.classList && e.classList.contains("feed-actions"),
            ) || t.querySelector(".feed-actions")
          : null;
      },
      d = () => {
        const t = e.nextElementSibling;
        t &&
          t.classList &&
          t.classList.contains("caption-slideshow-more") &&
          t.remove();
        const n = e.closest && e.closest(".feed");
        n &&
          n
            .querySelectorAll(".caption-slideshow-more-btn")
            .forEach((e) => e.remove());
      },
      u = () => {
        if ((d(), !n() || t.length <= 3)) return;
        if ("1" === e.dataset.showMoreOpened) return;
        e.classList.add("more-hidden");
        const i = c();
        if (!i) return;
        const r = document.createElement("button");
        ((r.type = "button"),
          (r.className = "more-btn caption-slideshow-more-btn"),
          (r.dataset.action = "caption-slideshow-more"),
          r.setAttribute("aria-expanded", "false"),
          (r.innerHTML = '<i class="uil uil-angle-down"></i> 顯示更多'),
          r.addEventListener("click", () => {
            ((e.dataset.showMoreOpened = "1"),
              e.classList.remove("more-hidden"),
              eagerLoadDeferredCaptionImages(e),
              r.remove());
          }));
        const a =
          i.querySelector(":scope > .right") || i.querySelector(".right");
        i.insertBefore(r, a || i.firstChild);
      },
      p = () => {
        if (n() || t.length <= 3) return;
        if ("1" === e.dataset.playing) return;
        if (e.querySelector(".caption-slideshow-play")) return;
        const i = document.createElement("button");
        ((i.type = "button"),
          (i.className = "caption-slideshow-play"),
          i.setAttribute("aria-label", "播放更多照片"),
          (i.innerHTML =
            '<span class="icon"><i class="uil uil-play"></i></span>'),
          i.addEventListener("click", (t) => {
            (t.stopPropagation(),
              (e.dataset.playing = "1"),
              i.remove(),
              eagerLoadDeferredCaptionImages(e),
              o());
          }),
          e.appendChild(i));
      };
    (a(0),
      r
        ? (l(), u())
        : t.length <= 3
          ? ((e.dataset.playing = "1"), o())
          : ((e.dataset.playing = "0"), p()),
      e.addEventListener("click", (t) => {
        const i = n(),
          r = t.target && t.target.closest ? t.target.closest("img") : null;
        if (i && r) {
          r.dataset &&
            r.dataset.src &&
            r.src === IMG_PLACEHOLDER &&
            loadLazyImage(r);
          return void openImageLightbox(
            r.dataset && r.dataset.src ? r.dataset.src : r.currentSrc || r.src,
            r.getAttribute("alt") || "",
          );
        }
        i || (s(), "1" === e.dataset.playing && o());
      }),
      t.forEach((t) => {
        const n = t.querySelector("img");
        n &&
          !n.complete &&
          n.addEventListener("load", () => updateCaptionSlideshowHeight(e));
      }),
      window.addEventListener("resize", () => {
        const i = n();
        (i !== r &&
          ((r = i),
          i
            ? (l(), u())
            : (e.classList.contains("more-hidden") &&
                (e.classList.remove("more-hidden"), d()),
              ("1" === e.dataset.playing && t.length > 3) ||
              ("1" === e.dataset.playing && t.length <= 3)
                ? o()
                : (l(), p()))),
          updateCaptionSlideshowHeight(e));
      }));
  }),
    initLazyImages(t));
}
const YT_AI_GLOSSARY = [
    "統計學",
    "描述性統計",
    "統計推論",
    "資料型別",
    "資料呈現",
    "直方圖",
    "長條圖",
    "莖葉圖",
    "圓形圖",
    "散佈圖",
    "類別資料",
    "連續資料",
    "間斷資料",
    "名目資料",
    "序位資料",
    "區間資料",
    "比例資料",
    "平均值",
    "中位數",
    "眾數",
    "變異數",
    "標準差",
    "百分位數",
    "四分位差",
    "常態分佈",
    "機率",
    "隨機變數",
    "母體",
    "樣本",
    "抽樣",
    "信賴區間",
    "虛無假說",
    "對立假說",
    "p-value",
    "T-test",
    "F-test",
    "ANOVA",
    "變異數分析",
    "相關係數",
    "正相關",
    "負相關",
    "線性相關",
    "曲線相關",
    "因果關係",
    "Pearson",
    "Spearman",
    "rank",
    "排序",
    "outlier",
    "離群值",
    "迴歸分析",
    "Linear Regression",
    "Simple Linear Regression",
    "Multiple Linear Regression",
    "殘差",
    "R2",
    "Dummy Variable",
    "勝算比",
    "相對危險",
    "敏感度",
    "特異度",
    "ROC",
  ],
  YT_AI_STOPWORDS = [
    "我們",
    "你們",
    "大家",
    "同學",
    "這個",
    "那個",
    "一個",
    "就是",
    "所以",
    "然後",
    "接下來",
    "其實",
    "可以",
    "可能",
    "如果",
    "因為",
    "但是",
    "這邊",
    "今天",
    "現在",
    "比較",
    "另外",
    "部分",
    "東西",
    "時候",
    "或者",
    "而言",
    "代表",
    "進行",
    "看到",
    "單元小結",
    "單元簡介",
    "小結",
    "簡介",
    "課程",
    "影片",
    "之間",
    "內容",
    "主題",
    "使用",
    "方式",
  ];
function ytAiEscapeRegExp(e) {
  return String(e || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ytAiHasTimedCaption(e) {
  return /\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(
    String(e || ""),
  );
}
function ytAiTimeToSeconds(e) {
  const t = String(e || "")
    .trim()
    .match(/^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/);
  return t
    ? 3600 * Number(t[1]) +
        60 * Number(t[2]) +
        Number(t[3]) +
        Number(("0." + t[4]).slice(0, 5))
    : 0;
}
function ytAiFormatTime(e) {
  e = Math.max(0, Math.floor(Number(e) || 0));
  const t = Math.floor(e / 3600),
    n = Math.floor((e % 3600) / 60),
    i = e % 60,
    r = (e) => String(e).padStart(2, "0");
  return t ? `${t}:${r(n)}:${r(i)}` : `${n}:${r(i)}`;
}
function ytAiShortTitle(e) {
  return (
    String(e || "")
      .replace(/^\s*\d+[.、．-]?\s*/, "")
      .replace(/\s*•\s*$/, "")
      .trim() || "本影片"
  );
}
function ytAiNormalizeQualityText(e) {
  let t = String(e || "");
  if (!t) return "";
  const n = [
    [
      /(^|[^A-Za-z0-9_])SST\s*=\s*SST\s*\+\s*SSE(?![A-Za-z0-9_])/gi,
      "$1SST=SSR+SSE",
    ],
    [
      /(^|[^A-Za-z0-9_])SST\s*=\s*SSE\s*\+\s*SSR(?![A-Za-z0-9_])/gi,
      "$1SST=SSR+SSE",
    ],
    [
      /(^|[^A-Za-z0-9_])SST\s*=\s*SSR\s*\+\s*SSR(?![A-Za-z0-9_])/gi,
      "$1SST=SSR+SSE",
    ],
    [/(^|[^A-Za-z0-9_])MSR\s*\/\s*MSR(?![A-Za-z0-9_])/gi, "$1MSR/MSE"],
    [/(^|[^A-Za-z0-9_])MSR\s*與\s*MSR(?![A-Za-z0-9_])/gi, "$1MSR 與 MSE"],
    [/EI\s*平方[盒和]/gi, "殘差平方和"],
  ];
  n.forEach((e) => {
    t = t.replace(e[0], e[1]);
  });
  [
    ["方差分析", "變異數分析"],
    ["实际", "實際"],
    ["极", "極"],
    ["图", "圖"],
    ["特征", "特徵"],
    ["应", "應"],
    ["均匀", "均勻"],
    ["散布", "散佈"],
    ["残差", "殘差"],
    ["样本", "樣本"],
    ["总体", "母體"],
    ["母体", "母體"],
    ["显著", "顯著"],
    ["数据", "資料"],
    ["变量", "變數"],
    ["线性", "線性"],
    ["回归", "迴歸"],
    ["统计", "統計"],
    ["检定", "檢定"],
    ["假设", "假設"],
    ["函数", "函數"],
    ["标准差", "標準差"],
    ["相关系数", "相關係數"],
    ["预测", "預測"],
    ["调整后", "調整後"],
    ["调整後", "調整後"],
    ["虚拟变量", "虛擬變數"],
    ["變量", "變數"],
    ["整体", "整體"],
  ].forEach((e) => {
    t = t.split(e[0]).join(e[1]);
  });
  return t
    .replace(/T\s*-?\s*test/gi, "T-test")
    .replace(/F\s*-?\s*test/gi, "F-test")
    .replace(/R\s*squared/gi, "R squared");
}
function ytAiStripNoiseSentence(e) {
  let t = String(e || "").trim();
  if (!t) return "";
  const n =
      /我就是想要你|重複口語呼籲|強調強烈的願望|強調強烈願望|簡短句式|決心與渴望|情感表達|強化語言的感染力|學習動機強化|重複句式|字幕提供者|請不吝|點贊|訂閱|轉發|打賞|明鏡|片尾|感謝收看/i,
    i =
      /統計|資料|數據|樣本|母體|平均|中位|變異|標準差|百分位|推論|描述|圖表|方法|分析|指標|變數|分布|分佈|迴歸|回歸|ANOVA|F\s*-?test|T\s*-?test|p\s*-?value|SST|SSR|SSE|MSR|MSE|R\s*\^?2|Dummy|虛擬變數|殘差/i,
    r =
      /我就是想要你|強調強烈的願望|強調強烈願望|簡短句式|決心與渴望|情感表達|強化語言的感染力|重複句式|重複口語呼籲/i;
  if (r.test(t)) return "";
  if (n.test(t) && !i.test(t)) return "";
  if (n.test(t)) {
    let e = t
      .split(/\s+-\s+|[。！？!?；;]+/)
      .map((e) => e.trim())
      .filter(Boolean)
      .filter((e) => !(n.test(e) && !i.test(e)));
    t = e.join("；");
  }
  return n.test(t) && !i.test(t) ? "" : t;
}
function ytAiCleanCueText(e) {
  let t = String(e || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/[\u200b\ufeff]/g, "")
    .replace(/\[[^\]]{1,20}\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t
    ? ((t = ytAiNormalizeQualityText(t)),
      /字幕提供者|請不吝|點贊|訂閱|轉發|打賞|明鏡|片尾|感謝收看/i.test(t)
        ? ""
        : ((t = t
            .replace(
              /^(好|那|所以|接下來|再來|各位同學|同學們?|我們現在)[,，\s]*/,
              "",
            )
            .trim()),
          ytAiStripNoiseSentence(t)))
    : "";
}
function ytAiParseTimedCaption(e, t) {
  const n = String(e || "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n"),
    i =
      /^(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})/,
    r = n.split("\n").map((e) => String(e || "").trim());
  let a = [],
    s = "",
    o = null;
  function l() {
    if (!o) return;
    const e = o.text.map(ytAiCleanCueText).filter(Boolean).join(" ").trim();
    (e && a.push({ start: o.start, end: o.end, text: e }), (o = null));
  }
  for (let e = 0; e < r.length; e++) {
    const t = r[e];
    if (!t) continue;
    const n = t.match(i);
    if (n) {
      (l(),
        (o = {
          start: ytAiTimeToSeconds(n[1]),
          end: ytAiTimeToSeconds(n[2]),
          text: [],
        }));
      continue;
    }
    if (!o) {
      if (!s && !ttsIsSrtIndexLine(t) && !ttsIsSrtTimingLine(t)) {
        const e = ytAiCleanCueText(t);
        e && (s = e);
      }
      continue;
    }
    if (ttsIsSrtIndexLine(t)) {
      let n = e + 1;
      for (; n < r.length && !r[n];) n++;
      if (n < r.length && i.test(r[n])) continue;
    }
    const c = ytAiCleanCueText(t);
    c && o.text.push(c);
  }
  return (
    l(),
    (a = a.filter(
      (e, t, n) =>
        e.text &&
        (!t || e.start !== n[t - 1].start || e.text !== n[t - 1].text),
    )),
    { title: ytAiShortTitle(t || s), cues: a }
  );
}
function ytAiNormalizeSummaryText(e) {
  return ytAiNormalizeQualityText(
    String(e || "")
      .replace(/\r/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .replace(/^[,，。！？；\s]+/, "")
      .trim(),
  );
}
function ytAiTrimText(e, t) {
  if (((e = ytAiNormalizeSummaryText(e)), !t || e.length <= t)) return e;
  let n = e.slice(0, t);
  const i = Math.max(
    n.lastIndexOf("，"),
    n.lastIndexOf("。"),
    n.lastIndexOf("；"),
    n.lastIndexOf(" "),
  );
  return (
    i > 0.55 * t && (n = n.slice(0, i)),
    n.replace(/[，。；、\s]+$/, "") + "…"
  );
}
function ytAiMakeThoughtChunks(e) {
  const t = String(e || "").replace(/\r/g, "\n");
  let n = t
    .split(/[\n。！？；!?]+/)
    .map(ytAiNormalizeSummaryText)
    .filter((e) => e && e.length > 3 && !/^\d+$/.test(e));
  const i = [];
  let r = "";
  if (
    (n.forEach((e) => {
      if (YT_AI_STOPWORDS.includes(e)) return;
      const t = r ? r + "，" + e : e;
      t.length < 55 ? (r = t) : (i.push(t), (r = ""));
    }),
    r &&
      (i.length && r.length < 22 ? (i[i.length - 1] += "，" + r) : i.push(r)),
    !i.length && t.trim())
  ) {
    let e = ytAiNormalizeSummaryText(t);
    for (; e.length;) (i.push(e.slice(0, 90)), (e = e.slice(90)));
  }
  return i;
}
function ytAiPickImportantText(e, t, n = 130) {
  const i = ytAiMakeThoughtChunks(e);
  if (!i.length) return "";
  let a = i
    .map((e, n) => {
      let i = Math.min(e.length, 120) / 12;
      return (
        t.forEach((t) => {
          t && e.toLowerCase().includes(String(t).toLowerCase()) && (i += 7);
        }),
        /定義|目的|方法|重點|例如|代表|檢定|分析|估計|比較|假說|資料|變數|模式|相關|平均|變異|機率|分佈|結論/.test(
          e,
        ) && (i += 4),
        /接下來|再來|看一下|這邊|好同學|各位/.test(e) && (i -= 2),
        { i: n, p: e, score: i }
      );
    })
    .filter((e) => e.p.length > 8)
    .sort((e, t) => t.score - e.score)
    .slice(0, 2)
    .sort((e, t) => e.i - t.i)
    .map((e) => e.p);
  return (a.length || (a = [i[0]]), ytAiTrimText(a.join("；"), n));
}
function ytAiExtractKeywords(e, t, n = 9) {
  const i = {};
  function r(e) {
    if (!(e = String(e || "").trim()) || e.length < 2) return !0;
    if (
      YT_AI_STOPWORDS.includes(e) ||
      YT_AI_STOPWORDS.some((t) => e.includes(t))
    )
      return !0;
    if (/[\u4e00-\u9fff]/.test(e)) {
      if (/^[的了呢啊嗎吧把在和與或而就以來第所]/.test(e)) return !0;
      if (/[的了呢啊嗎吧把在和與或而就以來]$/.test(e)) return !0;
      if (
        /^(以看|來講|地方|這裡|那邊|程度|部分|時候|一樣|不同|很多|一些|所有|目前)$/.test(
          e,
        )
      )
        return !0;
    }
    return !1;
  }
  function a(e, t) {
    r((e = String(e || "").trim())) || (i[e] = (i[e] || 0) + t);
  }
  (YT_AI_GLOSSARY.forEach((t) => {
    const n = new RegExp(ytAiEscapeRegExp(t), "gi"),
      i = String(e || "").match(n);
    i && i.length && a(t, 10 + 3 * i.length);
  }),
    ytAiShortTitle(t)
      .replace(/[（(][^）)]*[）)]/g, "")
      .split(/[\s,，()（）:：/]+/)
      .forEach((e) => a(e, 9)),
    (
      String(e || "").match(
        /[A-Za-z][A-Za-z0-9-]{2,}(?:\s+[A-Za-z][A-Za-z0-9-]{2,})?/g,
      ) || []
    ).forEach((e) => {
      const t = e.trim();
      /^(the|and|with|for|this|that|are|you|our)$/i.test(t) || a(t, 2);
    }));
  const s = {};
  (String(e || "")
    .replace(/[^\u4e00-\u9fff]+/g, " ")
    .split(/\s+/)
    .forEach((e) => {
      if (!(e.length < 2))
        for (let t = 2; t <= 4; t++)
          for (let n = 0; n + t <= e.length; n++) {
            const i = e.slice(n, n + t);
            r(i) || (s[i] = (s[i] || 0) + 1);
          }
    }),
    Object.keys(s)
      .filter((e) => s[e] >= 4)
      .sort((e, t) => s[t] - s[e])
      .slice(0, 16)
      .forEach((e) => a(e, Math.min(8, s[e]))));
  const o = Object.keys(i).sort((e, t) => i[t] - i[e] || t.length - e.length),
    l = [];
  for (const e of o) {
    if (
      (!/[\u4e00-\u9fff]/.test(e) ||
        !l.some(
          (t) => /[\u4e00-\u9fff]/.test(t) && (t.includes(e) || e.includes(t)),
        )) &&
      (l.push(e), l.length >= n)
    )
      break;
  }
  return l;
}
function ytAiMakeSegments(e, t, n) {
  if (!Array.isArray(e) || !e.length) return [];
  const i = Math.max(1, e[e.length - 1].end || e[e.length - 1].start || 1),
    r = i > 900 ? 7 : i > 620 ? 6 : 5,
    a = Math.max(42, Math.min(125, i / r)),
    s = [];
  let o = [],
    l = e[0].start,
    c = 0;
  function d() {
    if (!o.length) return;
    const e = o[o.length - 1].end,
      n = o.map((e) => e.text).join("\n");
    let i = ytAiPickImportantText(n, t, 135);
    (i || (i = ytAiTrimText(n, 125)),
      s.push({ start: l, end: e, raw: n, summary: i }),
      (o = []),
      (c = 0));
  }
  if (
    (e.forEach((e) => {
      (o.length || (l = e.start),
        o.push(e),
        (c += String(e.text || "").length));
      const t = (e.end || e.start) - l,
        n = /[。！？；!?]$/.test(e.text || "");
      ((t >= a && c > 90 && (n || o.length > 8)) || t >= 1.35 * a || c > 430) &&
        d();
    }),
    d(),
    s.length > 8)
  ) {
    const e = [];
    for (let n = 0; n < s.length; n += 2) {
      const i = s[n],
        r = s[n + 1];
      if (!r) {
        e.push(i);
        continue;
      }
      const a = i.raw + "\n" + r.raw;
      e.push({
        start: i.start,
        end: r.end,
        raw: a,
        summary: ytAiPickImportantText(a, t, 150) || ytAiTrimText(a, 145),
      });
    }
    return e.slice(0, 8);
  }
  return s;
}
function ytAiFindKeywordTime(e, t) {
  if (!(e = String(e || "").toLowerCase())) return null;
  const n = (t || []).find((t) =>
    String(t.raw || t.summary || "")
      .toLowerCase()
      .includes(e),
  );
  return n ? Math.floor(n.start || 0) : null;
}
function ytAiSeekNormalizeText(e) {
  return String(e || "")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(
      /[\s\u3000,，。．.!！?？;；:：、"'「」『』（）()\[\]{}<>《》【】\-_+=|\\/`~^$#%@&*…⋯]+/g,
      "",
    );
}
function ytAiSeekNeedles(e) {
  const t = ytAiSeekNormalizeText(e);
  if (!t || t.length < 4) return [];
  const n = [],
    i = (e) => {
      (e = String(e || "")).length >= 4 && !n.includes(e) && n.push(e);
    };
  return (
    i(t.slice(0, Math.min(34, t.length))),
    t.length <= 34 && i(t),
    [30, 24, 18, 14, 10, 7].forEach((e) => {
      if (t.length < e) return;
      const n = Math.max(3, Math.floor(0.55 * e));
      for (let r = 0; r + e <= t.length; r += n) i(t.slice(r, r + e));
      i(t.slice(Math.max(0, t.length - e)));
    }),
    n.sort((e, t) => t.length - e.length).slice(0, 90)
  );
}
function ytAiFindTextTime(e, t, n, i) {
  const r = ytAiSeekNeedles(e);
  if (!r.length) return null;
  const a = ytAiSeekNormalizeText(i);
  let s = null;
  function o(e, t, n) {
    const i = ytAiSeekNormalizeText(t);
    if (!i) return;
    let o = Number(n) || 0;
    for (const e of r)
      i.includes(e) && (o += e.length + (e.length >= 18 ? 8 : 0));
    (a && i.includes(a) && (o += 6),
      o <= 0 ||
        ((e = Math.max(0, Math.floor(Number(e) || 0))),
        (!s || o > s.score || (o === s.score && e < s.start)) &&
          (s = { start: e, score: o })));
  }
  return (
    (Array.isArray(t) ? t : []).forEach((e, t, n) => {
      let i = "";
      for (let r = t; r < Math.min(n.length, t + 5); r++)
        ((i += " " + (n[r].text || "")), o(e.start, i, 18 - 2 * (r - t)));
    }),
    (Array.isArray(n) ? n : []).forEach((e) =>
      o(e.start, (e.raw || "") + " " + (e.summary || ""), 4),
    ),
    s ? s.start : null
  );
}
function ytAiResolveQuestionSeek(e, t, n, i, r) {
  const a = String(t || "").match(/「([^」]{2,80})」/),
    s = a ? a[1] : "";
  let o = ytAiFindTextTime(e, r, i, s);
  if (null != o) return o;
  if (((o = ytAiFindTextTime(t, r, i, s)), null != o)) return o;
  const l = Number(n);
  return isFinite(l) && l > 0 ? Math.floor(l) : null;
}
function ytAiSentenceForKeyword(e, t) {
  if (!(e = String(e || "").trim())) return "";
  const i = ytAiMakeThoughtChunks(t).find((t) =>
    t.toLowerCase().includes(e.toLowerCase()),
  );
  return i ? ytAiTrimText(i, 115) : "";
}
function ytAiQuestionKeyOk(e) {
  return (
    !(!(e = String(e || "").trim()) || e.length < 2) &&
    !/^(影片|課程|內容|主題|方式|部分|問題|地方|來講|以看|這裡|那邊|程度|時候)$/.test(
      e,
    ) &&
    (/[\u4e00-\u9fff]/.test(e)
      ? !/^[的了呢啊嗎吧把在和與或而就以來第所]/.test(e) &&
        !/[的了呢啊嗎吧把在和與或而就以來]$/.test(e)
      : e.length >= 3)
  );
}
function ytAiPairKeyOk(e) {
  return (
    ytAiQuestionKeyOk(e) &&
    !/^(統計學|資料呈現|資料的呈現|資料型別)$/.test(String(e || "").trim())
  );
}
function ytAiBestKeywordInText(e, t) {
  const n = String(e || "").toLowerCase();
  return (
    (t || []).find(
      (e) => ytAiQuestionKeyOk(e) && n.includes(String(e).toLowerCase()),
    ) || ""
  );
}
function ytAiQuestionContextForKey(e, t, n) {
  const i = String(e || "").toLowerCase();
  if (!i) return "";
  const r = ytAiMakeThoughtChunks(t).filter((e) => e.toLowerCase().includes(i));
  if ("統計學" === String(e || "").trim()) {
    const e = r.find((e) =>
      /什麼是統計學|統計學的目的|統計學是|統計學這門/.test(e),
    );
    if (e) return ytAiTrimText(e, 180);
  }
  if (r.length) {
    return ytAiTrimText(
      r
        .map((e, t) => {
          let n = Math.min(e.length, 140) / 18;
          return (
            /定義|意思|是指|叫做|稱為|英文叫|代表/.test(e) && (n += 18),
            /主要|用來|用途|目的|適用|呈現|描述|分析|估計|檢定|預測|判斷|選擇|解決|重點|結論/.test(
              e,
            ) && (n += 14),
            /差異|不同|不一樣|比較|相反|對比|區分|關係|限制|不能|不可以|避免|注意/.test(
              e,
            ) && (n += 12),
            /例如|譬如|假設|舉例/.test(e) && (n += 5),
            /接下來|再來|這邊|好同學|各位|有關|可能|稍微/.test(e) && (n -= 5),
            { c: e, i: t, score: n }
          );
        })
        .sort((e, t) => t.score - e.score || e.i - t.i)[0].c,
      180,
    );
  }
  const a = (n || []).find((e) =>
    String((e.raw || "") + " " + (e.summary || ""))
      .toLowerCase()
      .includes(i),
  );
  return a ? ytAiTrimText(a.summary || a.raw, 180) : "";
}
function ytAiPairContext(e, t, n, i) {
  const r = String(e || "").toLowerCase(),
    a = String(t || "").toLowerCase();
  if (!r || !a) return "";
  function s(e) {
    const t = String(e || "").toLowerCase(),
      n = t.indexOf(r),
      i = t.indexOf(a);
    let s = Math.min(n < 0 ? 1 / 0 : n, i < 0 ? 1 / 0 : i);
    if (!isFinite(s)) return ytAiTrimText(e, 220);
    let o = 0;
    return (
      ["。", "；", "！", "？", "，"].forEach((t) => {
        const n = String(e).lastIndexOf(t, s);
        n >= 0 && s - n < 36 && (o = Math.max(o, n + 1));
      }),
      ytAiTrimText(
        String(e)
          .slice(o)
          .replace(/^\s*(那|所以|而|但是|可是|不過)[，,\s]*/, ""),
        220,
      )
    );
  }
  const l = ytAiMakeThoughtChunks(n).filter((e) => {
    const t = e.toLowerCase();
    return t.includes(r) && t.includes(a);
  });
  if (!l.length) return "";
  return s(
    l
      .map((e, t) => {
        let n = Math.min(e.length, 160) / 20;
        return (
          /差異|不同|不一樣|比較|相反|對比|區分|關係|但是|可是|而|不過|適用|用來/.test(
            e,
          ) && (n += 18),
          /定義|代表|目的|檢定|估計|呈現|描述|主要|解決/.test(e) && (n += 8),
          { c: e, i: t, score: n }
        );
      })
      .sort((e, t) => t.score - e.score || e.i - t.i)[0].c,
  );
}
function ytAiQuestionTitleForKey(e, t) {
  const n = String(e || "").trim(),
    i = String(t || "");
  return /定義|意思|是指|叫做|稱為|英文叫/.test(i)
    ? `「${n}」的核心定義或意思是什麼？`
    : /限制|不能|不可以|避免|注意/.test(i)
      ? `使用或判斷「${n}」時，最需要注意什麼？`
      : /主要|用來|用途|目的|呈現|描述|分析|估計|檢定|預測|解決|適用|選擇|判斷|條件|應該|什麼時候/.test(
            i,
          )
        ? `「${n}」在本片中主要用來說明或解決什麼？`
        : /差異|不同|不一樣|比較|相反|對比|區分|關係/.test(i)
          ? `本片如何區分與「${n}」相關的概念？`
          : `本片提到「${n}」時，要掌握哪個核心觀念？`;
}
function ytAiBuildQuestions(e) {
  const t = e.title || "本影片",
    n = Array.isArray(e.segments) ? e.segments : [],
    i = (e.keywords || []).filter(ytAiQuestionKeyOk),
    r = e.transcript || "",
    a = [];
  function s(t, i, r, s) {
    ((t = ytAiTrimText(
      String(t || "")
        .replace(/\s+/g, " ")
        .trim(),
      120,
    )),
      (i = ytAiTrimText(
        String(i || "")
          .replace(/^答案[:：]?\s*/, "")
          .trim(),
        220,
      )),
      !t ||
        !i ||
        i.length < 10 ||
        /\d{1,2}:\d{2}/.test(t) ||
        /學習目標|時間軸題|填空|＿＿/.test(t) ||
        a.some((e) => e.q === t || e.a === i) ||
        a.push({
          q: t,
          a: i,
          seek: ytAiResolveQuestionSeek(i, t, r, n, e.cues),
          tag: s || "重點",
        }));
  }
  const o = i.filter(ytAiPairKeyOk);
  e: for (let e = 0; e < Math.min(o.length, 6) && a.length < 1; e++)
    for (let t = e + 1; t < Math.min(o.length, 7) && a.length < 1; t++) {
      const i = o[e],
        a = o[t],
        l = ytAiPairContext(i, a, r, n);
      if (l && l.length > 18) {
        s(
          `請說明「${i}」與「${a}」之間的關係或差異。`,
          l,
          ytAiFindKeywordTime(i, n),
          "整合",
        );
        break e;
      }
    }
  i.slice(0, 5).forEach((e) => {
    if (a.length >= 3) return;
    const t = ytAiQuestionContextForKey(e, r, n);
    t && s(ytAiQuestionTitleForKey(e, t), t, ytAiFindKeywordTime(e, n), "概念");
  });
  const l =
    n.find((e) =>
      /適用|選擇|判斷|限制|不能|不可以|需要|避免|注意|重點|結論|檢定|估計|解釋|資料|變數|模式/.test(
        String(e.raw || e.summary || ""),
      ),
    ) || n[0];
  if (a.length < 3 && l) {
    s(
      `遇到「${ytAiBestKeywordInText((l.raw || "") + " " + (l.summary || ""), i) || i[0] || t}」相關題目時，應該根據哪些條件做判斷？`,
      l.summary || e.overview || "",
      l.start,
      "應用",
    );
  }
  const c =
    n
      .slice()
      .reverse()
      .find((e) => String(e.summary || "").length > 12) || n[n.length - 1];
  return (
    a.length < 3 &&
      c &&
      s(
        "學完本片後，最需要帶走的結論或操作重點是什麼？",
        c.summary || e.overview || "",
        c.start,
        "整理",
      ),
    !a.length &&
      e.overview &&
      s(`請整理「${t}」的關鍵概念。`, e.overview, 0, "整理"),
    a.slice(0, 4)
  );
}
function ytAiPanelKey(e) {
  window.__YT_AI_PANEL_DATA__ = window.__YT_AI_PANEL_DATA__ || {};
  if (!e.__ytAiPanelKey) {
    try {
      Object.defineProperty(e, "__ytAiPanelKey", {
        value:
          "ytai-" +
          (window.__YT_AI_PANEL_SEQ__ =
            Number(window.__YT_AI_PANEL_SEQ__ || 0) + 1),
        configurable: !0,
        enumerable: !1,
      });
    } catch (t) {
      e.__ytAiPanelKey =
        "ytai-" +
        (window.__YT_AI_PANEL_SEQ__ =
          Number(window.__YT_AI_PANEL_SEQ__ || 0) + 1);
    }
  }
  return (
    (window.__YT_AI_PANEL_DATA__[e.__ytAiPanelKey] = e),
    e.__ytAiPanelKey
  );
}
function ytAiSplitSegmentSummary(e) {
  const t = String(e || "")
    .replace(/\s+/g, " ")
    .replace(/^\s*[-•▪▫]+\s*/, "")
    .replace(/\s*(?:[-—–]\s*)?…+\s*$/, "")
    .trim();
  if (!t) return [];
  return t
    .split(/\s+(?:[-—–])\s+|(?:^|\s)[•▪▫]\s*/)
    .map((e) => e.replace(/^\s*[-•▪▫]+\s*/, "").trim())
    .filter(Boolean);
}
function ytAiSegmentText(e) {
  return ytAiSplitSegmentSummary(e).map((e) => ytAiTrimText(e, 180));
}
function ytAiSegmentContent(e, t = !1) {
  const n = ytAiSegmentText(e),
    i = n.shift() || "未命名段落",
    r = t ? n.slice(0, 2) : n;
  return `<div class="yt-ai-segment-text"><strong class="yt-ai-segment-heading">${esc(ytAiTrimText(i, t ? 88 : 150))}</strong>${r.length ? `<ul class="yt-ai-point-list">${r.map((e) => `<li>${esc(ytAiTrimText(e, t ? 94 : 180))}</li>`).join("")}</ul>` : ""}</div>`;
}
function ytAiRenderSegments(e, t = !1) {
  return e
    .map(
      (e) =>
        `<div class="yt-ai-segment yt-ai-seek yt-ai-readable" data-ai-seek="${Math.floor(e.start || 0)}" role="button" tabindex="0" aria-label="跳到 ${ytAiFormatTime(e.start)}"><span class="yt-ai-time"><i class="uil uil-play-circle"></i>${ytAiFormatTime(e.start)}</span>${ytAiSegmentContent(e.summary, t)}</div>`,
    )
    .join("");
}
function ytAiOutlineText(e, t = 54) {
  const n = ytAiSegmentText((e && e.summary) || "")[0] || "未命名段落";
  return ytAiTrimText(n, t);
}
function ytAiRenderFullPanelParts(e) {
  const t = e.segments || [],
    n = ytAiRenderSegments(t, !1),
    i =
      t
        .map(
          (e) =>
            `<li><button type="button" class="yt-ai-outline-jump yt-ai-seek" data-ai-seek="${Math.floor(e.start || 0)}" aria-label="跳到 ${ytAiFormatTime(e.start)}"><span class="yt-ai-outline-time">${ytAiFormatTime(e.start)}</span><span>${esc(ytAiOutlineText(e))}</span></button></li>`,
        )
        .join("") || "<li>尚無可建立的學習大綱。</li>",
    r = (Array.isArray(e.questions) ? e.questions : [])
      .map(
        (e, t) =>
          `<details><summary><span>${t + 1}</span>${esc(e.q)}</summary><p>${null != e.seek ? `<button type="button" class="yt-ai-jump" data-ai-seek="${Math.floor(e.seek)}"><i class="uil uil-play"></i> 跳到 ${ytAiFormatTime(e.seek)}</button>` : ""} ${esc(e.a)}</p></details>`,
      )
      .join("");
  return {
    fullSegments: n,
    body: `<div class="yt-ai-grid"><div class="yt-ai-card"><h6><i class="uil uil-lightbulb-alt"></i> 學習大綱</h6><ol class="yt-ai-outline">${i}</ol></div><div class="yt-ai-quiz"><h5><i class="uil uil-question-circle"></i> AI模擬練習</h5>${r}</div></div>`,
  };
}
function ytAiHydratePanel(e) {
  if (!e || "1" === e.dataset.aiHydrated) return;
  const t =
    e.dataset.aiKey &&
    window.__YT_AI_PANEL_DATA__ &&
    window.__YT_AI_PANEL_DATA__[e.dataset.aiKey];
  if (!t) return;
  const n = ytAiRenderFullPanelParts(t),
    i = e.querySelector(".yt-ai-section");
  if (i && !i.querySelector("template[data-ai-segments-full]")) {
    const e = document.createElement("template");
    e.setAttribute("data-ai-segments-full", "");
    e.innerHTML = n.fullSegments;
    i.appendChild(e);
  }
  const r = e.querySelector(".yt-ai-more-body");
  (r && ((r.innerHTML = n.body), (r.dataset.aiLazy = "0")),
    (e.dataset.aiHydrated = "1"));
}
function ytAiRenderCaption(e) {
  const t = e.segments || [],
    n = t.slice(0, Math.min(2, t.length)),
    i = ytAiRenderSegments(n.length ? n : t, !0),
    r = ytAiPanelKey(e);
  return `<div class="yt-ai-panel" data-ai-caption="1" data-ai-key="${esc(r)}"><div class="yt-ai-section"><h5><i class="uil uil-map"></i> AI整理</h5><div class="yt-ai-segments" data-ai-segments="preview">${i}</div><template data-ai-segments-preview>${i}</template></div><div class="yt-ai-more-body" data-ai-lazy="1"></div></div>`;
}
function ytAiCaptionSource(e) {
  return String((e && e.srt) || "") || String((e && e.caption) || "");
}
function ytAiBuildCaptionData(e) {
  if (!e) return null;
  const t = ytAiCaptionSource(e);
  if (!ytAiHasTimedCaption(t)) return null;
  if (e.__ytAiCache && e.__ytAiCache.src === t) return e.__ytAiCache.data;
  const n = ytAiParseTimedCaption(t, e.title);
  if (!n.cues.length) return null;
  const i = n.cues.map((e) => e.text).join("\n"),
    r = ytAiShortTitle(e.title || n.title),
    a = ytAiExtractKeywords(i, r, 12)
      .map((e) =>
        String(e || "")
          .replace(/^#/, "")
          .trim(),
      )
      .filter(
        (e) =>
          e &&
          !/^(?:CCH|彰基|師林)$/i.test(e) &&
          !/可能的投影片|彰基診聊室|解答慧綠|家庭醫學科|林盈利|老師說|能的投影|RAKEL Textbook/.test(
            e,
          ),
      )
      .slice(0, 9),
    s = ytAiMakeSegments(n.cues, a, r),
    o = Math.max(0, n.cues[n.cues.length - 1].end || 0),
    l =
      s[0] && s[0].summary
        ? ytAiTrimText(s[0].summary, 155)
        : ytAiPickImportantText(i, a, 155) || ytAiTrimText(i, 150),
    c = {
      title: r,
      cues: n.cues,
      transcript: i,
      keywords: a,
      segments: s,
      duration: o,
      overview: l,
      questions: [],
    };
  c.questions = ytAiBuildQuestions(c);
  try {
    Object.defineProperty(e, "__ytAiCache", {
      value: { src: t, data: c },
      configurable: !0,
      writable: !0,
      enumerable: !1,
    });
  } catch (n) {
    e.__ytAiCache = { src: t, data: c };
  }
  return c;
}
function buildAiYoutubeCaption(e) {
  const t = ytAiBuildCaptionData(e);
  return t ? ytAiRenderCaption(t) : "";
}
const ELEARNING_FALLBACK_IMAGE =
  "https://elearning.xms.cch.org.tw/sysdata/course/393/8d9a_m.jpg";
function elearningCourseUrlFrom(e, t, n) {
  const i = [];
  try {
    i.push(
      e && e.xmsIDURL,
      e && e.courseLink,
      e && e.link,
      e && e.url,
      e && e.href,
      n,
      t,
      e && e.caption,
      e && e.yt,
    );
  } catch (e) {}
  for (const e of i) {
    const t = String(e || "").trim();
    let n = t.match(/https?:\/\/elearning\.xms\.cch\.org\.tw\/course\/(\d+)/i);
    if (n) return "https://elearning.xms.cch.org.tw/course/" + n[1];
    if (((n = t.match(/(?:^|[?&])courseId=(\d+)|^(\d{3,8})$/i)), n))
      return "https://elearning.xms.cch.org.tw/course/" + (n[1] || n[2]);
  }
  return "";
}
function elearningImageFrom(e, t) {
  const n = [];
  try {
    (e && Array.isArray(e.slides) && e.slides.forEach((e) => n.push(e)),
      e && Array.isArray(e.images) && e.images.forEach((e) => n.push(e)),
      e && n.push(e.courseImage, e.image, e.img, e.thumb, e.thumbnail));
  } catch (e) {}
  const i =
    String(t || "").match(/<img\b[^>]*\bsrc=(['"])(.*?)\1[^>]*>/i) ||
    String(t || "").match(/<img\b[^>]*\bsrc=([^\s>]+)[^>]*>/i);
  i && n.push(i[2] || i[1] || "");
  return (
    n
      .map((e) =>
        String(e || "")
          .trim()
          .replace(/^['"]|['"]$/g, ""),
      )
      .find((e) => e && !/^data:image\/gif/i.test(e)) ||
    ELEARNING_FALLBACK_IMAGE
  );
}
function cleanElearningCaptionHtml(e) {
  let t = String(e || "");
  return (
    (t = t.replace(/<img\b[^>]*>/gi, "")),
    (t = t.replace(
      /(?:^|\s*<br\s*\/?>(?:\s|&nbsp;)*)課程日期：[^<]*(?:<br\s*\/?>)?/gi,
      "",
    )),
    (t = t.replace(
      /(?:^|\s*<br\s*\/?>(?:\s|&nbsp;)*)課程連結：\s*(?:<a\b[^>]*>[\s\S]*?<\/a>|https?:\/\/elearning\.xms\.cch\.org\.tw\/course\/\d+)[\s\S]*?(?=(?:<br\s*\/?>|$))/gi,
      "",
    )),
    (t = t.replace(
      /(?:<br\s*\/?>\s*)?課程連結：\s*<a\b[^>]*>[\s\S]*?<\/a>\s*(?:<br\s*\/?>)?/gi,
      "",
    )),
    (t = t.replace(/(?:<br\s*\/?>\s*){2,}/gi, "<br>")),
    (t = t
      .replace(/^(?:\s|&nbsp;|<br\s*\/?>)+/gi, "")
      .replace(/(?:\s|&nbsp;|<br\s*\/?>)+$/gi, "")),
    t.trim()
  );
}
function elearningPlainText(e) {
  const t = document.createElement("div");
  return (
    (t.innerHTML = cleanElearningCaptionHtml((e && e.caption) || "")),
    Array.from(t.querySelectorAll("br")).forEach((e) => {
      (e.parentNode &&
        e.parentNode.insertBefore(document.createTextNode("\n"), e),
        e.remove());
    }),
    (t.textContent || "")
      .replace(/課程簡介[:：]?/g, "")
      .replace(/附件[:：]/g, "附件：")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n[ \t]+/g, "\n")
      .trim()
  );
}
function elearningTextChunks(e, t) {
  let n = String(e || "").replace(/\r/g, "\n");
  n = n
    .replace(/[。！？；]/g, (e) => e + "\n")
    .replace(/█/g, "\n")
    .replace(/【/g, "\n【");
  let i = n
    .split(/\n+/)
    .map((e) =>
      e
        .replace(/^[-•*\d\.、\s]+/, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);
  i = i.filter(
    (e) => !/^附件：?$/i.test(e) && !/\.(pptx?|pdf|mp4|ecm)\s*\(/i.test(e),
  );
  const r = [];
  return (
    i.forEach((e) => {
      (e = e
        .replace(/^課程摘要[:：]?\s*/, "")
        .replace(/^摘要內容\s*/, "")
        .replace(/^摘要[:：]?\s*/, "")
        .trim()) &&
        (e.length < 8 && r.length
          ? (r[r.length - 1] = (r[r.length - 1] + " " + e).trim())
          : r.some((t) => t === e || t.includes(e) || e.includes(t)) ||
            r.push(e));
    }),
    !r.length && String(t || "").trim() && r.push(String(t).trim()),
    r.slice(0, 8)
  );
}
function elearningNormalizeLabel(e) {
  let t = String(e || "")
    .replace(/\s+/g, "")
    .trim();
  return (
    (t =
      {
        主講人: "講師",
        授課講師: "講師",
        課程摘要: "摘要",
        摘要內容: "摘要",
        課程內容: "內容",
        課程介紹: "介紹",
        課程說明: "說明",
        學習目標: "目標",
        課程目標: "目標",
        適用對象: "對象",
      }[t] || t),
    /^(講師|摘要|內容|介紹|說明|目標|大綱|對象|附件|關鍵字|時數)$/.test(t)
      ? t
      : ""
  );
}
function elearningParseLabelSections(e) {
  let t = captionHtmlToText(e)
    .replace(/^\s*課程簡介[:：]?\s*/, "")
    .replace(/\r/g, "\n");
  t = t
    .replace(/([^\n])\s*(【[^】]{1,16}】)/g, "$1\n$2")
    .replace(/(【[^】]{1,16}】)/g, "\n$1");
  const n = t.split(/\n+/).map(captionCleanLine).filter(Boolean),
    i = [],
    r = [];
  let a = null;
  return (
    n.forEach((e) => {
      const t = e.match(/^【([^】]{1,16})】\s*(.*)$/);
      if (t) {
        const e = elearningNormalizeLabel(t[1]);
        if (e)
          return (
            (a = { title: e, lines: [] }),
            t[2] && a.lines.push(t[2]),
            void i.push(a)
          );
      }
      (e = e.replace(/^課程簡介[:：]?\s*/, "").trim()) &&
        (a ? a.lines.push(e) : r.push(e));
    }),
    { intro: r, sections: i.filter((e) => e.lines && e.lines.some(Boolean)) }
  );
}
function elearningJoinText(e, t) {
  if (((e = String(e || "").trim()), (t = String(t || "").trim()), !e))
    return t;
  if (!t) return e;
  return (
    e +
    (/[\u4e00-\u9fff）)】]$/.test(e) && /^[\u4e00-\u9fff（(【]/.test(t)
      ? ""
      : " ") +
    t
  )
    .replace(/\s+([,.;:!?，。；：！？])/g, "$1")
    .replace(/([（(【])\s+/g, "$1")
    .trim();
}
function elearningLooksHeading(e) {
  const t = String(e || "").trim();
  if (!t || t.length > 70) return !1;
  if (/[。！？!?；;.:：，,]$/.test(t)) return !1;
  if (/^[A-Z][A-Za-z0-9()／\/\-, ]+$/.test(t)) {
    const e = t.split(/\s+/).filter(Boolean);
    return e.length <= 6 && e.some((e) => /^[A-Z]/.test(e));
  }
  return /^[\u4e00-\u9fffA-Za-z0-9\s（）()／\/-]{2,24}$/.test(t);
}
function elearningStartsSentence(e) {
  return /^[A-Z0-9\u4e00-\u9fff「『\"']/.test(String(e || "").trim());
}
function elearningShouldStartParagraph(e, t) {
  const n = String(e || "").trim(),
    i = String(t || "").trim();
  return (
    !(!n || !i) &&
    (!!captionLooksLikeBulletLine(i) ||
      !!(elearningLooksHeading(n) && i.length > 40) ||
      !(!/[。！？!?；;.]$/.test(n) || !elearningStartsSentence(i)))
  );
}
function elearningParagraphsFromLines(e) {
  const t = [];
  let n = "";
  const i = () => {
    const e = captionCleanLine(n);
    (e && t.push(e), (n = ""));
  };
  return (
    (e || []).forEach((e) => {
      if ((e = captionCleanLine(e)))
        return captionLooksLikeBulletLine(e)
          ? (i(), void t.push(captionStripBulletMarker(e)))
          : void (n
              ? elearningShouldStartParagraph(n, e)
                ? (i(), (n = e))
                : (n = elearningJoinText(n, e))
              : (n = e));
    }),
    i(),
    t.filter(Boolean).slice(0, 18)
  );
}
function elearningSectionCardHtml(e, t) {
  const n = elearningParagraphsFromLines(t);
  return n.length
    ? `<div class="caption-section-card elearning-section-card"><div class="caption-section-title">${esc(e)}</div><div class="caption-section-body">${n.map((e) => `<p>${esc(e)}</p>`).join("")}</div></div>`
    : "";
}
function beautifyElearningCaptionHtml(e, t) {
  const n = elearningParseLabelSections(e);
  if (!n.sections.length) return "";
  const i = elearningParagraphsFromLines(n.intro)
      .map((e) => `<p>${esc(e)}</p>`)
      .join(""),
    r = i ? `<div class="caption-intro">${i}</div>` : "",
    a = n.sections
      .map((e) => elearningSectionCardHtml(e.title, e.lines))
      .filter(Boolean)
      .join("");
  return a
    ? `<div class="caption-beautified elearning-caption">${r}${a}</div>`
    : "";
}
function elearningFallbackCaptionHtml(e, t) {
  let n = elearningTextChunks(e, t).filter(Boolean);
  !n.length && String(t || "").trim() && (n = [String(t).trim()]);
  const i = elearningParagraphsFromLines(n).slice(0, 10);
  return i.length
    ? `<div class="caption-beautified elearning-caption">${elearningSectionCardHtml("課程簡介", i)}</div>`
    : "";
}
function elearningCaptionPanelHtml(e, t) {
  return `<div class="yt-ai-panel" data-ai-caption="elearning" data-course-link="${esc(e)}"><div class="yt-ai-section"><h5><i class="uil uil-book-open"></i> 課程簡介</h5><div class="yt-ai-segments" data-ai-segments="preview">${t}</div><template data-ai-segments-preview>${t}</template><template data-ai-segments-full>${t}</template></div></div>`;
}
function buildElearningCourseCaption(e, t) {
  if (
    !(t =
      t || elearningCourseUrlFrom(e, (e && e.caption) || "", (e && e.yt) || ""))
  )
    return "";
  const n = displayFeedTitle(e) || "數位學習課程",
    i = cleanElearningCaptionHtml((e && e.caption) || ""),
    r = beautifyElearningCaptionHtml(i, n) || beautifyCaptionHtml(i);
  if (r) return elearningCaptionPanelHtml(t, r);
  const s = elearningFallbackCaptionHtml(elearningPlainText(e), n);
  return s ? elearningCaptionPanelHtml(t, s) : "";
}
function seekFeedVideo(e, t) {
  t = Math.max(0, Math.floor(Number(t) || 0));
  try {
    TTSPlayer.currentFeed === e && TTSPlayer.cancel();
  } catch (e) {}
  const n = e && e.querySelector ? e.querySelector(".video-wrapper") : null;
  if (!n) return !1;
  e && e.classList && e.classList.add("feed-ai-expanded");
  const i = n.querySelector("video");
  if (i) {
    try {
      ((i.currentTime = t), i.play && i.play());
    } catch (e) {}
    try {
      n.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
    return !0;
  }
  const r = n.querySelector(".yt-lazy");
  if (r) {
    activateYtLazy(r, t, !0);
    try {
      n.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
    return !0;
  }
  const a = n.querySelector("iframe");
  if (a) {
    try {
      (a.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "seekTo", args: [t, !0] }),
        "*",
      ),
        a.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "*",
        ));
    } catch (e) {}
    try {
      const e = new URL(a.src, location.href);
      "1" !== e.searchParams.get("enablejsapi") &&
        (e.searchParams.set("enablejsapi", "1"),
        e.searchParams.set("start", String(t)),
        e.searchParams.set("autoplay", "1"),
        (a.src = e.toString()));
    } catch (e) {}
    try {
      n.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {}
    return !0;
  }
  return !1;
}
function setAiPanelOpen(e, t) {
  if (!e) return;
  ((t = !!t), t && ytAiHydratePanel(e));
  const n = e.querySelector(".yt-ai-segments");
  if (n) {
    const i = t ? "full" : "preview",
      r = e.querySelector(
        t
          ? "template[data-ai-segments-full]"
          : "template[data-ai-segments-preview]",
      );
    if (r && n.dataset.aiSegments !== i) {
      (unwrapTtsWords(n), n.replaceChildren(r.content.cloneNode(!0)), (n.dataset.aiSegments = i));
    }
  }
  e.classList.toggle("is-open", t);
  const i = e.closest(".feed"),
    r =
      (i && i.querySelector("[data-ai-more]")) ||
      e.querySelector("[data-ai-more]");
  (r &&
    ((r.innerHTML = t
      ? '<i class="uil uil-angle-up"></i> 收合'
      : '<i class="uil uil-angle-down"></i> 顯示更多'),
    r.setAttribute("aria-expanded", t ? "true" : "false")),
    i && i.classList.toggle("feed-ai-expanded", t));
}
function initAiYoutubeTools() {
  document.__ytAiToolsBound ||
    ((document.__ytAiToolsBound = !0),
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-ai-more]");
      if (t) {
        const n = t.closest(".feed"),
          i =
            t.closest(".yt-ai-panel") || (n && n.querySelector(".yt-ai-panel"));
        return void (
          i &&
          (e.preventDefault(),
          setAiPanelOpen(i, !i.classList.contains("is-open")))
        );
      }
      const n = e.target.closest("[data-ai-seek]");
      if (!n) return;
      const i = n.closest(".feed");
      if (!i) return;
      const r = Number(n.dataset.aiSeek || 0);
      if (!isFinite(r)) return;
      e.preventDefault();
      const a = n.closest(".yt-ai-panel");
      (a && setAiPanelOpen(a, !0), seekFeedVideo(i, r));
    }),
    document.addEventListener("keydown", (e) => {
      if ("Enter" !== e.key && " " !== e.key) return;
      const t = e.target.closest("[data-ai-more]");
      if (t) return (e.preventDefault(), void t.click());
      const n = e.target.closest("[data-ai-seek]");
      if (!n) return;
      const i = n.closest(".feed");
      if (!i) return;
      e.preventDefault();
      const r = n.closest(".yt-ai-panel");
      (r && setAiPanelOpen(r, !0),
        seekFeedVideo(i, Number(n.dataset.aiSeek || 0)));
    }));
}
function datePartsFromValue(e) {
  const t = String(e || "").trim();
  if (!t) return null;
  let n = t.match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
  if ((n || (n = t.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})[日號]?/)), !n))
    return null;
  const i = Number(n[1]),
    r = Number(n[2]),
    a = Number(n[3]);
  return !isFinite(i) ||
    !isFinite(r) ||
    !isFinite(a) ||
    r < 1 ||
    r > 12 ||
    a < 1 ||
    a > 31
    ? null
    : { y: i, mo: r, d: a };
}
function duplicateDateVariants(e) {
  const t = datePartsFromValue(e);
  if (!t) return [];
  const n = String(t.y),
    i = String(t.mo),
    r = String(t.d),
    a = i.padStart(2, "0"),
    s = r.padStart(2, "0"),
    o = [
      `${n}-${a}-${s}`,
      `${n}/${a}/${s}`,
      `${n}.${a}.${s}`,
      `${n}${a}${s}`,
      `${n}-${i}-${r}`,
      `${n}/${i}/${r}`,
      `${n}.${i}.${r}`,
      `${n}年${i}月${r}日`,
      `${n}年${a}月${s}日`,
      `${n}年${i}月${r}號`,
      `${n} 年 ${i} 月 ${r} 日`,
    ],
    l = t.y - 1911;
  if (l > 0) {
    const e = String(l);
    o.push(
      `${e}-${a}-${s}`,
      `${e}/${a}/${s}`,
      `${e}.${a}.${s}`,
      `${e}-${i}-${r}`,
      `${e}/${i}/${r}`,
      `${e}年${i}月${r}日`,
      `${e}年${a}月${s}日`,
    );
  }
  return o
    .filter((e, t, n) => e && n.indexOf(e) === t)
    .sort((e, t) => t.length - e.length);
}
function stripDuplicateDateFromTitle(e, t) {
  const n = String(e || "")
    .replace(/\s*•\s*$/, "")
    .trim();
  if (!n) return "";
  const i = duplicateDateVariants(t);
  if (!i.length) return n;
  let r = n,
    a = "";
  const s = r.match(/^(?:\s*[【\[\(（][^】\]\)）]{1,28}[】\]\)）]\s*)+/);
  s && ((a = s[0]), (r = r.slice(a.length).trimStart()));
  for (const e of i)
    if (r.startsWith(e)) {
      return (
        (
          a +
          r
            .slice(e.length)
            .replace(/^[\s_\-－–—:：|｜、．.]+/, "")
            .trim()
        )
          .replace(/\s{2,}/g, " ")
          .trim() || n
      );
    }
  return n;
}
function displayFeedTitle(e) {
  return e
    ? stripDuplicateDateFromTitle(e.title || "", e.datetime || e.date || "")
    : "";
}
function buildFeed(e) {
  const t = "U.ELEARNING" === e.yt,
    n = t ? U.ELEARNING : e.yt,
    i = Array.isArray(e.likeAvatars) ? e.likeAvatars : [],
    r = Array.isArray(e.likeName) ? e.likeName.filter(Boolean) : [],
    a = Array.isArray(e.topics) ? e.topics : [],
    s = String(n || "").trim(),
    o = e.caption || "",
    l = elearningCourseUrlFrom(e, o, s),
    c = !!l,
    d = c ? elearningImageFrom(e, o) : "",
    u = t || c ? "" : ytIdFromAny(s),
    p = !c && isVideoFileLike(s),
    f = s.startsWith("http") && !u && !p,
    g = !!(
      t ||
      c ||
      l ||
      ("string" == typeof n && String(n).startsWith(U.ELEARNING))
    ),
    h = c
      ? `<div class="video-wrapper course-video-wrapper" data-course-link="${esc(l)}"><div class="yt-lazy course-lazy" data-course-link="${esc(l)}" role="button" tabindex="0" aria-label="開啟課程連結"><img loading="lazy" src="${esc(d)}" alt=""><div class="yt-play"><i class="uil uil-play"></i></div></div></div>`
      : u
        ? `<div class="video-wrapper" data-yt-id="${esc(u)}"><div class="yt-lazy" data-yt-id="${esc(u)}" role="button" tabindex="0" aria-label="播放影片"><img loading="lazy" src="https://i.ytimg.com/vi/${u}/hqdefault.jpg" alt=""><div class="yt-play"><i class="uil uil-play"></i></div></div></div>`
        : p
          ? `<div class="video-wrapper"><video controls playsinline src="${esc(s)}"></video></div>`
          : "",
    y = stripHtml(o),
    v = /<img\b/i.test(String(o || "")),
    S = ttsCleanDisplayText(y),
    A =
      buildAiYoutubeCaption(e) || (c ? buildElearningCourseCaption(e, l) : ""),
    _ = !!String(e.srt || "").trim(),
    w = !A || _ ? normalizeCaptionMedia(o) : null,
    E = !(!w || !/caption-beautified/.test(w.captionHtml || "")),
    b = !A && !E && y.length > 160;
  let T = "";
  const L = !!(S.length || v || String(e.title || "").trim().length);
  if (A && _ && String(o || "").trim()) {
    const e = w || normalizeCaptionMedia(o);
    T = (e.captionHtml || "") + (e.imagesHtml || "") + A;
  } else if (A) T = A;
  else if (b) {
    T = `<span class="caption-preview">${esc(y.slice(0, 160) + "…").replace(/\n/g, "<br>")}</span><div class="more-btn-row"><button type="button" class="more-btn" data-action="expand-caption">顯示更多</button></div>`;
  } else {
    const e = w || normalizeCaptionMedia(o);
    T = (e.captionHtml || "") + (e.imagesHtml || "");
  }
  const I = L
      ? `<div class="media-player" data-ts="${e.ts}" data-state="idle" aria-label="文字朗讀播放器"><button class="mp-btn mp-play" title="播放/暫停" data-action="play" aria-label="播放或暫停"><i class="uil uil-play"></i></button><div class="mp-timeline" data-action="seek" aria-label="進度條（可點擊調整進度）"><div class="mp-progress"></div></div></div>`
      : "",
    k = a.length
      ? `<div class="feed-topics">${a
          .map((e) => {
            const t = topicColor(e),
              n = t ? ' style="--topic-color:' + esc(t) + '"' : "";
            return `<button type="button" class="topic-pill" data-topic-key="${esc(e)}"${n}>${esc(topicLabel(e))}</button>`;
          })
          .join("")}</div>`
      : "",
    F = "number" == typeof e.likes && isFinite(e.likes) ? e.likes : 0,
    C = Math.max(F, r.length, i.length),
    x = Array.isArray(e.commentList)
      ? e.commentList.length
      : "number" == typeof e.comments
        ? e.comments
        : 0,
    M = "number" == typeof e.shares ? e.shares : 0,
    D = i.map((e) => `<span><img src="${e}" alt=""></span>`).join("");
  let q = "";
  C > 0 &&
    r.length &&
    (g
      ? (q = `本文為AI整理 <b>${r.join("、")}</b> 授課內容`)
      : f
        ? (q = `本文標記 <b>${r.join("、")}</b> 等員`)
        : ((q = `<b>${r.join("、")}</b>`),
          C > r.length && (q += ` 及 <b>其他 ${C.toLocaleString()} 位用戶</b>`),
          (q += " 給貼文星星")));
  const R =
      C > 0
        ? `<div class="liked-by"><div class="like-avatars">${D}</div><p>${q}</p></div>`
        : "",
    P =
      C > 0 && "U.ELEARNING" != e.yt
        ? `<small class="notification-count action-count" data-count-type="likes">${C}</small>`
        : "",
    $ =
      x > 0
        ? `<small class="notification-count action-count" data-count-type="comments">${x}</small>`
        : "",
    N =
      M > 0
        ? `<small class="notification-count action-count" data-count-type="shares">${M}</small>`
        : "",
    O = getCurrentLikeUser(),
    B =
      "U.ELEARNING" != e.yt &&
      Array.isArray(e.likeName) &&
      e.likeName.includes(O.name),
    H =
      "U.ELEARNING" != e.yt
        ? `<span class="like-btn${B ? " active" : ""}" data-action="like"><i class="uil uil-favorite"></i>${P}</span>`
        : "",
    W = f
      ? `<span class="link-btn" data-link="${esc(s)}" style="color:white;background:var(--c-primary);display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;cursor:pointer"><i class="uil-youtube"></i></span>`
      : '<button type="button" class="icon-btn feed-more-btn" data-action="feed-more"><i class="uil uil-ellipsis-h"></i></button>',
    j = A
      ? '<button type="button" class="more-btn" data-ai-more aria-expanded="false"><i class="uil uil-angle-down"></i> 顯示更多</button>'
      : "",
    z =
      x > 0
        ? `<div class="feed-comments" style="display:none;font-size:.8rem;border-top:1px dashed var(--c-border);margin-top:.25rem;">${(Array.isArray(e.commentList) ? e.commentList : []).map(renderCommentItem).join("")}</div>`
        : '<div class="feed-comments" style="display:none;font-size:.8rem;margin-top:.25rem;color:var(--c-text-soft);">無留言</div>',
    G = displayFeedTitle(e),
    K = G ? `${esc(G)} • ${esc(e.date)}` : `${esc(e.date)}`;
  let V = "";
  try {
    const t = e && e.geo,
      n = Number(t && t.lat),
      i = Number(t && t.lon);
    if (isFinite(n) && isFinite(i)) {
      const e = esc(t.name || ""),
        r = esc(t.address || "");
      V =
        '<div class="feed-geo"><div class="feed-geo-head" role="button" tabindex="0" aria-label="顯示地圖" aria-expanded="false"><i class="uil uil-map-marker"></i><div class="feed-geo-text"><div class="t">' +
        (e || "地點") +
        "</div>" +
        (r ? '<div class="s">' + r + "</div>" : "") +
        '</div></div><div class="feed-geo-map" data-lat="' +
        n +
        '" data-lon="' +
        i +
        '"></div></div>';
    }
  } catch (e) {}
  const Q = A
    ? `<div class="feed-ai-main">${h}<div class="caption">${T}</div></div>${V}`
    : `${h}${V}<div class="caption">${T}</div>`;
  return `<div class="${"feed fade-slide" + (A ? " feed-ai-collapsed" : "")}" data-ts="${e.ts || ""}" data-src-file="${esc(e.__srcFile || e.__file || "")}"><div class="feed-header"><div class="avatar"><img src="${e.avatar}" alt=""></div><div class="info"><h3>${esc(e.user)}</h3><small>${K}</small></div>${I}<div class="actions">${W}</div></div>${k}${R}${Q}<div class="feed-actions">${j}<div class="right">${H}<span class="comment-btn" data-action="comment"><i class="uil uil-comment"></i>${$}</span><span class="share-btn" data-action="share"><i class="uil uil-share"></i>${N}</span><span class="bookmark-btn${e.bookmarked ? " is-bookmarked" : ""}" data-action="bookmark"><i class="uil uil-bookmark"></i></span></div></div>${z}</div>`;
}
let mapAdAiCollapsedCount = 0,
  mapAdCursor = 0,
  mapAdPlacesCache = null,
  mapAdPlacesPromise = null;
function resetMapAdInsertion() {
  ((mapAdAiCollapsedCount = 0),
    (mapAdCursor = Math.floor(1e6 * Math.random())));
}
function mapAdPlain(e, t) {
  let n = stripHtml(String(e || ""))
    .replace(/\s+/g, " ")
    .trim();
  return (
    (t = Math.max(20, Number(t || 0) || 160)),
    n.length > t ? n.slice(0, t - 1) + "…" : n
  );
}
function mapAdSplitUrls(e) {
  const t = String(e || "").trim();
  return t
    ? t
        .split(/[\n|]+/)
        .map((e) => e.trim())
        .filter(Boolean)
        .filter((e, t, n) => n.indexOf(e) === t)
    : [];
}
function mapAdNormalizeUrl(e) {
  if (
    !(e = String(e || "")
      .trim()
      .replace(/&amp;/g, "&"))
  )
    return "";
  /^\/\//.test(e) && (e = "https:" + e);
  try {
    return new URL(e, location.href).href;
  } catch (t) {
    return e;
  }
}
function mapAdIsImageUrl(e) {
  return (
    !!(e = mapAdNormalizeUrl(e)) &&
    (/(?:\.(?:jpg|jpeg|png|webp|gif))(?:[?#].*)?$/i.test(e) ||
      /picdn\.gomaji\.com/i.test(e) ||
      /\/uploads\/[^?#]+(?:\.(?:jpg|jpeg|png|webp|gif))(?:[?#].*)?$/i.test(e))
  );
}
function mapAdUrlKey(e) {
  return mapAdNormalizeUrl(e)
    .replace(/[#?].*$/, "")
    .toLowerCase();
}
function mapAdRefLinks(e) {
  const t = new Set(
      (Array.isArray(e && e.__mapAdBorrowedPicUrls)
        ? e.__mapAdBorrowedPicUrls
        : []
      )
        .map(mapAdUrlKey)
        .filter(Boolean),
    ),
    n = new Set(mapAdOwnPicUrls(e).map(mapAdUrlKey).filter(Boolean)),
    i = mapAdSplitUrls(e && e.urls)
      .map(mapAdNormalizeUrl)
      .filter(Boolean)
      .filter((e) => {
        const i = mapAdUrlKey(e);
        return !!i && !(t.has(i) || n.has(i) || mapAdIsImageUrl(e));
      })
      .filter((e, t, n) => n.indexOf(e) === t);
  return i.length
    ? i
        .map(
          (e, t) =>
            `<a href="${esc(e)}" target="_blank" rel="noopener" title="${i.length > 1 ? "參考資料" + (t + 1) : "參考資料"}" aria-label="${i.length > 1 ? "參考資料" + (t + 1) : "參考資料"}"><i class="uil uil-link"></i></a>`,
        )
        .join("")
    : "";
}
function mapAdAdText(e) {
  if (!e) return "";
  const t = [],
    n = String(e.offer_adv || e.offerAdv || "").trim(),
    i = String(e.offer || "").trim(),
    r = String(
      e.offer_price || e.offerPrice || e.offer_price_text || "",
    ).trim(),
    a = /Gomaji|推薦碼|6DA78|\$120/.test(i);
  if (
    (n && t.push(n),
    !i || i === n || (a && (n || r)) || t.push(i),
    r && r !== n && r !== i && t.push(r),
    (!e.isGomaji && !String(e.GomajiIDURL || "").trim()) ||
      t.length ||
      t.push("下載Gomaji app，輸入推薦碼6DA78可獲得$120優惠"),
    !t.length)
  ) {
    const n = [e.name, e.cat, e.address]
      .map((e) => String(e || "").trim())
      .filter(Boolean)
      .join(" · ");
    n && t.push(n);
  }
  return t.join("\n").trim();
}
function mapAdHasAdContent(e) {
  return !(!e || (!mapAdAdText(e) && !String(e.name || "").trim()));
}
function mapAdOfferText(e) {
  return mapAdPlain(mapAdAdText(e), 180);
}
function mapAdShuffle(e) {
  const t = Array.isArray(e) ? e.slice() : [];
  for (let e = t.length - 1; e > 0; e--) {
    const n = Math.floor(Math.random() * (e + 1)),
      i = t[e];
    ((t[e] = t[n]), (t[n] = i));
  }
  return t;
}
function mapAdNormKey(e) {
  return String(e || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[（(].*?[）)]/g, "")
    .replace(/臺/g, "台")
    .toLowerCase();
}
function mapAdSourceKey(e) {
  const t = String(
      (e &&
        (e.__mapAdSource ||
          e.__src ||
          e.source_sqlite ||
          e.source_file ||
          e.source ||
          e.__source_table)) ||
        "",
    ).trim(),
    n =
      t.match(/(?:^|[\\/])?(map\d+)(?:\b|[._\-\/\\])/i) ||
      t.match(/\b(map\d+)\b/i);
  if (n) return n[1].toLowerCase();
  return (
    t
      .toLowerCase()
      .replace(/\.(sqlite|db|sqlite3|js|json)(\?.*)?$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "inline"
  );
}
function mapAdSourceCompare(e, t) {
  const n = String(e || "").match(/^map(\d+)$/i),
    i = String(t || "").match(/^map(\d+)$/i);
  return n && i
    ? Number(n[1]) - Number(i[1])
    : n
      ? -1
      : i
        ? 1
        : String(e || "").localeCompare(String(t || ""), "zh-Hant");
}
function mapAdBucket(e) {
  const r =
      String((e && e.name) || "") +
      " " +
      (String((e && e.offer) || "") + " " + String((e && e.offer_adv) || "")),
    a = String((e && e.cat) || "") + " " + r,
    s = r.replace(/汽車旅館/g, "");
  return /機車|汽車|車業|車行|車輛|輪胎|道路救援|維修保養|洗車|新車|中古車|租車|小客車|OPel|OPEL|GP\s*125|125機車/i.test(
    s,
  )
    ? "vehicle"
    : /WORLD\s*GYM|健身|運動中心|運動館|健身房|體適能|瑜伽|拳擊|壺鈴|游泳|泳池|羽球|球館|精肌|卓越健身|健身工廠|亞樂/i.test(
          r,
        )
      ? "fitness"
      : /美食|餐廳|餐饮|飲食|飲料|甜點|咖啡|火鍋|燒肉|漢堡|披薩|pizza/i.test(a)
        ? "food"
        : /美容|美髮|美甲|SPA|舒壓|肌膚|克麗緹娜|佐登妮絲/i.test(a)
          ? "beauty"
          : /按摩|足湯|養身|整体|推拿/i.test(a)
            ? "massage"
            : /泡湯|溫泉|休息/i.test(a)
              ? "hotspring"
              : /旅遊|住宿|飯店|旅館|民宿/i.test(a)
                ? "travel"
                : /休閒|娛樂|樂園|KTV|農場|遊戲|賞鯨|海洋公園|遊憩/i.test(a)
                  ? "leisure"
                  : "other";
}
function mapAdCollectPicUrls(e, t) {
  const n = [],
    i = (e) => {
      (e = mapAdNormalizeUrl(
        String(e || "")
          .trim()
          .replace(/[\s"'<>]+$/g, ""),
      )) &&
        /^https?:\/\//i.test(e) &&
        mapAdIsImageUrl(e) &&
        (n.includes(e) || n.push(e));
    };
  return (
    (Array.isArray(e) ? e : []).forEach((e) =>
      String(e || "")
        .split(/[\n|,]+/)
        .forEach(i),
    ),
    String(t || "").replace(
      /<img\b[^>]*(?:src|data-src|data-original)=["']([^"']+)["'][^>]*>/gi,
      (e, t) => (i(t), e),
    ),
    String(t || "").replace(
      /https?:\/\/[^\s<>'"]+?\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s<>'"]*)?/gi,
      (e) => (i(e), e),
    ),
    n.slice(0, 6)
  );
}
function mapAdOwnPicUrls(e) {
  if (!e) return [];
  return mapAdCollectPicUrls(
    [
      e.offer_advpicURL,
      e.offer_adv_pic_url,
      e.offerAdvPicURL,
      e.offerADVPicURL,
      e.pic,
      e.picture,
      e.image,
      e.img,
      e.photo,
      e.photoURL,
      e.urls,
      e.url,
      e.link,
      e.links,
    ],
    String(e.offer_adv || e.offerAdv || "") +
      "\n" +
      String(e.offer || "") +
      "\n" +
      String(e.urls || ""),
  );
}
function mapAdTokenSet(e) {
  const t = mapAdNormKey(stripHtml(String(e || ""))),
    n = new Set();
  t.replace(/[a-z0-9]+/gi, (e) => (e.length > 1 && n.add(e), e));
  const i = t.replace(/[^\u3400-\u9fff]/g, "");
  1 === i.length && n.add(i);
  for (let e = 0; e < i.length - 1; e++) n.add(i.slice(e, e + 2));
  for (let e = 0; e < i.length - 2; e++) n.add(i.slice(e, e + 3));
  return n;
}
function mapAdTokenScore(e, t) {
  if (!(e && t && e.size && t.size)) return 0;
  let n = 0;
  return (
    e.forEach((e) => {
      t.has(e) && n++;
    }),
    n / Math.sqrt(e.size * t.size)
  );
}
function mapAdBucketsCompatible(e, t) {
  return (
    (e = String(e || "other")),
    (t = String(t || "other")),
    !e || "other" === e || !t || "other" === t || e === t
  );
}
function mapAdImageMatchScore(e, t) {
  const n = mapAdNormKey(e && e.cat),
    i = mapAdNormKey(t && t.cat),
    r = mapAdBucket(e),
    a = (t && t.bucket) || "other",
    s = mapAdTokenScore(e.__mapAdNameTokens, t && t.nameTokens),
    o = mapAdTokenScore(e.__mapAdOfferTokens, t && t.offerTokens);
  if (!mapAdBucketsCompatible(r, a)) return -1e3;
  let l = 0;
  return (
    r && a && r === a && "other" !== r && (l += 18),
    n &&
      i &&
      (n === i ? (l += 4) : (n.includes(i) || i.includes(n)) && (l += 2)),
    (l += 8 * s),
    (l += 5 * o),
    s + o <= 0 && "other" === r && (l -= 4),
    l
  );
}
function mapAdApplyBorrowedMap0Images(e) {
  e = Array.isArray(e) ? e : [];
  const t = [];
  return (
    e.forEach((e) => {
      const n = mapAdSourceKey(e),
        i = mapAdOwnPicUrls(e);
      "map0" === n &&
        i.length &&
        t.push({
          p: e,
          pics: i,
          cat: String(e.cat || ""),
          bucket: mapAdBucket(e),
          nameTokens: mapAdTokenSet(e.name),
          offerTokens: mapAdTokenSet(mapAdAdText(e)),
        });
    }),
    t.length
      ? (e.forEach((e) => {
          if ("map0" === mapAdSourceKey(e) || mapAdOwnPicUrls(e).length) return;
          ((e.__mapAdNameTokens = mapAdTokenSet(e.name)),
            (e.__mapAdOfferTokens = mapAdTokenSet(mapAdAdText(e))));
          let n = null,
            i = -1 / 0,
            r = null,
            a = -1 / 0,
            s = null,
            o = -1 / 0;
          const l = mapAdNormKey(e && e.cat);
          for (const c of t) {
            const t = mapAdImageMatchScore(e, c);
            (t > o && ((o = t), (s = c)),
              l &&
                mapAdNormKey(c && c.cat) === l &&
                t > a &&
                ((a = t), (r = c)),
              t > -900 && t > i && ((i = t), (n = c)));
          }
          const c = n || r || s;
          (c &&
            c.pics &&
            c.pics.length &&
            ((e.__mapAdBorrowedPicUrls = c.pics.slice(0, 6)),
            (e.__mapAdBorrowedFrom = String((c.p && c.p.name) || ""))),
            delete e.__mapAdNameTokens,
            delete e.__mapAdOfferTokens);
        }),
        e)
      : e
  );
}
function buildBalancedMapAdDeck(e) {
  const t = (Array.isArray(e) ? e : []).filter(
      (e) => e && mapAdHasAdContent(e),
    ),
    n = [],
    i = new Map();
  for (const e of t) {
    const t = mapAdSourceKey(e),
      r = [
        t,
        mapAdNormKey(e.name),
        mapAdNormKey(e.cat),
        mapAdNormKey(mapAdAdText(e)).slice(0, 120),
      ].join("|");
    if (i.has(r)) {
      const t = i.get(r);
      if (t) {
        const n = isFinite(Number(t.lat)) && isFinite(Number(t.lon)),
          i = isFinite(Number(e.lat)) && isFinite(Number(e.lon));
        (!n && i && ((t.address = e.address), (t.lat = e.lat), (t.lon = e.lon)),
          !mapAdOwnPicUrls(t).length &&
            mapAdOwnPicUrls(e).length &&
            ((t.offer_advpicURL = e.offer_advpicURL), (t.urls = e.urls)));
      }
      continue;
    }
    const a = Object.assign({}, e, { __mapAdSource: t });
    (i.set(r, a), n.push(a));
  }
  mapAdApplyBorrowedMap0Images(n);
  const r = {};
  n.forEach((e) => {
    const t = mapAdSourceKey(e);
    (r[t] || (r[t] = { key: t, items: [], cursor: 0 }), r[t].items.push(e));
  });
  const a = Object.keys(r)
    .filter((e) => r[e].items.length)
    .sort(mapAdSourceCompare);
  a.forEach((e) => {
    r[e].items = mapAdShuffle(r[e].items);
  });
  const s = a.some((e) => "map0" !== e),
    o = a.filter((e) => "map0" !== e);
  let l = [];
  (s
    ? (o.forEach((e) => {
        l.push(e, e);
      }),
      r.map0 && r.map0.items.length && l.push("map0"))
    : a.forEach((e) => {
        l.push(e);
      }),
    l.length || (l = a.slice()));
  const c = {
    __mapAdDeck: 1,
    sources: r,
    sourceKeys: a,
    sourceDeck: l,
    sourceCursor: 0,
    recentKeys: [],
  };
  try {
    window.__MAP_AD_SOURCE_WEIGHTS__ = a.map((e) => ({
      source: e,
      rows: r[e].items.length,
      weightUnits: "map0" === e && s ? 1 : 2,
      deckCount: l.filter((t) => t === e).length,
    }));
  } catch (e) {}
  try {
    window.__MAP_AD_SOURCE_DECK__ = l.slice();
  } catch (e) {}
  return a.length ? c : mapAdShuffle(t);
}
function pickMapAdFromDeck(e) {
  if (!e || !e.__mapAdDeck) return null;
  const t = Array.isArray(e.sourceDeck) ? e.sourceDeck : [];
  if (!t.length) return null;
  for (let n = 0; n < 2 * t.length + 4; n++) {
    const n = t[e.sourceCursor % t.length];
    e.sourceCursor++;
    const i = e.sources && e.sources[n];
    if (!i || !Array.isArray(i.items) || !i.items.length) continue;
    const r = i.items.length;
    let a = null;
    for (let t = 0; t < r; t++) {
      const s = i.items[i.cursor % r];
      i.cursor++;
      const o = [
        n,
        mapAdNormKey(s && s.name),
        mapAdNormKey(mapAdAdText(s)).slice(0, 80),
      ].join("|");
      if (!e.recentKeys || !e.recentKeys.includes(o) || t === r - 1) {
        ((a = s),
          e.recentKeys &&
            (e.recentKeys.push(o),
            e.recentKeys.length > 12 &&
              e.recentKeys.splice(0, e.recentKeys.length - 12)));
        break;
      }
    }
    if (
      (i.cursor % i.items.length === 0 && (i.items = mapAdShuffle(i.items)), a)
    )
      return a;
  }
  const n = Array.isArray(e.sourceKeys) ? e.sourceKeys : [];
  for (const t of n) {
    const n = e.sources && e.sources[t];
    if (n && n.items && n.items.length)
      return n.items[n.cursor++ % n.items.length];
  }
  return null;
}
async function ensureMapAdPlaces() {
  return (
    mapAdPlacesCache ||
    mapAdPlacesPromise ||
    ((mapAdPlacesPromise = Promise.resolve()
      .then(() => window.ensureOsmPlaces && window.ensureOsmPlaces())
      .then(() => {
        let e = [];
        try {
          "function" == typeof window.getOsmAdvertPlaces &&
            (e = window.getOsmAdvertPlaces());
        } catch (t) {
          e = [];
        }
        ((e = (Array.isArray(e) ? e : []).filter(
          (e) => e && mapAdHasAdContent(e),
        )),
          (mapAdPlacesCache = buildBalancedMapAdDeck(e)));
        try {
          window.__MAP_AD_DECK__ = mapAdPlacesCache;
        } catch (e) {}
        return mapAdPlacesCache;
      })
      .catch(() => [])),
    mapAdPlacesPromise)
  );
}
function pickMapAdPlace(e) {
  if (e && e.__mapAdDeck) return pickMapAdFromDeck(e);
  if (!Array.isArray(e) || !e.length) return null;
  const t = e[mapAdCursor % e.length];
  return (mapAdCursor++, t);
}
function mapAdPicUrls(e) {
  const t = mapAdOwnPicUrls(e);
  if (t.length) return t;
  return (
    Array.isArray(e && e.__mapAdBorrowedPicUrls) ? e.__mapAdBorrowedPicUrls : []
  )
    .filter(Boolean)
    .slice(0, 6);
}
function mapAdLines(e) {
  let t = stripHtml(String(e || ""))
    .replace(/\r/g, "\n")
    .replace(/\u3000/g, " ");
  t = t.replace(/\s*→\s*/g, "→").replace(/\s*\$\s*/g, "$");
  let n = t
    .split(/\n+/)
    .map((e) => e.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (n.length < 2) {
    n = t
      .replace(/\s+(?=(?:\d+|[A-JＡ-Ｊ])[\.、)]\s*)/g, "\n")
      .split(/\n+/)
      .map((e) => e.replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }
  n.length < 2 &&
    (n = t
      .split(/(?<=[。；;！？!?])\s*/)
      .map((e) => e.replace(/\s+/g, " ").trim())
      .filter(Boolean));
  const i = [],
    r = new Set();
  for (let e of n) {
    if (((e = e.replace(/^(?:[-*•・]|\d+[.)、])\s*/, "").trim()), !e)) continue;
    if (
      /^(兌換說明|方案內容|適用店家|商品介紹|評價|國旅卡|查看地圖|聯絡店家|預約方式|其他)$/.test(
        e,
      )
    )
      continue;
    if (
      /(?:退費保障政策|兌換券須知|店家服務反映|馬上購買|Google：)/.test(e) &&
      !/(免預約|優惠期間|平假日|內用|外帶)/.test(e)
    )
      continue;
    const t = e.replace(/\s+/g, "").replace(/臺/g, "台").slice(0, 110);
    if (!r.has(t) && (r.add(t), i.push(e), i.length >= 16)) break;
  }
  return i;
}
function mapAdLineKey(e) {
  return String(e || "")
    .replace(/\s+/g, "")
    .replace(/臺/g, "台")
    .replace(/[。；;，,]+$/, "");
}
function mapAdLineCanon(e) {
  return mapAdLineKey(
    stripHtml(String(e || ""))
      .replace(/^[#＃]?\d+\s*/, "")
      .replace(/^官方網站\s*/, "")
      .replace(/^(?:憑員工識別證)?優惠如下[:：]?/, ""),
  );
}
function mapAdIsDupLine(e, t) {
  const n = mapAdLineCanon(e);
  if (!n) return !0;
  for (const e of Array.isArray(t) ? t : []) {
    const t = mapAdLineCanon(e);
    if (!t) continue;
    if (n === t) return !0;
    if (Math.min(n.length, t.length) >= 6 && (n.includes(t) || t.includes(n)))
      return !0;
  }
  return !1;
}
function mapAdUniqueLinesAgainst(e, t, n) {
  const i = [],
    r = new Set();
  for (const a of Array.isArray(e) ? e : mapAdLines(e)) {
    const e = String(a || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!e) continue;
    if (mapAdIsDupLine(e, t)) continue;
    const s = mapAdLineCanon(e).slice(0, 140);
    if (s && !r.has(s) && (r.add(s), i.push(e), n && i.length >= n)) break;
  }
  return i;
}
function mapAdIsPriceLine(e) {
  return /(?:NT\$|NTD\$?|TWD\$?|\$|＄)\s*\d[\d,]*/.test(String(e || ""));
}
function mapAdGomajiPrompt(e) {
  return e && (e.isGomaji || String(e.GomajiIDURL || "").trim())
    ? "下載Gomaji app，輸入推薦碼6DA78可獲得$120優惠"
    : "";
}
function mapAdPlainOfferLine(e) {
  const t = mapAdGomajiPrompt(e);
  if (t) return t;
  const n = String((e && e.offer) || "")
      .split(/\n+/)
      .map((e) => e.trim())
      .filter(Boolean),
    i = String(
      (e && (e.offer_price || e.offerPrice || e.offer_price_text)) || "",
    )
      .split(/\n+/)
      .map((e) => e.trim())
      .filter(Boolean),
    r = mapAdLines(
      String((e && e.offer_adv) || (e && e.offerAdv) || ""),
    ).filter(Boolean),
    a = n.find((e) => !/Gomaji|推薦碼|6DA78|\$120/.test(e));
  return a
    ? stripHtml(a).replace(/\s+/g, " ").trim()
    : i.length
      ? mapAdPlain(i[0], 180)
      : r.length
        ? mapAdPlain(r[0], 180)
        : n.length
          ? stripHtml(n[0]).replace(/\s+/g, " ").trim()
          : "優惠資訊";
}
function mapAdSortedTextLines(e, t) {
  let n = mapAdLines(e).filter((e) => !mapAdIsPriceLine(e));
  const i = new Set(mapAdLines(t).map(mapAdLineKey));
  i.size && (n = n.filter((e) => !i.has(mapAdLineKey(e))));
  const r = new Set();
  n = n.filter((e) => {
    const t = mapAdLineKey(e).slice(0, 100);
    return !(!t || r.has(t)) && (r.add(t), !0);
  });
  const a = (e) => {
    const t = String(e || "");
    return /^(免預約|需預約|預約方式)/.test(t)
      ? 0
      : /優惠期間|平假日|可使用|使用期限|兌換至|內用|外帶|低消|服務費|不得與|不適用|每人每次|限/.test(
            t,
          )
        ? 1
        : /^([A-JＡ-Ｊ]|\d+)[\.、]/.test(t) && !/\s\/\s/.test(t)
          ? 2
          : /買一送一|套餐|方案|組合|二選一|折抵|抵用|消費金額/.test(t) &&
              !/\s\/\s/.test(t)
            ? 3
            : /\s\/\s/.test(t) && t.length > 80
              ? 8
              : /電話：|地址：|營業時間|每週|公休|查看地圖|聯絡店家/.test(t)
                ? 9
                : 5;
  };
  return n.sort((e, t) => a(e) - a(t));
}
function mapAdBulletHtml(e, t) {
  let n = Array.isArray(e) ? e.slice() : mapAdLines(e);
  return (
    t && (n = n.slice(0, t)),
    (n = n.filter(Boolean)),
    n.length
      ? `<ul class="map-ad-bullets">${n.map((e) => `<li class="map-ad-bullet"><span>${esc(e)}</span></li>`).join("")}</ul>`
      : ""
  );
}
function mapAdSummaryDetail(e, t) {
  const n = mapAdSortedTextLines(e, t);
  if (!n.length) return { summary: [], detail: [] };
  const i = Math.min(n.length, 2);
  return { summary: n.slice(0, i), detail: n.slice(i, 12) };
}
function mapAdLooksLikePriceLine(e, t) {
  const n = String(e || "").trim();
  return (
    !!n &&
    (!!/(?:NT\$|NTD\$?|TWD\$?|\$|＄)\s*\d|\d[\d,]*(?:\.\d+)?\s*元|→/.test(n) ||
      !(!t || !/\d+\s*折/.test(n)))
  );
}
function mapAdPriceMeta(e) {
  const n = mapAdLines(
    String((e && (e.offer_price || e.offerPrice || e.offer_price_text)) || ""),
  );
  if (n.length) return mapAdUniqueLinesAgainst(n, [], 4);
  const i = void 0,
    r = void 0;
  return mapAdUniqueLinesAgainst(
    mapAdLines(mapAdAdText(e))
      .filter((e) => mapAdLooksLikePriceLine(e, !1) && !/優惠期間/.test(e))
      .slice(0, 4),
    [],
    4,
  );
}
function mapAdMoneyNumber(e) {
  const t = String(e || "")
    .replace(/,/g, "")
    .match(/([0-9]+(?:\.[0-9]+)?)/);
  return t ? Number(t[1]) : NaN;
}
function mapAdPriceHtml(e) {
  if (
    !(e = String(e || "")
      .replace(/\s*→\s*/g, "→")
      .replace(/\s*\$\s*/g, "$")
      .trim())
  )
    return "";
  const t =
    e.match(
      /(?:NT\$|NTD\$?|TWD\$?|\$|＄)\s*[0-9][0-9,]*(?:\.[0-9]+)?|[0-9][0-9,]*(?:\.[0-9]+)?\s*元/gi,
    ) || [];
  let n = e;
  (t.length &&
    (n = e.slice(0, e.indexOf(t[0])).replace(/[：:，,。；;\s]+$/, "")),
    (n = n.replace(/〈[^〉]*〉/g, "").trim()),
    n.length > 30 && (n = n.slice(0, 29) + "…"));
  let i = "";
  if (t.length >= 2) {
    let e = t[1],
      n = t[0];
    const r = mapAdMoneyNumber(n),
      a = mapAdMoneyNumber(e);
    (isFinite(r) && isFinite(a) && r < a && ((n = t[1]), (e = t[0])),
      (i = `<span class="map-ad-price-values"><STRIKE>${esc(n)}</STRIKE> <strong>${esc(e)}</strong></span>`));
  } else
    1 === t.length
      ? (i = `<span class="map-ad-price-values"><strong>${esc(t[0])}</strong></span>`)
      : ((n = ""),
        (i = `<span class="map-ad-price-values"><strong>${esc(e)}</strong></span>`));
  return `<span class="map-ad-price-item">${n ? `<span class="map-ad-price-title">${esc(n)}</span>` : ""}${i}</span>`;
}
function mapAdPriceListHtml(e) {
  const t = mapAdUniqueLinesAgainst(
    (Array.isArray(e) ? e : mapAdLines(e)).filter(Boolean),
    [],
    4,
  );
  return t.length
    ? `<div class="map-ad-price-list">${t.map(mapAdPriceHtml).filter(Boolean).join("")}</div>`
    : "";
}
function mapAdGalleryHtml(e, t) {
  const n = (Array.isArray(e) ? e : []).filter(Boolean).slice(0, 6);
  return `<div class="map-ad-gallery">${n.length ? `<div class="map-ad-hero" data-map-ad-slideshow="1">${n.map((e, t) => `<img class="map-ad-img${0 === t ? " is-active" : ""}" loading="lazy" src="${esc((e = mapAdNormalizeUrl(e)))}" alt="" data-full-src="${esc(e)}">`).join("")}</div>` : '<div class="map-ad-hero"><div class="map-ad-noimg"><i class="uil uil-pricetag-alt"></i><span>優惠資訊</span></div></div>'}</div>`;
}
function mapAdNoImgHtml() {
  return '<div class="map-ad-noimg"><i class="uil uil-pricetag-alt"></i><span>優惠資訊</span></div>';
}
function setupMapAdImageFallback(e) {
  (e = e && e.querySelectorAll ? e : document)
    .querySelectorAll(
      '.map-ad-hero[data-map-ad-slideshow="1"] img:not([data-map-ad-error-bound="1"])',
    )
    .forEach((e) => {
      ((e.dataset.mapAdErrorBound = "1"),
        e.addEventListener("error", () => {
          const t = e.closest(".map-ad-hero");
          if (!t) return;
          (e.classList.add("is-broken"), (e.style.display = "none"));
          const n = Array.from(t.querySelectorAll("img:not(.is-broken)"));
          (n.length
            ? e.classList.contains("is-active") &&
              n.forEach((e, t) => e.classList.toggle("is-active", 0 === t))
            : (t.removeAttribute("data-map-ad-slideshow"),
              (t.innerHTML = mapAdNoImgHtml())),
            requestAnimationFrame(() =>
              syncMapAdBodyClamp(t.closest(".map-ad-feed") || document),
            ));
        }));
    });
}
let mapAdToggleBound = !1,
  mapAdClampResizeBound = !1,
  mapAdClampRaf = 0;
function clampOneMapAdBody(e) {
  if (!e) return;
  const t = e.querySelector(".map-ad-body");
  if (!t) return;
  const n = e.classList && e.classList.contains("map-ad-expanded"),
    i = e.querySelector('.more-btn[data-action="map-ad-toggle"]'),
    r = !!e.querySelector(
      ".map-ad-details .map-ad-bullet,.map-ad-details .map-ad-detail-text:not(:empty)",
    );
  if (n)
    return (
      t.style.removeProperty("height"),
      t.style.setProperty("max-height", "none", "important"),
      t.style.setProperty("overflow", "visible", "important"),
      void (i && ((i.hidden = !1), i.classList.remove("is-hidden")))
    );
  const a =
      e.querySelector(".map-ad-gallery") || e.querySelector(".map-ad-hero"),
    s = e.querySelector(".map-ad-hero"),
    o =
      Math.ceil(
        (a && a.getBoundingClientRect && a.getBoundingClientRect().height) || 0,
      ) ||
      Math.ceil(
        (s && s.getBoundingClientRect && s.getBoundingClientRect().height) || 0,
      ) ||
      0;
  (t.style.setProperty("max-height", "none", "important"),
    t.style.setProperty("overflow", "visible", "important"));
  const l = Math.ceil(t.scrollHeight || 0),
    c = !!(o && l > o + 3);
  if (
    (o
      ? (t.style.setProperty("height", o + "px", "important"),
        t.style.setProperty("max-height", o + "px", "important"),
        t.style.setProperty("overflow", "hidden", "important"))
      : (t.style.removeProperty("height"),
        t.style.removeProperty("max-height"),
        t.style.setProperty("overflow", "hidden", "important")),
    i)
  ) {
    const e = !(!r && !c);
    ((i.hidden = !e), i.classList.toggle("is-hidden", !e));
  }
}
function syncMapAdBodyClamp(e) {
  ((e = e && e.querySelectorAll ? e : document).classList &&
  e.classList.contains("map-ad-feed")
    ? [e]
    : Array.from(e.querySelectorAll(".map-ad-feed"))
  ).forEach(clampOneMapAdBody);
}
function setupMapAdBodyClamp(e) {
  (syncMapAdBodyClamp((e = e && e.querySelectorAll ? e : document)),
    e
      .querySelectorAll('.map-ad-hero img:not([data-map-ad-clamp-load="1"])')
      .forEach((e) => {
        ((e.dataset.mapAdClampLoad = "1"),
          e.addEventListener("load", () => {
            requestAnimationFrame(() =>
              syncMapAdBodyClamp(e.closest(".map-ad-feed") || document),
            );
          }));
      }),
    mapAdClampResizeBound ||
      ((mapAdClampResizeBound = !0),
      window.addEventListener(
        "resize",
        () => {
          (cancelAnimationFrame(mapAdClampRaf),
            (mapAdClampRaf = requestAnimationFrame(() =>
              syncMapAdBodyClamp(document),
            )));
        },
        { passive: !0 },
      )));
}
function setupMapAdToggle() {
  mapAdToggleBound ||
    ((mapAdToggleBound = !0),
    document.addEventListener(
      "click",
      (e) => {
        const t = e.target.closest('.more-btn[data-action="map-ad-toggle"]');
        if (!t) return;
        const n = t.closest(".map-ad-feed");
        if (!n) return;
        (e.preventDefault(), e.stopPropagation());
        const i = !n.classList.contains("map-ad-expanded");
        (n.classList.toggle("map-ad-expanded", i),
          t.setAttribute("aria-expanded", i ? "true" : "false"),
          (t.innerHTML = i
            ? '<i class="uil uil-angle-up"></i> 收合'
            : '<i class="uil uil-angle-down"></i> 顯示更多'),
          requestAnimationFrame(() => syncMapAdBodyClamp(n)));
      },
      !0,
    ));
}
function setupMapAdSlideshows(e) {
  (e = e && e.querySelectorAll ? e : document)
    .querySelectorAll(
      '.map-ad-hero[data-map-ad-slideshow="1"]:not([data-slideshow-ready="1"])',
    )
    .forEach((e) => {
      const t = Array.from(e.querySelectorAll("img"));
      if (!t.length) return;
      e.dataset.slideshowReady = "1";
      let n = t.findIndex((e) => e.classList.contains("is-active"));
      if (
        (n < 0 && (n = 0),
        t.forEach((e, t) => e.classList.toggle("is-active", t === n)),
        t.length < 2)
      )
        return;
      const i = 2600 + Math.floor(900 * Math.random()),
        r = setInterval(() => {
          document.body.contains(e)
            ? ((n = (n + 1) % t.length),
              t.forEach((e, t) => e.classList.toggle("is-active", t === n)))
            : clearInterval(r);
        }, i);
      e.__mapAdSlideTimer = r;
    });
}
function buildMapAdFeed(e) {
  if (!e) return "";
  const t = Number(e.lat),
    n = Number(e.lon),
    i = isFinite(t) && isFinite(n),
    r = mapAdAdText(e);
  if (!r) return "";
  const a = String(e.name || "").trim() || "彰基優惠",
    s = String(e.cat || "").trim(),
    o = String(e.address || "").trim(),
    l = mapAdRefLinks(e),
    c = mapAdPicUrls(e),
    d = c[0] || "",
    u = mapAdPlainOfferLine(e),
    m = mapAdUniqueLinesAgainst(mapAdPriceMeta(e), [u], 4),
    f = [u].concat(m || []),
    g = mapAdUniqueLinesAgainst(mapAdSortedTextLines(r, m.join("\n")), f, 12),
    h = mapAdPlain(r, 120),
    y = g.length ? [] : mapAdUniqueLinesAgainst(h ? [h] : [], f, 1),
    v = (g.length ? g : y).slice(0, 2),
    S = g.slice(2, 12),
    A = mapAdBulletHtml(v, 2),
    _ = mapAdBulletHtml(S, 10),
    w = !!_,
    E = mapAdGalleryHtml(c, d),
    b = mapAdPriceListHtml(m),
    T = A ? `<div class="map-ad-summary">${A}</div>` : "",
    L = _
      ? `<div class="map-ad-details"><div class="map-ad-detail-text">${_}</div></div>`
      : "",
    C = `<div class="feed-actions map-ad-actions">${`<button type="button" class="more-btn${w ? "" : " is-hidden"}" data-action="map-ad-toggle" aria-expanded="false"${w ? "" : " hidden"}><i class="uil uil-angle-down"></i> 顯示更多</button>`}<div class="right">${l}${i ? `<button type="button" class="osm-map-focus-btn" data-action="osm-focus" data-lat="${t}" data-lon="${n}" data-name="${esc(a)}" data-address="${esc(o)}" title="地圖" aria-label="地圖"><i class="uil uil-location-point"></i></button>` : ""}${'<button type="button" class="osmListBtn" data-action="osm-list" title="清單" aria-label="清單"><i class="uil uil-list-ul"></i></button>'}</div></div>`,
    x =
      "mapad-" +
      String(a).replace(/[^\w\u4e00-\u9fff]+/g, "-") +
      "-" +
      Date.now() +
      "-" +
      Math.floor(1e4 * Math.random()),
    M = mapAdSourceKey(e),
    D = M ? ` title="${esc(M)}"` : "",
    q = `<div class="feed-header map-ad-head"><div class="info"><span class="map-ad-sponsored"><i class="uil uil-megaphone"></i>彰基優惠</span><h3>${esc(a)}</h3><small${D}>${esc(s || "優惠資訊")}</small></div></div>`,
    U = `<div class="map-ad-card">${E}${`<div class="map-ad-body">${`<div class="map-ad-meta"><i class="uil uil-ticket"></i><span>${esc(u)}</span></div>`}${b}${T}</div>`}</div>${L}${C}`;
  return `<div class="feed fade-slide map-ad-feed" data-ts="${esc(x)}" data-map-ad="1" data-map-source="${esc(M)}">${q}<div class="feed-ai-main"><div class="caption map-ad-caption">${U}</div></div></div>`;
}
async function isCourseLearningFeed(e) {
  const t = [
    e && e.__srcFile,
    e && e.__file,
    e && e.__sourceFile,
    e && e.title,
    e && e.caption,
    e && e.srt,
    Array.isArray(e && e.topics) ? e.topics.join(" ") : "",
  ]
    .map((e) => String(e || ""))
    .join(" ");
  return (
    /909092\.(?:sqlite|db|sqlite3)/i.test(t) ||
    /\bbiostat\b|生物統計學|回歸分析|迴歸分析|ANOVA|Multiple\s+linear\s+regression|Linear\s+Regression|Dummy\s+Variable|Regression\s+with\s+binary|洪弘/i.test(
      t,
    )
  );
}
function shouldSuppressMapAdForFeed(e) {
  return !1 !== window.DISABLE_COURSE_MAP_ADS && isCourseLearningFeed(e);
}
async function buildFeedBatchWithMapAds(e) {
  const t = await ensureMapAdPlaces();
  let n = "";
  for (const i of e || []) {
    const e = buildFeed(i);
    if (
      ((n += e),
      !shouldSuppressMapAdForFeed(i) &&
        e.indexOf("feed-ai-collapsed") >= 0 &&
        (mapAdAiCollapsedCount++, mapAdAiCollapsedCount % 4 == 0))
    ) {
      const e = pickMapAdPlace(t);
      e && (n += buildMapAdFeed(e));
    }
  }
  return n;
}
function sortFeedArray() {
  feedArray.sort((e, t) => (t.ts || 0) - (e.ts || 0));
}
let feedScrollAnchorTs = null,
  feedAppending = !1;
function clearRenderedFeeds() {
  qsa(".feed").forEach((e) => {
    "daysCalcFeed" !== e.id && e.remove();
  });
}
async function appendNextFeedBatch() {
  if (feedAppending) return 0;
  if (feedArray.length - feedRenderIndex <= 0)
    return (setSentinelVisible(!1), 0);
  feedAppending = !0;
  const t = feedArray.slice(feedRenderIndex, feedRenderIndex + 12);
  feedRenderIndex += t.length;
  try {
    "function" == typeof window.__loadSqliteFeedBodies &&
      (await window.__loadSqliteFeedBodies(t));
    const e = ensureFeedSentinel(),
      n = await buildFeedBatchWithMapAds(t);
    return (
      e.insertAdjacentHTML("beforebegin", n),
      setupMapAdToggle(),
      setupMapAdSlideshows(document),
      setupMapAdImageFallback(document),
      setupMapAdBodyClamp(document),
      initMediaPlayers(),
      initCaptionSlideshows(document),
      initLazyImages(document),
      initFeedGeoMaps(document),
      applyAllFilters(),
      setSentinelVisible(feedRenderIndex < feedArray.length),
      t.length
    );
  } finally {
    feedAppending = !1;
  }
}
function resetInfiniteFeedObserver() {
  const e = ensureFeedSentinel();
  (feedInfiniteObserver && feedInfiniteObserver.disconnect(),
    "IntersectionObserver" in window &&
      ((feedInfiniteObserver = new IntersectionObserver(
        (e) => {
          e.some((e) => e.isIntersecting) && appendNextFeedBatch();
        },
        { root: null, rootMargin: "900px 0px", threshold: 0 },
      )),
      feedInfiniteObserver.observe(e)));
}
async function renderAllFeeds() {
  normalizeYtConstants();
  let e = null;
  if (null != feedScrollAnchorTs) {
    const t = document.querySelector(
      `.feed[data-ts="${CSS.escape(String(feedScrollAnchorTs))}"]`,
    );
    t && (e = t.getBoundingClientRect().top);
  }
  if (
    (clearRenderedFeeds(),
    sortFeedArray(),
    resetMapAdInsertion(),
    (feedRenderIndex = 0),
    setSentinelVisible(!0),
    await appendNextFeedBatch(),
    null != feedScrollAnchorTs)
  ) {
    const e = feedArray.findIndex(
      (e) => String(e.ts) === String(feedScrollAnchorTs),
    );
    if (e >= 0)
      for (; feedRenderIndex <= e;) {
        if (!(await appendNextFeedBatch())) break;
      }
  }
  if (null != feedScrollAnchorTs && null !== e) {
    const t = document.querySelector(
      `.feed[data-ts="${CSS.escape(String(feedScrollAnchorTs))}"]`,
    );
    if (t && null !== t.offsetParent) {
      const i = t.getBoundingClientRect().top - e;
      0 !== i && window.scrollBy({ top: i, left: 0 });
    }
  }
  feedScrollAnchorTs = null;
  try {
    updateOsmFeedIndexFromFeedArray();
  } catch (e) {}
  resetInfiniteFeedObserver();
}
function openFeedCommentsInEl(e) {
  if (!e) return;
  const t = qs(".feed-comments", e);
  (t && (t.style.display = "block"),
    e.classList.add("feed-highlight"),
    setTimeout(() => {
      try {
        e.classList.remove("feed-highlight");
      } catch (e) {}
    }, 1600));
}
window.openFeedCommentByTs = function (e) {
  if (!(e = String(e || "").trim())) return;
  let t = 0;
  try {
    const e = document.getElementById("app_map"),
      n = document.getElementById("osmMapFullscreenBtn");
    document.body.classList.contains("osm-no-scroll") &&
      e &&
      e.classList.contains("osm-fullscreen") &&
      n &&
      (n.click(), (t = 160));
  } catch (e) {}
  const n = async () => {
    let t = document.querySelector(`.feed[data-ts="${CSS.escape(e)}"]`);
    if (
      (t ||
        ((feedScrollAnchorTs = e),
        await renderAllFeeds(),
        (t = document.querySelector(`.feed[data-ts="${CSS.escape(e)}"]`))),
      t)
    ) {
      try {
        t.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        try {
          window.scrollTo(
            0,
            t.getBoundingClientRect().top + window.scrollY - 12,
          );
        } catch (e) {}
      }
      openFeedCommentsInEl(t);
    }
  };
  t ? setTimeout(n, t) : n();
};
const buildAdvUserItem = (e) =>
  `<label data-id="${esc(e.id)}"><input type="radio" name="advUserPreset" value="${esc(e.id)}" data-name="${esc(e.name)}" data-avatar="${esc(e.avatar)}"${e.default ? " checked" : ""}><img src="${esc(e.avatar)}" alt="${esc(e.name)}"><span>${esc(e.name)}</span></label>`;
function renderAdvUsers() {
  qs("#advUserList").innerHTML = ADV_USERS.map(buildAdvUserItem).join("");
}
function ensureNotifPopup() {
  let e = qs("#notifPopup");
  return (
    e ||
      ((e = d.createElement("div")),
      (e.id = "notifPopup"),
      (e.className = "notifications-popup"),
      d.body.appendChild(e)),
    e
  );
}
function renderNotifs() {
  const e = ensureNotifPopup();
  if (!e) return;
  const t =
    "function" == typeof getSystemNotifs ? getSystemNotifs() : SYSTEM_NOTIFS;
  e.innerHTML = t
    .map(
      (e) =>
        `<div class="notice"><img src="${e.img}" alt=""><div>${e.html}</div></div>`,
    )
    .join("");
}
let advSavedRange = null;
function saveAdvSelection() {
  const e = qs("#advEditor");
  if (!e) return;
  const t = window.getSelection();
  if (!t || !t.rangeCount) return;
  const n = t.getRangeAt(0);
  e.contains(n.commonAncestorContainer) && (advSavedRange = n.cloneRange());
}
function restoreAdvSelection() {
  const e = qs("#advEditor");
  if (!e) return !1;
  if ((e.focus(), !advSavedRange)) return !0;
  const t = window.getSelection();
  return !!t && (t.removeAllRanges(), t.addRange(advSavedRange), !0);
}
function _normalizeFontSize(e) {
  return (e = String(e || "").trim())
    ? /^(\d+(?:\.\d+)?)$/.test(e)
      ? e + "px"
      : e
    : "";
}
function applySelectionSpanStyle(e, t) {
  if (!(t = String(t || "").trim())) return;
  "fontSize" === e && (t = _normalizeFontSize(t));
  const n = qs("#advEditor");
  if (!n) return;
  restoreAdvSelection();
  const i = window.getSelection();
  if (!i) return;
  if (!i.rangeCount) {
    const e = document.createRange();
    (e.selectNodeContents(n), e.collapse(!1), i.addRange(e));
  }
  let r = i.getRangeAt(0);
  if (!n.contains(r.commonAncestorContainer)) {
    const e = document.createRange();
    (e.selectNodeContents(n),
      e.collapse(!1),
      i.removeAllRanges(),
      i.addRange(e),
      (r = i.getRangeAt(0)));
  }
  if (r.collapsed) {
    const n = document.createElement("span");
    ((n.style[e] = t),
      n.appendChild(document.createTextNode("​")),
      r.insertNode(n));
    const a = document.createRange();
    return (
      a.setStart(n.firstChild, 1),
      a.collapse(!0),
      i.removeAllRanges(),
      i.addRange(a),
      void saveAdvSelection()
    );
  }
  const a = document.createElement("span");
  ((a.style[e] = t), a.appendChild(r.extractContents()), r.insertNode(a));
  const s = document.createRange();
  (s.selectNodeContents(a),
    s.collapse(!1),
    i.removeAllRanges(),
    i.addRange(s),
    saveAdvSelection());
}
function sanitize(e) {
  e = String(e || "").replace(/\u200b/g, "");
  const t = document.createElement("template");
  t.innerHTML = e;
  const n = new Set([
      "B",
      "STRONG",
      "I",
      "EM",
      "SPAN",
      "BR",
      "P",
      "UL",
      "OL",
      "LI",
      "A",
    ]),
    i = document.createTreeWalker(t.content, NodeFilter.SHOW_ELEMENT);
  for (; i.nextNode();) {
    const e = i.currentNode;
    if (!n.has(e.tagName)) {
      const t = e.parentNode;
      for (; e.firstChild;) t.insertBefore(e.firstChild, e);
      t.removeChild(e);
      continue;
    }
    if (
      ([...e.attributes].forEach((t) => {
        const n = t.name.toLowerCase();
        if (n.startsWith("on")) e.removeAttribute(t.name);
        else if (
          "A" !== e.tagName ||
          ("href" !== n && "target" !== n && "rel" !== n)
        ) {
          if ("style" === n) {
            const t = [
                "color",
                "font-size",
                "font-family",
                "font-weight",
                "font-style",
              ],
              n = [];
            return (
              (e.getAttribute("style") || "").split(";").forEach((e) => {
                let [i, r] = e.split(":");
                i &&
                  r &&
                  t.includes(i.trim().toLowerCase()) &&
                  n.push(i.trim() + ":" + r.trim());
              }),
              void (n.length
                ? e.setAttribute("style", n.join(";"))
                : e.removeAttribute("style"))
            );
          }
          e.removeAttribute(t.name);
        }
      }),
      "A" === e.tagName)
    ) {
      const t = (e.getAttribute("href") || "").trim();
      (t && !/^(https?:|mailto:|tel:)/i.test(t) && e.removeAttribute("href"),
        e.setAttribute("target", "_blank"));
      const n = (e.getAttribute("rel") || "").toLowerCase();
      (n.includes("noopener") && n.includes("noreferrer")) ||
        e.setAttribute("rel", "noopener noreferrer");
    }
  }
  return t.innerHTML;
}
function toggleTheme() {
  const e = document.body,
    t = e.getAttribute("data-theme"),
    n = qs("#themeToggle");
  "dark" === t
    ? (e.removeAttribute("data-theme"),
      localStorage.removeItem("portalTheme"),
      (n.innerHTML = '<i class="uil uil-moon"></i>'))
    : (e.setAttribute("data-theme", "dark"),
      localStorage.setItem("portalTheme", "dark"),
      (n.innerHTML = '<i class="uil uil-sun"></i>'));
}
function rectBottom(e) {
  return e.bottom || e.top + e.height;
}
function positionNotif() {
  const e = qs("#notifications"),
    t = ensureNotifPopup();
  if (!e || !t) return;
  const n = e.getBoundingClientRect();
  ((t.style.display = "flex"),
    (t.style.visibility = "hidden"),
    (t.style.top = "-9999px"),
    (t.style.left = "-9999px"),
    requestAnimationFrame(() => {
      const e = t.offsetWidth;
      let i = rectBottom(n) + 8;
      const r = n.left - 20;
      let a = Math.max(8, Math.min(window.innerWidth - e - 8, r));
      (i + t.offsetHeight > window.innerHeight - 8 &&
        (i = Math.max(n.top - 8 - t.offsetHeight, 8)),
        (t.style.top = i + "px"),
        (t.style.left = a + "px"),
        (t.style.visibility = "visible"));
    }));
}
function updateCountdown() {
  const e = new Date(),
    t = e.getFullYear(),
    i = new Date(e > new Date(t, 10, 1) ? t + 1 : t, 10, 1) - e,
    r = Math.ceil(i / 864e5);
  qs("#countdown-text").innerHTML =
    '<i class="uil uil-clock"></i>倒數 ' + r + " 天";
}
function filterQuickLinksGlobal(e) {
  const t = qs("#links-container"),
    n = qs("#quick-categories");
  if (!e)
    return void qsa(".link-item", t).forEach((e) => (e.style.display = "flex"));
  const i = e.toLowerCase(),
    r = [];
  for (const [e, t] of Object.entries(QUICK_LINKS))
    t.forEach((t) => {
      const n = t.title.toLowerCase(),
        a = t.desc.toLowerCase();
      (n.includes(i) || a.includes(i)) && r.push({ cat: e, title: t.title });
    });
  if (r.length) {
    const e = r.reduce((e, t) => ((e[t.cat] = (e[t.cat] || 0) + 1), e), {});
    let i = Object.keys(e).sort(
      (t, n) =>
        e[n] - e[t] || CAT_PRIORITY.indexOf(t) - CAT_PRIORITY.indexOf(n),
    )[0];
    const a = n.querySelector("button.active");
    if (!a || a.dataset.cat !== i) {
      qsa("button[data-cat]", n).forEach((e) => e.classList.remove("active"));
      const e = n.querySelector(`button[data-cat="${CSS.escape(i)}"]`);
      e && (e.classList.add("active"), renderLinks(i));
    }
    const s = r.filter((e) => e.cat === i).map((e) => e.title);
    qsa(".link-item", t).forEach((e) => {
      e.style.display = s.includes(e.getAttribute("data-title"))
        ? "flex"
        : "none";
    });
    const o = qs(".rightbar");
    return void (o && o.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  qsa(".link-item", t).forEach((e) => {
    const t = e.getAttribute("data-title").toLowerCase(),
      n = e.getAttribute("data-desc").toLowerCase();
    e.style.display = t.includes(i) || n.includes(i) ? "flex" : "none";
  });
}
function applyAllFilters() {
  qsa(".feed").forEach((e) => {
    if ("daysCalcFeed" === e.id) return;
    let t = !0;
    if (activeSearchQuery) {
      let n = e.getAttribute("data-search-text");
      if (!n) {
        const t = void 0,
          i = void 0,
          r = void 0,
          a = void 0;
        ((n = (
          (qs(".feed-header .info h3", e)?.textContent || "") +
          " " +
          (qs(".feed-header .info small", e)?.textContent || "") +
          " " +
          (qs(".caption", e)?.textContent || "") +
          " " +
          (qs(".feed-topics", e)?.textContent || "")
        ).toLowerCase()),
          e.setAttribute("data-search-text", n));
      }
      t = n.includes(activeSearchQuery);
    }
    const n = qsa(".topic-pill", e);
    let i = !0;
    if (activeTopicKey) {
      if (activeTopicKey.endsWith("::")) {
        const e = activeTopicKey.slice(0, -2);
        i = n.some((t) => {
          return (t.dataset.topicKey || "").startsWith(e + "::");
        });
      } else
        i = n.some((e) => {
          const t = e.dataset.topicKey || "",
            n = activeTopicKey.includes("::")
              ? activeTopicKey.split("::").slice(1).join("::")
              : activeTopicKey;
          return t === activeTopicKey || (n && t.endsWith("::" + n));
        });
    }
    let r = !0;
    if (activeBookmarkOnly) {
      const t = getFeedItemByElement(e);
      r = !(!t || !t.bookmarked);
    }
    const a = t && i && r;
    if (((e.style.display = a ? "flex" : "none"), n.length))
      if (activeTopicKey) {
        const e = activeTopicKey.endsWith("::"),
          t = e ? activeTopicKey.slice(0, -2) : "";
        n.forEach((n) => {
          const i = n.dataset.topicKey || "";
          let r;
          if (e) r = i.startsWith(t + "::");
          else {
            const e = activeTopicKey.includes("::")
              ? activeTopicKey.split("::").slice(1).join("::")
              : activeTopicKey;
            r = i === activeTopicKey || (e && i.endsWith("::" + e));
          }
          (n.classList.toggle("active", r), (n.style.display = "inline-flex"));
        });
      } else
        n.forEach((e) => {
          (e.classList.remove("active"), (e.style.display = "inline-flex"));
        });
  });
}
async function ensureFeedsForActiveTopic() {
  if (!activeTopicKey) return;
  if (!Array.isArray(feedArray) || !feedArray.length) return;
  const e = activeTopicKey.endsWith("::"),
    t = e ? activeTopicKey.slice(0, -2) : "",
    n = activeTopicKey.includes("::")
      ? activeTopicKey.split("::").slice(1).join("::")
      : activeTopicKey;
  if (
    qsa(".feed").some((i) => {
      if ("daysCalcFeed" === i.id) return !1;
      const r = qsa(".topic-pill", i);
      return (
        !!r.length &&
        (e
          ? r.some((e) => (e.dataset.topicKey || "").startsWith(t + "::"))
          : r.some((e) => {
              const t = e.dataset.topicKey || "";
              return t === activeTopicKey || (n && t.endsWith("::" + n));
            }))
      );
    })
  )
    return;
  let r = -1;
  for (let i = 0; i < feedArray.length; i++) {
    const a = feedArray[i],
      s = a && Array.isArray(a.topics) ? a.topics : [];
    if (
      e
        ? s.some((e) => String(e || "").startsWith(t + "::"))
        : s.some((e) => {
            const t = String(e || "");
            return t === activeTopicKey || (n && t.endsWith("::" + n));
          })
    ) {
      r = i;
      break;
    }
  }
  if (!(r < 0))
    for (; feedRenderIndex <= r;) {
      if (!(await appendNextFeedBatch())) break;
    }
}
async function setActiveTopicKey(e) {
  const t = e || "";
  activeTopicKey !== t && closeTopicOverview();
  if (
    ((activeTopicKey = t),
    (window.__CURRENT_TOPIC_FILTER_KEY__ = activeTopicKey),
    (feedScrollAnchorTs = null),
    feedInfiniteObserver && feedInfiniteObserver.disconnect(),
    activeTopicKey)
  ) {
    setSentinelVisible(!0);
    let e = !1;
    if ("function" == typeof window.__loadSqliteFeedsForTopic)
      try {
        e = await window.__loadSqliteFeedsForTopic(activeTopicKey);
      } catch (t) {
        e = !1;
      }
    e || (await ensureFeedsForActiveTopic());
  } else if ("function" == typeof window.__restoreSqliteFullFeedIndex)
    try {
      await window.__restoreSqliteFullFeedIndex();
    } catch (e) {}
  (await renderAllFeeds(), applyAllFilters());
}
function ensureCalcFeed() {
  let e = qs("#daysCalcFeed");
  if (!e) {
    const t = qs(".feed"),
      n = `\n      <div class="feed fade-slide" id="daysCalcFeed">\n        <div class="feed-header">\n          <div class="avatar"><img src="${U.ICON(cchCdnUrl("system/9641509.png"))}" alt=""></div>\n          <div class="info">\n            <h3>計算餘藥及天數</h3>\n          </div>\n          <div class="actions">\n            <button class="icon-btn" id="closeDaysCalc"><i class="uil uil-times"></i></button>\n          </div>\n        </div>\n\n        <div class="date-row">\n          <label>剩餘顆數\n            <input type="number" id="dcRemain" step="1" value="0">\n          </label>\n\n          <label>每日次數\n            <input type="number" id="dcNeed" step="1" min="1" value="1">\n          </label>\n        </div>\n        <div class="dc-calendar" id="dcCalendar"></div>\n      </div>`;
    (t
      ? t.insertAdjacentHTML("beforebegin", n)
      : qs("#newPosts").insertAdjacentHTML("afterbegin", n),
      (e = qs("#daysCalcFeed")));
  }
  return qs("#daysCalcFeed");
}
function showMore() {
  if (expanded) return;
  ((expanded = !0),
    (qs("#profile-pic").style.display = "none"),
    (qs("#create-post").style.display = "none"));
  qs("#advancedEditorWrapper").style.display = "flex";
  const t = qs("#advDate");
  t && !t.value && (t.valueAsDate = new Date());
}
function hideMore() {
  if (!expanded || feedEditState.active) return;
  ((expanded = !1),
    (qs("#profile-pic").style.display = "flex"),
    (qs("#create-post").style.display = "flex"));
  qs("#advancedEditorWrapper").style.display = "none";
}
function initFocusToggle() {
  ((qs("#advYoutube").style.display = "none"),
    (qs("#advImages").style.display = "none"));
  const e = qs("#advImageManager");
  e && (e.style.display = "flex");
  const t = qs("#postForm"),
    n = qs("#create-post");
  t &&
    n &&
    (["focus", "click", "pointerdown", "touchstart"].forEach((e) =>
      n.addEventListener(e, () => {
        showMore();
      }),
    ),
    document.addEventListener("mousedown", (e) => {
      if (!expanded) return;
      const n = e.target;
      if (t.contains(n)) return;
      const i = qs("#advUrlFloatBackdrop");
      if (i && i.contains(n)) return;
      const r = qs("#advMediaMenu");
      (r && r.contains(n)) || hideMore();
    }),
    document.addEventListener("keydown", (e) => {
      if ("Escape" === e.key) {
        const e = qs("#advUrlFloatBackdrop");
        if (e && !e.classList.contains("hide")) return;
        const t = qs("#advMediaMenu");
        if (t && "block" === t.style.display) return;
        (hideMore(), n.blur());
      }
    }));
}
function setMainActionText(e) {
  const t = qs("#mainActionText");
  t && (t.textContent = e);
}
function resetMainActionText() {
  if (!mainActionDefaultText) {
    const e = qs("#mainActionText");
    mainActionDefaultText = e ? e.textContent : "";
  }
  setMainActionText(mainActionDefaultText || "");
}
function _feedBasename(e) {
  return String(e || "")
    .split("/")
    .pop()
    .split("?")[0]
    .split("#")[0];
}
function flashMsg(e) {
  if (!(e = String(e || "").trim())) return;
  let t = qs("#toastMsg");
  (t ||
    ((t = d.createElement("div")),
    (t.id = "toastMsg"),
    (t.style.position = "fixed"),
    (t.style.left = "50%"),
    (t.style.bottom = "22px"),
    (t.style.transform = "translateX(-50%)"),
    (t.style.zIndex = "9999"),
    (t.style.background = "rgba(0,0,0,.78)"),
    (t.style.color = "#fff"),
    (t.style.fontSize = ".86rem"),
    (t.style.fontWeight = "700"),
    (t.style.letterSpacing = ".5px"),
    (t.style.padding = ".55rem .85rem"),
    (t.style.borderRadius = "999px"),
    (t.style.boxShadow = "0 14px 40px -18px rgba(0,0,0,.55)"),
    (t.style.opacity = "0"),
    (t.style.transition = "opacity .18s ease, transform .18s ease"),
    d.body.appendChild(t)),
    (t.textContent = e),
    (t.style.opacity = "1"),
    (t.style.transform = "translateX(-50%) translateY(0)"),
    clearTimeout(t._t),
    (t._t = setTimeout(() => {
      ((t.style.opacity = "0"),
        (t.style.transform = "translateX(-50%) translateY(6px)"));
    }, 1800)));
}
function _normalizeNewFeedFileName(e) {
  return (e = String(e || "").trim())
    ? ((e = e.replace(/\s+/g, "")).toLowerCase().endsWith(".sqlite") ||
        (e += ".sqlite"),
      e.includes("/") || e.includes("\\")
        ? ""
        : /^[A-Za-z0-9_-]+\.sqlite$/i.test(e)
          ? e
          : "")
    : "";
}
function _ensureFeedFileExists(e) {
  if (!e) return;
  window.__FEED_SOURCE_MAP__ || (window.__FEED_SOURCE_MAP__ = {});
  const t = window.__FEED_SOURCE_MAP__;
  (Array.isArray(t[e]) || (t[e] = []),
    (window.__FEED_FILES__ && Array.isArray(window.__FEED_FILES__)) ||
      (window.__FEED_FILES__ = []),
    window.__FEED_FILES__.includes(e) || window.__FEED_FILES__.push(e));
  const n = qs("#feedSourceDatalist");
  if (n) {
    if (![...n.querySelectorAll("option")].some((t) => t.value === e)) {
      const t = d.createElement("option");
      ((t.value = e), n.appendChild(t));
    }
  }
}
function _formatLocalDatetime(e) {
  const t = new Date(e);
  if (!isFinite(t)) return "";
  const n = (e) => String(e).padStart(2, "0");
  return (
    t.getFullYear() +
    "-" +
    n(t.getMonth() + 1) +
    "-" +
    n(t.getDate()) +
    " " +
    n(t.getHours()) +
    ":" +
    n(t.getMinutes()) +
    ":" +
    n(t.getSeconds())
  );
}
function _safeDatetimeForFile(e) {
  if (e && "string" == typeof e.datetime) {
    const t = e.datetime.trim();
    if (/^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?$/.test(t))
      return t.includes(" ") ? t : t + " 08:00:00";
  }
  if (e && "string" == typeof e.date) {
    const t = e.date.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t + " 08:00:00";
    if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(t)) {
      const e = t.split("/");
      return (
        e[0] +
        "-" +
        String(e[1]).padStart(2, "0") +
        "-" +
        String(e[2]).padStart(2, "0") +
        " 08:00:00"
      );
    }
  }
  return e && isFinite(e.ts)
    ? _formatLocalDatetime(Number(e.ts)) || ""
    : _formatLocalDatetime(Date.now());
}
function _safePublisherIdForFile(e) {
  const t =
    (e &&
      (null != e.publisherId
        ? e.publisherId
        : null != e.userId
          ? e.userId
          : null != e.uid
            ? e.uid
            : "")) ||
    "";
  return String(t || "");
}
function _toLikeListForFile(e) {
  if (e && Array.isArray(e.likeList))
    return e.likeList
      .map((e) => ({
        userId: String((e && (e.userId || e.uid || e.id)) || ""),
      }))
      .filter((e) => e.userId);
  let t = [];
  try {
    if (e && Array.isArray(e.likeAvatars) && Array.isArray(ADV_USERS))
      for (let n = 0; n < e.likeAvatars.length; n++) {
        const i = e.likeAvatars[n],
          r = ADV_USERS.find((e) => e && e.avatar === i);
        r && r.id && !t.includes(r.id) && t.push(r.id);
      }
    if (!t.length && e && Array.isArray(e.likeName) && Array.isArray(ADV_USERS))
      for (let n = 0; n < e.likeName.length; n++) {
        const i = e.likeName[n],
          r = ADV_USERS.find((e) => e && e.name === i);
        r && r.id && !t.includes(r.id) && t.push(r.id);
      }
  } catch (e) {}
  return t.map((e) => ({ userId: String(e) }));
}
function _toCommentListForFile(e) {
  return e && Array.isArray(e.commentList)
    ? e.commentList
        .map((t) => {
          if (null == t) return null;
          if ("string" == typeof t)
            return {
              userId: _safePublisherIdForFile(e),
              datetime: _safeDatetimeForFile(e),
              text: String(t),
            };
          if ("object" != typeof t) return null;
          const n =
              null != t.userId
                ? String(t.userId)
                : null != t.publisherId
                  ? String(t.publisherId)
                  : null != t.publisherID
                    ? String(t.publisherID)
                    : "",
            i = null != t.datetime ? String(t.datetime) : "",
            r =
              null != t.text
                ? String(t.text)
                : null != t.comments
                  ? String(t.comments)
                  : null != t.comment
                    ? String(t.comment)
                    : "";
          return {
            userId: n || _safePublisherIdForFile(e),
            datetime: i && i.trim() ? i : _safeDatetimeForFile(e),
            text: r,
          };
        })
        .filter(Boolean)
    : [];
}
function _jsonText(e) {
  try {
    return JSON.stringify(null == e ? null : e);
  } catch (e) {
    return "null";
  }
}
function _sqliteBaseName(e) {
  return String(_feedBasename(e) || "feedarray.sqlite").replace(
    /\.js$/i,
    ".sqlite",
  );
}
function _lineListForSqlite(e) {
  if (null == e || "" === e) return [];
  if (Array.isArray(e))
    return e.map((e) => String(e || "").trim()).filter(Boolean);
  const t = String(e);
  try {
    const e = JSON.parse(t);
    if (Array.isArray(e))
      return e.map((e) => String(e || "").trim()).filter(Boolean);
  } catch (e) {}
  return t
    .split(/\r?\n/)
    .map((e) => e.trim())
    .filter(Boolean);
}
function _uniqLinesForSqlite(e) {
  const t = [];
  return (
    (e || []).forEach((e) => {
      (e = String(e || "").trim()) && !t.includes(e) && t.push(e);
    }),
    t
  );
}
function _joinLinesForSqlite(e) {
  return _uniqLinesForSqlite(e).join("\n");
}
function _splitDatetimeForSqlite(e) {
  const n = String(e || "")
    .trim()
    .match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}:\d{2})(?::\d{2})?)?/);
  let i = "",
    r = "";
  return (
    n && ((i = n[1] || ""), (r = n[2] || ""), "00:00" === r && (r = "")),
    { date: i, time: r }
  );
}
function _stripImgsForSqlite(e) {
  let t = String(e || "");
  const n = [];
  return (
    (t = t.replace(
      /<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi,
      (e, t, i) => (i && n.push(i), ""),
    )),
    (t = t.replace(
      /<img\b[^>]*?\bsrc\s*=\s*([^\s>]+)[^>]*>/gi,
      (e, t) => (t && n.push(String(t).replace(/^['"]|['"]$/g, "")), ""),
    )),
    { html: t.trim(), imgs: _uniqLinesForSqlite(n) }
  );
}
function _extractLinksForSqlite(e) {
  const t = [];
  return (
    String(e || "").replace(
      /<a\b[^>]*?\bhref\s*=\s*(["'])(.*?)\1[^>]*>[\s\S]*?<\/a>/gi,
      (e, n, i) => (i && t.push(i), e),
    ),
    _uniqLinesForSqlite(t)
  );
}
function _xmsIdForSqlite(e) {
  const t = String(e || "")
    .trim()
    .match(
      /elearning\.xms\.cch\.org\.tw\/course\/(\d+)|(?:^|[?&])courseId=(\d+)|^(\d{3,8})$/i,
    );
  return (t && (t[1] || t[2] || t[3])) || "";
}
function _youtubeIdForSqlite(e) {
  const t = String(e || "").trim();
  if (!t) return "";
  if ("U.ELEARNING" === t) return "U.ELEARNING";
  if (_xmsIdForSqlite(t)) return "";
  let n = t.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?[v]=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/i,
  );
  return n
    ? n[1]
    : ((n = t.match(/[?&]v=([A-Za-z0-9_-]{11})/)),
      n ? n[1] : (/^[A-Za-z0-9_-]{11}$/.test(t), t));
}
function _textOnlyForSqlite(e) {
  const t = d.createElement("div");
  return (
    (t.innerHTML = String(e || "")),
    (t.textContent || "").replace(/\s+/g, "").trim()
  );
}
function _isPhotoOnlyForSqlite(e, t, n) {
  if (n && n.isPhotoOnly) return 1;
  if (!t.length) return 0;
  const i = _textOnlyForSqlite(e);
  return i ? (0 === i.indexOf("高清圖片請參考") ? 1 : 0) : 1;
}
function _splitCdnForSqlite(e) {
  const t = [],
    n = [],
    i = String(window.CDNurl || window.CDNURL || "").replace(/\/+$/, "") + "/";
  return (
    (Array.isArray(e) ? e : [e]).forEach((e) => {
      String(e || "")
        .split(/\n|\|/)
        .map((e) => e.trim())
        .filter(Boolean)
        .forEach((e) => {
          i && 0 === e.indexOf(i) ? t.push(e.slice(i.length)) : n.push(e);
        });
    }),
    { ext: [...new Set(n)].join("\n"), cdn: [...new Set(t)].join("\n") }
  );
}
function _sqlUserId(e) {
  if (null == e) return "";
  if ("object" == typeof e)
    return String(
      e.userId || e.publisherID || e.publisherId || e.uid || e.id || "",
    ).trim();
  const t = String(e || "").trim();
  if (!t) return "";
  let n = t.match(
    /['"]?(?:userId|publisherID|publisherId|uid|id)['"]?\s*:\s*['"]([^'"]+)['"]/i,
  );
  return n ? n[1].trim() : ((n = t.match(/User\d{7}/i)), n ? n[0] : t);
}
function _likeIdsForSqlite(e) {
  const t = [];
  function n(e) {
    (e = _sqlUserId(e)) && !t.includes(e) && t.push(e);
  }
  return (
    e && Array.isArray(e.likeList) && e.likeList.forEach(n),
    e &&
      String(e.lecturersID || "").trim() &&
      String(e.lecturersID)
        .split(/[\s,，、|;；]+/)
        .forEach(n),
    t
  );
}
function _imageLikeForSqlite(e) {
  return (
    /\.(?:png|jpe?g|gif|webp|bmp|svg)(?:[?#]|$)/i.test(
      String(e || "").split("?")[0],
    ) || /images\.pexels\.com|sysdata\/course\//i.test(String(e || ""))
  );
}
function _photoRefUrlForSqlite(e) {
  const t = String(e || "");
  let n = t.match(/高清圖片請參考[:：]?\s*<a\b[^>]*?href\s*=\s*(["'])(.*?)\1/i);
  return n
    ? n[2] || ""
    : ((n = t.match(
        /https?:\/\/dpt\.cch\.org\.tw\/layout\/layout_2\/item_detail\.aspx\?[^"'<>\s]+/i,
      )),
      n ? n[0] : "");
}
function _stripPhotoRefForSqlite(e, t) {
  let n = String(e || "");
  return (
    t &&
      ((n = n.replace(/高清圖片請參考[:：]?\s*<a\b[^>]*?>[\s\S]*?<\/a>/gi, "")),
      (n = n.replace(t, ""))),
    n.trim()
  );
}
function _canonicalFeedForSqlite(e) {
  e = e || {};
  const t = [];
  let n = String(e.caption || "").replace(
    /<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi,
    function (e, n) {
      return (t.push(n), "");
    },
  );
  (e.photosURL && t.push(e.photosURL),
    Array.isArray(e.slides) && e.slides.forEach((e) => t.push(e)));
  const i =
    String(e.SlideShowURL || e.slideShowURL || e.slideshowURL || "").trim() ||
    _photoRefUrlForSqlite(n);
  ((n = _stripPhotoRefForSqlite(n, i)), i && (n = ""));
  const r = _splitCdnForSqlite(t),
    a = _lineListForSqlite(r.ext).filter(_imageLikeForSqlite),
    o = String(e.datetime || "")
      .trim()
      .match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/),
    l = (String(e.courseLink || "").match(/\/course\/(\d+)/) || [])[1] || "",
    c = String(e.yt || "").trim(),
    d = "U.ELEARNING" === c || c.indexOf("U.ELEARNING") >= 0,
    u = d
      ? "U.ELEARNING"
      : c.match(/(?:v=|youtu\.be\/|embed\/)?([A-Za-z0-9_-]{11})/)?.[1] || "",
    p =
      String(e.lecturersID || "").trim() ||
      (d || l ? _likeIdsForSqlite(e).join("\n") : "");
  let f = _lineListForSqlite(
    Array.isArray(e.linksURL) ? e.linksURL.join("\n") : e.linksURL || "",
  ).filter((e) => e !== i);
  (!r.cdn && a.length && (f = f.concat(a)), (f = _uniqLinesForSqlite(f)));
  const g = String(e.srt || "").trim();
  return (
    g && (n = ""),
    {
      FID: e.FID || "",
      date: o ? o[1] : "",
      time: o && o[2] && "00:00" !== o[2] ? o[2] : "",
      publisherID: _sqlUserId(e.publisherID || e.publisherId || ""),
      lecturersID: p,
      tagID: e.tagID || "",
      title: e.title || "",
      caption: n,
      srt: g,
      SlideShowURL: i,
      photosCDNURL: r.cdn,
      linksURL: f.join("\n"),
      youtubeIDURL: l ? "" : u,
      xmsIDURL: l,
      topic: Array.isArray(e.topics)
        ? e.topics.join("\n")
        : e.topic || e.topics || "",
    }
  );
}
async function buildFeedSqliteBytes(e, t) {
  await ensureSqlJs();
  const n = new SQL.Database();
  (n.run(
    "CREATE TABLE comments(FID INTEGER, date TEXT, time TEXT, publisherID TEXT, comments TEXT, photosURL TEXT, photosCDNURL TEXT, isLike INTEGER, isShare INTEGER)",
  ),
    n.run(
      "CREATE TABLE feeds(FID INTEGER, date TEXT, time TEXT, publisherID TEXT, lecturersID TEXT, tagID TEXT, title TEXT, caption TEXT, srt TEXT, SlideShowURL TEXT, photosCDNURL TEXT, linksURL TEXT, youtubeIDURL TEXT, xmsIDURL TEXT, topic TEXT)",
    ));
  const i = n.prepare(
      "INSERT INTO feeds VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ),
    r = n.prepare("INSERT INTO comments VALUES(?,?,?,?,?,?,?,?,?)");
  ((e || []).forEach((e, t) => {
    const n = _canonicalFeedForSqlite(e);
    ((n.FID = t + 1),
      i.run([
        n.FID,
        n.date,
        n.time,
        n.publisherID,
        n.lecturersID,
        n.tagID,
        n.title,
        n.caption,
        n.srt,
        n.SlideShowURL,
        n.photosCDNURL,
        n.linksURL,
        n.youtubeIDURL,
        n.xmsIDURL,
        n.topic,
      ]),
      (e.likeList || []).forEach((e) => {
        const t = _sqlUserId(e);
        t && r.run([n.FID, "", "", t, "", "", "", 1, 0]);
      }),
      (e.commentList || []).forEach((e) => {
        const t = _splitCdnForSqlite((e && (e.photosURL || e.photos)) || []),
          i = _sqlUserId(
            e && (e.publisherID || e.publisherId || e.userId || e.uid || e.id),
          ),
          a = String(
            (e &&
              (null != e.comments
                ? e.comments
                : null != e.text
                  ? e.text
                  : e.comment)) ||
              "",
          ),
          s = _splitDatetimeForSqlite((e && (e.datetime || e.date)) || "");
        r.run([n.FID, s.date, s.time, i, a, t.ext, t.cdn, 0, 0]);
      }));
    const a = Number(e.shares || 0);
    for (let e = 0; e < a; e++) r.run([n.FID, "", "", "", "", "", "", 0, 1]);
  }),
    i.free(),
    r.free());
  const a = n.export();
  return (n.close(), a);
}
window.initFeedSourcePicker = function e() {
  const t = qs("#feedSourceInput"),
    n = qs("#feedSourceDatalist");
  if (!t || !n) return;
  let i = [];
  try {
    i = getFeedFilesFromSettings();
  } catch (e) {
    i = [];
  }
  if (
    (window.__FEED_FILES__ &&
      Array.isArray(window.__FEED_FILES__) &&
      (i = i.length
        ? i.concat(window.__FEED_FILES__)
        : window.__FEED_FILES__.slice()),
    Array.isArray(window.__LOCAL_SQLITE_FEED_FILES__) &&
      window.__LOCAL_SQLITE_FEED_FILES__.length &&
      (i = window.__LOCAL_SQLITE_FEED_FILES__.concat(i)),
    !i.length)
  )
    try {
      i = Array.from(d.scripts || [])
        .map(function (e) {
          var t =
              e.getAttribute && e.getAttribute("src")
                ? e.getAttribute("src")
                : "",
            n;
          return String(t || "")
            .split("/")
            .pop()
            .split("?")[0];
        })
        .filter(function (e) {
          return /\.sqlite$/i.test(e);
        });
    } catch (e) {
      i = [];
    }
  i.length ||
    (i = ["1100.sqlite", "909090.sqlite", "909091.sqlite", "909092.sqlite"]);
  if (
    window.__refreshLocalSqliteFeedFiles &&
    !window.__feedSourcePickerLocalPending
  ) {
    window.__feedSourcePickerLocalPending = 1;
    try {
      window
        .__refreshLocalSqliteFeedFiles()
        .then(function () {
          window.__feedSourcePickerLocalPending = 0;
          try {
            window.initFeedSourcePicker();
          } catch (e) {}
        })
        .catch(function () {
          window.__feedSourcePickerLocalPending = 0;
        });
    } catch (e) {
      window.__feedSourcePickerLocalPending = 0;
    }
  }
  const r = [];
  (i.forEach((e) => {
    (e = _feedBasename(e)) && !r.includes(e) && r.push(e);
  }),
    (n.innerHTML = ""),
    r.forEach((e) => {
      const t = d.createElement("option");
      ((t.value = e), n.appendChild(t));
    }),
    (window.__FEED_FILES__ = r.slice()),
    !window.__DEFAULT_FEED_FILE__ &&
      r[0] &&
      (window.__DEFAULT_FEED_FILE__ = r[0]));
  const a = window.__DEFAULT_FEED_FILE__ || r[0] || "";
  var s;
  if (
    (a && !String(t.value || "").trim() && (t.value = a),
    (!(
      "undefined" != typeof settings &&
      settings &&
      settings[0] &&
      Array.isArray(settings[0].feeds)
    ) ||
      r.length < 2) &&
      (window.__feedSourcePickerRetryCount || 0) < 20)
  ) {
    window.__feedSourcePickerRetryCount =
      (window.__feedSourcePickerRetryCount || 0) + 1;
    try {
      clearTimeout(window.__feedSourcePickerRetryT);
    } catch (e) {}
    window.__feedSourcePickerRetryT = setTimeout(function () {
      try {
        window.initFeedSourcePicker();
      } catch (e) {}
    }, 250);
  }
  if (
    ((window._selectedFeedFileForCreate = function () {
      const e = String(t.value || "").trim(),
        n = _normalizeNewFeedFileName(e);
      if (n) return n;
      const i = _feedBasename(e);
      return /^[A-Za-z0-9_-]+\.sqlite$/i.test(i) ? i : a || "";
    }),
    window.updateFeedSourceInputVisibility ||
      (window.updateFeedSourceInputVisibility = function (e) {
        const t = qs("#feedSourceInput");
        if (!t) return;
        const n =
          !!e ||
          !!window.__forceFeedSourceInput ||
          d.body.classList.contains("force-feed-source");
        let i = d.body.classList.contains("create-post");
        if (!i) {
          const e = qs("#advancedEditorWrapper");
          if (e)
            try {
              i = "none" !== getComputedStyle(e).display;
            } catch (e) {}
        }
        t.style.display = n || i ? "block" : "none";
      }),
    !t.dataset._visHooked)
  ) {
    t.dataset._visHooked = "1";
    const e = () => {
        try {
          window.updateFeedSourceInputVisibility(!1);
        } catch (e) {}
      },
      n = qs("#create-post");
    n &&
      (n.addEventListener("focus", () => setTimeout(e, 0)),
      n.addEventListener("click", () => setTimeout(e, 0)),
      n.addEventListener("input", () => setTimeout(e, 0)));
    try {
      const t = new MutationObserver(() => e());
      (t.observe(d.body, { attributes: !0, attributeFilter: ["class"] }),
        (window.__feedSourceVisObserver = t));
      try {
        const t = qs("#advancedEditorWrapper");
        if (t) {
          const n = new MutationObserver(() => e());
          (n.observe(t, {
            attributes: !0,
            attributeFilter: ["style", "class"],
          }),
            (window.__feedSourceVisObserver2 = n));
        }
      } catch (e) {}
    } catch (e) {}
    e();
  }
};
const __FEED_FILE_HANDLES__ = {};
async function persistFeedFile(e) {
  if (!e) return;
  _ensureFeedFileExists((e = _sqliteBaseName(e)));
  try {
    "function" == typeof window.__loadSqliteAllBodiesForSource &&
      (await window.__loadSqliteAllBodiesForSource(e));
  } catch (e) {}
  const t =
    window.__FEED_SOURCE_MAP__ && Array.isArray(window.__FEED_SOURCE_MAP__[e])
      ? window.__FEED_SOURCE_MAP__[e]
      : [];
  let n = null;
  try {
    n = await buildFeedSqliteBytes(t, e);
  } catch (e) {
    return void flashMsg("SQLite 產生失敗");
  }
  const i = _sqliteBaseName(e) || "feedarray.sqlite";
  try {
    if (window.showSaveFilePicker) {
      let t = __FEED_FILE_HANDLES__[e];
      t ||
        ((t = await window.showSaveFilePicker({
          suggestedName: i,
          types: [
            {
              description: "SQLite",
              accept: {
                "application/vnd.sqlite3": [".sqlite", ".db", ".sqlite3"],
              },
            },
          ],
        })),
        (__FEED_FILE_HANDLES__[e] = t));
      const r = await t.createWritable();
      return (await r.write(n), await r.close(), void flashMsg("已寫入 " + i));
    }
  } catch (e) {
    return void flashMsg("取消寫入");
  }
  try {
    const e = new Blob([n], { type: "application/vnd.sqlite3" }),
      t = URL.createObjectURL(e),
      r = d.createElement("a");
    ((r.href = t),
      (r.download = i),
      d.body.appendChild(r),
      r.click(),
      r.remove(),
      setTimeout(() => URL.revokeObjectURL(t), 1200),
      flashMsg("已匯出 " + i));
  } catch (e) {
    flashMsg("寫入失敗");
  }
}
function splitCaptionImages(e) {
  const t = d.createElement("div");
  t.innerHTML = String(e || "");
  const n = Array.from(t.querySelectorAll("img"))
    .map((e) => (e.getAttribute("src") || "").trim())
    .filter(Boolean);
  return (
    t.querySelectorAll("img").forEach((e) => e.remove()),
    { body: t.innerHTML || "", imgs: n }
  );
}
function parseAdvImages() {
  const e = qs("#advImages");
  return e
    ? String(e.value || "")
        .split("\n")
        .map((e) => e.trim())
        .filter(Boolean)
    : [];
}
function setAdvImages(e) {
  const t = qs("#advImages");
  (t && (t.value = (Array.isArray(e) ? e : []).join("\n")),
    renderAdvImageThumbs());
}
function readFilesAsDataURLs(e) {
  const t = Array.from(e || []);
  return Promise.all(
    t.map(
      (e) =>
        new Promise((t) => {
          try {
            const n = new FileReader();
            ((n.onload = () => t(String(n.result || ""))),
              (n.onerror = () => t("")),
              n.readAsDataURL(e));
          } catch (e) {
            t("");
          }
        }),
    ),
  ).then((e) => e.filter(Boolean));
}
function parseAdvYoutube() {
  const e = qs("#advYoutube");
  return e ? String(e.value || "").trim() : "";
}
function setAdvYoutube(e) {
  const t = qs("#advYoutube");
  (t && (t.value = String(e || "").trim()), renderAdvImageThumbs());
}
function ytIdFromAny(e) {
  const t = String(e || "").trim();
  if (!t) return "";
  if (
    /^[A-Za-z0-9_\-]{6,}$/.test(t) &&
    !t.includes("http") &&
    !t.includes("/") &&
    !t.includes(".")
  )
    return t;
  let n = null;
  try {
    n = new URL(t, location.href);
  } catch (e) {
    n = null;
  }
  if (!n) return "";
  const i = (n.hostname || "").toLowerCase();
  if (!(
    "youtu.be" === i ||
    i.endsWith(".youtu.be") ||
    "youtube.com" === i ||
    i.endsWith(".youtube.com") ||
    "youtube-nocookie.com" === i ||
    i.endsWith(".youtube-nocookie.com")
  ))
    return "";
  if (i.includes("youtu.be")) {
    const e = n.pathname.split("/").filter(Boolean)[0] || "";
    if (/^[A-Za-z0-9_\-]{6,}$/.test(e)) return e;
  }
  const a = n.searchParams.get("v") || "";
  if (/^[A-Za-z0-9_\-]{6,}$/.test(a)) return a;
  const s = n.pathname.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_\-]{6,})/);
  return s ? s[1] : "";
}
function isVideoFileLike(e) {
  const t = String(e || "")
    .trim()
    .toLowerCase();
  return (
    t.startsWith("data:video/") ||
    t.startsWith("blob:") ||
    /\.(mp4|webm|ogg)(\?|#|$)/.test(t)
  );
}
function isImageFileLike(e) {
  const t = String(e || "")
    .trim()
    .toLowerCase();
  return (
    t.startsWith("data:image/") ||
    /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/.test(t)
  );
}
function isYoutubeLike(e) {
  return !!ytIdFromAny(e);
}
function classifyMediaUrl(e) {
  const t = String(e || "").trim();
  return t
    ? isYoutubeLike(t) || isVideoFileLike(t)
      ? { kind: "yt", value: t }
      : { kind: "img", value: t }
    : { kind: "", value: "" };
}
let advUrlFloatApi = null;
function ensureAdvUrlFloat() {
  if (advUrlFloatApi) return advUrlFloatApi;
  let e = d.getElementById("advUrlFloatBackdrop");
  if (e && !e.querySelector(".adv-thumb-url-row")) {
    e.remove();
    e = null;
  }
  e ||
    ((e = d.createElement("div")),
    (e.id = "advUrlFloatBackdrop"),
    (e.className = "adv-url-float-backdrop hide"),
    e.setAttribute("aria-hidden", "true"),
    (e.innerHTML =
      '<div class="adv-url-float" role="dialog" aria-modal="true"><div class="adv-url-float-head"><div class="adv-url-float-title" id="advUrlFloatTitle"><i class="uil uil-link"></i><span></span></div><button type="button" class="icon-btn adv-url-float-close" data-adv-url="cancel"><i class="uil uil-times"></i></button></div><div class="adv-thumb adv-thumb-add adv-thumb-url-row"><input type="text" id="advUrlFloatInput" class="adv-thumb-url-input" placeholder="URL" autocomplete="off" spellcheck="false"><button type="button" class="adv-thumb-upload-btn" title="選擇資料" aria-label="選擇資料" data-adv-url="upload"><i class="uil uil-file-upload"></i></button></div><div class="adv-url-float-actions"><button type="button" data-adv-url="cancel">取消</button><button type="button" class="primary" data-adv-url="ok">確定</button></div></div>'),
    d.body.appendChild(e));
  const t = qs("#advUrlFloatTitle span", e),
    n = qs("#advUrlFloatInput", e);
  let i = null;
  function r() {
    (e.classList.add("hide"),
      e.setAttribute("aria-hidden", "true"),
      (i = null));
  }
  function a() {
    const e = String(n.value || "").trim();
    if (!e) return void n.focus();
    const t = i;
    (r(), t && t(e));
  }
  function s(r) {
    ((t.textContent = String((r && r.title) || "")),
      (n.value = String((r && r.value) || "")),
      (i = "function" == typeof (r && r.onOk) ? r.onOk : null),
      e.classList.remove("hide"),
      e.setAttribute("aria-hidden", "false"),
      setTimeout(() => {
        (n.focus(), n.select());
      }, 0));
  }
  return (
    e.addEventListener("mousedown", (t) => {
      t.target === e && r();
    }),
    e.addEventListener("click", (e) => {
      const t = e.target.closest("[data-adv-url]"),
        n = t ? String(t.getAttribute("data-adv-url") || "") : "";
      if (n)
        return "cancel" === n
          ? (e.preventDefault(), void r())
          : "ok" === n
            ? (e.preventDefault(), void a())
            : "upload" === n
              ? (e.preventDefault(),
                (() => {
                  const e = qs("#advImageFileInput");
                  (e && ((e.value = ""), e.click()), r());
                })())
              : void 0;
    }),
    d.addEventListener("keydown", (t) => {
      if (!e.classList.contains("hide"))
        return "Escape" === t.key
          ? (t.preventDefault(), void r())
          : void (
              "Enter" === t.key &&
              d.activeElement === n &&
              (t.preventDefault(), a())
            );
    }),
    (advUrlFloatApi = { open: s, close: r, ok: a }),
    advUrlFloatApi
  );
}
function openAdvMediaUrlEditor(e, t, n) {
  ensureAdvMediaUnifiedStyle();
  ensureAdvUrlFloat().open({ title: e, value: t, onOk: n });
}
let advMediaMenuApi = null;
function ensureAdvMediaMenu() {
  if (advMediaMenuApi) return advMediaMenuApi;
  let e = d.getElementById("advMediaMenu");
  e ||
    ((e = d.createElement("div")),
    (e.id = "advMediaMenu"),
    (e.className = "feed-more-menu"),
    d.body.appendChild(e));
  let t = null;
  function n() {
    ((e.style.display = "none"),
      (e.dataset.kind = ""),
      (e.dataset.index = ""),
      (e.dataset.mode = ""));
  }
  function i(t) {
    const n = t.getBoundingClientRect(),
      i = e.getBoundingClientRect();
    let r = n.right - i.width;
    (r < 8 && (r = 8),
      r + i.width > window.innerWidth - 8 &&
        (r = window.innerWidth - i.width - 8));
    let a = n.bottom + 8;
    (a + i.height > window.innerHeight - 8 && (a = n.top - i.height - 8),
      a < 8 && (a = 8),
      (e.style.left = r + "px"),
      (e.style.top = a + "px"));
  }
  function r() {
    const t = e.dataset.mode;
    e.innerHTML =
      "add" === t
        ? '<button type="button" data-media="add-url"><i class="uil uil-link"></i><span>添加網址</span></button><button type="button" data-media="add-upload"><i class="uil uil-upload"></i><span>本地上傳</span></button>'
        : '<button type="button" data-media="edit-url"><i class="uil uil-edit"></i><span>修改網址</span></button><button type="button" data-media="replace-upload"><i class="uil uil-upload"></i><span>本地上傳</span></button><button type="button" class="danger" data-media="remove"><i class="uil uil-trash-alt"></i><span>移除</span></button>';
  }
  function a(n, a, s, o) {
    ((t = n),
      (e.dataset.mode = String(a || "")),
      (e.dataset.kind = String(s || "")),
      (e.dataset.index = String(null == o ? "" : o)),
      r(),
      (e.style.display = "block"),
      i(n));
  }
  function s(e) {
    a(e, "add", "", "");
  }
  function o(e, t, n) {
    a(e, "item", t, n);
  }
  return (
    d.addEventListener("click", (t) => {
      const i = t.target.closest("#advMediaMenu [data-media]");
      if (i) {
        const t = i.getAttribute("data-media");
        if ("add-url" === t)
          return (
            n(),
            void openAdvMediaUrlEditor("添加網址", "", (e) => {
              const t = classifyMediaUrl(e);
              if ("yt" === t.kind) setAdvYoutube(t.value);
              else {
                const e = parseAdvImages();
                (e.push(t.value), setAdvImages(e));
              }
            })
          );
        if ("edit-url" === t) {
          const t = e.dataset.kind,
            i = parseInt(String(e.dataset.index || "-1"), 10),
            r = "yt" === t ? parseAdvYoutube() : parseAdvImages()[i] || "";
          return (
            n(),
            void openAdvMediaUrlEditor("修改網址", r, (e) => {
              applyMediaUrlTo(t, i, e);
            })
          );
        }
        const r = e.dataset.mode,
          a = e.dataset.kind,
          s = e.dataset.index;
        return (n(), void handleAdvMediaMenuAction(t, r, a, s));
      }
      "block" !== e.style.display || e.contains(t.target) || n();
    }),
    window.addEventListener("resize", () => {
      "block" === e.style.display && n();
    }),
    window.addEventListener(
      "scroll",
      () => {
        "block" === e.style.display && n();
      },
      { passive: !0 },
    ),
    d.addEventListener("keydown", (t) => {
      "Escape" === t.key && "block" === e.style.display && n();
    }),
    (advMediaMenuApi = { openAdd: s, openItem: o, close: n }),
    advMediaMenuApi
  );
}
function applyMediaUrlTo(e, t, n) {
  const i = classifyMediaUrl(n);
  if (i.kind)
    if ("yt" !== e) {
      if ("img" === e) {
        const e = parseAdvImages(),
          n = parseInt(String(t), 10);
        if (!isFinite(n) || n < 0 || n >= e.length) return;
        "yt" === i.kind
          ? (e.splice(n, 1), setAdvImages(e), setAdvYoutube(i.value))
          : ((e[n] = i.value), setAdvImages(e));
      }
    } else if ("img" === i.kind) {
      setAdvYoutube("");
      const e = parseAdvImages();
      (e.push(i.value), setAdvImages(e));
    } else setAdvYoutube(i.value);
}
async function handleAdvMediaMenuAction(e, t, n, i) {
  if ("add" === t) {
    if ("add-url" === e)
      return void openAdvMediaUrlEditor("添加網址", "", (e) => {
        const t = classifyMediaUrl(e);
        if ("yt" === t.kind) setAdvYoutube(t.value);
        else {
          const e = parseAdvImages();
          (e.push(t.value), setAdvImages(e));
        }
      });
    if ("add-upload" === e) {
      const e = qs("#advImageFileInput");
      if (!e) return;
      return ((e.value = ""), void e.click());
    }
    return;
  }
  const r = parseInt(String(i || "-1"), 10);
  if ("remove" !== e) {
    if ("edit-url" === e) {
      return void openAdvMediaUrlEditor(
        "修改網址",
        "yt" === n ? parseAdvYoutube() : parseAdvImages()[r] || "",
        (e) => {
          applyMediaUrlTo(n, r, e);
        },
      );
    }
    if ("replace-upload" === e) {
      const e = qs("#advImageReplaceInput");
      if (!e) return;
      return (
        (e.value = ""),
        (e.dataset.kind = n),
        (e.dataset.index = String(r)),
        void e.click()
      );
    }
  } else {
    if ("yt" === n) return void setAdvYoutube("");
    if ("img" === n) {
      const e = parseAdvImages();
      r >= 0 && r < e.length && (e.splice(r, 1), setAdvImages(e));
    }
  }
}
function ensureAdvMediaUnifiedStyle() {
  if (d.getElementById("advMediaUnifiedStyle")) return;
  const e = d.createElement("style");
  e.id = "advMediaUnifiedStyle";
  e.textContent = `.adv-thumb-add.adv-thumb-url-row{width:min(100%,360px);height:46px;min-height:46px;display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:.38rem;padding:.26rem .32rem .26rem .55rem;cursor:default;overflow:visible;color:var(--c-text);background:color-mix(in oklab,var(--c-primary),transparent 94%);border:1px dashed color-mix(in oklab,var(--c-primary),transparent 35%);border-radius:var(--r-md);box-sizing:border-box}.adv-thumb-add.adv-thumb-url-row:hover{transform:none;box-shadow:var(--shadow-xs)}.adv-thumb-url-row input{min-width:0;width:100%;height:34px;border:0;background:transparent;color:var(--c-text);font:inherit;font-size:.76rem;font-weight:800;outline:none;padding:0}.adv-thumb-url-row input::placeholder{color:var(--c-text-soft);opacity:.78}.adv-thumb-url-row button{width:34px;height:34px;min-width:34px;border-radius:10px;border:1px solid var(--c-border);background:var(--c-bg-alt);color:var(--c-primary);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;justify-self:end;padding:0}.adv-thumb-url-row button:hover{border-color:var(--c-primary);background:var(--c-bg-soft)}.adv-thumb-url-row button i{font-size:1.08rem;line-height:1}#advUrlFloatBackdrop .adv-url-float{width:min(620px,92vw)}#advUrlFloatBackdrop .adv-url-float>.adv-thumb-url-row{width:100%!important;max-width:none!important;height:46px!important;min-height:46px!important;margin:0!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:.38rem!important;padding:.26rem .32rem .26rem .55rem!important;border:1px dashed color-mix(in oklab,var(--c-primary),transparent 35%)!important;border-radius:var(--r-md)!important;background:color-mix(in oklab,var(--c-primary),transparent 94%)!important;box-sizing:border-box!important;box-shadow:none!important}#advUrlFloatBackdrop .adv-url-float>.adv-thumb-url-row input{height:34px!important;border:0!important;background:transparent!important;border-radius:0!important;padding:0!important;font-size:.76rem!important;font-weight:800!important}#advUrlFloatBackdrop .adv-url-float>.adv-thumb-url-row button{width:34px!important;height:34px!important;min-width:34px!important;border-radius:10px!important;background:var(--c-bg-alt)!important}#advUrlFloatBackdrop .adv-url-float>.adv-thumb-url-row:hover{transform:none!important;box-shadow:var(--shadow-xs)!important}@media(max-width:560px){.adv-thumb-add.adv-thumb-url-row{width:100%;flex:1 1 100%}}`;
  d.head.appendChild(e);
}
function addAdvMediaUrlValue(e) {
  const t = classifyMediaUrl(e);
  if (!t.kind) return;
  if ("yt" === t.kind) setAdvYoutube(t.value);
  else {
    const e = parseAdvImages();
    (e.push(t.value), setAdvImages(e));
  }
  renderAdvImageThumbs();
}
function renderAdvImageThumbs() {
  ensureAdvMediaUnifiedStyle();
  const e = qs("#advImageThumbs");
  if (!e) return;
  e.innerHTML = "";
  const t = parseAdvYoutube(),
    n = parseAdvImages(),
    i = ensureAdvMediaMenu();
  if (t) {
    const n = d.createElement("div");
    n.className = "adv-thumb";
    const r = ytIdFromAny(t);
    if (r) {
      const e = d.createElement("img");
      ((e.loading = "lazy"),
        (e.decoding = "async"),
        (e.referrerPolicy = "no-referrer"),
        (e.src = "https://img.youtube.com/vi/" + r + "/hqdefault.jpg"),
        n.appendChild(e));
    } else if (isVideoFileLike(t)) {
      const e = d.createElement("video");
      ((e.muted = !0),
        (e.playsInline = !0),
        (e.preload = "metadata"),
        (e.src = t),
        n.appendChild(e));
    } else {
      const e = d.createElement("div");
      ((e.style.width = "100%"),
        (e.style.height = "100%"),
        (e.style.display = "flex"),
        (e.style.alignItems = "center"),
        (e.style.justifyContent = "center"),
        (e.innerHTML =
          '<i class="uil uil-youtube" style="font-size:1.9rem;color:var(--c-primary)"></i>'),
        n.appendChild(e));
    }
    const a = d.createElement("div");
    ((a.className = "adv-thumb-badge"),
      (a.textContent = "YOUTUBE"),
      n.appendChild(a));
    const s = d.createElement("button");
    ((s.type = "button"),
      (s.className = "icon-btn feed-more-btn adv-thumb-more"),
      (s.innerHTML = '<i class="uil uil-ellipsis-h"></i>'),
      s.addEventListener("click", (e) => {
        (e.preventDefault(), e.stopPropagation(), i.openItem(s, "yt", ""));
      }),
      n.appendChild(s),
      n.addEventListener("click", (e) => {
        (e.preventDefault(), e.stopPropagation(), i.openItem(n, "yt", ""));
      }),
      e.appendChild(n));
  }
  n.forEach((t, n) => {
    const r = d.createElement("div");
    r.className = "adv-thumb";
    const a = d.createElement("img");
    ((a.loading = "lazy"),
      (a.decoding = "async"),
      (a.referrerPolicy = "no-referrer"),
      (a.src = t),
      r.appendChild(a));
    const s = d.createElement("div");
    ((s.className = "adv-thumb-badge"),
      (s.textContent = "IMG"),
      r.appendChild(s));
    const o = d.createElement("button");
    ((o.type = "button"),
      (o.className = "icon-btn feed-more-btn adv-thumb-more"),
      (o.innerHTML = '<i class="uil uil-ellipsis-h"></i>'),
      o.addEventListener("click", (e) => {
        (e.preventDefault(), e.stopPropagation(), i.openItem(o, "img", n));
      }),
      r.appendChild(o),
      r.addEventListener("click", (e) => {
        (e.preventDefault(), e.stopPropagation(), i.openItem(r, "img", n));
      }),
      e.appendChild(r));
  });
  const r = d.createElement("div");
  r.className = "adv-thumb adv-thumb-add";
  (r.setAttribute("role", "button"),
    r.setAttribute("tabindex", "0"),
    r.setAttribute("title", "新增 URL 或選擇資料"),
    r.setAttribute("aria-label", "新增 URL 或選擇資料"),
    (r.innerHTML = '<i class="uil uil-plus"></i>'));
  const a = (e) => {
    (e.preventDefault(),
      e.stopPropagation(),
      openAdvMediaUrlEditor("添加網址", "", (e) => addAdvMediaUrlValue(e)));
  };
  (r.addEventListener("click", a),
    r.addEventListener("keydown", (e) => {
      ("Enter" !== e.key && " " !== e.key) || a(e);
    }),
    e.appendChild(r));
}
function initAdvImageManager() {
  const e = qs("#advImageManager");
  e && (e.style.display = "flex");
  const t = qs("#advImageFileInput"),
    n = qs("#advImageReplaceInput"),
    i = qs("#advImages");
  i && i.addEventListener("input", renderAdvImageThumbs);
  const r = qs("#advYoutube");
  (r && r.addEventListener("input", renderAdvImageThumbs),
    t &&
      t.addEventListener("change", async () => {
        const e = t.files;
        if (!e || !e.length) return;
        const n = Array.from(e),
          i = n.filter((e) => String(e.type || "").startsWith("image/")),
          r = n.filter((e) => String(e.type || "").startsWith("video/"));
        if (i.length) {
          const e = parseAdvImages();
          ((await readFilesAsDataURLs(i)).forEach((t) => e.push(t)),
            setAdvImages(e));
        }
        if (r.length) {
          const e = r[0],
            t = await new Promise((t) => {
              try {
                const n = new FileReader();
                ((n.onload = () => t(String(n.result || ""))),
                  (n.onerror = () => t("")),
                  n.readAsDataURL(e));
              } catch (e) {
                t("");
              }
            });
          t && setAdvYoutube(t);
        }
        renderAdvImageThumbs();
      }),
    n &&
      n.addEventListener("change", async () => {
        const e = n.files;
        if (!e || !e.length) return;
        const t = String(n.dataset.kind || ""),
          i = parseInt(String(n.dataset.index || "-1"), 10),
          r = e[0],
          a = String(r.type || ""),
          s = await new Promise((e) => {
            try {
              const t = new FileReader();
              ((t.onload = () => e(String(t.result || ""))),
                (t.onerror = () => e("")),
                t.readAsDataURL(r));
            } catch (t) {
              e("");
            }
          });
        if (s)
          if ("yt" !== t) {
            if ("img" === t) {
              if (a.startsWith("video/")) {
                const e = parseAdvImages();
                return (
                  isFinite(i) &&
                    i >= 0 &&
                    i < e.length &&
                    (e.splice(i, 1), setAdvImages(e)),
                  void setAdvYoutube(s)
                );
              }
              if (!a.startsWith("image/")) return;
              const e = parseAdvImages();
              isFinite(i) &&
                i >= 0 &&
                i < e.length &&
                ((e[i] = s), setAdvImages(e));
            }
          } else {
            if (!a.startsWith("video/")) return;
            setAdvYoutube(s);
          }
      }),
    renderAdvImageThumbs());
}
function dateInputFromItem(e) {
  if (!e) return "";
  const t = String(e.datetime || "");
  if (t) {
    const e = t.match(/^(\d{4}-\d{2}-\d{2})/);
    if (e) return e[1];
  }
  const n = String(e.date || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(n)) return n;
  if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(n)) {
    const e = n.split("/");
    return (
      e[0] +
      "-" +
      String(e[1]).padStart(2, "0") +
      "-" +
      String(e[2]).padStart(2, "0")
    );
  }
  if (isFinite(e.ts)) {
    const t = new Date(e.ts);
    if (isFinite(t))
      return (
        t.getFullYear() +
        "-" +
        String(t.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(t.getDate()).padStart(2, "0")
      );
  }
  return "";
}
function setTopicsFromItem(e) {
  ((selectedTopics = Array.isArray(e && e.topics) ? e.topics.slice() : []),
    qsa("#advTopicList input[type=checkbox]").forEach((e) => {
      const t = selectedTopics.includes(e.value);
      e.checked = t;
      const n = e.closest("label");
      n && n.classList.toggle("selected", t);
    }),
    renderTopicDisplay());
}
function setLikesFromItem(e) {
  ((likeAvatarsSelected = Array.isArray(e && e.likeAvatars)
    ? e.likeAvatars.slice()
    : []),
    renderLikeAvatars());
}
function ensureAdvSrtTimelineStyle() {
  if (d.getElementById("advSrtTimelineStyle")) return;
  const e = d.createElement("style");
  ((e.id = "advSrtTimelineStyle"),
    (e.textContent = `#advSrtTimelineEditor{display:none;width:100%;border:1px solid color-mix(in oklab,var(--c-border),transparent 12%);background:linear-gradient(180deg,color-mix(in oklab,var(--c-bg-alt),transparent 0%),color-mix(in oklab,var(--c-bg-soft),transparent 8%));border-radius:var(--r-lg);overflow:hidden;box-shadow:0 14px 42px -34px rgba(15,23,42,.55);margin:.45rem 0 .15rem}#advSrtTimelineEditor .adv-srt-head{display:flex;align-items:center;justify-content:space-between;gap:.65rem;padding:.58rem .72rem;border-bottom:1px solid color-mix(in oklab,var(--c-border),transparent 28%);background:color-mix(in oklab,var(--c-bg-alt),transparent 4%);font-size:.82rem;font-weight:950;color:var(--c-text)}#advSrtTimelineEditor .adv-srt-title{display:inline-flex;align-items:center;gap:.42rem;min-width:0;letter-spacing:.02em}#advSrtTimelineEditor .adv-srt-title small{font-size:.62rem;font-weight:850;color:var(--c-text-soft);white-space:nowrap}#advSrtTimelineEditor .adv-srt-title i{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:999px;background:color-mix(in oklab,var(--c-primary),transparent 88%);color:var(--c-primary);font-size:.98rem}#advSrtTimelineEditor .adv-srt-add{width:32px;height:32px;border-radius:999px;border:1px solid color-mix(in oklab,var(--c-primary),transparent 58%);background:color-mix(in oklab,var(--c-primary),transparent 91%);color:var(--c-primary);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:var(--trans)}#advSrtTimelineEditor .adv-srt-add:hover{background:var(--c-primary);border-color:var(--c-primary);color:#fff;transform:translateY(-1px)}#advSrtTimelineEditor .adv-srt-scroll{max-height:min(48vh,460px);overflow:auto;padding:.55rem .62rem .68rem;scrollbar-width:thin;scrollbar-color:color-mix(in oklab,var(--c-primary),transparent 45%) transparent}#advSrtTimelineEditor .adv-srt-scroll::-webkit-scrollbar{width:8px;height:8px}#advSrtTimelineEditor .adv-srt-scroll::-webkit-scrollbar-thumb{border-radius:999px;background:color-mix(in oklab,var(--c-primary),transparent 55%)}#advSrtTimelineEditor table,#advSrtTimelineEditor thead,#advSrtTimelineEditor tbody{display:block;width:100%}#advSrtTimelineEditor colgroup{display:none}#advSrtTimelineEditor thead{display:none}#advSrtTimelineEditor tbody{display:grid;gap:.48rem}#advSrtTimelineEditor tbody tr{display:grid;grid-template-columns:38px 116px 116px minmax(180px,1fr) 32px;gap:.46rem;align-items:start;padding:.5rem;border:1px solid color-mix(in oklab,var(--c-border),transparent 22%);border-radius:.95rem;background:color-mix(in oklab,var(--c-bg-alt),transparent 2%);box-shadow:0 10px 26px -24px rgba(15,23,42,.45);transition:var(--trans)}#advSrtTimelineEditor tbody tr:hover{border-color:color-mix(in oklab,var(--c-primary),transparent 52%);box-shadow:0 14px 34px -26px color-mix(in oklab,var(--c-primary),transparent 34%)}#advSrtTimelineEditor th,#advSrtTimelineEditor td{border:0!important;padding:0!important;vertical-align:top;min-width:0}#advSrtTimelineEditor td{display:flex;flex-direction:column;gap:.22rem}#advSrtTimelineEditor td:nth-child(2)::before{content:"開始"}#advSrtTimelineEditor td:nth-child(3)::before{content:"結束"}#advSrtTimelineEditor td:nth-child(4)::before{content:"字幕"}#advSrtTimelineEditor td:nth-child(2)::before,#advSrtTimelineEditor td:nth-child(3)::before,#advSrtTimelineEditor td:nth-child(4)::before{font-size:.6rem;font-weight:950;letter-spacing:.06em;color:color-mix(in oklab,var(--c-text-soft),transparent 10%);padding-left:.18rem}#advSrtTimelineEditor .adv-srt-no{width:30px;height:30px;border-radius:999px;display:grid!important;place-items:center;align-self:start;background:color-mix(in oklab,var(--c-primary),transparent 89%);border:1px solid color-mix(in oklab,var(--c-primary),transparent 66%)!important;color:var(--c-primary);font-size:.7rem;font-weight:1000;line-height:1}#advSrtTimelineEditor .adv-srt-time{width:100%;border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);border-radius:999px;background:color-mix(in oklab,var(--c-bg-soft),transparent 5%);padding:.46rem .58rem;font:inherit;font-size:.76rem;font-weight:850;color:var(--c-text);box-sizing:border-box;letter-spacing:.01em}#advSrtTimelineEditor textarea{width:100%;min-height:48px;max-height:180px;resize:vertical;border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);border-radius:.78rem;background:color-mix(in oklab,var(--c-bg-soft),transparent 5%);padding:.5rem .62rem;font:inherit;font-size:.78rem;font-weight:750;line-height:1.45;color:var(--c-text);box-sizing:border-box}#advSrtTimelineEditor input:focus,#advSrtTimelineEditor textarea:focus{outline:none;border-color:var(--c-primary);background:var(--c-bg-alt);box-shadow:0 0 0 3px color-mix(in oklab,var(--c-primary),transparent 86%)}#advSrtTimelineEditor .adv-srt-remove{width:30px;height:30px;margin-top:1.08rem;border-radius:999px;border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);background:transparent;color:var(--c-text-soft);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;transition:var(--trans)}#advSrtTimelineEditor .adv-srt-remove:hover{background:color-mix(in oklab,var(--c-danger),transparent 88%);border-color:color-mix(in oklab,var(--c-danger),transparent 44%);color:var(--c-danger);transform:translateY(-1px)}#advSrtTimelineEditor .adv-srt-remove i,#advSrtTimelineEditor .adv-srt-add i{font-size:.95rem;line-height:1}@media(max-width:760px){#advSrtTimelineEditor .adv-srt-scroll{max-height:min(56vh,520px);padding:.46rem}#advSrtTimelineEditor tbody tr{grid-template-columns:34px minmax(0,1fr) minmax(0,1fr) 30px;gap:.4rem;padding:.45rem}#advSrtTimelineEditor .adv-srt-no{width:28px;height:28px}#advSrtTimelineEditor td:nth-child(4){grid-column:1/-1}#advSrtTimelineEditor td:nth-child(5){grid-column:4;grid-row:1}#advSrtTimelineEditor .adv-srt-remove{margin-top:0}#advSrtTimelineEditor .adv-srt-time{font-size:.72rem;padding:.42rem .48rem}#advSrtTimelineEditor textarea{min-height:56px;font-size:.76rem}#advSrtTimelineEditor .adv-srt-title small{display:none}}`),
    d.head.appendChild(e));
}
function advSrtTimestampClean(e) {
  return String(e || "")
    .trim()
    .replace(".", ",");
}
function advSrtParseRows(e) {
  const t = String(e || "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim(),
    n = { prefix: "", rows: [] };
  if (!t) return n;
  const i =
    /^(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})(.*)$/;
  const r = [];
  return (
    t.split(/\n{2,}/).forEach((e) => {
      const t = String(e || "")
        .split("\n")
        .map((e) => String(e || "").trim());
      let a = t.findIndex((e) => i.test(e));
      if (a < 0) {
        n.rows.length || r.push(t.join("\n").trim());
        return;
      }
      const s = t[a].match(i),
        o = t.slice(0, a);
      (o.length && /^\d+$/.test(o[o.length - 1]) && o.pop(),
        o.length && !n.rows.length && !r.length && r.push(o.join("\n").trim()));
      const l = t
        .slice(a + 1)
        .join("\n")
        .trim();
      n.rows.push({
        start: advSrtTimestampClean(s[1]),
        end: advSrtTimestampClean(s[2]),
        text: l,
      });
    }),
    (n.prefix = r
      .map((e) => String(e || "").trim())
      .filter(Boolean)
      .join("\n")
      .trim()),
    n
  );
}
function advSrtNormalizeTime(e) {
  let t = String(e || "")
    .trim()
    .replace(".", ",");
  if (!t) return "";
  let n = t.match(/^(\d{1,2}):(\d{2}):(\d{2})(?:,(\d{1,3}))?$/);
  if (n) {
    const e = String(n[1]).padStart(2, "0"),
      i = String(n[2]).padStart(2, "0"),
      r = String(n[3]).padStart(2, "0"),
      a = String(n[4] || "0")
        .padEnd(3, "0")
        .slice(0, 3);
    return `${e}:${i}:${r},${a}`;
  }
  if ((n = t.match(/^(\d{1,2}):(\d{2})(?:,(\d{1,3}))?$/))) {
    const e = String(n[1]).padStart(2, "0"),
      i = String(n[2]).padStart(2, "0"),
      r = String(n[3] || "0")
        .padEnd(3, "0")
        .slice(0, 3);
    return `00:${e}:${i},${r}`;
  }
  return t;
}
function advSrtRowHtml(e, t) {
  const n = Math.max(
    1,
    Math.min(5, String((e && e.text) || "").split(/\n/).length),
  );
  return `<tr><td class="adv-srt-no">${t + 1}</td><td><input class="adv-srt-time" data-srt-field="start" value="${esc((e && e.start) || "")}" inputmode="numeric" spellcheck="false" aria-label="開始時間" title="開始時間"></td><td><input class="adv-srt-time" data-srt-field="end" value="${esc((e && e.end) || "")}" inputmode="numeric" spellcheck="false" aria-label="結束時間" title="結束時間"></td><td><textarea data-srt-field="text" spellcheck="false" rows="${n}" placeholder="字幕內容" aria-label="字幕內容">${esc((e && e.text) || "")}</textarea></td><td><button type="button" class="adv-srt-remove" data-srt-row="remove" title="移除" aria-label="移除"><i class="uil uil-trash-alt"></i></button></td></tr>`;
}
function renumberAdvSrtRows(e) {
  (e = e || qs("#advSrtTimelineEditor")) &&
    qsa("tbody tr", e).forEach((e, t) => {
      const n = e.querySelector(".adv-srt-no");
      n && (n.textContent = String(t + 1));
    });
}
function ensureAdvSrtTimelineEditor() {
  ensureAdvSrtTimelineStyle();
  let e = qs("#advSrtTimelineEditor");
  if (e) return e;
  ((e = d.createElement("div")),
    (e.id = "advSrtTimelineEditor"),
    (e.className = "adv-srt-timeline-editor"),
    (e.innerHTML =
      '<div class="adv-srt-head"><div class="adv-srt-title"><i class="uil uil-clock"></i><span>時間軸字幕</span><small>直接編輯時間與字幕</small></div><button type="button" class="adv-srt-add" data-srt-row="add" title="新增字幕列" aria-label="新增字幕列"><i class="uil uil-plus"></i></button></div><div class="adv-srt-scroll" tabindex="0"><table><colgroup><col class="adv-srt-col-no"><col class="adv-srt-col-time"><col class="adv-srt-col-time"><col><col class="adv-srt-col-act"></colgroup><thead><tr><th>#</th><th>開始</th><th>結束</th><th>字幕內容</th><th></th></tr></thead><tbody></tbody></table></div>'));
  const t = qs("#advEditor");
  return (
    t && t.parentNode
      ? t.parentNode.insertBefore(e, t.nextSibling)
      : qs("#advancedEditorWrapper") &&
        qs("#advancedEditorWrapper").appendChild(e),
    e.addEventListener("click", (t) => {
      const n = t.target.closest("[data-srt-row]");
      if (!n) return;
      const i = String(n.getAttribute("data-srt-row") || "");
      if ("remove" === i) {
        const i = n.closest("tr");
        i && (t.preventDefault(), i.remove(), renumberAdvSrtRows(e));
        return;
      }
      if ("add" === i) {
        t.preventDefault();
        const n = e.querySelector("tbody"),
          i = n ? n.querySelectorAll("tr").length : 0;
        n &&
          (n.insertAdjacentHTML(
            "beforeend",
            advSrtRowHtml(
              { start: "00:00:00,000", end: "00:00:05,000", text: "" },
              i,
            ),
          ),
          renumberAdvSrtRows(e));
        const r =
          n &&
          n.lastElementChild &&
          n.lastElementChild.querySelector('textarea,[data-srt-field="start"]');
        r && r.focus();
      }
    }),
    e
  );
}
function renderAdvSrtTimelineEditor(e, t) {
  const n = ensureAdvSrtTimelineEditor(),
    i = advSrtParseRows(e),
    r = n.querySelector("tbody");
  ((n.dataset.srtPrefix = i.prefix || ""),
    r &&
      (r.innerHTML = (
        i.rows.length
          ? i.rows
          : [
              {
                start: "00:00:00,000",
                end: "00:00:05,000",
                text: String(e || "").trim(),
              },
            ]
      )
        .map(advSrtRowHtml)
        .join("")),
    (n.style.display = "block"));
  const a = qs("#advEditor");
  a && ((a.style.display = "none"), (a.innerHTML = ""));
  feedEditState.srtMode = !0;
}
function hideAdvSrtTimelineEditor() {
  const e = qs("#advSrtTimelineEditor");
  e && (e.style.display = "none");
  const t = qs("#advEditor");
  t && (t.style.display = "");
  feedEditState.srtMode = !1;
}
function isAdvSrtTimelineEditorVisible() {
  const e = qs("#advSrtTimelineEditor");
  return !!(e && "none" !== e.style.display);
}
function collectAdvSrtTimeline() {
  const e = qs("#advSrtTimelineEditor");
  if (!e) return "";
  const t = [],
    n = String(e.dataset.srtPrefix || "").trim();
  n && t.push(n, "");
  let i = 1;
  qsa("tbody tr", e).forEach((e) => {
    const n = advSrtNormalizeTime(
        e.querySelector('[data-srt-field="start"]') &&
          e.querySelector('[data-srt-field="start"]').value,
      ),
      r = advSrtNormalizeTime(
        e.querySelector('[data-srt-field="end"]') &&
          e.querySelector('[data-srt-field="end"]').value,
      ),
      a = String(
        (e.querySelector('[data-srt-field="text"]') &&
          e.querySelector('[data-srt-field="text"]').value) ||
          "",
      ).trim();
    n && r && a && t.push(String(i++), `${n} --> ${r}`, a, "");
  });
  return t
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
function focusAdvSrtTimelineEditor() {
  const e = qs("#advSrtTimelineEditor"),
    t = e && e.querySelector('textarea,[data-srt-field="start"]');
  t && t.focus();
}
function startEditFeed(e) {
  if (!e) return;
  ((feedEditState.active = !0),
    (feedEditState.item = e),
    (feedEditState.srcFile = e.__srcFile || ""));
  const t = qs("#feedSourceInput"),
    n = qs("#feedSourceInput");
  (t &&
    ((feedEditState.prevTargetFile = t.value),
    (t.value =
      feedEditState.srcFile || window.__DEFAULT_FEED_FILE__ || t.value),
    (t.disabled = !0)),
    n && (n.style.display = "none"),
    showMore(),
    (qs("#advYoutube").style.display = "none"));
  const i = qs("#advImageManager");
  if (
    (i && (i.style.display = "flex"),
    (qs("#advImages").style.display = "none"),
    !mainActionDefaultText)
  ) {
    const e = qs("#mainActionText");
    mainActionDefaultText = e ? e.textContent : "";
  }
  setMainActionText("修改");
  let r = null;
  const a = String(e.publisherId || e.userId || "");
  if (
    (a && (r = _advUserById(a)),
    !r &&
      e.avatar &&
      (r = ADV_USERS.find((t) => t && t.avatar === e.avatar) || null),
    !r && e.user && (r = ADV_USERS.find((t) => t && t.name === e.user) || null),
    r)
  ) {
    ((advCurrentUserId = String(r.id || a || "")),
      (advCurrentUserName = String(r.name || "您")),
      (advCurrentUserAvatar = String(r.avatar || _defaultAvatar() || "")));
    const e = qs(
      '#advUserList input[name=advUserPreset][value="' +
        CSS.escape(advCurrentUserId) +
        '"]',
    );
    e && (e.checked = !0);
  } else
    ((advCurrentUserId = a),
      (advCurrentUserName = String(e.user || "您")),
      (advCurrentUserAvatar = String(e.avatar || _defaultAvatar() || "")));
  (updateSelectedAvatarDisplay(),
    (qs("#advTitle").value = String(e.title || "")
      .replace(/\s*•\s*$/, "")
      .trim()));
  const s = dateInputFromItem(e);
  (s && (qs("#advDate").value = s),
    (qs("#advYoutube").value = String(e.yt || "")));
  const o = splitCaptionImages(e.caption || ""),
    l = !!String(e.srt || "").trim();
  (l
    ? renderAdvSrtTimelineEditor(String(e.srt || ""), e)
    : (hideAdvSrtTimelineEditor(), (qs("#advEditor").innerHTML = o.body || "")),
    (qs("#advImages").value = (o.imgs || []).join("\n")),
    renderAdvImageThumbs(),
    setTopicsFromItem(e),
    setLikesFromItem(e),
    setAdvSelectedGeo(e.geo || null),
    qs("#advancedEditorWrapper").scrollIntoView({
      behavior: "smooth",
      block: "center",
    }),
    l ? focusAdvSrtTimelineEditor() : qs("#advEditor").focus());
}
function stopEditFeed(e) {
  ((feedEditState.active = !1),
    (feedEditState.item = null),
    (feedEditState.srcFile = ""));
  const t = qs("#feedSourceInput"),
    n = qs("#feedSourceInput");
  if (t) {
    t.disabled = !1;
    const e =
      feedEditState.prevTargetFile || window.__DEFAULT_FEED_FILE__ || t.value;
    e && (t.value = e);
  }
  ((feedEditState.prevTargetFile = ""),
    n && (n.style.display = "none"),
    hideAdvSrtTimelineEditor(),
    resetMainActionText(),
    e &&
      ((qs("#advTitle").value = ""),
      (qs("#advImages").value = ""),
      (qs("#advEditor").innerHTML = ""),
      (selectedTopics = []),
      (likeAvatarsSelected = []),
      qsa("#advTopicList input[type=checkbox]").forEach((e) => {
        e.checked = !1;
        const t = e.closest("label");
        t && t.classList.remove("selected");
      }),
      renderTopicDisplay(),
      renderLikeAvatars()),
    renderAdvImageThumbs(),
    setAdvSelectedGeo(null));
}
function deleteFeedItem(e) {
  if (!e) return;
  if (
    (feedEditState.active && feedEditState.item === e && stopEditFeed(!0),
    !confirm("確定刪除這則 feed？"))
  )
    return;
  const t = e.__srcFile || "";
  if (
    t &&
    window.__FEED_SOURCE_MAP__ &&
    Array.isArray(window.__FEED_SOURCE_MAP__[t])
  ) {
    const n = window.__FEED_SOURCE_MAP__[t];
    let i = n.indexOf(e);
    if (-1 === i) {
      const t = String(e.ts || "");
      i = n.findIndex((e) => String((e && e.ts) || "") === t);
    }
    -1 !== i && n.splice(i, 1);
  }
  let n = feedArray.indexOf(e);
  if (-1 === n) {
    const t = String(e.ts || "");
    n = feedArray.findIndex((e) => String((e && e.ts) || "") === t);
  }
  (-1 !== n && feedArray.splice(n, 1),
    renderAllFeeds(),
    t && persistFeedFile(t));
}
function mainActionBtn2() {
  const e = String(advCurrentUserName || "您").replace(/</g, "&lt;"),
    t = String(
      advCurrentUserAvatar ||
        _defaultAvatar() ||
        "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
    ),
    n = qs("#advTitle").value.trim(),
    i = qs("#advDate").value.trim();
  let r = qs("#advYoutube").value.trim(),
    a = "";
  if (r) {
    const e = ytIdFromAny(r);
    e && (a = e);
  }
  let s = qs("#advImages")
    .value.split("\n")
    .map((e) => e.trim())
    .filter(Boolean);
  r &&
    isImageFileLike(r) &&
    (s.push(r), (r = ""), (qs("#advYoutube").value = ""));
  const o = s.filter((e) => isYoutubeLike(e) || isVideoFileLike(e));
  o.length &&
    ((s = s.filter((e) => !(isYoutubeLike(e) || isVideoFileLike(e)))),
    r || (r = o[0]));
  const l = void 0,
    c = void 0;
  const advSrtEditActive =
      feedEditState.active &&
      feedEditState.item &&
      String(feedEditState.item.srt || "").trim() &&
      isAdvSrtTimelineEditorVisible(),
    advSrtEditedText = advSrtEditActive ? collectAdvSrtTimeline() : "";
  let d = advSrtEditActive ? "" : sanitize(qs("#advEditor").innerHTML) || "";
  !advSrtEditActive &&
    s.length &&
    (d += s.map((e) => `<img src="${e}" alt="">`).join(""));
  const u = likeAvatarsSelected.slice(),
    p = u.map((e) => {
      const t = ADV_USERS.find((t) => t.avatar === e);
      return t ? t.name : "";
    }),
    m = selectedTopics.slice(),
    f =
      advSelectedGeo &&
      isFinite(Number(advSelectedGeo.lat)) &&
      isFinite(Number(advSelectedGeo.lon))
        ? {
            name: String(advSelectedGeo.name || ""),
            address: String(advSelectedGeo.address || ""),
            lat: Number(advSelectedGeo.lat),
            lon: Number(advSelectedGeo.lon),
          }
        : null,
    g = window.__DEFAULT_FEED_FILE__ || "",
    h = window.__FEED_SOURCE_MAP__ || (window.__FEED_SOURCE_MAP__ = {});
  if (feedEditState.active && feedEditState.item) {
    const s = feedEditState.item,
      o = dateInputFromItem(s),
      l = Number(s.ts),
      c = feedEditState.srcFile || s.__srcFile || g;
    ((s.__srcFile = c),
      (s.user = e),
      (s.avatar = t),
      (s.publisherId = advCurrentUserId || s.publisherId || ""),
      (s.title = n || ""));
    const y = i || s.date || "剛剛";
    if (((s.date = y), i)) {
      const t = String(s.datetime || "").split(" ")[1] || "08:00:00";
      s.datetime = i + " " + t;
    }
    if (
      (i && o && i === o && isFinite(l)
        ? (s.ts = l)
        : (s.ts = getTimestamp(s.datetime || i || y || null)),
      advSrtEditActive
        ? ((s.srt = advSrtEditedText || ""), (s.caption = ""))
        : (s.caption = d || ""),
      (s.yt = a || r),
      (s.likeAvatars = u),
      (s.likeName = p),
      (s.likes = u.length),
      (s.topics = m),
      f)
    )
      s.geo = f;
    else
      try {
        delete s.geo;
      } catch (e) {
        s.geo = null;
      }
    return (
      Array.isArray(s.commentList) || (s.commentList = []),
      "number" != typeof s.comments && (s.comments = s.commentList.length || 0),
      "number" != typeof s.shares && (s.shares = 0),
      -1 === feedArray.indexOf(s) && feedArray.push(s),
      c &&
        ((h[c] = Array.isArray(h[c]) ? h[c] : []),
        -1 === h[c].indexOf(s) && h[c].push(s)),
      stopEditFeed(!0),
      renderAllFeeds(),
      void (c && persistFeedFile(c))
    );
  }
  const y = i || "剛剛",
    v = i ? i + " 08:00:00" : "",
    S = getTimestamp(v || i || null),
    A =
      "function" == typeof window._selectedFeedFileForCreate
        ? window._selectedFeedFileForCreate()
        : window.__DEFAULT_FEED_FILE__ || "";
  if (null === A) return;
  const _ = {
    publisherId: advCurrentUserId || "",
    user: e,
    avatar: t,
    title: n || "",
    date: y,
    datetime: v || y,
    caption: d || "",
    yt: a || r,
    likes: u.length,
    likeAvatars: u,
    likeName: p,
    comments: 0,
    commentList: [],
    shares: 0,
    ts: S,
    topics: m,
    __srcFile: A,
  };
  (f && (_.geo = f),
    feedArray.push(_),
    A && ((h[A] = Array.isArray(h[A]) ? h[A] : []), h[A].push(_)),
    renderAllFeeds(),
    A && persistFeedFile(A));
  try {
    setAdvSelectedGeo(null);
  } catch (e) {}
}
function initPosting() {
  qs("#postForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const t = String(qs("#advEditor").textContent || "").trim(),
      n = parseAdvImages(),
      i = parseAdvYoutube(),
      r =
        advSelectedGeo &&
        isFinite(Number(advSelectedGeo.lat)) &&
        isFinite(Number(advSelectedGeo.lon));
    (t || n.length || i || r || feedEditState.active) && mainActionBtn2();
  });
}
function initAdvancedEditor() {
  const e = qs("#advEditor");
  e &&
    (["mouseup", "keyup", "touchend", "input"].forEach((t) =>
      e.addEventListener(t, saveAdvSelection),
    ),
    document.addEventListener("selectionchange", () => {
      const t = document.activeElement;
      (t === e || e.contains(t)) && saveAdvSelection();
    }));
  const t = qs("#advToolbar");
  t &&
    (t.addEventListener("mousedown", (e) => {
      e.target.closest("button,input,select") && saveAdvSelection();
    }),
    t.addEventListener("click", (t) => {
      const n = t.target.closest("button[data-cmd]");
      n &&
        (restoreAdvSelection(),
        document.execCommand(n.dataset.cmd, !1, null),
        saveAdvSelection(),
        e && e.focus());
    }));
  const n = qs("#fontColor");
  (n &&
    n.addEventListener("input", (t) => {
      (restoreAdvSelection(),
        document.execCommand("foreColor", !1, t.target.value),
        saveAdvSelection(),
        e && e.focus());
    }),
    (() => {
      const t = qs("#fontSelect");
      if (!t) return;
      const n = () => {
        const n = String(t.value || "").trim();
        n && (applySelectionSpanStyle("fontFamily", n), e && e.focus());
      };
      t.addEventListener("change", n);
    })(),
    (() => {
      const t = qs("#fontSizeSelect"),
        n = qs("#fontSizeDatalist");
      if (!t) return;
      const i = (i) => {
        const r = String(t.value || "").trim();
        if (!r) return;
        const a = _normalizeFontSize(r);
        (i || !n || n.querySelector('option[value="' + CSS.escape(a) + '"]')) &&
          (applySelectionSpanStyle("fontSize", a), e && e.focus());
      };
      (t.addEventListener("input", () => i(!1)),
        t.addEventListener("change", () => i(!0)),
        t.addEventListener("keydown", (e) => {
          "Enter" === e.key && (e.preventDefault(), i(!0));
        }));
    })(),
    qs("#clearFormat").addEventListener("click", () => {
      const e = qs("#advEditor");
      if (!e) return;
      const t = ["P", "UL", "OL", "LI", "SPAN", "BR", "FONT", "B", "I"],
        n = document.createElement("div");
      ((n.innerHTML = e.innerHTML),
        n.querySelectorAll("*").forEach((e) => {
          if (e.tagName && !t.includes(e.tagName)) {
            const t = document.createElement("span");
            for (; e.firstChild;) t.appendChild(e.firstChild);
            e.replaceWith(t);
          }
        }),
        n.querySelectorAll("[style]").forEach((e) => {
          const t = e.style.color;
          t &&
            t.toLowerCase().replace(/\s+/g, "").includes("rgb(19,19,20)") &&
            e.removeAttribute("style");
        }),
        (e.innerHTML = n.innerHTML));
    }));
}
let advPlaceIndex = null,
  advPlaceIndexSize = 0,
  advPlaceIndexRef = null,
  advPlaceEnsureP = null;
function buildAdvPlaceIndex() {
  const e = Array.isArray(window.PLACES) ? window.PLACES : [];
  if (advPlaceIndex && advPlaceIndexRef === e && advPlaceIndexSize === e.length)
    return advPlaceIndex;
  ((advPlaceIndexSize = e.length), (advPlaceIndexRef = e));
  const t = [];
  for (let n = 0; n < e.length; n++) {
    const i = e[n] || {},
      r = String(i.name || "").trim(),
      a = Array.isArray(i.branches) ? i.branches : [];
    if (!a.length) {
      const e = Number(i.lat),
        n = Number(i.lon),
        a = String(i.address || i.addr || "").trim();
      isFinite(e) &&
        isFinite(n) &&
        (r || a) &&
        t.push({
          name: r || "地點",
          address: a,
          lat: e,
          lon: n,
          cat: String(i.cat || "").trim(),
        });
      continue;
    }
    for (let e = 0; e < a.length; e++) {
      const n = a[e] || {},
        s = Number(n.lat ?? n.latitude),
        o = Number(n.lon ?? n.lng ?? n.longitude);
      if (!isFinite(s) || !isFinite(o)) continue;
      const l = String(n.name || r || "").trim(),
        c = String(n.addr || n.address || n.addr1 || n.location || "").trim(),
        d = String(n.cat || i.cat || "").trim();
      (l || c) && t.push({ name: l, address: c, lat: s, lon: o, cat: d });
    }
  }
  return ((advPlaceIndex = t), t);
}
function setAdvSelectedGeo(e) {
  advSelectedGeo =
    e &&
    "object" == typeof e &&
    isFinite(Number(e.lat)) &&
    isFinite(Number(e.lon))
      ? {
          name: String(e.name || ""),
          address: String(e.address || e.addr || ""),
          lat: Number(e.lat),
          lon: Number(e.lon),
        }
      : null;
  const t = qs("#advPlaceSelected"),
    n = qs("#advPlaceSelectedName"),
    i = qs("#advPlaceSelectedAddr");
  t &&
    n &&
    i &&
    (advSelectedGeo
      ? (t.classList.add("show"),
        (n.textContent = advSelectedGeo.name || "地點"),
        (i.textContent = advSelectedGeo.address || ""))
      : (t.classList.remove("show"),
        (n.textContent = ""),
        (i.textContent = "")));
}
function initAdvPlaceAI() {
  const e = qs("#advToolbarAI"),
    t = qs("#advPlaceBtn"),
    n = qs("#advPlacePanel"),
    i = qs("#advPlaceInput"),
    r = qs("#advPlaceSuggest"),
    a = qs("#advPlaceClear");
  if (!(e && t && n && i && r && a)) return;
  const s = () => {
      (r.classList.remove("show"),
        (r.innerHTML = ""),
        (r.style.maxHeight = ""));
    },
    o = () => {
      (n.classList.remove("show"), s());
    },
    l = () => {
      if (!r.classList.contains("show")) return;
      const e = window.visualViewport,
        t = (e && e.height) || window.innerHeight || 0,
        n = (e && e.offsetTop) || 0,
        a = (r.getBoundingClientRect().top || 0) - n,
        s = 12,
        o = Math.max(160, Math.floor(t - a - s));
      r.style.maxHeight = o + "px";
    },
    c = () => {
      try {
        requestAnimationFrame(l);
      } catch (e) {
        l();
      }
    };
  (window.addEventListener("resize", c, { passive: !0 }),
    window.visualViewport &&
      window.visualViewport.addEventListener("resize", c, { passive: !0 }));
  const d = () =>
      advPlaceEnsureP ||
      (window.__OSM_PLACES_READY &&
      Array.isArray(window.PLACES) &&
      window.PLACES.length
        ? ((advPlaceEnsureP = Promise.resolve(!0)), advPlaceEnsureP)
        : ((advPlaceEnsureP =
            "function" == typeof window.ensureOsmPlaces
              ? Promise.resolve()
                  .then(() => window.ensureOsmPlaces())
                  .catch(() => null)
              : Promise.resolve(null)),
          advPlaceEnsureP)),
    u = (e) =>
      String(e || "")
        .toLowerCase()
        .replace(/[　\s]+/g, "")
        .replace(
          /[()（）\[\]【】{}「」『』"'“”‘’，、;；:：\.。!?！？\-—_]+/g,
          "",
        ),
    p = () => {
      (n.classList.add("show"),
        (i.value = ""),
        s(),
        setTimeout(() => i.focus(), 0),
        d().then(() => {
          ((advPlaceIndex = null), (advPlaceIndexRef = null));
        }));
    };
  (t.addEventListener("click", () => {
    n.classList.contains("show") ? o() : p();
  }),
    a.addEventListener("click", () => {
      setAdvSelectedGeo(null);
    }),
    r.addEventListener("click", (e) => {
      const t = e.target.closest("button[data-lat]");
      if (!t) return;
      (setAdvSelectedGeo({
        name: t.dataset.name || "",
        address: t.dataset.address || "",
        lat: Number(t.dataset.lat),
        lon: Number(t.dataset.lon),
      }),
        o());
      const i = qs("#advEditor");
      i && i.focus();
    }),
    i.addEventListener("input", () => {
      const e = String(i.value || "").trim();
      if (!e) return void s();
      const t = u(e);
      let n = buildAdvPlaceIndex();
      if (!n.length && !window.__OSM_PLACES_READY)
        return void d().then(() => {
          ((advPlaceIndex = null), (advPlaceIndexRef = null));
          String(i.value || "").trim() === e &&
            i.dispatchEvent(new Event("input"));
        });
      n = buildAdvPlaceIndex();
      const a = [];
      for (let e = 0; e < n.length; e++) {
        const i = n[e],
          r = (i.name || "") + (i.address || "") + (i.cat || "");
        if ((u(r).includes(t) && a.push(i), a.length >= 8)) break;
      }
      a.length
        ? ((r.innerHTML = a
            .map(
              (e) =>
                `<button type="button" data-lat="${e.lat}" data-lon="${e.lon}" data-name="${esc(e.name || "")}" data-address="${esc(e.address || "")}"><span>${esc(e.name || "地點")}</span><small>${esc(e.address || e.cat || "")}</small></button>`,
            )
            .join("")),
          r.classList.add("show"),
          c())
        : s();
    }),
    i.addEventListener("keydown", (e) => {
      "Escape" === e.key && o();
    }),
    document.addEventListener("click", (t) => {
      e.contains(t.target) || s();
    }),
    setAdvSelectedGeo(null));
}
function updateSelectedAvatarDisplay() {
  const e = qs("#advSelectedAvatarImg");
  e &&
    (e.src =
      String(advCurrentUserAvatar || "").trim() ||
      _defaultAvatar() ||
      "https://cdn-icons-png.flaticon.com/128/1828/1828843.png");
}
function renderLikeAvatars() {
  const e = qs("#advLikeAvatarList");
  e &&
    (likeAvatarsSelected.length
      ? (e.innerHTML = likeAvatarsSelected
          .map(
            (e, t) =>
              `<div class="la-item" data-idx="${t}" title="點按移除"><img src="${e}" alt=""><button type="button" data-remove="${t}">&times;</button></div>`,
          )
          .join(""))
      : (e.innerHTML =
          '<span style="font-size:.6rem;color:var(--c-text-soft);letter-spacing:.5px;">(尚未選擇)</span>'));
}
function renderAdvTopics() {
  const e = qs("#advTopicList");
  if (!e) return;
  refreshTopicMeta();
  const t = (Array.isArray(TOPIC_GROUPS) ? TOPIC_GROUPS : [])
    .map((e) => {
      const t = e.color || "#0ea5e9",
        n = (e.topics || [])
          .map((n) => {
            const i = String(n || "").trim();
            if (!i) return "";
            const r = i.includes("::") ? i : `${e.id}::${i}`,
              a = selectedTopics.includes(r) ? " checked" : "",
              s = selectedTopics.includes(r) ? " selected" : "",
              o = i.includes("::") ? i.split("::").slice(1).join("::") : i;
            return `<label class="topic-sub${s}" data-key="${esc(r)}" data-topic="${esc(o)}" data-group="${esc(e.id)}" data-color="${esc(t)}"><input type="checkbox" value="${esc(r)}"${a}><span>${esc(o)}</span></label>`;
          })
          .join("");
      return `<div class="topic-group" data-group="${esc(e.id)}" style="--topic-color:${esc(t)}"><button type="button" class="topic-main">${esc(e.name)}</button><div class="topic-sublist">${n}</div></div>`;
    })
    .join("");
  e.innerHTML = t;
}
function renderTopicDisplay() {
  const e = qs("#advTopicDisplay");
  if (!e) return;
  if (!selectedTopics.length)
    return void (e.innerHTML =
      '<span style="font-size:.6rem;color:var(--c-text-soft);letter-spacing:.5px;">(尚未選擇)</span>');
  const t = qs("#advTopicList");
  e.innerHTML = selectedTopics
    .map((e) => {
      let n = "";
      const i = t
        ? t.querySelector(`label[data-key="${CSS.escape(e)}"]`)
        : null;
      i && i.dataset.color && (n = i.dataset.color);
      const r = n ? ` style="--topic-color:${esc(n)}"` : "";
      return `<span class="topic-chip" data-topic="${esc(e)}"${r}>${esc(topicLabel(e))}<button type="button" data-remove-topic="${esc(e)}">&times;</button></span>`;
    })
    .join("");
}
function initTopics() {
  const e = qs("#advTopicList");
  if (!e) return;
  (renderAdvTopics(),
    renderTopicDisplay(),
    e.addEventListener("click", (t) => {
      const n = t.target.closest(".topic-main");
      if (n) {
        const t = n.closest(".topic-group");
        if (!t) return;
        const i = t.classList.contains("open");
        (qsa(".topic-group", e).forEach((e) => e.classList.remove("open")),
          i || t.classList.add("open"));
      }
    }),
    e.addEventListener("change", (e) => {
      const t = e.target.closest("input[type=checkbox]");
      if (!t) return;
      const n = t.value,
        i = t.closest("label");
      (t.checked
        ? (selectedTopics.includes(n) || selectedTopics.push(n),
          i && i.classList.add("selected"))
        : ((selectedTopics = selectedTopics.filter((e) => e !== n)),
          i && i.classList.remove("selected")),
        renderTopicDisplay());
    }));
  const t = qs("#addTopicBtn"),
    n = qs("#clearTopicBtn"),
    i = qs("#advancedEditorWrapper");
  (t &&
    t.addEventListener("click", () => {
      i.classList.toggle("show-topics");
    }),
    n &&
      n.addEventListener("click", () => {
        ((selectedTopics = []),
          qsa("#advTopicList input[type=checkbox]").forEach((e) => {
            e.checked = !1;
            const t = e.closest("label");
            t && t.classList.remove("selected");
          }),
          renderTopicDisplay());
      }),
    document.addEventListener("click", (t) => {
      const n = t.target.closest("button[data-remove-topic]");
      if (n) {
        const t = n.dataset.removeTopic;
        selectedTopics = selectedTopics.filter((e) => e !== t);
        const i = e.querySelector(
          `input[type="checkbox"][value="${CSS.escape(t)}"]`,
        );
        if (i) {
          i.checked = !1;
          const e = i.closest("label");
          e && e.classList.remove("selected");
        }
        renderTopicDisplay();
      }
    }));
}
function initCompactAvatarToggle() {
  const e = qs("#advancedEditorWrapper"),
    t = qs("#advSelectedAvatar");
  t &&
    t.addEventListener("click", () => {
      ((selectionMode = "user"), e.classList.toggle("show-users"));
    });
}
function initLikeAvatarButton() {
  const e = qs("#addLikeAvatarBtn"),
    t = qs("#advancedEditorWrapper");
  e &&
    e.addEventListener("click", () => {
      ((selectionMode = "like"), t.classList.add("show-users"));
    });
  const n = qs("#clearLikeAvatarBtn");
  (n &&
    n.addEventListener("click", () => {
      ((likeAvatarsSelected = []), renderLikeAvatars());
    }),
    document.addEventListener("click", (e) => {
      const t = e.target.closest("button[data-remove]");
      if (t) {
        const e = +t.getAttribute("data-remove");
        (likeAvatarsSelected.splice(e, 1), renderLikeAvatars());
      }
    }));
}
function initAdvUsers() {
  renderAdvUsers();
  const e = qs("#advUserList"),
    t =
      e.querySelector("input[name=advUserPreset]:checked") ||
      e.querySelector("input[name=advUserPreset]");
  (t &&
    ((advCurrentUserId = t.value || ""),
    (advCurrentUserName = t.dataset.name || "您"),
    (advCurrentUserAvatar = t.dataset.avatar || _defaultAvatar())),
    e.addEventListener("change", (e) => {
      const t = e.target.closest("input[type=radio][name=advUserPreset]");
      if (t)
        if ("user" === selectionMode)
          ((advCurrentUserId = t.value || ""),
            (advCurrentUserName = t.dataset.name || "您"),
            (advCurrentUserAvatar = t.dataset.avatar || _defaultAvatar()),
            updateSelectedAvatarDisplay(),
            qs("#advancedEditorWrapper").classList.remove("show-users"));
        else {
          const e = t.dataset.avatar || "";
          e &&
            !likeAvatarsSelected.includes(e) &&
            (likeAvatarsSelected.push(e), renderLikeAvatars());
        }
    }),
    (qs("#advDate").valueAsDate = new Date()),
    updateSelectedAvatarDisplay(),
    renderLikeAvatars());
}
function initNotifications() {
  const e = qs("#notifications"),
    t = ensureNotifPopup();
  e &&
    t &&
    (e.addEventListener("click", (e) => {
      e.preventDefault();
      if ("flex" === t.style.display) t.style.display = "none";
      else {
        positionNotif();
        const e = qs("#notifCount");
        e && (e.style.display = "none");
      }
    }),
    document.addEventListener("click", (n) => {
      e.contains(n.target) ||
        t.contains(n.target) ||
        (t.style.display = "none");
    }));
}
function initGlobalSearch() {
  const e = qs("#globalSearch");
  (e.addEventListener("keydown", (e) => {
    "Enter" === e.key && e.preventDefault();
  }),
    e.addEventListener("input", () => {
      const t = e.value.trim().toLowerCase();
      ((activeSearchQuery = t), filterQuickLinksGlobal(t), applyAllFilters());
    }));
}
function initQuickLinks() {
  const e = qs("#quick-categories"),
    t = qs("#app_search"),
    n = qs("#links-container");
  if (!e || !n) return;
  renderCategories();
  const i =
    e.querySelector("button.active[data-cat]") ||
    e.querySelector("button[data-cat]");
  (i
    ? renderLinks(i.dataset.cat)
    : (n.innerHTML =
        '<p style="font-size:.75rem;color:var(--c-text-soft);padding:.5rem;">載入中…</p>'),
    e.dataset.boundQuickLinks ||
      ((e.dataset.boundQuickLinks = "1"),
      e.addEventListener("click", (n) => {
        const i = n.target.closest("button[data-cat]");
        i &&
          (qsa("button[data-cat]", e).forEach((e) =>
            e.classList.remove("active"),
          ),
          i.classList.add("active"),
          renderLinks(i.dataset.cat),
          t && (t.value = ""));
      })),
    t &&
      !t.dataset.boundQuickLinks &&
      ((t.dataset.boundQuickLinks = "1"),
      t.addEventListener("input", (e) => {
        filterQuickLinksGlobal(e.target.value.trim().toLowerCase());
      })),
    n.dataset.boundQuickLinks ||
      ((n.dataset.boundQuickLinks = "1"),
      n.addEventListener("click", (e) => {
        const t = e.target.closest(".link-item");
        if (!t) return;
        const n = t.getAttribute("data-title") || "",
          i = qs(".layout"),
          r = qs("#AppBtn"),
          a = (e) => {
            r &&
              i &&
              i.classList.contains("app-mode") &&
              (r.click(), "function" == typeof e && requestAnimationFrame(e));
          };
        if ("計算餘藥及天數" === n) {
          (e.preventDefault(), e.stopPropagation());
          const t = ensureCalcFeed();
          if (
            (t.classList.remove("hide"),
            window.DCCalendar && "function" == typeof window.DCCalendar.init)
          )
            window.DCCalendar.init(t);
          else {
            const e = t.querySelector("#dcCalendar");
            if (e && !e.querySelector(".dc-error")) {
              const t = document.createElement("div");
              ((t.className = "dc-error"), e.appendChild(t));
            }
          }
          return (
            t.classList.remove("flash"),
            t.offsetWidth,
            t.classList.add("flash"),
            t.scrollIntoView({ behavior: "smooth", block: "start" }),
            void a(() =>
              t.scrollIntoView({ behavior: "smooth", block: "start" }),
            )
          );
        }
        a();
      })));
}
function initStories() {
  (renderStories(),
    qsa(".story").forEach((e) =>
      e.addEventListener("click", () => {
        window.open(e.dataset.link, "_blank");
      }),
    ));
}
function initTheme() {
  (qs("#sidebarThemeToggle").addEventListener("click", toggleTheme),
    qs("#themeToggle").addEventListener("click", toggleTheme),
    "dark" === localStorage.getItem("portalTheme") &&
      (document.body.setAttribute("data-theme", "dark"),
      (qs("#themeToggle").innerHTML = '<i class="uil uil-sun"></i>')));
}
function initAppToggle() {
  const e = qs("#AppBtn");
  if (!e) return;
  const t = qs(".layout"),
    n = e.querySelector("i"),
    i = document.documentElement;
  let r = 0;
  function a() {
    const e = qs("#osmMap");
    if (!e) return 0;
    return Math.round(e.getBoundingClientRect().height || 0);
  }
  function s() {
    const e = a();
    e > 0 && (r = e);
  }
  function o(e) {
    if (e) {
      r || s();
      const e = r || 200;
      i.style.setProperty("--osm-map-fixed-h", e + "px");
    } else
      (i.style.removeProperty("--osm-map-fixed-h"), requestAnimationFrame(s));
  }
  (s(),
    window.addEventListener(
      "resize",
      () => {
        t.classList.contains("app-mode") || s();
      },
      { passive: !0 },
    ),
    e.addEventListener("click", () => {
      t.classList.contains("app-mode") || s();
      const e = t.classList.toggle("app-mode");
      (o(e),
        requestAnimationFrame(() => {
          try {
            window.dispatchEvent(new Event("resize"));
          } catch (e) {}
        }));
      try {
        "function" == typeof window.osmExitFullscreenAndReset &&
          window.osmExitFullscreenAndReset();
      } catch (e) {}
      n &&
        (n.className = e
          ? "uil uil-arrow-from-right"
          : "uil uil-left-arrow-from-left");
    }));
}
function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if ("k" === e.key && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      const t = qs("#globalSearch");
      t && null !== t.offsetParent && t.focus();
    }
    if ("Escape" === e.key) {
      const e = qs("#notifPopup");
      e && (e.style.display = "none");
    }
  });
}
function initDaysCountdown() {
  (updateCountdown(), setInterval(updateCountdown, 36e5));
}
function initLinkButtons() {
  document.addEventListener("click", (e) => {
    const t = e.target.closest(".link-btn");
    if (t) {
      const e = t.getAttribute("data-link");
      e && window.open(e, "_blank");
    }
  });
}
function initFeedMoreMenu() {
  let e = d.getElementById("feedMoreMenu");
  function t() {
    ((e.style.display = "none"), (e.dataset.ts = ""));
  }
  function n(t, n) {
    ((e.dataset.ts = String(n || "")), (e.style.display = "block"));
    const i = t.getBoundingClientRect(),
      r = e.getBoundingClientRect();
    let a = i.right - r.width;
    (a < 8 && (a = 8),
      a + r.width > window.innerWidth - 8 &&
        (a = window.innerWidth - r.width - 8));
    let s = i.bottom + 8;
    (s + r.height > window.innerHeight - 8 && (s = i.top - r.height - 8),
      s < 8 && (s = 8),
      (e.style.left = a + "px"),
      (e.style.top = s + "px"));
  }
  (e ||
    ((e = d.createElement("div")),
    (e.id = "feedMoreMenu"),
    (e.className = "feed-more-menu"),
    (e.innerHTML =
      '<button type="button" data-more="edit"><i class="uil uil-edit"></i><span>修改</span></button><button type="button" class="danger" data-more="delete"><i class="uil uil-trash-alt"></i><span>刪除</span></button>'),
    d.body.appendChild(e)),
    d.addEventListener("click", (i) => {
      const r = i.target.closest(
        'button.feed-more-btn[data-action="feed-more"]',
      );
      if (r) {
        (i.preventDefault(), i.stopPropagation());
        const a = r.closest(".feed"),
          s = a ? getFeedItemByElement(a) : null;
        return s
          ? "block" === e.style.display && e.dataset.ts === String(s.ts || "")
            ? void t()
            : void n(r, s.ts)
          : void t();
      }
      const a = i.target.closest("#feedMoreMenu button[data-more]");
      if (a) {
        const n = a.dataset.more,
          i = e.dataset.ts;
        t();
        const r = feedArray.find(
          (e) => String((e && e.ts) || "") === String(i || ""),
        );
        if (!r) return;
        return (
          "edit" === n && startEditFeed(r),
          void ("delete" === n && deleteFeedItem(r))
        );
      }
      "block" !== e.style.display || e.contains(i.target) || t();
    }),
    window.addEventListener("resize", () => {
      "block" === e.style.display && t();
    }),
    window.addEventListener(
      "scroll",
      () => {
        "block" === e.style.display && t();
      },
      { passive: !0 },
    ),
    d.addEventListener("keydown", (n) => {
      "Escape" === n.key && "block" === e.style.display && t();
    }));
}
function topicOverviewMatches(e, t) {
  const n = Array.isArray(e) ? e : [];
  if (!t) return !0;
  const i = t.endsWith("::"),
    r = i ? t.slice(0, -2) : "",
    a = t.includes("::") ? t.split("::").slice(1).join("::") : t;
  return n.some((e) => {
    const n = String(e || "");
    return i
      ? n.startsWith(r + "::")
      : n === t || (!!a && n.endsWith("::" + a));
  });
}
function ensureTopicOverviewModal() {
  let e = document.getElementById("topicOverviewModal");
  if (e) return e;
  e = document.createElement("div");
  e.id = "topicOverviewModal";
  e.className = "topic-overview-modal";
  e.setAttribute("aria-hidden", "true");
  e.innerHTML =
    '<div class="topic-overview-dialog" role="dialog" aria-modal="true" aria-labelledby="topicOverviewTitle"><div class="topic-overview-head"><div><p class="topic-overview-kicker">主題總覽</p><h2 id="topicOverviewTitle"></h2><span class="topic-overview-count" id="topicOverviewCount"></span></div><button type="button" class="topic-overview-close" data-topic-overview-close aria-label="關閉總覽"><i class="uil uil-times"></i></button></div><div class="topic-overview-list" id="topicOverviewList"></div></div>';
  document.body.appendChild(e);
  return e;
}
function getTopicOverviewItems(e) {
  return (Array.isArray(feedArray) ? feedArray : []).filter((t) =>
    topicOverviewMatches(t && t.topics, e),
  );
}
function closeTopicOverview() {
  const e = document.getElementById("topicOverviewModal");
  e && (e.classList.remove("is-open"), e.setAttribute("aria-hidden", "true"));
  document.body.classList.remove("topic-overview-open");
}
function openTopicOverview(e) {
  const t = ensureTopicOverviewModal(),
    n = getTopicOverviewItems(e),
    i = t.querySelector("#topicOverviewTitle"),
    r = t.querySelector("#topicOverviewCount"),
    a = t.querySelector("#topicOverviewList"),
    s = topicColor(e) || "var(--c-primary)";
  i && (i.textContent = topicLabel(e));
  r && (r.textContent = `共 ${n.length} 篇內容`);
  if (a) {
    a.style.setProperty("--topic-overview-color", s);
    a.innerHTML = n.length
      ? n
          .map((e, t) => {
            const n = displayFeedTitle(e) || "未命名內容",
              i = String(e.date || "").trim(),
              r = String(e.ts || "").trim();
            return `<button type="button" class="topic-overview-item" data-topic-overview-ts="${esc(r)}"><span class="topic-overview-index">${t + 1}</span><span><strong class="topic-overview-title">${esc(n)}</strong>${i ? `<small class="topic-overview-date">${esc(i)}</small>` : ""}</span></button>`;
          })
          .join("")
      : '<p class="topic-overview-empty">目前沒有可顯示的內容。</p>';
  }
  t.classList.add("is-open");
  t.setAttribute("aria-hidden", "false");
  document.body.classList.add("topic-overview-open");
  const o = t.querySelector("[data-topic-overview-close]");
  o && o.focus();
}
async function focusTopicOverviewFeed(e) {
  const t = String(e || "").trim();
  if (!t) return;
  closeTopicOverview();
  let n = document.querySelector(`.feed[data-ts="${CSS.escape(t)}"]`);
  for (; !n && feedRenderIndex < feedArray.length;) {
    if (!(await appendNextFeedBatch())) break;
    n = document.querySelector(`.feed[data-ts="${CSS.escape(t)}"]`);
  }
  n && n.scrollIntoView({ behavior: "smooth", block: "start" });
}
function initTopicPillFiltering() {
  if (document.__topicPillFilteringBound) return;
  document.__topicPillFilteringBound = !0;
  document.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-topic-overview-close]");
    if (t) return void closeTopicOverview();
    const n = e.target.closest("[data-topic-overview-ts]");
    if (n) return void focusTopicOverviewFeed(n.dataset.topicOverviewTs);
    const i = e.target.closest(".topic-pill[data-topic-key]");
    if (!i) return;
    const r = i.dataset.topicKey || "";
    if (!r) return;
    e.preventDefault();
    if (activeTopicKey === r) {
      closeTopicOverview();
      await setActiveTopicKey("");
      return;
    }
    closeTopicOverview();
    await setActiveTopicKey(r);
    openTopicOverview(r);
  });
  document.addEventListener("click", (e) => {
    const t = document.getElementById("topicOverviewModal");
    t && e.target === t && closeTopicOverview();
  });
  document.addEventListener("keydown", (e) => {
    "Escape" === e.key && closeTopicOverview();
  });
}
function initIntroHint() {
  const e = qs("#introHintOverlay");
  if (!e) return;
  const t = 0;
  e.style.display = "flex";
  const n = qs("#introGotIt"),
    i = qs("#introGoDirect"),
    r = qs("#introHintOverlay a");
  function a() {
    ((e.style.display = "none"), localStorage.setItem("introHintSeen", "1"));
  }
  (n && n.addEventListener("click", a),
    i &&
      i.addEventListener("click", () => {
        (r && window.open(r.href, "_blank"), a());
      }),
    e.addEventListener("click", (t) => {
      t.target === e && a();
    }));
}
function initNavTopicFilter() {
  const e = document.querySelector("#topicGroupSelect"),
    t = document.querySelector("#topicSubSelect"),
    n = document.querySelector("#clearTopicFilter");
  function i() {
    (refreshTopicMeta(),
      (e.innerHTML =
        '<option value="">全部内容</option>' +
        (Array.isArray(TOPIC_GROUPS) ? TOPIC_GROUPS : [])
          .map(function (e) {
            return (
              '<option value="' + esc(e.id) + '">' + esc(e.name) + "</option>"
            );
          })
          .join("")));
  }
  function r(e) {
    const n = (Array.isArray(TOPIC_GROUPS) ? TOPIC_GROUPS : []).find(
      function (t) {
        return t.id === e;
      },
    );
    if (!n)
      return (
        (t.innerHTML = '<option value="">全部專欄</option>'),
        void (t.disabled = !0)
      );
    ((t.innerHTML =
      '<option value="">全部專欄</option>' +
      (n.topics || [])
        .map(function (t) {
          const n = String(t || "").trim();
          if (!n) return "";
          const i = n.split("::"),
            r = i.length > 1 ? i.slice(1).join("::") : n;
          return (
            '<option value="' +
            esc(i.length > 1 ? n : e ? e + "::" + n : n) +
            '">' +
            esc(r) +
            "</option>"
          );
        })
        .join("")),
      (t.disabled = !1));
  }
  e &&
    t &&
    n &&
    (i(),
    r(e.value || ""),
    e.dataset.boundTopicFilter ||
      ((e.dataset.boundTopicFilter = "1"),
      e.addEventListener("change", function () {
        const n = e.value || "";
        if (!n) return (r(""), void setActiveTopicKey(""));
        (r(n), (t.value = ""), setActiveTopicKey(n + "::"));
      })),
    t.dataset.boundTopicFilter ||
      ((t.dataset.boundTopicFilter = "1"),
      t.addEventListener("change", function () {
        const n = e.value || "";
        if (!n) return void setActiveTopicKey("");
        const i = t.value || "";
        if (!i) return void setActiveTopicKey(n + "::");
        setActiveTopicKey(i.includes("::") ? i : n + "::" + i);
      })),
    n.dataset.boundTopicFilter ||
      ((n.dataset.boundTopicFilter = "1"),
      n.addEventListener("click", function () {
        (setActiveTopicKey(""), (e.value = ""), r(""), (t.value = ""));
      })));
}
qs("#advEditor").addEventListener("paste", function () {
  setTimeout(() => qs("#clearFormat").click(), 0);
});
const TTSPlayer = {
  currentFeed: null,
  utterance: null,
  playing: !1,
  highlightTimer: null,
  lastBoundaryAt: 0,
  cfg: {
    wordsPerSecond: 2.6,
    maxChunkChars: 900,
    voiceLangsPrefer: ["zh-TW", "zh-Hant", "zh-CN", "cmn-Hant", "cmn", "zh"],
  },
  cancel() {
    clearTtsHighlightTimer();
    try {
      TTS_SUPPORTED && speechSynthesis.cancel();
    } catch (e) {}
    if (this.currentFeed) {
      qsa(".tts-word.reading,.tts-word.pass", this.currentFeed).forEach((e) =>
        e.classList.remove("reading", "pass"),
      );
      const e = this.currentFeed.querySelector(".media-player");
      if (e) {
        const t = e.querySelector(".mp-play i");
        (t && (t.className = "uil uil-play"), (e.dataset.state = "idle"));
        const n = e.querySelector(".mp-progress");
        n && (n.style.width = "0%");
      }
    }
    ((this.utterance = null),
      (this.currentFeed = null),
      (this.playing = !1),
      (this.lastBoundaryAt = 0));
  },
};
let ttsWarmedUp = !1,
  userVoiceName = localStorage.getItem("ttsVoiceName") || "";
async function warmupTTS() {
  if (!ttsWarmedUp)
    if (TTS_SUPPORTED)
      try {
        try {
          await getVoicesAsync(2500);
        } catch (e) {}
        const e = new SpeechSynthesisUtterance("。");
        ((e.lang = "zh-TW"),
          speechSynthesis.speak(e),
          speechSynthesis.cancel(),
          (ttsWarmedUp = !0));
      } catch (e) {
        ttsWarmedUp = !0;
      }
    else ttsWarmedUp = !0;
}
function clearTtsHighlightTimer() {
  TTSPlayer.highlightTimer &&
    (clearInterval(TTSPlayer.highlightTimer),
    (TTSPlayer.highlightTimer = null));
}
function ttsIsSrtIndexLine(e) {
  return /^\d{1,5}$/.test(String(e || "").trim());
}
function ttsIsSrtTimingLine(e) {
  return /^\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(
    String(e || "").trim(),
  );
}
function ttsIsUrlText(e) {
  return (
    (e = String(e || "").trim()),
    /^(https?:\/\/|www\.)/i.test(e) || /^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(e)
  );
}
function ttsCleanDisplayText(e) {
  return String(e || "")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e && !ttsIsSrtIndexLine(e) && !ttsIsSrtTimingLine(e))
    .map((e) =>
      e
        .replace(/https?:\/\/\S+/gi, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .join("\n")
    .trim();
}
function ttsShouldSkipNode(e) {
  const t = e && e.parentElement;
  return (
    !t ||
    !!t.closest(
      "button,.more-btn,.caption-slideshow,.post-images,script,style,noscript,template,iframe,video,audio,svg,canvas,.media-player,.feed-actions,.feed-comments,.yt-ai-panel,.yt-ai-transcript",
    )
  );
}
function ttsSplitSpeakableToken(e) {
  let t = String(e || "").trim();
  if (!t || ttsIsUrlText(t) || /^[-–—>]+$/.test(t)) return [];
  if (
    ((t = t.replace(/\s+/g, " ")),
    /[\u3400-\u9fff]/.test(t) && Array.from(t).length > 14)
  ) {
    const e = [];
    let n = "";
    return (
      Array.from(t).forEach((t) => {
        ((n += t),
          (/[，。！？；、,.!?;:：]/.test(t) || Array.from(n).length >= 14) &&
            (e.push(n), (n = "")));
      }),
      n && e.push(n),
      e.filter(Boolean)
    );
  }
  return [t];
}
function ttsAppendSpeakableText(e, t, n, i) {
  String(t || "")
    .split(/(https?:\/\/[^\s<>"]+)/gi)
    .forEach((t) => {
      t &&
        (/^https?:\/\//i.test(t)
          ? e.appendChild(document.createTextNode(t))
          : t.split(/(\s+)/).forEach((t) => {
              if (!t) return;
              if (/\s+/.test(t))
                return void e.appendChild(document.createTextNode(t));
              const r = ttsSplitSpeakableToken(t);
              r.length
                ? r.forEach((t) => {
                    const r = document.createElement("span");
                    ((r.className = "tts-word"),
                      (r.textContent = t),
                      (r.dataset.w = n.value++),
                      e.appendChild(r),
                      i.push(t));
                  })
                : e.appendChild(document.createTextNode(t));
            }));
    });
}
function ttsBuildFragmentFromText(e, t, n) {
  const i = document.createDocumentFragment();
  return (
    String(e || "")
      .split(/(\r\n|\n|\r)/)
      .forEach((e) => {
        if (!e) return;
        if (/^(\r\n|\n|\r)$/.test(e))
          return void i.appendChild(document.createTextNode(e));
        const r = e.trim();
        r
          ? ttsIsSrtIndexLine(r) || ttsIsSrtTimingLine(r)
            ? i.appendChild(document.createTextNode(e))
            : ttsAppendSpeakableText(i, e, t, n)
          : i.appendChild(document.createTextNode(e));
      }),
    i
  );
}
function ttsAppendPlainWords(e, t) {
  ttsCleanDisplayText(e)
    .split(/(\s+)/)
    .forEach((e) => {
      if (!e || /\s+/.test(e)) return;
      ttsSplitSpeakableToken(e).forEach((e) => t.push(e));
    });
}
function ttsAppendAiPanelWords(e, t) {
  qsa(".yt-ai-panel", e).forEach((e) => {
    const n =
      e.dataset.aiKey &&
      window.__YT_AI_PANEL_DATA__ &&
      window.__YT_AI_PANEL_DATA__[e.dataset.aiKey];
    if (n && Array.isArray(n.segments) && n.segments.length) {
      n.segments.forEach((e) => {
        ytAiSegmentText(e.summary).forEach((e) => ttsAppendPlainWords(e, t));
      });
      return;
    }
    ttsAppendPlainWords(e.innerText || e.textContent || "", t);
  });
}
function unwrapTtsWords(e) {
  if (e) {
    qsa(".tts-word", e).forEach((e) => {
      e.replaceWith(document.createTextNode(e.textContent || ""));
    });
    try {
      e.normalize();
    } catch (e) {}
  }
}
function ttsEstimateDuration(e) {
  const t = (e || []).join(""),
    n = Array.from(t).length;
  return Math.max(
    1.2,
    n / 4.5,
    (e || []).length / Math.max(1, TTSPlayer.cfg.wordsPerSecond),
  );
}
function initMediaPlayers() {
  qsa(".feed").forEach((e) => {
    const t = qs(".media-player", e);
    if (t) {
      if (!TTS_SUPPORTED) {
        const e = qs(".mp-btn", t);
        return void (
          e && ((e.disabled = !0), (e.title = "此裝置瀏覽器不支援文字朗讀功能"))
        );
      }
      (e._ttsEventsBound || (setupMediaEvents(e), (e._ttsEventsBound = !0)),
        e._ttsData || prepareCaptionForTTS(e));
    }
  });
}
function prepareCaptionForTTS(e) {
  const t = qs(".caption", e);
  if (!t) return !1;
  unwrapTtsWords(t);
  const n = document.createTreeWalker(t, NodeFilter.SHOW_TEXT, {
    acceptNode: (e) =>
      e.nodeValue && e.nodeValue.trim()
        ? ttsShouldSkipNode(e)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT,
  });
  let i = [];
  for (; n.nextNode();) i.push(n.currentNode);
  let r = { value: 0 };
  const a = [];
  (i.forEach((e) => {
    const t = ttsBuildFragmentFromText(e.nodeValue, r, a);
    e.parentNode && e.parentNode.replaceChild(t, e);
  }),
    ttsAppendAiPanelWords(t, a));
  if (!a.length) {
    const t = getFeedItemByElement(e);
    ttsAppendPlainWords(
      (t && (t.srt || t.caption || t.title)) || "",
      a,
    );
  }
  const s = a.join(" ");
  return (
    (e._ttsData = {
      words: a,
      totalWords: a.length,
      plainText: s,
      estimatedDuration: ttsEstimateDuration(a),
      startWordOffset: 0,
      chunkEndWord: 0,
      chunkDuration: 0,
      elapsedSec: 0,
      startedAt: 0,
      currentWordIndex: 0,
      resumeFromWord: 0,
    }),
    a.length > 0
  );
}
function setupMediaEvents(e) {
  const t = qs(".media-player", e);
  t &&
    t.addEventListener("click", async (t) => {
      const n = t.target.closest("[data-action]");
      if (!n) return;
      const i = n.dataset.action;
      "play" === i
        ? await togglePlay(e)
        : "seek" === i && (await seekFromClick(e, t));
    });
}
function expandIfTruncated(e) {
  const t = e?.querySelector(".caption");
  if (!t) return !1;
  const n = t.querySelector('button[data-action="expand-caption"]'),
    i = t.querySelector(".caption-preview");
  if (!n || !i) return !1;
  const r = getFeedItemByElement(e);
  if (!r) return !1;
  const a = normalizeCaptionMedia(r.caption || "");
  return (
    (t.innerHTML = (a.captionHtml || "") + (a.imagesHtml || "")),
    initLazyImages(e),
    initCaptionSlideshows(e),
    prepareCaptionForTTS(e),
    !0
  );
}
async function togglePlay(e) {
  expandIfTruncated(e);
  const t = qs(".media-player", e);
  if (!t || !TTS_SUPPORTED) return;
  const n = qs(".mp-play", t),
    i = qs(".mp-play i", t),
    r = t.dataset.state || "idle";
  let a = e._ttsData;
  if (
    ((a && a.totalWords) || (prepareCaptionForTTS(e), (a = e._ttsData)),
    !a || !a.totalWords)
  )
    return (
      (t.dataset.state = "idle"),
      void (i && (i.className = "uil uil-play"))
    );
  if (
    (TTSPlayer.currentFeed && TTSPlayer.currentFeed !== e && TTSPlayer.cancel(),
    "playing" === r)
  ) {
    ((TTSPlayer.playing = !1), clearTtsHighlightTimer());
    try {
      speechSynthesis.cancel();
    } catch (e) {}
    return (
      (t.dataset.state = "paused"),
      i && (i.className = "uil uil-play"),
      void (
        n &&
        (n.setAttribute("title", "播放"),
        n.setAttribute("aria-pressed", "false"))
      )
    );
  }
  if ("paused" === r && a && a.totalWords > 0) {
    const r = Math.max(
      0,
      Math.min(a.totalWords - 1, a.resumeFromWord || a.currentWordIndex || 0),
    );
    if (!(await startReading(e, r))) return;
    return (
      (t.dataset.state = "playing"),
      i && (i.className = "uil uil-pause"),
      n &&
        (n.setAttribute("title", "暫停"),
        n.setAttribute("aria-pressed", "true")),
      (TTSPlayer.playing = !0),
      void requestAnimationFrame(() => updateProgressLoop(e))
    );
  }
  (await startReading(e, 0)) &&
    ((t.dataset.state = "playing"),
    i && (i.className = "uil uil-pause"),
    n &&
      (n.setAttribute("title", "暫停"),
      n.setAttribute("aria-pressed", "true")));
}
function ttsMakeChunk(e, t) {
  const n = TTSPlayer.cfg.maxChunkChars || 900;
  let i = t,
    r = 0;
  for (; i < e.length;) {
    const a = String(e[i] || "");
    if (i > t && r + a.length + 1 > n) break;
    ((r += a.length + 1), i++);
  }
  return (
    i <= t && (i = Math.min(e.length, t + 1)),
    { words: e.slice(t, i), end: i }
  );
}
async function startReading(e, t, n = {}) {
  if (!TTS_SUPPORTED) return !1;
  let i = e._ttsData;
  if (
    ((i && i.totalWords) || (prepareCaptionForTTS(e), (i = e._ttsData)),
    !i || 0 === i.totalWords)
  )
    return !1;
  const r = qs(".media-player", e),
    a = qs(".mp-play i", r),
    s = qs(".mp-play", r);
  if (!n.continuation)
    if (TTSPlayer.currentFeed && TTSPlayer.currentFeed !== e)
      TTSPlayer.cancel();
    else {
      ((TTSPlayer.playing = !1), clearTtsHighlightTimer());
      try {
        speechSynthesis.cancel();
      } catch (e) {}
    }
  ((TTSPlayer.currentFeed = e),
    (TTSPlayer.utterance = null),
    qsa(".tts-word.reading,.tts-word.pass", e).forEach((e) =>
      e.classList.remove("reading", "pass"),
    ));
  const o = Math.max(0, Math.min(i.totalWords - 1, t || 0));
  i.startWordOffset = o;
  const l = ttsMakeChunk(i.words, o),
    c = l.words,
    d = c.join(" ").trim();
  if (!d) return !1;
  ((i.chunkEndWord = l.end),
    (i.chunkDuration = ttsEstimateDuration(c)),
    (i.currentWordIndex = o),
    (i.resumeFromWord = o));
  const u = new SpeechSynthesisUtterance(d);
  ((u.rate = 1), (u.lang = "zh-TW"));
  let p = [];
  try {
    p = speechSynthesis.getVoices() || [];
  } catch (e) {
    p = [];
  }
  let m = null;
  (userVoiceName && (m = p.find((e) => e.name === userVoiceName) || null),
    m || (m = chooseBestChineseVoice(p)),
    m && ((u.voice = m), (u.lang = m.lang)));
  const f = () => {
    ((i.startedAt = performance.now()),
      (i.elapsedSec = 0),
      r && (r.dataset.state = "playing"),
      a && (a.className = "uil uil-pause"),
      s &&
        (s.setAttribute("title", "暫停"),
        s.setAttribute("aria-pressed", "true")),
      (TTSPlayer.playing = !0),
      (TTSPlayer.lastBoundaryAt = 0),
      highlightWord(e, o),
      updateProgress(e, o / i.totalWords),
      startTtsHighlightFallback(e),
      requestAnimationFrame(() => updateProgressLoop(e)));
  };
  ((u.onstart = f),
    (u.onend = () => {
      TTSPlayer.currentFeed === e &&
        TTSPlayer.playing &&
        (clearTtsHighlightTimer(),
        (i.resumeFromWord = l.end),
        (i.currentWordIndex = Math.max(0, l.end - 1)),
        l.end < i.totalWords && r && "playing" === r.dataset.state
          ? startReading(e, l.end, { continuation: !0 })
          : (r && (r.dataset.state = "ended"),
            a && (a.className = "uil uil-play"),
            s &&
              (s.setAttribute("title", "播放"),
              s.setAttribute("aria-pressed", "false")),
            (TTSPlayer.playing = !1),
            highlightWord(e, i.totalWords - 1),
            updateProgress(e, 1)));
    }),
    (u.onerror = () => {
      (clearTtsHighlightTimer(),
        r && (r.dataset.state = "idle"),
        a && (a.className = "uil uil-play"),
        s &&
          (s.setAttribute("title", "播放"),
          s.setAttribute("aria-pressed", "false")),
        (TTSPlayer.playing = !1));
    }),
    (u.onboundary = (t) => {
      try {
        if ("number" != typeof t.charIndex) return;
        TTSPlayer.lastBoundaryAt = performance.now();
        const n = charIndexToWordIndex(c, t.charIndex),
          r = Math.max(0, Math.min(i.totalWords - 1, i.startWordOffset + n));
        ((i.currentWordIndex = r),
          (i.resumeFromWord = r),
          highlightWord(e, r),
          updateProgress(e, (r + 1) / i.totalWords));
      } catch (e) {}
    }));
  try {
    return (f(), speechSynthesis.speak(u), (TTSPlayer.utterance = u), !0);
  } catch (e) {
    return (
      clearTtsHighlightTimer(),
      r && (r.dataset.state = "idle"),
      a && (a.className = "uil uil-play"),
      (TTSPlayer.playing = !1),
      !1
    );
  }
}
function startTtsHighlightFallback(e) {
  (clearTtsHighlightTimer(),
    (TTSPlayer.highlightTimer = setInterval(() => {
      try {
        if (!TTSPlayer.playing || TTSPlayer.currentFeed !== e)
          return void clearTtsHighlightTimer();
        const t = qs(".media-player", e);
        if (!t || "playing" !== t.dataset.state)
          return void clearTtsHighlightTimer();
        const n = e._ttsData;
        if (!n || !n.totalWords) return;
        const i = performance.now();
        if (TTSPlayer.lastBoundaryAt && i - TTSPlayer.lastBoundaryAt < 900)
          return;
        const r = (i - (n.startedAt || i)) / 1e3,
          a = Math.max(
            1,
            (n.chunkEndWord || n.totalWords) - (n.startWordOffset || 0),
          ),
          s = Math.max(
            0.8,
            n.chunkDuration || a / TTSPlayer.cfg.wordsPerSecond,
          );
        let o = (n.startWordOffset || 0) + Math.floor((r / s) * a);
        ((o = Math.max(
          0,
          Math.min((n.chunkEndWord || n.totalWords) - 1, n.totalWords - 1, o),
        )),
          o !== n.currentWordIndex &&
            ((n.currentWordIndex = o),
            (n.resumeFromWord = o),
            highlightWord(e, o),
            updateProgress(e, (o + 1) / n.totalWords)));
      } catch (e) {}
    }, 240)));
}
function charIndexToWordIndex(e, t) {
  let n = 0;
  for (let i = 0; i < e.length; i++) {
    const a = n + String(e[i] || "").length;
    if (t < a + 1) return i;
    n = a + 1;
  }
  return Math.max(0, e.length - 1);
}
function highlightWord(e, t) {
  qsa(".tts-word", e).forEach((e) => {
    const n = Number(e.dataset.w);
    (e.classList.toggle("reading", n === t), e.classList.toggle("pass", n < t));
  });
  const i = e.querySelector(`.tts-word[data-w="${t}"]`);
  if (i && i.scrollIntoView) {
    const e = i.getBoundingClientRect();
    if (e.top < 80 || e.bottom > window.innerHeight - 80)
      try {
        i.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      } catch (e) {}
  }
}
function updateProgress(e, t) {
  t = Math.max(0, Math.min(1, t || 0));
  const n = qs(".media-player", e),
    i = n ? qs(".mp-progress", n) : null;
  i && (i.style.width = 100 * t + "%");
}
function updateProgressLoop(e) {
  if (!TTSPlayer.playing || TTSPlayer.currentFeed !== e) return;
  const t = qs(".media-player", e);
  if (t && "playing" === t.dataset.state) {
    const t = e._ttsData;
    if (t && t.totalWords) {
      const i = (performance.now() - t.startedAt) / 1e3,
        r = Math.max(
          1,
          (t.chunkEndWord || t.totalWords) - (t.startWordOffset || 0),
        ),
        a = Math.max(0.8, t.chunkDuration || r / TTSPlayer.cfg.wordsPerSecond),
        s = Math.min(r, (i / a) * r);
      updateProgress(e, ((t.startWordOffset || 0) + s) / t.totalWords);
    }
    requestAnimationFrame(() => updateProgressLoop(e));
  }
}
async function seekFromClick(e, t) {
  expandIfTruncated(e);
  const n = t.target.closest(".mp-timeline");
  if (!n || !TTS_SUPPORTED) return;
  const i = n.getBoundingClientRect(),
    r = t.clientX - i.left,
    a = Math.max(0, Math.min(1, r / i.width));
  let s = e._ttsData;
  if (
    ((s && s.totalWords) || (prepareCaptionForTTS(e), (s = e._ttsData)),
    !s || !s.totalWords)
  )
    return;
  const o = Math.max(
      0,
      Math.min(s.totalWords - 1, Math.floor(a * s.totalWords)),
    ),
    l = qs(".media-player", e),
    c = l && "playing" === l.dataset.state;
  if (
    ((s.resumeFromWord = o),
    (s.currentWordIndex = o),
    highlightWord(e, o),
    updateProgress(e, o / s.totalWords),
    !c)
  ) {
    l && (l.dataset.state = "paused");
    const e = qs(".mp-play i", l);
    return (e && (e.className = "uil uil-play"), void (TTSPlayer.playing = !1));
  }
  await startReading(e, o);
}
function getVoicesAsync(e = 3e3) {
  return new Promise((t, n) => {
    if (!TTS_SUPPORTED) return void t([]);
    const i = speechSynthesis.getVoices();
    if (i.length) return t(i);
    let r = !1;
    const a = () => {
      if (r) return;
      const e = speechSynthesis.getVoices();
      e.length &&
        ((r = !0),
        speechSynthesis.removeEventListener("voiceschanged", a),
        t(e));
    };
    (speechSynthesis.addEventListener("voiceschanged", a),
      setTimeout(() => {
        if (!r) {
          ((r = !0), speechSynthesis.removeEventListener("voiceschanged", a));
          const e = speechSynthesis.getVoices();
          e.length ? t(e) : n(new Error("No voices loaded"));
        }
      }, e));
  });
}
function chooseBestChineseVoice(e) {
  const t = ["zh-tw", "zh-hant", "zh-cn", "cmn-hant", "cmn", "zh"],
    n = (e || []).filter((e) => {
      const n = (e.lang || "").toLowerCase();
      return t.some((e) => n.startsWith(e));
    });
  if (!n.length) return null;
  function i(e) {
    const t = (e.lang || "").toLowerCase(),
      n = (e.name || "").toLowerCase();
    let i = 0;
    return (
      t.includes("tw") && (i += 10),
      t.includes("hant") && (i += 7),
      t.includes("cn") && (i += 5),
      t.includes("hans") && (i += 3),
      (n.includes("taiwan") || n.includes("tw")) && (i += 3),
      n.includes("google") && (i += 2),
      n.includes("microsoft") && (i += 1),
      e.localService && (i += 1),
      i
    );
  }
  return n.sort((e, t) => i(t) - i(e))[0] || null;
}
async function refreshVoiceSelect() {
  const e = qs("#voiceSelect");
  if (!e || !TTS_SUPPORTED) return;
  let t = [];
  try {
    t = await getVoicesAsync(2500);
  } catch (e) {
    t = speechSynthesis.getVoices() || [];
  }
  const n = ["zh", "cmn", "en"],
    i = t.filter((e) =>
      n.some((t) => (e.lang || "").toLowerCase().startsWith(t.toLowerCase())),
    ),
    r = userVoiceName;
  ((e.innerHTML =
    '<option value="">AI語音：自動</option>' +
    i
      .map(
        (e) =>
          `<option value="${esc(e.name)}"${e.name === r ? " selected" : ""}>${esc(e.name)} (${esc(e.lang)})</option>`,
      )
      .join("")),
    e.addEventListener("change", () => {
      ((userVoiceName = e.value || ""),
        userVoiceName
          ? localStorage.setItem("ttsVoiceName", userVoiceName)
          : localStorage.removeItem("ttsVoiceName"));
    }));
}
function initIntroOverlay() {
  const e = qs("#introHintOverlay"),
    t = qs("#introGotIt"),
    n = qs("#introGoDirect");
  if (!e || !t || !n) return;
  const i = "introHintDismissed";
  (localStorage.getItem(i) || (e.style.display = "flex"),
    t.addEventListener("click", () => {
      ((e.style.display = "none"), localStorage.setItem(i, "1"));
    }),
    n.addEventListener("click", () => {
      ((e.style.display = "none"), localStorage.setItem(i, "1"));
    }));
}
function getFeedItemByElement(e) {
  if (!e) return null;
  const t = String(e.dataset.ts || "").trim();
  if (!t) return null;
  const n = feedArray.find((e) => String((e && e.ts) || "") === t);
  if (n) return n;
  const i = Number(t);
  if (isFinite(i)) {
    const e = feedArray.find((e) => Number(e && e.ts) === i);
    if (e) return e;
  }
  return null;
}
function getCurrentLikeUser() {
  const e = void 0,
    t = void 0;
  return {
    name: String(advCurrentUserName || "您").trim() || "您",
    avatar:
      String(
        advCurrentUserAvatar ||
          _defaultAvatar() ||
          "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
      ).trim() || "https://cdn-icons-png.flaticon.com/128/1828/1828843.png",
  };
}
function stripHtml(e) {
  if ("function" == typeof captionHtmlToText) return captionHtmlToText(e);
  const t = document.createElement("div");
  return (
    (t.innerHTML = e || ""),
    t.querySelectorAll("br").forEach((e) => {
      e.replaceWith(document.createTextNode("\n"));
    }),
    (t.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim()
  );
}
function getShareUrl(e) {
  const t = e.yt;
  return t
    ? "U.ELEARNING" === t
      ? U.ELEARNING
      : "string" == typeof t && t.startsWith("http")
        ? t
        : "string" == typeof t
          ? "https://youtu.be/" + t
          : location.href
    : location.href;
}
async function handleShareAction(e, t) {
  const n = getShareUrl(t),
    i = t.title || t.user || document.title,
    r = (t.caption ? stripHtml(t.caption).slice(0, 80) : "") || i;
  let a = !1;
  if (navigator.share)
    try {
      (await navigator.share({ title: i, text: r, url: n }), (a = !0));
    } catch (e) {}
  if (!a && navigator.clipboard && navigator.clipboard.writeText)
    try {
      (await navigator.clipboard.writeText(n),
        (a = !0),
        alert("已將連結複製到剪貼簿，可自行分享。"));
    } catch (e) {}
  (a || alert("請手動分享此連結：\n" + n),
    a &&
      ("number" != typeof t.shares && (t.shares = 0),
      (t.shares += 1),
      renderAllFeeds()));
}
function initBookmarkMenu() {
  const e = document.querySelector("#mainMenu");
  e &&
    e.addEventListener("click", (e) => {
      const t = e.target.closest(".menu-item[data-menu]");
      if (!t) return;
      const n = t.dataset.menu || "";
      ("home" !== n && "bookmark" !== n) ||
        (e.preventDefault(),
        (activeBookmarkOnly = "bookmark" === n),
        document.querySelectorAll(".menu-item[data-menu]").forEach((e) => {
          e.classList.toggle("active", e === t);
        }),
        applyAllFilters());
    });
}
function initToyMenu() {
  const e = document.body,
    t = window.matchMedia && window.matchMedia("(max-width: 760px)"),
    n = document.querySelector("#mainMenu");
  (e.classList.remove("menu-open"),
    n &&
      n.querySelectorAll(".menu-item").forEach((e) => {
        ((e.style.left = ""), (e.style.top = ""));
      }));
  const i = document.getElementById("toyMenuBackdrop");
  i && (i.style.display = "none");
  const r = document.getElementById("ScrollToy");
  r &&
    (r.setAttribute("aria-label", "回到頁面上方"),
    r.setAttribute("aria-expanded", "false"),
    r.dataset.scrollTopBound ||
      ((r.dataset.scrollTopBound = "1"),
      r.addEventListener("click", (e) => {
        (e.preventDefault(),
          e.stopPropagation(),
          window.scrollTo({ top: 0, behavior: "smooth" }));
      }),
      r.addEventListener("keydown", (e) => {
        ("Enter" !== e.key && " " !== e.key) ||
          (e.preventDefault(), window.scrollTo({ top: 0, behavior: "smooth" }));
      })));
  const a = () => {
    (e.classList.remove("menu-open"),
      n &&
        n.querySelectorAll(".menu-item").forEach((e) => {
          ((e.style.left = ""), (e.style.top = ""));
        }));
  };
  (window.addEventListener("resize", a, { passive: !0 }),
    t && t.addEventListener && t.addEventListener("change", a));
}
function initFeedActions() {
  document.addEventListener("click", async (e) => {
    const t = e.target.closest(".feed-actions span[data-action]");
    if (!t) return;
    const n = t.closest(".feed");
    if (!n || !n.dataset.ts) return;
    const i = getFeedItemByElement(n);
    if (!i) return;
    const r = t.dataset.action;
    if ("like" === r) {
      const e = getCurrentLikeUser(),
        t = (i.likeName = Array.isArray(i.likeName) ? i.likeName : []),
        n = (i.likeAvatars = Array.isArray(i.likeAvatars) ? i.likeAvatars : []),
        r = t.indexOf(e.name);
      if (-1 === r)
        (t.push(e.name), -1 === n.indexOf(e.avatar) && n.push(e.avatar));
      else {
        t.splice(r, 1);
        const i = n.indexOf(e.avatar);
        -1 !== i && n.splice(i, 1);
      }
      ((i.likes = t.length), renderAllFeeds());
    } else if ("comment" === r) {
      const e = n.querySelector(".feed-comments");
      if (e) {
        const t =
          "none" === e.style.display || "none" === getComputedStyle(e).display;
        e.style.display = t ? "block" : "none";
      }
    } else
      "bookmark" === r
        ? ((i.bookmarked = !i.bookmarked), renderAllFeeds())
        : "share" === r && (await handleShareAction(n, i));
  });
}
function initCaptionExpander() {
  document.addEventListener("click", (e) => {
    const t = e.target.closest('button[data-action="expand-caption"]');
    if (!t) return;
    const n = t.closest(".feed");
    n && expandIfTruncated(n);
  });
}
function initClearTopicFilterReset() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#clearTopicFilter")) return;
    const n = qs("#topicGroupSelect"),
      i = qs("#topicSubSelect"),
      r = qs("#navTopicPill");
    (n && (n.value = ""),
      i &&
        ((i.innerHTML = '<option value="">全部專欄</option>'),
        (i.disabled = !0),
        (i.value = "")),
      r && ((r.style.display = "none"), (r.textContent = "")));
  });
}
class ScrollToy {
  constructor(e) {
    ((this.srcs = e),
      (this.frame = 0),
      (this.y = 0),
      (this.vy = 0),
      (this.raf = 0),
      (this.lastScrollY = window.scrollY),
      (this.lastScrollT = performance.now()),
      (this.lastFrameT = performance.now()),
      (this.wasAir = !1),
      (this.gDesktop = 7500),
      (this.capYDesktop = 240),
      (this.capVDesktop = 1800),
      (this.gHome = 9e3),
      (this.capYHome = 120),
      (this.capVHome = 1200),
      (this.g = this.gDesktop),
      (this.capY = this.capYDesktop),
      (this.capV = this.capVDesktop),
      (this.reduce = !(
        !window.matchMedia ||
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )),
      (this.el = null),
      (this.body = null),
      (this.img = null),
      (this.dock = ""),
      (this.mainEl = null),
      (this.homeEl = null),
      (this.stepBound = (e) => this.step(e)),
      (this.resizeBound = () => this.updateDock(!0)));
  }
  updateMobileToySize() {
    if (!this.el || !this.img) return;
    const e = document.querySelector("#mainMenu"),
      t = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
      ),
      n = getComputedStyle(document.documentElement),
      i = parseFloat(n.getPropertyValue("--mobile-edge-gap")) || 10;
    let r = 0;
    if (e) {
      const t = e.getBoundingClientRect();
      r = t && t.width ? t.width : 0;
    }
    const a = Math.max(42, Math.floor(t - r - 2 * i)),
      s = 132,
      o = Math.max(48, Math.floor(Math.min(0.28 * t, s))),
      l = Math.max(42, Math.min(a, o, s));
    document.documentElement.style.setProperty(
      "--scroll-toy-mobile-size",
      l + "px",
    );
  }
  mount() {
    const e = document.createElement("div");
    ((e.id = "ScrollToy"),
      (e.className = "toy-main"),
      e.setAttribute("role", "button"),
      e.setAttribute("tabindex", "0"),
      e.setAttribute("aria-label", "開啟選單"),
      e.setAttribute("aria-expanded", "false"));
    const t = document.createElement("div");
    t.id = "ScrollToyBody";
    const n = document.createElement("img");
    ((n.id = "ScrollToyImg"),
      (n.alt = ""),
      (n.decoding = "async"),
      (n.loading = "eager"),
      (n.src = this.srcs[0]),
      t.appendChild(n),
      e.appendChild(t),
      document.body.appendChild(e),
      (this.el = e),
      (this.body = t),
      (this.img = n));
    for (let e = 1; e < this.srcs.length; e++) {
      new Image().src = this.srcs[e];
    }
    return (
      (this.mainEl =
        document.querySelector("main.main") || document.querySelector(".main")),
      (this.homeEl = document.querySelector('.menu-item[data-menu="home"]')),
      this.updateDock(!0),
      window.addEventListener("resize", this.resizeBound, { passive: !0 }),
      this
    );
  }
  setFrame(e) {
    ((this.frame = (e + this.srcs.length) % this.srcs.length),
      this.img && (this.img.src = this.srcs[this.frame]));
  }
  setDockPhysics() {
    "home" === this.dock || "mobile" === this.dock
      ? ((this.g = this.gHome),
        (this.capY = this.capYHome),
        (this.capV = this.capVHome))
      : ((this.g = this.gDesktop),
        (this.capY = this.capYDesktop),
        (this.capV = this.capVDesktop));
  }
  positionToMain() {
    if (!this.el || !this.img) return;
    const e =
      this.mainEl ||
      document.querySelector("main.main") ||
      document.querySelector(".main");
    if (!e) return void (this.el.style.left = "18px");
    const t = e.getBoundingClientRect(),
      n = this.img.getBoundingClientRect().width || 132;
    let r = Math.round(t.left + 6) - n;
    ((r = Math.max(8, Math.min(r, window.innerWidth - n - 8))),
      (this.el.style.left = r + "px"));
  }
  dockMain() {
    this.el &&
      (this.el.parentElement !== document.body &&
        document.body.appendChild(this.el),
      this.homeEl && this.homeEl.classList.remove("has-toy"),
      this.el.classList.remove("toy-home", "toy-mobile"),
      this.el.classList.add("toy-main"),
      (this.el.style.bottom = "calc(env(safe-area-inset-bottom) + 14px)"),
      (this.el.style.top = ""),
      (this.el.style.transform = ""),
      (this.dock = "main"),
      this.setDockPhysics(),
      this.positionToMain());
  }
  dockHome() {
    const e =
      this.homeEl || document.querySelector('.menu-item[data-menu="home"]');
    this.el && e
      ? (e.classList.add("has-toy"),
        this.el.parentElement !== e && e.appendChild(this.el),
        this.el.classList.remove("toy-main", "toy-mobile"),
        this.el.classList.add("toy-home"),
        (this.el.style.left = ""),
        (this.el.style.right = ""),
        (this.el.style.bottom = ""),
        (this.el.style.top = ""),
        (this.dock = "home"),
        this.setDockPhysics())
      : this.dockMain();
  }
  dockMobile() {
    this.el &&
      (this.el.parentElement !== document.body &&
        document.body.appendChild(this.el),
      this.homeEl && this.homeEl.classList.remove("has-toy"),
      this.el.classList.remove("toy-home", "toy-main"),
      this.el.classList.add("toy-mobile"),
      (this.el.style.left = ""),
      (this.el.style.right = ""),
      (this.el.style.bottom = ""),
      (this.el.style.top = ""),
      (this.el.style.transform = ""),
      this.updateMobileToySize(),
      (this.dock = "mobile"),
      this.setDockPhysics());
  }
  updateDock(e = !1) {
    !(!window.matchMedia || !window.matchMedia("(max-width: 760px)").matches)
      ? "mobile" !== this.dock || e
        ? this.dockMobile()
        : this.updateMobileToySize()
      : (("main" !== this.dock || e) && this.dockMain(), this.positionToMain());
  }
  kick(e) {
    if (this.reduce) return;
    const t =
      "home" === this.dock || "mobile" === this.dock
        ? Math.min(this.capV, Math.max(260, 1400 * e))
        : Math.min(this.capV, Math.max(340, 1600 * e));
    ((this.vy = Math.max(this.vy, t)),
      this.setFrame(this.frame + 1),
      this.raf ||
        ((this.lastFrameT = performance.now()),
        (this.raf = requestAnimationFrame(this.stepBound))));
  }
  step(e) {
    const t = Math.min(0.034, (e - this.lastFrameT) / 1e3);
    ((this.lastFrameT = e),
      (this.vy -= this.g * t),
      (this.y += this.vy * t),
      this.y < 0 && ((this.y = 0), (this.vy = 0)),
      this.y > this.capY &&
        ((this.y = this.capY), this.vy > 0 && (this.vy = 0)),
      (this.body.style.transform =
        "translate3d(0," + (-this.y).toFixed(1) + "px,0)"));
    const n = this.y > 0;
    (!n && this.wasAir && ((this.wasAir = !1), this.setFrame(0)),
      n && (this.wasAir = !0),
      this.y > 0 || Math.abs(this.vy) > 1
        ? (this.raf = requestAnimationFrame(this.stepBound))
        : (this.raf = 0));
  }
  onScroll() {
    const e = performance.now(),
      t = window.scrollY,
      n = t - this.lastScrollY,
      i = Math.max(16, e - this.lastScrollT);
    ((this.lastScrollY = t),
      (this.lastScrollT = e),
      "main" === this.dock && this.positionToMain(),
      n > 0 && this.kick(n / i));
  }
  start() {
    return (
      window.addEventListener("scroll", () => this.onScroll(), { passive: !0 }),
      this
    );
  }
}
function initScrollToy() {
  const e = "undefined" != typeof toy && Array.isArray(toy) ? toy : null,
    t = [
      "system/toy1.png",
      "system/toy2.png",
      "system/toy3.png",
      "system/toy4.png",
    ].map((e) =>
      "function" == typeof window.cchCdnUrl ? window.cchCdnUrl(e) : e,
    ),
    n = (e && e.length ? e : t)
      .map((e) => ("string" == typeof e ? e : (e && e.src) || ""))
      .filter(Boolean);
  if (n.length) {
    if (
      ((window.ScrollToy = ScrollToy),
      window.ScrollToyInstance && window.ScrollToyInstance.el)
    )
      return (
        (window.ScrollToyInstance.srcs = n),
        (window.ScrollToyInstance.i = 0),
        void (
          window.ScrollToyInstance.img &&
          (window.ScrollToyInstance.img.src = n[0])
        )
      );
    window.ScrollToyInstance = new ScrollToy(n).mount().start();
  }
}
function buildYtIframe(e, t = 0, n = !1) {
  const i = document.createElement("iframe");
  let r = U.YT_EMBED(e);
  try {
    const e = new URL(r, location.href);
    (e.searchParams.set("enablejsapi", "1"),
      e.searchParams.set("playsinline", "1"),
      location.origin &&
        /^https?:/i.test(location.origin) &&
        e.searchParams.set("origin", location.origin),
      (t = Math.max(0, Math.floor(Number(t) || 0))) > 0 &&
        e.searchParams.set("start", String(t)),
      n && e.searchParams.set("autoplay", "1"),
      (r = e.toString()));
  } catch (e) {
    const i = r.includes("?") ? "&" : "?";
    r +=
      i +
      "enablejsapi=1" +
      (t ? "&start=" + Math.floor(t) : "") +
      (n ? "&autoplay=1" : "");
  }
  return (
    (i.src = r),
    (i.loading = "lazy"),
    (i.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),
    (i.allowFullscreen = !0),
    (i.referrerPolicy = "strict-origin-when-cross-origin"),
    (i.title = "YouTube"),
    i
  );
}
function activateYtLazy(e, t = 0, n = !1) {
  try {
    const i = String((e && e.dataset && e.dataset.ytId) || "").trim(),
      r = e.closest(".video-wrapper"),
      a = String(
        (e && e.dataset && (e.dataset.courseLink || e.dataset.link)) ||
          (r && r.dataset && r.dataset.courseLink) ||
          "",
      ).trim();
    if (!i) return void (a && window.open(a, "_blank", "noopener"));
    if (!r || "1" === r.dataset.loaded) return;
    ((r.dataset.loaded = "1"),
      (r.innerHTML = ""),
      r.appendChild(buildYtIframe(i, t, n)));
  } catch (e) {}
}
function initLazyYoutubeEmbeds() {
  (document.addEventListener("click", (e) => {
    const t =
      e.target && e.target.closest ? e.target.closest(".yt-lazy") : null;
    t && (e.preventDefault(), activateYtLazy(t, 0, !0));
  }),
    document.addEventListener("keydown", (e) => {
      if ("Enter" !== e.key && " " !== e.key) return;
      const t =
        e.target && e.target.closest ? e.target.closest(".yt-lazy") : null;
      t && (e.preventDefault(), activateYtLazy(t, 0, !0));
    }));
}
function init() {
  const e = (e) => {
    try {
      e && e();
    } catch (e) {}
  };
  (e(initStaticImages),
    e(initScrollToy),
    e(initToyMenu),
    e(renderNotifs),
    e(initNotifications),
    e(initTheme),
    e(initAppToggle),
    e(initKeyboard),
    e(initDaysCountdown),
    e(initLinkButtons),
    e(initFeedMoreMenu),
    e(initStories),
    e(initLazyYoutubeEmbeds),
    e(initAiYoutubeTools),
    e(initQuickLinks),
    e(initAdvancedEditor),
    e(initAdvPlaceAI));
  try {
    "function" == typeof window.initFeedSourcePicker &&
      window.initFeedSourcePicker();
  } catch (e) {}
  (e(initFocusToggle),
    e(initAdvImageManager),
    e(initAdvUsers),
    e(initLikeAvatarButton),
    e(initTopics),
    e(initPosting),
    e(initTopicPillFiltering),
    e(initGlobalSearch));
  try {
    "function" == typeof __renderAllFeedsIfReady
      ? __renderAllFeedsIfReady()
      : renderAllFeeds();
  } catch (e) {}
  (e(refreshVoiceSelect),
    e(initIntroOverlay),
    e(initIntroHint),
    e(initNavTopicFilter),
    e(initBookmarkMenu),
    e(initFeedGeoToggle),
    e(initFeedActions),
    e(initCaptionExpander),
    e(initClearTopicFilterReset));
}
"loading" === document.readyState
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
