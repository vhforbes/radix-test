export const MessageBrokerConfig = {
  user: {
    exchanges: {
      userExchange: 'user-exchange',
    },
    queues: {
      userEmailQueue: 'user-email-queue',
      userAnalyticsQueue: 'user-analytics-queue',
    },
    routingKeys: {
      userCreated: 'user.created',
      userRecover: 'user.recover',
    },
  },
};
