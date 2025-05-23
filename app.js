const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const inventoryPath = path.join(__dirname, "data", "inventory.json");

app.get("/", (req, res) => {
  const inventory = require(inventoryPath);
  res.render("index", {
    shopName: "Night Shop Antwerpsesteenweg",
    openingHours: "Every day: 18:00 - 03:00",
    deliveryInfo: {
      radius: "10 min biking distance",
      minimumOrder: 20
    },
    inventory,
    deliveryResult: null
  });
});

app.post("/check-delivery", (req, res) => {
  const address = req.body.address;
  const inventory = require(inventoryPath);
  const isWithinDeliveryRange = true;
  res.render("index", {
    shopName: "Night Shop Antwerpsesteenweg",
    openingHours: "Every day: 18:00 - 03:00",
    deliveryInfo: {
      radius: "10 min biking distance",
      minimumOrder: 20
    },
    inventory,
    deliveryResult: isWithinDeliveryRange
      ? `✅ Delivery available at ${address}`
      : `❌ Sorry, address out of delivery range`
  });
});

app.get("/admin", (req, res) => {
  const inventory = require(inventoryPath);
  res.render("admin", { inventory });
});

app.post("/admin/update", (req, res) => {
  const updatedItems = JSON.parse(req.body.data);
  fs.writeFileSync(inventoryPath, JSON.stringify(updatedItems, null, 2));
  res.redirect("/admin");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));