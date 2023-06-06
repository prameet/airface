var projectPath    = sessionStorage.getItem('projectPath'),
    baseURL        = sessionStorage.getItem("baseURL"),
    prefix         = sessionStorage.getItem("prefix"),
    AccessToken    = sessionStorage.getItem("AccessToken"),
    LicKey         = sessionStorage.getItem('LicKey'),
    message        = sessionStorage.getItem('message'),
    category       = sessionStorage.getItem('category'),
    companyNameData = sessionStorage.getItem('OrganizationName');
    $('#title').html(companyNameData +"_"+"User Report");
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

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var current_date   = new Date();
var current_month  = current_date.getMonth();
var current_year   = current_date.getFullYear();
var GroupArr       = '<option value="">' + "Select Year" + '</option>';

for (var i = current_year - 2; i < current_year + 1; i++) {
	if (i == current_year)
		GroupArr = GroupArr + '<option value="' + i + '" selected="selected">' + i + '</option>';
	else
		GroupArr = GroupArr + '<option value="' + i + '">' + i + '</option>';
}
$('#yearFilter').html(GroupArr);

var month         = monthNames.length;
var GroupArrMnt   = '<option value="">' + "Select Month" + '</option>';
for (var i = 0; i < month; i++) {
	if (i == current_month)
		GroupArrMnt = GroupArrMnt + '<option value="' + i + '" selected="selected">' + monthNames[i] + '</option>';
	else 
		GroupArrMnt = GroupArrMnt + '<option value="' + i + '">' + monthNames[i] + '</option>';
}
$('#monthFilter').html(GroupArrMnt);

//to get employee list

	
	var settingsEmp = {
		"url": baseURL + prefix + "allemployees",
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settingsEmp).done(function (response) {
		var data = response['ResponseData'];
		var GroupArrEmp = '<option value="">' + "Select Employee" + '</option>';
		for (var j in data) {
			GroupArrEmp = GroupArrEmp + '<option value="' + data[j]['EmpId'] + '">' + data[j]['EmpName'] + '</option>';
		}
		$('#emplist').html(GroupArrEmp);
	});


//to get blank employee list
var GroupArrEmp = '<option value="">' + "Select Employee" + '</option>';
$('#emplist').html(GroupArrEmp);

function appendLeadingZeroes(n) {
	if (n <= 9) {
		return "0" + n;
	}
	return n
}

