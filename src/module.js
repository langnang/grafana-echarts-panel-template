import { Controller } from "./controller";
import { loadPluginCss } from "app/plugins/sdk";

loadPluginCss({
  dark: "plugins/echarts-panel-template/css/grouped.dark.css",
  light: "plugins/echarts-panel-template/css/grouped.light.css",
});

export { Controller as PanelCtrl };
