export const BASE_URL = 'https://jsonplaceholder.typicode.com'

export class ApiError extends Error {
  constructor(status, statusText, message) {
    super(message || `${status} ${statusText}`)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
  }
}

export async function requisicao(caminho, opcoes = {}) {
  const { signal, headers, ...resto } = opcoes
  const url = `${BASE_URL}${caminho}`
  const configuracoes = {
    ...resto,
    headers: { 'Content-Type': 'application/json', ...headers },
    ...(signal ? { signal } : {}),
  }
  if (opcoes.body) {
    configuracoes.body = JSON.stringify(opcoes.body)
  }
  const resp = await fetch(url, configuracoes)
  if (!resp.ok) {
    throw new ApiError(resp.status, resp.statusText)
  }
  if (resp.status === 204) return null
  return await resp.json()
}

export async function apiGet(caminho, opcoes = {}) {
  return requisicao(caminho, { method: 'GET', ...opcoes })
}

export async function apiPost(caminho, body, opcoes = {}) {
  return requisicao(caminho, { method: 'POST', body, ...opcoes })
}

export async function apiPut(caminho, body, opcoes = {}) {
  return requisicao(caminho, { method: 'PUT', body, ...opcoes })
}

export async function apiDelete(caminho) {
  return requisicao(caminho, { method: 'DELETE' })
}
