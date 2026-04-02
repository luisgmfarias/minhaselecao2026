import type { Metadata } from "next";
import Link from "next/link";
import { Users, Trophy, Share2, Smartphone, ArrowRight, CheckCircle } from "lucide-react";
import { SITE_URL, SITE_DESCRIPTION } from "@/data/config";
import { JsonLd, faqJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: `Monte sua Convocação do Brasil — Copa do Mundo 2026`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
};

const HOME_FAQS = [
  {
    question: "Como montar minha convocação do Brasil para a Copa 2026?",
    answer:
      "Acesse a página de Convocação, filtre os jogadores por posição, busque pelo nome e clique para selecioná-los. Você deve escolher exatamente 26 jogadores.",
  },
  {
    question: "Posso compartilhar minha seleção com amigos?",
    answer:
      "Sim! Após montar sua convocação com 26 jogadores, um botão de compartilhamento aparecerá. Você pode enviar via WhatsApp, Facebook ou copiar o link direto.",
  },
  {
    question: "O simulador de jogos é gratuito?",
    answer:
      "Completamente gratuito, sem cadastro e sem anúncios intrusivos. Funciona no navegador, inclusive no celular.",
  },
  {
    question: "Os dados dos jogadores são oficiais?",
    answer:
      "Os jogadores listados são baseados em especulações e análises da imprensa esportiva brasileira sobre possíveis convocados para a Copa 2026. Não representam a lista oficial da CBF.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(HOME_FAQS)} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-4 py-20 sm:py-28">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-10 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute right-1/4 top-1/3 h-2 w-2 rounded-full bg-yellow-300/60" />
          <div className="absolute left-1/3 bottom-1/3 h-3 w-3 rounded-full bg-yellow-300/40" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-green-100">
            <span>🏆</span> Copa do Mundo 2026 — EUA, Canadá e México
          </div>

          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Monte sua{" "}
            <span className="text-yellow-300">Convocação</span>
            <br />
            do Brasil
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-green-100">
            Escolha os 26 jogadores que você levaria para a Copa do Mundo 2026, simule
            os jogos e compartilhe com seus amigos no WhatsApp e Facebook.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/convocacao"
              className="flex items-center gap-2 rounded-xl bg-yellow-400 px-6 py-3.5 text-base font-bold text-neutral-900 shadow-lg hover:bg-yellow-300 transition-colors"
            >
              <Users className="h-5 w-5" />
              Montar minha seleção
            </Link>
            <Link
              href="/simulador"
              className="flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <Trophy className="h-5 w-5" />
              Simular jogos
            </Link>
          </div>

          <p className="mt-6 text-sm text-green-200">
            Grátis · Sem cadastro · Funciona no celular
          </p>
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 px-4 py-16 dark:bg-neutral-950 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Tudo que você precisa para a Copa 2026
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Users className="h-6 w-6 text-green-600" />,
                title: "Monte sua Convocação",
                desc: "Escolha os 26 jogadores que você levaria para a Copa com filtros por posição.",
                href: "/convocacao",
                cta: "Montar agora",
              },
              {
                icon: <Trophy className="h-6 w-6 text-yellow-500" />,
                title: "Simule os Jogos",
                desc: "Preveja o resultado de cada partida do Brasil. Modo simples ou com placar exato.",
                href: "/simulador",
                cta: "Simular jogos",
              },
              {
                icon: <Share2 className="h-6 w-6 text-blue-500" />,
                title: "Compartilhe Facilmente",
                desc: "Envie sua seleção e resultados pelo WhatsApp, Facebook ou qualquer app.",
                href: "/convocacao",
                cta: "Começar",
              },
              {
                icon: <Smartphone className="h-6 w-6 text-purple-500" />,
                title: "Feito para o Celular",
                desc: "Interface otimizada para mobile. Botões grandes, rápido e fácil de usar.",
                href: "/convocacao",
                cta: "Abrir no celular",
              },
            ].map((f) => (
              <article
                key={f.title}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-bold text-neutral-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {f.desc}
                </p>
                <Link
                  href={f.href}
                  className="mt-4 flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-400"
                >
                  {f.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-3 text-center text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Como funciona
          </h2>
          <p className="mb-10 text-center text-neutral-500 dark:text-neutral-400">
            Em três passos você monta e compartilha sua convocação ideal
          </p>
          <ol className="space-y-6">
            {[
              {
                step: "1",
                title: "Escolha seus 26 jogadores",
                desc: "Navegue pela lista de jogadores especulados para a Copa 2026, filtre por posição e monte sua convocação ideal do Brasil. Respeitamos os limites por posição assim como o técnico.",
              },
              {
                step: "2",
                title: "Simule os jogos",
                desc: "Com sua seleção montada, acesse o simulador e preveja os resultados de todos os jogos do Brasil — da fase de grupos até a final.",
              },
              {
                step: "3",
                title: "Compartilhe com amigos",
                desc: "Um link único codifica toda sua seleção e simulação. Envie pelo WhatsApp, Facebook ou qualquer app de mensagens. Quem abrir verá exatamente sua escolha.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-lg font-black text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <Link
              href="/convocacao"
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About the Copa ───────────────────────────────────────────────── */}
      <section className="bg-neutral-50 px-4 py-16 dark:bg-neutral-950 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Copa do Mundo 2026 — O Brasil na busca pelo hexa
          </h2>
          <div className="prose prose-sm max-w-none text-neutral-600 dark:prose-invert dark:text-neutral-400">
            <p>
              A <strong>Copa do Mundo FIFA 2026</strong> será realizada entre{" "}
              <strong>junho e julho de 2026</strong> nos Estados Unidos, Canadá e
              México. Será o primeiro Mundial com <strong>48 seleções</strong>{" "}
              participantes, distribuídas em 12 grupos de 4 equipes.
            </p>
            <p className="mt-4">
              O <strong>Brasil</strong>, pentacampeão mundial, chega à Copa 2026 com
              uma geração talentosa liderada por nomes como{" "}
              <strong>Vinícius Jr., Rodrygo, Raphinha e Endrick</strong>. A
              expectativa da torcida brasileira é enorme pelo tão sonhado hexacampeonato.
            </p>
            <p className="mt-4">
              Use o <strong>Minha Seleção 2026</strong> para montar sua convocação ideal,
              debater com amigos e acompanhar a jornada do Brasil rumo ao título.
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            {[
              "48 seleções participantes (novidade em 2026)",
              "Sede: EUA, Canadá e México",
              "12 grupos de 4 equipes na fase inicial",
              "Brasil busca o hexacampeonato inédito",
              "Geração com Vini Jr., Endrick e novos talentos",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FAQ preview ──────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-black text-neutral-900 dark:text-white">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {HOME_FAQS.slice(0, 3).map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold text-neutral-900 dark:text-white">
                  {faq.question}
                  <span className="ml-3 text-neutral-400 transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/faq"
              className="text-sm font-semibold text-green-600 hover:underline dark:text-green-400"
            >
              Ver todas as perguntas frequentes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA bottom ───────────────────────────────────────────────────── */}
      <section className="bg-green-600 px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-white sm:text-3xl">
          Pronto para montar sua seleção? 🇧🇷
        </h2>
        <p className="mx-auto mt-3 max-w-md text-green-100">
          Grátis, sem cadastro, funciona no celular. Compartilhe com a galera e
          debatam quem vai ao hexa!
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/convocacao"
            className="rounded-xl bg-yellow-400 px-6 py-3.5 font-bold text-neutral-900 hover:bg-yellow-300 transition-colors"
          >
            Montar minha convocação
          </Link>
          <Link
            href="/simulador"
            className="rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Simular jogos
          </Link>
        </div>
      </section>
    </>
  );
}
