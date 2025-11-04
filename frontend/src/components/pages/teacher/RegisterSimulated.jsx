import { useState, useRef, useEffect, useContext } from "react";
import { Plus, X, Trash2, Check, FileText } from "lucide-react";
import { Context } from "../../../context/UserContext"
import requestData from "../../../utils/requestApi"
import { useNavigate } from "react-router-dom"
import useFlashMessage from "../../../hooks/useFlashMessage"
import DateTimePicker from "../../form/DatePicker";
import { useParams } from "react-router-dom";

/**
 * AutoResizeTextarea
 *
 * Textarea controlado que ajusta sua altura automaticamente ao conteúdo.
 * Mantém a API de um elemento <textarea> padrão — recebe todas as props e as repassa.
 *
 * Comportamento:
 * - Ao montar e sempre que `props.value` mudar, recalcula `scrollHeight` e define a altura
 *   do elemento para que o conteúdo não gere barra de rolagem interna.
 *
 * Props:
 * @param {object} props - Props padrão de um textarea (value, onChange, placeholder, className, rows, etc.)
 * @returns {JSX.Element} Elemento textarea com auto-resize aplicado via style.height.
 */
const AutoResizeTextarea = (props) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]);
  return <textarea ref={textareaRef} {...props} />;
};

/**
 * tiposPergunta
 *
 * Lista estática de tipos de pergunta disponíveis ao criar um simulado.
 * Cada item contém:
 * - value: identificador interno (ex.: "alternativa", "vf", "discursiva")
 * - label: texto exibido na UI
 *
 * Uso:
 * - Renderizado como botões para alternar o tipo da questão.
 */
const questionTypes = [
  { value: "multipla_escolha", label: "Multipla escolha" },
  { value: "verdadeiro/falso", label: "Verdadeiro/Falso" },
  { value: "aberta", label: "Aberta" },
];
/**
 * CreateQuiz
 *
 * Componente principal para criação de um simulado/prova.
 *
 * Funcionalidades principais:
 * - Cadastro de título e descrição do simulado.
 * - Inserção dinâmica de questões com tipos: Múltipla Escolha, Verdadeiro/Falso e Discursiva.
 * - Em perguntas de múltipla escolha, gerencia opções e marcação de alternativa correta (single-choice).
 * - Em perguntas VF, fornece duas opções pré-definidas (Verdadeiro / Falso) e permite selecionar a correta.
 * - Em perguntas discursivas, exibe bloco informativo indicando que o aluno responderá em texto.
 * - Auto-resize para enunciados das questões via `AutoResizeTextarea`.
 * - Simulação de envio (handleSubmit faz console.log e alert).
 *
 * Estado interno (useState):
 * - title: string — título do simulado.
 * - description: string — descrição/instruções (opcional).
 * - perguntas: Array — lista de perguntas contendo { texto, tipo, opcoes }.
 *
 * Estrutura de `perguntas`:
 * - texto: string — enunciado da questão.
 * - tipo: string — "alternativa" | "vf" | "discursiva".
 * - opcoes: Array<{ texto: string, correta: boolean }> — opções da questão.
 *
 * Observações de integração:
 * - handleSubmit atualmente simula envio; em produção, substitua por integração com API (fetch/axios), validando campos e formatando payload.
 *
 * Retorno:
 * @returns {JSX.Element} Formulário completo para criar e publicar um simulado.
 */
