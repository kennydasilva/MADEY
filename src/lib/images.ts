// Todas as fotografias vivem em /imagens na raiz do projeto. Para trocar uma
// imagem basta substituir o ficheiro mantendo o nome (ex.: imagens/hero.jpg).
const files = import.meta.glob<string>('../../imagens/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byName: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  byName[name] = url
}

/** URL da imagem com esse nome (sem extensão); string vazia se ainda não existir. */
export const img = (name: string) => byName[name] ?? ''
