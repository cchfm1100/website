(() => {
  if (window.__CCH_ADV_NOTE_PATCH__) return;
  window.__CCH_ADV_NOTE_PATCH__ = true;
  const NOTE_USER_ID = "User0000005",
    NOTE_DEFAULT_TOPICS =
      "impactfactor::點擊分析 | fm::RAKEL Textbook of Family Medicine",
    NOTE_OUTPUT_DB = "result.sqlite",
    VIDEO_ACCEPT =
      "video/*,audio/*,image/*,.mp4,.mkv,.mov,.avi,.wmv,.webm,.m4v,.ts,.mts,.m2ts,.flv,.mp3,.wav,.m4a,.aac,.flac,.ogg,.oga,.opus,.wma,.aiff,.aif,.amr,.mka,.weba,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tif,.tiff,.docx,.pptx,.xlsx,.pdf,.txt,.md,.markdown,.csv,.tsv,.json,.jsonl,.html,.htm,.rtf,.doc,.ppt,.xls";
  let notePollTimer = null,
    noteActiveJobIds = [],
    noteRunning = false,
    noteCancelling = false,
    noteCancelRequested = false,
    noteRunAbort = null,
    noteCurrentMeta = null,
    noteUiRunStartedAt = 0,
    noteLocalPaths = [];
  function $(s, r) {
    try {
      return typeof qs === "function"
        ? qs(s, r || document)
        : (r || document).querySelector(s);
    } catch (e) {
      return (r || document).querySelector(s);
    }
  }
  function $all(s, r) {
    try {
      return typeof qsa === "function"
        ? qsa(s, r || document)
        : Array.from((r || document).querySelectorAll(s));
    } catch (e) {
      return Array.from((r || document).querySelectorAll(s));
    }
  }
  function h(v) {
    try {
      return typeof esc === "function"
        ? esc(v)
        : String(v == null ? "" : v).replace(
            /[&<>"']/g,
            (m) =>
              ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
              })[m],
          );
    } catch (e) {
      return String(v == null ? "" : v);
    }
  }
  function ready(fn) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function addNoteStyles() {
    if (document.getElementById("advNoteStyle")) return;
    const st = document.createElement("style");
    st.id = "advNoteStyle";
    st.textContent = `#advNoteBtn i{font-size:1rem}#advNoteBtn.active{background:var(--grad-primary);color:#fff;border-color:var(--c-primary)}.adv-note-backdrop{position:fixed;inset:0;z-index:4300;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,.38);backdrop-filter:blur(12px) saturate(160%);animation:fadeIn .18s ease}.adv-note-backdrop.hide{display:none}.adv-note-dialog{width:min(820px,94vw);max-height:min(88vh,900px);overflow:auto;background:var(--c-bg-alt);color:var(--c-text);border:1px solid var(--c-border);border-radius:var(--r-xl);box-shadow:var(--shadow-lg);padding:1rem;display:flex;flex-direction:column;gap:.85rem}.adv-note-head{display:flex;align-items:center;justify-content:space-between;gap:.75rem}.adv-note-title{display:flex;align-items:center;gap:.5rem;font-size:1rem;font-weight:900;letter-spacing:.5px}.adv-note-title i{color:var(--c-primary);font-size:1.2rem}.adv-note-close{width:42px;height:42px;border-radius:50%}.adv-note-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.72rem}.adv-note-field{display:flex;flex-direction:column;gap:.32rem;font-size:.72rem;font-weight:800;letter-spacing:.35px;color:var(--c-text-soft)}.adv-note-field.full{grid-column:1/-1}.adv-note-field input,.adv-note-field textarea,.adv-note-field select{width:100%;border:1px solid var(--c-border);background:var(--c-bg-soft);color:var(--c-text);border-radius:var(--r-md);padding:.68rem .78rem;font:inherit;font-size:.82rem;font-weight:700;outline:none;transition:var(--trans);font-family:var(--font-stack)}.adv-note-field textarea{min-height:88px;resize:vertical;line-height:1.55}.adv-note-field input:focus,.adv-note-field textarea:focus,.adv-note-field select:focus{border-color:var(--c-primary);background:var(--c-bg-alt);box-shadow:0 0 0 4px color-mix(in oklab,var(--c-primary),transparent 86%)}.adv-note-input-row{display:grid;grid-template-columns:1fr auto;gap:.45rem;align-items:center}.adv-note-source-tabs{display:flex;gap:.45rem;flex-wrap:wrap}.adv-note-source-tabs button{border:1px solid var(--c-border);background:var(--c-bg-soft);color:var(--c-text);border-radius:999px;padding:.55rem .85rem;font-size:.78rem;font-weight:900;letter-spacing:.35px;cursor:pointer;transition:var(--trans)}.adv-note-source-tabs button.active{background:var(--grad-primary);border-color:var(--c-primary);color:#fff;box-shadow:0 10px 26px -16px rgba(0,137,39,.65)}.adv-note-hide{display:none!important}.adv-note-avatar-row{display:flex;flex-direction:column;gap:.7rem;padding:.72rem;border:1px dashed var(--c-border);border-radius:var(--r-lg);background:color-mix(in oklab,var(--c-bg-soft),transparent 20%)}.adv-note-selected-user{display:flex;align-items:center;gap:.72rem}.adv-note-selected-user img{width:58px;height:58px;border-radius:50%;object-fit:cover;border:3px solid var(--c-bg-alt);box-shadow:var(--shadow-sm)}.adv-note-selected-user b{display:block;font-size:.86rem;font-weight:950;color:var(--c-text);letter-spacing:.35px}.adv-note-selected-user small,.adv-note-avatar-row small{display:block;margin-top:.16rem;font-size:.66rem;font-weight:700;color:var(--c-text-soft);letter-spacing:.3px}.adv-note-user-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.42rem;max-height:210px;overflow:auto;padding:.25rem}.adv-note-user-list label{display:flex;align-items:center;gap:.45rem;border:1px solid var(--c-border);background:var(--c-bg-alt);border-radius:999px;padding:.35rem .55rem;cursor:pointer;min-width:0;transition:var(--trans)}.adv-note-user-list label:has(input:checked),.adv-note-user-list label.active{border-color:var(--c-primary);box-shadow:0 0 0 3px color-mix(in oklab,var(--c-primary),transparent 86%);background:color-mix(in oklab,var(--c-primary),transparent 92%)}.adv-note-user-list input{width:auto!important;accent-color:var(--c-primary)}.adv-note-user-list img{width:28px;height:28px;border-radius:50%;object-fit:cover;flex:0 0 auto}.adv-note-user-list span{font-size:.72rem;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.adv-note-hidden-source{display:none!important}.adv-note-topic-picker{grid-column:1/-1;border:1px solid var(--c-border);border-radius:var(--r-lg);padding:.68rem;background:var(--c-bg-soft)}.adv-note-topic-list{display:none!important;margin-top:.62rem;max-height:320px;overflow:auto;gap:.45rem;padding:.1rem}.adv-note-topic-list.open{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(128px,1fr))}.adv-note-topic-list .topic-group{min-width:0!important;border:1px solid var(--c-border);border-radius:var(--r-md);padding:.28rem;background:var(--c-bg-alt);overflow:hidden}.adv-note-topic-list .topic-group.open{grid-column:1/-1;border-color:var(--topic-color,var(--c-primary));box-shadow:0 0 0 3px color-mix(in oklab,var(--topic-color,var(--c-primary)),transparent 88%)}.adv-note-topic-list .topic-main{width:100%;display:flex;align-items:center;justify-content:space-between;border:0;background:transparent;color:var(--c-text);font-weight:950;text-align:left;padding:.42rem .5rem;border-radius:var(--r-sm);cursor:pointer}.adv-note-topic-list .topic-main::after{content:"展開";font-size:.6rem;font-weight:900;color:var(--c-text-soft);letter-spacing:.35px}.adv-note-topic-list .topic-group.open .topic-main::after{content:"收合"}.adv-note-topic-list .topic-group.has-checked .topic-main{color:var(--topic-color,var(--c-primary))}.adv-note-topic-list .topic-group.has-checked:not(.open).topic-main::after{content:"已選";color:var(--topic-color,var(--c-primary))}.adv-note-topic-list .topic-group:not(.open).topic-sublist{display:none!important}.adv-note-topic-list .topic-group.open .topic-sublist{display:flex!important;flex-wrap:wrap;gap:.35rem;padding:.35rem .25rem .15rem}.adv-note-topic-list .topic-sub{border:1px solid color-mix(in oklab,var(--topic-color,var(--c-primary)),transparent 72%);border-radius:999px;background:color-mix(in oklab,var(--topic-color,var(--c-primary)),transparent 94%);padding:.22rem .48rem}.adv-note-topic-display span.note-chip{display:inline-flex;align-items:center;gap:.25rem;margin:.12rem .18rem .12rem 0;padding:.23rem .48rem;border-radius:999px;background:color-mix(in oklab,var(--topic-color,#008927),transparent 86%);border:1px solid color-mix(in oklab,var(--topic-color,#008927),transparent 55%);color:var(--c-text);font-size:.68rem;font-weight:900}.adv-note-actions{display:flex;justify-content:flex-end;align-items:center;gap:.55rem;flex-wrap:wrap}.adv-note-actions button,.adv-note-mini{border:1px solid var(--c-border);background:var(--c-bg-soft);color:var(--c-text);font-weight:900;font-size:.82rem;letter-spacing:.45px;border-radius:999px;padding:.62rem 1rem;cursor:pointer;transition:var(--trans);white-space:nowrap}.adv-note-actions button.primary{background:var(--grad-primary);border-color:var(--c-primary);color:#fff;box-shadow:0 8px 22px -12px rgba(0,137,39,.55)}.adv-note-actions button:disabled,.adv-note-mini:disabled{opacity:.58;cursor:wait;transform:none}.adv-note-actions button:hover,.adv-note-mini:hover{transform:translateY(-1px);border-color:var(--c-primary)}.adv-note-status{display:none;flex:1 1 100%;order:-1;border:0;background:transparent!important;border-radius:0;padding:.05rem .12rem .25rem;white-space:normal;font-size:.78rem;font-weight:750;color:var(--c-text-soft)}.adv-note-status.show{display:block}.adv-note-status pre{margin:.45rem 0 0;max-height:220px;overflow:auto;white-space:pre-wrap;word-break:break-word;font-size:.7rem;line-height:1.45;background:transparent!important;border:0;padding:.2rem 0;color:var(--c-text)}.adv-note-files{font-size:.72rem;font-weight:800;color:var(--c-text-soft);line-height:1.5}.adv-note-file-picker{display:flex;align-items:center;justify-content:center;gap:.45rem;border:1px dashed var(--c-border-strong);background:var(--c-bg-alt);color:var(--c-text);border-radius:var(--r-lg);padding:.9rem;font-size:.84rem;font-weight:950;letter-spacing:.35px;cursor:pointer;transition:var(--trans)}.adv-note-file-picker:hover{border-color:var(--c-primary);box-shadow:0 0 0 4px color-mix(in oklab,var(--c-primary),transparent 88%)}.adv-note-file-input{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}.adv-note-details{border:1px solid var(--c-border);border-radius:var(--r-lg);padding:.65rem .75rem;background:var(--c-bg-soft)}.adv-note-details summary{font-size:.76rem;font-weight:900;cursor:pointer;color:var(--c-text);display:flex;align-items:center;justify-content:space-between;gap:.75rem}.adv-note-details summary small{font-size:.62rem;color:var(--c-text-soft);font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.adv-note-details .adv-note-grid{margin-top:.7rem}.adv-note-main-settings:not([open]).adv-note-grid{display:none!important}@media (max-width:720px){.adv-note-grid,.adv-note-input-row{grid-template-columns:1fr}.adv-note-selected-user img{width:48px;height:48px}.adv-note-dialog{max-height:92vh;border-radius:var(--r-lg)}.adv-note-user-list{grid-template-columns:1fr 1fr;max-height:180px}.adv-note-topic-list.open{grid-template-columns:1fr}.adv-note-details summary{align-items:flex-start;flex-direction:column;gap:.2rem}.adv-note-details summary small{white-space:normal}}.adv-note-avatar-row{position:relative}.adv-note-selected-user{width:100%;border:0;background:transparent;color:inherit;text-align:left;border-radius:var(--r-md);padding:.25rem;cursor:pointer;transition:var(--trans)}.adv-note-selected-user:hover{background:color-mix(in oklab,var(--c-primary),transparent 94%)}.adv-note-selected-user[aria-expanded="true"]{box-shadow:0 0 0 3px color-mix(in oklab,var(--c-primary),transparent 86%)}.adv-note-user-list{display:none!important;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:.42rem;max-height:250px;overflow:auto;padding:.55rem;background:var(--c-bg-alt);border:1px solid var(--c-border);border-radius:var(--r-lg);box-shadow:var(--shadow-lg);position:absolute;left:.72rem;right:.72rem;top:calc(100% - .25rem);z-index:4600}.adv-note-user-list.open{display:grid!important}.adv-note-user-list input{position:absolute!important;opacity:0!important;pointer-events:none!important}.adv-note-topic-picker{grid-column:1/-1;border:0!important;border-radius:0!important;padding:0!important;background:transparent!important}.adv-note-topic-list{display:none!important;margin-top:.55rem!important;max-height:none!important;overflow:visible!important;gap:.6rem!important;padding:.5rem .6rem!important}.adv-note-topic-list.open{display:flex!important;grid-template-columns:none!important}.adv-note-topic-list .topic-group{position:relative!important;display:inline-flex!important;flex-direction:column!important;align-items:flex-start!important;min-width:0!important;border:0!important;border-radius:0!important;padding:0!important;background:transparent!important;overflow:visible!important}.adv-note-topic-list .topic-group.open{grid-column:auto!important;border-color:transparent!important;box-shadow:none!important}.adv-note-topic-list .topic-main{width:auto!important;display:inline-flex!important;align-items:center!important;justify-content:flex-start!important;gap:.35rem!important;padding:.4rem .75rem!important;border-radius:999px!important;border:1px solid color-mix(in oklab,var(--topic-color,var(--c-primary)),transparent 30%)!important;background:color-mix(in oklab,var(--topic-color,var(--c-primary)) 16%,var(--c-bg-soft) 84%)!important;font-size:.72rem!important;font-weight:700!important;letter-spacing:.5px!important;color:var(--c-text)!important;box-shadow:0 2px 6px -3px rgba(0,0,0,.25)!important;text-align:left!important}.adv-note-topic-list .topic-main::after,.adv-note-topic-list .topic-group.open .topic-main::after,.adv-note-topic-list .topic-group.has-checked:not(.open).topic-main::after{content:"▾"!important;font-size:.6rem!important;opacity:.75!important;color:inherit!important}.adv-note-topic-list .topic-group.open .topic-main,.adv-note-topic-list .topic-main:hover{transform:translateY(-1px)!important;box-shadow:0 6px 18px -8px rgba(0,0,0,.35)!important;border-color:var(--topic-color,var(--c-primary))!important}.adv-note-topic-list .topic-sublist{position:absolute!important;top:110%!important;left:0!important;display:none!important;flex-direction:column!important;align-items:stretch!important;flex-wrap:nowrap!important;gap:.3rem!important;padding:.45rem .5rem!important;min-width:180px!important;max-height:260px!important;overflow:auto!important;border-radius:.85rem!important;background:var(--c-bg-alt)!important;border:1px solid var(--c-border)!important;box-shadow:var(--shadow-lg)!important;z-index:4700!important}.adv-note-topic-list .topic-group:hover .topic-sublist,.adv-note-topic-list .topic-group.open .topic-sublist{display:flex!important}.adv-note-topic-list .topic-sub{position:relative!important;display:flex!important;align-items:center!important;gap:.3rem!important;padding:.3rem .55rem!important;border-radius:.8rem!important;cursor:pointer!important;font-size:.68rem!important;font-weight:600!important;letter-spacing:.5px!important;color:var(--c-text-soft)!important;border:1px solid color-mix(in oklab,var(--topic-color,var(--c-border)),transparent 30%)!important;background:color-mix(in oklab,var(--topic-color,var(--c-bg-soft)),transparent 80%)!important;transition:var(--trans)!important}.adv-note-topic-list .topic-sub:hover{border-color:var(--topic-color,var(--c-primary))!important;color:var(--c-text)!important;transform:translateY(-1px)!important}.adv-note-topic-list .topic-sub.selected{background:color-mix(in oklab,var(--topic-color,var(--c-primary)) 30%,var(--c-bg-alt) 70%)!important;color:#fff!important;border-color:var(--topic-color,var(--c-primary))!important;box-shadow:0 4px 14px -6px rgba(0,0,0,.45)!important}.adv-note-topic-display .topic-chip{margin:.12rem .18rem .12rem 0}@media (max-width:720px){.adv-note-user-list{position:static;grid-template-columns:1fr 1fr;max-height:180px}.adv-note-topic-list.open{display:flex!important;grid-template-columns:none!important}}.adv-note-backdrop{padding:clamp(.45rem,2vw,1rem)!important;background:radial-gradient(circle at 20% 10%,color-mix(in oklab,var(--c-primary),transparent 55%),transparent 34%),radial-gradient(circle at 88% 18%,rgba(236,72,153,.24),transparent 32%),rgba(15,23,42,.44)!important;backdrop-filter:blur(16px) saturate(175%)!important}.adv-note-dialog{width:min(660px,94vw)!important;max-height:min(82vh,720px)!important;overflow:auto!important;padding:0!important;gap:0!important;border:0!important;border-radius:1.35rem!important;background:linear-gradient(180deg,color-mix(in oklab,var(--c-bg-alt),white 4%),var(--c-bg-alt) 38%,color-mix(in oklab,var(--c-bg-soft),var(--c-bg-alt) 44%))!important;box-shadow:0 28px 92px -42px rgba(0,0,0,.58),0 0 0 1px color-mix(in oklab,var(--c-border),transparent 20%)!important}.adv-note-head{position:sticky!important;top:0!important;z-index:12!important;padding:.82rem .92rem!important;background:var(--c-primary);box-shadow:0 14px 30px -24px rgba(0,0,0,.72)!important}.adv-note-title{gap:.64rem!important}.adv-note-title i{width:2.2rem!important;height:2.2rem!important;border-radius:.85rem!important;display:grid!important;place-items:center!important;background:rgba(255,255,255,.18)!important;color:#fff!important;font-size:1.25rem!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)!important}.adv-note-title-copy{display:flex!important;flex-direction:column!important;gap:.08rem!important;line-height:1.1!important}.adv-note-title-copy span{font-size:1rem!important;font-weight:950!important;letter-spacing:.5px!important}.adv-note-title-copy small{font-size:.66rem!important;font-weight:800!important;letter-spacing:.28px!important;color:rgba(255,255,255,.78)!important}.adv-note-close{background:rgba(255,255,255,.14)!important;border:1px solid rgba(255,255,255,.2)!important;color:#fff!important}.adv-note-close:hover{background:rgba(255,255,255,.24)!important;transform:translateY(-1px)!important}.adv-note-avatar-row,.adv-note-source-tabs,#advNoteUrlWrap,#advNoteFileWrap,.adv-note-details{margin-left:.82rem!important;margin-right:.82rem!important}.adv-note-avatar-row{margin-top:.82rem!important;padding:.52rem!important;border:1px solid color-mix(in oklab,var(--c-primary),transparent 80%)!important;border-radius:1.05rem!important;background:linear-gradient(135deg,color-mix(in oklab,var(--c-primary),transparent 90%),color-mix(in oklab,#ec4899,transparent 94%))!important;box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--c-bg-alt),transparent 45%)!important}.adv-note-selected-user{padding:.32rem .42rem!important;border-radius:.9rem!important}.adv-note-selected-user img{width:44px!important;height:44px!important;border-width:2px!important;box-shadow:0 8px 22px -15px rgba(0,0,0,.65)!important}.adv-note-selected-user b{font-size:.82rem!important}.adv-note-selected-user small{font-size:.61rem!important}.adv-note-user-list{left:.55rem!important;right:.55rem!important;top:calc(100% + .42rem)!important;grid-template-columns:repeat(auto-fill,minmax(132px,1fr))!important;max-height:205px!important;padding:.48rem!important;border-radius:1rem!important}.adv-note-source-tabs{margin-top:.72rem!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:.28rem!important;padding:.24rem!important;border-radius:1rem!important;background:color-mix(in oklab,var(--c-bg-soft),var(--c-bg-alt) 35%)!important;border:1px solid var(--c-border)!important}.adv-note-source-tabs button{width:100%!important;border:0!important;background:transparent!important;border-radius:.78rem!important;padding:.58rem .65rem!important;font-size:.76rem!important;display:flex!important;justify-content:center!important;align-items:center!important;gap:.35rem!important;box-shadow:none!important}.adv-note-source-tabs button.active{background:linear-gradient(135deg,var(--c-primary),color-mix(in oklab,var(--c-primary),#2563eb 34%))!important;color:#fff!important;box-shadow:0 10px 24px -16px color-mix(in oklab,var(--c-primary),#000 38%)!important}.adv-note-field.full#advNoteFileWrap,.adv-note-field.full#advNoteUrlWrap{margin-top:.62rem!important;border:1px solid var(--c-border)!important;border-radius:1.05rem!important;background:linear-gradient(180deg,color-mix(in oklab,var(--c-bg-soft),white 3%),var(--c-bg-alt))!important;padding:.62rem!important;box-shadow:0 12px 30px -26px rgba(0,0,0,.5)!important}.adv-note-file-picker{padding:.72rem!important;border-radius:.9rem!important;border-style:solid!important;background:linear-gradient(135deg,color-mix(in oklab,var(--c-primary),transparent 92%),color-mix(in oklab,#f59e0b,transparent 92%))!important}.adv-note-files{font-size:.68rem!important;margin-top:.1rem!important}.adv-note-field textarea{min-height:72px!important}.adv-note-details{margin-top:.62rem!important;padding:0!important;border-radius:1.05rem!important;border:1px solid color-mix(in oklab,var(--c-border),transparent 5%)!important;background:var(--c-bg-alt)!important;overflow:visible!important;box-shadow:0 10px 28px -25px rgba(0,0,0,.58)!important}.adv-note-details summary{min-height:46px!important;padding:.58rem .72rem!important;border-radius:1.02rem!important;background:linear-gradient(135deg,color-mix(in oklab,var(--c-primary),transparent 92%),color-mix(in oklab,var(--c-bg-soft),transparent 6%))!important}.adv-note-details[open]summary{border-bottom:1px solid var(--c-border)!important;border-radius:1.02rem 1.02rem 0 0!important}.adv-note-details summary span{font-size:.78rem!important;font-weight:950!important;letter-spacing:.35px!important}.adv-note-details summary small{max-width:360px!important;font-size:.58rem!important}.adv-note-details .adv-note-grid{margin:0!important;padding:.66rem!important;gap:.55rem!important}.adv-note-field{font-size:.66rem!important;gap:.25rem!important}.adv-note-field input,.adv-note-field textarea,.adv-note-field select{padding:.56rem .64rem!important;border-radius:.78rem!important;font-size:.78rem!important}.adv-note-input-row{gap:.35rem!important}.adv-note-mini{padding:.54rem .74rem!important;font-size:.74rem!important}.adv-note-topic-picker{padding:.5rem!important;border-radius:.9rem!important;background:linear-gradient(180deg,color-mix(in oklab,var(--c-bg-soft),transparent 5%),var(--c-bg-alt))!important}.adv-note-topic-display{min-height:34px!important;max-height:70px!important;overflow:auto!important;padding:.12rem!important}.adv-note-topic-display .topic-chip{font-size:.66rem!important;padding:.2rem .42rem!important}.adv-note-topic-list.open{margin-top:.46rem!important;padding:.38rem!important;border-radius:.88rem!important;max-height:122px!important;overflow:visible!important;align-content:flex-start!important;gap:.38rem!important;background:color-mix(in oklab,var(--c-bg-soft),transparent 15%)!important}.adv-note-topic-list .topic-main{padding:.34rem .58rem!important;font-size:.68rem!important}.adv-note-topic-list .topic-sublist{max-height:210px!important;z-index:4800!important}.adv-note-advanced-settings .adv-note-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important}.adv-note-advanced-settings .adv-note-field span{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.adv-note-actions{position:sticky!important;bottom:0!important;z-index:11!important;margin-top:.7rem!important;padding:.68rem .82rem!important;background:linear-gradient(180deg,transparent,color-mix(in oklab,var(--c-bg-alt),transparent 2%) 20%,var(--c-bg-alt))!important;border-top:1px solid color-mix(in oklab,var(--c-border),transparent 30%)!important}.adv-note-actions button{padding:.58rem .92rem!important;font-size:.78rem!important}.adv-note-actions button.primary{background:linear-gradient(135deg,var(--c-primary),color-mix(in oklab,var(--c-primary),#2563eb 38%))!important}.adv-note-status{font-size:.72rem!important;padding:0!important}.adv-note-status pre{max-height:150px!important;font-size:.66rem!important}@media (max-width:720px){.adv-note-dialog{width:min(94vw,520px)!important;max-height:86vh!important;border-radius:1.1rem!important}.adv-note-head{padding:.72rem!important}.adv-note-avatar-row,.adv-note-source-tabs,#advNoteUrlWrap,#advNoteFileWrap,.adv-note-details{margin-left:.65rem!important;margin-right:.65rem!important}.adv-note-source-tabs{grid-template-columns:1fr!important}.adv-note-advanced-settings .adv-note-grid{grid-template-columns:1fr 1fr!important}.adv-note-topic-list.open{max-height:160px!important;overflow:auto!important}.adv-note-user-list{position:static!important;grid-template-columns:1fr 1fr!important}.adv-note-details summary small{max-width:100%!important;white-space:normal!important}.adv-note-actions{padding:.62rem .65rem!important}}.adv-note-status{display:none!important;flex:1 1 100%!important;order:-1!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;padding:0!important;margin:0 0 .1rem!important;color:var(--c-text)!important;background:transparent!important;border:0!important;white-space:normal!important}.adv-note-status.show{display:block!important}.adv-note-progress-card{border:1px solid color-mix(in oklab,var(--c-border),transparent 15%);border-radius:1rem;background:linear-gradient(135deg,color-mix(in oklab,var(--c-bg-alt),white 3%),color-mix(in oklab,var(--c-bg-soft),var(--c-bg-alt) 45%));box-shadow:0 12px 30px -24px rgba(0,0,0,.28);padding:.72rem .82rem;display:grid;gap:.52rem;overflow:hidden}.adv-note-progress-head{display:flex;align-items:center;justify-content:space-between;gap:.75rem;font-size:.75rem;line-height:1.35}.adv-note-progress-head b{font-size:.78rem;font-weight:950;color:var(--c-text);letter-spacing:.35px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.adv-note-progress-bars{display:grid;gap:.38rem}.adv-note-bar-row{display:grid;gap:.18rem;min-width:0}.adv-note-bar-meta{display:flex;align-items:center;justify-content:space-between;gap:.55rem;font-size:.62rem;line-height:1.25;font-weight:900;letter-spacing:.28px;color:var(--c-text-soft)}.adv-note-bar-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.adv-note-bar-value{font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--c-primary)}.adv-note-bar-row.step .adv-note-bar-value{color:color-mix(in oklab,var(--c-primary),#2563eb 30%)}.adv-note-progress-track{position:relative;height:9px;border-radius:999px;background:color-mix(in oklab,var(--c-primary),transparent 88%);overflow:hidden;border:1px solid color-mix(in oklab,var(--c-primary),transparent 82%)}.adv-note-progress-track i{position:absolute;inset:0 auto 0 0;width:0;min-width:0;border-radius:inherit;background:linear-gradient(90deg,var(--c-primary),color-mix(in oklab,var(--c-primary),#2563eb 34%),color-mix(in oklab,var(--c-primary),white 18%));transition:width .34s ease}.adv-note-progress-card.running .adv-note-progress-track:not(.indeterminate):after{content:"";position:absolute;inset:0;width:38%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.58),transparent);animation:advNoteProgressShine 1.15s linear infinite}.adv-note-progress-track.indeterminate i{width:36%!important;animation:advNoteProgressIndeterminate 1.15s ease-in-out infinite;transition:none!important}.adv-note-progress-track.indeterminate:after{display:none!important}.adv-note-progress-line{display:flex;align-items:flex-start;gap:.42rem;min-width:0;font-size:.72rem;font-weight:850;line-height:1.45;color:var(--c-text-soft)}.adv-note-progress-line i{font-size:.9rem;color:var(--c-primary);margin-top:.05rem;flex:0 0 auto}.adv-note-progress-line span{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.adv-note-progress-line .adv-note-progress-count{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;min-width:auto;max-width:none;overflow:visible;text-overflow:clip;white-space:nowrap;border:1px solid color-mix(in oklab,var(--c-primary),transparent 58%);background:color-mix(in oklab,var(--c-primary),transparent 88%);color:var(--c-primary);border-radius:999px;padding:.03rem .42rem;font-size:.66rem;font-weight:1000;font-variant-numeric:tabular-nums;letter-spacing:.02em}.adv-note-progress-line .adv-note-progress-text{display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.adv-note-progress-card.running .adv-note-progress-line i{animation:advNoteSpin 1s linear infinite}.adv-note-progress-card.done .adv-note-progress-line i{color:var(--c-primary)}.adv-note-progress-card.error{border-color:color-mix(in oklab,var(--c-danger),transparent 45%);background:linear-gradient(135deg,color-mix(in oklab,var(--c-danger),transparent 94%),var(--c-bg-alt))}.adv-note-progress-card.error .adv-note-progress-line i,.adv-note-progress-card.error .adv-note-bar-value{color:var(--c-danger)}.adv-note-progress-card.error .adv-note-progress-track{background:color-mix(in oklab,var(--c-danger),transparent 88%);border-color:color-mix(in oklab,var(--c-danger),transparent 76%)}.adv-note-progress-card.error .adv-note-progress-track i{background:linear-gradient(90deg,var(--c-danger),color-mix(in oklab,var(--c-danger),#f59e0b 30%))}.adv-note-error-text{margin:.15rem 0 0!important;max-height:220px!important;overflow:auto!important;white-space:pre-wrap!important;word-break:break-word!important;font-size:.68rem!important;line-height:1.5!important;background:color-mix(in oklab,var(--c-danger),transparent 93%)!important;border:1px solid color-mix(in oklab,var(--c-danger),transparent 72%)!important;border-radius:.82rem!important;padding:.62rem .7rem!important;color:var(--c-text)!important}@keyframes advNoteProgressShine{0%{transform:translateX(-120%)}100%{transform:translateX(290%)}}@keyframes advNoteProgressIndeterminate{0%{transform:translateX(-120%)}55%{transform:translateX(190%)}100%{transform:translateX(290%)}}@keyframes advNoteSpin{to{transform:rotate(360deg)}}@media (max-width:720px){.adv-note-status{margin-left:0!important;margin-right:0!important}.adv-note-progress-card{padding:.62rem .68rem}.adv-note-progress-line span{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.adv-note-progress-line .adv-note-progress-count{display:inline-flex;white-space:nowrap}.adv-note-progress-line .adv-note-progress-text{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.adv-note-bar-meta{font-size:.6rem}}.adv-note-actions .adv-note-status.show{display:block!important;width:100%!important;max-width:100%!important;margin:0 0 .1rem!important;box-sizing:border-box!important}.adv-note-status .adv-note-progress-card{width:100%!important;max-width:100%!important;box-sizing:border-box!important}@media (max-width:720px){.adv-note-actions .adv-note-status.show{margin-left:0!important;margin-right:0!important}}.adv-note-dialog>.adv-note-status{display:none!important;width:auto!important;max-width:none!important;margin:.62rem .82rem 0!important;padding:0!important;box-sizing:border-box!important;flex:none!important;order:0!important;position:static!important;z-index:auto!important;color:var(--c-text)!important;background:transparent!important;border:0!important;white-space:normal!important}.adv-note-dialog>.adv-note-status.show{display:block!important}.adv-note-dialog>.adv-note-status .adv-note-progress-card{width:100%!important;max-width:100%!important;box-sizing:border-box!important}.adv-note-actions>.adv-note-status{display:none!important}@media (max-width:720px){.adv-note-dialog>.adv-note-status{margin-left:.65rem!important;margin-right:.65rem!important}}.adv-note-progress-percent,.adv-note-activity-count,.adv-note-progress-head,.adv-note-progress-source{display:none!important}.adv-note-progress-line.secondary{font-size:.68rem;color:var(--c-text-soft)}.adv-note-activity{margin:.42rem 0 0;border:1px solid color-mix(in oklab,var(--c-border),transparent 30%);border-radius:.92rem;background:color-mix(in oklab,var(--c-bg-alt),transparent 2%);overflow:hidden}.adv-note-activity summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:.65rem;padding:.56rem .68rem;font-size:.7rem;font-weight:950;color:var(--c-text);user-select:none}.adv-note-activity summary::-webkit-details-marker{display:none}.adv-note-activity-title{display:flex;align-items:center;gap:.38rem;min-width:0}.adv-note-activity-title svg{width:15px;height:15px;color:var(--c-primary);flex:0 0 auto}.adv-note-activity-title span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.adv-note-activity-list{border-top:1px solid color-mix(in oklab,var(--c-border),transparent 38%);padding:.28rem .58rem .58rem;display:grid;gap:.08rem;max-height:260px;overflow:auto}.adv-note-activity-item{display:grid;grid-template-columns:28px minmax(0,1fr);gap:.46rem;position:relative;padding:.34rem 0}.adv-note-activity-item:not(:last-child)::before{content:"";position:absolute;left:13px;top:30px;bottom:-5px;width:1px;background:color-mix(in oklab,var(--c-border),transparent 30%)}.adv-note-activity-node{width:28px;min-height:28px;display:grid;place-items:start center;color:var(--c-primary);position:relative;z-index:1}.adv-note-activity-node svg{width:15px;height:15px;border-radius:999px;padding:3px;background:color-mix(in oklab,var(--c-primary),transparent 90%);border:1px solid color-mix(in oklab,var(--c-primary),transparent 76%);box-sizing:content-box}.adv-note-activity-body{min-width:0;display:grid;gap:.08rem}.adv-note-activity-body b{font-size:.65rem;font-weight:950;color:var(--c-text);line-height:1.3;display:flex;align-items:center;gap:.28rem;min-width:0}.adv-note-activity-body b time{font-size:.54rem;font-weight:900;color:color-mix(in oklab,var(--c-text-soft),transparent 12%);line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums;flex:0 0 auto}.adv-note-activity-body span{font-size:.66rem;line-height:1.38;color:var(--c-text-soft);word-break:break-word}.adv-note-activity-item.error .adv-note-activity-node{border-color:color-mix(in oklab,var(--c-danger),transparent 72%);color:var(--c-danger)}.adv-note-activity-item.error .adv-note-activity-body b{color:var(--c-danger)}.adv-note-activity-item.warning .adv-note-activity-node svg,.adv-note-activity-item.error .adv-note-activity-node svg svg{background:color-mix(in oklab,var(--c-danger),transparent 90%)!important;border-color:color-mix(in oklab,var(--c-danger),transparent 70%)!important;color:var(--c-danger)!important}.adv-note-activity-item.warning .adv-note-activity-body b,.adv-note-activity-item.warning .adv-note-activity-body span,.adv-note-activity-item.error .adv-note-activity-body b,.adv-note-activity-item.error .adv-note-activity-body span{color:var(--c-danger)!important}.adv-note-backdrop.adv-note-running .adv-note-avatar-row,.adv-note-backdrop.adv-note-running .adv-note-dialog>.adv-thumb-url-row,.adv-note-backdrop.adv-note-running #advNoteFilesText,.adv-note-backdrop.adv-note-running .adv-note-details{display:none!important}.adv-note-actions button.danger{background:linear-gradient(135deg,var(--c-danger),color-mix(in oklab,var(--c-danger),#f59e0b 28%))!important;border-color:var(--c-danger)!important;color:#fff!important;box-shadow:0 8px 22px -12px color-mix(in oklab,var(--c-danger),transparent 30%)!important}.adv-note-actions button[data-cancelling="1"]{opacity:.72;cursor:wait}@media (max-width:720px){.adv-note-activity-list{max-height:220px}.adv-note-activity summary{padding:.52rem .6rem}.adv-note-activity-item{grid-template-columns:24px minmax(0,1fr)}}.adv-note-grid>.adv-note-field.full{grid-column:auto!important}.adv-note-picker-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:.45rem!important;align-items:stretch!important}.adv-note-picker-row input,.adv-note-picker-row textarea,.adv-note-picker-row select{min-width:0!important}.adv-note-icon-mini{width:46px!important;min-width:46px!important;height:56px!important;padding:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;border-radius:var(--r-sm)!important;margin-left:auto!important}.adv-note-icon-mini i{font-size:1.18rem!important;line-height:1!important;margin:0!important}.adv-note-input-row>.adv-note-mini{justify-self:end!important;margin-left:auto!important}.adv-note-dialog>.adv-thumb-url-row{align-self:stretch!important;width:auto!important;max-width:none!important;min-height:46px!important;height:46px!important;margin:.62rem .82rem 0!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:.38rem!important;padding:.26rem .32rem .26rem .55rem!important;cursor:default!important;overflow:visible!important;color:var(--c-text)!important;background:color-mix(in oklab,var(--c-primary),transparent 94%)!important;border:1px dashed color-mix(in oklab,var(--c-primary),transparent 35%)!important;border-radius:var(--r-md)!important;box-sizing:border-box!important;box-shadow:none!important;flex:0 0 auto!important}.adv-note-dialog>.adv-thumb-url-row:hover{transform:none!important;box-shadow:var(--shadow-xs)!important}.adv-note-dialog>.adv-thumb-url-row input{min-width:0!important;width:100%!important;height:34px!important;border:0!important;background:transparent!important;color:var(--c-text)!important;font:inherit!important;font-size:.76rem!important;font-weight:800!important;outline:none!important;padding:0!important;box-sizing:border-box!important}.adv-note-dialog>.adv-thumb-url-row input:focus{border-color:transparent!important;background:transparent!important;box-shadow:none!important}.adv-note-dialog>.adv-thumb-url-row input::placeholder{color:var(--c-text-soft)!important;opacity:.78!important}.adv-note-dialog>.adv-thumb-url-row button{width:34px!important;height:34px!important;min-width:34px!important;border-radius:10px!important;border:1px solid var(--c-border)!important;background:var(--c-bg-alt)!important;color:var(--c-primary)!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;justify-self:end!important;padding:0!important;box-sizing:border-box!important}.adv-note-dialog>.adv-thumb-url-row button:hover{border-color:var(--c-primary)!important;background:var(--c-bg-soft)!important;transform:none!important}.adv-note-dialog>.adv-thumb-url-row button i{font-size:1.08rem!important;line-height:1!important;margin:0!important}#advNoteFilesText.adv-note-files{margin:.16rem .82rem .1rem!important;min-height:1.1em!important;font-size:.66rem!important;font-weight:800!important;color:var(--c-text-soft)!important}@media (max-width:720px){.adv-note-grid{grid-template-columns:1fr!important}.adv-note-picker-row{grid-template-columns:minmax(0,1fr) auto!important}.adv-note-dialog>.adv-thumb-url-row{width:auto!important;margin-top:.56rem!important;margin-left:.65rem!important;margin-right:.65rem!important}}
.adv-note-dialog .adv-note-main-settings .adv-note-grid{align-items:start!important}.adv-note-dialog .adv-note-main-settings .adv-note-grid>.adv-note-field.full{grid-column:auto!important}.adv-note-dialog .adv-note-main-settings .adv-note-field,.adv-note-dialog .adv-note-main-settings .adv-note-field.full{min-height:0!important}.adv-note-dialog .adv-note-main-settings .adv-note-picker-row{align-self:stretch!important;width:100%!important;max-width:none!important;min-height:46px!important;height:46px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:.38rem!important;padding:.26rem .32rem .26rem .55rem!important;cursor:default!important;overflow:visible!important;color:var(--c-text)!important;background:color-mix(in oklab,var(--c-primary),transparent 94%)!important;border:1px dashed color-mix(in oklab,var(--c-primary),transparent 35%)!important;border-radius:var(--r-md)!important;box-sizing:border-box!important;box-shadow:none!important}.adv-note-dialog .adv-note-main-settings #advNoteDbPath{min-width:0!important;width:100%!important;height:34px!important;min-height:34px!important;border:0!important;background:transparent!important;color:var(--c-text)!important;font:inherit!important;font-size:.76rem!important;font-weight:800!important;outline:none!important;padding:0!important;border-radius:0!important;box-shadow:none!important;box-sizing:border-box!important}.adv-note-dialog .adv-note-main-settings #advNoteDbPath:focus{border-color:transparent!important;background:transparent!important;box-shadow:none!important}.adv-note-dialog .adv-note-main-settings #advNoteDbPath::placeholder{color:var(--c-text-soft)!important;opacity:.78!important}.adv-note-dialog .adv-note-main-settings #advNoteDbBrowseBtn.adv-note-icon-mini{width:34px!important;height:34px!important;min-width:34px!important;min-height:34px!important;border-radius:10px!important;border:1px solid var(--c-border)!important;background:var(--c-bg-alt)!important;color:var(--c-primary)!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;justify-self:end!important;padding:0!important;margin-left:0!important;box-sizing:border-box!important;transform:none!important}.adv-note-dialog .adv-note-main-settings #advNoteDbBrowseBtn.adv-note-icon-mini:hover{border-color:var(--c-primary)!important;background:var(--c-bg-soft)!important;transform:none!important}.adv-note-dialog .adv-note-main-settings #advNoteDbBrowseBtn.adv-note-icon-mini i{font-size:1.08rem!important;line-height:1!important;margin:0!important}.adv-note-dialog .adv-note-main-settings #advNoteStartDate{height:46px!important;min-height:46px!important;box-sizing:border-box!important}.adv-note-dialog .adv-note-main-settings .adv-note-topic-picker{grid-column:1/-1!important}@media (max-width:720px){.adv-note-dialog .adv-note-main-settings .adv-note-grid>.adv-note-field.full{grid-column:1/-1!important}.adv-note-dialog .adv-note-main-settings .adv-note-picker-row{grid-template-columns:minmax(0,1fr) auto!important}}
`;
    document.head.appendChild(st);
  }
  function domAdvUsers() {
    const out = [];
    $all("#advUserList label").forEach((label) => {
      const input = label.querySelector("input[name=advUserPreset]");
      if (!input) return;
      const img = label.querySelector("img"),
        span = label.querySelector("span");
      const id = String(input.value || label.dataset.id || "").trim();
      if (!id) return;
      out.push({
        id,
        name: String(
          input.dataset.name || (span && span.textContent) || id,
        ).trim(),
        avatar: String(
          input.dataset.avatar || (img && img.getAttribute("src")) || "",
        ).trim(),
      });
    });
    return out;
  }
  function dataAdvUsers() {
    const out = [];
    try {
      const src = window.ADV_USERS || ADV_USERS;
      if (Array.isArray(src))
        src.forEach((u) => {
          if (!u) return;
          const id = String(u.id || u.userId || u.publisherID || "").trim();
          if (id)
            out.push({
              id,
              name: String(u.name || u.title || id).trim(),
              avatar: String(u.avatar || u.avatarURL || u.photo || "").trim(),
            });
        });
      else if (src && typeof src === "object")
        Object.keys(src).forEach((k) => {
          const u = src[k] || {};
          const id = String(
            u.id || u.userId || u.publisherID || k || "",
          ).trim();
          if (id)
            out.push({
              id,
              name: String(u.name || u.title || id).trim(),
              avatar: String(u.avatar || u.avatarURL || u.photo || "").trim(),
            });
        });
    } catch (e) {}
    return out;
  }
  function noteUserRows() {
    const map = new Map();
    [...domAdvUsers(), ...dataAdvUsers()].forEach((u) => {
      if (!u || !u.id) return;
      if (!map.has(u.id)) map.set(u.id, u);
      else {
        const old = map.get(u.id);
        map.set(u.id, {
          id: u.id,
          name: u.name || old.name,
          avatar: u.avatar || old.avatar,
        });
      }
    });
    if (!map.has(NOTE_USER_ID))
      map.set(NOTE_USER_ID, {
        id: NOTE_USER_ID,
        name: "AI整理筆記",
        avatar:
          "https://cdn.jsdelivr.net/gh/cchfm1100/website@20260604/user/User0000001.png",
      });
    return Array.from(map.values());
  }
  function findAdvUser(id) {
    id = String(id || "").trim();
    if (!id) return null;
    try {
      if (typeof _advUserById === "function") {
        const u = _advUserById(id);
        if (u) return u;
      }
    } catch (e) {}
    return noteUserRows().find((u) => String(u.id) === id) || null;
  }
  function currentDbPath() {
    return NOTE_OUTPUT_DB;
  }
  function currentTopics() {
    try {
      if (Array.isArray(selectedTopics) && selectedTopics.length)
        return selectedTopics.join(" | ");
    } catch (e) {}
    return NOTE_DEFAULT_TOPICS;
  }
  function todayYmd() {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Taipei",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(new Date());
      const y = parts.find((p) => p.type === "year").value,
        m = parts.find((p) => p.type === "month").value,
        d = parts.find((p) => p.type === "day").value;
      return `${y}-${m}-${d}`;
    } catch (e) {
      const d = new Date(Date.now() + 8 * 60 * 60 * 1000);
      return (
        d.getUTCFullYear() +
        "-" +
        String(d.getUTCMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getUTCDate()).padStart(2, "0")
      );
    }
  }
  function currentYtValue() {
    let v = "";
    try {
      v =
        typeof parseAdvYoutube === "function"
          ? parseAdvYoutube()
          : String(($("#advYoutube") && $("#advYoutube").value) || "");
    } catch (e) {}
    v = String(v || "").trim();
    return /(?:youtu\.be|youtube\.com|^https?:\/\/)/i.test(v) ? v : "";
  }
  function noteUserState(id) {
    const wanted = String(id || "").trim();
    const u =
      findAdvUser(wanted) ||
      findAdvUser(NOTE_USER_ID) || {
        id: NOTE_USER_ID,
        name: "AI整理筆記",
        avatar: "",
      };
    return {
      id: String(u.id || NOTE_USER_ID).trim() || NOTE_USER_ID,
      name: String(u.name || u.id || "AI整理筆記").trim(),
      avatar: String(u.avatar || "").trim(),
    };
  }
  function notePublisherId(box) {
    const field = box && $("#advNotePublisherId", box);
    return noteUserState(field && field.value).id;
  }
  function setNotePublisherState(box, id) {
    box = box || $("#advNoteBackdrop");
    if (!box) return noteUserState(id);
    const state = noteUserState(id);
    const list = $("#advNoteUserList", box);
    if (list) {
      $all("input[name=advNoteUserPreset]", list).forEach((radio) => {
        const selected = String(radio.value || "") === state.id;
        radio.checked = selected;
        radio.defaultChecked = selected;
        radio.toggleAttribute("checked", selected);
        const label = radio.closest("label");
        if (label) label.classList.toggle("active", selected);
      });
    }
    const pid = $("#advNotePublisherId", box);
    const img = $("#advNoteAvatarPreview", box);
    const nameEl = $("#advNoteUserName", box);
    const hint = $("#advNotePublisherHint", box);
    if (pid) pid.value = state.id;
    if (img) {
      if (state.avatar) img.src = state.avatar;
      else img.removeAttribute("src");
    }
    if (nameEl) nameEl.textContent = state.name;
    if (hint) hint.textContent = "publisherID: " + state.id;
    box.dataset.publisherId = state.id;
    return state;
  }
  function renderNoteUserList(box, selectedId) {
    const list = $("#advNoteUserList", box);
    if (!list) return;
    const state = noteUserState(selectedId || notePublisherId(box));
    const rows = noteUserRows();
    list.innerHTML = rows
      .map(
        (u) =>
          `<label data-id="${h(u.id)}"><input type="radio" name="advNoteUserPreset" value="${h(u.id)}" data-name="${h(u.name || u.id)}" data-avatar="${h(u.avatar || "")}" ${String(u.id) === state.id ? "checked" : ""}><img src="${h(u.avatar || "")}" alt="${h(u.name || u.id)}"><span>${h(u.name || u.id)}</span></label>`,
      )
      .join("");
    setNotePublisherState(box, state.id);
  }
  function setNoteUserListOpen(box, open) {
    box = box || $("#advNoteBackdrop");
    if (!box) return;
    const list = $("#advNoteUserList", box),
      btn = $("#advNoteSelectedUser", box);
    open = !!open;
    if (list) {
      list.classList.toggle("open", open);
      list.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  function selectedNoteUser(box) {
    box = box || $("#advNoteBackdrop");
    return noteUserState(notePublisherId(box));
  }
  function applyPublisherToEditor(id, avatarUrl) {
    const state = noteUserState(id);
    const avatar = String(avatarUrl || state.avatar || "").trim();
    try {
      advCurrentUserId = state.id;
      advCurrentUserName = state.name;
      advCurrentUserAvatar = avatar;
    } catch (e) {
      try {
        window.advCurrentUserId = state.id;
        window.advCurrentUserName = state.name;
        window.advCurrentUserAvatar = avatar;
      } catch (_) {}
    }
    try {
      $all("#advUserList input[name=advUserPreset]").forEach((r) => {
        r.checked = String(r.value || "") === state.id;
      });
    } catch (e) {}
    try {
      if (typeof updateSelectedAvatarDisplay === "function")
        updateSelectedAvatarDisplay();
    } catch (e) {}
    try {
      const img = $("#advSelectedAvatarImg");
      if (img && avatar) img.src = avatar;
    } catch (e) {}
    return state;
  }
  function applyNoteUserFromRadio(radio) {
    if (!radio) return;
    const box = radio.closest("#advNoteBackdrop");
    const state = setNotePublisherState(box, radio.value);
    applyPublisherToEditor(state.id, state.avatar);
    setNoteUserListOpen(box, false);
  }
  function enterNoteMode() {
    try {
      if (typeof showMore === "function") showMore();
    } catch (e) {}
    const box = $("#advNoteBackdrop");
    const state = box ? selectedNoteUser(box) : noteUserState(NOTE_USER_ID);
    applyPublisherToEditor(state.id, state.avatar);
    window.__CCH_NOTE_MODE_ACTIVE = true;
    const btn = $("#advNoteBtn");
    btn && btn.classList.add("active");
  }
  function leaveNoteMode() {
    window.__CCH_NOTE_MODE_ACTIVE = false;
    const btn = $("#advNoteBtn");
    btn && btn.classList.remove("active");
  }
  function syncNoteAvatarPreview(box) {
    box = box || $("#advNoteBackdrop");
    if (!box) return;
    setNotePublisherState(box, notePublisherId(box));
  }
  function splitTopicText(text) {
    if (Array.isArray(text)) return text.flatMap(splitTopicText);
    return String(text || "")
      .split(/[|\n\r,，]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  function labelTopicValue(label) {
    const input =
      label &&
      label.querySelector &&
      label.querySelector("input[type=checkbox]");
    return String(
      (input && input.value) || (label && label.dataset.key) || "",
    ).trim();
  }
  function topicMetaByValue(value, box) {
    const safe = String(value || "").trim();
    let label = null;
    $all("#advNoteTopicList .topic-sub", box).some((l) => {
      if (labelTopicValue(l) === safe) {
        label = l;
        return true;
      }
      return false;
    });
    if (!label) {
      const part = safe.includes("::")
        ? safe.split("::").slice(1).join("::")
        : safe;
      return { value: safe, text: part || safe, color: "#008927" };
    }
    return {
      value: safe,
      text: String(label.dataset.topic || safe.split("::").pop() || safe),
      color:
        String(
          label.dataset.color ||
            (label.closest(".topic-group") &&
              getComputedStyle(label.closest(".topic-group")).getPropertyValue(
                "--topic-color",
              )) ||
            "#008927",
        ).trim() || "#008927",
    };
  }
  function syncTopicGroupState(box) {
    const list = $("#advNoteTopicList", box);
    if (!list) return;
    $all(".topic-group", list).forEach((g) => {
      const checked = !!g.querySelector("input[type=checkbox]:checked");
      g.classList.toggle("has-checked", checked);
    });
    $all("label.topic-sub", list).forEach((label) => {
      const input = label.querySelector("input[type=checkbox]");
      label.classList.toggle("selected", !!input && input.checked);
    });
  }
  function renderNoteTopicList(box) {
    const list = $("#advNoteTopicList", box),
      src = $("#advTopicList");
    if (!list) return;
    if (src && src.innerHTML.trim()) {
      list.innerHTML = src.innerHTML;
    } else {
      list.innerHTML = "";
    }
    $all(".topic-group", list).forEach((g) =>
      g.classList.remove("open", "has-checked"),
    );
    syncTopicGroupState(box);
  }
  function setNoteTopicsFromText(text, box) {
    box = box || $("#advNoteBackdrop");
    if (!box) return;
    const topics = splitTopicText(text).length
      ? splitTopicText(text)
      : splitTopicText(NOTE_DEFAULT_TOPICS);
    $all("#advNoteTopicList input[type=checkbox]", box).forEach((input) => {
      input.checked = topics.includes(String(input.value || "").trim());
    });
    const hidden = $("#advNoteTopics", box);
    if (hidden) hidden.value = topics.join(" | ");
    updateNoteTopicDisplay(box, topics);
    syncTopicGroupState(box);
  }
  function checkedNoteTopics(box) {
    return $all("#advNoteTopicList input[type=checkbox]:checked", box)
      .map((input) => String(input.value || "").trim())
      .filter(Boolean);
  }
  function updateNoteTopicDisplay(box, topics) {
    topics = topics || checkedNoteTopics(box);
    const hidden = $("#advNoteTopics", box);
    if (hidden) hidden.value = topics.join(" | ");
    const display = $("#advNoteTopicDisplay", box);
    if (!display) return;
    if (!topics.length) {
      display.innerHTML =
        '<span style="font-size:.6rem;color:var(--c-text-soft);letter-spacing:.5px;">(尚未選擇)</span>';
    } else
      display.innerHTML = topics
        .map((v) => {
          const m = topicMetaByValue(v, box);
          return `<span class="topic-chip" style="--topic-color:${h(m.color)}">${h(m.text)}<button type="button" data-note-remove-topic="${h(v)}">&times;</button></span>`;
        })
        .join("");
    syncTopicGroupState(box);
    refreshNoteSummary(box);
  }
  function refreshNoteSummary(box) {
    box = box || $("#advNoteBackdrop");
    if (!box) return;
    const hint = $("#advNoteSettingsHint", box);
    if (!hint) return;
    const db =
        String(
          ($("#advNoteDbPath", box) && $("#advNoteDbPath", box).value) ||
            NOTE_OUTPUT_DB,
        ).trim() || NOTE_OUTPUT_DB,
      date =
        String(
          ($("#advNoteStartDate", box) && $("#advNoteStartDate", box).value) ||
            todayYmd(),
        ).trim() || todayYmd(),
      topics = checkedNoteTopics(box);
    const topicText = topics.length
      ? topics
          .map((v) => topicMetaByValue(v, box).text)
          .slice(0, 3)
          .join("、") + (topics.length > 3 ? ` +${topics.length - 3}` : "")
      : "未選分類";
    hint.textContent = `${db} · ${date} · ${topicText}`;
  }
  function upgradeLegacyNoteSource(box) {
    box = box || $("#advNoteBackdrop");
    if (!box) return box;
    const dialog = $(".adv-note-dialog", box);
    if (!dialog) return box;
    const directRow = Array.from(dialog.children || []).find(
      (el) => el && el.classList && el.classList.contains("adv-thumb-url-row"),
    );
    if (
      directRow &&
      directRow.querySelector &&
      directRow.querySelector(".adv-thumb-url-input")
    )
      return box;
    const card =
      $("#advNoteSourceCard", box) || $(".adv-note-source-card", box);
    if (!card) return box;
    const oldText =
        $("#advNoteSourceText", card) || $("textarea,input[type=text]", card),
      oldFile = $("#advNoteFileInput", card) || $("#advNoteFileInput", box),
      oldFilesText =
        $("#advNoteFilesText", card) || $("#advNoteFilesText", box);
    const row = document.createElement("div");
    row.className = "adv-thumb adv-thumb-add adv-thumb-url-row";
    row.innerHTML =
      '<input type="text" class="adv-thumb-url-input" placeholder="URL" autocomplete="off" spellcheck="false"><button type="button" class="adv-thumb-upload-btn" title="用 Python 選擇本機檔案" aria-label="用 Python 選擇本機檔案"><i class="uil uil-file-upload"></i></button>';
    const input = row.querySelector(".adv-thumb-url-input"),
      btn = row.querySelector(".adv-thumb-upload-btn"),
      disabled =
        !!(box.classList && box.classList.contains("adv-note-running")) ||
        !!(oldText && oldText.disabled);
    if (input) {
      input.value = String((oldText && oldText.value) || "");
      input.disabled = disabled;
    }
    if (btn) btn.disabled = disabled;
    card.parentNode && card.parentNode.insertBefore(row, card);
    if (oldFile) {
      oldFile.classList && oldFile.classList.add("adv-note-file-input");
      card.parentNode && card.parentNode.insertBefore(oldFile, row.nextSibling);
    } else {
      const file = document.createElement("input");
      file.id = "advNoteFileInput";
      file.className = "adv-note-file-input";
      file.type = "file";
      file.multiple = true;
      file.accept = VIDEO_ACCEPT;
      file.disabled = disabled;
      card.parentNode && card.parentNode.insertBefore(file, row.nextSibling);
    }
    if (oldFilesText) {
      card.parentNode &&
        card.parentNode.insertBefore(
          oldFilesText,
          (oldFile || row).nextSibling,
        );
    } else {
      const files = document.createElement("div");
      files.id = "advNoteFilesText";
      files.className = "adv-note-files";
      files.textContent = "尚未選擇檔案";
      card.parentNode &&
        card.parentNode.insertBefore(files, (oldFile || row).nextSibling);
    }
    card.remove();
    return box;
  }
  function noteSourceInput(box) {
    box = box || $("#advNoteBackdrop");
    box && upgradeLegacyNoteSource(box);
    return box
      ? $(".adv-note-dialog>.adv-thumb-url-row .adv-thumb-url-input", box)
      : null;
  }
  function looksLikeUrlSource(v) {
    v = String(v || "").trim();
    return /^(?:https?:\/\/|www\.|youtu\.be\/|youtube\.com\/)/i.test(v);
  }
  function splitLocalPathText(v) {
    return String(v || "")
      .replace(/\r/g, "\n")
      .split(/\n+/)
      .map((x) => x.trim().replace(/^[ '\"]+|[ '\"]+$/g, ""))
      .filter(Boolean);
  }
  function basenameFromPath(v) {
    v = String(v || "")
      .replace(/\\/g, "/")
      .split("/")
      .pop();
    return v || String(v || "");
  }
  function selectedLocalPathsFromBox(box) {
    const typed = noteSourceInput(box);
    const typedValue = String((typed && typed.value) || "").trim();
    const fromTyped =
      typedValue && !looksLikeUrlSource(typedValue)
        ? splitLocalPathText(typedValue)
        : [];
    const fromMemory = Array.isArray(noteLocalPaths)
      ? noteLocalPaths.filter(Boolean)
      : [];
    return fromMemory.length ? fromMemory : fromTyped;
  }
  function updateLocalPathsUi(box, paths) {
    box = box || $("#advNoteBackdrop");
    paths = (paths || []).map((x) => String(x || "").trim()).filter(Boolean);
    noteLocalPaths = paths.slice();
    const input = noteSourceInput(box),
      filesText = box && $("#advNoteFilesText", box);
    if (input) {
      input.value =
        paths.length === 1
          ? paths[0]
          : paths.length
            ? `${paths.length} 個本機檔案：${paths.slice(0, 2).map(basenameFromPath).join("、")}${paths.length > 2 ? "…" : ""}`
            : "";
    }
    if (filesText) {
      filesText.textContent = paths.length
        ? `${paths.length} 個本機檔案 · Python 直接讀取：${paths.map(basenameFromPath).slice(0, 4).join("、")}${paths.length > 4 ? "…" : ""}`
        : "尚未選擇檔案";
    }
    if (paths.length) setSourceMode("local");
    return paths;
  }
  function setSourceMode(mode, opts) {
    opts = opts || {};
    const box = $("#advNoteBackdrop");
    if (!box) return;
    mode = mode === "youtube" ? "youtube" : "local";
    box.dataset.source = mode;
    $all("[data-note-source]", box).forEach((b) =>
      b.classList.toggle("active", b.dataset.noteSource === mode),
    );
    const txt = noteSourceInput(box);
    if (txt)
      txt.placeholder =
        mode === "local"
          ? "本機完整路徑（可貼上；右側按鈕用 Python 選檔）"
          : "URL";
    if (mode === "local" && opts.pick) browseLocalPaths();
  }
  async function browseLocalPaths() {
    const box = $("#advNoteBackdrop"),
      input = box && noteSourceInput(box),
      btn =
        box &&
        $(".adv-note-dialog>.adv-thumb-url-row .adv-thumb-upload-btn", box);
    if (!box) return;
    try {
      btn && (btn.disabled = true);
      hideNoteStatus();
      const current = String((input && input.value) || "").trim();
      const res = await fetch("/api/dialog/local_paths", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: current, paths: noteLocalPaths }),
      });
      const data = await res
        .json()
        .catch(() => ({ ok: false, error: "伺服器沒有回傳 JSON" }));
      if (!res.ok || !data.ok)
        throw new Error(data.error || "HTTP " + res.status);
      const paths = Array.isArray(data.paths) ? data.paths.filter(Boolean) : [];
      if (paths.length) {
        updateLocalPathsUi(box, paths);
        refreshNoteSummary(box);
        setIdleStatus(
          "已選擇本機路徑，執行時會由 Python 直接讀取，不會經過 Chrome 上傳。",
          paths.slice(0, 4).map(basenameFromPath).join("、"),
        );
      } else hideNoteStatus();
    } catch (e) {
      setIdleStatus(
        "無法開啟 Python 選檔視窗，請直接貼上完整本機路徑；避免改用瀏覽器上傳大型檔案。",
        String(e && e.message ? e.message : e),
        { error: true },
      );
    } finally {
      btn && (btn.disabled = false);
    }
  }
  async function browseDbPath() {
    const box = $("#advNoteBackdrop"),
      input = box && $("#advNoteDbPath", box),
      btn = box && $("#advNoteDbBrowseBtn", box);
    if (!input) return;
    try {
      btn && (btn.disabled = true);
      hideNoteStatus();
      const res = await fetch("/api/dialog/db_path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: input.value || NOTE_OUTPUT_DB }),
      });
      const data = await res
        .json()
        .catch(() => ({ ok: false, error: "伺服器沒有回傳 JSON" }));
      if (!res.ok || !data.ok)
        throw new Error(data.error || "HTTP " + res.status);
      if (data.path) {
        input.value = data.path;
        refreshNoteSummary(box);
      } else hideNoteStatus();
    } catch (e) {
      setIdleStatus(
        "無法開啟檔案位置視窗，請直接在 db_path 輸入完整路徑。",
        String(e && e.message ? e.message : e),
        { error: true },
      );
      try {
        $("#advNoteDbPathFile", box).click();
      } catch (_) {}
    } finally {
      btn && (btn.disabled = false);
    }
  }
  function ensureNoteDialog() {
    let box = $("#advNoteBackdrop");
    if (box) {
      upgradeLegacyNoteSource(box);
      if (
        !box.querySelector(
          ".adv-note-dialog>.adv-thumb-url-row .adv-thumb-url-input",
        ) ||
        !box.querySelector("#advNoteEstimate") ||
        !box.querySelector("#advNoteVisionModel") ||
        !box.querySelector("#advNoteVisionPreset option[value=maximum]")
      ) {
        box.remove();
        box = null;
      } else {
        noteUpdateEstimate(box);
        return box;
      }
    }
    box = document.createElement("div");
    box.id = "advNoteBackdrop";
    box.className = "adv-note-backdrop hide";
    box.dataset.source = "local";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = `<div class="adv-note-dialog" role="dialog" aria-modal="true" aria-labelledby="advNoteTitle"><div class="adv-note-head"><div class="adv-note-title" id="advNoteTitle"><i class="uil uil-notes"></i><div class="adv-note-title-copy"><span>AI筆記整理</span></div></div><button type="button" class="icon-btn adv-note-close" data-note-close="1"><i class="uil uil-times"></i></button></div><div class="adv-note-avatar-row"><button type="button" class="adv-note-selected-user" id="advNoteSelectedUser" aria-expanded="false" aria-controls="advNoteUserList"><img id="advNoteAvatarPreview" alt="筆記發文者"><div><b id="advNoteUserName">AI整理筆記</b></div></button><div class="adv-user-list adv-note-user-list" id="advNoteUserList" aria-hidden="true"></div><input id="advNotePublisherId" type="hidden" value="${NOTE_USER_ID}"></div><div class="adv-thumb adv-thumb-add adv-thumb-url-row"><input type="text" class="adv-thumb-url-input" placeholder="URL" autocomplete="off" spellcheck="false"><button type="button" class="adv-thumb-upload-btn" title="用 Python 選擇本機檔案" aria-label="用 Python 選擇本機檔案"><i class="uil uil-file-upload"></i></button></div><input id="advNoteFileInput" class="adv-note-file-input" type="file" multiple accept="${VIDEO_ACCEPT}"><div id="advNoteFilesText" class="adv-note-files">尚未選擇檔案</div><details class="adv-note-details adv-note-main-settings" id="advNoteSettings"><summary><span>上傳設定</span><small id="advNoteSettingsHint">存檔位置、日期、分類</small></summary><div class="adv-note-grid"><label class="adv-note-field full"><span>存檔位置</span><div class="adv-note-input-row adv-note-picker-row"><input id="advNoteDbPath" list="feedSourceDatalist" autocomplete="off" spellcheck="false"><button class="adv-note-mini adv-note-icon-mini" id="advNoteDbBrowseBtn" type="button" title="選擇位置" aria-label="選擇位置"><i class="uil uil-folder-open"></i></button></div><input id="advNoteDbPathFile" class="adv-note-file-input" type="file" accept=".sqlite,.db,.sqlite3"></label><label class="adv-note-field"><span>日期</span><input id="advNoteStartDate" type="date"></label><div class="adv-note-topic-picker"><label class="form-stack-label">分類<div class="inline-control-row"><div class="adv-topic-display adv-note-topic-display" id="advNoteTopicDisplay"><span style="font-size:.6rem;color:var(--c-text-soft);letter-spacing:.5px;">(尚未選擇)</span></div><button class="mini-btn-like" id="advNoteAddTopicBtn" type="button">+ 添加</button><button class="mini-btn-clear" id="advNoteClearTopicBtn" title="清空" type="button">清空</button></div></label><textarea id="advNoteTopics" class="adv-note-hidden-source" spellcheck="false"></textarea><div class="adv-topic-list adv-note-topic-list" id="advNoteTopicList"></div></div></div></details><details class="adv-note-details adv-note-advanced-settings"><summary><span>進階參數</span><small>語言、字幕、圖片理解、筆記整理</small></summary><div class="adv-note-estimate-card" id="advNoteEstimate" aria-live="polite"></div><div class="adv-note-grid"><label class="adv-note-field"><span>加速檢查</span><select id="advNotePreflightMode"><option value="step" selected>逐步預掃（建議）</option><option value="off">關閉預掃</option></select></label><label class="adv-note-field"><span>語言</span><select id="advNoteLangPack"><option value="zh|ch" data-language="zh">中文</option><option value="zh|ch" data-language="zh">中文 + English</option><option value="en|en" data-language="en">English</option><option value="ja|japan" data-language="ja">日本語</option><option value="ko|korean" data-language="ko">한국어</option></select></label><label class="adv-note-field"><span>字幕來源</span><select id="advNoteTranscriptSource"><option value="auto">Auto</option><option value="youtube">Youtube</option><option value="whisper">Whisper</option></select></label><label class="adv-note-field"><span>字幕模型</span><select id="advNoteModel"><option value="large">Large</option><option value="medium" selected>Medium</option><option value="small">Small</option><option value="base">Base</option><option value="tiny">Tiny</option></select></label><label class="adv-note-field"><span>Vision模型</span><select id="advNoteVisionModel"><option value="qwen2.5vl:7b" selected>Qwen2.5VL 7B</option><option value="qwen2.5vl:3b">Qwen2.5VL 3B</option><option value="minicpm-v:8b">MiniCPM-V 8B</option><option value="llama3.2-vision:11b">Llama 3.2 Vision 11B</option><option value="off">Off</option></select></label><label class="adv-note-field"><span>Vision 品質</span><select id="advNoteVisionPreset"><option value="maximum">Maximum</option><option value="high" selected>High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label class="adv-note-field"><span>筆記模型</span><select id="advNoteQwenRefine"><option value="qwen3:8b" selected>Qwen3:8b</option><option value="false">Off</option></select><input id="advNoteQwenModel" type="hidden" value="qwen3:8b"></label><label class="adv-note-field"><span>偵錯備份</span><select id="advNoteKeepArtifacts"><option value="true" selected>保留</option><option value="false">刪除</option></select></label></div></details><div class="adv-note-status" id="advNoteStatus"></div><div class="adv-note-actions"><button type="button" class="primary" id="advNoteRunBtn"><i class="uil uil-play"></i> 開始轉檔</button></div></div>`;
    document.body.appendChild(box);
    renderNoteUserList(box, notePublisherId(box));
    renderNoteTopicList(box);
    box.addEventListener("mousedown", (e) => {
      if (e.target === box) closeNoteDialog();
    });
    box.addEventListener("click", (e) => {
      const close = e.target.closest("[data-note-close]");
      if (close) {
        e.preventDefault();
        closeNoteDialog(false);
        return;
      }
      const selectedUser = e.target.closest("#advNoteSelectedUser");
      if (selectedUser) {
        e.preventDefault();
        const list = $("#advNoteUserList", box);
        setNoteUserListOpen(box, !(list && list.classList.contains("open")));
        return;
      }
      if (!e.target.closest(".adv-note-avatar-row"))
        setNoteUserListOpen(box, false);
      const removeTopic = e.target.closest("button[data-note-remove-topic]");
      if (removeTopic) {
        e.preventDefault();
        const val = String(removeTopic.dataset.noteRemoveTopic || "");
        const input = val
          ? $(
              "#advNoteTopicList input[type=checkbox][value=\'" +
                CSS.escape(val) +
                "\']",
              box,
            )
          : null;
        if (input) {
          input.checked = false;
          const label = input.closest("label");
          label && label.classList.remove("selected");
        }
        updateNoteTopicDisplay(box);
        return;
      }
      const tab = e.target.closest("[data-note-source]");
      if (tab) {
        e.preventDefault();
        setSourceMode(tab.dataset.noteSource || "local", {
          pick: tab.dataset.noteSource === "local",
        });
        return;
      }
      const fp = e.target.closest(
        ".adv-note-dialog>.adv-thumb-url-row .adv-thumb-upload-btn",
      );
      if (fp) {
        e.preventDefault();
        setSourceMode("local");
        browseLocalPaths();
        return;
      }
      const db = e.target.closest("#advNoteDbBrowseBtn");
      if (db) {
        e.preventDefault();
        browseDbPath();
        return;
      }
      const add = e.target.closest("#advNoteAddTopicBtn");
      if (add) {
        e.preventDefault();
        const list = $("#advNoteTopicList", box);
        list.classList.toggle("open");
        syncTopicGroupState(box);
        return;
      }
      const clear = e.target.closest("#advNoteClearTopicBtn");
      if (clear) {
        e.preventDefault();
        $all("#advNoteTopicList input[type=checkbox]", box).forEach(
          (i) => (i.checked = false),
        );
        $all("#advNoteTopicList .topic-group", box).forEach((g) =>
          g.classList.remove("open", "has-checked"),
        );
        updateNoteTopicDisplay(box, []);
        return;
      }
      const topicMain = e.target.closest("#advNoteTopicList .topic-main");
      if (topicMain) {
        e.preventDefault();
        const g = topicMain.closest(".topic-group"),
          willOpen = g && !g.classList.contains("open");
        $all("#advNoteTopicList .topic-group", box).forEach((x) =>
          x.classList.remove("open"),
        );
        if (g && willOpen) g.classList.add("open");
        return;
      }
    });
    box.addEventListener("change", (e) => {
      const r =
        e.target.closest && e.target.closest("input[name=advNoteUserPreset]");
      if (r) {
        applyNoteUserFromRadio(r);
        return;
      }
      if (
        e.target &&
        e.target.matches("#advNoteTopicList input[type=checkbox]")
      ) {
        const label = e.target.closest("label");
        label && label.classList.toggle("selected", !!e.target.checked);
        updateNoteTopicDisplay(box);
        return;
      }
      if (e.target && e.target.matches("#advNoteDbPathFile")) {
        const f = e.target.files && e.target.files[0];
        if (f) {
          $("#advNoteDbPath", box).value = f.name;
          refreshNoteSummary(box);
          setIdleStatus(
            "瀏覽器只允許讀取檔名；若要完整路徑，請使用『選擇位置』視窗或手動輸入。",
            f.name,
          );
        }
      }
      if (e.target && e.target.matches("#advNoteStartDate,#advNoteDbPath"))
        refreshNoteSummary(box);
      if (
        e.target &&
        e.target.matches(
          "#advNotePreflightMode,#advNoteLangPack,#advNoteTranscriptSource,#advNoteModel,#advNoteVisionModel,#advNoteVisionPreset,#advNoteQwenRefine,#advNoteKeepArtifacts",
        )
      )
        noteUpdateEstimate(box);
    });
    box.addEventListener("input", (e) => {
      if (
        e.target &&
        e.target.matches(
          ".adv-note-dialog>.adv-thumb-url-row .adv-thumb-url-input",
        )
      ) {
        const v = String(e.target.value || "").trim();
        noteLocalPaths = [];
        if (v) setSourceMode(looksLikeUrlSource(v) ? "youtube" : "local");
        return;
      }
      if (e.target && e.target.matches("#advNoteStartDate,#advNoteDbPath"))
        refreshNoteSummary(box);
    });
    $("#advNoteFileInput", box).addEventListener("change", () => {
      noteLocalPaths = [];
      const files = Array.from($("#advNoteFileInput", box).files || []).map(
          (x) => x.name,
        ),
        filesText = $("#advNoteFilesText", box);
      if (filesText)
        filesText.textContent = files.length
          ? `瀏覽器備援上傳：${files.join("、")}`
          : "尚未選擇檔案";
      if (files.length) {
        setSourceMode("local");
        setIdleStatus(
          "目前使用瀏覽器備援上傳模式；大檔建議用右側按鈕開啟 Python 選檔視窗，避免 Chrome 搬檔。",
          files.join("、"),
        );
      }
      noteUpdateEstimate(box);
    });
    $("#advNoteRunBtn", box).addEventListener("click", noteRunButtonClick);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !box.classList.contains("hide"))
        closeNoteDialog(false);
    });
    return box;
  }
  function openNoteDialog() {
    addNoteStyles();
    enterNoteMode();
    const box = ensureNoteDialog();
    setNoteRunning(false);
    noteLocalPaths = [];
    box.__advNoteLocalPaths = [];
    try {
      const fi = $("#advNoteFileInput", box);
      if (fi) fi.value = "";
    } catch (e) {}
    renderNoteUserList(box);
    renderNoteTopicList(box);
    const yt = currentYtValue(),
      srcInput = noteSourceInput(box);
    srcInput && (srcInput.value = yt);
    const filesText = $("#advNoteFilesText", box);
    if (filesText) filesText.textContent = "尚未選擇檔案";
    $("#advNoteDbPath", box).value = currentDbPath();
    setNoteTopicsFromText(currentTopics(), box);
    $("#advNoteStartDate", box).value = todayYmd();
    $("#advNoteStatus", box).classList.remove("show");
    $("#advNoteStatus", box).innerHTML = "";
    $("#advNoteStatus", box).dataset.progress = "0";
    $("#advNoteTopicList", box).classList.remove("open");
    setNoteUserListOpen(box, false);
    $("#advNoteSettings", box).open = false;
    $all(".adv-note-details", box).forEach((d) => {
      if (d.id !== "advNoteSettings") d.open = false;
    });
    setSourceMode(yt ? "youtube" : "local");
    syncNoteAvatarPreview();
    refreshNoteSummary(box);
    noteUpdateEstimate(box);
    box.classList.remove("hide");
    box.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      const el = $(
        ".adv-note-dialog>.adv-thumb-url-row .adv-thumb-upload-btn",
        box,
      );
      el && el.focus();
    }, 0);
  }
  function closeNoteDialog(force) {
    const box = $("#advNoteBackdrop");
    if (noteRunning && !force) {
      setProgressStatus({
        title: "轉檔執行中",
        line: "請先按「中斷轉檔」停止工作，再關閉視窗。",
        state: "running",
        percent:
          Number(
            box &&
              $("#advNoteStatus", box) &&
              $("#advNoteStatus", box).dataset.progress,
          ) || 0,
        rows: [],
        source: "",
      });
      return;
    }
    if (box) {
      box.classList.add("hide");
      box.setAttribute("aria-hidden", "true");
    }
    leaveNoteMode();
  }
  function stripNoteLog(v) {
    return String(v == null ? "" : v)
      .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "")
      .replace(/\r(?!\n)/g, "\n");
  }
  function downloadProgressInfo(line) {
    line = String(line || "")
      .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "")
      .trim();
    let m = line.match(
      /^(analysis|download) progress:\s*(\d{1,3}(?:\.\d+)?)%\s*(?:\(([^)]*)\))?/i,
    );
    if (m) {
      const kind = String(m[1] || "analysis").toLowerCase(),
        pct = clampNotePercent(Number(m[2]), 0),
        amount = String(m[3] || "").trim();
      return {
        pct,
        amount,
        kind,
        label: `${kind} progress: ${Math.round(pct)}%${amount ? ` (${amount})` : ""}`,
      };
    }
    m = line.match(
      /(?:^|\s)(\d{1,3}(?:\.\d+)?)%\|[^|]*\|\s*([0-9.]+\s*[KMGTPE]?i?B?|[0-9.]+\s*[KMGTPE])\s*\/\s*([0-9.]+\s*[KMGTPE]?i?B?|[0-9.]+\s*[KMGTPE])(?:\s|\[|$)/i,
    );
    if (m) {
      const pct = clampNotePercent(Number(m[1]), 0),
        amount =
          String(m[2] || "").replace(/\s+/g, "") +
          "/" +
          String(m[3] || "").replace(/\s+/g, "");
      return {
        pct,
        amount,
        kind: "analysis",
        label: `analysis progress: ${Math.round(pct)}%${amount ? ` (${amount})` : ""}`,
      };
    }
    m = line.match(
      /^\[download\]\s*(\d{1,3}(?:\.\d+)?)%\s+of\s+~?\s*([0-9.]+\s*[KMGTPE]?i?B?)/i,
    );
    if (m) {
      const pct = clampNotePercent(Number(m[1]), 0),
        amount = String(m[2] || "").replace(/\s+/g, "");
      return {
        pct,
        amount,
        kind: "download",
        label: `download progress: ${Math.round(pct)}%${amount ? ` (${amount})` : ""}`,
      };
    }
    return null;
  }
  function isResolvedMaxsplitDeprecationLine(line) {
    line = String(line || "").trim();
    if (!line) return false;
    if (
      /DeprecationWarning:\s*["']maxsplit["']\s+is\s+passed\s+as\s+positional\s+argument/i.test(
        line,
      )
    )
      return true;
    if (
      /^\s*(?:first|text)\s*=\s*re\.split\(.+?,\s*1\)\[0\]\.strip\(\)\s*$/i.test(
        line,
      )
    )
      return true;
    return false;
  }
  function normalizeNoteLine(line) {
    line = String(line || "").trim();
    if (isResolvedMaxsplitDeprecationLine(line)) return "";
    const dp = downloadProgressInfo(line);
    return dp ? dp.label : line;
  }
  function isRawDownloadProgressLine(line) {
    line = String(line || "").trim();
    return !!line.match(
      /(?:^|\s)\d{1,3}(?:\.\d+)?%\|[^|]*\|\s*[0-9.]+\s*[KMGTPE]?i?B?\s*\/\s*[0-9.]+\s*[KMGTPE]?i?B?/i,
    );
  }
  function noteLogLines(v) {
    return stripNoteLog(v)
      .split(/\n/)
      .map((x) => normalizeNoteLine(String(x || "").trim()))
      .filter(Boolean);
  }
  function compactNoteLine(line, max) {
    line = String(line || "")
      .replace(/\s+/g, " ")
      .trim();
    max = max || 180;
    return line.length > max ? line.slice(0, max - 1) + "…" : line;
  }
  function hideNoteStatus() {
    const box = $("#advNoteBackdrop"),
      st = box && $("#advNoteStatus", box);
    if (!st) return;
    st.classList.remove("show");
    st.dataset.progress = "0";
    st.innerHTML = "";
  }
  function noteCurrentProgress() {
    const box = $("#advNoteBackdrop"),
      st = box && $("#advNoteStatus", box);
    return clampNotePercent(Number(st && st.dataset.progress) || 0, 0);
  }
  function setNoteRunning(running, opts) {
    opts = opts || {};
    const box = upgradeLegacyNoteSource($("#advNoteBackdrop")),
      btn = box && $("#advNoteRunBtn", box);
    noteRunning = !!running;
    noteCancelling = !!opts.cancelling;
    box && box.classList.toggle("adv-note-running", noteRunning);
    if (box)
      $all("input,select,textarea,button", box).forEach((el) => {
        if (el && el.id !== "advNoteRunBtn") el.disabled = noteRunning;
      });
    if (btn) {
      btn.disabled = !!noteCancelling;
      btn.classList.toggle("primary", !noteRunning);
      btn.classList.toggle("danger", noteRunning);
      if (noteRunning) {
        btn.dataset.cancelling = noteCancelling ? "1" : "0";
        btn.innerHTML = noteCancelling
          ? '<i class="uil uil-spinner"></i> 正在中斷…'
          : '<i class="uil uil-stop-circle"></i> 中斷轉檔';
      } else {
        btn.removeAttribute("data-cancelling");
        btn.innerHTML = '<i class="uil uil-play"></i> 開始轉檔';
      }
    }
  }
  function noteRunButtonClick(e) {
    e && e.preventDefault && e.preventDefault();
    if (noteRunning) {
      cancelNoteConversion();
      return;
    }
    runNoteConversion();
  }
  function isNoteCancelError(e) {
    return (
      noteCancelRequested ||
      !!(e && (e.name === "AbortError" || e.message === "__NOTE_CANCELLED__"))
    );
  }
  async function cancelNoteConversion() {
    if (!noteRunning || noteCancelling) return;
    noteCancelRequested = true;
    noteCancelling = true;
    setNoteRunning(true, { cancelling: true });
    try {
      noteRunAbort && noteRunAbort.abort();
    } catch (e) {}
    const ids = noteActiveJobIds.slice().filter(Boolean);
    setProgressStatus({
      title: "正在中斷轉檔",
      line: ids.length ? "已送出中斷要求，等待工作停止…" : "正在停止目前請求…",
      state: "running",
      percent: noteCurrentProgress(),
      rows: [],
      source: "",
    });
    if (ids.length) {
      try {
        await fetch("/api/video2sqlite/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_ids: ids }),
        });
      } catch (e) {
        setProgressStatus({
          title: "中斷要求送出失敗",
          line: String((e && e.message) || e),
          state: "error",
          percent: noteCurrentProgress(),
          rows: [],
          source: "",
        });
        noteCancelling = false;
        setNoteRunning(true);
      }
    } else {
      clearInterval(notePollTimer);
      noteActiveJobIds = [];
      noteRunAbort = null;
      setProgressStatus({
        title: "已中斷轉檔",
        line: "已停止目前請求",
        state: "done",
        percent: noteCurrentProgress(),
        rows: [],
        source: "",
      });
      setNoteRunning(false);
    }
  }
  function sqliteNameFromPath(v) {
    v = String(v || "").trim();
    if (!v) return "";
    try {
      v = new URL(v, location.href).pathname;
    } catch (e) {}
    v = v.replace(/\\/g, "/").split("/").pop().split("?")[0].split("#")[0];
    return v.replace(/\.js$/i, ".sqlite");
  }
  function isExcludedSqliteFeedFile(v) {
    const key = sqliteNameFromPath(v);
    return (
      /^(?:stories|settings|map|geocode)\.(?:sqlite|db|sqlite3)$/i.test(key) ||
      !!(
        window.__isExcludedSqliteFeedFile &&
        window.__isExcludedSqliteFeedFile(key)
      )
    );
  }
  function invalidateNoteFeedCaches(dbPath) {
    const key = sqliteNameFromPath(dbPath),
      stores = [
        "__SQLITE_FEED_WORKERS__",
        "__SQLITE_FEED_WORKER_URLS__",
        "__SQLITE_FEED_FULL_DBS__",
        "__FEED_SOURCE_MAP__",
        "__FEED_SOURCE_META__",
      ];
    stores.forEach((name) => {
      const obj = window[name];
      if (obj && typeof obj === "object") {
        if (key) delete obj[key];
        else Object.keys(obj).forEach((k) => delete obj[k]);
      }
    });
    window.__SQLITE_FEED_LOADING__ = null;
    window.__SQLITE_FEED_INDEX_READY__ = false;
  }
  async function reloadNoteFeeds(dbPath) {
    const key = ensureNoteOutputDbInFeedFiles(dbPath);
    const noteKey =
      sqliteNameFromPath(key || dbPath) || noteOutputDbName(dbPath);
    const beforeFull = Array.isArray(window.__FULL_FEED_ARRAY__)
      ? window.__FULL_FEED_ARRAY__.slice()
      : [];
    const beforeFeed = Array.isArray(window.feedArray)
      ? window.feedArray.slice()
      : [];
    const before = (beforeFull.length ? beforeFull : beforeFeed).slice();
    function itemSrc(x) {
      return sqliteNameFromPath(
        (x && (x.__srcFile || x.__file || x.source_sqlite || x.source_file)) ||
          "",
      );
    }
    function itemKey(x) {
      return [
        itemSrc(x),
        String(x && (x.__rowUid || x.__fid || x.ts || x.datetime || "")),
        String(x && (x.__itemIndex || "")),
        String(x && (x.title || "")),
      ].join("|");
    }
    function topicVisible(arr) {
      const topic = String(window.__CURRENT_TOPIC_FILTER_KEY__ || "").trim();
      if (topic && typeof window.__feedItemMatchesTopicKey === "function") {
        const filtered = arr.filter((item) =>
          window.__feedItemMatchesTopicKey(item, topic),
        );
        return filtered.length ? filtered : arr;
      }
      return arr;
    }
    function setFeedArrays(arr) {
      const full = Array.isArray(arr) ? arr.slice() : [];
      window.__FULL_FEED_ARRAY__ = full.slice();
      const visible = topicVisible(full);
      if (Array.isArray(window.feedArray)) {
        window.feedArray.length = 0;
        visible.forEach((item) => window.feedArray.push(item));
      } else window.feedArray = visible.slice();
    }
    function restoreBefore() {
      if (before.length) {
        setFeedArrays(before);
        return true;
      }
      return false;
    }
    function mergeCurrent() {
      const current = (
        Array.isArray(window.__FULL_FEED_ARRAY__)
          ? window.__FULL_FEED_ARRAY__
          : Array.isArray(window.feedArray)
            ? window.feedArray
            : []
      ).slice();
      const map = new Map(),
        merged = [];
      const push = (item) => {
        if (!item) return;
        const k = itemKey(item);
        if (!map.has(k)) {
          map.set(k, 1);
          merged.push(item);
        }
      };
      before.forEach((item) => {
        if (!item) return;
        const src = itemSrc(item);
        if (noteKey && src === noteKey) return;
        push(item);
      });
      current.forEach(push);
      if (!merged.length) return false;
      merged.sort(
        (a, b) =>
          (Number(b && b.ts) || 0) - (Number(a && a.ts) || 0) ||
          String(itemSrc(a)).localeCompare(String(itemSrc(b))) ||
          (Number(a && a.__itemIndex) || 0) - (Number(b && b.__itemIndex) || 0),
      );
      setFeedArrays(merged);
      return true;
    }
    let loaded = 0,
      loadErr = null;
    try {
      invalidateNoteFeedCaches(key || dbPath);
      if (typeof window.__reloadSqliteFeedFile === "function")
        loaded = await window.__reloadSqliteFeedFile(key || dbPath);
    } catch (e) {
      loadErr = e;
      try {
        console.warn("SQLite note reload failed", e);
      } catch (_) {}
    }
    if (
      loadErr &&
      typeof window.__refreshLocalSqliteFeedFiles === "function" &&
      typeof window.__reloadSqliteFeedFile === "function"
    ) {
      try {
        const files = await window.__refreshLocalSqliteFeedFiles();
        const localKey =
          (Array.isArray(files) ? files : [])
            .map(sqliteNameFromPath)
            .filter(Boolean)
            .find(
              (x) => x !== noteKey && x !== key && !isExcludedSqliteFeedFile(x),
            ) || "";
        if (localKey) {
          invalidateNoteFeedCaches(localKey);
          loaded = await window.__reloadSqliteFeedFile(localKey);
          loadErr = null;
        }
      } catch (_) {}
    }
    let hasData = mergeCurrent();
    if (!hasData && before.length) hasData = restoreBefore();
    if (!hasData) {
      if (loadErr) throw loadErr;
      return loaded || 0;
    }
    try {
      if (typeof renderAllFeeds === "function") await renderAllFeeds();
    } catch (e) {
      if (before.length) {
        restoreBefore();
        try {
          if (typeof renderAllFeeds === "function") await renderAllFeeds();
        } catch (_) {}
      }
      try {
        if (typeof flashMsg === "function")
          flashMsg("SQLite 已更新，但重新載入 feed 失敗");
      } catch (_) {}
      throw e;
    }
    let first = null;
    try {
      const selKey =
        window.CSS && CSS.escape
          ? CSS.escape(noteKey || key || "")
          : String(noteKey || key || "");
      first = document.querySelector(
        `.feed.fade-slide[data-src-file="${selKey}"]:not(.map-ad-feed)`,
      );
    } catch (e) {}
    if (!first)
      first = document.querySelector(".feed.fade-slide:not(.map-ad-feed)");
    if (first) {
      first.classList.add("feed-highlight");
      setTimeout(() => {
        try {
          first.classList.remove("feed-highlight");
        } catch (e) {}
      }, 1800);
      try {
        first.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (_) {
          try {
            window.scrollTo(0, 0);
          } catch (__) {}
        }
      }
    }
    return loaded || 0;
  }
  function noteOutputDbName(dbPath) {
    return (
      sqliteNameFromPath(dbPath) ||
      sqliteNameFromPath(NOTE_OUTPUT_DB) ||
      "result.sqlite"
    );
  }
  function ensureNoteOutputDbInFeedFiles(dbPath) {
    const key = noteOutputDbName(dbPath);
    if (!key) return key;
    try {
      window.__FEED_FILES__ = Array.isArray(window.__FEED_FILES__)
        ? window.__FEED_FILES__
        : [];
      if (!window.__FEED_FILES__.includes(key))
        window.__FEED_FILES__.unshift(key);
      if (!window.__DEFAULT_FEED_FILE__) window.__DEFAULT_FEED_FILE__ = key;
    } catch (e) {}
    try {
      window.settings = window.settings || [
        { feeds: [{ style: [], script: [] }] },
      ];
      const root = window.settings[0] || (window.settings[0] = {});
      root.feeds = Array.isArray(root.feeds)
        ? root.feeds
        : [{ style: [], script: [] }];
      let feed = root.feeds[0] || (root.feeds[0] = { style: [], script: [] });
      feed.script = Array.isArray(feed.script) ? feed.script : [];
      const exists = feed.script.some(
        (x) =>
          x &&
          typeof x === "object" &&
          Object.keys(x).some(
            (k) =>
              sqliteNameFromPath(k) === key || sqliteNameFromPath(x[k]) === key,
          ),
      );
      if (!exists) {
        const obj = {};
        obj[key] = key;
        feed.script.unshift(obj);
      }
    } catch (e) {}
    try {
      window.LOCAL_CDN = Array.isArray(window.LOCAL_CDN)
        ? window.LOCAL_CDN
        : [];
      const found = window.LOCAL_CDN.some(
        (x) =>
          x &&
          (sqliteNameFromPath(x.local) === key ||
            sqliteNameFromPath(x.CDN) === key),
      );
      if (!found)
        window.LOCAL_CDN.unshift({ local: key, CDN: key, firstRunAsFeed: 1 });
    } catch (e) {}
    return key;
  }
  async function finishNoteConversion(rows) {
    noteActiveJobIds = [];
    noteRunAbort = null;
    setProgressStatus({
      title: "轉檔完成",
      line: "正在載入最新筆記…",
      state: "done",
      percent: 100,
      rows: rows || [],
      source: "",
      activityOpen: true,
    });
    try {
      await reloadNoteFeeds(noteCurrentMeta && noteCurrentMeta.db_path);
    } catch (e) {
      try {
        if (typeof flashMsg === "function")
          flashMsg("SQLite 已更新，但重新載入 feed 失敗");
      } catch (_) {}
    }
    setNoteRunning(false);
    try {
      if (typeof flashMsg === "function") flashMsg("轉檔完成，已載入最新筆記");
    } catch (e) {}
  }
  function progressSvg(kind) {
    kind = String(kind || "info").toLowerCase();
    const iconMap = {
      error: "uil uil-exclamation-triangle",
      warning: "uil uil-exclamation-circle",
      download: "uil uil-cloud-download",
      sync: "uil uil-sync",
      update: "uil uil-sync",
      done: "uil uil-check-circle",
      log: "uil uil-list-ul",
      db: "uil uil-database",
      caption: "uil uil-comment-lines",
      srt: "uil uil-comment-lines",
      vision: "uil uil-sync",
      analysis: "uil uil-sync",
      prepare: "uil uil-sync",
      info: "uil uil-info-circle",
    };
    if (kind === "code" || kind === "coding" || kind === "install")
      return `<span class="adv-note-ai-glyph code" aria-hidden="true"><em>&lt;/&gt;</em></span>`;
    const icon = iconMap[kind] || iconMap.info;
    return `<span class="adv-note-ai-glyph ${h(kind)}" aria-hidden="true"><i class="${h(icon)}"></i></span>`;
  }
  function setIdleStatus(text, detail, opts) {
    opts = opts || {};
    const box = $("#advNoteBackdrop"),
      st = box && $("#advNoteStatus", box);
    if (!st) return;
    const isErr = !!opts.error;
    st.dataset.progress = "0";
    st.classList.add("show");
    const icon = isErr ? "uil uil-exclamation-triangle" : "uil uil-info-circle";
    const copy = detail
      ? `<div class="adv-note-error-box"><button type="button" class="adv-note-copy" title="複製內容" aria-label="複製內容"><i class="uil uil-copy"></i></button><pre class="adv-note-error-text">${h(detail)}</pre></div>`
      : "";
    st.innerHTML = `<div class="adv-note-progress-card ${isErr ? "error" : "done"}" role="status" aria-live="polite"><div class="adv-note-progress-line"><i class="${h(icon)}"></i><span>${h(text || "")}</span></div>${copy}</div>`;
  }
  function isNoteLogNoise(line) {
    line = String(line || "");
    return (
      /^WARNING:\s*Logging before InitGoogleLogging\(\) is written to STDERR$/i.test(
        line,
      ) ||
      /^\$\s/.test(line) ||
      /^#\s*\d{8}-\d{6}-/.test(line) ||
      /^Looking in indexes:/i.test(line) ||
      /^WARNING:\s*Running pip as the/i.test(line) ||
      /^\[notice\]/i.test(line) ||
      /^(?:video2sqlite|convert)\s+v/i.test(line) ||
      /^使用共用 Python (?:環境|package 目錄):/i.test(line) ||
      /^internal=|^workspace=|^media=|^audio=|^transcript=|^vision=|^videos=|^srt=|^slides=|^temp=|^ffmpeg=|^版本=|^audio_mode=|^slide_mode=|^transcript_source=|^cookies=|^model_cache=/i.test(
        line,
      ) ||
      /^package progress total:/i.test(line) ||
      /^這裡若出現 Download complete/i.test(line) ||
      /^\[youtube(?::tab)?\].*:\s*(?:Downloading\s+(?:webpage|initial data API JSON|web client config|web player API JSON|android player API JSON|player\s+|\d+\s+items\s+of\s+\d+)|Redownloading\s+playlist API JSON)/i.test(
        line,
      ) ||
      /^\[youtube(?::tab)?\]\s+Extracting URL:/i.test(line) ||
      /^\[download\]\s+Downloading item\s+\d+\s+of\s+\d+/i.test(line) ||
      /^Model files already exist\.|^Creating model:/i.test(line) ||
      /^I\d{4}\s+.*\boneDNN\b/i.test(line) ||
      /^INFO:\s*Could not find files for the given pattern/i.test(line) ||
      /^warnings\.warn\(warning_message\)/i.test(line) ||
      /No ccache found/i.test(line)
    );
  }
  function isActivityNoise(line) {
    line = String(line || "");
    return (
      /^WARNING:\s*Logging before InitGoogleLogging\(\) is written to STDERR$/i.test(
        line,
      ) ||
      /^\$\s/.test(line) ||
      /^#\s*\d{8}-\d{6}-/.test(line) ||
      /^Looking in indexes:/i.test(line) ||
      /^WARNING:\s*Running pip as the/i.test(line) ||
      /^\[notice\]/i.test(line) ||
      /^(?:video2sqlite|convert)\s+v/i.test(line) ||
      /^internal=|^workspace=|^media=|^audio=|^transcript=|^vision=|^videos=|^srt=|^slides=|^temp=|^ffmpeg=|^版本=|^audio_mode=|^slide_mode=|^transcript_source=|^cookies=|^model_cache=/i.test(
        line,
      ) ||
      /^source\s+\d+\/\d+\s+/i.test(line) ||
      /^package progress total:/i.test(line) ||
      /^這裡若出現 Download complete/i.test(line) ||
      /^vision analyze frame\b/i.test(line) ||
      /^vision skip non-informative frame\b/i.test(line) ||
      /^sqlite_ready\s+(?:compatible cache|hit)\b/i.test(line) ||
      /^\[download\]\s+Downloading item\s+\d+\s+of\s+\d+/i.test(line) ||
      /^\[youtube(?::tab)?\].*:\s*(?:Downloading\s+(?:webpage|initial data API JSON|web client config|web player API JSON|android player API JSON|player\s+|\d+\s+items\s+of\s+\d+)|Redownloading\s+playlist API JSON)/i.test(
        line,
      ) ||
      /^\[youtube(?::tab)?\]\s+Extracting URL:/i.test(line)
    );
  }
  function isActivityHistoryNoise(line) {
    line = normalizeNoteLine(String(line || "").trim());
    if (!line || isActivityNoise(line)) return true;
    if (/^已啟動任務$/i.test(line)) return true;
    if (/^\[download\]\s+Downloading item\s+\d+\s+of\s+\d+/i.test(line))
      return true;
    if (
      /^\[youtube(?::tab)?\].*:\s*(?:Downloading\s+(?:webpage|initial data API JSON|web client config|web player API JSON|android player API JSON|player\s+|\d+\s+items\s+of\s+\d+)|Redownloading\s+playlist API JSON)/i.test(
        line,
      ) ||
      /^\[youtube(?::tab)?\]\s+Extracting URL:/i.test(line)
    )
      return true;
    if (/^package progress:|^package ready:|^install package done:/i.test(line))
      return true;
    if (
      /^Collecting\s+|^Downloading\s+|^Using cached\s+|^Preparing metadata|^Getting requirements|^Installing collected packages|^Successfully installed|^Requirement already satisfied:/i.test(
        line,
      )
    )
      return true;
    if (/^install package:\s*/i.test(line)) return false;
    if (
      /^\[youtube\].*:\s*Downloading\s+(?:webpage|initial data API JSON|web client config|web player API JSON|android player API JSON|player\s+)/i.test(
        line,
      )
    )
      return true;
    if (/^Model files already exist\.|^Creating model:/i.test(line))
      return true;
    if (/^I\d{4}\s+.*\boneDNN\b/i.test(line)) return true;
    if (/^INFO:\s*Could not find files for the given pattern/i.test(line))
      return true;
    if (/^warnings\.warn\(warning_message\)/i.test(line)) return true;
    if (/No ccache found/i.test(line)) return true;
    return false;
  }
  function packageProgressInfo(line) {
    line = String(line || "").trim();
    let m = line.match(
      /^package progress:\s*(\d+)\s*\/\s*(\d+)\s*([^:]*?)\s*:\s*(.+)$/i,
    );
    if (!m) m = line.match(/^package progress:\s*(\d+)\s*\/\s*(\d+)\s*(.*)$/i);
    if (!m) return null;
    const idx = Math.max(0, Number(m[1]) || 0),
      total = Math.max(1, Number(m[2]) || 1),
      status = String(m[3] || "")
        .trim()
        .toLowerCase(),
      name = String(m[4] || m[3] || "package").trim();
    const doneLike = /^(?:ready|done|skipped|failed)$/i.test(status);
    let phase = 0.05;
    if (/checking/i.test(status)) phase = 0.05;
    else if (/installing|running|pulling|downloading/i.test(status))
      phase = 0.08;
    else if (doneLike) phase = 1;
    const completed = doneLike ? idx : Math.max(0, idx - 1) + phase;
    const displayDone = doneLike
      ? Math.min(idx, total)
      : Math.max(0, Math.min(idx - 1, total));
    return {
      done: Math.max(0, Math.min(idx, total)),
      displayDone,
      total,
      status,
      name,
      pct: clampNotePercent((completed / total) * 100, 0),
    };
  }
  function qwenPullProgressInfo(line) {
    line = normalizeNoteLine(String(line || "").trim());
    let m =
      line.match(/^qwen model pull progress:\s*(.+)$/i) ||
      line.match(/^qwen model pull:\s*(.+)$/i);
    if (!m) return null;
    const raw = String(m[1] || "")
      .replace(/[\u2800-\u28ff◐◓◑◒]+/g, "")
      .replace(/\s+/g, " ")
      .trim();
    let pct = NaN,
      value = "處理中";
    let pm = raw.match(/(\d{1,3}(?:\.\d+)?)\s*%/);
    if (pm) {
      pct = clampNotePercent(Number(pm[1]), 0);
      value = Math.round(pct) + "%";
    } else if (/pulling manifest/i.test(raw)) {
      pct = 8;
      value = "讀取模型資訊";
    } else if (/pulling/i.test(raw)) {
      pct = 35;
      value = "下載中";
    } else if (/verifying/i.test(raw)) {
      pct = 92;
      value = "驗證中";
    } else if (/writing manifest/i.test(raw)) {
      pct = 97;
      value = "寫入模型資訊";
    } else if (/removing/i.test(raw)) {
      pct = 98;
      value = "清理中";
    } else if (/success/i.test(raw)) {
      pct = 100;
      value = "100%";
    } else {
      pct = 0;
      value = "處理中";
    }
    return {
      label: "下載 Qwen 模型",
      pct: clampNotePercent(pct, 0),
      value,
      raw,
    };
  }
  function qwenPullProgressFromLog(log) {
    const lines = noteLogLines(log);
    for (let i = lines.length - 1; i >= 0; i--) {
      const q = qwenPullProgressInfo(lines[i]);
      if (q) return q;
    }
    return null;
  }
  function qwenPullStepFromLog(log, line) {
    let q = qwenPullProgressInfo(line || "") || qwenPullProgressFromLog(log);
    if (!q) return null;
    return {
      label: q.label,
      pct: q.pct,
      indeterminate: !(q.pct > 0 && q.pct < 100) && q.value === "處理中",
      value: q.value,
    };
  }

  function packageProgressFromLog(log) {
    const lines = noteLogLines(log);
    for (let i = lines.length - 1; i >= 0; i--) {
      const pp = packageProgressInfo(lines[i]);
      if (pp) {
        if (
          /ollama model|qwen/i.test(pp.name || "") &&
          !/^(?:ready|done|failed)$/i.test(pp.status || "")
        ) {
          const qp = qwenPullProgressFromLog(log);
          if (qp) {
            pp.pct = clampNotePercent(
              ((Math.max(0, pp.done - 1) + qp.pct / 100) /
                Math.max(1, pp.total)) *
                100,
              0,
            );
            pp.displayDone = Math.max(0, Math.min(pp.done - 1, pp.total));
          }
        }
        return pp;
      }
    }
    return null;
  }
  function noteImportantLine(log, line) {
    const lines = noteLogLines(log);
    for (let i = lines.length - 1; i >= 0; i--) {
      const l = lines[i];
      if (isNoteLogNoise(l)) continue;
      if (
        /^(analysis progress:|download progress:|analyze (?:video|media) from input:|download (?:video|media) from input:|read YouTube info:|package progress:|Downloading|Collecting|Installing collected packages|Successfully installed|install package(?: done)?:|Requirement already satisfied:|Using cached|Preparing metadata|Getting requirements|package ready:|prepare runtime|準備模型|模型準備完成|ollama cli|ollama service|fallback to Whisper|try YouTube captions|srt |extract slide|visual analysis|vision progress|qwen refine|qwen model|qwen prepare|db FID=|ERROR:|Warning|DeprecationWarning|UserWarning|FutureWarning|警告)/i.test(
          l,
        )
      )
        return compactNoteLine(cleanActivityLine(l), 150);
    }
    return compactNoteLine(
      cleanActivityLine(line || lastProgressLine(log)),
      150,
    );
  }
  function lastProgressLine(log) {
    const lines = noteLogLines(log);
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (!isNoteLogNoise(line)) return compactNoteLine(line);
    }
    return "";
  }
  function isSourceContextLine(line) {
    line = String(line || "").trim();
    return (
      /^#\s*Source context:/i.test(line) ||
      /^[> ]?\s*\d+\s*:/i.test(line) ||
      /^File \"[^\"]+\", line \d+/i.test(line) ||
      /^Traceback(?: |$)/i.test(line) ||
      /^During handling of the above exception/i.test(line)
    );
  }
  function bestErrorSummary(text, fallback) {
    const lines = noteLogLines(text);
    const strong =
      /^(?:[A-Za-z_][\w.]*Error|[A-Za-z_][\w.]*Exception|PackageInstallError|ModuleNotFoundError|PermissionError|FileNotFoundError|TypeError|RuntimeError|OSError|subprocess\.CalledProcessError)\b|^(?:ERROR:|pip install failed|package installed but|failed:|無法|錯誤|失敗)/i;
    for (let i = lines.length - 1; i >= 0; i--) {
      let line = normalizeNoteLine(lines[i]).trim();
      if (!line || isNoteLogNoise(line) || isSourceContextLine(line)) continue;
      if (strong.test(line)) return compactNoteLine(line, 220);
    }
    for (let i = lines.length - 1; i >= 0; i--) {
      let line = normalizeNoteLine(lines[i]).trim();
      if (!line || isNoteLogNoise(line) || isSourceContextLine(line)) continue;
      if (isErrorLogLine(line)) return compactNoteLine(line, 220);
    }
    return compactNoteLine(fallback || "前置安裝失敗", 220);
  }
  function isErrorLogLine(line) {
    line = String(line || "");
    if (/^WARNING:\s*\[youtube\]|YouTube 解析警告|YouTube 暫時限流/i.test(line))
      return false;
    if (
      /(Warning|DeprecationWarning|UserWarning|FutureWarning|警告)/i.test(
        line,
      ) &&
      !/(Traceback|ERROR:|Exception|failed|失敗|錯誤|無法|cannot|not found|No such file|UnicodeEncodeError|returned non-zero|exit status|WinError|Long Path)/i.test(
        line,
      )
    )
      return false;
    return (
      /(Traceback|Error|Exception|failed|失敗|錯誤|無法|cannot|not found|No such file|UnicodeEncodeError|returned non-zero|exit status|WinError|Long Path)/i.test(
        line,
      ) && !/error=0\b/i.test(line)
    );
  }
  function extractErrorLog(log) {
    const lines = noteLogLines(log);
    let idx = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (/^Traceback/i.test(lines[i]) || isErrorLogLine(lines[i])) {
        idx = i;
        break;
      }
    }
    if (idx >= 0)
      return lines
        .slice(Math.max(0, idx - 8))
        .slice(-180)
        .join("\n");
    const err = lines.filter(isErrorLogLine);
    if (err.length) return err.slice(-120).join("\n");
    return lines.slice(-160).join("\n");
  }
  function clampNotePercent(v, def) {
    v = Number(v);
    if (!isFinite(v)) v = Number(def || 0);
    return Math.max(0, Math.min(100, v));
  }
  function fractionProgressFromLine(line) {
    line = String(line || "");
    const pp = packageProgressInfo(line);
    if (pp) return pp.pct;
    let m = line.match(
      /^(?:視覺分析中|Vision\s*分析|vision progress|slides progress)\s*(\d+)\s*\/\s*(\d+)/i,
    );
    if (m) {
      const a = Number(m[1]),
        b = Number(m[2]);
      if (b > 0) return clampNotePercent((a / b) * 100, 0);
    }
    if (
      /^stable (?:note|caption) cleanup complete|^本機穩定(?:清理|整理)完成/i.test(
        line,
      )
    )
      return 100;
    m = line.match(
      /(?:package|source|process|download|downloads?|slides?|frames?|pages?|video|jobs?)\D{0,24}(\d+)\D{1,12}(\d+)/i,
    );
    if (m) {
      const a = Number(m[1]),
        b = Number(m[2]);
      if (b > 0) return clampNotePercent((a / b) * 100, 0);
    }
    m = line.match(/\((\d+(?:\.\d+)?)\s*MB\)/i);
    if (m) return NaN;
    m = line.match(/(\d{1,3})(?:\.\d+)?\s*%/);
    if (m) return clampNotePercent(Number(m[1]), 0);
    return NaN;
  }
  function visionStepProgressInfo(line) {
    line = normalizeNoteLine(String(line || ""));
    let m =
      line.match(/^(?:slides|vision) progress:\s*(\d+)\s*\/\s*(\d+)/i) ||
      line.match(/^視覺分析中\s*(\d+)\s*\/\s*(\d+)/i);
    if (!m) return null;
    const a = Number(m[1]) || 0,
      b = Math.max(1, Number(m[2]) || 1),
      pct = clampNotePercent((a / b) * 100, 0);
    return {
      label: `視覺分析 ${a}/${b}`,
      pct,
      indeterminate: false,
      value: Math.round(pct) + "%",
    };
  }
  function stableCleanupStepInfo(line) {
    line = normalizeNoteLine(String(line || ""));
    if (/^stable timeline summary complete/i.test(line))
      return {
        label: "本機時間軸摘要",
        pct: 100,
        indeterminate: false,
        value: "100%",
      };
    if (/^stable note cleanup complete|^本機穩定(?:清理|整理)完成/i.test(line))
      return {
        label: "本機穩定整理",
        pct: 100,
        indeterminate: false,
        value: "100%",
      };
    if (/^stable caption cleanup complete/i.test(line))
      return {
        label: "本機穩定整理",
        pct: 100,
        indeterminate: false,
        value: "100%",
      };
    return null;
  }
  function qwenChunkProgressInfo(line) {
    line = normalizeNoteLine(String(line || ""));
    let sm = line.match(/^qwen timeline summary start\b.*sections=(\d+)/i);
    if (sm)
      return {
        label: `Qwen 摘要 0/${sm[1]}`,
        pct: 0,
        indeterminate: false,
        value: "0%",
      };
    let m =
      line.match(
        /^Qwen\s*(?:整理小段|小段完成|摘要區塊|摘要區塊完成)\s+(\d+(?:\.\d+)?)\s*\/\s*(\d+)/i,
      ) ||
      line.match(
        /^qwen section(?: fallback cleaned| cache hit| done| refine)?\s+(\d+(?:\.\d+)?)\s*\/\s*(\d+)/i,
      ) ||
      line.match(
        /^qwen refine chunk(?: fallback cleaned| cache hit| timeout split| split| done)?\s+(\d+(?:\.\d+)?)\s*\/\s*(\d+)/i,
      );
    if (!m) return null;
    const cur = Number(m[1]),
      tot = Math.max(1, Number(m[2]) || 1),
      pct = clampNotePercent((Math.min(cur, tot) / tot) * 100, 0);
    return {
      label: `Qwen 摘要 ${m[1]}/${m[2]}`,
      pct: pct,
      indeterminate: false,
      value: Math.round(pct) + "%",
    };
  }
  function packageLogRelated(line) {
    return /package progress:|install package|installing package|Collecting |Downloading |Using cached|Preparing metadata|Getting requirements|Installing collected packages|Successfully installed|Requirement already satisfied|install package done|pip install failed|ERROR:/i.test(
      String(line || ""),
    );
  }
  function packageStepFromLog(log, line) {
    const qwenStep = qwenPullStepFromLog(log, line);
    if (qwenStep) return qwenStep;
    const currentLine = String(line || lastProgressLine(log) || "");
    const currentPp = packageProgressInfo(currentLine);
    if (currentPp)
      return {
        label: `準備套件 ${currentPp.displayDone != null ? currentPp.displayDone : currentPp.done}/${currentPp.total}：${currentPp.name || "package"}`,
        pct: currentPp.pct,
        indeterminate: false,
        value: Math.round(currentPp.pct) + "%",
      };
    const lines = noteLogLines(log);
    let start = -1,
      pkg = "",
      done = -1;
    for (let i = 0; i < lines.length; i++) {
      let m = lines[i].match(/^install package:\s*(.+)$/i);
      if (m) {
        start = i;
        pkg = compactNoteLine(m[1], 72);
        done = -1;
        continue;
      }
      m = lines[i].match(/^install package done:\s*(.+)$/i);
      if (m && start >= 0) {
        done = i;
        pkg = pkg || compactNoteLine(m[1], 72);
      }
    }
    if (start < 0) return null;
    let lastUseful = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (!isNoteLogNoise(lines[i])) {
        lastUseful = i;
        break;
      }
    }
    if (done > start && lastUseful > done && !packageLogRelated(currentLine))
      return null;
    let pct = 6,
      failed = false;
    for (let i = start; i < lines.length; i++) {
      const l = lines[i];
      const explicit = fractionProgressFromLine(l);
      if (isFinite(explicit)) pct = Math.max(pct, explicit);
      if (
        /^Collecting\s+/i.test(l) ||
        /^Requirement already satisfied:/i.test(l)
      )
        pct = Math.max(pct, 16);
      if (/Getting requirements|Preparing metadata|metadata/i.test(l))
        pct = Math.max(pct, 30);
      if (
        /Downloading |Using cached|^analysis progress:|^download progress:/i.test(
          l,
        )
      )
        pct = Math.max(pct, 52);
      if (/^Installing collected packages/i.test(l)) pct = Math.max(pct, 78);
      if (
        /^Successfully installed/i.test(l) ||
        (/^Requirement already satisfied:/i.test(l) && i === start + 1) ||
        /^install package done:/i.test(l)
      )
        pct = 100;
      if (
        /ERROR:|failed|Could not|No matching distribution|subprocess-exited-with-error|WinError|too long/i.test(
          l,
        )
      ) {
        failed = true;
        pct = 100;
      }
    }
    if (!pkg) pkg = "package";
    return {
      label: "安裝套件：" + pkg,
      pct: clampNotePercent(pct, 0),
      indeterminate: !failed && pct > 0 && pct < 100 && pct < 52,
      value: failed
        ? "失敗"
        : pct >= 100
          ? "100%"
          : Math.round(clampNotePercent(pct, 0)) + "%",
    };
  }
  function stepProgressFromLog(log, line, state) {
    state = state || "running";
    if (state === "done")
      return {
        label: "目前步驟",
        pct: 100,
        indeterminate: false,
        value: "100%",
      };
    line = String(line || lastProgressLine(log) || "");
    function fromLine(l, allowSetup) {
      l = String(l || "");
      if (!l) return null;
      if (allowSetup) {
        const stage = setupStageStepFromLine(l);
        if (stage) return stage;
        const pkg = packageStepFromLog(log, l);
        if (pkg) return pkg;
      }
      const stable = stableCleanupStepInfo(l);
      if (stable) return stable;
      const qcp = qwenChunkProgressInfo(l);
      if (qcp) return qcp;
      const vision = visionStepProgressInfo(l);
      if (vision) return vision;
      const frac = fractionProgressFromLine(l);
      if (isFinite(frac))
        return {
          label: "目前步驟",
          pct: frac,
          indeterminate: false,
          value: Math.round(frac) + "%",
        };
      return null;
    }
    let step = fromLine(line, true);
    if (step) return step;
    const lines = noteLogLines(log);
    for (let i = lines.length - 1; i >= 0; i--) {
      const raw = normalizeNoteLine(lines[i]);
      if (!raw || isNoteLogNoise(raw)) continue;
      step = fromLine(raw, false);
      if (step) return step;
      const cleaned = cleanActivityLine(raw);
      if (cleaned && cleaned !== raw) {
        step = fromLine(cleaned, false);
        if (step) return step;
      }
    }
    if (state === "error")
      return {
        label: "停止於目前步驟",
        pct: 100,
        indeterminate: false,
        value: "錯誤",
      };
    return { label: "目前步驟", pct: 0, indeterminate: true, value: "處理中" };
  }
  function setupOverallProgressFromLine(line, log) {
    line = normalizeNoteLine(String(line || ""));
    if (!line) return NaN;
    const pp = packageProgressInfo(line);
    if (pp) return clampNotePercent(pp.pct * 0.82, 0);
    const qp = qwenPullProgressInfo(line);
    if (qp) return clampNotePercent(96 + qp.pct * 0.03, 96);
    let m = line.match(/^ollama service waiting:\s*(\d+)\s*\/\s*(\d+)/i);
    if (m) {
      const a = Number(m[1]) || 0,
        b = Math.max(1, Number(m[2]) || 1);
      return clampNotePercent(95 + Math.min(1, a / b) * 4, 95);
    }
    if (/^ollama service ready:/i.test(line)) return 99;
    if (/^ollama service start:|^ollama service app start:/i.test(line))
      return 94;
    if (/^ollama service launch:|^ollama service env /i.test(line)) return 95;
    if (/^ollama cli ready:/i.test(line)) return 93;
    if (/^qwen model ready:/i.test(line)) return 99;
    if (
      /^qwen model check:|^qwen model missing:|^qwen model install:|^qwen prepare/i.test(
        line,
      )
    )
      return 96;
    if (/^whisper import ok:/i.test(line)) return 88;
    if (/^檢查 Whisper 執行環境/i.test(line)) return 86;
    if (/^ffmpeg ready:/i.test(line)) return 84;
    if (/^prepare runtime start/i.test(line)) return 1;
    if (/^package ready:|^install package done:/i.test(line)) {
      const last = packageProgressFromLog(log || "");
      if (last) return clampNotePercent(last.pct * 0.82, 0);
    }
    return NaN;
  }
  function setupStageStepFromLine(line) {
    line = normalizeNoteLine(String(line || ""));
    if (!line) return null;
    let m = line.match(/^ollama service waiting:\s*(\d+)\s*\/\s*(\d+)/i);
    if (m) {
      const a = Number(m[1]) || 0,
        b = Math.max(1, Number(m[2]) || 1);
      const pct = clampNotePercent((a / b) * 100, 0);
      return {
        label: `啟動 Ollama 服務 ${a}/${b}`,
        pct,
        indeterminate: false,
        value: Math.round(pct) + "%",
      };
    }
    if (/^ollama service ready:/i.test(line))
      return {
        label: "啟動 Ollama 服務",
        pct: 100,
        indeterminate: false,
        value: "100%",
      };
    if (
      /^ollama service start:|^ollama service launch:|^ollama service env |^ollama service app start:/i.test(
        line,
      )
    )
      return {
        label: "啟動 Ollama 服務",
        pct: 25,
        indeterminate: true,
        value: "啟動中",
      };
    if (/^ollama cli ready:/i.test(line))
      return {
        label: "Ollama CLI",
        pct: 100,
        indeterminate: false,
        value: "已就緒",
      };
    if (/^qwen model ready:/i.test(line))
      return {
        label: "準備 Qwen 模型",
        pct: 100,
        indeterminate: false,
        value: "已就緒",
      };
    if (
      /^qwen model check:|^qwen model missing:|^qwen model install:|^qwen prepare/i.test(
        line,
      )
    )
      return {
        label: "準備 Qwen 模型",
        pct: 40,
        indeterminate: true,
        value: "處理中",
      };
    if (/^whisper import ok:/i.test(line))
      return {
        label: "Whisper 執行環境",
        pct: 100,
        indeterminate: false,
        value: "已就緒",
      };
    if (/^檢查 Whisper 執行環境/i.test(line))
      return {
        label: "Whisper 執行環境",
        pct: 20,
        indeterminate: true,
        value: "檢查中",
      };
    if (/^ffmpeg ready:/i.test(line))
      return {
        label: "ffmpeg",
        pct: 100,
        indeterminate: false,
        value: "已就緒",
      };
    return null;
  }
  function progressFromLine(line, running) {
    if (!running) return 100;
    line = normalizeNoteLine(String(line || ""));
    if (!line) return 0;
    const pp = packageProgressInfo(line);
    if (pp) return pp.pct;
    let sm = line.match(/^sqlite-ready\s+(\d+)\/(\d+)/i);
    if (sm)
      return clampNotePercent(
        88 + (Number(sm[1]) / Math.max(1, Number(sm[2]))) * 8,
        88,
      );
    if (/^sqlite batch write start/i.test(line)) return 97;
    if (/^sqlite batch write done/i.test(line)) return 99;
    if (
      /^stable note cleanup complete|^stable caption cleanup complete|^本機穩定(?:清理|整理)完成/i.test(
        line,
      )
    )
      return 93;
    const qp = qwenPullProgressInfo(line);
    if (qp) return clampNotePercent(82 + qp.pct * 0.16, 82);
    const qcp = qwenChunkProgressInfo(line);
    if (qcp) return clampNotePercent(91 + qcp.pct * 0.05, 91);
    let m = line.match(/^(?:slides|vision) progress:\s*(\d+)\s*\/\s*(\d+)/i);
    if (m) {
      const a = Number(m[1]),
        b = Math.max(1, Number(m[2]) || 1);
      return clampNotePercent(76 + Math.min(1, a / b) * 14, 76);
    }
    const dp = downloadProgressInfo(line);
    if (dp)
      return dp.kind === "download"
        ? clampNotePercent(8 + dp.pct * 0.26, 8)
        : clampNotePercent(35 + dp.pct * 0.25, 35);
    if (/done ok=/i.test(line)) return 100;
    if (
      /db FID=.*final content saved|final content saved|db FID=.*final srt saved|final srt saved/i.test(
        line,
      )
    )
      return 96;
    if (/db FID=.*plain srt saved/i.test(line)) return 64;
    if (/^vision frames\s+.+?:\s*\d+|^slides\s+.+?:\s*\d+/i.test(line))
      return 91;
    if (/analyze video frames with Vision|vision analyze frame/i.test(line))
      return 76;
    if (/YouTube captions.*segments=|srt YouTube captions/i.test(line))
      return 62;
    if (
      /YouTube captions|caption|try YouTube captions|fallback to Whisper|plain srt saved/i.test(
        line,
      )
    )
      return 44;
    if (/^srt\s+.+?\s+->\s+.+/i.test(line)) return 56;
    if (/audio |skip audio/i.test(line)) return 38;
    if (/ollama cli|ollama service|qwen model|qwen prepare/i.test(line))
      return 32;
    if (/whisper model|準備 Whisper 模型|模型準備|prepare models/i.test(line))
      return 34;
    if (/process \d+\/\d+/i.test(line)) return 16;
    if (/source \d+\/\d+/i.test(line)) return 12;
    if (
      /jobs total=|download \d+\/\d+|analyze \d+\/\d+|playlist videos|local videos|local inputs/i.test(
        line,
      )
    )
      return 8;
    const frac = fractionProgressFromLine(line);
    if (
      isFinite(frac) &&
      /(package|slides?|frames?|pages?|video|jobs?)/i.test(line)
    )
      return Math.min(95, Math.max(1, frac));
    return 0;
  }
  function sourceWorkStarted(log) {
    return /(jobs total=|download \d+\/\d+|analyze \d+\/\d+|analyze (?:video|media) from input|download (?:video|media) from input|process \d+\/\d+|playlist videos=|local videos=|local media=|local inputs=|\[youtube\]|\[download\]|try YouTube captions|fallback to Whisper|srt |analyze video frames|vision frames|db FID=|done ok=)/i.test(
      String(log || ""),
    );
  }
  function progressFromLog(log, running) {
    if (!running) return 100;
    const started = sourceWorkStarted(log),
      line = lastProgressLine(log);
    if (!started) {
      const stage = setupOverallProgressFromLine(line, log);
      if (isFinite(stage)) return Math.round(clampNotePercent(stage, 0));
      const pp = packageProgressFromLog(log);
      if (pp) return Math.round(clampNotePercent(pp.pct * 0.82, 0));
      const pkg = packageStepFromLog(log, line);
      if (pkg) return Math.round(clampNotePercent(pkg.pct * 0.82, 0));
    }
    const lines = noteLogLines(log);
    for (let i = lines.length - 1; i >= 0; i--) {
      const l = lines[i];
      if (isNoteLogNoise(l)) continue;
      if (
        started &&
        /^package progress:|^package ready:|^install package(?: done)?:/i.test(
          l,
        )
      )
        continue;
      const p = progressFromLine(l, true);
      if (p > 0) return p;
    }
    return 0;
  }
  function cleanProgressSourceText(value) {
    let text = cleanVisibleNoteSource(String(value || "").trim());
    if (!text) return "";
    text = text
      .replace(/\s+source=.+$/i, "")
      .replace(/\s+[·｜|]\s+.*$/, " ")
      .trim();
    text = text.replace(/(?:analysis|analyze|queue)$/i, "").trim();
    return cleanVisibleNoteSource(text);
  }
  function expandedInfoFromLine(line) {
    line = normalizeNoteLine(String(line || "").trim());
    if (!line) return null;
    let m =
      line.match(/^sqlite-ready\s+(\d+)\s*\/\s*(\d+)/i) ||
      line.match(/^檔案已備齊\s+(\d+)\s*\/\s*(\d+)/i);
    if (m) {
      const done = Number(m[1]) || 0,
        total = Number(m[2]) || 0;
      return {
        done,
        current: total ? Math.min(total, done + 1) : done,
        total,
        phase: "ready",
      };
    }
    m = line.match(/\bplaylist videos\s*=\s*(\d+)/i);
    if (m) return { total: Number(m[1]) || 0, phase: "expand" };
    m = line.match(/\bmixed sources\s*=\s*\d+\s+videos\s*=\s*(\d+)/i);
    if (m) return { total: Number(m[1]) || 0, phase: "expand" };
    m = line.match(/\blocal videos\s*=\s*(\d+)/i);
    if (m) return { total: Number(m[1]) || 0, phase: "expand" };
    m = line.match(/\bjobs total\s*=\s*(\d+)/i);
    if (m) return { total: Number(m[1]) || 0 };
    m = line.match(/^source\s+(\d+)\s*\/\s*(\d+)\s+\S+\s+(.+)$/i);
    if (m)
      return {
        current: Number(m[1]) || 0,
        total: Number(m[2]) || 0,
        source: cleanProgressSourceText(m[3]),
        phase: "processing",
      };
    m = line.match(/^process\s+(\d+)\s*\/\s*(\d+)\s*[:：]\s*(.+)$/i);
    if (m)
      return {
        current: Number(m[1]) || 0,
        total: Number(m[2]) || 0,
        source: cleanProgressSourceText(m[3]),
        phase: "processing",
      };
    m = line.match(
      /^(?:目前來源|開始處理)\s*(\d+)\s*\/\s*(\d+)\s*[:：]\s*(.+)$/i,
    );
    if (m)
      return {
        current: Number(m[1]) || 0,
        total: Number(m[2]) || 0,
        source: cleanProgressSourceText(m[3]),
        phase: "processing",
      };
    m = line.match(
      /^(?:queue analysis|analyze|analysis ready|analysis failed|排入分析|分析完成)\s+(\d+)\s*\/\s*(\d+)\s+(.+)$/i,
    );
    if (m)
      return {
        analysisCurrent: Number(m[1]) || 0,
        total: Number(m[2]) || 0,
        source: cleanProgressSourceText(m[3]),
        phase: "analysis",
      };
    m =
      line.match(/^db\s+FID=\S+\s+final content saved\b.*?\bsource=(.+)$/i) ||
      line.match(/^db\s+FID=\S+\s+final srt saved\b.*?\bsource=(.+)$/i);
    if (m) return { source: cleanProgressSourceText(m[1]), phase: "saved" };
    m = line.match(/^done ok=(\d+)\s+error=(\d+)\b/i);
    if (m) {
      const done = (Number(m[1]) || 0) + (Number(m[2]) || 0);
      return { current: done, total: done, phase: "done" };
    }
    return null;
  }
  function noteRowStatusText(row) {
    const parts = [];
    (Array.isArray(row && row.activity) ? row.activity : []).forEach((a) => {
      const line = normalizeNoteLine(String((a && a.line) || "").trim());
      if (line) parts.push(line);
    });
    const tail = String((row && row.log_tail) || "");
    if (tail) parts.push(tail);
    return parts.join("\n");
  }
  function noteStatusTextFromRows(rows, log) {
    const parts = [];
    const base = String(log || "");
    if (base) parts.push(base);
    (Array.isArray(rows) ? rows : []).forEach((r) => {
      const text = noteRowStatusText(r);
      if (text) parts.push(text);
    });
    return parts.join("\n");
  }
  function noteExpandedProgressInfo(rows, log) {
    rows = Array.isArray(rows) ? rows : [];
    const info = {
      current: 0,
      total: 0,
      source: "",
      phase: "",
      analysisCurrent: 0,
      analysisTotal: 0,
      rowLog: "",
      done: 0,
    };
    function apply(obj, rowLog) {
      if (!obj) return;
      if (obj.total > 0)
        info.total = Math.max(info.total, Number(obj.total) || 0);
      if (obj.done > 0) info.done = Math.max(info.done, Number(obj.done) || 0);
      if (obj.analysisCurrent > 0) {
        info.analysisCurrent = Math.max(
          info.analysisCurrent,
          Number(obj.analysisCurrent) || 0,
        );
        info.analysisTotal = Math.max(
          info.analysisTotal,
          Number(obj.total) || 0,
          info.total,
        );
        if (!info.current && obj.phase) info.phase = obj.phase;
      }
      if (obj.current > 0) {
        info.current = Number(obj.current) || 0;
        info.phase = obj.phase || info.phase || "processing";
        if (rowLog) info.rowLog = rowLog;
      }
      if (obj.source)
        info.source = cleanProgressSourceText(obj.source) || info.source;
      if (obj.phase && !info.phase) info.phase = obj.phase;
    }
    rows.forEach((r) => {
      if (!r) return;
      const rowText = noteRowStatusText(r);
      apply(
        {
          current: Number(r.expanded_current) || 0,
          total:
            Number(r.expanded_total) || Number(r.expanded_analysis_total) || 0,
          source: r.expanded_source || "",
          phase: r.expanded_phase || "",
          analysisCurrent: Number(r.expanded_analysis_current) || 0,
          done: Number(r.expanded_done) || 0,
        },
        rowText,
      );
      (Array.isArray(r.activity) ? r.activity : []).forEach((a) =>
        apply(expandedInfoFromLine(a && a.line), rowText),
      );
      noteLogLines(rowText).forEach((l) =>
        apply(expandedInfoFromLine(l), rowText),
      );
    });
    noteLogLines(log || "").forEach((l) =>
      apply(expandedInfoFromLine(l), String(log || "")),
    );
    if (info.total > 0 && info.current > info.total) info.current = info.total;
    if (info.total > 0 && info.done > info.total) info.done = info.total;
    if (
      !info.current &&
      info.total === 1 &&
      sourceWorkStarted(
        String(log || rows.map((r) => (r && r.log_tail) || "").join("\n")),
      )
    )
      info.current = 1;
    if (!info.source) {
      const active = rows.find((r) => r && r.running) || rows[0] || {};
      info.source = rowSourceLabel(active);
    }
    return info.total > 0 ? info : null;
  }
  function progressFromRows(rows, running) {
    rows = Array.isArray(rows) ? rows : [];
    if (!rows.length) return running ? 0 : 100;
    const combined = noteStatusTextFromRows(
      rows,
      rows.map((r) => (r && r.log_tail) || "").join("\n"),
    );
    const expanded = noteExpandedProgressInfo(rows, combined);
    if (running && expanded && expanded.total > 0) {
      const total = Math.max(1, Number(expanded.total) || 1),
        done = Math.max(0, Math.min(total, Number(expanded.done) || 0)),
        current = Math.max(0, Math.min(total, Number(expanded.current) || 0));
      if (!done && !current) return 0;
      const rowLog =
        expanded.rowLog ||
        combined ||
        noteRowStatusText(rows.find((r) => r && r.running) || rows[0] || {});
      let step = 0;
      if (current > done && current <= total)
        step = clampNotePercent(progressFromLog(rowLog, true), 0) / 100;
      const units = Math.max(
        done,
        current > 0 ? Math.max(0, current - 1) + step : 0,
      );
      return clampNotePercent((units / total) * 100, 0);
    }
    const vals = rows.map((r) => {
      if (!r || !r.ok) return 100;
      if (!r.running && Number(r.returncode || 0) !== 0) return 100;
      if (!r.running) return 100;
      return progressFromLog(r.log_tail || "", true);
    });
    return clampNotePercent(
      vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length),
      0,
    );
  }
  function packageSetupLine(line) {
    line = String(line || "");
    return /^package progress:|^ollama cli|^ollama service|^qwen model|^qwen prepare|^Downloading\s+|^Collecting\s+|^Installing collected packages|^Successfully installed|^install package:|^install package done:|^package ready:|^prepare runtime|Requirement already satisfied|Getting requirements|Preparing metadata|pip install/i.test(
      line,
    );
  }
  function cleanVisibleNoteSource(value) {
    value = String(value || "")
      .trim()
      .replace(/[):，。；;]+$/g, "");
    return value;
  }
  function noteSourceFromLine(line, fallback) {
    line = String(line || "");
    const patterns = [
      /\bsource=(https?:\/\/\S+|www\.\S+)/i,
      /^source\s+\d+\s*\/\s*\d+\s+\S+\s+(https?:\/\/\S+|www\.\S+)/i,
      /^(?:analyze|download) (?:video|media) from input:\s*(https?:\/\/\S+|www\.\S+)/i,
      /^read YouTube info:\s*(https?:\/\/\S+|www\.\S+)/i,
      /^(?:analyze|queue analysis|analysis ready|analysis failed)\s+\d+\s*\/\s*\d+\s+(https?:\/\/\S+|www\.\S+)/i,
      /^process\s+\d+\s*\/\s*\d+\s*:\s*(https?:\/\/\S+|www\.\S+)/i,
      /^analyze video frames with Vision LLM:\s*(https?:\/\/\S+|www\.\S+)/i,
      /^(?:slides|vision) progress:\s*\d+\s*\/\s*\d+\s+(https?:\/\/\S+|www\.\S+)/i,
      /^slides\s+(https?:\/\/\S+|www\.\S+):/i,
      /^error\s+(https?:\/\/\S+|www\.\S+)/i,
      /^source unavailable\s+(https?:\/\/\S+|www\.\S+)/i,
      /^skip unavailable\s+(https?:\/\/\S+|www\.\S+)/i,
      /^skipped:\s*(https?:\/\/\S+|www\.\S+)/i,
      /^failed:\s*(https?:\/\/\S+|www\.\S+)/i,
      /^\[youtube\]\s+Extracting URL:\s*(https?:\/\/\S+|www\.\S+)/i,
    ];
    for (const re of patterns) {
      const m = line.match(re);
      if (m && m[1]) return cleanVisibleNoteSource(m[1]);
    }
    fallback = String(fallback || "").trim();
    return fallback ? cleanVisibleNoteSource(fallback) : "";
  }
  function stripVisibleSourceFields(line) {
    return String(line || "")
      .replace(/\s+source=(?:https?:\/\/\S+|www\.\S+|[^\s]+)/gi, "")
      .replace(/\s+caption_source=\S+/gi, "")
      .replace(/\s+media=\S+/gi, "")
      .replace(/\s+file=\S+/gi, "")
      .trim();
  }
  function noteSourceMainText(line, fallback) {
    const src = noteSourceFromLine(line, fallback);
    return src || "";
  }
  function runtimeDeviceLabel(text) {
    text = String(text || "");
    const proc = (text.match(/\bprocessor=([^\s]+)/i) || [])[1] || "";
    let out = "";
    if (/^GPU$/i.test(proc)) out = "GPU";
    else if (/^CPU$/i.test(proc)) out = "CPU";
    else if (/^mixed_gpu_(\d+)pct$/i.test(proc)) {
      const m = proc.match(/(\d+)/);
      out = `GPU/CPU 混用（GPU 約 ${m ? m[1] : "?"}%）`;
    } else if (proc) out = proc;
    const req = (text.match(/\brequested_num_gpu=([^\s]+)/i) || [])[1] || "";
    const vram = (text.match(/\bsize_vram=([^\s]+)/i) || [])[1] || "";
    const size = (text.match(/\bsize=([^\s]+)/i) || [])[1] || "";
    const parts = [];
    if (out) parts.push(out);
    if (req) parts.push(`num_gpu=${req}`);
    if (vram || size) parts.push(`VRAM ${vram || "?"}/${size || "?"}`);
    return parts.join(" · ");
  }
  function noteTextAfterSourcePrefix(line) {
    line = String(line || "");
    return line
      .replace(
        /^(?:analyze|queue analysis|analysis ready|analysis failed)\s+\d+\s*\/\s*\d+\s+(?:https?:\/\/\S+|www\.\S+)\s*(?:·|-|：|:)?\s*/i,
        "",
      )
      .replace(
        /^process\s+\d+\s*\/\s*\d+\s*:\s*(?:https?:\/\/\S+|www\.\S+)\s*(?:·|-|：|:)?\s*/i,
        "",
      )
      .trim();
  }
  function cleanActivityLine(line, fallbackSource) {
    line = normalizeNoteLine(String(line || "").trim());
    let sm = line.match(
      /^server scheduler:\s*queued;\s*max_processes=(\d+)\s+parallel_jobs=(\d+);\s*(.*)$/i,
    );
    if (sm) return `已加入佇列`;
    sm = line.match(
      /^server scheduler:\s*start job;\s*max_processes=(\d+)\s+parallel_jobs=(\d+);\s*(.*)$/i,
    );
    if (sm) return `開始執行轉檔`;
    const srcText = noteSourceMainText(line, fallbackSource);
    let rt = line.match(
      /^ollama runtime\s+role=([^\s]+)\s+model=([^\s]+)(.*)$/i,
    );
    if (rt) {
      const role =
        String(rt[1] || "").toLowerCase() === "vision" ? "Vision" : "Qwen";
      const detail = runtimeDeviceLabel(rt[3] || "");
      const rtSrc = noteSourceMainText(line, "");
      return `${role} 實際模型：${rt[2]}${detail ? ` · ${detail}` : ""}${rtSrc ? `：${rtSrc}` : ""}`;
    }
    let wm = line.match(
      /^whisper model=([^\s]+)\s+device=([^\s]+)(?:\s+cache=(.*))?$/i,
    );
    if (wm)
      return `Whisper 實際模型：${wm[1]} · ${String(wm[2]).toLowerCase() === "cuda" ? "GPU/CUDA" : "CPU"}`;
    wm = line.match(
      /^whisper import ok:.*?cuda_available=(True|False|true|false).*?device=([^\s]+)/i,
    );
    if (wm)
      return `Whisper 執行環境：${/^true$/i.test(wm[1]) ? "GPU/CUDA" : "CPU"}${wm[2] && wm[2] !== "-" ? ` · ${wm[2]}` : ""}`;
    wm = line.match(/^torch CUDA ready:\s*(.+)$/i);
    if (wm) return `PyTorch CUDA 已啟用：${compactNoteLine(wm[1], 140)}`;
    let sj = line.match(
      /^parallel processing workers=(\d+)\s+sqlite_write=batch-after-ready/i,
    );
    if (sj) return `依序準備檔案，SQLite 最後批次寫入`;
    sj = line.match(
      /^sqlite-ready\s+(\d+\/\d+)\s+.*segments=(\d+).*source=(.+)$/i,
    );
    if (sj)
      return `檔案已備齊 ${sj[1]}，等待批次寫入 SQLite（字幕 ${sj[2]} 段）：${stripVisibleSourceFields(sj[3])}`;
    sj = line.match(/^sqlite batch write start count=(\d+)/i);
    if (sj) return `開始批次寫入 SQLite（${sj[1]} 筆）`;
    sj = line.match(/^sqlite batch write done count=(\d+)/i);
    if (sj) return `SQLite 批次寫入完成（${sj[1]} 筆）`;
    sj = line.match(
      /^stable note cleanup complete\s+segments=(\d+).*?source=(.+)$/i,
    );
    if (sj)
      return `本機穩定清理完成（字幕 ${sj[1]} 段）：${stripVisibleSourceFields(sj[2])}`;
    sj = line.match(
      /^stable caption cleanup complete\s+chars=(\d+).*?source=(.+)$/i,
    );
    if (sj)
      return `本機穩定清理完成（${sj[1]} 字）：${stripVisibleSourceFields(sj[2])}`;
    const dp = downloadProgressInfo(line);
    if (dp) {
      const name = "分析進度";
      return `${name} ${Math.round(dp.pct)}%${dp.amount ? `（${dp.amount}）` : ""}${srcText ? `：${srcText}` : ""}`;
    }
    let sp = line.match(
      /^(?:slides|vision) progress:\s*(\d+)\s*\/\s*(\d+)\s*(.*)$/i,
    );
    if (sp)
      return `視覺分析中 ${sp[1]}/${sp[2]}${srcText ? `：${srcText}` : sp[3] ? `：${stripVisibleSourceFields(sp[3])}` : ""}`;
    let ap = line.match(/^analysis progress:\s*(\d{1,3})%\s*\(([^)]*)\)/i);
    if (ap)
      return `分析進度 ${ap[1]}%（${ap[2]}）${srcText ? `：${srcText}` : ""}`;
    const pp = packageProgressInfo(line);
    if (pp) {
      const verb =
        {
          checking: "檢查",
          ready: "已就緒",
          installing: "安裝中",
          done: "已完成",
          failed: "失敗",
        }[pp.status] ||
        pp.status ||
        "處理";
      return `${verb} ${pp.name || "package"}`;
    }
    let qto = line.match(
      /^qwen timeline summary start\b.*sections=(\d+).*timeline_seconds=(\d+).*max_cues=(\d+)/i,
    );
    if (qto)
      return `Qwen 依時間軸切成 ${qto[1]} 摘要區塊（${qto[2]} 秒 / 最多 ${qto[3]} cues）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(/^qwen section cache hit\s+([\d.]+\/\d+)\s+status=(\w+)/i);
    if (qto)
      return `使用 Qwen 摘要快取 ${qto[1]}（${qto[2] === "ok" ? "已整理" : "fallback"}）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(/^qwen section done\s+([\d.]+\/\d+)\s+elapsed=([^\s]+)/i);
    if (qto)
      return `Qwen 摘要區塊完成 ${qto[1]}（${qto[2]}）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen section refine\s+([\d.]+\/\d+)\s+cues=(\d+)\s+chars=(\d+)/i,
    );
    if (qto)
      return `Qwen 整理摘要區塊 ${qto[1]}（${qto[2]} cues / ${qto[3]} 字）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen section fallback cleaned\s+([\d.]+\/\d+)\s+reason=qwen_timeout_(\d+)s/i,
    );
    if (qto)
      return `Qwen 摘要逾時 ${qto[1]}（${qto[2]} 秒），保留本機摘要${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen section fallback cleaned\s+([\d.]+\/\d+)\s+reason=Ollama returned an empty response/i,
    );
    if (qto)
      return `Qwen 回傳空白 ${qto[1]}，保留本機摘要${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen section fallback cleaned\s+([\d.]+\/\d+)\s+reason=(.+)$/i,
    );
    if (qto)
      return `Qwen 摘要區塊 ${qto[1]} 改用本機摘要（${compactNoteLine(qto[2], 80)}）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen timeline summary complete\b.*sections=([\d]+)\/(\d+).*fallback=(\d+).*partial=(\w+)/i,
    );
    if (qto)
      return `Qwen 時間軸摘要完成 ${qto[1]}/${qto[2]}，fallback ${qto[3]}${srcText ? `：${srcText}` : ""}`;
    qto = line.match(/^stable timeline summary complete\b.*sections=(\d+)/i);
    if (qto)
      return `本機時間軸摘要完成（${qto[1]} 區塊）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine start\b.*chunks=(\d+).*timeline_seconds=(\d+).*max_cues=(\d+)/i,
    );
    if (qto)
      return `Qwen 依時間軸切成 ${qto[1]} 小段（${qto[2]} 秒 / 最多 ${qto[3]} cues）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine chunk cache hit\s+([\d.]+\/\d+)\s+status=(\w+)/i,
    );
    if (qto)
      return `使用 Qwen 分段快取 ${qto[1]}（${qto[2] === "ok" ? "已整理" : "fallback"}）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine chunk done\s+([\d.]+\/\d+)\s+elapsed=([^\s]+)/i,
    );
    if (qto)
      return `Qwen 小段完成 ${qto[1]}（${qto[2]}）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine chunk\s+([\d.]+\/\d+)\s+cues=(\d+)\s+chars=(\d+)/i,
    );
    if (qto)
      return `Qwen 整理小段 ${qto[1]}（${qto[2]} cues / ${qto[3]} 字）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine chunk fallback cleaned\s+([\d.]+\/\d+)\s+reason=qwen_timeout_(\d+)s/i,
    );
    if (qto)
      return `Qwen 整理逾時 ${qto[1]}（${qto[2]} 秒），改用 fallback${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine chunk fallback cleaned\s+([\d.]+\/\d+)\s+reason=Ollama returned an empty response/i,
    );
    if (qto)
      return `Qwen 回傳空白 ${qto[1]}，改用 fallback${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine chunk split\s+([\d.]+\/\d+)\s+->\s+(\d+)\s+smaller chunks\s+reason=(.+)$/i,
    );
    if (qto)
      return `Qwen 輸出格式不穩，改切成 ${qto[2]} 更小段重試 ${qto[1]}（${compactNoteLine(qto[3], 80)}）${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine chunk timeout split\s+([\d.]+\/\d+)\s+->\s+(\d+)\s+smaller chunks/i,
    );
    if (qto)
      return `Qwen 逾時，改切成 ${qto[2]} 更小段重試 ${qto[1]}${srcText ? `：${srcText}` : ""}`;
    qto = line.match(/^qwen timeout count=(\d+)\/(\d+)/i);
    if (qto)
      return `Qwen 逾時計數 ${qto[1]}/${qto[2]}${srcText ? `：${srcText}` : ""}`;
    qto = line.match(
      /^qwen refine disabled for remaining videos after\s+(\d+).*timeout/i,
    );
    if (qto) return `Qwen 連續逾時 ${qto[1]} 次，後續影片改用 fallback 整理`;
    qto = line.match(/^qwen refine skipped disabled-after-timeout/i);
    if (qto)
      return `略過 Qwen：前面已逾時，直接使用 fallback${srcText ? `：${srcText}` : ""}`;
    let pkg = line.match(/^package ready:\s*(.+)$/i);
    if (pkg) return `已就緒 ${pkg[1]}`;
    pkg = line.match(/^install package done:\s*(.+)$/i);
    if (pkg) return `已完成 ${pkg[1]}`;
    pkg = line.match(/^install package:\s*(.+)$/i);
    if (pkg) return `安裝 ${pkg[1]}`;
    let qm = line.match(/^ollama cli ready:\s*(.+)$/i);
    if (qm) return `Ollama CLI 已就緒：${compactNoteLine(qm[1], 120)}`;
    qm = line.match(/^ollama cli missing/i);
    if (qm) return "找不到 Ollama CLI，準備自動安裝";
    qm = line.match(/^ollama cli install command:\s*(.+)$/i);
    if (qm) return `安裝 Ollama：${compactNoteLine(qm[1], 150)}`;
    qm = line.match(/^ollama cli install:\s*(.+)$/i);
    if (qm) return `安裝 Ollama：${compactNoteLine(qm[1], 150)}`;
    qm = line.match(/^ollama service start:\s*(.+)$/i);
    if (qm) return `啟動 Ollama 服務：${qm[1]}`;
    qm = line.match(/^ollama service launch:\s*([^:]+):\s*(.+)$/i);
    if (qm)
      return `啟動 Ollama 服務方式：${qm[1]} — ${compactNoteLine(qm[2], 120)}`;
    qm = line.match(/^ollama service env\s+OLLAMA_HOST=(.+)$/i);
    if (qm) return `Ollama 服務環境：OLLAMA_HOST=${qm[1]}`;
    qm = line.match(/^ollama service app start:\s*(.+)$/i);
    if (qm) return `啟動 Ollama 桌面服務：${compactNoteLine(qm[1], 120)}`;
    qm = line.match(/^ollama service exited:\s*(.+)$/i);
    if (qm) return `Ollama 服務啟動後結束：${compactNoteLine(qm[1], 150)}`;
    qm = line.match(/^ollama service unavailable:\s*(.+)$/i);
    if (qm) return `Ollama 服務仍無法連線：${qm[1]}`;
    qm = line.match(/^ollama service log:\s*(.+)$/i);
    if (qm) return `Ollama 服務記錄：${compactNoteLine(qm[1], 150)}`;
    qm = line.match(/^ollama service waiting:\s*(.+)$/i);
    if (qm) return `等待 Ollama 服務啟動：${qm[1]}`;
    qm = line.match(/^ollama service ready:\s*(.+)$/i);
    if (qm) return `Ollama 服務已就緒：${qm[1]}`;
    qm = line.match(/^ollama service remote check:\s*(.+)$/i);
    if (qm) return `檢查遠端 Ollama 服務：${qm[1]}`;
    qm = line.match(/^ollama service launch failed:\s*(.+)$/i);
    if (qm) return `Ollama 服務啟動失敗：${compactNoteLine(qm[1], 150)}`;
    qm = line.match(/^ollama service start failed:\s*(.+)$/i);
    if (qm) return `Ollama 服務啟動失敗：${compactNoteLine(qm[1], 150)}`;
    qm = line.match(/^qwen prepare skipped disabled/i);
    if (qm) return "Qwen 整理已停用，略過模型準備";
    qm = line.match(/^qwen prepare skipped no-model/i);
    if (qm) return "沒有設定 Qwen 模型，略過模型準備";
    qm = line.match(/^qwen model check:\s*([^\s]+)(?:\s+host=(.+))?/i);
    if (qm) return `檢查 Qwen 模型：${qm[1]}${qm[2] ? `（${qm[2]}）` : ""}`;
    qm = line.match(/^qwen model missing:\s*([^\s]+)(?:\s+reason=(.*))?/i);
    if (qm)
      return `尚未安裝 Qwen 模型：${qm[1]}${qm[2] ? ` — ${compactNoteLine(qm[2], 120)}` : ""}`;
    qm = line.match(/^qwen model install:\s*(.+)$/i);
    if (qm) return `安裝 Qwen 模型：${qm[1]}`;
    qm = line.match(/^qwen model pull progress:\s*(.+)$/i);
    if (qm) {
      const q = qwenPullProgressInfo(line);
      return `下載 Qwen 模型：${compactNoteLine(q && q.raw ? q.raw : qm[1], 150)}`;
    }
    qm = line.match(/^qwen model pull:\s*(.+)$/i);
    if (qm) return `下載 Qwen 模型：${compactNoteLine(qm[1], 150)}`;
    qm = line.match(/^qwen model ready:\s*(.+)$/i);
    if (qm) return `Qwen 模型已就緒：${qm[1]}`;
    let m;
    if ((m = line.match(/^source\s+(\d+\/\d+)\s+\S+\s+(.+)$/i)))
      return `目前來源 ${m[1]}：${srcText || stripVisibleSourceFields(m[2])}`;
    if (/^WARNING:\s*\[youtube\].*HTTP Error 429/i.test(line))
      return `YouTube 暫時限流（429）${srcText ? `：${srcText}` : ""}`;
    if (/^WARNING:\s*\[youtube\].*n challenge solving failed/i.test(line))
      return `YouTube 解析警告：部分格式可能不可用${srcText ? `：${srcText}` : ""}`;
    if (/^WARNING:\s*\[youtube\].*SABR-only/i.test(line))
      return `YouTube 解析警告：部分高畫質格式被略過${srcText ? `：${srcText}` : ""}`;
    if (
      /^(WARNING:|Warning|DeprecationWarning|UserWarning|FutureWarning|警告)/i.test(
        line,
      )
    ) {
      const msg = stripVisibleSourceFields(line)
        .replace(/^(WARNING:\s*)/i, "")
        .trim();
      return `警告${srcText ? `：${srcText}` : ""}${msg ? ` — ${compactNoteLine(msg, 160)}` : ""}`;
    }
    if (/^use workspace video\b/i.test(line))
      return `使用工作區影片${srcText ? `：${srcText}` : ""}`;
    if (/^workspace saved\b/i.test(line))
      return `保存工作區狀態${srcText ? `：${srcText}` : ""}`;
    if (/^workspace imported srt\b/i.test(line))
      return `匯入工作區字幕${srcText ? `：${srcText}` : ""}`;
    if (/^use cached visual analysis\b/i.test(line))
      return `使用工作區視覺分析${srcText ? `：${srcText}` : ""}`;
    if ((m = line.match(/^skip existing sqlite row FID=(\S+)/i)))
      return `SQLite 已有結果，直接載入${srcText ? `：${srcText}` : `（FID=${m[1]}）`}`;
    if (srcText && /^analyze (?:video|media) from input:\s*/i.test(line))
      return `分析影片：${srcText}`;
    if (srcText && /^download (?:video|media) from input:\s*/i.test(line))
      return `分析影片：${srcText}`;
    if (srcText && /^read YouTube info:\s*/i.test(line))
      return `讀取 YouTube 資訊：${srcText}`;
    if (srcText && /^\[youtube\]\s+Extracting URL:/i.test(line))
      return `讀取 YouTube 資訊：${srcText}`;
    if (srcText && /^srt YouTube captions\b/i.test(line)) {
      m = line.match(/\blanguage=([^\s]+)/i);
      const seg = line.match(/\bsegments=(\d+)/i);
      return `取得 YouTube 字幕成功：${srcText}${m ? `，${m[1]}` : ""}${seg ? `，${seg[1]} 段` : ""}`;
    }
    if (srcText && /^use existing srt ok\b/i.test(line)) {
      const seg = line.match(/\bsegments=(\d+)/i);
      return `使用既有字幕成功：${srcText}${seg ? `，${seg[1]} 段` : ""}`;
    }
    if (srcText && /^use existing srt failed\b/i.test(line)) {
      const reason = line.match(/\breason=([^\s]+)/i);
      return `使用既有字幕失敗：${srcText}${reason ? `（${reason[1]}）` : ""}`;
    }
    if (srcText && /^use existing srt\b/i.test(line))
      return `使用既有字幕：${srcText}`;
    if (srcText && /^srt complete\b/i.test(line)) {
      const seg = line.match(/\bsegments=(\d+)/i);
      return `字幕完成：${srcText}${seg ? `，${seg[1]} 段` : ""}`;
    }
    if (srcText && /^srt\b/i.test(line)) return `產生字幕中：${srcText}`;
    if (srcText && /^try YouTube captions/i.test(line))
      return `嘗試取得 YouTube 字幕：${srcText}`;
    if (srcText && /^YouTube captions not found/i.test(line))
      return `未找到 YouTube 字幕：${srcText}`;
    if (srcText && /^YouTube caption found but fallback to whisper/i.test(line))
      return `YouTube 字幕格式不可用，改用 Whisper：${srcText}`;
    if (srcText && /^YouTube captions empty after conversion/i.test(line))
      return `YouTube 字幕轉換後為空：${srcText}`;
    if (srcText && /^fallback to Whisper/i.test(line))
      return `沒有 YouTube 字幕，改用 Whisper 語音辨識：${srcText}`;
    if (/^analyze video frames with Vision LLM:\s*(.+)$/i.test(line))
      return `開始視覺分析：${srcText || stripVisibleSourceFields(line.replace(/^analyze video frames with Vision LLM:\s*/i, ""))}`;
    if ((m = line.match(/^vision frames\s+(.+?):\s*(\d+)$/i)))
      return `視覺分析完成：${stripVisibleSourceFields(m[1]) || srcText}（${m[2]} 段）`;
    if (
      (m = line.match(
        /^db FID=(\S+)\s+final content saved\s+qwen=\S+\s+vision=(\d+)\s+visual=(\d+)\s+segments=(\d+).*$/i,
      ))
    )
      return `寫入 SQLite：${srcText || "FID=" + m[1]}，視覺片段 ${m[3]} 段，字幕 ${m[4]} 段`;
    if ((m = line.match(/^analysis ready\s+(\d+\/\d+)\s+(.+)$/i)))
      return `分析完成 ${m[1]}：${srcText || stripVisibleSourceFields(noteTextAfterSourcePrefix(line) || m[2])}`;
    if ((m = line.match(/^analysis failed\s+(\d+\/\d+)\s+(.+)$/i)))
      return `分析失敗 ${m[1]}：${srcText || stripVisibleSourceFields(noteTextAfterSourcePrefix(line) || m[2])}`;
    if ((m = line.match(/^queue analysis\s+(\d+\/\d+)\s+(.+)$/i)))
      return `排入分析 ${m[1]}：${srcText || stripVisibleSourceFields(noteTextAfterSourcePrefix(line) || m[2])}`;
    if ((m = line.match(/^analyze\s+(\d+\/\d+)\s+(.+)$/i)))
      return `開始分析 ${m[1]}：${srcText || stripVisibleSourceFields(noteTextAfterSourcePrefix(line) || m[2])}`;
    if ((m = line.match(/^process\s+(\d+\/\d+)\s*:\s*(.+)$/i)))
      return `開始處理 ${m[1]}：${srcText || stripVisibleSourceFields(noteTextAfterSourcePrefix(line) || m[2])}`;
    if (srcText && /^source unavailable\b/i.test(line))
      return `影片目前無法存取，將略過：${srcText}`;
    if (srcText && /^skip unavailable\b/i.test(line))
      return `略過無法存取影片：${srcText}`;
    if (srcText && /^skipped:\s*/i.test(line))
      return `已略過：${srcText}`;
    if (srcText && /^yt-dlp failed\b/i.test(line))
      return `影片分析失敗：${srcText}`;
    if (srcText && /^error\b/i.test(line)) {
      const rest = stripVisibleSourceFields(
        line.replace(/^error\s+(?:https?:\/\/\S+|www\.\S+)\s*:?/i, ""),
      ).trim();
      return `錯誤：${srcText}${rest ? ` — ${rest}` : ""}`;
    }
    if (srcText && /^failed:/i.test(line)) {
      const rest = stripVisibleSourceFields(
        line.replace(/^failed:\s*(?:https?:\/\/\S+|www\.\S+)\s*(?:->|:)?/i, ""),
      ).trim();
      return `失敗：${srcText}${rest ? ` — ${rest}` : ""}`;
    }
    line = line.replace(
      /^analyze (?:video|media) from input:\s*/i,
      "分析影片：",
    );
    line = line.replace(
      /^download (?:video|media) from input:\s*/i,
      "分析影片：",
    );
    line = line.replace(/^read YouTube info:\s*/i, "讀取 YouTube 資訊：");
    line = line.replace(
      /^\[download\]\s+Destination:\s*.*$/i,
      "分析影片（使用輸入來源）",
    );
    line = line.replace(
      /^\[youtube\]\s+Extracting URL:\s*/i,
      "讀取 YouTube 資訊：",
    );
    line = line.replace(
      /^\[info\]\s+([^:]+):\s+Downloading\s+(.+)$/i,
      "準備分析格式 $2",
    );
    line = line.replace(
      /^fallback to Whisper$/i,
      "沒有 YouTube 字幕，改用 Whisper 語音辨識",
    );
    line = line.replace(/^YouTube captions not found$/i, "未找到 YouTube 字幕");
    line = line.replace(/^try YouTube captions$/i, "嘗試取得 YouTube 字幕");
    line = line.replace(
      /^whisper model=([^\s]+).*device=([^\s]+).*$/i,
      "Whisper 模型 $1（$2）",
    );
    line = line.replace(
      /^srt complete\b.*segments=(\d+)/i,
      srcText ? `字幕完成：${srcText}，$1 段` : "字幕完成：$1 段",
    );
    line = line.replace(/^srt\s+(.+?)\s+->\s+(.+)$/i, function (_, a, b) {
      return "產生字幕中：" + (srcText || "目前 YouTube 來源");
    });
    line = line.replace(
      /^srt YouTube captions\s+language=([^\s]+).*segments=(\d+)/i,
      srcText
        ? `取得 YouTube 字幕成功：${srcText}，$1，$2 段`
        : "取得 YouTube 字幕成功：$1，$2 段",
    );
    line = line.replace(
      /^analyze video frames with Vision LLM:\s*(.+)$/i,
      function (_, a) {
        return (
          "開始視覺分析：" +
          (srcText || stripVisibleSourceFields(a) || "目前 YouTube 來源")
        );
      },
    );
    line = line.replace(
      /^vision frames\s+(.+?):\s*(\d+)$/i,
      function (_, a, b) {
        return `視覺分析完成：${srcText || stripVisibleSourceFields(a)}（${b} 段）`;
      },
    );
    line = line.replace(
      /^db FID=(\S+)\s+final content saved\s+qwen=\S+\s+vision=(\d+)\s+visual=(\d+)\s+segments=(\d+).*$/i,
      function (_, fid, vision, visual, seg) {
        return `寫入 SQLite：${srcText || "FID=" + fid}，視覺片段 ${visual} 段，字幕 ${seg} 段`;
      },
    );
    line = line.replace(
      /^Installing collected packages for\s+(.+?):\s*(\d+)\s+packages/i,
      "$1 相關依賴 $2 個",
    );
    line = line.replace(
      /^Successfully installed\s+(.+?)\s+and\s+(\d+)\s+dependency packages/i,
      "$1 與 $2 個依賴已安裝",
    );
    line = line.replace(/^Downloading\s+/i, "");
    line = line.replace(/^Collecting\s+/i, "");
    line = line.replace(/^Installing collected packages:\s*/i, "");
    line = line.replace(/^Using cached\s+/i, "");
    line = line.replace(/^Requirement already satisfied:\s*/i, "");
    line = line.replace(/^Successfully installed\s*/i, "");
    line = line.replace(/^install package:\s*/i, "");
    line = line.replace(/^install package done:\s*/i, "");
    line = line.replace(/^package ready:\s*/i, "");
    line = line.replace(/^prepare runtime\s*/i, "runtime ");
    line = stripVisibleSourceFields(line);
    return line || "處理中";
  }
  function activityKind(line) {
    line = normalizeNoteLine(String(line || ""));
    const kindText = line + " " + cleanActivityLine(line);
    if (
      /YouTube 解析警告|部分格式可能不可用|部分高畫質格式被略過|Requested format is not available|nsig extraction failed|SABR streaming/i.test(
        kindText,
      )
    )
      return { kind: "warning", label: "" };
    if (/^WARNING:\s*\[youtube\]|YouTube 解析警告|YouTube 暫時限流/i.test(line))
      return { kind: "warning", label: "" };
    if (
      /Warning|DeprecationWarning|UserWarning|FutureWarning|警告/i.test(line) &&
      !/ERROR:|ERROR_ROOT|failed|Traceback|Exception|WinError|too long|Long Path|失敗|錯誤|無法|^\s*File\s+["'].*\.py["'],\s*line\s*\d+/i.test(
        line,
      )
    )
      return { kind: "warning", label: "" };
    if (/^source unavailable\b|^skip unavailable\b|^skipped:\s*/i.test(line))
      return { kind: "warning", label: "" };
    if (
      /ERROR:|ERROR_ROOT|failed|Traceback|Exception|WinError|too long|Long Path|失敗|錯誤|無法|^\s*File\s+["'].*\.py["'],\s*line\s*\d+/i.test(
        line,
      )
    )
      return { kind: "error", label: "" };
    if (/^# Source context:|^\s*>?\s*\d+:/i.test(line))
      return { kind: "code", label: "" };
    if (
      /Warning|DeprecationWarning|UserWarning|FutureWarning|警告|^qwen refine .*fallback|^qwen section .*fallback|^qwen timeline summary .*fallback|^qwen timeout count=|^qwen refine disabled|^qwen refine skipped disabled-after-timeout/i.test(
        line,
      )
    )
      return { kind: "warning", label: "" };
    if (/^server scheduler:/i.test(line)) return { kind: "sync", label: "" };
    if (/^qwen model pull progress:/i.test(line))
      return { kind: "sync", label: "" };
    if (
      /^stable timeline summary complete|^stable note cleanup complete|^stable caption cleanup complete|^qwen model ready|^qwen timeline summary complete|^qwen section done|^qwen section cache hit|^qwen refine complete|^qwen refine chunk done|^qwen refine chunk cache hit|whisper model|Whisper 模型|^srt complete\b|^srt YouTube captions|^use existing srt ok|^use workspace video|^use cached visual analysis|^skip existing sqlite row|^workspace saved|^workspace imported srt|done ok=|final content saved|final srt saved|plain srt saved|轉檔完成|任務已完成|已載入最新筆記|完成：|^完成$|^已完成|^analysis ready|^(?:slides(?! progress\b)|vision frames)\s+.+?:\s*\d+/i.test(
        line,
      )
    )
      return { kind: "done", label: "" };
    if (
      /db FID=|sqlite|sqlite-ready|parallel processing workers|reload|render/i.test(
        line,
      )
    )
      return { kind: "done", label: "" };
    if (
      /^qwen timeline summary start|^qwen section refine|^qwen refine start|^qwen refine chunk\s|^read YouTube info:|^analyze (?:video|media) from input:|^download (?:video|media) from input:|^\[download\]|^download progress:|^analysis progress:/i.test(
        line,
      ) ||
      downloadProgressInfo(line)
    )
      return { kind: "sync", label: "" };
    const pp = packageProgressInfo(line);
    if (
      pp ||
      /^Collecting\s+|Getting requirements|Preparing metadata|Requirement already satisfied|^Using cached|^Installing collected packages|^install package:|^install package done:|^package ready:|^prepare runtime|^ollama cli|^ollama service|^qwen model|^qwen prepare|^版本=|^internal=|^workspace=|^ffmpeg=/i.test(
        line,
      )
    )
      return { kind: "code", label: "" };
    if (/^Successfully installed/i.test(line))
      return { kind: "code", label: "" };
    if (
      /^(?:slides|vision) progress:|^ollama cli|^ollama service|^qwen model|^qwen prepare|^qwen refine (?:start|chunk)\b|^queue analysis|^analyze\s+|^process\s+\d+\/\d+|^source\s+\d+\/\d+|jobs total=|^analyze video frames with Vision LLM:/i.test(
        line,
      )
    )
      return { kind: "sync", label: "" };
    if (
      /^try YouTube captions|^fallback to Whisper|^YouTube captions not found|^YouTube caption found|^YouTube captions empty|^srt\b|caption|whisper|vision\b/i.test(
        line,
      )
    )
      return { kind: "sync", label: "" };
    return { kind: "info", label: "" };
  }
  function activityTimeText(ts) {
    const n = Number(ts);
    if (!isFinite(n) || n <= 0) return "";
    try {
      return new Date(n * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      return "";
    }
  }
  function activityDedupeKey(line) {
    line = normalizeNoteLine(String(line || ""));
    if (
      /^qwen model pull progress:/i.test(line) ||
      /^qwen model pull:/i.test(line)
    )
      return "qwen-pull-progress";
    if (
      downloadProgressInfo(line) ||
      /^(?:analysis|download) progress:/i.test(line)
    )
      return "progress";
    if (/^(?:slides|vision) progress:/i.test(line)) {
      const src = noteSourceMainText(line, "") || "current";
      return `vision-progress:${src}`;
    }
    const pp = packageProgressInfo(line);
    if (pp) {
      const pkg = String(pp.name || "package")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
      return `package:${pkg}`;
    }
    let pkg = line.match(
      /^(?:package ready|install package(?: done)?):\s*(.+)$/i,
    );
    if (pkg)
      return `package:${String(pkg[1] || "package")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()}`;
    let x = cleanActivityLine(line).toLowerCase();
    x = x
      .replace(/\d{1,3}%/g, "%")
      .replace(
        /\d+(?:\.\d+)?\s*(?:mib|gib|mb|gb|m|g)\s*\/\s*\d+(?:\.\d+)?\s*(?:mib|gib|mb|gb|m|g)/gi,
        "size",
      )
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return x;
  }
  function activityShouldDrop(line) {
    line = normalizeNoteLine(String(line || "").trim());
    if (!line) return true;
    if (
      /ERROR:|ERROR_DETAIL|ERROR_ROOT|ERROR_DEBUG_JSON|ERROR_TRACEBACK|failed|Traceback|Exception|WinError|too long|Long Path|失敗|錯誤|無法|Warning|DeprecationWarning|UserWarning|FutureWarning|警告/i.test(
        line,
      )
    )
      return false;
    if (
      /^\s*File "[^"]+", line \d+/i.test(line) ||
      /^\s*(?:TypeError|ValueError|RuntimeError|ImportError|ModuleNotFoundError|PackageInstallError):/i.test(
        line,
      )
    )
      return false;
    if (/^\[download\]\s+Downloading item\s+\d+\s+of\s+\d+/i.test(line))
      return true;
    if (
      /^\[youtube(?::tab)?\].*:\s*(?:Downloading\s+(?:webpage|initial data API JSON|web client config|web player API JSON|android player API JSON|player\s+|\d+\s+items\s+of\s+\d+)|Redownloading\s+playlist API JSON)/i.test(
        line,
      ) ||
      /^\[youtube(?::tab)?\]\s+Extracting URL:/i.test(line)
    )
      return true;
    if (
      downloadProgressInfo(line) ||
      /^(?:analysis|download) progress:/i.test(line) ||
      /^分析進度\s*\d+%/i.test(line)
    )
      return true;
    if (
      /^package progress|^package ready:|^install package(?: done)?:|^Collecting\s+|^Requirement already satisfied:|^Preparing metadata|^Getting requirements|^Installing collected packages|^Successfully installed|^Using cached|^Downloading\s+/i.test(
        line,
      )
    )
      return true;
    if (
      /^cleanup\s|^delete audio\s|^cleanup empty dir|^cleanup dir|^audio\s+none\b|^skip audio\b|^done ok=|^jobs total=|^source\s+\d+\s*\/\s*\d+\s+|^準備分析格式\b|^vision analyze frame\b|^vision skip non-informative frame\b|^sqlite_ready\s+(?:compatible cache|hit)\b|^use workspace media\b|^workspace media ready\b/i.test(
        line,
      )
    )
      return true;
    if (
      /^Using official model|^Connectivity check|^internal=|^workspace=|^media=|^audio=|^transcript=|^vision=|^videos=|^srt=|^slides=|^temp=|^ffmpeg=|^版本=|^audio_mode=|^slide_mode=|^transcript_source=|^cleanup_artifacts=/i.test(
        line,
      )
    )
      return true;
    if (/[ ]{2,}/.test(line)) return true;
    if (isActivityNoise(line)) return true;
    if (/^已啟動任務$/i.test(line)) return true;
    return false;
  }
  const ADV_NOTE_ACTIVITY_PAGE_SIZE = 120;
  function activityItemsFromRows(rows, log) {
    const out = [];
    let seq = 0;
    (Array.isArray(rows) ? rows : []).forEach((r) => {
      const source = rowSourceLabel(r);
      const arr = Array.isArray(r && r.activity) ? r.activity : [];
      arr.forEach((a) => {
        const line = normalizeNoteLine(String((a && a.line) || "").trim());
        if (!line) return;
        out.push({ ts: Number(a.ts) || 0, line, source, seq: seq++ });
      });
      noteLogLines((r && r.log_tail) || "").forEach((line) => {
        line = normalizeNoteLine(line);
        if (line) out.push({ ts: 0, line, source, seq: seq++, fromLog: true });
      });
    });
    noteLogLines(log || "").forEach((line) => {
      line = normalizeNoteLine(line);
      if (line)
        out.push({ ts: 0, line, source: "", seq: seq++, fromLog: true });
    });
    function activitySort(a, b) {
      const at = Number(a && a.ts) || 0,
        bt = Number(b && b.ts) || 0;
      if (at || bt) {
        if (at && bt && at !== bt) return at - bt;
        if (at && !bt) return -1;
        if (!at && bt) return 1;
      }
      return (Number(a && a.seq) || 0) - (Number(b && b.seq) || 0);
    }
    out.sort(activitySort);
    const cleaned = [],
      seen = new Map();
    for (const a of out) {
      let line = normalizeNoteLine(String(a.line || "").trim());
      if (activityShouldDrop(line)) continue;
      const key = activityDedupeKey(line);
      if (!key || key === "progress") continue;
      const raw = cleanActivityLine(line, a.source);
      if (!raw) continue;
      const prevIdx = seen.get(key);
      if (prevIdx != null) {
        const prev = cleaned[prevIdx];
        const prevRaw = cleanActivityLine(prev.line, prev.source);
        if (/^vision-progress:/.test(key)) {
          cleaned[prevIdx] = a;
          continue;
        }
        if (
          prevRaw === raw ||
          /^(YouTube 解析警告|YouTube 暫時限流|\[youtube\] Extracting URL)/i.test(
            raw,
          )
        ) {
          prev.ts = a.ts || prev.ts;
          continue;
        }
        if (/^package:/i.test(key) || /^已完成 |^已就緒 |^安裝中 /.test(raw)) {
          cleaned[prevIdx] = a;
          continue;
        }
        continue;
      }
      seen.set(key, cleaned.length);
      cleaned.push(a);
    }
    cleaned.sort(activitySort);
    return cleaned;
  }
  function activityPageState(total) {
    const size = ADV_NOTE_ACTIVITY_PAGE_SIZE;
    const pages = Math.max(
      1,
      Math.ceil(Math.max(0, Number(total) || 0) / size),
    );
    let st = window.__ADV_NOTE_ACTIVITY_PAGE_STATE__;
    if (!st || typeof st !== "object")
      st = { page: pages, pages: pages, follow: true };
    let page = Number(st.page) || pages;
    if (st.follow !== false) page = pages;
    page = Math.max(1, Math.min(pages, Math.round(page)));
    const follow = st.follow !== false || page >= pages;
    window.__ADV_NOTE_ACTIVITY_PAGE_STATE__ = {
      page: follow ? pages : page,
      pages,
      follow,
    };
    return window.__ADV_NOTE_ACTIVITY_PAGE_STATE__;
  }
  function activityPagerHtml(page, pages, total, start, end) {
    if (pages <= 1) return "";
    return `<div class="adv-note-activity-pager" data-page="${page}" data-pages="${pages}" data-total="${total}"><button type="button" class="adv-note-page-btn" data-adv-note-page="prev" ${page <= 1 ? "disabled" : ""}>上一頁</button><span>第 ${page}/${pages} 頁 · ${start + 1}-${end}/${total} 筆</span><button type="button" class="adv-note-page-btn" data-adv-note-page="next" ${page >= pages ? "disabled" : ""}>下一頁</button><button type="button" class="adv-note-page-btn latest" data-adv-note-page="latest" ${page >= pages ? "disabled" : ""}>最新</button></div>`;
  }
  function activityBodyHtml(a) {
    const tm = activityTimeText(a && a.ts);
    const raw = cleanActivityLine(a && a.line, a && a.source);
    const short = compactNoteLine(raw, 150);
    return `<div class="adv-note-activity-body"><div class="adv-note-activity-head"><b>${tm ? `<time>${h(tm)}</time>` : ""}</b><button type="button" class="adv-note-copy" data-copy="${h(raw)}" title="複製活動內容" aria-label="複製活動內容"><i class="uil uil-copy"></i></button></div><code>${h(short)}</code></div>`;
  }
  function activityItemHtml(a, cls) {
    const meta = activityKind(a && a.line);
    return `<div class="${h(cls || "adv-note-activity-item")} ${h(meta.kind)}"><div class="adv-note-activity-node">${progressSvg(meta.kind)}</div>${activityBodyHtml(a)}</div>`;
  }
  function currentActivityHtml(rows, log, fallbackLine, state) {
    let f = normalizeNoteLine(String(fallbackLine || "").trim());
    if (f && !isActivityNoise(f))
      return activityItemHtml({ ts: 0, line: f }, "adv-note-activity-item");
    const items = activityItemsFromRows(rows, log);
    let a = items[items.length - 1];
    if (!a) {
      let line =
        f ||
        (state === "done" ? "完成" : state === "error" ? "錯誤" : "等待輸出…");
      a = { ts: 0, line };
    }
    return activityItemHtml(a, "adv-note-activity-item");
  }
  function activityTimelineHtml(rows, log, open) {
    const items = activityItemsFromRows(rows, log);
    if (!items.length) return "";
    const st = activityPageState(items.length);
    const page = st.page,
      pages = st.pages,
      size = ADV_NOTE_ACTIVITY_PAGE_SIZE;
    const start = (page - 1) * size,
      end = Math.min(items.length, start + size);
    const pageItems = items.slice(start, end);
    const body = pageItems
      .map((a) => activityItemHtml(a, "adv-note-activity-item"))
      .join("");
    const pager = activityPagerHtml(page, pages, items.length, start, end);
    const pageBadge =
      pages > 1
        ? `<span class="adv-note-page-summary">第 ${page}/${pages} 頁 · 共 ${items.length} 筆</span>`
        : "";
    return `<details class="adv-note-activity"${open ? " open" : ""}><summary class="adv-note-more-btn" aria-label="顯示更多活動紀錄"><i class="uil uil-angle-down" aria-hidden="true"></i><span class="adv-note-more-show">顯示更多</span><span class="adv-note-more-hide">收合</span>${pageBadge}</summary>${pager}<div class="adv-note-activity-list" data-page="${page}" data-pages="${pages}" data-page-last="${page >= pages ? "1" : "0"}">${body}</div></details>`;
  }
  function noteFormatDuration(sec) {
    sec = Math.max(0, Math.floor(Number(sec) || 0));
    const h0 = Math.floor(sec / 3600),
      m = Math.floor((sec % 3600) / 60),
      s0 = sec % 60;
    return h0
      ? `${h0}:${String(m).padStart(2, "0")}:${String(s0).padStart(2, "0")}`
      : `${m}:${String(s0).padStart(2, "0")}`;
  }
  function notePercentText(v) {
    v = clampNotePercent(Number(v) || 0, 0);
    if (v > 0 && v < 10) {
      return v.toFixed(1).replace(/\.0$/, "") + "%";
    }
    return Math.round(v) + "%";
  }
  function noteEtaPercentFromRows(rows, pct, log) {
    rows = Array.isArray(rows) ? rows : [];
    let p = clampNotePercent(Number(pct) || 0, 0);
    const combined = noteStatusTextFromRows(
      rows,
      String(log || rows.map((r) => (r && r.log_tail) || "").join("\n") || ""),
    );
    const expanded = noteExpandedProgressInfo(rows, combined);
    if (expanded && expanded.total > 1) {
      const total = Math.max(1, Number(expanded.total) || 1);
      const done = Math.max(0, Math.min(total, Number(expanded.done) || 0));
      const current = Math.max(
        0,
        Math.min(total, Number(expanded.current) || 0),
      );
      const rowLog =
        expanded.rowLog ||
        combined ||
        noteRowStatusText(rows.find((r) => r && r.running) || rows[0] || {});
      let step = 0;
      if (current > done && current <= total)
        step = clampNotePercent(progressFromLog(rowLog, true), 0) / 100;
      const units = Math.max(
        done,
        current > 0 ? Math.max(0, current - 1) + step : 0,
      );
      if (units > 0 && units < total) {
        const batchPct = clampNotePercent((units / total) * 100, 0);
        p = Math.max(p, batchPct);
      }
    }
    return p;
  }
  function noteTimingHtml(rows, pct, state, log) {
    rows = Array.isArray(rows) ? rows : [];
    const now = Date.now() / 1000;
    const starts = rows
      .map((r) => Number(r && r.started_at) || 0)
      .filter((x) => x > 0 && x <= now + 60);
    const apiElapsed = Math.max(
      0,
      ...rows.map((r) => Number(r && r.elapsed_seconds) || 0),
    );
    let elapsed = apiElapsed;
    if (starts.length) {
      const serverStarted = Math.min(...starts),
        serverElapsed = Math.max(0, now - serverStarted);
      elapsed = elapsed ? Math.max(elapsed, serverElapsed) : serverElapsed;
    }
    if (noteUiRunStartedAt > 0) {
      const uiElapsed = Math.max(0, now - noteUiRunStartedAt);
      if (!elapsed || elapsed > uiElapsed + 300 || elapsed > 86400)
        elapsed = uiElapsed;
    }
    if (!elapsed) return "";
    const combined = String(
      log || rows.map((r) => (r && r.log_tail) || "").join("\n") || "",
    );
    const expanded = noteExpandedProgressInfo(rows, combined);
    const total =
      expanded && expanded.total > 1
        ? Number(expanded.total) || 0
        : rows.length || 0;
    const done =
      expanded && expanded.total > 1
        ? Math.max(
            Number(expanded.done) || 0,
            Math.max(0, (Number(expanded.current) || 0) - 1),
          )
        : rows.filter(
            (r) => r && r.ok && !r.running && Number(r.returncode || 0) === 0,
          ).length;
    const running = state === "running" && rows.some((r) => r && r.running);
    const p = noteEtaPercentFromRows(rows, pct, combined);
    let eta = "";
    if (running && p >= 0.1 && p < 99 && elapsed >= 20) {
      const sec = (elapsed * (100 - p)) / Math.max(0.1, p);
      if (isFinite(sec) && sec >= 0 && sec < 31536000)
        eta = noteFormatDuration(sec);
    }
    const parts = [];
    parts.push(
      `<span>花費時間 <b>${h(noteFormatDuration(elapsed))}</b></span>`,
    );
    if (running)
      parts.push(`<span>預計剩餘 <b>${h(eta || "估算中")}</b></span>`);
    return `<div class="adv-note-time-row">${parts.join("")}</div>`;
  }

  function noteLiveLogDefaultOpen() {
    try {
      const v = localStorage.getItem("advNoteLiveLogOpen");
      if (v === "1") return true;
      if (v === "0") return false;
    } catch (e) {}
    return window.__ADV_NOTE_LIVE_LOG_OPEN__ === true;
  }
  function noteRememberLiveLogOpen(v) {
    window.__ADV_NOTE_LIVE_LOG_OPEN__ = v === true;
    try {
      localStorage.setItem("advNoteLiveLogOpen", v === true ? "1" : "0");
    } catch (e) {}
  }
  function rawLogHtml(log, state, rows, openState) {
    const items = activityItemsFromRows(rows || [], log);
    let shown = items
      .map((a) => cleanActivityLine(a && a.line, a && a.source))
      .filter(Boolean)
      .slice(-80);
    if (!shown.length) {
      const lines = noteLogLines(log)
        .map((x) => normalizeNoteLine(x))
        .filter(Boolean);
      shown = lines
        .filter(
          (l) =>
            !/^package progress:/i.test(l) &&
            !/^vision analyze frame\b/i.test(l) &&
            !/^vision skip non-informative frame\b/i.test(l) &&
            !/^sqlite_ready\s+(?:compatible cache|hit)\b/i.test(l),
        )
        .slice(-80);
    }
    if (!shown.length) return "";
    const text = shown.map((l) => compactNoteLine(l, 600)).join("\n");
    const open = openState === true ? " open" : "";
    return `<details class="adv-note-live-log"${open}><summary><i class="uil uil-terminal"></i><span>即時紀錄</span><small>最後 ${shown.length} 筆</small></summary><pre>${h(text)}</pre></details>`;
  }
  function statusHtml(text, pre, opts) {
    opts = opts || {};
    const rowsForStatus = opts.rows || [],
      preCombined = noteStatusTextFromRows(rowsForStatus, pre);
    const state = opts.state || "running",
      rawPct = Number(opts.percent);
    const pct = clampNotePercent(
      isFinite(rawPct)
        ? rawPct
        : state === "done" || state === "error"
          ? 100
          : 0,
      0,
    );
    const line = compactNoteLine(
      opts.line || lastProgressLine(preCombined) || text || "等待輸出…",
      180,
    );
    const detail = opts.detail || "";
    const headline =
      state === "running"
        ? noteImportantLine(preCombined, line)
        : text || line || "處理來源";
    const expanded = noteExpandedProgressInfo(rowsForStatus, preCombined);
    const setupProgress =
      state === "running" &&
      !sourceWorkStarted(preCombined) &&
      packageProgressFromLog(preCombined);
    const inSetup =
      state === "running" &&
      (setupProgress || packageSetupLine(headline) || packageSetupLine(line));
    const countText =
      expanded && expanded.total
        ? `${Math.max(0, expanded.current || 0)}/${expanded.total}`
        : "";
    const totalLabel =
      opts.totalLabel ||
      (expanded && expanded.total
        ? `整體進度 ${countText}`
        : inSetup
          ? "準備環境"
          : "整體進度");
    const step = stepProgressFromLog(preCombined, line, state);
    const shownPct = state === "running" && inSetup ? Math.min(pct, 99) : pct;
    const valueText = notePercentText(shownPct);
    const baseStatusText = compactNoteLine(
      (expanded && expanded.source) || text || headline || line || "處理中",
      180,
    );
    const statusLine = `<div class="adv-note-progress-line"><i class="uil ${state === "error" ? "uil-exclamation-triangle" : state === "cancelled" ? "uil-pause-circle" : state === "done" ? "uil-check-circle" : "uil-sync"}"></i><span class="adv-note-progress-text">${h(baseStatusText)}</span></div>`;
    const stepBar = step
      ? `<div class="adv-note-bar-row step ${step.indeterminate ? "indeterminate" : ""}"><div class="adv-note-bar-meta"><span class="adv-note-bar-name">${h(step.label || "目前步驟")}</span><span class="adv-note-bar-value">${h(step.value || "")}</span></div><div class="adv-note-progress-track" role="progressbar" aria-label="${h(step.label || "目前步驟")}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(clampNotePercent(step.pct, 0))}"><i style="width:${Math.round(step.indeterminate ? 100 : clampNotePercent(step.pct, 0))}%"></i></div></div>`
      : "";
    const timing = noteTimingHtml(rowsForStatus, pct, state, preCombined);
    const liveLog = rawLogHtml(
      preCombined,
      state,
      rowsForStatus,
      opts.liveLogOpen,
    );
    const timeline = activityTimelineHtml(
      rowsForStatus,
      preCombined,
      !!opts.activityOpen,
    );
    const errorBox = detail
      ? `<div class="adv-note-error-box"><button type="button" class="adv-note-copy" title="複製錯誤與代碼片段" aria-label="複製錯誤與代碼片段"><i class="uil uil-copy"></i></button><pre class="adv-note-error-text">${h(detail)}</pre></div>`
      : "";
    return `<div class="adv-note-progress-card ${h(state)}" role="status" aria-live="polite">${statusLine}<div class="adv-note-progress-bars"><div class="adv-note-bar-row total"><div class="adv-note-bar-meta"><span class="adv-note-bar-name">${h(totalLabel)}</span><span class="adv-note-bar-value">${h(valueText)}</span></div><div class="adv-note-progress-track" role="progressbar" aria-label="${h(totalLabel)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Number(shownPct).toFixed(1)}"><i style="width:${clampNotePercent(shownPct, 0).toFixed(2)}%"></i></div></div>${stepBar}</div>${timing}${liveLog}${timeline}${errorBox}</div>`;
  }
  function scrollNoteActivityToBottom(root) {
    try {
      (root || document)
        .querySelectorAll(".adv-note-activity-list")
        .forEach((el) => {
          if (el.dataset && el.dataset.pageLast === "0") {
            if (!el.dataset.scrolledOnce) {
              el.scrollTop = 0;
              el.dataset.scrolledOnce = "1";
            }
          } else el.scrollTop = el.scrollHeight;
        });
    } catch (e) {}
  }
  function setProgressStatus(opts) {
    opts = opts || {};
    const box = upgradeLegacyNoteSource($("#advNoteBackdrop")),
      st = box && $("#advNoteStatus", box);
    if (!st) return;
    const wasOpen = !!st.querySelector(".adv-note-activity[open]");
    const liveEl = st.querySelector(".adv-note-live-log");
    const wasLiveOpen = liveEl ? !!liveEl.open : noteLiveLogDefaultOpen();
    st.classList.add("show");
    const prev = clampNotePercent(Number(st.dataset.progress) || 0, 0);
    let pct = Number(opts.percent);
    if (!isFinite(pct)) pct = opts.state === "done" ? 100 : prev;
    pct = clampNotePercent(pct, 0);
    if (opts.reset) {
      window.__ADV_NOTE_ACTIVITY_PAGE_STATE__ = {
        page: 1,
        pages: 1,
        follow: true,
      };
      noteUiRunStartedAt = Date.now() / 1000;
    } else if (opts.state === "running" && !noteUiRunStartedAt) {
      noteUiRunStartedAt = Date.now() / 1000;
    }
    if (opts.state === "running" && !opts.reset) {
      const expanded = noteExpandedProgressInfo(
        opts.rows || [],
        opts.pre || "",
      );
      const batchMode = !!(expanded && expanded.total > 1);
      const setupLine =
        packageSetupLine(String(opts.line || "")) ||
        packageSetupLine(lastProgressLine(opts.pre || ""));
      pct = batchMode
        ? pct
        : prev >= 99 && setupLine && pct < 99
          ? pct
          : Math.max(prev, pct);
    }
    if (opts.state === "done") pct = 100;
    st.dataset.progress = String(pct);
    opts.percent = pct;
    if (opts.activityOpen == null) opts.activityOpen = wasOpen;
    if (opts.liveLogOpen == null) opts.liveLogOpen = wasLiveOpen;
    noteRememberLiveLogOpen(opts.liveLogOpen === true);
    window.__ADV_NOTE_LAST_STATUS_OPTS__ = Object.assign({}, opts);
    st.innerHTML = statusHtml(opts.title || "處理來源", opts.pre || "", opts);
    scrollNoteActivityToBottom(st);
    try {
      requestAnimationFrame(() => scrollNoteActivityToBottom(st));
    } catch (e) {
      setTimeout(() => scrollNoteActivityToBottom(st), 0);
    }
  }
  function initNoteActivityPager() {
    if (window.__ADV_NOTE_ACTIVITY_PAGER_BOUND__) return;
    window.__ADV_NOTE_ACTIVITY_PAGER_BOUND__ = true;
    document.addEventListener(
      "click",
      (e) => {
        const btn =
          e.target &&
          e.target.closest &&
          e.target.closest("[data-adv-note-page]");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const pager = btn.closest(".adv-note-activity-pager");
        const action = btn.getAttribute("data-adv-note-page");
        let state = window.__ADV_NOTE_ACTIVITY_PAGE_STATE__ || {};
        let pages =
          Number(pager && pager.dataset && pager.dataset.pages) ||
          Number(state.pages) ||
          1;
        let page =
          Number(pager && pager.dataset && pager.dataset.page) ||
          Number(state.page) ||
          pages;
        if (action === "prev") page = Math.max(1, page - 1);
        else if (action === "next") page = Math.min(pages, page + 1);
        else if (action === "latest") page = pages;
        window.__ADV_NOTE_ACTIVITY_PAGE_STATE__ = {
          page,
          pages,
          follow: page >= pages,
        };
        const st = btn.closest("#advNoteStatus") || $("#advNoteStatus");
        const opts = window.__ADV_NOTE_LAST_STATUS_OPTS__;
        if (st && opts) {
          const liveEl = st.querySelector(".adv-note-live-log");
          if (liveEl) opts.liveLogOpen = !!liveEl.open;
          st.innerHTML = statusHtml(
            opts.title || "處理來源",
            opts.pre || "",
            opts,
          );
          scrollNoteActivityToBottom(st);
          try {
            requestAnimationFrame(() => scrollNoteActivityToBottom(st));
          } catch (_) {}
        }
      },
      true,
    );
  }
  function initNoteLiveLogState() {
    if (window.__ADV_NOTE_LIVE_LOG_BOUND__) return;
    window.__ADV_NOTE_LIVE_LOG_BOUND__ = true;
    document.addEventListener(
      "toggle",
      (e) => {
        const d = e.target;
        if (d && d.matches && d.matches(".adv-note-live-log")) {
          noteRememberLiveLogOpen(!!d.open);
          const opts = window.__ADV_NOTE_LAST_STATUS_OPTS__;
          if (opts) opts.liveLogOpen = !!d.open;
        }
      },
      true,
    );
  }
  function setStatus(text, pre, opts) {
    opts = opts || {};
    const error =
      !!opts.error ||
      /無法啟動|讀取任務狀態失敗|執行失敗|錯誤/i.test(String(text || ""));
    setProgressStatus({
      title: text,
      source: text,
      line: opts.line || lastProgressLine(pre) || text,
      pre: pre,
      detail: error ? String(pre || "") : "",
      state: error ? "error" : opts.state || "running",
      percent:
        opts.percent == null
          ? error
            ? noteCurrentProgress()
            : 0
          : opts.percent,
      reset: opts.reset,
      rows: opts.rows || [],
    });
  }
  function sourceTitleFromMeta(meta, files) {
    if (meta && meta.source_type === "local") {
      const paths = Array.isArray(meta.source_paths)
        ? meta.source_paths.filter(Boolean)
        : [];
      if (paths.length)
        return (
          paths.slice(0, 2).map(basenameFromPath).join("、") +
          (paths.length > 2 ? ` 等 ${paths.length} 個檔案` : "")
        );
      const names = Array.from(files || [])
        .map((f) => f && f.name)
        .filter(Boolean);
      return names.length
        ? names.slice(0, 2).join("、") +
            (names.length > 2 ? ` 等 ${names.length} 個檔案` : "")
        : "本機檔案";
    }
    const first =
      String((meta && meta.source_text) || "")
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean)[0] || "YouTube 連結";
    return compactNoteLine(first, 110);
  }
  function rowSourceLabel(row) {
    return compactNoteLine(
      String((row && (row.source || row.label)) || "").replace(
        /^local$/i,
        "本機檔案",
      ),
      120,
    );
  }
  function languageMeta(box) {
    const select = $("#advNoteLangPack", box),
      opt = select && select.selectedOptions && select.selectedOptions[0];
    if (!opt) return { language: "zh" };
    const lang = String(
      opt.dataset.language ||
        String(opt.value || "zh|ch").split("|")[0] ||
        "zh",
    );
    return { language: lang };
  }
  function visionPresetMeta(value) {
    value = String(value || "high")
      .trim()
      .toLowerCase();
    if (value === "normal") value = "medium";
    if (value === "max") value = "maximum";
    if (value === "full") value = "maximum";
    if (!/^(maximum|high|medium|low)$/.test(value)) value = "high";
    const presets = {
      maximum: {
        quality: "maximum",
        slide_mode: "vision",
        vision_model: "qwen2.5vl:7b",
        sample_seconds: 1,
        min_slide_gap_seconds: 1,
        vision_frame_max_width: 1280,
        vision_max_frames: 240,
      },
      high: {
        quality: "high",
        slide_mode: "vision",
        vision_model: "qwen2.5vl:7b",
        sample_seconds: 2,
        min_slide_gap_seconds: 4,
        vision_frame_max_width: 960,
        vision_max_frames: 80,
      },
      medium: {
        quality: "medium",
        slide_mode: "vision",
        vision_model: "qwen2.5vl:7b",
        sample_seconds: 4,
        min_slide_gap_seconds: 6,
        vision_frame_max_width: 800,
        vision_max_frames: 48,
      },
      low: {
        quality: "low",
        slide_mode: "vision",
        vision_model: "qwen2.5vl:7b",
        sample_seconds: 8,
        min_slide_gap_seconds: 10,
        vision_frame_max_width: 640,
        vision_max_frames: 24,
      },
    };
    return presets[value] || presets.high;
  }
  function noteVisionModelMeta(value) {
    value = String(value || "qwen2.5vl:7b").trim();
    const low = value.toLowerCase();
    if (["off", "none", "false", "0", "no"].includes(low))
      return { enabled: false, model: "off", label: "Off" };
    const labels = {
      "qwen2.5vl:7b": "Qwen2.5VL 7B",
      "qwen2.5vl:3b": "Qwen2.5VL 3B",
      "minicpm-v:8b": "MiniCPM-V 8B",
      "llama3.2-vision:11b": "Llama 3.2 Vision 11B",
    };
    return { enabled: true, model: value, label: labels[value] || value };
  }
  function noteEstimateSecondsText(sec) {
    sec = Math.max(0, Number(sec) || 0);
    if (sec < 60) return `${Math.round(sec)}秒`;
    const m = Math.floor(sec / 60),
      r = Math.round(sec - m * 60);
    return r ? `${m}分${String(r).padStart(2, "0")}秒` : `${m}分鐘`;
  }
  function noteEstimateRangeText(minSec, maxSec) {
    minSec = Math.max(0, Number(minSec) || 0);
    maxSec = Math.max(minSec, Number(maxSec) || minSec);
    if (Math.abs(maxSec - minSec) < 8)
      return `約 ${noteEstimateSecondsText((minSec + maxSec) / 2)}`;
    return `約 ${noteEstimateSecondsText(minSec)}–${noteEstimateSecondsText(maxSec)}`;
  }
  function noteEstimateOneMinute(box) {
    const model = String(
        ($("#advNoteModel", box) || {}).value || "medium",
      ).toLowerCase(),
      source = String(
        ($("#advNoteTranscriptSource", box) || {}).value || "auto",
      ).toLowerCase(),
      qwenValue = String(
        ($("#advNoteQwenRefine", box) || {}).value || "qwen3:8b",
      ).toLowerCase(),
      visionValue = String(
        ($("#advNoteVisionPreset", box) || {}).value || "high",
      ).toLowerCase(),
      visionModel = noteVisionModelMeta(
        ($("#advNoteVisionModel", box) || {}).value || "qwen2.5vl:7b",
      ),
      preflight = String(
        ($("#advNotePreflightMode", box) || {}).value || "step",
      ).toLowerCase();
    const whisper = { tiny: 5, base: 8, small: 11, medium: 16, large: 35 };
    let transcriptMin = whisper[model] || 16,
      transcriptMax = transcriptMin;
    if (source === "youtube") {
      transcriptMin = 3;
      transcriptMax = 6;
    } else if (source === "auto") {
      transcriptMin = 4;
      transcriptMax = whisper[model] || 16;
    }
    let vision = visionModel.enabled
      ? {
          maximum: { frames: "12–24", sec: 430, chars: [160, 230] },
          high: { frames: "4–8", sec: 145, chars: [150, 220] },
          medium: { frames: "3–6", sec: 85, chars: [150, 220] },
          low: { frames: "2–4", sec: 42, chars: [145, 215] },
        }[visionValue] || { frames: "4–8", sec: 145, chars: [150, 220] }
      : { frames: "0", sec: 0, chars: [135, 205] };
    vision = Object.assign({}, vision);
    const modelScale = {
      "qwen2.5vl:3b": 0.65,
      "qwen2.5vl:7b": 1,
      "minicpm-v:8b": 1.15,
      "llama3.2-vision:11b": 1.45,
    };
    if (visionModel.enabled)
      vision.sec = Math.round(
        vision.sec * (modelScale[visionModel.model] || 1),
      );
    const qwenOn = qwenValue !== "false";
    const qwenSec = qwenOn ? 24 : 4,
      preflightSec = preflight === "off" ? 0 : 3,
      overhead = 10;
    const min = overhead + preflightSec + transcriptMin + vision.sec + qwenSec,
      max =
        overhead +
        preflightSec +
        transcriptMax +
        vision.sec * 1.35 +
        qwenSec +
        (visionModel.enabled
          ? visionValue === "maximum"
            ? 120
            : visionValue === "high"
              ? 45
              : 20
          : 5);
    let charsMin = vision.chars[0],
      charsMax = vision.chars[1];
    if (!qwenOn) {
      charsMin = Math.round(charsMin * 1.25);
      charsMax = Math.round(charsMax * 1.75);
    }
    return {
      min,
      max,
      charsMin,
      charsMax,
      frames: vision.frames,
      source,
      model,
      visionValue,
      visionModelLabel: visionModel.label,
      visionOn: visionModel.enabled,
      qwenOn,
    };
  }
  function noteUpdateEstimate(box) {
    box = box || $("#advNoteBackdrop");
    const el = box && $("#advNoteEstimate", box);
    if (!el) return;
    const est = noteEstimateOneMinute(box);
    const qwenLabel = est.qwenOn ? "Qwen 精修" : "Off",
      sourceLabel =
        est.source === "youtube"
          ? "YouTube字幕"
          : est.source === "whisper"
            ? "Whisper"
            : "Auto",
      visionText = est.visionOn
        ? `Vision ${est.visionModelLabel} ${est.visionValue} 約 ${est.frames} 張`
        : "Vision Off";
    el.textContent = `1分鐘影片：預計處理${noteEstimateRangeText(est.min, est.max)}，筆記約 ${est.charsMin}–${est.charsMax} 字`;
  }
  function collectMeta(box) {
    const u = setNotePublisherState(box, notePublisherId(box)),
      pid = u.id;
    applyPublisherToEditor(pid, u.avatar);
    const lang = languageMeta(box),
      qwenRef = $("#advNoteQwenRefine", box),
      qwenValue =
        String((qwenRef && qwenRef.value) || "false").trim() || "false",
      sourceInput = noteSourceInput(box),
      sourceText = String((sourceInput && sourceInput.value) || "").trim(),
      fileInput = $("#advNoteFileInput", box),
      hasFiles = !!(fileInput && fileInput.files && fileInput.files.length),
      localPaths = selectedLocalPathsFromBox(box),
      sourceType =
        hasFiles ||
        localPaths.length ||
        (box.dataset.source === "local" && !looksLikeUrlSource(sourceText))
          ? "local"
          : sourceText
            ? "youtube"
            : box.dataset.source || "local",
      legacySlideMode = String(
        ($("#advNoteSlideMode", box) || {}).value || "vision",
      )
        .trim()
        .toLowerCase(),
      visionPreset = visionPresetMeta(
        String(($("#advNoteVisionPreset", box) || {}).value || "high"),
      ),
      visionModel = noteVisionModelMeta(
        ($("#advNoteVisionModel", box) || {}).value ||
          (legacySlideMode === "none"
            ? "off"
            : visionPreset.vision_model || "qwen2.5vl:7b"),
      );
    return {
      source_type: sourceType,
      source_text:
        sourceType === "local"
          ? localPaths.join("\n") || sourceText
          : sourceText,
      source_paths: sourceType === "local" ? localPaths : [],
      db_path:
        String($("#advNoteDbPath", box).value || "").trim() || NOTE_OUTPUT_DB,
      topics:
        String($("#advNoteTopics", box).value || "").trim() ||
        NOTE_DEFAULT_TOPICS,
      publisher_id: pid,
      start_date:
        String($("#advNoteStartDate", box).value || "").trim() || todayYmd(),
      model: String($("#advNoteModel", box).value || "medium"),
      language: lang.language,
      audio_mode: "none",
      slide_mode: visionModel.enabled ? visionPreset.slide_mode : "none",
      vision_quality: visionPreset.quality,
      transcript_source: String(
        $("#advNoteTranscriptSource", box).value || "auto",
      ),
      preflight_mode: String(
        ($("#advNotePreflightMode", box) || {}).value || "step",
      ),
      preflight_silence_seconds: 15,
      sample_seconds: visionPreset.sample_seconds,
      min_slide_gap_seconds: visionPreset.min_slide_gap_seconds,
      vision_frame_max_width: visionPreset.vision_frame_max_width,
      vision_max_frames: visionModel.enabled
        ? visionPreset.vision_max_frames
        : 0,
      qwen_refine: qwenValue !== "false",
      qwen_model: qwenValue === "false" ? "qwen3:8b" : qwenValue,
      vision_model: visionModel.model,
      keep_artifacts:
        String(($("#advNoteKeepArtifacts", box) || {}).value || "true") !==
        "false",
      cleanup_artifacts:
        String(($("#advNoteKeepArtifacts", box) || {}).value || "true") ===
        "false",
    };
  }
  function fetchNoteJob(jobId) {
    return fetch("/api/video2sqlite/jobs/" + encodeURIComponent(jobId), {
      cache: "no-store",
    })
      .then((r) => r.json())
      .catch((e) => ({ ok: false, error: String(e), job_id: jobId }));
  }
  function jobFailureDetail(rows) {
    rows = Array.isArray(rows) ? rows : [rows];
    return rows
      .map((r) => {
        const src = rowSourceLabel(r) || (r && r.job_id) || "job";
        return r && r.ok
          ? `# ${src} EXIT ${r.returncode}
