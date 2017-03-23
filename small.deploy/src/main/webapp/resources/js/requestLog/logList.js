/**
 * Created by user on 2016/12/21.
 */
var pageNum = 1,
    pageSize = 30,
    shopCode = "",
    orderNo = "",
    requestTimeFrom = "",
    requestTimeTo = "",
    requestType="",
    status = "";

$(document).ready(function () {
    logList.init();
});
//定义运费请求日志对象
var logList = {
    init: function () {
        this.initData();
        this.bindEvent();
    },

    //初始化数据
    initData: function () {
        this.getData(shopCode, orderNo, requestTimeFrom, requestTimeTo, status,requestType,pageNum,pageSize);
        this.getShop();
        this.time();
    },

    //事件绑定
    bindEvent: function () {
        this.searchData();
        this.pageSize_chanage();
        this.lookParamsDetail();
        this.detailLogisticsData();
    },

    //获取店铺数据
    getShop: function () {
        var params = {},
            url = getUrl("shop/list");
        getExtJsonData(url, params, function (res) {
            if (!res.success) {
                var msg = isNotNull(res.statusText) ? res.statusText : "获取店铺数据失败";
                iAlert(msg, "danger");
                return;
            }
            if (isNull(res.data)) {
                iAlert("未获取到店铺数据");
                return;
            }
            var htmlContentHtml = $("#shopTemplate").tmpl(res.data);
            $("#shopCode").append(htmlContentHtml);
        });
    },

    //获取表格数据
    getData: function (shopCode, orderNo, requestTimeFrom, requestTimeTo, status,requestType, pageNum, pageSize) {
        var params = {
                'shopCode': shopCode,
                'orderNo': orderNo,
                'requestTimeFrom': requestTimeFrom,
                'requestTimeTo': requestTimeTo,
                'status': status,
                'requestType':requestType,
                'page.number': pageNum,
                'page.size': pageSize
            },
            url = getUrl("monitor/requestLog/list");

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

            var pagenum = res.pageNo;
            var pagecount = res.totalPages;
            //页面表格模板生成
            applyJqueryTmpl($("#logTableTemplate"), $('#logTable'), res.data);
            $("#J_totalNum").html(res.totalCounts);
            $(".pagebigbox").show();
            logList.laypage(pagecount, pagenum);    //分页
        });
    },

    //分页
    laypage: function (pagecount, pagenum) {
        laypage({
            cont: $('#tcdPageCode'),
            pages: pagecount,
            skip: true,
            skin: '#69b755',
            groups: 3,
            curr: pagenum || 1,
            jump: function (obj, first) {
                if (!first) {
                    logList.getData(shopCode, orderNo, requestTimeFrom, requestTimeTo, status,requestType,obj.curr, pageSize);
                }
            }
        });
    },

    //查询数据
    searchData: function () {
        $("#searchBtn").click(function () {
            shopCode = $("#shopCode").val();
            orderNo = $("#orderNo").val();
            requestTimeFrom= $("#createTimeStart").val();
            requestTimeTo= $("#createTimeEnd").val();
            requestType=$("#requestType").val();
            status = $("#status").val();
            logList.getData(shopCode, orderNo, requestTimeFrom, requestTimeTo,status,requestType, pageNum, pageSize);
        })
    },

    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            logList.getData(shopCode, orderNo, requestTimeFrom, requestTimeTo, status, requestType,pageNum, pageSize);
        });
    },

    //时间
    time: function () {
        createLayerTime("createTimeStart", "createTimeEnd", "YYYY-MM-DD  hh:mm:ss", true);
    },

    //入参详情
    lookParamsDetail: function () {
        $("body").on("click", ".lookParamsDetail", function () {
            var params = {
                    "id": $(this).attr("data-id"),
                },
                url = getUrl("monitor/requestLog/query");

            getExtJsonData(url, params, function (res) {
                if (!res.success) {
                    iAlert(isNotNull(res.statusText) ? res.statusText : "获取物流数据详情失败", "danger", 4000);
                    return;
                }

                var list = res.data.requestDetail;
                if (isNotNull(list)) {
                    $("#logDetail").html(list);
                }else{
                    $("#logDetail").html("暂无详情");
                }
                $("#logDetailModal").modal("show");
            })
        })
    },

    //异常详情
    detailLogisticsData: function () {
        $("body").on("click", ".detail", function () {
            var logs = $(this).attr("data-log");
            $("#exceptionDetailDialog").modal("show");
            $(".exceptionLogs").empty().html(logs);
        })
    }

}
