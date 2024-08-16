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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6553899082568807, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5789473684210527, 500, 1500, "https://demowebshop.tricentis.com/fiction-8"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demowebshop.tricentis.com/fiction-9"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demowebshop.tricentis.com/fiction-6"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demowebshop.tricentis.com/fiction-7"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demowebshop.tricentis.com/fiction-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demowebshop.tricentis.com/fiction-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/books-8"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demowebshop.tricentis.com/fiction-4"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demowebshop.tricentis.com/fiction-12"], "isController": false}, {"data": [0.0, 500, 1500, "Open menu and add product to cart"], "isController": true}, {"data": [0.47368421052631576, 500, 1500, "https://demowebshop.tricentis.com/books-9"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demowebshop.tricentis.com/fiction-5"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demowebshop.tricentis.com/fiction-11"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demowebshop.tricentis.com/fiction-2"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demowebshop.tricentis.com/fiction-10"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demowebshop.tricentis.com/fiction-3"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demowebshop.tricentis.com/books-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/fiction-16"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demowebshop.tricentis.com/books-12"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demowebshop.tricentis.com/fiction-15"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demowebshop.tricentis.com/books-13"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demowebshop.tricentis.com/fiction-14"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demowebshop.tricentis.com/books-14"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demowebshop.tricentis.com/fiction-13"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demowebshop.tricentis.com/books-15"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demowebshop.tricentis.com/books-16"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demowebshop.tricentis.com/fiction-19"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demowebshop.tricentis.com/books-17"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demowebshop.tricentis.com/fiction-18"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demowebshop.tricentis.com/books-18"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demowebshop.tricentis.com/fiction-17"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demowebshop.tricentis.com/books-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/books"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demowebshop.tricentis.com/fiction-22"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demowebshop.tricentis.com/fiction-21"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demowebshop.tricentis.com/fiction-20"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demowebshop.tricentis.com/books-4"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demowebshop.tricentis.com/books-5"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demowebshop.tricentis.com/books-6"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "https://demowebshop.tricentis.com/books-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/addproducttocart/details/45/1"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demowebshop.tricentis.com/books-0"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demowebshop.tricentis.com/books-1"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demowebshop.tricentis.com/books-2"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demowebshop.tricentis.com/books-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/fiction"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 854, 0, 0.0, 799.9332552693207, 119, 8669, 644.0, 1535.5, 2045.0, 4476.100000000008, 4.667942060672315, 140.2072906702651, 7.064515578026784], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/fiction-8", 19, 0, 0.0, 750.3157894736842, 215, 1050, 852.0, 1023.0, 1050.0, 1050.0, 0.11093335824468396, 0.013433336349942197, 0.09923335561731494], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-9", 19, 0, 0.0, 849.9999999999999, 215, 1461, 859.0, 1168.0, 1461.0, 1461.0, 0.11049402459945916, 0.013380135791340756, 0.09851664497979122], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-6", 19, 0, 0.0, 353.63157894736844, 204, 915, 227.0, 880.0, 915.0, 915.0, 0.11080397028120882, 0.01341766827624013, 0.09825195802279063], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-7", 19, 0, 0.0, 734.0526315789473, 218, 1309, 703.0, 1206.0, 1309.0, 1309.0, 0.11107083981246565, 0.013341516891536401, 0.09968174002700775], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-0", 19, 0, 0.0, 637.2631578947369, 436, 1915, 503.0, 1120.0, 1915.0, 1915.0, 0.1109398355754858, 3.9483314137822307, 0.07973800681988041], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-1", 19, 0, 0.0, 318.42105263157896, 197, 859, 224.0, 816.0, 859.0, 859.0, 0.11107928137551229, 0.01345100672906594, 0.09936388841793871], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-8", 19, 0, 0.0, 859.0526315789473, 329, 1641, 838.0, 1099.0, 1641.0, 1641.0, 0.1101621703107153, 0.806313932108214, 0.08219130675526023], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-4", 19, 0, 0.0, 402.4210526315789, 197, 1381, 225.0, 1032.0, 1381.0, 1381.0, 0.11066521442841416, 0.9169866644776311, 0.09013162972001701], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-12", 19, 0, 0.0, 1150.3157894736844, 561, 1751, 1139.0, 1669.0, 1751.0, 1751.0, 0.11050109337923976, 5.203047576536547, 0.08902675980261016], "isController": false}, {"data": ["Open menu and add product to cart", 18, 0, 0.0, 7735.611111111111, 6461, 11125, 7482.5, 9851.500000000002, 11125.0, 11125.0, 0.11653653420347279, 78.81204204783825, 4.012088844540264], "isController": true}, {"data": ["https://demowebshop.tricentis.com/books-9", 19, 0, 0.0, 843.4736842105262, 195, 1641, 846.0, 1508.0, 1641.0, 1641.0, 0.11014939736684967, 0.367343937507609, 0.08099853146214629], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-5", 19, 0, 0.0, 330.7894736842105, 205, 883, 227.0, 838.0, 883.0, 883.0, 0.11065232457238701, 0.013291246017972267, 0.09779331419727562], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-11", 19, 0, 0.0, 711.1578947368422, 208, 1364, 724.0, 1022.0, 1364.0, 1364.0, 0.11030991279711104, 0.013357841002775166, 0.0973829698911996], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-2", 19, 0, 0.0, 413.0, 208, 1381, 225.0, 878.0, 1381.0, 1381.0, 0.11068584444560957, 0.013403363975835532, 0.09944431336910234], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-10", 19, 0, 0.0, 855.6315789473684, 233, 1419, 861.0, 1285.0, 1419.0, 1419.0, 0.11002183064744951, 0.013322956054964589, 0.09691376098046822], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-3", 19, 0, 0.0, 326.31578947368416, 199, 840, 225.0, 828.0, 840.0, 840.0, 0.11079750880548624, 0.013308685139721489, 0.10214145343005761], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-11", 19, 0, 0.0, 824.8421052631579, 207, 1974, 852.0, 1015.0, 1974.0, 1974.0, 0.10998552821997105, 0.15380788712011578, 0.07948172937771346], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-16", 19, 0, 0.0, 204.3157894736842, 119, 407, 192.0, 343.0, 407.0, 407.0, 0.11063492802906787, 0.04732236179368333, 0.05607375746785764], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-12", 19, 0, 0.0, 644.1578947368422, 206, 1676, 663.0, 1012.0, 1676.0, 1676.0, 0.11036950548652621, 0.8047057890257858, 0.0832082599957014], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-15", 19, 0, 0.0, 611.6842105263158, 209, 1667, 453.0, 1344.0, 1667.0, 1667.0, 0.11066650357918771, 0.987893075407573, 0.09067304345990086], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-13", 19, 0, 0.0, 638.4736842105262, 206, 1429, 685.0, 1406.0, 1429.0, 1429.0, 0.1101723907988658, 0.4027102136329636, 0.08499627805771874], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-14", 19, 0, 0.0, 501.78947368421046, 201, 1033, 238.0, 989.0, 1033.0, 1033.0, 0.11079298622085124, 0.013199945623968604, 0.09943237728218973], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-14", 19, 0, 0.0, 409.10526315789474, 209, 875, 222.0, 848.0, 875.0, 875.0, 0.11046447404375556, 0.4034542313707478, 0.08640824580961738], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-13", 19, 0, 0.0, 513.0526315789474, 206, 1468, 228.0, 988.0, 1468.0, 1468.0, 0.10999635275251399, 0.013212452527889865, 0.09538746215257073], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-15", 19, 0, 0.0, 312.57894736842104, 203, 890, 219.0, 627.0, 890.0, 890.0, 0.11051201963624095, 0.3834464900073869, 0.08363946798641284], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-16", 19, 0, 0.0, 352.47368421052636, 194, 875, 216.0, 843.0, 875.0, 875.0, 0.1104619051771751, 0.38111514745210895, 0.08392515842562716], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-19", 19, 0, 0.0, 547.9473684210526, 201, 2043, 226.0, 1615.0, 2043.0, 2043.0, 0.11064008199012391, 0.37157347848050404, 0.09227209962848225], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-17", 19, 0, 0.0, 315.52631578947376, 198, 1106, 216.0, 1085.0, 1106.0, 1106.0, 0.11044649448639474, 0.3885041729882752, 0.08402130781728662], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-18", 19, 0, 0.0, 402.1052631578948, 207, 1412, 227.0, 897.0, 1412.0, 1412.0, 0.11069229290345885, 0.4259058926168241, 0.09350472007958194], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-18", 19, 0, 0.0, 376.3684210526316, 200, 1087, 223.0, 906.0, 1087.0, 1087.0, 0.11048824172501222, 0.3291988530302854, 0.08362147200867623], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-17", 19, 0, 0.0, 425.47368421052636, 200, 1454, 229.0, 823.0, 1454.0, 1454.0, 0.11062204522694985, 0.42574363304629825, 0.0915008518625259], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-10", 19, 0, 0.0, 793.1052631578947, 218, 1414, 808.0, 1219.0, 1414.0, 1414.0, 0.1100517822596527, 0.41591835678208594, 0.08114169492777129], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books", 19, 0, 0.0, 4413.999999999999, 3262, 8669, 4224.0, 5274.0, 8669.0, 8669.0, 0.10825779028756688, 60.70090420182671, 1.5203664864506827], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-22", 19, 0, 0.0, 358.7368421052632, 200, 1325, 225.0, 927.0, 1325.0, 1325.0, 0.11069874211271463, 0.013404925802711536, 0.10150988168343655], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-21", 19, 0, 0.0, 446.8947368421053, 195, 1793, 216.0, 1049.0, 1793.0, 1793.0, 0.11034899321063299, 0.013362573396600089, 0.09957272434240712], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-20", 19, 0, 0.0, 419.15789473684214, 203, 1557, 219.0, 1150.0, 1557.0, 1557.0, 0.11065748015445455, 0.01339992923745348, 0.10028334138997444], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-4", 19, 0, 0.0, 1325.2105263157894, 392, 1798, 1437.0, 1693.0, 1798.0, 1798.0, 0.10975489997862668, 10.124246427911249, 0.08113716726935585], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-5", 19, 0, 0.0, 947.4210526315788, 217, 1632, 1005.0, 1350.0, 1632.0, 1632.0, 0.10997406927208743, 2.3813037480175727, 0.08151398298585386], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-6", 19, 0, 0.0, 638.3684210526316, 211, 1547, 652.0, 957.0, 1547.0, 1547.0, 0.11051266242453149, 0.6468875962623455, 0.0832082643840955], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-7", 19, 0, 0.0, 1709.8947368421052, 586, 2300, 1713.0, 2072.0, 2300.0, 2300.0, 0.10919351965196002, 24.359645334778712, 0.0817885054424349], "isController": false}, {"data": ["https://demowebshop.tricentis.com/addproducttocart/details/45/1", 18, 0, 0.0, 352.8333333333333, 302, 459, 342.0, 423.90000000000003, 459.0, 459.0, 0.11298725754817651, 0.2708825364070052, 0.08926434702780742], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-0", 19, 0, 0.0, 1488.157894736842, 1227, 2414, 1426.0, 1758.0, 2414.0, 2414.0, 0.10983992276519115, 3.386909727842686, 0.05481269583302019], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-1", 19, 0, 0.0, 1254.0, 403, 2051, 1349.0, 1634.0, 2051.0, 2051.0, 0.10965038839321783, 10.04296902051905, 0.08213071083749812], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-2", 19, 0, 0.0, 1037.578947368421, 463, 1632, 1046.0, 1304.0, 1632.0, 1632.0, 0.11035155682814778, 2.7518919484019353, 0.0830869631977558], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-3", 19, 0, 0.0, 1243.0526315789475, 214, 7130, 1162.0, 1288.0, 7130.0, 7130.0, 0.10983293832013412, 2.927948779553731, 0.08537794814729174], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction", 19, 0, 0.0, 2929.315789473684, 1987, 4827, 2811.0, 4101.0, 4827.0, 4827.0, 0.10944700460829493, 12.387391543058756, 2.144477246543779], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 854, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
