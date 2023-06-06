var projectPath         = sessionStorage.getItem('projectPath'),
	baseURL             = sessionStorage.getItem("baseURL"),
	UserType            = sessionStorage.getItem("UserType"),
	LicKey              = sessionStorage.getItem("LicKey"),
    AccessToken         = sessionStorage.getItem("AccessToken"),
    prefix              = sessionStorage.getItem("prefix"),
	endpoint            = "leaves",
	endpointLeaveStatus = "leave-status",
	endpointEmp         = 'employees',
	GroupArr            = '',
	requesturl          = baseURL + prefix + endpoint,
    message             = sessionStorage.getItem('message'),
	category            = sessionStorage.getItem('category');

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
$('document').ready(function () {
	var todayDt = new Date().toISOString().split('T')[0];
	$('#StartDate').attr('min', todayDt);
	var todaylastDt = new Date().toISOString().split('T')[0];
	$('#EndDate').attr('min', todaylastDt);
	var todaylastDt = new Date().toISOString().split('T')[0];
	$('#leaveDate').attr('min', todaylastDt);

	//Listing API
	var settings = {
		"url": requesturl,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settings).done(function (response) {
		if (response['category'] == '1')
		{
			var data = response['ResponseData'].reverse();
			var locdatalength = data.length;
		}
		var tabledata = '<table id="example" class="table table-striped table-bordered display"><thead><tr><th align="center" id="slno">Sl.No.</th><th id="EmployeeName">Employee Name</th><th id="Location">Location</th><th id="LeaveDate">Leave Date</th><th id="LeaveType">Leave Type</th><th id="LeavePurpose">Leave Purpose</th><th id="Status">Status</th><th class="float-right" id="Action">Action</th></tr></thead><tbody>';
		if (locdatalength > 0) {
			var status = '', LeaveType = '', tdaction= '';
			for (var i = 0; i < locdatalength; i++) {
                var slno = i + 1;
                if (data[i]['Status'] == 0){
                    status          = "<td>" + 'Pending' + "</td>";

                    var td_edit     = '<a class="dropdown-item" title="Edit" onclick="editData('+ data[i]["EmployeeLeaveHistoryId"] + ');" data-toggle="modal" data-target="#myModal"><i class="fa fa-pencil m-r-5"></i> '+'Edit'+'</a>';
                    var td_isdelete = '<a  id="deleteId" class="dropdown-item" title="Delete" href="javascript:void(0);" onclick="javascript:confirmDelete(' + data[i]['EmployeeLeaveHistoryId'] + ');" ><i class="fa fa-trash-o m-r-5"></i> '+'Delete'+'</a>';

                    var tdaction    = '<td class="text-right"><div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_edit + td_isdelete +'</div></div></td>';
                }
                else if (data[i]['Status'] == 1) 
                {
                    status     = "<td class='text-success'>" + 'Taken' + "</td>";
                    tdaction   = '<td>'+ " " +'</td>';
                }
                else if (data[i]['Status'] == 2)
                {
                    status     = "<td class='text-danger'>" + 'Cancelled' + "</td>";
                    tdaction   = '<td>'+ " " +'</td>';
                }
                if (data[i]['LeaveType'] == 0)
					LeaveType = 'Unpaid Leave';
				else if (data[i]['LeaveType'] == 1)
					LeaveType = 'Paid Leave';
				else if (data[i]['LeaveType'] == 2)
					LeaveType = 'Tour';

				var td_Data =   "<td>" + slno + "</td>" +
                                "<td>" + data[i]['EmpName'] + "</td>" +
                                "<td>" + data[i]['LocationName'] + "</td>" +
                                "<td>" + dateFormat(data[i]['LeaveDate']) + "</td>" +
                                "<td>" + LeaveType + "</td>" +
                                "<td>" + data[i]['LeavePurpose'] + "</td>" + status + tdaction;
				var createtr  = "<tr>" + td_Data + "</tr>";
				tabledata     = tabledata + createtr;
            }
		} else {
			tabledata += "<tr> <td colspan='8' align='center'><span style='color:red;'><strong>No List Found </strong></span></td></tr>";
        }
        tabledata += '</tbody></table>';
        $("#leaveBodyId").html(tabledata);
		datatableIntialise()
    })
})

//Location DropDown
function locData(locID){
    var settingsloc = {
		"url": baseURL + prefix + "locations",
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settingsloc).done(function (response) {
		var data = response['ResponseData'];
		var GroupArrLoc = '<option value="">' + "Select location" + '</option>';
		for (var j in data) {
            if(locID === data[j]['BaseLocationId'])
            GroupArrLoc = GroupArrLoc + '<option value="' + data[j]['BaseLocationId'] + '" selected="selected">' + data[j]['LocationName'] + '</option>';
            else
            GroupArrLoc = GroupArrLoc + '<option value="' + data[j]['BaseLocationId'] + '">' + data[j]['LocationName'] + '</option>';
		}
		$('#locationFilter').html(GroupArrLoc);
	});
}

