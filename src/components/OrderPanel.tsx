import { Link, useLocation } from 'react-router-dom'
import { MAX_QTY, useOrder } from '../context/order'
import { useUi } from '../context/ui'
import { formatPrice, itemsLabel, productPath } from '../lib/format'
import { useDialog } from '../lib/dialog'
import { shopUrl } from '../lib/shop'
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from './Icons'
import { Photo } from './Photo'

/** Conteúdo do pedido, igual no painel por cima da página e na coluna fixa. */
function OrderContents({ onClose, closeLabel }: { onClose: () => void; closeLabel: string }) {
  const { closeAll, requestOrder, flash } = useUi()
  const { lines, count, total, setQty, remove, clear } = useOrder()

  const step = 'flex size-11 items-center justify-center hover:bg-mist disabled:text-line disabled:hover:bg-white sm:size-9'

  return (
    <>
      <div className="flex flex-none items-center justify-between border-b border-line py-2.5 pr-3 pl-6">
        <h2 className="font-serif text-[1.625rem] leading-none font-medium">
          O seu pedido
          {count > 0 && <span className="ml-3 font-sans text-caption font-normal text-muted">{itemsLabel(count)}</span>}
        </h2>
        <button onClick={onClose} aria-label={closeLabel} className="flex size-11 flex-none items-center justify-center hover:bg-mist">
          <CloseIcon />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6 pb-16">
          <BagIcon size={28} strokeWidth={1.4} className="text-faint" />
          <p className="display text-[1.875rem]">Ainda não escolheu nenhum artigo.</p>
          <p className="max-w-[36ch] text-muted">
            Junte relógios e acessórios ao pedido e envie a lista completa pelo WhatsApp, com o total já calculado.
          </p>
          <Link to={shopUrl()} onClick={closeAll} className="btn btn-dark mt-2">
            Ver relógios
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto px-6">
            {lines.map(({ product: p, qty }) => (
              <li key={p.id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-line pt-5 pb-3">
                <Photo name={p.image} sizes="72px" alt="" className="aspect-[4/5] w-[72px] bg-stone object-cover" />
                <div className="flex min-w-0 flex-col gap-1">
                  <Link
                    to={productPath(p)}
                    onClick={closeAll}
                    className="font-serif text-xl leading-[1.2] font-medium underline-offset-4 hover:underline"
                  >
                    {p.name}
                  </Link>
                  <span className="text-caption text-muted">
                    Ref. {p.ref}
                    {p.stock === 'order' && ' · Sob encomenda'}
                    {p.stock === 'low' && ' · Poucas unidades'}
                  </span>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex border border-line">
                      <button
                        onClick={() => setQty(p, qty - 1)}
                        disabled={qty <= 1}
                        aria-label={`Diminuir quantidade de ${p.name}`}
                        className={step}
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span
                        aria-live="polite"
                        className="flex w-10 items-center justify-center border-x border-line text-sm font-bold tabular-nums"
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(p, qty + 1)}
                        disabled={qty >= MAX_QTY}
                        aria-label={`Aumentar quantidade de ${p.name}`}
                        className={step}
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col items-end tabular-nums">
                      <span className="font-bold">{formatPrice(p.price * qty)}</span>
                      {qty > 1 && <span className="text-caption text-muted">{formatPrice(p.price)} cada</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      remove(p)
                      flash(`${p.name} foi removido do pedido`)
                    }}
                    aria-label={`Remover ${p.name} do pedido`}
                    className="flex h-11 items-center gap-2 self-start text-caption font-semibold text-muted underline-offset-4 hover:text-sale hover:underline sm:h-9"
                  >
                    <TrashIcon size={15} />
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-none flex-col gap-3 border-t border-navy px-6 pt-5 pb-[calc(20px+env(safe-area-inset-bottom))]">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-semibold">Total estimado</span>
              <span className="text-[1.5rem] font-bold tabular-nums">{formatPrice(total)}</span>
            </div>
            <p className="text-caption text-muted">
              Preços e disponibilidade são confirmados consigo no WhatsApp, tal como o pagamento e a entrega.
            </p>
            <button onClick={() => requestOrder(lines)} className="btn btn-wa mt-1 h-14 gap-3">
              <WhatsAppIcon />
              Solicitar no WhatsApp
            </button>
            <button
              onClick={clear}
              className="self-center px-2 py-2 text-caption text-muted underline underline-offset-4 hover:text-navy"
            >
              Limpar pedido
            </button>
          </div>
        </>
      )}
    </>
  )
}

/** O pedido como painel por cima da página (telemóvel, ecrãs estreitos, página de produto). */
export function OrderPanel() {
  const { orderOpen, closeAll } = useUi()
  const ref = useDialog<HTMLDivElement>(orderOpen)
  if (!orderOpen) return null

  return (
    <div onClick={closeAll} className="overlay-in fixed inset-0 z-[70] flex justify-end bg-navy/55">
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="O seu pedido"
        className="panel-right flex h-full w-[min(480px,100%)] flex-col bg-white"
      >
        <OrderContents onClose={closeAll} closeLabel="Fechar pedido" />
      </div>
    </div>
  )
}

/** O pedido como coluna fixa ao lado do catálogo: fica à vista enquanto se continua a escolher. */
export function OrderDock() {
  const { setDockOpen } = useUi()
  return (
    <aside
      aria-label="O seu pedido"
      className="panel-right fixed inset-y-0 right-0 z-[55] flex w-[360px] flex-col border-l border-line bg-white"
    >
      <OrderContents onClose={() => setDockOpen(false)} closeLabel="Recolher pedido" />
    </aside>
  )
}

/** Atalho fixo para o pedido em ecrãs pequenos; a página de produto tem a sua própria barra. */
export function OrderBar() {
  const { openOrder } = useUi()
  const { count, total } = useOrder()
  const { pathname } = useLocation()
  if (!count || pathname.startsWith('/produto/')) return null

  return (
    <>
      <div className="h-[68px] bg-navy lg:hidden" />
      <button
        key={count}
        onClick={openOrder}
        className="on-dark panel-pop fixed inset-x-0 bottom-0 z-[60] flex items-center justify-between gap-4 bg-navy px-5 pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom))] text-left text-white shadow-[0_-8px_24px_rgba(20,31,51,0.18)] lg:hidden"
      >
        <span className="flex flex-col leading-tight">
          <span className="text-caption text-line">{itemsLabel(count)} no pedido</span>
          <span className="text-[1.0625rem] font-bold tabular-nums">{formatPrice(total)}</span>
        </span>
        <span className="flex h-10 items-center gap-2 border border-white px-4 text-label font-bold tracking-[0.14em] uppercase">
          <BagIcon size={16} />
          Ver pedido
        </span>
      </button>
    </>
  )
}