export default function CreateQuiz() {
  const [deadline, setDeadline] = useState("");
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(Context);
  const { class_id } = useParams()
  const [subjectId, setSubjectId] = useState(null);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([
    {
      text: "",
      type: "multipla_escolha",
      points: 0,
      options: [
        { text: "", correct: false },
        { text: "", correct: false },
      ],
    },
  ]);


  useEffect(() => {
    async function fetchRelations() {
      const response = await requestData(`/form/relations/${class_id}`, "GET", {}, true);
      if (response.success) {
        setSubjectId(response.data.subject_id);
      }
    }
    fetchRelations();
  }, [class_id]);

  /** Add a new question */
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "multipla_escolha",
        points: 0,
        options: [
          { text: "", correct: false },
          { text: "", correct: false },
        ],
      },
    ]);
  };

  /** Remove a question */
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  /** Update question field */
  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    if (field === "type") {
      if (value === "multipla_escolha") {
        updated[index].options = [
          { text: "", correct: false },
          { text: "", correct: false },
        ];
      } else if (value === "verdadeiro/falso") {
        updated[index].options = [
          { text: "True", correct: true },
          { text: "False", correct: false },
        ];
      } else {
        updated[index].options = [];
      }
    }

    setQuestions(updated);
  };

  /** Update specific option inside a question */
  const updateOption = (qIndex, optIndex, field, value) => {
    const updated = [...questions];
    const question = updated[qIndex];

    if (field === "correct") {
      if (question.type === "multipla_escolha") {
        question.options.forEach((op, i) => (op.correct = i === optIndex));
      } else {
        question.options[optIndex].correct = value;
      }
    } else {
      question.options[optIndex][field] = value;
    }

    setQuestions(updated);
  };

  /** Add new option to a multiple choice question */
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", correct: false });
    setQuestions(updated);
  };

  /** Remove specific option */
  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    setQuestions(updated);
  };

  /** Select verdadeiro/Falso option */
  const handleTrueFalseSelect = (qIndex, correctOption) => {
    const updated = [...questions];
    updated[qIndex].options = [
      { text: "Verdadeiro", correct: correctOption === "Verdadeiro" },
      { text: "Falso", correct: correctOption === "Falso" },
    ];
    setQuestions(updated);
  };


  /** Submit handler */
  async function handleSubmit(e) {
    e.preventDefault();
    const totalDuration = (parseInt(hours || 0) * 60) + parseInt(minutes || 0)

    const data = {
      title,
      description,
      class_id: class_id,
      subject_id: subjectId,
      created_by: user.id,
      questions,
      deadline,
      totalDuration
    };

    const response = await requestData("/form/publish", "POST", data, true);
    if (response.success) {
      setFlashMessage(response.data.message, "success");
      navigate(`/teacher/class/view/${class_id}`)
    } else {
      setFlashMessage(response.message, "error");
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information */}
          <div className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Informações Gerais</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-semibold text-slate-200 mb-2">Titulo *</label>
                <input
                  type="text"
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-white placeholder:text-slate-400"
                  placeholder="Ex: Algorithms Exam I"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-200 mb-2">Descrição</label>
                <textarea
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-white placeholder:text-slate-400"
                  placeholder="Instructions or topics covered..."
                  value={description}
                  rows={3}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Tempo de simulado */}
              <div>
                <label className="block font-semibold text-slate-200 mb-2">Tempo de Simulado *</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-white placeholder:text-slate-400"
                      placeholder="Horas"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                    />
                  </div>
                  <span className="text-slate-300 font-medium">:</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-white placeholder:text-slate-400"
                      placeholder="Minutos"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  Defina quanto tempo o aluno terá para concluir o simulado.
                </p>
              </div>

              <DateTimePicker deadline={deadline} setDeadline={setDeadline} />

            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white ml-2">Questões</h2>

            {questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-white/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Questão {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm text-slate-300 hover:text-red-400 font-semibold"
                      onClick={() => removeQuestion(qIndex)}
                    >
                      <Trash2 className="w-4 h-4 text-blue-400" /> Remove
                    </button>
                  )}
                </div>

                <AutoResizeTextarea
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-400 outline-none transition text-lg text-white placeholder:text-slate-400"
                  placeholder="Type the question here..."
                  value={question.text}
                  onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                  required
                  rows={2}
                />

                <div className="mt-4 flex items-center gap-3">
                  <label className="font-semibold text-slate-200">Pontos:</label>
                  <input
                    type="number"
                    min="0.0"
                    step="0.1"
                    className="w-24 bg-transparent border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none text-white"
                    value={question.points}
                    onChange={(e) => updateQuestion(qIndex, "points", parseFloat(e.target.value))}
                    placeholder="ex: 0.5"
                  />
                </div>


                {/* Type Selector */}
                <div className="mt-6">
                  <label className="block font-semibold text-slate-200 mb-3">Tipo de Questão *</label>
                  <div className="flex gap-2 flex-wrap">
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateQuestion(qIndex, "type", type.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          question.type === type.value
                            ? "bg-yellow-400 text-slate-900 shadow-md"
                            : "bg-white/5 text-slate-200 hover:bg-white/10"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multipla escolha */}
                {question.type === "multipla_escolha" && (
                  <div className="space-y-3 pt-4">
                    {question.options.map((op, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                          op.correct
                            ? "border-green-400 bg-green-900/20"
                            : "border-white/10 bg-white/2"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => updateOption(qIndex, i, "correct", true)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            op.correct
                              ? "bg-green-500 border-green-500"
                              : "border-white/20 hover:border-indigo-400"
                          }`}
                        >
                          {op.correct && <Check className="w-4 h-4 text-white" />}
                        </button>

                        <input
                          type="text"
                          className="flex-1 bg-transparent focus:outline-none text-white placeholder:text-slate-400"
                          placeholder={`Option ${i + 1}`}
                          value={op.text}
                          onChange={(e) => updateOption(qIndex, i, "text", e.target.value)}
                        />

                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, i)}
                            className="text-slate-300 hover:text-red-400"
                          >
                            <X className="w-4 h-4 text-blue-400" />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 font-semibold mt-3"
                    >
                      <Plus className="w-4 h-4 text-blue-400" /> Adicionar opção
                    </button>
                  </div>
                )}

                {/* verdadeiro/Falso */}
                {question.type === "verdadeiro/falso" && (
                  <div className="flex gap-4 pt-4">
                    {["Verdadeiro", "Falso"].map((label) => (

                      <button
                        key={label}
                        type="button"
                        onClick={() => handleTrueFalseSelect(qIndex, label)}
                        className={`flex-1 p-4 rounded-lg text-lg font-bold transition-all border-2 ${
                          question.options.find((o) => o.text === label)?.correct
                            ? "bg-green-500 text-white border-green-500 shadow-lg"
                            : "bg-white/5 text-white hover:bg-white/10 border-white/10"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* aberta */}
                {question.type === "aberta" && (
                  <div className="bg-white/2 p-4 rounded-lg text-center border-dashed border-2 border-white/10 mt-4">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm font-semibold text-slate-200">
                      O aluno responderá com uma resposta escrita.
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Add Question */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addQuestion}
                className="bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center gap-2 border border-yellow-300/30"
              >
                <Plus className="w-5 h-5 text-blue-700" /> Adicionar nova questão
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-slate-800/60 p-6 rounded-2xl shadow-lg border border-white/10 flex flex-col sm:flex-row gap-4 justify-end mt-10">
            <button
              type="button"
              className="px-6 py-3 rounded-lg text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 transition"
            >
              Salvar rascunho
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg text-sm font-extrabold text-slate-900 bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all hover:scale-105 shadow-lg shadow-yellow-400/30 flex items-center gap-2"
            >
              <Check className="w-5 h-5 text-blue-700" /> Publicar formulário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}