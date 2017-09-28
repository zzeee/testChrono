/**
 * Created by zzeee on 26.09.2017.
 */
export const loaded = 'loaded'
export const getURL = 'get_URL'
export const URL_RECEIVED = 'receiveURL'
export const dexception = 'dexception'
export const receivingErr = 'receivingErr'


export function doGetUrl(url) {
  return {
    type: getURL,
    url
  }
}

export function receivingUrl(url, data) {
  return {
    type: URL_RECEIVED,
    url,
    data
  }
}

export function exCommon(url, where) {
  return {
    type: dexception,
    url, where
  }
}

export function exReceivingErr(url) {
  return {
    type: receivingErr,
    url
  }
}

