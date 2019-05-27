const { isEmptyCheck } = require('../utils/common');

let getSelectIdQuery = (id) => {
    return `SELECT count(*) AS isId FROM tb_store_managers WHERE manager_id='${ id }';`;
}

let getInsertSignupQuery = (data, password, storeSavingCnt) => {
    return `
        INSERT INTO tb_store_signup (
            store_name,
            store_branch_name,
--             store_type,
            manager_id,
            manager_password,
            store_business_type_name,
            store_tel,
            store_business_number,
            store_corporation_number,
            store_zip_code,
            store_address,
            store_address_detail,
            store_operator_name,
            store_operator_position,
            store_operator_phone,
            store_operator_tel,
            store_operator_email,
            store_contact_period,
            store_account_name,
            store_bank_name,
            store_account,
            store_saving_type,
            store_saving_cnt,
            saving_coupon_name,
            saving_valid_period,
            point_use_cnt,
            msg_ss_yn,
            msg_sc_yn,
            msg_ps_yn,
            msg_pd_yn,
            msg_cu_yn,
            msg_ga_yn,
            msg_gb_yn,
            msg_ce_yn,
            msg_ge_yn,
            store_signup_status_type
        ) VALUES (
            '${ data.storeName.trim() }',
            '${ isEmptyCheck(data.storeBranchName) === true ? '-' : data.storeBranchName.trim()}',
--             '${ data.storeType }',
            '${ data.managerId.trim() }',
            '${ password.trim() }',
            '${ data.storeBusinessTypeName.trim() }',
            '${ data.storeTel.trim() }',
            '${ data.storeBusinessNumber.trim() }',
            '${ isEmptyCheck(data.storeCorporationNumber) === true ? '-' : data.storeCorporationNumber.trim() }',
            '${ data.storeZipCode.trim() }',
            '${ data.storeAddress.trim() }',
            '${ isEmptyCheck(data.storeAddressDetail) === true ? '-' : data.storeAddressDetail.trim() }',
            '${ data.storeOperatorName.trim() }',
            '${ isEmptyCheck(data.storeOperatorPosition) === true ? '-' : data.storeOperatorPosition.trim() }',
            '${ data.storeOperatorPhone.trim() }',
            '${ isEmptyCheck(data.storeOperatorTel) === true ? '-' : data.storeOperatorTel.trim() }',
            '${ data.storeOperatorEmail.trim() }',
            ${ data.storeContactPeriod.trim() },
            '${ data.storeAccountName.trim() }',
            '${ data.storeBankName.trim() }',
            '${ data.storeAccount.trim() }',
            '${ data.storeSavingType.trim() }',
            ${ storeSavingCnt.trim() },
            '${ isEmptyCheck(data.savingCouponName) === true ? '-' : data.savingCouponName.trim() + ' 무료 증정' }',
            ${ data.savingValidPeriod.trim() },
            ${ isEmptyCheck(data.pointUseCnt) === true ? 0 : data.pointUseCnt.trim() },
            '${ data.msgSSYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgSCYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgPSYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgPDYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgCUYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgGAYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgGBYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgCEYn === 'on' ? 'Y' : 'N' }',
            '${ data.msgGEYn === 'on' ? 'Y' : 'N' }',
            'W'
--             '${ data.storeSignupStatusType }'
        );
    `;
}

let getInsertVerificationMsgQuery = (phone, title, msg) => {
    return `INSERT INTO kakao_msg_queue (
                msg_type,
                store_id,
                dstaddr,
                callback,
                stat,
                subject,
                text,
                request_time 
                ) 
            VALUES (
                '1',
                'elinmedia',
                '${ phone }',
                '0313023334',
                '0',
                '${ title }',
                '${ msg }',
                sysdate() 
            );`
}

module.exports = { getSelectIdQuery, getInsertSignupQuery, getInsertVerificationMsgQuery };