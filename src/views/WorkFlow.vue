<template>
  <div class="work-flow">
    <div class="work-flow-search">
      <div class="select-contain-box">
        <div class="select-contain">
          <div class="select-name">设备型号</div>
          <el-select v-model="deviceValue" placeholder="请选择设备型号">
            <el-option
              v-for="item in deviceTypes"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="select-contain">
          <div class="select-name">剧本名称</div>
          <el-select v-model="deviceValue" placeholder="请选择剧本名称">
            <el-option
              v-for="item in scriptTypes"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="select-contain">
          <div class="select-name">剧本版本</div>
          <el-select v-model="deviceValue" placeholder="请选择剧本版本">
            <el-option
              v-for="item in versionDemos"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <!-- <div class="select-contain">
          <el-button type="primary">查询</el-button>
          <el-button type="primary">保存</el-button>
          <el-button type="primary">调试</el-button>
          <el-button type="primary">发布</el-button>
        </div> -->
      </div>
      <div class="canvas-ope">
        <el-button type="primary" @click="handlerUndo">撤销</el-button>
        <el-button type="primary" @click="handlerRedo">恢复</el-button>
        <el-button type="primary" @click="handlerZoom(0.1)">放大</el-button>
        <el-button type="primary" @click="handlerZoom(-0.1)">缩小</el-button>
        <el-button type="primary" @click="handlerZoom(0)">还原</el-button>
      </div>
    </div>
    <div class="canvas" ref="canvas">
      <div ref="palette" />
    </div>
    <el-drawer
      title="我是测边框的title"
      :visible.sync="isVisible"
      :with-header="false"
      custom-class="draw-box"
      :before-close="handleClose"
    >
      <h2>重命名</h2>
      <el-input
        v-model="currentNodedata.name"
        placeholder="请输入内容"
        @change="changeNode"
      ></el-input>
    </el-drawer>
  </div>
