import axios,{AxiosResponse}from "axios";
import { Roadmap } from "../models/roadmap";
import { store } from "../stores/store";
import { AuditTrail } from "../models/audittrail";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve,delay)
    })
}

axios.interceptors.response.use(response => {
    return sleep(2000).then(() => {        
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
    list: (searchTerm?: string, filter: 'all' | 'draft' | 'not-started' = 'all') => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (filter !== 'all') params.append('filter', filter); // Add the filter parameter if it's not 'all'
        return requests.get<Roadmap[]>(`/roadmaps?${params.toString()}`);
    },    
};

const AuditTrails = {
    list: () => requests.get<AuditTrail[]>('/audittrail') // This assumes there's an endpoint for fetching all audit trails
};

 
const agent = {
    Roadmaps,
    AuditTrails
}

export default agent;