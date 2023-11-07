import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { useDisclosure, useColorScheme, useLocalStorage } from '@mantine/hooks';
import useInterval from './functions/useInterval'
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
	Indicator,
	Image,
} from '@mantine/core'

import neoIcon from './icons/neoIcon.svg'

import Sidebar from './components/layout/sidebar'
import InfoBar from './components/layout/infobar'
import { useDispatch, useSelector } from 'react-redux'
import TurnResultContainer from './components/useTurns/TurnResultContainer'
import { fetchEmpire, empireLoaded } from './store/empireSlice'
import { load, logout } from './store/userSlice'
import ThemeToggle from './components/utilities/themeToggle'
import { useLocation } from 'react-router-dom'
import { setPage } from './store/guideSlice'
import { fetchMyItems, fetchOtherItems } from './store/pubMarketSlice'

import Guide from './components/guide/guide'
import EffectIcons from './components/layout/EffectIcons'
import { fetchEffects } from './store/effectSlice'
import { NewspaperClipping, Envelope, UsersFour } from '@phosphor-icons/react'
import EmpireNews from './components/news/empireNews';
import BonusTurns from './components/layout/bonusTurns';
import { loadScores } from './store/scoresSlice';
import { TURNS_PROTECTION } from './config/config';

function App()
{
	const [opened, setOpened] = useState(false)
	const dispatch = useDispatch()
	const [modalOpened, setModalOpened] = useState(false);
	const [drawer, { open, close }] = useDisclosure(false)
	const [news, setNews] = useState(0)
	const [mail, setMail] = useState(0)
	const [clanMail, setClanMail] = useState(0)

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
			const res = await Axios.get(`/news/${empire.id}/count`)
			// console.log(res.data.count)
			return res.data.count
		} catch (error) {
			console.log(error)
		}
	}

	const checkForMail = async () =>
	{
		try {
			const res = await Axios.get(`messages/${empire.id}/count`)
			// console.log(res.data.count)
			return res.data.count
		} catch (error) {
			console.log(error)
		}
	}

	const checkForClanMail = async () =>
	{
		// console.log('checking for clan mail')
		try {
			const res = await Axios.post(`messages/clan/unread`, { empireId: empire.id, clanId: empire.clanId })
			// console.log(res.data)
			return res.data
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() =>
	{
		async function loadUser()
		{
			// console.log('loading user')
			try {
				const res = await Axios.get('auth/me')
				// console.log('status', res.data)
				if (res.status === 401) {
					navigate('/')
				} else if (res.status !== 200) {
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


		if (isLoggedIn && user.empires.length > 0 && empireStatus === 'idle') {
			dispatch(fetchEmpire(
				{
					uuid: user.empires[0].uuid,
				}
			))
		} else if (isLoggedIn && user.empires.length === 0) {
			if (user.role === 'demo') {
				navigate('/demo')
			} else {
				navigate('/create')
			}
		}

		dispatch(setPage(pageState))

		if (empireStatus === 'succeeded') {
			try {
				dispatch(fetchEffects({
					id: empire.id
				})).then((data) =>
				{
					// console.log(data)
					if (data.meta.requestStatus === 'rejected') {
						navigate('/')
					}
				}
				)
				checkForNews().then((data) =>
				{
					// console.log(data)
					setNews(data)
				})
				// checkForMail().then((data) =>
				// {
				// 	// console.log(data)
				// 	setMail(data)
				// })

				// if (empire.clanId !== 0) {
				// 	checkForClanMail().then((data) =>
				// 		setClanMail(data))
				// }

			}
			catch (error) {
				// console.log(error)
				navigate('/')
			}
		}

	})

	// const handleNewsRead = () =>
	// {
	// 	console.log('news read')
	// 	checkForNews().then((data) =>
	// 	{
	// 		// console.log(data)
	// 		setNews(data)
	// 	})
	// }

	useInterval(() =>
	{
		if (empireStatus === 'succeeded' && !modalOpened) {
			try {
				// loadEmpireTest()

				// dispatch(fetchEffects({
				// 	id: empire.id
				// })).then((data) =>
				// {
				// 	// console.log(data)
				// 	if (data.meta.requestStatus === 'rejected') {
				// 		navigate('/')
				// 	}
				// }
				// )

				// checkForNews().then((data) =>
				// {
				// 	// console.log(data)
				// 	setNews(data)
				// })
				checkForMail().then((data) =>
				{
					// console.log(data)
					setMail(data)
				})
				if (empire.clanId !== 0) {
					checkForClanMail().then((data) =>
						setClanMail(data))
				}
			}
			catch (error) {
				// console.log(error)
				navigate('/')
			}
		}
	}, 60000)

	let locationArr = location.pathname.split('/')
	let last = locationArr.length - 1
	let pageState = locationArr[last]

	// console.log(clanMail)

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
						main: {
							backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
						}
					})}
					navbarOffsetBreakpoint='sm'
					fixed
					navbar={
						<Navbar
							padding='sm'
							hiddenBreakpoint='sm'
							hidden={!opened}
							width={{ sm: 200, base: 200 }}
							zIndex={110}
							sx={{ paddingBottom: 'calc(1em + env(safe-area-inset-bottom))' }}
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
						<Header height={60} p='sm' zIndex={120}>
							<Group position='apart' spacing={2}>
								<MediaQuery largerThan='sm' styles={{ display: 'none' }}>
									<Burger
										opened={opened}
										onClick={() => setOpened((o) => !o)}
										size='sm'
									/>
								</MediaQuery>
								<a style={{ textDecoration: 'none', color: 'inherit' }} href='/'>
									<Group align='center' spacing={4}>

										<MediaQuery smallerThan={400} styles={{ display: 'none' }}>
											<Image src={neoIcon} height={38} width={38} sx={colorScheme === 'dark' ? ({ filter: 'invert(1)', opacity: '75%' }) : ({ filter: 'invert(0)', })} />
										</MediaQuery>

										<Title order={1} ml={0}>
											NeoPromisance
										</Title>

									</Group>
								</a>
								<Group>
									{user?.role === 'admin' ? (<Button component="a" href="/admin/" compact variant='light'>Admin</Button>) : ('')}
									<ThemeToggle />
								</Group>
							</Group>
						</Header>
					}
				>
					<main style={{ paddingBottom: 'calc(15px + env(safe-area-inset-bottom))' }}>
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
								<Grid.Col span={3}>
									<EffectIcons />
								</Grid.Col>
								<Grid.Col span={2}>
									<Group spacing='xs' position='center'>
										<Button compact variant='outline' onClick={() => { setModalOpened(true) }}
											sx={(theme) =>
											{
												if (empire.turnsUsed <= TURNS_PROTECTION * 2) {
													return {
														border: '1px solid #40c057',
														boxShadow: '0 0 2px 1px #40c057',
														color: '#40c057',
													}
												}
											}
											}>Game Guide</Button>
										<Button compact variant='outline' onClick={() =>
										{
											loadEmpireTest()
											loadMarket()
											dispatch(loadScores())
										}}>Refresh</Button>
									</Group>
								</Grid.Col>
								<Grid.Col span={3}>
									<Group spacing='xs' mr='sm' position='right'>
										<BonusTurns />
										{empire.clanId !== 0 && <Indicator color="green" disabled={clanMail < 1} label={clanMail} size={20} overflowCount={50} zIndex={3}>
											<Button component="a" href="/app/Clans" size='sm' compact color=''><UsersFour size='1.2rem' /> </Button>
										</Indicator>}
										<Indicator color="green" disabled={mail < 1} label={mail} size={20} overflowCount={50} zIndex={3}>
											<Button component="a" href="/app/mailbox" size='sm' compact color=''><Envelope size='1.2rem' /> </Button>
										</Indicator>
										<Indicator color="green" disabled={news < 1} label={news} size={20} overflowCount={50} zIndex={3}>
											<Button onClick={open} size='sm' compact color=''><NewspaperClipping size='1.2rem' /></Button>
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
