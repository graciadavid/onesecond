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

export default function BrandPage({ params }: { params: Promise<{ category: string, seoSlug: string }> }) {
 const { category, seoSlug } = use(params)
 const brand = brands.find(b => b.seoSlug === seoSlug && b.category === category)
 const [copied, setCopied] = useState(false)
 const [elapsed, setElapsed] = useState(0)
 const [swiping, setSwiping] = useState(false)
 const startRef = useRef(Date.now())
 const touchStartY = useRef(0)
 const router = useRouter()

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

 const sameCat = brands.filter(b => b.category === brand.category && b.slug !== brand.slug)
 const currentIndex = sameCat.findIndex(b => b.slug === brand.slug)
 const nextBrand = sameCat[(currentIndex + 1) % sameCat.length]
 const prevBrand = sameCat[(currentIndex - 1 + sameCat.length) % sameCat.length]

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

 const handleTouchStart = (e: React.TouchEvent) => {
   touchStartY.current = e.touches[0].clientY
 }

 const handleTouchEnd = (e: React.TouchEvent) => {
   const diff = touchStartY.current - e.changedTouches[0].clientY
   if (Math.abs(diff) < 50) return
   setSwiping(true)
   setTimeout(() => {
     if (diff > 0 && nextBrand) router.push(`/${nextBrand.category}/${nextBrand.seoSlug}`)
     
     setSwiping(false)
   }, 300)
 }

 const nameParts = brand.name.toUpperCase().split(" ")

 return (
   <main
     className="min-h-screen flex flex-col transition-opacity duration-300"
     style={{
       background: `linear-gradient(160deg, ${brand.bgColor}dd 0%, ${brand.bgColor} 100%)`,
       opacity: swiping ? 0.3 : 1,
       color: tc
     }}
     onTouchStart={handleTouchStart}
     onTouchEnd={handleTouchEnd}
   >
     <header className="flex items-center justify-between px-6 pt-12 pb-2 md:px-10 md:pt-8">
       <Link href="/" className="text-xs md:text-sm font-light tracking-widest uppercase hover:opacity-70 transition-opacity" style={{ color: tc }}>
         Wiki<span className="font-bold">Seconds</span>
       </Link>
       <button onClick={handleShare} className="text-xs tracking-widest uppercase font-light hover:opacity-70 transition-opacity" style={{ color: "#ffffff", border: "1px solid #ffffff", borderRadius: "9999px", padding: "6px 16px" }}>
         {copied ? "✓ Copied" : "Share"}
       </button>
     </header>

     <section className="flex flex-col items-center justify-center px-8 pt-6 pb-4">
       {nameParts.map((part, i) => (
         <p key={i} className="text-center leading-none font-thin"
           style={{ fontSize: "clamp(2rem, 10vw, 5rem)", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", letterSpacing: "-0.03em", color: tc }}>
           {part}
         </p>
       ))}
     </section>
       <hr className="mt-4 border-0 h-px w-24 md:w-48" style={{ background: tc, opacity: 0.4 }} />

     <section className="flex flex-col items-center justify-center px-8 py-6 text-center gap-2">
       <p className="text-xs tracking-[0.4em] uppercase" style={{ color: tc }}>Since you arrived</p>
       <p className="leading-tight font-light text-center"
         style={{ fontSize: "clamp(2rem, 8vw, 4.5rem)", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", letterSpacing: "-0.03em", color: tc }}>
         <span className="tabular-nums font-thin">{absurdCount.toLocaleString("en-US")}</span>
         <br />
         {brand.absurdUnit}
       </p>
     </section>

     <section className="flex flex-col items-center px-8 py-8 gap-5">
       <div className="flex flex-col items-center gap-1">
         <p className="tabular-nums font-thin text-center"
           style={{ fontSize: "clamp(1.6rem, 6vw, 3rem)", letterSpacing: "-0.04em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", color: tc }}>
           {fromEntry.toLocaleString("en-US")}
         </p>
         <p className="text-xs tracking-[0.3em] uppercase" style={{ color: tc }}>{brand.unit} since you arrived</p>
       </div>

       <div className="flex gap-12">
         <div className="flex flex-col items-center gap-1">
           <p className="tabular-nums font-thin text-center"
             style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", color: tc }}>
             {today.toLocaleString("en-US")}
           </p>
           <p className="text-xs tracking-[0.3em] uppercase" style={{ color: tc }}>today</p>
         </div>
         <div className="flex flex-col items-center gap-1">
           <p className="tabular-nums font-thin text-center"
             style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", color: tc }}>
             {thisYear.toLocaleString("en-US")}
           </p>
           <p className="text-xs tracking-[0.3em] uppercase" style={{ color: tc }}>this year</p>
         </div>
       </div>
     </section>

     {/* Mobile swipe hint */}
     {nextBrand && (
       <div className="flex md:hidden flex-col items-center pb-16 pt-4 gap-1">
         <p className="text-xs tracking-widest uppercase" style={{ color: tc }}>swipe up</p>
         <p className="text-xs" style={{ color: tc }}>↑</p>
         <p className="text-xs tracking-widest uppercase font-medium" style={{ color: tc }}>{nextBrand.name}</p>
       </div>
     )}

     {/* Desktop buttons */}
     {nextBrand && (
       <div className="hidden md:flex items-center justify-center gap-4 pb-12 pt-4">
         {nextBrand && (
           <Link
             href={`/${nextBrand.category}/${nextBrand.seoSlug}`}
             className="px-8 py-3 rounded-full text-xs tracking-widest uppercase font-medium transition-all hover:opacity-80"
             style={{ border: `1px solid ${tc}`, color: tc, background: "transparent" }}
           >
             Next: {nextBrand.name} →
           </Link>
         )}
         <button
           onClick={handleShare}
           className="px-8 py-3 rounded-full text-xs tracking-widest uppercase font-medium transition-all hover:opacity-80"
           style={{ border: "1px solid #25D366", color: "#25D366", background: "transparent" }}
         >
           {copied ? "✓ Copied" : "Share on WhatsApp"}
         </button>
       </div>
     )}

     <footer className="px-8 pb-4 text-center">
       <p className="text-xs tracking-widest font-light" style={{ color: tc }}>{brand.source}</p>
     </footer>

   </main>
 )
}
