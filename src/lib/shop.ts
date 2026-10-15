import { CATEGORIES, PRICE_RANGES, PRODUCTS, SORTS, inCategory, type CategoryId, type Product, type SortId } from '../data/products'

export interface ShopFilters {
  cats: CategoryId[]
  brands: string[]
  price: string | null
  q: string
  sort: SortId
}

export const EMPTY_FILTERS: ShopFilters = { cats: [], brands: [], price: null, q: '', sort: 'destaques' }

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])

/** Os filtros da loja vivem no URL (?categoria=homem&marca=Casio…) para serem partilháveis. */
export function parseFilters(params: URLSearchParams): ShopFilters {
  const sort = params.get('ordenar')
  const price = params.get('preco')
  return {
    cats: list(params.get('categoria')).filter((c): c is CategoryId => CATEGORIES.some((x) => x.id === c)),
    brands: list(params.get('marca')),
    price: PRICE_RANGES.some((r) => r.id === price) ? price : null,
    q: params.get('q') ?? '',
    sort: SORTS.some((s) => s.id === sort) ? (sort as SortId) : 'destaques',
  }
}

export function filtersToSearch(f: Partial<ShopFilters>) {
  const p = new URLSearchParams()
  if (f.cats?.length) p.set('categoria', f.cats.join(','))
  if (f.brands?.length) p.set('marca', f.brands.join(','))
  if (f.price) p.set('preco', f.price)
  if (f.q?.trim()) p.set('q', f.q)
  if (f.sort && f.sort !== 'destaques') p.set('ordenar', f.sort)
  return p
}

export function shopUrl(f: Partial<ShopFilters> = {}) {
  const s = filtersToSearch(f).toString()
  return s ? `/loja?${s}` : '/loja'
}

export const matchesQuery = (p: Product, q: string) =>
  `${p.brand} ${p.name} ${p.model} ${p.ref}`.toLowerCase().includes(q.trim().toLowerCase())

export function sortProducts(products: Product[], sort: SortId) {
  const l = products.slice()
  if (sort === 'novidades') l.sort((a, b) => b.added - a.added)
  else if (sort === 'preco-menor') l.sort((a, b) => a.price - b.price)
  else if (sort === 'preco-maior') l.sort((a, b) => b.price - a.price)
  else l.sort((a, b) => a.featured - b.featured)
  return l
}

export function filterProducts(f: ShopFilters) {
  const range = PRICE_RANGES.find((r) => r.id === f.price)
  return sortProducts(
    PRODUCTS.filter((p) => {
      if (f.q.trim() && !matchesQuery(p, f.q)) return false
      if (f.brands.length && !f.brands.includes(p.brand)) return false
      if (f.cats.length && !f.cats.some((c) => inCategory(p, c))) return false
      if (range && !(p.price >= range.min && p.price < range.max)) return false
      return true
    }),
    f.sort,
  )
}
