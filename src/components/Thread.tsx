import { useEffect, useRef } from 'react'
import { gsap, reducedMotion } from '../lib/anim'

/*
 * One continuous line through the whole page.
 *
 * Any element inside <main> with `data-thread="<shape>"` becomes a waypoint. Waypoints are
 * joined top-to-bottom with smooth vertical S-curves, and each shape decides how the line
 * moves around its element (pass through, frame it, orbit it, loop into a diagram…).
 * The path is rebuilt whenever layout changes and drawn so its tip sits ~62% down the viewport.
 */

type Pt = [number, number]
type Box = { x: number; y: number; w: number; h: number }
type Seg = { start: Pt; d: string; end: Pt }

const f = (n: number) => n.toFixed(1)

const SHAPES: Record<string, (b: Box, el: HTMLElement, W: number) => Seg> = {
  point: (b) => {
    const c: Pt = [b.x + b.w / 2, b.y + b.h / 2]
    return { start: c, d: '', end: c }
  },

  // Rounded frame around a block, entering top-right and leaving bottom-right (right edge left open).
  frame: (b, el, W) => {
    const p = Math.max(6, Math.min(Number(el.dataset.pad ?? 28), b.x - 6, W - b.x - b.w - 6))
    const r = 30
    const [x1, y1, x2, y2] = [b.x - p, b.y - p, b.x + b.w + p, b.y + b.h + p]
    return {
      start: [x2, y1 - r],
      d: `Q${f(x2)} ${f(y1)} ${f(x2 - r)} ${f(y1)} H${f(x1 + r)} Q${f(x1)} ${f(y1)} ${f(x1)} ${f(y1 + r)} V${f(y2 - r)} Q${f(x1)} ${f(y2)} ${f(x1 + r)} ${f(y2)} H${f(x2 - r)} Q${f(x2)} ${f(y2)} ${f(x2)} ${f(y2 + r)}`,
      end: [x2, y2 + r],
    }
  },

  // Drop, loop into an idea, then serpentine through the rows of the diagram.
  bulb: (b) => {
    const cx = b.x + b.w / 2
    const R = Math.min(b.w * 0.14, b.h * 0.085)
    const ly = b.y + b.h * 0.2
    const r = b.h * 0.06
    const y0 = b.y + b.h * 0.45
    const xl = b.x + b.w * 0.06
    const xr = b.x + b.w * 0.94
    const d = [
      `V${f(ly)}`,
      `A${f(R)} ${f(R)} 0 0 1 ${f(cx - 2 * R)} ${f(ly)}`,
      `A${f(R)} ${f(R)} 0 0 1 ${f(cx)} ${f(ly)}`,
      `V${f(y0)}`,
      `Q${f(cx)} ${f(y0 + r)} ${f(cx + r)} ${f(y0 + r)}`,
      `H${f(xr - r)}`,
      `A${f(r)} ${f(r)} 0 0 1 ${f(xr - r)} ${f(y0 + 3 * r)}`,
      `H${f(xl + r)}`,
      `A${f(r)} ${f(r)} 0 0 0 ${f(xl + r)} ${f(y0 + 5 * r)}`,
      `H${f(cx - r)}`,
      `Q${f(cx)} ${f(y0 + 5 * r)} ${f(cx)} ${f(y0 + 6 * r)}`,
      `V${f(b.y + b.h)}`,
    ].join(' ')
    return { start: [cx, b.y], d, end: [cx, b.y + b.h] }
  },

  // Full elliptical orbit around an element; data-side picks which flank the line rides.
  orbit: (b, el, W) => {
    const cx = b.x + b.w / 2
    const cy = b.y + b.h / 2
    const rx = Math.min(b.w / 2 + 70, cx - 10, W - cx - 10)
    const ry = b.h / 2 + 56
    if (el.dataset.side === 'right') {
      return {
        start: [cx + rx, cy],
        d: `A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 1 ${f(cx + rx)} ${f(cy)}`,
        end: [cx + rx, cy],
      }
    }
    return {
      start: [cx - rx, cy],
      d: `A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx - rx)} ${f(cy)}`,
      end: [cx - rx, cy],
    }
  },

  // Final knot: wrap around the element one and a quarter times.
  ring: (b) => {
    const cx = b.x + b.w / 2
    const cy = b.y + b.h / 2
    const R = Math.max(b.w, b.h) / 2 + 26
    return {
      start: [cx + R, cy],
      d: `A${R} ${R} 0 0 1 ${f(cx - R)} ${f(cy)} A${R} ${R} 0 0 1 ${f(cx + R)} ${f(cy)} A${R} ${R} 0 0 1 ${f(cx)} ${f(cy + R)}`,
      end: [cx, cy + R],
    }
  },
}

function connect([ax, ay]: Pt, [bx, by]: Pt) {
  if (Math.abs(ax - bx) < 0.5 && Math.abs(ay - by) < 0.5) return ''
  if (by <= ay) return ` L${f(bx)} ${f(by)}`
  const k = (by - ay) * 0.55
  return ` C${f(ax)} ${f(ay + k)} ${f(bx)} ${f(by - k)} ${f(bx)} ${f(by)}`
}

