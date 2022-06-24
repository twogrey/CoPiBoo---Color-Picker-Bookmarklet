let cpbt,
	cpbt_autoClosing = sessionStorage.getItem('cpbt_enable_auto_closing') === 'true' ? true : false,
	cpbt_lang = sessionStorage.getItem('cpbt_lang') !== null ? sessionStorage.getItem('cpbt_lang') : 'en',
	cpbt_modal_size = sessionStorage.getItem('cpbt_modal_size') !== null ? sessionStorage.getItem('cpbt_modal_size') : '100',
	cpbt_autoCopying = sessionStorage.getItem('cpbt_enable_auto_copying') !== null ? sessionStorage.getItem('cpbt_enable_auto_copying') : 'no';

// Define custom element
class cpbTwogrey extends HTMLElement {
  constructor() {
	super();
	const shadow = this.attachShadow({mode: 'open'});
	const style = document.createElement('style');
	const cbp_fadeOut_delay = 5000;

	style.textContent = `
		*, ::before, ::after { box-sizing: border-box }

		.sr-only {
			border: 0 !important;
			clip: rect(1px, 1px, 1px, 1px) !important;
			-webkit-clip-path: inset(50%) !important;
			clip-path: inset(50%) !important;
			height: 1px !important;
			margin: -1px !important;
			overflow: hidden !important;
			padding: 0 !important;
			position: absolute !important;
			width: 1px !important;
			white-space: nowrap !important;
		}

		:is(button, summary, input, select):hover { outline: auto }

		button, 
		summary { cursor: pointer }

		a { 
			color: inherit; 
			outline-offset: 0.25em; 
		}

		a:hover { outline: auto  }

		:is([type=radio], [type=checkbox]) { 
			inline-size: 1em; 
			block-size: 1em; 
			margin: 0; 
			font-size: 1em; 
		}

		[type=range] { 
			width: 9em;
			margin: 0;
			font-size: 1em; 
		}

		output {
			font-family: monospace;
		}

		select {
			font: inherit;
		}

		[type=color] {
			inline-size: 100%; 
			block-size: 100%
		}

		svg {
			inline-size: 1.5em; 
			block-size: 1.5em;
			fill: none; 
			stroke: currentColor; 
			stroke-width: 1.5; 
			stroke-linecap:round; 
			stroke-linejoin:round;
		}

		section {
			--btn-s: 2em; 
			--p: 1em; 
			--rad: 0.5em; 
			--offset: 1.5em; 
			--timer-h: 0.25em; 
			box-sizing: border-box; 
			position: fixed; 
			z-index: 9999; 
			display: flex; 
			gap: 0.5em; 
			inset-block-start: var(--offset); 
			inset-inline-end: var(--offset); 
			inline-size: min-content; 
			max-inline-size: calc(100% - var(--offset) * 2); 
			padding-block-start: var(--p); 
			padding-block-end: calc(var(--p) + var(--timer-h)); 
			padding-inline: var(--p); 
			border-radius: 0.5em; 
			font-size: min(calc(1rem * (var(--custom-fs) / 100)), 4.2vw); 
			font-family: system-ui; 
			color: #000; 
			background: linear-gradient(rgb(0 0 0 / 5%),rgb(0 0 0 / 5%)) rgba(var(--color-rgb), 0.25); 
			backdrop-filter: blur(5px); 
			accent-color: var(--color);
			animation: hide 300ms `+cbp_fadeOut_delay+`ms forwards
		}

		section > div {
			max-height: calc(100vh - var(--offset) * 2 - var(--p) * 2);
			overflow-y: auto;
		}

		header {
			position: relative; 
			z-index: 2; 
			box-shadow: 0 .5em .21em -.625em; 
			padding: calc(var(--p) * .5) calc(var(--p) * 0.8); 
			border-radius: var(--rad) var(--rad) 0 0;
			font-size: 1.25em; 
			font-variant-caps: small-caps; 
			font-weight: 700; 
			background-color: var(--color); 
			color: var(--text-color); 
		}

		.timer {
			position: absolute; 
			inset-inline-start: var(--p); 
			inset-block-end: calc(var(--p) / 2); 
			inline-size: calc(100% - var(--p) * 2); 
			block-size: var(--timer-h); 
			background-color: var(--color); 
			animation: timer `+cbp_fadeOut_delay+`ms linear forwards; 
			transform-origin: left center; 
			transform: scaleX(0);
		}

		[dir="rtl"] .timer {
			transform-origin: right center; 
		}

		.close {
			--tx: 50%;
			position: absolute; 
			inset-block-start: 0; 
			inset-inline-end: 0; 
			display: flex; 
			padding: 0.5em;
			border: 0; 
			border-radius: 50%;
			font-size: 1em;
			background-color: var(--color); 
			color: var(--text-color); 
			transform: translate(var(--tx), -50%); 
		}

		[dir="rtl"] .close {
			--tx: -50%;
		}

		.content {
			padding: var(--p); 
			background-color: #fff
		}

		.main {
			--gap: calc(var(--p) / 2); 
			display: grid; 
			gap: var(--gap); 
			font-family: monospace
		}

		.main__left {
			grid-row: 1 / 3; 
			display: flex;
			inline-size: calc(var(--btn-s) * 2 + var(--gap)); 
		}

		.main__right {
			--gap: calc(var(--p) / 2); 
			grid-column-start: 2; 
			display: flex; 
			gap: var(--gap); 
			align-items: center; 
			padding-inline-end: var(--gap); 
			border-radius: 0.25em; 
			background-color: rgba(var(--color-rgb), 0.25);
		}

		.copy { 
			order: -1; 
			display: flex; 
			align-items: center; 
			justify-content: center; 
			inline-size: var(--btn-s); 
			block-size: var(--btn-s); 
			border-radius: inherit; 
			border: 0; 
			font-size: 1em; 
			background-color: var(--color); 
			color: var(--text-color); 
			outline-offset: -0.1875em; 
		}

		details { padding-block-start: var(--p) }

		summary {
			font-variant-caps: small-caps; 
			font-weight: 500;
		}

		summary::marker { content: "⚙️ " }

		details > div {
			--details_btw: 0.15em; 
			position: relative; 
			display: grid;
			gap: calc(var(--p) * 0.75);
			flex-direction: column;
			padding: var(--p); 
			border-block-start: var(--details_btw) solid var(--color); 
			margin-block-start: var(--p); 
			font-size: 0.875em; 
			background-color: rgba(var(--color-rgb), 0.1)
		}

		details > div::before { 
			content: ""; 
			position: absolute; 
			inset-inline-start: 3.5em; 
			inset-block-end: calc(100% + var(--details_btw) - 1px); 
			inline-size: 1em; 
			block-size: 1em; 
			clip-path: polygon(0 100%, 50% 50%, 100% 100%); 
			background-color: var(--color); 
			pointer-events: none 
		}

		details .instructions {
			margin: 0; 
			font-size: 0.875em
		}

		.form-group { 
			display: flex; 
			align-items: center; 
			gap: 0.4em;
		}

		.form-group--wrap { 
			flex-wrap: wrap;
		}

		.form-group :is(input, select) { 
			flex: 0 0 auto 
		}

		fieldset {
			border: 0.0625rem solid var(--color); 
			margin: 0;
		}

		fieldset legend {
			padding: 0 0.5em;
			font-weight: 500;
		}

		fieldset > div { 
			padding: calc(var(--p) / 4) calc(var(--p) / 2); 
		}

		.range-output {
			display: flex;
			align-items: center;
			gap: inherit;
			width: 100%;	
		}

		.footer {
			margin: 0;
			text-align: end;
			font-size: 0.875em;
		}
		
		@keyframes timer { to { transform: scaleX(1) } }
		@keyframes hide { to { transform: translateY(-50%); opacity: 0 } }
	`;

	shadow.appendChild(style);

	shadow.innerHTML += `
		<section aria-labelledby="title"> 
			<span tabindex="-1" class="hex-sr sr-only"></span>
			<div>
				<header id="title" data-i18n data-i18n-en="Color picker" data-i18n-fr="Sélecteur de couleur" data-i18n-ar="أداة انتقاء اللون"></header>
				<button type="button" class="close" title="Close" data-i18n data-i18n-en="Close" data-i18n-fr="Fermer" data-i18n-ar="أغلق">
					<svg viewBox="0 0 24 24">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<div class="content">
					<div class="main">
						<div class="main__left">
							<input type="color" aria-label="Pick another color" data-i18n data-i18n-en="Pick another color" data-i18n-fr="Choisir une autre couleur" data-i18n-ar="اختر لونًا آخر">
						</div>
						<div class="main__right">
							<span class="hex"></span>
							<button type="button" class="copy" data-copy-target=".hex" title="Copy hex code to clipboard" data-i18n data-i18n-en="Copy hex code to clipboard" data-i18n-fr="Copier le code hexadécimal dans le presse-papiers" data-i18n-ar="انسخ الكود السداسي عشرية إلى الحافظة">
								<svg viewBox="0 0 24 24">
									<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
									<rect x="8" y="8" width="12" height="12" rx="2" />
									<path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
								</svg>
							</button>
						</div>
						<div class="main__right">
							<span class="rgb" style="width: 16ch"></span>
							<button type="button" class="copy" data-copy-target=".rgb" title="Copy RGB to clipboard" data-i18n data-i18n-en="Copy RGB to clipboard" data-i18n-fr="Copier le code RGB dans le presse-papiers" data-i18n-ar="انسخ RGB إلى الحافظة">
								<svg viewBox="0 0 24 24" >
									<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
									<rect x="8" y="8" width="12" height="12" rx="2" />
									<path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
								</svg>
							</button>
						</div>
					</div>
					<details>
						<summary data-i18n data-i18n-en="Options" data-i18n-fr="Options" data-i18n-ar="والخيارات"></summary>
						<div>  
							<div class="form-group"> 
								<label for="choose-lang" data-i18n data-i18n-en="Language" data-i18n-fr="Langue" data-i18n-ar="لغة"></label>
								<select id="choose-lang" name="cpbt_lang">
									<option value="en" lang="en" data-i18n data-i18n-en="English" data-i18n-fr="English (Anglais)" data-i18n-ar="English (الإنجليزية)">English</option>
									<option value="fr" lang="fr" data-i18n data-i18n-en="Français (French)" data-i18n-fr="Français" data-i18n-ar="Français (الفرنسية)">Français (French)</option>
									<option value="ar" lang="ar" data-i18n data-i18n-en="العربية (Arabic)" data-i18n-fr="العربية (Arabe)" data-i18n-ar="العربية">العربية (Arabic)</option>
								</select>
						  	</div>
							<form class="form-group form-group--wrap" oninput="cpbt_modal_size_result.value=parseInt(cpbt_modal_size.value)+'%'">
								<label for="set-modal-size" data-i18n data-i18n-en="Modal size" data-i18n-fr="Taille de la modale" data-i18n-ar="حجم مشروط"></label>
								<div class="range-output">
									<input type="range" id="set-modal-size" name="cpbt_modal_size" value="100" min="50" max="200">
									<output name="cpbt_modal_size_result">100%</output>
								</div>
						  	</form>
						  	<p class="instructions" data-i18n data-i18n-en="Modifications below will be applied on the next use of the bookmarklet." data-i18n-fr="Les modifications ci-après seront appliquées à la prochain exécution du bookmarklet." data-i18n-ar="سيتم تطبيق التعديلات أدناه على الاستخدام التالي للعلامة المرجعية."></p>
							<div class="form-group"> 
								<input type="checkbox" name="cpbt_enable_auto_closing" id="enable_auto_closing">
								<label for="enable_auto_closing" data-i18n data-i18n-en="Enable auto-closing" data-i18n-fr="Activer la fermeture automatique" data-i18n-ar="قم بتمكين الإغلاق التلقائي"></label>
							</div>
							<fieldset>
								<legend data-i18n data-i18n-en="Auto-copying" data-i18n-fr="Copie automatique" data-i18n-ar="النسخ التلقائي"></legend>
								<div class="form-group"> 
									<input type="radio" name="cpbt_enable_auto_copying" id="enable_auto_copying_no" value="no" checked>
									<label for="enable_auto_copying_no" data-i18n data-i18n-en="Disabled" data-i18n-fr="Désactivé" data-i18n-ar="عاجز"></label>
								</div>
								<div class="form-group"> 
									<input type="radio" name="cpbt_enable_auto_copying" id="enable_auto_copying_hex" value="hex">
									<label for="enable_auto_copying_hex" data-i18n data-i18n-en="Enable Hex auto-copying" data-i18n-fr="Copier le code hexa" data-i18n-ar="تفعيل النسخ التلقائي لـ Hex"></label>
								</div>
								<div class="form-group"> 
									<input type="radio" name="cpbt_enable_auto_copying" id="enable_auto_copying_rgb" value="rgb">
									<label for="enable_auto_copying_rgb" data-i18n data-i18n-en="Enable RGB auto-copying" data-i18n-fr="Copier le code RGB" data-i18n-ar="قم بتمكين النسخ التلقائي لـ RGB"></label>
								</div>
							</fieldset>
							<p class="footer">
								<a href="#" target="_blank" data-i18n data-i18n-en="Source code" data-i18n-fr="Code source" data-i18n-ar="مصدر الرمز"></a> <span aria-hidden="true">·</span> <a href="https://ko-fi.com/twogrey" target="_blank" data-i18n data-i18n-en="Support" data-i18n-fr="Soutenir" data-i18n-ar="دعم "></a> ☕
							</p>
						</div>
					</detail>
				</div>
		  	</div>
  			<span class="timer"></span>
  		</section>
  	`;
  }
}

