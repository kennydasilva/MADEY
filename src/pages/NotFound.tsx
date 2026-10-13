import { Link } from 'react-router-dom'
import { shopUrl } from '../lib/shop'

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-5 py-[clamp(64px,10vw,140px)]">
      <h1 className="display text-[clamp(2.5rem,1.6rem+3.4vw,4rem)]">Página não encontrada</h1>
      <p className="max-w-[44ch] text-muted">O endereço pode ter mudado ou o produto já não está disponível.</p>
      <Link to={shopUrl()} className="btn btn-dark mt-2">
        Ver todos os relógios
      </Link>
    </section>
  )
}
