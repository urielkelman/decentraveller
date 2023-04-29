export type HttpGetRequest = {
    url: string;
    queryParams: { [key: string]: string }
}

class HttpConnector {
    async get<T>(): Promise<T> {
        const { data, status } =
    }
}

export default HttpConnector;