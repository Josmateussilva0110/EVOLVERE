
/**
 * Componente de lista suspensa (select) genérica.
 *
 * Funcionalidades:
 * - Exibe um label e uma lista de opções.
 * - Remove duplicados automaticamente com base no valor (`valueKey`).
 * - Suporta valor controlado (`value`) e callback `onChange`.
 * - Permite personalizar label, placeholder e nome do campo.
 *
 * Props:
 * @param {Array<Object>} items - Lista de objetos que serão exibidos como opções.
 * @param {string} valueKey - Nome da chave em cada item que será usado como value do option.
 * @param {string} labelKey - Nome da chave em cada item que será exibido como label do option.
 * @param {string|number} value - Valor atualmente selecionado (para controle do componente).
 * @param {function} onChange - Função chamada quando o valor selecionado muda.
 * @param {string} label - Texto do label exibido acima do select (padrão: "Selecione").
 * @param {string} placeholder - Texto da opção vazia inicial (padrão: "-- Escolha uma opção --").
 * @param {string} name - Nome do campo select (opcional, usa `valueKey` se não fornecido).
 *
 * @component
 * @example
 * const courses = [
 *   { id: 1, name: "Engenharia" },
 *   { id: 2, name: "Medicina" },
 * ];
 *
 * <Select
 *   items={courses}
 *   valueKey="id"
 *   labelKey="name"
 *   value={selectedCourse}
 *   onChange={(e) => setSelectedCourse(e.target.value)}
 *   label="Curso"
 *   placeholder="Selecione um curso"
 *   name="course"
 * />
 *
 * @returns {JSX.Element} Componente de select estilizado com label e opções únicas.
 */
export default function Select({
  items = [],
  valueKey,
  labelKey,
  value,
  onChange,
  label = "Selecione",
  placeholder = "-- Escolha uma opção --",
  name,
}) {
  // Remove duplicados com base no value
  const uniqueItems = Array.from(new Map(items.map(item => [item[valueKey], item])).values())

  return (
    <div className="text-left">
      <label
        htmlFor={valueKey}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={valueKey}
        name={name || valueKey}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#060060]"
      >
        <option value="">{placeholder}</option>
        {uniqueItems.map((item) => (
          <option key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </option>
        ))}
      </select>
    </div>
  )
}
