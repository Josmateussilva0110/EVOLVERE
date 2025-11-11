import { useEffect, useState } from "react";
import { FileText, Hourglass, Home, ClipboardList } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import requestData from "../../../utils/requestApi";
import formatDateRequests from "../../../utils/formatDateRequests";

export default function SimulatedPendingCorrection() {
    const { form_id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        async function fetchData() {
            const response = await requestData(`/form/view/${form_id}`, 'GET', {}, true);
            console.log(response)
            if (response && response.success) {
                setFormData(response.data.form[0]);
            }
            setLoading(false);
        }
        fetchData();
    }, [form_id])

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-cyan-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-3xl shadow-xl flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Aguarde, carregando informações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-blue-50 to-cyan-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate("/student/home")}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Voltar ao Dashboard</span>
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-10">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 text-center animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <Hourglass className="w-16 h-16 text-yellow-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                        Aguardando Correção do Professor 🕒
                    </h1>
                    <p className="text-gray-600 mb-6">
                        O seu simulado <span className="font-semibold">{formData.title || "Sem título"}</span> contém questões abertas.
                        <br />
                        Assim que o professor corrigir suas respostas, você poderá visualizar o resultado completo.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-left mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-yellow-600" />
                            <h2 className="text-lg font-semibold text-yellow-700">Detalhes do Simulado</h2>
                        </div>
                        <p className="text-gray-700">
                            <strong>Nome:</strong> {formData.title}<br/>
                            <strong>Data de envio:</strong> {formatDateRequests(formData.send_response)} <br/>
                            <strong>Status:</strong> <span className="text-yellow-600 font-semibold">Aguardando correção</span>
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate("/student/home")}
                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-colors"
                        >
                            <ClipboardList className="w-5 h-5" />
                            Voltar para o Dashboard
                        </button>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.4s ease-out; }
            `}</style>
        </div>
    );
}
