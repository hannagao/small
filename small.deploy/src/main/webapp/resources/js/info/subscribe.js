/**
 * Created by user on 2016/01/10.
 */

var pageNum = 1, pageSize = 30, no = "", companyCode = "", source = "";

$(document).ready(function () {
    subscribeLog.init();
});

var subscribeLog = {
    init: function () {
        this.initData();   //初始化数据
        this.bindEvent();  //事件绑定
    },

    initData: function () {
        subscribeLog.search(pageNum, pageSize, no, companyCode, source);
        subscribeLog.getSearchData();
    },

    bindEvent: function () {
        subscribeLog.pageSize_chanage();
        subscribeLog.detailLogisticsData();
    },

    search: function (pageNum, pageSize, no, companyCode, source) {
        var params = {
            'no': no,
            'companyCode': companyCode,
            'source': source,
            'page.number': pageNum,
            'page.size': pageSize
        };

        var url = getUrl("info/subscribe/list");
        getExtJsonData(url, params, function (res) {
            if (!res.success) {
                var msg = isNotNull(res.statusText) ? res.statusText : "查询失败";
                iAlert(msg, "danger");
                $('.tbody').html("");
                $(".pagebigbox").hide();        //分页栏
                return;
            }
            if (res.totalCounts == 0) {
                $('.tbody').html("");
                $(".pagebigbox").hide();
                iAlert("未查询到数据");
                return;
            }
            var pagenum = res.pageNo;
            var pagecount = res.totalPages;
            //页面表格模板生成
            applyJqueryTmpl($("#listTable"), $('#logTable'), res.data)
            $("#J_totalNum").html(res.totalCounts);
            $(".pagebigbox").show();
            subscribeLog.laypage(pagecount, pagenum);    //分页
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
                    subscribeLog.search(obj.curr, pageSize, no, companyCode, source);
                }
            }
        });
    },

    //查询
    getSearchData: function () {
        $("#searchBtn").click(function () {
            no = $("#no").val();
            companyCode = $("#companyCode").val();
            source = $("#source").val();
            subscribeLog.search(pageNum, pageSize, no, companyCode, source);
        })
    },

    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            subscribeLog.search(pageNum, pageSize, no, companyCode, source);
        });
    },

    //详情
    detailLogisticsData: function () {
        $("body").on("click", ".detail", function () {

            var $this = $(this),
                $tr = $this.parent().parent(),
                params = {
                    "id": $tr.attr("data-logisticsDataId"),
                    "source": $tr.attr("data-source"),
                    "no": $tr.attr("data-no"),
                    "companyCode": $tr.attr("data-companyCode")
                };
            var url = getUrl("info/logisticsdata/detail")
            getExtJsonData(url, params, function (res) {
                if (!res.success) {
                    iAlert(isNotNull(res.statusText) ? res.statusText : "获取物流数据详情失败", "danger", 4000);
                    return;
                }

                var logisticsInfo = res.data;
                $("#logisticsDetail .row label").each(function () {
                    var $this = $(this);
                    $this.html(logisticsInfo[$this.attr("name")]);
                });

                $("label[name='statusText']").html(res.statusText);
                var imgSrc = res.data["img"];
                if (isNull(imgSrc)) {
                    imgSrc = "../resources/img/superlogo.png";
                }
                $("#logoImg").attr("src", imgSrc);

                var list = res.data.data;
                if(isNotNull(list)){
                    applyJqueryTmpl($("#detailTmpl"), $("#detailTbody"), list);
                }else{
                    $("#detailTbody").html('<tr><td colspan="3">暂无物流信息</td></tr>') ;
                }

                $("#logisticsDetail").modal("show");
            })
        })
    }
}