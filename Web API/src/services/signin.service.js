const db = require('../models')
const User = db.user
const config = require('../config/auth.config.js')

var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')


async function checkUserExistOrNot(userDetails) {

    try {
        let user = await User.findOne({
            where: {
                username: userDetails.username
            }
        })

        // Kiểm tra user có tồn tại hoặc bị soft delete
        if (!user || user.dataValues.deleted === true) {
            return
        }

        return user
    } catch (err) {
        return err
    }


}

async function checkPassword(userDetails) {
    try {
        let user = await checkUserExistOrNot(userDetails)

        if (!user) {
            return
        }
        //Compare 2 passwords in request and DB
        let passwordIsValid = bcrypt.compareSync(userDetails.password, user.password)

        // Check if password is valid
        if (!passwordIsValid) {
            return
        }

        return user
    } catch (err) {
        return err
    }

}

async function grantToken(userDetails) {

    try {
        let user = await checkPassword(userDetails)

        if (!user) {
            return
        }


        let token = jwt.sign({ id: user.id, username: user.username }, config.secret)


        let authorities = []

        let resUser = await user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push('ROLE_' + roles[i].name.toUpperCase())
            }

            return {
                id: user.id,
                username: user.username,
                email: user.email,
                role: authorities,
                accessToken: token,
                pushSubscription: user.pushSubscription
            }

        })

        await User.update({
            pushSubscription: userDetails.pushSub
        }, {
            where: {
                id: resUser.id
            }
        })
    
        return resUser
    }
    catch (err) {
        return err
    }
}


module.exports = {
    grantToken
}





