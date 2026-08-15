import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosInstance';

// Função assíncrona para buscar múltiplas categorias de uma vez
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (categories, { rejectWithValue }) => {
    try {
      // Cria um array de requisições baseadas nas categorias enviadas
      const requests = categories.map((category) => 
        api.get(`/products/category/${category}`)
      );
      
      // Dispara todas as requisições ao mesmo tempo e aguarda a resposta
      const responses = await Promise.all(requests);
      
      // Junta todos os produtos retornados em um único array plano
      const allProducts = responses.flatMap((res) => res.data.products);
      
      return allProducts;
    } catch (error) {
      return rejectWithValue('Erro ao carregar os produtos. Verifique sua conexão.');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Podemos adicionar uma ação para limpar a lista, se necessário no futuro
    clearProducts: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Guarda os produtos recebidos
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Guarda a mensagem de erro
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer;