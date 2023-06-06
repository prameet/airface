document.title = "3SD Solutions || Login";
sessionStorage.setItem('projectPath', 'http://localhost/AppDashboard/');
sessionStorage.setItem("baseURL", "http://192.168.0.155:5018/");
// sessionStorage.setItem("baseURL", "http://192.168.29.135:5018/");
// sessionStorage.setItem("baseURL", "http://192.168.29.134:5018/");
sessionStorage.setItem("prefix", "api/v1/");
var projectPath = sessionStorage.getItem('projectPath');
var baseURL = sessionStorage.getItem("baseURL");
var prefix = sessionStorage.getItem("prefix");
var today_title = new Date();
var dd = String(today_title.getDate()).padStart(2, '0');
var mm = String(today_title.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today_title.getFullYear();

today_title = dd + '-' + mm + '-' + yyyy;

if (sessionStorage['LicKey'] && sessionStorage['OrganizationName'] && sessionStorage['AccessToken']) {
	window.location.href = projectPath + "dashboard.html";
}

//Login API
function authLogin() {

	var auth_username = $("#username").val();
	var auth_password = $("#password").val();

	var auth_type = $("input[name='user_type']:checked").val();
	var error = "0";
	if (auth_username == '') {
		$("#username").css('border', "1px solid red");
		error = error + 1;
	}
	else
		$("#username").css('border', "1px solid #dee2e6");
	if (auth_password == '') {
		$("#password").css('border', "1px solid red");
		error = error + 1;
	}
	else
		$("#password").css('border', "1px solid #dee2e6");
	if (error > 0)
		return false;
	else {
		$('#logInId').attr('type', 'button');
		var endpoint = "login";

		var requesturl = baseURL + prefix + endpoint;
		// alert(requesturl);
		var settings = {
			"url": requesturl,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"OrganizationEmailId": auth_username,
				"OrganizationPassword": auth_password,
				"UserType": "admin",
				"Content-Type": "application/json"
			},
		};
		$.ajax(settings).done(function (response) {
			console.log(response);
			var data = response.ResponseData;
			if (response.category != 1) {
				$('#errorAlert').css('display', 'block');
				$('#errorAlert').html(response.message);

			} else {
				var orgname = data['OrganizationName'],
					orgemail = data['OrganizationEmailId'],
					orgmobile_no = data['OrganizationMobileNo'],
					LicKey = data['LicKey'],
					AccessToken = data['AccessToken'],
					ProfileImg = data['ProfileImg'],
					AdminImg = data['AdminImg'];
				sessionStorage.setItem('LicKey', LicKey);
				sessionStorage.setItem('OrganizationName', orgname);
				sessionStorage.setItem('OrganizationEmailId', orgemail);
				sessionStorage.setItem('OrganizationMobileNo', orgmobile_no);
				sessionStorage.setItem('AccessToken', AccessToken);
				sessionStorage.setItem('today_title', today_title);
				sessionStorage.setItem('ProfileImg', ProfileImg);
				sessionStorage.setItem('AdminImg', AdminImg);

				window.location.href = projectPath + "dashboard.html";
			}
		});
	}
}