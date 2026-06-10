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
  const GOMAJI_TEXT='下載Gomaji app，輸入推薦碼6DA78可獲得$120優惠';
  function gomajiUrlFromId(v){v=String(v||'').trim();let m=v.match(/(?:store\/)?(\d+\/pid\/\d+)/i);if(!m)return'';return 'https://www.gomaji.com/store/'+m[1].replace(/^store\//i,'')}
  function mergeMapUrls(a,b){const out=[];splitMapUrls(a).concat(splitMapUrls(b)).forEach(u=>{u=String(u||'').trim();if(u&&!out.includes(u))out.push(u)});return out.join('\n')}
  function flattenPlaces(list){
    const out=[];
    for(const p of(list||[])){
      if(!p||typeof p!=='object') continue;
      const name=String(p.name||'').trim();
      const cat=p.cat||'';
      const offer=p.offer||'';
      const offerPrice=p.offer_price||p.offerPrice||p.offer_price_text||'';
      const offerAdv=p.offer_adv||p.offerAdv||p.offerADV||'';
      const offerAdvPicURL=p.offer_advpicURL||p.offer_adv_pic_url||p.offerAdvPicURL||p.offerADVPicURL||'';
      const phone=p.phone||'';
      let branches=Array.isArray(p.branches)?p.branches:[];
      if(!branches.length){
        const addr0=String(p.address||'').trim();
        const lat0=('lat' in p)?p.lat:(('latitude' in p)?p.latitude:undefined);
        let lon0=('lon' in p)?p.lon:(('lng' in p)?p.lng:(('longitude' in p)?p.longitude:(('long' in p)?p.long:undefined)));
        const hasLL=isFinite(Number(lat0))&&isFinite(Number(lon0));
        if(addr0||hasLL) branches=[{address:addr0,lat:lat0,lon:lon0}];
      }
      if(!branches.length) branches=[{address:'',lat:undefined,lon:undefined}];
      for(const b of(branches||[])){
        if(!b||typeof b!=='object') continue;
        const addr=String(b.address||'').trim();
        const lat=('lat' in b)?b.lat:(('latitude' in b)?b.latitude:undefined);
        let lon=('lon' in b)?b.lon:(('lng' in b)?b.lng:(('longitude' in b)?b.longitude:(('long' in b)?b.long:undefined)));
        const exp=('expire' in b)?b.expire:(('expiry' in b)?b.expiry:(('exp' in b)?b.exp:(('end' in b)?b.end:(('until' in b)?b.until:(p.expire||p.expiry||p.exp||p.end||p.until||'')))));
        const bCat=('cat' in b)?b.cat:cat;
        const bOffer=('offer' in b)?b.offer:offer;
        const bOfferPrice=('offer_price' in b)?b.offer_price:(('offerPrice' in b)?b.offerPrice:offerPrice);
        const bOfferAdv=('offer_adv' in b)?b.offer_adv:(('offerAdv' in b)?b.offerAdv:offerAdv);
        const bOfferAdvPicURL=('offer_advpicURL' in b)?b.offer_advpicURL:(('offer_adv_pic_url' in b)?b.offer_adv_pic_url:(('offerAdvPicURL' in b)?b.offerAdvPicURL:offerAdvPicURL));
        const bPhone=('phone' in b)?b.phone:phone;
        const bUrls=('urls' in b)?b.urls:(p.urls||'');
        const bGid=('GomajiIDURL' in b)?b.GomajiIDURL:(('GomajiIDURL' in p)?p.GomajiIDURL:'');
        const bGomaji=('isGomaji' in b)?b.isGomaji:(('isgomaji' in b)?b.isgomaji:(p.isGomaji||p.isgomaji||bGid||0));
        out.push({__src:p.__src||'',name,cat:bCat||'',offer:bOffer||'',offer_price:bOfferPrice||'',offer_adv:bOfferAdv||'',offer_advpicURL:bOfferAdvPicURL||'',phone:bPhone||'',urls:mergeMapUrls(bUrls,gomajiUrlFromId(bGid)),GomajiIDURL:String(bGid||''),isGomaji:bGomaji?1:0,address:addr,lat,lon,expire:exp});
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
    st.textContent=`#app_map{position:relative;height:200px;min-height:200px;max-height:200px;isolation:isolate;overflow:hidden}
#app_map>.panel-header{position:relative;z-index:10;flex:0 0 auto;gap:.75rem;padding:.5rem .65rem;margin:0 0 .7rem;border:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-radius:var(--r-md);background:var(--glass);backdrop-filter:saturate(180%) blur(16px);box-shadow:var(--shadow-xs)}
#app_map>.panel-header h4{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#app_map .osm-map-actions{position:relative;z-index:11;flex:0 0 auto}
#osmMap{position:absolute;inset:0;width:100%;height:100%;min-height:100%;aspect-ratio:auto;border-radius:inherit;overflow:hidden;border:0;background:var(--c-bg-soft);z-index:0}
#app_map .leaflet-top{top:calc(56px + .9rem)}
.osm-lazy-placeholder{width:100%;height:100%;min-height:120px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:.6rem;color:var(--c-text-soft);font-weight:800;letter-spacing:.4px}
.osm-lazy-spinner{width:22px;height:22px;border:2px solid rgba(0,0,0,.16);border-top-color:var(--c-primary);border-radius:50%;animation:osmSpin 1s linear infinite}
@keyframes osmSpin{to{transform:rotate(360deg)}}
.osm-map-actions{display:flex;align-items:center;gap:.45rem}
#app_map.osm-fullscreen{z-index:25000;max-width:none;max-height:none;width:100%;height:100%;min-height:100%;border-radius:0;box-shadow:var(--shadow-lg);overflow:hidden;display:block;padding:calc(1rem + env(safe-area-inset-top)) 1rem calc(1rem + env(safe-area-inset-bottom));background:var(--c-bg-alt);isolation:isolate}
#app_map.osm-css-fullscreen{position:fixed;inset:0;width:100vw;height:100vh}
#app_map.osm-fullscreen:after{display:none}
#app_map.osm-fullscreen .panel-header{position:relative;top:auto;z-index:10020;background:var(--glass);backdrop-filter:saturate(180%) blur(18px);padding:.5rem .65rem;margin:0 0 .7rem;border-radius:var(--r-md)}
#app_map.osm-fullscreen .osm-map-actions{position:relative;z-index:10021}
#app_map.osm-fullscreen #osmMap{inset:0;width:100%;height:100%;min-height:100%;aspect-ratio:auto;border-radius:0;position:absolute;z-index:0}
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
.osm-popup-avatar{width:30px;height:30px;border-radius:50%;overflow:hidden;border:2px solid var(--c-bg-alt);background:var(--c-bg-alt);box-shadow:0 4px 12px -6px rgba(0,0,0,.35);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;position:relative}
.osm-popup-avatar img{width:100%;height:100%;object-fit:cover}
.osm-popup-avatar:hover{transform:translateY(-1px)}
.osm-popup-feedcount{height:28px;display:inline-flex;align-items:center;justify-content:center;padding:0 10px;border-radius:999px;border:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(10px);font-weight:950;font-size:.72rem;letter-spacing:.3px;line-height:1;color:var(--c-text)}
.osm-popup-feedcount b{font-weight:950}
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
.osm-feed-modal-card{position:relative;width:min(780px,94vw);max-height:min(88vh,980px);overflow:hidden;border-radius:20px;background:var(--c-bg-alt);border:1px solid var(--c-border);box-shadow:var(--shadow-lg);display:flex;flex-direction:column}
.osm-feed-modal-top{position:sticky;top:0;z-index:2;background:var(--glass);backdrop-filter:saturate(180%) blur(18px);border-bottom:1px solid var(--c-border)}
.osm-feed-modal-topbar{display:flex;align-items:center;gap:12px;padding:12px 12px}
.osm-feed-modal-brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.osm-feed-modal-brand i{font-size:1.3rem;color:var(--c-primary);flex:0 0 auto}
.osm-feed-modal-brandtext{min-width:0;display:flex;flex-direction:column}
.osm-feed-modal-brand .osm-popup-title{margin:0;font-size:.92rem;line-height:1.15}
.osm-feed-modal-brand .osm-popup-meta{margin:0;margin-top:2px;font-size:.7rem;opacity:.82;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:min(62vw,520px)}
.osm-feed-modal-close{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:14px;border:1px solid var(--c-border);background:transparent;color:var(--c-text);font-size:22px;font-weight:900;cursor:pointer;flex:0 0 auto}
.osm-feed-modal-close:hover{background:var(--c-bg-soft)}
.osm-feed-modal-bodywrap{padding:12px 14px 16px;overflow:auto}
.osm-feed-modal-bodywrap .osm-popup-stack{max-height:none;overflow:visible;padding-right:0}
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
.osm-feed-modal-actions{display:flex;align-items:center;gap:8px;margin:4px 0 10px}
.osm-feed-modal-actions button{display:inline-flex;align-items:center;gap:6px;padding:.36rem .68rem;border-radius:999px;border:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(10px);color:var(--c-text);font-weight:900;font-size:.78rem;line-height:1;cursor:pointer}
.osm-feed-modal-actions button:hover{background:var(--c-bg-soft)}
.osm-list-modal{position:fixed;inset:0;z-index:31500;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.38);backdrop-filter:saturate(120%) blur(10px)}
.osm-list-modal.open{display:flex}
body.osm-list-modal-open{overflow:hidden}
.osm-list-card{width:min(980px,96vw);max-height:min(88vh,980px);overflow:hidden;border-radius:20px;background:var(--c-bg-alt);border:1px solid var(--c-border);box-shadow:var(--shadow-lg);display:flex;flex-direction:column}
.osm-list-top{display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid var(--c-border);background:var(--glass);backdrop-filter:saturate(180%) blur(18px)}
.osm-list-title{display:flex;align-items:center;gap:9px;min-width:0;flex:1;font-weight:950;letter-spacing:.25px}
.osm-list-title i{font-size:1.25rem;color:var(--c-primary)}
.osm-list-close{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:14px;border:1px solid var(--c-border);background:transparent;color:var(--c-text);font-size:22px;font-weight:900;cursor:pointer;flex:0 0 auto}
.osm-list-close:hover{background:var(--c-bg-soft)}
.osm-list-body{padding:10px 12px 14px;overflow:auto}
.osm-list-table{width:100%;border-collapse:separate;border-spacing:0 7px;font-size:.82rem}
.osm-list-table th{text-align:left;white-space:nowrap;color:var(--c-text-soft);font-size:.72rem;padding:0 8px;font-weight:950}
.osm-list-table td{vertical-align:top;background:color-mix(in oklab,var(--c-bg-soft),transparent 25%);border-top:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-bottom:1px solid color-mix(in oklab,var(--c-border),transparent 12%);padding:9px 8px;line-height:1.35}
.osm-list-table td:first-child{border-left:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-radius:12px 0 0 12px;font-weight:900;white-space:nowrap}
.osm-list-table td:last-child{border-right:1px solid color-mix(in oklab,var(--c-border),transparent 12%);border-radius:0 12px 12px 0;white-space:nowrap}
.osm-list-table .osm-list-name{font-weight:950;color:var(--c-text)}
.osm-list-table .osm-list-offer{max-width:360px}
.osm-list-table a,.osm-list-table button,.osm-ad-actions button,.osm-ad-actions a{display:inline-flex;align-items:center;justify-content:center;gap:.3rem;border:1px solid var(--c-border);border-radius:999px;background:var(--glass);color:var(--c-text);text-decoration:none;font-weight:900;font-size:.76rem;line-height:1;padding:.34rem .62rem;cursor:pointer}
.osm-list-table a:hover,.osm-list-table button:hover,.osm-ad-actions button:hover,.osm-ad-actions a:hover{background:var(--c-bg-soft)}
.map-ad-feed{border:1px solid color-mix(in oklab,var(--c-primary),transparent 72%);background:#fff!important;overflow:hidden}
.map-ad-feed .map-ad-head{align-items:flex-start;gap:.65rem;padding-bottom:.15rem}
.map-ad-feed .map-ad-head .info{min-width:0;flex:1}
.map-ad-feed .map-ad-head h3{font-size:1rem;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0}
.map-ad-feed .map-ad-head small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.map-ad-sponsored{display:inline-flex;align-items:center;gap:.25rem;margin-bottom:.2rem;padding:.16rem .48rem;border-radius:999px;background:color-mix(in oklab,var(--c-primary),transparent 84%);color:var(--c-primary);font-size:.68rem;font-weight:950;letter-spacing:.04em}
.map-ad-feed .feed-header .actions{display:flex;gap:.4rem;align-items:center;flex:0 0 auto}
.map-ad-card{display:grid;grid-template-columns:minmax(220px,46%) minmax(240px,1fr);gap:.78rem;margin:.5rem 0 .1rem;align-items:start}
.map-ad-thumb{border-radius:18px;overflow:hidden;background:color-mix(in oklab,var(--c-bg-soft),transparent 10%);border:1px solid color-mix(in oklab,var(--c-border),transparent 10%);min-height:96px;box-shadow:0 12px 26px -20px rgba(0,0,0,.45)}
.map-ad-thumb img{width:100%;height:100%;min-height:96px;object-fit:cover;display:block}
.map-ad-noimg{height:100%;min-height:96px;display:flex;align-items:center;justify-content:center;color:var(--c-primary);font-size:2rem}
.map-ad-copy{min-width:0;display:flex;flex-direction:column;gap:.35rem}
.map-ad-meta{color:var(--c-text-soft);font-weight:850;font-size:.76rem;line-height:1.35;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
.map-ad-offer{align-self:flex-start;display:inline-flex;align-items:center;gap:.28rem;padding:.22rem .55rem;border-radius:999px;background:color-mix(in oklab,var(--c-primary),transparent 87%);color:var(--c-primary);font-weight:950;font-size:.76rem;line-height:1.25}
.map-ad-summary{color:var(--c-text-soft);font-size:.72rem;line-height:1.42;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.map-ad-actions{display:flex;flex-wrap:wrap;gap:.42rem;margin-top:.2rem;align-items:center;justify-content:flex-end}
.map-ad-actions button,.map-ad-actions a,.osm-list-table a,.osm-list-table button,.osm-ad-actions button,.osm-ad-actions a{display:inline-flex;align-items:center;justify-content:center;gap:.3rem;border:1px solid var(--c-border);border-radius:999px;background:var(--glass);color:var(--c-text);text-decoration:none;font-weight:900;font-size:.76rem;line-height:1;padding:.34rem .62rem;cursor:pointer}
.map-ad-actions button:hover,.map-ad-actions a:hover,.osm-list-table a:hover,.osm-list-table button:hover,.osm-ad-actions button:hover,.osm-ad-actions a:hover{background:var(--c-bg-soft)}
.map-ad-actions .more-btn{margin-right:auto!important;border-color:color-mix(in oklab,var(--c-primary),transparent 45%)!important;color:var(--c-primary)!important;background:color-mix(in oklab,var(--c-primary),transparent 90%)!important}
.feed-actions.map-ad-actions>.right{display:flex;gap:.75rem;align-items:center;margin-left:0}.feed-actions.map-ad-actions>.right>a,.feed-actions.map-ad-actions>.right>button{display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;padding:0;border-radius:50%;border:1px solid var(--c-border)!important;background:var(--c-bg-soft)!important;color:var(--c-text-soft)!important;font-size:1.25rem;line-height:1;text-decoration:none;cursor:pointer;transition:var(--trans);box-shadow:none;flex:0 0 auto}.feed-actions.map-ad-actions>.right>a:hover,.feed-actions.map-ad-actions>.right>button:hover{background:var(--c-primary)!important;color:#fff!important;border-color:var(--c-primary)!important;box-shadow:0 10px 24px -10px rgba(0,137,39,.6)}.feed-actions.map-ad-actions>.right>a i,.feed-actions.map-ad-actions>.right>button i{margin:0;font-size:1.25rem;line-height:1}.map-ad-feed:not(.map-ad-expanded) .map-ad-body{overflow:hidden}.map-ad-feed.map-ad-expanded .map-ad-body{max-height:none!important;overflow:visible!important}
.map-ad-details{display:none;margin-top:.65rem;padding-top:.65rem;border-top:1px dashed color-mix(in oklab,var(--c-border),transparent 10%)}
.map-ad-feed.map-ad-expanded .map-ad-details{display:block}
.map-ad-detail-text{white-space:pre-line;color:var(--c-text-soft);font-size:.72rem;line-height:1.46}.map-ad-detail-text .map-ad-bullet::before{display:none}.map-ad-detail-text .map-ad-bullet{gap:0}.map-ad-detail-text .map-ad-bullets{list-style:none;padding:0}
.map-ad-gallery{min-width:0;display:grid;grid-template-columns:1fr;gap:.4rem;margin-top:0;align-content:start}
.map-ad-gallery img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px;border:1px solid color-mix(in oklab,var(--c-border),transparent 20%);cursor:zoom-in}.map-ad-body{justify-self:end;width:min(100%,390px)}.map-ad-hero{min-height:190px}.map-ad-gallery-count{position:absolute;right:.45rem;bottom:.45rem;padding:.18rem .45rem;border-radius:999px;background:rgba(0,0,0,.62);color:#fff;font-size:.68rem;font-weight:900;line-height:1}
@media(max-width:860px){.map-ad-card{grid-template-columns:minmax(170px,42%) minmax(220px,1fr)}.map-ad-body{width:min(100%,360px)}.map-ad-hero{min-height:160px}}@media(max-width:560px){.map-ad-card{grid-template-columns:128px minmax(0,1fr);gap:.58rem}.map-ad-thumb,.map-ad-thumb img,.map-ad-noimg{min-height:128px}.map-ad-hero{min-height:128px}.map-ad-body{justify-self:stretch;width:100%}.map-ad-gallery{grid-template-columns:1fr}}`;
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
  function vUrl(raw){try{return (typeof window.versionedUrl==='function')?window.versionedUrl(raw):((typeof versionedUrl==='function')?versionedUrl(raw):raw);}catch(e){return raw;}}
  function loadScript(src){
    src=String(src||'').trim();
    if(!src) return Promise.reject(new Error('empty src'));
    src=vUrl(src);
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
  const MAP_SQLITE_HTTPVFS_VERSION='0.8.12';
  const MAP_SQLITE_MODULE_URLS=['https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/+esm','https://esm.sh/sql.js-httpvfs@0.8.12?bundle'];
  const MAP_SQLITE_WORKER_CDN='https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sqlite.worker.js';
  const MAP_SQLITE_WASM_CDN='https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sql-wasm.wasm';
  window.__OSM_SQLITE_MAP_WORKERS__=window.__OSM_SQLITE_MAP_WORKERS__||{};
  window.__OSM_SQLITE_MAP_WORKER_URLS__=window.__OSM_SQLITE_MAP_WORKER_URLS__||{};
  window.__OSM_SQLITE_MAP_WORKER_URL__=window.__OSM_SQLITE_MAP_WORKER_URL__||'';
  function _baseName(s){return String(s||'').split('/').pop().split('?')[0].split('#')[0];}
  function _mapSqliteName(s){const b=_baseName(s).trim();return b?b.replace(/\.(js|json)$/i,'.sqlite'):'';}
  function _isSqliteName(s){return /\.(sqlite|db|sqlite3)(\?|#|$)/i.test(String(s||''));}
  function _isAbsUrl(s){return /^(https?:)?\/\//i.test(String(s||'')) || /^(data:|blob:)/i.test(String(s||''));}
  function _cdnUrl(file){const base=global.CDNurl||global.CDNURL||global.CCH_CDN_PREFIX||global.SQL_CDN_PREFIX||'';return String(base||'').replace(/\/?$/, '/')+String(file||'').replace(/^\//,'');}
  function _preferCdn(){try{return (typeof cchPreferCdnAssets==='function'&&cchPreferCdnAssets())||!!window.__CCH_CDN_FIRST__;}catch(e){return false;}}
  function _isGeoCodeFileName(s){return _baseName(s).toLowerCase()==='geocode.sqlite';}
  function _isMapDataKey(k){
    const b=_baseName(k).toLowerCase();
    if(!b) return false;
    if(b==='map.js'||b==='geocode.sqlite') return false;
    return /\.(sqlite|db|sqlite3|js|json)$/i.test(b);
  }
  function _settingsGroupsForMap(){
    const out=[];
    try{
      const root=(typeof settings!=='undefined'&&settings&&settings[0])?settings[0]:null;
      if(!root) return out;
      ['map','mapdata'].forEach(name=>{if(Array.isArray(root[name])) out.push.apply(out,root[name]);});
    }catch(e){}
    return out;
  }
  function getDataFile(){
    const cfg=String(window.OSM_MAP_DATA_FILE||'').trim();
    return cfg||'';
  }
  function mapDataFilesFromSettings(){
    const out=[];
    try{
      const groups=_settingsGroupsForMap();
      for(const block of groups){
        const scripts=block&&block.script;
        if(!Array.isArray(scripts)) continue;
        for(const m of scripts){
          if(!m) continue;
          for(const k in m){
            if(!Object.prototype.hasOwnProperty.call(m,k)) continue;
            if(!_isMapDataKey(k)) continue;
            out.push(_mapSqliteName(k));
          }
        }
      }
    }catch(e){}
    return [...new Set(out.map(v=>String(v).trim()).filter(Boolean))];
  }
  function _isLocalGoogleCandidateUrl(u){
    try{
      const x=new URL(String(u||''),location.href);
      const h=String(x.hostname||'').toLowerCase();
      const lh=String(location.hostname||'').toLowerCase();
      return h===lh&&(h.indexOf('googleusercontent.com')!==-1||String(x.pathname||'').indexOf('/embeds/')!==-1);
    }catch(e){return false;}
  }
  function _expandAssetCandidates(raw){
    const out=[];
    function add(v){
      v=String(v||'').trim();
      if(!v) return;
      try{v=new URL(vUrl(v),location.href).href}catch(e){v=vUrl(v)}
      if(v&&!out.includes(v)) out.push(v);
    }
    try{
      const fn=(window&&typeof window.cchAssetCandidates==='function')?window.cchAssetCandidates:null;
      if(fn){
        const arr=fn(raw);
        if(Array.isArray(arr)) arr.forEach(add);
      }
    }catch(e){}
    return out;
  }
  function mapSettingUrlCandidates(file){
    const want=_mapSqliteName(file);
    const raws=[];
    function addRaw(v){
      v=String(v||'').trim().replace(/\.(js|json)(\?|#|$)/i,'.sqlite$2');
      if(v&&!raws.includes(v)) raws.push(v);
    }
    try{
      const groups=_settingsGroupsForMap();
      for(const block of groups){
        const scripts=block&&block.script;
        if(!Array.isArray(scripts)) continue;
        for(const m of scripts){
          if(!m||typeof m!=='object') continue;
          for(const k of Object.keys(m)){
            const v=String(m[k]||'').trim();
            if(_mapSqliteName(k).toLowerCase()===want.toLowerCase()||_mapSqliteName(v).toLowerCase()===want.toLowerCase()){
              addRaw(v||k);
              addRaw(k);
            }
          }
        }
      }
    }catch(e){}
    addRaw(want);
    const out=[];
    function addUrl(v){
      v=String(v||'').trim();
      if(!v) return;
      try{v=new URL(vUrl(v),location.href).href}catch(e){v=vUrl(v)}
      if(v&&!out.includes(v)) out.push(v);
    }
    for(const raw of raws){
      const expanded=_expandAssetCandidates(raw);
      if(expanded.length){expanded.forEach(addUrl);continue;}
      if(_isAbsUrl(raw)) addUrl(raw);
      else if(_preferCdn()){addUrl(_cdnUrl(raw));addUrl(raw);}
      else{addUrl(raw);addUrl(_cdnUrl(raw));}
    }
    let filtered=out;
    if(_preferCdn()&&!window.__CCH_ALLOW_LOCAL_EMBED_FALLBACK__){
      filtered=out.filter(u=>!_isLocalGoogleCandidateUrl(u));
    }
    return (filtered.length?filtered:out).length?(filtered.length?filtered:out):[new URL(vUrl(want),location.href).href];
  }
  function mapSettingUrl(file){return mapSettingUrlCandidates(file)[0];}
  function rowsFromExec(res){
    if(!Array.isArray(res)) return [];
    if(res.length&&res[0]&&Array.isArray(res[0].values)&&Array.isArray(res[0].columns)){
      const cols=res[0].columns;
      return res[0].values.map(vals=>{const o={};cols.forEach((c,i)=>o[c]=vals[i]);return o;});
    }
    return res;
  }
  async function loadMapHttpVfsModule(){
    if(window.__SQLITE_HTTPVFS_MODULE__) return window.__SQLITE_HTTPVFS_MODULE__;
    let last=null;
    for(const u of MAP_SQLITE_MODULE_URLS){
      try{
        const mod=await import(vUrl(u));
        const createDbWorker=mod.createDbWorker||(mod.default&&mod.default.createDbWorker);
        if(createDbWorker){window.__SQLITE_HTTPVFS_MODULE__={createDbWorker};return window.__SQLITE_HTTPVFS_MODULE__;}
      }catch(e){last=e;}
    }
    throw last||new Error('sql.js-httpvfs import failed');
  }
  function getMapWorkerUrl(){
    if(window.__OSM_SQLITE_MAP_WORKER_URL__) return window.__OSM_SQLITE_MAP_WORKER_URL__;
    const body='importScripts('+JSON.stringify(vUrl(MAP_SQLITE_WORKER_CDN))+');';
    window.__OSM_SQLITE_MAP_WORKER_URL__=URL.createObjectURL(new Blob([body],{type:'text/javascript'}));
    return window.__OSM_SQLITE_MAP_WORKER_URL__;
  }
  async function queryMapRows(worker,sql){
    if(worker&&worker.db&&typeof worker.db.query==='function'){
      try{return rowsFromExec(await worker.db.query(sql));}catch(e){}
    }
    if(worker&&worker.db&&typeof worker.db.exec==='function') return rowsFromExec(await worker.db.exec(sql));
    return [];
  }
  function _geoAddrKeys(v){
    const s=String(v||'').trim();
    if(!s) return [];
    const out=[];
    function add(x){x=String(x||'').trim();if(x&&out.indexOf(x)<0)out.push(x);}
    add(s);
    add(s.replace(/[\u3000\s]+/g,''));
    add(s.replace(/臺/g,'台'));
    add(s.replace(/台/g,'臺'));
    add(s.replace(/臺/g,'台').replace(/[\u3000\s]+/g,''));
    add(s.replace(/台/g,'臺').replace(/[\u3000\s]+/g,''));
    return out;
  }
  function _validLL(lat,lon){lat=Number(lat);lon=Number(lon);return isFinite(lat)&&isFinite(lon);}
  function _blankGeoCache(){return {byAddress:{},byId:{}};}
  function _putGeoCache(cache,id,addr,lat,lon){
    if(!cache.byAddress) cache.byAddress={};
    if(!cache.byId) cache.byId={};
    const sid=String(id==null?'':id).trim();
    const a=String(addr||'').trim();
    const valid=_validLL(lat,lon);
    if(sid && !cache.byId[sid]) cache.byId[sid]={address:a,lat:null,lon:null};
    if(!valid) return;
    const ll=[Number(lat),Number(lon)];
    if(a==='OSM_MAP_DEFAULT_CENTER'){
      try{window.OSM_MAP_DEFAULT_CENTER=ll;}catch(e){}
    }
    if(sid) cache.byId[sid]={address:a,lat:ll[0],lon:ll[1]};
    _geoAddrKeys(a).forEach(k=>{cache.byAddress[k]=ll;});
  }
  function _lookupGeoCache(cache,addr){
    const byAddr=(cache&&cache.byAddress)||cache||{};
    for(const k of _geoAddrKeys(addr)){
      const v=byAddr&&byAddr[k];
      if(Array.isArray(v)&&_validLL(v[0],v[1])) return [Number(v[0]),Number(v[1])];
    }
    return null;
  }
  function _lookupGeoById(cache,id){
    const sid=String(id==null?'':id).trim();
    if(!sid) return null;
    const row=cache&&cache.byId&&cache.byId[sid];
    if(!row) return null;
    if(_validLL(row.lat,row.lon)) return {address:String(row.address||''),lat:Number(row.lat),lon:Number(row.lon)};
    return {address:String(row.address||''),lat:null,lon:null};
  }
  async function loadGeoCodeCache(){
    if(window.__OSM_GEOCODE_CACHE__) return window.__OSM_GEOCODE_CACHE__;
    const cache=_blankGeoCache();
    let worker=null;
    try{worker=await getMapSqliteWorker('GeoCode.sqlite');}catch(e){window.__OSM_GEOCODE_CACHE__=cache;return cache;}
    async function readTable(table){
      let rows=[];
      try{rows=await queryMapRows(worker,'SELECT GeoCodeID,address,lat,lon FROM '+_qi(table));}
      catch(e){try{rows=await queryMapRows(worker,'SELECT id AS GeoCodeID,address,lat,lon FROM '+_qi(table));}catch(e2){rows=[];}}
      for(const r of rows||[]) _putGeoCache(cache,r&&r.GeoCodeID,r&&r.address,r&&r.lat,r&&r.lon);
    }
    await readTable('QuickGeo');
    await readTable('GoogleGeo');
    window.__OSM_GEOCODE_CACHE__=cache;
    return cache;
  }
  async function getMapSqliteWorker(file){
    const f=_mapSqliteName(file);
    if(window.__OSM_SQLITE_MAP_WORKERS__[f]) return window.__OSM_SQLITE_MAP_WORKERS__[f];
    const mod=await loadMapHttpVfsModule();
    const urls=mapSettingUrlCandidates(f);
    let last=null;
    for(const url of urls){
      try{
        const worker=await mod.createDbWorker([{from:'inline',config:{serverMode:'full',requestChunkSize:4096,url:url}}],getMapWorkerUrl(),vUrl(MAP_SQLITE_WASM_CDN),Infinity);
        try{await queryMapRows(worker,"SELECT name FROM sqlite_master LIMIT 1");}catch(probeErr){throw probeErr;}
        window.__OSM_SQLITE_MAP_WORKERS__[f]=worker;
        window.__OSM_SQLITE_MAP_WORKER_URLS__[f]=url;
        return worker;
      }catch(e){last=e;}
    }
    throw last||new Error('map sqlite load failed: '+f);
  }
  function parseJson(v,def){try{if(v==null||v==='')return def;const x=JSON.parse(String(v));return x==null?def:x;}catch(e){return def;}}
  function rowToPlace(row){
    if(!row||typeof row!=='object') return null;
    const raw=row.raw_json||row.place_json||row.data_json||row.value_json||row.json||'';
    const parsed=parseJson(raw,null);
    if(parsed&&typeof parsed==='object'){
      const p=Object.assign({},parsed);
      const src=String(row.source_sqlite||row.source_file||row.__source_table||'').trim();
      if(src&&!p.__src) p.__src=src;
      return p;
    }
    const out={};
    const branches=parseJson(row.branches_data||row.branches||'',null);
    for(const k in row){
      if(!Object.prototype.hasOwnProperty.call(row,k)) continue;
      if(/^(rowid|id|item_index|source_sqlite|place_uid|raw_json|place_json|data_json|value_json|json|branches_data|branches)$/i.test(k)) continue;
      const v=row[k];
      if(v!==null&&v!==undefined&&v!=='') out[k]=v;
    }
    if(Array.isArray(branches)) out.branches=branches;
    if(row.__source_table&&!out.__src) out.__src=row.__source_table;
    return Object.keys(out).length?out:null;
  }
  function _qi(n){return '"'+String(n||'').replace(/"/g,'""')+'"';}
  function _splitGeoCodeIDs(v){return String(v||'').split(/[,|\s]+/).map(x=>x.trim()).filter(Boolean);}
  async function loadCompactMapTables(worker,names){
    const lower=new Set((names||[]).map(x=>String(x||'').toLowerCase()));
    const out=[];
    const geo=await loadGeoCodeCache().catch(()=>_blankGeoCache());
    async function tableCols(table){
      try{return (await queryMapRows(worker,'PRAGMA table_info('+_qi(table)+')')).map(c=>String(c&&c.name||''));}catch(e){return[];}
    }
    async function readAddressTable(addressTable){
      let addrs=[];
      try{addrs=await queryMapRows(worker,'SELECT id,address,lat,lon FROM '+_qi(addressTable));}catch(e){addrs=[];}
      const amap={};
      for(const a of addrs||[]){
        const id=String(a&&a.id!=null?a.id:'').trim();
        const addr=String(a&&a.address||'').trim();
        if(addr==='OSM_MAP_DEFAULT_CENTER'){
          if(_validLL(a&&a.lat,a&&a.lon)&&!_lookupGeoCache(geo,'OSM_MAP_DEFAULT_CENTER')) window.OSM_MAP_DEFAULT_CENTER=[Number(a.lat),Number(a.lon)];
          continue;
        }
        if(id)amap[id]={address:addr,lat:a&&a.lat,lon:a&&a.lon};
      }
      return amap;
    }
    function decodeAddresses(v){
      if(v==null||v==='') return [];
      const s=String(v).trim();
      if(!s) return [];
      if(s[0]==='['||s[0]==='{'){
        try{
          const j=JSON.parse(s);
          const arr=Array.isArray(j)?j:[j];
          return arr.map(x=>typeof x==='object'&&x?String(x.address||x.addr||x.location||'').trim():String(x||'').trim()).filter(Boolean);
        }catch(e){}
      }
      return s.split(/\r?\n|\|/).map(x=>x.trim()).filter(Boolean);
    }
    function colByLower(cols,name){
      const want=String(name||'').toLowerCase();
      for(const c of cols) if(String(c||'').toLowerCase()===want) return c;
      return '';
    }
    async function readPlaceRows(placeTable){
      const cols=await tableCols(placeTable);
      const low=cols.map(c=>c.toLowerCase());
      const colByAny=(names)=>{
        for(const name of names){
          const want=String(name||'').toLowerCase();
          for(const c of cols) if(String(c||'').toLowerCase()===want) return c;
        }
        return '';
      };
      const expr=(aliases,alias)=>{
        const c=colByAny(aliases);
        return c?_qi(c)+' AS '+alias:"'' AS "+alias;
      };
      if(!low.includes('name')&&!low.includes('offer')&&!low.includes('offer_adv')) return [];
      const parts=[
        expr(['name','title','store','store_name'],'name'),
        expr(['cat','category','type'],'cat'),
        expr(['offer','description','desc','summary'],'offer'),
        expr(['offer_price','offerPrice','offer_price_text','price'],'offer_price'),
        expr(['offer_adv','offerAdv','offerADV','adv'],'offer_adv'),
        expr(['offer_advpicURL','offer_adv_pic_url','offerAdvPicURL','offerADVPicURL','pic','image','img'],'offer_advpicURL'),
        expr(['phone','tel','telephone'],'phone'),
        expr(['urls','url','link','links'],'urls')
      ];
      const gomajiCol=colByAny(['GomajiIDURL','gomajiidurl','gomaji_url']);
      if(gomajiCol) parts.push(_qi(gomajiCol)+' AS GomajiIDURL');
      else if(colByAny(['isGomaji','isgomaji'])) parts.push(_qi(colByAny(['isGomaji','isgomaji']))+' AS isGomaji');
      const geoCol=colByAny(['GeoCodeID','geocodeid']);
      const addrIdCol=colByAny(['addressID','addressId','addr_id']);
      if(colByAny(['addresses'])) parts.push(_qi(colByAny(['addresses']))+' AS addresses');
      else if(colByAny(['address','addr','location'])) parts.push(_qi(colByAny(['address','addr','location']))+' AS addresses');
      else if(geoCol) parts.push(_qi(geoCol)+' AS GeoCodeID');
      else if(addrIdCol) parts.push(_qi(addrIdCol)+' AS addressID');
      try{return await queryMapRows(worker,'SELECT '+parts.join(',')+' FROM '+_qi(placeTable));}catch(e){return[];}
    }
    function branchWithGeo(addr,fallbackLat,fallbackLon){
      addr=String(addr||'').trim();
      if(!addr) return null;
      const ll=_lookupGeoCache(geo,addr);
      if(ll) return {address:addr,lat:ll[0],lon:ll[1]};
      if(_validLL(fallbackLat,fallbackLon)) return {address:addr,lat:Number(fallbackLat),lon:Number(fallbackLon)};
      return {address:addr,lat:null,lon:null};
    }
    function branchFromGeoID(id,amap){
      const g=_lookupGeoById(geo,id);
      if(g&&g.address) return {address:g.address,lat:g.lat,lon:g.lon};
      const a=amap&&amap[String(id||'').trim()];
      if(a) return branchWithGeo(a.address,a.lat,a.lon);
      return null;
    }
    function branchesFromRow(r,amap){
      const branches=[];
      const seen={};
      function push(br){
        if(!br||!br.address) return;
        const k=String(br.address);
        if(seen[k]) return;
        seen[k]=1;
        branches.push(br);
      }
      if(r&&r.addresses!=null){
        decodeAddresses(r.addresses).forEach(a=>push(branchWithGeo(a)));
      }else if(r&&r.address!=null){
        decodeAddresses(r.address).forEach(a=>push(branchWithGeo(a)));
      }else if(r&&r.GeoCodeID!=null){
        for(const id of _splitGeoCodeIDs(r.GeoCodeID)) push(branchFromGeoID(id,amap));
      }else{
        for(const id of _splitGeoCodeIDs(r&&r.addressID)) push(branchFromGeoID(id,amap));
      }
      return branches;
    }
    function pushRows(prefix,rows,amap){
      for(const r of rows||[]){
        const branches=branchesFromRow(r,amap);
        const gid=String(r.GomajiIDURL||'').trim();
        const gurl=gomajiUrlFromId(gid);
        const isg=(gid||Number(r.isGomaji||r.isgomaji||0))?1:0;
        const extra=String(r.offer||'').trim();
        const price=String(r.offer_price||r.offerPrice||'').trim();
        const adv=String(r.offer_adv||r.offerAdv||'').trim();
        const advpic=String(r.offer_advpicURL||r.offer_adv_pic_url||r.offerAdvPicURL||'').trim();
        out.push({__src:prefix+'.sqlite',name:String(r.name||''),cat:String(r.cat||''),offer:isg?(GOMAJI_TEXT+(extra?'\n'+extra:'')):extra,offer_price:price,offer_adv:adv,offer_advpicURL:advpic,phone:String(r.phone||''),urls:mergeMapUrls(String(r.urls||''),gurl),GomajiIDURL:gid,isGomaji:isg,branches});
      }
    }
    const numericSuffix=n=>{const m=String(n||'').match(/map(\d+)/i);return m?Number(m[1]):Number.MAX_SAFE_INTEGER;};
    const byNameLower=want=>{
      want=String(want||'').toLowerCase();
      return (names||[]).find(n=>String(n||'').toLowerCase()===want)||'';
    };
    const directMapTables=(names||[]).filter(n=>/^map\d+$/i.test(String(n||''))).sort((a,b)=>numericSuffix(a)-numericSuffix(b)||String(a).localeCompare(String(b)));
    if(directMapTables.length){
      const addressName=byNameLower('address');
      const amap=addressName?await readAddressTable(addressName):{};
      for(const table of directMapTables){
        pushRows(table,await readPlaceRows(table),amap);
      }
    }
    const placesTables=(names||[]).filter(n=>/^map\d+_places$/i.test(String(n||''))).sort((a,b)=>numericSuffix(a)-numericSuffix(b)||String(a).localeCompare(String(b)));
    for(const placeTable of placesTables){
      const prefix=String(placeTable).replace(/_places$/i,'');
      const addressTable=byNameLower(prefix+'_address');
      const amap=addressTable?await readAddressTable(addressTable):{};
      pushRows(prefix,await readPlaceRows(placeTable),amap);
    }
    return out;
  }
  async function loadPlacesSqliteFile(file){
    const f=_mapSqliteName(file);
    const worker=await getMapSqliteWorker(f);
    let rows=[];
    const tables=await queryMapRows(worker,"SELECT name,type FROM sqlite_master WHERE type IN ('table','view')").catch(()=>[]);
    const names=(tables||[]).map(r=>String(r&&r.name||'')).filter(Boolean);
    const compact=await loadCompactMapTables(worker,names).catch(()=>[]);
    if(compact&&compact.length){window.PLACES=compact;return true;}
    let candidates=names.filter(n=>/^(map\d+_places|places|places_all|map_places|place_index|data)$/i.test(n));
    if(!candidates.length) candidates=['places','map_places','place_index','data'];
    const seen={};
    candidates=candidates.filter(n=>{const k=String(n).toLowerCase(); if(seen[k])return false; seen[k]=1; return true;});
    for(const t of candidates){
      try{
        let r=[];
        const cols=await queryMapRows(worker,'PRAGMA table_info('+_qi(t)+')').catch(()=>[]);
        const colNames=(cols||[]).map(c=>String(c&&c.name||''));
        const lower=colNames.map(c=>c.toLowerCase());
        const order=lower.includes('item_index')?' ORDER BY item_index':'';
        const srcSql="'"+String(t).replace(/'/g,"''")+"'";
        if(lower.includes('raw_json')) r=await queryMapRows(worker,'SELECT *, '+srcSql+' AS __source_table FROM '+_qi(t)+order);
        else if(lower.includes('place_json')) r=await queryMapRows(worker,'SELECT *, '+srcSql+' AS __source_table FROM '+_qi(t)+order);
        else if(lower.includes('data_json')) r=await queryMapRows(worker,'SELECT *, '+srcSql+' AS __source_table FROM '+_qi(t)+order);
        else if(lower.includes('json')) r=await queryMapRows(worker,'SELECT *, '+srcSql+' AS __source_table FROM '+_qi(t)+order);
        else r=await queryMapRows(worker,'SELECT *, '+srcSql+' AS __source_table FROM '+_qi(t)+order);
        if(Array.isArray(r)&&r.length) rows=rows.concat(r);
      }catch(e){}
    }
    const arr=[];
    for(const r of rows||[]){const p=rowToPlace(r);if(p&&typeof p==='object')arr.push(p);}
    window.PLACES=arr;
    return true;
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
    if(_isSqliteName(file)){try{return await loadPlacesSqliteFile(file);}catch(e){try{console.warn('[osm] sqlite map load failed',file,e);}catch(_){} return false;}}
    const isUrl=/^(https?:)?\/\//i.test(file)||/^data:/i.test(file);
    if(!isUrl){
      try{await loadScript(file);return true;}catch(e){}
      try{
        if(typeof window.getSettingScriptUrl==='function'){
          const u=window.getSettingScriptUrl(file);
          if(u){await loadScript(u);return true;}
        }
      }catch(e){}
      return false;
    }
    try{await loadScript(file);return true;}catch(e){}
    return false;
  }
  async function ensurePlaces(){
    if(window.__OSM_PLACES_READY) return;
    const files=mapDataFilesFromSettings();
    const df=getDataFile();
    if(!files.length && df) files.push(_isSqliteName(df)?_mapSqliteName(df):df);
    if(!files.length) files.push('map.sqlite');
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
      try{window.PLACES=null;}catch(e){}
      const ok=await loadPlacesFile(f);
      if(ok && Array.isArray(window.PLACES)) datasets[f]=window.PLACES.slice();
      else datasets[f]=[];
    }
    const merged=[];
    for(const f of files){
      const arr=datasets[f]||[];
      for(const p of arr){
        if(!p||typeof p!=='object') continue;
        const cp=Object.assign({},p);
        if(!cp.__src) cp.__src=f;
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
    return rows?`<div class=\"osm-popup osm-feed-block\"><div class=\"osm-feed-list\">${rows}</div></div>`:'';
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
    el.innerHTML='<div class="osm-feed-modal-card" role="dialog" aria-modal="true"><div class="osm-feed-modal-top"><div class="osm-feed-modal-topbar"><div class="osm-feed-modal-brand"><i class="uil uil-location-point"></i><span>貼文</span></div><button type="button" class="osm-feed-modal-close" aria-label="Close">×</button></div></div><div class="osm-feed-modal-bodywrap"></div></div>';
    const close=()=>{
      try{el.classList.remove('open');}catch(e){}
      try{document.body.classList.remove('osm-feed-modal-open');}catch(e){}
      try{el._groupCtx=null;}catch(e){}
    };
    el.addEventListener('click',e=>{if(e.target===el) close();});
    const btn=el.querySelector('.osm-feed-modal-close');
    if(btn) btn.addEventListener('click',close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&el.classList.contains('open')) close();});
    el.__close=close;
    document.body.appendChild(el);
    return el;
  }

  function _safeUilName(s){
    s=String(s||'').trim();
    if(!s) return 'uil-location-point';
    s=s.replace(/^uil\s+/,'').replace(/[\s]+/g,'-').replace(/[^a-z0-9\-]/gi,'');
    return s||'uil-location-point';
  }
  function _setOsmFeedModalBrand(modal,opt){
    if(!modal) return;
    const brand=modal.querySelector('.osm-feed-modal-brand');
    if(!brand) return;
    opt=opt||{};
    const icon=_safeUilName(opt.icon||'uil-location-point');
    const name=String(opt.name||'').trim();
    const addr=String(opt.address||'').trim();
    const label=String(opt.label||'貼文').trim()||'貼文';
    if(name||addr){
      brand.innerHTML=`<i class="uil ${icon}"></i><div class="osm-feed-modal-brandtext"><div class="osm-popup-title">${esc(name||label)}</div>${addr?`<div class="osm-popup-meta"><b>地址</b> ${esc(addr)}</div>`:''}</div>`;
      return;
    }
    brand.innerHTML=`<i class="uil ${icon}"></i><span>${esc(label)}</span>`;
  }
  function _feedMetaTsNum(m){
    const t=String(m&&m.ts||'').trim();
    const n=Number(t);
    if(isFinite(n)) return n;
    const m2=t.match(/\d{8,}/);
    return m2?Number(m2[0]):0;
  }
  function _sortFeedMetasDesc(arr){
    const a=Array.isArray(arr)?arr.slice():[];
    a.sort((x,y)=>{
      const nx=_feedMetaTsNum(x);
      const ny=_feedMetaTsNum(y);
      if(nx&&ny&&nx!==ny) return ny-nx;
      const sx=String(x&&x.ts||'');
      const sy=String(y&&y.ts||'');
      return sy.localeCompare(sx);
    });
    return a;
  }
  function _renderOsmFeedGroupInModal(modal){
    const ctx=modal&&modal._groupCtx;
    if(!ctx) return;
    const wrap=modal.querySelector('.osm-feed-modal-bodywrap');
    if(!wrap) return;
    const metas=_sortFeedMetasDesc(ctx.metas||[]);
    const placeName=String(ctx.place&&ctx.place.name||'').trim();
    const placeAddr=String(ctx.place&&ctx.place.address||'').trim();
    _setOsmFeedModalBrand(modal,{icon:'uil-location-point',name:placeName,address:placeAddr,label:'貼文'});
    const rows=metas.slice(0,80).map(meta=>{
      const ts=String(meta&&meta.ts||'').trim();
      if(!ts) return '';
      const f=findFeedByTs(ts);
      const title=feedDisplayTitle(meta,f);
      const sn=f?feedDisplaySnippet(f):'';
      const user=String(f&&f.user||meta&&meta.user||'').trim();
      const dt=String(f&&f.datetime||'').trim();
      const sub=[user,dt].filter(Boolean).join(' • ');
      const av=String(f&&f.avatar||meta&&meta.avatar||'').trim();
      const avatar=av?`<button type="button" class="osm-popup-avatar" data-ts="${esc(ts)}"><img src="${esc(av)}" alt=""></button>`:`<button type="button" class="osm-popup-avatar" data-ts="${esc(ts)}"></button>`;
      return `<div class="osm-feed-row" data-ts="${esc(ts)}">${avatar}<div class="osm-feed-text"><div class="osm-feed-title">${esc(title)}</div>${sub?`<div class=\"osm-feed-sub\">${esc(sub)}</div>`:''}${sn?`<div class=\"osm-feed-sn\">${esc(sn)}</div>`:''}</div></div>`;
    }).filter(Boolean).join('');
    const feedBlock=rows?`<div class="osm-popup osm-feed-block"><div class="osm-feed-list">${rows}</div></div>`:'';
    wrap.innerHTML=`<div class="osm-popup-stack">${feedBlock||'<div class="osm-popup"><div class="osm-popup-meta">沒有貼文</div></div>'}</div>`;
    wrap.onclick=e=>{
      const row=e.target.closest('.osm-feed-row');
      if(row&&row.dataset.ts){e.preventDefault();e.stopPropagation();openOsmFeedModalByTs(row.dataset.ts||'');return;}
      const btn=e.target.closest('.osm-popup-avatar');
      if(btn&&btn.dataset.ts){e.preventDefault();e.stopPropagation();openOsmFeedModalByTs(btn.dataset.ts||'');return;}
    };
  }
  function openOsmFeedGroupModal(metas,name,address){
    const arr=_sortFeedMetasDesc(metas||[]);
    if(!arr.length){flash('沒有貼文');return;}
    const modal=_ensureOsmFeedModal();
    modal._groupCtx={metas:arr,place:{name:String(name||'').trim(),address:String(address||'').trim()}};
    _renderOsmFeedGroupInModal(modal);
    try{modal.classList.add('open');}catch(e){}
    try{document.body.classList.add('osm-feed-modal-open');}catch(e){}
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
    const ctx=modal&&modal._groupCtx;
    const ctxName=ctx&&ctx.place?String(ctx.place.name||'').trim():'';
    const ctxAddr=ctx&&ctx.place?String(ctx.place.address||'').trim():'';
    const brandName=String((f.geo&&f.geo.name)||'').trim()||ctxName;
    const brandAddr=String((f.geo&&f.geo.address)||'').trim()||ctxAddr;
    _setOsmFeedModalBrand(modal,brandName||brandAddr?{icon:'uil-location-point',name:brandName,address:brandAddr,label:'貼文'}:{icon:'uil-file-alt',label:(String(f.user||'').trim()||'貼文')});
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
    const hasGroup=!!(modal&&modal._groupCtx&&Array.isArray(modal._groupCtx.metas)&&modal._groupCtx.metas.length);
    const backBtn=hasGroup?`<div class="osm-feed-modal-actions"><button type="button" class="osm-feed-back">← 返回列表</button></div>`:'';
    wrap.innerHTML=backBtn+head+titleBlock+captionBlock+imgBlock;
    wrap.onclick=e=>{
      const back=e.target.closest('.osm-feed-back');
      if(back&&modal&&modal._groupCtx){
        e.preventDefault();
        e.stopPropagation();
        _renderOsmFeedGroupInModal(modal);
        return;
      }
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

  function splitMapUrls(v){
    if(Array.isArray(v)) return v.map(x=>String(x||'').trim()).filter(Boolean);
    const s=String(v||'').trim();
    if(!s) return [];
    return s.split(/[\n|]+/).map(x=>String(x||'').trim()).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i);
  }
  function mapRefLinks(p){
    const arr=splitMapUrls(p&&p.urls);
    if(!arr.length) return '';
    return arr.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener">${arr.length>1?'參考資料'+(i+1):'參考資料'}</a>`).join('');
  }
  function buildPopup(p,idx,showSrc){
    const nm=esc(p.name||'');
    const cat=esc(p.cat||'');
    const addr=esc(p.address||'');
    const phone=String(p.phone||'').trim();
    const offerHtml=linkify(p.offer||'');
    const refBtns=mapRefLinks(p);
    const g=googleLink(p.name||'',p.address||'');
    const tel=phone?`<a href="tel:${esc(phone)}" target="_blank" rel="noopener">電話</a>`:'';
    const addrBtn=addr?`<a href="${g}" target="_blank" rel="noopener">導航</a>`:'';
    const src=showSrc?esc(String(p.__src||'')):'';
    const items=[cat?`<div class="osm-popup-meta"><b>分類</b> ${cat}</div>`:'',addr?`<div class="osm-popup-meta"><b>地址</b> ${addr}</div>`:'',phone?`<div class="osm-popup-meta"><b>電話</b> ${esc(phone)}</div>`:''].filter(Boolean).join('');
    const offerBlock=(offerHtml||refBtns)?`<div class="osm-popup-offer"><div class="caption">${[offerHtml,refBtns].filter(Boolean).join(' ')}</div></div>`:'';
    const actions=`<div class="osm-popup-actions"><div class="caption">${[addrBtn,tel].filter(Boolean).join('')}</div><div class="osm-popup-feeds"></div></div>`;
    const cls=['osm-popup'];
    const n=Math.max(0,Number(idx||0));
    if(n) cls.push('osm-popup'+n);
    const srcSlug=String(p.__src||'').trim().toLowerCase().replace(/\.(js|json|sqlite|db|sqlite3)$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
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
  function _osmAllFlatPlaces(){
    const today=ymdToday();
    return flattenPlaces(Array.isArray(window.PLACES)?window.PLACES:[]).filter(p=>!isExpired(p,today));
  }
  function _osmAdText(p){
    if(!p) return '';
    const parts=[];
    const adv=String(p.offer_adv||p.offerAdv||'').trim();
    const offer=String(p.offer||'').trim();
    const price=String(p.offer_price||p.offerPrice||p.offer_price_text||'').trim();
    if(adv) parts.push(adv);
    if(offer&&offer!==adv) parts.push(offer);
    if(price&&price!==adv&&price!==offer) parts.push(price);
    if((p.isGomaji||String(p.GomajiIDURL||'').trim())&&!/Gomaji|6DA78|\$120/.test(parts.join('\n'))) parts.push(GOMAJI_TEXT);
    if(!parts.length){
      const fallback=[p.name,p.cat,p.address].map(x=>String(x||'').trim()).filter(Boolean).join(' · ');
      if(fallback) parts.push(fallback);
    }
    return parts.join('\n').trim();
  }
  function _osmAdvPlaces(){
    return _osmAllFlatPlaces().filter(p=>_osmAdText(p));
  }
  function _haversineKm(a,b,c,d){
    a=Number(a);b=Number(b);c=Number(c);d=Number(d);
    if(!isFinite(a)||!isFinite(b)||!isFinite(c)||!isFinite(d)) return Infinity;
    const R=6371;
    const toRad=x=>x*Math.PI/180;
    const da=toRad(c-a),db=toRad(d-b);
    const x=Math.sin(da/2)*Math.sin(da/2)+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(db/2)*Math.sin(db/2);
    return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
  }
  function _offerForList(p){
    if(p&&(p.isGomaji||String(p.GomajiIDURL||'').trim())) return GOMAJI_TEXT;
    return clampPlainText(String(p&&p.offer||'').trim()||String(p&&p.offer_adv||'').trim(),160);
  }
  function _rowsForOfferList(){
    const c=defaultCenter();
    const rows=_osmAllFlatPlaces().filter(p=>String(p.offer||'').trim()||String(p.offer_adv||'').trim()||p.isGomaji||String(p.GomajiIDURL||'').trim()).map(p=>{
      const d=_haversineKm(c[0],c[1],p.lat,p.lon);
      return Object.assign({},p,{__distKm:d});
    });
    rows.sort((a,b)=>{
      const da=isFinite(a.__distKm)?a.__distKm:1e12;
      const db=isFinite(b.__distKm)?b.__distKm:1e12;
      if(da!==db) return da-db;
      return String(a.name||'').localeCompare(String(b.name||''),'zh-Hant');
    });
    return rows;
  }
  function _ensureOsmListModal(){
    let el=document.getElementById('osmListModal');
    if(el) return el;
    el=document.createElement('div');
    el.id='osmListModal';
    el.className='osm-list-modal';
    el.innerHTML='<div class="osm-list-card" role="dialog" aria-modal="true"><div class="osm-list-top"><div class="osm-list-title"><i class="uil uil-list-ul"></i><span>優惠清單</span></div><button type="button" class="osm-list-close" aria-label="Close">×</button></div><div class="osm-list-body"></div></div>';
    const close=()=>{try{el.classList.remove('open');document.body.classList.remove('osm-list-modal-open');}catch(e){}};
    el.addEventListener('click',e=>{if(e.target===el) close();});
    const btn=el.querySelector('.osm-list-close');
    if(btn) btn.addEventListener('click',close);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&el.classList.contains('open')) close();});
    el.__close=close;
    document.body.appendChild(el);
    return el;
  }
  function openOsmOfferList(){
    const modal=_ensureOsmListModal();
    const body=modal.querySelector('.osm-list-body');
    const rows=_rowsForOfferList();
    modal._osmRows=rows;
    if(!body) return;
    const html=rows.map((p,i)=>{
      const d=isFinite(p.__distKm)?(p.__distKm<10?p.__distKm.toFixed(1):Math.round(p.__distKm).toString())+' km':'—';
      const ref=mapRefLinks(p)||'';
      const mapBtn=_validLL(p.lat,p.lon)?`<button type="button" data-osm-list-map="${i}"><i class="uil uil-location-point"></i> 地圖</button>`:'—';
      return `<tr><td>${esc(d)}</td><td><div class="osm-list-name">${esc(p.name||'')}</div></td><td>${esc(p.cat||'')}</td><td class="osm-list-offer">${esc(_offerForList(p))}</td><td>${ref||'—'}</td><td>${mapBtn}</td></tr>`;
    }).join('');
    body.innerHTML=html?`<table class="osm-list-table"><thead><tr><th>距離</th><th>名稱</th><th>類別</th><th>優惠</th><th>參考</th><th>地圖</th></tr></thead><tbody>${html}</tbody></table>`:'<div class="osm-popup"><div class="osm-popup-meta">沒有優惠資料</div></div>';
    body.onclick=e=>{
      const b=e.target.closest('[data-osm-list-map]');
      if(!b) return;
      e.preventDefault();e.stopPropagation();
      const p=modal._osmRows&&modal._osmRows[Number(b.dataset.osmListMap)];
      if(p) {
        try{modal.__close&&modal.__close();}catch(_e){}
        focusOsmPlacePayload(p,{fullscreen:true,openPopup:true});
      }
    };
    try{modal.classList.add('open');document.body.classList.add('osm-list-modal-open');}catch(e){}
  }
  function focusOsmPlacePayload(place,opt){
    opt=opt||{};
    const payload={lat:Number(place&&place.lat),lon:Number(place&&place.lon),name:String(place&&place.name||''),address:String(place&&place.address||'')};
    if(!isFinite(payload.lat)||!isFinite(payload.lon)){flash('沒有座標');return;}
    const panel=document.getElementById('app_map');
    if(!panel||!panel._osmMap){
      Promise.resolve(window.initOsmDiscountMap&&window.initOsmDiscountMap()).then(()=>setTimeout(()=>{try{window.osmFocusPlace&&window.osmFocusPlace(payload,opt);}catch(e){}},80));
      return;
    }
    try{window.osmFocusPlace&&window.osmFocusPlace(payload,opt);}catch(e){}
  }
  window.getOsmAdvertPlaces=function(){try{return _osmAdvPlaces();}catch(e){return[]}};
  window.getOsmOfferRows=function(){try{return _rowsForOfferList();}catch(e){return[]}};
  window.openOsmOfferList=function(){try{openOsmOfferList();}catch(e){}};

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
    let userDot=null,userAcc=null;
    function locateMe(){
      const btn=document.getElementById('osmMapLocateBtn');
      if(!navigator.geolocation){
        flash('瀏覽器不支援定位');
        try{map.setView(defaultCenter(),defaultZoom(),{animate:false});}catch(e){}
        return;
      }
      try{if(btn){btn.disabled=true;btn.classList.add('is-loading');}}catch(e){}
      navigator.geolocation.getCurrentPosition(pos=>{
        try{if(btn){btn.disabled=false;btn.classList.remove('is-loading');}}catch(e){}
        const lat=Number(pos&&pos.coords&&pos.coords.latitude);
        const lon=Number(pos&&pos.coords&&pos.coords.longitude);
        const acc=Number(pos&&pos.coords&&pos.coords.accuracy);
        if(!isFinite(lat)||!isFinite(lon)){
          flash('定位失敗');
          return;
        }
        try{if(userDot) userDot.setLatLng([lat,lon]); else userDot=L.circleMarker([lat,lon],{radius:8,weight:2,fillOpacity:.25}).addTo(feedGroup);}catch(e){}
        if(isFinite(acc)&&acc>0){
          try{if(userAcc) userAcc.setLatLng([lat,lon]).setRadius(acc); else userAcc=L.circle([lat,lon],{radius:acc,weight:1,fillOpacity:.05}).addTo(feedGroup);}catch(e){}
        }
        const z=Math.min(19,Math.max(17,map.getZoom()||17));
        try{map.setView([lat,lon],z,{animate:true});}catch(e){}
      },err=>{
        try{if(btn){btn.disabled=false;btn.classList.remove('is-loading');}}catch(e){}
        flash('定位失敗');
      },{enableHighAccuracy:true,timeout:8000,maximumAge:30000});
    }
    const locateBtn=document.getElementById('osmMapLocateBtn');
    if(locateBtn&&locateBtn.dataset.osmBound!=='1'){
      locateBtn.dataset.osmBound='1';
      locateBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();locateMe();});
    }

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
    const markerByCoord=new Map();
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
    const buildAvatarBtn=(meta,count)=>{
      const ts=String(meta&&meta.ts||'').trim();
      if(!ts) return '';
      const av=String(meta&&meta.avatar||'').trim();
      const user=String(meta&&meta.user||'').trim();
      const img=av?`<img src="${esc(av)}" alt="">`:'';
      const ttl=user?` title="${esc(user)}"`:'';
      const n=Math.max(0,Number(count||0)||0);
      const label=n>99?'99+':String(n||'');
      const pill=n>1?`<span class="osm-popup-feedcount"><b>${esc(label)}</b></span>`:'';
      return `<button type="button" class="osm-popup-avatar" data-ts="${esc(ts)}"${ttl}>${img}</button>${pill}`;
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
      markerByCoord.set(k,m);
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
            const sorted=_sortFeedMetasDesc(matched);
            const latest=sorted[0];
            const html=latest?buildAvatarBtn(latest,sorted.length):'';
            box.innerHTML=html;
            box.onclick=e=>{
              const hit=e.target.closest('.osm-popup-avatar')||e.target.closest('.osm-popup-feedcount');
              if(!hit) return;
              e.preventDefault();
              e.stopPropagation();
              openOsmFeedGroupModal(sorted,nm,addr);
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
    function _coordKeyFromPayload(p){
      const lat=Number(p&&p.lat),lon=Number(p&&p.lon);
      if(!isFinite(lat)||!isFinite(lon)) return '';
      return lat.toFixed(6)+','+lon.toFixed(6);
    }
    window.osmFocusPlace=function(place,opt){
      opt=opt||{};
      const lat=Number(place&&place.lat),lon=Number(place&&place.lon);
      if(!isFinite(lat)||!isFinite(lon)){flash('沒有座標');return;}
      const wantFs=opt.fullscreen!==false;
      if(wantFs&&!panel.classList.contains('osm-fullscreen')) enterFullscreen();
      const z=Math.min(19,Math.max(defaultZoom()+2,17));
      const run=()=>{
        try{map.invalidateSize();}catch(e){}
        try{map.setView([lat,lon],z,{animate:true});}catch(e){}
        if(opt.openPopup!==false){
          const mk=markerByCoord.get(_coordKeyFromPayload({lat,lon}));
          try{if(mk) mk.openPopup();}catch(e){}
        }
      };
      setTimeout(run,wantFs?150:40);
    };
    if(fsBtn){
      fsBtn.addEventListener('click',()=>{
        const on=panel.classList.contains('osm-fullscreen');
        if(on) exitFullscreen(); else enterFullscreen();
      });
    }
    const listBtn=document.getElementById('osmListBtn');
    if(listBtn&&listBtn.dataset.osmBound!=='1'){
      listBtn.dataset.osmBound='1';
      listBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openOsmOfferList();});
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
    try{injectCss();}catch(e){}
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
    relay(document.getElementById('osmListBtn'));
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
  function setupOsmGlobalButtons(){
    if(window.__OSM_GLOBAL_BUTTONS_BOUND__) return;
    window.__OSM_GLOBAL_BUTTONS_BOUND__=1;
    document.addEventListener('click',e=>{
      const focus=e.target.closest('[data-action="osm-focus"],.osm-map-focus-btn');
      if(focus){
        e.preventDefault();e.stopPropagation();
        const payload={lat:Number(focus.dataset.lat),lon:Number(focus.dataset.lon),name:String(focus.dataset.name||''),address:String(focus.dataset.address||'')};
        Promise.resolve(window.initOsmDiscountMap&&window.initOsmDiscountMap()).then(()=>setTimeout(()=>{try{window.osmFocusPlace&&window.osmFocusPlace(payload,{fullscreen:true,openPopup:true});}catch(_e){}},80));
        return;
      }
      const list=e.target.closest('#osmListBtn,.osmListBtn,[data-action="osm-list"]');
      if(list){
        e.preventDefault();e.stopPropagation();
        Promise.resolve(window.ensureOsmPlaces&&window.ensureOsmPlaces()).then(()=>{try{openOsmOfferList();}catch(_e){}});
      }
    },true);
  }
  setupOsmGlobalButtons();
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setupLazyOsm); else setupLazyOsm();
})();
