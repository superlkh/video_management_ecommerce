const notifSubject = {
    user: 0,
    project: 1,
    folder: 2,
    video: 3,
    image: 4,
}

const notifType = {
    create: 0,
    read: 1,
    update: 2,
    delete: 3,
    warning: 4
}

const notifConfig = {
    notifSubject,
    notifType
}

export default notifConfig