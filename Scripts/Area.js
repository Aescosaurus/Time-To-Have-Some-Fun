function Area( gfx,equips )
{
	function Tile()
	{
		const Deviate=( hexChar,maxDist )=>
		{
			if( maxDist % 2 != 0 )
			{
				maxDist = Math.floor( maxDist + 1 );
			}
			let hexChars = [ 0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F' ];
			
			let spot = 0;
			for( let i = 0; i < hexChars.length; ++i )
			// for( let i in hexChars )
			{
				if( hexChar == hexChars[i] )
				{
					spot = i;
				}
			}
			
			if( spot - maxDist / 2 < 0 )
			{
				spot = maxDist / 2;
			}
			if( spot + maxDist / 2 > hexChars.length - 1 )
			{
				spot = hexChars.length - ( maxDist / 2 + 1 );
			}
			
			return hexChars[Random.RangeI( spot - maxDist / 2,spot + maxDist / 2 )];
		}
		// 
		this.color = "#";
		this.img = -1;
		// 
		this.Start=( refColor )=>
		{ // Make sure refColor has a # and 6 chars after, not 3!
			let refArray = refColor.split( '' );
			refArray.splice( 0,1 );
			for( let i = 0; i < 6; ++i )
			{
				this.color += Deviate( refArray[i],2 );
			}
			
			if( Random.RangeI( 0,100 ) > 95 )
			{
				let flora = [];
				for( let i = 0; i < 2; ++i )
				{
					flora.push( "Images/Flora/Flora" + i + ".png" );
				}
				
				this.img = gfx.LoadImage( flora
					[Random.RangeI( 0,flora.length - 1 )] );
			}
		}
		
		this.GetColor=()=>
		{
			return this.color;
		}
		
		this.GetImg=()=>
		{
			return this.img;
		}
		
		this.HasImg=()=>
		{
			return( this.img > -1 );
		}
	}
	// 
	// GameObject.call( this );
	
	const sizeMultiplier = 6; // From 5.
	const tileSize = 50;
	const size = new Vec2( gfx.ScreenWidth * sizeMultiplier / tileSize,
		gfx.ScreenWidth * sizeMultiplier / tileSize,true );
	
	let tiles = [];
	let rockManager = new OutcroppingManager( gfx );
	let tradesManager = new TraderManager( gfx,equips );
	
	let drawOffset = new Vec2( 27,27 ); // I measured this by hand...
	// Oh /\ /\ /\ is where the player starts btw,
	//  kinda in the middle of the map.
	// 
	this.Start=()=>
	{
		for( let y = 0; y < size.y; ++y )
		{
			for( let x = 0; x < size.x; ++x )
			{
				tiles.push( new Tile() );
				// Offset controls direction and steepness of tile distribution.
				const offset = 2;
				if( tiles.length - size.x - offset > 0 && Random.RangeI( 0,10 ) > 5 )
				{
					tiles[tiles.length - 1]
						.Start( tiles[tiles.length - size.x - offset]
						.GetColor() );
				}
				else if( tiles.length - 2 > 0 )
				{
					tiles[tiles.length - 1]
					.Start( tiles[tiles.length - 2].GetColor() );
				}
				else
				{
					tiles[tiles.length - 1].Start( "#00FF00" );
				}
				
				// Maybe this can use map specified values later?
				if( Random.RangeI( 0,1000 ) > 990 )
				{
					// rocks.push( new Outcropping( new Vec2( x,y ) ) );
					rockManager.Add( new Vec2( x,y )
						.GetSubtracted( size.GetDivided( 2.0 ) )
						.GetMultiplied( tileSize ) );
				}
				else if( Random.RangeI( 0,1000 ) > 995 )
				{
					tradesManager.Add( new Vec2( x,y )
						.GetSubtracted( size.GetDivided( 2.0 ) )
						.GetMultiplied( tileSize ) );
				}
			}
		}
		
		tradesManager.Start();
	}
	
	this.Update=( kbd,ms,player,miningActivity )=>
	{
		const selectRect = player.GetSelectRect();
		// console.log( tradesManager.HasSelectedTrader() );
		rockManager.Update( kbd,ms,selectRect,miningActivity,
			( !tradesManager.HasSelectedTrader() ) );
		tradesManager.Update( kbd,ms,selectRect,
			( !rockManager.HasSelectedRock() ),
			player.GetResources() );
		
		// if( tradesManager.GetTakenDeal().HasBought() )
		// {
		// 	player.ReplaceItem( 1,tradesManager.GetTakenDeal() );
		// 	
		// 	// tradesManager.DeleteActiveDeal();
		// }
		
		if( tradesManager.HasActiveDeal() )
		{
			player.ReplaceItem( 12345,tradesManager.GetActiveDeal().GetReward() );
		}
		
		// if( rockManager.HasSelectedRock() )
		// {
		// 	tradesManager.CloseMenu();
		// }
		// else if( tradesManager.HasSelectedTrader() )
		// {
		// 	rockManager.CloseMenu();
		// }
	}
	
	this.Draw=( gfx )=>
	{
		for( let y = 0; y < gfx.ScreenHeight / tileSize; ++y )
		{
			for( let x = 0; x < gfx.ScreenWidth / tileSize; ++x )
			{
				gfx.DrawRect( new Vec2( x * tileSize,y * tileSize ),
					new Vec2( tileSize,tileSize ),
					this.GetTile( new Vec2( x + drawOffset.x,
					y + drawOffset.y ) ).GetColor() );
				
				if( this.GetTile( new Vec2( x + drawOffset.x,
					y + drawOffset.y ) ).HasImg() )
				{
					gfx.DrawImage( this.GetTile( new Vec2( x + drawOffset.x,
						y + drawOffset.y ) ).GetImg(),new Vec2( x * tileSize,
						y * tileSize ) );
				}
				
				// Make sure not to draw this 9 bumillion HECKING TIMES ARG!!! D:<
				// rockManager.Draw( gfx );
			}
		}
		
		if( rockManager.HasSelectedRock() )
		{
			tradesManager.Draw( gfx );
			rockManager.Draw( gfx );
		}
		else
		{
			rockManager.Draw( gfx );
			tradesManager.Draw( gfx );
		}
	}
	
	this.Move=( amount )=>
	{
		let pushbackAmount = new Vec2( 0,0 );
		drawOffset.Add( amount );
		
		let delta = new Vec2( 0,0 );
		if( drawOffset.x < 0 )
		{
			// drawOffset.Subtract( new Vec2( amount.x,0 ) );
			delta.Add( new Vec2( amount.x,0 ) );
			pushbackAmount.x = -1;
		}
		if( drawOffset.x > sizeMultiplier * 9 )
		{
			// drawOffset.Subtract( new Vec2( amount.x,0 ) );
			delta.Add( new Vec2( amount.x,0 ) );
			pushbackAmount.x = 1;
		}
		if( drawOffset.y < 0 )
		{
			// drawOffset.Subtract( new Vec2( 0,amount.y ) );
			delta.Add( new Vec2( 0,amount.y ) );
			pushbackAmount.y = -1;
		}
		if( drawOffset.y > sizeMultiplier * 9 )
		{
			// drawOffset.Subtract( new Vec2( 0,amount.y ) );
			delta.Add( new Vec2( 0,amount.y ) );
			pushbackAmount.y = 1;
		}
		
		drawOffset.Subtract( delta );
		
		// for( let i = 0; i < rocks.length; ++i )
		// {
		// 	rocks[i].Move( amount.GetMultiplied( -1 ) );
		// 	rocks[i].Move( delta );
		// }
		rockManager.MoveAll( amount.GetMultiplied( -1 ).GetAdded( delta ) );
		tradesManager.MoveAll( amount.GetMultiplied( -1 ).GetAdded( delta ) );
		
		return pushbackAmount;
	}
	
	this.CloseMenus=()=>
	{
		rockManager.CloseMenu();
		tradesManager.CloseMenu();
	}
	
	this.GetTile=( posXY )=>
	{
		// if( posXY.y * size.x + posXY.x > size.x * size.y )
		// {
		// 	return tiles[tiles.length - 1];
		// }
		// if( posXY.y * size.x + posXY.x < 0 )
		// {
		// 	return tiles[0];
		// }
		return tiles[posXY.y * size.x + posXY.x];
	}
	
	this.PlaceIsBlocked=( blockedPos )=>
	{
		return( rockManager.IsBlocked( blockedPos ) );
	}
}