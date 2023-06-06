//document.title = companyNameData + "_" + "Daily Activity_" + today_title;
var projectPath = sessionStorage.getItem('projectPath'),
	baseURL = sessionStorage.getItem("baseURL"),
	LicKey = sessionStorage.getItem("LicKey"),
	AccessToken = sessionStorage.getItem("AccessToken"),
	prefix = sessionStorage.getItem("prefix");
endpoint = "latecoming",
	GroupArr = '',
	companyNameData = sessionStorage.getItem('OrganizationName'),
	today_title = sessionStorage.getItem('today_title'),
	requesturl = baseURL + prefix + endpoint;
var newbaseURL = "http://localhost/PHP-API/";
$('#title').html(companyNameData + "_" + "Daily Activity_" + today_title);
var counter = 1;
var oTable, displayTable = [];
var txt = "";
$(document).ready(function () {
	$('#profile').html('My Profile');
	$('#pswd').html('Change Password');
	$('#logout').html('Logout');
	$('#absS').html('3SD Solutions Pvt');
	$('#dashboard').html('Dashboard');
	$('#Service').html('3SD Solutions Pvt');
	$('#absFooter').html('© 2020. 3SD Solutions Pvt. Ltd. All right reserved');
	$('#cardtitle').html('Activity');
	$('#titlePrefix').html('Daily Activity');
	$('#reportMod').html('Reports');
	$('#dailyActivity').html('Daily Activity');
	$('#userDailyActivityDetails .modal-title').html('Attendance Info :');

	var todayDr = new Date().toISOString().split('T')[0];
	$("#setdate").attr('max', todayDr);
});

function reInitializeDataTable() {
	$('#example').dataTable().fnDestroy();
	var prevLabel = "Previous";
	var nextLabel = "Next";
	var searchLabel = "Search";
	var excelLabel = "Excel";
	var pdfLabel = "Pdf";
	var printLabel = "Print";
	var datatableInfo = "Showing _START_ to _END_ of _TOTAL_ entries";
	$('#example').DataTable({
		dom: 'Bfrtip',
		buttons: [{
			extend: 'excel',
			text: excelLabel
		},
		{
			extend: 'pdf',
			text: pdfLabel
		},
		{
			extend: 'print',
			text: printLabel
		}
		],
		lengthMenu: [
			[50, -1],
			[50, "All"]
		],
		language: {
			paginate: {
				previous: prevLabel,
				next: nextLabel
			},
			aria: {
				paginate: {
					previous: 'Previous',
					next: 'Next'
				}
			},
			search: searchLabel,
			info: datatableInfo
		}
	});
}
var vardate = '';
var searchdate = '';
$('body').on('change', 'input[name=setDate]', function () {
	vardate = $('#setdate').val();
	$("#setdate").attr('value', vardate);
	var vardate2 = vardate.split("-").reverse().join("-");
	$("#headerData").html(vardate2);
	ShowListing(vardate);
});

if (vardate == '') {
	var d = new Date();
	vardate = dateFormat(d);
	$("#setdate").attr('value', vardate);
	var vardate2 = vardate.split("-").reverse().join("-");
	$("#headerData").html(vardate2);
	ShowListing(vardate);
}

function ShowListing(dt) {
	var dtDt = $("#setdate").val();
	var settings = {
		"url": requesturl,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"searchDate": dtDt
		}),
	};
	$.ajax(settings).done(function (response) {
		if (response['category'] == '1') {
			var data = response['ResponseData'];
			var locdatalength = data.length;
		}
		else
			var locdatalength = 0;
		var tabledata = '';
		tabledata = '<table id="example" class="table table-striped custom-table"><thead><tr><th align="center">Sl.No.</th><th>Employee ID</th><th>Name</th><th>Location</th><th>First Seen</th><th>Last Seen</th><th>Shift</th><th>Status</th></tr></thead><tbody>';
		if (locdatalength > 0) {
			var i;
			var td = '';
			var status = '';
			var LeaveType = '';
			for (i = 0; i < locdatalength; i++) {
				if (data[i]['EmpImage'] != null && data[i]['EmpImage'] != '')
					var imgurl = newbaseURL + data[i]['EmpImage'];
				else
					var imgurl = 'public/images/generic-user-purple.png';
				imgurl = imgurl.replace("thumb", "large");
				var slno = i + 1;
				var EmpIddata = data[i]['EmpId'];
				var EmpName = "<span class='pt-2 m-l-10'>" + data[i]["EmpName"] + "</span>";
				var EmpImage = '<img src="' + imgurl + '" alt="user" class="rounded-circle" width="50" height="50">';

				var td_data = "<td>" + slno + "</td>" +
					"<td>" + data[i]['EmpId'] + "</td>" +
					'<td id="empNameId' + i + '" value="' + data[i]['EmpId'] + '" onclick="return dailyreportData(' + EmpIddata + ');"><div style="display: inline-flex; cursor: pointer;" id="taken">' + EmpImage + EmpName + '</div></td>' +
					"<td>" + data[i]['LocationName'] + "</td>" +
					"<td>" + dateFormatT(data[i]['FirstSeen']) + "</td>" +
					"<td>" + dateFormatT(data[i]['LastSeen']) + "</td>" +
					"<td>" + data[i]['ShiftName'] + "</td>" +
					"<td><div style='display: inline-flex;' class='fa fa-dot-circle .bg-warning'></div>" + '  Present' + "</td>";
				var createtr = "<tr>" + td_data + "</tr>";
				tabledata = tabledata + createtr;
			}
			tabledata += '</tbody></table>';
		} else
			tabledata += "<tr> <td colspan='8' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr></tbody></table>";
		$("#tableData").html(tabledata);
		reInitializeDataTable()
	});
}

