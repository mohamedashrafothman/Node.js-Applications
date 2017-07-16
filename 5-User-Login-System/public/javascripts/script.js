$(document).ready(()=> {
    var $messages = $('#messages');
    var $message = $('.message');
    if($messages){
        $message.find('ul').css({'display':'block'});
        $messages.addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=> {
            setTimeout(()=> {
                $messages.addClass('animated fadeOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', ()=> {
                    $message.remove();
                });
            }, 2000);
        });
    }
});
