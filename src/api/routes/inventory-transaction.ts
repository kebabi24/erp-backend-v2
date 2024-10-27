import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import controller from '../controllers/inventory-transaction';
const route = Router();

export default (app: Router) => {
  app.use('/inventory-transactions', route);

  
  route.post('/', controller.create);
  route.get('/findAllissSo', controller.findAllissSo);
  route.get('/:id', controller.findOne);
  route.post('/find', controller.findBy);
  route.put('/:id', controller.update);
  route.delete('/:id', controller.deleteOne);
  route.post('/rct-unp', controller.rctUnp);
  route.post('/rct-unpcab', controller.rctUnpCab);
  
  route.post('/iss-unp', controller.issUnp);
  route.post('/iss-tr', controller.issTr);
  route.post('/iss-trv', controller.issTrV);
  route.post('/iss-chl', controller.issChl);
  route.post('/iss-chlref', controller.issChlRef);
  route.post('/inventoryOfDate', controller.inventoryToDate);
  route.post('/inventoryactivity', controller.inventoryActivity);
  route.post('/inventorybyloc', controller.inventoryByLoc);
  route.post('/inventorybystatus', controller.inventoryByStatus);
  route.post('/inventoryofsecurity', controller.inventoryOfSecurity);
  route.post('/rct-wo', controller.rctWo);
  route.post('/rjct-wo', controller.rjctWo);
  route.post('/iss-wo', controller.issWo);
  route.post('/updateTr', controller.updateTrans);
  // route.post('/iss-so', controller.issSo);
  route.post('/findtrdate', controller.findtrDate);
  route.post('/findtrdateaddr', controller.findtrDateAddr);
  route.post('/findtrtype', controller.findTrType);
  route.post('/cyc-cnt', controller.cycCnt);
  route.post('/cyc-rcnt', controller.cycRcnt);
  
  route.post('/dayly1', controller.findDayly1);
  route.post('/consoreport', controller.consoReport);
  route.post('/consorange', controller.consoRange);
  route.post('/findByOneinv', controller.findByOneinv);
  route.post('/findinv', controller.findByInv);
  route.post('/findrct', controller.findByRct);
  route.post("/findoa", controller.findBySpec);
  route.get('/', controller.findAll);
  route.post('/findcost', controller.findByCost);
  route.post('/findnbr', controller.findByNbr);
  route.post('/findgroup', controller.findByGroup);  
  route.post('/updateprice', controller.updatePrice);
};
