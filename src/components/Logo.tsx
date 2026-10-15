import type { CSSProperties } from 'react'

// Recortes do logótipo original (LOGO MADEY/), com fundo transparente, em public/brand/.
const VARIANTS = {
  /** Monograma com a coroa. */
  mark: { src: '/brand/mark.png', ratio: 480 / 520 },
  /** Só a palavra MADEY. */
  word: { src: '/brand/wordmark.png', ratio: 1200 / 274 },
  /** Monograma, palavra e "Watches & Accessories". */
  full: { src: '/brand/lockup.png', ratio: 1200 / 769 },
}

/** Logótipo MADEY na cor do texto à volta (dourado por omissão). Defina a altura com `className`. */
export function Logo({
  variant = 'word',
  className = '',
  decorative = false,
}: {
  variant?: keyof typeof VARIANTS
  className?: string
  /** Escondido dos leitores de ecrã quando o que está à volta já tem nome. */
  decorative?: boolean
}) {
  const v = VARIANTS[variant]
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'MADEY'}
      aria-hidden={decorative || undefined}
      className={`logo ${className}`}
      style={{ '--logo': `url(${v.src})`, aspectRatio: v.ratio } as CSSProperties}
    />
  )
}
