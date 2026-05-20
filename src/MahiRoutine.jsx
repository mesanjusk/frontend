import { useState, useEffect } from 'react'

const AREA_META = {
  '🎨': { label: 'Creative',   bg: '#fce4ec', color: '#880e4f' },
  '📚': { label: 'Study',      bg: '#e8eaf6', color: '#1a237e' },
  '🕉️': { label: 'Spiritual',  bg: '#fff0f5', color: '#7b0000' },
  '🏥': { label: 'Health',     bg: '#fff0f0', color: '#c62828' },
  '👗': { label: 'Fashion',    bg: '#f3e5f5', color: '#6a1b9a' },
  '📱': { label: 'Instagram',  bg: '#e8f5e9', color: '#1b5e20' },
  '❤️': { label: 'Family',     bg: '#fce4ec', color: '#880e4f' },
  '🧠': { label: 'Focus',      bg: '#e3f2fd', color: '#1565c0' },
  '💪': { label: 'Growth',     bg: '#fff8e1', color: '#f57f17' },
}

const MAHI_TASKS = [
  // MORNING
  { id:1,  section:'🌅 सुबह — Spiritual',    time:'6:00 AM', task:'उठें — Phone नहीं छूना (आर्द्रा नक्षत्र की शक्ति)', tags:['🕉️'],      pinned:false },
  { id:2,  section:'🌅 सुबह — Spiritual',    time:'6:05 AM', task:'गुनगुना पानी — 1 गिलास (तुला लग्न — Digestion)',    tags:['🏥'],      pinned:false },
  { id:3,  section:'🌅 सुबह — Spiritual',    time:'6:10 AM', task:"माँ के साथ तुलसी पूजा (Family bond + Spiritual)",   tags:['🕉️','❤️'], pinned:true  },
  { id:4,  section:'🌅 सुबह — Spiritual',    time:'6:20 AM', task:"'ॐ ऐं सरस्वत्यै नमः' — 21 बार (Studies + Creative)",tags:['🕉️','📚'], pinned:false },
  { id:5,  section:'🌅 सुबह — Spiritual',    time:'6:25 AM', task:"'ॐ शुं शुक्राय नमः' — 21 बार (Fashion + Beauty)",   tags:['🕉️','👗'], pinned:false },
  { id:6,  section:'🌅 सुबह — Spiritual',    time:'6:30 AM', task:'Journaling — आज के 3 Goals + Creative Ideas लिखें', tags:['🧠','🎨'], pinned:true  },
  { id:7,  section:'🌅 सुबह — Spiritual',    time:'6:45 AM', task:'Yoga या Dance — 30 मिनट (Dance भी Exercise है!)',    tags:['🏥','💪'], pinned:false },
  { id:8,  section:'🌅 सुबह — Spiritual',    time:'7:15 AM', task:'तैयार हों — आज का Outfit Plan (Fashion Practice)',  tags:['👗'],      pinned:false },
  { id:9,  section:'🌅 सुबह — Spiritual',    time:'7:30 AM', task:'पौष्टिक नाश्ता — Skip कभी नहीं (Growing age)',     tags:['🏥'],      pinned:false },
  // STUDY
  { id:10, section:'📚 पढ़ाई — Study Block', time:'8:00 AM', task:'School/College — पूरे ध्यान से (पढ़ाई पहले)',       tags:['📚'],      pinned:true  },
  { id:11, section:'📚 पढ़ाई — Study Block', time:'8:00 AM', task:'उत्तर-पूर्व दिशा में बैठें — Focus बढ़ेगा',         tags:['📚','🧠'], pinned:false },
  // AFTERNOON
  { id:12, section:'🎨 Creative Block',      time:'2:00 PM', task:'30 मिनट Rest — Return से पहले',                    tags:['🏥'],      pinned:false },
  { id:13, section:'🎨 Creative Block',      time:'2:30 PM', task:'Homework + Assignments — पहले (पढ़ाई priority)',    tags:['📚'],      pinned:true  },
  { id:14, section:'🎨 Creative Block',      time:'4:00 PM', task:'Fashion Research — Pinterest, Vogue, Instagram',    tags:['👗','🎨'], pinned:false },
  { id:15, section:'🎨 Creative Block',      time:'4:30 PM', task:'Mood Board बनाएं — Canva या Notebook में',          tags:['🎨','👗'], pinned:false },
  { id:16, section:'🎨 Creative Block',      time:'5:00 PM', task:'Fashion Sketching या Design work — 30 मिनट',       tags:['🎨','👗'], pinned:false },
  // INSTAGRAM
  { id:17, section:'📱 Instagram + Brand',   time:'5:30 PM', task:'आज का Content Plan करें — 1 Reel या Post idea',    tags:['📱','🎨'], pinned:false },
  { id:18, section:'📱 Instagram + Brand',   time:'5:45 PM', task:'Content Create करें — Photo या Video (शुक्रवार को post)',tags:['📱'], pinned:false },
  { id:19, section:'📱 Instagram + Brand',   time:'6:15 PM', task:'Fashion Accounts Study करें — Masaba, Raw Mango',   tags:['📱','👗'], pinned:false },
  { id:20, section:'📱 Instagram + Brand',   time:'6:30 PM', task:'Cousin से Brand Planning — WhatsApp/Call (weekly)', tags:['📱','❤️'], pinned:false },
  // FAMILY
  { id:21, section:'❤️ परिवार + Grounding', time:'6:00 PM', task:'माँ के साथ बगीचे में — 15 मिनट (Grounding जरूरी)', tags:['❤️','🏥'], pinned:true  },
  { id:22, section:'❤️ परिवार + Grounding', time:'7:00 PM', task:'Family Time — Phone रखें, बात करें',               tags:['❤️'],      pinned:false },
  { id:23, section:'❤️ परिवार + Grounding', time:'8:00 PM', task:'Family Dinner — तीनों साथ, Phone नहीं',            tags:['❤️','🏥'], pinned:true  },
  { id:24, section:'❤️ परिवार + Grounding', time:'8:00 PM', task:'दिन की 1 अच्छी बात share करें — हर कोई',          tags:['❤️'],      pinned:false },
  // WIND DOWN
  { id:25, section:'🌙 रात — Wind Down',    time:'8:30 PM', task:'Fashion/Branding Books पढ़ें — 30 मिनट',            tags:['📚','👗'], pinned:false },
  { id:26, section:'🌙 रात — Wind Down',    time:'9:00 PM', task:'Screen Time बंद — आंखों के लिए (Screen बहुत है)',  tags:['🏥'],      pinned:true  },
  { id:27, section:'🌙 रात — Wind Down',    time:'9:15 PM', task:'Gratitude Journal — आज क्या अच्छा हुआ (3 चीजें)', tags:['🕉️','🧠'], pinned:false },
  { id:28, section:'🌙 रात — Wind Down',    time:'9:20 PM', task:'कल के 3 Goals लिखें — Diary में',                  tags:['🧠'],      pinned:false },
  { id:29, section:'🌙 रात — Wind Down',    time:'9:30 PM', task:'सोएं — 9 घंटे (Growing age में जरूरी)',            tags:['🏥'],      pinned:true  },
]

