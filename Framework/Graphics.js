function Graphics()
{
	const canv = document.getElementById( "gc" );
	const ctx = canv.getContext( "2d" );
	
	let images = [];
	
	this.ScreenWidth = canv.width;
	this.ScreenHeight = canv.height;
	this.ScreenRect = new Rect( 0,0,canv.width,canv.height );
	// 
	this.GetCanvas = function()
	{
		return canv;
	}
	
	this.GetContext = function()
	{
		return ctx;
	}
	
	this.LoadImage = function( url )
	{
		for( let i = 0; i < images.length; ++i )
		{
			const temp = new Image();
			temp.src = url;
			if( images[i].src == temp.src )
			{
				return i;
			}
		}
		
		images.push( new Image() );
		images[images.length - 1].src = url;
		
		return( images.length - 1 );
	}
	
	this.DrawImage = function( index,pos = new Vec2( 0,0 ),size = new Vec2( 0,0 ) )
	{
		if( size.x != 0 && size.y != 0 )
		{
			ctx.drawImage( images[index],pos.x,pos.y,size.x,size.y );
		}
		else
		{
			ctx.drawImage( images[index],pos.x,pos.y );
		}
	}
	
	this.DrawRect = function( pos,size,c )
	{
		ctx.fillStyle = c;
		ctx.fillRect( pos.x,pos.y,size.x,size.y );
	}
	
	this.DrawCircle = function( pos,radius,c )
	{
		ctx.fillStyle = c;
		
		ctx.beginPath();
		ctx.arc( pos.x,pos.y,radius,0,2 * Math.PI );
		ctx.fill();
	}
	
	this.DrawGrad = function( pos,size,colors )
	{
		let grad = ctx.createLinearGradient( pos.x,pos.y,pos.x + size.x,pos.y + size.y );
		
		const stopAddAmount = 1.0 / colors.length;
		let amount = 0.0;
		for( let i = 0; i < colors.length; ++i )
		{
			grad.addColorStop( amount,colors[i] );
			amount += stopAddAmount;
		}
		
		ctx.fillStyle = grad;
		ctx.fillRect( pos.x,pos.y,size.x,size.y );
	}
	
	this.DrawText = function( pos,font,color,msg )
	{
		ctx.fillStyle = color;
		ctx.font = font;
		ctx.fillText( msg,pos.x,pos.y );
	}
}