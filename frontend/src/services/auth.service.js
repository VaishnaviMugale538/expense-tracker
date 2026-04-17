import axios from "axios";
import API_BASE_URL from "./auth.config";

/* ================= REGISTER ================= */
const register_req = async (username, email, password) => {
return await axios.post(`${API_BASE_URL}/auth/signup`, {
userName: username,
email: email,
password: password,
});
};

/* ================= LOGIN ================= */
const login_req = async (email, password) => {
const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
email,
password,
});

console.log("LOGIN RESPONSE:", response.data);

// Store full response
if (response.data) {
localStorage.setItem("user", JSON.stringify(response.data));
}

return response;
};

/* ================= VERIFY REGISTRATION ================= */
const verifyRegistrationVerificationCode = async (verificationCode) => {
return await axios.get(`${API_BASE_URL}/auth/signup/verify`, {
params: { code: verificationCode },
});
};

const resendRegistrationVerificationCode = async (email) => {
return await axios.get(`${API_BASE_URL}/auth/signup/resend`, {
params: { email },
});
};

/* ================= CURRENT USER ================= */
const getCurrentUser = () => {
const user = JSON.parse(localStorage.getItem("user"));
return user?.data || user;
};

/* ================= LOGOUT ================= */
const logout_req = () => {
localStorage.removeItem("user");
};

/* ================= FORGOT PASSWORD ================= */
const forgotPasswordVerifyEmail = async (email) => {
return await axios.get(`${API_BASE_URL}/auth/forgotPassword/verifyEmail`, {
params: { email },
});
};

const forgotPasswordverifyCode = async (code) => {
return await axios.get(`${API_BASE_URL}/auth/forgotPassword/verifyCode`, {
params: { code },
});
};

const resendResetPasswordVerificationCode = async (email) => {
return await axios.get(`${API_BASE_URL}/auth/forgotPassword/resendEmail`, {
params: { email },
});
};

const resetPassword = async (email, password) => {
return await axios.post(`${API_BASE_URL}/auth/forgotPassword/resetPassword`, {
email,
currentPassword: "",
newPassword: password,
});
};

/* ================= AUTH HEADER ================= */
const authHeader = () => {
const user = getCurrentUser();
const token = user?.token || user?.accessToken;

if (token) {
return {
Authorization: `Bearer ${token}`,
};
}

return {};
};

/* ================= EXPORT ================= */
const AuthService = {
register_req,
login_req,
verifyRegistrationVerificationCode,
resendRegistrationVerificationCode,
getCurrentUser,
logout_req,
forgotPasswordVerifyEmail,
forgotPasswordverifyCode,
resendResetPasswordVerificationCode,
resetPassword,
authHeader,
};

export default AuthService;
