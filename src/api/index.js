import axios from "axios";

const instance = axios.create({
    baseURL: "/api"
});

function findUser(login) {
    console.log(login);
    return instance.get("/find", {
        params: {
            login,
        }
    });
}

const API = {
    findUser,
};

export default API;
