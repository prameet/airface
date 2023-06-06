function pad(num, size) {
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}

var today              = new Date(),
    currentYear        = today.getFullYear(),
    currentMonth       = today.getMonth() + 1,
    currentDate        = today.getDate(),
    pad_currentMonth   = pad(currentMonth, 2),
    Tomorrowdate       = currentDate + 1,
    TomorrowDateColumn = "D" + Tomorrowdate;
document.getElementById("sel_month").value = pad_currentMonth;
document.getElementById("sel_year").value = currentYear;

var projectPath   = sessionStorage.getItem('projectPath'),
    baseURL       = sessionStorage.getItem("baseURL"),
    prefix        = sessionStorage.getItem("prefix"),
    AccessToken   = sessionStorage.getItem("AccessToken");
    LicKey        = sessionStorage.getItem('LicKey'),
    companyNameData = sessionStorage.getItem('OrganizationName');
    $('#title').html(companyNameData +"_"+"Monthly_Summery_Report");

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

$(document).ready(function () {
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
	//For Month List
	var c_year = current_date.getFullYear();

	var curMonth = (new Date()).getMonth();
	console.log(curMonth);
	var month = $('input[name=sel_month]').val();
	// <!-- $('.month-filter select').append('<option value="">'+selectMonth+'</option>');  -->
	$('.month-filter select').append('');
	if ($('#yearFilter option[value= c_year]')) {
		for (var j = 0; j <= curMonth; j++) {
			var optionValue = j + 1;
			optionValue = pad(optionValue, 2);
			if (optionValue == month)
				$('.month-filter select').append('<option value="' + optionValue + '" selected>' + monthNames[j] + '</option>');
			else
				$('.month-filter select').append('<option value="' + optionValue + '" >' + monthNames[j] + '</option>');
		}     
	} else {
		for (var j = 0; j <= 11; j++) {
			var optionValue = j + 1;
			optionValue = pad(optionValue, 2);
			$('.month-filter select').append('<option value="' + optionValue + '" >' + monthNames[j] + '</option>');
		}
	}
	
	getlocation();
})

