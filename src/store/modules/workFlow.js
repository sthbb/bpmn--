import Vue from 'vue'
import { isArray } from '@/components/customBpmn/config/utils';

const workFlow = {
  namespaced: true,
  state: {
    eventTypes: ['shape.added', 'element.click', 'shape.removed', 'connection.added', 'connection.changed', 'connection.removed', 'connect.end', 'element.changed'],
    // 设置型号
    deviceTypes: ['ESEC2100', 'DGP8762', 'KNS_JJIJJ', 'ADBJOJO'],
    scriptTypes: ['WEHIN23', 'ERER3454', 'SDFSD56', 'DFDFDGXVC67556'],
    versionDemos: ['demo1', 'demo2', 'demo3', 'demo4'],
    deviceValue: '',
    canvasData: {},
    canvasXmlData:'',
    isVisible: false,
    currentNodedata: {},
    currentNode: null,
    defaultCanvasData:{
      '_exporter': "bpmn-js (https://demo.bpmn.io)",
      '_exporterVersion': "5.1.2",
      '_id': "sid-38422fae-e03e-43a3-bef4-bd33b32041b2",
      '_targetNamespace': "http://bpmn.io/bpmn",
      '_xmlns': "http://www.omg.org/spec/BPMN/20100524/MODEL",
      '_xmlns:bpmndi':"http://www.omg.org/spec/BPMN/20100524/DI",
      '_xmlns:dc': "http://www.omg.org/spec/DD/20100524/DC",
      '_xmlns:di': "http://www.omg.org/spec/DD/20100524/DI",
      '_xmlns:etl': "http://etl.org/bpmn",
      '_xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance"
    }
  },

  mutations: {
    //draw展示与隐藏
    changeVisible(state, visible) {
      state.isVisible = visible
    },
    // 操作node节点
    setNode(state, data) {
      state.currentNode = data;
      state.currentNodedata = data.businessObject;
    },
    // xml转json
    xml2Json(state, data) {
      const xmlDoc = data.definitions;   // 获取所有的节点信息
      let nodeList = []; // 所有节点指向集合
      let sequenceFlow = [];// 所有线的指向集合
      let textAnnotation = [] // 注释节点
      let association = [] // 注释节点指向
      let bPMNEdge = [] // 节点属性集合
      let bPMNShape = [] // 线上点的属性集合
      // console.log('xmlDoc.process', data);
      if (xmlDoc.process) {
        xmlDoc.process.start ? nodeList = [...nodeList, ...isArray(xmlDoc.process.start,'start')] : null;
        xmlDoc.process.task ? nodeList = [...nodeList, ...isArray(xmlDoc.process.task,'task')] : null;
        xmlDoc.process.exclusiveGateway ? nodeList = [...nodeList, ...isArray(xmlDoc.process.exclusiveGateway,'exclusiveGateway')] : null;
        xmlDoc.process.end ? nodeList = [...nodeList, ...isArray(xmlDoc.process.end,'end')] : null;
        xmlDoc.process.sequenceFlow ? sequenceFlow = [...sequenceFlow, ...isArray(xmlDoc.process.sequenceFlow)] : null;
        xmlDoc.process.textAnnotation ? textAnnotation = [...textAnnotation, ...isArray(xmlDoc.process.textAnnotation)] : null;
        xmlDoc.process.association ? association = [...association, ...isArray(xmlDoc.process.association)] : null;
      }
      //获取下一个节点  上一个节点的 id outgoing 和  incoming 指向的是线的id
      nodeList = nodeList.map((node) => {
        let nextNodes = [],
          parentNodes = [],
          nextNodeId = [],
          parentNodeId = [];
        node.outgoing ? nextNodes = isArray(node.outgoing) : null;
        node.incoming ? parentNodes = isArray(node.incoming) : null;
        sequenceFlow.forEach((flow) => {
          nextNodes.forEach((nextNode) => {
            if (nextNode === flow._id) {
              nextNodeId.push(flow._targetRef)
            }
          })
          parentNodes.forEach(parentNode => {
            if (parentNode === flow._id) {
              nextNodeId.push(flow._sourceRef)
            }
          })
        })
        return { ...node, nextNodeId, parentNodeId }
      });
      if (xmlDoc.BPMNDiagram && xmlDoc.BPMNDiagram.BPMNPlane) {
        xmlDoc.BPMNDiagram.BPMNPlane.BPMNShape ? bPMNShape = [...bPMNShape, ...isArray(xmlDoc.BPMNDiagram.BPMNPlane.BPMNShape)] : null;
        xmlDoc.BPMNDiagram.BPMNPlane.BPMNEdge ? bPMNEdge = [...bPMNEdge, ...isArray(xmlDoc.BPMNDiagram.BPMNPlane.BPMNEdge)] : null;
      }
      state.canvasData.nodeList = nodeList;
      state.canvasData.lineList = {
        sequenceFlow,
        textAnnotation,
        association,
        bPMNShape,
        bPMNEdge
      };
    },
    // json转xml
    json2Xml(state, data) {
      let combineXml = {};
      const process = {
        _id: "Process_1",
        _isExecutable: 'false',
        textAnnotation: [],
        task: [],
        start: [],
        sequenceFlow: [],
        exclusiveGateway: [],
        association: [],
        end: []
      };
      const bPMNDiagram = {
        _id: "BpmnDiagram_1",
        __prefix: "bpmndi",
        BPMNPlane: {
          __prefix: "bpmndi",
          _bpmnElement: "Process_1",
          _id: "BpmnPlane_1",
          BPMNShape: [],
          BPMNEdge: []
        }
      };
      state.canvasData.nodeList && state.canvasData.nodeList.forEach((item) => {
        switch (item.type) {
          case 'start':
            process.start = process.start.length === 0 ? item : (!process.start.length ? [process.start,item]  : [...process.start,item]  )
            break
          case 'end':
            process.end = process.end.length === 0 ? item : (!process.end.length ? [process.end,item]  : [...process.end,item]  )
            break
          case 'exclusiveGateway':
            process.exclusiveGateway = process.exclusiveGateway.length === 0 ? item : (!process.exclusiveGateway.length ? [process.exclusiveGateway,item]  : [...process.exclusiveGateway,item]  )
            break
          case 'task':
            process.task = process.task.length === 0 ? item : (!process.task.length ? [process.task,item]  : [...process.task,item]  )
            break
          default:
            break
        }
      });
      process.sequenceFlow = state.canvasData.lineList && state.canvasData.lineList.sequenceFlow ? state.canvasData.lineList.sequenceFlow : [] ;
      process.textAnnotation = state.canvasData.lineList && state.canvasData.lineList.textAnnotation ? state.canvasData.lineList.textAnnotation :[];
      process.association = state.canvasData.lineList && state.canvasData.lineList.association ? state.canvasData.lineList.association : [];
      bPMNDiagram.BPMNPlane.BPMNShape = state.canvasData.lineList && state.canvasData.lineList.bPMNShape ? state.canvasData.lineList.bPMNShape : []
      bPMNDiagram.BPMNPlane.BPMNEdge = state.canvasData.lineList && state.canvasData.lineList.bPMNEdge ? state.canvasData.lineList.bPMNEdge : []
      combineXml = {
        definitions: {
          BPMNDiagram:bPMNDiagram,
          process,
          ...state.defaultCanvasData
        }
      };
      const transferData = this._vm.$x2js.js2xml(combineXml);
      state.canvasXmlData = `<?xml version="1.0" encoding="UTF-8"?>${transferData}`;
      console.log(state.canvasXmlData);
    },
  },
  actions: {
  },
}

export default workFlow
