export const MessageBrokerConfig = {
  user: {
    exchanges: {
      userExchange: 'user-exchange',
    },
    queues: {
      newUserEmailQueue: 'new-user-email-queue',
      recoverUserEmailQueue: 'recover-user-email-queue',
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
