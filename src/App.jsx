import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import FormularioCadastro from './components/FormularioCadastro.jsx';
import ListaRegistros from './components/ListaRegistros.jsx';
import Toast from './components/Toast.jsx';

// Função pura de regra de negócio: classifica a pressão arterial
// Regra: sempre considerar o PIOR cenário (maior valor entre sistólica e diastólica)
function classificarPressao(sistolica, diastolica) {
  const s = Number(sistolica);
  const d = Number(diastolica);

  if (s >= 180 || d >= 120) {
    return {
      nivel: 'Crise Hipertensiva - EMERGÊNCIA',
      gravidade: 'emergencia',
      cor: '#c0392b',
      alerta: '🚨 ATENÇÃO IMEDIATA NECESSÁRIA',
      descricao: 'Pressão arterial em nível de emergência. Procure atendimento médico imediatamente.',
      recomendacoes: [
        'Procure uma UPA ou pronto-socorro imediatamente',
        'Não dirija — chame um familiar ou ambulância',
        'Evite qualquer esforço físico',
        'Mantenha-se em repouso até o atendimento'
      ]
    };
  }

  if (s >= 160 || d >= 100) {
    return {
      nivel: 'Hipertensão Estágio 2',
      gravidade: 'estagio2',
      cor: '#e67e22',
      alerta: '⚠️ PRESSÃO ALTA - ESTÁGIO 2',
      descricao: 'Pressão arterial elevada significativamente. Necessita acompanhamento médico urgente.',
      recomendacoes: [
        'Consulte seu médico o quanto antes',
        'Evite atividades físicas intensas',
        'Reduza o consumo de sal',
        'Monitore a pressão diariamente'
      ]
    };
  }

  if (s >= 140 || d >= 90) {
    return {
      nivel: 'Hipertensão Estágio 1',
      gravidade: 'estagio1',
      cor: '#f39c12',
      alerta: '⚠️ PRESSÃO ALTA - ESTÁGIO 1',
      descricao: 'Pressão arterial acima do ideal. Recomenda-se acompanhamento médico.',
      recomendacoes: [
        'Agende consulta médica',
        'Reduza o consumo de sal e gorduras',
        'Pratique atividade física moderada',
        'Evite estresse e monitore regularmente'
      ]
    };
  }

  if (s >= 121 || d >= 81) {
    return {
      nivel: 'Pressão Limítrofe (Pré-Hipertensão)',
      gravidade: 'limitrofe',
      cor: '#f1c40f',
      alerta: '⚡ ATENÇÃO - PRESSÃO LIMÍTROFE',
      descricao: 'Pressão arterial acima do normal. Adote hábitos saudáveis para evitar progressão.',
      recomendacoes: [
        'Adote dieta com menos sal',
        'Pratique exercícios físicos regularmente',
        'Evite tabaco e álcool',
        'Monitore a pressão mensalmente'
      ]
    };
  }

  return {
    nivel: 'Pressão Normal',
    gravidade: 'normal',
    cor: '#27ae60',
    alerta: '✅ PRESSÃO ARTERIAL NORMAL',
    descricao: 'Sua pressão arterial está dentro dos valores ideais. Continue com os bons hábitos!',
    recomendacoes: [
      'Mantenha uma alimentação equilibrada',
      'Continue praticando atividade física',
      'Monitore a pressão periodicamente',
      'Consulte seu médico regularmente'
    ]
  };
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [modalLaudo, setModalLaudo] = useState(false);
  const [laudoAtual, setLaudoAtual] = useState(null);
  const isAdmin = usuarioLogado?.id === 3;

  useEffect(() => {
    const sessaoSalva = localStorage.getItem('sessaoCardioLife');
    if (sessaoSalva) {
      setUsuarioLogado(JSON.parse(sessaoSalva));
    }
  }, []);

  // --- O SEGREDO ESTÁ AQUI: Carrega dados específicos do ID logado ---
  useEffect(() => {
    if (!usuarioLogado) {
      setRegistros([]);
      return;
    }

    if (isAdmin) {
      // Admin enxerga registros de todas as chaves de usuários.
      const chavesDeUsuarios = Object.keys(localStorage).filter((chave) =>
        chave.startsWith('dadosCardiologicos_')
      );

      const registrosAdmin = chavesDeUsuarios.flatMap((chave) => {
        const dados = localStorage.getItem(chave);
        try {
          return dados ? JSON.parse(dados) : [];
        } catch {
          return [];
        }
      });

      setRegistros(registrosAdmin);
      return;
    }

    if (usuarioLogado) {
      const chaveUsuario = `dadosCardiologicos_${usuarioLogado.id}`;
      const dadosSalvos = localStorage.getItem(chaveUsuario);
      setRegistros(dadosSalvos ? JSON.parse(dadosSalvos) : []);
    }
  }, [usuarioLogado, isAdmin]);

  const adicionarRegistro = (novoRegistro) => {
    // Adiciona o nome do médico que está logado no registro
    const registroCompleto = {
      ...novoRegistro,
      usuarioId: usuarioLogado.id,
      usuarioNome: usuarioLogado.nome,
      dataRegistro: new Date().toLocaleDateString('pt-BR')
    };

    const novosRegistros = [...registros, registroCompleto];
    setRegistros(novosRegistros);

    // Salva na chave EXCLUSIVA desse usuário
    const chaveUsuario = `dadosCardiologicos_${usuarioLogado.id}`;
    localStorage.setItem(chaveUsuario, JSON.stringify(novosRegistros));

    // Gera o laudo médico automático
    const classificacao = classificarPressao(novoRegistro.pressaoSistolica, novoRegistro.pressaoDiastolica);
    const altura = Number(novoRegistro.altura);
    const peso = Number(novoRegistro.peso);
    const imc = altura > 0 ? (peso / (altura * altura)).toFixed(1) : null;

    setLaudoAtual({
      paciente: novoRegistro.nome,
      pressao: `${novoRegistro.pressaoSistolica}/${novoRegistro.pressaoDiastolica}`,
      data: new Date().toLocaleString('pt-BR'),
      imc,
      ...classificacao
    });
    setModalLaudo(true);

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
      {!isAdmin && (
        <FormularioCadastro onRegistroSalvo={adicionarRegistro} />
      )}

      <ListaRegistros 
        registros={registros} 
        isAdmin={isAdmin}
        onLimparRegistros={() => {
          if (isAdmin) return;
          setRegistros([]);
          localStorage.removeItem(`dadosCardiologicos_${usuarioLogado.id}`);
        }}
      />
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({message:'', type:''})} />

      {/* Modal de Laudo Médico Automático */}
      {modalLaudo && laudoAtual && (
        <div className="modal-overlay" onClick={() => setModalLaudo(false)}>
          <div className="modal-laudo" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ backgroundColor: laudoAtual.cor }}>
              <h2>🏥 LAUDO MÉDICO AUTOMÁTICO</h2>
              <button className="modal-close" onClick={() => setModalLaudo(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Informações do Paciente */}
              <div className="laudo-info">
                <p><strong>Paciente:</strong> {laudoAtual.paciente}</p>
                <p><strong>Pressão Arterial:</strong> {laudoAtual.pressao} mmHg</p>
                {laudoAtual.imc && <p><strong>IMC:</strong> {laudoAtual.imc} kg/m²</p>}
                <p><strong>Data/Hora:</strong> {laudoAtual.data}</p>
                <p><strong>Médico:</strong> {usuarioLogado.nome}</p>
              </div>

              {/* Classificação */}
              <div
                className={`laudo-classificacao ${laudoAtual.gravidade}`}
                style={{ borderLeftColor: laudoAtual.cor }}
              >
                <h3>{laudoAtual.alerta}</h3>
                <h4>{laudoAtual.nivel}</h4>
                <p>{laudoAtual.descricao}</p>
              </div>

              {/* Recomendações */}
              <div className="laudo-recomendacoes">
                <h4>🚨 RECOMENDAÇÕES MÉDICAS:</h4>
                <ul>
                  {laudoAtual.recomendacoes.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Aviso Legal */}
              <div className="laudo-aviso">
                <p>
                  ⚠️ <strong>Aviso Importante:</strong> Este laudo é gerado automaticamente
                  com base nas diretrizes da Sociedade Brasileira de Cardiologia.
                  Consulte sempre um médico para avaliação completa e personalizada.
                </p>
              </div>

              {/* Botão de Fechar */}
              <button className="btn-fechar-laudo" onClick={() => setModalLaudo(false)}>
                Fechar Laudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}