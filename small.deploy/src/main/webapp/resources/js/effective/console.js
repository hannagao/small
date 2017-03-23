function drawCircle(text,domid,datax,datay1,datay2){
    var myChart = echarts.init(document.getElementById(domid));
    option = {
        title : {
            text: text,
            x:'center',
            textStyle: {
                color: "#666",
                fontSize: 15,
                fontweight:10
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color:['#74cff8', '#28b5f5','#0288d1','#0966af'],
        series : [
            {
                name:text,
                type: 'pie',
                radius : '45%',
                center: ['45%', '60%'],
                data:[
                    {value:335, name:'24小时'},
                    {value:310, name:'48小时'},
                    {value:234, name:'72小时'},
                    {value:135, name:'72小时以上'},
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}
drawCircle("配送时效数据","linechart")
drawCircle("快递时效数据","linechart2")
drawCircle("物流时效数据","linechart3")
drawCircle("同城配时效数据","linechart4")
//返回Object
var data={
    "id":1044,
    "createPerson":"233",
    "updatePerson":"444",
    "createTime":1489125613000,
    "updateTime":1489125613000,
    "shopCode":"QCCR0200002",
    "shopName":null,
    "orderNo":"BTWL7991016062",
    "requestType":1,
    "status":1,
    "statusDesc":null,
    "requestTime":1489125613000,
    "queryTakeTime":17,
    "chargingMoney":400
}

$("#loginsticData  span").each(function () {
    var $this = $(this);
    $this.html(data[$this.attr("name")]);
});

