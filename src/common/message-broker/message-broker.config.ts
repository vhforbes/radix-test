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
  trade: {
    exchanges: {
      tradeExchange: 'trade-exchange',
    },
    queues: {
      tradeEmailQueue: 'trade-email-queue',
      tradeAnalyticsQueue: 'trade-analytics-queue',
    },
    routingKeys: {
      tradeCreated: 'trade.created',
      tradeCreated2: 'trade.created2',
    },
  },
};
