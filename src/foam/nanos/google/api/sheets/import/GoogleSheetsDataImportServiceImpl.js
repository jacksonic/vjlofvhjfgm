/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

 foam.CLASS({
  package: 'foam.nanos.google.api.sheets',
  name: 'GoogleSheetsDataImportServiceImpl',
  implements: [
    'foam.nanos.google.api.sheets.GoogleSheetsDataImportService'
  ],
  javaImports: [
    'com.google.api.services.sheets.v4.model.ValueRange',

    'foam.dao.DAO',
    'foam.core.FObject',
    'foam.core.PropertyInfo',
    'foam.core.AbstractEnumPropertyInfo',
    'foam.nanos.google.api.sheets.ImportDataMessage',
    'foam.nanos.logger.Logger',
    'foam.nanos.logger.StdoutLogger',

    'java.lang.Throwable',
    'java.math.BigDecimal',
    'java.text.ParseException',
    'java.text.SimpleDateFormat',
    'java.time.LocalDateTime',
    'java.time.format.DateTimeFormatter',
    'java.util.ArrayList',
    'java.util.Date',
    'java.util.List',
    'java.util.Locale',
    'java.util.regex.Matcher',
    'java.util.regex.Pattern',

    'static foam.mlang.MLang.AND',
    'static foam.mlang.MLang.CONTAINS_IC',
    'static foam.mlang.MLang.EQ'
  ],
  axioms: [
    {
      name: 'javaExtras',
      buildJavaClass: function(cls) {
        cls.extras.push(foam.java.Code.create({
          data: `
            public static Pattern digitAppearenceRegex = Pattern.compile("(\\\\d){1}");
            public static Pattern numbersRegex = Pattern.compile("\\\\d+(\\\\.\\\\d{1,2})?");
            public static Pattern alphabeticalCharsRegex = Pattern.compile("[a-zA-Z]{1,}");
            public static String dateTimeFormat = "EEE MMM d yyyy HH/mm/ss zZ (zzzz)";
            public static String dateFormat  = "yyyy-MM-dd";
          `
        }));
      }
    }
  ],
  methods: [
    {
      name: 'getColumns',
      javaType: 'String[]',
      args: [
        {
          name: 'x',
          type: 'Context',
        },
        {
          name: 'importConfig',
          type: 'foam.nanos.google.api.sheets.GoogleSheetsImportConfig'
        }
      ],
      javaCode:`
        GoogleSheetsApiService googleSheetsAPIEnabler = (GoogleSheetsApiService)x.get("googleSheetsDataExport");
        ValueRange values;
        try {
          values = googleSheetsAPIEnabler.getFormatedValues(x, importConfig.getGoogleSpreadsheetId(), importConfig.getGoogleSheetId());//sb.toString()
          List<Object> firstRow = values.getValues().get(0);
          String[] columnNames = new String[firstRow.size()];
          for ( int i = 0 ; i < firstRow.size() ; i++ ) {
            columnNames[i] = String.valueOf(firstRow.get(i));
          }
          return columnNames;
        } catch ( Throwable t ) {
          Logger logger = (Logger) x.get("logger");
          if ( logger == null ) {
            logger = new StdoutLogger();
          }
          logger.error(t);
          return null;
        }
      `
    },
    {
      name: 'importData',
      type: 'foam.nanos.google.api.sheets.ImportDataMessage',
      args: [
        {
          name: 'x',
          type: 'Context',
        },
        {
          name: 'importConfig',
          type: 'foam.nanos.google.api.sheets.GoogleSheetsImportConfig'
        }
      ],
      javaCode: `
        GoogleSheetsApiService googleSheetsAPIEnabler = (GoogleSheetsApiService)x.get("googleSheetsDataExport");
        ValueRange values;
        ImportDataMessage result = new ImportDataMessage();
        try {
          values = googleSheetsAPIEnabler.getFormatedValues(x, importConfig.getGoogleSpreadsheetId(), importConfig.getGoogleSheetId());
          
          importConfig.setCellsRange(values.getRange().split("!")[1]);

          List<List<Object>> data = values.getValues();
          List<FObject> parsedObjs = valueRangeValuesToFobjectsArray(x, importConfig, data);

          if ( parsedObjs == null ) {
            result.setResult(0);
            result.setSuccess(false);
          }
          int recordsAdded = addRecordsToDAO(x, importConfig.getDAO(), parsedObjs);
          result.setResult(recordsAdded);

          if ( recordsAdded <= 0 ) {
            result.setSuccess(false);
            return result;
          }
            
          List<String> columnHeaders = new ArrayList<>();
          for ( Object header : data.get(0) ) {
            columnHeaders.add(header.toString());
          }
          updateSheet(x, importConfig, parsedObjs, columnHeaders);
          result.setSuccess(true);
        } catch ( Throwable t ) {
          Logger logger = (Logger) x.get("logger");
          if ( logger == null ) {
            logger = new StdoutLogger();
          }
          logger.error(t);
          result.setSuccess(false);
        }
        return result;
      `
  },
  {
    name: 'addRecordsToDAO',
    type: 'Integer',
    args: [
      {
        name: 'x',
        type: 'Context',
      },
      {
        name: 'daoId',
        type: 'String'
      },
      {
        name: 'objs',
        javaType: 'List<foam.core.FObject>'
      }
    ],
    javaCode: `
      DAO dao  = (DAO)x.get(daoId);
      if ( dao == null ) return -1;
      int recordsInserted = 0;
      for ( FObject obj: objs ) {
        try {
          dao.put(obj);
          recordsInserted++;
        } catch ( Throwable t ) {
          Logger logger = (Logger) x.get("logger");
          if ( logger == null ) {
            logger = new StdoutLogger();
          }
          logger.error(t);
        }
      }
      return recordsInserted;
    `
  },
  {
    name: 'valueRangeValuesToFobjectsArray',
    javaType: 'List<foam.core.FObject>',
    javaThrows: [
      'InstantiationException',
      'IllegalAccessException',
      'NoSuchMethodException',
      'java.lang.reflect.InvocationTargetException',
      'java.text.ParseException'
    ],
    args: [
      {
        name: 'x',
        type: 'Context',
      },
      {
        name: 'importConfig',
        type: 'foam.nanos.google.api.sheets.GoogleSheetsImportConfig'
      },
      {
        name: 'data',
        javaType: 'List<List<Object>>'
      },
    ],
    javaCode: `
      List<String> columnHeaders = new ArrayList<>();

      for ( int i = 0 ; i < data.get(0).size() ; i++ ) {
        columnHeaders.add(data.get(0).get(i).toString());
      }
      List<FObject> objs = new ArrayList<>();
      
      for ( int i = 1 ; i < data.size() ; i++ ) {
        Object obj = importConfig.getImportClassInfo().newInstance();
        for ( int j = 0 ; j < Math.min(importConfig.getColumnHeaderPropertyMappings().length, data.get(i).size()) ; j++ ) {
          if ( importConfig.getColumnHeaderPropertyMappings()[j].getProp() == null || importConfig.getColumnHeaderPropertyMappings()[j].getProp().getSheetsOutput() ) continue;
          int columnIndex = columnHeaders.indexOf(importConfig.getColumnHeaderPropertyMappings()[j].getColumnHeader());
          Object val = data.get(i).get(columnIndex);
          if ( ! pasreAndSetValue(x, obj, importConfig.getColumnHeaderPropertyMappings()[j], data.get(i).get(columnIndex)) )
            continue;
        }
        postSetValues(x, obj);
        objs.add((FObject)obj);
      }
      return objs;
    `
  },
  {
    name: 'postSetValues',
    type: 'Boolean',
    args: [
      {
        name: 'x',
        type: 'Context',
      },
      {
        name: 'obj',
        javaType: 'Object'
      },
    ],
    javaCode: `
      return true;
    `
  },
  {//maybe all of it to static will save memory
    name: 'pasreAndSetValue',
    type: 'Boolean',
    args: [
      {
        name: 'x',
        type: 'Context',
      },
      {
        name: 'obj',
        type: 'Object'
      },
      {
        name: 'columnHeaderToPropertyMapping',
        javaType: 'foam.nanos.google.api.sheets.ColumnHeaderToPropertyMapping'
      },
      {
        name: 'val',
        type: 'Object'
      }
    ],
    javaCode: `
      PropertyInfo prop  = (PropertyInfo)columnHeaderToPropertyMapping.getProp();
      if ( prop == null ) return false;

      String valueString = val.toString();
      if ( valueString.length() == 0 ) return true;
      try {
        switch (prop.getValueClass().getName()) {
          case "long":
            if ( columnHeaderToPropertyMapping.getUnitProperty() != null ) {
              String unitValue = valueString;
              Matcher numMatcher = numbersRegex.matcher(unitValue);
              if ( ! numMatcher.find() ) {
                return false;
              }
              String number = unitValue.substring(numMatcher.start(), numMatcher.end());
              prop.set(obj, Math.round( Double.parseDouble(number) * 100));//might not be the case for all of the unitValues
              Matcher alphabeticalCharsMatcher = alphabeticalCharsRegex.matcher(unitValue);
              if ( alphabeticalCharsMatcher.find() ) {
                String unit = unitValue.substring(alphabeticalCharsMatcher.start(), alphabeticalCharsMatcher.end());
                ((PropertyInfo)columnHeaderToPropertyMapping.getUnitProperty()).set(obj, unit);
              }
            } else prop.set(obj, Long.parseLong(valueString));
            break;
          case "double":
            prop.set(obj, Double.parseDouble(valueString));
            break;
          default:
            if ( prop instanceof AbstractEnumPropertyInfo )
              prop.set(obj, ((AbstractEnumPropertyInfo)prop).getValueClass().getMethod("forLabel", String.class).invoke(null, valueString));
            else if ( prop.getValueClass().getName().equals("java.util.Date") ) {
              if ( valueString.indexOf("/") > 2 ) {
                prop.set(obj, new SimpleDateFormat(dateTimeFormat, Locale.US).parse(valueString));
              } else if ( valueString.indexOf("-") > -1 ) {
                prop.set(obj, new SimpleDateFormat(dateFormat).parse(valueString));
              } else {
                prop.set(obj, new java.util.Date(valueString));
              }
            }
            else
              prop.set(obj, val);
            break;
        }
      } catch ( Throwable t ) {
        Logger logger = (Logger) x.get("logger");
        if ( logger == null ) {
          logger = new StdoutLogger();
        }
        logger.error(t);
        return false;
      }
      return true;
    `
  },
  {
    name: 'updateSheet',
    type: 'Boolean',
    args: [
      {
        name: 'x',
        type: 'Context',
      },
      {
        name: 'importConfig',
        type: 'foam.nanos.google.api.sheets.GoogleSheetsImportConfig'
      },
      {
        name: 'objs',
        javaType: 'List<foam.core.FObject>'
      },
      {
        name: 'columnHeaders',
        javaType: 'List<String>'
      }
    ],
    javaThrows: [ 'java.io.IOException', 'java.security.GeneralSecurityException' ],
    javaCode: `
      GoogleSheetsApiService googleSheetsAPIEnabler = (GoogleSheetsApiService)x.get("googleSheetsDataExport");
      List<List<List<Object>>> values = new ArrayList<>();

      //to store cells ranges for columns that must be updated
      List<String> cellsRange = new ArrayList<>();

      //to calculate column headers row
      String[] rangeLimits = importConfig.getCellsRange().split(":");
      Matcher m = digitAppearenceRegex.matcher(rangeLimits[0]);

      if ( !m.find() ) return false;
      int indexOfFirstRowInRange = m.start();
      String startColumn = rangeLimits[0].substring(0, indexOfFirstRowInRange);
      String startRow = Integer.toString( Integer.parseInt(rangeLimits[0].substring(indexOfFirstRowInRange)) + 1 );
      m = digitAppearenceRegex.matcher(rangeLimits[1]);

      if ( ! m.find() ) return false;
      int indexOfEndRowInRange = m.start();
      String endColumn = rangeLimits[1].substring(0,indexOfEndRowInRange);
      String endRow = rangeLimits[1].substring(indexOfEndRowInRange);
      List<List<String>> base = GoogleSheetsParsingHelper.generateBase(endColumn.length());

      for ( ColumnHeaderToPropertyMapping c : importConfig.getColumnHeaderPropertyMappings() ) {
        if ( c.getProp() == null ) continue;
        if ( ((PropertyInfo)c.getProp()).getSheetsOutput() ) {
          //to calculate cells ranges
          StringBuilder sb = new StringBuilder();
          int currColumnIndexRelativeToFirstColumn = columnHeaders.indexOf(c.getColumnHeader());
          String startColumnForCurrenctHeader = GoogleSheetsParsingHelper.findColumn(base, startColumn, currColumnIndexRelativeToFirstColumn);
          sb.append(startColumnForCurrenctHeader);
          sb.append(startRow);
          sb.append(":");
          sb.append(startColumnForCurrenctHeader);
          sb.append(endRow);
          
          cellsRange.add(sb.toString());

          List<List<Object>> updatedValues = new ArrayList<>();
          for ( int i = 0 ; i < objs.size() ; i ++ ) {
            int finalI = i;
            updatedValues.add(new ArrayList<Object>() {{ add(getStringValueForProperty(x, (PropertyInfo)c.getProp(), (Object)objs.get(finalI))); }});
          }
          values.add(updatedValues);
        }
      }
      if ( values.size() == 0 ) {
        return true;
      }
      return googleSheetsAPIEnabler.createAndExecuteBatchUpdateWithListOfValuesForCellsRange(x, importConfig.getGoogleSpreadsheetId(), values, cellsRange);
    `
  },
  {
    name: 'getStringValueForProperty',
    type: 'String',
    args: [
      {
        name: 'x',
        type: 'Context'
      },
      {
        name: 'prop',
        type: 'PropertyInfo'
      },
      {
        name: 'obj',
        type: 'Object'
      }
    ],
    javaCode: `
      return prop.get(obj).toString();
    `
  }
],
});