$('#getPromiseAll').on('click', getData)
function getData() {
  console.log('request is sending now')
  const ul = $('#stores')
  ul.html('')
  const stores = []
  const departments = []
  promisifyAgax('GET', 'http://localhost:3000/stores')
    .then(function (response) {
      const promises = []
      for (const store of response){
        stores.push(store)
        promises.push(
          promisifyAgax(
            'POST',
            'http://localhost:3000/bulk-departments',
            store.departments
          )
        )
      }
      return Promise.allSettled(promises)
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
              promisifyAgax(
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

function promisifyAgax(type, url, data = null) {
  return new Promise(function (resolve, reject) {
    const ajaxObj = {
      type,
      url,
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        reject(error)
      },
    }

    if (type === 'POST') {
      ajaxObj.contentType = 'application/json; charset=utf-8'
      if (data) {
        ajaxObj.data = JSON.stringify(data)
      }
    }

    $.ajax(ajaxObj)
  })
}
