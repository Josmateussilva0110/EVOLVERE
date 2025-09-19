import { useState } from "react"

function FileUpload({ name, label, accept = ".pdf", onFileChange }) {
  const [fileName, setFileName] = useState("")

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      onFileChange(file) // agora combina com o UserAccount
    }
  }

  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                     file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                     file:bg-[#060060] file:text-white hover:file:bg-[#05004d] cursor-pointer"
        />
      </div>
      {fileName && (
        <p className="mt-1 text-xs text-gray-500">Arquivo selecionado: {fileName}</p>
      )}
    </div>
  )
}


export default FileUpload
