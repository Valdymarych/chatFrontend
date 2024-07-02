import axios from "axios"
import config from "../config";
let instance = axios.create({
    baseURL: config.axiosBaseURL,
})

let headers = {headers:{}}

export let groupAPI = {
    getGroups(){
        return instance.get("/groups",headers).then(res=>res.data)
    },
    createGroup(name) {
        return instance.post(`/groups`,{name:name},headers).then( res=>res.data );
    },
    deleteGroup(groupId) {
        return instance.delete(`/groups/${groupId}`,headers).then( res=>res.data );
    },
    joinGroup(joinLink) {
        return axios.get(joinLink,headers).then( res=>res.data );
    }
}

export let messagesAPI = {
    getMessages(groupId) {
        return instance.get(`/groups/${groupId}`,headers).then( res=>res.data );
    },
    postMessage(groupId,type,payload) {
        return instance.post(`/groups/${groupId}`,{type:type,payload:payload},headers).then( res=>res.data );
    }
}


export let userAPI = {
    register(email,password,name) {
        return instance.post("/user/registration",{email,password,name},headers).then( res=>{
            let data=res.data
            localStorage.setItem("token",data.token)
            headers.headers.Authorization=`Bearer ${data.token}`
            return data
        });
    },
    login(email,password) {
        return instance.post("/user/login",{email,password},headers).then( res=>{
                let data=res.data
                localStorage.setItem("token",data.token)
                headers.headers.Authorization=`Bearer ${data.token}`
                return data
            });
    },
    auth() {
        if (localStorage.getItem('token')){
            return instance.get("/user/auth", {headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}}).then( res=>{
                let data=res.data
                headers.headers.Authorization=`Bearer ${localStorage.getItem("token")}`
                return data
            });
        } else {
            return {done:false,message:"LOGIN FIRST"}
        }
    },
    logout() {
        localStorage.removeItem("token");
        headers.Authorization=undefined;
    }
}

export let fileAPI = {
    async upload(file,onProgress) {
        let formData=new FormData();
        formData.append('file',file);
        return instance.post("/file",formData, {
                ...headers,
                onUploadProgress:progressEvent => {
                    const totalLength = progressEvent.event.lengthComputable ? progressEvent.event.total : progressEvent.event.target.getResponseHeader('content-length') || progressEvent.event.target.getResponseHeader('x-decompressed-content-length');
                    console.log('total ',totalLength)
                    if (progressEvent.lengthComputable) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(progress)
                    }
                }
            },
        ).then( res=>res.data );
    },
}