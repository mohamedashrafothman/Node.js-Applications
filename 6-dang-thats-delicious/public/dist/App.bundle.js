const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function(elem) {
    elem.on(name, fn);
  });
};

function autocomplete(input, latInput, lngInput){
	if(!input) return; // skip this fn from running
	const dropdown = new google.maps.places.Autocomplete(input);

	dropdown.addListener('place_changed', ()=> {
		const place = dropdown.getPlace();
		lngInput.value = place.geometry.location.lng();
		latInput.value = place.geometry.location.lat();
	});

	// if someone hits enter on address field
	input.on('keydown', (e)=> {
		if(e.keyCode === 13) e.preventDefault();
	});
};
autocomplete($('#address'), $('#lat'), $('#lng'));