function closeData() {
	$("#userDailyActivityDetails").hide();
}

function dailyreportData(id) {
	var dateTD = $("#setdate").val();
	var popupend = 'checkinout';
	var settingsPopup = {
		"url": baseURL + prefix + popupend,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"ADDate": dateTD,
			"EmpId": id
		}),
	};
	$.ajax(settingsPopup).done(function (response) {
		var dataPopup = response['ResponseData'];
		var GroupArr = '';
		for (var j in dataPopup) {
			var daytime = dateTimeFormat(dataPopup[j]['ADTime']);
			if (j % 2 === 0) {
				GroupArr = GroupArr + '<li><p class="mb-0">Punch In at <span class="res-activity-time"><i class="fa fa-clock"></i> ' + daytime + '</span></p></li>';
			} else {
				GroupArr = GroupArr + '<li><p class="mb-0">Punch Out at <span class="res-activity-time"><i class="fa fa-clock"></i> ' + daytime + '</span></p></li>';
			}
			$("#modalTitlePrefix").html(dataPopup[j]["EmpName"]);
		}
		$('div#userDailyActivityDetails').css("display", "block");
		$("#ListId").html('');
		$("#ListId").html(GroupArr);
	});
}

function dateFormat(data) {
	if (data != '' && data != '0000-00-00' && data != undefined && data != null) {
		var date = new Date(data);
		var day = '', month = '', year = '', fullDate = '';
		var getMonth = date.getMonth() + 1;
		if (date.getDate() <= 9)
			day = '0' + date.getDate();
		else
			day = date.getDate();
		if (date.getMonth() + 1 <= 9)
			month = '0' + getMonth;
		else
			month = getMonth;
		year = date.getFullYear();

		fullDate = year + '-' + month + '-' + day;
		return fullDate;
	} else
		return '';
}

//Date With Time format
function dateTimeFormat(da) {
	if (data != '' && data != '0000-00-00' && data != undefined && data != null) {
		var d = new Date(da);
		var hours = d.getHours();
		var minutes = d.getMinutes();
		var second = d.getSeconds();
		var day = '', month = '', year = '';
		var getMonth = d.getMonth() + 1;
		if (d.getDate() <= 9)
			day = '0' + d.getDate();
		else
			day = d.getDate();
		if (d.getMonth() + 1 <= 9)
			month = '0' + getMonth;
		else
			month = getMonth;
		year = d.getFullYear();
		hours = hours < 10 ? '0' + hours : hours;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		second = second < 10 ? '0' + second : second;
		var strTime = day + '-' + month + '-' + year + "    " + hours + ':' + minutes + ':' + second;
		return strTime;
	}
}

//Time Formate
function dateFormatT(dt) {
	if (dt != '' && dt != '0000-00-00' && dt != undefined && dt != null) {
		var seen = new Date(dt);
		var hour = seen.getHours();
		var minute = seen.getMinutes();
		var second = seen.getSeconds();
		var suffix = hour >= 12 ? " PM" : " AM";
		minute = minute < 10 ? '0' + minute : minute;
		second = second < 10 ? '0' + second : second;
		if (hour >= 10)
			var cu_Hours = hour + ":" + minute + ":" + second + " " + suffix;
		else {
			hour = "0" + hour;
			var cu_Hours = hour + ":" + minute + ":" + second + " " + suffix;
		}
		return cu_Hours;
	} else
		return 'N/A';
}

