var projectPath          = sessionStorage.getItem('projectPath'),
	baseURL              = sessionStorage.getItem("baseURL"),
	prefix               = sessionStorage.getItem("prefix"),
	LicKey               = sessionStorage.getItem("LicKey"),
	AccessToken          = sessionStorage.getItem("AccessToken"),
	endpoint             = "holidays",
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
	var todayDt = new Date().toISOString().split('T')[0];
	$('#setDate').attr('min', todayDt);

	//Listing API
	var settings = {
		"url"     : requesturl,
		"method"  : "POST",
		"headers" : {
			"AccessToken" : AccessToken,
			"LicKey"      : LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settings).done(function (response) {

        var data = response['ResponseData'];
		if (response['category'] == '1')
			var locdatalength = data.length;
		var tabledata =  '<table id="example" class="table table-striped table-bordered"><thead><tr><th>Sl.No.</th><th id="Location">Location</th><th id="idDate">Date</th><th id="idHoliday">Holiday</th><th id="idStatus">Status</th><th text-align="center" id="idAction" class="text-right">Action</th></tr></thead><tbody>';
		if (locdatalength > 0) {
			var i;
			for (i = 0; i < locdatalength; i++) {
				var now         = new Date();
                var slno        = i + 1;
                var setDateData = data[i]['SetDate'],
					date        = new Date(setDateData);
                var DataStatus  = data[i]['HolidayListId'] +","+ data[i]['IsActive'] ;
                if (data[i]['IsActive'] == 1) {
                    var td_isactive = '<a href="javascript:void(0)" class="dropdown-item" onclick="statusupdate(' + DataStatus + ')" title="Active"><i class="fa fa-check m-r-5 text-success"></i>'
                    +'Active'+'</a>';
                    var status = "Active";
				} else {
                    var td_isactive = '<a href="javascript:void(0)" class="dropdown-item"  onclick="statusupdate(' + DataStatus + ')" title="Inactive"><i class="fa fa-times m-r-5 text-danger"></i>'+'Inactive'+'</a>';
                    var status = "Inactive";
                }
                    var td_edit   = '<a class="dropdown-item" title="Edit" data-toggle="modal" data-target="#myModal" onclick="editData(' + data[i]['HolidayListId'] + ');"><i class="fa fa-pencil m-r-5"></i> '+'Edit'+'</a>';
                    var td_isdelete   = '<a  id="deleteId" class="dropdown-item" onclick="javascript:confirmDelete(' + data[i]['HolidayListId'] + ');" title="Delete" DataStatus><i class="fa fa-trash-o m-r-5"></i> '+'Delete'+'</a>';
                    
				if (date < now)
					var tdaction = " ";
				else
                var tdaction        = '<div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_isactive + td_edit + td_isdelete +'</div></div>';
                    
				var td_data         = "<td>" + slno + "</td>"
                                    + "<td>" + data[i]['LocationName'] + "</td>"
                                    + "<td>" + dateFormat(data[i]['SetDate']) + "</td>"
                                    + "<td>" + data[i]['Holiday'] + "</td>"
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

//Location dropdown data
function locAllData(locId){
    var GroupArr    = '';
	var endPointLoc = "locations";
	var settingsLoc = {
		"url"    : baseURL + prefix + endPointLoc,
		"method" : "POST",
		"headers": {
			"AccessToken" : AccessToken,
			"LicKey"      : LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settingsLoc).done(function (response) {
		var data1 = response['ResponseData'];
		GroupArr = GroupArr + '<option value="">--Select Location--</option>';
		for (var j in data1) {
            if(locId ===  data1[j]['BaseLocationId']){
            GroupArr = GroupArr + '<option value="' + data1[j]['BaseLocationId'] + '"  selected="selected">' + data1[j]['LocationName'] + '</option>';
            }
            else
            GroupArr = GroupArr + '<option value="' + data1[j]['BaseLocationId'] + '">' + data1[j]['LocationName'] + '</option>';
		}
		$('#locList').html(GroupArr);
	});
}

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
    $("#holiday").val('');
    $("#locList").val('');
    $("#PgTitle").text('Add Holiday');
    $("#idSubmit").val('Submit');
    $("#idSubmit").text('Submit');
    $('#setDate').css('border', '1px solid #dee2e6');
	$('#holiday').css('border', '1px solid #dee2e6');
	$('#locList').css('border', '1px solid #dee2e6');
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
    locAllData();
}

//edit button click
function editData(hId){
    $("#PgTitle").text('Edit Holiday');
    $("#idSubmit").val('Update');
    $("#idSubmit").text('update');
    $('#setDate').css('border', '1px solid #dee2e6');
	$('#holiday').css('border', '1px solid #dee2e6');
	$('#locList').css('border', '1px solid #dee2e6');
	$('.select2-selection').attr('class','select2-selection select2-selection--single');
    endpoint = "holiday/"+hId;
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
        $("#holiday").val(data[0]["Holiday"]);
        $("#setDate").val(vardate);
        locAllData(data[0]["BaseLocationId"]);
        $('#holidayId').val(data[0]["HolidayListId"]);
    })
}


//Add&Update API
function submitBtn() {
	var setDate  = $("#setDate").val();
	var date     = new Date(setDate);
	var getMonth = date.getMonth() + 1;
	var setMonth = getMonth.toString();
	var holiday  = $("#holiday").val();
	var locList  = $("#locList").val();
	var holidayId= $("#holidayId").val();
	var idSubmit = $("#idSubmit").val();
	var id = Math.floor((Math.random() * 10) + 1),
		endpointSub = "holiday/";
	var err_msg = 0;
	if ($('#setDate').val() == '') {
		$('#setDate').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#setDate').css('border', '1px solid #dee2e6');
	if ($('#holiday').val() == '') {
		$('#holiday').css('border', '1px solid red');
		err_msg = 1;
	}else
		$('#holiday').css('border', '1px solid #dee2e6');
	if ($('#locList').val() == '') {
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
				"BaseLocationId": locList,
				"SetDate": setDate,
				"Holiday": holiday,
				"SetMonth": setMonth,
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
				window.location.href = (projectPath + "holiday.html");
			}
		});
	}else{
        var endpoint = "holiday/"+holidayId;
        var settings = {
			"url": baseURL + prefix +endpoint,
			"method": "PUT",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"BaseLocationId": locList,
				"SetDate": setDate,
				"Holiday": holiday,
				"SetMonth": setMonth,
				"IsActive": "1"
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
				window.location.href = (projectPath + "holiday.html");
			}
		});
    }

}

function statusupdate(hId, Isactive) {
	var endpoint = "holiday-status/",
		requesturlDelete = baseURL + prefix + endpoint + hId;
	if (Isactive == '1')
		var r = confirm("Do you want to deactivate this holiday?");
	else
		var r = confirm("Do you want to activate this holiday?");

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
				window.location.href = (projectPath + "holiday.html");
			} else {
				sessionStorage.setItem('message', response['message']);
				sessionStorage.setItem('category', response['category']);
				window.location.href = (projectPath + "holiday.html");
			}
		});
	}
}

//Delete Holiday API
function confirmDelete(hId) {
	var endpoint      = "holiday/",
	requesturlDelete  = baseURL + prefix + endpoint + hId;
	var r             = confirm("Do you want to delete this holiday?");
	if (r == true) {
		var settings = {
			"url"     : requesturlDelete,
			"method"  : "DELETE",
			"headers" : {
				"AccessToken" : AccessToken,
				"LicKey"      : LicKey,
				"Content-Type": "application/json"
			},
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "holiday.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "holiday.html");
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