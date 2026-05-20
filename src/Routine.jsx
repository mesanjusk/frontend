import { useState, useEffect, useRef } from 'react'

// ── Data ─────────────────────────────────────────────────────
const AREA_META = {
  '🏥': { label: 'Health',    bg: '#fff0f0', color: '#c62828' },
  '🕉️': { label: 'Spiritual', bg: '#fff0f5', color: '#7b0000' },
  '💼': { label: 'Career',    bg: '#e8eaf6', color: '#1a237e' },
  '💰': { label: 'Money',     bg: '#e0f2f1', color: '#00695c' },
  '❤️': { label: 'Relation',  bg: '#fce4ec', color: '#880e4f' },
  '👨‍👩‍👧': { label: 'Family',   bg: '#ede7f6', color: '#4a148c' },
  '⚡': { label: 'Energy',    bg: '#fff3e0', color: '#e65100' },
  '🧠': { label: 'Focus',     bg: '#e3f2fd', color: '#1565c0' },
  '👥': { label: 'Friends',   bg: '#e8f5e9', color: '#1b5e20' },
}

const INITIAL_TASKS = [
  // MORNING
  { id:1,  section:'🌅 सुबह — Spiritual', time:'5:00 AM', task:'उठें — Phone नहीं छूना',                        tags:['🕉️'],       pinned:false },
  { id:2,  section:'🌅 सुबह — Spiritual', time:'5:02 AM', task:'तांबे के लोटे से पानी — 2 गिलास',              tags:['🏥'],       pinned:false },
  { id:3,  section:'🌅 सुबह — Spiritual', time:'5:05 AM', task:'5 तुलसी के पत्ते खाएं',                       tags:['🏥','🕉️'],  pinned:false },
  { id:4,  section:'🌅 सुबह — Spiritual', time:'5:10 AM', task:"सूर्य दिशा में 5 मिनट मौन",                   tags:['🕉️'],       pinned:false },
  { id:5,  section:'🌅 सुबह — Spiritual', time:'5:15 AM', task:"'ॐ नमः शिवाय' — 21 बार",                      tags:['🕉️','🧠'],  pinned:false },
  { id:6,  section:'🌅 सुबह — Spiritual', time:'5:18 AM', task:"'ॐ गं गणपतये नमः' — 21 बार",                  tags:['🕉️','🧠'],  pinned:false },
  { id:7,  section:'🌅 सुबह — Spiritual', time:'5:22 AM', task:'सूर्य नमस्कार — 12 बार',                      tags:['🏥','⚡'],   pinned:false },
  { id:8,  section:'🌅 सुबह — Spiritual', time:'5:37 AM', task:'अनुलोम विलोम — 10 मिनट',                      tags:['🏥','🧠'],  pinned:false },
  { id:9,  section:'🌅 सुबह — Spiritual', time:'5:47 AM', task:'Morning Walk — 30 मिनट',                      tags:['🏥','⚡'],   pinned:false },
  { id:10, section:'🌅 सुबह — Spiritual', time:'6:20 AM', task:"सूर्य को जल + 'ॐ घृणि सूर्याय नमः' 7 बार",  tags:['🕉️'],       pinned:false },
  { id:11, section:'🌅 सुबह — Spiritual', time:'6:25 AM', task:'तुलसी को पानी + BP Check',                    tags:['🏥','🕉️'],  pinned:false },
  // DEEP WORK
  { id:12, section:'⭐ Deep Work Block',  time:'6:30 AM', task:'नाश्ता — घर का, हल्का, कम नमक',              tags:['🏥'],       pinned:false },
  { id:13, section:'⭐ Deep Work Block',  time:'7:00 AM', task:'DEEP WORK — Phone Silent, Face Down',          tags:['🧠','💼'],  pinned:true  },
  { id:14, section:'⭐ Deep Work Block',  time:'7:00 AM', task:'माही Brand / IT Product / Business Strategy', tags:['💼','👨‍👩‍👧'],  pinned:false },
  { id:15, section:'⭐ Deep Work Block',  time:'8:00 AM', task:'New Ideas — Evaluate करें (शुरू नहीं)',        tags:['💼','🧠'],  pinned:false },
  { id:16, section:'⭐ Deep Work Block',  time:'8:30 AM', task:'Accounts — Strategic Review (30 मिनट)',        tags:['💰'],       pinned:false },
  { id:17, section:'⭐ Deep Work Block',  time:'9:00 AM', task:'Diary — आज के सिर्फ 3 Goals लिखें',           tags:['🧠','💼'],  pinned:false },
  { id:18, section:'⭐ Deep Work Block',  time:'9:45 AM', task:'Office के लिए निकलें',                        tags:['💼'],       pinned:false },
  // OFFICE MORNING
  { id:19, section:'💼 Office — सुबह',   time:'10:30 AM',task:'Staff Briefing + Quality Check',               tags:['💼'],       pinned:false },
  { id:20, section:'💼 Office — सुबह',   time:'10:50 AM',task:'Printing Orders — Review + Priority',          tags:['💼'],       pinned:false },
  { id:21, section:'💼 Office — सुबह',   time:'11:00 AM',task:'Client Calls + Quotations + Follow ups',       tags:['💼','💰'],  pinned:false },
  { id:22, section:'💼 Office — सुबह',   time:'11:45 AM',task:'Digital Marketing — Deep Work 45 मिनट',        tags:['💼','💰'],  pinned:false },
  { id:23, section:'💼 Office — सुबह',   time:'12:15 PM',task:'Email + WhatsApp — Batch में Reply (15 min max)',tags:['💼'],     pinned:false },
  // LUNCH
  { id:24, section:'🍛 Lunch + Rest',    time:'12:30 PM',task:'Lunch — Phone बंद, शांति से, Gratitude',       tags:['🏥','🕉️'],  pinned:false },
  { id:25, section:'🍛 Lunch + Rest',    time:'1:00 PM', task:'Micro Rest — आंखें बंद 15 मिनट',               tags:['🏥','⚡'],   pinned:false },
  { id:26, section:'🍛 Lunch + Rest',    time:'1:15 PM', task:'पानी एक गिलास + 5 मिनट Stretch',              tags:['🏥'],       pinned:false },
  // OFFICE AFTERNOON
  { id:27, section:'🚀 Office — दोपहर', time:'1:15 PM', task:'New Business Development + Client Visits',      tags:['💼','💰'],  pinned:false },
  { id:28, section:'🚀 Office — दोपहर', time:'2:30 PM', task:'माही Brand Content Calendar update',            tags:['💼','👨‍👩‍👧'],  pinned:false },
  { id:29, section:'🚀 Office — दोपहर', time:'2:45 PM', task:'Learning — Business Book 1 Chapter',            tags:['🧠'],       pinned:false },
  { id:30, section:'🚀 Office — दोपहर', time:'4:15 PM', task:"DONE LIST Update — आज क्या Complete हुआ",      tags:['🧠','💼'],  pinned:false },
  { id:31, section:'🚀 Office — दोपहर', time:'4:30 PM', task:'20-20-20 Eye Rule + पानी',                      tags:['🏥'],       pinned:false },
  // OFFICE EVENING
  { id:32, section:'📊 Office — शाम',   time:'5:30 PM', task:'Pending Orders + Quality Final Check',           tags:['💼'],       pinned:false },
  { id:33, section:'📊 Office — शाम',   time:'6:00 PM', task:'Accounts Wrap + Cash Count',                    tags:['💰'],       pinned:false },
  { id:34, section:'📊 Office — शाम',   time:'6:30 PM', task:'Next Day Planning + Staff Handover',             tags:['💼','🧠'],  pinned:false },
  { id:35, section:'📊 Office — शाम',   time:'7:00 PM', task:'⚠️ Team को सौंपें — Office से निकलें (HARD STOP)',tags:['💼'],    pinned:true  },
  // FRIENDS
  { id:36, section:'👥 Friends + Contacts',time:'7:10 PM',task:"1 Close Friend को Call — 'बस याद आया'",       tags:['👥'],       pinned:true  },
  { id:37, section:'👥 Friends + Contacts',time:'7:20 PM',task:'1 Relative को Check in — Weekly rotation',    tags:['❤️'],       pinned:false },
  { id:38, section:'👥 Friends + Contacts',time:'7:30 PM',task:'JCI / Business Network — Quick call',          tags:['💼','👥'],  pinned:false },
  { id:39, section:'👥 Friends + Contacts',time:'7:45 PM',task:'Cafe में दोस्त से मिलें (हफ्ते में 2-3 बार)', tags:['👥'],       pinned:false },
  { id:40, section:'👥 Friends + Contacts',time:'8:15 PM',task:'घर की तरफ निकलें',                            tags:['👨‍👩‍👧'],       pinned:false },
  // FAMILY
  { id:41, section:'👨‍👩‍👧 परिवार Time',    time:'8:30 PM', task:'घर पहुंचें — Fresh हों',                      tags:['🏥'],       pinned:false },
  { id:42, section:'👨‍👩‍👧 परिवार Time',    time:'8:40 PM', task:'बगीचे में पत्नी के साथ — 10 मिनट',            tags:['❤️','👨‍👩‍👧'],  pinned:true  },
  { id:43, section:'👨‍👩‍👧 परिवार Time',    time:'8:50 PM', task:'माही के साथ — 10 मिनट, उनकी बात सुनें',       tags:['👨‍👩‍👧'],       pinned:false },
  { id:44, section:'👨‍👩‍👧 परिवार Time',    time:'9:00 PM', task:'Family Dinner — Phone नहीं, तीनों साथ',       tags:['👨‍👩‍👧','🏥'], pinned:true  },
  { id:45, section:'👨‍👩‍👧 परिवार Time',    time:'9:20 PM', task:'माही का Content देखें + Feedback',             tags:['👨‍👩‍👧','💼'],  pinned:false },
  // WIND DOWN
  { id:46, section:'🕯️ Wind Down',       time:'9:30 PM', task:"दीपक जलाएं + 'ॐ' 7 बार",                      tags:['🕉️','❤️'],  pinned:false },
  { id:47, section:'🕯️ Wind Down',       time:'9:40 PM', task:'Diary — कल के 3 Goals + आज की 3 अच्छी बातें', tags:['🧠','🕉️'],  pinned:true  },
  { id:48, section:'🕯️ Wind Down',       time:'9:55 PM', task:'Phone Silent — Screen Time खत्म',              tags:['🏥'],       pinned:false },
  { id:49, section:'🕯️ Wind Down',       time:'10:00 PM',task:'पत्नी के साथ — 20 मिनट Quality Time',          tags:['❤️'],       pinned:false },
  { id:50, section:'🕯️ Wind Down',       time:'10:30 PM',task:'सोएं — 6.5 घंटे अनिवार्य',                    tags:['🏥'],       pinned:true  },
]

