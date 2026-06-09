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

 const nameParts = brand.name.toUpperCase().split(" ")

 return (
   <main
     className="min-h-screen flex flex-col"
     style={{ background: `linear-gradient(160deg, ${brand.bgColor}dd 0%, ${brand.bgColor} 100%)` }}
   >
     {/* Header minimalista */}
     <header className="flex items-center justify-between px-6 pt-12 pb-2 md:px-10 md:pt-8">
       <Link href="/" className="text-white/30 text-xs tracking-widest uppercase font-light">← Back</Link>
       <button
         onClick={handleShare}
         className="text-white/20 text-xs tracking-widest uppercase font-light"
       >
         {copied ? "✓" : "·"}
       </button>
     </header>

     {/* Nombre en grande centrado */}
     <section className="flex flex-col items-center justify-center px-8 pt-6 pb-2">
       {nameParts.map((part, i) => (
         <p
           key={i}
           className="text-white text-center leading-none font-thin"
           style={{
             fontSize: "clamp(2.5rem, 12vw, 7rem)",
             fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
             letterSpacing: "-0.03em",
             opacity: 0.9
           }}
         >
           {part}
         </p>
       ))}
     </section>

     {/* Tres contadores centrados */}
     <section className="flex-1 flex flex-col items-center justify-center px-8 gap-8 md:gap-10">

       {/* Arrived */}
       <div className="flex flex-col items-center gap-1">
         <p
           className="tabular-nums font-thin text-white text-center"
           style={{
             fontSize: "clamp(2.5rem, 12vw, 6rem)",
             letterSpacing: "-0.04em",
             fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
           }}
         >
           {fromEntry.toLocaleString("en-US")}
         </p>
         <p className="text-white/40 text-xs tracking-[0.3em] uppercase">since you arrived</p>
       </div>

       <div className="h-px bg-white/10 w-16" />

       {/* Today */}
       <div className="flex flex-col items-center gap-1">
         <p
           className="tabular-nums font-thin text-white/60 text-center"
           style={{
             fontSize: "clamp(1.8rem, 8vw, 4rem)",
             letterSpacing: "-0.04em",
             fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
           }}
         >
           {today.toLocaleString("en-US")}
         </p>
         <p className="text-white/30 text-xs tracking-[0.3em] uppercase">today</p>
       </div>

       {/* This year */}
       <div className="flex flex-col items-center gap-1">
         <p
           className="tabular-nums font-thin text-white/60 text-center"
           style={{
             fontSize: "clamp(1.8rem, 8vw, 4rem)",
             letterSpacing: "-0.04em",
             fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
           }}
         >
           {thisYear.toLocaleString("en-US")}
         </p>
         <p className="text-white/30 text-xs tracking-[0.3em] uppercase">this year</p>
       </div>

     </section>

     {/* Absurdo y fuente abajo */}
     <footer className="px-8 pb-16 pt-6 md:pb-10 flex flex-col items-center gap-3 text-center">
       <p
         className="text-white/50 font-light leading-snug"
         style={{
           fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
           fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif"
         }}
       >
         <span className="tabular-nums text-white/70">{absurdCount.toLocaleString("en-US")}</span>
         {" "}{brand.absurdUnit}
       </p>
       <p className="text-white/15 text-xs tracking-widest font-light">{brand.source}</p>
     </footer>

   </main>
 )
}
