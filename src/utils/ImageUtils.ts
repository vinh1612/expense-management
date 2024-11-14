import { Image, ImageRequireSource } from 'react-native';

export const convertCategorySourceToBase64 = async (image: ImageRequireSource) => {
    try {
        const imageUri = Image.resolveAssetSource(image).uri;
        const base64Data = await convertImageToBase64(imageUri);
        return base64Data;
    } catch (error) {
        console.error('Error converting image to Base64:', error);
    }
}

export const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
        // Fetch the image as a blob
        const response = await fetch(uri);
        const blob = await response.blob();
        // Read the blob as a Base64 string
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string); // Base64 string
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);  // Convert blob to Base64
        });
    } catch (error: any) {
        throw new Error(`Failed to fetch image and convert to Base64: ${error.message}`);
    }
}
