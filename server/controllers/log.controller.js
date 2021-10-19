const Log = require('../models/log.model') // Log
// made const name same as name in model

module.exports.test = (req, res) => {
    res.json({
        message: "TEST MESSAGE FOR LOGS"
    })
}

module.exports.getAll = (req, res) => {
    Log.find()
        .then(allLogs => res.json({ allLogs }))
        .catch(err => res.json({ err }))
}

module.exports.createOne = (req, res) => {
    Log.create(req.body)
        .then(newLog => res.json({ newLog }))
        .catch(err => {
            res.status(400).json(err)
            console.log(err)
        })
}

module.exports.getOne = (req, res) => {
    Log.findOne({_id:req.params.id})
        .then(oneLog => res.json({Log:oneLog}))
        .catch(err => res.json({err}))
}

module.exports.updateOne = (req,res) => {
    Log.findOneAndUpdate({_id:req.params.id},req.body, {new:true,runValidators:true})
        .then(updated => res.json({Log: updated}))
        .catch(err => res.status(400).json(err))
}

module.exports.deleteOne = (req,res) => {
    Log.deleteOne({_id:req.params.id})
        .then(deleted => res.json(deleted))
        .catch(err => response.json(err))
}