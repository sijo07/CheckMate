import ReactDOM from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

// Lazy-loaded components
const Login = lazy(() => import("./pages/auth/login.jsx"));
const Register = lazy(() => import("./pages/auth/register.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const Contact = lazy(() => import("./pages/contact"));
const Splash = lazy(() => import("./pages/splash.jsx"));

import Profile from "./pages/user/profile";
import ChangePassword from "./pages/user/changePass.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        index
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Splash />
          </Suspense>
        }
      />
      <Route
        path="/login"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/register"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        }
      />
      <Route
        path="/contact"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Contact />
          </Suspense>
        }
      />
      <Route
        path="/home"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        }
      />

      {/* Private Routes - Only accessible if authenticated */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/profile"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/changePassword"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ChangePassword />
            </Suspense>
          }
        />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
