import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold mb-2">Retiro BTC — Agentes IA</h1>
      <p className="text-zinc-400 text-sm mb-6 text-center max-w-md">
        Servicio Vertical 1: Rito (chat), captura de leads y monitor legal DOF.
      </p>
      <ul className="text-sm space-y-2 text-orange-400">
        <li>
          <Link href="/admin/alerts">Admin — alertas legales</Link>
        </li>
        <li>
          <a href="/widget/rito.js">Widget Rito (embed)</a>
        </li>
      </ul>
    </main>
  );
}
