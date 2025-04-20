import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import QRCode from 'qrcode.react'

const socket = io('https://backend-4duv.onrender.com')

export default function App() {
  const [qr, setQr] = useState('')
  const [number, setNumber] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    socket.on('qr', setQr)
    return () => socket.off('qr')
  }, [])

  const handleSend = () => {
    socket.emit('send-message', { number, message })
    setSent(true)
    setTimeout(() => setSent(false), 2000)
  }

  return (
    <div>
      <h2>WhatsApp QR Code</h2>
      {qr ? <QRCode value={qr} size={256} /> : <p>Waiting for QR...</p>}

      <h3>Send WhatsApp Message</h3>
      <input placeholder="Phone Number" value={number} onChange={e => setNumber(e.target.value)} />
      <input placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
      {sent && <p>✅ Sent!</p>}
    </div>
  )
}