//Listing API
function getlocation() {
	//For Location List
	var settingsEmp = {
		"url"    : baseURL + prefix + "locations",
		"method" : "POST",
		"headers": {
			"AccessToken" : AccessToken,
			"LicKey"      : LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settingsEmp).done(function (response) {
		var data            = response['ResponseData'];
		var locdatalength   = data.length;
		// var locdatalength   = 2;
		console.log(locdatalength);
		if (locdatalength > 1) {
			var GroupArrEmp = '<option value="">' + "Select Location" + '</option>';
			for (var j in data) {
				GroupArrEmp = GroupArrEmp + '<option value="' + data[j]['BaseLocationId'] + '">' + data[j]['LocationName'] + '</option>';
			}
			$("#location_input_div").remove();
			$("#location_select_div").show();
			$('#locationFilter').html(GroupArrEmp);
		} else if (locdatalength == 1) {
			for (var j in data) {
				$("#location_select_div").remove();
				$("#location_input_div").show();
				$("#locationFilter").val(data[j]['BaseLocationId']);
			}
			recordList();
		} else {
			$("#location_select_div").remove();
			$("#location_input_div").show();
			$("#locationFilter").val(0);
			recordList();
		}
	});
}

function recordList() {
	var AttendanceMonth = $("#monthFilter").val(),
	    AttendanceYear  = $("#yearFilter").val(),
	    locationID      = $("#locationFilter").val();
	    $('#title').html(companyNameData +"_"+"Monthly_Summery_Report_"+(parseInt(AttendanceMonth))+'_'+AttendanceYear);
	var error = 0;
	if (locationID == '') {
		$("#locationFilter").css('border',"1px solid red");
        error = error + 1;
    } else {
		$("#locationFilter").css('border',"1px solid #dee2e6");
	}
	if (AttendanceMonth == '') {
		$("#monthFilter").css('border',"1px solid red");
        error = error + 1;
    } else {
		$("#monthFilter").css('border',"1px solid #dee2e6");
	}
	if (AttendanceYear == '') {
		$("#yearFilter").css('border',"1px solid red");
        error = error + 1;
    } else {
		$("#yearFilter").css('border',"1px solid #dee2e6");
	}
	if (error != 0) 
		return false;
	else {
		var endpoint = "monthly-summary-report";
		var requesturl = baseURL + prefix + endpoint;
		// API CALL FOR SUMMARY REPORT 
		var settings = {
			"url": requesturl,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"beforeSend": function () {
				$('#loadingBtn').show();
			},
			"complete": function () {
				$('#loadingBtn').hide();
			},
			"data": JSON.stringify({
				"AttendanceMonth": AttendanceMonth,
				"AttendanceYear": AttendanceYear,
				"BaseLocationId": locationID
			}),
        };
		$.ajax(settings).done(function (response) {
			var data          = response['response'];
			var cntdatalength = data.length;
            var tabledata     = '<table id="example" class="table table-striped table-bordered"><thead><tr><th align="center" id="slno">Sl.No.</th><th id="Emp">Employee Name</th><th id="TotHr">Total Hours</th><th id="WorkedDay">Worked Days</th><th id="Workedhr">Worked Hours</th><th id="Breakhr">Break Hours</th><th id="Paidleave">Paid Leave</th><th id="Unpaid">Unpaid Leave</th><th id="Compoff">CompOff</th><th id="tour">Tour</th><th id="Holiday">Holidays </th><th id="Weekend">Weekends </th></tr></thead><tbody>';
			if (cntdatalength > 0) {
				var i;
				for (var i = 0; i < cntdatalength; i++) {
					if (data[i]['ImagePath'] != 'N/A' && data[i]['ImagePath'] != '')
						var imgurl = baseURL + data[i]['ImagePath'];
					else
						var imgurl = 'public/images/generic-user-purple.png';

					var slno = i + 1;
                    var EmployeeName = data[i]['EmpName'];
                    var EmpImage = '<img class="rounded-circle"  width="40" height="40" src="' + imgurl + '" >';
                    // var TotalHr  = "<td>"+data[i]['TotalHour']+"</td>";
                    // var BreakHr  = "<td>"+data[i]['BreakHour']+"</td>";
                    var Employee         = "<td>" + data[i]['EmpId'] + "</td>";

                    var Td_Data     = "<td>" + slno + "</td>"
                                    + "<td>" + EmpImage + EmployeeName + "</td>"
                                    + "<td>" + "N/A" + "</td>"
					                + "<td>" + data[i]['WorkedDays'] + "</td>"
					                + "<td>" + data[i]['WorkedHours'] + "</td>"
					                + "<td>" + "N/A" + "</td>"
					                + "<td>" + data[i]['PaidLeave'] + "</td>"
					                + "<td>" + data[i]['UnpaidLeave'] + "</td>"
					                + "<td>" + data[i]['CompOff'] + "</td>"
					                + "<td>" + data[i]['Tour'] + "</td>"
					                + "<td>" + data[i]['Holiday'] + "</td>"
					                + "<td>" + data[i]['Weekend'] + "</td>";
					   
					    createtr         = "<tr>" + Td_Data + "</tr>";
					tabledata = tabledata + createtr;
				}
            }else
				tabledata += "<tr> <td colspan='12' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr>";
			tabledata += '</tbody></table>';
			$("#list_data").html(tabledata);
			datatableIntialise()
		})
	}
}

//Get Year and Month
function changeMonth(getYear) {
    var monthNames    = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var selectMonth   = "Select Month";
    var current_date  = new Date();
    var currentYear   = current_date.getFullYear();
    var curMonth      = current_date.getMonth();
    var monthlyList   = "<option value=''>" + selectMonth + "</option>";
    if (getYear == currentYear) {
        var monthlyList     = "";
        for (var j = 0; j  <= curMonth; j++) {
            var optionValue = j + 1;
            optionValue     = pad(optionValue, 2);
            monthlyList    += '<option value="' + optionValue + '" >' + monthNames[j] + '</option>';
        }
        $('.month-filter select').html(monthlyList);
    } else {
        var monthlyList     = "";
        for (var j = 0; j  <= 11; j++) {
            var optionValue = j + 1;
            optionValue     = pad(optionValue, 2);
            monthlyList    += '<option value="' + optionValue + '" >' + monthNames[j] + '</option>';
        }
        $('.month-filter select').html(monthlyList);
    }
}