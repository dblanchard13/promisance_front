import
{
    Center,
    Button,
    Select,
    Text,
    Stack,
    Card,
    Table,
    Group,
} from '@mantine/core'
import { useState, forwardRef } from 'react'
import { useForm } from '@mantine/form'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { empireLoaded } from '../../store/empireSlice'
import { setResult } from '../../store/turnResultsSlice'

import { eraArray } from '../../config/eras'
import { loadScores } from '../../store/scoresSlice'

import { MAX_ATTACKS } from '../../config/config'

export default function ScoresAttack({ enemy })
{
    const { empire } = useSelector((state) => state.empire)
    const dispatch = useDispatch()

    const [selectedAttack, setSelectedAttack] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            empireId: empire.id,
            type: 'attack',
            number: 1,
            defenderId: enemy.id,
            attackType: ''
        },
        validationRules: {
            number: (value) => empire.turns >= 2 && value > 0,
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

    const sendAttack = async (values) =>
    {
        setLoading(true)
        setError('')
        try {
            const res = await Axios.post(`/attack`, values)
            // console.log(res.data)
            if ("error" in res.data) {
                setError(res.data.error)
            } else {
                window.scroll({ top: 0, behavior: 'smooth' })
                dispatch(setResult(res.data))
                loadEmpireTest()
                dispatch(loadScores())
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const SelectAttack = forwardRef(
        ({ label, sub, ...others }, ref) => (
            <div ref={ref} {...others}>
                <Text size='md'>{label}</Text>
                <Text size='xs' m={0}>{sub}</Text>
            </div>
        )
    )

    return (
        <section>
            <Center>
                <Stack spacing='sm' align='center'>
                    {error && (<Text color='red' weight='bold'>{error}</Text>)}
                    <Group position='center'>
                        <Card sx={{ width: '300px' }}>

                            <form onSubmit={form.onSubmit((values) =>
                            {
                                // console.log(values)
                                sendAttack(values)
                                // window.scroll({ top: 0, behavior: 'smooth' })
                                // dispatch(clearResult)
                            })}>
                                <Stack spacing='sm' align='center'>
                                    <Select
                                        value={selectedAttack}
                                        onChange={setSelectedAttack}
                                        label="Select an Attack Type"
                                        placeholder="Pick one"
                                        withAsterisk
                                        withinPortal
                                        itemComponent={SelectAttack}
                                        data={[
                                            { value: 'standard', label: 'Standard Attack', sub: 'attack with all units' },
                                            { value: 'surprise', label: 'Surprise Attack', sub: 'attack with all units' },
                                            { value: 'trparm', label: 'Guerilla Strike', sub: `attack with ${eraArray[empire.era].trparm}` },
                                            { value: 'trplnd', label: 'Lay Siege', sub: `attack with ${eraArray[empire.era].trplnd}` },
                                            { value: 'trpfly', label: 'Air Strike', sub: `attack with ${eraArray[empire.era].trpfly}` },
                                            { value: 'trpsea', label: 'Coastal Assault', sub: `attack with ${eraArray[empire.era].trpsea}` },
                                            { value: 'pillage', label: 'Pillage', sub: 'attack with all units' }
                                        ]}
                                        {...form.getInputProps('attackType')}
                                    />

                                    <Button color='red' type='submit' loading={loading}>
                                        Attack
                                    </Button>
                                    <Text size='sm'>{MAX_ATTACKS - empire.attacks} attacks remaining</Text>
                                </Stack>
                            </form>

                        </Card>
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
                                    </tbody>
                                </Table>
                            </Card.Section>
                        </Card>
                    </Group>

                </Stack>
            </Center>
        </section>
    )
}
