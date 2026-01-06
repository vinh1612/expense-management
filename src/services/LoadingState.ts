type Callback = (isLoading: boolean) => void;

class LoadingState {
    private static isLoading = false;
    private static subscribers: Callback[] = [];

    static get(): boolean {
        return LoadingState.isLoading;
    }

    static subscribe(callback: Callback) {
        LoadingState.subscribers.push(callback);
        return () => {
            LoadingState.subscribers = LoadingState.subscribers.filter(cb => cb !== callback);
        };
    }

    static set(value: boolean) {
        LoadingState.isLoading = value;
        LoadingState.subscribers.forEach(cb => cb(value));
    }
}

export default LoadingState;
