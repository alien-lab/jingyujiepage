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
//修改artwork
export const updateArtwork = params => {
  return axios.post(`${base}/artwork/updateArtwork`, {params: params});
};
//删除一条artwork记录
export const delArtworkSubmit = params => {
  return axios.delete(`${base}/artwork/deleteArtwork/` + params.id);
};
//批量删除artwork
export const batchDelArtworkSubmit = params => {
  return axios.delete(`${base}/artwork/batchDeleteArtwork/` + params.ids);
};
//不分页获取所有artwork
export const getArtwork = params => {
  return axios.get(`${base}/artwork/getAll`, {params: params});
};
//分页获取artwork
export const getArtworkPage = params => {
  return axios.get(`${base}/artwork/getAllByPage/` + params.index + `-` + params.size);
};
//根据name模糊分页查询artwork
export const getArtworkNameLikePage = params => {
  return axios.get(`${base}/artwork/getArtworkByNameLikePage/` + params.likeName + `-` + params.index + `-` + params.size);
};
//根据artwork查询detail
export const getDetailByArtwork = params => {
  return axios.get(`${base}/detail/getDetailByArtwork/` + params.artworkId);
};
//添加一条艺术品详情记录
export const addDetail = params => {
  return axios.post(`${base}/detail/addArtworkDetail/`, {params: params});
};
//删除一条detail记录
export const delDetailSubmit = params => {
  return axios.delete(`${base}/detail/deleteDetail/` + params.id);
};
//修改detail状态
export const updateDetail = params => {
  return axios.post(`${base}/detail/updateDetail`, {params: params});
};

