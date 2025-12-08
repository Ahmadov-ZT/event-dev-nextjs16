import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { getBaseUrl } from "@/lib/getBaseUrl";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetails = async ({ params }: { params: any }) => {
  let slug = params?.slug;
  if (!slug || typeof slug !== "string") return notFound();

  const base = getBaseUrl();

  const request = await fetch(`${base}/api/events/${slug}`, {
    cache: "no-store",
  });

  if (!request.ok) {
    const msg = await request.text();
    console.error("Event fetch error:", msg);
    return notFound();
  }

  const { event } = await request.json();
  if (!event) return notFound();

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    tags,
    organizer,
  } = event;

  if (!description) return notFound();

  // Agenda normalize
  let normalizedAgenda: string[] = [];
  if (Array.isArray(agenda)) normalizedAgenda = agenda;
  else if (typeof agenda === "string")
    normalizedAgenda = agenda.split(",").map((a) => a.trim());

  // Tags normalize
  let normalizedTags: string[] = [];
  if (Array.isArray(tags)) normalizedTags = tags;
  else if (typeof tags === "string")
    normalizedTags = tags.split(",").map((t) => t.trim());

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
  const bookings = 10;

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* Left Side */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/calendar.svg" alt="calendar" width={17} height={17} />
              <p>{date}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/clock.svg" alt="clock" width={17} height={17} />
              <p>{time}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/pin.svg" alt="pin" width={17} height={17} />
              <p>{location}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/mode.svg" alt="mode" width={17} height={17} />
              <p>{mode}</p>
            </div>
            <div className="flex-row-gap-2 items-center">
              <Image src="/icons/audience.svg" alt="audience" width={17} height={17} />
              <p>{audience}</p>
            </div>
          </section>

          <section className="agenda">
            <h2>Agenda</h2>
            <ul>
              {normalizedAgenda.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>

          <div className="flex flex-row gap-1.5 flex-wrap">
            {normalizedTags.map((tag) => (
              <div className="pill" key={tag}>
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book your spot</h2>
            <p className="text-sm">
              Join {bookings} people who have already booked their spot
            </p>

            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents?.map((evt: IEvent) => (
            <EventCard key={evt.title} {...evt} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
