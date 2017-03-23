var provinceId = "",
    privinceToCityMap = {},
    cityToPrivinceMap = {},
    setProvinceBtnObj = {},
    cityNameMap = {};

//获取省市所有关联关系
function getProvinceCityRelation() {
    var params = {},
        url = getUrl("common/area/list");
    getExtJsonData(url, params, function (res) {
        if (!res.success) {
            console.log("获取省市关系失败");
            return;
        }

        privinceToCityMap = res.data.privinceIdMap;
        cityToPrivinceMap = res.data.cityIdMap;
        cityNameMap = res.data.cityNameMap;
    });
}

//地区设置
function setProvince() {
    $("body").on("click", ".setProvince", function () {
        setProvinceBtnObj = this;
        var params = {},
            url = getUrl("common/provinces/list");
        getExtJsonData(url, params, function (res) {
            if (!ajaxResponse(res)) {
                return
            }

            var list = res.data;
            applyJqueryTmpl($("#provinceTmpl"), $('#provinceDialog .province'), list);
            $("#provinceDialog").modal("show");

            //事件绑定
            $(".getCityICoin").on("click", function () {
                var provinceCaretObj = $(this);
                provinceId = provinceCaretObj.parent().find("input").val();
                showCity(provinceCaretObj);
            });

            $(".area input").click(function () {
                var $that = $(this);
                $that.parent().next().html(""); // 清空显示数字
                var provinceId = $that.val();
                if ($that.is(":checked")) {
                    //全选获取市区Id
                    var params = {provinceId: provinceId},
                        url = getUrl("common/city/list");
                    getExtJsonData(url, params, function (res) {
                        if (!ajaxResponse(res)) {
                            return;
                        }
                        var selectCityId = [],
                            selectCityName = [],
                            List = res.data,
                            length = List.length;
                        for (var i = 0; i < length; i++) {
                            selectCityId.push(List[i]["areaId"]);
                            selectCityName.push(List[i]["areaName"]);
                        }

                        $that.parent().find("input[name='cityId']").val(selectCityId.join(","));
                        $that.parent().find("input[name='cityName']").val(selectCityName.join(","));
                    });
                } else {
                    $that.parent().find("input[name='cityId']").val("");
                    $that.parent().find("input[name='cityName']").val("");
                }
            });

            //初始化
            initProvinceSelected(setProvinceBtnObj);
        })
    });
}

//省 弹窗初始化
function setCityIdToMap(obj) {
    var selectCityIdStr = $(obj).parent().find("input[name='cityId']").val() + ",",         //添加“，”，目的是为后边字符串查找。
        selectCityIdList = $(obj).parent().find("input[name='cityId']").val().split(","),
        selectProvinceList = [],
        length = selectCityIdList.length,
        tempData = "";
    for (var i = 0; i < length; i++) {
        tempData = selectCityIdList[i];
        var tempProvinceId = cityToPrivinceMap[tempData];
        if (isNotNull(tempProvinceId)) {
            selectProvinceList.push(tempProvinceId);
        }
    }

    // 选中的省的id
    selectProvinceList = selectProvinceList.unique();
    var len = selectProvinceList.length,
        currentProvinceId = "",
        cityList = [];
    /**
     * 构造选中市的数据结构
     *
     *  var  relationList =
     *       {
         *           currentProvinceId : {
         *                "selectCityList" : selectCityList,
         *                "isSelectAll" : ture or false,
         *                "selectNum" : selectNum
         *           }
         *       }
     *
     */
    var relationMap = {};
    for (var i = 0; i < len; i++) {
        var tempMap = {};
        currentProvinceId = selectProvinceList[i];
        cityList = privinceToCityMap[currentProvinceId];
        var len_1 = cityList.length,
            number = 0,
            isSelectAll = 0,
            currentSelectCityIdList = [];
        for (var k = 0; k < len_1; k++) {
            if (selectCityIdStr.indexOf(cityList[k] + ",") > -1) {
                currentSelectCityIdList.push(cityList[k]);
                number++;
            }
        }

        //是否全选
        if (number == len_1) {
            isSelectAll = 1;
        }

        tempMap["isSelectAll"] = isSelectAll;
        //选中个数
        tempMap["selectNum"] = number;
        //选中的市的id
        tempMap["selectCityList"] = currentSelectCityIdList;
        //当前市
        relationMap[currentProvinceId] = tempMap;
    }

    return relationMap;
}

