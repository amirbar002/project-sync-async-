$('#getFatch').on('click', getData)

function getData() {
  console.log('request is sending now')
  const ul = $('#stores')
  ul.html('')
  const stores = []
  const departments = []
  generateFatch('GET', 'http://localhost:3000/stores')
    .then(function (response) {
      return response.json()
    })
    .then(function (response) {
      const promises = []
      for (const store of response) {
        stores.push(store)
        promises.push(
          generateFatch(
            'POST',
            'http://localhost:3000/bulk-departments',
            store.departments
          )
        )
      }
      return Promise.allSettled(promises)
    })
    .then(function (responses) {
      return jsonAll(responses)
    })
    .then(function (responseArr) {
      const promises = []
      for (const key in responseArr) {
        if (responseArr[key].status === 'fulfilled') {
          const storeDepartments = responseArr[key].value
          for (const department of storeDepartments) {
            department.store = stores[key].name
            department.productsName = []
            departments.push(department)
            promises.push(
              generateFatch(
                'POST',
                `http://localhost:3000/bulk-products`,
                department.products
              )
            )
          }
        } else {
          console.log(responseArr[key].status)
          console.log(responseArr[key].reason)
        }
      }
      return Promise.allSettled(promises)
    })
    .then(function (responses){
      return jsonAll(responses)
    })
    .then(function (responseArr) {
      for (const key in responseArr) {
        if (responseArr[key].status === 'fulfilled') {
          for (const products of responseArr[key].value) {
            departments[key].productsName.push(products.name)
          }

          ul.append(`
            <li id="list">
            Store: <b>${departments[key].store}</b>,
            <br>
            Department: <b>${departments[key].name}</b>,
            <br>
            products: <b>${departments[key].productsName}<b>
            <br>
            </li>

  `)
        } else {
          console.log(responseArr[key].status)
          console.log(responseArr[key].reason)
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
}

function jsonAll(responses) {
  const promises = []
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      promises.push(response.value.json())
    } else {
      console.error(response.status)
      console.error(response.reason)
    }
  }

  return Promise.allSettled(promises)
}

function generateFatch(method, url, data = null) {
  const fetchObj = {
    method,
  }

  if (method === 'POST') {
    fetchObj.headers = { 'Content-Type': 'application/json; charset=utf-8' }
    if (data) {
      fetchObj.body = JSON.stringify(data)
    }
  }

  return fetch(url, fetchObj)
}
