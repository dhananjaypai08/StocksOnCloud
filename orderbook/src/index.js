import express from "express";
import { OrderInputSchema } from "./types.js";
import { orderbook, bookWithQuantity } from "./orderbook.js";
import cors from "cors";

const BASE_ASSET = "APPLE";

const app = express();
app.use(express.json());
app.use(cors());

let GLOBAL_TRADE_ID = 0;

app.post("/api/v1/order", (req, res) => {
  const order = OrderInputSchema.safeParse(req.body);
  if (!order.success) {
    res.status(400).send(order.error.message);
    return;
  }

  const { baseAsset, price, quantity, side, kind } = order.data;
  const orderId = getOrderId();

  if (baseAsset !== BASE_ASSET) {
    res.status(400).send("Invalid base asset");
    return;
  }

  const { executedQty, fills } = fillOrder(
    orderId,
    price,
    quantity,
    side,
    kind
  );

  res.send({
    orderId,
    executedQty,
    fills,
    orderBook: orderbook,
  });
});

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});

function getOrderId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function fillOrder(orderId, price, quantity, side, type) {
  const fills = [];
  const maxFillQuantity = getFillAmount(price, quantity, side); // 20
  let executedQty = 0;

  if (type === "ioc" && maxFillQuantity < quantity) {
    return { status: "rejected", executedQty: maxFillQuantity, fills: [] };
  }

  if (side === "buy") {
    // asks should be sorted before you try to fill them
    orderbook.asks.forEach((o) => {
      if (o.price <= price && quantity > 0) {
        const filledQuantity = Math.min(quantity, o.quantity);
        o.quantity -= filledQuantity;
        bookWithQuantity.asks[o.price] =
          (bookWithQuantity.asks[o.price] || 0) - filledQuantity;
        fills.push({
          price: o.price,
          qty: filledQuantity,
          tradeId: GLOBAL_TRADE_ID++,
        });
        executedQty += filledQuantity;
        quantity -= filledQuantity;
        if (o.quantity === 0) {
          orderbook.asks.splice(orderbook.asks.indexOf(o), 1);
        }
        if (bookWithQuantity.asks[price] === 0) {
          delete bookWithQuantity.asks[price];
        }
      }
    });

    // Place on the book if order not filled
    if (quantity !== 0) {
      orderbook.bids.push({
        price,
        quantity: quantity - executedQty,
        side: "bid",
        orderId,
      });
      bookWithQuantity.bids[price] =
        (bookWithQuantity.bids[price] || 0) + (quantity - executedQty);
    }
  } else {
    orderbook.bids.forEach((o) => {
      if (o.price >= price && quantity > 0) {
        const filledQuantity = Math.min(quantity, o.quantity);
        o.quantity -= filledQuantity;
        bookWithQuantity.bids[price] =
          (bookWithQuantity.bids[price] || 0) - filledQuantity;
        fills.push({
          price: o.price,
          qty: filledQuantity,
          tradeId: GLOBAL_TRADE_ID++,
        });
        executedQty += filledQuantity;
        quantity -= filledQuantity;
        if (o.quantity === 0) {
          orderbook.bids.splice(orderbook.bids.indexOf(o), 1);
        }
        if (bookWithQuantity.bids[price] === 0) {
          delete bookWithQuantity.bids[price];
        }
      }
    });

    // Place on the book if order not filled
    if (quantity !== 0) {
      orderbook.asks.push({
        price,
        quantity: quantity,
        side: "ask",
        orderId,
      });
      bookWithQuantity.asks[price] =
        (bookWithQuantity.asks[price] || 0) + quantity;
    }
  }

  return {
    status: "accepted",
    executedQty,
    fills,
  };
}

function getFillAmount(price, quantity, side) {
  let filled = 0;
  if (side === "buy") {
    orderbook.asks.forEach((o) => {
      if (o.price < price) {
        filled += Math.min(quantity, o.quantity);
      }
    });
  } else {
    orderbook.bids.forEach((o) => {
      if (o.price > price) {
        filled += Math.min(quantity, o.quantity);
      }
    });
  }
  return filled;
}
