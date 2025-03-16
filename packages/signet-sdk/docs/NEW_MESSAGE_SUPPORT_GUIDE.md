# Adding New Message Types to Signet SDK

This guide provides a step-by-step process for adding support for new message types in the Signet SDK ecosystem. Follow these steps to ensure all parts of the system are updated correctly.

## Overview of Message Flow

```
Web App → Signet SDK → Chrome Extension (content script) → Background Service → Implementation
```

## Step 1: Define the Message Type

Add a new message type to the `MessageType` enum in `signet-sdk/src/messaging.ts`.

```typescript
export enum MessageType {
  // Existing message types...
  
  // Your new message type
  MY_NEW_MESSAGE_TYPE = 'my_new_message_type'
}
```

## Step 2: Define Interface Types (Optional)

If your message requires specific parameters, define an interface in the SDK's `index.ts` file:

```typescript
// Define the parameters for your message
export interface MyNewMessageParams {
  paramOne: string;
  paramTwo: number;
  optionalParam?: boolean;
}

// Define the response structure
export interface MyNewMessageResponse {
  success: boolean;
  result?: any;
  error?: string;
}
```

## Step 3: Add SDK Function

Add a helper function to `signet-sdk/src/index.ts` that handles the message request:

```typescript
/**
 * My new message helper function description
 * @param params The parameters for the message
 * @returns A promise resolving to the response
 */
export async function myNewMessageFunction(params: MyNewMessageParams): Promise<MyNewMessageResponse> {
  try {
    const response = await request<MyNewMessageParams, MyNewMessageResponse>({
      type: MessageType.MY_NEW_MESSAGE_TYPE,
      data: params
    }, 0); // 0 means no timeout - adjust as needed
    
    return response.data;
  } catch (error) {
    console.error('Failed to execute my new message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

## Step 4: Add Message Handler in Extension

### 4.1 Update isSupportedMessageType

Add your new message type to the supported types list in `message-handler-service.ts`:

```typescript
isSupportedMessageType(type: MessageType): boolean {
  return [
    // Existing types...
    MessageType.MY_NEW_MESSAGE_TYPE
  ].includes(type)
}
```

### 4.2 Add a message handler method

In the `MessageHandlerService` class, add a handler method for your new message:

```typescript
/**
 * Handle MY_NEW_MESSAGE_TYPE message
 */
async handleMyNewMessageType(message: Message): Promise<void> {
  try {
    // Extract parameters from the message
    const params = message.data as MyNewMessageParams;
    
    // Validate parameters
    if (!params.paramOne || typeof params.paramTwo !== 'number') {
      throw new Error("Required parameters missing or invalid");
    }
    
    // Forward to background script for processing
    const result = await this.sendMessage<MyNewMessageResponse>(
      "myNewMessageAction", 
      params
    );
    
    // Optional: Refresh state after operation
    if (this.blockchainSlice) {
      this.blockchainSlice.refreshStatus();
    }
    
    respond(message, result);
  } catch (error) {
    respond(message, undefined, {
      code: 'MY_NEW_MESSAGE_ERROR',
      message: error instanceof Error ? error.message : 'Operation failed'
    });
  }
}
```

### 4.3 Update the handleMessage switch statement

Add your new message type to the switch statement in `handleMessage`:

```typescript
async handleMessage(message: Message): Promise<void> {
  switch (message.type) {
    // Existing cases...
    
    case MessageType.MY_NEW_MESSAGE_TYPE:
      await this.handleMyNewMessageType(message);
      break;
      
    // Default case...
  }
}
```

## Step 5: Implement Background Handler

Update the background handler.ts file to handle your new message action:

```typescript
// In the switch statement of the handler function:
case "myNewMessageAction":
  // Validate input data
  if (!data.paramOne || typeof data.paramTwo !== 'number') {
    throw new Error("Invalid parameters");
  }
  
  // Implement the action
  response = await someModule.performAction({
    paramOne: data.paramOne,
    paramTwo: data.paramTwo,
    optionalParam: data.optionalParam
  });
  break;
```

## Step 6: Implement Integration Module (if needed)

If your message requires a new integration module (like Dexterity), create a dedicated file in `background/lib/` to handle the implementation details.

## Step 7: Test the Message Flow

1. Test SDK function directly in a web app
2. Validate message is received by content script
3. Verify background handler processes the message correctly
4. Check response is correctly returned to the app

## Common Patterns

### Parameter Validation

Always validate parameters at each step of the message flow:
1. In the SDK helper function
2. In the content script handler
3. In the background handler

### Error Handling 

Use consistent error patterns:
```typescript
try {
  // Implementation
} catch (error) {
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
  };
}
```

### Response Format

Maintain consistent response structure:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

## Example: Adding a Deployment Message Type

See the implementation of `DEPLOY_TOKEN_SUBNET` and `GENERATE_SUBNET_CODE` in the codebase for a complete example of adding new message types that interact with external services (Dexterity in this case).

By following this guide, you ensure that all parts of the Signet SDK ecosystem are properly updated to support your new message type.