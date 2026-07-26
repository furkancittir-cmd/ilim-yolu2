import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl rounded-3xl bg-white p-8 shadow">
        <h1 className="text-3xl font-black text-emerald-900">İlim Yolu</h1>
        <p className="mt-4 text-slate-700 leading-7">
          Bu paket, Vercel / GitHub'a yüklemek için hazır bir Vite başlangıç yapısıdır.
          Canvas'taki en güncel App kodunu buradaki <code>src/App.jsx</code> dosyasına yapıştırdığında
          site aynı şekilde çalışır.
        </p>
        <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
          Kurulum: <br />
          1) <code>npm install</code><br />
          2) <code>npm run dev</code><br />
          3) GitHub'a yükle<br />
          4) Vercel'de Deploy
        </div>
      </div>
    </div>
  )
}