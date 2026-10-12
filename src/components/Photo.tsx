import type { ImgHTMLAttributes } from 'react'
import { img, srcset } from '../lib/images'

interface PhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Nome do ficheiro em imagens/, sem extensão. */
  name: string
  /** Largura ocupada no ecrã (atributo `sizes`), para o browser escolher a versão certa. */
  sizes: string
  alt: string
}

/** Fotografia de imagens/ servida em WebP no tamanho adequado, com o original como recurso. */
export function Photo({ name, sizes, alt, loading = 'lazy', ...rest }: PhotoProps) {
  return <img src={img(name)} srcSet={srcset(name)} sizes={sizes} alt={alt} loading={loading} decoding="async" {...rest} />
}
