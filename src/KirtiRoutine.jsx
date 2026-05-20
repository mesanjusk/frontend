import { useState, useEffect, useRef } from 'react'

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

const TEAL = '#00695c'
const GREEN = '#1b5e20'

const AREA_META = {
  '🕉️': { label:'Spiritual', bg:'#fff0f5', color:'#7b0000' },
  '🏥': { label:'Health',    bg:'#fff0f0', color:'#c62828' },
  '⚖️': { label:'Advocate',  bg:'#e8eaf6', color:'#1a237e' },
  '🌿': { label:'Gardening', bg:'#e8f5e9', color:'#1b5e20' },
  '🌍': { label:'AOL/JCI',   bg:'#e0f2f1', color:'#00695c' },
  '❤️': { label:'Family',    bg:'#fce4ec', color:'#880e4f' },
  '🧠': { label:'Focus',     bg:'#e3f2fd', color:'#1565c0' },
  '💰': { label:'Money',     bg:'#fff8e1', color:'#f57f17' },
  '🌸': { label:'Self Care', bg:'#f3e5f5', color:'#6a1b9a' },
}

const KIRTI_TASKS = [
  { id:1,  section:'🌅 ब्रह्म मुहूर्त — Spiritual', time:'4:30 AM', task:'उठें — पुष्य नक्षत्र की शक्ति इस समय सबसे अधिक है', tags:['🕉️'], pinned:true,  skippable:false },
  { id:2,  section:'🌅 ब्रह्म मुहूर्त — Spiritual', time:'4:35 AM', task:'तांबे के लोटे से पानी — 1 गिलास (रात भर रखा हुआ)', tags:['🏥'], pinned:false, skippable:false },
  { id:3,  section:'🌅 ब्रह्म मुहूर्त — Spiritual', time:'4:40 AM', task:'तुलसी के पास दीपक जलाएं — शुभ शुरुआत', tags:['🕉️'], pinned:false, skippable:true },
  { id:4,  section:'🌅 ब्रह्म मुहूर्त — Spiritual', time:'4:45 AM', task:'Sudarshan Kriya — Art of Living (NEVER MISS — 45 min)', tags:['🕉️','🏥'], pinned:true,  skippable:false },
  { id:5,  section:'🌅 ब्रह्म मुहूर्त — Spiritual', time:'5:30 AM', task:"Mantra Jap — 'ॐ गुरवे नमः' माला के साथ — 21 बार", tags:['🕉️'], pinned:false, skippable:true },
  { id:6,  section:'🌅 ब्रह्म मुहूर्त — Spiritual', time:'5:38 AM', task:'Meditation — 15 मिनट पूर्ण मौन (Court से पहले शांति)', tags:['🕉️','🧠'], pinned:false, skippable:true },
  { id:7,  section:'🌅 ब्रह्म मुहूर्त — Spiritual', time:'5:55 AM', task:'Satsang Reading — 5 मिनट Gurudev का एक Message', tags:['🕉️'], pinned:false, skippable:true },
  { id:8,  section:'🌿 बगीचा — Healing Time', time:'6:00 AM', task:'बगीचे में जाएं — पौधों को पानी दें (NON-NEGOTIABLE 20 min)', tags:['🌿','🏥'], pinned:true,  skippable:false },
  { id:9,  section:'🌿 बगीचा — Healing Time', time:'6:05 AM', task:'तुलसी को पानी + 5 पत्ते खाएं — Immunity boost', tags:['🌿','🕉️'], pinned:false, skippable:false },
  { id:10, section:'🌿 बगीचा — Healing Time', time:'6:10 AM', task:'Healing Herbs की देखभाल — ब्राह्मी, गिलोय, पुदीना', tags:['🌿','🏥'], pinned:false, skippable:true },
  { id:11, section:'🌿 बगीचा — Healing Time', time:'6:20 AM', task:'बगीचे में 5 मिनट — ज़मीन पर नंगे पाँव (Grounding)', tags:['🌿','🏥'], pinned:false, skippable:true },
  { id:12, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'6:35 AM', task:'नाश्ता तैयार करें — सात्विक, सबके लिए (दलिया/पोहा/उपमा)', tags:['🏥','❤️'], pinned:false, skippable:false },
  { id:13, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'6:50 AM', task:'नाश्ता करें — ध्यान से, जल्दी नहीं, Protein + Fruit भी', tags:['🏥'], pinned:false, skippable:false },
  { id:14, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'7:00 AM', task:'माही का Tiffin / Lunch Box Pack करें (घर का खाना)', tags:['❤️','🏥'], pinned:false, skippable:true },
  { id:15, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'7:10 AM', task:'BP Check + पानी एक गिलास', tags:['🏥'], pinned:false, skippable:false },
  { id:16, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'7:18 AM', task:"Court Files Sort करें + '3 Deep Breaths — मैं निमित्त हूं'", tags:['⚖️','🧠'], pinned:false, skippable:true },
  { id:17, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'7:30 AM', task:'घर की एक ज़रूरी चीज़ Check — Gas / सब्ज़ी / दूध', tags:['❤️'], pinned:false, skippable:true },
  { id:18, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'7:42 AM', task:'तैयार हों — साफ, Professional, आत्मविश्वास के साथ', tags:['🌸'], pinned:false, skippable:true },
  { id:19, section:'🍽️ सुबह — नाश्ता और तैयारी', time:'7:52 AM', task:'Court के लिए निकलें — सुरक्षित यात्रा', tags:['⚖️'], pinned:false, skippable:false },
  { id:20, section:'⚖️ Court — Advocate Work', time:'8:00 AM',  task:'Court — पूरे ध्यान से, "मैं निमित्त हूं" याद रखें', tags:['⚖️'], pinned:true,  skippable:false },
  { id:21, section:'⚖️ Court — Advocate Work', time:'8:00 AM',  task:'आज के Important Cases List + Arguments Review', tags:['⚖️','🧠'], pinned:false, skippable:true },
  { id:22, section:'⚖️ Court — Advocate Work', time:'10:30 AM', task:'Short Break — पानी + 5 मिनट बाहर (Eyes + Energy)', tags:['🏥'], pinned:false, skippable:true },
  { id:23, section:'⚖️ Court — Advocate Work', time:'11:00 AM', task:'1 Client से Fee Discussion / Collection — Politely', tags:['💰','⚖️'], pinned:false, skippable:true },
  { id:24, section:'⚖️ Court — Advocate Work', time:'11:30 AM', task:'नए Case Inquiry — Intake, Client सुनें, Advise करें', tags:['⚖️'], pinned:false, skippable:true },
  { id:25, section:'⚖️ Court — Advocate Work', time:'12:30 PM', task:'Lunch — Court में ही, शांति से, Phone बंद (घर का खाना)', tags:['🏥','🕉️'], pinned:true,  skippable:false },
  { id:26, section:'⚖️ Court — Advocate Work', time:'12:52 PM', task:'Micro Rest — 8 मिनट आंखें बंद (दोपहर की Energy)', tags:['🏥'], pinned:false, skippable:true },
  { id:27, section:'⚖️ Court — Advocate Work', time:'1:00 PM',  task:'Afternoon Cases — Research / Drafting / Submissions', tags:['⚖️','🧠'], pinned:false, skippable:true },
  { id:28, section:'⚖️ Court — Advocate Work', time:'1:30 PM',  task:'Client Outstanding Fees — रोज़ 1 Reminder भेजें', tags:['💰'], pinned:false, skippable:true },
  { id:29, section:'🌍 AOL + JCI + Social Service', time:'2:00 PM', task:'AOL Teaching Prep — Bangalore Certification Material', tags:['🌍','🕉️'], pinned:false, skippable:true },
  { id:30, section:'🌍 AOL + JCI + Social Service', time:'2:30 PM', task:'AOL Workshop Plan — Gondia / Raipur Session Outline', tags:['🌍','🕉️'], pinned:false, skippable:true },
  { id:31, section:'🌍 AOL + JCI + Social Service', time:'3:00 PM', task:'JCI Project — Community work, Meeting coordination', tags:['🌍'], pinned:false, skippable:true },
  { id:32, section:'🌍 AOL + JCI + Social Service', time:'3:30 PM', task:'Free Legal Aid — आज 1 जरूरतमंद को Help करें', tags:['⚖️','🌍'], pinned:false, skippable:true },
  { id:33, section:'🌍 AOL + JCI + Social Service', time:'4:00 PM', task:'Monthly Expense Review — घर का बजट, हफ्ते में 1 बार', tags:['💰'], pinned:false, skippable:true },
  { id:34, section:'🌍 AOL + JCI + Social Service', time:'4:20 PM', task:'Savings Check — FD / Investment / RD Update', tags:['💰'], pinned:false, skippable:true },
  { id:35, section:'🚗 Court से घर — Transition', time:'5:00 PM', task:'Car में — 5 मिनट, Court वहीं छोड़ें, माँ बनें Breathing', tags:['🏥','🧠'], pinned:true,  skippable:false },
  { id:36, section:'🚗 Court से घर — Transition', time:'5:10 PM', task:"'ॐ शं शनैश्चराय नमः' — मन में 7 बार (Shani Dasha)", tags:['🕉️'], pinned:false, skippable:true },
  { id:37, section:'🚗 Court से घर — Transition', time:'5:20 PM', task:'रास्ते में सब्ज़ी / घर की ज़रूरत की चीज़ें लें', tags:['❤️'], pinned:false, skippable:true },
  { id:38, section:'🏠 शाम — घर और परिवार', time:'5:35 PM', task:'बगीचे में 20 मिनट — Court का stress release, पौधों से बात', tags:['🌿','🏥'], pinned:true,  skippable:false },
  { id:39, section:'🏠 शाम — घर और परिवार', time:'5:55 PM', task:'चाय — शांति से, 10 मिनट, Screen नहीं', tags:['🌸'], pinned:false, skippable:true },
  { id:40, section:'🏠 शाम — घर और परिवार', time:'6:05 PM', task:'Sanjay के घर आने से पहले — 1 Household task Complete', tags:['❤️'], pinned:false, skippable:true },
  { id:41, section:'🏠 शाम — घर और परिवार', time:'6:15 PM', task:'माही के साथ — 15 मिनट, NIFT prep / दिन की बात सुनें', tags:['❤️'], pinned:false, skippable:true },
  { id:42, section:'🏠 शाम — घर और परिवार', time:'6:35 PM', task:'Sanjay के साथ — बगीचे में 15 मिनट (Sacred Couple Time)', tags:['❤️'], pinned:true,  skippable:false },
  { id:43, section:'🏠 शाम — घर और परिवार', time:'6:55 PM', task:'Dinner की तैयारी शुरू करें — Simple, Nutritious, Saatvik', tags:['🏥','❤️'], pinned:false, skippable:false },
  { id:44, section:'🏠 शाम — घर और परिवार', time:'7:20 PM', task:'घर की एक साफ़-सफ़ाई / Organise — कल के लिए Ready', tags:['❤️'], pinned:false, skippable:true },
  { id:45, section:'🍛 रात — Dinner और परिवार', time:'7:30 PM', task:'Dinner तैयार — Table लगाएं, तीनों के साथ बैठें', tags:['❤️','🏥'], pinned:false, skippable:false },
  { id:46, section:'🍛 रात — Dinner और परिवार', time:'7:45 PM', task:'Family Dinner — Phone नहीं, तीनों साथ, Gratitude', tags:['❤️','🏥'], pinned:true,  skippable:false },
  { id:47, section:'🍛 रात — Dinner और परिवार', time:'8:10 PM', task:'दिन की 1 Gratitude बात — हर कोई बोले', tags:['❤️','🕉️'], pinned:false, skippable:true },
  { id:48, section:'🍛 रात — Dinner और परिवार', time:'8:20 PM', task:'Kitchen Clean करें — साथ में, माही को भी involve करें', tags:['❤️'], pinned:false, skippable:true },
  { id:49, section:'🍛 रात — Dinner और परिवार', time:'8:35 PM', task:'Sanjay के साथ Quality Time — Advocate mode पूरी तरह बंद', tags:['❤️'], pinned:true,  skippable:false },
  { id:50, section:'🌙 रात — Wind Down', time:'9:00 PM', task:'Journal — आज क्या सीखा, किसे help किया, आभार', tags:['🕉️','🧠'], pinned:false, skippable:true },
  { id:51, section:'🌙 रात — Wind Down', time:'9:15 PM', task:"'ॐ' — 21 बार दीपक के सामने (दिन का समापन)", tags:['🕉️'], pinned:false, skippable:true },
  { id:52, section:'🌙 रात — Wind Down', time:'9:30 PM', task:'कल का Plan — Court Files, AOL prep, घर की ज़रूरत', tags:['🧠'], pinned:false, skippable:true },
  { id:53, section:'🌙 रात — Wind Down', time:'9:42 PM', task:'Phone Silent — Screen Time बंद', tags:['🏥'], pinned:false, skippable:true },
  { id:54, section:'🌙 रात — Wind Down', time:'9:50 PM', task:'सोएं — अच्छी नींद = कल की अच्छी Sudarshan Kriya', tags:['🏥'], pinned:true,  skippable:false },
]

