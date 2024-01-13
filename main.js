const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.initializeFile();
  }

  initializeFile() {
    try {
      fs.accessSync(this.path, fs.constants.F_OK);
    } catch (err) {
      fs.writeFileSync(this.path, '[]', 'utf8');
    }
  }

  addProduct(productData) {
    const products = this.getProductsFromFile();
    const newProduct = {
      id: this.getNextProductId(products),
      ...productData,
    };
    products.push(newProduct);
    this.saveProductsToFile(products);
    console.log('Producto agregado:', newProduct);
  }

  getProducts() {
    return this.getProductsFromFile();
  }

  getProductById(id) {
    const products = this.getProductsFromFile();
    const product = products.find((p) => p.id === id);
    if (!product) {
      console.log('Producto no encontrado.');
    } else {
      console.log('Producto encontrado:', product);
    }
    return product;
  }

  updateProduct(id, updatedData) {
    const products = this.getProductsFromFile();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData, id };
      this.saveProductsToFile(products);
      console.log(`Producto con ID ${id} actualizado.`);
      console.log('Producto actualizado:', products[index]);
    } else {
      console.log('Producto no encontrado.');
    }
  }

  deleteProduct(id) {
    const products = this.getProductsFromFile();
    const updatedProducts = products.filter((p) => p.id !== id);
    if (products.length !== updatedProducts.length) {
      this.saveProductsToFile(updatedProducts);
      console.log(`Producto con ID ${id} eliminado.`);
    } else {
      console.log('Producto no encontrado.');
    }
  }

  getNextProductId(products) {
    return products.length === 0 ? 1 : Math.max(...products.map((p) => p.id)) + 1;
  }

  getProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer el archivo:', error.message);
      return [];
    }
  }

  saveProductsToFile(products) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al escribir en el archivo:', error.message);
    }
  }
}



const manager = new ProductManager('productos.txt');

manager.addProduct({
  title: 'Producto 1',
  description: 'Descripción del Producto 1',
  price: 29.99,
  thumbnail: 'ruta/imagen1.jpg',
  code: 'ABC123',
  stock: 50,
});

manager.addProduct({
  title: 'Producto 2',
  description: 'Descripción del Producto 2',
  price: 49.99,
  thumbnail: 'ruta/imagen2.jpg',
  code: 'DEF456',
  stock: 30,
});

console.log('Todos los productos:', manager.getProducts());

manager.getProductById(1);

manager.updateProduct(1, { price: 39.99, stock: 60 });

console.log('Productos después de la actualización:', manager.getProducts());

manager.deleteProduct(2);

console.log('Productos después de la eliminación:', manager.getProducts());