// from https://awik.io/determine-color-bright-dark-using-javascript/
// Determine if picked color is rather light or dark shade
function cpbt_lightOrDark(color) {

	// Variables for red, green, blue values
	var r, g, b, hsp;
	
	// Check the format of the color, HEX or RGB?
	if (color.match(/^rgb/)) {

		// If RGB --> store the red, green, blue values in separate variables
		color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
		
		r = color[1];
		g = color[2];
		b = color[3];
	} 
	else {
		
		// If hex --> Convert it to RGB: http://gist.github.com/983661
		color = +("0x" + color.slice(1).replace( 
		color.length < 5 && /./g, '$&$&'));

		r = color >> 16;
		g = color >> 8 & 255;
		b = color & 255;
	}
	
	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	hsp = Math.sqrt(
	0.299 * (r * r) +
	0.587 * (g * g) +
	0.114 * (b * b)
	);

	// Using the HSP value, determine whether the color is light or dark
	if (hsp>127.5) {

		return 'light';
	} 
	else {

		return 'dark';
	}
}

// from https://convertingcolors.com/blog/article/convert_hex_to_rgb_with_javascript.html
// Convert from hexa to rgb
function cpbt_hexToRGB(h, wo_fn) {
	var aRgbHex = h.replace('#','').match(/.{1,2}/g);
	var aRgb = [
		parseInt(aRgbHex[0], 16),
		parseInt(aRgbHex[1], 16),
		parseInt(aRgbHex[2], 16)
	];
	if(wo_fn)
		return aRgb;
	else 
		return 'rgb('+aRgb+')';
}

