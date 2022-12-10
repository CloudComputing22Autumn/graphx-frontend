import axios from "axios";

const instance = axios.create({
    baseURL: "/api"
});

function findUser(login) {
    return instance.get("/find", {
        params: {
            login,
        }
    });
}

function findCommunity(login){
    return instance.get("/community", {
        params:{
            login
        }
    });
}

function findLatentFriends(login){
    return instance.get("/friends", {
        params:{
            login
        }
    });
}

const API = {
    findUser,
    findCommunity,
    findLatentFriends
};

export default API;
