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

var projectPath = sessionStorage.getItem('projectPath'),
	baseURL     = sessionStorage.getItem("baseURL"),
	prefix      = sessionStorage.getItem("prefix"),
	LicKey      = sessionStorage.getItem('LicKey'),
	AccessToken = sessionStorage.getItem("AccessToken"),
	GroupArr    = '';

//DataTable Initialization
function datatableIntialise(){
	var monthNames   = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var prevLabel    = "Previous";
	var nextLabel    = "Next";
	var searchLabel  = "Search";
	var excelLabel   = "Excel";
	var pdfLabel     = "Pdf";
	var printLabel   = "Print";
	var datatableInfo = "Showing _START_ to _END_ of _TOTAL_ entries";
    $('#example').DataTable({
		dom: 'Bfrtip',
		buttons: [{
				extend: 'excel',
				text: excelLabel },
			{
				extend: 'pdf',
				text: pdfLabel },
			{
				extend: 'print',
				text: printLabel }
		],
		lengthMenu: [
			[50, -1],
			[50, "All"]
		],
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

$(document).ready(function () {
    shiftListing();
    var monthNames    = ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"];
    //For Year List
    var current_date  = new Date();
    var current_month = current_date.getMonth();
    var current_year  = current_date.getFullYear();
    var GroupArr      = '<option value="">' + "Select Year" + '</option>';
    for (var i = current_year - 2; i < current_year + 1; i++) {
        if (i == current_year)
            GroupArr = GroupArr + '<option value="' + i + '" selected="selected">' + i + '</option>';
        else
            GroupArr = GroupArr + '<option value="' + i + '">' + i + '</option>';
        $('#yearFilter').html(GroupArr);

        //For Month List
        var c_year = current_date.getFullYear();

        var curMonth = (new Date()).getMonth();
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
    }
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
			// console.log(response);
            var data            = response['ResponseData'];
            var locdatalength   = data.length;
			// console.log(locdatalength);
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
})

function shiftListing()
{
    var endpoint        = "shifts";
    var requesturl      = baseURL + prefix + endpoint;
    var shiftList = {
        "url": requesturl,
        "method": "POST",
        "headers": {
            "AccessToken": AccessToken,
            "LicKey": LicKey
        },
        
    };
    $.ajax(shiftList).done(function (response) {
        var data = response.ResponseData;
        var optionVal = '<option value="">Select Shift</option>';

        if(data.length > 0)
        {
    
            $.each(data.reverse(), function(propName, propVal) {
                optionVal += '<option value="'+propVal['ShiftMasterId']+'">'+propVal['ShiftName']+'</option>'
            });

            $('#shiftId').html(optionVal);
        }
        
    });
}
$('#monthFilter').on('change', function() {
    $('#shiftId').val('').trigger('change');
});
$('#shiftId').on('change', function() {
    /*var dtDt = $("#setdate").val();
    var newDate = dtDt.split("-").reverse().join("-");*/
      var AttendanceYear  = $("#yearFilter").val(),
        AttendanceMonth = $("#monthFilter").val(),
        locationID      = $("#locationFilter").val();
    var shiftId = $('#shiftId').val();
    generateListing(AttendanceYear,AttendanceMonth,locationID,shiftId);
});

function zeroPad(num) {
    return num.toString().padStart(2, "0");
}

// Listing API
function recordList() {
    var AttendanceYear  = $("#yearFilter").val(),
        AttendanceMonth = $("#monthFilter").val(),
        locationID      = $("#locationFilter").val(),
        error           = 0;
        
    if (locationID == '' || AttendanceMonth == '' || AttendanceYear == '' || locationID == '0' || AttendanceMonth == '0' || AttendanceYear == '0'){
        error = 1;
    }
    if (error != 0) 
        return false;
    else {
        //language conversion 
        generateListing(AttendanceYear,AttendanceMonth,locationID);
    }
}

function generateListing(AttendanceYear,AttendanceMonth,locationID,shiftId)
{
    var data;
    var noOfDays = _getDates(AttendanceYear,AttendanceMonth);
    if(shiftId == undefined)
            data = JSON.stringify({
                "AttendanceYear": AttendanceYear,
                "AttendanceMonth": AttendanceMonth,
                "BaseLocationId": locationID
            });
    else
            data = JSON.stringify({
                "AttendanceYear": AttendanceYear,
                "AttendanceMonth": AttendanceMonth,
                "BaseLocationId": locationID,
                "ShiftId": shiftId
            });

        var endpoint = "monthly-report-day-wise";
        var requesturl = baseURL + prefix + endpoint;
        var settings = {
            "url": requesturl,
            "async": true,
            "crossDomain": true,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "LicKey": LicKey,
                "Content-Type": "application/json",
                "AccessToken": AccessToken,
            },
            "beforeSend": function () {
                $('#loadingBtn').show();
            },
            "complete": function () {
                $('#loadingBtn').hide();
            },
            "data": data
        };
        $.ajax(settings).done(function (response) {
            if (AttendanceMonth == pad_currentMonth)
                is_current_month = 1;
            else 
                is_current_month = 0;

            var data             = response['ResponseData'];
            var locdatalength    = data.length;
            var tabledata        = '';
           /* tabledata = '<table id="example" class="table table-striped table-bordered display" ><thead><tr><th align="center" id="empId">Emp ID</th><th align="center" id="empName">Name</th><th>01</th><th>02</th><th>03</th><th>04</th><th>05</th><th>06</th><th>07</th><th>08</th><th>09</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th><th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th><th align="center" id="present">Present</th><th align="center" id="lateCome">Late Comming</th></tr></thead><tbody>';*/
            tabledata = '<table id="example" class="table table-striped table-bordered display" ><thead><tr><th align="center" id="empId">Emp ID</th><th align="center" id="empName">Name</th>';
            for(i=1; i<=noOfDays; i++)
            {
                tabledata += '<th>'+i+'</th>';
            }
             ;
             tabledata +='<th align="center" id="present">Present</th><th align="center" id="lateCome">Late Comming</th></tr></thead><tbody>';

            if (locdatalength > 0){
                var i;
                for (i = 0; i < locdatalength; i++) {
                    var slno      = i + 1;

                    //For Comp Off Leave List check 
                    var listCompOffDay     = [];
                    var lenCompOff         = data[i]['CompOff'].length;
                    for (l = 0; l < lenCompOff; l++) {
                        var OffDate        = data[i]['CompOff'][l]['OffDate'];
                        var OffDateAry     = OffDate.split("-");
                        var OffDateAryDate = OffDateAry[2];
                        var dayname        = "D" + OffDateAryDate + "_IN";
                        listCompOffDay.push(dayname);
                    }

                    //For HolidayList check
                    var listHolidayListDay = [];
                    var lenHoliday         = data[i]['HolidayList'].length;
                    for (l = 0; l < lenHoliday; l++) {
                        var SetDate        = data[i]['HolidayList'][l]['SetDate'];
                        var SetDateAry     = SetDate.split("-");
                        var SetDateAryDate = SetDateAry[2];
                        var dayname        = "D" + SetDateAryDate + "_IN";
                        listHolidayListDay.push(dayname);
                    }

                    //For LeaveList check 
                    var listLeaveDay         = [];
                    var lenLeaveDateAryDate  = data[i]['Leave'].length;
                    for (l = 0; l < lenLeaveDateAryDate; l++) {
                        var LeaveDate        = data[i]['Leave'][l]['LeaveDate'];
                        var LeaveDateAry     = LeaveDate.split("-");
                        var LeaveDateAryDate = LeaveDateAry[2];
                        var dayname          = "D" + LeaveDateAryDate + "_IN";
                        listLeaveDay.push(dayname);
                    }

                    //For LeaveList check 
                    var listWeekendDay         = [];
                    var lenWeekendAryDate      = data[i]['Weekend'].length;
                    for (l = 0; l < lenWeekendAryDate; l++) {
                        var weekendDate        = data[i]['Weekend'][l];
                        var weekendDateAry     = weekendDate.split("-");
                        var weekendDateAryDate = weekendDateAry[2];
                        var dayname            = "D" + weekendDateAryDate + "_IN";
                        listWeekendDay.push(dayname);
                    }
                
                    var singletrallDays        ='';
                    var presentcounter         = 0;
                    var afterTodayDatetdstatus = 0;
                    for (j = 1; j <= noOfDays; j++) {
                        var dayno        = zeroPad(j);
                        var fulldate     = AttendanceYear + "-" + AttendanceMonth + "-" + dayno;
                        var dayname      = "D" + dayno + "_IN";
                        var labelheader  = "";
                        var singletd     = "";
                        var counter      = j;
                        var colName      = "D" + counter + "_IN";
                        var colNameValue = colName;

                        var dayValue = data[i][colName];
                        if (dayValue == "00:00:00")
                            var isPresent      = 0;
                        else{
                            var isPresent      = 1;
                            presentcounter     = presentcounter + 1;
                            var isPresentLabel = '<span pid="p" class="text-success">✔</span>';
                        }

                        vardatewiseLabelStarttd = '<td title="' + dayValue + '" day="' + dayno + '" date="' + fulldate + '" emp-id="' + data[i]['EmpId'] + '">'
                        HolidayListDayresp      = listHolidayListDay.includes(dayname);
                        WeekendDayresp          = listWeekendDay.includes(dayname);
                        LeaveDayresp            = listLeaveDay.includes(dayname);
                        compoffresp             = listCompOffDay.includes(dayname);
                        if (HolidayListDayresp == true) {
                            if (isPresent == 1)
                                var singletd    = vardatewiseLabelStarttd + isPresentLabel + '/<span pid="" class="text-success font-weight-bold">H</span></td>';
                            else
                                var singletd    = vardatewiseLabelStarttd + '<span  class="text-success font-weight-bold">H</span></td>';
                        }else if (WeekendDayresp == true) {
                            if (isPresent == 1)
                                var singletd    = vardatewiseLabelStarttd + '' + isPresentLabel + '/<span pid="" class="text-primary font-weight-bold">W</span></td>';
                            else
                                var singletd    = vardatewiseLabelStarttd + '<span  class="text-primary font-weight-bold">W</span></td>';
                        } else if (LeaveDayresp == true){
                            var singletd = vardatewiseLabelStarttd + '<span  class="text-danger">✘</span></td>';
                        } else if (compoffresp == true){
                            var singletd = vardatewiseLabelStarttd + '<span  class="text-danger">✘</span></td>';
                        } else {
                            if (isPresent   == 0) 
                                var singletd = vardatewiseLabelStarttd + '<span class="text-danger">✘</span></td>';
                            else 
                                var singletd  = vardatewiseLabelStarttd + isPresentLabel + '</td>';
                        }
                        if (is_current_month == 1) {
                            var daylevel = "D" + j;
                            if (daylevel == TomorrowDateColumn) {
                                afterTodayDatetdstatus = '1';
                            }
                        }
                        if (afterTodayDatetdstatus == '1') {
                            singletrallDays        = singletrallDays + "<td></td>";
                            afterTodayDatetdstatus = '1';
                        }else
                            singletrallDays = singletrallDays + singletd;
                    }
                    var showEmployeeRegistrationId = "'" + data[i]['EmployeeRegistrationId'] + "'";
                    var presenttd = "<td>" + presentcounter + "</td>";
                    var EmpId     = "<td>" + data[i]['EmpId'] + "</td>";
                    var EmpName   = "<td>" + data[i]['EmpName'] + "</td>";
                    var createtr  = "<tr>" + EmpId + EmpName + singletrallDays + presenttd + "</tr>";
                    tabledata = tabledata + createtr;
                }
            } else 
                tabledata += "<tr> <td colspan='34' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr>";
            tabledata      = tabledata + '</tbody></table>';
            $("#listdata").html(tabledata);
            $('#loadingBtn').hide();
            datatableIntialise()
        });
}

function getEmpAttendance(val){
    var btnmonth = $('#btnmonth').val();
    if (val == 1)
        btnmonth = btnmonth - 1;
    else
        btnmonth = btnmonth + 1;
}
var days         = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var selLocation  = $('input[name=sel_location]').val();
$('#locationFilter > option').each(function () {
    var elem = $(this);
    if (elem.val() == selLocation) {
        elem.attr('selected', 'selected');
    }
}) 
$('body').on('click', '#example tbody tr td', function () {
    var elem = $(this);
    if (elem.find('span').attr('pid') == 'p') {
        var date = elem.attr('date');
        var d = new Date(date);
        var selday = elem.attr('day');
        // <!-- var selMonth = monthNames[d.getMonth()]; -->
        // <!-- var selYear = d.getFullYear(); -->
        var empId      = elem.attr('emp-id');
        var endpoint   = "attendance-info";
        var requesturl = baseURL + prefix + endpoint;
        var settings   = {
            "url": requesturl,
            "method": "POST",
            "headers": {
                "AccessToken": AccessToken,
                "LicKey": LicKey,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({"ADDate": date,"EmpId": empId}),
        };
        $.ajax(settings).done(function (response) {
            if (response.category == 1) {
                var data       = response['ResponseData'],
                    EmpName    = data['timesheetdetails'][0]['EmpName'],
                    dayName    = data['timesheetdetails'][0]['DayName'],
                    fulldate   = formatDate(data['timesheetdetails'][0]['ADDate']),
                    
                    TotalHours = data['timesheetdetails'][0]['TotalHours'],
                    FirstSeen  = formatDateTime(data['timesheetdetails'][0]['FirstSeen']),
                    LastSeen   = formatDateTime(data['timesheetdetails'][0]['LastSeen']);

                var html = '<div class="row"><div class="col-md-6"><div class="card punch-status"><div class="card-body"><h5 class="card-title">Timesheet</br> <small class="text-muted">' + dayName + ', ' + fulldate + '</small></h5><div class="punch-det"><h6>Punch In at</h6><p><i class="fa fa-clock"></i>  ' + FirstSeen + '</p></div><div class="punch-info"><div class="punch-hours"><span>' + TotalHours + '</span></div></div><div class="punch-det"><h6>Punch Out at</h6><p><i class="fa fa-clock"></i>  ' + LastSeen + '</p></div></div></div></div>';
                    html += '<div class="col-md-6"><div class="card recent-activity"><div class="card-body"><h5 class="card-title">Activity</h5><div style="height: 335px;overflow-y: auto;"><ul class="res-activity-list">';
                for (var r in data['activitylog']) {
                    var formatedTime = formatDateTime(data['activitylog'][r]['ADTime']);
                    if (r % 2 === 0) {
                        html += '<li><p class="mb-0">Punch In at<span class="res-activity-time" style="padding-left:15px;><i class="fa fa-clock"></i> ' + formatedTime +"   "+'<span>(cameraname :'+ data['activitylog'][r]['CameraName']+') </span>'+'</span></p></li>';
                    } else {
                        html += '<li><p class="mb-0">Punch Out at<span class="res-activity-time" style="padding-left:15px;><i class="fa fa-clock"></i> ' + formatedTime + "   "+'<span>(cameraname :'+ data['activitylog'][r]['CameraName']+') </span>'+'</span></p></li>';
                    }
                }
                html += '</ul></div></div></div></div></div>';
                html += '<div class="row" id="generatePDFId"><div class="col-md-8"><button class="btn btn-primary" id="generatePDF" data-name="'+EmpName+'" onclick="funGeneratePDF()" value="'+EmpName+'-'+fulldate+'">Download</button></div><div class="col-md-4"></div></div>';
            }
            $('#attendance_info .modal-header span#emp-name').text(EmpName);
            $('#attendance_info .modal-body').html(html);
        });
        $('#attendance_info').modal('show');
    }
})

function funGeneratePDF(empName)
{
    var empNameWithDate = $('#generatePDF').val();
    $("#generatePDFId").addClass('d-none');

    var doc = new jsPDF({
        orientation: 'portrait',lineHeight: 0.5
    });
    margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };
    var elementHTML = $('#attendance_info').html();
    var specialElementHandlers = {
        '#elementH': function (element, renderer) {
            return true;
        }
    };
    doc.fromHTML(elementHTML, 10, 10, {
        'width': margins.width,
        'elementHandlers': specialElementHandlers
    });

    doc.save(empNameWithDate+'.pdf');
    $("#generatePDFId").removeClass('d-none');
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

function formatDate(dt)
{
    var d = new Date(dt);
    return newDate = ('0'+d.getDate()).slice(-2)+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+d.getFullYear();
}

function formatDateTime(dtTime)
{
    var dtData = dtTime.split(" ");
    var d = new Date(dtData[0]);
    newDate = ('0'+d.getDate()).slice(-2)+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+d.getFullYear();

    return newDateTime = newDate+' '+dtData[1];
}


function _getDates(year, month) {
  return new Date(year, month, 0).getDate(); // 0 + number of days
}