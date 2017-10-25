import numeral from 'numeral'

export function formatNumber (value) {
  return numeral(value).format('0,0')
}