// Remove custom element
function cpbt_removeContainer() {
	document.querySelector('cpb-twogrey').parentNode.removeChild(document.querySelector('cpb-twogrey'));
}

// Set lang & dir
function cpbt_i18n(lang) {
	cpbt.querySelectorAll('[data-i18n]').forEach(function(elmt) {
		let text = elmt.getAttribute('data-i18n-'+lang);
		if(elmt.getAttribute('title'))
			elmt.setAttribute('title', text);
		else if(elmt.getAttribute('aria-label'))
			elmt.setAttribute('aria-label', text);
		else
			elmt.textContent = text;
	});
	cpbt.querySelector('section').setAttribute('lang', lang);
	if(lang == 'ar')
		cpbt.querySelector('section').setAttribute('dir', 'rtl');
	else
		cpbt.querySelector('section').removeAttribute('dir');
}

// Set size
function cpbt_updateSize(size) {
	cpbt.querySelector('section').style.setProperty('--custom-fs', size);
}

// Set picked color & some others values & text
function cpbt_set(colorHex) {
	cpbt.querySelector('.hex').textContent = colorHex;
	cpbt.querySelector('.hex-sr').textContent = colorHex;
	cpbt.querySelector('.rgb').textContent = cpbt_hexToRGB(colorHex);
	cpbt.querySelector('section').style.setProperty("--text-color",cpbt_lightOrDark(colorHex) === 'dark' ? '#fff' : '#000');
	cpbt.querySelector('section').style.setProperty("--color", colorHex);
	cpbt.querySelector('section').style.setProperty("--color-rgb", cpbt_hexToRGB(colorHex, true));
}

