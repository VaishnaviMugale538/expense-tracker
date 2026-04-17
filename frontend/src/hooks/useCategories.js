import { useEffect, useState } from "react";
import UserService from "../services/userService";
import toast from "react-hot-toast";

function useCategories() {
    const [categories, setCategories] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await UserService.get_categories();

                if (response.data.status === "SUCCESS") {
                    setCategories(response.data.response);
                }

            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.response);
                } else {
                    toast.error("Failed to fetch categories!");
                }
            }

            setIsFetching(false);
        };

        getCategories();
    }, []);

    return [categories, isFetching];
}

export default useCategories;