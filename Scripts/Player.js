function Player( gfx )
{
	function Stats()
	{
		this.level = 1;
		this.experience = 0;
		this.defense = 0;
		this.damage = 0;
		this.speed = 0;
		// 
		this.Verify=()=>
		{
			if( this.experience > 255 )
			{
				++this.level;
				this.experience = 0;
			}
			
			this.level = Math.min( Math.max( this.level,0 ),255 );
			this.defense = Math.min( Math.max( this.defense,0 ),255 );
			this.damage = Math.min( Math.max( this.damage,0 ),255 );
			this.speed = Math.min( Math.max( this.speed,0 ),255 );
		}
	}
	
	function Resources()
	{
		this.rocks = 0;
		this.grass = 0;
		// 
		this.Verify = function()
		{
			this.rocks = Math.min( Math.max( this.rocks,0 ),255 );
			this.grass = Math.min( Math.max( this.grass,0 ),255 );
		}
		
		this.GetResource=( strName )=>
		{
			// TODO: Find a better way to do this before adding more.
			if( strName == "rocks" )
			{
				return this.rocks;
			}
			else if( strName == "grass" )
			{
				return this.grass;
			}
		}
		
		this.UseUp=( strName,amount )=>
		{
			if( strName == "rocks" )
			{
				this.rocks -= amount;
			}
			else if( strName == "grass" )
			{
				this.grass -= amount;
			}
			
			this.Verify();
		}
	}
	// 
	GameObject.call( this );
	this.pos = new Vec2( gfx.ScreenWidth / 2,gfx.ScreenHeight / 2 );
	
	const sts = new Stats();
	const res = new Resources();
	
	const timeToMove = 12;
	let moveTimer = 0;
	let lastKey = '\0';
	
	let myMenu;
	
	let isHighlighted = false;
	let canOpenMenu = false;
	
	let lookDir = new Vec2( 0,0 );
	
	let item1;
	let item2;
	// 
	this.Start=( menu,equips )=>
	{
		menu.UpdateStats( sts );
		sts.defense = 1;
		sts.damage = 1;
		sts.speed = 1;
		sts.Verify();
		
		menu.UpdateResources( res );
		
		item1 = equips.GetItem( "Pajamas" );
		item2 = equips.GetItem( "Cute Socks" );
		
		menu.UpdateItem1( item1 );
		menu.UpdateItem2( item2 );
		
		myMenu = menu;
	}
	
	this.Update=( kbd,ms,area,menu )=>
	{
		isHighlighting = ( new Rect( this.pos.x - this.size.x / 2,this.pos.y - this.size.y / 2,
			this.size.x,this.size.y ).Contains( ms.GetPos() ) );
		
		if( !kbd.KeyDown( lastKey ) )
		{
			lastKey = '\0';
		}
		
		if( kbd.KeyDown( 27 ) )
		{
			menu.Close();
			area.CloseMenus();
		}
		
		moveTimer += sts.speed;
		if( ( moveTimer > 255 || lastKey == '\0' ) )
		{
			if( kbd.KeyDown( 'W' ) )
			{
				this.Move( new Vec2( 0,-sts.speed ),area,menu );
				lookDir = new Vec2( 0,-1 );
				lastKey = 'W';
			}
			else if( kbd.KeyDown( 'S' ) )
			{
				this.Move( new Vec2( 0,sts.speed ),area,menu );
				lookDir = new Vec2( 0,1 );
				lastKey = 'S';
			}
			else if( kbd.KeyDown( 'A' ) )
			{
				this.Move( new Vec2( -sts.speed,0 ),area,menu );
				lookDir = new Vec2( -1,0 );
				lastKey = 'A';
			}
			else if( kbd.KeyDown( 'D' ) )
			{
				this.Move( new Vec2( sts.speed,0 ),area,menu );
				lookDir = new Vec2( 1,0 );
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
	
	this.Draw=( gfx )=>
	{
		// gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ),this.size,"#0FF" );
		if( isHighlighting )
		{
			const offset = new Vec2( 3,3 );
			gfx.DrawRect( this.pos.GetSubtracted( this.size.GetDivided( 2 ) )
				.GetSubtracted( offset ),this.size
				.GetAdded( offset.GetMultiplied( 2 ) ),"#FFF" );
		}
		gfx.DrawGrad( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ),
			this.size,[ "#07F","#0FF" ] );
	}
	
	this.Move=( amount,area,menu )=>
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
		
		menu.Close();
		area.CloseMenus();
	}
	
	this.ReplaceItem=( nItem,equipment )=>
	{
		if( nItem == 1 )
		{
			item1 = equipment;
		}
		else if( nItem == 2 )
		{
			item2 = equipment;
		}
		else
		{
			if( Random.RangeI( 0,10 ) > 7 )
			{ // It is harder to replace item1 than item2.
				item1 = equipment;
			}
			else
			{
				item2 = equipment;
			}
		}
		
		// console.log( item1 );
		
		myMenu.UpdateItem1( item1 );
		myMenu.UpdateItem2( item2 );
	}
	
	this.GetStats=()=>
	{
		return sts;
	}
	
	this.GetResources=()=>
	{
		return res;
	}
	
	this.GetSelectRect=()=>
	{
		return( new Rect( this.pos.GetSubtracted( this.size.GetDivided( 2 ) ).x +
			( lookDir.x * this.size.x ),
			this.pos.GetSubtracted( this.size.GetDivided( 2 ) ).y +
			( lookDir.y * this.size.y ),this.size.x,this.size.y ) );
		
		// return( new Rect( this.pos.x + lookDir.x,this.pos.y + lookDir.y,
		// 	this.size.x,this.size.y ) );
	}
}