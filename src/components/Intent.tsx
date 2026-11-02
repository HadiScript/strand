import { useLayoutEffect, useRef } from 'react'
import { gsap, revealLines, ScrollTrigger } from '../lib/anim'
import { intent } from '../content'
import { Lines } from './Lines'

// Row positions (fraction of diagram height) — must match the `bulb` shape in Thread.tsx.
const NODE_Y = [0.2, 0.51, 0.75]

export function Intent() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealLines(root.current!)
      // Labels light up as the thread's tip (62% down the viewport) reaches them.
      gsap.utils.toArray<HTMLElement>('.intent-node').forEach((n) =>
        ScrollTrigger.create({ trigger: n, start: 'top 62%', toggleClass: 'is-lit' }),
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="intent s-invert" id="intent" ref={root}>
      <div className="intent-copy">
        <span className="mono eyebrow">(01) — The idea</span>
        <Lines lines={intent.lines} indent={[1, 3]} className="h-xl" />
        <p className="intent-sub" data-fade>
          {intent.sub}
        </p>
      </div>

      <div className="intent-diagram" data-thread="bulb">
        {intent.nodes.map((n, i) => (
          <div className="intent-node mono" key={n} style={{ top: `${NODE_Y[i] * 100}%` }}>
            <span className="rule" />
            {String(i + 1).padStart(2, '0')} / {n}
          </div>
        ))}
      </div>
    </section>
  )
}
