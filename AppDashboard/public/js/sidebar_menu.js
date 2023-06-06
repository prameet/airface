var projectPath    = sessionStorage.getItem('projectPath'),
    LicKey         = sessionStorage.getItem('LicKey'),
    AccessToken    = sessionStorage.getItem('AccessToken'),
    baseURL        = sessionStorage.getItem("baseURL"),
    prefix         = sessionStorage.getItem("prefix"),
    orgname        = sessionStorage.getItem("OrganizationName"),
    orgemail       = sessionStorage.getItem("OrganizationEmailId"),
    proImage       = sessionStorage.getItem("ProfileImg"),
    AdminImg       = sessionStorage.getItem("AdminImg");

if(proImage != '' && proImage != null)
    var imgurl = baseURL + proImage;
else
    var imgurl = '///static/assets/img/1user.png';
var EmpImage = '<img src="' + imgurl+ '" alt="user" class="img-responsive" width="30" height="40">';

if(AdminImg != '' && AdminImg != null)
    var adminimgurl = baseURL + AdminImg;
else
    var adminimgurl = '///static/assets/img/1user.png';
var AdminImgFile = '<img src="' + adminimgurl + '" alt="user" class="img-fluid" style="width:200px">';

$('#AdminImg').html(AdminImgFile);
$('#proImage').html(EmpImage);
$('#companyName').text(orgname);
$('#absS').text("  "+orgname);

if(AccessToken == '' || AccessToken == null || AccessToken == 'undefined')
{
	var Projectpathorigin = window.location.origin;
	var Projectpathname = window.location.pathname;
	var ProjectpathnameArray = Projectpathname.split("/");
	projectPath = Projectpathorigin+"/"+ProjectpathnameArray[1];
	window.location.href= projectPath;
} 

$(document).ready(function(){
    //Menu API
    var settings = {
        "url"    : baseURL+prefix+"menu",
        "method" : "POST",
        "headers": {
            "LicKey"     : LicKey,
            "AccessToken": AccessToken
        },
    };
    $.ajax(settings).done(function (response) {
        var htmlData = '';
        var dataRes = response['ResponseData'];
        $.each(dataRes, function (key, value) {
            if(value['MenuUrl'] != ''){
                htmlData += '<li class="sidebar-item" id="menu"><a class="sidebar-link  waves-effect waves-dark sidebar-link" href="' + value['MenuUrl'] + '" aria-expanded="true"><i class="su'+value['MenuMasterId']+'"></i><span class="hide-menu">' + value["MenuNameEn"] + '</span></a></li>';
            }else{
                if(value['MenuMasterId'] != 5){
                htmlData += '<li class="sidebar-item"><a class="sidebar-link waves-effect waves-dark sidebar-link" aria-expanded="false" onclick="return getSubmenu(' + value['MenuMasterId'] + ');"><i class="su'+value['MenuMasterId']+'"></i><span class="hide-menu">' + value["MenuNameEn"] + '</span></a><ul aria-expanded="true" class="collapse first-level" id="submenu' + value['MenuMasterId'] + '"></ul></li>';
                }
            }
        });
        $('#sidebarnav').append(htmlData);
        //$.getScript("static/assets/js/sidebarmenu.js");
        $.getScript("static/assets/js/sidebarmenu.js");
    });
});

//Submenu API
function getSubmenu(menuId) {
    var menuId = String(menuId);
	var settingssubmenu = {
		"url": baseURL+prefix+"submenu/"+menuId,
		"method": "POST",
		"timeout": 0,
		"headers": {
			"Content-Type": "application/json",
            "LicKey"     : LicKey,
            "AccessToken": AccessToken
		},
    };
	$.ajax(settingssubmenu).done(function (responseSubmenu) {
		var k = 1;
		var htmlData = '';
		$.each(responseSubmenu['ResponseData'], function (keySubmenu, valueSubmenu) {
				var Smenu = 'SubMenuNameEn';
			htmlData += '<li class="sidebar-item"><a href="' + valueSubmenu['SubMenuUrl'] + '" class="sidebar-link"><i class="fa fa-account-network"></i><span class="hide-menu" id="shifts"> ' + valueSubmenu[Smenu] + '</span></a></li>';
        });
        $('#submenu' + menuId).html('');
        var sse = $('#submenu' + menuId).html(htmlData);
	});
}