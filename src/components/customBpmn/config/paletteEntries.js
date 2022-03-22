import { assign } from 'min-dash'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'
export default {
  'create.customtask': createAction(
    'etl:Start', // etl.json 定义 // type
    'Start',  //group
    'custom-icon custom-icon-start', // class
    'Start', // title
    drawTask
  ),
  // 'create.StartEvent': createAction(
  //   'bpmn:StartEvent', // 事件名称
  //   'Start', //事件分组 名称一样自动归为一组
  //   'custom-icon custom-icon-start',//事件样式
  //   'StartEvent',//事件分类二级title,
  // ),
  'create.exclusive-gateway': createAction(
    'bpmn:ExclusiveGateway',
    'IF',
    'custom-icon custom-icon-gateway',
    'IF-Event',
  ),
  'create.PrimaryMessage1': createAction(
    'bpmn:Task',
    'PrimaryMessage',
    'custom-icon custom-icon-task',
    'S1F3_SSR',
    drawTask
  ),
  'create.PrimaryMessage1': createAction(
    'etl:Task',
    'PrimaryMessage',
    'custom-icon custom-icon-task',
    'Task',
    drawTask
  ),
  'create.PrimaryMessage2': createAction(
    'bpmn:Task',
    'PrimaryMessage',
    'custom-icon custom-icon-task',
    'S6F11_ERS',
    drawTask
  ),
  'create.SecondaryMessage1': createAction(
    'bpmn:Task',
    'SecondaryMessage',
    'custom-icon custom-icon-task',
    'ReplyMessage',
    drawTask
  ),
  'create.MessageInterface1': createAction(
    'bpmn:Task',
    'MessageInterface',
    'custom-icon custom-icon-task',
    'MoveInRequest',
    drawTask
  ),
  'create.MessageInterface2': createAction(
    'bpmn:Task',
    'MessageInterface',
    'custom-icon custom-icon-task',
    'MoveOutRequest',
    drawTask
  ),
  'create.EtlEnd': createAction(
    'etl:End',
    'End',
    'custom-icon custom-icon-end',
    'End',
    drawTask
  )
}

function createAction (
  type,
  group,
  className,
  title,
  drawShape,
  translate,
  options
) {
 
  var shortType = type.replace(/^bpmn:/, '')

  function createListener (event, autoActivate, elementFactory, bpmnFactory, model, create) {
    const name = event.target.innerText
    const prefix = type + +new Date() + '_'
    const id = model.ids.nextPrefixed(prefix, { type })
    const taskBusinessObject = bpmnFactory.create(type, { id, name})
    var shape = elementFactory.createShape(assign({ type: type }, options, { businessObject: taskBusinessObject }))

    if (options) {
      shape.businessObject.di.isExpanded = options.isExpanded
    }
    create.start(event, shape);
  }
  return {
    type,
    group: group,
    className: className,
    title: title || translate('Create {type}', { type: shortType }),
    drawShape,
    action: {
      dragstart: createListener,
      click: createListener
    }
  }
}

function drawTask (parentNode, element, textRenderer, entries) {
  const circleMap = ['etl:Start','etl:End']
  const width =circleMap.some((v)=> v === element.type) ? 36 : 100
  const height = circleMap.some((v)=>v===element.type)  ? 36 : 80
  const borderRadius = circleMap.some((v)=>v===element.type) ? 36 : 0
  const strokeColor = element.businessObject.color || '#000' // 形状的颜色
  const fillColor = '#fff'
  const strokeWidth = 2;
  const rect = !circleMap.some((v)=> v === element.type) ? drawRect(
    parentNode,
    width,
    height,
    borderRadius,
    strokeColor,
    fillColor,
    strokeWidth
  ): drawCircle(
    parentNode,
    width,
    borderRadius,
    strokeColor,
    fillColor,
    strokeWidth
  )
  
  element.width = circleMap.some((v)=> v === element.type)  ? width*2 : width
  element.height = circleMap.some((v)=> v === element.type)  ? height*2 : height

  const text = textRenderer.createText(element.businessObject.name || '测试', {
    box: element,
    align: 'center-middle',
    padding: 5,
    size: {
      width: 1000
    }
  })
  svgAppend(parentNode, text)
  return rect
}

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect (
  parentNode,
  width,
  height,
  borderRadius,
  strokeColor,
  fillColor,
  strokeWidth
) {
  const rect = svgCreate('rect')

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#9e9e9e', // 默认图形的颜色
    strokeWidth,
    fill: fillColor
  })

  svgAppend(parentNode, rect)

  return rect
}

function drawCircle (
  parentNode,
  width,
  borderRadius,
  strokeColor,
  fillColor,
  strokeWidth,
  
) {
  const circle =  svgCreate('circle', {
    r:width,
    cx:borderRadius,
    cy:borderRadius,
    fill: fillColor,
    stroke: strokeColor || '#9e9e9e', // 默认图形的颜色
    strokeWidth,
    strokeLinecap:'round'
  });

  svgAppend(parentNode, circle)

  return circle
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
// function prependTo (newNode, parentNode, siblingNode) {
//   parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild)
// }
