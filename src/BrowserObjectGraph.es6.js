/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const ObjectGraph = require('./ObjectGraph.es6.js');

// BrowserObjectGraph is an ObjectGraph with custom application logic to probe
// for interface members that may go undetected using object reflection.
function BrowserObjectGraph(opts) {
  opts = opts || {};
  this.init(opts);
};

BrowserObjectGraph.prototype = Object.create(ObjectGraph.prototype);

BrowserObjectGraph.prototype.isCSSStyleDecl_ =
    typeof CSSStyleDeclaration === 'function' ?
        function(o) {
          return (o === CSSStyleDeclaration.prototype ||
              (o instanceof CSSStyleDeclaration));
        } : function(o) {
          return (o.background !== undefined && o.border !== undefined &&
              o.color !== undefined && o.margin !== undefined &&
              o.padding !== undefined);
        };

BrowserObjectGraph.prototype.getOwnPropertyNames = function(o) {
  if (!this.isCSSStyleDecl_(o)) {
    return ObjectGraph.prototype.getOwnPropertyNames.call(this, o);
  }

  const propNames = Object.getOwnPropertyNames(o);
  let newPropNames = [];
  for (const propName of propNames) {
    if (propName.startsWith('webkit')) continue;

    const webkitName = 'webkit' + propName.charAt(0).toUpperCase() +
        propName.substr(1);
    if (propNames.indexOf(webkitName) >= 0) continue;
    if (newPropNames.indexOf(webkitName) >= 0) continue;

    try {
      let value = o[webkitName];
      if (value !== undefined) {
        // Found "hidden" webkit-prefixed CSSStyleDeclaration
        // property.
        newPropNames.push(webkitName);
      }
    } catch (e) {
      // Assumption: Error is "Illegal invocation" of getter on
      // prototype.
      console.warn(
          "Treating error accessing", webkitName, "as sign of property",
          e);
          newPropNames.push(webkitName);
    }
  }
  return propNames.concat(newPropNames);
};

module.exports = BrowserObjectGraph;
