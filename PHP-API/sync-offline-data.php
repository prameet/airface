<?php
error_reporting(0);
$server = "localhost";
$user = "root";
$pass = "";
$dbname = "api_v2";

date_default_timezone_set('Asia/Kolkata');

$conn = new mysqli($server, $user, $pass, $dbname);
$return_data = [];
if ($conn->connect_error) {
    die("Connection failed:" . $conn->connect_error);
}
// print_r($_REQUEST);
// print("here");
$json = file_get_contents('php://input');
$data = json_decode($json);
// print_r($data);
if (!empty($json)) {
    $local_db_id = $data->local_id;
    $empid = $data->empid;
    $time = $data->time;
    $date = $data->date;
    $createDate = $date;
    $prob = $data->prob;
    $src = "cam 01";
    $photo = $data->file;
    $lic_key = $data->lic_key;
    $loc_id = $data->loc_id;
    $file_name = $data->file;
    $target_dir_large = "images/large";
    $target_dir_thumb = "images/thumb";
    if (is_dir($target_dir_large) === false) {
        mkdir($target_dir_large);
    }
    if (is_dir($target_dir_thumb) === false) {
        mkdir($target_dir_thumb);
    }
    $target_dir_large_lic = "images/large/" . $lic_key;
    $target_dir_thumb_lic = "images/thumb/" . $lic_key;
    if (is_dir($target_dir_large_lic) === false) {
        mkdir($target_dir_large_lic);
    }
    if (is_dir($target_dir_thumb_lic) === false) {
        mkdir($target_dir_thumb_lic);
    }

    $target_dir_large_date = "images/large/" . $lic_key . "/" . $date;
    $target_dir_thumb_date = "images/thumb/" . $lic_key . "/" . $date;

    if (is_dir($target_dir_large_date) === false) {
        mkdir($target_dir_large_date);
    }
    if (is_dir($target_dir_thumb_date) === false) {
        mkdir($target_dir_thumb_date);
    }
    $empID = str_replace("#", "", $empid);
    chop($empid, "#");
    // $file_name_save = strtotime($time) . "_" . $empID . ".png";
    $file_name_save = strtotime($time) . "_" . $empID . "_" . $lic_key . ".png";

    $file_save_dir = $target_dir_large_date . "/" . $file_name_save;

    $file_save_thumb_dir = $target_dir_thumb_date . "/" . $file_name_save;

    $img = str_replace('data:image/png;base64,', '', $photo);

    $img = str_replace(' ', '+', $photo);
    $data = base64_decode($img);
    file_put_contents($file_save_dir, $data);
    // echo  $empid;

    $striped_emp_id = substr($empid, 1);
    // echo  $striped_emp_id;
    $im_php = imagecreatefrompng($file_save_dir);

    $im_php = imagescale($im_php, 100);
    $new_height = imagesy($im_php);

    $QsShiftDetails = "SELECT A.EmployeeShiftHistoryId, A.EmpId,A.StartDate,A.EndDate,B.IsNightShift,B.BaseLocationId,A.ShiftMasterId,convert(B.StartTime,char) AS StartTime,convert(B.EndTime,char) AS EndTime from EmployeeShiftHistory AS A ,ShiftMaster AS B  where A.LicKey='" . $lic_key . "' AND A.StartDate='" . $createDate . "' AND A.EmpId='" . $empID . "' AND A.ShiftMasterId=B.ShiftMasterId";
    $QsGetAuth = $conn->query($QsShiftDetails);
    $RsShiftDetails = $QsGetAuth->fetch_all(MYSQLI_ASSOC);
    if (count($RsShiftDetails) > 0) {
        $BaseLocationId = $RsShiftDetails[0]['BaseLocationId'];
        $EmployeeShiftHistoryId = $RsShiftDetails[0]['EmployeeShiftHistoryId'];
        $ShiftMasterId = $RsShiftDetails[0]['ShiftMasterId'];
        if ($ShiftMasterId != "" && $EmployeeShiftHistoryId != "" &&  $BaseLocationId != "") {
            $sql = "INSERT INTO activitydetails(EmpId,ADTime,ADDate,Prob,Source,EmpImage,LicKey,BaseLocationId,EmployeeShiftHistoryId,ShiftMasterId) VALUES ('" . $striped_emp_id . "', '" . $time . "', '" . $createDate . "', '" . $prob . "', '" . $src . "', '" . $file_save_thumb_dir . "', '" . $lic_key . "','" . $BaseLocationId . "','" . $EmployeeShiftHistoryId . "','" . $ShiftMasterId . "')";

            if ($conn->query($sql) === TRUE) {
                $return_data['msg'] = "New record created successfully";
                $return_data['local_id'] = $local_db_id;
            } else {
                $return_data['msg'] = "Error: " . $sql . "<br>" . $conn->error;
                $return_data['local_id'] = "";
            }
        } else {
            $return_data['msg'] = "Parameters Missing in the request";
            $return_data['local_id'] = "";
        }
    }
} else {
    $return_data['msg'] = "Sorry, there was an error creating your file.";
    $return_data['local_id'] = "";
}
// print_r($return_data);
echo json_encode($return_data);
