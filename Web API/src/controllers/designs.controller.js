const http_status = require('../http_responses/status.response')
const designService = require('../services/designs.service')

const getDesign = async(req, res) => {
    const design = await designService.getDesign(req.params.designId)
    return res.json(design)
}

const createNewDesign = async(req, res) => {
    
    const newDesign = await designService.createNewDesign(req.body.design)
    return res.json(newDesign)
}

const updateDesign = async(req, res) => {
    
    const result = await designService.updateDesign(req.body.design, req.params.designId)

    return res.json(result)
}

module.exports = {
    createNewDesign,
    getDesign,
    updateDesign
}