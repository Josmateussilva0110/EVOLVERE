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
