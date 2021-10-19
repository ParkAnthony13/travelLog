const logController = require("../controllers/log.controller")

module.exports = app => {
    app.get("/api/test",logController.test)
    app.get("/api/log",logController.getAll)
    app.post("/api/log",logController.createOne)
    app.get("/api/log/:id",logController.getOne)
    app.put("/api/log/:id",logController.updateOne)
    app.delete("/api/log/:id",logController.deleteOne)
}