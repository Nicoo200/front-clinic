import React, { useState } from 'react';
import { cadastrarUsuario, loginUsuario } from '../service/AuthApi';
import { useNavigate } from 'react-router-dom';
const styles = {
  container: {
    maxWidth: '480px',
    margin: '50px auto',
    padding: '35px 40px',
    borderRadius: '16px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
    backgroundColor: '#fafafa',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  title: {
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '32px',
    fontWeight: '700',
  },
  field: {
    marginBottom: '22px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#555',
    fontSize: '15px',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    boxSizing: 'border-box',
    border: '1.5px solid #ccc',
    borderRadius: '10px',
    fontSize: '16px',
    backgroundColor: '#fff',
    transition: 'border-color 0.25s ease',
  },
  inputFocus: {
    borderColor: '#5a9bd8',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '14px 18px',
    boxSizing: 'border-box',
    border: '1.5px solid #ccc',
    borderRadius: '10px',
    fontSize: '16px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.25s ease',
  },
  button: {
    width: '100%',
    padding: '16px',
    marginTop: '18px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '17px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0, 123, 255, 0.4)',
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    boxShadow: '0 6px 16px rgba(0, 86, 179, 0.6)',
  },
  buttonDisabled: {
    width: '100%',
    padding: '16px',
    marginTop: '18px',
    cursor: 'not-allowed',
    backgroundColor: '#a1a1a1',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '17px',
    fontWeight: '600',
  },
  toggleButton: {
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: '#007bff',
    padding: '0',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
  toggleButtonHover: {
    color: '#0056b3',
  },
  messageContainer: {
    marginTop: '24px',
    padding: '14px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  messageSuccess: {
    backgroundColor: '#e6f4ea',
    color: '#2e7d32',
    border: '1px solid #2e7d32',
  },
  messageError: {
    backgroundColor: '#fbe9e7',
    color: '#d32f2f',
    border: '1px solid #d32f2f',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#888',
    fontSize: '15px',
  },
};

function InputField({ label, type, name, value, onChange, required = false, children }) {
  return (
    <div style={styles.field}>
      <label htmlFor={name} style={styles.label}>{label}</label>
      {children ? (
        <select 
          id={name} 
          name={name} 
          value={value} 
          onChange={onChange} 
          style={styles.select}
          required={required}
        >
          {children}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={styles.input}
          autoComplete={name === 'senha' ? 'current-password' : 'off'}
        />
      )}
    </div>
  );
}

export default function LoginCadastro() {
  const navigate = useNavigate();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [formCadastro, setFormCadastro] = useState({
    nome: '',
    email: '',
    senha: '',
    tipoUsuario: 'PACIENTE',
    permissao: 'MEMBER',
  });
  const [formLogin, setFormLogin] = useState({
    email: '',
    senha: '',
  });
  const [mensagem, setMensagem] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (modoCadastro) {
      setFormCadastro((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormLogin((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem({ text: '', isError: false });
    setLoading(true);

    try {
      if (modoCadastro) {
        await cadastrarUsuario(formCadastro);
        setMensagem({ text: '✅ Cadastro realizado com sucesso! Faça login.', isError: false });
        setModoCadastro(false);
        setFormLogin({ email: formCadastro.email, senha: '' });
        setFormCadastro({
          nome: '',
          email: '',
          senha: '',
          tipoUsuario: 'PACIENTE',
          permissao: 'MEMBER',
        });
      } else {
        const data = await loginUsuario(formLogin);
        if (data.token) {
          localStorage.setItem('token', data.token);
          setMensagem({ text: '✅ Login realizado com sucesso!', isError: false });
          navigate('/dashboard');
        } else {
          setMensagem({ text: '❌ Erro: token não recebido', isError: true });
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido';
      setMensagem({ text: `❌ Erro: ${errorMsg}`, isError: true });
    } finally {
      setLoading(false);
    }
  }

  function alternarModo() {
    setMensagem({ text: '', isError: false });
    setModoCadastro((prev) => !prev);
    setFormCadastro({
      nome: '',
      email: '',
      senha: '',
      tipoUsuario: 'PACIENTE',
      permissao: 'MEMBER',
    });
    setFormLogin({ email: '', senha: '' });
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{modoCadastro ? 'Cadastro de Usuário' : 'Login'}</h2>

      <form onSubmit={handleSubmit} noValidate>
        {modoCadastro && (
          <>
            <InputField
              label="Nome:"
              type="text"
              name="nome"
              value={formCadastro.nome}
              onChange={handleChange}
              required
            />
            <InputField
              label="Tipo de Usuário:"
              name="tipoUsuario"
              value={formCadastro.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="PACIENTE">Paciente</option>
              <option value="MEDICO">Médico</option>
              <option value="RECEPCIONISTA">Recepcionista</option>
            </InputField>
            <InputField
              label="Permissão:"
              name="permissao"
              value={formCadastro.permissao}
              onChange={handleChange}
              required
            >
              <option value="MEMBER">Membro</option>
              <option value="MODERADOR">Moderador</option>
              <option value="ADMIN">Administrador</option>
            </InputField>
          </>
        )}

        <InputField
          label="Email:"
          type="email"
          name="email"
          value={modoCadastro ? formCadastro.email : formLogin.email}
          onChange={handleChange}
          required
        />

        <InputField
          label="Senha:"
          type="password"
          name="senha"
          value={modoCadastro ? formCadastro.senha : formLogin.senha}
          onChange={handleChange}
          required
        />

        <button 
          type="submit" 
          disabled={loading} 
          style={loading ? styles.buttonDisabled : styles.button}
        >
          {loading ? 'Aguarde...' : modoCadastro ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      <p style={styles.toggleText}>
        {modoCadastro ? 'Já tem conta?' : 'Não tem conta?'}{' '}
        <button
          onClick={alternarModo}
          style={styles.toggleButton}
          type="button"
          aria-label={modoCadastro ? 'Ir para login' : 'Ir para cadastro'}
        >
          {modoCadastro ? 'Faça login' : 'Cadastre-se'}
        </button>
      </p>

      {mensagem.text && (
        <div style={{
          ...styles.messageContainer,
          ...(mensagem.isError ? styles.messageError : styles.messageSuccess)
        }}>
          {mensagem.text}
        </div>
      )}
    </div>
  );
}