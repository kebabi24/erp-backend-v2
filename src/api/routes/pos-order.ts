import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import controller from '../controllers/pos-order';
const route = Router();

export default (app: Router) => {
  app.use('/pos-order', route);

  route.get('/findw', controller.findAlll);
  route.post('/findall', controller.findAll);
  route.post('/findAllPosOrders', controller.findAllPosOrders);
  route.post('/', controller.create);
  route.get('/:id', controller.findOne);
  route.post('/find', controller.findBy);
  route.post('/findsumqty', controller.findSumQty);
  route.post('/findposgrp', controller.findPosGrp);
  route.post('/findbysite', controller.findBySite);
  route.post('/findsumqtyps', controller.findSumQtyPs);
  route.post('/findsumamt', controller.findSumAmt);
  route.post('/findglobamt', controller.findGlobAmt);
  route.post('/findsomeorders', controller.findByOrd);
  route.post('/update', controller.update);
  route.delete('/:id', controller.deleteOne);
  route.post('/findorder', controller.findByOrd);
  route.post('/createCallCenterOrder', controller.createCALLCenterORDER);
  route.post('/createorder', controller.createOrder);
  route.post('/set', controller.set);
};
