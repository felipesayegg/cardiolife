import { useState, useEffect } from 'react';
import './App.css';
// 1. IMPORTE O NOVO COMPONENTE DE FORMULÁRIO
import FormularioCadastro from './components/FormularioCadastro';

export default function App() {
  
  // O App.jsx agora só se preocupa com a LISTA de registros
  const [registros, setRegistros] = useState(() => {
    const dadosSalvos = localStorage.getItem('registrosCardioLife');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // O useEffect continua aqui, monitorando 'registros'
  useEffect(() => {
    localStorage.setItem('registrosCardioLife', JSON.stringify(registros));
  }, [registros]);

  // Função que será passada para o formulário
  const adicionarRegistro = (novoRegistro) => {
    setRegistros([
      ...registros, 
      novoRegistro
    ]);
  };

  // O JSX do App fica MUITO menor
  return (
    <div className="app-container">
      
      {/* --- SEÇÃO DO FORMULÁRIO (agora é um componente) --- */}
      {/* Passamos a função 'adicionarRegistro' para a prop 'onRegistroSalvo' */}
      <FormularioCadastro onRegistroSalvo={adicionarRegistro} />

      {/* --- SEÇÃO DOS CARDS DE REGISTRO (continua aqui por enquanto) --- */}
      <div className="registros-container">
        <h2>Últimos Registros</h2>
        <div className="cards-grid">
          
          {registros.length === 0 && (
            <p className="sem-registros">Nenhum registro encontrado.</p>
          )}

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

    </div>
  );
}