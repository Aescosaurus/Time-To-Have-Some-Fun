// This only handles the players' menu...
function Menu( gfx )
{
	function LevelUpBox( pos,id,pLvl )
	{
		function Preset( pLvl )
		{
			this.name = "BROKEN";
			this.col = "#F0F";
			
			this.def = 0;
			this.dmg = 0;
			this.spd = 0;
			
			const max = 5;
			const min = 2;
			
			this.Generate=( id )=>
			{
				// const buff = pLvl / 2;
				// const buff = Random.RangeF( 0.1,1.0 );
				const buff = 0.5;
				if( id == 0 )
				{
					this.name = "Rogue";
					this.col = "#E21";
					
					this.def = Math.ceil( Random.RangeI( -max,-min ) * buff );
					this.dmg = Math.floor( Random.RangeI( min,max ) * buff );
					this.spd = Math.floor( Random.RangeI( min,max ) * buff );
				}
				else if( id == 1 )
				{
					this.name = "Knight";
					this.col = "#888";
					
					this.def = Math.floor( Random.RangeI( min,max ) * buff );
					this.dmg = Math.floor( Random.RangeI( min,max ) * buff );
					this.spd = Math.ceil( Random.RangeI( -max,-min ) * buff );
				}
				else
				{
					this.name = "Pacifist";
					this.col = "#1E2";
					
					this.def = Math.floor( Random.RangeI( min,max ) * buff );
					this.dmg = Math.ceil( Random.RangeI( -max,-min ) * buff );
					this.spd = Math.floor( Random.RangeI( min,max ) * buff );
				}
			}
		}
		// 
		this.pos = pos;
		this.size = new Vec2( 185,85 );
		
		let hovering = false;
		
		let canBuy = false;
		let bought = false;
		
		let hasApplied = false;
		
		let preset = new Preset( pLvl );
		// 
		this.Start=()=>
		{
			preset.Generate( id );
		}
		
		this.Update=( kbd,ms,menuIsOpen,pStats )=>
		{
			if( menuIsOpen )
			{
				hovering = ( new Rect( this.pos.x,this.pos.y,
					this.size.x,this.size.y ) ).Contains( ms.GetPos() );
				
				if( pStats.levelUpPoints > 0 && hovering && !ms.IsDown() )
				{
					canBuy = true;
				}
				if( pStats.levelUpPoints < 0 || !hovering )
				{
					canBuy = false;
				}
				
				if( canBuy && ms.IsDown() && hovering )
				{
					bought = true;
				}
				
				if( bought && !hasApplied )
				{
					hasApplied = true;
					--pStats.levelUpPoints;
					pStats.defense += preset.def;
					pStats.damage += preset.dmg;
					pStats.speed += preset.spd;
				}
			}
		}
		
		this.Draw=( gfx )=>
		{
			if( hovering )
			{
				gfx.DrawRect( this.pos.GetSubtracted( new Vec2( 5,5 ) ),
					this.size.GetAdded( new Vec2( 10,10 ) ),"#FFF" );
			}
			
			// gfx.DrawRect( this.pos,this.size,"#E92" );
			gfx.DrawGrad( this.pos,this.size,[ "#E92" ] );
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 5,25 ) ),
				"20PX Lucida Console","#FFF",preset.name );
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 5,50 ) ),
				"20PX Lucida Console","#888",preset.def );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 60,50 ) ),
				"20PX Lucida Console","#E21",preset.dmg );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 115,50 ) ),
				"20PX Lucida Console","#1E2",preset.spd );
		}
		
		this.IsBought=()=>
		{
			return bought;
		}
		
		this.GetPreset=()=>
		{
			return preset;
		}
	}
	// 
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
	
	let mousePos = new Vec2( 0,0 );
	
	let obscuring = false;
	let notObscured = -1;
	
	let luBoxes = [];
	
	// Images
	const xButtonOut = gfx.LoadImage( "Images/MenuItems/XButton0.png" );
	const xButtonOver = gfx.LoadImage( "Images/MenuItems/XButton1.png" );
	
	const cursorImg = gfx.LoadImage( "Images/MenuItems/Cursor.png" );
	
	const rock = gfx.LoadImage( "Images/MenuItems/Rock.png" );
	const grass = gfx.LoadImage( "Images/MenuItems/Grass.png" );
	// 
	this.Restart=()=>
	{
		luBoxes = [];
		
		luBoxes.push( new LevelUpBox( this.pos.GetAdded( new Vec2( 325,75 ) ),
			0,pStats.level ) );
		luBoxes.push( new LevelUpBox( this.pos.GetAdded( new Vec2( 325,170 ) ),
			1,pStats.level ) );
		luBoxes.push( new LevelUpBox( this.pos.GetAdded( new Vec2( 325,265 ) ),
			2,pStats.level ) );
		
		for( let i in luBoxes )
		{
			luBoxes[i].Start();
		}
	}
	
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
		
		if( ms.GetPos().x < this.pos.x + 165 )
		{
			notObscured = 1;
		}
		else if( ms.GetPos().x < this.pos.x + 310 )
		{
			notObscured = 2;
		}
		else
		{
			notObscured = 3;
		}
		
		for( let i in luBoxes )
		{
			luBoxes[i].Update( kbd,ms,open,player.GetStats() );
			
			if( luBoxes[i].IsBought() )
			{
				this.Restart();
			}
		}
		
		mousePos = ms.GetPos();
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
			// gfx.DrawGrad( this.pos,this.size,[ "#E92","#E92","#F45" ] );
			// gfx.DrawGrad( this.pos,this.size,[ "#F45","#E56","#A0A" ] );
			gfx.DrawRect( this.pos,this.size,"#FA0" );
			
			if( overMenu )
			{
				gfx.SetAlpha( 0.1 );
				if( notObscured == 1 )
				{
					gfx.DrawRect( this.pos,new Vec2( 170,this.size.y ),"#FFF" );
				}
				else if( notObscured == 2 )
				{
					gfx.DrawRect( this.pos.GetAdded( new Vec2( 165,0 ) ),
						new Vec2( 150,this.size.y ),"#FFF" );
				}
				else
				{
					gfx.DrawRect( this.pos.GetAdded( new Vec2( 310,0 ) ),
						this.size.GetSubtracted( new Vec2( 310,0 ) ),"#FFF" );
				}
				gfx.SetAlpha( 1.0 );
			}
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,35 ) ),
				"30PX Lucida Console","#FFF","LVL: " + pStats.level );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,70 ) ),
				"30PX Lucida Console","#AE0","EXP: " + pStats.experience );
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 5,95 ) ),
				"15PX Lucida Console","#0FF","(" +
				Math.min( 255,pStats.level * 2 ) + " to next LVL)" );
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,130 ) ),
				"30PX Lucida Console","#888","DEF: " +
				( pStats.defense + pItem1.defense + pItem2.defense ) );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,165 ) ),
				"30PX Lucida Console","#E21","DMG: " +
				( pStats.damage + pItem1.damage + pItem2.damage ) );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 10,200 ) ),
				"30PX Lucida Console","#1E2","SPD: " +
				( pStats.speed + pItem1.speed + pItem2.speed ) );
			
			// Dividing lines.
			gfx.DrawRect( this.pos.GetAdded( new Vec2( 165,7 ) ),
				new Vec2( 5,this.size.y - 14 ),"#FFF" );
			gfx.DrawRect( this.pos.GetAdded( new Vec2( 310,7 ) ),
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
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 5,230 ) ),
				"25PX Lucida Console","#FFF","Equipment:" );
			
			{
				// Item 1.
				gfx.DrawImage( pItem1.sprite,
					this.pos.GetAdded( new Vec2( 5,240 ) ) );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 40,260 ) ),
					"20PX Lucida Console","#FFF",pItem1.name );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 5,290 ) ),
					"20PX Lucida Console","#888",pItem1.defense );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 60,290 ) ),
					"20PX Lucida Console","#E21",pItem1.damage );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 115,290 ) ),
					"20PX Lucida Console","#1E2",pItem1.speed );
				// Item 2.
				gfx.DrawImage( pItem2.sprite,
					this.pos.GetAdded( new Vec2( 5,300 ) ) );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 40,320 ) ),
					"20PX Lucida Console","#FFF",pItem2.name );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 5,350 ) ),
					"20PX Lucida Console","#888",pItem2.defense );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 60,350 ) ),
					"20PX Lucida Console","#E21",pItem2.damage );
				gfx.DrawText( this.pos.GetAdded( new Vec2( 115,350 ) ),
					"20PX Lucida Console","#1E2",pItem2.speed );
			}
			
			gfx.DrawText( this.pos.GetAdded( new Vec2( 325,35 ) ),
				"30PX Lucida Console","#FFF","Upgrades:" );
			gfx.DrawText( this.pos.GetAdded( new Vec2( 320,60 ) ),
				"15PX Lucida Console","#0FF","(" + pStats.levelUpPoints +
				" points available)" );
			
			//
			// gfx.DrawRect( this.pos.GetAdded( new Vec2( 325,75 ) ).GetSubtracted( new Vec2( 5,5 ) ),
			// 	new Vec2( 185,275 ).GetAdded( new Vec2( 10,10 ) ),"#FFF" );
			// gfx.DrawRect( this.pos.GetAdded( new Vec2( 325,75 ) ),
			// 	new Vec2( 185,275 ),"#0F0" );
			// 
			if( pStats.levelUpPoints > 0 )
			{
				for( let i in luBoxes )
				{
					luBoxes[i].Draw( gfx );
				}
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
		
		const cursorSize = new Vec2( 25,25 );
		// gfx.DrawImage( cursorImg,mousePos
		// 	.GetSubtracted( cursorSize.GetDivided( 4.0 ) ),
		// 	cursorSize );
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