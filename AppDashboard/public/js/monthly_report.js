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

var companyNameData = sessionStorage.getItem('OrganizationName'),
	EmployeeEmailId = sessionStorage.getItem('EmployeeEmailId'),
	projectPath     = sessionStorage.getItem('projectPath'),
	baseURL         = sessionStorage.getItem("baseURL"),
	prefix          = sessionStorage.getItem("prefix"),
	AccessToken     = sessionStorage.getItem("AccessToken"),
	LicKey          = sessionStorage.getItem('LicKey'),
	EmpIdUser       = sessionStorage.getItem('EmpId');
document.getElementById("companyName").innerHTML = companyNameData;

function datatableIntialise() {
	var monthNames    = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var prevLabel     = "Previous";
	var nextLabel     = "Next";
	var searchLabel   = "Search";
	var excelLabel    = "Excel";
	var pdfLabel      = "Pdf";
	var printLabel    = "Print";
	var datatableInfo = "Showing _START_ to _END_ of _TOTAL_ entries";
	$('#empName').html('Name');
	//Change Page Title
	var selectedMonthNumber = $('#select2-monthFilter-container').html();
	document.title    = companyNameData + "_" + "Monthly Attendance :" + selectedMonthNumber;

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
		scrollY: "400px",
		scrollX: true,
		scrollCollapse: true,
		paging: false,
		fixedColumns: {
			leftColumns: 1,
		},
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

$('#dayTab').html('Day');
$('#hourTab').html('Hour');
var shouldbevalid        = "Should Be Valid";
var searchParameterError = "Please Select Location";
var selectYear           = "Select Year";
var selectMonth          = "Select Month";
var selectLocation       = "Please Select Location ";
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//For Year List
var current_date   = new Date();
var current_month  = current_date.getMonth();
var current_year   = current_date.getFullYear();
var GroupArr       = '<option value="">' + selectYear + '</option>';
for (var i = current_year - 2; i < current_year + 1; i++) {
    if (i == current_year) {
        GroupArr = GroupArr + '<option value="' + i + '" selected="selected">' + i + '</option>';
    } else {
        GroupArr = GroupArr + '<option value="' + i + '">' + i + '</option>';
    }
}
$('#yearFilter').html(GroupArr);
var c_year = current_date.getFullYear();
var curMonth = (new Date()).getMonth();
var month = $('input[name=sel_month]').val();
$('.month-filter select').append('');

if ($('#yearFilter option[value= c_year]')) {
    for (var j = 0; j <= curMonth; j++) {
        var optionValue = j + 1;
        optionValue = pad(optionValue, 2);
        if (optionValue == month) {
            $('.month-filter select').append('<option value="' + optionValue + '" selected>' + monthNames[j] + '</option>');
        } else {
            $('.month-filter select').append('<option value="' + optionValue + '" >' + monthNames[j] + '</option>');
        }
    }
} else {
    for (var j = 0; j <= 11; j++) {
        var optionValue = j + 1;
        optionValue = pad(optionValue, 2);
        $('.month-filter select').append('<option value="' + optionValue + '" >' + monthNames[j] + '</option>');
    }
}
//For Location List
var settingsEmp = {
    "url"    : baseURL + prefix + "locations",
    "method" : "POST",
    "headers": {
        "AccessToken": AccessToken,
        "LicKey": LicKey,
        "Content-Type": "application/json"
    },
};
$.ajax(settingsEmp).done(function (response) {
    var data = response['ResponseData'];
    var locdatalength = data.length;
    //var locdatalength = 1;
    if (locdatalength > 1) {
        var GroupArrEmp = '<option value="">' + selectLocation + '</option>';
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

function zeroPad(num) {
    return num.toString().padStart(2, "0");
}


function recordList() {
    var AttendanceMonth  = document.getElementById("monthFilter").value;
    var AttendanceYear   = document.getElementById("yearFilter").value;
    var locationID       = document.getElementById("locationFilter").value;
    document.getElementById("sel_month").value = AttendanceMonth;
    var error        = 0;
    if (locationID  == '' || AttendanceMonth == '' || AttendanceYear == '' || locationID == '0' || AttendanceMonth == '0' || AttendanceYear == '0') {
        error =  1;
    }
    if (error != 0)
        return false;
    else {
        var endpoint     = "monthly-report-hour-wise";
        var requesturl   = baseURL + prefix + endpoint;
        var settingshour = {
            "url"    : requesturl,
            "method" : "POST",
            "timeout": 0,
            "headers": {
                "LicKey"       : LicKey,
                "AccessToken"  : AccessToken,
                "Content-Type" : "application/json"
            },
            "beforeSend": function () {
                $('#loadingBtn').show();
            },
            "complete": function () {
                $('#loadingBtn').hide();
            },
            "data": JSON.stringify({
                "AttendanceYear" : AttendanceYear,
                "AttendanceMonth": AttendanceMonth,
                "BaseLocationId" : locationID
            }),
        };
        $.ajax(settingshour).done(function (response) {
            var data = response['ResponseData'];
            console.log(data);
            if (response['category'] == '1')
                var cntdatalength = data.length;
            var htmlData = '';
            htmlData = '<div style="overflow-x:auto;"><table id="example" class="table table-striped table-bordered display" style="overflow-x:auto;"><thead><tr><th rowspan="2" id="empName">Name</th><th colspan="2">1</th><th colspan="2">2</th><th colspan="2">3</th><th colspan="2">4</th><th colspan="2">5</th><th colspan="2">6</th><th colspan="2">7</th><th colspan="2">8</th><th colspan="2">9</th><th colspan="2">10</th><th colspan="2">11</th><th colspan="2">12</th><th colspan="2">13</th><th colspan="2">14</th><th colspan="2">15</th><th colspan="2">16</th><th colspan="2">17</th><th colspan="2">18</th><th colspan="2">19</th><th colspan="2">20</th><th colspan="2">21</th><th colspan="2">22</th><th colspan="2">23</th><th colspan="2">24</th><th colspan="2">25</th><th colspan="2">26</th><th colspan="2">27</th><th colspan="2">28</th><th colspan="2">29</th><th colspan="2">30</th><th colspan="2">31</th><th colspan="2">Total Present</th></tr><tr><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>In</th><th>Out</th><th>Late Comming</th></tr></thead><tbody></div>';
            if (cntdatalength > 0) {
                $.each(data, function (keyp, valp) {
                    htmlData += '<tr>';
                    for (var m = 0; m < 32; m++) {
                        if (m != '0') {
                            var dayInvalue  = valp['D' + m + '_IN'];
                            var dayOutvalue = valp['D' + m + '_OUT'];
                            if (dayInvalue == '00:00:00') {
                                dayInTitle  = "<span class='text-danger'>N/A</span>";
                            } else {
                                dayInTitle  = "<span class='text-primary'>" + dayInvalue + "</span>";;
                            }
                            if (dayOutvalue == '00:00:00') {
                                dayOutTitle = "<span class='text-danger'>N/A</span>";
                            } else {
                                dayOutTitle = "<span class='text-primary'>" + dayOutvalue + "</span>";
                            }
                            htmlData += '<td>' + dayInTitle + '</td>';
                            htmlData += '<td>' + dayOutTitle + '</td>';
                        }else
                            htmlData += '<td>' + valp['EmpName'] + '</td>';
                    }
                    htmlData += '</tr>';
                });
            }else
                htmlData += "<tr><td colspan='64' align='left' class='text-danger'>No list found</td></tr>";
            htmlData += '</tbody></table>';
            $("#list_data").html(htmlData);
            $('#loadingBtn').hide();
            datatableIntialise();
        });
    }
}


function changeMonth(getYear) {
    var monthNames      = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var selectMonth     = "Select Month";
    var current_date    = new Date();
    var currentYear     = current_date.getFullYear();
    var curMonth        = current_date.getMonth();
    var monthlyList     = "<option value=''>" + selectMonth + "</option>";
    if (getYear == currentYear) {
        var monthlyList = "";
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