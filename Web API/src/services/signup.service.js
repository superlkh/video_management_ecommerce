//Signup service

const db = require('../models')
const User = db.user
const Role = db.role
const CreditCard = db.creditCard
const mkdirp = require('mkdirp')
const storage = require('../config/storage.config')
const Op = db.Sequelize.Op

var bcrypt = require('bcrypt')

function checkDuplicateEmail(userDetails){

    const user_email = User.findOne({                                                            
        where: {
            email: userDetails.email
        }
    })

    if (user_email){
        return user_email
    }

    return
}

function checkDuplicateUsername(userDetails){

    const user_username = User.findOne({                                                            
        where: {
            username: userDetails.username
        }
    })

    if (user_username){
        return user_username
    }

    return
}

async function checkDuplicate(userDetails){

    let user = await checkDuplicateUsername(userDetails)
    if(user){
        return user
    } else  {
        let user_email = await checkDuplicateEmail(userDetails)
        if(user_email){
        return user_email
        }
    }
    return
}

// Create User
 async function createUser(userDetails){
    try{
        const duplicateUser = await checkDuplicate(userDetails)

        if(duplicateUser){
            return
        }

        let user = await User.create({
                username: userDetails.username,
                email: userDetails.email,
                password: bcrypt.hashSync(userDetails.password, 8)
            })
        
        if(userDetails.roles){
            const roles = await Role.findAll({
                where:{
                    name:{
                        [Op.or]: userDetails.roles
                    }
                }
            })
            // Many to many mới xài đc
            // https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html
            // Thêm một dòng trong bảng users_roles
            await user.setRoles(roles)
        } else {
            //Many to many mới xài đc
            //user role = user
            // Thêm một dòng trong bảng users_roles
            await user.setRoles([1])
        }

        // await Project.create({
        //     projectName: 'defaultProject',
        //     url: null,
        //     path: null,
        //     deleted: false,
        //     userId: user.id
        // })

        await mkdirp(`${storage.storage}/${userDetails.username}`)
        await mkdirp(`${storage.storage}/${userDetails.username}/temp`)

        return user
    }
    catch (err){
        console.log(err, 'Error')
    }
}  

module.exports = {createUser}