import { useState, useEffect } from 'react'

const AREA_META = {
  '🕉️': { label: 'Spiritual',  bg: '#fff0f5', color: '#7b0000' },
  '🏥': { label: 'Health',     bg: '#fff0f0', color: '#c62828' },
  '⚖️': { label: 'Advocate',   bg: '#e8eaf6', color: '#1a237e' },
  '🌿': { label: 'Gardening',  bg: '#e8f5e9', color: '#1b5e20' },
  '🌍': { label: 'AOL/JCI',    bg: '#e0f2f1', color: '#00695c' },
  '❤️': { label: 'Family',     bg: '#fce4ec', color: '#880e4f' },
  '🧠': { label: 'Focus',      bg: '#e3f2fd', color: '#1565c0' },
  '💰': { label: 'Money',      bg: '#fff8e1', color: '#f57f17' },
  '🌸': { label: 'Self Care',  bg: '#f3e5f5', color: '#6a1b9a' },
}

const KIRTI_TASKS = [
  // EARLY MORNING
  { id:1,  section:'🌅 ब्रह्म मुहूर्त — Spiritual',  time:'4:30 AM', task:'उठें — पुष्य नक्षत्र की शक्ति इस समय सबसे अधिक', tags:['🕉️'],      pinned:true  },
  { id:2,  section:'🌅 ब्रह्म मुहूर्त — Spiritual',  time:'4:35 AM', task:'तांबे के लोटे से पानी — 1 गिलास (रात भर रखा)',   tags:['🏥'],      pinned:false },
  { id:3,  section:'🌅 ब्रह्म मुहूर्त — Spiritual',  time:'4:40 AM', task:'तुलसी के पास दीपक जलाएं — शुभ शुरुआत',          tags:['🕉️'],      pinned:false },
  { id:4,  section:'🌅 ब्रह्म मुहूर्त — Spiritual',  time:'4:45 AM', task:'Sudarshan Kriya — Art of Living (NEVER MISS)',    tags:['🕉️','🏥'], pinned:true  },
  { id:5,  section:'🌅 ब्रह्म मुहूर्त — Spiritual',  time:'5:30 AM', task:'Meditation — 20 मिनट पूर्ण मौन',                 tags:['🕉️','🧠'], pinned:false },
  { id:6,  section:'🌅 ब्रह्म मुहूर्त — Spiritual',  time:'5:50 AM', task:"Mantra Jap — माला के साथ 'ॐ गुरवे नमः'",         tags:['🕉️'],      pinned:false },
  // GARDEN
  { id:7,  section:'🌿 बगीचा — Healing Time',        time:'6:10 AM', task:'बगीचे में जाएं — पौधों को पानी दें (सबसे बड़ी Therapy)', tags:['🌿','🏥'], pinned:true },
  { id:8,  section:'🌿 बगीचा — Healing Time',        time:'6:10 AM', task:'तुलसी को पानी — Healing herbs की देखभाल',        tags:['🌿','🕉️'], pinned:false },
  { id:9,  section:'🌿 बगीचा — Healing Time',        time:'6:30 AM', task:'बगीचे में Meditation corner पर बैठें — 10 मिनट', tags:['🌿','🕉️'], pinned:false },
  { id:10, section:'🌿 बगीचा — Healing Time',        time:'6:40 AM', task:'नाश्ता — सात्विक, घर का बना (Court से पहले)',    tags:['🏥'],      pinned:false },
  { id:11, section:'🌿 बगीचा — Healing Time',        time:'6:50 AM', task:'BP Check + पानी एक गिलास और',                   tags:['🏥'],      pinned:false },
  // COURT
  { id:12, section:'⚖️ Court — Advocate Work',       time:'7:15 AM', task:"Court की तैयारी — 3 Deep Breaths 'मैं निमित्त हूं'", tags:['⚖️','🧠'], pinned:false },
  { id:13, section:'⚖️ Court — Advocate Work',       time:'8:00 AM', task:'Court / Legal Work — पूरे ध्यान से',            tags:['⚖️'],      pinned:true  },
  { id:14, section:'⚖️ Court — Advocate Work',       time:'8:00 AM', task:'आज के Important Cases की list देखें',            tags:['⚖️'],      pinned:false },
  { id:15, section:'⚖️ Court — Advocate Work',       time:'10:30 AM',task:'Break — पानी + 5 मिनट आंखें बंद',               tags:['🏥'],      pinned:false },
  { id:16, section:'⚖️ Court — Advocate Work',       time:'1:00 PM', task:'Lunch — शांति से, Gratitude के साथ, Phone बंद', tags:['🏥','🕉️'], pinned:false },
  { id:17, section:'⚖️ Court — Advocate Work',       time:'1:30 PM', task:'10 मिनट Rest — Micro Meditation',               tags:['🏥'],      pinned:false },
  // AOL / JCI
  { id:18, section:'🌍 AOL + JCI + Social Service',  time:'4:00 PM', task:'AOL Teaching Preparation — Workshop content',   tags:['🌍','🕉️'], pinned:false },
  { id:19, section:'🌍 AOL + JCI + Social Service',  time:'4:30 PM', task:'JCI Work — Community project / Meeting',        tags:['🌍'],      pinned:false },
  { id:20, section:'🌍 AOL + JCI + Social Service',  time:'5:00 PM', task:'Workshop planning — Gondia / Raipur community', tags:['🌍','🕉️'], pinned:false },
  { id:21, section:'🌍 AOL + JCI + Social Service',  time:'5:30 PM', task:'Free Legal Aid — कोई जरूरतमंद है? Help करें',  tags:['⚖️','🌍'], pinned:false },
  // TRANSITION
  { id:22, section:'🚗 Court से घर — Transition',   time:'5:00 PM', task:'Car में बैठते ही 5 मिनट — Court वहीं छोड़ें', tags:['🏥','🧠'], pinned:true  },
  { id:23, section:'🚗 Court से घर — Transition',   time:'5:15 PM', task:'बगीचे में 20 मिनट — Court के stress को release', tags:['🌿','🏥'], pinned:true  },
  { id:24, section:'🚗 Court से घर — Transition',   time:'5:35 PM', task:'चाय — शांति से, Phone नहीं (10 मिनट)',          tags:['🌸'],      pinned:false },
  // FAMILY
  { id:25, section:'❤️ परिवार + Sanjay + Mahi',     time:'6:00 PM', task:'Sanjay के साथ — बगीचे में 15 मिनट',             tags:['❤️','🌿'], pinned:true  },
  { id:26, section:'❤️ परिवार + Sanjay + Mahi',     time:'6:15 PM', task:'माही के साथ — आज क्या किया सुनें (Judge नहीं)', tags:['❤️'],      pinned:false },
  { id:27, section:'❤️ परिवार + Sanjay + Mahi',     time:'7:00 PM', task:'Satsang / Spiritual Reading — 30 मिनट',         tags:['🕉️'],      pinned:false },
  { id:28, section:'❤️ परिवार + Sanjay + Mahi',     time:'8:00 PM', task:'Family Dinner — तीनों साथ, Phone नहीं',         tags:['❤️','🏥'], pinned:true  },
  { id:29, section:'❤️ परिवार + Sanjay + Mahi',     time:'8:00 PM', task:'दिन की 1 अच्छी बात share करें',                tags:['❤️'],      pinned:false },
  // WIND DOWN
  { id:30, section:'🌙 रात — Wind Down',            time:'9:00 PM', task:"Journal Writing — आज क्या सीखा, क्या दिया",    tags:['🕉️','🧠'], pinned:false },
  { id:31, section:'🌙 रात — Wind Down',            time:'9:15 PM', task:"Sanjay के साथ Quality Time — Advocate mode बंद",tags:['❤️'],      pinned:true  },
  { id:32, section:'🌙 रात — Wind Down',            time:'9:30 PM', task:"'ॐ' — 21 बार (दीपक के सामने)",                 tags:['🕉️'],      pinned:false },
  { id:33, section:'🌙 रात — Wind Down',            time:'9:45 PM', task:'Phone बंद — Screen Time खत्म',                 tags:['🏥'],      pinned:false },
  { id:34, section:'🌙 रात — Wind Down',            time:'9:50 PM', task:'सोएं — अच्छी नींद = अच्छी Sudarshan Kriya',   tags:['🏥'],      pinned:true  },
]

