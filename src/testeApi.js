import { apiGet } from './api'

async function testar() {
  const lista = await apiGet('/users')
  console.log(lista)
}

testar()
