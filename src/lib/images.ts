// Todas as fotografias vivem em /imagens na raiz do projeto. Para trocar uma
// imagem basta substituir o ficheiro mantendo o nome (ex.: imagens/hero.jpg).
// O build gera versões WebP em vários tamanhos; o original fica como recurso.

const originals = import.meta.glob<string>('../../imagens/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Larguras pensadas para os cartões (≈300px), a página de produto e ecrãs de alta densidade.
const responsive = import.meta.glob<string>('../../imagens/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: { w: '400;800;1024', format: 'webp', as: 'srcset', withoutEnlargement: '' },
  import: 'default',
})

// Só as fotografias de largura total precisam de uma versão maior.
const wide = import.meta.glob<string>('../../imagens/{hero,promo}.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: { w: '1600', format: 'webp', withoutEnlargement: '' },
  import: 'default',
})

const nameOf = (path: string) => path.split('/').pop()!.replace(/\.[^.]+$/, '')
const index = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, value]) => [nameOf(path), value]))

const urlByName = index(originals)
const srcsetByName = index(responsive)
const wideByName = index(wide)

/** URL da imagem original com esse nome (sem extensão); string vazia se ainda não existir. */
export const img = (name: string) => urlByName[name] ?? ''

/** `srcset` WebP da imagem, para o browser escolher o tamanho certo para o ecrã. */
export const srcset = (name: string) =>
  [srcsetByName[name], wideByName[name] && `${wideByName[name]} 1600w`].filter(Boolean).join(', ')

