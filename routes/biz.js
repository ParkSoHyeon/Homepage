const express = require('express');
const router = express.Router();
const {isEmptyCheck, dbInsertId, dbAffectedRows, selectDbExecute} = require('../utils/common');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/', async function(req, res, next) {
  let bizListQuery;
  let bizStatus = '';
  console.log(req.query);
  let startPeriod;
  let endPeriod;
  if (!isEmptyCheck(req.query.bizStatus)) {

    bizStatus = req.query.bizStatus;
    bizListQuery = `SELECT id
                          , inquiry_path
                          , inquiry_biz_name
                          , inquiry_biz_type
                          , inquiry_biz_contact
                          , inquiry_biz_addr
                          , inquiry_biz_email
                          , inquiry_biz_content
                          , DATE_FORMAT(reg_date, "%Y-%m-%d ") AS regDate
--                           , DATE_FORMAT(reg_date, "%Y-%m-%d %r") AS regDate
                          , (CASE inquiry_result WHEN 0 THEN '접수대기' WHEN 1 THEN '접수완료' WHEN 2 THEN '영업진행중' WHEN 3 THEN '미계약' ELSE '계약완료' END) AS inquiryResult
                          , inquiry_result
                      FROM tb_home_inquiry
                      WHERE inquiry_result = ${bizStatus}
                      ORDER BY reg_date DESC`;
  } else {

    bizListQuery = `SELECT id
                          , inquiry_path
                          , inquiry_biz_name
                          , inquiry_biz_type
                          , inquiry_biz_contact
                          , inquiry_biz_addr
                          , inquiry_biz_email
                          , inquiry_biz_content
                          , DATE_FORMAT(reg_date, "%Y-%m-%d ") AS regDate
--                           , DATE_FORMAT(reg_date, "%Y-%m-%d %r") AS regDate
                          , (CASE inquiry_result WHEN 0 THEN '접수대기' WHEN 1 THEN '접수완료' WHEN 2 THEN '영업진행중' WHEN 3 THEN '미계약' ELSE '계약완료' END) AS inquiryResult
                          , inquiry_result
                      FROM tb_home_inquiry
                      ORDER BY reg_date DESC`;
  }

  let bizListResult = await selectDbExecute(bizListQuery);
  console.log('bizListResult', bizListResult);

  res.render('biz_list', {title: '입점문의 리스트', list: bizListResult, bizStatus: bizStatus});
});


router.get('/detail', async function(req, res, next) {
  console.log('id',req.query.id);

  let id = req.query.id;

  let bizDetailQuery = `SELECT *, DATE_FORMAT(reg_date, "%Y-%m-%d %r") AS regDate  FROM tb_home_inquiry WHERE id = ${id}`

  let bizDetailResult = await selectDbExecute(bizDetailQuery);
  console.log('bizDetailResult', bizDetailResult);

  res.render('biz_detail', {title: '입점문의 상세', detail: bizDetailResult});
});

router.post('/update', async function(req, res, next) {
  console.log(req.body);

  let bizStatus = req.body['bizStatus'];
  let bizMemo = req.body['bizMemo'];
  let bizId = req.body['bizId'];

  let bizInfoUpdateQuery = `UPDATE tb_home_inquiry SET inquiry_result = ${bizStatus}, inquiry_memo = '${bizMemo}' WHERE id = ${bizId}`;
  let bizInfoUpdateResult = await dbAffectedRows(bizInfoUpdateQuery);

  if (bizInfoUpdateResult) {
    res.send(true);
  } else {
    res.send(false);
  }
});

module.exports = router;
