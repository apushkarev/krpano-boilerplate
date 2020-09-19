// https://github.com/abdolence/x2js

const krpanoSrc = [

	'../_dev/src/devlib2.kml'

	// '../_dev/src/module_name/actions.kml',	
	// '../_dev/src/module_name/events.kml',	
	// '../_dev/src/module_name/lov.kml',	
	// '../_dev/src/module_name/objects.kml',	
	// '../_dev/src/module_name/prototypes.kml',	
	// '../_dev/src/module_name/structure.kml'
];

const jsSources = [
	'../_dev/js/common.js',
	'../_dev/js/app.js',
	'../_dev/js/os.js',
];

const cssSources = [
	'../_dev/css/tour.css'
	// '../_dev/css/font.css'
];

async function readFile(url) {
	const response = await fetch(url);
	return await response.text();
}

async function saveFile(fname, data) {

	return new Promise((resolve, reject) => {
	  var xmlData = new FormData;
	  xmlData.append('xmldata', data);

	  var xhr = new XMLHttpRequest();

	  xhr.onreadystatechange = function() {
	    if (this.readyState == 4) {
	    	resolve(true);
	    }
	  }

	  try {
	    xhr.open("POST", `upload.php?filename=${fname}`);
	    xhr.send(xmlData);
	  } catch(e) {
	    console.log('Upload file error: ' + e.description); 
	  }
	});
}

async function mergeKRPanoSources(fileArray, mergedFileName) {

	let fileJSON = {};
	let fileXML = ''
	let mergedCode = '';
	let mergedRoot = {
		krpano: {}
	};
	let mergedRootString = '';
	const x2js = new X2JS();

	for (let file of fileArray) {

		console.log(file);

		fileXML = (await readFile(`${file}?t=${Date.now()}`)).replace(RegExp('__', 'g'), '_DOUBLE_UNDERSCORE_').replace(RegExp('<_', 'g'), '<GLOBAL_OBJECT');
		fileJSON = x2js.xml_str2json(fileXML).krpano;

		for (let key of Object.keys(fileJSON)) {
			if (key[0] == '_' && key.length > 1) {
				mergedRoot.krpano[key] = fileJSON[key];
			}
		}
		mergedCode += x2js.json2xml_str(fileJSON);
	}

	mergedRoot.krpano.__text = '';
	mergedRootString = x2js.json2xml_str(mergedRoot);
	mergedRootString = mergedRootString.slice(0, -9) + mergedCode + mergedRootString.slice(-9);
	mergedRootString = mergedRootString.replace(RegExp('[ \n\t]+', 'g'), ' ')
																		.replace(RegExp('\'', 'g'), '"')
																		.replace(RegExp('&apos;', 'g'), '\'')
																		.replace(RegExp('_DOUBLE_UNDERSCORE_', 'g'), '__')
																		.replace(RegExp('GLOBAL_OBJECT', 'g'), '_');

	return await saveFile(mergedFileName, encodeURIComponent(vkbeautify.xml(mergedRootString)));
}

async function mergeFiles(fileArray, mergedFileName) {

	let mergedString = '';	

	for (let file of fileArray) {
		mergedString += await readFile(`${file}?t=${Date.now()}`);
	}

	return await saveFile(mergedFileName, encodeURIComponent(mergedString));
}
