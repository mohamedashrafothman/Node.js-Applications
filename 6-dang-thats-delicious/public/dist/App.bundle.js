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
}
autocomplete($('#address'), $('#lat'), $('#lng'));

function searchResultsHTML(stores) {
	return stores.map((store)=> {
		return `
			<a href="/store/${store.slug}" class="search__result"> 
				<strong>${store.name}</strong>
			</a>
		`;
	}).join('');
}

function typeAhead(search){
	if(!search) return;

	const searchInput = search.querySelector('input[name="search"]');
	const searchResult = search.querySelector('.search__results');

	searchInput.on('input', function(){
		if(!this.value){
			searchResult.style.display = 'none';
			return; // stop
		}
		searchResult.style.display = 'block';
		searchResult.innerHTML = '';

		axios
			.get(`/api/search?q=${this.value}`)
			.then((res)=> {
				if(res.data.length){
					console.log('there is something to show');
					searchResult.innerHTML = searchResultsHTML(res.data);
					return;
				}
				// tell them nothing came back
				searchResult.innerHTML = `<div class='search__result'>No results for ${this.value} found!</div>`;
			}).catch((err)=> {
				console.log(err);
			});
	});

	searchInput.on('keyup', (e)=> {
		if(![38, 40, 13].includes(e.keyCode)){
			return; // skip it 
		}

		const activeClass = 'search__result--active';
		const current = search.querySelector(`.${activeClass}`);
		const items = search.querySelectorAll('.search__result');
		let next;

		if(e.keyCode === 40 && current){
			next = current.nextElementSibling || items[0];
		} else if(e.keyCode === 40){
			next = items[0];
		} else if(e.keyCode === 38 && current) {
			next = current.previousElementSibling || items[items.length - 1];
		} else if(e.keyCode === 38){
			next = items[items.length - 1];
		} else if(e.keyCode === 13 && current.href){
			window.location = current.href;
			return ;
		}


		if(current){
			current.classList.remove(activeClass);
		}
		next.classList.add(activeClass);
	});
}

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);

function ajaxHeart(e){
	e.preventDefault();
	axios
		.post(this.action)
		.then((res)=> {
			const isHearted = this.heart.classList.toggle('heart__button--hearted');
			$('.heart-count').textContent = res.data.hearts.length;
			if(isHearted){
				this.heart.classList.add('heart__button--float');
				setTimeout(()=> this.heart.classList.remove('heart__button--float'), 25000);
			}
		})
		.catch(console.error);
}


typeAhead($('.search'));
