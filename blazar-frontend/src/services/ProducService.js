// src/services/productService.js
import axios from '../axios'; // Importa a configuração do Axios

// Função para pegar todos os produtos
export async function getProducts() {
  try {
    const response = await axios.get('/produtos'); // A rota do backend para listar os produtos
    return response.data;
  } catch (error) {
    console.error("Erro ao pegar produtos:", error);
    throw error;
  }
}
