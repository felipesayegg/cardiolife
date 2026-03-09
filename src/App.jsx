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

  // Tenta recuperar a sessão ao abrir a página
  useEffect(() => {
    const sessaoSalva = localStorage.getItem('sessaoCardioLife');
    if (sessaoSalva) {
      setUsuarioLogado(JSON.parse(sessaoSalva));
    }
  }, []);

  const simularLogin = (id) => {
    const usuarios = {
      1: { id: 1, nome: "Dr. João Silva", email: "joao@cardiolife.com" },
      2: { id: 2, nome: "Dra. Maria Santos", email: "maria@cardiolife.com" },
      3: { id: 3, nome: "Admin Sistema", email: "admin@cardiolife.com" }
    };
    const user = usuarios[id];
    localStorage.setItem('sessaoCardioLife', JSON.stringify(user));
    setUsuarioLogado(user);
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
        <button onClick={() => { localStorage.removeItem('sessaoCardioLife'); setUsuarioLogado(null); }} className="btn-logout">Sair</button>
      </div>
      
      {/* Por enquanto, salvando na lista geral até o próximo commit */}
      <FormularioCadastro onRegistroSalvo={(reg) => setRegistros([...registros, reg])} />
      <ListaRegistros registros={registros} />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({message:'', type:''})} />
    </div>
  );
}