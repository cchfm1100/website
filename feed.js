window.__FEED_JS_LOADED__=1;
(function(){try{if(typeof ADV_USERS!=='undefined'&&Array.isArray(ADV_USERS)){for(let i=0;i<ADV_USERS.length;i++){const u=ADV_USERS[i];if(u&&u.id)ADV_USERS[u.id]=u;}}}catch(e){}})();
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

  function normalizeFeedItem(f, idx){
    if(!f || typeof f!=='object') return;

    if(!f.publisherId){
      if(f.userId) f.publisherId = f.userId;
    }
    const pub=_advUserById(f.publisherId);
    if(pub){
      f.user = pub.name;
      f.avatar = pub.avatar;
    }else{
      if(!f.user) f.user = f.publisherId || '匿名者';
      if(!f.avatar){
        try{ f.avatar = (typeof U!=='undefined' && U.AVATAR_GUEST) ? U.AVATAR_GUEST : ''; }catch(e){ f.avatar=''; }
      }
    }

    if(f.datetime){
      const baseTs=_parseTaipeiDatetimeToTs(f.datetime);
      if(baseTs!=null && !isFinite(f.ts)) f.ts = baseTs + (idx||0);
      if(!f.date) f.date = _dateOnlyFromDatetime(f.datetime) || _formatTaipeiFromTs(f.ts).slice(0,10);
    }else if(f.date && !f.datetime){
      f.datetime = String(f.date).trim() ? `${String(f.date).trim()} 00:00:00` : '';
      const baseTs=_parseTaipeiDatetimeToTs(f.datetime);
      if(baseTs!=null && !isFinite(f.ts)) f.ts = baseTs + (idx||0);
    }else if(isFinite(f.ts) && !f.datetime){
      f.datetime = _formatTaipeiFromTs(f.ts);
      if(!f.date) f.date = f.datetime.slice(0,10);
    }
    if(f.datetime) f.date = _dateOnlyFromDatetime(f.datetime) || f.date;

    if(Array.isArray(f.likeList)){
      const ids=[];
      f.likeList.forEach(x=>{
        const id=x && (x.userId||x.uid||x.id);
        if(id && !ids.includes(id)) ids.push(id);
      });
      f.likes = ids.length;
      f.likeName = ids.map(id=>(_advUserById(id)||{}).name).filter(Boolean);
      f.likeAvatars = ids.map(id=>(_advUserById(id)||{}).avatar).filter(Boolean);
    }else{
      if(!Array.isArray(f.likeName)) f.likeName=[];
      if(!Array.isArray(f.likeAvatars)) f.likeAvatars=[];
      if(typeof f.likes !== 'number') f.likes = f.likeName.length;
    }

    if(Array.isArray(f.commentList)){
      f.commentList = f.commentList
        .map(c=>{
          if(typeof c==='string') return { text:c, datetime: f.datetime||'' };
          if(!c || typeof c!=='object') return null;
          if(!c.datetime && c.time) c.datetime = c.time;
          if(!c.datetime) c.datetime = f.datetime || '';
          return c;
        })
        .filter(Boolean);
      f.comments = f.commentList.length;
    }else{
      f.commentList = [];
      f.comments = 0;
    }

    if(!Array.isArray(f.topics)) f.topics = [];
    if(typeof f.shares !== 'number') f.shares = 0;
    if(!('bookmarked' in f)) f.bookmarked = false;
    if(typeof f.title !== 'string') f.title = String(f.title||'');
    if(typeof f.caption !== 'string') f.caption = String(f.caption||'');
    if(typeof f.yt !== 'string') f.yt = String(f.yt||'');
  }

  window.normalizeFeedArray = function(arr){
    if(!Array.isArray(arr)) return arr;
    arr.forEach((f,i)=>normalizeFeedItem(f,i));
    return arr;
  };

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
