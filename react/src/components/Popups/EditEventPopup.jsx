import React from "react";
import Form from "react-bootstrap/Form";
import { XCircle } from "react-bootstrap-icons";
import { CirclePicker } from "react-color";
import DatetimeRangePicker from "react-datetime-range-picker";
import Button from "react-bootstrap/Button";
import Popup from "./Popup.jsx";

const EditEventPopup = ({
    activePopup,
    setActivePopup,
    changeEvent,
    removeEvent,
    errors,
    event,
    setEvent,
    colors,
    handleColorChange,
    handleDateChange,
}) => {
    return (
        <Popup active={activePopup} setActive={setActivePopup}>
            <Form onSubmit={changeEvent} className="popupForm">
                <div className="closePopupDiv">
                    <h2>Edit Event</h2>
                    <div
                        className="closePopupElement"
                        onClick={() => setActivePopup(false)}
                    >
                        <XCircle color="#0ea5e9" size={24} />
                    </div>
                </div>
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                        type="text"
                        placeholder="Enter title"
                        value={event.title}
                        onChange={(e) =>
                            setEvent({ ...event, title: e.target.value })
                        }
                    />
                </Form.Group>

                <Form.Group className="colorPicker">
                    <CirclePicker
                        width="100%"
                        colors={colors}
                        color={event.backgroundColor}
                        onChange={handleColorChange}
                    />
                </Form.Group>

                <Form.Group className="dateTimePickerBlock">
                    <DatetimeRangePicker
                        timeFormat=""
                        dateFormat="MM/DD/yyyy"
                        className="dateTimePicker"
                        startDate={event.start}
                        endDate={event.end}
                        onChange={handleDateChange}
                    />
                </Form.Group>

                <div className="popupBtnBlock">
                    <Button
                        variant="primary"
                        type="submit"
                        style={{ marginTop: "15px" }}
                    >
                        Edit Event
                    </Button>
                    <Button
                        variant="primary"
                        className="removeBtn"
                        onClick={removeEvent}
                    >
                        Delete Event
                    </Button>
                </div>
            </Form>
        </Popup>
    );
};

export default EditEventPopup;
