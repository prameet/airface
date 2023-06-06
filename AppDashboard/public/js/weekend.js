const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
];
const d = new Date();
$('.select2').select2();
$("#headerData").html(monthNames[d.getMonth()]);
var projectPath  = sessionStorage.getItem('projectPath'),
    baseURL      = sessionStorage.getItem("baseURL"),
    prefix       = sessionStorage.getItem("prefix"),
    message      = sessionStorage.getItem('message'),
    AccessToken  = sessionStorage.getItem("AccessToken"),
    LicKey       = sessionStorage.getItem('LicKey');
$('#Sshift').append('--Select Shift--');
    
if (message != null) {
	$("#messageId").attr('class', 'alert alert-success')
	$("#messageId").show().text(message);
	setTimeout(function () {
		$("#messageId").hide();
	}, 4000);
	sessionStorage.removeItem('message');
}
$( document ).ready(function() {
	var endpointLoc = "weekend-location";
	var requesturlLoc = baseURL + prefix + endpointLoc;
	var addlocation = {
		"url": requesturlLoc,
		"method": "GET",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken
		},
	};
	
	$.ajax(addlocation).done(function (response) {
		if (response['category'] == '0') {
			$("#show_error").html(response['message']);
			$("#show_error").show();
		} else {
			var data = response['ResponseData'];
			var output = '<option value="" id="selectLoc">Select Location</option>';
			for (i in data) {
				output += '<option value=' + data[i]["BaseLocationId"] + '>' + data[i]["LocationName"] + '</option>';
			}
			document.getElementById('locationList').innerHTML = output;
			$('#selectLoc').html('Select Location');
		}
	});
})

$('body').on('click', 'input[type=checkbox]', function () {
	var elem = $(this);
	var attrName = elem.attr('name');
	var weekDaysName = [];
	weekDaysName.push("Sun_all");
	weekDaysName.push("Mon_all");
	weekDaysName.push("Tue_all");
	weekDaysName.push("Wed_all");
	weekDaysName.push("Thu_all");
	weekDaysName.push("Fri_all");
	weekDaysName.push("Sat_all");
	if (jQuery.inArray(attrName, weekDaysName) === -1) {
		var isChecked = elem.prop('checked');
		elem.closest('div').find('input').each(function () {
			if (isChecked === false) {
				$(this).prop("checked", false);
			}
		})
	}

})
$('body').on('click', '#SunAll, #MonAll, #TueAll, #WedAll, #ThuAll, #FriAll, #SatAll', function () {
	var elem = $(this);
	var elemVal = elem.prop('checked');
	if (elemVal === false) {
		elem.prop("checked", true);
	} else {
		elem.prop("checked", false);
	}
	var elemNewVal = elem.prop('checked');
	elem.closest('div').find('input').each(function () {
		if (elemNewVal === false) {
			$(this).prop("checked", true);
		} else {
			$(this).prop("checked", false);
		}
	})
	elem.prop("disabled", false);
});

