# MADEY

Website da MADEY — catálogo de relógios e acessórios. Tocar num relógio abre o WhatsApp com a mensagem desse relógio já escrita.

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
| Passos de "Como encomendar" | `src/components/OrderSteps.tsx` |
| Texto da mensagem do WhatsApp | `src/lib/format.ts` |

Sem carrinho, servidor nem conta.
Contexto do produto para trabalho de design: `PRODUCT.md`.

### Imagens

Todas as fotografias são lidas da pasta `imagens/`. Para trocar uma imagem,
substitua o ficheiro mantendo o nome (`hero.jpg`, `promo.jpg`, `p-boss.jpg`…).
Cada produto aponta para o seu ficheiro no campo `image` do catálogo.
O build converte-as para WebP em vários tamanhos, por isso pode usar originais
grandes (pelo menos 1024 px de largura; 1600 px ou mais para `hero` e `promo`).

Para dar mais fotografias a um produto, adicione ficheiros com os sufixos
`-2` e `-3` (ex.: `p-boss-2.jpg`); a galeria da página de produto mostra-as
automaticamente.

## Publicação

Pensado para a Vercel (`vercel.json` já trata das rotas). O `npm run build`
gera também, em `dist/`:

- um HTML por página pública (`/loja`, `/produto/<slug>`…) com título,
  descrição, imagem e dados estruturados — é o que o WhatsApp e o Google leem;
- `sitemap.xml` e `robots.txt`.

Tudo isto usa `siteUrl` de `src/config.ts`: tem de ser o endereço real do site.

Os pedidos pelo WhatsApp são contados no Vercel Analytics (evento
`pedido_whatsapp`); é preciso ativar o Analytics no painel do projeto.
