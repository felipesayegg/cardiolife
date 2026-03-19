import { useState } from 'react';

// Recebemos uma "prop" chamada 'onRegistroSalvo' do App.jsx
export default function FormularioCadastro({ onRegistroSalvo }) {
  
  // O estado do formulário agora vive DENTRO deste componente
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    peso: '',
    pressaoSistolica: '',
    pressaoDiastolica: ''
  });

  // A função de 'change' também vive aqui
  const handleChange = (evento) => {
    const { name, value } = evento.target;
    setFormData((dadosAnteriores) => ({
      ...dadosAnteriores,
      [name]: value
    }));
  };

  // O 'submit' também vive aqui
  const handleSubmit = (evento) => {
    evento.preventDefault();
    
    // Quando salvamos, chamamos a função 'onRegistroSalvo'
    // para "entregar" o novo registro para o App.jsx
    onRegistroSalvo({ ...formData, id: Date.now() });

    // Limpa o formulário local
    setFormData({
      nome: '',
      idade: '',
      peso: '',
      pressaoSistolica: '',
      pressaoDiastolica: ''
    });
  };

  // O JSX do formulário (o CSS do App.css ainda se aplica)
  return (
    <div className="form-card">
      <h2>CardioLife - Novo Registro</h2>
      <form onSubmit={handleSubmit}>
        
        <label htmlFor="nome">Nome Completo</label>
        <input
          type="text"
          id="nome"
          name="nome"
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
          placeholder="Ex: 80.5" // Já coloquei o placeholder melhorado
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
        
        {/* Já mudei a cor do botão para verde, como queríamos */}
        <button type="submit" style={{ backgroundColor: '#28a745', border: 'none' }}>
          Salvar Registro
        </button>
      </form>
    </div>
  );
}