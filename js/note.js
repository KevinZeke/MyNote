;(function()
	{
		'use strict';

		var note_list=[],                     //用来存放每一篇笔记对象的数组
		    note_item,                        //包含笔记信息的对象
		    note_items,                       //包含页面上的文章列表
		    star=[],                          //星标数组,添加收藏
		    innerScroll,                      //实现textarea输出的内容实现换行的正则。
		    renderStar=false,                 //判断是否按收藏刷新页面
		    oHeight,
		    oDate,
		    re=/\n+/g,
		    $ball=$('.ball'),
		    $add_note=$('.add-note'),
		    add_move=$('.add-move')[0],
		    $note_list_area=$('.note-list'),
		    $note_detail=$('.note-detail'),
		    $new_note,
		    $delete_button,
		    $detail_button,
		    $star_button,
		    $mask=$('.mask');                  //遮罩
        
        //初始化页面。
		init();

		//给新建页添加拖拽
		new Drag($add_note[0],add_move,true,true);
		function init()
		{
			//store.clear();
			note_list=store.get('note_list')||[];
			if(note_list.length)
			render_note_list();
		}

            /*控制任务球展开,以及拖动*/
            new Drag($ball[0],$ball[0],true,true);

            $ball.hover(function() {
            	$(this).stop().animate({'width':200}, 400);
            }, function() {
            	$(this).stop().animate({'width':60}, 400);
            }).find('.ball-add').on('click', function(event) {
            	toggle_add_note();
            }).end().find('.ball-star').on('click',function()
            {
            	this.innerHTML=renderStar?'只看收藏':'查看全部';
            	renderStar=renderStar?false:true;
            	var lists=note_list.length;
            	for(var i=0;i<lists;i++)
            	{
            		if(!note_list[i].star)
            		{
            			$('.note-item').eq(lists-i-1).toggle();
            		}
            	}
            });

            //控制遮罩和新建笔记页面
            function toggle_add_note()
            {
            	$add_note.css('left',($(window).width()-800)/2).toggle('fast');
            	$mask.toggle();
            }

        /*新建笔记页面*/
		$add_note.on('submit',function(e)
		{
			e.preventDefault();
			note_item={};
			oDate=new Date();
			var $this=$(this);
		    var $input=$this.find('input');
		    var $textarea=$this.find('textarea');
			note_item.title=$input.val();
			note_item.content=$textarea.val();
			note_item.time=(oDate.getMonth()+1)+"月"+oDate.getDate()+"日 "
			+oDate.getHours()+"时"+oDate.getMinutes()+"分";
			note_item.star=false;
			console.log(note_item);
			if(add_note_list(note_item))
				{
					toggle_add_note();
					$input.val('');
					$textarea.val('');
					/*完成一个动画添加效果*/
					$new_note=$('.note-item:eq(0)');
					oHeight=$new_note[0].offsetHeight;
					$new_note.css({"height":0,"opacity":0})
				    .animate({"height":oHeight}, 400).animate({"opacity":1}, 500);
				};

		}).find('.note-delete').on('click',function()
		{
			toggle_add_note();
		});

		//更新数组
        function add_note_list(data)
        {
        	note_list.push(data);
        	update_note_list(true);
        	var item=create_new_note(data,(note_list.length-1));
        	item.prependTo('.note-list');
        	listen_all();
        	return true;
        }

        //上传新数组并且刷新页面
        function update_note_list(noRefreash)
        {
        	store.set('note_list',note_list);
        	noRefreash || render_note_list();
        }

		//根据文章数组数据刷新文章
		function render_note_list()
		{
			if(renderStar)return;
			$note_list_area.html('');
			star=[];
			for(var i=0;i<note_list.length;i++)
			{
				if(note_list[i].star)
				{
					star.push(note_list[i]);
				}
				var item=create_new_note(note_list[i],i);
				item.prependTo('.note-list');
			}
			listen_all();
		}

		// function render_note_list()
		// {
		// 	$note_list_area.html('');
		// 	star=[];
		// 	var tmp=[];
		// 	for(var i=0;i<note_list.length;i++)
		// 	{
		// 		if(note_list[i].star)
		// 		{
		// 			star.push(note_list[i]);
		// 		}
		// 	};
		// 	tmp=renderStar?star:note_list;
		// 	for(var i=0;i<tmp.length;i++)
		// 	{
		// 		var item=create_new_note(tmp[i],i);
		// 		item.prependTo('.note-list');
		// 	};
		// 	listen_all();
		// }

		//事件监听集中
		function listen_all()
		{
			note_items=$('.note-item');
			$delete_button=$('.note-list .note-delete');
			$detail_button=$('.note-list .note-edit');
			$star_button=$('.note-list .star');
			listen_delete();
			listen_detail();
			listen_star();
			note_items.on('dblclick',function()
			{
				var index=note_list.length-$(this).data('index')-1;
				$detail_button.eq(index).trigger('click');
			});
		}

		//创建一个新文章页
		function create_new_note(data,i)
		{
			var tmp=data.content.replace(re,'<br>');
			var Note='<div class="note-item" data-index='+i+'>'+
		   '<div class="star">'+
				'<img src="img/star' + (data.star?'ed':'') + '.png" alt="star">'+
			'</div>'+
			'<div class="avatar">'+
				'<img src="img/head.jpg" alt="head">'+'猩猩队长'+
			'</div>'+
			'<div class="note-content">'+
			   ' <span class="note-content-title">'+data.title+'</span>'+
			    '<span class="content-preview">'+tmp+'</span>'+
			'</div><div class="time">'+
				data.time+
			'</div>'+
			'<div class="note-delete">'+
				'<img src="img/delete.png" alt="delete">'+
			'</div><div class="note-edit">'+
				'<img src="img/edit-2.png" alt="edit">'+
		  '</div></div>'
		  return $(Note);
		}

        //删除按钮的事件
		function listen_delete()
		{
			$delete_button.on('click',function()
			{
				var $this=$(this);
				var $index=$(this).parent().data('index');
				$this.parent().animate({"opacity":0}, 300).animate({'height':0}, 72,function()
				{
					delete_note_list($index);
					$(this).remove();
					listen_all();
				})
			})
		}

		//删除数组元素并更新页面
		function delete_note_list(index)
		{
			if(index===undefined || !note_list[index])
				return;
			note_list.splice(index,1);
			update_note_list(true);
		}

		//详情按钮
		function listen_detail()
		{
			$detail_button.on('click',function()
			{
				create_detail($(this).parent().data('index'));
				show_detail();
				scroll_judgement();
			})
		}

		//收藏星标事件
		function listen_star()
		{
			$star_button.on('click',function()
			{
				var data={};
				var $index=$(this).parent().data('index');
				data.star=note_list[$index].star?false:true;
				change_note_list($index,data);
			})
		}

		//判断滚动条是否该出现
		function scroll_judgement()
		{
			if($('.inner-content')[0].offsetHeight<$(".detail-content")[0].offsetHeight)
	    		$(".scroll").hide();
		}

		//更新详情页
		function create_detail(index)
		{
			var item=note_list[index];
			var item_title=item.title;
			var item_content=item.content;
			var item_time=item.time;
			var tpl='<form>'+
			'<div class="note-delete">'+
				'<img src="img/delete-2.png" alt="delete">'+
			'</div>'+
			'<div class="star">'+
				'<img src="img/star' + (item.star?'ed':'') + '.png" alt="star">'+
			'</div>'+
			'<div class="note-edit">'+
				'<img src="img/change.png" alt="delete">'+
			'</div>'+
	    	'<header class="detail-title">'+item_title+'</header>'+
	    	'<div class="title-edit"><input type="text" value="'+item_title+'"></div>'+
	    	'<div class="detail-time">更新于 '+item_time+'</div>'+
	    	'<div class="detail-content">'+
	    		'<div class="inner-content">'+item_content.replace(re,'<br>')+'</div>'+
	    		'<div class="scroll"><div class="inner-scroll" id="test"></div></div>'+
	    	'</div>'+
	    	'<div class="content-edit"><textarea>'+item_content+'</textarea></div>'+
	    	'<button type="submit">提交</button>'+
	    	'<form>';

	    	$note_detail.html(null).html(tpl);
	    	var innerScroll=$('.inner-scroll')[0];
	    	new ScrollDrag(innerScroll,innerScroll,false,true,$('.inner-content')[0]);
	    	new Drag($note_detail[0],$('.detail-title')[0],true,true);
			$note_detail.find('.note-delete').on('click',function()
			{
				hide_detail();
				render_note_list(); //编辑页关闭时刷新一次页面
			})

			$note_detail.find('.note-edit').on('click',function()
			{
				$note_detail.find(':input').toggle();
				$('.detail-title,.detail-content').toggle();
			})

			$note_detail.find('.star').on('click',function()
			{
				item.star=item.star?false:true;
				$(this).find('img').attr('src', 'img/star'+(item.star?'ed':'')+'.png');
			})

			$note_detail.find('form').on('submit',function(e)
			{
				e.preventDefault();
				var data={};
				oDate=new Date();
				data.title=$note_detail.find('input').val()
				data.content=$note_detail.find('textarea').val();
				data.time=(oDate.getMonth()+1)+"月"+oDate.getDate()+"日 "
			              +oDate.getHours()+"时"+oDate.getMinutes()+"分";
			    data.star=item.star;
			    change_note_list(index,data) && hide_detail();
			})
		}
		//详情页内编辑后更新数组
		function change_note_list(index,data)
		{
			if(index===undefined || !note_list[index])
				return;
			note_list[index]=$.extend({}, note_list[index], data);
			update_note_list();
			return true;
		}

		//显示详情页
		function show_detail()
		{
			$note_detail.show('fast',function()
				{
					scroll_judgement();
				});
			$mask.show();
		};

		//关闭详情页
		function hide_detail()
		{
			$note_detail.hide('fast');
			$mask.hide();
		}
	})();