const CART = require('../models/Cart')


const createNewCart = async body => {
    try {
        const { decodeToken, total, idProduct } = body
        //console.log(decodeToken.data)
        const existCart = await CART.findOne({ FK_CreateAt: decodeToken.data })
        if (!existCart) {
            const data = {
                products: [{
                    idProduct: idProduct,
                    total: total || 1
                }],
                FK_CreateAt: decodeToken.data
            }
            const newCart = new CART(data)
            await newCart.save()
            return {
                message: 'Create Cart Success',
                success: true,
            }
        } else {
            const someProduct = existCart.products.findIndex((element) => element.idProduct === idProduct)
            if (someProduct === -1) {
                const products = {
                    idProduct: idProduct,
                    total: total || 1
                }
                existCart.products.push(products)
            }
            else {
                existCart.products[someProduct].total += total
            }
            await existCart.save()
            return {
                message: 'Create Cart Success',
                success: true,
            }
        }
    } catch (error) {
        console.log(error)
        return {
            message: 'An error occurred',
            success: false
        }
    }
}

const getCarts = async () => {
    try {
        const cart = await CART.find({})
        return {
            message: 'Successfully get carts',
            success: true,
            data: cart
        }
    } catch (err) {
        return {
            message: 'An error occurred',
            success: false
        }
    }
}

const updateCart = async (body) => {
    try {
        const { decodeToken, total, idProduct, status } = body
        const existCart = await CART.findOne({ FK_CreateAt: decodeToken.data })
        if (!existCart) {
            return {
                message: 'Dont find cart update',
                success: false
            }
        } else {
            const someProduct = existCart.products.findIndex((elm) => elm.idProduct === idProduct)
            if (someProduct === -1) {
                return {
                    message: 'Dont find product update cart',
                    success: false
                }
            }
            else {
                existCart.products[someProduct].total = total || 0
                existCart.products[someProduct].isActive = status || 'INACTIVE'
            }
            await existCart.save()
            return {
                message: 'Update Cart Success',
                success: true,
            }
        }
    } catch (error) {
        return {
            message: 'An error occurred',
            success: false
        }
    }

}

const deleteCart = async id => {
    try {
        const existCategory = await CART.findOne({ _id: id })
        if (!existCategory) {
            return {
                message: 'Cart not exist',
                success: false
            }
        }

        await CART.deleteOne({ _id: id })

        return {
            message: 'Successfully delete cart',
            success: true
        }
    } catch (error) {
        return {
            message: 'An error occurred',
            success: false
        }
    }
}


module.exports = {
    createNewCart,
    getCarts,
    updateCart,
    deleteCart
}