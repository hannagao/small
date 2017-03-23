/**
 * Created by user on 2016/12/21.
 */
var shopCode = "",
    pattern = 0,
    tabIndex = 0;
$(document).ready(function () {
    templateList.init();
});

var templateList = {
    init: function () {
        this.initData();   //初始化数据
        this.bindEvent();  //事件绑定
    },

    //初始化数据
    initData: function () {
        this.getLocationData();
        this.initTab();
        this.getPattern();
        this.getSingelTmplData();
        this.getShopTmplData();
    },

    //事件绑定
    bindEvent: function () {
        this.editPattern();
        this.changePattern();
        this.submitPattern();
        /** 单品 **/
        this.addSingleTempl();
        this.editSingleTemp();
        this.deleteSingleTemp();
        this.showOrHideTable();
        /** 店铺 **/
        this.addShopTempl();
        this.editShopTempl();
        this.deleteShopTempl();

    },

    //获取url参数
    getLocationData: function () {
        var data = getLocationParam();
        shopCode = data["shopCode"];
        tabIndex = isNull(data["index"]) ? 0 : data["index"];
    },

    //初始化tab页选中
    initTab: function () {
        $(".nav-tabs a").on("click", function () {
            var $this = $(this);
            var visibleId = $this.attr("href").substring(1);
            $(".tab-pane").hide();
            $("#" + visibleId).show();
        });

        var $activeTab = $(".tab .nav-tabs li").eq(tabIndex);
        $activeTab.addClass("active").siblings().removeClass("active");
        $activeTab.find("a").trigger("click");
    },

    //获取运费应用模式
    getPattern: function () {
        var params = {"shopCode": shopCode},
            url = getUrl("template/settings");
        getExtJsonData(url, params, function (res) {
            if (!ajaxResponse(res)) {
                return;
            }
            var data = res.data;
            if (isNotNull(data)) {
                $("#patternDesc").html(data.patternDesc);
                $("#editPattern").attr("data-id", data.id);
                $("input[type='radio'][name='pattern'][value='" + data.pattern + "']").attr("checked", true);
                //单品运费模式
                pattern = data.pattern;
                if (1 == pattern) {
                    $("input[type='radio'][name='multipleItemPattern'][value='" + data.multipleItemPattern + "']").attr("checked", true);
                }
            }
        })
    },

    //单品运费列表
    getSingelTmplData: function () {
        var params = {"shopCode": shopCode},
            url = getUrl("template/item/list");
        getExtJsonData(url, params, function (res) {
            //返回无数据时，return
            if (!ajaxResponseNoAlert(res, $('#singleTmplList'))) {
                return;
            }
            var data = res.data;
            //页面表格模板生成
            applyJqueryTmpl($("#singleTmpl"), $('#singleTmplList'), data);
        });
    },

    //店铺运费列表
    getShopTmplData: function () {
        var params = {"shopCode": shopCode},
            url = getUrl("template/shop/list");
        getExtJsonData(url, params, function (res) {
            //返回无数据时，return
            if (!ajaxResponseNoAlert(res, $('#shopTmplList'))) {
                $(".noDataShow").show();
                $(".hasDataShow").hide();
                return;
            }
            var shopId = res.data.id,            //店铺id
                data = res.data.groupList;
            $("#deleteShopTempl").attr("data-shopId", shopId);
            $("#editShopTempl").attr("data-shopId", shopId);
            applyJqueryTmpl($("#shopTmpl"), $('#shopTmplList'), data);
            $(".noDataShow").hide();
            $(".hasDataShow").show();
        });
    },

    //运费模板设置时 是否显示
    isShowMultipleItemPattern: function () {
        var value = $("input[type='radio'][name='pattern']:checked").val();
        // 1 -- 单品
        if (1 == value) {
            $("#isShowMultipleItemPattern").show();
            $("#isShowMixPattern").hide();
        }

        if (2 == value) {
            $("#isShowMultipleItemPattern").hide();
            $("#isShowMixPattern").hide();
        }

        if (3 == value) {
            $("#isShowMixPattern").show();
            $("#isShowMultipleItemPattern").hide();
        }

    },

    //编辑运费应用模式
    editPattern: function () {
        $("#editPattern").on("click", function () {
            $("#editPatternDialog").modal("show");
            templateList.isShowMultipleItemPattern();
        })
    },

    //切换运费模板
    changePattern: function () {
        $("input[type='radio'][name='pattern']").on("change", function () {
            templateList.isShowMultipleItemPattern();
        })
    },

    //提交运费应用模式
    submitPattern: function () {
        $("#submitPattern").on("click", function () {
            var pattern = $("input[type='radio'][name='pattern']:checked").val(),
                multipleItemPattern = pattern == "2" ? "" : $("input[type='radio'][name='multipleItemPattern']:checked").val();  // 店铺运费应用模式， multipleItemPattern="";
            var params = {
                    "id": $("#editPattern").attr("data-id"),
                    "shopCode": shopCode,
                    "pattern": pattern,
                    "multipleItemPattern": multipleItemPattern
                },
                url = getUrl("template/updatesettings");
            getExtJsonData(url, params, function (res) {
                if (!ajaxResponse1(res)) {
                    return;
                }
                templateList.getPattern();
            });
        })
    },

    /**   单品    **/
    //新增单品运费模板
    addSingleTempl: function () {
        $("#addSingleTempl").on("click", function () {
         var params={shopCode:shopCode},
             url=getUrl("logisticsTool/queryByShopCode"),
             that=$(this);
            getExtJsonData(url, params, function (res) {
                //成功后更新数据
                if (ajaxResponse1(res)) {
                    if(res.data.length>0){
                    that.attr("href", basePath + "/template/itemInput.htm?shopCode=" + shopCode).attr("_self");
                    }else{
                        iAlert("店铺下无可用的物流工具，不能新增运费模板！", "danger");
                    }

                }
            });
        })
    },

    //编辑单品运费模板
    editSingleTemp: function () {
        $("body").on("click", ".editSingleTemp", function () {
            var id = $(this).attr("data-id");
            $(this).attr("href", basePath + "/template/itemInput.htm?shopCode=" + shopCode + "&id=" + id);
        })
    },

    //删除单品运费模板
    deleteSingleTemp: function () {
        $("body").on("click", ".deleteSingleTemp", function () {
            var params = {"id": $(this).attr("data-id")},
                url = getUrl("template/item/delete"),
                message =
                    "<div class='confrimTip'>您确定要删除该运费模板吗？</div>" +
                    "<div class='confrimTip redColor'>删除后不可恢复</div>";
            layer.confirm(message,
                {
                    title: '运费模板',
                    offset: ['180px']
                },
                function (index) {
                    layer.close(index);
                    getExtJsonData(url, params, function (res) {
                        //成功后更新数据
                        if (ajaxResponse1(res)) {
                            templateList.getSingelTmplData();
                        }
                    });
                }
            );
        });
    },

    //收起表格数据
    showOrHideTable: function () {
        $("body").on("click", ".showOrHideTable", function () {
            var $this = $(this),
                showOrHide = $this.attr("data-showOrHide"),
                $table = $this.parent().parent().parent().parent().find("table");
            if (1 == showOrHide) {
                $table.show();
            } else {
                $table.hide();
            }
            $this.attr("data-showOrHide", showOrHide == 1 ? 0 : 1);
            $this.html($this.html() == "收起" ? "展开" : "收起");
        })
    },

    /**   店铺    **/
    //新增 店铺运费模板
    addShopTempl: function () {
        $("#addShopTempl").on("click", function () {
            var params={shopCode:shopCode},
                url=getUrl("logisticsTool/queryByShopCode"),
                that=$(this);
            getExtJsonData(url, params, function (res) {
                //成功后更新数据
                if (ajaxResponse1(res)) {
                    if(res.data.length>0){
                       that.attr("href", basePath + "/template/shopInput.htm?shopCode=" + shopCode);
                    }else{
                        iAlert("店铺下无可用的物流工具，不能新增运费模板！", "danger");
                    }

                }
            });

        })
    },

    //编辑 店铺运费模板
    editShopTempl: function () {
        $("#editShopTempl").on("click", function () {
            var id = $(this).attr("data-shopid");
            $(this).attr("href", basePath + "/template/shopInput.htm?shopCode=" + shopCode + "&id=" + id);
        })
    },

    //删除 店铺运费模板
    deleteShopTempl: function () {
        $("#deleteShopTempl").on("click", function () {
            var params = {"id": $(this).attr("data-shopid")},
                url = getUrl("template/shop/delete"),
                message = "";

            if (1 == pattern) {   //单品运费模式生效
                message =
                    "<div class='confrimTip'>您确定要删除该运费模板吗？</div>" +
                    "<div class='confrimTip redColor'>删除后不可恢复</div>";

                layer.confirm(message,
                    {
                        title: '运费模板',
                        offset: ['180px'],
                        area: '350px'
                    },
                    function (index) {
                        layer.close(index);
                        getExtJsonData(url, params, function (res) {
                            //成功后更新数据
                            if (ajaxResponse1(res)) {
                                templateList.getShopTmplData();
                            }
                        });
                    }
                );

            } else {            //单品运费模式生效
                message =
                    "<div class='confrimTip'>当前运费模板模式需启用店铺运费模板！</div>" +
                    "<div class='confrimTip redColor'>不能删除！</div>"
                iAlert(message, "danger", "", 350);
            }

        })
    }
}

