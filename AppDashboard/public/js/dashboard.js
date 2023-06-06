var projectPath = sessionStorage.getItem('projectPath'),
	LicKey      = sessionStorage.getItem('LicKey'),
	AccessToken = sessionStorage.getItem('AccessToken'),
	prefix      = sessionStorage.getItem("prefix"),
	baseurl     = sessionStorage.getItem("baseURL");

var today   = new Date();
var dd      = String(today.getDate()).padStart(2, '0');
var mm      = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy    = today.getFullYear();
$(document).ready(function () {
	graphForAllShift();
	today = dd + '-' + mm;
	//API For present-absent-location-shift-wise
	var settings = {
		"url": baseurl + prefix + "present-absent-location-shift-wise",
		"method": "GET",
		"timeout": 0,
		"headers": {
			"LicKey"     : LicKey,
			"AccessToken": AccessToken
		},
	};
	$.ajax(settings).done(function (response) {
	var objJson = response;
	var j = 1;
	if (objJson['category'] == '1') {
	var obj = objJson.ResponseData;
		
		$.each(obj, function (key, value) {
			$.each(value['shiftList'], function (keyShift, valueShift) {
					$('#locationId').text(value['LocationName']);
					var htmldataShift = '<div class="col-md-12 col-lg-12"><div class="text-center mb-2"><h4 class="label label-success" style="font-size:100%; font-weight: bold;" id="shift">' + valueShift['ShiftName'] + '</h4></div></div>';

						htmldataShift += '<div class="row"><div class="col-md-6 col-sm-6 col-lg-6 col-xl-3 text-success"><div class="card dash-widget"><div class="card-body"><span class="dash-widget-icon"><i class="fa fa-user"></i></span><div class="dash-widget-info"><h3 id="total_'+j+'"></h3><span id="TotalEmployees">Total Employee</span></div></div></div></div><div class="col-md-6 col-sm-6 col-lg-6 col-xl-3 text-info"><div class="card dash-widget"><div class="card-body"><span class="dash-widget-icon"><i class="fa fa-thumbs-o-up"></i></span><div class="dash-widget-info"><h3 id="present_'+j+'"></h3><span id="PresentToday">Present Today </span> </div> </div></div></div><div class="col-md-6 col-sm-6 col-lg-6 col-xl-3 text-danger"><div class="card dash-widget"><div class="card-body"><span class="dash-widget-icon"><i class="fa fa-thumbs-o-down"></i></span><div class="dash-widget-info text-danger"><h3 id="absent_'+j+'"></h3><span id="AbsentToday">Absent Today</span></div></div></div></div><div class="col-md-6 col-sm-6 col-lg-6 col-xl-3 text-warning"><div class="card dash-widget"><div class="card-body"><span class="dash-widget-icon"><i class="fa fa-clipboard"></i></span><div class="dash-widget-info"><h3 id="late_'+j+'"></h3><span id="LateComing">Late Coming</span></div></div></div></div></div>';
						
						htmldataShift += '<div class="row"><div class="col-md-6 col-lg-6"><div class="card"><div class="card-body"><div class="d-flex align-items-center"><div><h4 class="card-title" id="Attendance">Attendance</h4><h5 class="card-subtitle" id="OverviewofCurrentWeek">Overview of Current Week</h5></div><div class="ml-auto"><ul class="list-inline font-12 dl m-r-10"><li class="list-inline-item"><i class="fas fa-dot-circle text-info"></i> Present</li><li class="list-inline-item"><i class="fas fa-dot-circle text-danger"></i> Absent</li></ul></div></div><div id="present-absent-bar' + j + '" style="height:305px"></div></div></div></div><div class="col-md-6 col-lg-6"><div class="card"><div class="card-body"><div class="d-flex align-items-center"> <div> <h4 class="card-title" id="AttendanceLateComing">Attendance Late Coming</h4><h5 class="card-subtitle" id="OverviewofCurrentWeekk">Overview of Current Week</h5></div><div class="ml-auto"><ul class="list-inline font-12 dl m-r-10"><li class="list-inline-item" id="Intime"><i class="fas fa-dot-circle text-intime"></i> Intime</li><li class="list-inline-item"><i class="fas fa-dot-circle text-late" id="LateComing"></i>  LateComing </li></ul></div></div><div id="late-coming-bar' + j + '" style="height:305px"></div> </div> </div></div></div>';
					$('#locdivid').append(htmldataShift);

						presentAbsentGraph(valueShift,j);
					j++;
				// }
			});
		});
		getShiftWiseData();
	}
	//API for Latecoming
	var settings = {
		"url": baseurl + prefix + "latecoming-intime-location-shift-wise",
		"method": "GET",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken
		},
	};
	$.ajax(settings).done(function (response) {
		var objJson = response;
		var k = 1;
		if (objJson['category'] == '1') {
			var obj = objJson.ResponseData;
			$.each(obj, function (key, value) {
				var htmldata = '<div class="col-md-12 col-lg-12"><div><h3 class="card-title" id="locationshow">' + '' + '</h3></div></div>';
				$('#locdivid').append(htmldata);
				$.each(value['shiftList'], function (keyShift, valueShift) {
					lateComingGraph(valueShift,k);
					k++;
				});
			});
		} else {
			alert('Network Error! Please Contact to Backend Team.');
		}

	});

	

	
});

function graphForAllShift()
	{
		var htmldataShift = '<div class="row"><div class="col-md-6 col-lg-6"><div class="card"><div class="card-body"><div class="d-flex align-items-center"><div><h4 class="card-title" id="Attendance">Attendance</h4><h5 class="card-subtitle" id="OverviewofCurrentWeek">Overview of Current Week</h5></div><div class="ml-auto"><ul class="list-inline font-12 dl m-r-10"><li class="list-inline-item"><i class="fas fa-dot-circle text-info"></i> Present</li><li class="list-inline-item"><i class="fas fa-dot-circle text-danger"></i> Absent</li></ul></div></div><div id="present-absent-bar-all" style="height:305px"></div></div></div></div><div class="col-md-6 col-lg-6"><div class="card"><div class="card-body"><div class="d-flex align-items-center"> <div> <h4 class="card-title" id="AttendanceLateComing">Attendance Late Coming</h4><h5 class="card-subtitle" id="OverviewofCurrentWeekk">Overview of Current Week</h5></div><div class="ml-auto"><ul class="list-inline font-12 dl m-r-10"><li class="list-inline-item" id="Intime"><i class="fas fa-dot-circle text-intime"></i> Intime</li><li class="list-inline-item"><i class="fas fa-dot-circle text-late" id="LateComing"></i>  LateComing </li></ul></div></div><div id="late-coming-bar-all" style="height:305px"></div> </div> </div></div></div>';
		$('#locdividAll').append(htmldataShift);
		//Present Absent For All Shift

		var presentAbsentSettings = {
			"url": baseurl + prefix + "total-absent-present-graph",
			"method": "GET",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken,
				"Content-Type":"application/json"
			},
		};

		$.ajax(presentAbsentSettings).done(function (response) {
			var objJson = response;

			var k = 1;
			if (objJson['category'] == '1') {
				var valueShift = response.ResponseData[0]['TotalWeekData'];
					presentAbsentforAllGraph(valueShift);
			} else {
				alert('Network Error! Please Contact to Backend Team.');
			}

		});

		//Present Absent For All Shift End

		//Late Coming For All Shift

		var lateComingSettings = {
			"url": baseurl + prefix + "total-latecoming-intime-graph",
			"method": "GET",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken,
				"Content-Type":"application/json"
			},
		};

		$.ajax(lateComingSettings).done(function (response) {
			var objJson = response;

			var k = 1;
			if (objJson['category'] == '1') {
				var valueShift = response.ResponseData[0]['TotalWeekData'];
					lateComingforAllGraph(valueShift);
			} else {
				alert('Network Error! Please Contact to Backend Team.');
			}

		});

		//Late Coming For All Shift End
	}

