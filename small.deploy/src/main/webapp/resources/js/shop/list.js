/**
 * Created by user on 2016/12/21.
 */

$(document).ready(function () {
    shop.init();
});

var shop = {
    init: function () {
        shop.getSearchData();
        shop.setTemplate();
    },

    //查询
    getSearchData: function () {
        var params = {},
            url = getUrl("shop/list");
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

            var list = res.data;
            //页面表格模板生成
            applyJqueryTmpl($("#listTable"), $('#shopTable'), list)
        });
    },

    setTemplate: function () {
        $("body").on("click", ".setTemplate", function () {
            var $this = $(this),
                shopCode = $(this).attr("data-shopCode");
            $this.attr("target", "_self").attr("href", basePath + "/template/list.htm?shopCode=" + shopCode)
        })
    }
}