const SECTION_COLORS = {
  '🌅 सुबह — Spiritual':    { bg:'#fff5e6', accent:'#d46a10' },
  '📚 पढ़ाई — Study Block': { bg:'#e8eaf6', accent:'#1a237e' },
  '🎨 Creative Block':      { bg:'#f3e5f5', accent:'#6a1b9a' },
  '📱 Instagram + Brand':   { bg:'#e8f5e9', accent:'#1b5e20' },
  '❤️ परिवार + Grounding': { bg:'#fce4ec', accent:'#880e4f' },
  '🌙 रात — Wind Down':    { bg:'#fbe9e7', accent:'#7b0000' },
}

const STORAGE_KEY = 'mahi_routine_v1'

function loadState() {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s) } catch {}
  return null
}

function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

export default function MahiRoutine() {
  const saved = loadState()
  const [tasks, setTasks] = useState(saved?.tasks || MAHI_TASKS)
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

  const sc = (sec) => SECTION_COLORS[sec] || { bg:'#f9f9f9', accent:'#880e4f' }

  const PINK = '#c2185b'
  const DPINK = '#880e4f'

  return (
    <div style={S.root}>
      <header style={{...S.header, background:'linear-gradient(135deg, #c2185b 0%, #880e4f 100%)'}}>
        <div style={S.headerTop}>
          <div>
            <div style={S.headerTitle}>👗 माही अहूजा</div>
            <div style={S.headerSub}>Fashion Entrepreneur • Content Creator</div>
            <div style={{...S.headerSub, color:'#ffb3c6', fontSize:10}}>तुला लग्न • मकर राशि • आर्द्रा नक्षत्र</div>
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
        {[['today','📋 आज'],['weekly','📅 Weekly'],['brand','👗 Brand'],['mantras','🕉️ Mantras']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{...S.navBtn,...(view===v?{...S.navBtnActive,borderBottomColor:PINK,color:PINK}:{})}}>
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
              style={{...S.filterChip,...(activeFilter===a?{background:a==='ALL'?PINK:(AREA_META[a]?.color||'#333'),color:'#fff'}:{})}}>
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
            <div key={sec} style={{...S.section, background:c.bg}}>
              <div style={{...S.sectionHeader, borderLeftColor:c.accent}}>
                <span style={S.sectionTitle}>{sec}</span>
                <span style={{...S.sectionBadge, background:c.accent}}>{secDone}/{secTasks.length}</span>
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
                        <button onClick={saveEdit} style={{...S.btnSave,background:PINK}}>💾 Save</button>
                        <button onClick={()=>setEditingId(null)} style={S.btnCancel}>✕</button>
                      </div>
                    </div>
                  ):(
                    <div style={S.taskRow} onClick={()=>toggle(t.id)}>
                      <div style={{...S.checkbox,...(done[t.id]?{...S.checkboxDone,background:PINK}:{}),borderColor:c.accent}}>
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
                    <button onClick={()=>addTask(sec)} style={{...S.btnSave,background:PINK}}>➕ Add</button>
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
          <button onClick={()=>setDone({})} style={{...S.btnReset,borderColor:PINK,color:PINK}}>🔄 Reset Today</button>
        </div>
      </>}

      {view==='weekly' && <MahiWeekly />}
      {view==='brand' && <MahiBrand />}
      {view==='mantras' && <MahiMantras />}

      {showCelebrate&&(
        <div style={S.celebrateOverlay} onClick={()=>setShowCelebrate(false)}>
          <div style={S.celebrateBox}>
            <div style={{fontSize:56,marginBottom:8}}>🌟</div>
            <div style={{...S.celebrateTitle,color:PINK}}>शाबाश माही!</div>
            <div style={S.celebrateSub}>आज का पूरा Routine complete किया!</div>
            <div style={{...S.celebrateQuote,color:DPINK}}>&quot;Gondia की माही — India की अगली बड़ी Fashion Entrepreneur&quot; 👗</div>
            <button onClick={()=>setShowCelebrate(false)} style={{...S.btnSave,background:PINK}}>🌸 जय सरस्वती माँ</button>
          </div>
        </div>
      )}
    </div>
  )
}

