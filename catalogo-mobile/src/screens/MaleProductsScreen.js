import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, clearProducts } from '../store/slices/productsSlice';
import { useFocusEffect } from '@react-navigation/native';

export default function MaleProductsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  // Estado para controlar o filtro atual
  const [activeFilter, setActiveFilter] = useState('Todos');
  const filters = ['Todos', 'Roupas', 'Sapatos', 'Acessórios'];

  // Categorias masculinas da API
  const maleCategories = ['mens-shirts', 'mens-shoes', 'mens-watches'];

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchProducts(maleCategories));
    
    return () => {
        dispatch(clearProducts());
      };
    }, [dispatch])
  );

  // Filtra a lista de acordo com o botão clicado
  const filteredItems = items.filter(item => {
    if (activeFilter === 'Todos') return true;
    if (activeFilter === 'Roupas') return item.category === 'mens-shirts';
    if (activeFilter === 'Sapatos') return item.category === 'mens-shoes';
    if (activeFilter === 'Acessórios') return item.category === 'mens-watches';
    return true;
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Moda Masculina</Text>

      {/* Barra de Filtros */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[
                styles.filterChip, 
                activeFilter === filter && styles.activeFilterChip
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText, 
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={filteredItems} // Renderiza a lista filtrada
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 10, 
    color: '#333' 
  },
  
  // Estilos da barra de filtros
  filterContainer: { paddingLeft: 20, marginBottom: 15 },
  filterChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#E0E0E0', 
    marginRight: 10 
  },
  activeFilterChip: { backgroundColor: '#007BFF' }, // Azul para destaque masculino
  filterText: { color: '#666', fontWeight: 'bold' },
  activeFilterText: { color: '#FFF' },

  listContent: { paddingHorizontal: 15, paddingBottom: 20 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 8, 
    marginBottom: 15, 
    overflow: 'hidden', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    shadowOffset: { width: 0, height: 2 } 
  },
  image: { width: 100, height: 100, backgroundColor: '#E0E0E0' },
  infoContainer: { flex: 1, padding: 10, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  price: { fontSize: 16, color: '#007BFF', fontWeight: 'bold' }, // Preço em azul
  errorText: { color: '#D9534F', textAlign: 'center', marginTop: 20, fontSize: 16 }
});