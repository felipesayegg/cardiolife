import { useState, useEffect } from 'react';
import './App.css'; // Vamos importar o CSS que faremos a seguir

export default function App() {
  
  // 1. Estados para os campos do formulário
  //    (Usamos um objeto para ficar mais organizado, como você mencionou)
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    peso: '',
    pressaoSistolica: '',
    pressaoDiastolica: ''
  });

  // 2. Estado para a lista de registros (carregando do LocalStorage)
  const [registros, setRegistros] = useState(() => {
    const dadosSalvos = localStorage.getItem('registrosCardioLife');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // 3. useEffect para SALVAR no LocalStorage
  //    Roda toda vez que a lista [registros] mudar.
  useEffect(() => {
    localStorage.setItem('registrosCardioLife', JSON.stringify(registros));
  }, [registros]); // A "dependência"

  // 4. Função para lidar com a mudança nos inputs (eventos controlados)
  const handleChange = (evento) => {
    const { name, value } = evento.target;
    setFormData((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value
    }));
  };

  // 5. Função para lidar com o envio do formulário
  const handleSubmit = (evento) => {
    evento.preventDefault(); // Impede a página de recarregar

    // Adiciona o novo registro (com os dados do formulário)
    // na lista de registros, mantendo os antigos (...registros)
    setRegistros([
      ...registros, 
      { ...formData, id: Date.now() } // Adiciona um ID único
    ]);

    // Limpa o formulário voltando ao estado inicial
    setFormData({
      nome: '',
      idade: '',
      peso: '',
      pressaoSistolica: '',
      pressaoDiastolica: ''
    });
  };

  // 6. O JSX (HTML) da aplicação
  return (
    <div className="app-container">
      
      {/* --- SEÇÃO DO FORMULÁRIO --- */}
      <div className="form-card">
        <h2>CardioLife - Novo Registro</h2>
        <form onSubmit={handleSubmit}>
          
          <label htmlFor="nome">Nome Completo</label>
          <input
            type="text"
            id="nome"
            name="nome" // O 'name' tem que ser igual à chave do useState
            placeholder="Ex: João da Silva"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="idade">Idade</label>
          <input
            type="number"
            id="idade"
            name="idade"
            placeholder="Ex: 45"
            value={formData.idade}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="peso">Peso (kg)</label>
          <input
            type="number"
            id="peso"
            name="peso"
            placeholder="Ex: 80"
            value={formData.peso}
            onChange={handleChange}
            required
          />

          <label>Pressão Arterial</label>
          <div className="pressao-group">
            <input
              type="number"
              name="pressaoSistolica"
              placeholder="Sistólica (Ex: 120)"
              value={formData.pressaoSistolica}
              onChange={handleChange}
              required
            />
            <span>/</span>
            <input
              type="number"
              name="pressaoDiastolica"
              placeholder="Diastólica (Ex: 80)"
              value={formData.pressaoDiastolica}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit">Salvar Registro</button>
        </form>
      </div>

      {/* --- SEÇÃO DOS CARDS DE REGISTRO --- */}
      <div className="registros-container">
        <h2>Últimos Registros</h2>
        <div className="cards-grid">
          
          {/* Se não houver registros, mostre a mensagem */}
          {registros.length === 0 && (
            <p className="sem-registros">Nenhum registro encontrado.</p>
          )}

          {/* Usamos .map() para transformar cada item da lista em um card */}
          {/* Usamos .slice(-6) para pegar só os últimos 6 e .reverse() para o mais novo vir primeiro */}
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