(function(global){
var versionValue="20260610-v19-unified-caption-more";
global.version=versionValue;
var cdnValue=String(global.CDNurl||global.CDNURL||"").trim();
if(cdnValue)cdnValue=cdnValue.replace(/\/+$/,'')+'/';
if(cdnValue){global.CDNurl=cdnValue;global.CDNURL=cdnValue;}
(function(){
  var VERSION=String(global.version||"").trim();
  var URL_ATTRS=new Set(["src","href","poster","data-src","data-href"]);
  var CDN_HOSTS=new Set(["cdn.jsdelivr.net","fastly.jsdelivr.net","gcore.jsdelivr.net","cdnjs.cloudflare.com","unpkg.com","esm.sh","cdn.skypack.dev","fonts.googleapis.com","fonts.gstatic.com","unicons.iconscout.com"]);
  function isVersionTarget(url){
    var h=String(url&&url.hostname||"").toLowerCase();
    return CDN_HOSTS.has(h)||h.endsWith(".jsdelivr.net")||h==="github.com"||h.endsWith(".github.com")||h==="raw.githubusercontent.com"||h.endsWith(".githubusercontent.com")||h.endsWith(".github.io")||h.indexOf("cdn")!==-1;
  }
  function versionedUrl(raw){
    if(!VERSION||raw==null)return raw;
    var input=String(raw);
    var trim=input.trim();
    if(!trim||/^(data:|blob:|mailto:|tel:|javascript:)/i.test(trim))return input;
    var htmlAmp=trim.indexOf("&amp;")!==-1;
    var normalized=trim.replace(/&amp;/g,"&");
    try{
      var url=new URL(normalized,global.location.href);
      if(!/^https?:$/i.test(url.protocol)||!isVersionTarget(url))return input;
      url.searchParams.set("v",VERSION);
      var out=url.href;
      if(trim.slice(0,2)==='//')out=out.replace(/^https?:/i,"");
      if(htmlAmp)out=out.replace(/&/g,"&amp;");
      return input.replace(trim,out);
    }catch(e){return input;}
  }
  function rewriteHtml(html){
    if(html==null)return html;
    return String(html).replace(/\b(src|href|poster)\s*=\s*(["'])([^"']+)\2/gi,function(m,attr,q,url){return attr+"="+q+versionedUrl(url)+q;});
  }
  global.versionedUrl=versionedUrl;
  global.cdnGithubVersionedUrl=versionedUrl;
  global.addVersionToCdnGithub=versionedUrl;
  try{
    var nativeWrite=document.write.bind(document);
    document.write=function(){return nativeWrite.apply(document,Array.from(arguments).map(rewriteHtml));};
    var nativeWriteln=document.writeln.bind(document);
    document.writeln=function(){return nativeWriteln.apply(document,Array.from(arguments).map(rewriteHtml));};
  }catch(e){}
  try{
    var nativeSetAttribute=Element.prototype.setAttribute;
    Element.prototype.setAttribute=function(name,value){var n=String(name||"").toLowerCase();return nativeSetAttribute.call(this,name,URL_ATTRS.has(n)?versionedUrl(value):value);};
  }catch(e){}
  function patchUrlProperty(proto,prop){
    try{
      var d=Object.getOwnPropertyDescriptor(proto,prop);
      if(!d||!d.set||!d.get)return;
      Object.defineProperty(proto,prop,{configurable:true,enumerable:d.enumerable,get:function(){return d.get.call(this);},set:function(v){return d.set.call(this,versionedUrl(v));}});
    }catch(e){}
  }
  [HTMLScriptElement,HTMLImageElement,HTMLIFrameElement,HTMLSourceElement,HTMLVideoElement,HTMLAudioElement].forEach(function(C){if(C&&C.prototype)patchUrlProperty(C.prototype,"src");});
  [HTMLLinkElement,HTMLAnchorElement].forEach(function(C){if(C&&C.prototype)patchUrlProperty(C.prototype,"href");});
  if(global.HTMLVideoElement)patchUrlProperty(HTMLVideoElement.prototype,"poster");
  function patchHtmlProperty(proto,prop){
    try{
      var d=Object.getOwnPropertyDescriptor(proto,prop);
      if(!d||!d.set||!d.get)return;
      Object.defineProperty(proto,prop,{configurable:true,enumerable:d.enumerable,get:function(){return d.get.call(this);},set:function(v){return d.set.call(this,rewriteHtml(v));}});
    }catch(e){}
  }
  patchHtmlProperty(Element.prototype,"innerHTML");
  patchHtmlProperty(Element.prototype,"outerHTML");
  try{var nativeInsertAdjacentHTML=Element.prototype.insertAdjacentHTML;Element.prototype.insertAdjacentHTML=function(position,html){return nativeInsertAdjacentHTML.call(this,position,rewriteHtml(html));};}catch(e){}
  try{
    var d=Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype,"srcdoc");
    if(d&&d.set&&d.get){Object.defineProperty(HTMLIFrameElement.prototype,"srcdoc",{configurable:true,enumerable:d.enumerable,get:function(){return d.get.call(this);},set:function(v){return d.set.call(this,rewriteHtml(v));}});}
  }catch(e){}
  function versionNode(node){
    if(!node||node.nodeType!==1)return;
    URL_ATTRS.forEach(function(attr){if(node.hasAttribute&&node.hasAttribute(attr)){var oldVal=node.getAttribute(attr);var newVal=versionedUrl(oldVal);if(newVal!==oldVal)node.setAttribute(attr,newVal);}});
  }
  function scan(root){try{versionNode(root);if(root&&root.querySelectorAll){root.querySelectorAll("[src],[href],[poster],[data-src],[data-href]").forEach(versionNode);}}catch(e){}}
  try{var mo=new MutationObserver(function(list){list.forEach(function(m){if(m.type==="attributes")versionNode(m.target);else if(m.type==="childList")m.addedNodes.forEach(scan);});});mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["src","href","poster","data-src","data-href"]});}catch(e){}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){scan(document.documentElement);});else scan(document.documentElement);
})();
var __CCH_CDN_BASE__=String(global.CDNurl||global.CDNURL||'').trim().replace(/\/+$/,'');
global.CCH_CDN_PREFIX=global.CCH_CDN_PREFIX||(__CCH_CDN_BASE__?__CCH_CDN_BASE__+'/':'');
global.SQL_CDN_PREFIX=global.SQL_CDN_PREFIX||global.CCH_CDN_PREFIX;
function cchPreferCdnAssets(){
  try{
    var h=String(location.hostname||'').toLowerCase();
    var p=String(location.pathname||'');
    return !!global.__CCH_CDN_FIRST__||h.indexOf('googleusercontent.com')!==-1||p.indexOf('/embeds/')!==-1;
  }catch(e){return false;}
}
global.cchPreferCdnAssets=cchPreferCdnAssets;
global.__CCH_CDN_FIRST__=cchPreferCdnAssets();
global.cchCdnUrl=global.cchCdnUrl||function(file){
  file=String(file||'').replace(/^\/+/, '');
  var base=String(global.CDNurl||global.CDNURL||global.CCH_CDN_PREFIX||'').replace(/\/+$/,'')+'/';
  var u=base+file;
  return typeof global.versionedUrl==='function'?global.versionedUrl(u):u;
};
function cchAssetUrl(file,preferCdn){
  file=String(file||'').replace(/^\/+/, '');
  var u=preferCdn?(global.CCH_CDN_PREFIX+file):file;
  return typeof global.versionedUrl==='function'?global.versionedUrl(u):u;
}
global.cchAssetUrl=cchAssetUrl;
function getSettingScriptUrl(file){
  try{
    var root=(typeof global.settings!=='undefined'&&global.settings&&global.settings[0])?global.settings[0]:null;
    if(!root)return null;
    for(var group in root){
      if(!Object.prototype.hasOwnProperty.call(root,group))continue;
      var arr=root[group];
      if(!Array.isArray(arr))continue;
      for(var i=0;i<arr.length;i++){
        var scripts=arr[i]&&arr[i].script;
        if(!Array.isArray(scripts))continue;
        for(var j=0;j<scripts.length;j++){
          var m=scripts[j];
          if(m&&Object.prototype.hasOwnProperty.call(m,file)){var u=m[file]||file;return /^(https?:)?\/\//i.test(String(u||''))?(global.versionedUrl?global.versionedUrl(u):u):(global.cchCdnUrl?global.cchCdnUrl(u):u);}
        }
      }
    }
  }catch(e){}
  return null;
}
global.getSettingScriptUrl=getSettingScriptUrl;
})(window);
var versionedUrl=window.versionedUrl;
var cchPreferCdnAssets=window.cchPreferCdnAssets;
var cchAssetUrl=window.cchAssetUrl;
var cchCdnUrl=window.cchCdnUrl;

