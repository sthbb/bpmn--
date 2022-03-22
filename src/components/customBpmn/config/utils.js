import { some } from 'min-dash';

// 获取字符串长度  字符串实际长度，中文2，英文1
const getStrLength = (str) => {
  let realLength = 0;
  const len = str.length;
  let
    charCode = -1;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
  }
  return realLength;
};

const cutstr = (str, len) => {
  let strLength = 0;
  let strLen = 0;
  let strcut = new String();
  strLen = str.length;
  for (let i = 0; i < strLen; i++) {
    const a = str.charAt(i);
    strLength++;
    if (escape(a).length > 4) {
      // 中文字符的长度经编码之后大于4
      strLength++;
    }
    strcut = strcut.concat(a);
    if (strLength >= len) {
      strcut = strcut.concat("...");
      return strcut;
    }
  }
  // 如果给定字符串小于指定长度，则返回源字符串；
  if (strLength < len) {
    return str;
  }
};

/**
 * Return the business object for a given element.
 *
 * @param  {djs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}
 */
function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}

function setConnectTypeToStorage(type) {
  sessionStorage.setItem('Connection_Type', type);
}
function getConnectTypeFromStorage() {
  const item = sessionStorage.getItem('Connection_Type');
  return item;
}

/**
 * Is an element of the given BPMN type?
 *
 * @param  {djs.model.Base|ModdleElement} element
 * @param  {String} type
 *
 * @return {Boolean}
 */
function is(element, type) {
  const bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}

/**
 * Return true if element has any of the given types.
 *
 * @param {djs.model.Base} element
 * @param {Array<String>} types
 *
 * @return {Boolean}
 */
function isAny(element, types) {
  return some(types, t => is(element, t));
}

function isArray(data,type){
  let res = []
  if(Object.prototype.toString.call(data) === '[object Array]'){
    res = data.map(v=>{
      return {...v,type}
    })
  }else{
    res = [{...data,type}]
  }
  return res
} 

function fitViewport (center) {
  var vbox = this.viewbox(false)
  var outer = vbox.outer
  var inner = vbox.inner
  var newScale
  var newViewbox

  // display the complete diagram without zooming in.
  // instead of relying on internal zoom, we perform a
  // hard reset on the canvas viewbox to realize this
  //
  // if diagram does not need to be zoomed in, we focus it around
  // the diagram origin instead

  if (inner.x >= 0 &&
    inner.y >= 0 &&
    inner.x + inner.width <= outer.width &&
    inner.y + inner.height <= outer.height &&
    !center) {
    newViewbox = {
      x: 0,
      y: 0,
      width: Math.max(inner.width + inner.x, outer.width),
      height: Math.max(inner.height + inner.y, outer.height)
    }
  } else {
    newScale = Math.min(1, outer.width / inner.width, outer.height / inner.height)
    newViewbox = {
      x: inner.x + (center ? inner.width / 2 - outer.width / newScale / 2 : 0),
      y: inner.y + (center ? inner.height / 2 - outer.height / newScale / 2 : 0),
      width: outer.width / newScale,
      height: outer.height / newScale
    }
  }

  this.viewbox(newViewbox)

  return this.viewbox(false).scale
};

export {
  getStrLength,
  getBusinessObject,
  is,
  cutstr,
  isAny,
  setConnectTypeToStorage,
  getConnectTypeFromStorage,
  isArray,
  fitViewport
};
