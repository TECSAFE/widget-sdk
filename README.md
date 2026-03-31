# Widget SDK

The TECSAFE Widget SDK provides a convenience wrapper to interact with TECSAFE Widgets, handling IFrame communication and JWT management automatically.

The full API documentation can be found on [tecsafe.github.io/widget-sdk](https://tecsafe.github.io/widget-sdk).

## API Usage

The Widget SDK is publicly available on npm. You can install it via npm or yarn:

```bash
npm install @tecsafe/widget-sdk
```

### Initialize the SDK

First, initialize the `TecsafeWidgetManager`. It requires three arguments:

1. `customerTokenCallback`: A function returning a promise with the customer token, which your backend needs to request from our API.
2. `addToCartCallback`: An object implementing either a `single` or `bulk` add to cart handler.
3. `config`: The SDK configuration containing tracking and regional settings.

```typescript
import { TecsafeWidgetManager } from '@tecsafe/widget-sdk'

const manager = new TecsafeWidgetManager(
  // 1. Customer Token Callback
  async () => {
    const response = await fetch('https://mybackend.com/tecsafe/token')
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
  {
    trackingAllowed: true,
    languageRFC4647: 'en-US',
    currencyCodeISO4217: 'USD',
    taxIncluded: true,
  }
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

If a user logs in or logs out, you can update the token by calling the `refreshToken` method.

```javascript
manager.refreshToken()
// This will call the customerTokenCallback from the constructor.
// Alternatively, you can also pass the token directly:
manager.refreshToken('new-token')
```

### Destroy All Widgets

If a user withdraws consent, or navigates away from the page (relevant for SPAs), you can destroy all widgets and clean up event listeners by calling the `destroyAll` method.

```javascript
manager.destroyAll()
```

### Events and Documentation

When referring to the generated SDK documentation for events:

- The **`InMessageInternal`** category can be mostly ignored, as these events are handled internally by the SDK.
- The **`OutMessage`** category primarily contains responses or status update events that the SDK also handles internally.
- If you are expected to respond to an event, it will be clearly stated in the description of an **`InMessage`**.
- It is recommended to implement as many **`InMessage`** handlers as possible, to ensure the best user experience.

## Example Implementation (Vue.js)

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

## Example Implementation (Pure HTML)

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
    <script src="https://unpkg.com/@tecsafe/widget-sdk@latest/dist/index.cjs"></script>
    <script>
      const manager = new TecsafeWidgetManager(
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
      manager.createProductDetailWidget(
        document.getElementById('product-detail-widget')
      )
    </script>
  </body>
</html>
```
