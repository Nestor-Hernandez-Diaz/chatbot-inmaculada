// prisma/seed-masivo.js
// Seed masivo de productos populares en Perú para Supermercado La Inmaculada
require('dotenv').config({ override: true });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapeo de categorías existentes (IDs del sistema)
const CATEGORIAS = {
  LACTEOS: 19,        // Lácteos y Huevos
  PANADERIA: 20,      // Panadería y Dulces
  CARNES: 21,         // Carnes y Embutidos
  FRUTAS: 22,         // Frutas y Verduras
  BEBIDAS: 23,        // Bebidas y Licores
  LIMPIEZA: 24,       // Limpieza y Hogar
  CUIDADO: 25         // Cuidado Personal
};

// Función para generar SKU único
function generarSKU(categoria, index) {
  const prefijos = {
    [CATEGORIAS.LACTEOS]: 'LAC',
    [CATEGORIAS.PANADERIA]: 'PAN',
    [CATEGORIAS.CARNES]: 'CAR',
    [CATEGORIAS.FRUTAS]: 'FRU',
    [CATEGORIAS.BEBIDAS]: 'BEB',
    [CATEGORIAS.LIMPIEZA]: 'LIM',
    [CATEGORIAS.CUIDADO]: 'CUI'
  };
  return `${prefijos[categoria]}-${String(index).padStart(4, '0')}`;
}

// ============================================
// PRODUCTOS POPULARES EN PERÚ POR CATEGORÍA
// ============================================

const productosLacteos = [
  // Leches
  { name: 'Leche Gloria Entera 1L', description: 'Leche evaporada entera Gloria', price: 4.50, stock: 200 },
  { name: 'Leche Gloria Deslactosada 1L', description: 'Leche sin lactosa Gloria', price: 5.20, stock: 150 },
  { name: 'Leche Gloria Light 1L', description: 'Leche descremada Gloria', price: 4.80, stock: 120 },
  { name: 'Leche Pura Vida 1L', description: 'Leche evaporada Pura Vida económica', price: 3.90, stock: 180 },
  { name: 'Leche Ideal Cremosita 395g', description: 'Leche evaporada cremosa', price: 3.50, stock: 150 },
  { name: 'Leche Nan Pro 1 400g', description: 'Fórmula infantil Nestlé', price: 45.90, stock: 40 },
  { name: 'Leche Condensada Gloria 393g', description: 'Leche condensada azucarada', price: 6.90, stock: 100 },
  
  // Yogurts
  { name: 'Yogurt Gloria Natural 1L', description: 'Yogurt natural sin sabor', price: 6.80, stock: 80 },
  { name: 'Yogurt Gloria Fresa 1L', description: 'Yogurt sabor fresa', price: 6.80, stock: 90 },
  { name: 'Yogurt Gloria Vainilla 1L', description: 'Yogurt sabor vainilla', price: 6.80, stock: 85 },
  { name: 'Yogurt Gloria Durazno 1L', description: 'Yogurt sabor durazno', price: 6.80, stock: 75 },
  { name: 'Yogurt Laive Griego 500g', description: 'Yogurt griego cremoso', price: 8.50, stock: 60 },
  { name: 'Yogurt Activia Natural 650g', description: 'Yogurt con probióticos', price: 9.20, stock: 50 },
  { name: 'Yogurt Gloria Kids 6 pack', description: 'Yogurt para niños surtido', price: 7.90, stock: 70 },
  
  // Quesos
  { name: 'Queso Edam Laive 250g', description: 'Queso edam maduro', price: 12.50, stock: 60 },
  { name: 'Queso Fresco La Preferida 500g', description: 'Queso fresco artesanal', price: 8.90, stock: 50 },
  { name: 'Queso Parmesano Rallado 50g', description: 'Queso parmesano Gloria', price: 4.50, stock: 80 },
  { name: 'Queso Crema Philadelphia 150g', description: 'Queso crema para untar', price: 7.80, stock: 70 },
  { name: 'Quesito Gloria 8 unid', description: 'Quesitos individuales para lonchera', price: 5.90, stock: 100 },
  
  // Mantequillas y Margarinas
  { name: 'Mantequilla Gloria 200g', description: 'Mantequilla con sal', price: 8.50, stock: 80 },
  { name: 'Mantequilla Laive 200g', description: 'Mantequilla premium', price: 9.20, stock: 70 },
  { name: 'Margarina Sello de Oro 450g', description: 'Margarina para cocinar', price: 6.50, stock: 90 },
  { name: 'Margarina Dorina 450g', description: 'Margarina clásica', price: 5.90, stock: 100 },
  
  // Huevos
  { name: 'Huevos La Calera x12', description: 'Huevos frescos de gallina', price: 8.90, stock: 150 },
  { name: 'Huevos La Calera x30', description: 'Bandeja de huevos frescos', price: 19.90, stock: 80 },
  { name: 'Huevos Orgánicos x6', description: 'Huevos de gallinas libres', price: 9.50, stock: 40 }
];

