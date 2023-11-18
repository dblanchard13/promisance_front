// component that will contain an individual chat box
// this will be a child of the chat component
// component will receive the two empires in the conversation
// component will fetch the messages between the two empires
// component will render the messages in a list
// component will render a form for sending a new message
// component will refresh when a new message is sent

import { Button, Group, Card, Text, Loader, Stack, Box, Textarea, Anchor } from '@mantine/core'
import { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import { useForm } from '@mantine/form'
import { useSelector } from 'react-redux'
import { PaperPlaneRight } from '@phosphor-icons/react'

const getMessages = async (body) =>
{
    // console.log(body)

    try {
        const res = await Axios.post(`/messages/messages`, body)
        const data = res.data
        const lastMessage = data[data.length - 1]
        // console.log(lastMessage)
        // console.log(body.reader === lastMessage.empireIdDestination)
        // console.log(data)
        if (body.reader === lastMessage.empireIdDestination) {
            await Axios.get(`/messages/${body.conversationId}/read`)
        }
        return data
    } catch (error) {
        console.error('Error fetching messages:', error)
    }
}

export default function Chatbox({ conversation, source, sourceName, destinationId, destinationName })
{

    const { empire } = useSelector((state) => state.empire)
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState([])
    const [report, setReport] = useState(false)
    const messageContainerRef = useRef(null)

    let body = {
        conversationId: conversation.conversationId,
        empireId: source,
        reader: empire.id
    }

    // console.log(body)

    useEffect(() =>
    {
        if (empire) {
            getMessages(body)
                .then((data) =>
                {
                    setMessages(data)
                    setLoading(false)
                }
                )
                .catch((error) =>
                {
                    console.error('Error setting messages:', error)
                    // setLoading(false)
                })

            const messageContainer = messageContainerRef.current
            if (messageContainer) messageContainer.scrollTop = messageContainer.scrollHeight
        }
    }, [])

    // console.log(conversation)

    const form = useForm({
        initialValues: {
            sourceId: source,
            sourceName: sourceName,
            destinationId: destinationId,
            destinationName: destinationName,
            message: ''
        },
    })

    const sendMessage = async (values) =>
    {
        setLoading(true)
        try {
            const res = await Axios.post(`/messages/message/new`, values)
            const data = res.data
            // console.log(data)
            getMessages(body).then((data) =>
            {
                setMessages(data)
                setLoading(false)
                const messageContainer = messageContainerRef.current
                if (messageContainer) messageContainer.scrollTop = messageContainer.scrollHeight
            }).catch((error) => console.error('Error setting messages:', error))
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const reportMessages = async () =>
    {
        try {
            const res = await Axios.post(`/messages/report`, { conversationId: conversation.conversationId })
            const data = res.data
            // console.log(data)
            setReport(true)
        } catch (error) {
            console.error('Error reporting messages:', error)
        }
    }

    return (
        <Card radius='sm' mx='xs' p='xs' h='70vh' sx={{
            '@media (max-width: 800px)': {
                width: '94%',
            },
            '@media (min-width: 800px)': {
                width: '500px',
            }
        }}>
            <Stack gap='sm' justify='space-between' h='100%'>
                {loading ? (<Loader />) : (
                    <Box mt='auto' justify='flex-end' sx={{ overflowY: 'auto' }} pb='xs' ref={messageContainerRef}>
                        {messages.map((message, index) =>
                        {
                            let now = new Date()
                            let eventTime = new Date(message.createdAt)
                            let diff = now - eventTime
                            let minutes = Math.floor(diff / 60000)
                            let hours = Math.floor(minutes / 60)
                            let days = Math.floor(hours / 24)
                            let timeSince = ''

                            if (days > 0) {
                                timeSince = `${days} days ago`
                            } else if (hours > 0) {
                                timeSince = `${hours} hours ago`
                            } else if (minutes > 0) {
                                timeSince = `${minutes} minutes ago`
                            } else {
                                timeSince = 'just now'
                            }
                            let ml = 0
                            if (message.empireIdSource === source) ml = 'auto'
                            let align = 'left'
                            if (message.empireIdSource === source) align = 'right'
                            let color = ''
                            if (message.empireIdSource === source) color = 'lightblue'
                            let fontColor = ''
                            if (message.empireIdSource === source) fontColor = 'black'
                            return (
                                <Card key={index} radius='sm' my='xs' p={8} maw='80%' ml={ml} withBorder shadow='sm' bg={color} >
                                    <Group position='apart'>
                                        <Text size='xs' align={align} color={fontColor}>{message.empireIdSource !== source ? (message.empireSourceName) : ('')}</Text>
                                        <Text size='xs' color={fontColor}>{timeSince}</Text>
                                    </Group>
                                    <Text align={align} color={fontColor}>{message.messageBody}</Text>
                                </Card>
                            )
                        })}
                    </Box>
                )}
                <form onSubmit={form.onSubmit((values) =>
                {
                    // console.log(values)
                    sendMessage(values)
                    form.reset()
                })}>
                    <Group position='right' noWrap>
                        <Textarea minRows={2} w='100%' {...form.getInputProps('message')} />
                        <Button type='submit' loading={loading} size='sm' p='sm'><PaperPlaneRight weight='fill' /></Button>
                    </Group>
                </form>
                {report ? (<Text align='center' size='xs' color='red' >Conversation reported to admins</Text>) : (<Anchor size='xs' color='red' align='center' onClick={reportMessages}>Report conversation to admins for inappropriate or abusive language.</Anchor>)
                }
            </Stack>
        </Card >
    )
}