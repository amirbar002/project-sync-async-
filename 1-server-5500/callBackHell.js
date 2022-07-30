$('#getHell').on('click', getData)

function getData() {
  console.log('request is sending now')
  const ul = $('#stores')
  ul.html('')
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/stores',
    dataType: 'json',
    success: function (stores) {
      console.log(stores)
      console.log('stores')
      for (const store of stores) {
        $.ajax({
          type: 'POST',
          url: 'http://localhost:3000/bulk-departments',
          data: JSON.stringify(store.departments),
          contentType: 'application/json; charset=utf-8',
          success: function (departments) {
            console.log('departments')
            console.log(departments)
            for (const department of departments) {
              $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/bulk-products',
                data: JSON.stringify(department.products),
                contentType: 'application/json; charset=utf-8',
                success: function (products) {
                  console.log('products')
                  console.log(products)
                  for (const product of products) {
                    console.log('product')
                    console.log(product)
                    ul.append(`
                    <li id="list">
                    Store: <b>${store.name}</b>,
                    Department: <b>${department.name},
                    products: ${product.name}
                    </li>
                    `)
                  }
                },
                error: function (error) {
                  console.log('products')
                  console.log(error.status)
                },
              })
            }
          },
          error: function (error) {
            console.log('departments')
            console.log(error.status)
          },
        })
      }
    },
    error: function (error) {
      console.log('stores')
      console.log(error.status)
    },
  })
}
