import type { Metadata } from "next";
import { SITE_URL } from "@/data/config";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Perguntas Frequentes — Copa 2026",
  description:
    "Tire suas dúvidas sobre o Minha Seleção 2026: como montar a convocação, simular jogos, compartilhar e muito mais.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

const FAQS = [
  {
    category: "Compartilhamento",
    items: [
      {
        question: "Como funciona o compartilhamento?",
        answer:
          "Ao clicar em compartilhar, geramos um link único que codifica toda sua seleção e simulação diretamente na URL (sem banco de dados). Quem abrir o link verá exatamente sua escolha.",
      },
      {
        question: "O link de compartilhamento expira?",
        answer:
          "Não. O link é autocontido e não depende de servidor, por isso nunca expira. Enquanto o site estiver no ar, o link funcionará.",
      },
      {
        question: "Posso compartilhar pelo WhatsApp?",
        answer:
          "Sim! Há um botão de WhatsApp na tela de compartilhamento. Ele abre o WhatsApp com uma mensagem pronta e o link da sua seleção.",
      },
      {
        question: "O compartilhamento pelo Facebook funciona sem backend?",
        answer:
          "O Facebook permite compartilhamento de URLs via sua API de Share Dialog. A prévia da postagem (OG tags) é gerada pelo nosso servidor Next.js. O conteúdo completo da seleção está no link.",
      },
    ],
  },
  {
    category: "Técnico e Privacidade",
    items: [
      {
        question: "Vocês armazenam meus dados?",
        answer:
          "Não. Todo o estado do aplicativo (sua convocação e resultados) é salvo apenas no localStorage do seu navegador, no seu próprio dispositivo. Nenhum dado é enviado a servidores.",
      },
      {
        question: "O site funciona offline?",
        answer:
          "O site precisa de conexão para carregar inicialmente. Após o carregamento, as funcionalidades principais (convocação e simulação) funcionam sem internet.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <JsonLd
        data={faqJsonLd(
          FAQS.flatMap((cat) => cat.items.map((i) => ({ question: i.question, answer: i.answer })))
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", url: SITE_URL },
          { name: "FAQ", url: `${SITE_URL}/faq` },
        ])}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <nav className="mb-4 text-sm text-neutral-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-green-600">Início</Link>
            <span className="mx-2">›</span>
            <span className="text-neutral-900 dark:text-white">FAQ</span>
          </nav>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
            Perguntas Frequentes
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            Respostas para as dúvidas mais comuns sobre o Minha Seleção 2026.
          </p>
        </div>

        {/* FAQ categories */}
        <div className="space-y-10">
          {FAQS.map((cat) => (
            <section key={cat.category}>
              <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.items.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-semibold text-neutral-900 dark:text-white">
                      {faq.question}
                      <span className="mt-0.5 shrink-0 text-neutral-400 transition-transform group-open:rotate-180">
                        ▾
                      </span>
                    </summary>
                    <p className="border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-green-50 p-6 dark:bg-green-900/10">
          <h2 className="font-bold text-neutral-900 dark:text-white">
            Pronto para montar sua seleção?
          </h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            Agora que você já sabe como funciona, é hora de convocar seus 26!
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/convocacao"
              className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
            >
              Montar convocação <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-1.5 rounded-xl border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 dark:text-green-400 transition-colors"
            >
              Simular jogos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
