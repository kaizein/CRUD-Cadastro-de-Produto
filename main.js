'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_produto", JSON.stringify(dbProduto))

// CRUD - create read update delete

// CRUD - Read
const readProduto = () => getLocalStorage()

// CRUD - Create
const createProduto = (produto) => {
    const dbProduto = getLocalStorage()
    dbProduto.push (produto)
    setLocalStorage(dbProduto)
}

// CRUD - Update
const updateproduto = (index, produto) => {
    const dbProduto = readProduto()
    dbProduto[index] = produto
    setLocalStorage(dbProduto)
}

// CRUD - Delete
const deleteproduto = (index) => {
    const dbProduto = readProduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

const isValidFields = () => {
    return document.getElementById("form").reportValidity()
}

// Interação com layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveproduto = () => {
    if (isValidFields()){
        const produto = {
            produto: document.getElementById('produto').value,
            codigoProduto: document.getElementById('codigoProduto').value,
            descricaoProduto: document.getElementById('descricaoProduto').value,
            valorProduto: document.getElementById('valorProduto').value
        }
        const index = document.getElementById('produto').dataset.index
        if (index == 'new') {
            createProduto(produto)
            updateTable()
            closeModal()
        } else {
            updateproduto(index, produto)
            updateTable()
            closeModal()
        }
        
    }
}

const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${produto.produto}</td>
    <td>${produto.codigoProduto}</td>
    <td>${produto.descricaoProduto}</td>
    <td>R$${produto.valorProduto}</td>
    <td>
        <button type="button" class="button green"  id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
    `
    document.querySelector('#tableProduto>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProduto = readProduto()
    clearTable()
    dbProduto.forEach(createRow)
}

const fillFields = (produto) => {
    document.getElementById('produto').value = produto.produto
    document.getElementById('codigoProduto').value = produto.codigoProduto
    document.getElementById('descricaoProduto').value = produto.descricaoProduto
    document.getElementById('valorProduto').value = produto.valorProduto
    document.getElementById('produto').dataset.index = produto.index
}

const editproduto = (index) => {
    const produto = readProduto()[index]
    produto.index = index
    fillFields(produto)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        
        if (action == 'edit') {
            editproduto(index)
        } else {
            const produto = readProduto()[index]
            const response = confirm (`Deseja realmente excluir o produto ${produto.produto}`)
            if (response) {
                deleteproduto(index)
                updateTable()
            }
            
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarProduto').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveproduto)

document.querySelector('#tableProduto>tbody').addEventListener('click', editDelete)