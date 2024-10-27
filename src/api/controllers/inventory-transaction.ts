import InventoryTransactionService from '../../services/inventory-transaction';
import locationDetailService from '../../services/location-details';
import costSimulationService from '../../services/cost-simulation';
import itemService from '../../services/item';
import CodeService from '../../services/code';
import workOrderService from '../../services/work-order';
import statusService from '../../services/inventory-status';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { round, toNumber } from 'lodash';
import { DATE, Op, Sequelize } from 'sequelize';
import ItemService from '../../services/item';
import workOrderDetailService from '../../services/work-order-detail';
import AddressService from '../../services/address';
import sequelize from '../../loaders/sequelize';
import Item from '../../models/item';
import moment from 'moment';
import inventoryTransactionService from '../../services/inventory-transaction';
import SaleOrderDetailService from '../../services/saleorder-detail';
import SaleOrderService from '../../services/saleorder';
import MobileService from '../../services/mobile-service';
import { generatePdf } from '../../reporting/generator';
import serviceMobile from '../../services/mobile-service';
import { type } from 'os';
import PosOrderDetail from '../../services/pos-order-detail-product';
import LocationDetailService from '../../services/location-details';
import AccountUnplanifedService from '../../services/account-unplanifed';
import ProviderService from '../../services/provider';
import { DECIMAL } from 'sequelize';

