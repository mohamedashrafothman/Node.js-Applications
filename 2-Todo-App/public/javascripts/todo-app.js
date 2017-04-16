$(document).ready(function(){

	$('form').on('submit', function(){
		var item = $('form input').val();
		var todo = [{item: item}];
		// alert(todo[0].item);
		
		$.ajax({
			method:'POST',
			url: '/',
			data: todo[0],
			success: function(){
				 location.reload();
			}
		});
		return false;
	});

	$('.list-item').on('click', function(){
		var item = $(this).text().replace(/ /g, '-');
		$.ajax({
			method: 'DELETE',
			url: '/'+item,
			success: function(data){
				location.reload();
			}
		});
	});

});