const STEPS = [
  {
    title: 'Escolha',
    text: 'Abra qualquer relógio para ver as especificações, o stock e o preço em meticais.',
  },
  {
    title: 'Junte ao pedido',
    text: 'Adicione um ou vários artigos. A lista fica guardada e o total é calculado na hora.',
  },
  {
    title: 'Envie pelo WhatsApp',
    text: 'Recebemos a lista com as referências e confirmamos consigo a disponibilidade, o pagamento e a entrega.',
  },
]

/** Os três passos de uma encomenda, pela ordem em que acontecem. */
export function OrderSteps({ dark = false }: { dark?: boolean }) {
  return (
    <ol className="grid gap-x-[clamp(24px,4vw,64px)] gap-y-8 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <li key={s.title} className={`flex gap-5 border-t pt-6 md:flex-col md:gap-4 ${dark ? 'border-navy-soft' : 'border-line'}`}>
          <span
            aria-hidden="true"
            className={`display flex-none text-[3.25rem] leading-[0.8] lining-nums md:text-[4rem] ${dark ? 'text-line' : 'text-faint'}`}
          >
            {i + 1}
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="display text-[1.625rem] leading-[1.15]">{s.title}</h3>
            <p className={`max-w-[38ch] ${dark ? 'text-line' : 'text-muted'}`}>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
