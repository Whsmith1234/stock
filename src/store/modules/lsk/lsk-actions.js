import baseActions from '../lsk-base/lsk-base-actions'
import LskApi from '../../../lib/lisk/lisk-api'

const TX_CHUNK_SIZE = 25
const TX_FETCH_INTERVAL = 10 * 1000

const customActions = getApi => ({
  updateStatus (context) {
    const api = getApi()

    if (!api) return
    api.getBalance().then(balance => {
      if (balance) {
        context.commit('status', { balance })
      }
    })

    // // The estimated fee rate is also needed
    // api.getFeeRate().then(rate => context.commit('feeRate', rate))

    // Last block height
    context.dispatch('updateHeight')
  },

  updateHeight ({ commit }) {
    const api = getApi()
    if (!api) return
    api.getHeight().then(height => {
      if (height) {
        commit('height', height)
      }
    })
  },

  /**
   * Updates the transaction details
   * @param {{ dispatch: function, getters: object }} param0 Vuex context
   * @param {{hash: string}} payload action payload
   */
  updateTransaction ({ dispatch, getters }, payload) {
    const tx = getters['transaction'](payload.hash)

    if (tx && (tx.status === 'SUCCESS' || tx.status === 'ERROR')) {
      // If transaction is in one of the final statuses (either succeeded or failed),
      // just update the current height to recalculate its confirmations counter.
      return dispatch('updateHeight')
    } else {
      // Otherwise fetch the transaction details
      return dispatch('getTransaction', payload)
    }
  }
})

const retrieveNewTransactions = async (api, context, latestTxId, toTx) => {
  const transactions = await api.getTransactions({ toTx })
  context.commit('transactions', transactions)

  if (latestTxId && !transactions.some(x => x.txid === latestTxId)) {
    const oldest = transactions[transactions.length - 1]
    await getNewTransactions(api, context, latestTxId, oldest && oldest.txid)
  }
}

const getNewTransactions = async (api, context) => {
  // Determine the most recent transaction ID
  const latestTransaction = context.getters['sortedTransactions'][0]
  const latestId = latestTransaction && latestTransaction.txid
  // Now fetch the transactions until we meet that latestId among the
  // retrieved results
  await retrieveNewTransactions(api, context, latestId)
}

const getOldTransactions = async (api, context) => {
  const transactions = context.getters['sortedTransactions']
  const oldestTx = transactions[transactions.length - 1]
  const toTx = oldestTx && oldestTx.txid

  const chunk = await api.getTransactions({ toTx })
  context.commit('transactions', chunk)

  if (chunk.length < TX_CHUNK_SIZE) {
    context.commit('bottom')
  }
}

export default {
  ...baseActions({
    apiCtor: LskApi,
    getOldTransactions,
    getNewTransactions,
    customActions,
    fetchRetryTimeout: TX_FETCH_INTERVAL
  })
}
