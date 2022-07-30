$('#getAsyncAwait').on('click', getData)

async function getData() {
  try {
    console.log('request is sending now')
    const ul = $('#stores')
    ul.html('')
    const stores = []
    const departments = []
    const storesRes = await generateFatch('GET', 'http://localhost:3000/stores')
    const storesJsomRes = await storesRes.json()
    const promises = []
    for (const store of storesJsomRes) {
      stores.push(store)
      promises.push(
        generateFatch(
          'POST',
          'http://localhost:3000/bulk-departments',
          store.departments
        )
      )
    }
    const departmentRes = await Promise.allSettled(promises)
    const departmentJsonRes = await jsonAll(departmentRes)

    const promises1 = []
    for (const key in departmentJsonRes) {
      if (departmentJsonRes[key].status === 'fulfilled') {
        const storeDepartments = departmentJsonRes[key].value
        for (const department of storeDepartments) {
          department.store = stores[key].name
          department.productsName = []
          departments.push(department)
          promises1.push(
            generateFatch(
              'POST',
              `http://localhost:3000/bulk-products`,
              department.products
            )
          )
        }
      } else {
        console.log(departmentJsonRes[key].status)
        console.log(departmentJsonRes[key].reason)
      }
    }
    const productsRes = await Promise.allSettled(promises1)
    const productsJsonRes = await jsonAll(productsRes)
    for (const key in productsJsonRes) {
      if (productsJsonRes[key].status === 'fulfilled') {
        for (const products of productsJsonRes[key].value) {
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
  } catch (error) {
    console.log(error)
  }
}

async function jsonAll(responses) {
  const promises = []
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      promises.push(response.value.json())
    } else {
      console.error(response.status)
      console.error(response.reason)
    }
  }

   return await Promise.allSettled(promises)
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
