/**
 * Created by user on 2017/3/13.
 */
/**
 * Created by user on 2017/3/13.
 */
var pageNum = 1,
    pageSize = 10,
    currentPageNum=1;
$(document).ready(function () {
    pageList.init();

});

var pageList = {
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

    },
    //获取表格数据
    getData: function (pageNum, pageSize) {
        var params=  $("#pageList").serializeObject()
        params["page.number"]=pageNum;
        params["page.size"]=pageSize;
        var url = getUrl("effective/procedure/company/pageList");
        getExtJsonData(url, params, function (res) {
            if (!res.success) {
                var msg = isNotNull(res.statusText) ? res.statusText : "查询失败";
                iAlert(msg, "danger");
                $(".pagebigbox").hide();
                $('.tbody').html("");
                return;
            }
            if (isNull(res.data)) {
                $('.tbody').html("");
                $(".pagebigbox").hide();
                iAlert("未查询到数据");
                return;
            }
            var pagenum = res.pageNo;
            var pagecount = res.totalPages;
            //页面表格模板生成
            applyJqueryTmpl($("#listTable"), $('#toolsManaegTable'), res.data);
            $("#J_totalNum").html(res.totalCounts);
            $(".pagebigbox").show();
            pageList.laypage(pagecount, pagenum);    //分页
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
                    pageList.getData( obj.curr, pageSize);
                }
            }
        });
    },
    //查找所有模板effective/route/findAll
    getAllTemp: function () {
        var params={};
        var url=getUrl("effective/procedure/findAll");
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
    //查询数据
    searchData: function () {
        $("#searchBtn").click(function () {
            pageList.getData( pageNum, pageSize);
        })
    },
    //选择pageSize
    pageSize_chanage: function () {
        $("#J_pageSize").val(pageSize);
        $("#J_pageSize").change(function () {
            pageSize = $("#J_pageSize").val();
            pageList.getData( pageNum, pageSize);
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
        var code="",
            codeArr=[],
            codeStr="",
            type="";
        //多选
        $("body").on("click", ".lineHourSet", function () {
            codeArr=[],
                type="";
            var selectNum = $(".tbody  input[type='checkbox']:checked").length;
            if(selectNum>0){
                $("#progressTempModal").modal("show");
            }else{
                iAlert("请先勾选", "danger", 1000);
                codeArr=[];
            }
            $(".tbody  input[type='checkbox']:checked").each(function () {
                codeArr.push($(this).attr("code"));
            })
            codeStr=codeArr.join(",");
        })
        //单个选择
        $("body").on("click", ".singlehourSet", function () {
               code = $(this).attr("data-code"),
                   type=$(this).attr("data-type");
            $("#progressTempModal").modal("show");
        })
        $(".confirmpagebtn").click(function () {
            //单个提交
          if(type==1){
              code=code;
          }else{
              code=codeStr;
          }
            var params={
                    "procedureTemplateId":$("#lineTable").val(),
                    "logisticsCompanyCodes":code
                };
                url=getUrl("effective/procedure/company/setting");


            getExtJsonData(url, params, function (res) {
                if (!res.success) {
                    var msg = isNotNull(res.statusText) ? res.statusText : "获取数据失败";
                    iAlert(msg, "danger");
                    return;
                }
                $("#progressTempModal").modal("hide");
                pageList.getData(currentPageNum,10);
                //分页
            });
        })


    },


}


