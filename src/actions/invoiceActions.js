export const invoiceReset = (evt) => {
    return {
        type: 'INVOICE_RESET',
        evt,
    }
}

export const addInvoiceTitle = (evt) => {
    return {
        type: 'ADD_INVOICE_TITLE',
        evt,
    }
}

export const addBuildName = (evt) => {
    return {
        type: 'ADD_BUILD_NAME',
        evt,
    }
}

export const addSenderName = (evt) => {
    return {
        type: 'ADD_SENDER_NAME',
        evt,
    }
}

export const addCurDate = (dateString) => {
    return {
        type: 'ADD_CUR_DATE',
        dateString,
    }
}

export const addDueDate = (dateString) => {
    return {
        type: 'ADD_DUE_DATE',
        dateString,
    }
}

export const addInvoiceNum = (evt) => {
    return {
        type: 'ADD_INVOICE_NUM',
        evt,
    }
}

export const addTerms = (evt) => {
    return {
        type: 'ADD_TERMS',
        evt,
    }
}

export const addNotes = (evt) => {
    return {
        type: 'ADD_NOTES',
        evt,
    }
}

export const applyCurrency = (currency) => {
    return {
        type: 'APPLY_CURRENCY',
        currency,
    }
}

export const applyDiscount = (evt) => {
    return {
        type: 'APPLY_DISCOUNT',
        evt,
    }
}

export const dragTaskRow = (data) => {
    return {
        type: 'DRAG_TASK_ROW',
        data,
    }
}

export const dragItemRow = (data) => {
    return {
        type: 'DRAG_ITEM_ROW',
        data,
    }
}

export const deleteTaskRow = (key) => {
    return {
        type: 'DELETE_TASK_ROW',
        key,
    }
}

export const deleteItemRow = (key) => {
    return {
        type: 'DELETE_ITEM_ROW',
        key,
    }
}

export const taskAction = (value, key, index, type) => {
    return {
        type: 'TASK_ACTION',
        value,
        key,
        index,
        fieldType: type,
    }
}

export const itemAction = (value, key, index, type) => {
    return {
        type: 'ITEM_ACTION',
        value,
        key,
        index,
        fieldType: type,
    }
}

export const addNewTaskRow = () => {
    return {
        type: 'ADD_NEW_TASK_ROW'
    }
}

export const addNewItemRow = () => {
    return {
        type: 'ADD_NEW_ITEM_ROW'
    }
}