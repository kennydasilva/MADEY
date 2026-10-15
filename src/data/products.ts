export type CategoryId = 'relogios' | 'homem' | 'senhora' | 'desporto' | 'classico' | 'acessorios'
export type Stock = 'in' | 'low' | 'order' | 'out'
export type Badge = 'Promoção' | 'Poucas unidades' | 'Sob encomenda'

export interface Product {
  id: number
  slug: string
  ref: string
  brand: string
  name: string
  model: string
  /** Nome do ficheiro em imagens/, sem extensão. */
  image: string
  cats: CategoryId[]
  accessory?: boolean
  price: number
  was?: number
  badge?: Badge
  stock: Stock
  /** Data de entrada no catálogo (AAAAMMDD), para ordenar por novidades. */
  added: number
  featured: number
  desc: string
  specs: Record<string, string>
}

export const CATEGORIES: { id: CategoryId; label: string; short: string }[] = [
  { id: 'relogios', label: 'Relógios', short: 'Relógios' },
  { id: 'homem', label: 'Relógios de Homem', short: 'Homem' },
  { id: 'senhora', label: 'Relógios de Senhora', short: 'Senhora' },
  { id: 'desporto', label: 'Desporto & Digital', short: 'Desporto & Digital' },
  { id: 'classico', label: 'Clássico & Elegante', short: 'Clássico & Elegante' },
  { id: 'acessorios', label: 'Acessórios', short: 'Acessórios' },
]

export const PRICE_RANGES = [
  { id: 'ate-5000', label: 'Até 5.000 MT', min: 0, max: 5000 },
  { id: '5000-15000', label: '5.000 – 15.000 MT', min: 5000, max: 15000 },
  { id: 'mais-15000', label: 'Mais de 15.000 MT', min: 15000, max: Infinity },
]

export const SORTS = [
  { id: 'destaques', label: 'Destaques' },
  { id: 'novidades', label: 'Novidades' },
  { id: 'preco-menor', label: 'Preço: menor' },
  { id: 'preco-maior', label: 'Preço: maior' },
] as const
export type SortId = (typeof SORTS)[number]['id']

