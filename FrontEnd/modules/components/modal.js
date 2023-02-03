import binIcon from '../icons/bin.js'
import crossIcon from '../icons/cross.js'
import previousArrowIcon from '../icons/previousArrow.js'
import imgIcon from '../icons/imgIcon.js'
import { popUp } from '../components/popup.js'

export const modal = async () => {
  //Fetching categories
  const categoriesResponse = await fetch(`http://localhost:5678/api/categories`)
  const categories = await categoriesResponse.json()

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

  let copyElementsFromGallery = document.querySelectorAll(
    '.gallery figure img '
  )
  copyElementsFromGallery.forEach((img) => {
    dialogGalery.innerHTML += `<figure><img src=${img.src} class="${img.className}" alt="${img.alt}" crossorigin="anonymous"> <button class="bin-button">${binIcon}</button><figcaption>éditer</figcaption></figure>`
  })

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
    (categorie) => `<option value='${categorie.id}'>${categorie.name}</option>`
  )

  const dialogFormDefault = `<div class="form__file" id="form-file">
  ${imgIcon}
  <label class="form__file-label" for="input-file">+ Ajouter photo
  </label>
  <p>jpg, png : 4mo max</p>
  <input type="file" id="input-file" name="input-file" accept="image/*"/>
  </div>
  <label for="title">Titre</label>
  <input required name="title" type="text">
  <label for="category">Catégorie</label>
  <select required name="category"><option value=""></option>${selectOptions}</select>
  <span class="separation"></span><input type="submit" id="submit" class="submit-inactive" value="Valider">`

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
          let projectId = deleteButton.parentNode.firstChild.className
          deleteFromDatabase(projectId, dialog)
        })
      )
    } else {
      dialog.innerHTML = ``
      dialog.appendChild(dialogCloseButton)
      dialog.appendChild(dialogPrevious)
      dialog.appendChild(dialogFormTitle)
      dialogForm.innerHTML = dialogFormDefault
      dialog.appendChild(dialogForm)

      const form = document.querySelector('#form')
      const submit = document.querySelector('#submit')
      const formFile = document.querySelector('#form-file')
      const inputTitle = document.body.querySelector('#form input[type="text"]')
      const inputCategories = document.body.querySelector('#form select')
      const fileSelector = document.querySelector('#input-file')

      // handle input file and display
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

      // function addPhotoFormIsValid() {}
      // if inputs are valid, change the color of the button
      form.addEventListener('change', () => {
        if (
          !inputTitle.validity.valid ||
          !inputCategories.validity.valid ||
          fileSelector.files.length === 0
        ) {
          return false
        }
        submit.classList.remove('submit-inactive')
      })

      // handle form submit
      form.addEventListener('submit', async (e) => {
        console.log(fileSelector.files[0])
        const file = fileSelector.files[0]
        e.preventDefault()
        if (
          !inputTitle.validity.valid ||
          !inputCategories.validity.valid ||
          fileSelector.files.length === 0
        ) {
          popUp('Fichier manquant', 'red', 3000, dialog)
          form.reset()
          return false
        }

        // convert file to binary
        var blob = new Blob([file], { type: 'text/xml' })

        // convert form to formData
        const formData = new FormData(form)
        formData.append('image', blob)

        // send form to API
        addToDatabase(formData, closeDialog, dialog)
      })
    }
  }

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

  function closeDialog(dialog) {
    dialog.classList.add('modal-close')
    // a timeout is needed to see the disappearing animation
    setTimeout(() => {
      dialog.close()
      dialog.remove()
    }, 300)
  }

  // close the modal on click on the ::backdrop
  dialog.addEventListener('click', function (event) {
    // compare dialog element position & user click event position
    let rect = dialog.getBoundingClientRect()
    let isInDialog =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    if (!isInDialog) {
      closeDialog(dialog)
    }
  })

  // close the modal on click on the cross icon
  dialogCloseButton.addEventListener('click', () => closeDialog(dialog))
}

async function deleteFromDatabase(projectId, dialog) {
  // we try to delete the project from the backend | projectId example : "project-42", so we have to split to get only the number
  fetch(`http://localhost:5678/api/works/${projectId.split('-')[1]}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + `${localStorage.getItem('token')}`,
    },
  }).then((response) => {
    if (response.status === 204) {
      // remove the projects from the main galery & admin galery
      document.body
        .querySelectorAll(`.${projectId}`)
        .forEach((el) => el.parentNode.remove())

      popUp('Photo supprimé', 'red', 3000, dialog)

      // init(updatedWorks)
    } else if (response.status === 401) {
      alert('Unauthorized')
    } else if (response.status === 500) {
      alert('Unexpected behaviour')
    }
  })
}

async function addToDatabase(formData, closeDialog, dialog) {
  fetch(`http://localhost:5678/api/works`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + `${localStorage.getItem('token')}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    //
    .then((result) => {
      document.body.querySelector(
        '.gallery'
      ).innerHTML += `<figure><img src=${result.imageUrl} class="project-${result.id}" alt="${result.title}" crossorigin="anonymous"/><figcaption>${result.title}</figcaption></figure>`
      closeDialog(dialog)
      document.body.querySelector('.gallery').lastChild.style.opacity = '1'
      popUp('Photo ajouté', 'green', 3000, document.body)
    })
}
