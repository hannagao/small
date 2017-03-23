/**
 * Created by user on 2016/12/27.
 */
var pageNum = 1,
    pageSize = 10,
    type="",
    status="",
    name="",
    logisticsName="",
    logisticsCode="",
    shopCode="";
var appintCompanyData=[];
var getappintCompanyData;
var appintNetworkData=[];
var getappintNetworkData;
var shopCode=[];
function obj2key(obj, keys){
    var n = keys.length,
        key = [];
    while(n--){
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
function uniqeByKeys(array,keys){
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr .push(array[i]);
        }
    }
    return arr;
}

var id=GetQueryString("id");

(function () {
    /*封装数据接口*/
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
        F_queryCompany:function (logisticsName,logisticsCode,type,pageNum,pageSize) { // search
            var query={};
            query={
                "logisticsName": logisticsName,
                "logisticsCode":logisticsCode,
                "type":type,
                "page":pageNum,
                "pageSize":pageSize
            }
            //获取承运商

            url = getUrl("logisticsTool/queryCompany");
            var companyarr=[];
            //获取承运商数据
            var companyData=[];
            //获取指定承运商数据
            $("#appointCompanyTable tr").each(function(){
                companyarr.push(
                    $(this).attr("code")
                );
            })

            getExtJsonData(url,query ,function (response) {
                //页面表格模板生成
                var pagenum =response.data.pageNo;
                var pagecount = Math.ceil(response.data.totalCount/10);
                //页面表格模板生成
                companyData=response.data.reusltData;
                applyJqueryTmpl($("#companyTableTemplate"), $('#companyTable'), response.data.reusltData);
                $("#companyTable input[type='checkbox']").each(function () {
                    var $that=$(this);
                    var code=$(this).attr("accept");
                    if(companyarr.indexOf(code)!=-1){
                        $(this).attr("checked",true);
                    }

                })
                $("#J_totalNum").html(response.data.totalCount);
                $(".pagebigbox").show();
                dataProvider.laypage(pagecount, pagenum);    //分页
            });

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
                    if (!first) {
                        dataProvider.F_queryCompany(logisticsName,logisticsCode,type,obj.curr, pageSize);
                    }
                }
            });
        },
        pageSize_chanage: function () {
            $("#J_pageSize").val(pageSize);
            $("#J_pageSize").change(function () {
                pageSize = $("#J_pageSize").val();
                dataProvider.F_queryCompany(logisticsName,logisticsCode,type,pageNum, pageSize);
            });
        },
    };
    var vm = new Vue({
        el: "#editToolsManage",
        data: {
            query: {
                type: '',
                status: '',
                name:'',
                shopCode:"",
                remark:""
            },
            isChecked:"",
            xxtrue:
                {
                    state:true
                }
            ,
            store: {
                editData:{
                    status:"",
                    typeDesc:"",
                    name:"",
                    type:1,
                    statusDesc:"",
                },
                shops:[],
            },
            carrierTable:{
                data: []
            },
            sinceTable:{
                data: []
            },
            shopCode:[],
            isEdit:false,
            typeChecked:0,
            dispatchChecked:0

        },
        created: function () {
            var query = {};
            var that = this;
           if(isNotNull(id)){//编辑

               that.$set("data.isEdit",true);
               that.$set("editName","编辑物流工具");
               //默认物流禁止编辑店铺和类型
               query.id=id;
               //获取物流所有信息
               dataProvider.F_search(query,function (response) {
                   that.$set("store.editData",response.data)
                   var shopList=response.data.shopLogisticsToolROList;
                   applyJqueryTmpl($("#shopTemplate"), $('#shop'),shopList);
                   shopList.map(function (item) {
                       shopCode.push(item.shopCode);
                   })
                   //渲染指定承运商或者自提点
                   getappintCompanyData=response.data.companyROList;
                   applyJqueryTmpl($("#appointCompanyTableTemplate"), $('#appointCompanyTable'),getappintCompanyData);
                   getappintNetworkData=response.data.networkROList;
                   applyJqueryTmpl($("#appointNetworkTableTemplate"), $('#appointNetworkTable'),getappintNetworkData);

               });
           }
            else{//新增
               //显示默认
               that.$set("store.editData.isDefault",0);
               that.$set("isChecked","checked");
               that.$set("editName","添加物流工具");
               that.$set("store.editData.type",1);   //配送
               dataProvider.F_shops(query,function (response) { // initial table data
                   //that.$set("store.shops", response.data);
                   var shopList=response.data;
                   applyJqueryTmpl($("#shopTemplate"), $('#shop'),shopList);
               });
               shopCode=that.$get("shopCode");
               that.$set("data.isEdit",false);
               getappintCompanyData = [];
               getappintNetworkData = [];
           }


            //logisticsToolId
            //删除承运商
            $("#appointCompanyTable").on("click", ".deleteCompany", function () {
                var that=$(this);
                var id= $(this).attr("data-id");
                var message ="<div class='confrimTip'>您确定要删除选中的承运商吗?</div>";
                layer.confirm(message,
                    {
                        title: '承运商',
                        offset: ['180px']
                    },
                    function (index) {
                        layer.close(index);
                        that.parent().parent()[0].remove();
                        getappintCompanyData=[];
                        $("#appointCompanyTable tr").each(function(){
                            getappintCompanyData.push({
                                id:$(this).attr("id"),
                                companyName:$(this).attr("name"),
                                logisticsCompanyCode:$(this).attr("code"),
                                typeDesc:$(this).attr("type")
                            });
                        })
                    }
                );
            });
            //删除自提点
            $("#appointNetworkTable").on("click", ".deleteCompany", function () {
                var that=$(this);
                var id= $(this).attr("data-id");
                var message ="<div class='confrimTip'>您确定要删除选中的承运商吗?</div>";
                layer.confirm(message,
                    {
                        title: '自提点',
                        offset: ['180px']
                    },
                    function (index) {
                        layer.close(index);
                        that.parent().parent()[0].remove();
                        getappintNetworkData=[];
                        $("#appointNetworkTable tr").each(function(){
                            getappintNetworkData.push({
                                selfNetworkId:$(this).attr("id"),
                                netWorkName:$(this).attr("name"),
                                address:$(this).attr("adress"),
                                warehouseName:$(this).attr("warehouseName")
                            });
                        })

                    }
                );
            });


        },
        methods: {
            //添加承运商
            addCompany: function () {
              dataProvider.F_queryCompany("","","",1,10);
            },
            //添加自提点
            addNetwork: function () {
                //获取自提点
                query={};
                url = getUrl("logisticsTool/queryNetWork");
                var networkarr=[];
                //获取自提点数据
                var networkData=[];
                //获取指定自提点数据
                $("#appointNetworkTable tr").each(function(){
                    networkarr.push(
                        $(this).attr("id")
                    );
                })
                getExtJsonData(url,query ,function (response) {
                    //页面表格模板生成
                    networkData= response.data;
                    applyJqueryTmpl($("#networkTableTemplate"), $('#networkTable'), response.data);
                    $("#networkTable input[type='checkbox']").each(function () {
                        var $that=$(this);
                        var id=$(this).attr("id");
                        if(networkarr.indexOf(id)!=-1){
                            $(this).attr("checked",true);
                        }

                    })
                });
            },
            //提交编辑
            confirmEditdata: function () {
                //提交承运商codeStr
                appintCompanyData=[];
                $("#appointCompanyTable tr").each(function(){
                    var item=$(this).attr("code");
                    appintCompanyData.push(item);
                })
                //提交自提点codeStr
                appintNetworkData=[];
                $("#appointNetworkTable tr").each(function(){
                    var item=$(this).attr("id");
                    appintNetworkData.push(item);
                })

                var that=this;
                var query = that.$get("store.editData");
                //店铺字段
                var items=shopCode.join();
                if(query.name==""){
                    iAlert("物流工具不能为空!", "danger");
                    return;
                }
                if(query.type==""){
                    iAlert("类型不能为空!", "danger");
                    return;

                }
                if(items==""){
                    iAlert("请选择使用店铺!", "danger");
                    return;

                }
                var logisticsToolDTO={
                    id:id,
                    name:query.name,
                    type:query.type,
                    isDefault:query.isDefault,
                    remark:query.remark
                };
                var editParams={
                    netWorkIdStr:appintNetworkData.join(","),
                    logisticsCompanyCodeStr:appintCompanyData.join(","),
                    shopCodeStr:items,
                    logisticsToolDTO:logisticsToolDTO
                }
                //cosole.log(query.type);
                if(query.type==1){
                    if(query.isDefault==0){
                        if(appintCompanyData.join(",")==""){
                            iAlert("最少需要添加一个承运商!", "danger");
                            return;
                        }
                        editParams.logisticsToolDTO.isDefault=0;
                        editParams.netWorkIdStr="";
                        dataProvider.F_addTools(JSON.stringify(editParams),function (res) { // initial table data
                            if(!ajaxResponse(res)){
                                return;
                            }
                            window.location.href="toolList.htm";

                        });
                    }else{
                        editParams.logisticsToolDTO.isDefault=1;
                        editParams.logisticsCompanyCodeStr="";
                        editParams.netWorkIdStr="";
                        dataProvider.F_addTools(JSON.stringify(editParams),function (res) { // initial table data
                            if(!ajaxResponse(res)){
                                return;
                            }
                            window.location.href="toolList.htm";
                        });
                    }
                }else{
                    /*
                     是netWorkIdStr
                     */
                    if(appintNetworkData.join(",")==""){
                        iAlert("最少需要添加一个自提点!", "danger");
                        return;
                    }
                    editParams.logisticsToolDTO.isDefault="";
                    editParams.logisticsCompanyCodeStr="";
                    dataProvider.F_addTools(JSON.stringify(editParams),function (res) { // initial table data
                        if(!ajaxResponse(res)){
                            return;
                        }
                        window.location.href="toolList.htm";
                    });
                }
            },
            //取消编辑承运商
            cancelEditdata: function () {
                window.location.href="toolList.htm";
            },
            //提交承运商数据
            confirmCompanydata: function () {
                var companyda=document.getElementsByName("company");
                var getappintCompanyData=[];
                for(k in companyda){
                    if(companyda[k].checked)
                        getappintCompanyData.push({
                            id:companyda[k].id,
                            companyName:companyda[k].title,
                            logisticsCompanyCode:companyda[k].accept,
                            typeDesc:companyda[k].align
                        });
                }
                $(".confirmbtn").attr("data-dismiss","modal");
                var companyData=uniqeByKeys(getappintCompanyData,["logisticsCompanyCode"]);
                applyJqueryTmpl($("#appointCompanyTableTemplate"), $('#appointCompanyTable'),companyData);
            },
            //提交自提点数据
            confirmNetworkdata:function () {
                var network=document.getElementsByName("network");
                getappintNetworkData=[];
                for(k in network){
                    if(network[k].checked)
                        getappintNetworkData.push({
                            selfNetworkId:network[k].id,
                            netWorkName:network[k].title,
                            address:network[k].accept,
                            warehouseName:network[k].accessKey
                        });
                }
                $(".confirmbtn").attr("data-dismiss","modal");
                var networkData=uniqeByKeys(getappintNetworkData,["selfNetworkId"]);
                applyJqueryTmpl($("#appointNetworkTableTemplate"), $('#appointNetworkTable'),networkData);
            },
            //搜索承运商
            searchCompany: function () {
                logisticsName=$("#logisticsName").val();
                logisticsCode=$("#logisticsCode").val();
                type=$("#type").val();
                dataProvider.F_queryCompany(logisticsName,logisticsCode,type,1,10);
            },
        }
    });

})();
