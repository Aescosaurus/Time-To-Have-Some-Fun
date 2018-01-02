function GoMining()
{
	let isOpen = false;
	// 
	this.Update = function( kbd,ms )
	{
		
	}
	
	this.Draw = function( gfx )
	{
		if( isOpen )
		{
			// gfx.DrawRect( new Vec2( 0,0 ),new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),"#3E3" );
			gfx.DrawGrad( new Vec2( 0,0 ),new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),[ "#55F","#33E","#11C" ] );
			
			gfx.DrawText( new Vec2( 65,50 ),"45PX Lucida Console","#FFF","Mine an Outcropping" );
			
			
		}
	}
	
	this.Open = function()
	{
		isOpen = true;
	}
	
	this.IsOpen = function()
	{
		return isOpen;
	}
}