import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProductListScreen from './src/screens/ProductListScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import DetailProductScreen from './src/screens/DetailProductScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{ title: 'Product List' }}
        />

        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: 'Add Product' }}
        />

        <Stack.Screen
          name="EditProduct"
          component={EditProductScreen}
          options={{ title: 'Edit Product' }}
        />

        <Stack.Screen
          name="DetailProduct"
          component={DetailProductScreen}
          options={{ title: 'Product Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
