var projectPath = sessionStorage.getItem('projectPath'); 
UserType        = sessionStorage.getItem("UserType"),
message         = sessionStorage.getItem('message'),
baseURL         = sessionStorage.getItem("baseURL"),
AccessToken     = sessionStorage.getItem("AccessToken"),
LicKey          = sessionStorage.getItem('LicKey'),
category        = sessionStorage.getItem('category'),
prefix          = "api/addon/";

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

//Date Formate
function dateFormat(data) {
    if (data != '' && data != '0000-00-00' && data != undefined && data != null) {
        var date       = new Date(data);
        var day        = '';
        var month      = '';
        var year       = '';
        var fullDate   = '';
        var getMonth   = date.getMonth() + 1;
        if (date.getDate() <= 9)
            day        = '0' + date.getDate();
        else
            day        = date.getDate();
        if (date.getMonth() + 1 <= 9)
            month      = '0' + getMonth;
        else
            month      = getMonth;

        year           = date.getFullYear();
        fullDate       = day + '-' + month + '-' + year;
        return fullDate;
    } else
        return '';
}

//DataTable Initialization
function datatableIntialise()
{
    $('#example').dataTable().fnDestroy();
		var prevLabel   = "Previous";
		var nextLabel   = "Next";
		var searchLabel = "Search";
		var excelLabel  = "Excel";
		var pdfLabel    = "Pdf";
		var printLabel  = "Print";
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
			paginate    : {
				previous: prevLabel,
				next    : nextLabel
			},
			aria: {
				paginate: {
					previous: 'Previous',
					next    : 'Next'
				}
			},
			search: searchLabel,
			info: datatableInfo
		}
	});
}
$(document).ready(function(){
// -- Api for Daily-Report Listing --
var endpoint     = "user-report";
var requesturl   = baseURL+prefix+endpoint;
var vardate      = '';
$('body').on('change', 'input[name=setDate]', function () {
vardate          = $('#setdate').val();
$("#setdate").attr('value', vardate);
var vardate2     = vardate.split("-").reverse().join("-");
$("#headerData").html(vardate2);
//document.title = companyNameData +"_"+"Daily Activity_"+vardate2;
ShowListing(vardate);
});

if (vardate == '') {
var d           = new Date();
vardate         = dateFormat(d);
var vardate2    = vardate.split("-").reverse().join("-");
$("#setdate").attr('value', vardate2);
ShowListing(vardate);
}

function ShowListing(dt)
{
    var num      =  $("#setdate").val();
    var dtDt     = num.toString();
    var settings = {
        "url"    : requesturl,
        "method" : "POST",
        "timeout": 0,
        "headers": {
        "LicKey" : LicKey,
        "AccessToken" : AccessToken,
        "Content-Type": "application/json"
        },
    "data": JSON.stringify({ "adDate": dtDt})
    };
    $.ajax(settings).done(function (response) {
    var tabledata = '';
    tabledata = '<table id="example" class="table table-striped table-bordered display"><thead><tr><th align="center">Sl.No.</th><th>Employee ID</th><th>Name</th><th>Time</th><th>Camera</th></tr></thead><tbody>';
    var data = response['ResponseData'];
    var locdatalength ='';
    if (response['errorNo'] == '0') 
    locdatalength = data.length;
    if (locdatalength > 0) {
        var i;
        var td = '';
        var status = '';
        for (i = 0; i < locdatalength; i++) {	
            if(data[i]['DNIImage'] != null && data[i]['DNIImage'] != '')
                var imgurl   = baseURL+data[i]['DNIImage'];
            else
                var imgurl   = 'public/images/generic-user-purple.png';
            var slno         = i + 1;
            if(data[i]['DNI'] == null)
                var EmpId             = "<td>" + "</td>";
            else
                var EmpId    = "<td>" + data[i]['DNI'] + "</td>";
            if(data[i]["ResidentName"] == null)
                var EmpName  = "<span class='pt-2 m-l-10'>"+"</span>";
            else
                var EmpName  = "<span class='pt-2 m-l-10'>"+data[i]["ResidentName"]+"</span>";
            var slno         = td + "<td>" + slno + "</td>";
            var TIME         = "<td>" + data[i]["ADTime"] + "</td>";
			var Camera       = "<td>" + data[i]["CameraName"] + "</td>";
            var EmpImage     = '<img src="' + imgurl + '" alt="user" class="rounded-circle" width="50" height="50">';
            var tdEmp        = '<td id="empNameId' + i + '" value="' + data[i]['DNI'] + '" onclick="return dailyreportData(' + data[i]['DNI'] + ');"><div style="display: inline-flex; cursor: pointer;" id="taken">' + EmpImage + EmpName + '</div></td>';
            var createtr     = "<tr>" + slno + EmpId + tdEmp + TIME + Camera + "</tr>";
            tabledata        = tabledata + createtr;
        }
        tabledata += '</tbody></table>';
    } else {
            tabledata += "<tr> <td colspan='5' align='center'><span style='color:red;'><strong>No list found </strong></span></td></tr></tbody></table>";
    }
    $("#tableData").html(tabledata);
    datatableIntialise()
        });
    }
});

//Date With Time formate
function dateTimeFormat(da) {
    var d          = new Date(da);
    var hours      = d.getHours();
    var minutes    = d.getMinutes();
    var second     = d.getSeconds();  
    var day        = '', month = '', year = '';
    var getMonth   = d.getMonth() + 1;
    if (d.getDate() <= 9)
        day        = '0' + d.getDate();
    else
        day        = d.getDate();
    if (d.getMonth() + 1 <= 9)
        month      = '0' + getMonth;
    else
        month      = getMonth;
    year           = d.getFullYear();
    hours          = hours < 10 ? '0' + hours : hours;
    minutes        = minutes < 10 ? '0' + minutes : minutes;
    second         = second < 10 ? '0' + second : second;
    var strTime    = day+ '-' + month + '-'+ year +" "+hours + ':' + minutes + ':' + second;
    return strTime;
} 