/** Layout box relative to `root`, ignoring CSS transforms (so animations don't bend the line). */
function layoutBox(el: HTMLElement, root: HTMLElement): Box {
  let x = 0
  let y = 0
  let e: HTMLElement | null = el
  while (e && e !== root) {
    x += e.offsetLeft
    y += e.offsetTop
    e = e.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

const STEP = 6
const TIP = 0.62

export function Thread() {
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)
  const ghost = useRef<SVGPathElement>(null)
  const head = useRef<SVGGElement>(null)

  useEffect(() => {
    const main = svg.current!.parentElement as HTMLElement
    let xs = new Float32Array(0)
    let ys = new Float32Array(0)
    let maxY = new Float32Array(0)
    let total = 0
    let cur = -1
    let nodes: { el: HTMLElement; l: number; lit: boolean }[] = []

    const build = () => {
      const W = main.clientWidth
      const H = main.scrollHeight
      // Exact pixel size — any viewBox scaling would drift the tip away from the scroll position.
      svg.current!.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.current!.setAttribute('width', String(W))
      svg.current!.setAttribute('height', String(H))

      // Each waypoint contributes one piece: "M <prev end> <connector> <shape>". Measuring short
      // pieces separately keeps sampling cheap — getPointAtLength on one huge path is O(length).
      const pieces: { d: string; el: HTMLElement }[] = []
      let prev: Pt | null = null
      main.querySelectorAll<HTMLElement>('[data-thread]').forEach((el) => {
        if (!el.offsetParent) return // hidden at this breakpoint
        const shape = SHAPES[el.dataset.thread!] ?? SHAPES.point
        const seg = shape(layoutBox(el, main), el, W)
        const from: Pt = prev ?? seg.start
        pieces.push({ el, d: `M${f(from[0])} ${f(from[1])}${connect(from, seg.start)}${seg.d ? ` ${seg.d}` : ''}` })
        prev = seg.end
      })
      if (!pieces.length) return
      const d = pieces.map((p) => p.d).join(' ')
      path.current!.setAttribute('d', d)
      ghost.current!.setAttribute('d', d)

      const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      svg.current!.appendChild(probe)
      const sx: number[] = []
      const sy: number[] = []
      let offset = 0
      nodes = []
      for (const piece of pieces) {
        probe.setAttribute('d', piece.d)
        const len = probe.getTotalLength()
        // the line reaches this waypoint at the end of its connector ≈ start of the shape;
        // light it a little after the piece begins so the dot pops as the tip arrives.
        nodes.push({ el: piece.el, l: offset + len * (piece.el.dataset.thread === 'point' ? 1 : 0.02), lit: false })
        for (let l = sx.length * STEP - offset; l <= len; l += STEP) {
          const p = probe.getPointAtLength(l)
          sx.push(p.x)
          sy.push(p.y)
        }
        offset += len
      }
      probe.remove()
      total = offset
      path.current!.style.strokeDasharray = `${total} ${total}`

      const n = sx.length
      xs = Float32Array.from(sx)
      ys = Float32Array.from(sy)
      maxY = new Float32Array(n)
      let m = -Infinity
      for (let i = 0; i < n; i++) maxY[i] = m = Math.max(m, ys[i])
      cur = -1 // snap on next frame
    }

    const lengthAt = (target: number) => {
      const n = maxY.length
      if (!n || target <= maxY[0]) return 0
      if (target >= maxY[n - 1]) return total
      let lo = 0
      let hi = n - 1
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1
        if (maxY[mid] <= target) lo = mid
        else hi = mid
      }
      const span = maxY[hi] - maxY[lo] || 1
      return Math.min(total, (lo + (target - maxY[lo]) / span) * STEP)
    }

    const tick = () => {
      if (!total) return
      const want = reducedMotion() ? total : lengthAt(window.scrollY - main.offsetTop + window.innerHeight * TIP)
      cur = cur < 0 ? want : cur + (want - cur) * 0.14
      if (Math.abs(want - cur) < 0.05) cur = want
      path.current!.style.strokeDashoffset = String(total - cur)

      const fi = cur / STEP
      const i = Math.min(Math.floor(fi), xs.length - 1)
      const j = Math.min(i + 1, xs.length - 1)
      const t = fi - i
      const hx = xs[i] + (xs[j] - xs[i]) * t
      const hy = ys[i] + (ys[j] - ys[i]) * t
      head.current!.setAttribute('transform', `translate(${f(hx)} ${f(hy)})`)
      head.current!.style.opacity = cur > 1 ? '1' : '0'
      head.current!.classList.toggle('is-done', cur >= total - 1)

      for (const nd of nodes) {
        const lit = cur >= nd.l - 2
        if (lit !== nd.lit) {
          nd.lit = lit
          nd.el.classList.toggle('is-lit', lit)
        }
      }
    }

    let raf = 0
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(build)
    }
    const ro = new ResizeObserver(schedule)
    ro.observe(main)
    document.fonts?.ready.then(schedule)
    window.addEventListener('load', schedule)
    gsap.ticker.add(tick)
    build()

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('load', schedule)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <svg className="thread-layer" ref={svg} aria-hidden>
      <path className="thread-ghost" ref={ghost} />
      <path className="thread-line" ref={path} />
      <g className="thread-head" ref={head}>
        <circle className="halo" r="16" />
        <circle className="core" r="5" />
      </g>
    </svg>
  )
}
