import { config } from '../config'
import type { Product } from '../data/products'
import { img } from './images'

export const formatPrice = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' MT'

export const countLabel = (n: number) => `${n} ${n === 1 ? 'produto' : 'produtos'}`

export const productPath = (p: Product) => `/produto/${p.slug}`
export const productLink = (p: Product) => config.siteUrl + productPath(p)

export function buildWhatsAppMessage(p: Product, qty: number) {
  const lines = [
    `Olá, MADEY! Tenho interesse em comprar o seguinte ${p.accessory ? 'artigo' : 'relógio'}:`,
    '',
    `Produto: ${p.name} (${p.model})`,
  ]
  if (qty > 1) lines.push(`Quantidade: ${qty}`)
  lines.push(`Preço: ${formatPrice(p.price)}${qty > 1 ? ` cada · Total: ${formatPrice(p.price * qty)}` : ''}`)
  lines.push(`Referência: ${p.ref}`)
  const image = img(p.image)
  if (image) lines.push(`Imagem: ${config.siteUrl}${image}`)
  lines.push(`Link: ${productLink(p)}`, '', 'Podem confirmar a disponibilidade e dar-me mais informações?')
  return lines.join('\n')
}

export const GENERAL_MESSAGE = 'Olá, MADEY! Gostaria de mais informações sobre os vossos relógios e acessórios.'

export const whatsappUrl = (text: string) => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`
