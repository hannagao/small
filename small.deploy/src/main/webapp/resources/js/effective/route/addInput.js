/**
 * Created by user on 2017/3/10.
 */
var id = GetQueryString("id");
$(document).ready(function () {
    houlist.initData();
})

var houlist = {
    initData: function () {
        this.getData();
        this.bindEvent();
    },
    getData: function () {
        //编辑
        if (isNotNull(id)) {
            var params = {};
            params["id"] = id;
            var url = getUrl("effective/route/findDetails");
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
                $("#name").val(res.data.name);
                $("#remark").val(res.data.remark);
                //页面表格模板生成
                applyJqueryTmpl($("#edithourTmpl"), $('#hourTable'), res.data.details);
            });
        } else {
            var params = {};
            var url = getUrl("common/provinces/cityList");
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
                applyJqueryTmpl($("#hourTmpl"), $('#hourTable'), res.data);
            });
        }

    },

    bindEvent: function () {
        this.setCityHour();
        this.confirmHour();
        this.clcikTable();
    },
    //移除表格悬停事件
    clcikTable: function () {
        var E_document = $(document);
        E_document.on("click", "table tbody tr", function () {
            var that = $(this);
            var highLight = "table-tr-highlight";
            that.removeClass(highLight);
        });
        E_document.on("mousemove", "table tbody tr ", function () {
            var that = $(this);
            var highLight1 = "tablehover";
            that.removeClass(highLight1);
        });
    },
    //设置快递物流时间
    setCityHour: function () {
        var that;
        //单个设置
        $("body").on("click", ".setHour", function () {
            $("#express").val("");
            $("#loginstic").val("");
            $("#setHourModel").modal("show");
            that = $(this).parent().parent();
        })

        //提交
        $(".confirmbtn").click(function () {
            var expressHour = that.find(".expressHour input"),
                logisticHour = that.find(".loginsticHour input"),
                express = $("#express").val(),
                loginstic = $("#loginstic").val();
            if (express.length > 0) {
                expressHour.each(function () {
                    var $this = $(this);
                    $this.val(express);
                    $(".confirmbtn").attr("data-dismiss", "modal");
                });

            }
            if (loginstic.length > 0) {
                logisticHour.each(function () {
                    var $this = $(this);
                    $this.val(loginstic);
                    $(".confirmbtn").attr("data-dismiss", "modal");
                });
            }
            $(".confirmbtn").attr("data-dismiss", "modal");
        })


        //批量设置
        $(".allset").click(function () {
            $("#setAllHourModel").modal("show");
        })
        //
        //批量提交
        $(".confirmallbtn").click(function () {
            var allexpress= $("#allexpress").val();

            var alllogins= $("#allloginstic").val();
            $(".expressHour input").each(function () {
                $(this).val(allexpress);
            })
            $(".loginsticHour input").each(function () {
                $(this).val(alllogins);
            })

            $(".confirmallbtn").attr("data-dismiss", "modal");
        })
    },
    //提交
    confirmHour: function () {
        $("#confirmBtn").click(function () {
            commonUtils.startLoading();
            var name = $("#name").val(),
                remark = $("#remark").val(),
                details = [];
            if (name == "") {
                iAlert("名称不能为空!", "danger");
                commonUtils.stopLoading();
                return;
            }
            if ( (!vailMaxHour("不能为空最多能输入1位小数,且值位于0到720之间") )) {
                commonUtils.stopLoading();
                return;
            }
            $("#hourTable tr td.loginsticHour").each(function (){
                if (isNotNull(id)) {
                    var provinceId = $(this).parent().attr("provinceId");
                } else {
                    var provinceId = $(this).parent().attr("id");
                }
                $(this).find("input[name*='loginhour']").each(function () {
                    details.push({
                        "cityName": $(this).attr("cityname"),
                        "provinceId": provinceId,
                        "requireTime": $(this).val(),
                        "cityId": $(this).attr("id"),
                        "effectiveType": 2
                    })

                })


            });
            $("#hourTable tr td.expressHour").each(function () {
                if (isNotNull(id)) {
                    var provinceId = $(this).parent().attr("provinceId");
                } else {
                    var provinceId = $(this).parent().attr("id");
                }
                $(this).find("input[name*='exphour']").each(function () {
                    details.push({
                        "cityName": $(this).attr("cityname"),
                        "provinceId": provinceId,
                        "requireTime": $(this).val(),
                        "cityId": $(this).attr("id"),
                        "effectiveType": 1
                    })

                })


            });
            var name=delHtmlSpace($("#name").val()),
             template = {
                "name": name,
                "remark": remark,
                "id":id
            },
             params = {
                "template": template,
                "details": details
            },
            url = getUrl("effective/route/submit");
            getExtJsonDataJson(url, JSON.stringify(params), function (res) {
                //页面表格模板生成
                if (!res.success) {
                    var msg = isNotNull(res.statusText) ? res.statusText : "提交失败";
                    iAlert(msg, "danger");
                    commonUtils.stopLoading();
                    return;
                }
                $("#confirmBtn").attr("disabled","disabled");
                $("#confirmBtn").css("background","#ddd");
              setInterval(function () {
                  window.location.href="list.htm";
                  commonUtils.stopLoading();
              },1000)

            });

        })
        //返回
        $(".backBtn").click(function () {
            window.location.href = "list.htm";
        })
    },
}