/**
 * Componente RoleBadge
 *
 * Este componente exibe um selo (badge) indicando o papel (role) de um usuário
 * com base nas informações fornecidas pelo objeto `profile`.
 *
 * O selo é estilizado de acordo com a função do usuário (Admin, Coordenador, Professor, Aluno ou Desconhecido),
 * aplicando cores e estilos diferentes para cada papel.
 *
 * @component
 * @example
 * // Exemplo de uso:
 * const profile = { role: 'Professor', registration: '12345' };
 * return <RoleBadge profile={profile} />;
 *
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.profile - Objeto contendo as informações do perfil do usuário.
 * @param {string} [props.profile.role] - Papel do usuário (Admin, Coordenador, Professor, Aluno ou Desconhecido).
 * @param {string} [props.profile.registration] - Registro do usuário; se for 'admin', define automaticamente o papel como Admin.
 *
 * @returns {JSX.Element} Um elemento <span> estilizado representando o papel do usuário.
 */
function RoleBadge({ profile }) {
  let role = 'Desconhecido';

  if (profile.registration === 'admin') {
    role = 'Admin';
  } 
  else if (profile.role && profile.role !== 'Desconhecido') {
    role = profile.role;
  } 
  else {
    role = 'Aluno';
  }

  // Mapeamento dos papéis para seus respectivos rótulos e estilos.
  const roleMap = {
    Admin: {
      label: 'Admin',
      classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    },
    Coordenador: {
      label: 'Coordenador',
      classes: 'bg-blue-50 text-blue-700 ring-blue-200',
    },
    Professor: {
      label: 'Professor',
      classes: 'bg-purple-50 text-purple-700 ring-purple-200',
    },
    Aluno: {
      label: 'Aluno',
      classes: 'bg-orange-50 text-orange-700 ring-orange-200',
    },
    Desconhecido: {
      label: 'Desconhecido',
      classes: 'bg-gray-50 text-gray-700 ring-gray-200',
    },
  };

  // Seleciona o estilo correspondente ao papel atual, ou usa "Desconhecido" por padrão.
  const current = roleMap[role] || roleMap.Desconhecido;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${current.classes}`}
    >
      {current.label}
    </span>
  );
}

export default RoleBadge;
