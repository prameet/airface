var projectPath    = sessionStorage.getItem('projectPath'),
	baseURL        = sessionStorage.getItem("baseURL"),
	prefix         = sessionStorage.getItem("prefix"),
	LicKey         = sessionStorage.getItem("LicKey"),
	AccessToken    = sessionStorage.getItem("AccessToken"),
	message        = sessionStorage.getItem('message'),
	category       = sessionStorage.getItem('category'),
	endpoint       = "locations",
	requesturl     = baseURL + prefix + endpoint;

$( document ).ready(function(){
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
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
	};
	$.ajax(settings).done(function (response) {
		var data = response['ResponseData'];
		if (response['category'] == '1')
		var locdatalength = data.length;
		var tabledata = '<table id="example" class="table table-striped table-bordered display"><thead><tr><th align="center" id="slno">Sl.No.</th><th id="LocationName">Location Name</th><th id="SystemInfo">System Info</th><th id="NoOfEmployees">No Of Employees</th><th id="CreatedDate">Created Date</th><th id="Status">Status</th><th class="text-center" id="Action">Action</th></tr></thead><tbody>';
		if (locdatalength > 0) {
			$("#locAddId").hide();
			var i;
			for (i = 0; i < locdatalength; i++) {
				var slno = i + 1;
				if (data[i]['IsActive'] == 1)
					var status = 'Active';
				else
					var status = 'InActive';
					
				var td_edit = "<a class='dropdown-item' data-toggle='modal' data-target='#myModal' onclick='editData("+data[i]['BaseLocationId']+");' id='editId' title='Edit'><i class='fa fa-pencil m-r-5'></i>"+"Edit"+"</a>";

				var td_isdelete = '<a class="dropdown-item" onclick="javascript:confirmDelete(' + data[i]['BaseLocationId'] + ');" id="deleteId" title="Delete"><i class="fa fa-trash-o m-r-5"></i>'+"Delete"+'</a>';

				if (data[i]['NO_OF_EMPLOYEES'] != 0 || data[i]['NO_OF_EMPLOYEES'] != '') {
					var tdaction = '<td class="text-right"><div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_edit +'</div></div></td>';
				} else { 
					var tdaction = '<td class="text-right"><div class="dropdown dropdown-action"><a href="javascript:void(0);" class="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i class="material-icons">more</i></a><div class="dropdown-menu dropdown-menu-right">'+ td_edit + td_isdelete +'</div></div></td>';
				}
				var td_Data = "<td>" + slno + "</td>"
							+ "<td>" + data[i]['LocationName'] + "</td>"
							+ "<td>" + data[i]['SystemInfo'] + "</td>"
							+ "<td>" + data[i]['NO_OF_EMPLOYEES'] + "</td>"
							+ "<td>" + dateFormat(data[i]['CreatedDate']) + "</td>"
							+ "<td>" + status + "</td>" + tdaction;
				
				var createtr = "<tr>" + td_Data + "</tr>";
				tabledata = tabledata + createtr;
			}
		}else{
			tabledata += "<tr> <td colspan='7' align='center'><span style='color:red;'><strong>No List Found </strong></span></td></tr>";
			$("#locAddId").show();
		}
		tabledata += '</tbody></table>';

		$("#list_data").html(tabledata);
		console.log(tabledata);
		datatableIntialise()
	})
})


//DataTable  Initialization    
function datatableIntialise() {
    var prevLabel     = "Previous",
        nextLabel     = "Next",
        searchLabel   = "Search",
        excelLabel    = "Excel",
        pdfLabel      = "Pdf",
        printLabel    = "Print",
        datatableInfo = "Showing _START_ to _END_ of _TOTAL_ entries";
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

//Add Button Click
function addButtonClick(){
    $('#addMoreBtn').show();
    $('input[name=location]').val('');
    $('#modalBtn').val('Submit');
    $('#modalBtn').html('Submit');
    $('#mdMitle').text('Add New Location');
    $('input[name=location]').css('border', '1px solid #dee2e6');
}

//Edit button click
function editData(bId){
	$('#baseLocId').val(bId);
    $('#addMoreBtn').hide();
    $('#modalBtn').val('Update');
    $('#modalBtn').html('Update');
    $('#mdMitle').text('Edit Location Details');
	$('input[name=location]').css('border', '1px solid #dee2e6');
	var endpoint = "location/" + bId;
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
		var data = response['ResponseData'];
		$("input[name=location]").val(data[0]["LocationName"]);
	});
}

//Add && Update API
function submitBtn() {
	var data1 = $("input[att-name='location[]']").map(function () {
		return $(this).val();
	}).get();
	var button = $("#modalBtn").val();
	var data = $("input[name=location]").val();
	var err_msg = 0;	
		if($('input[name=location]').val() == ''){
			$('input[name=location]').css('border', '1px solid red');
			err_msg = 1;
		}else
		$('input[name=location]').css('border', '1px solid #dee2e6');
	if(err_msg != 0)
		return false;
	$('#modalBtn').attr('type', 'button');
	var id = Math.floor((Math.random() * 10) + 1);
	if (button != 'Update') {
		var i = '';
		var endpoint = "location/"+id;
		var settings = {
			"url": baseURL + prefix + endpoint,
			"method": "POST",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"LocationName": data1,
				"SystemInfo": "N/A",
				"IsActive": "1"
			}),
		};
		$.ajax(settings).done(function (response){
			if (response['category'] == '0') {
				$("#messageerrorId").attr('class', 'alert alert-danger text-center')
				$("#messageerrorId").show().text(response['message']);
				setTimeout(function () {
				$("#messageerrorId").hide(); 
				}, 4000); 
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = window.location.href;
			}
		});

	} else {
		var bId      = $('#baseLocId').val();
		var endpoint = "location/"+bId;
		var settings = {
			"url": baseURL + prefix + endpoint,
			"method": "PUT",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"LocationName": data,
				"SystemInfo": "N/A",
				"IsActive": "1"
			}),
		};
		$.ajax(settings).done(function (response) {
			if (response['category'] == '0') {
				$("#messageerrorId").attr('class', 'alert alert-danger text-center')
				$("#messageerrorId").show().text(response['message']);
				setTimeout(function () { 
				$("#messageerrorId").hide(); 
				}, 4000); 
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "location.html");
			}
		});
	}
}

//Delete Location API
function confirmDelete(bId) {
	var endpoint = "location/",
	requesturlDelete = baseURL + prefix + endpoint + bId;
	var r = confirm("Do you want to delete this location ?");
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
				window.location.href = (projectPath + "location.html");
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "location.html");
			}
		});
	}
}

//Date Formate
function dateFormat(data) {
	if (data        != '' && data != '0000-00-00' && data != undefined && data != null) {
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