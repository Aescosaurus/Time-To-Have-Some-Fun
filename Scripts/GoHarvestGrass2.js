function GoHarvestGrass( gfx,playerStats,playerResources )
{
	function Score( scoreMsg,active = true )
	{
		let pos = new Vec2( gfx.ScreenWidth / 2,
			gfx.ScreenHeight / 2 );
		const opacityLossRate = 0.02;
		let opacity = 1.0;
		
		const expGain = Random.RangeI( 3,5 );
		// 
		this.Update=()=>
		{
			if( active )
			{
				if( opacity > opacityLossRate )
				{
					opacity -= opacityLossRate;
				}
			}
		}
		
		this.Draw=( gfx )=>
		{
			if( active )
			{
				gfx.SetAlpha( opacity );
				gfx.DrawText( new Vec2( gfx.ScreenWidth / 8,gfx.ScreenHeight / 2 ),
					"50PX Lucida Console","#EE5","Grass Harvested: " + scoreMsg );
				// gfx.DrawText( new Vec2( gfx.ScreenWidth / 4,gfx.ScreenHeight / 1.7 ),
				// 	"40PX Lucida Console","#EE5","EXP Gained: " + expGain );
				gfx.SetAlpha( 1.0 );
			}
		}
		
		this.IsFinished=()=>
		{
			return( opacity <= opacityLossRate );
		}
		
		this.GetScore=()=>
		{
			return expGain;
		}
	}
	function Tuft( pos,myTime,key )
	{
		Tuft.prototype.Size = new Vec2( 50,50 );
		Tuft.prototype.Imgs =
		[
			gfx.LoadImage( "Images/Fields/FieldGrass0.png" ),
			gfx.LoadImage( "Images/Fields/FieldGrass1.png" ),
			gfx.LoadImage( "Images/Fields/FieldGrass2.png" ),
			gfx.LoadImage( "Images/Fields/FieldGrass3.png" )
		];
		Tuft.prototype.DoneImgs =
		[
			gfx.LoadImage( "Images/Fields/FieldGrassDone0.png" ),
			gfx.LoadImage( "Images/Fields/FieldGrassDone1.png" ),
			gfx.LoadImage( "Images/Fields/FieldGrassDone2.png" ),
			gfx.LoadImage( "Images/Fields/FieldGrassDone3.png" )
		];
		this.Pos = pos;
		this.Rect = new Rect( this.Pos.x,this.Pos.y,
			Tuft.prototype.Size.x,Tuft.prototype.Size.y );
		
		let hit = false;
		let done = false;
		
		let active = false;
		const myImg = Random.RangeI( 0,Tuft.prototype.Imgs.length - 1 );
		// 
		this.Start=()=>
		{
			// this.Pos.x = Random.RangeI( Tuft.prototype.Size.x,
			// 	gfx.ScreenWidth - Tuft.prototype.Size.x );
			// this.Pos.y = Random.RangeI( Tuft.prototype.Size.y,
			// 	gfx.ScreenHeight - Tuft.prototype.Size.y );
			
			this.Rect.MoveTo( this.Pos );
		}
		
		this.Update=( kbd,ms )=>
		{
			if( !done )
			{
				active = true;
				setTimeout( function()
				{
					active = true;
				},myTime );
				
				if( active )
				{
					setTimeout( function()
					{
						active = false;
						done = true;
					},1200 );
				
					if( this.Rect.Contains( ms.GetPos() ) &&
						ms.IsDown() )
					{
						hit = true;
						done = true;
					}
				}
			}
		}
		
		this.Draw=( gfx )=>
		{
			// gfx.DrawRect( this.Pos,Tuft.prototype.Size,"gray" );
			if( !hit )
			{
				gfx.DrawImage( Tuft.prototype.Imgs[myImg],
					this.Pos,Tuft.prototype.Size );
			}
			else
			{
				gfx.DrawImage( Tuft.prototype.DoneImgs[myImg],
					this.Pos,Tuft.prototype.Size );
			}
		}
		
		this.Finished=()=>
		{
			return done;
		}
		
		this.CompletedCorrectly=()=>
		{
			return( done && hit );
		}
	}
	// 
	const ResetGame=()=>
	{
		grassTufts = [];
		finished = false;
		gameOpen = false;
		gavePoints = false;
		s = new Score( "",false );
		this.Start();
	}
	
	const GivePlayerPoints=( amount )=>
	{
		// 
		finished = true;
		// gameOpen = false;
		gavePoints = true;
		s = new Score( amount,true );
		
		playerResources.grass += amount;
		// ResetGame();
	}
	// 
	let gameOpen = false;
	
	let grassTufts = [];
	
	const grassBG = gfx.LoadImage( "Images/Fields/FieldBackground.png" );
	
	let finished = false;
	let gavePoints = false;
	
	let s = new Score( "",false );
	// 
	this.Start=()=>
	{
		const positions =
		[
			[
				new Vec2( 140,320 ),
				new Vec2( 250,380 ),
				new Vec2( 330,290 ),
				new Vec2( 420,380 ),
				new Vec2( 510,330 )
			],
			[
				new Vec2( 110,350 ),
				new Vec2( 210,290 ),
				new Vec2( 280,360 ),
				new Vec2( 400,370 ),
				new Vec2( 430,290 )
			]
		];
		const usedPos = Random.RangeI( 0,positions.length - 1 );
		// console.log( usedPos );
		const keys = [ 'W','A','S','D'/*,' ','Q','E'*/ ];
		const times = [ 2100,4200,1500,6500,5500 ];
		for( let i = 0; i < 5; ++i )
		{
			grassTufts.push( new Tuft( positions[usedPos][i],
				times[i],
				keys[Random.RangeI( 0,keys.length - 1 )] ) );
			
			grassTufts[i].Start();
		}
	}
	
	this.Update=( kbd,ms )=>
	{	
		if( gameOpen )
		{
			s.Update();
			
			if( s.IsFinished() )
			{
				ResetGame();
				return;
			}
			
			for( let i in grassTufts )
			{
				grassTufts[i].Update( kbd,ms );
			}
			
			let points = 0;
			for( let i in grassTufts )
			{
				if( !grassTufts[i].Finished() )
				{
					finished = false;
					return;
				}
				if( grassTufts[i].CompletedCorrectly() )
				{
					finished = true;
					++points;
				}
			}
			
			// Only code to give points should go here.
			if( !gavePoints && finished )
			{
				GivePlayerPoints( points );
			}
		}
	}
	
	this.Draw=( gfx )=>
	{
		if( gameOpen )
		{
			// gfx.DrawRect( new Vec2( 0,0 ),
			// 	new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),
			// 	"green" );
			gfx.DrawImage( grassBG,
				new Vec2( 0,0 ),
				new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ) );
			
			for( let i in grassTufts )
			{
				grassTufts[i].Draw( gfx );
			}
			
			s.Draw( gfx );
		}
	}
	
	this.Open=()=>
	{
		gameOpen = true;
	}
	
	this.IsOpen=()=>
	{
		return gameOpen;
	}
}