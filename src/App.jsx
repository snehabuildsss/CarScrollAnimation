import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import carImage from './assets/black-supercar.png'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

/* ---------- Content ---------- */

const stats = [
  {
    value: '58%',
    lines: ['Increase in', 'pick-up point use'],
    tone: 'lime',
    arrow: '↗',
    dir: 'down',
    pos: { left: '42.6%', top: '23.8%', width: '12.6%' },
    cx: '49%',
    len: 5.9,
  },
  {
    value: '27%',
    lines: ['Increase in', 'pick-up point use'],
    tone: 'dark',
    arrow: '↗',
    dir: 'down',
    pos: { left: '63.3%', top: '14.5%', width: '13%' },
    cx: '49%',
    len: 3.5,
  },
  {
    value: '23%',
    lines: ['Decreased in', 'customer support tickets'],
    tone: 'blue',
    arrow: '↘',
    dir: 'up',
    pos: { left: '36.2%', top: '73.4%', width: '13.7%' },
    cx: '44%',
    len: 3,
  },
  {
    value: '40%',
    lines: ['Decreased in', 'customer phone calls'],
    tone: 'orange',
    arrow: '↘',
    dir: 'up',
    pos: { left: '70%', top: '59.7%', width: '13%' },
    cx: '24%',
    len: 3.6,
  },
]

/* ---------- SVG geometry (viewBox 1440 x 900) ---------- */

// The car drives along this path; the core streak follows it exactly.
const TRAIL_BASE =
  'M -80 690 C 300 690, 620 595, 880 465 S 1150 345, 1270 265'

// The lettering sits on a path slightly above the core streak.
const TEXT_PATH =
  'M -80 650 C 300 652, 620 560, 880 432 S 1150 322, 1270 250'

// Fine streaks: related curves that converge on the car.
const STREAKS = [
  { d: 'M -80 722 C 320 716, 640 628, 900 492 S 1160 360, 1270 265', cls: 'trail-fine' },
  { d: 'M -80 705 C 310 702, 630 610, 890 478 S 1155 352, 1270 265', cls: 'trail-lower' },
  { d: 'M -80 668 C 300 668, 625 574, 884 448 S 1152 340, 1270 265', cls: 'trail-fine' },
  { d: 'M -80 750 C 340 735, 660 650, 920 508 S 1170 368, 1270 265', cls: 'trail-lower' },
  { d: 'M -80 630 C 290 635, 610 540, 875 420 S 1148 328, 1270 265', cls: 'trail-fine' },
]

const TRAIL_TEXT = 'WELCOME ITZFIZZ'.split('')

// Fraction of the path the car has already covered at scroll start.
const CAR_START = 0.1
// Adjust if your PNG is not drawn facing "right" (e.g. 180 or -90).
const CAR_ROTATION_OFFSET = 0

const clamp01 = (n) => Math.min(1, Math.max(0, n))

/* ---------- Components ---------- */

function Navbar() {
  return (
    <nav className="navbar">
      <a className="brand-logo" href="#home">
        itzfizz<span>.</span>
      </a>

      <div className="nav-links">
        <a className="active" href="#home">HOME</a>
        <a href="#about">ABOUT</a>
        <a href="#work">WORK</a>
        <a href="#contact">CONTACT</a>
      </div>

      <a className="contact-link" href="#contact">
        <span>LET'S TALK</span>
        <span className="contact-arrow">↗</span>
      </a>
    </nav>
  )
}

function HeroHeading() {
  return (
    <div className="hero-heading">
      <p className="hero-eyebrow">IDEAS THAT MOVE BRANDS FORWARD</p>
      <h1>
        <span className="hero-welcome">WELCOME</span>
        <strong className="hero-name">
          <span className="itz">ITZ</span>
          <span className="fizz">FIZZ</span>
        </strong>
      </h1>
      <span className="hero-divider" />
      
    </div>
  )
}

