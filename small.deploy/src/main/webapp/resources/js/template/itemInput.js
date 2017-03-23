/**
 * Created by user on 2016/12/26.
 */
var shopCode = "",
    id = "";
$(document).ready(function () {
    itemFee.init();
});

var itemFee = {
    init: function () {
        this.initData();   //初始化数据
        this.bindEvent();  //事件绑定
    },

    //初始化数据
    initData: function () {
        this.getLocationData();
        this.getLogisticsTool();
        /*  省市关系获取 临时缓存 */
        getProvinceCityRelation();
    },

    //事件绑定
    bindEvent: function () {
        this.isFreeChange();
        this.chargingWaysChange();
        this.addToolRow();
        this.addFreeRow();
        this.deteleTableRow();
        this.changeFreeStatus();
        this.changeFreeRule();
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
    renderHtml: function (res, addOrUpdate) {
        if (!ajaxResponse(res, $('#logisticsToolList'))) {
            return;
        }

        if (isNotNull(res.data)) {
            //物流工具列表 （新增、删除都会存在数据）
            var groupRuleList = res.data.groupRuleList;
            applyJqueryTmpl($("#logisticsToolTmpl"), $('#logisticsToolList'), groupRuleList);

            //新增、编辑 初始化数据
            if (1 == addOrUpdate) {
                //名称
                $("#name").val("").focus();

                //是否包邮 （默认否）
                $("input:radio[name='isFree'][value='0']").attr("checked", true);

                //计费方式 默认（按件数）
                $("input:radio[name='chargingWays'][value='1']").attr("checked", true);

                //制定免邮  默认否
                $("#specifiedConditionFree").prop("check", false);

                // 免邮 默认的一行
                $("#isFreeList").html($("#isFreeDefalutTmpl").html());

            } else {                  //编辑 -- 根据接口数据渲染页面

                //运费模板名称
                $("#name").val(res.data.name);

                //模板id
                $("#templateId").val(res.data.id);

                //是否包邮
                $("input:radio[name='isFree'][value='" + res.data.isFree + "']").attr("checked", true);

                //计费方式 （按重量、按件）
                $("input:radio[name='chargingWays'][value='" + res.data.chargingWays + "']").attr("checked", true);

                //免邮 （赋值）
                var specifiedConditionFree = res.data.specifiedConditionFree;
                if (specifiedConditionFree) {
                    $("#specifiedConditionFree").prop("checked", true);
                }

                //免邮 表格显示
                var freeRuleList = res.data.freeRuleList;
                if (isNotNull(freeRuleList)) {
                    applyJqueryTmpl($("#isFreeUpdateTmpl"), $('#isFreeList'), res.data);
                } else {
                    //编辑时无免邮数据，设置默认的情况
                    $("#isFreeList").html($("#isFreeDefalutTmpl").html());
                }
            }

            itemFee.isFree();
            itemFee.chargingWays();
            itemFee.showFreeTable();
        }
    },

    //获取物流工具信息
    getLogisticsTool: function () {
        var addOrUpdate = 0,         //确定是新增还是编辑
            params = {},
            url = "";
        if (isNull(id)) { //新增
            params = {
                "shopCode": shopCode
            };
            url = getUrl("template/item/addInputQuery");
            addOrUpdate = 1;
        } else { //编辑
            params = {
                "id": id,
                "shopCode": shopCode
            };
            url = getUrl("template/item/query");
            addOrUpdate = 2;
        }

        getExtJsonData(url, params, function (res) {
            itemFee.renderHtml(res, addOrUpdate);
        })

    },

    //是否免邮
    isFree: function () {
        var value = $("input:radio[name='isFree']:checked").val();
        if (1 == value) { //免邮
            $("input:radio[name='isFree']").parent().parent().nextAll().hide();
            $(".table_box").hide()
        } else {
            $("input:radio[name='isFree']").parent().parent().nextAll().show();
            $(".table_box").show()
        }
    },

    //是否免邮 切换
    isFreeChange: function () {
        $("input:radio[name='isFree']").on("change", function () {
            itemFee.isFree();
        })
    },

    //计费方式
    chargingWays: function () {
        //data-columnShow ，data-columnHide 控制 “按重量”、“按件数”相关的列的 class 值
        var columnShow = $("input:radio[name='chargingWays']:checked").attr("data-columnShow"),
            columnHide = $("input:radio[name='chargingWays']:checked").attr("data-columnHide");
        $("." + columnShow).show();
        $("." + columnHide).hide();
    },

    //计费方式 切换
    chargingWaysChange: function () {
        $("input:radio[name='chargingWays']").on("change", function () {
            itemFee.chargingWays();
        })
    },

    //新增物流工具 表格行
    addToolRow: function () {
        $("body").on("click", ".addToolRow", function () {
            var appendHtml = $("#addToolTmpl").html();
            $(this).parent().parent().before(appendHtml);
            itemFee.chargingWays();
        });
    },

    //新增免邮 表格行
    addFreeRow: function () {
        $("body").on("click", ".addFreeRow", function () {
            var appendHtml = $("#addFreeTmpl").html();
            $(this).parent().parent().before(appendHtml);
        });
    },

    //删除表格内容
    deteleTableRow: function () {
        $("body").on("click", ".deteleTableRow", function () {
            $(this).parent().parent().remove();
        });
    },

    //是否显示免邮表格
    showFreeTable: function () {
        if ($("#specifiedConditionFree").is(":checked")) {
            $("#isFreeList").show();
        } else {
            $("#isFreeList").hide();
        }
    },

    //免邮状态切换
    changeFreeStatus: function () {
        $("#specifiedConditionFree").on("click", function () {
            itemFee.showFreeTable();
        })
    },

    //免邮类型切换
    changeFreeRule: function () {
        $("body").on("change", "select[name='freeRuleFlag']", function () {
            var $this = $(this),
                value = $this.val(),
                $nextTd = $this.parent().next(),
                tempHtml = "";
            if (1 == value) {
                tempHtml = '满<input class="inputWidth50" value="" name="moneyThreshold"/>元包邮';
            }
            if (2 == value) {
                tempHtml = '满<input class="inputWidth50" value="" name="quantityThreshold"/>件包邮';
            }
            if (3 == value) {
                tempHtml = '满<input class="inputWidth50" value="" name="moneyThreshold"/>元,满<input class="inputWidth50" value="" name="quantityThreshold"/>件包邮'
            }

            $nextTd.html(tempHtml);
        })
    },

    //提交数据
    submitData: function () {
        $("#submitData").on("click", function () {

            var url = getUrl("template/item/submit"),
                params = $("#templateForm").serializeObject(),   //表单系列化
                groupRuleList = [];

            //数据校验  --必填   件数  -- 只能是整数   费用或者重量 -- 只能是最多两位小数   地区设置 -- 不能为空
            if (
                (!validateBeforeSubmit())
                || (!onlyInteger("件数只能输入整数"))
                || (!vailNum("费用或者重量最多能输入两位小数,且最多输入100000的6位数字"))
                || (!validateCityNotNull())) {
                return;
            }

            $("#submitData").attr("disabled", true).addClass("resetbtn");
            //运费模板名称
            var name=delHtmlSpace($("#name").val());
            params["name"]=name;
            //店铺code
            params["shopCode"] = shopCode;

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
                        $tr.find("td.ruleData").each(function () {  // class="ruleData" 表示有数据的td
                            var $td = $(this),
                                $input = $td.find("input"),
                                key = $input.attr("name"),
                                value = $input.val();
                            trMap[key] = value;
                        });
                        ruleList.push(trMap);
                    } else {
                        $tr.find("td.ruleData").each(function (Index) {
                            var $td = $(this),
                                ruleAreaList = [];
                            if (0 == Index) {   //省市特殊处理
                                //选择的城市处理
                                var ruleAreaList = cityIdToCityMap(this);

                                trMap["ruleAreaList"] = ruleAreaList;
                                trMap["isDefaultRegionsRule"] = 0;         //非默认；
                            } else {
                                //运费处理
                                var $input = $td.find("input"),
                                    key = $input.attr("name"),
                                    value = $input.val();

                                trMap[key] = value;
                            }
                        });
                        ruleList.push(trMap);
                    }
                    tableMap["ruleList"] = ruleList;
                });
                groupRuleList.push(tableMap);
            });
            params["groupRuleList"] = groupRuleList;

            //是否免邮
            var specifiedConditionFree = $("#specifiedConditionFree").is(":checked");
            params["specifiedConditionFree"] = specifiedConditionFree ? 1 : 0;

            //免邮时，免邮内容
            if (specifiedConditionFree) {
                var freeRuleList = [],
                    that = "",
                    obj = "",
                    trMap = {};
                $("#isFreeList tbody .ruleListClass").each(function () {
                    that = this;
                    trMap = {};
                    $(that).find(".ruleData").each(function (index) {
                        obj = this;
                        if (0 == index) {   //省市特殊处理
                            //选择的城市处理
                            var ruleAreaList = cityIdToCityMap(obj);
                            trMap["ruleAreaList"] = ruleAreaList;
                        } else {
                            //包邮规则
                            var $inputOrSelect = $(obj).find("input,select");
                            $inputOrSelect.each(function () {
                                var $temp = $(this);
                                var key = $temp.attr("name"),
                                    value = $temp.val();
                                trMap[key] = value;
                            });
                        }
                    });
                    freeRuleList.push(trMap);
                })
                params["freeRuleList"] = freeRuleList;
            }


            getExtJsonDataJson(url, JSON.stringify(params), function (res) {
                if (ajaxResponse(res)) {
                    setTimeout(function () {
                        window.location.href = basePath + "/template/list.htm?index=0&shopCode=" + shopCode;
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
            window.location.href = basePath + "/template/list.htm?index=0&shopCode=" + shopCode;
        })
    }

}