var projectPath = sessionStorage.getItem('projectPath'),
    baseURL     = sessionStorage.getItem("baseURL"),
    UserType    = sessionStorage.getItem('UserType'),
    message     = sessionStorage.getItem('message'),
    category    = sessionStorage.getItem('category'),
    AccessToken = sessionStorage.getItem("AccessToken"),
    prefix      = sessionStorage.getItem("prefix"),
    LicKey      = sessionStorage.getItem('LicKey');

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
// $("#setdate").attr('min', today);
$("#shiftStart").attr('min', today);
$("#shiftEnd").attr('min', today);
$("#assign_Date").attr('min', today);

var endpoint = "locations";
var requesturl= baseURL + prefix + endpoint;
var settings = {
"url": requesturl,
"method": "POST",
"timeout": 0,
"headers": {
	"LicKey": LicKey,
	"AccessToken": AccessToken
	},
};
$.ajax(settings).done(function (response) {
	var data = response['ResponseData'];	
	var output = '<option value="" id="selectLoc">Select Location</option>';
	for (i in data) {
		output += '<option value='+data[i]["BaseLocationId"]+'>'+data[i]["LocationName"]+'</option>';
	}
	$('#empListLoc').html(output);              					
});

// Api call Employee And Shift
function empchoose(sId,eId,locationId){
	if(locationId == undefined)
		var locationId = $('#empListLoc').val();
	sessionStorage.setItem('locationId', locationId);
	if(locationId !== ''){
		var endpointEmp ='get-employee-locationwise/'+locationId;
		var requesturlEmp= baseURL + prefix + endpointEmp;
		var EmpListApi = {
			"url": requesturlEmp,
			"method": "GET",
			"timeout": 0,
			"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken
			},
		};
		$.ajax(EmpListApi).done(function (response) {
			var data = response['ResponseData'];
			var output = '<option value="">--Select Employee--</option>';
			for (var i in data){
				if(eId === data[i]["EmpId"])
					output += '<option value='+data[i]["EmpId"]+' selected="selected">'+data[i]["EmpName"]+'</option>';
				else
					output += '<option value='+data[i]["EmpId"]+'>'+data[i]["EmpName"]+'</option>';
				
			}
			$('#empList').append(output);	
			$('#empList2').append(output);						
		})

		// API call for shift
		var endpointShift ='get-shift-locationwise/'+locationId;
		var requesturlShift= baseURL + prefix + endpointShift;
		var ShiftListApi = {
			"url": requesturlShift,
			"method": "GET",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken
				},
			};
		$.ajax(ShiftListApi).done(function (response) {
			//console.log(response);
		var data = response['ResponseData'];
		var op   = '';
		var empshiftName = '<option value="">--Select Shift--</option>';
			for (var i in data) {
				// console.log(sId);
				// console.log(data[i]["ShiftMasterId"]);
				// console.log(sId === data[i]["ShiftMasterId"]);
				if(sId === data[i]["ShiftMasterId"])
					empshiftName += '<option value='+ data[i]["ShiftMasterId"] +' selected="selected">'+data[i]["ShiftName"]+'</option>';
				
				else
					empshiftName += '<option value='+ data[i]["ShiftMasterId"] +'>'+data[i]["ShiftName"]+'</option>';
			}
			$('#shiftList').html(empshiftName);
			$('#shiftList2').html(empshiftName);
		})
	}
}

//Add Button Click
function assignNewShift(){
	$('#empList').html('<option></option>');
	$('#empListLoc').val('');
	$('#shiftList').html('<option></option>');
	$('input[name=from_date]').val('');
	$('input[name=to_date]').val('');
	$('#empList').css('border', '1px solid #dee2e6');
	$('#empListLoc').css('border', '1px solid #dee2e6');
	$('#shiftList').css('border', '1px solid #dee2e6');
	$('#shiftStart').css('border', '1px solid #dee2e6');
	$('#shiftEnd').css('border', '1px solid #dee2e6');
}