const SECTION_COLORS = {
  '🌅 ब्रह्म मुहूर्त — Spiritual':  { bg:'#fff5e6', accent:'#7b0000' },
  '🌿 बगीचा — Healing Time':         { bg:'#e8f5e9', accent:'#1b5e20' },
  '🍽️ सुबह — नाश्ता और तैयारी':    { bg:'#fff8e1', accent:'#f57f17' },
  '⚖️ Court — Advocate Work':        { bg:'#e8eaf6', accent:'#1a237e' },
  '🌍 AOL + JCI + Social Service':   { bg:'#e0f2f1', accent:'#00695c' },
  '🚗 Court से घर — Transition':     { bg:'#fce4ec', accent:'#c62828' },
  '🏠 शाम — घर और परिवार':          { bg:'#f3e5f5', accent:'#6a1b9a' },
  '🍛 रात — Dinner और परिवार':       { bg:'#fce4ec', accent:'#880e4f' },
  '🌙 रात — Wind Down':              { bg:'#ede7f6', accent:'#4a148c' },
}

const STORAGE_KEY = 'kirti_routine_v1'
const DEF_SETTINGS = { dayStart:'4:30 AM', dayEnd:'9:50 PM', actualStart:'' }

function loadState() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s) } catch {}
  return null
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

