function Menu( gfx )
{ // This only handles the players' menu...
	GameObject.call( this );
	this.pos = new Vec2( gfx.ScreenWidth * ( 0.20 / 2 ),gfx.ScreenHeight * ( 0.20 / 2 ) );
	this.size = new Vec2( gfx.ScreenWidth * 0.80,gfx.ScreenHeight * 0.80 );
	
	let open = false;
	let lastKey = '\0';
	
	let pStats; // Use let not const here so I can set the reference in UpdateStats().
	let pResources;
	
	const xButton = new Rect( this.pos.x + this.size.x - 40,this.pos.y,40,40 );
	let overXButton = false;
	let canClose = false;
	let overMenu = false;
	
	let obscureRight = false;
	
	// Images
	const rock = gfx.LoadImage( "Images/MenuItems/Rock.png" );
	// 
	this.Update=( kbd,ms,player )=>
	{
		overMenu = ( new Rect( this.pos.x,this.pos.y,
			this.size.x,this.size.y ) ).Contains( ms.GetPos() );
			
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
			if( !overMenu || overXButton )
			{
				lastKey = '\0';
				open = false;
			}
		}
		
		canClose = false;
		if( !ms.IsDown() && ( overXButton || !overMenu ) )
		{
			canClose = true;
		}
		
		if( ms.GetPos().x > this.pos.x + 165 )
		{
			obscuringRight = false;
		}
		else
		{
			obscuringRight = true;
		}
	}
	
	this.Draw=( gfx )=>
	{
		if( open )
		{
			// gfx.DrawRect( this.pos,this.size,"#FFF" );
			if( overMenu )
			{
				gfx.DrawRect( this.pos.GetSubtracted( new Vec2( 5,5 ) ),
					this.size.GetAdded( new Vec2( 10,10 ) ),"#FFF" );
			}
			gfx.DrawGrad( this.pos,this.size,[ "#E92","#E92","#F45" ] );
			
			if( overMenu )
			{
				gfx.SetAlpha( 0.1 );
				if( obscuringRight )
				{
					gfx.DrawRect( this.pos,new Vec2( 170,this.size.y ),"#FFF" );
				}
				else
				{
					gfx.DrawRect( this.pos.GetAdded( new Vec2( 165,0 ) ),
						this.size.GetSubtracted( new Vec2( 165,0 ) ),"#FFF" );
				}
				gfx.SetAlpha( 1.0 );
			}
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,35 ) ),
				"30PX Lucida Console","#FFF","LVL: " + pStats.level );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,70 ) ),
				"30PX Lucida Console","#888","DEF: " + pStats.defense );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,105 ) ),
				"30PX Lucida Console","#E21","DMG: " + pStats.damage );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,140 ) ),
				"30PX Lucida Console","#1E2","SPD: " + pStats.speed );
			
			// Center dividing line.
			gfx.DrawRect( this.pos.GetAdded( new Vec2( 165,7 ) ),
				new Vec2( 5,this.size.y - 14 ),"#FFF" );
			
			// gfx.DrawRect( this.pos.GetAdded( new Vec2( 175,12 ) ),
			// 	new Vec2( 25,25 ),"#333" );
			gfx.DrawImage( rock,this.pos.GetAdded( new Vec2( 175,12 ) ) );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 205,35 ) ),
				"30PX Lucida Console","#FFF",pResources.rocks );
			
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
	
	this.UpdateStats=( playerStats )=>
	{
		pStats = playerStats;
	}
	
	this.UpdateResources=( playerResources )=>
	{
		pResources = playerResources;
	}
	
	this.Open=()=>
	{
		open = true;
	}
	
	this.Close=()=>
	{
		open = false;
	}
}