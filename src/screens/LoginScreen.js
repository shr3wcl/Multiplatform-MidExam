import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => navigation.navigate('ProductList'))
            .catch((err) => setError(err.message));
    };

    return (
        <View>
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            {error ? <Text>{error}</Text> : null}
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

export default LoginScreen;