//Assign shift API
function submitBtn(){
	var EmployeeId      = $('#empList').val(),
	    BaseLocationId  = $('#empListLoc').val(),
	    ShiftId         = $('select[name=shift_id] option').filter(':selected').val(),
	    startTime       = $('input[name=from_date]').val(),
	    endTime         = $('input[name=to_date]').val(),
	    dt              = startTime,
	    Formateddt      = new Date(dt),
	    Mon             = Formateddt.getMonth()+1,
	    Month           = Mon.toString(),
		EmpId           = EmployeeId.toString(),
		locationId      = sessionStorage.getItem('locationId'),
	    endpointSave    = 'assignshift/'+locationId,
	    requesturlSave  = baseURL+prefix+endpointSave,
	    err_msg = 0;
	if($('#empList').val() == ''){
		$('#empListSelect').addClass('has-error');
		err_msg = 1;
	}else{
		$('#empListSelect').removeClass('has-error');
	}
	if($('#empListLoc').val() == ''){
		$('#empListLocSelect').addClass('has-error');
		err_msg = 1;
	}else{
		$('#empListLocSelect').removeClass('has-error');
	}
	if($('#shiftList').val() == ''){
		$('#shiftListSelect').addClass('has-error');
		err_msg = 1;
	}else {
		$('#shiftListSelect').removeClass('has-error');
	}
	if($('#shiftStart').val() == ''){
		$('#shiftStart').css('border', '1px solid red');
		err_msg = 1;
	}else {
		$('#shiftStart').css('border', '1px solid #dee2e6');
	}
	if($('#shiftEnd').val() == ''){
		$('#shiftEnd').css('border', '1px solid red');
		err_msg = 1;
	}else{
		$('#shiftEnd').css('border', '1px solid #dee2e6');
	}
	if(err_msg != 0){
		return false;
	}else{
	var EmpShiftSave = {
		"url": requesturlSave,
		"method": "POST",
		"timeout": 0,
		"headers": {
		"LicKey": LicKey,
		"AccessToken": AccessToken,
		"Content-Type": "application/json",
		},
		"data": JSON.stringify({"ShiftMasterId":ShiftId,"BaseLocationId":BaseLocationId,"EmpId":EmpId,"FromDate":startTime,"ToDate":endTime}),
		};
		$.ajax(EmpShiftSave).done(function (response) {
			if (response['category'] == '0') {
				$("#show_error1").show().text(response['message']);
				setTimeout(function () {$("#show_error1").hide();}, 5000);
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "empshiftmapping.html");
			}
		});
	}
}

