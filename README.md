# Challenge Frontend - Product Detail Page

Aplicación web desarrollada en React que muestra una página de detalles de producto con funcionalidades de e-commerce, incluyendo galería de imágenes, información del vendedor, métodos de pago, reseñas y preguntas de usuarios.

## 🚀 Características

- **Galería de imágenes interactiva** - Visualización de múltiples imágenes del producto
- **Información detallada del producto** - Especificaciones, características y descripción
- **Sistema de reseñas y calificaciones** - Evaluaciones de usuarios con estrellas
- **Preguntas y respuestas** - Sección Q&A para consultas sobre el producto
- **Información del vendedor** - Datos de contacto y reputación
- **Métodos de pago** - Opciones de pago disponibles
- **Breadcrumbs de navegación** - Navegación contextual
- **Selector de cantidad** - Control para elegir cantidad de productos
- **Notificaciones** - Sistema de snackbar para feedback al usuario

## 🛠️ Tecnologías

- **React 19.1.0** - Framework de JavaScript
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción y desarrollo
- **Jest** - Framework de testing
- **Google Generative AI** - Integración con Gemini API

## 📋 Prerequisitos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear un archivo `.env.local` en la raíz del proyecto y configurar:
```env
GEMINI_API_KEY=tu_api_key_de_gemini
API_BASE_URL=https://tu_api_base_url
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción
- `npm test` - Ejecuta las pruebas
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:coverage` - Ejecuta las pruebas con reporte de cobertura
- `npm run test:ci` - Ejecuta las pruebas para CI/CD

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── atoms/           # Componentes básicos (Icon)
│   ├── molecules/       # Componentes compuestos (ProductDescription, QuantitySelector, etc.)
│   └── organisms/       # Componentes complejos (ImageGallery, ProductFeatures, etc.)
├── features/            # Funcionalidades específicas
│   ├── product-offer/   # Información y compra de oferta
│   ├── product-questions/ # Sistema de preguntas
│   └── product-reviews/ # Sistema de reseñas
├── lib/                 # Utilidades y tipos
│   ├── api.ts          # Funciones de API
│   └── types.ts        # Definiciones de tipos TypeScript
├── data/               # Datos mock
└── __tests__/          # Pruebas unitarias
```

## 🧪 Testing

El proyecto incluye pruebas unitarias configuradas con Jest y Testing Library:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 🏗️ Construcción para Producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.

## 📄 Licencia

Este proyecto es privado y se desarrolló como parte de un challenge técnico.
