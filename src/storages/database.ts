import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const openDatabase = async () => {
    return SQLite.openDatabase({ name: 'ViHoAppData.db', location: 'default' });
};
