import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DetailProductScreen = ({ route, navigation }) => {
    const { id } = route.params; // Lấy ID của sản phẩm từ route params
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lấy chi tiết sản phẩm từ Firestore theo ID
    useEffect(() => {
        const getProduct = async () => {
            const productDoc = await firestore().collection('Products').doc(id).get();
            if (productDoc.exists) {
                setProduct(productDoc.data());
            }
            setLoading(false);
        };

        getProduct();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Product not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Hiển thị ảnh sản phẩm */}
            {product.imageUrl ? (
                <Image
                    source={{ uri: product.imageUrl }}
                    style={styles.productImage}
                />
            ) : (
                <Text style={styles.noImageText}>No image available</Text>
            )}

            {/* Hiển thị thông tin chi tiết sản phẩm */}
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productType}>Category: {product.type}</Text>
            <Text style={styles.productPrice}>Price: ${product.price}</Text>

            {/* Nút quay lại danh sách sản phẩm */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: 300,
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    noImageText: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#666',
        marginBottom: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    productType: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '600',
        color: '#007BFF',
        marginBottom: 30,
    },
    backButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 18,
        color: '#ff0000',
    },
});

export default DetailProductScreen;
