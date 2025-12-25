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
    <title>ویدیو پلیر</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            background: #0f0f0f;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: #1a1a1a;
            padding: 30px;
            border-radius: 16px;
            width: 100%;
            max-width: 900px;
            border: 1px solid #333;
        }
        
        h1 {
            color: #fff;
            text-align: center;
            margin-bottom: 25px;
            font-weight: 500;
            font-size: 24px;
        }
        
        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        input {
            flex: 1;
            padding: 14px 18px;
            border: 1px solid #333;
            border-radius: 8px;
            background: #252525;
            color: #fff;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        
        input:focus {
            border-color: #e50914;
        }
        
        input::placeholder {
            color: #666;
        }
        
        button {
            padding: 14px 28px;
            background: #e50914;
            color: #fff;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            white-space: nowrap;
        }
        
        button:hover {
            background: #f40612;
            transform: scale(1.02);
        }
        
        button:disabled {
            background: #444;
            cursor: not-allowed;
            transform: none;
        }
        
        .progress-container {
            background: #252525;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            display: none;
        }
        
        .progress-container.show {
            display: block;
        }
        
        .progress-bar {
            height: 8px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #e50914, #ff6b6b);
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 4px;
        }
        
        .progress-text {
            color: #aaa;
            font-size: 13px;
            text-align: center;
        }
        
        .video-container {
            display: none;
            border-radius: 12px;
            overflow: hidden;
            background: #000;
        }
        
        .video-container.show {
            display: block;
        }
        
        video {
            width: 100%;
            display: block;
        }
        
        .status {
            color: #888;
            text-align: center;
            font-size: 13px;
            margin-top: 15px;
        }
        
        .status.error {
            color: #e50914;
        }
        
        .status.success {
            color: #46d369;
        }

        @media (max-width: 600px) {
            .input-group {
                flex-direction: column;
            }
            button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎬 ویدیو پلیر</h1>
        
        <div class="input-group">
            <input type="text" id="url" placeholder="لینک ویدیو را اینجا وارد کنید...">
            <button id="btn">پخش</button>
        </div>

        <div class="progress-container" id="progress">
            <div class="progress-bar">
                <div class="progress-fill" id="fill"></div>
            </div>
            <div class="progress-text" id="text">در حال دانلود... 0%</div>
        </div>

        <div class="video-container" id="player">
            <video id="video" controls></video>
        </div>

        <p class="status" id="status"></p>
    </div>

    <script>
        const url = document.getElementById('url');
        const btn = document.getElementById('btn');
        const progress = document.getElementById('progress');
        const fill = document.getElementById('fill');
        const text = document.getElementById('text');
        const player = document.getElementById('player');
        const video = document.getElementById('video');
        const status = document.getElementById('status');

        btn.onclick = async () => {
            if (!url.value.trim()) {
                status.textContent = 'لطفاً لینک را وارد کنید';
                status.className = 'status error';
                return;
            }

            btn.disabled = true;
            btn.textContent = 'صبر کنید...';
            progress.classList.add('show');
            player.classList.remove('show');
            status.textContent = '';
            fill.style.width = '0%';

            try {
                const res = await fetch('/download', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: url.value.trim() })
                });

                const data = await res.json();

                if (data.error) {
                    status.textContent = data.error;
                    status.className = 'status error';
                    reset();
                    return;
                }

                checkProgress(data.id);

            } catch (e) {
                status.textContent = 'خطا در اتصال به سرور';
                status.className = 'status error';
                reset();
            }
        };

        function checkProgress(id) {
            const interval = setInterval(async () => {
                try {
                    const res = await fetch('/status/' + id);
                    const data = await res.json();

                    fill.style.width = data.progress + '%';
                    text.textContent = 'در حال دانلود... ' + data.progress + '%';

                    if (data.done) {
                        clearInterval(interval);
                        progress.classList.remove('show');
                        player.classList.add('show');
                        video.src = '/stream/' + id;
                        video.play();
                        status.textContent = 'آماده پخش ✓';
                        status.className = 'status success';
                        reset();
                    }

                    if (data.error) {
                        clearInterval(interval);
                        status.textContent = 'خطا در دانلود';
                        status.className = 'status error';
                        reset();
                    }
                } catch (e) {
                    clearInterval(interval);
                }
            }, 300);
        }

        function reset() {
            btn.disabled = false;
            btn.textContent = 'پخش';
        }

        url.onkeypress = (e) => {
            if (e.key === 'Enter') btn.click();
        };
    </script>
</body>
</html>
    `);
});

// ذخیره موقت دانلودها (در RAM)
const downloads = new Map();

// شروع دانلود
app.post("/download", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.json({ error: "لینک وارد نشده" });
  }

  const id = Date.now().toString();
  const chunks = [];
  let totalSize = 0;
  let downloaded = 0;

  downloads.set(id, {
    chunks,
    progress: 0,
    done: false,
    error: false,
    contentType: "video/mp4",
  });

  const protocol = url.startsWith("https") ? https : http;

  const request = protocol
    .get(url, (response) => {
      totalSize = parseInt(response.headers["content-length"], 10) || 0;

      const contentType = response.headers["content-type"];
      if (contentType) {
        downloads.get(id).contentType = contentType;
      }

      response.on("data", (chunk) => {
        chunks.push(chunk);
        downloaded += chunk.length;
        if (totalSize > 0) {
          downloads.get(id).progress = Math.round(
            (downloaded / totalSize) * 100
          );
        }
      });

      response.on("end", () => {
        const dl = downloads.get(id);
        dl.done = true;
        dl.progress = 100;
        dl.buffer = Buffer.concat(chunks);
        dl.chunks = null;

        // پاک کردن بعد از 10 دقیقه
        setTimeout(() => downloads.delete(id), 10 * 60 * 1000);
      });
    })
    .on("error", () => {
      downloads.get(id).error = true;
    });

  request.setTimeout(60000, () => {
    request.destroy();
    downloads.get(id).error = true;
  });

  res.json({ id });
});

// وضعیت دانلود
app.get("/status/:id", (req, res) => {
  const dl = downloads.get(req.params.id);
  if (!dl) {
    return res.json({ error: true });
  }
  res.json({
    progress: dl.progress,
    done: dl.done,
    error: dl.error,
  });
});

// پخش ویدیو
app.get("/stream/:id", (req, res) => {
  const dl = downloads.get(req.params.id);

  if (!dl || !dl.buffer) {
    return res.status(404).send("Not found");
  }

  const size = dl.buffer.length;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": dl.contentType,
    });

    res.end(dl.buffer.slice(start, end + 1));
  } else {
    res.writeHead(200, {
      "Content-Length": size,
      "Content-Type": dl.contentType,
    });
    res.end(dl.buffer);
  }
});

app.listen(PORT, () => {
  console.log("🚀 http://localhost:" + PORT);
});
