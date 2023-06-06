var projectPath = sessionStorage.getItem('projectPath'),
	message = sessionStorage.getItem('message'),
	baseURL = sessionStorage.getItem("baseURL"),
	AccessToken = sessionStorage.getItem("AccessToken"),
	LicKey = sessionStorage.getItem('LicKey'),
	prefix = sessionStorage.getItem("prefix"),
	EnrollEmpid = sessionStorage.getItem('EnrollEmpid');
EnrollbLoc = sessionStorage.getItem('EnrollbLoc');
Enrollmail = sessionStorage.getItem('Enrollmail');
EnrollmasterID = sessionStorage.getItem('EnrollmasterID');
getprofiledetails(EnrollmasterID);

if (AccessToken == '' || AccessToken == null || AccessToken == 'undefined') {
	window.location.href = projectPath;
}

function getprofiledetails(EnrollmasterID) {
	var endpoint = "employee/" + EnrollmasterID,
		locationlisturl = baseURL + prefix + endpoint;

	var settings = {
		"url": locationlisturl,
		"method": "GET",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey
		},
	};
	$.ajax(settings).done(function (response) {
		var data = response['ResponseData']
		$("#profileEmpName").html(data[0]['EmpName']);
		$("#profileEmailId").html(data[0]['EmailId']);
		$("#empid").html('Employee ID' + ' : ' + data[0]['EmpId']);
		$("#empname").html('Name' + ' : ' + data[0]['EmpName']);
		document.getElementById("verifyid").value = data[0]['EmpId'];
		var EmpName = data[0]['EmpName'];
		sessionStorage.setItem('EmpName', EmpName);

	});
}

// Image
var EnrollEmpid = sessionStorage.getItem('EnrollEmpid');
var endpointEmp = "enroll-emp-details/" + EnrollEmpid;
// var endpointEmp = "enroll/" + EnrollEmpid;
var requesturlEmp = baseURL + prefix + endpointEmp;
// alert(requesturlEmp);
var settings = {
	"url": requesturlEmp,
	"method": "GET",
	"timeout": 0,
	"headers": {
		"LicKey": LicKey,
		"AccessToken": AccessToken,
		"Content-Type": "application/json"
	},
	"data": "\r\n",
};
$.ajax(settings).done(function (response) {
	if (response.category != 0) {
		var data = response['ResponseData'];
		// alert(data[0]['ImagePath']);
		var cntdatalength = data.length;
		alert(cntdatalength)
		if (cntdatalength > 0) {
			var EmpImage = baseURL + data[0]['ImagePath'];
			$("#empImageData").attr("src", EmpImage);
		};
	}
});