function MahiWeekly() {
  const days = [
    { day:'सोमवार 🌙', focus:'Study + Fashion Research', color:'#1a237e', tip:'Weekly study targets set करें', remedy:'शिव मंदिर — माँ के साथ' },
    { day:'मंगलवार 🔴', focus:'Creative + Sketching',   color:'#b71c1c', tip:'New fashion design try करें', remedy:'हनुमान जी — माँ के साथ' },
    { day:'बुधवार 💚',  focus:'Study Deep Work',         color:'#00695c', tip:'Toughest subject आज पढ़ें', remedy:"'ॐ बुं बुधाय नमः' 21 बार" },
    { day:'गुरुवार 🌕', focus:'Brand Planning',          color:'#4a148c', tip:'Cousin के साथ Brand meeting', remedy:'पीला रंग पहनें' },
    { day:'शुक्रवार 💕', focus:'Instagram + Content',   color:'#880e4f', tip:'Best content post करें आज', remedy:"'ॐ शुं शुक्राय नमः' 108 बार" },
    { day:'शनिवार 🪐',  focus:'Portfolio + Mood Board', color:'#37474f', tip:'Weekly creative review', remedy:'माँ के साथ Satsang' },
    { day:'रविवार ☀️',  focus:'REST + Family',           color:'#e65100', tip:'Family + बगीचे में time', remedy:'माँ के साथ — AOL practice' },
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      {days.map(d=>(
        <div key={d.day} style={{background:'#fff',borderRadius:14,padding:'14px 16px',marginBottom:10,borderTop:`4px solid ${d.color}`,boxShadow:'0 2px 8px rgba(0,0,0,0.07)'}}>
          <div style={{fontSize:16,fontWeight:800,color:d.color,marginBottom:4}}>{d.day}</div>
          <div style={{fontSize:13,fontWeight:700,color:'#333',marginBottom:6}}>{d.focus}</div>
          <div style={{fontSize:12,color:'#555',marginBottom:3}}>💡 {d.tip}</div>
          <div style={{fontSize:12,color:'#888'}}>🕉️ {d.remedy}</div>
        </div>
      ))}
    </div>
  )
}

