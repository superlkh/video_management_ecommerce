// const publicVapidKey = 'BP_3jwae0tK6NhJ7UWQoR7-kTSQSJCF6SK2XmQYK10CCCcpK6FLrDY6xiHks3vmk_Dz3kGcW7Ysm0h7F6V4W4YM'
import webPush from 'web-push'


const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}   

const notifServiceRegister = async() => {
  if('serviceWorker' in navigator){
    const register = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/worker.js`, {
      scope: '/'
    })

    const sub = await register.pushManager.getSubscription()
    
    if(sub)(
      await sub.unsubscribe()
    )
    
    const key = webPush.generateVAPIDKeys()
    
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
  
    //public vapid key
      // applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      applicationServerKey: urlBase64ToUint8Array(key.publicKey)

    })

    return {
      subscription: subscription,
      publicKey: key.publicKey,
      privateKey: key.privateKey
    }
  }

  return null
 
}

export default notifServiceRegister