const productosPanaderia = [
  // Panes
  { name: 'Pan de Molde Bimbo 480g', description: 'Pan blanco tajado', price: 5.90, stock: 100 },
  { name: 'Pan de Molde Integral 500g', description: 'Pan integral tajado', price: 6.50, stock: 80 },
  { name: 'Pan Ciabatta 6 unid', description: 'Pan italiano artesanal', price: 4.50, stock: 60 },
  { name: 'Pan Francés x10', description: 'Pan fresco del día', price: 2.50, stock: 200 },
  { name: 'Pan Hamburguesa x4', description: 'Panes para hamburguesa', price: 4.90, stock: 80 },
  { name: 'Pan Hot Dog x8', description: 'Panes para hot dog', price: 4.50, stock: 90 },
  { name: 'Tostadas Bimbo 210g', description: 'Pan tostado crujiente', price: 4.90, stock: 70 },
  
  // Galletas
  { name: 'Galletas Oreo 108g', description: 'Galletas de chocolate rellenas', price: 3.50, stock: 120 },
  { name: 'Galletas Glacitas 150g', description: 'Galletas con cobertura de vainilla', price: 2.80, stock: 150 },
  { name: 'Galletas Casino 6 pack', description: 'Galletas surtidas Costa', price: 4.90, stock: 100 },
  { name: 'Galletas Soda Field 140g', description: 'Galletas saladas', price: 2.20, stock: 130 },
  { name: 'Galletas Margarita 175g', description: 'Galletas de vainilla Nestlé', price: 3.20, stock: 110 },
  { name: 'Galletas Chocochips Nabisco 200g', description: 'Galletas con chispas de chocolate', price: 5.50, stock: 80 },
  { name: 'Galletas Tentación 6 pack', description: 'Galletas de chocolate', price: 3.90, stock: 90 },
  { name: 'Galletas Picaras 6 pack', description: 'Galletas cubiertas de chocolate', price: 4.50, stock: 85 },
  
  // Chocolates y Golosinas
  { name: 'Chocolate Sublime 30g', description: 'Chocolate con maní Nestlé', price: 1.50, stock: 200 },
  { name: 'Chocolate Princesa 30g', description: 'Chocolate con maní', price: 1.50, stock: 180 },
  { name: 'Chocolate Triángulo 30g', description: 'Chocolate con maní premium', price: 1.80, stock: 150 },
  { name: 'Chocolate Costa 100g', description: 'Tableta de chocolate con leche', price: 6.90, stock: 80 },
  { name: 'Bombones Bon o Bon 15 unid', description: 'Bombones rellenos', price: 8.90, stock: 70 },
  { name: 'Caramelos Halls 25.2g', description: 'Caramelos mentolados', price: 1.50, stock: 200 },
  { name: 'Chicles Trident 18 unid', description: 'Chicle sin azúcar', price: 3.20, stock: 150 },
  { name: 'Gomitas Mogul 150g', description: 'Gomitas de frutas', price: 4.90, stock: 100 },
  { name: 'Chupetín Globo Pop 24 unid', description: 'Chupetines con chicle', price: 5.90, stock: 80 },
  
  // Snacks
  { name: 'Papas Lays Clásicas 80g', description: 'Papas fritas sabor original', price: 4.50, stock: 120 },
  { name: 'Papas Lays Queso 80g', description: 'Papas fritas sabor queso', price: 4.50, stock: 110 },
  { name: 'Doritos Nacho 110g', description: 'Tortillas de maíz sabor nacho', price: 5.50, stock: 100 },
  { name: 'Cheetos Flamin Hot 100g', description: 'Snack de maíz picante', price: 4.90, stock: 90 },
  { name: 'Chizitos 100g', description: 'Snack de maíz clásico', price: 3.50, stock: 130 },
  { name: 'Cuates Picantes 80g', description: 'Snack picante peruano', price: 3.20, stock: 120 },
  { name: 'Chocman 32g', description: 'Bizcocho de chocolate', price: 1.20, stock: 200 },
  { name: 'Wafer Sublime 6 pack', description: 'Wafer con chocolate y maní', price: 5.50, stock: 90 }
];

