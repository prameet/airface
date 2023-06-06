var projectPath          = sessionStorage.getItem('projectPath'),
	baseURL              = sessionStorage.getItem("baseURL"),
	prefix               = sessionStorage.getItem("prefix"),
	LicKey               = sessionStorage.getItem("LicKey"),
	AccessToken          = sessionStorage.getItem("AccessToken"),
	endpoint             = "enterprise-camera-list",
	requesturl           = baseURL + prefix + endpoint,
    message              = sessionStorage.getItem('message'),
    category             = sessionStorage.getItem('category');

	
$(".select2").select2();
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


function validate(id,e){
	var value = $(id).val();
	if(value.length === 0 && e.which === 32){
	$(id).css('border', '1px solid red');
	$(id).attr('placeholder', 'Space Not Allow 1St !!');
	e.preventDefault();
	}else
	$(id).css('border', '1px solid green');
	}

$('document').ready(function () {
	
	//Listing API
	var settings = {
		"url"     : requesturl,
		"method"  : "GET",
		"headers" : {
			"AccessToken" : AccessToken,
			"LicKey"      : LicKey,
			"Content-Type": "application/json"
		},
	}; 
	
	$.ajax(settings).done(function (response) {
        
        var data = response['ResponseData'];
		console.log(data);
		if (response['category'] == '1')
			var locdatalength = data.length;
		var tabledata =  '<table id="example" class="table table-striped table-bordered"><thead><tr><th>Sl.No.</th><th id="Location">Camera Name</th><th id="idHoliday">Camera URL</th><th id="idHoliday">CreatedDate</th><th id="idStatus">Status</th><th text-align="center" id="idAction" class="text-right">Action</th></tr></thead><tbody>';
        	
		if (locdatalength > 0) {
			var i;
			for (i = 0; i < locdatalength; i++) {
                var slno        = i + 1;
                
                var DataStatus  = data[i]['CameraId'];
                if (data[i]['Status'] == 1) {
                    var td_isactive = '<a href="javascript:void(0)" class="dropdown-item" onclick="statusupdate(' + DataStatus + ', '+data[i]['Status']+')" title="Active"><i class="fa fa-check m-r-5 text-success"></i>'
                    +'Active'+'</a>';
                    var status = "Active";
				} else {
                    var td_isactive = '<a href="javascript:void(0)" class="dropdown-item"  onclick="statusupdate(' + DataStatus + ', '+data[i]['Status']+')" title="Inactive"><i class="fa fa-times m-r-5 text-danger"></i>'+'Inactive'+'</a>';
                    var status = "Inactive";
                }
                    var td_edit   = '<a class="dropdown-item" title="Edit" data-toggle="modal" data-target="#myModal" onclick="editData(' + DataStatus + ');"><i class="fa fa-pencil m-r-5"></i> '+'Edit'+'</a>';
                    
                    
                var tdaction        = '<div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_isactive + td_edit +'</div></div>';
                    
				var td_data         = "<td>" + slno + "</td>"
                                    + "<td>" + data[i]['CameraName'] + "</td>"
									+ "<td>" + data[i]['CameraUrl'] + "</td>"
                                    + "<td>" + dateFormat(data[i]['CreatedDate']) + "</td>"
                                    + "<td>" + status + "</td>" 
                                    + "<td  class='text-right'>" + tdaction + "</td>";
				
				var createtr        = "<tr>" + td_data + "</tr>";
				tabledata           = tabledata + createtr;
            }
                tabledata +='</tbody></table>';
		} else {
				tabledata += "<tr> <td colspan='6' align='center'><span style='color:red;'><strong>No List Found </strong></span></td></tr></tbody></table>";
		}
		$("#holidayData").html(tabledata);
		datatableIntialise()
	});
})


