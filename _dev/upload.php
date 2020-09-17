<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Uploader</title>
</head>
<body>
	<?php
		$filename = $_GET["filename"];
		if(isset($_POST["xmldata"])) {
			$myfile = fopen($filename, "w") or die("Unable to open file!");

			fwrite($myfile, urldecode($_POST["xmldata"]));
			fclose($myfile); 
		}
	?>
</body>
</html>
