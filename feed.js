var versionedUrl=window.versionedUrl||function(u){return u};
var cchCdnUrl=window.cchCdnUrl||function(p){return p};
var cchPreferCdnAssets=window.cchPreferCdnAssets||function(){return false};

if(typeof USER_AVATARS==='undefined'){window.USER_AVATARS={};} if(typeof ADV_USERS==='undefined'){window.ADV_USERS=[];} if(typeof STORIES==='undefined'){window.STORIES=[];}

const U={
  ELEARNING:'http://elearning.xms.cch.org.tw',
  ICON:i=>U.ICON_URL(i),
  ICON_URL:i=>{
    if(!i) return versionedUrl(`https://cdn-icons-png.flaticon.com/128/1828/1828843.png`);
    i=String(i).trim();
    return(/^(https?:)?\/\//i.test(i)||/^data:/i.test(i)||/^\.\//.test(i)||i.startsWith('/'))
      ? versionedUrl(i)
      : versionedUrl(`https://cdn-icons-png.flaticon.com/128/${i}.png`)
  },
  YT_EMBED:i=>`https://www.youtube-nocookie.com/embed/${i}?rel=0&modestbranding=1&playsinline=1`,
  DOC:f=>`https://dpt.cch.org.tw/upload/doctor/${f}?width=170&height=170`
};

  const CAT_PRIORITY=["R/VS","PGY/UGY","上傳KM會議記錄"];
  

(function(){
  const SQLITE_HTTPVFS_VERSION='0.8.12';
  const SQLITE_MODULE_URLS=['https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/+esm','https://esm.sh/sql.js-httpvfs@0.8.12?bundle'];
  const SQLITE_WORKER_CDN='https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sqlite.worker.js';
  const SQLITE_WASM_CDN='https://cdn.jsdelivr.net/npm/sql.js-httpvfs@0.8.12/dist/sql-wasm.wasm';
  const FEED_SQLJS_CDN='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js';
  const FEED_SQLJS_WASM_BASE='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/';
  window.feedArray=[];
  window.__FEED_SOURCE_MAP__={};
  window.__FEED_SOURCE_META__={};
  window.__SQLITE_FEED_WORKERS__={};
  window.__SQLITE_FEED_WORKER_URLS__={};
  window.__SQLITE_FEED_WORKER_URL__='';
  window.__SQLITE_FEED_FULL_DBS__=window.__SQLITE_FEED_FULL_DBS__||{};
  window.__SQLITE_FEED_INDEX_READY__=false;
  window.__SQLITE_FEED_LOADING__=null;
  function baseName(s){return String(s||'').split('/').pop().split('?')[0].split('#')[0]}
  function sqliteName(s){const b=baseName(s);return b.replace(/\.js$/i,'.sqlite')}
  function uniq(arr){const out=[];(arr||[]).forEach(v=>{v=sqliteName(v);if(v&&!out.includes(v))out.push(v)});return out}
  function getSettingFeedFiles(){try{const root=(typeof settings!=='undefined'&&settings&&settings[0])?settings[0]:null;if(!root||!Array.isArray(root.feeds)) return [];const out=[];root.feeds.forEach(group=>{const scripts=group&&group.script;if(!Array.isArray(scripts)) return;scripts.forEach(m=>{if(!m||typeof m!=='object') return;Object.keys(m).forEach(k=>{if(/\.(sqlite|db|sqlite3|js)$/i.test(k)) out.push(sqliteName(k))});});});return uniq(out)}catch(e){return []}}
  function getSettingSqliteFilesFromSettings(){try{const out=[];if(Array.isArray(window.LOCAL_CDN)){window.LOCAL_CDN.forEach(r=>{if(!r||typeof r!=='object')return;[r.local,r.CDN].forEach(v=>{if(/\.(sqlite|db|sqlite3)(?:[?#]|$)/i.test(String(v||'')))out.push(sqliteName(v));});});}const root=(typeof settings!=='undefined'&&settings&&settings[0])?settings[0]:null;if(root){Object.keys(root).forEach(section=>{(root[section]||[]).forEach(group=>{const scripts=group&&group.script;if(!Array.isArray(scripts))return;scripts.forEach(m=>{if(!m||typeof m!=='object')return;Object.keys(m).forEach(k=>{const v=m[k];if(/\.(sqlite|db|sqlite3)(?:[?#]|$)/i.test(k)||/\.(sqlite|db|sqlite3)(?:[?#]|$)/i.test(String(v||'')))out.push(sqliteName(k));});});});});}return uniq(out.length?out:getSettingFeedFiles())}catch(e){return getSettingFeedFiles()}}
  window.getFeedFilesFromSettings=getSettingFeedFiles;
  window.getSqliteFilesFromSettings=getSettingSqliteFilesFromSettings;
  try{const initialFiles=getSettingFeedFiles();if(initialFiles.length){window.__FEED_FILES__=initialFiles.slice();window.__DEFAULT_FEED_FILE__=initialFiles[0]||''}}catch(e){}
  function cchSqlitePreferCdn(){try{return (typeof cchPreferCdnAssets==='function'&&cchPreferCdnAssets())||!!window.__CCH_CDN_FIRST__}catch(e){return false}}
  function _absUrl(s){return /^(https?:)?\/\//i.test(String(s||'')) || /^(data:|blob:)/i.test(String(s||''));}
  function _cdnBases(){const out=[];const add=v=>{v=String(v||'').trim().replace(/\/+$/,'');if(v&&!out.includes(v))out.push(v)};add(window.CDNurl||window.CDNURL||window.CCH_CDN_PREFIX||window.SQL_CDN_PREFIX||'');return out;}
  function cchCdnUrl(file){const base=_cdnBases()[0]||'';return String(base||'').replace(/\/?$/, '/')+String(file||'').replace(/^\/+/, '')};window.cchCdnUrl=window.cchCdnUrl||cchCdnUrl
  function _cdnUrlCandidates(file){file=String(file||'').trim();if(!file)return[];if(_absUrl(file))return[versionedUrl(file)];return _cdnBases().map(base=>versionedUrl(String(base).replace(/\/+$/,'')+'/'+file.replace(/^\.+\//,'').replace(/^\/+/,'')));}
  function _isLocalGoogleUrl(u){try{const x=new URL(String(u||''),location.href),h=String(x.hostname||'').toLowerCase(),lh=String(location.hostname||'').toLowerCase();return h===lh&&(h.includes('googleusercontent.com')||String(x.pathname||'').includes('/embeds/'))}catch(e){return false}}
  function settingUrlCandidates(file){const want=sqliteName(file);let remote='';try{const root=(typeof settings!=='undefined'&&settings&&settings[0])?settings[0]:null;if(root&&Array.isArray(root.feeds)){for(const group of root.feeds){const scripts=group&&group.script;if(!Array.isArray(scripts)) continue;for(const m of scripts){if(!m||typeof m!=='object') continue;for(const k of Object.keys(m)){if(sqliteName(k)===want){remote=String(m[k]||'').trim().replace(/\.js(\?|#|$)/i,'.sqlite$1');break}}if(remote) break}if(remote) break}}}catch(e){}const remotes=_cdnUrlCandidates(remote||want);const locals=[want];const order=cchSqlitePreferCdn()?remotes.concat(locals):locals.concat(remotes);const out=[];for(const raw of order){if(!raw) continue;let u=String(raw).trim();try{u=new URL(versionedUrl(u),location.href).href}catch(e){try{u=versionedUrl(u)}catch(e2){}}if(u&&!out.includes(u)) out.push(u)}return (cchSqlitePreferCdn()&&!window.__CCH_ALLOW_LOCAL_EMBED_FALLBACK__?out.filter(u=>!_isLocalGoogleUrl(u)):out).length?(cchSqlitePreferCdn()&&!window.__CCH_ALLOW_LOCAL_EMBED_FALLBACK__?out.filter(u=>!_isLocalGoogleUrl(u)):out):[new URL(want,location.href).href]}
  function settingUrl(file){return settingUrlCandidates(file)[0]}
  function parseJson(v,def){try{if(v==null||v==='')return def;const x=JSON.parse(String(v));return x==null?def:x}catch(e){return def}}
  function listText(v){if(v==null||v==='')return [];const s=String(v);const j=parseJson(s,null);if(Array.isArray(j))return j.map(x=>String(x||'').trim()).filter(Boolean);return s.split(/\r?\n|\|/).map(x=>x.trim()).filter(Boolean)}
  function topicListMatchesKey(list,key){key=String(key||'').trim();if(!key)return true;const arr=(Array.isArray(list)?list:[]).map(x=>String(x||'').trim()).filter(Boolean);if(!arr.length)return false;const isGroup=key.endsWith('::');const gid=isGroup?key.slice(0,-2):'';const label=key.includes('::')?key.split('::').slice(1).join('::'):key;return arr.some(t=>{if(isGroup)return t.startsWith(gid+'::');return t===key||(label&&t.endsWith('::'+label));});}
  function rowTopicMatchesKey(r,key){return topicListMatchesKey(listText((r&&r.topic!=null)?r.topic:(r&&r.topics)),key)}
  function feedItemMatchesTopicKey(item,key){return topicListMatchesKey((item&&Array.isArray(item.topics))?item.topics:[],key)}
  function sqlQuote(s){return String(s||'').replace(/'/g,"''")}
  function topicSqlNeedle(key){key=String(key||'').trim();if(!key)return'';return key;}
  window.__feedItemMatchesTopicKey=feedItemMatchesTopicKey;

  function normalizeSqlUserId(v){if(v==null)return '';if(typeof v==='object'){return String(v.userId||v.publisherID||v.publisherId||v.uid||v.id||'').trim();}const s=String(v||'').trim();if(!s)return '';let m=s.match(/['"]?(?:userId|publisherID|publisherId|uid|id)['"]?\s*:\s*['"]([^'"]+)['"]/i);if(m)return m[1].trim();m=s.match(/User\d{7}/i);if(m)return m[0];return s;}

  function cdnPathUrl(p){p=String(p||'').trim();if(!p)return'';if(/^(https?:)?\/\//i.test(p)||/^(data|blob):/i.test(p))return versionedUrl(p);return versionedUrl(cchCdnUrl(p));}
  function resolveLinkLine(p){p=String(p||'').trim();if(!p)return'';if(/^(https?:)?\/\//i.test(p)||/^(data|blob):/i.test(p)||/^(mailto|tel):/i.test(p))return versionedUrl(p);return cdnPathUrl(p);}
  function looksLikeImageUrl(u){return /\.(?:png|jpe?g|gif|webp|bmp|svg)(?:[?#]|$)/i.test(String(u||'').split('?')[0])||/images\.pexels\.com|sysdata\/course\//i.test(String(u||''));}
  function photosFromRow(r){const legacy=listText(r.photosURL).map(resolveLinkLine);const cdn=listText(r.photosCDNURL).map(cdnPathUrl);const linkImgs=listText(r.linksURL).map(resolveLinkLine).filter(looksLikeImageUrl);return (cdn.length?legacy.concat(cdn):legacy.concat(linkImgs)).filter(Boolean);}
  function linksFromRow(r){const imgs=photosFromRow(r);return listText(r.linksURL).map(resolveLinkLine).filter(Boolean).filter(u=>!(looksLikeImageUrl(u)&&imgs.includes(u)));}
  function photoTagsForRow(r){return photosFromRow(r).map(u=>'<img src="'+String(u).replace(/"/g,'&quot;')+'" loading="lazy" decoding="async">').join('');}
  function htmlEsc(v){return String(v==null?'':v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function makeDatetime(d,t){d=String(d||'').trim();t=String(t||'').trim();if(!d)return '';if(!t||t==='00:00'||t==='00:00:00')return d+' 00:00:00';return d+' '+(t.length===5?t+':00':t)}
  function photoRefHtml(url){url=String(url||'').trim();return url?"高清圖片請參考：<a href='"+htmlEsc(url)+"'>"+htmlEsc(url)+"</a>":''}
  function imgTags(arr){return (arr||[]).map(u=>'<img src="'+htmlEsc(u)+'">').join('')}
  function rowTs(dt){try{return typeof getTimestamp==='function'?getTimestamp(dt):Date.parse(String(dt||'').replace(' ','T'))||Date.now()}catch(e){return Date.now()}}
  async function loadHttpVfsModule(){if(window.__SQLITE_HTTPVFS_MODULE__) return window.__SQLITE_HTTPVFS_MODULE__;let last=null;for(const u of SQLITE_MODULE_URLS){try{const mod=await import(versionedUrl(u));const createDbWorker=mod.createDbWorker||(mod.default&&mod.default.createDbWorker);if(createDbWorker){window.__SQLITE_HTTPVFS_MODULE__={createDbWorker};return window.__SQLITE_HTTPVFS_MODULE__}}catch(e){last=e}}throw last||new Error('sql.js-httpvfs import failed')}
  function getWorkerUrl(){if(window.__SQLITE_FEED_WORKER_URL__) return window.__SQLITE_FEED_WORKER_URL__;const body='importScripts('+JSON.stringify(versionedUrl(SQLITE_WORKER_CDN))+');';window.__SQLITE_FEED_WORKER_URL__=URL.createObjectURL(new Blob([body],{type:'text/javascript'}));return window.__SQLITE_FEED_WORKER_URL__}
  function loadScriptOnce(src){src=versionedUrl(src);window.__CCH_SCRIPT_PROMISES__=window.__CCH_SCRIPT_PROMISES__||{};if(window.__CCH_SCRIPT_PROMISES__[src])return window.__CCH_SCRIPT_PROMISES__[src];window.__CCH_SCRIPT_PROMISES__[src]=new Promise((res,rej)=>{try{const s=document.createElement('script');s.src=src;s.async=true;s.onload=()=>res();s.onerror=()=>rej(new Error('load error '+src));document.head.appendChild(s)}catch(e){rej(e)}});return window.__CCH_SCRIPT_PROMISES__[src]}
  async function ensureFeedSqlJs(){if(window.SQL&&window.SQL.Database)return window.SQL;if(window.__SQLITE_FEED_SQLJS_PROMISE__)return window.__SQLITE_FEED_SQLJS_PROMISE__;window.__SQLITE_FEED_SQLJS_PROMISE__=loadScriptOnce(FEED_SQLJS_CDN).then(()=>{const init=(typeof window.initSqlJs==='function')?window.initSqlJs:((typeof initSqlJs==='function')?initSqlJs:null);if(!init)throw new Error('initSqlJs missing');return init({locateFile:file=>FEED_SQLJS_WASM_BASE+file})}).then(SQL=>{window.SQL=SQL;return SQL});return window.__SQLITE_FEED_SQLJS_PROMISE__}
  function rowsFromFullDb(db,sql){const st=db.prepare(sql);const out=[];try{while(st.step())out.push(st.getAsObject())}finally{try{st.free()}catch(e){}}return out}
  async function fetchSqliteBytes(url){const u=versionedUrl(url);const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw new Error('fetch '+u+' status '+r.status);return new Uint8Array(await r.arrayBuffer())}
  async function openFullSqliteDb(file){const f=sqliteName(file);if(window.__SQLITE_FEED_WORKERS__[f])return window.__SQLITE_FEED_WORKERS__[f];if(window.__SQLITE_FEED_FULL_DBS__[f])return window.__SQLITE_FEED_FULL_DBS__[f];const SQL=await ensureFeedSqlJs();const urls=settingUrlCandidates(f);let last=null;for(const url of urls){try{const bytes=await fetchSqliteBytes(url);const db=new SQL.Database(bytes);const wrapper={__fullSqliteDb:db,__fullSqliteUrl:url};try{rowsFromFullDb(db,"SELECT name FROM sqlite_master LIMIT 1")}catch(probeErr){try{db.close()}catch(e){}throw probeErr}window.__SQLITE_FEED_FULL_DBS__[f]=wrapper;window.__SQLITE_FEED_WORKERS__[f]=wrapper;window.__SQLITE_FEED_WORKER_URLS__[f]=url;return wrapper}catch(e){last=e}}throw last||new Error('SQLite full fetch failed: '+f)}
  async function openHttpVfsDb(file){const f=sqliteName(file);const mod=await loadHttpVfsModule();const urls=settingUrlCandidates(f);let last=null;for(const url of urls){try{const worker=await mod.createDbWorker([{from:'inline',config:{serverMode:'full',requestChunkSize:4096,url:url}}],getWorkerUrl(),versionedUrl(SQLITE_WASM_CDN),Infinity);try{await queryRows(worker,"SELECT name FROM sqlite_master LIMIT 1")}catch(probeErr){throw probeErr}window.__SQLITE_FEED_WORKERS__[f]=worker;window.__SQLITE_FEED_WORKER_URLS__[f]=url;return worker}catch(e){last=e}}throw last||new Error('SQLite database load failed: '+f)}
  async function getWorker(file){const f=sqliteName(file);if(window.__SQLITE_FEED_WORKERS__[f])return window.__SQLITE_FEED_WORKERS__[f];let firstErr=null;if(!window.__FEED_USE_HTTPVFS_SQLITE__){try{return await openFullSqliteDb(f)}catch(e){firstErr=e}}try{return await openHttpVfsDb(f)}catch(e){if(window.__FEED_USE_HTTPVFS_SQLITE__){try{return await openFullSqliteDb(f)}catch(e2){firstErr=firstErr||e2}}throw firstErr||e}}
  async function queryRows(worker,sql){if(worker&&worker.__fullSqliteDb)return rowsFromFullDb(worker.__fullSqliteDb,sql);if(worker&&worker.db&&typeof worker.db.query==='function'){try{return rowsFromExec(await worker.db.query(sql))}catch(e){}}if(worker&&worker.db&&typeof worker.db.exec==='function') return rowsFromExec(await worker.db.exec(sql));return []}
  function rowsFromExec(res){if(!Array.isArray(res)) return [];if(res.length&&res[0]&&Array.isArray(res[0].values)&&Array.isArray(res[0].columns)){const cols=res[0].columns;return res[0].values.map(vals=>{const o={};cols.forEach((c,i)=>o[c]=vals[i]);return o})}return res}
  function mainRowToFeed(r,file){
    const fid=String(r.FID||r.id||r.__rowid__||'');
    const mediaUrls=photosFromRow(r);
    const photos=mediaUrls.map(u=>'<img src="'+String(u).replace(/"/g,'&quot;')+'" loading="lazy" decoding="async">').join('');
    const slideUrl=String(r.SlideShowURL||r.slideShowURL||r.slideshowURL||'').trim();
    const srtText=String(r.srt||r.SRT||'').trim();
    let caption=srtText?'':String(r.caption||'');
    if(!srtText&&slideUrl)caption+=(caption?'<br>':'')+photoRefHtml(slideUrl);
    if(!srtText&&photos)caption+=photos;
    const links=linksFromRow(r);
    const xms=String(r.xmsIDURL||'').trim();
    const yt=String(r.youtubeIDURL||'').trim();
    const topics=listText(r.topic||r.topics).length?listText(r.topic||r.topics):[];
    return {
      __fid:fid,
      __srcFile:sqliteName(file),
      __file:sqliteName(file),
      __bodyLoaded:false,
      publisherId:String(r.publisherID||r.publisherId||''),
      lecturersID:String(r.lecturersID||''),
      tagID:String(r.tagID||''),
      title:String(r.title||''),
      datetime:makeDatetime(String(r.date||''),String(r.time||'')),
      caption:caption,
      srt:srtText,
      SlideShowURL:slideUrl,
      yt:yt,
      courseLink:xms?'https://elearning.xms.cch.org.tw/course/'+xms:'',
      courseImage:mediaUrls[0]||'',
      slides:mediaUrls,
      linksURL:links,
      topics:topics,
      likeList:[],
      commentList:[],
      shares:0,
      isSlideShow:!!(slideUrl||mediaUrls.length>1||Number(r.isSlideShow||0))
    };
  }
  function oldIndexToFeed(r,file){const src=sqliteName(r.source_sqlite||file);const topics=parseJson(r.topics_json,[]);return {publisherId:String(r.publisherId||''),title:String(r.title||''),datetime:String(r.datetime||''),date:String(r.date||''),caption:'',yt:String(r.yt||''),courseLink:String(r.courseLink||''),courseImage:String(r.courseImage||''),slides:[],likeList:[],commentList:[],shares:Number(r.shares||0)||0,topics:Array.isArray(topics)?topics:[],ts:Number(r.ts||0)||0,__rowUid:String(r.row_uid||''),__srcFile:src,__sourceFile:String(r.source_file||''),__itemIndex:Number(r.item_index||0)||0,__bodyLoaded:false,__oldSchema:true}}
  function applyComments(item,rows){
    for(const r of rows||[]){
      const uid=normalizeSqlUserId(r.publisherID||r.publisherId||'');
      if(Number(r.isShare||0)){item.shares=(item.shares||0)+1;continue;}
      if(Number(r.isLike||0)){if(uid)item.likeList.push({userId:uid});continue;}
      const photos=photosFromRow(r);
      if(String(r.comments||'').trim()||photos.length)item.commentList.push({userId:uid,publisherId:uid,datetime:makeDatetime(String(r.date||''),String(r.time||'')),text:String(r.comments||''),comments:String(r.comments||''),photosURL:photos});
    }
  }
  function applyOldBody(item,r){if(!item||!r) return;item.caption=String(r.caption||'');const geo=parseJson(r.geo_json,null);if(geo&&typeof geo==='object'&&isFinite(Number(geo.lat))&&isFinite(Number(geo.lon))) item.geo={name:String(geo.name||''),address:String(geo.address||''),lat:Number(geo.lat),lon:Number(geo.lon)};else{try{delete item.geo}catch(e){item.geo=null}}const slides=parseJson(r.slides_json,[]);const likeList=parseJson(r.likeList_json,[]);const commentList=parseJson(r.commentList_json,[]);item.slides=Array.isArray(slides)?slides:[];item.likeList=Array.isArray(likeList)?likeList:[];item.commentList=Array.isArray(commentList)?commentList:[];item.__bodyLoaded=true}
  async function loadBodies(items){items=(Array.isArray(items)?items:[items]).filter(x=>x&&!x.__bodyLoaded);if(!items.length)return;const groups={};items.forEach(x=>{const f=sqliteName(x.__srcFile);if(f)(groups[f]||(groups[f]=[])).push(x)});for(const f of Object.keys(groups)){const list=groups[f];try{const worker=await getWorker(f);const tables=await queryRows(worker,"SELECT name FROM sqlite_master WHERE type='table'");const names=tables.map(r=>String(r.name||''));const old=list.filter(x=>x.__oldSchema&&x.__rowUid);const modern=list.filter(x=>!x.__oldSchema&&x.__fid);if(modern.length&&names.includes('comments')){const ids=modern.map(x=>String(x.__fid).replace(/'/g,"''"));const rows=await queryRows(worker,'SELECT * FROM comments WHERE FID IN (\''+ids.join("','")+'\') ORDER BY rowid');const map={};rows.forEach(r=>{const k=String(r.FID||'');(map[k]||(map[k]=[])).push(r)});modern.forEach(x=>{applyComments(x,map[String(x.__fid||'')]||[]);x.__bodyLoaded=true;});}if(old.length&&names.includes('feed_body')){const ids=old.map(x=>String(x.__rowUid).replace(/'/g,"''"));const rows=await queryRows(worker,'SELECT row_uid,caption,geo_json,slides_json,likeList_json,commentList_json FROM feed_body WHERE row_uid IN (\''+ids.join("','")+'\')');const map={};rows.forEach(r=>map[String(r.row_uid||'')]=r);old.forEach(x=>applyOldBody(x,map[String(x.__rowUid||'')]))}}catch(e){list.forEach(x=>x.__bodyLoaded=true)}}try{if(typeof normalizeFeedArray==='function') normalizeFeedArray(items)}catch(e){}}
  function replaceFeedArray(items){window.feedArray.length=0;(Array.isArray(items)?items:[]).forEach(x=>window.feedArray.push(x));try{if(typeof normalizeFeedArray==='function') normalizeFeedArray(window.feedArray)}catch(e){}}
  function sortFeedItems(items){(items||[]).sort((a,b)=>(Number(b.ts)||0)-(Number(a.ts)||0)||String(a.__srcFile).localeCompare(String(b.__srcFile))||((a.__itemIndex||0)-(b.__itemIndex||0)));return items}
  async function loadIndex(){if(window.__SQLITE_FEED_INDEX_READY__) return;const files=uniq(getSettingFeedFiles().length?getSettingFeedFiles():['1100.sqlite','909090.sqlite','909091.sqlite','909092.sqlite']);window.__FEED_FILES__=files.slice();window.__DEFAULT_FEED_FILE__=files[0]||'';const all=[];await Promise.all(files.map(async f=>{try{const worker=await getWorker(f);const tables=await queryRows(worker,"SELECT name FROM sqlite_master WHERE type='table'");const names=tables.map(r=>String(r.name||''));let arr=[];if(names.includes('feeds')){const rows=await queryRows(worker,'SELECT rowid AS __rowid__,* FROM feeds ORDER BY date DESC,time DESC,FID DESC');arr=rows.map(r=>mainRowToFeed(r,f))}else if(names.includes('main')){const rows=await queryRows(worker,'SELECT rowid AS __rowid__,* FROM main ORDER BY date DESC,time DESC,rowid DESC');arr=rows.map(r=>mainRowToFeed(r,f))}else if(names.includes('feed_index')){const rows=await queryRows(worker,'SELECT row_uid,source_file,source_sqlite,item_index,publisherId,title,datetime,ts,date,yt,courseLink,courseImage,shares,topics_json,has_caption,has_geo FROM feed_index ORDER BY ts DESC');arr=rows.map(r=>oldIndexToFeed(r,f))}window.__FEED_SOURCE_MAP__[f]=arr;window.__FEED_SOURCE_META__[f]={sqlite:true,url:(window.__SQLITE_FEED_WORKER_URLS__&&window.__SQLITE_FEED_WORKER_URLS__[f])||settingUrl(f),at:Date.now(),version:(window.__SQLITE_FEED_WORKERS__[f]&&window.__SQLITE_FEED_WORKERS__[f].__fullSqliteDb?'sqljs-full-fetch':SQLITE_HTTPVFS_VERSION)};all.push.apply(all,arr)}catch(e){window.__FEED_SOURCE_MAP__[f]=[];window.__FEED_SOURCE_META__[f]={sqlite:true,error:String(e),at:Date.now()}}}));sortFeedItems(all);window.__FULL_FEED_ARRAY__=all.slice();const k=String(window.__CURRENT_TOPIC_FILTER_KEY__||'').trim();replaceFeedArray(k?all.filter(x=>feedItemMatchesTopicKey(x,k)):all);window.__SQLITE_FEED_INDEX_READY__=true;}
  async function loadTopicIndex(key){key=String(key||'').trim();if(!key)return false;window.__CURRENT_TOPIC_FILTER_KEY__=key;const files=uniq(getSettingSqliteFilesFromSettings().length?getSettingSqliteFilesFromSettings():getSettingFeedFiles());const all=[];const needle=topicSqlNeedle(key);await Promise.all(files.map(async f=>{try{const worker=await getWorker(f);const tables=await queryRows(worker,"SELECT name FROM sqlite_master WHERE type='table' AND name='feeds'");if(!tables.length)return;const cols=await queryRows(worker,'PRAGMA table_info(feeds)');const colNames=cols.map(c=>String(c.name||''));const topicCol=colNames.includes('topic')?'topic':(colNames.includes('topics')?'topics':'');if(!topicCol)return;let sql='SELECT rowid AS __rowid__,* FROM feeds';if(needle)sql+=' WHERE "'+topicCol.replace(/"/g,'""')+'" LIKE \'%'+sqlQuote(needle)+'%\'';sql+=' ORDER BY date DESC,time DESC,FID DESC';const rows=await queryRows(worker,sql);const arr=rows.filter(r=>rowTopicMatchesKey(r,key)).map(r=>mainRowToFeed(r,f));all.push.apply(all,arr)}catch(e){}}));sortFeedItems(all);replaceFeedArray(all);window.__TOPIC_FILTER_FEEDS__=all.slice();window.__TOPIC_FILTER_KEY__=key;return true;}
  async function restoreFullIndex(){window.__CURRENT_TOPIC_FILTER_KEY__='';if(!window.__SQLITE_FEED_INDEX_READY__)await loadIndex();const all=Array.isArray(window.__FULL_FEED_ARRAY__)?window.__FULL_FEED_ARRAY__.slice():[];replaceFeedArray(all);return true;}
  window.__loadSqliteFeedBodies=loadBodies;
  window.__loadSqliteFeedsForTopic=loadTopicIndex;
  window.__restoreSqliteFullFeedIndex=restoreFullIndex;
  window.__loadSqliteAllBodiesForSource=async function(src){const f=sqliteName(src);const arr=(window.__FEED_SOURCE_MAP__&&Array.isArray(window.__FEED_SOURCE_MAP__[f]))?window.__FEED_SOURCE_MAP__[f]:[];await loadBodies(arr)};
  window.__sqliteFeedStart=function(){if(window.__SQLITE_FEED_LOADING__) return window.__SQLITE_FEED_LOADING__;window.__SQLITE_FEED_LOADING__=(async()=>{try{await loadIndex();if(typeof renderAllFeeds==='function') await renderAllFeeds()}catch(e){try{if(typeof flashMsg==='function') flashMsg('SQLite 載入失敗')}catch(e2){}}})();return window.__SQLITE_FEED_LOADING__};
  window.__renderAllFeedsIfReady=function(){return window.__sqliteFeedStart()};
})();

const __FALLBACK_AVATAR=_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png';
  function _systemUser(id){return _advUserById(id)||{id:id,name:id,avatar:__FALLBACK_AVATAR}}
  function getSystemNotifs(){const USER0144084=_systemUser('User0144084');const USER0176454=_systemUser('User0176454');return [{img:(USER0144084.avatar||__FALLBACK_AVATAR),html:`<b>系統</b> 恭賀 <b>${USER0144084.name}</b> 晉升教授 <small>2025年8月1日</small>`},{img:(USER0176454.avatar||__FALLBACK_AVATAR),html:`<b>系統</b> 恭賀 <b>${USER0176454.name}</b> 指導 <b>周鈺斌醫師</b> 榮獲學術佳作 <small>2025年8月1日</small>`}]}
  const SYSTEM_NOTIFS=getSystemNotifs();
    let tsCounter=0,selectionMode='user',likeAvatarsSelected=[],selectedTopics=[],advCurrentUserId='User0000002',advCurrentUserName='您',advCurrentUserAvatar=(ADV_USERS['User0000002']&&ADV_USERS['User0000002'].avatar)?ADV_USERS['User0000002'].avatar:'';
  const d=document,qs=(s,p=d)=>p.querySelector(s),qsa=(s,p=d)=>[...p.querySelectorAll(s)];
  const TTS_SUPPORTED=typeof window!=='undefined'&&'speechSynthesis'in window&&'SpeechSynthesisUtterance'in window;
  let expanded=false,mainActionDefaultText='',feedEditState={active:false,item:null,srcFile:'',prevTargetFile:''},advSelectedGeo=null;
  function getTimestamp(a){const s=a!=null?String(a).trim():'';if(!s)return Date.now()+(tsCounter++);const b=Date.parse(s.replace(' ','T'));return isNaN(b)?Date.now()+(tsCounter++):b+(tsCounter++)}
  function initStaticImages(){var u2=_advUserById('User0000002')||{};var u3=_advUserById('User0000003')||{};var av2=(u2.avatar||_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png');var av3=(u3.avatar||_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png');qs('#avatarGuest').src=av2;qs('#profileLogo').src=av2;qs('#postAvatar').src=av3}
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
      if((!Array.isArray(f.likeList)||!f.likeList.length)&&String(f.lecturersID||'').trim()){
        const lecturerIds=String(f.lecturersID||'').split(/[\s,，、|;；]+/).map(x=>x.trim()).filter(Boolean);
        if(lecturerIds.length){
          const n=[],a=[];
          lecturerIds.forEach(uid=>{const u=_advUserById(uid);n.push((u&&u.name)?String(u.name):uid);a.push((u&&u.avatar)?String(u.avatar):(defAv||''));});
          if(!f.likeName.length) f.likeName=n;
          if(!f.likeAvatars.length) f.likeAvatars=a;
          f.likeList=lecturerIds.map(uid=>({userId:uid}));
        }
      }
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
        const uid=c.userId!=null?String(c.userId):(c.publisherId!=null?String(c.publisherId):(c.publisherID!=null?String(c.publisherID):''));
        const dt=c.datetime!=null?String(c.datetime):'';
        const tx=c.text!=null?String(c.text):(c.comments!=null?String(c.comments):(c.comment!=null?String(c.comment):''));
        return {userId:uid||pid,datetime:dt||String(f.datetime||''),text:tx};
      }).filter(Boolean);
      if(typeof f.shares!=='number'||!isFinite(f.shares)) f.shares=0;
      if(!Array.isArray(f.topics)) f.topics=[];
      if(f.geo&&typeof f.geo==='object'){
        const lat=Number(f.geo.lat),lon=Number(f.geo.lon);
        if(isFinite(lat)&&isFinite(lon)){
          f.geo={name:String(f.geo.name||''),address:String(f.geo.address||''),lat:lat,lon:lon};
        }else{
          delete f.geo;
        }
      }
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
    try{if(window&&window.__OSM_FEED_INDEX__!=null){};updateOsmFeedIndexFromFeedArray();}catch(e){}
  }

  function osmLlKey(lat,lon){
    const a=Number(lat),b=Number(lon);
    if(!isFinite(a)||!isFinite(b)) return '';
    return a.toFixed(6)+','+b.toFixed(6);
  }
  function updateOsmFeedIndexFromFeedArray(){
    const idx={};
    const arr=Array.isArray(feedArray)?feedArray:[];
    for(const f of arr){
      const g=f&&f.geo;
      const key=osmLlKey(g&&g.lat,g&&g.lon);
      if(!key) continue;
      if(!idx[key]) idx[key]=[];
      idx[key].push({ts:String(f.ts||''),avatar:String(f.avatar||''),user:String(f.user||''),gName:String((f.geo&&f.geo.name)||''),gAddr:String((f.geo&&f.geo.address)||'')});
    }
    Object.keys(idx).forEach(k=>idx[k].sort((a,b)=>Number(b.ts)-Number(a.ts)));
    window.__OSM_FEED_INDEX__=idx;
    try{window.dispatchEvent(new CustomEvent("osmFeedIndexUpdated"));}catch(e){try{var ev=document.createEvent("Event");ev.initEvent("osmFeedIndexUpdated",true,true);window.dispatchEvent(ev);}catch(e2){}}
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
  img.src = versionedUrl(RAW_GH_BASE + encodeURI(p));
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

function initImageLightboxClicks(){
  if(window.__imageLightboxClicksBound) return;
  window.__imageLightboxClicksBound = true;
  document.addEventListener('click', e=>{
    const img=e.target&&e.target.closest?e.target.closest('.map-ad-gallery img,.post-images img,.caption-gallery img,.caption-slideshow img'):null;
    if(!img) return;
    if(img.dataset && img.dataset.src && img.src===IMG_PLACEHOLDER) loadLazyImage(img);
    const src=(img.dataset&&(img.dataset.fullSrc||img.dataset.src))||(img.currentSrc||img.src);
    if(!src) return;
    e.preventDefault();
    e.stopPropagation();
    openImageLightbox(src,img.getAttribute('alt')||'');
  },true);
}

  initImageLightboxClicks();

  const FEED_BATCH_SIZE = 12;
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

	  let feedGeoMapRetry=0;
	  let feedGeoMapObserver=null;
	  let feedGeoTileIndex=null;
	  let feedGeoTilePickPromise=null;
	  function feedGeoTileSources(){
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
	  }
	  function feedGeoProbeUrl(s){
	    const sd=s&&s.subdomains?String(s.subdomains):'a';
	    const sub=sd?sd[0]:'a';
	    let u=String(s&&s.url||'');
	    u=u.replace('{s}',sub).replace('{z}','0').replace('{x}','0').replace('{y}','0').replace('{r}','');
	    if(!u) return '';
	    return u+(u.includes('?')?'&':'?')+'fg_probe='+(Date.now());
	  }
	  function probeFeedGeoSource(s,timeoutMs){
	    timeoutMs=Number(timeoutMs)||1800;
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
	      const url=feedGeoProbeUrl(s);
	      if(!url){finish(false);return;}
	      img.src=url;
	    });
	  }
	  async function pickFeedGeoTileIndex(){
	    if(feedGeoTileIndex!=null) return feedGeoTileIndex;
	    if(feedGeoTilePickPromise) return feedGeoTilePickPromise;
	    feedGeoTilePickPromise=(async()=>{
	      const sources=feedGeoTileSources();
	      try{
	        const checks=await Promise.all(sources.map(s=>probeFeedGeoSource(s,1800).catch(()=>false)));
	        for(let i=0;i<checks.length;i++){if(checks[i]){feedGeoTileIndex=i;return i;}}
	      }catch(e){}
	      feedGeoTileIndex=0;
	      return 0;
	    })();
	    return feedGeoTilePickPromise;
	  }
	  function makeFeedGeoTiles(L,idx){
	    const sources=feedGeoTileSources();
	    const s=sources[idx]||sources[0];
	    const o=Object.assign({maxZoom:19,attribution:s.attr||'',updateWhenIdle:true,keepBuffer:1},s.opts||{});
	    if(s.subdomains) o.subdomains=s.subdomains;
	    return L.tileLayer(s.url,o);
	  }
	  function initFeedGeoMapOne(el){
	    if(el&&el._feedGeoMap){try{el._feedGeoMap.invalidateSize();}catch(e){};return;}
	    const L=window.L;
	    const lat=Number(el.dataset.lat),lon=Number(el.dataset.lon);
	    if(!isFinite(lat)||!isFinite(lon)) return;
	    let m=null;
	    try{m=L.map(el,{zoomControl:false,attributionControl:false,scrollWheelZoom:false,touchZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false,dragging:false,fadeAnimation:false,zoomAnimation:false,markerZoomAnimation:false,inertia:false});}catch(e){return;}
	    el._feedGeoMap=m;
	    let idx=feedGeoTileIndex!=null?feedGeoTileIndex:0;
	    let tiles=makeFeedGeoTiles(L,idx).addTo(m);
	    let tileOk=false;
	    const onLoad=()=>{tileOk=true;};
	    tiles.on('tileload',onLoad);
	    let tileErr=0,tileErrT=0;
	    const onErr=()=>{
	      const now=Date.now();
	      if(!tileErrT||now-tileErrT>7000){tileErrT=now;tileErr=0;}
	      tileErr++;
	      if(tileErr>=6) switchTiles();
	    };
	    function switchTiles(){
	      const sources=feedGeoTileSources();
	      if(idx>=sources.length-1) return;
	      idx++;
	      feedGeoTileIndex=idx;
	      try{m.removeLayer(tiles);}catch(e){}
	      tiles=makeFeedGeoTiles(L,idx).addTo(m);
	      tileOk=false;
	      tiles.on('tileload',onLoad);
	      tiles.on('tileerror',onErr);
	      tileErr=0;
	      tileErrT=0;
	      setTimeout(()=>{try{m.invalidateSize();}catch(e){}},60);
	    }
	    tiles.on('tileerror',onErr);
	    setTimeout(()=>{if(!tileOk) switchTiles();},2600);
	    try{L.marker([lat,lon]).addTo(m);}catch(e){}
	    try{m.setView([lat,lon],16,{animate:false});}catch(e){}
	    setTimeout(()=>{try{m.invalidateSize();}catch(e){}},60);
	  }
	  function ensureFeedGeoMapObserver(){
	    if(feedGeoMapObserver||!('IntersectionObserver' in window)) return;
	    feedGeoMapObserver=new IntersectionObserver(entries=>{
	      entries.forEach(en=>{
	        if(en.isIntersecting){
	          feedGeoMapObserver.unobserve(en.target);
	          initFeedGeoMapOne(en.target);
	        }
	      });
	    },{root:null,rootMargin:'400px 0px',threshold:0.01});
	  }
	  function initFeedGeoMaps(root){
	    const scope=(root&&root.querySelectorAll)?root:document;
	    const els=scope.querySelectorAll('.feed-geo.is-open .feed-geo-map[data-lat][data-lon]:not([data-geo-init="1"])');
	    if(!els.length) return;
	    if(!(window.L&&typeof window.L.map==='function')){
	      try{if(typeof window.initOsmDiscountMap==='function') window.initOsmDiscountMap();}catch(e){}
	      if(feedGeoMapRetry<8){feedGeoMapRetry++;setTimeout(()=>initFeedGeoMaps(scope),260);}
	      return;
	    }
	    ensureFeedGeoMapObserver();
	    pickFeedGeoTileIndex().catch(()=>{});
	    els.forEach(el=>{
	      el.dataset.geoInit='1';
	      if(feedGeoMapObserver) feedGeoMapObserver.observe(el);
	      else initFeedGeoMapOne(el);
	    });
	  }

  function initFeedGeoToggle(){
    document.addEventListener('click',e=>{
      const head=e.target&&e.target.closest?e.target.closest('.feed-geo-head'):null;
      if(!head) return;
      const wrap=head.closest('.feed-geo');
      if(!wrap) return;
      const open=!wrap.classList.contains('is-open');
      if(open){wrap.classList.add('is-open');head.setAttribute('aria-expanded','true');}else{wrap.classList.remove('is-open');head.setAttribute('aria-expanded','false');}
      if(open) initFeedGeoMaps(wrap);
      const mapEl=wrap.querySelector('.feed-geo-map');
      if(open&&mapEl&&mapEl._feedGeoMap){setTimeout(()=>{try{mapEl._feedGeoMap.invalidateSize();}catch(_){}} ,60);}
    });
    document.addEventListener('keydown',e=>{
      if(e.key!=='Enter'&&e.key!==' ') return;
      const head=e.target&&e.target.closest?e.target.closest('.feed-geo-head'):null;
      if(!head) return;
      e.preventDefault();
      head.click();
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
    const uid=c.userId||c.publisherId||c.publisherID||c.uid||c.id||'';
    const u=advUserById(uid)||{name:'匿名者',avatar:_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png'};
    const text=c.text||c.comments||c.comment||c.content||c.msg||'';
    return `<div class="comment-item"><img src="${esc(u.avatar)}" alt=""><div class="comment-body"><div class="comment-name">${esc(u.name)}</div><div class="comment-text">${esc(text)}</div></div></div>`;
  }

  const TOPIC_META={};
  function refreshTopicMeta(){Object.keys(TOPIC_META).forEach(k=>delete TOPIC_META[k]);(Array.isArray(TOPIC_GROUPS)?TOPIC_GROUPS:[]).forEach(g=>{if(g&&g.id)TOPIC_META[g.id]={id:g.id,name:g.name||g.id,color:g.color||'#0ea5e9'}});return TOPIC_META}
  refreshTopicMeta();
  function parseTopicKey(k){const s=String(k||'');const parts=s.split('::');if(parts.length<2)return{gid:'',topic:s};return{gid:parts[0],topic:parts.slice(1).join('::')}}
  function topicMeta(gid){if((!TOPIC_META[gid])&&Array.isArray(TOPIC_GROUPS)&&TOPIC_GROUPS.length)refreshTopicMeta();return TOPIC_META[gid]||null}
  function topicLabel(k){const p=parseTopicKey(k);const meta=topicMeta(p.gid);const main=meta?meta.name:(p.gid||'分類');const sub=p.topic||'全部';return main+' · '+sub}
  function topicColor(k){const p=parseTopicKey(k);const meta=topicMeta(p.gid);return meta?meta.color:''}
  let activeTopicKey='',activeSearchQuery='',activeBookmarkOnly=false;
  function buildExpandableCaption(html,maxChars=160){
    const temp=document.createElement('div');
    temp.innerHTML=html||'';
    const fullText=captionHtmlToText?captionHtmlToText(html):(temp.textContent||'').trim();
    if(fullText.length<=maxChars){
      return{html,truncated:false,fullText};
    }
    const previewText=fullText.slice(0,maxChars)+'…';
    const previewHtml=`<span class="caption-preview">${esc(previewText).replace(/\n/g,'<br>')}</span>`;
    const moreBtn=`<button type="button" class="more-btn" data-action="expand-caption">顯示更多</button>`;
    return{html:previewHtml+'<div class="more-btn-row">'+moreBtn+'</div>',truncated:true,fullText};
  }
  const buildStory=s=>{if(s&&s.type==='video'){const id=ytIdFromAny(s.yt)||String(s.yt||'').trim();const link=U.YT_EMBED(id||s.yt);const thumb=id?('https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'):'';const bg=thumb||s.img||'';return `<div class="story story-video" data-link="${esc(link)}">`+(bg?`<img class="bg" loading="lazy" src="${esc(bg)}" alt="">`:'' )+`<div class="story-play"><i class="uil uil-play"></i></div><div class="avatar-mini"><img loading="lazy" src="${s.avatar||(_advUserById('User0000002')||{}).avatar||_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png'}" alt=""></div><p>${esc(s.title)}</p></div>`;}return `<div class="story" data-link="${esc(s.link)}"><img class="bg" loading="lazy" src="${esc(s.img)}" alt=""><div class="avatar-mini"><img loading="lazy" src="${s.avatar||(_advUserById('User0000002')||{}).avatar||_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png'}" alt=""></div><p>${esc(s.title)}</p></div>`;};
  function renderStories(){qs('#stories').innerHTML=STORIES.map(buildStory).join('')}
  function buildLink(i){const p=/未完成/.test(i.desc),iconUrl=U.ICON_URL(i.icon),click=i.url?`onclick="window.open('${esc(i.url)}','_blank')"`:'';return`<div class="link-item" data-title="${esc(i.title)}" data-desc="${esc(i.desc)}" ${click}><div class="link-icon"><img src="${iconUrl}" alt=""></div><div class="link-body"><h5>${esc(i.title)}</h5><p class="${p?'pending':''}">${esc(i.desc)}</p></div></div>`}
  function renderCategories(){qs('#quick-categories').innerHTML=Object.keys(QUICK_LINKS).map((c,i)=>`<button data-cat="${esc(c)}" class="${i===0?'active':''}">${esc(c)}</button>`).join('')}
  function renderLinks(c){qs('#links-container').innerHTML=(QUICK_LINKS[c]||[]).map(buildLink).join('')||'<p style="font-size:.75rem;color:var(--c-text-soft);padding:.5rem;">無資料</p>'}
  function normalizeYtConstants(){feedArray.forEach(f=>{if(typeof f.yt==='string'){const s=f.yt.trim();if(/^yt:\s*U\.ELEARNING$/i.test(s)||s==='U.ELEARNING'||s===U.ELEARNING||s.startsWith(U.ELEARNING)||s.includes(U.ELEARNING)){f.yt='U.ELEARNING'}}if(typeof f.shares!=='number')f.shares=0;if(!Array.isArray(f.commentList))f.commentList=[];if(!Array.isArray(f.likeAvatars))f.likeAvatars=[];if(!Array.isArray(f.likeName))f.likeName=[];if(typeof f.likes!=='number')f.likes=f.likeName.length})}
  function captionHtmlToText(html){
    const temp=document.createElement('div');
    temp.innerHTML=html||'';
    temp.querySelectorAll('br').forEach(br=>{br.replaceWith(document.createTextNode('\n'));});
    temp.querySelectorAll('p,div,li,section,article,blockquote,h1,h2,h3,h4,h5,h6,tr').forEach(el=>{
      if(el && el.appendChild) el.appendChild(document.createTextNode('\n'));
    });
    return (temp.textContent||'')
      .replace(/\u00a0/g,' ')
      .replace(/[ \t]+\n/g,'\n')
      .replace(/\n[ \t]+/g,'\n')
      .replace(/[ \t]{2,}/g,' ')
      .replace(/\n{3,}/g,'\n\n')
      .trim();
  }
  function captionCleanLine(s){return String(s||'').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').trim();}
  function captionLinesFromHtml(html){return captionHtmlToText(html).split(/\n+/).map(captionCleanLine).filter(Boolean);}
  function captionLooksLikeBulletLine(line){
    return /^\s*(?:[█•●○◆◇■□▪▫▶▷▸▹✓✔★☆＋+]|[-–—]|(?:\d{1,3}|[A-Za-z])(?:[\.、\)）]))\s*/.test(String(line||''));
  }
  function captionStripBulletMarker(line){
    return captionCleanLine(String(line||'').replace(/^\s*(?:[█•●○◆◇■□▪▫▶▷▸▹✓✔★☆＋+]|[-–—]|(?:\d{1,3}|[A-Za-z])(?:[\.、\)）]))\s*/,'')).trim();
  }
  function captionParagraphsHtml(lines){
    return (lines||[]).map(x=>captionCleanLine(x)).filter(Boolean).map(x=>`<p>${esc(x)}</p>`).join('');
  }
  function beautifyBlockCaptionHtml(html){
    const text=captionHtmlToText(html);
    if((text.match(/█/g)||[]).length<2) return '';
    const rawParts=text.split(/█+/).map(x=>x.trim()).filter(Boolean);
    if(rawParts.length<2) return '';
    let intro='';
    const parts=rawParts.slice();
    if(parts.length && !/^(?:主題|講師|摘要|重點|項目|附件|說明|內容)(?:\s|[:：/／]|$)/.test(parts[0].split(/\n+/)[0]||'')){
      intro=parts.shift();
    }
    const introHtml=intro?`<div class="caption-intro">${esc(intro).replace(/\n/g,'<br>')}</div>`:'';
    const cards=parts.map(part=>{
      const lines=part.split(/\n+/).map(captionCleanLine).filter(Boolean);
      if(!lines.length) return '';
      let title=captionStripBulletMarker(lines.shift());
      let bodyLines=lines;
      if(!bodyLines.length && title.length>42){bodyLines=[title];title='重點';}
      if(!title) title='重點';
      const body=captionParagraphsHtml(bodyLines);
      return `<div class="caption-section-card"><div class="caption-section-title">${esc(title)}</div>${body?`<div class="caption-section-body">${body}</div>`:''}</div>`;
    }).filter(Boolean).join('');
    return cards?`<div class="caption-beautified">${introHtml}${cards}</div>`:'';
  }
  function beautifyBulletCaptionHtml(html){
    const lines=captionLinesFromHtml(html);
    if(lines.length<2) return '';
    const bulletCount=lines.filter(captionLooksLikeBulletLine).length;
    if(bulletCount<2) return '';
    const intro=[];
    const items=[];
    lines.forEach(line=>{
      if(captionLooksLikeBulletLine(line)){
        const txt=captionStripBulletMarker(line);
        if(txt) items.push(txt);
      }else if(items.length){
        items[items.length-1]=(items[items.length-1]+' '+line).trim();
      }else{
        intro.push(line);
      }
    });
    if(items.length<2) return '';
    const introHtml=intro.length?`<div class="caption-intro">${esc(intro.join('\n')).replace(/\n/g,'<br>')}</div>`:'';
    const itemHtml=items.map(x=>`<div class="caption-bullet-item"><span class="caption-bullet-dot"></span><div class="caption-bullet-text">${esc(x)}</div></div>`).join('');
    return `<div class="caption-beautified">${introHtml}<div class="caption-bullet-list">${itemHtml}</div></div>`;
  }
  function beautifyCaptionHtml(html){
    const src=String(html||'').trim();
    if(!src) return '';
    if(/<table\b|<iframe\b|<video\b|<audio\b/i.test(src)) return '';
    return beautifyBlockCaptionHtml(src)||beautifyBulletCaptionHtml(src)||'';
  }
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
    const rawCaptionHtml=temp.innerHTML.trim();
    const captionHtml=beautifyCaptionHtml(rawCaptionHtml)||rawCaptionHtml;
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

      const feedActionHost=()=>{
        const feed=s.closest&&s.closest('.feed');
        if(!feed) return null;
        return [...feed.children].find(el=>el.classList&&el.classList.contains('feed-actions'))||feed.querySelector('.feed-actions');
      };
      const removeCaptionSlideshowMoreButton=()=>{
        const legacy=s.nextElementSibling;
        if(legacy&&legacy.classList&&legacy.classList.contains('caption-slideshow-more')) legacy.remove();
        const feed=s.closest&&s.closest('.feed');
        if(feed) feed.querySelectorAll('.caption-slideshow-more-btn').forEach(btn=>btn.remove());
      };
      const ensureWideMoreButton=()=>{
        removeCaptionSlideshowMoreButton();
        if(!isWideNow() || slides.length<=CAPTION_IMG_PRELOAD_LIMIT) return;
        if(s.dataset.showMoreOpened==='1') return;
        s.classList.add('more-hidden');
        const actions=feedActionHost();
        if(!actions) return;
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='more-btn caption-slideshow-more-btn';
        btn.dataset.action='caption-slideshow-more';
        btn.setAttribute('aria-expanded','false');
        btn.innerHTML='<i class="uil uil-angle-down"></i> 顯示更多';
        btn.addEventListener('click',()=>{
          s.dataset.showMoreOpened='1';
          s.classList.remove('more-hidden');
          eagerLoadDeferredCaptionImages(s);
          btn.remove();
        });
        const right=actions.querySelector(':scope > .right')||actions.querySelector('.right');
        actions.insertBefore(btn,right||actions.firstChild);
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
              removeCaptionSlideshowMoreButton();
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
  const YT_AI_GLOSSARY=['統計學','描述性統計','統計推論','資料型別','資料呈現','直方圖','長條圖','莖葉圖','圓形圖','散佈圖','類別資料','連續資料','間斷資料','名目資料','序位資料','區間資料','比例資料','平均值','中位數','眾數','變異數','標準差','百分位數','四分位差','常態分佈','機率','隨機變數','母體','樣本','抽樣','信賴區間','虛無假說','對立假說','p-value','T-test','F-test','ANOVA','變異數分析','相關係數','正相關','負相關','線性相關','曲線相關','因果關係','Pearson','Spearman','rank','排序','outlier','離群值','迴歸分析','Linear Regression','Simple Linear Regression','Multiple Linear Regression','殘差','R2','Dummy Variable','勝算比','相對危險','敏感度','特異度','ROC'];
  const YT_AI_STOPWORDS=['我們','你們','大家','同學','這個','那個','一個','就是','所以','然後','接下來','其實','可以','可能','如果','因為','但是','這邊','今天','現在','比較','另外','部分','東西','時候','或者','而言','代表','進行','看到','單元小結','單元簡介','小結','簡介','課程','影片','之間','內容','主題','使用','方式'];
  function ytAiEscapeRegExp(s){return String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
  function ytAiHasTimedCaption(text){return /\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(String(text||''))}
  function ytAiTimeToSeconds(v){const m=String(v||'').trim().match(/^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})/);if(!m)return 0;return Number(m[1])*3600+Number(m[2])*60+Number(m[3])+Number(('0.'+m[4]).slice(0,5))}
  function ytAiFormatTime(sec){sec=Math.max(0,Math.floor(Number(sec)||0));const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;const pad=n=>String(n).padStart(2,'0');return h?`${h}:${pad(m)}:${pad(s)}`:`${m}:${pad(s)}`}
  function ytAiShortTitle(title){return String(title||'').replace(/^\s*\d+[.、．-]?\s*/,'').replace(/\s*•\s*$/,'').trim()||'本影片'}
  function ytAiCleanCueText(s){let t=String(s||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/[\u200b\ufeff]/g,'').replace(/\[[^\]]{1,20}\]/g,' ').replace(/\s+/g,' ').trim();if(!t)return'';if(/字幕提供者|請不吝|點贊|訂閱|轉發|打賞|明鏡|片尾|感謝收看/i.test(t))return'';t=t.replace(/^(好|那|所以|接下來|再來|各位同學|同學們?|我們現在)[,，\s]*/,'').trim();return t}
  function ytAiParseTimedCaption(raw,title){const text=String(raw||'').replace(/\r/g,'\n');const blocks=text.split(/\n\s*\n/);const timeRe=/^(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})/;let cues=[],heading='';blocks.forEach(block=>{const lines=String(block||'').split('\n').map(x=>x.trim()).filter(Boolean);if(!lines.length)return;const ti=lines.findIndex(l=>timeRe.test(l));if(ti<0){if(!heading){const h=lines.find(l=>!ttsIsSrtIndexLine(l)&&!ttsIsSrtTimingLine(l));if(h)heading=ytAiCleanCueText(h)}return}const m=lines[ti].match(timeRe);const body=lines.slice(ti+1).map(ytAiCleanCueText).filter(Boolean).join(' ');if(!body)return;const start=ytAiTimeToSeconds(m[1]),end=ytAiTimeToSeconds(m[2]);cues.push({start,end,text:body})});if(!cues.length){const lines=text.split('\n');for(let i=0;i<lines.length;i++){const line=lines[i].trim();const m=line.match(timeRe);if(!m)continue;let body=[];for(let j=i+1;j<lines.length;j++){const n=lines[j].trim();if(timeRe.test(n))break;if(!n)continue;if(ttsIsSrtIndexLine(n))continue;const clean=ytAiCleanCueText(n);if(clean)body.push(clean);if(body.join('').length>80)break}if(body.length)cues.push({start:ytAiTimeToSeconds(m[1]),end:ytAiTimeToSeconds(m[2]),text:body.join(' ')})}}
    cues=cues.filter((c,i,a)=>c.text&&(!i||c.start!==a[i-1].start||c.text!==a[i-1].text));return{title:ytAiShortTitle(title||heading),cues}}
  function ytAiNormalizeSummaryText(s){return String(s||'').replace(/\r/g,'\n').replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/\s+/g,' ').replace(/^[,，。！？；\s]+/,'').trim()}
  function ytAiTrimText(s,maxLen){s=ytAiNormalizeSummaryText(s);if(!maxLen||s.length<=maxLen)return s;let cut=s.slice(0,maxLen);const p=Math.max(cut.lastIndexOf('，'),cut.lastIndexOf('。'),cut.lastIndexOf('；'),cut.lastIndexOf(' '));if(p>maxLen*.55)cut=cut.slice(0,p);return cut.replace(/[，。；、\s]+$/,'')+'…'}
  function ytAiMakeThoughtChunks(text){const raw=String(text||'').replace(/\r/g,'\n');let parts=raw.split(/[\n。！？；!?]+/).map(ytAiNormalizeSummaryText).filter(x=>x&&x.length>3&&!/^\d+$/.test(x));const chunks=[];let buf='';parts.forEach(p=>{if(YT_AI_STOPWORDS.includes(p))return;const next=buf?(buf+'，'+p):p;if(next.length<55){buf=next;return}chunks.push(next);buf=''});if(buf){if(chunks.length&&buf.length<22)chunks[chunks.length-1]+='，'+buf;else chunks.push(buf)}if(!chunks.length&&raw.trim()){let s=ytAiNormalizeSummaryText(raw);while(s.length){chunks.push(s.slice(0,90));s=s.slice(90)}}return chunks}
  function ytAiPickImportantText(text,keywords,maxLen=130){const chunks=ytAiMakeThoughtChunks(text);if(!chunks.length)return'';const scored=chunks.map((p,i)=>{let score=Math.min(p.length,120)/12;keywords.forEach(k=>{if(k&&p.toLowerCase().includes(String(k).toLowerCase()))score+=7});if(/定義|目的|方法|重點|例如|代表|檢定|分析|估計|比較|假說|資料|變數|模式|相關|平均|變異|機率|分佈|結論/.test(p))score+=4;if(/接下來|再來|看一下|這邊|好同學|各位/.test(p))score-=2;return{i,p,score}}).filter(x=>x.p.length>8);let top=scored.sort((a,b)=>b.score-a.score).slice(0,2).sort((a,b)=>a.i-b.i).map(x=>x.p);if(!top.length)top=[chunks[0]];return ytAiTrimText(top.join('；'),maxLen)}
  function ytAiExtractKeywords(text,title,limit=9){const score={};function bad(k){k=String(k||'').trim();if(!k||k.length<2)return true;if(YT_AI_STOPWORDS.includes(k)||YT_AI_STOPWORDS.some(sw=>k.includes(sw)))return true;if(/[\u4e00-\u9fff]/.test(k)){if(/^[的了呢啊嗎吧把在和與或而就以來第所]/.test(k))return true;if(/[的了呢啊嗎吧把在和與或而就以來]$/.test(k))return true;if(/^(以看|來講|地方|這裡|那邊|程度|部分|時候|一樣|不同|很多|一些|所有|目前)$/.test(k))return true;}return false}function add(k,n){k=String(k||'').trim();if(bad(k))return;score[k]=(score[k]||0)+n}YT_AI_GLOSSARY.forEach(k=>{const re=new RegExp(ytAiEscapeRegExp(k),'gi');const m=String(text||'').match(re);if(m&&m.length)add(k,10+m.length*3)});ytAiShortTitle(title).replace(/[（(][^）)]*[）)]/g,'').split(/[\s,，()（）:：/]+/).forEach(k=>add(k,9));(String(text||'').match(/[A-Za-z][A-Za-z0-9-]{2,}(?:\s+[A-Za-z][A-Za-z0-9-]{2,})?/g)||[]).forEach(w=>{const k=w.trim();if(!/^(the|and|with|for|this|that|are|you|our)$/i.test(k))add(k,2)});const freq={};String(text||'').replace(/[^\u4e00-\u9fff]+/g,' ').split(/\s+/).forEach(chunk=>{if(chunk.length<2)return;for(let n=2;n<=4;n++){for(let i=0;i+n<=chunk.length;i++){const k=chunk.slice(i,i+n);if(!bad(k))freq[k]=(freq[k]||0)+1}}});Object.keys(freq).filter(k=>freq[k]>=4).sort((a,b)=>freq[b]-freq[a]).slice(0,16).forEach(k=>add(k,Math.min(8,freq[k])));const sorted=Object.keys(score).sort((a,b)=>score[b]-score[a]||b.length-a.length);const picked=[];for(const k of sorted){const isZh=/[\u4e00-\u9fff]/.test(k);if(isZh&&picked.some(p=>/[\u4e00-\u9fff]/.test(p)&&(p.includes(k)||k.includes(p))))continue;picked.push(k);if(picked.length>=limit)break}return picked}
  function ytAiMakeSegments(cues,keywords,title){if(!Array.isArray(cues)||!cues.length)return[];const duration=Math.max(1,cues[cues.length-1].end||cues[cues.length-1].start||1);const targetCount=duration>900?7:(duration>620?6:5);const targetDur=Math.max(42,Math.min(125,duration/targetCount));const out=[];let buf=[],start=cues[0].start,chars=0;function flush(){if(!buf.length)return;const end=buf[buf.length-1].end;const raw=buf.map(c=>c.text).join('\n');let summary=ytAiPickImportantText(raw,keywords,135);if(!summary)summary=ytAiTrimText(raw,125);out.push({start,end,raw,summary});buf=[];chars=0}cues.forEach(c=>{if(!buf.length)start=c.start;buf.push(c);chars+=String(c.text||'').length;const dur=(c.end||c.start)-start;const boundary=/[。！？；!?]$/.test(c.text||'');if((dur>=targetDur&&chars>90&&(boundary||buf.length>8))||dur>=targetDur*1.35||chars>430)flush()});flush();if(out.length>8){const merged=[];for(let i=0;i<out.length;i+=2){const a=out[i],b=out[i+1];if(!b){merged.push(a);continue}const raw=a.raw+'\n'+b.raw;merged.push({start:a.start,end:b.end,raw,summary:ytAiPickImportantText(raw,keywords,150)||ytAiTrimText(raw,145)})}return merged.slice(0,8)}return out}
  function ytAiFindKeywordTime(keyword,segments){keyword=String(keyword||'').toLowerCase();if(!keyword)return null;const s=(segments||[]).find(x=>String(x.raw||x.summary||'').toLowerCase().includes(keyword));return s?Math.floor(s.start||0):null}
  function ytAiSeekNormalizeText(s){return String(s||'').toLowerCase().replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ').replace(/[\s\u3000,，。．.!！?？;；:：、"'「」『』（）()\[\]{}<>《》【】\-_+=|\\/`~^$#%@&*…⋯]+/g,'')}
  function ytAiSeekNeedles(text){const n=ytAiSeekNormalizeText(text);if(!n||n.length<4)return[];const out=[];const add=x=>{x=String(x||'');if(x.length>=4&&!out.includes(x))out.push(x)};add(n.slice(0,Math.min(34,n.length)));if(n.length<=34)add(n);[30,24,18,14,10,7].forEach(size=>{if(n.length<size)return;const step=Math.max(3,Math.floor(size*.55));for(let i=0;i+size<=n.length;i+=step)add(n.slice(i,i+size));add(n.slice(Math.max(0,n.length-size)))});return out.sort((a,b)=>b.length-a.length).slice(0,90)}
  function ytAiFindTextTime(text,cues,segs,keyword){const needles=ytAiSeekNeedles(text);if(!needles.length)return null;const key=ytAiSeekNormalizeText(keyword);let best=null;function consider(start,body,bonus){const norm=ytAiSeekNormalizeText(body);if(!norm)return;let score=Number(bonus)||0;for(const n of needles){if(norm.includes(n))score+=n.length+(n.length>=18?8:0)}if(key&&norm.includes(key))score+=6;if(score<=0)return;start=Math.max(0,Math.floor(Number(start)||0));if(!best||score>best.score||(score===best.score&&start<best.start))best={start,score}};(Array.isArray(cues)?cues:[]).forEach((c,i,a)=>{let body='';for(let j=i;j<Math.min(a.length,i+5);j++){body+=' '+(a[j].text||'');consider(c.start,body,18-(j-i)*2)}});(Array.isArray(segs)?segs:[]).forEach(s=>consider(s.start,(s.raw||'')+' '+(s.summary||''),4));return best?best.start:null}
  function ytAiResolveQuestionSeek(answer,question,originalSeek,segs,cues){const m=String(question||'').match(/「([^」]{2,80})」/);const key=m?m[1]:'';let hit=ytAiFindTextTime(answer,cues,segs,key);if(hit!=null)return hit;hit=ytAiFindTextTime(question,cues,segs,key);if(hit!=null)return hit;const n=Number(originalSeek);if(isFinite(n)&&n>0)return Math.floor(n);return null}
  function ytAiSentenceForKeyword(keyword,text){keyword=String(keyword||'').trim();if(!keyword)return'';const chunks=ytAiMakeThoughtChunks(text);const hit=chunks.find(c=>c.toLowerCase().includes(keyword.toLowerCase()));return hit?ytAiTrimText(hit,115):''}
  function ytAiQuestionKeyOk(k){
    k=String(k||'').trim();
    if(!k||k.length<2)return false;
    if(/^(影片|課程|內容|主題|方式|部分|問題|地方|來講|以看|這裡|那邊|程度|時候)$/.test(k))return false;
    if(!/[\u4e00-\u9fff]/.test(k))return k.length>=3;
    if(/^[的了呢啊嗎吧把在和與或而就以來第所]/.test(k))return false;
    if(/[的了呢啊嗎吧把在和與或而就以來]$/.test(k))return false;
    return true;
  }
  function ytAiPairKeyOk(k){
    return ytAiQuestionKeyOk(k)&&!/^(統計學|資料呈現|資料的呈現|資料型別)$/.test(String(k||'').trim());
  }
  function ytAiBestKeywordInText(text,keys){
    const t=String(text||'').toLowerCase();
    return (keys||[]).find(k=>ytAiQuestionKeyOk(k)&&t.includes(String(k).toLowerCase()))||'';
  }
  function ytAiQuestionContextForKey(keyword,transcript,segs){
    const low=String(keyword||'').toLowerCase();
    if(!low)return'';
    const chunks=ytAiMakeThoughtChunks(transcript).filter(c=>c.toLowerCase().includes(low));
    if(String(keyword||'').trim()==='統計學'){
      const direct=chunks.find(c=>/什麼是統計學|統計學的目的|統計學是|統計學這門/.test(c));
      if(direct)return ytAiTrimText(direct,180);
    }
    if(chunks.length){
      const scored=chunks.map((c,i)=>{let score=Math.min(c.length,140)/18;
        if(/定義|意思|是指|叫做|稱為|英文叫|代表/.test(c))score+=18;
        if(/主要|用來|用途|目的|適用|呈現|描述|分析|估計|檢定|預測|判斷|選擇|解決|重點|結論/.test(c))score+=14;
        if(/差異|不同|不一樣|比較|相反|對比|區分|關係|限制|不能|不可以|避免|注意/.test(c))score+=12;
        if(/例如|譬如|假設|舉例/.test(c))score+=5;
        if(/接下來|再來|這邊|好同學|各位|有關|可能|稍微/.test(c))score-=5;
        return{c,i,score};
      }).sort((a,b)=>b.score-a.score||a.i-b.i);
      return ytAiTrimText(scored[0].c,180);
    }
    const hit=(segs||[]).find(s=>String((s.raw||'')+' '+(s.summary||'')).toLowerCase().includes(low));
    return hit?ytAiTrimText(hit.summary||hit.raw,180):'';
  }
  function ytAiPairContext(a,b,transcript,segs){
    const al=String(a||'').toLowerCase(),bl=String(b||'').toLowerCase();
    if(!al||!bl)return'';
    function trimPair(c){
      const low=String(c||'').toLowerCase();
      const ia=low.indexOf(al),ib=low.indexOf(bl);
      let pos=Math.min(ia<0?Infinity:ia,ib<0?Infinity:ib);
      if(!isFinite(pos))return ytAiTrimText(c,220);
      let start=0;
      ['。','；','！','？','，'].forEach(mark=>{const p=String(c).lastIndexOf(mark,pos);if(p>=0&&pos-p<36)start=Math.max(start,p+1)});
      return ytAiTrimText(String(c).slice(start).replace(/^\s*(那|所以|而|但是|可是|不過)[，,\s]*/,''),220);
    }
    const chunks=ytAiMakeThoughtChunks(transcript);
    const hits=chunks.filter(c=>{const low=c.toLowerCase();return low.includes(al)&&low.includes(bl)});
    if(!hits.length)return'';
    const scored=hits.map((c,i)=>{let score=Math.min(c.length,160)/20;
      if(/差異|不同|不一樣|比較|相反|對比|區分|關係|但是|可是|而|不過|適用|用來/.test(c))score+=18;
      if(/定義|代表|目的|檢定|估計|呈現|描述|主要|解決/.test(c))score+=8;
      return{c,i,score};
    }).sort((x,y)=>y.score-x.score||x.i-y.i);
    return trimPair(scored[0].c);
  }
  function ytAiQuestionTitleForKey(keyword,context){
    const k=String(keyword||'').trim();
    const c=String(context||'');
    if(/定義|意思|是指|叫做|稱為|英文叫/.test(c))return `「${k}」的核心定義或意思是什麼？`;
    if(/限制|不能|不可以|避免|注意/.test(c))return `使用或判斷「${k}」時，最需要注意什麼？`;
    if(/主要|用來|用途|目的|呈現|描述|分析|估計|檢定|預測|解決|適用|選擇|判斷|條件|應該|什麼時候/.test(c))return `「${k}」在本片中主要用來說明或解決什麼？`;
    if(/差異|不同|不一樣|比較|相反|對比|區分|關係/.test(c))return `本片如何區分與「${k}」相關的概念？`;
    return `本片提到「${k}」時，要掌握哪個核心觀念？`;
  }
  function ytAiBuildQuestions(data){
    const title=data.title||'本影片';
    const segs=Array.isArray(data.segments)?data.segments:[];
    const keys=(data.keywords||[]).filter(ytAiQuestionKeyOk);
    const transcript=data.transcript||'';
    const qs=[];
    function add(q,a,seek,tag){
      q=ytAiTrimText(String(q||'').replace(/\s+/g,' ').trim(),120);
      a=ytAiTrimText(String(a||'').replace(/^答案[:：]?\s*/,'').trim(),220);
      if(!q||!a||a.length<10)return;
      if(/\d{1,2}:\d{2}/.test(q))return;
      if(/學習目標|時間軸題|填空|＿＿/.test(q))return;
      if(qs.some(x=>x.q===q||x.a===a))return;
      qs.push({q,a,seek:ytAiResolveQuestionSeek(a,q,seek,segs,data.cues),tag:tag||'重點'});
    }
    const pairKeys=keys.filter(ytAiPairKeyOk);
    outer:for(let i=0;i<Math.min(pairKeys.length,6)&&qs.length<1;i++){
      for(let j=i+1;j<Math.min(pairKeys.length,7)&&qs.length<1;j++){
        const a=pairKeys[i],b=pairKeys[j];
        const ctx=ytAiPairContext(a,b,transcript,segs);
        if(ctx&&ctx.length>18){add(`請說明「${a}」與「${b}」之間的關係或差異。`,ctx,ytAiFindKeywordTime(a,segs),'整合');break outer;}
      }
    }
    keys.slice(0,5).forEach(k=>{
      if(qs.length>=3)return;
      const ctx=ytAiQuestionContextForKey(k,transcript,segs);
      if(ctx)add(ytAiQuestionTitleForKey(k,ctx),ctx,ytAiFindKeywordTime(k,segs),'概念');
    });
    const applySeg=segs.find(s=>/適用|選擇|判斷|限制|不能|不可以|需要|避免|注意|重點|結論|檢定|估計|解釋|資料|變數|模式/.test(String(s.raw||s.summary||'')))||segs[0];
    if(qs.length<3&&applySeg){
      const k=ytAiBestKeywordInText((applySeg.raw||'')+' '+(applySeg.summary||''),keys)||keys[0]||title;
      add(`遇到「${k}」相關題目時，應該根據哪些條件做判斷？`,applySeg.summary||data.overview||'',applySeg.start,'應用');
    }
    const last=segs.slice().reverse().find(s=>String(s.summary||'').length>12)||segs[segs.length-1];
    if(qs.length<3&&last)add('學完本片後，最需要帶走的結論或操作重點是什麼？',last.summary||data.overview||'',last.start,'整理');
    if(!qs.length&&data.overview)add(`請整理「${title}」的關鍵概念。`,data.overview,0,'整理');
    return qs.slice(0,4);
  }
  function ytAiRenderCaption(data){
    const segs=data.segments||[];
    const firstThree=segs.slice(0,3);
    const previewSegs=segs.slice(0,Math.min(2,segs.length));
    const renderSegments=(list,compact=false)=>list.map((s,i)=>`<span class="yt-ai-segment yt-ai-seek yt-ai-readable" data-ai-seek="${Math.floor(s.start||0)}" role="button" tabindex="0" aria-label="跳到 ${ytAiFormatTime(s.start)}"><span class="yt-ai-time"><i class="uil uil-play-circle"></i>${ytAiFormatTime(s.start)}</span><span class="yt-ai-segment-text">${esc(compact?ytAiTrimText(s.summary,86):s.summary)}</span></span>${i<list.length-1?'<span class="yt-ai-sep"></span>':''}`).join('');
    const segmentHtml=renderSegments(segs,false);
    const segmentPreviewHtml=renderSegments(previewSegs.length?previewSegs:segs,true);
    const outline=firstThree.map(s=>`<li><span class="yt-ai-seek" data-ai-seek="${Math.floor(s.start||0)}" role="button" tabindex="0" aria-label="跳到 ${ytAiFormatTime(s.start)}">${esc(ytAiTrimText(s.summary,78))}</span></li>`).join('');
    const reminders=(data.keywords||[]).slice(0,4).map(k=>`<li>掌握「${esc(k)}」的定義、例子、使用條件與限制。</li>`).join('')||'<li>先看學習大綱，再逐段點時間軸回影片確認。</li>';
    const questions=Array.isArray(data.questions)?data.questions:[];
    const quiz=questions.map((q,i)=>`<details><summary><span>${i+1}</span>${esc(q.q)}</summary><p>${q.seek!=null?`<button type="button" class="yt-ai-jump" data-ai-seek="${Math.floor(q.seek)}"><i class="uil uil-play"></i> 跳到 ${ytAiFormatTime(q.seek)}</button>`:''} ${esc(q.a)}</p></details>`).join('');
    const previewItems=[];
    [data.overview].concat(segs.map(s=>s.summary)).forEach(t=>{t=ytAiTrimText(t,92);if(t&&!previewItems.some(x=>x===t||x.includes(t)||t.includes(x)))previewItems.push(t)});
    const previewHtml=previewItems.length?`<div class="yt-ai-preview"><ul class="yt-ai-preview-list">${previewItems.slice(0,3).map(t=>`<li>${esc(t)}</li>`).join('')}</ul></div>`:'';
    return `<div class="yt-ai-panel" data-ai-caption="1"><div class="yt-ai-section"><h5><i class="uil uil-map"></i> 整理</h5><div class="yt-ai-segments" data-ai-segments="preview">${segmentPreviewHtml}</div><template data-ai-segments-preview>${segmentPreviewHtml}</template><template data-ai-segments-full>${segmentHtml}</template></div><div class="yt-ai-more-body"><div class="yt-ai-grid"><div class="yt-ai-card"><h6><i class="uil uil-route"></i> 學習大綱</h6><ol>${outline||'<li>先看核心摘要，再逐段回影片複習。</li>'}</ol></div><div class="yt-ai-card"><h6><i class="uil uil-lightbulb-alt"></i> 重點</h6><ul>${reminders}</ul></div></div><div class="yt-ai-quiz"><h5><i class="uil uil-question-circle"></i> 練習題</h5>${quiz}</div></div></div>`;
  }
  function ytAiCaptionSource(item){return String((item&&item.srt)||'')||String((item&&item.caption)||'');}
  function ytAiBuildCaptionData(item){if(!item)return null;const src=ytAiCaptionSource(item);if(!ytAiHasTimedCaption(src))return null;if(item.__ytAiCache&&item.__ytAiCache.src===src)return item.__ytAiCache.data;const parsed=ytAiParseTimedCaption(src,item.title);if(!parsed.cues.length)return null;const transcript=parsed.cues.map(c=>c.text).join('\n');const title=ytAiShortTitle(item.title||parsed.title);const keywords=ytAiExtractKeywords(transcript,title,9);const segments=ytAiMakeSegments(parsed.cues,keywords,title);const duration=Math.max(0,parsed.cues[parsed.cues.length-1].end||0);const overview=(segments[0]&&segments[0].summary)?ytAiTrimText(segments[0].summary,155):(ytAiPickImportantText(transcript,keywords,155)||ytAiTrimText(transcript,150));const data={title,cues:parsed.cues,transcript,keywords,segments,duration,overview,questions:[]};data.questions=ytAiBuildQuestions(data);try{Object.defineProperty(item,'__ytAiCache',{value:{src,data},configurable:true,writable:true,enumerable:false})}catch(e){item.__ytAiCache={src,data}}return data}
  function buildAiYoutubeCaption(item){const data=ytAiBuildCaptionData(item);return data?ytAiRenderCaption(data):''}

  const ELEARNING_FALLBACK_IMAGE='https://elearning.xms.cch.org.tw/sysdata/course/393/8d9a_m.jpg';
  function elearningCourseUrlFrom(item,html,ytStr){
    const vals=[];
    try{vals.push(item&&item.xmsIDURL,item&&item.courseLink,item&&item.link,item&&item.url,item&&item.href,ytStr,html,item&&item.caption,item&&item.yt)}catch(e){}
    for(const v of vals){
      const s=String(v||'').trim();
      let m=s.match(/https?:\/\/elearning\.xms\.cch\.org\.tw\/course\/(\d+)/i);
      if(m) return 'https://elearning.xms.cch.org.tw/course/'+m[1];
      m=s.match(/(?:^|[?&])courseId=(\d+)|^(\d{3,8})$/i);
      if(m) return 'https://elearning.xms.cch.org.tw/course/'+(m[1]||m[2]);
    }
    return '';
  }
  function elearningImageFrom(item,html){
    const candidates=[];
    try{
      if(item&&Array.isArray(item.slides)) item.slides.forEach(x=>candidates.push(x));
      if(item&&Array.isArray(item.images)) item.images.forEach(x=>candidates.push(x));
      if(item){candidates.push(item.courseImage,item.image,item.img,item.thumb,item.thumbnail)}
    }catch(e){}
    const m=String(html||'').match(/<img\b[^>]*\bsrc=(['"])(.*?)\1[^>]*>/i)||String(html||'').match(/<img\b[^>]*\bsrc=([^\s>]+)[^>]*>/i);
    if(m) candidates.push(m[2]||m[1]||'');
    const hit=candidates.map(x=>String(x||'').trim().replace(/^['"]|['"]$/g,'')).find(x=>x&&!/^data:image\/gif/i.test(x));
    return hit||ELEARNING_FALLBACK_IMAGE;
  }
  function cleanElearningCaptionHtml(html){
    let s=String(html||'');
    s=s.replace(/<img\b[^>]*>/gi,'');
    s=s.replace(/(?:^|\s*<br\s*\/?>(?:\s|&nbsp;)*)課程日期：[^<]*(?:<br\s*\/?>)?/gi,'');
    s=s.replace(/(?:^|\s*<br\s*\/?>(?:\s|&nbsp;)*)課程連結：\s*(?:<a\b[^>]*>[\s\S]*?<\/a>|https?:\/\/elearning\.xms\.cch\.org\.tw\/course\/\d+)[\s\S]*?(?=(?:<br\s*\/?>|$))/gi,'');
    s=s.replace(/(?:<br\s*\/?>\s*)?課程連結：\s*<a\b[^>]*>[\s\S]*?<\/a>\s*(?:<br\s*\/?>)?/gi,'');
    s=s.replace(/(?:<br\s*\/?>\s*){2,}/gi,'<br>');
    s=s.replace(/^(?:\s|&nbsp;|<br\s*\/?>)+/gi,'').replace(/(?:\s|&nbsp;|<br\s*\/?>)+$/gi,'');
    return s.trim();
  }
  function elearningPlainText(item){
    const temp=document.createElement('div');
    temp.innerHTML=cleanElearningCaptionHtml((item&&item.caption)||'');
    Array.from(temp.querySelectorAll('br')).forEach(br=>{br.parentNode&&br.parentNode.insertBefore(document.createTextNode('\n'),br);br.remove();});
    return (temp.textContent||'').replace(/課程簡介[:：]?/g,'').replace(/附件[:：]/g,'附件：').replace(/\u00a0/g,' ').replace(/[ \t]+/g,' ').replace(/\n[ \t]+/g,'\n').trim();
  }
  function elearningTextChunks(text,title){
    let t=String(text||'').replace(/\r/g,'\n');
    t=t.replace(/[。！？；]/g,m=>m+'\n').replace(/█/g,'\n').replace(/【/g,'\n【');
    let lines=t.split(/\n+/).map(x=>x.replace(/^[-•*\d\.、\s]+/,'').replace(/\s+/g,' ').trim()).filter(Boolean);
    lines=lines.filter(x=>!/^附件：?$/i.test(x)&&!/\.(pptx?|pdf|mp4|ecm)\s*\(/i.test(x));
    const out=[];
    lines.forEach(x=>{
      x=x.replace(/^課程摘要[:：]?\s*/,'').replace(/^摘要內容\s*/,'').replace(/^摘要[:：]?\s*/,'').trim();
      if(!x) return;
      if(x.length<8&&out.length) out[out.length-1]=(out[out.length-1]+' '+x).trim();
      else if(!out.some(y=>y===x||y.includes(x)||x.includes(y))) out.push(x);
    });
    if(!out.length&&String(title||'').trim()) out.push(String(title).trim());
    return out.slice(0,8);
  }
  function elearningNormalizeLabel(label){
    let s=String(label||'').replace(/\s+/g,'').trim();
    const map={主講人:'講師',授課講師:'講師',課程摘要:'摘要',摘要內容:'摘要',課程內容:'內容',課程介紹:'介紹',課程說明:'說明',學習目標:'目標',課程目標:'目標',適用對象:'對象'};
    s=map[s]||s;
    return /^(講師|摘要|內容|介紹|說明|目標|大綱|對象|附件|關鍵字|時數)$/.test(s)?s:'';
  }
  function elearningParseLabelSections(html){
    let text=captionHtmlToText(html).replace(/^\s*課程簡介[:：]?\s*/,'').replace(/\r/g,'\n');
    text=text.replace(/([^\n])\s*(【[^】]{1,16}】)/g,'$1\n$2').replace(/(【[^】]{1,16}】)/g,'\n$1');
    const lines=text.split(/\n+/).map(captionCleanLine).filter(Boolean);
    const sections=[];
    const intro=[];
    let current=null;
    lines.forEach(line=>{
      const m=line.match(/^【([^】]{1,16})】\s*(.*)$/);
      if(m){
        const label=elearningNormalizeLabel(m[1]);
        if(label){
          current={title:label,lines:[]};
          if(m[2]) current.lines.push(m[2]);
          sections.push(current);
          return;
        }
      }
      line=line.replace(/^課程簡介[:：]?\s*/,'').trim();
      if(!line) return;
      if(current) current.lines.push(line);
      else intro.push(line);
    });
    return{intro,sections:sections.filter(s=>s.lines&&s.lines.some(Boolean))};
  }
  function elearningJoinText(a,b){
    a=String(a||'').trim();
    b=String(b||'').trim();
    if(!a) return b;
    if(!b) return a;
    const noSpace=/[\u4e00-\u9fff）)】]$/.test(a)&&/^[\u4e00-\u9fff（(【]/.test(b);
    return (a+(noSpace?'':' ')+b).replace(/\s+([,.;:!?，。；：！？])/g,'$1').replace(/([（(【])\s+/g,'$1').trim();
  }
  function elearningLooksHeading(text){
    const s=String(text||'').trim();
    if(!s||s.length>70) return false;
    if(/[。！？!?；;.:：，,]$/.test(s)) return false;
    if(/^[A-Z][A-Za-z0-9()／\/\-, ]+$/.test(s)){
      const words=s.split(/\s+/).filter(Boolean);
      return words.length<=6&&words.some(w=>/^[A-Z]/.test(w));
    }
    return /^[\u4e00-\u9fffA-Za-z0-9\s（）()／\/-]{2,24}$/.test(s);
  }
  function elearningStartsSentence(text){
    return /^[A-Z0-9\u4e00-\u9fff「『\"']/.test(String(text||'').trim());
  }
  function elearningShouldStartParagraph(prev,line){
    const p=String(prev||'').trim();
    const x=String(line||'').trim();
    if(!p||!x) return false;
    if(captionLooksLikeBulletLine(x)) return true;
    if(elearningLooksHeading(p)&&x.length>40) return true;
    if(/[。！？!?；;.]$/.test(p)&&elearningStartsSentence(x)) return true;
    return false;
  }
  function elearningParagraphsFromLines(lines){
    const out=[];
    let buf='';
    const flush=()=>{const x=captionCleanLine(buf);if(x)out.push(x);buf='';};
    (lines||[]).forEach(line=>{
      line=captionCleanLine(line);
      if(!line) return;
      if(captionLooksLikeBulletLine(line)){
        flush();
        out.push(captionStripBulletMarker(line));
        return;
      }
      if(!buf) buf=line;
      else if(elearningShouldStartParagraph(buf,line)){flush();buf=line;}
      else buf=elearningJoinText(buf,line);
    });
    flush();
    return out.filter(Boolean).slice(0,18);
  }
  function elearningSectionCardHtml(title,lines){
    const paragraphs=elearningParagraphsFromLines(lines);
    if(!paragraphs.length) return '';
    return `<div class="caption-section-card elearning-section-card"><div class="caption-section-title">${esc(title)}</div><div class="caption-section-body">${paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div></div>`;
  }
  function beautifyElearningCaptionHtml(html,title){
    const parsed=elearningParseLabelSections(html);
    if(!parsed.sections.length) return '';
    const intro=elearningParagraphsFromLines(parsed.intro).map(p=>`<p>${esc(p)}</p>`).join('');
    const introHtml=intro?`<div class="caption-intro">${intro}</div>`:'';
    const cards=parsed.sections.map(s=>elearningSectionCardHtml(s.title,s.lines)).filter(Boolean).join('');
    return cards?`<div class="caption-beautified elearning-caption">${introHtml}${cards}</div>`:'';
  }
  function elearningFallbackCaptionHtml(text,title){
    let lines=elearningTextChunks(text,title).filter(Boolean);
    if(!lines.length&&String(title||'').trim()) lines=[String(title).trim()];
    const body=elearningParagraphsFromLines(lines).slice(0,10);
    if(!body.length) return '';
    return `<div class="caption-beautified elearning-caption">${elearningSectionCardHtml('課程簡介',body)}</div>`;
  }
  function elearningCaptionPanelHtml(courseLink,bodyHtml){
    return `<div class="yt-ai-panel" data-ai-caption="elearning" data-course-link="${esc(courseLink)}"><div class="yt-ai-section"><h5><i class="uil uil-book-open"></i> 課程簡介</h5><div class="yt-ai-segments" data-ai-segments="preview">${bodyHtml}</div><template data-ai-segments-preview>${bodyHtml}</template><template data-ai-segments-full>${bodyHtml}</template></div></div>`;
  }
  function buildElearningCourseCaption(item,courseLink){
    courseLink=courseLink||elearningCourseUrlFrom(item,(item&&item.caption)||'',(item&&item.yt)||'');
    if(!courseLink) return '';
    const title=displayFeedTitle(item)||'數位學習課程';
    const cleaned=cleanElearningCaptionHtml((item&&item.caption)||'');
    const prettyCaption=beautifyElearningCaptionHtml(cleaned,title)||beautifyCaptionHtml(cleaned);
    if(prettyCaption) return elearningCaptionPanelHtml(courseLink,prettyCaption);
    const text=elearningPlainText(item);
    const fallback=elearningFallbackCaptionHtml(text,title);
    return fallback?elearningCaptionPanelHtml(courseLink,fallback):'';
  }
  function seekFeedVideo(feed,seconds){seconds=Math.max(0,Math.floor(Number(seconds)||0));try{if(TTSPlayer.currentFeed===feed)TTSPlayer.cancel()}catch(e){}const wrap=feed&&feed.querySelector?feed.querySelector('.video-wrapper'):null;if(!wrap)return false;if(feed&&feed.classList)feed.classList.add('feed-ai-expanded');const native=wrap.querySelector('video');if(native){try{native.currentTime=seconds;native.play&&native.play()}catch(e){}try{wrap.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}return true}const lazy=wrap.querySelector('.yt-lazy');if(lazy){activateYtLazy(lazy,seconds,true);try{wrap.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}return true}const iframe=wrap.querySelector('iframe');if(iframe){try{iframe.contentWindow.postMessage(JSON.stringify({event:'command',func:'seekTo',args:[seconds,true]}),'*');iframe.contentWindow.postMessage(JSON.stringify({event:'command',func:'playVideo',args:[]}),'*')}catch(e){}try{const u=new URL(iframe.src,location.href);if(u.searchParams.get('enablejsapi')!=='1'){u.searchParams.set('enablejsapi','1');u.searchParams.set('start',String(seconds));u.searchParams.set('autoplay','1');iframe.src=u.toString()}}catch(e){}try{wrap.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}return true}return false}
  function setAiPanelOpen(panel,open){
    if(!panel) return;
    open=!!open;
    panel.classList.toggle('is-open',open);
    const box=panel.querySelector('.yt-ai-segments');
    if(box){
      const mode=open?'full':'preview';
      const tpl=panel.querySelector(open?'template[data-ai-segments-full]':'template[data-ai-segments-preview]');
      if(tpl&&box.dataset.aiSegments!==mode){
        box.innerHTML=tpl.innerHTML;
        box.dataset.aiSegments=mode;
      }
    }
    const feed=panel.closest('.feed');
    const btn=(feed&&feed.querySelector('[data-ai-more]'))||panel.querySelector('[data-ai-more]');
    if(btn){
      btn.innerHTML=open?'<i class="uil uil-angle-up"></i> 收合':'<i class="uil uil-angle-down"></i> 顯示更多';
      btn.setAttribute('aria-expanded',open?'true':'false');
    }
    if(feed) feed.classList.toggle('feed-ai-expanded',open);
  }
  function initAiYoutubeTools(){
    if(document.__ytAiToolsBound)return;
    document.__ytAiToolsBound=true;
    document.addEventListener('click',e=>{
      const more=e.target.closest('[data-ai-more]');
      if(more){
        const feed=more.closest('.feed');
        const panel=more.closest('.yt-ai-panel')||(feed&&feed.querySelector('.yt-ai-panel'));
        if(panel){
          e.preventDefault();
          setAiPanelOpen(panel,!panel.classList.contains('is-open'));
        }
        return;
      }
      const target=e.target.closest('[data-ai-seek]');
      if(!target)return;
      const feed=target.closest('.feed');
      if(!feed)return;
      const sec=Number(target.dataset.aiSeek||0);
      if(!isFinite(sec))return;
      e.preventDefault();
      const panel=target.closest('.yt-ai-panel');
      if(panel) setAiPanelOpen(panel,true);
      seekFeedVideo(feed,sec);
    });
    document.addEventListener('keydown',e=>{
      if(e.key!=='Enter'&&e.key!==' ')return;
      const more=e.target.closest('[data-ai-more]');
      if(more){e.preventDefault();more.click();return;}
      const target=e.target.closest('[data-ai-seek]');
      if(!target)return;
      const feed=target.closest('.feed');
      if(!feed)return;
      e.preventDefault();
      const panel=target.closest('.yt-ai-panel');
      if(panel) setAiPanelOpen(panel,true);
      seekFeedVideo(feed,Number(target.dataset.aiSeek||0));
    });
  }

  function datePartsFromValue(v){
    const s=String(v||'').trim();
    if(!s) return null;
    let m=s.match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
    if(!m) m=s.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})[日號]?/);
    if(!m) return null;
    const y=Number(m[1]),mo=Number(m[2]),d2=Number(m[3]);
    if(!isFinite(y)||!isFinite(mo)||!isFinite(d2)||mo<1||mo>12||d2<1||d2>31) return null;
    return {y,mo,d:d2};
  }
  function duplicateDateVariants(v){
    const p=datePartsFromValue(v);
    if(!p) return [];
    const y=String(p.y),m=String(p.mo),d2=String(p.d),mm=m.padStart(2,'0'),dd=d2.padStart(2,'0');
    const out=[
      `${y}-${mm}-${dd}`,`${y}/${mm}/${dd}`,`${y}.${mm}.${dd}`,`${y}${mm}${dd}`,
      `${y}-${m}-${d2}`,`${y}/${m}/${d2}`,`${y}.${m}.${d2}`,
      `${y}年${m}月${d2}日`,`${y}年${mm}月${dd}日`,`${y}年${m}月${d2}號`,`${y} 年 ${m} 月 ${d2} 日`
    ];
    const roc=p.y-1911;
    if(roc>0){
      const r=String(roc);
      out.push(`${r}-${mm}-${dd}`,`${r}/${mm}/${dd}`,`${r}.${mm}.${dd}`,`${r}-${m}-${d2}`,`${r}/${m}/${d2}`,`${r}年${m}月${d2}日`,`${r}年${mm}月${dd}日`);
    }
    return out.filter((x,i,a)=>x&&a.indexOf(x)===i).sort((a,b)=>b.length-a.length);
  }
  function stripDuplicateDateFromTitle(title,dateLike){
    const raw=String(title||'').replace(/\s*•\s*$/,'').trim();
    if(!raw) return '';
    const variants=duplicateDateVariants(dateLike);
    if(!variants.length) return raw;
    let rest=raw;
    let prefix='';
    const tagMatch=rest.match(/^(?:\s*[【\[\(（][^】\]\)）]{1,28}[】\]\)）]\s*)+/);
    if(tagMatch){prefix=tagMatch[0];rest=rest.slice(prefix.length).trimStart();}
    for(const v of variants){
      if(rest.startsWith(v)){
        const cleaned=rest.slice(v.length).replace(/^[\s_\-－–—:：|｜、．.]+/,'').trim();
        return (prefix+cleaned).replace(/\s{2,}/g,' ').trim()||raw;
      }
    }
    return raw;
  }
  function displayFeedTitle(item){
    if(!item) return '';
    return stripDuplicateDateFromTitle(item.title||'', item.datetime||item.date||'');
  }

  function buildFeed(f){
    const isElearning=f.yt==='U.ELEARNING';
    const ytRaw=isElearning?U.ELEARNING:f.yt;
    const likeAvatars=Array.isArray(f.likeAvatars)?f.likeAvatars:[];
    const likeNames=Array.isArray(f.likeName)?f.likeName.filter(Boolean):[];
    const topics=Array.isArray(f.topics)?f.topics:[];
    const ytStr=String(ytRaw||'').trim();
    const rawCaption=f.caption||'';
    const courseLink=elearningCourseUrlFrom(f,rawCaption,ytStr);
    const isCourseCard=!!courseLink;
    const courseThumb=isCourseCard?elearningImageFrom(f,rawCaption):'';
    const ytId=!isElearning&&!isCourseCard?ytIdFromAny(ytStr):'';
    const isVideoFile=!isCourseCard&&isVideoFileLike(ytStr);
    const isHttp=ytStr.startsWith('http');
    const isLinkOnly=isHttp&&!ytId&&!isVideoFile;
    const isAiCourseMeta=!!(isElearning||isCourseCard||courseLink||(typeof ytRaw==='string'&&String(ytRaw).startsWith(U.ELEARNING)));
    const video=isCourseCard?`<div class="video-wrapper course-video-wrapper" data-course-link="${esc(courseLink)}"><div class="yt-lazy course-lazy" data-course-link="${esc(courseLink)}" role="button" tabindex="0" aria-label="開啟課程連結"><img loading="lazy" src="${esc(courseThumb)}" alt=""><div class="yt-play"><i class="uil uil-play"></i></div></div></div>`:(ytId?`<div class="video-wrapper" data-yt-id="${esc(ytId)}"><div class="yt-lazy" data-yt-id="${esc(ytId)}" role="button" tabindex="0" aria-label="播放影片"><img loading="lazy" src="https://i.ytimg.com/vi/${ytId}/hqdefault.jpg" alt=""><div class="yt-play"><i class="uil uil-play"></i></div></div></div>`:(isVideoFile?`<div class="video-wrapper"><video controls playsinline src="${esc(ytStr)}"></video></div>`:''));
    const plainCaption=stripHtml(rawCaption);
    const hasCaptionMedia=/<img\b/i.test(String(rawCaption||''));
    const speakableCaption=ttsCleanDisplayText(plainCaption);
    const aiCaptionHtml=buildAiYoutubeCaption(f)||(isCourseCard?buildElearningCourseCaption(f,courseLink):'');
    const hasSeparateSrt=!!String(f.srt||'').trim();
    const normalizedMedia=(!aiCaptionHtml||hasSeparateSrt)?normalizeCaptionMedia(rawCaption):null;
    const hasBeautifiedCaption=!!(normalizedMedia&&/caption-beautified/.test(normalizedMedia.captionHtml||''));
    const isTruncated=!aiCaptionHtml&&!hasBeautifiedCaption&&plainCaption.length>160;
    let captionRenderHtml='';
    const needPlayer=!!(speakableCaption.length||hasCaptionMedia||String(f.title||'').trim().length);
    if(aiCaptionHtml&&hasSeparateSrt&&String(rawCaption||'').trim()){
      const media=normalizedMedia||normalizeCaptionMedia(rawCaption);
      captionRenderHtml=(media.captionHtml||'')+(media.imagesHtml||'')+aiCaptionHtml;
    }else if(aiCaptionHtml){
      captionRenderHtml=aiCaptionHtml;
    }else if(isTruncated){
      const previewText=plainCaption.slice(0,160)+'…';
      captionRenderHtml=`<span class="caption-preview">${esc(previewText).replace(/\n/g,'<br>')}</span><div class="more-btn-row"><button type="button" class="more-btn" data-action="expand-caption">顯示更多</button></div>`;
    }else{
      const media=normalizedMedia||normalizeCaptionMedia(rawCaption);
      captionRenderHtml=(media.captionHtml||'') + (media.imagesHtml||'');
    }
    const mediaPlayer=needPlayer?`<div class="media-player" data-ts="${f.ts}" data-state="idle" aria-label="文字朗讀播放器"><button class="mp-btn mp-play" title="播放/暫停" data-action="play" aria-label="播放或暫停"><i class="uil uil-play"></i></button><div class="mp-timeline" data-action="seek" aria-label="進度條（可點擊調整進度）"><div class="mp-progress"></div></div></div>`:'';
    const topicsHtml=topics.length?`<div class="feed-topics">${topics.map(k=>{const c=topicColor(k);const style=c?' style="--topic-color:'+esc(c)+'"':'';return`<button type="button" class="topic-pill" data-topic-key="${esc(k)}"${style}>${esc(topicLabel(k))}</button>`}).join('')}</div>`:'';
    const likeCountRaw=typeof f.likes==='number'&&isFinite(f.likes)?f.likes:0;
    const likeCount=Math.max(likeCountRaw,likeNames.length,likeAvatars.length);
    const commentCount=Array.isArray(f.commentList)?f.commentList.length:(typeof f.comments==='number'?f.comments:0);
    const shareCount=typeof f.shares==='number'?f.shares:0;
    const likeHtml=likeAvatars.map(a=>`<span><img src="${a}" alt=""></span>`).join('');
    let likeText='';
    if(likeCount>0&&likeNames.length){
      if(isAiCourseMeta){
        likeText=`本文為AI整理 <b>${likeNames.join('、')}</b> 授課內容`
      }else if(!isLinkOnly){
        likeText=`<b>${likeNames.join('、')}</b>`;
        if(likeCount>likeNames.length){likeText+=` 及 <b>其他 ${likeCount.toLocaleString()} 位用戶</b>`}
        likeText+=' 給貼文星星'
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
    const aiMoreBtn=aiCaptionHtml?`<button type="button" class="more-btn" data-ai-more aria-expanded="false"><i class="uil uil-angle-down"></i> 顯示更多</button>`:'';
    const commentsPanel=commentCount>0?`<div class="feed-comments" style="display:none;font-size:.8rem;border-top:1px dashed var(--c-border);margin-top:.25rem;">${(Array.isArray(f.commentList)?f.commentList:[]).map(renderCommentItem).join('')}</div>`:`<div class="feed-comments" style="display:none;font-size:.8rem;margin-top:.25rem;color:var(--c-text-soft);">無留言</div>`;
    const titleText=displayFeedTitle(f);
    const smallText=titleText?`${esc(titleText)} • ${esc(f.date)}`:`${esc(f.date)}`;
    let geoHtml='';
    try{
      const g=f&&f.geo;
      const lat=Number(g&&g.lat);
      const lon=Number(g&&g.lon);
      if(isFinite(lat)&&isFinite(lon)){
        const nm=esc(g.name||'');
        const ad=esc(g.address||'');
        geoHtml='<div class="feed-geo"><div class="feed-geo-head" role="button" tabindex="0" aria-label="顯示地圖" aria-expanded="false"><i class="uil uil-map-marker"></i><div class="feed-geo-text"><div class="t">'+(nm||'地點')+'</div>'+(ad?'<div class="s">'+ad+'</div>':'')+'</div></div><div class="feed-geo-map" data-lat="'+lat+'" data-lon="'+lon+'"></div></div>';
      }
    }catch(e){}
    const feedClass=`feed fade-slide${aiCaptionHtml?' feed-ai-collapsed':''}`;
    const bodyHtml=aiCaptionHtml?`<div class="feed-ai-main">${video}<div class="caption">${captionRenderHtml}</div></div>${geoHtml}`:`${video}${geoHtml}<div class="caption">${captionRenderHtml}</div>`;
    return`<div class="${feedClass}" data-ts="${f.ts||''}"><div class="feed-header"><div class="avatar"><img src="${f.avatar}" alt=""></div><div class="info"><h3>${esc(f.user)}</h3><small>${smallText}</small></div>${mediaPlayer}<div class="actions">${linkBtn}</div></div>${topicsHtml}${metaLike}${bodyHtml}<div class="feed-actions">${aiMoreBtn}<div class="right">${likeBtn}<span class="comment-btn" data-action="comment"><i class="uil uil-comment"></i>${commentCountBadge}</span><span class="share-btn" data-action="share"><i class="uil uil-share"></i>${shareCountBadge}</span><span class="bookmark-btn${f.bookmarked?' is-bookmarked':''}" data-action="bookmark"><i class="uil uil-bookmark"></i></span></div></div>${commentsPanel}</div>`
  }
  let mapAdAiCollapsedCount=0;
  let mapAdCursor=0;
  let mapAdPlacesCache=null;
  let mapAdPlacesPromise=null;
  function resetMapAdInsertion(){
    mapAdAiCollapsedCount=0;
    mapAdCursor=Math.floor(Math.random()*1000000);
  }
  function mapAdPlain(s,n){
    let t=stripHtml(String(s||'')).replace(/\s+/g,' ').trim();
    n=Math.max(20,Number(n||0)||160);
    return t.length>n?t.slice(0,n-1)+'…':t;
  }
  function mapAdSplitUrls(v){
    const s=String(v||'').trim();
    if(!s) return [];
    return s.split(/[\n|]+/).map(x=>x.trim()).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i);
  }
  function mapAdNormalizeUrl(u){
    u=String(u||'').trim().replace(/&amp;/g,'&');
    if(!u) return '';
    if(/^\/\//.test(u)) u='https:'+u;
    try{return new URL(u,location.href).href;}catch(e){return u;}
  }
  function mapAdIsImageUrl(u){
    u=mapAdNormalizeUrl(u);
    return !!u && (/(?:\.(?:jpg|jpeg|png|webp|gif))(?:[?#].*)?$/i.test(u)||/picdn\.gomaji\.com/i.test(u)||/\/uploads\/[^?#]+(?:\.(?:jpg|jpeg|png|webp|gif))(?:[?#].*)?$/i.test(u));
  }
  function mapAdUrlKey(u){return mapAdNormalizeUrl(u).replace(/[#?].*$/,'').toLowerCase();}
  function mapAdRefLinks(p){
    const borrowed=new Set((Array.isArray(p&&p.__mapAdBorrowedPicUrls)?p.__mapAdBorrowedPicUrls:[]).map(mapAdUrlKey).filter(Boolean));
    const ownPics=new Set(mapAdOwnPicUrls(p).map(mapAdUrlKey).filter(Boolean));
    const arr=mapAdSplitUrls(p&&p.urls).map(mapAdNormalizeUrl).filter(Boolean).filter(u=>{
      const k=mapAdUrlKey(u);
      if(!k) return false;
      if(borrowed.has(k)||ownPics.has(k)||mapAdIsImageUrl(u)) return false;
      return true;
    }).filter((u,i,a)=>a.indexOf(u)===i);
    if(!arr.length) return '';
    return arr.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener" title="${arr.length>1?'參考資料'+(i+1):'參考資料'}" aria-label="${arr.length>1?'參考資料'+(i+1):'參考資料'}"><i class="uil uil-link"></i></a>`).join('');
  }
  function mapAdAdText(p){
    if(!p) return '';
    const parts=[];
    const adv=String(p.offer_adv||p.offerAdv||'').trim();
    const offer=String(p.offer||'').trim();
    const price=String(p.offer_price||p.offerPrice||p.offer_price_text||'').trim();
    const isOnlyGomajiPromo=/Gomaji|推薦碼|6DA78|\$120/.test(offer);
    if(adv) parts.push(adv);
    if(offer&&offer!==adv&&!(isOnlyGomajiPromo&&(adv||price))) parts.push(offer);
    if(price&&price!==adv&&price!==offer) parts.push(price);
    if((p.isGomaji||String(p.GomajiIDURL||'').trim())&&!parts.length) parts.push('下載Gomaji app，輸入推薦碼6DA78可獲得$120優惠');
    if(!parts.length){
      const fallback=[p.name,p.cat,p.address].map(x=>String(x||'').trim()).filter(Boolean).join(' · ');
      if(fallback) parts.push(fallback);
    }
    return parts.join('\n').trim();
  }
  function mapAdHasAdContent(p){return !!(p&&(mapAdAdText(p)||String(p.name||'').trim()));}
  function mapAdOfferText(p){
    return mapAdPlain(mapAdAdText(p),180);
  }
  function mapAdShuffle(arr){
    const a=Array.isArray(arr)?arr.slice():[];
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}
    return a;
  }
  function mapAdNormKey(s){
    return String(s||'').trim().replace(/\s+/g,' ').replace(/[（(].*?[）)]/g,'').replace(/臺/g,'台').toLowerCase();
  }
  function mapAdSourceKey(p){
    const raw=String(p&&(p.__mapAdSource||p.__src||p.source_sqlite||p.source_file||p.source||p.__source_table)||'').trim();
    const m=raw.match(/(?:^|[\\/])?(map\d+)(?:\b|[._\-\/\\])/i)||raw.match(/\b(map\d+)\b/i);
    if(m) return m[1].toLowerCase();
    const slug=raw.toLowerCase().replace(/\.(sqlite|db|sqlite3|js|json)(\?.*)?$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
    return slug||'inline';
  }
  function mapAdSourceCompare(a,b){
    const an=String(a||'').match(/^map(\d+)$/i),bn=String(b||'').match(/^map(\d+)$/i);
    if(an&&bn) return Number(an[1])-Number(bn[1]);
    if(an) return -1;
    if(bn) return 1;
    return String(a||'').localeCompare(String(b||''),'zh-Hant');
  }
  function mapAdBucket(p){
    const name=String(p&&p.name||'');
    const offer=String(p&&p.offer||'')+' '+String(p&&p.offer_adv||'');
    const cat=String(p&&p.cat||'');
    const nameOffer=name+' '+offer;
    const text=cat+' '+nameOffer;
    const vehicleText=nameOffer.replace(/汽車旅館/g,'');
    if(/機車|汽車|車業|車行|車輛|輪胎|道路救援|維修保養|洗車|新車|中古車|租車|小客車|OPel|OPEL|GP\s*125|125機車/i.test(vehicleText)) return 'vehicle';
    if(/WORLD\s*GYM|健身|運動中心|運動館|健身房|體適能|瑜伽|拳擊|壺鈴|游泳|泳池|羽球|球館|精肌|卓越健身|健身工廠|亞樂/i.test(nameOffer)) return 'fitness';
    if(/美食|餐廳|餐饮|飲食|飲料|甜點|咖啡|火鍋|燒肉|漢堡|披薩|pizza/i.test(text)) return 'food';
    if(/美容|美髮|美甲|SPA|舒壓|肌膚|克麗緹娜|佐登妮絲/i.test(text)) return 'beauty';
    if(/按摩|足湯|養身|整体|推拿/i.test(text)) return 'massage';
    if(/泡湯|溫泉|休息/i.test(text)) return 'hotspring';
    if(/旅遊|住宿|飯店|旅館|民宿/i.test(text)) return 'travel';
    if(/休閒|娛樂|樂園|KTV|農場|遊戲|賞鯨|海洋公園|遊憩/i.test(text)) return 'leisure';
    return 'other';
  }
  function mapAdCollectPicUrls(vals,html){
    const out=[];
    const push=u=>{
      u=mapAdNormalizeUrl(String(u||'').trim().replace(/[\s"'<>]+$/g,''));
      if(!u) return;
      if(!/^https?:\/\//i.test(u)) return;
      if(!mapAdIsImageUrl(u)) return;
      if(!out.includes(u)) out.push(u);
    };
    (Array.isArray(vals)?vals:[]).forEach(v=>String(v||'').split(/[\n|,]+/).forEach(push));
    String(html||'').replace(/<img\b[^>]*(?:src|data-src|data-original)=["']([^"']+)["'][^>]*>/gi,(m,u)=>{push(u);return m;});
    String(html||'').replace(/https?:\/\/[^\s<>'"]+?\.(?:jpg|jpeg|png|webp|gif)(?:\?[^\s<>'"]*)?/gi,(u)=>{push(u);return u;});
    return out.slice(0,6);
  }
  function mapAdOwnPicUrls(p){
    if(!p) return [];
    const vals=[p.offer_advpicURL,p.offer_adv_pic_url,p.offerAdvPicURL,p.offerADVPicURL,p.pic,p.picture,p.image,p.img,p.photo,p.photoURL,p.urls,p.url,p.link,p.links];
    return mapAdCollectPicUrls(vals,String(p.offer_adv||p.offerAdv||'')+'\n'+String(p.offer||'')+'\n'+String(p.urls||''));
  }
  function mapAdTokenSet(s){
    const text=mapAdNormKey(stripHtml(String(s||'')));
    const set=new Set();
    text.replace(/[a-z0-9]+/gi,m=>{if(m.length>1)set.add(m);return m;});
    const han=text.replace(/[^\u3400-\u9fff]/g,'');
    if(han.length===1) set.add(han);
    for(let i=0;i<han.length-1;i++) set.add(han.slice(i,i+2));
    for(let i=0;i<han.length-2;i++) set.add(han.slice(i,i+3));
    return set;
  }
  function mapAdTokenScore(a,b){
    if(!a||!b||!a.size||!b.size) return 0;
    let hit=0;
    a.forEach(x=>{if(b.has(x)) hit++;});
    return hit/Math.sqrt(a.size*b.size);
  }
  function mapAdBucketsCompatible(tb,cb){
    tb=String(tb||'other'); cb=String(cb||'other');
    if(!tb||tb==='other'||!cb||cb==='other') return true;
    if(tb===cb) return true;
    return false;
  }
  function mapAdImageMatchScore(target,cand){
    const tcat=mapAdNormKey(target&&target.cat),ccat=mapAdNormKey(cand&&cand.cat);
    const tb=mapAdBucket(target),cb=cand&&cand.bucket||'other';
    const nameScore=mapAdTokenScore(target.__mapAdNameTokens,cand&&cand.nameTokens);
    const offerScore=mapAdTokenScore(target.__mapAdOfferTokens,cand&&cand.offerTokens);
    if(!mapAdBucketsCompatible(tb,cb)) return -1000;
    let score=0;
    if(tb&&cb&&tb===cb&&tb!=='other') score+=18;
    if(tcat&&ccat){
      if(tcat===ccat) score+=4;
      else if(tcat.includes(ccat)||ccat.includes(tcat)) score+=2;
    }
    score+=8*nameScore;
    score+=5*offerScore;
    if((nameScore+offerScore)<=0&&tb==='other') score-=4;
    return score;
  }
  function mapAdApplyBorrowedMap0Images(arr){
    arr=Array.isArray(arr)?arr:[];
    const pool=[];
    arr.forEach(p=>{
      const src=mapAdSourceKey(p);
      const pics=mapAdOwnPicUrls(p);
      if(src==='map0'&&pics.length){
        pool.push({p,pics,cat:String(p.cat||''),bucket:mapAdBucket(p),nameTokens:mapAdTokenSet(p.name),offerTokens:mapAdTokenSet(mapAdAdText(p))});
      }
    });
    if(!pool.length) return arr;
    arr.forEach(p=>{
      if(mapAdSourceKey(p)==='map0'||mapAdOwnPicUrls(p).length) return;
      p.__mapAdNameTokens=mapAdTokenSet(p.name);
      p.__mapAdOfferTokens=mapAdTokenSet(mapAdAdText(p));
      let best=null,bestScore=-Infinity,sameCat=null,sameCatScore=-Infinity,any=null,anyScore=-Infinity;
      const tcat=mapAdNormKey(p&&p.cat);
      for(const cand of pool){
        const sc=mapAdImageMatchScore(p,cand);
        if(sc>anyScore){anyScore=sc;any=cand;}
        if(tcat&&mapAdNormKey(cand&&cand.cat)===tcat&&sc>sameCatScore){sameCatScore=sc;sameCat=cand;}
        if(sc>-900&&sc>bestScore){bestScore=sc;best=cand;}
      }
      const pick=best||sameCat||any;
      if(pick&&pick.pics&&pick.pics.length){
        p.__mapAdBorrowedPicUrls=pick.pics.slice(0,6);
        p.__mapAdBorrowedFrom=String(pick.p&&pick.p.name||'');
      }
      delete p.__mapAdNameTokens;
      delete p.__mapAdOfferTokens;
    });
    return arr;
  }
  function buildBalancedMapAdDeck(arr){
    const input=(Array.isArray(arr)?arr:[]).filter(p=>p&&mapAdHasAdContent(p));
    const deduped=[];
    const seen=new Map();
    for(const p of input){
      const src=mapAdSourceKey(p);
      const key=[src,mapAdNormKey(p.name),mapAdNormKey(p.cat),mapAdNormKey(mapAdAdText(p)).slice(0,120)].join('|');
      if(seen.has(key)){
        const old=seen.get(key);
        if(old){
          const oldHasLL=isFinite(Number(old.lat))&&isFinite(Number(old.lon));
          const newHasLL=isFinite(Number(p.lat))&&isFinite(Number(p.lon));
          if(!oldHasLL&&newHasLL){old.address=p.address;old.lat=p.lat;old.lon=p.lon;}
          if(!mapAdOwnPicUrls(old).length&&mapAdOwnPicUrls(p).length){old.offer_advpicURL=p.offer_advpicURL;old.urls=p.urls;}
        }
        continue;
      }
      const copy=Object.assign({},p,{__mapAdSource:src});
      seen.set(key,copy);
      deduped.push(copy);
    }
    mapAdApplyBorrowedMap0Images(deduped);
    const sources={};
    deduped.forEach(p=>{
      const src=mapAdSourceKey(p);
      if(!sources[src]) sources[src]={key:src,items:[],cursor:0};
      sources[src].items.push(p);
    });
    const sourceKeys=Object.keys(sources).filter(k=>sources[k].items.length).sort(mapAdSourceCompare);
    sourceKeys.forEach(k=>{sources[k].items=mapAdShuffle(sources[k].items);});
    const hasOther=sourceKeys.some(k=>k!=='map0');
    const otherKeys=sourceKeys.filter(k=>k!=='map0');
    let sourceDeck=[];
    if(hasOther){
      otherKeys.forEach(k=>{sourceDeck.push(k,k);});
      if(sources.map0&&sources.map0.items.length) sourceDeck.push('map0');
    }else{
      sourceKeys.forEach(k=>{sourceDeck.push(k);});
    }
    if(!sourceDeck.length) sourceDeck=sourceKeys.slice();
    const deck={__mapAdDeck:1,sources,sourceKeys,sourceDeck,sourceCursor:0,recentKeys:[]};
    try{window.__MAP_AD_SOURCE_WEIGHTS__=sourceKeys.map(k=>({source:k,rows:sources[k].items.length,weightUnits:(k==='map0'&&hasOther)?1:2,deckCount:sourceDeck.filter(x=>x===k).length}));}catch(e){}
    try{window.__MAP_AD_SOURCE_DECK__=sourceDeck.slice();}catch(e){}
    return sourceKeys.length?deck:mapAdShuffle(input);
  }
  function pickMapAdFromDeck(deck){
    if(!deck||!deck.__mapAdDeck) return null;
    const sourceDeck=Array.isArray(deck.sourceDeck)?deck.sourceDeck:[];
    if(!sourceDeck.length) return null;
    for(let guard=0;guard<sourceDeck.length*2+4;guard++){
      const src=sourceDeck[deck.sourceCursor%sourceDeck.length];
      deck.sourceCursor++;
      const group=deck.sources&&deck.sources[src];
      if(!group||!Array.isArray(group.items)||!group.items.length) continue;
      const size=group.items.length;
      let p=null;
      for(let step=0;step<size;step++){
        const cand=group.items[group.cursor%size];
        group.cursor++;
        const rk=[src,mapAdNormKey(cand&&cand.name),mapAdNormKey(mapAdAdText(cand)).slice(0,80)].join('|');
        if(!deck.recentKeys||!deck.recentKeys.includes(rk)||step===size-1){
          p=cand;
          if(deck.recentKeys){deck.recentKeys.push(rk); if(deck.recentKeys.length>12) deck.recentKeys.splice(0,deck.recentKeys.length-12);}
          break;
        }
      }
      if(group.cursor%group.items.length===0) group.items=mapAdShuffle(group.items);
      if(p) return p;
    }
    const keys=Array.isArray(deck.sourceKeys)?deck.sourceKeys:[];
    for(const src of keys){
      const group=deck.sources&&deck.sources[src];
      if(group&&group.items&&group.items.length) return group.items[(group.cursor++)%group.items.length];
    }
    return null;
  }
  async function ensureMapAdPlaces(){
    if(mapAdPlacesCache) return mapAdPlacesCache;
    if(mapAdPlacesPromise) return mapAdPlacesPromise;
    mapAdPlacesPromise=Promise.resolve().then(()=>window.ensureOsmPlaces&&window.ensureOsmPlaces()).then(()=>{
      let arr=[];
      try{if(typeof window.getOsmAdvertPlaces==='function') arr=window.getOsmAdvertPlaces();}catch(e){arr=[];}
      arr=(Array.isArray(arr)?arr:[]).filter(p=>p&&mapAdHasAdContent(p));
      mapAdPlacesCache=buildBalancedMapAdDeck(arr);
      try{window.__MAP_AD_DECK__=mapAdPlacesCache;}catch(e){}
      return mapAdPlacesCache;
    }).catch(()=>[]);
    return mapAdPlacesPromise;
  }
  function pickMapAdPlace(ads){
    if(ads&&ads.__mapAdDeck) return pickMapAdFromDeck(ads);
    if(!Array.isArray(ads)||!ads.length) return null;
    const p=ads[mapAdCursor%ads.length];
    mapAdCursor++;
    return p;
  }
  function mapAdPicUrls(p){
    const own=mapAdOwnPicUrls(p);
    if(own.length) return own;
    const borrowed=Array.isArray(p&&p.__mapAdBorrowedPicUrls)?p.__mapAdBorrowedPicUrls:[];
    return borrowed.filter(Boolean).slice(0,6);
  }
  function mapAdLines(s){
    let t=stripHtml(String(s||'')).replace(/\r/g,'\n').replace(/\u3000/g,' ');
    t=t.replace(/\s*→\s*/g,'→').replace(/\s*\$\s*/g,'$');
    let raw=t.split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
    if(raw.length<2){
      const enumerated=t.replace(/\s+(?=(?:\d+|[A-JＡ-Ｊ])[\.、)]\s*)/g,'\n');
      raw=enumerated.split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
    }
    if(raw.length<2){
      raw=t.split(/(?<=[。；;！？!?])\s*/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
    }
    const out=[],seen=new Set();
    for(let x of raw){
      x=x.replace(/^(?:[-*•・]|\d+[.)、])\s*/,'').trim();
      if(!x) continue;
      if(/^(兌換說明|方案內容|適用店家|商品介紹|評價|國旅卡|查看地圖|聯絡店家|預約方式|其他)$/.test(x)) continue;
      if(/(?:退費保障政策|兌換券須知|店家服務反映|馬上購買|Google：)/.test(x)&&!/(免預約|優惠期間|平假日|內用|外帶)/.test(x)) continue;
      const k=x.replace(/\s+/g,'').replace(/臺/g,'台').slice(0,110);
      if(seen.has(k)) continue;
      seen.add(k);
      out.push(x);
      if(out.length>=16) break;
    }
    return out;
  }
  function mapAdLineKey(x){return String(x||'').replace(/\s+/g,'').replace(/臺/g,'台').replace(/[。；;，,]+$/,'');}
  function mapAdLineCanon(x){
    return mapAdLineKey(stripHtml(String(x||''))
      .replace(/^[#＃]?\d+\s*/,'')
      .replace(/^官方網站\s*/,'')
      .replace(/^(?:憑員工識別證)?優惠如下[:：]?/,'')
    );
  }
  function mapAdIsDupLine(line,refs){
    const k=mapAdLineCanon(line);
    if(!k) return true;
    for(const ref of (Array.isArray(refs)?refs:[])){
      const r=mapAdLineCanon(ref);
      if(!r) continue;
      if(k===r) return true;
      const minLen=Math.min(k.length,r.length);
      if(minLen>=6&&(k.includes(r)||r.includes(k))) return true;
    }
    return false;
  }
  function mapAdUniqueLinesAgainst(lines,refs,limit){
    const out=[],seen=new Set();
    for(const line of (Array.isArray(lines)?lines:mapAdLines(lines))){
      const clean=String(line||'').replace(/\s+/g,' ').trim();
      if(!clean) continue;
      if(mapAdIsDupLine(clean,refs)) continue;
      const k=mapAdLineCanon(clean).slice(0,140);
      if(!k||seen.has(k)) continue;
      seen.add(k);
      out.push(clean);
      if(limit&&out.length>=limit) break;
    }
    return out;
  }
  function mapAdIsPriceLine(x){return /(?:NT\$|NTD\$?|TWD\$?|\$|＄)\s*\d[\d,]*/.test(String(x||''));}
  function mapAdGomajiPrompt(p){
    return (p&&(p.isGomaji||String(p.GomajiIDURL||'').trim()))?'下載Gomaji app，輸入推薦碼6DA78可獲得$120優惠':'';
  }
  function mapAdPlainOfferLine(p){
    const gomajiPrompt=mapAdGomajiPrompt(p);
    if(gomajiPrompt) return gomajiPrompt;
    const offerLines=String(p&&p.offer||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
    const priceLines=String(p&&(p.offer_price||p.offerPrice||p.offer_price_text)||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);
    const advLines=mapAdLines(String(p&&p.offer_adv||p&&p.offerAdv||'')).filter(Boolean);
    const nonGomajiOffer=offerLines.find(x=>!/Gomaji|推薦碼|6DA78|\$120/.test(x));
    if(nonGomajiOffer) return stripHtml(nonGomajiOffer).replace(/\s+/g,' ').trim();
    if(priceLines.length) return mapAdPlain(priceLines[0],180);
    if(advLines.length) return mapAdPlain(advLines[0],180);
    if(offerLines.length) return stripHtml(offerLines[0]).replace(/\s+/g,' ').trim();
    return '優惠資訊';
  }
  function mapAdSortedTextLines(adv, priceText){
    let lines=mapAdLines(adv).filter(x=>!mapAdIsPriceLine(x));
    const priceKeys=new Set(mapAdLines(priceText).map(mapAdLineKey));
    if(priceKeys.size) lines=lines.filter(x=>!priceKeys.has(mapAdLineKey(x)));
    const seen=new Set();
    lines=lines.filter(x=>{const k=mapAdLineKey(x).slice(0,100); if(!k||seen.has(k)) return false; seen.add(k); return true;});
    const score=x=>{
      const s=String(x||'');
      if(/^(免預約|需預約|預約方式)/.test(s)) return 0;
      if(/優惠期間|平假日|可使用|使用期限|兌換至|內用|外帶|低消|服務費|不得與|不適用|每人每次|限/.test(s)) return 1;
      if(/^([A-JＡ-Ｊ]|\d+)[\.、]/.test(s) && !/\s\/\s/.test(s)) return 2;
      if(/買一送一|套餐|方案|組合|二選一|折抵|抵用|消費金額/.test(s) && !/\s\/\s/.test(s)) return 3;
      if(/\s\/\s/.test(s) && s.length>80) return 8;
      if(/電話：|地址：|營業時間|每週|公休|查看地圖|聯絡店家/.test(s)) return 9;
      return 5;
    };
    return lines.sort((a,b)=>score(a)-score(b));
  }
  function mapAdBulletHtml(lines,limit){
    let arr=Array.isArray(lines)?lines.slice():mapAdLines(lines);
    if(limit) arr=arr.slice(0,limit);
    arr=arr.filter(Boolean);
    if(!arr.length) return '';
    return `<ul class="map-ad-bullets">${arr.map(x=>`<li class="map-ad-bullet"><span>${esc(x)}</span></li>`).join('')}</ul>`;
  }
  function mapAdSummaryDetail(adv,priceText){
    const lines=mapAdSortedTextLines(adv,priceText);
    if(!lines.length) return {summary:[],detail:[]};
    const n=Math.min(lines.length,2);
    return {summary:lines.slice(0,n),detail:lines.slice(n,12)};
  }
  function mapAdLooksLikePriceLine(x,explicit){
    const s=String(x||'').trim();
    if(!s) return false;
    if(/(?:NT\$|NTD\$?|TWD\$?|\$|＄)\s*\d|\d[\d,]*(?:\.\d+)?\s*元|→/.test(s)) return true;
    if(explicit&&/\d+\s*折/.test(s)) return true;
    return false;
  }
  function mapAdPriceMeta(p){
    const explicitPrice=String(p&& (p.offer_price||p.offerPrice||p.offer_price_text) || '');
    const price=mapAdLines(explicitPrice);
    if(price.length) return mapAdUniqueLinesAgainst(price,[],4);
    const lines=mapAdLines(mapAdAdText(p));
    const priceish=lines.filter(x=>mapAdLooksLikePriceLine(x,false)&&!/優惠期間/.test(x)).slice(0,4);
    return mapAdUniqueLinesAgainst(priceish,[],4);
  }
  function mapAdMoneyNumber(s){
    const m=String(s||'').replace(/,/g,'').match(/([0-9]+(?:\.[0-9]+)?)/);
    return m?Number(m[1]):NaN;
  }
  function mapAdPriceHtml(line){
    line=String(line||'').replace(/\s*→\s*/g,'→').replace(/\s*\$\s*/g,'$').trim();
    if(!line) return '';
    const prices=line.match(/(?:NT\$|NTD\$?|TWD\$?|\$|＄)\s*[0-9][0-9,]*(?:\.[0-9]+)?|[0-9][0-9,]*(?:\.[0-9]+)?\s*元/gi)||[];
    let title=line;
    if(prices.length) title=line.slice(0,line.indexOf(prices[0])).replace(/[：:，,。；;\s]+$/,'');
    title=title.replace(/〈[^〉]*〉/g,'').trim();
    if(title.length>30) title=title.slice(0,29)+'…';
    let values='';
    if(prices.length>=2){
      let sale=prices[1], old=prices[0];
      const n0=mapAdMoneyNumber(old), n1=mapAdMoneyNumber(sale);
      if(isFinite(n0)&&isFinite(n1)&&n0<n1){ old=prices[1]; sale=prices[0]; }
      values=`<span class="map-ad-price-values"><STRIKE>${esc(old)}</STRIKE> <strong>${esc(sale)}</strong></span>`;
    }else if(prices.length===1){
      values=`<span class="map-ad-price-values"><strong>${esc(prices[0])}</strong></span>`;
    }else{
      title='';
      values=`<span class="map-ad-price-values"><strong>${esc(line)}</strong></span>`;
    }
    return `<span class="map-ad-price-item">${title?`<span class="map-ad-price-title">${esc(title)}</span>`:''}${values}</span>`;
  }
  function mapAdPriceListHtml(priceLines){
    const arr=mapAdUniqueLinesAgainst((Array.isArray(priceLines)?priceLines:mapAdLines(priceLines)).filter(Boolean),[],4);
    if(!arr.length) return '';
    return `<div class="map-ad-price-list">${arr.map(mapAdPriceHtml).filter(Boolean).join('')}</div>`;
  }
  function mapAdGalleryHtml(urls,hero){
    const imgs=(Array.isArray(urls)?urls:[]).filter(Boolean).slice(0,6);
    const main=imgs.length?`<div class="map-ad-hero" data-map-ad-slideshow="1">${imgs.map((u,i)=>{u=mapAdNormalizeUrl(u);return `<img class="map-ad-img${i===0?' is-active':''}" loading="lazy" src="${esc(u)}" alt="" data-full-src="${esc(u)}">`;}).join('')}</div>`:`<div class="map-ad-hero"><div class="map-ad-noimg"><i class="uil uil-pricetag-alt"></i><span>優惠資訊</span></div></div>`;
    return `<div class="map-ad-gallery">${main}</div>`;
  }
  function mapAdNoImgHtml(){return '<div class="map-ad-noimg"><i class="uil uil-pricetag-alt"></i><span>優惠資訊</span></div>';}
  function setupMapAdImageFallback(scope){
    scope=scope&&scope.querySelectorAll?scope:document;
    scope.querySelectorAll('.map-ad-hero[data-map-ad-slideshow="1"] img:not([data-map-ad-error-bound="1"])').forEach(img=>{
      img.dataset.mapAdErrorBound='1';
      img.addEventListener('error',()=>{
        const hero=img.closest('.map-ad-hero');
        if(!hero) return;
        img.classList.add('is-broken');
        img.style.display='none';
        const available=Array.from(hero.querySelectorAll('img:not(.is-broken)'));
        if(available.length){
          if(img.classList.contains('is-active')){available.forEach((x,i)=>x.classList.toggle('is-active',i===0));}
        }else{
          hero.removeAttribute('data-map-ad-slideshow');
          hero.innerHTML=mapAdNoImgHtml();
        }
        requestAnimationFrame(()=>syncMapAdBodyClamp(hero.closest('.map-ad-feed')||document));
      });
    });
  }
  let mapAdToggleBound=false;
  let mapAdClampResizeBound=false;
  let mapAdClampRaf=0;
  function clampOneMapAdBody(feed){
    if(!feed) return;
    const body=feed.querySelector('.map-ad-body');
    if(!body) return;
    const expanded=feed.classList&&feed.classList.contains('map-ad-expanded');
    const btn=feed.querySelector('.more-btn[data-action="map-ad-toggle"]');
    const hasDetail=!!feed.querySelector('.map-ad-details .map-ad-bullet,.map-ad-details .map-ad-detail-text:not(:empty)');
    if(expanded){
      body.style.removeProperty('height');
      body.style.setProperty('max-height','none','important');
      body.style.setProperty('overflow','visible','important');
      if(btn){btn.hidden=false;btn.classList.remove('is-hidden');}
      return;
    }
    const gallery=feed.querySelector('.map-ad-gallery')||feed.querySelector('.map-ad-hero');
    const hero=feed.querySelector('.map-ad-hero');
    const gh=Math.ceil((gallery&&gallery.getBoundingClientRect&&gallery.getBoundingClientRect().height)||0)||Math.ceil((hero&&hero.getBoundingClientRect&&hero.getBoundingClientRect().height)||0)||0;
    body.style.setProperty('max-height','none','important');
    body.style.setProperty('overflow','visible','important');
    const full=Math.ceil(body.scrollHeight||0);
    const overflowing=!!(gh&&full>gh+3);
    if(gh){
      body.style.setProperty('height',gh+'px','important');
      body.style.setProperty('max-height',gh+'px','important');
      body.style.setProperty('overflow','hidden','important');
    }else{
      body.style.removeProperty('height');
      body.style.removeProperty('max-height');
      body.style.setProperty('overflow','hidden','important');
    }
    if(btn){
      const show=!!(hasDetail||overflowing);
      btn.hidden=!show;
      btn.classList.toggle('is-hidden',!show);
    }
  }
  function syncMapAdBodyClamp(scope){
    scope=scope&&scope.querySelectorAll?scope:document;
    const feeds=scope.classList&&scope.classList.contains('map-ad-feed')?[scope]:Array.from(scope.querySelectorAll('.map-ad-feed'));
    feeds.forEach(clampOneMapAdBody);
  }
  function setupMapAdBodyClamp(scope){
    scope=scope&&scope.querySelectorAll?scope:document;
    syncMapAdBodyClamp(scope);
    scope.querySelectorAll('.map-ad-hero img:not([data-map-ad-clamp-load="1"])').forEach(img=>{
      img.dataset.mapAdClampLoad='1';
      img.addEventListener('load',()=>{requestAnimationFrame(()=>syncMapAdBodyClamp(img.closest('.map-ad-feed')||document));});
    });
    if(!mapAdClampResizeBound){
      mapAdClampResizeBound=true;
      window.addEventListener('resize',()=>{
        cancelAnimationFrame(mapAdClampRaf);
        mapAdClampRaf=requestAnimationFrame(()=>syncMapAdBodyClamp(document));
      },{passive:true});
    }
  }
  function setupMapAdToggle(){
    if(mapAdToggleBound) return;
    mapAdToggleBound=true;
    document.addEventListener('click',e=>{
      const btn=e.target.closest('.more-btn[data-action="map-ad-toggle"]');
      if(!btn) return;
      const card=btn.closest('.map-ad-feed');
      if(!card) return;
      e.preventDefault();
      e.stopPropagation();
      const open=!card.classList.contains('map-ad-expanded');
      card.classList.toggle('map-ad-expanded',open);
      btn.setAttribute('aria-expanded',open?'true':'false');
      btn.innerHTML=open?'<i class="uil uil-angle-up"></i> 收合':'<i class="uil uil-angle-down"></i> 顯示更多';
      requestAnimationFrame(()=>syncMapAdBodyClamp(card));
    },true);
  }
  function setupMapAdSlideshows(scope){
    scope=scope&&scope.querySelectorAll?scope:document;
    scope.querySelectorAll('.map-ad-hero[data-map-ad-slideshow="1"]:not([data-slideshow-ready="1"])').forEach(hero=>{
      const imgs=Array.from(hero.querySelectorAll('img'));
      if(!imgs.length) return;
      hero.dataset.slideshowReady='1';
      let idx=imgs.findIndex(img=>img.classList.contains('is-active'));
      if(idx<0) idx=0;
      imgs.forEach((img,i)=>img.classList.toggle('is-active',i===idx));
      if(imgs.length<2) return;
      const interval=2600+Math.floor(Math.random()*900);
      const timer=setInterval(()=>{
        if(!document.body.contains(hero)){clearInterval(timer);return;}
        idx=(idx+1)%imgs.length;
        imgs.forEach((img,i)=>img.classList.toggle('is-active',i===idx));
      },interval);
      hero.__mapAdSlideTimer=timer;
    });
  }
  function buildMapAdFeed(p){
    if(!p) return '';
    const lat=Number(p.lat),lon=Number(p.lon);
    const hasLL=isFinite(lat)&&isFinite(lon);
    const adv=mapAdAdText(p);
    if(!adv) return '';
    const name=String(p.name||'').trim()||'彰基優惠';
    const cat=String(p.cat||'').trim();
    const addr=String(p.address||'').trim();
    const refs=mapAdRefLinks(p);
    const pics=mapAdPicUrls(p);
    const hero=pics[0]||'';
    const coupon=mapAdPlainOfferLine(p);
    const rawPriceLines=mapAdPriceMeta(p);
    const priceLines=mapAdUniqueLinesAgainst(rawPriceLines,[coupon],4);
    const dupRefs=[coupon].concat(priceLines||[]);
    const visibleLines=mapAdUniqueLinesAgainst(mapAdSortedTextLines(adv,priceLines.join('\n')),dupRefs,12);
    const fallbackSummary=mapAdPlain(adv,120);
    const fallbackLines=visibleLines.length?[]:mapAdUniqueLinesAgainst(fallbackSummary?[fallbackSummary]:[],dupRefs,1);
    const summaryLines=(visibleLines.length?visibleLines:fallbackLines).slice(0,2);
    const detailLines=visibleLines.slice(2,12);
    const summaryHtml=mapAdBulletHtml(summaryLines,2);
    const detailText=mapAdBulletHtml(detailLines,10);
    const hasMore=!!detailText;
    const gallery=mapAdGalleryHtml(pics,hero);
    const prices=mapAdPriceListHtml(priceLines);
    const summaryBlock=summaryHtml?`<div class="map-ad-summary">${summaryHtml}</div>`:'';
    const detail=detailText?`<div class="map-ad-details"><div class="map-ad-detail-text">${detailText}</div></div>`:'';
    const mapBtn=hasLL?`<button type="button" class="osm-map-focus-btn" data-action="osm-focus" data-lat="${lat}" data-lon="${lon}" data-name="${esc(name)}" data-address="${esc(addr)}" title="地圖" aria-label="地圖"><i class="uil uil-location-point"></i></button>`:'';
    const listBtn=`<button type="button" class="osmListBtn" data-action="osm-list" title="清單" aria-label="清單"><i class="uil uil-list-ul"></i></button>`;
    const toggle=`<button type="button" class="more-btn${hasMore?'':' is-hidden'}" data-action="map-ad-toggle" aria-expanded="false"${hasMore?'':' hidden'}><i class="uil uil-angle-down"></i> 顯示更多</button>`;
    const actions=`<div class="feed-actions map-ad-actions">${toggle}<div class="right">${refs}${mapBtn}${listBtn}</div></div>`;
    const ts='mapad-'+String(name).replace(/[^\w\u4e00-\u9fff]+/g,'-')+'-'+Date.now()+'-'+Math.floor(Math.random()*10000);
    const source=mapAdSourceKey(p);
    const sourceTitle=source?` title="${esc(source)}"`:'';
    const head=`<div class="feed-header map-ad-head"><div class="info"><span class="map-ad-sponsored"><i class="uil uil-megaphone"></i>彰基優惠</span><h3>${esc(name)}</h3><small${sourceTitle}>${esc(cat||'優惠資訊')}</small></div></div>`;
    const metaHtml=`<div class="map-ad-meta"><i class="uil uil-ticket"></i><span>${esc(coupon)}</span></div>`;
    const body=`<div class="map-ad-body">${metaHtml}${prices}${summaryBlock}</div>`;
    const card=`<div class="map-ad-card">${gallery}${body}</div>${detail}${actions}`;
    return `<div class="feed fade-slide map-ad-feed" data-ts="${esc(ts)}" data-map-ad="1" data-map-source="${esc(source)}">${head}<div class="feed-ai-main"><div class="caption map-ad-caption">${card}</div></div></div>`;
  }

  async function buildFeedBatchWithMapAds(batch){
    const ads=await ensureMapAdPlaces();
    let html='';
    for(const f of batch||[]){
      const feedHtml=buildFeed(f);
      html+=feedHtml;
      if(feedHtml.indexOf('feed-ai-collapsed')>=0){
        mapAdAiCollapsedCount++;
        if(mapAdAiCollapsedCount%4===0){
          const ad=pickMapAdPlace(ads);
          if(ad) html+=buildMapAdFeed(ad);
        }
      }
    }
    return html;
  }

  function sortFeedArray(){feedArray.sort((a,b)=>(b.ts||0)-(a.ts||0))}
  let feedScrollAnchorTs = null;
  let feedAppending=false;

  function clearRenderedFeeds(){
    qsa('.feed').forEach(el=>{
      if(el.id!=='daysCalcFeed') el.remove();
    });
  }

  async function appendNextFeedBatch(){
    if(feedAppending) return 0;
    const remaining = feedArray.length - feedRenderIndex;
    if(remaining<=0){ setSentinelVisible(false); return 0; }
    feedAppending=true;
    const batch = feedArray.slice(feedRenderIndex, feedRenderIndex + FEED_BATCH_SIZE);
    feedRenderIndex += batch.length;
    try{
      if(typeof window.__loadSqliteFeedBodies==='function') await window.__loadSqliteFeedBodies(batch);
      const sentinel = ensureFeedSentinel();
      const batchHtml = await buildFeedBatchWithMapAds(batch);
      sentinel.insertAdjacentHTML('beforebegin', batchHtml);
      setupMapAdToggle();
      setupMapAdSlideshows(document);
      setupMapAdImageFallback(document);
      setupMapAdBodyClamp(document);
      initMediaPlayers();
      initCaptionSlideshows(document);
      initLazyImages(document);
      initFeedGeoMaps(document);
      applyAllFilters();
      setSentinelVisible(feedRenderIndex < feedArray.length);
      return batch.length;
    }finally{
      feedAppending=false;
    }
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

  async function renderAllFeeds(){
    normalizeYtConstants();
    let oldTop=null;
    if(feedScrollAnchorTs!=null){
      const oldEl=document.querySelector(`.feed[data-ts="${CSS.escape(String(feedScrollAnchorTs))}"]`);
      if(oldEl) oldTop=oldEl.getBoundingClientRect().top;
    }

    clearRenderedFeeds();
    sortFeedArray();
    resetMapAdInsertion();

    feedRenderIndex=0;
    setSentinelVisible(true);

    await appendNextFeedBatch();

    if(feedScrollAnchorTs!=null){
      const idx=feedArray.findIndex(f=>String(f.ts)===String(feedScrollAnchorTs));
      if(idx>=0){
        while(feedRenderIndex<=idx){
          const n=await appendNextFeedBatch();
          if(!n) break;
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
    try{updateOsmFeedIndexFromFeedArray();}catch(e){}
    resetInfiniteFeedObserver();
  }
  function openFeedCommentsInEl(el){
    if(!el) return;
    const panel=qs('.feed-comments',el);
    if(panel) panel.style.display='block';
    el.classList.add('feed-highlight');
    setTimeout(()=>{try{el.classList.remove('feed-highlight');}catch(e){}},1600);
  }  window.openFeedCommentByTs=function(ts){
    ts=String(ts||'').trim();
    if(!ts) return;
    let delay=0;
    try{
      const panel=document.getElementById('app_map');
      const fsBtn=document.getElementById('osmMapFullscreenBtn');
      if(document.body.classList.contains('osm-no-scroll')&&panel&&panel.classList.contains('osm-fullscreen')&&fsBtn){
        fsBtn.click();
        delay=160;
      }
    }catch(e){}
    const run=async()=>{
      let el=document.querySelector(`.feed[data-ts="${CSS.escape(ts)}"]`);
      if(!el){
        feedScrollAnchorTs=ts;
        await renderAllFeeds();
        el=document.querySelector(`.feed[data-ts="${CSS.escape(ts)}"]`);
      }
      if(!el) return;
      try{el.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){try{window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-12)}catch(e2){}}
      openFeedCommentsInEl(el);
    };
    if(delay) setTimeout(run,delay);
    else run();
  }
  const buildAdvUserItem=u=>`<label data-id="${esc(u.id)}"><input type="radio" name="advUserPreset" value="${esc(u.id)}" data-name="${esc(u.name)}" data-avatar="${esc(u.avatar)}"${u.default?' checked':''}><img src="${esc(u.avatar)}" alt="${esc(u.name)}"><span>${esc(u.name)}</span></label>`;
  function renderAdvUsers(){qs('#advUserList').innerHTML=ADV_USERS.map(buildAdvUserItem).join('')}
  function ensureNotifPopup(){let p=qs('#notifPopup');if(!p){p=d.createElement('div');p.id='notifPopup';p.className='notifications-popup';d.body.appendChild(p)}return p}
  function renderNotifs(){const p=ensureNotifPopup();if(!p)return;const arr=(typeof getSystemNotifs==='function'?getSystemNotifs():SYSTEM_NOTIFS);p.innerHTML=arr.map(n=>`<div class="notice"><img src="${n.img}" alt=""><div>${n.html}</div></div>`).join('')}
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
  function positionNotif(){const m=qs('#notifications'),p=ensureNotifPopup();if(!m||!p)return;const r=m.getBoundingClientRect();p.style.display='flex';p.style.visibility='hidden';p.style.top='-9999px';p.style.left='-9999px';requestAnimationFrame(()=>{const pw=p.offsetWidth;let top=rectBottom(r)+8;const leftTarget=r.left-20;let left=Math.max(8,Math.min(window.innerWidth-pw-8,leftTarget));if(top+p.offsetHeight>window.innerHeight-8){top=Math.max((r.top-8)-p.offsetHeight,8)}p.style.top=top+'px';p.style.left=left+'px';p.style.visibility='visible'})}
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
  async function ensureFeedsForActiveTopic(){
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
      const n=await appendNextFeedBatch();
      if(!n) break;
    }
  }
  async function setActiveTopicKey(key){
    activeTopicKey = key || '';
    window.__CURRENT_TOPIC_FILTER_KEY__ = activeTopicKey;
    feedScrollAnchorTs = null;
    if(feedInfiniteObserver) feedInfiniteObserver.disconnect();
    if(activeTopicKey){
      setSentinelVisible(true);
      let loaded=false;
      if(typeof window.__loadSqliteFeedsForTopic==='function'){
        try{loaded=await window.__loadSqliteFeedsForTopic(activeTopicKey);}catch(e){loaded=false;}
      }
      if(!loaded) await ensureFeedsForActiveTopic();
    }else if(typeof window.__restoreSqliteFullFeedIndex==='function'){
      try{await window.__restoreSqliteFullFeedIndex();}catch(e){}
    }
    await renderAllFeeds();
    applyAllFilters();
  }
  
  function ensureCalcFeed(){
    let feed=qs('#daysCalcFeed');
    if(!feed){
      const firstFeed=qs('.feed');
const html=`
      <div class="feed fade-slide" id="daysCalcFeed">
        <div class="feed-header">
          <div class="avatar"><img src="${U.ICON(cchCdnUrl('system/9641509.png'))}" alt=""></div>
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
  function showMore(){if(expanded)return;expanded=true;qs('#profile-pic').style.display='none';qs('#create-post').style.display='none';const adv=qs('#advancedEditorWrapper');adv.style.display='flex';const dt=qs('#advDate');if(dt&&!dt.value)dt.valueAsDate=new Date}
  function hideMore(){if(!expanded||feedEditState.active)return;expanded=false;qs('#profile-pic').style.display='flex';qs('#create-post').style.display='flex';const adv=qs('#advancedEditorWrapper');adv.style.display='none'}
  function initFocusToggle(){qs('#advYoutube').style.display='none';qs('#advImages').style.display='none';const mgr=qs('#advImageManager');if(mgr)mgr.style.display='flex';const form=qs('#postForm');const trigger=qs('#create-post');if(!form||!trigger)return;['focus','click','pointerdown','touchstart'].forEach(ev=>trigger.addEventListener(ev,()=>{showMore()}));document.addEventListener('mousedown',e=>{if(!expanded)return;const t=e.target;if(form.contains(t))return;const f=qs('#advUrlFloatBackdrop');if(f&&f.contains(t))return;const m=qs('#advMediaMenu');if(m&&m.contains(t))return;hideMore()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){const f=qs('#advUrlFloatBackdrop');if(f&&!f.classList.contains('hide'))return;const m=qs('#advMediaMenu');if(m&&m.style.display==='block')return;hideMore();trigger.blur()}})}

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
    if(!name.toLowerCase().endsWith('.sqlite')) name+='.sqlite';
    if(name.includes('/')||name.includes('\\')) return '';
    if(!/^[A-Za-z0-9_-]+\.sqlite$/i.test(name)) return '';
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
        }).filter(function(n){ return /\.sqlite$/i.test(n); });
      }catch(e){files=[];}
    }
    if(!files.length) files=['1100.sqlite','909090.sqlite','909091.sqlite','909092.sqlite'];
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
      if(/^[A-Za-z0-9_-]+\.sqlite$/i.test(base)) return base;
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
      const uid=c.userId!=null?String(c.userId):(c.publisherId!=null?String(c.publisherId):(c.publisherID!=null?String(c.publisherID):''));
      const dt=c.datetime!=null?String(c.datetime):'';
      const tx=c.text!=null?String(c.text):(c.comments!=null?String(c.comments):(c.comment!=null?String(c.comment):''));
      return {userId:uid||_safePublisherIdForFile(f),datetime:(dt&&dt.trim()?dt:_safeDatetimeForFile(f)),text:tx};
    }).filter(Boolean);
  }

  function _jsonText(v){try{return JSON.stringify(v==null?null:v)}catch(e){return 'null'}}
  function _sqliteBaseName(v){return String(_feedBasename(v)||'feedarray.sqlite').replace(/\.js$/i,'.sqlite')}
  function _lineListForSqlite(v){if(v==null||v==='')return [];if(Array.isArray(v))return v.map(x=>String(x||'').trim()).filter(Boolean);const s=String(v);try{const j=JSON.parse(s);if(Array.isArray(j))return j.map(x=>String(x||'').trim()).filter(Boolean)}catch(e){}return s.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)}
  function _uniqLinesForSqlite(arr){const out=[];(arr||[]).forEach(v=>{v=String(v||'').trim();if(v&&!out.includes(v))out.push(v)});return out}
  function _joinLinesForSqlite(arr){return _uniqLinesForSqlite(arr).join('\n')}
  function _splitDatetimeForSqlite(dt){const s=String(dt||'').trim();const m=s.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}:\d{2})(?::\d{2})?)?/);let d='',t='';if(m){d=m[1]||'';t=m[2]||'';if(t==='00:00')t=''}return{date:d,time:t}}
  function _stripImgsForSqlite(html){let s=String(html||'');const imgs=[];s=s.replace(/<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gi,(m,q,src)=>{if(src)imgs.push(src);return ''});s=s.replace(/<img\b[^>]*?\bsrc\s*=\s*([^\s>]+)[^>]*>/gi,(m,src)=>{if(src)imgs.push(String(src).replace(/^['"]|['"]$/g,''));return ''});return{html:s.trim(),imgs:_uniqLinesForSqlite(imgs)}}
  function _extractLinksForSqlite(html){const links=[];String(html||'').replace(/<a\b[^>]*?\bhref\s*=\s*(["'])(.*?)\1[^>]*>[\s\S]*?<\/a>/gi,(m,q,href)=>{if(href)links.push(href);return m});return _uniqLinesForSqlite(links)}
  function _xmsIdForSqlite(v){const m=String(v||'').trim().match(/elearning\.xms\.cch\.org\.tw\/course\/(\d+)|(?:^|[?&])courseId=(\d+)|^(\d{3,8})$/i);return m?(m[1]||m[2]||m[3]||''):''}
  function _youtubeIdForSqlite(v){const s=String(v||'').trim();if(!s)return'';if(s==='U.ELEARNING')return'U.ELEARNING';if(_xmsIdForSqlite(s))return'';let m=s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/i);if(m)return m[1];m=s.match(/[?&]v=([A-Za-z0-9_-]{11})/);if(m)return m[1];if(/^[A-Za-z0-9_-]{11}$/.test(s))return s;return s}
  function _textOnlyForSqlite(html){const div=d.createElement('div');div.innerHTML=String(html||'');return (div.textContent||'').replace(/\s+/g,'').trim()}
  function _isPhotoOnlyForSqlite(caption,photos,f){if(f&&f.isPhotoOnly)return 1;if(!photos.length)return 0;const t=_textOnlyForSqlite(caption);if(!t)return 1;return t.indexOf('高清圖片請參考')===0?1:0}
  function _splitCdnForSqlite(list){
 const cdn=[];const ext=[];const base=String(window.CDNurl||window.CDNURL||'').replace(/\/+$/,'')+'/';
 (Array.isArray(list)?list:[list]).forEach(v=>{String(v||'').split(/\n|\|/).map(x=>x.trim()).filter(Boolean).forEach(u=>{if(base&&u.indexOf(base)===0)cdn.push(u.slice(base.length));else ext.push(u);});});
 return {ext:[...new Set(ext)].join('\n'),cdn:[...new Set(cdn)].join('\n')};
}
function _sqlUserId(v){
 if(v==null)return'';
 if(typeof v==='object')return String(v.userId||v.publisherID||v.publisherId||v.uid||v.id||'').trim();
 const s=String(v||'').trim();
 if(!s)return'';
 let m=s.match(/['"]?(?:userId|publisherID|publisherId|uid|id)['"]?\s*:\s*['"]([^'"]+)['"]/i);
 if(m)return m[1].trim();
 m=s.match(/User\d{7}/i);
 if(m)return m[0];
 return s;
}
function _likeIdsForSqlite(f){
 const ids=[];
 function add(v){v=_sqlUserId(v);if(v&&!ids.includes(v))ids.push(v);}
 if(f&&Array.isArray(f.likeList))f.likeList.forEach(add);
 if(f&&String(f.lecturersID||'').trim())String(f.lecturersID).split(/[\s,，、|;；]+/).forEach(add);
 return ids;
}
function _imageLikeForSqlite(u){return /\.(?:png|jpe?g|gif|webp|bmp|svg)(?:[?#]|$)/i.test(String(u||'').split('?')[0])||/images\.pexels\.com|sysdata\/course\//i.test(String(u||''));}
function _photoRefUrlForSqlite(html){const s=String(html||'');let m=s.match(/高清圖片請參考[:：]?\s*<a\b[^>]*?href\s*=\s*(["'])(.*?)\1/i);if(m)return m[2]||'';m=s.match(/https?:\/\/dpt\.cch\.org\.tw\/layout\/layout_2\/item_detail\.aspx\?[^"'<>\s]+/i);return m?m[0]:'';}
function _stripPhotoRefForSqlite(html,url){let s=String(html||'');if(url){s=s.replace(/高清圖片請參考[:：]?\s*<a\b[^>]*?>[\s\S]*?<\/a>/ig,'');s=s.replace(url,'');}return s.trim();}
function _canonicalFeedForSqlite(f){
 f=f||{};
 const photos=[];
 let cap=String(f.caption||'').replace(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi,function(_,u){photos.push(u);return'';});
 if(f.photosURL)photos.push(f.photosURL);
 if(Array.isArray(f.slides))f.slides.forEach(x=>photos.push(x));
 const slideUrl=String(f.SlideShowURL||f.slideShowURL||f.slideshowURL||'').trim()||_photoRefUrlForSqlite(cap);
 cap=_stripPhotoRefForSqlite(cap,slideUrl);
 if(slideUrl)cap='';
 const ps=_splitCdnForSqlite(photos);
 const extPhotos=_lineListForSqlite(ps.ext).filter(_imageLikeForSqlite);
 const dt=String(f.datetime||'').trim();
 const m=dt.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}))?/);
 const xms=(String(f.courseLink||'').match(/\/course\/(\d+)/)||[])[1]||'';
 const ytRaw=String(f.yt||'').trim();
 const isElearning=ytRaw==='U.ELEARNING'||ytRaw.indexOf('U.ELEARNING')>=0;
 const yt=isElearning?'U.ELEARNING':(ytRaw.match(/(?:v=|youtu\.be\/|embed\/)?([A-Za-z0-9_-]{11})/)?.[1]||'');
 const lecturerIds=String(f.lecturersID||'').trim()||((isElearning||xms)?_likeIdsForSqlite(f).join('\n'):'');
 const rawLinks=Array.isArray(f.linksURL)?f.linksURL.join('\n'):(f.linksURL||'');
 let linkLines=_lineListForSqlite(rawLinks).filter(x=>x!==slideUrl);
 if(!ps.cdn&&extPhotos.length)linkLines=linkLines.concat(extPhotos);
 linkLines=_uniqLinesForSqlite(linkLines);
 const srt=String(f.srt||'').trim();
 if(srt)cap='';
 return {FID:f.FID||'',date:m?m[1]:'',time:m&&m[2]&&m[2]!=='00:00'?m[2]:'',publisherID:_sqlUserId(f.publisherID||f.publisherId||''),lecturersID:lecturerIds,tagID:f.tagID||'',title:f.title||'',caption:cap,srt:srt,SlideShowURL:slideUrl,photosCDNURL:ps.cdn,linksURL:linkLines.join('\n'),youtubeIDURL:xms?'':yt,xmsIDURL:xms,topic:Array.isArray(f.topics)?f.topics.join('\n'):(f.topic||f.topics||'')};
}
async function buildFeedSqliteBytes(arr,src){
 await ensureSqlJs();
 const db=new SQL.Database();
 db.run('CREATE TABLE comments(FID INTEGER, date TEXT, time TEXT, publisherID TEXT, comments TEXT, photosURL TEXT, photosCDNURL TEXT, isLike INTEGER, isShare INTEGER)');
 db.run('CREATE TABLE feeds(FID INTEGER, date TEXT, time TEXT, publisherID TEXT, lecturersID TEXT, tagID TEXT, title TEXT, caption TEXT, srt TEXT, SlideShowURL TEXT, photosCDNURL TEXT, linksURL TEXT, youtubeIDURL TEXT, xmsIDURL TEXT, topic TEXT)');
 const fi=db.prepare('INSERT INTO feeds VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
 const ci=db.prepare('INSERT INTO comments VALUES(?,?,?,?,?,?,?,?,?)');
 (arr||[]).forEach((it,i)=>{const r=_canonicalFeedForSqlite(it);r.FID=i+1;fi.run([r.FID,r.date,r.time,r.publisherID,r.lecturersID,r.tagID,r.title,r.caption,r.srt,r.SlideShowURL,r.photosCDNURL,r.linksURL,r.youtubeIDURL,r.xmsIDURL,r.topic]);(it.likeList||[]).forEach(x=>{const uid=_sqlUserId(x);if(uid)ci.run([r.FID,'','',uid,'','','',1,0]);});(it.commentList||[]).forEach(c=>{const ps=_splitCdnForSqlite((c&&(c.photosURL||c.photos))||[]);const uid=_sqlUserId(c&&(c.publisherID||c.publisherId||c.userId||c.uid||c.id));const text=String((c&&(c.comments!=null?c.comments:(c.text!=null?c.text:c.comment)))||'');const dt=_splitDatetimeForSqlite(c&&(c.datetime||c.date)||'');ci.run([r.FID,dt.date,dt.time,uid,text,ps.ext,ps.cdn,0,0]);});const n=Number(it.shares||0);for(let k=0;k<n;k++)ci.run([r.FID,'','','','','','',0,1]);});
 fi.free();ci.free();
 const bytes=db.export();db.close();return bytes;
}
const __FEED_FILE_HANDLES__={};

  async function persistFeedFile(src){
    if(!src) return;
    src=_sqliteBaseName(src);
    _ensureFeedFileExists(src);
    try{if(typeof window.__loadSqliteAllBodiesForSource==='function') await window.__loadSqliteAllBodiesForSource(src)}catch(e){}
    const arr=(window.__FEED_SOURCE_MAP__&&Array.isArray(window.__FEED_SOURCE_MAP__[src]))?window.__FEED_SOURCE_MAP__[src]:[];
    let bytes=null;
    try{bytes=await buildFeedSqliteBytes(arr,src)}catch(e){flashMsg('SQLite 產生失敗');return}
    const name=_sqliteBaseName(src)||'feedarray.sqlite';
    try{
      if(window.showSaveFilePicker){
        let handle=__FEED_FILE_HANDLES__[src];
        if(!handle){
          handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:'SQLite',accept:{'application/vnd.sqlite3':['.sqlite','.db','.sqlite3']}}]});
          __FEED_FILE_HANDLES__[src]=handle;
        }
        const w=await handle.createWritable();
        await w.write(bytes);
        await w.close();
        flashMsg('已寫入 '+name);
        return;
      }
    }catch(e){flashMsg('取消寫入');return}
    try{
      const blob=new Blob([bytes],{type:'application/vnd.sqlite3'});
      const url=URL.createObjectURL(blob);
      const a=d.createElement('a');
      a.href=url;
      a.download=name;
      d.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1200);
      flashMsg('已匯出 '+name);
    }catch(e){flashMsg('寫入失敗')}
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
  function startEditFeed(item){if(!item)return;feedEditState.active=true;feedEditState.item=item;feedEditState.srcFile=item.__srcFile||'';const sel=qs('#feedSourceInput');const inp=qs('#feedSourceInput');if(sel){feedEditState.prevTargetFile=sel.value;sel.value=feedEditState.srcFile||window.__DEFAULT_FEED_FILE__||sel.value;sel.disabled=true}if(inp)inp.style.display='none';showMore();qs('#advYoutube').style.display='none';const mgr=qs('#advImageManager');if(mgr)mgr.style.display='flex';qs('#advImages').style.display='none';if(!mainActionDefaultText){const el=qs('#mainActionText');mainActionDefaultText=el?el.textContent:''}setMainActionText('修改');let u=null;const pid=String(item.publisherId||item.userId||'');if(pid)u=_advUserById(pid);if(!u&&item.avatar)u=ADV_USERS.find(x=>x&&x.avatar===item.avatar)||null;if(!u&&item.user)u=ADV_USERS.find(x=>x&&x.name===item.user)||null;if(u){advCurrentUserId=String(u.id||pid||'');advCurrentUserName=String(u.name||'您');advCurrentUserAvatar=String(u.avatar||_defaultAvatar()||'');const r=qs('#advUserList input[name=advUserPreset][value="'+CSS.escape(advCurrentUserId)+'"]');if(r)r.checked=true}else{advCurrentUserId=pid;advCurrentUserName=String(item.user||'您');advCurrentUserAvatar=String(item.avatar||_defaultAvatar()||'')}updateSelectedAvatarDisplay();qs('#advTitle').value=String(item.title||'').replace(/\s*•\s*$/,'').trim();const di=dateInputFromItem(item);if(di)qs('#advDate').value=di;qs('#advYoutube').value=String(item.yt||'');const parts=splitCaptionImages(item.caption||'');qs('#advEditor').innerHTML=parts.body||'';qs('#advImages').value=(parts.imgs||[]).join('\n');renderAdvImageThumbs();setTopicsFromItem(item);setLikesFromItem(item);setAdvSelectedGeo(item.geo||null);qs('#advancedEditorWrapper').scrollIntoView({behavior:'smooth',block:'center'});qs('#advEditor').focus()}
  function stopEditFeed(clear){feedEditState.active=false;feedEditState.item=null;feedEditState.srcFile='';const sel=qs('#feedSourceInput');const inp=qs('#feedSourceInput');if(sel){sel.disabled=false;const v=feedEditState.prevTargetFile||window.__DEFAULT_FEED_FILE__||sel.value; if(v) sel.value=v;}feedEditState.prevTargetFile='';if(inp)inp.style.display='none';resetMainActionText();if(clear){qs('#advTitle').value='';qs('#advImages').value='';qs('#advEditor').innerHTML='';selectedTopics=[];likeAvatarsSelected=[];qsa('#advTopicList input[type=checkbox]').forEach(cb=>{cb.checked=false;const label=cb.closest('label');if(label)label.classList.remove('selected')});renderTopicDisplay();renderLikeAvatars()}renderAdvImageThumbs();setAdvSelectedGeo(null);}
  function deleteFeedItem(item){if(!item)return;if(feedEditState.active&&feedEditState.item===item)stopEditFeed(true);if(!confirm('確定刪除這則 feed？'))return;const src=item.__srcFile||'';if(src&&window.__FEED_SOURCE_MAP__&&Array.isArray(window.__FEED_SOURCE_MAP__[src])){const arr=window.__FEED_SOURCE_MAP__[src];let idx=arr.indexOf(item);if(idx===-1){const ts=String(item.ts||'');idx=arr.findIndex(x=>String(x&&x.ts||'')===ts)}if(idx!==-1)arr.splice(idx,1)}let idx2=feedArray.indexOf(item);if(idx2===-1){const ts=String(item.ts||'');idx2=feedArray.findIndex(x=>String(x&&x.ts||'')===ts)}if(idx2!==-1)feedArray.splice(idx2,1);renderAllFeeds();if(src)persistFeedFile(src);}

  function mainActionBtn2(){
    const name=String((advCurrentUserName||'您')).replace(/</g,'&lt;');
    const avatar=String((advCurrentUserAvatar||_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png'));
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
    const geo=(advSelectedGeo&&isFinite(Number(advSelectedGeo.lat))&&isFinite(Number(advSelectedGeo.lon)))?{name:String(advSelectedGeo.name||''),address:String(advSelectedGeo.address||''),lat:Number(advSelectedGeo.lat),lon:Number(advSelectedGeo.lon)}:null;
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
      if(geo){item.geo=geo;}else{try{delete item.geo}catch(e){item.geo=null}}
      if(!Array.isArray(item.commentList)) item.commentList=[];
      if(typeof item.comments!=='number') item.comments=item.commentList.length||0;
      if(typeof item.shares!=='number') item.shares=0;
      if(feedArray.indexOf(item)===-1) feedArray.push(item);
      if(src){
        map[src]=Array.isArray(map[src])?map[src]:[];
        if(map[src].indexOf(item)===-1) map[src].push(item);
      }
      stopEditFeed(true);
      renderAllFeeds();if(src)persistFeedFile(src);
      return;
    }
    const dateTxt=dateInput||'剛剛';
    const dt=dateInput?dateInput+' 08:00:00':'';
    const ts=getTimestamp(dt||dateInput||null);
    const srcNew=(typeof window._selectedFeedFileForCreate==='function'?window._selectedFeedFileForCreate():(window.__DEFAULT_FEED_FILE__||''));if(srcNew===null)return;
    const newItem={publisherId:advCurrentUserId||'',user:name,avatar,title:title||'',date:dateTxt,datetime:dt||dateTxt,caption:formatted||'',yt:yt||ytRaw,likes:likeAvatars.length,likeAvatars:likeAvatars,likeName:likeName,comments:0,commentList:[],shares:0,ts,topics:topics,__srcFile:srcNew};
    if(geo) newItem.geo=geo;
    feedArray.push(newItem);
    if(srcNew){
      map[srcNew]=Array.isArray(map[srcNew])?map[srcNew]:[];
      map[srcNew].push(newItem);
    }
    renderAllFeeds();if(srcNew)persistFeedFile(srcNew);try{setAdvSelectedGeo(null)}catch(e){}
  }
  function initPosting(){qs('#postForm').addEventListener('submit',e=>{e.preventDefault();const txt=String(qs('#advEditor').textContent||'').trim();const imgs=parseAdvImages();const yt=parseAdvYoutube();const hasGeo=advSelectedGeo&&isFinite(Number(advSelectedGeo.lat))&&isFinite(Number(advSelectedGeo.lon));if(!txt&&!imgs.length&&!yt&&!hasGeo&&!feedEditState.active)return;mainActionBtn2()})}
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
  let advPlaceIndex=null,advPlaceIndexSize=0,advPlaceIndexRef=null,advPlaceEnsureP=null;

  function buildAdvPlaceIndex(){
    const places=Array.isArray(window.PLACES)?window.PLACES:[];
    if(advPlaceIndex&&advPlaceIndexRef===places&&advPlaceIndexSize===places.length) return advPlaceIndex;
    advPlaceIndexSize=places.length;
    advPlaceIndexRef=places;
    const out=[];
    for(let i=0;i<places.length;i++){
      const p=places[i]||{};
      const pName=String(p.name||'').trim();
      const br=Array.isArray(p.branches)?p.branches:[];
      if(!br.length){
        const lat=Number(p.lat),lon=Number(p.lon);
        const addr=String(p.address||p.addr||'').trim();
        if(isFinite(lat)&&isFinite(lon)&&(pName||addr)) out.push({name:pName||'地點',address:addr,lat:lat,lon:lon,cat:String(p.cat||'').trim()});
        continue;
      }
      for(let j=0;j<br.length;j++){
        const b=br[j]||{};
        const lat=Number(b.lat??b.latitude),lon=Number(b.lon??b.lng??b.longitude);
        if(!isFinite(lat)||!isFinite(lon)) continue;
        const name=String(b.name||pName||'').trim();
        const address=String(b.addr||b.address||b.addr1||b.location||'').trim();
        const cat=String(b.cat||p.cat||'').trim();
        if(!name&&!address) continue;
        out.push({name:name,address:address,lat:lat,lon:lon,cat:cat});
      }
    }
    advPlaceIndex=out;
    return out;
  }
  function setAdvSelectedGeo(g){

    if(g&&typeof g==='object'&&isFinite(Number(g.lat))&&isFinite(Number(g.lon))){
      advSelectedGeo={name:String(g.name||''),address:String(g.address||g.addr||''),lat:Number(g.lat),lon:Number(g.lon)};
    }else{
      advSelectedGeo=null;
    }
    const wrap=qs('#advPlaceSelected');
    const nameEl=qs('#advPlaceSelectedName');
    const addrEl=qs('#advPlaceSelectedAddr');
    if(!wrap||!nameEl||!addrEl) return;
    if(advSelectedGeo){
      wrap.classList.add('show');
      nameEl.textContent=advSelectedGeo.name||'地點';
      addrEl.textContent=advSelectedGeo.address||'';
    }else{
      wrap.classList.remove('show');
      nameEl.textContent='';
      addrEl.textContent='';
    }
  }
  function initAdvPlaceAI(){
    const root=qs('#advToolbarAI');
    const btn=qs('#advPlaceBtn');
    const panel=qs('#advPlacePanel');
    const input=qs('#advPlaceInput');
    const suggest=qs('#advPlaceSuggest');
    const clear=qs('#advPlaceClear');
    if(!root||!btn||!panel||!input||!suggest||!clear) return;
    const hideSuggest=()=>{suggest.classList.remove('show');suggest.innerHTML='';suggest.style.maxHeight='';};
    const hidePanel=()=>{panel.classList.remove('show');hideSuggest();};
    const fitSuggest=()=>{if(!suggest.classList.contains('show'))return;const vv=window.visualViewport;const vh=(vv&&vv.height)||window.innerHeight||0;const off=(vv&&vv.offsetTop)||0;const r=suggest.getBoundingClientRect();const top=(r.top||0)-off;const pad=12;const max=Math.max(160,Math.floor(vh-top-pad));suggest.style.maxHeight=max+'px';};
    const scheduleFit=()=>{try{requestAnimationFrame(fitSuggest)}catch(e){fitSuggest()}};
    window.addEventListener('resize',scheduleFit,{passive:true});
    if(window.visualViewport) window.visualViewport.addEventListener('resize',scheduleFit,{passive:true});
    const ensureAdvPlaces=()=>{
      if(advPlaceEnsureP) return advPlaceEnsureP;
      if(window.__OSM_PLACES_READY&&Array.isArray(window.PLACES)&&window.PLACES.length){advPlaceEnsureP=Promise.resolve(true);return advPlaceEnsureP;}
      if(typeof window.ensureOsmPlaces==='function') advPlaceEnsureP=Promise.resolve().then(()=>window.ensureOsmPlaces()).catch(()=>null);
      else advPlaceEnsureP=Promise.resolve(null);
      return advPlaceEnsureP;
    };
    const normPlace=v=>String(v||'').toLowerCase().replace(/[　\s]+/g,'').replace(/[()（）\[\]【】{}「」『』"'“”‘’，、;；:：\.。!?！？\-—_]+/g,'');
    const showPanel=()=>{panel.classList.add('show');input.value='';hideSuggest();setTimeout(()=>input.focus(),0);ensureAdvPlaces().then(()=>{advPlaceIndex=null;advPlaceIndexRef=null;});};
    btn.addEventListener('click',()=>{if(panel.classList.contains('show')) hidePanel(); else showPanel();});
    clear.addEventListener('click',()=>{setAdvSelectedGeo(null);});
    suggest.addEventListener('click',e=>{
      const b=e.target.closest('button[data-lat]');
      if(!b) return;
      const g={name:b.dataset.name||'',address:b.dataset.address||'',lat:Number(b.dataset.lat),lon:Number(b.dataset.lon)};
      setAdvSelectedGeo(g);
      hidePanel();
      const ed=qs('#advEditor');
      if(ed) ed.focus();
    });
    input.addEventListener('input',()=>{
      const q=String(input.value||'').trim();
      if(!q){hideSuggest();return;}
      const nq=normPlace(q);
      let idx=buildAdvPlaceIndex();
      if(!idx.length && !window.__OSM_PLACES_READY){
        ensureAdvPlaces().then(()=>{advPlaceIndex=null;advPlaceIndexRef=null;const cur=String(input.value||'').trim();if(cur===q) input.dispatchEvent(new Event('input'));});
        return;
      }
      idx=buildAdvPlaceIndex();
      const res=[];
      for(let i=0;i<idx.length;i++){
        const it=idx[i];
        const a=(it.name||'')+(it.address||'')+(it.cat||'');
        const na=normPlace(a);
        if(na.includes(nq)) res.push(it);
        if(res.length>=8) break;
      }
      if(!res.length){hideSuggest();return;}
      suggest.innerHTML=res.map(it=>`<button type="button" data-lat="${it.lat}" data-lon="${it.lon}" data-name="${esc(it.name||'')}" data-address="${esc(it.address||'')}"><span>${esc(it.name||'地點')}</span><small>${esc(it.address||it.cat||'')}</small></button>`).join('');
      suggest.classList.add('show');scheduleFit();
    });
    input.addEventListener('keydown',e=>{if(e.key==='Escape'){hidePanel();}});
    document.addEventListener('click',e=>{if(!root.contains(e.target)) hideSuggest();});
    setAdvSelectedGeo(null);
  }
  qs('#advEditor').addEventListener('paste',function(){setTimeout(()=>qs('#clearFormat').click(),0)});
  function updateSelectedAvatarDisplay(){const img=qs('#advSelectedAvatarImg');if(img)img.src=(String(advCurrentUserAvatar||'').trim()||_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png')}
  function renderLikeAvatars(){const wrap=qs('#advLikeAvatarList');if(!wrap)return;if(!likeAvatarsSelected.length){wrap.innerHTML='<span style="font-size:.6rem;color:var(--c-text-soft);letter-spacing:.5px;">(尚未選擇)</span>';return}wrap.innerHTML=likeAvatarsSelected.map((a,i)=>`<div class="la-item" data-idx="${i}" title="點按移除"><img src="${a}" alt=""><button type="button" data-remove="${i}">&times;</button></div>`).join('')}
  function renderAdvTopics(){
    const list=qs('#advTopicList');
    if(!list)return;
    refreshTopicMeta();
    const html=(Array.isArray(TOPIC_GROUPS)?TOPIC_GROUPS:[]).map(g=>{
      const color=g.color||'#0ea5e9';
      const topics=(g.topics||[]).map(t=>{
        const raw=String(t||'').trim();
        if(!raw)return'';
        const key=raw.includes('::')?raw:`${g.id}::${raw}`;
        const checked=selectedTopics.includes(key)?' checked':'';
        const selected=selectedTopics.includes(key)?' selected':'';
        const label=raw.includes('::')?raw.split('::').slice(1).join('::'):raw;
        return`<label class="topic-sub${selected}" data-key="${esc(key)}" data-topic="${esc(label)}" data-group="${esc(g.id)}" data-color="${esc(color)}"><input type="checkbox" value="${esc(key)}"${checked}><span>${esc(label)}</span></label>`
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
  function initCompactAvatarToggle(){const w=qs('#advancedEditorWrapper'),btn=qs('#advSelectedAvatar');if(btn)btn.addEventListener('click',()=>{selectionMode='user';w.classList.toggle('show-users')})}
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
  function initNotifications(){const notifMenu=qs('#notifications'),popup=ensureNotifPopup();if(!notifMenu||!popup)return;notifMenu.addEventListener('click',e=>{e.preventDefault();const visible=popup.style.display==='flex';if(visible){popup.style.display='none'}else{positionNotif();const c=qs('#notifCount');if(c)c.style.display='none'}});document.addEventListener('click',e=>{if(!notifMenu.contains(e.target)&&!popup.contains(e.target))popup.style.display='none'})}
  function initGlobalSearch(){
    const input=qs('#globalSearch');
    input.addEventListener('keydown',e=>{if(e.key==='Enter')e.preventDefault()});
    input.addEventListener('input',()=>{const v=input.value.trim().toLowerCase();activeSearchQuery=v;filterQuickLinksGlobal(v);applyAllFilters()})
  }
  function initQuickLinks(){
    const catBar=qs('#quick-categories');
    const search=qs('#app_search');
    const links=qs('#links-container');
    if(!catBar||!links)return;
    renderCategories();
    const active=catBar.querySelector('button.active[data-cat]')||catBar.querySelector('button[data-cat]');
    if(active)renderLinks(active.dataset.cat);else links.innerHTML='<p style="font-size:.75rem;color:var(--c-text-soft);padding:.5rem;">載入中…</p>';
    if(!catBar.dataset.boundQuickLinks){
      catBar.dataset.boundQuickLinks='1';
      catBar.addEventListener('click',e=>{const b=e.target.closest('button[data-cat]');if(!b)return;qsa('button[data-cat]',catBar).forEach(x=>x.classList.remove('active'));b.classList.add('active');renderLinks(b.dataset.cat);if(search)search.value=''});
    }
    if(search&&!search.dataset.boundQuickLinks){
      search.dataset.boundQuickLinks='1';
      search.addEventListener('input',e=>{filterQuickLinksGlobal(e.target.value.trim().toLowerCase())});
    }
    if(!links.dataset.boundQuickLinks){
      links.dataset.boundQuickLinks='1';
      links.addEventListener('click',e=>{
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
  }
  function initStories(){renderStories();qsa('.story').forEach(st=>st.addEventListener('click',()=>{window.open(st.dataset.link,'_blank')}))}
  function initTheme(){qs('#sidebarThemeToggle').addEventListener('click',toggleTheme);qs('#themeToggle').addEventListener('click',toggleTheme);if(localStorage.getItem('portalTheme')==='dark'){document.body.setAttribute('data-theme','dark');qs('#themeToggle').innerHTML='<i class="uil uil-sun"></i>'}}
  function initAppToggle(){
    const btn=qs('#AppBtn');
    if(!btn)return;
    const layout=qs('.layout');
    const icon=btn.querySelector('i');
    const root=document.documentElement;
    let baseH=0;
    function readH(){
      const m=qs('#osmMap');
      if(!m)return 0;
      const h=Math.round((m.getBoundingClientRect().height||0));
      return h;
    }
    function capture(){
      const h=readH();
      if(h>0)baseH=h;
    }
    function apply(on){
      if(on){
        if(!baseH)capture();
        const h=baseH||200;
        root.style.setProperty('--osm-map-fixed-h',h+'px');
      }else{
        root.style.removeProperty('--osm-map-fixed-h');
        requestAnimationFrame(capture);
      }
    }
    capture();
    window.addEventListener('resize',()=>{if(!layout.classList.contains('app-mode'))capture()},{passive:true});
    btn.addEventListener('click',()=>{
      if(!layout.classList.contains('app-mode'))capture();
      const isAppMode=layout.classList.toggle('app-mode');
      apply(isAppMode);
      requestAnimationFrame(()=>{try{window.dispatchEvent(new Event('resize'))}catch(e){}});
      try{if(typeof window.osmExitFullscreenAndReset==='function') window.osmExitFullscreenAndReset();}catch(e){}
      if(icon)icon.className=isAppMode?'uil uil-arrow-from-right':'uil uil-left-arrow-from-left';
    })
  }
  function initKeyboard(){document.addEventListener('keydown',e=>{if(e.key==='k'&&(e.metaKey||e.ctrlKey)){e.preventDefault();const inp=qs('#globalSearch');if(inp&&inp.offsetParent!==null)inp.focus()}if(e.key==='Escape'){const p=qs('#notifPopup');if(p)p.style.display='none'}})}
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
  function initNavTopicFilter(){const groupSel=document.querySelector('#topicGroupSelect');const subSel=document.querySelector('#topicSubSelect');const clearBtn=document.querySelector('#clearTopicFilter');if(!groupSel||!subSel||!clearBtn)return;function renderGroups(){refreshTopicMeta();groupSel.innerHTML='<option value="">全部内容</option>'+(Array.isArray(TOPIC_GROUPS)?TOPIC_GROUPS:[]).map(function(g){return'<option value="'+esc(g.id)+'">'+esc(g.name)+'</option>'}).join('')}function fillSub(gid){const g=(Array.isArray(TOPIC_GROUPS)?TOPIC_GROUPS:[]).find(function(x){return x.id===gid});if(!g){subSel.innerHTML='<option value="">全部專欄</option>';subSel.disabled=true;return}subSel.innerHTML='<option value="">全部專欄</option>'+(g.topics||[]).map(function(t){const raw=String(t||'').trim();if(!raw)return'';const parts=raw.split('::');const label=parts.length>1?parts.slice(1).join('::'):raw;const full=(parts.length>1?raw:(gid?gid+'::'+raw:raw));return'<option value="'+esc(full)+'">'+esc(label)+'</option>'}).join('');subSel.disabled=false}renderGroups();fillSub(groupSel.value||'');if(!groupSel.dataset.boundTopicFilter){groupSel.dataset.boundTopicFilter='1';groupSel.addEventListener('change',function(){const gid=groupSel.value||'';if(!gid){fillSub('');setActiveTopicKey('');return}fillSub(gid);subSel.value='';setActiveTopicKey(gid+'::')})}if(!subSel.dataset.boundTopicFilter){subSel.dataset.boundTopicFilter='1';subSel.addEventListener('change',function(){const gid=groupSel.value||'';if(!gid){setActiveTopicKey('');return}const v=subSel.value||'';if(!v){setActiveTopicKey(gid+'::');return}const full=v.includes('::')?v:(gid+'::'+v);setActiveTopicKey(full)})}if(!clearBtn.dataset.boundTopicFilter){clearBtn.dataset.boundTopicFilter='1';clearBtn.addEventListener('click',function(){setActiveTopicKey('');groupSel.value='';fillSub('');subSel.value=''})}}
  const TTSPlayer={currentFeed:null,utterance:null,playing:false,highlightTimer:null,lastBoundaryAt:0,cfg:{wordsPerSecond:2.6,maxChunkChars:900,voiceLangsPrefer:['zh-TW','zh-Hant','zh-CN','cmn-Hant','cmn','zh']},cancel(){clearTtsHighlightTimer();try{if(TTS_SUPPORTED)speechSynthesis.cancel()}catch(e){}if(this.currentFeed){qsa('.tts-word.reading,.tts-word.pass',this.currentFeed).forEach(w=>w.classList.remove('reading','pass'));const mp=this.currentFeed.querySelector('.media-player');if(mp){const icon=mp.querySelector('.mp-play i');if(icon)icon.className='uil uil-play';mp.dataset.state='idle';const prog=mp.querySelector('.mp-progress');if(prog)prog.style.width='0%'}}this.utterance=null;this.currentFeed=null;this.playing=false;this.lastBoundaryAt=0;}  }; 
  let ttsWarmedUp=false;
  let userVoiceName=localStorage.getItem('ttsVoiceName')||'';
  async function warmupTTS(){if(ttsWarmedUp)return;if(!TTS_SUPPORTED){ttsWarmedUp=true;return}try{try{await getVoicesAsync(2500)}catch(e){}const u=new SpeechSynthesisUtterance('。');u.lang='zh-TW';speechSynthesis.speak(u);speechSynthesis.cancel();ttsWarmedUp=true}catch(e){ttsWarmedUp=true}}
  function clearTtsHighlightTimer(){if(TTSPlayer.highlightTimer){clearInterval(TTSPlayer.highlightTimer);TTSPlayer.highlightTimer=null}}
  function ttsIsSrtIndexLine(s){return /^\d{1,5}$/.test(String(s||'').trim())}
  function ttsIsSrtTimingLine(s){return /^\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,.]\d{1,3}/.test(String(s||'').trim())}
  function ttsIsUrlText(s){s=String(s||'').trim();return /^(https?:\/\/|www\.)/i.test(s)||/^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(s)}
  function ttsCleanDisplayText(text){return String(text||'').replace(/\r/g,'\n').split('\n').map(line=>line.trim()).filter(line=>line&&!ttsIsSrtIndexLine(line)&&!ttsIsSrtTimingLine(line)).map(line=>line.replace(/https?:\/\/\S+/ig,'').replace(/\s+/g,' ').trim()).filter(Boolean).join('\n').trim()}
  function ttsShouldSkipNode(node){const el=node&&node.parentElement;if(!el)return true;return !!el.closest('button,.more-btn,.caption-slideshow,.post-images,script,style,noscript,iframe,video,audio,svg,canvas,.media-player,.feed-actions,.feed-comments,.yt-ai-quiz,.yt-ai-transcript')}
  function ttsSplitSpeakableToken(token){let t=String(token||'').trim();if(!t||ttsIsUrlText(t)||/^[-–—>]+$/.test(t))return[];t=t.replace(/\s+/g,' ');if(/[\u3400-\u9fff]/.test(t)&&Array.from(t).length>14){const chunks=[];let buf='';Array.from(t).forEach(ch=>{buf+=ch;if(/[，。！？；、,.!?;:：]/.test(ch)||Array.from(buf).length>=14){chunks.push(buf);buf=''}});if(buf)chunks.push(buf);return chunks.filter(Boolean)}return[t]}
  function ttsAppendSpeakableText(frag,text,idxRef,allWords){String(text||'').split(/(https?:\/\/[^\s<>"]+)/ig).forEach(piece=>{if(!piece)return;if(/^https?:\/\//i.test(piece)){frag.appendChild(document.createTextNode(piece));return}piece.split(/(\s+)/).forEach(p=>{if(!p)return;if(/\s+/.test(p)){frag.appendChild(document.createTextNode(p));return}const sub=ttsSplitSpeakableToken(p);if(!sub.length){frag.appendChild(document.createTextNode(p));return}sub.forEach(part=>{const span=document.createElement('span');span.className='tts-word';span.textContent=part;span.dataset.w=idxRef.value++;frag.appendChild(span);allWords.push(part)})})})}
  function ttsBuildFragmentFromText(text,idxRef,allWords){const frag=document.createDocumentFragment();String(text||'').split(/(\r\n|\n|\r)/).forEach(part=>{if(!part)return;if(/^(\r\n|\n|\r)$/.test(part)){frag.appendChild(document.createTextNode(part));return}const trimmed=part.trim();if(!trimmed){frag.appendChild(document.createTextNode(part));return}if(ttsIsSrtIndexLine(trimmed)||ttsIsSrtTimingLine(trimmed)){frag.appendChild(document.createTextNode(part));return}ttsAppendSpeakableText(frag,part,idxRef,allWords)});return frag}
  function unwrapTtsWords(root){if(!root)return;qsa('.tts-word',root).forEach(s=>{s.replaceWith(document.createTextNode(s.textContent||''))});try{root.normalize()}catch(e){}}
  function ttsEstimateDuration(words){const text=(words||[]).join('');const chars=Array.from(text).length;return Math.max(1.2,chars/4.5,(words||[]).length/Math.max(1,TTSPlayer.cfg.wordsPerSecond))}
  function initMediaPlayers(){qsa('.feed').forEach(feed=>{const mp=qs('.media-player',feed);if(!mp)return;if(!TTS_SUPPORTED){const btn=qs('.mp-btn',mp);if(btn){btn.disabled=true;btn.title='此裝置瀏覽器不支援文字朗讀功能'}return}if(!feed._ttsEventsBound){setupMediaEvents(feed);feed._ttsEventsBound=true}if(!feed._ttsData)prepareCaptionForTTS(feed)})}
  function prepareCaptionForTTS(feedEl){const capEl=qs('.caption',feedEl);if(!capEl)return false;unwrapTtsWords(capEl);const walker=document.createTreeWalker(capEl,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!node.nodeValue||!node.nodeValue.trim())return NodeFilter.FILTER_REJECT;if(ttsShouldSkipNode(node))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});let textNodes=[];while(walker.nextNode())textNodes.push(walker.currentNode);let idxRef={value:0};const allWords=[];textNodes.forEach(n=>{const frag=ttsBuildFragmentFromText(n.nodeValue,idxRef,allWords);if(n.parentNode)n.parentNode.replaceChild(frag,n)});if(!allWords.length){const item=getFeedItemByElement(feedEl);const fallback=ttsCleanDisplayText((item&&item.title)||stripHtml((item&&item.caption)||''));ttsSplitSpeakableToken(fallback).forEach(w=>allWords.push(w))}const plain=allWords.join(' ');feedEl._ttsData={words:allWords,totalWords:allWords.length,plainText:plain,estimatedDuration:ttsEstimateDuration(allWords),startWordOffset:0,chunkEndWord:0,chunkDuration:0,elapsedSec:0,startedAt:0,currentWordIndex:0,resumeFromWord:0};return allWords.length>0}
  function setupMediaEvents(feed){const mp=qs('.media-player',feed);if(!mp)return;mp.addEventListener('click',async e=>{const btn=e.target.closest('[data-action]');if(!btn)return;const action=btn.dataset.action;if(action==='play'){await togglePlay(feed)}else if(action==='seek'){await seekFromClick(feed,e)}})}
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
    let data=feed._ttsData;
    if(!data||!data.totalWords){prepareCaptionForTTS(feed);data=feed._ttsData}
    if(!data||!data.totalWords){mp.dataset.state='idle';if(playIcon)playIcon.className='uil uil-play';return}
    if(TTSPlayer.currentFeed&&TTSPlayer.currentFeed!==feed){TTSPlayer.cancel()}
    if(state==='playing'){
      TTSPlayer.playing=false;
      clearTtsHighlightTimer();
      try{speechSynthesis.cancel()}catch(e){}
      mp.dataset.state='paused';
      if(playIcon)playIcon.className='uil uil-play';
      if(playBtn){playBtn.setAttribute('title','播放');playBtn.setAttribute('aria-pressed','false')}
      return;
    }
    if(state==='paused'&&data&&data.totalWords>0){
      const startIdx=Math.max(0,Math.min(data.totalWords-1,data.resumeFromWord||data.currentWordIndex||0));
      const ok=await startReading(feed,startIdx);
      if(!ok)return;
      mp.dataset.state='playing';
      if(playIcon)playIcon.className='uil uil-pause';
      if(playBtn){playBtn.setAttribute('title','暫停');playBtn.setAttribute('aria-pressed','true')}
      TTSPlayer.playing=true;
      requestAnimationFrame(()=>updateProgressLoop(feed));
      return;
    }
    const ok=await startReading(feed,0);
    if(!ok)return;
    mp.dataset.state='playing';
    if(playIcon)playIcon.className='uil uil-pause';
    if(playBtn){playBtn.setAttribute('title','暫停');playBtn.setAttribute('aria-pressed','true')}
  }
  function ttsMakeChunk(words,startWord){const maxChars=TTSPlayer.cfg.maxChunkChars||900;let end=startWord,chars=0;while(end<words.length){const w=String(words[end]||'');if(end>startWord&&chars+w.length+1>maxChars)break;chars+=w.length+1;end++}if(end<=startWord)end=Math.min(words.length,startWord+1);return{words:words.slice(startWord,end),end}}
  async function startReading(feed,startWord,opts={}){
    if(!TTS_SUPPORTED)return false;
    let data=feed._ttsData;
    if(!data||!data.totalWords){prepareCaptionForTTS(feed);data=feed._ttsData}
    if(!data||data.totalWords===0)return false;
    const mp=qs('.media-player',feed);
    const playIcon=qs('.mp-play i',mp);
    const playBtn=qs('.mp-play',mp);
    if(!opts.continuation){
      if(TTSPlayer.currentFeed&&TTSPlayer.currentFeed!==feed)TTSPlayer.cancel();
      else{TTSPlayer.playing=false;clearTtsHighlightTimer();try{speechSynthesis.cancel()}catch(e){}}
    }
    TTSPlayer.currentFeed=feed;
    TTSPlayer.utterance=null;
    qsa('.tts-word.reading,.tts-word.pass',feed).forEach(w=>w.classList.remove('reading','pass'));
    const safeStart=Math.max(0,Math.min(data.totalWords-1,startWord||0));
    data.startWordOffset=safeStart;
    const chunk=ttsMakeChunk(data.words,safeStart);
    const chunkWords=chunk.words;
    const text=chunkWords.join(' ').trim();
    if(!text)return false;
    data.chunkEndWord=chunk.end;
    data.chunkDuration=ttsEstimateDuration(chunkWords);
    data.currentWordIndex=safeStart;
    data.resumeFromWord=safeStart;
    const u=new SpeechSynthesisUtterance(text);
    u.rate=1;
    u.lang='zh-TW';
    let voices=[];
    try{voices=speechSynthesis.getVoices()||[]}catch(e){voices=[]}
    let chosen=null;
    if(userVoiceName){chosen=voices.find(v=>v.name===userVoiceName)||null}
    if(!chosen){chosen=chooseBestChineseVoice(voices)}
    if(chosen){u.voice=chosen;u.lang=chosen.lang}
    const markStarted=()=>{data.startedAt=performance.now();data.elapsedSec=0;if(mp)mp.dataset.state='playing';if(playIcon)playIcon.className='uil uil-pause';if(playBtn){playBtn.setAttribute('title','暫停');playBtn.setAttribute('aria-pressed','true')}TTSPlayer.playing=true;TTSPlayer.lastBoundaryAt=0;highlightWord(feed,safeStart);updateProgress(feed,safeStart/data.totalWords);startTtsHighlightFallback(feed);requestAnimationFrame(()=>updateProgressLoop(feed))};
    u.onstart=markStarted;
    u.onend=()=>{if(TTSPlayer.currentFeed!==feed||!TTSPlayer.playing)return;clearTtsHighlightTimer();data.resumeFromWord=chunk.end;data.currentWordIndex=Math.max(0,chunk.end-1);if(chunk.end<data.totalWords&&mp&&mp.dataset.state==='playing'){startReading(feed,chunk.end,{continuation:true});return}if(mp)mp.dataset.state='ended';if(playIcon)playIcon.className='uil uil-play';if(playBtn){playBtn.setAttribute('title','播放');playBtn.setAttribute('aria-pressed','false')}TTSPlayer.playing=false;highlightWord(feed,data.totalWords-1);updateProgress(feed,1)};
    u.onerror=()=>{clearTtsHighlightTimer();if(mp)mp.dataset.state='idle';if(playIcon)playIcon.className='uil uil-play';if(playBtn){playBtn.setAttribute('title','播放');playBtn.setAttribute('aria-pressed','false')}TTSPlayer.playing=false};
    u.onboundary=ev=>{try{if(typeof ev.charIndex!=='number')return;TTSPlayer.lastBoundaryAt=performance.now();const relWordIdx=charIndexToWordIndex(chunkWords,ev.charIndex);const absWordIdx=Math.max(0,Math.min(data.totalWords-1,data.startWordOffset+relWordIdx));data.currentWordIndex=absWordIdx;data.resumeFromWord=absWordIdx;highlightWord(feed,absWordIdx);updateProgress(feed,(absWordIdx+1)/data.totalWords)}catch(err){}};
    try{markStarted();speechSynthesis.speak(u);TTSPlayer.utterance=u;return true}catch(err){clearTtsHighlightTimer();if(mp)mp.dataset.state='idle';if(playIcon)playIcon.className='uil uil-play';TTSPlayer.playing=false;return false}
  }
  function startTtsHighlightFallback(feed){clearTtsHighlightTimer();TTSPlayer.highlightTimer=setInterval(()=>{try{if(!TTSPlayer.playing||TTSPlayer.currentFeed!==feed){clearTtsHighlightTimer();return}const mp=qs('.media-player',feed);if(!mp||mp.dataset.state!=='playing'){clearTtsHighlightTimer();return}const data=feed._ttsData;if(!data||!data.totalWords)return;const now=performance.now();if(TTSPlayer.lastBoundaryAt&&now-TTSPlayer.lastBoundaryAt<900)return;const elapsed=(now-(data.startedAt||now))/1000;const span=Math.max(1,(data.chunkEndWord||data.totalWords)-(data.startWordOffset||0));const chunkDur=Math.max(.8,data.chunkDuration||span/TTSPlayer.cfg.wordsPerSecond);let idx=(data.startWordOffset||0)+Math.floor((elapsed/chunkDur)*span);idx=Math.max(0,Math.min((data.chunkEndWord||data.totalWords)-1,data.totalWords-1,idx));if(idx!==data.currentWordIndex){data.currentWordIndex=idx;data.resumeFromWord=idx;highlightWord(feed,idx);updateProgress(feed,(idx+1)/data.totalWords)}}catch(e){}},240)}
  function charIndexToWordIndex(words,charIndex){let pos=0;for(let i=0;i<words.length;i++){const w=String(words[i]||'');const end=pos+w.length;if(charIndex<end+1)return i;pos=end+1}return Math.max(0,words.length-1)}
  function highlightWord(feed,idx){const words=qsa('.tts-word',feed);words.forEach(w=>{const i=Number(w.dataset.w);w.classList.toggle('reading',i===idx);w.classList.toggle('pass',i<idx)});const span=feed.querySelector(`.tts-word[data-w="${idx}"]`);if(span&&span.scrollIntoView){const r=span.getBoundingClientRect();if(r.top<80||r.bottom>window.innerHeight-80){try{span.scrollIntoView({behavior:'smooth',block:'nearest',inline:'nearest'})}catch(e){}}}}
  function updateProgress(feed,ratio){ratio=Math.max(0,Math.min(1,ratio||0));const mp=qs('.media-player',feed);const prog=mp?qs('.mp-progress',mp):null;if(prog)prog.style.width=ratio*100+'%'}
  function updateProgressLoop(feed){if(!TTSPlayer.playing||TTSPlayer.currentFeed!==feed)return;const mp=qs('.media-player',feed);if(mp&&mp.dataset.state==='playing'){const data=feed._ttsData;if(data&&data.totalWords){const now=performance.now();const rel=(now-data.startedAt)/1000;const span=Math.max(1,(data.chunkEndWord||data.totalWords)-(data.startWordOffset||0));const chunkDur=Math.max(.8,data.chunkDuration||span/TTSPlayer.cfg.wordsPerSecond);const estWords=Math.min(span,(rel/chunkDur)*span);updateProgress(feed,((data.startWordOffset||0)+estWords)/data.totalWords)}requestAnimationFrame(()=>updateProgressLoop(feed))}}
  async function seekFromClick(feed,e){
    expandIfTruncated(feed);
    const bar=e.target.closest('.mp-timeline');
    if(!bar||!TTS_SUPPORTED)return;
    const rect=bar.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const ratio=Math.max(0,Math.min(1,x/rect.width));
    let data=feed._ttsData;
    if(!data||!data.totalWords){prepareCaptionForTTS(feed);data=feed._ttsData}
    if(!data||!data.totalWords)return;
    const targetWord=Math.max(0,Math.min(data.totalWords-1,Math.floor(ratio*data.totalWords)));
    const mp=qs('.media-player',feed);
    const wasPlaying=mp&&mp.dataset.state==='playing';
    data.resumeFromWord=targetWord;
    data.currentWordIndex=targetWord;
    highlightWord(feed,targetWord);
    updateProgress(feed,targetWord/data.totalWords);
    if(!wasPlaying){
      if(mp)mp.dataset.state='paused';
      const icon=qs('.mp-play i',mp);
      if(icon)icon.className='uil uil-play';
      TTSPlayer.playing=false;
      return;
    }
    await startReading(feed,targetWord);
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
    const ts=String(feedEl.dataset.ts||'').trim();
    if(!ts)return null;
    const exact=feedArray.find(f=>String(f&&f.ts||'')===ts);
    if(exact)return exact;
    const num=Number(ts);
    if(isFinite(num)){
      const byNum=feedArray.find(f=>Number(f&&f.ts)===num);
      if(byNum)return byNum;
    }
    return null
  }
  function getCurrentLikeUser(){const name=String((advCurrentUserName||'您')).trim()||'您';const avatar=String((advCurrentUserAvatar||_defaultAvatar()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png')).trim()||'https://cdn-icons-png.flaticon.com/128/1828/1828843.png';return{name,avatar}}
  function stripHtml(html){
    if(typeof captionHtmlToText==='function') return captionHtmlToText(html);
    const temp=document.createElement('div');
    temp.innerHTML=html||'';
    temp.querySelectorAll('br').forEach(br=>{br.replaceWith(document.createTextNode('\n'));});
    return(temp.textContent||'').replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n[ \t]+/g,'\n').replace(/[ \t]{2,}/g,' ').trim();
  }
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
    const menu=document.querySelector('#mainMenu');
    body.classList.remove('menu-open');

    if(menu){
      menu.querySelectorAll('.menu-item').forEach(el=>{
        el.style.left='';
        el.style.top='';
      });
    }

    const backdrop=document.getElementById('toyMenuBackdrop');
    if(backdrop) backdrop.style.display='none';

    const toy=document.getElementById('ScrollToy');
    if(toy){
      toy.setAttribute('aria-label','回到頁面上方');
      toy.setAttribute('aria-expanded','false');
      if(!toy.dataset.scrollTopBound){
        toy.dataset.scrollTopBound='1';
        toy.addEventListener('click',e=>{
          e.preventDefault();
          e.stopPropagation();
          window.scrollTo({top:0,behavior:'smooth'});
        });
        toy.addEventListener('keydown',e=>{
          if(e.key==='Enter'||e.key===' '){
            e.preventDefault();
            window.scrollTo({top:0,behavior:'smooth'});
          }
        });
      }
    }

    const clearArcInlineStyles=()=>{
      body.classList.remove('menu-open');
      if(!menu) return;
      menu.querySelectorAll('.menu-item').forEach(el=>{
        el.style.left='';
        el.style.top='';
      });
    };

    window.addEventListener('resize',clearArcInlineStyles,{passive:true});
    if(mql&&mql.addEventListener){
      mql.addEventListener('change',clearArcInlineStyles);
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
    updateMobileToySize(){
      if(!this.el||!this.img) return;
      const menu=document.querySelector('#mainMenu');
      const vw=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);
      const cs=getComputedStyle(document.documentElement);
      const gap=parseFloat(cs.getPropertyValue('--mobile-edge-gap'))||10;
      let menuW=0;
      if(menu){
        const r=menu.getBoundingClientRect();
        menuW=r&&r.width?r.width:0;
      }
      const available=Math.max(42,Math.floor(vw-menuW-gap*2));
      const desktopCap=132;
      const screenCap=Math.max(48,Math.floor(Math.min(vw*.28,desktopCap)));
      const size=Math.max(42,Math.min(available,screenCap,desktopCap));
      document.documentElement.style.setProperty('--scroll-toy-mobile-size',size+'px');
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
      this.el.style.left='';
      this.el.style.right='';
      this.el.style.bottom='';
      this.el.style.top='';
      this.el.style.transform='';
      this.updateMobileToySize();

      this.dock='mobile';
      this.setDockPhysics()
    }
    updateDock(force=false){
      const isMobile=!!(window.matchMedia&&window.matchMedia('(max-width: 760px)').matches);
      if(isMobile){
        if(this.dock!=='mobile'||force) this.dockMobile();
        else this.updateMobileToySize()
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
  function initScrollToy(){const list=(typeof toy!=='undefined'&&Array.isArray(toy)?toy:null);const fallback=['system/toy1.png','system/toy2.png','system/toy3.png','system/toy4.png'].map(p=>typeof window.cchCdnUrl==='function'?window.cchCdnUrl(p):p);const srcs=(list&&list.length?list:fallback).map(v=>typeof v==='string'?v:(v&&v.src)||'').filter(Boolean);if(!srcs.length)return;window.ScrollToy=ScrollToy;if(window.ScrollToyInstance&&window.ScrollToyInstance.el){window.ScrollToyInstance.srcs=srcs;window.ScrollToyInstance.i=0;if(window.ScrollToyInstance.img)window.ScrollToyInstance.img.src=srcs[0];return}window.ScrollToyInstance=new ScrollToy(srcs).mount().start()}
  function buildYtIframe(id,startSec=0,autoplay=false){const iframe=document.createElement('iframe');let src=U.YT_EMBED(id);try{const u=new URL(src,location.href);u.searchParams.set('enablejsapi','1');u.searchParams.set('playsinline','1');if(location.origin&&/^https?:/i.test(location.origin))u.searchParams.set('origin',location.origin);startSec=Math.max(0,Math.floor(Number(startSec)||0));if(startSec>0)u.searchParams.set('start',String(startSec));if(autoplay)u.searchParams.set('autoplay','1');src=u.toString()}catch(e){const sep=src.includes('?')?'&':'?';src+=sep+'enablejsapi=1'+(startSec?('&start='+Math.floor(startSec)):'')+(autoplay?'&autoplay=1':'')}iframe.src=src;iframe.loading='lazy';iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.title='YouTube';return iframe}
  function activateYtLazy(el,startSec=0,autoplay=false){try{const id=String(el&&el.dataset&&el.dataset.ytId||'').trim();const wrap=el.closest('.video-wrapper');const courseLink=String((el&&el.dataset&&(el.dataset.courseLink||el.dataset.link))||(wrap&&wrap.dataset&&wrap.dataset.courseLink)||'').trim();if(!id){if(courseLink)window.open(courseLink,'_blank','noopener');return;}if(!wrap||wrap.dataset.loaded==='1')return;wrap.dataset.loaded='1';wrap.innerHTML='';wrap.appendChild(buildYtIframe(id,startSec,autoplay))}catch(e){}}
  function initLazyYoutubeEmbeds(){document.addEventListener('click',e=>{const t=e.target&&e.target.closest?e.target.closest('.yt-lazy'):null;if(!t)return;e.preventDefault();activateYtLazy(t,0,true)});document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const t=e.target&&e.target.closest?e.target.closest('.yt-lazy'):null;if(!t)return;e.preventDefault();activateYtLazy(t,0,true)})}
  function init(){
    const safe=(fn)=>{try{fn&&fn()}catch(e){}};
    safe(initStaticImages);
    safe(initScrollToy);
    safe(initToyMenu);
    safe(renderNotifs);
    safe(initNotifications);
    safe(initTheme);
    safe(initAppToggle);
    safe(initKeyboard);
    safe(initDaysCountdown);
    safe(initLinkButtons);
    safe(initFeedMoreMenu);
    safe(initStories);
    safe(initLazyYoutubeEmbeds);
    safe(initAiYoutubeTools);
    safe(initQuickLinks);
    safe(initAdvancedEditor);
    safe(initAdvPlaceAI);
    try{if(typeof window.initFeedSourcePicker==='function') window.initFeedSourcePicker();}catch(e){}
    safe(initFocusToggle);
    safe(initAdvImageManager);
    safe(initAdvUsers);
    safe(initLikeAvatarButton);
    safe(initTopics);
    safe(initPosting);
    safe(initTopicPillFiltering);
    safe(initGlobalSearch);
    try{if(typeof __renderAllFeedsIfReady==='function') __renderAllFeedsIfReady(); else renderAllFeeds();}catch(e){}
    safe(refreshVoiceSelect);
    safe(initIntroOverlay);
    safe(initIntroHint);
    safe(initNavTopicFilter);
    safe(initBookmarkMenu);
    safe(initFeedGeoToggle);
    safe(initFeedActions);
    safe(initCaptionExpander);
    safe(initClearTopicFilterReset)
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  }else{
    init();
  }
