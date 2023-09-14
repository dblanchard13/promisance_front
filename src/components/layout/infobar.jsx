import { Paper, Grid, Text, Center, Progress } from '@mantine/core'
import { eraArray } from '../../config/eras'
import { Mountains, Coins, Scales, ForkKnife, Brain, Heart, GitBranch } from "@phosphor-icons/react"
import { useEffect, useState, useRef } from 'react'
import classes from './numberChange.module.css';
import { ROUND_END, ROUND_START } from '../../config/config'

const AnimateNumberChange = ({ number, type }) =>
{
	const [prevNumber, setPrevNumber] = useState(number);
	const numberDisplayRef = useRef(null);

	useEffect(() =>
	{
		if (number !== prevNumber) {
			const clas = getNumberClassName();
			setPrevNumber(number);

			// Apply the class to trigger the animation
			numberDisplayRef.current.classList.add(clas);

			// Remove the class after the animation duration to reset for the next change
			setTimeout(() =>
			{
				numberDisplayRef.current.classList.remove(clas);
			}, 1000); // Duration of the 'fadeBack' animation defined in CSS (1s)
		}
	}, [number, prevNumber]);

	const getNumberClassName = () =>
	{
		if (number > prevNumber) {
			return classes.increased;
		} else if (number < prevNumber) {
			return classes.decreased;
		}
		return 'same';
	};

	return (
		<Text align='center' ref={numberDisplayRef} className={classes.numberDisplay}>
			{type === 'networth' || type === 'cash' ? '$' : ''}{number.toLocaleString()}{type === 'health' ? '%' : ''}
		</Text>
	);
};

const now = new Date()
let roundLength = ROUND_END - ROUND_START
let roundProgress = now.getTime() - ROUND_START
let roundPercent = roundProgress / roundLength * 100
// console.log(roundPercent)

export default function InfoBar({ data })
{
	// console.log(data.empire)
	const empire = data

	return (
		<Paper shadow='xs' radius='xs' withBorder pb='xs' >
			<Progress color={eraArray[empire.era].color} value={roundPercent} size='xs' radius={0} mb='xs' />
			<Grid justify="space-between" grow columns={19}>
				<Grid.Col span={2}>
					<Center>
						<GitBranch size={20} color={eraArray[empire.era].color} />
						<Text weight='bold' align='center' color={eraArray[empire.era].color} ml={1}>
							Turns
						</Text>
					</Center>

					<AnimateNumberChange type='turns' number={empire.turns} />
				</Grid.Col>
				<Grid.Col span={3}>
					<Center>
						<Scales size={20} color={eraArray[empire.era].color} />
						<Text weight='bold' align='center' color={eraArray[empire.era].color} ml={2}>
							Net Worth
						</Text>
					</Center>
					<AnimateNumberChange type='networth' number={empire.networth} />
				</Grid.Col>
				<Grid.Col span={3}>
					<Center>
						<Mountains size={20} color={eraArray[empire.era].color} />
						<Text weight='bold' align='center' color={eraArray[empire.era].color} ml={2}>
							Land
						</Text>
					</Center>

					<AnimateNumberChange type='land' number={empire.land} />
				</Grid.Col>
				<Grid.Col span={3}>
					<Center>
						<Coins size={20} color={eraArray[empire.era].color} />
						<Text weight='bold' align='center' color={eraArray[empire.era].color} ml={2}>
							Money
						</Text>
					</Center>

					<AnimateNumberChange type='cash' number={empire.cash} />
				</Grid.Col>
				<Grid.Col span={3}>
					<Center>
						<ForkKnife size={20} color={eraArray[empire.era].color} />
						<Text weight='bold' align='center' color={eraArray[empire.era].color} ml={2}>
							{eraArray[empire.era].food}
						</Text>
					</Center>

					<AnimateNumberChange type='food' number={empire.food} />
				</Grid.Col>
				<Grid.Col span={3}>
					<Center>
						<Brain size={20} color={eraArray[empire.era].color} />
						<Text weight='bold' align='center' color={eraArray[empire.era].color} ml={2}>
							{eraArray[empire.era].runes}
						</Text>
					</Center>

					<AnimateNumberChange type='runes' number={empire.runes} />
				</Grid.Col>
				<Grid.Col span={2}>
					<Center>
						<Heart size={20} color={eraArray[empire.era].color} />
						<Text weight='bold' align='center' color={eraArray[empire.era].color} ml={2}>
							Health
						</Text>
					</Center>
					<AnimateNumberChange type='health' number={empire.health} />
				</Grid.Col>

			</Grid>
		</Paper>
	)
}