//Datatable Intialization
function datatableIntialise() {
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

//Add button Click
function addbtnClick(){
    $("#setDate").val('');
    $("#camera").val('');
    $("#locList").val('');
    $("#PgTitle").text('Add Camera');
    $("#idSubmit").val('Submit');
    $("#idSubmit").text('Submit');
    $('#setDate').css('border', '1px solid #dee2e6');
	$('#camera').css('border', '1px solid #dee2e6');
	$('#locList').css('border', '1px solid #dee2e6');
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
    locAllData();
}

//edit button click
function editData(hId){
    $("#PgTitle").text('Edit Camera');
    $("#idSubmit").val('Update');
    $("#idSubmit").text('update');
    $('#setDate').css('border', '1px solid #dee2e6');
	$('#camera').css('border', '1px solid #dee2e6');
	$('#locList').css('border', '1px solid #dee2e6');
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
    endpoint = "enterprise-camera/"+hId;
    var settings = {
        "url"    : baseURL + prefix +endpoint,
        "method" : "GET",
        "headers": {
            "AccessToken" : AccessToken,
            "LicKey"      : LicKey,
            "Content-Type": "application/json"
        },
    };
    $.ajax(settings).done(function (response) {
		var data    = response['ResponseData'];
		var sDate   = dateFormat(data[0]["SetDate"]);
		var vardate = sDate.split("-").reverse().join("-");
        $("#camera").val(data[0]["CameraName"]);
		$("#cameraurl").val(data[0]["CameraUrl"]);
        
        $('#cameraId').val(data[0]["CameraId"]);
    })
}


//Add&Update API
function submitBtn() {
	var camera  = $("#camera").val();
	var cameraurl  = $("#cameraurl").val();
	var cameraId  = $("#cameraId").val();
	var idSubmit = $("#idSubmit").val();
	var id = Math.floor((Math.random() * 10) + 1),
	endpointSub = "enterprise-camera/";
	var err_msg = 0;
	if ($('#camera').val() == '') {
		$('#camera').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#camera').css('border', '1px solid #dee2e6');
	if ($('#cameraurl').val() == '') {
		$('.select2-selection').attr('class','select2-selection select2-selection--single red');
		err_msg = 1;
	}else
		$('.select2-selection').attr('class','select2-selection select2-selection--single');
	if (err_msg != 0) {
		return false;
	}
    $('#idSubmit').attr('type', 'button');
    if(idSubmit == 'Submit')
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
				"CameraName": camera,
				"CameraURL": cameraurl
			}),
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
                $("#show_error1").html(response['message']);
				$("#show_error1").show();
				setTimeout(function () {$("#show_error1").hide();}, 5000);
			} else {
				sessionStorage.setItem('message', response['message']);
				sessionStorage.setItem('category', response['category']);
				window.location.href = (projectPath + "camera.html");
			}
		});
	}else{
        var endpoint = "enterprise-camera/"+cameraId;
        var settings = {
			"url": baseURL + prefix +endpoint,
			"method": "PUT",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"CameraName": camera,
				"CameraURL": cameraurl
			}),
        };
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
                $("#show_error1").html(response['message']);
				$("#show_error1").show();
				setTimeout(function () {$("#show_error1").hide();}, 5000);
			} else {
				sessionStorage.setItem('message', response['message']);
				sessionStorage.setItem('category', response['category']);
				window.location.href = (projectPath + "camera.html");
			}
		});
    }

}

function statusupdate(hId, Isactive) {
	var endpoint = "enterprise-camera-status/",
		requesturlDelete = baseURL + prefix + endpoint + hId;
	if (Isactive == '1')
		var r = confirm("Do you want to deactivate this camera?");
	else
		var r = confirm("Do you want to activate this camera?");

	if (r == true) {
		var settings = {
			"url": requesturlDelete,
			"method": "PUT",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('message', response['message']);
				sessionStorage.setItem('category', response['category']);
				window.location.href = (projectPath + "camera.html");
			} else {
				sessionStorage.setItem('message', response['message']);
				sessionStorage.setItem('category', response['category']);
				window.location.href = (projectPath + "camera.html");
			}
		});
	}
}

function dateFormat(data) {
	if (data != '' && data != '0000-00-00' && data != undefined && data != null && data != NaN - NaN - NaN) {
		var date    = new Date(data);
		var day     = '', month = '', year = '', fullDate = '';
		var getMonth= date.getMonth() + 1;
		if (date.getDate() <= 9)
			day     = '0' + date.getDate();
		else
			day     = date.getDate();
		if (date.getMonth() + 1 <= 9)
			month   = '0' + getMonth;
		else
			month   = getMonth;
		year        = date.getFullYear();

		fullDate    = day + '-' + month + '-' + year;
		return fullDate;
	} else
		return '';
}