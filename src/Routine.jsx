import { useState, useEffect, useRef } from 'react'

// ── Time Utilities
function parseTime(str) {
  if (!str) return 0
  const m = str.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  let h = +m[1], mn = +m[2]
  if (m[3].toUpperCase() === 'PM' && h !== 12) h += 12
  if (m[3].toUpperCase() === 'AM' && h === 12) h = 0
  return h * 60 + mn
}
function fmtTime(total) {
  total = ((Math.round(total) % 1440) + 1440) % 1440
  const h24 = Math.floor(total / 60), mn = total % 60
  const p = h24 >= 12 ? 'PM' : 'AM'
  const h = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
  return `${h}:${mn.toString().padStart(2,'0')} ${p}`
}
function to24(str) {
  const t = parseTime(str)
  return `${Math.floor(t/60).toString().padStart(2,'0')}:${(t%60).toString().padStart(2,'0')}`
}
function from24(str) {
  if (!str) return ''
  const [h, m] = str.split(':').map(Number)
  return fmtTime(h * 60 + m)
}

// ── Data
const AREA_META = {
  '🏥': { label:'Health',    bg:'#fff0f0', color:'#c62828' },
  '🕉️': { label:'Spiritual', bg:'#fff0f5', color:'#7b0000' },
  '💼': { label:'Career',    bg:'#e8eaf6', color:'#1a237e' },
  '💰': { label:'Money',     bg:'#e0f2f1', color:'#00695c' },
  '❤️': { label:'Relation',  bg:'#fce4ec', color:'#880e4f' },
  '👨‍👩‍👧': { label:'Family',   bg:'#ede7f6', color:'#4a148c' },
  '⚡': { label:'Energy',    bg:'#fff3e0', color:'#e65100' },
  '🧠': { label:'Focus',     bg:'#e3f2fd', color:'#1565c0' },
  '👥': { label:'Friends',   bg:'#e8f5e9', color:'#1b5e20' },
}

