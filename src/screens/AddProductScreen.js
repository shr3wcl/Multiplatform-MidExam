import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const AddProductScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleAddProduct = async () => {
        let imageUrl = '';

        if (imageUri) {
            setUploading(true);
            const imageRef = storage().ref(`/products/${Date.now()}`);
            await imageRef.putFile(imageUri).then(() => console.log("image uploaded!")).catch((err) => console.error(err));
            imageUrl = await imageRef.getDownloadURL();

            setUploading(false);
        }
        console.log("image url", imageUrl);
        firestore().collection('Products').add({
            name,
            type,
            price: parseFloat(price),
            imageUrl, 
        }).then(() => {
            setName('');
            setType('');
            setPrice('');
            setImageUri('');
            navigation.navigate('ProductList');
            console.log('Product added!');
        }).catch((err) => console.error(err));
    };

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setImageUri(response.assets[0].uri);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Product</Text>

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
                <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>

            {imageUri ? (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                />
            ) : null}

            <TouchableOpacity
                style={styles.button}
                onPress={handleAddProduct}
                disabled={uploading}
            >
                <Text style={styles.buttonText}>
                    {uploading ? 'Uploading...' : 'Add Product'}
                </Text>
            </TouchableOpacity>
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
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export default AddProductScreen;
