function convertArrayToCSV (arrCSVContents) {
  if (arrCSVContents === undefined || arrCSVContents.length === 0) {
    return null
  }

  let keys = Object.keys(arrCSVContents[0])
  let result = keys.join(',') + '\n'

  arrCSVContents.forEach((item) => {
    let arr = []
    keys.forEach((key) => {
      arr.push(`"${item[key]}"`)
    })
    result += arr.join(',') + '\n'
  })

  return result
}

function generateCSV (filename, arrCSVContents) {
  let csv = convertArrayToCSV(arrCSVContents)
  if (csv === null) {
    return
  }

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    var link = document.createElement('a')
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}

export default {
  generateCSV
}
