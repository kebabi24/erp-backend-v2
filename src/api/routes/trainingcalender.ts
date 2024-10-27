import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/trainingcalender"
const route = Router()

export default (app: Router) => {
    app.use("/trainingcalenders", route)

    
    route.post("/", controller.create)
   
    route.get("/", controller.findAll)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
  
    route.put("/:id", controller.update)
    route.post("/deletes", controller.deletes)
  
}
