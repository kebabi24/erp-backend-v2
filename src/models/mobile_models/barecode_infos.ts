import { Container } from "typedi"


import Sequelize from "sequelize"

import base from "../base"


const sequelize = Container.get("sequelize")

const BarcodeInfos = sequelize.define(
    "barcodeInfos",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        //add field : code etiq 
        item:{type:Sequelize.STRING},
        description:{type:Sequelize.STRING},
        start:{type: Sequelize.INTEGER},
        length:{type: Sequelize.INTEGER},

        
        
        // ...base,
    },
    {
        tableName: "aa_barcodeinfos",
    }
)
export default  BarcodeInfos ;
