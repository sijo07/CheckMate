import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";
import { useRegisterMutation } from "../../redux/api/userApiSlice";
import { MdExpandMore } from "react-icons/md";
import Loader from "../../components/loader";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const newUser = { username, email, password };
        const res = await register(newUser).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (error) {
        toast.error(error.data.message || error.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-lg bg-gray-950 shadow-2xl rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-200 text-center mb-4">
            Create an Account
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Enter your details to register
          </p>
          <form onSubmit={submitHandler} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 bg-gray-800 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-red-800 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-200"
            >
              {isLoading ? "Registering..." : "Sign Up"}
            </button>
            {isLoading && <Loader />}
          </form>
        </div>
        <div className="bg-red-800 text-white py-6 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="font-semibold underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
