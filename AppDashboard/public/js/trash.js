var projectPath    = sessionStorage.getItem('projectPath'),
	baseURL        = sessionStorage.getItem("baseURL"),
	prefix         = sessionStorage.getItem("prefix"),
	LicKey         = sessionStorage.getItem("LicKey"),
	AccessToken    = sessionStorage.getItem("AccessToken"),
	message        = sessionStorage.getItem('message'),
	category       = sessionStorage.getItem('category'),
	endpoint       = "delete-employees-list",
	empiddel       = '',
	requesturl     = baseURL + prefix + endpoint;

$(document).ready(function () {
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

	//Listing API
	var settings = {
		"url": requesturl,
		"method": "GET",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settings).done(function (response) {
		var tabledata = '<table id="example" class="table table-striped table-bordered display"><thead><tr><th align="center" id="slno">Sl.No.</th><th>Employee ID</th><th>Name</th><th>Email ID</th><th>Mobile No</th><th >Location</th><th>Status</th><th class="text-center">Action</th></tr></thead><tbody>';
		var data = response['ResponseData'];
		var locdatalength = 0;
		if (response['category'] == '1')
		locdatalength = data.length;
		if (locdatalength > 0) {
			var i;
			for (i = 0; i < locdatalength; i++) {
				var slno = i + 1;
                var passEmpId = "'" + data[i]['EmpId'] + "'";

                if (data[i]['IsActive'] == 1)
					var status = "<td>" + 'Active' + "</td>";
				else
                    var status = "<td>" + 'InActive' + "</td>";
                
                var td_edit = '<a class="dropdown-item" id="delete" title="Restore" onclick="confirmEdit(' + passEmpId + ')"><i class="fa fa-repeat m-r-5"></i>'+"Restore"+'</a>';
                var td_isdelete = '<a class="dropdown-item" id="delete" title="Delete" onclick="confirmDelete(' + passEmpId + ')"><i class="fa fa-trash-o m-r-5"></i>'+"Delete"+'</a>';

                var tdaction        = '<td class="text-right"><div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_edit + td_isdelete +'</div></div></td>';

                var tD_Data = "<td>" + '<input type="checkbox" id="chk" value="' + data[i]['EmpId'] + '"/> '
                            + slno + "</td>"
                            + "<td>" + data[i]['EmpId'] + "</td>"
                            + "<td>" + data[i]['EmpName'] + "</td>"
				            + "<td>" + data[i]['EmailId'] + "</td>"
				            + "<td>" + data[i]['MobileNo'] + "</td>"
                            + "<td>" + data[i]['LocationName'] + "</td>"
                            + status + tdaction ;

				var createtr = "<tr>" + tD_Data + "</tr>";
				tabledata = tabledata + createtr;
			}
			$("#add_for_extra_fun").show();
			$("#chkforall").show();
		} else {
			tabledata += "<tr> <td colspan='8' align='center'><span style='color:red;'><strong>No List Found </strong></span></td></tr>";
			$("#add_for_extra_fun").hide();
			$("#chkforall").hide();
		}
        tabledata +='</tbody></table>';
		$("#list_data").html(tabledata);
		datatableIntialise()
		
		// $('#RemoveItems').text('Remove Employee');
		$('#slno').prepend('<input type="checkbox" style="position:relative;top:2px;" class="all" id="chkforall"> ');
	});
})

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

//for all delete
$(document).on("change", ".all", function () {
	alert("Do you want to delete all employee permanently ?");
	if ($(this).is(':checked')) {
		var $inputs = $('table').find('input');
		$inputs.prop('checked', true);
	} else {
		var $inputs = $('table').find('input');
		$inputs.prop('checked', false);
	}
	$('#deleteall').click(function () {
		url = baseURL + prefix
		var settings = {
			"url": url + "permanent-multiemp-delete",
			"method": "PUT",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"EmpId": "all"
			}),
		};

		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			}
		});
	});
}); 
//end
//for single and multiple delete
$(document).on("change", "#chk", function () {
	alert("Do you want to delete selected employee permanently ?");
	array = [];
	$("input:checkbox[id=chk]:checked").each(function () {
		array.push($(this).val());
	});
	chks = array.join(",");
	sessionStorage.setItem('chks', chks);
	//for multiple delete
	$('#deleteall').click(function () {
		url = baseURL + prefix;
		var settings = {
			"url": url + "permanent-multiemp-delete",
			"method": "PUT",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"EmpId": "" + chks
			}),
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			}
		});
	});
});
//for single delete
function confirmDelete(e) {
	url = baseURL + prefix
	alert("Do you want to delete selected employee permanently ?");
	var settings = {
		"url": url + "permanent-multiemp-delete",
		"method": "PUT",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"EmpId": "" + e
		}),
	};
	$.ajax(settings).done(function (response) {
		if (response['category'] == '0') {
			sessionStorage.setItem('category', response['category']);
			sessionStorage.setItem('message', response['message']);
			window.location.href = (projectPath + "trash.html");
		} else {

			sessionStorage.setItem('category', response['category']);
			sessionStorage.setItem('message', response['message']);
			window.location.href = (projectPath + "trash.html");
		}
	});
}

// to restore
//for all restore
$(document).on("change", ".all", function () {
	if ($(this).is(':checked')) {
		var $inputs = $('table').find('input');
		$inputs.prop('checked', true);
	} else {
		var $inputs = $('table').find('input');
		$inputs.prop('checked', false);
	}
	$('#restoreall').click(function () {
		url = baseURL + prefix
		var settings = {
			"url": url + "restore-multiemp",
			"method": "PUT",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"EmpId": "all"
			}),
		};

		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			} else {
				alert("Do you really want to restore all employee permanently ?");
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			}
		});
	});
}); //end
//for single and multiple restore
$(document).on("change", "#chk", function () {
	array = [];
	$("input:checkbox[id=chk]:checked").each(function () {
		array.push($(this).val());
	});
	chks = array.join(",");
	sessionStorage.setItem('chks', chks);
	console.log(chks);
	//for multiple restore
	$('#restoreall').click(function () {
		url = baseURL + prefix
		alert("Do you want to restore selected employee permanently ?");
		var settings = {
			"url": url + "restore-multiemp",
			"method": "PUT",
			"timeout": 0,
			"headers": {
				"LicKey": LicKey,
				"AccessToken": AccessToken,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"EmpId": "" + chks
			}),
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			} else {

				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "trash.html");
			}
		});
	});
});
//for single restore
function confirmEdit(e) {
	// alert(e);
	url = baseURL + prefix
	alert("Do you want to restore selected employee permanently ?");
	var settings = {
		"url": url + "restore-multiemp",
		"method": "PUT",
		"timeout": 0,
		"headers": {
			"LicKey": LicKey,
			"AccessToken": AccessToken,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"EmpId": "" + e
		}),
	};
	$.ajax(settings).done(function (response) {
		if (response['category'] == '0') {
			sessionStorage.setItem('category', response['category']);
			sessionStorage.setItem('message', response['message']);
			window.location.href = (projectPath + "trash.html");
		} else {
			sessionStorage.setItem('category', response['category']);
			sessionStorage.setItem('message', response['message']);
			window.location.href = (projectPath + "trash.html");
		}
	});
}