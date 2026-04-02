# Minha Seleção 2026 🇧🇷

Monte sua convocação do Brasil para a Copa do Mundo 2026, escale seus titulares, simule os jogos e compartilhe com amigos.

**Autor:** [Luis Medeiros](https://github.com/luisgmfarias) · luisgmfarias@gmail.com

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Para build de produção:

```bash
npm run build
npm start
```

## Como atualizar jogadores

Edite o arquivo `data/players.ts`. Cada jogador segue a interface `Player`:

```ts
{
  id: "vinicius-jr",          // slug único
  name: "Vinícius Jr.",
  position: "Atacantes",      // ver PositionGroup em types/index.ts
  club: "Real Madrid",
  countryClub: "Espanha",
  age: 24,
  caps: 51,
  isSpeculated: false,
  tags: ["titular"],           // opcional: "titular", "capitão", "jovem"
}
```

Posições válidas: `Goleiros`, `Zagueiros`, `Laterais Direitos`, `Laterais Esquerdos`, `Meio-Campistas`, `Atacantes`.

## Como atualizar partidas

Edite `data/matches.ts`. Cada partida segue a interface `Match`:

```ts
{
  id: "group-e-1",
  homeTeam: "Brasil",
  awayTeam: "Sérvia",
  homeFlag: "🇧🇷",
  awayFlag: "🇷🇸",
  phase: "Fase de Grupos",
  group: "E",
  kickoff: "2026-06-11T19:00:00-05:00",
  stadium: "MetLife Stadium",
  city: "Nova Jersey",
  country: "EUA",
  isBrazilMatch: true,
}
```

## Como funciona a escalação

Na página de convocação, após selecionar 26 jogadores, o botão **"Escalar minha seleção"** abre um modal com campo visualizado em pitch portrait. Funcionalidades:

- **8 formações disponíveis:** 4-4-2, 4-3-3, 4-2-3-1, 4-1-4-1, 3-5-2, 3-4-3, 5-3-2, 5-4-1
- **Auto-preenchimento:** distribui jogadores pelas posições automaticamente com base na posição e tag `titular`
- **Troca de jogadores:** toque num slot para ver e selecionar qualquer jogador da convocação
- **Banco de reservas:** jogadores não escalados aparecem na faixa abaixo do campo
- **Escalação incluída no link de compartilhamento:** formação e posições são codificadas na URL

As definições de formação ficam em `data/formations.ts`. O estado é gerenciado pelo `lineupStore` (Zustand + persist).

## Como funciona o compartilhamento

O estado (convocação + resultados) é serializado em JSON, comprimido com **LZ-String** e codificado em Base64 URL-safe. Esse valor é adicionado como query param `?s=...` na URL `/compartilhar`.

- Nenhum dado é salvo em servidor
- O link é auto-contido e não expira
- WhatsApp: usa o esquema `wa.me/?text=...`
- Facebook: usa `facebook.com/sharer/sharer.php?u=...`
- Web Share API: nativo em mobile quando disponível
- Fallback: cópia para área de transferência

## Considerações de SEO

- Cada página tem `metadata` própria (title, description, OG, Twitter)
- `app/robots.ts` gera `/robots.txt` — a rota `/compartilhar` é bloqueada para crawlers (conteúdo dinâmico via URL)
- `app/sitemap.ts` gera `/sitemap.xml` com todas as rotas estáticas
- JSON-LD estruturado: `WebSite`, `FAQPage`, `BreadcrumbList`
- `public/manifest.json` para PWA básico (instalável em mobile)
- Todas as páginas são pré-renderizadas estaticamente (SSG)

## Configurações

`data/config.ts` controla:

```ts
export const SQUAD_TOTAL = 26;               // total de jogadores
export const POSITION_LIMITS = {
  Goleiros: 3,                               // máx. goleiros
  Zagueiros: 8,
  ...
};
```

Para alterar o limite de goleiros, edite `POSITION_LIMITS.Goleiros`.

## Deploy na Vercel

1. Suba o código para um repositório GitHub
2. Acesse vercel.com/new e importe o repositório
3. Configure a variável de ambiente:
   - `NEXT_PUBLIC_SITE_URL` = `https://seu-dominio.com.br`
4. Adicione `public/og-image.png` (1200×630 px) para preview social
5. Clique em **Deploy**

A Vercel detecta automaticamente Next.js e configura tudo. O app é 100% estático — sem servidor, sem banco de dados.

Veja `.env.example` para as variáveis de ambiente necessárias.

## Estrutura do projeto

```
├── app/                    # App Router Next.js
│   ├── convocacao/         # Construtor de convocação
│   ├── simulador/          # Simulador de partidas
│   ├── compartilhar/       # Página de share reconstituído
│   ├── faq/                # FAQ com JSON-LD
│   ├── sobre/              # Sobre o projeto
│   ├── politica-de-privacidade/
│   ├── layout.tsx          # Layout raiz + metadata global
│   ├── robots.ts           # Gera robots.txt
│   └── sitemap.ts          # Gera sitemap.xml
├── components/
│   ├── ui/                 # Badge, Button, Card, Modal, Toast, ProgressBar
│   ├── layout/             # Header, Footer
│   ├── squad/              # PlayerCard, PlayerFilters, SquadBuilder, SquadSummaryPanel
│   ├── simulator/          # MatchCard, CampaignSummary, SimulatorSection
│   └── seo/                # JsonLd helpers
├── data/
│   ├── players.ts          # Lista de jogadores (com URLs de imagem)
│   ├── matches.ts          # Partidas do Brasil
│   ├── formations.ts       # Definições de formações táticas
│   └── config.ts           # Constantes configuráveis
├── lib/
│   ├── store/              # Zustand (squadStore, simulatorStore, lineupStore)
│   ├── utils/              # cn, squadValidation, urlState, shareUtils, simulationUtils, bracketUtils
│   └── hooks/              # useShare
└── types/index.ts          # Interfaces TypeScript
```

## Licença

Projeto independente, sem vínculo com CBF ou FIFA. Feito para torcedores brasileiros.

---

Desenvolvido por [Luis Medeiros](https://github.com/luisgmfarias) · luisgmfarias@gmail.com
