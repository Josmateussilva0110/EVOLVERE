import styles from "./styles/Image.module.css"

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
