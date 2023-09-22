import
{
    Center,
    Title,
    NumberInput,
    Button,
    Select,
    Text,
    Stack
} from '@mantine/core'
import { useForm } from '@mantine/form'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { empireLoaded } from '../../store/empireSlice'
import { clearResult, setResult } from '../../store/turnResultsSlice'
import { forwardRef } from 'react'
import { getPower_self, baseCost } from '../../functions/functions'

import { eraArray } from '../../config/eras'
import { FavoriteButton } from '../utilities/maxbutton'

// DONE: show rune cost for spells, show current magic power, show required magic power for spells

export default function MagicCenter()
{
    const { empire } = useSelector((state) => state.empire)

    const dispatch = useDispatch()

    const form = useForm({
        initialValues: {
            empireId: empire.id,
            type: 'magic',
            number: 0,
        },

        validationRules: {
            number: (value) => value <= Math.floor(empire.turns / 2) && value > 0,
        },

        errorMessages: {
            number: "Can't cast spell that many times",
        },
    })

    const loadEmpireTest = async () =>
    {
        try {
            const res = await Axios.get(`/empire/${empire.uuid}`)
            // console.log(res.data)
            dispatch(empireLoaded(res.data))
        } catch (error) {
            console.log(error)
        }
    }

    const doMagic = async (values) =>
    {
        // console.log(values)
        try {
            const res = await Axios.post('/magic', values)
            // console.log(res.data)
            dispatch(setResult(res.data))
            window.scroll({ top: 0, behavior: 'smooth' })
            loadEmpireTest()
        } catch (error) {
            console.log(error)
        }
    }

    const magicPower = getPower_self(empire)

    const SelectItem = forwardRef(
        ({ label, power, cost, ...others }, ref) => (
            <div ref={ref} {...others}>
                <div>
                    <Text size='md'>{label}</Text>
                    <Text size='xs'>Power: {power}</Text>
                    <Text size='xs'>Cost: {cost.toLocaleString()} {eraArray[empire.era].runes}</Text>
                </div>
            </div>
        )
    );

    // check era to see if they can advance or regress
    const eraCheck = (empire) =>
    {
        let nextEra
        if (eraArray[empire.era].era_next !== -1) {
            nextEra = eraArray[eraArray[empire.era].era_next].name
        } else { nextEra = null }

        let canAdvance
        if (nextEra) {
            canAdvance = true
        } else canAdvance = false

        let prevEra
        if (eraArray[empire.era].era_prev !== -1) {
            prevEra = eraArray[eraArray[empire.era].era_prev].name
        } else { prevEra = null }

        let canRegress
        if (prevEra) {
            canRegress = true
        } else canRegress = false

        return { nextEra, canAdvance, prevEra, canRegress }
    }

    const { nextEra, canAdvance, prevEra, canRegress } = eraCheck(empire)


    return (
        <section >
            <Center>
                <Stack spacing='sm' align='center'>
                    <img src='/images/magic.webp' height='200' style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '10px' }} alt='magic center' />
                    <Title order={1} align='center'>
                        Magic Center <FavoriteButton empire={empire} title='MagicCenter' />
                    </Title>
                    <Text align='center'>
                        Cast spells on yourself to generate food, money, and change eras. Spells take two turns to cast.
                    </Text>
                    <Text align='center'>
                        Your current magic power is {magicPower}.
                    </Text>
                    <form onSubmit={form.onSubmit((values) =>
                    {
                        // console.log(values)
                        dispatch(clearResult)
                        doMagic(values)
                    })}>
                        <Stack spacing='sm' align='center'>
                            <Select
                                label="Select Spell to Cast"
                                placeholder="Pick one"
                                required
                                itemComponent={SelectItem}
                                data={[
                                    { value: 0, label: 'Spell Shield', power: 15, cost: Math.ceil(baseCost(empire) * 4.9) },
                                    { value: 1, label: 'Cornucopia', power: 30, cost: Math.ceil(baseCost(empire) * 17) },
                                    { value: 2, label: 'Tree of Gold', power: 30, cost: Math.ceil(baseCost(empire) * 17.5) },
                                    { value: 5, label: 'Open Time Gate', power: 75, cost: Math.ceil(baseCost(empire) * 20) },
                                    { value: 6, label: 'Close Time Gate', power: 80, cost: Math.ceil(baseCost(empire) * 14.5) },
                                    { value: 3, label: `Advance to ${nextEra}`, power: 90, cost: Math.ceil(baseCost(empire) * 47.5), disabled: !canAdvance },
                                    { value: 4, label: `Regress to ${prevEra}`, power: 90, cost: Math.ceil(baseCost(empire) * 47.5), disabled: !canRegress },

                                ]}
                                {...form.getInputProps('spell')}
                            />
                            <NumberInput
                                label={`Cast Spell How Many Times?`}
                                min={0}
                                defaultValue={0}
                                stepHoldDelay={500}
                                stepHoldInterval={100}
                                max={empire.turns / 2}
                                {...form.getInputProps('number')}
                            />

                            <Button color='grape' type='submit'>
                                Cast Spell
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Center>
        </section>
    )
}