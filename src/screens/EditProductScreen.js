import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const EditProductScreen = ({ route, navigation }) => {
    const { id } = route.params;
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const getProduct = async () => {
            const product = await firestore().collection('Products').doc(id).get();
            const data = product.data();
            setName(data.name);
            setType(data.type);
            setPrice(data.price.toString());
            setImageUrl(data.imageUrl); // Hiển thị ảnh đã có
        };

        getProduct();
    }, [id]);

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    const handleUpdateProduct = async () => {
        let updatedImageUrl = imageUrl;

        // Nếu người dùng chọn ảnh mới, tải ảnh lên Firebase Storage
        if (imageUri) {
            setUploading(true);
            const imageRef = storage().ref(`/products/${Date.now()}`);
            await imageRef.putFile(imageUri);
            updatedImageUrl = await imageRef.getDownloadURL();
            setUploading(false);
        }

        // Cập nhật thông tin sản phẩm và URL ảnh trong Firestore
        firestore().collection('Products').doc(id).update({
            name,
            type,
            price: parseFloat(price),
            imageUrl: updatedImageUrl,
        }).then(() => {
            navigation.navigate('ProductList');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit Product</Text>

            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Product Type"
                value={type}
                onChangeText={setType}
            />

            <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            <TouchableOpacity
                style={styles.imageButton}
                onPress={selectImage}
            >
                <Text style={styles.buttonText}>Select New Image</Text>
            </TouchableOpacity>

            {/* Hiển thị ảnh sản phẩm */}
            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                />
            ) : (
                imageUrl && (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                    />
                )
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={handleUpdateProduct}
                disabled={uploading}
            >
                <Text style={styles.buttonText}>
                    {uploading ? 'Uploading...' : 'Update Product'}
                </Text>
            </TouchableOpacity>

            {uploading && <ActivityIndicator size="large" color="#007BFF" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    imageButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export default EditProductScreen;
