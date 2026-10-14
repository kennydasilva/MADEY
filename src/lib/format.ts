import { config } from '../config'
import { isSoldOut, type Product } from '../data/products'
import { img } from './images'

export const formatPrice = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' MT'

export const countLabel = (n: number) => `${n} ${n === 1 ? 'produto' : 'produtos'}`
export const itemsLabel = (n: number) => `${n} ${n === 1 ? 'artigo' : 'artigos'}`

export interface OrderLine {
  product: Product
  qty: number
}

export const productPath = (p: Product) => `/produto/${p.slug}`
export const productLink = (p: Product) => config.siteUrl + productPath(p)

/** Título da janela de envio, o único sítio onde o WhatsApp é nomeado antes de abrir. */
export const requestLabel = (p: Product) => (isSoldOut(p) ? 'Pedir aviso pelo WhatsApp' : 'Enviar pedido pelo WhatsApp')

export function buildWhatsAppMessage(p: Product, qty: number) {
  if (isSoldOut(p)) {
    return [
      'Olá, MADEY! Gostaria de ser avisado quando este artigo voltar a estar disponível:',
      '',
      `Produto: ${p.name} (${p.model})`,
      `Referência: ${p.ref}`,
      `Link: ${productLink(p)}`,
    ].join('\n')
  }
  const lines = [
    `Olá, MADEY! Tenho interesse em comprar o seguinte ${p.accessory ? 'artigo' : 'relógio'}:`,
    '',
    `Produto: ${p.name} (${p.model})`,
  ]
  if (qty > 1) lines.push(`Quantidade: ${qty}`)
  lines.push(`Preço: ${formatPrice(p.price)}${qty > 1 ? ` cada · Total: ${formatPrice(p.price * qty)}` : ''}`)
  lines.push(`Referência: ${p.ref}`)
  // O build copia as fotos para /og com o nome original, sem o hash dos ficheiros do Vite.
  const ext = img(p.image).split('.').pop()
  if (ext) lines.push(`Imagem: ${config.siteUrl}/og/${p.image}.${ext}`)
  lines.push(`Link: ${productLink(p)}`, '', 'Podem confirmar a disponibilidade e dar-me mais informações?')
  return lines.join('\n')
}

/** Pedido com vários artigos: uma linha por artigo, com referência e link, e o total somado. */
export function buildOrderMessage(lines: OrderLine[]) {
  const out = ['Olá, MADEY! Gostaria de encomendar os seguintes artigos:', '']
  lines.forEach(({ product: p, qty }, i) => {
    const sum = qty > 1 ? `${qty} × ${formatPrice(p.price)} = ${formatPrice(p.price * qty)}` : formatPrice(p.price)
    out.push(`${i + 1}. ${p.name} (${p.model})${p.stock === 'order' ? ' — sob encomenda' : ''}`)
    out.push(`   Ref. ${p.ref} · ${sum}`)
    out.push(`   ${productLink(p)}`)
  })
  const total = lines.reduce((n, l) => n + l.product.price * l.qty, 0)
  out.push('', `Total estimado: ${formatPrice(total)}`, '', 'Podem confirmar a disponibilidade, o pagamento e a entrega?')
  return out.join('\n')
}

/** Um só artigo usa a mensagem detalhada; vários usam a lista com total. */
export const messageFor = (lines: OrderLine[]) =>
  lines.length === 1 ? buildWhatsAppMessage(lines[0].product, lines[0].qty) : buildOrderMessage(lines)

export const GENERAL_MESSAGE = 'Olá, MADEY! Gostaria de mais informações sobre os vossos relógios e acessórios.'

export const whatsappUrl = (text: string) => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
