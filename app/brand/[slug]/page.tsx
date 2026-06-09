"use client"

import { useEffect, useState, useRef } from "react"
import { brands } from "@/lib/brands"
import Link from "next/link"
import { use } from "react"

function getTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff'
}

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const brand = brands.find(b => b.slug === slug)
  const [copied, setCopied] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(Date.now())

  const todayOffset = useRef(() => {
    const now = new Date()
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
  })

  const yearOffset = useRef(() => {
    const now = new Date()
    return (Date.now() - new Date(now.getFullYear(), 0, 1).getTime()) / 1000
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  if (!brand) return <div className="min-h-screen flex items-center justify-center text-gray-400">Not found</div>

  const fromEntry = Math.floor(elapsed * brand.perSecond)
  const today = Math.floor((todayOffset.current() + elapsed) * brand.perSecond)
  const thisYear = Math.floor((yearOffset.current() + elapsed) * brand.perSecond)
  const absurdCount = Math.max(1, Math.floor(fromEntry / brand.absurdDivisor))
  const tc = getTextColor(brand.bgColor)

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const text = `${absurdCount} ${brand.absurdUnit} since I opened this page 🤯`
    if (navigator.share) {
      navigator.share({ title: brand.name, text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const nameParts = brand.name.toUpperCase().split(" ")

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(160deg, ${brand.bgColor}dd 0%, ${brand.bgColor} 100%)` }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-2 md:px-10 md:pt-8">
        <Link href="/" style={{ color: tc, opacity: 0.3 }} className="text-xs tracking-widest uppercase font-light hover:opacity-60 transition-opacity">← Back</Link>
        <button onClick={handleShare} style={{ color: tc, opacity: 0.2 }} className="text-xs tracking-widest uppercase font-light hover:opacity-50 transition-opacity">
          {copied ? "✓" : "Share"}
        </button>
      </header>

      {/* Nombre */}
      <section className="flex flex-col items-center justify-center px-8 pt-6 pb-4">
        {nameParts.map((part, i) => (
          <p
            key={i}
            className="text-center leading-none font-thin"
            style={{
              fontSize: "clamp(2rem, 10vw, 5rem)",
              fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.03em",
              color: tc,
              opacity: 0.5
            }}
          >
            {part}
          </p>
        ))}
      </section>

      {/* FRASE ABSURDA — protagonista */}
      <section className="flex flex-col items-center justify-center px-8 py-6 text-center gap-2">
        <p style={{ color: tc, opacity: 0.4 }} className="text-xs tracking-[0.4em] uppercase">Since you arrived</p>
        <p
          className="leading-tight font-light text-center"
          style={{
            fontSize: "clamp(2rem, 8vw, 4.5rem)",
            fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.03em",
            color: tc,
          }}
        >
          <span className="tabular-nums font-thin">{absurdCount.toLocaleString("en-US")}</span>
          <br />
          <span style={{ opacity: 0.7 }}>{brand.absurdUnit}</span>
        </p>
      </section>

      <div className="mx-8 h-px" style={{ background: tc, opacity: 0.1 }} />

      {/* Contadores secundarios */}
      <section className="flex flex-col items-center px-8 py-8 gap-5">
        <div className="flex flex-col items-center gap-1">
          <p className="tabular-nums font-thin text-center"
            style={{ fontSize: "clamp(1.6rem, 6vw, 3rem)", letterSpacing: "-0.04em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", color: tc }}>
            {fromEntry.toLocaleString("en-US")}
          </p>
          <p style={{ color: tc, opacity: 0.3 }} className="text-xs tracking-[0.3em] uppercase">{brand.unit} since you arrived</p>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col items-center gap-1">
            <p className="tabular-nums font-thin text-center"
              style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", color: tc, opacity: 0.6 }}>
              {today.toLocaleString("en-US")}
            </p>
            <p style={{ color: tc, opacity: 0.3 }} className="text-xs tracking-[0.3em] uppercase">today</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="tabular-nums font-thin text-center"
              style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", color: tc, opacity: 0.6 }}>
              {thisYear.toLocaleString("en-US")}
            </p>
            <p style={{ color: tc, opacity: 0.3 }} className="text-xs tracking-[0.3em] uppercase">this year</p>
          </div>
        </div>
      </section>

      <footer className="px-8 pb-16 pt-4 text-center">
        <p style={{ color: tc, opacity: 0.15 }} className="text-xs tracking-widest font-light">{brand.source}</p>
      </footer>

    </main>
  )
}
