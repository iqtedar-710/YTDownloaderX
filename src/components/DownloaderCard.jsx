import { useState } from "react";

import { motion } from "framer-motion";

import {
  fetchVideoInfo,
  downloadVideo,
  downloadAudio,
  downloadThumbnail,
} from "../services/youtubeApi";

export default function DownloaderCard() {

  const [url, setUrl] = useState("");

  const [videoInfo, setVideoInfo] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [selectedQuality,
    setSelectedQuality] =
    useState("");

  const [audioQuality,
    setAudioQuality] =
    useState("");

  const handleFetch = async () => {

    if (!url) {

      setError(
        "Please enter YouTube URL."
      );

      return;
    }

    try {

      setLoading(true);

      setError("");

      const data =
        await fetchVideoInfo(url);

      setVideoInfo(data);

    } catch {

      setError(
        "Failed to fetch video information."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <section className="
      relative
      py-32
      px-6
    ">

      <div className="
        absolute
        top-0
        left-0
        w-[400px]
        h-[400px]
        bg-purple-500/20
        rounded-full
        blur-[120px]
      " />

      <div className="
        absolute
        bottom-0
        right-0
        w-[400px]
        h-[400px]
        bg-cyan-500/20
        rounded-full
        blur-[120px]
      " />

      <motion.div

        initial={{
          opacity: 0,
          y: 50
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          bg-white/5
          border
          border-white/10
          rounded-[40px]
          p-8
          md:p-14
          backdrop-blur-xl
          shadow-2xl
        "
      >

        <div className="text-center">

          <h1 className="
            text-5xl
            md:text-7xl
            font-black
            bg-gradient-to-r
            from-purple-400
            via-pink-400
            to-cyan-400
            bg-clip-text
            text-transparent
          ">
            YTDownloaderX
          </h1>

          <p className="
            mt-6
            text-zinc-400
            text-lg
            max-w-2xl
            mx-auto
          ">
            Premium AI-powered YouTube
            downloader SaaS platform.
          </p>

        </div>

        <div className="
          flex
          flex-col
          lg:flex-row
          gap-5
          mt-14
        ">

          <input
            type="text"

            placeholder="
              Paste YouTube URL...
            "

            value={url}

            onChange={(e) =>
              setUrl(e.target.value)
            }

            className="
              flex-1
              bg-[#0b1120]
              border
              border-purple-500/20
              rounded-2xl
              px-6
              py-5
              text-white
              outline-none
            "
          />

          <button

            onClick={handleFetch}

            className="
              px-10
              py-5
              rounded-2xl
              bg-purple-600
              hover:bg-purple-500
              transition
              text-white
              font-semibold
            "
          >

            {
              loading
              ? "Fetching..."
              : "Fetch Video"
            }

          </button>

        </div>

        {error && (

          <div className="
            text-red-400
            text-center
            mt-5
          ">
            {error}
          </div>

        )}

        {videoInfo && (

          <div className="mt-16">

            <img
              src={videoInfo.thumbnail}
              alt=""
              className="
                w-full
                rounded-3xl
                shadow-2xl
              "
            />

            <h2 className="
              text-4xl
              font-bold
              mt-8
            ">
              {videoInfo.title}
            </h2>

            <div className="
              grid
              md:grid-cols-2
              lg:grid-cols-4
              gap-5
              mt-8
            ">

              <div className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-5
              ">
                <p className="text-zinc-400">
                  Channel
                </p>

                <p className="mt-2 font-semibold">
                  {videoInfo.channel || "Unavailable"}
                </p>
              </div>

              <div className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-5
              ">
                <p className="text-zinc-400">
                  Views
                </p>

                <p className="mt-2 font-semibold">
                  {
                    videoInfo.views
                    ?.toLocaleString()
                    || "Unavailable"
                  }
                </p>
              </div>

              <div className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-5
              ">
                <p className="text-zinc-400">
                  Likes
                </p>

                <p className="mt-2 font-semibold">
                  {
                    videoInfo.likes
                    ?.toLocaleString()
                    || "Hidden"
                  }
                </p>
              </div>

              <div className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-5
              ">
                <p className="text-zinc-400">
                  Subscribers
                </p>

                <p className="mt-2 font-semibold">
                  {
                    videoInfo.subscribers
                    ?.toLocaleString()
                    || "Unavailable"
                  }
                </p>
              </div>

            </div>

            <div className="
              grid
              lg:grid-cols-2
              gap-8
              mt-12
            ">

              <div className="
                bg-white/5
                border
                border-purple-500/20
                rounded-3xl
                p-8
              ">

                <h3 className="
                  text-3xl
                  font-bold
                  text-purple-400
                  mb-6
                ">
                  Video Downloader
                </h3>

                <select

                  onChange={(e) =>
                    setSelectedQuality(
                      e.target.value
                    )
                  }

                  className="
                    w-full
                    bg-[#0b1120]
                    border
                    border-purple-500/20
                    rounded-2xl
                    px-5
                    py-4
                    text-white
                  "
                >

                  <option value="">
                    Select Resolution
                  </option>

                  {videoInfo.formats.map(
                    (format) => (

                    <option
                      key={format.format_id}
                      value={format.format_id}
                    >
                      {format.quality}
                    </option>

                  ))}

                </select>

                <button

                  onClick={() => {

                    if (!selectedQuality) {

                      alert(
                        "Please select resolution."
                      );

                      return;
                    }

                    downloadVideo(
                      url,
                      selectedQuality
                    );
                  }}

                  className="
                    w-full
                    mt-6
                    px-8
                    py-5
                    rounded-2xl
                    bg-purple-600
                    hover:bg-purple-500
                    transition
                    text-white
                    font-semibold
                  "
                >
                  Download Video
                </button>

              </div>

              <div className="
                bg-white/5
                border
                border-cyan-500/20
                rounded-3xl
                p-8
              ">

                <h3 className="
                  text-3xl
                  font-bold
                  text-cyan-400
                  mb-6
                ">
                  Audio Downloader
                </h3>

                <select

                  value={audioQuality}

                  onChange={(e) =>
                    setAudioQuality(
                      e.target.value
                    )
                  }

                  className="
                    w-full
                    bg-[#0b1120]
                    border
                    border-cyan-500/20
                    rounded-2xl
                    px-5
                    py-4
                    text-white
                  "
                >

                  <option value="">
                    Select Audio Quality
                  </option>

                  <option value="64">
                    64 kbps
                  </option>

                  <option value="128">
                    128 kbps
                  </option>

                  <option value="192">
                    192 kbps
                  </option>

                  <option value="256">
                    256 kbps
                  </option>

                  <option value="320">
                    320 kbps
                  </option>

                </select>

                <button

                  onClick={() => {

                    if (!audioQuality) {

                      alert(
                        "Please select audio quality."
                      );

                      return;
                    }

                    downloadAudio(
                      url,
                      audioQuality
                    );
                  }}

                  className="
                    w-full
                    mt-6
                    px-8
                    py-5
                    rounded-2xl
                    bg-cyan-500
                    hover:bg-cyan-400
                    transition
                    text-black
                    font-semibold
                  "
                >
                  Download Audio
                </button>

              </div>

            </div>

            <button

              onClick={() =>
                downloadThumbnail(url)
              }

              className="
                w-full
                mt-10
                px-8
                py-5
                rounded-2xl
                bg-white/5
                hover:bg-white/10
                border
                border-white/10
                transition
                text-white
                font-semibold
              "
            >
              Download Thumbnail
            </button>

          </div>

        )}

      </motion.div>

    </section>
  );
}