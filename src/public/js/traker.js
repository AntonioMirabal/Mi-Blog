const API_URL = "https://api.ipregistry.co/";
const API_KEY = "ymd1qnafp32h7sgu";
const API_PREFIX = "?key=";

function getIPInfo(ip){
    return fetch(`${API_URL}${ip}${API_PREFIX}${API_KEY}`);
}