(function(global){
'use strict';
var CDN_PREFIX=String(global.CDNurl||global.CDNURL||global.CCH_CDN_PREFIX||global.SQL_CDN_PREFIX||'').replace(/\/?$/,'/');
var version=String(global.version||'').trim();
function vurl(u){u=String(u||'').trim();if(!u)return u;if(!version||/[?&]v=/.test(u))return u;return u+(u.indexOf('?')===-1?'?':'&')+'v='+encodeURIComponent(version);}
function baseName(p){return String(p||'').trim().split('/').pop().split('?')[0].split('#')[0];}
function uniqueUrls(arr){var out=[];(arr||[]).forEach(function(u){u=String(u||'').trim();if(u&&out.indexOf(u)<0)out.push(u);});return out}
function cdnBases(){var out=[];function add(v){v=String(v||'').trim().replace(/\/+$/,'');if(v&&out.indexOf(v)<0)out.push(v)}add(global.CDNurl||global.CDNURL||global.CCH_CDN_PREFIX||global.SQL_CDN_PREFIX||CDN_PREFIX||'');try{(global.CCH_CDN_FALLBACKS||[]).forEach(add);}catch(e){}add('https://cdn.jsdelivr.net/gh/cchfm1100/website@main');return out;}
function cdnRelAll(p){p=String(p||'').trim();if(!p)return[];if(/^(https?:)?\/\//i.test(p)||/^(data|blob):/i.test(p))return[vurl(p)];return cdnBases().map(function(base){return vurl(base+'/'+p.replace(/^\/+/,''));});}
function cdnRel(p){var c=cdnRelAll(p);return c[0]||'';}
function preferCdnFiles(){try{return (typeof global.cchPreferCdnAssets==='function'&&global.cchPreferCdnAssets())||!!global.__CCH_CDN_FIRST__}catch(e){return false}}
function localRel(p){p=String(p||'').trim();if(!p)return'';if(/^(https?:)?\/\//i.test(p)||/^(data|blob):/i.test(p))return vurl(p);try{return vurl(new URL(p,global.location.href).href)}catch(e){return vurl(p)}}
function isLocalGoogleCandidate(u){try{var x=new URL(String(u||''),global.location.href),h=String(x.hostname||'').toLowerCase(),lh=String(global.location.hostname||'').toLowerCase();return h===lh&&(h.indexOf('googleusercontent.com')!==-1||String(x.pathname||'').indexOf('/embeds/')!==-1)}catch(e){return false}}
function rowMatchesAsset(row,file){var want=baseName(file).toLowerCase();if(!want)return false;var l=baseName(row&&row.local).toLowerCase();var c=baseName(row&&row.CDN).toLowerCase();return l===want||c===want||String(row&&row.local||'').trim()===String(file||'').trim()||String(row&&row.CDN||'').trim()===String(file||'').trim()}
function mappedCdnValues(file){var out=[];function add(v){v=String(v||'').trim();if(v&&out.indexOf(v)<0)out.push(v)}try{(global.LOCAL_CDN||[]).forEach(function(r){if(rowMatchesAsset(r,file))add(r.CDN||r.local);});}catch(e){}try{(global.settings||[]).forEach(function(sec){Object.keys(sec||{}).forEach(function(k){(sec[k]||[]).forEach(function(g){(g.script||[]).forEach(function(m){Object.keys(m||{}).forEach(function(n){var v=m[n];if(baseName(n).toLowerCase()===baseName(file).toLowerCase())add(v||n);else if(baseName(v).toLowerCase()===baseName(file).toLowerCase())add(v);});});});});});}catch(e){}return out}
function fileCandidates(p){p=String(p||'').trim();if(!p)return[];if(/^(https?:)?\/\//i.test(p)||/^(data|blob):/i.test(p))return[vurl(p)];var locals=[localRel(p)],remotes=[];mappedCdnValues(p).forEach(function(v){remotes=remotes.concat(cdnRelAll(v));});remotes=remotes.concat(cdnRelAll(p));var b=baseName(p);if(b&&b!==p)remotes=remotes.concat(cdnRelAll(b));var arr=preferCdnFiles()?remotes.concat(locals):locals.concat(remotes);arr=uniqueUrls(arr);if(preferCdnFiles()&&!global.__CCH_ALLOW_LOCAL_EMBED_FALLBACK__)arr=arr.filter(function(u){return !isLocalGoogleCandidate(u)});return arr}
function fileRel(p){var c=fileCandidates(p);return c[0]||''}
global.cchAssetCandidates=global.cchAssetCandidates||fileCandidates;
function lines(v){return String(v||'').split(/\n|\|/).map(function(x){return x.trim();}).filter(Boolean);}
function setGlobal(k,v){global[k]=v;try{global.dispatchEvent(new CustomEvent('cch-settings-updated',{detail:{key:k}}));}catch(e){}}
var settings=[{"default":[{"style":[],"script":[{"settings.sqlite":"settings.sqlite"},{"settings.js":"settings.js"}]}],"apps":[{"style":[],"script":[{"datepicker.js":"datepicker.js"}]}],"map":[{"style":[],"script":[{"map.js":"map.js"},{"map.sqlite":"map.sqlite"},{"GeoCode.sqlite":"GeoCode.sqlite"}]}],"stories":[{"style":[],"script":[{"stories.sqlite":"stories.sqlite"}]}],"feeds":[{"style":[],"script":[{"1100.sqlite":"1100.sqlite"},{"909090.sqlite":"909090.sqlite"},{"909091.sqlite":"909091.sqlite"},{"909092.sqlite":"909092.sqlite"}]}]}];
var toy=[];
var TOPIC_GROUPS=[];
var QUICK_LINKS={};
var USER_AVATARS={};
var ADV_USERS=[];
var STORIES=[];
var LOCAL_CDN=[{"local":"settings.sqlite","CDN":"settings.sqlite","firstRunAsFeed":0},{"local":"settings.js","CDN":"settings.js","firstRunAsFeed":0},{"local":"datepicker.js","CDN":"datepicker.js","firstRunAsFeed":0},{"local":"map.js","CDN":"map.js","firstRunAsFeed":0},{"local":"feed.js","CDN":"feed.js","firstRunAsFeed":0},{"local":"map.sqlite","CDN":"map.sqlite","firstRunAsFeed":0},{"local":"stories.sqlite","CDN":"stories.sqlite","firstRunAsFeed":0},{"local":"1100.sqlite","CDN":"1100.sqlite","firstRunAsFeed":1},{"local":"909090.sqlite","CDN":"909090.sqlite","firstRunAsFeed":1},{"local":"909091.sqlite","CDN":"909091.sqlite","firstRunAsFeed":1},{"local":"909092.sqlite","CDN":"909092.sqlite","firstRunAsFeed":1},{"local":"GeoCode.sqlite","CDN":"GeoCode.sqlite","firstRunAsFeed":0}];
global.settings=global.settings||settings;
global.toy=global.toy||toy;
global.TOPIC_GROUPS=global.TOPIC_GROUPS||TOPIC_GROUPS;
global.QUICK_LINKS=global.QUICK_LINKS||QUICK_LINKS;
global.USER_AVATARS=global.USER_AVATARS||USER_AVATARS;
global.ADV_USERS=global.ADV_USERS||ADV_USERS;
global.STORIES=global.STORIES||STORIES;
global.LOCAL_CDN=global.LOCAL_CDN||LOCAL_CDN;
global.OSM_MAP_DATASET_ORDER=global.OSM_MAP_DATASET_ORDER||['map.sqlite'];
function buildSettings(localRows){
  var map={};(localRows||[]).forEach(function(r){var l=String(r.local||r.CDN||'');if(l){map[l]=r;map[baseName(l)]=r;}var c=String(r.CDN||'');if(c)map[baseName(c)]=r;});
  function one(file){var r=map[file]||map[baseName(file)]||{};var key=r.local||file;var v=r.CDN||r.local||file;var o={};o[key]=v;return o;}
  var feedRows=(localRows||[]).filter(function(r){return Number(r.firstRunAsFeed||0);}).map(function(r){return one(r.local||r.CDN);});
  return [{default:[{style:[],script:[one('settings.sqlite'),one('settings.js')]}],apps:[{style:[],script:[one('datepicker.js')]}],map:[{style:[],script:[one('map.js'),one('map.sqlite'),one('GeoCode.sqlite')]}],stories:[{style:[],script:[one('stories.sqlite')]}],feeds:[{style:[],script:feedRows}]}];
}
function refreshSite(){setTimeout(function(){try{if(typeof global.refreshTopicMeta==='function')global.refreshTopicMeta();}catch(e){}try{if(typeof global.renderNotifs==='function')global.renderNotifs();}catch(e){}try{if(typeof global.renderAdvTopics==='function')global.renderAdvTopics();}catch(e){}try{if(Array.isArray(global.feedArray)&&typeof global.normalizeFeedArray==='function'){global.feedArray.forEach(function(f){try{var uid=String((f&&f.publisherId)||'');var u=null;if(uid&&global.ADV_USERS){u=global.ADV_USERS[uid]||null;if(!u&&Array.isArray(global.ADV_USERS))u=global.ADV_USERS.find(function(x){return x&&String(x.id||'')===uid;})||null;}if(u){f.user=String(u.name||f.user||uid);f.avatar=String(u.avatar||f.avatar||'');}}catch(e){}});global.normalizeFeedArray(global.feedArray);}}catch(e){}try{if(typeof global.initStaticImages==='function')global.initStaticImages();}catch(e){}try{if(typeof global.initAdvUsers==='function'&&!global.__CCH_ADV_USERS_REINIT_DONE__&&Array.isArray(global.ADV_USERS)&&global.ADV_USERS.length){global.__CCH_ADV_USERS_REINIT_DONE__=true;global.initAdvUsers();}}catch(e){}try{if(typeof global.initQuickLinks==='function')global.initQuickLinks();else if(typeof global.renderCategories==='function')global.renderCategories();}catch(e){}try{if(typeof global.renderAdvTopics==='function')global.renderAdvTopics();}catch(e){}try{if(typeof global.renderTopicDisplay==='function')global.renderTopicDisplay();}catch(e){}try{if(typeof global.renderLinks==='function'){var ks=Object.keys(global.QUICK_LINKS||{});if(ks.length)global.renderLinks(ks[0]);}}catch(e){}try{if(typeof global.renderStories==='function')global.renderStories();}catch(e){}try{if(typeof global.initNavTopicFilter==='function')global.initNavTopicFilter();}catch(e){}try{if(typeof global.renderAllFeeds==='function'&&Array.isArray(global.feedArray)&&global.feedArray.length)global.renderAllFeeds();}catch(e){}try{if(typeof global.initScrollToy==='function'&&Array.isArray(global.toy)&&global.toy.length)global.initScrollToy();}catch(e){}},0);}
function applyConfig(key,value){try{if(key==='settings')global.settings=value;else if(key==='toy')global.toy=value;else if(key==='TOPIC_GROUPS')global.TOPIC_GROUPS=value;else if(key==='QUICK_LINKS')global.QUICK_LINKS=value;else if(key==='USER_AVATARS')global.USER_AVATARS=value;else if(key==='ADV_USERS')global.ADV_USERS=value;else if(key==='STORIES')global.STORIES=value;else if(key==='LOCAL_CDN')global.LOCAL_CDN=value;}catch(e){}}
function includeCss(href){try{if(!href)return;if([].some.call(document.querySelectorAll('link[rel="stylesheet"]'),function(l){return l.href&&l.href.indexOf(href)>=0;}))return;var l=document.createElement('link');l.rel='stylesheet';l.href=vurl(href);document.head.appendChild(l);}catch(e){}}
function includeScript(src){return new Promise(function(resolve,reject){try{if(!src)return resolve();if([].some.call(document.scripts,function(s){return s.src&&s.src.indexOf(src)>=0;}))return resolve();var el=document.createElement('script');el.src=vurl(src);el.async=false;el.onload=function(){resolve();};el.onerror=function(){reject(new Error('script '+src));};document.head.appendChild(el);}catch(e){reject(e);}});}
function includeScriptAny(candidates){var list=uniqueUrls(Array.isArray(candidates)?candidates:[candidates]);var i=0,last=null;function next(){if(i>=list.length)throw last||new Error('script load failed');return includeScript(list[i++]).catch(function(e){last=e;return next();});}return next()}
function loadExternalAssetsFromSettings(){try{var arr=global.settings||[],css=[],js=[],main={"settings.js":1,"datepicker.js":1,"map.js":1,"feed.js":1};arr.forEach(function(section){Object.keys(section||{}).forEach(function(k){(section[k]||[]).forEach(function(g){(g.style||[]).forEach(function(x){Object.keys(x||{}).forEach(function(n){css.push(x[n]);});});(g.script||[]).forEach(function(x){Object.keys(x||{}).forEach(function(n){var v=x[n],bn=baseName(n),bv=baseName(v);if((/\.js(?:$|[?#])/i.test(n)||/\.js(?:$|[?#])/i.test(v))&&!main[bn]&&!main[bv])js.push(n||v);});});});});});css.forEach(function(u){includeCss(cdnRel(u));});js.reduce(function(p,u){return p.then(function(){return includeScriptAny(fileCandidates(u));});},Promise.resolve()).catch(function(){});}catch(e){}}
function getSqlJsConfig(){return {locateFile:function(file){return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/'+file;}};}
function ensureSqlJs(){if(global.SQL&&global.SQL.Database)return Promise.resolve(global.SQL);if(global.__CCH_SQLJS_PROMISE__)return global.__CCH_SQLJS_PROMISE__;global.__CCH_SQLJS_PROMISE__=new Promise(function(resolve,reject){includeScript('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js').then(function(){return initSqlJs(getSqlJsConfig());}).then(function(SQL){global.SQL=SQL;resolve(SQL);}).catch(reject);});return global.__CCH_SQLJS_PROMISE__;}
function fetchBytes(url){return fetch(vurl(url),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('fetch '+url);return r.arrayBuffer();}).then(function(b){return new Uint8Array(b);});}
function fetchBytesAny(candidates){var list=Array.isArray(candidates)?candidates:[candidates];var i=0,last=null;function next(){if(i>=list.length)throw last||new Error('fetch failed');var u=list[i++];return fetchBytes(u).catch(function(e){last=e;return next();});}return next()}
var __dbCache={};
function openDb(name,url){var key=name||url;if(__dbCache[key])return Promise.resolve(__dbCache[key]);return ensureSqlJs().then(function(SQL){return fetchBytesAny(url?[url]:fileCandidates(name)).then(function(bytes){var db=new SQL.Database(bytes);__dbCache[key]=db;return db;});});}
function rows(db,sql,params){var st=db.prepare(sql);if(params)st.bind(params);var out=[];while(st.step())out.push(st.getAsObject());st.free();return out;}
function loadSettingsSqlite(){
 return openDb('settings.sqlite').then(function(db){
   var localRows=rows(db,'SELECT local,CDN,firstRunAsFeed FROM local_CDN ORDER BY rowid');
   var avatarRows=rows(db,'SELECT AID,avatarURL,avatarCDNURL FROM users_avatars ORDER BY AID');
   var avatarsByAid={};var avatars={};
   avatarRows.forEach(function(r){var id=Number(r.AID||0);var u=r.avatarURL||cdnRel(r.avatarCDNURL);avatarsByAid[id]=u;avatars['User'+String(id).padStart(7,'0')]=u;});
   var userRows=rows(db,'SELECT UID,Name,AID FROM users ORDER BY rowid');
   var adv=[];userRows.forEach(function(r,i){var u={id:String(r.UID||''),name:String(r.Name||''),avatar:avatarsByAid[Number(r.AID||0)]||''};if(String(r.UID||'')==='User0000002')u.default=true;adv.push(u);adv[u.id]=u;});
   var topicRows=rows(db,'SELECT topics,color,topics_sub FROM feeds_topic ORDER BY rowid');
   var groups=topicRows.map(function(r){var p=String(r.topics||'').split('|');return {id:p[0]||'',name:p[1]||p[0]||'',color:'#'+String(r.color||'').replace(/^#/,''),topics:lines(r.topics_sub)};});
   var appRows=rows(db,'SELECT "group",appName,appDesc,appICONURL,appICONCDNURL,URL FROM app ORDER BY rowid');
   var ql={};appRows.forEach(function(r){var g=String(r.group||'');(ql[g]||(ql[g]=[])).push({title:String(r.appName||''),desc:String(r.appDesc||''),icon:r.appICONURL||cdnRel(r.appICONCDNURL),url:String(r.URL||'')});});
   var toys=rows(db,'SELECT TID,toyURL,toyCDNURL FROM toy ORDER BY TID').map(function(r){return r.toyURL||cdnRel(r.toyCDNURL);});
   setGlobal('LOCAL_CDN',localRows);setGlobal('settings',buildSettings(localRows));setGlobal('USER_AVATARS',avatars);setGlobal('ADV_USERS',adv);setGlobal('TOPIC_GROUPS',groups);setGlobal('QUICK_LINKS',ql);setGlobal('toy',toys);
   refreshSite();loadExternalAssetsFromSettings();
 });
}
function loadStoriesSqlite(){
 return openDb('stories.sqlite').then(function(db){
  var fs=rows(db,'SELECT * FROM feeds ORDER BY FID');
  function isStoryImg(u){return /\.(?:png|jpe?g|gif|webp|bmp|svg)(?:[?#]|$)/i.test(String(u||'').split('?')[0])||/images\.pexels\.com|sysdata\/course\//i.test(String(u||''));}
  var st=fs.map(function(r){
    var pub=String(r.publisherID||'');
    var u=(global.ADV_USERS&&global.ADV_USERS[pub])||{};
    var rawLinks=lines(r.linksURL).map(function(x){return /^(https?:)?\/\//i.test(x)?vurl(x):cdnRel(x);});
    var cdnPhotos=lines(r.photosCDNURL).map(cdnRel);
    var legacyPhotos=lines(r.photosURL).map(function(x){return /^(https?:)?\/\//i.test(x)?vurl(x):cdnRel(x);});
    var photos=legacyPhotos.concat(cdnPhotos.length?cdnPhotos:rawLinks.filter(isStoryImg));
    var links=rawLinks.filter(function(x){return !(isStoryImg(x)&&photos.indexOf(x)>=0);});
    var yt=String(r.youtubeIDURL||'');
    var obj={title:String(r.title||''),avatar:u.avatar||''};
    if(yt){obj.type='video';obj.yt=yt;}else{obj.img=photos[0]||'';obj.link=links[0]||'';}
    return obj;
  });
  setGlobal('STORIES',st);refreshSite();
 }).catch(function(){});
}
function listSqliteFilesFromSettings(){var out=['settings.sqlite','map.sqlite','GeoCode.sqlite','stories.sqlite','1100.sqlite','909090.sqlite','909091.sqlite','909092.sqlite'];try{(global.settings||[]).forEach(function(sec){Object.keys(sec||{}).forEach(function(k){(sec[k]||[]).forEach(function(g){(g.script||[]).forEach(function(m){Object.keys(m||{}).forEach(function(n){if(/\.sqlite$/i.test(n)&&out.indexOf(n)<0)out.push(n);});});});});});}catch(e){}return out;}
var __settingsReadyPromise;try{__settingsReadyPromise=loadSettingsSqlite().then(function(){return loadStoriesSqlite();}).catch(function(){return loadStoriesSqlite();});}catch(e){try{__settingsReadyPromise=loadStoriesSqlite();}catch(e2){__settingsReadyPromise=Promise.resolve();}}
global.__CCH_SETTINGS_READY__=Promise.resolve(__settingsReadyPromise).catch(function(){});
var DB_EDITOR=global.__CCH_SQL_EDITOR_STATE__||(global.__CCH_SQL_EDITOR_STATE__={currentFile:null,db:null,tables:[],table:null,rows:[],cols:[],page:1,pageSize:50,dirty:false,dragIndex:null,dragCtx:null,openSeq:0,renderSeq:0});DB_EDITOR.tables=DB_EDITOR.tables||[];DB_EDITOR.rows=DB_EDITOR.rows||[];DB_EDITOR.cols=DB_EDITOR.cols||[];DB_EDITOR.page=DB_EDITOR.page||1;DB_EDITOR.pageSize=DB_EDITOR.pageSize||50;DB_EDITOR.openSeq=DB_EDITOR.openSeq||0;DB_EDITOR.renderSeq=DB_EDITOR.renderSeq||0;
function qid(s){return '"'+String(s||'').replace(/"/g,'""')+'"';}
function escHtml(v){return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
function modal(){return document.getElementById('sqlSettingsModal');}
function inModal(el){var m=modal();return !!(m&&el&&m.contains(el));}
function modalQuery(sel){var m=modal();return m?m.querySelector(sel):null;}
function tableWrap(){return modalQuery('#sqlTableWrap');}
function pagerEl(){return modalQuery('#sqlPager');}
function fileSelect(){return modalQuery('#sqlFileSelect');}
function tableSelect(){return modalQuery('#sqlTableSelect');}
function setStatus(t){var el=modalQuery('#sqlStatus');if(el)el.textContent=t||'';}
function markDirty(){DB_EDITOR.dirty=true;}
function maxPage(){return Math.max(1,Math.ceil((DB_EDITOR.rows.length||0)/DB_EDITOR.pageSize));}
function clampPage(){var m=maxPage();DB_EDITOR.page=Math.min(Math.max(1,Number(DB_EDITOR.page)||1),m);}
function isNewRowFilled(obj){return DB_EDITOR.cols.some(function(c){return String((obj&&obj[c])||'').trim()!=='';});}
function confirmDiscard(msg){if(!DB_EDITOR.dirty)return true;return global.confirm(msg||'尚未匯出修改，確定關閉？');}
function clearDragState(){DB_EDITOR.dragIndex=null;DB_EDITOR.dragCtx=null;var root=modal()||document;try{root.querySelectorAll('.sql-drop-target,.sql-drag-handle.dragging').forEach(function(x){x.classList.remove('sql-drop-target','dragging');});}catch(e){}}
function currentCtx(){return {file:String(DB_EDITOR.currentFile||''),table:String(DB_EDITOR.table||''),render:String(DB_EDITOR.renderSeq||0)};}
function sameFileTable(ctx){return !!ctx&&String(ctx.file||'')===String(DB_EDITOR.currentFile||'')&&String(ctx.table||'')===String(DB_EDITOR.table||'');}
function sameDragContext(ctx,wrap){return sameFileTable(ctx)&&(!wrap||String(ctx.render||'')===String(wrap.getAttribute('data-render-seq')||''));}
function ensureModal(){
  var m=modal();
  if(m)return m;
  m=document.createElement('div');
  m.id='sqlSettingsModal';
  m.setAttribute('aria-hidden','true');
  m.innerHTML='<div class="sql-settings-panel" role="dialog" aria-modal="true" aria-label="設定">'
    +'<div class="sql-settings-head"><div class="sql-settings-title"><i class="uil uil-setting"></i><span>設定</span></div><button type="button" class="sql-settings-close" id="closeSqlSettings" aria-label="關閉"><i class="uil uil-times"></i></button></div>'
    +'<div class="sql-settings-toolbar">'
    +'<label for="sqlFileSelect">檔案</label><select id="sqlFileSelect"></select>'
    +'<label for="sqlTableSelect">資料表</label><select id="sqlTableSelect"></select>'
    +'<button type="button" class="btn" id="sqlSaveDb"><i class="uil uil-export"></i>匯出</button>'
    +'<span id="sqlPager" class="sql-settings-pager"></span>'
    +'<span id="sqlStatus"></span>'
    +'</div><div id="sqlTableWrap" aria-live="polite"></div></div>';
  document.body.appendChild(m);
  return m;
}
function showModal(){var m=ensureModal();m.classList.add('show');m.setAttribute('aria-hidden','false');try{document.body.classList.add('sql-settings-open');}catch(e){}}
function hideModal(force){if(!force&&!confirmDiscard('尚未匯出修改，確定關閉？'))return;DB_EDITOR.openSeq++;clearDragState();var m=modal();if(m){m.classList.remove('show');m.setAttribute('aria-hidden','true');}try{document.body.classList.remove('sql-settings-open');}catch(e){}}
function fillSelect(sel,items,val){if(!sel)return;sel.innerHTML='';(items||[]).forEach(function(x){var o=document.createElement('option');o.value=x;o.textContent=x;sel.appendChild(o);});if(val&&items&&items.indexOf(val)>=0)sel.value=val;else if(items&&items.length)sel.value=items[0];}
function openEditorDb(file){
  ensureModal();
  file=String(file||'settings.sqlite');
  var seq=++DB_EDITOR.openSeq;
  clearDragState();
  setStatus('讀取 '+file+'…');
  return ensureSqlJs().then(function(SQL){return fetchBytesAny(fileCandidates(file)).then(function(bytes){
    if(seq!==DB_EDITOR.openSeq)return null;
    if(DB_EDITOR.db)try{DB_EDITOR.db.close();}catch(e){}
    DB_EDITOR.db=new SQL.Database(bytes);
    DB_EDITOR.currentFile=file;
    DB_EDITOR.table=null;DB_EDITOR.rows=[];DB_EDITOR.cols=[];DB_EDITOR.page=1;DB_EDITOR.dirty=false;DB_EDITOR.renderSeq++;
    DB_EDITOR.tables=rows(DB_EDITOR.db,"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").map(function(r){return r.name;});
    fillSelect(tableSelect(),DB_EDITOR.tables,DB_EDITOR.tables[0]);
    if(!DB_EDITOR.tables.length){renderTable();setStatus(file+' 沒有 table');return null;}
    return selectTable(DB_EDITOR.tables[0],true);
  });}).catch(function(err){if(seq===DB_EDITOR.openSeq)throw err;return null;});
}
function selectTable(t,force){
  if(!DB_EDITOR.db||!t)return;
  t=String(t);
  if(DB_EDITOR.tables.length&&DB_EDITOR.tables.indexOf(t)<0)return;
  if(!force&&!confirmDiscard('尚未匯出修改，切換資料表會放棄目前畫面上的修改，確定切換？')){var ts=tableSelect();if(ts&&DB_EDITOR.table)ts.value=DB_EDITOR.table;return;}
  clearDragState();
  DB_EDITOR.table=t;
  var ts2=tableSelect();if(ts2)ts2.value=t;
  var data=[];
  try{data=rows(DB_EDITOR.db,'SELECT rowid AS __rowid__, * FROM '+qid(t)+' ORDER BY rowid');}
  catch(e){data=rows(DB_EDITOR.db,'SELECT * FROM '+qid(t));}
  DB_EDITOR.rows=data;
  DB_EDITOR.page=1;DB_EDITOR.dirty=false;DB_EDITOR.renderSeq++;
  var info=rows(DB_EDITOR.db,'PRAGMA table_info('+qid(t)+')');
  DB_EDITOR.cols=info.map(function(r){return r.name;});
  if(!DB_EDITOR.cols.length&&data.length)DB_EDITOR.cols=Object.keys(data[0]).filter(function(k){return k!=='__rowid__';});
  renderTable();
  setStatus(DB_EDITOR.currentFile+' / '+t+'：'+data.length.toLocaleString()+' 筆');
}
function collectRows(){
  if(!DB_EDITOR.table)return;
  var wrap=tableWrap();if(!wrap)return;
  var out=DB_EDITOR.rows.slice();
  var insertAt=null;
  var newRows=[];
  wrap.querySelectorAll('tbody tr[data-idx], tbody tr[data-new-row]').forEach(function(tr){
    var obj={__rowid__:Number((tr.getAttribute('data-rowid')||0))||0};
    tr.querySelectorAll('[data-col]').forEach(function(td){obj[td.getAttribute('data-col')]=td.textContent;});
    if(tr.hasAttribute('data-new-row')){
      insertAt=Number(tr.getAttribute('data-insert-at')||out.length);
      if(isNewRowFilled(obj))newRows.push(obj);
    }else{
      var idx=Number(tr.getAttribute('data-idx'));
      if(isFinite(idx)&&idx>=0&&idx<out.length)out[idx]=obj;
    }
  });
  if(newRows.length){
    if(!isFinite(insertAt))insertAt=out.length;
    out.splice.apply(out,[Math.max(0,Math.min(out.length,insertAt)),0].concat(newRows));
    markDirty();
  }
  DB_EDITOR.rows=out;
}
function pagerText(){
  clampPage();
  var total=DB_EDITOR.rows.length||0;
  if(!total)return '0 筆';
  var start=(DB_EDITOR.page-1)*DB_EDITOR.pageSize+1;
  var end=Math.min(total,DB_EDITOR.page*DB_EDITOR.pageSize);
  return start+'-'+end+' / '+total+' 筆';
}
function pagerTitle(){
  clampPage();
  var total=DB_EDITOR.rows.length||0,pages=maxPage();
  if(!total)return '0 筆';
  var start=(DB_EDITOR.page-1)*DB_EDITOR.pageSize+1;
  var end=Math.min(total,DB_EDITOR.page*DB_EDITOR.pageSize);
  return '第 '+start+'-'+end+' 筆，共 '+total+' 筆（第 '+DB_EDITOR.page+' / '+pages+' 頁）';
}
function pagerHtml(){
  clampPage();
  var total=DB_EDITOR.rows.length||0,pages=maxPage();
  if(total<=DB_EDITOR.pageSize)return '';
  var title=escHtml(pagerTitle());
  return '<button type="button" data-sql-page="prev" '+(DB_EDITOR.page<=1?'disabled':'')+' title="上一頁">‹</button>'+
    '<span title="'+title+'">'+escHtml(pagerText())+'</span>'+
    '<button type="button" data-sql-page="next" '+(DB_EDITOR.page>=pages?'disabled':'')+' title="下一頁">›</button>';
}
function renderPager(){var p=pagerEl();if(p)p.innerHTML=pagerHtml();}
function renderTable(){
  var wrap=tableWrap();if(!wrap)return;
  DB_EDITOR.renderSeq++;
  renderPager();
  wrap.setAttribute('data-current-file',DB_EDITOR.currentFile||'');
  wrap.setAttribute('data-current-table',DB_EDITOR.table||'');
  wrap.setAttribute('data-render-seq',String(DB_EDITOR.renderSeq));
  if(!DB_EDITOR.table){wrap.innerHTML='<div class="sql-empty">沒有可編輯的資料表</div>';return;}
  clampPage();
  var start=(DB_EDITOR.page-1)*DB_EDITOR.pageSize;
  var pageRows=DB_EDITOR.rows.slice(start,start+DB_EDITOR.pageSize);
  var insertAt=start+pageRows.length;
  var h='<table><thead><tr><th class="sql-action-head" title="刪除 / 拖曳排序">✕</th><th class="sql-rowid-head">rowid</th>'+DB_EDITOR.cols.map(function(c){return '<th>'+escHtml(c)+'</th>';}).join('')+'</tr></thead><tbody>';
  pageRows.forEach(function(r,offset){
    var idx=start+offset;
    h+='<tr draggable="false" data-idx="'+idx+'" data-rowid="'+(r.__rowid__||'')+'"><td class="sql-action-cell"><button type="button" class="sql-icon-btn danger" data-sql-action="del" data-idx="'+idx+'" title="刪除">×</button><span class="sql-drag-handle" draggable="true" title="拖曳排序">☰</span></td><td class="sql-rowid-cell">'+(r.__rowid__||'')+'</td>';
    h+=DB_EDITOR.cols.map(function(c){return '<td contenteditable="true" spellcheck="false" data-col="'+escHtml(c)+'">'+escHtml(r[c])+'</td>';}).join('');
    h+='</tr>';
  });
  h+='<tr class="sql-new-row" data-new-row="1" data-insert-at="'+insertAt+'" data-rowid="0"><td class="sql-action-cell"><span class="sql-new-mark">＋</span></td><td class="sql-rowid-cell">new</td>'+DB_EDITOR.cols.map(function(c){return '<td contenteditable="true" spellcheck="false" data-col="'+escHtml(c)+'"></td>';}).join('')+'</tr>';
  h+='</tbody></table>';
  wrap.innerHTML=h;
}
function deleteRow(i){collectRows();i=Number(i);if(i<0||i>=DB_EDITOR.rows.length)return;DB_EDITOR.rows.splice(i,1);markDirty();clampPage();renderTable();setStatus('已刪除資料列');}
function moveRowTo(from,to){collectRows();from=Number(from);to=Number(to);if(!isFinite(from)||!isFinite(to)||from<0||to<0||from>=DB_EDITOR.rows.length||to>=DB_EDITOR.rows.length||from===to)return;var item=DB_EDITOR.rows.splice(from,1)[0];DB_EDITOR.rows.splice(to,0,item);markDirty();renderTable();setStatus('已調整資料列順序');}
function changePage(dir){
  if(!DB_EDITOR.table)return;
  var ctx=currentCtx();
  if(DB_EDITOR.dirty)collectRows();
  if(!sameFileTable(ctx))return;
  clampPage();
  var pages=maxPage();
  if(dir==='prev')DB_EDITOR.page=Math.max(1,DB_EDITOR.page-1);else if(dir==='next')DB_EDITOR.page=Math.min(pages,DB_EDITOR.page+1);else DB_EDITOR.page=Math.max(1,Math.min(pages,Number(dir)||1));
  clearDragState();
  renderTable();
  setStatus(DB_EDITOR.currentFile+' / '+DB_EDITOR.table+'：'+pagerTitle());
}
function saveCurrent(){
  if(!DB_EDITOR.db||!DB_EDITOR.table)return;
  collectRows();
  var t=qid(DB_EDITOR.table);
  if(!DB_EDITOR.cols.length){setStatus('沒有欄位可匯出');return;}
  var colSql=DB_EDITOR.cols.map(qid).join(',');
  var qs=DB_EDITOR.cols.map(function(){return'?';}).join(',');
  var insertSql='INSERT INTO '+t+'('+colSql+') VALUES('+qs+')';
  try{
    DB_EDITOR.db.run('BEGIN TRANSACTION');
    DB_EDITOR.db.run('DELETE FROM '+t);
    DB_EDITOR.rows.forEach(function(r){DB_EDITOR.db.run(insertSql,DB_EDITOR.cols.map(function(c){return r[c];}));});
    DB_EDITOR.db.run('COMMIT');
  }catch(e){
    try{DB_EDITOR.db.run('ROLLBACK');}catch(e2){}
    setStatus('匯出失敗：'+(e&&e.message?e.message:e));
    return;
  }
  var bytes=DB_EDITOR.db.export();
  var blob=new Blob([bytes],{type:'application/octet-stream'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=DB_EDITOR.currentFile||'settings.sqlite';
  document.body.appendChild(a);a.click();setTimeout(function(){try{URL.revokeObjectURL(a.href);a.remove();}catch(e){}},0);
  DB_EDITOR.dirty=false;
  try{selectTable(DB_EDITOR.table,true);}catch(e){}
  setStatus('已匯出 '+(DB_EDITOR.currentFile||'SQLite'));
}
function openSqlSettings(e){
  if(e&&e.preventDefault)e.preventDefault();
  if(e&&e.stopPropagation)e.stopPropagation();
  showModal();
  var files=listSqliteFilesFromSettings();
  var chosen=(DB_EDITOR.currentFile&&files.indexOf(DB_EDITOR.currentFile)>=0)?DB_EDITOR.currentFile:'settings.sqlite';
  fillSelect(fileSelect(),files,chosen);
  if(DB_EDITOR.db&&DB_EDITOR.currentFile===chosen&&DB_EDITOR.table){renderTable();setStatus(DB_EDITOR.currentFile+' / '+DB_EDITOR.table+'：'+pagerTitle());return;}
  openEditorDb(chosen).catch(function(err){setStatus('讀取失敗：'+(err&&err.message?err.message:err));});
}
function initSqlSettingsModal(){
  ensureModal();
  var close=modalQuery('#closeSqlSettings');if(close)close.onclick=function(){hideModal(false);};
  var fs=fileSelect();if(fs)fs.onchange=function(){var next=fs.value;if(!confirmDiscard('尚未匯出修改，切換檔案會放棄目前畫面上的修改，確定切換？')){fs.value=DB_EDITOR.currentFile||fs.value;return;}openEditorDb(next).catch(function(e){setStatus('讀取失敗：'+(e&&e.message?e.message:e));});};
  var ts=tableSelect();if(ts)ts.onchange=function(){selectTable(ts.value);};
  var save=modalQuery('#sqlSaveDb');if(save)save.onclick=saveCurrent;
  var oldHandlers=document.__CCH_SQL_SETTINGS_HANDLERS__;
  if(oldHandlers){
    try{document.removeEventListener('click',oldHandlers.click,true);}catch(e){}
    try{document.removeEventListener('input',oldHandlers.input,true);}catch(e){}
    try{document.removeEventListener('dragstart',oldHandlers.dragstart,true);}catch(e){}
    try{document.removeEventListener('dragover',oldHandlers.dragover,true);}catch(e){}
    try{document.removeEventListener('dragleave',oldHandlers.dragleave,true);}catch(e){}
    try{document.removeEventListener('drop',oldHandlers.drop,true);}catch(e){}
    try{document.removeEventListener('dragend',oldHandlers.dragend,true);}catch(e){}
    try{document.removeEventListener('keydown',oldHandlers.keydown,true);}catch(e){}
  }
  var handlers={};
  handlers.click=function(e){
    var tgt=e.target;
    var inside=!!(tgt&&inModal(tgt));
    if(inside){
      var pg=tgt&&tgt.closest&&tgt.closest('[data-sql-page]');
      if(pg&&inModal(pg)){if(e&&e.preventDefault)e.preventDefault();if(e&&e.stopPropagation)e.stopPropagation();changePage(pg.getAttribute('data-sql-page'));return;}
      var b=tgt&&tgt.closest&&tgt.closest('[data-sql-action]');
      if(b&&inModal(b)){if(e&&e.preventDefault)e.preventDefault();if(e&&e.stopPropagation)e.stopPropagation();var act=b.getAttribute('data-sql-action');var i=Number(b.getAttribute('data-idx'));if(act==='del')deleteRow(i);return;}
      return;
    }
    var open=tgt&&tgt.closest&&tgt.closest('#openSqlSettings,#settingsMenuButton,[data-sqlite-settings]');
    if(open){openSqlSettings(e);return;}
  };
  handlers.input=function(e){if(e.target&&e.target.closest&&e.target.closest('#sqlTableWrap [contenteditable="true"]')&&inModal(e.target))markDirty();};
  handlers.dragstart=function(e){
    var h=e.target&&e.target.closest&&e.target.closest('.sql-drag-handle');if(!h||!inModal(h))return;
    var tr=h.closest('#sqlTableWrap tbody tr[data-idx]');if(!tr)return;
    var wrap=tableWrap();if(!wrap||!wrap.contains(tr))return;
    var from=Number(tr.getAttribute('data-idx'));
    if(!isFinite(from))return;
    DB_EDITOR.dragIndex=from;
    DB_EDITOR.dragCtx={file:String(DB_EDITOR.currentFile||''),table:String(DB_EDITOR.table||''),render:String(wrap.getAttribute('data-render-seq')||DB_EDITOR.renderSeq),from:from,page:Number(DB_EDITOR.page)||1};
    try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(from));e.dataTransfer.setData('application/x-cch-sql-row',JSON.stringify(DB_EDITOR.dragCtx));}catch(err){}
    h.classList.add('dragging');
  };
  handlers.dragover=function(e){
    var tr=e.target&&e.target.closest&&e.target.closest('#sqlTableWrap tbody tr[data-idx]');if(!tr||!inModal(tr))return;
    var wrap=tableWrap();if(!wrap||!wrap.contains(tr)||!sameDragContext(DB_EDITOR.dragCtx,wrap))return;
    e.preventDefault();if(e&&e.stopPropagation)e.stopPropagation();try{e.dataTransfer.dropEffect='move';}catch(err){}
    try{wrap.querySelectorAll('.sql-drop-target').forEach(function(x){if(x!==tr)x.classList.remove('sql-drop-target');});}catch(e2){}
    tr.classList.add('sql-drop-target');
  };
  handlers.dragleave=function(e){var tr=e.target&&e.target.closest&&e.target.closest('#sqlTableWrap tbody tr[data-idx]');if(tr&&inModal(tr))tr.classList.remove('sql-drop-target');};
  handlers.drop=function(e){
    var tr=e.target&&e.target.closest&&e.target.closest('#sqlTableWrap tbody tr[data-idx]');if(!tr||!inModal(tr))return;
    var wrap=tableWrap();if(!wrap||!wrap.contains(tr)||!sameDragContext(DB_EDITOR.dragCtx,wrap))return;
    e.preventDefault();if(e&&e.stopPropagation)e.stopPropagation();
    var ctx=DB_EDITOR.dragCtx||{};
    try{var raw=e.dataTransfer.getData('application/x-cch-sql-row');if(raw){var parsed=JSON.parse(raw);if(sameDragContext(parsed,wrap))ctx=parsed;}}catch(err){}
    var from=Number(ctx.from);if(!isFinite(from))from=Number(DB_EDITOR.dragIndex);
    var target=Number(tr.getAttribute('data-idx'));
    clearDragState();
    if(!isFinite(from)||!isFinite(target)||from===target)return;
    var to=target;
    try{var r=tr.getBoundingClientRect();if(e.clientY>r.top+r.height/2)to=target+1;}catch(err2){}
    if(from<to)to-=1;
    to=Math.max(0,Math.min(DB_EDITOR.rows.length-1,to));
    moveRowTo(from,to);
  };
  handlers.dragend=function(){clearDragState();};
  handlers.keydown=function(e){if(e.key==='Escape'&&modal()&&modal().classList.contains('show'))hideModal(false);};
  document.addEventListener('click',handlers.click,true);
  document.addEventListener('input',handlers.input,true);
  document.addEventListener('dragstart',handlers.dragstart,true);
  document.addEventListener('dragover',handlers.dragover,true);
  document.addEventListener('dragleave',handlers.dragleave,true);
  document.addEventListener('drop',handlers.drop,true);
  document.addEventListener('dragend',handlers.dragend,true);
  document.addEventListener('keydown',handlers.keydown,true);
  document.__CCH_SQL_SETTINGS_HANDLERS__=handlers;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initSqlSettingsModal);else initSqlSettingsModal();
global.loadSettingsSqlite=loadSettingsSqlite;
global.loadStoriesSqlite=loadStoriesSqlite;
global.listSqliteFilesFromSettings=listSqliteFilesFromSettings;
})(window);
