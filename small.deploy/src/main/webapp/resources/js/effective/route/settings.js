/**
 * Created by user on 2017/3/13.
 */
var pageNum = 1,
    pageSize = 10,
    currentPageNum=1;
$(document).ready(function () {
    settingsList.init();

});

var settingsList = {
    //初始化
    init: function () {
        this.getData(pageNum, pageSize);
        this.getAllTemp();
        this.bindEvent();
    },
    //绑定事件
    bindEvent: function () {
        this.searchData();
        this.pageSize_chanage();
        this.checkboxAll();
        this.checkbox_single();
        this.hourTempSet();
        this.cityTempSet();

    },
    //获取表格数据
    getData: function (pageNum, pageSize) {
        var params=  $("#settingsList").serializeObject()
        params["page.number"]=pageNum;
        params["page.size"]=pageSize;
        var url=getUrl("effective/route/settings");
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
            settingsList.laypage(pagecount, pagenum);    //分页
        });
    },
    //查找所有模板effective/route/findAll
    getAllTemp: function () {
        var params={};
        var url=getUrl("effective/route/findAll");
        getExtJsonData(url, params, function (res) {
            if (!res.success) {
                var msg = isNotNull(res.statusText) ? res.statusText : "查询失败";
                iAlert(msg, "danger");
                return;
            }
            if (isNull(res.data)) {
                iAlert("未查询到监控模板数据");
                return;
            }

            //页面表格模板生成
            applyJqueryTmpl($("#lineTableTemp"), $('#lineTable'), res.data);
            //分页
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
                    currentPageNum=obj.curr;
                    settingsList.getData(obj.curr, pageSize);
                }
            }
        });
    },
    //查询数据
    searchData: function () {
        $("#searchBtn").click(function () {
            settingsList.getData( pageNum, pageSize);
        })
    },
    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            settingsList.getData( pageNum, pageSize);
        });
    },
    /*点击全选*/
    checkboxAll: function () {
        checkAll(".allChecked", ".tbody", "#box_val", "id", "input.box");
    },
    /*点击单个checkbox*/
    checkbox_single: function () {
        checkSingle(".tbody", "input.box", "#box_val", "id");
    },
    //时效模板设置
    hourTempSet: function () {
        //全选
        var singleId="",
            type="",
            params={},
            url="",
            houridarr=[],
            houridstr="",
            effectiveTemplateName="";
        //全选
        $("body").on("click", ".lineHourSet ", function () {
            houridarr=[];
            var selectNum = $(".tbody  input[type='checkbox']:checked").length;
            if(selectNum>0){
                $("#hourTempModal").modal("show");
            }else{
                iAlert("请先勾选", "danger", 1000);
                houridarr=[];
            }
            $(".tbody  input[type='checkbox']:checked").each(function () {
                houridarr.push($(this).attr("id"));
            })
            houridstr=houridarr.join(",");
        })
        //单个选择
        $("body").on("click", ".hourSet", function () {
           singleId= $(this).attr("data-id");
                type=$(this).attr("data-type");
            settingsList.getAllTemp();
            effectiveTemplateName=$(this).attr("data-name");
            $("#hourTempModal").modal("show");
            $("#lineTable").find("option[name="+effectiveTemplateName+"]").attr("selected",true);

        })
        //提交时效模板
        $(".confirmhourbtn").click(function () {

            //单个提交
            if(type==2){
                params={
                    "warehouseId":singleId,
                    "effectiveTemplateId":$("#lineTable").val()
                };
                url=getUrl("effective/route/doSetWarehouseEffective");
                type="";
            }else{
                params={
                    "warehouseIds":houridstr,
                    "effectiveTemplateId":$("#lineTable").val()
                };
                url=getUrl("effective/route/doBatchSetWarehouseEffective");
            }

            getExtJsonData(url, params, function (res) {
                if (!res.success) {
                    var msg = isNotNull(res.statusText) ? res.statusText : "获取数据失败";
                    iAlert(msg, "danger");
                    return;
                }
                $("#hourTempModal").modal("hide");
                settingsList.getData(currentPageNum,pageSize);
                //分页
            });

        })

    },
    //同城配时效模板设置
    cityTempSet: function () {
        //全选
        var singleId="",
            type="",
            params={},
            url="",
            cityidarr=[],
            cityidstr="";
           //全选
        $("body").on("click", ".cityHourSet", function () {
            cityidarr=[];
            var selectNum = $(".tbody  input[type='checkbox']:checked").length;
            if(selectNum>0){
                $("#cityTempModal").modal("show");
            }else{
                iAlert("请先勾选", "danger", 1000);
                cityidarr=[];
            }
            $(".tbody  input[type='checkbox']:checked").each(function () {
                cityidarr.push($(this).attr("id"));
            })
            cityidstr=cityidarr.join(",");
            console.log(cityidstr);
        })
        //单个选择
        $("body").on("click", ".citySet", function () {
            singleId = $(this).attr("data-id"),
                 type=$(this).attr("data-type"),
              tmsRequireTime=$(this).attr("data-time");
             if(tmsRequireTime==""){

             }else{
             $("#cityHour").val(tmsRequireTime)
             }
            $("#cityTempModal").modal("show");
        })
        //提交同城配时间
        $(".confirmcitybtn").click(function () {
            //单个提交
            if ( (!vailMaxHour("不能为空最多能输入1位小数,且值位于0到720之间") )) {
                return;
            }
            if(type==1){
                params={
                    "warehouseId":singleId,
                    "requireTime":$("#cityHour").val()
                };
                url=getUrl("effective/route/doSetTmsEffective");
                type="";
            }else{
                params={
                    "warehouseIds":cityidstr,
                    "requireTime":$("#cityHour").val()
                };
                url=getUrl("effective/route/doBatchSetTmsEffective");
            }

            getExtJsonData(url, params, function (res) {
                if (!res.success) {
                    var msg = isNotNull(res.statusText) ? res.statusText : "获取数据失败";
                    iAlert(msg, "danger");
                    return;
                }
                $("#cityTempModal").modal("hide");
                settingsList.getData(currentPageNum,pageSize);
                //分页
            });

        })
    },

}

