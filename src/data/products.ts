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

// Relógios em stock na loja (fotografias reais, 2026-10-16). Preços enviados pela loja no
// WhatsApp, exceto o BOSS Prateado (ainda provisório). As especificações dizem só o que se vê no relógio.
export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'g-shock-preto-dourado',
    ref: 'MADEY-001',
    brand: 'G-Shock',
    name: 'G-Shock Preto e Dourado',
    model: 'Analógico, caixa octogonal',
    image: 'p-gshock-dourado',
    cats: ['homem', 'desporto'],
    price: 2000,
    stock: 'in',
    added: 20261016,
    featured: 1,
    desc: 'Caixa octogonal em resina preta, ponteiros e índices em tom dourado e pequeno mostrador do dia da semana. Resistente aos choques, como todos os G-Shock.',
    specs: { Mostrador: 'Preto, índices dourados', Funções: 'Dia da semana', Caixa: 'Resina preta', Bracelete: 'Resina preta' },
  },
  {
    id: 2,
    slug: 'edifice-cronografo-taquimetro',
    ref: 'MADEY-002',
    brand: 'Casio',
    name: 'Edifice Cronógrafo Taquímetro',
    model: 'Edifice, vidro de safira',
    image: 'p-edifice-taquimetro',
    cats: ['homem', 'desporto'],
    price: 3850,
    stock: 'in',
    added: 20261015,
    featured: 2,
    desc: 'Cronógrafo de inspiração automóvel: luneta preta com escala taquimétrica, mostrador texturado com as cidades do mundo e janela da data.',
    specs: { Mostrador: 'Preto texturado', Funções: 'Cronógrafo, taquímetro, data', Vidro: 'Safira', Bracelete: 'Aço inoxidável' },
  },
  {
    id: 3,
    slug: 'boss-azul-pele-castanha',
    ref: 'MADEY-003',
    brand: 'Hugo Boss',
    name: 'BOSS Azul, Pele Castanha',
    model: 'Três ponteiros com data',
    image: 'p-boss-azul',
    cats: ['homem', 'classico'],
    price: 3850,
    stock: 'in',
    added: 20261014,
    featured: 3,
    desc: 'Mostrador azul com acabamento sunray, índices aplicados e data às 6 horas, numa bracelete em pele castanha. Elegante sem esforço.',
    specs: { Mostrador: 'Azul sunray', Funções: 'Data', Caixa: 'Aço inoxidável', Bracelete: 'Pele castanha' },
  },
  {
    id: 4,
    slug: 'casio-multifuncoes-creme-data',
    ref: 'MADEY-004',
    brand: 'Casio',
    name: 'Casio Multifunções Creme',
    model: 'Luneta serrilhada, WR 50M',
    image: 'p-casio-creme-data',
    cats: ['homem', 'classico'],
    price: 3000,
    stock: 'in',
    added: 20261013,
    featured: 4,
    desc: 'Mostrador creme com detalhes em rosé, três pequenos mostradores e janela da data, rodeado por uma luneta serrilhada em aço.',
    specs: { Mostrador: 'Creme, detalhes rosé', Funções: 'Dia, 24 horas, data', 'Resistência à água': '50 m', Bracelete: 'Aço inoxidável' },
  },
  {
    id: 5,
    slug: 'boss-champanhe-pele-preta',
    ref: 'MADEY-005',
    brand: 'Hugo Boss',
    name: 'BOSS Champanhe, Pele Preta',
    model: 'Swiss Made, com data',
    image: 'p-boss-champanhe',
    cats: ['homem', 'classico'],
    price: 3850,
    stock: 'in',
    added: 20261012,
    featured: 5,
    desc: 'Mostrador champanhe sunray com índices em aço e data às 6 horas, caixa de linhas direitas e bracelete em pele preta. Feito na Suíça.',
    specs: { Mostrador: 'Champanhe sunray', Funções: 'Data', Origem: 'Suíça (Swiss Made)', Bracelete: 'Pele preta' },
  },
  {
    id: 6,
    slug: 'edifice-solar-safira',
    ref: 'MADEY-006',
    brand: 'Casio',
    name: 'Edifice Solar Safira',
    model: 'EFS-S570D-1A',
    image: 'p-edifice-solar',
    cats: ['homem', 'desporto'],
    price: 3850,
    stock: 'in',
    added: 20261011,
    featured: 6,
    desc: 'Carrega com a luz, por isso nunca precisa de trocar a pilha. Caixa octogonal em aço, mostrador azul-escuro com cronógrafo, data e vidro de safira.',
    specs: { Mostrador: 'Azul-escuro', Funções: 'Cronógrafo, data', Energia: 'Solar', Vidro: 'Safira' },
  },
  {
    id: 7,
    slug: 'edifice-cronografo-octogonal',
    ref: 'MADEY-007',
    brand: 'Casio',
    name: 'Edifice Cronógrafo Octogonal',
    model: 'Edifice, vidro de safira',
    image: 'p-edifice-octogonal',
    cats: ['homem', 'desporto'],
    price: 3850,
    stock: 'in',
    added: 20261010,
    featured: 7,
    desc: 'Caixa octogonal com parafusos à vista, mostrador preto texturado com cronógrafo e data, vidro de safira e bracelete em aço.',
    specs: { Mostrador: 'Preto texturado', Funções: 'Cronógrafo, data', Vidro: 'Safira', Bracelete: 'Aço inoxidável' },
  },
  {
    id: 8,
    slug: 'boss-prateado-pele-preta',
    ref: 'MADEY-008',
    brand: 'Hugo Boss',
    name: 'BOSS Prateado, Pele Preta',
    model: 'Três ponteiros com data',
    image: 'p-boss-prateado',
    cats: ['homem', 'classico'],
    price: 13900,
    stock: 'in',
    added: 20261009,
    featured: 8,
    desc: 'Mostrador prateado sunray, índices em aço e data às 6 horas, numa caixa redonda polida com bracelete em pele preta. Para o escritório e para a noite.',
    specs: { Mostrador: 'Prateado sunray', Funções: 'Data', Caixa: 'Aço inoxidável', Bracelete: 'Pele preta' },
  },
  {
    id: 10,
    slug: 'estojo-viagem-3-relogios',
    ref: 'MADEY-010',
    brand: 'MADEY Selection',
    name: 'Estojo de Viagem para 3 Relógios',
    model: 'Travel Roll 3',
    image: 'p-case',
    cats: ['acessorios'],
    accessory: true,
    price: 2800,
    stock: 'in',
    added: 20260710,
    featured: 10,
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
