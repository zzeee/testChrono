/**
 * Created by zzeee on 26.09.2017.
 */
export const loaded="loaded";
export const getURL="get_URL";
export const receiveURL="receiveURL";

export function doGetUrl(url)
{
    return {
        type: getURL, url
    }
}


