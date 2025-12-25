import express from "express";
import https from "https";
import http from "http";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// صفحه اصلی
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgaPlayer | پخش کننده ویدیو</title>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #8b5cf6;
            --accent: #06b6d4;
            --success: #10b981;
            --error: #ef4444;
            --warning: #f59e0b;
            --bg-dark: #030014;
            --bg-card: rgba(15, 10, 40, 0.7);
            --glass: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text: #f8fafc;
            --text-muted: #94a3b8;
        }
        
        body {
            font-family: 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif;
            background: var(--bg-dark);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            overflow-x: hidden;
            position: relative;
        }
        
        /* Animated Background */
        .bg-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        }
        
        .bg-animation::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: 
                radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 40%),
                radial-gradient(circle at 90% 90%, rgba(168, 85, 247, 0.12) 0%, transparent 40%);
            animation: bgMove 20s ease-in-out infinite;
        }
        
        @keyframes bgMove {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-5%, 5%) rotate(5deg); }
            50% { transform: translate(5%, -5%) rotate(-5deg); }
            75% { transform: translate(-3%, -3%) rotate(3deg); }
        }
        
        /* Floating Orbs */
        .orb {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            animation: float 15s ease-in-out infinite;
            z-index: -1;
        }
        
        .orb-1 {
            width: 400px;
            height: 400px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            top: -100px;
            right: -100px;
            opacity: 0.3;
        }
        
        .orb-2 {
            width: 300px;
            height: 300px;
            background: linear-gradient(135deg, #06b6d4, #8b5cf6);
            bottom: -50px;
            left: -50px;
            opacity: 0.25;
            animation-delay: -5s;
        }
        
        .orb-3 {
            width: 250px;
            height: 250px;
            background: linear-gradient(135deg, #a855f7, #6366f1);
            top: 50%;
            left: 50%;
            opacity: 0.2;
            animation-delay: -10s;
        }
        
        @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(30px, -30px) scale(1.05); }
            50% { transform: translate(-20px, 20px) scale(0.95); }
            75% { transform: translate(20px, 10px) scale(1.02); }
        }
        
        /* Stars */
        .stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
                radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.4), transparent),
                radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.3), transparent),
                radial-gradient(1px 1px at 230px 80px, rgba(255,255,255,0.2), transparent),
                radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.3), transparent),
                radial-gradient(1px 1px at 400px 60px, rgba(255,255,255,0.4), transparent),
                radial-gradient(2px 2px at 500px 200px, rgba(255,255,255,0.2), transparent);
            background-size: 550px 200px;
            animation: starsMove 100s linear infinite;
        }
        
        @keyframes starsMove {
            from { background-position: 0 0; }
            to { background-position: 550px 200px; }
        }
        
        /* Main Container */
        .container {
            background: var(--bg-card);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            padding: clamp(25px, 5vw, 50px);
            border-radius: clamp(20px, 3vw, 32px);
            width: 100%;
            max-width: min(95vw, 1200px);
            border: 1px solid var(--glass-border);
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                0 -20px 40px -20px rgba(99, 102, 241, 0.1) inset;
            position: relative;
            overflow: hidden;
        }
        
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        }
        
        /* Logo & Title */
        .header {
            text-align: center;
            margin-bottom: clamp(25px, 4vw, 40px);
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .logo-icon {
            width: clamp(50px, 8vw, 80px);
            height: clamp(50px, 8vw, 80px);
            background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: clamp(24px, 4vw, 40px);
            box-shadow: 
                0 10px 40px rgba(99, 102, 241, 0.4),
                0 0 0 1px rgba(255,255,255,0.1) inset;
            animation: pulse 3s ease-in-out infinite;
            position: relative;
        }
        
        .logo-icon::after {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: 23px;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            z-index: -1;
            opacity: 0.5;
            filter: blur(15px);
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        h1 {
            color: var(--text);
            font-weight: 800;
            font-size: clamp(28px, 5vw, 48px);
            letter-spacing: -1px;
            margin-bottom: 8px;
        }
        
        h1 span {
            background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            color: var(--text-muted);
            font-size: clamp(14px, 2vw, 18px);
            font-weight: 400;
        }
        
        /* Input Group */
        .input-wrapper {
            position: relative;
            margin-bottom: clamp(20px, 3vw, 30px);
        }
        
        .input-group {
            display: flex;
            gap: clamp(10px, 2vw, 15px);
            flex-wrap: wrap;
        }
        
        .input-container {
            flex: 1;
            min-width: 250px;
            position: relative;
        }
        
        .input-container::before {
            content: '🔗';
            position: absolute;
            left: auto;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
            z-index: 1;
            opacity: 0.5;
        }
        
        input {
            width: 100%;
            padding: clamp(16px, 2.5vw, 22px) clamp(20px, 3vw, 28px);
            padding-right: 55px;
            border: 2px solid var(--glass-border);
            border-radius: clamp(14px, 2vw, 18px);
            background: rgba(0, 0, 0, 0.3);
            color: var(--text);
            font-size: clamp(15px, 2vw, 18px);
            font-family: inherit;
            outline: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        input:focus {
            border-color: var(--primary);
            background: rgba(99, 102, 241, 0.1);
            box-shadow: 
                0 0 0 4px rgba(99, 102, 241, 0.15),
                0 10px 40px rgba(99, 102, 241, 0.2);
        }
        
        input::placeholder {
            color: var(--text-muted);
            opacity: 0.7;
        }
        
        /* Button */
        .btn {
            padding: clamp(16px, 2.5vw, 22px) clamp(30px, 5vw, 50px);
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border: none;
            border-radius: clamp(14px, 2vw, 18px);
            cursor: pointer;
            font-size: clamp(15px, 2vw, 18px);
            font-weight: 700;
            font-family: inherit;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            position: relative;
            overflow: hidden;
            min-width: clamp(120px, 20vw, 180px);
        }
        
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.6s;
        }
        
        .btn:hover::before {
            left: 100%;
        }
        
        .btn:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 
                0 20px 40px rgba(99, 102, 241, 0.4),
                0 0 60px rgba(139, 92, 246, 0.3);
        }
        
        .btn:active {
            transform: translateY(-1px) scale(0.98);
        }
        
        .btn:disabled {
            background: linear-gradient(135deg, #374151, #1f2937);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .btn-icon {
            font-size: 1.2em;
            transition: transform 0.3s;
        }
        
        .btn:hover .btn-icon {
            transform: scale(1.2);
        }
        
        /* Loader */
        .loader {
            display: none;
            justify-content: center;
            align-items: center;
            padding: clamp(30px, 5vw, 60px);
            flex-direction: column;
            gap: 20px;
        }
        
        .loader.show {
            display: flex;
        }
        
        .spinner-container {
            position: relative;
            width: clamp(60px, 10vw, 100px);
            height: clamp(60px, 10vw, 100px);
        }
        
        .spinner {
            width: 100%;
            height: 100%;
            border: 4px solid rgba(99, 102, 241, 0.1);
            border-radius: 50%;
            position: absolute;
        }
        
        .spinner-1 {
            border-top-color: var(--primary);
            animation: spin 1s linear infinite;
        }
        
        .spinner-2 {
            border-right-color: var(--secondary);
            animation: spin 1.5s linear infinite reverse;
            width: 80%;
            height: 80%;
            top: 10%;
            left: 10%;
        }
        
        .spinner-3 {
            border-bottom-color: var(--accent);
            animation: spin 2s linear infinite;
            width: 60%;
            height: 60%;
            top: 20%;
            left: 20%;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .loader-text {
            color: var(--text-muted);
            font-size: clamp(14px, 2vw, 16px);
            animation: fadeInOut 1.5s ease-in-out infinite;
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        /* Video Container */
        .video-container {
            display: none;
            border-radius: clamp(16px, 2.5vw, 24px);
            overflow: hidden;
            background: #000;
            box-shadow: 
                0 25px 60px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255,255,255,0.05);
            position: relative;
            animation: videoIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes videoIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .video-container.show {
            display: block;
        }
        
        .video-container::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 2px;
            background: linear-gradient(135deg, var(--primary), var(--accent), var(--secondary));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
            opacity: 0.5;
        }
        
        video {
            width: 100%;
            display: block;
            max-height: 70vh;
            object-fit: contain;
            background: #000;
        }
        
        /* Status */
        .status {
            text-align: center;
            font-size: clamp(14px, 2vw, 16px);
            margin-top: clamp(15px, 3vw, 25px);
            min-height: 24px;
            padding: 12px 20px;
            border-radius: 12px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .status:empty {
            display: none;
        }
        
        .status.error {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
        }
        
        .status.success {
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: #6ee7b7;
        }
        
        .status.loading {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            color: #fcd34d;
        }
        
        /* Features */
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(clamp(150px, 25vw, 200px), 1fr));
            gap: clamp(12px, 2vw, 20px);
            margin-top: clamp(25px, 4vw, 40px);
        }
        
        .feature {
            background: var(--glass);
            border: 1px solid var(--glass-border);
            border-radius: clamp(12px, 2vw, 16px);
            padding: clamp(15px, 2.5vw, 25px);
            text-align: center;
            transition: all 0.3s;
        }
        
        .feature:hover {
            background: rgba(99, 102, 241, 0.1);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-5px);
        }
        
        .feature-icon {
            font-size: clamp(28px, 4vw, 40px);
            margin-bottom: 10px;
            display: block;
        }
        
        .feature-text {
            color: var(--text-muted);
            font-size: clamp(12px, 1.5vw, 14px);
            font-weight: 500;
        }
        
        /* Footer */
        .footer {
            margin-top: clamp(30px, 5vw, 50px);
            text-align: center;
            padding-top: clamp(20px, 3vw, 30px);
            border-top: 1px solid var(--glass-border);
        }
        
        .credit {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: clamp(12px, 2vw, 18px) clamp(25px, 4vw, 40px);
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
            border: 1px solid rgba(99, 102, 241, 0.2);
            border-radius: 100px;
            color: var(--text);
            font-size: clamp(14px, 2vw, 18px);
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .credit:hover {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
            transform: scale(1.05);
            box-shadow: 0 10px 40px rgba(99, 102, 241, 0.3);
        }
        
        .credit-icon {
            font-size: 1.3em;
            animation: heartBeat 1.5s ease-in-out infinite;
        }
        
        @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .credit-name {
            background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
        }
        
        /* Keyboard Hint */
        .hint {
            color: var(--text-muted);
            font-size: clamp(11px, 1.5vw, 13px);
            margin-top: 15px;
            opacity: 0.6;
        }
        
        .kbd {
            background: var(--glass);
            border: 1px solid var(--glass-border);
            padding: 4px 10px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 0.9em;
        }

        /* ==================== RESPONSIVE DESIGN ==================== */
        
        /* Mobile - Small (320px - 480px) */
        @media (max-width: 480px) {
            body {
                padding: 10px;
            }
            
            .container {
                padding: 20px 15px;
                border-radius: 16px;
            }
            
            .input-group {
                flex-direction: column;
            }
            
            .input-container {
                min-width: 100%;
            }
            
            .btn {
                width: 100%;
            }
            
            .features {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .orb-1, .orb-2, .orb-3 {
                display: none;
            }
            
            .logo-icon {
                width: 50px;
                height: 50px;
                font-size: 24px;
                border-radius: 14px;
            }
            
            h1 {
                font-size: 24px;
            }
            
            video {
                max-height: 50vh;
            }
        }
        
        /* Mobile - Medium (481px - 767px) */
        @media (min-width: 481px) and (max-width: 767px) {
            .features {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        /* Tablet (768px - 1024px) */
        @media (min-width: 768px) and (max-width: 1024px) {
            .container {
                max-width: 90vw;
            }
            
            .features {
                grid-template-columns: repeat(4, 1fr);
            }
        }
        
        /* Laptop (1025px - 1440px) */
        @media (min-width: 1025px) and (max-width: 1440px) {
            .container {
                max-width: 900px;
            }
        }
        
        /* Desktop (1441px - 1920px) */
        @media (min-width: 1441px) and (max-width: 1920px) {
            .container {
                max-width: 1000px;
                padding: 50px;
            }
            
            h1 {
                font-size: 42px;
            }
            
            input, .btn {
                padding: 22px 35px;
                font-size: 18px;
            }
        }
        
        /* Large TV (1921px - 2560px / 4K) */
        @media (min-width: 1921px) and (max-width: 2560px) {
            body {
                padding: 40px;
            }
            
            .container {
                max-width: 1400px;
                padding: 70px;
                border-radius: 40px;
            }
            
            h1 {
                font-size: 56px;
            }
            
            .subtitle {
                font-size: 22px;
            }
            
            .logo-icon {
                width: 100px;
                height: 100px;
                font-size: 50px;
                border-radius: 28px;
            }
            
            input {
                padding: 28px 40px;
                font-size: 22px;
                border-radius: 22px;
            }
            
            .btn {
                padding: 28px 60px;
                font-size: 22px;
                border-radius: 22px;
            }
            
            .features {
                gap: 25px;
                margin-top: 50px;
            }
            
            .feature {
                padding: 35px;
                border-radius: 24px;
            }
            
            .feature-icon {
                font-size: 50px;
            }
            
            .feature-text {
                font-size: 18px;
            }
            
            .credit {
                padding: 25px 50px;
                font-size: 22px;
            }
            
            video {
                max-height: 75vh;
            }
            
            .video-container {
                border-radius: 32px;
            }
        }
        
        /* Extra Large TV / 86 inch (2561px+) */
        @media (min-width: 2561px) {
            body {
                padding: 60px;
            }
            
            .container {
                max-width: 1800px;
                padding: 100px;
                border-radius: 50px;
            }
            
            h1 {
                font-size: 72px;
                letter-spacing: -2px;
            }
            
            .subtitle {
                font-size: 28px;
            }
            
            .logo-icon {
                width: 130px;
                height: 130px;
                font-size: 65px;
                border-radius: 35px;
            }
            
            .logo {
                gap: 25px;
                margin-bottom: 25px;
            }
            
            input {
                padding: 35px 50px;
                padding-right: 80px;
                font-size: 28px;
                border-radius: 28px;
                border-width: 3px;
            }
            
            .input-container::before {
                font-size: 32px;
                right: 30px;
            }
            
            .btn {
                padding: 35px 80px;
                font-size: 28px;
                border-radius: 28px;
                min-width: 250px;
            }
            
            .btn-icon {
                font-size: 1.4em;
            }
            
            .input-group {
                gap: 25px;
            }
            
            .spinner-container {
                width: 120px;
                height: 120px;
            }
            
            .loader-text {
                font-size: 24px;
            }
            
            .features {
                gap: 35px;
                margin-top: 70px;
            }
            
            .feature {
                padding: 50px;
                border-radius: 30px;
            }
            
            .feature-icon {
                font-size: 70px;
                margin-bottom: 20px;
            }
            
            .feature-text {
                font-size: 24px;
            }
            
            .footer {
                margin-top: 70px;
                padding-top: 50px;
            }
            
            .credit {
                padding: 35px 70px;
                font-size: 28px;
                border-radius: 100px;
            }
            
            .credit-icon {
                font-size: 1.5em;
            }
            
            .hint {
                font-size: 20px;
                margin-top: 25px;
            }
            
            .kbd {
                padding: 8px 16px;
                font-size: 18px;
            }
            
            video {
                max-height: 80vh;
            }
            
            .video-container {
                border-radius: 40px;
            }
            
            .status {
                font-size: 22px;
                padding: 20px 30px;
                border-radius: 18px;
            }
            
            .orb-1 {
                width: 600px;
                height: 600px;
            }
            
            .orb-2 {
                width: 500px;
                height: 500px;
            }
            
            .orb-3 {
                width: 400px;
                height: 400px;
            }
        }

        /* Landscape Mobile */
        @media (max-height: 500px) and (orientation: landscape) {
            body {
                padding: 10px;
            }
            
            .container {
                padding: 20px;
            }
            
            .header {
                margin-bottom: 15px;
            }
            
            .logo {
                margin-bottom: 5px;
            }
            
            .logo-icon {
                width: 40px;
                height: 40px;
                font-size: 20px;
            }
            
            h1 {
                font-size: 22px;
            }
            
            .subtitle {
                display: none;
            }
            
            .features {
                display: none;
            }
            
            .footer {
                margin-top: 15px;
                padding-top: 15px;
            }
            
            video {
                max-height: 40vh;
            }
        }
        
        /* High DPI / Retina displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .spinner {
                border-width: 3px;
            }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Dark mode optimization */
        @media (prefers-color-scheme: dark) {
            :root {
                color-scheme: dark;
            }
        }
    </style>
</head>
<body>
    <div class="bg-animation"></div>
    <div class="stars"></div>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    
    <div class="container">
        <header class="header">
            <div class="logo">
                <div class="logo-icon">▶️</div>
            </div>
            <h1><span>AgaPlayer</span></h1>
            <p class="subtitle">پخش کننده ویدیو آنلاین با کیفیت بالا</p>
        </header>
        
        <div class="input-wrapper">
            <div class="input-group">
                <div class="input-container">
                    <input type="text" id="url" placeholder="لینک ویدیو را اینجا وارد کنید..." autocomplete="off" spellcheck="false">
                </div>
                <button class="btn" id="btn">
                    <span class="btn-icon">▶</span>
                    <span>پخش ویدیو</span>
                </button>
            </div>
        </div>

        <div class="loader" id="loader">
            <div class="spinner-container">
                <div class="spinner spinner-1"></div>
                <div class="spinner spinner-2"></div>
                <div class="spinner spinner-3"></div>
            </div>
            <span class="loader-text">در حال بارگذاری ویدیو...</span>
        </div>

        <div class="video-container" id="player">
            <video id="video" controls playsinline></video>
        </div>

        <div class="status" id="status"></div>
        
        <div class="features">
            <div class="feature">
                <span class="feature-icon">⚡</span>
                <span class="feature-text">استریم سریع</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🎬</span>
                <span class="feature-text">کیفیت بالا</span>
            </div>
            <div class="feature">
                <span class="feature-icon">📱</span>
                <span class="feature-text">همه دستگاه‌ها</span>
            </div>
            <div class="feature">
                <span class="feature-icon">🔒</span>
                <span class="feature-text">امن و خصوصی</span>
            </div>
        </div>
        
        <footer class="footer">
            <div class="credit">
                <span class="credit-icon">💜</span>
                <span>توسط</span>
                <span class="credit-name">آقادنی</span>
            </div>
            <p class="hint">برای پخش کلید <span class="kbd">Enter</span> را فشار دهید</p>
        </footer>
    </div>

    <script>
        const urlInput = document.getElementById('url');
        const btn = document.getElementById('btn');
        const loader = document.getElementById('loader');
        const player = document.getElementById('player');
        const video = document.getElementById('video');
        const status = document.getElementById('status');

        function setStatus(message, type) {
            status.innerHTML = message;
            status.className = 'status ' + type;
        }

        btn.onclick = () => {
            const url = urlInput.value.trim();
            
            if (!url) {
                setStatus('⚠️ لطفاً لینک ویدیو را وارد کنید', 'error');
                urlInput.focus();
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<span class="btn-icon">⏳</span><span>صبر کنید...</span>';
            loader.classList.add('show');
            player.classList.remove('show');
            setStatus('🔄 در حال اتصال به سرور...', 'loading');

            const streamUrl = '/stream?url=' + encodeURIComponent(url);
            
            video.src = streamUrl;
            
            video.onloadeddata = () => {
                loader.classList.remove('show');
                player.classList.add('show');
                setStatus('✅ آماده پخش', 'success');
                btn.disabled = false;
                btn.innerHTML = '<span class="btn-icon">▶</span><span>پخش ویدیو</span>';
                video.play().catch(() => {});
            };
            
            video.onwaiting = () => {
                setStatus('⏳ در حال بافر کردن...', 'loading');
            };
            
            video.onplaying = () => {
                setStatus('▶️ در حال پخش', 'success');
            };
            
            video.onerror = () => {
                loader.classList.remove('show');
                setStatus('❌ خطا در بارگذاری ویدیو - لینک را بررسی کنید', 'error');
                btn.disabled = false;
                btn.innerHTML = '<span class="btn-icon">▶</span><span>پخش ویدیو</span>';
            };
        };

        urlInput.onkeypress = (e) => {
            if (e.key === 'Enter') btn.click();
        };
        
        // Clear status on input
        urlInput.oninput = () => {
            if (status.classList.contains('error')) {
                status.innerHTML = '';
                status.className = 'status';
            }
        };
        
        // Auto focus
        urlInput.focus();
    </script>
</body>
</html>
    `);
});

// استریم مستقیم ویدیو (بدون ذخیره در RAM)
app.get("/stream", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("URL required");
  }

  const protocol = url.startsWith("https") ? https : http;

  const options = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  };

  if (req.headers.range) {
    options.headers.Range = req.headers.range;
  }

  const request = protocol
    .get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        return res.redirect("/stream?url=" + encodeURIComponent(redirectUrl));
      }

      const headers = {
        "Content-Type": response.headers["content-type"] || "video/mp4",
        "Accept-Ranges": "bytes",
      };

      if (response.headers["content-length"]) {
        headers["Content-Length"] = response.headers["content-length"];
      }

      if (response.headers["content-range"]) {
        headers["Content-Range"] = response.headers["content-range"];
      }

      res.writeHead(response.statusCode, headers);
      response.pipe(res);

      req.on("close", () => {
        response.destroy();
      });
    })
    .on("error", (err) => {
      console.error("Stream error:", err.message);
      if (!res.headersSent) {
        res.status(500).send("Error streaming video");
      }
    });

  request.setTimeout(30000, () => {
    request.destroy();
    if (!res.headersSent) {
      res.status(504).send("Timeout");
    }
  });
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
