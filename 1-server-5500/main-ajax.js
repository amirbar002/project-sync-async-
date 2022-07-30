$('#getAjax').on('click', function () {
  console.log('request is sending now')

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/stores-timeout',
    dataType: 'json',
    success: function (data) {
      addStoresToHtml(data)
    },
    error: function (err) {
      console.log(err)
      console.log(err.status)
    },
  })
})


$('#postAjax').on('click', function () {
  console.log('request is sending now')

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/stores-timeout',
    data: JSON.stringify(stores),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      addStoresToHtml(data)
    },
    error: function (err) {
      console.log(err)
      console.log(err.status)
    },
  })
})



const stores = [
  {
    name: 'Shufersal',
    departments: [1, 7],
  },
  {
    name: 'Castro',
    departments: [2, 3, 5, 6],
  },
  {
    name: 'Zara',
    departments: [4, 8],
  },
]


$('#test').on('click', function (){
  console.log('Test Running...')
}
)  


function addStoresToHtml(stores) {
  console.log(stores)
  const ul = document.querySelector('#stores')
  ul.innerHTML = ''
  for (const store of stores) {
    const li = document.createElement('li')
    li.innerHTML = store.name
    ul.appendChild(li)
  }
}
