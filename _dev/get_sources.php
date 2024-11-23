<?php
// Check if the 'folder' parameter is provided in the query string.
if (isset($_GET['folder'])) {
    $folder = $_GET['folder'];

    // Recursive function to scan a folder and its subfolders.
    function scanFolder($dir) {
        $subDirFiles = [];
        $topLevelFiles = [];

        if (is_dir($dir)) {
            $files = scandir($dir);
            foreach ($files as $file) {
                if ($file[0] != '.' && $file != "." && $file != "..") {
                    $filePath = $dir . DIRECTORY_SEPARATOR . $file;

                    if (is_dir($filePath)) {
                        // Collect files from subdirectories recursively.
                        $subDirFiles = array_merge($subDirFiles, scanFolder($filePath));
                    } else {
                        // Collect files from the top level.
                        $topLevelFiles[] = $filePath;
                    }
                }
            }
        }

        // Return subdirectory files first, then top-level files.
        return array_merge($subDirFiles, $topLevelFiles);
    }

    // Initialize an array to store file paths.
    if (is_dir($folder)) {
        echo json_encode(scanFolder($folder));
    } else {
        echo json_encode([]);
    }
} else {
    echo json_encode([]);
}
?>
