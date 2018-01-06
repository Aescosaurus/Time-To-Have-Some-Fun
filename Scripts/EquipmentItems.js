function EquipmentItems()
{
	function Item( name,sprite,defense,damage,speed )
	{
		this.name = name;
		this.sprite = sprite;
		this.defense = defense;
		this.damage = damage;
		this.speed = speed;
	}
	// 
	let items = [];
	// 
	this.GenerateItems=( gfx )=>
	{
		// Try to keep item names under 10 characters, please.
		//  Over 10 chars and it takes up too much space in menus.
		items.push( new Item( "NULL",
			gfx.LoadImage( "Images/MenuItems/Rock.png" ),
			0,0,0 ) );
		items.push( new Item( "Pajamas",
			gfx.LoadImage( "Images/EquipmentItems/Pajamas.png" ),
			1,0,0 ) );
		items.push( new Item( "Cute Socks",
			gfx.LoadImage( "Images/EquipmentItems/CuteSocks.png" ),
			0,0,1 ) );
		items.push( new Item( "Rock Boots",
			gfx.LoadImage( "Images/EquipmentItems/RockBoots.png" ),
			2,0,-1 ) ); // From 1,0,-1
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
		return( items[Random.RangeI( 1,items.length - 1 )] );
	}
}