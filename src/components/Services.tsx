import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, revealLines } from '../lib/anim'
import { services } from '../content'
import { Lines } from './Lines'

export function Services() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current!)
      // "behind them." fills from outline to solid as the thread frames the statement
      gsap.fromTo(
        '.svc-statement .is-accent > span',
        { backgroundSize: '0% 100%' },
        {
          backgroundSize: '100% 100%',
          ease: 'none',
          scrollTrigger: { trigger: '.svc-statement', start: 'top 55%', end: 'bottom 45%', scrub: 0.6 },
        },
      )
      gsap.from('.svc-row', {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.svc-list', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="services s-base" id="services" ref={root}>
      <span className="mono eyebrow">(02) — Services</span>
      <div className="svc-statement" data-thread="frame" data-pad="34">
        <Lines lines={services.lines} accent={[3]} indent={[2]} className="h-lg" />
      </div>

      <ol className="svc-list">
        {services.items.map((s, i) => (
          <li className="svc-row" key={s.title}>
            <span className="svc-node" data-thread="point" />
            <span className="mono svc-num">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="display svc-title">{s.title}</h3>
            <p className="svc-body">{s.body}</p>
            <div className="svc-tags mono">
              {s.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Marquee() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let settle = () => {}
    const ctx = gsap.context(() => {
      const loops = gsap.utils
        .toArray<HTMLElement>('.marquee-track')
        .map((t, i) =>
          gsap.fromTo(t, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 32, ease: 'none', repeat: -1 }),
        )
      const skew = gsap.quickTo('.marquee-track', 'skewX', { duration: 0.4, ease: 'power3' })
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = self.getVelocity()
          skew(gsap.utils.clamp(-10, 10, v / -160))
          loops.forEach((l) => gsap.to(l, { timeScale: 1 + Math.min(Math.abs(v) / 400, 5), duration: 0.2, overwrite: true }))
        },
      })
      settle = () => {
        skew(0)
        loops.forEach((l) => gsap.to(l, { timeScale: 1, duration: 1, overwrite: true }))
      }
    }, root)
    ScrollTrigger.addEventListener('scrollEnd', settle)
    return () => {
      ScrollTrigger.removeEventListener('scrollEnd', settle)
      ctx.revert()
    }
  }, [])

  const words = [...services.marquee, ...services.marquee]
  return (
    <div className="marquee" ref={root} aria-hidden>
      {[0, 1].map((row) => (
        <div className={`marquee-row ${row ? 'is-outline' : ''}`} key={row}>
          <div className="marquee-track display">
            {words.map((w, i) => (
              <span key={i}>
                {w}
                <i>✦</i>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