// Catálogo de exemplo — confirmar preço, stock e especificações antes de publicar.
export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'g-shock-ga-2100-preto',
    ref: 'MADEY-001',
    brand: 'G-Shock',
    name: 'G-Shock GA-2100 Preto',
    model: 'GA-2100-1A1',
    image: 'p-gshock',
    cats: ['homem', 'desporto'],
    price: 8500,
    stock: 'in',
    added: 20260920,
    featured: 1,
    desc: 'O G-Shock octogonal e fino: estrutura com núcleo de carbono, leve e resistente, com mostrador analógico-digital de leitura imediata.',
    specs: { Movimento: 'Quartzo, analógico-digital', Caixa: '45,4 mm', 'Resistência à água': '200 m', Bracelete: 'Resina' },
  },
  {
    id: 2,
    slug: 'casio-vintage-dourado',
    ref: 'MADEY-002',
    brand: 'Casio',
    name: 'Casio Vintage Dourado',
    model: 'A158WETG-9A',
    image: 'p-vintage',
    cats: ['homem', 'senhora', 'desporto'],
    price: 3900,
    was: 4500,
    badge: 'Promoção',
    stock: 'in',
    added: 20260515,
    featured: 2,
    desc: 'O clássico digital em tom dourado, com luz, alarme e cronómetro. Leve, retro e fácil de usar todos os dias.',
    specs: { Movimento: 'Quartzo, digital', Caixa: '33 mm', 'Resistência à água': 'Resistente a salpicos', Bracelete: 'Aço inoxidável dourado' },
  },
  {
    id: 3,
    slug: 'edifice-cronografo-aco',
    ref: 'MADEY-003',
    brand: 'Casio',
    name: 'Edifice Cronógrafo Aço',
    model: 'Edifice EFV-580D',
    image: 'p-edifice',
    cats: ['homem', 'classico'],
    price: 9800,
    badge: 'Poucas unidades',
    stock: 'low',
    added: 20260710,
    featured: 3,
    desc: 'Cronógrafo desportivo em aço com três submostradores e data — robusto, preciso e versátil.',
    specs: { Movimento: 'Quartzo, cronógrafo', Caixa: '43,8 mm', 'Resistência à água': '100 m', Bracelete: 'Aço inoxidável' },
  },
  {
    id: 4,
    slug: 'boss-classico-azul',
    ref: 'MADEY-004',
    brand: 'Hugo Boss',
    name: 'BOSS Clássico Azul',
    model: 'Confidence 1513833',
    image: 'p-boss',
    cats: ['homem', 'classico'],
    price: 14500,
    stock: 'in',
    added: 20260601,
    featured: 4,
    desc: 'Mostrador azul sunray, caixa polida e bracelete em pele preta. Elegância discreta para o dia a dia e ocasiões especiais.',
    specs: { Movimento: 'Quartzo', Caixa: '44 mm', 'Resistência à água': '30 m', Bracelete: 'Pele' },
  },
  {
    id: 5,
    slug: 'seiko-5-sports-verde',
    ref: 'MADEY-005',
    brand: 'Seiko',
    name: 'Seiko 5 Sports Verde',
    model: '5 Sports SRPD63',
    image: 'p-seiko',
    cats: ['homem', 'desporto'],
    price: 18900,
    was: 21000,
    badge: 'Promoção',
    stock: 'in',
    added: 20260905,
    featured: 5,
    desc: 'Relógio automático de inspiração mergulho, com luneta verde, dia e data e fundo transparente.',
    specs: { Movimento: 'Automático, cal. 4R36', Caixa: '42,5 mm', 'Resistência à água': '100 m', Bracelete: 'Aço inoxidável' },
  },
  {
    id: 6,
    slug: 'tissot-prx-azul-gelo',
    ref: 'MADEY-006',
    brand: 'Tissot',
    name: 'Tissot PRX Azul Gelo',
    model: 'PRX 40 205',
    image: 'p-prx',
    cats: ['homem', 'classico'],
    price: 32500,
    badge: 'Sob encomenda',
    stock: 'order',
    added: 20261001,
    featured: 6,
    desc: 'Design dos anos 70 com bracelete integrada e mostrador azul-gelo texturado. Um ícone contemporâneo.',
    specs: { Movimento: 'Quartzo', Caixa: '40 mm', 'Resistência à água': '100 m', Bracelete: 'Aço integrada' },
  },
  {
    id: 7,
    slug: 'petite-madreperola-rose',
    ref: 'MADEY-007',
    brand: 'MADEY Selection',
    name: 'Petite Madrepérola Rosé',
    model: 'Petite Mesh 28',
    image: 'p-women',
    cats: ['senhora', 'classico'],
    price: 5200,
    stock: 'in',
    added: 20260830,
    featured: 7,
    desc: 'Caixa delicada de 28 mm em tom rosé, mostrador em madrepérola e bracelete em malha milanesa.',
    specs: { Movimento: 'Quartzo', Caixa: '28 mm', 'Resistência à água': '30 m', Bracelete: 'Malha milanesa rosé' },
  },
  {
    id: 8,
    slug: 'estojo-viagem-3-relogios',
    ref: 'MADEY-008',
    brand: 'MADEY Selection',
    name: 'Estojo de Viagem para 3 Relógios',
    model: 'Travel Roll 3',
    image: 'p-case',
    cats: ['acessorios'],
    accessory: true,
    price: 2800,
    stock: 'in',
    added: 20260710,
    featured: 8,
    desc: 'Estojo em pele azul-marinho com fecho de correr e três almofadas — protege os seus relógios em viagem ou em casa.',
    specs: { Material: 'Pele sintética', Capacidade: '3 relógios', Fecho: 'Fecho de correr metálico', Interior: 'Almofadas removíveis' },
  },
]

export const BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))]

export const STOCK_INFO: Record<Stock, { label: string; note: string; dot: string }> = {
  in: { label: 'Em stock', note: '', dot: 'bg-wa' },
  low: { label: 'Poucas unidades', note: '', dot: 'bg-navy' },
  order: { label: 'Sob encomenda', note: '', dot: 'bg-faint' },
  out: { label: 'Esgotado', note: '', dot: 'bg-sale' },
}

export const isSoldOut = (p: Product) => p.stock === 'out'
/** Um produto esgotado mostra sempre "Esgotado", mesmo que tivesse outro badge. */
export const badgeOf = (p: Product): string | undefined => (isSoldOut(p) ? 'Esgotado' : p.badge)

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug)
export const productById = (id: number) => PRODUCTS.find((p) => p.id === id)
/** Os filtros da loja só mostram estas duas; as outras continuam a servir as coleções da página inicial. */
export const FILTER_CATEGORIES: CategoryId[] = ['relogios', 'acessorios']

/** "Relógios" é tudo o que não é acessório; as outras categorias vêm dos dados de cada produto. */
export const inCategory = (p: Product, c: CategoryId) => (c === 'relogios' ? !p.accessory : p.cats.includes(c))

export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.label ?? id
