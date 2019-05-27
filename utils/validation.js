let phoneFomatter = (num,type) => {
    let formatNum = ''

    if(num.length==11){
        if(type==0){
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3')
        }else{
            formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        }
    }else if(num.length==8){
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2')
    }else{
        if(num.indexOf('02')==0){
            if(type==0){
                formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3')
            }else{
                formatNum = num.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3')
            }
        }else{
            if(type==0){
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3')
            }else{
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            }
        }
    }

    return formatNum
}

let phoneRegex = (num) => {
    let regex = /^(01[0, 1, 6]{1})([0-9]{3,4})([0-9]{4})$/
    return regex.test(num)
}

let birthFomatter = (birth) => {
    let regex = /^(\d{4})(\d{2})(\d{2})$/
    return regex.test(birth)
}

let emailRegex = (email) => {
    let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/
    return regex.test(email)
}

const isMobile = {
    Android: function() { return navigator.userAgent.match(/Android/i) },
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
    Windows: function() { return navigator.userAgent.match(/IEMobile/i) },
    any: function() {return (isMobile.Android()  || isMobile.iOS() || isMobile.Windows()) },
    NotWishwideApp: function() {return (typeof WebAndAppBridge === 'undefined')}
}

module.exports = { phoneFomatter, phoneRegex, birthFomatter, emailRegex, isMobile };