document.title = "Weekend Setting";
$('body').on('change', 'select#locationList', function () {
	var elem = $(this);
	var LocId = elem.val();
	var locationId = $('option[value=' + LocId + ']').attr('data-location');
	if (locationId !== '') {
		var endpoint = 'weekend-shift';
		var requesturl = baseURL + prefix + endpoint;
		var addShiftName = {
			"url": requesturl,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"Content-Type": "application/json",
				"AccessToken": AccessToken,
			},
			"data": JSON.stringify({
				"LocationId": LocId
			})
		};
		$.ajax(addShiftName).done(function (response) {
			if (response['category'] == '0') {
				var empshiftName = '<option>--Select Shift--</option>';
				document.getElementById('shiftList').innerHTML = empshiftName;
				$('input[name=shift_start]').val('');
				$('input[name=shift_end]').val('');
				$('input[name=shift_margin]').val('');
				$('input[type=checkbox]').each(function () {
					$(this).prop("checked", false);
				})
				$("#show_error").html(response['message']);
				$("#show_error").show();
			} else {
				$("#shiftList").attr("disabled", false);
				var data = response['ResponseData'];
					var empshiftName = '<option value="">--Select Shift--</option>';
				for (var i in data) {
					empshiftName += '<option value="' + data[i]["ShiftMasterId"] + '">' + data[i]["ShiftName"] + '</option>';
				}
				$('#shiftList').html(empshiftName);
			}
			$('body').on('change', 'select#shiftList', function () {
				var shiftList = $("#shiftList").val();
				var endpointShift = "weekend-shiftdetails";
				var requesturlShift = baseURL + prefix + endpointShift;
				var settings = {
					"url": requesturlShift,
					"method": "POST",
					"timeout": 0,
					"headers": {
						"LicKey": LicKey,
						"Content-Type": "application/json",
						"AccessToken": AccessToken,
					},
					"data": JSON.stringify({
						"ShiftMasterId": shiftList
					})
				};
				$.ajax(settings).done(function (response) {
					var data = response['ResponseData'];
					var cntdatalength = data.length;
					if (cntdatalength > 0) {
						var EmpIdShift = data[0]["EmpId"];
						$('input[name=shift_start]').val(data[0]["StartTime"]);
						$('input[name=shift_end]').val(data[0]["EndTime"]);
						$('input[name=shift_margin]').val(data[0]["ShiftMargin"]);
					}
				});
				var endpointWkdl = 'get-weekends';
				var requesturlWkdl = baseURL + prefix + endpointWkdl;
				var selLocationId = $('#locationList').val();
				var d = new Date();
				var selShiftMonth = d.getMonth() + 1;
				sessionStorage.setItem('selShiftMonth', selShiftMonth);
				$('input[type=checkbox]').prop('checked', false);
				var WeekendDetails = {
					"url": requesturlWkdl,
					"method": "POST",
					"timeout": 0,
					"headers": {
						"LicKey": LicKey,
						"AccessToken": AccessToken,
						"Content-Type": "application/json"
					},
					"data": JSON.stringify({
						"BaseLocationId": selLocationId,
						"ShiftMasterId": shiftList,
						"ShiftMonth": `${selShiftMonth}`
					})
				};
				$.ajax(WeekendDetails).done(function (response) {
					if (response['category'] == '0') {
						$("#show_error").html(response['message']);
						$("#show_error").show();
					} else {
						var data = response['ResponseData'];
						var cntdatalength = data.length;
						if (cntdatalength > 0) {
							var weekEndParameter = ['AllWeek', 'FirstWeek', 'SecondWeek', 'ThirdWeek', 'FourthWeek', 'FifthWeek'];
							$.each(data, function (key, val) {
								var i = 1;
								$.each(weekEndParameter, function (keyp, valp) {
									var daydata = val[valp].replace(/^"(.*)"$/, '$1');
									daydata = daydata.replace('"', "");
									daydata = $.trim(daydata);
									if (daydata == 'on') {
										if (i == 1) {
											$('input[name=' + val["DayName"] + '_all]').prop('checked', true);
										} else {
											var j = i - 1;
											$('input[name=' + val["DayName"] + j + ']').prop('checked', true);
										}
									}
									i++;
								});
							});
						} else {
							$('input[type=checkbox]').prop('checked', false);
						}
					}
				});
			});

		})
	}
});

