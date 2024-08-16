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

    var data = {"OkPercent": 99.58881578947368, "KoPercent": 0.41118421052631576};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.663961038961039, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.53125, 500, 1500, "https://demowebshop.tricentis.com/-9"], "isController": false}, {"data": [0.975, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSaveBilling/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/-8"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-9"], "isController": false}, {"data": [0.575, 500, 1500, "https://demowebshop.tricentis.com/cart-8"], "isController": false}, {"data": [0.575, 500, 1500, "https://demowebshop.tricentis.com/cart-9"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-5"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-6"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-7"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/cart"], "isController": false}, {"data": [0.0, 500, 1500, "Open shopping cart and checkout"], "isController": true}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demowebshop.tricentis.com/-14"], "isController": false}, {"data": [0.75, 500, 1500, "https://demowebshop.tricentis.com/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSavePaymentInfo/"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demowebshop.tricentis.com/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSaveShipping/"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demowebshop.tricentis.com/-11"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-12"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/-18"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-13"], "isController": false}, {"data": [0.75, 500, 1500, "https://demowebshop.tricentis.com/-17"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-10"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/-16"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-11"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demowebshop.tricentis.com/-15"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-16"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demowebshop.tricentis.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSaveShippingMethod/"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-17"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demowebshop.tricentis.com/-4"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/-7"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-15"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demowebshop.tricentis.com/-6"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demowebshop.tricentis.com/-1"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demowebshop.tricentis.com/-10"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demowebshop.tricentis.com/-0"], "isController": false}, {"data": [0.15625, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-18"], "isController": false}, {"data": [0.75, 500, 1500, "https://demowebshop.tricentis.com/-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-19"], "isController": false}, {"data": [0.75, 500, 1500, "https://demowebshop.tricentis.com/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSavePaymentMethod/"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demowebshop.tricentis.com/-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcConfirmOrder/"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-20"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demowebshop.tricentis.com/-23"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/-22"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-23"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-24"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-21"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-22"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/-21"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demowebshop.tricentis.com/-20"], "isController": false}, {"data": [0.6, 500, 1500, "https://demowebshop.tricentis.com/cart-11"], "isController": false}, {"data": [0.7, 500, 1500, "https://demowebshop.tricentis.com/cart-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/cart-2"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-1"], "isController": false}, {"data": [0.525, 500, 1500, "https://demowebshop.tricentis.com/cart-3"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/cart-0"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demowebshop.tricentis.com/cart-1"], "isController": false}, {"data": [0.525, 500, 1500, "https://demowebshop.tricentis.com/cart-10"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-4"], "isController": false}, {"data": [0.55, 500, 1500, "https://demowebshop.tricentis.com/cart-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/cart-7"], "isController": false}, {"data": [0.325, 500, 1500, "https://demowebshop.tricentis.com/cart-4"], "isController": false}, {"data": [0.575, 500, 1500, "https://demowebshop.tricentis.com/cart-5"], "isController": false}, {"data": [0.875, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1216, 5, 0.41118421052631576, 741.3388157894746, 194, 4942, 639.0, 1337.0, 1934.1999999999962, 3848.449999999999, 11.74062487931101, 394.6720035337736, 16.902775816581702], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/-9", 16, 0, 0.0, 742.6875, 369, 1249, 687.0, 1039.0000000000002, 1249.0, 1249.0, 0.20348985094368416, 0.024641349137711755, 0.16930991504298723], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSaveBilling/", 20, 0, 0.0, 291.0, 250, 736, 267.0, 313.30000000000007, 715.0499999999997, 736.0, 0.21733933189889373, 0.08808185814261807, 0.24195980309056528], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-8", 16, 0, 0.0, 746.0000000000001, 619, 1127, 687.0, 945.7000000000002, 1127.0, 1127.0, 0.20232675771370762, 0.024302921092564492, 0.1689349393019727], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-9", 16, 0, 0.0, 717.75, 207, 931, 766.5, 907.9, 931.0, 931.0, 0.19569950341251008, 0.023506873945057367, 0.1634014408375939], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-8", 20, 0, 0.0, 703.25, 226, 1141, 743.5, 1022.5000000000005, 1136.0, 1141.0, 0.21592209530801287, 1.5804063518882387, 0.16109812579621272], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-9", 20, 0, 0.0, 666.8499999999999, 221, 1011, 669.5, 887.8, 1004.8499999999999, 1011.0, 0.21657444205009366, 0.7222673042979199, 0.1592583543591021], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-5", 16, 0, 0.0, 367.4375, 213, 852, 231.0, 844.3, 852.0, 852.0, 0.19632624513785782, 0.45170374369608696, 0.15146263052627704], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-6", 16, 0, 0.0, 482.18750000000006, 213, 1100, 233.5, 1058.0, 1100.0, 1100.0, 0.19640095254461984, 0.45839675447425926, 0.15363004198070362], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-7", 16, 0, 0.0, 355.12500000000006, 208, 861, 227.0, 821.8000000000001, 861.0, 861.0, 0.19640095254461984, 0.023591130041980705, 0.16130195418947782], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-8", 16, 0, 0.0, 878.0625000000001, 635, 2036, 783.0, 1536.2000000000005, 2036.0, 2036.0, 0.19677534404939062, 0.023828264318480893, 0.16218592810320864], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/", 16, 1, 6.25, 3919.7500000000005, 2779, 4942, 3870.5, 4769.8, 4942.0, 4942.0, 0.18943205900808638, 110.0703858494252, 3.746555444395771], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart", 20, 0, 0.0, 3467.35, 3141, 3814, 3461.0, 3771.0000000000005, 3812.45, 3814.0, 0.21037573105566543, 110.59415201487357, 1.9891189727353054], "isController": false}, {"data": ["Open shopping cart and checkout", 16, 2, 12.5, 12192.375000000002, 10938, 13829, 12197.0, 13705.1, 13829.0, 13829.0, 0.1990247785849338, 228.26004142203206, 10.800434803058762], "isController": true}, {"data": ["https://demowebshop.tricentis.com/", 16, 1, 6.25, 3109.6875, 2412, 4380, 3020.0, 4241.400000000001, 4380.0, 4380.0, 0.19813505380605054, 7.471278156848662, 3.944258940070338], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-14", 16, 0, 0.0, 476.4375, 212, 853, 424.5, 845.3, 853.0, 853.0, 0.2036841368248189, 0.02446596565376243, 0.16390207885122146], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-13", 16, 0, 0.0, 483.93749999999994, 194, 866, 438.5, 859.7, 866.0, 866.0, 0.20303537891477588, 0.024586315415461142, 0.17250076138267093], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSavePaymentInfo/", 20, 0, 0.0, 265.2, 248, 344, 260.0, 291.9, 341.4, 344.0, 0.2171576238612797, 0.08800821670159285, 0.15120447833309808], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-12", 16, 0, 0.0, 696.5000000000001, 208, 1054, 808.5, 1044.9, 1054.0, 1054.0, 0.202526518315992, 0.024524695577327157, 0.1661350345560872], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSaveShipping/", 20, 0, 0.0, 271.3, 246, 343, 267.0, 296.7, 340.7, 343.0, 0.2173629526583489, 0.08809143100899883, 0.24941549743511715], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-11", 16, 0, 0.0, 752.1875000000001, 217, 1158, 815.0, 971.8000000000002, 1158.0, 1158.0, 0.20351573431020886, 0.024644483451626856, 0.1665490091327686], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-12", 16, 0, 0.0, 659.375, 207, 902, 684.5, 875.4, 902.0, 902.0, 0.19546520719311963, 0.023669614933541833, 0.1599607847928069], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-18", 16, 0, 0.0, 344.375, 198, 834, 214.0, 832.6, 834.0, 834.0, 0.2031410687759481, 0.024599113797087464, 0.1731856963294948], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-13", 16, 1, 6.25, 711.5625, 200, 1257, 712.0, 1254.9, 1257.0, 1257.0, 0.1947633017248725, 0.062194921546907526, 0.14978134776204793], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-17", 16, 0, 0.0, 478.0, 209, 938, 420.0, 884.1, 938.0, 938.0, 0.2028911995942176, 0.03923091554653817, 0.16801927466396147], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-10", 16, 0, 0.0, 737.0625000000001, 207, 931, 851.0, 898.1, 931.0, 931.0, 0.19531726848800018, 0.023651700480968773, 0.1625100710466564], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-16", 16, 0, 0.0, 385.125, 195, 1239, 216.5, 990.5000000000002, 1239.0, 1239.0, 0.2041962325795089, 0.024726887538924908, 0.1689005947215274], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-11", 16, 0, 0.0, 777.2499999999999, 207, 1087, 834.5, 977.8000000000001, 1087.0, 1087.0, 0.19546281930683998, 0.023669325775437653, 0.1620585288979562], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-15", 16, 0, 0.0, 416.93749999999994, 204, 975, 219.5, 905.0000000000001, 975.0, 975.0, 0.20415975500829397, 0.024323720811535023, 0.17046542044149546], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-16", 16, 0, 0.0, 392.4375, 196, 848, 229.0, 838.2, 848.0, 848.0, 0.19664474897068762, 0.023428378295335835, 0.1641906839550175], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-5", 16, 0, 0.0, 400.5625, 210, 917, 226.0, 912.1, 917.0, 917.0, 0.20389438270975635, 0.024690335406259558, 0.17641642878988686], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSaveShippingMethod/", 20, 0, 0.0, 277.1, 248, 375, 270.5, 313.50000000000006, 371.99999999999994, 375.0, 0.21732516190724563, 0.08807611542139349, 0.1610837869996088], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-17", 16, 0, 0.0, 972.875, 412, 1584, 759.0, 1427.9, 1584.0, 1584.0, 0.19390648859587464, 10.557110005574811, 0.14429369561528954], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-4", 16, 0, 0.0, 515.6875000000001, 210, 1047, 632.5, 908.4000000000001, 1047.0, 1047.0, 0.2023574644609703, 0.024504224212070623, 0.17291287246420803], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-14", 16, 0, 0.0, 845.8750000000001, 219, 1262, 799.5, 1225.6000000000001, 1262.0, 1262.0, 0.19598476218474015, 5.7082475899998775, 0.15024222491701272], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-7", 16, 0, 0.0, 722.7499999999999, 599, 869, 671.0, 856.4, 869.0, 869.0, 0.2029092108099882, 0.02457103724652201, 0.16724157609729498], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-15", 16, 0, 0.0, 419.125, 205, 880, 235.0, 835.2, 880.0, 880.0, 0.19686250384497078, 0.023646570286065826, 0.1584127960627499], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-6", 16, 0, 0.0, 449.875, 205, 918, 331.5, 882.3000000000001, 918.0, 918.0, 0.20392816630341964, 0.024495277788399036, 0.1674839725206796], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-1", 16, 0, 0.0, 398.25, 198, 869, 229.5, 859.9, 869.0, 869.0, 0.2039853640501294, 0.02470135267794536, 0.16972219743233424], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-10", 16, 0, 0.0, 788.1875, 497, 1217, 759.0, 1130.2, 1217.0, 1217.0, 0.20332952090481635, 0.024621934172067608, 0.16858082348455966], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-0", 16, 0, 0.0, 858.9375, 407, 1580, 660.5, 1498.1000000000001, 1580.0, 1580.0, 0.20303280248715183, 6.996304168517225, 0.14454190723938834], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-18", 16, 0, 0.0, 1676.75, 958, 2110, 1619.0, 2103.7, 2110.0, 2110.0, 0.19363192990524136, 83.34247286127483, 0.1440893853396425], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-3", 16, 0, 0.0, 550.625, 201, 1269, 533.5, 1025.4000000000003, 1269.0, 1269.0, 0.20234722784297857, 0.024305379906920273, 0.1738921489275597], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-19", 16, 0, 0.0, 345.93750000000006, 213, 898, 231.0, 888.9, 898.0, 898.0, 0.19691095932557998, 0.5895791028244416, 0.15152913666851273], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-2", 16, 0, 0.0, 509.75000000000006, 206, 1057, 434.0, 930.3000000000002, 1057.0, 1057.0, 0.2038917844354109, 0.02469002077147554, 0.17044078855147632], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSavePaymentMethod/", 20, 0, 0.0, 280.75000000000006, 244, 355, 271.5, 347.6, 354.7, 355.0, 0.21716705575764159, 0.08801203919865357, 0.15969413377490635], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-19", 16, 1, 6.25, 361.18750000000006, 202, 864, 218.0, 737.3000000000002, 864.0, 864.0, 0.20467948471939723, 0.0655489048048509, 0.162654229189853], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcConfirmOrder/", 20, 0, 0.0, 269.05, 246, 348, 262.0, 282.5, 344.74999999999994, 348.0, 0.21713169037020952, 0.08799770654652046, 0.150550293127782], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-20", 16, 0, 0.0, 414.875, 209, 1042, 254.0, 1007.7, 1042.0, 1042.0, 0.1966955153422502, 1.462922895357986, 0.1502108330055075], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-23", 16, 0, 0.0, 322.5625, 201, 855, 216.0, 842.4, 855.0, 855.0, 0.20456434187815636, 0.02497123313942338, 0.17360001278527135], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-22", 16, 0, 0.0, 371.43749999999994, 199, 904, 224.5, 864.1, 904.0, 904.0, 0.2045172753185996, 0.024765763808111664, 0.17695537688699142], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-23", 16, 0, 0.0, 484.4375, 203, 1086, 257.0, 995.0000000000001, 1086.0, 1086.0, 0.19667375511659066, 0.7567330030853195, 0.1538434353988175], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-24", 16, 0, 0.0, 398.625, 206, 1051, 234.0, 937.6000000000001, 1051.0, 1051.0, 0.1969958138389559, 0.7581645530657474, 0.15063254124599854], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-21", 16, 0, 0.0, 445.75000000000006, 206, 1380, 226.0, 1039.1000000000004, 1380.0, 1380.0, 0.19699096303957056, 0.758145884120066, 0.15332206791263453], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-22", 16, 0, 0.0, 281.25000000000006, 204, 705, 217.5, 667.9000000000001, 705.0, 705.0, 0.196998239328236, 0.7608672231866929, 0.15217344463733856], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-21", 16, 0, 0.0, 326.06250000000006, 204, 649, 222.5, 642.7, 649.0, 649.0, 0.20406341270549824, 0.02471080388230643, 0.1745698725879067], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-20", 16, 1, 6.25, 362.25, 209, 870, 229.0, 856.7, 870.0, 870.0, 0.20475020475020475, 0.06519664417613635, 0.16514733616784397], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-11", 20, 0, 0.0, 713.4, 213, 1101, 831.5, 923.0000000000001, 1092.35, 1101.0, 0.2163565556036348, 0.302561120726958, 0.1563514171354392], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-12", 20, 0, 0.0, 620.95, 214, 1450, 723.0, 1019.6000000000001, 1428.7999999999997, 1450.0, 0.21581957483543757, 1.573543892306032, 0.1627077263407791], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-2", 20, 0, 0.0, 1162.7, 990, 1319, 1182.5, 1244.2, 1315.35, 1319.0, 0.21563342318059298, 5.377358490566038, 0.16235680592991913], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-1", 16, 0, 0.0, 516.875, 392, 773, 429.0, 749.9, 773.0, 773.0, 0.19735300284928398, 6.800584041542808, 0.14049837800500783], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-3", 20, 0, 0.0, 1066.5, 382, 1907, 1072.0, 1243.6000000000001, 1873.8999999999996, 1907.0, 0.21563342318059298, 5.7483995956873315, 0.16762129380053908], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-2", 16, 0, 0.0, 414.75, 211, 971, 236.0, 960.5, 971.0, 971.0, 0.19784350578692256, 0.02395761202888515, 0.1646119794242754], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-0", 20, 0, 0.0, 1096.55, 948, 1441, 1097.5, 1222.3000000000002, 1430.2499999999998, 1441.0, 0.21611108109568317, 3.5768072289156625, 0.10763344859257658], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-3", 16, 0, 0.0, 464.8125, 213, 860, 335.5, 855.8, 860.0, 860.0, 0.19729703067968826, 0.0238914373088685, 0.1649279865838019], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-1", 20, 0, 0.0, 1132.5, 560, 1640, 1334.5, 1550.4, 1635.55, 1640.0, 0.21708926710663423, 19.883384055336055, 0.16260494909256687], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-10", 20, 0, 0.0, 801.0, 222, 930, 860.5, 902.8000000000001, 928.6999999999999, 930.0, 0.2160270465862326, 0.8164303420788283, 0.15927775407481015], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-4", 16, 0, 0.0, 451.12500000000006, 206, 956, 233.5, 866.4000000000001, 956.0, 956.0, 0.19679954736104108, 0.0236390081302813, 0.16912461101339465], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-6", 20, 0, 0.0, 768.3, 213, 1397, 808.5, 972.9000000000001, 1376.0999999999997, 1397.0, 0.21637996321540626, 1.2665834956183057, 0.16291889808503732], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-7", 20, 0, 0.0, 1773.0500000000002, 1598, 1930, 1732.5, 1926.4, 1929.95, 1930.0, 0.21439444289604012, 47.82859465782647, 0.16058646259888942], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-4", 20, 0, 0.0, 1206.9, 557, 1958, 1365.0, 1681.1000000000004, 1944.7999999999997, 1958.0, 0.21478124530166026, 19.81231139521897, 0.15877871356773127], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-5", 20, 0, 0.0, 946.25, 223, 1231, 1024.0, 1213.8, 1230.15, 1231.0, 0.21557764028714943, 4.667971697350551, 0.1597885048612758], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-0", 16, 0, 0.0, 415.75000000000006, 249, 914, 269.0, 874.1, 914.0, 914.0, 0.19845207382417146, 0.09709422752530264, 0.14496303830125026], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, 60.0, 0.24671052631578946], "isController": false}, {"data": ["Assertion failed", 2, 40.0, 0.16447368421052633], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1216, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Assertion failed", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/", 16, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/", 16, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-13", 16, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-19", 16, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-20", 16, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
