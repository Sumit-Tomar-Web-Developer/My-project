import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import CustomPageTitle from '../../../../Components/Common/CustomPageTitle';
import ViewExpense from './ViewExpense';

export default function ViewExpenseDetails() {
    const { expenseId } = useParams();
    return (
        <Fragment>
            <CustomPageTitle title={"Expense Details : EXPENSE_" + expenseId} />
            <ViewExpense expenseId={expenseId} />
        </Fragment>
    );
}