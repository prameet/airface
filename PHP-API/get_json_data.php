<?php
error_reporting(0);
$server = "localhost";
$user = "root";
$pass = "";
$dbname = "api_v2";

date_default_timezone_set('Asia/Kolkata');

$conn = new mysqli($server, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed:" . $conn->connect_error);
}
if (isset($_POST)) {
    $lic_key = $_POST['lic_key'];
    $QsGetAuth = $conn->query("SELECT * FROM `datasetencodings`  WHERE `LicKey` = '" . $lic_key . "' AND IsActive =1");
    $RsResult = $QsGetAuth->fetch_all(MYSQLI_ASSOC);

    if (count($RsResult) > 0) {
        $msg = "Fetch Data Successful";
        $data_new = $RsResult;
        $resultObj->msg = $msg;
        $resultObj->responsedata = $data_new;
    } else {
        $msg = "No Data Found";
        $data = "";
        $resultObj->msg = $msg;
        $resultObj->responsedata = $data_new;
    }
} else {
    $msg = "Parameters Missing";
    $data = "";
    $resultObj->msg = $msg;
    $resultObj->responsedata = $data_new;
}
echo json_encode($resultObj);