// Freeze current animations (for the "5s before fade out" option)
function cpbt_pauseAnimations() {
	cpbt.querySelector('section').style.animationPlayState = 'paused';
	cpbt.querySelector('.timer').style.animationPlayState = 'paused';
}

// Resume current animations (for the "5s before fade out" option)
function cpbt_runAnimations() {
	cpbt.querySelector('section').style.animationPlayState = 'running';
	cpbt.querySelector('.timer').style.animationPlayState = 'running';
}


if (!window.EyeDropper) {
  alert('Your browser does not support the EyeDropper API');
} else {
  const eyeDropper = new EyeDropper();
  eyeDropper.open().then(result => {

	// Remove previous modal
	if(document.querySelector('cpb-twogrey'))
		cpbt_removeContainer();

	// Build modal
	document.body.innerHTML += '<cpb-twogrey></cpb-twogrey>';
	if(customElements.get('cpb-twogrey') === undefined) {
		customElements.define('cpb-twogrey', cpbTwogrey);
	}
	cpbt = document.querySelector('cpb-twogrey').shadowRoot;
	cpbt_updateSize(cpbt_modal_size);
	cpbt_i18n(cpbt_lang);
	cpbt.querySelector('.hex-sr').focus();

	// If auto-closing is disabled, hide timer element
	if(!cpbt_autoClosing) {
		cpbt.querySelector('.timer').style.display = 'none';
		cpbt.querySelector('section').style.setProperty('--timer-h', '0px');
		cpbt.querySelector('section').style.animation = 'none';
	}

	// Show color & values
	cpbt.querySelector('[type=color]').value = result.sRGBHex;
	cpbt_set(result.sRGBHex);

	// If auto-closing is enabled, remove modal after the fade out animation 
	cpbt.querySelector('section').addEventListener('animationend', function(e) {
		if(e.target !== this) return;
		cpbt_removeContainer();
	});

	// Pause the "5s before fade out" while hovering or focusing
	if(cpbt_autoClosing) {
		cpbt.querySelector('section').addEventListener('mouseenter', cpbt_pauseAnimations);
		cpbt.querySelector('section').addEventListener('focusin', cpbt_pauseAnimations);
		cpbt.querySelector('section').addEventListener('mouseleave', cpbt_runAnimations);
		cpbt.querySelector('section').addEventListener('focusout', cpbt_runAnimations);
	}

	// Close the modal manually
	cpbt.querySelector('.close').addEventListener('click', cpbt_removeContainer);

	// Fill options with session storage values
	cpbt.querySelector('#choose-lang').value = cpbt_lang;
	cpbt.querySelector('#set-modal-size').value = cpbt_modal_size;
	cpbt.querySelector('[name="cpbt_modal_size_result"]').textContent = cpbt_modal_size + '%';
	cpbt.querySelector('#enable_auto_closing').checked = cpbt_autoClosing;
	cpbt.querySelector('[name="cpbt_enable_auto_copying"][value="'+cpbt_autoCopying+'"]').checked = true;

	// Set session storages values depending on user preferences
	cpbt.querySelectorAll('details :is(input, select)').forEach(function(input) {
		input.addEventListener('change', function(e) {
			if(e.target.type == 'radio' || e.target.type == 'select-one' || e.target.type == 'range') {
				sessionStorage.setItem(this.getAttribute('name'), this.value);
			} else if(e.target.type == 'checkbox') {
				sessionStorage.setItem(this.getAttribute('name'), this.checked);
			}
		});
	});

	// Update lang
	cpbt.querySelector('#choose-lang').addEventListener('change', function() {
		cpbt_i18n(this.value);
	});

	// Update size
	cpbt.querySelector('#set-modal-size').addEventListener('change', function() {
		cpbt_updateSize(this.value);
	});

	// Copy Hex or RGB color to clipboard
	if(cpbt_autoCopying == 'hex') {
		navigator.clipboard.writeText(result.sRGBHex);
	} else if(cpbt_autoCopying == 'rgb') {
		navigator.clipboard.writeText(cpbt_hexToRGB(result.sRGBHex));
	}

	// Manual copy
	cpbt.querySelectorAll('.copy').forEach(function(btn) {
		btn.addEventListener('click', function() {
			navigator.clipboard.writeText(cpbt.querySelector(this.getAttribute('data-copy-target')).textContent);
		});
	});

	// Update modal text if a new color is picked by using input[type=color]
	cpbt.querySelector('[type=color]').addEventListener('input', function() {
		cpbt_set(this.value);
	});

  }).catch(error => {
	alert(error);
  });
}

/***
	Icons are from https://tablericons.com/
***/