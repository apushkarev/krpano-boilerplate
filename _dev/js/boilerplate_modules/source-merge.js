// https://github.com/abdolence/x2js

async function readFile(url) {
	const response = await fetch(url);
	return await response.text();
}

async function saveFile(fname, data, uploadURL) {

	return new Promise((resolve, reject) => {
	  var xmlData = new FormData;
	  xmlData.append('xmldata', data);

	  var xhr = new XMLHttpRequest();

	  xhr.onreadystatechange = function() {
	    if (this.readyState == 4) {
	    	console.log(`${Date().toString()}:: SAVED ${fname} TO ${uploadURL}`)
	    	resolve(true);
	    }
	  }

	  try {
	    xhr.open("POST", `${uploadURL}?filename=${fname}`);
	    xhr.send(xmlData);
	  } catch(e) {
	    console.log('Upload file error: ' + e.description); 
	  }
	});
}

async function mergeKRPanoSources(fileArray, mergedFileName, uploadURL) {

	let fileJSON = {};
	let fileXML = ''
	let mergedCode = '';
	let mergedRoot = {
		krpano: {}
	};
	let mergedRootString = '';
	const x2js = new X2JS();

	for (let file of fileArray) {

		console.log('reading ' + file);

		fileXML = (await readFile(`${file}?t=${Math.round(Date.now()/1000).toString(36)}`)).replace(RegExp('__', 'g'), '_DOUBLE_UNDERSCORE_').replace(RegExp('<_', 'g'), '<GLOBAL_OBJECT');
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
																		.replace(RegExp('GLOBAL_OBJECT', 'g'), '_')
																		.replace(RegExp('prototype', 'g'), 'style')
																		.replace(RegExp('object', 'g'), 'style')
																		.replace(RegExp('extends', 'g'), 'style');

	return await saveFile(mergedFileName, encodeURIComponent(vkbeautify.xml(mergedRootString)), uploadURL);
}

async function mergeFiles(fileArray, mergedFileName, uploadURL) {

	let mergedString = '';	

	for (let file of fileArray) {
		console.log('reading ' + file);
		mergedString += await readFile(`${file}?t=${Math.round(Date.now()/1000).toString(36)}`);
	}

	return await saveFile(mergedFileName, encodeURIComponent(mergedString), uploadURL);
}
