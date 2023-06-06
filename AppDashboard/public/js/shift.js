var projectPath    = sessionStorage.getItem('projectPath'),
baseURL            = sessionStorage.getItem("baseURL"),
prefix             = "api/v1/";
message            = sessionStorage.getItem('message'),
category           = sessionStorage.getItem('category'),
AccessToken        = sessionStorage.getItem("AccessToken"),
LicKey             = sessionStorage.getItem('LicKey');

if (message != null) {
	if (category == 1)
		$("#messageId").attr('class', 'alert alert-success text-center')
	else
		$("#messageId").attr('class', 'alert alert-danger text-center')
	$("#messageId").show().text(message);
	setTimeout(function () {
		$("#messageId").hide();
	}, 4000);
	sessionStorage.removeItem('message');
	sessionStorage.removeItem('category');
}


$(document).ready(function () {
	// listing the data      
	var endpoint = "shifts";
	var requesturl = baseURL + prefix + endpoint;
	var settings = {
		"url": requesturl,
		"method": "POST",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"Content-Type": "application/json",
			"AccessToken": AccessToken,
		},
	};
	$.ajax(settings).done(function (response) {
   		if (response['category'] == '0') {
			$("#show_error").html(response['message']);
			$("#show_error").show();
		} else {
			var data = response['ResponseData'];
			var cntdatalength = data.length;
			if (cntdatalength > 0) {
				var i;
				var tabledata = ' <table id="example" class="table table-striped table-bordered"><thead><tr><th>Sl.No.</th><th id="sName">Shift Name</th><th id="sTime">Shift Start Time</th><th id="eTime">Shift End Time</th><th id="sLen">Shift Length</th><th id="sMargin">Shift Margin</th><th id="sLoc">Location</th><th id="act">Action</th></tr></thead><tbody>';
				for (i = 0; i < cntdatalength; i++) {
                    var hash = i + 1;
					var shiftStart = data[i]['StartTime'];
                    var shiftEnd = data[i]['EndTime'];
                    var td_privilege = "<a class='btn text-primary waves-effect waves-light' href='" + projectPath + "user_privilege?ShiftName=" + data[i]['ShiftName'] + "' title='privilege'><i class='fa fa-universal-access'></i></a>";
                    
                    var td_edit      = "<a data-toggle='modal' data-target='#myModal' class='dropdown-item' title='Edit' onclick='editData("+ data[i]['ShiftMasterId'] + ");'><i class='fa fa-pencil m-r-5'></i>"+'Edit'+"</a>";
                    var td_isdelete  = '<a class="dropdown-item" onclick="javascript:confirmForDelete(' + data[i]["ShiftMasterId"] + ')" title="Delete"><i class="fa fa-trash-o m-r-5"></i>'+"Delete"+'</a>';
                    var tdaction     = '<td class="text-right"><div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_edit + td_isdelete +'</div></div></td>';
					var td_Data = "<td>" + hash + "</td>" 
					            +   "<td>" + data[i]['ShiftName']    + "</td>"
					            +   "<td>" + data[i]['StartTime']    + "</td>"
                                +   "<td>" + data[i]['EndTime']      + "</td>"
                                +   "<td>" + data[i]['ShiftLength']  + "</td>"
                                +   "<td>" + data[i]['ShiftMargin']  + ' mins' + "</td>"
                                +   "<td>" + data[i]['LocationName'] + "</td>";
                                
					var createtr = "<tr>" + td_Data + tdaction + "</tr>";
					tabledata = tabledata + createtr;
				}
			}else 
			tabledata += "<tr> <td colspan='8' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr>";
			tabledata += '</tbody></table>';
			$("#list_data").html(tabledata);
			datatableIntialise()
		}

	});
})

//Location data
function locData(lId){
	var endpoint = "locations";
	var requesturl = baseURL + prefix + endpoint;
	var addlocation = {
		"url": requesturl,
		"method": "POST",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"Content-Type": "application/json",
			"AccessToken": AccessToken,
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
				if(lId === data[i]["BaseLocationId"])
				output += '<option value=' + data[i]["BaseLocationId"] + ' selected="selected">' + data[i]["LocationName"] + '</option>';
				else
				output += '<option value=' + data[i]["BaseLocationId"] + '>' + data[i]["LocationName"] + '</option>';
			}
			$('#empList').html(output);
			$('#selectLoc').html('Select Location');
		}
	});
}

