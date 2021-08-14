import { getEventById, getFeaturedEvents } from '../../helpers/api-utils'
import { Fragment } from 'react'
import EventSummary from '../../components/event-detail/event-summary'
import EventLogistics from '../../components/event-detail/event-logistics'
import EventContent from '../../components/event-detail/event-content'
import ErrorAlert from '../../components/ui/error-alert'

function EventDetailPage(props) {
	if (!props.event) {
		return (
			<ErrorAlert>
				<p>No Post Found</p>
			</ErrorAlert>
		)
	}
	return (
		<Fragment>
			<EventSummary title={props.event.title} />
			<EventLogistics
				date={props.event.date}
				address={props.event.location}
				image={props.event.image}
				imageAlt={props.event.title}
			/>
			<EventContent>
				<p>{props.event.description}</p>
			</EventContent>
		</Fragment>
	)
}

export async function getStaticProps(context) {
	const eventId = context.params.eventId

	const event = await getEventById(eventId)

	if (!event) {
		return { notFound: true }
	}

	return {
		props: {
			event: event,
		},
		revalidate: 30,
	}
}

export async function getStaticPaths() {
	const events = await getFeaturedEvents()

	const paths = events.map((event) => ({
		params: {
			eventId: event.id,
		},
	}))

	return {
		paths: paths,
		fallback: 'blocking',
	}
}

export default EventDetailPage
