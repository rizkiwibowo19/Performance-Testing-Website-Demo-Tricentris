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

    var data = {"OkPercent": 99.18616480162767, "KoPercent": 0.8138351983723296};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6706827309236948, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSaveBilling/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/-8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-9"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demowebshop.tricentis.com/cart-8"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demowebshop.tricentis.com/cart-9"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-5"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-7"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/cart"], "isController": false}, {"data": [0.0, 500, 1500, "Open shopping cart and checkout"], "isController": true}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demowebshop.tricentis.com/-14"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demowebshop.tricentis.com/-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSavePaymentInfo/"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demowebshop.tricentis.com/-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSaveShipping/"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demowebshop.tricentis.com/-11"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-12"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demowebshop.tricentis.com/-18"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-13"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demowebshop.tricentis.com/-17"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-10"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demowebshop.tricentis.com/-16"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-11"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demowebshop.tricentis.com/-15"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSaveShippingMethod/"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-17"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/-7"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-15"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/-6"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/-1"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demowebshop.tricentis.com/-10"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demowebshop.tricentis.com/-0"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-18"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-19"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcSavePaymentMethod/"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demowebshop.tricentis.com/-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/OpcConfirmOrder/"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-20"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demowebshop.tricentis.com/-23"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demowebshop.tricentis.com/-22"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-23"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-24"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-21"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-22"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demowebshop.tricentis.com/-21"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demowebshop.tricentis.com/-20"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demowebshop.tricentis.com/cart-11"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demowebshop.tricentis.com/cart-12"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/cart-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-1"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demowebshop.tricentis.com/cart-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-2"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demowebshop.tricentis.com/cart-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-3"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demowebshop.tricentis.com/cart-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demowebshop.tricentis.com/cart-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-4"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demowebshop.tricentis.com/cart-6"], "isController": false}, {"data": [0.03125, 500, 1500, "https://demowebshop.tricentis.com/cart-7"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demowebshop.tricentis.com/cart-4"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demowebshop.tricentis.com/cart-5"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demowebshop.tricentis.com/checkout/completed/-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 983, 8, 0.8138351983723296, 849.902339776196, 193, 23374, 620.0, 1523.8000000000002, 2385.3999999999996, 4390.839999999985, 5.368826941352529, 180.05049873630486, 7.713187112903754], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/-9", 13, 0, 0.0, 974.6153846153846, 250, 3901, 689.0, 2827.3999999999987, 3901.0, 3901.0, 0.08625379848458711, 0.010444795910242971, 0.07176585577037913], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSaveBilling/", 16, 0, 0.0, 273.8125, 251, 351, 265.5, 327.20000000000005, 351.0, 351.0, 0.09298217066877426, 0.03768320393314582, 0.10351530718984635], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-8", 13, 0, 0.0, 1028.5384615384617, 213, 3901, 745.0, 2902.599999999999, 3901.0, 3901.0, 0.0863655388213097, 0.010373985620137787, 0.0721118512619334], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-9", 13, 0, 0.0, 1149.5384615384617, 208, 5442, 801.0, 3773.9999999999986, 5442.0, 5442.0, 0.08642640127113291, 0.01038129624643491, 0.07216266903009633], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-8", 16, 0, 0.0, 761.875, 211, 1175, 796.5, 1168.7, 1175.0, 1175.0, 0.09263118892130981, 0.6779987900050947, 0.06911155110925848], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-9", 16, 0, 0.0, 998.7499999999999, 646, 1658, 864.0, 1594.3, 1658.0, 1658.0, 0.09265801086415178, 0.3090108467783968, 0.06813621306709598], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-5", 13, 0, 0.0, 271.69230769230774, 199, 781, 226.0, 579.3999999999999, 781.0, 781.0, 0.0867418429305398, 0.199574005805031, 0.06691997647961566], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-6", 13, 0, 0.0, 270.6153846153846, 203, 640, 230.0, 509.1999999999999, 640.0, 640.0, 0.0864948302705292, 0.20187758236969222, 0.06765855375653701], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-7", 13, 0, 0.0, 235.69230769230768, 199, 313, 229.0, 289.4, 313.0, 313.0, 0.0867418429305398, 0.010419186211383198, 0.07124012685994528], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-8", 13, 1, 7.6923076923076925, 783.3846153846155, 613, 1046, 826.0, 1011.1999999999999, 1046.0, 1046.0, 0.08640055296353898, 0.03154347110898433, 0.06573503608884636], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/", 13, 2, 15.384615384615385, 5389.6923076923085, 3163, 23374, 3836.0, 16586.799999999996, 23374.0, 23374.0, 0.0846811753747142, 49.272033237768454, 1.6576187409212009], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart", 16, 0, 0.0, 4253.1875, 2891, 11883, 3687.0, 6917.200000000004, 11883.0, 11883.0, 0.09103944283860982, 47.85927506998657, 0.8607850444955277], "isController": false}, {"data": ["Open shopping cart and checkout", 13, 2, 15.384615384615385, 14677.76923076923, 11284, 34068, 12342.0, 28165.199999999997, 34068.0, 34068.0, 0.07135956437730546, 81.88864880321778, 3.8610391702254967], "isController": true}, {"data": ["https://demowebshop.tricentis.com/", 13, 1, 7.6923076923076925, 3199.5384615384614, 2195, 4925, 2958.0, 4527.799999999999, 4925.0, 4925.0, 0.08519394729771353, 3.200430434226996, 1.6996166886751032], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-14", 13, 0, 0.0, 445.7692307692308, 204, 989, 237.0, 949.4, 989.0, 989.0, 0.08660488851286081, 0.0104027356319159, 0.0696898712251927], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-13", 13, 0, 0.0, 684.2307692307693, 207, 1545, 775.0, 1304.1999999999998, 1545.0, 1545.0, 0.08639366269255819, 0.010935495916238021, 0.07340086576418518], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSavePaymentInfo/", 16, 0, 0.0, 269.5625, 243, 296, 270.5, 290.4, 296.0, 296.0, 0.09296164170259247, 0.037674884088453, 0.064728174349559], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-12", 13, 0, 0.0, 817.7692307692307, 206, 2154, 725.0, 1804.7999999999997, 2154.0, 2154.0, 0.08580914725509739, 0.01039095142542195, 0.07039031610769708], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSaveShipping/", 16, 0, 0.0, 280.25, 250, 474, 266.5, 351.5000000000001, 474.0, 474.0, 0.09296920395119117, 0.03767794886693783, 0.10667852992446253], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-11", 13, 0, 0.0, 1097.4615384615386, 631, 3900, 810.0, 3094.7999999999993, 3900.0, 3900.0, 0.08615833250488783, 0.01043323557676376, 0.07050847913974219], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-12", 13, 0, 0.0, 914.7692307692307, 624, 1617, 814.0, 1505.0, 1617.0, 1617.0, 0.08626410086264101, 0.010446043463835436, 0.07059503566688786], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-18", 13, 0, 0.0, 465.0769230769231, 201, 931, 228.0, 905.4, 931.0, 931.0, 0.08652073502692126, 0.010477120257166248, 0.07376230632666236], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-13", 13, 1, 7.6923076923076925, 799.6923076923077, 199, 1337, 843.0, 1257.0, 1337.0, 1337.0, 0.08641778345032972, 0.03201716556317805, 0.06543654275686024], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-17", 13, 1, 7.6923076923076925, 642.8461538461539, 211, 1904, 654.0, 1548.7999999999997, 1904.0, 1904.0, 0.08626524572323456, 0.037248545103451935, 0.06594314456728025], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-10", 13, 1, 7.6923076923076925, 2539.3846153846152, 660, 21830, 849.0, 13744.399999999992, 21830.0, 21830.0, 0.08643272209885243, 0.032230471191308854, 0.06638282382351768], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-16", 13, 0, 0.0, 491.5384615384615, 207, 1682, 303.0, 1356.7999999999997, 1682.0, 1682.0, 0.08650116111173954, 0.01047474997837471, 0.07154930025551112], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-11", 13, 1, 7.6923076923076925, 2398.6923076923076, 202, 21830, 853.0, 13574.399999999992, 21830.0, 21830.0, 0.08653110127466969, 0.03226715645488734, 0.06622437348154557], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-15", 13, 0, 0.0, 413.4615384615385, 203, 1174, 236.0, 1051.1999999999998, 1174.0, 1174.0, 0.08648504806572864, 0.010303882679705952, 0.07221163681269334], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-16", 13, 0, 0.0, 444.46153846153845, 209, 870, 232.0, 864.0, 870.0, 870.0, 0.08686587908269632, 0.010349255125086866, 0.07252961583564975], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-5", 13, 0, 0.0, 230.38461538461542, 211, 246, 228.0, 244.4, 246.0, 246.0, 0.08675284115554784, 0.010980959836771192, 0.07506154029669472], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSaveShippingMethod/", 16, 0, 0.0, 274.625, 245, 405, 266.5, 325.2000000000001, 405.0, 405.0, 0.09296488251562972, 0.0376761975038929, 0.06890658772398726], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-17", 13, 0, 0.0, 1043.0, 723, 1588, 743.0, 1562.8, 1588.0, 1588.0, 0.08629903278699408, 4.698493532136432, 0.06421861619500925], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-4", 13, 0, 0.0, 262.46153846153845, 209, 660, 228.0, 494.39999999999986, 660.0, 660.0, 0.08650806854100815, 0.010949977125270337, 0.07392046872400598], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-14", 13, 0, 0.0, 840.8461538461537, 559, 1276, 744.0, 1238.0, 1276.0, 1276.0, 0.08674126415383897, 2.526424026746335, 0.06649598863355818], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-7", 13, 0, 0.0, 1038.1538461538462, 210, 3901, 842.0, 2826.999999999999, 3901.0, 3901.0, 0.08675226223206897, 0.010505156754664602, 0.0715028411365881], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-15", 13, 0, 0.0, 594.5384615384615, 204, 1233, 641.0, 1101.0, 1233.0, 1233.0, 0.08647239202591511, 0.010386820526550352, 0.06958325295835358], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-6", 13, 0, 0.0, 268.2307692307692, 209, 808, 225.0, 581.1999999999998, 808.0, 808.0, 0.08642295393656556, 0.010380882162302308, 0.0709782268170426], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-1", 13, 0, 0.0, 259.53846153846155, 209, 660, 227.0, 494.39999999999986, 660.0, 660.0, 0.08650806854100815, 0.010475586424887705, 0.07197741640326069], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-10", 13, 0, 0.0, 1045.923076923077, 652, 3901, 721.0, 2952.5999999999995, 3901.0, 3901.0, 0.08624235428359141, 0.010443410089028646, 0.07150367069020419], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-0", 13, 0, 0.0, 618.6923076923077, 405, 1437, 574.0, 1179.3999999999996, 1437.0, 1437.0, 0.08656048580408032, 2.9827864278152134, 0.061623627100756403], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-18", 13, 0, 0.0, 1671.4615384615386, 1315, 2226, 1602.0, 2225.6, 2226.0, 2226.0, 0.08600215666946726, 37.016789595310236, 0.06399769861536528], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-3", 13, 0, 0.0, 273.3846153846154, 211, 827, 227.0, 592.5999999999998, 827.0, 827.0, 0.08641203919118332, 0.010379571113784713, 0.07426034617992315], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-19", 13, 0, 0.0, 424.8461538461538, 201, 937, 237.0, 912.1999999999999, 937.0, 937.0, 0.08685543247324184, 0.2600573788700776, 0.06683796952042438], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-2", 13, 0, 0.0, 292.38461538461536, 211, 814, 228.0, 682.8, 814.0, 814.0, 0.08641950687699845, 0.010464862160886532, 0.07224130652999089], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcSavePaymentMethod/", 16, 0, 0.0, 291.31249999999994, 254, 580, 268.5, 383.3000000000002, 580.0, 580.0, 0.09296110158905382, 0.037674665194782554, 0.06835909130523196], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-19", 13, 0, 0.0, 530.0, 196, 978, 409.0, 966.4, 978.0, 978.0, 0.08668169149319216, 0.010581261168602559, 0.07347627755477616], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/OpcConfirmOrder/", 16, 0, 0.0, 274.68749999999994, 246, 361, 264.5, 340.70000000000005, 361.0, 361.0, 0.0929508406241649, 0.037670506698269955, 0.06444833676089559], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-20", 13, 0, 0.0, 380.38461538461536, 204, 1002, 239.0, 976.0, 1002.0, 1002.0, 0.0869187309865276, 0.646458061712299, 0.06637739026510213], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-23", 13, 0, 0.0, 320.0769230769231, 193, 1000, 222.0, 919.5999999999999, 1000.0, 1000.0, 0.0867881701048134, 0.01059425904599773, 0.07365128888777622], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-22", 13, 0, 0.0, 494.3846153846153, 198, 2137, 236.0, 1589.7999999999995, 2137.0, 2137.0, 0.08671522719389525, 0.010500672043010754, 0.07502899540409295], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-23", 13, 0, 0.0, 292.3076923076923, 209, 867, 232.0, 686.5999999999999, 867.0, 867.0, 0.08690594770935976, 0.3343842128660913, 0.06798014073749725], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-24", 13, 0, 0.0, 274.46153846153845, 208, 863, 218.0, 637.7999999999997, 863.0, 863.0, 0.08691698759092854, 0.3345115704061029, 0.0664609387536104], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-21", 13, 0, 0.0, 350.6923076923077, 198, 1217, 222.0, 1106.6, 1217.0, 1217.0, 0.08687342541916428, 0.3343439156024672, 0.06761535162018939], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-22", 13, 0, 0.0, 316.6153846153846, 205, 1423, 228.0, 950.9999999999995, 1423.0, 1423.0, 0.08683686692584132, 0.33539043817549063, 0.06707808763509814], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-21", 13, 0, 0.0, 506.30769230769226, 203, 2166, 225.0, 1844.3999999999996, 2166.0, 2166.0, 0.08670192544968286, 0.010499061284922536, 0.0741707877870334], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-20", 13, 0, 0.0, 494.1538461538462, 206, 1236, 229.0, 1176.8, 1236.0, 1236.0, 0.08631564969125556, 0.01036799307814886, 0.07426180408007435], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-11", 16, 0, 0.0, 761.6875, 210, 1416, 673.0, 1400.6, 1416.0, 1416.0, 0.09255831173639394, 0.12943701406886338, 0.06688784246575342], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-12", 16, 0, 0.0, 836.8749999999999, 216, 2017, 843.5, 1528.4000000000005, 2017.0, 2017.0, 0.09263226150087422, 0.6753832659819599, 0.06983604089714346], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-2", 16, 0, 0.0, 1069.0, 594, 1236, 1095.0, 1229.0, 1236.0, 1236.0, 0.0924716516592882, 2.3060118132534995, 0.06962465178643672], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-1", 13, 0, 0.0, 435.2307692307692, 391, 568, 431.0, 526.0, 568.0, 568.0, 0.08663721001526148, 2.985430266209489, 0.06167824814563049], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-3", 16, 0, 0.0, 985.4999999999999, 381, 1311, 1079.5, 1258.5, 1311.0, 1311.0, 0.0924727205474385, 2.4651565678749767, 0.07188309136304791], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-2", 13, 0, 0.0, 281.30769230769226, 207, 947, 225.0, 670.1999999999998, 947.0, 947.0, 0.0867418429305398, 0.010503895042370055, 0.07217192400080069], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-0", 16, 0, 0.0, 1730.5, 937, 9279, 1185.5, 4134.0000000000055, 9279.0, 9279.0, 0.0922121109081164, 1.5261824762409733, 0.04592595367494078], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-3", 13, 0, 0.0, 269.6923076923077, 207, 640, 229.0, 509.5999999999999, 640.0, 640.0, 0.0864948302705292, 0.010473983353071897, 0.07230427217927052], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-1", 16, 0, 0.0, 1268.9374999999995, 581, 1568, 1416.0, 1549.1, 1568.0, 1568.0, 0.09226528576288975, 8.4506532093903, 0.06910886150403948], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-10", 16, 0, 0.0, 877.0, 657, 1251, 841.5, 1212.5, 1251.0, 1251.0, 0.09272298428924934, 0.35042768476503416, 0.0683650909554524], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-4", 13, 0, 0.0, 238.46153846153848, 207, 313, 226.0, 298.59999999999997, 313.0, 313.0, 0.08673894912427021, 0.010418838615512927, 0.07454128440366972], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-6", 16, 0, 0.0, 701.5625, 211, 999, 816.5, 973.1, 999.0, 999.0, 0.0929022668153103, 0.5438048704013378, 0.0699488747212932], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-7", 16, 0, 0.0, 1797.875, 997, 2316, 1831.0, 2113.0, 2316.0, 2316.0, 0.0920926912937872, 20.544674308441447, 0.06897958420149881], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-4", 16, 0, 0.0, 1203.8749999999998, 565, 1797, 1410.0, 1638.1000000000001, 1797.0, 1797.0, 0.09219298296158433, 8.504262484946613, 0.0681543829120306], "isController": false}, {"data": ["https://demowebshop.tricentis.com/cart-5", 16, 0, 0.0, 948.125, 214, 1236, 1000.5, 1217.1, 1236.0, 1236.0, 0.09245241589719291, 2.001901775086385, 0.06852674186129826], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-0", 13, 0, 0.0, 317.4615384615385, 242, 660, 275.0, 595.1999999999999, 660.0, 660.0, 0.08659796561394628, 0.04236873122322957, 0.06325710769456232], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, 25.0, 0.2034587995930824], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, 37.5, 0.3051881993896236], "isController": false}, {"data": ["Assertion failed", 3, 37.5, 0.3051881993896236], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 983, 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Assertion failed", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-8", 13, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/", 13, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/", 13, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-13", 13, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/-17", 13, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-10", 13, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/checkout/completed/-11", 13, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
