import
{
    Center,
    Title,
    Button,
    Select,
    Text,
    Stack,
    Card,
    Group,
    Loader,
    Accordion
} from '@mantine/core'
import { useEffect, useState, forwardRef } from 'react'
import { useForm } from '@mantine/form'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { empireLoaded } from '../../store/empireSlice'
import { setResult } from '../../store/turnResultsSlice'
import { eraArray } from '../../config/eras'
import { raceArray } from '../../config/races'
import { Mountains, Scales, Hourglass, Alien } from "@phosphor-icons/react"
import Intel from './intel'


export default function IntelCenter()
{
    const { empire } = useSelector((state) => state.empire)

    const dispatch = useDispatch()

    const [otherEmpires, setOtherEmpires] = useState()
    const [selectedEmpire, setSelectedEmpire] = useState('')
    const [intel, setIntel] = useState()

    const form = useForm({
        initialValues: {
            attackerId: empire.id,
            type: 'magic attack',
            defenderId: '',
            spell: 'spy'
        },

        validationRules: {
            number: (value) => empire.turns >= 2 && value > 0,
        },

        errorMessages: {
            number: "Not enough turns",
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

    useEffect(() =>
    {
        const loadOtherEmpires = async () =>
        {
            try {
                const res = await Axios.post(`/empire/otherEmpires`, { empireId: empire.empireId })
                let otherEmpires = res.data.map(({ name, empireId, land, era, race, networth }) => ({ name, empireId, land, era, race, networth }))

                let dataFormat = otherEmpires.map((empire) =>
                ({
                    value: empire.empireId.toLocaleString(),
                    land: empire.land.toLocaleString(),
                    networth: empire.networth.toLocaleString(),
                    race: raceArray[empire.race].name,
                    era: eraArray[empire.era].name,
                    name: empire.name,
                    empireId: empire.empireId,
                    label: `(#${empire.empireId}) ${empire.name}`
                })
                )
                // console.log(otherEmpires)
                setOtherEmpires(dataFormat)
            } catch (error) {
                console.log(error)
            }
        }
        loadOtherEmpires()
    }, [])

    const SelectItem = forwardRef(
        ({ land, era, empireId, name, race, networth, ...others }, ref) => (
            <div ref={ref} {...others}>
                <div>
                    <Text size='sm' weight='bold'>{name}(#{empireId}) </Text>
                    <Text size='sm'><Mountains /> {land} acres</Text>
                    <Text size='sm'><Scales /> ${networth}</Text>
                    <Text size='sm'><Hourglass /> {era}</Text>
                    <Text size='sm'><Alien /> {race}</Text>
                </div>
            </div>
        )
    );


    const sendSpellAttack = async (values) =>
    {
        try {
            const res = await Axios.post(`/magic/attack`, values)
            // console.log(res.data)
            dispatch(setResult([res.data]))
            loadEmpireTest()
        } catch (error) {
            console.log(error)
        }
    }


    // load intel
    useEffect(() =>
    {
        const loadIntel = async () =>
        {
            try {
                const res = await Axios.get(`/intel/${empire.id}`)
                // console.log(res.data)
                return res.data
            } catch (error) {
                console.log(error)
            }
        }
        loadIntel().then((data) => setIntel(data))
    }, [empire.turns])


    function generalLog(number, base)
    {
        return Math.log(base) / Math.log(number)
    }

    const calcSizeBonus = ({ networth }) =>
    {
        let net = Math.max(networth, 1)
        let size = Math.atan(generalLog(net, 1000) - 1) * 2.1 - 0.65
        size = Math.round(Math.min(Math.max(0.5, size), 1.7) * 1000) / 1000
        return size
    }

    const baseCost = (empire) =>
    {
        return (empire.land * 0.10) + 100 + (empire.bldWiz * 0.20) * ((100 + raceArray[empire.race].mod_magic) / 100) * calcSizeBonus(empire)
    }

    // console.log(intel)

    return (
        <section style={{ paddingTop: '1rem' }}>
            <Center>
                <Stack spacing='sm' align='center'>
                    <Title order={1} align='center'>
                        Intel Center
                    </Title>
                    <div>
                        Cast a spell to view another empire's stats. This will take two turns.
                    </div>
                    <Card sx={{ width: '300px' }}>
                        <Card.Section withBorder inheritPadding py="xs">
                            <Group position='apart'>
                                <Text weight={500}>Cast Spell:</Text>
                            </Group>
                        </Card.Section>
                        <Text align='left' py='xs'>
                            Ratio: 1x, Cost: {Math.ceil(baseCost(empire)).toLocaleString()}
                        </Text>
                        <Text align='center'>

                        </Text >
                        <form onSubmit={form.onSubmit((values) =>
                        {
                            console.log(values)
                            sendSpellAttack(values)
                            // dispatch(clearResult)
                        })}>
                            <Stack spacing='sm' align='center'>
                                {otherEmpires && (
                                    <Select
                                        searchable
                                        searchValue={selectedEmpire}
                                        onSearchChange={setSelectedEmpire}
                                        label="Select an Empire to Get Stats"
                                        placeholder="Pick one"
                                        withAsterisk
                                        itemComponent={SelectItem}
                                        data={otherEmpires}
                                        withinPortal
                                        sx={{ width: '100%' }}
                                        {...form.getInputProps('defenderId')}
                                    />
                                )}
                                <Button color='indigo' type='submit'>
                                    Cast Spell
                                </Button>
                            </Stack>
                        </form>
                    </Card>
                    {intel && intel.length > 0 ? (
                        <Accordion variant="separated" defaultValue={intel[0].uuid} sx={{
                            minWidth: 350, width: 700,
                            '@media (max-width: 650px)': {
                                width: 700,
                            },

                            '@media (max-width: 700px)': {
                                width: 350,
                            },
                            '@media (max-width: 400px)': {
                                width: 350,
                            },
                        }}>
                            {intel.map((item) =>
                            {
                                return (<Accordion.Item value={item.uuid} key={item.uuid}>
                                    <Accordion.Control>{item.name}(#{item.spiedEmpireId}) - {new Date(item.createdAt).toLocaleString()}</Accordion.Control>
                                    <Accordion.Panel>
                                        <Intel empire={item} />
                                    </Accordion.Panel>
                                </Accordion.Item>)
                            })}

                        </Accordion>
                    ) : (<div>None Available</div>)}
                </Stack>
            </Center>
        </section>
    )
}