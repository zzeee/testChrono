/**
 * Created by zzeee on 26.09.2017.
 */
export const loaded = 'loaded'
export const getURL = 'get_URL'
export const URL_RECEIVED = 'receiveURL'
export const dexception = 'dexception'

export function doGetUrl(url) {
  return {
    type: getURL,
    url,
  }
}

export function receivingUrl(url, data) {
  return {
    type: URL_RECEIVED,
    url,
    data,
  }
}

export function novExcept(url) {
  return {
    type: dexception,
    url,
  }
}
