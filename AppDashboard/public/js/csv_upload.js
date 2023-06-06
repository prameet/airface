var projectPath    = sessionStorage.getItem('projectPath'); 
$('#backBtn').attr('href', projectPath+'employee.html');
var message        = sessionStorage.getItem('message'),
    baseURL        = sessionStorage.getItem("baseURL"),
    AccessToken    = sessionStorage.getItem("AccessToken"),
    LicKey         = sessionStorage.getItem('LicKey'),
    message        = sessionStorage.getItem('message'),
    category       = sessionStorage.getItem('category'),
    prefix         = "api/addon/",
    BaseLocationId = '1';
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
function csvuploads()
{
	var fileUpload= $('input[name=csv_file]')[0].files[0]; 
	if(fileUpload  === undefined || fileUpload == null){
		document.getElementById("CCSVFile").style.border = "1px solid red";
		return false;
	}else{
		var BaseLoc= 1;
		var form = new FormData();
		form.append("csv", fileUpload);
		form.append("BaseLocationId", BaseLoc);
		var settings = {
		"async": true,
		"crossDomain": true,
		"url": baseURL+prefix+"/resident-csv-upload",
		"method": "POST",
		"headers": {
			"accesstoken": "mqomofbjufou",
			"lickey": "hjdgjygfuasGdugaUde",
			"cache-control": "no-cache",
			"postman-token": "3fb7f31c-3967-dd5c-063a-e5bd8adacfb3"
		},
		"processData": false,
		"contentType": false,
		"mimeType": "multipart/form-data",
		"data": form
		} 
		$.ajax(settings).done(function (response) {
			var tabledata = '';
				var tabledata2 = '';
				tabledata = '<table id="ErrorEmpList" class="table table-striped table-bordered display" style="border:1px solid black;"><thead><tr><th style="border:1px solid black;font-weight: bold;">Sl.no</th><th style="border:1px solid black;font-weight: bold;">DNI</th><th style="border:1px solid black;font-weight: bold;">ResidentName</th><th style="border:1px solid black;font-weight: bold;">EmailId</th><th style="border:1px solid black;font-weight: bold;">MobileNo</th></tr></thead><tbody>';
				tabledata2 = '<table id="SuccessEmpList" class="table table-striped table-bordered display" style="border:1px solid black;"><thead><tr><th style="border:1px solid black;font-weight: bold;">Sl.no</th><th style="border:1px solid black;font-weight: bold;">DNI</th><th style="border:1px solid black;font-weight: bold;">ResidentName</th><th style="border:1px solid black;font-weight: bold;">EmailId</th><th style="border:1px solid black;font-weight: bold;">MobileNo</th></tr></thead><tbody>';
			var data= JSON.parse(response);
			$("#show_error").hide();
			if(data.errorNo != '0')
			{						
				$("#show_error").html(data['message']);
				$("#show_error").show();
			}
			else
			{
				var errorData = data['errorData'];
				var cntErrorDatalength = errorData.length;
				var i=0;
				var slNo=0;
				if(cntErrorDatalength > 0)
				{
					var td = '';
					for (i = 0; i < cntErrorDatalength; i++) 
					{
						var slNo = i+1;
						var slNoTd = "<td style='border:1px solid black;'>"+slNo+"</td>";
						errorcreatetr = '';
						var messageCode = errorData[i]['status'];
						var message = errorData[i]['message'];
						cntMessageCode = messageCode.length;
						if(messageCode.includes(2)){
							var colName = 'DNI';
							var uniqueMasterId = '"'+colName+'","'+slNo+'"';
							var indexOfMessageCode = messageCode.indexOf(2);
							var messageText = message[indexOfMessageCode];
							var errorEmployeeId = "<td style='border: 1px solid black;color: red;' title='"+messageText+"'>"+errorData[i]['DNI']+"</td>";
						} else {
							var errorEmployeeId = "<td style='border: 1px solid black;'>"+errorData[i]['DNI']+"</td>";
						} 
						if(messageCode.includes(1) || messageCode.includes(4)){
							var colName = 'EmailId';
							var uniqueMasterId = '"'+colName+'","'+slNo+'"';
							if(messageCode.includes(1)){
								var indexOfMessageCode = messageCode.indexOf(1);
								var messageText = message[indexOfMessageCode];
								var errorMailId = "<td style='border: 1px solid black;color: red;' title='"+messageText+"'>"+errorData[i]['EmailId']+"</td>";
							} else{
								if(messageCode.includes(4)){
									var indexOfMessageCode = messageCode.indexOf(4);
									var messageText = message[indexOfMessageCode];
									var errorMailId = "<td style='border: 1px solid black;color: red;' title='"+messageText+"'>"+errorData[i]['EmailId']+"</td>";
								} else{
									var errorMailId = "<td style='border: 1px solid black;'>"+errorData[i]['EmailId']+"</td>";
								}
							}
						} else{
							var errorMailId = "<td style='border: 1px solid black'>"+errorData[i]['EmailId']+"</td>";
						}
						if(messageCode.includes(3)){
							var colName = 'MobileNo';
							var uniqueMasterId = '"'+colName+'","'+slNo+'"';
							var indexOfMessageCode = messageCode.indexOf(3);
							var messageText = message[indexOfMessageCode];
							var errorMobileNo = "<td style='border: 1px solid black;color: red;' title='"+messageText+"'>"+errorData[i]['MobileNo']+"</td>";
						} else {
							var errorMobileNo = "<td style='border: 1px solid black;'>"+errorData[i]['MobileNo']+"</td>";	
						} 
						var errorEmployeeName = "<td style='border: 1px solid black;'>"+errorData[i]['ResidentName']+"</td>";
						var errorcreatetr = "<tr>"+slNoTd+errorEmployeeId+errorEmployeeName+errorMailId+errorMobileNo+"</tr>";
						tabledata = tabledata + errorcreatetr;	
					}
				}
				var successData = data.successData;
				var cntSuccessDatalength = successData.length;
				if(cntSuccessDatalength > 0)
				{
					var i;
					var td = '';
					for (i = 0; i < cntSuccessDatalength; i++) 
					{
						var slNo = slNo+i+1;
						successcreatetr = '';
						var slNoTd = "<td style='border: 1px solid black;'>"+slNo+"</td>";
						var successEmployeeId = "<td style='border: 1px solid black;'>"+successData[i]['DNI']+"</td>";
						var successEmployeeName = "<td style='border: 1px solid black;'>"+successData[i]['ResidentName']+"</td>";
						var successMailId = "<td style='border: 1px solid black;'>"+successData[i]['EmailId']+"</td>";
						var successMobileNo = "<td style='border: 1px solid black;'>"+successData[i]['MobileNo']+"</td>";												
						var successcreatetr = "<tr style='color:green;'>"+slNoTd+successEmployeeId+successEmployeeName+successMailId+successMobileNo+"</tr>";
						tabledata2 = tabledata2 + successcreatetr;	
					}
				}
				tabledata += '</tbody></table>';					
				tabledata2 += '</tbody></table>';					
				$("#listdata").html(tabledata);
				$("#succlistdata").html(tabledata2);
				datatableIntialise();
				$("#importCSVFile").hide();			
				$("#totalEmpVal").html(data.totalDNI);
				var totalSuccessEmp = data.totalSuccessDNI;
				var totalErrorEmp = data.totalErrorDNI;
				if (totalSuccessEmp > 0)
				{
					$("#empCsvSuccListLink").attr("onclick","CreateReport('SuccessEmpList','SuccessEmployeeList');");
				}
				if (totalErrorEmp > 0)
				{
					$("#empCsvErrListLink").attr("onclick","CreateReport('ErrorEmpList','ErrorEmployeeList');");
				}
				$("#totalSuccessEmpVal").html(data.totalSuccessDNI);
				$("#totalErrorEmpVal").html(data.totalErrorDNI);
				$("#csvFileUploadResultDetails").show();
				$("#csvFileUploadBtn").hide();
			}
		});
	}
}
function datatableIntialise()
{
    var prevLabel= "Previous";
    var nextLabel= "Next";
    var searchLabel= "Search";
    var excelLabel= "Excel";
    var pdfLabel= "Pdf";
    var printLabel= "Print";
    var datatableInfo= "Showing _START_ to _END_ of _TOTAL_ entries";
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

$('body').on('click','#csvFileUploadBtn', function(){
	$('#importCSVFile').toggleClass('show');
	$('#importCSVFile').css({"display": "block", "padding-right":"17px"});
})
$('body').on('click','.close', function(){
	$('#importCSVFile').toggleClass('show');
	$('#importCSVFile').css({"display": "none"});
})
$('body').on('click','#close', function(){
	$('#importCSVFile').toggleClass('show');
	$('#importCSVFile').css({"display": "none"});
})

$('body').on('click','#closeM', function(){
	$('#importCSV').toggleClass('show');
	$('#importCSV').css({"display": "none"});
})
