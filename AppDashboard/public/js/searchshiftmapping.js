var projectPath   = sessionStorage.getItem('projectPath'),
    baseURL       = sessionStorage.getItem("baseURL"),
    prefix        = sessionStorage.getItem("prefix"),
    AccessToken   = sessionStorage.getItem("AccessToken"),
    LicKey        = sessionStorage.getItem('LicKey'),
    EmpIdUser     = sessionStorage.getItem('EmpId'),
    message       = sessionStorage.getItem('message'),
    category      = sessionStorage.getItem('category');

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

var today = new Date().toISOString().split('T')[0];
$("#setdate").attr('min', today);
// Delete API
function confirmForDelete(EmployeeShiftHistoryId) {
	var r = confirm("Are you sure you want to delete the shift?");
	if (r == true) {
		var endpoint = 'assignshift/' + EmployeeShiftHistoryId;
		var requesturl = baseURL + prefix + endpoint;
		var empdeleteshift = {
			"url": requesturl,
			"method": "DELETE",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"Content-Type": "application/json",
				"AccessToken": AccessToken,
			},
			"data": JSON.stringify({
				"Offset": "0"
			}),
		};

		$.ajax(empdeleteshift).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "empshiftmapping.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "empshiftmapping.html");
			}

		});

	}
};

function reInitializeDataTable() {
	$('#example').dataTable().fnDestroy();
    var prevLabel     = "Previous";
    var nextLabel     = "Next";
    var searchLabel   = "Search";
    var excelLabel    = "Excel";
    var pdfLabel      = "Pdf";
    var printLabel    = "Print";
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

function dataSubmit() {
	//get info from input fieldset
	var start_filter    = $('#start_filter').val();
	var end_filter      = $('#end_filter').val();
	var locationFilter  = $('#locationFilter').val();
	var emplist         = $('#emplist').val();
	start_filter        = dateFormat(start_filter);
	end_filter          = dateFormat(end_filter);
	//end
	var endpoint        = "get-employee-shift-mapping";
	var requesturl      = baseURL + prefix + endpoint;
	//var dtData = $("#setdate").val();

	var settingsgetshift = {
		"url": requesturl,
		"method": "POST",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"FromDate": start_filter,
			"ToDate": end_filter,
			"EmpId": emplist
		}),
	};

	$.ajax(settingsgetshift).done(function (response) {
		var data = response['ResponseData'];
		if (response['category'] == '1')
			var locdatalength = data.length;
		var tabledata = '<table id="example" class="table table-striped table-bordered"><thead> <tr><th align="center" id="slno">Sl.No.</th><th align="center" id="shiftDate">Shift Date</th><th id="EmpId">Employee ID</th><th id="EmpName">Employee Name</th><th id="Loc">Location</th><th id="stName">Shift Name</th><th id="StartTime">Start Time</th><th id="EndTime">End Time</th> </tr></thead><tbody>'; 
		if (locdatalength > 0) {
			var i;
			var td = '';
			for (i = 0; i < locdatalength; i++) {
				var v = new Date(data[i]['StartDate']);
				var month = v.getMonth() + 1;
				var day = v.getDate();
				var year = v.getFullYear();
				day = day < 10 ? "0" + day : day;
				month = month < 10 ? "0" + month : month;
				var CreatedDt = day + "-" + month + "-" + year;

				var slno = i + 1;
				var now = new Date();
				var createDate = data[i]['CreatedDate'];
				var slno = td + "<td>" + slno + "</td>";
				var StartDate = "<td>" + CreatedDt + "</td>";
				var EmpId = "<td>" + data[i]['EmpId'] + "</td>";
				var EmpName = "<td>" + data[i]['EmpName'] + "</td>";
				var LocationName = "<td>" + data[i]['LocationName'] + "</td>";
                var shiftname = "<td>" + data[i]['ShiftName'] + "</td>";
                
				// start time
				var timeString = data[i]['StartTime'];
				var H = +timeString.substr(0, 2);
				var h = (H % 12) || 12;
				var ampm = H < 12 ? " AM" : " PM";
				timeString = h + timeString.substr(2, 3) + ampm;
				var FirstTime = "<td>" + timeString + "</td>";
				// end time

				var timeString1 = data[i]['EndTime'];
				var H = +timeString1.substr(0, 2);
				var h = (H % 12) || 12;
				var ampm = H < 12 ? " AM" : " PM";
				timeString1 = h + timeString1.substr(2, 3) + ampm;
				var LastTime = "<td>" + timeString1 + "</td>";
				var editid = data[i]['EmployeeShiftHistoryId'];
				var BaseLocationId = data[i]['BaseLocationId'];
				var empID = data[i]['EmpId'];
				sessionStorage.setItem('empID', empID);
				var callingfun = "javascript:confirmForDelete('" + data[i]['EmployeeShiftHistoryId'] + "')";

                var td_edit = "<a class='btn waves-effect waves-light' href='" + projectPath + "editshiftmapping.html?emp_id=" + editid + "&bId=" + BaseLocationId + "' title='Edit'><i class='fa fa-edit'></i></a>";
                
                var td_isdelete = '<a class="btn waves-effect waves-light" onclick="javascript:confirmForDelete(' + data[i]["EmployeeShiftHistoryId"] + ')" title="Delete"><i class="fa fa-trash-alt"></i></a>';
                
				var tdaction = "<td><div style='display: inline-flex;'>" + td_edit + td_isdelete + "</div></td>";
				if (createDate < now)
					var tdaction = "<td>" + "</td>";
				else
					var tdaction = "<td><div style='display: inline-flex;'>" + td_edit + td_isdelete + "</div></td>";
				var createtr = "<tr>" + slno + StartDate + EmpId + EmpName + LocationName + shiftname + FirstTime + LastTime + "</tr>";
				tabledata = tabledata + createtr;
			}
		} else {
			tabledata += "<tr> <td colspan='9' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr>";
        }
        tabledata     += '</tbody></table>';
		$("#tableData").html(tabledata);
		reInitializeDataTable();
	});
}

// to get location
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
		GroupArrLoc = GroupArrLoc + '<option value="' + data[j]['BaseLocationId'] + '">' + data[j]['LocationName'] + '</option>';
	}
	$('#locationFilter').html(GroupArrLoc);
});

//end 
function locchoice() {
	var selectEmployee = "Select Employee";
	locFilter = $('#locationFilter').val();
	var settingsEmp = {
		"url": baseURL + prefix + "get-employee-locationwise/" + locFilter,
		"method": "GET",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settingsEmp).done(function (response) {
		var data = response['ResponseData'];
		var GroupArrEmp = '<option value="">' + selectEmployee + '</option>';
		for (var j in data) {
			GroupArrEmp = GroupArrEmp + '<option value="' + data[j]['EmpId'] + '">' + data[j]['EmpName'] + '</option>';
		}
		$('#emplist').html(GroupArrEmp);
		$('#allEmpList').show();
	});
}

//Date Formate
function dateFormat(data) {
	if (data        != '' && data != '0000-00-00' && data != undefined && data != null) {
		var date     = new Date(data);
		var day      = '', month = '', year = '', fullDate = '';
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

		fullDate     = year + '-' + month + '-' + day;
		return fullDate;
	} else
		return '';
}