function Menu( gfx )
{ // This only handles the players' menu...
	GameObject.call( this );
	this.pos = new Vec2( gfx.ScreenWidth * ( 0.20 / 2 ),gfx.ScreenHeight * ( 0.20 / 2 ) );
	this.size = new Vec2( gfx.ScreenWidth * 0.80,gfx.ScreenHeight * 0.80 );
	
	let open = false;
	let lastKey = '\0';
	
	let pStats; // Use let not const here so I can set the reference in UpdateStats().
	
	const xButton = new Rect( this.pos.x + this.size.x - 40,this.pos.y,40,40 );
	let overXButton = false;
	let canClose = false;
	// 
	this.Update = function( kbd,ms,player )
	{
		if( kbd.KeyDown( 'Q' ) && lastKey == '\0' )
		{
			open = !open;
			lastKey = 'Q';
		}
		else if( !kbd.KeyDown( 'Q' ) )
		{
			lastKey = '\0';
		}
		
		overXButton = xButton.Contains( ms.GetPos() );
		if( ms.IsDown() && canClose )
		{
			if( !( new Rect( this.pos.x,this.pos.y,this.size.x,this.size.y ).Contains( ms.GetPos() ) ) ||
				overXButton )
			{
				lastKey = '\0';
				open = false;
			}
		}
		
		canClose = false;
		if( !ms.IsDown() &&
			( overXButton || !( new Rect( this.pos.x,this.pos.y,this.size.x,this.size.y ).Contains( ms.GetPos() ) ) ) )
		{
			canClose = true;
		}
	}
	
	this.Draw = function( gfx )
	{
		if( open )
		{
			// gfx.DrawRect( this.pos,this.size,"#FFF" );
			gfx.DrawGrad( this.pos,this.size,[ "#E92","#E92","#F45" ] );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,35 ) ),"30PX Lucida Console","#2EE","LVL: " + pStats.level );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,70 ) ),"30PX Lucida Console","#888","DEF: " + pStats.defense );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,105 ) ),"30PX Lucida Console","#E21","DMG: " + pStats.damage );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,140 ) ),"30PX Lucida Console","#1E2","SPD: " + pStats.speed );
			
			gfx.DrawRect( this.pos.GetAdded( new Vec2( 165,7 ) ),new Vec2( 5,this.size.y - 14 ),"#FFF" );
			
			{
				// const bSize = new Vec2( 40,40 );
				// gfx.DrawRect( new Vec2( this.pos.x + this.size.x - bSize.x,this.pos.y ),bSize,"#FFF" );
				let color = "#FFF";
				if( overXButton )
				{
					color = "#F00";
				}
				// gfx.DrawRect( new Vec2( xButton.x,xButton.y ),new Vec2( xButton.width,xButton.height ),color );
				gfx.DrawCircle( new Vec2( xButton.x + xButton.width / 2,xButton.y + xButton.width / 2 ),
					xButton.width / 2.5,color );
			}
		}
	}
	
	this.UpdateStats = function( playerStats )
	{
		pStats = playerStats;
	}
	
	this.Open = function()
	{
		open = true;
	}
	
	this.Close = function()
	{
		open = false;
	}
}