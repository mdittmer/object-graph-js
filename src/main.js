/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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

(function(global, name, deps, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory.apply(global, deps.map(require));
  } else if (typeof define === 'function' && define.amd) {
    if (!name) define(deps, factory);
    else define(name, deps, factory);
  } else {
    if (!name && (typeof document === 'undefined' ||
        document.currentScript === undefined)) {
      throw new Error('Unknown module name');
    }
    name = name ||
        document.currentScript.getAttribute('src').split('/').pop()
        .split('#')[0].split('?')[0].split('.')[0];
    global[name] = factory.apply(
        this, deps.map(function(name) { return global[name]; }));
  }
})(this, 'object-graph-js', [], function() {
  return null;
});
