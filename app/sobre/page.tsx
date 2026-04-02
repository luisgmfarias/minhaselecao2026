import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/data/config";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Trophy, Users, Share2, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre o Projeto — Minha Seleção 2026",
  description:
    "Conheça o Minha Seleção 2026, o site para torcedores montarem sua convocação ideal do Brasil para a Copa do Mundo 2026.",
  alternates: { canonical: `${SITE_URL}/sobre` },
};

export default function SobrePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", url: SITE_URL },
          { name: "Sobre", url: `${SITE_URL}/sobre` },
        ])}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav className="mb-4 text-sm text-neutral-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-green-600">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-neutral-900 dark:text-white">Sobre</span>
        </nav>

        <h1 className="mb-4 text-3xl font-black text-neutral-900 dark:text-white">
          Sobre o Minha Seleção 2026
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          O <strong className="text-neutral-900 dark:text-white">Minha Seleção 2026</strong> é um
          projeto independente criado para torcedores brasileiros que querem entrar no espírito da
          Copa do Mundo 2026 montando sua própria convocação e simulando os jogos do Brasil.
        </p>

        {/* Features */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: <Users className="h-5 w-5 text-green-600" />,
              title: "Construtor de Convocação",
              desc: "Monte seu time com 26 jogadores respeitando os limites por posição, igual à FIFA.",
            },
            {
              icon: <Trophy className="h-5 w-5 text-yellow-500" />,
              title: "Simulador de Jogos",
              desc: "Simule todos os jogos do Brasil na Copa, em modo simples ou com placar exato.",
            },
            {
              icon: <Share2 className="h-5 w-5 text-blue-500" />,
              title: "Compartilhamento",
              desc: "Link único que codifica sua seleção. Compartilhe no WhatsApp ou Facebook.",
            },
            {
              icon: <Lock className="h-5 w-5 text-purple-500" />,
              title: "Privacidade primeiro",
              desc: "Sem cadastro, sem banco de dados. Tudo fica no seu dispositivo.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {f.icon}
              </div>
              <div>
                <h2 className="font-semibold text-neutral-900 dark:text-white">{f.title}</h2>
                <p className="mt-1 text-sm text-neutral-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <section className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900/40 dark:bg-yellow-900/10">
          <h2 className="mb-2 font-bold text-neutral-900 dark:text-white">
            Aviso Legal
          </h2>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            Este é um site independente e não tem nenhum vínculo oficial com a{" "}
            <strong>CBF (Confederação Brasileira de Futebol)</strong>,{" "}
            <strong>FIFA</strong> ou qualquer clube de futebol. Os dados dos jogadores
            são baseados em especulações da mídia esportiva e não representam listas
            oficiais. Este projeto é feito por e para torcedores.
          </p>
        </section>

        <div className="flex gap-3">
          <Link
            href="/convocacao"
            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Montar minha seleção
          </Link>
          <Link
            href="/faq"
            className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors"
          >
            Ver FAQ
          </Link>
        </div>
      </div>
    </>
  );
}
