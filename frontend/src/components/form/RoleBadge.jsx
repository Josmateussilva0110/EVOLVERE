function RoleBadge({ profile }) {
  let role = 'Desconhecido';

  if (profile.role && profile.role !== 'Desconhecido') {
    role = profile.role;
  } 
  
  else if (profile.registration === 'admin') {
    role = 'Admin';
  } 
  
  else if (profile.registration) {
    role = 'Aluno';
  }

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
