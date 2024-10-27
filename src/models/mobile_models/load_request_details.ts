import { Container } from "typedi"


import Sequelize from "sequelize"

import base from "../base"


const sequelize = Container.get("sequelize")

const LoadRequestDetails = sequelize.define(
    "loadRequestDetails",
    {   
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        
        date_expiration:{type:Sequelize.DATEONLY},
        line:{type: Sequelize.INTEGER},

        
        product_code:{
            type: Sequelize.STRING,
            references: {
                model: "pt_mstr",
                key: "pt_part",
            },
        },

        load_request_code:{
            type: Sequelize.STRING,
            references: {
                model: "aa_loadrequest",
                key: "load_request_code",
            },
        },

        lot : {type:Sequelize.STRING},
        qt_effected:{type: Sequelize.DOUBLE},
        pt_price : {type : Sequelize.DOUBLE}

        // ...base
    },
    {
        tableName: "aa_loadrequestdetails",
    }
)
export default  LoadRequestDetails ;
