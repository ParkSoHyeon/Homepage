const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash  = require('connect-flash');

const indexRouter = require('./routes/index');
const bizRouter = require('./routes/biz');
const signupRouter = require('./routes/signup');

const app = express();
const cron = require('node-cron');
const {qu, insertQu, selcectQu, updateQu} = require('./sql/coupon_valid_query');
const {isEmptyCheck, dbInsertId, dbAffectedRows, selectDbExecute} = require('./utils/common');

function createStringFromTemplate(template, variables) {
  return template.replace(new RegExp("\#{([^\{]+)\}", "g"), function (_unused, varName) {
    return variables[varName];
  });
}


//0 22 * * 1-5
cron.schedule('00 05 * * *', async function () {

  let quResult = await selectDbExecute(qu);

  let params = {
      couponBoxNo : 0,
      customerUid :'',
      campaignType :'',
      customerPhone:'',
      membershipNo : 0,
      couponTitle :'',
      couponFinishdate :'',
      storeName:'',
      storeId :'',
  };
  for (let i = 0; i < quResult.length ; i++) {

    params.couponBoxNo = quResult[i].coupon_box_no;
    params.customerUid = quResult[i].customer_uid;
    params.campaignType = quResult[i].campaign_type;
    params.customerPhone = quResult[i].customer_phone;
    params.membershipNo = quResult[i].membership_no;
    params.couponTitle = quResult[i].coupon_title
    params.couponFinishdate = quResult[i].coupon_finishdate;
    params.storeName = quResult[i].store_name;

    params.storeId = quResult[i].store_id;

    const insertQuResult = await dbInsertId(insertQu(params));
  }

  console.log('insertCoupon', 'running a task every day / ' + new Date());
}).start();

cron.schedule('00 10 * * *', async function () {

  let quResult = await selectDbExecute(selcectQu);
  let msg = `[또와요]\n
  안녕하세요. 고객님.\n
  [#{매장명}] 발급 된 쿠폰 [#{쿠폰명}]의 유효기간이 3일 남았습니다.\n
  쿠폰은 또와요 앱 쿠폰함에서 사용 가능합니다.
  ▶ APP 설치 바로가기
  http://me2.do/FS9YJUMv`;

  let al = {};
  for (let i = 0; i < quResult.length ; i++) {

    al['쿠폰명'] = quResult[i].coupon_title;
    al['매장명'] = quResult[i].store_name;
    let msgTemplateResult = createStringFromTemplate( msg, al);


    let msgSendQuery = `INSERT INTO kakao_msg_queue (msg_type, store_id, dstaddr, callback, stat, subject, text, request_time)
			                    VALUES ('3', '${quResult[i].store_id}', '${quResult[i].customer_phone}','0313023334','0','쿠폰 유효기간', "${msgTemplateResult}", sysdate());`;

    const msgSendResult = await dbInsertId(msgSendQuery);

    let msgSendNo = quResult[i].msg_send_no;

    if (!msgSendResult) {
      await dbAffectedRows(updateQu(msgSendNo, 'F'))
    } else {
      await dbAffectedRows(updateQu(msgSendNo, 'S'))
    }

  }

  console.log('sendResult', 'running a task every day / ' + new Date());
}).start();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/bizs', bizRouter);
app.use('/signup', signupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
