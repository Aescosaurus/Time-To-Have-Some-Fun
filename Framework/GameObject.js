function GameObject()
{
	this.pos = new Vec2( 0,0 );
	this.size = new Vec2( 50,50 );
	this.hitbox = new Rect( 0,0,0,0 );
	// 
	this.Draw = function( gfx )
	{
		gfx.DrawRect( this.pos,this.size,"#F00" );
	}
	
	this.MoveTo = function( newPos )
	{
		this.pos = newPos;
	}
	
	this.MoveBy = function( amount )
	{
		this.pos += amount;
	}
	
	this.SetSize = function( newSize )
	{
		this.size = newSize;
		this.hitbox.width = newSize.x;
		this.hitbox.height = newSize.y;
	}
	
	this.GetPos = function()
	{
		return this.pos;
	}
	
	this.GetSize = function()
	{
		return this.size;
	}
	
	this.GetRect = function()
	{
		this.hitbox.MoveTo( this.pos );
		return this.hitbox;
	}
	
	this.Expose = function()
	{
		console.log( "-----------" );
		console.log( "GAME OBJECT" );
		console.log( "-----------" );
		console.log( "POS: " + "x: " + this.pos.x + " y: " + this.pos.y );
		console.log( "SIZE: " + "w: " + this.size.x + " h: " + this.size.y );
		console.log( "RECT: " + "x: " + this.hitbox.x + " y: " + this.hitbox.y +
			" w: " + this.hitbox.width + " h: " + this.hitbox.height );
	}
}