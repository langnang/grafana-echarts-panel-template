# Panel Template by Echarts for Grafana

基于 Angular+Echarts 的 panel 开发

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

- src/module.js

```js
loadPluginCss({
  dark: "plugins/${panel.id}/css/grouped.dark.css",
  light: "plugins/${panel.id}/css/grouped.light.css",
});
```

- src/controller.js

```js
onInitEditMode() {
    this.addEditorTab('Option', 'public/plugins/${panel.id}/partials/options.html', 2);
}
```

> 控制代码修改于 src/controller.js
>
> package.json `"main": "src/module.js"` ->module.js `import {Controller} from './controller';`
>
> 页面样式修改于 src/partials/options.html
>
> controller.js `onInitEditMode() {this.addEditorTab('Option', 'public/plugins/empty-panel/partials/options.html', 2);}` ->options.html

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