const IT = [
  { id:1,  sec:'🌅 सुबह — Spiritual', time:'5:00 AM', task:'उठें — Phone नहीं छूना',                        tags:['🕉️'],        pinned:false, skippable:false },
  { id:2,  sec:'🌅 सुबह — Spiritual', time:'5:02 AM', task:'तांबे के लोटे से पानी — 2 गिलास',              tags:['🏥'],        pinned:false, skippable:false },
  { id:3,  sec:'🌅 सुबह — Spiritual', time:'5:05 AM', task:'5 तुलसी के पत्ते खाएं',                       tags:['🏥','🕉️'],  pinned:false, skippable:true  },
  { id:4,  sec:'🌅 सुबह — Spiritual', time:'5:10 AM', task:'सूर्य दिशा में 5 मिनट मौन',                   tags:['🕉️'],        pinned:false, skippable:true  },
  { id:5,  sec:'🌅 सुबह — Spiritual', time:'5:15 AM', task:"'ॐ नमः शिवाय' — 21 बार",                      tags:['🕉️','🧠'],  pinned:false, skippable:true  },
  { id:6,  sec:'🌅 सुबह — Spiritual', time:'5:18 AM', task:"'ॐ गं गणपतये नमः' — 21 बार",                  tags:['🕉️','🧠'],  pinned:false, skippable:true  },
  { id:7,  sec:'🌅 सुबह — Spiritual', time:'5:22 AM', task:'सूर्य नमस्कार — 12 बार',                      tags:['🏥','⚡'],    pinned:false, skippable:true  },
  { id:8,  sec:'🌅 सुबह — Spiritual', time:'5:37 AM', task:'अनुलोम विलोम — 10 मिनट',                      tags:['🏥','🧠'],  pinned:false, skippable:true  },
  { id:9,  sec:'🌅 सुबह — Spiritual', time:'5:47 AM', task:'Morning Walk — 30 मिनट',                      tags:['🏥','⚡'],    pinned:false, skippable:true  },
  { id:10, sec:'🌅 सुबह — Spiritual', time:'6:20 AM', task:"सूर्य को जल + 'ॐ घृणि सूर्याय नमः' 7 बार",  tags:['🕉️'],        pinned:false, skippable:true  },
  { id:11, sec:'🌅 सुबह — Spiritual', time:'6:25 AM', task:'तुलसी को पानी + BP Check',                    tags:['🏥','🕉️'],  pinned:false, skippable:false },
  { id:12, sec:'⭐ Deep Work Block',  time:'6:30 AM', task:'नाश्ता — घर का, हल्का, कम नमक',              tags:['🏥'],        pinned:false, skippable:false },
  { id:13, sec:'⭐ Deep Work Block',  time:'7:00 AM', task:'DEEP WORK — Phone Silent, Face Down',          tags:['🧠','💼'],  pinned:true,  skippable:false },
  { id:14, sec:'⭐ Deep Work Block',  time:'7:00 AM', task:'माही Brand / IT Product / Business Strategy', tags:['💼','👨‍👩‍👧'],  pinned:false, skippable:true  },
  { id:15, sec:'⭐ Deep Work Block',  time:'8:00 AM', task:'New Ideas — Evaluate करें (शुरू नहीं)',        tags:['💼','🧠'],  pinned:false, skippable:true  },
  { id:16, sec:'⭐ Deep Work Block',  time:'8:30 AM', task:'Accounts — Strategic Review (30 मिनट)',        tags:['💰'],        pinned:false, skippable:true  },
  { id:17, sec:'⭐ Deep Work Block',  time:'9:00 AM', task:'Diary — आज के सिर्फ 3 Goals लिखें',           tags:['🧠','💼'],  pinned:false, skippable:true  },
  { id:18, sec:'⭐ Deep Work Block',  time:'9:45 AM', task:'Office के लिए निकलें',                        tags:['💼'],        pinned:false, skippable:false },
  { id:19, sec:'💼 Office — सुबह',   time:'10:30 AM',task:'Staff Briefing + Quality Check',               tags:['💼'],        pinned:false, skippable:true  },
  { id:20, sec:'💼 Office — सुबह',   time:'10:50 AM',task:'Printing Orders — Review + Priority',          tags:['💼'],        pinned:false, skippable:true  },
  { id:21, sec:'💼 Office — सुबह',   time:'11:00 AM',task:'Client Calls + Quotations + Follow ups',       tags:['💼','💰'],  pinned:false, skippable:true  },
  { id:22, sec:'💼 Office — सुबह',   time:'11:45 AM',task:'Digital Marketing — Deep Work 45 मिनट',        tags:['💼','💰'],  pinned:false, skippable:true  },
  { id:23, sec:'💼 Office — सुबह',   time:'12:15 PM',task:'Email + WhatsApp — Batch में Reply (15 min max)',tags:['💼'],      pinned:false, skippable:true  },
  { id:24, sec:'🍛 Lunch + Rest',    time:'12:30 PM',task:'Lunch — Phone बंद, शांति से, Gratitude',       tags:['🏥','🕉️'],  pinned:false, skippable:false },
  { id:25, sec:'🍛 Lunch + Rest',    time:'1:00 PM', task:'Micro Rest — आंखें बंद 15 मिनट',               tags:['🏥','⚡'],    pinned:false, skippable:true  },
  { id:26, sec:'🍛 Lunch + Rest',    time:'1:15 PM', task:'पानी एक गिलास + 5 मिनट Stretch',              tags:['🏥'],        pinned:false, skippable:false },
  { id:27, sec:'🚀 Office — दोपहर', time:'1:20 PM', task:'New Business Development + Client Visits',      tags:['💼','💰'],  pinned:false, skippable:true  },
  { id:28, sec:'🚀 Office — दोपहर', time:'2:30 PM', task:'माही Brand Content Calendar update',            tags:['💼','👨‍👩‍👧'],  pinned:false, skippable:true  },
  { id:29, sec:'🚀 Office — दोपहर', time:'2:45 PM', task:'Learning — Business Book 1 Chapter',            tags:['🧠'],        pinned:false, skippable:true  },
  { id:30, sec:'🚀 Office — दोपहर', time:'4:15 PM', task:'DONE LIST Update — आज क्या Complete हुआ',      tags:['🧠','💼'],  pinned:false, skippable:true  },
  { id:31, sec:'🚀 Office — दोपहर', time:'4:30 PM', task:'20-20-20 Eye Rule + पानी',                      tags:['🏥'],        pinned:false, skippable:false },
  { id:32, sec:'📊 Office — शाम',   time:'5:30 PM', task:'Pending Orders + Quality Final Check',           tags:['💼'],        pinned:false, skippable:true  },
  { id:33, sec:'📊 Office — शाम',   time:'6:00 PM', task:'Accounts Wrap + Cash Count',                    tags:['💰'],        pinned:false, skippable:true  },
  { id:34, sec:'📊 Office — शाम',   time:'6:30 PM', task:'Next Day Planning + Staff Handover',             tags:['💼','🧠'],  pinned:false, skippable:true  },
  { id:35, sec:'📊 Office — शाम',   time:'7:00 PM', task:'⚠️ Team को सौंपें — Office से निकलें (HARD STOP)', tags:['💼'],     pinned:true,  skippable:false },
  { id:36, sec:'👥 Friends + Contacts',time:'7:10 PM',task:"1 Close Friend को Call — 'बस याद आया'",       tags:['👥'],        pinned:true,  skippable:false },
  { id:37, sec:'👥 Friends + Contacts',time:'7:20 PM',task:'1 Relative को Check in — Weekly rotation',    tags:['❤️'],        pinned:false, skippable:true  },
  { id:38, sec:'👥 Friends + Contacts',time:'7:30 PM',task:'JCI / Business Network — Quick call',          tags:['💼','👥'],  pinned:false, skippable:true  },
  { id:39, sec:'👥 Friends + Contacts',time:'7:45 PM',task:'Cafe में दोस्त से मिलें (हफ्ते में 2-3 बार)', tags:['👥'],        pinned:false, skippable:true  },
  { id:40, sec:'👥 Friends + Contacts',time:'8:15 PM',task:'घर की तरफ निकलें',                            tags:['👨‍👩‍👧'],        pinned:false, skippable:true  },
  { id:41, sec:'👨‍👩‍👧 परिवार Time',    time:'8:30 PM', task:'घर पहुंचें — Fresh हों',                      tags:['🏥'],        pinned:false, skippable:false },
  { id:42, sec:'👨‍👩‍👧 परिवार Time',    time:'8:40 PM', task:'बगीचे में पत्नी के साथ — 10 मिनट',            tags:['❤️','👨‍👩‍👧'],  pinned:true,  skippable:false },
  { id:43, sec:'👨‍👩‍👧 परिवार Time',    time:'8:50 PM', task:'माही के साथ — 10 मिनट, उनकी बात सुनें',       tags:['👨‍👩‍👧'],        pinned:false, skippable:true  },
  { id:44, sec:'👨‍👩‍👧 परिवार Time',    time:'9:00 PM', task:'Family Dinner — Phone नहीं, तीनों साथ',       tags:['👨‍👩‍👧','🏥'], pinned:true,  skippable:false },
  { id:45, sec:'👨‍👩‍👧 परिवार Time',    time:'9:20 PM', task:'माही का Content देखें + Feedback',             tags:['👨‍👩‍👧','💼'],  pinned:false, skippable:true  },
  { id:46, sec:'🕯️ Wind Down',       time:'9:30 PM', task:"दीपक जलाएं + 'ॐ' 7 बार",                      tags:['🕉️','❤️'],  pinned:false, skippable:true  },
  { id:47, sec:'🕯️ Wind Down',       time:'9:40 PM', task:'Diary — कल के 3 Goals + आज की 3 अज्जी बातें', tags:['🧠','🕉️'],  pinned:true,  skippable:false },
  { id:48, sec:'🕯️ Wind Down',       time:'9:55 PM', task:'Phone Silent — Screen Time खत्म',              tags:['🏥'],        pinned:false, skippable:true  },
  { id:49, sec:'🕯️ Wind Down',       time:'10:00 PM',task:'पत्नी के साथ — 20 मिनट Quality Time',          tags:['❤️'],        pinned:false, skippable:true  },
  { id:50, sec:'🕯️ Wind Down',       time:'10:30 PM',task:'सोएं — 6.5 घंटे अनिवार्य',                    tags:['🏥'],        pinned:true,  skippable:false },
]
const INITIAL_TASKS = IT.map(t => ({ ...t, section: t.sec }))

