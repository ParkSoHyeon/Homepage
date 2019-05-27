const pool = require('../config/db_connection');

/*
* 넘어온 값이 빈값인지 체크합니다.
* !value 하면 생기는 논리적 오류를 제거하기 위해
* 명시적으로 value == 사용
* [], {} 도 빈값으로 처리
*/
const isEmptyCheck = function (value) {
  if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
    return true
  } else {
    return false
  }
};

const isNumberCheck = function (value) {
  if (Number.isInteger(parseInt(value))) {
    return true
  } else {
    return false
  }
};

let selectDbExecute = async function (query) {
  try {

    const connection = await pool.getConnection(async conn => conn);

    let [result] = await connection.query(query);

    if (isEmptyCheck(result)) {
      connection.release();
      return false;
    } else {
      connection.release();
      return result;
    }
  } catch (e) {
    console.error('selectDbExecute Error', e);
    return false;
  }
};

let dbAffectedRows = async function (query) {
  try {
    const connection = await pool.getConnection(async conn => conn);
    await connection.beginTransaction();
    let [result] = await connection.query(query);
    if (isEmptyCheck(result.affectedRows)) {
      await connection.rollback();
      connection.release();
      return false;
    } else {
      await connection.commit();
      connection.release();
      return true;
    }
  } catch (e) {
    console.error('dbAffectedRows Error', e);
    return false;
  }
};

let dbInsertId = async function (query) {
  try {
    const connection = await pool.getConnection(async conn => conn);
    await connection.beginTransaction();
    let [result] = await connection.query(query);
    if (isEmptyCheck(result.insertId)) {
      await connection.rollback();
      connection.release();
      return false;
    } else {
      await connection.commit();
      connection.release();
      return result.insertId;
    }
  } catch (e) {
    console.error('dbInsertId Error', e);
    return false;
  }
};

let generateRandom = async function (min, max) {
  let ranNum = await Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

module.exports = { isEmptyCheck, isNumberCheck, selectDbExecute, dbAffectedRows, dbInsertId, generateRandom };
