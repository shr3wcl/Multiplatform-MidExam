import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const selectImage = (onSuccess) => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.assets) {
            const imageUri = response.assets[0].uri;
            const imageRef = storage().ref(`/products/${response.assets[0].fileName}`);

            imageRef.putFile(imageUri)
                .then(() => {
                    console.log('Image uploaded!');
                    imageRef.getDownloadURL().then((url) => {
                        onSuccess(url);
                    });
                });
        }
    });
};

export default selectImage;
