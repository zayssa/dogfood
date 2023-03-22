const onResponse = (res) => {
    return res.ok ? res.json() : res.json().then(err => Promise.reject(err));
}

class Api {
    constructor({baseUrl, headers}) {
        this._headers = headers;
        this._baseUrl = baseUrl;
    }

    getProductList() {
        return fetch(`${this._baseUrl}/products`, {
            headers: this._headers,
        }).then(onResponse)
    }

    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers,
        }).then(onResponse)
    }
    getProductById(idProduct) {
        return fetch(`${this._baseUrl}/products/${idProduct}`, {
            headers: this._headers,
        }).then(onResponse)
    }

    setUserInfo(dataUser) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify(dataUser),
        }).then(onResponse)
    }
    

    search(searchQuery) {
        return fetch(`${this._baseUrl}/products/search?query=${searchQuery}`, {
            headers: this._headers,
        }).then(onResponse)
    }

    changeLikeProduct(productId, isLike) {
        return fetch(`${this._baseUrl}/products/likes/${productId}`, {
            method: isLike ? 'DELETE' : 'PUT',
            headers: this._headers,
        }).then(onResponse)
    }
}

const config = {
    baseUrl: 'https://api.react-learning.ru',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDA0YTg3MzRlZTQxOTk3NWZiZDJkNWUiLCJncm91cCI6ImZyb24xMCIsImlhdCI6MTY3ODAyNzAxMiwiZXhwIjoxNzA5NTYzMDEyfQ.MU919Em-VtexPjc1bgTQnm6p2jTpDE0u7Y-hLS1cg3w'
    }
}

const api = new Api(config);

export default api;