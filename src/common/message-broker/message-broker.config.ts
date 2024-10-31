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
      newTradeQueue: 'new-trade-queue',
      updateTradeQueue: 'update-trade-queue',
    },
    routingKeys: {
      tradeCreated: 'trade.created',
      tradeUpdated: 'trade.updated',
    },
  },
};
