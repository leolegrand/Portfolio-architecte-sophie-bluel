const API = 'http://localhost:5678/api/'

const emailInput = document.body.querySelector('input[type=text]')
const passwordInput = document.body.querySelector('input[type=password]')
const submitButton = document.body.querySelector('input[type=submit]')

handleSubmit = (event) => {
  event.preventDefault()
  fetch(`${API}users/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message === 'user not found') {
        alert(result.message)
      } else if (result.message === 'not authorized') {
        alert(result.message)
      } else {
        alert('Connexion réussie')
        localStorage.setItem('userId', result.userId)
        localStorage.setItem('token', result.token)
        document.location.href = 'index.html'
      }
    })
}
