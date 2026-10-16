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

// Logótipos das marcas que vendemos, em src/assets/marcas/: `cor/` com as cores de cada marca,
// e ao lado a mesma forma numa só cor, para pintar com a cor do texto (ratio = largura / altura).
// Importados (não em public/) para o Vite os servir sempre e lhes dar um nome novo quando mudam.
const glob = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop()!, url]))
const MONO = glob(import.meta.glob<string>('../assets/marcas/*.svg', { eager: true, query: '?url', import: 'default' }))
const COLOR = glob(import.meta.glob<string>('../assets/marcas/cor/*.svg', { eager: true, query: '?url', import: 'default' }))

const BRAND_LOGOS: Record<string, { file: string; ratio: number }> = {
  Casio: { file: 'casio.svg', ratio: 5.28 },
  'G-Shock': { file: 'gshock.svg', ratio: 3.86 },
  'Hugo Boss': { file: 'hugo-boss.svg', ratio: 8.33 },
  Seiko: { file: 'seiko.svg', ratio: 5.08 },
  Tissot: { file: 'tissot.svg', ratio: 2.78 },
}

export const hasBrandLogo = (brand: string) => brand in BRAND_LOGOS

/**
 * Logótipo de uma marca com as cores dela; dentro de um elemento `group`, ao passar o rato
 * ou ao chegar lá com o teclado troca para a cor do texto. A altura vem de `--logo-h`, corrigida para que todos ocupem mais ou
 * menos a mesma área: um logótipo largo fica mais baixo, um compacto mais alto.
 */
export function BrandLogo({ brand, className = '' }: { brand: string; className?: string }) {
  const v = BRAND_LOGOS[brand]
  if (!v) return null
  return (
    <span
      className={`relative block flex-none ${className}`}
      style={{ aspectRatio: v.ratio, height: `calc(var(--logo-h, 40px) * ${Math.sqrt(5 / v.ratio).toFixed(3)})` }}
    >
      <img
        src={COLOR[v.file]}
        alt={brand}
        className="size-full transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
      />
      <span
        aria-hidden="true"
        className="logo absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ '--logo': `url("${MONO[v.file]}")` } as CSSProperties}
      />
    </span>
  )
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