</template>
<script>
// bpmn相关
import BpmnModeler from "bpmn-js/lib/Modeler";
import minimapModule from "diagram-js-minimap";
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
} from "tiny-svg";
import { query as domQuery } from "min-dom";
import customPalette from "@/components/customBpmn/palette/index";
import customContextPad from "@/components/customBpmn/contextPad/index";
import customRenderer from "@/components/customBpmn/renderer/index";
import entries from "@/components/customBpmn/config/paletteEntries";
import etlExtension from "@/components/customBpmn/config/etl.json";
// import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event' canvas大小自适应屏幕
import { fitViewport } from "@/components/customBpmn/config/utils.js";
import { mapState, mapMutations } from "vuex";
import { xmlStr } from "@/mocks/xml";
export default {
  data() {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      scale: 1, //默认缩放比例,
      eventBus: null,
      elementRegistry: null,
      modeling: null,
    };
  },
  mounted() {
    // addResizeListener(this.$refs.canvas, this.resizeListener)
    this.init();
  },
  methods: {
    ...mapMutations({
      close: "workFlow/changeVisible",
      xml2jsonTransfer:'workFlow/xml2Json',
      json2xmlTransfer:'workFlow/json2Xml'
    }),
    async init() {
      //  palette自定义容器
      // 去除默认工具栏
      const modules = BpmnModeler.prototype._modules;
      const index = modules.findIndex((it) => it.paletteProvider);
      modules.splice(index, 1);
      const canvas = this.$refs.canvas;
      const palette = this.$refs.palette;
      // 建模
      this.bpmnModeler = new BpmnModeler({
        // 主要容器
        container: canvas,
        // 工具栏容器
        paletteContainer: palette,
        // 工具栏配置及实现自定义渲染方法
        paletteEntries: entries,
        // 开启键盘快捷
        keyboard: {
          bindTo: document,
        },
        // 添加自定义元模型
        moddleExtensions: {
          etl: etlExtension,
        },
        // 扩展
        additionalModules: [
          //小地图
          minimapModule,
          // 自定义工具栏
          customPalette,
          // 自定义渲染
          customRenderer,
          // 自定义内容面板
          customContextPad,
          {
            zoomScroll: ["value", ""], // 禁用滚轮滚动
            // bendpoints: ['value', ''],// 禁止拖动线
            // contextPadProvider: ['value', ''],禁止点击节点出现contextPad
            // labelEditingProvider: ['value', '']// 禁止双击节点出现label编辑框
          },
        ],
      });
      await this.createNewDiagram();
      // 初始化箭头
      this.initArrow("sequenceflow-arrow-normal");
      this.initArrow("sequenceflow-arrow-active");
      // 默认打开小地图
      this.bpmnModeler.get("minimap").open();
      // 初始化参数
      this.eventBus = this.bpmnModeler.get("eventBus");
      this.elementRegistry = this.bpmnModeler.get("elementRegistry");
      this.modeling = this.bpmnModeler.get("modeling");
    },
    createNewDiagram() {
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(xmlStr, (err) => {
        !err && this.success(); // 这里是成功之后的回调, 可以在这里做一系列事情
      });
    },
    // bpmn创建成功
    success() {
      this.addEventBusListener();
    },
    // 监听 element
    addEventBusListener() {
      this.eventTypes.forEach((eventType) => {
        switch (eventType) {
          case "shape.added":
            this.eventBus.on(eventType, this.onShapeAdded);
            break;
          case "shape.removed":
            this.eventBus.on(eventType, this.onShapeRemoved);
            break;
          case "element.click":
            this.eventBus.on(eventType, this.onElementClick);
            break;
          case "connection.added":
            this.eventBus.on(eventType, this.onConnectionAdded);
            break;
          case "connection.changed":
            this.eventBus.on(eventType, this.onConnectionChanged);
            break;
          case "connection.end":
            this.eventBus.on(eventType, this.onConnectionEnd);
            break;
          case "connection.removed":
            this.eventBus.on(eventType, this.onConnectionRemoved);
            break;
          case "element.changed":
            this.eventBus.on(eventType, this.onElementChanged);
            break;
          default:
            break;
        }
      });
    },
    //形状绘制完成
    onShapeAdded(event, element) {
      // ...
    },
    //形状移除
    onShapeRemoved() {
      // ...
    },
    // 点击事件
    onElementClick() {
      // ...
    },
    // 线绘制完成
    onConnectionAdded() {
      // ...
    },
    // 线改变
    onConnectionChanged() {
      // ...·
    },
    //线连接成功结束
    onConnectionEnd() {
      // ...
    },
    //线移除
    onConnectionRemoved() {
      // ...
    },
    //元素改变
    async onElementChanged() {
      const result = await this.bpmnModeler.saveXML({ format: true });
      const { xml } = result;
      // console.log('元素改变',xml);
      //将xml转化成json
      await this.xml2jsonTransfer(this.$x2js.xml2js(xml))
      //将json转化成xml
      // this.json2xmlTransfer(this.canvasData)
    },
    // 恢复
    handlerRedo() {
      this.bpmnModeler.get("commandStack").redo();
    },
    // 撤销
    handlerUndo() {
      this.bpmnModeler.get("commandStack").undo();
    },
    //放大 缩小 还原
    handlerZoom(radio) {
      const newScale = !radio ? 1.0 : this.scale + radio;
      this.bpmnModeler.get("canvas").zoom(newScale);
      this.scale = newScale;
    },
    //画布自适应屏幕
    resizeListener() {
      const canvas = this.bpmnModeler.get("canvas");
      fitViewport.call(canvas, true);
    },
    // 初始化自定义箭头 改变箭头和线的颜色
    initArrow(id) {
      const marker = svgCreate("marker");
      svgAttr(marker, {
        id,
        viewBox: "0 0 20 20",
        refX: "11",
        refY: "10",
        markerWidth: "10",
        markerHeight: "10",
        orient: "auto",
      });
      const path = svgCreate("path");
      svgAttr(path, {
        d: "M 1 5 L 11 10 L 1 15 Z",
        style:
          " stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; ",
      });
      const defs = domQuery("defs");
      svgAppend(marker, path);
      svgAppend(defs, marker);
    },
    //关闭模态框
    handleClose() {
      this.close(false);
    },
    // 节点元素更新
    changeNode(data) {
      this.modeling.updateProperties(this.currentNode, {
        name: data,
      });
    }
  },
  computed: {
    ...mapState("workFlow", [
      "eventTypes",
      "deviceTypes",
      "scriptTypes",
      "versionDemos",
      "canvasData",
      "deviceValue",
      "isVisible",
      "currentNode",
      'currentNodedata'
    ]),
  },
  beforeDestroy() {
    // removeResizeListener(this.$refs.canvas, this.resizeListener)
  },
};
</script>
<style scoped lang="scss">
.work-flow {
  background: #f5f5f5;
  padding: 20px;
  .work-flow-search {
    display: flex;
    margin-bottom: 20px;
    background: #fff;
    padding: 20px;
    justify-content: space-between;
    align-items: center;
    .select-contain-box {
      display: flex;
      .select-contain {
        display: flex;
        margin-right: 20px;
        align-items: center;
        .select-name {
          margin-right: 10px;
        }
      }
    }
  }
  .canvas {
    width: 100%;
    height: calc(100vh - 160px);
    background: #fff;
    position: relative;
  }
  .draw-box {
    h2 {
      text-align: left;
      margin-bottom: 20px;
    }
  }
}
</style>
