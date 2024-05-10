async function initModal(data, type, id='') {
    if(data == 'open') {
        switch (type) {
            case 'CreateBook':
            case 'SearchBook':
                return true
            break;
        }
    } else {
        switch (type) {
            case 'CreateBook':
            case 'SearchBook':
                return false
            break;
        }
    }
}

export {
    initModal,
}