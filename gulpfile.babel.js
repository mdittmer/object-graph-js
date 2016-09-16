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

import browserify from 'gulp-browserify';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();

gulp.task('build', () => {
  return gulp.src('src/main.js')
      .pipe(browserify({
        debug: gutil.env.type !== 'production',
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
  return gulp.src([
    'src/**/*.js',
  ])
    .pipe(gulp.dest('lint'))
    .pipe($.eslint({fix: true}))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('default', cb => {
  return runSequence('build', cb);
});
