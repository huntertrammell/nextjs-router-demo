import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import useSWR from 'swr'

import { getFilteredEvents } from '../../helpers/api-utils'
import EventList from '../../components/events/event-list'
import ResultsTitle from '../../components/events/results-title'
import Button from '../../components/ui/button'
import ErrorAlert from '../../components/ui/error-alert'

function FilteredEventsPage(props) {
	const router = useRouter()

	const [events, setEvents] = useState()

	const filterData = router.query.slug

	const { data, error } = useSWR(
		'https://react-udemy-demo-9e66c-default-rtdb.firebaseio.com/events.json'
	)

	useEffect(() => {
		if (data) {
			const events = []

			for (const key in data) {
				events.push({
					id: key,
					...data[key],
				})
			}

			setEvents(events)
		}
	}, [data])

	if (!events) {
		return <p className="center">Loading...</p>
	}

	if (!filterData) {
		return <p className="center">Loading...</p>
	}

	const filteredYear = filterData[0]
	const filteredMonth = filterData[1]

	const numYear = +filteredYear
	const numMonth = +filteredMonth

	if (
		isNaN(numYear) ||
		isNaN(numMonth) ||
		numYear > 2030 ||
		numYear < 2021 ||
		numMonth < 1 ||
		numMonth > 12 ||
		error
	) {
		return (
			<Fragment>
				<ErrorAlert>
					<p>Invalid Filter. Please adjust your values</p>
				</ErrorAlert>
				<div className="center">
					<Button link="/events">Show All Events</Button>
				</div>
			</Fragment>
		)
	}

	const filteredEvents = events.filter((event) => {
		const eventDate = new Date(event.date)
		return (
			eventDate.getFullYear() === numYear &&
			eventDate.getMonth() === numMonth - 1
		)
	})

	if (!filteredEvents || filteredEvents.length === 0) {
		return (
			<Fragment>
				<ErrorAlert>
					<p>No events found for the chosen filter!</p>
				</ErrorAlert>
				<div className="center">
					<Button link="/events">Show All Events</Button>
				</div>
			</Fragment>
		)
	}

	const date = new Date(props.year, props.month - 1)

	return (
		<Fragment>
			<ResultsTitle date={date} />
			<EventList items={filteredEvents} />
		</Fragment>
	)
}

// export async function getServerSideProps(context) {
// 	const { params } = context

// 	const filterData = params.slug

// 	const filteredYear = filterData[0]
// 	const filteredMonth = filterData[1]

// 	const numYear = +filteredYear
// 	const numMonth = +filteredMonth

// 	if (
// 		isNaN(numYear) ||
// 		isNaN(numMonth) ||
// 		numYear > 2030 ||
// 		numYear < 2021 ||
// 		numMonth < 1 ||
// 		numMonth > 12
// 	) {
// 		return {
// 			props: {
// 				hasError: true,
// 			},
// 		}
// 	}

// 	const filteredEvents = await getFilteredEvents({
// 		year: numYear,
// 		month: numMonth,
// 	})

// 	return {
// 		props: {
// 			events: filteredEvents,
// 			year: numYear,
// 			month: numMonth,
// 		},
// 	}
// }

export default FilteredEventsPage
