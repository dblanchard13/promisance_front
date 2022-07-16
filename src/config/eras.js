const ERA_PAST = {
	name: 'Past',
	peasants: 'Peasants',
	food: 'Grains',
	runes: 'Mana',
	trparm: 'Footmen',
	trplnd: 'Catapults',
	trpfly: 'Zeppelins',
	trpsea: 'Galleons',
	trpwiz: 'Wizards',
	bldpop: 'Huts',
	bldcash: 'Markets',
	bldtrp: 'Blacksmiths',
	bldcost: 'Keeps',
	bldwiz: 'Mage Towers',
	bldfood: 'Farms',
	blddef: 'Guard Towers',
	spell_spy: 'Crystal Ball',
	spell_blast: 'Fireball',
	spell_shield: 'Spell Shield',
	spell_storm: 'Storms',
	spell_runes: 'Lightning Strike',
	spell_struct: 'Wrath of Demons',
	spell_food: 'Cornucopia',
	spell_cash: 'Tree of Gold',
	spell_gate: 'Open Time Gate',
	spell_ungate: 'Close Time Gate',
	spell_fight: 'Magic User Fight',
	spell_steal: 'Embezzlement',
	spell_advance: 'Advance to Present',
	spell_regress: 'Regress',
	effectname_shield: 'Spell Shield',
	effectdesc_shield:
		'Your wizards have formed a magical barrier around your empire, reducing the effectiveness of magical attacks against you',
	effectname_gate: 'Time Gate',
	mod_explore: 0,
	mod_industry: -5,
	mod_runepro: 20,
	o_trparm: 1,
	d_trparm: 2,
	o_trplnd: 3,
	d_trplnd: 2,
	o_trpfly: 7,
	d_trpfly: 5,
	o_trpsea: 7,
	d_trpsea: 6,
	era_prev: -1,
	era_next: 1,
	color: 'indigo',
}

const ERA_PRESENT = {
	name: 'Present',
	peasants: 'Civilians',
	food: 'Nutrients',
	runes: 'Energy',
	trparm: 'Infantry',
	trplnd: 'Tanks',
	trpfly: 'Jets',
	trpsea: 'Battleships',
	trpwiz: 'Telepaths',
	bldpop: 'Apartments',
	bldcash: 'Business Centers',
	bldtrp: 'Factories',
	bldcost: 'Warehouses',
	bldwiz: 'PSI Centers',
	bldfood: 'Plantations',
	blddef: 'Bunkers',
	spell_spy: 'Mind Observation',
	spell_blast: 'Psionic Blast',
	spell_shield: 'Psionic Barrier',
	spell_storm: 'Storms',
	spell_runes: 'Lightning Strike',
	spell_struct: 'Rage of Angels',
	spell_food: 'Cornucopia',
	spell_cash: 'Tree of Gold',
	spell_gate: 'Open Time Gate',
	spell_ungate: 'Close Time Gate',
	spell_fight: 'Magic User Fight',
	spell_steal: 'Embezzlement',
	spell_advance: 'Advance to Future',
	spell_regress: 'Regress to Past',
	effectname_shield: 'Psionic Barrier',
	effectdesc_shield:
		'Your telepaths are projecting a barrier around your empire, reducing the effectiveness of magical attacks against you',
	effectname_gate: 'Time Gate',
	mod_explore: 40,
	mod_industry: 0,
	mod_runepro: 0,
	o_trparm: 2,
	d_trparm: 1,
	o_trplnd: 2,
	d_trplnd: 6,
	o_trpfly: 5,
	d_trpfly: 3,
	o_trpsea: 6,
	d_trpsea: 8,
	era_prev: 0,
	era_next: 2,
	color: 'green',
}

const ERA_FUTURE = {
	name: 'Future',
	peasants: 'Drones',
	food: 'Power Cells',
	runes: 'Bandwidth',
	trparm: 'Cyborgs',
	trplnd: 'Juggernauts',
	trpfly: 'Hovercrafts',
	trpsea: 'Dreadnoughts',
	trpwiz: 'Master AIs',
	bldpop: 'Giliads',
	bldcash: 'E-Commerce Sites',
	bldtrp: 'Replicators',
	bldcost: 'Storage Bays',
	bldwiz: 'Supercomputers',
	bldfood: 'Power Plants',
	blddef: 'Laser Turrets',
	spell_spy: 'High Orbit Blanket',
	spell_blast: 'Ion Storm',
	spell_shield: 'Plasma Shield',
	spell_storm: 'Storms',
	spell_runes: 'Lightning Strike',
	spell_struct: 'Nanotech Warriors',
	spell_food: 'Cornucopia',
	spell_cash: 'Tree of Gold',
	spell_gate: 'Open Time Gate',
	spell_ungate: 'Close Time Gate',
	spell_fight: 'Magic User Fight',
	spell_steal: 'Embezzlement',
	spell_advance: 'Advance',
	spell_regress: 'Regress to Present',
	effectname_shield: 'Plasma Shield ',
	effectdesc_shield:
		'A thin layer of ionized particles surrounds your empire, reducing the effectiveness of magical attacks against you.',
	effectname_gate: 'Time Gate',
	mod_explore: 80,
	mod_industry: 15,
	mod_runepro: 0,
	o_trparm: 1,
	d_trparm: 2,
	o_trplnd: 5,
	d_trplnd: 2,
	o_trpfly: 6,
	d_trpfly: 3,
	o_trpsea: 7,
	d_trpsea: 7,
	era_prev: 1,
	era_next: -1,
	color: 'orange',
}

export const eraArray = [ERA_PAST, ERA_PRESENT, ERA_FUTURE]
