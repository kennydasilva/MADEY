import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckIcon, CloseIcon } from '../components/Icons'
import { ProductGrid } from '../components/ProductCard'
import { BRANDS, CATEGORIES, PRICE_RANGES, PRODUCTS, SORTS, categoryLabel, type SortId } from '../data/products'
import { countLabel } from '../lib/format'
import { usePageTitle } from '../lib/title'
import { EMPTY_FILTERS, filterProducts, filtersToSearch, parseFilters, type ShopFilters } from '../lib/shop'

// O catálogo cabe numa página; a paginação só aparece quando crescer.
const PER_PAGE = 12

interface FilterOption {
  label: string
  count: number
  on: boolean
  toggle: () => void
}

function FilterGroup({ title, options }: { title: string; options: FilterOption[] }) {
  return (
    <div className="flex flex-col">
      <span className="mb-2.5 text-sm font-bold">{title}</span>
      {options.map((o) => (
        <button
          key={o.label}
          onClick={o.toggle}
          role="checkbox"
          aria-checked={o.on}
          className="flex min-h-11 items-center gap-3 text-left text-sm lg:min-h-9"
        >
          <span
            className={`flex size-4 flex-none items-center justify-center border text-white ${o.on ? 'border-gold bg-gold' : 'border-faint bg-white'}`}
          >
            {o.on && <CheckIcon size={10} />}
          </span>
          <span className="flex-1">{o.label}</span>
          <span className="text-caption text-faint tabular-nums">{o.count}</span>
        </button>
      ))}
    </div>
  )
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const f = parseFilters(params)
  const [shown, setShown] = useState(PER_PAGE)
  const [panelOpen, setPanelOpen] = useState(false)

  // Qualquer mudança de filtros volta à primeira "página" de resultados.
  const key = params.toString()
  useEffect(() => setShown(PER_PAGE), [key])

  const update = (patch: Partial<ShopFilters>) =>
    setParams(filtersToSearch({ ...f, ...patch }), { replace: true, preventScrollReset: true })
  const toggle = <K extends 'cats' | 'brands'>(k: K, v: ShopFilters[K][number]) => {
    const current = f[k] as string[]
    update({ [k]: current.includes(v) ? current.filter((x) => x !== v) : [...current, v] })
  }
  const clearAll = () => update({ ...EMPTY_FILTERS, sort: f.sort })

  const all = filterProducts(f)
  const visible = all.slice(0, shown)

  let title = 'Todos os relógios'
  if (f.cats.length === 1 && !f.brands.length) title = categoryLabel(f.cats[0])
  else if (f.brands.length === 1 && !f.cats.length) title = f.brands[0]

  usePageTitle(title)

  const chips = [
    ...(f.q.trim() ? [{ label: `“${f.q.trim()}”`, remove: () => update({ q: '' }) }] : []),
    ...f.cats.map((c) => ({ label: categoryLabel(c), remove: () => toggle('cats', c) })),
    ...f.brands.map((b) => ({ label: b, remove: () => toggle('brands', b) })),
    ...(f.price
      ? [{ label: PRICE_RANGES.find((r) => r.id === f.price)!.label, remove: () => update({ price: null }) }]
      : []),
  ]

  const groups = [
    {
      title: 'Categoria',
      options: CATEGORIES.map((c) => ({
        label: c.label,
        count: PRODUCTS.filter((p) => p.cats.includes(c.id)).length,
        on: f.cats.includes(c.id),
        toggle: () => toggle('cats', c.id),
      })),
    },
    {
      title: 'Marca',
      options: BRANDS.map((b) => ({
        label: b,
        count: PRODUCTS.filter((p) => p.brand === b).length,
        on: f.brands.includes(b),
        toggle: () => toggle('brands', b),
      })),
    },
    {
      title: 'Preço',
      options: PRICE_RANGES.map((r) => ({
        label: r.label,
        count: PRODUCTS.filter((p) => p.price >= r.min && p.price < r.max).length,
        on: f.price === r.id,
        toggle: () => update({ price: f.price === r.id ? null : r.id }),
      })),
    },
  ]

  return (
    <section className="wrap pt-[clamp(36px,5vw,72px)] pb-[clamp(64px,8vw,112px)]">
      <nav aria-label="Caminho" className="mb-4 flex gap-2 text-caption text-muted">
        <Link to="/" className="hover:text-gold">
          Início
        </Link>
        <span>/</span>
        <span className="text-gold">Loja</span>
      </nav>
      <h1 className="display mb-[clamp(24px,3vw,36px)] text-[clamp(2.5rem,1.6rem+3.4vw,4rem)] leading-[1.02]">{title}</h1>

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-y border-line py-4">
        <div className="flex min-w-[min(100%,280px)] flex-1 flex-wrap items-center gap-x-4 gap-y-3">
          <input
            value={f.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Pesquisar marca, modelo…"
            aria-label="Pesquisar na loja"
            className="h-11 w-[min(320px,100%)] border border-faint bg-white px-4 text-base placeholder:text-faint focus:border-navy lg:text-sm"
          />
          <span role="status" className="text-sm text-muted">
            {countLabel(all.length)}
          </span>
          <button
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            className={`flex h-11 items-center gap-2 border border-navy px-4 text-[11px] font-bold tracking-[0.16em] uppercase lg:hidden ${panelOpen ? 'bg-gold border-gold text-white' : 'bg-white'}`}
          >
            {chips.length ? `Filtros (${chips.length})` : 'Filtros'}
          </button>
        </div>
        <label className="flex items-center gap-2.5 text-sm text-muted">
          Ordenar
          <select
            value={f.sort}
            onChange={(e) => update({ sort: e.target.value as SortId })}
            className="h-11 rounded-none border border-faint bg-white px-3 text-base text-gold lg:text-sm"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={c.remove}
              aria-label={`Remover filtro ${c.label}`}
              className="flex h-10 items-center gap-2 border border-line bg-mist px-3 text-xs font-semibold hover:border-navy lg:h-8"
            >
              {c.label}
              <CloseIcon size={12} strokeWidth={2.4} />
            </button>
          ))}
          <button onClick={clearAll} className="h-10 px-1 text-xs underline underline-offset-[3px] lg:h-8">
            Limpar tudo
          </button>
        </div>
      )}

      <div className="grid items-start gap-[clamp(24px,4vw,56px)] pt-[clamp(24px,3vw,40px)] lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className={`flex-col gap-8 lg:flex ${panelOpen ? 'flex' : 'hidden'}`}>
          {groups.map((g) => (
            <FilterGroup key={g.title} {...g} />
          ))}
          <button onClick={() => setPanelOpen(false)} className="btn btn-dark lg:hidden">
            Ver {countLabel(all.length)}
          </button>
        </aside>

        <div className="min-w-0">
          {all.length > 0 ? (
            <>
              <ProductGrid products={visible} columns={3} />
              {all.length > shown && (
                <div className="mt-14 flex flex-col items-center gap-3.5">
                  <span className="text-caption text-muted">
                    A mostrar {visible.length} de {all.length}
                  </span>
                  <button
                    onClick={() => setShown((n) => n + PER_PAGE)}
                    className="btn btn-outline h-12 px-7 hover:border-gold hover:bg-gold hover:text-white"
                  >
                    Carregar mais
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3.5 border border-line px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,80px)] text-center">
              <h2 className="display text-[clamp(28px,3vw,38px)]">Nenhum produto encontrado</h2>
              <p className="max-w-[44ch] text-muted">Experimente remover um filtro ou pesquisar por marca ou modelo.</p>
              <button onClick={clearAll} className="btn btn-dark mt-2 h-12 px-6">
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
