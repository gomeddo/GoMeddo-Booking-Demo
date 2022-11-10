function mapFormToElement (data, el, name, attribute) {
  const value = data.get(name)

  if (value) {
    el.setAttribute(attribute, value)
  } else {
    el.removeAttribute(attribute)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('#sales-appointment')
  if (root !== null) {
    document
      .querySelector('#config')
      .addEventListener('submit', (event) => {
        event.preventDefault()

        const config = new FormData(event.target)
        console.debug(config)

        mapFormToElement(config, root, 'apiKey', 'data-api-key')
        mapFormToElement(config, root, 'environment', 'data-environment')
        mapFormToElement(config, root, 'resources', 'data-resources')
        mapFormToElement(config, root, 'timeslotLength', 'data-timeslot-length')
      })
  }
})
