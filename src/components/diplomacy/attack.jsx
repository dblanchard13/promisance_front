import
{
    Center,
    Title,
    Button,
    Select,
    Text,
    Stack,
    Card,
    Table,
    Group,
} from '@mantine/core'
import { useEffect, useState, forwardRef } from 'react'
import { useForm } from '@mantine/form'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { empireLoaded } from '../../store/empireSlice'
import { clearResult, setResult } from '../../store/turnResultsSlice'

import { eraArray } from '../../config/eras'
import { raceArray } from '../../config/races'

// TODO: build attacking page
// show your army information
// show attack and def value of your troops
// get list of other empires
// select empire to attack
// show other empire id, name, era, networth, land...
// select attack type
// show attack type information (allow to hide?)
// submit empire to attack and attack type
// figure out time gate situation
// return results and update troop info


export default function Attack()
{
    const { empire } = useSelector((state) => state.empire)

    let myEra = empire.era

    const dispatch = useDispatch()

    const [otherEmpires, setOtherEmpires] = useState()
    const [selectedEmpire, setSelectedEmpire] = useState()
    const [selectedAttack, setSelectedAttack] = useState()

    const form = useForm({
        initialValues: {
            empireId: empire.id,
            type: 'attack',
            number: 1,
            empire: '',
            attack: ''
        },

        validationRules: {
            number: (value) => value <= Math.floor(empire.turns / 2) && value > 0,
        },

        errorMessages: {
            number: "Can't attack that many times",
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
                let otherEmpires = res.data.map(({ name, empireId, land, era, race }) => ({ name, empireId, land, era, race }))
                // let dataFormat = otherEmpires.map((empire) =>
                //     ({ value: empire.empireId.toLocaleString(), label: `(#${empire.empireId}) ${empire.name} - land: ${empire.land.toLocaleString()} era: ${eraArray[empire.era].name} race: ${raceArray[empire.race].name}` })
                // )
                let dataFormat = otherEmpires.map((empire) =>
                ({
                    value: empire.empireId.toLocaleString(), land: empire.land.toLocaleString(), race: raceArray[empire.race].name, era: eraArray[empire.era].name, name: empire.name, empireId: empire.empireId, label: `(#${empire.empireId}) ${empire.name}`
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
        ({ land, era, empireId, name, race, ...others }, ref) => (
            <div ref={ref} {...others}>
                <div>
                    <Text size='md'>(#{empireId}) {name}</Text>
                    <Text size='xs'>Land: {land}</Text>
                    <Text size='xs'>Era: {era}</Text>
                    <Text size='xs'>Race: {race}</Text>
                </div>
            </div>
        )
    );

    // console.log(selectedEmpire)
    // console.log(selectedAttack)
    // console.log(otherEmpires)

    return (
        <section style={{ paddingTop: '1rem' }}>
            <Center>
                <Stack spacing='sm' align='center'>
                    <Title order={1} align='center'>
                        War Council
                    </Title>
                    <div>
                        Attack other players to take their land, kill their citizens, or steal their resources. Attacks take two turns.
                    </div>
                    <Group position='center'>
                        <Card>
                            <Card.Section withBorder inheritPadding py="xs">
                                <Text weight={500}>Your Army:</Text>
                            </Card.Section>
                            <Card.Section inheritPadding py="xs">
                                <Table striped>
                                    <thead>
                                        <tr>
                                            <th>
                                                Unit
                                            </th>
                                            <th>
                                                Number
                                            </th>
                                            <th>
                                                Attack
                                            </th>
                                            <th>
                                                Defense
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{eraArray[empire.era].trparm}</td>
                                            <td align='right'>{empire?.trpArm.toLocaleString()}</td>
                                            <td align='right'>{eraArray[empire.era].o_trparm}</td>
                                            <td align='right'>{eraArray[empire.era].d_trparm}</td>
                                        </tr>
                                        <tr>
                                            <td>{eraArray[empire.era].trplnd}</td>
                                            <td align='right'>{empire?.trpLnd.toLocaleString()}</td>
                                            <td align='right'>{eraArray[empire.era].o_trplnd}</td>
                                            <td align='right'>{eraArray[empire.era].d_trplnd}</td>
                                        </tr>
                                        <tr>
                                            <td>{eraArray[empire.era].trpfly}</td>
                                            <td align='right'>{empire?.trpFly.toLocaleString()}</td>
                                            <td align='right'>{eraArray[empire.era].o_trpfly}</td>
                                            <td align='right'>{eraArray[empire.era].d_trpfly}</td>
                                        </tr>
                                        <tr>
                                            <td>{eraArray[empire.era].trpsea}</td>
                                            <td align='right'>{empire?.trpSea.toLocaleString()}</td>
                                            <td align='right'>{eraArray[empire.era].o_trpsea}</td>
                                            <td align='right'>{eraArray[empire.era].d_trpsea}</td>
                                        </tr>
                                        <tr>
                                            <td>{eraArray[empire.era].trpwiz}</td>
                                            <td align='right'>{empire?.trpWiz.toLocaleString()}</td>
                                            <td align='right'>N/A</td>
                                            <td align='right'>N/A</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Section>
                        </Card>

                        <Card>

                            <Card.Section withBorder inheritPadding py="xs">
                                <Group position='apart'>
                                    <Text weight={500}>Attack:</Text>

                                </Group>
                            </Card.Section>
                            <form onSubmit={form.onSubmit((values) =>
                            {
                                console.log(values)
                                // dispatch(clearResult)
                            })}>
                                <Stack spacing='sm' align='center'>
                                    {otherEmpires && (
                                        <Select
                                            searchable
                                            value={selectedEmpire}
                                            onChange={setSelectedEmpire}
                                            label="Select an Empire to Attack"
                                            placeholder="Pick one"
                                            withAsterisk
                                            itemComponent={SelectItem}
                                            data={otherEmpires}
                                            withinPortal
                                        />
                                    )}
                                    <Select
                                        value={selectedAttack}
                                        onChange={setSelectedAttack}
                                        label="Select an Attack Type"
                                        placeholder="Pick one"
                                        withAsterisk
                                        withinPortal
                                        // itemComponent={SelectAttack}
                                        data={[
                                            { value: 1, label: 'Standard Attack' },
                                            { value: 2, label: 'Surprise Attack' },
                                            { value: 3, label: 'Guerilla Strike' },
                                            { value: 4, label: 'Lay Siege' },
                                            { value: 5, label: 'Air Strike' },
                                            { value: 6, label: 'Coastal Assault' }
                                        ]}
                                    />

                                    <Button color='red' type='submit'>
                                        Attack
                                    </Button>
                                </Stack>
                            </form>

                        </Card>

                    </Group>
                    <Card>
                        <Card.Section withBorder inheritPadding py="xs">
                            <Text weight={500}>Attack Options:</Text>
                        </Card.Section>
                        <Card.Section inheritPadding py="xs">
                            <p>In order to attack another empire, it must either be in the same era as yours or a Time Gate must be open between your empires, either opened by you or by your target.</p>
                            <p>Six different attack methods are available for you to use, each having their own advantages and disadvantages:</p>
                            <dl>
                                <dt>Standard Attack</dt>
                                <dd>The standard attack type, this allows sending all types of military units to attack your target. If successful, you will steal a percentage of your target's land, potentially with some of its original structures intact.</dd>
                                <dt>Surprise Attack</dt>
                                <dd>A surprise attack grants a 25% attack power bonus and allows the attacker to bypass any shared forces the defender's clan may have, though this comes at the cost of increased troop losses for the attacker as well as a significantly higher health loss. If successful, all structures on captured land are destroyed.</dd>
                                <dt>Guerilla Strike</dt>
                                <dd>By sending in only your {eraArray[empire.era].trparm}, you can avoid your target's other forces. If successful, all structures on captured land are destroyed.</dd>
                                <dt>Lay Siege</dt>
                                <dd>By sending in only your {eraArray[empire.era].trplnd}, you can not only steal your target's land but also destroy additional structures on the land you do not capture. {eraArray[empire.era].blddef} and {eraArray[empire.era].bldwiz} are especially vulnerable.</dd>
                                <dt>Air Strike</dt>
                                <dd>By sending in only your {eraArray[empire.era].trpfly}, you can not only steal your target's land but also destroy additional structures on the land you do not capture. While attacking from above, significantly more structures can be destroyed, but much fewer will be captured.</dd>
                                <dt>Coastal Assault</dt>
                                <dd>By sending in only your {eraArray[empire.era].trpsea}, you can not only steal your target's land but also destroy additional structures on the land you do not capture. {eraArray[empire.era].blddef} and {eraArray[empire.era].bldwiz} are especially vulnerable.</dd>
                            </dl>
                        </Card.Section>
                    </Card>
                </Stack>
            </Center>
        </section>
    )
}