const productosCarnes = [
  // Pollo
  { name: 'Pollo Entero Fresco 2.5kg', description: 'Pollo entero sin menudencia', price: 18.50, stock: 50 },
  { name: 'Pechuga de Pollo 1kg', description: 'Pechuga deshuesada', price: 16.90, stock: 60 },
  { name: 'Piernas de Pollo 1kg', description: 'Piernas con encuentro', price: 11.90, stock: 70 },
  { name: 'Alas de Pollo 1kg', description: 'Alas para parrilla', price: 9.90, stock: 60 },
  { name: 'Hígado de Pollo 500g', description: 'Hígado fresco', price: 5.90, stock: 40 },
  { name: 'Menudencia de Pollo 500g', description: 'Menudencia completa', price: 4.50, stock: 35 },
  
  // Res
  { name: 'Bistec de Res 1kg', description: 'Corte para freír', price: 28.90, stock: 40 },
  { name: 'Carne Molida de Res 500g', description: 'Carne molida fresca', price: 14.50, stock: 50 },
  { name: 'Asado de Res 1kg', description: 'Corte para guisar', price: 24.90, stock: 35 },
  { name: 'Osobuco de Res 1kg', description: 'Corte con hueso', price: 18.90, stock: 30 },
  { name: 'Mondongo de Res 500g', description: 'Estómago de res', price: 9.90, stock: 25 },
  
  // Cerdo
  { name: 'Chuleta de Cerdo 1kg', description: 'Chuleta con hueso', price: 19.90, stock: 40 },
  { name: 'Chicharrón de Cerdo 500g', description: 'Panceta para chicharrón', price: 16.90, stock: 35 },
  { name: 'Costillas de Cerdo 1kg', description: 'Costillas para parrilla', price: 22.90, stock: 30 },
  { name: 'Tocino Ahumado 200g', description: 'Tocino en tiras', price: 12.90, stock: 60 },
  
  // Embutidos
  { name: 'Salchicha Frankfurter 500g', description: 'Salchichas tipo alemán', price: 8.90, stock: 80 },
  { name: 'Hot Dog San Fernando 500g', description: 'Salchichas para hot dog', price: 7.50, stock: 100 },
  { name: 'Jamón del País 200g', description: 'Jamón cocido tajado', price: 9.90, stock: 70 },
  { name: 'Jamonada Suiza 400g', description: 'Jamonada premium', price: 8.50, stock: 65 },
  { name: 'Chorizo Parrillero 500g', description: 'Chorizo para parrilla', price: 14.90, stock: 50 },
  { name: 'Mortadela 300g', description: 'Mortadela tajada', price: 6.90, stock: 60 },
  
  // Pescados y Mariscos
  { name: 'Filete de Tilapia 500g', description: 'Pescado blanco sin espinas', price: 18.90, stock: 40 },
  { name: 'Jurel Entero 1kg', description: 'Pescado fresco', price: 12.90, stock: 35 },
  { name: 'Atún en Conserva 170g', description: 'Atún en agua Campomar', price: 5.90, stock: 100 },
  { name: 'Sardinas en Lata 125g', description: 'Sardinas en aceite', price: 4.50, stock: 90 }
];

