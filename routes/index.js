const express = require('express');
const path = require('path');
const router = express.Router();
const nodemailer = require('nodemailer');
const {isEmptyCheck, dbInsertId, dbAffectedRows, selectDbExecute} = require('../utils/common');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: '매장 쿠폰마케팅 전문 또와요'});
});

router.get('/robots.txt', function (req, res, next) {
  // console.log(path.join(path.join(__dirname, '../views')))
  res.sendFile(path.join(path.join(__dirname, '../views'), 'robots.txt'));
});

/* GET home page. */
router.post('/register', async function (req, res, next) {
  console.log(req.body);
  let selectPath = req.body['select_path'];
  let bizType = req.body['biz_type'];
  let bizAddr = req.body['biz_addr'];
  let bizName = req.body['biz_name'];
  let bizPhone = req.body['biz_phone'];
  let bizEmail = req.body['biz_email'];
  let bizContent = req.body['biz_content'];

  let inquiryInsertQuery = `INSERT INTO tb_home_inquiry (
                inquiry_path,
                inquiry_biz_name,
                inquiry_biz_type,
                inquiry_biz_contact,
                inquiry_biz_addr,
                inquiry_biz_email,
                inquiry_biz_content
                ) VALUES (
                '${selectPath}',
                '${bizName}',
                '${bizType}',
                '${bizPhone}',
                '${bizAddr}',
                '${bizEmail}',
                '${bizContent}'
                )`;

  console.log(inquiryInsertQuery)

  let insertResult = await dbInsertId(inquiryInsertQuery);

  if (insertResult) {
    let transporter = await nodemailer.createTransport({
      host: 'smtp.mailplug.co.kr',
      port: '465',
      tls: {
        rejectUnauthorize: false
      },

      auth: {
        user: 'contact@elinmedia.com',
        pass: 'dpffls09*'
      },

    });

    let mailOptions = {
      from: 'contact@elinmedia.com',
      to: 'contact@elinmedia.com, youri@elinmedia.com',
      subject: '또와요 입점문의 [' + bizName + ']',

      html:
        '<h2>검색 경로 :' + selectPath + '</h2><br>' +
        '<h2>매장명 :' + bizName + '</h2><br>' +
        '<h2>업종 :' + bizType + '</h2><br>' +
        '<h2>연락처 :' + bizPhone + '</h2><br>' +
        '<h2>주소 :' + bizAddr + '</h2><br>' +
        '<h2>이메일 :' + bizEmail + '</h2><br>' +
        '<h2>상세문의내용 :' + bizContent + '</h2><br>'
    };

    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.send(true);
  } else {
    res.send(false);
  }
});

router.get('/legal/termofpartner', function (req, res, next) {
  res.render('termofpartner', {title: '이용약관(파트너)'});
});

router.get('/legal/termofuser', function (req, res, next) {
  res.render('termofuser', {title: '이용약관(사용자)'});
});

router.get('/legal/termofprivacy', function (req, res, next) {
  res.render('termofprivacy', {title: '이용약관(사용자)'});
});

module.exports = router;
