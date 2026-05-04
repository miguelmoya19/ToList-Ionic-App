# 🚀 ToDo List App  
### 📱 Ionic + Angular | Clean Architecture | Reactive Design  

---

## 📌 Overview

Aplicación móvil desarrollada con **Angular + Ionic** enfocada en la gestión de tareas (To-Do List), diseñada bajo principios de **arquitectura limpia, escalabilidad y mantenibilidad**.

El proyecto demuestra buenas prácticas modernas como:

- Programación reactiva con RxJS  
- Modularización por features  
- Arquitectura desacoplada  
- Optimización de rendimiento  

---

## 🧱 Arquitectura

Se implementa una arquitectura basada en **Feature Modules + separación por capas**, logrando alta cohesión y bajo acoplamiento.

### 📂 Estructura del proyecto

```
src/
 ├── pages/        → vistas principales  
 ├── components/   → componentes reutilizables  
 ├── services/     → lógica de negocio  
 ├── models/       → DTOs y entidades  
```

### 🎯 Principios aplicados

- SOLID (especialmente SRP)  
- Inyección de dependencias  
- Separación de responsabilidades  
- Código desacoplado y testeable  

---

## 🔄 Gestión de Estado (RxJS)

- Observables como fuente única de verdad  
- Caché en memoria para evitar operaciones redundantes  
- Manejo seguro de suscripciones  
- Flujo de datos reactivo y predecible  

---

## 💾 Persistencia de Datos

Estrategia híbrida:

- Ionic Storage → almacenamiento local eficiente  
- SQLite (opcional) → preparado para escalabilidad  

### ⚡ Optimización

- Caché versionada  
- Validación antes de acceder al storage  
- Reducción de operaciones I/O  

---

## ⚡ Performance

- Lazy Loading (carga diferida)  
- Formularios reactivos  
- Minimización de renders innecesarios  
- Uso eficiente de observables  

---

## 🔐 Seguridad

- Route Guards para protección de rutas  
- Autenticación con Firebase  
- Control dinámico de acceso  

---

## 🚩 Feature Flags (Firebase)

Sistema dinámico que permite activar o desactivar funcionalidades sin despliegue.

### Implementado:

- Toggle de categorías  
- Protección dinámica de rutas  
- Modo mantenimiento  

---

## 🔄 CI/CD

- Automatización con GitHub Actions / Codemagic  
- Generación de APK automática  

### Flujo Git

```
feature/
bugfix/
refactor/
release/
```

---

## 🧪 Calidad del Código

- Tipado fuerte con TypeScript  
- Uso de linters  
- Código estructurado y escalable  
- Preparado para análisis estático  

---

## 🚧 Desafíos

### Integración Firebase + Ionic

- Manejo de autenticación  
- Implementación de feature flags  
- Adaptación de flujos reactivos  

### Solución

- Uso de RxJS  
- Arquitectura desacoplada  
- Diseño flexible para crecimiento  

---

## 📱 APK (Demo)

👉 Descargar APK:  
https://drive.google.com/file/d/1RN2PSlrsr1SXVGLhUPCZ02F-IV8zbIt-/view?usp=drive_link  

---

## 🎥 Demostración

👉 Documento demostrativo:  
https://docs.google.com/document/d/17LbqWphKL8D61g7LV6-g0zX8tEHMtOfZ/edit?usp=drive_link  

---

## 📱 Nota sobre iOS

⚠️ La generación de archivos `.ipa` requiere una cuenta activa en el Apple Developer Program ($99/año).  
Por este motivo, se entrega APK funcional y el código está listo para compilación en iOS.

---

## 🛠️ Stack Tecnológico

- Angular  
- Ionic  
- TypeScript  
- RxJS  
- Firebase  
- Ionic Storage  
- SQLite (opcional)  

---

## 👨‍💻 Autor

Miguel Eduardo Moya Aguilera  
Software Developer  

---

## 🧠 Key Takeaways

- Arquitectura modular escalable  
- Programación reactiva  
- Optimización de rendimiento  
- Código mantenible  
- Preparado para producción  

---

## ⭐ Valor agregado

✔️ APK funcional  
✔️ Código limpio y estructurado  
✔️ Arquitectura profesional  
✔️ Buenas prácticas modernas  

---

## ⚙️ Cómo ejecutar el proyecto

```
npm install
ionic serve
```

---

## 🚀 Build APK (Android)

```
ionic cordova build android
```