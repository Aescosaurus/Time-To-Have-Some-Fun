function Rect( x,y,w,h )
{
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	// 
	this.Contains = function( pos )
	{
		return( pos.x > this.x && pos.x < this.x + this.width &&
		        pos.y > this.y && pos.y < this.y + this.height );
	}
	
	this.IsContainedBy = function( other )
	{
		return( this.x >= other.x && this.x + this.width <= other.x + other.width &&
			this.y >= other.y && this.y + this.height <= other.y + other.height );
	}
	
	this.Overlaps = function( other )
	{
		return ( other.x < this.x + this.width && other.x + other.width > this.x &&
		         other.y < this.y + this.height && other.y + other.height > this.y );
	}
	
	this.MoveBy = function( amount )
	{
		this.x += amount;
		this.y += amount;
	}
	
	this.MoveTo = function( pos )
	{
		this.x = pos.x;
		this.y = pos.y;
	}
}