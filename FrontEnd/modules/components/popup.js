/**
 * A customizable dialog HTML element that pop-up then disapear
 * @param {string} message - The message to display in the dialog
 * @param {string} color - The background-color of the modal, should be green or red
 * @param {number} duration - The duration the dialog will be displayed
 * @param {HTMLElement} nodeParent - The HTML element in wich you want the dialog to be included
 */
export const popUp = (message, color, duration, nodeParent) => {
  const alertDialog = document.createElement('dialog')
  alertDialog.classList.add('alert-dialog', `alert-dialog--${color}`)
  alertDialog.style.animationDuration = duration + `ms`
  alertDialog.innerHTML = `${message}`

  // if a pop up is already displayed, remove it then display the new one
  const popupElements = document.body.querySelectorAll('.alert-dialog')
  if (popupElements) {
    popupElements.forEach((el) => el.remove())
  }

  // open the element
  nodeParent.appendChild(alertDialog)
  alertDialog.show()

  // time before the element is removed
  setTimeout(() => {
    alertDialog.remove()
  }, duration)
}
