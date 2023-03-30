self.addEventListener("push", e => {

    const data = e.data.json();
    const options = {
        body: 'New notification from Manage Video for Ecommerce',
        // icon: 'images/example.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
        },
        // actions: [
        //     {action: 'explore', title: 'Explore this new world',
        //         icon: 'images/checkmark.png'},
        //     {action: 'close', title: 'Close',
        //         icon: 'images/xmark.png'},
        // ]
    }
    self.registration.showNotification(
        data.title, // title of the notification
        options
    );
});