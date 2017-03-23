/**
 * Created by user on 2017/1/4.
 */
var shopCode = "",
    id = "";
$(document).ready(function () {
    shopFee.init();
});

var shopFee = {
    init: function () {
        this.initData();   //初始化数据
        this.bindEvent();  //事件绑定
    },

    //初始化数据
    initData: function () {
        this.getLocationData();
        this.getLogisticsTool();
        getProvinceCityRelation();
    },

    //事件绑定
    bindEvent: function () {
        this.addToolRow();
        this.deteleTableRow();
        this.changeFreeRule();
        this.changeChargingWay();
        this.submitData();
        this.cancaleData();
        /* 省市区设置*/
        setProvince();
        submitProvince();
        submitCity();
        /* 省市区设置*/
    },

    //获取url参数
    getLocationData: function () {
        var data = getLocationParam();
        shopCode = data["shopCode"];
        id = data["id"];
    },

    //渲染html
    renderHtml: function (res) {
        if (!ajaxResponse(res, $('#logisticsToolList'))) {
            return;
        }

        if (isNotNull(res.data)) {
            var groupList = res.data.groupList;
            applyJqueryTmpl($("#logisticsToolTmpl"), $('#logisticsToolList'), groupList);
        }
    },

    //获取 店铺物流工具信息
    getLogisticsTool: function () {
        var params = {},
            url = "";
        if (isNull(id)) { //新增
            params = {
                "shopCode": shopCode
            };
            url = getUrl("template/shop/addInputQuery");
        } else {        //编辑
            params = {
                "id": id,
                "shopCode": shopCode
            };
            url = getUrl("template/shop/query");
        }

        getExtJsonData(url, params, function (res) {
            shopFee.renderHtml(res);
        })

    },

    //新增表格行
    addToolRow: function () {
        $("body").on("click", ".addToolRow", function () {
            var $this = $(this),
                appendHtml = $("#addToolTmpl").html(),
                $currentTbody = $this.parent().parent().parent(),
                logisticsToolId = $currentTbody.attr("data-logisticstoolid"),        //当前物流工具logisticstoolid
                index = $currentTbody.find("tr").length,
                $appendHtml = $(appendHtml);                                         //html 字符串转成jquery对象

            //处理计费方式的radio name 重复
            $appendHtml.find("input[type='radio']").each(function () {
                var $that = $(this),
                    name = $that.attr("name");
                name = name + "_" + logisticsToolId + "_" + index;
                $that.attr("name", name);
            })

            $this.parent().parent().before($appendHtml);
        });
    },

    //删除表格行
    deteleTableRow: function () {
        $("body").on("click", ".deteleTableRow", function () {
            $(this).parent().parent().remove();
        });
    },

    //计费方式切换
    changeChargingWay: function () {
        $("body").on("change", "tbody input:radio", function () {
            var value = $(this).val(),
                $nextTd = $(this).parent().next(),
                tempHtml = "";
            //按订单
            if (1 == value) {
                //取新增行的模板tmpl， html字符串转换成jquery对象
                tempHtml = $($("#addToolTmpl").html()).find("td").eq("2").html();
            } else {
                tempHtml = '<span>固定运费<i class="required"><input class="inputWidth50 lessTwoDecimal" name="fixedMoney"/></i>元</span>';
            }

            $nextTd.html(tempHtml);
        });
    },

    //免邮切换
    changeFreeRule: function () {
        $("body").on("change", "select[name='chargingWaysByOrderPattern']", function () {
            var $this = $(this),
                value = $this.val(),
                $nextTd = $this.next(),
                tempHtml = "";
            if (1 == value) {   //按件
                tempHtml = '每张订单满' +
                    '<i class="required"><input class="inputWidth50 regxInteger" name="quantityThreshold"/></i>件，不超过' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="weightThreshold"/></i>千克，免邮，否则运费' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="payMoney"/></i>元 ';
            }
            if (2 == value) {   //按金额
                tempHtml = '每张订单满' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="moneyThreshold"/></i>元，不超过' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="weightThreshold"/></i>千克，免邮，否则运费' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="payMoney"/></i>元';
            }
            if (3 == value) {   //按件 +金额
                tempHtml = '每张订单满' +
                    '<i class="required"><input class="inputWidth50 regxInteger" name="quantityThreshold"/></i>件，满' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="moneyThreshold"/></i>元，不超过' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="weightThreshold"/></i>千克，免邮，否则运费' +
                    '<i class="required"><input class="inputWidth50 lessTwoDecimal" name="payMoney"/></i>元';
            }

            $nextTd.html(tempHtml);
        })
    },

    //提交数据
    submitData: function () {
        $("#submitData").on("click", function () {
            var url = getUrl("template/shop/submit"),
                params = {},
                groupList = [];

            //数据校验  --必填   件数  -- 只能是整数   费用或者重量 -- 只能是最多两位小数   地区设置 -- 不能为空
            if (
                (!validateBeforeSubmit())
                || (!onlyInteger("件数只能输入整数"))
                ||  (!vailNum("费用或者重量最多能输入两位小数,且最多输入100000的6位数字"))
                || (!validateCityNotNull())) {
                return;
            }

            $("#submitData").attr("disabled", true).addClass("resetbtn");

            //店铺code、id
            params["shopCode"] = shopCode;
            params["id"] = id;

            //物流工具列表
            $(".logisticsTool").each(function () {
                var $tbody = $(this),
                    tableMap = {},
                    ruleList = [],
                    logisticsToolId = $tbody.attr("data-logisticsToolId");
                tableMap["logisticsToolId"] = logisticsToolId;
                $tbody.find("tr.ruleListClass").each(function (index) {
                    var $tr = $(this),
                        trMap = {};
                    if (0 == index) {    //第一行特殊处理
                        $tr.find("td.ruleData").each(function () {        // class="ruleData" 表示有数据的td
                            var $td = $(this),
                                $inputObj = $td.find("input,select"),
                                key = "",
                                value = "";
                            $inputObj.each(function () {
                                var $this = $(this);
                                key = $this.attr("name");
                                //计费方式  radio 名称特殊处理
                                if ((key.indexOf("chargingWays_") > -1)) {
                                    if ($this.is(":checked")) {
                                        key = "chargingWays";
                                        value = $this.val();
                                        trMap[key] = value;
                                    }
                                } else {
                                    value = $this.val();
                                    trMap[key] = value;
                                }
                            })
                        });
                        ruleList.push(trMap);
                    } else {
                        $tr.find("td.ruleData").each(function (Index) {
                            var ruleAreaList = [];

                            if (0 == Index) {   //省市特殊处理
                                //选择的城市处理
                                var ruleAreaList = cityIdToCityMap(this);

                                trMap["ruleAreaList"] = ruleAreaList;
                                trMap["isDefaultRegionsRule"] = 0;         //非默认；
                            } else {
                                var $td = $(this),
                                    $inputObj = $td.find("input,select"),
                                    key = "",
                                    value = "";
                                $inputObj.each(function () {
                                    var $this = $(this);
                                    key = $this.attr("name");

                                    //计费方式  radio 名称特殊处理
                                    if ((key.indexOf("chargingWays_") > -1)) {
                                        if ($this.is(":checked")) {
                                            key = "chargingWays";
                                            value = $this.val();
                                            trMap[key] = value;
                                        }
                                    } else {
                                        value = $this.val();
                                        trMap[key] = value;
                                    }
                                });
                            }
                        });
                        ruleList.push(trMap);
                    }
                    tableMap["ruleList"] = ruleList;
                });
                groupList.push(tableMap);
            });
            params["groupList"] = groupList;

            getExtJsonDataJson(url, JSON.stringify(params), function (res) {
                if (ajaxResponse(res)) {
                    setTimeout(function () {
                        window.location.href = basePath + "/template/list.htm?index=1&shopCode=" + shopCode;
                    }, 1000);
                } else {
                    $("#submitData").removeAttr("disabled").removeClass("resetbtn");
                }

            });
        });
    },

    //取消数据
    cancaleData: function () {
        $("#cancaleData").on("click", function () {
            window.location.href = basePath + "/template/list.htm?index=1&shopCode=" + shopCode;
        })
    }
}