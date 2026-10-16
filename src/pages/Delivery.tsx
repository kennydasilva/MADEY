import { Link } from 'react-router-dom'
import { config, whatsappDisplay } from '../config'
import { shopUrl } from '../lib/shop'
import { usePageTitle } from '../lib/title'

// Condições comerciais ainda por fechar: cada ponto diz que é combinado com o cliente,
// sem prometer prazos ou valores que a loja não confirmou.
const TOPICS = [
  {
    title: 'Entregas',
    text: 'Fazemos entregas para todo o Moçambique. O prazo e o custo de entrega para a sua zona são confirmados consigo antes de fechar a encomenda.',
  },
  {
    title: 'Pagamento',
    text: 'As formas de pagamento disponíveis são combinadas consigo depois de confirmarmos a disponibilidade do artigo.',
  },
  {
    title: 'Sob encomenda',
    text: 'Os artigos marcados “Sob encomenda” não estão em stock imediato. Pode solicitá-los na mesma; indicamos o prazo previsto antes de avançar.',
  },
  {
    title: 'Esgotados',
    text: 'Num artigo esgotado, toque em “Avisar-me” e dizemos-lhe quando voltar a estar disponível.',
  },
  {
    title: 'Trocas e devoluções',
    text: 'Se houver algum problema com a sua encomenda, fale connosco. As condições de troca ou devolução são confirmadas caso a caso.',
  },
]

export default function Delivery() {
  usePageTitle('Entregas e pagamentos')
  return (
    <section className="wrap pt-[clamp(36px,5vw,72px)] pb-[clamp(64px,8vw,112px)]">
      <h1 className="display max-w-[18ch] text-[clamp(2.125rem,1.4rem+2.9vw,3.375rem)] leading-[1.08] text-balance">
        Entregas e pagamentos
      </h1>
      <p className="mt-5 max-w-[48ch] text-lead text-muted">
        Sem pagamento no site e sem conta para criar. Toque no relógio que quer e combinamos o resto consigo.
      </p>

      <dl className="mt-[clamp(40px,5vw,72px)] border-t border-line">
        {TOPICS.map((t) => (
          <div key={t.title} className="grid gap-x-10 gap-y-2 border-b border-line py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <dt className="display text-[1.625rem] leading-[1.15]">{t.title}</dt>
            <dd className="max-w-[62ch] text-muted">{t.text}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-center justify-between gap-6">
        <p className="text-muted">
          Contacto:{' '}
          <a href={`tel:+${config.whatsappNumber}`} className="font-semibold text-gold underline underline-offset-4">
            {whatsappDisplay}
          </a>
        </p>
        <Link to={shopUrl()} className="btn btn-dark">
          Ver relógios
        </Link>
      </div>
    </section>
  )
}