export default function KirtiRoutine() {
  const saved = loadState()
  const [tasks, setTasks] = useState(() =>
    (saved?.tasks || KIRTI_TASKS).map(t => ({ ...t, skippable: t.skippable !== undefined ? t.skippable : !t.pinned }))
  )
  const [done, setDone]         = useState(saved?.done     || {})
  const [settings, setSettings] = useState(saved?.settings || DEF_SETTINGS)
  const [view, setView]         = useState('today')
  const [editingId, setEditingId]   = useState(null)
  const [editDraft, setEditDraft]   = useState({})
  const [addingSection, setAddingSection] = useState(null)
  const [newTask, setNewTask]       = useState({ time:'', task:'', tags:[], skippable:true })
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [searchQ, setSearchQ]       = useState('')
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [dragId, setDragId]         = useState(null)
  const [dragOverId, setDragOverId] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectMode, setSelectMode] = useState(false)
  const [selected, setSelected]     = useState(new Set())
  const [mergeForm, setMergeForm]   = useState(null)
  const editRef = useRef(null)

  useEffect(() => { saveState({ tasks, done, settings }) }, [tasks, done, settings])

  const sections   = [...new Set(tasks.map(t => t.section))]
  const todayDone  = Object.values(done).filter(Boolean).length
  const todayTotal = tasks.length
  const pct        = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0

  const actualMins   = parseTime(settings.actualStart)
  const isLate       = !!settings.actualStart
  const getStatus    = t => {
    if (!isLate) return 'normal'
    return parseTime(t.time) < actualMins ? (t.skippable ? 'skipped' : 'missed') : 'normal'
  }
  const missedCount  = tasks.filter(t => getStatus(t) === 'missed').length
  const skippedCount = tasks.filter(t => getStatus(t) === 'skipped').length

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
  const saveEdit = () => { setTasks(tasks.map(t => t.id === editingId ? { ...t, ...editDraft } : t)); setEditingId(null) }
  const deleteTask = id => {
    setTasks(tasks.filter(t => t.id !== id))
    const nd = { ...done }; delete nd[id]; setDone(nd)
  }
  const addTask = section => {
    if (!newTask.task.trim()) return
    setTasks([...tasks, { id:Date.now(), section, ...newTask, pinned:false }])
    setNewTask({ time:'', task:'', tags:[], skippable:true })
    setAddingSection(null)
  }

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
    const [mt] = arr.splice(fi, 1); const [md] = durs.splice(fi, 1)
    arr.splice(ti, 0, mt); durs.splice(ti, 0, md)
    let cursor = parseTime(settings.dayStart)
    setTasks(arr.map((t, i) => { const time = fmtTime(cursor); cursor += durs[i]; return { ...t, time } }))
    setDragId(null); setDragOverId(null)
  }

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
    setSettings(s => ({ ...s, ...(newStart ? { dayStart:newStart } : {}), ...(newEnd ? { dayEnd:newEnd } : {}) }))
  }

  const autoSkip = () => {
    const nd = { ...done }
    tasks.forEach(t => { if (parseTime(t.time) < actualMins && t.skippable) nd[t.id] = true })
    setDone(nd)
  }

  const openMerge = () => {
    const sel = tasks.filter(t => selected.has(t.id)).sort((a,b) => parseTime(a.time)-parseTime(b.time))
    if (sel.length < 2) return
    setMergeForm({ task:sel[0].task, time:sel[0].time, tags:[...new Set(sel.flatMap(t=>t.tags))], skippable:sel.some(t=>t.skippable) })
  }
  const doMerge = () => {
    if (!mergeForm?.task?.trim()) return
    const insertIdx = tasks.findIndex(t => selected.has(t.id))
    const section   = tasks[insertIdx]?.section || sections[0]
    const rest      = tasks.filter(t => !selected.has(t.id))
    rest.splice(insertIdx, 0, { id:Date.now(), section, ...mergeForm, pinned:false })
    setTasks(rest)
    const nd = { ...done }; selected.forEach(id => delete nd[id]); setDone(nd)
    setSelected(new Set()); setSelectMode(false); setMergeForm(null)
  }

  const resetDay = () => { setDone({}); setConfirmReset(false) }
  const resetAll = () => {
    setTasks(KIRTI_TASKS.map(t => ({ ...t, skippable: t.skippable !== undefined ? t.skippable : !t.pinned })))
    setDone({}); setSettings(DEF_SETTINGS); setConfirmReset(false)
  }
  const sc = sec => SECTION_COLORS[sec] || { bg:'#f9f9f9', accent:TEAL }

  const filtered = tasks.filter(t => {
    const aOk = activeFilter === 'ALL' || t.tags.includes(activeFilter)
    const sOk = !searchQ || t.task.toLowerCase().includes(searchQ.toLowerCase()) || t.time.includes(searchQ)
    return aOk && sOk
  })

  return (
    <div style={S.root}>
      <header style={{...S.header, background:'linear-gradient(135deg,#00695c,#1b5e20)'}}>
        <div style={S.headerTop}>
          <div>
            <div style={S.headerTitle}>🌿 किर्ती अहूजा</div>
            <div style={S.headerSub}>Advocate • AOL Teacher • Healer</div>
            <div style={{...S.headerSub,color:'#b2dfdb',fontSize:11}}>मेष लग्न • मकर राशि • पुष्य नक्षत्र • शनि महादशा</div>
          </div>
          <div style={S.progressCircle}>
            <svg width='56' height='56'>
              <circle cx='28' cy='28' r='23' fill='none' stroke='rgba(255,255,255,0.2)' strokeWidth='4'/>
              <circle cx='28' cy='28' r='23' fill='none' stroke='#ffd700' strokeWidth='4'
                strokeDasharray={`${2*Math.PI*23}`}
                strokeDashoffset={`${2*Math.PI*23*(1-pct/100)}`}
                strokeLinecap='round'
                style={{transform:'rotate(-90deg)',transformOrigin:'28px 28px',transition:'stroke-dashoffset 0.5s'}}/>
              <text x='28' y='33' textAnchor='middle' fill='#ffd700' fontSize='13' fontWeight='bold'>{pct}%</text>
            </svg>
          </div>
        </div>
        <div style={S.progressBar}><div style={{...S.progressFill,width:`${pct}%`}}/></div>
        <div style={S.progressText}>{todayDone} / {todayTotal} tasks complete</div>
      </header>

      <nav style={S.nav}>
        {[['today','📋 आज'],['weekly','📅 Weekly'],['aol','🕉️ AOL'],['garden','🌿 Garden']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{...S.navBtn,...(view===v?S.navActive:{})}}>{l}</button>
        ))}
      </nav>

      {view==='today' && <>
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
                  <input type='time' value={to24(settings.dayStart)} onChange={e=>applySchedule(from24(e.target.value),null)} style={S.tInput}/>
                </div>
                <div style={S.setBox}>
                  <div style={S.setLabel}>🌙 Day End</div>
                  <input type='time' value={to24(settings.dayEnd)} onChange={e=>applySchedule(null,from24(e.target.value))} style={S.tInput}/>
                </div>
              </div>
              <div style={S.setLabel}>⏰ Actual Wake-up (if late)</div>
              <div style={{display:'flex',gap:8,alignItems:'center',marginTop:4}}>
                <input type='time' value={settings.actualStart?to24(settings.actualStart):''}
                  onChange={e=>setSettings(s=>({...s,actualStart:e.target.value?from24(e.target.value):''}))} style={{...S.tInput,flex:1}}/>
                {settings.actualStart && <button onClick={()=>setSettings(s=>({...s,actualStart:''}))} style={S.clearBtn}>✕ Clear</button>}
              </div>
              {isLate && (
                <div style={S.lateInfo}>
                  <span style={S.missedPill}>⚠️ {missedCount} MISSED</span>
                  <span style={S.skippedPill}>⏭️ {skippedCount} SKIPPED</span>
                  <button onClick={autoSkip} style={S.autoSkipBtn}>⏭️ Auto-skip flexible</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={S.toolBar}>
          <input placeholder='🔍 Search tasks...' value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={S.searchInput}/>
          <button onClick={()=>{setSelectMode(!selectMode);setSelected(new Set());setMergeForm(null)}}
            style={{...S.selBtn,...(selectMode?S.selBtnOn:{})}}>
            {selectMode?'✕ Cancel':'⋈ Merge'}
          </button>
        </div>

        {selectMode && selected.size >= 2 && !mergeForm && (
          <div style={S.mergeBanner}>
            <span style={{fontWeight:700,color:TEAL}}>{selected.size} tasks selected</span>
            <button onClick={openMerge} style={S.btnSave}>⊕ Merge into one</button>
          </div>
        )}

        {mergeForm && (
          <div style={S.mergeForm}>
            <div style={S.mergeTitle}>⊕ Merge {selected.size} tasks into one</div>
            <input value={mergeForm.task} onChange={e=>setMergeForm({...mergeForm,task:e.target.value})} style={S.editInput} placeholder='Combined task name...'/>
            <input type='time' value={to24(mergeForm.time)} onChange={e=>setMergeForm({...mergeForm,time:from24(e.target.value)})} style={S.tInput}/>
            <div style={S.editTagRow}>
              {Object.keys(AREA_META).map(a=>(
                <button key={a} onClick={()=>setMergeForm({...mergeForm,tags:mergeForm.tags.includes(a)?mergeForm.tags.filter(x=>x!==a):[...mergeForm.tags,a]})}
                  style={{...S.tagToggle,...(mergeForm.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>{a}</button>
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
              <div style={{...S.secHeader,borderLeftColor:c.accent}}>
                <span style={S.secTitle}>{sec}</span>
                <span style={{...S.secBadge,background:c.accent}}>{secDone}/{secTasks.length}</span>
              </div>
              {secTasks.map(t=>{
                const status=getStatus(t), isSel=selected.has(t.id)
                return (
                  <div key={t.id} draggable={!selectMode}
                    onDragStart={()=>onDragStart(t.id)} onDragOver={e=>onDragOver(e,t.id)} onDrop={()=>onDrop(t.id)}
                    style={{...S.taskCard,...(done[t.id]?S.taskDone:{}),...(status==='skipped'?S.taskSkipped:{}),...(status==='missed'?S.taskMissed:{}),...(dragOverId===t.id?S.taskDragOver:{}),...(isSel?S.taskSelected:{}),borderLeftColor:status==='missed'?'#b71c1c':c.accent}}>
                    {editingId===t.id?(
                      <div style={S.editBox}>
                        <input ref={editRef} value={editDraft.time} onChange={e=>setEditDraft({...editDraft,time:e.target.value})} style={S.editInput} placeholder='Time'/>
                        <textarea value={editDraft.task} onChange={e=>setEditDraft({...editDraft,task:e.target.value})} style={S.editTextarea} rows={2}/>
                        <div style={S.editTagRow}>
                          {Object.keys(AREA_META).map(a=>(
                            <button key={a} onClick={()=>setEditDraft({...editDraft,tags:editDraft.tags.includes(a)?editDraft.tags.filter(x=>x!==a):[...editDraft.tags,a]})}
                              style={{...S.tagToggle,...(editDraft.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>{a}</button>
                          ))}
                        </div>
                        <button onClick={()=>setEditDraft({...editDraft,skippable:!editDraft.skippable})}
                          style={{...S.skipToggle,...(!editDraft.skippable?S.skipRequired:{})}}>
                          {editDraft.skippable?'⏭️ Skippable (tap → Required)':'⛔ Required (tap → Skippable)'}
                        </button>
                        <div style={S.editActions}>
                          <button onClick={saveEdit} style={S.btnSave}>💾 Save</button>
                          <button onClick={()=>setEditingId(null)} style={S.btnCancel}>✕</button>
                        </div>
                      </div>
                    ):(
                      <div style={S.taskRow} onClick={()=>toggle(t.id)}>
                        <div style={{...S.checkbox,...((selectMode?isSel:done[t.id])?S.cbDone:{}),borderColor:c.accent}}>
                          {(selectMode?isSel:done[t.id])&&<span style={S.checkMark}>✓</span>}
                        </div>
                        <div style={S.taskContent}>
                          <div style={{...S.taskTime,color:c.accent}}>
                            {t.time} {t.pinned&&'📌'}
                            {!t.skippable&&<span style={S.reqDot}>⛔</span>}
                            {status==='missed'&&<span style={S.missedBadge}>MISSED</span>}
                            {status==='skipped'&&<span style={S.skippedBadge}>⏭️ SKIP</span>}
                          </div>
                          <div style={{...S.taskText,...((done[t.id]||status==='skipped')?S.taskStrike:{})}}>{t.task}</div>
                          <div style={S.tagRow}>
                            {t.tags.map(tag=>(
                              <span key={tag} style={{...S.tag,background:AREA_META[tag]?.bg||'#eee',color:AREA_META[tag]?.color||'#666'}}>{tag} {AREA_META[tag]?.label}</span>
                            ))}
                          </div>
                        </div>
                        {!selectMode&&(
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
              {!selectMode&&(
                addingSection===sec?(
                  <div style={S.addBox}>
                    <input placeholder='Time (e.g. 9:00 AM)' value={newTask.time} onChange={e=>setNewTask({...newTask,time:e.target.value})} style={S.editInput}/>
                    <input placeholder='Task description...' value={newTask.task} onChange={e=>setNewTask({...newTask,task:e.target.value})} style={S.editInput} onKeyDown={e=>e.key==='Enter'&&addTask(sec)}/>
                    <div style={S.editTagRow}>
                      {Object.keys(AREA_META).map(a=>(
                        <button key={a} onClick={()=>setNewTask({...newTask,tags:newTask.tags.includes(a)?newTask.tags.filter(x=>x!==a):[...newTask.tags,a]})}
                          style={{...S.tagToggle,...(newTask.tags.includes(a)?{background:AREA_META[a].color,color:'#fff'}:{})}}>{a}</button>
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
                ):(
                  <button onClick={()=>setAddingSection(sec)} style={{...S.addTaskBtn,color:c.accent}}>+ Add task</button>
                )
              )}
            </div>
          )
        })}

        <div style={S.resetRow}>
          {!confirmReset?(
            <>
              <button onClick={()=>setConfirmReset('day')} style={S.btnReset}>🔄 Reset Today</button>
              <button onClick={()=>setConfirmReset('all')} style={S.btnResetAll}>♻️ Reset All</button>
            </>
          ):(
            <div style={S.confirmBox}>
              <p>{confirmReset==='day'?'Reset checkmarks?':'Reset ALL data?'}</p>
              <button onClick={confirmReset==='day'?resetDay:resetAll} style={S.btnSave}>Yes</button>
              <button onClick={()=>setConfirmReset(false)} style={S.btnCancel}>No</button>
            </div>
          )}
        </div>
      </>}

      {view==='weekly' && <KirtiWeekly />}
      {view==='aol'    && <KirtiAOL />}
      {view==='garden' && <KirtiGarden />}

      {showCelebrate&&(
        <div style={S.celebOverlay} onClick={()=>setShowCelebrate(false)}>
          <div style={S.celebBox}>
            <div style={{fontSize:60,marginBottom:8}}>🌸</div>
            <div style={{...S.celebTitle,color:TEAL}}>जय गुरुदेव! 🙏</div>
            <div style={{fontSize:16,color:'#555',marginBottom:8}}>किर्ती जी — आज का पूरा Routine complete!</div>
            <div style={{fontSize:15,color:GREEN,fontWeight:600,fontStyle:'italic',marginBottom:16}}>&quot;आप पहले से ही Teacher हैं — Certificate सिर्फ दुनिया को बताएगा&quot; 🌿</div>
            <button onClick={()=>setShowCelebrate(false)} style={S.btnSave}>🕉️ जय गुरुदेव</button>
          </div>
        </div>
      )}
    </div>
  )
}

function KirtiWeekly() {
  const days = [
    { day:'सोमवार 🌙', focus:'Shiv Temple + Court + JCI', color:'#1a237e', mantra:"'ॐ सोमाय नमः' 21 बार", tip:'Weekly AOL workshop plan करें' },
    { day:'मंगलवार 🔴', focus:'Court + Extra Gardening', color:'#b71c1c', mantra:"'ॐ अं अंगारकाय नमः' 21 बार", tip:'Healing herbs की देखभाल' },
    { day:'बुधवार 💚', focus:'Legal Aid + Community Work', color:'#00695c', mantra:"'ॐ बुं बुधाय नमः' 21 बार", tip:'1 गरीब को Free Legal help' },
    { day:'गुरुवार 🌕', focus:'AOL Workshop + JCI Meeting', color:'#4a148c', mantra:"'ॐ गुरवे नमः' 21 बार", tip:'Workshop का पहला दिन — Thursday को' },
    { day:'शुक्रवार 💕', focus:'Family + Satsang', color:'#880e4f', mantra:"'ॐ श्रीं लक्ष्म्यै नमः' 108 बार", tip:'Sanjay के साथ Quality Time' },
    { day:'शनिवार 🪐', focus:'Garden + AOL Prep + Review', color:'#37474f', mantra:"'ॐ शं शनैश्चराय नमः' 108 बार", tip:'Bangalore preparation update' },
    { day:'रविवार ☀️', focus:'Full Spiritual Day + Family', color:'#e65100', mantra:'Sudarshan Kriya — Extended', tip:'Sanjay + Mahi के साथ Temple' },
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
    { when:'रोज सुबह', mantra:"'ॐ नमः शिवाय' — 21 बार", benefit:'मन की शांति + Court में Calm', color:'#1a237e' },
    { when:'रोज सुबह', mantra:"'ॐ गुरवे नमः' — 21 बार", benefit:'Gurudev का आशीर्वाद', color:'#00695c' },
    { when:'सोमवार', mantra:"'ॐ सोमाय नमः' — 108 बार", benefit:'मन + Emotions balanced', color:'#880e4f' },
    { when:'शनिवार', mantra:"'ॐ शं शनैश्चराय नमः' — 108 बार", benefit:'शनि महादशा + Discipline', color:'#37474f' },
    { when:'शुक्रवार', mantra:"'ॐ श्रीं लक्ष्म्यै नमः' — 108 बार", benefit:'Family prosperity', color:'#880e4f' },
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
      <div style={{fontSize:16,fontWeight:800,color:TEAL,textAlign:'center',padding:'8px 0 12px'}}>🕉️ AOL Teacher Journey</div>
      {aol_steps.map((s,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${s.done?TEAL:'#bbb'}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)',display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontSize:20}}>{s.done?'✅':'🎯'}</div>
          <div>
            <div style={{fontSize:11,fontWeight:800,color:s.done?TEAL:'#888',marginBottom:2}}>{s.step}</div>
            <div style={{fontSize:13,color:'#222'}}>{s.action}</div>
          </div>
        </div>
      ))}
      <div style={{fontSize:16,fontWeight:800,color:TEAL,textAlign:'center',padding:'12px 0 8px'}}>🕉️ Daily Mantras</div>
      {mantras.map((m,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${m.color}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:11,fontWeight:800,color:m.color,marginBottom:3}}>{m.when}</div>
          <div style={{fontSize:14,fontWeight:700,color:'#222',marginBottom:3}}>{m.mantra}</div>
          <div style={{fontSize:11,color:'#666'}}>✨ {m.benefit}</div>
        </div>
      ))}
      <div style={{background:'linear-gradient(135deg,#e8f5e9,#e0f2f1)',border:`2px solid ${TEAL}`,borderRadius:14,padding:18,marginTop:12,textAlign:'center'}}>
        <div style={{fontSize:14,fontWeight:700,color:TEAL,lineHeight:1.6}}>&quot;आप पहले से ही Teacher हैं</div>
        <div style={{fontSize:14,fontWeight:700,color:TEAL,lineHeight:1.6}}>Certificate सिर्फ दुनिया को बताएगा&quot; 🌿</div>
        <div style={{fontSize:12,color:GREEN,marginTop:8,fontWeight:600}}>🕉️ जय गुरुदेव | Bangalore जाइए — अभी</div>
      </div>
    </div>
  )
}

function KirtiGarden() {
  const plants = [
    { dir:'उत्तर-पूर्व (ईशान)', plant:'तुलसी — 5-7 पौधे', benefit:'पवित्रता + Spiritual Energy', emoji:'🌿' },
    { dir:'पूर्व', plant:'पीले और सफेद फूल — गेंदा, चमेली', benefit:'Positivity + Happiness', emoji:'🌼' },
    { dir:'उत्तर', plant:'Herbs — पुदीना, धनिया, ब्राह्मी', benefit:'Health + Memory', emoji:'🌱' },
    { dir:'दक्षिण-पूर्व', plant:'एलोवेरा, गिलोय', benefit:'Healing + Immunity', emoji:'💚' },
    { dir:'केंद्र (Center)', plant:'Meditation Corner — चटाई', benefit:'Family Peace + Sudarshan Kriya', emoji:'🧘' },
  ]
  const healingHerbs = [
    { name:'ब्राह्मी', use:'Memory + Focus + Stress Relief', how:'रोज 1 गोली' },
    { name:'अश्वगंधा', use:'Strength + Calm + Immunity', how:'रात को दूध के साथ' },
    { name:'शंखपुष्पी', use:'Brain Power + Memory', how:'सुबह खाली पेट' },
    { name:'गिलोय', use:'Immunity + Energy + Fever', how:'काढ़ा बनाकर' },
    { name:'तुलसी', use:'Immunity + Spiritual + Stress', how:'5 पत्ते रोज सुबह' },
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      <div style={{fontSize:16,fontWeight:800,color:GREEN,textAlign:'center',padding:'8px 0 12px'}}>🌿 Spiritual Garden — Vastu Plan</div>
      {plants.map((p,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${GREEN}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:20,marginBottom:4}}>{p.emoji}</div>
          <div style={{fontSize:11,fontWeight:800,color:GREEN,marginBottom:2}}>{p.dir}</div>
          <div style={{fontSize:13,fontWeight:700,color:'#222',marginBottom:2}}>{p.plant}</div>
          <div style={{fontSize:11,color:'#666'}}>{p.benefit}</div>
        </div>
      ))}
      <div style={{fontSize:16,fontWeight:800,color:GREEN,textAlign:'center',padding:'12px 0 8px'}}>💊 Healing Herbs</div>
      {healingHerbs.map((h,i)=>(
        <div key={i} style={{background:'#e8f5e9',borderRadius:10,padding:'10px 14px',marginBottom:6,borderLeft:`3px solid ${GREEN}`}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontSize:13,fontWeight:700,color:GREEN}}>{h.name}</div>
            <div style={{fontSize:11,color:'#555',background:'#fff',padding:'2px 8px',borderRadius:10}}>{h.how}</div>
          </div>
          <div style={{fontSize:11,color:'#555',marginTop:3}}>{h.use}</div>
        </div>
      ))}
      <div style={{background:'linear-gradient(135deg,#e8f5e9,#f1f8e9)',border:`2px solid ${GREEN}`,borderRadius:14,padding:18,marginTop:12,textAlign:'center'}}>
        <div style={{fontSize:15,fontWeight:700,color:GREEN}}>बगीचे में रोज 20 मिनट 🌿</div>
        <div style={{fontSize:12,color:'#555',marginTop:6,lineHeight:1.6}}>यह Negotiable नहीं है<br/>पौधों को पानी = आत्मा को शांति</div>
      </div>
    </div>
  )
}

const S = {
  root:        { fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif", background:'#f0f7f4', minHeight:'100vh', maxWidth:480, margin:'0 auto', paddingBottom:40 },
  header:      { padding:'20px 16px 12px', color:'#fff' },
  headerTop:   { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  headerTitle: { fontSize:26, fontWeight:700, letterSpacing:0.5 },
  headerSub:   { fontSize:15, opacity:0.85, marginTop:2 },
  progressCircle: { flexShrink:0 },
  progressBar:  { background:'rgba(255,255,255,0.2)', borderRadius:8, height:7, overflow:'hidden' },
  progressFill: { background:'#ffd700', height:'100%', borderRadius:8, transition:'width 0.4s' },
  progressText: { fontSize:13, opacity:0.85, marginTop:5, textAlign:'right' },
  nav:          { display:'flex', background:'#fff', borderBottom:'2px solid #e0f2f1', position:'sticky', top:0, zIndex:10 },
  navBtn:       { flex:1, padding:'13px 4px', border:'none', background:'transparent', fontSize:15, fontWeight:600, color:'#888', cursor:'pointer' },
  navActive:    { color:TEAL, borderBottom:`3px solid ${TEAL}` },
  setWrap:      { margin:'8px 10px 0', borderRadius:12, overflow:'hidden', border:'1.5px solid #cce5e0' },
  setToggle:    { width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#f0f7f4', border:'none', cursor:'pointer', fontSize:14, fontWeight:700, color:TEAL },
  latePill:     { background:'#ff9800', color:'#fff', borderRadius:8, padding:'2px 8px', fontSize:11, fontWeight:700 },
  setPanel:     { background:'#f0f7f4', padding:'10px 14px 14px', borderTop:'1px solid #cce5e0' },
  setRow:       { display:'flex', gap:12, marginBottom:12 },
  setBox:       { flex:1 },
  setLabel:     { fontSize:12, color:'#888', fontWeight:700, marginBottom:4 },
  tInput:       { padding:'8px 10px', border:'1.5px solid #ddd', borderRadius:8, fontSize:15, outline:'none', width:'100%', boxSizing:'border-box', background:'#fff' },
  clearBtn:     { padding:'7px 12px', background:'#eee', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, whiteSpace:'nowrap' },
  lateInfo:     { display:'flex', flexWrap:'wrap', gap:6, marginTop:8, alignItems:'center' },
  missedPill:   { background:'#b71c1c', color:'#fff', borderRadius:8, padding:'3px 8px', fontSize:12, fontWeight:700 },
  skippedPill:  { background:'#ff9800', color:'#fff', borderRadius:8, padding:'3px 8px', fontSize:12, fontWeight:700 },
  autoSkipBtn:  { padding:'6px 12px', background:'#fff', border:`1.5px solid ${TEAL}`, color:TEAL, borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:12 },
  toolBar:      { padding:'10px 12px 4px', display:'flex', gap:8, alignItems:'center' },
  searchInput:  { flex:1, padding:'10px 14px', border:'1.5px solid #ddd', borderRadius:10, fontSize:15, outline:'none', background:'#fff', boxSizing:'border-box' },
  selBtn:       { padding:'9px 14px', background:'#fff', border:'1.5px solid #ddd', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer', color:'#555', whiteSpace:'nowrap' },
  selBtnOn:     { background:TEAL, color:'#fff', border:`1.5px solid ${TEAL}` },
  mergeBanner:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#e8f5e9', margin:'4px 10px', borderRadius:10, border:`1.5px solid ${TEAL}` },
  mergeForm:    { margin:'4px 10px 8px', background:'#fff', border:`1.5px solid ${TEAL}`, borderRadius:12, padding:'14px', display:'flex', flexDirection:'column', gap:8 },
  mergeTitle:   { fontSize:15, fontWeight:700, color:TEAL },
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
  taskDragOver: { background:'#e8f5e9', boxShadow:`inset 0 0 0 2px ${TEAL}` },
  taskSelected: { background:'#e8f5e9' },
  taskRow:      { display:'flex', alignItems:'flex-start', gap:10, padding:'12px 12px', cursor:'pointer' },
  checkbox:     { width:24, height:24, border:'2px solid', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, transition:'all 0.2s' },
  cbDone:       { background:TEAL, borderColor:TEAL },
  checkMark:    { color:'#fff', fontSize:15, fontWeight:700 },
  taskContent:  { flex:1, minWidth:0 },
  taskTime:     { fontSize:13, fontWeight:700, marginBottom:3, display:'flex', alignItems:'center', flexWrap:'wrap', gap:4 },
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
  skipToggle:   { padding:'8px 12px', background:'#e8f5e9', border:`1.5px solid ${TEAL}`, borderRadius:8, fontSize:13, cursor:'pointer', color:GREEN, fontWeight:600, textAlign:'left', width:'100%' },
  skipRequired: { background:'#fce4ec', border:'1.5px solid #b71c1c', color:'#b71c1c' },
  editActions:  { display:'flex', gap:8 },
  btnSave:      { padding:'10px 18px', background:TEAL, color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:15 },
  btnCancel:    { padding:'10px 16px', background:'#eee', color:'#555', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:15 },
  addBox:       { padding:'10px 12px', background:'#f0f7f4', display:'flex', flexDirection:'column', gap:8 },
  addTaskBtn:   { width:'100%', padding:'11px', background:'none', border:'none', cursor:'pointer', fontSize:15, fontWeight:600, textAlign:'center' },
  resetRow:     { display:'flex', gap:10, justifyContent:'center', padding:'20px 16px 0' },
  btnReset:     { padding:'10px 20px', background:'#fff', border:`1.5px solid ${TEAL}`, color:TEAL, borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:15 },
  btnResetAll:  { padding:'10px 20px', background:'#fff', border:'1.5px solid #b71c1c', color:'#b71c1c', borderRadius:10, fontWeight:700, cursor:'pointer', fontSize:15 },
  confirmBox:   { background:'#fff', padding:14, borderRadius:12, textAlign:'center', border:'1.5px solid #ddd', display:'flex', flexDirection:'column', gap:8, alignItems:'center' },
  celebOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  celebBox:     { background:'#fff', borderRadius:20, padding:28, textAlign:'center', maxWidth:320, margin:16 },
  celebTitle:   { fontSize:24, fontWeight:800, marginBottom:4 },
}
