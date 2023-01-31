import { adminMode } from './modules/admin.js'

const userToken = localStorage.getItem('token')

const gallery = document.querySelector('.gallery')
const filters = document.querySelector('#filters')

export const init = async (updatedWorks) => {
  //Fetching works, updatedWorks is a data set modified by the user, if he is logged in in admin mode
  let works
  if (updatedWorks) {
    works = updatedWorks
  } else {
    const worksResponse = await fetch(`http://localhost:5678/api/works`)
    works = await worksResponse.json()
  }

  //Fetching categories
  const categoriesResponse = await fetch(`http://localhost:5678/api/categories`)
  const categories = await categoriesResponse.json()

  createFilters(categories, works)
  createGallery(works, 'default')

  if (userToken) {
    adminMode(works, categories)
  }
}

function createFilters(categories, works) {
  filters.innerHTML = ``
  filters.innerHTML += `<input  class="filter" type="radio" name="filter" value="default" id="default" checked /><label for="default">Tous</label>`
  categories.forEach((categorie) => {
    filters.innerHTML += `<input class="filter" type="radio" 
    value="${categorie.name.split(' ')[0]}"
    name="filter"
    id="${categorie.name.split(' ')[0]}"/>
    <label for="${categorie.name.split(' ')[0]}">${categorie.name}</label>  `
  })
  // filter and update the data displayed when clicking on one of the "filter" buttons
  document.querySelectorAll('.filter').forEach((filterButton) =>
    filterButton.addEventListener('click', () => {
      createGallery(works, filterButton.value)
    })
  )
}

function createGallery(works, filter) {
  gallery.innerHTML = ''
  if (filter != 'default') {
    // filter categories data to keep only the categorie contained in the name attribute of the html element
    const worksFiltered = works.filter(
      (work) => work.category.name.split(' ')[0] == filter.split(' ')[0]
    )
    worksFiltered.forEach((work) => {
      gallery.innerHTML += `<figure><img src=${work.imageUrl} alt="${work.title}" crossorigin="anonymous"/><figcaption>${work.title}</figcaption></figure>`
    })
  } else {
    // default behavior, items from all categories are displayed
    works.forEach((work) => {
      gallery.innerHTML += `<figure><img src=${work.imageUrl} alt="${work.title}" crossorigin="anonymous"/><figcaption>${work.title}</figcaption></figure>`
    })
  }

  // in the absence of scss to manage cascading animations, an animation has been added so that the elements appear one after the other
  const figures = document.body.querySelectorAll('.gallery figure')
  for (let index = 0; index < figures.length; index++) {
    figures[index].style.animation = `appear 600ms forwards`
    figures[index].style.animationDelay = `${index}00ms`
  }
}

init()