//DataTable Initialization
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

//Leave status API
var settingsStatus = {
	"url": baseURL + prefix + endpointLeaveStatus,
	"method": "GET",
	"headers": {
		"AccessToken": AccessToken,
		"LicKey": LicKey,
		"Content-Type": "application/json"
	},
};
$.ajax(settingsStatus).done(function (response) {
	if (response['category'] == '0') {
		$("#show_error").html(response['message']);
		$("#show_error").show();
	} else {
		$("#show_error").html(response['message']);
		$("#show_error").show();
	}

});

//Add Button Click
function addButtonClick(){
    locData();
	$("#form_dt").show();
	$("#to_dt").show();
	$("#singleDt").hide();
	$("#form_dt").val('');
	$("#to_dt").val('');
	$("#submitId").val('Submit');
	$("#submitId").html('Submit');
	$("#mdMitle").text('Add New Leave');
	$('#StartDate').css('border', '1px solid #dee2e6');
	$('#EndDate').css('border', '1px solid #dee2e6');
	$('#leaveTypeList').css('border', '1px solid #dee2e6');
	$('#locationFilter').css('border', '1px solid #dee2e6');
	$('#LeavePurposeText').css('border', '1px solid #dee2e6');
	$('#empList').css('border', '1px solid #dee2e6');
}

//edit button click
function editData(eId){
    $('#empLeaveId').val(eId);
    $("#form_dt").hide();
    $("#to_dt").hide();
	$("#singleDt").show();
	$("#mdMitle").text('Edit Leave Detail');
	$("#submitId").val('Update');
	$("#submitId").html('Update');
	$('#offDate').css('border', '1px solid #dee2e6');
	$('#leaveTypeList').css('border', '1px solid #dee2e6');
	$('#locationFilter').css('border', '1px solid #dee2e6');
	$('#LeavePurposeText').css('border', '1px solid #dee2e6');
	$('#empList').css('border', '1px solid #dee2e6');
	var endpoint = 'leave/'+eId;
	var settings = {
		"url"     : baseURL + prefix + endpoint,
		"method"  : "GET",
		"headers" : {
			"AccessToken" : AccessToken,
			"LicKey"      : LicKey,
			"Content-Type": "application/json"
		},
    };
	$.ajax(settings).done(function (response) {
		var data       = response['ResponseData'];
		var dtpicker   = dateFormat(data[0]['LeaveDate']);
		var vardate    = dtpicker.split("-").reverse().join("-"); 
		$("#leaveDate").val(vardate); 
        $("#LeavePurposeText").val(data[0]['LeavePurpose']);
		$("#leaveTypeList").val(data[0]['LeaveType']);
		locData(data[0]['BaseLocationId']);
		empChoice(data[0]['EmpId'],data[0]['BaseLocationId']);

	})
}

