/**
 * Created by user on 2016/10/19.
 */

//meun
var basePath = "";
$(function () {
    //导航栏折叠
    var $menuWrap = $('.menuWrap');
    $menuWrap.on('mouseover', '.navbar-menu', function () {
        $(this).find(".submenu-list").show();
        $(this).find("a").addClass("hover");
        subMenuPosition($(this));
    });
    $menuWrap.on('mouseleave', '.navbar-menu', function () {
        $(this).find(".submenu-list").hide();
        $(this).find("a").removeClass("hover");
    });
    /*滑动改变样式*/
    $(".tbody").on("mouseover", "tr", function () {
        $(this).addClass("event").siblings().removeClass("event");
    })
    $(".tbody").on("mouseleave", "tr", function () {
        $(this).removeClass("event");
    })

});

//左侧二级菜单的高度
function subMenuPosition(navbarMenu) {
    //一级菜单距离顶部的位置
    var avtiveMenuTop = navbarMenu.offset().top - $(window).scrollTop();    // 距离顶部位置 - 滚动条距离

    //二级菜单的高度
    var subMenu = navbarMenu.find(".submenu-list");
    var subMenuHeight = subMenu.height();
    //屏幕可视区域的高度
    var windowHeight = $(window).height();
    var overHeight = avtiveMenuTop + subMenuHeight - windowHeight;
    // 二级菜单是否超出可视区域的高度
    if (0 < overHeight) {
        var topValue = "-" + (overHeight + 20) + "px";    //top取负值
        subMenu.css("top", topValue);
    } else {
        subMenu.css("top", "0");
    }
}

//ajax
function getExtJsonData(url, data, callfunc) {
    $.ajax({
        url: url,
        type: "post",
        data: data,
        async: false,
        cache: false,
        dataType: 'json',
        success: function (data) {
            callfunc(data);
        },
        error: function () {
            iAlert("<b>获取不到数据</b>", "danger", "2000");
        }
    });
}


//ajax
function getExtJsonDataJson(url, data, callfunc) {
    $.ajax({
        url: url,
        type: "post",
        data: data,
        async: false,
        cache: false,
        dataType: 'json',
        beforeSend: function (request) {  //针对传递的数据时obj
            request.setRequestHeader("content-Type", "application/json");
        },
        success: function (data) {
            callfunc(data);
        },
        error: function () {
            iAlert("<b>获取不到数据</b>", "danger", "2000");
        }
    });
}
//自定义弹出框
/* info:提示内容
 * type:danger,info,success
 * delay:展示提示信息的时间几毫米隐藏
 * width:设置宽度
 * hv：距离顶部的高度
 * */
function iAlert(info, type, delay, width, hv) {
    $(".bootstrap-growl.alert").remove();
    if ($(".bootstrap-growl.alert").length == 0) {
        var iType = type;
        var iDelay = delay;

        if (!type) {
            iType = "info";
        }

        if (!delay) {
            iDelay = "1500"
        }
        if (!width) {
            width = "auto";
        }
        if (!hv) {
            hv = $(window).height() / 2;
        }
        $.bootstrapGrowl(info, {
            type: iType,
            align: 'center',
            width: width,
            delay: iDelay,
            offset: {from: 'top', amount: hv}
        });

    }
}

function getUrl(url, suffix) {
    basePath = $("#basePath").val();
    if (undefined == suffix) {
        suffix = ".do";
    }
    if (url.charAt(0) == "/") {
        return (basePath + url + suffix);
    }
    return (basePath + "/" + url + suffix);
}


/**
 * ajax 请求获取状态 （get）
 * @param text
 * @returns {boolean}
 */

function ajaxResponse(res) {
    if (!res.success) {
        iAlert(res.statusText, "danger");
        return false;
    }
    return true;
}

/**
 *  ajax请求 （add，update，delete时）
 * @param res
 * @returns {boolean}
 */
function ajaxResponse1(res) {
    if (!res.success) {
        iAlert(res.statusText, "danger");
        return false;
    } else {
        iAlert("成功", "success");
        return true;
    }
}

/**
 *  ajax查询列表数据（List）
 * @param res
 * @returns {boolean}
 */
function ajaxResponse2(res, $selector) {
    if (!res.success) {
        var msg = isNotNull(res.statusText) ? res.statusText : "查询失败";
        iAlert(msg, "danger");
        $selector.empty();
        return false
    }
    if (isNull(res.data)) {
        iAlert("未查询到数据");
        $selector.empty();
        return false
    }
    return true;
}


function ajaxResponseNoAlert(res, $selector) {
    if ((!res.success) || (isNull(res.data))) {
        $selector.empty();
        return false
    }
    return true;
}


