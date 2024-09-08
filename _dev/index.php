<!DOCTYPE php>
<html>
<head>
	<title>Krpano Bundler</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0"/>
	<meta http-equiv="Pragma" content="no-cache"/>
	<meta http-equiv="Expires" content="0"/>
	<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />


	<link rel="stylesheet" href="css/font.css?t=<?php echo base_convert(time(),10,36); ?>" >
	<link rel="stylesheet" href="css/tour.css?t=<?php echo base_convert(time(),10,36); ?>" >

	<script type="text/javascript" src="js/common.js?t=<?php echo base_convert(time(),10,36); ?>"></script>
	<script type="text/javascript" src="bundler/source-merge.js?t=<?php echo base_convert(time(),10,36); ?>"></script>

	<script type="text/javascript" src="js/xml2json.min.js"></script>
	<script type="text/javascript" src="js/vkbeautify.js"></script>

	<script type="text/javascript" src="js/app.js?t=<?php echo base_convert(time(),10,36); ?>"></script>

</head>
<body>

<script src="../_app/tour.js?t=<?php echo base_convert(time(),10,36); ?>"></script>

<script>

	(async function buildTour() {

		const documentURL = new URL(window.location);

		const tourTitle = documentURL.searchParams.get("tour") ?? 'tour';
		const devmode = documentURL.searchParams.get("devmode") == '';

		const timestamp = Math.round(Date.now() / 1000).toString(36);

		window.tourLocation = `../`;

		// bundling...
		const t0 = performance.now();

		const krpanoSrc = await fetch(`get_sources.php?folder=src&t=${timestamp}`).then(response => response.json());
		const jsSrc = await fetch(`get_sources.php?folder=js&t=${timestamp}`).then(response => response.json());
		const cssSrc = await fetch(`get_sources.php?folder=css&t=${timestamp}`).then(response => response.json());

		await mergeKRPanoSources(krpanoSrc, '../_app/kml/app.xml', 'upload.php');
		await mergeFiles(jsSrc, '../_app/js/js.js', 'upload.php');
		await mergeFiles(cssSrc, '../_app/css/css.css', 'upload.php');

		// code_override files
		const tourSources = await fetch(`get_sources.php?folder=../${tourTitle}/code_override&t=${timestamp}`).then(response => response.json());
		if (tourSources.length) {
		  await mergeKRPanoSources(tourSources.map((item) => `../${tourTitle}/${item}`), `../${tourTitle}/bundle.xml`, 'upload.php');
		}

		const totalTime = Math.round(performance.now() - t0);
		console.log(`BUILD TOTAL TIME ${totalTime}ms`);

		document.title = `KB: ${totalTime}ms`;

		if (tourTitle) {
			document.fonts.ready.then(() =>{
		    setTimeout(function() {
		 			embedpano({
		 				xml:`../${tourTitle}/tour.xml?t=` + timestamp, 
		 				target:"pano", 
		 				html5:"only", 
		 				webxr:"auto",
		 				bgcolor: "#212426",
		 				initvars:{
		 					_timestamp: '?t=' + timestamp,
		 					_location: window.tourLocation,
		 					_is_dev: true,
		 					devmode
		 				}, 
		 				passQueryParameters:true
		 			});     
		    }, 250);
		  });
		}
	})()
	
</script>

<div id="pano" style="width:100%;height:100%;">
	<noscript><table style="width:100%;height:100%;"><tr style="vertical-align:middle;"><td><div style="text-align:center;">ERROR:<br/><br/>Javascript not activated<br/><br/></div></td></tr></table></noscript>
</div>

</body>
</html>
