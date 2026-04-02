import Link from "next/link";
import { Trophy } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span>
                <span className="text-green-600">Minha</span> Seleção{" "}
                <span className="text-yellow-500">2026</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Monte sua convocação do Brasil para a Copa do Mundo 2026 e compartilhe com amigos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
              Ferramentas
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><Link href="/convocacao" className="hover:text-green-600">Montar Convocação</Link></li>
              <li><Link href="/simulador" className="hover:text-green-600">Simulador de Jogos</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
              Informações
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li><Link href="/sobre" className="hover:text-green-600">Sobre o Projeto</Link></li>
              <li><Link href="/faq" className="hover:text-green-600">Perguntas Frequentes</Link></li>
              <li><Link href="/politica-de-privacidade" className="hover:text-green-600">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
          <p>
            © {year} Minha Seleção 2026. Site não oficial, sem vínculo com a CBF ou FIFA.
          </p>
          <p className="mt-1">
            Feito com ❤️ para os torcedores do Brasil por{" "}
            <a
              href="https://github.com/luisgmfarias"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 underline underline-offset-2"
            >
              Luis Medeiros
            </a>
            {" "}·{" "}
            <a
              href="mailto:luisgmfarias@gmail.com"
              className="hover:text-green-600 underline underline-offset-2"
            >
              luisgmfarias@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
