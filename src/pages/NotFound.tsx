import { Link } from 'react-router-dom'
import { shopUrl } from '../lib/shop'

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-5 py-[clamp(64px,10vw,140px)]">
      <span className="eyebrow text-muted">Erro 404</span>
      <h1 className="display text-[clamp(40px,5vw,64px)]">Página não encontrada</h1>
      <p className="max-w-[44ch] text-muted">O endereço pode ter mudado ou o produto já não está disponível.</p>
      <Link to={shopUrl()} className="btn btn-dark mt-2">
        Ver todos os relógios
      </Link>
    </section>
  )
}
