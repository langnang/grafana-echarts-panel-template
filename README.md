# Panel Template by Echarts for Grafana

Grafana 之基于 Echarts 的面板模板

## Development

### Rename

- README.md
- pankage.json

```json
{
  "name": "grafana-echarts-panel-template",
  "version": "2.0.0",
  "description": "a template panel by echarts for grafana"
}
```

- bower.json

```json
{
  "name": "grafana-echarts-panel-template",
  "description": "a template panel by echarts for grafana",
  "main": "src/main.js"
}
```

- src/plugin.json

```json
{
  "name": "Echarts Template",
  "id": "echarts-panel-template"
}
```

- src/module.js | 入口文件

```js
loadPluginCss({
  dark: "plugins/${panel.id}/css/grouped.dark.css",
  light: "plugins/${panel.id}/css/grouped.light.css",
});
```

- src/controller.js | 控制代码

```js
onInitEditMode() {
  // 页面样式路径
  this.addEditorTab('Option', 'public/plugins/${panel.id}/partials/options.html', 2);
}
```

### controller.js 代码运行机制

1. constructor()
2. this.event.on()分别监听不同事件
3. angular 的 ng-model,ng-change 绑定数据源以及修改事件
4. onDataReceived()以及 render()都可对数据进行处理

### 新增修改 panelDefaults 数据

- panelDefaults 数据中 `IS_UCD: false` `url: ''` , `method: 'POST'` , `upInterval: 60000` 不推荐修改
- 其余数据都可修改
- 不推荐另增数据至 this，第二个 `_.defaults()` 结果易导致数据无法显示。

### Eacharts

- echarts.js 主要对于 options 数据进行处理 `myChart.setOption(option)`
- 因此在此之前整理好 options 数据即可
