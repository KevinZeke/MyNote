//toRoll 滚动条滚动区域
function ScrollDrag(scroll,downArea,X,Y,toRoll) 
{
	this.toObj=toRoll;
	this.scale=0;
    Drag.call(this,scroll,downArea,X,Y,toRoll);
};

for(var i in Drag.prototype)
{
	ScrollDrag.prototype[i]=Drag.prototype[i];
};

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
	iT=iT>(parentHeight - oHeight)?(parentHeight - oHeight):iT;
	Y && (this.obj.style.top=iT + 'px',this.scale = this.obj.offsetTop/(parentHeight - oHeight));
	X && (this.obj.style.left=iL + 'px',this.scale = this.obj.offsetLeft/(parentWidth - oWidth));

	if(this.toObj) 
	{
		Y && (this.toObj.style.top=-this.scale*(this.toObj.offsetHeight - this.toObj.parentNode.offsetHeight) + 'px');
	    X && (this.toObj.style.top=-this.scale*(this.toObj.offsetWidth - this.toObj.parentNode.offsetWidth) + 'px');
 	}
}