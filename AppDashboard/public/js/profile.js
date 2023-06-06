var projectPath          = sessionStorage.getItem('projectPath'),
	baseURL              = sessionStorage.getItem("baseURL"),
	prefix               = sessionStorage.getItem("prefix"),
	imagebase64          = "",
	message              = sessionStorage.getItem('message'),
	category             = sessionStorage.getItem('category'),
	OrganizationEmailId  = sessionStorage.getItem("OrganizationEmailId"),
	OrganizationPassword = sessionStorage.getItem("OrganizationPassword"),
	OrganizationMobileNo = sessionStorage.getItem("OrganizationMobileNo"),
	LicKey               = sessionStorage.getItem("LicKey"),
	AccessToken          = sessionStorage.getItem("AccessToken");
var EmployeeEmailId      = sessionStorage.getItem('EmployeeEmailId');
var userProfileImage     = sessionStorage.getItem('userProfileImage');
var endpoint = "profile";
$("#ImageData").attr("src", "public/images/profileimg/1user.png");
var requesturl = baseURL + prefix + endpoint;
var EmpIdUser = sessionStorage.getItem('EmpId');
if (message != null) {
	if (category == 1)
		$("#messageId").attr('class', 'alert alert-success text-center')
	else
		$("#messageId").attr('class', 'alert alert-danger text-center')
	$("#messageId").show().text(message);
	setTimeout(function () {$("#messageId").hide();}, 4000);
	sessionStorage.removeItem('message');
	sessionStorage.removeItem('category');
}

var reader = new FileReader();
var GroupArr = '';
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
    console.log(response);
    var data                  = response['ResponseData'];
    var OrganizationEmailId   = data[0]['OrganizationEmailId'];
    var OrganizationMobileNo  = data[0]['OrganizationMobileNo'];
    var ProfileImg            = data[0]['ProfileImg'];
    var orgid                 = data[0]['OrganizationName'];
    var AdminCompImg          = data[0]['AdminImg'];
    if (response['category'] != '0') {
        $("#visemail").text(OrganizationEmailId);
        $("#vismob").text(OrganizationMobileNo);
        $("#prof_email").val(OrganizationEmailId);
        $("#prof_mob").val(OrganizationMobileNo);
        sessionStorage.setItem('OrganizationName', orgid);
        sessionStorage.setItem('ProfileImg', ProfileImg);
        sessionStorage.setItem('AdminCompImg', AdminCompImg);
        sessionStorage.setItem('OrganizationEmailId', OrganizationEmailId);
        $("#orgEditname").val(orgid);
        $("#companyMail").html(OrganizationEmailId);
        $("#companyName").html(orgid);
        $("#h4Id").text(orgid);
        $("#ProfileImg").attr("src", baseURL + ProfileImg);
        $("#compImg").attr("src", baseURL + AdminCompImg);
        $("#prof_email").hide();
        $("#prof_mob").hide();
    }
});

// Change ProfileImg
function changeprofileimg() {
    $('#profilechgdiv').css('display', 'block');
    $('#profileeditbtn').css('display', 'none');
}

//Change UserImg
function blobProfileImg() {
    var endpointPImg = "user-profile";
    var settings = '';
    var file = document.getElementById('profimg').files[0];
    reader.onloadend = function () {
        sessionStorage.setItem("imagebase64", reader.result);
    }
    reader.readAsDataURL(file);
}

//Upload UserImg
function uploadProfileImg() {
    var imgData = sessionStorage.getItem("imagebase64", reader.result);
    var endpointPImg = "user-profile";
    if(imgData != ''){
        var settings = {
            "url": baseURL + prefix + endpointPImg,
            "method": "PUT",
            "headers": {
                "AccessToken": AccessToken,
                "LicKey": LicKey,
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "userImg": imgData
            }),
        };
        $.ajax(settings).done(function (response) {
            var data = response['ResponseData'];
            if (response['category'] != '0') {
                sessionStorage.setItem('category', response['category']);
                sessionStorage.setItem('message', response['message']);
				window.location.href = (projectPath + "logout.html");
            } else {
                sessionStorage.setItem('category', response['category']);
                sessionStorage.setItem('message', response['message']);
                window.location.href = (projectPath + "profile.html");
            }
        });
    }
}

//Change CompanyImg
function changecompimg() {
    $('#compchgdiv').css('display', 'block');
    $('#compeditbtn').css('display', 'none');
    $('#orgDisname').css('display', 'none');
}

//Upload CompImg
function uploadcompImg() {
    var file = document.getElementById('compimg').files[0];
    reader.onloadend = function () {
        sessionStorage.setItem("image64", reader.result);
    }
    reader.readAsDataURL(file);
}

function uploadAdminCompImg() {
    var orgEditname = $('#orgEditname').val();
    var imgData = sessionStorage.getItem("image64", reader.result);
    if (imgData == null)
        var imgData = "";
    var endpointAImg = "admin-profile";
    var settings = {
        "url": baseURL + prefix + endpointAImg,
        "method": "PUT",
        "headers": {
            "AccessToken": AccessToken,
            "LicKey": LicKey,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({ "adminName": orgEditname,"AdminImg": imgData}),
    };
    $.ajax(settings).done(function (response) {
        if (response['category'] != '0') {
            sessionStorage.setItem('category', response['category']);
            sessionStorage.setItem('message', response['message']);
            window.location.href = (projectPath + "logout.html");
        } else {
            sessionStorage.setItem('category', response['category']);
            sessionStorage.setItem('message', response['message']);
            window.location.href = (projectPath + "profile.html");
        }
    });
}

//Update Profile
function profileUpdate() {
    $("#prof_email").show();
    $("#prof_mob").show();
    $('#prof_email').css('display', 'block');
    $('#prof_mob').css('display', 'block');
    $('#btnUpdate').css('display', 'block');
    $('#btnCancel').css('display', 'block');
    $('#visemail').css('display', 'none');
    $('#vismob').css('display', 'none');
    $('#btnEdit').css('display', 'none');
}


function profileCancel() {
    $('#prof_email').css('display', 'none');
    $('#prof_mob').css('display', 'none');
    $('#btnUpdate').css('display', 'none');
    $('#btnCancel').css('display', 'none');
    $('#visemail').css('display', 'block');
    $('#vismob').css('display', 'block');
    $('#btnEdit').css('display', 'block');
}

//Update ProfileData
function updateProfile() {
    var prof_email = $('#prof_email').val();
    var prof_mob = $('#prof_mob').val();
    var endpointPf = "profile-info";
    var employeeId = $('input[name=login_id]').val();
    if (prof_email != '' && prof_mob != '' && orgEditname != '') {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (regex.test(prof_email) == true) {
            returnURL = "profile";
            var settings = {
                "url": baseURL + prefix + endpointPf,
                "method": "PUT",
                //"crossDomain": true,
                //"dataType": "jsonp",
                "headers": {
                    "AccessToken": AccessToken,
                    "LicKey": LicKey,
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "OrganizationEmailId": prof_email,
                    "OrganizationMobileNo": prof_mob
                }),
            };
            $.ajax(settings).done(function (response) {
                var data = response['ResponseData'];
                if (response['category'] != '0') {
                    // window.location.href = (projectPath + "profile.html");
                    sessionStorage.setItem('category', response['category']);
                    sessionStorage.setItem('message', response['message']);
					window.location.href = (projectPath + "logout.html");
                } else {
                    window.location.href = (projectPath + "profile.html");
                    sessionStorage.setItem('category', response['category']);
                    sessionStorage.setItem('message', response['message']);
                }
            });
        } else {
            alert('please enter valid Data!!!');
        }
    }
}