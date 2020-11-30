import { MetricsPanelCtrl } from "app/plugins/sdk";
import _ from "lodash";
import kbn from "app/core/utils/kbn";
import echarts from "./libs/echarts.min";
import * as echarts_demos from "./demos";
import "./libs/dark";
import "./style.css!";

export class Controller extends MetricsPanelCtrl {
  // 构造方法，在对象被创建时或实例化时调用
  constructor($scope, $injector) {
    // 继承父类对象：在class方法中，继承是用extends关键字来实现的。
    // 字类必须在constructor方法中调用super方法，否则新建实例时会报错。
    // 报错的原因时：子类是没有自己的this对象的，它只能继承父类的this对象，然后对其进行加工。
    // 而super方法就是将父类的this对象继承给字类。
    // 没有执行super方法，子类就得不到this对象。
    super($scope, $injector);
    var demos = [];
    for (let key in echarts_demos) {
      demos.push(key);
    }
    var panelDefaults = {
      IS_UCD: false,
      url: "",
      method: "POST",
      upInterval: 60000,
      format: "Year",
      demo: "Line",
      demos: demos,
      option: {},
    };
    // Lodash，分配来源对象的可枚举属性到目标对象所有解析为undefined的属性上
    // 遍历panelDefaults给对象this.panel添加字段，并保持原来字段的值
    _.defaults(this.panel, panelDefaults);
    // DataSource 查询成功后触发
    this.events.on("data-received", this.onDataReceived.bind(this));
    // DataSource 查询失败后触发
    this.events.on("data-error", this.onDataError.bind(this));
    // 数据快照加载，在Dashboard加载时触发
    this.events.on("data-snapshot-load", this.onDataReceived.bind(this));
    // 初始化编辑模式，控制台布局
    this.events.on("init-edit-mode", this.onInitEditMode.bind(this));
    // Panel布局改变时触发，如移动、缩放
    this.events.on("panel-initialized", this.render.bind(this));
    // 请求数据
    this.refreshData();
  }

  onDataReceived(dataList) {
    // console.log(dataList);
    // console.log(this.panel);
    if (
      dataList.length > 0 &&
      (this.panel.demo == "Line" || this.panel.demo == "Bar")
    ) {
      this.panel.option = {
        xAxis: {
          //   type: "time",
          data: dataList[0].datapoints.slice(0, 100).map((v) => v[1]),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: dataList[0].datapoints.slice(0, 100).map((v) => v[0]),
            type: this.panel.demo.toLowerCase(),
          },
        ],
      };
      //   console.log(this.panel.option);
    } else {
      this.panel.option = {};
    }
    this.refreshed = true;
    this.render();
    this.refreshed = false;
  }

  onDataError(err) {
    this.series = [];
    this.render();
  }

  onInitEditMode() {
    this.addEditorTab(
      "Option",
      "public/plugins/echarts-panel-template/partials/options.html",
      2
    );
  }
  // 使用AJAX异步请求数据，当成功后调用this.onDataReceived()。
  // 自执行设置
  refreshData() {
    let _this = this,
      xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    let data = [];
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        _this.customizeData = JSON.parse(xmlhttp.responseText);
        _this.onDataReceived();
      }
    };
    if (this.panel.IS_UCD) {
      xmlhttp.open(_this.panel.method, _this.panel.url, true);
      xmlhttp.send();
    } else {
      xmlhttp = null;
    }
    this.$timeout(() => {
      this.refreshData();
    }, _this.panel.upInterval);
  }
  // 当Controller被Angular编译后执行
  link(scope, elem, attrs, ctrl) {
    const $panelContainer = elem.find(".echarts_container")[0];
    ctrl.refreshed = true;
    function setHeight() {
      let height = ctrl.height || ctrl.panel.height;
      if (_.isString(height)) {
        height = parseInt(height.replace("px", ""), 10);
      }
      height += 0;
      $panelContainer.style.height = height + "px";
    }
    setHeight();
    // 创建Echarts实例
    let myChart = echarts.init($panelContainer, "dark");
    setTimeout(function () {
      myChart.resize();
    }, 1000);
    function render() {
      if (!myChart) {
        return;
      }
      setHeight();
      myChart.resize();
      // 避免因移动、缩放等操作而重复请求数据
      if (ctrl.refreshed) {
        myChart.clear();
        let option = {};
        if (ctrl.panel.option.series) {
          option = ctrl.panel.option;
        } else {
          option = echarts_demos[ctrl.panel.demo]();
        }
        // console.log(option);
        // console.log(JSON.stringify(option));
        // 配置Echarts实例
        myChart.setOption(option, true);
      }
    }
    this.events.on("render", function () {
      render();
      ctrl.renderingCompleted();
    });
  }
}

Controller.templateUrl = "partials/module.html";
