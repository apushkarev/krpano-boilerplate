function setKRPanoConsole() {
	krpano.childNodes[1].style.top = "-1px";
	krpano.childNodes[1].style.bottom = "0";
	krpano.childNodes[1].style.height = "450px";

	krpano.childNodes[1].childNodes[1].style.fontSize = "18px";
	krpano.childNodes[1].childNodes[1].style.lineHeight = "1.4";
	krpano.childNodes[1].childNodes[1].style.whiteSpace = "pre-wrap";
	krpano.childNodes[1].childNodes[1].style.height = "470px";
}

function getKRPano() {
	window.krpano = document.getElementById('krpanoSWFObject');
}

function readURL() {
	const documentURL = new URL(window.location);
	const devmode = documentURL.searchParams.get("devmode");

	if (devmode == '') {
		krpano.set('devmode', true);
		krpano.set('logkey', true);
		krpano.set('showerrors', true);
	}
}

function loadjscssfile(filename, filetype, onload) {

  if (filetype == 'js'){ 
    var fileref = document.createElement('script');
    fileref.setAttribute('type', 'text/javascript');
    fileref.setAttribute('src', filename);

  } else if (filetype == 'css') {
    var fileref = document.createElement('link');
    fileref.setAttribute('rel', 'stylesheet');
    fileref.setAttribute('type', 'text/css');
    fileref.setAttribute('href', filename);
  }
  if (typeof fileref != 'undefined')
    document.getElementsByTagName('head')[0].appendChild(fileref);
}

function hyphenate(text) {
  let all = "[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]",
      glas = "[аеёиоуыэю\я]",
      sogl = "[бвгджзклмнпрстфхцчшщ]",
      zn = "[йъь]",
      shy = "\xAD",
      regExpArr = [
        new RegExp("("+zn+")("+all+all+")","ig"),
        new RegExp("("+glas+")("+glas+all+")","ig"),
        new RegExp("("+glas+sogl+")("+sogl+glas+")","ig"),
        new RegExp("("+sogl+glas+")("+sogl+glas+")","ig"),
        new RegExp("("+glas+sogl+")("+sogl+sogl+glas+")","ig"),
        new RegExp("("+glas+sogl+sogl+")("+sogl+sogl+glas+")","ig")
      ];

  for (let regExp of regExpArr) {
    text = text.replace(regExp, "$1"+shy+"$2");
  }
  return text;
}

function checkStringLength(str) {
	krpano.set('string_length', str.length);	
}