//Datatable Intialization
function datatableIntialise() {
    var prevLabel = "Previous";
    var nextLabel = "Next";
    var searchLabel = "Search";
    var excelLabel = "Excel";
    var pdfLabel = "Pdf";
    var printLabel = "Print";
    var datatableInfo = "Showing _START_ to _END_ of _TOTAL_ entries";
	$('#example').DataTable({
		dom: 'Bfrtip',
		buttons: [
			{ extend: 'excel', text: excelLabel },
			{ extend: 'pdf', text: pdfLabel },
			{ extend: 'print', text: printLabel }
		],
		lengthMenu: [[10, -1], [10, "All"]],
		language: {
			paginate: {
				previous: prevLabel,
				next:     nextLabel
			},
			aria: {
				paginate: {
					previous: 'Previous',
					next:     'Next'
				}
			},
			search: searchLabel,
			info: datatableInfo
		}
	});
}

// api call for Locations
$('body').on('click', '.close', function () {
	$('#myModal').toggleClass('show');
	$('#myModal').css({
		"display": "none"
	});
})
$('body').on('click', '#close', function () {
	$('#myModal').toggleClass('show');
	$('#myModal').css({
		"display": "none"
	});
})

//Delete shift API
function confirmForDelete(ShiftMasterId) {
	var r = confirm("Do you want to delete this shift?");
	if (r == true) {
		var endpoint = 'shift/' + ShiftMasterId;
		var requesturl = baseURL + prefix + endpoint;
		var deleteShift = {
			"url": requesturl,
			"method": "DELETE",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"Content-Type": "application/json",
				"AccessToken": AccessToken,
			},
		};
		$.ajax(deleteShift).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "shift.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "shift.html");
			}
		});
	}
}
function chkShift() {
	var shiftName = $('input[name=shift_name]').val();
	var RegExpression = /^[a-zA-Z_ ]*$/;
	if (!RegExpression.test(shiftName)) {
		$('#sNamePh').val("");
	} else
		$("#sNamePh").css('border', '1px solid #e9ecef');
}

//Add Button Click
function addButtonClick(){
	locData();
	$("#sNamePh").val('');
	$("#enterTime").val('');
	$("#end_time").val('');
	$("#shift_margin").val('');
	$("#empList").val('');
	$('#shiftId').text("Add New Shift");
	$("#btnSubmit").val('Submit');
	$('#sNamePh').css('border', '1px solid #dee2e6');
	$('#enterTime').css('border', '1px solid #dee2e6');
	$('#end_time').css('border', '1px solid #dee2e6');
	$('#shift_margin').css('border', '1px solid #dee2e6');
	$('#empList').css('border', '1px solid #dee2e6');
}

//edit button click
function editData(shiftId){
	$('#shiftId').text("Edit Shift Details");
	$("#btnSubmit").val('Update');
	$('#sNamePh').css('border', '1px solid #dee2e6');
	$('#enterTime').css('border', '1px solid #dee2e6');
	$('#end_time').css('border', '1px solid #dee2e6');
	$('#shift_margin').css('border', '1px solid #dee2e6');
	$('#empList').css('border', '1px solid #dee2e6');
	var endpoint = 'shift/'+shiftId; 
	var gettingshift = {
		"url": baseURL + prefix + endpoint,
		"method": "GET",
		"timeout": 0,
		"headers": {
		"LicKey": LicKey,
		"Content-Type": "application/json",
		"AccessToken": AccessToken,
		}
	};
	$.ajax(gettingshift).done(function (response) 
	{      
		var data = response['ResponseData'];					               
		$('#sNamePh').val(data[0]['ShiftName']);
		$('#shift_margin').val(timeformat(data[0]['ShiftMargin']));
		$('#enterTime').val(timeformat(data[0]['StartTime']));
		$('#end_time').val(timeformat(data[0]['EndTime']));
		$('#ShiftUpdateId').val(data[0]['ShiftMasterId']);
		locData(data[0]['BaseLocationId']);

	})					
}

