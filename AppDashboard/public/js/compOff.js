var LicKey         = sessionStorage.getItem('LicKey'),
    projectPath    = sessionStorage.getItem('projectPath'),
	baseURL        = sessionStorage.getItem("baseURL"),
	prefix         = sessionStorage.getItem("prefix"),
	AccessToken    = sessionStorage.getItem("AccessToken"),
	endpoint       = "compoffleaves",
	endpointstatus = "compoff-leave-status",
    GroupArr       = '',
    message        = sessionStorage.getItem('message'),
	requesturl     = baseURL + prefix + endpoint;

	
$(".select2").select2();
if (message != null) {
		$("#messageId").attr('class', 'alert alert-success text-center')
	$("#messageId").show().text(message);
	setTimeout(function () {
		$("#messageId").hide();
	}, 4000);
	sessionStorage.removeItem('message');
}

//Employee data dropdown
function empData(idEmp)
{
	var endpointEmp    = 'employees';
	var settingsEmp = {
		"url": baseURL + prefix + endpointEmp,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settingsEmp).done(function (response) {
		var data1 = response['ResponseData'];
		GroupArr = GroupArr + '<option value="">--Select Employee--</option>';
		for (var j in data1) {
			if (idEmp === data1[j]['EmpId']) {
				GroupArr = GroupArr + '<option value="' + data1[j]['EmpId'] + '"  selected="selected">' + data1[j]['EmpName'] + '</option>';
				$('#emp_location').val(data1[j]['BaseLocationId']);
			}else{
				GroupArr = GroupArr + '<option value="' + data1[j]['EmpId'] + '">' + data1[j]['EmpName'] + '</option>';
			}
			$('#location_id').val(data1[j]['BaseLocationId']);
		}
		$('#empList').html(GroupArr);
	});
}


$(document).ready(function () {
	var today = new Date().toISOString().split('T')[0];
	document.getElementsByName("offDate")[0].setAttribute('min', today);
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
        var tabledata = '<table id="example" class="table table-striped table-bordered display"><thead> <tr><th align="center" id="slno">Sl.No.</th><th id="EmployeeID">Employee ID</th><th id="EmployeeName">Employee Name</th><th id="Location">Location</th><th id="OffDate">Off Date</th><th id="Status">Status</th><th class="text-center" id="Action">Action</th></tr></thead><tbody>';
		var data = response['ResponseData'].reverse();
		if (response['category'] == '1')
		var locdatalength = data.length;
		if (locdatalength > 0) {
			var i;
			var td = '';
			var status = '';
			for (i = 0; i < locdatalength; i++) {
				var slno = i + 1;
				if (data[i]['Status'] == 0) {
					status = "<td>" + 'Pending' + "</td>";
					var td_edit     = '<a class="dropdown-item" title="Edit" data-toggle="modal" data-target="#myModal" onclick="javascript:return editData('+data[i]['CompOffId']+');" ><i class="fa fa-pencil m-r-5"></i> '+'Edit'+'</a>';
					var td_isdelete = '<a  id="deleteId" class="dropdown-item" title="Delete" onclick="javascript:return confirmDelete('+data[i]['CompOffId']+');" ><i class="fa fa-trash-o m-r-5"></i> '+'Delete'+'</a>';

					var tdaction    = '<td class="text-right"><div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_edit + td_isdelete +'</div></div></td>';
				}
				else if (data[i]['Status'] == 1)
				{
					status         = "<td class='text-success'>" + 'Taken' + "</td>";
					var tdaction   = '<td>'+""+'</td>';
				}
				else if (data[i]['Status'] == 2) 
				{
					status = "<td class='text-danger'>" + 'Cancelled' + "</td>";
					var tdaction   = '<td>'+""+'</td>';
				}

				var td_Data       = "<td>" + slno + "</td>"
								  + "<td>" + data[i]['EmpId'] + "</td>"
								  + "<td>" + data[i]['EmpName'] + "</td>"
								  + "<td>" + data[i]['LocationName'] + "</td>"
								  + "<td>" + dateFormat(data[i]['OffDate']) + "</td>"
								  + status + tdaction ;
				
				var createtr = "<tr>"  + td_Data + "</tr>";

				tabledata = tabledata + createtr;
			}
		} else {
			tabledata += "<tr> <td colspan='7' align='center'><span style='color:red;'><strong>No List Found </strong></span></td></tr>";
		}
        tabledata += '</tbody></table>';
		$("#listData").html(tabledata);
		datatableIntialise()
	});
})


