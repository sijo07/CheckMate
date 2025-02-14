import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
import Loader from "../../components/loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Card className="w-full max-w-md bg-gray-950 text-white shadow-xl">
        <CardContent className="p-6">
          <h2 className="mb-4 text-3xl font-bold text-center">Welcome Back</h2>
          <p className="mb-6 text-center text-gray-400">
            Sign in to your account
          </p>

          <form onSubmit={submitHandler} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex items-center justify-between text-sm text-gray-400">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            {isLoading && <Loader />}
          </form>

          <div className="flex justify-center mt-4 space-x-3">
            <a
              href="#"
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <FaGoogle />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <FaTwitter />
            </a>
          </div>
          <p className="mt-4 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="text-teal-400 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
