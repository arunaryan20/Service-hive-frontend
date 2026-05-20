import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/auth.service";
import Toast from "../components/Toast";
  
const Login = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  }); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });    

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginAdmin(formData);
      setToast({
        message: response.message,
        type: "success",
      });

      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error:any) {
      setToast({
        message: error?.response?.data?.message || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to your account</p>
        </div>
        <Toast
          message={toast.message}
          type={toast.type as "success" | "error"}
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 cursor-pointer"
          >
            Login
          </button>
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
              >
                Signup
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
