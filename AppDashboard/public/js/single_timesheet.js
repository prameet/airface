var url = window.location.href;
var arguments = url.split('?')[1].split('=');
baseid = arguments[1];
var newbaseURL = "http://localhost/PHP-API/";
var projectPath = sessionStorage.getItem('projectPath'),
	baseURL = sessionStorage.getItem("baseURL"),
	message = sessionStorage.getItem('message'),
	LicKey = sessionStorage.getItem("LicKey"),
	AccessToken = sessionStorage.getItem("AccessToken"),
	endpoint = "recentimages/" + baseid,
	endpointEmp = 'employees',
	category = sessionStorage.getItem('category'),
	prefix = sessionStorage.getItem("prefix"),
	rangeEndpoint = "single-timesheet/" + baseid,
	requesturl = baseURL + prefix + endpoint,
	rangeRequesturl = baseURL + prefix + rangeEndpoint;

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

function selectImgClose() {
	$("#selectImageError").hide();
}
var settingsEmp = {
	"url": baseURL + prefix + endpointEmp,
	"method": "POST",
	"headers": {
		"AccessToken": AccessToken,
		"LicKey": LicKey,
		"Content-Type": "application/json"
	},
};
$.ajax(settingsEmp).done(function (response) {
	var data1 = response['ResponseData'];
	var GroupArr = GroupArr + '<option value="">--Select Employee--</option>';
	for (var j in data1) {
		GroupArr = GroupArr + '<option value="' + data1[j]['EmpId'] + '">' + data1[j]['EmpName'] + '</option>';
		$('#location_id').val(data1[j]['BaseLocationId']);
	}
	$('#emp_move_id').html(GroupArr);
});
$('#buttonId').text("Time Seen Details" + " " + baseid);

var fromData = '',
	toDate = '';
$('body').on('change', 'input[name=setDate]', function () {
	fromData = $('#inlineFormInput').val();
	toDate = $('#inlineToInput').val();
	$("#inlineFormInput").attr('value', dateFormat(fromData));
	$("#inlineToInput").attr('value', dateFormat(toDate));
	$('input[name=datesubmit]').on('click', function () {
		ShowListing();
	});
});

if (fromData == '' && toDate == '') {
	var d = new Date();
	vardate = dateFormat(d);
	$("#inlineFormInput").attr('value', vardate);
	$("#inlineToInput").attr('value', vardate);
	ShowListing();
}

//Listing API
function ShowListing() {
	var fromdt = $("#inlineFormInput").val();
	var todt = $("#inlineToInput").val();
	var settings = {
		"url": rangeRequesturl,
		"method": "POST",
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"StartDate": fromdt,
			"EndDate": todt
		}),
	};
	$.ajax(settings).done(function (response) {
		var DataImg = response["ResponseData1"];
		var userImgData = DataImg[0]["EmpImage"];
		var DateArr = [];
		var cntArr = [];
		var htmlData = '';
		var dtFirst = new Date(fromdt);
		var dtLast = new Date(todt);
		for (; dtFirst <= dtLast; dtFirst.setDate(dtFirst.getDate() + 1)) {
			DateArr.push(new Date(dtFirst));
		}
		var m = 0;
		var imgindex = 1;
		$.each(DateArr, function (keyDate, valDate) {
			var DisplayDate = dateFormat(valDate);
			m++;
			if (m == 1) {
				var userOutImg = '<div class="timeline-badge success"><img alt="Image" src="' + baseURL + userImgData + '" id="imgId" class="rounded-circle" style="height: 70px;width: 70px;"></div>';
			} else {
				var userOutImg = '';
			}
			htmlData += '<li class="timeline-inverted timeline-item">' + userOutImg + '<div class="timeline-panel mt-2"><div class="timeline-heading"><button type="button" class="btn btn-primary btn-sm"> <i class="fa fa-calendar-alt" id="btnId"></i><span id="countDate">' + DisplayDate + '</span> </button><small class="text-muted" id="totalEntry">Total Entry:<span id="cntTotal' + m + '"></span></small></div><div class="timeline-body"><div class="row">';
			var k = 1;
			var imgurl = '';
			$.each(response['ResponseData'], function (keyImg, valImg) {
				if (dateFormat(valDate) == valImg['ADDate']) {
					singleImgindex = m + "_" + imgindex;
					singleImgindexFun = "showImage('" + singleImgindex + "')";
					if (valImg['EmpImage'] != null && valImg['EmpImage'] != '')
						imgurl = newbaseURL + valImg['EmpImage'];
					imgurl = imgurl.replace("thumb", "large");
					htmlData += '<div class="col-md-1"><div class="custom-control custom-checkbox"><input type="checkbox" name="location[]" class="custom-control-input" id="cst' + valImg['ActivityDetailsId'] + '" value="' + valImg['ActivityDetailsId'] + '"><label class="custom-control-label gallery-chk-box-pos" for="cst' + valImg['ActivityDetailsId'] + '"> </label></div><a class="image-popup-vertical-fit"  onclick="' + singleImgindexFun + '" href="javascript:void(0);" title="' + dateTimeFormat(valImg['ADTime']) + '" ><img id="rangeImg' + singleImgindex + '" alt="user" class="img-thumbnail img-responsive" src="' + imgurl + '" title="' + dateTimeFormat(valImg['ADTime']) + '"></a></div>';
					k++;
					imgindex++;
				}
			});
			cntArr.push(k);
			htmlData += '</div></div></div></li>';
		});
		$('#displayDateWiseData').html(htmlData);
		var d = 1;
		$.each(cntArr, function (keyCnt, valCnt) {
			$('#cntTotal' + d).html(valCnt - 1);
			d++;
		});
	});
}