function initProvinceSelected(obj) {
    var relationMap = setCityIdToMap(obj);

    for (var key in relationMap) {
        var currentProvinceId = key,
            currentDataMap = relationMap[key];

        //设置省被选中
        var $provinceDialogCheckbox = $("#provinceDialog .province .area").find("input:checkbox[value='" + currentProvinceId + "']");

        if (currentDataMap["isSelectAll"]) {
            $provinceDialogCheckbox.attr("checked", true);
            $provinceDialogCheckbox.parent().parent().find("font").html();
        } else {
            $provinceDialogCheckbox.attr("checked", false);
            $provinceDialogCheckbox.parent().parent().find("font").html("(" + currentDataMap["selectNum"] + ")");
        }

        //保存当前市的id
        $provinceDialogCheckbox.parent().find("input[name='cityId']").val(currentDataMap["selectCityList"].join(","))

        //保存当前市的name
        var selectCityName = [],
            selectCityList = currentDataMap["selectCityList"];
        for (var j = 0; j < selectCityList.length; j++) {
            selectCityName.push(cityNameMap[selectCityList[j]]);
        }
        $provinceDialogCheckbox.parent().find("input[name='cityName']").val(selectCityName.join(","));

    }
}

//省 确定btn
function submitProvince() {
    $("#submitProvince").on("click", function () {
        var selectCityIdList = [],
            selectAreaNameList = [];

        //获取已经勾选的cityId
        $(".area input[name='cityId']").each(function () {
            var $this = $(this),
                tempCityId = $this.val();
            if (isNotNull(tempCityId)) {
                selectCityIdList = selectCityIdList.concat(tempCityId.split(","));

                //省勾选只显示省的名称 , 否则保存市的名字
                var $provinceCheckbox = $this.parent().find("input:checkbox");
                if ($provinceCheckbox.is(":checked")) {
                    var provinceName = $provinceCheckbox.next().html();
                    selectAreaNameList.push(provinceName);
                } else {
                    selectAreaNameList = selectAreaNameList.concat($this.parent().find("input[name='cityName']").val().split(","));
                }
            }
        });

        //当前物流工具已经选择的省市
        var $currentTbody = $(setProvinceBtnObj).parent().parent().parent(),           //当前操作table
            currentIndex = $(setProvinceBtnObj).parent().parent().index(),              //当前操作行
            currentSelectedCityId = [],
            message = "";

        $currentTbody.find("tr").each(function (index) {
            //当前行不处理
            var $this = $(this),
                cityId = "";

            if (index != currentIndex) {
                var $cityIdInput = $this.find("input[name='cityId']");
                //排除地区的默认设置
                if (isNotNull($cityIdInput)) {
                    cityId = $cityIdInput.val();
                    //排除地区未设置的
                    if (isNotNull(cityId)) {
                        currentSelectedCityId = currentSelectedCityId.concat(cityId.split(","));
                    }
                }
            }
        });


        //判断是否存在重复的cityId
        var currentSelectedCityMap = {},
            tempData = "",
            sameCityNameList = [];         //相同的CityName (业务暂时不需要处理)

        //已选cityId 构造成map
        for (var i = 0; i < currentSelectedCityId.length; i++) {
            tempData = currentSelectedCityId[i];
            currentSelectedCityMap[tempData] = "";
        }

        for (var k = 0; k < selectCityIdList.length; k++) {
            tempData = selectCityIdList[k];
            if (undefined != currentSelectedCityMap[tempData]) {
                sameCityNameList.push(cityNameMap[tempData]);
            }
        }

        //不存在重复
        if (sameCityNameList.length == 0) {
            $(setProvinceBtnObj).parent().find("input[name='cityId']").val(selectCityIdList.join(","));
            $(setProvinceBtnObj).parent().find("input[name='areaName']").val(selectAreaNameList.join(","));
            $(setProvinceBtnObj).parent().find(".areaNameText").html(selectAreaNameList.join(","));
            $("#provinceDialog").modal("hide");
        } else {  //存在重复
            message = "同一物流工具下设置重复地区";
            iAlert(message, "danger", "", "", 180)
        }


    })
}

