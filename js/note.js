;(function()//注意前面的分号来结束你之前引入的库
	{
		'use strict';

		var note_list=[],                     //用来存放每一篇笔记对象的数组
		    note_item,                        //包含笔记信息的对象
		    note_items,                       //包含页面上的文章列表
		    star=[],                          //星标数组添加收藏
		    now_page=1,                       //用来储存当前页数。初始为1
		    oDate,
		    innerScroll,
		    oHeight,
		    re=/\n+/g,                         //让textarea输出的内容实现换行。
		    $body=$('body'),
		    $window=$(window),
		    $ball=$('.ball'),
		    $add_note=$('.add-note'),
		    add_move=$('.add-move')[0],
		    $note_list_area=$('.note-list'),
		    $note_detail=$('.note-detail'),
		    $new_note,
		    $tab_page,
		    $pages,
		    $delete_button,
		    $detail_button,
		    $star_button,
		    $mask=$('.mask'),
		    $detail_menu=$('.level1');

		init();

        //自定义的警告框-异步(考虑到复用,连同遮罩不直接添加在html中)
		function pop(arg)
		{
			if(!arg)return;

			var conf={},
			    dfd,
			    $box,
			    $mask,
			    timer,
			    $title,
			    $confirm,
			    confirmed,       //用来储存点击确定按钮返回的变量
			    $cancel,
			    $content;

			if(typeof arg !== 'object')
			{
				conf.title=arg;
			}
			else
			{
				$.extend(conf, arg);
			};

			dfd=$.Deferred();

			$box=$('<div>'+
				'<div style="margin:25px 0 0 10px;font-size:23px;" class="pop-title">' + conf.title + '</div>'+
				'<div class="pop-content">'+
				'<div>'+
				'<button style="position:absolute;left:40px;bottom:32px;padding:10px 25px;" class="primary confirm">确定</button>'+
				'<button style="position:absolute;right:40px;bottom:32px;padding:10px 25px;" class="primary cancel">取消</button>'+
				'</div>'+
				'</div>'+
				'</div>');
			$mask=$('<div></div>');
			$box.css({
				position:'fixed',
				padding:20,
				width:300,
				height:180,
				background:'white',
				borderRadius:5,
				textAlign:'center',
				fontSize: 18,
				boxShadow:'1px 1px 3px 2px #AFA6A6',
				zIndex:1001
			});
			$mask.css({
				position:'fixed',
				top:0,
				right:0,
				bottom:0,
				background:'rgba(0,0,0,.3)',
				left:0
			});

			$content=$box.find('.pop-content');
			$confirm=$content.find('button.confirm');
			$cancel=$content.find('button.cancel');

			$confirm.on('click',function()
			{
				confirmed = true;
			});

			$cancel.on('click',function()
			{
				confirmed = false;
			});

			$mask.on('click',function()
			{
				$cancel.trigger('click');
			})

			timer=setInterval(function()
			{
				if(confirmed !==undefined)
				{
					dfd.resolve(confirmed);
					clearInterval(timer);
					dismiss_pop();
				}
			},50)

			//移除弹窗
			function dismiss_pop()
			{
				$mask.remove();
			    $box.remove();
			}

			//让弹出框在窗口大小变化的时候自适应
			$window.on('resize',function ()
			{
				adjust_box_position({box:$box,x:0,y:20});
			});
			adjust_box_position({box:$box,x:0,y:20});

			$mask.appendTo($body);
			$box.appendTo($body);

			return dfd.promise();
		}

        //屏幕自适应函数
		function adjust_box_position()
			{
				//参数{box:jQ对象,x:Y轴距正中偏移,y:Y轴距正中偏移}
				var window_width=$window.width(),
				    window_height=$window.height(),
				    box_width,
				    box_height,
				    pos_x,
				    pos_y;
				    for(var i=0;i<arguments.length;i++)
				    {
				        box_width=arguments[i].box.width(),
				        box_height=arguments[i].box.height(),
				        pos_x=(window_width - box_width)/2 - arguments[i].x;
				        pos_y=(window_height - box_height)/2 - arguments[i].y;

				        arguments[i].box.css({
				        	left: pos_x,
				        	top:pos_y
				        });
				    }
			};


		//避免调整窗口大小后的错位问题
	    	$window.on('resize',function()
			{
				adjust_box_position({box:$note_detail,x:0,y:20},{box:$add_note,x:0,y:50});
			});

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
            new Drag($ball[1],$ball[1],true,true);

            $ball.hover(function() {
            	$(this).stop().animate({'width':200}, 400);
            }, function() {
            	$(this).stop().animate({'width':60}, 400);
            }).find('.ball-add').on('click', function(event) {
            	toggle_add_note();
            }).end().find('.ball-star').on('click',function()
            {
            	pop('功能重做中');
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
			if(note_item.title=="" || note_item.content=="")
			{
				pop('请完整输入正文和标题');
				return;
			}
			note_item.time=(oDate.getMonth()+1)+"月"+oDate.getDate()+"日 "
			+oDate.getHours()+"时"+oDate.getMinutes()+"分";
			note_item.star=false;
			console.log(note_item);
			if(add_note_list(note_item))
				{
					toggle_add_note();
					$input.val('');
					$textarea.val('');
					/*完成一个=动画添加效果*/
					$new_note=$('.note-item:eq(0)');
					oHeight=$new_note[0].offsetHeight;
					$new_note.css({"height":0,"opacity":0})
				    .animate({"height":oHeight}, 400).animate({"opacity":1}, 500);
				};

		}).find('.note-delete').on('click',function()
		{
			toggle_add_note();
		});


		//添加更新数组
        function add_note_list(data)
        {
        	note_list.push(data);
        	now_page=1;//回到第一页
        	update_note_list();
        	return true;
        }

        //上传新数组并且刷新页面
        function update_note_list()
        {
        	store.set('note_list',note_list);
        	render_note_list();
        }

		//旧版本的render函数。先注释暂时留作参考
		/*function render_note_list()
		{
			$note_list_area.html('');
			var note_length=note_list.length;
			var count=note_length>2?(note_length-3):0;
			for(var i=note_length-1;i>=count;i--)
			{
				var item=create_new_note(note_list[i],i);
				item.appendTo('.note-list');
			}
			listen_all();
			tab_pager(note_list);
			return true;
		}*/

		function render_note_list(num)                             
		{
			if(!num)num=now_page;
			$note_list_area.html('');
			var note_length=note_list.length;
			var begin=note_length-(1+(num-1)*3);
			var end=(begin-2)<0?0:(begin-2);
			for(var i=begin;i>=end;i--)
			{
				var item=create_new_note(note_list[i],i);
				item.appendTo('.note-list');
			}
			listen_all();
			tab_pager(note_list,3);
		}

        
        //按钮事件集中
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
				//和详情按钮的函数较为重复，待合并
				create_detail($(this).data('index'));
				show_detail();
				scroll_judgement();
			})
		}
        
        //计算并添加分页
		function tab_pager(arr,list)
	    {
	    	var aLi=Math.ceil(arr.length/list);
	    	$pages='<div class="tab-page">'+
	                        '<ul>'+
	                        '</ul>'+
                        '</div>';
            $('body').append($pages);
            $tab_page=$('.tab-page ul');
            $tab_page.html('');
            if(aLi<2) return;
            $tab_page.css({width:aLi*35,height:30});
            var present;
            for(var i=0;i<aLi;i++)
            {
            	//给当前的页码增加不同的样式
            	if(i==now_page-1)
            	{
            		present=' class="active"';
            	}
            	else
            	{
            		present='';
            	}
            	$('<li'+present+'>'+(i+1)+'</li>').appendTo($tab_page);
            }

            $tab_page.find('li').on('click',function()
            {
            	now_page=this.innerHTML;
            	render_note_list();
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

        //监听删除按钮事件
		function listen_delete()
		{
			$delete_button.on('click',function()
			{
				var $this=$(this);
				var $index=$(this).parent().data('index');
				pop('确定要删除吗？').then(function(result)
				{
					if(result)
						{
							$this.parent().animate({"opacity":0}, 300).animate({'height':0}, 72,function()
									        {
									        	delete_note_list($index);
									        })
						}
				});
			})
		}

		//监听详情按钮
		function listen_detail()
		{
			$detail_button.on('click',function()
			{
				create_detail($(this).parent().data('index'));
				show_detail();
				scroll_judgement();
			})
		}

		//监听收藏星标
		function listen_star()
		{
			$star_button.on('click',function()
			{
				var data={};
				var $index=$(this).parent().data('index');
				data.star=!note_list[$index].star;
				change_note_list($index,data);
			})
		}
		//判断滚动条是否该出现
		function scroll_judgement()
		{
			if($('.inner-content')[0].offsetHeight<$(".detail-content")[0].offsetHeight)
	    		{
	    			$(".scroll").hide();
	    		}
	    	else
	    	    {
	    		    $(".scroll").show();
	    	    }
		}
		//更新详情页
		function create_detail(index)
		{
			if(index==undefined || !note_list[index])return;
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
	    	'<div class="detail-title">'+item_title+'</div>'+
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
	    	adjust_box_position({box:$note_detail,x:0,y:20});
	    	
			$note_detail.find('.note-delete').on('click',function()
			{
				hide_detail();
			})

			$note_detail.find('.note-edit').on('click',function()
			{
				$note_detail.find(':input').toggle();
				$('.detail-title,.detail-content').toggle();
			})

			$note_detail.find('.star').on('click',function()
			{
				var data={};
				data.star=!note_list[index].star;
				$(this).find('img').attr('src', 'img/star'+(data.star?'ed':'')+'.png');
				change_note_list(index,data);
			});

			//右击菜单
			$note_detail.on('contextmenu',function(e)
	            {
	            	e.preventDefault();
	            	$detail_menu.css({'left':e.pageX+5,'top':e.pageY+5}).show();
	            }).on('click',function()
	            {
	            	$detail_menu.hide();
	            	scroll_judgement();
	            });
	            $detail_menu.on('click', function(e) {
	            	e.stopPropagation();
	            	scroll_judgement();
	            }).children('li').hover(function()
	            {
	            	$(this).find('.level2').show();
	            },function()
	            {
	            	$(this).find('.level2').hide();
	            });

	            $('#fontsize li').click(function()
	            	{
	            		$('.inner-content').css('top', '0');  //避免拉到最后改小字体出现大片空白
	            		$note_detail.css('font-size',$(this).data('size'));
	            	});
	            $('#fontcolor li').click(function()
	            	{
	            		$note_detail.css('color',$(this).data('color'));
	            	});
	            $('#bgcolor li').click(function()
	            	{
	            		$note_detail.css('background-color',$(this).data('bgcolor'));
	            	});

			$note_detail.find('form').on('submit',function(e)
			{
				e.preventDefault();
				var data={};
				oDate=new Date();
				data.title=$note_detail.find('input').val();
				data.content=$note_detail.find('textarea').val();
				if(data.title=="" || data.content=="")return;
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

		//删除数组元素并更新页面
		function delete_note_list(index)
		{
			if(index===undefined || !note_list[index])
				return;
			note_list.splice(index,1);
			update_note_list();
		}
	})();