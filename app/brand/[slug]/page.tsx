"use client"

import { useEffect, useState, useRef } from "react"
import { brands } from "@/lib/brands"
import Link from "next/link"
import { use } from "react"

function AnimatedNumber({ perSecond, fromStart }: { perSecond: number, fromStart?: boolean }) {
  const [count, setCount] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000
      if (fromStart) {
        setCount(Math.floor(elapsed * perSecond))
      } else {
        const now = new Date()
        const secondsToday = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
        setCount(Math.floor(secondsToday * perSecond))
      }
    }, 50)
    return () => clearInterval(interval)
  }, [perSecond, fromStart])

  return <>{count.toLocaleString("es-ES")}</>
}

function AnimatedYear({ perSecond }: { perSecond: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const secondsYear = (Date.now() - new Date(now.getFullYear(), 0, 1).getTime()) / 1000
      setCount(Math.floor(secondsYear * perSecond))
    }, 50)
    return () => clearInterval(interval)
  }, [perSecond])

  return <>{count.toLocaleString("es-ES")}</>
}

export default function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const brand = brands.find(b => b.slug === slug)
  const [copied, setCopied] = useState(false)

  if (!brand) return <div className="min-h-screen flex items-center justify-center text-gray-400">Not found</div>

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const text = `¿Sabes cuántas ${brand.unit} hay cada segundo en el mundo? Míralo en tiempo real 👇`
    if (navigator.share) {
      navigator.share({ title: brand.name, text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: `linear-gradient(160deg, ${brand.bgColor}ee 0%, ${brand.bgColor} 100%)` }}>

      <header className="flex items-center justify-between px-10 py-8">
        <Link href="/" className="text-white/40 hover:text-white/70 transition-all text-xs tracking-widest uppercase font-light">
          ← Inicio
        </Link>
        <span className="text-white/30 text-xs tracking-widest uppercase font-light">{brand.name}</span>
        <button
          onClick={handleShare}
          className="text-white/40 hover:text-white/70 transition-all text-xs tracking-widest uppercase font-light"
        >
          {copied ? "✓ Copiado" : "Compartir →"}
        </button>
      </header>

      <section className="flex flex-col items-center justify-center px-10 py-12 gap-4 text-center">
        <h1 className="font-light tracking-tight text-white" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", letterSpacing: "-0.03em" }}>
          {brand.name}
        </h1>
        <p className="text-white/50 text-sm font-light max-w-md">
          Cada segundo que pasa en el mundo, {brand.perSecond.toLocaleString("es-ES")} {brand.unit}.
        </p>
      </section>

      <section className="flex flex-col px-16 py-8 gap-0 max-w-3xl mx-auto w-full">

        <div className="flex items-baseline justify-between py-10 border-b border-white/10">
          <p className="text-white/50 text-sm font-light tracking-wide shrink-0">Desde que entraste</p>
          <p className="tabular-nums font-thin text-right text-white" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif" }}>
            <AnimatedNumber perSecond={brand.perSecond} fromStart={true} />
          </p>
        </div>

        <div className="flex items-baseline justify-between py-10 border-b border-white/10">
          <p className="text-white/50 text-sm font-light tracking-wide shrink-0">Hoy</p>
          <p className="tabular-nums font-thin text-right text-white/70" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif" }}>
            <AnimatedNumber perSecond={brand.perSecond} fromStart={false} />
          </p>
        </div>

        <div className="flex items-baseline justify-between py-10 border-b border-white/10">
          <p className="text-white/50 text-sm font-light tracking-wide shrink-0">Este año</p>
          <p className="tabular-nums font-thin text-right text-white/70" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif" }}>
            <AnimatedYear perSecond={brand.perSecond} />
          </p>
        </div>

      </section>

      <section className="px-16 py-12 max-w-3xl mx-auto w-full">
        <h2 className="text-white/80 text-lg font-light mb-4" style={{ letterSpacing: "-0.02em" }}>¿De dónde vienen estos datos?</h2>
        <p className="text-white/40 text-sm font-light leading-relaxed">
          Los datos de {brand.name} se calculan a partir de cifras oficiales publicadas en {brand.source}. La tasa de {brand.perSecond.toLocaleString("es-ES")} {brand.unit} por segundo es una estimación basada en los datos anuales divididos entre los segundos del año.
        </p>
      </section>

      <footer className="px-16 py-8 flex items-center justify-between">
        <p className="text-white/20 text-xs tracking-widest font-light">{brand.source}</p>
        <button
          onClick={handleShare}
          className="px-6 py-3 rounded-full text-xs tracking-widest uppercase font-medium transition-all"
          style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}
        >
          {copied ? "✓ Copiado" : "Compartir esta página"}
        </button>
      </footer>

    </main>
  )
}
