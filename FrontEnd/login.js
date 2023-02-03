const submitButton = document.body.querySelector('input[type=submit]')
const loginForm = document.body.querySelector('#login-form')
const errorMessage = document.body.querySelector('#login-error')
let emailInput = document.body.querySelector('input[type=email]')
let passwordInput = document.body.querySelector('input[type=password]')

loginForm.addEventListener('submit', handleSubmit)

function handleSubmit(event) {
  if (!emailInput.validity.valid || !passwordInput.validity.valid) {
    // user inputs are NOT VALID (email not compliant with regex, password missing...)
    return false
  }

  event.preventDefault()

  let userInputs = {
    email: emailInput.value,
    password: passwordInput.value,
  }

  // we try to fetch the data with the combination mail/password provided by the user
  fetch(`http://localhost:5678/api/users/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInputs),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.userId && result.token) {
        // user successfully logged in
        submitButton.classList.add('button-to-round')
        submitButton.value = `✓`
        submitButton.style.width = '40px'
        setTimeout(() => {
          localStorage.setItem('userId', result.userId)
          localStorage.setItem('token', result.token)
          document.location.href = 'index.html'
        }, 1000)
      } else {
        // incorrect password and/or username combination
        errorMessage.style.display = 'block'
      }
    })
}