function MahiBrand() {
  const milestones = [
    { year:'अभी', goal:'Instagram Account शुरू करें — Fashion niche', status:'🟡', color:'#f57f17' },
    { year:'2025', goal:'NIFT/Pearl Academy — Fashion Communication Admission', status:'🎯', color:'#1a237e' },
    { year:'2026', goal:'पहले 1000 Genuine Followers', status:'📈', color:'#00695c' },
    { year:'2027', goal:'Cousin के साथ Brand Partnership official', status:'👥', color:'#6a1b9a' },
    { year:'2028', goal:'Internship — Vogue/Myntra/Nykaa Fashion', status:'💼', color:'#880e4f' },
    { year:'2029', goal:'Graduate + Brand Soft Launch', status:'🚀', color:'#c2185b' },
    { year:'2031', goal:'50K+ Followers + Major Brand Deals', status:'🌟', color:'#d46a10' },
    { year:'2035', goal:'Established Fashion Brand — ₹5 Crore+', status:'👑', color:'#b8860b' },
  ]
  const tips = [
    "Brand Name: अपना नाम या कुछ unique — Elegant + Indian",
    "Brand Colors: Cream, Sage Green, Gold — शुक्र के रंग",
    "Niche: 'Design Student Life' — लगभग खाली है!",
    "Tagline: 'Design your life, Brand your story'",
    "पिता का Printing = Packaging FREE | Marketing FREE",
    "मामा = Ethnic vendor network | मौसी = Production support",
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      <div style={{fontSize:16,fontWeight:800,color:'#880e4f',textAlign:'center',padding:'8px 0 12px'}}>👗 Fashion Brand Roadmap</div>
      {milestones.map((m,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${m.color}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)',display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontSize:24}}>{m.status}</div>
          <div>
            <div style={{fontSize:12,fontWeight:800,color:m.color,marginBottom:2}}>{m.year}</div>
            <div style={{fontSize:13,color:'#222'}}>{m.goal}</div>
          </div>
        </div>
      ))}
      <div style={{fontSize:16,fontWeight:800,color:'#880e4f',textAlign:'center',padding:'12px 0 8px'}}>💡 Brand Tips</div>
      {tips.map((t,i)=>(
        <div key={i} style={{background:'#fce4ec',borderRadius:10,padding:'10px 14px',marginBottom:6,fontSize:12,color:'#880e4f',fontWeight:600}}>
          ✨ {t}
        </div>
      ))}
    </div>
  )
}

