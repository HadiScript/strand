import { useLayoutEffect, useRef } from 'react'
import { gsap, countUp } from '../lib/anim'
import { work } from '../content'
import { OpsMock, SalesMock, SupportMock } from './Mocks'

const MOCKS = { sales: SalesMock, support: SupportMock, ops: OpsMock }

export function Work() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      countUp(root.current!)
      gsap.utils.toArray<HTMLElement>('.case').forEach((p, i) => {
        gsap.fromTo(
          p.querySelector('.ghost'),
          { xPercent: i % 2 ? -10 : 10 },
          { xPercent: i % 2 ? 10 : -10, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } },
        )

        const tl = gsap.timeline({ scrollTrigger: { trigger: p.querySelector('.case-stage'), start: 'top 72%' } })
        tl.from(p.querySelectorAll('.case-head > *'), { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 })
          .from(p.querySelectorAll('.m-in'), { y: 90, rotate: -3, opacity: 0, duration: 1.3, ease: 'expo.out' }, 0.1)
          .from(p.querySelectorAll('.m-row'), { x: -16, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.09 }, 0.5)
          .from(p.querySelectorAll('.m-float, .m-float2'), { scale: 0.6, opacity: 0, duration: 1, ease: 'back.out(1.7)', stagger: 0.15 }, 0.75)
          .from(p.querySelectorAll('.bar'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, ease: 'expo.out', stagger: 0.04 }, 0.5)
          .fromTo(p.querySelectorAll('.chart-line'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.7)
          .from(p.querySelectorAll('.case-result'), { y: 40, opacity: 0, duration: 1, ease: 'expo.out' }, 0.6)

        gsap.to(p.querySelectorAll('.m-float'), { y: -14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to(p.querySelectorAll('.m-float2'), { y: 12, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })

      // Product shot tilts toward the cursor
      const stages = gsap.utils.toArray<HTMLElement>('.case-stage')
      const onMove = (e: PointerEvent) => {
        const s = e.currentTarget as HTMLElement
        const r = s.getBoundingClientRect()
        gsap.to(s.querySelector('.mock'), {
          rotateY: ((e.clientX - r.left) / r.width - 0.5) * 10,
          rotateX: -((e.clientY - r.top) / r.height - 0.5) * 8,
          duration: 0.8,
          ease: 'power3.out',
        })
      }
      const onLeave = (e: PointerEvent) =>
        gsap.to((e.currentTarget as HTMLElement).querySelector('.mock'), { rotateY: 0, rotateX: 0, duration: 1, ease: 'power3.out' })
      stages.forEach((s) => {
        s.addEventListener('pointermove', onMove)
        s.addEventListener('pointerleave', onLeave)
      })
      return () =>
        stages.forEach((s) => {
          s.removeEventListener('pointermove', onMove)
          s.removeEventListener('pointerleave', onLeave)
        })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div className="work" id="work" ref={root}>
      {work.map((c, i) => {
        const Mock = MOCKS[c.id as keyof typeof MOCKS]
        return (
          <section className={`case ${i % 2 ? 's-base' : 's-invert'}`} key={c.id}>
            <div className="case-head">
              <span className="mono">
                {c.num} / {c.tag}
              </span>
              <p className="case-desc">{c.desc}</p>
            </div>

            <div className="case-stage">
              <div className="ghost display" aria-hidden>
                {c.ghost}
              </div>
              <Mock />
            </div>

            <div className="case-foot">
              <div className="case-result">
                <b className="display" data-count={c.result.value} data-decimals={c.result.decimals} data-suffix={c.result.suffix}>
                  0
                </b>
                <span className="mono">{c.result.label}</span>
              </div>
              <a href="#contact" className="mono explore" data-cursor="Read">
                Read case study <span>↗</span>
              </a>
            </div>
          </section>
        )
      })}
    </div>
  )
}
