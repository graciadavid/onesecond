"use client"

import { useEffect, useState, useRef } from "react"
import { brands } from "@/lib/brands"
import Link from "next/link"
import { use } from "react"

function useCounter(perSecond: number, fromStart: boolean) {
  const [count, setCount] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      if (fromStart) {
        setCount(Math.floor(((Date.now() - startRef.current) / 1000) * perSecond))
      } else {
        const now = new Date()
        const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
        setCount(Math.floor(secondsToday * perSecond))
      }
    }, 50)
    return () => clearInterval(interval)
  }, [perSecond, fromStart])

  return count
}

function useYearCounter(perSecond: number) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const secondsYear = (Date.now() - new Date(now.getFullYear(), 0, 1).getTime()) / 1000
      setCount(Math.floor(secondsYear * perSecond))
    }, 50)
    return () => clearInterval(interval)
  }, [perSecond])
  return count
}

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const brand = brands.find(b => b.slug === slug)
  const [copied, setCopied] = useState(false)

  const fromEntry = useCounter(brand?.perSecond || 0, true)
  const today = useCounter(brand?.perSecond || 0, false)
  const thisYear = useYearCounter(brand?.perSecond || 0)

  if (!brand) return <div className="min-h-screen flex items-center justify-center text-gray-400">Not found</div>

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
    <main className="min-h-screen flex flex-col" style={{ background: `linear-gradient(160deg, ${brand.bgColor}dd 0%, ${brand.bgColor} 100%)` }}>

      <header className="flex items-center justify-between px-5 md:px-10 py-5 md:py-6">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-all text-xs tracking-widest uppercase font-light">← Back</Link>
        <button onClick={handleShare} className="text-white/40 hover:text-white/70 transition-all text-xs tracking-widest uppercase font-light">
          {copied ? "✓ Copied" : "Share →"}
        </button>
      </header>

      <section className="flex-1 flex flex-col justify-center px-6 md:px-16 py-6 md:py-8 max-w-4xl mx-auto w-full gap-8 md:gap-10">

        <h1 className="text-white font-light uppercase tracking-widest text-xs md:text-sm">
          {brand.name}
        </h1>

        <div className="flex flex-col gap-3">
          <p className="text-white/50 text-xs tracking-widest uppercase font-light">Since you arrived</p>
          <p className="text-white leading-snug font-light"
            style={{
              fontSize: "clamp(1.4rem, 5vw, 2.8rem)",
              fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.02em"
            }}>
            <span className="tabular-nums">
              {absurdCount.toLocaleString("en-US")}
            </span>
            {" "}{brand.absurdUnit}
          </p>
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex flex-col gap-5 md:gap-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-white/50 font-light shrink-0 text-sm md:text-base">
              {brand.unit} since you arrived
            </p>
            <p className="tabular-nums font-thin text-white text-right"
              style={{
                fontSize: "clamp(1.6rem, 6vw, 3rem)",
                letterSpacing: "-0.03em",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              }}>
              {fromEntry.toLocaleString("en-US")}
            </p>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <p className="text-white/50 font-light shrink-0 text-sm md:text-base">
              {brand.unit} today
            </p>
            <p className="tabular-nums font-thin text-white/60 text-right"
              style={{
                fontSize: "clamp(1.6rem, 6vw, 3rem)",
                letterSpacing: "-0.03em",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              }}>
              {today.toLocaleString("en-US")}
            </p>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <p className="text-white/50 font-light shrink-0 text-sm md:text-base">
              {brand.unit} this year
            </p>
            <p className="tabular-nums font-thin text-white/60 text-right"
              style={{
                fontSize: "clamp(1.6rem, 6vw, 3rem)",
                letterSpacing: "-0.03em",
                fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
              }}>
              {thisYear.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <p className="text-white/20 text-xs font-light tracking-widest">
          Source: {brand.source}
        </p>

      </section>

      <footer className="px-6 md:px-16 py-5 md:py-6 flex items-center justify-between">
        <p className="text-white/20 text-xs tracking-widest font-light">Every Second</p>
        <button onClick={handleShare}
          className="px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}>
          {copied ? "✓ Copied" : "Share"}
        </button>
      </footer>

    </main>
  )
}
