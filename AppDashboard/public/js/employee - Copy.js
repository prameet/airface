var projectPath    = sessionStorage.getItem('projectPath'); 
    message        = sessionStorage.getItem('message'),
    baseURL        = sessionStorage.getItem("baseURL"),
    langName       = sessionStorage.getItem("sitelang"),	
    AccessToken    = sessionStorage.getItem("AccessToken"),
    LicKey         = sessionStorage.getItem('LicKey'),
    message        = sessionStorage.getItem('message'),
	prefix         = sessionStorage.getItem("prefix");

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
if(AccessToken == '' || AccessToken == null || AccessToken == 'undefined'){
 	window.location.href= projectPath;
}

$('body').on('click','#closeE', function(){
	$('#existingIdPopUp').toggleClass('show');
	$('#existingIdPopUp').css({"display": "none"});
})
// Location All Data
function locationData(locId) {
	var endPointloc    = "locations";
	var requesturlList = baseURL + prefix + endPointloc;
	var locAllData     = {
		"url"     : requesturlList,
		"method"  : "POST",
		"headers" : {
			"AccessToken": AccessToken,
			"LicKey"     : LicKey,
		},
	};
	$.ajax(locAllData).done(function (response) {
		var data1 = response['ResponseData'];
		var GroupArr     = '';
			GroupArr     += '<option value="">Open this select menu</option>';
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

//CSV Upload
$( "#csvUpload" ).click(function(e) {
	e.preventDefault();
	var BaseLoc          = 1
	var form             = new FormData();
	form.append("BaseLocationId", BaseLoc);
	var fileUpload       = $('input[name=csv_file]')[0].files[0];   
	if(fileUpload  === undefined || fileUpload == null){
		$("#CCSVFile").css("border","1px solid red");
		return false;
	}          		
	form.append("file", fileUpload);
	var endpoint         = "employee-bulk-upload";
	var requesturlcsvFile= baseURL+prefix+endpoint;
	var csvFileSettings  = {
		"url": requesturlcsvFile,
		"method" : "POST",
		"timeout": 0,
		"headers": {
			"LicKey"     : LicKey,
			"AccessToken": AccessToken
		},
		"processData": false,
		"mimeType"   : "multipart/form-data",
		"contentType": false,
		"data"       : form
	};   
	$.ajax(csvFileSettings).done(function (response1) {
		console.log(response1);
		var data= $.parseJSON(response1);
		if(data['category'] == '0')
		{						
			$("#show_error").html(data['message']);
			$("#show_error").show();
		}
		else
		{						
			$('#importCSV').toggleClass('show');
			$('#importCSV').css({"display": "block", "padding-right":"17px"});
			var tabledata = '';
			var errorData = data['errorData'];
			var cntErrorDatalength = errorData.length;
			if(cntErrorDatalength > 0)
			{
				var i;
				var td = '';
				for (i = 0; i < cntErrorDatalength; i++) 
				{
					errorcreatetr = '';
					var messageCode = errorData[i]['message-code'];
					var message = errorData[i]['message'];
					cntMessageCode = messageCode.length;
					if(messageCode.includes(2)){
						var indexOfMessageCode = messageCode.indexOf(2);
						var messageText = message[indexOfMessageCode];
						var errorEmployeeId = "<td class='text-danger' title='"+messageText+"'>"+errorData[i]['EmpId']+"</td>";
					} else {
						var errorEmployeeId = "<td>"+errorData[i]['EmpId']+"</td>";
					} 
					
					if(messageCode.includes(1) || messageCode.includes(4)){
						if(messageCode.includes(1)){
							var indexOfMessageCode = messageCode.indexOf(1);
							var messageText = message[indexOfMessageCode];
							var errorMailId = "<td class='text-danger' title='"+messageText+"'>"+errorData[i]['EmailId']+"</td>";
						} else{
							if(messageCode.includes(4)){
								var indexOfMessageCode = messageCode.indexOf(4);
								var messageText = message[indexOfMessageCode];
								var errorMailId = "<td class='text-danger' title='"+messageText+"'>"+errorData[i]['EmailId']+"</td>";
							} else{
								var errorMailId = "<td>"+errorData[i]['EmailId']+"</td>";
							}
						}
					} else{
						var errorMailId = "<td>"+errorData[i]['EmailId']+"</td>";
					}
					if(messageCode.includes(3)){
						var indexOfMessageCode = messageCode.indexOf(3);
						var messageText = message[indexOfMessageCode];
						var errorMobileNo = "<td class='text-danger' title='"+messageText+"'>"+errorData[i]['MobileNo']+"</td>";	
					} else {
						var errorMobileNo = "<td>"+errorData[i]['MobileNo']+"</td>";	
					} 
					var errorEmployeeName = "<td>"+errorData[i]['EmpName']+"</td>";
					var errorMessage      = "<td class='text-danger'>"+errorData[i]['message']+"</td>";
					var successlocNo      = "<td>"+errorData[i]['BaseLocationId']+"</td>";
					var errorcreatetr = "<tr class='table-danger'>"+errorEmployeeId+errorEmployeeName+errorMailId+errorMobileNo+successlocNo+"</tr>";
					tabledata = tabledata + errorcreatetr;	
				}
			}
			var successData = data['successData'];
			var cntSuccessDatalength = successData.length;
			if(cntSuccessDatalength > 0)
			{
				var i;
				var td = '';
				for (i = 0; i < cntSuccessDatalength; i++) 
				{
					successcreatetr         = '';
					var successEmployeeId   = "<td >"+successData[i]['EmpId']+"</td>";
					var successEmployeeName = "<td>"+successData[i]['EmpName']+"</td>";
					var successMailId       = "<td>"+successData[i]['EmailId']+"</td>";
					var successMobileNo     = "<td>"+successData[i]['MobileNo']+"</td>";				
					var successlocNo        = "<td>"+successData[i]['BaseLocationId']+"</td>";		
					var successMessage      = "<td class='text-success'>"+successData[i]['message']+"</td>";	
					var successcreatetr     = "<tr class='table-success'>"+successEmployeeId+successEmployeeName+successMailId+successMobileNo+successlocNo+"</tr>";
					tabledata = tabledata + successcreatetr;	
				}
			}		
			$("#list_data").html(tabledata);	
		}
	})
});
$('body').on('click','#closeM', function(){
	$('#importCSV').toggleClass('show');
	$('#importCSV').css({"display": "none"});
})

//DataTable Initialization
function datatableIntialise()
{
	var prevLabel= "Previous";
	var nextLabel= "Next";
	var searchLabel= "Search";
	var excelLabel= "Excel";
	var pdfLabel= "Pdf";
	var printLabel= "Print";
	var datatableInfo= "Showing _START_ to _END_ of _TOTAL_ entries";
	$('#example').DataTable( {
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

$(document).ready(function(){
	$('#missingField').html('either duplicate  data or missing any field.');
	locationData();
	//Api for Employee Listing 
	var endpoint = "allemployees";
	var requesturl= baseURL+prefix+endpoint;
	var EmpListApi = {
		"url": requesturl,
		"method": "POST",
		"timeout": 0,
		"headers": {
		"accessToken": AccessToken,
		"licKey": LicKey
		},
	};
	$.ajax(EmpListApi).done(function (response) {
        var tabledata = '';
			tabledata += '<table id="example" class="table table-striped custom-table"><thead><tr><th align="center" id="slNo">Sl.No.</th><th id="empId">Employee ID</th><th id="name">Name</th><th id="lname">Location</th><th id="mailId">Email ID</th><th id="mobNo">Mobile No</th><th id="cDt">Created Date</th><th class="text-right no-sort" id="act">Action</th></tr></thead><tbody>';
			var data             = response.ResponseData;
			var cntdatalength    = data.length;
			if(cntdatalength > 0){  
				var i;
				for (var i = 0; i < cntdatalength; i++) {
					var slno            = i+1;
					//EnRoll
					var onclickAttr        = "javascript:confirmForEnrll('"+ data[i]['EmpId']+"','"+ data[i]['BaseLocationId']+"','"+data[i]['EmployeeRegistrationId']+"','"+data[i]['EmailId']+"',"+data[i]['IsEnrolled']+")";
					
					if(data[i]['IsEnrolled'] == '1')
						var td_isenroll  = '<a class="dropdown-item" onclick='+onclickAttr+' title="Re-Enroll"><i class="fa fa-camera m-r-5 text-success"></i> '+'Re-Enroll'+'</a>';
					else
						var td_isenroll   = '<a class="dropdown-item" onclick='+onclickAttr+' title="Enroll" ><i class="fa fa-camera m-r-5 text-info"></i> '+'Enroll'+'</a>';

					var td_edit           = '<a class="dropdown-item" title="Edit" data-toggle="modal" data-target="#add_employee" onclick="javascript:return editData('+data[i]['EmployeeRegistrationId']+');" ><i class="fa fa-pencil m-r-5"></i> '+'Edit'+'</a>';
					
					var td_isdelete       = '<a id="deleteId" title="Delete" class="dropdown-item" onclick="javascript:return confirmForDelete('+data[i]['EmployeeRegistrationId']+');"><i class="fa fa-trash-o m-r-5"></i> '+'Delete'+'</a>';
					
					if (data[i]['IsActive'] == 1) 		
					{
						var td_isactive   = '<a class="dropdown-item" onclick="statusupdate(' +data[i]['EmployeeRegistrationId']+ ', '+data[i]['IsActive']+')"  title="Active"><i class="fa fa-check m-r-5 text-success"></i> '+'Active'+'</a>';
						var status        = "Active";
					}
					else
					{
						var td_isactive = '<a class="dropdown-item" href="javascript:void(0);" onclick="statusupdate(' +data[i]['EmployeeRegistrationId']+ ', '+data[i]['IsActive']+')" title="Inactive"><i class="fa fa-times m-r-5 text-danger"></i> '+'Inactive'+'</a>';
						var status        = "Inactive";
					}

					if(data[i]['ImagePath'] != null && data[i]['ImagePath'] != '')
						var imgurl = baseURL+data[i]['ImagePath'];
					else
						var imgurl = 'static/assets/img/user.png';
					var empData    = '<img class="rounded-circle"  width="40" height="40" src="' + imgurl + '" >'+" "+ data[i]['EmpName'];

					var td_data    =	"<td>" + slno+"</td>" +
										"<td>" + data[i]['EmpId'] + "</td>" + 
										"<td>" + empData + "</td>" + 
										"<td>" + data[i]['LocationName'] + "</td>" +
										"<td>" + data[i]['EmailId'] + "</td>" +
										"<td>" + data[i]['MobileNo'] + "</td>" +
										"<td>" + dateFormat(data[i]['CreatedDate']) + "</td>";
				
					var tdaction        = '<td class="text-right"><div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+td_isenroll+td_edit+td_isdelete+td_isactive+'</div></div></td>';

					var createtr        = "<tr>" + td_data + tdaction + "</tr>";
					tabledata          += createtr; 	
				}  
				tabledata              += '</tbody></table>';			
			}else {
			tabledata                  += "<tr> <td colspan='8' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr></tbody></table>";
			}
			$("#listdata").html(tabledata);
			datatableIntialise()
	});
});


//Add Modal
function addBtnClick(){
	$('#empname').val("");
	$('#empid').val("");
	$('#mobileNo').val("");
	$("#emailid").val("");
	$('#locId').val("");
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
	$('#locId').css('border', '1px solid #dee2e6');
	$('#empname').css('border', '1px solid #dee2e6');
	$('#empid').css('border', '1px solid #dee2e6');
	$('#mobileNo').css('border', '1px solid #dee2e6');
	$("#emailid").css('border', '1px solid #dee2e6');
	$('#empid').attr('disabled', false);
	$('#Add_Edit').html('Add Employee');
	$('#btnSubmit').val('Submit');
	$('#btnSubmit').html('Submit');
}

//Edit Modal
function editData(empReg){
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
	$('#locId').css('border', '1px solid #dee2e6');
	$('#empname').css('border', '1px solid #dee2e6');
	$('#empid').css('border', '1px solid #dee2e6');
	$('#mobileNo').css('border', '1px solid #dee2e6');
	$("#emailid").css('border', '1px solid #dee2e6');
	$('#empid').attr('disabled', true);
	$('#Add_Edit').html('Edit Employee');
	$('#btnSubmit').val('Update');
	$('#btnSubmit').html('Update');
	var endPiont = "employee/"+ empReg;
	var editEmployee = {
		"url": baseURL+prefix+endPiont,
		"method": "GET",
		"timeout": 0,
		"headers": {
		"LicKey": LicKey,
		"Content-Type": "application/json",
		"AccessToken": AccessToken,
		},
	};
	$.ajax(editEmployee).done(function (response){
		var data = response.ResponseData;
		$('#empname').val(data[0]['EmpName']);
		$('#empid').val(data[0]['EmpId']);
		$('#mobileNo').val(data[0]['MobileNo']);
		$("#emailid").val(data[0]['EmailId']);
		locationData(data[0]['BaseLocationId']);
		$('#empRegId').val(data[0]['EmployeeRegistrationId']);
	})
}

// Add&&Update Employee
function submitBtnfrm()
{
    var emp_name              = $("#empname").val();
    var emp_id                = $("#empid").val();
    var email_id              = $("#emailid").val();
	var mobile_no             = $("#mobileNo").val();
	var locData               = $("#locId option:selected").val();
    var button                = $("#btnSubmit").val();
	var error                 = 0;
	if(locData == ''){ 
		$('.select2-selection').attr('class', 'select2-selection select2-selection--single red');
		error = 1;
	}else
		$('.select2-selection').attr('class', 'select2-selection select2-selection--single');
    if(emp_name == ''){
		$('#empname').css('border', '1px solid red');
        error = 1;
	}else 
		{
		const re = /^[a-zA-Z ]*$/;
		if (re.test(emp_name) == false) {
			$("#empname").val('');
			$("#empname").css('border', '1px solid red');
			$("#empname").prop("placeholder", "Special character and numbers are not allowed!");
			error = 1;
		} else
		$('#empname').css('border', '1px solid #dee2e6');
		}
	
	if(emp_id == ''){
		$('#empid').css('border', '1px solid red');
		error = 1;
	}else 
		$('#empid').css('border', '1px solid #dee2e6');
    if(mobile_no == ''){ 
		$('#mobileNo').css('border', '1px solid red');
		error = 1;
    }else
		$('#mobileNo').css('border', '1px solid #dee2e6');
	if (email_id == '') {
		$("#emailid").css('border', '1px solid red');
		$("#emailid").attr("placeholder", "Enter Email ID");
		error = 1;
	} else {
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(email_id)) {
			$("#emailid").val('');
			$("#emailid").css('border', '1px solid red');
			$("#emailid").prop("placeholder", "Enter Valid Email ID!");
			error = 1;
		} else
			$("#emailid").css('border', '1px solid #dee2e6');
	}

    if(error != 0) 
        return false;
    else
    {
		if(button == 'Submit')
		{
			var rNo       = Math.floor((Math.random() * 10) + 1);
			var endpoint  = "employee/" + rNo;
			var requesturl= baseURL+prefix+endpoint; 
			var settings  = {
				"url": requesturl,
				"method" : "POST",
				"timeout": 0,
				"headers": {
					"LicKey"      : LicKey,
					"AccessToken" : AccessToken,
					"Content-Type": "application/json"
				},
				"data": JSON.stringify({"EmpId":emp_id,"EmpName":emp_name,"EmailId":email_id,"MobileNo":mobile_no,"BaseLocationId":locData})
			};	  
			$.ajax(settings).done(function (response) {
				if (response['category'] == '0') {
					$("#show_error1").html(response['message']);
					$("#show_error1").show();
					setTimeout(function () {$("#show_error1").hide();}, 5000);
				} else {
					sessionStorage.setItem('message', response['message']);
					window.location.href = (projectPath + "employeelist.html");
				}       
			});	
		}else{
			var empReg        = $('#empRegId').val();
			var endPoint      = "employee/"+empReg;
			var updateEmpcall = {					 
				"url": baseURL+prefix+endPoint,
				"method": "PUT",
				"timeout": 0,
				"headers": {
					"LicKey": LicKey,
					"Content-Type": "application/json",
					"AccessToken": AccessToken
				},
				"data": JSON.stringify({"EmpId":emp_id,"EmpName":emp_name,"EmailId":email_id,"MobileNo":mobile_no,"BaseLocationId":locData})
			};		
			$.ajax(updateEmpcall).done(function (response){ 
				if (response['category'] == '0') {
					$("#show_error1").html(response['message']);
					$("#show_error1").show();
					setTimeout(function () {$("#show_error1").hide();}, 5000);
				} else {
					sessionStorage.setItem('message', response['message']);
					window.location.href = (projectPath + "employeelist.html");
				}
			})		
		}					
    }
}

//Date formate
function dateFormat(data) {
	if (data != '' && data != '0000-00-00' && data != undefined && data != null) {
		var date      = new Date(data);
		var day       = '', month = '', year = '', fullDate = '';
		var getMonth  = date.getMonth() + 1;
		if (date.getDate() <= 9)
			day       = '0' + date.getDate();
		else
			day       = date.getDate();
		if (date.getMonth() + 1 <= 9)
			month     = '0' + getMonth;
		else
			month     = getMonth;
		year          = date.getFullYear();
		fullDate      = day + '-' + month + '-' + year;
		return fullDate;
	} else
		return '';
}

// Temporary Delete
function confirmForDelete(id){
	var r = confirm("Do you want to delete this employee ?");
	if (r == true) {
		var endpointEmp = "employee-temp-delete/" + id;
		var requesturlEmp = baseURL + prefix + endpointEmp;
		var settingsDelete = {
			"url": requesturlEmp,
			"method": "PUT",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken
			},
		};
		$.ajax(settingsDelete).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('message', response['message']);
			} else {
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "employeelist.html");
			}
		});
	}
}

