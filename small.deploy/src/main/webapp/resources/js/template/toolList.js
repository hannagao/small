/**
 * Created by user on 2016/12/21.
 */
var pageNum = 1,
    pageSize = 10,
    type = "",
    status = "",
    name = "",
    shopCode = "";
var dataProvider = {
    _errorHandle: function (response, callback) {
        if (response.success === true) {
            callback(response)
        } else {
            iAlert(response.statusText, "danger");
        }
    },
    F_addTools: function (queryData, callback) { // search
        var that = this;
        url = getUrl("logisticsTool/insertOrUpdate");
        getExtJsonDataJson(url, queryData, function (response) {
            commonUtils.stopLoading();
            that._errorHandle(response, callback);
        });
    },
    F_shops:function(queryData, callback) { // fetch province
        var that = this;
        url = getUrl("shop/list");
        getExtJsonData(url, queryData, function (response) {
            that._errorHandle(response, callback);

        });
    },
    F_search: function (queryData, callback) { // search
        var that = this;
        url = getUrl("logisticsTool/findById");
        getExtJsonData(url, queryData, function (response) {
            that._errorHandle(response, callback);
        });
    },
    F_queryCompany:function (query) { // search
    },
    F_queryNetWork:function (query) { // search
        url = getUrl("logisticsTool/queryNetWork");
        getExtJsonData(url,query ,function (response) {
            //页面表格模板生成
            applyJqueryTmpl($("#networkTableTemplate"), $('#networkTable'), response.data);
        });
    },
    laypage:function (pagecount, pagenum) {
        laypage({
            cont: $('#tcdPageCode'),
            pages: pagecount,
            skip: true,
            skin: '#69b755',
            groups: 3,
            curr: pagenum || 1,
            jump: function (obj, first) {
                var query= {
                    "page": pageNum,
                    "pageSize": pageSize
                };
                if (!first) {
                    query.page=obj.curr,
                        query.pageSize=pageSize;
                    dataProvider.F_queryCompany(query,function (response) { // initial table data
                    });

                }
            }
        });
    },

};
$(document).ready(function () {
    tools.init();

});

var tools = {
    //初始化
    init: function () {
        this.getData(type, status, name, shopCode, pageNum, pageSize);
        this.getShop();
        this.bindEvent();
    },
    //绑定事件
    bindEvent: function () {
        this.searchData();
        this.pageSize_chanage();
        this.editTools();
        this.deleteTools();
        this.forbidTools();
        this.queryTool();
        this.reachableAreas();

    },
    //获取店铺数据
    getShop: function () {
        var params = {};
        var url = getUrl("shop/list");
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
    getData: function (type, status, name, shopCode, pageNum, pageSize) {
        var params = {
            'type': type,
            'status': status,
            'name': name,
            shopCode: shopCode,
            'page.number': pageNum,
            'page.size': pageSize
        };
        var url = getUrl("logisticsTool/list");
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
            tools.laypage(pagecount, pagenum);    //分页
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
                    tools.getData(type, status, name, shopCode, obj.curr, pageSize);
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
            tools.getData(type, status, name, shopCode, pageNum, pageSize);
        })
    },
    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            tools.getData(type, status, name, shopCode, pageNum, pageSize);
        });
    },
    //编辑
    editTools: function () {
        //编辑
        $("body").on("click", ".setTemplate", function () {
            var $this = $(this),
                id = $(this).attr("data-shopCode");
            $this.attr("target", "_self").attr("href", "editTools.htm?id=" + id)
        })
    },
    //删除
    deleteTools: function () {
        $("body").on("click", ".deleteTools", function () {
            var params = {"logisticsToolId": $(this).attr("data-id")},
                url = getUrl("logisticsTool/delete"),
                message =
                    "<div class='confrimTip'>您确定要删除选中的物流工具吗?</div>";

            layer.confirm(message,
                {
                    title: '物流工具',
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
                            tools.getData();
                        }
                    });
                }
            );
        });
    },
    //禁用启用
    forbidTools: function () {
        $("body").on("click", ".forbidTools", function () {
            var status = $(this).attr("data-status"),
                url = "",
                params = {"logisticsToolId": $(this).attr("data-id")},
                text = "",
                message = "";

            if (0 == status) {
                url = getUrl("logisticsTool/ON");
                text = "启用";
            } else {
                url = getUrl("logisticsTool/OFF");
                text = "禁用";
            }

            message = "<div class='confrimTip'>您确定要" + text + "选中的物流工具吗?</div>";
            layer.confirm(message,
                {
                    title: '物流工具',
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
                            tools.getData();
                        }
                    });
                }
            );
        });
    },
    //查看
    queryTool: function () {
        $("body").on("click", ".queryTool", function () {
                var url =getUrl("logisticsTool/findById"),
                    params = {"id": $(this).attr("data-id")};
            getExtJsonData(url, params, function (res) {
                if(!ajaxResponse(res)){
                    return;
                }
                $("#queryName").text(res.data.name);
                $("#queryTypeDesc").text(res.data.typeDesc);
                $("#queryStatusDesc").text(res.data.statusDesc);
                $("#queryRemark").text(res.data.remark==null?"暂无":res.data.remark);
                $("#comapny").text(res.data.type == 1? '指定承运商':'指定自提点');
                $("#hasComapny").text(res.data.hasSetLogisticsCompany == 1 ? '是' : (res.data.hasSelfNetwork==1) ? '是' : '否');
                if(res.data.hasSetLogisticsCompany==1){
                    $(".queryCompany").css("display","block");
                }else{
                    $(".queryCompany").css("display","none");
                }
                if(res.data.hasSelfNetwork==1){
                    $(".queryNetwork").css("display","block");
                }else{
                    $(".queryNetwork").css("display","none");
                }


                var shopList=res.data.shopLogisticsToolROList;
                applyJqueryTmpl($("#shopTem"), $('#shop'),shopList);
                var companyROList=res.data.companyROList;
                applyJqueryTmpl($("#appointCompanyTableTemplate"), $('#appointCompanyTable'),companyROList);
                var networkROList=res.data.networkROList;
                applyJqueryTmpl($("#appointNetworkTableTemplate"), $('#appointNetworkTable'),networkROList);


            });
        })
    },
    //适用区域
    reachableAreas: function () {
        //鼠标悬停显示区县
        $("body").on("mousemove",".applicabeleScope .provice>li>.city>li" ,function () {
            $(this).find(".district").show();
        });
      //鼠标悬停显示区县
        $("body").on("mouseout",".applicabeleScope .provice>li>.city>li" ,function () {
            $(this).find(".district").hide();
        });
        $("body").on("click", ".reachableAreas", function () {

            id = $(this).attr("data-id");
            var params = {
                logisticsToolId:id
            };
            var url = getUrl("logisticsTool/queryArea");
            getExtJsonData(url, params, function (res) {
                if(!ajaxResponse(res)){
                    return;
                }
                var regionsAraa=res.data;
                if(isNull(regionsAraa)){
                    $(".noArea").css("display","block");
                    $(".noArea").html("请联系资源中心,为物流工具下的承运商设置配置区域!");
                    applyJqueryTmpl($("#regionsTmpl"), $('#regionsList'), "");
                }else{
                    $(".noArea").css("display","none");
                    applyJqueryTmpl($("#regionsTmpl"), $('#regionsList'), regionsAraa);
                }

                $("#reachableAreasModal").modal("show");
            });

        })

    }
}

