import type { MessagesSlice } from './slices/messagesSlice'
import type { SubnetSlice } from './slices/subnetSlice'
import type { TransactionSlice } from './slices/transactionSlice'
import type { WalletSlice } from './slices/walletSlice'

// Define the complete context type with all slices combined
export interface SignetContextType extends SubnetSlice, TransactionSlice, WalletSlice, MessagesSlice { }