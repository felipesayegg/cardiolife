export default function ListaRegistros({ registros, onLimparRegistros, isAdmin }) {
  
  return (
    <div className="registros-container">
      <h2>{isAdmin ? "Painel Geral de Registros (Admin)" : "Meus Últimos Registros"}</h2>
      
      {registros.length > 0 && !isAdmin && (
        <button onClick={onLimparRegistros} className="btn-limpar">Limpar Tudo</button>
      )}

      <div className="cards-grid">
        {registros.length === 0 && (
          <p className="sem-registros">Nenhum registro encontrado para este usuário.</p>
        )}

        {registros.slice().reverse().map((reg) => (
          <div className="record-card" key={reg.id}>
            <div className="card-header">
              <h3>{reg.nome}</h3>
              {/* MOSTRA O NOME DO MÉDICO SÓ PARA O ADMIN (Regra da Aula 04/03) */}
              {isAdmin && reg.usuarioNome && (
                <span className="badge-medico">{reg.usuarioNome}</span>
              )}
            </div>
            <p><strong>Data:</strong> {reg.dataRegistro || 'Sem data'}</p>
            <p><strong>Idade:</strong> {reg.idade} anos | <strong>Peso:</strong> {reg.peso}kg</p>
            <p className="pressao-val">
              Pressão: <span>{reg.pressaoSistolica}/{reg.pressaoDiastolica}</span> mmHg
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}