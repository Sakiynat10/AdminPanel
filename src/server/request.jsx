import axios from "axios";

const request = axios.create({
    baseURL:'https://65e577fad7f0758a76e66f36.mockapi.io/api/v1/',
    timeout:10000
});

export default request;