function saveWeekEnd() {
	var shiftList       = $("#shiftList").val();
	var LocId           = $('select[name=location_id] option').filter(':selected').val();
	var ShiftId         = $('select[name=shift_id] option').filter(':selected').val();
	var startTime       = $('input[name=shift_start]').val();
	var endTime         = $('input[name=shift_end]').val();
	var shiftMargin     = $('input[name=shift_margin]').val();
	var shiftMsId       = sessionStorage.getItem('shiftMId');
	var shiftMonth      = sessionStorage.getItem('selShiftMonth');
	var ShiftId         = $('select[name=shift_id] option').filter(':selected').val();
	var startTime       = $('input[name=shift_start]').val();
	var endTime         = $('input[name=shift_end]').val();
	var shiftMargin     = $('input[name=shift_margin]').val();
	var endpoint        = "weekends";
	var weekArray       = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
	var weekNumberArray = ['all', '1', '2', '3', '4', '5'];
	var Sun = "";
	var Mon = "";
	var Tue = "";
	var Wed = "";
	var Thu = "";
	var Fri = "";
	var Sat = "";
	for (var i = 1; i < 7; i++) {
		if (i == 1) {
			var inputSun = $('input[name="Sun_all"]').prop('checked');
			var inputMon = $('input[name="Mon_all"]').prop('checked');
			var inputTue = $('input[name="Tue_all"]').prop('checked');
			var inputWed = $('input[name="Wed_all"]').prop('checked');
			var inputThu = $('input[name="Thu_all"]').prop('checked');
			var inputFri = $('input[name="Fri_all"]').prop('checked');
			var inputSat = $('input[name="Sat_all"]').prop('checked');
			if (inputSun === true) {
				Sun = 'on';
			} else {
				Sun = 'off';
			}
			if (inputMon === true) {
				Mon = 'on';
			} else {
				Mon = 'off';
			}
			if (inputTue === true) {
				Tue = 'on';
			} else {
				Tue = 'off';
			}
			if (inputWed === true) {
				Wed = 'on';
			} else {
				Wed = 'off';
			}
			if (inputThu === true) {
				Thu = 'on';
			} else {
				Thu = 'off';
			}
			if (inputFri === true) {
				Fri = 'on';
			} else {
				Fri = 'off';
			}
			if (inputSat === true) {
				Sat = 'on';
			} else {
				Sat = 'off';
			}
		} else if (i == 6) {
			var j = i - 1;
			var inputSun = $('input[name="Sun' + j + '"]').prop('checked');
			var inputMon = $('input[name="Mon' + j + '"]').prop('checked');
			var inputTue = $('input[name="Tue' + j + '"]').prop('checked');
			var inputWed = $('input[name="Wed' + j + '"]').prop('checked');
			var inputThu = $('input[name="Thu' + j + '"]').prop('checked');
			var inputFri = $('input[name="Fri' + j + '"]').prop('checked');
			var inputSat = $('input[name="Sat' + j + '"]').prop('checked');
			if (inputSun === true) {
				Sun += ',on';
			} else {
				Sun += ',off';
			}
			if (inputMon === true) {
				Mon += ',on';
			} else {
				Mon += ',off';
			}
			if (inputTue === true) {
				Tue += ',on';
			} else {
				Tue += ',off';
			}
			if (inputWed === true) {
				Wed += ',on';
			} else {
				Wed += ',off';
			}
			if (inputThu === true) {
				Thu += ',on';
			} else {
				Thu += ',off';
			}
			if (inputFri === true) {
				Fri += ',on';
			} else {
				Fri += ',off';
			}
			if (inputSat === true) {
				Sat += ',on';
			} else {
				Sat += ',off';
			}
		} else {
			var j = i - 1;
			var inputSun = $('input[name="Sun' + j + '"]').prop('checked');
			var inputMon = $('input[name="Mon' + j + '"]').prop('checked');
			var inputTue = $('input[name="Tue' + j + '"]').prop('checked');
			var inputWed = $('input[name="Wed' + j + '"]').prop('checked');
			var inputThu = $('input[name="Thu' + j + '"]').prop('checked');
			var inputFri = $('input[name="Fri' + j + '"]').prop('checked');
			var inputSat = $('input[name="Sat' + j + '"]').prop('checked');
			if (inputSun === true) {
				Sun += ',on';
			} else {
				Sun += ',off';
			}
			if (inputMon === true) {
				Mon += ',on';
			} else {
				Mon += ',off';
			}
			if (inputTue === true) {
				Tue += ',on';
			} else {
				Tue += ',off';
			}
			if (inputWed === true) {
				Wed += ',on';
			} else {
				Wed += ',off';
			}
			if (inputThu === true) {
				Thu += ',on';
			} else {
				Thu += ',off';
			}
			if (inputFri === true) {
				Fri += ',on';
			} else {
				Fri += ',off';
			}
			if (inputSat === true) {
				Sat += ',on';
			} else {
				Sat += ',off';
			}
		}
	}
	var endpointWk   = 'weekends';
	var requesturlWk = baseURL + prefix + endpointWk;
	var err_msg      = 0;
	if ($('#shiftList').val() == '') {
		$('#shiftList').prop('required', true);
		//$('#shiftList').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#shiftList').css('border', '1px solid #dee2e6');
	if ($('#LocId').val() == '') {
		$('#LocId').prop('required', true);
		//$('#LocId').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#LocId').css('border', '1px solid #dee2e6');
	if (err_msg > 0) {
		return false;
	}
	$('#save').attr('type', 'button');
	if (shiftList != '' && LocId != '') {
		var weekendSave = {
			"url": requesturlWk,   
			"method": "POST",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"Content-Type": "application/json",
				"AccessToken": AccessToken,
			},
			"data": JSON.stringify({
				"BaseLocationId": LocId,
				"ShiftMasterId": shiftList,
				"ShiftMonth": shiftMonth,
				"Sun": Sun,
				"Mon": Mon,
				"Tue": Tue,
				"Wed": Wed,
				"Thu": Thu,
				"Fri": Fri,
				"Sat": Sat
			})
		};
		$.ajax(weekendSave).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "weekend.html");
			} else {
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "weekend.html");
			}
		});
	}
}