/* eslint-disable react/prop-types */
// O componente recebe 'registros' (a lista) e 'onLimparRegistros' (a função)
export default function ListaRegistros({ registros, onLimparRegistros }) {
  
  // Função para chamar o "limpar" só depois de confirmar
  const handleClearAll = () => {
    if (window.confirm("Tem certeza que deseja apagar TODOS os registros?")) {
      onLimparRegistros(); // Chama a função que veio do App.jsx
    }
  };

  return (
    <div className="registros-container">
      <h2>Últimos Registros</h2>
      
      {/* O botão de Limpar só aparece se tiver registros */}
      {registros.length > 0 && (
        <button onClick={handleClearAll} className="btn-limpar">
          Limpar Todos
        </button>
      )}

      <div className="cards-grid">
        
        {/* Mensagem de "sem registros" */}
        {registros.length === 0 && (
          <p className="sem-registros">Nenhum registro encontrado.</p>
        )}

        {/* Mapeia a lista e cria os cards (só os últimos 6, em ordem reversa) */}
        {registros.slice(-6).reverse().map((reg) => (
          <div className="record-card" key={reg.id}>
            <h3>{reg.nome}</h3>
            <p>Idade: {reg.idade} anos</p>
            <p>Peso: {reg.peso} kg</p>
            <p>Pressão: <strong>{reg.pressaoSistolica} / {reg.pressaoDiastolica}</strong> mmHg</p>
          </div>
        ))}
      </div>
    </div>
  );
}