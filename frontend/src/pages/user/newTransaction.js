import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import UserService from '../../services/userService';
import TransactionForm from '../../components/userTransactions/transactionForm';
import TransactionTypeSelectWrapper from '../../components/userTransactions/transactionTypeSelectWrapper';
import Header from '../../components/utils/header';
import Loading from '../../components/utils/loading';
import useCategories from '../../hooks/useCategories';
import Info from '../../components/utils/Info';
import Container from '../../components/utils/Container';
import toast, { Toaster } from 'react-hot-toast';

const transactionTypes = [
    { id: 1, name: 'Expense' },
    { id: 2, name: 'Income' }
];

function NewTransaction() {

    const [categories, isFetching] = useCategories();
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [activeTransactionType, setTransactionType] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (categories && categories.length > 0) {
            setFilteredCategories(
                categories.filter(
                    cat => cat.transactionType.transactionTypeId === activeTransactionType
                )
            );
        } else {
            setFilteredCategories([]);
        }
    }, [categories, activeTransactionType]);

    const onSubmit = async (data) => {
        setIsSaving(true);

        try {
            const response = await UserService.add_transaction(
                AuthService.getCurrentUser().email,
                data.category,
                data.description,
                data.amount,
                data.date
            );

            if (response.data.status === "SUCCESS") {
                toast.success("Transaction added successfully!");
                navigate("/user/transactions", {
                    state: { text: response.data.response }
                });
            }

        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.response);
            } else {
                toast.error("Failed to add transaction: Try again later!");
            }
        }

        setIsSaving(false);
    };

    return (
        <Container activeNavId={2}>
            <Header title="New Transaction" />
            <Toaster />

            {/* Loading */}
            {isFetching && <Loading />}

            {/* No categories message */}
            {!isFetching && categories.length === 0 && (
                <Info text="No categories found. Please add categories from admin panel." />
            )}

            {/* ALWAYS SHOW FORM */}
            {!isFetching && (
                <>
                    <TransactionTypeSelectWrapper
                        transactionTypes={transactionTypes}
                        setTransactionType={setTransactionType}
                        activeTransactionType={activeTransactionType}
                    />

                    <TransactionForm
                        categories={filteredCategories}
                        onSubmit={onSubmit}
                        isSaving={isSaving}
                    />
                </>
            )}
        </Container>
    );
}

export default NewTransaction;