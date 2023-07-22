import { Button, Center, Group, Card, Text, Loader, Box, Badge } from '@mantine/core'

import { Sword, Shield, ShoppingCart } from '@phosphor-icons/react'


export default function NewsItem({ item, now })
{

    let eventTime = new Date(item.createdAt)
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

    let highlight = ''
    if (item.result === 'success') highlight = 'green'
    if (item.result === 'fail') highlight = 'red'

    const parseContent = (content) =>
    {
        let lines = content.split('/n')
        return lines.map((line, index) =>
        {
            let weight = 'normal'
            if (index === 0) weight = 'bold'
            return <Text key={index} size='sm' weight={weight}>{line}</Text>
        })
    }

    const selectIcon = (type, result) =>
    {
        if (type === 'attack' && result === 'success') return <Shield size={24} color={highlight} weight='fill' />
        if (type === 'attack' && result === 'fail') return <Sword size={24} color={highlight} weight='fill' />
        if (type === 'market' && result === 'success') return <ShoppingCart size={24} color={highlight} weight='fill' />
    }

    return (
        <Card shadow='sm' radius='sm' m='sm' p='xs' withBorder>
            <Card.Section p='xs'>
                <Group position='apart'>
                    <Text size='xs'>{eventTime.toLocaleString()} ({timeSince})</Text>
                    {!item.seen &&
                        <Badge color='green'>
                            new
                        </Badge>}
                </Group>
            </Card.Section>
            <Group noWrap spacing='xs'>
                <Box>
                    {selectIcon(item.type, item.result)}
                </Box>
                <Box>
                    {parseContent(item.personalContent)}
                </Box>
            </Group>
        </Card>
    )
}