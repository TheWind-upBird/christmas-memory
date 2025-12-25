# 🎄 Christmas Memory - 3D Interactive Experience

[🇨🇳 中文说明](#-中文说明) | [🇬🇧 English](#-english-introduction)

<div align="center">
  
  灵感来源：清儿了个清（小红书ID：Youmihua888)
  <img width="1896" height="878" alt="image" src="https://github.com/user-attachments/assets/e555c82f-8d33-4b3b-a45f-0779eb3a71dc" />
  <img width="1912" height="880" alt="image" src="https://github.com/user-attachments/assets/60c44e3b-4e33-4759-bb90-fc842c02fe2c" />
  
</div>

---

## 🇬🇧 English Introduction

**Christmas Memory** is a 3D interactive web application built as a special Christmas gift. It creates a magical digital space where memories are displayed as particles on a Christmas tree.

Users can interact with the scene using **Hand Gestures** (via webcam) to transform the tree into a heart shape, revealing cherished memories and a love anniversary counter.

### 🚀 Features

* **3D Particle System**: High-performance particle rendering representing a Christmas Tree and a Heart shape.
* **Hand Gesture Control**: Integrated with **MediaPipe** for real-time hand tracking.
    * 👌 **Pinch**: Gather particles into a Tree.
    * 🖐 **Open Hand**: Explode particles into a Heart.
* **Smart Photo Gallery**:
    * **Tree Mode**: Photos arranged in a perfect **Fibonacci Spiral**.
    * **Heart Mode**: Photos rearrange into a floating heart wall.
    * **Dynamic View**: Photos rotate intelligently to face the camera based on viewing angle.
* **Interactive Media**:
    * 🎵 **Music Player**: Upload multiple songs for a loop playlist.
    * 📸 **Photo Upload**: Drag & drop or select multiple photos to generate the gallery.
* **Love Timer**: Automatically calculates and displays the days since the anniversary.

### 🛠 Tech Stack

* **Core**: React, TypeScript, Vite
* **3D Engine**: Three.js, React Three Fiber
* **AI/CV**: MediaPipe (Tasks Vision)

### 💻 Getting Started

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/TheWind-upBird/christmas-memory.git](https://github.com/TheWind-upBird/christmas-memory.git)
    cd christmas-memory
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Run locally**
    ```bash
    npm run dev
    ```

---

## 🇨🇳 中文说明

[Go back to Top](#-christmas-memory---3d-interactive-experience)

**Christmas Memory** 这是一个基于 React 和 Three.js 开发的 3D 互动网页，也是一份特别的圣诞礼物。在这个魔法空间里，回忆化作粒子汇聚成圣诞树。

用户可以通过**手势控制**（摄像头识别），让圣诞树瞬间炸裂变成一颗爱心，展示珍贵的照片墙和恋爱纪念日计时。

### 🚀 核心功能

* **3D 粒子系统**：高性能渲染的圣诞树与爱心形态切换。
* **AI 手势识别**：集成 MediaPipe 实现实时手部追踪。
    * 👌 **捏合 (Pinch)**：粒子聚拢成圣诞树。
    * 🖐 **张开 (Open)**：粒子炸裂成爱心。
* **智能相册**：
    * **树模式**：照片按斐波那契螺旋完美排列。
    * **心模式**：照片重组为悬浮爱心墙。
    * **视角跟随**：无论从哪个角度观察，照片都会智能旋转面向你。
* **多媒体交互**：
    * 🎵 **音乐播放**：支持上传多首歌曲，自动循环播放。
    * 📸 **照片上传**：支持拖拽或多选上传自定义照片。
* **纪念日计时**：自动计算并显示恋爱天数（如 1192天）。

### 🛠 技术栈

* **核心框架**: React, TypeScript, Vite
* **3D 引擎**: Three.js, React Three Fiber (@react-three/fiber)
* **计算机视觉**: MediaPipe (Tasks Vision)

### 💻 如何运行

1.  **克隆仓库**
    ```bash
    git clone [https://github.com/TheWind-upBird/christmas-memory.git](https://github.com/TheWind-upBird/christmas-memory.git)
    cd christmas-memory
    ```
2.  **安装依赖**
    ```bash
    npm install
    ```
3.  **本地启动**
    ```bash
    npm run dev
    ```

---
*Project created by [TheWind-upBird](https://github.com/TheWind-upBird)*