${String(r.error_detail || "").trim() || extractErrorLog(r.log_tail || "")}`
          : `# ${src}
${(r && r.error) || "讀取狀態失敗"}`;
      })
      .join("\n\n");
  }
  async function waitNoteJob(jobId, title) {
    while (true) {
      if (noteCancelRequested) throw new Error("__NOTE_CANCELLED__");
      const row = await fetchNoteJob(jobId);
      const running = row && row.ok && row.running;
      const cancelled = !!(row && row.cancelled);
      const failed =
        !row ||
        !row.ok ||
        (!running && !cancelled && Number(row.returncode || 0) !== 0);
      if (cancelled && !running) {
        setProgressStatus({
          title: "已中斷轉檔",
          line: "準備環境已停止",
          pre: String((row && row.log_tail) || ""),
          state: "done",
          percent: noteCurrentProgress(),
          rows: [row],
          source: "",
        });
        throw new Error("__NOTE_CANCELLED__");
      }
      if (failed) {
        const detail = jobFailureDetail(row);
        const summary = bestErrorSummary(detail, "前置安裝失敗");
        setProgressStatus({
          title: title || "準備環境失敗",
          line: summary,
          pre: String((row && row.log_tail) || ""),
          detail: detail,
          state: "error",
          percent: noteCurrentProgress(),
          rows: [row],
          source: "",
        });
        const err = new Error(summary);
        err.noteDetail = detail;
        err.noteTitle = title || "準備環境失敗";
        throw err;
      }
      const log = String(row.log_tail || "");
      setProgressStatus({
        title: title || "準備環境",
        line: lastProgressLine(log) || "準備環境",
        pre: log,
        state: running ? "running" : "done",
        percent: progressFromRows([row], running),
        rows: [row],
        source: "",
        activityOpen: true,
      });
      if (!running) return row;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  async function prepareNoteRuntime(meta) {
    setProgressStatus({
      title: "準備環境",
      line: "檢查與安裝必要套件",
      state: "running",
      percent: 0,
      reset: true,
      source: "",
    });
    const res = await fetch("/api/video2sqlite/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(meta),
      signal: noteRunAbort && noteRunAbort.signal,
    });
    const data = await res
      .json()
      .catch(() => ({ ok: false, error: "伺服器沒有回傳 JSON" }));
    if (!res.ok || !data.ok)
      throw new Error(data.error || "HTTP " + res.status);
    const jobId =
      data.job_id ||
      (Array.isArray(data.jobs) && data.jobs[0] && data.jobs[0].job_id);
    if (!jobId) throw new Error("前置安裝沒有回傳 job_id");
    noteActiveJobIds = [jobId];
    await waitNoteJob(jobId, "準備環境");
  }
  async function runNoteConversion() {
    const box = $("#advNoteBackdrop");
    if (!box) return;
    if (noteRunning) {
      cancelNoteConversion();
      return;
    }
    const meta = collectMeta(box),
      isLocal = meta.source_type === "local";
    let files = [],
      launched = false;
    try {
      if (isLocal) {
        const input = $("#advNoteFileInput", box);
        files = Array.from((input && input.files) || []);
        const localPaths = Array.isArray(meta.source_paths)
          ? meta.source_paths.filter(Boolean)
          : [];
        if (
          !files.length &&
          !localPaths.length &&
          !String(meta.source_text || "").trim()
        ) {
          setIdleStatus(
            "請先選擇本機路徑，或輸入聲音、影片、圖片、文件的完整路徑。",
            "",
            { error: true },
          );
          return;
        }
      } else {
        if (!meta.source_text) {
          setIdleStatus(
            "請輸入 YouTube 連結、playlist/list 網址或文字內容。",
            "",
            { error: true },
          );
          return;
        }
      }
      noteCurrentMeta = meta;
      noteCancelRequested = false;
      noteCancelling = false;
      noteActiveJobIds = [];
      noteRunAbort = new AbortController();
      setNoteRunning(true);
      const firstPlannedSource = sourceTitleFromMeta(meta, files);
      await prepareNoteRuntime(meta);
      if (noteCancelRequested) throw new Error("__NOTE_CANCELLED__");
      noteActiveJobIds = [];
      setProgressStatus({
        title: firstPlannedSource,
        line:
          isLocal && meta.source_paths && meta.source_paths.length
            ? "建立本機路徑任務（Python 直接讀取）"
            : "建立來源任務",
        state: "running",
        percent: 0,
        reset: true,
      });
      let res;
      if (isLocal) {
        const localPaths = Array.isArray(meta.source_paths)
          ? meta.source_paths.filter(Boolean)
          : [];
        if (localPaths.length) {
          res = await fetch("/api/video2sqlite/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(meta),
            signal: noteRunAbort.signal,
          });
        } else {
          const fd = new FormData();
          fd.append("meta", JSON.stringify(meta));
          files.forEach((f) => fd.append("files", f, f.name));
          res = await fetch("/api/video2sqlite/run", {
            method: "POST",
            body: fd,
            signal: noteRunAbort.signal,
          });
        }
      } else {
        try {
          if (typeof setAdvYoutube === "function")
            setAdvYoutube(meta.source_text.split(/\r?\n/)[0] || "");
        } catch (e) {}
        res = await fetch("/api/video2sqlite/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(meta),
          signal: noteRunAbort.signal,
        });
      }
      const data = await res
        .json()
        .catch(() => ({ ok: false, error: "伺服器沒有回傳 JSON" }));
      if (!res.ok || !data.ok)
        throw new Error(data.error || "HTTP " + res.status);
      const jobs = Array.isArray(data.jobs)
        ? data.jobs
        : [{ job_id: data.job_id, source: firstPlannedSource }];
      const ids = jobs.map((j) => j.job_id).filter(Boolean);
      noteActiveJobIds = ids.slice();
      const firstSource = compactNoteLine(
        jobs.map((j) => j.source).filter(Boolean)[0] || firstPlannedSource,
        130,
      );
      setProgressStatus({
        title: firstSource,
        line:
          jobs.length > 1
            ? `已建立 ${jobs.length} 個來源任務`
            : "已建立來源任務",
        state: "running",
        percent: 0,
        reset: true,
      });
      startNotePolling(ids);
      launched = true;
    } catch (e) {
      if (isNoteCancelError(e)) {
        setProgressStatus({
          title: "已中斷轉檔",
          line: "已停止目前工作",
          state: "done",
          percent: noteCurrentProgress(),
          rows: [],
          source: "",
        });
      } else {
        const msg = String(e && e.message ? e.message : e || "啟動失敗");
        const detail = String((e && e.noteDetail) || "");
        if (detail) {
          setProgressStatus({
            title: e && e.noteTitle ? e.noteTitle : "無法啟動",
            line: msg,
            pre: detail,
            detail: detail,
            state: "error",
            percent: noteCurrentProgress(),
            rows: [],
            source: "",
          });
        } else {
          setStatus(
            "無法啟動：" + msg,
            "請確認是用新版 setup.cmd 開啟本機伺服器，而不是純靜態 http-server / 直接打開檔案。",
            { error: true, line: msg },
          );
        }
      }
    } finally {
      if (!launched) {
        noteActiveJobIds = [];
        noteRunAbort = null;
        setNoteRunning(false);
      }
    }
  }
  function startNotePolling(ids) {
    clearInterval(notePollTimer);
    ids = (ids || []).filter(Boolean);
    noteActiveJobIds = ids.slice();
    if (!ids.length) {
      setNoteRunning(false);
      return;
    }
    let stopped = false;
    async function tick() {
      try {
        const rows = await Promise.all(
          ids.map((id) =>
            fetch("/api/video2sqlite/jobs/" + encodeURIComponent(id), {
              cache: "no-store",
            })
              .then((r) => r.json())
              .catch((e) => ({ ok: false, job_id: id, error: String(e) })),
          ),
        );
        const running = rows.some((r) => r && r.running);
        const cancelled = rows.some((r) => r && r.cancelled);
        if (cancelled && !running) {
          setProgressStatus({
            title: "已中斷轉檔",
            line: "使用者中斷，保留已完成項目",
            state: "cancelled",
            percent: noteCurrentProgress(),
            rows: rows,
            source: "",
          });
          stopped = true;
          clearInterval(notePollTimer);
          noteActiveJobIds = [];
          noteRunAbort = null;
          setNoteRunning(false);
          return;
        }
        const failed = rows.filter(
          (r) =>
            !r ||
            !r.ok ||
            (!r.running && !r.cancelled && Number(r.returncode || 0) !== 0),
        );
        if (failed.length) {
          const firstFailed = failed[0] || {};
          const failedSource = rowSourceLabel(firstFailed);
          const detail = failed
            .map((r) => {
              const src = rowSourceLabel(r) || (r && r.job_id) || "job";
              return r && r.ok
                ? `# ${src} EXIT ${r.returncode}
