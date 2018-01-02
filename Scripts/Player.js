function Player( gfx )
{
	function Stats()
	{
		this.level = 1;
		this.defense = 0;
		this.damage = 0;
		this.speed = 0;
		// 
		this.Verify = function()
		{
			this.level = Math.min( Math.max( this.level,0 ),255 );
			this.defense = Math.min( Math.max( this.defense,0 ),255 );
			this.damage = Math.min( Math.max( this.damage,0 ),255 );
			this.speed = Math.min( Math.max( this.speed,0 ),255 );
		}
	}
	// 
	GameObject.call( this );
	this.pos = new Vec2( gfx.ScreenWidth / 2,gfx.ScreenHeight / 2 );
	
	const sts = new Stats();
	
	const timeToMove = 12;
	let moveTimer = 0;
	let lastKey = '\0';
	
	let isHighlighted = false;
	let canOpenMenu = false;
	// 
	this.Start = function( menu )
	{
		menu.UpdateStats( sts );
		sts.defense = 10;
		sts.damage = 1;
		sts.speed = 15;
		sts.Verify();
	}
	
	this.Update = function( kbd,ms,area,menu )
	{
		isHighlighting = ( new Rect( this.pos.x - this.size.x / 2,this.pos.y - this.size.y / 2,
			this.size.x,this.size.y ).Contains( ms.GetPos() ) );
		
		if( !kbd.KeyDown( lastKey ) )
		{
			lastKey = '\0';
		}
		
		moveTimer += sts.speed;
		if( ( moveTimer > 255 || lastKey == '\0' ) )
		{
			if( kbd.KeyDown( 'W' ) )
			{
				this.Move( new Vec2( 0,-sts.speed ),area,menu );
				lastKey = 'W';
			}
			else if( kbd.KeyDown( 'S' ) )
			{
				this.Move( new Vec2( 0,sts.speed ),area,menu );
				lastKey = 'S';
			}
			else if( kbd.KeyDown( 'A' ) )
			{
				this.Move( new Vec2( -sts.speed,0 ),area,menu );
				lastKey = 'A';
			}
			else if( kbd.KeyDown( 'D' ) )
			{
				this.Move( new Vec2( sts.speed,0 ),area,menu );
				lastKey = 'D';
			}
		}
		
		if( ms.IsDown() && isHighlighting && canOpenMenu )
		{
			menu.Open();
		}
		// Below has to go after above to work.
		canOpenMenu = false;
		if( !ms.IsDown() && isHighlighting )
		{
			canOpenMenu = true;
		}
	}
	
	this.Draw = function( gfx )
	{
		// gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ),this.size,"#0FF" );
		if( isHighlighting )
		{
			const offset = new Vec2( 3,3 );
			gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ).GetSubtracted( offset ),
				this.size.GetAdded( offset.GetMultiplied( 2 ) ),"#FFF" );
		}
		gfx.DrawGrad( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ),this.size,[ "#07F","#0FF" ] );
	}
	
	this.Move = function( amount,area,menu )
	{
		moveTimer = 0;
		if( this.pos.x < gfx.ScreenWidth / 2 && amount.x > 0 )
		{
			this.pos.Add( new Vec2( this.size.x,0 ) );
		}
		else if( this.pos.x > gfx.ScreenWidth / 2 && amount.x < 0 )
		{
			this.pos.Add( new Vec2( -this.size.x,0 ) );
		}
		else if( this.pos.y < gfx.ScreenHeight / 2 && amount.y > 0 )
		{
			this.pos.Add( new Vec2( 0,this.size.y ) );
		}
		else if( this.pos.y > gfx.ScreenHeight / 2 && amount.y < 0 )
		{
			this.pos.Add( new Vec2( 0,-this.size.y ) );
		}
		else
		{
			this.pos.Add( area.Move( amount.GetNormalized() ).GetMultiplied( this.size.x ) );
		}
		
		// menu.Close();
		area.CloseMenus();
	}
}