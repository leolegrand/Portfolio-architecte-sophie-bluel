import { init } from '../../script.js'

import binIcon from '../icons/bin.js'
import crossIcon from '../icons/cross.js'
import previousArrowIcon from '../icons/previousArrow.js'
import imgIcon from '../icons/imgIcon.js'

export const modal = (works, categories) => {
  // HTML element -- dialog
  let dialog = document.createElement('dialog')
  dialog.classList.add('modal')

  // HTML elements -- "default" layout

  const dialogCloseButton = document.createElement('button')
  dialogCloseButton.classList.add('modal__close-btn', 'hoverable')
  dialogCloseButton.innerHTML = crossIcon

  const dialogGaleryTitle = document.createElement('h2')
  dialogGaleryTitle.innerHTML = `Galerie photo`

  const dialogGalery = document.createElement('section')
  dialogGalery.setAttribute('id', 'gallery-modal')
  const figures = works.map(
    (
      work
    ) => `<figure id="${work.id}"><img src=${work.imageUrl} alt="${work.title}" crossorigin="anonymous"> <button class="bin-button">${binIcon}</button><figcaption>éditer</figcaption></figure>
    `
  )
  dialogGalery.innerHTML = figures.join('')

  const dialogGaleryDeleteGalery = document.createElement('button')
  dialogGaleryDeleteGalery.classList.add('modal__delete-btn')
  dialogGaleryDeleteGalery.innerHTML = `Supprimer la galerie`

  const dialogGaleryAddPicture = document.createElement('input')
  dialogGaleryAddPicture.setAttribute('type', 'submit')
  dialogGaleryAddPicture.setAttribute('id', 'add-photo')
  dialogGaleryAddPicture.value = `Ajouter une photo`

  const dialogFormTitle = document.createElement('h2')
  dialogFormTitle.innerHTML = `Ajout photo`

  const dialogPrevious = document.createElement('button')
  dialogPrevious.classList.add('previous', 'hoverable')
  dialogPrevious.setAttribute('id', 'previous')
  dialogPrevious.innerHTML = previousArrowIcon

  // HTML elements -- 'add new photo" layout

  const dialogForm = document.createElement('form')
  dialogForm.setAttribute('id', 'form')
  dialogForm.classList.add('modal__form')

  const selectOptions = categories.map(
    (categorie) =>
      `<option value='${categorie.name}'>${categorie.name}</option>`
  )

  const dialogFormDefault = `<div class="form__file" id="form-file">
  ${imgIcon}
  <label class="form__file-label" for="input-file">+ Ajouter photo
  </label>
  <p>jpg, png : 4mo max</p>
  <input required type="file" id="input-file" accept=".jpg, .jpeg, .png"/>
  </div>
  <label for="titre">Titre</label>
  <input required name="titre" type="text">
  <label for="categorie">Catégorie</label>
  <select required name="categorie"><option value=" "</option>${selectOptions}</select>`

  const dialogFormSubmit = document.createElement('input')
  dialogFormSubmit.setAttribute('type', 'submit')
  dialogFormSubmit.setAttribute('id', 'submit')
  dialogFormSubmit.value = 'Valider'

  /**
   * @description Returns differents HTML elements depending of a state
   * @param {string} state - The state of the modal -- should be "default" or anything else.
   */
  function dialogState(state) {
    if (state == 'default') {
      dialog.innerHTML = ``
      dialog.appendChild(dialogCloseButton)
      dialog.appendChild(dialogGaleryTitle)
      dialog.appendChild(dialogGalery)
      dialog.appendChild(dialogGaleryAddPicture)
      dialog.appendChild(dialogGaleryDeleteGalery)

      // on click, delete the figure that is target, from DOM & Back-end
      const deleteButtons = document.body.querySelectorAll('.bin-button')
      deleteButtons.forEach((deleteButton) =>
        deleteButton.addEventListener('click', () => {
          let workId = deleteButton.parentNode.id
          let parentNode = deleteButton.parentNode
          deleteFromDatabase(workId, parentNode, works)
        })
      )
    } else {
      dialog.innerHTML = ``
      dialog.appendChild(dialogCloseButton)
      dialog.appendChild(dialogPrevious)
      dialog.appendChild(dialogFormTitle)
      dialogForm.innerHTML = dialogFormDefault
      dialog.appendChild(dialogForm)
      dialog.appendChild(dialogFormSubmit)

      // on change, insert the selected image on screen
      const fileSelector = document.querySelector('#input-file')
      const formFile = document.querySelector('#form-file')
      fileSelector.addEventListener('change', () => {
        const file = fileSelector.files[0]
        if (file) {
          const fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.addEventListener('load', function () {
            formFile.style.padding = '0px 30px 0px 30px'
            formFile.innerHTML = '<img src="' + this.result + '" />'
          })
        }
      })
    }
  }

  const form = document.querySelector('#form')
  console.log(form)

  //open the dialog
  document.body.appendChild(dialog)
  dialog.showModal()
  dialogState('default')

  // change the state of the dialog modal
  dialogGaleryAddPicture.addEventListener('click', (e) => {
    e.preventDefault()
    dialogState('add-picture')
  })

  // go back to the default state of the dialog modal
  dialogPrevious.addEventListener('click', (e) => {
    e.preventDefault()
    dialogState('default')
  })

  // close the dialog and remove it from DOM
  dialogCloseButton.addEventListener('click', () => {
    dialog.classList.add('modal-close')
    // a timeout is needed to see the disappearing animation
    setTimeout(() => {
      dialog.close()
      dialog.remove()
    }, 300)
  })
}

async function deleteFromDatabase(workId, parentNode, works) {
  // data filtered without the deleted item
  const updatedWorks = works.filter((work) => work.id != workId)
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + `${localStorage.getItem('token')}`,
    },
  }).then((response) => {
    if (response.status === 204) {
      // update the content of the page
      init(updatedWorks)
      // remove the item from the admin gallery
      parentNode.remove()
    } else if (response.status === 401) {
      alert('Unauthorized')
    } else if (response.status === 500) {
      alert('Unexpected behaviour')
    }
  })
}

async function addToDatabase(workId, parentNode, works) {
  // // data filtered without the selected item
  // const updatedWorks = works.filter((work) => work.id != workId)
  // fetch(`http://localhost:5678/api/works/${workId}`, {
  //   method: 'DELETE',
  //   headers: {
  //     Accept: 'application/json, text/plain, */*',
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + `${localStorage.getItem('token')}`,
  //   },
  // }).then((response) => {
  //   if (response.status === 204) {
  //     // update the content of the page
  //     init(updatedWorks)
  //     // remove the item from the admin gallery
  //     parentNode.remove()
  //   } else if (response.status === 401) {
  //     console.log('Unauthorized')
  //   } else if (response.status === 500) {
  //     console.log('Unexpected behaviour')
  //   }
  // })
}
