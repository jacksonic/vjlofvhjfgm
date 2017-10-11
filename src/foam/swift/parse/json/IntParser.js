/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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

foam.CLASS({
  package: 'foam.swift.parse.json',
  name: 'IntParser',
  implements: ['foam.swift.parse.parser.Parser'],
  axioms: [
    foam.pattern.Singleton.create()
  ],
  methods: [
    {
      name: 'parse',
      swiftCode: function() {/*
var ps = ps
var n = 0

var negate = false

if !ps.valid() { return nil }

var c = ps.head()

if c == "-" {
  negate = true
  ps = ps.tail()
  if !ps.valid() { return nil }
  c = ps.head()
}

if c.isDigit() { n = Int(String(c))! }
else { return nil }

ps = ps.tail()

while ( ps.valid() ) {
  c = ps.head()
  if c.isDigit() {
    n *= 10
    n += Int(String(c))!
    if n > Int(Int32.max) { return nil }
  } else {
    break
  }
  ps = ps.tail()
}

if negate { n *= -1 }

return ps.setValue(n)
      */},
    },
  ]
});
