import axios,{AxiosResponse}from "axios";
import { Roadmap } from "../models/roadmap";
import { store } from "../stores/store";
import { AuditTrail } from "../models/audittrail";
import { User } from "../models/user";
import { CreateRoadmapData } from "../models/create/createRoadmap";

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
    list: (searchTerm?: string, filter: 'all' | 'draft' | 'not-started'| 'in-progress' | 'completed' = 'all') => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (filter !== 'all') params.append('filter', filter); // Add the filt | 'in-progress' | 'completed'er parameter if it's not 'all'
        return requests.get<Roadmap[]>(`/roadmaps?${params.toString()}`);
    },     
    details: (id: string) =>
        requests.get<Roadmap>(`/roadmaps/${id}`),
    create: (data: CreateRoadmapData) => {
        console.log('Data being sent to create roadmap = ', JSON.stringify(data, null, 2)); // Log the data
        return requests.post<Roadmap>('/roadmaps', data);  // Send the nested roadmap object
    }
    
    

};

const AuditTrails = {
    list: (
        searchTerm?: string,
        userFilter?: string,
        startDate?: Date,
        endDate?: Date,
        page: number = 1,
        pageSize: number = 6
    ) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (userFilter) params.append('userFilter', userFilter);
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        // Update the type to match the backend result structure
        return requests.get<{ totalCount: number; items: AuditTrail[] }>(`/audittrail?${params.toString()}`);
    }
};


const Users = {
    list: () => requests.get<User[]>('/users'), // Adjust the endpoint if necessary
};

 
const agent = {
    Roadmaps,
    AuditTrails,
    Users
}



export default agent;