import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, reducedMotion, scroll } from './lib/anim'
import { Cursor, Header, Preloader } from './components/Chrome'
import { Thread } from './components/Thread'
import { Hero } from './components/Hero'
import { Intent } from './components/Intent'
import { Marquee, Services } from './components/Services'
import { Work } from './components/Work'
import { About, Contact, Process } from './components/Outro'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const onDone = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ lerp: 0.085, anchors: { duration: 1.8 } })
    scroll.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      scroll.lenis = null
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !loaded)
    if (loaded) {
      scroll.lenis?.start()
      ScrollTrigger.refresh()
    } else {
      window.scrollTo(0, 0)
      scroll.lenis?.stop()
    }
  }, [loaded])

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Cursor />
      {!loaded && <Preloader onDone={onDone} />}
      <Header />
      <main>
        <Thread />
        <Hero ready={loaded} />
        <Intent />
        <Services />
        <Marquee />
        <Work />
        <Process />
        <About />
        <Contact />
      </main>
      <div className="grain" aria-hidden />
    </>
  )
}
