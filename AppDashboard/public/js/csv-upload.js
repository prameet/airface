var projectPath = sessionStorage.getItem('projectPath');
message = sessionStorage.getItem('message'),
	baseURL = sessionStorage.getItem("baseURL"),
	langName = sessionStorage.getItem("sitelang"),
	AccessToken = sessionStorage.getItem("AccessToken"),
	LicKey = sessionStorage.getItem('LicKey'),
	message = sessionStorage.getItem('message'),
	prefix = sessionStorage.getItem("prefix");

$(".select2").select2();
if (message != null) {
	$("#messageId").attr('class', 'alert alert-success text-left')
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

$('#csv_file').change(function () {
	// var i = $(this).prev('label').clone();
	var fileName = $('#csv_file')[0].files[0].name;
	console.log(fileName);
	$('#CCSVFile').html(fileName);
	// $(this).prev('label').text(file);
});

// Location All Data
function locationData(locId) {
	var endPointloc = "locations";
	var requesturlList = baseURL + prefix + endPointloc;
	var locAllData = {
		"url": requesturlList,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
		},
	};
	$.ajax(locAllData).done(function (response) {
		var data1 = response['ResponseData'];
		var GroupArr = '';
		GroupArr += '<option value="">Open this select menu</option>';
		for (var j in data1) {
			if (locId === data1[j]['BaseLocationId']) {
				GroupArr += '<option value="' + data1[j]['BaseLocationId'] + '" selected="selected">' + data1[j]['LocationName'] + '</option>';
			} else {
				GroupArr += '<option value="' + data1[j]['BaseLocationId'] + '">' + data1[j]['LocationName'] + '</option>';
			}
		}
		$('#locId').html(GroupArr);
	})
}

//Shift Data

function shiftData(shiftId) {
	var locId = $('#locId').val();
	var endPointshift = "get-shift-locationwise/" + locId;
	var requesturl = baseURL + prefix + endPointshift;
	var shiftData = {
		"url": requesturl,
		"method": "GEt",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
		},
	};
	$.ajax(shiftData).done(function (response) {
		var data1 = response['ResponseData'];
		var GroupArr = '';
		GroupArr += '<option value="">Open this select menu</option>';
		for (var j in data1) {
			if (shiftId === data1[j]['BaseLocationId']) {
				GroupArr += '<option value="' + data1[j]['ShiftMasterId'] + '" selected="selected">' + data1[j]['ShiftName'] + '</option>';
			} else {
				GroupArr += '<option value="' + data1[j]['ShiftMasterId'] + '">' + data1[j]['ShiftName'] + '</option>';
			}
		}
		$('#shiftId').html(GroupArr);
	})
}

