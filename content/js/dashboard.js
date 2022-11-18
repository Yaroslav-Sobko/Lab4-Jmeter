/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 76.59033078880407, "KoPercent": 23.40966921119593};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7199519230769231, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [0.0, 500, 1500, "-90"], "isController": false}, {"data": [1.0, 500, 1500, "-91"], "isController": false}, {"data": [1.0, 500, 1500, "-92"], "isController": false}, {"data": [1.0, 500, 1500, "-93"], "isController": false}, {"data": [0.0, 500, 1500, "-83"], "isController": false}, {"data": [1.0, 500, 1500, "-94"], "isController": false}, {"data": [0.0, 500, 1500, "-84"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "-95"], "isController": false}, {"data": [1.0, 500, 1500, "-85"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "-96"], "isController": false}, {"data": [1.0, 500, 1500, "-86"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "-87"], "isController": false}, {"data": [1.0, 500, 1500, "-88"], "isController": false}, {"data": [1.0, 500, 1500, "-89"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 393, 92, 23.40966921119593, 116.88040712468201, 13, 652, 121.0, 220.60000000000002, 259.4999999999998, 472.84000000000015, 76.54850019477989, 25.303506646864044, 35.5189895184067], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 23, 23, 100.0, 1709.4782608695652, 1012, 2550, 1762.0, 2244.2000000000003, 2501.399999999999, 2550.0, 4.588071015360064, 21.469374937662078, 29.817981061739477], "isController": true}, {"data": ["-90", 28, 28, 100.0, 90.32142857142857, 36, 258, 42.0, 213.10000000000002, 246.29999999999993, 258.0, 7.577807848443843, 1.6946464817320703, 3.589098443843031], "isController": false}, {"data": ["-91", 28, 0, 0.0, 138.1785714285714, 119, 319, 124.0, 221.3, 276.2499999999997, 319.0, 7.834359261331841, 3.802691749440403, 3.657054420817012], "isController": false}, {"data": ["-92", 28, 0, 0.0, 141.9285714285715, 119, 395, 125.0, 218.3, 316.6999999999995, 395.0, 7.82122905027933, 3.7974096543296088, 3.6509252793296088], "isController": false}, {"data": ["-93", 25, 0, 0.0, 152.88, 120, 380, 125.0, 262.0000000000002, 363.49999999999994, 380.0, 7.559721802237678, 3.6673509789839733, 3.528854513153916], "isController": false}, {"data": ["-83", 32, 32, 100.0, 88.375, 36, 295, 42.0, 211.5, 274.19999999999993, 295.0, 6.547984448536935, 1.4643441784325764, 2.947871905054226], "isController": false}, {"data": ["-94", 25, 0, 0.0, 152.52, 120, 413, 124.0, 258.6000000000002, 380.8999999999999, 413.0, 7.566585956416465, 3.648808735623487, 3.532058678874092], "isController": false}, {"data": ["-84", 32, 32, 100.0, 78.1875, 37, 289, 40.0, 228.7, 287.7, 289.0, 6.9144338807260155, 1.5462942955920485, 3.112845721694036], "isController": false}, {"data": ["-95", 24, 0, 0.0, 139.04166666666663, 51, 533, 58.0, 240.5, 460.0, 533.0, 7.712082262210797, 2.1087724935732646, 3.517131266066838], "isController": false}, {"data": ["-85", 32, 0, 0.0, 126.375, 50, 399, 72.5, 249.5, 307.3499999999997, 399.0, 6.718454755406256, 1.8370774721813983, 3.1164707117363006], "isController": false}, {"data": ["-96", 23, 0, 0.0, 203.47826086956522, 50, 652, 209.0, 414.6000000000002, 615.3999999999994, 652.0, 7.474813129671758, 2.0438942151446216, 3.467320543548911], "isController": false}, {"data": ["-86", 29, 0, 0.0, 148.5862068965517, 121, 285, 125.0, 248.0, 284.0, 285.0, 6.764637275484022, 3.267053738045253, 3.1577115407044554], "isController": false}, {"data": ["-87", 30, 0, 0.0, 117.73333333333332, 50, 587, 62.0, 217.0, 384.0499999999997, 587.0, 6.7598017124831005, 1.848383280757098, 3.1356502084272195], "isController": false}, {"data": ["-88", 29, 0, 0.0, 51.37931034482759, 40, 110, 44.0, 66.0, 89.0, 110.0, 6.788389513108615, 1.5313652124297752, 3.2218333040730336], "isController": false}, {"data": ["-89", 28, 0, 0.0, 43.03571428571429, 13, 177, 30.0, 84.20000000000013, 172.49999999999997, 177.0, 7.454739084132056, 2.0267051883652822, 3.494408945686901], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 92, 100.0, 23.40966921119593], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 393, 92, "400/Bad Request", 92, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["-90", 28, 28, "400/Bad Request", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-83", 32, 32, "400/Bad Request", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["-84", 32, 32, "400/Bad Request", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
