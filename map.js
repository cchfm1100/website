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
  const CAT_COLORS={"美食":"#e74c3c","美食餐廳":"#e74c3c","服飾":"#9b59b6","住宿":"#3498db","旅遊住宿":"#3498db","旅遊":"#2ecc71","旅游":"#2ecc71","休閒娛樂":"#1abc9c","美容舒壓":"#9b59b6","按摩":"#f39c12","泡湯休息":"#16a085","健康商城":"#7f8c8d","通勤":"#f39c12","其他":"#7f8c8d"};
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
.osm-map-actions{display:flex;align-items:center;gap:.45rem}
#osmDiscountMapPanel.osm-fullscreen{z-index:25000;max-width:none;width:100%;height:100%;border-radius:0;box-shadow:var(--shadow-lg);overflow:hidden;display:flex;flex-direction:column;gap:1rem;padding:calc(1rem + env(safe-area-inset-top)) 1rem calc(1rem + env(safe-area-inset-bottom));background:var(--c-bg-alt);isolation:isolate}
#osmDiscountMapPanel.osm-css-fullscreen{position:fixed;inset:0;width:100vw;height:100vh}
#osmDiscountMapPanel.osm-fullscreen:after{display:none}
#osmDiscountMapPanel.osm-fullscreen .panel-header{flex:0 0 auto;position:sticky;top:0;z-index:10020;background:var(--glass);backdrop-filter:saturate(180%) blur(18px);padding:.4rem .55rem .4rem .9rem}
#osmDiscountMapPanel.osm-fullscreen .osm-map-actions{position:relative;z-index:10021}
#osmDiscountMapPanel.osm-fullscreen #osmMap{aspect-ratio:auto;flex:1 1 auto;min-height:0;border-radius:18px;position:relative;z-index:1}
body.osm-no-scroll{overflow:hidden;transform:none!important}
body#ScrollToyBody.osm-no-scroll{transform:none!important}
body.osm-no-scroll #ScrollToy{display:none!important}
.dot-icon{background:transparent;border:none}
.leaflet-container{font:inherit}
#osmDiscountMapPanel.osm-theme-dark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.88) contrast(.92)}
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
.osm-popup-actions{margin:.55rem 0 0}
.osm-popup-actions .caption{display:flex;flex-wrap:wrap;gap:.35rem}
.osm-popup-actions .caption a{white-space:nowrap}
.osm-popup a{display:inline-flex;align-items:center;gap:.35rem;padding:.33rem .6rem;border:1px solid var(--c-border);border-radius:999px;background:var(--glass);backdrop-filter:saturate(180%) blur(10px);color:var(--c-text);text-decoration:none;font-weight:800;font-size:.78rem;line-height:1}
.osm-popup a:hover{background:var(--c-bg-soft)}`;
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
    return cfg||'map1.js';
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
    try{await loadScript(file);return true;}catch(e){}
    try{
      if(typeof window.getSettingScriptUrl==='function'){
        const u=window.getSettingScriptUrl(file);
        if(u){await loadScript(u);return true;}
      }
    }catch(e){}
    return false;
  }
  async function ensurePlaces(){
    if(window.__OSM_PLACES_READY) return;
    const files=mapDataFilesFromSettings();
    if(!files.length) files.push(getDataFile());
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
    const actions=(tel||addrBtn)?`<div class="osm-popup-actions"><div class="caption">${[addrBtn,tel].filter(Boolean).join('')}</div></div>`:'';
    const cls=['osm-popup'];
    const n=Math.max(0,Number(idx||0));
    if(n) cls.push('osm-popup'+n);
    const srcSlug=String(p.__src||'').trim().toLowerCase().replace(/\.js$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
    if(srcSlug) cls.push('osm-src-'+srcSlug);
    return `<div class="${cls.join(' ')}"><div class="osm-popup-title">${nm}</div>${items}${offerBlock}${actions}</div>`;
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
  function initMap(L,places){
    const panel=document.getElementById('osmDiscountMapPanel');
    const mapEl=document.getElementById('osmMap');
    if(!panel||!mapEl) return;
    if(panel._osmMap) return;
    const map=L.map(mapEl,{zoomControl:true,attributionControl:true});
    panel._osmMap=map;
    const tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
    tiles.addTo(map);
    const group=L.featureGroup().addTo(map);
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
      m.bindPopup(buildPopupStack(items),{maxWidth:360,closeButton:true,autoPanPadding:[24,24]});
      m.addTo(group);
    }
    if(group.getLayers().length){
      try{map.fitBounds(group.getBounds(),{padding:[24,24],maxZoom:16});}
      catch(e){map.setView(defaultCenter(),defaultZoom());}
    }else{
      map.setView(defaultCenter(),defaultZoom());
    }
    const cats=[...new Set(norm.map(p=>String(p.cat||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant'));
    let legendEl=null;
    const legend=L.control({position:'bottomright'});
    legend.onAdd=function(){
      const d=L.DomUtil.create('div','osm-legend');
      legendEl=d;
      d.innerHTML=cats.map(k=>`<div class="osm-legend-row"><span class="osm-legend-dot" style="background:${catColor(k)}"></span><span>${esc(k)}</span></div>`).join('')||`<div class="osm-legend-row"><span style="opacity:.7">無分類</span></div>`;
      return d;
    };
    legend.addTo(map);
    function applyTheme(){panel.classList.toggle('osm-theme-dark',isDark());}
    applyTheme();
    try{new MutationObserver(applyTheme).observe(document.body,{attributes:true,attributeFilter:['data-theme']});}catch(e){}
    let userMarker=null,userCircle=null;
    function setUserMarker(latlng,acc){
      try{if(userMarker) map.removeLayer(userMarker);}catch(e){}
      try{if(userCircle) map.removeLayer(userCircle);}catch(e){}
      userMarker=L.circleMarker(latlng,{radius:8,weight:2,opacity:1,fillOpacity:.35});
      userCircle=L.circle(latlng,{radius:Math.max(10,acc||0),weight:1,opacity:.25,fillOpacity:.12});
      userCircle.addTo(map);
      userMarker.addTo(map);
    }
    const locateBtn=document.getElementById('osmMapLocateBtn');
    if(locateBtn){
      locateBtn.addEventListener('click',()=>{
        if(!navigator.geolocation){flash('此瀏覽器不支援定位');return;}
        locateBtn.disabled=true;
        navigator.geolocation.getCurrentPosition(pos=>{
          locateBtn.disabled=false;
          const lat=pos.coords.latitude,lon=pos.coords.longitude;
          const acc=pos.coords.accuracy;
          const ll=[lat,lon];
          setUserMarker(ll,acc);
          map.setView(ll,Math.max(map.getZoom(),16));
          flash('已定位');
        },()=>{
          locateBtn.disabled=false;
          flash('定位失敗');
        },{enableHighAccuracy:true,timeout:9000,maximumAge:600000});
      });
    }
    const fsBtn=document.getElementById('osmMapFullscreenBtn');
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
      if(legendEl) legendEl.classList.add('is-visible');
      const z=defaultZoom();
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
      if(legendEl) legendEl.classList.remove('is-visible');
      portalOff();
      if(prevView) try{map.setView(prevView.center,prevView.zoom,{animate:false});}catch(e){}
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
    setTimeout(()=>{try{map.invalidateSize();}catch(e){}},60);
  }
  window.initOsmDiscountMap=async function(){
    try{
      injectCss();
      await loadLeaflet();
      await ensurePlaces();
      const places=Array.isArray(window.PLACES)?window.PLACES:[];
      initMap(window.L,places);
    }catch(e){}
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>window.initOsmDiscountMap()); else window.initOsmDiscountMap();
})();