//Time Formate
function timeformat(time)
{
	var arr = time.split(':');
	var hour = $.trim(arr[0]) ;
	var min = $.trim(arr[1]);
	var TimeFormate = hour+":"+min;
	return TimeFormate;
}			

//Add and update API
$("#btnSubmit").click(function(e){
	e.preventDefault()
	var shiftName       = $('#sNamePh').val(),
	    startTime       = $('#enterTime').val(),
	    startTimeData   = startTime + ":00",
	    endTime         = $('#end_time').val(),
	    endTimeData     = endTime + ":00",
	    ShiftMargin     = $('#shift_margin').val(),
		ShiftMarginData = ShiftMargin + ":00",
		btnSubmit       = $('#btnSubmit').val(),
	    baseLocationId  = $('select[name=location_id] option').filter(':selected').val()
	    endpoint        = "shift/98",
	    requesturl      = baseURL + prefix + endpoint;
	var err_msg = 0;
	if ($('#shift_margin').val() == '') {
		$('#shift_margin').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#shift_margin').css('border', '1px solid #dee2e6');
	if ($('#sNamePh').val() == '') {
		$('#sNamePh').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#sNamePh').css('border', '1px solid #dee2e6');
	if ($('#enterTime').val() == '') {
		$('#enterTime').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#enterTime').css('border', '1px solid #dee2e6');
	if ($('#end_time').val() == '') {
		$('#end_time').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#end_time').css('border', '1px solid #dee2e6');
	if ($('#empList').val() == '') {
		$('#empList').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#empList').css('border', '1px solid #dee2e6');
	if (err_msg > 0) {
		return false;
	}
	var err = 0;
	var succ = 0;
	var errMessage = "";
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
			$("#errormessageId").attr('class', 'alert alert-danger text-center');
			$("#errormessageId").show().text(errMessage);
			setTimeout(function () {
				$("#errormessageId").hide();
			}, 7000);

		} else {
			var succ = 1;
		}
	}
	if (succ == 1) {
		//Day Shift
		if (btnSubmit == "Submit") {
			var addshiftcall = {
				"url": requesturl,
				"method": "POST",
				"timeout": 0,
				"headers": {
					"LicKey": LicKey,
					"Content-Type": "application/json",
					"AccessToken": AccessToken,
				},
				"data": JSON.stringify({
					"BaseLocationId": baseLocationId,
					"ShiftName": shiftName,
					"ShiftMargin": ShiftMargin,
					"StartTime": startTimeData,
					"EndTime": endTimeData
				}),
			};
			$.ajax(addshiftcall).done(function (response) {
				if (response['category'] == '0') {
					$("#errormessageId").attr('class', 'alert alert-danger text-center')
					$("#errormessageId").show().text(response['message']);
					setTimeout(function () {
						$("#errormessageId").hide();
					}, 7000);
				} else {
					sessionStorage.setItem('category', response['category']);
					sessionStorage.setItem('message', response['message']);
					window.location.href = (projectPath + "shift.html");
				}
			})
		}else{
			var sId = $('#ShiftUpdateId').val();
			var endpoint = "shift/"+sId;
			var addshiftcall = {
				"url":  baseURL + prefix + endpoint,
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
					"ShiftMargin": ShiftMargin,
					"StartTime": startTimeData,
					"EndTime": endTimeData
				}),
			};
			$.ajax(addshiftcall).done(function (response) {
				if (response['category'] == '0') {
					$("#errormessageId").attr('class', 'alert alert-danger text-center')
					$("#errormessageId").show().text(response['message']);
					setTimeout(function () {
						$("#errormessageId").hide();
					}, 7000);
				} else {
					sessionStorage.setItem('category', response['category']);
					sessionStorage.setItem('message', response['message']);
					window.location.href = (projectPath + "shift.html");
				}
			})
        }
	}
})