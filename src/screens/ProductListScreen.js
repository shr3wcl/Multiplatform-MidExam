import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ProductListScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Products')
            .onSnapshot((querySnapshot) => {
                const productsArray = [];
                querySnapshot.forEach((documentSnapshot) => {
                    productsArray.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id,
                    });
                });
                setProducts(productsArray);
            });

        return () => unsubscribe();
    }, []);

    const deleteProduct = (id) => {
        firestore().collection('Products').doc(id).delete().then(() => console.log('Product deleted!'));
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('DetailProduct', { id: item.id })}>
            <View style={styles.productContainer}>
                {item.imageUrl ? (
                    <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.productImage}
                    />
                ) : (
                    <Text style={styles.noImageText}>No Image Available</Text>
                )}
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productType}>Category: {item.type}</Text>
                <Text style={styles.productPrice}>Price: ${item.price}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditProduct', { id: item.id })}
                    >
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteProduct(item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={renderProduct}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    productContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    noImageText: {
        fontSize: 14,
        color: '#999',
        marginBottom: 10,
        fontStyle: 'italic',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    productType: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666',
    },
    productPrice: {
        fontSize: 16,
        marginBottom: 10,
        color: '#007BFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#28a745',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProductListScreen;
