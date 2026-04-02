import type { Metadata } from "next";
import { SITE_URL } from "@/data/config";
import { SquadBuilder } from "@/components/squad/SquadBuilder";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Monte sua Convocação do Brasil — Copa 2026",
  description:
    "Escolha os 26 jogadores que você convocaria para o Brasil na Copa do Mundo 2026. Filtre por posição, busque pelo nome e monte seu time ideal.",
  alternates: { canonical: `${SITE_URL}/convocacao` },
  openGraph: {
    title: "Monte sua Convocação do Brasil — Copa 2026",
    description:
      "Escolha 26 jogadores para a Seleção Brasileira e compartilhe sua convocação.",
    url: `${SITE_URL}/convocacao`,
  },
};

export default function ConvocacaoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", url: SITE_URL },
          { name: "Convocação", url: `${SITE_URL}/convocacao` },
        ])}
      />
      <SquadBuilder />
    </>
  );
}