//显示市 obj -- 省的下拉图标
function showCity(provinceCaretObj) {
    var params = {provinceId: provinceId},
        url = getUrl("common/city/list");
    getExtJsonData(url, params, function (res) {
        if (!ajaxResponse(res)) {
            return;
        }

        var List = res.data;
        applyJqueryTmpl($("#cityTmpl"), $('#cityDialog .city'), List);
        $("#cityDialog").modal("show");
        $("#submitCity").attr("data-provinceId", provinceId);

        //复选框初始化
        initCitySelected("#cityDialog .city", provinceCaretObj);
    });
}

//复选框初始化选中状态
function initCitySelected(tpl, obj) {
    //地市 obj -- 省的下拉图标
    var $provinceCheckBox = $(obj).parent().find("input"),
        flag = $provinceCheckBox.is(":checked");

    //如果省勾选 下面市全部勾选
    if (flag) {
        var b = $(tpl).find("input");
        b.attr("checked", "checked");
    } else {
        //当前选中的市的id
        var selectCityIdList = $(obj).parent().find("input[name='cityId']").val().split(","),
            length = selectCityIdList.length;
        for (var i = 0; i < length; i++) {
            var selectId = selectCityIdList[i];
            $("#cityDialog .city input").each(function () {
                var checkboxId = $(this).val();
                if (selectId == checkboxId) {
                    $(this).prop("checked", true);
                }
            })
        }
    }
}

//市 确定btn
function submitCity() {
    $("#submitCity").on("click", function () {
        var checked = $(".city :checked").length,
            all = $(".city :checkbox").length,
            $provinceIdObj = $("#provinceDialog .province").find("input[value='" + provinceId + "']"),
            $cityId = $provinceIdObj.parent().find("input[name='cityId']"),
            $cityName = $provinceIdObj.parent().find("input[name='cityName']"),
            cityIdArray = [],
            cityNameArray = [];
        if (all == checked) {
            $provinceIdObj.attr("checked", true);
            $provinceIdObj.parent().parent().find("font").html('');
        } else {
            $provinceIdObj.removeAttr("checked");
            if (checked > 0) {
                $provinceIdObj.parent().parent().find("font").html("(" + checked + ")");
            }
        }

        $("#cityDialog .city input:checked").each(function () {
            cityIdArray.push($(this).val());
            cityNameArray.push($(this).next().html());
        });
        $cityId.val(cityIdArray.join(","));
        $cityName.val(cityNameArray.join(","));
    });
}

//数据下发时，city id转换成对应的数据格式

function cityIdToCityMap(obj) {
    var tempMap = {},
        resultList = [],
        selectCityList = [],
        isSelectAll = 0,
        length = 0,
        value = {},
        cityId = "",
        cityName = "",
        relationMap = setCityIdToMap(obj);

    for (var key in relationMap) {
        value = relationMap[key];
        selectCityList = value["selectCityList"];
        isSelectAll = value["isSelectAll"];
        length = selectCityList.length;
        for (var i = 0; i < length; i++) {
            tempMap = {};
            cityId = selectCityList[i];
            cityName = cityNameMap[selectCityList[i]];
            tempMap["areaId"] = cityId;
            tempMap["areaName"] = cityName;
            tempMap["areaIsProvince"] = isSelectAll;
            resultList.push(tempMap);
        }
    }

    return resultList;

}
/** 省市区的设置 （end） **/

/**校验 **/
//省市设置不能为空
function validateCityNotNull() {
    var result = true;
    $("td.ruleData").not(":hidden").find("input[name='cityId']").each(function () {
        var $this = $(this);
        if (isNull($this.val())) {
            iAlert("地区设置不能为空！", "danger")
            result = false;
            return false;
        }
    })
    return result;
}
