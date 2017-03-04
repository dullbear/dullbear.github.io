'use strict';

var h24Arr = [20, 25, 19, 27, 31, 38, 40, -11, 20, 25, 19, 27, 31, 38, 40, -11, 20, 25, 19, 27, 31, 38, 40, -11],
    h15ArrTop = [20, 25, 19, 27, 31, 38, 40, 11, 20, 25, 19, 27, 31, 38, 40],
    h15ArrBottom = [10, 15, 9, 17, 21, 28, 30, -21, 10, 15, 9, 17, 21, 28, 30];

// 基于准备好的dom，初始化echarts实例

var table_01 = echarts.init(document.getElementById('table_01'));

var option = {
    title: {
        text: '堆叠区域图',
        show: false
    },
    textStyle: {
        color: "#fff"
    },
    tooltip: {
        trigger: 'item',
        show: false
    },
    legend: {
        data: ['当天气温'],
        show: false
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        },
        show: false
    },
    grid: {
        left: '2%',
        right: '2.5%',
        top: '30%',
        containLabel: false,
        show: true,
        borderColor: "transparent",
        borderWidth: 8
    },
    xAxis: [{
        type: 'category',
        axisLine: false,
        axisTick: false,
        boundaryGap: false,
        data: ['24:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        containLabel: false,
        nameLocation: 'start',
        axisLabel: {
            show: false
        }
    }],
    yAxis: [{
        type: 'value',
        axisLine: false,
        axisTick: false,
        axisLabel: {
            show: false
        },
        splitLine: { show: false }
    }],
    series: [{
        name: '搜索引擎',
        type: 'line',
        stack: '总量',
        symbol: "circle",
        symbolSize: 8,
        legendHoverLink: false,
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        smooth: true,
        itemStyle: {
            normal: {
                color: "#fec835",
                borderColor: "#fec835"
            },
            emphasis: {
                color: "#fec835",
                borderColor: "#fec835"
            }
        },
        lineStyle: {
            normal: {
                color: "#fff"
            }
        },
        markPoint: {
            symbolSize: 60,
            symbolRotate: 50,
            silent: false
        },

        data: h24Arr
    }]
};

// 使用刚指定的配置项和数据显示图表。
table_01.setOption(option);

// 基于准备好的dom，初始化echarts实例
var table_02 = echarts.init(document.getElementById('table_02'));

var option = {
    title: {
        text: '堆叠区域图',
        show: false
    },
    textStyle: {
        color: "#fff"
    },
    tooltip: {
        trigger: 'item',
        show: false
    },
    legend: {
        data: ['上午气温'],
        show: false
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        },
        show: false
    },
    grid: {
        left: '3%',
        right: '3.5%',
        top: '5%',
        height: 180,
        containLabel: false,
        show: true,
        borderColor: "transparent",
        borderWidth: 8
    },
    xAxis: [{
        type: 'category',
        axisLine: false,
        axisTick: false,
        boundaryGap: false,
        data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'],
        containLabel: false,
        nameLocation: 'start',
        axisLabel: {
            show: false
        }
    }],
    yAxis: [{
        type: 'value',
        axisLine: false,
        axisTick: false,
        axisLabel: {
            show: false
        },
        splitLine: { show: false }
    }],
    series: [{
        name: '搜索引擎',
        type: 'line',
        stack: '总量',
        symbol: "circle",
        symbolSize: 8,
        legendHoverLink: false,
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        smooth: true,
        itemStyle: {
            normal: {
                color: "#fec835",
                borderColor: "#fec835"
            },
            emphasis: {
                color: "#fec835",
                borderColor: "#fec835"
            }
        },
        lineStyle: {
            normal: {
                color: "#6cc2ff"
            }
        },
        markPoint: {
            symbolSize: 60,
            symbolRotate: 50,
            silent: false
        },

        data: h15ArrBottom
    }, {
        name: '上午气温',
        type: 'line',
        stack: '总量',
        symbol: "circle",
        symbolSize: 8,
        legendHoverLink: false,
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        smooth: true,
        itemStyle: {
            normal: {
                color: "#fec835",
                borderColor: "#fec835"
            },
            emphasis: {
                color: "#fec835",
                borderColor: "#fec835"
            }
        },
        lineStyle: {
            normal: {
                color: "#fff"
            }
        },
        markPoint: {
            symbolSize: 60,
            symbolRotate: 50,
            silent: false
        },

        data: h15ArrTop
    }]
};

// 使用刚指定的配置项和数据显示图表。
table_02.setOption(option);