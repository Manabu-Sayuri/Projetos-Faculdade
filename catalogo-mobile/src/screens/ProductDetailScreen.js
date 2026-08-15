import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import api from '../api/axiosInstance';

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params; // Pega o ID passado pela navegação
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca os detalhes específicos do produto
    api.get(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!product) return null;

  const finalPrice = product.price - (product.price * (product.discountPercentage / 100));

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.thumbnail }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description}>{product.description}</Text>
        
        <View style={styles.priceRow}>
          <View style={{ marginRight: 15 }}>
            <Text style={styles.originalPrice}>De: ${product.price.toFixed(2)}</Text>
            <Text style={styles.finalPrice}>Por: ${finalPrice.toFixed(2)}</Text>
          </View>
          <Text style={styles.discount}>-{product.discountPercentage}% OFF</Text>
        </View>

        <TouchableOpacity 
          style={styles.buyButton}
          onPress={() => alert('Compra simulada com sucesso! 🐾')}
        >
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#FFF' },
  image: { width: '100%', height: 300, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  originalPrice: { fontSize: 16, color: '#999', textDecorationLine: 'line-through', marginBottom: 2 },
  finalPrice: { fontSize: 28, fontWeight: 'bold', color: '#28A745' },
  discount: { fontSize: 16, fontWeight: 'bold', color: '#FFF', backgroundColor: '#D9534F', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  buyButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buyButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});