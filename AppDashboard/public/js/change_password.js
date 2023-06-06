var projectPath         = sessionStorage.getItem('projectPath'),
	baseURL             = sessionStorage.getItem("baseURL"),
	prefix              = sessionStorage.getItem("prefix"),
	OrganizationEmailId = sessionStorage.getItem("OrganizationEmailId"),
	AccessToken         = sessionStorage.getItem("AccessToken"),
    message             = sessionStorage.getItem('message'),
    LicKey              = sessionStorage.getItem('LicKey'),
    endpoint            = "change-password",
    category            = sessionStorage.getItem('category'),
    requesturl          = baseURL + prefix + endpoint;
var EmployeeEmailId = sessionStorage.getItem('EmployeeEmailId');

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

;

function validateChangePwd() {
	var IdEmail = OrganizationEmailId;
	var oldpwd  = $("#oldpwd").val();
	var newpwd  = $("#newpwd").val();
	var conpwd  = $("#conpwd").val();
	if(oldpwd == '')
		$('#oldpwd').css('border', '1px solid red');
	else
		$('#oldpwd').css('border', '1px solid #dee2e6');
	if(newpwd == '')
		$('#newpwd').css('border', '1px solid red');
	else
		$('#newpwd').css('border', '1px solid #dee2e6');
	if(conpwd == '')
		$('#conpwd').css('border', '1px solid red');
	else
		$('#conpwd').css('border', '1px solid #dee2e6');
	if (oldpwd != '' && newpwd != '' && conpwd != '') {
		var settings = {
			"url": requesturl,
			"method": "PUT",
			//"crossDomain": true,
			//"dataType": "jsonp",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"oldPassword": oldpwd,
				"newPassword": newpwd,
				"confirmPassword": "",
				"emailId": IdEmail
			}),//conpwd
		};
		$.ajax(settings).done(function (response) {
			console.log(response);
			var data = response['ResponseData'];
			if (response['category'] == '0') {
				sessionStorage.setItem('message', response['message']);
				sessionStorage.setItem('category', response['category']);
				window.location.href = (projectPath + "change_password.html");
			} else {
				sessionStorage.setItem('message', response['message']);
				sessionStorage.setItem('category', response['category']);
				// setTimeout(function(){window.location.href = (projectPath + "logout.html");},4000);
				window.location.href = (projectPath + "logout.html");
			}
		});
    }
}

function checkNewPwd() {
	var newpwd = $("#newpwd").val();
	var conpwd = $("#conpwd").val();
	if (newpwd == '') {
		$("#newpwd").css('border', '1px solid red');
		$("#newpwd").attr("placeholder", "New password shouldn't blank!");
		return false;
	} else {
		var regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,16})$/;
		if (!regularExpression.test(newpwd)) {
			$("#newpwd").css('border', '1px solid red');
			$("#newpwd").val('');
			$("#newpwd").attr("placeholder", "Wrong password format!");
			return false;
		} else {
			$("#newpwd").css('border', '1px solid #dee2e6');
		}
	}
	if (conpwd == '') {
		$("#conpwd").css('border', '1px solid red');
			$("#conpwd").attr("placeholder", "Confirm password shouldn't blank!");
		return false;
	} else {
		var regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,16})$/;
		if (!regularExpression.test(conpwd)) {
			$("#conpwd").css('border', '1px solid red');
			$("#conpwd").val('');
				$("#conpwd").attr("placeholder", "Wrong password format!");
			return false;
		} else {
			if (conpwd != newpwd) {
				$("#conpwd").css('border', '1px solid red');
				$("#conpwd").val('');
					$("#conpwd").attr("placeholder", "Password mismatch!");
				return false;
			} else {
				$("#conpwd").css('border', '1px solid #dee2e6');
			}
		}
	}
}

function checkOldPwd() {
	var oldpwd              = $("#oldpwd").val();
	var endpointOldPassword = "password-verify";
	var emailId             = OrganizationEmailId;
	if (oldpwd != '') {
		var settingsPWD = {
			"url": baseURL + prefix + endpointOldPassword,
			"method": "POST",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"oldPassword": oldpwd,
				"emailId": emailId
			}),
		};
		$.ajax(settingsPWD).done(function (response) {
			if (response['category'] == '0') {
				$('#empidhints').html(response['message'])
				$("#oldpwd").val('');
				$("#oldpwd").focus();
				$("#oldpwd").css('border', '1px solid red');
				$("#oldpwd").attr("placeholder", "Old password shouldn't blank!");
			} else {
				$('#empidhints').html('');
				$("#oldpwd").css('border', '1px solid #dee2e6');
			}
		});
	}
}

$("body").on('click', '.toggle-password', function () {
	$(this).toggleClass("fa-eye fa-eye-slash");
	var input = $("#oldpwd");
	if (input.attr("type") === "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}
});

$("body").on('click', '.toggle-password1', function () {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $("#conpwd");
    if (input.attr("type") === "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

$("body").on('click', '.toggle-password2', function () {
	$(this).toggleClass("fa-eye fa-eye-slash");
	var input = $("#newpwd");
	if (input.attr("type") === "password") {
		input.attr("type", "text");
	} else {
		input.attr("type", "password");
	}
});