function csvuploads() {
	var endpoint = "employee-bulk-upload";
	var requesturlcsvFile = baseURL + prefix + endpoint;

	var fileUpload = $('input[name=csv_file]')[0].files[0];
	if (fileUpload === undefined || fileUpload == null) {
		document.getElementById("CCSVFile").style.border = "1px solid red";
		return false;
	} else {

		var BaseLoc = 1;
		var form = new FormData();
		form.append("file", fileUpload);
		form.append("BaseLocationId", BaseLoc);
		/*for (var key of form_data.entries()) {
			console.log(key[0] + ', ' + key[1]);
		}
		return false;*/
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": requesturlcsvFile,
			"method": "POST",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
			},
			"processData": false,
			"contentType": false,
			"mimeType": "multipart/form-data",
			"data": form
		}
		$.ajax(settings).done(function (response) {
			var data = JSON.parse(response);
			console.log(response);
			$("#show_error").hide();
			if (data.category == '0') {
				$("#show_error").html(data['message']);
				$("#show_error").show();
			}
			else {
				var tabledata = '';
				var tabledata2 = '';
				tabledata = '<table id="ErrorEmpList" class="table table-striped table-bordered display" style="border:1px solid black;"><thead><tr><th style="border:1px solid black;font-weight: bold;">Sl.no</th><th style="border:1px solid black;font-weight: bold;">EmpId</th><th style="border:1px solid black;font-weight: bold;">EmployeeName</th><th style="border:1px solid black;font-weight: bold;">EmailId</th><th style="border:1px solid black;font-weight: bold;">MobileNo</th></tr></thead><tbody>';
				tabledata2 = '<table id="SuccessEmpList" class="table table-striped table-bordered display" style="border:1px solid black;"><thead><tr><th style="border:1px solid black;font-weight: bold;">Sl.no</th><th style="border:1px solid black;font-weight: bold;">EmpId</th><th style="border:1px solid black;font-weight: bold;">EmployeeName</th><th style="border:1px solid black;font-weight: bold;">EmailId</th><th style="border:1px solid black;font-weight: bold;">MobileNo</th></tr></thead><tbody>';
				var errorData = data['errorData'];
				var cntErrorDatalength = errorData.length;
				var i = 0;
				var slNo = 0;
				if (cntErrorDatalength > 0) {
					var td = '';
					for (i = 0; i < cntErrorDatalength; i++) {
						var slNo = i + 1;
						var slNoTd = "<td style='border:1px solid black;'>" + slNo + "</td>";
						errorcreatetr = '';
						var messageCode = errorData[i]['message-code'];
						var message = errorData[i]['message'];
						cntMessageCode = messageCode.length;
						if (messageCode.includes(2)) {
							var colName = 'Employee ID';
							var uniqueMasterId = '"' + colName + '","' + slNo + '"';
							var indexOfMessageCode = messageCode.indexOf(2);
							var messageText = message[indexOfMessageCode];
							var errorEmployeeId = "<td style='border: 1px solid black;color: red;' title='" + messageText + "'>" + errorData[i]['EmpId'] + "</td>";
						} else {
							var errorEmployeeId = "<td style='border: 1px solid black;'>" + errorData[i]['EmpId'] + "</td>";
						}

						if (messageCode.includes(1) || messageCode.includes(4)) {
							var colName = 'EmailId';
							var uniqueMasterId = '"' + colName + '","' + slNo + '"';

							if (messageCode.includes(1)) {
								var indexOfMessageCode = messageCode.indexOf(1);
								var messageText = message[indexOfMessageCode];
								var errorMailId = "<td style='border: 1px solid black;color: red;' title='" + messageText + "'>" + errorData[i]['EmailId'] + "</td>";
							} else {
								if (messageCode.includes(4)) {
									var indexOfMessageCode = messageCode.indexOf(4);
									var messageText = message[indexOfMessageCode];
									var errorMailId = "<td style='border: 1px solid black;color: red;' title='" + messageText + "'>" + errorData[i]['EmailId'] + "</td>";
								} else {
									var errorMailId = "<td style='border: 1px solid black;'>" + errorData[i]['EmailId'] + "</td>";
								}
							}
						} else {
							var errorMailId = "<td style='border: 1px solid black'>" + errorData[i]['EmailId'] + "</td>";
						}
						if (messageCode.includes(3)) {

							var colName = 'MobileNo';
							var uniqueMasterId = '"' + colName + '","' + slNo + '"';
							var indexOfMessageCode = messageCode.indexOf(3);
							var messageText = message[indexOfMessageCode];
							var errorMobileNo = "<td style='border: 1px solid black;color: red;' title='" + messageText + "'>" + errorData[i]['MobileNo'] + "</td>";

						} else {
							var errorMobileNo = "<td style='border: 1px solid black;'>" + errorData[i]['MobileNo'] + "</td>";
						}

						var errorEmployeeName = "<td style='border: 1px solid black;'>" + errorData[i]['EmpName'] + "</td>";

						var errorcreatetr = "<tr>" + slNoTd + errorEmployeeId + errorEmployeeName + errorMailId + errorMobileNo + "</tr>";

						tabledata = tabledata + errorcreatetr;
					}
				}

				var successData = data.successData;
				var cntSuccessDatalength = successData.length;
				if (cntSuccessDatalength > 0) {
					var i;
					var td = '';
					for (i = 0; i < cntSuccessDatalength; i++) {
						var slNo = slNo + i + 1;
						successcreatetr = '';
						var slNoTd = "<td style='border: 1px solid black;'>" + slNo + "</td>";
						var successEmployeeId = "<td style='border: 1px solid black;'>" + successData[i]['EmpId'] + "</td>";
						var successEmployeeName = "<td style='border: 1px solid black;'>" + successData[i]['EmpName'] + "</td>";
						var successMailId = "<td style='border: 1px solid black;'>" + successData[i]['EmailId'] + "</td>";
						var successMobileNo = "<td style='border: 1px solid black;'>" + successData[i]['MobileNo'] + "</td>";
						var successcreatetr = "<tr style='color:green;'>" + slNoTd + successEmployeeId + successEmployeeName + successMailId + successMobileNo + "</tr>";
						tabledata2 = tabledata2 + successcreatetr;
					}
				}

				tabledata += '</tbody></table>';
				tabledata2 += '</tbody></table>';
				$("#listdata").html(tabledata);
				$("#succlistdata").html(tabledata2);
				datatableIntialise();
				$("#importCSVFile").hide();
				$("#totalEmpVal").html(data.totalEmp);
				var totalSuccessEmp = data.totalSuccessEmp;
				var totalErrorEmp = data.totalErrorEmp;
				if (totalSuccessEmp > 0) {
					$("#empCsvSuccListLink").attr("onclick", "CreateReport('SuccessEmpList','SuccessEmployeeList');");
				}
				if (totalErrorEmp > 0) {
					$("#empCsvErrListLink").attr("onclick", "CreateReport('ErrorEmpList','ErrorEmployeeList');");
				}
				$("#totalSuccessEmpVal").html(data.totalSuccessEmp);
				$("#totalErrorEmpVal").html(data.totalErrorEmp);
				$("#csvFileUploadResultDetails").show();
				$("#csvFileUploadBtn").hide();
				
				< !--$("#empCsvSuccListBtn").show(); -->
				< !--$("#empCsvErrListBtn").show(); -->
			}
		});
	}
}
function datatableIntialise() {
	var prevLabel = "Previous";
	var nextLabel = "Next";
	var searchLabel = "Search";
	var excelLabel = "Excel";
	var pdfLabel = "PDF";
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

$('body').on('click', '#csvFileUploadBtn', function () {
	$('#shiftId').val('').trigger('change');
	locationData();
	$('#importCSVFile').toggleClass('show');
	$('#importCSVFile').css({ "display": "block", "padding-right": "17px" });
})
$('body').on('click', '.close', function () {
	$('#importCSVFile').toggleClass('show');
	$('#importCSVFile').css({ "display": "none" });
})
$('body').on('click', '#close', function () {
	$('#importCSVFile').toggleClass('show');
	$('#importCSVFile').css({ "display": "none" });
})

$('body').on('click', '#closeM', function () {
	$('#importCSV').toggleClass('show');
	$('#importCSV').css({ "display": "none" });
})
$(document).ready(function () {
	$('#title').html('Airface ™ Enterprise || CSV Upload For Employee');
	$('#absService').html('3SD Solutions Pvt');
	$('#profile').html('My Profile');
	$('#pswd').html('Change Password');
	$('#logout').html('Logout');
	$('#absS').html('3SD Solutions Pvt');
	$('#dashboard').html('Dashboard');
	$('#Service').html('3SD Solutions Pvt');
	$('#absFooter').html('© 2020. 3SD Solutions Pvt. Ltd. All right reserved');
	$('#deleteId').attr('title', 'Delete');
	$('#editId').attr('title', 'Edit');
	var prevLabel = "Previous";
	var nextLabel = "Next";
	var searchLabel = "Search";
	var excelLabel = "excel";
	var pdfLabel = "pdf";
	var printLabel = "print";
	var datatableInfo = "Showing _START_ to _END_ of _TOTAL_ entries";
	$('#CSVFileUploadResult').html('CSV File Upload Result :');
	$('#dontRefresh').html('Page refresh is strictly restricted.');
	$('#totalEmpLbl').html('Total no of Employee');
	$('#empCsvSuccListLbl').html('No of success Employee');
	$('#empCsvErrListLbl').html('No of failure Employee');
	$('#save').html('Save');
	$('#cancel').html('Cancel');
	$('#reset').html('Reset');
	$('#Emp').html('Employee');
	$('#csvUploadBred').html('CSV Upload');
	$('#backLbl').html('Back');
	$('#Dwnld').html('Download Sample CSV');
	$('#upload').html('Upload');
	$('#csvUpload').html('Upload');
	$('#CCSVFile').html("Choose CSV file..");
	$('#Sub').html('Upload');
	$('#csvFile').html('CSV Upload');
	$('#downloadCSV').html('Download Sample CSV');
	$('#UploadCSV').html('Upload');
	$('#csvFileUpload').html('Csv File Data');
	$('#missingField').html('either duplicate data or missing any field.');
	$('#nameCSV').html('Name');
	$('#empIdCSV').html('DNI');
	$('#mailCSV').html('Email ID');
	$('#mobileCSV').html('Mobile No');
});

function CreateReport(tableID, ReportName) {
	var downloadLink;
	var dataType = 'application/vnd.ms-excel';
	var tableSelect = document.getElementById(tableID);
	var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
	console.log(tableHTML);
	ReportName = ReportName ? ReportName + '.xls' : '' + 'EmployeeName.xls';//modify excle sheet name here 
	// Create download link element
	downloadLink = document.createElement("a");
	document.body.appendChild(downloadLink);

	if (navigator.msSaveOrOpenBlob) {
		var blob = new Blob(['\ufeff', tableHTML], {
			type: dataType
		});
		navigator.msSaveOrOpenBlob(blob, ReportName);
	} else {
		// Create a link to the file
		downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

		// Setting the file name
		downloadLink.download = ReportName;

		//triggering the function
		downloadLink.click();
	}
}
