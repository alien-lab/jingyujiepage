import Vue from 'vue'
import axios from 'axios';
Vue.prototype.$http = axios;

let base = 'http://localhost:8080';

export const requestLogin = params => {
  return axios.post(`${base}/login`, params).then(res => res.data);
};

export const getUserList = params => {
  return axios.get(`${base}/user/list`, {params: params});
};

export const getUserListPage = params => {
  return axios.get(`${base}/user/listpage`, {params: params});
};

export const removeUser = params => {
  return axios.get(`${base}/user/remove`, {params: params});
};

export const batchRemoveUser = params => {
  return axios.get(`${base}/user/batchremove`, {params: params});
};

export const editUser = params => {
  return axios.get(`${base}/user/edit`, {params: params});
};

export const addUser = params => {
  return axios.get(`${base}/user/add`, {params: params});
};
//添加artwork
export const addArtwork = params => {
  return axios.post(`${base}/artwork/addArtwork`, {params: params});
};
//不分页获取所有artwork
export const getArtwork = params => {
  return axios.get(`${base}/artwork/getAll`, {params: params});
};
//分页获取artwork
export const getArtworkPage = params => {
  return axios.get(`${base}/artwork/getAllByPage/`+params.index+`-`+params.size);
};