function TrailSvg() {
  return (
    <svg
      className="road-svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="glowWide" filterUnits="userSpaceOnUse" x="-300" y="-300" width="2100" height="1500">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="glowSoft" filterUnits="userSpaceOnUse" x="-300" y="-300" width="2100" height="1500">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="textGlow" filterUnits="userSpaceOnUse" x="-300" y="-300" width="2100" height="1500">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Trail fades in from the left edge */}
        <linearGradient id="trailFade" gradientUnits="userSpaceOnUse" x1="-80" y1="0" x2="620" y2="0">
          <stop offset="0" stopColor="#58e035" stopOpacity="0.15" />
          <stop offset="1" stopColor="#c8ff4a" stopOpacity="1" />
        </linearGradient>

        <path id="textTrailPath" d={TEXT_PATH} />
      </defs>

      {/* 1. Broad soft halo */}
      <path className="trail-layer trail-halo" pathLength="1" d={TRAIL_BASE} filter="url(#glowWide)" />

      {/* 2. Atmospheric mid glow */}
      <path className="trail-layer trail-wide" pathLength="1" d={TRAIL_BASE} filter="url(#glowSoft)" />

      {/* 3. Fine flowing streaks */}
      {STREAKS.map((s, i) => (
        <path key={i} className={`trail-layer ${s.cls}`} pathLength="1" d={s.d} />
      ))}

      {/* 4. Bright narrow core (also the car's route) */}
      <path
        id="trailCore"
        className="trail-layer trail-core"
        pathLength="1"
        d={TRAIL_BASE}
        filter="url(#glowSoft)"
      />

      {/* 5. Lettering following the curve */}
      <text className="trail-word" filter="url(#textGlow)">
        <textPath href="#textTrailPath" startOffset="15%">
          {TRAIL_TEXT.map((letter, i) => (
            <tspan key={i} className="trail-letter">
              {letter === ' ' ? '\u00A0' : letter}
            </tspan>
          ))}
        </textPath>
      </text>
    </svg>
  )
}

