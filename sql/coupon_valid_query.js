let qu = `SELECT
            tcb.coupon_box_no,
            tcb.customer_uid,
            tcb.campaign_type,
            (select customer_phone from tb_customer where customer_uid = tcb.customer_uid) AS customer_phone,
            tcb.membership_no,
            tcb.coupon_title,
            DATE_FORMAT(tcb.coupon_finishdate, "%Y-%m-%d ") AS coupon_finishdate,
            (select store_name from tb_store where store_id = tcb.store_id) AS store_name,
            store_id
FROM tb_coupon_box tcb
WHERE (date_format(date_add(now(), interval +3 day),"%Y-%m-%d") = tcb.coupon_finishdate)
AND tcb.store_id = 'TSC9'
AND tcb.coupon_use_type = '0'`;

let selcectQu = `SELECT
            msg_send_no,
            coupon_box_no,
            customer_uid,
            campaign_type,
            customer_phone,
            membership_no,
            coupon_title,
            DATE_FORMAT(coupon_finishdate, "%Y-%m-%d ") AS coupon_finishdate,
            store_name,
            store_id
            FROM tb_batch_msg 
            WHERE msg_send_result = 'R'`;

let insertQu = (params) => {
return `INSERT INTO tb_batch_msg(
                coupon_box_no,
                customer_uid,
                campaign_type,
                customer_phone,
                membership_no,
                coupon_title,
                coupon_finishdate,
                store_name,
                store_id)
                VALUES (
                ${params.couponBoxNo},
                '${params.customerUid}',
                '${params.campaignType}',
                '${params.customerPhone}',
                ${params.membershipNo},
                '${params.couponTitle}',
                '${params.couponFinishdate}',
                "${params.storeName}",
                '${params.storeId}'
                )`;
}

let updateQu = (msgSendNo, msgSendResult) => {
  return `UPDATE tb_batch_msg SET msg_send_result = '${msgSendResult}' WHERE msg_send_no = ${msgSendNo}`
};

module.exports = {qu,selcectQu, insertQu, updateQu};