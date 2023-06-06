// All Activity
var projectPath = sessionStorage.getItem('projectPath');
baseURL = sessionStorage.getItem("baseURL");
var newbaseURL = "http://localhost/PHP-API/";
AccessToken = sessionStorage.getItem("AccessToken"),
	LicKey = sessionStorage.getItem('LicKey'),
	message = sessionStorage.getItem('message'),
	category = sessionStorage.getItem('category'),
	prefix = sessionStorage.getItem("prefix");

if (message != null) {
	$("#messageId").attr('class', 'alert alert-success text-left');
	$("#messageId").show().text(message);
	setTimeout(function () {
		$("#messageId").hide();
	}, 4000);
	sessionStorage.removeItem('message');
	sessionStorage.removeItem('category');
}
if (AccessToken == '' || AccessToken == null || AccessToken == 'undefined') {
	window.location.href = projectPath;
}

//DataTable Initialization
function datatableIntialise() {
	var prevLabel = "Previous";
	var nextLabel = "Next";
	var searchLabel = "Search";
	var excelLabel = "Excel";
	var pdfLabel = "Pdf";
	var printLabel = "Print";
	$('#ReportTitle').html('Report');
	$('#ReportList').html('All Activity');
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
$(document).ready(function () {
	// -- Api for All_Activity Listing --
	var endpoint = "allactivity-report";
	var requesturl = baseURL + prefix + endpoint;
	var ReportListApi = {
		"url": requesturl,
		"method": "POST",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken,
		},
	};
	$.ajax(ReportListApi).done(function (response) {
		var tabledata = '';
		tabledata = '<table id="example" class="table table-striped custom-table"><thead><tr><th>Sl.No.</th><th>Employee ID</th><th>Name</th><th>Seen Date</th><th>Seen Time</th><th>Camera Seen</th> </tr></thead><tbody>';
		var data = response['ResponseData'];
		var cntdatalength = data.length;
		if (cntdatalength > 0) {

			var i;
			var td = '';
			for (i = 0; i < cntdatalength; i++) {
				if (data[i]['EmpImage'] != null && data[i]['EmpImage'] != '')
					var imgurl = newbaseURL + data[i]['EmpImage'];
				else
					var imgurl = 'public/images/generic-user-purple.png';
				imgurl = imgurl.replace("thumb", "large");
				var slno = i + 1;
				var imagePopUpLink = "openFullScreen('" + imgurl + "')";
				// alert(imagePopUpLink);

				var EmpImage = '<a class="image-popup-vertical-fit" href="javascript:void(0);" title="' + data[i]['EmpName'] + '"><img onClick="' + imagePopUpLink + '" src="' + imgurl + '" alt="user" class="rounded-circle" width="40" height="40"></a>';
				var EmpName = "<a href='" + projectPath + "single_timesheet.html?id=" + data[i]['EmpId'] + "'><span class='m-l-10'>" + data[i]['EmpName'] + "</span>";
				if (data[i]['CameraName'] == "NULL")
					var Source = "N/A"
				else
					var Source = data[i]['CameraName'];
				var time_Td = data[i]['ADTime'];
				var res = time_Td.split(":");
				if (res[0] >= 12) {
					if (res[0] == 12)
						var hour = res[0];
					else
						var hour = res[0] - 12;

					var hour_td = hour > 9 ? hour : "0" + hour;
					var time_d = hour_td + ':' + res[1] + ':' + res[2] + " " + "PM";
				}
				else {
					var time_d = res[0] + ':' + res[1] + ':' + res[2] + " " + "AM";
				}

				var list_Data = "<td>" + slno + "</td>" +
					"<td>" + data[i]['EmpId'] + "</td>" +
					"<td>" + EmpImage + " " + EmpName + "</td>" +
					"<td>" + dateFormat(data[i]['ADDate']) + "</td>" +
					"<td>" + time_d + "</td>" +
					"<td>" + Source + "</td>";
				var createtr = "<tr>" + list_Data + "</tr>";
				tabledata = tabledata + createtr;
			}
			tabledata += '</tbody></table>';
		} else
			tabledata += "<tr> <td colspan='8' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr></tbody></table>";

		$("#listdata").html(tabledata);
		datatableIntialise();
	});
});

//Only Date Format
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
		fullDate = day + '-' + month + '-' + year;
		return fullDate;
	} else
		return '';
}
