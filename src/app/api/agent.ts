import axios,{AxiosResponse}from "axios";
import { Roadmap } from "../models/roadmap";
import { store } from "../stores/store";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve,delay)
    })
}

axios.interceptors.response.use(response => {
    return sleep(3000).then(() => {        
        return response;
    }).catch((error ) => {
        console.log(error);
        return Promise.reject(error);
    })
})


axios.interceptors.request.use(
    (config) => {
        const {userStore} = store;
        const {token} = userStore;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach the token to headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url,body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url,body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Roadmaps = {
    list: () => requests.get<Roadmap[]>('/roadmaps'),
}
 
const agent = {
    Roadmaps
}

export default agent;