//DataTable Init
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

//Status API
var settingsStatus = {
	"url": baseURL + prefix + endpointstatus,
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
	empData();
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
	$("#offDate").val('');
	$("#empList").val('');
	$("#submitId").text('Submit');
	$("#submitId").val('Submit');
	$("#mdMitle").text('Add Compensatory Leave');
	$('#offDate').css('border', '1px solid #dee2e6');
	$('#empList').css('border', '1px solid #dee2e6');
}

//edit button click
function editData(eId){
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
	$("#mdMitle").text('Edit Compensatory Leave');
	$("#submitId").text('Update');
	$("#submitId").val('Update');
	$('#offDate').css('border', '1px solid #dee2e6');
	$('#empList').css('border', '1px solid #dee2e6');
	var endpoint = 'compoffleave/'+eId;
	var settings = {
		"url": baseURL + prefix + endpoint,
		"method": "GET",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settings).done(function (response) {
		var data       = response['ResponseData'];
		var dtpicker   = dateFormat(data[0]['OffDate']);
		var vardate    = dtpicker.split("-").reverse().join("-");
		empData(data[0]['EmpId']);
		$("#offDate").val(vardate);
		$("#compOffId").val(data[0]['CompOffId']);
	})
}

//Add And Edit API
function submitBtn(){
	var todayDate   = new Date(),
		cId         = $("#compOffId").val(),
		EmpId       = $("#empList").val(),
		OffDate     = $("#offDate").val(),
		location_id = $("#location_id").val(),
		id          = Math.floor((Math.random() * 10) + 1),
		btnVal      = $('#submitId').val();
		endpointSub = "compoffleave/",
		err_msg     = 0;
	if (OffDate == '') {
		$('#offDate').css('border', '1px solid red');
		err_msg     = 1;
	}
	else
	$('#offDate').css('border', '1px solid #dee2e6');
	if (EmpId == '') {
		$('.select2-selection').attr('class','select2-selection select2-selection--single red');
		err_msg     = 1;
	}
	else
		$('.select2-selection').attr('class','select2-selection select2-selection--single');
	if (err_msg != 0) {
		return false;
	}
	if(btnVal != 'Update')
	{
		var settings = {
			"url": baseURL + prefix + endpointSub + id, 
			"method": "POST",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"EmpId": EmpId,
				"BaseLocationId": location_id,                   
				"OffDate": OffDate,
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
				window.location.href = (projectPath + "compoff.html");
			}
		});
	}else{
		var endPoint = "compoffleave/"+cId;
		var settings = {
			"url": baseURL + prefix + endPoint,
			"method": "PUT",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"EmpId": EmpId,
				"BaseLocationId": location_id,
				"OffDate": OffDate,
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
				window.location.href = (projectPath + "compoff.html");
			}
		});
	}
}


//Delete API
function confirmDelete(offid) {
	var endpoint = "compoffleave/",
	requesturlDelete = baseURL + prefix + endpoint + offid;
	var r = confirm("Do you want to delete this compOff?");
	if (r == true) {
		var settings = {
			"url": requesturlDelete,
			"method": "DELETE",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "compoff.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "compoff.html");
			}
		});
	}
}

//Date Formate
function dateFormat(data) {
	if (data != '' && data != '0000-00-00' && data != undefined && data != null) {
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

		fullDate     = day + '-' + month + '-' + year;
		return fullDate;
	} else
		return '';
}