import { useState, useRef, useEffect, useContext } from "react";
import { Plus, X, Trash2, Check, FileText, ArrowLeft } from "lucide-react";
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
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useContext(Context);
  const { class_id } = useParams();
  const [subjectId, setSubjectId] = useState(null);
  const { setFlashMessage } = useFlashMessage();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

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
      const response = await requestData(
        `/form/relations/${class_id}`,
        "GET",
        {},
        true
      );
      if (response.success) {
        setSubjectId(response.data.subject_id);
      }
    }
    fetchRelations();
  }, [class_id]);

  /** Add question */
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

  /** Remove question */
  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  /** Update question */
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
          { text: "Verdadeiro", correct: true },
          { text: "Falso", correct: false },
        ];
      } else {
        updated[index].options = [];
      }
    }

    setQuestions(updated);
  };

  /** Update option */
  const updateOption = (qIndex, optIndex, field, value) => {
    const updated = [...questions];
    const question = updated[qIndex];

    if (field === "correct") {
      question.options.forEach((op, i) => (op.correct = i === optIndex));
    } else {
      question.options[optIndex][field] = value;
    }

    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "", correct: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options = updated[qIndex].options.filter(
      (_, i) => i !== optIndex
    );
    setQuestions(updated);
  };

  const handleTrueFalseSelect = (qIndex, correctOption) => {
    const updated = [...questions];
    updated[qIndex].options = [
      { text: "Verdadeiro", correct: correctOption === "Verdadeiro" },
      { text: "Falso", correct: correctOption === "Falso" },
    ];
    setQuestions(updated);
  };

  // -----------------------------
  // VALIDAÇÕES
  // -----------------------------
  const validateForm = () => {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "O título é obrigatório.";

    const hasTime = (hours && hours !== "0") || (minutes && minutes !== "0");
    if (!hasTime)
      newErrors.duration = "Defina o tempo do simulado.";

    if (!deadline) {
      newErrors.deadline = "Selecione uma data e hora limite";
    }

    questions.forEach((q, index) => {
      if (!q.text.trim()) {
        newErrors[`question_${index}`] = "A questão não pode estar vazia.";
      }

      if (q.points <= 0) {
        newErrors[`points_${index}`] = "Os pontos devem ser maiores que 0.";
      }

      // opções
      if (q.type === "multipla_escolha") {
        if (q.options.some((op) => !op.text.trim())) {
          newErrors[`options_${index}`] =
            "Todas as opções devem estar preenchidas.";
        }

        if (!q.options.some((op) => op.correct)) {
          newErrors[`correct_${index}`] =
            "Selecione uma opção correta.";
        }
      }

      if (q.type === "verdadeiro/falso") {
        if (!q.options.some((op) => op.correct)) {
          newErrors[`correct_${index}`] =
            "Escolha entre Verdadeiro ou Falso.";
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return false;
    }

    return true;
  };

  // -----------------------------
  // SUBMIT
  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const totalDuration =
      (parseInt(hours || 0) * 60) + parseInt(minutes || 0);

    const data = {
      title,
      description,
      class_id: class_id,
      subject_id: subjectId,
      created_by: user.id,
      questions,
      deadline,
      totalDuration,
    };

    const response = await requestData("/form/publish", "POST", data, true);
    if (response.success) {
      setFlashMessage(response.data.message, "success");
      navigate(`/teacher/class/view/${class_id}`);
    } else {
      setFlashMessage(response.message, "error");
    }
  }

  function handleVoltar() {
    navigate(`/teacher/class/view/${class_id}`);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      <div className="max-w-4xl mx-auto py-12 px-4">

        {/* Botão Voltar */}
        <button
          onClick={handleVoltar}
          className="p-3 mb-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Mensagens de Erro */}
        {Object.keys(errors).length > 0 && (
          <div
            className={`p-4 mb-6 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 font-semibold transition-all ${
              shake ? "animate-shake" : ""
            }`}
          >
            Existem erros no formulário. Revise os campos destacados.
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Info gerais */}
          <div className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">
              Informações Gerais
            </h2>

            {/* Título */}
            <div>
              <label className="block font-semibold text-slate-200 mb-2">
                Título *
              </label>
              <input
                type="text"
                className={`w-full bg-transparent border rounded-lg px-4 py-2.5 focus:ring-2 transition text-white
                  ${
                    errors.title
                      ? "border-red-500 focus:ring-red-500/50"
                      : "border-white/10 focus:ring-indigo-400"
                  }
                `}
                placeholder="Ex: Prova de Lógica"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Descrição (opcional) */}
            <div>
              <label className="block font-semibold text-slate-200 mb-2">
                Descrição
              </label>
              <textarea
                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Duração */}
            <div>
              <label className="block font-semibold text-slate-200 mb-2">
                Tempo de Simulado *
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  className={`w-full bg-transparent border px-4 py-2.5 rounded-lg text-white
                    ${
                      errors.duration
                        ? "border-red-500"
                        : "border-white/10"
                    }`}
                  placeholder="Horas"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />

                <input
                  type="number"
                  min="0"
                  max="59"
                  className={`w-full bg-transparent border px-4 py-2.5 rounded-lg text-white
                    ${
                      errors.duration
                        ? "border-red-500"
                        : "border-white/10"
                    }`}
                  placeholder="Minutos"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </div>

              {errors.duration && (
                <p className="text-red-400 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Deadline */}
            <div className="mt-3">
              <DateTimePicker
                deadline={deadline}
                setDeadline={setDeadline}
                error={errors.deadline} // ← aqui
              />


              {errors.deadline && (
                <p className="text-red-400 text-sm mt-1">{errors.deadline}</p>
              )}
            </div>

          </div>

          {/* QUESTÕES */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white ml-2">
              Questões
            </h2>

            {questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="bg-slate-800/60 p-8 rounded-2xl shadow-lg border border-white/10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">
                    Questão {qIndex + 1}
                  </h3>

                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-slate-300 hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Enunciado da questão */}
                <AutoResizeTextarea
                  className={`w-full bg-transparent border rounded-lg px-4 py-2.5 text-white
                    ${
                      errors[`question_${qIndex}`]
                        ? "border-red-500"
                        : "border-white/10"
                    }`}
                  placeholder="Digite a questão aqui..."
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(qIndex, "text", e.target.value)
                  }
                  required
                />

                {errors[`question_${qIndex}`] && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors[`question_${qIndex}`]}
                  </p>
                )}

                {/* Pontos */}
                <div className="mt-4 flex items-center gap-2">
                  <label className="font-semibold text-slate-200">
                    Pontos:
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className={`w-24 bg-transparent border px-3 py-2 rounded-lg text-white
                      ${
                        errors[`points_${qIndex}`]
                          ? "border-red-500"
                          : "border-white/10"
                      }`}
                    value={question.points}
                    onChange={(e) =>
                      updateQuestion(
                        qIndex,
                        "points",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </div>

                {errors[`points_${qIndex}`] && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors[`points_${qIndex}`]}
                  </p>
                )}

                {/* Tipo */}
                <div className="mt-6">
                  <label className="block font-semibold text-slate-200 mb-2">
                    Tipo de Questão *
                  </label>

                  <div className="flex gap-2 flex-wrap">
                    {questionTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          updateQuestion(qIndex, "type", type.value)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                          ${
                            question.type === type.value
                              ? "bg-yellow-400 text-black"
                              : "bg-white/5 text-slate-200 hover:bg-white/10"
                          }
                        `}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MULTIPLA ESCOLHA */}
                {question.type === "multipla_escolha" && (
                  <div className="mt-4 space-y-3">

                    {question.options.map((op, i) => (
                      <div
                        key={i}
                        className={`p-3 flex items-center gap-3 rounded-lg border
                          ${
                            op.correct
                              ? "border-green-500 bg-green-500/10"
                              : "border-white/10"
                          }
                        `}
                      >
                        <button
                          type="button"
                          onClick={() => updateOption(qIndex, i, "correct", true)}
                          className={`w-6 h-6 rounded-full border flex items-center justify-center
                            ${
                              op.correct
                                ? "bg-green-500 border-green-500"
                                : "border-white/20"
                            }
                          `}
                        >
                          {op.correct && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>

                        <input
                          type="text"
                          className={`flex-1 bg-transparent text-white
                            ${
                              errors[`options_${qIndex}`]
                                ? "border-red-500"
                                : ""
                            }
                          `}
                          placeholder={`Opção ${i + 1}`}
                          value={op.text}
                          onChange={(e) =>
                            updateOption(qIndex, i, "text", e.target.value)
                          }
                        />

                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, i)}
                            className="text-slate-300 hover:text-red-400"
                          >
                            <X />
                          </button>
                        )}
                      </div>
                    ))}

                    {errors[`options_${qIndex}`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`options_${qIndex}`]}
                      </p>
                    )}

                    {errors[`correct_${qIndex}`] && (
                      <p className="text-red-400 text-sm">
                        {errors[`correct_${qIndex}`]}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="mt-2 flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                    >
                      <Plus /> Adicionar opção
                    </button>
                  </div>
                )}

                {/* VERDADEIRO / FALSO */}
                {question.type === "verdadeiro/falso" && (
                  <div className="flex gap-4 mt-4">

                    {["Verdadeiro", "Falso"].map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleTrueFalseSelect(qIndex, label)}
                        className={`flex-1 p-4 rounded-lg font-bold border
                          ${
                            question.options.find((o) => o.text === label)
                              ?.correct
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white/5 text-white border-white/10"
                          }
                        `}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* ABERTA */}
                {question.type === "aberta" && (
                  <div className="mt-4 p-4 text-center border border-white/10 rounded-lg bg-white/5">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    O aluno escreverá a resposta.
                  </div>
                )}
              </div>
            ))}

            {/* Adicionar questão */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={addQuestion}
                className="bg-yellow-400 text-black px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all flex items-center gap-2 font-bold shadow-lg"
              >
                <Plus /> Adicionar nova questão
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="bg-slate-800/60 p-6 rounded-xl border border-white/10 flex justify-end gap-4">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-bold bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg flex items-center gap-2"
            >
              <Check /> Publicar formulário
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}