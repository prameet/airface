/*
Written by : Milan Kumar Singh
Dated On : 21-06-2020
*/
function numbersonly(e)
{
 var unicode=e.charCode? e.charCode : e.keyCode 
 if (unicode!=8){ //if the key isn't the backspace key (which we should allow)
  if (unicode<48||unicode>57  ) //if not a number  
  return false //disable key press    
 }
}

function showdailyreportmodel(employeeID,day_no)
{
	var dayno = String(day_no).padStart(2, '0');
	$('#attendance_info').modal('show');
	var searchdate = search_year+"-"+search_month+"-"+dayno;
	if (employeeID != "")
	{
		$.ajax({
			data : {
				'masterID' : employeeID,
				'filterdate' : searchdate
			},
			type : 'POST',
			url : '/getdailyreport/'
		})
		.done(function(data)
		{
			if (data.category == 'error') 
			{
				$('#errorAlert').text(data.feedback).show();
				$('#successAlert').hide();
			}
			else
			{
				var currentDate = data.activitysummary['DATE_'];
				var EMPLOYEE_ID = data.activitysummary['EMPLOYEE_ID'];
				var EMPLOYEE_NAME = data.activitysummary['EMPLOYEE_NAME'];
				var FIRST_SEEN = data.activitysummary['FIRST_SEEN'];
				var LAST_SEEN = data.activitysummary['LAST_SEEN'];
				var Totalhour = data.activitysummary['Totalhour'];
				function msToTime(duration) 
				{
					  var milliseconds = parseInt((duration % 1000) / 100),
						seconds = Math.floor((duration / 1000) % 60),
						minutes = Math.floor((duration / (1000 * 60)) % 60),
						hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

					  hours = (hours < 10) ? "0" + hours : hours;
					  minutes = (minutes < 10) ? "0" + minutes : minutes;
					  seconds = (seconds < 10) ? "0" + seconds : seconds;

					  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
				}
				
				if(Totalhour !="0:00:00" && Totalhour !="00:00:00")
				{
					var totalworkHour = Totalhour+"</br> Hour(s)";
				}
				else
				{
					var totalworkHour = "0 hour";
				}
				document.getElementById("day_activity_title").innerHTML = "Attendance Info | <span style='color: brown'>"+EMPLOYEE_NAME+"</span>";
				document.getElementById("timesheet_date").innerHTML = searchdate;
				document.getElementById("first_seen_at").innerHTML = FIRST_SEEN;
				document.getElementById("last_seen_at").innerHTML = LAST_SEEN;
				document.getElementById("total_hour").innerHTML = totalworkHour;
				var totalRecordList = '';
				var cntRecords = data.activityloglist.length;
				if(cntRecords < 1)
				{
					document.getElementById("all_activity_list").innerHTML = '';
					document.getElementById("all_activity_list").innerHTML = "<li><p class='mb-0'><span class='text-danger'>No list found</span></p></li>";
				}
				else
				{
					var startul = "";
					var middleli = "";
					for (var i = 0; i < cntRecords; i++)
					{
						var listData = data.activityloglist;
						//var currentdatetime = new Date(listData[i]['showtime']);
						var cameraname = listData[i]['camera_name'];
						var showingTime = listData[i]['showtime'];
						var image_thump = listData[i]['image_thump'];
						//let showingTime = currentdatetime.getHours() + ":" + currentdatetime.getMinutes() + ":" + currentdatetime.getSeconds();

						addli = "<li><p class='mb-0'><a class='avatar avatar-xs' href='javascript:void(0);'><img alt='' src='/"+image_thump+"'></a>  <i class='fa fa-clock-o'></i> "+showingTime+" &nbsp;Seen at : [ "+cameraname+" ]</p></li>";
						middleli = middleli + addli;
					}
					totalRecordList = startul+middleli;
					document.getElementById("all_activity_list").innerHTML = '';
					console.log("================new work====================")
					console.log(totalRecordList)
					console.log("================new work====================")
					document.getElementById("all_activity_list").innerHTML = totalRecordList;
				}
			}

		});
		//event.preventDefault();
	}
	else
	{
	}

}



