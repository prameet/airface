var projectPath = sessionStorage.getItem('projectPath'),
	baseURL = sessionStorage.getItem("baseURL"),
	prefix = sessionStorage.getItem("prefix"),
	message = sessionStorage.getItem('message'),
	category = sessionStorage.getItem('category'),
	AccessToken = sessionStorage.getItem("AccessToken"),
	LicKey = sessionStorage.getItem('LicKey');

$(document).ready(function () {
	// Edit Shift
	var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('='),
		shiftId = sURLVariables[1],
		endpoint = 'shift/' + shiftId,
		requesturl = baseURL + prefix + endpoint;

	var gettingshift = {
		"url": requesturl,
		"method": "GET",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"Content-Type": "application/json",
			"AccessToken": AccessToken,
		}
	};
	$.ajax(gettingshift).done(function (response) {
		if (response['category'] == '0') {
			$("#show_error").html(response['message']);
			$("#show_error").show();
		} else {
			var data = response['ResponseData'];
			$('input[name=shift_name]').val(data[0]['ShiftName']);
			$('input[name=shift_margin]').val(timeformat(data[0]['ShiftMargin']));
			$('input[name=start_time]').val(timeformat(data[0]['StartTime']));
			$('input[name=end_time]').val(timeformat(data[0]['EndTime']));
			$("#editShiftN").val(data[0]['ShiftName']);
			// Api for Location 
			var endpoint = "locations";
			var requesturl = baseURL + prefix + endpoint;
			var addlocation = {
				"url": requesturl,
				"async": true,
				"crossDomain": true,
				"method": "POST",
				"timeout": 0,
				"headers": {
					"LicKey": LicKey,
					"Content-Type": "application/json",
					"AccessToken": AccessToken,
				}
			};
			$.ajax(addlocation).done(function (response) {
				if (response['category'] == '0') {
					$("#show_error").html(response['message']);
					$("#show_error").show();
				} else {
					var data1 = response['ResponseData'];
					if (langName === 'En')
						var output = ' <option value = ""id = "selectLoc" > Select Location < /option>';
					else if (langName === 'Sp')
						var output = ' <option value = ""id = "selectLoc" > Seleccionar ubicación < option>';
					for (i in data1) {
						if (data1[i]["BaseLocationId"] === data[0]["BaseLocationId"]) {
							output += ' <option value = ' + data1[i]["BaseLocationId"] + 'selected = "selected" > ' + data1[i]["LocationName"] + ' < /option>';
						} else {
							output += ' <option value = ' + data1[i]["BaseLocationId"] + ' > ' + data1[i["LocationName"] + ' < /option>';
						}
					}
					$('#locationList').html(output);
				}
			});
		}

		function timeformat(time) {
			var arr = time.split(':');
			var hour = $.trim(arr[0]);
			var min = $.trim(arr[1]);
			var TimeFormate = hour + ":" + min;
			return TimeFormate;
		}
	});
	$('#title').html('Edit Shift');
	$('#absService').html('3SD Solutions Pvt');
	$('#profile').html('My Profile');
	$('#pswd').html('Change Password');
	$('#logout').html('Logout');
	$('#absS').html('3SD Solutions Pvt');
	$('#dashboard').html('Dashboard');
	$('#Service').html('3SD Solutions Pvt');
	$('#absFooter').text('© 2020. 3SD Solutions Pvt. Ltd. All right reserved');

	$('#sName').html('Shift Name');
	$('#sStart').html('Start Time:');
	$('#endShift').html('End Time');
	$('#sMargin').html('Shift Margin');
	$('#Loc').html('Location:');
	$('#cancel').html('Cancel');
	$('#edShift').html('Edit Shift');
	$('#shift').html('Shift');
	$('#update').attr("value", "Update");
	$('#update').text("Update");

	// </a>Api call for updateShift form
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('=');
	var shiftId = sURLVariables[1];

	function updateBtn() {
		var shiftName = $('input[name=shift_name]').val();
		startTime = $('input[name=start_time]').val(),
			startTimeData = startTime + ":00",
			endTime = $('input[name=end_time]').val(),
			ShiftMargin = $('input[name=shift_margin]').val(),
			ShiftMarginData = ShiftMargin + ":00",
			baseLocationId = $('select[name=location_id] option').filter(':selected').val(),
			endTime1 = endTime + ":" + "00",
			endTimeData = endTime + ":00",
			startTime1 = startTime + ":" + "00",
			ShiftMargin1 = ShiftMargin + ":" + "00",
			endpoint = 'shift/' + shiftId,
			requesturl = baseURL + prefix + endpoint;
		var err_msg = 0;
		if ($('input[name=shift_name]').val() == '') {
			$('input[name=shift_name]').prop('required', true);
			err_msg = 1;
		}
		if ($('input[name=start_time]').val() == '') {
			$('input[name=start_time]').prop('required', true);
			err_msg = 1;
		}
		if ($('input[name=end_time]').val() == '') {
			$('input[name=end_time]').prop('required', true);
			err_msg = 1;
		}
		if ($('input[name=shift_margin]').val() == '') {
			$('input[name=shift_margin]').prop('required', true);
			err_msg = 1;
		}
		if ($("#locationList").val() == '') {
			$('#locationList').prop('required', true);
			err_msg = 1;
		}
		if (err_msg > 0) {
			return false;
		}
		var err = 0;
		var succ = 0;
		var errMessage = "";
		$('#update').attr('type', 'button');
		if (startTimeData <= ShiftMarginData && ShiftMarginData <= endTimeData) {
			var succ = 1;
		} else {
			if (startTimeData >= "12:00:00" && ShiftMarginData >= "12:00:00") {
				if (startTimeData > ShiftMarginData) {
					err = err + 1;
					errMessage = 'Shift Margin Time Should be greater than Start Time.';
				}
			} else if (endTimeData <= "12:00:00" && ShiftMarginData <= "12:00:00") {
				if (ShiftMarginData > endTimeData) {
					err = err + 1;
					errMessage = 'Shift Margin Time Should be less than End Time.';
				}
			} else {
				err = err + 1;
				errMessage = 'Shift margin should be between Shift Start Time and Shift End Time';
			}
			if (err > 0) {
				$("#messageId").attr('class', 'alert alert-danger text-center');
				$("#messageId").show().text(errMessage);
				setTimeout(function () {
					$("#messageId").hide();
				}, 7000);
			} else {
				var succ = 1;
			}
		}
		if (succ == 1) {
			//Day Shift
			if (shiftName != '' && startTime != '' && endTime != '' && ShiftMargin != '' && baseLocationId != '') {
				var updateshiftcall = {
					"url": requesturl,
					"method": "PUT",
					"timeout": 0,
					"headers": {
						"LicKey": LicKey,
						"Content-Type": "application/json",
						"AccessToken": AccessToken,
					},
					"data": JSON.stringify({
						"BaseLocationId": baseLocationId,
						"ShiftName": shiftName,
						"ShiftMargin": ShiftMargin1,
						"StartTime": startTime1,
						"EndTime": endTime1
					}),
				};
				$.ajax(updateshiftcall).done(function (response) {
					if (response['category'] == '0') {
						$("#messageId").attr('class', 'alert alert-danger text-center')
						$("#messageId").show().text(response['message']);
						setTimeout(function () {
							$("#messageId").hide();
						}, 4000);
					} else {
						sessionStorage.setItem('category', response['category']);
						sessionStorage.setItem('message', response['message']);
						window.location.href = (projectPath + "shift.html");
					}
				})
			}
		}
	}