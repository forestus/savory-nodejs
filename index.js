import express from 'express'
import savory from './savory.json'
import * as fs from 'fs'
import cors from 'cors'
// SERVER CONFIG
const server = express()
const PORT = 3000

server.use(cors())
server.use(express.json())
// ROUTES
server.get('/', (req, res) => {
  res.status(200).json({
    status: 'on',
    time: new Date(),
  })
})
server.get('/savory', async (req, res) => {
  const { savory } = await JSON.parse(fs.readFileSync('./savory.json'))
  res.status(200).json(savory)
})
server.get('/savory/:id', async (req, res) => {
  let { id } = req.params
  id = Number(id)
  // le o arquivo e converte de binario para objeto
  let parsedData = await JSON.parse(fs.readFileSync('./savory.json'))
  // percorre todos os itens de savory e quando o id enviado no params for igual a algum desses ids percorridos
  // ele sobreescreve o savory passando a atualização dos dados enviados no body da requisição
  // só é sobreescrevido oque foi passado no body
  const [savory] = parsedData.savory
    .map((sav) => {
      if (sav.id === id) {
        return sav
      }
    })
    .filter((el) => el !== undefined)
  if (!savory) {
    res.status(404).json({ message: 'Savory Not Found!' })
  }
  res.status(200).json(savory)
})
server.post('/savory', async (req, res) => {
  // parametros do corpo da requisição
  const { savory } = req.body
  // verifica se foi passado um savory e se nao for ele retorna um badrequest
  if (!savory) {
    return res.status(400).json({ message: 'voce deve enviar um salgado!' })
  }
  // le o arquivo e converte de binario para objeto
  let parsedData = JSON.parse(fs.readFileSync('./savory.json'))
  // cria um objeto com id inicial de 0 e passa os dados de criação para o objeto com spread operator
  let saveData = {
    id: 0,
    ...savory,
  }
  // caso o objeto contido no json não tenha itens no savory ele envia o recebido com id inicial 0
  if (parsedData.savory.length === 0) {
    parsedData.savory.push(saveData)
  } else {
    // encontra o ultimo id inputado na array savory
    saveData.id = parsedData.savory[parsedData.savory.length - 1].id
    // aumenta o ultimo id em +1 dentro do objeto que será salvo
    saveData.id++
    parsedData.savory.push(saveData)
  }
  // grava no objeto savory na raiz do projeto o objeto sobreescrevido com os dados recebidos na requisição
  fs.writeFileSync('./savory.json', JSON.stringify(parsedData))
  // envia os dados contidos no objeto da raiz como resposta a requisição.
  res.status(201).json(parsedData)
})
server.put('/savory/:id', async (req, res) => {
  // parametros do link da requisição
  const { savory } = req.body
  let { id } = req.params
  id = Number(id)
  // le o arquivo e converte de binario para objeto
  let parsedData = await JSON.parse(fs.readFileSync('./savory.json'))
  // percorre todos os itens de savory e quando o id enviado no params for igual a algum desses ids percorridos
  // ele sobreescreve o savory passando a atualização dos dados enviados no body da requisição
  // só é sobreescrevido oque foi passado no body
  parsedData.savory = parsedData.savory.map((sav) => {
    if (sav.id === id) {
      return {
        id,
        name: savory.name || sav.name,
        price: savory.price || sav.price,
      }
    }
    return sav
  })
  // grava no objeto savory na raiz do projeto o objeto sobreescrevido com os dados recebidos na requisição
  fs.writeFileSync('./savory.json', JSON.stringify(parsedData))
  // envia os dados contidos no objeto da raiz como resposta a requisição.
  res.status(200).json(parsedData)
})
server.delete('/savory/:id', async (req, res) => {
  let { id } = req.params
  id = Number(id)
  // le o arquivo e converte de binario para objeto
  let parsedData = await JSON.parse(fs.readFileSync('./savory.json'))
  // percorre todos os itens de savory e quando o id enviado no params for igual a algum desses ids percorridos
  // ele sobreescreve o savory passando a atualização dos dados enviados no body da requisição
  // só é sobreescrevido oque foi passado no body
  const [index] = parsedData.savory
    .map((sav, i) => {
      if (sav.id === id) {
        return i
      }
    })
    .filter((el) => el !== undefined)
  // pega o objeto savory dentro da lista que será deletado
  const deletedSavory = parsedData.savory[index]
  // caso não encontrado envia uma mensagem de "Não Encontrado!"
  if (!deletedSavory) {
    res.status(404).json({ message: 'Savory Not Found!' })
  }
  // caso o index seja igual a 0 ou maior ele remove o item da lista de savory
  if (index > -1) {
    parsedData.savory.splice(index, 1)
  }
  // grava no objeto savory na raiz do projeto o objeto sobreescrevido com os dados recebidos na requisição
  fs.writeFileSync('./savory.json', JSON.stringify(parsedData))
  // envia os dados contidos no objeto da raiz como resposta a requisição.
  res.status(200).json(deletedSavory)
})
// SERVER START
server.listen(PORT, () => {
  console.log(`Server Listening on ${PORT}`)
})
