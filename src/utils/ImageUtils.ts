export const convertImageAsArrayBuffer = (base64String: string): ArrayBuffer => {
    const binary = atob(base64String); // Chuyển Base64 thành binary
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
};

export const getImageAsBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary); // Chuyển về Base64 để hiển thị
};