# Widget SDK

The TECSAFE Widget SDK provides a convenience wrapper to interact with TECSAFE Widgets, handling IFrame communication and JWT management automatically.

The full API documentation can be found on [tecsafe.github.io/widget-sdk](https://tecsafe.github.io/widget-sdk).

## API Usage

The Widget SDK is publicly available on npm. You can install it via npm or yarn:

```bash
npm install @tecsafe/widget-sdk
```

### Initialize the SDK

First, initialize the [`TecsafeWidgetManager`](https://tecsafe.github.io/widget-sdk/classes/TecsafeWidgetManager.html).
It requires three arguments:

1. [`customerTokenCallback`](https://tecsafe.github.io/widget-sdk/types/CustomerTokenCallback.html): A function returning a promise with the customer token, which your backend needs to request from our API.
2. [`addToCartCallback`](https://tecsafe.github.io/widget-sdk/types/AddToCartHandler.html): An object implementing either a `single` or `bulk` add to cart handler.
3. [`widgetManagerConfig`](https://tecsafe.github.io/widget-sdk/classes/WidgetManagerConfig.html): The SDK configuration containing tracking and regional settings.

```typescript
import { TecsafeWidgetManager } from '@tecsafe/widget-sdk'

const manager = new TecsafeWidgetManager(
  // 1. Customer Token Callback
  async (oldToken?: string) => {
    const response = await fetch('https://mybackend.com/tecsafe/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldToken,
      }),
    })
    const json = await response.json()
    return json.token
  },
  // 2. Add To Cart Handler
  {
    single: async (articleNumber, quantity, configurationId) => {
      // Your custom logic to add an item to the cart
      return true // Return boolean to indicate success
    },
  },
  // 3. Configuration
  new WidgetManagerConfig({
    trackingAllowed: true,
    languageRFC4647: 'en-US',
    currencyCodeISO4217: 'USD',
    taxIncluded: true,
  })
)
```

It is important to instantiate the manager only once, as otherwise the SDK could fetch multiple tokens or cause duplicate event bindings.

### Create a Widget

Use the manager instance to create widgets and attach them to DOM elements.

```javascript
const pdWidget = manager.createProductDetailWidget(
  document.getElementById('product-detail-widget')
)
```

### Update the Token

If a user logs in or logs out, you can update the token by calling the [`refreshToken`](https://tecsafe.github.io/widget-sdk/classes/TecsafeWidgetManager.html#refreshToken) method.

```javascript
manager.refreshToken()
// This will call the customerTokenCallback from the constructor.
// Alternatively, you can also pass the token directly:
manager.refreshToken('new-token')
```

### Destroy All Widgets

If a user withdraws consent, or navigates away from the page (relevant for SPAs), you can destroy all widgets and clean up event listeners by calling the [`destroyAll`](https://tecsafe.github.io/widget-sdk/classes/TecsafeWidgetManager.html#destroyAll) method.

```javascript
manager.destroyAll()
```

### Events and Documentation

When referring to the generated SDK documentation for events:

- The **`InMessageInternal`** category can be mostly ignored, as these events are handled internally by the SDK.
- The **[`OutMessage`](https://tecsafe.github.io/widget-sdk/types/OutMessage.html)** category primarily contains responses or status update events that the SDK also handles internally.
- If you are expected to respond to an event, it will be clearly stated in the description of an **[`InMessage`](https://tecsafe.github.io/widget-sdk/types/InMessage.html)**.
- It is recommended to implement as many **[`InMessage`](https://tecsafe.github.io/widget-sdk/types/InMessage.html)** handlers as possible, to ensure the best user experience.

## Architecture and Flows

Understanding the internal flows of the Widget SDK ensures a smooth integration into your project, especially regarding authentication and cart interactions.

### Authentication Flow (Token Management)

The TECSAFE Widget manager requires a valid customer token to identify users and link configurations to their sessions. It handles both guest and authenticated user sessions efficiently:

- When the SDK needs a token, it delegates to the [`customerTokenCallback`](https://tecsafe.github.io/widget-sdk/types/CustomerTokenCallback.html) provided upon initialization. This naturally occurs when the session requires a token or when it expires.
- Your frontend is expected to hook this up to one of the APIs providing the token. The frontend requests a new token from your backend, passing along any `oldToken` provided by the SDK.
- Your backend validates the user (or guest session) via your own auth logic (e.g., checking standard cookies/headers), and requests a `customerToken` from the TECSAFE API.
- **Session Upgrading:** The SDK uses the `oldToken` provided in the callback to maintain continuity. When your backend requests a new `customerToken` from the TECSAFE API, it is **strictly necessary** to forward this `oldToken` as part of the request. The TECSAFE backend will then automatically merge the sessions. This guarantees that any products configured during a guest session are seamlessly preserved and assigned to the user after they log in or jump across states without data loss.

![Authentication Flow](mermaid/auth-flow.png)

### Responding to Widget Events (e.g., RequestArticleInfo)

While the SDK handles internal events (like adding to the cart using your callback), you will often need to listen to and respond to specific widget events manually. **Even though every event is optional, it is highly recommended to implement as many as possible to significantly enhance the user experience.**

A prime example is providing article details when the widget requests them. Advanced features like upselling and proactive price previews strictly need the article info event to function correctly. Without implementing this event, the widget will only be able to show a "Price will be calculated in the cart" placeholder.

- When a widget needs to render product details or prices, it emits an [`InMessageRequestArticleInfo`](https://tecsafe.github.io/widget-sdk/variables/InMessageRequestArticleInfo.html) event.
- Your application must listen to this event using the SDK's [`.on()`](https://tecsafe.github.io/widget-sdk/classes/TecsafeWidgetManager.html#on) methodology.
- Once you retrieve the corresponding info from your backend or state, you respond directly using the [`.respond()`](https://tecsafe.github.io/widget-sdk/interfaces/WidgetMessageEvent.html#respond) function attached to the event payload.
- You MUST respond with [`OutMessageArticleInfo`](https://tecsafe.github.io/widget-sdk/variables/OutMessageArticleInfo.html), providing either the details (like name and price) or `null` if the article is missing (so the widget can quickly show fallback UI rather than timing out).

![Article Info Flow](mermaid/article-info-flow.png)

### Page Transitions and Widget Lifecycle

When navigating within a Single Page Application (SPA), it is crucial to handle the widget lifecycle properly to avoid duplicate instances or memory leaks.

When a page transition occurs (e.g., leaving a product detail page), you should:

1. Call [`.destroy()`](https://tecsafe.github.io/widget-sdk/classes/BaseWidget.html#destroy) on the specific widget (e.g., if rendering a different product view), OR
2. Call [`.destroyAll()`](https://tecsafe.github.io/widget-sdk/classes/TecsafeWidgetManager.html#destroyAll) on the manager if no widgets are needed on the next view. This safely cleans up and resets the internal token refresh timeout.

![Widget Lifecycle](mermaid/widget-lifecycle.png)

**Manager Reset and Reuse:**
If you used `destroyAll()`, the current `TecsafeWidgetManager` cleans up efficiently. While you _can_ recycle and reuse the manager for [`.createProductDetailWidget()`](https://tecsafe.github.io/widget-sdk/classes/TecsafeWidgetManager.html#createProductDetailWidget) loops again later on, it is generally easier to instantiate a **new** [`TecsafeWidgetManager`](https://tecsafe.github.io/widget-sdk/classes/TecsafeWidgetManager.html) upon mounting the integration point again. However, if your Vue/React wrapper remains globally alive across routes, reusing the existing `.destroyAll()`-cleaned manager is perfectly fine and maintains the browser session. Tho `.destroyAll()` should not be needed for a cleanly implemented SPA which always
cleans up behind itself, using for example `onBeforeUnmount` or `useEffect` to destroy the widget, like in the example below.

## Example Implementation

### Vue.js

```html
<template>
  <shop-base>
    <product-preview />
    <div ref="container" />
    <product-detail />
    <product-comments />
  </shop-base>
</template>

<script lang="ts" setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue'
  import { TecsafeWidgetManager } from '@tecsafe/widget-sdk'

  const container = ref<HTMLElement | null>(null)
  const manager = ref<TecsafeWidgetManager | null>(null)

  onMounted(() => {
    if (!container.value) throw new Error('Container not found')

    manager.value = new TecsafeWidgetManager(
      async () => {
        const response = await fetch('https://mybackend.com/tecsafe/token')
        const json = await response.json()
        return json.token
      },
      {
        single: async (articleNumber, quantity, configurationId) => {
          // Implementation
          return true
        },
      },
      new WidgetManagerConfig({
        trackingAllowed: true,
        languageRFC4647: 'en-US',
        currencyCodeISO4217: 'USD',
        taxIncluded: true,
      })
    )

    manager.value.createProductDetailWidget(container.value)
    manager.value.on(InMessageRequestArticleInfo, (e) => {

  })

  onBeforeUnmount(() => {
    if (!manager.value) return
    manager.value.destroyAll()
  })
</script>
```

### Pure HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tecsafe Widget SDK</title>
  </head>
  <body>
    <div id="product-detail-widget"></div>
    <script src="https://unpkg.com/@tecsafe/widget-sdk@latest/dist/index.js"></script>
    <script>
      const manager = new TecsafeWidgetManager(
        async (oldToken) => {
          const response = await fetch('https://mybackend.com/tecsafe/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              oldToken,
            }),
          })
          const json = await response.json()
          return json.token
        },
        {
          single: async (articleNumber, quantity, configurationId) => {
            // Implementation
            return true
          },
        },
        new WidgetManagerConfig({
          trackingAllowed: true,
          languageRFC4647: 'en-US',
          currencyCodeISO4217: 'USD',
          taxIncluded: true,
        })
      )
      manager.createProductDetailWidget(
        document.getElementById('product-detail-widget')
      )
    </script>
  </body>
</html>
```