function MahiMantras() {
  const mantras = [
    { when:'रोज सुबह', mantra:"'ॐ ऐं सरस्वत्यै नमः' — 21 बार", benefit:'Studies + Creativity + Art', color:'#1a237e' },
    { when:'रोज सुबह', mantra:"'ॐ शुं शुक्राय नमः' — 21 बार",   benefit:'Fashion + Beauty + Success', color:'#880e4f' },
    { when:'शुक्रवार',  mantra:"'ॐ शुं शुक्राय नमः' — 108 बार",  benefit:'Brand Growth + Instagram', color:'#c2185b' },
    { when:'बुधवार',   mantra:"'ॐ बुं बुधाय नमः' — 21 बार",      benefit:'Communication + Study Focus', color:'#00695c' },
    { when:'शनिवार',   mantra:"'ॐ रां राहवे नमः' — 108 बार",     benefit:'Social Media + Mass Appeal', color:'#37474f' },
    { when:'Exam से पहले',mantra:"'ॐ ऐं ह्रीं क्लीं' — 21 बार", benefit:'Memory + Concentration', color:'#6a1b9a' },
    { when:'रात रोज',  mantra:"Gratitude + 3 अच्छी बातें",        benefit:'Positive mindset + Sleep', color:'#7b0000' },
  ]
  return (
    <div style={{padding:'10px 10px 20px'}}>
      <div style={{fontSize:16,fontWeight:800,color:'#880e4f',textAlign:'center',padding:'8px 0 12px'}}>🕉️ माही के Mantras</div>
      {mantras.map((m,i)=>(
        <div key={i} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,borderLeft:`4px solid ${m.color}`,boxShadow:'0 1px 5px rgba(0,0,0,0.06)'}}>
          <div style={{fontSize:11,fontWeight:800,color:m.color,marginBottom:3}}>{m.when}</div>
          <div style={{fontSize:14,fontWeight:700,color:'#222',marginBottom:3}}>{m.mantra}</div>
          <div style={{fontSize:11,color:'#666'}}>✨ {m.benefit}</div>
        </div>
      ))}
      <div style={{background:'linear-gradient(135deg,#fce4ec,#f3e5f5)',border:'2px solid #c2185b',borderRadius:14,padding:18,marginTop:12,textAlign:'center'}}>
        <div style={{fontSize:14,fontWeight:700,color:'#880e4f',lineHeight:1.6}}>&quot;Gondia की माही</div>
        <div style={{fontSize:14,fontWeight:700,color:'#880e4f',lineHeight:1.6}}>India की अगली बड़ी Fashion Entrepreneur&quot; 🌟</div>
        <div style={{fontSize:12,color:'#c2185b',marginTop:8,fontWeight:600}}>🌸 ॐ ऐं सरस्वत्यै नमः</div>
      </div>
    </div>
  )
}

const S = {
  root:{ fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif",background:'#fdf5f7',minHeight:'100vh',maxWidth:480,margin:'0 auto',paddingBottom:40 },
  header:{ padding:'20px 16px 12px',color:'#fff' },
  headerTop:{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 },
  headerTitle:{ fontSize:22,fontWeight:700 },
  headerSub:{ fontSize:12,opacity:0.85,marginTop:2 },
  progressBar:{ borderRadius:8,height:6,overflow:'hidden' },
  progressFill:{ height:'100%',borderRadius:8,transition:'width 0.4s' },
  progressText:{ fontSize:11,opacity:0.85,marginTop:5,textAlign:'right' },
  nav:{ display:'flex',background:'#fff',borderBottom:'2px solid #f8e0e8',position:'sticky',top:0,zIndex:10 },
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
  taskDragOver:{ background:'#fdf0f5',boxShadow:'inset 0 0 0 2px #c2185b' },
  taskRow:{ display:'flex',alignItems:'flex-start',gap:10,padding:'10px 12px',cursor:'pointer' },
  checkbox:{ width:22,height:22,border:'2px solid',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2,transition:'all 0.2s' },
  checkboxDone:{ },
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
  addBox:{ padding:'10px 12px',background:'#fff9fb',display:'flex',flexDirection:'column',gap:8 },
  addTaskBtn:{ width:'100%',padding:'9px',background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:600,textAlign:'center' },
  resetRow:{ display:'flex',justifyContent:'center',padding:'20px 16px 0' },
  btnReset:{ padding:'9px 18px',background:'#fff',border:'1.5px solid',borderRadius:10,fontWeight:700,cursor:'pointer',fontSize:13 },
  celebrateOverlay:{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100 },
  celebrateBox:{ background:'#fff',borderRadius:20,padding:28,textAlign:'center',maxWidth:320,margin:16 },
  celebrateTitle:{ fontSize:22,fontWeight:800,marginBottom:4 },
  celebrateSub:{ fontSize:14,color:'#555',marginBottom:8 },
  celebrateQuote:{ fontSize:13,fontWeight:600,fontStyle:'italic',marginBottom:16 },
}
