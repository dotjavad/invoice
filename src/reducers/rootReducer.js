import { v4 } from 'uuid';

const initState = {
    buildName: '',
    senderName: '',
    invoiceTitle: '',
    invoiceNum: '',
    currentDate: '',
    dueDate: '',
    currency: '$',
    totalPrice: '0.00',
    discountPercent: '0',
    discountValue: '0.00',
    terms: '',
    notes: '',
    tasks: [],
    items: [],
};

const rootReducer = (state = initState, action) => {

    if (action.type === 'INVOICE_RESET') {

        return {
            ...initState,
        }

    }

    if (action.type === 'ADD_INVOICE_TITLE') {
        return {
            ...state,
            invoiceTitle: action.evt.target.value,
        }
    }

    if (action.type === 'ADD_BUILD_NAME') {
        return {
            ...state,
            buildName: action.evt.target.value,
            errors: { buildName: (action.evt.target.value === '') }
        }
    }

    if (action.type === 'ADD_SENDER_NAME') {
        return {
            ...state,
            senderName: action.evt.target.value,
        }
    }

    if (action.type === 'ADD_CUR_DATE') {
        return {
            ...state,
            currentDate: action.dateString,
        }
    }

    if (action.type === 'ADD_DUE_DATE') {
        return {
            ...state,
            dueDate: action.dateString,
        }
    }

    if (action.type === 'ADD_INVOICE_NUM') {
        return {
            ...state,
            invoiceNum: action.evt.target.value,
        }
    }

    if (action.type === 'ADD_TERMS') {
        return {
            ...state,
            terms: action.evt.target.value,
        }
    }

    if (action.type === 'ADD_NOTES') {
        return {
            ...state,
            notes: action.evt.target.value,
        }
    }

    if (action.type === 'APPLY_CURRENCY') {
        return {
            ...state,
            currency: action.currency,
        }
    }

    if (action.type === 'APPLY_DISCOUNT') {

        const re = /^[0-9.\b]+$/;

        const disPercent = (action.evt.target.value > 100 || action.evt.target.value === '' || !re.test(action.evt.target.value)) ? '0' : action.evt.target.value / 100;

        const disValue = (disPercent !== '0' || state.totalPrice !== '0') ? state.totalPrice * disPercent : '0';

        return {
            ...state,
            discountPercent: disPercent,
            discountValue: Number(disValue).toFixed(2),
        }

    }

    if (action.type === 'DRAG_TASK_ROW') {

        return {
            ...state,
            tasks: action.data,
        }

    }

    if (action.type === 'DRAG_ITEM_ROW') {

        return {
            ...state,
            items: action.data,
        }

    }

    if (action.type === 'DELETE_TASK_ROW') {

        const newTasks = state.tasks.filter(task => task.key !== action.key);
        const deletedTask = state.tasks.filter(task => task.key === action.key);
        const newTotalPrice = typeof deletedTask === 'undefined' ? 0 : Number(state.totalPrice) - Number(deletedTask[0].total)

        return {
            ...state,
            totalPrice: newTotalPrice,
            tasks: newTasks,
        }

    }

    if (action.type === 'DELETE_ITEM_ROW') {


        const newItems = state.items.filter(item => item.key !== action.key);
        const deletedItem = state.items.filter(item => item.key === action.key);
        const newTotalPrice = typeof deletedItem === 'undefined' ? 0 : Number(state.totalPrice) - Number(deletedItem[0].total)

        return {
            ...state,
            totalPrice: newTotalPrice,
            items: newItems,
        }

    }

    const calcTotal = () => {

        const tasksTotal = state.tasks.length > 0 ? state.tasks
            .reduce((acc, cur) => (Number(acc) + Number(cur.total)), 0) : 0;

        const itemsTotal = state.items.length > 0 ? state.items
            .reduce((acc, cur) => (Number(acc) + Number(cur.total)), 0) : 0;

        const newTasksTotal = (typeof tasksTotal === 'number') ? Number(tasksTotal) : Number(tasksTotal.total);

        const newItemsTotal = (typeof itemsTotal === 'number') ? Number(itemsTotal) : Number(itemsTotal.total);

        const newTotalPrice = newTasksTotal + newItemsTotal;
        const newTotalPriceOff = (newTasksTotal + newItemsTotal) * state.discountPercent;

        return {
            totalPrice: newTotalPrice.toFixed(2),
            discountValue: newTotalPriceOff,
        }

    }

    if (action.type === 'TASK_ACTION') {

        const re = /^[0-9.\b]+$/;
        const data = state.tasks;
        let curTask = data.filter(task => task.key === action.key);

        action.fieldType === 'title' && (curTask[0].details.title = action.value.target.value);
        action.fieldType === 'desc' && (curTask[0].details.desc = action.value.target.value);
        (action.value === '' || re.test(action.value)) && action.fieldType === 'rate' && (curTask[0].rate = action.value);
        (action.value === '' || re.test(action.value)) && action.fieldType === 'hours' && (curTask[0].hours = action.value);
        curTask[0].total = Number(curTask[0].rate) * Number(curTask[0].hours);

        let newTasks = [...data.slice(0, action.index), ...curTask, ...data.slice(action.index + 1)];

        const { totalPrice, discountValue } = calcTotal();

        if (curTask[0].rate !== '' && curTask[0].hours !== '') {

            return {
                ...state,
                tasks: newTasks,
                totalPrice,
                discountValue,
            }

        } else {

            return {
                ...state,
                tasks: newTasks,
            }
        }


    }

    if (action.type === 'ITEM_ACTION') {

        const re = /^[0-9.\b]+$/;
        const data = state.items;
        let curItem = data.filter(item => item.key === action.key);

        action.fieldType === 'title' && (curItem[0].details.title = action.value.target.value);
        action.fieldType === 'desc' && (curItem[0].details.desc = action.value.target.value);
        (action.value === '' || re.test(action.value)) && action.fieldType === 'price' && (curItem[0].price = action.value);
        (action.value === '' || re.test(action.value)) && action.fieldType === 'qty' && (curItem[0].qty = action.value);
        curItem[0].total = Number(curItem[0].price) * Number(curItem[0].qty);

        let newItems = [...data.slice(0, action.index), ...curItem, ...data.slice(action.index + 1)];

        const { totalPrice, discountValue } = calcTotal();

        if (curItem[0].qty !== '' && curItem[0].price !== '') {

            return {
                ...state,
                items: newItems,
                totalPrice,
                discountValue,
            }

        } else {

            return {
                ...state,
                items: newItems,
            }
        }

    }

    if (action.type === 'ADD_NEW_TASK_ROW') {

        return {
            ...state,
            tasks: [...state.tasks, {
                key: `${v4()}`,
                details: {
                    title: '',
                    desc: '',
                },
                rate: "0",
                hours: "0",
                total: "0.00",
            }]
        }

    }

    if (action.type === 'ADD_NEW_ITEM_ROW') {

        return {
            ...state,
            items: [...state.items, {
                key: `${v4()}`,
                details: {
                    title: '',
                    desc: '',
                },
                price: "0",
                qty: "0",
                total: "0.00",
            }]
        }

    }

    return state;
};

export default rootReducer;