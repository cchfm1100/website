(function(){
  function pad2(n){return String(n).padStart(2,'0')}
  function ymd(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())}
  function normDate(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
  function sameDay(a,b){return a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
  function addDays(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)}
  function monthStart(d){return new Date(d.getFullYear(),d.getMonth(),1)}
  function addMonthsStart(d,n){return new Date(d.getFullYear(),d.getMonth()+n,1)}
  function clampYear(y){if(!Number.isFinite(y))return null; if(y<1900)return 1900; if(y>2100)return 2100; return y}
  function toDate(v){
    if(v instanceof Date) return Number.isFinite(v.getTime())?v:null;
    var d=new Date(v);
    return Number.isFinite(d.getTime())?d:null;
  }
  function svgArrow(dir){
    var s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 24 24');
    s.setAttribute('aria-hidden','true');
    var p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',dir>0?'M9 6l6 6-6 6':'M15 6l-6 6 6 6');
    s.appendChild(p);
    return s;
  }

  function datepicker(anchor,opts){
    opts=opts||{};
    var appendTo=opts.appendTo||document.body;
    var base=toDate(opts.defaultDate)||new Date();
    var selected=normDate(base);
    var view=monthStart(toDate(opts.viewDate)||selected);
    var keepView=!!opts.keepView;
    var destroyed=false;
    var evts=[];

    function on(el,type,fn,cap){
      if(!el)return;
      el.addEventListener(type,fn,cap);
      evts.push([el,type,fn,cap]);
    }
    function offAll(){
      for(var i=0;i<evts.length;i++){
        var e=evts[i];
        try{e[0].removeEventListener(e[1],e[2],e[3])}catch(_){}
      }
      evts.length=0;
    }

    var root=document.createElement('div');
    root.className='datepicker-calendar'+(opts.inline?' inline':'');
    root.setAttribute('tabindex','-1');

    var months=document.createElement('div');
    months.className='datepicker-months';

    var prev=document.createElement('span');
    prev.className='datepicker-prev-month';
    prev.setAttribute('role','button');
    prev.setAttribute('tabindex','0');
    prev.setAttribute('aria-label','Previous month');
    prev.appendChild(svgArrow(-1));

    var next=document.createElement('span');
    next.className='datepicker-next-month';
    next.setAttribute('role','button');
    next.setAttribute('tabindex','0');
    next.setAttribute('aria-label','Next month');
    next.appendChild(svgArrow(1));

    var monthWrap=document.createElement('div');
    monthWrap.className='datepicker-month';
    var current=document.createElement('div');
    current.className='datepicker-current-month';

    var monthSel=document.createElement('select');
    monthSel.className='datepicker-monthDropdown-months';
    monthSel.setAttribute('aria-label','Month');
    var monthNames=['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    for(var mi=0;mi<12;mi++){
      var o=document.createElement('option');
      o.value=String(mi);
      o.textContent=monthNames[mi];
      monthSel.appendChild(o);
    }

    var yearWrap=document.createElement('div');
    yearWrap.className='numInputWrapper';
    var yearInp=document.createElement('input');
    yearInp.className='cur-year';
    yearInp.type='number';
    yearInp.min='1900';
    yearInp.max='2100';
    yearInp.inputMode='numeric';
    yearInp.setAttribute('aria-label','Year');
    yearWrap.appendChild(yearInp);
    yearWrap.appendChild(document.createElement('span'));
    yearWrap.appendChild(document.createElement('span'));

    current.appendChild(monthSel);
    current.appendChild(yearWrap);
    monthWrap.appendChild(current);

    months.appendChild(prev);
    months.appendChild(monthWrap);
    months.appendChild(next);

    var inner=document.createElement('div');
    inner.className='datepicker-innerContainer';
    var rCont=document.createElement('div');
    rCont.className='datepicker-rContainer';

    var weekdays=document.createElement('div');
    weekdays.className='datepicker-weekdays';
    var wCont=document.createElement('div');
    wCont.className='datepicker-weekdaycontainer';
    var w=['日','一','二','三','四','五','六'];
    for(var wi=0;wi<7;wi++){
      var ws=document.createElement('span');
      ws.className='datepicker-weekday';
      ws.textContent=w[wi];
      wCont.appendChild(ws);
    }
    weekdays.appendChild(wCont);

    var days=document.createElement('div');
    days.className='datepicker-days';
    var dayCont=document.createElement('div');
    dayCont.className='dayContainer';
    days.appendChild(dayCont);

    rCont.appendChild(weekdays);
    rCont.appendChild(days);
    inner.appendChild(rCont);

    root.appendChild(months);
    root.appendChild(inner);

    function syncHeader(){
      monthSel.value=String(view.getMonth());
      yearInp.value=String(view.getFullYear());
    }

    function renderDays(){
      while(dayCont.firstChild) dayCont.removeChild(dayCont.firstChild);
      var y=view.getFullYear(), m=view.getMonth();
      var first=new Date(y,m,1);
      var firstDow=first.getDay();
      var gridStart=addDays(first,-firstDow);
      var today=normDate(new Date());
      var hideOverflow=!!opts.hideOverflowDays;
      for(var i=0;i<42;i++){
        var d=addDays(gridStart,i);
        var btn=document.createElement('span');
        btn.className='datepicker-day';
        btn.setAttribute('tabindex','-1');

        if(d.getMonth()!==m && hideOverflow){
          btn.classList.add('is-empty','datepicker-disabled');
          btn.textContent='';
          dayCont.appendChild(btn);
          continue;
        }

        btn.textContent=String(d.getDate());
        btn.dateObj=d;
        btn.setAttribute('data-date',ymd(d));

        if(d.getMonth()!==m){
          if(d<first) btn.classList.add('prevMonthDay');
          else btn.classList.add('nextMonthDay');
        }
        if(sameDay(d,today)) btn.classList.add('today');
        if(sameDay(d,selected)) btn.classList.add('selected');

        if(typeof opts.onDayCreate==='function') opts.onDayCreate(null,null,instance,btn);
        dayCont.appendChild(btn);
      }
    }

    function redraw(){
      if(destroyed)return;
      if(instance) instance.selectedDates=[selected];
      renderDays();
    }

    function changeMonth(delta){
      if(destroyed)return;
      var oldY=view.getFullYear(), oldM=view.getMonth();
      view=new Date(oldY,oldM+delta,1);
      syncHeader();
      if(typeof opts.onMonthChange==='function') opts.onMonthChange([selected],ymd(selected),instance);
      if(view.getFullYear()!==oldY && typeof opts.onYearChange==='function') opts.onYearChange([selected],ymd(selected),instance);
    }

    function setView(d,trigger){
      if(destroyed)return;
      var vd=toDate(d);
      if(!vd) return;
      var oldY=view.getFullYear(), oldM=view.getMonth();
      view=monthStart(vd);
      syncHeader();
      redraw();
      if(trigger && typeof opts.onMonthChange==='function') opts.onMonthChange([selected],ymd(selected),instance);
      if(trigger && view.getFullYear()!==oldY && typeof opts.onYearChange==='function') opts.onYearChange([selected],ymd(selected),instance);
      if(trigger && oldM!==view.getMonth() && typeof opts.onMonthChange==='function'){}
    }

    function setDate(d,trigger){
      if(destroyed)return;
      var nd=toDate(d);
      if(!nd) return;
      selected=normDate(nd);
      if(!keepView) view=monthStart(selected);
      syncHeader();
      redraw();
      if(anchor) anchor.value=ymd(selected);
      if(trigger && typeof opts.onChange==='function') opts.onChange([selected],ymd(selected),instance);
    }

    on(dayCont,'click',function(e){
      if(destroyed)return;
      var t=e.target && e.target.closest ? e.target.closest('.datepicker-day') : null;
      if(!t || !t.dateObj) return;
      var nd=normDate(t.dateObj);
      selected=nd;
      if(anchor) anchor.value=ymd(selected);
      var changedMonth=(view.getFullYear()!==nd.getFullYear()||view.getMonth()!==nd.getMonth());
      if(changedMonth && !keepView) view=monthStart(nd);
      syncHeader();
      redraw();
      if(typeof opts.onChange==='function') opts.onChange([selected],ymd(selected),instance);
    });

    on(monthSel,'change',function(){
      if(destroyed)return;
      var oldM=view.getMonth();
      var nm=parseInt(monthSel.value,10);
      if(!Number.isFinite(nm)) return;
      view=new Date(view.getFullYear(),nm,1);
      syncHeader();
      if(typeof opts.onMonthChange==='function') opts.onMonthChange([selected],ymd(selected),instance);
      if(oldM!==nm) redraw();
    });

    on(yearInp,'change',function(){
      if(destroyed)return;
      var oldY=view.getFullYear();
      var ny=clampYear(parseInt(yearInp.value,10));
      if(ny===null) return;
      view=new Date(ny,view.getMonth(),1);
      syncHeader();
      if(typeof opts.onYearChange==='function') opts.onYearChange([selected],ymd(selected),instance);
      if(oldY!==ny) redraw();
    });

    var instance={
      calendarContainer:root,
      selectedDates:[selected],
      redraw:function(){
        instance.selectedDates=[selected];
        redraw();
      },
      changeMonth:function(delta){
        changeMonth(delta);
      },
      setDate:function(d,trigger){
        setDate(d,trigger);
      },
      getView:function(){
        return new Date(view.getTime());
      },
      setView:function(d,trigger){
        setView(d,!!trigger);
      },
      destroy:function(){
        if(destroyed)return;
        destroyed=true;
        offAll();
        if(root&&root.parentNode) root.parentNode.removeChild(root);
      }
    };

    syncHeader();
    if(anchor) anchor.value=ymd(selected);
    appendTo.appendChild(root);
    redraw();
    if(typeof opts.onReady==='function') opts.onReady([selected],ymd(selected),instance);
    return instance;
  }

  window.datepicker=datepicker;

  var state={dp0:null,dp1:null,anchor:null,feed:null,evts:[]};

  function qs(root,sel){return (root||document).querySelector(sel)}
  function toInt(v,fallback){
    var n=Number(v);
    return Number.isFinite(n)?Math.trunc(n):fallback;
  }
  function addEvt(el,type,fn,opts){
    if(!el)return;
    el.addEventListener(type,fn,opts);
    state.evts.push([el,type,fn,opts]);
  }
  function clearEvts(){
    for(var i=0;i<state.evts.length;i++){
      var e=state.evts[i];
      try{e[0].removeEventListener(e[1],e[2],e[3])}catch(_){}
    }
    state.evts.length=0;
  }

  function ensureAnchor(feed){
    var el=qs(feed,'#dcAnchor');
    if(el) return el;
    el=document.createElement('input');
    el.type='text';
    el.id='dcAnchor';
    el.setAttribute('aria-hidden','true');
    el.tabIndex=-1;
    el.style.position='absolute';
    el.style.left='-9999px';
    el.style.width='1px';
    el.style.height='1px';
    el.style.opacity='0';
    feed.appendChild(el);
    return el;
  }

  function destroy(){
    clearEvts();
    if(state.dp0){
      try{state.dp0.destroy()}catch(_){}
      state.dp0=null;
    }
    if(state.dp1){
      try{state.dp1.destroy()}catch(_){}
      state.dp1=null;
    }
    if(state.anchor && state.anchor.parentNode) state.anchor.parentNode.removeChild(state.anchor);
    state.anchor=null;
    state.feed=null;
  }

  function bindNav(instance,onNav){
    var cal=instance && instance.calendarContainer;
    if(!cal || cal.__dcNavBound) return;
    cal.__dcNavBound=true;
    cal.addEventListener('click',function(e){
      var t=e.target;
      var btn=t && t.closest ? t.closest('.datepicker-prev-month,.datepicker-next-month') : null;
      if(!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var dir=btn.classList.contains('datepicker-next-month')?1:-1;
      if(typeof onNav==='function') onNav(dir,instance);
      else{instance.changeMonth(dir);instance.redraw()}
    },true);
  }

  function init(feedEl){
    var feed=feedEl||qs(document,'#daysCalcFeed');
    if(!feed) return;
    var calMount=qs(feed,'#dcCalendar');
    var remainEl=qs(feed,'#dcRemain');
    var needEl=qs(feed,'#dcNeed');
    if(!calMount||!remainEl||!needEl) return;
    if(typeof window.datepicker!=='function') return;

    destroy();
    state.feed=feed;
    state.anchor=ensureAnchor(feed);
    while(calMount.firstChild) calMount.removeChild(calMount.firstChild);

    var c0=document.createElement('div');
    c0.className='dc-cal dc-cal--0';
    var c1=document.createElement('div');
    c1.className='dc-cal dc-cal--1';
    calMount.appendChild(c0);
    calMount.appendChild(c1);

    var readRemain=function(){return Math.max(0,toInt(remainEl.value,0))};
    var readNeed=function(){return Math.max(0,toInt(needEl.value,0))};

    function updateResult(){
      var remain0=readRemain();
      var need=readNeed();
    }

    var __dcLunarFmt=null;
    try{ __dcLunarFmt=new Intl.DateTimeFormat('zh-TW-u-ca-chinese',{month:'long',day:'numeric'}); }catch(_e){}
    var __dcLunarDayName=['',
      '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
      '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
      '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
    ];
    var __dcCnDigitMap={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'兩':2};
    function __dcCnDigit(c){return __dcCnDigitMap[c]||0}
    function __dcLunarDayToInt(v){
      var s=String(v||'').replace(/\s+/g,'').replace(/日$/,'');
      var m=s.match(/\d+/);
      if(m) return parseInt(m[0],10);
      if(!s) return NaN;
      if(s==='卅'||s==='三十') return 30;
      if(s==='廿') return 20;
      if(s==='十') return 10;
      if(s.slice(0,1)==='初'){
        var t=s.slice(1);
        if(t==='十') return 10;
        var d=__dcCnDigit(t.slice(0,1));
        return d||NaN;
      }
      if(s.slice(0,1)==='十'){
        var d=__dcCnDigit(s.slice(1,2));
        return 10+(d||0);
      }
      if(s.slice(0,2)==='二十'){
        var d=__dcCnDigit(s.slice(2,3));
        return 20+(d||0);
      }
      if(s.slice(0,1)==='廿'){
        var d=__dcCnDigit(s.slice(1,2));
        return 20+(d||0);
      }
      var a=__dcCnDigit(s.slice(0,1));
      if(a){
        if(s.slice(1,2)==='十'){
          var b=__dcCnDigit(s.slice(2,3));
          return a*10+(b||0);
        }
        return a;
      }
      return NaN;
    }
    function __dcCnMonthNumToText(n){
      var m=['','正','二','三','四','五','六','七','八','九','十','十一','十二'];
      return m[n]||String(n);
    }
    function __dcNormalizeLunarMonthText(mp){
      var s=String(mp||'').trim().replace(/\s+/g,'');
      if(!s) return '';
      var isLeap=false;
      if(s.slice(0,1)==='閏'||s.slice(0,1)==='闰'){isLeap=true;s=s.slice(1);}
      var mm=s.match(/^(\d{1,2})月$/);
      if(mm){
        var n=parseInt(mm[1],10);
        if(Number.isFinite(n)&&n>=1&&n<=12) s=__dcCnMonthNumToText(n)+'月';
        else s=mm[1]+'月';
      }else if(/^\d{1,2}$/.test(s)){
        var n2=parseInt(s,10);
        if(Number.isFinite(n2)&&n2>=1&&n2<=12) s=__dcCnMonthNumToText(n2)+'月';
        else s=s+'月';
      }else if(s.slice(-1)!=='月' && /^\d{1,2}月/.test(s)){
        s=s;
      }
      return (isLeap?'閏':'')+s;
    }
    function __dcParseLunarFromFormatted(str){
      var s=String(str||'').trim().replace(/\s+/g,'');
      if(!s) return {month:'',day:''};
      var mi=s.indexOf('月');
      if(mi>=0){
        var month=s.slice(0,mi+1);
        var day=s.slice(mi+1).replace(/日$/,'');
        return {month:month,day:day};
      }
      return {month:'',day:s.replace(/日$/,'')};
    }
    function __dcGetLunarDayLabel(d){
      if(!__dcLunarFmt) return '';
      try{
        var dayPart='';
        var monthPart='';
        var parts=null;
        try{ parts=__dcLunarFmt.formatToParts(d); }catch(_e2){ parts=null; }
        if(parts){
          for(var i=0;i<parts.length;i++){
            if(parts[i].type==='day') dayPart=parts[i].value;
            else if(parts[i].type==='month') monthPart=parts[i].value;
          }
        }
        if(!dayPart || !monthPart){
          var parsed=__dcParseLunarFromFormatted(__dcLunarFmt.format(d));
          if(!monthPart) monthPart=parsed.month;
          if(!dayPart) dayPart=parsed.day;
        }
        var n=__dcLunarDayToInt(dayPart);
        if(!Number.isFinite(n)||n<1||n>30) return '';
        var dayName=__dcLunarDayName[n]||'';
        if(n===1){
          var mtxt=__dcNormalizeLunarMonthText(monthPart);
          if(mtxt) return mtxt+dayName;
        }
        return dayName;
      }catch(_e){ return ''; }
    }


    function dayStyler(_dObj,_dStr,dp,dayElem){
      dayElem.classList.remove('med-in-range','med-start','med-out');
      var old=dayElem.querySelector('.med-badge');
      if(old) old.remove();
      var old2=dayElem.querySelector('.dc-pill-count');
      if(old2) old2.remove();
      var old3=dayElem.querySelector('.dc-lunar');
      if(old3) old3.remove();
      var tn=dayElem.childNodes && dayElem.childNodes[0];
      if(tn && tn.nodeType===3){
        var solar=document.createElement('span');
        solar.className='dc-solar';
        solar.textContent=tn.nodeValue;
        dayElem.insertBefore(solar,tn);
        dayElem.removeChild(tn);
      }
      if(!dayElem.dateObj || !(dayElem.dateObj instanceof Date)) return;

      var lunarTxt=__dcGetLunarDayLabel(dayElem.dateObj);
      if(lunarTxt){
        var lunar=document.createElement('small');
        lunar.className='dc-lunar';
        lunar.textContent=lunarTxt;
        if(lunarTxt.slice(-2)==='初一' || lunarTxt.slice(-2)==='十五') lunar.classList.add('is-special');
        dayElem.appendChild(lunar);
      }

      var remain0=readRemain();
      var need=readNeed();
      var day0=dp.selectedDates && dp.selectedDates[0]?normDate(dp.selectedDates[0]):normDate(new Date());
      var day=normDate(dayElem.dateObj);
      var offset=Math.floor((day-day0)/86400000);

      if(offset<0) return;

      var delta=need*(offset+1)-remain0;
      if(offset===0) dayElem.classList.add('med-start');
      if(delta>0) dayElem.classList.add('med-out');
      else dayElem.classList.add('med-in-range');

      var badge=document.createElement('small');
      badge.className='notification-count dc-pill-count';
      badge.textContent=String(delta);
      if(delta>0) badge.classList.add('is-out');
      else if(delta<0) badge.classList.add('is-in');
      else badge.classList.add('is-zero');
      dayElem.appendChild(badge);
    }

    function syncSelected(from,to){
      if(!from||!to) return;
      var d=from.selectedDates && from.selectedDates[0] ? from.selectedDates[0] : null;
      if(d) to.setDate(d,false);
    }
    function syncViewsFrom0(){
      if(!state.dp0||!state.dp1) return;
      var v=state.dp0.getView();
      state.dp1.setView(addMonthsStart(v,1),false);
    }
    function syncViewsFrom1(){
      if(!state.dp0||!state.dp1) return;
      var v=state.dp1.getView();
      state.dp0.setView(addMonthsStart(v,-1),false);
    }

    var today=normDate(new Date());
    var v0=monthStart(today);
    var v1=addMonthsStart(v0,1);

    state.dp0=window.datepicker(state.anchor,{
      inline:true,
      appendTo:c0,
      defaultDate:today,
      viewDate:v0,
      keepView:false,
      clickOpens:false,
      allowInput:false,
      monthSelectorType:'dropdown',
      hideOverflowDays:true,
      onReady:function(_sd,_ds,instance){
        bindNav(instance,function(dir){
          if(!state.dp0) return;
          state.dp0.changeMonth(dir);
          state.dp0.redraw();
          syncViewsFrom0();
          updateResult();
        });
        syncViewsFrom0();
        updateResult();
      },
      onChange:function(){
        if(state.dp0) state.dp0.redraw();
        if(state.dp1){syncSelected(state.dp0,state.dp1);syncViewsFrom0()}
        updateResult();
      },
      onMonthChange:function(){syncViewsFrom0()},
      onYearChange:function(){syncViewsFrom0()},
      onDayCreate:dayStyler
    });

    state.dp1=window.datepicker(state.anchor,{
      inline:true,
      appendTo:c1,
      defaultDate:today,
      viewDate:v1,
      keepView:true,
      clickOpens:false,
      allowInput:false,
      monthSelectorType:'dropdown',
      hideOverflowDays:true,
      onReady:function(_sd,_ds,instance){
        bindNav(instance,function(dir){
          if(!state.dp1) return;
          state.dp1.changeMonth(dir);
          state.dp1.redraw();
          syncViewsFrom1();
          updateResult();
        });
        updateResult();
      },
      onChange:function(){
        if(state.dp1) state.dp1.redraw();
        if(state.dp0){syncSelected(state.dp1,state.dp0);syncViewsFrom0()}
        updateResult();
      },
      onMonthChange:function(){syncViewsFrom1()},
      onYearChange:function(){syncViewsFrom1()},
      onDayCreate:dayStyler
    });

    var onInputs=function(){
      if(state.dp0) state.dp0.redraw();
      if(state.dp1) state.dp1.redraw();
      updateResult();
    };
    addEvt(remainEl,'input',onInputs);
    addEvt(needEl,'input',onInputs);

    var closeBtn=qs(feed,'#closeDaysCalc');
    addEvt(closeBtn,'click',function(){
      if(state.feed) state.feed.classList.add('hide');
      destroy();
    });

    updateResult();
  }

  window.DCCalendar={init:init,destroy:destroy};window.__DCCALENDAR_VERSION='2026-01-01-1';
})();