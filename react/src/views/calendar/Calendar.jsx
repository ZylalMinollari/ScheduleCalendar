import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import axiosClient from "../../axios-client.js";
import moment from "moment";
import CreateEventPopup from "../../components/Popups/CreateEventPopup.jsx";
import EditEventPopup from "../../components/Popups/EditEventPopup.jsx";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import { OverlayTrigger, Popover } from "react-bootstrap";

const Calendar = () => {
    const [currentEvents, setCurrentEvents] = useState([]);
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [createEventPopup, setCreateEventPopup] = useState(false);
    const [editEventPopup, setEditEventPopup] = useState(false);
    const [eventInfo, setEventInfo] = useState(null);
    const [errors, setErrors] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const { setNotification } = useStateContext();
    const colors = ["#FF0000"];
    const [event, setEvent] = useState({
        title: "",
        backgroundColor: colors[0],
        textColor: "#fff",
        start: "",
        end: "",
    });

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = () => {
        setLoading(true);
        axiosClient
            .get("/events")
            .then(({ data }) => {
                setLoading(false);
                setCurrentEvents(data.data);
            })
            .catch((e) => {
                //
            });
    };

    const addEvent = (e) => {
        e.preventDefault();
        let calendarApi = eventInfo.view.calendar;

        calendarApi.unselect();

        let data = {
            title: event.title,
            start: moment(event.start).format("YYYY-MM-DD"),
            end: moment(event.end).format("YYYY-MM-DD"),
            background_color: event.backgroundColor,
            text_color: event.textColor,
        };

        axiosClient
            .post(`/events`, data)
            .then((response) => {
                calendarApi.addEvent({
                    id: response.data.id,
                    title: response.data.title,
                    start: response.data.start,
                    end: response.data.end,
                    backgroundColor: response.data.backgroundColor,
                    borderColor: response.data.backgroundColor,
                    textColor: response.data.textColor,
                });
                setCreateEventPopup(false);
                setNotification("Event was successfully created");
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };

    const changeEvent = (e) => {
        e.preventDefault();
        let calendarApi = eventInfo.view.calendar;
        calendarApi.unselect();

        let data = {
            title: event.title,
            start: moment(event.start).format("YYYY-MM-DD"),
            end: moment(event.end).format("YYYY-MM-DD"),
            background_color: event.backgroundColor,
            text_color: event.textColor,
        };

        axiosClient
            .put(`/events/${eventInfo.event.id}`, data)
            .then(({ data }) => {
                calendarApi
                    .getEventById(data.data.id)
                    .setProp("title", data.data.title);
                calendarApi
                    .getEventById(data.data.id)
                    .setProp("backgroundColor", data.data.backgroundColor);
                calendarApi
                    .getEventById(data.data.id)
                    .setProp("borderColor", data.data.backgroundColor);
                calendarApi
                    .getEventById(data.data.id)
                    .setProp("textColor", data.data.textColor);
                setEditEventPopup(false);
                setNotification("Event created");
            })
            .then(() => {
                setEdit(false);
            })
            .catch((err) => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
        setEvent({
            title: "",
            backgroundColor: colors[0],
            textColor: "#fff",
            start: "",
            end: "",
        });
    };

    const removeEvent = () => {
        let calendarApi = eventInfo.view.calendar;
        axiosClient
            .delete(`/events/${eventInfo.event.id}`)
            .then((response) => {
                calendarApi.getEventById(eventInfo.event.id).remove();
                setEvent({
                    title: "",
                    backgroundColor: colors[0],
                    textColor: "#fff",
                });
                setNotification("Event deleted");
                setEditEventPopup(false);
            })
            .catch((err) => {});
    };
    const handleDateSelect = (selectInfo) => {
        setEvent({
            title: "",
            backgroundColor: colors[0],
            textColor: "#fff",
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        });
        setCreateEventPopup(true);
        setEventInfo(selectInfo);
        setErrors(null);
    };

    const handleEventClick = (clickInfo) => {
        clickInfo.jsEvent.preventDefault();
        setErrors(null);
        setEvent({
            title: clickInfo.event.title,
            backgroundColor: clickInfo.event.backgroundColor,
            textColor: "#fff",
            start: clickInfo.event.start,
            end: clickInfo.event.end,
        });
        setEventInfo(clickInfo);
        setEdit(true);
    };

    const handleEventChange = (e) => {
        if (edit) {
            return;
        }
        let data = {
            title: e.event.title,
            start: e.event.startStr,
            end: e.event.endStr,
            background_color: e.event.backgroundColor,
            text_color: e.event.textColor,
        };
        axiosClient
            .put(`/events/${e.event.id}`, data)
            .then((response) => {
                if (response.status === 200) {
                    setNotification("Event updated");
                }
            })
            .catch((err) => {});
    };

    function renderEventContent(eventInfo) {
        const popover = (
            <Popover id="popover-trigger-focus" className="popover">
                <Popover.Header
                    as="h3"
                    className="popover-header"
                    style={{ backgroundColor: eventInfo.event.backgroundColor }}
                >
                    {eventInfo.event.title}
                </Popover.Header>
                <Popover.Body className="popover-body">
                    <div className="popover-body-buttons">
                        <button
                            className="popover-btn popover-edit-btn"
                            onClick={() => setEditEventPopup(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="popover-btn popover-delete-btn"
                            onClick={() => removeEvent()}
                        >
                            Delete
                        </button>
                    </div>
                </Popover.Body>
            </Popover>
        );

        return (
            <OverlayTrigger
                trigger="click"
                rootClose={true}
                style={{ display: "flex" }}
                overlay={popover}
            >
                <p className="event" id={eventInfo.event.id}>
                    {eventInfo.timeText ? (
                        <span>
                            <span
                                style={{
                                    height: "8px",
                                    width: "8px",
                                    backgroundColor: `${eventInfo.backgroundColor}`,
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginBottom: "1px",
                                    marginRight: "2px",
                                }}
                            ></span>
                        </span>
                    ) : (
                        ""
                    )}{" "}
                    <span>{eventInfo.event.title}</span>
                </p>
            </OverlayTrigger>
        );
    }

    const getDate = () => {
        return Date.now();
    };

    const handleDateChange = (e) => {
        {
            setEvent({
                ...event,
                start: e.start.toJSON(),
                end: e.end.toJSON(),
            });
        }
    };

    const handleColorChange = (color) => {
        setEvent({ ...event, backgroundColor: color.hex });
    };

    return (
        <div>
            {loading && <div>Loading...</div>}
            {!loading && (
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                        listPlugin,
                    ]}
                    headerToolbar={{
                        center: "prev,next,today",
                        left: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listDay,listWeek,listMonth,listYear",
                    }}
                    buttonText={{
                        today: "Today",
                        month: "Month",
                        week: "Week",
                        day: "Day",
                        listMonth: "List Month",
                        listWeek: "List Week",
                        listDay: "List Day",
                        listYear: "List Year",
                    }}
                    dayHeaderFormat={{
                        weekday: "long",
                    }}
                    dayHeaderClassNames="fc-dayHeader-format"
                    initialView="dayGridMonth"
                    displayEventEnd={true}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    dayMaxEventRows={2}
                    weekends={weekendsVisible}
                    events={currentEvents}
                    select={handleDateSelect}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    eventChange={handleEventChange}
                    nowIndicator={getDate}
                />
            )}
            <CreateEventPopup
                activePopup={createEventPopup}
                setActivePopup={setCreateEventPopup}
                addEvent={addEvent}
                errors={errors}
                event={event}
                setEvent={setEvent}
                colors={colors}
                handleColorChange={handleColorChange}
                handleDateChange={handleDateChange}
            />
            <EditEventPopup
                activePopup={editEventPopup}
                setActivePopup={setEditEventPopup}
                changeEvent={changeEvent}
                removeEvent={removeEvent}
                errors={errors}
                event={event}
                setEvent={setEvent}
                colors={colors}
                handleColorChange={handleColorChange}
                handleDateChange={handleDateChange}
            />
        </div>
    );
};

export default Calendar;
