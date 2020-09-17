<!DOCTYPE php>
<html>
<head>
	<title>Simple 2</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<style>
		html { height:100%; }
		body { height:100%; overflow:hidden; margin:0; padding:0; font-family: Lato, sans-serif; font-size:16px; color:#FFFFFF; background-color:#000000; }
	</style>

	<script type="text/javascript" src="_app/js/js.js?t=<?php echo time(); ?>"></script>
	<link rel="stylesheet" href="_app/css/css.css?t=<?php echo time(); ?>" >

</head>
<body>

<script src="_app/tour.js"></script>

<div id="pano" style="width:100%;height:100%;">
	<noscript><table style="width:100%;height:100%;"><tr style="vertical-align:middle;"><td><div style="text-align:center;">ERROR:<br/><br/>Javascript not activated<br/><br/></div></td></tr></table></noscript>
	<script>
		
		var timestamp = Date.now();

		embedpano({
			xml:"tour/tour.xml?t=" + timestamp, 
			target:"pano", 
			html5:"only", 
			webxr:"auto",
			initvars:{
				_timestamp: '?t=' + timestamp,
				_location: `${window.location.href.split('index.php')[0].split('?')[0]}/tour/`
			}, 
			passQueryParameters:true
		});
	</script>
</div>

</body>
</html>
