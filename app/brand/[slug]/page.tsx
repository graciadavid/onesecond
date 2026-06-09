"use client"

import { useEffect, useState, useRef } from "react"
import { brands } from "@/lib/brands"
import Link from "next/link"
import { use } from "react"

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

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(160deg, ${brand.bgColor}dd 0%, ${brand.bgColor} 100%)` }}
    >
      {/* SAFE ZONE TOP — 80px para overlays de apps */}
      <header className="flex items-center justify-between px-6 pt-14 pb-4 md:px-10 md:pt-8">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-all text-xs tracking-widest uppercase font-light">← Back</Link>
        <span className="text-white/30 text-xs tracking-widest uppercase font-light">{brand.name}</span>
        <button onClick={handleShare} className="text-white/40 hover:text-white/70 transition-all text-xs tracking-widest uppercase font-light">
          {copied ? "✓" : "Share"}
        </button>
      </header>

      {/* CONTENIDO CENTRAL — zona segura */}
      <section className="flex-1 flex flex-col justify-center px-8 md:px-16 py-8 max-w-2xl mx-auto w-full gap-10">

        {/* Dato absurdo */}
        <div className="flex flex-col gap-3">
          <p className="text-white/40 text-xs tracking-[0.4em] uppercase">Since you arrived</p>
          <p
            className="text-white font-light leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 6vw, 3rem)",
              fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.02em"
            }}
          >
            <span className="tabular-nums">{absurdCount.toLocaleString("en-US")}</span>
            {" "}{brand.absurdUnit}
          </p>
        </div>

        <div className="h-px bg-white/10" />

        {/* Tres contadores */}
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-white/40 text-sm font-light shrink-0">arrived</p>
            <p
              className="tabular-nums font-thin text-white text-right"
              style={{
                fontSize: "clamp(1.8rem, 8vw, 3.5rem)",
                letterSpacing: "-0.03em",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              }}
            >
              {fromEntry.toLocaleString("en-US")}
            </p>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <p className="text-white/40 text-sm font-light shrink-0">today</p>
            <p
              className="tabular-nums font-thin text-white/60 text-right"
              style={{
                fontSize: "clamp(1.8rem, 8vw, 3.5rem)",
                letterSpacing: "-0.03em",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              }}
            >
              {today.toLocaleString("en-US")}
            </p>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <p className="text-white/40 text-sm font-light shrink-0">this year</p>
            <p
              className="tabular-nums font-thin text-white/60 text-right"
              style={{
                fontSize: "clamp(1.8rem, 8vw, 3.5rem)",
                letterSpacing: "-0.03em",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              }}
            >
              {thisYear.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <p className="text-white/20 text-xs font-light tracking-widest">
          {brand.unit} · {brand.source}
        </p>

      </section>

      {/* SAFE ZONE BOTTOM — 80px para overlays de apps */}
      <footer className="px-6 pb-16 pt-4 md:px-16 md:pb-8 flex items-center justify-between">
        <p className="text-white/15 text-xs tracking-widest font-light">Every Second</p>
        <button
          onClick={handleShare}
          className="px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
        >
          {copied ? "✓ Copied" : "Share"}
        </button>
      </footer>

    </main>
  )
}
