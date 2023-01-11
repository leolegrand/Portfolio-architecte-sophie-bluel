const API = 'http://localhost:5678/api/'

const portfolio = document.querySelector('#portfolio')
const gallery = document.querySelector('.gallery')
const filters = document.querySelector('#filters')

const worksFetch = fetch(`${API}works`).then((response) => response.json())
const categoriesFetch = fetch(`${API}categories`).then((response) =>
  response.json()
)
const fetchedData = Promise.all([worksFetch, categoriesFetch])
fetchedData.then((response) => {
  let worksData = response[0]
  let categoriesData = response[1]

  createFilters(categoriesData)
  createGallery(worksData, 'default')

  document.querySelectorAll('.filter').forEach((item) =>
    item.addEventListener('click', () => {
      createGallery(worksData, item.value)
    })
  )
})

function createFilters(categories) {
  filters.innerHTML += `<input  class="filter" type="radio" name="filter" value="default" id="default" checked /><label for="default">Tous</label>`
  categories.forEach((categorie) => {
    filters.innerHTML += `<input class="filter" type="radio" value="${
      categorie.name.split(' ')[0]
    }" name="filter" id="${categorie.name.split(' ')[0]}" /><label for="${
      categorie.name.split(' ')[0]
    }">${categorie.name}</label>  `
  })
}

function createGallery(works, filter) {
  gallery.innerHTML = ''
  if (filter != 'default') {
    const worksFiltered = works.filter(
      (work) => work.category.name.split(' ')[0] == filter.split(' ')[0]
    )
    worksFiltered.forEach((work) => {
      gallery.innerHTML += `<figure><img src=${work.imageUrl} alt="${work.title}" crossorigin="anonymous"/><figcaption>${work.title}</figcaption></figure>`
    })
  } else {
    works.forEach((work) => {
      gallery.innerHTML += `<figure><img src=${work.imageUrl} alt="${work.title}" crossorigin="anonymous"/><figcaption>${work.title}</figcaption></figure>`
    })
  }

  // cascade css animation
  const figures = document.body.querySelectorAll('.gallery figure')
  for (let index = 0; index < figures.length; index++) {
    figures[index].style.animation = `appear 600ms forwards`
    figures[index].style.animationDelay = `${index}00ms`
  }
}

const userToken = localStorage.getItem('token')
const log = document.body.querySelector('#log')

if (userToken) {
  log.innerHTML = `<button class="bold">logout</button>`
  const logButton = document.body.querySelector('#log button')
  logButton.addEventListener('click', () => {
    window.location.reload(), localStorage.clear()
  })
} else {
  log.innerHTML = `<a href="login.html">login</a>`
}