const productosFrutas = [
  // Frutas
  { name: 'Plátano de Seda 1kg', description: 'Plátano dulce maduro', price: 2.90, stock: 100 },
  { name: 'Plátano Verde 1kg', description: 'Plátano para cocinar', price: 2.50, stock: 80 },
  { name: 'Manzana Delicia 1kg', description: 'Manzana roja nacional', price: 5.90, stock: 70 },
  { name: 'Manzana Israel 1kg', description: 'Manzana verde importada', price: 7.50, stock: 60 },
  { name: 'Naranja de Jugo 1kg', description: 'Naranja para exprimir', price: 3.50, stock: 100 },
  { name: 'Mandarina 1kg', description: 'Mandarina dulce', price: 4.20, stock: 80 },
  { name: 'Uva Red Globe 1kg', description: 'Uva roja sin pepa', price: 8.90, stock: 50 },
  { name: 'Papaya 1kg', description: 'Papaya madura', price: 4.50, stock: 60 },
  { name: 'Piña Golden 1 unid', description: 'Piña dulce mediana', price: 6.90, stock: 40 },
  { name: 'Sandía 1kg', description: 'Sandía roja dulce', price: 2.50, stock: 30 },
  { name: 'Mango Kent 1kg', description: 'Mango dulce de temporada', price: 5.90, stock: 50 },
  { name: 'Palta Fuerte 1kg', description: 'Palta peruana premium', price: 9.90, stock: 60 },
  { name: 'Limón 1kg', description: 'Limón ácido peruano', price: 4.50, stock: 100 },
  { name: 'Fresa 250g', description: 'Fresas frescas', price: 5.50, stock: 40 },
  { name: 'Maracuyá 500g', description: 'Maracuyá para jugo', price: 4.90, stock: 50 },
  { name: 'Chirimoya 500g', description: 'Chirimoya cumbe', price: 7.90, stock: 30 },
  { name: 'Granadilla 500g', description: 'Granadilla dulce', price: 6.90, stock: 35 },
  { name: 'Cocona 500g', description: 'Fruta amazónica', price: 4.50, stock: 40 },
  { name: 'Camu Camu 250g', description: 'Super fruta de la selva', price: 8.90, stock: 25 },
  { name: 'Aguaje 500g', description: 'Fruto amazónico', price: 6.50, stock: 30 },
  
  // Verduras
  { name: 'Papa Blanca 1kg', description: 'Papa para freír', price: 2.90, stock: 150 },
  { name: 'Papa Amarilla 1kg', description: 'Papa cremosa peruana', price: 4.50, stock: 100 },
  { name: 'Papa Huayro 1kg', description: 'Papa para sancochado', price: 3.90, stock: 80 },
  { name: 'Yuca 1kg', description: 'Yuca fresca', price: 3.20, stock: 90 },
  { name: 'Camote 1kg', description: 'Camote amarillo', price: 2.80, stock: 80 },
  { name: 'Cebolla Roja 1kg', description: 'Cebolla criolla', price: 3.50, stock: 120 },
  { name: 'Ajo 500g', description: 'Ajo fresco pelado', price: 8.90, stock: 60 },
  { name: 'Tomate 1kg', description: 'Tomate italiano', price: 4.50, stock: 100 },
  { name: 'Zanahoria 1kg', description: 'Zanahoria fresca', price: 2.90, stock: 90 },
  { name: 'Choclo 1kg', description: 'Choclo desgranado', price: 6.90, stock: 50 },
  { name: 'Arveja Verde 500g', description: 'Arveja fresca', price: 5.50, stock: 60 },
  { name: 'Lechuga Americana 1 unid', description: 'Lechuga fresca', price: 3.50, stock: 50 },
  { name: 'Pepino 1kg', description: 'Pepino fresco', price: 3.20, stock: 60 },
  { name: 'Pimiento Rojo 500g', description: 'Pimiento morrón', price: 5.90, stock: 50 },
  { name: 'Ají Amarillo 250g', description: 'Ají peruano', price: 3.50, stock: 70 },
  { name: 'Rocoto 250g', description: 'Rocoto fresco', price: 4.50, stock: 50 },
  { name: 'Culantro 100g', description: 'Culantro fresco', price: 1.00, stock: 80 },
  { name: 'Perejil 100g', description: 'Perejil fresco', price: 1.00, stock: 80 },
  { name: 'Espinaca 300g', description: 'Espinaca fresca', price: 3.90, stock: 50 },
  { name: 'Zapallo 1kg', description: 'Zapallo macre', price: 2.50, stock: 40 }
];

