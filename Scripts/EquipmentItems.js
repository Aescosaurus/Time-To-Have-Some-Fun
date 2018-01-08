function EquipmentItems()
{
	function Item( name,sprite,defense,damage,speed,resource )
	{
		this.name = name;
		this.sprite = sprite;
		this.defense = defense;
		this.damage = damage;
		this.speed = speed;
		this.resource = resource;
	}
	// 
	let items = [];
	// 
	this.GenerateItems=( gfx,pResources )=>
	{
		// Try to keep item names under 10 characters, please.
		//  Over 10 chars and it takes up too much space in menus.
		items.push( new Item( "NULL",
			gfx.LoadImage( "Images/MenuItems/Rock.png" ),
			0,0,0,"NULL" ) );
		items.push( new Item( "Pajamas",
			gfx.LoadImage( "Images/EquipmentItems/Pajamas.png" ),
			1,0,0,"NULL" ) );
		items.push( new Item( "Cute Socks",
			gfx.LoadImage( "Images/EquipmentItems/CuteSocks.png" ),
			0,0,1,"NULL" ) );
		
		// Rock stuff.
		items.push( new Item( "Rock Boots",
			gfx.LoadImage( "Images/EquipmentItems/RockBoots.png" ),
			2,0,-1,"rocks" ) ); // From 1,0,-1
		items.push( new Item( "Rockin Hat",
			gfx.LoadImage( "Images/EquipmentItems/RockinHat.png" ),
			1,0,0,"rocks" ) );
		items.push( new Item( "Rock Pop",
			gfx.LoadImage( "Images/EquipmentItems/RockPop.png" ),
			-1,1,1,"rocks" ) );
		items.push( new Item( "Sharp Rock",
			gfx.LoadImage( "Images/EquipmentItems/SharpRock.png" ),
			-1,2,0,"rocks" ) );
		
		// Grass Stuff
		items.push( new Item( "Grass Top",
			gfx.LoadImage( "Images/EquipmentItems/GrassTop.png" ),
			0,-1,2,"grass" ) );
	}
	
	this.GetItem=( name )=>
	{
		for( let i in items )
		{
			if( items[i].name == name )
			{
				return items[i];
			}
		}
		
		return items[0];
	}
	
	this.GetRandomItem=()=>
	{
		return( items[Random.RangeI( 3,items.length - 1 )] );
	}
}