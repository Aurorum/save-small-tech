let mpObject;
let userId = localStorage.getItem( 'userID' ) || Math.floor( Math.random() * 9999999 ) + 1;

window.onload = function () {
	if ( ! localStorage.getItem( 'userID' ) ) {
		localStorage.setItem( 'userID', userId );
	}

	subTaglineAnimation();

	setInterval( function () {
		changeSubTagline();
	}, 4500 );

	document.getElementById( 'mp-form' ).addEventListener( 'keyup', function ( event ) {
		if (
			event.keyCode === 13 &&
			! document.getElementById( 'mp-form' ).classList.contains( 'not-first-page' )
		) {
			event.preventDefault();
			editMPMessage();
		}
	} );

	collectData( 'Loaded site with data ' + navigator.userAgent + ' at ' + new Date() );
};

window.onclick = function ( event ) {
	if ( event.target === document.getElementById( 'modal' ) ) {
		toggleDialog( false );
	}
};

function subTaglineAnimation() {
	let textWrapper = document.querySelector( '.sub-tagline .letters' );
	textWrapper.innerHTML = textWrapper.textContent.replace(
		/([^\x00-\x80]|\w)/g,
		"<span class='letter'>$&</span>"
	);
	anime
		.timeline( { loop: false } )
		.add( {
			targets: '.ml11 .line',
			scaleY: [ 0, 1 ],
			opacity: [ 0.5, 1 ],
			easing: 'easeOutExpo',
			duration: 700,
		} )
		.add( {
			targets: '.ml11 .line',
			translateX: [
				0,
				document.querySelector( '.ml11 .letters' ).getBoundingClientRect().width + 10,
			],
			easing: 'easeOutExpo',
			duration: 700,
			delay: 100,
		} )
		.add( {
			targets: '.ml11 .letter',
			opacity: [ 0, 1 ],
			easing: 'easeOutExpo',
			duration: 600,
			offset: '-=775',
			delay: ( el, i ) => 34 * ( i + 1 ),
		} )
		.add( {
			targets: '.ml11',
			opacity: 1,
			duration: 1000,
			easing: 'easeOutExpo',
			delay: 1000,
		} );
}

function changeSubTagline() {
	let options = [
		'Your online chess game',
		'Your online book forum',
		'Your online Maths quiz',
		'Your online language tool',
		'Your online recipe site',
		'Your online crowdfunder',
		'Your online political campaign',
		'Your online science project',
		'Your online movie blog',
		'Your online cake tutorial',
	];

	document.getElementById( 'subtagline' ).innerHTML =
		options[ Math.floor( Math.random() * options.length ) ];
	subTaglineAnimation();
}

function editMPMessage() {
	let fields = [ 'fname', 'lname', 'email', 'postcode' ];

	let allFieldsFilled = true;
	fields.forEach( ( field ) => {
		let item = document.getElementById( field );

		document.getElementById( item.id + '-required' ).style.display = 'none';

		if ( ! item.value ) {
			document.getElementById( item.id + '-required' ).style.display = 'block';
			allFieldsFilled = false;
		}
	} );

	if ( ! allFieldsFilled ) {
		return;
	}

	var re = /\S+@\S+\.\S+/;
	if ( ! re.test( document.getElementById( 'email' ).value ) ) {
		document.getElementById( 'email-required' ).innerHTML = 'Invalid email.';
		return ( document.getElementById( 'email-required' ).style.display = 'block' );
	}

	document.getElementById( 'email-required' ).innerHTML = 'This field is required.';
	document.getElementById( 'email-required' ).style.display = 'none';
	document.getElementById( 'mpspinner' ).style.display = 'block';

	queryFormData();
}