const productosBebidas = [
  // Gaseosas
  { name: 'Coca Cola 3L', description: 'Gaseosa cola familiar', price: 12.50, stock: 100 },
  { name: 'Coca Cola 1.5L', description: 'Gaseosa cola personal', price: 7.50, stock: 120 },
  { name: 'Coca Cola 500ml', description: 'Gaseosa cola individual', price: 3.50, stock: 200 },
  { name: 'Coca Cola Zero 1.5L', description: 'Gaseosa sin azúcar', price: 7.90, stock: 80 },
  { name: 'Inca Kola 3L', description: 'Gaseosa peruana familiar', price: 12.50, stock: 100 },
  { name: 'Inca Kola 1.5L', description: 'Gaseosa peruana personal', price: 7.50, stock: 120 },
  { name: 'Inca Kola 500ml', description: 'Gaseosa peruana individual', price: 3.50, stock: 200 },
  { name: 'Fanta Naranja 1.5L', description: 'Gaseosa sabor naranja', price: 6.90, stock: 80 },
  { name: 'Sprite 1.5L', description: 'Gaseosa lima-limón', price: 6.90, stock: 80 },
  { name: 'Kola Real 3L', description: 'Gaseosa económica', price: 6.90, stock: 150 },
  { name: 'Guaraná 1.5L', description: 'Gaseosa de guaraná', price: 5.90, stock: 70 },
  
  // Aguas
  { name: 'Agua San Luis 2.5L', description: 'Agua de mesa', price: 3.90, stock: 150 },
  { name: 'Agua San Luis 625ml', description: 'Agua individual', price: 1.50, stock: 300 },
  { name: 'Agua Cielo 2.5L', description: 'Agua de manantial', price: 3.50, stock: 120 },
  { name: 'Agua San Mateo 2.5L', description: 'Agua mineral natural', price: 4.20, stock: 100 },
  { name: 'Agua con Gas San Mateo 1L', description: 'Agua mineral gasificada', price: 3.50, stock: 80 },
  
  // Jugos y Néctares
  { name: 'Frugos del Valle 1L', description: 'Néctar de durazno', price: 4.90, stock: 100 },
  { name: 'Frugos del Valle Mango 1L', description: 'Néctar de mango', price: 4.90, stock: 90 },
  { name: 'Pulp Durazno 1L', description: 'Jugo de durazno', price: 4.50, stock: 100 },
  { name: 'Pulp Naranja 1L', description: 'Jugo de naranja', price: 4.50, stock: 90 },
  { name: 'Tampico Citrus 3L', description: 'Bebida cítrica', price: 7.90, stock: 80 },
  { name: 'Cifrut Naranja 500ml', description: 'Refresco cítrico', price: 2.50, stock: 150 },
  { name: 'Zuko Naranja 1L', description: 'Refresco en polvo', price: 4.20, stock: 100 },
  
  // Energizantes y Rehidratantes
  { name: 'Gatorade 500ml', description: 'Bebida isotónica', price: 4.50, stock: 100 },
  { name: 'Powerade 500ml', description: 'Bebida deportiva', price: 4.20, stock: 90 },
  { name: 'Red Bull 250ml', description: 'Bebida energizante', price: 8.90, stock: 80 },
  { name: 'Volt 300ml', description: 'Energizante económico', price: 3.90, stock: 100 },
  { name: 'Monster 473ml', description: 'Bebida energética', price: 9.50, stock: 60 },
  
  // Cervezas
  { name: 'Pilsen Callao 630ml', description: 'Cerveza peruana', price: 5.90, stock: 150 },
  { name: 'Cristal 630ml', description: 'Cerveza peruana tradicional', price: 5.50, stock: 150 },
  { name: 'Cusqueña Dorada 330ml', description: 'Cerveza premium', price: 4.90, stock: 100 },
  { name: 'Corona Extra 355ml', description: 'Cerveza mexicana', price: 6.90, stock: 80 },
  { name: 'Pilsen Six Pack', description: '6 cervezas 330ml', price: 24.90, stock: 60 },
  
  // Vinos y Licores
  { name: 'Vino Tacama Rosé 750ml', description: 'Vino rosado peruano', price: 29.90, stock: 30 },
  { name: 'Vino Tabernero Borgoña 750ml', description: 'Vino tinto suave', price: 18.90, stock: 40 },
  { name: 'Pisco Quebranta 750ml', description: 'Pisco puro peruano', price: 45.90, stock: 35 },
  { name: 'Ron Cartavio 750ml', description: 'Ron peruano añejo', price: 35.90, stock: 30 }
];