// Add & update API
function SubmitBtn(){
    var empList          = $("#empList").val(),
        empLeaveId       = $('#empLeaveId').val(),
	    StartDate        = $("#StartDate").val(),
	    StartDate        = new Date(StartDate),
	    EndDate          = $("#EndDate").val(),
        EndDate          = new Date(EndDate),
		LeaveDate        = $("#leaveDate").val(),
	    locationFilter   = $("#locationFilter").val(),
	    submitId         = $("#submitId").val(),
	    leaveTypeList    = $("#leaveTypeList").val(),
	    LeavePurposeText = $("#LeavePurposeText").val(),
	    id               = Math.floor((Math.random() * 10) + 1),
		endpoint         = "leave/" + id,
		err_msg          = 0;
		
	if ($('#empList').val() == '') {
		$('#empList').css('border', '1px solid red');
		err_msg = 1;
    }else
        $('#empList').css('border', '1px solid  #dee2e6');
    if ($('#locationFilter').val() == '') {
        $('#locationFilter').css('border', '1px solid red');
        err_msg = 1;
    }else
        $('#locationFilter').css('border', '1px solid  #dee2e6');
    if(submitId == "Submit"){ 
        if ($('#StartDate').val() == '') {
            $('#StartDate').css('border', '1px solid red');
            err_msg = 1;
        }else
        $('#StartDate').css('border', '1px solid #dee2e6');
        if ($('#EndDate').val() == '') {
            $('#EndDate').css('border', '1px solid red');
            err_msg = 1;
        }else
        $('#EndDate').css('border', '1px solid #dee2e6');
    }else if(submitId == "Update"){
        if ($('#leaveDate').val() == '') {
            $('#leaveDate').css('border', '1px solid red');
            err_msg = 1;
        }else
        $('#leaveDate').css('border', '1px solid #dee2e6');
    }
	if ($('#leaveTypeList').val() == '') {
		$('#leaveTypeList').css('border', '1px solid red');
		err_msg = 1;
    }else
        $('#leaveTypeList').css('border', '1px solid #dee2e6');
	if ($('#LeavePurposeText').val() == '') {
		$('#LeavePurposeText').css('border', '1px solid red');
		err_msg = 1;
    }else
        $('#LeavePurposeText').css('border', '1px solid #dee2e6');
	if (err_msg != 0) {
		return false;
	}
	else{
		$('#submitId').attr('type','button');
		if (submitId == 'Submit') {
			if (StartDate <= EndDate) {
				while (StartDate <= EndDate) {
					StartDate = new Date(StartDate);
					var mm = ((StartDate.getMonth() + 1) >= 10) ? (StartDate.getMonth() + 1) : '0' + (StartDate.getMonth() + 1);
					var dd = ((StartDate.getDate()) >= 10) ? (StartDate.getDate()) : '0' + (StartDate.getDate());
					var yyyy = StartDate.getFullYear();
					var date = yyyy + "-" + mm + "-" + dd;
					var StartDate = new Date(StartDate.setDate(StartDate.getDate() + 1));
					var settingsEmp = {
						"url": baseURL + prefix + endpoint,
						"method": "POST",
						"headers": {
							"AccessToken": AccessToken,
							"LicKey": LicKey,
							"Content-Type": "application/json"
						},
						"data": JSON.stringify({
							"EmpId": empList,
							"BaseLocationId": locationFilter,
							"OffDate": date,
							"LeaveType": leaveTypeList,
							"LeavePurpose": LeavePurposeText,
						}),
					};
					$.ajax(settingsEmp).done(function (response) {
						if (response['category'] == '0') {
							$("#show_error1").html(response['message']);
							$("#show_error1").show();
							setTimeout(function () {$("#show_error1").hide();}, 5000);
						} else {
							sessionStorage.setItem('category', response['category']);
							sessionStorage.setItem('message', response['message']);
							window.location.href = (projectPath + "leave.html");
						}
					});
				}
			} else {
				$("#errormessageId").attr('class', 'alert alert-danger text-center')
				$("#errormessageId").show().text('End Date must be greater than or equal to Start Date.');
				setTimeout(function () {
					$("#errormessageId").hide();
				}, 5000);
			}
		}else{
			var endpoint = "leave/"+empLeaveId;
			var settings = {
				"url":  baseURL + prefix + endpoint,
				"method": "PUT",
				"headers": {
					"AccessToken": AccessToken,
					"LicKey": LicKey,
					"Content-Type": "application/json"
				},
				"data": JSON.stringify({
					"EmpId": empList,
					"BaseLocationId": locationFilter,
					"OffDate": LeaveDate,
					"LeaveType": leaveTypeList,
					"LeavePurpose": LeavePurposeText,
				}),
			};
			$.ajax(settings).done(function (response) {
				if (response['category'] == '0') {
					$("#show_error1").html(response['message']);
					$("#show_error1").show();
					setTimeout(function () {$("#show_error1").hide();}, 5000);
				} else {
					sessionStorage.setItem('category', response['category']);
					sessionStorage.setItem('message', response['message']);
					window.location.href = (projectPath + "leave.html");
				}
			})
		}
	}
}

//Delete leave API
function confirmDelete(bId) {
	var endpoint = "leave/",
	requesturlDelete = baseURL + prefix + endpoint + bId;
	var r = confirm("Do you want to delete this leave?");
	if (r == true) {
		var settings = {
			"url"    : requesturlDelete,
			"method" : "DELETE",
			"headers": {
				"AccessToken" : AccessToken,
				"LicKey"      : LicKey,
				"Content-Type": "application/json"
			},
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "leave.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "leave.html");
			}
		});
	}
}

//Date Formate
function dateFormat(data) {
	if (data != '' && data != '0000-00-00' && data != undefined && data != null) {
		var date     = new Date(data);
		var day      = '', month = '', year = ''. fullDate = '';
		var getMonth = date.getMonth() + 1;
		if (date.getDate() <= 9)
			day      = '0' + date.getDate();
		else
			day      = date.getDate();
		if (date.getMonth() + 1 <= 9)
			month    = '0' + getMonth;
		else
			month    = getMonth;
		year         = date.getFullYear();

		fullDate     = day + '-' + month + '-' + year;
		return fullDate;
	}else
		return '';
}

//to get location wise employee list
function empChoice(eId,locFilter) {
	if(locFilter == undefined)
	locFilter = $('#locationFilter').val();
	var settingsEmpp = {
		"url": baseURL + prefix + "get-employee-locationwise/" + locFilter,
		"method": "GET",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settingsEmpp).done(function (response){        
		var data     = response['ResponseData'];
		var GroupArr = '<option value="">' +  "Select Employee" + '</option>';
		for (var j in data) {
            if(eId === data[j]['EmpId']){
            GroupArr = GroupArr + '<option value="' + data[j]['EmpId'] + '" selected="selected">' + data[j]['EmpName'] + " [ " + data[j]['EmpId'] + ' ] </option>';
            }
			GroupArr = GroupArr + '<option value="' + data[j]['EmpId'] + '">' + data[j]['EmpName'] + " [ " + data[j]['EmpId'] + ' ] </option>';
		}
		$('#empList').html(GroupArr);
	});
}
