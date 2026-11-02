import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { gsap, reducedMotion, scrollToHash } from '../lib/anim'
import { getTheme, toggleTheme, type Theme } from '../lib/theme'
import { site } from '../content'

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion()) {
      onDone()
      return
    }
    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      const num = root.current!.querySelector('.pre-count')!
      gsap
        .timeline({ onComplete: onDone })
        .from('.pre-name span', { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.04 })
        .to(
          counter,
          {
            v: 100,
            duration: 1.3,
            ease: 'power2.inOut',
            onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, '0')),
          },
          0,
        )
        .to('.pre-bar i', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
        .to('.pre-name span', { yPercent: -110, duration: 0.5, ease: 'expo.in', stagger: 0.025 }, '+=0.1')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2')
    }, root)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="preloader" ref={root}>
      <div className="pre-name display">
        {site.brand.split('').map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>
      <div className="pre-foot mono">
        <span>Spinning the thread</span>
        <div className="pre-bar">
          <i />
        </div>
        <span className="pre-count">000</span>
      </div>
    </div>
  )
}

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })
    const label = ring.current!.querySelector('span')!

    const move = (e: PointerEvent) => {
      xd(e.clientX)
      yd(e.clientY)
      xr(e.clientX)
      yr(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]')
      ring.current!.classList.toggle('is-hover', !!t)
      label.textContent = t?.dataset.cursor ?? ''
      ring.current!.classList.toggle('has-label', !!t?.dataset.cursor)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring}>
        <span />
      </div>
    </>
  )
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getTheme)
  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(getTheme()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return (
    <button
      className={`theme-toggle is-${theme}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
    >
      <span className="knob" />
      <span className="mono">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}

export function Header() {
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    scrollToHash(e.currentTarget.getAttribute('href')!)
  }
  return (
    <header className="site-header">
      <a href="#top" className="logo" onClick={go} aria-label={`${site.brand} — back to top`}>
        <svg viewBox="0 0 28 28" aria-hidden>
          <path d="M3 20 C 9 20 8 8 14 8 S 19 20 25 20" />
        </svg>
        <span className="display">{site.brand}</span>
      </a>
      <nav className="mono">
        {site.nav.map((n) => (
          <a key={n.href} href={n.href} onClick={go} className="nav-link">
            <span>{n.label}</span>
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <a href="#contact" onClick={go} className="pill mono">
          {site.cta}
        </a>
      </div>
    </header>
  )
}
