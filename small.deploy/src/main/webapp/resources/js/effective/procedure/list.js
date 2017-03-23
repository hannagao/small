/**
 * Created by user on 2017/3/13.
 */
var pageNum = 1,
    pageSize = 10,
    id="";

$(document).ready(function () {
    distributionProcess.init();

});

var distributionProcess = {
    //初始化
    init: function () {
        this.getData(pageNum, pageSize);
        this.bindEvent();
    },
    //绑定事件
    bindEvent: function () {
        this.searchData();
        this.pageSize_chanage();
        this.editDistriPro();
        this.deleteDistriPro();
        this.setDefault();
        this.confirmData();
    },
    //获取表格数据
    getData: function (pageNum, pageSize) {
        var params=  $("#distributionProcess").serializeObject();
        params["page.number"]=pageNum;
        params["page.size"]=pageSize;
        var url = getUrl("effective/procedure/list");
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
            distributionProcess.laypage(pagecount, pagenum);    //分页
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
                    distributionProcess.getData(obj.curr, pageSize);
                }
            }
        });
    },
    //查询数据
    searchData: function () {
        $("#searchBtn").click(function () {
            distributionProcess.getData(pageNum, pageSize);
        })
    },
    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            distributionProcess.getData(pageNum, pageSize);
        });
    },
    //编辑
    editDistriPro: function () {
        //编辑
        $("body").on("click", ".setTemplate", function () {
            id = $(this).attr("data-id"),
            params={};
            params["id"]=id;
            var url = getUrl("effective/procedure/queryById");
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
                $("#distributionProgressForm  input").each(function () {
                    var $this = $(this);
                    $this.val(res.data[$this.attr("name")]);
                });
                $("#remark").html(res.data.remark);
                $("#progressTempModal").modal("show");
            });

        })
        //添加
        $("body").on("click", ".addPeogressTemp", function () {
            var data=[];
            $("#distributionProgressForm  input").each(function () {
                var $this = $(this);
                $this.val(data[$this.attr("name")]);
            });
            $("#remark").html("");
            id="";
            $("#progressTempModal").modal("show");
        })
    },
    //删除
    deleteDistriPro: function () {
        $("body").on("click", ".deleteTools", function () {
            var params = {"id": $(this).attr("data-id")},
                url = getUrl("effective/procedure/delete"),
                message =
                    "<div class='confrimTip'>确定要删除吗？<p>删除后不可恢复!</p></div>";

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
                            distributionProcess.getData(pageNum, pageSize);
                        }
                    });
                }
            );
        });
    },
    //设为默认
    setDefault: function () {
        $("body").on("click", ".setDefault", function () {
            var id = $(this).attr("data-id"),
                url = "",
                params = {"id":id};
                url = getUrl("effective/procedure/setDefault");

            message = "<div class='confrimTip'>您确定要设置当前模板为默认模板吗？</div>";
            layer.confirm(message,
                {
                    title: '提示',
                    offset: ['180px']
                },
                function (index) {
                    layer.close(index);
                    getExtJsonData(url, params, function (res) {
                        //成功后更新数据
                        if(!ajaxResponse(res)){
                            return;
                        }
                        if (ajaxResponse1(res)) {
                            distributionProcess.getData(pageNum, pageSize);
                        }
                    });
                }
            );
        });
    },
    //提交数据
    confirmData: function () {
        $(".confirmbtn").click(function () {
            var isConfirm = true;
            var params=$("#distributionProgressForm").serializeObject(),
            url=getUrl("effective/procedure/insertOrUpdate"),
            name = $("#name").val();
             if (name == "") {
                iAlert("名称不能为空!", "danger");
                 isConfirm=false;
                 console.log(22);
                 return;
            }
            if ( (!vailMinHour("不能为空最多能输入1位小数,且值位于0到72之间") )) {
                isConfirm=false;
                return;
            }
             name=delHtmlSpace(name);
            params["name"]=name;
            params["id"]=id;
            if(isConfirm){
                getExtJsonDataJson(url, JSON.stringify(params), function (res) {
                    if (res.success === false) {
                        iAlert(res.statusText, "danger");
                    }
                    $("#progressTempModal").modal("hide");
                    distributionProcess.getData(pageNum, pageSize);


                })
            }




        })
    }

}

