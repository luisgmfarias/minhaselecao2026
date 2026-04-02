import type { Metadata } from "next";
import { SITE_URL } from "@/data/config";
import { SimulatorSection } from "@/components/simulator/SimulatorSection";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Simulador de Jogos do Brasil — Copa 2026",
  description:
    "Simule todos os jogos do Brasil na Copa do Mundo 2026. Preveja os resultados da fase de grupos até a final e veja a campanha do Brasil.",
  alternates: { canonical: `${SITE_URL}/simulador` },
  openGraph: {
    title: "Simulador de Jogos do Brasil — Copa 2026",
    description:
      "Simule os jogos do Brasil e veja se chegamos ao hexacampeonato.",
    url: `${SITE_URL}/simulador`,
  },
};

export default function SimuladorPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", url: SITE_URL },
          { name: "Simulador", url: `${SITE_URL}/simulador` },
        ])}
      />
      <SimulatorSection />
    </>
  );
}
