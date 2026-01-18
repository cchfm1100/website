(function(){
  if(window.initOsmDiscountMap) return;
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function hasHtml(s){return /<\s*a\b|<\s*br\s*\/?\?>|<\s*div\b|<\s*span\b/i.test(String(s||''));}
  function postProcessOfferHtml(html){
    const s=String(html||'');
    if(!s) return '';
    if(!/<\s*a\b/i.test(s) && !/detail\.aspx\?/i.test(s) && !/https?:\/\//i.test(s)) return s;
    let div;
    try{div=document.createElement('div');}catch(e){return s;}
    div.innerHTML=s;
    const seen=new Set();
    const hrefs=[];
    try{
      const as=div.querySelectorAll('a[href]');
      for(const a of as){
        const raw=(a.getAttribute('href')||'').trim();
        const norm=raw.replace(/&amp;/g,'&').trim();
        if(!norm){a.remove();continue;}
        if(seen.has(norm)){a.remove();continue;}
        seen.add(norm);
        hrefs.push(norm);
      }
    }catch(e){}
    const detailQ=[];
    for(const h of hrefs){
      const mm=h.match(/detail\.aspx\?(.+)$/i);
      if(mm) detailQ.push(mm[1]);
    }
    try{
      const walker=document.createTreeWalker(div,NodeFilter.SHOW_TEXT,null,false);
      const nodes=[];
      while(walker.nextNode()) nodes.push(walker.currentNode);
      for(const node of nodes){
        let t=node.nodeValue||'';
        if(!t) continue;
        for(const q of detailQ){
          const qEsc=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
          t=t.replace(new RegExp('_?detail\\.aspx\\?'+qEsc,'g'),'');
          t=t.replace(new RegExp('item_?detail\\.aspx\\?'+qEsc,'g'),'');
        }
        t=t.replace(/\s{2,}/g,' ');
        node.nodeValue=t;
      }
    }catch(e){}
    let out=div.innerHTML;
    out=out.replace(/\s{2,}/g,' ').trim();
    return out;
  }
  function linkify(text){
    const firstUrl=s=>{
      const m=String(s||'').match(/https?:\/\/[^\s<>"']+/i);
      if(!m) return '';
      let u=m[0].trim();
      while(u && /[),.;，；。\]\)】」』’”]$/.test(u)) u=u.slice(0,-1);
      return u;
    };
    const normalizeDownloadText=s=>{
      let out=String(s||'');
      out=out.replace(/(\d+\.\s*)?(?:檔案下載|型錄下載)\s*[:：]?\s*([^\n\r]*)/g,(m,n,rest)=>{
        const src=String(rest||'');
        let u='';
        const m1=src.match(/https?:\/\/[\s\S]+?\.(?:pdf|docx?|xlsx?|pptx?|zip|rar|7z)(?:\?[^\s<>"']*)?(?:#[^\s<>"']*)?/i);
        if(m1) u=m1[0];
        else{
          const m2=src.match(/https?:\/\/[\s\S]+/i);
          if(m2) u=m2[0];
        }
        if(!u){
          const m3=String(m).match(/https?:\/\/[\s\S]+/i);
          if(m3) u=m3[0];
        }
        if(!u) return m;
        u=u.trim().replace(/\s+/g,'%20');
        return `${n||''}<a href="${u}" target="_blank" rel="noopener">參考資料</a>`;
      });
      return out;
    };
    let raw=normalizeDownloadText(String(text||''));
    if(!raw) return '';
    const fix=(s,escUrl)=>{
      let out=String(s||'');
      out=out.replace(/(\d+\.\s*)?(?:檔案下載|型錄下載)\s*<a\s+href="([^"]+)"[^>]*>[^<]*<\/a>/g,(m,n,u)=>`${n||''}<a href="${u}" target="_blank" rel="noopener">參考資料</a>`);
      out=out.replace(/(\d+\.\s*)?(?:檔案下載|型錄下載)\s*(https?:\/\/[^\s<>"']+)/g,(m,n,u)=>`${n||''}<a href="${escUrl?esc(u):u}" target="_blank" rel="noopener">參考資料</a>`);
      out=out.replace(/<a\b[^>]*href\s*=\s*"(?:\s*(?:&lt;|<)\s*a\b[^>]*href\s*=\s*")([^"]+)"[\s\S]*?<\/a>\s*"[\s\S]*?>[\s\S]*?<\/a>/gi,(m,u)=>`<a href="${esc(String(u||'').trim())}" target="_blank" rel="noopener">參考資料</a>`);
      out=out.replace(/<a\b[^>]*href\s*=\s*'(?:\s*(?:&lt;|<)\s*a\b[^>]*href\s*=\s*')([^']+)'[\s\S]*?<\/a>\s*'[\s\S]*?>[\s\S]*?<\/a>/gi,(m,u)=>`<a href="${esc(String(u||'').trim())}" target="_blank" rel="noopener">參考資料</a>`);
      return out;
    };
    if(hasHtml(raw)){
      let out=fix(raw,true);
      if(/href\s*=\s*["'][^"']*(?:&lt;|<)\s*a\b/i.test(out)){
        const u=firstUrl(out);
        if(u) out=`<a href="${esc(u)}" target="_blank" rel="noopener">參考資料</a>`;
      }
      out=out.replace(/\r?\n/g,'<br>');
      return postProcessOfferHtml(out);
    }
    const e=esc(raw);
    let html=e.replace(/(https?:\/\/[^\s<>"']+)/g,u=>`<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
    html=fix(html,false).replace(/\r?\n/g,'<br>');
    return postProcessOfferHtml(html);
  }
  const CAT_COLORS={"美食":"#e74c3c","美食餐廳":"#e74c3c","服飾":"#9b59b6","住宿":"#3498db","旅遊住宿":"#3498db","旅遊":"#2ecc71","旅游":"#2ecc71","休閒娛樂":"#1abc9c","美容舒壓":"#9b59b6","按摩":"#f39c12","泡湯休息":"#16a085","健康商城":"#7f8c8d","通勤":"#f39c12","其他":"#7f8c8d","貼文":"#2563eb"};
  function catColor(cat){return CAT_COLORS[cat]||"#1abc9c";}
  function markerIcon(L,cat,count){
    const c=catColor(cat);
    const n=Math.max(0,Number(count||0));
    if(n<=1){
      return L.divIcon({className:"dot-icon",html:`<div style="width:14px;height:14px;background:${c};border:2px solid rgba(0,0,0,.95);border-radius:50%;box-shadow:0 0 2px rgba(0,0,0,.35)"></div>`,iconSize:[14,14],iconAnchor:[7,7],popupAnchor:[0,-8]});
    }
    const label=n>99?'99+':String(n);
    return L.divIcon({className:"dot-icon",html:`<div style="position:relative;width:18px;height:18px"><div style="position:absolute;left:2px;top:2px;width:14px;height:14px;background:${c};border:2px solid rgba(0,0,0,.95);border-radius:50%;box-shadow:0 0 2px rgba(0,0,0,.35)"></div><div style="position:absolute;right:-6px;top:-6px;min-width:14px;height:14px;padding:0 2px;display:flex;align-items:center;justify-content:center;font-size:10px;line-height:1;font-weight:900;border-radius:999px;background:rgba(0,0,0,.92);color:#fff;border:1px solid rgba(255,255,255,.7);box-shadow:0 2px 8px -4px rgba(0,0,0,.4)">${label}</div></div>`,iconSize:[18,18],iconAnchor:[9,9],popupAnchor:[0,-10]});
  }
  function flattenPlaces(list){
    const out=[];
    for(const p of(list||[])){
      if(!p||typeof p!=='object') continue;
      const name=String(p.name||'').trim();
      const cat=p.cat||'';
      const offer=p.offer||'';
      const phone=p.phone||'';
      let branches=Array.isArray(p.branches)?p.branches:[];
      if(!branches.length){
        const addr0=String(p.address||'').trim();
        const lat0=('lat' in p)?p.lat:(('latitude' in p)?p.latitude:undefined);
        let lon0=('lon' in p)?p.lon:(('lng' in p)?p.lng:(('longitude' in p)?p.longitude:(('long' in p)?p.long:undefined)));
        const hasLL=isFinite(Number(lat0))&&isFinite(Number(lon0));
        if(addr0||hasLL) branches=[{address:addr0,lat:lat0,lon:lon0}];
      }
      for(const b of(branches||[])){
        if(!b||typeof b!=='object') continue;
        const addr=String(b.address||'').trim();
        const lat=('lat' in b)?b.lat:(('latitude' in b)?b.latitude:undefined);
        let lon=('lon' in b)?b.lon:(('lng' in b)?b.lng:(('longitude' in b)?b.longitude:(('long' in b)?b.long:undefined)));
        const exp=('expire' in b)?b.expire:(('expiry' in b)?b.expiry:(('exp' in b)?b.exp:(('end' in b)?b.end:(('until' in b)?b.until:(p.expire||p.expiry||p.exp||p.end||p.until||'')))));
        const bCat=('cat' in b)?b.cat:cat;
        const bOffer=('offer' in b)?b.offer:offer;
        const bPhone=('phone' in b)?b.phone:phone;
        out.push({__src:p.__src||'',name,cat:bCat||'',offer:bOffer||'',phone:bPhone||'',address:addr,lat,lon,expire:exp});
      }
    }
    return out;
  }
  function googleLink(name,addr){
    const q=encodeURIComponent([name,addr].filter(Boolean).join(' '));
    return 'https://www.google.com/maps/search/?api=1&query='+q;
  }
  function isDark(){return document.body && document.body.getAttribute('data-theme')==='dark';}
  function flash(msg){try{if(typeof window.flashMsg==='function') return window.flashMsg(msg);}catch(e){} try{alert(msg);}catch(e2){}}
  function injectCss(){
    if(!document.getElementById('leaflet-css')){
      const l=document.createElement('link');
      l.id='leaflet-css';
      l.rel='stylesheet';
      l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(l);
    }
    if(document.getElementById('osm-map-style')) return;
    const st=document.createElement('style');
    st.id='osm-map-style';
    st.textContent=`#osmMap{width:100%;aspect-ratio:1/1;border-radius:14px;overflow:hidden;border:1px solid var(--c-border);background:var(--c-bg-soft)}
.osm-lazy-placeholder{width:100%;height:100%;min-height:280px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.6rem;color:var(--c-text-soft);font-weight:800;letter-spacing:.4px}
.osm-lazy-spinner{width:22px;height:22px;border:2px solid rgba(0,0,0,.16);border-top-color:var(--c-primary);border-radius:50%;animation:osmSpin 1s linear infinite}
@keyframes osmSpin{to{transform:rotate(360deg)}}
.osm-map-actions{display:flex;align-items:center;gap:.45rem}
#app_map.osm-fullscreen{z-index:25000;max-width:none;width:100%;height:100%;border-radius:0;box-shadow:var(--shadow-lg);overflow:hidden;display:flex;flex-direction:column;gap:1rem;padding:calc(1rem + env(safe-area-inset-top)) 1rem calc(1rem + env(safe-area-inset-bottom));background:var(--c-bg-alt);isolation:isolate}
#app_map.osm-css-fullscreen{position:fixed;inset:0;width:100vw;height:100vh}
#app_map.osm-fullscreen:after{display:none}
#app_map.osm-fullscreen .panel-header{flex:0 0 auto;position:sticky;top:0;z-index:10020;background:var(--glass);backdrop-filter:saturate(180%) blur(18px);padding:.4rem .55rem .4rem .9rem}
#app_map.osm-fullscreen .osm-map-actions{position:relative;z-index:10021}
#app_map.osm-fullscreen #osmMap{aspect-ratio:auto;flex:1 1 auto;min-height:0;border-radius:18px;position:relative;z-index:1}
body.osm-no-scroll{overflow:hidden;transform:none!important}
body#ScrollToyBody.osm-no-scroll{transform:none!important}
body.osm-no-scroll #ScrollToy{display:none!important}
.dot-icon{background:transparent;border:none}
.leaflet-container{font:inherit}
#app_map.osm-theme-dark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.88) contrast(.92)}
.leaflet-popup-content-wrapper{background:var(--c-bg-alt);color:var(--c-text);border:1px solid var(--c-border);border-radius:14px}
.leaflet-popup-tip{background:var(--c-bg-alt)}
.leaflet-popup-content{margin:10px 12px}
.leaflet-control-attribution{font-size:.62rem;line-height:1.1;padding:2px 8px;margin:0 8px 8px 0;background:var(--glass);border:1px solid var(--c-border);border-radius:999px;backdrop-filter:saturate(180%) blur(10px);color:var(--c-text-soft)}
.leaflet-control-attribution a{color:inherit}
.leaflet-bar a{background:var(--glass);border:1px solid var(--c-border);color:var(--c-text);border-radius:10px}
.leaflet-bar a:hover{background:var(--c-bg-soft)}
.leaflet-bar{border:none;box-shadow:none}
.osm-legend{position:relative;padding:8px 10px;border-radius:12px;border:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(10px);font-size:.72rem;line-height:1.2;color:var(--c-text);display:none}
.osm-legend.is-visible{display:block}
.osm-legend-row{display:flex;align-items:center;gap:6px;margin:3px 0}
.osm-legend-dot{width:10px;height:10px;border-radius:50%;border:1px solid rgba(255,255,255,.9);box-shadow:0 0 0 1px rgba(0,0,0,.12) inset}
.osm-popup-stack{display:flex;flex-direction:column;gap:10px;max-height:min(60vh,520px);overflow:auto;padding-right:2px}
.osm-popup-stack::-webkit-scrollbar{width:8px}
.osm-popup-stack::-webkit-scrollbar-thumb{background:color-mix(in oklab,var(--c-border),transparent 35%);border-radius:999px}
.osm-popup{background:color-mix(in oklab,var(--c-bg-soft),transparent 25%);border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);border-radius:12px;padding:10px 10px}
.osm-popup-title{font-size:.96rem;font-weight:800;letter-spacing:.3px;line-height:1.15;margin:0 0 .25rem;color:var(--c-text)}
.osm-popup-meta{font-size:.76rem;font-weight:700;letter-spacing:.2px;line-height:1.25;color:var(--c-text-soft);margin:.1rem 0}
.osm-popup-meta b{color:var(--c-text);font-weight:900}
.osm-popup-offer{margin:.45rem 0 0}
.osm-popup-offer .caption{font-size:.85rem}
.osm-popup-actions{margin:.55rem 0 0;display:flex;align-items:center;justify-content:space-between;gap:.45rem}
.osm-popup-actions .caption{display:flex;flex-wrap:wrap;gap:.35rem;min-width:0}
.osm-popup-actions .caption a{white-space:nowrap}
.osm-popup-feeds{display:flex;align-items:center;gap:.35rem;flex:0 0 auto}
.osm-popup-avatar{width:30px;height:30px;border-radius:50%;overflow:hidden;border:2px solid var(--c-bg-alt);background:var(--c-bg-alt);box-shadow:0 4px 12px -6px rgba(0,0,0,.35);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.osm-popup-avatar img{width:100%;height:100%;object-fit:cover}
.osm-popup-avatar:hover{transform:translateY(-1px)}
.osm-popup a{display:inline-flex;align-items:center;gap:.35rem;padding:.33rem .6rem;border:1px solid var(--c-border);border-radius:999px;background:var(--glass);backdrop-filter:saturate(180%) blur(10px);color:var(--c-text);text-decoration:none;font-weight:800;font-size:.78rem;line-height:1}
.osm-popup a:hover{background:var(--c-bg-soft)}
.osm-feed-block{background:color-mix(in oklab,var(--c-bg-soft),transparent 12%);border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);border-radius:12px;padding:10px 10px}
.osm-feed-list{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.osm-feed-row{display:flex;gap:10px;align-items:flex-start;padding:6px;border-radius:12px;cursor:pointer}
.osm-feed-row:hover{background:color-mix(in oklab,var(--c-bg),transparent 78%)}
#app_map.osm-theme-dark .osm-feed-row:hover{background:rgba(255,255,255,.08)}
.osm-feed-text{flex:1;min-width:0}
.osm-feed-title{font-size:.86rem;font-weight:900;letter-spacing:.2px;line-height:1.2}
.osm-feed-sub{font-size:.72rem;font-weight:800;opacity:.72;margin-top:2px}
.osm-feed-sn{font-size:.78rem;opacity:.85;margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.osm-feed-modal{position:fixed;inset:0;z-index:31000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.38);backdrop-filter:saturate(120%) blur(10px)}
.osm-feed-modal.open{display:flex}
body.osm-feed-modal-open{overflow:hidden}
.osm-feed-modal-card{position:relative;width:min(760px,94vw);max-height:min(86vh,920px);overflow:auto;border-radius:18px;background:var(--c-bg-alt);border:1px solid var(--c-border);box-shadow:var(--shadow-lg);padding:14px 14px 16px}
.osm-feed-modal-close{position:sticky;top:0;margin-left:auto;display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:12px;border:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(10px);color:var(--c-text);font-size:22px;font-weight:900;cursor:pointer}
.osm-feed-modal-close:hover{background:var(--c-bg-soft)}
.osm-feed-modal-head{display:flex;align-items:center;gap:10px;margin:2px 0 10px}
.osm-feed-modal-user{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.osm-feed-modal-user img{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid var(--c-bg-alt);box-shadow:0 4px 12px -6px rgba(0,0,0,.35)}
.osm-feed-modal-user-name{font-weight:900;letter-spacing:.2px;line-height:1.1}
.osm-feed-modal-user-sub{font-size:.76rem;font-weight:800;opacity:.72;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.osm-feed-modal-title{font-size:1.06rem;font-weight:950;letter-spacing:.2px;line-height:1.25;margin:8px 0 8px}
.osm-feed-modal-caption .caption{font-size:.92rem}
.osm-feed-modal-imgs{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}
@media(min-width:520px){.osm-feed-modal-imgs{grid-template-columns:repeat(3,1fr)}}
.osm-feed-modal-imgbtn{border:0;padding:0;background:transparent;border-radius:14px;overflow:hidden;cursor:pointer}
.osm-feed-modal-imgbtn img{width:100%;height:100%;object-fit:cover;display:block;aspect-ratio:1/1}
.osm-feed-modal-actions button:hover{background:var(--c-bg-soft)}`;
    document.head.appendChild(st);
  }
  function loadLeaflet(){
    return new Promise((res,rej)=>{
      if(window.L&&typeof window.L.map==='function') return res(window.L);
      const ex=document.getElementById('leaflet-js');
      if(ex){
        ex.addEventListener('load',()=>res(window.L));
        ex.addEventListener('error',()=>rej(new Error('leaflet load error')));
        return;
      }
      const s=document.createElement('script');
      s.id='leaflet-js';
      s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload=()=>res(window.L);
      s.onerror=()=>rej(new Error('leaflet load error'));
      document.head.appendChild(s);
    });
  }
  const _scriptPromises={};
  function loadScript(src){
    src=String(src||'').trim();
    if(!src) return Promise.reject(new Error('empty src'));
    if(_scriptPromises[src]) return _scriptPromises[src];
    _scriptPromises[src]=new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src=src;
      s.async=true;
      s.onload=()=>res();
      s.onerror=()=>rej(new Error('load error'));
      document.head.appendChild(s);
    });
    return _scriptPromises[src];
  }
  function getDataFile(){
    const cfg=String(window.OSM_MAP_DATA_FILE||'').trim();
    return cfg||'';
  }
  function mapDataFilesFromSettings(){
    const out=[];
    try{
      if(typeof settings!=='undefined'&&settings&&settings[0]&&Array.isArray(settings[0].map)){
        for(const block of settings[0].map){
          const scripts=block&&block.script;
          if(!Array.isArray(scripts)) continue;
          for(const m of scripts){
            if(!m) continue;
            for(const k in m){
              if(!Object.prototype.hasOwnProperty.call(m,k)) continue;
              if(String(k).toLowerCase()==='map.js') continue;
              out.push(String(k));
            }
          }
        }
      }
    }catch(e){}
    return [...new Set(out.map(v=>String(v).trim()).filter(Boolean))];
  }
  function placeKey(p){
    const nm=String(p&&p.name||'').trim().toLowerCase();
    const addr=String(p&&p.address||'').trim().toLowerCase();
    const lat=Number(p&&p.lat);const lon=Number(p&&p.lon);
    const ll=(isFinite(lat)&&isFinite(lon))?lat.toFixed(6)+','+lon.toFixed(6):'';
    return nm+'|'+addr+'|'+ll;
  }
  async function loadPlacesFile(file){
    file=String(file||'').trim();
    if(!file) return false;
    const isUrl=/^(https?:)?\/\//i.test(file)||/^data:/i.test(file);
    if(!isUrl){
      try{
        if(typeof window.getSettingScriptUrl==='function'){
          const u=window.getSettingScriptUrl(file);
          if(u){await loadScript(u);return true;}
        }
      }catch(e){}
    }
    try{await loadScript(file);return true;}catch(e){}
    return false;
  }
  async function ensurePlaces(){
    if(window.__OSM_PLACES_READY) return;
    const files=mapDataFilesFromSettings();
    const df=getDataFile();
    if(!files.length && df) files.push(df);
    if(!files.length){
      if(Array.isArray(window.PLACES)&&window.PLACES.length){
        window.OSM_MAP_DATASETS=window.OSM_MAP_DATASETS||{inline:window.PLACES.slice()};
        window.OSM_MAP_DATASET_ORDER=window.OSM_MAP_DATASET_ORDER||['inline'];
        window.__OSM_PLACES_READY=true;
      }
      return;
    }
    const datasets={};
    for(const f of files){
      await loadPlacesFile(f);
      if(Array.isArray(window.PLACES)&&window.PLACES.length) datasets[f]=window.PLACES.slice();
    }
    const merged=[];
    for(const f of files){
      const arr=datasets[f]||[];
      for(const p of arr){
        if(!p||typeof p!=='object') continue;
        const cp=Object.assign({},p);
        cp.__src=f;
        merged.push(cp);
      }
    }
    window.OSM_MAP_DATASETS=datasets;
    window.OSM_MAP_DATASET_ORDER=files.slice();
    window.PLACES=merged;
    window.__OSM_PLACES_READY=true;
  }
  function defaultCenter(){
    const c=window.OSM_MAP_DEFAULT_CENTER;
    if(Array.isArray(c)&&c.length===2 && isFinite(c[0]) && isFinite(c[1])) return [Number(c[0]),Number(c[1])];
    return [24.071252388959756,120.5445053776353];
  }
  function defaultZoom(){
    const z=Number(window.OSM_MAP_DEFAULT_ZOOM);
    return isFinite(z)&&z>0?z:16;
  }
  function ymdToday(){const d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}
  function parseYmd(v){const s=String(v??'').replace(/[^\d]/g,'');if(s.length!==8)return 0;const n=Number(s);return isFinite(n)?n:0;}
  function expireFromOffer(v){const m=String(v||'').match(/(?:到期|有效(?:期限)?|截止)\s*[:：]?\s*(\d{8})/);return m?parseYmd(m[1]):0;}
  function placeExpire(p){return parseYmd((p&&((p.expire??p.expiry??p.exp??p.end??p.until)))||'')||expireFromOffer(p&&p.offer||'');}
  function isExpired(p,today){const e=placeExpire(p);return !!(e&&today>e);}
  function stripTags(s){return String(s||'').replace(/<[^>]*>/g,'');}
  function clampPlainText(s,n){let t=stripTags(s).replace(/\s+/g,' ').trim();n=Math.max(8,Number(n||0)||0);if(!t) return '';return t.length>n?t.slice(0,n-1)+'…':t;}
  function findFeedByTs(ts){ts=String(ts||'').trim();if(!ts) return null;try{const arr=Array.isArray(window.feedArray)?window.feedArray:[];for(const f of arr){if(String(f&&f.ts||'').trim()===ts) return f;}}catch(e){}return null;}
  function feedDisplayTitle(meta,feed){const t=String(feed&&feed.title||'').trim();if(t) return t;const u=String((feed&&feed.user)||(meta&&meta.user)||'').trim();return u||'貼文';}
  function feedDisplaySnippet(feed){const c=String(feed&&feed.caption||feed&&feed.text||'').trim();return clampPlainText(c,90);}
  function buildFeedBlock(feeds){
    const arr=Array.isArray(feeds)?feeds:[];
    if(!arr.length) return '';
    const rows=arr.slice(0,6).map(meta=>{
      const ts=String(meta&&meta.ts||'').trim();
      if(!ts) return '';
      const av=String(meta&&meta.avatar||'').trim();
      const f=findFeedByTs(ts);
      const title=feedDisplayTitle(meta,f);
      const sn=f?feedDisplaySnippet(f):'';
      const user=String(f&&f.user||meta&&meta.user||'').trim();
      const dt=String(f&&f.datetime||'').trim();
      const sub=[user,dt].filter(Boolean).join(' • ');
      const subHtml=sub?`<div class=\"osm-feed-sub\">${esc(sub)}</div>`:'';
      const snHtml=sn?`<div class=\"osm-feed-sn\">${esc(sn)}</div>`:'';
      const avatarHtml=av?`<button type=\"button\" class=\"osm-popup-avatar\" data-ts=\"${esc(ts)}\"><img src=\"${esc(av)}\" alt=\"\"></button>`:`<button type=\"button\" class=\"osm-popup-avatar\" data-ts=\"${esc(ts)}\"></button>`;
      return `<div class=\"osm-feed-row\" data-ts=\"${esc(ts)}\">${avatarHtml}<div class=\"osm-feed-text\"><div class=\"osm-feed-title\">${esc(title)}</div>${subHtml}${snHtml}</div></div>`;
    }).filter(Boolean).join('');
    return rows?`<div class=\"osm-popup osm-feed-block\"><div class=\"osm-popup-title\">貼文</div><div class=\"osm-feed-list\">${rows}</div></div>`:'';
  }


  function _normFeedStr(v){
    v=String(v??'').trim().toLowerCase();
    if(!v) return '';
    v=v.replace(/[\u3000\s]+/g,'');
    v=v.replace(/[()（）\[\]【】{}「」『』"'“”‘’，、;；:：.。!?！？\-—_]+/g,'');
    return v;
  }
  function _matchFeedsForPlace(all,name,addr,allowLoose){
    allowLoose=allowLoose!==false;
    const arr=Array.isArray(all)?all:[];
    const nName=_normFeedStr(name);
    const nAddr=_normFeedStr(addr);
    if(!arr.length) return [];
    const loose=[];
    const out=[];
    for(const m of arr){
      if(!m) continue;
      const mName=_normFeedStr(m.gName||m.name||'');
      const mAddr=_normFeedStr(m.gAddr||m.address||'');
      if(!mName && !mAddr){loose.push(m);continue;}
      let ok=false;
      if(nName && mName){
        if(nName===mName){
          if(nAddr && mAddr) ok=(nAddr===mAddr);
          else ok=true;
        }
      }else if(nName && !mName){
        ok=!!(nAddr && mAddr && nAddr===mAddr);
      }else if(!nName && mName){
        ok=!!(nAddr && mAddr && nAddr===mAddr);
      }else{
        ok=!!(nAddr && mAddr && nAddr===mAddr);
      }
      if(ok) out.push(m);
    }
    if(out.length) return out;
    if(allowLoose && loose.length) return loose.slice();
    return [];
  }
  function _splitCaptionImagesLocal(html){
    let temp;
    try{temp=document.createElement('div');}catch(e){return {body:esc(String(html||'')),imgs:[]};}
    temp.innerHTML=String(html||'');
    const imgs=Array.from(temp.querySelectorAll('img')).map(im=>(im.getAttribute('src')||'').trim()).filter(Boolean);
    try{temp.querySelectorAll('img').forEach(im=>im.remove());}catch(e){}
    return {body:temp.innerHTML||'',imgs};
  }
  function _ensureOsmFeedModal(){
    let el=document.getElementById('osmFeedModal');
    if(el) return el;
    el=document.createElement('div');
    el.id='osmFeedModal';
    el.className='osm-feed-modal';
    el.innerHTML='<div class="osm-feed-modal-card" role="dialog" aria-modal="true"><button type="button" class="osm-feed-modal-close" aria-label="Close">×</button><div class="osm-feed-modal-bodywrap"></div></div>';
    const close=()=>{
      try{el.classList.remove('open');}catch(e){}
      try{document.body.classList.remove('osm-feed-modal-open');}catch(e){}
    };
    el.addEventListener('click',e=>{if(e.target===el) close();});
    const btn=el.querySelector('.osm-feed-modal-close');
    if(btn) btn.addEventListener('click',close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&el.classList.contains('open')) close();});
    el.__close=close;
    document.body.appendChild(el);
    return el;
  }
  function openOsmFeedModalByTs(ts){
    ts=String(ts||'').trim();
    if(!ts) return;
    const f=findFeedByTs(ts);
    if(!f){flash('找不到貼文');return;}
    const modal=_ensureOsmFeedModal();
    const wrap=modal.querySelector('.osm-feed-modal-bodywrap');
    if(!wrap) return;
    const user=esc(String(f.user||''));
    const avatar=esc(String(f.avatar||''));
    const dt=esc(String(f.datetime||f.date||''));
    const title=esc(String(f.title||'').replace(/\s*•\s*$/,'').trim());
    const geoName=esc(String(f.geo&&f.geo.name||''));
    const geoAddr=esc(String(f.geo&&f.geo.address||''));
    const sub=[dt,[geoName,geoAddr].filter(Boolean).join(' ')].filter(Boolean).join(' • ');
    const capRaw=String(f.caption||f.text||'');
    const parts=_splitCaptionImagesLocal(capRaw);
    const bodyHtml=parts.body?(hasHtml(parts.body)?parts.body:esc(parts.body).replace(/\r?\n/g,'<br>')):'';
    let imgs=Array.isArray(parts.imgs)?parts.imgs.slice():[];
    if(!imgs.length){
      let extra=[];
      if(Array.isArray(f.imgs)) extra=f.imgs;
      else if(Array.isArray(f.images)) extra=f.images;
      else if(Array.isArray(f.img)) extra=f.img;
      else if(typeof f.img==='string') extra=[f.img];
      imgs=extra.map(x=>String(x||'').trim()).filter(Boolean);
    }
    const imgHtml=imgs.slice(0,9).map(u=>`<button type="button" class="osm-feed-modal-imgbtn" data-src="${esc(u)}"><img src="${esc(u)}" alt=""></button>`).join('');
    const imgBlock=imgHtml?`<div class="osm-feed-modal-imgs">${imgHtml}</div>`:'';
    const head=`<div class="osm-feed-modal-head"><div class="osm-feed-modal-user">${avatar?`<img src="${avatar}" alt="">`:`<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" alt="">`}<div style="min-width:0"><div class="osm-feed-modal-user-name">${user||'貼文'}</div>${sub?`<div class="osm-feed-modal-user-sub">${sub}</div>`:''}</div></div></div>`;
    const titleBlock=title?`<div class="osm-feed-modal-title">${title}</div>`:'';
    const captionBlock=bodyHtml?`<div class="osm-feed-modal-caption"><div class="caption">${bodyHtml}</div></div>`:'';
    wrap.innerHTML=head+titleBlock+captionBlock+imgBlock;
    wrap.onclick=e=>{
      const imgBtn=e.target.closest('.osm-feed-modal-imgbtn');
      if(imgBtn){
        e.preventDefault();
        e.stopPropagation();
        const src=String(imgBtn.dataset.src||'').trim();
        if(src){
          if(typeof window.openImageLightbox==='function') window.openImageLightbox(src,'');
          else window.open(src,'_blank','noopener');
        }
        return;
      }
    };
    try{modal.classList.add('open');}catch(e){}
    try{document.body.classList.add('osm-feed-modal-open');}catch(e){}
  }

  function buildPopup(p,idx,showSrc){
    const nm=esc(p.name||'');
    const cat=esc(p.cat||'');
    const addr=esc(p.address||'');
    const phone=String(p.phone||'').trim();
    const offerHtml=linkify(p.offer||'');
    const g=googleLink(p.name||'',p.address||'');
    const tel=phone?`<a href="tel:${esc(phone)}" target="_blank" rel="noopener">電話</a>`:'';
    const addrBtn=addr?`<a href="${g}" target="_blank" rel="noopener">導航</a>`:'';
    const src=showSrc?esc(String(p.__src||'')):'';
    const items=[cat?`<div class="osm-popup-meta"><b>分類</b> ${cat}</div>`:'',addr?`<div class="osm-popup-meta"><b>地址</b> ${addr}</div>`:'',phone?`<div class="osm-popup-meta"><b>電話</b> ${esc(phone)}</div>`:''].filter(Boolean).join('');
    const offerBlock=offerHtml?`<div class="osm-popup-offer"><div class="caption">${offerHtml}</div></div>`:'';
    const actions=`<div class="osm-popup-actions"><div class="caption">${[addrBtn,tel].filter(Boolean).join('')}</div><div class="osm-popup-feeds"></div></div>`;
    const cls=['osm-popup'];
    const n=Math.max(0,Number(idx||0));
    if(n) cls.push('osm-popup'+n);
    const srcSlug=String(p.__src||'').trim().toLowerCase().replace(/\.js$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
    if(srcSlug) cls.push('osm-src-'+srcSlug);
    return `<div class="${cls.join(' ')}" data-name="${nm}" data-address="${addr}"><div class="osm-popup-title">${nm}</div>${items}${offerBlock}${actions}</div>`;
  }
  function buildPopupStack(list){
    const arr=Array.isArray(list)?list.filter(Boolean):[];
    if(!arr.length) return '';
    const srcSet=new Set(arr.map(p=>String(p.__src||'').trim()).filter(Boolean));
    const showSrc=srcSet.size>1;
    const blocks=arr.map((p,i)=>buildPopup(p,i+1,showSrc)).filter(Boolean);
    if(blocks.length<=1) return blocks[0]||'';
    return `<div class="osm-popup-stack">${blocks.join('')}</div>`;
  }
  async function initMap(L,places){
    const panel=document.getElementById('app_map');
    const mapEl=document.getElementById('osmMap');
    if(!panel||!mapEl) return;
    if(panel._osmMap) return;
    try{mapEl.innerHTML='';}catch(e){}
    const map=L.map(mapEl,{zoomControl:true,attributionControl:true});
    panel._osmMap=map;

    const TILE_SOURCES=(function(){
      const arr=[];
      try{
        const cu=String(window.OSM_TILE_URL_TEMPLATE||window.OSM_TILE_URL||'').trim();
        const ca=String(window.OSM_TILE_ATTRIBUTION||'').trim();
        if(cu) arr.push({url:cu,attr:ca||''});
      }catch(e){}
      arr.push(
        {url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',subdomains:'abc',attr:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'},
        {url:'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',subdomains:'abc',attr:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'},
        {url:'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',subdomains:'abc',attr:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'},
        {url:'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',subdomains:'abcd',opts:{detectRetina:true},attr:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'},
        {url:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',subdomains:'abcd',opts:{detectRetina:true},attr:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}
      );
      return arr;
    })();
    function makeTiles(i){
      const s=TILE_SOURCES[i]||TILE_SOURCES[0];
      const o=Object.assign({maxZoom:19,attribution:s.attr||''},s.opts||{});
      if(s.subdomains) o.subdomains=s.subdomains;
      return L.tileLayer(s.url,o);
    }
    function _probeUrl(s){
      const sd=s&&s.subdomains?String(s.subdomains):'a';
      const sub=sd?sd[0]:'a';
      let u=String(s&&s.url||'');
      u=u.replace('{s}',sub).replace('{z}','0').replace('{x}','0').replace('{y}','0').replace('{r}','');
      if(!u) return '';
      return u+(u.includes('?')?'&':'?')+'osm_probe='+(Date.now());
    }
    function probeTileSource(s,timeoutMs){
      timeoutMs=Number(timeoutMs)||2200;
      return new Promise(resolve=>{
        let done=false;
        const img=new Image();
        const finish=ok=>{
          if(done) return;
          done=true;
          try{clearTimeout(t);}catch(e){}
          img.onload=img.onerror=null;
          resolve(!!ok);
        };
        const t=setTimeout(()=>finish(false),timeoutMs);
        img.onload=()=>finish(true);
        img.onerror=()=>finish(false);
        try{img.decoding='async';}catch(e){}
        const url=_probeUrl(s);
        if(!url){finish(false);return;}
        img.src=url;
      });
    }
    async function pickInitialTileIndex(){
      try{
        const checks=await Promise.all(TILE_SOURCES.map(s=>probeTileSource(s,2200).catch(()=>false)));
        for(let i=0;i<checks.length;i++){if(checks[i]) return i;}
      }catch(e){}
      return 0;
    }
    let tileIndex=await pickInitialTileIndex();
    let tileOk=false;
    const onTileLoad=()=>{tileOk=true;};
    function armTileWatchdog(){
      setTimeout(()=>{
        if(tileOk) return;
        if(tileIndex>=TILE_SOURCES.length-1) return;
        switchTiles();
      },3000);
    }
    let tiles=makeTiles(tileIndex);
    tiles.addTo(map);
    tiles.on('tileload',onTileLoad);
    armTileWatchdog();
    try{if(mapEl.getBoundingClientRect&&mapEl.getBoundingClientRect().height<140) mapEl.style.height='60vh';}catch(e){}
    try{map.setView(defaultCenter(),defaultZoom(),{animate:false});}catch(e){};
    let tileErr=0,tileErrT=0;
    const onTileError=()=>{
      const now=Date.now();
      if(!tileErrT||now-tileErrT>8000){tileErrT=now;tileErr=0}
      tileErr++;
      if(tileErr>=8) switchTiles();
    };
    function switchTiles(){
      if(tileIndex>=TILE_SOURCES.length-1) return;
      tileIndex++;
      try{map.removeLayer(tiles)}catch(e){}
      tiles=makeTiles(tileIndex);
      tiles.addTo(map);
      tileOk=false;
      tiles.on('tileload',onTileLoad);
      armTileWatchdog();
    try{if(mapEl.getBoundingClientRect&&mapEl.getBoundingClientRect().height<140) mapEl.style.height='60vh';}catch(e){}
    try{map.setView(defaultCenter(),defaultZoom(),{animate:false});}catch(e){};
      tileErr=0;
      tileErrT=0;
      tiles.on('tileerror',onTileError);
    }
    tiles.on('tileerror',onTileError);
    const group=L.featureGroup().addTo(map);
    const feedGroup=L.featureGroup().addTo(map);
    let invT=null;
    function scheduleInvalidate(){if(invT) clearTimeout(invT);invT=setTimeout(()=>{try{map.invalidateSize();}catch(e){} try{tiles.redraw();}catch(e){}},90);}
    scheduleInvalidate();
    try{window.addEventListener("resize",scheduleInvalidate);}catch(e){}
    try{new ResizeObserver(scheduleInvalidate).observe(mapEl);}catch(e){}
    try{new IntersectionObserver(es=>{if(es.some(r=>r.isIntersecting)) scheduleInvalidate();}).observe(mapEl);}catch(e){}
    let kicked=false;
    map.on("movestart",()=>{if(kicked) return;kicked=true;scheduleInvalidate();});
    map.on("zoomstart",()=>{if(kicked) return;kicked=true;scheduleInvalidate();});
    const today=ymdToday();
    const norm=flattenPlaces(places||[]).filter(p=>!isExpired(p,today));
    const files=Array.isArray(window.OSM_MAP_DATASET_ORDER)&&window.OSM_MAP_DATASET_ORDER.length?window.OSM_MAP_DATASET_ORDER.slice():mapDataFilesFromSettings();
    const order=new Map();
    for(let i=0;i<files.length;i++) order.set(String(files[i]||''),i);
    const byCoord=new Map();
    for(const p of norm){
      const lat=Number(p.lat);
      const lon=Number(p.lon);
      if(!isFinite(lat)||!isFinite(lon)) continue;
      const k=lat.toFixed(6)+','+lon.toFixed(6);
      let a=byCoord.get(k);
      if(!a){a=[];byCoord.set(k,a);}
      a.push(p);
    }
    const placeKeys=new Set(byCoord.keys());
    const getFeedIdx=()=>window.__OSM_FEED_INDEX__||window.__OSM_FEED_BY_LL__||{};
    const buildAvatarBtn=meta=>{
      const ts=String(meta&&meta.ts||'').trim();
      if(!ts) return '';
      const av=String(meta&&meta.avatar||'').trim();
      const user=String(meta&&meta.user||'').trim();
      const img=av?`<img src=\"${esc(av)}\" alt=\"\">`:'';
      const ttl=user?` title=\"${esc(user)}\"`:'';
      return `<button type=\"button\" class=\"osm-popup-avatar\" data-ts=\"${esc(ts)}\"${ttl}>${img}</button>`;
    };
    for(const [k,arr] of byCoord){
      const sp=k.split(',');
      const lat=Number(sp[0]);
      const lon=Number(sp[1]);
      if(!isFinite(lat)||!isFinite(lon)) continue;
      const items=arr.slice();
      items.sort((a,b)=>{
        const ia=order.has(a.__src)?order.get(a.__src):1e9;
        const ib=order.has(b.__src)?order.get(b.__src):1e9;
        if(ia!==ib) return ia-ib;
        return String(a.name||'').localeCompare(String(b.name||''),'zh-Hant');
      });
      const cat=String((items[0]&&items[0].cat)||'');
      
      const m=L.marker([lat,lon],{icon:markerIcon(L,cat,items.length)});
      m.addTo(group);
      m.bindPopup(buildPopupStack(items),{maxWidth:360,closeButton:true,autoPanPadding:[24,24]});
      m.on('popupopen',()=>{
        try{
          const pop=m.getPopup();
          const el=pop&&typeof pop.getElement==='function'?pop.getElement():null;
          if(!el) return;
          const ll=m.getLatLng();
          const llKey=isFinite(ll.lat)&&isFinite(ll.lng)?ll.lat.toFixed(6)+','+ll.lng.toFixed(6):'';
          const idx=getFeedIdx();
          const all=llKey&&idx[llKey]?idx[llKey]:[];
          const content=el.querySelector('.leaflet-popup-content')||el;
          try{content.querySelectorAll('.osm-feed-block').forEach(n=>n.remove());}catch(e){}
          const popEls=content.querySelectorAll('.osm-popup');
          if(!popEls||!popEls.length) return;
          popEls.forEach((pel,i)=>{
            const box=pel.querySelector('.osm-popup-feeds');
            if(!box) return;
            const nm=String(pel.dataset.name||'').trim();
            const addr=String(pel.dataset.address||'').trim();
            const matched=_matchFeedsForPlace(all,nm,addr,false);
            const html=matched.slice(0,3).map(buildAvatarBtn).filter(Boolean).join('');
            box.innerHTML=html;
            box.onclick=e=>{
              const btn=e.target.closest('.osm-popup-avatar');
              if(!btn) return;
              e.preventDefault();
              e.stopPropagation();
              openOsmFeedModalByTs(btn.dataset.ts||'');
            };
          });
        }catch(e){}
      });
    }
    const fsBtn=document.getElementById('osmMapFullscreenBtn');
    const getLegendEl=()=>{try{return document.getElementById('osmMapLegend')||null;}catch(e){return null;}};
    let prevView=null,fsLock=false;
    let portalParent=panel.parentNode,portalNext=panel.nextSibling,isPortaled=false;
    function portalOn(){
      if(isPortaled) return;
      try{portalParent=portalParent||panel.parentNode;portalNext=portalNext||panel.nextSibling;}catch(e){}
      try{document.body.appendChild(panel);}catch(e){}
      isPortaled=true;
    }
    function portalOff(){
      if(!isPortaled) return;
      try{
        if(portalParent){
          if(portalNext&&portalNext.parentNode===portalParent) portalParent.insertBefore(panel,portalNext);
          else portalParent.appendChild(panel);
        }
      }catch(e){}
      isPortaled=false;
    }
    function setFsBtn(on){
      if(!fsBtn) return;
      fsBtn.innerHTML=on?'<i class="uil uil-compress-arrows"></i>':'<i class="uil uil-expand-arrows-alt"></i>';
    }
    function enterFullscreen(){
      if(fsLock) return;fsLock=true;
      try{prevView={center:map.getCenter(),zoom:map.getZoom()};}catch(e){prevView=null;}
      portalOn();
      panel.classList.add('osm-fullscreen');
      panel.classList.add('osm-css-fullscreen');
      document.body.classList.add('osm-no-scroll');
      setFsBtn(true);
      try{const l=getLegendEl();if(l) l.classList.add('is-visible');}catch(e){};
      const z=Math.min(19,defaultZoom()+2);
      const c=defaultCenter();
      setTimeout(()=>{try{map.invalidateSize();}catch(e){};try{map.setView(c,z,{animate:false});}catch(e){}},80);
      fsLock=false;
    }
    function exitFullscreen(){
      if(fsLock) return;fsLock=true;
      panel.classList.remove('osm-fullscreen');
      panel.classList.remove('osm-css-fullscreen');
      document.body.classList.remove('osm-no-scroll');
      setFsBtn(false);
      try{const l=getLegendEl();if(l) l.classList.remove('is-visible');}catch(e){};
      portalOff();
      const c=defaultCenter();
      const z=defaultZoom();
      try{map.setView(c,z,{animate:false});}catch(e){}
      setTimeout(()=>{try{map.invalidateSize();}catch(e){}},80);
      fsLock=false;
    }
    if(fsBtn){
      fsBtn.addEventListener('click',()=>{
        const on=panel.classList.contains('osm-fullscreen');
        if(on) exitFullscreen(); else enterFullscreen();
      });
    }
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('osm-fullscreen')) exitFullscreen();});
    window.osmResetViewToDefault=function(){try{map.setView(defaultCenter(),defaultZoom(),{animate:false});}catch(e){}};
    window.osmExitFullscreenAndReset=function(){try{if(panel.classList.contains('osm-fullscreen')) exitFullscreen(); else window.osmResetViewToDefault();}catch(e){}};
    setTimeout(()=>{try{map.invalidateSize();}catch(e){}},60);
  }
  window.initOsmDiscountMap=async function(){
    try{
      injectCss();
      await loadLeaflet();
      await ensurePlaces();
      const places=Array.isArray(window.PLACES)?window.PLACES:[];
      await initMap(window.L,places);
    }catch(e){}
  };
  window.ensureOsmPlaces=function(){try{return ensurePlaces();}catch(e){return Promise.resolve([])}};
  function setupLazyOsm(){
    const panel=document.getElementById('app_map');
    const mapEl=document.getElementById('osmMap');
    if(!panel||!mapEl) return;
    if(mapEl.dataset.osmLazy==='1') return;
    mapEl.dataset.osmLazy='1';
    if(!mapEl.innerHTML||!String(mapEl.innerHTML).trim()) mapEl.innerHTML='<div class="osm-lazy-placeholder"><div class="osm-lazy-spinner"></div><div>地圖載入中…</div></div>';
    const kick=()=>{try{window.initOsmDiscountMap();}catch(e){}};
    const relay=(btn)=>{
      if(!btn) return;
      btn.addEventListener('click',e=>{
        if(panel._osmMap) return;
        e.preventDefault();
        e.stopPropagation();
        Promise.resolve().then(()=>window.initOsmDiscountMap()).then(()=>setTimeout(()=>{try{btn.click();}catch(_){}} ,0));
      },true);
      btn.addEventListener('pointerdown',()=>{if(!panel._osmMap) kick();},{once:true,passive:true});
      btn.addEventListener('touchstart',()=>{if(!panel._osmMap) kick();},{once:true,passive:true});
    };
    relay(document.getElementById('osmMapLocateBtn'));
    relay(document.getElementById('osmMapFullscreenBtn'));
    mapEl.addEventListener('pointerdown',()=>{if(!panel._osmMap) kick();},{once:true,passive:true});
    mapEl.addEventListener('touchstart',()=>{if(!panel._osmMap) kick();},{once:true,passive:true});
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver(es=>{
        for(const en of es){
          if(en.isIntersecting&&en.intersectionRatio>0){
            io.disconnect();
            kick();
            break;
          }
        }
      },{root:null,threshold:[0,0.05,0.1]});
      try{io.observe(mapEl);}catch(e){kick();}
    }else{
      let done=false;
      const on=()=>{if(done) return;done=true;try{window.removeEventListener('scroll',on);}catch(e){};kick();};
      window.addEventListener('scroll',on,{passive:true});
      setTimeout(on,1000);
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setupLazyOsm); else setupLazyOsm();
})();
