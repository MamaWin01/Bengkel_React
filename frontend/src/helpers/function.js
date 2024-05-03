async function initModal(data, type, id='') {
    if(data == 'open') {
        switch (type) {
            case 'CreateBook':
                return true
            break;
        }
    } else {
        switch (type) {
            case 'CreateBook':
                return false
            break;
        }
    }
}

export {
    initModal,
}