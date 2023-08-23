import
{
	Title,
	Card,
	SimpleGrid,
	Grid,
	Text,
	Group, Col, Avatar
} from '@mantine/core'
import { useSelector } from 'react-redux'

import { eraArray } from '../config/eras'
import { raceArray } from '../config/races'

import { calcSizeBonus, calcPCI, explore, calcFinances, calcProvisions, offense, defense } from '../functions/functions'
import NetProduced from './utilities/NetProduced'

const RaceBonus = ({ value }) =>
{
	// console.log(value)
	let color = 'green'
	if (value < 0) {
		color = 'red'
	}

	return (
		<span style={{ color: color }}>{value > 0 && '+'}{value}%</span>
	)
}

// finish overview page
// Show race details
// Show era details

export default function Overview()
{
	const { empire } = useSelector((state) => state.empire)

	let size = calcSizeBonus(empire)
	// console.log(size)

	let cpi = calcPCI(empire)

	const newLand = explore(empire)

	const { income, expenses, loanpayed } = calcFinances(cpi, empire, size)

	// // takes place of calcFinances function
	// let income = Math.round(
	// 	(cpi *
	// 		(empire.tax / 100) *
	// 		(empire.health / 100) *
	// 		empire.peasants +
	// 		empire.bldCash * 500) / size
	// )

	// // let loan = Math.round(empire.loan / 200)

	// let expenses = Math.round(
	// 	empire.trpArm * 1 +
	// 	empire.trpLnd * 2.5 +
	// 	empire.trpFly * 4 +
	// 	empire.trpSea * 7 +
	// 	empire.land * 8 +
	// 	empire.trpWiz * 0.5
	// )

	// // console.log(empire.loan)
	// let loanpayed = 0
	// if (empire.loan > 0) {
	// 	loanpayed = Math.min(Math.round(empire.loan / 200), (income - expenses))
	// }
	// console.log(loanpayed)
	// let expensesBonus = Math.min(
	// 	0.5,
	// 	(raceArray[empire.race].mod_expenses + 100) / 100 -
	// 	1 +
	// 	empire.bldCost / Math.max(empire.land, 1)
	// )

	// expenses -= Math.round(expenses * expensesBonus)

	// takes place of calcProvisions function
	// let production =
	// 	10 * empire.freeLand +
	// 	empire.bldFood *
	// 	85 *
	// 	Math.sqrt(1 - (0.75 * empire.bldFood) / Math.max(empire.land, 1))
	// production *= (100 + raceArray[empire.race].mod_foodpro) / 100

	// let foodpro = Math.round(production)

	// let consumption =
	// 	empire.trpArm * 0.05 +
	// 	empire.trpLnd * 0.03 +
	// 	empire.trpFly * 0.02 +
	// 	empire.trpSea * 0.01 +
	// 	empire.peasants * 0.01 +
	// 	empire.trpWiz * 0.25

	// consumption *= (100 + raceArray[empire.race].mod_foodcon) / 100

	// let foodcon = Math.round(consumption)
	const { foodpro, foodcon } = calcProvisions(empire)

	const oPower = offense(empire)

	const dPower = defense(empire)

	const race = raceArray[empire.race]
	const era = eraArray[empire.era]

	return (
		<main>
			<Title order={1} align='center' mb='sm'>
				Overview
			</Title>

			{empire && (
				<div>
					<Group spacing='sm' align='center' position='center' mb='sm'>
						<Card sx={{ width: '400px', minHeight: '285px' }}>
							<Group position='left' spacing={4}>
								<Avatar size="xs" src={empire.profileIcon} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.66)' }} />
								<Text weight={800} size='lg'>
									{empire.name} (#{empire.id})
								</Text>
							</Group>
							<SimpleGrid cols={2} spacing={1}>
								<Text>Turns:</Text>
								<Text align='right'>{empire.turns.toLocaleString()}{' '}({empire.storedturns} stored)</Text>
								<Text>Turns Used:</Text>
								<Text align='right'>{empire.turnsUsed.toLocaleString()}</Text>
								<Text>Health:</Text>
								<Text align='right'>{empire.health}%</Text>
								<Text>Networth:</Text>
								<Text align='right'>${empire.networth.toLocaleString()}</Text>
								<Text>Population:</Text>
								<Text align='right'>{empire.peasants.toLocaleString()}</Text>
								<Text>Race:</Text>
								<Text align='right'>{raceArray[empire.race].name}</Text>
								<Text>Era:</Text>
								<Text align='right'>{eraArray[empire.era].name}</Text>
							</SimpleGrid>
						</Card>

						<Card sx={{ width: '400px', minHeight: '285px' }}>
							<Text weight={800} size='lg'>Agriculture</Text>
							<SimpleGrid cols={2} spacing={1}>
								<Text>Food:</Text>
								<Text align='right'>{empire.food.toLocaleString()}</Text>
								<Text>Production: <RaceBonus value={race.mod_foodpro} /></Text>
								<Text align='right'>{foodpro.toLocaleString()}</Text>
								<Text>Consumption: <RaceBonus value={race.mod_foodcon} /></Text>
								<Text align='right'>{foodcon.toLocaleString()}</Text>
								<NetProduced title='Net' value={foodpro - foodcon} />

								<Text mt='md' weight={800} size='lg'>Other</Text>
								<Text></Text>
								<Text align='left'>Explore: <RaceBonus value={era.mod_explore + race.mod_explore} />
								</Text>
								<Text align='right'>+{newLand} acres</Text>
								<Text align='left'>Black Market: <RaceBonus value={race.mod_market} /></Text>
							</SimpleGrid>
						</Card>

						<Card sx={{ width: '400px', minHeight: '285px' }}>
							<Text weight={800} size='lg'>Economy</Text>
							<SimpleGrid cols={2} spacing={1}>
								<Text>Money:</Text>
								<Text align='right'>${empire.cash.toLocaleString()}</Text>
								<Text>Per Capita Income:</Text>
								<Text align='right'>${cpi.toLocaleString()}</Text>
								<Text>Income: <RaceBonus value={race.mod_income} /></Text>
								<Text align='right'>${income.toLocaleString()}</Text>
								<Text>Expenses: <RaceBonus value={race.mod_expenses} /></Text>
								<Text align='right'>${expenses.toLocaleString()}</Text>
								<Text>Loan Payment:</Text>
								<Text align='right'>${loanpayed.toLocaleString()}</Text>
								<NetProduced title='Net' value={income - expenses - loanpayed} money />
								<Text>Savings Balance:</Text>
								<Text align='right'>${empire.bank.toLocaleString()}</Text>
								<Text>Loan Balance:</Text>
								<Text align='right'>${empire.loan.toLocaleString()}</Text>

							</SimpleGrid>
						</Card>

						<Card sx={{ width: '400px', minHeight: '285px' }}>

							<Grid columns={16}>
								<Col span={8}>
									<Text weight={800} size='lg'>
										Land Division
									</Text>

									<Text>{eraArray[empire.era].bldpop}:</Text>
									<Text>{eraArray[empire.era].bldcash}:</Text>
									<Text>{eraArray[empire.era].bldcost}:</Text>
									<Text>{eraArray[empire.era].bldtrp}:</Text>
									<Text>{eraArray[empire.era].bldwiz}:</Text>
									<Text>{eraArray[empire.era].bldfood}:</Text>
									<Text>{eraArray[empire.era].blddef}:</Text>
									<Text>Unused Land:</Text>
									<Text>Total Land:</Text>
								</Col>
								<Col span={5}>
									<Text align='right'>Build Rate: </Text>
									<Text align='right'>{empire.bldPop.toLocaleString()}</Text>
									<Text align='right'>{empire.bldCash.toLocaleString()}</Text>
									<Text align='right'>{empire.bldCost.toLocaleString()}</Text>
									<Text align='right'>{empire.bldTroop.toLocaleString()}</Text>
									<Text align='right'>{empire.bldWiz.toLocaleString()}</Text>
									<Text align='right'>{empire.bldFood.toLocaleString()}</Text>
									<Text align='right'>{empire.bldDef.toLocaleString()}</Text>
									<Text align='right'>{empire.freeLand.toLocaleString()}</Text>
									<Text align='right'>{empire.land.toLocaleString()}</Text>
								</Col>
								<Col span={3}>
									<Text align='right'><RaceBonus value={race.mod_buildrate} /> </Text>
									<Text align='right'>{Math.round(empire.bldPop / empire.land * 100)}%</Text>
									<Text align='right'>{Math.round(empire.bldCash / empire.land * 100)}%</Text>
									<Text align='right'>{Math.round(empire.bldCost / empire.land * 100)}%</Text>
									<Text align='right'>{Math.round(empire.bldTroop / empire.land * 100)}%</Text>
									<Text align='right'>{Math.round(empire.bldWiz / empire.land * 100)}%</Text>
									<Text align='right'>{Math.round(empire.bldFood / empire.land * 100)}%</Text>
									<Text align='right'>{Math.round(empire.bldDef / empire.land * 100)}%</Text>
									<Text align='right'>{Math.round(empire.freeLand / empire.land * 100)}%</Text>
									<Text align='right'> </Text>
								</Col>
							</Grid>
						</Card>
						<Card sx={{ width: '400px', minHeight: '285px' }}>


							<Grid columns={14}>
								<Col span={7}>
									<Text weight={800} size='lg'>
										Military
									</Text>
									<Text>{eraArray[empire.era].trparm}:</Text>
									<Text>{eraArray[empire.era].trplnd}:</Text>
									<Text>{eraArray[empire.era].trpfly}:</Text>
									<Text>{eraArray[empire.era].trpsea}:</Text>

									<Text> </Text>
									<Text mt='sm'>Off Power: <RaceBonus value={race.mod_offense} /></Text>
									<Text>Def Power: <RaceBonus value={race.mod_defense} /></Text>
									<Text mt='sm'>{eraArray[empire.era].trpwiz}: <RaceBonus value={race.mod_magic} /></Text>
									<Text>{eraArray[empire.era].runes}: <RaceBonus value={race.mod_runepro + era.mod_runepro} /></Text>
								</Col>
								<Col span={7}>
									<Text align='right'>Industry: <RaceBonus value={race.mod_industry + era.mod_industry} /></Text>
									<Text align='right'>{empire.trpArm.toLocaleString()}</Text>
									<Text align='right'>{empire.trpLnd.toLocaleString()}</Text>
									<Text align='right'>{empire.trpFly.toLocaleString()}</Text>
									<Text align='right'>{empire.trpSea.toLocaleString()}</Text>

									<Text align='right'> </Text>
									<Text align='right' mt='sm'>{oPower.toLocaleString()}</Text>
									<Text align='right'>{dPower.toLocaleString()}</Text>
									<Text align='right' mt='sm'>{empire.trpWiz.toLocaleString()}</Text>
									<Text align='right' >{empire.runes.toLocaleString()}</Text>
								</Col>

							</Grid>
						</Card>
						<Card sx={{ width: '400px', minHeight: '285px' }}>
							<Text weight={800} size='lg'>
								Relations
							</Text>
							<Grid columns={14}>
								<Col span={7}>
									<Text>Member of Clan:</Text>
									<Text>Allies:</Text>
									<Text>Enemies:</Text>

									<Text mt='sm'>Offensive Actions:</Text>
									<Text>Defenses:</Text>
									{/* <Text>Kills:</Text> */}
								</Col>
								<Col span={7}>
									<Text align='right'>None</Text>
									<Text align='right'>None</Text>
									<Text align='right'>None</Text>

									<Text align='right' mt='sm'>{empire.offSucc} ({Math.round(empire.offSucc / empire.offTotal * 100)}%)</Text>
									<Text align='right'>{empire.defSucc} ({Math.round(empire.defSucc / empire.defTotal * 100)}%)</Text>
									{/* <Text align='right'>{empire.kills}</Text> */}
								</Col>
							</Grid>
						</Card>
					</Group>

				</div>
			)}
		</main >
	)
}
