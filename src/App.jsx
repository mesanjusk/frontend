import { useState } from 'react'
import Routine from './Routine'
import MahiRoutine from './MahiRoutine'
import KirtiRoutine from './KirtiRoutine'

const MEMBERS = [
  { id:'sanju', name:'संजू', emoji:'☀️', sub:'Printing • Digital • Empire', color:'#d46a10', gradient:'linear-gradient(135deg,#d46a10,#7b0000)' },
  { id:'kirti', name:'किर्ती', emoji:'🌿', sub:'Advocate • AOL Teacher • Healer', color:'#00695c', gradient:'linear-gradient(135deg,#00695c,#1b5e20)' },
  { id:'mahi',  name:'माही',  emoji:'👗', sub:'Fashion • Content • Brand', color:'#c2185b', gradient:'linear-gradient(135deg,#c2185b,#880e4f)' },
]

export default function App() {
  const [active, setActive] = useState(null)

  if (active === 'sanju') return <PageWrap onBack={()=>setActive(null)}><Routine /></PageWrap>
  if (active === 'kirti') return <PageWrap onBack={()=>setActive(null)}><KirtiRoutine /></PageWrap>
  if (active === 'mahi')  return <PageWrap onBack={()=>setActive(null)}><MahiRoutine /></PageWrap>

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.om}>🕉️</div>
        <div style={styles.title}>अहूजा परिवार</div>
        <div style={styles.subtitle}>Daily Routine Planner</div>
        <div style={styles.subtitle2}>Astrology Based • Mobile First</div>
      </div>

      {/* Family Cards */}
      <div style={styles.cardWrap}>
        {MEMBERS.map(m => (
          <button key={m.id} onClick={()=>setActive(m.id)} style={{...styles.card, background:m.gradient}}>
            <div style={styles.cardEmoji}>{m.emoji}</div>
            <div style={styles.cardName}>{m.name}</div>
            <div style={styles.cardSub}>{m.sub}</div>
            <div style={styles.cardArrow}>आगे बढ़ें →</div>
          </button>
        ))}
      </div>

      {/* Quote */}
      <div style={styles.quoteBox}>
        <div style={styles.quoteText}>"यह परिवार सिर्फ परिवार नहीं</div>
        <div style={styles.quoteText}>यह एक Mission है" 🌟</div>
        <div style={styles.quoteAuthor}>🕉️ ॐ गं गणपतये नमः | जय माँ लक्ष्मी</div>
      </div>
    </div>
  )
}

function PageWrap({ children, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={styles.backBtn}>← परिवार</button>
      {children}
    </div>
  )
}

const styles = {
  root:{ fontFamily:"'Noto Sans Devanagari','Segoe UI',sans-serif", background:'#fdf8f3', minHeight:'100vh', maxWidth:480, margin:'0 auto', paddingBottom:40 },
  header:{ background:'linear-gradient(135deg,#d46a10,#7b0000)', padding:'40px 20px 30px', textAlign:'center', color:'#fff' },
  om:{ fontSize:40, marginBottom:10 },
  title:{ fontSize:28, fontWeight:800, marginBottom:4 },
  subtitle:{ fontSize:14, opacity:0.9, marginBottom:2 },
  subtitle2:{ fontSize:11, opacity:0.7 },
  cardWrap:{ padding:'20px 14px', display:'flex', flexDirection:'column', gap:14 },
  card:{ border:'none', borderRadius:20, padding:'22px 20px', textAlign:'left', cursor:'pointer', color:'#fff', boxShadow:'0 4px 16px rgba(0,0,0,0.15)', transition:'transform 0.15s' },
  cardEmoji:{ fontSize:36, marginBottom:8 },
  cardName:{ fontSize:22, fontWeight:800, marginBottom:3 },
  cardSub:{ fontSize:12, opacity:0.85, marginBottom:12 },
  cardArrow:{ fontSize:13, fontWeight:700, opacity:0.9, background:'rgba(255,255,255,0.2)', display:'inline-block', padding:'5px 14px', borderRadius:20 },
  quoteBox:{ margin:'0 14px', background:'linear-gradient(135deg,#fff9f0,#fff0e0)', border:'2px solid #d46a10', borderRadius:16, padding:18, textAlign:'center' },
  quoteText:{ fontSize:13, fontWeight:700, color:'#7b0000', lineHeight:1.6 },
  quoteAuthor:{ fontSize:11, color:'#d46a10', marginTop:8, fontWeight:600 },
  backBtn:{ display:'block', padding:'10px 16px', background:'#fff', border:'none', fontSize:13, fontWeight:700, color:'#555', cursor:'pointer', borderBottom:'1px solid #eee', width:'100%', textAlign:'left' },
}
