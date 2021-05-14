/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => width * height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);
  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  output: '',
  isElementCalled: false,
  isIdCalled: false,
  isPseudoElementCalled: false,
  orderChecker: 0,

  element(value) {
    const innerObj = Object.create(cssSelectorBuilder);
    if (this.orderChecker > 0) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    innerObj.orderChecker = 0;
    if (this.isElementCalled) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    innerObj.isElementCalled = true;
    innerObj.output += `${this.output}${value}`;
    return innerObj;
  },

  id(value) {
    const innerObj = Object.create(cssSelectorBuilder);
    if (this.orderChecker > 1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    innerObj.orderChecker = 1;
    if (this.isIdCalled) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    innerObj.isIdCalled = true;
    innerObj.output += `${this.output}#${value}`;
    return innerObj;
  },

  class(value) {
    const innerObj = Object.create(cssSelectorBuilder);
    if (this.orderChecker > 2) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    innerObj.orderChecker = 2;
    innerObj.output += `${this.output}.${value}`;
    return innerObj;
  },

  attr(value) {
    const innerObj = Object.create(cssSelectorBuilder);
    if (this.orderChecker > 3) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    innerObj.orderChecker = 3;
    innerObj.output += `${this.output}[${value}]`;
    return innerObj;
  },

  pseudoClass(value) {
    const innerObj = Object.create(cssSelectorBuilder);
    if (this.orderChecker > 4) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    innerObj.orderChecker = 4;
    innerObj.output += `${this.output}:${value}`;
    return innerObj;
  },

  pseudoElement(value) {
    const innerObj = Object.create(cssSelectorBuilder);
    if (this.orderChecker > 5) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    innerObj.orderChecker = 5;
    if (this.isPseudoElementCalled) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    innerObj.isPseudoElementCalled = true;
    innerObj.output += `${this.output}::${value}`;
    return innerObj;
  },

  combine(selector1, combinator, selector2) {
    const innerObj = Object.create(cssSelectorBuilder);
    innerObj.output = `${selector1.output} ${combinator} ${selector2.output}`;
    return innerObj;
  },

  stringify() {
    cssSelectorBuilder.orderChecker = 0;
    cssSelectorBuilder.isElementCalled = false;
    cssSelectorBuilder.isIdCalled = false;
    cssSelectorBuilder.isPseudoElementCalled = false;
    return this.output;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
