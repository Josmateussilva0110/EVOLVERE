import styles from "./styles/Image.module.css"


/**
 * Componente para exibir imagens com bordas arredondadas.
 *
 * Props:
 * @param {string} src - URL ou caminho da imagem.
 * @param {string} alt - Texto alternativo da imagem.
 * @param {number} [size=150] - Largura e altura da imagem em pixels (quadrada).
 * @param {string} [className] - Classes CSS adicionais para estilização.
 *
 * @component
 * @example
 * <Image 
 *    src="/logo.png" 
 *    alt="Logotipo da aplicação" 
 *    size={100} 
 *    className="shadow-lg" 
 * />
 *
 * @returns {JSX.Element} Componente de imagem quadrada com bordas arredondadas.
 */
function Image({ src, alt, size = 150, className }) {
  return (
    <img
      className={`${styles.rounded_image} ${className || ''}`}
      src={src}
      alt={alt}
      style={{ width: size, height: size }}
    />
  )
}

export default Image
