import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { cacheLife } from "next/cache";

const Page = async () => {
  "use cache";
  cacheLife("hours");

  const base = getBaseUrl();

  const response = await fetch(`${base}/api/events`, {
    // build-compatible
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("API /events failed:", text);
    throw new Error("Failed to fetch events");
  }

  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Premier Hub For <br /> Essential Developer Events
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events?.map((event: IEvent) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