const productosLimpieza = [
  // Detergentes
  { name: 'Ariel 4kg', description: 'Detergente en polvo', price: 42.90, stock: 60 },
  { name: 'Ariel Líquido 1.8L', description: 'Detergente concentrado', price: 38.90, stock: 50 },
  { name: 'Ace 2.5kg', description: 'Detergente multiusos', price: 18.90, stock: 80 },
  { name: 'Bolivar 2.5kg', description: 'Detergente peruano', price: 16.90, stock: 90 },
  { name: 'Opal 2kg', description: 'Detergente económico', price: 14.90, stock: 100 },
  { name: 'Suavitel 1L', description: 'Suavizante de ropa', price: 12.90, stock: 70 },
  
  // Lavaplatos
  { name: 'Lava Vajillas Sapolio 360g', description: 'Pasta lavaplatos', price: 4.50, stock: 120 },
  { name: 'Ayudin 900g', description: 'Detergente lavaplatos', price: 8.90, stock: 80 },
  { name: 'Lavavajilla Líquido 500ml', description: 'Lavaplatos concentrado', price: 6.90, stock: 90 },
  
  // Limpiadores
  { name: 'Lejía Clorox 1L', description: 'Blanqueador', price: 5.90, stock: 100 },
  { name: 'Lejía Clorox 4L', description: 'Blanqueador familiar', price: 15.90, stock: 60 },
  { name: 'Pinesol 1L', description: 'Limpiador desinfectante', price: 12.90, stock: 70 },
  { name: 'Poett 900ml', description: 'Limpiador multiusos', price: 9.90, stock: 80 },
  { name: 'Mr. Músculo 500ml', description: 'Limpiador de vidrios', price: 11.90, stock: 60 },
  { name: 'Limpia Baños 500ml', description: 'Desinfectante para baños', price: 8.90, stock: 70 },
  
  // Escobas y Trapeadores
  { name: 'Escoba de Plástico', description: 'Escoba resistente', price: 12.90, stock: 40 },
  { name: 'Trapeador Microfibra', description: 'Trapeador absorbente', price: 18.90, stock: 35 },
  { name: 'Recogedor Plástico', description: 'Recogedor con mango', price: 6.90, stock: 50 },
  { name: 'Guantes de Limpieza', description: 'Guantes de látex', price: 5.90, stock: 80 },
  { name: 'Esponja Verde x3', description: 'Esponjas multiuso', price: 3.90, stock: 100 },
  
  // Bolsas y Papel
  { name: 'Bolsas de Basura 50L x10', description: 'Bolsas resistentes', price: 8.90, stock: 90 },
  { name: 'Bolsas de Basura 140L x5', description: 'Bolsas grandes', price: 9.90, stock: 60 },
  { name: 'Papel Toalla Elite x2', description: 'Papel absorbente', price: 9.90, stock: 80 },
  { name: 'Papel Higiénico Elite x4', description: 'Papel doble hoja', price: 8.90, stock: 120 },
  { name: 'Papel Higiénico Suave x12', description: 'Papel económico', price: 15.90, stock: 80 },
  { name: 'Servilletas Elite x100', description: 'Servilletas de papel', price: 4.90, stock: 100 }
];