// confirm for Active/Deactive
function statusupdate(EId, is_active) {
	var endpointAct = "employee-status/" + EId;
	if (is_active === 1) 
		var r = confirm("Do you want to deactivate the employee?");
	else
		var r = confirm("Do you want to activate the employee?");

	if (r == true) {
		var settings = {
			"url": baseURL + prefix + endpointAct,
			"method": "PUT",
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken
			},
			"data": ({
				"IsActive": is_active
			}),
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('message', response['message']);
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "employeelist.html");
			}
		})
	}
}

// Confirm for Enroll
function confirmForEnrll(empid, baseLocId, EmployeeRegistrationId, EmailId, IsEnrolled) {
	if (IsEnrolled == 1)
		var r = confirm("Do you want to Re-enroll the employee?");
	else
		var r = confirm("Do you want to Enroll the employee?");

		if (r == true) {
			sessionStorage.setItem('EnrollEmpid', empid);
			sessionStorage.setItem('EnrollbLoc', baseLocId);
			sessionStorage.setItem('Enrollmail', EmailId);
			sessionStorage.setItem('EnrollmasterID', EmployeeRegistrationId);
			window.location.href = (projectPath + "enroll.html");
		}
}

//Employee Id Duplicate check
$("#empid").focusout(function(){
	var Emp= $("#empid").val();
	var endpointEmpVerify= "employee-verify/"+Emp;
	var requesturlEmpVerify= baseURL + prefix + endpointEmpVerify;
	var EmpVerify = {
	"url": requesturlEmpVerify,
	"async": true, 
	"crossDomain": true,
	"method": "GET",
	"timeout": 0,
	"headers": {
	"LicKey": LicKey,
	"AccessToken": AccessToken
	 },
	};
	$.ajax(EmpVerify).done(function (response) { 
		if(response['category'] == '1'){
			var data = response['ResponseData'];
			var Del= data[0]['IsDelete'];
			if(response['category'] == '1')
			{  
				$('.emp-check').html('✔ Employee ID already exists!!');
				$('.emp-check').show();
				$('#employeeid').val('');
				if(Del == '1'){
					$('#existingIdPopUp').toggleClass('show');
					$('#existingIdPopUp').css({"display": "block"});
					var data = response['ResponseData'];
					var cntdatalength = data.length;
					if(cntdatalength > 0){  
						var empid= data[0]['EmpId'];
						localStorage.setItem('Empid', empid);
						$("#nameEmp2").html(data[0]['EmpName']);
						$("#idEmp2").html(data[0]['EmpId']);
						$("#mail2").html(data[0]['EmailId']);
						$("#phno2").html(data[0]['MobileNo']);
					}
				}
			}
		}		
	});			 
});

