export const MessageBrokerConfig = {
  user: {
    exchanges: {
      userExchange: 'user-exchange',
    },
    queues: {
      createUserEmailQueue: 'create-email-user-queue',
      recoverUserEmailQueue: 'recover-user-email-queue',

      userAnalyticsQueue: 'user-analytics-queue',
    },
    routingKeys: {
      userCreated: 'user.created',
      userRecover: 'user.recover',
    },
  },
};
