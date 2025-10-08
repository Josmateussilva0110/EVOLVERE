import { Award, Star } from "lucide-react";

export default function Medalhas() {
  const medalhas = [
    { titulo: "Aluno Destaque", cor: "from-yellow-400 to-orange-500" },
    { titulo: "Melhor Desempenho", cor: "from-blue-400 to-cyan-500" },
    { titulo: "Participante Ativo", cor: "from-green-400 to-emerald-500" },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Minhas Medalhas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {medalhas.map((m, i) => (
          <div key={i} className={`bg-gradient-to-br ${m.cor} text-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center`}>
            <Award size={48} className="mb-3" />
            <h3 className="text-lg font-bold">{m.titulo}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
