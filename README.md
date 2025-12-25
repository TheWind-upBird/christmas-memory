# 🎄 Christmas Memory - 3D Interactive Experience

[English](#english) | [中文](#chinese)

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Christmas+Memory+Preview" alt="Project Preview" width="100%" />
</div>

## ✨ Introduction (项目介绍)
灵感来源：清儿了个清（小红书ID:Youmihua888)

This is a 3D interactive web application built as a special Christmas gift. It creates a magical digital space where memories are displayed as particles on a Christmas tree.

Users can interact with the scene using **Hand Gestures** (via webcam) to transform the tree into a heart shape, revealing cherished memories and a love anniversary counter.

这是一个基于 React 和 Three.js 开发的 3D 互动网页，也是一份特别的圣诞礼物。在这个魔法空间里，回忆化作粒子汇聚成圣诞树。可以通过**手势控制**（摄像头识别），让圣诞树瞬间炸裂变成一颗爱心，展示珍贵的照片墙和恋爱纪念日计时。

## 🚀 Features (核心功能)

* **3D Particle System**: High-performance particle rendering representing a Christmas Tree and a Heart shape.
    * **3D 粒子系统**：高性能渲染的圣诞树与爱心形态切换。
* **Hand Gesture Control**: Integrated with **MediaPipe** for real-time hand tracking.
    * 👌 **Pinch (捏合)**: Gather particles into a Tree.
    * 🖐 **Open Hand (张开)**: Explode particles into a Heart.
    * **AI 手势识别**：通过摄像头捕捉手势，捏合聚拢成树，张开炸裂成心。
* **Smart Photo Gallery**:
    * **Tree Mode**: Photos arranged in a perfect **Fibonacci Spiral**.
    * **Heart Mode**: Photos rearrange into a floating heart wall.
    * **Dynamic View**: Photos rotate intelligently to face the camera based on viewing angle.
    * **智能相册**：支持斐波那契螺旋排列（树模式）和爱心墙排列（心模式），视角智能跟随。
* **Interactive Media**:
    * 🎵 **Music Player**: Upload multiple songs for a loop playlist.
    * 📸 **Photo Upload**: Drag & drop or select multiple photos to generate the gallery.
    * **多媒体交互**：支持多首背景音乐上传循环播放，支持自定义照片上传。
* **Love Timer**: Automatically calculates and displays the days since the anniversary (e.g., 2022.09.20).
    * **纪念日计时**：自动计算恋爱天数。

## 🛠 Tech Stack (技术栈)

* **Core**: React, TypeScript, Vite
* **3D Engine**: Three.js, React Three Fiber (@react-three/fiber)
* **AI/Computer Vision**: MediaPipe (Tasks Vision)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React

## 💻 Getting Started (如何运行)

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

4.  **Build for deployment**
    ```bash
    npm run build
    ```

## 🖱 Usage (使用指南)

1.  Click **"点亮属于我们的回忆"** to enter the scene.
2.  **Upload Photos**: Click the Image icon (top right) to select multiple photos.
3.  **Upload Music**: Click the Music icon to add your favorite songs.
4.  **Gesture Control**: Click the Camera icon to enable hand tracking.
    * Hold your hand up to the camera.
    * Pinch index finger and thumb to hold the tree.
    * Release to explode into a heart!
5.  **Focus Mode**: Click on any floating photo to bring it front and center.

## 🎁 Dedication

Built with ❤️ for Tong.
May our memories shine forever like these stars.

---

*Project created by [TheWind-upBird](https://github.com/TheWind-upBird)*
