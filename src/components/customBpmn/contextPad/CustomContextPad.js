import { assign } from 'min-dash';
import { isAny } from '../config/utils.js';
import store from '@/store/index'

export default function ContextPadProvider(contextPad, config, injector, translate, bpmnFactory, elementFactory, create, modeling, connect) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.translate = translate;
  this.bpmnFactory = bpmnFactory;
  this.modeling = modeling;
  this.connect = connect;
  config = config || {};

  if (config.autoPlace !== false) {
    this._autoPlace = injector.get('autoPlace', false);
  }
  contextPad.registerProvider(this);
}

ContextPadProvider.$inject = [
  'contextPad',
  'config',
  'injector',
  'translate',
  'bpmnFactory',
  'elementFactory',
  'create',
  'modeling',
  'connect'
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
  const {
    autoPlace,
    create,
    elementFactory,
    modeling,
    translate,
    connect,
  } = this;

  const ContextPad = {};
  const { businessObject } = element;

  // 连线
  function connectStart(event) {
    connect.start(event, element); // 创建线条
    return true;
  }

  // 点击删除按钮
  const removeElements = (event, shape) => {
    modeling.removeElements([element]);
  };

  // 点击设置按钮
  const handleSetting = (event, shape) => {
    store.commit('workFlow/changeVisible',true)
    store.commit('workFlow/setNode', shape)
  };

  // 删除图标
  assign(ContextPad, {
    'global-delete-tool': {
      group: 'delete',
      className: 'icon-pad-delete el-icon-delete',
      title: translate('删除'),
      action: {
        click: removeElements
      }
    }
  });

  // 编辑设置图标
  if (element.type !== 'label' && isAny(businessObject, [
    'bpmn:StartEvent', 'bpmn:Task', 'bpmn:ExclusiveGateway',
  ])) {
    assign(ContextPad, {
      'global-setting-tool': {
        group: 'setting',
        className: 'icon-pad-setting el-icon-setting',
        title: translate('设置'),
        action: {
          click: handleSetting
        }
      },
      'global-connect-tool': {
        group: 'connect',
        className: 'icon-pad-connect el-icon-position',
        title: translate('链接线'),
        action: {
          click: connectStart,
          dragstart: connectStart
        }
      }
    });
  }

  return ContextPad;
};

ContextPadProvider.props = {
  //设置事件处理
  onClickSetting: () => {
    console.log('开始设置了');

  }
};

// /**
//  * 抛出-设置按钮click事件
//  * @param preProps 状态提升接收的函数
//  */
// export function setContextPadProps(preProps) {
//   const { props } = ContextPadProvider;
//   const preKeys = Object.getOwnPropertyNames(preProps);
//   preKeys.forEach((key) => {
//     if (props[key]) {
//       props[key] = preProps[key];
//     }
//   });
// }
