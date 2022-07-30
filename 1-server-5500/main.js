const getSync = document.querySelector('#getSync')
const getAsync = document.querySelector('#getAsync')
const postSync = document.querySelector('#postSync')
const postAsync = document.querySelector('#postAsync')
const test = document.querySelector('#test')

getSync.addEventListener('click', getDataSync)
getAsync.addEventListener('click', getDataAsync)
postSync.addEventListener('click', postDataSync)
postAsync.addEventListener('click', postDataAsync)
test.addEventListener('click', testLogger)


function getDataSync() {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://localhost:3000/stores-timeout', false)
  xhr.send()
  if (xhr.status === 200) {
    addStoresToHtml(JSON.parse(xhr.response))
  } else {
    console.log(xhr.status)
  }
}

function getDataAsync() {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', 'http://localhost:3000/stores-timeout')
  xhr.onload = function () {
    if (xhr.status === 200) {
      addStoresToHtml(JSON.parse(xhr.response))
    } else {
      console.log(xhr.status)
    }
  }
  xhr.send()
}

function postDataSync() {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost:3000/stores-timeout', false)
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
  xhr.send(JSON.stringify(stores))
  console.log('object')
  if (xhr.status === 200) {
    addStoresToHtml(JSON.parse(xhr.response))
  } else {
    console.log(xhr.status)
  }
}

function postDataAsync() {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', 'http://localhost:3000/stores-timeout')
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
  xhr.onload = function () {
    if (xhr.status === 200) {
      addStoresToHtml(JSON.parse(xhr.response))
    } else {
      console.log(xhr.status)
    }
  }
  xhr.send(JSON.stringify(stores))
  
}

function testLogger() {
  console.log('Test Running...')
}

function addStoresToHtml(stores) {
  console.log(stores)
  const ul = document.querySelector('#stores')
  ul.innerHTML = ''
  for (const store of stores) {
    const li = document.createElement('li')
    // li.innerHTML = `Store Name: <b>${user.first_name} ${user.last_name}</b>, Email: <b>${user.email}</b>`
    li.innerHTML = store.name
    ul.appendChild(li)
  }
}

const stores = [
  {
    "name": "Shufersal",
    "departments": [1, 7]
  },
  {
    "name": "Castro",
    "departments": [2, 3, 5, 6]
  },
  {
    "name": "Zara",
    "departments": [4, 8]
  }
]