// TODO: Make ALL OF THIS less GROSS.

function GoHarvestGrass( gfx,playerStats,playerResources )
{
	function GrassBlade( xPos )
	{
		this.pos = new Vec2( xPos,0 );
		this.size = new Vec2( 35,gfx.ScreenHeight );
		
		let hit = false;
		
		const speed = 5;
		// 
		this.Update=()=>
		{
			this.pos.x -= speed;
		}
		
		this.Draw=( gfx )=>
		{
			if( hit )
			{
				gfx.DrawCircle( new Vec2( this.pos.x + 25,gfx.ScreenHeight / 2 ),
					50,"#F00" );
			}
			
			gfx.DrawRect( this.pos,this.size,"#0F0" );
			gfx.DrawRect( this.pos.GetAdded( new Vec2( 0,this.size.y / 2 - 20 ) ),
				new Vec2( this.size.x,40 ),"#FA0" );
		}
		
		this.Hit=()=>
		{
			hit = true;
		}
		
		this.IsHit=()=>
		{
			return hit;
		}
		
		this.GetPos=()=>
		{
			return this.pos;
		}
		
		this.GetRect=()=>
		{
			return( new Rect( this.pos.x,this.pos.y,this.size.x,this.size.y ) );
		}
	}
	
	function Score( scoreMsg,active = true )
	{
		let pos = new Vec2( gfx.ScreenWidth / 2,gfx.ScreenHeight / 2 );
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
				gfx.DrawText( new Vec2( gfx.ScreenWidth / 4,gfx.ScreenHeight / 1.7 ),
					"40PX Lucida Console","#EE5","EXP Gained: " + expGain );
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
	// 
	let isOpen = false;
	
	const progressAdd = 0.2;
	let progress = 0;
	let failed = false;
	let hasFailed = false;
	let canFinish = false;
	let finished = false;
	
	let canClick = false;
	
	const powerAdd = 1;
	let power = 0;
	
	const moveSpeed = 2;
	const grassPos = new Vec2( 0,0 );
	let points = 0;
	
	let blades =
	[
		new GrassBlade( gfx.ScreenWidth / 2 ),
		new GrassBlade( gfx.ScreenWidth - 10 ),
		new GrassBlade( gfx.ScreenWidth + 240 ),
		new GrassBlade( gfx.ScreenWidth + 350 ),
		new GrassBlade( gfx.ScreenWidth + 450 ),
		new GrassBlade( gfx.ScreenWidth + 520 )
	];
	
	let started = false;
	
	const pStats = playerStats;
	const pResources = playerResources;
	
	let s = new Score( "",false );
	
	const frames =
	[
		gfx.LoadImage( "Images/Fields/Harvesting1.png" ),
		gfx.LoadImage( "Images/Fields/Harvesting1.png" )
	];
	// 
	this.Update=( kbd,ms )=>
	{
		if( isOpen )
		{
			s.Update();
			
			for( let i in blades )
			{
				blades[i].Update();
			}
			
			if( !failed )
			{
				// This is basically Update.
				// if( started )
				// {
				// 	grassPos.x -= moveSpeed;
				// }
				// else if( kbd.KeyDown( ' ' ) )
				// {
				// 	started = true;
				// }
				
				let bladeHit = false;
				for( let i in blades )
				{
					if( ( new Rect( 50,gfx.ScreenHeight / 2 - 20,25,40 ) )
						.Overlaps( blades[i].GetRect() ) &&
						kbd.KeyDown( ' ' ) )
					{
						// ++points;
						blades[i].Hit();
						bladeHit = true;
					}
				}
				
				if( !bladeHit && kbd.KeyDown( ' ' ) )
				{
					--points;
				}
				
				if( blades[blades.length - 1].GetPos().x < 0 && !hasFailed )
				{
					for( let i in blades )
					{
						if( blades[i].IsHit() )
						{
							++points;
						}
					}
					if( points < 0 )
					{
						points = 0;
					}
					s = new Score( points,true );
					hasFailed = true;
				}
			}
			
			if( s.IsFinished() )
			{
				progress = 0;
				isOpen = false;
				power = 0;
				hasFailed = false;
				failed = false;
				canFinish = false;
				finished = false;
				
				pStats.experience += s.GetScore();
				pResources.grass += points;
				pStats.Verify();
				pResources.Verify();
				
				points = 0;
				blades = [];
				blades =
				[
					new GrassBlade( gfx.ScreenWidth / 2 ),
					new GrassBlade( gfx.ScreenWidth - 10 ),
					new GrassBlade( gfx.ScreenWidth + 240 ),
					new GrassBlade( gfx.ScreenWidth + 350 ),
					new GrassBlade( gfx.ScreenWidth + 450 ),
					new GrassBlade( gfx.ScreenWidth + 520 )
				];
				s = new Score( "",false );
			}
		}
	}
	
	this.Draw=( gfx )=>
	{
		if( isOpen )
		{
			// if( started )
			// {
			// 	gfx.DrawImage( frames[1],new Vec2( 0,0 ) );
			// }
			// else
			// {
			// 	gfx.DrawImage( frames[0],new Vec2( 0,0 ) );
			// }
			gfx.DrawImage( frames[0] );
			for( let i in blades )
			{
				blades[i].Draw( gfx );
			}
			
			gfx.DrawText( new Vec2( 65,50 ),"45PX Lucida Console","#FFF","Harvest some Grass" );
			
			let color = "#0F0";
			for( let i in blades )
			{
				if( ( new Rect( 50,gfx.ScreenHeight / 2 - 20,25,40 ) )
					.Overlaps( blades[i].GetRect() ) )
				{
					color = "#FA0";
				}
			}
			
			// gfx.DrawRect( new Vec2( 50,gfx.ScreenHeight / 2 - 20 ),
			// 	new Vec2( 40,40 ),color );
			gfx.DrawCircle( new Vec2( 50,gfx.ScreenHeight / 2 ),20,color );
			
			s.Draw( gfx );
		}
	}
	
	this.Open=()=>
	{
		isOpen = true;
	}
	
	this.IsOpen=()=>
	{
		return isOpen;
	}
}