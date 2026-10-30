import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete } from './api'

function App() {
  const [usuarios, setUsuarios] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  function tratarErro(e) {
    if (e.name === 'ApiError' && e.status === 404) {
      setErro('Recurso não encontrado')
    } else if (e.name === 'ApiError' && e.status >= 500) {
      setErro('Erro no servidor')
    } else {
      setErro('Falha de rede')
    }
  }

  useEffect(() => {
    const controle = new AbortController()
    async function buscarUsuarios() {
      try {
        const data = await apiGet('/users', { signal: controle.signal })
        setUsuarios(data)
        setCarregando(false)
      } catch (e) {
        if (e.name !== 'AbortError') {
          tratarErro(e)
          setCarregando(false)
        }
      }
    }
    buscarUsuarios()
    return () => controle.abort()
  }, [])

  function limparFormulario() {
    setNome('')
    setEmail('')
    setEditandoId(null)
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    try {
      if (editandoId === null) {
        const criado = await apiPost(
          '/users',
          { name: nome, email: email },
          { headers: { 'X-Custom': 'aula07' } }
        )
        setUsuarios([...usuarios, { ...criado, id: Date.now() }])
      } else {
        const atualizado = await apiPut(`/users/${editandoId}`, { name: nome, email: email })
        setUsuarios(usuarios.map(u => (u.id === editandoId ? atualizado : u)))
      }
      limparFormulario()
    } catch (err) {
      tratarErro(err)
    }
  }

  function editar(usuario) {
    setEditandoId(usuario.id)
    setNome(usuario.name)
    setEmail(usuario.email)
  }

  async function excluir(id) {
    setErro('')
    try {
      await apiDelete(`/users/${id}`)
      setUsuarios(usuarios.filter(u => u.id !== id))
    } catch (err) {
      tratarErro(err)
    }
  }

  async function testar404() {
    setErro('')
    try {
      await apiGet('/users/999')
    } catch (err) {
      tratarErro(err)
    }
  }

  async function testar500() {
    setErro('')
    try {
      await apiPut('/users/999', { name: 'teste' })
    } catch (err) {
      tratarErro(err)
    }
  }

  return (
    <main>
      <h1>CRUD de Usuários</h1>

      <form onSubmit={salvar}>
        <input
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit">{editandoId === null ? 'Criar' : 'Salvar'}</button>
        {editandoId !== null && (
          <button type="button" onClick={limparFormulario}>Cancelar</button>
        )}
      </form>

      <p>
        <button onClick={testar404}>Testar 404</button>
        <button onClick={testar500}>Testar 500</button>
      </p>

      {erro !== '' && <p style={{ color: 'red' }}>{erro}</p>}

      {carregando && <p>Carregando...</p>}

      <ul>
        {usuarios.map(u => (
          <li key={u.id}>
            {u.name} — {u.email}{' '}
            <button onClick={() => editar(u)}>Editar</button>
            <button onClick={() => excluir(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