function queryFormData() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if ( this.readyState == 4 && this.status == 200 ) {
			let response = JSON.parse( this.response );
			document.getElementById( 'mpspinner' ).style.display = 'none';
			console.log( response );

			if ( parseInt( response ) === 404 ) {
				document.getElementById( 'postcode-required' ).innerHTML = 'Invalid postcode.';
				collectData( 'Invalid postcode' );
				return ( document.getElementById( 'postcode-required' ).style.display = 'block' );
			}

			if ( ! response.email || ! response.name ) {
				document.getElementById( 'postcode-required' ).innerHTML = 'There was an error.';
				collectData( 'Unknown error' );
				return ( document.getElementById( 'postcode-required' ).style.display = 'block' );
			}

			mpObject = response;

			collectData( 'Successfully returned ' + response.name );
			document.getElementById( 'postcode-required' ).innerHTML = 'This field is required.';
			document.getElementById( 'postcode-required' ).style.display = 'none';
			document.getElementById( 'mpname' ).innerHTML = response.name;
			document.getElementById( 'username' ).innerHTML =
				document.getElementById( 'fname' ).value.trim() +
				' ' +
				document.getElementById( 'lname' ).value.trim();
			document.getElementById( 'userpostcode' ).innerHTML = document
				.getElementById( 'postcode' )
				.value.trim();
			document.getElementById( 'formpage1' ).style.display = 'none';
			document.getElementById( 'formpage2' ).style.display = 'block';
			document.getElementById( 'mpformtitle' ).style.display = 'none';
			document.getElementById( 'progress1' ).classList.remove( 'fill-progress' );
			document.getElementById( 'progress2' ).classList.add( 'fill-progress' );
			document.getElementById( 'mp-form' ).classList.add( 'not-first-page' );
			document.getElementById( 'mpsendbutton' ).innerHTML = 'Send message';
			document.getElementById( 'mpsendbutton' ).onclick = function () {
				submitMessage();
			};
		}
	};

	xhttp.open(
		'GET',
		'https://clubpenguinmountains.com/wp-json/parliament/data?postcode=' +
			document.getElementById( 'postcode' ).value,
		true
	);
	xhttp.send();
}

function submitMessage() {
	document.getElementById( 'mpspinner' ).style.display = 'block';
	document.getElementById( 'mpspinner' ).classList.add( 'is-final' );

	var request = new XMLHttpRequest();

	request.onreadystatechange = function () {
		if ( this.readyState == 4 && this.status == 200 ) {
			let response = this.response.toString();
			document.getElementById( 'mpspinner' ).style.display = 'none';
			console.log( response );

			if ( response === '"success"' ) {
				document.getElementById( 'formpage2' ).style.display = 'none';
				document.getElementById( 'mpsendbutton' ).style.display = 'none';
				document.getElementById( 'formpage3' ).style.display = 'block';
				document.getElementById( 'progress2' ).classList.remove( 'fill-progress' );
				document.getElementById( 'progress3' ).classList.add( 'fill-progress' );
				collectData( 'Message successfully submitted' );
			}
		}
	};

	request.open( 'POST', 'https://clubpenguinmountains.com/wp-json/parliament/send' );

	request.setRequestHeader( 'Content-type', 'text/plain' );

	var obj = new Object();
	obj.name =
		document.getElementById( 'fname' ).value.trim() +
		' ' +
		document.getElementById( 'lname' ).value.trim();
	obj.nameCaps =
		document.getElementById( 'fname' ).value.trim().toUpperCase() +
		' ' +
		document.getElementById( 'lname' ).value.trim().toUpperCase();
	obj.userEmail = document.getElementById( 'email' ).value.trim();
	obj.postcode = document.getElementById( 'postcode' ).value.trim();
	obj.mpName = mpObject.name;
	obj.mpEmail = mpObject.email;
	obj.mpConstituency = mpObject.constituency;

	var jsonString = JSON.stringify( obj );

	var params =
		'~~~' + jsonString + '^^^' + document.getElementById( 'message' ).value.trim() + '@@@';

	console.log( params );
	request.send( params );
}

function collectData( content ) {
	var request = new XMLHttpRequest();
	request.open( 'POST', 'https://clubpenguinmountains.com/wp-json/save-small-tech/data' );
	request.setRequestHeader( 'Content-type', 'text/plain' );
	request.send( content + ' with ID of ' + userId );
}

function jsonEscape( str ) {
	return str.replace( /\n/g, '\\\\n' ).replace( /\r/g, '\\\\r' ).replace( /\t/g, '\\\\t' ).trim();
}

function toggleDialog( display ) {
	if ( display ) {
		document.getElementById( 'modal' ).style.display = 'block';
		collectData( 'Dialog displayed' );
		return;
	}
	collectData( 'Dialog hidden' );
	document.getElementById( 'modal' ).style.display = 'none';
}
