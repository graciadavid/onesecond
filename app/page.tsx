"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { brands } from "@/lib/brands"
import { useRouter } from "next/navigation"

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
  { id: "people", label: "People" },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all")
  const router = useRouter()

  const handleCategory = (id: string) => {
    if (id === "people") {
      router.push("/category/people")
      return
    }
    setActiveCategory(id)
  }

  const filtered = activeCategory === "all"
    ? brands.filter(b => b.category !== "people")
    : brands.filter(b => b.category === activeCategory)

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "linear-gradient(160deg, #ffffff 0%, #fafafa 60%, #f5f0f0 100%)" }}>

      <header className="px-5 md:px-10 py-6 md:py-8">
        <p className="text-gray-800 text-xs md:text-sm font-light tracking-widest uppercase mb-4">Every Second</p>
        <div className="flex gap-1 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-all"
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

      <section className="flex-1 px-5 md:px-10 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map((brand) => (
          <Link key={brand.slug} href={`/brand/${brand.slug}`}>
            <div
              className="rounded-2xl p-5 md:p-8 flex flex-col justify-between cursor-pointer hover:scale-105 transition-transform"
              style={{ background: brand.bgColor, aspectRatio: "4/3" }}
            >
              <p className="text-white text-xs tracking-widest uppercase font-medium">{brand.name}</p>
              <div className="flex flex-col gap-1 md:gap-2">
                <p className="tabular-nums font-thin leading-none text-white"
                  style={{ fontSize: "clamp(1.2rem, 5vw, 2.5rem)", letterSpacing: "-0.03em", fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif" }}>
                  <AnimatedNumber perSecond={brand.perSecond} />
                </p>
                <p className="text-white text-xs font-medium tracking-wider uppercase leading-tight">{brand.unit}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <footer className="px-5 md:px-10 py-6 md:py-8">
        <p className="text-gray-300 text-xs tracking-widest font-light">Real-time data</p>
      </footer>

    </main>
  )
}
