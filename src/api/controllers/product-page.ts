import ProductPageService from "../../services/product-page"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import { DATE, Op, Sequelize } from 'sequelize';
import sequelize from '../../loaders/sequelize';
import { isNull } from "lodash";

const createProductPage = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")

    logger.debug("Calling Create productPage endpoint with body: %o", req.body)
    const { user_code } = req.headers;
    const { user_domain } = req.headers;
  
    try {
        const productPageService = Container.get(ProductPageService)
        
        const productPageCode = req.body.productPage.productPage.product_page_code
        const productCodes = req.body.productsCodes.productCodes
        
        const productPage = await productPageService.createProductPage({
            ...req.body.productPage.productPage,domain:user_domain
        })

        

        for(const productCode of productCodes){
            const productPageDetails = await productPageService.createProductPageProducts(
                {
                    productPageCode,
                },
                {
                    productCode,
                },
               )
        }

        
       
       
        return res
            .status(201)
            .json({ message: "created succesfully", data: { productPage  } })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }

}





const findOneByCode = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  code endpoint")
    try {
        const productPageService = Container.get(ProductPageService)
        const {product_page_code} = req.params
        console.log(product_page_code)
        const productPage = await productPageService.findOneByCode(product_page_code)
        return res
            .status(200)
            .json({ message: "found one product page", data: {productPage}  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAllProductPages = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  code endpoint")
    try {
        const productPageService = Container.get(ProductPageService)
        const productPages = await productPageService.findAll()
        return res
            .status(200)
            .json({ message: "found all product page", data: productPages  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const updateProfileProductPages = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")

    logger.debug("Calling Update profile product pages endpoint with body: %o", req.body)
    try {

        const productPageService = Container.get(ProductPageService)

        // console.log(Object.keys(req.body.pagesCodes))
        
        const profileCode = req.body.profile_code.profile_code
        const pagesCodes = req.body.pagesCodes.pagesCodes
        
        const updateProfileProductPages = await productPageService.updateProfileProductPages(
            {profileCode},{pagesCodes}
        )
        return res
            .status(201)
            .json({ message: "updated profile pages succesfully", data: { updateProfileProductPages  } })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }

}


const findPageProductsByPageCode = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  code endpoint")
    try {
        const productPageService = Container.get(ProductPageService)
        const {product_page_code} = req.params
        const products_codes = await productPageService.getPageProducts(product_page_code)
        const page = await productPageService.findOneByCode(product_page_code)
        return res
            .status(200)
            .json( {products_codes , page})
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

export default {
    createProductPage,
    findOneByCode,
    findAllProductPages,
    updateProfileProductPages,
    findPageProductsByPageCode
}
