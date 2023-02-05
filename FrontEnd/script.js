import { adminMode } from './modules/admin.js'

const userToken = localStorage.getItem('token')

const gallery = document.querySelector('.gallery')
const filters = document.querySelector('#filters')

export const init = async () => {
  //Fetching works
  const worksResponse = await fetch(`http://localhost:5678/api/works`)
  const works = await worksResponse.json()

  displayFilters(works)
  displayGallery(works, 'default')

  const userToken = localStorage.getItem('token')
  if (userToken) {
    adminMode()
  }
}

function displayFilters(works) {
  // filters the dataset of categories to keep only those present in the works
  let worksCategoryWithDupplicate = []
  works.forEach((work) => {
    worksCategoryWithDupplicate.push(work.category.name)
  })
  const worksCategory = [...new Set(worksCategoryWithDupplicate)]

  // display filters buttons
  filters.innerHTML += `
  <input  class="filter" type="radio" name="filter" value="default" id="default" checked />
  <label for="default">Tous</label>`
  worksCategory.forEach((categorie) => {
    filters.innerHTML += `<input class="filter" type="radio"
    value="${categorie.split(' ')[0]}"
    name="filter"
    id="${categorie.split(' ')[0]}"/>
    <label for="${categorie.split(' ')[0]}">${categorie}</label>  `
  })
  // filter and update the data displayed when clicking on one of the "filter" buttons
  document.querySelectorAll('.filter').forEach((filterButton) =>
    filterButton.addEventListener('click', () => {
      displayGallery(works, filterButton.value)
    })
  )
}

function displayGallery(works, filter) {
  gallery.innerHTML = ''
  if (filter != 'default') {
    // filter categories data to keep only the categorie contained in the name attribute of the html element
    const worksFiltered = works.filter(
      (work) => work.category.name.split(' ')[0] == filter.split(' ')[0]
    )
    worksFiltered.forEach((work) => {
      gallery.innerHTML += `
      <figure><img src=${work.imageUrl} class="project-${work.id}" alt="${work.title}" crossorigin="anonymous"/>
      <figcaption>${work.title}</figcaption>
      </figure>`
    })
  } else {
    // default behavior, items from all categories are displayed
    works.forEach((work) => {
      gallery.innerHTML += `<figure><img src=${work.imageUrl} class="project-${work.id}" alt="${work.title}" crossorigin="anonymous"/>
      <figcaption>${work.title}</figcaption>
      </figure>`
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
