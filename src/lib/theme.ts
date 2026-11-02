import { reducedMotion } from './anim'

export type Theme = 'light' | 'dark'

const KEY = 'strand-theme'

export const getTheme = (): Theme => (document.documentElement.dataset.theme as Theme) ?? 'dark'

function save(t: Theme) {
  try {
    localStorage.setItem(KEY, t)
  } catch {
    /* private mode — theme just won't persist */
  }
}

/** Flip the theme with a circular wipe that grows out of the click point. */
export function toggleTheme(origin: { x: number; y: number }) {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
  const apply = () => {
    document.documentElement.dataset.theme = next
    save(next)
  }
  if (!document.startViewTransition || reducedMotion()) return apply()

  const { x, y } = origin
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  document.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 900, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}
