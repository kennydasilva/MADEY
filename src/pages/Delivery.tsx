import { whatsappDisplay } from '../config'
import { WhatsAppIcon } from '../components/Icons'
import { GENERAL_MESSAGE, whatsappUrl } from '../lib/format'
import { usePageTitle } from '../lib/title'

// Condições comerciais ainda por fechar: cada ponto remete para o WhatsApp
// em vez de prometer prazos ou valores que a loja não confirmou.
const TOPICS = [
  {
    title: 'Como encomendar',
    text: 'Escolha o artigo no site e toque em “Solicitar no WhatsApp”. Recebemos o produto, a referência e o preço, e confirmamos consigo a disponibilidade.',
  },
  {
    title: 'Entregas',
    text: 'Estamos em Maputo. A zona, o prazo e o custo de entrega são confirmados consigo no WhatsApp antes de fechar a encomenda.',
  },
  {
    title: 'Sob encomenda',
    text: 'Os artigos marcados “Sob encomenda” não estão em stock imediato. Indicamos o prazo previsto no WhatsApp antes de avançar.',
  },
  {
    title: 'Pagamento',
    text: 'As formas de pagamento disponíveis são combinadas no WhatsApp. Só pedimos pagamento depois de confirmar a disponibilidade do artigo.',
  },
  {
    title: 'Trocas e devoluções',
    text: 'Se houver algum problema com a sua encomenda, fale connosco pelo WhatsApp — as condições de troca ou devolução são confirmadas caso a caso.',
  },
]

export default function Delivery() {
  usePageTitle('Entregas e pagamentos')
  return (
    <section className="wrap py-[clamp(36px,5vw,72px)] pb-[clamp(64px,8vw,112px)]">
      <span className="eyebrow text-muted">Ajuda</span>
      <h1 className="display mt-3 mb-[clamp(28px,4vw,48px)] text-[clamp(40px,5vw,64px)] leading-[1.02]">
        Entregas e pagamentos
      </h1>
      <div className="grid gap-x-[clamp(24px,3vw,40px)] sm:grid-cols-2">
        {TOPICS.map((t) => (
          <div key={t.title} className="flex flex-col gap-3 border-t border-line py-7">
            <h2 className="display text-[26px] leading-[1.15]">{t.title}</h2>
            <p className="max-w-[52ch] text-sm leading-[1.7] text-muted">{t.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-start gap-4 bg-mist p-[clamp(24px,4vw,48px)]">
        <h2 className="display text-[clamp(26px,3vw,36px)]">Tem alguma dúvida?</h2>
        <p className="max-w-[52ch] text-sm leading-[1.7] text-muted">
          Respondemos diretamente pelo WhatsApp, {whatsappDisplay}.
        </p>
        <a href={whatsappUrl(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
          <WhatsAppIcon size={18} />
          Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}