const create = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers 
  const{user_domain} = req.headers

  
  logger.debug('Calling Create code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const devise = await inventoryTransactionServiceInstance.create({
      ...req.body,
      tr_domain: user_domain,
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });
    return res.status(201).json({ message: 'created succesfully', data: devise });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findOne = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find one  code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const { id } = req.params;
    const devise = await inventoryTransactionServiceInstance.findOne({ id });
    return res.status(200).json({ message: 'fetched succesfully', data: devise });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find all code endpoint');
  const{user_code} = req.headers 
  const{user_domain} = req.headers
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const devise = await inventoryTransactionServiceInstance.find({tr_domain:user_domain});
    
    return res.status(200).json({ message: 'fetched succesfully', data: devise });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findBy = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const{user_code} = req.headers 
  const{user_domain} = req.headers
  try {
    
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const trs = await inventoryTransactionServiceInstance.find({ ...req.body,tr_domain:user_domain });
    return res.status(200).json({ message: 'fetched succesfully', data: trs });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findByOneinv = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const{user_code} = req.headers 
  const{user_domain} = req.headers
  try {
    const ServiceInstance = Container.get(serviceMobile);
    const { role_code, type } = req.body;
    const currentService = await ServiceInstance.findOne({ role_code: role_code, service_open: true,service_domain:user_domain });
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const inv = await inventoryTransactionServiceInstance.findOne({
      tr_type: type,
      tr_effdate: currentService.service_period_activate_date,
      tr_domain:user_domain
    });
    return res.status(200).json({ message: 'fetched succesfully', data: inv });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const { id } = req.params;
    const devise = await inventoryTransactionServiceInstance.update(
      { ...req.body, last_modified_by: user_code, last_modified_ip_adr: req.headers.origin },
      { id },
    );
    return res.status(200).json({ message: 'fetched succesfully', data: devise });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const updateTrans = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  console.log('AVANT TRY')
  logger.debug('Calling update one  locationDetail endpoint');
  try {
    console.log(req.body,'test')
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    let refid = req.body.id;
     const locationDetail = await inventoryTransactionServiceInstance.update(
      { tr_rev: 'CHANGED', last_modified_by: user_code, last_modified_ip_adr: req.headers.origin },
      { id : refid},
    );

    return res.status(200).json({ message: 'fetched succesfully', data: locationDetail });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling update one  code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const { id } = req.params;
    const devise = await inventoryTransactionServiceInstance.delete({ id });
    return res.status(200).json({ message: 'deleted succesfully', data: id });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const rctUnp = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers 
  const{user_domain} = req.headers

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);
    const accountUnplanifedServiceInstance = Container.get(AccountUnplanifedService);
    const providerServiceInstance = Container.get(ProviderService);

    let tot = 0.00  
    for (const data of detail) {
      
       tot = tot + Number(data.tr_qty_loc) * Number(data.tr_price)
     // tot = +10 * +100.020
      
    }
    if (it.tr_addr != null) {
    const aufind = await accountUnplanifedServiceInstance.findOne({au_nbr: nlot,au_domain : user_domain,})
    if(aufind) {
    const accountUnplanifed = await accountUnplanifedServiceInstance.update({au_amt : Number(aufind.au_amt) + Number(tot) ,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id:aufind.id})
    } else {
      const accountUnplanifed = await accountUnplanifedServiceInstance.create({au_effdate:it.tr_effdate,au_vend:it.tr_addr,au_curr:"DA",au_nbr: nlot,au_amt:tot,au_type:"I",au_domain : user_domain,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
    }
    const vd = await providerServiceInstance.findOne({vd_addr: it.tr_addr,vd_domain : user_domain,})
    if(vd) await providerServiceInstance.update({vd_ship_balance : Number(vd.vd_ship_balance) + Number(tot)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: vd.id})  
    }
    for (const data of detail) {
      const { desc, ...item } = data;
      const sct = await costSimulationServiceInstance.findOne({
        sct_domain:user_domain,
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part , pt_domain: user_domain});

      const lds = await locationDetailServiceInstance.find({ ld_part: item.tr_part, ld_site: item.tr_site,  ld_domain:user_domain });
      const { sct_mtl_tl } = await costSimulationServiceInstance.findOne({ sct_domain:user_domain,sct_part: item.tr_part, sct_sim: 'STD-CG' });
      const sctdet = await costSimulationServiceInstance.findOne({
        sct_domain:user_domain,
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });

      let qty = 0;
      lds.map(elem => {
        qty += Number(elem.ld_qty_oh);
      });
      
      let stk= (qty + Number(item.tr_qty_loc) * Number(item.tr_um_conv));
      let new_price: any;
      if (stk != 0){ new_price = round(
        (qty * Number(sct_mtl_tl) + Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price)) /
          (qty + Number(item.tr_qty_loc) * Number(item.tr_um_conv)),
        2,
      );}
      else { new_price = 0}
      
      await costSimulationServiceInstance.update(
        {
          sct_mtl_tl: new_price,
          sct_cst_tot:
            new_price +
            Number(sctdet.sct_lbr_tl) +
            Number(sctdet.sct_bdn_tl) +
            Number(sctdet.sct_ovh_tl) +
            Number(sctdet.sct_sub_tl),
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        },
        { sct_part: item.tr_part, sct_site: item.tr_site, sct_sim: 'STD-CG',sct_domain:user_domain },
      );
      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
        ld_ref: item.tr_ref,
        ld_domain:user_domain
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      else {
        
        const status = await statusServiceInstance.findOne({
          is_domain:user_domain,
          is_status: item.tr_status,
        });

        await locationDetailServiceInstance.create({
          ld_part: item.tr_part,
          ld_lot: item.tr_serial,
          ld_ref: item.tr_ref,
          ld_date: new Date(),
          ld_site: item.tr_site,
          ld_loc: item.tr_loc,
          ld_status: item.tr_status,
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          ld__log01: status.is_nettable,
          ld_domain:user_domain,
          ld_grade: item.tr_grade,
          ld__chr01:item.tr_batch,
          chr01:pt.pt_draw,
          chr02:pt.pt_break_cat,
          chr03:pt.pt_group,
        });
      }
      let qtyoh = 0;
      if (ld) {
        qtyoh = Number(ld.ld_qty_oh);
      } else {
        qtyoh = 0;
      }
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_domain:user_domain,
        tr_lot: nlot,
        tr_qty_chg: Number(item.tr_qty_loc),
        tr_loc_begin: Number(qtyoh),
        tr_type: 'RCT-UNP',
        tr_date: new Date(),
        tr_mtl_std: new_price,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });
    }

    // const addressServiceInstance = Container.get(AddressService);
    // const addr = await addressServiceInstance.findOne({ ad_addr: it.tr_addr,ad_domain:user_domain });

    // const pdfData = {
    //   detail: detail,
    //   it: it,
    //   nlot: nlot,
    //   adr: addr,
    // };

    
    // const pdf = await generatePdf(pdfData, 'rct-unp');

    return res.status(200).json({ message: 'Added succesfully', data: true, /*pdf: pdf.content*/ });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const issUnp = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers 
  const{user_domain} = req.headers

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);

    for (const item of detail) {
      const sct = await costSimulationServiceInstance.findOne({
        sct_domain:user_domain,
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part,pt_domain:user_domain });
      const ld = await locationDetailServiceInstance.findOne({
        ld_domain:user_domain,
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
        ld_ref: item.tr_ref,
      });

      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_domain:user_domain,
        tr_gl_date: it.tr_effdate,
        tr_qty_loc: -1 * Number(item.tr_qty_loc),
        tr_qty_chg: -1 * Number(item.tr_qty_loc),
        tr_loc_begin: Number(ld.ld_qty_oh),
        tr_type: 'ISS-UNP',
        tr_date: new Date(),
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_grade:ld.ld_grade,
        tr_batch:ld.ld__chr01,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });
    }

    // const addressServiceInstance = Container.get(AddressService);
    // const addr = await addressServiceInstance.findOne({ ad_addr: it.tr_addr ,ad_domain:user_domain});

    // const pdfData = {
    //   detail: detail,
    //   it: it,
    //   nlot: nlot,
    //   adr: addr,
    // };

    
    // const pdf = await generatePdf(pdfData, 'it-unp');
    return res.status(200).json({ message: 'deleted succesfully', data: true /*, pdf: pdf.content*/ });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const issTr = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling update one  code endpoint');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;


  
  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);

    for (const item of detail) {
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: it.tr_site,
        sct_sim: 'STD-CG',
        sct_domain: user_domain,
      });
      const sctrct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: it.tr_ref_site,
        sct_sim: 'STD-CG',
        sct_domain: user_domain
      });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part,pt_domain: user_domain });

      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: it.tr_site,
        ld_loc: it.tr_loc,
        ld_ref:item.tr_ref,
        ld_domain:user_domain,
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_qty_loc: -1 * Number(item.tr_qty_loc),
        tr_loc_begin: (ld) ? ld.ld_qty_oh : 0,
        tr_type: 'ISS-TR',
        tr_date: new Date(),
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_batch: (ld) ? ld.ld__chr01: null,
        tr_grade:(ld) ? ld.ld_grade: null,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
        tr_domain: user_domain,
      });

      const ld1 = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: it.tr_ref_site,
        ld_loc: it.tr_ref_loc,
        ld_ref:item.tr_ref,
        ld_domain: user_domain,
      });
     
      if (ld1)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld1.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld1.id },
        );
      else {
        const status = await statusServiceInstance.findOne({
          is_status: item.tr_status,
          is_domain: user_domain,
        });
        await locationDetailServiceInstance.create({
          ld_part: item.tr_part,
          ld_lot: item.tr_serial,
          ld_ref: item.tr_ref,
          ld_date: new Date(),
          ld_site: it.tr_ref_site,
          ld_loc: it.tr_ref_loc,
          ld_status: item.tr_status,
          ld__log01: status.is_nettable,
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
          ld_domain: user_domain,
          chr01:ld.chr01,
          chr02:ld.chr02,
          chr03:ld.chr03,
          ld_grade:(ld) ? ld.ld_grade : null,
          ld_batch: (ld) ? ld.ld_batch : null
        });
      }
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_qty_loc: Number(item.tr_qty_loc),
        tr_type: 'RCT-TR',
        tr_date: new Date(),
        tr_loc: it.tr_ref_loc,
        tr_loc_begin: (ld1) ? ld1.ld_qty_oh : 0,
        tr_site: it.tr_ref_site,
        tr_ref_site: it.tr_site,
        tr_ref_loc: it.tr_loc,
        tr_mtl_std: sctrct.sct_mtl_tl,
        tr_lbr_std: sctrct.sct_lbr_tl,
        tr_bdn_std: sctrct.sct_bdn_tl,
        tr_ovh_std: sctrct.sct_ovh_tl,
        tr_sub_std: sctrct.sct_sub_tl,
        tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_grade:(ld) ? ld.ld_grade : null,
        tr_batch: (ld) ? ld.ld__chr01 : null,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
        tr_domain: user_domain,
      });
    }

    // const pdfData = {
    //   double: true,
    //   detail: detail,
    //   it: it,
    //   nlot: nlot,
    // };

    // const pdf = await generatePdf(pdfData, 'it-tr');

    //pdf
    return res.status(200).json({ message: 'deleted succesfully', data: true, /*pdf: pdf.content*/ });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const issChl = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers 
  const{user_domain} = req.headers

  logger.debug('Calling update one  code endpoint');
  try {
    const it = req.body;
    
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);

    const ld = await locationDetailServiceInstance.find({
      ld_domain:user_domain,
      ld_part: it.tr_part,
      ld_lot: it.tr_vend_lot,
      ld_site: it.tr_site,
      ld_loc: it.tr_loc,
    });
    for (let obj of ld) { 
      
    const sct = await costSimulationServiceInstance.findOne({
      sct_domain:user_domain,
      sct_part: obj.ld_part,
      sct_site: obj.ld_site,
      sct_sim: 'STD-CG',
    });
    const pt = await itemServiceInstance.findOne({ pt_part: obj.ld_part,pt_domain:user_domain });

   
    await inventoryTransactionServiceInstance.create({
      ...it,
      tr_domain:user_domain,
      tr_serial: it.tr_vend_lot,
      tr_status: obj.ld_status,
      tr_expire: obj.ld_expire,
      tr_ref: obj.ld_ref,
      tr_qty_loc: 0,
      tr_type: 'ISS-CHL',
      tr_line: 1,
      tr_um: obj.ld_um,
      tr_effdate: new Date(),
      tr_date: new Date(),
      tr_price: sct.sct_mtl_tl,
      tr_mtl_std: sct.sct_mtl_tl,
      tr_lbr_std: sct.sct_lbr_tl,
      tr_bdn_std: sct.sct_bdn_tl,
      tr_ovh_std: sct.sct_ovh_tl,
      tr_sub_std: sct.sct_sub_tl,
      tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_grade:obj.ld_grade,
        tr_batch:obj.ld__chr01,
        dec01:Number(new Date().getFullYear()),
        dec02:Number(new Date().getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });
   
      const status = await statusServiceInstance.findOne({
        is_domain:user_domain,
        is_status: it.tr_status,
      });
      await locationDetailServiceInstance.update(
        {
          ld_status: it.tr_status,
          ld_expire: it.tr_expire,
          ld_lot: it.tr_serial,
          ld__log01: status.is_nettable,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        },
        { id: obj.id },
      );
    
    await inventoryTransactionServiceInstance.create({
      ...it,
      tr_domain:user_domain,
      tr_qty_loc: 0,
      tr_ref: obj.ld_ref,
      tr_type: 'RCT-CHL',
      tr_line: 1,
      tr_um: obj.ld_um,
      tr_effdate: new Date(),
      tr_date: new Date(),
      tr_price: sct.sct_mtl_tl,
      tr_mtl_std: sct.sct_mtl_tl,
      tr_lbr_std: sct.sct_lbr_tl,
      tr_bdn_std: sct.sct_bdn_tl,
      tr_ovh_std: sct.sct_ovh_tl,
      tr_sub_std: sct.sct_sub_tl,
      tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_grade:obj.ld_grade,
        tr_batch:obj.ld__chr01,
        dec01:Number(new Date().getFullYear()),
        dec02:Number(new Date().getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });
  }
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const inventoryToDate = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;
  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    
    const items = await itemService.find({
      pt_domain:user_domain,
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const result = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.findSpecial({
        where: {
          ld_domain:user_domain,
          ld_part: item.pt_part,
          ld_site: { [Op.between]: [req.body.pt_site_1, req.body.pt_site_2] },
          ld_loc: { [Op.between]: [req.body.pt_loc_1, req.body.pt_loc_2] },
        },
        attributes: ['ld_part', 'ld_site', 'ld_loc', [Sequelize.fn('sum', Sequelize.col('ld_qty_oh')), 'total_qty']],
        group: ['ld_part', 'ld_site', 'ld_loc'],
        raw: true,
      });
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
        const res = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_site: det.ld_site,
            tr_loc: det.ld_loc,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_effdate: { [Op.between]: [req.body.date, new Date()] },
          },
          attributes: ['tr_part', 'tr_site', 'tr_loc', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'total']],
          group: ['tr_part', 'tr_site', 'tr_loc'],
          raw: true,
        });
        const qty = res[0] ? (res[0].total ? res[0].total : 0) : 0;
        det.total_qty = det.total_qty - qty;
        const item = await itemService.findOneS({ pt_part: det.ld_part,pt_domain:user_domain });
        det.item = item;
        result.push(det);
      }
    }
    

    return res.status(201).json({ message: 'created succesfully', data: result });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryActivity = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;

  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    
    const items = await itemService.find({
      pt_domain:user_domain,
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const result = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.find({
        where: {
          ld_domain:user_domain,
          ld_part: item.pt_part,
        },
        attributes: ['ld_part', [Sequelize.fn('sum', Sequelize.col('ld_qty_oh')), 'total_qty']],
        group: ['ld_part'],
        raw: true,
      });
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
        const res_2 = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_effdate: { [Op.between]: [req.body.date_2, new Date()] },
          },
          attributes: ['tr_part', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'total']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_2 = res_2[0] ? (res_2[0].total ? res_2[0].total : 0) : 0;
        det.total_qty_2 = det.total_qty - qty_2;

        const res_rctpo = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'RCT-PO' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctpo']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctpo = res_rctpo[0] ? (res_rctpo[0].totalrctpo ? res_rctpo[0].totalrctpo : 0) : 0;
        det.total_qty_rctpo = det.total_qty_rctpo + qty_rctpo;
        const res_rctwo = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'RCT-WO' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctwo']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctwo = res_rctwo[0] ? (res_rctwo[0].totalrctwo ? res_rctwo[0].totalrctwo : 0) : 0;
        det.total_qty_rctwo = det.total_qty_rctwo + qty_rctwo;
        const res_rctcns = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'RCT-CNS' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctcns']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctcns = res_rctcns[0] ? (res_rctcns[0].totalrctcns ? res_rctcns[0].totalrctcns : 0) : 0;
        det.total_qty_rctcns = det.total_qty_rctcns + qty_rctcns;
        const res_rcttr = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'RCT-TR' },
            tr_status: { [Op.eq]: 'PROD' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrcttr']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rcttr = res_rcttr[0] ? (res_rcttr[0].totalrcttr ? res_rcttr[0].totalrcttr : 0) : 0;
        det.total_qty_rcttr = det.total_qty_rcttr + qty_rcttr;
        const res_rctchl = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'RCT-CHL' },
            tr_status: { [Op.eq]: 'NONCONF' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctchl']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctchl = res_rctchl[0] ? (res_rctchl[0].totalrctchl ? res_rctchl[0].totalrctchl : 0) : 0;
        det.total_qty_rctchl = det.total_qty_rctchl + qty_rctchl;
        const res_isswo = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'ISS-WO' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalisswo']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_isswo = res_isswo[0] ? (res_isswo[0].totalisswo ? res_isswo[0].totalisswo : 0) : 0;
        det.total_qty_isswo = det.total_qty_isswo + qty_isswo;
        const res_issso = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'ISS-SO' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalissso']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_issso = res_issso[0] ? (res_issso[0].totalissso ? res_issso[0].totalissso : 0) : 0;
        det.total_qty_issso = det.total_qty_issso + qty_issso;
        const res_issprv = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'ISS-PRV' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalissprv']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_issprv = res_issprv[0] ? (res_issprv[0].totalissprv ? res_issprv[0].totalissprv : 0) : 0;
        det.total_qty_issprv = det.total_qty_issprv + qty_issprv;
        const res_rctunp = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'RCT-UNP' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctunp']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctunp = res_rctunp[0] ? (res_rctunp[0].totalrctunp ? res_rctunp[0].totalrctunp : 0) : 0;
        det.total_qty_rctunp = det.total_qty_rctunp + qty_rctunp;
        const res_issunp = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'ISS-UNP' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalissunp']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_issunp = res_issunp[0] ? (res_issunp[0].totalissunp ? res_issunp[0].totalissunp : 0) : 0;
        det.total_qty_issunp = det.total_qty_issunp + qty_issunp;
        const res_isscns = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.eq]: 'ISS-CNS' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalisscns']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_isscns = res_isscns[0] ? (res_isscns[0].totalisscns ? res_isscns[0].totalisscns : 0) : 0;
        det.total_qty_isscns = det.total_qty_isscns + qty_isscns;
        const res_tagcnt = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_ship_type: { [Op.ne]: 'M' },
            tr_type: { [Op.contains]: 'TAG' },
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totaltag']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_tagcnt = res_tagcnt[0] ? (res_tagcnt[0].totaltagcnt ? res_tagcnt[0].totaltagcnt : 0) : 0;
        det.total_qty_tagcnt = det.total_qty_tagcnt + qty_tagcnt;

        const res_1 = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_domain:user_domain,
            tr_part: det.ld_part,
            tr_type: { [Op.ne]: 'M' },
            tr_effdate: { [Op.between]: [req.body.date_1, new Date()] },
          },
          attributes: ['tr_part', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'total']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_1 = res_1[0] ? (res_1[0].total ? res_1[0].total : 0) : 0;
        det.total_qty_1 = det.total_qty - qty_1;

        const item = await itemService.findOneS({ pt_part: det.ld_part });
        det.item = item;
        result.push(det);
      }
    }
  

    return res.status(201).json({ message: 'created succesfully', data: result });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryByLoc = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;

  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    
    const items = await itemService.find({
      pt_domain:user_domain,
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const results_head = [];
    const results_body = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.find({
        ld_domain: user_domain,
        ld_part: item.pt_part,
        ld_loc: { [Op.between]: [req.body.ld_loc_1, req.body.ld_loc_2] },
      });
      

      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const result_head = {
          ld_loc_head: det.ld_loc,
        };
        const result_body = {
          ld_status: det.ld_status,
          ld_loc_body: det.ld_loc,
          ld_part: det.ld_part,
          pt_desc1: item.pt_desc1,
          pt_um: item.pt_um,
          ld_qty_oh: det.ld_qty_oh,
          ld_lot: det.ld_lot,
        };
        results_body.push(result_body);
        let bool = false;
        for (var i = 0; i < results_head.length; i++) {
          if (results_head[i].ld_loc_head == det.ld_loc) {
            bool = true;
          }
        }
        if (!bool) {
          results_head.push(result_head);
        }
      }
    }
    

    return res.status(201).json({ message: 'created succesfully', data: { results_head, results_body } });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryByStatus = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;
  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    
    const items = await itemService.find({
      pt_domain:user_domain,
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const results_head = [];
    const results_body = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.find({
        ld_domain:user_domain,
        ld_part: item.pt_part,
        ld_status: { [Op.between]: [req.body.ld_status_1, req.body.ld_status_2] },
        ld_loc: { [Op.between]: [req.body.ld_loc_1, req.body.ld_loc_2] },
      });
      

      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const result_head = {
          ld_status_head: det.ld_status,
          ld_loc_head: det.ld_loc,
        };
        const result_body = {
          ld_status_body: det.ld_status,
          ld_loc_body: det.ld_loc,
          ld_part: det.ld_part,
          pt_desc1: item.pt_desc1,
          pt_um: item.pt_um,
          ld_qty_oh: det.ld_qty_oh,
          ld_lot: det.ld_lot,
          ld_expire: det.ld_expire,
        };
        results_body.push(result_body);
        let bool = false;
        for (var i = 0; i < results_head.length; i++) {
          if ((results_head[i].ld_status_head == det.ld_status, results_head[i].ld_loc_head == det.ld_loc)) {
            bool = true;
          }
        }
        if (!bool) {
          results_head.push(result_head);
        }
      }
    }
    

    return res.status(201).json({ message: 'created succesfully', data: { results_head, results_body } });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryOfSecurity = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;
  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    
    const items = await itemService.find({
      pt_domain:user_domain,
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const result = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.findSpecial({
        where: {
          ld_domain:user_domain,
          ld_part: item.pt_part,
          ld_status: { [Op.between]: [req.body.pt_status_1, req.body.pt_status_2] },
          ld_loc: { [Op.between]: [req.body.pt_loc_1, req.body.pt_loc_2] },
        },
        attributes: ['ld_part', 'ld_status', 'ld_loc', [Sequelize.fn('sum', Sequelize.col('ld_qty_oh')), 'total_qty']],
        group: ['ld_part', 'ld_status', 'ld_loc'],
        raw: true,
      });
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const qty = res[0] ? (res[0].total_qty ? res[0].total_qty : 0) : 0;
        det.qty = qty;
        const item = await itemService.findOneS({ pt_part: det.ld_part,pt_domain:user_domain });
        det.item = item;
        if (det.qty < items.pt_safety_stk) {
          result.push(det);
        }
      }
    }
    

    return res.status(201).json({ message: 'created succesfully', data: result });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const rctWo = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it } = req.body;
    
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);
    const workOrderServiceInstance = Container.get(workOrderService);
    
    for (const data of detail) {
      const { desc, ...item } = data;
      const pt = await itemServiceInstance.findOne({ pt_part: it.tr_part , pt_domain:user_domain});

      const ld = await locationDetailServiceInstance.findOne({
        ld_domain:user_domain,
        ld_part: it.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
        ld_ref: item.tr_ref,
        
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      else {
       
        const status = await statusServiceInstance.findOne({
          is_domain:user_domain,
          is_status: item.tr_status,
        });

        await locationDetailServiceInstance.create({
          ld_domain:user_domain,
          ld_part: it.tr_part,
          ld_lot: item.tr_serial,
          ld_date: new Date(),
          ld_site: item.tr_site,
          ld_loc: item.tr_loc,
          ld_status: item.tr_status,
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          ld_ref: item.tr_ref,
          ld__log01: status.is_nettable,
          ld_grade:item.tr_grade,
          chr01:pt.pt_draw,
          chr02:pt.pt_break_cat,
          chr03:pt.pt_group
        });
      }
      let qtyoh = 0;
      if (ld) {
        qtyoh = Number(ld.ld_qty_oh);
      } else {
        qtyoh = 0;
      }
      const sct = await costSimulationServiceInstance.findOne({
        sct_domain:user_domain,
        sct_part: it.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });
      
      const wo = await workOrderServiceInstance.findOne({ id: it.tr_lot });
        let routing : any;
        let emp: any;
        let stat: any;
        // for  (let ofs of wo){routing = ofs.wo_routing, emp = ofs.wo_user1}
        routing = wo.wo_routing
        emp = wo.wo_user1
        console.log(wo.wo_qty_comp, '>', wo.wo_qty_ord)
        if (Number(Number(wo.wo_qty_comp) + Number(item.tr_qty_loc)) >= Number(wo.wo_qty_ord)){stat = 'C'} else {stat = 'R'}
        console.log(stat)
      if (wo)
       
        await workOrderServiceInstance.update(
          {
            wo_qty_comp: Number(wo.wo_qty_comp) + Number(item.tr_qty_loc),
            wo_qty_chg: Number(wo.wo_qty_ord) -  Number(wo.wo_qty_comp) - Number(item.tr_qty_loc),
            wo_status:stat, 
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: wo.id })
          await inventoryTransactionServiceInstance.create({
            ...item,
            ...it,
            tr_domain:user_domain,
            tr_qty_chg: Number(item.tr_qty_loc),
            tr_loc_begin: Number(qtyoh),
            tr_type: 'RCT-WO',
            tr_date: new Date(),
            tr_mtl_std: sct.sct_mtl_tl,
            tr_lbr_std: sct.sct_lbr_tl,
            tr_bdn_std: sct.sct_bdn_tl,
            tr_ovh_std: sct.sct_ovh_tl,
            tr_sub_std: sct.sct_sub_tl,
            tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        
            tr_price : Number(sct.sct_cst_tot),
            tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(sct.sct_cst_tot),
            tr_addr:routing,
            tr_user1:emp,
            created_by: user_code,
            // created_ip_adr: req.headers.origin,
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          });
        
      
      
    }
    return res.status(200).json({ message: 'Added succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const rjctWo = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it } = req.body;
    
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);
    const workOrderServiceInstance = Container.get(workOrderService);
    
    for (const data of detail) {
      const { desc, ...item } = data;
      const pt = await itemServiceInstance.findOne({ pt_part: it.tr_part , pt_domain:user_domain});

      const ld = await locationDetailServiceInstance.findOne({
        ld_domain:user_domain,
        ld_part: it.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
        ld_ref: item.tr_ref,
        
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      else {
        
        const status = await statusServiceInstance.findOne({
          is_domain:user_domain,
          is_status: item.tr_status,
        });

        await locationDetailServiceInstance.create({
          ld_domain:user_domain,
          ld_part: it.tr_part,
          ld_lot: item.tr_serial,
          ld_date: new Date(),
          ld_site: item.tr_site,
          ld_loc: item.tr_loc,
          ld_status: item.tr_status,
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          ld_ref: item.tr_ref,
          ld__log01: status.is_nettable,
          ld_grade:item.tr_grade,
          chr01:pt.pt_draw,
          chr02:pt.pt_break_cat,
          chr03:pt.pt_group
        });
      }
      let qtyoh = 0;
      if (ld) {
        qtyoh = Number(ld.ld_qty_oh);
      } else {
        qtyoh = 0;
      }
      const sct = await costSimulationServiceInstance.findOne({
        sct_domain:user_domain,
        sct_part: it.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });
      const wo = await workOrderServiceInstance.findOne({ id: it.tr_lot });
      let routing : any;
      let emp: any;
      // for  (let ofs of wo){routing = ofs.wo_routing, emp = ofs.wo_user1}
      routing = wo.wo_routing
      emp = wo.wo_user1
     
      if (wo)
        await workOrderServiceInstance.update(
          {
            wo_qty_rjct: Number(wo.wo_qty_rjct) + Number(item.tr_qty_loc),
            wo_yield_pct: (Number(wo.wo_qty_rjct) + Number(item.tr_qty_loc)) / (Number(wo.wo_qty_comp) + Number(wo.wo_qty_rjct) + Number(item.tr_qty_loc)) ,
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: wo.id })
          await inventoryTransactionServiceInstance.create({
            ...item,
            ...it,
            tr_domain:user_domain,
            tr_qty_chg: Number(item.tr_qty_loc),
            tr_loc_begin: Number(qtyoh),
            tr_type: 'RJCT-WO',
            tr_date: new Date(),
            tr_mtl_std: sct.sct_mtl_tl,
            tr_lbr_std: sct.sct_lbr_tl,
            tr_bdn_std: sct.sct_bdn_tl,
            tr_ovh_std: sct.sct_ovh_tl,
            tr_sub_std: sct.sct_sub_tl,
            tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        
            tr_price : Number(sct.sct_cst_tot),
            tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(sct.sct_cst_tot),
            tr_addr:routing,
            tr_user1:emp,
            created_by: user_code,
            created_ip_adr: req.headers.origin,
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          });
        
      
      
    }
    return res.status(200).json({ message: 'Added succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const issWoD = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;
  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, user } = req.body;
    
    
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const workOrderDetailServiceInstance = Container.get(workOrderDetailService);
    const service = Container.get(MobileService);
    const currentService = await service.findOne({ role_code: user, service_open: true,service_domain:user_domain });
    for (const item of detail) {
      
      
      const sct = await costSimulationServiceInstance.findOne({
        sct_domain:user_domain,
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });

      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part,pt_domain:user_domain});
      const ld = await locationDetailServiceInstance.findOne({
        ld_domain:user_domain,
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
        ld_ref: item.tr_ref,
      });
      
      if (ld) {
        
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
        await inventoryTransactionServiceInstance.create({
          ...item,
          tr_domain:user_domain,
          tr_gl_date: currentService.service_period_activate_date,
          tr_qty_loc: -1 * Number(item.tr_qty_loc),
          tr_qty_chg: -1 * Number(item.tr_qty_loc),
          tr_loc_begin: Number(ld.ld_qty_oh),
          tr_type: 'ISS-WO',
          tr_date: new Date(),
          tr_effdate: currentService.service_period_activate_date,
          tr_price: sct.sct_mtl_tl,
          tr_mtl_std: sct.sct_mtl_tl,
          tr_lbr_std: sct.sct_lbr_tl,
          tr_bdn_std: sct.sct_bdn_tl,
          tr_ovh_std: sct.sct_ovh_tl,
          tr_sub_std: sct.sct_sub_tl,
          tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_grade:ld.ld_grade,
        tr_batch:ld.ld__chr01,
        dec01:Number(new Date(item.tr_effdate).getFullYear()),
        dec02:Number(new Date(item.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
          tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        });
        await locationDetailServiceInstance.delete({
          ld_lot: item.tr_nbr,
        });
      }
      // if (!isNaN(item.wodid)) {
      //   const wod = await workOrderDetailServiceInstance.findOne({ id: item.wodid });
      //   if (wod) {
      //     var bool = false;

      //     if (
      //       Number(wod.wod_qty_req) - (Number(wod.wod_qty_iss) + Number(item.tr_qty_loc) * Number(item.tr_um_conv)) >=
      //       0
      //     ) {
      //       bool = true;
      //     }
      //     await workOrderDetailServiceInstance.update(
      //       {
      //         wod__qadl01: true ? bool : false,
      //         wod_qty_iss: Number(wod.wod_qty_iss) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
      //         last_modified_by: user_code,
      //         last_modified_ip_adr: req.headers.origin,
      //       },
      //       { id: wod.id },
      //     );
      //   }
      // } else {
      //   await workOrderDetailServiceInstance.create({
      //     wod_nbr: it.tr_nbr,
      //     wod_lot: it.tr_lot,
      //     wod_part: item.tr_part,
      //     wod_qty_req: 0,
      //     wod_qty_iss: item.tr_qty_loc,
      //     wod_site: item.tr_site,
      //     wod_loc: item.tr_loc,
      //     wod_um: item.tr_um,
      //     wod_serial: item.tr_serial,
      //     wod_ref: item.tr_ref,
      //     wod__qadl01: true,
      //   });
      // }
    }
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

// const issSo = async (req: Request, res: Response, next: NextFunction) => {
//   const logger = Container.get('logger');
//   const { user_code } = req.headers;
//   logger.debug('Calling update one  code endpoint');
//   try {
//     const { detail, it } = req.body;
//     
//     const saleOrderServiceInstance = Container.get(SaleOrderService);
//     const saleOrderDetailServiceInstance = Container.get(SaleOrderDetailService);
//     const costSimulationServiceInstance = Container.get(costSimulationService);
//     const locationDetailServiceInstance = Container.get(locationDetailService);
//     const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
//     const itemsServiceInstance = Container.get(itemService);
//     for (const item of detail) {
//       
//       const { ...remain } = item;
//       
//       const sctdet = await costSimulationServiceInstance.findOne({
//         sct_part: remain.tr_part,
//         sct_site: remain.tr_site,
//         sct_sim: 'STD-CG',
//       });
//       const pt = await itemsServiceInstance.findOne({ pt_part: remain.tr_part });
//       
//       const ld = await locationDetailServiceInstance.findOne({
//         ld_part: remain.tr_part,
//         // ld_lot: remain.tr_nbr,
//         ld_site: remain.tr_site,
//         ld_loc: remain.tr_loc,
//       });
//       if (ld) {
//         await inventoryTransactionServiceInstance.create({
//           tr_line: remain.tr_line,
//           tr_part: remain.tr_part,
//           tr_desc:pt.pt_desc1,
        // tr_prod_line: pt.pt_prod_line,
        // tr__chr01:pt.pt_draw,
        // tr__chr02:pt.pt_break_cat,
        // tr__chr03:pt.pt_group,
//           tr_qty_loc: -Number(remain.tr_qty_loc),
//           tr_um: pt.pt_um,
//           tr_um_conv: remain.tr_um_conv,
//           tr_price: remain.tr_price,
//           tr_site: remain.tr_site,
//           tr_loc: remain.tr_loc,
//           tr_serial: remain.tr_serial,
//           tr_nbr: remain.tr_nbr,
//           tr_lot: remain.tr_lot,
//           // tr_addr: so.so_cust,
//           tr_effdate: it,
//           tr_so_job: null,
//           tr_curr: 'DZD',
//           tr_ex_rate: 1,
//           tr_ex_rate2: 1,

//           tr_type: 'ISS-SO',
//           tr_qty_chg: Number(remain.tr_qty_chg),
//           tr_loc_begin: Number(ld.ld_qty_oh),
//           tr_gl_amt: Number(remain.tr_qty_chg) * sctdet.sct_cst_tot,
//           tr_date: new Date(),
//           tr_mtl_std: sctdet.sct_mtl_tl,
//           tr_lbr_std: sctdet.sct_lbr_tl,
//           tr_bdn_std: sctdet.sct_bdn_tl,
//           tr_ovh_std: sctdet.sct_ovh_tl,
//           tr_sub_std: sctdet.sct_sub_tl,
//           created_by: user_code,
//           created_ip_adr: req.headers.origin,
//           last_modified_by: user_code,
//           last_modified_ip_adr: req.headers.origin,
//         });

//         if (remain.sod_type != 'M') {
//           const ld = await locationDetailServiceInstance.findOne({
//             ld_part: remain.tr_part,
//             ld_lot: remain.tr_nbr,
//             ld_site: remain.tr_site,
//             ld_loc: remain.tr_loc,
//           });
//           if (ld)
//             await locationDetailServiceInstance.update(
//               {
//                 ld_qty_oh: Number(ld.ld_qty_oh) - Number(remain.tr_qty_chg) * Number(remain.tr_um_conv),

//                 last_modified_by: user_code,
//                 last_modified_ip_adr: req.headers.origin,
//               },
//               { id: ld.id },
//             );
//         }
//         // else
//         //   await locationDetailServiceInstance.create({
//         //     ld_part: remain.tr_part,
//         //     ld_date: new Date(),
//         //     ld_lot: remain.tr_serial,
//         //     ld_site: remain.tr_site,
//         //     ld_loc: remain.tr_loc,
//         //     ld_qty_oh: -(Number(remain.tr_qty_loc) * Number(remain.tr_um_conv)),
//         //     created_by: user_code,
//         //     created_ip_adr: req.headers.origin,
//         //     last_modified_by: user_code,
//         //     last_modified_ip_adr: req.headers.origin,
//         //   });
//       }
//     }
//     const itemServiceInstance = Container.get(itemService);
//     return res.status(200).json({ message: 'deleted succesfully', data: true });
//   } catch (e) {
//     logger.error('🔥 error: %o', e);
//     return next(e);
//   }
// };
const cycCnt = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;
  
  const { detail } = req.body;
  
  logger.debug('Calling update one  code endpoint');
  try {
    const { detail } = req.body;

    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
    const itemsServiceInstance = Container.get(itemService);
    const service = Container.get(MobileService);
    const currentService = await service.findOne({ role_code: user_code, service_open: true,service_domain:user_domain });
    
    for (const item of detail) {
      const { ...remain } = item;
      
      if (remain.tag_cnt_qty !== undefined) {
        const sctdet = await costSimulationServiceInstance.findOne({
          sct_domain:user_domain,
          sct_part: remain.ld_part,
          sct_site: remain.ld_site,
          sct_sim: 'STD-CG',
        });
        const pt = await itemsServiceInstance.findOne({ pt_part: remain.ld_part ,pt_domain:user_domain});
       
        const ld = await locationDetailServiceInstance.findOne({
          ld_domain:user_domain,
          ld_part: remain.ld_part,
          ld_lot: remain.ld_lot,
          ld_site: remain.ld_site,
          ld_loc: remain.ld_loc,
        });
        item.tag_cnt_qty == undefined && (item.tag_cnt_qty = 0);
        await inventoryTransactionServiceInstance.create({
          tr_line: 0,
          tr_domain:user_domain,
          tr_part: remain.ld_part,
          tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr_grade:remain.tr_grade,
        tr_batch:remain.tr_batch,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date(remain.tr_effdate).getFullYear()),
        dec02:Number(new Date(remain.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
          tr_qty_loc: Number(remain.tag_cnt_qty) - Number(ld.ld_qty_oh),
          tr_um: pt.pt_um,
          tr_um_conv: 1,
          tr_price: sctdet.sct_cst_tot,
          tr_site: remain.ld_site,
          tr_loc: remain.ld_loc,
          tr_serial: remain.ld_lot,
          tr_nbr: new Date().toString(),
          tr_lot: '',
          // tr_addr: so.so_cust,
          tr_effdate: currentService.service_period_activate_date,
          tr_so_job: null,
          tr_curr: 'DZD',
          tr_ex_rate: 1,
          tr_ex_rate2: 1,
          tr_ship_type: 'M',
          tr_type: 'CYC-CNT',
          tr_qty_chg: Number(remain.tag_cnt_qty),
          tr_loc_begin: parseFloat(ld.ld_qty_oh),
          tr_gl_amt: (Number(remain.tag_cnt_qty) - Number(ld.ld_qty_oh)) * Number(sctdet.sct_cst_tot),
          tr_date: new Date(),
          tr_mtl_std: sctdet.sct_mtl_tl,
          tr_lbr_std: sctdet.sct_lbr_tl,
          tr_bdn_std: sctdet.sct_bdn_tl,
          tr_ovh_std: sctdet.sct_ovh_tl,
          tr_sub_std: sctdet.sct_sub_tl,
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        });

        if (remain.ld_rev != 'M') {
          const ld = await locationDetailServiceInstance.findOne({
            ld_domain:user_domain,
            ld_part: remain.ld_part,
            ld_lot: remain.ld_lot,
            ld_site: remain.ld_site,
            ld_loc: remain.ld_loc,
          });
          if (ld) {
            let qty = Number(remain.tag_cnt_qty) > 0 ? Number(remain.tag_cnt_qty) : Number(ld.ld_qty_oh);
            
            await locationDetailServiceInstance.update(
              {
                ld_qty_oh: Number(qty),

                last_modified_by: user_code,
                last_modified_ip_adr: req.headers.origin,
              },
              { id: ld.id },
            );
          } else {
            let qty = Number(remain.tag_cnt_qty) > 0 ? Number(remain.tag_cnt_qty) : Number(ld.ld_qty_oh);

            await locationDetailServiceInstance.create({
              ld_domain:user_domain,
              ld_part: remain.tr_part,
              ld_date: new Date(),
              ld_lot: remain.ld_lot,
              ld_site: remain.ld_site,
              ld_loc: remain.ld_loc,
              ld_grade:remain.tr_grade,
              ld__chr01:remain.tr_batch,
              ld_qty_oh: qty,
              chr01:pt.pt_draw,
              chr02:pt.pt_break_cat,
              chr03:pt.pt_group,
              created_by: user_code,
              created_ip_adr: req.headers.origin,
              last_modified_by: user_code,
              last_modified_ip_adr: req.headers.origin,
            });
          }
        } else {
          const ld = await locationDetailServiceInstance.findOne({
            ld_domain:user_domain,
            ld_part: remain.ld_part,
            ld_lot: remain.ld_lot,
            ld_site: remain.ld_site,
            ld_loc: remain.ld_loc,
          });
          if (ld)
            await locationDetailServiceInstance.update(
              {
                ld_qty_frz: Number(remain.tr_qty_chg),

                last_modified_by: user_code,
                last_modified_ip_adr: req.headers.origin,
              },
              { id: ld.id },
            );
        }
      }
    }
    const itemServiceInstance = Container.get(itemService);
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const cycRcnt = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;
  
  const { detail } = req.body;
  
  logger.debug('Calling update one  code endpoint');
  try {
    const { detail } = req.body;

    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
    const itemsServiceInstance = Container.get(itemService);
    const service = Container.get(MobileService);
    const currentService = await service.findOne({ role_code: user_code, service_open: true ,service_domain:user_domain});
    for (const item of detail) {
      const { ...remain } = item;
      
      if (remain.tag_cnt_qty !== undefined) {
        const sctdet = await costSimulationServiceInstance.findOne({
          sct_domain:user_domain,
          sct_part: remain.ld_part,
          sct_site: remain.ld_site,
          sct_sim: 'STD-CG',
        });
        const pt = await itemsServiceInstance.findOne({ pt_part: remain.ld_part ,pt_domain:user_domain});
     
        const ld = await locationDetailServiceInstance.findOne({
          ld_domain:user_domain,
          ld_part: remain.ld_part,
          ld_lot: remain.ld_lot,
          ld_site: remain.ld_site,
          ld_loc: remain.ld_loc,
        });
        item.tag_cnt_qty = undefined && (item.tag_cnt_qty = 0);
        await inventoryTransactionServiceInstance.create({
          tr_domain:user_domain,
          // tr_line: remain.tr_line,
          tr_part: remain.ld_part,
          tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date(remain.tr_effdate).getFullYear()),
        dec02:Number(new Date(remain.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        tr_batch:remain.tr_batch,
        tr_grade:remain.tr_grade,
          tr_qty_loc: Number(remain.tag_cnt_qty) - Number(ld.ld_qty_oh),
          tr_um: pt.pt_um,
          tr_um_conv: 1,
          tr_price: sctdet.sct_cst_tot,
          tr_site: remain.ld_site,
          tr_loc: remain.ld_loc,
          tr_serial: remain.ld_lot,
          tr_nbr: new Date().toString(),
          tr_lot: '',
          // tr_addr: so.so_cust,
          tr_effdate: currentService.service_period_activate_date,
          tr_so_job: null,
          tr_curr: 'DZD',
          tr_ex_rate: 1,
          tr_ex_rate2: 1,
          tr_ship_type: null,
          tr_type: 'CYC-RCNT',
          tr_qty_chg: Number(remain.tag_cnt_qty),
          tr_loc_begin: parseFloat(ld.ld_qty_oh),
          tr_gl_amt: (Number(remain.tag_cnt_qty) - Number(ld.ld_qty_oh)) * sctdet.sct_cst_tot,
          tr_date: new Date(),
          tr_mtl_std: sctdet.sct_mtl_tl,
          tr_lbr_std: sctdet.sct_lbr_tl,
          tr_bdn_std: sctdet.sct_bdn_tl,
          tr_ovh_std: sctdet.sct_ovh_tl,
          tr_sub_std: sctdet.sct_sub_tl,
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        });

        if (remain.ld_rev != 'M') {
          const ld = await locationDetailServiceInstance.findOne({
            ld_domain:user_domain,
            ld_part: remain.ld_part,
            ld_lot: remain.ld_lot,
            ld_site: remain.ld_site,
            ld_loc: remain.ld_loc,
          });

          if (ld) {
            let qty = Number(remain.tag_cnt_qty) > 0 ? Number(remain.tag_cnt_qty) : Number(ld.ld_qty_oh);
           
            await locationDetailServiceInstance.update(
              {
                ld_qty_oh: Number(qty),

                last_modified_by: user_code,
                last_modified_ip_adr: req.headers.origin,
              },
              { id: ld.id },
            );
          } else {
            let qty = Number(remain.tag_cnt_qty) > 0 ? Number(remain.tag_cnt_qty) : Number(ld.ld_qty_oh);

            await locationDetailServiceInstance.create({
              ld_domain:user_domain,
              ld_part: remain.tr_part,
              ld_date: new Date(),
              ld_lot: remain.ld_lot,
              ld_site: remain.ld_site,
              ld_loc: remain.ld_loc,
              ld_qty_oh: qty,
              ld_grade:remain.tr_grade,
              ld__chr01:remain.tr_batch,
              chr01:pt.pt_draw,
              chr02:pt.pt_break_cat,
              chr03:pt.pt_group,
              created_by: user_code,
              created_ip_adr: req.headers.origin,
              last_modified_by: user_code,
              last_modified_ip_adr: req.headers.origin,
            });
          }
        }
      }
    }
    const itemServiceInstance = Container.get(itemService);
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const findDayly1 = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const { user_domain } = req.headers;
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const itemServiceInstance = Container.get(itemService);
    
    const parts = await inventoryTransactionServiceInstance.findSpecial({
      where: {
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.tr_effdate,
      },
      attributes: ['tr_part', 'tr_site', 'tr_effdate', 'tr_serial'],
      group: ['tr_part', 'tr_site', 'tr_effdate', 'tr_serial'],
      raw: true,
    });
    const tr = await inventoryTransactionServiceInstance.findSpecial({
      where: {
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.tr_effdate,
      },
      attributes: [
        'tr_part',
        'tr_site',
        'tr_effdate',
        'tr_type',
        'tr_serial',
        [Sequelize.fn('sum', Sequelize.col('tr_qty_loc')), 'qty'],
        [Sequelize.fn('sum', Sequelize.col('tr_loc_begin')), 'qtybeg'],
        [Sequelize.fn('sum', Sequelize.col('tr_qty_chg')), 'qtychg'],
      ],
      group: ['tr_part', 'tr_site', 'tr_effdate', 'tr_type', 'tr_serial'],
      raw: true,
    });
   
    let result = [];
    var i = 1;
    for (let part of parts) {
   
      const items = await itemServiceInstance.findOnedesc({ pt_part: part.tr_part ,pt_domain:user_domain});
      const cyccnt = tr.findIndex(
        ({ tr_site, tr_part, tr_type, tr_serial }) =>
          tr_site == part.tr_site && tr_part == part.tr_part && tr_serial == part.tr_serial && tr_type == 'CYC-CNT',
      );
      const cycrcnt = tr.findIndex(
        ({ tr_site, tr_part, tr_type, tr_serial }) =>
          tr_site == part.tr_site && tr_part == part.tr_part && tr_serial == part.tr_serial && tr_type == 'CYC-RCNT',
      );
      const rctpo = tr.findIndex(
        ({ tr_site, tr_part, tr_type, tr_serial }) =>
          tr_site == part.tr_site && tr_part == part.tr_part && tr_serial == part.tr_serial && tr_type == 'RCT-PO',
      );
      const issso = tr.findIndex(
        ({ tr_site, tr_part, tr_type, tr_serial }) =>
          tr_site == part.tr_site && tr_part == part.tr_part && tr_serial == part.tr_serial && tr_type == 'ISS-SO',
      );
      const isswo = tr.findIndex(
        ({ tr_site, tr_part, tr_type, tr_serial }) =>
          tr_site == part.tr_site && tr_part == part.tr_part && tr_serial == part.tr_serial && tr_type == 'ISS-WO',
      );

      let qtyso = 0;
      let qtywo = 0;

      const trcycmax = await inventoryTransactionServiceInstance.max({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.tr_effdate,
        tr_part: part.tr_part,
        tr_serial: part.tr_serial,
        tr_type: 'CYC-CNT',
      });
      const trcycmin = await inventoryTransactionServiceInstance.min({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.tr_effdate,
        tr_part: part.tr_part,
        tr_serial: part.tr_serial,
        tr_type: 'CYC-CNT',
      });

      const cntmax = await inventoryTransactionServiceInstance.findOneI({ id: trcycmax });
      const cntmin = await inventoryTransactionServiceInstance.findOneI({ id: trcycmin });
      const trrcycmax = await inventoryTransactionServiceInstance.max({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.tr_effdate,
        tr_part: part.tr_part,
        tr_serial: part.tr_serial,
        tr_type: 'CYC-RCNT',
      });
      const trrcycmin = await inventoryTransactionServiceInstance.min({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.tr_effdate,
        tr_part: part.tr_part,
        tr_serial: part.tr_serial,
        tr_type: 'CYC-RCNT',
      });

      const rcntmax = await inventoryTransactionServiceInstance.findOneI({ id: trrcycmax });
      const rcntmin = await inventoryTransactionServiceInstance.findOneI({ id: trrcycmin });

      issso >= 0 ? (qtyso = -Number(tr[issso].qty)) : 0, isswo >= 0 ? (qtywo = -Number(tr[isswo].qty)) : 0;

      var qtyinv = cycrcnt >= 0 ? Number(rcntmax.tr_qty_chg) : 0;
      var qtyrecu = rctpo >= 0 ? Number(tr[rctpo].qty) : 0;
      var qtyinvf = cyccnt >= 0 ? Number(cntmax.tr_qty_chg) : 0;
      result.push({
        id: i,
        part: part.tr_part,
        desc: items.pt_desc1,
        serial: part.serial,
        qtyinvbeg: cycrcnt >= 0 ? Number(rcntmin.tr_loc_begin) : 0,
        qtyinvdeb: cycrcnt >= 0 ? Number(rcntmax.tr_qty_chg) : 0,
        ecartdeb: cycrcnt >= 0 ? Number(rcntmax.tr_qty_chg) - Number(rcntmin.tr_loc_begin) : 0,
        qtyrec: rctpo >= 0 ? Number(tr[rctpo].qty) : 0,
        qtyiss: Number(qtyso) + Number(qtywo),
        qtyissr: qtyinv + qtyrecu - qtyinvf,
        qtyrest: cyccnt >= 0 ? Number(cntmin.tr_loc_begin) : 0,
        qtyinvfin: cyccnt >= 0 ? Number(cntmax.tr_qty_chg) : 0,
        ecartfin: cyccnt >= 0 ? Number(cntmax.tr_qty_chg) - Number(cntmin.tr_loc_begin) : 0,
      });
      i = i + 1;
    }
    return res.status(200).json({ message: 'fetched succesfully', data: result });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findtrDate = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  
  logger.debug('Calling find by  all saleOrder endpoint');
  const { user_domain } = req.headers;
  try {
    
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const tr = await inventoryTransactionServiceInstance.findSpec({
      tr_domain:user_domain,
      tr_effdate: { [Op.between]: [req.body.date, req.body.date1] },
      
    });
    
    
    return res.status(201).json({ message: 'created succesfully', data: tr });
    //return res2.status(201).json({ message: 'created succesfully', data: results_body });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const findtrDateAddr = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  
  logger.debug('Calling find by  all saleOrder endpoint');
  const { user_domain } = req.headers;
  try {
    console.log(req.body.tr_addr)
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const tr = await inventoryTransactionServiceInstance.findSpec({
      tr_domain:user_domain,
      tr_effdate: req.body.date,
      tr_addr : req.body.tr_addr,
      tr_type:'RCT-WO',
      
    });
    
    
    return res.status(201).json({ message: 'created succesfully', data: tr });
    //return res2.status(201).json({ message: 'created succesfully', data: results_body });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findTrType = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const { user_domain } = req.headers;
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const itemServiceInstance = Container.get(itemService);

    const trs = await inventoryTransactionServiceInstance.findSpecial({
      where: {
        tr_domain:user_domain,
        tr_effdate: { [Op.between]: [req.body.date, req.body.date1] },
      },
      attributes: [
        'tr_part',
        'tr_site',
        'tr_effdate',
        'tr_type',
        'tr_serial',
        'tr_expire',
        [Sequelize.fn('sum', Sequelize.col('tr_qty_loc')), 'qty'],
        [Sequelize.fn('sum', Sequelize.col('tr_gl_amt')), 'amt'],
      ],
      group: ['tr_part', 'tr_site', 'tr_effdate', 'tr_type', 'tr_serial', 'tr_expire'],
      raw: true,
    });

    let result = [];
    var i = 1;
    for (let tr of trs) {
      
      const items = await itemServiceInstance.findOnedesc({ pt_part: tr.tr_part,pt_domain:user_domain });
      const effdate = new Date(tr.tr_effdate);
      result.push({
        id: i,
        desc: items.pt_desc1,
        um: items.pt_um,
        tr_part: tr.tr_part,
        tr_site: tr.tr_site,
        tr_effdate: effdate.getFullYear() + '-' + (effdate.getMonth() + 1) + '-' + effdate.getUTCDate(),
        tr_type: tr.tr_type,
        tr_serial: tr.tr_serial,
        tr_expire: tr.tr_serial,
        qty: tr.qty,
        amt: tr.amt,
      });
      i = i + 1;
    }
    
    return res.status(200).json({ message: 'fetched succesfully', data: result });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const findByInv = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_domain } = req.headers;
  logger.debug('Calling find by  all code endpoint');
  if (req.body.site != '*') {
    try {
      const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);

      const tr = await inventoryTransactionServiceInstance.finditem({
        tr_domain:user_domain,
        tr_site: req.body.site,
        tr_type: req.body.type,
        tr_effdate: req.body.date,
      });
      for (let t of tr) {
        (t.tr_desc = t.item.pt_desc1), (t.tr_um = t.item.pt_um);
      }
      
      return res.status(200).json({ message: 'fetched succesfully', data: tr });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  } else {
    try {
      const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);

      const tr = await inventoryTransactionServiceInstance.finditem({
        tr_domain:user_domain,
        tr_type: req.body.type,
        tr_effdate: req.body.date,
      });
      for (let t of tr) {
        (t.tr_desc = t.item.pt_desc1), (t.tr_um = t.item.pt_um);
      }
      return res.status(200).json({ message: 'fetched succesfully', data: tr });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  }
};
const findByRct = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');

  const { user_domain } = req.headers;
  if (req.body.site != '*') {
    try {
      const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
      const itemServiceInstance = Container.get(itemService);

   
      const tr = await inventoryTransactionServiceInstance.findbetw({
        where: {
          tr_domain:user_domain,
          tr_site: req.body.site,
          tr_type: req.body.type,
          tr_effdate: { [Op.between]: [req.body.date, req.body.date1] },
        },
      });
     
      for (let t of tr) {
        const item = await itemServiceInstance.findOne({ pt_part: t.tr_part, pt_domain:user_domain });
       
        t.tr_desc = item.pt_desc1,
        t.tr_um = item.pt_um,
        t.tr_addr = item.pt_vend,
        t.chr01 = item.pt_buyer,
        t.dec05 = Number(t.tr_qty_loc) * Number(t.tr_price);
      }

      return res.status(200).json({ message: 'fetched succesfully', data: tr });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  } else {
    try {
      const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
      const itemServiceInstance = Container.get(itemService);

      const tr = await inventoryTransactionServiceInstance.findbetw({
        where: { tr_domain:user_domain,tr_type: req.body.type, tr_effdate: { [Op.between]: [req.body.date, req.body.date1] } },
      });
      for (let t of tr) {
        const item = await itemServiceInstance.findOne({ pt_part: t.tr_part,pt_domain:user_domain });
        t.tr_desc = item.pt_desc1,
        t.tr_um = item.pt_um,
        t.tr_addr = item.pt_vend,
        t.chr01 = item.pt_buyer,
        t.dec05 = Number(t.tr_qty_loc) * Number(t.tr_price);
      }
      
      return res.status(200).json({ message: 'fetched succesfully', data: tr });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  }
};

const consoReport = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const { user_domain } = req.headers;
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const itemServiceInstance = Container.get(itemService);
    const PosOrderDetailServiceInstance = Container.get(PosOrderDetail);
    const codeServiceInstance = Container.get(CodeService);
    

    var sansbo = await PosOrderDetailServiceInstance.findspec({
      where: {
        created_date: req.body.created_date,
        usrd_site: req.body.tr_site,
        pt_part_type: { [Op.ne]: 'BO' },
      },
      attributes: [
        // 'pt_part',
        //  'usrd_site',
        // [Sequelize.fn('sum', Sequelize.col('pt_qty_ord_pos')), 'total_qty'],
        [Sequelize.fn('sum', Sequelize.col('pt_price_pos')), 'amt_sansbo'],
      ],
      // group: ['usrd_site'],
      raw: true,
    });

    var avecbo = await PosOrderDetailServiceInstance.findspec({
      where: {
        created_date: req.body.created_date,
        usrd_site: req.body.tr_site,
        //pt_part_type: 'BO'
      },
      attributes: [
        // 'pt_part',
        //  'usrd_site',
        // [Sequelize.fn('sum', Sequelize.col('pt_qty_ord_pos')), 'total_qty'],
        [Sequelize.fn('sum', Sequelize.col('pt_price_pos')), 'total_amt'],
      ],
      // group: ['usrd_site'],
      raw: true,
    });
    

    const parts = await itemServiceInstance.find({ pt_domain:user_domain,pt_cyc_int: 1, pt_part_type: { [Op.ne]: 'BO' } });
    let results = [];
    var i = 1;
    for (let items of parts) {
      const codes = await codeServiceInstance.findOne({ code_domain:user_domain,code_fldname: 'pt_part_type', code_value: items.pt_part_type });
      if (codes == null) {
      
      }
      const trrcycmax = await inventoryTransactionServiceInstance.max({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.created_date,
        tr_part: items.pt_part,
        tr_type: 'CYC-RCNT',
      });
      const rcntmax = await inventoryTransactionServiceInstance.findOneI({ id: trrcycmax });
      const rctpo = await inventoryTransactionServiceInstance.findOneI({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.created_date,
        tr_part: items.pt_part,
        tr_type: 'RCT-PO',
      });

      const trcycmax = await inventoryTransactionServiceInstance.max({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.created_date,
        tr_part: items.pt_part,
        tr_type: 'CYC-CNT',
      });

      const cntmax = await inventoryTransactionServiceInstance.findOneI({ id: trcycmax });
      const purprice = await inventoryTransactionServiceInstance.findOneI({
        tr_domain:user_domain,
        tr_part: items.pt_part,
        tr_type: 'RCT-PO',
        tr_effdate: req.body.created_date,
      });

      let cnt = cntmax != null ? Number(cntmax.tr_qty_chg) : 0;
      let invt = rcntmax != null ? Number(rcntmax.tr_qty_chg) : 0;
      let achatt = rctpo != null ? Number(rctpo.tr_qty_loc) : 0;
      let cons = invt + achatt - cnt;
      let price = purprice != null ? purprice.tr_price : items.pt_pur_price;

      const trs = await inventoryTransactionServiceInstance.findSpecial({
        where: {
          tr_domain:user_domain,
          tr_effdate: req.body.created_date,
          tr_site: req.body.tr_site,
          tr_part: items.pt_part,
          tr_type: 'ISS-WO',
        },
        attributes: [[Sequelize.fn('sum', Sequelize.col('tr_qty_loc')), 'qty']],
        //group: ['tr_part', 'tr_site', 'tr_effdate', 'tr_type', 'tr_serial', 'tr_expire'],
        raw: true,
      });
      let trsv = trs != null ? -Number(trs[0].qty) : 0;
     
      if (achatt != 0 || invt != 0 || cons != 0 || trsv != 0) {
        results.push({
          id: i,
          famille: codes.code_cmmt,
          part: items.pt_part,
          desc: items.pt_desc1,
          um: items.pt_um,
          pu: price,
          achat: achatt,
          inv: invt,
          cnt: cnt,
          avarie: 0,
          conso: cons,
          vendue: trsv,
          ecart: Number(trsv) - Number(cons),
          vecart: (Number(trsv) - Number(cons)) * price,
          persent: (Number(cons) * Number(price)) / Number(sansbo[0].amt_sansbo),
          rank: items.int01,
        });
        i = i + 1;
      }
    }

    /*boisson*/
    const boparts = await itemServiceInstance.find({ pt_domain:user_domain,pt_cyc_int: 1, pt_part_type: 'BO' });
    let boresults = [];
    var j = 1;
    for (let boitems of boparts) {
      const codes = await codeServiceInstance.findOne({
        code_domain:user_domain,
        code_fldname: 'pt_part_type',
        code_value: boitems.pt_part_type,
      });
      if (codes == null) {
    
      }
      const trrcycmax = await inventoryTransactionServiceInstance.max({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.created_date,
        tr_part: boitems.pt_part,
        tr_type: 'CYC-RCNT',
      });

      const rcntmax = await inventoryTransactionServiceInstance.findOneI({ id: trrcycmax });

      const rctpo = await inventoryTransactionServiceInstance.findOneI({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.created_date,
        tr_part: boitems.pt_part,
        tr_type: 'RCT-PO',
      });

      const trcycmax = await inventoryTransactionServiceInstance.max({
        tr_domain:user_domain,
        tr_site: req.body.tr_site,
        tr_effdate: req.body.created_date,
        tr_part: boitems.pt_part,
        tr_type: 'CYC-CNT',
      });

      const cntmax = await inventoryTransactionServiceInstance.findOneI({ id: trcycmax });
      const purprice = await inventoryTransactionServiceInstance.findOneI({
        tr_domain:user_domain,
        tr_part: boitems.pt_part,
        tr_type: 'RCT-PO',
        tr_effdate: req.body.created_date,
      });

      let cnt = cntmax != null ? Number(cntmax.tr_qty_chg) : 0;
      let invt = rcntmax != null ? Number(rcntmax.tr_qty_chg) : 0;
      let achatt = rctpo != null ? Number(rctpo.tr_qty_loc) : 0;
      let cons = invt + achatt - cnt;
      let price = purprice != null ? purprice.tr_price : boitems.pt_pur_price;

      const trs = await inventoryTransactionServiceInstance.findSpecial({
        where: {
          tr_domain:user_domain,
          tr_effdate: req.body.created_date,
          tr_site: req.body.tr_site,
          tr_part: boitems.pt_part,
          tr_type: 'ISS-WO',
        },
        attributes: [[Sequelize.fn('sum', Sequelize.col('tr_qty_loc')), 'qty']],
        //group: ['tr_part', 'tr_site', 'tr_effdate', 'tr_type', 'tr_serial', 'tr_expire'],
        raw: true,
      });
      let trsv = trs != null ? -Number(trs[0].qty) : 0;
    
      if (achatt != 0 || invt != 0 || cons != 0 || trsv != 0) {
        boresults.push({
          id: j,
          bofamille: codes.code_cmmt,
          bopart: boitems.pt_part,
          bodesc: boitems.pt_desc1,
          boum: boitems.pt_um,
          bopu: price,
          boachat: achatt,
          boinv: invt,
          bocnt: cnt,
          boavarie: 0,
          boconso: cons,
          bovendue: trsv,
          boecart: Number(trsv) - Number(cons),
          bovecart: (Number(trsv) - Number(cons)) * price,
          bopersent: (Number(cons) * Number(price)) / Number(avecbo[0].total_amt),
          borank: boitems.int01,
        });
        j = j + 1;
      }
    }
 
    results.sort((a,b)=> a.rank - b.rank )
    boresults.sort((a,b)=> a.borank - b.borank )
   // results.sort((a,b)=> (a.rank > b.rank) ? 1 : (a.rank < b.rank) ? -1 : 0);
    return res.status(200).json({
      message: 'fetched succesfully',
      data: { detail: results, bodetail: boresults, casansbo: sansbo[0].amt_sansbo, ca: avecbo[0].total_amt },
    });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const consoRange = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const { user_domain } = req.headers;
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const itemServiceInstance = Container.get(itemService);

    const trs = await inventoryTransactionServiceInstance.findSpecial({
      where: {
        tr_domain:user_domain,
        tr_effdate: { [Op.between]: [req.body.date, req.body.date1] },
        tr_site: req.body.usrd_site,
        tr_type: 'ISS-WO',
      },
      attributes: ['tr_part', [Sequelize.fn('sum', Sequelize.col('tr_qty_loc')), 'qty']],
      group: ['tr_part'],
      raw: true,
    });

    let result = [];
    var i = 1;
    for (let tr of trs) {
   
      const items = await itemServiceInstance.findOne({pt_domain:user_domain, pt_part: tr.tr_part, pt_cyc_int: null });
      if (items != null) {
        result.push({
          id: i,
          part: tr.tr_part,
          desc1: items.pt_desc1,
          um: items.pt_um,
          qty: -Number(tr.qty),
          add_qty: 0,
          prod_qty: -Number(tr.qty),
        });
        i = i + 1;
      }
    }
   
    return res.status(200).json({ message: 'fetched succesfully', data: result });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findBySpec = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const { user_domain } = req.headers;
  try {
    const details = req.body.detail;
    const site = req.body.site;

    const itemServiceInstance = Container.get(ItemService);
    const ldServiceInstance = Container.get(LocationDetailService);
   
    const result = [];
    var j = 1;
    let dat = [];
    for (let obj of details) {
   

      const item = await itemServiceInstance.findOne({ pt_domain:user_domain,pt_part: obj.part });
      const lds = await ldServiceInstance.find({ ld_domain:user_domain,ld_part: obj.part, ld_site: site });
      var ldqty = 0;
      for (let ld of lds) {
        ldqty = ldqty + Number(ld.ld_qty_oh);
      }

      var qtyc = 0;
      //? ((Number(p.ps_qty_per) * Number(obj.prod_qty)) - Number(ldqty) + Number(item.pt_sfty_stk)) : 0
      if (obj.prod_qty - ldqty + Number(item.pt_sfty_stk) >= 0) {
        qtyc = obj.prod_qty - ldqty + Number(item.pt_sfty_stk);
      } else qtyc = 0;
  
      dat.push({
        id: obj.id,
        part: obj.part,
        qty: obj.qty,
        desc: item.pt_desc1,
        vend: item.pt_vend,
        um: item.pt_um,
        qtyoh: ldqty,
        sftystk: item.pt_sfty_stk,
        qtycom: qtyc,
        qtyval: Math.ceil(qtyc),
      });
    }
    //  for(let res of result){
    //      res.qtycom = res.qty - res.qtyoh
    //  }
   
    //const psServiceInstance = Container.get(PsService)
    //  const ps = await psServiceInstance.find({...req.body})
    return res.status(200).json({ message: 'fetched succesfully', data: dat });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findAllissSo = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling findAllissSo endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const transactions = await inventoryTransactionServiceInstance.findAllissSo();
    return res.status(200).json({ message: 'fetched succesfully', data: transactions });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};




const issWo = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const workOrderDetailServiceInstance = Container.get(workOrderDetailService);
    const workOrderServiceInstance = Container.get(workOrderService);

    for (const item of detail) {
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });


      
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part });
      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
        ld_ref: item.tr_ref,
      });

      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
        const wo = await workOrderServiceInstance.findOne({ id: it.tr_lot });
        let routing : any;
        let emp: any;
        // for  (let ofs of wo){routing = ofs.wo_routing, emp = ofs.wo_user1}
        routing = wo.wo_routing
        emp = wo.wo_user1
        
      if (wo)
        await inventoryTransactionServiceInstance.create({
         ...item,
         ...it,
         tr_domain: user_domain,
         tr_addr:routing,
         tr_user1:emp,
         tr_gl_date: it.tr_effdate,
         tr_qty_loc: -1 * Number(item.tr_qty_loc),
         tr_qty_chg: -1 * Number(item.tr_qty_loc),
         tr_loc_begin: Number(ld.ld_qty_oh),
         tr_type: 'ISS-WO',
         tr_date: new Date(),
         tr_price: sct.sct_mtl_tl,
         tr_mtl_std: sct.sct_mtl_tl,
         tr_lbr_std: sct.sct_lbr_tl,
         tr_bdn_std: sct.sct_bdn_tl,
         tr_ovh_std: sct.sct_ovh_tl,
         tr_sub_std: sct.sct_sub_tl,
         tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        tr_batch:ld.ld__chr01,
        tr_grade:ld.ld_grade,
         tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
         created_by: user_code,
         created_ip_adr: req.headers.origin,
         last_modified_by: user_code,
         last_modified_ip_adr: req.headers.origin,
      });
  if( !isNaN(item.wodid)) {
        const wod = await workOrderDetailServiceInstance.findOne({ id: item.wodid});
        if(wod)  {
          var bool = false

          if(Number(wod.wod_qty_req) - ( Number(wod.wod_qty_iss) + Number(item.tr_qty_loc) * Number(item.tr_um_conv)) >= 0) { bool = true}
          await workOrderDetailServiceInstance.update(
          {
            wod__qadl01 : true ? (bool) : false,
            wod_qty_iss: Number(wod.wod_qty_iss) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: wod.id },
        );
      } 
  }else {

    await workOrderDetailServiceInstance.create({
      wod_nbr     : it.tr_nbr,
      wod_lot     : it.tr_lot,
      wod_part    : item.tr_part,
      wod_qty_req : 0,
      wod_qty_iss : item.tr_qty_loc,
      wod_site    : item.tr_site,
      wod_loc     : item.tr_loc,
      wod_um      : item.tr_um,
      wod_serial  : item.tr_serial,
      wod_ref     : item.tr_ref,
      wod__qadl01 : true,

    })




  }

    }
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const issChlRef = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers 
  const{user_domain} = req.headers

  logger.debug('Calling update one  code endpoint');
  try {
    const it = req.body;
    
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);

    const ld = await locationDetailServiceInstance.find({
      ld_domain:user_domain,
      ld_ref: it.tr_ref,
    });
   
    for (let obj of ld) { 
   
    const sct = await costSimulationServiceInstance.findOne({
      sct_domain:user_domain,
      sct_part: obj.ld_part,
      sct_site: obj.ld_site,
      sct_sim: 'STD-CG',
    });
    const pt = await itemServiceInstance.findOne({ pt_part: obj.ld_part,pt_domain:user_domain });

   
    await inventoryTransactionServiceInstance.create({
      ...it,
      tr_serial: it.tr_vend_lot,
      tr_domain:user_domain,
      tr_status: obj.ld_status,
      tr_expire: obj.ld_expire,
      tr_ref: obj.tr_ref,
      tr_qty_loc: 0,
      tr_type: 'ISS-CHL',
      tr_line: 1,
      tr_um: obj.ld_um,
      tr_effdate: new Date(),
      tr_date: new Date(),
      tr_price: sct.sct_mtl_tl,
      tr_mtl_std: sct.sct_mtl_tl,
      tr_lbr_std: sct.sct_lbr_tl,
      tr_bdn_std: sct.sct_bdn_tl,
      tr_ovh_std: sct.sct_ovh_tl,
      tr_sub_std: sct.sct_sub_tl,
      tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date().getFullYear()),
        dec02:Number(new Date().getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        tr_batch:obj.ld__chr01,
        tr_grade:obj.ld_grade,
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });
   
      const status = await statusServiceInstance.findOne({
        is_domain:user_domain,
        is_status: it.tr_status,
      });
      await locationDetailServiceInstance.update(
        {
          ld_status: it.tr_status,
          ld_expire: it.tr_expire,
          ld_lot : it.tr_serial,
          ld__log01: status.is_nettable,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        },
        { id: obj.id },
      );
    
    await inventoryTransactionServiceInstance.create({
      ...it,
      tr_domain:user_domain,
      tr_ref: obj.tr_ref,
      tr_qty_loc: 0,
      tr_type: 'RCT-CHL',
      tr_line: 1,
      tr_um: obj.ld_um,
      tr_effdate: new Date(),
      tr_date: new Date(),
      tr_price: sct.sct_mtl_tl,
      tr_mtl_std: sct.sct_mtl_tl,
      tr_lbr_std: sct.sct_lbr_tl,
      tr_bdn_std: sct.sct_bdn_tl,
      tr_ovh_std: sct.sct_ovh_tl,
      tr_sub_std: sct.sct_sub_tl,
      tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        dec01:Number(new Date().getFullYear()),
        dec02:Number(new Date().getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        tr_grade:obj.ld_grade,
        tr_batch:obj.ld__chr01,
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });
  }
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findByCost = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const{user_code} = req.headers 
  const{user_domain} = req.headers
  try {
  
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const trs = await inventoryTransactionServiceInstance.findbetw({ where : {...req.body,tr_domain:user_domain,},
      attributes: {
         include: [[Sequelize.literal('-tr_qty_loc * tr__dec02'), 'tr__dec04'],[Sequelize.literal('-tr_qty_loc * tr_price'), 'tr__dec05']],
      },
    });
    for (let tr of trs) {
    
      if (tr.tr__dec04 == 0 ) {
        tr.tr__dec04 = tr.tr__dec05
      }
    }
   
    return res.status(200).json({ message: 'fetched succesfully', data: trs });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findByNbr = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const {user_domain} = req.headers;
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const itemServiceInstance = Container.get(itemService);

    const trs = await inventoryTransactionServiceInstance.findSpecial({
      where: {
        tr_domain:user_domain,
        ...req.body
      },
      attributes: [
        'tr_part',
        'tr_site',
        'tr_effdate',
        'tr_type',
        'tr_lot',
        'tr_um',
        [Sequelize.fn('sum', Sequelize.col('tr_qty_loc')), 'qty'],
        //[Sequelize.fn('sum', Sequelize.col('tr_gl_amt')), 'amt'],
      ],
      group: ['tr_part', 'tr_site', 'tr_effdate', 'tr_type', 'tr_lot','tr_um'],
      raw: true,
    });

    let result = [];
    var i = 1;
    for (let tr of trs) {
     
      const items = await itemServiceInstance.findOnedesc({ pt_part: tr.tr_part,pt_domain:user_domain });
      const effdate = new Date(tr.tr_effdate);
      result.push({
        id: i,
        desc: items.pt_desc1,
        tr_um: tr.tr_um,
        tr_part: tr.tr_part,
        tr_site: tr.tr_site,
        tr_effdate: effdate.getFullYear() + '-' + (effdate.getMonth() + 1) + '-' + effdate.getUTCDate(),
        tr_type: tr.tr_type,
        tr_lot: tr.tr_lot,
        qty: tr.qty,
       // amt: tr.amt,
      });
      i = i + 1;
    }
    
    return res.status(200).json({ message: 'fetched succesfully', data: result });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};



const findByGroup = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  const {user_domain} = req.headers;
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const itemServiceInstance = Container.get(itemService);

    const trs = await inventoryTransactionServiceInstance.findSpecial({
      where: {
        tr_domain:user_domain,
        ...req.body
      },
      attributes: [
        'tr_lot',
        'tr_effdate',
        'tr_site',
        'tr_loc',
        'tr_rmks',
        'tr_addr',
        //[Sequelize.fn('sum', Sequelize.col('tr_gl_amt')), 'amt'],
      ],
      group: ['tr_effdate', 'tr_lot', 'tr_rmks', 'tr_site', 'tr_loc','tr_addr'],
      raw: true,
    });

    let result = [];
    var i = 1;
    for (let tr of trs) {
      
      //const items = await itemServiceInstance.findOnedesc({ pt_part: tr.tr_part,pt_domain:user_domain });
      const effdate = new Date(tr.tr_effdate);
      result.push({
        id: i,
        tr_effdate: effdate.getFullYear() + '-' + (effdate.getMonth() + 1) + '-' + effdate.getUTCDate(),
        tr_lot: tr.tr_lot,
        tr_site: tr.tr_site,
        tr_loc : tr.tr_loc,
        tr_rmks: tr.tr_rmks,
        tr_addr: tr.tr_addr,
       // amt: tr.amt,
      });
      i = i + 1;
    }
   
    return res.status(200).json({ message: 'fetched succesfully', data: result });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const updatePrice = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;
  const {user_domain} = req.headers;
console.log(user_domain)
  logger.debug('Calling update one  code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const accountUnplanifedServiceInstance = Container.get(AccountUnplanifedService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(LocationDetailService);
    let total = 0
    let lot = ""
    for (let tr of req.body) {
      total = total + (Number(tr.tr_price) * Number(tr.qty))
      lot = tr.tr_lot
    const transaction = await inventoryTransactionServiceInstance.update(
          { tr_price : tr.tr_price, tr_gl_amt: tr.tr_price * Number(Sequelize.literal('tr_qty_loc')) ,  last_modified_by: user_code, last_modified_ip_adr: req.headers.origin },
          { tr_domain: user_domain , tr_lot: tr.tr_lot, tr_type: tr.tr_type, tr_effdate: tr.tr_effdate,tr_part: tr.tr_part, tr_site: tr.tr_site},
        );


        /***********************calc cmp */

              /*get cout avant calcul*/
      const old_tr = await inventoryTransactionServiceInstance.findOneS({
        where : {
      tr_domain: user_domain, tr_effdate: { [Op.lt]: [tr.tr_effdate]} ,
      tr_part: tr.tr_part,
        },
      order: [['tr_effdate', 'DESC'],['id', 'DESC']], 
      
      
      
      }) 

      var coutMA = 0
      var cmpA   = 0
      
      if (old_tr == null) {

        const sct = await costSimulationServiceInstance.findOne({sct_domain:user_domain,sct_part:tr.tr_part, sct_sim:"init"})
         coutMA = sct.sct_mtl_tl
         cmpA   = sct.sct_mtl_tl
      } 
      else {
      
       coutMA = old_tr.tr__dec01
       cmpA   = old_tr.tr__dec02
      }
/*get cout avant calcul*/
/*get stock avant calcul*/
      const res = await locationDetailServiceInstance.findSpecial({
        where: { ld_part: tr.tr_part,ld_domain:user_domain },
        attributes: ['ld_part', [Sequelize.fn('sum', Sequelize.col('ld_qty_oh')), 'total']],
        group: ['ld_part'],
        raw: true,
      });
      const stkact = res.total
      
      var trqty = await inventoryTransactionServiceInstance.findSpecial({
        where : {
      tr_domain: user_domain, tr_effdate: { [Op.between]: [tr.tr_effdate, new Date()]} ,
      tr_part: tr.tr_part,
      tr_ship_type: { [Op.ne]: 'M' },
        },
        attributes: [ [Sequelize.fn('sum', Sequelize.col('tr_qty_loc')), 'totalqtyloc']],
        group: ['tr_part'],
        raw: true,
      }) 

      var stkA = Number(stkact) - Number(trqty.totalqtyloc)
/*get stock avant calcul*/



      var trs = await inventoryTransactionServiceInstance.findSpecial({
        where : {
      tr_domain: user_domain, tr_effdate: { [Op.between]: [tr.tr_effdate, new Date()]} ,
      tr_part: tr.tr_part,
        },
      order: [['tr_effdate', 'ASC'],['id', 'ASC']], 
      
      
      
      }) 
      
      
      for (let tra of trs) {

          if( (tra.tr_type = "RCT-PO" && tra.tr_qty_loc != 0) || (tra.tr_type = "RCT-UNP" && tra.tr_qty_loc != 0))  {
            let coutM =  Number(tr.tr_price)  /// Number(tr.tr_qty_loc)
            let cmpM  = (Number(stkA) + Number(tr.tr_qty_loc) != 0 ) ? ( ( Number(cmpA) * Number(stkA) + Number(coutM) * Number(tr.tr_qty_loc)) / (Number(stkA) + Number(tr.tr_qty_loc) )) : 0
             await inventoryTransactionServiceInstance.update({ tr__dec01 : coutM,tr__dec02:cmpM},{id: tra.id})
             cmpA = cmpM
             stkA = stkA + Number( tr.tr_qty_loc)
             // i = i + 1

          

          } else {

              await inventoryTransactionServiceInstance.update({tr__dec01 : cmpA,tr__dec02:cmpA},{id: tra.id})
             // result.push({id:i,date: tr.tr_effdate, nbr : tr.tr_lot, part: tr.tr_part,desc: item.pt_desc1, qtym : tr.tr_qty_loc, qtys: stkA,coutm: cmpA,cmpM: cmpA})
             // i = i + 1
              stkA = stkA + Number(tr.tr_qty_loc)
            
          }


      }

        /***********************calc cmp */
    }

    const aufind = await accountUnplanifedServiceInstance.findOne({au_nbr: lot,au_domain : user_domain,})
    if(aufind) {
    const accountUnplanifed = await accountUnplanifedServiceInstance.update({au_amt :  Number(total) ,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id:aufind.id})
    } 
    return res.status(200).json({ message: 'fetched succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};


const rctUnpCab = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers 
  const{user_domain} = req.headers

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);
    const accountUnplanifedServiceInstance = Container.get(AccountUnplanifedService);
    const providerServiceInstance = Container.get(ProviderService);

    let tot = 0.00  
    for (const data of detail) {
    
       tot = tot + Number(data.tr_qty_loc) * Number(data.tr_price)
     // tot = +10 * +100.020
      
    }
    if (it.tr_addr != null) {
    const aufind = await accountUnplanifedServiceInstance.findOne({au_nbr: nlot,au_domain : user_domain,})
    if(aufind) {
    const accountUnplanifed = await accountUnplanifedServiceInstance.update({au_amt : Number(aufind.au_amt) + Number(tot) ,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id:aufind.id})
    } else {
      const accountUnplanifed = await accountUnplanifedServiceInstance.create({au_effdate:it.tr_effdate,au_vend:it.tr_addr,au_curr:"DA",au_nbr: nlot,au_amt:tot,au_type:"I",au_domain : user_domain,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
    }
    const vd = await providerServiceInstance.findOne({vd_addr: it.tr_addr,vd_domain : user_domain,})
    if(vd) await providerServiceInstance.update({vd_ship_balance : Number(vd.vd_ship_balance) + Number(tot)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: vd.id})  
    }
    for (const data of detail) {
      const { desc, ...item } = data;
      // const sct = await costSimulationServiceInstance.findOne({
      //   sct_domain:user_domain,
      //   sct_part: item.tr_part,
      //   sct_site: item.tr_site,
      //   sct_sim: 'STD-CG',
      // });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part , pt_domain: user_domain});

      const lds = await locationDetailServiceInstance.find({ ld_part: item.tr_part, ld_site: item.tr_site,  ld_domain:user_domain });
      const { sct_mtl_tl } = await costSimulationServiceInstance.findOne({ sct_domain:user_domain,sct_part: item.tr_part, sct_sim: 'STD-CG' });
      const sctdet = await costSimulationServiceInstance.findOne({
        sct_domain:user_domain,
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STD-CG',
      });

     
      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
        ld_ref: item.tr_ref,
        ld_domain:user_domain
      });
      
      if (ld){
        await inventoryTransactionServiceInstance.create({
          ...item,
          ...it,
          tr_domain:user_domain,
          tr_lot: nlot,
          tr_qty_chg: Number(item.tr_qty_loc),
          tr_loc_begin: ld.ld_qty_oh,
          tr_type: 'RCT-UNP',
          tr_date: new Date(),
          tr_mtl_std: sctdet.sct_mtl_tl,
          tr_lbr_std: sctdet.sct_lbr_tl,
          tr_bdn_std: sctdet.sct_bdn_tl,
          tr_ovh_std: sctdet.sct_ovh_tl,
          tr_sub_std: sctdet.sct_sub_tl,
          tr_desc:pt.pt_desc1,
          tr_prod_line: pt.pt_prod_line,
          tr__chr01:pt.pt_draw,
          tr__chr02:pt.pt_break_cat,
          tr__chr03:pt.pt_group,
          dec01:Number(new Date(it.tr_effdate).getFullYear()),
          dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
          tr_program:new Date().toLocaleTimeString(),
          tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        });
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      }
      else {
        
        const status = await statusServiceInstance.findOne({
          is_domain:user_domain,
          is_status: item.tr_status,
        });
        await inventoryTransactionServiceInstance.create({
          ...item,
          ...it,
          tr_domain:user_domain,
          tr_lot: nlot,
          tr_qty_chg: Number(item.tr_qty_loc),
          tr_loc_begin: 0,
          tr_type: 'RCT-UNP',
          tr_date: new Date(),
          tr_mtl_std: sctdet.sct_mtl_tl,
          tr_lbr_std: sctdet.sct_lbr_tl,
          tr_bdn_std: sctdet.sct_bdn_tl,
          tr_ovh_std: sctdet.sct_ovh_tl,
          tr_sub_std: sctdet.sct_sub_tl,
          tr_desc:pt.pt_desc1,
          tr_prod_line: pt.pt_prod_line,
          tr__chr01:pt.pt_draw,
          tr__chr02:pt.pt_break_cat,
          tr__chr03:pt.pt_group,
          dec01:Number(new Date(it.tr_effdate).getFullYear()),
          dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
          tr_program:new Date().toLocaleTimeString(),
          tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        });
        await locationDetailServiceInstance.create({
          ld_part: item.tr_part,
          ld_lot: item.tr_serial,
          ld_ref: item.tr_ref,
          ld_date: new Date(),
          ld_site: item.tr_site,
          ld_loc: item.tr_loc,
          ld_status: item.tr_status,
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          ld__log01: status.is_nettable,
          ld_domain:user_domain,
          ld_grade: item.tr_grade,
          ld__chr01:item.tr_batch,
          
        });
      }
      
      
    }

    // const addressServiceInstance = Container.get(AddressService);
    // const addr = await addressServiceInstance.findOne({ ad_addr: it.tr_addr,ad_domain:user_domain });

    // const pdfData = {
    //   detail: detail,
    //   it: it,
    //   nlot: nlot,
    //   adr: addr,
    // };

    
    // const pdf = await generatePdf(pdfData, 'rct-unp');

    return res.status(200).json({ message: 'Added succesfully', data: true, /*pdf: pdf.content*/ });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const issTrV = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling update one  code endpoint');
  const { user_code } = req.headers;
  const { user_domain } = req.headers;


  
  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);

    for (const item of detail) {
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: it.tr_site,
        sct_sim: 'STD-CG',
        sct_domain: user_domain,
      });
      const sctrct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: it.tr_ref_site,
        sct_sim: 'STD-CG',
        sct_domain: user_domain
      });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part,pt_domain: user_domain });

      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: it.tr_site,
        ld_loc: it.tr_loc,
        ld_ref:item.tr_ref,
        ld_domain:user_domain,
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_qty_loc: -1 * Number(item.tr_qty_loc),
        tr_loc_begin: (ld) ? ld.ld_qty_oh : 0,
        tr_type: 'ISS-TR',
        tr_date: new Date(),
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_batch: (ld) ? ld.ld__chr01: null,
        tr_grade:(ld) ? ld.ld_grade: null,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
        tr_domain: user_domain,
      });

      const ld1 = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: it.tr_ref_site,
        ld_loc: it.tr_ref_loc,
        ld_ref:item.tr_ref,
        ld_domain: user_domain,
      });
     
      // if (ld1)
      //   await locationDetailServiceInstance.update(
      //     {
      //       ld_qty_oh: Number(ld1.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
      //       last_modified_by: user_code,
      //       last_modified_ip_adr: req.headers.origin,
      //     },
      //     { id: ld1.id },
      //   );
      // else {
      //   const status = await statusServiceInstance.findOne({
      //     is_status: item.tr_status,
      //     is_domain: user_domain,
      //   });
      //   await locationDetailServiceInstance.create({
      //     ld_part: item.tr_part,
      //     ld_lot: item.tr_serial,
      //     ld_ref: item.tr_ref,
      //     ld_date: new Date(),
      //     ld_site: it.tr_ref_site,
      //     ld_loc: it.tr_ref_loc,
      //     ld_status: item.tr_status,
      //     ld__log01: status.is_nettable,
      //     ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
      //     ld_expire: item.tr_expire,
      //     created_by: user_code,
      //     created_ip_adr: req.headers.origin,
      //     last_modified_by: user_code,
      //     last_modified_ip_adr: req.headers.origin,
      //     ld_domain: user_domain,
      //     chr01:ld.chr01,
      //     chr02:ld.chr02,
      //     chr03:ld.chr03,
      //     ld_grade:(ld) ? ld.ld_grade : null,
      //     ld_batch: (ld) ? ld.ld_batch : null
      //   });
      // }
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_qty_loc: Number(item.tr_qty_loc),
        tr_type: 'RCT-TR',
        tr_date: new Date(),
        tr_loc: it.tr_ref_loc,
        tr_loc_begin: (ld1) ? ld1.ld_qty_oh : 0,
        tr_site: it.tr_ref_site,
        tr_ref_site: it.tr_site,
        tr_ref_loc: it.tr_loc,
        tr_mtl_std: sctrct.sct_mtl_tl,
        tr_lbr_std: sctrct.sct_lbr_tl,
        tr_bdn_std: sctrct.sct_bdn_tl,
        tr_ovh_std: sctrct.sct_ovh_tl,
        tr_sub_std: sctrct.sct_sub_tl,
        tr_desc:pt.pt_desc1,
        tr_prod_line: pt.pt_prod_line,
        tr__chr01:pt.pt_draw,
        tr__chr02:pt.pt_break_cat,
        tr__chr03:pt.pt_group,
        tr_grade:(ld) ? ld.ld_grade : null,
        tr_batch: (ld) ? ld.ld__chr01 : null,
        dec01:Number(new Date(it.tr_effdate).getFullYear()),
        dec02:Number(new Date(it.tr_effdate).getMonth() + 1),
        tr_program:new Date().toLocaleTimeString(),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
        tr_domain: user_domain,
      });
    }

    // const pdfData = {
    //   double: true,
    //   detail: detail,
    //   it: it,
    //   nlot: nlot,
    // };

    // const pdf = await generatePdf(pdfData, 'it-tr');

    //pdf
    return res.status(200).json({ message: 'deleted succesfully', data: true, /*pdf: pdf.content*/ });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
export default {
  create,
  findOne,
  findAll,
  findBy,
  update,
  deleteOne,
  rctUnp,
  issUnp,
  issTr,
  issTrV,
  issChl,
  inventoryToDate,
  inventoryActivity,
  inventoryByStatus,
  inventoryByLoc,
  inventoryOfSecurity,
  rctWo,
  rjctWo,
  issWo,
  updateTrans,
  issWoD,
  //issSo,
  findtrDate,
  findtrDateAddr,
  findTrType,
  cycCnt,
  cycRcnt,
  consoRange,
  findDayly1,
  consoReport,
  findByOneinv,
  findByInv,
  findByRct,
  findBySpec,
  findAllissSo,
  issChlRef,
  findByCost,
  findByNbr,
  findByGroup,
  updatePrice,
  rctUnpCab,
  
};
