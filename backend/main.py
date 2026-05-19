from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

import yt_dlp
import os
import uuid
import requests

app = FastAPI()

# ------------------------------------------------
# CORS
# ------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOWNLOAD_DIR = "downloads"

os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# ------------------------------------------------
# YT-DLP OPTIONS
# ------------------------------------------------

COMMON_OPTIONS = {

    "quiet": True,

    "noplaylist": True,

    "extractor_args": {
        "youtube": {
            "player_client": [
                "web",
                "android",
                "tv"
            ]
        }
    }
}

# ------------------------------------------------
# VIDEO INFO
# ------------------------------------------------

@app.get("/info")
async def get_video_info(url: str):

    try:

        with yt_dlp.YoutubeDL(
            COMMON_OPTIONS
        ) as ydl:

            info = ydl.extract_info(
                url,
                download=False
            )

            formats = []

            added = set()

            for f in info.get(
                "formats",
                []
            ):

                height = f.get(
                    "height"
                )

                format_id = f.get(
                    "format_id"
                )

                vcodec = f.get(
                    "vcodec"
                )

                ext = f.get(
                    "ext"
                )

                if (

                    height

                    and

                    height >= 360

                    and

                    vcodec != "none"

                    and

                    ext in [
                        "mp4",
                        "webm"
                    ]
                ):

                    quality = (
                        f"{height}p"
                    )

                    if quality not in added:

                        added.add(
                            quality
                        )

                        formats.append({

                            "format_id":
                            format_id,

                            "quality":
                            quality
                        })

            formats = sorted(

                formats,

                key=lambda x:
                int(
                    x["quality"]
                    .replace("p", "")
                )
            )

            return {

                "title":
                info.get("title"),

                "thumbnail":
                info.get("thumbnail"),

                "duration":
                info.get("duration"),

                "channel":
                info.get("uploader"),

                "views":
                info.get("view_count"),

                "likes":
                info.get("like_count"),

                "subscribers":
                info.get(
                    "channel_follower_count"
                ),

                "formats":
                formats
            }

    except Exception as e:

        return JSONResponse(
            status_code=500,

            content={
                "error": str(e)
            }
        )

# ------------------------------------------------
# VIDEO DOWNLOAD
# ------------------------------------------------

@app.get("/download")
async def download_video(
    url: str,
    format_id: str
):

    try:

        unique_id = str(
            uuid.uuid4()
        )

        output_template = (
            f"{DOWNLOAD_DIR}/"
            f"{unique_id}.%(ext)s"
        )

        ydl_opts = {

            **COMMON_OPTIONS,

            "format":
            f"{format_id}+bestaudio/best",

            "merge_output_format":
            "mp4",

            "outtmpl":
            output_template,
        }

        with yt_dlp.YoutubeDL(
            ydl_opts
        ) as ydl:

            info = ydl.extract_info(
                url,
                download=True
            )

            downloaded_file = None

            for file in os.listdir(
                DOWNLOAD_DIR
            ):

                if file.startswith(
                    unique_id
                ):

                    downloaded_file = (
                        os.path.join(
                            DOWNLOAD_DIR,
                            file
                        )
                    )

                    break

            if not downloaded_file:

                raise Exception(
                    "Download failed"
                )

        return FileResponse(

            path=downloaded_file,

            filename=(
                f"{info.get('title')}.mp4"
            ),

            media_type="video/mp4"
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,

            content={
                "error": str(e)
            }
        )

# ------------------------------------------------
# AUDIO DOWNLOAD
# ------------------------------------------------

@app.get("/audio")
async def download_audio(
    url: str,
    quality: str = "320"
):

    try:

        unique_id = str(
            uuid.uuid4()
        )

        output_template = (
            f"{DOWNLOAD_DIR}/"
            f"{unique_id}.%(ext)s"
        )

        ydl_opts = {

            **COMMON_OPTIONS,

            "format":
            "bestaudio/best",

            "outtmpl":
            output_template,

            "postprocessors": [{

                "key":
                "FFmpegExtractAudio",

                "preferredcodec":
                "mp3",

                "preferredquality":
                quality,
            }],
        }

        with yt_dlp.YoutubeDL(
            ydl_opts
        ) as ydl:

            info = ydl.extract_info(
                url,
                download=True
            )

            audio_file = None

            for file in os.listdir(
                DOWNLOAD_DIR
            ):

                if file.startswith(
                    unique_id
                ):

                    audio_file = (
                        os.path.join(
                            DOWNLOAD_DIR,
                            file
                        )
                    )

                    break

            if not audio_file:

                raise Exception(
                    "Audio conversion failed"
                )

        return FileResponse(

            path=audio_file,

            filename=(
                f"{info.get('title')}.mp3"
            ),

            media_type="audio/mpeg"
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,

            content={
                "error": str(e)
            }
        )

# ------------------------------------------------
# THUMBNAIL DOWNLOAD
# ------------------------------------------------

@app.get("/thumbnail")
async def download_thumbnail(
    url: str
):

    try:

        with yt_dlp.YoutubeDL(
            COMMON_OPTIONS
        ) as ydl:

            info = ydl.extract_info(
                url,
                download=False
            )

            thumbnail_url = (
                info.get(
                    "thumbnail"
                )
            )

            response = requests.get(
                thumbnail_url
            )

            thumbnail_path = (
                os.path.join(
                    DOWNLOAD_DIR,
                    "thumbnail.jpg"
                )
            )

            with open(
                thumbnail_path,
                "wb"
            ) as f:

                f.write(
                    response.content
                )

        return FileResponse(

            path=thumbnail_path,

            filename=
            "thumbnail.jpg",

            media_type=
            "image/jpeg"
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,

            content={
                "error": str(e)
            }
        )