function StatCard({ stat }) {
  return (
    <article
      className={`stat-card ${stat.tone}`}
      style={{ ...stat.pos, '--cx': stat.cx, '--len': stat.len }}
    >
      <span className="stat-arrow">{stat.arrow}</span>
      <h2>{stat.value}</h2>
      <p>
        {stat.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      <span className={`connector ${stat.dir}`} aria-hidden="true" />
    </article>
  )
}

/* ---------- App ---------- */

function App() {
  const heroRef = useRef(null)
  const sceneRef = useRef(null)
  const carRef = useRef(null)

  useLayoutEffect(() => {
    const hero = heroRef.current
    const car = carRef.current
    const svg = hero.querySelector('.road-svg')
    const core = hero.querySelector('#trailCore')
    const textPathGeom = hero.querySelector('#textTrailPath')
    const textEl = hero.querySelector('.trail-word')
    const layers = gsap.utils.toArray('.trail-layer', hero)
    const letters = gsap.utils.toArray('.trail-letter', hero)

    let cancelled = false
    const state = { p: 0 }
    const coreLength = core.getTotalLength()

    // Fallback letter positions (replaced by measured ones below).
    let letterAt = letters.map((_, i) => 0.17 + (i / letters.length) * 0.65)

    const setAspect = () => {
      svg.setAttribute(
        'preserveAspectRatio',
        window.innerWidth <= 700 ? 'xMidYMid meet' : 'xMidYMid slice',
      )
    }

    // Map every letter to its nearest position along the text path.
    const measureLetters = () => {
      try {
        const total = textPathGeom.getTotalLength()
        const samples = []
        const N = 400
        for (let i = 0; i <= N; i++) {
          const pt = textPathGeom.getPointAtLength((i / N) * total)
          samples.push(pt)
        }
        letterAt = letters.map((_, i) => {
          const start = textEl.getStartPositionOfChar(i)
          let best = 0
          let bestD = Infinity
          samples.forEach((pt, k) => {
            const d = (pt.x - start.x) ** 2 + (pt.y - start.y) ** 2
            if (d < bestD) {
              bestD = d
              best = k
            }
          })
          return best / N
        })
      } catch {
        /* keep fallback positions */
      }
    }

    // Single source of truth: state.p (0..1) -> car, trail and letters.
    const render = () => {
      const s = CAR_START + (1 - CAR_START) * state.p

      layers.forEach((el) => {
        el.style.strokeDashoffset = String(1 - s)
      })

      letters.forEach((el, i) => {
        el.style.fillOpacity = String(clamp01((s - letterAt[i]) / 0.03))
      })

      const ctm = svg.getScreenCTM()
      if (!ctm) return
      const box = svg.getBoundingClientRect()

      const pt = core.getPointAtLength(coreLength * s)
      const a = core.getPointAtLength(coreLength * clamp01(s - 0.01))
      const b = core.getPointAtLength(coreLength * clamp01(s + 0.01))

      const x = ctm.a * pt.x + ctm.c * pt.y + ctm.e - box.left
      const y = ctm.b * pt.x + ctm.d * pt.y + ctm.f - box.top
      const angle =
        (Math.atan2(ctm.d * (b.y - a.y), ctm.a * (b.x - a.x)) * 180) / Math.PI

      gsap.set(car, { x, y, rotation: angle + CAR_ROTATION_OFFSET })
    }

    const onRefresh = () => {
      setAspect()
      measureLetters()
      render()
    }

    const ctx = gsap.context(() => {
      gsap.set(car, { xPercent: -50, yPercent: -50, left: 0, top: 0 })
      setAspect()
      measureLetters()
      render()

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '+=1800',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Car + trail + letters, all driven by one progress value.
      tl.to(state, { p: 1, duration: 1, onUpdate: render }, 0)

      // Cards enter one after another, each followed by its connector.
      gsap.utils.toArray('.stat-card', hero).forEach((card, i) => {
        const at = 0.4 + i * 0.13
        const connector = card.querySelector('.connector')
        const isUp = connector.classList.contains('up')

        tl.fromTo(
          card,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.14, ease: 'power2.out' },
          at,
        )
        tl.fromTo(
          connector,
          { clipPath: isUp ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.1 },
          at + 0.09,
        )
      })
    }, hero)

    ScrollTrigger.addEventListener('refresh', onRefresh)
    window.addEventListener('resize', onRefresh)

    // Re-measure the lettering once webfonts have loaded.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (cancelled) return
        measureLetters()
        render()
        ScrollTrigger.refresh()
      })
    }

    return () => {
      cancelled = true
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      window.removeEventListener('resize', onRefresh)
      ctx.revert()
    }
  }, [])

  return (
    <main>
      <section className="hero-section" ref={heroRef} id="home">
        <Navbar />
        <HeroHeading />

        <div className="drive-scene" ref={sceneRef}>
          <TrailSvg />
          <div className="car-wrap" ref={carRef}>
            <img
              className="car-image"
              src={carImage}
              alt="Black supercar with glowing red tail lights"
            />
          </div>
        </div>

        <div className="stats-layer">
          {stats.map((stat) => (
            <StatCard stat={stat} key={stat.value} />
          ))}
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span>SCROLL</span>
          <span className="scroll-hint-line" />
        </div>

        
        <div className="explore" aria-hidden="true">
          <span className="explore-line" />
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>

      <section className="next-section" id="work">
        <p>THE JOURNEY CONTINUES</p>
        <h2>Ideas in motion.</h2>
        <a href="#home">BACK TO TOP ↑</a>
      </section>

      <footer id="contact">
        <a className="brand-logo" href="#home">
          itzfizz<span>.</span>
        </a>
        <span>BUILT TO MOVE.</span>
      </footer>
    </main>
  )
}

export default App