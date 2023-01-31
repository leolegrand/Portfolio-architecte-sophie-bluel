import { modal } from './components/modal.js'
import editIcon from './icons/editIcon.js'

export const adminMode = (works, categories) => {
  // check if the admin banner is on screen, if so, it mean page is already on admin mode
  const test = document.body.querySelector('#test')
  // if not on screen, create the admin layout
  if (!test) {
    // adds buttons that allow to edit the content of the page
    const headerPortfolio = document.body.querySelector('#header-portfolio')
    const introductionArticle = document.body.querySelector(
      '#introduction article'
    )
    const introductionFigure = document.body.querySelector(
      '#introduction figure'
    )
    const editButton = document.createElement('button')
    editButton.classList.add('edit-button')
    editButton.innerHTML = `${editIcon('black')}modifier`
    introductionArticle.insertBefore(editButton, introductionArticle.firstChild)
    headerPortfolio.appendChild(editButton.cloneNode(true))
    introductionFigure.appendChild(editButton.cloneNode(true))

    // turn the link into a logout button
    const log = document.body.querySelector('#log')
    log.innerHTML = `<button>logout</button>`
    const logButton = document.body.querySelector('#log button')
    // on click, user is disconnected, page refresh and local storage is cleared
    logButton.addEventListener('click', () => {
      window.location.reload(), localStorage.clear()
    })

    // adds at the top of the page, a banner which allows to save the changes
    const editionBanner = document.createElement('div')
    editionBanner.classList.add('edition-banner')
    editionBanner.setAttribute('id', 'test')
    editionBanner.innerHTML = `<div>${editIcon(
      'white'
    )}Mode édition</div> <button>publier les changements</button>`
    document.body.insertBefore(editionBanner, document.body.firstChild)
  }
  // TO DEBUG --> after deleting an item && closing the gallery, if reopened the item is back, work successfully only if page is refreshed
  // when clicked, a modal appears, allowing the user to add or remove images
  const portfolioEditButton = document.body.querySelector(
    '#header-portfolio button'
  )
  portfolioEditButton.addEventListener('click', () => modal(works, categories))
}
