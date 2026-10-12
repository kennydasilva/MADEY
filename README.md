# MADEY

Website da MADEY — catálogo de relógios e acessórios com pedidos pelo WhatsApp.

Vite + React + TypeScript + Tailwind CSS.

## Desenvolvimento

```bash
npm install
npm run dev      # servidor local
npm run build    # verificação de tipos + build para dist/
npm run preview  # servir o build
```

## Onde mexer

| O quê | Onde |
| --- | --- |
| Número do WhatsApp, domínio, Instagram | `src/config.ts` |
| Produtos, categorias, intervalos de preço | `src/data/products.ts` |
| Fotografias | `imagens/` |
| Cores e tipografia | `src/index.css` (bloco `@theme`) |

### Imagens

Todas as fotografias são lidas da pasta `imagens/`. Para trocar uma imagem,
substitua o ficheiro mantendo o nome (`hero.jpg`, `promo.jpg`, `p-boss.jpg`…).
Cada produto aponta para o seu ficheiro no campo `image` do catálogo.

Para dar mais fotografias a um produto, adicione ficheiros com os sufixos
`-2` e `-3` (ex.: `p-boss-2.jpg`); a galeria da página de produto mostra-as
automaticamente.

## Publicação

É uma SPA: o alojamento tem de devolver `index.html` para qualquer caminho
(`/loja`, `/produto/...`), senão os links partilhados no WhatsApp dão 404.
