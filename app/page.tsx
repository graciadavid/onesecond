"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { brands } from "@/lib/brands"

function AnimatedNumber({ perSecond }: { perSecond: number }) {
  const [count, setCount] = useState(0)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(Math.floor(((Date.now() - startRef.current) / 1000) * perSecond))
    }, 50)
    return () => clearInterval(interval)
  }, [perSecond])

  return <>{count.toLocaleString("en-US")}</>
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
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all")
  const filtered = activeCategory === "all" ? brands : brands.filter(b => b.category === activeCategory)

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #ffffff 0%, #fafafa 60%, #f5f0f0 100%)" }}>

      <header className="px-10 py-8 flex items-center justify-between">
        <p className="text-gray-800 text-sm font-light tracking-widest uppercase">Every Second</p>
        <div className="flex gap-1 flex-wrap justify-end">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-all"
              style={{
                background: activeCategory === cat.id ? "#000" : "transparent",
                color: activeCategory === cat.id ? "#fff" : "#aaa",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <section className="flex-1 px-10 py-4 grid grid-cols-4 gap-4">
        {filtered.map((brand) => (
          <Link key={brand.slug} href={`/brand/${brand.slug}`}>
            <div
              className="rounded-2xl p-8 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform"
              style={{ background: brand.bgColor, aspectRatio: "4/3" }}
            >
              <p className="text-white text-xs tracking-widest uppercase font-medium">
                {brand.name}
              </p>
              <div className="flex flex-col gap-2">
                <p className="tabular-nums font-thin leading-none text-white" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif" }}>
                  <AnimatedNumber perSecond={brand.perSecond} />
                </p>
                <p className="text-white text-xs font-medium tracking-widest uppercase">
                  {brand.unit}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer className="px-10 py-8">
        <p className="text-gray-300 text-xs tracking-widest font-light">Real-time data</p>
      </footer>

    </main>
  )
}
