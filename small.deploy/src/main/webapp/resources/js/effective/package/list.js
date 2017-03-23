/**
 * Created by user on 2017/3/14.
 */
var pageNum = 1,
    pageSize = 30;

$(document).ready(function () {
    packageList.init();
});
var packageList = {
    init: function () {
        this.initData();
        this.bindEvent();
    },

    //初始化数据
    initData: function () {
        this.getData(pageNum,pageSize);
        this.time();
    },

    //事件绑定
    bindEvent: function () {
        this.searchData();
        this.pageSize_chanage();
        this.lookParamsDetail();
        this.detailLogisticsData();
    },


    //获取表格数据
    getData: function (pageNum, pageSize) {
        var params=  $("#packageList").serializeObject();
        params["page.number"]=pageNum;
        params["page.size"]=pageSize;
            url = getUrl("effective/package/list");
        var startTime=$("#stockOutStartTime").val();
        var endTime=$("#stockOutEndTime").val()
        if(startTime!=""&&endTime==""){
            iAlert("请设置结束时间!","danger");
            return;
        }else if(startTime==""&&endTime!=""){
            iAlert("请设置开始时间!","danger");
            return;
        }
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
            packageList.laypage(pagecount, pagenum);    //分页
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
                    packageList.getData(obj.curr, pageSize);
                }
            }
        });
    },

    //查询数据
    searchData: function () {
        $("#searchBtn").click(function () {
            packageList.getData( pageNum, pageSize);
        })
    },

    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            packageList.getData(pageNum, pageSize);
        });
    },

    //时间
    time: function () {
        createLayerTime("stockOutStartTime", "stockOutEndTime", "YYYY-MM-DD  hh:mm:ss", true);
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