${String(r.error_detail || "").trim() || extractErrorLog(r.log_tail || "")}`
                : `# ${src}
${(r && r.error) || "讀取狀態失敗"}`;
            })
            .join("\n\n");
          setProgressStatus({
            title: failedSource ? `失敗：${failedSource}` : "任務執行失敗",
            source: failedSource,
            line: bestErrorSummary(detail, "請查看錯誤訊息"),
            pre: String(firstFailed.log_tail || ""),
            detail: detail,
            state: "error",
            percent: noteCurrentProgress(),
            rows: rows,
          });
          stopped = true;
          clearInterval(notePollTimer);
          noteActiveJobIds = [];
          noteRunAbort = null;
          setNoteRunning(false);
          return;
        }
        let activeIndex = rows.findIndex(
          (r) =>
            r &&
            r.running &&
            (lastProgressLine(r.log_tail || "") || rowSourceLabel(r)),
        );
        if (activeIndex < 0)
          activeIndex = rows.findIndex((r) => r && r.running);
        if (activeIndex < 0) activeIndex = Math.max(0, rows.length - 1);
        const active = rows[activeIndex] || rows[0] || {};
        const logLine = lastProgressLine(active.log_tail || "");
        const source = rowSourceLabel(active);
        const done = rows.filter(
          (r) => r && r.ok && !r.running && Number(r.returncode || 0) === 0,
        ).length;
        let title = running ? source || "處理來源" : "任務已完成";
        if (running && rows.length > 1)
          title = source
            ? `${source} (${activeIndex + 1}/${rows.length})`
            : `處理來源 ${activeIndex + 1}/${rows.length}`;
        let line = logLine || (running ? "等待輸出…" : "完成");
        if (active && active.queued) {
          const pos = Number(active.queue_position) || 1;
          line = `排隊中（第 ${pos} 位）：等待前一個任務完成`;
          title = source ? `等待執行：${source}` : "等待執行";
        }
        if (rows.length > 1) line = `已完成 ${done}/${rows.length} · ${line}`;
        const activeLog = String(active.log_tail || "");
        const activeLabel = String(
          (active && active.label) || "",
        ).toLowerCase();
        const setupNow =
          packageSetupLine(noteImportantLine(activeLog, line)) ||
          packageSetupLine(line);
        const prepareJob = activeLabel === "prepare";
        const setupTitle = prepareJob
          ? "準備環境"
          : source || title || "啟動轉檔";
        setProgressStatus({
          title: compactNoteLine(setupNow ? setupTitle : title, 150),
          source: setupNow && prepareJob ? "" : source,
          line: line,
          pre: activeLog,
          state: running ? "running" : "done",
          percent: progressFromRows(rows, running),
          rows: rows,
          totalLabel: setupNow && !prepareJob ? "啟動轉檔" : undefined,
        });
        if (!running && !stopped) {
          stopped = true;
          clearInterval(notePollTimer);
          await finishNoteConversion(rows);
        }
      } catch (e) {
        setStatus("讀取任務狀態失敗", String(e), { error: true });
        clearInterval(notePollTimer);
        noteActiveJobIds = [];
        noteRunAbort = null;
        setNoteRunning(false);
      }
    }
    tick();
    notePollTimer = setInterval(tick, 2500);
  }
  function noteCopyText(text, btn) {
    text = String(text || "");
    function ok() {
      if (btn) {
        const old = btn.innerHTML;
        btn.innerHTML = '<i class="uil uil-check"></i>';
        btn.classList.add("copied");
        setTimeout(() => {
          try {
            btn.innerHTML = old || '<i class="uil uil-copy"></i>';
            btn.classList.remove("copied");
          } catch (e) {}
        }, 900);
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(ok)
        .catch(() => noteCopyTextFallback(text, btn));
    } else noteCopyTextFallback(text, btn);
  }
  function noteCopyTextFallback(text, btn) {
    try {
      const ta = document.createElement("textarea");
      ta.value = String(text || "");
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      if (btn) {
        const old = btn.innerHTML;
        btn.innerHTML = '<i class="uil uil-check"></i>';
        btn.classList.add("copied");
        setTimeout(() => {
          try {
            btn.innerHTML = old || '<i class="uil uil-copy"></i>';
            btn.classList.remove("copied");
          } catch (e) {}
        }, 900);
      }
    } catch (e) {
      try {
        if (typeof flashMsg === "function") flashMsg("複製失敗");
      } catch (_) {}
    }
  }
  function initNoteCopyButtons() {
    if (window.__ADV_NOTE_COPY_BOUND__) return;
    window.__ADV_NOTE_COPY_BOUND__ = true;
    document.addEventListener(
      "click",
      (e) => {
        const btn =
          e.target && e.target.closest && e.target.closest(".adv-note-copy");
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        let text = String(btn.getAttribute("data-copy") || "");
        if (!text) {
          const box = btn.closest(
            ".adv-note-error-box,.adv-note-activity-body,.adv-note-progress-card",
          );
          const pre = box && box.querySelector("pre");
          const code = box && box.querySelector("code");
          text = String(
            (pre && pre.textContent) || (code && code.textContent) || "",
          );
        }
        noteCopyText(text, btn);
      },
      true,
    );
  }
  function initAdvNoteButton() {
    addNoteStyles();
    const place = $("#advPlaceBtn"),
      toolbar = $("#advToolbarAI");
    if (!place || !toolbar || $("#advNoteBtn")) return;
    const btn = document.createElement("button");
    btn.id = "advNoteBtn";
    btn.type = "button";
    btn.innerHTML = '<i class="uil uil-notes"></i><span>筆記</span>';
    place.insertAdjacentElement("afterend", btn);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openNoteDialog();
    });
  }

  (function () {
    try {
      if (document.getElementById("advNoteStatusSimplifyCss")) return;
      const s = document.createElement("style");
      s.id = "advNoteStatusSimplifyCss";
      s.textContent = `.adv-note-activity[open] .adv-note-activity-list{max-height:min(48vh,520px);overflow:auto;padding-right:.35rem}.adv-note-activity summary{padding:.48rem .62rem!important}.adv-note-activity-item{grid-template-columns:24px minmax(0,1fr)!important;gap:.38rem!important;padding:.42rem .12rem!important}.adv-note-activity-node{width:24px!important;min-height:22px!important}.adv-note-activity-body b{font-size:.62rem!important;margin-bottom:.08rem!important}.adv-note-activity-body>span{font-size:.7rem!important;line-height:1.35!important}.adv-note-progress-card{gap:.42rem!important;padding:.66rem .74rem!important}.adv-note-ai-glyph{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:9px;background:color-mix(in oklab,var(--c-primary),transparent 88%);border:1px solid color-mix(in oklab,var(--c-primary),transparent 68%);box-shadow:0 0 0 3px color-mix(in oklab,var(--c-primary),transparent 92%);font-size:.48rem;font-weight:1000;letter-spacing:.04em;color:var(--c-primary)}.adv-note-ai-glyph i{font-size:.9rem;line-height:1}.adv-note-ai-glyph em{font-style:normal;transform:translateY(.2px);font-size:.48rem}.adv-note-ai-glyph.error,.adv-note-activity-item.error .adv-note-ai-glyph{background:color-mix(in oklab,var(--c-danger),transparent 88%);border-color:color-mix(in oklab,var(--c-danger),transparent 62%);box-shadow:0 0 0 3px color-mix(in oklab,var(--c-danger),transparent 92%);color:var(--c-danger)}.adv-note-ai-glyph.warning,.adv-note-activity-item.warning .adv-note-ai-glyph{background:color-mix(in oklab,#f59e0b,transparent 86%);border-color:color-mix(in oklab,#f59e0b,transparent 56%);box-shadow:0 0 0 3px color-mix(in oklab,#f59e0b,transparent 91%);color:#b45309}.adv-note-ai-glyph.done,.adv-note-activity-item.done .adv-note-ai-glyph{background:color-mix(in oklab,var(--c-primary),transparent 88%);border-color:color-mix(in oklab,var(--c-primary),transparent 62%);color:var(--c-primary)}.adv-note-ai-glyph.download,.adv-note-activity-item.download .adv-note-ai-glyph{background:color-mix(in oklab,var(--c-accent-blue),transparent 88%);border-color:color-mix(in oklab,var(--c-accent-blue),transparent 62%);color:var(--c-accent-blue)}.adv-note-ai-glyph.sync,.adv-note-activity-item.sync .adv-note-ai-glyph{background:color-mix(in oklab,var(--c-primary),transparent 88%);border-color:color-mix(in oklab,var(--c-primary),transparent 62%);color:var(--c-primary)}.adv-note-ai-glyph.code,.adv-note-activity-item.code .adv-note-ai-glyph{background:color-mix(in oklab,var(--c-text),transparent 92%);border-color:color-mix(in oklab,var(--c-border),transparent 45%);color:var(--c-text)}.adv-note-activity-head{display:flex;align-items:center;gap:.45rem;justify-content:space-between}.adv-note-activity-body code{display:block;border:1px solid color-mix(in oklab,var(--c-border),transparent 30%);background:color-mix(in oklab,var(--c-bg-soft),transparent 8%);border-radius:.55rem;padding:.22rem .36rem;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.68rem;line-height:1.35;white-space:normal;color:var(--c-text)}.adv-note-copy{appearance:none;border:1px solid color-mix(in oklab,var(--c-border),transparent 18%);background:color-mix(in oklab,var(--c-bg-soft),transparent 10%);color:var(--c-primary);border-radius:999px;width:24px;height:24px;padding:0;display:inline-grid;place-items:center;font-size:.76rem;font-weight:900;cursor:pointer;white-space:nowrap;flex:0 0 auto}.adv-note-copy:hover,.adv-note-copy.copied{background:color-mix(in oklab,var(--c-primary),transparent 86%);border-color:color-mix(in oklab,var(--c-primary),transparent 60%)}.adv-note-copy i{font-size:.82rem;line-height:1}.adv-note-time-row{display:flex;flex-wrap:wrap;gap:.45rem .8rem;font-size:.66rem;color:var(--c-text-soft);font-weight:800}.adv-note-time-row b{color:var(--c-text)}.adv-note-bar-row.step.indeterminate .adv-note-progress-track{overflow:hidden}.adv-note-bar-row.step.indeterminate .adv-note-progress-track i{width:38%!important;min-width:34%;animation:advNoteStepPulse 1.25s ease-in-out infinite alternate}@keyframes advNoteStepPulse{from{transform:translateX(-8%);opacity:.55}to{transform:translateX(165%);opacity:.9}}.adv-note-activity summary{justify-content:flex-start!important;list-style:none!important}.adv-note-activity summary::-webkit-details-marker{display:none!important}.adv-note-more-btn{appearance:none;border:0!important;background:transparent!important;color:var(--c-primary);border-radius:0!important;padding:.48rem .62rem!important;display:flex!important;align-items:center;justify-content:flex-start;gap:.38rem;font-size:.7rem;font-weight:950;cursor:pointer;white-space:nowrap;user-select:none;width:100%!important;box-shadow:none!important}.adv-note-more-btn i{font-size:.92rem;line-height:1;transition:transform .18s ease}.adv-note-more-hide{display:none}.adv-note-activity[open] .adv-note-more-btn i{transform:rotate(180deg)}.adv-note-activity[open] .adv-note-more-show{display:none}.adv-note-activity[open] .adv-note-more-hide{display:inline}.adv-note-page-summary{margin-left:auto;color:color-mix(in oklab,var(--c-text-soft),transparent 10%);font-size:.62rem;font-weight:900}.adv-note-activity-pager{border-top:1px solid color-mix(in oklab,var(--c-border),transparent 38%);display:flex;align-items:center;gap:.42rem;flex-wrap:wrap;padding:.42rem .58rem .32rem;font-size:.64rem;font-weight:900;color:var(--c-text-soft)}.adv-note-page-btn{appearance:none;border:1px solid color-mix(in oklab,var(--c-border),transparent 18%);background:color-mix(in oklab,var(--c-bg-soft),transparent 8%);color:var(--c-primary);border-radius:999px;padding:.22rem .54rem;font-size:.64rem;font-weight:950;cursor:pointer}.adv-note-page-btn.latest{margin-left:auto}.adv-note-page-btn:disabled{opacity:.42;cursor:not-allowed;color:var(--c-text-soft)}@media (max-width:720px){.adv-note-page-summary{display:none}.adv-note-activity-pager{gap:.34rem}.adv-note-page-btn.latest{margin-left:0}}.adv-note-error-box{position:relative}.adv-note-error-box>.adv-note-copy{position:absolute;right:.45rem;top:.45rem;z-index:2}.adv-note-error-box .adv-note-error-text{padding-top:1.8rem!important}`;
      document.head.appendChild(s);
    } catch (e) {}
  })();
  (function () {
    try {
      if (document.getElementById("advNoteEstimateCss")) return;
      const s = document.createElement("style");
      s.id = "advNoteEstimateCss";
      s.textContent = `.adv-note-estimate-card{margin:.65rem 0 .75rem;padding:.64rem .78rem;color:var(--c-text);font-size:.72rem;line-height:1.5;font-weight:900;overflow-wrap:anywhere}.adv-note-estimate-card:empty{display:none}`;
      document.head.appendChild(s);
    } catch (e) {}
  })();
  ready(function () {
    initAdvNoteButton();
    initNoteCopyButtons();
    initNoteActivityPager();
    initNoteLiveLogState();
    try {
      upgradeLegacyNoteSource();
    } catch (e) {}
    try {
      const mo = new MutationObserver((ms) => {
        ms.forEach((m) => {
          (m.addedNodes || []).forEach((n) => {
            if (n && n.nodeType === 1) {
              try {
                if (
                  n.id === "advNoteBackdrop" ||
                  (n.querySelector &&
                    n.querySelector("#advNoteSourceCard,.adv-note-source-card"))
                )
                  upgradeLegacyNoteSource(
                    n.id === "advNoteBackdrop" ? n : $("#advNoteBackdrop"),
                  );
              } catch (_) {}
            }
          });
        });
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
      window.__advNoteSourceUpgradeObserver = mo;
    } catch (e) {}
  });

  (function () {
    try {
      if (document.getElementById("advNoteLiveLogCss")) return;
      const s = document.createElement("style");
      s.id = "advNoteLiveLogCss";
      s.textContent = `.adv-note-live-log{border:1px solid color-mix(in oklab,var(--c-border),transparent 32%);background:color-mix(in oklab,var(--c-bg-soft),transparent 6%);border-radius:.72rem;overflow:hidden}.adv-note-live-log summary{display:flex!important;align-items:center!important;gap:.42rem!important;cursor:pointer!important;padding:.48rem .62rem!important;font-size:.7rem!important;font-weight:950!important;color:var(--c-text)!important;list-style:none!important}.adv-note-live-log summary::-webkit-details-marker{display:none!important}.adv-note-live-log summary i{color:var(--c-primary);font-size:.9rem}.adv-note-live-log summary small{margin-left:auto;color:var(--c-text-soft);font-size:.62rem;font-weight:900}.adv-note-live-log pre{margin:0!important;max-height:min(32vh,340px)!important;overflow:auto!important;padding:.58rem .68rem!important;border-top:1px solid color-mix(in oklab,var(--c-border),transparent 40%)!important;background:color-mix(in oklab,var(--c-bg-alt),transparent 8%)!important;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;font-size:.67rem!important;line-height:1.42!important;color:var(--c-text)!important;white-space:pre-wrap!important;word-break:break-word!important}`;
      document.head.appendChild(s);
    } catch (e) {}
  })();
})();
