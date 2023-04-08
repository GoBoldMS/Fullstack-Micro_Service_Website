import axios from "axios";

const Api = ({ req }) => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: "www.ticketing-app-mok-prod.xyz/",
            headers: req.headers
        });
    }
    else {
        return axios.create({
            baseURL: '/'
        })
    }
};


export default Api;