import { createBrowserRouter } from "react-router-dom";
import Login from "./views/auth/Login.jsx";
import Signup from "./views/auth/Signup.jsx";
import NotFound from "./views/NotFound";
import DefaultLayout from "./components/defaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Calendar from "./views/calendar/Calendar.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Calendar />,
            },
            {
                path: "/calendar",
                element: <Calendar />,
            },

        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
