// Dados da loja — placeholders até termos os contactos reais.
export const config = {
  /** Número do WhatsApp só com dígitos, com indicativo do país. */
  whatsappNumber: '258840000000',
  /** Domínio público do site, sem barra final. Usado nos links enviados no WhatsApp. */
  siteUrl: 'https://madey.co.mz',
  instagramUrl: '',
  location: 'Maputo, Moçambique',
}

export const whatsappDisplay = (() => {
  const n = config.whatsappNumber
  return n.length >= 12 ? `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`
})()
