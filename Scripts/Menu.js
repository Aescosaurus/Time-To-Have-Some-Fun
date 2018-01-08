function Menu( gfx )
{ // This only handles the players' menu...
	GameObject.call( this );
	this.pos = new Vec2( gfx.ScreenWidth * ( 0.20 / 2 ),
		gfx.ScreenHeight * ( 0.20 / 2 ) );
	this.size = new Vec2( gfx.ScreenWidth * 0.80,gfx.ScreenHeight * 0.80 );
	
	let open = false;
	let lastKey = '\0';
	
	let pStats; // Use let not const so I can set the reference in UpdateStats().
	let pResources;
	let pItem1;
	let pItem2;
	
	const xButton = new Rect( this.pos.x + this.size.x - 40,this.pos.y,40,40 );
	let overXButton = false;
	let canClose = false;
	let overMenu = false;
	
	let obscureRight = false;
	
	// Images
	const xButtonOut = gfx.LoadImage( "Images/MenuItems/XButton0.png" );
	const xButtonOver = gfx.LoadImage( "Images/MenuItems/XButton1.png" );
	
	const rock = gfx.LoadImage( "Images/MenuItems/Rock.png" );
	const grass = gfx.LoadImage( "Images/MenuItems/Grass.png" );
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
				"30PX Lucida Console","#AE0","EXP: " + pStats.experience );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,105 ) ),
				"30PX Lucida Console","#888","DEF: " +
				( pStats.defense + pItem1.defense + pItem2.defense ) );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,140 ) ),
				"30PX Lucida Console","#E21","DMG: " +
				( pStats.damage + pItem1.damage + pItem2.damage ) );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,175 ) ),
				"30PX Lucida Console","#1E2","SPD: " +
				( pStats.speed + pItem1.speed + pItem2.speed ) );
			
			// Center dividing line.
			gfx.DrawRect( this.pos.GetAdded( new Vec2( 165,7 ) ),
				new Vec2( 5,this.size.y - 14 ),"#FFF" );
			
			{ // Right side resources.
				gfx.DrawText( this.pos.GetAdded( new Vec2( 175,35 ) ),
					"35PX Lucida Console","#FFF","Items:" );
					
				gfx.DrawImage( rock,this.pos.GetAdded( new Vec2( 175,50 ) ) );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 205,75 ) ),
					"30PX Lucida Console","#FFF",pResources.rocks );
				
				gfx.DrawImage( grass,this.pos.GetAdded( new Vec2( 175,85 ) ) );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 205,110 ) ),
					"30PX Lucida Console","#FFF",pResources.grass );
			}
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 5,205 ) ),
				"25PX Lucida Console","#FFF","Equipment:" );
			
			{
				// Item 1.
				gfx.DrawImage( pItem1.sprite,
					this.pos.GetAdded( new Vec2( 5,215 ) ) );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 40,235 ) ),
					"20PX Lucida Console","#FFF",pItem1.name );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 5,265 ) ),
					"20PX Lucida Console","#888",pItem1.defense );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 60,265 ) ),
					"20PX Lucida Console","#E21",pItem1.damage );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 115,265 ) ),
					"20PX Lucida Console","#1E2",pItem1.speed );
				// Item 2.
				gfx.DrawImage( pItem2.sprite,
					this.pos.GetAdded( new Vec2( 5,275 ) ) );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 40,295 ) ),
					"20PX Lucida Console","#FFF",pItem2.name );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 5,325 ) ),
					"20PX Lucida Console","#888",pItem2.defense );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 60,325 ) ),
					"20PX Lucida Console","#E21",pItem2.damage );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 115,325 ) ),
					"20PX Lucida Console","#1E2",pItem2.speed );
			}
			
			{
				let drawButton;
				if( overXButton )
				{
					drawButton = xButtonOver;
				}
				else
				{
					drawButton = xButtonOut;
				}
				gfx.DrawImage( drawButton,new Vec2( xButton.x,xButton.y ) );
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
	
	this.UpdateItem1=( playerItem1 )=>
	{
		pItem1 = playerItem1;
	}
	
	this.UpdateItem2=( playerItem2 )=>
	{
		pItem2 = playerItem2;
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