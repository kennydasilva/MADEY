import { Link } from 'react-router-dom'
import { whatsappDisplay } from '../config'
import { WhatsAppIcon } from '../components/Icons'
import { OrderSteps } from '../components/OrderSteps'
import { GENERAL_MESSAGE, whatsappUrl } from '../lib/format'
import { shopUrl } from '../lib/shop'
import { usePageTitle } from '../lib/title'

// Condições comerciais ainda por fechar: cada ponto remete para o WhatsApp
// em vez de prometer prazos ou valores que a loja não confirmou.
const TOPICS = [
  {
    title: 'Entregas',
    text: 'Estamos em Maputo. A zona, o prazo e o custo de entrega são confirmados consigo no WhatsApp antes de fechar a encomenda.',
  },
  {
    title: 'Pagamento',
    text: 'As formas de pagamento disponíveis são combinadas no WhatsApp. Só pedimos pagamento depois de confirmar a disponibilidade do artigo.',
  },
  {
    title: 'Sob encomenda',
    text: 'Os artigos marcados “Sob encomenda” não estão em stock imediato. Pode juntá-los ao pedido; indicamos o prazo previsto no WhatsApp antes de avançar.',
  },
  {
    title: 'Esgotados',
    text: 'Um artigo esgotado não entra no pedido. Toque em “Avisar-me” e dizemos-lhe pelo WhatsApp quando voltar a estar disponível.',
  },
  {
    title: 'Trocas e devoluções',
    text: 'Se houver algum problema com a sua encomenda, fale connosco pelo WhatsApp. As condições de troca ou devolução são confirmadas caso a caso.',
  },
]

export default function Delivery() {
  usePageTitle('Encomendas, entregas e pagamentos')
  return (
    <section className="wrap pt-[clamp(36px,5vw,72px)] pb-[clamp(64px,8vw,112px)]">
      <h1 className="display max-w-[18ch] text-[clamp(2.5rem,1.6rem+3.4vw,4rem)] leading-[1.02] text-balance">
        Encomendas, entregas e pagamentos
      </h1>
      <p className="mt-5 max-w-[56ch] text-lead text-muted">
        Não há pagamento no site nem conta para criar. Escolhe, junta ao pedido e envia-nos a lista; o resto é
        combinado consigo, pessoa a pessoa.
      </p>

      <div className="mt-[clamp(40px,5vw,72px)]">
        <OrderSteps />
      </div>
      <Link to={shopUrl()} className="btn btn-dark mt-10">
        Ver relógios
      </Link>

      <h2 className="display mt-[clamp(64px,8vw,112px)] text-headline">Perguntas frequentes</h2>
      <dl className="mt-[clamp(20px,3vw,36px)] border-t border-line">
        {TOPICS.map((t) => (
          <div key={t.title} className="grid gap-x-10 gap-y-2 border-b border-line py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <dt className="display text-[1.625rem] leading-[1.15]">{t.title}</dt>
            <dd className="max-w-[62ch] text-muted">{t.text}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-[clamp(40px,5vw,64px)] flex flex-col items-start gap-4 bg-mist p-[clamp(24px,4vw,48px)]">
        <h2 className="display text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)]">Tem alguma dúvida?</h2>
        <p className="max-w-[52ch] text-muted">Respondemos diretamente pelo WhatsApp, {whatsappDisplay}.</p>
        <a href={whatsappUrl(GENERAL_MESSAGE)} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
          <WhatsAppIcon size={18} />
          Falar no WhatsApp
        </a>
      </div>
    </section>
  )
}
