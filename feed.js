window.__FEED_JS_LOADED__=1;
(function(){try{if(typeof ADV_USERS!=='undefined'&&Array.isArray(ADV_USERS)){for(let i=0;i<ADV_USERS.length;i++){const u=ADV_USERS[i];if(u&&u.id)ADV_USERS[u.id]=u;}}}catch(e){}})();
(function(){
  function keyOf(f){
    return (f.publisherId||'')+'|'+(f.datetime||f.date||'')+'|'+((f.caption||'').slice(0,80));
  }
  function baseName(s){
    s=String(s||'');
    return s.split('/').pop().split('?')[0].split('#')[0];
  }
  if(typeof feedArray==='undefined') window.feedArray=[];
  if(typeof window.__FEED_SOURCE_MAP__!=='object' || !window.__FEED_SOURCE_MAP__) window.__FEED_SOURCE_MAP__={};
  function mergeFeeds(extra){
    if(!Array.isArray(extra)||!extra.length)return;
    var seen=new Set(feedArray.map(keyOf));
    for(var i=0;i<extra.length;i++){
      var f=extra[i],k=keyOf(f);
      if(!seen.has(k)){feedArray.push(f);seen.add(k);}
    }
  }

  if(typeof window.__FEED_IMPORT_PENDING__!=='number') window.__FEED_IMPORT_PENDING__=0;
  window.__renderAllFeedsIfReady=function(){
    if((window.__FEED_IMPORT_PENDING__||0)>0) return;
    if(window.__FEED_IMPORT_INITIAL_RENDER_DONE__) return;
    if(typeof normalizeFeedArray==='function'){
      normalizeFeedArray(feedArray);
      try{Object.keys(window.__FEED_SOURCE_MAP__||{}).forEach(k=>{const arr=window.__FEED_SOURCE_MAP__[k];if(Array.isArray(arr)) normalizeFeedArray(arr)})}catch(e){}
    }
    if(typeof renderAllFeeds==='function'){
      window.__FEED_IMPORT_INITIAL_RENDER_DONE__=true;
      renderAllFeeds();
    }
  };
  function finishOne(){
    window.__FEED_IMPORT_PENDING__=Math.max(0,(window.__FEED_IMPORT_PENDING__||0)-1);
    if(window.__FEED_IMPORT_PENDING__===0) window.__renderAllFeedsIfReady();
  }

  function importFeed(file,tag){
    window.__FEED_IMPORT_PENDING__=(window.__FEED_IMPORT_PENDING__||0)+1;

    var done=false;
    var iframe=document.createElement('iframe');
    iframe.style.display='none';
    iframe.id='feedImport'+tag;

    var src=new URL(file,location.href).href;
    var raw=getSettingScriptUrl(file);
    var primary=raw||src;
    iframe.srcdoc='<!doctype html><meta charset="utf-8">'
      + '<script>var __USED_RAW__='+(raw?'true':'false')+';</'+'script>'
      + '<script src="'+primary+'"></'+'script>'+ '<script>try{parent.postMessage({__src:"'+tag+'",feedArray:feedArray,__usedRaw:__USED_RAW__},"*")}catch(e){parent.postMessage({__src:"'+tag+'",feedArray:[],__usedRaw:__USED_RAW__,err:String(e)},"*")}</'+'script>';

    var handler=function(ev){
      if(done)return;
      if(ev.source!==iframe.contentWindow)return;
      var d=ev.data;
      if(!d||d.__src!==tag)return;
      done=true;
      window.removeEventListener('message',handler);
      try{
        var arr=Array.isArray(d.feedArray)?d.feedArray:[];
        var usedRaw=!!(d&&d.__usedRaw);
        var rawUrl=raw||'';
        var usedOverride=false;
        try{
          if(usedRaw && rawUrl && /cdn\.jsdelivr\.net/i.test(String(rawUrl||''))){
            var key='__FEED_OVERRIDE_JSON__:'+baseName(file);
            var over=localStorage.getItem(key);
            if(over){
            }
          }
        }catch(e){}
        for(var i=0;i<arr.length;i++){var f=arr[i];if(f&&typeof f==='object'&&!f.__srcFile)f.__srcFile=file;}
        window.__FEED_SOURCE_MAP__[file]=arr;
        if(typeof window.__FEED_SOURCE_META__!=='object' || !window.__FEED_SOURCE_META__) window.__FEED_SOURCE_META__={};
        window.__FEED_SOURCE_META__[file]={usedRaw:usedRaw,raw:String(rawUrl||''),usedOverride:usedOverride,at:Date.now()};
        mergeFeeds(arr);
      }finally{if(iframe&&iframe.parentNode)iframe.parentNode.removeChild(iframe);finishOne();}
    };
    window.addEventListener('message',handler);
    document.documentElement.appendChild(iframe);
    setTimeout(function(){
      if(done)return;
      done=true;
      window.removeEventListener('message',handler);
      if(iframe&&iframe.parentNode)iframe.parentNode.removeChild(iframe);
      finishOne();
    },30000);
  }
  function safeTag(file){
    return String(file||'').replace(/[^a-z0-9]/gi,'_');
  }

  function getFeedFilesFromSettings(){
    try{
      var root = (typeof settings!=='undefined' && settings && settings[0]) ? settings[0] : null;
      if(!root || !Array.isArray(root.feeds)) return [];
      var out = [];
      root.feeds.forEach(function(group){
        var scripts = group && group.script;
        if(!Array.isArray(scripts)) return;
        scripts.forEach(function(m){
          if(!m || typeof m!=='object') return;
          Object.keys(m).forEach(function(k){ out.push(k); });
        });
      });
      out = out.filter(function(v,i,a){ return a.indexOf(v)===i; });
      out = out.filter(function(k){ return /\.js$/i.test(k) && String(k).toLowerCase()!=='feed.js'; });
      return out;
    }catch(e){
      return [];
    }
  }

  var files = getFeedFilesFromSettings();
  window.__FEED_FILES__=files.slice();
  window.__DEFAULT_FEED_FILE__=files[0]||'';
  files.forEach(function(f){
    importFeed(f, safeTag(f));
  });
})();

const USER0144084 = ADV_USERS.find(u=>u.id==='User0144084');
  const USER0176454 = ADV_USERS.find(u=>u.id==='User0176454');
  const SYSTEM_NOTIFS=[{img:USER0144084.avatar,html:`<b>系統</b> 恭賀 <b>${USER0144084.name}</b> 晉升教授 <small>2025年8月1日</small>`},{img:USER0176454.avatar,html:`<b>系統</b> 恭賀 <b>${USER0176454.name}</b> 指導 <b>周鈺斌醫師</b> 榮獲學術佳作 <small>2025年8月1日</small>`}];
    let tsCounter=0,selectionMode='user',likeAvatarsSelected=[],selectedTopics=[],advCurrentUserId='User0000002',advCurrentUserName='您',advCurrentUserAvatar=(ADV_USERS['User0000002']&&ADV_USERS['User0000002'].avatar)?ADV_USERS['User0000002'].avatar:'';
  const d=document,qs=(s,p=d)=>p.querySelector(s),qsa=(s,p=d)=>[...p.querySelectorAll(s)];
  const TTS_SUPPORTED=typeof window!=='undefined'&&'speechSynthesis'in window&&'SpeechSynthesisUtterance'in window;
  let expanded=false,mainActionDefaultText='',feedEditState={active:false,item:null,srcFile:'',prevTargetFile:''};let __ADV_BOOTED__=false;function ensureAdvInit(){if(!__ADV_BOOTED__){__ADV_BOOTED__=true;try{initAdvancedEditor()}catch(e){}try{initFocusToggle()}catch(e){}try{initAdvImageManager()}catch(e){}try{initAdvUsers()}catch(e){}try{initLikeAvatarButton()}catch(e){}try{initTopics()}catch(e){}try{initPosting()}catch(e){}}try{initCompactAvatarToggle()}catch(e){}try{updateSelectedAvatarDisplay()}catch(e){}}
  function getTimestamp(a){const s=a!=null?String(a).trim():'';if(!s)return Date.now()+(tsCounter++);const b=Date.parse(s.replace(' ','T'));return isNaN(b)?Date.now()+(tsCounter++):b+(tsCounter++)}
  function initStaticImages(){qs('#avatarGuest').src=ADV_USERS['User0000002'].avatar;qs('#profileLogo').src=ADV_USERS['User0000002'].avatar;qs('#postAvatar').src=ADV_USERS['User0000003'].avatar}
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function _advUserById(uid){
    try{
      if(typeof ADV_USERS==='undefined'||!ADV_USERS) return null;
      const k=String(uid||'');
      if(!k) return null;
      if(typeof ADV_USERS==='object'&&ADV_USERS[k]&&typeof ADV_USERS[k]==='object') return ADV_USERS[k];
      if(Array.isArray(ADV_USERS)){
        const u=ADV_USERS.find(x=>x&&String(x.id||'')===k);
        if(u) return u;
        if(Object.prototype.hasOwnProperty.call(ADV_USERS,k)&&typeof ADV_USERS[k]==='object') return ADV_USERS[k];
      }
    }catch(e){}
    return null;
  }
  function _defaultAvatar(){
    try{
      if(typeof ADV_USERS!=='undefined'&&ADV_USERS){
        if(ADV_USERS['User0000002']&&ADV_USERS['User0000002'].avatar) return String(ADV_USERS['User0000002'].avatar);
        if(Array.isArray(ADV_USERS)&&ADV_USERS.length&&ADV_USERS[0]&&ADV_USERS[0].avatar) return String(ADV_USERS[0].avatar);
      }
    }catch(e){}
    return '';
  }
  function _dateFromDatetime(dt){
    dt=String(dt||'').trim();
    if(!dt) return '';
    return dt.split(' ')[0]||dt;
  }
  function normalizeFeedArray(arr){
    if(!Array.isArray(arr)) return;
    const defAv=_defaultAvatar();
    arr.forEach(f=>{
      if(!f||typeof f!=='object') return;
      const pid=f.publisherId!=null?String(f.publisherId):'';
      if(!f.user||typeof f.user!=='string'||!f.user.trim()){
        const u=_advUserById(pid);
        f.user=(u&&u.name)?String(u.name):(pid||'您');
      }
      if(!f.avatar||typeof f.avatar!=='string'||!f.avatar.trim()){
        const u=_advUserById(pid);
        f.avatar=(u&&u.avatar)?String(u.avatar):(defAv||'');
      }
      if(!(typeof f.ts==='number'&&isFinite(f.ts))){
        const dt=f.datetime!=null?String(f.datetime):'';
        f.ts=getTimestamp(dt||null);
      }
      if(!f.date||typeof f.date!=='string'||!f.date.trim()){
        const dt=f.datetime!=null?String(f.datetime):'';
        f.date=dt?_dateFromDatetime(dt):(isFinite(f.ts)?new Date(f.ts).toISOString().slice(0,10):'剛剛');
      }
      if(!Array.isArray(f.likeName)) f.likeName=[];
      if(!Array.isArray(f.likeAvatars)) f.likeAvatars=[];
      if(Array.isArray(f.likeList)&&f.likeList.length&&(f.likeName.length===0||f.likeAvatars.length===0)){
        const n=[],a=[];
        f.likeList.forEach(x=>{
          if(!x) return;
          const uid=x.userId!=null?String(x.userId):'';
          if(!uid) return;
          const u=_advUserById(uid);
          n.push((u&&u.name)?String(u.name):uid);
          a.push((u&&u.avatar)?String(u.avatar):(defAv||''));
        });
        if(!f.likeName.length) f.likeName=n;
        if(!f.likeAvatars.length) f.likeAvatars=a;
      }
      if(typeof f.likes!=='number'||!isFinite(f.likes)) f.likes=Array.isArray(f.likeName)?f.likeName.length:0;
      if(!Array.isArray(f.commentList)) f.commentList=[];
      else f.commentList=f.commentList.map(c=>{
        if(c==null) return null;
        if(typeof c==='string') return {userId:pid,datetime:String(f.datetime||''),text:c};
        if(typeof c!=='object') return null;
        const uid=c.userId!=null?String(c.userId):'';
        const dt=c.datetime!=null?String(c.datetime):'';
        const tx=c.text!=null?String(c.text):'';
        return {userId:uid||pid,datetime:dt||String(f.datetime||''),text:tx};
      }).filter(Boolean);
      if(typeof f.shares!=='number'||!isFinite(f.shares)) f.shares=0;
      if(!Array.isArray(f.topics)) f.topics=[];
    });
    const seenTs=new Map();
    arr.forEach(f=>{
      if(!f||typeof f!=='object') return;
      const t=Number(f.ts);
      if(!isFinite(t)) return;
      const n=seenTs.get(t)||0;
      if(n>0) f.ts=t+n;
      seenTs.set(t,n+1);
    });
  }

  const IMG_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';


  const CAPTION_IMG_PRELOAD_LIMIT = 3;
const RAW_GH_BASE = "https://raw.githubusercontent.com/cchfm/website/";
function _toRepoPathFromUrl(u){
  try{
    const url = new URL(u, location.href);
    if(url.protocol==="data:" || url.protocol==="blob:") return null;
    if(String(url.href).startsWith(RAW_GH_BASE)) return null;
    if(/^https?:$/.test(url.protocol) && url.origin !== location.origin) return null;
    let p = url.pathname.replace(/^\/+/, "");
    if(p.startsWith("website/")) p = p.slice("website/".length);
    return p || null;
  }catch(e){
    if(!u) return null;
    let p = String(u).replace(/^\/+/, "");
    if(p.startsWith("website/")) p = p.slice("website/".length);
    return p || null;
  }
}
function _trySetRawFallbackForImg(img){
  if(!(img instanceof HTMLImageElement)) return;
  const src = img.getAttribute("src") || "";
  if(!src) return;
  if(img.dataset.__rawFallback==="done") return;
  const p = _toRepoPathFromUrl(src);
  if(!p) return;
  img.dataset.__rawFallback="done";
  img.src = RAW_GH_BASE + encodeURI(p);
}
document.addEventListener("error", (e)=>{
  const t = e.target;
  if(t && t.tagName==="IMG"){
    _trySetRawFallbackForImg(t);
  }
}, true);

