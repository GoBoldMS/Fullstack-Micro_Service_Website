import axios from "axios";

const Api = ({ req }) => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: "http://www.ticketing-app-mok-prod.xyz/api",
            headers: req.headers
        });
    } else {
        return axios.create({
            baseURL: '/'
        })
    }
};

export default Api;

 