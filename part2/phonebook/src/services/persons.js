import axios from 'axios'
const baseUrl = "api/persons"

const getAll = () =>{
    return axios.get(baseUrl)
}

const create = newPerson => {
    return axios.post(baseUrl, newPerson)
}

const deletePerson = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const changeNumber = changedperson => {
    return axios.put(`${baseUrl}/${changedperson.id}`, changedperson)
}

export default {getAll, create, deletePerson, changeNumber}