
//自定义滚动条
//备忘 roll目标滚动珠 X横轴滚动 Y竖轴滚动 toRoll关联页可选
//ToDo
function ScrollDrag(roll,X,Y,toRoll)
{
	var _this=this;
	this.obj=roll;
	this.toObj=toRoll;
	this.disX=0;
	this.disY=0;
	this.scale=0;
	this.obj.onmousedown=function(ev)
	{
		_this.fnDown(ev,X,Y,toRoll);
	}
}
ScrollDrag.prototype.fnDown=function(ev,X,Y)
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
ScrollDrag.prototype.fnMove=function (e,X,Y)
{
	var oEvent=e||window.event;
	var iL=oEvent.clientX - this.disX;
	var iT=oEvent.clientY - this.disY;
	var parentHeight = this.obj.parentNode.offsetHeight;
	var parentWidth = this.obj.parentNode.offsetWidth;
	var oHeight = this.obj.offsetHeight;
	var oWidth = this.obj.offsetWidth;
	iL=iL<0?0:iL;
	iL=iL>(parentWidth - oWidth)?(parentWidth - oWidth):iT;
	iT=iT<0?0:iT;
	iT=iT>(parentHeight - oHeight)?(parentHeight-oHeight):iT;
	Y && (this.obj.style.top=iT + 'px',this.scale = this.obj.offsetTop/(parentHeight - oHeight));
	X && (this.obj.style.left=iL + 'px',this.scale = this.obj.offsetLeft/(parentWidth - oWidth));

	if(this.toObj) 
	{
		Y && (this.toObj.style.top=-this.scale*(this.toObj.offsetHeight - this.toObj.parentNode.offsetHeight) + 'px');
	    X && (this.toObj.style.top=-this.scale*(this.toObj.offsetWidth - this.toObj.parentNode.offsetWidth) + 'px');
 	}
}
ScrollDrag.prototype.fnUp=function()
{
	document.onmousemove=null;
	document.onmouseup=null;
}

