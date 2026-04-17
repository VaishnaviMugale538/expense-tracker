import axios from "axios";
import AuthService from "./auth.service";
import API_BASE_URL from "./auth.config";

/* ================= USERS ================= */

const getAllUsers = (pageNumber, pageSize, searchKey) => {
    return axios.get(
        API_BASE_URL + "/user/getAll",
        {
            headers: AuthService.authHeader(),
            params: {
                pageNumber,
                pageSize,
                searchKey
            }
        }
    );
};

const disableOrEnableUser = (userId) => {
    return axios.delete(
        API_BASE_URL + "/user/disable",
        {
            headers: AuthService.authHeader(),
            params: { userId }
        }
    );
};

/* ================= TRANSACTIONS ================= */

const getAllTransactions = (pageNumber, pageSize, searchKey) => {
    return axios.get(
        API_BASE_URL + "/transaction/getAll",
        {
            headers: AuthService.authHeader(),
            params: {
                pageNumber,
                pageSize,
                searchKey
            }
        }
    );
};

/* ================= CATEGORIES ================= */

const getAllCategories = () => {
    return axios.get(
        API_BASE_URL + "/category/getAll",
        {
            headers: AuthService.authHeader()
        }
    );
};

const addNewCategory = (categoryName, transactionTypeId) => {
    return axios.post(
        API_BASE_URL + "/category/new",
        {
            categoryName,
            transactionTypeId
        },
        {
            headers: AuthService.authHeader()
        }
    );
};

const updateCategory = (categoryId, categoryName, transactionTypeId) => {
    return axios.put(
        API_BASE_URL + "/category/update",
        {
            categoryName,
            transactionTypeId
        },
        {
            headers: AuthService.authHeader(),
            params: { categoryId }
        }
    );
};

const disableOrEnableCategory = (categoryId) => {
    return axios.delete(
        API_BASE_URL + "/category/delete",
        {
            headers: AuthService.authHeader(),
            params: { categoryId }
        }
    );
};

/* ================= EXPORT ================= */

const AdminService = {
    getAllUsers,
    disableOrEnableUser,
    getAllTransactions,
    getAllCategories,
    addNewCategory,
    updateCategory,
    disableOrEnableCategory
};

export default AdminService;