import { modal } from './components/modal.js'

export const adminMode = () => {
  // sticky banner from display none to flex
  document.body.querySelector('.edition-banner').style.display = 'flex'

  // edition buttons
  document.body
    .querySelectorAll('.edit-button')
    .forEach((button) => (button.style.display = 'flex'))

  // remove filters buttons
  document.body.querySelector('#filters').remove()

  // turn the link into a logout button
  const log = document.body.querySelector('#log')
  log.innerHTML = `<button>se déconnecter</button>`
  const logButton = document.body.querySelector('#log button')
  // on click, user is disconnected, page refresh and local storage is cleared
  logButton.addEventListener('click', () => {
    window.location.reload(), localStorage.clear()
  })

  // open modal on click
  document.body
    .querySelector('#header-portfolio button')
    .addEventListener('click', () => modal())
}
