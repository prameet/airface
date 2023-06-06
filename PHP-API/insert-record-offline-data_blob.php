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

if (!empty($_POST)) {

  $local_db_id = $_POST['local_id'];
  $empid = $_POST['empid'];
  $time = $_POST['time'];
  $date = $_POST['date'];
  $createDate = $date;
  $prob = $_POST['prob'];
  $src = "cam 01";
  $photo = $_POST['file'];
  $lic_key = $_POST['lic_key'];
  $loc_id = $_POST['loc_id'];
  $file_name = $_POST['file'];
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
  $file_name_save = strtotime($time) . "_" . $empID . "_" . $lic_key . ".png";
  $file_save_dir = $target_dir_large_date . "/" . $file_name_save;
  $file_save_thumb_dir = $target_dir_thumb_date . "/" . $file_name_save;
  $img = str_replace('data:image/png;base64,', '', $photo);
  $img = str_replace(' ', '+', $img);
  $data = base64_decode($img);
  file_put_contents($file_save_dir, $data);
  $QsAuth = $conn->query("SELECT `zoho_auth_key` FROM `organization` WHERE `lic_key`='" . $lic_key . "'");
  $RsAuth = $QsAuth->fetch_object();
  $authToken = $RsAuth->zoho_auth_key;
  $dateFormat = "dd/MM/yyyy HH:mm:ss";
  $checkIn = date('d/m/Y H:i:s', strtotime($time));
  $checkOut = '';
  $striped_emp_id = substr($empid, 1);
  $im_php = imagecreatefrompng($file_save_dir);
  $im_php = imagescale($im_php, 100);
  $new_height = imagesy($im_php);
  imagepng($im_php, $file_save_thumb_dir);

  $sql = "INSERT INTO activitydetails(empid,time_,date_,prob,src,file_location,lic_key,image,loc_id) VALUES ('" . $striped_emp_id . "', '" . $time . "', '" . $createDate . "', '" . $prob . "', '" . $src . "', 'file', '" . $lic_key . "', '" . $file_save_thumb_dir . "','" . $loc_id . "')";
  echo $sql;
  // $result_insert = $conn->query($sql);
} else {
  echo "Sorry, there was an error creating your file.";
}
