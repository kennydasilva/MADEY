// Dados da loja — placeholders até termos os contactos reais.
export const config = {
  /** Número do WhatsApp só com dígitos, com indicativo do país. */
  whatsappNumber: '258840000000',
  /**
   * Endereço público do site, sem barra final. Vai nos links enviados no WhatsApp,
   * nas meta tags e no sitemap — tem de ser o endereço onde o site está mesmo publicado.
   */
  siteUrl: 'https://madey.vercel.app',
  instagramUrl: '',
  location: 'Maputo, Moçambique',
}

export const whatsappDisplay = (() => {
  const n = config.whatsappNumber
  return n.length >= 12 ? `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`
})()
