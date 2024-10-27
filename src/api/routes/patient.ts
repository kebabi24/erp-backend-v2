import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/patient"
const route = Router()

export default (app: Router) => {
    app.use("/patients", route)

    route.get("/", controller.findAll)
    route.get("/freeSessions", controller.findFreeSessions)
    route.post("/find", controller.findBy)
    route.post("/", controller.create)
    route.post("/createPatient", controller.createPatient)
    route.get("/findByPhone/:phone", controller.findOneByPhone)
    route.get("/:id", controller.findOne)
    route.put("/:id", controller.update)
    route.delete("/:id", controller.deleteOne)
 
}
