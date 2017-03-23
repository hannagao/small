/**
 * Created by user on 2017/3/14.
 */
var id = GetQueryString("id");
var data={
        "id":null,
        "createPerson":null,
        "updatePerson":null,
        "createTime":null,
        "updateTime":null,
        "orderNo":"order_no_1",
        "noticeNo":"notice_no_1",
        "logisticsNo":"3932390204846",
        "logisticsCompanyName":"韵达",
        "logisticsCompanyTypeDesc":"快递",
        "warehouseName":"北京仓",
        "packageWeight":null,
        "logisticsAddress":null,
        "receiverName":null,
    "procedure":{
        "statusDesc":"已发货未揽收",
        "dataProvider":"菜鸟网络",
        "exception":null,
        "updateTime":1489988813000,
        "details":[
            {
                "context":"在江苏常州戚墅堰遥观公司进行签收扫描，快件已被 已签收 签收",
                "time":"2016-10-11 13:52:41",
                "ftime":"2016-10-11 13:52:41",
                "statusDesc":"备货完成-揽件",
                "stayDuration":-230394,
                "stayDurationDesc":"-3839小时-54分",
                "timoutDuration":-231834,
                "timeoutDurationDesc":"-3863小时-54分",
                "effectiveRate":"-1%"
            },
            {
                "context":"在江苏常州戚墅堰遥观公司进行派件扫描；派送业务员：张玉国；联系电话：13921069035",
                "time":"2016-10-11 09:17:48",
                "ftime":"2016-10-11 09:17:48",
                "statusDesc":"中间流转",
                "stayDuration":-274,
                "stayDurationDesc":"-4小时-34分",
                "timoutDuration":-2314,
                "timeoutDurationDesc":"-38小时-34分",
                "effectiveRate":"-745%"
            },
            {
                "context":"从江苏常州分拨中心发出，本次转运目的地：江苏常州戚墅堰遥观公司",
                "time":"2016-10-11 03:19:08",
                "ftime":"2016-10-11 03:19:08",
                "statusDesc":"中间流转",
                "stayDuration":-358,
                "stayDurationDesc":"-5小时-58分",
                "timoutDuration":-2398,
                "timeoutDurationDesc":"-39小时-58分",
                "effectiveRate":"-570%"
            },
            {
                "context":"在分拨中心江苏常州分拨中心进行卸车扫描",
                "time":"2016-10-11 03:17:39",
                "ftime":"2016-10-11 03:17:39",
                "statusDesc":"中间流转",
                "stayDuration":-1,
                "stayDurationDesc":"0小时-1分",
                "timoutDuration":-2041,
                "timeoutDurationDesc":"-34小时-1分",
                "effectiveRate":"-204,000%"
            },
            {
                "context":"在浙江杭州分拨中心进行装车扫描，即将发往：江苏常州分拨中心",
                "time":"2016-10-10 21:22:22",
                "ftime":"2016-10-10 21:22:22",
                "statusDesc":"中间流转",
                "stayDuration":-355,
                "stayDurationDesc":"-5小时-55分",
                "timoutDuration":-2395,
                "timeoutDurationDesc":"-39小时-55分",
                "effectiveRate":"-575%"
            },
            {
                "context":"快件进入分拨中心浙江杭州分拨中心进行分拨",
                "time":"2016-10-10 21:19:47",
                "ftime":"2016-10-10 21:19:47",
                "statusDesc":"中间流转",
                "stayDuration":-2,
                "stayDurationDesc":"0小时-2分",
                "timoutDuration":-2042,
                "timeoutDurationDesc":"-34小时-2分",
                "effectiveRate":"-102,000%"
            },
            {
                "context":"在浙江淳安县公司进行揽件扫描",
                "time":"2016-10-10 16:01:25",
                "ftime":"2016-10-10 16:01:25",
                "statusDesc":"中间流转",
                "stayDuration":-318,
                "stayDurationDesc":"-5小时-18分",
                "timoutDuration":-2358,
                "timeoutDurationDesc":"-39小时-18分",
                "effectiveRate":"-642%"
            }
        ]
    },
};
$(document).ready(function () {
    packageDetails.init();
});
var packageDetails = {
    init: function () {
        this.initData();
    },

    //初始化数据
    initData: function () {
        this.getData();
    },


    //获取表格数据
    getData: function () {
        var params={};
        params["id"]=id;

        url = getUrl("effective/package/detail");
        getExtJsonData(url, params, function (res) {
            if (!res.success) {
                var msg = isNotNull(res.statusText) ? res.statusText : "查询失败";
                iAlert(msg, "danger");

                return;
            }
            if (isNull(res.data)) {

                iAlert("未查询到数据");
                return;
            }
            $("#packageDetail .orderInfo tr td").each(function () {
                var $this = $(this);
                $this.html(res.data[$this.attr("name")]);
            });

            $("#packageDetail .procedure tr td").each(function () {
                var $this = $(this);
                $this.html(res.data.procedure[$this.attr("name")]);
            });
            $("#updateTime").html(formatDateTime(res.data.procedure.updateTime))
            $("#packageDetail .route tr td").each(function () {
                var $this = $(this);
                $this.html(res.data.route[$this.attr("name")]);
            });
      $("#effectiveRate").html(res.data.route.pythonRate+"%");
            applyJqueryTmpl($("#procedureTemplate"), $('#procedureTable'), res.data.procedure.details);
            applyJqueryTmpl($("#skuDetailsTemplate"), $('#skuDetailsTable'), res.data.skuDetails);
            $(".effectiveRate").each(function () {
                var effectiveRate=$(this).html();
                if(effectiveRate.length-1>=3){
                    $(this).css("color","red");
                }
            })
        });
    },







}

