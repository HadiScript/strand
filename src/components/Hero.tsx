import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, scrollToHash } from '../lib/anim'
import { hero, site } from '../content'

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, wi) => (
        <span className="word" key={wi}>
          {word.split('').map((c, ci) => (
            <span className="ch" key={ci}>
              <span>{c}</span>
            </span>
          ))}
        </span>
      ))}
    </>
  )
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-title', {
        yPercent: -14,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.set('.hero .ch > span', { yPercent: 115 })
      gsap.set('.hero-foot > *', { opacity: 0, y: 20 })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to('.hero .ch > span', { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.022 })
        .to('.hero-foot > *', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1 }, '-=0.8')
    }, root)
    return () => ctx.revert()
  }, [ready])

  // Rotating last word
  useEffect(() => {
    if (!ready) return
    const words = root.current!.querySelectorAll<HTMLElement>('.rotator > span')
    let i = 0
    gsap.set(words, { yPercent: 110 })
    gsap.set(words[0], { yPercent: 0 })
    const id = window.setInterval(() => {
      const cur = words[i]
      i = (i + 1) % words.length
      gsap.to(cur, { yPercent: -110, duration: 0.8, ease: 'expo.inOut' })
      gsap.fromTo(words[i], { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' })
    }, 2400)
    return () => window.clearInterval(id)
  }, [ready])

  // Letters swell in width/weight around the cursor (variable font axes)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = root.current!
    const chars = [...el.querySelectorAll<HTMLElement>('.hero-title .ch')]
    const onMove = (e: PointerEvent) => {
      for (const c of chars) {
        const r = c.getBoundingClientRect()
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
        const k = Math.max(0, 1 - d / 360)
        gsap.to(c, { '--wdth': 90 + k * 35, '--wght': 780 + k * 120, duration: 0.6, ease: 'power3.out', overwrite: true })
      }
    }
    const onLeave = () => gsap.to(chars, { '--wdth': 90, '--wght': 780, duration: 0.9, ease: 'power3.out' })
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section className="hero s-base" id="top" ref={root}>
      <div className="hero-meta mono">
        <span>{site.brand} — {site.tagline}</span>
        <span className="status">
          <i /> Taking on 2 new projects this quarter
        </span>
      </div>

      <h1 className="hero-title display" aria-label={`${hero.lines.join(' ')} ${hero.lead} ${hero.rotating[0]}`}>
        {hero.lines.map((l) => (
          <span className="hero-line" key={l} aria-hidden>
            <Letters text={l} />
          </span>
        ))}
        <span className="hero-line" aria-hidden>
          <Letters text={hero.lead} />
          <span className="rotator is-accent">
            {hero.rotating.map((w) => (
              <span key={w}>{w}</span>
            ))}
            <i>{hero.rotating.reduce((a, b) => (b.length > a.length ? b : a))}</i>
          </span>
        </span>
      </h1>

      <div className="hero-foot">
        <p className="hero-sub">{hero.sub}</p>
        <div className="hero-actions">
          <a href="#contact" className="btn" data-cursor="Let's go" onClick={(e) => (e.preventDefault(), scrollToHash('#contact'))}>
            {site.cta} <span>→</span>
          </a>
          <button className="hero-hint mono" onClick={() => scrollToHash('#intent')}>
            Scroll to follow the thread
            <span className="hint-node" data-thread="point" />
          </button>
        </div>
      </div>
    </section>
  )
}
