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

foam.CLASS({
    package: 'foam.dao',
    name: 'FixesSizeDAO',
    extends: 'foam.dao.ProxyDAO',
  
    documentation: function() {/*
      DAO Decorator that stores a fixed number of objects.
    */},
  
    properties: [
      {
          class: 'Int',
          name: 'Size',
          value: '1000',
          documentation: 'The number of elements the DAO will store'
      },
      {
        class: 'Array',
        name: 'FixedSizeArray',
        value: '[1000]FObject'
      },
      {
        class: 'AtomicInteger',
        name: 'putIndex',
        value: '0'
      }
    ],
  
    methods: [
      {
        name: 'put_',
        args:[
          {
            class: 'FObject',
            name: 'obj'    
          }
        ],
        // code: function put_(x, obj) {
        //   if ( ! obj.hasOwnProperty(this.property) ) {
        //     obj[this.property] = foam.uuid.randomGUID();
        //   }
  
        //   return this.delegate.put_(x, obj);
        // },
        javaCode: `
        
        FixedSizeArray[putIndex.getAndIncrement] = obj;
        
        return getDelegate().put_(x, obj);
        `,
      },
      {
          name: 'display_',
          javaCode:
          `

          `
      }
    ],
  

  });
  