//Restore Employee Data
$( "#active" ).click(function(e) {
	var eId             = localStorage.getItem('Empid');
	var endpointEmpDl   = "employee-permanent-delete";
	var requesturlEmpDl = baseURL+prefix+endpointEmpDl;
	var EmpDltP = {
		"url": requesturlEmpDl,
		"async": true, 
		"crossDomain": true,
		"method": "PUT",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"EmpId":eId,"Status":"0"}),
	}
	$.ajax(EmpDltP).done(function (response) {
		if (response['category'] == '0') {
			$("#sError").html(response['message']);
			$("#sError").show();
			setTimeout(function () {$("#sError").hide();}, 5000);
		} else {
			localStorage.setItem('category', response['category']);
			localStorage.setItem('message', response['message']);
			window.location.href = (projectPath + "employeelist.html");
		}
	});
});

//Permanent Delete Employee
$( "#permanent" ).click(function(e) {
	var eId= localStorage.getItem('Empid');
	var endpointEmpDl = "employee-permanent-delete";
	var requesturlEmpDl= baseURL+prefix+endpointEmpDl;
	var EmpDltP = {
		"url": requesturlEmpDl,
		"method": "PUT",
		"async": true, 
		"crossDomain": true,
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({"EmpId":eId,"Status":"1"}),
	}
	$.ajax(EmpDltP).done(function (response) {
		if (response['category'] == '0') {
			$("#sError").html(response['message']);
			$("#sError").show();
			setTimeout(function () {$("#sError").hide();}, 5000);
		} else {
			localStorage.setItem('category', response['category']);
			localStorage.setItem('message', response['message']);
			window.location.href = (projectPath + "employeelist.html");
		}                         
	});
	
});