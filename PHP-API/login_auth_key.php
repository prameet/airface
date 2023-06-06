<?php
$server = "localhost";
$user = "root";
$pass = "";
$dbname = "api_v2";

date_default_timezone_set('Asia/Kolkata');

$conn = new mysqli($server, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed:" . $conn->connect_error);
}

$SecKey = $_POST['sec_key'];
$SysId = $_POST['sys_id'];

$QsGetAuth = $conn->query("SELECT * FROM `secretkey` WHERE `SecretKey` = '" . $SecKey . "'");
$RsResult = $QsGetAuth->fetch_assoc();

// print_r($RsResult);
if (count($RsResult) != 0) {
    $LicKey = $RsResult['LicKey'];
    $Status = $RsResult['Status'];
    $SecretKey = $RsResult['SecretKey'];
    $SystemInfo = $RsResult['SystemInfo'];
    if ($SystemInfo == "" || $Status = 0) {

        $sql = "UPDATE `secretkey` SET `SystemInfo` = '" . $SysId . "', `Status`  = 1 WHERE `SecretKey` = '" . $SecKey . "'";
        // echo $sql;
        $result_insert = $conn->query($sql);

        if ($result_insert) {
            $msg = "System Info Matched";
            $data = $RsResult;
            $returnArray = array("msg" => $msg, "data" => $data);
            echo json_encode($returnArray);
        } else {
            $msg = "System Info Not Saved";
            $data = "";
            $returnArray = array("msg" => $msg, "data" => $data);

            echo json_encode($returnArray);
        }
    } else {
        if ($SysId == $SystemInfo) {
            $msg = "System Info Matched";
            $data = $RsResult;
            $returnArray = array("msg" => $msg, "data" => $data);
            // echo "System Info Matched";
            echo json_encode($returnArray);
        } else {

            $msg = "System Info Did not Match";
            $data = "";
            $returnArray = array("msg" => $msg, "data" => $data);

            echo json_encode($returnArray);
        }
        // echo "authkey used";
    }
}
