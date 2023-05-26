import axios from 'axios'

//https://economia.awesomeapi.com.br/json/all/EUR-BRL

/*
rota para dolar -> real
 > all/EUR-BRL
*/

const api = axios.create({
    baseURL: 'https://economia.awesomeapi.com.br/json/'
})

export default api