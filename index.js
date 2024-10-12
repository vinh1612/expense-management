import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

// For Web
if (typeof document !== 'undefined') {
    const rootTag = document.getElementById('root') || document.getElementById('main');
    AppRegistry.runApplication(appName, { initialProps: {}, rootTag });
}
