/**
 * Created by user on 2016/12/21.
 */
var pageNum = 1,
    pageSize = 30,
    shopCode = "",
    orderNo = "",
    createTimeFrom = "",
    createTimeTo = "",
    chargingStatus = "",
    pickUpSelf = "";

$(document).ready(function () {
    orderList.init();
});

var orderList = {
    //初始化
    init: function () {
        this.initData();
        this.bindEvent();
    },

    //初始化数据
    initData: function () {
        this.getData(shopCode, orderNo, createTimeFrom, createTimeTo, pickUpSelf, chargingStatus, pageNum, pageSize);
        this.getShop();
    },

    //事件绑定
    bindEvent: function () {
        this.searchData();
        this.pageSize_chanage();
        this.time();
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
    getData: function (shopCode, orderNo, createTimeFrom, createTimeTo, pickUpSelf, chargingStatus, pageNum, pageSize) {
        var params = {
                shopCode: shopCode,
                'orderNo': orderNo,
                'createTimeFrom': createTimeFrom,
                'createTimeTo': createTimeTo,
                'pickUpSelf': pickUpSelf,
                'chargingStatus': chargingStatus,
                'page.number': pageNum,
                'page.size': pageSize
            },
            url = getUrl("monitor/submitOrder/list");
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
            applyJqueryTmpl($("#orderTableTemplate"), $('#orderTable'), res.data);
            $("#J_totalNum").html(res.totalCounts);
            $(".pagebigbox").show();
            orderList.laypage(pagecount, pagenum);    //分页
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
                    orderList.getData(shopCode, orderNo, createTimeTo, createTimeFrom, pickUpSelf, chargingStatus, obj.curr, pageSize);
                }
            }
        });
    },

    //查询数据
    searchData: function () {
        $("#searchBtn").click(function () {
            shopCode = $("#shopCode").val();
            orderNo = $("#orderNo").val();
            createTimeFrom = $("#createTimeStart").val();
            createTimeTo = $("#createTimeEnd").val();
            chargingStatus = $("#chargingStatus").val();
            pickUpSelf = $("#pickUpSelf").val();
            orderList.getData(shopCode, orderNo, createTimeFrom, createTimeTo, pickUpSelf, chargingStatus, pageNum, pageSize);
        })
    },

    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            orderList.getData(shopCode, orderNo, createTimeFrom, createTimeTo, pickUpSelf, chargingStatus, pageNum, pageSize);
        });
    },

    ////查看详情
    //lookDetail: function () {
    //    $("body").on("click", ".lookDetail", function () {
    //        var url = getUrl("monitor/submitOrder/queryById"),
    //            params = {"id": $(this).attr("data-id")};
    //        getExtJsonData(url, params, function (res) {
    //            if (!ajaxResponse(res)) {
    //                return;
    //            }
    //            applyJqueryTmpl($("#orderDetailTem"), $('#orderDetail'), res.data);
    //            $("#orderModal").modal("show");
    //
    //        });
    //    })
    //},

    //时间
    time: function () {
        createLayerTime("createTimeStart", "createTimeEnd", "YYYY-MM-DD  hh:mm:ss", true);
    }
}
