//tag-拖拽目标 downarea-可选中区域 X-x轴锁定 Y-y轴锁定
function Drag(tag,downArea,X,Y)
{
	var _this=this;
	this.obj=tag;
	this.disX=0;
	this.disY=0;

	downArea.onmousedown=function(ev)
	    {
		    _this.fnDown(ev,X,Y);
	    }

}
Drag.prototype.fnDown=function(ev,X,Y)
{
	var _this=this;
	var oEvent=ev||window.event;
	this.disX=oEvent.clientX-this.obj.offsetLeft;
	this.disY=oEvent.clientY-this.obj.offsetTop;

	document.onmousemove=function(e)
	{
		_this.fnMove(e,X,Y);
		return false;
	}

	document.onmouseup=function()
	{
		_this.fnUp();
	}
}
Drag.prototype.fnMove=function (e,X,Y)
{
	var oEvent=e||window.event;
	var iL=oEvent.clientX - this.disX;
	var iT=oEvent.clientY - this.disY;
	var oWidth=document.documentElement.clientWidth || document.body.clientWidth;
	var oHeight=document.documentElement.clientHeight || document.body.clientHeight;
	var objHeight = this.obj.offsetHeight;
	var objWidth = this.obj.offsetWidth;
	iL=iL<0?0:iL;
	iL=iL>(oWidth - objWidth)?(oWidth - objWidth):iL;
	iT=iT<0?0:iT;
	iT=iT>(oHeight - objHeight)?(oHeight-objHeight):iT;
	Y && (this.obj.style.top=iT + 'px');
	X && (this.obj.style.left=iL + 'px');
}
Drag.prototype.fnUp=function()
{
	document.onmousemove=null;
	document.onmouseup=null;
}
