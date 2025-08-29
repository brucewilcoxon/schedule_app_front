import { CalendarType } from "../types/Calendar";
import Event from "./Event";
interface EventListProps {
  events: CalendarType[];
  date: string;
}

const EventList: React.FC<EventListProps> = ({ events, date }) => {
  return (
    <div className="w-full text-left flex items-center bg-custom-white rounded-lg shadow-md mt-3">
      <div className="m-3 w-full">
        <p>{date}</p>
        {events && events.length > 0 ? (
          events.map((event) => <Event key={event.id} event={event} />)
        ) : (
          <p className="text-lg">予定はありません</p>
        )}
      </div>
    </div>
  );
};

export default EventList;
