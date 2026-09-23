(() => {
  const STORAGE_KEY = 'thoughts_app_v2';
  const META_KEY = 'thoughts_app_meta_v1';
  const SCHEMA_VERSION = 2;
  const LEGACY_KEYS = ['thoughts_assistant_v1','thoughts','ideas','mindItems','thoughtsAppItems'];
  const state = {
    items: [],
    filter: 'active',
    lang: localStorage.getItem('thoughts_lang') || 'he',
    pendingSchedule: null,
    scheduleTargetId: null,
    editTargetId: null,
    deleteTargetId: null,
    pendingImport: null
  };

  const i18n = {
    he: {
      title:'המחשבות שלי', subtitle:'לזכור, לתזמן, ולחזור למה שחשוב',
      placeholder:'מה עובר לך בראש?', schedule:'תזמון', add:'הוספה', itemType:'סוג פריט', typeThought:'מחשבה / משימה', typeFriend:'חבר / אדם',
      active:'פעילות', archived:'ארכיון', all:'הכול', empty:'אין כאן מחשבות כרגע.',
      savedLocal:'המידע נשמר מקומית במכשיר הזה.', scheduleTitle:'תזמון',
      date:'תאריך', time:'שעה', repeat:'חזרה', repeatNone:'ללא חזרה',
      repeatWeekly:'פעם בשבוע', repeatBiweekly:'פעם בשבועיים',
      repeatMonthly:'פעם בחודש', repeatBimonthly:'פעם בחודשיים',
      randomize:'תזכורת אקראית', randomizeHelp:'תופיע שוב במועד אקראי לפי התדירות',
      frequency:'תדירות אקראית', randomDaily:'פעם ביום', random3Days:'פעם בשלושה ימים',
      randomWeekly:'פעם בשבוע', randomBiweekly:'פעם בשבועיים',
      clear:'נקה תזמון', save:'שמור', editTitle:'עריכת מחשבה', thought:'מחשבה',
      editSchedule:'שינוי תזמון', saveChanges:'שמירת שינויים',
      deleteTitle:'למחוק את המחשבה?', deleteHelp:'המחיקה היא סופית. אפשר לבחור בארכיון אם אולי תרצה לחזור אליה.',
      cancel:'ביטול', delete:'מחיקה', edit:'עריכה', archive:'ארכיון',
      restore:'החזרה', done:'בוצע', menu:'פעולות', due:'הגיע הזמן',
      scheduled:'מתוזמן', repeats:'חוזר', random:'אקראי', noText:'צריך לכתוב משהו קודם.',
      added:'המחשבה נוספה.', updated:'המחשבה עודכנה.', deleted:'המחשבה נמחקה.',
      archivedToast:'המחשבה הועברה לארכיון.', restoredToast:'המחשבה הוחזרה.',
      completed:'סומן כבוצע.', nextScheduled:'המועד הבא נקבע אוטומטית.',
      speechUnsupported:'הכתבה קולית אינה נתמכת בדפדפן הזה.',
      allowNotif:'אפשר להפעיל התראות בדפדפן כדי לקבל תזכורות בזמן שהאפליקציה פעילה.', showReminders:'הצג תזכורות', dueListTitle:'התזכורות שמחכות לך', close:'סגור', transferToSite:'העבר לאתר', transferred:'המחשבות מוכנות להעברה לאתר.',
      exportBackup:'ייצוא גיבוי', importBackup:'ייבוא גיבוי', importTitle:'בדיקת הגיבוי לפני ייבוא', confirmImport:'מזג נתונים',
      backupReady:'קובץ הגיבוי נוצר.', importInvalid:'לא הצלחתי לקרוא את קובץ הגיבוי.', importComplete:'הייבוא הושלם בלי למחוק נתונים קיימים.'
    },
    en: {
      title:'My Thoughts', subtitle:'Remember, schedule, and return to what matters',
      placeholder:'What is on your mind?', schedule:'Schedule', add:'Add', itemType:'Item type', typeThought:'Thought / task', typeFriend:'Friend / person',
      active:'Active', archived:'Archive', all:'All', empty:'No thoughts here right now.',
      savedLocal:'Your data is stored locally on this device.', scheduleTitle:'Schedule',
      date:'Date', time:'Time', repeat:'Repeat', repeatNone:'No repeat',
      repeatWeekly:'Once a week', repeatBiweekly:'Every two weeks',
      repeatMonthly:'Once a month', repeatBimonthly:'Every two months',
      randomize:'Random reminder', randomizeHelp:'It will pop up again randomly based on frequency',
      frequency:'Random frequency', randomDaily:'Once a day', random3Days:'Every three days',
      randomWeekly:'Once a week', randomBiweekly:'Every two weeks',
      clear:'Clear schedule', save:'Save', editTitle:'Edit thought', thought:'Thought',
      editSchedule:'Change schedule', saveChanges:'Save changes',
      deleteTitle:'Delete this thought?', deleteHelp:'Deletion is permanent. Use Archive if you may want it later.',
      cancel:'Cancel', delete:'Delete', edit:'Edit', archive:'Archive',
      restore:'Restore', done:'Done', menu:'Actions', due:'Due now',
      scheduled:'Scheduled', repeats:'Repeats', random:'Random', noText:'Write something first.',
      added:'Thought added.', updated:'Thought updated.', deleted:'Thought deleted.',
      archivedToast:'Moved to archive.', restoredToast:'Restored.',
      completed:'Marked done.', nextScheduled:'Next occurrence scheduled automatically.',
      speechUnsupported:'Voice dictation is not supported in this browser.',
      allowNotif:'You can enable browser notifications to receive reminders while the app is active.', showReminders:'Show reminders', dueListTitle:'Reminders waiting for you', close:'Close', transferToSite:'Transfer to website', transferred:'Your thoughts are ready to transfer.',
      exportBackup:'Export backup', importBackup:'Import backup', importTitle:'Review backup before import', confirmImport:'Merge data',
      backupReady:'Backup file created.', importInvalid:'Could not read the backup file.', importComplete:'Import finished without deleting existing data.'
    }
  };

  const $ = id => document.getElementById(id);
  const listEl = $('list');
  const emptyEl = $('empty');

  function t(k){ return i18n[state.lang][k] || k; }

  function setLanguage(lang){
    state.lang = lang;
    localStorage.setItem('thoughts_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
    $('langBtn').textContent = lang === 'he' ? 'EN' : 'עברית';
    render();
  }

  function hashString(value){
    let hash = 2166136261;
    for(let i=0;i<value.length;i++){
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function extractItems(value){
    if(Array.isArray(value)) return value;
    if(value && Array.isArray(value.items)) return value.items;
    if(value && Array.isArray(value.data)) return value.data;
    return [];
  }

  function parseStoredItems(raw){
    if(!raw) return [];
    try{ return extractItems(JSON.parse(raw)); }
    catch(e){ return []; }
  }

  function stableItemSignature(item){
    const schedule = item?.schedule || null;
    const random = item?.random || null;
    return JSON.stringify({
      text:item?.text || item?.title || item?.content || '',
      type:item?.type || 'thought',
      createdAt:item?.createdAt || null,
      schedule,
      random,
      archived:!!item?.archived,
      done:!!item?.done
    });
  }

  function normalizeItem(item, sourceKey='unknown', index=0){
    if(!item || typeof item !== 'object') return null;
    const text = String(item.text || item.title || item.content || '').trim();
    if(!text) return null;
    const signature = stableItemSignature(item);
    return {
      ...item,
      id:String(item.id || ('legacy_' + hashString(sourceKey + '|' + index + '|' + signature))),
      text,
      type:item.type === 'friend' ? 'friend' : 'thought',
      createdAt:item.createdAt || null,
      archived:!!item.archived,
      done:!!item.done,
      schedule:item.schedule || null,
      random:item.random || null,
      lastNotifiedAt:item.lastNotifiedAt || null
    };
  }

  function mergeItems(groups){
    const merged = [];
    const seenIds = new Set();
    const seenSignatures = new Set();

    for(const group of groups){
      const sourceKey = group.sourceKey || 'unknown';
      const items = extractItems(group.items);
      items.forEach((raw, index) => {
        const item = normalizeItem(raw, sourceKey, index);
        if(!item) return;
        const signature = stableItemSignature(item);
        const idKey = item.id ? String(item.id) : null;
        if((idKey && seenIds.has(idKey)) || seenSignatures.has(signature)) return;
        if(idKey) seenIds.add(idKey);
        seenSignatures.add(signature);
        merged.push(item);
      });
    }
    return merged;
  }

  function readAllLocalSources(){
    const groups = [];
    for(const key of [STORAGE_KEY, ...LEGACY_KEYS]){
      const raw = localStorage.getItem(key);
      if(!raw) continue;
      const items = parseStoredItems(raw);
      if(items.length) groups.push({sourceKey:key, items});
    }
    return groups;
  }

  function load(){
    state.items = mergeItems(readAllLocalSources());
  }

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    localStorage.setItem(META_KEY, JSON.stringify({
      schemaVersion:SCHEMA_VERSION,
      updatedAt:new Date().toISOString()
    }));
  }

  function createBackupPayload(){
    const storageSnapshots = {};
    for(const key of [STORAGE_KEY, ...LEGACY_KEYS, META_KEY]){
      const raw = localStorage.getItem(key);
      if(raw !== null) storageSnapshots[key] = raw;
    }
    return {
      schemaVersion:SCHEMA_VERSION,
      exportedAt:new Date().toISOString(),
      app:'thoughts-assistant',
      items:state.items,
      storageSnapshots
    };
  }

  function downloadBackup(){
    const blob = new Blob([JSON.stringify(createBackupPayload(), null, 2)], {type:'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'thoughts-backup-' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    toast(t('backupReady'));
  }

  function extractImportGroups(payload){
    const groups = [];
    const topItems = extractItems(payload);
    if(topItems.length) groups.push({sourceKey:'import', items:topItems});
    if(payload && payload.storageSnapshots && typeof payload.storageSnapshots === 'object'){
      for(const [key, raw] of Object.entries(payload.storageSnapshots)){
        if(typeof raw !== 'string') continue;
        const items = parseStoredItems(raw);
        if(items.length) groups.push({sourceKey:'import:' + key, items});
      }
    }
    return groups;
  }

  function previewImport(payload){
    const incoming = mergeItems(extractImportGroups(payload));
    const combined = mergeItems([
      {sourceKey:'current', items:state.items},
      {sourceKey:'incoming', items:incoming}
    ]);
    return {
      incoming,
      combined,
      addedCount:Math.max(0, combined.length - state.items.length)
    };
  }

  function importFromHash(){
    const m = location.hash.match(/^#thoughts-transfer=(.+)$/);
    if(!m) return;
    try{
      const incoming = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      if(Array.isArray(incoming)){
        state.items = mergeItems([
          {sourceKey:'current', items:state.items},
          {sourceKey:'hash-transfer', items:incoming}
        ]);
        save();
      }
      history.replaceState(null,'',location.pathname+location.search);
    }catch(e){}
  }

  function toast(msg){
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function uid(){
    return (crypto.randomUUID && crypto.randomUUID()) || Date.now().toString(36)+Math.random().toString(36).slice(2);
  }

  function formatDateTime(iso){
    if(!iso) return '';
    const d = new Date(iso);
    if(Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(state.lang === 'he' ? 'he-IL':'en-GB',{
      dateStyle:'medium', timeStyle:'short'
    }).format(d);
  }

  function repeatLabel(value){
    return ({
      none:t('repeatNone'), weekly:t('repeatWeekly'), biweekly:t('repeatBiweekly'),
      monthly:t('repeatMonthly'), bimonthly:t('repeatBimonthly')
    })[value || 'none'];
  }

  function randomLabel(value){
    return ({
      daily:t('randomDaily'), '3days':t('random3Days'), weekly:t('randomWeekly'), biweekly:t('randomBiweekly')
    })[value || 'daily'];
  }

  function scheduledIso(schedule){
    if(!schedule?.date || !schedule?.time) return null;
    const d = new Date(`${schedule.date}T${schedule.time}:00`);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  function isDue(item){
    const iso = scheduledIso(item.schedule);
    if(iso && new Date(iso).getTime() <= Date.now()) return true;
    if(item.random?.enabled && item.random.nextAt && new Date(item.random.nextAt).getTime() <= Date.now()) return true;
    return false;
  }

  function addMonthsClamped(date, months){
    const d = new Date(date);
    const originalDay = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth()+months);
    const lastDay = new Date(d.getFullYear(), d.getMonth()+1, 0).getDate();
    d.setDate(Math.min(originalDay, lastDay));
    return d;
  }

  function nextRecurringDate(current, repeat){
    const d = new Date(current);
    if(repeat === 'weekly') d.setDate(d.getDate()+7);
    if(repeat === 'biweekly') d.setDate(d.getDate()+14);
    if(repeat === 'monthly') return addMonthsClamped(d,1);
    if(repeat === 'bimonthly') return addMonthsClamped(d,2);
    return d;
  }

  function randomWindowMs(freq){
    return ({daily:86400000,'3days':259200000,weekly:604800000,biweekly:1209600000})[freq] || 86400000;
  }

  function makeRandomNext(freq){
    const span = randomWindowMs(freq);
    const min = Math.min(2*60*60*1000, span*0.15);
    return new Date(Date.now() + min + Math.random()*(span-min)).toISOString();
  }

  function normalizeRandom(random){
    if(!random?.enabled) return null;
    return {
      enabled:true,
      frequency:random.frequency || 'daily',
      nextAt: random.nextAt || makeRandomNext(random.frequency || 'daily')
    };
  }

  function render(){
    const filtered = state.items.filter(item => {
      if(state.filter === 'active') return !item.archived;
      if(state.filter === 'archived') return item.archived;
      return true;
    }).sort((a,b) => {
      const ad = isDue(a) ? 0 : 1;
      const bd = isDue(b) ? 0 : 1;
      if(ad !== bd) return ad-bd;
      return new Date(b.createdAt)-new Date(a.createdAt);
    });

    listEl.innerHTML = '';
    emptyEl.classList.toggle('hidden', filtered.length !== 0);
    const dueItems = state.items.filter(x => !x.archived && isDue(x));
    $('dueBar').classList.toggle('show', dueItems.length > 0);
    $('dueSummary').textContent = state.lang === 'he' ? `יש לך ${dueItems.length} תזכורות` : `You have ${dueItems.length} reminders`;

    for(const item of filtered){
      const card = document.createElement('article');
      card.className = 'card' + (item.type === 'friend' ? ' friend-card' : '') + (isDue(item) ? ' due-card' : '');
      card.dataset.id = item.id;

      const chips = [`<span class="chip ${item.type==='friend'?'friend':''}">${escapeHtml(item.type==='friend'?t('typeFriend'):t('typeThought'))}</span>`];
      const iso = scheduledIso(item.schedule);
      if(isDue(item)) chips.push(`<span class="chip due">${escapeHtml(t('due'))}</span>`);
      if(iso) chips.push(`<span class="chip">${escapeHtml(t('scheduled'))}: ${escapeHtml(formatDateTime(iso))}</span>`);
      if(item.schedule?.repeat && item.schedule.repeat !== 'none') chips.push(`<span class="chip repeat">${escapeHtml(t('repeats'))}: ${escapeHtml(repeatLabel(item.schedule.repeat))}</span>`);
      if(item.random?.enabled) chips.push(`<span class="chip random">${escapeHtml(t('random'))}: ${escapeHtml(randomLabel(item.random.frequency))}</span>`);
      if(item.done) chips.push(`<span class="chip done">${escapeHtml(t('done'))}</span>`);

      card.innerHTML = `
        <div class="card-top">
          <div style="flex:1">
            <div class="thought">${escapeHtml(item.text)}</div>
            <div class="chips">${chips.join('')}</div>
          </div>
        </div>
        <div class="actions">
          <button class="small-action edit">${escapeHtml(t('edit'))}</button>
          <button class="small-action delete">${escapeHtml(t('delete'))}</button>
          <button class="small-action complete">${escapeHtml(t('done'))}</button>
          <button class="small-action archive">${escapeHtml(item.archived ? t('restore'):t('archive'))}</button>
        </div>
        <div class="meta">${escapeHtml(formatDateTime(item.createdAt))}</div>
      `;
      listEl.appendChild(card);
    }
  }

  function escapeHtml(s){
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function openSchedule({targetId=null, initial=null}={}){
    state.scheduleTargetId = targetId;
    const schedule = initial?.schedule || (targetId ? state.items.find(x=>x.id===targetId)?.schedule : state.pendingSchedule?.schedule) || null;
    const random = initial?.random || (targetId ? state.items.find(x=>x.id===targetId)?.random : state.pendingSchedule?.random) || null;

    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    $('scheduleDate').value = schedule?.date || `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    $('scheduleTime').value = schedule?.time || `${pad(now.getHours()+1 > 23 ? 23 : now.getHours()+1)}:00`;
    $('repeatSelect').value = schedule?.repeat || 'none';
    $('randomEnabled').checked = !!random?.enabled;
    $('randomFrequency').value = random?.frequency || 'daily';
    $('randomFrequencyWrap').classList.toggle('hidden', !$('randomEnabled').checked);
    $('scheduleDialog').showModal();
  }

  function readScheduleForm(){
    const hasDateTime = $('scheduleDate').value && $('scheduleTime').value;
    const schedule = hasDateTime ? {
      date:$('scheduleDate').value,
      time:$('scheduleTime').value,
      repeat:$('repeatSelect').value
    } : null;
    const random = $('randomEnabled').checked ? normalizeRandom({
      enabled:true,
      frequency:$('randomFrequency').value,
      nextAt:null
    }) : null;
    return {schedule, random};
  }

  function advanceAfterDone(item){
    const repeat = item.schedule?.repeat;
    const iso = scheduledIso(item.schedule);
    if(iso && repeat && repeat !== 'none'){
      let next = nextRecurringDate(new Date(iso), repeat);
      while(next.getTime() <= Date.now()){
        next = nextRecurringDate(next, repeat);
      }
      const pad = n => String(n).padStart(2,'0');
      item.schedule.date = `${next.getFullYear()}-${pad(next.getMonth()+1)}-${pad(next.getDate())}`;
      item.schedule.time = `${pad(next.getHours())}:${pad(next.getMinutes())}`;
      item.done = false;
      item.lastNotifiedAt = null;
      if(item.random?.enabled) item.random.nextAt = makeRandomNext(item.random.frequency);
      toast(t('nextScheduled'));
      return;
    }
    item.done = true;
  }

  function maybeNotify(){
    const dueItems = state.items.filter(x => !x.archived && isDue(x));
    for(const item of dueItems){
      const now = Date.now();
      const last = item.lastNotifiedAt ? new Date(item.lastNotifiedAt).getTime() : 0;
      if(now-last < 15*60*1000) continue;

      item.lastNotifiedAt = new Date().toISOString();

      if(item.random?.enabled && item.random.nextAt && new Date(item.random.nextAt).getTime() <= now){
        item.random.nextAt = makeRandomNext(item.random.frequency);
      }

      if('Notification' in window && Notification.permission === 'granted'){
        try{ new Notification(state.lang === 'he' ? 'תזכורת מהמחשבות' : 'Thought reminder', {body:item.text}); }catch(e){}
      }
    }
    if(dueItems.length){
      save();
      render();
    }
  }

  $('addBtn').addEventListener('click', () => {
    const text = $('thoughtInput').value.trim();
    if(!text){ toast(t('noText')); return; }
    const pending = state.pendingSchedule || {schedule:null,random:null};
    state.items.push({
      id:uid(), schemaVersion:SCHEMA_VERSION, text, type:$('newType').value === 'friend' ? 'friend' : 'thought', createdAt:new Date().toISOString(), archived:false, done:false,
      schedule:pending.schedule || null, random:normalizeRandom(pending.random), lastNotifiedAt:null
    });
    $('thoughtInput').value = '';
    state.pendingSchedule = null;
    save(); render(); toast(t('added'));
  });

  $('scheduleNewBtn').addEventListener('click', () => openSchedule());

  $('randomEnabled').addEventListener('change', () => {
    $('randomFrequencyWrap').classList.toggle('hidden', !$('randomEnabled').checked);
  });

  $('scheduleForm').addEventListener('submit', e => {
    e.preventDefault();
    const value = readScheduleForm();

    if(state.scheduleTargetId){
      const item = state.items.find(x=>x.id===state.scheduleTargetId);
      if(item){
        item.schedule = value.schedule;
        item.random = normalizeRandom(value.random);
        item.done = false;
        item.lastNotifiedAt = null;
        save(); render(); toast(t('updated'));
      }
    }else{
      state.pendingSchedule = value;
      toast(t('updated'));
    }
    state.scheduleTargetId = null;
    $('scheduleDialog').close();
  });

  $('clearScheduleBtn').addEventListener('click', () => {
    if(state.scheduleTargetId){
      const item = state.items.find(x=>x.id===state.scheduleTargetId);
      if(item){ item.schedule=null; item.random=null; item.lastNotifiedAt=null; save(); render(); }
    }else{
      state.pendingSchedule = null;
    }
    state.scheduleTargetId = null;
    $('scheduleDialog').close();
  });

  listEl.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if(!card) return;
    const id = card.dataset.id;
    const item = state.items.find(x=>x.id===id);
    if(!item) return;

    if(e.target.closest('.edit')){
      state.editTargetId = id;
      $('editType').value = item.type === 'friend' ? 'friend' : 'thought';
      $('editText').value = item.text;
      $('editDialog').showModal();
      return;
    }
    if(e.target.closest('.complete')){
      advanceAfterDone(item);
      save(); render(); toast(t('completed'));
      return;
    }
    if(e.target.closest('.archive')){
      item.archived = !item.archived;
      save(); render(); toast(item.archived ? t('archivedToast'):t('restoredToast'));
      return;
    }
    if(e.target.closest('.delete')){
      state.deleteTargetId = id;
      $('deleteDialog').showModal();
      return;
    }
  });

  $('editForm').addEventListener('submit', e => {
    e.preventDefault();
    const item = state.items.find(x=>x.id===state.editTargetId);
    const text = $('editText').value.trim();
    if(item && text){
      item.text = text;
      item.type = $('editType').value === 'friend' ? 'friend' : 'thought';
      save(); render(); toast(t('updated'));
    }
    state.editTargetId = null;
    $('editDialog').close();
  });

  $('editScheduleBtn').addEventListener('click', () => {
    const id = state.editTargetId;
    $('editDialog').close();
    openSchedule({targetId:id});
  });

  $('cancelDeleteBtn').addEventListener('click', () => {
    state.deleteTargetId = null;
    $('deleteDialog').close();
  });

  $('confirmDeleteBtn').addEventListener('click', () => {
    state.items = state.items.filter(x=>x.id!==state.deleteTargetId);
    state.deleteTargetId = null;
    save(); render(); $('deleteDialog').close(); toast(t('deleted'));
  });

  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    tab.classList.add('active');
    state.filter = tab.dataset.filter;
    render();
  }));

  $('showDueBtn').addEventListener('click', () => {
    const dueItems = state.items.filter(x => !x.archived && isDue(x));
    $('dueList').innerHTML = dueItems.map(item => `<button class="small-action" data-id="${escapeHtml(item.id)}" style="text-align:inherit;padding:12px">${escapeHtml(item.text)}</button>`).join('');
    $('dueDialog').showModal();
  });
  $('closeDueBtn').addEventListener('click', () => $('dueDialog').close());
  $('dueList').addEventListener('click', e => {
    const b=e.target.closest('[data-id]'); if(!b) return;
    $('dueDialog').close();
    state.filter='active';
    document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x.dataset.filter==='active'));
    render();
    setTimeout(()=>document.querySelector('.card[data-id="'+CSS.escape(b.dataset.id)+'"]')?.scrollIntoView({behavior:'smooth',block:'center'}),50);
  });

  $('exportBtn').addEventListener('click', downloadBackup);

  $('importBtn').addEventListener('click', () => {
    $('importFile').value = '';
    $('importFile').click();
  });

  $('importFile').addEventListener('change', async e => {
    const file = e.target.files?.[0];
    if(!file) return;
    try{
      const payload = JSON.parse(await file.text());
      const preview = previewImport(payload);
      if(!preview.incoming.length) throw new Error('No items');
      state.pendingImport = preview;
      $('importSummary').textContent = state.lang === 'he'
        ? `בגיבוי נמצאו ${preview.incoming.length} פריטים. ${preview.addedCount} מהם חדשים ויתווספו ל־${state.items.length} הפריטים הקיימים. שום מידע קיים לא יימחק.`
        : `The backup contains ${preview.incoming.length} items. ${preview.addedCount} are new and will be merged into your ${state.items.length} existing items. Existing data will not be deleted.`;
      $('importDialog').showModal();
    }catch(err){
      state.pendingImport = null;
      toast(t('importInvalid'));
    }
  });

  $('cancelImportBtn').addEventListener('click', () => {
    state.pendingImport = null;
    $('importDialog').close();
  });

  $('confirmImportBtn').addEventListener('click', () => {
    if(state.pendingImport){
      state.items = state.pendingImport.combined;
      save();
      render();
      toast(t('importComplete'));
    }
    state.pendingImport = null;
    $('importDialog').close();
  });

  $('transferBtn').addEventListener('click', () => {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(state.items))));
    location.href = 'https://itamarlev.com/thoughts-assistant/#thoughts-transfer=' + payload;
  });

  $('langBtn').addEventListener('click', () => setLanguage(state.lang === 'he' ? 'en':'he'));

  $('voiceBtn').addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ toast(t('speechUnsupported')); return; }
    const rec = new SR();
    rec.lang = state.lang === 'he' ? 'he-IL':'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = ev => {
      const text = ev.results?.[0]?.[0]?.transcript || '';
      if(text) $('thoughtInput').value = ($('thoughtInput').value + ' ' + text).trim();
    };
    rec.start();
  });

  window.addEventListener('focus', maybeNotify);
  setInterval(maybeNotify, 60000);

  load();
  importFromHash();
  if(location.hostname === 'itamarlev.com' || location.hostname.endsWith('.itamarlev.com')) $('transferBtn').style.display='none';
  setLanguage(state.lang);
  maybeNotify();
})();