function dataSubmit() {
	var monthFilter   = $('#monthFilter').val();
	var yearFilter    = $('#yearFilter').val();
	var monthData     = parseInt(monthFilter) + 1;
	var strMonth      = monthData.toString();
	var monthstring = appendLeadingZeroes(strMonth);
	
	var emplist       = $('#emplist').val();
	$('#title').html(companyNameData +"_"+"User_Report_"+(parseInt(monthFilter)+1)+'-'+yearFilter+'-'+'Emp_Id_'+emplist);
	var endUserReport = 'user-report';
	if (monthData    != '' && emplist != '') {
		var settingsUreport = {
			"url": baseURL + prefix + endUserReport,
			"method": "POST",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({"EmpId": emplist,"SearchMonth": monthstring,"SearchYear": yearFilter}),
		};
		$.ajax(settingsUreport).done(function (response) {
			var dataUser = response['ResponseData'];
			var cntreportlist = dataUser.length;
			 var tabledata = '<table id="example" class="table table-striped table-bordered"><thead><tr><th align="center" id="slNoTitle" >Sl.No.</th><th align="center" id="dateTitle">Date</th><th align="center" id="firstSeenTitle">First Seen</th><th align="center" id="lastSeenTitle">Last Seen</th><th align="center" id="totalHoursTitle">Total Hours</th><th align="center" id="overtimeTitle">Overtime/Deviation</th><th align="center" id="shiftTitle">Shift</th><th align="center" id="statusTitle">Status</th><th align="center" id="viewTitle">View</th></tr></thead><tbody>';
			if (cntreportlist > 0) {
				for (x = 0; x < cntreportlist; x++) {
					var showDate = "", FirstSeen = '--', LastSeen = '--', TotalHours = '', Overtime = '', ShiftName = '--', Status = '--', View = '--', StatusText = '',  ViewText = '', rowno = x + 1, SlNo = rowno;
									
									if(dataUser[x]['FirstSeen'] == "N/A") { var FirstSeenShow = "----"; } else {
										var FirstSeen = new Date(dataUser[x]['FirstSeen']), FirstSeenhr  =  FirstSeen.getHours(), FirstSeenmin =  FirstSeen.getMinutes(), FirstSeenmin =  FirstSeen.getSeconds();
										FirstSeen_hr = (FirstSeenhr<10?'0':'') + FirstSeenhr;
										FirstSeen_min = (FirstSeenmin<10?'0':'') + FirstSeenmin;
										FirstSeen_sec=(FirstSeenmin<10?'0':'') + FirstSeenmin;
										var FirstSeenShow = FirstSeen_hr+":"+FirstSeen_min+":"+FirstSeen_sec;
									}
									if(dataUser[x]['LastSeen'] == "N/A") { var LastSeenShow = "----"; } else {
										var LastSeen = new Date(dataUser[x]['LastSeen']), LastSeenhr  =  LastSeen.getHours(), LastSeenmin =  LastSeen.getMinutes(),LastSeensec =  LastSeen.getSeconds();
										LastSeen_hr = (LastSeenhr<10?'0':'') + LastSeenhr;
										LastSeen_min = (LastSeenmin<10?'0':'') + LastSeenmin;
										LastSeen_sec=(LastSeensec<10?'0':'') + LastSeensec;
										var LastSeenShow = LastSeen_hr+":"+LastSeen_min+":"+LastSeen_sec;
									}
									var EmpId = dataUser[x]['EmpId'], showDate = dataUser[x]['ADDate'], FirstSeen = FirstSeenShow, LastSeen = LastSeenShow, TotalHours = dataUser[x]['TotalHours'], Overtimetxt = dataUser[x]['TimeDifference'];
									if(Overtimetxt == '00:00:00') { var Overtimetxt = "<span class='text-danger'>"+dataUser[x]['TimeDifference']+"</span>";  } else {
									var Overtimetxt = "<span class='text-success'>"+dataUser[x]['TimeDifference']+"</span>"; }
									var varshowattendanceinfo = "'"+showDate+"','"+EmpId+"'";
									
									if(dataUser[x]['Status'] != "N/A")
									{
										Status = dataUser[x]['Status'];
										if(Status == 'Absent' || Status == 'Leave' || Status == 'CompOff Leave')
										{
											var varStatus     = "<td class='bg-danger text-white'>" + Status+ "</td>";
										}
										else if(Status == 'Weekend' || Status == 'Holiday')
										{
											var varStatus     = "<td class='bg-secondary text-whites'>" + Status+ "</td>";
										}
										else if(Status == 'Present')
										{
											var varStatus     = "<td class='bg-success text-white'>" + Status+ "</td>";
										}
									}
									else {
										var varStatus     = "<td class='bg-danger text-white'>--</td>";
									}
									if(dataUser[x]['ShiftName'] != "N/A") { ShiftName = dataUser[x]['ShiftName']; }
									if(dataUser[x]['IsView'] == '1')
									{
										var ViewText = '<td class="date-view text-center" onClick="showattendanceinfo('+varshowattendanceinfo+');" day="'+rowno+'" date="'+showDate+'" emp-id="'+EmpId+'" month="'+monthFilter+'"><i class="fa fa-eye"></i></td>';
									}
									else{
										var ViewText = '<td class="date-view text-center"><i class="fa fa-eye-slash"></i></td>';
									}
									var varSlNo = "<td>" + SlNo + "</td>";
									let current_datetime = new Date(showDate)
									let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
									var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
									var d = new Date(showDate);
									var dayName = days[d.getDay()];
									<!-- console.log(formatted_date) -->
			
									var varshowDate = "<td>" + dayName+", "+formatted_date + "</td>";
									var varFirstSeen = "<td>" + FirstSeen + "</td>";
									var varLastSeen  = "<td>" + LastSeen + "</td>";
									var varTotalHours  = "<td>" + TotalHours+ " hr</td>";
									var varOvertime  = "<td>" + Overtimetxt+ " hr</td>";
									var varShiftName  = "<td>" + ShiftName+ "</td>";
									<!-- var varStatus     = "<td>" + ""+ "</td>"; -->
									var varView = ViewText;
									var createtr = "<tr>" + varSlNo + varshowDate + varFirstSeen + varLastSeen + varTotalHours + varOvertime + varShiftName + varStatus + varView + "</tr>";
									tabledata = tabledata + createtr;
				}
			}else 
				tabledata = tabledata + '<tr><td colspan="9" class="text-center"><span class="text-danger">No list found</span></td></tr>';
			tabledata = tabledata + '</tbody></table>';
			$("#list_data").html(tabledata);
			datatableIntialise()
		});
	}
}

