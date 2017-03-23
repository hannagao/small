/**
 * Created by user on 2017/3/13.
 */
var pageNum = 1,
    pageSize = 10;
$(document).ready(function () {
    lineList.init();

});
var lineList = {
    //初始化
    init: function () {
        this.getData(pageNum, pageSize);
        this.bindEvent();
    },
    //绑定事件
    bindEvent: function () {
        this.searchData();
        this.pageSize_chanage();
        this.editLine();
        this.deleteLine();
        this.setDefault();

    },
    //获取表格数据
    getData: function (pageNum, pageSize) {
        var params=  $("#lineList").serializeObject()
        params["page.number"]=pageNum;
        params["page.size"]=pageSize;
        var url = getUrl("effective/route/list");
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
            applyJqueryTmpl($("#listTable"), $('#toolsManaegTable'), res.data);
            $("#J_totalNum").html(res.totalCounts);
            $(".pagebigbox").show();
            lineList.laypage(pagecount, pagenum);    //分页
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
                    lineList.getData( obj.curr, pageSize);
                }
            }
        });
    },
    //查询数据
    searchData: function () {
        $("#searchBtn").click(function () {
            type = $("#type").val();
            status = $("#status").val();
            name = $("#name").val();
            shopCode = $("#shopCode").val();
            lineList.getData( pageNum, pageSize);
        })
    },
    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            lineList.getData(pageNum, pageSize);
        });
    },
    //编辑
    editLine: function () {
        //编辑
        $("body").on("click", ".setTemplate", function () {
            var $this = $(this),
                id = $(this).attr("data-shopCode");
            $this.attr("target", "_self").attr("href", "editTools.htm?id=" + id)
        })
    },
    //删除
    deleteLine: function () {
        $("body").on("click", ".deleteTools", function () {
            var params = {"id": $(this).attr("data-id")},
                url = getUrl("effective/route/delete"),
                message =
                    "<div class='confrimTip'>您确定要删除吗?<p>删除后不可恢复！</p></div>";

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
                            if(!ajaxResponse(res)){
                                return;
                            }
                            lineList.getData(pageNum, pageSize);
                        }
                    });
                }
            );
        });
    },
    //设为默认
    setDefault: function () {
        $("body").on("click", ".default", function () {
            var params = {"id": $(this).attr("data-id")},
                url =getUrl("effective/route/setDefaults"),
                message = "<div class='confrimTip'>您确定要设置当前模板为默认模板吗?</div>";
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
                            if(!ajaxResponse(res)){
                                return;
                            }
                            lineList.getData( pageNum, pageSize);
                        }
                    });
                }
            );
        });

    }
}