// Present/Absent Graph Preparation
function presentAbsentforAllGraph(valueShift,j)
{
		var chart = c3.generate({
		bindto: '#present-absent-bar-all', // id of chart wrapper
		data: {
			columns: [
				// each columns data
				["data1",
					valueShift[0]['todayPresent'],
					valueShift[1]['todayPresent'],
					valueShift[2]['todayPresent'],
					valueShift[3]['todayPresent'],
					valueShift[4]['todayPresent'],
					valueShift[5]['todayPresent'],
					valueShift[6]['todayPresent']
				],
				["data2",
					valueShift[0]['todayabsent'],
					valueShift[1]['todayabsent'],
					valueShift[2]['todayabsent'],
					valueShift[3]['todayabsent'],
					valueShift[4]['todayabsent'],
					valueShift[5]['todayabsent'],
					valueShift[6]['todayabsent']
				]
			],
			type: 'bar', // default type of chart
			colors: {
				'data1': '#4798e8',
				'data2': '#ef6e6e'
			},
			names: {
				// name of each serie
				'data1': 'Present',
				'data2': 'Absent'
			}
		},
		axis: {
			x: {
				type: 'category',
				// name of each category
				categories: [
					valueShift[0]['date'],
					valueShift[1]['date'],
					valueShift[2]['date'],
					valueShift[3]['date'],
					valueShift[4]['date'],
					valueShift[5]['date'],
					valueShift[6]['date']
				]
			},
		},
		bar: {
			width: 16
		},
		legend: {
			show: true, //hide legend
		},
		padding: {
			bottom: 0,
			top: 0
		},
	});
}
// Present/Absent for All Graph Preparation
// Late Coming for All Graph Preparation
function lateComingforAllGraph(valueShift,k)
{
		var chart = c3.generate({
		bindto: '#late-coming-bar-all', // id of chart wrapper
		data: {
			columns: [
				// each columns data
				["data1",
					valueShift[0]['todayintime'],
					valueShift[1]['todayintime'],
					valueShift[2]['todayintime'],
					valueShift[3]['todayintime'],
					valueShift[4]['todayintime'],
					valueShift[5]['todayintime'],
					valueShift[6]['todayintime']
				],
				["data2",
					valueShift[0]['LateEmployee'],
					valueShift[1]['LateEmployee'],
					valueShift[2]['LateEmployee'],
					valueShift[3]['LateEmployee'],
					valueShift[4]['LateEmployee'],
					valueShift[5]['LateEmployee'],
					valueShift[6]['LateEmployee']
				]
			],
			type: 'bar', // default type of chart
			colors: {
				'data1': '#34738a',
				'data2': '#fed284'
			},
			names: {
				// name of each serie
				'data1': 'Intime',
				'data2': 'Late Coming'
			}
		},
		axis: {
			x: {
				type: 'category',
				// name of each category
				categories: [
					valueShift[0]['date'],
					valueShift[1]['date'],
					valueShift[2]['date'],
					valueShift[3]['date'],
					valueShift[4]['date'],
					valueShift[5]['date'],
					valueShift[6]['date']
				]
			},
		},
		bar: {
			width: 16
		},
		legend: {
			show: true, //hide legend
		},
		padding: {
			bottom: 0,
			top: 0
		},
	});
}
// Late Coming for All Graph Preparation End

