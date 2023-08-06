import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { useDisclosure } from '@mantine/hooks';
import
{
	ColorSchemeProvider,
	Group,
	Loader,
	MantineProvider,
	Modal,
	Grid,
	Drawer,
	AppShell,
	Burger,
	Header,
	MediaQuery,
	Navbar,
	Title,
	ScrollArea,
	Button,
	Indicator
} from '@mantine/core'

import Sidebar from './components/layout/sidebar'

import './App.css'
import InfoBar from './components/layout/infobar'
import { useDispatch, useSelector } from 'react-redux'
import TurnResultContainer from './components/useTurns/TurnResultContainer'
import { fetchEmpire, empireLoaded } from './store/empireSlice'
import { load, logout } from './store/userSlice'
import ThemeToggle from './components/utilities/themeToggle'
import { useLocalStorage } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'
import { setPage } from './store/guideSlice'
import { fetchMyItems, fetchOtherItems } from './store/pubMarketSlice'


import Guide from './components/guide/guide'
import EffectIcons from './components/layout/EffectIcons'
import { fetchEffects } from './store/effectSlice'
import { NewspaperClipping } from '@phosphor-icons/react'
import EmpireNews from './components/news/empireNews';



function App()
{
	const [opened, setOpened] = useState(false)
	const dispatch = useDispatch()
	const [modalOpened, setModalOpened] = useState(false);
	const [drawer, { open, close }] = useDisclosure(false)
	const [news, setNews] = useState()

	let location = useLocation()
	// console.log(location)

	const empireStatus = useSelector(state => state.empire.status)

	const { isLoggedIn, user } = useSelector((state) => state.user)
	// const empire = useSelector((state) => state.empire)
	const { empire } = useSelector((state) => state.empire)
	// console.log(empire)

	const navigate = useNavigate()
	// console.log(empire)
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

	const loadMarket = async () =>
	{
		try {
			if (empire) {
				let marketValues = { empireId: empire.id }
				dispatch(fetchMyItems(marketValues))
				dispatch(fetchOtherItems(marketValues))
			}
		} catch (error) {
			console.log(error)
		}
	}

	const checkForNews = async () =>
	{
		try {
			const res = await Axios.get(`/news/${empire.id}/check`)
			// console.log(res.data.new)
			return res.data.new
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() =>
	{
		async function loadUser()
		{
			try {
				const res = await Axios.get('auth/me')
				console.log(res.data)
				if (res.status !== 200) {
					navigate('/')
				} else if (res.data) {
					dispatch(load())
				}
			} catch (error) {
				navigate('/')
			}
		}

		if (!isLoggedIn) {
			loadUser()
		}

		if (isLoggedIn && empireStatus === 'idle') {
			dispatch(fetchEmpire(
				{
					uuid: user.empires[0].uuid,
				}
			))
			dispatch(fetchEffects({
				id: user.empires[0].empireId
			}))
		}
	})

	let locationArr = location.pathname.split('/')
	let last = locationArr.length - 1
	let pageState = locationArr[last]

	useEffect(() =>
	{
		if (empireStatus === 'succeeded') {
			checkForNews().then((data) =>
			{
				// console.log(data)
				setNews(data)
			})
		}
	})

	useEffect(() =>
	{
		if (empireStatus === 'succeeded') {
			dispatch(fetchEffects({
				id: empire.id
			}))
		}
	})

	useEffect(() =>
	{
		dispatch(setPage(pageState))
	})

	const [colorScheme, setColorScheme] = useLocalStorage({
		key: 'prom-color-scheme',
		defaultValue: 'light'
	});
	const toggleColorScheme = (value) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider theme={{ colorScheme }} withGlobalStyles>
				<AppShell
					styles={(theme) => ({
						main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1] },
					})}
					navbarOffsetBreakpoint='sm'
					fixed
					navbar={
						<Navbar
							padding='sm'
							hiddenBreakpoint='sm'
							hidden={!opened}
							width={{ sm: 200, base: 200 }}
							zIndex={100}
						>
							<Navbar.Section
								grow
								component={ScrollArea}
								ml={10}
								onClick={() => setOpened(false)}
							>
								<Sidebar />
							</Navbar.Section>
							<Navbar.Section>
								<Button
									onClick={() => dispatch(logout())}
									variant='subtle'
									color='red'
									fullWidth
								>
									Logout
								</Button>
							</Navbar.Section>
						</Navbar>
					}
					header={
						<Header height={60} p='sm'>
							<Group position='apart' spacing='sm'>
								<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
									<Burger
										opened={opened}
										onClick={() => setOpened((o) => !o)}
										size='sm'
									/>
								</MediaQuery>
								<Title order={1}>Solo Promisance</Title>
								<ThemeToggle />
							</Group>
						</Header>
					}
				>
					<main style={{ paddingBottom: 15 }}>
						{empireStatus !== 'succeeded' ? (<Loader />) : (<>
							<InfoBar data={empire} />
							<Modal
								opened={modalOpened}
								onClose={() => setModalOpened(false)}
								title='Game Guide'
								centered
								overflow="inside"
								size="xl"

							>
								<Guide empire={empire} />
							</Modal>
							<Grid grow justify='center' sx={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
								<Grid.Col span={1}>
									<EffectIcons />
								</Grid.Col>
								<Grid.Col span={6}>
									<Group spacing='xs' position='center'>
										<Button compact variant='light' onClick={() => { setModalOpened(true) }}>Game Guide</Button>
										<Button compact variant='light' onClick={() =>
										{
											loadEmpireTest()
											loadMarket()
										}}>Refresh</Button>
									</Group>
								</Grid.Col>
								<Grid.Col span={1}>
									<Group spacing='xs' mr='sm' position='right'>
										<Indicator color="green" processing disabled={!news} zIndex={3}>
											<Button onClick={open} size='sm' compact color=''><NewspaperClipping size='1.2rem' /> </Button>
										</Indicator>
									</Group>
								</Grid.Col>
							</Grid>
							<Drawer opened={drawer} onClose={close} position='right' size='lg' title='' >
								<EmpireNews />
							</Drawer>
							<TurnResultContainer />
							<Outlet />
						</>)}
					</main>
				</AppShell>
			</MantineProvider>
		</ColorSchemeProvider>
	)
}

export default App
