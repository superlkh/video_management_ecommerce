
const db = require('../models')
const Designs = db.designs
const Element = db.elements

const getDesign = async(designId) => {
    const design = await Designs.findOne({
        where: {
            id: parseInt(designId)
        }
    })

    design.elements = [1, 2]

    const elements = {
        1: {
            "id": 1,
            "elementableId": 836,
            "elementableType": "Image",
            "posX": 92.0,
            "posY": 120.0,
            "zIndex": 0,
            "transparency": 1.0,
            "rotate": 0.0,
            "elementableAttributes": {
                "id": 836,
                "url": "https://foyr.com/learn/wp-content/uploads/2021/08/design-your-dream-home.jpg",
                "width": 956.0,
                "height": 654.0
            }
        },
        2: {
            "id": 2,
            "elementableId": 836,
            "elementableType": "Image",
            "posX": 0.0,
            "posY": 0.0,
            "zIndex": 0,
            "transparency": 1.0,
            "rotate": 0.0,
            "elementableAttributes": {
                "id": 836,
                "url": "https://tienganhikun.com/upload/images/house_ikun.jpg",
                "width": 956.0,
                "height": 654.0
            }
        }
    }

    return {
        design,
        elements
    }
}

const createNewDesign = async(designData) => {
    console.log(designData)
    const design = await Designs.create({
        userId: designData.creatorId,
        creatorId: designData.creatorId,
        description: '',
        public: designData.public,
        title: designData.title,
        width: designData.width,
        height: designData.height,
        elements: [
            1
        ]
    })

    

    return {
        design
    }
}

const updateDesign = async(design, designId) => {
    console.log(design.elementsAttributes)
    for(let i = 0; i < design.elements.length; i++){
        await Element.create(design.elementsAttributes[i])
        await Element.update({
            designId: designId
        },{
            where: {
                id: design.elementsAttributes[i].id
            }
        })
    }
    const result = await Designs.update({
        elements: design.elements
    },{
        where: {
            id: designId
        }
    })

    return result
}

module.exports = {
    createNewDesign,
    getDesign,
    updateDesign,

}