// Present/Absent Graph Preparation
function presentAbsentGraph(valueShift,j)
{

		var chart = c3.generate({
		bindto: '#present-absent-bar' + j, // id of chart wrapper
		data: {
			columns: [
				// each columns data
				["data1",
					valueShift['ResponseData'][0]['todayPresent'],
					valueShift['ResponseData'][1]['todayPresent'],
					valueShift['ResponseData'][2]['todayPresent'],
					valueShift['ResponseData'][3]['todayPresent'],
					valueShift['ResponseData'][4]['todayPresent'],
					valueShift['ResponseData'][5]['todayPresent']
				],
				["data2",
					valueShift['ResponseData'][0]['todayabsent'],
					valueShift['ResponseData'][1]['todayabsent'],
					valueShift['ResponseData'][2]['todayabsent'],
					valueShift['ResponseData'][3]['todayabsent'],
					valueShift['ResponseData'][4]['todayabsent'],
					valueShift['ResponseData'][5]['todayabsent']
				]
			],
			type: 'bar', // default type of chart
			colors: {
				'data1': '#4798e8',
				'data2': '#ef6e6e'
			},
			names: {
				// name of each serie
				'data1': 'Present',
				'data2': 'Absent'
			}
		},
		axis: {
			x: {
				type: 'category',
				// name of each category
				categories: [
					valueShift['ResponseData'][0]['date'],
					valueShift['ResponseData'][1]['date'],
					valueShift['ResponseData'][2]['date'],
					valueShift['ResponseData'][3]['date'],
					valueShift['ResponseData'][4]['date'],
					valueShift['ResponseData'][5]['date']
				]
			},
		},
		bar: {
			width: 16
		},
		legend: {
			show: true, //hide legend
		},
		padding: {
			bottom: 0,
			top: 0
		},
	});
}
// Present/Absent Graph Preparation
// Late Coming Graph Preparation
function lateComingGraph(valueShift,k)
{
		var chart = c3.generate({
		bindto: '#late-coming-bar' + k, // id of chart wrapper
		data: {
			columns: [
				// each columns data
				["data1",
					valueShift['ResponseData'][0]['todayintime'],
					valueShift['ResponseData'][1]['todayintime'],
					valueShift['ResponseData'][2]['todayintime'],
					valueShift['ResponseData'][3]['todayintime'],
					valueShift['ResponseData'][4]['todayintime'],
					valueShift['ResponseData'][5]['todayintime']
				],
				["data2",
					valueShift['ResponseData'][0]['LateEmployee'],
					valueShift['ResponseData'][1]['LateEmployee'],
					valueShift['ResponseData'][2]['LateEmployee'],
					valueShift['ResponseData'][3]['LateEmployee'],
					valueShift['ResponseData'][4]['LateEmployee'],
					valueShift['ResponseData'][5]['LateEmployee']
				]
			],
			type: 'bar', // default type of chart
			colors: {
				'data1': '#34738a',
				'data2': '#fed284'
			},
			names: {
				// name of each serie
				'data1': 'Intime',
				'data2': 'Late Coming'
			}
		},
		axis: {
			x: {
				type: 'category',
				// name of each category
				categories: [
					valueShift['ResponseData'][0]['day'],
					valueShift['ResponseData'][1]['day'],
					valueShift['ResponseData'][2]['day'],
					valueShift['ResponseData'][3]['day'],
					valueShift['ResponseData'][4]['day'],
					valueShift['ResponseData'][5]['day']
				]
			},
		},
		bar: {
			width: 16
		},
		legend: {
			show: true, //hide legend
		},
		padding: {
			bottom: 0,
			top: 0
		},
	});
}
// Late Coming Graph Preparation End

	//DashBoard API
	var settings = {
		"url": baseurl + prefix + "dashboard",
		"method": "GET",
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken
		},
	};
	$.ajax(settings).done(function (response) {
		var data = response['ResponseDataA'];
		if (response['category'] == '0') {
			$("#show_error").html(response['message']);
			$("#show_error").show();
		} else {
			var AbsentEmployees       = '<a href="absent.html">' + data['AbsentEmployees']  + '</a>';
			var Latecoming            = '<a href="latecoming.html">' + data['Latecoming'] + '</a>';
			var PresentEmployees      = '<a href="present.html">'  + data['PresentEmployees'] + '</a>';
			var TotalNoOfEmployees    = '<a href="employeelist.html">'  + data['TotalNoOfEmployees'] + '</a>';
			$("#total").html(TotalNoOfEmployees);
			$("#present").html(PresentEmployees);
			$("#absent").html(AbsentEmployees);
			$("#late").html(Latecoming);
		}
	});

	//Shiftwise Total Count
	function getShiftWiseData()
	{
		var shiftWiseSettings = {
		"url": baseurl + prefix + "shift-wise-total-count",
		"method": "GET",
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken
		},
		};

			$.ajax(shiftWiseSettings).done(function (response) {
			var data = response['ResponseData'];
			/*var lateCommingData = response['late_coming'];*/
			if (response['category'] == '0') {
				$("#show_error").html(response['message']);
				$("#show_error").show();
			} else 
			{
			
				$.each(data, function (key, value) 
				{
					var AbsentEmployees       = '<a href="absent.html">' + value['AbsentEmployees']  + '</a>';        
					var PresentEmployees      = '<a href="present.html">'  + value['PresentEmployees'] + '</a>';
					var TotalNoOfEmployees    = '<a href="employeelist.html">'  + value['TotalEmployee'] + '</a>';
					var Latecoming = '<a href="latecoming.html">' + value['LateEmployees'] + '</a>';
					/*if(value['ShiftMasterId'] == 1 || value['ShiftName'] == 'General')
					{
						$("#total").html(TotalNoOfEmployees);
						$("#present").html(PresentEmployees);
						$("#absent").html(AbsentEmployees);
						$("#late").html(Latecoming);
					}
					else
					{*/

						$("#total_"+value['ShiftMasterId']).html(TotalNoOfEmployees);
						$("#present_"+value['ShiftMasterId']).html(PresentEmployees);
						$("#absent_"+value['ShiftMasterId']).html(AbsentEmployees);
						$("#late_"+value['ShiftMasterId']).html(Latecoming);
					/*}*/
					
				});
			}
		});
	}
	
});