function _ensureLightbox(){
  let lb = document.getElementById("imgLightbox");
  if(lb) return lb;
  lb = document.createElement("div");
  lb.id = "imgLightbox";
  lb.className = "img-lightbox";
  lb.innerHTML = '<button type="button" aria-label="Close">×</button><img alt="">';
  const close = ()=>{ lb.classList.remove("open"); document.body.style.overflow=""; };
  lb.addEventListener("click", (e)=>{
    if(e.target===lb || e.target.tagName==="BUTTON") close();
  });
  document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") close(); });
  document.body.appendChild(lb);
  lb.__close = close;
  return lb;
}
function openImageLightbox(src, alt){
  if(!src) return;
  const lb = _ensureLightbox();
  const img = lb.querySelector("img");
  img.alt = alt || "";
  img.src = src;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
}

  const FEED_BATCH_SIZE = 20;
  let feedRenderIndex = 0;
  let feedInfiniteObserver = null;
  let lazyImgObserver = null;

  function loadLazyImage(img){
    if(!img) return;
    const src = img.getAttribute('data-src');
    if(!src) return;
    img.src = src;
    img.removeAttribute('data-src');
    img.dataset.loaded = '1';
  }
  function initLazyImages(root){
    const scope = (root && root.querySelectorAll) ? root : document;
    const imgs = scope.querySelectorAll('img[data-src]:not([data-defer="1"])');
    if(!imgs.length) return;
    if(!('IntersectionObserver' in window)){
      imgs.forEach(loadLazyImage);
      return;
    }
    if(!lazyImgObserver){
      lazyImgObserver = new IntersectionObserver(entries=>{
        entries.forEach(en=>{
          if(en.isIntersecting){
            loadLazyImage(en.target);
            lazyImgObserver.unobserve(en.target);
          }
        });
      },{root:null,rootMargin:'300px 0px',threshold:0.01});
    }
    imgs.forEach(img=>{
      if(img.dataset.lazyBound==='1') return;
      img.dataset.lazyBound='1';
      lazyImgObserver.observe(img);
    });
  }


  function eagerLoadDeferredCaptionImages(container){
    if(!container || !container.querySelectorAll) return;
    const imgs=[...container.querySelectorAll('img[data-src][data-defer="1"]')];
    if(!imgs.length) return;
    imgs.forEach(img=>img.removeAttribute('data-defer'));
    let i=0;
    const step=()=>{
      if(i>=imgs.length) return;
      loadLazyImage(imgs[i++]);
      setTimeout(step, 60);
    };
    step();
  }

  function ensureFeedSentinel(){
    let s = qs('#feedSentinel');
    if(!s){
      s = document.createElement('div');
      s.id = 'feedSentinel';
      s.className = 'feed-sentinel';
      s.style.display = 'none';
      s.innerHTML = '<span class="spinner" aria-hidden="true"></span><span class="text">載入更多…</span>';
      const anchor = qs('#newPosts');
      if(anchor) anchor.insertAdjacentElement('afterend', s);
      else document.body.appendChild(s);
    }
    return s;
  }
  function setSentinelVisible(v){
    const s = ensureFeedSentinel();
    s.style.display = v ? 'flex' : 'none';
  }
  function advUserById(id){
    if(!id) return null;
    try{
      if(typeof ADV_USERS!=='undefined' && ADV_USERS && ADV_USERS[id]) return ADV_USERS[id];
      if(typeof ADV_USERS!=='undefined' && Array.isArray(ADV_USERS)) return ADV_USERS.find(u=>u.id===id) || null;
    }catch(e){}
    return null;
  }
  function renderCommentItem(c){
    if(typeof c==='string'){
      return `<div class="comment-item"><div class="comment-body"><div class="comment-text">${esc(c)}</div></div></div>`;
    }
    if(!c || typeof c!=='object') return '';
    const uid=c.userId||c.uid||c.id||'';
    const u=advUserById(uid)||{name:'匿名者',avatar:ADV_USERS['User0000002'].avatar};
    const text=c.text||c.content||c.msg||'';
    return `<div class="comment-item"><img src="${esc(u.avatar)}" alt=""><div class="comment-body"><div class="comment-name">${esc(u.name)}</div><div class="comment-text">${esc(text)}</div></div></div>`;
  }

  const TOPIC_META=(()=>{const m={};TOPIC_GROUPS.forEach(g=>{m[g.id]={id:g.id,name:g.name,color:g.color||'#0ea5e9'};});return m;})();
  function parseTopicKey(k){const s=String(k||'');const parts=s.split('::');if(parts.length<2)return{gid:'',topic:s};return{gid:parts[0],topic:parts.slice(1).join('::')}}
  function topicLabel(k){const p=parseTopicKey(k);const meta=TOPIC_META[p.gid];const main=meta?meta.name:(p.gid||'分類');const sub=p.topic||'全部';return main+' · '+sub}
  function topicColor(k){const p=parseTopicKey(k);const meta=TOPIC_META[p.gid];return meta?meta.color:''}
  let activeTopicKey='',activeSearchQuery='',activeBookmarkOnly=false;
  function buildExpandableCaption(html,maxChars=160){
    const temp=document.createElement('div');
    temp.innerHTML=html||'';
    const fullText=(temp.textContent||'').trim();
    if(fullText.length<=maxChars){
      return{html,truncated:false,fullText};
    }
    const previewText=fullText.slice(0,maxChars)+'…';
    const previewHtml=`<span class="caption-preview">${esc(previewText)}</span>`;
    const moreBtn=`<button type="button" class="caption-more btn btn-outline" data-action="expand-caption">顯示更多</button>`;
    return{html:previewHtml+' '+moreBtn,truncated:true,fullText};
  }
  const buildStory=s=>s.type==='video'?`<div class="story" data-link="${U.YT_EMBED(s.yt)}"><iframe src="${U.YT_EMBED(s.yt)}"></iframe><div class="avatar-mini"><img src="${s.avatar||ADV_USERS['User0000002'].avatar}" alt=""></div><p>${esc(s.title)}</p></div>`:`<div class="story" data-link="${esc(s.link)}"><img class="bg" src="${esc(s.img)}" alt=""><div class="avatar-mini"><img src="${s.avatar||ADV_USERS['User0000002'].avatar}" alt=""></div><p>${esc(s.title)}</p></div>`;
  function renderStories(){qs('#stories').innerHTML=STORIES.map(buildStory).join('')}
  function buildLink(i){const p=/未完成/.test(i.desc),iconUrl=U.ICON_URL(i.icon),click=i.url?`onclick="window.open('${esc(i.url)}','_blank')"`:'';return`<div class="link-item" data-title="${esc(i.title)}" data-desc="${esc(i.desc)}" ${click}><div class="link-icon"><img src="${iconUrl}" alt=""></div><div class="link-body"><h5>${esc(i.title)}</h5><p class="${p?'pending':''}">${esc(i.desc)}</p></div></div>`}
  function renderCategories(){qs('#quick-categories').innerHTML=Object.keys(QUICK_LINKS).map((c,i)=>`<button data-cat="${esc(c)}" class="${i===0?'active':''}">${esc(c)}</button>`).join('')}
  function renderLinks(c){qs('#links-container').innerHTML=(QUICK_LINKS[c]||[]).map(buildLink).join('')||'<p style="font-size:.75rem;color:var(--c-text-soft);padding:.5rem;">無資料</p>'}
  function normalizeYtConstants(){feedArray.forEach(f=>{if(typeof f.yt==='string'){const s=f.yt.trim();if(/^yt:\s*U\.ELEARNING$/i.test(s)||s==='U.ELEARNING'||s===U.ELEARNING||s.startsWith(U.ELEARNING)||s.includes(U.ELEARNING)){f.yt='U.ELEARNING'}}if(typeof f.shares!=='number')f.shares=0;if(!Array.isArray(f.commentList))f.commentList=[];if(!Array.isArray(f.likeAvatars))f.likeAvatars=[];if(!Array.isArray(f.likeName))f.likeName=[];if(typeof f.likes!=='number')f.likes=f.likeName.length})}
  function normalizeCaptionMedia(html){
    const temp=document.createElement('div');
    temp.innerHTML=html||'';
    const imgs=temp.querySelectorAll('img');
    const imgList=[];
    imgs.forEach(img=>{
      if(img.closest('.post-images, .caption-slideshow')) return;
      const src=img.getAttribute('src');
      const alt=img.getAttribute('alt')||'';
      if(src) imgList.push({src,alt});
      img.remove();
    });
    const captionHtml=temp.innerHTML.trim();
    const mkImg=(src,alt,idx)=>{const defer=(typeof idx==='number'&&idx>=CAPTION_IMG_PRELOAD_LIMIT)?' data-defer="1"':'';return`<img class="lazy-img" loading="lazy" src="${IMG_PLACEHOLDER}" data-src="${esc(src)}"${defer} alt="${esc(alt)}">`;};
    let imagesHtml='';
    if(imgList.length===1){
      const img=imgList[0];
      imagesHtml=`<div class="post-images">`+mkImg(img.src,img.alt,0)+`</div>`;
    }else if(imgList.length>1){
      const effects=['effect-soft-zoom','effect-tilt-glow','effect-film','effect-glass','effect-fade-fog','effect-slide-x','effect-slide-y'];
      const slides=imgList.map((img,idx)=>{
        const effect=effects[idx%effects.length];
        return`<div class="slide ${effect}">`+mkImg(img.src,img.alt,idx)+`</div>`;
      }).join('');
      imagesHtml=`<div class="caption-slideshow">${slides}</div>`;
    }
    return{captionHtml,imagesHtml};
  }
  function updateCaptionSlideshowHeight(slideshow) { if (window.matchMedia('(min-width: 600px)').matches) { slideshow.style.height = ''; return; } const slides = [...slideshow.querySelectorAll('.slide')]; if (!slides.length) return; const originalActive = slides.find(sl => sl.classList.contains('active')) || slides[0]; let maxH = 0; slides.forEach(slide => { const wasActive = slide.classList.contains('active'); if (!wasActive) slide.classList.add('active'); const h = slide.offsetHeight; if (h > maxH) maxH = h; if (!wasActive) slide.classList.remove('active'); }); if (maxH > 0) slideshow.style.height = maxH + 'px'; slides.forEach(slide => { slide.classList.toggle('active', slide === originalActive); }); }
  function initCaptionSlideshows(root){
    const scope=(root&&root.querySelectorAll)?root:document;
    const isWideNow=()=>window.matchMedia('(min-width: 600px)').matches;

    scope.querySelectorAll('.caption-slideshow').forEach(s=>{
      if(s.dataset.slideshowInit==='1') return;
      s.dataset.slideshowInit='1';

      const slides=[...s.querySelectorAll('.slide')];
      if(!slides.length) return;

      let i=0;
      let lastWide=isWideNow();

      const show=n=>{
        slides.forEach((sl,idx)=>{sl.classList.toggle('active',idx===n)});
        const activeImg=slides[n]?.querySelector('img[data-src]');
        if(activeImg) loadLazyImage(activeImg);
        updateCaptionSlideshowHeight(s);
      };
      const next=()=>{i=(i+1)%slides.length;show(i)};
      const startTimer=()=>{
        if(s._captionTimer) clearInterval(s._captionTimer);
        s._captionTimer=setInterval(next,4000);
      };
      const stopTimer=()=>{
        if(s._captionTimer) clearInterval(s._captionTimer);
        s._captionTimer=null;
      };

      const ensureWideMoreButton=()=>{
        if(!isWideNow() || slides.length<=CAPTION_IMG_PRELOAD_LIMIT) return;
        if(s.dataset.showMoreOpened==='1') return;
        s.classList.add('more-hidden');
        if(!s.nextElementSibling||!s.nextElementSibling.classList.contains('caption-slideshow-more')){
          const more=document.createElement('div');
          more.className='caption-slideshow-more';
          more.innerHTML='<button type="button" class="caption-more btn btn-outline">顯示更多</button>';
          more.addEventListener('click',()=>{
            s.dataset.showMoreOpened='1';
            s.classList.remove('more-hidden');
            eagerLoadDeferredCaptionImages(s);
            more.remove();
          });
          s.parentNode.insertBefore(more,s.nextSibling);
        }
      };

      const ensureMobilePlayOverlay=()=>{
        if(isWideNow() || slides.length<=CAPTION_IMG_PRELOAD_LIMIT) return;
        if(s.dataset.playing==='1') return;
        if(s.querySelector('.caption-slideshow-play')) return;

        const play=document.createElement('button');
        play.type='button';
        play.className='caption-slideshow-play';
        play.setAttribute('aria-label','播放更多照片');
        play.innerHTML='<span class="icon"><i class="uil uil-play"></i></span>';
        play.addEventListener('click', (e)=>{
          e.stopPropagation();
          s.dataset.playing='1';
          play.remove();
          eagerLoadDeferredCaptionImages(s);
          startTimer();
        });
        s.appendChild(play);
      };

      show(0);

      if(lastWide){
        stopTimer();
        ensureWideMoreButton();
      }else{
        if(slides.length<=CAPTION_IMG_PRELOAD_LIMIT){
          s.dataset.playing='1';
          startTimer();
        }else{
          s.dataset.playing='0';
          ensureMobilePlayOverlay();
        }
      }

      s.addEventListener('click',(e)=>{
        const wide=isWideNow();
        const img = e.target && e.target.closest ? e.target.closest('img') : null;

        if(wide && img){
          if(img.dataset && img.dataset.src && img.src===IMG_PLACEHOLDER){
            loadLazyImage(img);
          }
          const src = (img.dataset && img.dataset.src) ? img.dataset.src : (img.currentSrc || img.src);
          openImageLightbox(src, img.getAttribute('alt')||'');
          return;
        }

        if(!wide){
          next();
          if(s.dataset.playing==='1'){
            startTimer();
          }
        }
      });

      slides.forEach(slide=>{
        const img=slide.querySelector('img');
        if(img && !img.complete){
          img.addEventListener('load',()=>updateCaptionSlideshowHeight(s));
        }
      });

      window.addEventListener('resize',()=>{
        const wide=isWideNow();
        if(wide!==lastWide){
          lastWide=wide;
          if(wide){
            stopTimer();
            ensureWideMoreButton();
          }else{
            if(s.classList.contains('more-hidden')){
              s.classList.remove('more-hidden');
              const moreEl=s.nextElementSibling;
              if(moreEl && moreEl.classList.contains('caption-slideshow-more')) moreEl.remove();
            }
            if(s.dataset.playing==='1' && slides.length>CAPTION_IMG_PRELOAD_LIMIT){
              startTimer();
            }else if(s.dataset.playing==='1' && slides.length<=CAPTION_IMG_PRELOAD_LIMIT){
              startTimer();
            }else{
              stopTimer();
              ensureMobilePlayOverlay();
            }
          }
        }
        updateCaptionSlideshowHeight(s);
      });

    });

    initLazyImages(scope);
  }
  function buildFeed(f){
    const isElearning=f.yt==='U.ELEARNING';
    const ytRaw=isElearning?U.ELEARNING:f.yt;
    const likeAvatars=Array.isArray(f.likeAvatars)?f.likeAvatars:[];
    const likeNames=Array.isArray(f.likeName)?f.likeName.filter(Boolean):[];
    const topics=Array.isArray(f.topics)?f.topics:[];
    const ytStr=String(ytRaw||'').trim();
    const ytId=!isElearning?ytIdFromAny(ytStr):'';
    const isVideoFile=isVideoFileLike(ytStr);
    const isHttp=ytStr.startsWith('http');
    const isLinkOnly=isHttp&&!ytId&&!isVideoFile;
    const video=ytId?`<div class="video-wrapper"><iframe src="${U.YT_EMBED(ytId)}" allowfullscreen></iframe></div>`:(isVideoFile?`<div class="video-wrapper"><video controls playsinline src="${esc(ytStr)}"></video></div>`:'');
    const rawCaption=f.caption||'';
    const plainCaption=stripHtml(rawCaption);
    const isTruncated=plainCaption.length>160;
    let captionRenderHtml='';
    const needPlayer=plainCaption.length>0;
    if(isTruncated){
      const previewText=plainCaption.slice(0,160)+'…';
      captionRenderHtml=`<span class="caption-preview">${esc(previewText)}</span> <button type="button" class="caption-more btn btn-outline" data-action="expand-caption">顯示更多</button>`;
    }else{
      const media=normalizeCaptionMedia(rawCaption);
      captionRenderHtml=(media.captionHtml||'') + (media.imagesHtml||'');
    }
    const mediaPlayer=needPlayer?`<div class="media-player" data-ts="${f.ts}" data-state="idle" aria-label="文字朗讀播放器"><button class="mp-btn mp-play" title="播放/暫停" data-action="play" aria-label="播放或暫停"><i class="uil uil-play"></i></button><div class="mp-timeline" data-action="seek" aria-label="進度條（可點擊調整進度）"><div class="mp-progress"></div></div></div>`:'';
    const topicsHtml=topics.length?`<div class="feed-topics">${topics.map(k=>{const c=topicColor(k);const style=c?' style="--topic-color:'+esc(c)+'"':'';return`<button type="button" class="topic-pill" data-topic-key="${esc(k)}"${style}>${esc(topicLabel(k))}</button>`}).join('')}</div>`:'';
    const likeCount=typeof f.likes==='number'?f.likes:(Array.isArray(f.likeName)?f.likeName.length:0);
    const commentCount=Array.isArray(f.commentList)?f.commentList.length:(typeof f.comments==='number'?f.comments:0);
    const shareCount=typeof f.shares==='number'?f.shares:0;
    const likeHtml=likeAvatars.map(a=>`<span><img src="${a}" alt=""></span>`).join('');
    let likeText='';
    if(likeCount>0&&likeNames.length){
      if(!isLinkOnly){
        likeText=`<b>${likeNames.join('、')}</b>`;
        if(likeCount>likeNames.length){likeText+=` 及 <b>其他 ${likeCount.toLocaleString()} 位用戶</b>`}
        likeText+=' 給貼文星星'
      }else if(typeof ytRaw==='string'&&ytRaw.startsWith(U.ELEARNING)){
        likeText=`本文為AI整理 <b>${likeNames.join('、')}</b> 授課內容`
      }else{
        likeText=`本文標記 <b>${likeNames.join('、')}</b> 等員`
      }
    }
    const metaLike=likeCount>0?`<div class="liked-by"><div class="like-avatars">${likeHtml}</div><p>${likeText}</p></div>`:'';
    const likeCountBadge=likeCount>0&&f.yt!='U.ELEARNING'?`<small class="notification-count action-count" data-count-type="likes">${likeCount}</small>`:'';
    const commentCountBadge=commentCount>0?`<small class="notification-count action-count" data-count-type="comments">${commentCount}</small>`:'';
    const shareCountBadge=shareCount>0?`<small class="notification-count action-count" data-count-type="shares">${shareCount}</small>`:'';
    const curLikeUser=getCurrentLikeUser();
    const likedByMe=f.yt!='U.ELEARNING'&&Array.isArray(f.likeName)&&f.likeName.includes(curLikeUser.name);
    const likeBtn=f.yt!='U.ELEARNING'?`<span class="like-btn${likedByMe?' active':''}" data-action="like"><i class="uil uil-favorite"></i>${likeCountBadge}</span>`:'';
    const linkBtn=isLinkOnly?`<span class=\"link-btn\" data-link=\"${esc(ytStr)}\" style=\"color:white;background:var(--c-primary);display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;cursor:pointer\"><i class=\"uil-youtube\"></i></span>`:'<button type=\"button\" class=\"icon-btn feed-more-btn\" data-action=\"feed-more\"><i class=\"uil uil-ellipsis-h\"></i></button>';
    const commentsPanel=commentCount>0?`<div class="feed-comments" style="display:none;font-size:.8rem;border-top:1px dashed var(--c-border);margin-top:.25rem;">${(Array.isArray(f.commentList)?f.commentList:[]).map(renderCommentItem).join('')}</div>`:`<div class="feed-comments" style="display:none;font-size:.8rem;margin-top:.25rem;color:var(--c-text-soft);">無留言</div>`;
    const titleText=String(f.title||'').replace(/\s*•\s*$/,'').trim();
    const smallText=titleText?`${esc(titleText)} • ${esc(f.date)}`:`${esc(f.date)}`;
    return`<div class="feed fade-slide" data-ts="${f.ts||''}"><div class="feed-header"><div class="avatar"><img src="${f.avatar}" alt=""></div><div class="info"><h3>${esc(f.user)}</h3><small>${smallText}</small></div>${mediaPlayer}<div class="actions">${linkBtn}</div></div>${topicsHtml}${metaLike}${video}<div class="caption">${captionRenderHtml}</div><div class="feed-actions"><div class="left">${likeBtn}<span class="comment-btn" data-action="comment"><i class="uil uil-comment"></i>${commentCountBadge}</span><span class="share-btn" data-action="share"><i class="uil uil-share"></i>${shareCountBadge}</span></div><div class="right"><span class="bookmark-btn${f.bookmarked?' is-bookmarked':''}" data-action="bookmark"><i class="uil uil-bookmark"></i></span></div></div>${commentsPanel}</div>`
  }
  function sortFeedArray(){feedArray.sort((a,b)=>(b.ts||0)-(a.ts||0))}
  let feedScrollAnchorTs = null;
  let feedAppending=false;

  function clearRenderedFeeds(){
    qsa('.feed').forEach(el=>{
      if(el.id!=='daysCalcFeed') el.remove();
    });
  }

  function appendNextFeedBatch(){
    if(feedAppending) return 0;
    const remaining = feedArray.length - feedRenderIndex;
    if(remaining<=0){ setSentinelVisible(false); return 0; }
    feedAppending=true;
    const batch = feedArray.slice(feedRenderIndex, feedRenderIndex + FEED_BATCH_SIZE);
    feedRenderIndex += batch.length;

    const sentinel = ensureFeedSentinel();
    sentinel.insertAdjacentHTML('beforebegin', batch.map(buildFeed).join(''));

    initMediaPlayers();
    initCaptionSlideshows(document);
    initLazyImages(document);
    applyAllFilters();

    setSentinelVisible(feedRenderIndex < feedArray.length);
    feedAppending=false;
    return batch.length;
  }

  function resetInfiniteFeedObserver(){
    const sentinel = ensureFeedSentinel();
    if(feedInfiniteObserver) feedInfiniteObserver.disconnect();
    if(!('IntersectionObserver' in window)) return;
    feedInfiniteObserver = new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)){
        appendNextFeedBatch();
      }
    },{root:null,rootMargin:'900px 0px',threshold:0});
    feedInfiniteObserver.observe(sentinel);
  }

  function renderAllFeeds(){
    normalizeYtConstants();
    let oldTop=null;
    if(feedScrollAnchorTs!=null){
      const oldEl=document.querySelector(`.feed[data-ts="${CSS.escape(String(feedScrollAnchorTs))}"]`);
      if(oldEl) oldTop=oldEl.getBoundingClientRect().top;
    }

    clearRenderedFeeds();
    sortFeedArray();

    feedRenderIndex=0;
    setSentinelVisible(true);

    appendNextFeedBatch();

    if(feedScrollAnchorTs!=null){
      const idx=feedArray.findIndex(f=>String(f.ts)===String(feedScrollAnchorTs));
      if(idx>=0){
        while(feedRenderIndex<=idx){
          if(!appendNextFeedBatch()) break;
        }
      }
    }

    if(feedScrollAnchorTs!=null&&oldTop!==null){
      const newEl=document.querySelector(`.feed[data-ts="${CSS.escape(String(feedScrollAnchorTs))}"]`);
      if(newEl&&newEl.offsetParent!==null){
        const newTop=newEl.getBoundingClientRect().top;
        const delta=newTop-oldTop;
        if(delta!==0) window.scrollBy({top:delta,left:0});
      }
    }

    feedScrollAnchorTs=null;
    resetInfiniteFeedObserver();
  }
  const buildAdvUserItem=u=>`<label data-id="${esc(u.id)}"><input type="radio" name="advUserPreset" value="${esc(u.id)}" data-name="${esc(u.name)}" data-avatar="${esc(u.avatar)}"${u.default?' checked':''}><img src="${esc(u.avatar)}" alt="${esc(u.name)}"><span>${esc(u.name)}</span></label>`;
  function renderAdvUsers(){qs('#advUserList').innerHTML=ADV_USERS.map(buildAdvUserItem).join('')}
  function renderNotifs(){qs('#notifPopup').innerHTML=SYSTEM_NOTIFS.map(n=>`<div class="notice"><img src="${n.img}" alt=""><div>${n.html}</div></div>`).join('')}
  let advSavedRange=null;
  function saveAdvSelection(){const editor=qs('#advEditor');if(!editor)return;const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const r=sel.getRangeAt(0);if(editor.contains(r.commonAncestorContainer))advSavedRange=r.cloneRange()}
  function restoreAdvSelection(){const editor=qs('#advEditor');if(!editor)return false;editor.focus();if(!advSavedRange)return true;const sel=window.getSelection();if(!sel)return false;sel.removeAllRanges();sel.addRange(advSavedRange);return true}
  function _normalizeFontSize(v){v=String(v||'').trim();if(!v)return'';if(/^(\d+(?:\.\d+)?)$/.test(v))return v+'px';return v}
  function applySelectionSpanStyle(prop,val){
    val=String(val||'').trim();
    if(!val)return;
    if(prop==='fontSize')val=_normalizeFontSize(val);
    const editor=qs('#advEditor');
    if(!editor)return;
    restoreAdvSelection();
    const sel=window.getSelection();
    if(!sel)return;
    if(!sel.rangeCount){
      const r0=document.createRange();
      r0.selectNodeContents(editor);
      r0.collapse(false);
      sel.addRange(r0);
    }
    let r=sel.getRangeAt(0);
    if(!editor.contains(r.commonAncestorContainer)){
      const r0=document.createRange();
      r0.selectNodeContents(editor);
      r0.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r0);
      r=sel.getRangeAt(0);
    }
    if(r.collapsed){
      const span=document.createElement('span');
      span.style[prop]=val;
      span.appendChild(document.createTextNode('\u200b'));
      r.insertNode(span);
      const nr=document.createRange();
      nr.setStart(span.firstChild,1);
      nr.collapse(true);
      sel.removeAllRanges();
      sel.addRange(nr);
      saveAdvSelection();
      return;
    }
    const span=document.createElement('span');
    span.style[prop]=val;
    span.appendChild(r.extractContents());
    r.insertNode(span);
    const nr=document.createRange();
    nr.selectNodeContents(span);
    nr.collapse(false);
    sel.removeAllRanges();
    sel.addRange(nr);
    saveAdvSelection();
  }
  function sanitize(html){html=String(html||'').replace(/\u200b/g,'');
    const tpl=document.createElement('template');
    tpl.innerHTML=html;

    const allowed=new Set(['B','STRONG','I','EM','SPAN','BR','P','UL','OL','LI','A']);
    const walker=document.createTreeWalker(tpl.content,NodeFilter.SHOW_ELEMENT);

    while(walker.nextNode()){
      const el=walker.currentNode;
      if(!allowed.has(el.tagName)){
        const p=el.parentNode;
        while(el.firstChild) p.insertBefore(el.firstChild,el);
        p.removeChild(el);
        continue;
      }

      [...el.attributes].forEach(a=>{
        const n=a.name.toLowerCase();
        if(n.startsWith('on')){ el.removeAttribute(a.name); return; }
        if(el.tagName==='A' && (n==='href'||n==='target'||n==='rel')) return;
        if(n==='style'){
          const allowedS=['color','font-size','font-family','font-weight','font-style'];
          const safe=[];
          (el.getAttribute('style')||'').split(';').forEach(r=>{
            let [k,v]=r.split(':');
            if(!k||!v) return;
            if(allowedS.includes(k.trim().toLowerCase())) safe.push(k.trim()+':'+v.trim());
          });
          if(safe.length) el.setAttribute('style',safe.join(';'));
          else el.removeAttribute('style');
          return;
        }
        el.removeAttribute(a.name);
      });

      if(el.tagName==='A'){
        const href=(el.getAttribute('href')||'').trim();
        if(href && !/^(https?:|mailto:|tel:)/i.test(href)) el.removeAttribute('href');
        el.setAttribute('target','_blank');
        const rel=(el.getAttribute('rel')||'').toLowerCase();
        if(!rel.includes('noopener')||!rel.includes('noreferrer')) el.setAttribute('rel','noopener noreferrer');
      }
    }

    return tpl.innerHTML;
  }
  function toggleTheme(){const body=document.body;const cur=body.getAttribute('data-theme');const btn=qs('#themeToggle');if(cur==='dark'){body.removeAttribute('data-theme');localStorage.removeItem('portalTheme');btn.innerHTML='<i class="uil uil-moon"></i>'}else{body.setAttribute('data-theme','dark');localStorage.setItem('portalTheme','dark');btn.innerHTML='<i class="uil uil-sun"></i>'}}
  function rectBottom(r){return r.bottom||r.top+r.height}
  function positionNotif(){const m=qs('#notifications'),p=qs('#notifPopup'),r=m.getBoundingClientRect();p.style.display='flex';p.style.visibility='hidden';p.style.top='-9999px';p.style.left='-9999px';requestAnimationFrame(()=>{const pw=p.offsetWidth;let top=rectBottom(r)+8;const leftTarget=r.left-20;let left=Math.max(8,Math.min(window.innerWidth-pw-8,leftTarget));if(top+p.offsetHeight>window.innerHeight-8){top=Math.max((r.top-8)-p.offsetHeight,8)}p.style.top=top+'px';p.style.left=left+'px';p.style.visibility='visible'})}
  function updateCountdown(){const now=new Date(),y=now.getFullYear(),target=new Date(now>new Date(y,10,1)?y+1:y,10,1);const diff=target-now;const days=Math.ceil(diff/86400000);qs('#countdown-text').innerHTML='<i class="uil uil-clock"></i>倒數 '+days+' 天'}
  function filterQuickLinksGlobal(v){const linksWrap=qs('#links-container'),catBar=qs('#quick-categories');if(!v){qsa('.link-item',linksWrap).forEach(el=>el.style.display='flex');return}const val=v.toLowerCase();const matches=[];for(const[cat,arr]of Object.entries(QUICK_LINKS)){arr.forEach(item=>{const t=item.title.toLowerCase(),d=item.desc.toLowerCase();if(t.includes(val)||d.includes(val))matches.push({cat,title:item.title})})}if(matches.length){const counts=matches.reduce((a,m)=>(a[m.cat]=(a[m.cat]||0)+1,a),{});let bestCat=Object.keys(counts).sort((a,b)=>counts[b]-counts[a]||CAT_PRIORITY.indexOf(a)-CAT_PRIORITY.indexOf(b))[0];const activeBtn=catBar.querySelector('button.active');if(!activeBtn||activeBtn.dataset.cat!==bestCat){qsa('button[data-cat]',catBar).forEach(b=>b.classList.remove('active'));const targetBtn=catBar.querySelector(`button[data-cat="${CSS.escape(bestCat)}"]`);if(targetBtn){targetBtn.classList.add('active');renderLinks(bestCat)}}const matchTitles=matches.filter(m=>m.cat===bestCat).map(m=>m.title);qsa('.link-item',linksWrap).forEach(el=>{el.style.display=matchTitles.includes(el.getAttribute('data-title'))?'flex':'none'});const rb=qs('.rightbar');if(rb)rb.scrollIntoView({behavior:'smooth',block:'start'});return}qsa('.link-item',linksWrap).forEach(el=>{const t=el.getAttribute('data-title').toLowerCase(),d=el.getAttribute('data-desc').toLowerCase();el.style.display=(t.includes(val)||d.includes(val))?'flex':'none'})}
  function applyAllFilters(){
    qsa('.feed').forEach(f=>{
      if(f.id==='daysCalcFeed')return;
      let searchOk=true;
      if(activeSearchQuery){
        let cache=f.getAttribute('data-search-text');
        if(!cache){
          const h3=qs('.feed-header .info h3',f)?.textContent||'';
          const sm=qs('.feed-header .info small',f)?.textContent||'';
          const cap=qs('.caption',f)?.textContent||'';
          const topics=qs('.feed-topics',f)?.textContent||'';
          cache=(h3+' '+sm+' '+cap+' '+topics).toLowerCase();
          f.setAttribute('data-search-text',cache)
        }
        searchOk=cache.includes(activeSearchQuery)
      }
      const pills=qsa('.topic-pill',f);
      let topicOk=true;
      if(activeTopicKey){
        const isGroupOnly=activeTopicKey.endsWith('::');
        if(isGroupOnly){
          const gid=activeTopicKey.slice(0,-2);
          topicOk=pills.some(p=>{const key=p.dataset.topicKey||'';return key.startsWith(gid+'::')})
        }else{
          topicOk=pills.some(p=>{const key=p.dataset.topicKey||'';const label=activeTopicKey.includes('::')?activeTopicKey.split('::').slice(1).join('::'):activeTopicKey;return key===activeTopicKey||(label&&key.endsWith('::'+label))})
        }
      }
      let bookmarkOk=true;
      if(activeBookmarkOnly){
        const item=getFeedItemByElement(f);
        bookmarkOk=!!(item&&item.bookmarked);
      }
      const show=searchOk&&topicOk&&bookmarkOk;
      f.style.display=show?'flex':'none';
      if(!pills.length)return;
      if(activeTopicKey){
        const isGroupOnly=activeTopicKey.endsWith('::');
        const gid=isGroupOnly?activeTopicKey.slice(0,-2):'';
        pills.forEach(p=>{const key=p.dataset.topicKey||'';let match;if(isGroupOnly){match=key.startsWith(gid+'::')}else{const label=activeTopicKey.includes('::')?activeTopicKey.split('::').slice(1).join('::'):activeTopicKey;match=key===activeTopicKey||(label&&key.endsWith('::'+label))}p.classList.toggle('active',match);p.style.display='inline-flex'})
      }else{
        pills.forEach(p=>{p.classList.remove('active');p.style.display='inline-flex'})
      }
    })
  }
  function ensureFeedsForActiveTopic(){
    if(!activeTopicKey) return;
    if(!Array.isArray(feedArray) || !feedArray.length) return;

    const isGroupOnly = activeTopicKey.endsWith('::');
    const gid = isGroupOnly ? activeTopicKey.slice(0,-2) : '';
    const label = activeTopicKey.includes('::') ? activeTopicKey.split('::').slice(1).join('::') : activeTopicKey;

    const hasRenderedMatch = qsa('.feed').some(el=>{
      if(el.id==='daysCalcFeed') return false;
      const pills = qsa('.topic-pill', el);
      if(!pills.length) return false;
      if(isGroupOnly){
        return pills.some(p=>((p.dataset.topicKey||'').startsWith(gid+'::')));
      }
      return pills.some(p=>{
        const k = p.dataset.topicKey || '';
        return k===activeTopicKey || (label && k.endsWith('::'+label));
      });
    });
    if(hasRenderedMatch) return;

    let idx = -1;
    for(let i=0;i<feedArray.length;i++){
      const f = feedArray[i];
      const topics = (f && Array.isArray(f.topics)) ? f.topics : [];
      const ok = isGroupOnly
        ? topics.some(t=>String(t||'').startsWith(gid+'::'))
        : topics.some(t=>{const k=String(t||''); return k===activeTopicKey || (label && k.endsWith('::'+label));});
      if(ok){ idx = i; break; }
    }
    if(idx<0) return;

    while(feedRenderIndex <= idx){
      if(!appendNextFeedBatch()) break;
    }
  }
  function setActiveTopicKey(key){
    activeTopicKey = key || '';
    if(activeTopicKey) ensureFeedsForActiveTopic();
    applyAllFilters();
  }
  
  function ensureCalcFeed(){
    let feed=qs('#daysCalcFeed');
    if(!feed){
      const firstFeed=qs('.feed');
const html=`
      <div class="feed fade-slide" id="daysCalcFeed">
        <div class="feed-header">
          <div class="avatar"><img src="${U.ICON('https://cdn.jsdelivr.net/gh/cchfm1100/website@main/system/9641509.png?v=20260118195244')}" alt=""></div>
          <div class="info">
            <h3>計算餘藥及天數</h3>
          </div>
          <div class="actions">
            <button class="icon-btn" id="closeDaysCalc"><i class="uil uil-times"></i></button>
          </div>
        </div>

        <div class="date-row">
          <label>剩餘顆數
            <input type="number" id="dcRemain" step="1" value="0">
          </label>

          <label>每日次數
            <input type="number" id="dcNeed" step="1" min="1" value="1">
          </label>
        </div>
        <div class="dc-calendar" id="dcCalendar"></div>
      </div>`;

      if(firstFeed) firstFeed.insertAdjacentHTML('beforebegin', html);
      else qs('#newPosts').insertAdjacentHTML('afterbegin', html);

      feed=qs('#daysCalcFeed');
    }
    return qs('#daysCalcFeed');
  }
  function showMore(){if(expanded)return;ensureAdvInit();try{initCompactAvatarToggle()}catch(e){}try{updateSelectedAvatarDisplay()}catch(e){}expanded=true;const pp=qs('#profile-pic');if(pp)pp.style.display='none';const cp=qs('#create-post');if(cp)cp.style.display='none';const adv=qs('#advancedEditorWrapper');if(adv)adv.style.display='flex';const dt=qs('#advDate');if(dt&&!dt.value)dt.valueAsDate=new Date}
  function hideMore(){if(!expanded||feedEditState.active)return;expanded=false;const pp=qs('#profile-pic');if(pp)pp.style.display='';const cp=qs('#create-post');if(cp)cp.style.display='';const adv=qs('#advancedEditorWrapper');if(adv)adv.style.display=''}
  function initFocusToggle(){if(initFocusToggle._done)return;initFocusToggle._done=true;try{qs('#advYoutube').style.display='none';qs('#advImages').style.display='none';const mgr=qs('#advImageManager');if(mgr)mgr.style.display='flex'}catch(e){}const form=qs('#postForm');const open=()=>{ensureAdvInit();showMore()};document.addEventListener('focusin',e=>{const t=e.target;if(t&&t.id==='create-post')open()},true);const trigger=qs('#create-post');if(trigger&&trigger.dataset.focusBound!=='1'){trigger.dataset.focusBound='1';trigger.addEventListener('focus',open)}document.addEventListener('mousedown',e=>{if(!expanded)return;const t=e.target;if(form&&form.contains(t))return;const f=qs('#advUrlFloatBackdrop');if(f&&f.contains(t))return;const m=qs('#advMediaMenu');if(m&&m.contains(t))return;hideMore()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const f=qs('#advUrlFloatBackdrop');if(f&&!f.classList.contains('hide'))return;const m=qs('#advMediaMenu');if(m&&m.style.display==='block')return;hideMore();if(trigger)trigger.blur()}})}

  function setMainActionText(txt){const el=qs('#mainActionText');if(el)el.textContent=txt}
  function resetMainActionText(){
    if(!mainActionDefaultText){
      const el=qs('#mainActionText');
      mainActionDefaultText=el?el.textContent:'';
    }
    setMainActionText(mainActionDefaultText||'');
  }
  function _feedBasename(v){const s=String(v||'');return s.split('/').pop().split('?')[0].split('#')[0]}
  function flashMsg(msg){
    msg=String(msg||'').trim();
    if(!msg) return;
    let el=qs('#toastMsg');
    if(!el){
      el=d.createElement('div');
      el.id='toastMsg';
      el.style.position='fixed';
      el.style.left='50%';
      el.style.bottom='22px';
      el.style.transform='translateX(-50%)';
      el.style.zIndex='9999';
      el.style.background='rgba(0,0,0,.78)';
      el.style.color='#fff';
      el.style.fontSize='.86rem';
      el.style.fontWeight='700';
      el.style.letterSpacing='.5px';
      el.style.padding='.55rem .85rem';
      el.style.borderRadius='999px';
      el.style.boxShadow='0 14px 40px -18px rgba(0,0,0,.55)';
      el.style.opacity='0';
      el.style.transition='opacity .18s ease, transform .18s ease';
      d.body.appendChild(el);
    }
    el.textContent=msg;
    el.style.opacity='1';
    el.style.transform='translateX(-50%) translateY(0)';
    clearTimeout(el._t);
    el._t=setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(-50%) translateY(6px)'},1800);
  }

  function _normalizeNewFeedFileName(name){
    name=String(name||'').trim();
    if(!name) return '';
    name=name.replace(/\s+/g,'');
    if(!name.toLowerCase().endsWith('.js')) name+='.js';
    if(name.includes('/')||name.includes('\\')) return '';
    if(!/^[A-Za-z0-9_-]+\.js$/.test(name)) return '';
    return name;
  }

  window.initFeedSourcePicker=function initFeedSourcePicker(){
    const inp=qs('#feedSourceInput');
    const dl=qs('#feedSourceDatalist');
    if(!inp||!dl) return;
    let files=[];
    try{ files=getFeedFilesFromSettings(); }catch(e){ files=[]; }
    if(window.__FEED_FILES__&&Array.isArray(window.__FEED_FILES__)){
      if(files.length) files = files.concat(window.__FEED_FILES__);
      else files = window.__FEED_FILES__.slice();
    }
    if(!files.length){
      try{
        files=Array.from(d.scripts||[]).map(function(s){
          var src=(s.getAttribute&&s.getAttribute('src'))?s.getAttribute('src'):'';
          var base=String(src||'').split('/').pop().split('?')[0];
          return base;
        }).filter(function(n){ return /\.js$/i.test(n) && String(n).toLowerCase()!=='feed.js'; });
      }catch(e){files=[];}
    }
    if(!files.length) files=['1100.js','909090.js','909091.js'];
    const uniq=[];
    files.forEach(f=>{
      f=_feedBasename(f);
      if(f&&!uniq.includes(f))uniq.push(f);
    });
    dl.innerHTML='';
    uniq.forEach(f=>{
      const opt=d.createElement('option');
      opt.value=f;
      dl.appendChild(opt);
    });
    window.__FEED_FILES__=uniq.slice();
    if(!window.__DEFAULT_FEED_FILE__ && uniq[0]) window.__DEFAULT_FEED_FILE__=uniq[0];
    const def=window.__DEFAULT_FEED_FILE__||uniq[0]||'';
    if(def && !String(inp.value||'').trim()) inp.value=def;


    var settingsReady=(typeof settings!=='undefined' && settings && settings[0] && Array.isArray(settings[0].feeds));
    if((!settingsReady || uniq.length<2) && (window.__feedSourcePickerRetryCount||0)<20){
      window.__feedSourcePickerRetryCount=(window.__feedSourcePickerRetryCount||0)+1;
      try{clearTimeout(window.__feedSourcePickerRetryT);}catch(e){}
      window.__feedSourcePickerRetryT=setTimeout(function(){try{window.initFeedSourcePicker();}catch(e){}},250);
    }


    window._selectedFeedFileForCreate=function(){
      const v=String(inp.value||'').trim();
      const norm=_normalizeNewFeedFileName(v);
      if(norm) return norm;
      const base=_feedBasename(v);
      if(/^[A-Za-z0-9_-]+\.js$/i.test(base)) return base;
      return def||'';
    };

    if(!window.updateFeedSourceInputVisibility){
      window.updateFeedSourceInputVisibility=function(force){
        const el=qs('#feedSourceInput');
        if(!el) return;
        const forced=!!force||!!window.__forceFeedSourceInput||d.body.classList.contains('force-feed-source');
        let inCreate=d.body.classList.contains('create-post');
        if(!inCreate){
          const adv=qs('#advancedEditorWrapper');
          if(adv){
            try{inCreate=getComputedStyle(adv).display!=='none';}catch(e){}
          }
        }
        el.style.display=(forced||inCreate)?'block':'none';
      };
    }

    if(!inp.dataset._visHooked){
      inp.dataset._visHooked='1';
      const refresh=()=>{try{window.updateFeedSourceInputVisibility(false);}catch(e){}};
      const trigger=qs('#create-post');
      if(trigger){
        trigger.addEventListener('focus',()=>setTimeout(refresh,0));
        trigger.addEventListener('click',()=>setTimeout(refresh,0));
        trigger.addEventListener('input',()=>setTimeout(refresh,0));
      }
      try{
        const obs=new MutationObserver(()=>refresh());
        obs.observe(d.body,{attributes:true,attributeFilter:['class']});
        window.__feedSourceVisObserver=obs;
        try{
          const adv=qs('#advancedEditorWrapper');
          if(adv){
            const obs2=new MutationObserver(()=>refresh());
            obs2.observe(adv,{attributes:true,attributeFilter:['style','class']});
            window.__feedSourceVisObserver2=obs2;
          }
        }catch(e){}

      }catch(e){}
      refresh();
    }
  }


  function _ensureFeedFileExists(file){
    if(!file) return;
    if(!window.__FEED_SOURCE_MAP__) window.__FEED_SOURCE_MAP__={};
    const map=window.__FEED_SOURCE_MAP__;
    if(!Array.isArray(map[file])) map[file]=[];
    if(!window.__FEED_FILES__||!Array.isArray(window.__FEED_FILES__)) window.__FEED_FILES__=[];
    if(!window.__FEED_FILES__.includes(file)) window.__FEED_FILES__.push(file);
    const dl=qs('#feedSourceDatalist');
    if(dl){
      const exists=[...dl.querySelectorAll('option')].some(o=>o.value===file);
      if(!exists){
        const opt=d.createElement('option');
        opt.value=file;
        dl.appendChild(opt);
      }
    }
  }

  function _formatLocalDatetime(ts){
    const d2=new Date(ts);
    if(!isFinite(d2)) return '';
    const p=n=>String(n).padStart(2,'0');
    return d2.getFullYear()+'-'+p(d2.getMonth()+1)+'-'+p(d2.getDate())+' '+p(d2.getHours())+':'+p(d2.getMinutes())+':'+p(d2.getSeconds());
  }

  function _safeDatetimeForFile(f){
    if(f&&typeof f.datetime==='string'){
      const dt=f.datetime.trim();
      if(/^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?$/.test(dt)) return dt.includes(' ')?dt:(dt+' 08:00:00');
    }
    if(f&&typeof f.date==='string'){
      const dd=f.date.trim();
      if(/^\d{4}-\d{2}-\d{2}$/.test(dd)) return dd+' 08:00:00';
      if(/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dd)){
        const parts=dd.split('/');
        const y=parts[0],m=String(parts[1]).padStart(2,'0'),d3=String(parts[2]).padStart(2,'0');
        return y+'-'+m+'-'+d3+' 08:00:00';
      }
    }
    if(f&&isFinite(f.ts)) return _formatLocalDatetime(Number(f.ts))||'';
    return _formatLocalDatetime(Date.now());
  }

  function _safePublisherIdForFile(f){
    const pid=(f&&(f.publisherId!=null?f.publisherId:(f.userId!=null?f.userId:(f.uid!=null?f.uid:''))))||'';
    return String(pid||'');
  }

  function _toLikeListForFile(f){
    if(f&&Array.isArray(f.likeList)) return f.likeList.map(x=>({userId:String((x&&(x.userId||x.uid||x.id))||'')})).filter(x=>x.userId);
    let ids=[];
    try{
      if(f&&Array.isArray(f.likeAvatars)&&Array.isArray(ADV_USERS)){
        for(let i=0;i<f.likeAvatars.length;i++){
          const av=f.likeAvatars[i];
          const u=ADV_USERS.find(x=>x&&x.avatar===av);
          if(u&&u.id&&!ids.includes(u.id)) ids.push(u.id);
        }
      }
      if(!ids.length&&f&&Array.isArray(f.likeName)&&Array.isArray(ADV_USERS)){
        for(let i=0;i<f.likeName.length;i++){
          const nm=f.likeName[i];
          const u=ADV_USERS.find(x=>x&&x.name===nm);
          if(u&&u.id&&!ids.includes(u.id)) ids.push(u.id);
        }
      }
    }catch(e){}
    return ids.map(id=>({userId:String(id)}));
  }

  function _toCommentListForFile(f){
    if(!(f&&Array.isArray(f.commentList))) return [];
    return f.commentList.map(c=>{
      if(c==null) return null;
      if(typeof c==='string') return {userId:_safePublisherIdForFile(f),datetime:_safeDatetimeForFile(f),text:String(c)};
      if(typeof c!=='object') return null;
      const uid=c.userId!=null?String(c.userId):'';
      const dt=c.datetime!=null?String(c.datetime):'';
      const tx=c.text!=null?String(c.text):'';
      return {userId:uid||_safePublisherIdForFile(f),datetime:(dt&&dt.trim()?dt:_safeDatetimeForFile(f)),text:tx};
    }).filter(Boolean);
  }

  function _jsString(v){return JSON.stringify(String(v==null?'':v))}
  function _jsNumber(v){return (typeof v==='number'&&isFinite(v))?String(v):'0'}

  function _serializeArray(arr,indent){
    if(!Array.isArray(arr)||!arr.length) return '[]';
    return '[\n'+arr.map(it=>indent+it).join(',\n')+'\n'+indent.slice(0,-2)+']';
  }

  function _serializeLikeList(list,indent){
    if(!Array.isArray(list)||!list.length) return '[]';
    const items=list.map(x=>indent+'{userId:'+_jsString(x.userId||'')+'}');
    return '[\n'+items.join(',\n')+'\n'+indent.slice(0,-2)+']';
  }

  function _serializeCommentList(list,indent){
    if(!Array.isArray(list)||!list.length) return '[]';
    const items=list.map(x=>indent+'{userId:'+_jsString(x.userId||'')+',datetime:'+_jsString(x.datetime||'')+',text:'+_jsString(x.text||'')+'}');
    return '[\n'+items.join(',\n')+'\n'+indent.slice(0,-2)+']';
  }

  function buildFeedArrayJs(arr){
    arr=Array.isArray(arr)?arr:[];
    const items=arr.map(f=>{
      const obj={
        publisherId:_safePublisherIdForFile(f),
        title:String((f&&f.title)||''),
        datetime:_safeDatetimeForFile(f),
        caption:String((f&&f.caption)||''),
        yt:(f&&f.yt)!=null?String(f.yt):'',
        likeList:_toLikeListForFile(f),
        commentList:_toCommentListForFile(f),
        shares:typeof (f&&f.shares)==='number'?f.shares:0,
        topics:Array.isArray(f&&f.topics)?f.topics:[]
      };
      const ind='    ';
      const ind2='      ';
      const topicsCode=_serializeArray((obj.topics||[]).map(x=>_jsString(x)),ind2);
      const likeCode=_serializeLikeList(obj.likeList||[],ind2);
      const comCode=_serializeCommentList(obj.commentList||[],ind2);
      return '{\n'+
        ind+'publisherId:'+_jsString(obj.publisherId)+',\n'+
        ind+'title:'+_jsString(obj.title)+',\n'+
        ind+'datetime:'+_jsString(obj.datetime)+',\n'+
        ind+'caption:'+_jsString(obj.caption)+',\n'+
        ind+'yt:'+_jsString(obj.yt)+',\n'+
        ind+'likeList:'+likeCode+',\n'+
        ind+'commentList:'+comCode+',\n'+
        ind+'shares:'+_jsNumber(obj.shares)+',\n'+
        ind+'topics:'+topicsCode+'\n'+
      '  }';
    });
    return 'const feedArray = [\n  '+items.join(',\n  ')+'\n];\n';
  }

  const __FEED_FILE_HANDLES__={};

  async function persistFeedFile(src){
    if(!src) return;
    _ensureFeedFileExists(src);
    const arr=(window.__FEED_SOURCE_MAP__&&Array.isArray(window.__FEED_SOURCE_MAP__[src]))?window.__FEED_SOURCE_MAP__[src]:[];
    const js=buildFeedArrayJs(arr);
    const name=_feedBasename(src)||'feedarray.js';
    try{
      const meta=(window.__FEED_SOURCE_META__ && (window.__FEED_SOURCE_META__[src]||window.__FEED_SOURCE_META__[_feedBasename(src)]))||null;
      if(meta && meta.usedRaw && meta.raw && /cdn\.jsdelivr\.net/i.test(String(meta.raw||''))){
        try{
          const key='__FEED_OVERRIDE_JSON__:'+_feedBasename(src);
          localStorage.setItem(key, JSON.stringify(arr));
        }catch(e){}
        flashMsg('已更新（CDN來源，不跳出儲存視窗）');
        return;
      }
    }catch(e){}
    try{
      if(window.showSaveFilePicker){
        let handle=__FEED_FILE_HANDLES__[src];
        if(!handle){
          handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:'JavaScript',accept:{'text/javascript':['.js']}}]});
          __FEED_FILE_HANDLES__[src]=handle;
        }
        const w=await handle.createWritable();
        await w.write(js);
        await w.close();
        flashMsg('已寫入 '+name);
        return;
      }
    }catch(e){
      flashMsg('取消寫入');
      return;
    }
    try{
      const blob=new Blob([js],{type:'text/javascript'});
      const url=URL.createObjectURL(blob);
      const a=d.createElement('a');
      a.href=url;
      a.download=name;
      d.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1200);
      flashMsg('已匯出 '+name);
    }catch(e){
      flashMsg('寫入失敗');
    }
  }
  function splitCaptionImages(html){const temp=d.createElement('div');temp.innerHTML=String(html||'');const imgs=Array.from(temp.querySelectorAll('img')).map(im=>(im.getAttribute('src')||'').trim()).filter(Boolean);temp.querySelectorAll('img').forEach(im=>im.remove());return{body:temp.innerHTML||'',imgs}}
  function parseAdvImages(){const t=qs('#advImages');return t?String(t.value||'').split('\n').map(s=>s.trim()).filter(Boolean):[]}
  function setAdvImages(list){const t=qs('#advImages');if(t)t.value=(Array.isArray(list)?list:[]).join('\n');renderAdvImageThumbs()}
  function readFilesAsDataURLs(fileList){const files=Array.from(fileList||[]);return Promise.all(files.map(f=>new Promise(r=>{try{const fr=new FileReader();fr.onload=()=>r(String(fr.result||''));fr.onerror=()=>r('');fr.readAsDataURL(f)}catch(e){r('')}}))).then(arr=>arr.filter(Boolean))}
    function parseAdvYoutube(){const t=qs('#advYoutube');return t?String(t.value||'').trim():''}
  function setAdvYoutube(v){const t=qs('#advYoutube');if(t)t.value=String(v||'').trim();renderAdvImageThumbs()}
  function ytIdFromAny(v){const s=String(v||'').trim();if(!s)return'';if(/^[A-Za-z0-9_\-]{6,}$/.test(s)&&!s.includes('http')&&!s.includes('/')&&!s.includes('.'))return s;let u=null;try{u=new URL(s,location.href)}catch(e){u=null}if(!u)return'';const h=(u.hostname||'').toLowerCase();const isYt=h==='youtu.be'||h.endsWith('.youtu.be')||h==='youtube.com'||h.endsWith('.youtube.com')||h==='youtube-nocookie.com'||h.endsWith('.youtube-nocookie.com');if(!isYt)return'';if(h.includes('youtu.be')){const id=u.pathname.split('/').filter(Boolean)[0]||'';if(/^[A-Za-z0-9_\-]{6,}$/.test(id))return id}const q=u.searchParams.get('v')||'';if(/^[A-Za-z0-9_\-]{6,}$/.test(q))return q;const m=u.pathname.match(/\/(?:embed|shorts|live)\/([A-Za-z0-9_\-]{6,})/);if(m)return m[1];return''}
  function isVideoFileLike(v){const s=String(v||'').trim().toLowerCase();return s.startsWith('data:video/')||s.startsWith('blob:')||/\.(mp4|webm|ogg)(\?|#|$)/.test(s)}
  function isImageFileLike(v){const s=String(v||'').trim().toLowerCase();return s.startsWith('data:image/')||/\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/.test(s)}
  function isYoutubeLike(v){return !!ytIdFromAny(v)}
  function classifyMediaUrl(v){const s=String(v||'').trim();if(!s)return{kind:'',value:''};if(isYoutubeLike(s)||isVideoFileLike(s))return{kind:'yt',value:s};return{kind:'img',value:s}}

  let advUrlFloatApi=null;
  function ensureAdvUrlFloat(){
    if(advUrlFloatApi) return advUrlFloatApi;
    let bd=d.getElementById('advUrlFloatBackdrop');
    if(!bd){
      bd=d.createElement('div');
      bd.id='advUrlFloatBackdrop';
      bd.className='adv-url-float-backdrop hide';
      bd.setAttribute('aria-hidden','true');
      bd.innerHTML=`<div class="adv-url-float" role="dialog" aria-modal="true"><div class="adv-url-float-head"><div class="adv-url-float-title" id="advUrlFloatTitle"><i class="uil uil-link"></i><span></span></div><button type="button" class="icon-btn adv-url-float-close" data-adv-url="cancel"><i class="uil uil-times"></i></button></div><input type="text" id="advUrlFloatInput" placeholder="https://..." autocomplete="off" spellcheck="false"><div class="adv-url-float-actions"><button type="button" data-adv-url="cancel">取消</button><button type="button" class="primary" data-adv-url="ok">確定</button></div></div>`;
      d.body.appendChild(bd);
    }
    const titleSpan=qs('#advUrlFloatTitle span',bd);
    const input=qs('#advUrlFloatInput',bd);
    let onOk=null;
    function close(){bd.classList.add('hide');bd.setAttribute('aria-hidden','true');onOk=null;}
    function ok(){const v=String(input.value||'').trim();if(!v){input.focus();return;}const cb=onOk;close();if(cb)cb(v);}
    function open(opts){titleSpan.textContent=String(opts&&opts.title||'');input.value=String(opts&&opts.value||'');onOk=typeof (opts&&opts.onOk)==='function'?opts.onOk:null;bd.classList.remove('hide');bd.setAttribute('aria-hidden','false');setTimeout(()=>{input.focus();input.select()},0);}
    bd.addEventListener('mousedown',e=>{if(e.target===bd) close();});
    bd.addEventListener('click',e=>{const el=e.target.closest('[data-adv-url]');const act=el?String(el.getAttribute('data-adv-url')||''):'';if(!act)return;if(act==='cancel'){e.preventDefault();close();return;}if(act==='ok'){e.preventDefault();ok();return;}});
    d.addEventListener('keydown',e=>{if(bd.classList.contains('hide'))return;if(e.key==='Escape'){e.preventDefault();close();return;}if(e.key==='Enter'&&d.activeElement===input){e.preventDefault();ok();}});
    advUrlFloatApi={open,close,ok};
    return advUrlFloatApi;
  }
  function openAdvMediaUrlEditor(title,value,onOk){ensureAdvUrlFloat().open({title,value,onOk});}

  let advMediaMenuApi=null;
  function ensureAdvMediaMenu(){
    if(advMediaMenuApi) return advMediaMenuApi;
    let menu=d.getElementById('advMediaMenu');
    if(!menu){
      menu=d.createElement('div');
      menu.id='advMediaMenu';
      menu.className='feed-more-menu';
      d.body.appendChild(menu);
    }
    let lastAnchor=null;
    function close(){menu.style.display='none';menu.dataset.kind='';menu.dataset.index='';menu.dataset.mode='';}
    function position(anchor){
      const r=anchor.getBoundingClientRect();
      const mr=menu.getBoundingClientRect();
      let left=r.right-mr.width;
      if(left<8) left=8;
      if(left+mr.width>window.innerWidth-8) left=window.innerWidth-mr.width-8;
      let top=r.bottom+8;
      if(top+mr.height>window.innerHeight-8) top=r.top-mr.height-8;
      if(top<8) top=8;
      menu.style.left=left+'px';
      menu.style.top=top+'px';
    }
    function renderRoot(){
      const mode=menu.dataset.mode;
      menu.innerHTML = mode==='add'
        ? `<button type="button" data-media="add-url"><i class="uil uil-link"></i><span>添加網址</span></button><button type="button" data-media="add-upload"><i class="uil uil-upload"></i><span>本地上傳</span></button>`
        : `<button type="button" data-media="edit-url"><i class="uil uil-edit"></i><span>修改網址</span></button><button type="button" data-media="replace-upload"><i class="uil uil-upload"></i><span>本地上傳</span></button><button type="button" class="danger" data-media="remove"><i class="uil uil-trash-alt"></i><span>移除</span></button>`;
    }
    function openAt(anchor,mode,kind,index){
      lastAnchor=anchor;
      menu.dataset.mode=String(mode||'');
      menu.dataset.kind=String(kind||'');
      menu.dataset.index=String(index==null?'':index);
      renderRoot();
      menu.style.display='block';
      position(anchor);
    }
    function openAdd(anchor){openAt(anchor,'add','', '')}
    function openItem(anchor,kind,index){openAt(anchor,'item',kind,index)}
    d.addEventListener('click',e=>{
      const btn=e.target.closest('#advMediaMenu [data-media]');
      if(btn){
        const act=btn.getAttribute('data-media');

        if(act==='add-url'){
          close();
          openAdvMediaUrlEditor('添加網址','',v=>{
            const c=classifyMediaUrl(v);
            if(c.kind==='yt'){setAdvYoutube(c.value)}else{const list=parseAdvImages();list.push(c.value);setAdvImages(list)}
          });
          return;
        }
        if(act==='edit-url'){
          const kind=menu.dataset.kind;
          const idx=parseInt(String(menu.dataset.index||'-1'),10);
          const cur=kind==='yt'?parseAdvYoutube():(parseAdvImages()[idx]||'');
          close();
          openAdvMediaUrlEditor('修改網址',cur,v=>{applyMediaUrlTo(kind,idx,v)});
          return;
        }
        const mode=menu.dataset.mode;
        const kind=menu.dataset.kind;
        const idxStr=menu.dataset.index;
        close();
        handleAdvMediaMenuAction(act,mode,kind,idxStr);
        return;
      }
      if(menu.style.display==='block'&&!menu.contains(e.target)) close();
    });
    window.addEventListener('resize',()=>{if(menu.style.display==='block') close()});
    window.addEventListener('scroll',()=>{if(menu.style.display==='block') close()},{passive:true});
    d.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.style.display==='block') close()});
    advMediaMenuApi={openAdd,openItem,close};
    return advMediaMenuApi;
  }
  function applyMediaUrlTo(kind,idx,url){
    const c=classifyMediaUrl(url);
    if(!c.kind) return;
    if(kind==='yt'){
      if(c.kind==='img'){
        setAdvYoutube('');
        const list=parseAdvImages();
        list.push(c.value);
        setAdvImages(list);
      }else{
        setAdvYoutube(c.value);
      }
      return;
    }
    if(kind==='img'){
      const list=parseAdvImages();
      const i=parseInt(String(idx),10);
      if(!isFinite(i)||i<0||i>=list.length) return;
      if(c.kind==='yt'){
        list.splice(i,1);
        setAdvImages(list);
        setAdvYoutube(c.value);
      }else{
        list[i]=c.value;
        setAdvImages(list);
      }
    }
  }
  async function handleAdvMediaMenuAction(action,mode,kind,idxStr){
    if(mode==='add'){
      if(action==='add-url'){
        openAdvMediaUrlEditor('添加網址','',v=>{
          const c=classifyMediaUrl(v);
          if(c.kind==='yt'){setAdvYoutube(c.value)}else{const list=parseAdvImages();list.push(c.value);setAdvImages(list)}
        });
        return;
      }
      if(action==='add-upload'){
        const fileIn=qs('#advImageFileInput');
        if(!fileIn) return;
        fileIn.value='';
        fileIn.click();
        return;
      }
      return;
    }
    const idx=parseInt(String(idxStr||'-1'),10);
    if(action==='remove'){
      if(kind==='yt'){setAdvYoutube('');return;}
      if(kind==='img'){
        const list=parseAdvImages();
        if(idx>=0&&idx<list.length){list.splice(idx,1);setAdvImages(list)}
      }
      return;
    }
    if(action==='edit-url'){
      const cur=kind==='yt'?parseAdvYoutube():(parseAdvImages()[idx]||'');
      openAdvMediaUrlEditor('修改網址',cur,v=>{applyMediaUrlTo(kind,idx,v)});
      return;
    }
    if(action==='replace-upload'){
      const rep=qs('#advImageReplaceInput');
      if(!rep) return;
      rep.value='';
      rep.dataset.kind=kind;
      rep.dataset.index=String(idx);
      rep.click();
      return;
    }
  }
  function renderAdvImageThumbs(){
    const box=qs('#advImageThumbs');
    if(!box) return;
    box.innerHTML='';
    const yt=parseAdvYoutube();
    const imgs=parseAdvImages();
    const menu=ensureAdvMediaMenu();
    if(yt){
      const wrap=d.createElement('div');
      wrap.className='adv-thumb';
      const id=ytIdFromAny(yt);
      if(id){
        const img=d.createElement('img');
        img.loading='lazy';
        img.decoding='async';
        img.referrerPolicy='no-referrer';
        img.src='https://img.youtube.com/vi/'+id+'/hqdefault.jpg';
        wrap.appendChild(img);
      }else if(isVideoFileLike(yt)){
        const v=d.createElement('video');
        v.muted=true;
        v.playsInline=true;
        v.preload='metadata';
        v.src=yt;
        wrap.appendChild(v);
      }else{
        const holder=d.createElement('div');
        holder.style.width='100%';
        holder.style.height='100%';
        holder.style.display='flex';
        holder.style.alignItems='center';
        holder.style.justifyContent='center';
        holder.innerHTML='<i class="uil uil-youtube" style="font-size:1.9rem;color:var(--c-primary)"></i>';
        wrap.appendChild(holder);
      }
      const badge=d.createElement('div');
      badge.className='adv-thumb-badge';
      badge.textContent='YOUTUBE';
      wrap.appendChild(badge);
      const more=d.createElement('button');
      more.type='button';
      more.className='icon-btn feed-more-btn adv-thumb-more';
      more.innerHTML='<i class="uil uil-ellipsis-h"></i>';
      more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu.openItem(more,'yt','')});
      wrap.appendChild(more);
      wrap.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu.openItem(wrap,'yt','')});
      box.appendChild(wrap);
    }
    imgs.forEach((src,idx)=>{
      const wrap=d.createElement('div');
      wrap.className='adv-thumb';
      const img=d.createElement('img');
      img.loading='lazy';
      img.decoding='async';
      img.referrerPolicy='no-referrer';
      img.src=src;
      wrap.appendChild(img);
      const badge=d.createElement('div');
      badge.className='adv-thumb-badge';
      badge.textContent='IMG';
      wrap.appendChild(badge);
      const more=d.createElement('button');
      more.type='button';
      more.className='icon-btn feed-more-btn adv-thumb-more';
      more.innerHTML='<i class="uil uil-ellipsis-h"></i>';
      more.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu.openItem(more,'img',idx)});
      wrap.appendChild(more);
      wrap.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu.openItem(wrap,'img',idx)});
      box.appendChild(wrap);
    });
    const add=d.createElement('div');
    add.className='adv-thumb adv-thumb-add';
    add.innerHTML='<i class="uil uil-plus"></i>';
    add.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu.openAdd(add)});
    box.appendChild(add);
  }
  function initAdvImageManager(){
    const mgr=qs('#advImageManager');
    if(mgr)mgr.style.display='flex';
    const fileIn=qs('#advImageFileInput');
    const repIn=qs('#advImageReplaceInput');
    const t=qs('#advImages');
    if(t)t.addEventListener('input',renderAdvImageThumbs);
    const ytIn=qs('#advYoutube');
    if(ytIn)ytIn.addEventListener('input',renderAdvImageThumbs);
    if(fileIn)fileIn.addEventListener('change',async()=>{
      const files=fileIn.files;
      if(!files||!files.length)return;
      const arr=Array.from(files);
      const imgFiles=arr.filter(f=>String(f.type||'').startsWith('image/'));
      const vidFiles=arr.filter(f=>String(f.type||'').startsWith('video/'));
      if(imgFiles.length){
        const list=parseAdvImages();
        const data=await readFilesAsDataURLs(imgFiles);
        data.forEach(s=>list.push(s));
        setAdvImages(list);
      }
      if(vidFiles.length){
        const f=vidFiles[0];
        const v=await new Promise(r=>{try{const fr=new FileReader();fr.onload=()=>r(String(fr.result||''));fr.onerror=()=>r('');fr.readAsDataURL(f)}catch(e){r('')}});
        if(v) setAdvYoutube(v);
      }
      renderAdvImageThumbs();
    });
    if(repIn)repIn.addEventListener('change',async()=>{
      const files=repIn.files;
      if(!files||!files.length)return;
      const kind=String(repIn.dataset.kind||'');
      const idx=parseInt(String(repIn.dataset.index||'-1'),10);
      const f=files[0];
      const type=String(f.type||'');
      const dataUrl=await new Promise(r=>{try{const fr=new FileReader();fr.onload=()=>r(String(fr.result||''));fr.onerror=()=>r('');fr.readAsDataURL(f)}catch(e){r('')}});
      if(!dataUrl) return;
      if(kind==='yt'){
        if(!type.startsWith('video/')) return;
        setAdvYoutube(dataUrl);
        return;
      }
      if(kind==='img'){
        if(type.startsWith('video/')){
          const list=parseAdvImages();
          if(isFinite(idx)&&idx>=0&&idx<list.length){list.splice(idx,1);setAdvImages(list)}
          setAdvYoutube(dataUrl);
          return;
        }
        if(!type.startsWith('image/')) return;
        const list=parseAdvImages();
        if(isFinite(idx)&&idx>=0&&idx<list.length){list[idx]=dataUrl;setAdvImages(list)}
      }
    });
    renderAdvImageThumbs()
  }

  function dateInputFromItem(item){if(!item)return'';const dt=String(item.datetime||'');if(dt){const m=dt.match(/^(\d{4}-\d{2}-\d{2})/);if(m)return m[1]}const dd=String(item.date||'');if(/^\d{4}-\d{2}-\d{2}$/.test(dd))return dd;if(/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dd)){const p=dd.split('/');return p[0]+'-'+String(p[1]).padStart(2,'0')+'-'+String(p[2]).padStart(2,'0')}if(isFinite(item.ts)){const d2=new Date(item.ts);if(isFinite(d2))return d2.getFullYear()+'-'+String(d2.getMonth()+1).padStart(2,'0')+'-'+String(d2.getDate()).padStart(2,'0')}return''}
  function setTopicsFromItem(item){selectedTopics=Array.isArray(item&&item.topics)?item.topics.slice():[];qsa('#advTopicList input[type=checkbox]').forEach(cb=>{const on=selectedTopics.includes(cb.value);cb.checked=on;const label=cb.closest('label');if(label)label.classList.toggle('selected',on)});renderTopicDisplay()}
  function setLikesFromItem(item){likeAvatarsSelected=Array.isArray(item&&item.likeAvatars)?item.likeAvatars.slice():[];renderLikeAvatars()}
  function startEditFeed(item){if(!item)return;feedEditState.active=true;feedEditState.item=item;feedEditState.srcFile=item.__srcFile||'';const sel=qs('#feedSourceInput');const inp=qs('#feedSourceInput');if(sel){feedEditState.prevTargetFile=sel.value;sel.value=feedEditState.srcFile||window.__DEFAULT_FEED_FILE__||sel.value;sel.disabled=true}if(inp)inp.style.display='none';showMore();qs('#advYoutube').style.display='none';const mgr=qs('#advImageManager');if(mgr)mgr.style.display='flex';qs('#advImages').style.display='none';if(!mainActionDefaultText){const el=qs('#mainActionText');mainActionDefaultText=el?el.textContent:''}setMainActionText('修改');let u=null;const pid=String(item.publisherId||item.userId||'');if(pid)u=_advUserById(pid);if(!u&&item.avatar)u=ADV_USERS.find(x=>x&&x.avatar===item.avatar)||null;if(!u&&item.user)u=ADV_USERS.find(x=>x&&x.name===item.user)||null;if(u){advCurrentUserId=String(u.id||pid||'');advCurrentUserName=String(u.name||'您');advCurrentUserAvatar=String(u.avatar||_defaultAvatar()||'');const r=qs('#advUserList input[name=advUserPreset][value="'+CSS.escape(advCurrentUserId)+'"]');if(r)r.checked=true}else{advCurrentUserId=pid;advCurrentUserName=String(item.user||'您');advCurrentUserAvatar=String(item.avatar||_defaultAvatar()||'')}updateSelectedAvatarDisplay();qs('#advTitle').value=String(item.title||'').replace(/\s*•\s*$/,'').trim();const di=dateInputFromItem(item);if(di)qs('#advDate').value=di;qs('#advYoutube').value=String(item.yt||'');const parts=splitCaptionImages(item.caption||'');qs('#advEditor').innerHTML=parts.body||'';qs('#advImages').value=(parts.imgs||[]).join('\n');renderAdvImageThumbs();setTopicsFromItem(item);setLikesFromItem(item);qs('#advancedEditorWrapper').scrollIntoView({behavior:'smooth',block:'center'});qs('#advEditor').focus()}
  function stopEditFeed(clear){feedEditState.active=false;feedEditState.item=null;feedEditState.srcFile='';const sel=qs('#feedSourceInput');const inp=qs('#feedSourceInput');if(sel){sel.disabled=false;const v=feedEditState.prevTargetFile||window.__DEFAULT_FEED_FILE__||sel.value; if(v) sel.value=v;}feedEditState.prevTargetFile='';if(inp)inp.style.display='none';resetMainActionText();if(clear){qs('#advTitle').value='';qs('#advImages').value='';qs('#advEditor').innerHTML='';selectedTopics=[];likeAvatarsSelected=[];qsa('#advTopicList input[type=checkbox]').forEach(cb=>{cb.checked=false;const label=cb.closest('label');if(label)label.classList.remove('selected')});renderTopicDisplay();renderLikeAvatars()}renderAdvImageThumbs();}
  function deleteFeedItem(item){if(!item)return;if(feedEditState.active&&feedEditState.item===item)stopEditFeed(true);if(!confirm('確定刪除這則 feed？'))return;const src=item.__srcFile||'';if(src&&window.__FEED_SOURCE_MAP__&&Array.isArray(window.__FEED_SOURCE_MAP__[src])){const arr=window.__FEED_SOURCE_MAP__[src];let idx=arr.indexOf(item);if(idx===-1){const ts=String(item.ts||'');idx=arr.findIndex(x=>String(x&&x.ts||'')===ts)}if(idx!==-1)arr.splice(idx,1)}let idx2=feedArray.indexOf(item);if(idx2===-1){const ts=String(item.ts||'');idx2=feedArray.findIndex(x=>String(x&&x.ts||'')===ts)}if(idx2!==-1)feedArray.splice(idx2,1);renderAllFeeds();if(src)persistFeedFile(src);}

  function mainActionBtn2(){
    const name=String((advCurrentUserName||'您')).replace(/</g,'&lt;');
    const avatar=String((advCurrentUserAvatar||_defaultAvatar()||ADV_USERS['User0000002'].avatar));
    const title=qs('#advTitle').value.trim();
    const dateInput=qs('#advDate').value.trim();
    let ytRaw=qs('#advYoutube').value.trim();
    let yt='';
    if(ytRaw){const id=ytIdFromAny(ytRaw);if(id)yt=id}
    let imgs=qs('#advImages').value.split('\n').map(l=>l.trim()).filter(Boolean);
    if(ytRaw&&isImageFileLike(ytRaw)){imgs.push(ytRaw);ytRaw='';qs('#advYoutube').value=''}
    const moved=imgs.filter(u=>isYoutubeLike(u)||isVideoFileLike(u));
    if(moved.length){imgs=imgs.filter(u=>!(isYoutubeLike(u)||isVideoFileLike(u)));if(!ytRaw)ytRaw=moved[0]}

    const raw=qs('#advEditor').innerHTML;
    const safe=sanitize(raw)||'';
    let formatted=safe;
    if(imgs.length)formatted += imgs.map(u=>`<img src="${u}" alt="">`).join('');
    const likeAvatars=likeAvatarsSelected.slice();
    const likeName=likeAvatars.map(av=>{const user=ADV_USERS.find(u=>u.avatar===av);return user?user.name:''});
    const topics=selectedTopics.slice();
    const defaultFile=window.__DEFAULT_FEED_FILE__||'';
    const map=window.__FEED_SOURCE_MAP__||(window.__FEED_SOURCE_MAP__={});
    if(feedEditState.active&&feedEditState.item){
      const item=feedEditState.item;
      const oldDateStr=dateInputFromItem(item);
      const oldTs=Number(item.ts);
      const src=feedEditState.srcFile||item.__srcFile||defaultFile;
      item.__srcFile=src;
      item.user=name;
      item.avatar=avatar;
      item.publisherId=advCurrentUserId||item.publisherId||'';
      item.title=title||'';
      const dateTxt=dateInput||item.date||'剛剛';
      item.date=dateTxt;
      if(dateInput){
        const existing=String(item.datetime||'');
        const t=existing.split(' ')[1]||'08:00:00';
        item.datetime=dateInput+' '+t;
      }
      if(dateInput&&oldDateStr&&dateInput===oldDateStr&&isFinite(oldTs)){
        item.ts=oldTs;
      }else{
        item.ts=getTimestamp((item.datetime||dateInput||dateTxt)||null);
      }
      item.caption=formatted||'';
      item.yt=yt||ytRaw;
      item.likeAvatars=likeAvatars;
      item.likeName=likeName;
      item.likes=likeAvatars.length;
      item.topics=topics;
      if(!Array.isArray(item.commentList)) item.commentList=[];
      if(typeof item.comments!=='number') item.comments=item.commentList.length||0;
      if(typeof item.shares!=='number') item.shares=0;
      if(feedArray.indexOf(item)===-1) feedArray.push(item);
      if(src){
        map[src]=Array.isArray(map[src])?map[src]:[];
        if(map[src].indexOf(item)===-1) map[src].push(item);
      }
      stopEditFeed(true);renderAllFeeds();if(src)persistFeedFile(src);hideMore();ensureAdvInit();return;
    }
    const dateTxt=dateInput||'剛剛';
    const dt=dateInput?dateInput+' 08:00:00':'';
    const ts=getTimestamp(dt||dateInput||null);
    const srcNew=(typeof window._selectedFeedFileForCreate==='function'?window._selectedFeedFileForCreate():(window.__DEFAULT_FEED_FILE__||''));if(srcNew===null)return;
    const newItem={publisherId:advCurrentUserId||'',user:name,avatar,title:title||'',date:dateTxt,datetime:dt||dateTxt,caption:formatted||'',yt:yt||ytRaw,likes:likeAvatars.length,likeAvatars:likeAvatars,likeName:likeName,comments:0,commentList:[],shares:0,ts,topics:topics,__srcFile:srcNew};
    feedArray.push(newItem);
    if(srcNew){
      map[srcNew]=Array.isArray(map[srcNew])?map[srcNew]:[];
      map[srcNew].push(newItem);
    }
    renderAllFeeds();if(srcNew)persistFeedFile(srcNew);try{const cp=qs('#create-post');if(cp)cp.value='';qs('#advTitle').value='';qs('#advImages').value='';qs('#advYoutube').value='';qs('#advEditor').innerHTML='';const dt=qs('#advDate');if(dt)dt.value='';selectedTopics=[];likeAvatarsSelected=[];qsa('#advTopicList input[type=checkbox]').forEach(cb=>{cb.checked=false;const lab=cb.closest('label');if(lab)lab.classList.remove('selected')});renderTopicDisplay();renderLikeAvatars();renderAdvImageThumbs();}catch(e){}hideMore();ensureAdvInit()
  }
  function initPosting(){qs('#postForm').addEventListener('submit',e=>{e.preventDefault();const txt=String(qs('#advEditor').textContent||'').trim();const imgs=parseAdvImages();const yt=parseAdvYoutube();if(!txt&&!imgs.length&&!yt&&!feedEditState.active)return;mainActionBtn2()})}
  function initAdvancedEditor(){
    const editor=qs('#advEditor');
    if(editor){
      ['mouseup','keyup','touchend','input'].forEach(ev=>editor.addEventListener(ev,saveAdvSelection));
      document.addEventListener('selectionchange',()=>{const ae=document.activeElement;if(ae===editor||editor.contains(ae))saveAdvSelection()});
    }
    const bar=qs('#advToolbar');
    if(bar){
      bar.addEventListener('mousedown',e=>{if(e.target.closest('button,input,select'))saveAdvSelection()});
      bar.addEventListener('click',e=>{const b=e.target.closest('button[data-cmd]');if(!b)return;restoreAdvSelection();document.execCommand(b.dataset.cmd,false,null);saveAdvSelection();if(editor)editor.focus()});
    }
    const color=qs('#fontColor');
    if(color)color.addEventListener('input',e=>{restoreAdvSelection();document.execCommand('foreColor',false,e.target.value);saveAdvSelection();if(editor)editor.focus()});
    (()=>{const el=qs('#fontSelect');if(!el)return;const apply=()=>{const v=String(el.value||'').trim();if(!v)return;applySelectionSpanStyle('fontFamily',v);if(editor)editor.focus()};el.addEventListener('change',apply)})();
    (()=>{const el=qs('#fontSizeSelect');const dl=qs('#fontSizeDatalist');if(!el)return;const apply=(forceAny)=>{const raw=String(el.value||'').trim();if(!raw)return;const v=_normalizeFontSize(raw);if(!forceAny&&dl&&!dl.querySelector('option[value="'+CSS.escape(v)+'"]'))return;applySelectionSpanStyle('fontSize',v);if(editor)editor.focus()};el.addEventListener('input',()=>apply(false));el.addEventListener('change',()=>apply(true));el.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply(true)}})})();
    qs('#clearFormat').addEventListener('click',()=>{const editor=qs('#advEditor');if(!editor)return;const allowed=['P','UL','OL','LI','SPAN','BR','FONT','B','I'];const temp=document.createElement('div');temp.innerHTML=editor.innerHTML;temp.querySelectorAll('*').forEach(n=>{if(n.tagName&&!allowed.includes(n.tagName)){const span=document.createElement('span');while(n.firstChild)span.appendChild(n.firstChild);n.replaceWith(span)}});temp.querySelectorAll('[style]').forEach(el=>{const c=el.style.color;if(c&&c.toLowerCase().replace(/\s+/g,'').includes('rgb(19,19,20)')){el.removeAttribute('style')}});editor.innerHTML=temp.innerHTML})
  }
  qs('#advEditor').addEventListener('paste',function(){setTimeout(()=>qs('#clearFormat').click(),0)});
  function updateSelectedAvatarDisplay(){const img=qs('#advSelectedAvatarImg');if(!img)return;let src=String(advCurrentUserAvatar||'').trim()||_defaultAvatar();if(!src){try{const u=ADV_USERS&&ADV_USERS['User0000002'];if(u&&u.avatar)src=String(u.avatar)}catch(e){}}if(src)img.src=src}
  function renderLikeAvatars(){const wrap=qs('#advLikeAvatarList');if(!wrap)return;if(!likeAvatarsSelected.length){wrap.innerHTML='<span style="font-size:.6rem;color:var(--c-text-soft);letter-spacing:.5px;">(尚未選擇)</span>';return}wrap.innerHTML=likeAvatarsSelected.map((a,i)=>`<div class="la-item" data-idx="${i}" title="點按移除"><img src="${a}" alt=""><button type="button" data-remove="${i}">&times;</button></div>`).join('')}
  function renderAdvTopics(){
    const list=qs('#advTopicList');
    if(!list)return;
    const html=TOPIC_GROUPS.map(g=>{
      const color=g.color||'#0ea5e9';
      const topics=(g.topics||[]).map(t=>{
        const key=`${g.id}::${t}`;
        return`<label class="topic-sub" data-key="${esc(key)}" data-topic="${esc(t)}" data-group="${esc(g.id)}" data-color="${esc(color)}"><input type="checkbox" value="${esc(key)}"><span>${esc(t)}</span></label>`
      }).join('');
      return `<div class="topic-group" data-group="${esc(g.id)}" style="--topic-color:${esc(color)}"><button type="button" class="topic-main">${esc(g.name)}</button><div class="topic-sublist">${topics}</div></div>`;
    }).join('');
    list.innerHTML=html;
  }
  function renderTopicDisplay(){
    const box=qs('#advTopicDisplay');
    if(!box)return;
    if(!selectedTopics.length){
      box.innerHTML='<span style="font-size:.6rem;color:var(--c-text-soft);letter-spacing:.5px;">(尚未選擇)</span>';
      return;
    }
    const list=qs('#advTopicList');
    box.innerHTML=selectedTopics.map(k=>{
      let color='';
      const lbl=list?list.querySelector(`label[data-key="${CSS.escape(k)}"]`):null;
      if(lbl&&lbl.dataset.color)color=lbl.dataset.color;
      const style=color?` style="--topic-color:${esc(color)}"`:'';return`<span class="topic-chip" data-topic="${esc(k)}"${style}>${esc(topicLabel(k))}<button type="button" data-remove-topic="${esc(k)}">&times;</button></span>`;
    }).join('');
  }
  function initTopics(){
    const list=qs('#advTopicList');
    if(!list)return;
    renderAdvTopics();
    renderTopicDisplay();
    list.addEventListener('click',e=>{const main=e.target.closest('.topic-main');if(main){const group=main.closest('.topic-group');if(!group)return;const isOpen=group.classList.contains('open');qsa('.topic-group',list).forEach(g=>g.classList.remove('open'));if(!isOpen)group.classList.add('open')}});
    list.addEventListener('change',e=>{const cb=e.target.closest('input[type=checkbox]');if(!cb)return;const key=cb.value;const label=cb.closest('label');if(cb.checked){if(!selectedTopics.includes(key))selectedTopics.push(key);if(label)label.classList.add('selected')}else{selectedTopics=selectedTopics.filter(t=>t!==key);if(label)label.classList.remove('selected')}renderTopicDisplay()});
    const addBtn=qs('#addTopicBtn');
    const clrBtn=qs('#clearTopicBtn');
    const wrapper=qs('#advancedEditorWrapper');
    if(addBtn)addBtn.addEventListener('click',()=>{wrapper.classList.toggle('show-topics')});
    if(clrBtn)clrBtn.addEventListener('click',()=>{selectedTopics=[];qsa('#advTopicList input[type=checkbox]').forEach(cb=>{cb.checked=false;const label=cb.closest('label');if(label)label.classList.remove('selected')});renderTopicDisplay()});
    document.addEventListener('click',e=>{const btn=e.target.closest('button[data-remove-topic]');if(btn){const key=btn.dataset.removeTopic;selectedTopics=selectedTopics.filter(t=>t!==key);const cb=list.querySelector(`input[type="checkbox"][value="${CSS.escape(key)}"]`);if(cb){cb.checked=false;const label=cb.closest('label');if(label)label.classList.remove('selected')}renderTopicDisplay()}});
  }
  function initCompactAvatarToggle(){const w=qs('#advancedEditorWrapper'),btn=qs('#advSelectedAvatar');if(!w||!btn)return;if(btn.dataset.compactAvatarBound==='1')return;btn.dataset.compactAvatarBound='1';btn.addEventListener('click',()=>{selectionMode='user';w.classList.toggle('show-users')})}
  function initLikeAvatarButton(){const btn=qs('#addLikeAvatarBtn'),w=qs('#advancedEditorWrapper');if(btn)btn.addEventListener('click',()=>{selectionMode='like';w.classList.add('show-users')});const clr=qs('#clearLikeAvatarBtn');if(clr)clr.addEventListener('click',()=>{likeAvatarsSelected=[];renderLikeAvatars()});document.addEventListener('click',e=>{const rm=e.target.closest('button[data-remove]');if(rm){const idx=+rm.getAttribute('data-remove');likeAvatarsSelected.splice(idx,1);renderLikeAvatars()}})}
  function initAdvUsers(){
    renderAdvUsers();
    const list=qs('#advUserList');
    const first=list.querySelector('input[name=advUserPreset]:checked')||list.querySelector('input[name=advUserPreset]');
    if(first){advCurrentUserId=first.value||'';advCurrentUserName=first.dataset.name||'您';advCurrentUserAvatar=first.dataset.avatar||_defaultAvatar()}
    list.addEventListener('change',e=>{const r=e.target.closest('input[type=radio][name=advUserPreset]');if(!r)return;if(selectionMode==='user'){advCurrentUserId=r.value||'';advCurrentUserName=r.dataset.name||'您';advCurrentUserAvatar=r.dataset.avatar||_defaultAvatar();updateSelectedAvatarDisplay();qs('#advancedEditorWrapper').classList.remove('show-users')}else{const av=r.dataset.avatar||'';if(av&&!likeAvatarsSelected.includes(av)){likeAvatarsSelected.push(av);renderLikeAvatars()}}});
    qs('#advDate').valueAsDate=new Date();
    updateSelectedAvatarDisplay();
    renderLikeAvatars()
  }
  function initNotifications(){const notifMenu=qs('#notifications'),popup=qs('#notifPopup');notifMenu.addEventListener('click',e=>{e.preventDefault();const visible=popup.style.display==='flex';if(visible){popup.style.display='none'}else{positionNotif();qs('#notifCount').style.display='none'}});document.addEventListener('click',e=>{if(!notifMenu.contains(e.target)&&!popup.contains(e.target))popup.style.display='none'})}
  function initGlobalSearch(){
    const input=qs('#globalSearch');
    input.addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault()});
    input.addEventListener('input',()=>{const v=input.value.trim().toLowerCase();activeSearchQuery=v;filterQuickLinksGlobal(v);applyAllFilters()})
  }
  function initQuickLinks(){
    renderCategories();
    const catBar=qs('#quick-categories');
    renderLinks(catBar.querySelector('button[data-cat]').dataset.cat);
    catBar.addEventListener('click',e=>{const b=e.target.closest('button[data-cat]');if(!b)return;qsa('button[data-cat]',catBar).forEach(x=>x.classList.remove('active'));b.classList.add('active');renderLinks(b.dataset.cat);qs('#message-search').value=''});
    qs('#message-search').addEventListener('input',e=>{filterQuickLinksGlobal(e.target.value.trim().toLowerCase())});
    qs('#links-container').addEventListener('click',e=>{
      const item=e.target.closest('.link-item');
      if(!item)return;
      const title=item.getAttribute('data-title')||'';
      const layout=qs('.layout');
      const appBtn=qs('#AppBtn');
      const closePanel=(after)=>{
        if(appBtn&&layout&&layout.classList.contains('app-mode')){
          appBtn.click();
          if(typeof after==='function')requestAnimationFrame(after);
        }
      };
      if(title==='計算餘藥及天數'){
        e.preventDefault();
        e.stopPropagation();
        const feed=ensureCalcFeed();
        feed.classList.remove('hide');
        if(window.DCCalendar&&typeof window.DCCalendar.init==='function'){
          window.DCCalendar.init(feed);
        }else{
          const cal=feed.querySelector('#dcCalendar');
          if(cal&&!cal.querySelector('.dc-error')){
            const d=document.createElement('div');
            d.className='dc-error';
            cal.appendChild(d);
          }
        }
        feed.classList.remove('flash');
        void feed.offsetWidth;
        feed.classList.add('flash');
        feed.scrollIntoView({behavior:'smooth',block:'start'});
        closePanel(()=>feed.scrollIntoView({behavior:'smooth',block:'start'}));
        return;
      }
      closePanel();
    });
  }
  function initStories(){renderStories();qsa('.story').forEach(st=>st.addEventListener('click',()=>{window.open(st.dataset.link,'_blank')}))}
  function initTheme(){qs('#sidebarThemeToggle').addEventListener('click',toggleTheme);qs('#themeToggle').addEventListener('click',toggleTheme);if(localStorage.getItem('portalTheme')==='dark'){document.body.setAttribute('data-theme','dark');qs('#themeToggle').innerHTML='<i class="uil uil-sun"></i>'}}
  function initAppToggle(){
    const btn=qs('#AppBtn');
    if(!btn)return;
    const layout=qs('.layout');
    const icon=btn.querySelector('i');
    btn.addEventListener('click',()=>{const isAppMode=layout.classList.toggle('app-mode');if(!icon)return;if(isAppMode){icon.className='uil uil-arrow-from-right'}else{icon.className='uil uil-left-arrow-from-left'}})
  }
  function initKeyboard(){document.addEventListener('keydown',e=>{if(e.key==='k'&&(e.metaKey||e.ctrlKey)){e.preventDefault();const inp=qs('#globalSearch');if(inp&&inp.offsetParent!==null)inp.focus()}if(e.key==='Escape'){qs('#notifPopup').style.display='none'}})}
  function initDaysCountdown(){updateCountdown();setInterval(updateCountdown,3600000)}
  function initLinkButtons(){document.addEventListener('click',e=>{const btn=e.target.closest('.link-btn');if(btn){const url=btn.getAttribute('data-link');if(url)window.open(url,'_blank')}})}
  function initFeedMoreMenu(){
    let menu=d.getElementById('feedMoreMenu');
    if(!menu){
      menu=d.createElement('div');
      menu.id='feedMoreMenu';
      menu.className='feed-more-menu';
      menu.innerHTML=`<button type="button" data-more="edit"><i class="uil uil-edit"></i><span>修改</span></button><button type="button" class="danger" data-more="delete"><i class="uil uil-trash-alt"></i><span>刪除</span></button>`;
      d.body.appendChild(menu);
    }
    function close(){menu.style.display='none';menu.dataset.ts='';}
    function open(btn,ts){
      menu.dataset.ts=String(ts||'');
      menu.style.display='block';
      const r=btn.getBoundingClientRect();
      const mr=menu.getBoundingClientRect();
      let left=r.right-mr.width;
      if(left<8) left=8;
      if(left+mr.width>window.innerWidth-8) left=window.innerWidth-mr.width-8;
      let top=r.bottom+8;
      if(top+mr.height>window.innerHeight-8) top=r.top-mr.height-8;
      if(top<8) top=8;
      menu.style.left=left+'px';
      menu.style.top=top+'px';
    }
    d.addEventListener('click',e=>{
      const btn=e.target.closest('button.feed-more-btn[data-action="feed-more"]');
      if(btn){
        e.preventDefault();
        e.stopPropagation();
        const feed=btn.closest('.feed');
        const item=feed?getFeedItemByElement(feed):null;
        if(!item){close();return;}
        if(menu.style.display==='block'&&menu.dataset.ts===String(item.ts||'')){close();return;}
        open(btn,item.ts);
        return;
      }
      const act=e.target.closest('#feedMoreMenu button[data-more]');
      if(act){
        const action=act.dataset.more;
        const ts=menu.dataset.ts;
        close();
        const item=feedArray.find(f=>String(f&&f.ts||'')===String(ts||''));
        if(!item) return;
        if(action==='edit') startEditFeed(item);
        if(action==='delete') deleteFeedItem(item);
        return;
      }
      if(menu.style.display==='block'&&!menu.contains(e.target)) close();
    });
    window.addEventListener('resize',()=>{if(menu.style.display==='block') close()});
    window.addEventListener('scroll',()=>{if(menu.style.display==='block') close()},{passive:true});
    d.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.style.display==='block') close()});
  }

  function initTopicPillFiltering(){document.addEventListener('click',e=>{const pill=e.target.closest('.topic-pill');if(!pill)return;const key=pill.dataset.topicKey||'';if(!key)return;if(activeTopicKey===key){setActiveTopicKey('')}else{setActiveTopicKey(key)}})}
  function initIntroHint(){
    const overlay=qs('#introHintOverlay');
    if(!overlay)return;
    const seen=0;
    if(!seen)overlay.style.display='flex';
    const gotIt=qs('#introGotIt');
    const go=qs('#introGoDirect');
    const directLink=qs('#introHintOverlay a');
    function close(){overlay.style.display='none';localStorage.setItem('introHintSeen','1')}
    if(gotIt)gotIt.addEventListener('click',close);
    if(go)go.addEventListener('click',()=>{if(directLink)window.open(directLink.href,'_blank');close()});
    overlay.addEventListener('click',e=>{if(e.target===overlay)close()})
  }
  function initNavTopicFilter(){const groupSel=document.querySelector('#topicGroupSelect');const subSel=document.querySelector('#topicSubSelect');const clearBtn=document.querySelector('#clearTopicFilter');if(!groupSel||!subSel||!clearBtn)return;groupSel.innerHTML='<option value="">全部内容</option>'+TOPIC_GROUPS.map(function(g){return'<option value="'+esc(g.id)+'">'+esc(g.name)+'</option>'}).join('');function fillSub(gid){const g=TOPIC_GROUPS.find(function(x){return x.id===gid});if(!g){subSel.innerHTML='<option value="">全部專欄</option>';subSel.disabled=true;return}subSel.innerHTML='<option value="">全部專欄</option>'+(g.topics||[]).map(function(t){const raw=String(t||'').trim();if(!raw)return'';const parts=raw.split('::');const label=parts.length>1?parts.slice(1).join('::'):raw;const full=(parts.length>1?raw:(gid?gid+'::'+raw:raw));return'<option value="'+esc(full)+'">'+esc(label)+'</option>'}).join('');subSel.disabled=false}groupSel.addEventListener('change',function(){const gid=groupSel.value||'';if(!gid){fillSub('');setActiveTopicKey('');return}fillSub(gid);subSel.value='';setActiveTopicKey(gid+'::')});subSel.addEventListener('change',function(){const gid=groupSel.value||'';if(!gid){setActiveTopicKey('');return}const v=subSel.value||'';if(!v){setActiveTopicKey(gid+'::');return}const full=v.includes('::')?v:(gid+'::'+v);setActiveTopicKey(full)});clearBtn.addEventListener('click',function(){setActiveTopicKey('');groupSel.value='';fillSub('');subSel.value=''})}
  const TTSPlayer={currentFeed:null,utterance:null,playing:false,cfg:{wordsPerSecond:2.6,voiceLangsPrefer:['zh-TW','zh-Hant','zh-CN','cmn-Hant','cmn','zh']},cancel(){if(!TTS_SUPPORTED)return;try{speechSynthesis.cancel()}catch(e){}if(this.currentFeed){const mp=this.currentFeed.querySelector('.media-player');if(mp){const icon=mp.querySelector('.mp-play i');if(icon)icon.className='uil uil-play';mp.dataset.state='idle';const prog=mp.querySelector('.mp-progress');if(prog)prog.style.width='0%'}}this.utterance=null;this.currentFeed=null;this.playing=false}};
  let ttsWarmedUp=false;
  let userVoiceName=localStorage.getItem('ttsVoiceName')||'';
  async function warmupTTS(){if(ttsWarmedUp)return;if(!TTS_SUPPORTED){ttsWarmedUp=true;return}try{try{await getVoicesAsync(2500)}catch(e){}const u=new SpeechSynthesisUtterance('。');u.lang='zh-TW';speechSynthesis.speak(u);speechSynthesis.cancel();ttsWarmedUp=true}catch(e){ttsWarmedUp=true}}
  function initMediaPlayers(){qsa('.feed').forEach(feed=>{const mp=qs('.media-player',feed);if(!mp)return;if(!TTS_SUPPORTED){const btn=qs('.mp-btn',mp);if(btn){btn.disabled=true;btn.title='此裝置瀏覽器不支援文字朗讀功能'}return}if(!feed._ttsData){prepareCaptionForTTS(feed);setupMediaEvents(feed)}})}
  function prepareCaptionForTTS(feedEl){const capEl=qs('.caption',feedEl);if(!capEl)return;qsa('.tts-word',feedEl).forEach(s=>s.classList.remove('reading','pass'));const walker=document.createTreeWalker(capEl,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!node.nodeValue.trim())return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});let textNodes=[];while(walker.nextNode())textNodes.push(walker.currentNode);let wordIndex=0;const allWords=[];textNodes.forEach(n=>{const parts=n.nodeValue.split(/(\s+)/);const frag=document.createDocumentFragment();parts.forEach(p=>{if(!p)return;if(/\s+/.test(p)){frag.appendChild(document.createTextNode(p))}else{const span=document.createElement('span');span.className='tts-word';span.textContent=p;span.dataset.w=wordIndex++;frag.appendChild(span);allWords.push(p)}});n.parentNode.replaceChild(frag,n)});const plain=allWords.join(' ');feedEl._ttsData={words:allWords,totalWords:allWords.length,plainText:plain,estimatedDuration:allWords.length/TTSPlayer.cfg.wordsPerSecond,startWordOffset:0,elapsedSec:0,startedAt:0,currentWordIndex:0,resumeFromWord:0}}
  function setupMediaEvents(feed){const mp=qs('.media-player',feed);if(!mp)return;mp.addEventListener('click',async e=>{const btn=e.target.closest('[data-action]');if(!btn)return;const action=btn.dataset.action;if(action==='play'){await togglePlay(feed)}else if(action==='seek'){seekFromClick(feed,e)}})}
  function expandIfTruncated(feed){
    const cap=feed?.querySelector('.caption');
    if(!cap) return false;
    const moreBtn=cap.querySelector('button[data-action="expand-caption"]');
    const preview=cap.querySelector('.caption-preview');
    if(!moreBtn||!preview) return false;

    const item=getFeedItemByElement(feed);
    if(!item) return false;

    const media=normalizeCaptionMedia(item.caption||'');
    cap.innerHTML=(media.captionHtml||'') + (media.imagesHtml||'');

    initLazyImages(feed);
    initCaptionSlideshows(feed);
    prepareCaptionForTTS(feed);
    return true;
  }
  async function togglePlay(feed){
    expandIfTruncated(feed);
    const mp=qs('.media-player',feed);
    if(!mp||!TTS_SUPPORTED)return;
    const playBtn=qs('.mp-play',mp);
    const playIcon=qs('.mp-play i',mp);
    const state=mp.dataset.state||'idle';
    const data=feed._ttsData;
    if(TTSPlayer.currentFeed&&TTSPlayer.currentFeed!==feed){TTSPlayer.cancel()}
    if(state==='playing'){
      try{speechSynthesis.cancel()}catch(e){}
      mp.dataset.state='paused';
      if(playIcon)playIcon.className='uil uil-play';
      if(playBtn){playBtn.setAttribute('title','播放');playBtn.setAttribute('aria-pressed','false')}
      TTSPlayer.playing=false;
      return;
    }
    if(state==='paused'&&data&&data.totalWords>0){
      const startIdx=data.resumeFromWord||0;
      try{speechSynthesis.cancel()}catch(e){}
      startReading(feed,startIdx);
      mp.dataset.state='playing';
      if(playIcon)playIcon.className='uil uil-pause';
      if(playBtn){playBtn.setAttribute('title','暫停');playBtn.setAttribute('aria-pressed','true')}
      TTSPlayer.playing=true;
      requestAnimationFrame(()=>updateProgressLoop(feed));
      return;
    }
    await warmupTTS();
    try{speechSynthesis.cancel()}catch(e){}
    startReading(feed,0);
    mp.dataset.state='playing';
    if(playIcon)playIcon.className='uil uil-pause';
    if(playBtn){playBtn.setAttribute('title','暫停');playBtn.setAttribute('aria-pressed','true')}
  }
  async function startReading(feed,startWord){
    if(!TTS_SUPPORTED)return;
    const data=feed._ttsData;
    if(!data||data.totalWords===0)return;
    const mp=qs('.media-player',feed);
    const playIcon=qs('.mp-play i',mp);
    if(TTSPlayer.currentFeed){TTSPlayer.cancel()}
    TTSPlayer.currentFeed=feed;
    TTSPlayer.utterance=null;
    qsa('.tts-word.reading',feed).forEach(w=>w.classList.remove('reading'));
    qsa('.tts-word.pass',feed).forEach(w=>w.classList.remove('pass'));
    data.startWordOffset=startWord||0;
    const remainingWords=data.words.slice(startWord);
    const text=remainingWords.join(' ');
    const u=new SpeechSynthesisUtterance(text);
    u.rate=1;
    u.lang='zh-TW';
    let voices=[];
    try{voices=await getVoicesAsync(2500)}catch(e){voices=speechSynthesis.getVoices()||[]}
    let chosen=null;
    if(userVoiceName){chosen=voices.find(v=>v.name===userVoiceName)||null}
    if(!chosen){chosen=chooseBestChineseVoice(voices)}
    if(chosen){u.voice=chosen;u.lang=chosen.lang}
    u.onstart=()=>{data.startedAt=performance.now();data.elapsedSec=0;if(mp)mp.dataset.state='playing';if(playIcon)playIcon.className='uil uil-pause';TTSPlayer.playing=true;requestAnimationFrame(()=>updateProgressLoop(feed))};
    u.onend=()=>{if(TTSPlayer.currentFeed!==feed)return;if(mp)mp.dataset.state='ended';if(playIcon)playIcon.className='uil uil-play';TTSPlayer.playing=false;updateProgress(feed,1)};
    u.onerror=()=>{if(mp)mp.dataset.state='idle';if(playIcon)playIcon.className='uil uil-play';TTSPlayer.playing=false};
    u.onboundary=ev=>{try{const charIndex=ev.charIndex;const relWordIdx=charIndexToWordIndex(remainingWords,charIndex);const absWordIdx=data.startWordOffset+relWordIdx;data.currentWordIndex=absWordIdx;data.resumeFromWord=absWordIdx;highlightWord(feed,absWordIdx);updateProgress(feed,absWordIdx/data.totalWords)}catch(err){}};
    try{speechSynthesis.speak(u);TTSPlayer.utterance=u}catch(err){if(mp)mp.dataset.state='idle';if(playIcon)playIcon.className='uil uil-play';TTSPlayer.playing=false}
  }
  function charIndexToWordIndex(words,charIndex){let pos=0;for(let i=0;i<words.length;i++){const w=words[i];const end=pos+w.length;if(charIndex<end+1)return i;pos=end+1}return words.length-1}
  function highlightWord(feed,idx){qsa('.tts-word.reading',feed).forEach(w=>w.classList.remove('reading'));qsa('.tts-word.pass',feed).forEach(w=>w.classList.remove('pass'));for(let i=0;i<idx;i++){const p=feed.querySelector(`.tts-word[data-w="${i}"]`);if(p)p.classList.add('pass')}const span=feed.querySelector(`.tts-word[data-w="${idx}"]`);if(span)span.classList.add('reading')}
  function updateProgress(feed,ratio){ratio=Math.max(0,Math.min(1,ratio||0));const mp=qs('.media-player',feed);const prog=qs('.mp-progress',mp);if(prog)prog.style.width=ratio*100+'%'}
  function updateProgressLoop(feed){if(!TTSPlayer.playing||TTSPlayer.currentFeed!==feed)return;const mp=qs('.media-player',feed);if(mp.dataset.state==='playing'){const data=feed._ttsData;if(data){const now=performance.now();const rel=(now-data.startedAt)/1000;const baseOffsetRatio=data.startWordOffset/data.totalWords;const estRatio=Math.min(1,baseOffsetRatio+rel/data.estimatedDuration);updateProgress(feed,estRatio)}requestAnimationFrame(()=>updateProgressLoop(feed))}}
  function seekFromClick(feed,e){
    const bar=e.target.closest('.mp-timeline');
    if(!bar||!TTS_SUPPORTED)return;
    const rect=bar.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const ratio=x/rect.width;
    const data=feed._ttsData;
    if(!data||!data.totalWords)return;
    const targetWord=Math.floor(ratio*data.totalWords);
    const mp=qs('.media-player',feed);
    const wasPlaying=mp.dataset.state==='playing';
    startReading(feed,targetWord);
    if(!wasPlaying){
      try{speechSynthesis.pause()}catch(e){}
      mp.dataset.state='paused';
      const icon=qs('.mp-play i',mp);
      if(icon)icon.className='uil uil-play';
      TTSPlayer.playing=false;
    }
  }
  function getVoicesAsync(timeout=3000){return new Promise((resolve,reject)=>{if(!TTS_SUPPORTED){resolve([]);return}const existing=speechSynthesis.getVoices();if(existing.length)return resolve(existing);let done=false;const onChange=()=>{if(done)return;const v=speechSynthesis.getVoices();if(v.length){done=true;speechSynthesis.removeEventListener('voiceschanged',onChange);resolve(v)}};speechSynthesis.addEventListener('voiceschanged',onChange);setTimeout(()=>{if(!done){done=true;speechSynthesis.removeEventListener('voiceschanged',onChange);const v=speechSynthesis.getVoices();if(v.length)resolve(v);else reject(new Error('No voices loaded'))}},timeout)})}
  function chooseBestChineseVoice(voices){
    const prefers=['zh-tw','zh-hant','zh-cn','cmn-hant','cmn','zh'];
    const candidates=(voices||[]).filter(v=>{const L=(v.lang||'').toLowerCase();return prefers.some(p=>L.startsWith(p))});
    if(!candidates.length)return null;
    function score(v){const L=(v.lang||'').toLowerCase();const N=(v.name||'').toLowerCase();let s=0;if(L.includes('tw'))s+=10;if(L.includes('hant'))s+=7;if(L.includes('cn'))s+=5;if(L.includes('hans'))s+=3;if(N.includes('taiwan')||N.includes('tw'))s+=3;if(N.includes('google'))s+=2;if(N.includes('microsoft'))s+=1;if(v.localService)s+=1;return s}
    return candidates.sort((a,b)=>score(b)-score(a))[0]||null
  }
  async function refreshVoiceSelect(){
    const sel=qs('#voiceSelect');
    if(!sel||!TTS_SUPPORTED)return;
    let voices=[];
    try{voices=await getVoicesAsync(2500)}catch(e){voices=speechSynthesis.getVoices()||[]}
    const prefers=['zh','cmn','en'];
    const list=voices.filter(v=>prefers.some(p=>(v.lang||'').toLowerCase().startsWith(p.toLowerCase())));
    const cur=userVoiceName;
    sel.innerHTML=`<option value="">AI語音：自動</option>`+list.map(v=>`<option value="${esc(v.name)}"${v.name===cur?' selected':''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('');
    sel.addEventListener('change',()=>{userVoiceName=sel.value||'';if(userVoiceName)localStorage.setItem('ttsVoiceName',userVoiceName);else localStorage.removeItem('ttsVoiceName')})
  }
  function initIntroOverlay(){
    const overlay=qs('#introHintOverlay');
    const gotIt=qs('#introGotIt');
    const go=qs('#introGoDirect');
    if(!overlay||!gotIt||!go)return;
    const key='introHintDismissed';
    if(!localStorage.getItem(key)){overlay.style.display='flex'}
    gotIt.addEventListener('click',()=>{overlay.style.display='none';localStorage.setItem(key,'1')});
    go.addEventListener('click',()=>{overlay.style.display='none';localStorage.setItem(key,'1')})
  }
  function getFeedItemByElement(feedEl){
    if(!feedEl)return null;
    const ts=feedEl.dataset.ts;
    if(!ts)return null;
    const num=Number(ts);
    return feedArray.find(f=>String(f.ts)===String(num))||null
  }
  function getCurrentLikeUser(){const name=String((advCurrentUserName||'您')).trim()||'您';const avatar=String((advCurrentUserAvatar||_defaultAvatar()||ADV_USERS['User0000002'].avatar)).trim()||ADV_USERS['User0000002'].avatar;return{name,avatar}}
  function stripHtml(html){const temp=document.createElement('div');temp.innerHTML=html||'';return(temp.textContent||'').trim()}
  function getShareUrl(item){
    const raw=item.yt;
    if(!raw)return location.href;
    if(raw==='U.ELEARNING')return U.ELEARNING;
    if(typeof raw==='string'&&raw.startsWith('http'))return raw;
    if(typeof raw==='string')return'https://youtu.be/'+raw;
    return location.href
  }
  async function handleShareAction(feedEl,item){
    const shareUrl=getShareUrl(item);
    const shareTitle=item.title||item.user||document.title;
    const shareText=(item.caption?stripHtml(item.caption).slice(0,80):'')||shareTitle;
    let shared=false;
    if(navigator.share){
      try{await navigator.share({title:shareTitle,text:shareText,url:shareUrl});shared=true}catch(e){}
    }
    if(!shared&&navigator.clipboard&&navigator.clipboard.writeText){
      try{await navigator.clipboard.writeText(shareUrl);shared=true;alert('已將連結複製到剪貼簿，可自行分享。')}catch(e){}
    }
    if(!shared){alert('請手動分享此連結：\n'+shareUrl)}
    if(shared){if(typeof item.shares!=='number')item.shares=0;item.shares+=1;renderAllFeeds()}
  }

  function initBookmarkMenu(){
    const mainMenu=document.querySelector('#mainMenu');
    if(!mainMenu)return;
    mainMenu.addEventListener('click',e=>{
      const item=e.target.closest('.menu-item[data-menu]');
      if(!item)return;
      const menu=item.dataset.menu||'';
      if(menu!=='home'&&menu!=='bookmark')return;
      e.preventDefault();
      activeBookmarkOnly=(menu==='bookmark');
      document.querySelectorAll('.menu-item[data-menu]').forEach(el=>{
        el.classList.toggle('active',el===item);
      });
      applyAllFilters();
    })
  }

  function initToyMenu(){
    const body=document.body;
    const mql=window.matchMedia&&window.matchMedia('(max-width: 760px)');
    if(!mql) return;

    const sidebar=document.querySelector('.sidebar');
    const menu=document.querySelector('#mainMenu');
    if(!sidebar||!menu) return;

    let backdrop=document.getElementById('toyMenuBackdrop');
    if(!backdrop){
      backdrop=document.createElement('div');
      backdrop.id='toyMenuBackdrop';
      document.body.appendChild(backdrop);
    }

    const getToy=()=>document.getElementById('ScrollToy');
    const setOpen=v=>{
      const open=!!v;
      body.classList.toggle('menu-open',open);
      const toy=getToy();
      if(toy) toy.setAttribute('aria-expanded',open?'true':'false');
      if(open) requestAnimationFrame(()=>layoutArcMenu());
    };
    const close=()=>setOpen(false);
    const toggle=()=>{ if(!mql.matches) return; setOpen(!body.classList.contains('menu-open')) };

    function layoutArcMenu(){
      if(!mql.matches) return;
      const W=menu.clientWidth;
      const H=menu.clientHeight;
      if(!W||!H) return;
      const items=[...menu.querySelectorAll('.menu-item')].filter(el=>getComputedStyle(el).display!=='none');
      const n=items.length;
      if(!n) return;
      const size=56;
      const pad=18;
      const cx=W/2;
      const cy=H+6;
      const r=Math.max(0,Math.min(W/2-pad,H-pad));
      const start=-Math.PI*0.95;
      const end=-Math.PI*0.05;
      items.forEach((el,i)=>{
        const t=(n===1)?0.5:(i/(n-1));
        const a=start+(end-start)*t;
        const x=cx+r*Math.cos(a);
        const y=cy+r*Math.sin(a);
        el.style.left=(x-size/2)+'px';
        el.style.top=(y-size/2)+'px';
      });
    }

    const toy=getToy();
    if(toy){
      toy.addEventListener('click',e=>{ if(!mql.matches) return; e.preventDefault(); e.stopPropagation(); toggle(); });
      toy.addEventListener('keydown',e=>{ if(!mql.matches) return; if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });
    }

    backdrop.addEventListener('click',close);
    menu.addEventListener('click',e=>{ if(!mql.matches) return; const item=e.target.closest('.menu-item'); if(item) close(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
    document.addEventListener('click',e=>{
      if(!mql.matches) return;
      if(!body.classList.contains('menu-open')) return;
      if(e.target.closest('#ScrollToy')||e.target.closest('.sidebar')) return;
      close();
    },true);

    window.addEventListener('resize',()=>{
      if(!mql.matches) close();
      if(body.classList.contains('menu-open')) layoutArcMenu();
    },{passive:true});
    if(mql.addEventListener){
      mql.addEventListener('change',()=>{ if(!mql.matches) close(); });
    }
  }

function initFeedActions(){
    document.addEventListener('click',async e=>{
      const actionSpan=e.target.closest('.feed-actions span[data-action]');
      if(!actionSpan)return;
      const feed=actionSpan.closest('.feed');
      if(!feed||!feed.dataset.ts)return;
      const item=getFeedItemByElement(feed);
      if(!item)return;
      const action=actionSpan.dataset.action;
      if(action==='like'){
        const user=getCurrentLikeUser();
        const names=item.likeName=Array.isArray(item.likeName)?item.likeName:[];
        const avatars=item.likeAvatars=Array.isArray(item.likeAvatars)?item.likeAvatars:[];
        const idx=names.indexOf(user.name);
        if(idx===-1){names.push(user.name);if(avatars.indexOf(user.avatar)===-1)avatars.push(user.avatar)}else{names.splice(idx,1);const aIdx=avatars.indexOf(user.avatar);if(aIdx!==-1)avatars.splice(aIdx,1)}
        item.likes=names.length;
        renderAllFeeds();
      }else if(action==='comment'){
        const panel=feed.querySelector('.feed-comments');
        if(panel){const isHidden=panel.style.display==='none'||getComputedStyle(panel).display==='none';panel.style.display=isHidden?'block':'none'}
            }else if(action==='bookmark'){
        item.bookmarked=!item.bookmarked;
        renderAllFeeds();
      }else if(action==='share'){
        await handleShareAction(feed,item);
      }
    })
  }
  function initCaptionExpander(){
    document.addEventListener('click',e=>{const btn=e.target.closest('button[data-action="expand-caption"]');if(!btn)return;const feed=btn.closest('.feed');if(feed)expandIfTruncated(feed)})
  }
  function initClearTopicFilterReset(){
    document.addEventListener('click',e=>{const btn=e.target.closest('#clearTopicFilter');if(!btn)return;const groupSel=qs('#topicGroupSelect');const subSel=qs('#topicSubSelect');const pill=qs('#navTopicPill');if(groupSel)groupSel.value='';if(subSel){subSel.innerHTML='<option value="">全部專欄</option>';subSel.disabled=true;subSel.value=''}if(pill){pill.style.display='none';pill.textContent=''}})
  }
  
  class ScrollToy{
    constructor(srcs){
      this.srcs=srcs;
      this.frame=0;
      this.y=0;
      this.vy=0;
      this.raf=0;
      this.lastScrollY=window.scrollY;
      this.lastScrollT=performance.now();
      this.lastFrameT=performance.now();
      this.wasAir=false;

      this.gDesktop=7500;
      this.capYDesktop=240;
      this.capVDesktop=1800;

      this.gHome=9000;
      this.capYHome=120;
      this.capVHome=1200;

      this.g=this.gDesktop;
      this.capY=this.capYDesktop;
      this.capV=this.capVDesktop;

      this.reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      this.el=null;
      this.body=null;
      this.img=null;

      this.dock='';
      this.mainEl=null;
      this.homeEl=null;

      this.stepBound=t=>this.step(t);
      this.resizeBound=()=>this.updateDock(true)
    }
    mount(){
      const el=document.createElement('div');
      el.id='ScrollToy';
      el.className='toy-main';
      el.setAttribute('role','button');
      el.setAttribute('tabindex','0');
      el.setAttribute('aria-label','開啟選單');
      el.setAttribute('aria-expanded','false');

      const body=document.createElement('div');
      body.id='ScrollToyBody';

      const img=document.createElement('img');
      img.id='ScrollToyImg';
      img.alt='';
      img.decoding='async';
      img.loading='eager';
      img.src=this.srcs[0];

      body.appendChild(img);
      el.appendChild(body);
      document.body.appendChild(el);

      this.el=el;
      this.body=body;
      this.img=img;

      for(let i=1;i<this.srcs.length;i++){const im=new Image();im.src=this.srcs[i]}

      this.mainEl=document.querySelector('main.main')||document.querySelector('.main');
      this.homeEl=document.querySelector('.menu-item[data-menu="home"]');

      this.updateDock(true);
      window.addEventListener('resize',this.resizeBound,{passive:true});
      return this
    }
    setFrame(i){
      this.frame=(i+this.srcs.length)%this.srcs.length;
      if(this.img) this.img.src=this.srcs[this.frame]
    }
    setDockPhysics(){
      if(this.dock==='home'||this.dock==='mobile'){
        this.g=this.gHome;
        this.capY=this.capYHome;
        this.capV=this.capVHome
      }else{
        this.g=this.gDesktop;
        this.capY=this.capYDesktop;
        this.capV=this.capVDesktop
      }
    }
    positionToMain(){
      if(!this.el||!this.img) return;
      const main=this.mainEl||document.querySelector('main.main')||document.querySelector('.main');
      if(!main){this.el.style.left='18px';return}
      const rect=main.getBoundingClientRect();
      const toyW=this.img.getBoundingClientRect().width||132;
      const desiredRight=Math.round(rect.left+6);
      let left=desiredRight-toyW;
      left=Math.max(8,Math.min(left,window.innerWidth-toyW-8));
      this.el.style.left=left+'px'
    }
    dockMain(){
      if(!this.el) return;
      if(this.el.parentElement!==document.body) document.body.appendChild(this.el);
      if(this.homeEl) this.homeEl.classList.remove('has-toy');

      this.el.classList.remove('toy-home','toy-mobile');
      this.el.classList.add('toy-main');
      this.el.style.bottom='calc(env(safe-area-inset-bottom) + 14px)';
      this.el.style.top='';
      this.el.style.transform='';

      this.dock='main';
      this.setDockPhysics();
      this.positionToMain()
    }
    dockHome(){
      const home=this.homeEl||document.querySelector('.menu-item[data-menu="home"]');
      if(!this.el||!home){this.dockMain();return}
      home.classList.add('has-toy');
      if(this.el.parentElement!==home) home.appendChild(this.el);

      this.el.classList.remove('toy-main','toy-mobile');
      this.el.classList.add('toy-home');

      this.el.style.left='';
      this.el.style.right='';
      this.el.style.bottom='';
      this.el.style.top='';

      this.dock='home';
      this.setDockPhysics()
    }
    dockMobile(){
      if(!this.el) return;
      if(this.el.parentElement!==document.body) document.body.appendChild(this.el);
      if(this.homeEl) this.homeEl.classList.remove('has-toy');

      this.el.classList.remove('toy-home','toy-main');
      this.el.classList.add('toy-mobile');
      this.el.style.left='50%';
      this.el.style.right='';
      this.el.style.bottom='calc(env(safe-area-inset-bottom) + 12px)';
      this.el.style.top='';

      this.dock='mobile';
      this.setDockPhysics()
    }
    updateDock(force=false){
      const isMobile=!!(window.matchMedia&&window.matchMedia('(max-width: 760px)').matches);
      if(isMobile){
        if(this.dock!=='mobile'||force) this.dockMobile()
      }else{
        if(this.dock!=='main'||force) this.dockMain();
        this.positionToMain()
      }
    }
    kick(speed){
      if(this.reduce) return;
      const impulse=(this.dock==='home'||this.dock==='mobile')
        ? Math.min(this.capV,Math.max(260,speed*1400))
        : Math.min(this.capV,Math.max(340,speed*1600));
      this.vy=Math.max(this.vy,impulse);
      this.setFrame(this.frame+1);
      if(!this.raf){
        this.lastFrameT=performance.now();
        this.raf=requestAnimationFrame(this.stepBound)
      }
    }
    step(t){
      const dt=Math.min(.034,(t-this.lastFrameT)/1000);
      this.lastFrameT=t;

      this.vy-=this.g*dt;
      this.y+=this.vy*dt;

      if(this.y<0){this.y=0;this.vy=0}
      if(this.y>this.capY){this.y=this.capY;if(this.vy>0)this.vy=0}

      this.body.style.transform='translate3d(0,'+(-this.y).toFixed(1)+'px,0)';

      const inAir=this.y>0;
      if(!inAir&&this.wasAir){this.wasAir=false;this.setFrame(0)}
      if(inAir)this.wasAir=true;

      if(this.y>0||Math.abs(this.vy)>1){this.raf=requestAnimationFrame(this.stepBound)}else{this.raf=0}
    }
    onScroll(){
      const now=performance.now();
      const curY=window.scrollY;
      const dy=curY-this.lastScrollY;
      const dt=Math.max(16,now-this.lastScrollT);

      this.lastScrollY=curY;
      this.lastScrollT=now;

      if(this.dock==='main') this.positionToMain();

      if(dy>0) this.kick(dy/dt)
    }
    start(){
      window.addEventListener('scroll',()=>this.onScroll(),{passive:true});
      return this
    }
  }
  function initScrollToy(){const list=(typeof toy!=='undefined'&&Array.isArray(toy)?toy:null);const srcs=(list&&list.length?list:['toy1.png','toy2.png','toy3.png','toy4.png']).map(v=>typeof v==='string'?v:(v&&v.src)||'').filter(Boolean);if(!srcs.length)return;window.ScrollToy=ScrollToy;window.ScrollToyInstance=new ScrollToy(srcs).mount().start()}
  function init(){
    initStaticImages();
    initScrollToy();
    initToyMenu();
    renderNotifs();
    initNotifications();
    initTheme();
    initAppToggle();
    initKeyboard();
    initDaysCountdown();
    initLinkButtons();
    initFeedMoreMenu();
    initStories();
    initQuickLinks();if(typeof window.initFeedSourcePicker==='function') window.initFeedSourcePicker();ensureAdvInit();
    initTopicPillFiltering();
    initGlobalSearch();
    if(typeof __renderAllFeedsIfReady==='function') __renderAllFeedsIfReady(); else renderAllFeeds();
    refreshVoiceSelect();
    initIntroOverlay();
    initIntroHint();
    initNavTopicFilter();
    initBookmarkMenu();
    initFeedActions();
    initCaptionExpander();
    initClearTopicFilterReset()
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }

(function(){
  const TZ_OFFSET_MIN = 8 * 60;

  function _advUserById(id){
    if(!id) return null;
    try{
      if(typeof ADV_USERS !== 'undefined' && ADV_USERS && ADV_USERS[id]) return ADV_USERS[id];
      if(typeof ADV_USERS !== 'undefined' && Array.isArray(ADV_USERS)) return ADV_USERS.find(u=>u.id===id) || null;
    }catch(e){}
    return null;
  }

  function _parseTaipeiDatetimeToTs(dt){
    if(dt==null) return null;
    if(typeof dt==='number' && isFinite(dt)) return dt;
    if(dt instanceof Date) return dt.getTime();
    const s=String(dt).trim();
    if(!s) return null;
    const m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if(m){
      const y=+m[1], mo=+m[2], d=+m[3];
      const hh=+(m[4]||0), mm=+(m[5]||0), ss=+(m[6]||0);
      return Date.UTC(y, mo-1, d, hh, mm, ss) - (TZ_OFFSET_MIN*60*1000);
    }
    const ms=Date.parse(s);
    return isNaN(ms)?null:ms;
  }

  function _pad2(n){ return String(n).padStart(2,'0'); }
  function _formatTaipeiFromTs(ts){
    const t=Number(ts);
    if(!isFinite(t)) return '';
    const d=new Date(t + (TZ_OFFSET_MIN*60*1000));
    const Y=d.getUTCFullYear();
    const M=_pad2(d.getUTCMonth()+1);
    const D=_pad2(d.getUTCDate());
    const h=_pad2(d.getUTCHours());
    const m=_pad2(d.getUTCMinutes());
    const s=_pad2(d.getUTCSeconds());
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
  }
  function _dateOnlyFromDatetime(dt){
    if(!dt) return '';
    const s=String(dt);
    const m=s.match(/^(\d{4}-\d{2}-\d{2})/);
    return m?m[1]:'';
  }

  function _buildFeedTsMap(){
    const map={};
    try{
      if(Array.isArray(window.feedArray)){
        window.feedArray.forEach(f=>{ if(f && isFinite(f.ts)) map[String(f.ts)] = f; });
      }
    }catch(e){}
    return map;
  }

  function _decorateFeedDatetime(){
    const map=_buildFeedTsMap();
    const feeds=document.querySelectorAll('.feed[data-ts]');
    feeds.forEach(el=>{
      const ts=el.getAttribute('data-ts');
      const f=map[String(ts)];
      if(!f) return;
      const small=el.querySelector('.feed-header .info small');
      if(!small) return;
      const dateOnly=f.date || (f.datetime?String(f.datetime).slice(0,10):'');
      const full=f.datetime || (isFinite(f.ts)?_formatTaipeiFromTs(f.ts):'');
      const title=(f.title||'').trim();
      small.textContent = title ? (title + ' • ' + dateOnly) : dateOnly;
      small.setAttribute('title', full);
      small.dataset.dateOnly = dateOnly;
      small.dataset.fullDatetime = full;
    });
  }

  function _patchGlobalFns(){
    if(typeof window.renderCommentItem==='function' && !window.renderCommentItem.__patchedForDatetime){
      const orig=window.renderCommentItem;
      const patched=function(c){
        if(typeof c==='string') return orig(c);
        if(!c || typeof c!=='object') return '';
        const uid=c.userId||c.uid||c.id||'';
        const u=_advUserById(uid)||{name:'匿名者',avatar:(typeof U!=='undefined'&&U.AVATAR_GUEST)?U.AVATAR_GUEST:''};
        const text=c.text||c.content||c.msg||'';
        const dt=c.datetime||c.time||'';
        const dtShow=dt?String(dt).replace('T',' ').replace(/\..*$/,'') : '';
        const meta = dtShow ? `<div class="comment-time" style="font-size:.72rem;color:var(--c-text-soft);margin-top:.15rem;">${String(dtShow).replace(/[&<>"]+/g,'')}</div>` : '';
        return `<div class="comment-item"><img src="${String(u.avatar).replace(/"/g,'&quot;')}" alt=""><div class="comment-body"><div class="comment-name">${String(u.name).replace(/[&<>"]+/g,'')}</div>${meta}<div class="comment-text">${String(text).replace(/[&<>"]+/g,'')}</div></div></div>`;
      };
      patched.__patchedForDatetime=true;
      window.renderCommentItem=patched;
      try{ renderCommentItem = patched; }catch(e){}
    }

    if(typeof window.renderAllFeeds==='function' && !window.renderAllFeeds.__patchedForDatetime){
      const orig=window.renderAllFeeds;
      const patched=function(){
        const r=orig.apply(this, arguments);
        try{ _decorateFeedDatetime(); }catch(e){}
        return r;
      };
      patched.__patchedForDatetime=true;
      window.renderAllFeeds=patched;
      try{ renderAllFeeds = patched; }catch(e){}
    }
  }

  function _installDatetimeToggle(){
    if(document.__dtToggleInstalled) return;
    document.__dtToggleInstalled=true;
    document.addEventListener('click', (e)=>{
      const small=e.target && e.target.closest && e.target.closest('.feed-header .info small');
      if(!small) return;
      const dateOnly=small.dataset.dateOnly;
      const full=small.dataset.fullDatetime;
      if(!dateOnly || !full) return;
      const now=small.textContent||'';
      const titlePrefix=now.replace(full,'').replace(dateOnly,'').trim();
      const showingFull=now.includes(full);
      small.textContent = (titlePrefix? (titlePrefix+' ') : '') + (showingFull ? dateOnly : full);
    });
  }

  if(typeof document!=='undefined' && document && document.addEventListener){
    document.addEventListener('DOMContentLoaded', ()=>{
      try{ _patchGlobalFns(); }catch(e){}
      try{ _installDatetimeToggle(); }catch(e){}
      try{ _decorateFeedDatetime(); }catch(e){}
    });
  }
})()
