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

var facade = require('facade-js');

// Very simple async task queue.
var TaskQueue = function(opts) {
  opts = opts || {};
  this.q = [];
  this.maxDequeueSize = opts.maxDequeueSize || this.maxDequeueSize;
  this.onTick = opts.onTick || this.onTick;
  this.onDone = opts.onDone || this.onDone;
};

// Number of queued functions to run before allowing async tick.
TaskQueue.prototype.maxDequeueSize = 10;
// Singleton listeners for queue-fully-flushed and async-tick.
TaskQueue.prototype.onDone = TaskQueue.prototype.onTick = function() {};

TaskQueue.prototype.async = function(f) {
  window.setTimeout(f, 0);
};

// Enqueue a number of tasks.
TaskQueue.prototype.enqueue = function(/* fs */) {
  for ( var i = 0; i < arguments.length; i++ ) {
    this.q.push(arguments[i]);
  }
};

// Flush at most this.maxDequeueSize tasks.
TaskQueue.prototype.flush = function() {
  this.onTick();
  for ( var i = 0; i < this.maxDequeueSize && this.q.length > 0; i++ ) {
    var f = this.q.shift();
    f();
  }
  if ( this.q.length > 0 ) this.async(this.flush.bind(this));
  else                     this.onDone();
};

// Return if the task queue is empty.
TaskQueue.prototype.empty = function() {
  return this.q.length === 0;
};

module.exports = facade(TaskQueue, {
  properties: [ 'maxDequeueSize', 'onTick', 'onDone' ],
  methods: { enqueue: 1, flush: 1, empty: 1 },
});