function getRandomInt(min, max) {
  // http://caniuse.com/#feat=getrandomvalues
  if (window.crypto && window.crypto.getRandomValues) {
    return window.crypto.getRandomValues(new Uint8Array(1))[0] % (max - min) + min;
  } else if (window.msCrypto && window.msCrypto.getRandomValues) {
    return window.msCrypto.getRandomValues(new Uint8Array(1))[0] % (max - min) + min;
  } else {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

function setPageRatio(ratio) {

  const panoFrame = document.getElementById('pano');

  const stageAspect = document.body.offsetWidth / document.body.offsetHeight;

  if (stageAspect > ratio) {
    pano.style.height = `100%`;
    pano.style.width = `${document.body.offsetHeight * ratio / document.body.offsetWidth * 100}%`;
    pano.style.marginLeft = `${(document.body.offsetWidth - document.body.offsetHeight * ratio) / 2 / document.body.offsetWidth * 100}%`;
    pano.style.marginTop = 0;
  } else {
    pano.style.width = `100%`;
    pano.style.height = `${document.body.offsetWidth / ratio / document.body.offsetHeight * 100}%`;
    pano.style.marginTop = `${(document.body.offsetHeight - document.body.offsetWidth / ratio) / 2 / document.body.offsetHeight / ratio * 100}%`;
    pano.style.marginLeft = 0;
  }
}
// TO DO
// отключение гугл и локальной карты

/*
	
	там нужны только переключение панорам, вопросики и таймер аудио с кнопками?

	французы
	показ фоток по клику на аналог вопросика
	показ фоток по таймеру

*/
function setThumbTipArrowHTML(edge) {
	const thumbTipArrow = document.getElementById(`thumb-tip-arrow`);
	const borderColor = `#${krpano.get(`thumbTips.borderColor`)}`;
	const borderAlpha = Math.round(+krpano.get(`thumbTips.borderAlpha`) * 255).toString(16);

	thumbTipArrow.style.borderTopColor = 'transparent';
	thumbTipArrow.style.borderRightColor = 'transparent';
	thumbTipArrow.style.borderBottomColor = 'transparent';
	thumbTipArrow.style.borderLeftColor = 'transparent';

	switch (edge) {
		case 'top':
			thumbTipArrow.className = 'arrow-bottom';			
			thumbTipArrow.style.borderTopColor = `${borderColor}${borderAlpha}`;
			break;
		case 'right':
			thumbTipArrow.className = 'arrow-left';
			thumbTipArrow.style.borderRightColor = `${borderColor}${borderAlpha}`;
			break;
		case 'bottom':
			thumbTipArrow.className = 'arrow-top';
			thumbTipArrow.style.borderBottomColor = `${borderColor}${borderAlpha}`;
			break;
		case 'left':
			thumbTipArrow.className = 'arrow-right';
			thumbTipArrow.style.borderLeftColor = `${borderColor}${borderAlpha}`;
			break;
	}
}

function selectionFromKRPanoArray(array, limit, callback) {

	let k = 0;
	let index = 0;

	if (array.length > limit) {
		for (let i = 0; i < limit; i++) {

			const item = array[Math.floor(Math.random() * Math.floor(array.length))];

			if (!item.isSelected) {

				item.isSelected = true;

				callback(item, k);

				k++;
			} else {
				// is increased if random pointed to already selected array item
				limit++;
			}
		}
	} else {
		for (let i = 0; i < array.length; i++) {
			callback(array[index], i);
		}
	}
}


function animateHotspots() {

	const animatedHotspots = krpano.get(`animatedHotspots`).getArray();

	if (animatedHotspots) {
		selectionFromKRPanoArray(animatedHotspots, 3, function(item, index) {
			krpano.call(`
				delayedcall(${index * 0.1},
					callwith(hotspot[get(hotspot[${item.name}].linkedAniCircle)], startAnimation);
				);
			`);
		});

		animatedHotspots.forEach(function(item) {
		  item.isSelected = false;
		});
	}
}

function setTextWindowText(dataArrayItemName) {

	const text = krpano.get(`data[${dataArrayItemName}].content`);

	krpano.set(`layer[textWindowText].html`, hyphenate(text));
}

function setArrowCSS(hName) {

	krpano.set(`hotspot[${hName}].css`, `
		margin: 0;
		font-family: nav_arrows;
		font-size: ${krpano.get('arrowSettings.arrowFontSize')};
		text-align: center;
		line-height: ${krpano.get('arrowSettings.width')}px;
		color: #${krpano.get('arrowSettings.color')};
	`);

	krpano.set(`hotspot[${hName}].cssNormal`, `
		margin: 0;
		font-family: nav_arrows;
		font-size: ${krpano.get('arrowSettings.arrowFontSize')};
		text-align: center;
		line-height: ${krpano.get('arrowSettings.width')}px;
		color: #${krpano.get('arrowSettings.color')};
	`);

	krpano.set(`hotspot[${hName}].cssActive`, `
		margin: 0;
		font-family: nav_arrows;
		font-size: ${krpano.get('arrowSettings.arrowFontSize')};
		text-align: center;
		line-height: ${krpano.get('arrowSettings.width')}px;
		color: #${krpano.get('arrowSettings.colorOver')};
	`);
}

function setArrowTextCSS(hName) {

	krpano.set(`hotspot[${hName}].css`, `
		margin: 0;
		font-size: ${krpano.get('arrowTextSettings.textFontSize')};
		text-align: center;
		padding: 0.5em 0.75em 0.52em 0.5em;
		color: #${krpano.get('arrowTextSettings.color')};
	`);

	krpano.set(`hotspot[${hName}].cssIdle`, `
		margin: 0;
		font-size: ${krpano.get('arrowTextSettings.textFontSize')};
		text-align: center;
		padding: 0.5em 0.75em 0.52em 0.5em;
		color: #${krpano.get('arrowTextSettings.color')};
	`);	

	krpano.set(`hotspot[${hName}].cssActive`, `
		margin: 0;
		font-size: ${krpano.get('arrowTextSettings.textFontSize')};
		text-align: center;
		padding: 0.5em 0.75em 0.52em 0.5em;
		color: #${krpano.get('arrowTextSettings.colorOver')};
	`);	
}

function setLayoutTitleCss() {


	krpano.set(`layer[layoutTitle].css`, `
		margin: 0;
		font-size: 16px;
		font-weight: 400;
		color: #fff;
		line-height: 24px;
		padding: 0;
		text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
	`);
}

function setVrTitleCss() {

	krpano.set(`hotspot[vrTitle].css`, `
		margin: 0;
		font-size: 16px;
		font-weight: 400;
		color: #fff;
		line-height: 40px;
		padding: 0;
		text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
	`);	
}

function setLayoutThumbTextCss(lName) {
	const thumbText = krpano.get(`layer[${lName}]`);

	thumbText.css = `
		margin: 0;
		font-size: ${krpano.get(`thumbs.textFontSize`)}px;
		font-weight: ${krpano.get(`thumbs.textFontWeight`)};
		padding: ${krpano.get(`textPadding`)};
		text-align: center;
		color: #${krpano.get(`design.color`)};
		border: 1px solid rgba(255, 255, 255, 0.1);
	`;
}

function setPanoClusterTabCSS(lName) {

	krpano.set(`layer[${lName}].css`, `
		margin: 0;
		color: #${krpano.get(`design.color`)};
		font-weight: 400;
		text-align: center;
		font-size: 13px;
		line-height: 12px;
		padding: 1em 1.5em;
		text-shadow: 0.7px 0.7px 0 rgba(0, 0, 0, 0.5);
	`);

	krpano.set(`layer[${lName}].cssNormal`, `
		margin: 0;
		color: #${krpano.get(`design.color`)};
		font-weight: 400;
		text-align: center;
		font-size: 13px;
		line-height: 12px;
		padding: 1em 1.5em;
		text-shadow: 0.7px 0.7px 0 rgba(0, 0, 0, 0.5);
	`);

	krpano.set(`layer[${lName}].cssActive`, `
		margin: 0;
		color: #${krpano.get(`design.bgcolor`)};
		font-weight: 400;
		text-align: center;
		font-size: 13px;
		line-height: 12px;
		padding: 1em 1.5em;
	`);
}

function setAudioGuideTimerCss() {
	krpano.set(`layer[audioGuideTimer].css`, `
		margin: 0;
		font-size: 16px;
		font-weight: 400;
		padding: 0 1em;
		color: #${krpano.get(`design.color`)};
	`);
}

function setInfospotCss(hName) {

	krpano.set(`hotspot[${hName}].css`, `
		margin: 0;
		font-size: 24px;
		line-height: 36px;
		text-align: center;
		color: #${krpano.get(`design.color`)};
	`);
}
/**
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 */
(function (window) {
    {
        var unknown = '-';

        // screen
        var screenSize = '';
        if (screen.width) {
            width = (screen.width) ? screen.width : '';
            height = (screen.height) ? screen.height : '';
            screenSize += '' + width + " x " + height;
        }

        // browser
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browser = navigator.appName;
        var version = '' + parseFloat(navigator.appVersion);
        var majorVersion = parseInt(navigator.appVersion, 10);
        var nameOffset, verOffset, ix;

        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // Edge
        else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }

        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }

        // Samsung Browser
        if (verOffset = nAgt.indexOf('SamsungBrowser') != -1) {
            browser = 'Samsung';
            version = nAgt.substring(verOffset + 1);
        }

        // Oculus Browser
        if (verOffset = nAgt.indexOf('OculusBrowser') != -1) {
            browser = 'Oculus';
            version = nAgt.substring(verOffset + 1);
        }

        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }

        // mobile version
        var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

        // cookie
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
            document.cookie = 'testcookie';
            cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
        }

        // system
        var os = unknown;
        var clientStrings = [
            {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
            {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
            {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
            {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
            {s:'Windows Vista', r:/Windows NT 6.0/},
            {s:'Windows Server 2003', r:/Windows NT 5.2/},
            {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
            {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
            {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
            {s:'Windows 98', r:/(Windows 98|Win98)/},
            {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
            {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
            {s:'Windows CE', r:/Windows CE/},
            {s:'Windows 3.11', r:/Win16/},
            {s:'Android', r:/Android/},
            {s:'Open BSD', r:/OpenBSD/},
            {s:'Sun OS', r:/SunOS/},
            {s:'Linux', r:/(Linux|X11)/},
            {s:'iOS', r:/(iPhone|iPad|iPod)/},
            {s:'Mac OS X', r:/Mac OS X/},
            {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
            {s:'QNX', r:/QNX/},
            {s:'UNIX', r:/UNIX/},
            {s:'BeOS', r:/BeOS/},
            {s:'OS/2', r:/OS\/2/},
            {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
        ];
        for (var id in clientStrings) {
            var cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        var osVersion = unknown;

        if (/Windows/.test(os)) {
            osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        switch (os) {
            case 'Mac OS X':
                osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'Android':
                osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                break;

            case 'iOS':
                osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                break;
        }

        // flash (you'll need to include swfobject)
        /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
        var flashVersion = 'no check';
        if (typeof swfobject != 'undefined') {
            var fv = swfobject.getFlashPlayerVersion();
            if (fv.major > 0) {
                flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
            }
            else  {
                flashVersion = unknown;
            }
        }
    }

    window.jscd = {
        screen: screenSize,
        browser: browser,
        browserVersion: version,
        browserMajorVersion: majorVersion,
        mobile: mobile,
        os: os,
        osVersion: osVersion,
        cookies: cookieEnabled,
        flashVersion: flashVersion
    };
}(this));

