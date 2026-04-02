import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/data/config";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do Minha Seleção 2026. Saiba como tratamos (ou melhor: não tratamos) seus dados.",
  alternates: { canonical: `${SITE_URL}/politica-de-privacidade` },
};

export default function PrivacidadePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", url: SITE_URL },
          { name: "Política de Privacidade", url: `${SITE_URL}/politica-de-privacidade` },
        ])}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav className="mb-4 text-sm text-neutral-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-green-600">Início</Link>
          <span className="mx-2">›</span>
          <span className="text-neutral-900 dark:text-white">Política de Privacidade</span>
        </nav>

        <h1 className="mb-2 text-3xl font-black text-neutral-900 dark:text-white">
          Política de Privacidade
        </h1>
        <p className="mb-8 text-sm text-neutral-500">
          Última atualização: abril de 2026
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-neutral-600 dark:text-neutral-400">
          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              1. Coleta de dados
            </h2>
            <p>
              O <strong className="text-neutral-800 dark:text-neutral-200">{SITE_NAME}</strong> não
              coleta, armazena nem processa dados pessoais dos usuários em servidores próprios.
            </p>
            <p className="mt-2">
              Toda a informação gerada pelo uso do site — sua convocação de jogadores e os
              resultados simulados — é armazenada exclusivamente no{" "}
              <strong className="text-neutral-800 dark:text-neutral-200">localStorage</strong> do
              seu próprio navegador, no seu dispositivo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              2. Links de compartilhamento
            </h2>
            <p>
              Ao usar a função de compartilhamento, seus dados (lista de jogadores e resultados)
              são codificados diretamente na URL gerada, por meio de compressão de texto. Nenhuma
              informação é enviada a nossos servidores no processo.
            </p>
            <p className="mt-2">
              Ao compartilhar um link pelo WhatsApp ou Facebook, você está usando os serviços dessas
              plataformas, sujeitos às suas respectivas políticas de privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              3. Cookies
            </h2>
            <p>
              O site pode usar cookies técnicos essenciais para funcionamento (como os usados pelo
              Next.js para otimização de performance). Não utilizamos cookies de rastreamento,
              publicidade ou analytics de terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              4. Serviços de terceiros
            </h2>
            <p>O site pode fazer uso dos seguintes serviços:</p>
            <ul className="mt-2 space-y-1 pl-4">
              <li>
                <strong>Vercel</strong> — Hospedagem e entrega de conteúdo (CDN). Pode coletar
                logs de acesso anônimos para fins operacionais.
              </li>
              <li>
                <strong>Google Fonts</strong> — Carregamento de fontes tipográficas via CDN do
                Google.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              5. Seus direitos
            </h2>
            <p>
              Como não coletamos dados pessoais identificáveis, não há dados para acessar,
              corrigir ou deletar em nossos sistemas. Para apagar os dados do localStorage, basta
              limpar o armazenamento do seu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              6. Alterações nesta política
            </h2>
            <p>
              Podemos atualizar esta política periodicamente. Recomendamos verificar esta página
              ocasionalmente. Alterações significativas serão sinalizadas na data de atualização
              no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              7. Contato
            </h2>
            <p>
              Dúvidas sobre privacidade? Entre em contato pelo site.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
