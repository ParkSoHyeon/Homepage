const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const { isEmptyCheck, isNumberCheck, dbInsertId, dbAffectedRows, selectDbExecute, generateRandom } = require('../utils/common');
const { getSelectIdQuery, getInsertSignupQuery, getInsertVerificationMsgQuery } = require('../sql/signup_query')

router.get('/', async function (req, res, next) {
    try {
        const { type, policyPrivacy, policyPartner, policyUser } = req.query

        if (isEmptyCheck(type)) {
            res.render('signup/signup_agree', { title: '또와요 파트너 가입신청', error: 0 });
            return ;
        }

        switch (type) {
            case 'agree':
                res.render('signup/signup_agree', { title: '또와요 파트너 가입신청' });
                break;
            case 'signup':
                if (isEmptyCheck(policyPrivacy) ||
                    isEmptyCheck(policyPartner) ||
                    isEmptyCheck(policyUser)) {
                    throw 'ABNORMAL ACCESS EXCEPTION';
                }
                else {
                    if (policyPrivacy !== 'ok' || policyPartner !== 'ok' || policyUser !== 'ok') {
                        throw 'ABNORMAL ACCESS EXCEPTION';
                    }
                    else {
                        res.render('signup/signup_write', { title: '또와요 파트너 가입신청' });
                    }
                }
                break;
            case 'success':
                res.render('signup/signup_success', { title: '또와요 파트너 가입신청' });
                break;
            default:
                throw 'ABNORMAL ACCESS EXCEPTION';
                break;
        }
    }
    catch (e) {
        res.render('signup/signup_agree', { title: '또와요 파트너 가입신청', error: 1 });
    }
});

router.post('/', async function (req, res, next) {
    const inputData = req.body;

    try {
        // 필수 입력 체크
        if (isEmptyCheck(inputData.storeName) ||
            // isEmptyCheck(inputData.storeType) ||
            isEmptyCheck(inputData.managerId) ||
            isEmptyCheck(inputData.managerPassword) ||
            isEmptyCheck(inputData.storeBusinessTypeName) ||
            isEmptyCheck(inputData.storeTel) ||
            isEmptyCheck(inputData.storeBusinessNumber) ||
            isEmptyCheck(inputData.storeZipCode) ||
            isEmptyCheck(inputData.storeAddress) ||
            isEmptyCheck(inputData.storeOperatorName) ||
            isEmptyCheck(inputData.storeOperatorPhone) ||
            isEmptyCheck(inputData.storeOperatorEmail) ||
            isEmptyCheck(inputData.storeContactPeriod) ||
            isEmptyCheck(inputData.storeAccountName) ||
            isEmptyCheck(inputData.storeBankName) ||
            isEmptyCheck(inputData.storeAccount) ||
            isEmptyCheck(inputData.storeSavingType) ||
            isEmptyCheck(inputData.msgCUYn) ||
            isEmptyCheck(inputData.msgGAYn)) {
            throw 'NULL EXCEPTION'
        }

        // 적립 메시지 체크
        let storeSavingCnt = 0;
        switch (inputData.storeSavingType) {
            case 'S':
                if (isEmptyCheck(inputData.storeStampCnt) ||
                    isEmptyCheck(inputData.savingCouponName) ||
                    isEmptyCheck(inputData.savingValidPeriod) ||
                    isEmptyCheck(inputData.msgSSYn) ||
                    isEmptyCheck(inputData.msgSCYn)
                    ) {
                    throw 'SAVING NULL EXCEPTION'
                }

                if (!isNumberCheck(inputData.storeStampCnt)) {
                    throw 'NUMBER FORMAT EXCEPTION'
                }

                storeSavingCnt = inputData.storeStampCnt;
                break;
            case 'P':
                if (isEmptyCheck(inputData.storePointCnt) ||
                    isEmptyCheck(inputData.pointUseCnt) ||
                    isEmptyCheck(inputData.msgPSYn) ||
                    isEmptyCheck(inputData.msgPDYn)) {
                    throw 'SAVING NULL EXCEPTION'
                }

                if (!isNumberCheck(inputData.storePointCnt)) {
                    throw 'NUMBER FORMAT EXCEPTION'
                }

                storeSavingCnt = inputData.storePointCnt;
                break;
        }

        // 비밀번호 암호화
        let encryptedPassword = bcrypt.hashSync(inputData.managerPassword);

        // 가입신청 정보 insert
        const insertSignupQuery = getInsertSignupQuery(inputData, encryptedPassword, storeSavingCnt);
        console.log(insertSignupQuery)
        const insertSignupResult = await dbAffectedRows(insertSignupQuery);

        if (insertSignupResult) {
            // insert 성공
            let txtStoreName = inputData.storeName;
            if (!isEmptyCheck(inputData.storeBranchName)) {
                txtStoreName += ' ' + inputData.storeBranchName;
            }

            res.render('signup/signup_success', { title: '또와요 파트너 가입신청', result: true, storeName: txtStoreName })
        }
        else {
            // insert 실패
            res.send(`insert 실패!`)
        }
    }
    catch (e) {
        res.send(`Error 확인: ${ e }`)
    }
});

router.post('/checkOverlapId', async function (req, res, next) {
    const { managerId } = req.body;

    try {
        // 필수 데이터 체크
        if (isEmptyCheck(managerId)) {
            throw 'NULL EXCEPTION'
        }

        // managerId 값과 일치하는 행 확인
        const selectIdQuery = getSelectIdQuery(managerId);
        const selectIdResult = await selectDbExecute(selectIdQuery);

        if (selectIdResult[0].isId === 0) {
            // 중복된 id 없음
            res.send({ errorCode: 0, errorMessage: 'success', isOverlap: 0 })
        }
        else if (selectIdResult[0].isId === 1) {
            // 중복된 id 있음
            res.send({ errorCode: 0, errorMessage: 'success', isOverlap: 1 })
        }
        else {
            throw 'DB SELECT ERROR'
        }
    }
    catch (e) {
        res.send(`Error 확인: ${ e }`)
    }
});


router.post('/getVerificationCode', async function (req, res, next) {
    const { phone } = req.body;

    try {
        if (isEmptyCheck(phone)) {
            throw 'NULL EXCEPTION'
        }

        let verificationCode = await generateRandom(10000, 100000);

        let title = '인증번호';

        let msg = `[또와요] 인증번호는 [${ verificationCode }]입니다.`;

        // 가입신청 정보 insert
        const insertMsgQuery = getInsertVerificationMsgQuery(phone, title, msg);
        const insertMsgResult = await dbAffectedRows(insertMsgQuery);

        if (insertMsgResult) {
            // insert 성공
            res.send({ errorCode: 0, errorMessage: 'success', verificationCode: verificationCode })
        }
        else {
            // insert 실패
            res.send({ errorCode: 1, errorMessage: 'insert error', verificationCode: null })
        }
    }
    catch (e) {
        res.send(`Error 확인: ${ e }`)
    }
});

module.exports = router;