const productosCuidado = [
  // Jabones
  { name: 'Jabón Camay 3 pack', description: 'Jabón de tocador', price: 7.90, stock: 80 },
  { name: 'Jabón Dove 90g', description: 'Jabón hidratante', price: 5.90, stock: 90 },
  { name: 'Jabón Rexona 3 pack', description: 'Jabón antibacterial', price: 8.50, stock: 70 },
  { name: 'Jabón Líquido Aval 400ml', description: 'Jabón para manos', price: 8.90, stock: 60 },
  { name: 'Jabón Antibacterial 250ml', description: 'Jabón desinfectante', price: 9.90, stock: 80 },
  
  // Shampoos
  { name: 'Shampoo Head & Shoulders 375ml', description: 'Anticaspa', price: 18.90, stock: 60 },
  { name: 'Shampoo Pantene 400ml', description: 'Reparación capilar', price: 19.90, stock: 55 },
  { name: 'Shampoo Sedal 650ml', description: 'Cabello sedoso', price: 15.90, stock: 70 },
  { name: 'Shampoo Savital 530ml', description: 'Shampoo económico', price: 9.90, stock: 90 },
  { name: 'Acondicionador Pantene 400ml', description: 'Restauración', price: 19.90, stock: 50 },
  
  // Desodorantes
  { name: 'Desodorante Rexona Men 150ml', description: 'Antitranspirante hombre', price: 14.90, stock: 70 },
  { name: 'Desodorante Rexona Women 150ml', description: 'Antitranspirante mujer', price: 14.90, stock: 70 },
  { name: 'Desodorante Dove 150ml', description: 'Cuidado de axilas', price: 16.90, stock: 60 },
  { name: 'Desodorante Axe 150ml', description: 'Fragancia masculina', price: 15.90, stock: 65 },
  { name: 'Desodorante Old Spice 150ml', description: 'Fresh High Endurance', price: 18.90, stock: 50 },
  
  // Higiene Bucal
  { name: 'Pasta Dental Colgate 150ml', description: 'Protección anticaries', price: 8.90, stock: 100 },
  { name: 'Pasta Dental Kolynos 100ml', description: 'Limpieza profunda', price: 5.90, stock: 120 },
  { name: 'Cepillo Dental Colgate', description: 'Cerdas suaves', price: 4.90, stock: 90 },
  { name: 'Enjuague Bucal Listerine 500ml', description: 'Antiséptico bucal', price: 19.90, stock: 50 },
  { name: 'Hilo Dental Oral B', description: 'Limpieza interdental', price: 7.90, stock: 60 },
  
  // Cuidado de Bebés
  { name: 'Pañales Huggies M x40', description: 'Pañales talla M', price: 45.90, stock: 40 },
  { name: 'Pañales Huggies G x36', description: 'Pañales talla G', price: 48.90, stock: 40 },
  { name: 'Pañales Pampers M x40', description: 'Pañales premium', price: 52.90, stock: 35 },
  { name: 'Toallitas Húmedas Huggies x80', description: 'Para limpieza de bebé', price: 14.90, stock: 60 },
  { name: 'Colonia para Bebé 200ml', description: 'Suave para recién nacidos', price: 18.90, stock: 40 },
  { name: 'Shampoo para Bebé 400ml', description: 'Sin lágrimas', price: 15.90, stock: 45 },
  
  // Cuidado Femenino
  { name: 'Toallas Kotex Normal x10', description: 'Protección diaria', price: 8.90, stock: 80 },
  { name: 'Toallas Always Nocturnas x8', description: 'Máxima protección', price: 12.90, stock: 60 },
  { name: 'Protectores Diarios Nosotras x15', description: 'Uso diario', price: 5.90, stock: 90 }
];

