const axios = require('axios');
const API_URL = 'https://api-blog-production.up.railway.app/api/';


let config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

const getBlog = (slug) => consume(`post/${slug}`);
const getBlogs = () => consume("post");
const getRecentBlogs = () => consume("recents");
const getCategories = () => consume("categories");
const getTags = () => consume("tags");

function search(title = 0, category = 0, tag = 0){
    const question = "?";
    const amp = "&";

    let params = question;

    if(title != 0 && title != undefined) {
        params  += params.charAt(params.length - 1) == "?" ? `title=${title}` : `${amp}title=${title}`;
    }
    if(category != 0 && category != undefined) {
        params  += params.charAt(params.length - 1) == "?" ? `category=${category}` : `${amp}category=${category}`;
    }
    if(tag != 0 && tag != undefined) {
        params  += params.charAt(params.length - 1) == "?" ? `tag=${tag}` : `${amp}tag=${tag}`;
    }

    return consume(`search${params}`);
}

const getComments = (id) => consume(`comments/${id}`);

const commented = (id, comment) => post(`comments/${id}`, comment);

function consume(url){
    return new Promise((resolve, reject) => {
        axios.get(API_URL + url, config)
           .then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                reject(error);
            });
});
}

function post(url, data){
    return new Promise((resolve, reject) => {
        axios.post(API_URL + url, data, config)
           .then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                reject(error);
            });
});
}

module.exports = {
    getBlog: getBlog,
    getRecentBlogs: getRecentBlogs,
    getBlogs: getBlogs,
    search: search,
    getCategories,
    getTags,
    getComments,
    commented
}