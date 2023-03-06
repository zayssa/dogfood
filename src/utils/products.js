export const isLiked = (likes, userId) => likes?.some(id => id === userId);

export const calcDiscountPrice = (price, discount) => {
    return Math.round(price - price * discount / 100)
}

export const createMarkup = (textHtml) => {
    return {__html: textHtml}
}