async function main() {
  console.log('🚀 Iniciando seed masivo de productos peruanos...\n');
  
  // Verificar categorías existentes
  const categorias = await prisma.category.findMany();
  console.log(`📦 Categorías existentes: ${categorias.length}`);
  categorias.forEach(c => console.log(`   - ${c.id}: ${c.name}`));
  
  // Contar productos actuales
  const productosActuales = await prisma.product.count();
  console.log(`\n📊 Productos actuales: ${productosActuales}`);
  
  // Preparar todos los productos con SKU y categoría
  const todosProductos = [
    ...productosLacteos.map((p, i) => ({ ...p, categoryId: CATEGORIAS.LACTEOS, sku: generarSKU(CATEGORIAS.LACTEOS, 100 + i) })),
    ...productosPanaderia.map((p, i) => ({ ...p, categoryId: CATEGORIAS.PANADERIA, sku: generarSKU(CATEGORIAS.PANADERIA, 100 + i) })),
    ...productosCarnes.map((p, i) => ({ ...p, categoryId: CATEGORIAS.CARNES, sku: generarSKU(CATEGORIAS.CARNES, 100 + i) })),
    ...productosFrutas.map((p, i) => ({ ...p, categoryId: CATEGORIAS.FRUTAS, sku: generarSKU(CATEGORIAS.FRUTAS, 100 + i) })),
    ...productosBebidas.map((p, i) => ({ ...p, categoryId: CATEGORIAS.BEBIDAS, sku: generarSKU(CATEGORIAS.BEBIDAS, 100 + i) })),
    ...productosLimpieza.map((p, i) => ({ ...p, categoryId: CATEGORIAS.LIMPIEZA, sku: generarSKU(CATEGORIAS.LIMPIEZA, 100 + i) })),
    ...productosCuidado.map((p, i) => ({ ...p, categoryId: CATEGORIAS.CUIDADO, sku: generarSKU(CATEGORIAS.CUIDADO, 100 + i) }))
  ];
  
  console.log(`\n🛒 Productos a insertar: ${todosProductos.length}`);
  console.log(`   - Lácteos y Huevos: ${productosLacteos.length}`);
  console.log(`   - Panadería y Dulces: ${productosPanaderia.length}`);
  console.log(`   - Carnes y Embutidos: ${productosCarnes.length}`);
  console.log(`   - Frutas y Verduras: ${productosFrutas.length}`);
  console.log(`   - Bebidas y Licores: ${productosBebidas.length}`);
  console.log(`   - Limpieza y Hogar: ${productosLimpieza.length}`);
  console.log(`   - Cuidado Personal: ${productosCuidado.length}`);
  
  // Insertar productos (ignorar duplicados por SKU)
  let insertados = 0;
  let errores = 0;
  
  for (const producto of todosProductos) {
    try {
      await prisma.product.upsert({
        where: { sku: producto.sku },
        update: {
          name: producto.name,
          description: producto.description,
          price: producto.price,
          stock: producto.stock
        },
        create: producto
      });
      insertados++;
      process.stdout.write(`\r   Procesando... ${insertados}/${todosProductos.length}`);
    } catch (error) {
      errores++;
      console.error(`\n   ⚠️ Error en ${producto.name}: ${error.message}`);
    }
  }
  
  // Resultado final
  const totalFinal = await prisma.product.count();
  
  console.log(`\n\n✅ Seed completado!`);
  console.log(`   - Productos insertados/actualizados: ${insertados}`);
  console.log(`   - Errores: ${errores}`);
  console.log(`   - Total productos en BD: ${totalFinal}`);
  
  // Mostrar conteo por categoría
  console.log('\n📊 Productos por categoría:');
  for (const cat of categorias) {
    const count = await prisma.product.count({ where: { categoryId: cat.id } });
    console.log(`   - ${cat.name}: ${count} productos`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
