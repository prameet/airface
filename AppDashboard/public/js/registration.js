var projectPath      = sessionStorage.getItem('projectPath');
    baseURL          = sessionStorage.getItem("baseURL"),
	prefix           = sessionStorage.getItem("prefix"),
	selected         = "",
	GroupArr         = '',
	endpoint         = 'registration',
	endpointCountry  = 'country-details',
	requesturl       = baseURL + prefix + endpoint;

if (sessionStorage['LicKey'] && sessionStorage['OrganizationName'] && sessionStorage['AccessToken']) {
    window.location.href = projectPath+"dashboard.html";
}

$('body').on('click', '#countryDialCode', function () {
	var elem = $(this);
	$('select#countryDialCode option').each(function () {
		if ($(this).val() === elem.val()) {
			$(this).attr('selected', 'selected');
		} else {
			$(this).removeAttr('selected');
		}
	})
})
var Sp         = [];
$("#pasRange").text("Make sure it's at least 8 to 16characters including a number a lowercase letter and an uppercase letter.");

Sp.forEach(function (elem) {
	var elemVal = elem.name;
	if ((elemVal === 'reg_msg_success') || (elemVal === 'signupHeader') || (elemVal === 'signin'))
		$('#' + elem.name).text(elem.index);
	else if (elemVal === 'btn_organization_signup')
		$('#' + elem.name).val(elem.index);
	else if ((elemVal === 'reg_wrong_msg') || (elemVal === 'reg_wrong_msg_contact'))
		$('#' + elem.name + ' option:first').html(elem.index);
	else if (elemVal === 'countryDialCode')
		$('#' + elem.name + ' option:first').text(elem.index);
	else
		$('#' + elem.name).attr('placeholder', elem.index);
})


// Country code API
var countryData = {
	"url": baseURL + prefix + endpointCountry,
	"method": "GET"
};
$.ajax(countryData).done(function (response) {
	var returnData = response['ResponseData'];
	for (var j in returnData) {
		if (returnData[j]["DialCode"] === "+91") {
			selected = "selected";
		} else {
			var selected = "";
		}
		$('#countryDialCode').append('<option value="' + returnData[j]['DialCode'] + '" ' + selected + '>' + returnData[j]['DialCode'] + '</option>');
	}
});
$("#msg_success").hide();
$("#wrong_msg").hide();
$("#wrong_msg_contact").hide();
$("#reg_msg_success").hide();
$("#reg_wrong_msg").hide();
$("#reg_wrong_msg_contact").hide();


// Password Validation && Duplicate check
function checkNewPwd() {
	organization_password = $("#organization_password").val();
	confirmpassword = $("#confirmpassword").val();
	if (organization_password == '') {
		$("#organization_password").css('border', '1px solid red');
		$("#organization_password").attr("placeholder", "Enter Password!");
		return false;
	} else {
		var regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,16})$/;
		if (!regularExpression.test(organization_password)) {
			$("#organization_password").css('border', '1px solid red');
			$("#organization_password").val('');
			$("#organization_password").attr("placeholder", "Password should contain at least one number, one lowercase, one uppercase letter and special character!");
			return false;
		} else {
			$("#organization_password").css('border', '1px solid green');
		}
	}
	if (confirmpassword == '') {
		$("#confirmpassword").css('border', '1px solid red');
		$("#confirmpassword").attr("placeholder", "Enter Confirm Password!");
		return false;
	} else {
		var regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]{8,16})$/;
		if (!regularExpression.test(confirmpassword)) {
			$("#confirmpassword").css('border', '1px solid red');
			$("#confirmpassword").val('');
			$("#confirmpassword").attr("placeholder", "Password should contain at least one number, one lowercase, one uppercase letter and special character!");
			return false;
		} else {
			if (confirmpassword != organization_password) {
				$("#confirmpassword").css('border', '1px solid red');
				$("#confirmpassword").val('');
				$("#confirmpassword").attr("placeholder", "Password and Confirm password are same!");
				return false;
			} else
				$("#confirmpassword").css('border', '1px solid green');
		}
	}
}


