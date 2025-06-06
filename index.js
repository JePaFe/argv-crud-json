import { argv } from "process";

import { readFile, writeFile } from "fs/promises";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data", "products.json");

const match = argv.find((arg) => /^products\/\d+$/.test(arg));
let id = match ? match.split("/")[1] : null;
id = parseInt(id);

let [, , command, resource] = argv;

command = command.toLowerCase();

if (id) {
  resource = resource.split("/")[0];
}
resource = resource.toLowerCase();

let products = [];

try {
  const jsonText = await readFile(filePath, "utf8");
  products = JSON.parse(jsonText);
} catch (err) {
  console.error("Error leyendo el archivo JSON:", err);
}

if (command == "read" && resource == "products" && id) {
  const product = products.find((product) => product.id == id);
  if (product) {
    console.log(product);
  } else {
    console.log("No se encontró el producto con el ID especificado.");
  }
} else if (command == "read" && resource.startsWith("products")) {
  console.log(products);
} else if (command == "save" && resource == "products") {
  const [name, price] = argv.slice(4);

  const params = { name, price };

  const newProduct = {
    id: products.length + 1,
    ...params,
  };
  products.push(newProduct);
  console.log("Producto creado:", newProduct);

  try {
    await writeFile(filePath, JSON.stringify(products));
    console.log("Archivo actualizado correctamente.");
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
  }
} else if (command == "update" && resource == "products" && id) {
  const product = products.find((product) => product.id == id);

  if (product) {
    const [name, price] = argv.slice(4);

    product.name = name;
    product.price = price;
    console.log("Producto actualizado:", product);
  } else {
    console.log("No se encontró el producto con el ID especificado.");
  }

  try {
    await writeFile(filePath, JSON.stringify(products));
    console.log("Archivo actualizado correctamente.");
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
  }
} else if (command == "delete" && resource == "products" && id) {
  const productIndex = products.findIndex((product) => product.id == id);
  if (productIndex !== -1) {
    const productDelete = products.splice(productIndex, 1);
    console.log("Producto eliminado:", productDelete[0]);

    try {
      await writeFile(filePath, JSON.stringify(products));
      console.log("Archivo actualizado correctamente.");
    } catch (error) {
      console.error("Error al escribir el archivo:", error);
    }
  } else {
    console.log("No se encontró el producto con el ID especificado.");
  }
}
