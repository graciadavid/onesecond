"use client"

import { useEffect, useState, useRef } from "react"
import { brands } from "@/lib/brands"
import Link from "next/link"
import { use } from "react"
import { useRouter } from "next/navigation"

function getTextColor(bgColor: string): string {
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#1a1a1a' : '#ffffff'
}

function useCounter(perSecond: number) {
  const [value, setValue] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000
      setValue(Math.floor(elapsed * perSecond))
    }, 500)
    return () => clearInterval(interval)
  }, [perSecond])

  return value
}

export default function BrandPage({ params }: { params: Promise<{ category: string, seoSlug: string }> }) {
  const { category, seoSlug } = use(params)
  const brand = brands.find(b => b.seoSlug === seoSlug && b.category === category)
  const [copied, setCopied] = useState(false)
  const [swiping, setSwiping] = useState(false)
  const touchStartY = useRef(0)
  const router = useRouter()

  const fromEntry = useCounter(brand?.perSecond || 0)

  if (!brand) return <div className="min-h-screen flex items-center justify-center text-gray-400">Not found</div>

  const allInCat = brands.filter(b => b.category === brand.category)
  const currentIndex = allInCat.findIndex(b => b.slug === brand.slug)
  const nextBrand = allInCat[(currentIndex + 1) % allInCat.length]
  const absurdCount = Math.max(1, Math.floor(fromEntry / brand.absurdDivisor))
  const tc = getTextColor(brand.bgColor)

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const text = `${fromEntry.toLocaleString("en-US")} ${brand.unit} since I opened this page 🤯 wikiseconds.com`
    if (navigator.share) {
      navigator.share({ title: brand.name, text, url })
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (diff < 80) return
    setSwiping(true)
    setTimeout(() => {
      router.push(`/${nextBrand.category}/${nextBrand.seoSlug}`)
      setSwiping(false)
    }, 300)
  }

  const nameParts = brand.name.toUpperCase().split(" ")

  return (
    <main
      className="min-h-screen flex flex-col transition-opacity duration-300"
      style={{ opacity: swiping ? 0.3 : 1 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* BLOQUE 1 — Nombre — color marca */}
      <section
        className="flex flex-col items-center px-8 pt-12 pb-10 text-center gap-3"
        style={{ background: `linear-gradient(160deg, ${brand.bgColor}dd 0%, ${brand.bgColor} 100%)` }}
      >
        <div className="flex items-center justify-between w-full px-0 mb-4">

          <Link href="/" className="text-xs font-light tracking-widest uppercase hover:opacity-70" style={{ color: tc }}>
            Wiki<span className="font-bold">Seconds</span>
          </Link>
  
        </div>
        {nameParts.map((part, i) => (
          <p key={i} className="text-center leading-none font-thin"
            style={{ fontSize: "clamp(2.5rem, 12vw, 6rem)", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", letterSpacing: "-0.03em", color: tc }}>
            {part}
          </p>
        ))}

      </section>

      {/* BLOQUE 2 — Since you arrived — invertido */}
      <section
        className="flex flex-col items-center justify-center px-8 py-12 text-center gap-4"
        style={{ background: tc }}
      >
        <p className="text-xs tracking-[0.4em] uppercase" style={{ color: brand.bgColor, opacity: 0.6 }}>Since you arrived</p>
        <p
          className="tabular-nums font-thin leading-none"
          style={{
            fontSize: "clamp(4rem, 18vw, 10rem)",
            fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
            letterSpacing: "-0.04em",
            color: brand.bgColor,
          }}
        >
          {fromEntry.toLocaleString("en-US")}
        </p>
        <p className="text-sm font-light tracking-widest uppercase" style={{ color: brand.bgColor, opacity: 0.7 }}>{brand.unit}</p>
        <button
          onClick={handleShare}
          className="mt-2 text-xs tracking-widest uppercase font-light hover:opacity-70 transition-opacity"
          style={{ color: brand.bgColor, border: `1px solid ${brand.bgColor}`, borderRadius: "9999px", padding: "8px 20px" }}
        >
          {copied ? "✓ Copied" : "Share"}
        </button>
      </section>

      {/* BLOQUE 3 — Dato absurdo + swipe — vuelve al color marca */}
      <section
        className="flex flex-col items-center px-8 py-10 text-center gap-4"
        style={{ background: `linear-gradient(160deg, ${brand.bgColor}dd 0%, ${brand.bgColor} 100%)` }}
      >
        <p className="font-light leading-snug text-center max-w-xs"
          style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", letterSpacing: "-0.02em", color: tc }}>
          <span className="tabular-nums font-thin">{absurdCount.toLocaleString("en-US")}</span>
          {" "}{brand.absurdUnit}
        </p>

        {/* Mobile swipe */}
        <div className="flex md:hidden flex-col items-center pt-4 gap-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: tc, opacity: 0.4 }}>swipe up</p>
          <p className="text-xs" style={{ color: tc, opacity: 0.4 }}>↑</p>
          <p className="text-xs tracking-widest uppercase font-medium" style={{ color: tc, opacity: 0.6 }}>{nextBrand.name}</p>
        </div>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center justify-center gap-4 pt-4">
          <Link
            href={`/${nextBrand.category}/${nextBrand.seoSlug}`}
            className="px-8 py-3 rounded-full text-xs tracking-widest uppercase font-medium transition-all hover:opacity-80"
            style={{ border: `1px solid ${tc}`, color: tc, background: "transparent" }}
          >
            Next: {nextBrand.name} →
          </Link>
          <button
            onClick={handleShare}
            className="px-8 py-3 rounded-full text-xs tracking-widest uppercase font-medium transition-all hover:opacity-80"
            style={{ border: `1px solid ${tc}`, color: tc, background: "transparent" }}
          >
            {copied ? "✓ Copied" : "Share"}
          </button>
        </div>

        <p className="text-xs tracking-widest font-light mt-4" style={{ color: tc, opacity: 0.3 }}>Data source: {brand.source}</p>
      </section>

    </main>
  )
}
