// TODO: Make ALL OF THIS less GROSS.

function GoMining( gfx,playerStats,playerResources )
{
	function Rating( score )
	{
		
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
					"50PX Lucida Console","#EE5","Ore Harvested: " + scoreMsg );
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
	const Finish=()=>
	{
		finished = true;
		hasFailed = true;
		canClick = false;
		let msg = Math.ceil( power / ( ( frames.length - 1 ) / 2 ) + 0.1 );
		if( msg == 3 )
		{
			msg *= 2;
		}
		s = new Score( msg );
		pStats.experience += s.GetScore();
		pResources.rocks += msg;
		pStats.Verify();
		pResources.Verify();
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
	
	const pStats = playerStats;
	const pResources = playerResources;
	
	let s = new Score( "",false );
	
	const frames =
	[
		gfx.LoadImage( "Images/Outcroppings/Mining0.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining1.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining2.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining3.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining4.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining5.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining6.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining7.png" ),
		gfx.LoadImage( "Images/Outcroppings/Mining8.png" )
	];
	// 
	this.Update=( kbd,ms )=>
	{
		if( isOpen )
		{
			s.Update();
			
			if( !failed )
			{
				if( ( kbd.KeyDown( ' ' ) || ( ms.IsDown() && canClick ) ) && !finished )
				{
					canUnclick = false;
					power = 0;
					progress += progressAdd;
					canFinish = true;
				}
				else
				{
					if( canFinish && !finished && ( progress <= 0 ) )
					{
						Finish();
					}
					progress -= progressAdd * 5;
					power += powerAdd;
				}
				
				if( Math.floor( progress ) > frames.length - 1 )
				{
					progress = frames.length - 1;
				}
				
				if( Math.floor( progress ) < 0 )
				{
					progress = 0;
				}
				
				if( progress >= frames.length - 1 )
				{
					failed = true;
				}
				
				if( !ms.IsDown() && !finished )
				{
					canClick = true;
				}
			}
			else if( !hasFailed )
			{
				Finish();
			}
			
			if( finished && s.IsFinished() )
			{
				progress = 0;
				isOpen = false;
				power = 0;
				hasFailed = false;
				failed = false;
				canFinish = false;
				finished = false;
				s = new Score( "",false );
			}
		}
	}
	
	this.Draw=( gfx )=>
	{
		if( isOpen )
		{
			// gfx.DrawRect( new Vec2( 0,0 ),new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),"#3E3" );
			// gfx.DrawGrad( new Vec2( 0,0 ),new Vec2( gfx.ScreenWidth,gfx.ScreenHeight ),[ "#55F","#33E","#11C" ] );
			gfx.DrawImage( frames[Math.floor( progress )],new Vec2( 0,0 ) );
			
			gfx.DrawText( new Vec2( 65,50 ),"45PX Lucida Console","#FFF","Mine an Outcropping" );
			
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