function Mouse()
{
	let pos = new Vec2( 0,0 );
	let isDown = false;
	
	// 
	this.Start = function( canvas )
	{
		canvas.addEventListener( "mousedown",function()
		{
			isDown = true;
		} );
		
		canvas.addEventListener( "mouseup",function()
		{
			isDown = false;
		} );
		
		canvas.addEventListener( "mousemove",function( e )
		{
			const rect = canvas.getBoundingClientRect();
			const root = document.documentElement;
			pos.x = e.clientX - rect.left - root.scrollLeft;
			pos.y = e.clientY - rect.top - root.scrollTop;
		} );
		
		canvas.addEventListener( "touchmove",function( e )
		{
			e.preventDefault();
			pos.x = e.changedTouches[0].clientX;
			pos.y = e.changedTouches[0].clientY;
		} );
		
		canvas.addEventListener( "touchstart",function( e )
		{
			isDown = true;
		} );
		
		canvas.addEventListener( "touchend",function( e )
		{
			isDown = false;
		} );
	}
	
	this.GetPos = function()
	{
		return pos;
	}
	
	this.IsDown = function()
	{
		return isDown;
	}
}