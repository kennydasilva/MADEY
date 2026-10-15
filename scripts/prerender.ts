// Corre depois do `vite build`. O WhatsApp e outros leitores de links não
// executam JavaScript, por isso cada página pública ganha o seu próprio HTML
// com título, descrição e imagem. O conteúdo continua a ser desenhado pelo React.
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { config } from '../src/config.ts'
import { PRODUCTS, type Product } from '../src/data/products.ts'

const DIST = 'dist'
const SITE = config.siteUrl
const SITE_TITLE = 'MADEY — Relógios e acessórios'
const SITE_DESC = 'Relógios e acessórios selecionados em Maputo, com preços em meticais.'

// Cópias com nome estável (os ficheiros do build levam hash) para og:image.
cpSync('imagens', join(DIST, 'og'), { recursive: true })
const ogFiles = readdirSync(join(DIST, 'og'))
const ogImage = (name: string) => {
  const file = ogFiles.find((f) => f.replace(/\.[^.]+$/, '') === name)
  return file ? `${SITE}/og/${file}` : ''
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const price = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' MT'

interface Page {
  path: string
  title: string
  description: string
  image: string
  type?: 'website' | 'product'
  jsonLd?: object
}

const template = readFileSync(join(DIST, 'index.html'), 'utf8')

function render(p: Page) {
  const url = SITE + p.path
  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="MADEY" />`,
    `<meta property="og:locale" content="pt_PT" />`,
    `<meta property="og:type" content="${p.type ?? 'website'}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    p.image && `<meta property="og:image" content="${p.image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    // "<" escapado para um texto do catálogo nunca conseguir fechar a tag script.
    p.jsonLd && `<script type="application/ld+json">${JSON.stringify(p.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')

  return template
    .replace(/<title>.*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(p.description)}" />`)
    .replace('</head>', `  ${head}\n  </head>`)
}

function productPage(p: Product): Page {
  const path = `/produto/${p.slug}`
  const availability = { in: 'InStock', low: 'LimitedAvailability', order: 'PreOrder', out: 'OutOfStock' }[p.stock]
  return {
    path,
    title: `${p.name} · ${p.brand} — MADEY`,
    description: `${price(p.price)} · ${p.desc}`,
    image: ogImage(p.image),
    type: 'product',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.name,
      description: p.desc,
      sku: p.ref,
      mpn: p.model,
      brand: { '@type': 'Brand', name: p.brand },
      image: ogImage(p.image),
      offers: {
        '@type': 'Offer',
        url: SITE + path,
        price: p.price,
        priceCurrency: 'MZN',
        availability: `https://schema.org/${availability}`,
      },
    },
  }
}

const pages: Page[] = [
  { path: '/', title: SITE_TITLE, description: SITE_DESC, image: ogImage('hero') },
  {
    path: '/loja',
    title: 'Todos os relógios — MADEY',
    description: `Catálogo MADEY: relógios e acessórios.`,
    image: ogImage('hero'),
  },
  {
    path: '/entregas-e-pagamentos',
    title: 'Encomendas, entregas e pagamentos — MADEY',
    description: 'Entregas, pagamento e trocas na MADEY, em Maputo.',
    image: ogImage('hero'),
  },
  ...PRODUCTS.map(productPage),
]

for (const p of pages) {
  // "/" é o index.html; as restantes ficam em <caminho>.html (servidas sem extensão via cleanUrls).
  const file = join(DIST, p.path === '/' ? 'index.html' : `${p.path}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(p))
}

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((p) => `  <url><loc>${SITE}${p.path}</loc></url>`).join('\n') +
    `\n</urlset>\n`,
)
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)

console.log(`prerender: ${pages.length} páginas, sitemap.xml e robots.txt`)
