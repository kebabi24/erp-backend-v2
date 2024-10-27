import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"
import Address from "./address"
const sequelize = Container.get("sequelize")

const Customer = sequelize.define(
    "customer",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cm_addr: {
            type: Sequelize.STRING,
            unique: true,
            references: {
                model: "ad_mstr",
                key: "ad_addr",
            },
        },
        cm_curr: {
            type: Sequelize.STRING,
            references: {
                model: "cu_mstr",
                key: "cu_curr",
            },
        },
        cm_cr_terms: Sequelize.STRING,
        cm_disc_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_ship: Sequelize.STRING,
        cm_partial: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_rmks: Sequelize.STRING,
        cm_ar_acct: Sequelize.STRING,
        cm_ar_sub: Sequelize.STRING,
        cm_ar_cc: Sequelize.STRING,
        cm_sort: Sequelize.STRING,
        cm_balance:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_ship_balance:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_hold:  {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_tax_id: Sequelize.STRING,
        cm_taxable: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_user1: Sequelize.STRING,
        cm_user2: Sequelize.STRING,
        cm_bank: Sequelize.STRING,
        cm_pay_spec: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_type: Sequelize.STRING,
        cm_userid: Sequelize.STRING,
        cm_mod_date: Sequelize.DATEONLY,
        cm_prepay:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_conrep_logic: Sequelize.STRING,
        cm_pr_list: Sequelize.STRING,
        cm_drft_bal:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_lc_bal:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_pr_list2: Sequelize.STRING,
        cm_fix_pr: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_fr_list: Sequelize.STRING,
        cm_fr_min_wt:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_fr_terms: Sequelize.STRING,
        cm_tid_notice: Sequelize.STRING,
        cm_promo: Sequelize.STRING,  
        cm_stmt: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_stmt_cyc:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_dun: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_fin: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_inv_auto: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_resale: Sequelize.STRING,
        cm_region: Sequelize.STRING,
        cm_lang: Sequelize.STRING,
        cm_slspn: Sequelize.STRING,
        cm_sic: Sequelize.STRING,
        cm_pay_date: Sequelize.DATEONLY,
        cm_xslspsn2 : Sequelize.STRING,
        cm_avg_pay: Sequelize.INTEGER,
        cm_cr_hold: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_cr_rating: Sequelize.STRING,
        cm_high_cr:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_high_date: Sequelize.DATEONLY,
        cm_sale_date: Sequelize.DATEONLY,
        cm_invoices: Sequelize.INTEGER,
        cm_fin_date: Sequelize.DATEONLY,
        cm_fst_id: Sequelize.STRING,
        cm_pst_id: Sequelize.STRING,
        cm_pst: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_tax_in: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_site: Sequelize.STRING,
        cm_class: Sequelize.STRING,
        cm_taxc: Sequelize.STRING,
        cm_bill: Sequelize.STRING,
        cm_cr_update: Sequelize.DATEONLY,
        cm_cr_review: Sequelize.DATEONLY,
        cm_coll_mthd: Sequelize.STRING,  
        cm_drft_min:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_drft_max:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_drft_disc: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_svc_list: Sequelize.STRING,
        cm_po_reqd: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_serv_terms: Sequelize.STRING,
        cm_cr_limit:{type: Sequelize.DECIMAL, defaultValue : 0  },
        cm_btb_cr: {type: Sequelize.BOOLEAN, defaultValue : false  },
        cm_btb_type: Sequelize.STRING,
        cm_ship_lt: Sequelize.INTEGER,
        cm_disc_comb: Sequelize.INTEGER,
        cm_scurr: Sequelize.STRING,
        cm_submit_prop: Sequelize.STRING,
        cm_ex_ratetype: Sequelize.STRING,
        cm_db: Sequelize.STRING,
        cm_pay_method: Sequelize.STRING,
        cm_seq: Sequelize.STRING,
        cm_domain:  Sequelize.STRING,
          
        oid_cm_mstr: Sequelize.STRING,
        ...base,
    },
    {
        tableName: "cm_mstr",
    }
)

export default Customer
