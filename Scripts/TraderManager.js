function TraderManager( gfx,equips )
{
	function Trader( pos,id,equips )
	{
		function Menu( pos,size,id )
		{
			GameObject.call( this );
			this.pos = pos;
			this.size = size;
			
			let isHovering = false;
			
			let menuOpen = false;
			const menuRect = new Rect( gfx.ScreenWidth * 0.025,
				gfx.ScreenHeight * 0.57,
				gfx.ScreenWidth * 0.95,gfx.ScreenHeight * 0.415 );
			let canCloseMenu = false;
			let canOpenMenu = false;
			
			let dead = false;
			
			let xButton = new Rect( menuRect.x + menuRect.width - 40,menuRect.y,40,40 );
			let overXButton = false;
			const xButtonOut = gfx.LoadImage( "Images/MenuItems/XButton0.png" );
			const xButtonOver = gfx.LoadImage( "Images/MenuItems/XButton1.png" );
			
			const myId = id;
			
			const market = gfx.LoadImage( "Images/Traders/Trader1.png" );
			
			let overMenu = false;
			// 
			this.Update=( kbd,ms,selectRect )=>
			{
				isHovering = ( ( new Rect( this.pos.x,this.pos.y,
					this.size.x,this.size.y ) ).Contains( ms.GetPos() ) ||
					( new Rect( this.pos.x,this.pos.y,
					this.size.x,this.size.y ) ).Overlaps( selectRect ) );
				overXButton = ( xButton.Contains( ms.GetPos() ) );
				highlightingStart = ( new Rect( menuRect.x + 7,menuRect.y + 202,
					menuRect.width - 14,46 ) ).Contains( ms.GetPos() );
				yesIsHighlighted = ( new Rect( menuRect.x + 10,menuRect.y + 205,
					( menuRect.width - 14 ) / 2,40 ) ).Contains( ms.GetPos() );
				noIsHighlighted = ( new Rect( menuRect.x + ( menuRect.width - 14 ) / 2 + 10,menuRect.y + 205,
					( menuRect.width - 14 ) / 2 - 5,40 ) ).Contains( ms.GetPos() );
				drawAreYouSure = highlightingStart;
				overMenu = menuRect.Contains( ms.GetPos() );
				
				if( ( ms.IsDown() || kbd.KeyDown( 'E' ) ) &&
					isHovering && canOpenMenu )
				{
					menuOpen = true;
					canCloseMenu = false;
				}
				
				if( ms.IsDown() )
				{
					if( ( !menuRect.Contains( ms.GetPos() ) || overXButton ) &&
						canCloseMenu )
					{
						menuOpen = false;
					}
					
					if( highlightingStart && canStartMining )
					{
						if( yesIsHighlighted )
						{
							activity.Open();
							dead = true;
						}
						else if( noIsHighlighted )
						{
							// menuOpen = false;
						}
					}
				}
				
				// TODO: Consolidate all of this if possible.
				canCloseMenu = false;
				if( !ms.IsDown() && ( !isHovering || overXButton ) )
				{
					canCloseMenu = true;
				}
				
				canOpenMenu = false;
				if( isHovering && !ms.IsDown() )
				{
					canOpenMenu = true;
				}
				
				canStartMining = false;
				if( !ms.IsDown() && highlightingStart && menuOpen )
				{
					canStartMining = true;
				}
			}
			
			this.Draw=( gfx )=>
			{
				if( menuOpen )
				{
					if( overMenu )
					{
						gfx.DrawRect( new Vec2( menuRect.x - 5,menuRect.y - 5 ),
							new Vec2( menuRect.width + 10,menuRect.height + 10 ),
							"#FFF" );
					}
					gfx.DrawGrad( new Vec2( menuRect.x,menuRect.y ),
						new Vec2( menuRect.width,menuRect.height ),
						[ "#0EE","#4CC" ] );
					
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
					
					gfx.DrawText( new Vec2( menuRect.x + 5,menuRect.y + 30 ),
						"30PX Lucida Console","#FFF","Trader" + myId );
					
					// gfx.DrawRect( new Vec2( menuRect.x + 160,menuRect.y + 5 ),
					// 	new Vec2( 410,30 ),"#FFF" );
					gfx.DrawImage( market,new Vec2( menuRect.x + 160,menuRect.y + 5 ) );
				}
			}
			
			this.Close=()=>
			{
				menuOpen = false;
			}
			
			this.IsHovering=()=>
			{
				return isHovering;
			}
			
			this.IsOpen=()=>
			{
				return menuOpen;
			}
			
			this.WillKill=()=>
			{
				return dead;
			}
			
			this.GetPos=()=>
			{
				return( new Vec2( menuRect.x,menuRect.y ) );
			}
		}
		
		function Deal( pos,resource,amount,reward )
		{
			GameObject.call( this );
			this.pos = pos;
			this.size = new Vec2( 192,130 );
			
			const myRect = new Rect( this.pos.x,this.pos.y,
				this.size.x,this.size.y );
			let highlighted = false;
			let highlightColor = "#FFF";
			const colorResetTime = 40;
			let cResetTimer = 0;
			
			let canBuy = false;
			let bought = false;
			
			let amIHidden = false;
			
			const rocks = gfx.LoadImage( "Images/MenuItems/Rock.png" );
			const grass = gfx.LoadImage( "Images/MenuItems/Grass.png" );
			// 
			this.Update=( kbd,ms,selectRect,pResources,menuIsOpen )=>
			{
				if( !amIHidden )
				{
					highlighted = ( myRect.Overlaps( selectRect ) ||
						myRect.Contains( ms.GetPos() ) );
					
					if( !ms.IsDown() && highlighted && menuIsOpen )
					{
						canBuy = true;
					}
					
					if( !menuIsOpen || !highlighted )
					{
						canBuy = false;
					}
					
					if( ms.IsDown() && canBuy && highlighted )
					{
						if( pResources.GetResource( resource ) > amount )
						{
							bought = true;
							pResources.UseUp( resource,amount );
						}
						else
						{
							highlightColor = "#F00";
						}
					}
					
					if( highlightColor == "#F00" )
					{
						++cResetTimer;
						if( cResetTimer > colorResetTime ||
							!highlighted )
						{
							cResetTimer = 0;
							highlightColor = "#FFF";
						}
					}
				}
			}
			
			this.Draw=( gfx )=>
			{
				if( !amIHidden )
				{
					if( highlighted )
					{
						gfx.DrawRect( this.pos.GetSubtracted( new Vec2( 5,5 ) ),
							this.size.GetAdded( new Vec2( 10,10 ) ),
							highlightColor );
					}
					
					// gfx.DrawRect( this.pos,this.size,"#29E" );
					// gfx.DrawGrad( this.pos,this.size,
					// 	[ "#0CC","#2AB" ] );
					gfx.DrawRect( this.pos,this.size,"#5BD" );
					
					gfx.DrawImage( reward.sprite,this.pos.GetAdded( new Vec2( 5,5 ) ) );
					gfx.DrawText( this.pos.GetAdded( new Vec2( 35,25 ) ),
						"20PX Lucida Console","#FFF",
						Str.FirstUpperCase( reward.name ) );
					
					gfx.DrawImage( eval( resource ),
						this.pos.GetAdded( new Vec2( 5,5 + 40 ) ) );
					gfx.DrawText( this.pos.GetAdded( new Vec2( 40,30 + 40 ) ),
						"30PX Lucida Console","#FFF",amount );
					
					gfx.DrawText( this.pos.GetAdded( new Vec2( 10,100 ) ),
						"20PX Lucida Console","#888",
						reward.defense );
					gfx.DrawText( this.pos.GetAdded( new Vec2( 75,100 ) ),
						"20PX Lucida Console","#E21",
						reward.damage );
					gfx.DrawText( this.pos.GetAdded( new Vec2( 140,100 ) ),
						"20PX Lucida Console","#1E2",
						reward.speed );
				}
			}
			
			this.Hide=()=>
			{
				amIHidden = true;
			}
			
			this.IsHighlighted=()=>
			{
				return highlighted;
			}
			
			this.HasBought=()=>
			{
				return bought;
			}
			
			this.GetReward=()=>
			{
				return reward;
			}
		}
		// 
		GameObject.call( this );
		this.pos = pos;
		this.size = new Vec2( 50,50 );
		const myId = id;
		const traderImage = gfx.LoadImage( "Images/Traders/Trader0.png" );
		
		const m = new Menu( this.pos,this.size,myId );
		
		let willDestroy = false;
		
		let deals = [];
		// let takenDeal = { HasBought:()=>{ return false; } };
		// let takenDealId = -1;
		let boughtDeal;
		let hasBoughtDeal = false;
		// 
		this.Start=()=>
		{
			let itemName = equips.GetRandomItem().name;
			deals.push( new Deal( m.GetPos().GetAdded( new Vec2( 10,46 ) ),
				equips.GetItem( itemName ).resource,
				Random.DeviateI( 35,10 ),
				equips.GetItem( itemName ) ) );
			
			itemName = equips.GetRandomItem().name;
			deals.push( new Deal( m.GetPos().GetAdded( new Vec2( 212,46 ) ),
				equips.GetItem( itemName ).resource,
				Random.DeviateI( 35,10 ),
				equips.GetItem( itemName ) ) );
			
			itemName = equips.GetRandomItem().name;
			deals.push( new Deal( m.GetPos().GetAdded( new Vec2( 415,46 ) ),
				equips.GetItem( itemName ).resource,
				Random.DeviateI( 35,10 ),
				equips.GetItem( itemName ) ) );
		}
		
		this.Update=( kbd,ms,selectRect,noMenusOpen,pResources )=>
		{
			if( noMenusOpen )
			{
				m.Update( kbd,ms,selectRect );
			}
			
			if( m.WillKill() )
			{
				willDestroy = true;
			}
			
			if( m.IsOpen() )
			{
				for( let i in deals )
				{
					deals[i].Update( kbd,ms,selectRect,pResources,m.IsOpen() );
					
					if( deals[i].HasBought() )
					{
						deals[i].Hide();
						boughtDeal = deals[i];
						hasBoughtDeal = true;
						// takenDeal = deals[i];
						// takenDealId = i;
					}
				}
			}
		}
		
		this.Draw=( gfx )=>
		{
			if( m.IsHovering() )
			{
				const drawOffset = new Vec2( 3,3,true );
				gfx.DrawRect( this.pos.GetSubtracted( drawOffset ),
					this.size.GetAdded( drawOffset.GetMultiplied( 2 ) ),"#FFF" );
			}
			
			// gfx.DrawRect( this.pos,this.size,"#222" );
			// gfx.DrawGrad( this.pos,this.size,[ "#0FF","#0F0" ] );
			gfx.DrawImage( traderImage,this.pos );
			
			m.Draw( gfx );
			
			if( m.IsOpen() )
			{
				for( let i in deals )
				{
					deals[i].Draw( gfx );
				}
			}
		}
		
		this.Move=( amount )=>
		{
			this.pos.Add( amount );
		}
		
		this.CloseMenu=()=>
		{
			// menuOpen = false;
			m.Close();
		}
		
		this.DeleteMostRecentDeal=()=>
		{
			deals.splice( takenDealId,1 );
			takenDealId = -1;
			takenDeal = { HasBought:()=>{ return false; } };
		}
		
		this.GetPos=()=>
		{
			return this.pos;
		}
		
		this.IsSelected=()=>
		{
			return m.IsHovering();
		}
		
		this.HasMenuOpen=()=>
		{
			return m.IsOpen();
		}
		
		this.WillDest=()=>
		{
			return willDestroy;
		}
		
		this.HasBoughtItem=()=>
		{
			return hasBoughtDeal;
		}
		
		this.GetRect=()=>
		{
			return( new Rect( this.pos.x,this.pos.y,this.size.x,this.size.y ) );
		}
		
		this.GetTakenDeal=()=>
		{
			// if( takenDeal.HasBought() && takenDealId > 0 )
			// {
			// 	const toReturn = takenDeal;
			// 	deals.splice( takenDealId,1 );
			// 	takenDeal = { HasBought:()=>{ return false; } };
			// 	
			// 	return toReturn;
			// }
			
			return boughtDeal;
		}
	}
	// 
	let traders = [];
	let nTraders = 0;
	let mostRecentDeal;
	let hasDeal = false;
	// 
	this.Start=()=>
	{
		for( let i in traders )
		{
			traders[i].Start();
		}
	}
	
	this.Update=( kbd,ms,selectRect,noMenusOpen,pResources )=>
	{
		for( let i in traders )
		{
			traders[i].Update( kbd,ms,selectRect,noMenusOpen,pResources );
			
			if( traders[i].WillDest() || traders[i].HasBoughtItem() )
			{
				hasDeal = true;
				mostRecentDeal = traders[i].GetTakenDeal();
				traders.splice( i,1 );
			}
		}
	}
	
	this.Draw=( gfx )=>
	{
		// The highlighted thing is for the highlighting to not be covered.
		//  Also menuOpen draws on top of any highlighted thing.
		let highlighted = { Draw: function( gfx ){ let f = 2; } };
		let menuOpen = { Draw: function( gfx ){ let g = 2; } };
		for( let i in traders )
		{
			if( traders[i].IsSelected() )
			{
				highlighted = traders[i];
			}
			else if( traders[i].HasMenuOpen() )
			{
				menuOpen = traders[i];
			}
			else
			{
				traders[i].Draw( gfx );
			}
		}
		highlighted.Draw( gfx );
		menuOpen.Draw( gfx );
	}
	
	this.Add=( pos )=>
	{
		traders.push( new Trader( pos,nTraders++,equips ) );
	}
	
	this.MoveAll=( amount )=>
	{
		for( let i in traders )
		{
			traders[i].Move( amount.GetMultiplied( traders[i].size.x ) );
		}
	}
	
	this.CloseMenu=()=>
	{
		for( let i in traders )
		{
			traders[i].CloseMenu();
		}
	}
	
	this.HasSelectedTrader=()=>
	{
		for( let i in traders )
		{
			// if( traders[i].IsSelected() )
			if( traders[i].HasMenuOpen() )
			{
				// console.log( traders[i].HasMenuOpen() );
				return true;
			}
		}
		
		return false;
	}
	
	this.HasActiveDeal=()=>
	{
		return hasDeal;
	}
	
	this.GetActiveDeal=()=>
	{
		hasDeal = false;
		return mostRecentDeal;
	}
	
	// this.GetTakenDeal=()=>
	// {
	// 	for( let i in traders )
	// 	{
	// 		if( traders[i].GetTakenDeal().HasBought() )
	// 		{
	// 			return traders[i].GetTakenDeal();
	// 		}
	// 	}
	// 	
	// 	return( traders[0].GetTakenDeal() );
	// }
	// 
	// this.DeleteActiveDeal=()=>
	// {
	// 	for( let i in traders )
	// 	{
	// 		if( traders[i].GetTakenDeal().HasBought() )
	// 		{
	// 			traders[i].DeleteMostRecentDeal();
	// 		}
	// 	}
	// }
}