function visitorlogactivity(visitorID,day_no)
{
	var dayno = String(day_no).padStart(2, '0');
	$('#attendance_info').modal('show');
	var searchdate = search_year+"-"+search_month+"-"+dayno;
	if (visitorID != "")
	{
		$.ajax({
			data : {
				'masterID' : visitorID,
				'filterdate' : searchdate
			},
			type : 'POST',
			url : '/getvisitordailyreport/'
		})
		.done(function(data)
		{
			if (data.category == 'error') 
			{
				$('#errorAlert').text(data.feedback).show();
				$('#successAlert').hide();
			}
			else
			{
				var currentDate = data.activitysummary['DATE_'];
				var EMPLOYEE_ID = data.activitysummary['VISITOR_ID'];
				var VISITOR_NAME = data.activitysummary['VISITOR_NAME'];
				var FIRST_SEEN = data.activitysummary['FIRST_SEEN'];
				var LAST_SEEN = data.activitysummary['LAST_SEEN'];
				var Totalhour = data.activitysummary['Totalhour'];
				function msToTime(duration) 
				{
					  var milliseconds = parseInt((duration % 1000) / 100),
						seconds = Math.floor((duration / 1000) % 60),
						minutes = Math.floor((duration / (1000 * 60)) % 60),
						hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

					  hours = (hours < 10) ? "0" + hours : hours;
					  minutes = (minutes < 10) ? "0" + minutes : minutes;
					  seconds = (seconds < 10) ? "0" + seconds : seconds;

					  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
				}
				
				if(Totalhour !="0:00:00" && Totalhour !="00:00:00")
				{
					var totalworkHour = Totalhour+"</br> Hour(s)";
				}
				else
				{
					var totalworkHour = "0 hour";
				}
				document.getElementById("day_activity_title").innerHTML = "Attendance Info | <span style='color: brown'>"+VISITOR_NAME+"</span>";
				document.getElementById("timesheet_date").innerHTML = searchdate;
				document.getElementById("first_seen_at").innerHTML = FIRST_SEEN;
				document.getElementById("last_seen_at").innerHTML = LAST_SEEN;
				document.getElementById("total_hour").innerHTML = totalworkHour;
				var totalRecordList = '';
				var cntRecords = data.activityloglist.length;
				if(cntRecords < 1)
				{
					document.getElementById("all_activity_list").innerHTML = '';
					document.getElementById("all_activity_list").innerHTML = "<li><p class='mb-0'><span class='text-danger'>No list found</span></p></li>";
				}
				else
				{
					var startul = "";
					var middleli = "";
					for (var i = 0; i < cntRecords; i++)
					{
						var listData = data.activityloglist;
						//var currentdatetime = new Date(listData[i]['showtime']);
						var cameraname = listData[i]['camera_name'];
						var showingTime = listData[i]['showtime'];
						var image_thump = listData[i]['image_thump'];
						//let showingTime = currentdatetime.getHours() + ":" + currentdatetime.getMinutes() + ":" + currentdatetime.getSeconds();

						addli = "<li><p class='mb-0'><a class='avatar avatar-xs' href='javascript:void(0);'><img alt='' src='/"+image_thump+"'></a>  <i class='fa fa-clock-o'></i> "+showingTime+" &nbsp;Seen at : [ "+cameraname+" ]</p></li>";
						middleli = middleli + addli;
					}
					totalRecordList = startul+middleli;
					document.getElementById("all_activity_list").innerHTML = '';
					console.log("================new work====================")
					console.log(totalRecordList)
					console.log("================new work====================")
					document.getElementById("all_activity_list").innerHTML = totalRecordList;
				}
			}

		});
		//event.preventDefault();
	}
	else
	{
	}

}

function checkValidation(allids) 
{
	var error = 0;
	$(allids).each(function() {
	  if ($(this).val() == '') {
		  document.getElementById(this.id).style.border = "1px solid red";
		error= error +1;
	  }else{
		  document.getElementById(this.id).style.border = "1px solid green";
	  }
	});
	if(error > 0){
		 return false;
	}else{
		return true;
	}
}