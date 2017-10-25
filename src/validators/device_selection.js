export function isDeviceTypeSelectionValid (selectedOptions) {
  // if length is 1 or less, it's obviously not going to contain mixed devices
  if (selectedOptions.length <= 1) {
    return true
  }

  let firstDevice = selectedOptions[0]
  let isValid = true
  selectedOptions.forEach((elem) => {
    if (elem.type !== firstDevice.type) {
      isValid = false
    }
  })
  return isValid
}

export function areDevicesOnSameHost (selectedOptions) {
  if (selectedOptions.length <= 1) {
    return true
  }

  let firstDevice = selectedOptions[0]
  let isValid = true
  selectedOptions.forEach((elem) => {
    if (elem.hostname !== firstDevice.hostname) {
      isValid = false
    }
  })
  return isValid
}
