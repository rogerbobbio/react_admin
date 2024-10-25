const baseUrl = process.env.REACT_APP_API_URL;

const fetchSinToken = ( endpoint, data, method = 'GET' ) => {
    const url = `${baseUrl}/${endpoint}`;    

    if(method === 'GET') {
        return fetch(url);
    } else {
        return fetch(url, {
            method,
            headers: {
                'Content-type':'application/json'
            },
            body: JSON.stringify(data)
        })
    }
}

function objectToQueryString(obj) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}

const fetchConToken = ( endpoint, data, method = 'GET' ) => {
    let url = `${baseUrl}/${endpoint}`;    
    const token = localStorage.getItem('token') || '';
    //console.log(url)

    if(method === 'GET') {
        if (data)
            url += '?' + objectToQueryString(data)

        return fetch(url, {
            method,
            headers: {
                'x-token': token                
            }
        });
    } else {
        return fetch(url, {
            method,
            headers: {
                'Content-type':'application/json',
                'x-token': token
            },
            body: JSON.stringify(data)
        })
    }
}

export {
    fetchSinToken,
    fetchConToken
}