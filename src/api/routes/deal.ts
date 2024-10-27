import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import controller from '../controllers/deal';
const route = Router();
const multer = require('multer');
const upload = multer({ dest: './uploads/' });
export default (app: Router) => {
  app.use('/deals', route);

  route.get('/', controller.findAll);
  route.post('/', upload.single('file'), controller.create);
  route.get('/:id', controller.findOne);
  route.post('/find', controller.findBy);
  route.post('/findOne', controller.findByOne);
  route.put('/:id', controller.update);
  route.delete('/:id', controller.deleteOne);

  //   route.post('/addFile', controller.addFile);
};
