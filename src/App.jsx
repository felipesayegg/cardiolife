import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import FormularioCadastro from './components/FormularioCadastro.jsx';
import ListaRegistros from './components/ListaRegistros.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    const sessaoSalva = localStorage.getItem('sessaoCardioLife');
    if (sessaoSalva) {
      setUsuarioLogado(JSON.parse(sessaoSalva));
    }
  }, []);

  // --- O SEGREDO ESTÁ AQUI: Carrega dados específicos do ID logado ---
  useEffect(() => {
    if (usuarioLogado) {
      const chaveUsuario = `dadosCardiologicos_${usuarioLogado.id}`;
      const dadosSalvos = localStorage.getItem(chaveUsuario);
      setRegistros(dadosSalvos ? JSON.parse(dadosSalvos) : []);
    }
  }, [usuarioLogado]);

  const adicionarRegistro = (novoRegistro) => {
    // Adiciona o nome do médico que está logado no registro
    const registroCompleto = { 
      ...novoRegistro, 
      usuarioId: usuarioLogado.id, 
      usuarioNome: usuarioLogado.nome 
    };

    const novosRegistros = [...registros, registroCompleto];
    setRegistros(novosRegistros);

    // Salva na chave EXCLUSIVA desse usuário
    const chaveUsuario = `dadosCardiologicos_${usuarioLogado.id}`;
    localStorage.setItem(chaveUsuario, JSON.stringify(novosRegistros));
    
    setToast({ message: `Paciente salvo por ${usuarioLogado.nome}!`, type: 'success' });
  };

  const fazerLogout = () => {
    localStorage.removeItem('sessaoCardioLife');
    setUsuarioLogado(null);
    setRegistros([]);
  };

  const simularLogin = (id) => {
    const usuarios = {
      1: { id: 1, nome: "Dr. João Silva", email: "joao@cardiolife.com" },
      2: { id: 2, nome: "Dra. Maria Santos", email: "maria@cardiolife.com" },
      3: { id: 3, nome: "Admin Sistema", email: "admin@cardiolife.com" }
    };
    localStorage.setItem('sessaoCardioLife', JSON.stringify(usuarios[id]));
    setUsuarioLogado(usuarios[id]);
  };

  if (!usuarioLogado) {
    return (
      <div className="login-container">
        <h2>CardioLife - Identificação</h2>
        <div className="login-buttons">
          <button onClick={() => simularLogin(1)}>Entrar como Dr. João</button>
          <button onClick={() => simularLogin(2)}>Entrar como Dra. Maria</button>
          <button onClick={() => simularLogin(3)}>Entrar como Admin</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className="user-bar">
        <span>🩺 Médico: <strong>{usuarioLogado.nome}</strong></span>
        <button onClick={fazerLogout} className="btn-logout">Sair</button>
      </div>
      
      {/* Admin não cadastra no MVP (conforme regra da aula) */}
      {usuarioLogado.id !== 3 && (
        <FormularioCadastro onRegistroSalvo={adicionarRegistro} />
      )}

      <ListaRegistros 
        registros={registros} 
        onLimparRegistros={() => { setRegistros([]); localStorage.removeItem(`dadosCardiologicos_${usuarioLogado.id}`); }}
      />
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({message:'', type:''})} />
    </div>
  );
}