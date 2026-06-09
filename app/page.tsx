"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { brands } from "@/lib/brands"
import { amazonDeals } from "@/lib/amazon"

function getTextColor(bgColor: string): string {
 const hex = bgColor.replace('#', '')
 const r = parseInt(hex.substr(0, 2), 16)
 const g = parseInt(hex.substr(2, 2), 16)
 const b = parseInt(hex.substr(4, 2), 16)
 const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
 return luminance > 0.6 ? '#1a1a1a' : '#ffffff'
}

function AnimatedNumber({ perSecond, textColor }: { perSecond: number, textColor: string }) {
 const [count, setCount] = useState(0)
 const startRef = useRef(Date.now())

 useEffect(() => {
   const interval = setInterval(() => {
     setCount(Math.floor(((Date.now() - startRef.current) / 1000) * perSecond))
   }, 50)
   return () => clearInterval(interval)
 }, [perSecond])

 return <span style={{ color: textColor }}>{count.toLocaleString("en-US")}</span>
}

const categories = [
 { id: "all", label: "All" },
 { id: "brands", label: "Brands" },
 { id: "life", label: "Life" },
 { id: "planet", label: "Planet" },
 { id: "money", label: "Money" },
 { id: "internet", label: "Internet" },
 { id: "food", label: "Food" },
 { id: "sports", label: "Sports" },
 { id: "people", label: "People" },
]

export default function Home() {
 const [activeCategory, setActiveCategory] = useState("all")
 const [search, setSearch] = useState("")

 const filtered = brands.filter(b => {
   const matchesCategory = activeCategory === "all" || b.category === activeCategory
   const matchesSearch = search === "" || b.name.toLowerCase().includes(search.toLowerCase())
   return matchesCategory && matchesSearch
 })

 const deal = amazonDeals.find(d => d.category === activeCategory) || amazonDeals[0]
 const itemsWithDeals: (typeof filtered[0] | { isDeal: true, deal: typeof deal })[] = []
 filtered.forEach((item, i) => {
   itemsWithDeals.push(item)
   if ((i + 1) % 6 === 0) {
     itemsWithDeals.push({ isDeal: true, deal })
   }
 })

 return (
   <main className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #ffffff 0%, #fafafa 60%, #f5f0f0 100%)" }}>

     <header className="px-5 md:px-10 py-6 md:py-8 flex flex-col gap-4">
       <div className="flex items-center justify-between gap-4">
         <p className="text-gray-800 text-xs md:text-sm font-light tracking-widest uppercase shrink-0">Every Second</p>
         <input
           type="text"
           placeholder="Search..."
           value={search}
           onChange={e => { setSearch(e.target.value); setActiveCategory("all") }}
           className="rounded-full px-4 py-2 text-xs tracking-widest outline-none border border-black/10 bg-white/80 text-gray-600 placeholder-gray-300 w-36 md:w-48"
         />
       </div>
       <div className="flex gap-1 flex-wrap">
         {categories.map(cat => (
           <button
             key={cat.id}
             onClick={() => { setActiveCategory(cat.id); setSearch("") }}
             className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-all"
             style={{
               background: activeCategory === cat.id && search === "" ? "#000" : "transparent",
               color: activeCategory === cat.id && search === "" ? "#fff" : "#aaa",
             }}
           >
             {cat.label}
           </button>
         ))}
       </div>
     </header>

     <section className="flex-1 px-5 md:px-10 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
       {itemsWithDeals.map((item, i) => {
         if ('isDeal' in item) {
           return (
             <a
               key={`deal-${i}`}
               href={item.deal.url}
               target="_blank"
               rel="noopener noreferrer sponsored"
             >
               <div
                 className="rounded-2xl p-5 md:p-8 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform"
                 style={{ background: "#0a1628", aspectRatio: "4/3" }}
               >
                 <div className="flex items-center justify-between">
                   <p className="text-white/40 text-xs tracking-widest uppercase font-medium">Amazon</p>
                   <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FF9900", color: "#000" }}>
                     Best Deal
                   </span>
                 </div>
                 <div className="flex flex-col gap-1">
                   <p className="text-white font-light text-sm">Top Seller</p>
                   <p className="text-white/40 text-xs tracking-widest uppercase">Right now →</p>
                 </div>
               </div>
             </a>
           )
         }

         const brand = item as typeof filtered[0]
         const tc = getTextColor(brand.bgColor)
         return (
           <Link key={brand.slug} href={`/brand/${brand.slug}`}>
             <div
               className="rounded-2xl p-5 md:p-8 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform"
               style={{ background: brand.bgColor, aspectRatio: "4/3" }}
             >
               <p className="text-xs tracking-widest uppercase font-medium" style={{ color: tc }}>{brand.name}</p>
               <div className="flex flex-col gap-1 md:gap-2">
                 <p className="tabular-nums font-thin leading-none"
                   style={{ fontSize: "clamp(1.2rem, 5vw, 2.5rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif", color: tc }}>
                   <AnimatedNumber perSecond={brand.perSecond} textColor={tc} />
                 </p>
                 <p className="text-xs font-medium tracking-wider uppercase leading-tight" style={{ color: tc, opacity: 0.7 }}>{brand.unit}</p>
               </div>
             </div>
           </Link>
         )
       })}
     </section>

     <footer className="px-5 md:px-10 py-6 md:py-8">
       <p className="text-gray-300 text-xs tracking-widest font-light">Real-time data</p>
     </footer>

   </main>
 )
}
