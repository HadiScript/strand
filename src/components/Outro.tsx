import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, countUp, revealLines, scrollToHash } from '../lib/anim'
import { about, contact, process, site } from '../content'
import { Lines } from './Lines'

export function Process() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current!)
      gsap.utils.toArray<HTMLElement>('.step').forEach((s) =>
        gsap.from(s.querySelectorAll('.step-card > *'), {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: s, start: 'top 75%' },
        }),
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="process s-base" id="process" ref={root}>
      <div className="process-head">
        <span className="mono eyebrow">(03) — Process</span>
        <Lines lines={process.lines} accent={[1]} className="h-lg" />
      </div>
      <ol className="steps">
        {process.steps.map((s, i) => (
          <li className={`step ${i % 2 ? 'is-right' : 'is-left'}`} key={s.title}>
            <span className="step-node" data-thread="point" />
            <div className="step-card">
              <span className="step-num display">{String(i + 1).padStart(2, '0')}</span>
              <span className="mono step-when">{s.when}</span>
              <h3 className="display step-title">{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

// Concentric open loops — a fingerprint the thread runs through.
const RINGS = Array.from({ length: 9 }, (_, i) => {
  const rx = 20 + i * 17
  const ry = 28 + i * 21
  const gap = 0.35 + (i % 3) * 0.25
  const a0 = -Math.PI / 2 + gap
  const a1 = a0 + Math.PI * 2 - gap * 1.4
  const p = (a: number) => `${(200 + rx * Math.cos(a)).toFixed(1)} ${(240 + ry * Math.sin(a)).toFixed(1)}`
  return `M${p(a0)} A${rx} ${ry} 0 1 1 ${p(a1)}`
})

export function About() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current!)
      countUp(root.current!)
      gsap.fromTo(
        '.print path',
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: '.print', start: 'top 80%', end: 'bottom 45%', scrub: 0.8 },
        },
      )
      gsap.to('.print svg', {
        rotate: 10,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about s-invert" id="about" ref={root}>
      <div className="about-grid">
        <div>
          <span className="mono eyebrow">(04) — Why Strand</span>
          <Lines lines={about.lines} accent={[2]} className="h-lg" />
          <p className="about-body" data-fade>
            {about.body}
          </p>
          <p className="mono about-sign" data-fade>
            <b className="display">{site.brand}.</b> {about.signature}
          </p>
        </div>
        <div className="print">
          <svg viewBox="0 0 400 480" aria-hidden>
            {RINGS.map((d, i) => (
              <path key={i} d={d} pathLength={1} />
            ))}
          </svg>
          <span className="print-core" data-thread="point" />
        </div>
      </div>

      <div className="about-stats">
        {about.stats.map((s) => (
          <div key={s.label} data-fade>
            <b className="display" data-count={s.value} data-decimals={s.decimals} data-suffix={s.suffix}>
              0
            </b>
            <span className="mono">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return <>{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</>
}

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const btn = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current!)
      gsap.from('.cta-blob', {
        scale: 0,
        rotate: -90,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.cta-zone', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Magnetic CTA
  useEffect(() => {
    const el = btn.current!
    const x = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.4)' })
    const zone = el.parentElement!
    const move = (e: PointerEvent) => {
      const r = zone.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.3)
      y((e.clientY - (r.top + r.height / 2)) * 0.3)
    }
    const leave = () => {
      x(0)
      y(0)
    }
    zone.addEventListener('pointermove', move)
    zone.addEventListener('pointerleave', leave)
    return () => {
      zone.removeEventListener('pointermove', move)
      zone.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section className="contact s-base" id="contact" ref={root}>
      <div className="contact-main">
        <div>
          <span className="mono eyebrow">(05) — Contact</span>
          <Lines lines={contact.lines} accent={[2]} indent={[1]} className="h-lg" />
          <p className="contact-note" data-fade>
            30 minutes. No deck. We’ll tell you honestly whether an agent is worth building — and what it would take.
          </p>
        </div>
        <div className="cta-zone">
          <a ref={btn} href={`mailto:${site.email}`} className="cta-blob" data-cursor="Write" data-thread="ring">
            <span className="display">{contact.cta}</span>
            <span className="mono">{site.email}</span>
          </a>
        </div>
      </div>

      <footer className="contact-foot mono">
        <span>
          © {new Date().getFullYear()} {site.brand}
        </span>
        <span className="socials">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} className="nav-link">
              <span>{s.label}</span>
            </a>
          ))}
        </span>
        <span>
          Local <Clock />
        </span>
        <button className="nav-link" onClick={() => scrollToHash('#top')}>
          <span>Back to top ↑</span>
        </button>
      </footer>
    </section>
  )
}
