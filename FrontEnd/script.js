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

// -- || ADMIN / LOGIN MODE || -- //

const userToken = localStorage.getItem('token')
const log = document.body.querySelector('#log')
const headerPortfolio = document.body.querySelector('#header-portfolio')
const introductionArticle = document.body.querySelector('#introduction article')
const introductionFigure = document.body.querySelector('#introduction figure')

const editIcon = (color) => `<svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.90827 5.6194L7.0677 7.45996C6.3896 8.13807 5.70762 8.81617 5.03339 9.50203C4.87452 9.66477 4.7544 9.88177 4.7079 10.0949C4.46378 11.2147 4.22741 12.3346 3.99104 13.4544L3.8593 14.0744C3.7973 14.3766 3.87867 14.6789 4.08404 14.8842C4.24291 15.0431 4.46378 15.1322 4.69627 15.1322C4.76214 15.1322 4.82802 15.1245 4.89389 15.1129L5.57587 14.9695C6.66084 14.7409 7.74968 14.5084 8.83465 14.2836C9.08652 14.2294 9.29963 14.117 9.48175 13.9349C12.5274 10.8854 15.5731 7.8397 18.6187 4.79792C18.8435 4.57318 18.9675 4.30581 18.9985 3.97645C19.0023 3.9222 18.9985 3.86795 18.9868 3.81758C18.9675 3.74008 18.952 3.65871 18.9326 3.58121C18.89 3.38359 18.8435 3.15885 18.7505 2.94185C18.1809 1.63989 17.2354 0.709921 15.9412 0.186812C15.6816 0.0821901 15.4065 0.0473162 15.1662 0.0163172L15.1003 0.00856739C14.7516 -0.0340563 14.4339 0.0821901 14.1587 0.361182C12.415 2.11263 10.6597 3.86795 8.90827 5.6194ZM14.9725 0.942414C14.9802 0.942414 14.9841 0.942414 14.9918 0.942414L15.0577 0.950164C15.2592 0.973413 15.4452 0.996662 15.5924 1.05866C16.6464 1.4849 17.4214 2.24437 17.8903 3.31384C17.9445 3.43784 17.9794 3.59671 18.0142 3.76333C18.0259 3.82533 18.0414 3.88732 18.053 3.94932C18.0375 4.01907 18.0104 4.06557 17.9561 4.11594C14.9066 7.15772 11.8609 10.2073 8.81527 13.2529C8.7649 13.3033 8.7184 13.3265 8.64865 13.342C7.55981 13.5707 6.47484 13.7993 5.386 14.0279L4.81252 14.148L4.92102 13.6404C5.15738 12.5244 5.39375 11.4046 5.63399 10.2886C5.64174 10.2538 5.67274 10.1995 5.70762 10.1608C6.38185 9.47878 7.05608 8.80067 7.73418 8.12644L9.57475 6.28588C11.3301 4.53055 13.0854 2.77523 14.8368 1.01604C14.9105 0.954039 14.9453 0.942414 14.9725 0.942414Z"
      fill="${color}"
    />
    <path
      d="M1.50733 4.22446H8.27287C8.53637 4.22446 8.74949 4.01134 8.74949 3.74785C8.74949 3.48436 8.53637 3.27124 8.27287 3.27124H1.50733C0.67423 3.27124 0 3.94934 0 4.77857V17.4649C0 18.298 0.678105 18.9723 1.50733 18.9723H14.1898C15.0229 18.9723 15.6971 18.2942 15.6971 17.4649V10.9745C15.6971 10.711 15.484 10.4979 15.2205 10.4979C14.957 10.4979 14.7439 10.711 14.7439 10.9745V17.4649C14.7439 17.7711 14.4921 18.0229 14.1859 18.0229H1.50733C1.20121 18.0229 0.949346 17.7711 0.949346 17.4649V4.78244C0.949346 4.47633 1.20121 4.22446 1.50733 4.22446Z"
      fill="${color}"
    />
  </svg>`

if (userToken) {
  // edition banner
  const editionBanner = document.createElement('div')
  editionBanner.classList.add('edition-banner')
  editionBanner.innerHTML = `<div>${editIcon(
    'white'
  )}Mode édition</div> <button>publier les changements</button>`
  document.body.insertBefore(editionBanner, document.body.firstChild)

  // editButton
  const editButton = document.createElement('button')
  editButton.classList.add('edit-button')
  editButton.innerHTML = `${editIcon('black')}modifier`
  introductionArticle.insertBefore(editButton, introductionArticle.firstChild)
  headerPortfolio.appendChild(editButton.cloneNode(true))
  introductionFigure.appendChild(editButton.cloneNode(true))

  // loggout button
  log.innerHTML = `<button>logout</button>`
  const logButton = document.body.querySelector('#log button')
  logButton.addEventListener('click', () => {
    window.location.reload(), localStorage.clear()
  })
}
