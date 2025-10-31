import { useState, useEffect } from 'react';
import './App.css';
import FormularioCadastro from './components/FormularioCadastro';
// 1. IMPORTE O NOVO COMPONENTE DE LISTA
import ListaRegistros from './components/ListaRegistros';

export default function App() {
  
  // 1. O ESTADO (a lista) mora no App
  const [registros, setRegistros] = useState(() => {
    const dadosSalvos = localStorage.getItem('registrosCardioLife');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // 2. O EFEITO de salvar no LocalStorage também mora no App
  useEffect(() => {
    localStorage.setItem('registrosCardioLife', JSON.stringify(registros));
  }, [registros]); // Roda sempre que [registros] mudar

  // 3. FUNÇÃO para ADICIONAR um registro (será passada para o Formulário)
  const adicionarRegistro = (novoRegistro) => {
    setRegistros([ ...registros, novoRegistro ]);
  };

  // 4. FUNÇÃO para LIMPAR os registros (será passada para a Lista)
  const limparTodosRegistros = () => {
    setRegistros([]); // Define a lista como vazia
  };

  // 5. O JSX agora é super limpo!
  return (
    <div className="app-container">
      
      {/* Componente 1: O Formulário */}
      {/* Ele recebe a função 'adicionarRegistro' como uma "prop" */}
      <FormularioCadastro onRegistroSalvo={adicionarRegistro} />

      {/* Componente 2: A Lista */}
      {/* Ela recebe a lista 'registros' e a função 'limparTodosRegistros' */}
      <ListaRegistros 
        registros={registros} 
        onLimparRegistros={limparTodosRegistros} 
      />

    </div>
  );
}