<?php
// Check if the 'folder' parameter is provided in the query string.
if (isset($_GET['folder'])) {
	$folder = $_GET['folder'];

	// Initialize an array to store file paths.
	$filePaths = [];

	// Recursive function to scan a folder and its subfolders.
	function scanFolder($dir) {
      $filePaths = [];
      if (is_dir($dir)) {
          $files = scandir($dir);
          foreach ($files as $file) {
              if ($file[0] != '.' &&  $file != "." && $file != "..") {
                  $filePath = $dir . DIRECTORY_SEPARATOR . $file;
                  if (is_dir($filePath)) {
                      $filePaths = array_merge($filePaths, scanFolder($filePath));
                  } else {
                      $filePaths[] = $filePath;
                  }
              }
          }
      }
      return $filePaths;
  }

	if (is_dir($folder)) {
		echo json_encode(scanFolder($folder));
	} else {
		echo json_encode([]);
	}
} else {
	echo json_encode([]);
}
?>
