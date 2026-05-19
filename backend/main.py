from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import yt_dlp
import os
import uuid

app = FastAPI()

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_FOLDER = "downloads"

os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

# FORMAT COUNTS


def format_number(num):

    try:

        num = int(num)

        if num >= 1000000:
            return f"{num / 1000000:.1f}M"

        if num >= 1000:
            return f"{num / 1000:.1f}K"

        return str(num)

    except:
        return "N/A"


# HOME ROUTE


@app.get("/")
def home():

    return {"message": "YTDownloaderX Backend Running"}


# VIDEO INFO ROUTE


@app.get("/info")
def get_video_info(url: str):

    try:

        # SHORTS FIX

        if "shorts/" in url:
            url = url.replace("shorts/", "watch?v=")

        ydl_opts = {
            "quiet": True,
            "nocheckcertificate": True,
            "ignoreerrors": True,
            "no_warnings": True,
            "extract_flat": False,

            "http_headers": {
                "User-Agent": "Mozilla/5.0",
                "Accept-Language": "en-US,en;q=0.9",
            },

            "extractor_args": {
                "youtube": {
                    "skip": ["dash", "hls"],
                }
            }
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            info = ydl.extract_info(url, download=False)

            return {
                "title": info.get("title"),
                "thumbnail": info.get("thumbnail"),
                "channel": info.get("uploader"),
                "views": format_number(info.get("view_count", 0)),
                "likes": format_number(info.get("like_count", 0)),
                "subscribers": format_number(info.get("channel_follower_count", 0)),
            }

    except Exception as e:

        return {
            "error": str(e)
        }


# DOWNLOAD VIDEO


@app.get("/download")
def download_video(url: str, format_id: str = "best"):

    try:

        if "shorts/" in url:
            url = url.replace("shorts/", "watch?v=")

        unique_id = str(uuid.uuid4())

        output_path = os.path.join(
            DOWNLOAD_FOLDER,
            f"{unique_id}.mp4"
        )

        ydl_opts = {
            "format": "best",
            "outtmpl": output_path,
            "quiet": True,
            "nocheckcertificate": True,
            "http_headers": {
                "User-Agent": "Mozilla/5.0",
            }
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            ydl.download([url])

        return FileResponse(
            output_path,
            media_type="video/mp4",
            filename="video.mp4"
        )

    except Exception as e:

        return {
            "error": str(e)
        }


# DOWNLOAD AUDIO


@app.get("/audio")
def download_audio(url: str):

    try:

        if "shorts/" in url:
            url = url.replace("shorts/", "watch?v=")

        unique_id = str(uuid.uuid4())

        output_path = os.path.join(
            DOWNLOAD_FOLDER,
            f"{unique_id}.mp3"
        )

        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": output_path,
            "quiet": True,
            "nocheckcertificate": True,
            "http_headers": {
                "User-Agent": "Mozilla/5.0",
            },
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }]
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            ydl.download([url])

        return FileResponse(
            output_path,
            media_type="audio/mpeg",
            filename="audio.mp3"
        )

    except Exception as e:

        return {
            "error": str(e)
        }


# DOWNLOAD THUMBNAIL


@app.get("/thumbnail")
def download_thumbnail(url: str):

    try:

        if "shorts/" in url:
            url = url.replace("shorts/", "watch?v=")

        ydl_opts = {
            "quiet": True,
            "nocheckcertificate": True,
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:

            info = ydl.extract_info(url, download=False)

            thumbnail_url = info.get("thumbnail")

            return {
                "thumbnail": thumbnail_url
            }

    except Exception as e:

        return {
            "error": str(e)
        }