//Time Formate
function timeFormate(dt_Time){
	if (dt_Time == "N/A") 
		var time_Show = "----";
	else{
		var SeenT   = new Date(dataUser[x]['FirstSeen']),
			SeenHr  = SeenT.getHours(),
			SeenMin = SeenT.getMinutes(),
			SeenSec = SeenT.getSeconds();
		Seen_hr     = (SeenHr < 10 ? '0' : '') + SeenHr;
		Seen_min    = (SeenMin < 10 ? '0' : '') + SeenMin;
		Seen_sec    = (SeenSec < 10 ? '0' : '') + SeenSec;
		var time_Show = Seen_hr + ":" + Seen_min + ":" + Seen_sec;
	}
	return time_Show;
}


//Listing API
function showattendanceinfo(ADDate, EmpId) {
	var d = new Date(ADDate);
	var endpointatt = "attendance-info";
	var requesturl = baseURL + prefix + endpointatt;
	var settings = {
		"url": requesturl,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"ADDate": ADDate,
			"EmpId": EmpId
		}),
	};
	$.ajax(settings).done(function (response) {
		if (response.category == 1) {
			var data       = response['ResponseData'];
			var EmpName    = data['timesheetdetails'][0]['EmpName']
			var dayName    = data['timesheetdetails'][0]['DayName']
			var fulldate   = data['timesheetdetails'][0]['ADDate']
			var TotalHours = data['timesheetdetails'][0]['TotalHours']
			var FirstSeen  = data['timesheetdetails'][0]['FirstSeen']
			var LastSeen   = data['timesheetdetails'][0]['LastSeen']
			var html = '<div class="row"><div class="col-md-6"><div class="card punch-status"><div class="card-body"><h5 class="card-title">Timesheet</br> <small class="text-muted">' + dayName + ', ' + fulldate + '</small></h5><div class="punch-det"><h6>Punch In at</h6><p><i class="fa fa-clock"></i>  ' + FirstSeen + '</p></div><div class="punch-info"><div class="punch-hours"><span>' + TotalHours + '</span></div></div><div class="punch-det"><h6>Punch Out at</h6><p><i class="fa fa-clock"></i>  ' + LastSeen + '</p></div></div></div></div><div class="col-md-6"><div class="card recent-activity"><div class="card-body"><h5 class="card-title">Activity</h5><div style="height: 335px;overflow-y: auto;"><ul class="res-activity-list">';
			for (var r in data['activitylog']) {
				var formatedTime = data['activitylog'][r]['ADTime'];
				var changedformatedTime = new Date(formatedTime);
				var hr = changedformatedTime.getHours();
				var min = changedformatedTime.getMinutes();
				var sec = changedformatedTime.getSeconds();
				hr = (hr < 10 ? '0' : '') + hr;
				min = (min < 10 ? '0' : '') + min;
				sec = (sec < 10 ? '0' : '') + sec;

				//  document.write(hr+":"+min+":"+sec);
				if (r % 2 === 0) {
					html += '<li><p class="mb-0">Punch In at<span class="res-activity-time" style="padding-left:15px;><i class="fa fa-clock"></i> ' + hr + ':' + min + ':' + sec + '</span></p></li>';
				} else {
					html += '<li><p class="mb-0">Punch Out at<span class="res-activity-time" style="padding-left:15px;><i class="fa fa-clock"></i> ' + hr + ':' + min + ':' + sec + '</span></p></li>';
				}
			}
		}
		$('#attendance_info .modal-header span#emp-name').text("Attendance Info: " + EmpName);
		$('#attendance_info .modal-body').html(html);
	});
	$('#attendance_info').modal('show');
}

//Get Employee Details
function getEmployeeDetails(EmpId) {
	var endpoint = "employee-info/" + EmpId;
	var locationlisturl = baseURL + prefix + endpoint;
	var employeeinfosettings = {
		"url": locationlisturl,
		"method": "GET",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey
		},
		"data": JSON.stringify({}),
	};

	$.ajax(employeeinfosettings).done(function (response) {
		var data = response['ResponseData'];
		var ImagePath = "public/images/generic-user-purple.png";
		if (response.category == 1) {
			var EmpName = data[0]['EmpName'];
			if (data[0]['ImagePath'] != '') 
				var ImagePath = baseURL + data[0]['ImagePath'];
			if (data[0]['ImagePath'] == null)
				var ImagePath = "public/images/generic-user-purple.png";

			var profiledetailsdiv = '<img class="rounded-circle" width="40" height="40" src="' + ImagePath + '">' + " " + EmpName;
		} else {
			document.title = "User Report";
			var profiledetailsdiv = '<img class="rounded-circle" width="40" height="40" src="' + ImagePath + '">Employee Name Not Avail.';
		}
		$("#employee_profile_image").html(profiledetailsdiv);

	});
}