//Registration API
$("#btn_organization_signup").click(function () {
	organization_name               = $("#organization_name").val();
	organization_emailid            = $("#organization_emailid").val();
	organization_country__dial_code = $('#countryDialCode option:selected').val();
	organization_mobileno           = $("#organization_mobileno").val();
	organization_password           = $("#organization_password").val();
	confirmpassword                 = $("#confirmpassword").val();
	var err_msg                     = 0;

	if (organization_password == '') {
		$("#organization_password").css('border', '1px solid red');
		$("#organization_password").attr("placeholder", "Enter Password!");
	} else {
		$("#organization_password").css('border', '1px solid green');
	}
	if (confirmpassword == '') {
		$("#confirmpassword").css('border', '1px solid red');
		$("#confirmpassword").attr("placeholder", "Enter Confirm Password!");
	} else {
		$("#confirmpassword").css('border', '1px solid green');
	}
	if (organization_name == '') {
		$("#organization_name").css('border', '1px solid red');
		$("#organization_name").attr("placeholder", "Enter Company Name!");
		err_msg = 1;
	} else {
		$("#organization_name").css('border', '1px solid green');
	}
	if (organization_emailid == '') {
		$("#organization_emailid").css('border', '1px solid red');
		$("#organization_emailid").attr("placeholder", "Enter Email ID!");
		err_msg = 1;
	} else {
		const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!re.test(organization_emailid)) {
			$("#organization_emailid").val('');
			$("#organization_emailid").css('border', '1px solid red');
			$("#organization_emailid").prop("placeholder", "Enter Valid Email ID!");
			err_msg = 1;
		} else
			$("#organization_emailid").css('border', '1px solid green');
	}
	if (organization_country__dial_code == '') {
		$("#countryDialCode").css('border', '1px solid red');
		err_msg = 1;
	}
	if (organization_mobileno == '') {
		$("#organization_mobileno").css('border', '1px solid red');
		$("#organization_mobileno").attr("placeholder", "Enter Mobile No!");
		err_msg = 1;
	} else {
		if (!/^\d{10}$/.test(organization_mobileno)) {
			$("#organization_mobileno").css('border', '1px solid red');
			$("#organization_mobileno").val('');
			$("#organization_mobileno").attr("placeholder", "Enter Valid Mobile No!");
			err_msg = 1;
		} else {
			$("#organization_mobileno").css('border', '1px solid green');
		}
	}
	if (err_msg > 0) {
		Sp.forEach(function (elem) {
			var elemVal = elem.name;
			if ((elemVal === 'reg_msg_success') || (elemVal === 'signupHeader') || (elemVal === 'signin'))
				$('#' + elem.name).text(elem.index);
			else if (elemVal === 'btn_organization_signup')
				$('#' + elem.name).val(elem.index);
			else if ((elemVal === 'reg_wrong_msg') || (elemVal === 'reg_wrong_msg_contact'))
				$('#' + elem.name + ' option:first').html(elem.index);
			else if (elemVal === 'countryDialCode')
				$('#' + elem.name + ' option:first').text(elem.index);
			else
				$('#' + elem.name).attr('placeholder', elem.index);
		})
		return false;
	}
	var settingsReg = {
		"url"    : requesturl,
		"method" : "POST",
		"headers": {
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"OrganizationName"           : organization_name,
			"OrganizationEmailId"        : organization_emailid,
			"OrganizationMobileNo"       : organization_mobileno,
			"OrganizationPassword"       : organization_password,
			"OrganizationConfirmPassword": confirmpassword,
			"DialCode"                   : organization_country__dial_code
		})
	};
	$.ajax(settingsReg).done(function (response) {
		var data = response['ResponseData'];
		if (response['category'] == '1') {
			$("#reg_msg_success").html('Registration Accepted! Please check your email for confirmation link');
			$("#reg_msg_success").show();
			$("#reg_wrong_msg").hide();
		} else if (response['category'] == '2') {
			$("#organization_emailid").val("");
			$("#organization_emailid").attr("placeholder", response['message']);
			$("#organization_emailid").css('border', '1px solid red');
		} else if (response['category'] == '3') {
			$("#organization_name").val("");
			$("#organization_name").attr("placeholder", response['message']);
			$("#organization_name").css('border', '1px solid red');
		} else if (response['category'] == '4') {
			$("#reg_wrong_msg").html(response['message']);
			$("#reg_wrong_msg").show();
		} else if (response['category'] == '5') {
			$("#reg_wrong_msg").html(response['message']);
			$("#reg_wrong_msg").show();
		} else {
			$("#reg_wrong_msg").hide();
			$("#reg_msg_success").hide();
		}
		Sp.forEach(function (elem) {
			var elemVal = elem.name;
			if ((elemVal === 'reg_msg_success') || (elemVal === 'signupHeader') || (elemVal === 'signin'))
				$('#' + elem.name).text(elem.index);
			else if (elemVal === 'btn_organization_signup')
				$('#' + elem.name).val(elem.index);
			else if ((elemVal === 'reg_wrong_msg') || (elemVal === 'reg_wrong_msg_contact'))
				$('#' + elem.name).html(elem.index);
			else if (elemVal === 'countryDialCode')
				$('#' + elem.name + ' option:first').text(elem.index);
			else
				$('#' + elem.name).attr('placeholder', elem.index);
		})
	});
});

$("#signup").click(function () {
	$("#first").fadeOut("fast", function () {
		$("#second").fadeIn("fast");
	});
});

$("#signin").click(function () {
	$("#second").fadeOut("fast", function () {
		$("#first").fadeIn("fast");
	});
});