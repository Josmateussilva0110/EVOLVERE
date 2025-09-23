
/**
 * Componente Container.
 *
 * Envolve elementos filhos (`children`) dentro de um elemento <main>,
 * servindo como contêiner sem aplicar estilizações adicionais por padrão.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elementos filhos a serem renderizados dentro do container.
 * @example
 * <Container>
 *   <h1>Conteúdo da página</h1>
 *   <p>Mais conteúdo aqui.</p>
 * </Container>
 *
 * @returns {JSX.Element} Elemento <main> contendo os filhos passados.
 */
function Container({children}) {
    return (
        <main>{children}</main>
    )
}

export default Container
