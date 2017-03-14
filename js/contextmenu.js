$(function()
{
		$note_detail.on('contextmenu',function(e)
	            {
	            	e.preventDefault();
	            	$detail_menu.css({'left':e.pageX+5,'top':e.pageY+5}).show();
	            }).on('click',function()
	            {
	            	$detail_menu.hide();
	            });
	            $detail_menu.on('click', function(e) {
	            	e.stopPropagation();
	            }).children('li').hover(function()
	            {
	            	$(this).find('.level2').show();
	            },function()
	            {
	            	$(this).find('.level2').hide();
	            });

	            $('#fontsize li').click(function()
	            	{
	            		//$note_detail.css('font-size',$(this).data('color'));
	            		alert('/');
	            	});
	            console.log($('#fontsize li'));
})