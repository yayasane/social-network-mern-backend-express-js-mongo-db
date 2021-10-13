module.exports.signUpErrors = (err) => {
  let errors = { pseudo: '', email: '', password: '' }

  if (err.message.includes('pseudo'))
    errors.pseudo = 'Pseudo incorrect ou déja pris'

  if (err.message.includes('email')) errors.email = 'Email incorrect'

  if (err.message.includes('password'))
    errors.password = 'Le mot de passe doit faire 6 caractère minimum'

  //error lié à la conteainte d'unicité
  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
    errors.pseudo = 'Cet pseudo est déja enregistré'

  if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
    errors.email = 'Cet email est déja enregistré'

  return errors
}

module.exports.signInErrors = (err) => {
  let errors = { email: '', password: '' }

  if (err.message.includes('password'))
    errors.pseudo = 'Le mot de passe ne correspond pas'

  if (err.message.includes('email')) errors.email = 'Email inconnu'

  return errors
}

module.exports.uploadErrors = (err) => {
  let errors = { format: '', maxSize: '' }

  if (err.message.includes('Invalid file'))
    errors.format = 'Format incompatible'

  if (err.message.includes('max size'))
    errors.maxSize = 'Le fichier dépasse 500ko'

  return errors
}
