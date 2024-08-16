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

    var data = {"OkPercent": 98.61386138613861, "KoPercent": 1.386138613861386};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6550387596899225, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5227272727272727, 500, 1500, "https://demowebshop.tricentis.com/fiction-8"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demowebshop.tricentis.com/fiction-9"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demowebshop.tricentis.com/fiction-6"], "isController": false}, {"data": [0.5227272727272727, 500, 1500, "https://demowebshop.tricentis.com/fiction-7"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demowebshop.tricentis.com/fiction-0"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demowebshop.tricentis.com/fiction-1"], "isController": false}, {"data": [0.5652173913043478, 500, 1500, "https://demowebshop.tricentis.com/books-8"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demowebshop.tricentis.com/fiction-4"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "https://demowebshop.tricentis.com/fiction-12"], "isController": false}, {"data": [0.0, 500, 1500, "Open menu and add product to cart"], "isController": true}, {"data": [0.5652173913043478, 500, 1500, "https://demowebshop.tricentis.com/books-9"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demowebshop.tricentis.com/fiction-5"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demowebshop.tricentis.com/fiction-11"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demowebshop.tricentis.com/fiction-2"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demowebshop.tricentis.com/fiction-10"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demowebshop.tricentis.com/fiction-3"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demowebshop.tricentis.com/books-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/fiction-16"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demowebshop.tricentis.com/books-12"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demowebshop.tricentis.com/fiction-15"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demowebshop.tricentis.com/books-13"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demowebshop.tricentis.com/fiction-14"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demowebshop.tricentis.com/books-14"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demowebshop.tricentis.com/fiction-13"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demowebshop.tricentis.com/books-15"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demowebshop.tricentis.com/books-16"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demowebshop.tricentis.com/fiction-19"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demowebshop.tricentis.com/books-17"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demowebshop.tricentis.com/fiction-18"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demowebshop.tricentis.com/books-18"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demowebshop.tricentis.com/fiction-17"], "isController": false}, {"data": [0.5434782608695652, 500, 1500, "https://demowebshop.tricentis.com/books-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/books"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demowebshop.tricentis.com/fiction-22"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demowebshop.tricentis.com/fiction-21"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demowebshop.tricentis.com/fiction-20"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://demowebshop.tricentis.com/books-4"], "isController": false}, {"data": [0.6304347826086957, 500, 1500, "https://demowebshop.tricentis.com/books-5"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demowebshop.tricentis.com/books-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/books-7"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demowebshop.tricentis.com/addproducttocart/details/45/1"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demowebshop.tricentis.com/books-0"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demowebshop.tricentis.com/books-1"], "isController": false}, {"data": [0.5434782608695652, 500, 1500, "https://demowebshop.tricentis.com/books-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/books-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/fiction"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1010, 14, 1.386138613861386, 776.8663366336626, 128, 5348, 648.5, 1463.6, 1925.299999999999, 4205.379999999999, 9.014718089236784, 275.35741600023204, 13.477676439677255], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/fiction-8", 22, 2, 9.090909090909092, 701.2272727272729, 219, 1331, 789.0, 888.8, 1265.749999999999, 1331.0, 0.21597424016335506, 0.08912005222649808, 0.17563246092829654], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-9", 22, 1, 4.545454545454546, 694.818181818182, 208, 1368, 770.5, 1181.1999999999998, 1358.6999999999998, 1368.0, 0.2151904924927862, 0.0577713111947963, 0.1831430802807258], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-6", 22, 0, 0.0, 391.27272727272725, 205, 1196, 228.5, 905.1999999999999, 1155.7999999999995, 1196.0, 0.21616098097783368, 0.026175743790284547, 0.19167399485143846], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-7", 22, 1, 4.545454545454546, 736.3636363636364, 222, 974, 832.5, 893.6, 962.2999999999998, 974.0, 0.21606757022196033, 0.057805364245727756, 0.18509801303771362], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-0", 22, 0, 0.0, 626.7727272727274, 409, 1481, 473.5, 1444.2, 1478.8999999999999, 1481.0, 0.21656314292183057, 7.707448418596868, 0.1556547589750657], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-1", 22, 0, 0.0, 322.3636363636364, 208, 944, 230.5, 843.4, 929.4499999999998, 944.0, 0.21596575961047632, 0.026152103702831116, 0.1931881209015589], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-8", 23, 1, 4.3478260869565215, 737.304347826087, 211, 1032, 836.0, 999.0, 1025.3999999999999, 1032.0, 0.2125359231913655, 1.518415400306791, 0.15167730116340317], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-4", 22, 0, 0.0, 334.4090909090909, 208, 1107, 236.5, 853.6999999999996, 1093.7999999999997, 1107.0, 0.216979643364368, 1.7979221425260377, 0.17671974859949505], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-12", 22, 0, 0.0, 1140.590909090909, 226, 1884, 1171.5, 1610.1999999999998, 1858.4999999999995, 1884.0, 0.21363993901550832, 10.059436815988036, 0.17212202117948666], "isController": false}, {"data": ["Open menu and add product to cart", 22, 4, 18.181818181818183, 7376.590909090909, 6502, 8984, 7149.0, 8542.3, 8938.4, 8984.0, 0.22301742577067726, 150.95289065747056, 7.5994118390574465], "isController": true}, {"data": ["https://demowebshop.tricentis.com/books-9", 23, 0, 0.0, 724.9565217391305, 202, 1028, 819.0, 956.8000000000001, 1016.7999999999998, 1028.0, 0.21353238265002972, 0.7121221550291518, 0.15702137122604723], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-5", 22, 0, 0.0, 283.7272727272728, 205, 1155, 228.0, 429.89999999999986, 1052.8499999999985, 1155.0, 0.21551935265823527, 0.025887578493127873, 0.19047364663642866], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-11", 22, 0, 0.0, 777.6818181818182, 221, 1476, 816.0, 1095.8999999999999, 1424.2499999999993, 1476.0, 0.21461739571545635, 0.06167582652085691, 0.1886571505394701], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-2", 22, 0, 0.0, 332.2727272727273, 205, 921, 228.5, 782.4999999999999, 906.2999999999997, 921.0, 0.21654182702245145, 0.026221861865999983, 0.19454929771548374], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-10", 22, 1, 4.545454545454546, 761.5909090909092, 216, 1439, 736.0, 1291.6999999999998, 1429.55, 1439.0, 0.2148395539149626, 0.056990464053436454, 0.18064146086013944], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-3", 22, 0, 0.0, 308.2272727272728, 208, 1044, 228.5, 799.0999999999995, 1037.55, 1044.0, 0.2175116665348414, 0.02612688963260302, 0.20051856758680692], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-11", 23, 0, 0.0, 668.0000000000001, 215, 1052, 686.0, 879.0, 1019.3999999999995, 1052.0, 0.2126125459890181, 0.2973253572815175, 0.15364578518737637], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-16", 22, 0, 0.0, 191.77272727272725, 128, 303, 179.0, 265.6, 297.74999999999994, 303.0, 0.2149928172854225, 0.09195981833106939, 0.10896608610462333], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-12", 23, 0, 0.0, 709.4347826086956, 199, 1063, 784.0, 1048.6000000000001, 1062.2, 1063.0, 0.2125634224559393, 1.5498032344297292, 0.160252892710923], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-15", 22, 1, 4.545454545454546, 714.1818181818181, 147, 1276, 805.0, 1104.2, 1250.4999999999995, 1276.0, 0.21536533792779386, 1.867363172649581, 0.16843580828079724], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-13", 23, 0, 0.0, 429.47826086956525, 200, 1149, 219.0, 1009.0000000000003, 1141.3999999999999, 1149.0, 0.21384407977313932, 0.7816585845613871, 0.16497736623123052], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-14", 22, 0, 0.0, 678.909090909091, 202, 1405, 801.5, 1032.5, 1350.249999999999, 1405.0, 0.21468650890461088, 0.025577884849963407, 0.1926727555501342], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-14", 23, 0, 0.0, 482.5217391304348, 208, 1714, 227.0, 889.0000000000001, 1554.1999999999978, 1714.0, 0.21127278071722516, 0.7716408201976778, 0.1652631810102513], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-13", 22, 0, 0.0, 558.5454545454545, 200, 1827, 441.0, 998.7999999999998, 1710.5999999999983, 1827.0, 0.21508950656511835, 0.025835946589364802, 0.18652293147443857], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-15", 23, 0, 0.0, 308.30434782608694, 206, 886, 217.0, 863.4000000000001, 885.4, 886.0, 0.2143602743811512, 0.7437715379650686, 0.1622355592240158], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-16", 23, 0, 0.0, 268.8695652173913, 203, 838, 215.0, 527.8000000000004, 800.5999999999995, 838.0, 0.21403312860599294, 0.7384560970361065, 0.1626150137260376], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-19", 22, 0, 0.0, 525.1363636363637, 216, 1140, 587.0, 876.5, 1102.0499999999995, 1140.0, 0.21512105448429616, 0.7224622132534126, 0.1794075981734267], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-17", 23, 0, 0.0, 313.08695652173907, 202, 967, 216.0, 830.8000000000001, 941.1999999999996, 967.0, 0.21368712488618838, 0.7516611560937994, 0.16256081082650464], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-18", 22, 0, 0.0, 502.22727272727263, 203, 1211, 226.0, 945.9999999999999, 1177.0999999999995, 1211.0, 0.2151841780942507, 0.8279547477454566, 0.18177179106594418], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-18", 23, 0, 0.0, 270.608695652174, 198, 813, 225.0, 540.0000000000005, 783.5999999999996, 813.0, 0.21370102297750565, 0.636720528422236, 0.16173661406988954], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-17", 22, 0, 0.0, 458.8636363636363, 197, 1271, 235.0, 1134.3999999999996, 1267.25, 1271.0, 0.21482906441942445, 0.8267981864032733, 0.17769552496411378], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-10", 23, 1, 4.3478260869565215, 716.695652173913, 212, 1135, 801.0, 953.2, 1100.3999999999996, 1135.0, 0.2133066236343739, 0.8016387513215737, 0.15043406158996903], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books", 23, 1, 4.3478260869565215, 4056.086956521739, 3365, 5348, 4000.0, 4478.0, 5196.799999999997, 5348.0, 0.20528565945786734, 115.06483477572542, 2.869780556324137], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-22", 22, 0, 0.0, 442.5, 199, 1234, 226.5, 861.3, 1178.499999999999, 1234.0, 0.21478292280506497, 0.026008869558425837, 0.19695426222066015], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-21", 22, 0, 0.0, 401.27272727272725, 196, 1437, 225.5, 852.5, 1350.449999999999, 1437.0, 0.21479550491588803, 0.026010393173408315, 0.19381938138894583], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-20", 22, 1, 4.545454545454546, 394.0454545454545, 199, 1328, 224.0, 1013.1999999999998, 1290.4999999999995, 1328.0, 0.21422450728363326, 0.056827310703435385, 0.18531637064734752], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-4", 23, 0, 0.0, 1123.0000000000002, 394, 1863, 1345.0, 1598.6, 1810.5999999999992, 1863.0, 0.2119034457342915, 19.54685124723604, 0.15665127775474477], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-5", 23, 0, 0.0, 841.5217391304348, 211, 1404, 972.0, 1342.2000000000003, 1401.3999999999999, 1404.0, 0.21282108224146865, 4.608283063027426, 0.1577453138879636], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-6", 23, 0, 0.0, 672.4782608695651, 212, 1082, 683.0, 930.2000000000002, 1058.5999999999997, 1082.0, 0.21419657657993257, 1.2538030078321445, 0.16127496146789846], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-7", 23, 0, 0.0, 1812.8695652173913, 1537, 2214, 1826.0, 2083.2000000000003, 2192.3999999999996, 2214.0, 0.21027417924502428, 46.90941775479745, 0.15750028855559922], "isController": false}, {"data": ["https://demowebshop.tricentis.com/addproducttocart/details/45/1", 22, 0, 0.0, 376.27272727272737, 308, 1003, 328.0, 487.19999999999993, 931.299999999999, 1003.0, 0.21642679363705228, 0.5188747835732064, 0.17098562114489774], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-0", 23, 0, 0.0, 1439.086956521739, 1243, 1738, 1440.0, 1630.8, 1717.9999999999998, 1738.0, 0.21231618495509053, 6.546761269489242, 0.10595075245317506], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-1", 23, 0, 0.0, 1363.8260869565217, 417, 1679, 1391.0, 1636.4, 1670.8, 1679.0, 0.2115701262981667, 19.377881421268317, 0.15847098327216197], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-2", 23, 0, 0.0, 1077.5217391304343, 214, 1405, 1175.0, 1298.0, 1386.3999999999996, 1405.0, 0.2128289595439908, 5.307422178628271, 0.16024524200040716], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-3", 23, 0, 0.0, 1121.6956521739132, 237, 1613, 1191.0, 1360.0000000000002, 1573.9999999999995, 1613.0, 0.21248290898340785, 5.664412548270574, 0.16517226128007095], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction", 22, 4, 18.181818181818183, 3002.954545454546, 2364, 4972, 2805.5, 4315.599999999999, 4897.749999999999, 4972.0, 0.2114469700610313, 24.097877571002932, 4.082799960353693], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 9, 64.28571428571429, 0.8910891089108911], "isController": false}, {"data": ["Assertion failed", 5, 35.714285714285715, 0.49504950495049505], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1010, 14, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 9, "Assertion failed", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://demowebshop.tricentis.com/fiction-8", 22, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-9", 22, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-7", 22, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-8", 23, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-10", 22, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-15", 22, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-10", 23, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books", 23, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-20", 22, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction", 22, 4, "Assertion failed", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