const SECTION_COLORS = {
  '🌅 सुबह — Spiritual': { bg:'#fff5e6', accent:'#d46a10', icon:'🌅' },
  '⭐ Deep Work Block':   { bg:'#e8eaf6', accent:'#1a237e', icon:'⭐' },
  '💼 Office — सुबह':    { bg:'#e3f2fd', accent:'#1565c0', icon:'💼' },
  '🍛 Lunch + Rest':      { bg:'#fff8e1', accent:'#f57f17', icon:'🍛' },
  '🚀 Office — दोपहर':   { bg:'#e0f2f1', accent:'#00695c', icon:'🚀' },
  '📊 Office — शाम':     { bg:'#ede7f6', accent:'#4a148c', icon:'📊' },
  '👥 Friends + Contacts':{ bg:'#e8f5e9', accent:'#1b5e20', icon:'👥' },
  '👨‍👩‍👧 परिवार Time':    { bg:'#fce4ec', accent:'#880e4f', icon:'👨‍👩‍👧' },
  '🕯️ Wind Down':         { bg:'#fbe9e7', accent:'#7b0000', icon:'🕯️' },
}

const STORAGE_KEY = 'sanju_routine_v2'

function loadState() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return JSON.parse(s)
  } catch {}
  return null
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

// ── Main App ─────────────────────────────────────────────────
export default function Routine() {
  const saved = loadState()
  const [tasks, setTasks] = useState(saved?.tasks || INITIAL_TASKS)
  const [done, setDone] = useState(saved?.done || {})
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [editingId, setEditingId] = useState(null)
  const [editDraft, setEditDraft] = useState({})
  const [addingSection, setAddingSection] = useState(null)
  const [newTask, setNewTask] = useState({ time:'', task:'', tags:[] })
  const [view, setView] = useState('today')
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [dragId, setDragId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [searchQ, setSearchQ] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const editRef = useRef(null)

  useEffect(() => { saveState({ tasks, done }) }, [tasks, done])

  const sections = [...new Set(tasks.map(t => t.section))]

  const todayDone = Object.values(done).filter(Boolean).length
  const todayTotal = tasks.length
  const pct = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0

  const toggle = (id) => {
    const newDone = { ...done, [id]: !done[id] }
    setDone(newDone)
    const count = Object.values(newDone).filter(Boolean).length
    if (count === todayTotal) setShowCelebrate(true)
  }

  const startEdit = (t) => {
    setEditingId(t.id)
    setEditDraft({ time: t.time, task: t.task, tags: [...t.tags] })
    setTimeout(() => editRef.current?.focus(), 50)
  }
  const saveEdit = () => {
    setTasks(tasks.map(t => t.id === editingId ? { ...t, ...editDraft } : t))
    setEditingId(null)
  }
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id))
    const nd = { ...done }; delete nd[id]; setDone(nd)
  }

  const addTask = (section) => {
    if (!newTask.task.trim()) return
    const id = Date.now()
    setTasks([...tasks, { id, section, time: newTask.time, task: newTask.task, tags: newTask.tags, pinned: false }])
    setNewTask({ time:'', task:'', tags:[] })
    setAddingSection(null)
  }

  const onDragStart = (id) => setDragId(id)
  const onDragOver = (e, id) => { e.preventDefault(); setDragOverId(id) }
  const onDrop = (targetId) => {
    if (dragId === targetId) return
    const arr = [...tasks]
    const fromIdx = arr.findIndex(t => t.id === dragId)
    const toIdx   = arr.findIndex(t => t.id === targetId)
    const [moved] = arr.splice(fromIdx, 1)
    arr.splice(toIdx, 0, moved)
    setTasks(arr)
    setDragId(null); setDragOverId(null)
  }

  const filterAreas = ['ALL', ...Object.keys(AREA_META)]
  const filtered = tasks.filter(t => {
    const areaOk = activeFilter === 'ALL' || t.tags.includes(activeFilter)
    const searchOk = !searchQ || t.task.toLowerCase().includes(searchQ.toLowerCase()) || t.time.includes(searchQ)
    return areaOk && searchOk
  })

  const resetDay = () => { setDone({}); setConfirmReset(false) }
  const resetAll = () => { setTasks(INITIAL_TASKS); setDone({}); setConfirmReset(false) }

  const secColor = (sec) => SECTION_COLORS[sec] || { bg:'#f9f9f9', accent:'#666', icon:'📋' }

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.headerTitle}>☀️ संजू अहूजा</div>
            <div style={styles.headerSub}>Daily Routine Planner</div>
          </div>
          <div style={styles.progressCircle}>
            <svg width="56" height="56">
              <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"/>
              <circle cx="28" cy="28" r="23" fill="none" stroke="#ffd700" strokeWidth="4"
                strokeDasharray={`${2*Math.PI*23}`}
                strokeDashoffset={`${2*Math.PI*23*(1-pct/100)}`}
                strokeLinecap="round"
                style={{ transform:'rotate(-90deg)', transformOrigin:'28px 28px', transition:'stroke-dashoffset 0.5s' }}/>
              <text x="28" y="33" textAnchor="middle" fill="#ffd700" fontSize="13" fontWeight="bold">{pct}%</text>
            </svg>
          </div>
        </div>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width:`${pct}%` }}/>
        </div>
        <div style={styles.progressText}>{todayDone} / {todayTotal} tasks complete</div>
      </header>

      <nav style={styles.nav}>
        {[['today','📋 आज'],['weekly','📅 Weekly'],['mantras','🕉️ Mantras']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{...styles.navBtn, ...(view===v?styles.navBtnActive:{})}}>
            {l}
          </button>
        ))}
      </nav>

      {view === 'today' && <>
        <div style={styles.toolBar}>
          <input
            placeholder="🔍 Search tasks..."
            value={searchQ}
            onChange={e=>setSearchQ(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterRow}>
          {filterAreas.map(a => (
            <button key={a} onClick={()=>setActiveFilter(a)}
              style={{...styles.filterChip, ...(activeFilter===a ? { background: a==='ALL'?'#d46a10':(AREA_META[a]?.color||'#333'), color:'#fff' } : {})}}>
              {a==='ALL'?'All':a}
            </button>
          ))}
        </div>

        {sections.map(sec => {
          const secTasks = filtered.filter(t => t.section === sec)
          if (!secTasks.length) return null
          const sc = secColor(sec)
          const secDone = secTasks.filter(t=>done[t.id]).length
          return (
            <div key={sec} style={{...styles.section, background:sc.bg}}>
              <div style={{...styles.sectionHeader, borderLeftColor:sc.accent}}>
                <span style={styles.sectionTitle}>{sec}</span>
                <span style={{...styles.sectionBadge, background:sc.accent}}>{secDone}/{secTasks.length}</span>
              </div>

              {secTasks.map(t => (
                <div key={t.id}
                  draggable
                  onDragStart={()=>onDragStart(t.id)}
                  onDragOver={e=>onDragOver(e,t.id)}
                  onDrop={()=>onDrop(t.id)}
                  style={{
                    ...styles.taskCard,
                    ...(done[t.id] ? styles.taskDone : {}),
                    ...(dragOverId===t.id ? styles.taskDragOver : {}),
                    borderLeftColor: sc.accent,
                  }}>

                  {editingId === t.id ? (
                    <div style={styles.editBox}>
                      <input ref={editRef} value={editDraft.time}
                        onChange={e=>setEditDraft({...editDraft,time:e.target.value})}
                        style={styles.editInput} placeholder="Time"/>
                      <textarea value={editDraft.task}
                        onChange={e=>setEditDraft({...editDraft,task:e.target.value})}
                        style={styles.editTextarea} rows={2}/>
                      <div style={styles.editTagRow}>
                        {Object.keys(AREA_META).map(a=>(
                          <button key={a} onClick={()=>{
                            const tags = editDraft.tags.includes(a)
                              ? editDraft.tags.filter(x=>x!==a)
                              : [...editDraft.tags,a]
                            setEditDraft({...editDraft,tags})
                          }} style={{...styles.tagToggle, ...(editDraft.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>
                            {a}
                          </button>
                        ))}
                      </div>
                      <div style={styles.editActions}>
                        <button onClick={saveEdit} style={styles.btnSave}>💾 Save</button>
                        <button onClick={()=>setEditingId(null)} style={styles.btnCancel}>✕ Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.taskRow} onClick={()=>toggle(t.id)}>
                      <div style={{...styles.checkbox, ...(done[t.id]?styles.checkboxDone:{}), borderColor:sc.accent}}>
                        {done[t.id] && <span style={styles.checkMark}>✓</span>}
                      </div>
                      <div style={styles.taskContent}>
                        <div style={styles.taskTime}>{t.time} {t.pinned && '📌'}</div>
                        <div style={{...styles.taskText, ...(done[t.id]?styles.taskTextDone:{})}}>{t.task}</div>
                        <div style={styles.tagRow}>
                          {t.tags.map(tag=>(
                            <span key={tag} style={{...styles.tag, background:AREA_META[tag]?.bg||'#eee', color:AREA_META[tag]?.color||'#666'}}>
                              {tag} {AREA_META[tag]?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div style={styles.taskActions} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>startEdit(t)} style={styles.iconBtn}>✏️</button>
                        <button onClick={()=>deleteTask(t.id)} style={styles.iconBtn}>🗑️</button>
                        <span style={styles.dragHandle}>⠿</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {addingSection===sec ? (
                <div style={styles.addBox}>
                  <input placeholder="Time (e.g. 9:00 AM)" value={newTask.time}
                    onChange={e=>setNewTask({...newTask,time:e.target.value})}
                    style={styles.editInput}/>
                  <input placeholder="Task description..." value={newTask.task}
                    onChange={e=>setNewTask({...newTask,task:e.target.value})}
                    style={styles.editInput} onKeyDown={e=>e.key==='Enter'&&addTask(sec)}/>
                  <div style={styles.editTagRow}>
                    {Object.keys(AREA_META).map(a=>(
                      <button key={a} onClick={()=>{
                        const tags = newTask.tags.includes(a)?newTask.tags.filter(x=>x!==a):[...newTask.tags,a]
                        setNewTask({...newTask,tags})
                      }} style={{...styles.tagToggle,...(newTask.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>
                        {a}
                      </button>
                    ))}
                  </div>
                  <div style={styles.editActions}>
                    <button onClick={()=>addTask(sec)} style={styles.btnSave}>➕ Add</button>
                    <button onClick={()=>setAddingSection(null)} style={styles.btnCancel}>✕</button>
                  </div>
                </div>
              ) : (
                <button onClick={()=>setAddingSection(sec)} style={{...styles.addTaskBtn, color:sc.accent}}>
                  + Add task to this section
                </button>
              )}
            </div>
          )
        })}

        <div style={styles.resetRow}>
          {!confirmReset ? (
            <>
              <button onClick={()=>setConfirmReset('day')} style={styles.btnReset}>🔄 Reset Today</button>
              <button onClick={()=>setConfirmReset('all')} style={styles.btnResetAll}>♻️ Reset All Data</button>
            </>
          ) : (
            <div style={styles.confirmBox}>
              <p>{confirmReset==='day'?'Reset today\'s checkmarks?':'Reset ALL data to default?'}</p>
              <button onClick={confirmReset==='day'?resetDay:resetAll} style={styles.btnSave}>Yes</button>
              <button onClick={()=>setConfirmReset(false)} style={styles.btnCancel}>No</button>
            </div>
          )}
        </div>
      </>}

      {view === 'weekly' && <WeeklyView />}
      {view === 'mantras' && <MantrasView />}

      {showCelebrate && (
        <div style={styles.celebrateOverlay} onClick={()=>setShowCelebrate(false)}>
          <div style={styles.celebrateBox}>
            <div style={styles.celebrateEmoji}>🎉</div>
            <div style={styles.celebrateTitle}>शाबाश Sanju भाई!</div>
            <div style={styles.celebrateSub}>आज का पूरा Routine complete किया!</div>
            <div style={styles.celebrateQuote}>"Empire बनाने का दिमाग है आपमें" 👑</div>
            <button onClick={()=>setShowCelebrate(false)} style={styles.btnSave}>🙏 जय गुरुदेव</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Weekly View ───────────────────────────────────────────────
function WeeklyView() {
  const days = [
    { day:'सोमवार 🌙', focus:'Business Foundation', color:'#1a237e', mantra:"'ॐ सोमाय नमः' 21 बार", remedy:'शिव मंदिर — जल अर्पण', special:'नीला रंग पहनें' },
    { day:'मंगलवार 🔴', focus:'Energy + Health',    color:'#b71c1c', mantra:"'ॐ हनुमते नमः' 21 बार",     remedy:'हनुमान मंदिर + लाल दाल दान', special:'Extra exercise' },
    { day:'बुधवार 💚',  focus:'Money + Digital',    color:'#00695c', mantra:"'ॐ बुं बुधाय नमः' 108 बार",  remedy:'गणेश पूजा — हरे दूर्वा', special:'हरा पन्ना + हरी सब्जी' },
    { day:'गुरुवार 🌕', focus:'Expansion',           color:'#4a148c', mantra:"'ॐ बृं बृहस्पतये नमः' 21 बार",remedy:'पीला रंग पहनें', special:'New clients + माही Brand meeting' },
    { day:'शुक्रवार 💕',focus:'Family + Wealth',     color:'#880e4f', mantra:"'ॐ श्रीं लक्ष्म्यै नमः' 108 बार",remedy:'माँ लक्ष्मी — खीर', special:'Date Night + White/Cream रंग' },
    { day:'शनिवार 🪐',  focus:'Review + Strategy',   color:'#37474f', mantra:"'ॐ शं शनैश्चराय नमः' 108 बार",remedy:'पीपल को तेल + काले तिल दान', special:'Weekly Review + Staff review' },
    { day:'रविवार ☀️',  focus:'REST — SACRED DAY',   color:'#e65100', mantra:"'ॐ घृणि सूर्याय नमः' 7 बार", remedy:'⛔ ZERO WORK', special:'Friends + Family + 9 PM sleep' },
  ]
  return (
    <div style={styles.weeklyWrap}>
      {days.map(d=>(
        <div key={d.day} style={{...styles.dayCard, borderTopColor:d.color}}>
          <div style={{...styles.dayTitle, color:d.color}}>{d.day}</div>
          <div style={styles.dayFocus}>{d.focus}</div>
          <div style={styles.dayRow}><span style={styles.dayLabel}>🕉️ Mantra:</span> {d.mantra}</div>
          <div style={styles.dayRow}><span style={styles.dayLabel}>💎 Remedy:</span> {d.remedy}</div>
          <div style={styles.dayRow}><span style={styles.dayLabel}>⭐ Special:</span> {d.special}</div>
        </div>
      ))}
    </div>
  )
}

// ── Mantras View ─────────────────────────────────────────────
function MantrasView() {
  const mantras = [
    { when:'रोज सुबह', mantra:"'ॐ घृणि सूर्याय नमः' — 7 बार", benefit:'सिंह लग्न + Success', color:'#e65100' },
    { when:'रोज सुबह', mantra:"'ॐ गं गणपतये नमः' — 21 बार",   benefit:'Focus + New Beginnings', color:'#d46a10' },
    { when:'रोज सुबह', mantra:"'ॐ नमः शिवाय' — 21 बार",        benefit:'मन की शांति + Clarity', color:'#7b0000' },
    { when:'बुधवार',   mantra:"'ॐ बुं बुधाय नमः' — 108 बार",   benefit:'बुध महादशा + Business', color:'#00695c' },
    { when:'मंगलवार',  mantra:"'ॐ हनुमते नमः' — 21 बार",        benefit:'Courage + Protection', color:'#b71c1c' },
    { when:'शुक्रवार', mantra:"'ॐ श्रीं लक्ष्म्यै नमः' — 108 बार",benefit:'Money + Family', color:'#880e4f' },
    { when:'शनिवार',   mantra:"'ॐ शं शनैश्चराय नमः' — 108 बार",benefit:'Discipline + Success', color:'#37474f' },
    { when:'रात रोज',  mantra:"'ॐ' — 7 बार (दीपक के सामने)",    benefit:'Inner Peace + Sleep', color:'#4a148c' },
  ]
  const remedies = [
    { day:'रविवार ☀️',  action:'उगते सूर्य को जल — लाल फूल + गुड़', color:'#e65100' },
    { day:'सोमवार 🌙',  action:'शिव मंदिर — जल अर्पण',              color:'#1a237e' },
    { day:'मंगलवार 🔴', action:'हनुमान मंदिर + लाल मसूर दाल दान',   color:'#b71c1c' },
    { day:'बुधवार 💚',  action:'गणेश पूजा + हरा पन्ना + हरी सब्जी', color:'#00695c' },
    { day:'गुरुवार 🌕', action:"'ॐ बृं' + पीला रंग पहनें",           color:'#4a148c' },
    { day:'शुक्रवार 💕',action:'माँ लक्ष्मी — खीर + सफेद रंग',       color:'#880e4f' },
    { day:'शनिवार 🪐',  action:'पीपल को तेल + काले तिल दान',         color:'#37474f' },
  ]
  return (
    <div style={styles.mantrasWrap}>
      <div style={styles.mantraHeader}>🕉️ Daily Mantras</div>
      {mantras.map((m,i)=>(
        <div key={i} style={{...styles.mantraCard, borderLeftColor:m.color}}>
          <div style={{...styles.mantraWhen, color:m.color}}>{m.when}</div>
          <div style={styles.mantraText}>{m.mantra}</div>
          <div style={styles.mantraBenefit}>✨ {m.benefit}</div>
        </div>
      ))}
      <div style={{...styles.mantraHeader, marginTop:20}}>💎 Weekly Remedies</div>
      {remedies.map((r,i)=>(
        <div key={i} style={{...styles.mantraCard, borderLeftColor:r.color}}>
          <div style={{...styles.mantraWhen, color:r.color}}>{r.day}</div>
          <div style={styles.mantraText}>{r.action}</div>
        </div>
      ))}
      <div style={styles.quoteBox}>
        <div style={styles.quoteText}>"Finish करो — Start करना बंद करो</div>
        <div style={styles.quoteText}>आपमें Empire बनाने का दिमाग है" 👑</div>
        <div style={styles.quoteAuthor}>🕉️ ॐ गं गणपतये नमः | जय माँ लक्ष्मी</div>
      </div>
    </div>
  )
}

// ── Styles ───────────────────────────────────────────────────
const styles = {
  root: { fontFamily:"'Noto Sans Devanagari', 'Segoe UI', sans-serif", background:'#f5f0eb', minHeight:'100vh', maxWidth:480, margin:'0 auto', paddingBottom:40 },
  header: { background:'linear-gradient(135deg, #d46a10 0%, #7b0000 100%)', padding:'20px 16px 12px', color:'#fff' },
  headerTop: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  headerTitle: { fontSize:26, fontWeight:700, letterSpacing:0.5 },
  headerSub: { fontSize:15, opacity:0.85, marginTop:2 },
  progressCircle: { flexShrink:0 },
  progressBar: { background:'rgba(255,255,255,0.2)', borderRadius:8, height:7, overflow:'hidden' },
  progressFill: { background:'#ffd700', height:'100%', borderRadius:8, transition:'width 0.4s' },
  progressText: { fontSize:13, opacity:0.85, marginTop:5, textAlign:'right' },
  nav: { display:'flex', background:'#fff', borderBottom:'2px solid #f0e8de', position:'sticky', top:0, zIndex:10 },
  navBtn: { flex:1, padding:'13px 4px', border:'none', background:'transparent', fontSize:15, fontWeight:600, color:'#888', cursor:'pointer' },
  navBtnActive: { color:'#d46a10', borderBottom:'3px solid #d46a10' },
  toolBar: { padding:'10px 12px 4px' },
  searchInput: { width:'100%', padding:'10px 14px', border:'1.5px solid #ddd', borderRadius:10, fontSize:15, outline:'none', boxSizing:'border-box', background:'#fff' },
  filterRow: { display:'flex', gap:6, padding:'6px 12px 10px', overflowX:'auto', scrollbarWidth:'none' },
  filterChip: { padding:'5px 12px', border:'1.5px solid #ddd', borderRadius:20, fontSize:13, background:'#fff', cursor:'pointer', whiteSpace:'nowrap', color:'#555', fontWeight:600 },
  section: { margin:'8px 10px', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  sectionHeader: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', borderLeft:'4px solid', background:'rgba(255,255,255,0.6)' },
  sectionTitle: { fontWeight:700, fontSize:15, color:'#222' },
  sectionBadge: { color:'#fff', borderRadius:12, padding:'3px 9px', fontSize:13, fontWeight:700 },
  taskCard: { background:'#fff', margin:'1px 0', borderLeft:'3px solid transparent', transition:'all 0.2s', cursor:'grab' },
  taskDone: { opacity:0.6, background:'#f9f9f9' },
  taskDragOver: { background:'#fff9f0', boxShadow:'inset 0 0 0 2px #d46a10' },
  taskRow: { display:'flex', alignItems:'flex-start', gap:10, padding:'12px 12px', cursor:'pointer' },
  checkbox: { width:24, height:24, border:'2px solid', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, transition:'all 0.2s' },
  checkboxDone: { background:'#2e7d32' },
  checkMark: { color:'#fff', fontSize:15, fontWeight:700 },
  taskContent: { flex:1, minWidth:0 },
  taskTime: { fontSize:13, color:'#d46a10', fontWeight:700, marginBottom:3 },
  taskText: { fontSize:16, color:'#222', lineHeight:1.5 },
  taskTextDone: { textDecoration:'line-through', color:'#999' },
  tagRow: { display:'flex', flexWrap:'wrap', gap:4, marginTop:6 },
  tag: { fontSize:12, padding:'3px 8px', borderRadius:12, fontWeight:600 },
  taskActions: { display:'flex', gap:4, alignItems:'center', flexShrink:0 },
  iconBtn: { background:'none', border:'none', cursor:'pointer', fontSize:18, padding:'2px', opacity:0.6 },
  dragHandle: { fontSize:18, color:'#bbb', cursor:'grab', userSelect:'none' },
  editBox: { padding:'10px 12px', display:'flex', flexDirection:'column', gap:8 },
  editInput: { padding:'8px 12px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', width:'100%', boxSizing:'border-box' },
  editTextarea: { padding:'8px 12px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', resize:'vertical', width:'100%', boxSizing:'border-box' },
  editTagRow: { display:'flex', flexWrap:'wrap', gap:5 },
  tagToggle: { padding:'5px 10px', border:'1.5px solid #ddd', borderRadius:16, fontSize:14, cursor:'pointer', background:'#f5f5f5' },
  editActions: { display:'flex', gap:8 },
  btnSave: { padding:'10px 18px', background:'#d46a10', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:15 },
  btnCancel: { padding:'10px 16px', background:'#eee', color:'#555', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:15 },
  addBox: { padding:'10px 12px', background:'#fffaf5', display:'flex', flexDirection:'column', gap:8 },
  addTaskBtn: { width:'100%', padding:'11px', background:'none', border:'none', cursor:'pointer', fontSize:15, fontWeight:600, textAlign:'center' },
  resetRow: { display:'flex', gap:10, justifyContent:'center', padding:'20px 16px 0' },
  btnReset: { padding:'10px 20px', background:'#fff', border:'1.5px solid #d46a10', color:'#d46a10', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:15 },
  btnResetAll: { padding:'10px 20px', background:'#fff', border:'1.5px solid #b71c1c', color:'#b71c1c', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:15 },
  confirmBox: { background:'#fff', padding:14, borderRadius:12, textAlign:'center', border:'1.5px solid #ddd', display:'flex', flexDirection:'column', gap:8, alignItems:'center' },
  celebrateOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  celebrateBox: { background:'#fff', borderRadius:20, padding:28, textAlign:'center', maxWidth:320, margin:16 },
  celebrateEmoji: { fontSize:60, marginBottom:8 },
  celebrateTitle: { fontSize:24, fontWeight:800, color:'#d46a10', marginBottom:4 },
  celebrateSub: { fontSize:16, color:'#555', marginBottom:8 },
  celebrateQuote: { fontSize:15, color:'#7b0000', fontWeight:600, fontStyle:'italic', marginBottom:16 },
  weeklyWrap: { padding:'10px 10px 20px' },
  dayCard: { background:'#fff', borderRadius:14, padding:'16px 16px', marginBottom:10, borderTop:'4px solid', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  dayTitle: { fontSize:20, fontWeight:800, marginBottom:4 },
  dayFocus: { fontSize:15, color:'#555', fontWeight:600, marginBottom:8 },
  dayRow: { fontSize:14, color:'#333', marginBottom:5, lineHeight:1.6 },
  dayLabel: { fontWeight:700, color:'#888' },
  mantrasWrap: { padding:'10px 10px 20px' },
  mantraHeader: { fontSize:20, fontWeight:800, color:'#7b0000', textAlign:'center', padding:'10px 0 6px' },
  mantraCard: { background:'#fff', borderRadius:12, padding:'13px 14px', marginBottom:8, borderLeft:'4px solid', boxShadow:'0 1px 5px rgba(0,0,0,0.06)' },
  mantraWhen: { fontSize:14, fontWeight:800, marginBottom:3 },
  mantraText: { fontSize:16, fontWeight:600, color:'#222', marginBottom:4 },
  mantraBenefit: { fontSize:13, color:'#666' },
  quoteBox: { background:'linear-gradient(135deg,#fff9f0,#fff0e0)', border:'2px solid #d46a10', borderRadius:14, padding:18, marginTop:16, textAlign:'center' },
  quoteText: { fontSize:16, fontWeight:700, color:'#7b0000', lineHeight:1.7 },
  quoteAuthor: { fontSize:14, color:'#d46a10', marginTop:8, fontWeight:600 },
}