function isNull(text) {
    if (typeof(text) == "undefined" || text == null || "" == text) {
        if (typeof(text) == "number" || "0" == text) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

function isNotNull(text) {
    return !isNull(text);
}


/**
 *  jqury.tmpl.js 引用
 */

function applyJqueryTmpl($tmplSelector, $bodySelector, data) {
    var htmlContent = $tmplSelector.tmpl(data);
    $bodySelector.empty().html(htmlContent);
}

/**
 *  获取URL参数
 */
function getLocationParam() {
    var paramStr = window.location.search;
    var temp = [],
        o = {},
        paramArray = paramStr.substring(1).split("&"),
        length = paramArray.length;
    for (var i = 0; i < length; i++) {
        temp = paramArray[i].split("=");
        var key = temp[0];
        var value = temp[1];
        o[key] = value;
    }
    return o;
}

/**
 *  根据值删除数组的元素
 */

Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

/**
 *  数值去重
 * @returns {Array}
 */
Array.prototype.unique = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};

/**
 * form表单自动序列化转json对象
 */
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();

    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {                   // 判断o[this.name]是否是数组，如果是，就含有push方法，否则发挥false
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

/**
 *  时间格式化
 */

function formatDateTime(date) {
    if (isNotNull(date)) {
        var date = new Date(date),
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            seconds = date.getSeconds();

        month = month < 10 ? ('0' + month) : month;
        day = day < 10 ? ('0' + day) : day;
        hour = hour < 10 ? ('0' + hour) : hour;
        minute = minute < 10 ? ('0' + minute) : minute;
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds;
    } else {
        return "";
    }
};

/**
 *  数据提交校验 :  根据 添加class = “required”判断
 *  说明： input输入框添加before，after伪类无效，故在input外嵌套<i></i>
 */

function validateBeforeSubmit() {
    var result = true;
    $(".required input").not(":hidden").each(function () {
        var $this = $(this),
            value = $this.val();
        if (isNull(value)) {
            iAlert("请输入必填项", "danger", "", "", 360);
            result = false;
            return false;
        }
    });
    return result;
}

/**
 *   正则表达式，只能输入整数
 */

function onlyInteger(alertInfo) {
    var regxInteger = /^[1-9]\d*$/,
        result = true;

    $(".regxInteger").not(":hidden").each(function () {
        var $this = $(this);
        if (!regxInteger.test($this.val())) {
            iAlert(alertInfo, "danger", "", "", 360);
            result = false;
            return false;
        }
    });
    return result;
}

/**
 * 正则表达式，只能输入整数 ,小数点最多保留2位
 */

function lessTwoDecimal(alertInfo) {
    var regxFloat = /^\d+(\.\d{1,2})?$/,
        result = true;
    $(".lessTwoDecimal").not(":hidden").each(function () {
        var $this = $(this);
        if (!regxFloat.test($this.val())) {
            iAlert(alertInfo, "danger", "", "", 360);
            result = false;
            return false;
        }
    });
    return result;
}
/**
 * 验证最多支持6位数字,且只能输入整数 ,小数点最多保留2位
 */
function vailSixNum(str){
    var regxFloat = /^\d+(\.\d{1,2})?$/;//正数,保留2位小数
    var res=regxFloat.test(str);
    var numreg= /.*\..*/;//匹配小数点
    if(res){
        if(str>100000){
            return false;
        }else{
            if(numreg.test(str)){//若含有小数
                if(str.length-1>6){
                    return false;
                }
            }else{
                if(str.length>6){
                    return false;
                }
            }
        }
    }else{
        return false
    }
    return true;
}
function vailNum(alertInfo) {
    var  result = true;
    $(".lessTwoDecimal").not(":hidden").each(function () {
        var $this = $(this);
        if (!vailSixNum($this.val())) {
            iAlert(alertInfo, "danger", "", "", 360);
            result = false;
            return false;
        }
    });
    return result;
}
/*验证时间最多支持一位小数,且最大为720h，最小为72h*/
function vailHourNum(str,maxNum,num){
    var regxFloat = /^\d+(\.\d{0,1})?$/;//正数,保留1位小数
    var res=regxFloat.test(str);
    var numreg= /.*\..*/;//匹配小数点
    if(res){
        if(str>maxNum){
            return false;
        }else{
            if(numreg.test(str)){//若含有小数
                if(str.length-1>num){
                    return false;
                }
            }else{
                if(str.length>num){
                    return false;
                }
            }
        }
    }else{
        return false
    }
    return true;
}
//验证最大时间720h,保留一位小数
function vailMaxHour(alertInfo) {
    var  result = true;
    $(".hour").each(function () {
        var $this = $(this);
        if (!vailHourNum($this.val(),720,4)) {
            iAlert(alertInfo, "danger", "", "", 360);
            result = false;
            return false;
        }

    });
    return result;
}
//验证最大时间72h,保留一位小数
function vailMinHour(alertInfo) {
    var  result = true;
    $(".hour").each(function () {
        var $this = $(this);
        if (!vailHourNum($this.val(),72,3)) {
            iAlert(alertInfo, "danger", "", "", 360);
            result = false;
            return false;
        }

    });
    return result;
}
/**
 * 时间控件
 * @param start ：起始时间id
 * @param end ： 结束时间id
 * @param format：时间格式
 * @param istime ：是否显示“时分秒”
 * @param istoday ：是否显示“今天”
 * @param isclear ：是否显示“清楚”
 * @param issure ： 是否显示“确认”
 */

function createLayerTime(start, end, format, istime, istoday, isclear, issure) {
    format == undefined ? "YYYY-MM-DD" : format;   // 默认显示年月日
    istime == undefined ? true : istime;
    istoday == undefined ? true : istoday;
    isclear == undefined ? true : isclear;
    issure == undefined ? true : issure;

    var commonOption = {
        format: format,
        istime: istime,
        istoday: istoday,
        isclear: isclear,
        issure: issure
    };
    var startOption = {
        elem: '#' + start,
        choose: function (datas) {
            endTime.min = datas; //开始日选好后，重置结束日的最小日期
            endTime.start = datas //将结束日的初始值设定为开始日
        }
    }

    var endOption = {
        elem: '#' + end,
        choose: function (datas) {
            startTime.max = datas;
        }
    }

    //开始时间、结束时间
    var startTime = $.extend({}, commonOption, startOption);
    var endTime = $.extend({}, commonOption, endOption);
    laydate(startTime);
    laydate(endTime);
}


/*loading start*/
var commonUtils = (function () {
    "use strict";
    var commonUtils = {
        startLoading: function () {
            var html = '<div id="js-tms-loading"  class="loader"><div class="loader-inner ball-spin-fade-loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>';
            $(html).appendTo($(".allWrap"));
        },
        stopLoading: function () {
            var E_loading = $("#js-tms-loading");
            E_loading.remove();
       }

    };
    return commonUtils;
})(window);
/*loading end*/
/*table start*/
var E_document = $(document);
/* when click table tr element add high light style*/
E_document.on("click", "table tbody tr", function () {
    var that = $(this);
    // console.log(this);
    var highLight = "table-tr-highlight";
    var selec = "selected";
    that.find("a").addClass(selec).parent().parent().siblings("tr").find("a").removeClass(selec);
    that.addClass(highLight).siblings("tr").removeClass(highLight);
});

E_document.on("mousemove", "table tbody tr ", function () {
    var that = $(this);
    var highLight1 = "tablehover";
    that.addClass(highLight1).siblings("tr").removeClass(highLight1);
});
E_document.on("mouseout", "table tbody ", function () {
    var that = $(this);
    var highLight1 = "tablehover";
    that.find("tr").removeClass(highLight1);
});
/*table end*/
/*email check start*/

function checkEmail(str) {
    var emailstr = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (!str.match(emailstr)) {
        iAlert("邮件格式不正确！请重新输入!", "danger");
        return false;
    }
    return true;
}
/*email check end*/


/*去掉字符串所有空格 start*/
function delHtmlSpace(str)
{
    var result=str.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
    return  result.replace(/\s/g,"");//去除文章中间空格
}
/*去掉字符串所有空格 end*/
/* 获取地址栏Id start*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
/* 获取地址栏Id end*/
//checkall:全选checkbox的id或者class
//checkInput：tbody子下的class或者id
function checkAll(checkall, tbody, hiddenInput, attr, checkInput) {
    $(checkall).change(function () {
        if ($(this).prop("checked") == true) {
            var allval = "";
            $(tbody).find(checkInput).prop("checked", true);
            $(tbody).find(checkInput).each(function () {
                allval = allval + $(this).attr(attr) + ",";
            })
            $(hiddenInput).val(allval);
        } else {
            $(tbody).find(checkInput).prop("checked", false);
            $(hiddenInput).val("");
        }

    })
}
function checkSingle(tbody, checkInput, hiddenInput, attr) {
    $(tbody).on("change", checkInput, function () {
        var box = $(this).attr(attr) + ",";
        var box_val = $(hiddenInput).val();
        if ($(this).prop("checked") == true) {
            var addval = box_val + box;
            $(hiddenInput).val(addval);
        } else {
            //var delval = box_val.replace(box, "")
            //$(hiddenInput).val(delval);
        }
    })
}

