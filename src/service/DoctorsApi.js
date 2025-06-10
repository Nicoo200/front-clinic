import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export async function fetchDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}/doctors`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar médicos:', error.response?.data || error.message);
    throw error;
  }
}

export async function getMedicoById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar médico com id ${id}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function excluirMedico(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir médico com id ${id}:`, error.response?.data || error.message);
    throw error;
  }
}

export async function cadastrarMedico(dadosMedico) {
  try {
    const response = await axios.post(`${BASE_URL}/doctors`, dadosMedico);
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar médico:', error.response?.data || error.message);
    throw error;
  }
}