//Delete AssignShift API
function confirmForDelete(EmployeeShiftHistoryId) {
	var r = confirm("Do you want to delete this shift?");
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

//DataTable Initialization
function reInitializeDataTable() {
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

// Api Call For Shift Filter
var vardate = '';
var searchdateNo = '';
$('body').on('change', 'input[name=setDate]', function () {
	vardate = $('#setdate').val();
	$("#setdate").attr('value', vardate);
	$("#headerData").attr('value', vardate);
	ShowListing(vardate);
});

if (vardate == '') {
	var d = new Date();
	var vardate = dateFormat(d);
	$("#headerData").attr('value', vardate);
	$("#setdate").attr('value', vardate);
	ShowListing(vardate);
}

//listing API
function ShowListing(dt) {
	var dtData = dt;
	var endpoint = "get-employee-shift-history";
	var requesturl = baseURL + prefix + endpoint;
	//var dtData = $("#setdate").val();
	var settings = {
		"url": requesturl,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"SearchDate": dtData
		}),
	};
	$.ajax(settings).done(function (response) {
		// console.log(response);
		var today_title = new Date();
		var dd          = String(today_title.getDate()).padStart(2, '0');
		var mm          = String(today_title.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy        = today_title.getFullYear();
		today_title     = yyyy + '-' + mm + '-' + dd;
		var data        = response['ResponseData'];
		
		var tabledata = '';
			tabledata = '<table id="example" class="table table-striped table-bordered"><thead> <tr><th align="center" id="slno">Sl.No.</th><th id="EmpId">Employee ID</th><th id="EmpName">Employee Name</th><th id="Loc">Location</th><th id="stName">Shift Name</th><th id="StartTime">Start Time</th><th id="EndTime">End Time</th><th id="Act">Action</th> </tr></thead><tbody>';
		if (response['category'] == '1'){
		var locdatalength = data.length;
		if (locdatalength > 0) {
			var i;
			var LeaveType = '';
			for (i = 0; i < locdatalength; i++) {
				var slno       = i + 1,
				    now        = new Date(),
                    createDate = data[i]['CreatedDate'];

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
				sessionStorage.setItem('empID', data[i]['EmpId']);

				var td_edit = "<a  class='dropdown-item' data-toggle='modal' data-target='#editMyModal' title='Edit' onclick='editData("+data[i]['EmployeeShiftHistoryId']+","+data[i]['BaseLocationId']+")'><i class='fa fa-pencil m-r-5'></i>"+'Edit'+"</a>";
				var td_isdelete = '<a  class="dropdown-item" onclick="javascript:confirmForDelete(' + data[i]["EmployeeShiftHistoryId"] + ')" title="Delete"><i class="fa fa-trash-o m-r-5"></i>'+"Delete"+'</a>';

				var tdaction        = '<div class="dropdown dropdown-action"><a class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_edit + td_isdelete +'</div></div>';
				if (dtData > today_title){
					var tdaction        = '<td class="text-right">'+tdaction+'</td>';
				}else{
					var tdaction        = '<td>'+'</td>';
				}
				

				var Td_Data     =  "<td>" + slno + "</td>"
								+  "<td>" + data[i]['EmpId'] + "</td>"
								+  "<td>" + data[i]['EmpName'] + "</td>"
								+  "<td>" + data[i]['LocationName'] + "</td>"
								+  "<td>" + data[i]['ShiftName'] + "</td>"
								+	FirstTime + LastTime + tdaction;

				var createtr = "<tr>" + Td_Data + "</tr>";
				tabledata = tabledata + createtr;
			}
		}
	}else{
		tabledata += "<tr> <td colspan='8' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr>";
		tabledata += '</tbody></table>';
	}
		$("#tableData").html(tabledata);
		reInitializeDataTable();
	});
}

//Edit assignshift Data
function editData(shId,bId){
	var endpoint        ='assignshift/'+shId;	  
	var gettingempshift = 
	{
	"url":  baseURL + prefix + endpoint,
	"method": "GET",
	"timeout": 0,
	"headers": {
		"LicKey": LicKey,
		"Content-Type": "application/json",
		"AccessToken": AccessToken
	  	}
	};
	$.ajax(gettingempshift).done(function (response){ 
	var data = response.ResponseData;
		empchoose(data[0]['ShiftMasterId'],data[0]['EmpId'],bId);
		$('#assign_Date').val(dateFormat(data[0]['StartDate']));
		$('#regEId').val(shId);
	})
}

function updateBtn(){
	var empID          = $('#empList2').val(),
		ShiftMasterId  = $("#shiftList2").val(),
		StartDt        = $('#assign_Date').val(),
		regId          = $('#regEId').val(),
		endpoint       = 'assignshift/'+regId,          
		dt             = StartDt,
		Formateddt     = new Date(dt),
		Mon            = Formateddt.getMonth()+1,
		Month          = Mon.toString(),
		requesturl     = baseURL+prefix+endpoint,   
		err_msg        = 0;

	if($('#shiftList2').val() == ''){
		$('#shiftList2').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#shiftList2').css('border', '1px solid #dee2e6');
	if($('#assign_Date').val() == ''){
		$('#assign_Date').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#assign_Date').css('border', '1px solid #dee2e6');
	if(err_msg != 0)
		return false;
	else{
		var settings = {
		"url": requesturl,
		"method": "PUT",
		"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"Content-Type": "application/json",
				"AccessToken": AccessToken,	
			},
		  "data": JSON.stringify({"EmpId":empID,"ShiftMasterId":ShiftMasterId,"AssignDate":StartDt}),
		};
		$.ajax(settings).done(function (response) { 
			if (response['category'] == '0') {
				$("#show_error2").show().text(response['message']);
				setTimeout(function () {
				$("#show_error2").hide();
				}, 4000);
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "empshiftmapping.html");
			}	
		})
	   }
}

//DateFormate
function dateFormat(data) {
	if (data     != '' && data != '0000-00-00' && data != undefined && data != null) {
		var date  = new Date(data);
		var day   = '', month = '', year = '', fullDate = '',
		getMonth  = date.getMonth() + 1;
		if (date.getDate() <= 9)
			day   = '0' + date.getDate();
		else
			day   = date.getDate();
		if (date.getMonth() + 1 <= 9)
			month = '0' + getMonth;
		else
			month = getMonth;
		year      = date.getFullYear();

		fullDate  = year + '-' + month + '-' + day;
		return fullDate;
	} else
		return '';
}