function registationmodalOpen() {
	$('#verticalcenter').hide();
	$('#registationmodal').show();
}

//Get All selected Image
function getAllSelectImage() {
	var all_location_id = document.querySelectorAll('input[name="location[]"]:checked');
	var alllocationlength = all_location_id.length;
	if (alllocationlength) {
		var selectorData = 1;
		var aIds = [];
		for (var x = 0, l = alllocationlength; x < l; x++) {
			aIds.push(all_location_id[x].value);
		}
		var str = aIds.join(', ');
		document.getElementById("all_image_id").value = str;
		return selectorData;
	} else {
		var selectorData = 2;
		$('#selectImageError').show();
		return selectorData;
	}
}


function multiMoveModalOpen() {
	var response = getAllSelectImage();
	if (response == 1) {
		$('#selectImageError').hide();
		$('#verticalcenter').show();
	}
}

//close Button
function closeBtn() {
	$('#verticalcenter').hide();
}

//Multiple image move to emp
function multiMoveEmployeeImage() {
	$('#move_image_upload_loader_bar').show();
	var employeeID = $("#emp_move_id").val();
	var allImageID = $("#all_image_id").val();
	var baseLocationID = $("#location_id").val();
	var oldEmp = baseid;
	var MoveEnd = "single-timesheet-move";
	var settingsMove = {
		"url": baseURL + prefix + MoveEnd,
		"method": "PUT",
		"timeout": 0,
		"headers": {
			"AccessToken": AccessToken,
			"LicKey": LicKey,
			"Content-Type": "application/json"
		},
		"data": JSON.stringify({
			"OldEmpId": baseid,
			"NewEmpId": employeeID,
			"ActivityDetailsId": allImageID,
			"BaseLocationId": baseLocationID
		}),
	};
	$.ajax(settingsMove).done(function (response) {
		if (response['category'] == '1') {
			$('#verticalcenter').hide();
			sessionStorage.setItem('message', response['message']);
			sessionStorage.setItem('category', response['category']);
			location.reload();
		} else {
			sessionStorage.setItem('message', response['message']);
			sessionStorage.setItem('category', response['category']);
			location.reload();
		}
	});
}

//Multiple Image Delete
function multiDelete() {
	var deleteEnd = "single-timesheet-delete";
	var response = getAllSelectImage();
	if (response == 1) {
		var allImageID = document.getElementById("all_image_id").value;
		var settingsDlt = {
			"url": baseURL + prefix + deleteEnd,
			"method": "PUT",
			"headers": {
				"AccessToken": AccessToken,
				"LicKey": LicKey,
				"Content-Type": "application/json"
			},
			"data": JSON.stringify({
				"EmpId": baseid,
				"ActivityDetailsId": allImageID
			}),
		};
		$.ajax(settingsDlt).done(function (response) {
			if (response['category'] == '0') {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				location.reload();
			} else {
				sessionStorage.setItem('category', response['category']);
				sessionStorage.setItem('message', response['message']);
				location.reload();
			}
		});
	}
}

//Date Formate
function dateFormat(data) {
	if (data != '' && data != '0000-00-00' && data != undefined && data != null) {
		var date = new Date(data);
		var day = '', month = '', year = '', fullDate = '';
		var getMonth = date.getMonth() + 1;
		if (date.getDate() <= 9)
			day = '0' + date.getDate();
		else
			day = date.getDate();
		if (date.getMonth() + 1 <= 9)
			month = '0' + getMonth;
		else
			month = getMonth;
		year = date.getFullYear();

		fullDate = year + '-' + month + '-' + day;
		return fullDate;
	} else
		return '';
}

//Show Single Image
function showImage(singleImgindex) {
	var fullIdOfImage = $('#rangeImg' + singleImgindex).attr('src');
	var timeTitleText = $('#rangeImg' + singleImgindex).attr('title');
	$('#timeTitle').text("Capture Time : " + timeTitleText);
	$('#imagepreview').attr('src', fullIdOfImage);
	$('#imagemodal').modal('show');
}

//Time Formate
function dateTimeFormat(da) {
	var d = new Date(da),
		hours = d.getHours(),
		minutes = d.getMinutes(),
		second = d.getSeconds(),
		day = '', month = '', year = '';
	var getMonth = d.getMonth() + 1;

	if (d.getDate() <= 9)
		day = '0' + d.getDate();
	else
		day = d.getDate();
	if (d.getMonth() + 1 <= 9)
		month = '0' + getMonth;
	else
		month = getMonth;
	year = d.getFullYear();
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	second = second < 10 ? '0' + second : second;
	var strTime = day + '-' + month + '-' + year + " " + hours + ':' + minutes + ':' + second;
	return strTime;
}