import { Container } from "typedi"


import Sequelize from "sequelize"

import base from "../base"


const sequelize = Container.get("sequelize")

const ComplaintDetails = sequelize.define(
    "complaintDetails",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        complaint_code:{
            type:Sequelize.STRING,
            primaryKey:true,
           
        },
        code_value:{type:Sequelize.STRING}, // code of cause 
        observation:{type:Sequelize.STRING},
        method : {type:Sequelize.STRING},


        // ...base,
    },
    {
        tableName: "aa_complaintdetails",
    }
)
export default  ComplaintDetails ;
