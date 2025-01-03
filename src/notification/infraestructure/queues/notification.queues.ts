export const NotificationQueues = [
    { name: 'ProductEvents/ProductRegistered', pattern: 'ProductRegistered' },
    { name: 'BundleEvents/BundleRegistered', pattern: 'BundleRegistered' },
    { name: 'OrderEvents/OrderRegistered', pattern: 'OrderRegistered' },
    { name: 'OrderEvents/CancelOrder', pattern: 'OrderStatusCancelled' },
    { name: 'OrderEvents/OrderStatusDelivering', pattern: 'OrderStatusDelivering' },
    { name: 'OrderEvents/OrderStatusDelivered', pattern: 'OrderStatusDelivered' },
    { name: 'CuponEvents/Createcupon', pattern: 'CuponRegistered' },
  ]