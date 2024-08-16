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

    var data = {"OkPercent": 96.59824723247233, "KoPercent": 3.4017527675276753};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3874292185730464, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.21348314606741572, 500, 1500, "https://demowebshop.tricentis.com/fiction-8"], "isController": false}, {"data": [0.21348314606741572, 500, 1500, "https://demowebshop.tricentis.com/fiction-9"], "isController": false}, {"data": [0.7134831460674157, 500, 1500, "https://demowebshop.tricentis.com/fiction-6"], "isController": false}, {"data": [0.2050561797752809, 500, 1500, "https://demowebshop.tricentis.com/fiction-7"], "isController": false}, {"data": [0.32303370786516855, 500, 1500, "https://demowebshop.tricentis.com/fiction-0"], "isController": false}, {"data": [0.7415730337078652, 500, 1500, "https://demowebshop.tricentis.com/fiction-1"], "isController": false}, {"data": [0.2806603773584906, 500, 1500, "https://demowebshop.tricentis.com/books-8"], "isController": false}, {"data": [0.7134831460674157, 500, 1500, "https://demowebshop.tricentis.com/fiction-4"], "isController": false}, {"data": [0.1601123595505618, 500, 1500, "https://demowebshop.tricentis.com/fiction-12"], "isController": false}, {"data": [0.0, 500, 1500, "Open menu and add product to cart"], "isController": true}, {"data": [0.2783018867924528, 500, 1500, "https://demowebshop.tricentis.com/books-9"], "isController": false}, {"data": [0.7134831460674157, 500, 1500, "https://demowebshop.tricentis.com/fiction-5"], "isController": false}, {"data": [0.22191011235955055, 500, 1500, "https://demowebshop.tricentis.com/fiction-11"], "isController": false}, {"data": [0.6966292134831461, 500, 1500, "https://demowebshop.tricentis.com/fiction-2"], "isController": false}, {"data": [0.24157303370786518, 500, 1500, "https://demowebshop.tricentis.com/fiction-10"], "isController": false}, {"data": [0.699438202247191, 500, 1500, "https://demowebshop.tricentis.com/fiction-3"], "isController": false}, {"data": [0.27358490566037735, 500, 1500, "https://demowebshop.tricentis.com/books-11"], "isController": false}, {"data": [0.6207865168539326, 500, 1500, "https://demowebshop.tricentis.com/fiction-16"], "isController": false}, {"data": [0.32075471698113206, 500, 1500, "https://demowebshop.tricentis.com/books-12"], "isController": false}, {"data": [0.3651685393258427, 500, 1500, "https://demowebshop.tricentis.com/fiction-15"], "isController": false}, {"data": [0.49528301886792453, 500, 1500, "https://demowebshop.tricentis.com/books-13"], "isController": false}, {"data": [0.4943820224719101, 500, 1500, "https://demowebshop.tricentis.com/fiction-14"], "isController": false}, {"data": [0.5070754716981132, 500, 1500, "https://demowebshop.tricentis.com/books-14"], "isController": false}, {"data": [0.40730337078651685, 500, 1500, "https://demowebshop.tricentis.com/fiction-13"], "isController": false}, {"data": [0.5306603773584906, 500, 1500, "https://demowebshop.tricentis.com/books-15"], "isController": false}, {"data": [0.5636792452830188, 500, 1500, "https://demowebshop.tricentis.com/books-16"], "isController": false}, {"data": [0.47191011235955055, 500, 1500, "https://demowebshop.tricentis.com/fiction-19"], "isController": false}, {"data": [0.5212264150943396, 500, 1500, "https://demowebshop.tricentis.com/books-17"], "isController": false}, {"data": [0.5028089887640449, 500, 1500, "https://demowebshop.tricentis.com/fiction-18"], "isController": false}, {"data": [0.5283018867924528, 500, 1500, "https://demowebshop.tricentis.com/books-18"], "isController": false}, {"data": [0.5196629213483146, 500, 1500, "https://demowebshop.tricentis.com/fiction-17"], "isController": false}, {"data": [0.29952830188679247, 500, 1500, "https://demowebshop.tricentis.com/books-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/books"], "isController": false}, {"data": [0.5056179775280899, 500, 1500, "https://demowebshop.tricentis.com/fiction-22"], "isController": false}, {"data": [0.5112359550561798, 500, 1500, "https://demowebshop.tricentis.com/fiction-21"], "isController": false}, {"data": [0.5196629213483146, 500, 1500, "https://demowebshop.tricentis.com/fiction-20"], "isController": false}, {"data": [0.2240566037735849, 500, 1500, "https://demowebshop.tricentis.com/books-4"], "isController": false}, {"data": [0.4221698113207547, 500, 1500, "https://demowebshop.tricentis.com/books-5"], "isController": false}, {"data": [0.45990566037735847, 500, 1500, "https://demowebshop.tricentis.com/books-6"], "isController": false}, {"data": [0.018867924528301886, 500, 1500, "https://demowebshop.tricentis.com/books-7"], "isController": false}, {"data": [0.4240506329113924, 500, 1500, "https://demowebshop.tricentis.com/addproducttocart/details/45/1"], "isController": false}, {"data": [0.12735849056603774, 500, 1500, "https://demowebshop.tricentis.com/books-0"], "isController": false}, {"data": [0.23820754716981132, 500, 1500, "https://demowebshop.tricentis.com/books-1"], "isController": false}, {"data": [0.32547169811320753, 500, 1500, "https://demowebshop.tricentis.com/books-2"], "isController": false}, {"data": [0.3584905660377358, 500, 1500, "https://demowebshop.tricentis.com/books-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demowebshop.tricentis.com/fiction"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8672, 295, 3.4017527675276753, 3359.804197416965, 50, 52342, 1261.5, 8817.7, 12304.100000000031, 25212.23000000002, 30.34533919804603, 955.7210473551056, 44.55535779427666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demowebshop.tricentis.com/fiction-8", 178, 7, 3.932584269662921, 4166.370786516854, 256, 21044, 2058.0, 9059.8, 11014.099999999982, 21037.68, 0.6723831828655612, 2.676721181722887, 0.5768738726721565], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-9", 178, 7, 3.932584269662921, 4369.112359550561, 244, 32925, 2290.0, 8844.099999999999, 11759.449999999992, 28395.140000000047, 0.6723857227579902, 0.34034288956819997, 0.5737294081872406], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-6", 178, 0, 0.0, 1113.6910112359556, 213, 10755, 382.5, 2258.1999999999994, 6769.599999999993, 10699.7, 0.6943225479297096, 0.16806862895676086, 0.6153450341797827], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-7", 178, 6, 3.3707865168539324, 4495.94382022472, 215, 31748, 2437.0, 8684.9, 11011.099999999966, 28790.24000000003, 0.6723831828655612, 0.16384249400332412, 0.5827871793903222], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-0", 178, 0, 0.0, 1949.7696629213478, 487, 10966, 1077.0, 4809.899999999999, 9292.949999999999, 10416.950000000006, 0.6957854166503795, 24.764092891750643, 0.4992445121391102], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-1", 178, 0, 0.0, 955.3595505617978, 209, 10095, 344.0, 2002.4999999999989, 4152.65, 8734.620000000014, 0.6942765092713217, 0.44084379583005046, 0.6207282675363325], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-8", 212, 9, 4.245283018867925, 3644.1084905660377, 208, 34626, 1455.5, 8770.2, 10353.399999999998, 21050.09, 0.7698732614300758, 5.488031585911682, 0.5500128236554453], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-4", 178, 0, 0.0, 1135.1685393258426, 214, 14525, 354.5, 2188.9, 6953.149999999975, 10665.06000000004, 0.6961827284105132, 5.768662549378129, 0.5670081987249687], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-12", 178, 8, 4.49438202247191, 4045.9325842696626, 378, 22922, 1949.5, 8790.7, 9472.549999999994, 21441.540000000015, 0.6693515938464778, 30.184396022998623, 0.5150355569531717], "isController": false}, {"data": ["Open menu and add product to cart", 158, 40, 25.31645569620253, 28981.297468354434, 8467, 91764, 25210.0, 53310.39999999999, 61140.699999999946, 83842.06999999995, 0.5828279698404969, 393.6276274521196, 19.81708758004663], "isController": true}, {"data": ["https://demowebshop.tricentis.com/books-9", 212, 6, 2.830188679245283, 3709.3962264150937, 218, 23054, 1494.0, 8928.2, 10442.949999999999, 21072.49, 0.7700913938654229, 2.555755712343621, 0.5502608934331547], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-5", 178, 1, 0.5617977528089888, 1117.1292134831458, 208, 21055, 381.5, 1797.8999999999996, 6909.2999999999865, 13047.560000000081, 0.6944010985581425, 0.4533691863413644, 0.6099363055228294], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-11", 178, 5, 2.808988764044944, 4326.033707865169, 222, 21472, 2135.5, 8908.899999999998, 11026.449999999999, 21135.460000000003, 0.6747612747680982, 0.19889450387040034, 0.5773815602053851], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-2", 178, 0, 0.0, 1229.6516853932583, 203, 12598, 383.5, 3875.7999999999993, 8182.15, 10017.860000000026, 0.6952446050190411, 0.27804901865052245, 0.6239853896103896], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-10", 178, 7, 3.932584269662921, 4040.97191011236, 224, 21056, 1996.0, 8573.8, 9900.399999999996, 21049.68, 0.691393702102536, 0.20261364662595988, 0.58378068787847], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-3", 178, 0, 0.0, 1162.3033707865175, 203, 9169, 380.0, 3157.4999999999955, 7568.449999999992, 9039.44, 0.6924184074376629, 0.2896371853969736, 0.6376850176994593], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-11", 212, 10, 4.716981132075472, 3998.8301886792465, 50, 22565, 1574.5, 9785.7, 12643.599999999997, 21308.170000000002, 0.7695351209295404, 1.1237712563659068, 0.5298777909260194], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-16", 178, 5, 2.808988764044944, 1747.8988764044936, 183, 21037, 608.5, 7221.599999999999, 7538.699999999997, 21031.47, 0.6746717608174899, 0.3343784171840414, 0.3323426164661603], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-12", 212, 6, 2.830188679245283, 3364.811320754717, 202, 29025, 1434.0, 8633.800000000003, 10017.099999999997, 22387.370000000003, 0.7689712832752372, 5.511430796665131, 0.5633247398374279], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-15", 178, 6, 3.3707865168539324, 2593.679775280898, 228, 23194, 1198.0, 7988.399999999999, 9988.199999999992, 22003.470000000012, 0.6748047615437107, 5.8871636046136935, 0.5342549899537494], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-13", 212, 9, 4.245283018867925, 2680.5047169811314, 127, 22461, 955.5, 8439.800000000001, 12396.499999999998, 21645.45, 0.7685893485117644, 2.77913337698945, 0.56778206911866], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-14", 178, 2, 1.1235955056179776, 1430.943820224718, 215, 21156, 1006.5, 2307.1999999999994, 4135.199999999991, 11009.240000000102, 0.6938380940501434, 0.21359640061743795, 0.6144322465152177], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-14", 212, 6, 2.830188679245283, 2251.8962264150937, 213, 21039, 944.0, 8221.500000000004, 9061.3, 21028.57, 0.7661755192465458, 2.7757133541321073, 0.5823608754458816], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-13", 178, 3, 1.6853932584269662, 2521.769662921348, 213, 21226, 1121.0, 7968.2, 10855.649999999998, 21073.530000000002, 0.6764485690072547, 0.13158073655938496, 0.5754741315426447], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-15", 212, 3, 1.4150943396226414, 2043.5188679245282, 210, 21806, 839.0, 7885.7, 8751.599999999999, 21037.83, 0.7656000028890566, 2.649492739213888, 0.571234063918572], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-16", 212, 8, 3.7735849056603774, 2074.8113207547167, 213, 21120, 757.5, 8107.6, 9078.999999999998, 21037.87, 0.7650998960619009, 2.6210684026825413, 0.5593608799370596], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-19", 178, 6, 3.3707865168539324, 2555.6123595505615, 209, 23005, 1090.0, 8201.599999999999, 9854.949999999997, 21605.120000000014, 0.6736937721174043, 2.2490598624699585, 0.5429113127566566], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-17", 212, 9, 4.245283018867925, 2648.2924528301874, 209, 22795, 799.5, 8342.7, 11286.149999999983, 21809.120000000003, 0.7645066948428254, 2.6621164957645607, 0.5569022479471913], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-18", 178, 3, 1.6853932584269662, 1997.1741573033712, 208, 21037, 940.5, 4469.199999999997, 8315.19999999999, 21033.84, 0.6735102369772255, 2.579885042113309, 0.5593432459315063], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-18", 212, 6, 2.830188679245283, 2212.5235849056603, 207, 31678, 848.0, 8212.300000000003, 9232.8, 21036.7, 0.7642834482161913, 2.271085897618464, 0.562066316460214], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-17", 178, 2, 1.1235955056179776, 1909.9606741573034, 203, 21046, 950.0, 4385.999999999999, 8400.399999999998, 21027.83, 0.6735127853915834, 2.5843954324103433, 0.5508355531507534], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-10", 212, 6, 2.830188679245283, 3455.1273584905657, 218, 21549, 1432.0, 8879.0, 10830.849999999999, 21061.53, 0.7696692237595437, 2.8886031150274287, 0.5514199512240282], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books", 214, 54, 25.233644859813083, 17064.121495327105, 1901, 52342, 15905.0, 32571.5, 36268.5, 49115.549999999974, 0.7488356305790879, 403.57224011204545, 10.1340934375842], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-22", 178, 8, 4.49438202247191, 2559.1235955056186, 219, 21049, 947.5, 8484.9, 10550.349999999995, 21044.26, 0.6741198569956978, 0.21703114821926317, 0.5891225861396413], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-21", 178, 8, 4.49438202247191, 2359.286516853932, 211, 22424, 880.0, 7911.599999999999, 10048.899999999998, 21469.68000000001, 0.6751989560968948, 0.1825947317411788, 0.5812492769112304], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-20", 178, 4, 2.247191011235955, 2293.252808988765, 204, 32448, 988.0, 7990.799999999999, 8717.049999999983, 25928.920000000064, 0.6735153338252265, 0.17396584179957242, 0.5954006801369733], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-4", 212, 2, 0.9433962264150944, 3305.391509433963, 431, 21059, 1725.0, 9075.800000000001, 10060.8, 20465.30000000002, 0.7471786955387792, 68.29258984647593, 0.5471467664255958], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-5", 212, 2, 0.9433962264150944, 2656.6415094339613, 208, 21059, 1285.0, 8483.6, 8899.3, 20395.91000000002, 0.7485162078474157, 16.07494137873508, 0.5495743586416549], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-6", 212, 3, 1.4150943396226414, 2496.259433962265, 212, 21603, 1038.5, 8231.000000000002, 8880.65, 21055.36, 0.749068963811489, 4.3526383480909345, 0.5560151816757238], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-7", 212, 13, 6.132075471698113, 5826.688679245284, 564, 25199, 3334.0, 11799.900000000003, 14912.949999999995, 21709.310000000005, 0.7471602623519337, 156.5841446843248, 0.5253229672923547], "isController": false}, {"data": ["https://demowebshop.tricentis.com/addproducttocart/details/45/1", 158, 2, 1.2658227848101267, 1615.23417721519, 334, 21050, 913.0, 2744.5, 8173.649999999997, 21043.51, 0.6319342788350011, 1.51754530028877, 0.4929331099565645], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-0", 212, 0, 0.0, 3660.7783018867926, 471, 12205, 2067.0, 8883.0, 9515.85, 11497.670000000004, 0.7887579666414909, 24.3213210905323, 0.39360871186894714], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-1", 212, 2, 0.9433962264150944, 3138.1462264150946, 415, 22612, 1634.5, 9054.6, 9886.699999999999, 20459.13000000002, 0.7472155646411955, 67.81239398658889, 0.5544019521887776], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-2", 212, 5, 2.358490566037736, 3392.6650943396203, 224, 23710, 1511.0, 8748.5, 9849.549999999994, 21532.280000000002, 0.748138476197198, 18.26662275690793, 0.5500103938754984], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-3", 212, 3, 1.4150943396226414, 2976.2924528301883, 217, 21121, 1462.0, 8644.4, 9445.05, 21055.49, 0.7481965639425724, 19.693291244335587, 0.5733756502604571], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction", 178, 43, 24.15730337078652, 14752.601123595507, 1609, 45477, 11741.5, 31786.3, 34666.25, 44438.15000000001, 0.6671389110643864, 78.86811585494976, 12.775838983400236], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to s7.addthis.com:443 [s7.addthis.com/23.195.49.181] failed: Connection timed out: connect", 3, 1.0169491525423728, 0.03459409594095941], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 48, 16.271186440677965, 0.5535055350553506], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 139, 47.11864406779661, 1.602859778597786], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 10, 3.389830508474576, 0.11531365313653137], "isController": false}, {"data": ["Assertion failed", 95, 32.20338983050848, 1.095479704797048], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8672, 295, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 139, "Assertion failed", 95, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 48, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 10, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to s7.addthis.com:443 [s7.addthis.com/23.195.49.181] failed: Connection timed out: connect", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://demowebshop.tricentis.com/fiction-8", 178, 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-9", 178, 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-7", 178, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-8", 212, 9, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-12", 178, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-9", 212, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-5", 178, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-11", 178, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-10", 178, 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-11", 212, 10, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-16", 178, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to s7.addthis.com:443 [s7.addthis.com/23.195.49.181] failed: Connection timed out: connect", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-12", 212, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-15", 178, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-13", 212, 9, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-14", 178, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 1, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-14", 212, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-13", 178, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-15", 212, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-16", 212, 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-19", 178, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-17", 212, 9, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-18", 178, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-18", 212, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 2, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-17", 178, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-10", 212, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books", 214, 54, "Assertion failed", 52, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-22", 178, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.impl.execchain.RequestAbortedException/Non HTTP response message: Request execution failed", 1, "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-21", 178, 8, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction-20", 178, 4, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-4", 212, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-5", 212, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-6", 212, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-7", 212, 13, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 7, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/addproducttocart/details/45/1", 158, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-1", 212, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-2", 212, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/books-3", 212, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to demowebshop.tricentis.com:443 [demowebshop.tricentis.com/52.174.3.80] failed: Connection timed out: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demowebshop.tricentis.com/fiction", 178, 43, "Assertion failed", 43, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