const SECTION_COLORS = {
  '🌅 ब्रह्म मुहूर्त — Spiritual':   { bg:'#fff5e6', accent:'#7b0000' },
  '🌿 बगीचा — Healing Time':         { bg:'#e8f5e9', accent:'#1b5e20' },
  '⚖️ Court — Advocate Work':        { bg:'#e8eaf6', accent:'#1a237e' },
  '🌍 AOL + JCI + Social Service':   { bg:'#e0f2f1', accent:'#00695c' },
  '🚗 Court से घर — Transition':    { bg:'#fff8e1', accent:'#f57f17' },
  '❤️ परिवार + Sanjay + Mahi':       { bg:'#fce4ec', accent:'#880e4f' },
  '🌙 रात — Wind Down':             { bg:'#f3e5f5', accent:'#6a1b9a' },
}

const STORAGE_KEY = 'kirti_routine_v1'

function loadState() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s) } catch {}
  return null
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

export default function KirtiRoutine() {
  const saved = loadState()
  const [tasks, setTasks] = useState(saved?.tasks || KIRTI_TASKS)
  const [done, setDone] = useState(saved?.done || {})
  const [view, setView] = useState('today')
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({})
  const [addingSection, setAddingSection] = useState(null)
  const [newTask, setNewTask] = useState({ time:'', task:'', tags:[] })
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [searchQ, setSearchQ] = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  useEffect(() => { saveState({ tasks, done }) }, [tasks, done])

  const sections = [...new Set(tasks.map(t => t.section))]
  const todayDone = Object.values(done).filter(Boolean).length
  const todayTotal = tasks.length
  const pct = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0

  const toggle = (id) => {
    const nd = { ...done, [id]: !done[id] }
    setDone(nd)
    if (Object.values(nd).filter(Boolean).length === todayTotal) setShowCelebrate(true)
  }

  const startEdit = (t) => { setEditingId(t.id); setEditDraft({ time:t.time, task:t.task, tags:[...t.tags] }) }
  const saveEdit = () => { setTasks(tasks.map(t => t.id===editingId?{...t,...editDraft}:t)); setEditingId(null) }
  const deleteTask = (id) => { setTasks(tasks.filter(t=>t.id!==id)); const nd={...done}; delete nd[id]; setDone(nd) }
  const addTask = (sec) => {
    if (!newTask.task.trim()) return
    setTasks([...tasks, { id:Date.now(), section:sec, time:newTask.time, task:newTask.task, tags:newTask.tags, pinned:false }])
    setNewTask({ time:'', task:'', tags:[] }); setAddingSection(null)
  }

  const onDragStart = (id) => setDragId(id)
  const onDragOver = (e, id) => { e.preventDefault(); setDragOverId(id) }
  const onDrop = (targetId) => {
    if (dragId===targetId) return
    const arr=[...tasks], fi=arr.findIndex(t=>t.id===dragId), ti=arr.findIndex(t=>t.id===targetId)
    const [m]=arr.splice(fi,1); arr.splice(ti,0,m); setTasks(arr)
    setDragId(null); setDragOverId(null)
  }

  const filtered = tasks.filter(t => {
    const aOk = activeFilter==='ALL' || t.tags.includes(activeFilter)
    const sOk = !searchQ || t.task.toLowerCase().includes(searchQ.toLowerCase()) || t.time.includes(searchQ)
    return aOk && sOk
  })

  const sc = (sec) => SECTION_COLORS[sec] || { bg:'#f9f9f9', accent:'#00695c' }
  const TEAL = '#00695c'
  const GREEN = '#1b5e20'

  return (
    <div style={S.root}>
      <header style={{...S.header, background:'linear-gradient(135deg, #00695c 0%, #1b5e20 100%)'}}>
        <div style={S.headerTop}>
          <div>
            <div style={S.headerTitle}>🌿 किर्ती अहूजा</div>
            <div style={S.headerSub}>Advocate • AOL Teacher • Healer</div>
            <div style={{...S.headerSub, color:'#b2dfdb', fontSize:10}}>मेष लग्न • मकर राशि • पुष्य नक्षत्र • शनि महादशा</div>
          </div>
          <div>
            <svg width="52" height="52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"/>
              <circle cx="26" cy="26" r="22" fill="none" stroke="#ffd700" strokeWidth="4"
                strokeDasharray={`${2*Math.PI*22}`}
                strokeDashoffset={`${2*Math.PI*22*(1-pct/100)}`}
                strokeLinecap="round"
                style={{transform:'rotate(-90deg)',transformOrigin:'26px 26px',transition:'stroke-dashoffset 0.5s'}}/>
              <text x="26" y="31" textAnchor="middle" fill="#ffd700" fontSize="13" fontWeight="bold">{pct}%</text>
            </svg>
          </div>
        </div>
        <div style={{...S.progressBar, background:'rgba(255,255,255,0.2)'}}>
          <div style={{...S.progressFill, width:`${pct}%`, background:'#ffd700'}}/>
        </div>
        <div style={S.progressText}>{todayDone} / {todayTotal} tasks complete</div>
      </header>

      <nav style={S.nav}>
        {[['today','📋 आज'],['weekly','📅 Weekly'],['aol','🕉️ AOL'],['garden','🌿 Garden']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{...S.navBtn,...(view===v?{...S.navBtnActive,borderBottomColor:TEAL,color:TEAL}:{})}}>
            {l}
          </button>
        ))}
      </nav>

      {view==='today' && <>
        <div style={S.toolBar}>
          <input placeholder="🔍 Search tasks..." value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={S.searchInput}/>
        </div>
        <div style={S.filterRow}>
          {['ALL',...Object.keys(AREA_META)].map(a=>(
            <button key={a} onClick={()=>setActiveFilter(a)}
              style={{...S.filterChip,...(activeFilter===a?{background:a==='ALL'?TEAL:(AREA_META[a]?.color||'#333'),color:'#fff'}:{})}}>
              {a==='ALL'?'All':a}
            </button>
          ))}
        </div>

        {sections.map(sec=>{
          const secTasks=filtered.filter(t=>t.section===sec)
          if(!secTasks.length) return null
          const c=sc(sec)
          const secDone=secTasks.filter(t=>done[t.id]).length
          return (
            <div key={sec} style={{...S.section,background:c.bg}}>
              <div style={{...S.sectionHeader,borderLeftColor:c.accent}}>
                <span style={S.sectionTitle}>{sec}</span>
                <span style={{...S.sectionBadge,background:c.accent}}>{secDone}/{secTasks.length}</span>
              </div>
              {secTasks.map(t=>(
                <div key={t.id} draggable onDragStart={()=>onDragStart(t.id)}
                  onDragOver={e=>onDragOver(e,t.id)} onDrop={()=>onDrop(t.id)}
                  style={{...S.taskCard,...(done[t.id]?S.taskDone:{}),...(dragOverId===t.id?S.taskDragOver:{}),borderLeftColor:c.accent}}>
                  {editingId===t.id?(
                    <div style={S.editBox}>
                      <input value={editDraft.time} onChange={e=>setEditDraft({...editDraft,time:e.target.value})} style={S.editInput} placeholder="Time"/>
                      <textarea value={editDraft.task} onChange={e=>setEditDraft({...editDraft,task:e.target.value})} style={S.editTextarea} rows={2}/>
                      <div style={S.editTagRow}>
                        {Object.keys(AREA_META).map(a=>(
                          <button key={a} onClick={()=>setEditDraft({...editDraft,tags:editDraft.tags.includes(a)?editDraft.tags.filter(x=>x!==a):[...editDraft.tags,a]})}
                            style={{...S.tagToggle,...(editDraft.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>{a}</button>
                        ))}
                      </div>
                      <div style={S.editActions}>
                        <button onClick={saveEdit} style={{...S.btnSave,background:TEAL}}>💾 Save</button>
                        <button onClick={()=>setEditingId(null)} style={S.btnCancel}>✕</button>
                      </div>
                    </div>
                  ):(
                    <div style={S.taskRow} onClick={()=>toggle(t.id)}>
                      <div style={{...S.checkbox,...(done[t.id]?{...S.checkboxDone,background:TEAL}:{}),borderColor:c.accent}}>
                        {done[t.id]&&<span style={S.checkMark}>✓</span>}
                      </div>
                      <div style={S.taskContent}>
                        <div style={{...S.taskTime,color:c.accent}}>{t.time} {t.pinned&&'📌'}</div>
                        <div style={{...S.taskText,...(done[t.id]?S.taskTextDone:{})}}>{t.task}</div>
                        <div style={S.tagRow}>
                          {t.tags.map(tag=>(
                            <span key={tag} style={{...S.tag,background:AREA_META[tag]?.bg||'#eee',color:AREA_META[tag]?.color||'#666'}}>
                              {tag} {AREA_META[tag]?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={S.taskActions} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>startEdit(t)} style={S.iconBtn}>✏️</button>
                        <button onClick={()=>deleteTask(t.id)} style={S.iconBtn}>🗑️</button>
                        <span style={S.dragHandle}>⠿</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {addingSection===sec?(
                <div style={S.addBox}>
                  <input placeholder="Time" value={newTask.time} onChange={e=>setNewTask({...newTask,time:e.target.value})} style={S.editInput}/>
                  <input placeholder="Task..." value={newTask.task} onChange={e=>setNewTask({...newTask,task:e.target.value})} style={S.editInput} onKeyDown={e=>e.key==='Enter'&&addTask(sec)}/>
                  <div style={S.editActions}>
                    <button onClick={()=>addTask(sec)} style={{...S.btnSave,background:TEAL}}>➕ Add</button>
                    <button onClick={()=>setAddingSection(null)} style={S.btnCancel}>✕</button>
                  </div>
                </div>
              ):(
                <button onClick={()=>setAddingSection(sec)} style={{...S.addTaskBtn,color:c.accent}}>+ Add task</button>
              )}
            </div>
          )
        })}
        <div style={S.resetRow}>
          <button onClick={()=>setDone({})} style={{...S.btnReset,borderColor:TEAL,color:TEAL}}>🔄 Reset Today</button>
        </div>
      </>}

      {view==='weekly' && <KirtiWeekly />}
      {view==='aol'    && <KirtiAOL />}
      {view==='garden' && <KirtiGarden />}

      {showCelebrate&&(
        <div style={S.celebrateOverlay} onClick={()=>setShowCelebrate(false)}>
          <div style={S.celebrateBox}>
            <div style={{fontSize:56,marginBottom:8}}>🌸</div>
            <div style={{...S.celebrateTitle,color:TEAL}}>जय गुरुदेव! 🙏</div>
            <div style={S.celebrateSub}>किर्ती जी — आज का पूरा Routine complete!</div>
            <div style={{...S.celebrateQuote,color:'#00695c'}}>&quot;आप पहले से ही Teacher हैं — Certificate सिर्फ दुनिया को बताएगा&quot; 🌿</div>
            <button onClick={()=>setShowCelebrate(false)} style={{...S.btnSave,background:TEAL}}>🕉️ जय गुरुदेव</button>
          </div>
        </div>
      )}
    </div>
  )
}

function KirtiWeekly() {
  const days = [
    { day:'सोमवार 🌙', focus:'Shiv Temple + Court + JCI',    color:'#1a237e', mantra:"'ॐ सोमाय नमः' 21 बार", tip:'Weekly AOL workshop plan करें' },
    { day:'मंगलवार 🔴', focus:'Court + Extra Gardening',      color:'#b71c1c', mantra:"'ॐ अं अंगारकाय नमः' 21 बार", tip:'Healing herbs की देखभाल' },
    { day:'बुधवार 💚',  focus:'Legal Aid + Community Work',   color:'#00695c', mantra:"'ॐ बुं बुधाय नमः' 21 बार", tip:'1 गरीब को Free Legal help' },
    { day:'गुरुवार 🌕', focus:'AOL Workshop + JCI Meeting',   color:'#4a148c', mantra:"'ॐ गुरवे नमः' 21 बार", tip:'Workshop का पहला दिन — Thursday को' },
    { day:'शुक्रवार 💕', focus:'Family + Satsang',            color:'#880e4f', mantra:"'ॐ श्रीं लक्ष्म्यै नमः' 108 बार", tip:'Sanjay के साथ Quality Time' },
    { day:'शनिवार 🪐',  focus:'Garden + AOL Prep + Review',   color:'#37474f', mantra:"'ॐ शं शनैश्चराय नमः' 108 बार", tip:'Bangalore preparation update' },
    { day:'रविवार ☀️',  focus:'Full Spiritual Day + Family',  color:'#e65100', mantra:"Sudarshan Kriya — Extended", tip:'Sanjay + Mahi के साथ Temple' },
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      {days.map(d=>(
        <div key={d.day} style={{background:'#fff',borderRadius:14,padding:'14px 16px',marginBottom:10,borderTop:`4px solid ${d.color}`,boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
          <div style={{fontSize:16,fontWeight:800,color:d.color,marginBottom:4}}>{d.day}</div>
          <div style={{fontSize:13,fontWeight:700,color:'#333',marginBottom:6}}>{d.focus}</div>
          <div style={{fontSize:12,color:'#555',marginBottom:3}}>🕉️ {d.mantra}</div>
          <div style={{fontSize:12,color:'#888'}}>💡 {d.tip}</div>
        </div>
      ))}
    </div>
  )
}

function KirtiAOL() {
  const mantras = [
    { when:'रोज 4:45 AM', mantra:'Sudarshan Kriya — NEVER MISS', benefit:'आत्मा की शांति + Health', color:'#7b0000' },
    { when:'रोज सुबह',    mantra:"'ॐ नमः शिवाय' — 21 बार",      benefit:'मन की शांति + Court में Calm', color:'#1a237e' },
    { when:'रोज सुबह',    mantra:"'ॐ गुरवे नमः' — 21 बार",      benefit:'Gurudev का आशीर्वाद', color:'#00695c' },
    { when:'सोमवार',      mantra:"'ॐ सोमाय नमः' — 108 बार",     benefit:'मन + Emotions balanced', color:'#880e4f' },
    { when:'शनिवार',      mantra:"'ॐ शं शनैश्चराय नमः' — 108 बार", benefit:'शनि महादशा + Discipline', color:'#37474f' },
    { when:'शुक्रवार',    mantra:"'ॐ श्रीं लक्ष्म्यै नमः' — 108 बार", benefit:'Family prosperity', color:'#880e4f' },
  ]
  const aol_steps = [
    { step:'अभी करें', action:'Sudarshan Kriya — रोज 4:45 AM', done:true },
    { step:'Bangalore', action:'Teacher Training — जल्दी जाएं — यह आपका Dharma है', done:false },
    { step:'Local Workshop', action:'Gondia/Raipur में पहला Workshop — गुरुवार को', done:false },
    { step:'JCI Integration', action:'JCI Network में AOL introduce करें', done:false },
    { step:'Healing Garden', action:"'Healing Garden' Project — Meditation + Community", done:false },
    { step:'Big Programs', action:'Gurudev के साथ बड़े Programs में योगदान', done:false },
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      <div style={{fontSize:16,fontWeight:800,color:'#00695c',textAlign:'center',padding:'8px 0 12px'}}>🕉️ AOL Teacher Journey</div>
      {aol_steps.map((s,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${s.done?'#00695c':'#bbb'}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)',display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontSize:20}}>{s.done?'✅':'🎯'}</div>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:s.done?'#00695c':'#888',marginBottom:2}}>{s.step}</div>
            <div style={{fontSize:13,color:'#222'}}>{s.action}</div>
          </div>
        </div>
      ))}
      <div style={{fontSize:16,fontWeight:800,color:'#00695c',textAlign:'center',padding:'12px 0 8px'}}>🕉️ Daily Mantras</div>
      {mantras.map((m,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${m.color}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:11,fontWeight:800,color:m.color,marginBottom:3}}>{m.when}</div>
          <div style={{fontSize:14,fontWeight:700,color:'#222',marginBottom:3}}>{m.mantra}</div>
          <div style={{fontSize:11,color:'#666'}}>✨ {m.benefit}</div>
        </div>
      ))}
      <div style={{background:'linear-gradient(135deg,#e8f5e9,#e0f2f1)',border:'2px solid #00695c',borderRadius:14,padding:18,marginTop:12,textAlign:'center'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#00695c',lineHeight:1.6}}>&quot;आप पहले से ही Teacher हैं</div>
        <div style={{fontSize:14,fontWeight:700,color:'#00695c',lineHeight:1.6}}>Certificate सिर्फ दुनिया को बताएगा&quot; 🌿</div>
        <div style={{fontSize:12,color:'#1b5e20',marginTop:8,fontWeight:600}}>🕉️ जय गुरुदेव | Bangalore जाइए — अभी</div>
      </div>
    </div>
  )
}

function KirtiGarden() {
  const plants = [
    { dir:'उत्तर-पूर्व (ईशान)', plant:'तुलसी — 5-7 पौधे', benefit:'पवित्रता + Spiritual Energy', emoji:'🌿' },
    { dir:'पूर्व',              plant:'पीले और सफेद फूल — गेंदा, चमेली', benefit:'Positivity + Happiness', emoji:'🌼' },
    { dir:'उत्तर',             plant:'Herbs — पुदीना, धनिया, ब्राह्मी', benefit:'Health + Memory', emoji:'🌱' },
    { dir:'दक्षिण-पूर्व',      plant:'एलोवेरा, गिलोय', benefit:'Healing + Immunity', emoji:'💚' },
    { dir:'केंद्र (Center)',    plant:'Meditation Corner — चटाई', benefit:'Family Peace + Sudarshan Kriya', emoji:'🧘' },
  ]
  const healingHerbs = [
    { name:'ब्राह्मी', use:'Memory + Focus + Stress Relief', how:'रोज 1 गोली' },
    { name:'अश्वगंधा', use:'Strength + Calm + Immunity', how:'रात को दूध के साथ' },
    { name:'शंखपुष्पी', use:'Brain Power + Memory', how:'सुबह खाली पेट' },
    { name:'गिलोय',    use:'Immunity + Energy + Fever', how:'काढ़ा बनाकर' },
    { name:'तुलसी',    use:'Immunity + Spiritual + Stress', how:'5 पत्ते रोज सुबह' },
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      <div style={{fontSize:16,fontWeight:800,color:'#1b5e20',textAlign:'center',padding:'8px 0 12px'}}>🌿 Spiritual Garden — Vastu Plan</div>
      {plants.map((p,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:'4px solid #1b5e20',boxShadow:'0 1px 5px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:20,marginBottom:4}}>{p.emoji}</div>
          <div style={{fontSize:11,fontWeight:800,color:'#1b5e20',marginBottom:2}}>{p.dir}</div>
          <div style={{fontSize:13,fontWeight:700,color:'#222',marginBottom:2}}>{p.plant}</div>
          <div style={{fontSize:11,color:'#666'}}>{p.benefit}</div>
        </div>
      ))}
      <div style={{fontSize:16,fontWeight:800,color:'#1b5e20',textAlign:'center',padding:'12px 0 8px'}}>💊 Healing Herbs — रोज use करें</div>
      {healingHerbs.map((h,i)=>(
        <div key={i} style={{background:'#e8f5e9',borderRadius:10,padding:'10px 14px',marginBottom:6,borderLeft:'3px solid #1b5e20'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#1b5e20'}}>{h.name}</div>
            <div style={{fontSize:11,color:'#555',background:'#fff',padding:'2px 8px',borderRadius:10}}>{h.how}</div>
          </div>
          <div style={{fontSize:11,color:'#555',marginTop:3}}>{h.use}</div>
        </div>
      ))}
      <div style={{background:'linear-gradient(135deg,#e8f5e9,#f1f8e9)',border:'2px solid #1b5e20',borderRadius:14,padding:18,marginTop:12,textAlign:'center'}}>
        <div style={{fontSize:15,fontWeight:700,color:'#1b5e20'}}>बगीचे में रोज 20 मिनट 🌿</div>
        <div style={{fontSize:12,color:'#555',marginTop:6,lineHeight:1.6}}>यह Negotiable नहीं है<br/>पौधों को पानी = आत्मा को शांति<br/>Court का stress यहीं release होता है</div>
      </div>
    </div>
  )
}

const S = {
  root:{ fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif",background:'#f0f7f4',minHeight:'100vh',maxWidth:480,margin:'0 auto',paddingBottom:40 },
  header:{ padding:'20px 16px 12px',color:'#fff' },
  headerTop:{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 },
  headerTitle:{ fontSize:22,fontWeight:700 },
  headerSub:{ fontSize:12,opacity:0.85,marginTop:2 },
  progressBar:{ borderRadius:8,height:6,overflow:'hidden' },
  progressFill:{ height:'100%',borderRadius:8,transition:'width 0.4s' },
  progressText:{ fontSize:11,opacity:0.85,marginTop:5,textAlign:'right' },
  nav:{ display:'flex',background:'#fff',borderBottom:'2px solid #e0f2f1',position:'sticky',top:0,zIndex:10 },
  navBtn:{ flex:1,padding:'11px 2px',border:'none',background:'transparent',fontSize:11,fontWeight:600,color:'#888',cursor:'pointer' },
  navBtnActive:{ borderBottom:'3px solid' },
  toolBar:{ padding:'10px 12px 4px' },
  searchInput:{ width:'100%',padding:'8px 12px',border:'1.5px solid #ddd',borderRadius:10,fontSize:13,outline:'none',boxSizing:'border-box',background:'#fff' },
  filterRow:{ display:'flex',gap:6,padding:'6px 12px 10px',overflowX:'auto',scrollbarWidth:'none' },
  filterChip:{ padding:'4px 10px',border:'1.5px solid #ddd',borderRadius:20,fontSize:11,background:'#fff',cursor:'pointer',whiteSpace:'nowrap',color:'#555',fontWeight:600 },
  section:{ margin:'8px 10px',borderRadius:14,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  sectionHeader:{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',borderLeft:'4px solid',background:'rgba(255,255,255,0.6)' },
  sectionTitle:{ fontWeight:700,fontSize:13,color:'#222' },
  sectionBadge:{ color:'#fff',borderRadius:12,padding:'2px 8px',fontSize:11,fontWeight:700 },
  taskCard:{ background:'#fff',margin:'1px 0',borderLeft:'3px solid transparent',transition:'all 0.2s',cursor:'grab' },
  taskDone:{ opacity:0.6,background:'#f9f9f9' },
  taskDragOver:{ background:'#e8f5e9',boxShadow:'inset 0 0 0 2px #00695c' },
  taskRow:{ display:'flex',alignItems:'flex-start',gap:10,padding:'10px 12px',cursor:'pointer' },
  checkbox:{ width:22,height:22,border:'2px solid',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2,transition:'all 0.2s' },
  checkboxDone:{},
  checkMark:{ color:'#fff',fontSize:14,fontWeight:700 },
  taskContent:{ flex:1,minWidth:0 },
  taskTime:{ fontSize:11,fontWeight:700,marginBottom:2 },
  taskText:{ fontSize:13,color:'#222',lineHeight:1.4 },
  taskTextDone:{ textDecoration:'line-through',color:'#999' },
  tagRow:{ display:'flex',flexWrap:'wrap',gap:4,marginTop:5 },
  tag:{ fontSize:10,padding:'2px 7px',borderRadius:12,fontWeight:600 },
  taskActions:{ display:'flex',gap:4,alignItems:'center',flexShrink:0 },
  iconBtn:{ background:'none',border:'none',cursor:'pointer',fontSize:15,padding:'2px',opacity:0.6 },
  dragHandle:{ fontSize:16,color:'#bbb',cursor:'grab',userSelect:'none' },
  editBox:{ padding:'10px 12px',display:'flex',flexDirection:'column',gap:8 },
  editInput:{ padding:'7px 10px',border:'1.5px solid #ddd',borderRadius:8,fontSize:13,outline:'none',width:'100%',boxSizing:'border-box' },
  editTextarea:{ padding:'7px 10px',border:'1.5px solid #ddd',borderRadius:8,fontSize:13,outline:'none',resize:'vertical',width:'100%',boxSizing:'border-box' },
  editTagRow:{ display:'flex',flexWrap:'wrap',gap:5 },
  tagToggle:{ padding:'4px 8px',border:'1.5px solid #ddd',borderRadius:16,fontSize:12,cursor:'pointer',background:'#f5f5f5' },
  editActions:{ display:'flex',gap:8 },
  btnSave:{ padding:'8px 16px',color:'#fff',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',fontSize:13 },
  btnCancel:{ padding:'8px 14px',background:'#eee',color:'#555',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:13 },
  addBox:{ padding:'10px 12px',background:'#f0f7f4',display:'flex',flexDirection:'column',gap:8 },
  addTaskBtn:{ width:'100%',padding:'9px',background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:600,textAlign:'center' },
  resetRow:{ display:'flex',justifyContent:'center',padding:'20px 16px 0' },
  btnReset:{ padding:'9px 18px',background:'#fff',border:'1.5px solid',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:13 },
  celebrateOverlay:{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100 },
  celebrateBox:{ background:'#fff',borderRadius:20,padding:28,textAlign:'center',maxWidth:320,margin:16 },
  celebrateTitle:{ fontSize:22,fontWeight:800,marginBottom:4 },
  celebrateSub:{ fontSize:14,color:'#555',marginBottom:8 },
  celebrateQuote:{ fontSize:13,fontWeight:600,fontStyle:'italic',marginBottom:16,lineHeight:1.5 },
}
