import { sendToBackground } from '@plasmohq/messaging'
import type { HandlerResponse, MessageAction } from './types'

// Helper function to send messages to the background service
export async function sendMessage<T>(action: MessageAction, data?: any): Promise<T> {
  try {
    const response = await sendToBackground<{ action: MessageAction, data?: any }, HandlerResponse<T>>({
      name: 'handler',
      body: { action, data }
    });

    if (!response.success) {
      throw new Error(response.error || "Unknown error occurred");
    }

    return response.data as T;
  } catch (error) {
    console.error(`Error in ${action} message:`, error);
    throw error;
  }
}