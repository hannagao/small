/**
 * Created by user on 2016/12/21.
 */
var code = "",
    shopName = "",
    shopStatus = "",
    platformName = "";

$(document).ready(function () {
    tools.init();
});

var tools = {
    init: function () {
        this.initData();
        this.bindEvent();
    },

    //初始化数据
    initData: function () {
        this.getData();
    },

    //事件绑定
    bindEvent: function () {
        this.closeSets();
        this.setsDetail();
        this.addRow();
        this.deleteRow();
        this.addSetsData();
        this.clickTable();
    },

    //获取表格数据
    getData: function () {
        var params = {},
            url = getUrl("setting/notify/list");
        getExtJsonData(url, params, function (res) {
            if (!res.success) {
                var msg = isNotNull(res.statusText) ? res.statusText : "查询失败";
                iAlert(msg, "danger");
                $('.tbody').html("");
                return;
            }
            if (isNull(res.data)) {
                $('.tbody').html("");
                iAlert("未查询到数据");
                return;
            }
            //页面表格模板生成
            applyJqueryTmpl($("#setNotifyTableTemplate"), $('#setNotifyTable'), res.data);

        });
    },

    //开启关闭
    closeSets: function () {
        $("body").on("click", ".closeSets", function () {
            var status = $(this).attr("data-status"),
                url = "",
                params = {
                    "shopCode": $(this).attr("data-code"),
                    "shopName": $(this).attr("data-name"),
                    "platformName": $(this).attr("data-platformName")
                },
                text = "",
                message = "";

            if (0 == status) {
                url = getUrl("setting/notify/ON");
                text = "开启";
            } else {
                url = getUrl("setting/notify/OFF");
                text = "关闭";
            }

            message = "<div class='confrimTip'>您确定要" + text + "异常通知吗?</div>";
            layer.confirm(message,
                {
                    title: '提示',
                    offset: ['180px']
                },
                function (index) {
                    layer.close(index);
                    getExtJsonData(url, params, function (res) {
                        //成功后更新数据
                        if (ajaxResponse1(res)) {
                            tools.getData();
                        }
                    });
                }
            );
        });
    },

    //设置详情
    setsDetail: function () {
        $("body").on("click", ".setsDetail", function () {
            platformName = $(this).attr("data-platformName");
            shopName = $(this).attr("data-name");
            shopStatus = $(this).attr("data-status");
            code = $(this).attr("data-code");

            var setarr = [{
                "shopCode": code,
                "shopName": shopName,
                "platformName": platformName
            }];

            applyJqueryTmpl($("#setsDetailTemplate"), $('#setsDetail'), setarr);
            var params = {shopCode: code},
                url = getUrl("setting/notify/queryByShopCode");
            getExtJsonData(url, params, function (res) {
                if (!ajaxResponse(res)) {
                    return;
                }
                var regionsAraa = res.data;
                if (isNull(regionsAraa)) {
                    applyJqueryTmpl($("#setAbnormalPerTemplate"), $('#setAbnormalPer'), "");
                } else {
                    applyJqueryTmpl($("#setAbnormalPerTemplate"), $('#setAbnormalPer'), res.data);
                }
            });
        });
    },

    //添加一行
    addRow: function () {
        $("body").on("click", ".addToolRow", function () {
            var appendtr = '<tr class="list"><td><input type="text" maxlength="20" name="personName"/></td>' +
                '<td><input type="text" class="email" maxlength="64" name="email" onblur="checkEmail($(this).val())" /></td>' +
                '<td><span  class="deletePerson"   data-id="${id}">删除</span></td></tr>';
            $(this).parent().parent().before(appendtr);
        });
    },

    //删除一行
    deleteRow: function () {
        $("#setAbnormalPer").on("click", ".deletePerson", function () {
            var that = $(this);
            that.parent().parent()[0].remove();
        });
    },

    //提交数据
    addSetsData: function () {
        var that=this;
        $(".confirmbtn").click(function () {
            var isConfirm = true;
            var personDTOList = [],
                emailList = [],
                nameList = [],
                name = "",
                email = "";
            $("#setAbnormalPer tr.list").each(function () {
                if (0 < $(this).find("td input").length) {
                    $(this).find("input[name*='personName']").each(function () {
                        name = $(this).val();
                    })
                    $(this).find("input[name*='email']").each(function () {
                        email = $(this).val();
                    })
                } else {
                    $(this).find("span[class*='personName']").each(function () {
                        name = $(this).text();
                    })
                    $(this).find("span[class*='email']").each(function () {

                        email = $(this).text();
                    })
                }
                personDTOList.push({
                    "personName": name,
                    "email": email
                })
                nameList.push(name);
                emailList.push(email);
            });
            emailList.map(function (item) {
                if (item == "") {
                    iAlert("邮件不能为空！", "danger");
                    isConfirm = false;
                } else {
                    if (!checkEmail(item)) {
                        isConfirm = false;
                    }
                }
            });

            nameList.map(function (item) {
                if (item == "") {
                    iAlert("联系人姓名不能为空！", "danger");
                    isConfirm = false;
                }
            });


            var url = getUrl("setting/notify/setting"),
                params = {
                    "personDTOList": personDTOList,
                    "settingNotifyDTO": {
                        "platformName": platformName,
                        "shopCode": code,
                        "shopName": shopName,
                        "status": shopStatus
                    }
                };


            if (isConfirm) {
                getExtJsonDataJson(url, JSON.stringify(params), function (res) {
                    if (res.success === false) {
                        iAlert(res.statusText, "danger");
                    }
                    that.getData();
                    $("#setModal").modal("hide");
                });
            }

        })

    },

    clickTable: function () {
        var E_document = $(document);
        E_document.on("click", "table tbody tr", function () {
            var that = $(this);
            var highLight = "table-tr-highlight";
            that.removeClass(highLight);
        });
    }
}


