import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/inventory-status"
const route = Router()

export default (app: Router) => {
    app.use("/inventory-status", route)
    route.get("/instancestatus", controller.findInstanceStatus)
    route.get("/", controller.findAll)
    route.post("/", controller.create)
    route.post("/ism", controller.createIsm)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.post("/findism", controller.findByIsm)
    route.put("/:id", controller.update)
    route.post("/findDetails", controller.findAllDetails)
    
    
    
}