const SECTION_COLORS = {
  '🌅 सुबह — Spiritual': { bg:'#fff5e6', accent:'#d46a10' },
  '⭐ Deep Work Block':   { bg:'#e8eaf6', accent:'#1a237e' },
  '💼 Office — सुबह':    { bg:'#e3f2fd', accent:'#1565c0' },
  '🍛 Lunch + Rest':      { bg:'#fff8e1', accent:'#f57f17' },
  '🚀 Office — दोपहर':   { bg:'#e0f2f1', accent:'#00695c' },
  '📊 Office — शाम':     { bg:'#ede7f6', accent:'#4a148c' },
  '👥 Friends + Contacts':{ bg:'#e8f5e9', accent:'#1b5e20' },
  '👨‍👩‍👧 परिवार Time': { bg:'#fce4ec', accent:'#880e4f' },
  '🕯️ Wind Down':   { bg:'#fbe9e7', accent:'#7b0000' },
}

const STORAGE_KEY = 'sanju_routine_v2'
const DEF_SETTINGS = { dayStart:'5:00 AM', dayEnd:'10:30 PM', actualStart:'' }

function loadState() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s) } catch {}
  return null
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

export default function Routine() {
  const saved = loadState()
  const [tasks, setTasks] = useState(() =>
    (saved?.tasks || INITIAL_TASKS).map(t => ({ ...t, skippable: t.skippable !== undefined ? t.skippable : !t.pinned }))
  )
  const [done, setDone]         = useState(saved?.done     || {})
  const [settings, setSettings] = useState(saved?.settings || DEF_SETTINGS)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [editingId,  setEditingId]  = useState(null)
  const [editDraft,  setEditDraft]  = useState({})
  const [addingSection, setAddingSection] = useState(null)
  const [newTask, setNewTask] = useState({ time:'', task:'', tags:[], skippable:true })
  const [view, setView]             = useState('today')
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [dragId,    setDragId]    = useState(null)
  const [dragOverId,setDragOverId]= useState(null)
  const [searchQ,   setSearchQ]   = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [selected,   setSelected]   = useState(new Set())
  const [mergeForm,  setMergeForm]  = useState(null)
  const editRef = useRef(null)

  useEffect(() => { saveState({ tasks, done, settings }) }, [tasks, done, settings])

  const sections   = [...new Set(tasks.map(t => t.section))]
  const todayDone  = Object.values(done).filter(Boolean).length
  const todayTotal = tasks.length
  const pct        = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0

  // Late-start helpers
  const actualMins = parseTime(settings.actualStart)
  const isLate     = !!settings.actualStart
  const getStatus  = t => {
    if (!isLate) return 'normal'
    return parseTime(t.time) < actualMins ? (t.skippable ? 'skipped' : 'missed') : 'normal'
  }
  const missedCount  = tasks.filter(t => getStatus(t) === 'missed').length
  const skippedCount = tasks.filter(t => getStatus(t) === 'skipped').length

  // Toggle done / select
  const toggle = id => {
    if (selectMode) {
      setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
      return
    }
    const nd = { ...done, [id]: !done[id] }
    setDone(nd)
    if (Object.values(nd).filter(Boolean).length === todayTotal) setShowCelebrate(true)
  }

  const startEdit = t => {
    setEditingId(t.id)
    setEditDraft({ time:t.time, task:t.task, tags:[...t.tags], skippable: t.skippable !== false })
    setTimeout(() => editRef.current?.focus(), 50)
  }
  const saveEdit = () => {
    setTasks(tasks.map(t => t.id === editingId ? { ...t, ...editDraft } : t))
    setEditingId(null)
  }
  const deleteTask = id => {
    setTasks(tasks.filter(t => t.id !== id))
    const nd = { ...done }; delete nd[id]; setDone(nd)
  }
  const addTask = section => {
    if (!newTask.task.trim()) return
    const id = Date.now()
    setTasks([...tasks, { id, section, ...newTask, pinned:false }])
    setNewTask({ time:'', task:'', tags:[], skippable:true })
    setAddingSection(null)
  }

  // Drag & drop with time recalculation
  const onDragStart = id => setDragId(id)
  const onDragOver  = (e, id) => { e.preventDefault(); setDragOverId(id) }
  const onDrop = targetId => {
    if (dragId === targetId) return
    const arr  = [...tasks]
    const durs = arr.map((t, i) => {
      if (i === arr.length - 1) return 15
      const d = parseTime(arr[i+1].time) - parseTime(t.time)
      return (d > 0 && d <= 180) ? d : 15
    })
    const fi = arr.findIndex(t => t.id === dragId)
    const ti = arr.findIndex(t => t.id === targetId)
    const [mt] = arr.splice(fi, 1)
    const [md] = durs.splice(fi, 1)
    arr.splice(ti, 0, mt)
    durs.splice(ti, 0, md)
    let cursor = parseTime(settings.dayStart)
    setTasks(arr.map((t, i) => { const time = fmtTime(cursor); cursor += durs[i]; return { ...t, time } }))
    setDragId(null); setDragOverId(null)
  }

  // Rescale all tasks when day start/end changes
  const applySchedule = (newStart, newEnd) => {
    const oS = parseTime(settings.dayStart), oE = parseTime(settings.dayEnd)
    const nS = parseTime(newStart || settings.dayStart), nE = parseTime(newEnd || settings.dayEnd)
    const oR = oE - oS, nR = nE - nS
    if (oR > 0 && nR > 0) {
      setTasks(prev => prev.map(t => {
        const ratio = Math.max(0, Math.min(1, (parseTime(t.time) - oS) / oR))
        return { ...t, time: fmtTime(Math.round(nS + ratio * nR)) }
      }))
    }
    setSettings(s => ({ ...s, ...(newStart ? { dayStart: newStart } : {}), ...(newEnd ? { dayEnd: newEnd } : {}) }))
  }

  // Auto-skip skippable tasks before actualStart
  const autoSkip = () => {
    const nd = { ...done }
    tasks.forEach(t => { if (parseTime(t.time) < actualMins && t.skippable) nd[t.id] = true })
    setDone(nd)
  }

  // Merge
  const openMerge = () => {
    const sel = tasks.filter(t => selected.has(t.id)).sort((a,b) => parseTime(a.time)-parseTime(b.time))
    if (sel.length < 2) return
    setMergeForm({ task: sel[0].task, time: sel[0].time, tags:[...new Set(sel.flatMap(t=>t.tags))], skippable: sel.some(t=>t.skippable) })
  }
  const doMerge = () => {
    if (!mergeForm?.task?.trim()) return
    const insertIdx = tasks.findIndex(t => selected.has(t.id))
    const section   = tasks[insertIdx]?.section || sections[0]
    const rest      = tasks.filter(t => !selected.has(t.id))
    rest.splice(insertIdx, 0, { id: Date.now(), section, ...mergeForm, pinned:false })
    setTasks(rest)
    const nd = { ...done }; selected.forEach(id => delete nd[id]); setDone(nd)
    setSelected(new Set()); setSelectMode(false); setMergeForm(null)
  }

  const resetDay = () => { setDone({}); setConfirmReset(false) }
  const resetAll = () => { setTasks(INITIAL_TASKS); setDone({}); setSettings(DEF_SETTINGS); setConfirmReset(false) }
  const sc = sec => SECTION_COLORS[sec] || { bg:'#f9f9f9', accent:'#666' }

  const filterAreas = ['ALL', ...Object.keys(AREA_META)]
  const filtered = tasks.filter(t => {
    const aOk = activeFilter === 'ALL' || t.tags.includes(activeFilter)
    const sOk = !searchQ || t.task.toLowerCase().includes(searchQ.toLowerCase()) || t.time.includes(searchQ)
    return aOk && sOk
  })

  return (
    <div style={S.root}>
      {/* Header */}
      <header style={S.header}>
        <div style={S.headerTop}>
          <div>
            <div style={S.headerTitle}>☀️ संजू अहूजा</div>
            <div style={S.headerSub}>Daily Routine Planner</div>
          </div>
          <div style={S.progressCircle}>
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
        <div style={S.progressBar}><div style={{ ...S.progressFill, width:`${pct}%` }}/></div>
        <div style={S.progressText}>{todayDone} / {todayTotal} tasks complete</div>
      </header>

      {/* Nav */}
      <nav style={S.nav}>
        {[['today','📋 आज'],['weekly','📅 Weekly'],['mantras','🕉️ Mantras']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{...S.navBtn,...(view===v?S.navActive:{})}}>{l}</button>
        ))}
      </nav>

      {view==='today' && <>
        {/* Schedule Settings */}
        <div style={S.setWrap}>
          <button onClick={()=>setShowSettings(!showSettings)} style={S.setToggle}>
            <span>⚙️ Schedule</span>
            {isLate && <span style={S.latePill}>⏰ Late Mode</span>}
            <span style={{marginLeft:'auto'}}>{showSettings?'▲':'▼'}</span>
          </button>
          {showSettings && (
            <div style={S.setPanel}>
              <div style={S.setRow}>
                <div style={S.setBox}>
                  <div style={S.setLabel}>🌅 Day Start</div>
                  <input type="time" value={to24(settings.dayStart)}
                    onChange={e=>applySchedule(from24(e.target.value), null)} style={S.tInput}/>
                </div>
                <div style={S.setBox}>
                  <div style={S.setLabel}>🌙 Day End</div>
                  <input type="time" value={to24(settings.dayEnd)}
                    onChange={e=>applySchedule(null, from24(e.target.value))} style={S.tInput}/>
                </div>
              </div>
              <div style={S.setLabel}>⏰ Actual Wake-up (if you woke up late)</div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginTop:4}}>
                <input type="time"
                  value={settings.actualStart ? to24(settings.actualStart) : ''}
                  onChange={e=>setSettings(s=>({...s, actualStart: e.target.value ? from24(e.target.value) : ''}))}
                  style={{...S.tInput, flex:1}}/>
                {settings.actualStart && (
                  <button onClick={()=>setSettings(s=>({...s,actualStart:''}))} style={S.clearBtn}>✕ Clear</button>
                )}
              </div>
              {isLate && (
                <div style={S.lateInfo}>
                  <span style={S.missedPill}>⚠️ {missedCount} MISSED (Required)</span>
                  <span style={S.skippedPill}>⏭️ {skippedCount} SKIPPED (Flexible)</span>
                  <button onClick={autoSkip} style={S.autoSkipBtn}>⏭️ Auto-skip all flexible</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div style={S.toolBar}>
          <input placeholder="🔍 Search tasks..." value={searchQ}
            onChange={e=>setSearchQ(e.target.value)} style={S.searchInput}/>
          <button
            onClick={()=>{ setSelectMode(!selectMode); setSelected(new Set()); setMergeForm(null) }}
            style={{...S.selBtn,...(selectMode?S.selBtnOn:{})}}>
            {selectMode ? '✕ Cancel' : '⋈ Merge'}
          </button>
        </div>

        {/* Merge action bar */}
        {selectMode && selected.size >= 2 && !mergeForm && (
          <div style={S.mergeBanner}>
            <span style={{fontWeight:700,color:'#d46a10'}}>{selected.size} tasks selected</span>
            <button onClick={openMerge} style={S.btnSave}>⊕ Merge into one</button>
          </div>
        )}

        {/* Merge form */}
        {mergeForm && (
          <div style={S.mergeForm}>
            <div style={S.mergeTitle}>⊕ Merge {selected.size} tasks into one</div>
            <input value={mergeForm.task} onChange={e=>setMergeForm({...mergeForm,task:e.target.value})}
              style={S.editInput} placeholder="Combined task name..."/>
            <input type="time" value={to24(mergeForm.time)}
              onChange={e=>setMergeForm({...mergeForm,time:from24(e.target.value)})} style={S.tInput}/>
            <div style={S.editTagRow}>
              {Object.keys(AREA_META).map(a=>(
                <button key={a} onClick={()=>{
                  const tags = mergeForm.tags.includes(a)?mergeForm.tags.filter(x=>x!==a):[...mergeForm.tags,a]
                  setMergeForm({...mergeForm,tags})
                }} style={{...S.tagToggle,...(mergeForm.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>{a}</button>
              ))}
            </div>
            <button onClick={()=>setMergeForm({...mergeForm,skippable:!mergeForm.skippable})}
              style={{...S.skipToggle,...(!mergeForm.skippable?S.skipRequired:{})}}>
              {mergeForm.skippable?'⏭️ Skippable':'⛔ Required'}
            </button>
            <div style={S.editActions}>
              <button onClick={doMerge} style={S.btnSave}>⊕ Merge</button>
              <button onClick={()=>{setMergeForm(null);setSelected(new Set());setSelectMode(false)}} style={S.btnCancel}>✕ Cancel</button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={S.filterRow}>
          {filterAreas.map(a=>(
            <button key={a} onClick={()=>setActiveFilter(a)}
              style={{...S.filterChip,...(activeFilter===a?{background:a==='ALL'?'#d46a10':(AREA_META[a]?.color||'#333'),color:'#fff'}:{})}}>
              {a==='ALL'?'All':a}
            </button>
          ))}
        </div>

        {/* Task sections */}
        {sections.map(sec=>{
          const secTasks = filtered.filter(t=>t.section===sec)
          if (!secTasks.length) return null
          const c = sc(sec)
          const secDone = secTasks.filter(t=>done[t.id]).length
          return (
            <div key={sec} style={{...S.section,background:c.bg}}>
              <div style={{...S.secHeader,borderLeftColor:c.accent}}>
                <span style={S.secTitle}>{sec}</span>
                <span style={{...S.secBadge,background:c.accent}}>{secDone}/{secTasks.length}</span>
              </div>
              {secTasks.map(t=>{
                const status = getStatus(t)
                const isSel  = selected.has(t.id)
                return (
                  <div key={t.id} draggable={!selectMode}
                    onDragStart={()=>onDragStart(t.id)}
                    onDragOver={e=>onDragOver(e,t.id)}
                    onDrop={()=>onDrop(t.id)}
                    style={{
                      ...S.taskCard,
                      ...(done[t.id]?S.taskDone:{}),
                      ...(status==='skipped'?S.taskSkipped:{}),
                      ...(status==='missed'?S.taskMissed:{}),
                      ...(dragOverId===t.id?S.taskDragOver:{}),
                      ...(isSel?S.taskSelected:{}),
                      borderLeftColor: status==='missed'?'#b71c1c':c.accent,
                    }}>
                    {editingId===t.id ? (
                      <div style={S.editBox}>
                        <input ref={editRef} value={editDraft.time}
                          onChange={e=>setEditDraft({...editDraft,time:e.target.value})}
                          style={S.editInput} placeholder="Time"/>
                        <textarea value={editDraft.task}
                          onChange={e=>setEditDraft({...editDraft,task:e.target.value})}
                          style={S.editTextarea} rows={2}/>
                        <div style={S.editTagRow}>
                          {Object.keys(AREA_META).map(a=>(
                            <button key={a} onClick={()=>{
                              const tags = editDraft.tags.includes(a)?editDraft.tags.filter(x=>x!==a):[...editDraft.tags,a]
                              setEditDraft({...editDraft,tags})
                            }} style={{...S.tagToggle,...(editDraft.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>{a}</button>
                          ))}
                        </div>
                        <button onClick={()=>setEditDraft({...editDraft,skippable:!editDraft.skippable})}
                          style={{...S.skipToggle,...(!editDraft.skippable?S.skipRequired:{})}}>
                          {editDraft.skippable?'⏭️ Skippable (tap to make Required)':'⛔ Required (tap to make Skippable)'}
                        </button>
                        <div style={S.editActions}>
                          <button onClick={saveEdit} style={S.btnSave}>💾 Save</button>
                          <button onClick={()=>setEditingId(null)} style={S.btnCancel}>✕</button>
                        </div>
                      </div>
                    ) : (
                      <div style={S.taskRow} onClick={()=>toggle(t.id)}>
                        <div style={{...S.checkbox,...((selectMode?isSel:done[t.id])?S.cbDone:{}),borderColor:c.accent}}>
                          {(selectMode?isSel:done[t.id]) && <span style={S.checkMark}>✓</span>}
                        </div>
                        <div style={S.taskContent}>
                          <div style={S.taskTime}>
                            {t.time} {t.pinned&&'📌'}
                            {!t.skippable && <span style={S.reqDot}>⛔</span>}
                            {status==='missed'  && <span style={S.missedBadge}>MISSED</span>}
                            {status==='skipped' && <span style={S.skippedBadge}>⏭️ SKIP</span>}
                          </div>
                          <div style={{...S.taskText,...((done[t.id]||status==='skipped')?S.taskStrike:{})}}>{t.task}</div>
                          <div style={S.tagRow}>
                            {t.tags.map(tag=>(
                              <span key={tag} style={{...S.tag,background:AREA_META[tag]?.bg||'#eee',color:AREA_META[tag]?.color||'#666'}}>
                                {tag} {AREA_META[tag]?.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        {!selectMode && (
                          <div style={S.taskActions} onClick={e=>e.stopPropagation()}>
                            <button onClick={()=>startEdit(t)} style={S.iconBtn}>✏️</button>
                            <button onClick={()=>deleteTask(t.id)} style={S.iconBtn}>🗑️</button>
                            <span style={S.dragHandle}>⠿</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              {!selectMode && (
                addingSection===sec ? (
                  <div style={S.addBox}>
                    <input placeholder="Time (e.g. 9:00 AM)" value={newTask.time}
                      onChange={e=>setNewTask({...newTask,time:e.target.value})} style={S.editInput}/>
                    <input placeholder="Task description..." value={newTask.task}
                      onChange={e=>setNewTask({...newTask,task:e.target.value})}
                      style={S.editInput} onKeyDown={e=>e.key==='Enter'&&addTask(sec)}/>
                    <div style={S.editTagRow}>
                      {Object.keys(AREA_META).map(a=>(
                        <button key={a} onClick={()=>{
                          const tags=newTask.tags.includes(a)?newTask.tags.filter(x=>x!==a):[...newTask.tags,a]
                          setNewTask({...newTask,tags})
                        }} style={{...S.tagToggle,...(newTask.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>{a}</button>
                      ))}
                    </div>
                    <button onClick={()=>setNewTask({...newTask,skippable:!newTask.skippable})}
                      style={{...S.skipToggle,...(!newTask.skippable?S.skipRequired:{})}}>
                      {newTask.skippable?'⏭️ Skippable':'⛔ Required'}
                    </button>
                    <div style={S.editActions}>
                      <button onClick={()=>addTask(sec)} style={S.btnSave}>➕ Add</button>
                      <button onClick={()=>setAddingSection(null)} style={S.btnCancel}>✕</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>setAddingSection(sec)} style={{...S.addTaskBtn,color:c.accent}}>+ Add task</button>
                )
              )}
            </div>
          )
        })}

        <div style={S.resetRow}>
          {!confirmReset ? (
            <>
              <button onClick={()=>setConfirmReset('day')} style={S.btnReset}>🔄 Reset Today</button>
              <button onClick={()=>setConfirmReset('all')} style={S.btnResetAll}>♻️ Reset All</button>
            </>
          ) : (
            <div style={S.confirmBox}>
              <p>{confirmReset==='day'?'Reset checkmarks?':'Reset ALL data?'}</p>
              <button onClick={confirmReset==='day'?resetDay:resetAll} style={S.btnSave}>Yes</button>
              <button onClick={()=>setConfirmReset(false)} style={S.btnCancel}>No</button>
            </div>
          )}
        </div>
      </>}

      {view==='weekly'  && <WeeklyView />}
      {view==='mantras' && <MantrasView />}

      {showCelebrate && (
        <div style={S.celebOverlay} onClick={()=>setShowCelebrate(false)}>
          <div style={S.celebBox}>
            <div style={{fontSize:60,marginBottom:8}}>🎉</div>
            <div style={S.celebTitle}>शाबाश Sanju भाई!</div>
            <div style={{fontSize:16,color:'#555',marginBottom:8}}>आज का पूरा Routine complete!</div>
            <div style={{fontSize:15,color:'#7b0000',fontWeight:600,fontStyle:'italic',marginBottom:16}}>"Empire बनाने का दिमाग है आपमें" 👑</div>
            <button onClick={()=>setShowCelebrate(false)} style={S.btnSave}>🙏 जय गुरुदेव</button>
          </div>
        </div>
      )}
    </div>
  )
}

function WeeklyView() {
  const days = [
    { day:'सोमवार 🌙', focus:'Business Foundation', color:'#1a237e', mantra:"'ॐ सोमाय नमः' 21 बार", remedy:'शिव मंदिर — जल अर्पण', special:'नीला रंग पहनें' },
    { day:'मंगलवार 🔴', focus:'Energy + Health',    color:'#b71c1c', mantra:"'ॐ हनुमते नमः' 21 बार",     remedy:'हनुमान मंदिर + लाल दाल दान', special:'Extra exercise' },
    { day:'बुधवार 💚',  focus:'Money + Digital',    color:'#00695c', mantra:"'ॐ बुं बुधाय नमः' 108 बार",  remedy:'गणेश पूजा — हरे दूर्वा', special:'हरा पन्ना + हरी सब्जी' },
    { day:'गुरुवार 🌕', focus:'Expansion',           color:'#4a148c', mantra:"'ॐ बृं बृहस्पतये नमः' 21 बार",remedy:'पीला रंग पहनें', special:'New clients + माही Brand meeting' },
    { day:'शुक्रवार 💕',focus:'Family + Wealth',  color:'#880e4f', mantra:"'ॐ श्रीं लक्ष्म्यै नमः' 108 बार",remedy:'माँ लक्ष्मी — खीर', special:'Date Night + White/Cream रंग' },
    { day:'शनिवार 🪐',  focus:'Review + Strategy',  color:'#37474f', mantra:"'ॐ शं शनैश्चराय नमः' 108 बार",remedy:'पीपल को तेल + काले तिल दान', special:'Weekly Review + Staff review' },
    { day:'रविवार ☀️',  focus:'REST — SACRED DAY',   color:'#e65100', mantra:"'ॐ घृणि सूर्याय नमः' 7 बार", remedy:'⛔ ZERO WORK', special:'Friends + Family + 9 PM sleep' },
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      {days.map(d=>(
        <div key={d.day} style={{background:'#fff',borderRadius:14,padding:'14px 16px',marginBottom:10,borderTop:`4px solid ${d.color}`,boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
          <div style={{fontSize:20,fontWeight:800,color:d.color,marginBottom:3}}>{d.day}</div>
          <div style={{fontSize:15,color:'#555',fontWeight:600,marginBottom:8}}>{d.focus}</div>
          <div style={{fontSize:14,color:'#333',marginBottom:4}}><b style={{color:'#888'}}>🕉️ Mantra:</b> {d.mantra}</div>
          <div style={{fontSize:14,color:'#333',marginBottom:4}}><b style={{color:'#888'}}>💎 Remedy:</b> {d.remedy}</div>
          <div style={{fontSize:14,color:'#333'}}><b style={{color:'#888'}}>⭐ Special:</b> {d.special}</div>
        </div>
      ))}
    </div>
  )
}

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
    <div style={{padding:'10px 10px 20px'}}>
      <div style={{fontSize:20,fontWeight:800,color:'#7b0000',textAlign:'center',padding:'10px 0 6px'}}>🕉️ Daily Mantras</div>
      {mantras.map((m,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${m.color}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:14,fontWeight:800,color:m.color,marginBottom:3}}>{m.when}</div>
          <div style={{fontSize:16,fontWeight:600,color:'#222',marginBottom:3}}>{m.mantra}</div>
          <div style={{fontSize:13,color:'#666'}}>✨ {m.benefit}</div>
        </div>
      ))}
      <div style={{fontSize:20,fontWeight:800,color:'#7b0000',textAlign:'center',padding:'16px 0 6px'}}>💎 Weekly Remedies</div>
      {remedies.map((r,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${r.color}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:14,fontWeight:800,color:r.color,marginBottom:3}}>{r.day}</div>
          <div style={{fontSize:16,fontWeight:600,color:'#222'}}>{r.action}</div>
        </div>
      ))}
      <div style={{background:'linear-gradient(135deg,#fff9f0,#fff0e0)',border:'2px solid #d46a10',borderRadius:14,padding:18,marginTop:16,textAlign:'center'}}>
        <div style={{fontSize:16,fontWeight:700,color:'#7b0000',lineHeight:1.7}}>"Finish करो — Start करना बंद करो</div>
        <div style={{fontSize:16,fontWeight:700,color:'#7b0000',lineHeight:1.7}}>आपमें Empire बनाने का दिमाग है" 👑</div>
        <div style={{fontSize:14,color:'#d46a10',marginTop:8,fontWeight:600}}>🕉️ ॐ गं गणपतये नमः | जय माँ लक्ष्मी</div>
      </div>
    </div>
  )
}

const S = {
  root:        { fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif", background:'#f5f0eb', minHeight:'100vh', maxWidth:480, margin:'0 auto', paddingBottom:40 },
  header:      { background:'linear-gradient(135deg,#d46a10 0%,#7b0000 100%)', padding:'20px 16px 12px', color:'#fff' },
  headerTop:   { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  headerTitle: { fontSize:26, fontWeight:700, letterSpacing:0.5 },
  headerSub:   { fontSize:15, opacity:0.85, marginTop:2 },
  progressCircle: { flexShrink:0 },
  progressBar:  { background:'rgba(255,255,255,0.2)', borderRadius:8, height:7, overflow:'hidden' },
  progressFill: { background:'#ffd700', height:'100%', borderRadius:8, transition:'width 0.4s' },
  progressText: { fontSize:13, opacity:0.85, marginTop:5, textAlign:'right' },
  nav:          { display:'flex', background:'#fff', borderBottom:'2px solid #f0e8de', position:'sticky', top:0, zIndex:10 },
  navBtn:       { flex:1, padding:'13px 4px', border:'none', background:'transparent', fontSize:15, fontWeight:600, color:'#888', cursor:'pointer' },
  navActive:    { color:'#d46a10', borderBottom:'3px solid #d46a10' },
  // Settings
  setWrap:      { margin:'8px 10px 0', borderRadius:12, overflow:'hidden', border:'1.5px solid #f0e0cf' },
  setToggle:    { width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#fff9f5', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, color:'#d46a10' },
  latePill:     { background:'#ff9800', color:'#fff', borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:700 },
  setPanel:     { background:'#fff9f5', padding:'10px 14px 14px', borderTop:'1px solid #f0e0cf' },
  setRow:       { display:'flex', gap:12, marginBottom:12 },
  setBox:       { flex:1 },
  setLabel:     { fontSize:12, color:'#888', fontWeight:700, marginBottom:4 },
  tInput:       { padding:'8px 10px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', width:'100%', boxSizing:'border-box', background:'#fff' },
  clearBtn:     { padding:'7px 12px', background:'#eee', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, whiteSpace:'nowrap' },
  lateInfo:     { display:'flex', flexWrap:'wrap', gap:6, marginTop:8, alignItems:'center' },
  missedPill:   { background:'#b71c1c', color:'#fff', borderRadius:8, padding:'3px 8px', fontSize:12, fontWeight:700 },
  skippedPill:  { background:'#ff9800', color:'#fff', borderRadius:8, padding:'3px 8px', fontSize:12, fontWeight:700 },
  autoSkipBtn:  { padding:'6px 12px', background:'#fff', border:'1.5px solid #d46a10', color:'#d46a10', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:12 },
  // Toolbar
  toolBar:      { padding:'10px 12px 4px', display:'flex', gap:8, alignItems:'center' },
  searchInput:  { flex:1, padding:'10px 14px', border:'1.5px solid #ddd', borderRadius:10, fontSize:15, outline:'none', background:'#fff', boxSizing:'border-box' },
  selBtn:       { padding:'9px 14px', background:'#fff', border:'1.5px solid #ddd', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer', color:'#555', whiteSpace:'nowrap' },
  selBtnOn:     { background:'#d46a10', color:'#fff', border:'1.5px solid #d46a10' },
  mergeBanner:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#fff3e0', margin:'4px 10px', borderRadius:10, border:'1.5px solid #d46a10' },
  mergeForm:    { margin:'4px 10px 8px', background:'#fff', border:'1.5px solid #d46a10', borderRadius:12, padding:'14px', display:'flex', flexDirection:'column', gap:8 },
  mergeTitle:   { fontSize:15, fontWeight:700, color:'#d46a10' },
  filterRow:    { display:'flex', gap:6, padding:'6px 12px 10px', overflowX:'auto', scrollbarWidth:'none' },
  filterChip:   { padding:'5px 12px', border:'1.5px solid #ddd', borderRadius:20, fontSize:13, background:'#fff', cursor:'pointer', whiteSpace:'nowrap', color:'#555', fontWeight:600 },
  section:      { margin:'8px 10px', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' },
  secHeader:    { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', borderLeft:'4px solid', background:'rgba(255,255,255,0.6)' },
  secTitle:     { fontWeight:700, fontSize:15, color:'#222' },
  secBadge:     { color:'#fff', borderRadius:12, padding:'3px 9px', fontSize:13, fontWeight:700 },
  taskCard:     { background:'#fff', margin:'1px 0', borderLeft:'3px solid transparent', transition:'all 0.2s', cursor:'grab' },
  taskDone:     { opacity:0.55, background:'#f9f9f9' },
  taskSkipped:  { opacity:0.45, background:'#fafafa' },
  taskMissed:   { background:'#fff5f5' },
  taskDragOver: { background:'#fff9f0', boxShadow:'inset 0 0 0 2px #d46a10' },
  taskSelected: { background:'#fff3e0' },
  taskRow:      { display:'flex', alignItems:'flex-start', gap:10, padding:'12px 12px', cursor:'pointer' },
  checkbox:     { width:24, height:24, border:'2px solid', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, transition:'all 0.2s' },
  cbDone:       { background:'#2e7d32', borderColor:'#2e7d32' },
  checkMark:    { color:'#fff', fontSize:15, fontWeight:700 },
  taskContent:  { flex:1, minWidth:0 },
  taskTime:     { fontSize:13, color:'#d46a10', fontWeight:700, marginBottom:3, display:'flex', alignItems:'center', flexWrap:'wrap', gap:4 },
  reqDot:       { fontSize:11 },
  missedBadge:  { background:'#b71c1c', color:'#fff', fontSize:10, padding:'1px 6px', borderRadius:6, fontWeight:700 },
  skippedBadge: { background:'#ff9800', color:'#fff', fontSize:10, padding:'1px 6px', borderRadius:6, fontWeight:700 },
  taskText:     { fontSize:16, color:'#222', lineHeight:1.5 },
  taskStrike:   { textDecoration:'line-through', color:'#999' },
  tagRow:       { display:'flex', flexWrap:'wrap', gap:4, marginTop:6 },
  tag:          { fontSize:12, padding:'3px 8px', borderRadius:12, fontWeight:600 },
  taskActions:  { display:'flex', gap:4, alignItems:'center', flexShrink:0 },
  iconBtn:      { background:'none', border:'none', cursor:'pointer', fontSize:18, padding:'2px', opacity:0.6 },
  dragHandle:   { fontSize:18, color:'#bbb', cursor:'grab', userSelect:'none' },
  editBox:      { padding:'10px 12px', display:'flex', flexDirection:'column', gap:8 },
  editInput:    { padding:'8px 12px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', width:'100%', boxSizing:'border-box' },
  editTextarea: { padding:'8px 12px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', resize:'vertical', width:'100%', boxSizing:'border-box' },
  editTagRow:   { display:'flex', flexWrap:'wrap', gap:5 },
  tagToggle:    { padding:'5px 10px', border:'1.5px solid #ddd', borderRadius:16, fontSize:14, cursor:'pointer', background:'#f5f5f5' },
  skipToggle:   { padding:'8px 12px', background:'#e8f5e9', border:'1.5px solid #4caf50', borderRadius:8, fontSize:13, cursor:'pointer', color:'#2e7d32', fontWeight:600, textAlign:'left', width:'100%' },
  skipRequired: { background:'#fce4ec', border:'1.5px solid #b71c1c', color:'#b71c1c' },
  editActions:  { display:'flex', gap:8 },
  btnSave:      { padding:'10px 18px', background:'#d46a10', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:15 },
  btnCancel:    { padding:'10px 16px', background:'#eee', color:'#555', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:15 },
  addBox:       { padding:'10px 12px', background:'#fffaf5', display:'flex', flexDirection:'column', gap:8 },
  addTaskBtn:   { width:'100%', padding:'11px', background:'none', border:'none', cursor:'pointer', fontSize:15, fontWeight:600, textAlign:'center' },
  resetRow:     { display:'flex', gap:10, justifyContent:'center', padding:'20px 16px 0' },
  btnReset:     { padding:'10px 20px', background:'#fff', border:'1.5px solid #d46a10', color:'#d46a10', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:15 },
  btnResetAll:  { padding:'10px 20px', background:'#fff', border:'1.5px solid #b71c1c', color:'#b71c1c', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:15 },
  confirmBox:   { background:'#fff', padding:14, borderRadius:12, textAlign:'center', border:'1.5px solid #ddd', display:'flex', flexDirection:'column', gap:8, alignItems:'center' },
  celebOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  celebBox:     { background:'#fff', borderRadius:20, padding:28, textAlign:'center', maxWidth:320, margin:16 },
  celebTitle:   { fontSize:24, fontWeight:800, color:'#d46a10', marginBottom:4 },
}
